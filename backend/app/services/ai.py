import logging
import os
import requests
import json
import chromadb
from typing import List, Generator

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, Settings
from llama_index.core.vector_stores import MetadataFilters, MetadataFilter, ExactMatchFilter
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.ollama_base_url = "http://localhost:11434"
        self.chroma_path = "./chroma_db"
        self.collection_name = "fidera_docs"
        
        # Initialize LlamaIndex Settings
        # Embedding Model (Local)
        # We perform lazy loading or check if it needs download
        try:
            Settings.embed_model = HuggingFaceEmbedding(model_name="all-MiniLM-L6-v2")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")

        # Default LLM (Placeholder, we set it dynamically per request)
        try:
            Settings.llm = Ollama(base_url=self.ollama_base_url, model="llama3", request_timeout=120.0)
        except:
             pass

        # ChromaDB Client
        self.chroma_client = chromadb.PersistentClient(path=self.chroma_path)
        self.chroma_collection = self.chroma_client.get_or_create_collection(self.collection_name)
        self.vector_store = ChromaVectorStore(chroma_collection=self.chroma_collection)
        self.storage_context = StorageContext.from_defaults(vector_store=self.vector_store)

    def check_ollama(self) -> bool:
        try:
            res = requests.get(f"{self.ollama_base_url}/")
            return res.status_code == 200
        except:
            return False

    def get_available_models(self) -> List[str]:
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
        Ingest document using LlamaIndex.
        """
        try:
            # Load Data using SimpleDirectoryReader (supports PDF, Docx, etc automatically!)
            loader = SimpleDirectoryReader(input_files=[file_path])
            documents = loader.load_data()
            
            # Attach Metadata
            for doc in documents:
                doc.metadata["file_id"] = str(file_id)
            
            # Index (automatically persists to Chroma via storage_context)
            VectorStoreIndex.from_documents(
                documents, 
                storage_context=self.storage_context
            )
            logger.info(f"Successfully embedded {len(documents)} pages/chunks for {file_id}")
            return True
        except Exception as e:
            logger.error(f"LlamaIndex Ingestion failed: {e}")
            return False

    def chat(self, file_id: str, message: str, model_name: str) -> Generator[str, None, None]:
        """
        RAG Chat using LlamaIndex Chat Engine with Context.
        """
        try:
            # Load Index from Vector Store
            index = VectorStoreIndex.from_vector_store(
                self.vector_store,
            )
            
            # Configure LLM
            llm = Ollama(base_url=self.ollama_base_url, model=model_name, request_timeout=120.0)
            
            # Configure Filters (RAG)
            # ExactMatchFilter is robust
            filters = MetadataFilters(
                filters=[ExactMatchFilter(key="file_id", value=str(file_id))]
            )
            
            # Create Engine
            # Use 'context' mode so it retrieves context + history
            chat_engine = index.as_chat_engine(
                chat_mode="context",
                llm=llm,
                filters=filters,
                system_prompt="You are Fidera AI. Answer strictly using the provided context. If unsure, say 'I cannot find that information in the document'."
            )
            
            # Stream Response
            streaming_response = chat_engine.stream_chat(message)
            for token in streaming_response.response_gen:
                yield token
                
        except Exception as e:
            logger.error(f"Chat Error: {e}")
            yield f"Error: {str(e)}"

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
