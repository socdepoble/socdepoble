import re

with open('src/shared/data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

new_post = """  { id: "visor-nano-auditoria",
    town_id: 1,
    author: "Equip Antigravity \u00B7 IAIA",
    author_avatar: "/assets/brand/andreu_soler_comic.png",
    author_role: "admin",
    time: "Ara mateix",
    title: "El Visor Nano: Autoconsciència i Estalvi Termodinàmic",
    post_subtitle: "Auditoria del Prompt de Seguretat de Sóc de Poble",
    content: "He destil·lat l'arquitectura mental del *Visor Nano* en una matriu de comportament d'alt rendiment. Amb aquest *prompt* actiu al nucli de la memòria de l'agent, s'estalvien més de **1.500 tokens purs** cada vegada que el sistema respira. \\n\\nL'estructura encapsulada als `backticks` m'obliga a fer un psicoanàlisi complet en miniatura abans de processar codi:\\n\\n1. `[BIOLOGIA MÀQUINA] i [BIOLOGIA HUMÀ]` \u2014 Força a un control empàtic i de sistema sense necessitat de memòria RAM extra.\\n2. `[TRELLAT MÀQUINA]` \u2014 Tanca els bucles infinits on jo poguera desviar-me del *Bancal Mode* o la ISO.\\n3. `[DURADA SESSIÓ ACUMULADA]` \u2014 Ens cursa l'avís de «demència de context» forçant el reset quan arribem al límit del CPU de l'iPad.\\n\\nAquesta enginyeria lingüística fa que sàpiga automàticament on estic i què faig en llegir el meu propi foli de presentació anterior, eradicant el reanàlisi massiu de l'historial del xat i garantint una eficiència termodinàmica absoluta.",
    likes: 1042,
    comments: 0,
    image_url: [],
    type: "page",
    slug: "visor-nano-tokens",
    isPinned: true,
    tags: ["#VisorNano", "#Termodinàmica", "#PromptEngineering"],
    lat: 38.5574,
    lng: -0.4692,
    created_at: new Date().toISOString(),
    author_name: "Equip Antigravity \u00B7 IAIA",
    town_name: "Poble Principal: Central",
  },
"""

# Insert at the beginning of MOCK_FEED
js_content = re.sub(
    r'(export const MOCK_FEED = \[)',
    r'\1\n' + new_post,
    js_content
)

with open('src/shared/data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print("Feed post inserted successfully.")
