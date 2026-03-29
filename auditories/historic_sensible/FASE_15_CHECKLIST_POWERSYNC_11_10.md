# 🏆 CHECKLIST DEFINITIU 11/10 - REQUISITS TÈCNICS POWERSYNC WEB

*Extret de l'Auditoria Final DeepSeek/Qwen - 29 de Març, 2026*

Abans de declarar l'arquitectura "indestructible", la implementació pràctica de PowerSync haurà de complir **estrictament** aquests requisits per evitar caigudes tècniques (PWA/Safari):

## 🔴 1. Prevenció de conflictes Multi-Tab
- **Problema:** Si l'usuari obre la PWA en 2 pestanyes (o comparteix un enllaç a un altre fil), Instanciar PowerSync web en cada pestanya duplica la memòria i destrueix la base de dades local.
- **Acció Codex:** Instanciar PowerSync exclusivament amb suport per a SharedWorkers per forçar una única instància central.
- **Codi Requerit:** `multiTabSupport: true` a la configuració.

## 🟠 2. Velocitat Extrema: OPFS vs IndexedDB
- **Problema:** Per defecte, si no hi ha heades concrets, PowerSync web fa fallback a `IndexedDB`, el qual en un iPhone 6 és de 3x a 5x vegades més lent que el file system OPFS natiu.
- **Acció Codex:** Hem de forçar l'activació de l'Origin Private File System (OPFS).
- **Codi Requerit:** Configurar els headers HTTP al servidor (SiteGround / Netlify / Vercel):
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

## 🟡 3. Rol de Replicació Postgres (Seguretat)
- **Problema:** Els rols no es migren automàticament de local a producció. El `powersync_role` necessari per la replicació lògica pot fallar i retornar un error de permisos silent.
- **Acció Codex:** Mantenir un fitxer `roles.sql` separat i automatitzar l'execució d'aquest assignament en el dashboard de Supabase (Producció).

---
**ESTAT: PENDENT D'INCRUSTAR AL PROMPT DE CODEX DEMÀ**
