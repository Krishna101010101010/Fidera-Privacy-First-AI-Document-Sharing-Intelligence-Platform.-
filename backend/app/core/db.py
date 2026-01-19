from sqlmodel import SQLModel, create_engine, Session
from app.core.config import get_settings

settings = get_settings()

# connect_args={"check_same_thread": False} for SQLite, but we use Postgres
engine = create_engine(settings.DATABASE_URL, echo=True)

def init_db():
    from app.models.file import File
    from app.models.user import User
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
