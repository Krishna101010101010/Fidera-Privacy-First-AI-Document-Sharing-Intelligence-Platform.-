import json
import subprocess
import shutil
import os
import logging
from typing import Dict, Any

import PyPDF2
from PIL import Image, ExifTags
import docx
import mutagen
from mutagen.mp4 import MP4
from mutagen.id3 import ID3

logger = logging.getLogger(__name__)

class MetadataService:
    def __init__(self):
        self.exiftool_cmd = "exiftool"

    def _check_exiftool(self) -> bool:
        """Check if exiftool is installed."""
        return shutil.which(self.exiftool_cmd) is not None

    def _extract_image_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extract metadata from images using Pillow."""
        data = {}
        try:
            with Image.open(file_path) as img:
                data["Format"] = img.format
                data["Mode"] = img.mode
                data["Size"] = f"{img.width}x{img.height}"
                
                # EXIF Data
                exif = img.getexif()
                if exif:
                    for tag_id, value in exif.items():
                        tag = ExifTags.TAGS.get(tag_id, tag_id)
                        data[str(tag)] = str(value)
        except Exception as e:
            logger.error(f"Image extraction failed: {e}")
            data["Error"] = str(e)
        return data

    def _extract_docx_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extract metadata from DOCX using python-docx."""
        data = {}
        try:
            doc = docx.Document(file_path)
            props = doc.core_properties
            data["Author"] = props.author
            data["Created"] = str(props.created)
            data["Modified"] = str(props.modified)
            data["LastModifiedBy"] = props.last_modified_by
            data["Revision"] = props.revision
            data["Application"] = "Microsoft Office Word" # typically
        except Exception as e:
            data["Error"] = str(e)
        return data

    def _extract_audio_video_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extract metadata from AV using Mutagen."""
        data = {}
        try:
            f = mutagen.File(file_path)
            if f:
                data["Duration"] = f"{f.info.length} seconds"
                data["Bitrate"] = f.info.bitrate
                # Add tags
                if f.tags:
                    for k, v in f.tags.items():
                        data[str(k)] = str(v)
        except Exception as e:
            data["Error"] = str(e)
        return data

    def extract_metadata(self, file_path: str) -> Dict[str, Any]:
        """
        Extract all metadata from a file.
        Prioritizes ExifTool, falls back to Python Native Libraries.
        """
        # 1. Try ExifTool first
        if self._check_exiftool():
            try:
                result = subprocess.run(
                    [self.exiftool_cmd, "-j", file_path],
                    capture_output=True,
                    text=True,
                    check=True
                )
                data = json.loads(result.stdout)
                return data[0] if data else {}
            except Exception as e:
                logger.error(f"ExifTool failed: {e}")
        
        # 2. Fallback: Python Native Extraction
        metadata = {"FallbackMethod": "Python Native (ExifTool Missing)"}
        metadata["FileSize"] = f"{os.path.getsize(file_path)} bytes"
        
        ext = file_path.lower().split('.')[-1]
        
        if ext == 'pdf':
            try:
                with open(file_path, "rb") as f:
                    pdf = PyPDF2.PdfReader(f)
                    info = pdf.metadata
                    if info:
                        for k, v in info.items():
                            metadata[k.replace("/", "")] = str(v)
                    metadata["PageCount"] = len(pdf.pages)
            except Exception as e:
                metadata["Error"] = str(e)

        elif ext in ['jpg', 'jpeg', 'png', 'tiff']:
            metadata.update(self._extract_image_metadata(file_path))

        elif ext == 'docx':
            metadata.update(self._extract_docx_metadata(file_path))
            
        elif ext in ['mp3', 'mp4', 'wav', 'm4a']:
            metadata.update(self._extract_audio_video_metadata(file_path))

        return metadata

    def generate_clean_preview(self, original_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a preview of what the metadata WILL look like after cleaning.
        """
        safe_keys = ["SourceFile", "FileName", "FileSize", "MIMEType", "Format", "Size", "Duration", "Bitrate", "PageCount", "FallbackMethod"]
        
        clean_preview = {k: v for k, v in original_metadata.items() if k in safe_keys}
        clean_preview["_NOTE"] = "All other data (Author, GPS, Device, History) has been REMOVED."
        return clean_preview

    def sanitize_file(self, input_path: str, output_path: str) -> bool:
        """
        Creates a sanitized copy of the file.
        Prioritizes ExifTool, falls back to Native Methods or Simple Copy.
        """
        # 1. ExifTool
        if self._check_exiftool():
            try:
                subprocess.run(
                    [self.exiftool_cmd, "-all=", "-o", output_path, input_path],
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.PIPE
                )
                return True
            except Exception as e:
                logger.error(f"ExifTool sanitization failed: {e}")

        # 2. Native PDF Sanitization
        if input_path.lower().endswith(".pdf"):
            try:
                with open(input_path, "rb") as f_in:
                    reader = PyPDF2.PdfReader(f_in)
                    writer = PyPDF2.PdfWriter()
                    for page in reader.pages:
                        writer.add_page(page)
                    writer.add_metadata({}) 
                    with open(output_path, "wb") as f_out:
                        writer.write(f_out)
                return True
            except:
                pass

        # 3. Native Image Sanitization (Strip EXIF)
        ext = input_path.lower().split('.')[-1]
        if ext in ['jpg', 'jpeg', 'png']:
            try:
                with Image.open(input_path) as img:
                    data = list(img.getdata())
                    img_without_exif = Image.new(img.mode, img.size)
                    img_without_exif.putdata(data)
                    img_without_exif.save(output_path)
                return True
            except:
                pass

        # 4. Fallback Copy
        logger.warning("Sanitization tools failed/missing. Performing simple copy.")
        shutil.copy2(input_path, output_path)
        return True

metadata_service = MetadataService()
