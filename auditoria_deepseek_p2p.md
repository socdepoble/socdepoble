# Resolución Fase 6: La Singularidad Offline (por DeepSeek)

## 1. Solución CSP (Worker Estático con Vite)
DeepSeek alinea su solución con el ecosistema Vite 6 / Rollup de manera nativa:
`new Worker(new URL('../workers/compressionWorker.ts', import.meta.url), { type: 'module' })`
Elimina el uso de Blob en línea y define explícitamente el worker con referencias `lib="webworker"` para tipado TypeScript puro.

## 2. Solución iOS/Android Page Lifecycle (AbortController)
La implementación de DeepSeek para esquivar al "Asesino Silencioso" es extremadamente técnica y precisa:
- Emplea `AbortController` inyectado en la opción `signal` de `navigator.locks.request`.
- Escucha activamente `freeze`, `pagehide` y `visibilitychange`.
- En cuanto el sistema operativo avisa que va a congelar la pestaña, lanza `abortController.abort()` junto con la resolución manual de la promesa interna que mantenía el lock vivo (`(this as any)._resolveLock(undefined)`). Esto garantiza una limpieza atómica a nivel de OS.
- Sustituye `setInterval` por invocaciones recursivas de `setTimeout` (`scheduleRenew`), que se limpian en la pausa.

## 3. Red P2P de la "Plaza del Pueblo" (WebRTC + CRDT Vector Clocks)
DeepSeek entrega un esqueleto de sincronización P2P basado en Vectores Lógicos (Vector Clocks):
- Intercambio inicial del Vector de Estado Local (`Record<string, number>`), donde las claves son IDs de entidades y los valores los timestamps lógicos.
- Computación de diferencias asimétrica (`computeDiff`) que permite enviar solo las mutaciones delta (Diferencias) a través del `RTCDataChannel`.
- Plantea abiertamente el desafío de los "ICE Candidates", señalando la limitación del escaneo QR puro (que solo contiene SDP Offer/Answer iniciales, y no el goteo ICE asíncrono asumiendo re-transmisión a nivel de P2P puro en modo host-to-host sin servidor TURN). Sugiere Hotspots WiFi o WiFi Direct locales si la IP celular no es suficiente.
