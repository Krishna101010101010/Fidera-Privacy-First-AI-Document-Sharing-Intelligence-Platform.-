from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.api import deps
from app.core import security
from app.core.config import get_settings
from app.core.db import get_session
from app.models.user import User, UserCreate, UserRead, Token

router = APIRouter()
settings = get_settings()

@router.post("/login", response_model=Token, summary="User Login", description="Authenticates a user and returns an access token.")
def login_access_token(
    session: Session = Depends(get_session),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # OAuth2 form sends username/password
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }

@router.post("/register", response_model=UserRead, summary="User Registration", description="Registers a new user in the system.")
def register_user(
    *,
    session: Session = Depends(get_session),
    user_in: UserCreate,
) -> Any:
    statement = select(User).where(User.email == user_in.email)
    user = session.exec(statement).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    # properly hash password
    user = User.model_validate(user_in, update={"hashed_password": security.get_password_hash(user_in.password)})
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/me", response_model=UserRead, summary="Current User Info", description="Retrieves information about the currently authenticated user.")
def read_users_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return current_user
