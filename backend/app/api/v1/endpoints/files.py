from fastapi import APIRouter, UploadFile, File as FastAPIFile, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlmodel import Session
from typing import Dict, Any
from uuid import uuid4, UUID
import os
import shutil
from datetime import datetime, timedelta

from app.core.db import get_session
from app.core.config import get_settings
from app.models.file import File, FileStatus, FileMetadataResponse, FileCreate, FileRead
from app.services.storage import storage_service
from app.services.metadata import metadata_service

router = APIRouter()
settings = get_settings()
TEMP_DIR = "temp_processing"

@router.post("/stage", response_model=FileMetadataResponse)
async def stage_file(
    file: UploadFile = FastAPIFile(...),
    session: Session = Depends(get_session)
):
    """
    Step B1 & B2: Ephemeral Intake & Metadata Exposure.
    1. Save to local temp.
    2. Extract metadata.
    3. Upload to Staging Bucket (MinIO).
    4. Create DB record (Staging).
    5. Return Metadata + Clean Preview.
    """
    file_id = uuid4()
    temp_filename = f"{file_id}_{file.filename}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)
    
    # 1. Save locally for processing
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 2. Extract Metadata (The "Transparency Gate")
        raw_metadata = metadata_service.extract_metadata(temp_path)
        clean_preview = metadata_service.generate_clean_preview(raw_metadata)
        
        # 3. Upload to MinIO Staging
        # Read file back from disk to upload
        with open(temp_path, "rb") as f:
            file_data = f.read()
            storage_service.upload_to_staging(file_data, temp_filename, file.content_type)
            
        # 4. DB Record
        db_file = File(
            id=file_id,
            filename=file.filename,
            owner_id=uuid4(), # Placeholder for Auth
            content_type=file.content_type or "application/octet-stream",
            file_size=os.path.getsize(temp_path),
            storage_path=temp_filename,
            status=FileStatus.STAGING,
            metadata_snapshot=raw_metadata,
            is_sanitized=False
        )
        session.add(db_file)
        session.commit()
        session.refresh(db_file)
        
        return FileMetadataResponse(
            file_id=db_file.id,
            filename=db_file.filename,
            metadata_raw=raw_metadata,
            metadata_preview_clean=clean_preview
        )
        
    except Exception as e:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Always clean up local raw file? 
        # Actually usually permissions forbid keeping raw on transparent-gate. 
        # But we uploaded to Staging bucket. So we can delete local.
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/{file_id}/confirm", response_model=Dict[str, Any])
async def confirm_upload(
    file_id: UUID,
    expiry_hours: int,
    session: Session = Depends(get_session)
):
    """
    Step C: Sanitization & Secure Storage.
    1. Retrieve from Staging.
    2. Sanitize (Strip Metadata).
    3. Store in Secure Bucket.
    4. Delete from Staging.
    5. Update DB (Stored, Expiry).
    """
    db_file = session.get(File, file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    if db_file.status != FileStatus.STAGING:
        raise HTTPException(status_code=400, detail="File already processed or expired")
    
    # Prepare paths
    temp_download_path = os.path.join(TEMP_DIR, f"download_{db_file.storage_path}")
    temp_clean_path = os.path.join(TEMP_DIR, f"clean_{db_file.storage_path}")
    
    try:
        # 1. Download from Staging
        storage_service.download_to_temp(settings.STAGING_BUCKET, db_file.storage_path, temp_download_path)
        
        # 2. Sanitize
        success = metadata_service.sanitize_file(temp_download_path, temp_clean_path)
        if not success:
            raise HTTPException(status_code=500, detail="Sanitization failed")
            
        # 3. Store in Secure Bucket
        with open(temp_clean_path, "rb") as f:
            data = f.read()
            # New filename for secure storage (randomized? Keep same?)
            # Usually safer to rename.
            secure_filename = f"secure_{db_file.id}_{db_file.filename}"
            # Storage service upload? We need a generic upload or use the client directly?
            # Let's add a generic upload_secure to service later or just reuse upload logic.
            # I'll manually call storage client here or create a helper method.
            # Reuse upload_to_staging logic but to secure bucket... 
            # Better to add upload_to_secure method in StorageService.
            # For now I will direct call client cause I know the implementation
            storage_service.client.put_object(
                settings.SECURE_BUCKET,
                secure_filename,
                io.BytesIO(data),
                len(data),
                content_type=db_file.content_type
            )
            
        # 4. Remove from Staging (MinIO)
        storage_service.client.remove_object(settings.STAGING_BUCKET, db_file.storage_path)
        
        # 5. Update DB
        db_file.status = FileStatus.STORED
        db_file.storage_path = secure_filename # Update path to new secure one
        db_file.is_sanitized = True
        db_file.expires_at = datetime.utcnow() + timedelta(hours=expiry_hours)
        db_file.expiry_hours = expiry_hours
        
        session.add(db_file)
        session.commit()
        
        # Trigger AI (Background Task placeholder)
        # background_tasks.add_task(process_ai_pipeline, file_id)
        
        return {"status": "success", "file_id": db_file.id, "expires_at": db_file.expires_at}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up local temps
        for p in [temp_download_path, temp_clean_path]:
            if os.path.exists(p):
                os.remove(p)

@router.get("/{file_id}", response_model=FileRead)
async def get_file_info(
    file_id: UUID,
    session: Session = Depends(get_session)
):
    """
    Get file metadata (for Viewer/Owner).
    Checks expiry logic implicitly (should add expiry check here).
    """
    db_file = session.get(File, file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    # Expiry Check
    if db_file.expires_at and db_file.expires_at < datetime.utcnow():
        raise HTTPException(status_code=404, detail="File expired")
        
    return db_file

@router.get("/{file_id}/content")
async def get_file_content(
    file_id: UUID,
    session: Session = Depends(get_session)
):
    """
    Streams the file content for viewing.
    """
    db_file = session.get(File, file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Expiry Check
    if db_file.expires_at and db_file.expires_at < datetime.utcnow():
        raise HTTPException(status_code=404, detail="File expired")
        
    if db_file.status != FileStatus.STORED:
        raise HTTPException(status_code=400, detail="File not ready or available")
        
    try:
        # Get stream from MinIO (Secure Bucket)
        minio_stream = storage_service.get_file(settings.SECURE_BUCKET, db_file.storage_path)
        
        return StreamingResponse(
            minio_stream,
            media_type=db_file.content_type,
            headers={
                "Content-Disposition": f"inline; filename={db_file.filename}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import io # Missing import

