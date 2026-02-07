from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.v1.api import api_router
from app.core.db import init_db

settings = get_settings()

app = FastAPI(
    title="Fidera Privacy-First AI Documentation Platform",
    description="""
    Fidera is a privacy-first platform for secure document sharing and AI-powered intelligence.
    
    ## Features
    * **Ephemeral Intake**: Files are staged and metadata is exposed for transparency.
    * **Sanitization**: Automatic stripping of sensitive metadata before secure storage.
    * **AI Intelligence**: Privacy-focused RAG (Retrieval-Augmented Generation) chat with documents.
    * **Secure Storage**: Integration with MinIO for robust object storage.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.MINIO_SECURE is False: # Local dev
    origins = ["*"]
else:
    origins = [
        "http://localhost:3000",
        "https://fidera.app", # Example
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    init_db()
    # Start ZeroHold Scheduler
    from app.services.scheduler import scheduler
    scheduler.start()

@app.on_event("shutdown")
def on_shutdown():
    from app.services.scheduler import scheduler
    scheduler.shutdown()

@app.get("/")
def root():
    return {"message": "Fidera Privacy-First API is running."}
