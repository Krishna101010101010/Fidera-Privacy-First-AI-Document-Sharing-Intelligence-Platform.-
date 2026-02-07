from typing import Optional, Dict, Any, List
from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import Field, SQLModel, JSON, Column
from enum import Enum

class FileStatus(str, Enum):
    STAGING = "staging"         # Uploaded but not confirmed
    STORED = "stored"           # Confirmed and sanitized
    EXPIRED = "expired"         # Logically expired (should be deleted)

class AIStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class FileBase(SQLModel):
    filename: str = Field(description="The original name of the uploaded file.")
    content_type: str = Field(description="The MIME type of the file (e.g., application/pdf).")
    file_size: int = Field(description="The size of the file in bytes.")
    expiry_hours: Optional[int] = Field(default=None, description="The number of hours until the file is automatically deleted.")

class File(FileBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # owner_id: UUID = Field(foreign_key="user.id") # Uncomment when User model is ready
    owner_id: UUID = Field(index=True) # Placeholder strictly
    
    storage_path: str 
    status: FileStatus = Field(default=FileStatus.STAGING)
    ai_status: AIStatus = Field(default=AIStatus.PENDING)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = Field(default=None, index=True)
    
    # Store metadata extraction results (Owner ONLY)
    # Using SA Column for JSON type if needed, but SQLModel supports basic types. 
    # For JSON in standard SQLModel (with Pydantic v2), we just use Dict.
    # We rely on SQLAlchemy's JSON type for the backend column.
    metadata_snapshot: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    
    is_sanitized: bool = Field(default=False)

class FileCreate(FileBase):
    pass

class FileRead(FileBase):
    id: UUID = Field(description="The unique identifier for the file.")
    status: FileStatus = Field(description="The current lifecycle status of the file.")
    created_at: datetime = Field(description="The timestamp when the file was first uploaded.")
    expires_at: Optional[datetime] = Field(description="The timestamp when the file will expire and be deleted.")
    ai_status: AIStatus = Field(description="The status of AI document indexing and processing.")

class FileMetadataResponse(SQLModel):
    file_id: UUID = Field(description="The unique identifier for the staged file.")
    filename: str = Field(description="The original filename.")
    metadata_raw: Dict[str, Any] = Field(description="The full raw metadata extracted from the file.")
    metadata_preview_clean: Dict[str, Any] = Field(description="A preview of how the metadata will appear after sanitization.")
