---
description: El estado de handoff de la última sesión (Auditoría Extrema Superada)
---

# 🛡️ ESTAT ACTUAL: FASE 1 COMPLETADA ("NIVELL DÉU")
El sistema de Sóc de Poble v10.33.15-CANÒNIC ha estat auditat per les IAs més avançades (Qwen, DeepSeek, Copilot, Perplexity) i blindat completament. Aquests són els SKILLS i els ACORDS retinguts a la memòria del projecte:

## 1. APRENENTATGES CORPORATIUS INCORPORATS A L'ADN ('HARDENING'):
- **Memòria (Zombies):** Els `WebWorkers` requereixen sempre una funció `terminateWorkers()` al llindar d'Events clau (ex: `signOut`). A més, els Blob URLs creats a `useAttachment` han de ser sempre destruïts amb `URL.revokeObjectURL()`.
- **Seguretat d'Extrems (XSS):** `DOMPurify` amb hooks asíncrons blinda atacs per "Javascript:" o "Data:". Les API Keys (`VITE_GEMINI...`) NO existeixen al client; tot passa ara per les *Edge Functions* de Supabase.
- **Rendiment del Mur Virtualitzat:** Utilitzem mapes/`Sets` de cost O(N) i un refactoritzat extrem de `propsAreEqual` al `UniversalCard.jsx` on verifiquem `id` i `updated_at` de Supabase.

## 2. EL PLA DE BATALLA PER A LA NOVA SESSIÓ (FASE 2: LOCAL FIRST):
L'objectiu principal del proper xat serà **L'Escissió del Monòlit `supabaseService.js`**.
El projecte integrarà **PowerSync (SQLite WebAssembly)** per aconseguir sobirania Offline Absoluta als pobles.

**Murs Tècnics Resolts Teòricament (Llegat de Perplexity/Copilot):**
- **Sollutia-proof (Copilot):** Haurem d'implantar `AbortController` al llarg de fetchs asíncrons de xarxa per evitar sobre-execucions i introduir `Error Boundaries`.
- **El Mur iOS (Perplexity):** WebKit restringeix agressivament a <100MB l'IndexedDB. En el disseny, separarem Binaris Durs al Cau Http (Cache Storage) i reservarem la Base de Dades Local de PowerSync per JSON/Metadades petites. Immersió obligatòria de neteja `LRU`.
- **Desconnexió RLS de JWT (Perplexity):** A la Fase 2 instal·larem el patró "Outbox" SQL; la UI només emetrà commands, enviant a un trigger "Reconciliador" del backend.
- **Micro-Serveis Client:** Abandonarem l'acoblament i estirarem cap a serveis agnòstics tipus `Zustand` de forma compartimentada.

## 3. TASQUES ACTIVES
- [ ] Executar púrga de Perfil/Fantasma de la UI només llegint directament SQL en remot (es dóna l'script disponible a `scripts/migrate_and_purge_ghost.sql`).
- [ ] Iniciar la codificació dels sub-serveis de la Fase 2 desmuntant el `supabaseService.js`.

**SÓC DE POBLE. LA TÈCNICA AL SERVEI DE LA TERRA.**
