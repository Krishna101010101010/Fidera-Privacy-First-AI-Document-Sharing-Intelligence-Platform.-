from fastapi import APIRouter
from app.api.v1.endpoints import files, chat, auth

api_router = APIRouter()
api_router.include_router(files.router, prefix="/files", tags=["File Management"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat & Intelligence"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & User Management"])
