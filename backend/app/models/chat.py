from pydantic import BaseModel
from typing import List

from uuid import UUID

class ChatRequest(BaseModel):
    file_id: UUID
    message: str
    model: str

class ModelList(BaseModel):
    models: List[str]
