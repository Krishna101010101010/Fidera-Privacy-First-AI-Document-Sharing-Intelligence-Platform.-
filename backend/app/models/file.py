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
    filename: str
    content_type: str
    file_size: int
    expiry_hours: Optional[int] = None # Requested duration

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
    id: UUID
    status: FileStatus
    created_at: datetime
    expires_at: Optional[datetime]
    ai_status: AIStatus

class FileMetadataResponse(SQLModel):
    file_id: UUID
    filename: str
    metadata_raw: Dict[str, Any]
    metadata_preview_clean: Dict[str, Any] # What it WILL look like
