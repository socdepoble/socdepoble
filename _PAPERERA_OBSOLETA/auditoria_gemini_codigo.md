# Implementación Gemini (Consenso Fase 4)

## 1. MOTOR LOCAL
- **Off-Main-Thread WASM Inline**: Gemini inyecta el Web Worker a través de un `Blob` serializado. **RIESGO IDENTIFICADO**: Esto viola políticas estrictas de `Content-Security-Policy` (CSP) de producción.
- **DistributedLockManager**: Usa `navigator.locks` pero omite la captura del evento `freeze` del Page Lifecycle API (cuando iOS/Android congela procesos en segundo plano para ahorrar batería). Si la PWA se congela, los heartbeats mueren.
- **Auto-Canibalismo**: El triage borra 100 `feeds` de golpe abriendo un cursor en la transacción.

## 2. AMORTIGUADOR SENSORIAL
- Reconciliación de CRDTs en masa (bulk) controlada por `requestAnimationFrame` y `startTransition`.
- `AriaLiveManager` con buffers de conteo. En lugar de leer cada post, dice "Sincronització completada: 15 publicacions actualitzades". UX auditiva brillante.

## 3. EDGE DEFENDER
- Hard-limit económico de 15,000 requests/hora (~$50). Devuelve un `503` (Retry-After) limpio para no penalizar el SEO.
- Tarpit que secuestra el socket TCP devolviendo 0 bytes de array. Muerte por inanición para los bots rusos.
