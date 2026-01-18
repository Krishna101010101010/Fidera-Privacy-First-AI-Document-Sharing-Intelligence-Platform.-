from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.ai import ai_service
from app.models.chat import ChatRequest, ModelList

router = APIRouter()

@router.get("/models", response_model=ModelList)
async def get_models():
    """Get available Ollama models."""
    models = ai_service.get_available_models()
    return {"models": models}

@router.post("/message")
async def chat_message(request: ChatRequest):
    """
    Stream RAG chat response.
    """
    if not ai_service.check_ollama():
        raise HTTPException(status_code=503, detail="Ollama service not running at http://localhost:11434")

    return StreamingResponse(
        ai_service.chat(request.file_id, request.message, request.model),
        media_type="text/plain"
    )
