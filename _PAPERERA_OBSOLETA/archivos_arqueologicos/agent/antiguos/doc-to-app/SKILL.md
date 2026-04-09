> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/agent/antiguos/doc-to-app/SKILL.md`

---
name: doc-to-app
description: Converteix un document (PDF/text) burocràtic en una mini-app web interactiva llista per a usar al mòbil.
---

# Skill: Doc-to-App (Tràmits a la Butxaca) 🏗️📱

## Cuándo usar este skill

Quan tinguem informació en un PDF, text o notes de l'Ajuntament (ex: normatives de cremes, guies de festes, ajudes de la Xylella) i vulguem transformar-la en una mini web navegable amb cercador, filtres i seccions clares, llista per a ensenyar o compartir amb els veïns.

## Inputs necesarios (si faltan, pregunta)

1. Font: PDF o text apegat.
2. Tipus d'app: guia, tràmit, checklist, normativa, etc.
3. Prioritat: pràctica i orientada a l'acció.

## Reglas importantes

- NO retornes només text al xat. Has de crear arxius i una vista prèvia.
- No sobrescrigues res: cada execució crea una carpeta nova.
- Aplica **SEMPRE** l'SKILL `estilo-marca` de Sóc de Poble (Llei de la Boina Taronja, radis 28px, font Noto Sans SemiCondensed).
- Tots els textos de la interfície s'han de traduir al to de la "IAIA MarIA" (clar, pràctic, sense argot tecnològic ni burocràtic).
- L'app ha de funcionar perfectament en mòbil (Protocol Botiga de Diumenge).

## Estructura de salida (crear siempre)

Crea una carpeta nova dins del projecte amb el nom:
`tramit_<tema>_<YYYYMMDD_HHMM>`

Dins crea:

- `index.html` (la mini-app)
- `data.json` (les dades estructurades extretes del document)
- `README.txt` (com obrir-la i què inclou)

## Funcionalidades mínimas de la app

1. Cercador (per text).
2. Filtres (per categories/etiquetes quan tinga sentit).
3. Navegació per seccions (índex superior o lateral).
4. Disseny net, llegible, responsive (mòbil primer).
5. Botons útils i clars: "Copiar", "Marcar com complit", "Expandir".

## Workflow (orden fijo)

1. Llegir el document oficial i extraure'n l'estructura: seccions, passos, requisits, llistes.
2. Convertir-ho a un `data.json` ordenat.
3. Generar `index.html` llegint del `data.json` (sense frameworks complexos, usant el disseny Sóc de Poble).
4. Validar: que es veu bé, cerca, filtra i funciona la interacció.
5. Retornar a l'usuari: carpeta creada + quin arxiu obrir + resum.

## Output final (en chat)

Al final respon sempre amb:

- "Carpeta creada: ..."
- "Obri: .../index.html"
- Resum breu de seccions i funcionalitats incloses.
