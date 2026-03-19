"""
Compare embedded OCR (PyMuPDF) vs marker-pdf OCR on a few PDFs.
Tests sparse/minimal PDFs to see if marker would help.
"""

import os
import re
import fitz
from marker.converters.pdf import PdfConverter
from marker.config.parser import ConfigParser
from marker.models import create_model_dict

PDF_DIR = os.path.join(os.path.dirname(__file__), "..", "static_assets", "shotlist_pdfs")

# Test these specific PDFs - mix of quality tiers from the spot check
TEST_PDFS = [
    "FR-2350.pdf",   # near_empty (2 chars via PyMuPDF)
    "FR-2151.pdf",   # sparse (191 chars)
    "FR-05992012-07-17.pdf",  # minimal (439 chars)
    "FR-0508.pdf",   # minimal (464 chars)
    "FR-3403.pdf",   # rich (4178 chars) - for comparison
]

# Initialize marker models once (expensive)
_marker_converter = None
def _get_marker_converter():
    global _marker_converter
    if _marker_converter is None:
        config_parser = ConfigParser({"output_format": "markdown"})
        config = config_parser.generate_config_dict()
        artifacts = create_model_dict()
        _marker_converter = PdfConverter(artifact_dict=artifacts, config=config)
    return _marker_converter

def extract_pymupdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text() for page in doc)
    doc.close()
    return text.strip()

def extract_marker(pdf_path: str) -> str:
    converter = _get_marker_converter()
    rendered = converter(pdf_path)
    return rendered.markdown.strip()

def clean_marker_text(markdown: str) -> str:
    """Strip markdown formatting to get plain text for comparison."""
    text = re.sub(r"\|", " ", markdown)           # table pipes
    text = re.sub(r"<[^>]+>", " ", text)          # HTML tags
    text = re.sub(r"#{1,6}\s*", "", text)          # headings
    text = re.sub(r"\*{1,2}([^*]+)\*{1,2}", r"\1", text)  # bold/italic
    text = re.sub(r"\s{2,}", " ", text)
    return "\n".join(ln for ln in text.splitlines() if len(ln.strip()) > 3)

def word_count(text: str) -> int:
    return len(text.split())

def main():
    for pdf_name in TEST_PDFS:
        pdf_path = os.path.join(PDF_DIR, pdf_name)
        if not os.path.exists(pdf_path):
            print(f"SKIP: {pdf_name} not found")
            continue
        
        print(f"\n{'='*80}")
        print(f"PDF: {pdf_name}")
        print(f"{'='*80}")
        
        # PyMuPDF extraction
        pymupdf_text = extract_pymupdf(pdf_path)
        print(f"\n--- PyMuPDF ({len(pymupdf_text)} chars, {word_count(pymupdf_text)} words) ---")
        print(pymupdf_text[:500])
        
        # Marker extraction
        print(f"\n--- Running marker... ---")
        marker_md = extract_marker(pdf_path)
        marker_clean = clean_marker_text(marker_md)
        print(f"--- Marker raw MD ({len(marker_md)} chars) → cleaned ({len(marker_clean)} chars, {word_count(marker_clean)} words) ---")
        print(marker_clean[:500])
        
        # Comparison
        pymupdf_words = set(pymupdf_text.lower().split())
        marker_words = set(marker_clean.lower().split())
        only_in_marker = marker_words - pymupdf_words
        only_in_pymupdf = pymupdf_words - marker_words
        
        print(f"\n--- Comparison ---")
        print(f"  PyMuPDF unique words: {len(pymupdf_words)}")
        print(f"  Marker unique words:  {len(marker_words)}")
        print(f"  Words only in marker: {len(only_in_marker)}")
        if only_in_marker:
            print(f"    Examples: {list(only_in_marker)[:15]}")
        print(f"  Words only in PyMuPDF: {len(only_in_pymupdf)}")
        if only_in_pymupdf:
            print(f"    Examples: {list(only_in_pymupdf)[:15]}")

if __name__ == "__main__":
    main()
