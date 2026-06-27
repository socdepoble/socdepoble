import os

INPUT_FILE = "_wiki_de_poble/09_recursos_ia/260627_1945_prompt_macro_wiki_pedra_seca.md"
OUTPUT_DIR = "_wiki_de_poble/09_recursos_ia/split"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Split by the file separator we use in the macro wiki
parts = content.split("## 📄 ARXIU:")

# Part 0 is the introduction.
# We have 33 files roughly, so let's make 4 files of ~8 files each.
chunks = []
current_chunk = parts[0]
count = 0

for part in parts[1:]:
    current_chunk += "## 📄 ARXIU:" + part
    count += 1
    if count >= 10:
        chunks.append(current_chunk)
        current_chunk = ""
        count = 0

if current_chunk:
    chunks.append(current_chunk)

for i, chunk in enumerate(chunks):
    out_name = os.path.join(OUTPUT_DIR, f"260627_1945_prompt_macro_wiki_pedra_seca_PART_{i+1}_de_{len(chunks)}.md")
    with open(out_name, "w", encoding="utf-8") as f:
        f.write(chunk)
    print(f"✅ Generat: {out_name} (Mida: {len(chunk)} bytes)")

