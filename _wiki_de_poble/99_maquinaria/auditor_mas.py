import os
import re

WIKI_DIR = "_wiki_de_poble"
# El llistat d'esquerdes que hem de purgar:
TERMES_PROSCRITS = ["the wait paradigm", "state-of-the-art", "the gallet", "pouchdb", "44px", "44x44", ".gemini"]

def auditar_mas():
    print("🚜 INICIANT EL COMPILADOR DE COHERÈNCIA...\n")
    if not os.path.exists(WIKI_DIR):
        print(f"❌ Error: No s'ha trobat el directori '{WIKI_DIR}'.")
        return

    arxius_audit = []
    nodes_existents = set()
    for root, dirs, files in os.walk(WIKI_DIR):
        for file in files:
            if file.endswith(".md"):
                if file == "SKILL.md":
                    nodes_existents.add(f"{os.path.basename(root)}/SKILL")
                else:
                    nodes_existents.add(file.replace(".md", ""))
                if "08_arxiu_historic" not in root and "06_actes_marmota" not in root and "MACRO_WIKI" not in file and file != "00_LLIBRE_SINTETIC_DE_POBLE.md":
                    arxius_audit.append(os.path.join(root, file))

    errors = 0

    for arxiu in arxius_audit:
        with open(arxiu, 'r', encoding='utf-8') as f:
            contingut = f.read()
            nom_arxiu = os.path.basename(arxiu)

            # Detectar enllaços orfes (Link Rot)
            enllacos = re.findall(r'\[\[(.*?)\]\]', contingut)
            for enllac in enllacos:
                enllac_net = enllac.split('|')[0].strip()
                if enllac_net not in nodes_existents:
                    print(f"🚨 ENLLAÇ ORFE: '{nom_arxiu}' crida a '[[{enllac_net}]]', però no existeix al Mas.")
                    errors += 1

            # Detectar termes proscrits, il·legalitats i fals valencià
            for terme in TERMES_PROSCRITS:
                if terme.lower() in contingut.lower():
                    print(f"💀 CONTRADICCIÓ DETECTADA: Terme il·legal '{terme}' trobat a '{nom_arxiu}'.")
                    errors += 1

    if errors == 0:
        print("✅ EL MAS ÉS PUR. Zero contradiccions i zero pèrdues de memòria.")
    else:
        print(f"\n⚠️ S'han detectat {errors} esquerdes. Esporga-les!")

if __name__ == "__main__":
    auditar_mas()
