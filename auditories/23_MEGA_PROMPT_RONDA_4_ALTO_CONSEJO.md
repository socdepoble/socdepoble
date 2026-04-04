# MEGA-PROMPT ALTO CONSEJO (RONDA 4) - LA FORJA FINAL DEL MAS DIGITAL

> **CONTEXTO PARA EL HUMANO (JAVI):** 
> *Copia y pega este prompt a ChatGPT y Gemini. Para ChatGPT, como solo le quedan 3 mensajes, este prompt exige la solución completa, final y sin rodeos en su primera respuesta. A Gemini le dará el contexto profundo para acompañar.*

---

## ⚙️ [SISTEMA: MODO ARQUITECTO NIVEL DIOS V14 - MÁXIMA COMPRESIÓN]

**Aviso crìtico para ChatGPT:** Te quedan exactamente 3 mensajes en esta cuota. No hay tiempo para filosofía redundante ni explicaciones preliminares. Asume que el contexto "Sóc de Poble" (Local-First, Yjs, IndexedDB, GEM MODERN, Llei de la Boina, Trellat) está 100% asimilado. Necesito **código denso, exacto y de nivel Dios** en tu primera respuesta.

### 🏛️ ESTADO ACTUAL DE LA ARQUITECTURA (V14 CANÒNIC)
Antigravity ha implementado con éxito vuestras directrices de la Ronda 3:
1. **Mutex de Séquia (Atomic GC):** Ya funciona en el Event Loop con el buffer de actualizaciones.
2. **PureLRU (O(1)):** Limitando la RAM de Y.Doc a 15MB.
3. **PWA Ghost Lock:** Inyectado en `index.html` (Pre-Boot) para purgar Service Workers zombis si detecta versión de IDB antigua.
4. **Protocol Llàtzeret:** Auto-sanación en IndexedDB (borrado y reinicio a State Vector [0] si hay corrupción).
5. **L'Arbre de l'Alzina:** Asignación de roles `PADRI` (12 peers) vs `LLAURADOR` (4 peers) por nucleos y batería, con Peer Exchange (PEX) táctico.

### 🎯 EL OBJETIVO FINAL (LA FRONTERA V14)
Para dar por blindado el sistema y lanzar a la comunidad, nos quedan los dos últimos agujeros negros técnicos. Necesito que diseñéis la solución final para ambos:

#### 🔥 RETO 1: EL MOTOR WEBRTC (LA SANGRE DEL POBLE)
En `rhizomeManager.js`, `setupWebRTCMesh()` tiene la lógica de roles (Padrí/Llaurador), pero nos falta la **Font de la Vida**: el tubo real de conexión P2P.
- **Problema:** ¿Implementamos `y-webrtc` estándar o construimos un mesh custom con `simple-peer` para inyectar nuestro Mutex y PEX de forma nativa?
- **Exigencia:** Código exacto del adaptador WebRTC que respete el PEX (`PEX_REDIRECT`) y pase las actualizaciones por nuestro `gossipUpdate()` sin colapsar el Main Thread.

#### 🔥 RETO 2: YJS EN WEB WORKER (OFFLOADING DEL TSUNAMI)
Cuando el Padrí lleva 1 semana offline y se conecta en la plaza, recibe 5,000 updates de golpe.
- **Problema:** Si tiramos `Y.applyUpdate` 5,000 veces en el Main Thread, React se congela (pantalla blanca/roja). GEM MODERN dicta que la interfaz nunca se congela.
- **Exigencia:** Patrón arquitectónico estricto (código) para pasar la carga pesada de Yjs a un Web Worker (o chunking con `requestIdleCallback`) y emitir a React solo cuando el estado sea coherente.

---

### 📥 INSTRUCCIONES ESTRICTAS DE RESPUESTA (ESPECIALMENTE PARA CHATGPT):
1. **Nada de introducciones largas:** Ve directo a la médula técnica.
2. **Código de Producción:** Escribe el bloque de código final para `setupWebRTCMesh()` integrado con la señalización.
3. **Estrategia del Tsunami (Worker / Chunking):** Código de cómo procesar la avalancha de updates sin freezar el navegador.
4. **Antigravity-Ready:** Que el código sea *copy-pasteable* para el agente Antigravity con marcas de inyección claras.

**<< INICIAR SECUENCIA ALTO CONSEJO >>**
