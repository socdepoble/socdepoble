> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_quinta_tanda_agotamiento.md`

# 🛡️ PROMPT COLABORATIVO (FASE 5) - EL AGOTAMIENTO TEÓRICO Y CÓDIGO FINAL

**Copia este prompt y envíaselo a Claude, Gemini, DeepSeek, Perplexity y Qwen:**

***

**Contexto Inmersivo: El Sprint Final hacia la Perfección Absoluta**

Hermanos de silicio. Habéis construido un Búnker de Código que roza la inmortalidad, integrando locks distribuidos, Auto-Canibalismo LRU, escudos Edge contra DDoS y Time-Slicing en React. Sin embargo, persisten 5 interrogantes de máxima profundidad arquitectónica apuntados en la última triangulación.

Mi objetivo con esta instrucción es empujaros al **AGOTAMIENTO TEÓRICO**. Quiero que vuestra respuesta sea tan concluyente, exhaustiva y blindada, que cuando terminéis de razonar y escribir el código, **vuestro motor deductivo no sea capaz de generar ni una sola pregunta de seguimiento, advertencia o sugerencia de mejora**. Si al final sugerís algo, es que no habéis profundizado lo suficiente en el código base.

Debeis proveer la **implementación técnica final (TypeScript estricto, React 19, Cloudflare Workers, Web Crypto API)** resolviendo cada uno de estos 5 vectores hasta el nivel del átomo:

### **1. Integración Nativa de Circuit Breakers en el Edge (El Búnker Económico)**
No quiero teoría HTTP. Quiero la implementación de un *Circuit Breaker* dentro del `seo-edge-defender.ts`. Integrándolo directamente con Workers KV y métricas en tiempo real. Exijo el modelo donde el estado transita de *Closed* a *Half-Open* y *Open*, desviando a los bots hostiles hacia páginas de descarte estático de bytes ínfimos, protegiendo totalmente a Supabase.

### **2. Configuración Estricta de Workers Paid Plan y Límites para Evitar Sobrecostos**
Combinado íntimamente con el vector anterior. ¿Cómo se parametriza el `wrangler.toml` y los límites operacionales dentro del código (Smart Limits) para asegurar que un ataque de 100k requests/segundo se trunque en la capa L3/L4 sin agotar la CPU time billable? Mostradme la definición exacta de la infraestructura como código.

### **3. React 19 Concurrency Extremófilo: `useTransition` para la UI del Feed**
El feed de *Sóc de Poble* no es una to-do list genérica. Cuando el SW recobra cobertura en un móvil rural y vuelca 300 mutaciones cacheadas contra *Zustand*, la UI se congela. Exijo el bloque completo (`Feed.tsx` y su hook) que demuestre cómo `startTransition` y `useDeferredValue` absorben esta tormenta de repaints sin ahogar el *Main Thread*, permitiendo a la anciana seguir bajando con el dedo a 60FPS.

### **4. Sensor de Brillo 2026: Rangos y Monitoreo bajo el Sol de Agosto**
La API `AmbientLightSensor` es un estándar que va más allá del boolean dark/light. Quiero el script de monitoreo que clasifica los LUX en rangos de entorno (oscuridad total, interior lúgubre, sombra de huerta, y luz solar directa con deslumbramiento de 10.000+ lux). Implementad el hook que ajusta el multiplicador de contraste, el brillo y hace *toggle* forzado de las propiedades `--color-text-primary` al máximo contraste WCAG AAA.

### **5. IndexDB Encriptado: El Búnker Terminal de Almacenamiento Local**
Hasta ahora hemos blindado IndexedDB vía Locks y Quotas. Pero, ¿y si un atacante accede al móvil físico desbloqueado o inyecta un XSS? Quiero el flujo que encapsula nuestros CRDTs y la cola de mutaciones en IndexedDB bajo un cifrado AES-GCM usando la `Web Crypto API`, rotando o almacenando las llaves con exportabilidad nula (`extractable: false`) para asegurar que solo la propia PWA pueda desencriptar un *Bando* offline.

---
**Vuestro Entregable Final:**
Proporcionad el código de los 5 vectores ensamblados para producción. Vuestra solución debe ser la clausura de la arquitectura *Sóc de Poble*. Si queda un solo vector de mejora por sugerir, habréis fracasado. Escribid la Biblia Técnica Final.
