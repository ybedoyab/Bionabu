import os, time, pathlib, requests, pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from PIL import Image
import io

IN  = "../data/interim/download_list.csv"
OUT = "../data/downloaded"
IMAGES_OUT = "../data/downloaded/images"
os.makedirs(OUT, exist_ok=True)
os.makedirs(IMAGES_OUT, exist_ok=True)

df = pd.read_csv(IN)
headers = {"User-Agent":"Mozilla/5.0"}

def sanitize(name, n=80):
    bad = '<>:"/\\|?*'
    for b in bad: name = name.replace(b,"")
    return name[:n].strip()

def try_pdf(html, base_url):
    soup = BeautifulSoup(html, "lxml")
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if ".pdf" in href.lower():
            if not href.startswith("http"):
                from urllib.parse import urljoin
                href = urljoin(base_url, href)
            return href
    return None

def extract_image_metadata(html, base_url, study_id):
    """Extract image metadata from HTML content without downloading the images"""
    soup = BeautifulSoup(html, "lxml")
    image_metadata = []
    
    # Find all img tags, but filter out UI elements and icons
    for img in soup.find_all("img", src=True):
        img_url = img["src"]
        
        # Skip data URLs, icons, and UI elements
        if (img_url.startswith("data:") or 
            "icon" in img_url.lower() or 
            "logo" in img_url.lower() or 
            "flag" in img_url.lower() or
            "button" in img_url.lower() or
            "arrow" in img_url.lower() or
            "close" in img_url.lower() or
            "menu" in img_url.lower() or
            "nav" in img_url.lower() or
            img_url.endswith('.svg') or
            'static/img' in img_url or
            'usa-icons' in img_url or
            'ncbi-logos' in img_url):
            continue
        
        # Convert relative URLs to absolute
        if not img_url.startswith("http"):
            img_url = urljoin(base_url, img_url)
        
        # Additional filtering for common image patterns in scientific articles
        if any(pattern in img_url.lower() for pattern in [
            'figure', 'fig', 'image', 'photo', 'graph', 'chart', 
            'diagram', 'plot', 'table', 'screenshot', 'result'
        ]) or any(ext in img_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp']):
            
            # Extract image metadata without downloading
            parsed_url = urlparse(img_url)
            ext = os.path.splitext(parsed_url.path)[1] or '.jpg'
            
            image_info = {
                "original_url": img_url,
                "filename": f"{study_id}_img_{len(image_metadata):03d}{ext}",
                "alt_text": img.get("alt", ""),
                "title": img.get("title", ""),
                "file_extension": ext,
                "domain": parsed_url.netloc
            }
            
            image_metadata.append(image_info)
            print(f"Found image: {image_info['filename']}")
    
    return image_metadata

for i, row in df.iterrows():
    url = row["best_url"]
    title = sanitize(str(row["title"] or f"paper_{i}"))
    base = os.path.join(OUT, f"{i:04d}_{title}")
    html_path = base + ".html"
    pdf_path  = base + ".pdf"
    images_metadata_path = base + "_images.json"

    # Skip invalid URLs
    if not url or not isinstance(url, str) or not url.startswith(('http://', 'https://')):
        print(f"SKIP {i}: Invalid URL '{url}'")
        continue

    try:
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        html = r.text
        pathlib.Path(html_path).write_text(html, encoding="utf-8")

        # Extract image metadata from the HTML page
        study_id = f"{i:04d}_{title}"
        image_metadata = extract_image_metadata(html, url, study_id)
        
        # Save image metadata
        if image_metadata:
            import json
            with open(images_metadata_path, 'w', encoding='utf-8') as f:
                json.dump(image_metadata, f, ensure_ascii=False, indent=2)

        pdf_url = try_pdf(html, url)
        if pdf_url:
            rp = requests.get(pdf_url, headers=headers, timeout=45)
            if rp.ok and rp.headers.get("Content-Type","").lower().startswith("application/pdf"):
                open(pdf_path,"wb").write(rp.content)

        time.sleep(0.5)
    except Exception as e:
        print("ERR", i, url, e)

print("Descarga terminada →", OUT)
