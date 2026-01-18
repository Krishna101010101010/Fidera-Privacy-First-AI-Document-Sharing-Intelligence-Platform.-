import json
import subprocess
import shutil
from pathlib import Path
from typing import Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class MetadataService:
    def __init__(self):
        self.exiftool_cmd = "exiftool"

    def _check_exiftool(self) -> bool:
        """Check if exiftool is installed."""
        return shutil.which(self.exiftool_cmd) is not None

    def extract_metadata(self, file_path: str) -> Dict[str, Any]:
        """
        Extract all metadata from a file using ExifTool.
        Returns a dictionary of Key: Value.
        """
        if not self._check_exiftool():
            logger.warning("ExifTool not found! Returning mock metadata.")
            return {"System": "ExifTool not installed", "Warning": "Please install exiftool"}

        try:
            # -j for JSON output, -g for group names (optional, skipping for flat dict)
            result = subprocess.run(
                [self.exiftool_cmd, "-j", file_path],
                capture_output=True,
                text=True,
                check=True
            )
            data = json.loads(result.stdout)
            return data[0] if data else {}
        except Exception as e:
            logger.error(f"Metadata extraction failed: {e}")
            return {"Error": str(e)}

    def generate_clean_preview(self, original_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a preview of what the metadata WILL look like after cleaning.
        Basically filters down to safe fields only (MIMEType, Size, etc.)
        """
        safe_keys = ["SourceFile", "ExifToolVersion", "FileName", "Directory", "FileSize", "FileModifyDate", "FileAccessDate", "FileInodeChangeDate", "FilePermissions", "FileType", "FileTypeExtension", "MIMEType", "PDFVersion", "Linearized", "PageCount"]
        
        clean_preview = {k: v for k, v in original_metadata.items() if k in safe_keys}
        clean_preview["_NOTE"] = "All other data including GPS, Author, Creator, Software will be REMOVED."
        return clean_preview

    def sanitize_file(self, input_path: str, output_path: str) -> bool:
        """
        Creates a sanitized copy of the file by stripping metadata.
        Command: exiftool -all= -o output_path input_path
        """
        if not self._check_exiftool():
            logger.warning("ExifTool not found! performing simple copy.")
            shutil.copy2(input_path, output_path)
            return False

        try:
            # -all= removes all metadata
            # -o writes to new file
            subprocess.run(
                [self.exiftool_cmd, "-all=", "-o", output_path, input_path],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE
            )
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Sanitization failed: {e.stderr.decode()}")
            return False

metadata_service = MetadataService()
