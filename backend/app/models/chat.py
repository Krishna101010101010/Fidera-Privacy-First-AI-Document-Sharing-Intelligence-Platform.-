from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    file_id: str
    message: str
    model: str

class ModelList(BaseModel):
    models: List[str]
