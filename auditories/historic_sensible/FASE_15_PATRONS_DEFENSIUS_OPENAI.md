# 🛡️ ELS 3 ESCUTS DEFENTIUS (FASE 11 Producció)
*Data de l'auditoria: 29 de Març, 2026. Font: OpenAI o1 (Mode Guerra)*

## 1. Patró "COMMAND LOG + ACK" (Anti-Race Conditions)
*   **Problema:** `postMessage` no és transaccional. Pot deixar l'UI en "Guardant..." infinit si es perd el missatge just abans de caure la cobertura.
*   **Arquitectura:** L'UI escriu sempre la intenció a IndexedDB (`commands`) abans de fer el `postMessage`. El Worker escolta, llegeix de la DB (veritable font de la veritat), ho processa i ho marca com `acked` o `failed`. L'UI escolta IndexedDB per canviar d'estat a "Completat", mai el Worker directament. Idempotència total per UUID.

## 2. Patró "OPTIMISTIC CONCURRENCY" (Anti-Deadlock Núvol)
*   **Problema:** Utilitzar `SELECT FOR UPDATE` per a la Triangulació Semàntica bloqueja files i tira la base de dades sota estrès (tempesta d'errors).
*   **Arquitectura:** Eliminació de bloquejos pessimistes. S'afegeix un numèric de `version` a cada registre. Supabase actualitza `WHERE id = $x AND version = $y`. Si el comptador de files afectades és 0, sabem que hi ha conflicte (algú altre ho ha tocat mentre estiguem offline). Retornem un error controlat al client, aquest refetch la dada nova, i refà automàticament el *merge* local abans de reintentar.

## 3. Patró "STREAMING QUEUE + BACKPRESSURE" (Anti-Crashes a Safari)
*   **Problema:** Mòbil vell perd 3G durant dies. En recuperar xarxa, el Worker llegeix de cop 500 mutacions OPFS sencer, rebentant la RAM i forçant el tancament de la pestanya (`OOM`).
*   **Arquitectura:** Llegir només processaments per finestres max (`BATCH_SIZE=10`, `MAX_IN_FLIGHT=2`). Res d'arrays complets `.getAll()`. Es processa amb *backpressure* i memòria exponencial als reintents. S'utilitza un `last_synced_id` com a punt de guardat per si el navegador fa *Crash*, poder reprendre exactament on s'havia quedat. Només URLs d'imatges s'envien per l'RPC, MAI base64.
