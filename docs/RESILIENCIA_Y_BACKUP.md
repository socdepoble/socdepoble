# 📜 BIBLIA: Protocol de Resiliència i Ancora de Seguretat ⚓️⚡️

Aquest document estableix les lleis per a la protecció absoluta de l'integritat del Mas Digital. En cas d'error inesperat o fallida catastròfica, aquests protocols garanteixen el retorn immediat al punt d'estabilitat mestre.

## 1. L'Ancora de Seguretat (Backups)

### 🏺 Snapshot del Sól d'Estabilitat

Abans de qualsevol canvi estructural d'envergadura, l'agent ha de realitzar un "Snapshot Visual i Tècnic":

- **Backup de Codi:** Confirmar que el `git switch -c stable-v-current` està creat.
- **Backup de Dades (Mocks):** Els fitxers `src/data/mockLoreData.js` i `src/constants.js` són les pedres de toc. S'han de duplicar com a `.bak` per a recuperació instantània del motor local.
- **Auditoria Visual:** Captura de pantalla de la secció afectada per a verificar el disseny abans de la "cirurgia".

## 2. Protocol de Recuperació Automàtica

El sistema està protegit per la **Triple Capa de Batec**:

1. **Circuit Breaker (HUD):** El `DiagnosticConsole.jsx` detecta bucles infinits i desconnecta la càrrega de dades si el bategat és inestable.
2. **Auto-Healer (Supabase):** Si la consulta de base de dades falla per canvi d'esquema, s'activa el _Triple Fallback_ (Manual Hydration) ja implementat.
3. **Reset Masia:** El botó "RESTAURAR MASIA" al HUD neteja `localStorage`, caches i Service Workers, forçant una sincronització neta.

## 3. L'Ordre de Producció Blindada

Mai s'ha de pujar a producció sense:

- **Verificació Mòbil (Tactile-First):** Els botons han de fer 48px i el border-radius 28px.
- **Audit de Contrast (Aesthetics Guard):** Verificació que els colors de la Vall són llegibles en Mode Nit.
- **Sincronització de l'Arquitecte:** El Mode Arquitecte ha d'estar documentat segons el `MAPA_TERRITORI.md`.

> "El Mas no és l'edifici, és el trellat que el manté dret." 🏺
