
import os
import json
import google.generativeai as genai
from fastapi import FastAPI,  Query, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from pathlib import Path
import time
from dotenv import load_dotenv
import re

load_dotenv()  # Cargar variables de entorno desde .env

# Crear la aplicación
app = FastAPI(title="Mi API NASA Demo", version="1.0")

# Configurar CORS - comprehensive configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",  # Vite default port
        "https://bionabu.web.app",
        "https://bionabu.firebaseapp.com",
        "https://bionabu-ai-backend-spelnuireq-uc.a.run.app",
        "https://bionabu-data-backend-spelnuireq-uc.a.run.app",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
    ],
    expose_headers=[
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods", 
        "Access-Control-Allow-Headers",
        "Content-Type",
        "Authorization"
    ],
    max_age=86400,  # Cache preflight for 24 hours
)

# Custom middleware to ensure CORS headers are always present
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    """Add CORS headers to all responses."""
    response = await call_next(request)
    
    # Add CORS headers to all responses
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Accept-Language, Content-Language, Content-Type, Authorization, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Max-Age"] = "86400"
    
    return response

# Handle preflight OPTIONS requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle preflight OPTIONS requests for CORS."""
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH",
            "Access-Control-Allow-Headers": "Accept, Accept-Language, Content-Language, Content-Type, Authorization, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers",
            "Access-Control-Max-Age": "86400",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# CORS test endpoint
@app.get("/cors-test")
async def cors_test():
    """Test endpoint to verify CORS configuration."""
    return {
        "message": "CORS is working!",
        "timestamp": time.time(),
        "cors_headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Origin"
        }
    }

# Ruta raíz
@app.get("/getAll")
def get_file():
    return FileResponse(
        "./data/processed/findings.jsonl",                      # tu archivo ya existente
        media_type="application/jsonl",    # tipo de archivo
        filename="findings.jsonl"              # cómo se llamará al descargar
    )


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def prefilter_docs(query, docs, max_docs=50):
    """Filtra registros que contienen la query en cualquier campo."""
    filtered = []
    q_lower = query.lower()
    for doc in docs:
        if q_lower in json.dumps(doc).lower():
            filtered.append(doc)
        if len(filtered) >= max_docs:
            break
    return filtered

