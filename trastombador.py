import bs4
import json
import time
import os
from datetime import datetime

# CONFIGURACIÓ [MASTER]
FITXER_ENTRADA = "/Users/javillinares/Documents/Antigravity/Recursos per incloure/RaindropBookmarks.htm"
FITXER_EIXIDA = "rhizome_seed_data.json"

def executar_trastombat():
    print("🚜 [TRASTOMBADOR] Iniciant el procés de sembra digital...")
    
    if not os.path.exists(FITXER_ENTRADA):
        print(f"❌ Error: No s'ha trobat el fitxer {FITXER_ENTRADA}")
        return

    with open(FITXER_ENTRADA, "r", encoding="utf-8") as f:
        contingut = f.read()

    soup = bs4.BeautifulSoup(contingut, "html.parser")
    links = soup.find_all("a")
    
    recursos = []
    total_links = 0
    
    print(f"📖 Llegint {len(links)} marcadors de la collita de Raindrop...")

    for link in links:
        titol = link.text.strip()
        url = link.get("href")
        data_unix = int(link.get("add_date", time.time()))
        tags_raw = link.get("tags", "")
        etiquetes = [t.strip() for t in tags_raw.split(",") if t.strip()]
        cover = link.get("data-cover", "")
        important = link.get("data-important", "false") == "true"
        
        # L'escut o col·lecció sol estar en el header H3 previ en el format Netscape
        parent_h3 = link.find_previous("h3")
        calaix = parent_h3.text.strip() if parent_h3 else "General"

        recurs = {
            "id": f"rd-{data_unix}-{total_links}",
            "type": "link",
            "title": titol,
            "url": url,
            "created_at": datetime.fromtimestamp(data_unix).isoformat() if data_unix else datetime.now().isoformat(),
            "metadata": {
                "collection": calaix,
                "tags": etiquetes,
                "cover_url": cover,
                "is_important": important,
                "source": "raindrop_import"
            },
            "sync_state": "synced"
        }
        
        recursos.append(recurs)
        total_links += 1

    # Estructura final compatible amb el RhizomeManager/SeedService
    data_final = {
        "version": "1.5.6-BATEGA",
        "generated_at": datetime.now().isoformat(),
        "total_seeds": total_links,
        "seeds": recursos
    }

    with open(FITXER_EIXIDA, "w", encoding="utf-8") as f:
        json.dump(data_final, f, indent=4, ensure_ascii=False)

    print(f"✅ [ÈXIT] S'han trastombat {total_links} llavors a {FITXER_EIXIDA}.")
    print("🌾 El gra ja està net i preparat per a la sembra a l'aplicació.")

if __name__ == "__main__":
    executar_trastombat()
