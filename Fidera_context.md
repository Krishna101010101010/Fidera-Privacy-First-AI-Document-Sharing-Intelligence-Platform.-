Good request. This is exactly the right moment to **freeze the product truth** so AI builders don’t hallucinate features or weaken your security model.

Below is an **extremely detailed, build-ready PRD + system context** written so that:

* AI builder tools can execute it faithfully
* Humans don’t misinterpret intent
* Security guarantees are explicit
* Receiver experience is first-class, not an afterthought

I will be strict. If something is ambiguous, builders will mess it up.

---

# **FIDERA**

### Privacy-First AI Document Sharing & Intelligence Platform

---

## 1. PRODUCT VISION (NON-NEGOTIABLE)

Fidera enables users to **share documents securely** while:

* Exposing and removing privacy-leaking metadata
* Automatically applying AI intelligence safely
* Preventing uncontrolled redistribution
* Ensuring **hard deletion after expiry**

AI is **never** allowed to override privacy guarantees.

---

## 2. CORE PROBLEM STATEMENT

### Sender Problems

* Users unknowingly share documents with hidden metadata (location, author, device).
* Existing tools prioritize convenience over privacy.
* AI tools extract insights without lifecycle control.

### Receiver Problems

* Receivers want to:

  * View shared files quickly
  * Understand content
  * Ask questions
* They **should not**:

  * Download sensitive files
  * See internal risk analysis
  * Access metadata history

---

## 3. USER ROLES

### 3.1 Sender (Owner)

* Authenticated user
* Uploads files
* Controls sharing and expiry
* Sees AI insights and risk analysis

### 3.2 Receiver (Viewer)

* No account required (link-based access)
* View-only permissions
* Can chat with the document using AI
* Cannot download, re-share, or see metadata

---

## 4. END-TO-END WORKFLOW (AUTHORITATIVE)

---

## A. SENDER FLOW (OWNER)

### A1. Authentication

* Sender logs in (JWT-based).
* All actions are user-scoped.

---

### A2. File Upload & Metadata Transparency Gate

#### A2.1 Ephemeral Staging

* File uploaded to temporary memory/disk.
* No permanent storage.

#### A2.2 Metadata Extraction

* System extracts **all metadata**:

  * EXIF (images)
  * PDF XMP fields
  * Document properties
* No sanitization yet.

#### A2.3 Metadata Comparison UI

Sender sees:

* **Metadata Before Removal**
* **Metadata After Removal (Preview)**

UI must visually emphasize:

* What data would leak
* What will be removed

#### A2.4 Explicit Confirmation

Sender must:

* Confirm upload
* Or cancel

If canceled → file destroyed instantly.

---

### A3. Sanitization & Storage

* Metadata stripped permanently.
* File integrity validated.
* Only sanitized file stored.
* Sender must set:

  * Expiry time (mandatory)

Raw file is never persisted.

---

### A4. Automatic AI Intelligence Pipeline

Triggered immediately after storage.

#### A4.1 Document Processing

* Text extraction
* OCR if required
* Language detection
* Page/section mapping

#### A4.2 Privacy Risk Analysis (Owner-Only)

AI + rules analyze:

* Metadata exposure
* Content sensitivity
* Sharing risk

Output:

* Risk score (Low / Medium / High)
* Explainable reasons

#### A4.3 Sensitive Data Detection

Detects:

* PII
* Financial identifiers
* Legal/confidential phrases

Highlights risk zones.
No auto-redaction.

#### A4.4 Knowledge Indexing

* Chunk document
* Generate embeddings
* Store in FAISS
* Bind chunks to file + expiry

#### A4.5 AI Summary

* Executive summary
* Key points
* Risk notes

All AI artifacts inherit expiry.

---

### A5. Sharing

#### A5.1 Share Link Creation

Sender generates a link with:

* View-only permission
* Expiry ≤ file expiry

#### A5.2 Share Rules

* No download
* No resharing
* No metadata visibility
* No AI risk visibility

---

## B. RECEIVER FLOW (VIEWER)

This is critical. Many teams ignore receiver UX. You won’t.

---

### B1. Access via Link

* Receiver clicks link.
* No login required.
* Backend validates:

  * Link validity
  * Expiry
  * Access scope

If expired → **404**, not “expired message”.

---

### B2. Document Viewing Experience

