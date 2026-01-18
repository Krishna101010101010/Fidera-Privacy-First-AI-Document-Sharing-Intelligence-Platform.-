from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fidera"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://fidera_user:fidera_password@localhost:5432/fidera_db"
    
    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "fidera_minio"
    MINIO_SECRET_KEY: str = "fidera_minio_password"
    MINIO_SECURE: bool = False  # False for local dev (http)
    STAGING_BUCKET: str = "fidera-staging"
    SECURE_BUCKET: str = "fidera-secure"
    
    # Security
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_TO_A_SUPER_SECRET_KEY_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
