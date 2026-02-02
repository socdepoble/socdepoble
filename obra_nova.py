import os
from pathlib import Path

# --- CONFIGURACIÓ DE L'OBRA ---
PROJECT_NAME = "soc-de-poble-core"
BASE_DIR = Path(PROJECT_NAME)

# --- ESTRUCTURA DE LA MASIA (Basada en Local-First & Rhizome DB) ---
STRUCTURE = {
    "village_core": [  # LA SALA DE MÀQUINES (Python/Logic)
        "__init__.py",
        "main.py",
        "config.py",
        "rhizome/__init__.py",       # El Cervell Matemàtic
        "rhizome/eg_walker.py",      # Sincronització eficient (Text Pla)
        "rhizome/peritext.py",       # Gestió de Text Ric (Receptes, Història)
        "rhizome/security.py",       # DIDs i Encriptació Zero-Trust
        "iaia_modules/__init__.py",  # La Saviesa (Traductor Lèxic)
        "iaia_modules/agri_context.py" # Dades climàtiques i plagues
    ],
    "solar_ui": [  # LA GALERIA (Frontend PWA)
        "index.html",
        "manifest.json",             # Configuració PWA (Instal·lable)
        "service-worker.js",         # Gestió Offline
        "static/css/nano_banana.css",# Estils Tier GOD (Glassmorphism, Zero Radius)
        "static/js/app.js",
        "static/js/haptics.js",      # Feedback Tàctil (El Batec)
        "assets/master/"             # Arxiu d'Or (Logos intocables)
    ],
    "data_store": [  # EL REBOST (Dades Locals)
        "local_db.sqlite",           # Placeholder per a la DB local
        "sync_queue.json"            # Cua de sincronització pendent
    ],
    "docs": [ # DOCUMENTACIÓ MESTRA
        "[MASTER] DOCTRINA.md",      # La Llei (Colors, Lèxic)
        "[CONTEXT] MEMORIA.md"       # Històric de decisions
    ]
}

# --- CONTINGUT LLAVOR (SEED CONTENT) ---
SEEDS = {
    "docs/[MASTER] DOCTRINA.md": """# [MASTER] DOCTRINA SÓC DE POBLE
> Font de Veritat Absoluta.
1. **Lèxic**: No es diu "recol·lectar", es diu "esmunyir".
2. **Disseny**: Zero Radius en imatges. Colors: Terracotta (#9A6C63) i Verd Serra (#556B2F).
3. **Arquitectura**: Local-First. Les dades viuen al dispositiu.
""",
    "solar_ui/static/css/nano_banana.css": """/* ESTÈTICA NANO BANANA: TIER GOD */
:root {
    --color-terracotta: #9A6C63;
    --color-olivera: #556B2F;
    --color-neon-data: #00F2FF; /* Dades Vives */
    --glass-bg: rgba(20, 20, 20, 0.7);
    --radius-hard: 0px; /* La terra és dura */
}
""",
    "village_core/rhizome/eg_walker.py": """# Implementació de l'Algorisme Eg-walker
# Objectiu: Sincronització eficient amb baix consum de RAM
class EgWalker:
    def __init__(self):
        self.history_graph = []
        pass
"""
}

def picar_pedra():
    print(f"🚜 Iniciant obres al solar: {PROJECT_NAME}...")
    
    # 1. Crear directoris
    if not BASE_DIR.exists():
        BASE_DIR.mkdir()
    
    for folder, files in STRUCTURE.items():
        folder_path = BASE_DIR / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        print(f"   📁 Creat fonament: {folder}/")
        
        for file in files:
            file_path = folder_path / file
            if "." not in str(file).split("/")[-1]: # És un directori
                file_path.mkdir(parents=True, exist_ok=True)
            else:
                file_path.parent.mkdir(parents=True, exist_ok=True)
                file_path.touch()
                print(f"      📄 Col·locada pedra: {file}")

    # 2. Injectar contingut llavor (L'Ànima)
    for file_key, content in SEEDS.items():
        path = BASE_DIR / file_key
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
    
    print("\n✨ OBRA ACABADA. L'ESQUELET DE LA MASIA ESTÀ EN PEU.")

if __name__ == "__main__":
    picar_pedra()
