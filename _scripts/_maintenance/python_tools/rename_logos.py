import os
import glob
import shutil

# 1. Trash the old "rect" SVG
trash_dir = '_PAPERERA_OBSOLETA/logos_vells'
os.makedirs(trash_dir, exist_ok=True)

old_files = glob.glob('**/logo-socdepoble-rect.svg', recursive=True)
for f in old_files:
    if os.path.exists(f):
        dst = os.path.join(trash_dir, f.replace('/', '_'))
        shutil.move(f, dst)
        print(f"Trashed: {f}")

# 2. Copy the correct ones to public
pub_master = 'public/assets/master'
os.makedirs(pub_master, exist_ok=True)

for svg in glob.glob('docs/Identitat/*.svg'):
    shutil.copy(svg, pub_master)
    print(f"Copied {svg} to {pub_master}")

# 3. Replace in all JS/JSX files
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'logo-socdepoble-rect.svg' in content:
                content = content.replace('logo-socdepoble-rect.svg', 'logo-socdepoble-rect-blanc.svg')
                print(f"Updated references in {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

# Update registry JSON if exists
if os.path.exists('public/assets/media_registry.json'):
    with open('public/assets/media_registry.json', 'r', encoding='utf-8') as f:
        content = f.read()
    if 'logo-socdepoble-rect.svg' in content:
        content = content.replace('logo-socdepoble-rect.svg', 'logo-socdepoble-rect-blanc.svg')
        with open('public/assets/media_registry.json', 'w', encoding='utf-8') as f:
            f.write(content)

