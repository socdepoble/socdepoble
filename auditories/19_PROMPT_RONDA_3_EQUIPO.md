**[CONTEXTO SÓC DE POBLE: socdepoble.org/projecte]**

# 🌐 MEGA-PROMPT: RONDA 3 DE AUDITORÍAS (INFRAESTRUCTURA Y RESILIENCIA) 🌐

**Atención Alto Consejo (Claude, ChatGPT, Grok, Gemini):**
Hemos estabilizado y blindado la interfaz y los fundamentos del motor Offline-First en la V14 de Sóc de Poble. Ahora nos enfrentamos al **Rendimiento Extremo, Supervivencia de Datos y Resiliencia Hostil**.

Como estamos trabajando en equipo, he asignado **focos de especialización** a cada uno de ustedes según sus capacidades analíticas más destacadas.

---

## 🎯 DISTRIBUCIÓN TÁCTICA DE LA AUDITORÍA

### 🧩 Claude 3.5 Sonnet: "Operación Cold Backup y Purgas de iOS"
**Tu Enfoque:** Eres especialista en flujos de usuario y resiliencia de datos a nivel de navegador.
- **El Problema:** iOS/Safari purga IndexedDB de Progressive Web Apps tras 7 días de inactividad. Los usuarios podrían perder sus llaves Ed25519 o historiales.
- **Tu Tarea:** Diseña un mecanismo de *Cold Backup* (Exportación de un Blob/JSON cifrado en AES-GCM empaquetado como imagen/QR o PDF que el usuario mayor pueda guardar en su galería). ¿Cómo orquestamos este backup preventivo de forma comprensible para un anciano, sin depender de un backend?

### ⚡ Grok (1.5/3): "El Tractor Worker y Main-Thread Blocking"
**Tu Enfoque:** Eres imbatible en rendimiento raw, concurrencia en JavaScript y Web Workers.
- **El Problema:** Sincronizaciones masivas de IPFS/Helia y operaciones CRDT pesadas de Yjs podrían asfixiar el Main Thread y romper la barrera de 60 FPS en interfaces React.
- **Tu Tarea:** Diseña la arquitectura del "Tractor Worker", un Web Worker o Shared Worker que asuma el 100% de la carga del _CRDT merging_ e interactúe con el Main Thread solo para despachar `postMessage` de UI re-renders. Ten en cuenta IndexedDB dentro del worker.

### 🧠 ChatGPT (GPT-4o) y Gemini (1.5 Pro): "La Constelación de Datos y Caché Eviction"
**Vuestro Enfoque:** Manejáis gigantescas ventanas de contexto y entendéis como nadie estructuras abstractas de datos a largo plazo.
- **El Problema:** Cuando el usuario baja al pueblo y recibe una **avalancha de CRDTs** tras meses desconectado, o cuando el histórico de datos pesa demasiados megas, necesitamos que la app no colapse por OOM (Out Of Memory).
- **Vuestra Tarea:** Desarrollad un protocolo de *Eviction Policy* y *Paginación Oflline*. ¿Cuándo y cómo podamos los sub-árboles obsoletos del documento Yjs? ¿Cómo almacenamos mensajes históricos en crudo en IndexedDB sin cargar la RAM, manteniendo solo lo esencial en la estructura CRDT viva en memoria?

---
**[ESPERANDO VUESTROS REPORTES Y ANÁLISIS]**
