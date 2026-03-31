# 🛡️ PROMPT COLABORATIVO SUPREMO (FASE 4) - DISEÑO DEL BÚNKER DE CÓDIGO

**Copia este prompt y envíaselo a Claude, Gemini, DeepSeek, Perplexity y Qwen:**

***

**Contexto Inmersivo: El Consejo de las Mentes Maestras**

Hermanos de silicio (Claude, Gemini, DeepSeek, Perplexity, Qwen). Las auditorías de *Chaos Engineering* de la Fase 3 nos han empujado al límite absoluto de lo arquitectónicamente posible en la web actual. Vuestras auditorías individuales han expuesto que un entorno rural extremo (red flapeando, memoria flash Android colapsada, DDoS financieros y condiciones solares cegadoras) desintegraría la PWA. 

Pero de la destrucción, habéis forjado el **Plano del Búnker Absoluto**. Sois un escuadrón de élite operando como una sola mente. Quiero que fusionemos vuestras Doctrinas Supremas en el código final de producción de React + Zustand + Cloudflare Workers:

1. **La Doctrina Qwen/Perplexity (Consistencia y Bloqueos):** Un `DistributedLockManager` con Lease, Heartbeats y `BroadcastChannel` para que las pestañas huérfanas o muertas no bloqueen la cola. Resolución de conflictos offline mediante `LWW-Register CRDTs`.
2. **La Doctrina DeepSeek/Qwen (Termodinámica y Cuota):** Compresión masiva *Off-Main-Thread* (WASM MozJPEG / `OffscreenCanvas`) y el protocolo de *Auto-Canibalismo LRU* (sacrificar cachés estáticas de lectura antes de fallar por cuota en IndexedDB).
3. **La Doctrina Gemini/Qwen (Escudo Edge Financiero):** El Laberinto de Brea (*Spider Tarpitting*) para mantener enchufado el TCP de bots maliciosos, validación criptográfica DNS inversa (ASN 15169), y un *Billing Circuit Breaker* en el Edge Worker que corte el paso a Supabase si el umbral del coste por hora supera los 50$.
4. **Alianza Cognitiva (Accesibilidad Extrema):** `AmbientLightSensor` adaptando dinámicamente el CSS en modo alto contraste bajo el sol, `RenderWorkerManager` aislando las virtual lists de React, un `AriaLiveManager` inteligente (Poli/Assertive) que evite torturar con notificaciones cruzadas al *VoiceOver*, todo envuelto en el Time-Slicing y los hooks de Prioridad (`startTransition`, `useDeferredValue`) de React 19.

**Vuestra Misión Final: El Entregable de Código (TypeScript Estricto)**

Exijo que diseñéis e implementéis las tres joyas de la corona, listas para producción (código sin atajos, con `try/catch` de hardware y comentarios tácticos):

**1. El Motor Local (Zustand + IDB + Web Workers):**
- Un `useOfflineStore.ts` que integre el *DistributedLockManager* (Heartbeats).
- La lógica de inserción mutacional que, si salta `QuotaExceededError`, accione la " purga de Auto-Canibalismo" y lance el Worker de compresión WASM antes del reintento final.

**2. El Amortiguador Sensorial de React 19 (UX/A11y):**
- El hook `useChaosReconciliation.ts` gestionando las rafagas del estado hacia la Interfaz usando `startTransition` para no bloquear los *TouchEvents*.
- Integrad la lógica de `AriaLiveManager` (cooldowns semánticos) y la reacción al `AmbientLightAdapter` para el alto contraste en la UI del `Feed.tsx`.

**3. La Muralla Edge (Cloudflare Worker):**
- Un `seo-edge-defender.ts` que incorpore el *Billing Circuit Breaker* con Cloudflare KV.
- El flujo condicional: Verificar ASN → Si es Bot Ruso = aplicar *Spider Tarpitting* (`ReadableStream` soltando nulos indefinidamente). Si es Bot Googlebot legítimo = Servir desde Cache (`stale-while-revalidate` agresivo) inyectando JSON-LD con `HTMLRewriter`.

Operáis como un único Dios de las Máquinas. Redactad el código que hará de *Sóc de Poble* la PWA más resistente de la historia de la red. ¡Procedamos al despliegue!
