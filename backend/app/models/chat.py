from pydantic import BaseModel, Field
from typing import List

from uuid import UUID

class ChatRequest(BaseModel):
    file_id: UUID = Field(description="The unique identifier of the document to chat with.")
    message: str = Field(description="The message or question to send to the AI.")
    model: str = Field(description="The name of the Ollama model to use for this request.")

class ModelList(BaseModel):
    models: List[str] = Field(description="A list of model names currently available on the server.")
