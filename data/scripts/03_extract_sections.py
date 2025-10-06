import os, json, glob, regex as re
import trafilatura, fitz, pdfplumber
from bs4 import BeautifulSoup
from tqdm import tqdm

DOWN = "data/downloaded"
OUT  = "data/processed/passages.jsonl"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

SECTION_HINTS = ["abstract","introduction","methods","results","discussion","conclusion","conclusions"]

def load_image_metadata(study_id):
    """Load image metadata for a study if it exists"""
    images_metadata_path = os.path.join(DOWN, f"{study_id}_images.json")
    if os.path.exists(images_metadata_path):
        try:
            with open(images_metadata_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load image metadata for {study_id}: {e}")
    return []

def read_html(path):
    html = open(path, encoding="utf-8", errors="ignore").read()
    text = trafilatura.extract(html, include_tables=False) or ""
    if not text:
        soup = BeautifulSoup(html, "lxml")
        text = soup.get_text("\n", strip=True)
    return text

def read_pdf(path):
    try:
        text = ""
        with pdfplumber.open(path) as pdf:
            for p in pdf.pages:
                text += p.extract_text() or ""
        return text
    except Exception:
        text = ""
        doc = fitz.open(path)
        for page in doc:
            text += page.get_text()
        return text

def split_sections(text):
    chunks, lines, section, buf = [], [l for l in text.splitlines() if l.strip()], "unknown", []
    for l in lines:
        key = l.strip().lower()
        if any(k in key and len(l) < 120 for k in SECTION_HINTS):
            if buf: chunks.append((section, "\n".join(buf))); buf = []
            section = re.sub(r"[^a-z]","", key)
        else:
            buf.append(l)
    if buf: chunks.append((section, "\n".join(buf)))
    return chunks

def to_sentences(block):
    sents = re.split(r'(?<=[\.\?\!])\s+(?=[A-ZÁÉÍÓÚÑ])', block)
    return [s.strip() for s in sents if len(s.strip())>30]

with open(OUT, "w", encoding="utf-8") as fout:
    htmls = glob.glob(os.path.join(DOWN, "*.html"))
    for html_path in tqdm(htmls):
        base = os.path.splitext(html_path)[0]
        pdf_path = base + ".pdf"
        study_id = os.path.basename(base)

        # Load image metadata for this study
        image_metadata = load_image_metadata(study_id)

        text = read_html(html_path) if os.path.exists(html_path) else ""
        if not text and os.path.exists(pdf_path):
            text = read_pdf(pdf_path)
        if not text: 
            continue

        for sec, block in split_sections(text):
            for j, sent in enumerate(to_sentences(block)):
                rec = {
                    "study_id": study_id,
                    "section": sec,
                    "sent_id": j,
                    "text": sent,
                    "source_path": html_path if os.path.exists(html_path) else pdf_path,
                    "anchor": f"{study_id}#{sec}-{j}",
                    "images": image_metadata  # Include all images for this study
                }
                fout.write(json.dumps(rec, ensure_ascii=False) + "\n")

print("OK ->", OUT)
