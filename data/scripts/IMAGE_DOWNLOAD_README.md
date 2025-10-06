# Image Download Functionality

This document describes the modifications made to the data processing scripts to include image downloading and metadata tracking.

## Changes Made

### 1. Updated Dependencies (`requirements.txt`)
Added the following packages for image processing:
- `requests` - For downloading images
- `beautifulsoup4` - For HTML parsing
- `lxml` - For XML/HTML parsing
- `trafilatura` - For text extraction
- `fitz` - For PDF processing
- `pdfplumber` - For PDF text extraction
- `tqdm` - For progress bars
- `regex` - For text processing
- `pandas` - For data manipulation
- `Pillow` - For image processing and optimization
- `urllib3` - For URL handling

### 2. Modified `02_download_pages.py`
- **Added image downloading function**: `download_images(html, base_url, study_id)`
  - Extracts all `<img>` tags from HTML content
  - Downloads images to `data/downloaded/images/` directory
  - Handles relative and absolute URLs
  - Optimizes images (converts to JPEG, reduces quality to 85%)
  - Saves metadata including original URL, filename, alt text, and title
- **Updated main processing loop**:
  - Calls image downloading for each article
  - Saves image metadata as JSON files (`{study_id}_images.json`)
  - Creates organized directory structure

### 3. Modified `03_extract_sections.py`
- **Added image metadata loading**: `load_image_metadata(study_id)`
  - Loads image metadata from JSON files created during download
  - Handles missing metadata gracefully
- **Updated passage extraction**:
  - Includes image metadata in each extracted passage
  - Links images to their corresponding study content

### 4. Modified `04_make_findings_basic.py`
- **Updated findings structure**:
  - Includes image metadata in findings
  - Preserves image information throughout the analysis pipeline

## Directory Structure

```
data/
├── downloaded/
│   ├── images/                    # Downloaded images
│   │   ├── 0001_study_img_001.jpg
│   │   ├── 0001_study_img_002.png
│   │   └── ...
│   ├── 0001_study_name.html
│   ├── 0001_study_name.pdf
│   ├── 0001_study_name_images.json  # Image metadata
│   └── ...
├── processed/
│   ├── passages.jsonl            # Now includes image metadata
│   ├── findings.jsonl            # Now includes image metadata
│   └── ...
└── ...
```

## Image Metadata Structure

Each image metadata entry contains:
```json
{
  "original_url": "https://example.com/image.jpg",
  "filename": "0001_study_img_001.jpg",
  "local_path": "data/downloaded/images/0001_study_img_001.jpg",
  "alt_text": "Description of the image",
  "title": "Image title"
}
```

## Usage

The scripts work exactly as before, but now also download and track images:

1. **Run the pipeline as usual**:
   ```bash
   python 01_resolve_links.py
   python 02_download_pages.py
   python 03_extract_sections.py
   python 04_make_findings_basic.py
   python 05_aggregates.py
   ```

2. **Images are automatically downloaded** during step 2
3. **Image metadata is included** in all subsequent processing steps
4. **Images are optimized** for storage efficiency

## Features

- **Automatic image detection**: Finds all `<img>` tags in HTML content
- **URL resolution**: Handles both relative and absolute image URLs
- **Image optimization**: Converts images to JPEG format with 85% quality
- **Metadata preservation**: Saves alt text, titles, and original URLs
- **Error handling**: Gracefully handles failed downloads
- **Organized storage**: Images stored in dedicated directory with descriptive filenames
- **Integration**: Seamlessly integrated with existing text extraction pipeline

## Testing

A test script `test_image_download.py` is provided to verify the functionality:
```bash
python test_image_download.py
```

This will test the image downloading with sample placeholder images and verify the metadata handling.
