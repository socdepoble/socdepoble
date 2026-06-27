import requests
import json
import os
import re
import time
from urllib.parse import unquote

# Configuration
POBLES = ["La Torre de les Maçanes", "Penàguila", "Benifallim", "Alcoleja", "Cocentaina", "Muro d'Alcoi", "Gorga", "Millena", "Balones", "Benimassot"]
LANG = 'ca'
USER_AGENT = 'SocDePobleBot/1.0 (https://socdepoble.cat; javi@socdepoble.cat)'
BASE_DIR = os.path.join(os.getcwd(), 'public', 'assets', 'pobles')
ESCUTS_DIR = os.path.join(BASE_DIR, 'escuts')
VISTES_DIR = os.path.join(BASE_DIR, 'vistes')
CREDITS_FILE = os.path.join(BASE_DIR, 'credits.json')

ALLOWED_LICENSES = ['creative commons', 'cc-by', 'cc-by-sa', 'public domain', 'pd', 'cc0', 'públic', 'gnu']

def normalize_name(name):
    name = name.lower()
    name = re.sub(r'[^a-z0-9]', '_', name)
    name = re.sub(r'_+', '_', name)
    return name.strip('_')

def get_wikimedia_metadata(filename):
    """Fetches license and author metadata for a Wikimedia file."""
    api_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "prop": "imageinfo",
        "iiprop": "extmetadata",
        "titles": f"File:{filename}"
    }
    try:
        response = requests.get(api_url, params=params, headers={'User-Agent': USER_AGENT})
        data = response.json()
        pages = data.get('query', {}).get('pages', {})
        if not pages:
            return None
            
        for page_id, page_info in pages.items():
            if 'imageinfo' in page_info:
                metadata = page_info['imageinfo'][0].get('extmetadata', {})
                return {
                    'author': metadata.get('Artist', {}).get('value', 'Unknown'),
                    'license': metadata.get('LicenseShortName', {}).get('value', 'Unknown'),
                    'url': f"https://commons.wikimedia.org/wiki/File:{filename.replace(' ', '_')}"
                }
    except Exception as e:
        print(f"Error fetching metadata for {filename}: {e}")
    return None

def download_image(url, target_path):
    """Downloads an image from a URL to a local path."""
    try:
        response = requests.get(url, headers={'User-Agent': USER_AGENT})
        if response.status_code == 200:
            with open(target_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def scrape_town(town_name, credits_data):
    print(f"\n--- Processant {town_name} ---")
    norm_name = normalize_name(town_name)
    
    # 1. Search Wikipedia for the town
    api_url = f"https://{LANG}.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "prop": "images|pageimages",
        "titles": town_name,
        "pithumbsize": 1000
    }
    
    try:
        response = requests.get(api_url, params=params, headers={'User-Agent': USER_AGENT})
        data = response.json()
        pages = data.get('query', {}).get('pages', {})
        if not pages:
            print(f"Poble {town_name} no trobat.")
            return
            
        page_id = list(pages.keys())[0]
        page_info = pages[page_id]
        
        if page_id == '-1':
            print(f"Poble {town_name} no trobat a la Wikipedia.")
            return

        # Main Image (Vista)
        main_img_url = page_info.get('thumbnail', {}).get('original') or page_info.get('thumbnail', {}).get('source')
        if main_img_url:
            # Get filename from URL
            filename = unquote(main_img_url.split('/')[-1])
            # Remove thumbnail prefix if present (e.g. 800px-...)
            filename = re.sub(r'^\d+px-', '', filename)
            
            metadata = get_wikimedia_metadata(filename)
            if metadata and any(lic in metadata['license'].lower() for lic in ALLOWED_LICENSES):
                target_filename = f"img_{norm_name}_main.jpg"
                target_path = os.path.join(VISTES_DIR, target_filename)
                if download_image(main_img_url, target_path):
                    credits_data[target_filename] = metadata
                    print(f"Vista descarregada: {target_filename}")
            else:
                lic_str = metadata.get('license') if metadata else 'No trobada'
                print(f"Vista descartada per llicència: {lic_str}")

        # Coat of Arms (Escut)
        images = page_info.get('images', [])
        escut_filename = None
        for img in images:
            title = img.get('title', '')
            if 'escut' in title.lower() or 'coat of arms' in title.lower() or 'heràldica' in title.lower():
                escut_filename = title.replace('Fitxer:', '').replace('File:', '')
                break
        
        if escut_filename:
            # Get URL for the escut
            img_url_params = {
                "action": "query",
                "format": "json",
                "prop": "imageinfo",
                "iititles": f"File:{escut_filename}",
                "iiprop": "url|extmetadata"
            }
            res = requests.get(api_url, params=img_url_params, headers={'User-Agent': USER_AGENT})
            img_data = res.json()
            img_pages = img_data.get('query', {}).get('pages', {})
            if img_pages:
                img_page_id = list(img_pages.keys())[0]
                if 'imageinfo' in img_pages[img_page_id]:
                    info = img_pages[img_page_id]['imageinfo'][0]
                    img_url = info.get('url')
                    metadata = {
                        'author': info.get('extmetadata', {}).get('Artist', {}).get('value', 'Unknown'),
                        'license': info.get('extmetadata', {}).get('LicenseShortName', {}).get('value', 'Unknown'),
                        'url': f"https://commons.wikimedia.org/wiki/File:{escut_filename.replace(' ', '_')}"
                    }
                    
                    if any(lic in metadata['license'].lower() for lic in ALLOWED_LICENSES):
                        ext = os.path.splitext(escut_filename)[1]
                        target_filename = f"escut_{norm_name}{ext}"
                        target_path = os.path.join(ESCUTS_DIR, target_filename)
                        if download_image(img_url, target_path):
                            credits_data[target_filename] = metadata
                            print(f"Escut descarregat: {target_filename}")
                    else:
                        print(f"Escut descartat per llicència: {metadata['license']}")

    except Exception as e:
        print(f"Error en {town_name}: {e}")

def main():
    credits_data = {}
    if os.path.exists(CREDITS_FILE):
        with open(CREDITS_FILE, 'r') as f:
            credits_data = json.load(f)

    for town in POBLES:
        scrape_town(town, credits_data)
        time.sleep(1) # Be nice to the API

    with open(CREDITS_FILE, 'w') as f:
        json.dump(credits_data, f, indent=2)
    print("\nScraping finalitzat. Credits guardats.")

if __name__ == "__main__":
    main()
