# 📜 Acta 12: La Petorreta Asiàtica (Escrutini de Grok)
**Document de Transmissió per a Fadrins, Fadrines i Petorretes**
**Data:** Juny 2026 | **Estat:** Esperant respostes de l'Escamot Asiàtic

---

## 1. El Parany dels Límits de Tokens
Hem descobert que els models occidentals (ChatGPT, Copilot) no tenen la mateixa capacitat d'absorció massiva de context que els models asiàtics (Qwen, DeepSeek, Kimi) sense recórrer a fraccionaments extrems del prompt. El text de més de 74.000 caràcters ha ofegat Copilot i ChatGPT.

## 2. La Nova Estratègia (El Filtre Asiàtic)
En lloc de lluitar contra els límits de context de ChatGPT, farem una **enginyeria inversa escalonada**:
1. **La Força Bruta:** Enviarem el codi íntegre a Qwen, DeepSeek i Kimi (que poden absorbir 100k-200k tokens sense despentinar-se).
2. **L'Anàlisi:** Recollirem les seues propostes arquitectòniques i les apuntarem en aquesta acta.
3. **El Veredicte del "Trellat":** Una vegada tinguem les solucions destil·lades per les IA asiàtiques, farem un prompt molt més curt i directe per a ChatGPT i Copilot. Els presentarem les solucions ja mastegades per a que apliquen l'última capa de "Trellat" i sentit comú occidental.

## 3. Tauler de Propostes (A omplir pel Mestre Javi)

*Mestre, a mesura que Qwen, DeepSeek i Kimi et vagen contestant amb els seus diagnòstics i codi sobre l'herència de Grok, enganxa ací baix les seues conclusions principals.*

### 🛠️ Proposta de Qwen
**Veredicte Inicial:** 7.5/10 -> 9.5/10 amb correccions.
**Fantasmes Tèrmics Detectats:**
1. **`structuredClone`** al SOSPStore (costós termodinàmicament a l'A10). Proposa **mutació directa**.
2. **Sobrecàrrega de Hooks** a `App.jsx` (cinc hooks = re-renders innecessaris). Proposa **`useSystemGuards()`** unificat.
3. **Race Condition** al Background Sync. Proposa **`offlineQueue.js`** amb fallback a localStorage.
4. **CSS Duplicat** i ús d'`@apply` prohibit en Tailwind v4 dins de `@layer base`. Proposa CSS pur consolidat.

**Riscos Existencials (Workers + Atomics):**
1. **Manca de COOP/COEP** bloqueja `SharedArrayBuffer`. Proposa **`workerBridge.js`** amb fallback a `MessageChannel`.
2. **`Atomics.wait()`** bloqueja el Main Thread de la UI. Proposa **`Atomics.waitAsync()`** amb polling per a Safari antic.
3. **Race conditions a l'Optimistic UI**. Proposa **`atomicQueue.js`** per al SOSPStore per encriptar els panys a IndexedDB.

*(El codi detallat de Qwen s'ha guardat a la memòria de l'Arquitecta per a la implementació final).*

### 🛠️ Proposta de DeepSeek
**Veredicte Inicial:** 10/10 (Amb correccions de sincronització).
**Fantasmes Menors Trobats:**
1. **Pèrdua de Service Worker:** Tancar la pestanya abans de 3.5s cancel·la el registre del SW. Proposa un `pagehide` listener.
2. **Estructures Circulars a SOSPStore:** `sanitizeItem` podria fallar amb referències circulars complexes. Proposa `try { JSON.stringify }` com a guardià.
3. **Botons Fantasma:** Botons a l'`AppLayout` sense `type="button"`, risc de fer submit a futurs formularis.
4. **Layout Thrashing en CSS:** La transició d'opacitat en `.empathy-zone` requereix bloquejar la propietat exactament i afegir `will-change: opacity`.

**Solució Arquitectònica (Atomics + Backoff):**
1. **`syncWorker.js`**: Ús racional d'Atomics. Transmet els arrays grossos per parts i deixa el `SharedArrayBuffer` només per als comptadors d'estat (`version`, `pendingCount`). No bloqueja res.
2. **`WebSocketManager.js`**: Brillants afegits d'estalvi de bateria -> Pausa el WebSocket amb `visibilitychange` si el navegador va a segon pla (crític en mòbil/tauleta) i tanca la xarxa si hi ha 30 segons d'inactivitat.
3. **OptimisticCart.jsx**: Control d'estats de UI optimista (ex: eliminant un element, aplicant rollback si falla l'esborrat al servidor).

*(El codi de WebSocket i SyncWorker creat per DeepSeek es queda a la memòria de l'Arquitecta).*

### 🛠️ Proposta de Dola / Kimi
**Veredicte Inicial:** 10/10 (Amb el mode "Mas Paral·lela" i Guardià d'Estat).
**Fantasmes i Riscos Trobats:**
1. **Col·lapse per SharedArrayBuffer:** Adverteix severament que forçar-ho en iOS < 15.2 trencarà l'app.
2. **Bottleneck de postMessage:** Acumulació de missatges si la UI està ocupada.
3. **Desincronització d'Estat:** El Worker i el Main Thread poden tindre versions diferents de la veritat.

**Solució Arquitectònica (Mas Paral·lela):**
1. **Detecció Intel·ligent (`featureDetector.js`)**: Abans de res, avalua si l'iPad suporta SAB i defineix el mode d'operació (`LEGACY_SAFE`, `PARALLEL_FULL` o `WEB_WORKER_ONLY`).
2. **`SOSPWorker.worker.js` Segur**: Un worker sense memòria compartida per a entorns legacy, capaç de fer sanititzacions i càlculs hash costosos.
3. **CSS d'Emergència**: Una regla `.low-end-device` agressiva que fulmina `backdrop-filter`, `box-shadow` i transicions complexes per alleujar la GPU de l'A10.
4. **Guardià d'Estat (`StateGuard.js`)**: Espectacular mecanisme "Anti-Tsunami" que fa un backup silenciós de l'estat vàlid cada 10 segons i executa un *rollback* si el Worker fa *crash*.

*(El codi de Dola s'ha integrat a la memòria de l'Arquitecta).*

---
**Conclusió Final d'Antigravity:**
Un colp tinguem les tres propostes ací escrites, decidirem on van els nostres tokens abans d'implementar res a `localhost`.
