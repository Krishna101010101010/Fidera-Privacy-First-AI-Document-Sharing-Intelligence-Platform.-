from minio import Minio
from minio.error import S3Error
from minio.commonconfig import CopySource
from app.core.config import get_settings
import io
import os
import shutil

settings = get_settings()

class StorageService:
    def __init__(self):
        self.use_local = False
        self.local_base = "local_storage"
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        try:
            self._ensure_buckets()
        except Exception as e:
            print(f"MinIO connection failed ({e}). Switching to Local Storage.")
            self.use_local = True
            os.makedirs(os.path.join(self.local_base, settings.STAGING_BUCKET), exist_ok=True)
            os.makedirs(os.path.join(self.local_base, settings.SECURE_BUCKET), exist_ok=True)

    def _ensure_buckets(self):
        """Ensure required buckets exist."""
        for bucket in [settings.STAGING_BUCKET, settings.SECURE_BUCKET]:
            if not self.client.bucket_exists(bucket):
                self.client.make_bucket(bucket)

    def upload_to_staging(self, file_data: bytes, filename: str, content_type: str) -> str:
        """Uploads raw file to staging bucket. Returns object name."""
        if self.use_local:
            path = os.path.join(self.local_base, settings.STAGING_BUCKET, filename)
            with open(path, "wb") as f:
                f.write(file_data)
            return filename
            
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

    def upload_to_secure(self, file_data: bytes, filename: str, content_type: str) -> str:
        """Uploads processed file to secure bucket. Returns object name."""
        if self.use_local:
            path = os.path.join(self.local_base, settings.SECURE_BUCKET, filename)
            with open(path, "wb") as f:
                f.write(file_data)
            return filename

        try:
            result = self.client.put_object(
                settings.SECURE_BUCKET,
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
        """
        if self.use_local:
            src = os.path.join(self.local_base, settings.STAGING_BUCKET, staging_filename)
            dst = os.path.join(self.local_base, settings.SECURE_BUCKET, secure_filename)
            if os.path.exists(src):
                # Copy then remove
                shutil.copy2(src, dst)
                os.remove(src)
            return

        self.client.copy_object(
            settings.SECURE_BUCKET,
            secure_filename,
            CopySource(settings.STAGING_BUCKET, staging_filename)
        )
        self.client.remove_object(settings.STAGING_BUCKET, staging_filename)

    def delete_file(self, bucket: str, filename: str):
        """Generic delete file from bucket."""
        if self.use_local:
            path = os.path.join(self.local_base, bucket, filename)
            if os.path.exists(path):
                os.remove(path)
            return

        try:
            self.client.remove_object(bucket, filename)
        except S3Error as e:
            # If checking logs, we might want to know, but usually idempotent
            pass

    def delete_secure(self, filename: str):
        self.delete_file(settings.SECURE_BUCKET, filename)
    
    def download_to_temp(self, bucket: str, filename: str, temp_path: str):
        if self.use_local:
            src = os.path.join(self.local_base, bucket, filename)
            shutil.copy2(src, temp_path)
            return

        self.client.fget_object(bucket, filename, temp_path)

    def get_file(self, bucket: str, filename: str):
        """Returns a MinIO response object which is streamable, or open file object."""
        if self.use_local:
            path = os.path.join(self.local_base, bucket, filename)
            return open(path, "rb")

        try:
            return self.client.get_object(bucket, filename)
        except S3Error as e:
            raise Exception(f"S3 Get Error: {e}")

storage_service = StorageService()
