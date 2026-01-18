# Fidera - Architecture & Implementation Guide

## 1. High-Level Architecture

Fidera is built as a cloud-ready, containerized application ensuring privacy by design.

```mermaid
graph TD
    User[User (Owner/Viewer)] -->|HTTPS| CDN[CDN / Load Balancer]
    CDN -->|Frontend| NextJS[Next.js Frontend]
    CDN -->|API| API[FastAPI Backend]
    
    subgraph "Private Network"
        API -->|Metadata| ExifTool[ExifTool Service]
        API -->|Data| DB[(PostgreSQL)]
        API -->|Files| MinIO[(MinIO Object Storage)]
        API -->|AI-RAG| Ollama[Ollama LLM]
        API -->|Vectors| FAISS[(FAISS / PgVector)]
    end
```

## 2. Directory Structure

```text
/Fidera
├── ARCHITECTURE.md          # This file
├── docker-compose.yml       # Orchestration for DB, MinIO, Redis
├── README.md                # Quick start guide
├── backend/                 # Python FastAPI
│   ├── app/
│   │   ├── core/            # Config, Security, Events
│   │   ├── api/             # API Routes (v1)
│   │   ├── models/          # SQLModel/Pydantic Schemas
│   │   ├── services/        # Business Logic
│   │   │   ├── metadata.py  # metadata extraction/stripping (ExifTool)
│   │   │   ├── storage.py   # MinIO wrapper
│   │   │   └── ai.py        # Ollama/RAG integration
│   │   └── main.py          # Entry point
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/                # Next.js (Instructions for your friend)
    ├── src/
    │   ├── components/      # Transparency Gate UI, Chat UI
    │   └── hooks/           # API integration
    └── ...
```

## 3. Core Flows & "Transparency Gate" Logic

### 3.1. Upload (The Gate)
1. **User** sends file to `POST /api/v1/files/stage`.
2. **Backend**:
   - Streams file to `MinIO` (Bucket: `staging-temp`).
   - Runs `ExifTool` to extract JSON metadata.
   - Generates a `file_id`.
3. **Returns**: `{ file_id, metadata_raw, metadata_preview_clean }`.
4. **Data displayed** in Side-by-Side Table View on Frontend.

### 3.2. Confirmation & Sanitization
1. **User** calls `POST /api/v1/files/confirm`.
2. **Backend**:
   - Retrieves from `staging-temp`.
   - Strips metadata (ExifTool).
   - Validates integrity.
   - Moves to `MinIO` (Bucket: `secure-storage`).
   - Deletes from `staging-temp`.
   - Records metadata in DB (only file info, NO user PII).
   - Triggers AI Processing Background Task.

### 3.3. Expiry (ZeroHold™)
- **Celery/Background Task** runs every minute.
- Queries DB for `expiry < now()`.
- **Action**:
  - DELETE from DB.
  - DELETE from MinIO.
  - DELETE from Vector Store (FAISS).
- **Result**: 404 Not Found (or "Expired" message as requested).

## 4. Database Schema (PostgreSQL)

We will use **SQLModel** (SQLAlchemy + Pydantic) for Pythonic definitions.

**Table: `users`**
- `id`: UUID (PK)
- `email`: String (Unique)
- `password_hash`: String
- `role`: Enum (owner, admin)

**Table: `files`**
- `id`: UUID (PK)
- `owner_id`: UUID (FK)
- `filename`: String
- `storage_path`: String
- `file_size`: Integer
- `content_type`: String
- `encryption_key_id`: String (Key Management)
- `created_at`: Datetime
- `expires_at`: Datetime (Indexed)
- `is_sanitized`: Boolean
- `ai_status`: Enum (pending, processing, completed, failed)

**Table: `share_links`**
- `token`: String (PK, Random URL-safe)
- `file_id`: UUID (FK)
- `created_at`: Datetime
- `expires_at`: Datetime (Cannot exceed file.expires_at)
- `access_log_count`: Integer

## 5. Technology Stack Decisions

- **Cloud-Ready**: Local Dev uses `docker-compose` to mimic AWS/Cloud.
  - S3 -> MinIO
  - RDS -> PostgreSQL container
- **AI**: Ollama (via requests/LangChain).
- **Metadata**: `PyExifTool` wrapper around the perl `exiftool` executable.

## 6. API Guidelines (For Frontend Dev)

- **Base URL**: `http://localhost:8000/api/v1`
- **Auth**: Bearer Token (JWT)
- **Errors**: Standard HTTP codes (400, 401, 403, 404).

---