@app.get("/search")
def search(query: str = Query(..., description="Texto a buscar")):
    docs = []
    try:
        with open("./data/processed/findings.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                docs.append(json.loads(line))
    except Exception as e:
        return {"error": str(e)}

    # --- Construimos prompt ---
    prompt = f"""
    Tengo un dataset JSONL con múltiples registros (objetos JSON). Cada registro es independiente.
    
    Aquí hay una parte del dataset:
    {json.dumps(docs[:100], indent=2)}

    La búsqueda del usuario es: "{query}".

    **Tarea:** Devuelve únicamente los objetos JSON que sean directamente relevantes a la búsqueda.
    No inventes ni resumas nada. Devuelve la respuesta en **formato JSON puro**, sin ```json ni texto adicional.
    """

    response = model.generate_content(prompt)

    # Limpiar cualquier ```json``` que Gemini pueda agregar
    cleaned_text = re.sub(r"^```json|```$", "", response.text.strip(), flags=re.MULTILINE).strip()

    # Intentar convertir a lista de objetos JSON
    try:
        filtered = json.loads(cleaned_text)
    except Exception as e:
        return {"error": "No se pudo parsear la respuesta de Gemini como JSON", "raw_response": response.text}

    return JSONResponse(content={"query": query, "results": filtered})

@app.get("/searchsinia")
def search(query: str = Query(..., description="Texto a buscar")):
    results = []
    query_lower = query.lower()

    try:
        with open("./data/processed/findings.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                record = json.loads(line)
                # Revisa si la query está en cualquier campo del registro
                if any(query_lower in str(value).lower() for value in record.values() if value):
                    results.append(record)
    except Exception as e:
        return {"error": str(e)}

    return JSONResponse(content={"query": query, "results": results})


# ------------------------
# Imagenes relacionadas (para Front)
# ------------------------

class StatsQueryRequest(BaseModel):
    research_query: str
    article_urls: Optional[List[str]] = None

def _load_findings_rows() -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    findings_path = Path("./data/processed/findings.jsonl")
    if not findings_path.exists():
        return rows
    with findings_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except Exception:
                continue
    return rows

def _extract_images_from_html(html_path: Path, anchor: Optional[str]) -> List[Dict[str, Any]]:
    images: List[Dict[str, Any]] = []
    try:
        from bs4 import BeautifulSoup  # import local
        from urllib.parse import urljoin
    except Exception:
        return images

    try:
        html = html_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return images

    soup = BeautifulSoup(html, "html.parser")
    base_url = "https://pmc.ncbi.nlm.nih.gov"
    canonical = soup.find('link', rel='canonical')
    source_url = canonical['href'] if canonical and canonical.get('href') else None

    def absolutize(src: str) -> str:
        if not src:
            return src
        if src.startswith("http://") or src.startswith("https://"):
            return src
        return urljoin(base_url, src)

    img_tags: List[Any] = []
    # intentar cerca del anchor si existe
    if anchor and '#' in anchor:
        anchor_id = anchor.split('#', 1)[1]
        anchor_el = soup.select_one(f'#{re.escape(anchor_id)}')
        if anchor_el is not None:
            container = anchor_el
            for _ in range(4):
                if container.parent:
                    container = container.parent
                else:
                    break
            img_tags.extend(container.select('figure img'))
            img_tags.extend(container.select('img'))
            sib = anchor_el
            steps = 0
            while sib and steps < 8:
                sib = sib.next_sibling
                steps += 1
                try:
                    if hasattr(sib, 'select'):
                        img_tags.extend(sib.select('figure img'))
                        img_tags.extend(sib.select('img'))
                except Exception:
                    break

    # fallback global
    if not img_tags:
        img_tags = soup.select('figure img') or soup.select('img')

    seen = set()
    for img in img_tags:
        src = img.get('src') or img.get('data-src')
        if not src:
            continue
        abs_src = absolutize(src)
        if abs_src in seen:
            continue
        seen.add(abs_src)
        caption_el = None
        if img.parent and img.parent.name != 'figure' and img.parent.find_parent('figure'):
            fig = img.parent.find_parent('figure')
            caption_el = fig.find('figcaption') if fig else None
        elif img.parent and img.parent.name == 'figure':
            caption_el = img.parent.find('figcaption')
        caption_text = caption_el.get_text(strip=True) if caption_el else None
        images.append({
            "image_url": abs_src,
            "caption": caption_text,
            "source_url": source_url or base_url,
        })
        if len(images) >= 6:
            break
    # Meta og:image fallback si no se encontró nada
    if not images:
        og = soup.find('meta', attrs={"property": "og:image"}) or soup.find('meta', attrs={"name": "og:image"})
        tw = soup.find('meta', attrs={"name": "twitter:image"}) if not og else None
        og_src = og.get('content') if og and og.get('content') else (tw.get('content') if tw and tw.get('content') else None)
        if og_src:
            images.append({
                "image_url": absolutize(og_src),
                "caption": None,
                "source_url": source_url or base_url,
            })
    return images

def _extract_images_from_url(url: str) -> List[Dict[str, Any]]:
    """Extrae imágenes de una URL de artículo científico (PMC, etc.)"""
    images: List[Dict[str, Any]] = []
    try:
        import requests
        from bs4 import BeautifulSoup
        from urllib.parse import urljoin
        
        print(f"[_extract_images_from_url] Scraping: {url}")
        
        # Headers para evitar bloqueo 403 de NCBI
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        resp = requests.get(url, timeout=15, headers=headers)
        if resp.status_code != 200:
            print(f"[_extract_images_from_url] Bad status: {resp.status_code}")
            return images
            
        soup = BeautifulSoup(resp.text, "html.parser")
        base_url = url
        seen_urls = set()
        
        # Extraer PMC ID del URL para identificar el artículo
        pmc_id_match = re.search(r'/PMC(\d+)/', url)
        article_pmc_id = pmc_id_match.group(1) if pmc_id_match else 'unknown'
        print(f"[_extract_images_from_url] Article PMC ID: {article_pmc_id}")
        
        # Prioridad 1: Buscar <figure> con <img> (típico de artículos PMC)
        figures = soup.find_all('figure')
        print(f"[_extract_images_from_url] Found {len(figures)} <figure> elements")
        
        for fig in figures:
            img = fig.find('img')
            if not img:
                continue
                
            # Obtener src (puede estar en src, data-src, o dentro de un <a>)
            src = img.get('src') or img.get('data-src')
            
            # Si la imagen está dentro de un <a>, intentar obtener href (versión de alta resolución)
            parent_a = img.find_parent('a')
            high_res_src = None
            if parent_a and parent_a.get('href'):
                href = parent_a.get('href')
                print(f"[_extract_images_from_url] Found <a href='{href[:100]}...'>")
                
                # Si el href apunta a una imagen directa (.jpg, .png, etc), usarla
                if any(ext in href.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                    high_res_src = href
                    print(f"[_extract_images_from_url] Using direct image link")
                # Si el href es al visor tileshop, intentar extraer la URL de la imagen del parámetro
                elif 'tileshop' in href.lower():
                    print(f"[_extract_images_from_url] Detected tileshop link, trying to extract image")
                    # Buscar el parámetro id= en el URL
                    match = re.search(r'id=([^&]+)', href)
                    if match:
                        image_id = match.group(1)
                        print(f"[_extract_images_from_url] Extracted image_id: {image_id}")
                        
                        # El id suele tener formato: PMCID_filename.jpg
                        # Intentar extraer PMC ID del URL base si no está en el image_id
                        pmc_match = re.search(r'/PMC(\d+)/', base_url)
                        if pmc_match:
                            pmc_id = pmc_match.group(1)
                            # Construir URL directa a CDN
                            high_res_src = f"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{pmc_id}/bin/{image_id}"
                            print(f"[_extract_images_from_url] Converted to direct URL: {high_res_src}")
            
            # Usar high_res si está disponible, sino usar src original
            final_src = high_res_src if high_res_src else src
            
            # Si sigue siendo tileshop después de intentar convertir, intentar usar el src del <img> directamente
            if final_src and 'tileshop' in final_src.lower():
                # Si el src original del img es CDN, usarlo
                if src and 'cdn.ncbi.nlm.nih.gov' in src:
                    final_src = src
                    print(f"[_extract_images_from_url] Fallback to img src (CDN): {final_src[:80]}")
            
            src = final_src
            
            if not src:
                continue
            
            abs_src = urljoin(base_url, src)
            
            # Verificar que la imagen pertenece al artículo correcto (revisar PMC ID en la URL de la imagen)
            image_pmc_match = re.search(r'/(\d+)/', abs_src)
            image_pmc_id = image_pmc_match.group(1) if image_pmc_match else 'unknown'
            
            # Evitar duplicados
            if abs_src in seen_urls:
                print(f"[_extract_images_from_url] Skipping duplicate: {abs_src[:80]}")
                continue
            seen_urls.add(abs_src)
            
            # Intentar obtener caption de <figcaption>
            caption_el = fig.find('figcaption')
            caption = None
            if caption_el:
                # Obtener solo el texto, máximo 200 caracteres
                caption = caption_el.get_text(strip=True)[:200]
            
            # También intentar obtener el título del <h4>, <h3>, etc dentro del figure
            if not caption:
                title_el = fig.find(['h4', 'h3', 'h5', 'h2'])
                if title_el:
                    caption = title_el.get_text(strip=True)[:200]
            
            print(f"[_extract_images_from_url] Found image (Article PMC{article_pmc_id}, Image PMC{image_pmc_id}): {abs_src[:80]}... caption: {caption[:50] if caption else 'None'}")
            
            images.append({
                "image_url": abs_src,
                "caption": caption,
                "source_url": url,
            })
            
            if len(images) >= 12:
                break
        
        # Prioridad 2: Si no se encontraron imágenes en <figure>, buscar todas las <img>
        if not images:
            print("[_extract_images_from_url] No figures found, searching all <img> tags")
            all_imgs = soup.find_all('img')
            for img in all_imgs[:12]:
                src = img.get('src') or img.get('data-src')
                if not src:
                    continue
                abs_src = urljoin(base_url, src)
                if abs_src in seen_urls:
                    continue
                seen_urls.add(abs_src)
                
                images.append({
                    "image_url": abs_src,
                    "caption": img.get('alt'),
                    "source_url": url,
                })
        
        # Prioridad 3: og:image como último recurso
        if not images:
            print("[_extract_images_from_url] No images found, trying og:image")
            og = soup.find('meta', attrs={"property": "og:image"}) or soup.find('meta', attrs={"name": "og:image"})
            if og and og.get('content'):
                images.append({
                    "image_url": urljoin(base_url, og.get('content')),
                    "caption": None,
                    "source_url": url,
                })
        
        print(f"[_extract_images_from_url] Total images extracted: {len(images)}")
    except Exception as e:
        print(f"[_extract_images_from_url] Error: {str(e)}")
        return []
    return images

@app.post("/api/v1/stats/query-images")
def get_query_images(req: StatsQueryRequest):
    """
    Devuelve imágenes relevantes a una consulta.
    Estrategia SIMPLE: usa article_urls del request para extraer imágenes reales vía scraping.
    """
    query = (req.research_query or "").strip()
    print(f"[query-images] Received query: {query}, article_urls: {req.article_urls}")
    if not query:
        return JSONResponse(status_code=400, content={"status": "error", "message": "research_query is required"})

    results: List[Dict[str, Any]] = []
    
    # Extraer imágenes directamente de las URLs de artículos proporcionadas
    if req.article_urls:
        print(f"[query-images] Fetching images from {len(req.article_urls)} article URLs")
        max_per_article = 4  # Máximo 4 imágenes por artículo para diversidad
        seen_global = set()  # Para evitar duplicados globales entre artículos
        
        for u in (req.article_urls or [])[:5]:  # máximo 5 URLs de artículos
            if len(results) >= 12:
                break
            print(f"[query-images] Fetching from: {u}")
            imgs = _extract_images_from_url(u)
            print(f"[query-images] Extracted {len(imgs)} images from {u}")
            
            # Tomar máximo max_per_article imágenes de cada artículo, evitando duplicados globales
            added_from_article = 0
            for it in imgs:
                if added_from_article >= max_per_article:
                    break
                if len(results) >= 12:
                    break
                    
                # Evitar duplicados globales
                img_url = it.get("image_url")
                if img_url in seen_global:
                    print(f"[query-images] Skipping globally duplicate image: {img_url[:80]}")
                    continue
                
                seen_global.add(img_url)
                results.append({
                    "study_id": None,
                    "passage_anchor": None,
                    "summary": None,
                    **it,
                })
                added_from_article += 1
    
    print(f"[query-images] Final results count: {len(results)}")
    payload = {
        "status": "success",
        "research_query": query,
        "count": len(results),
        "images": results,
        "timestamp": time.time()
    }
    return JSONResponse(content=payload)