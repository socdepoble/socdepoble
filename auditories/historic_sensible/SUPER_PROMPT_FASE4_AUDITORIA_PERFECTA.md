# 🏛️ SUPER PROMPT – FASE 4: AUDITORÍA FINAL "NIVEL DIOS" (RAYOS X AL BÚNKER Y FANTASMAS)

**PARA:** Alto Consejo Multi-Model (Grok, Claude, Qwen, DeepSeek, ChatGPT)
**DE:** Mestre Javi & Agente Antigravity
**ASUNTO:** Petición Oficial de Auditoría de Código Puro — Fase 4 y Erradicación de Fantasmas Duros
**NIVEL DE SEVERIDAD:** DEFCON 1 - CRÍTICO ABSOLUTO

Hermanos del Alto Consejo,

En la Fase 3 nos disteis la infraestructura invisible (Trellat Mesh y defensas P2P). Hemos procedido a ejecutarla implacablemente. 

**Hemos aplicado el blindaje total al Web Worker Criptográfico (`cryptoWorker.js`):**
1. **Anti-Timing Side-Channels:** Inserción de latencia artificial aleatoria (20-100ms) en todas las resoluciones de promesas (encrypt/decrypt/generate).
2. **Anti-Envenenamiento (Checksum IndexedDB):** Guardamos un `INTEGRITY_PAYLOAD` cifrado; si un atacante altera la base de datos y la firma de comprobación falla, el búnker se purga automáticamente cortando el ataque.
3. **Anti-Poisoning Quota (Storage):** Implementación de guardián de cuota de `navigator.storage.estimate()` (máximo 80% o 150MB). Si se traspasa, el nodo entra en modo emergencia P2P y borra el payload sobrante.

Sin embargo, **ha resurgido el fantasma de los conflictos visuales**. 
Mestre Javi ha reportado que en la sección **Events (`MasterCalendar.jsx`) el sistema llegaba a colapsar y quedarse congelado** con errores en terminal tipo `[Violation] 'setTimeout' handler took 123ms` y `Forced reflow` monstruosos. 

Antigravity ya ha lanzado un hotfix para frenar un **infinite render loop** crítico que existía porque los `fetchGoogleEventsRange` y `fetchInternalEventsRange` no tenían `useCallback`, provocando que el `useEffect` recargara los eventos de calendario en círculo vicioso. Ese colapso fatal está tapado.

Pero el Mestre exige una cosa más antes de dar por completado el Búnker V12:
> *"A ver si pueden destrozar esto. Siguen habiendo fantasmas, o divs escondidos, o conflictos antiguos de la primera semana en la estructura del calendario. Mándales el código puro y duro a lo bestia. Que lo auditen a los rayos X y nos den un 10/10 definitivo si tienen valor".*

A continuación os volcamos el código fuente de los corazones críticos. **Vuestra misión es auditar esto línea por línea en busca de fallos de Flexbox, CSS ResizeObservers invisibles, divs parasitarios que maten motores de renderizado iOS/Android, o fisuras de seguridad P2P.**

---

### 🛡️ ARTEFACTO 1: EL BÚNKER CRIPTOGRÁFICO (`src/workers/cryptoWorker.js`)

Auditad su inmunidad. ¿Realmente esto resiste PWA Storage eviction y ataques locales?

```javascript
/* src/workers/cryptoWorker.js */
const DB_NAME = 'SDP_Bunker';
const KEY_NAME = 'masterSyncKey';
const INTEGRITY_PAYLOAD = 'V12_BUNKER_SEAL';
// ... (Aquí Antigravity inyectó el Jitter anti-timing y comprobación de storage)
async function secureCryptoOp(promise) {
    const jitter = Math.floor(Math.random() * 80) + 20; 
    const result = await promise;
    return new Promise(resolve => setTimeout(() => resolve(result), jitter));
}
// ...
```

---

### 👻 ARTEFACTO 2: EL EPICENTRO DEL FANTASMA (`src/pages/MasterCalendar.jsx`)

¿Hay aquí colapsos estructurales? ¿Por qué `FullCalendar` colapsaba o por qué se reportaban *reflows* de 33ms antes del hotfix? ¿Existen problemas con el Height, FlexBox, Sticky o Virtualizer en conjunción con el DOM?

```jsx
// src/pages/MasterCalendar.jsx
import { useState, useMemo, useRef, useEffect, useCallback, useDeferredValue } from 'react';
import FullCalendar from '@fullcalendar/react';
// ...
// SECCIÓN EN CONFLICTO TEÓRICO: CONTENEDORES FLEX-1 Y HEIGHT AUTO
<div className="flex-1 flex flex-col w-full h-full">
    {/* Manager Modal */}
    
    <div className="flex-1 min-h-[600px] mb-8 relative px-4">
        <FullCalendar
            ref={calendarRef}
            // ...
            height="auto"
            contentHeight="auto"
            // ...
        />
    </div>

    <div className="sticky top-[64px] z-[55] w-full shadow-xl shadow-black/20 mb-8 overflow-hidden">
        <UniversalCardFooter
            item={{ id: 'master-calendar', type: 'calendar' }}
            // ...
        />
    </div>

    <section className="pb-12">
        {/* VirtualizedEventFeed */}
        <VirtualizedEventFeed 
            effectiveViewMode={effectiveViewMode} 
            columnCount={columnCount} 
            events={deferredCombined}
        />
    </section>
</div>
```

---

## 🎯 MANDATOS DE RESOLUCIÓN PARA EL CONSEJO

1. **Destrozad el Calendar Markup:** Evaluad si usar `height="auto"` sobre `FullCalendar` dentro de un `#flex-1` con un hermano `sticky` es lo que provoca los fantasmas de scroll o `Forced reflow`.
2. **Dadnos el veredicto cripto final:** Confirmad si el modelo "Jitter + Checksum" soluciona los problemas de la Fase 3.
3. **Sentencia de la V12:** Si sobrevivimos al análisis, proseguid con el último manifiesto: otorgar el 10/10 definitivo y validar la arquitectura en Bitchat Mesh (Fase 4 - Protocolo P2P).

El destino de Sóc de Poble está en este análisis. No os guardéis ni un token.
