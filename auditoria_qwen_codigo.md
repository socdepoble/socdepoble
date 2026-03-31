# Implementación Qwen (Fase 4)

## 1. MOTOR LOCAL - Zustand + IDB + Web Workers

### `src/store/useOfflineStore.ts`
- **DistributedLockManager**: Arquitectura avanzadísima que combina `navigator.locks`, `BroadcastChannel` y sessionStorage. Implementa manejo de locks huérfanos, *leases* de 5 segundos y *heartbeats* de 1.5s.
- **Compresión WASM**: Utiliza `@squoosh/lib` para exprimir imágenes de 1MB a 400KB dinámicamente según bucles de calidad descendente.
- **QuotaManager**: Calcula el límite de 85% y 95% para ejecutar la purga LRU (Auto-canibalismo) abriendo cursores de IndexedDB antes de arrojar `QuotaExceededError`.
- **CRDT LWW-Register**: Implementación canónica de `LWWRegisterCRDT` con `vectorClock` para manejar resolución de conflictos descentralizada de forma matemática.

## 2. AMORTIGUADOR SENSORIAL DE REACT 19

### `src/hooks/useChaosReconciliation.ts`
- **Update Priorities**: Define prioridades (`critical`, `normal`, `low`) para las mutaciones y las encola usando `startTransition` y temporizadores anidados (`setTimeout`), aliviando brutalmente el Main Thread.
- **AriaLiveManager**: Sofisticado gestor con colas de silencio y resúmenes estructurados (e.g. "3 actualizaciones de 2 tipos diferentes") para no masacrar al lector de pantalla.
- **AmbientLightAdapter**: Usa el `AmbientLightSensor`, con un *fallback* a detección por hora del día, y ajusta multiplicadores de contraste, brillo de texto e inyecta la clase `high-contrast` de forma progresiva según los rangos de luz.

## 3. MURALLA EDGE - Cloudflare Worker

### `src/workers/seo-edge-defender.ts`
- **Billing Circuit Breaker**: Utiliza KV para almacenar estimaciones fraccionarias de costes (por request y tiempo CPU). Si supera 100$/h, cierra la barrera y manda alertas directas a Webhook.
- **Bot Verification Completa**: Mapea ASNs oficiales de Google, Bing, Facebook, etc., combinándolo con un control estricto de Reverse DNS `PTR` y `A` (las IPs robadas fallan).
- **El Tarpit Máximo**: El Spider Tarpit no solo contesta un espacio, sino que inyecta en un `ReadableStream` el header `Transfer-Encoding: chunked` originando un agujero negro de 5 segundos entre chunks.
- **Defensa L7 con Turnstile**: Inyección estática de un desafío Cloudflare Turnstile a las IPs sospechosas bloqueadas por el limitador semántico.
