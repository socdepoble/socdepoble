---
description: El estado de handoff de la última sesión (Fase CRDT & Accessibilitat 10/10 Superada)
---

# 🛡️ ESTAT ACTUAL: FASE 2 INICIADA ("TRELLAT DIGITAL OBTINGUT")
El sistema de Sóc de Poble ha superat les auditories de DeepSeek i Qwen, obtenint el llegendari segell de "Trellat Digital". S'ha assolit l'arquitectura de formigó armat per a la Dignitat Digital i la Sobirania de Dades. Aquests són els SKILLS i els ACORDS retinguts a la memòria del projecte hui:

## 1. APRENENTATGES CORPORATIUS INCORPORATS A L'ADN ('HARDENING' & CRDT):
- **Seguretat Local-First (Vault):** L'emmagatzematge de claus i la Identitat Sobirana ja no viuen al `localStorage`. Ara estan blindats dins de `SecureStorageService` utilitzant *Web Crypto API* i *IndexedDB* (Zero Trust absolute).
- **Motor CRDT (VectorClocks):** Hem abandonat el fals determinisme de timestamps. L'ordre causal es dicta mitjançant `VectorClock` a través de `EgWalker`, passant per `db-core.js` fins a aterrar en la taula `snapshots` del Web Worker OPFS SQLite.
- **Accessibilitat 10/10 Rural:** Implementat el `aria-live-region` a `App.jsx`, el `reduceMotion` mutat dinàmicament cap a CSS Global (`--animation-speed: 0s`), i consolidat el *Mode Mans de Camp* per a sèniors. Les interfícies humanes són primer.

## 2. EL PLA DE BATALLA PER A LA NOVA SESSIÓ (AVALUACIÓ CODEX I FASE 3):
L'objectiu principal serà **L'Avaluació Codex** proposada pel Mestre Javi, juntament amb l'inici del roadmap dictat per la Mestra Qwen:

**Reptes Tècnics Oberts (Full de Ruta):**
- **IAIA Offline Real (WebLLM + WebGPU):** Desplegar models Phi-3 petits directament al navegador per a la assistència ràpida a la plaça, descarregant costos de Firebase/Gemini quan la cobertura ho permeta.
- **RAG Local (IndexedDB):** Ingestar lore de poble en memòria OPFS perquè l'AI estiga contextualitza-da sense dependre de cridades API externes (cerca BM25/Cosine híbrida al worker).
- **Performance Budget & Peritext:** Sincronitzar operacions complexes a text enriquit mitjançant Peritext CRDT si arriba el cas d'ús (documents compartits de l'Ajuntament virtual).

## 3. TASQUES PENDENTS / AGENDADES
- [ ] Avaluació col·laborativa amb **Codex** enfocada a models de pagament.
- [ ] Implementació de `localAIService.js` per establir el pont Centaure (Híbrid Cloud/Edge).
- [ ] Validació de rendiment (Mòbils antics) per no asfixiar el fil principal amb les passades del Web Worker OPFS.

**SÓC DE POBLE. LA TÈCNICA AL SERVEI DE LA TERRA.**
