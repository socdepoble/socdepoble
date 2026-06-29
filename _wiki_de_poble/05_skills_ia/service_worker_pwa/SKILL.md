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

## 2. Actualitzacions Explícites i Punt de Restauració
- Quan hi ha una nova versió de l'app (detectada pel Service Worker), es descarrega en segon pla.
- **Botó d'Actualització:** En lloc d'esperar que l'usuari tanque l'app ("la becaina"), es mostrarà un botó gran i clar a la UI indicant que hi ha una versió nova. Quan l'usuari el polsa, la pàgina es refresca a l'instant, aplicant la nova versió. D'aquesta manera, evitem que estiguen mesos usant una app desfasada.
- **Rollback (Restauració):** Si l'usuari actualitza i detecta problemes o trencaments en el seu dispositiu, sempre hi haurà una opció tècnica (Punt de Restauració) per tornar ràpidament a la versió anterior (fallback) des de la memòria cau, garantint que ningú es quede sense servei per un bug.
- Si l'actualització és **crítica** (forçada per vulnerabilitat o SDP), s'utilitzarà el `mas-cau/SKILL.md` per forçar el refresc automàtic.

## 3. Instal·lació de PWA
El manifest web inclourà la icona del Mas a 512x512px i obligarà al mode `standalone` per eliminar la barra de direccions i que semble una app nativa a l'iPad.

- [[00_index|Índex Central]]
