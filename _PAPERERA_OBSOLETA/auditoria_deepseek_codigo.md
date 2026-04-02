# Implementación DeepSeek (Fase 4)

## 1. MOTOR LOCAL – Zustand + IndexedDB + Web Workers

### `src/lib/lock/DistributedLockManager.ts`
- Implementa Web Locks API (`navigator.locks.request`).
- Utiliza `BroadcastChannel` para notificar adquisiciones, latidos (heartbeats) y liberaciones/robos de locks entre pestañas.

### `src/lib/db/IndexedDBService.ts`
- Base de datos `socdepoble_offline` con almacenes `mutation_queue` y `static_cache`.
- Implementa **Auto-Cannibalism**: Ante un `QuotaExceededError`, borra la mutación más antigua o la caché estática más antigua.
- Delega la compresión a un Web Worker.

### `src/workers/compressionWorker.ts`
- Recibe un `Blob` de imagen.
- Usa `createImageBitmap` y `OffscreenCanvas` para redimensionar a max-width 1200px.
- Comprime a JPEG con calidad 0.8 de forma asíncrona fuera del hilo principal.

### `src/store/useOfflineStore.ts`
- Store de Zustand.
- Encola mutaciones, emite eventos optimistas vía Broadcast.
- La función `startSync` utiliza `DistributedLockManager` para asegurar exclusión mutua antes de vaciar la cola hacia Supabase.

### `src/services/mutationProcessor.ts`
- Itera mutaciones, procesándolas o marcándolas como `failed`.

## 2. AMORTIGUADOR SENSORIAL DE REACT 19

### `src/hooks/useChaosReconciliation.ts`
- Usa `useTransition` y `useDeferredValue` combinados con `requestAnimationFrame` para encolar renders sin ahogar el Main Thread.

### `src/lib/aria/AriaLiveManager.ts`
- Orquesta notificaciones a lectores de pantalla (Live Regions).
- Agrega un "cooldown" para evitar *spam* auditivo, encolando mensajes con temporizadores.

### `src/lib/ambient/AmbientLightAdapter.ts`
- Escucha `AmbientLightSensor`. Si supera 500 lux, añade `.high-contrast` al `:root`.

## 3. MURALLA EDGE – Cloudflare Worker

### `src/workers/seo-edge-defender.ts`
- **Rate limiting** básico vía KV.
- Verificación de bots legítimos mediante Reverse DNS (`google.com`).
- **Spider Tarpitting**: Ante un bot ilegítimo, se devuelve un ReadableStream que envía 1 espacio en blanco por segundo (atrapando el hilo atacante).
- **Circuit Breaker Económico**: Estima un coste por petición y, si pasa de $50/hora, devuelve un 503.
- Inyección de HTML y `JSON-LD` (Article Schema) directo desde el borde para bots validados.
