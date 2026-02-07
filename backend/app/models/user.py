from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4
from pydantic import EmailStr

class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, description="The user's email address, used for login.")
    is_active: bool = Field(default=True, description="Whether the user account is currently active.")
    full_name: Optional[str] = Field(default=None, description="The user's full name.")

class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: UUID = Field(description="The unique identifier for the user.")

class Token(SQLModel):
    access_token: str = Field(description="The JWT access token used for authentication.")
    token_type: str = Field(description="The type of token (typically 'bearer').")

class TokenData(SQLModel):
    email: Optional[str] = None
