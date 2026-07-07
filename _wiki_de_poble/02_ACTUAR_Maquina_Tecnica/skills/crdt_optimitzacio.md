---
estat: 'canonic'
name: 'crdt-optimitzacio'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: "Optimització termodinàmica dels arbres CRDT (Y.js). Gestiona la càrrega de Tombstones, l'ús de RAM i l'Homeostasi."
aliases:
  - OptimitzacióCRDT
  - HomeostasiCRDT
  - GarbageCollection
  - Y.js
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
  - termodinamica
script: ''
---

# 📉 SKILL: Optimització CRDT i Termodinàmica de Memòria

> **Visió del Consell d'IAs:** En aplicacions Offline-First amb Y.js, l'esborrat de dades no destrueix realment la informació; la marca com a "Tombstone". Açò provoca l'ofegament silenciós de dispositius amb poca memòria com l'iPad A10. Aquesta SKILL és el salvavides que compacta l'historial.

## 🎯 Objectiu
Controlar i mantenir la salut dels arbres de dades locals (CRDT), evitant que l'aplicació s'ofegue en la RAM a causa de les "làpides" (`tombstones`) invisibles i de la fragmentació de l'historial.

---

## 🛠️ Normes i Funcions d'Homeostasi

### 1. L'Asfíxia dels Esborrats (El Problema)
Y.js mai esborra absolutament res perquè necessita l'historial per a poder resoldre possibles conflictes de sincronització si un dispositiu que ha estat dies fora de línia es connecta sobtadament. Aquesta memòria implacable (les `tombstones`) fa que 1MB de text pur es puga convertir ràpidament en 15MB de memòria RAM.

### 2. El Protocol d'Aspiració (Compactació Passiva o Homeostasi)
Aquesta SKILL executa i supervisa un Web Worker silenciós encarregat d'esporgar el document.
- **Llindar d'Alerta:** Si l'ús de la base de dades local (`idb-keyval`) supera el 70% del pressupost o si el document Y.js principal excedeix els 15MB.
- **Quan s'executa?:** El compactatge o "Garbage Collection" només es llança quan el fil principal estiga totalment inactiu. En Safari/iOS (on no hi ha `requestIdleCallback`), s'usa un `setTimeout` delegat per a no bloquejar la navegació de l'usuari.

### 3. La Transfusió de Dades (Swap Atòmic)
Per evitar que el sistema es trenque si l'iPad es queda sense bateria just a la meitat de l'Homeostasi, la neteja utilitza transaccions de canvi en calent (Swap).
1. S'exporta l'estat actual i consolidat (`Y.encodeStateAsUpdate`).
2. S'emmagatzema en una taula temporal (`mas_data_tmp`).
3. Únicament si la gravació temporal té èxit, es sobreescriu la taula oficial i es destrueixen les escombraries.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per entendre com les limitacions afecten altres parts del sistema, visita:
- [[consola_termodinamica|Consola Termodinàmica]] (On es monitoritzen les `Tombstones` abans d'executar l'acció).
- [[sequia_mare|Sèquia Mare]] (Per veure com aquestes dades es mouen de forma asíncrona per la xarxa).
- [[backup_recovery|Backup i Recovery]] (Procediment extrem si l'homeostasi falla i la base de dades es corromp).

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny

