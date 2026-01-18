import requests
import logging
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import PyPDF2
from typing import List, Dict, Any, Generator
import os

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.ollama_base_url = "http://localhost:11434"
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.chroma_client.get_or_create_collection(name="fidera_docs")
        
        # Initialize Embeddings Model (lazy load suggested, but we do it here for simplicity)
        try:
            logger.info("Loading Embedding Model (all-MiniLM-L6-v2)...")
            self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Embedding Model Loaded.")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            self.embed_model = None

    def check_ollama(self) -> bool:
        """Check if Ollama is running."""
        try:
            res = requests.get(f"{self.ollama_base_url}/")
            return res.status_code == 200
        except:
            return False

    def get_available_models(self) -> List[str]:
        """Fetch available models from local Ollama."""
        try:
            res = requests.get(f"{self.ollama_base_url}/api/tags")
            if res.status_code == 200:
                data = res.json()
                return [model["name"] for model in data.get("models", [])]
        except Exception as e:
            logger.error(f"Failed to fetch Ollama models: {e}")
        return []

    def embed_document(self, file_id: str, file_path: str) -> bool:
        """
        Ingest a document: Extract -> Chunk -> Embed -> Store.
        """
        if not self.embed_model:
            logger.error("Embedding model not loaded.")
            return False

        try:
            text = ""
            # Extract Text (Simple PDF extraction)
            if file_path.lower().endswith(".pdf"):
                with open(file_path, "rb") as f:
                    pdf = PyPDF2.PdfReader(f)
                    for page in pdf.pages:
                        text += page.extract_text() + "\n"
            else:
                # TODO: Support text/docx
                return False

            if not text.strip():
                logger.warning(f"No text extracted from {file_id}")
                return False

            # Chunking (Simple 1000 char chunks with overlap)
            chunk_size = 1000
            overlap = 100
            chunks = []
            for i in range(0, len(text), chunk_size - overlap):
                chunks.append(text[i:i + chunk_size])

            # Embed
            embeddings = self.embed_model.encode(chunks)
            
            # Store in Chroma
            ids = [f"{file_id}_{i}" for i in range(len(chunks))]
            metadatas = [{"file_id": str(file_id), "chunk_index": i} for i in range(len(chunks))]
            
            self.collection.add(
                documents=chunks,
                embeddings=embeddings.tolist(),
                ids=ids,
                metadatas=metadatas
            )
            logger.info(f"Successfully embedded {len(chunks)} chunks for {file_id}")
            return True

        except Exception as e:
            logger.error(f"Ingestion failed for {file_id}: {e}")
            return False

    def chat(self, file_id: str, message: str, model: str) -> Generator[str, None, None]:
        """
        RAG Chat Stream.
        1. Context Search
        2. Prompt Construction
        3. Ollama Generation (Streamed)
        """
        if not self.embed_model:
            yield "System Error: Embedding model missing."
            return

        # 1. Retrieve Context
        query_embed = self.embed_model.encode([message]).tolist()
        results = self.collection.query(
            query_embeddings=query_embed,
            n_results=3,
            where={"file_id": str(file_id)}
        )
        
        context_text = "\n\n".join(results['documents'][0]) if results['documents'] else "No context found."
        
        # 2. Build Prompt
        prompt = f"""You are Fidera AI. Use the following document context to answer the user question.
        If the answer is not in the context, say you don't know.

        Context:
        {context_text}

        Question: {message}
        Answer:"""

        # 3. Call Ollama
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": True
            }
            with requests.post(f"{self.ollama_base_url}/api/generate", json=payload, stream=True) as resp:
                if resp.status_code != 200:
                    yield f"Error from Ollama: {resp.text}"
                    return
                    
                for line in resp.iter_lines():
                    if line:
                        data = json.loads(line)
                        if "response" in data:
                            yield data["response"]
                            
        except Exception as e:
            yield f"Connection Error: {str(e)}"

    def process_document_background(self, file_id: str, storage_path: str):
        """
        Orchestrates the background ingestion.
        Downloads from MinIO -> Embeds -> Cleans up.
        """
        temp_dir = "temp_processing" 
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
            
        temp_path = os.path.join(temp_dir, f"ai_{file_id}.tmp")
        
        try:
             # Lazy import to avoid circular dependency issues during startup
             from app.services.storage import storage_service
             from app.core.config import get_settings
             settings = get_settings()
             
             logger.info(f"AI: Downloading {file_id} for embedding...")
             storage_service.download_to_temp(settings.SECURE_BUCKET, storage_path, temp_path)
             
             logger.info(f"AI: Embedding {file_id}...")
             success = self.embed_document(file_id, temp_path)
             
             if success:
                 logger.info(f"AI: Processing Complete for {file_id}")
             else:
                 logger.warning(f"AI: Embedding failed/skipped for {file_id}")

        except Exception as e:
            logger.error(f"AI Background Processing Failed: {e}")
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

ai_service = AIService()
