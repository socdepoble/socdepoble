# CONTRA-AUDITORÍA PARA CLAUDE (ITERACIÓN 3 - FINAL)
**Directiva:** "Concurrencia Distribuida y Límite de Hardware"

*Copia este texto y pásaselo a Claude en vuestra conversación. Vamos a llevarlo al límite absoluto de sus conocimientos y sacarle la última gota de arquitectura avanzada antes de dar por cerrada su fase.*

---

**PROMPT PARA CLAUDE:**

Claude, me quito el sombrero. Tu uso del `AbortController` para matar promesas huérfanas en el Gate de reconexión y el truco del `content-visibility: auto` para esquivar el renderizado masivo fuera de pantalla, son pinceladas de un Arquitecto Jefe. Has convertido un código frágil en una fortaleza de Titanio. La doctrina "Low-End Mobile" ya está inyectada en nuestra sangre.

Pero tenemos tokens, tenemos tiempo y tenemos un último secreto en *Sóc de Poble*. 

Más allá de la UI y la resiliencia offline básica, el núcleo real de este proyecto opera sobre dos pilares de carga pesadísima:
1. **Nivel 13 (La Malla):** Sincronización P2P descentralizada usando WebRTC y CRDTs (`Yjs`), donde cientos de deltas de estado pueden entrar de golpe tras recuperar la conexión.
2. **Nivel 14 (El Cerebro Local):** Inferencias de IAIA (nuestro LLM local) corriendo dentro del navegador del usuario usando `WebGPU` y `WebWorkers` para garantizar privacidad extrema.

Si un Samsung A10 de 2GB de RAM intenta sincronizar 50 megas de deltas atrasados por WebRTC justo en el momento en el que el WebWorker de IAIA está cargando los tensores a la GPU... el hilo principal de Node/Chrome va a sufrir un infarto y la App se va a congelar (ANR - App Not Responding). Todo tu hermoso `UniversalGrid` quedará paralizado.

Exígete al máximo para esta **Tercera y Última Iteración**:

1. **Defensa contra el Infarto del Render (Scheduler):** Sabiendo que React y sus workers pueden asfixiar el *main thread* al reconectar, ¿cómo aplicarías un patrón avanzado (como `RequestIdleCallback`, `yield to main` o `Concurrent Mode transitions`) en nuestra capa de estado (Ej: al actualizar el `ChatList` tras recibir 500 mensajes de golpe) para que la UI siga fluida a 60FPS mientras el P2P se traga los deltas en background?
2. **Data Integrity vs Crash:** Si el navegador móvil es asesinado por el SO (OOM Killer) justo escribiendo en IndexedDB un estado offline, ¿qué capa de protección (checksum o validación atómica) deberíamos tener en nuestro Gate antes de inyectar esa caché corrupta a los Reducers de React?
3. **El Sexto Mandamiento:** Has escrito 5 Mandamientos Estructurales impecables. Escribe el **Sexto y Definitivo Mandamiento Arquitectónico** sobre cómo el Frontend debe tratar el Estado Distribuido y la Inteligencia Local sin morir en el intento.

No te guardes nada. Sorpréndenos con la ingeniería del más alto nivel para blindar el futuro.
