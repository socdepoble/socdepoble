---
name: backup-recovery
description: "Estratègia de snapshot diari d'IndexedDB i protocol de recuperació davant corrupció de dades locals."
authority: "Consell de les 11 IAs"
version: "V21"
---
# 💾 SKILL: Backup & Recovery

## 1. Objectiu
Assegurar que cap llaurador perda dades si l'iPad falla, la memòria es corromp o l'aplicació es tanca abruptament durant una sincronització CRDT.

## 2. Protocol de Snapshots (Fotografies del Mas)
- **Frequència:** Es realitzarà un snapshot silenciós de l'`idb-keyval` aprofitant l'Homeostasi Oportunista ('visibilitychange', 'pagehide', o idle), evitant falses promeses de fons en iOS.
- **Format:** Blob comprimit (Zstd) emmagatzemat a OPFS (Origin Private File System) per a no bloquejar el main thread de l'usuari.
- **Retenció:** Màxim 3 snapshots rotatius.

## 3. Rutina de Recuperació (SOSP-RECOVERY)
Si en arrancar el sistema detecta que el document Y.js està corrupte (error de decodificació o desincronització asimètrica letal):
1. Bloqueig de l'UI (Pantalla de "Refent el Mas...").
2. Es purga l'estat actual d'IndexedDB.
3. Es carrega i descomprimeix el snapshot més recent d'OPFS.
4. Es demana a Supabase (o als *peers* WebRTC) els vectors de diferència (state vectors) només a partir de la data del snapshot.

*Mai es confia cegament en la memòria del navegador sense un cordó de seguretat.*
