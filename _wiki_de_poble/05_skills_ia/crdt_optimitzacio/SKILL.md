---
name: crdt-optimitzacio
description: "Optimització termodinàmica dels arbres CRDT (Y.js). Gestiona la càrrega de Tombstones, l'ús de RAM i la Resiliència de la Sincronització."
tags: [crdt, ram, optimitzacio, offline]
authority: "Consell de les 11 IAs"
version: "V22"
---

# 📉 SKILL: Optimització CRDT i Termodinàmica de Memòria

Aquesta SKILL controla i manté la salut dels arbres de dades locals (Y.js), evitant que l'aplicació s'ofegue en la RAM de l'iPad A10 a causa dels `tombstones` i la fragmentació.

## 1. Monitoratge de Mètriques (Consola Termodinàmica)
Aquesta SKILL audita i actua sobre les següents mètriques clau de la sessió:
- **Resiliència CRDT (CR)**: Mantindre sincronitzacions lliures de conflictes (Objectiu: ≥ 98%).
- **Càrrega de Tombstones (CTS)**: Grandària dels residus CRDT. Si supera les 10 per cada 1000 esdeveniments, executar `Y.gc()`.
- **Ús de Memòria RAM (MR)**: Controlar el `usedJSHeapSize`. Si MR > 1500 MB (límit crític A10), activar el protocol d'emergència i aturar sincronitzacions massives.

## 2. Accions Terapèutiques (Homeòstasi)
1. **Garbage Collection (GC)**: En aplicacions descentralitzades, les dades eliminades continuen existint com a `tombstones` per permetre fusions offline. Aquesta SKILL propulsarà la compactació (`Y.gc()`) un cop per setmana, tallant la metzina residual.
2. **Batching de Sincronització**: Les actualitzacions del `MassiveFusionEngine` es fan per lots de 100 esdeveniments (unificat per a protegir la RAM de l'A10).
3. **Bloqueig Preventiu**: Si l'índex MR és roig, s'avisa la capa UI i s'endarrereix l'emissió de dades.

*Totes aquestes mètriques es registraran a la carpeta `_wiki_de_poble/06_metriques/` a través de `session-logger.js`.*

---

## 🔗 Sinapsi Arquitectònica
- [[05_skills_ia/homeostasi_crdt/SKILL|homeostasi_crdt]]
- [[05_skills_ia/arquitectura_v19/SKILL|arquitectura_v19]]
