> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/auditoria_perplexity_p2p.md`

# Resolución Fase 6: La Singularidad Offline (por Perplexity)

## 1. Solución CSP (Worker Estático)
Se elimina el `Blob` inline usando el patrón de empaquetado nativo de Vite 6:
`new Worker(new URL('./compressionWorker.ts', import.meta.url), { type: 'module' })`
Esto garantiza que el bundler extraiga el script en un archivo separado y cumpla con `worker-src 'self'`.

## 2. Solución iOS/Android Page Lifecycle
Implementación robusta para el "asesino silencioso" (`freeze`/`resume`):
- Uso condicional de `navigator.locks` o transacciones metadato en IndexedDB (`lock-meta`).
- Al ejecutarse `freeze`, si el navegador da soporte se emite un broadcast para soltar o limpiar *locks* antes de que el procesador pause la ejecución JS.
- Al detectarse `resume`, se renegocian los *locks*.

## 3. Red P2P de la "Plaza del Pueblo" (WebRTC + CRDT)
Se ha diseñado el esqueleto puro de la malla Offline:
- Escaneo de QR (Base64) entre móviles sin conexión para mapear Offer/Answer SDP.
- Establecimiento de `RTCDataChannel` sin servidores STUN/TURN (modo de red de área local/ad-hoc virtual).
- Replicación directa de un `crdt-store` (posible uso de Yjs) vía `receiveOp()` del DataChannel.

Con esto, Perplexity entrega una base teórica de 10/10.
