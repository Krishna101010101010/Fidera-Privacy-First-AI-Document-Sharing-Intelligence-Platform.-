# Fidera - Privacy-First AI Document Sharing

## Project Overview
Fidera is a secure document sharing platform that strips metadata and uses permission-aware AI.

## Quick Start (Run The App)

### 1. Start Infrastructure (Database & Storage)
Open a terminal in this folder and run:
```bash
docker-compose up -d
```
*Wait 10-20 seconds for database to initialize.*

### 2. Start Backend (The Engine)
Open a NEW terminal tab:
```bash
source venv/bin/activate
pip install -r backend/requirements.txt
# Ensure you have installed 'exiftool' on your Mac: brew install exiftool
uvicorn backend.app.main:app --reload
```
*Backend runs on http://localhost:8000*

### 3. Start Frontend (The UI)
Open a NEW terminal tab:
```bash
cd frontend
npm run dev
```
*Frontend runs on http://localhost:3000*

---

## What has been built?

1. **Backend API**:
   - `POST /api/v1/files/stage`: Uploads & Extracts Metadata.
   - `POST /api/v1/files/confirm`: Strips Metadata & Stores Securely.
2. **Metadata Service**: Uses `exiftool` to power the "Transparency Gate".
3. **Frontend App**:
   - Next.js + Tailwind CSS.
   - **Transparency Gate UI**: Visual comparison of Leaked vs Clean data.
4. **Architecture**: Solid foundation for scale (MinIO, Postgres, Modular Code).

## Next Steps to Build
1. **Viewer Page**: Create `/view/[token]` for the receiver experience.
2. **AI Integration**: Connect `ollama` for the Chat features.
