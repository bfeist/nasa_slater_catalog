"""
Spot-check embedded OCR quality across a random sample of shotlist PDFs.
Extracts text using PyMuPDF and reports statistics on text quality.
"""

import os
import random
import re
import fitz

PDF_DIR = os.path.join(os.path.dirname(__file__), "..", "static_assets", "shotlist_pdfs")

def extract_text(pdf_path: str) -> str:
    """Extract embedded text from a PDF using PyMuPDF."""
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text() for page in doc)
    doc.close()
    return text.strip()

def classify_quality(text: str) -> str:
    """Classify text quality into tiers."""
    length = len(text)
    if length == 0:
        return "empty"
    if length < 50:
        return "near_empty"
    if length < 200:
        return "sparse"
    if length < 500:
        return "minimal"
    return "rich"

def word_count(text: str) -> int:
    return len(text.split())

def alpha_ratio(text: str) -> float:
    """Ratio of alphabetic characters to total non-whitespace characters."""
    non_ws = re.sub(r"\s", "", text)
    if not non_ws:
        return 0.0
    alpha = sum(1 for c in non_ws if c.isalpha())
    return alpha / len(non_ws)

def main():
    all_pdfs = [f for f in os.listdir(PDF_DIR) if f.endswith(".pdf")]
    print(f"Total PDFs in directory: {len(all_pdfs)}")
    
    # Get prefix distribution
    prefixes = {}
    for f in all_pdfs:
        prefix = re.match(r"^([A-Za-z0-9]+-[A-Za-z]*)", f)
        if prefix:
            p = prefix.group(1).split("-")[0] if "-" in prefix.group(1) else prefix.group(1)
            # Simplify to just the alpha prefix before numbers
            p = re.match(r"^[A-Za-z\-]+", f)
            p = p.group(0).rstrip("-") if p else "unknown"
        else:
            p = "unknown"
        prefixes[p] = prefixes.get(p, 0) + 1
    
    print(f"\nPrefix distribution:")
    for p, count in sorted(prefixes.items(), key=lambda x: -x[1])[:15]:
        print(f"  {p}: {count}")
    
    # Sample 100 random PDFs, stratified across different prefixes
    random.seed(42)
    sample_size = 100
    sample = random.sample(all_pdfs, min(sample_size, len(all_pdfs)))
    
    results = []
    quality_counts = {"empty": 0, "near_empty": 0, "sparse": 0, "minimal": 0, "rich": 0}
    
    print(f"\n{'='*80}")
    print(f"Checking {len(sample)} random PDFs for embedded OCR text quality...")
    print(f"{'='*80}\n")
    
    for i, pdf_name in enumerate(sample):
        pdf_path = os.path.join(PDF_DIR, pdf_name)
        try:
            text = extract_text(pdf_path)
            quality = classify_quality(text)
            quality_counts[quality] += 1
            ar = alpha_ratio(text)
            wc = word_count(text)
            results.append({
                "name": pdf_name,
                "chars": len(text),
                "words": wc,
                "quality": quality,
                "alpha_ratio": ar,
                "text_preview": text[:200].replace("\n", " ") if text else "(empty)",
            })
        except Exception as e:
            print(f"  ERROR: {pdf_name}: {e}")
            quality_counts["empty"] += 1
            results.append({"name": pdf_name, "chars": 0, "words": 0, "quality": "error", "alpha_ratio": 0, "text_preview": str(e)})
    
    # Summary
    print(f"\n{'='*80}")
    print(f"QUALITY DISTRIBUTION (n={len(sample)})")
    print(f"{'='*80}")
    for tier, count in quality_counts.items():
        pct = count / len(sample) * 100
        bar = "█" * int(pct / 2)
        print(f"  {tier:12s}: {count:4d} ({pct:5.1f}%) {bar}")
    
    # Show some examples from each tier
    for tier in ["empty", "near_empty", "sparse", "minimal", "rich"]:
        tier_results = [r for r in results if r["quality"] == tier]
        if tier_results:
            print(f"\n--- Examples: {tier} ({len(tier_results)} total) ---")
            for r in tier_results[:3]:
                print(f"  {r['name']}: {r['chars']} chars, {r['words']} words, alpha_ratio={r['alpha_ratio']:.2f}")
                preview = r['text_preview'][:150]
                print(f"    Preview: {preview}")
    
    # Show 5 full "rich" text extractions for manual review
    print(f"\n{'='*80}")
    print(f"FULL TEXT SAMPLES (5 'rich' PDFs, first 800 chars each)")
    print(f"{'='*80}")
    rich_results = [r for r in results if r["quality"] == "rich"]
    for r in rich_results[:5]:
        pdf_path = os.path.join(PDF_DIR, r["name"])
        text = extract_text(pdf_path)
        print(f"\n--- {r['name']} ({r['chars']} chars, {r['words']} words) ---")
        print(text[:800])
        print("...")

if __name__ == "__main__":
    main()
