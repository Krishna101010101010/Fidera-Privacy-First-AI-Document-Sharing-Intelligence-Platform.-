from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.ai import ai_service
from app.models.chat import ChatRequest, ModelList
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/models", response_model=ModelList, summary="List Available Models", description="Retrieves a list of AI models currently available via the Ollama service.")
async def get_models():
    """Get available Ollama models."""
    models = ai_service.get_available_models()
    return {"models": models}

@router.post("/message", summary="AI Document Chat", description="Initiates a streaming chat session with a specific document using RAG (Retrieval-Augmented Generation).")
async def chat_message(request: ChatRequest):
    """
    Stream RAG chat response.
    """
    if not ai_service.check_ollama():
        raise HTTPException(status_code=503, detail="Ollama service not running at http://localhost:11434")

    try:
        return StreamingResponse(
            ai_service.chat(str(request.file_id), request.message, request.model),
            media_type="text/plain"
        )
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/debug/{file_id}", summary="Debug Document Index", description="Inspects the indexed chunks and metadata for a specific document stored in the vector database.")
async def debug_chat(file_id: str):
    """
    Debug: Inspect indexed content for a file.
    """
    try:
        # Query Chroma directly
        count = ai_service.chroma_collection.count()
        results = ai_service.chroma_collection.get(
            where={"file_id": file_id},
            limit=5
        )
        return {
            "file_id": file_id,
            "total_collection_response": count,
            "indexed_chunks_count": len(results['ids']),
            "snippets": results['documents'],
            "metadatas": results['metadatas']
        }
    except Exception as e:
        return {"error": str(e)}
