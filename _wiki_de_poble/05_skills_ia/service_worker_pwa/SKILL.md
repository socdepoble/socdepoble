---
name: service-worker-pwa
description: >-
  Estratègia Cache-First i actualitzacions transparents per a la PWA de Sóc de
  Poble.
authority: Consell de les 11 IAs
version: V21
created_at: '260628_0525'
updated_at: '260628_1618'
---
# 🌐 SKILL: Service Worker & PWA

## 1. Radicalment Offline-First
- El Service Worker usarà una estratègia **Cache-First** per a tots els assets de la UI (CSS, JS, fonts, icones).
- Per a les dades (Mur, Missatges), s'usarà IndexedDB governada per Y.js. El Service Worker només interceptarà per donar un fallback offline si la petició fetch cau.

## 2. Actualitzacions "Fes la becaina"
- Quan hi ha una nova versió de l'app, es descarrega silenciosament en segon pla.
- A l'usuari (normalment gent major) no se li interromp l'activitat. La nova versió s'aplica només quan es tanca completament la pestanya i es torna a obrir (quan fa la becaina).
- **Indicador Visual Silenciós:** Per confirmar que estan a l'última versió sense enviar popups estressants, implementarem un indicador passiu molt subtil (ex. un xicotet punt verd prop del logotip o al menú), que confirmarà visualment que la "becaina" ha funcionat i estan actualitzats.
- Si l'actualització és **crítica** (forçada per vulnerabilitat o SDP), s'utilitzarà el `mas-cau/SKILL.md` per forçar el refresc.

## 3. Instal·lació de PWA
El manifest web inclourà la icona del Mas a 512x512px i obligarà al mode `standalone` per eliminar la barra de direccions i que semble una app nativa a l'iPad.

- [[00_index|Índex Central]]
