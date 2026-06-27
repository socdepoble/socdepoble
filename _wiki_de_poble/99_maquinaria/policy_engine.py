import os
import glob
import sys

# Motor de Polítiques per fer complir la Constitució (V21)

WIKI_DIR = "../"

def check_legacy_paths():
    print("🛡️ Iniciant Policy Engine: Comprovant rutes llegat...")
    legacy_terms = ["_SKILLS/", "PouchDB", "Masía"]
    errors = 0
    
    # Recursively check markdown files
    for root, dirs, files in os.walk(WIKI_DIR):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for term in legacy_terms:
                        if term in content:
                            print(f"[FATAL ERROR] Terme prohibit '{term}' trobat a: {filepath}")
                            errors += 1
                            
    if errors == 0:
        print("✅ Policy Engine: Cap terme llegat prohibit detectat.")
    else:
        print(f"❌ Policy Engine: Es detecten {errors} violacions de la política de llegat.")
        sys.exit(1)

if __name__ == "__main__":
    check_legacy_paths()
