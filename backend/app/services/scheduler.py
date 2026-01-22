from apscheduler.schedulers.background import BackgroundScheduler
from sqlmodel import Session, select
from datetime import datetime, timezone
import logging
from app.core.db import engine
from app.models.file import File, FileStatus
from app.services.storage import storage_service
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

def delete_expired_files():
    """
    ZeroHold™: Checking and purging expired files.
    """
    # logger.info("ZeroHold™: Checking for expired files...") 
    # (Commented out to reduce log noise every minute, usually good for debug though)
    
    with Session(engine) as session:
        # Find active files that have passed expiry
        # Note: ensuring timezone awareness match
        now = datetime.now()
        statement = select(File).where(
            File.status == FileStatus.STORED,
            File.expires_at < now
        )
        expired_files = session.exec(statement).all()
        
        if not expired_files:
            return

        logger.info(f"ZeroHold™: Found {len(expired_files)} expired files. Purging...")
        
        for file in expired_files:
            try:
                # 1. Delete from Secure Storage (MinIO)
                # 1. Delete from Secure Storage (MinIO)
                if file.storage_path:
                    storage_service.delete_secure(file.storage_path)
                    logger.info(f"Deleted object {file.storage_path} from Storage")
                
                # 2. Update DB Status
                file.status = FileStatus.EXPIRED
                file.storage_path = "PURGED" # Explicitly overwrite path
                
                # 3. Remove Embeddings (RAG)
                from app.services.ai import ai_service
                ai_service.delete_file_embeddings(file.id)

                # ZeroHold: Remove metadata snapshot too?
                file.metadata_snapshot = {"_purged": "ZeroHold Enforcement"}
                
                session.add(file)
                
            except Exception as e:
                logger.error(f"Failed to purge {file.id}: {e}")
        
        session.commit()
        logger.info(f"ZeroHold™: Purge Complete.")

scheduler = BackgroundScheduler()
# Run every minute
scheduler.add_job(delete_expired_files, 'interval', minutes=1)