Receiver can:

* View sanitized document
* Scroll pages
* Zoom
* Navigate sections

Receiver cannot:

* Download
* Print
* Copy entire content
* Inspect metadata

Session is:

* Watermarked (viewer ID or session hash)
* Logged for audit

---

### B3. AI Conversation (Receiver Perspective)

This is **NOT** a full AI assistant.

#### B3.1 Conversation UI

* Chat panel beside document
* Clear label:

  > “Ask questions about this document”

#### B3.2 LLM Behavior (LlamaIndex)

AI can:

* Answer questions grounded **only** in the document
* Cite page/section references
* Explain content clearly

AI must NOT:

* Summarize entire document
* Provide risk analysis
* Mention metadata
* Infer sender intent

#### B3.3 Permission-Aware RAG

Retrieval logic:

```
(file_id, role=viewer) → allowed_chunks
```

No leakage of owner-only insights.

---

### B4. Chat Safety Controls

* Token-limited responses
* Rate limiting
* No export chat history
* No bulk extraction prompts

Chat is **assistance**, not data exfiltration.

---

## C. EXPIRY & ERASURE (ZERO EXCEPTIONS)

At expiry:

* File deleted
* Embeddings deleted
* AI outputs deleted
* Share link invalidated
* Chat disabled

No recovery.
No admin override.
No backups.

This is **Fidera ZeroHold™**.

---

## 5. TECH STACK (IMPLEMENTATION CONTEXT)

### Backend

* Python 3.11+
* FastAPI
* PostgreSQL
* S3 / MinIO
* Background workers (expiry, AI)

### AI

* LlamaIndex (RAG orchestration)
* SentenceTransformers (embeddings)
* FAISS (vector store)
* Ollama / API-based LLM

### Metadata

* ExifTool
* PyPDF / pikepdf
* python-docx

### Frontend

* Next.js
* Tailwind CSS
* Framer Motion (animations)
* React Query

### Security

* JWT auth
* Signed share links
* HTTPS only
* Strict CORS
* Audit logs

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### Performance

* Metadata preview < 2s
* AI summary async
* Chat response < 3s

### Privacy

* No raw file persistence
* No AI artifacts beyond expiry
* No hidden retention

### UX

* Privacy actions explained
* AI actions visible
* No dark patterns

---

## 7. WHAT AI BUILDER TOOLS MUST NOT INVENT

* Download permissions
* Auto-redaction
* Admin recovery
* Viewer access to risk scores
* Infinite retention
* AI rewriting documents



# PART 1 — MACHINE-READABLE PRD PROMPT

(Use this directly in AI builder tools)

## SYSTEM PROMPT — PRODUCT BUILD CONTEXT

You are building **FIDERA**, a **Privacy-First AI Document Sharing & Intelligence Platform**.

Your primary constraint:

> **Privacy, security, and lifecycle guarantees override all AI behavior.**

AI is allowed **only** when explicitly permitted and must obey strict access boundaries.

---

## CORE PRODUCT RULES (DO NOT VIOLATE)

1. **Raw uploaded files are never permanently stored**
2. **Metadata must be shown before removal and after removal preview**
3. **User must explicitly confirm before upload completes**
4. **AI processing is automatic after upload**
5. **All files require an expiry**
6. **At expiry, all data (files, embeddings, AI outputs) are permanently deleted**
7. **Shared viewers have view-only + chat access**
8. **Shared viewers cannot download or reshare**
9. **Shared viewers cannot see metadata or AI risk analysis**
10. **AI chat must be document-grounded only (RAG via LlamaIndex)**

If any feature contradicts these rules, it must not be implemented.

---

## USER ROLES

### OWNER (Sender)

* Authenticated
* Uploads files
* Sees metadata before/after
* Sees AI risk analysis and summaries
* Controls sharing and expiry

### VIEWER (Receiver)

* Accesses via signed link
* No authentication required
* View document
* Chat with document using AI
* No download
* No metadata visibility
* No AI risk visibility

---

## REQUIRED FEATURES (IMPLEMENT ALL)

### Upload & Metadata Transparency

* Temporary staging upload
* Full metadata extraction
* Before/after metadata preview
* Explicit confirmation required

### Sanitization

* Metadata permanently removed
* File validated
* Only sanitized file stored

### AI Pipeline (Automatic)

