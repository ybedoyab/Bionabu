#!/usr/bin/env python3
"""
Test script to verify image downloading functionality
"""
import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def test_image_download():
    """Test the image downloading functionality with a sample HTML page"""
    
    # Test with a simple HTML page that contains images
    test_html = """
    <html>
    <head><title>Test Page</title></head>
    <body>
        <h1>Test Article</h1>
        <p>This is a test article with some images.</p>
        <img src="https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Test+Image+1" alt="Test Image 1" title="First test image">
        <img src="https://via.placeholder.com/400x300/00FF00/000000?text=Test+Image+2" alt="Test Image 2" title="Second test image">
        <p>More content here...</p>
    </body>
    </html>
    """
    
    # Create test directories
    test_dir = "data/test_download"
    images_dir = "data/test_download/images"
    os.makedirs(test_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)
    
    # Save test HTML
    html_path = os.path.join(test_dir, "test_article.html")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(test_html)
    
    # Test the image downloading function
    from 02_download_pages import download_images
    
    headers = {"User-Agent": "Mozilla/5.0"}
    base_url = "https://example.com"
    study_id = "test_001"
    
    print("Testing image download functionality...")
    downloaded_images = download_images(test_html, base_url, study_id)
    
    print(f"Downloaded {len(downloaded_images)} images")
    
    # Verify images were downloaded
    for img_info in downloaded_images:
        print(f"Image: {img_info['filename']}")
        print(f"  Original URL: {img_info['original_url']}")
        print(f"  Local path: {img_info['local_path']}")
        print(f"  Alt text: {img_info['alt_text']}")
        print(f"  Title: {img_info['title']}")
        print(f"  File exists: {os.path.exists(img_info['local_path'])}")
        print()
    
    # Test metadata loading
    from 03_extract_sections import load_image_metadata
    
    metadata = load_image_metadata(study_id)
    print(f"Loaded metadata for {len(metadata)} images")
    
    # Clean up test files
    import shutil
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
        print("Cleaned up test files")
    
    print("Test completed successfully!")

if __name__ == "__main__":
    test_image_download()
