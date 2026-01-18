import pytesseract
from pdf2image import convert_from_path
import logging
import os

logger = logging.getLogger(__name__)

class OCRProcessor:
    def process_pdf(self, file_path: str) -> str:
        """
        Convert PDF to Images -> OCR -> Text.
        Use this when standard extraction fails (Scanned PDFs).
        """
        text = ""
        try:
            logger.info(f"Starting OCR for {file_path}")
            # Convert PDF to list of PIL images
            images = convert_from_path(file_path)
            
            for i, image in enumerate(images):
                # Extract text from image
                page_text = pytesseract.image_to_string(image)
                text += f"\n\n--- Page {i+1} (OCR) ---\n{page_text}"
            
            logger.info(f"OCR Complete. Extracted {len(text)} characters.")
            return text
                
        except Exception as e:
            logger.error(f"OCR Process Failed: {e}")
            return ""

ocr_processor = OCRProcessor()
