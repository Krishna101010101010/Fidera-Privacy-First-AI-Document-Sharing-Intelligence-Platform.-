from minio import Minio
from minio.error import S3Error
import minio.common
from app.core.config import get_settings
import io

settings = get_settings()

class StorageService:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self._ensure_buckets()

    def _ensure_buckets(self):
        """Ensure required buckets exist."""
        try:
            for bucket in [settings.STAGING_BUCKET, settings.SECURE_BUCKET]:
                if not self.client.bucket_exists(bucket):
                    self.client.make_bucket(bucket)
        except Exception as e:
            print(f"Warning: Could not connect to MinIO during init: {e}")

    def upload_to_staging(self, file_data: bytes, filename: str, content_type: str) -> str:
        """Uploads raw file to staging bucket. Returns object name."""
        try:
            result = self.client.put_object(
                settings.STAGING_BUCKET,
                filename,
                io.BytesIO(file_data),
                len(file_data),
                content_type=content_type
            )
            return filename
        except S3Error as e:
            raise Exception(f"S3 Upload Error: {e}")

    def move_to_secure(self, staging_filename: str, secure_filename: str):
        """
        Moves object from Staging -> Secure (Copy + Delete).
        This happens via server-side copy if possible, or download-upload.
        MinIO supports copy_object.
        """
        # Source must be "bucket/object"
        src = f"/{settings.STAGING_BUCKET}/{staging_filename}"
        
        self.client.copy_object(
            settings.SECURE_BUCKET,
            secure_filename,
            minio.common.CopySource(settings.STAGING_BUCKET, staging_filename)
        )
        
        # Delete from staging
        self.client.remove_object(settings.STAGING_BUCKET, staging_filename)

    def delete_secure(self, filename: str):
        self.client.remove_object(settings.SECURE_BUCKET, filename)

    def get_file_path(self, filename: str, bucket: str = None) -> str:
        """
        For local ExifTool processing, we might need a local path or stream.
        If MinIO is local, we can mapped volume? No, better to stream or temp download.
        """
        # Implementation depends on how we pass file to ExifTool. 
        # Usually we download to a temp file on disk first.
        pass
    
    def download_to_temp(self, bucket: str, filename: str, temp_path: str):
        self.client.fget_object(bucket, filename, temp_path)

storage_service = StorageService()
