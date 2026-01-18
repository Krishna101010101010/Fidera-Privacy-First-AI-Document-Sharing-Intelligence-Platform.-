from fastapi import APIRouter
from app.api.v1.endpoints import files, chat

api_router = APIRouter()
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