* Text extraction
* OCR if required
* Privacy risk scoring (owner-only)
* Sensitive data detection (owner-only)
* Document chunking + embeddings
* LlamaIndex RAG setup

### Sharing

* Signed, expiring view-only links
* Cannot exceed file expiry
* No downloads

### Viewer AI Chat

* LlamaIndex retrieval
* Permission-aware chunk access
* No summarizing entire document
* Token limits and rate limiting

### Expiry & Erasure

* Hard deletion

* No recovery
* No admin override

---

## TECH STACK (FIXED)

Backend:

* Python 3.11
* FastAPI
* PostgreSQL
* S3 / MinIO
* Background jobs

AI:

* LlamaIndex
* SentenceTransformers
* FAISS
* Local or API LLM

Frontend:

* Next.js
* Tailwind CSS
* Framer Motion
* React Query

---

## FORBIDDEN FEATURES

* Download access for viewers
* AI rewriting documents
* Auto-redaction
* Infinite retention
* Viewer access to risk scores
* Admin recovery

---

## SUCCESS CRITERIA

A document:

* Cannot exist past expiry
* Cannot leak metadata
* Cannot be fully extracted by viewers
* Can be understood via AI safely

---

# PART 2 — API CONTRACTS (FRONTEND ↔ BACKEND)

These are **authoritative contracts**.
Frontend must not infer behavior.

---

## AUTH

### POST `/auth/login`

**Request**

```json
{ "email": "string", "password": "string" }
```

**Response**

```json
{ "access_token": "jwt", "expires_in": 3600 }
```

---

## FILE UPLOAD FLOW

### POST `/files/stage`

Uploads file to temporary staging.

**Request**

* multipart/form-data
* file

**Response**

```json
{
  "stage_id": "uuid",
  "detected_type": "pdf",
  "metadata_raw": { "key": "value" },
  "metadata_clean_preview": { "key": null }
}
```

---

### POST `/files/confirm`

Confirms upload after metadata review.

**Request**

```json
{
  "stage_id": "uuid",
  "expiry_hours": 24
}
```

**Response**

```json
{
  "file_id": "uuid",
  "status": "stored",
  "ai_processing": "started"
}
```

---

## OWNER FILE DASHBOARD

### GET `/files`

Returns owner files.

**Response**

```json
[
  {
    "file_id": "uuid",
    "filename": "report.pdf",
    "expiry_at": "timestamp",
    "ai_status": "complete",
    "risk_level": "medium"
  }
]
```

---

### GET `/files/{file_id}/insights`

Owner-only AI insights.

**Response**

```json
{
  "risk_level": "high",
  "risk_reasons": ["GPS metadata", "Personal identifiers"],
  "summary": "string",
  "sensitive_flags": ["PII", "Financial"]
}
```

---

## SHARING

### POST `/files/{file_id}/share`

Creates view-only link.

**Request**

```json
{ "expiry_hours": 12 }
```

**Response**

```json
{ "share_url": "https://fidera.app/view/abc123" }
```

---

## VIEWER ACCESS

### GET `/view/{token}/info`

Validates access.

**Response**

```json
{
  "file_id": "uuid",
  "filename": "report.pdf",
  "expires_at": "timestamp"
}
```

---

### GET `/view/{token}/document`

Streams sanitized document (view-only).

---

## AI CHAT (OWNER & VIEWER)

### POST `/chat`

**Request**

```json
{
  "context_id": "file_id or share_token",
  "message": "string"
}
```

**Response**

```json
{
  "reply": "string",
  "citations": [
    { "page": 3, "excerpt": "..." }
  ]
}
```

**Rules**

* Viewer chats limited in length
* Viewer cannot request full summaries
* Owner has broader access

---

## EXPIRY JOB (INTERNAL)

### DELETE `/internal/expire/{file_id}`

Deletes:

* File
* Embeddings
* AI outputs
* Share links

No response body.

---

## FRONTEND INTEGRATION RULES (MANDATORY)

* Frontend never stores files
* Frontend never decides permissions
* Frontend reflects backend state only
* All AI responses rendered with citations
* Animations must never block security actions


## FINAL NOTE (IMPORTANT)

If an AI builder or developer:

* Adds download
* Adds recovery
* Skips metadata preview
* Lets AI exceed permissions

**The build is wrong.**
