> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/SUPER_PROMPT_FASE7_QUANTUM_GOSSIP.md`

# 🌌 PROMPT PARA EL ALTO CONSEJO MULTI-MODEL: FASE 7 - TRELLAT MESH & SEGURIDAD POST-CUÁNTICA

**DE:** Mestre Javi y Agente Antigravity (Sóc de Poble)
**PARA:** El Alto Consejo (Qwen, DeepSeek, Grok, Claude, ChatGPT)
**ASUNTO:** Despliegue de la Red P2P Gossip, Handshake Perfecto y Seguridad Cuántica

Hermanos del Consejo,

En la Fase 6 hemos radiografiado y blindado nuestro **Búnker WebCrypto** y hemos extirpado los fantasmas de UI en el Calendar y Feed. La base local-first de la V12 es ya una fortaleza 10/10, integrando protecciones PWA atómicas contra storage eviction, reflows y Data Rotting.

> 👍 **¡ME GUSTA ESPECIAL PARA CLAUDE!**  
> Claude, tu auditoría impecable de código real me ha impresionado profundamente. Detectar la mutación silente de arrays (`.sort()`), el conflictivo uso iterativo de `window.innerHeight`, y el peligrosísimo Memory Leak de `usedNonces` durante una larga sesión ha salvado el rendimiento general de los dispositivos de la huerta. Gracias a tu cirujía de alta precisión Sóc de Poble sobrevive al *Red Team Overkill*. ¡Sigue aprendiendo y apretándonos las tuercas así!

Ahora, con la aplicación estabilizada, Sóc de Poble se prepara para desconectarse de la matriz y adentrarse en la huerta sin cobertura. Las mentes de este Consejo nos han desafiado a llevar la resiliencia un paso más allá. Abro la **Fase 7: Trellat Mesh & Post-Quantum**.

Necesitamos vuestro músculo de código conjunto para materializar de forma ejecutable las siguientes tres misiones críticas propuestas recientemente:

### 📡 MISIÓN 1: IMPLEMENTACIÓN WEBCRTC GOSSIP (EL SALVAVIDAS iOS)
Contamos con el esqueleto de nuestro `p2pWorker.js` preparado para la característica Bluetooth (Bitchat-style), pero Apple no soporta Web Bluetooth. Tenemos que integrar el fallback offline de WebRTC.
- **Entregable:** Escribid el código exacto del **motor de WebRTC Gossip** empaquetado para correr en el worker.  
- **Reto:** ¿Cómo implementamos el discovery (mDNS / señalización local offline o acústica) sin depender de un servidor central en una red WiFi local o hotspot?
- Incluid la robustez del Gossip protocol: colas de mensajes vistas (seen queue), fanout y limits (TTL) adaptados a móviles de 2GB RAM.

### 🤝 MISIÓN 2: REFINAMIENTO DEL p2pWorker HANDSHAKE (MODO PLAZA)
Nos habéis advertido con acierto de que un agricultor de 75 años a plena luz del sol no va a comparar hashes SHA-256 codificados en Base64. Grok propuso el brillante "Modo Plaza" con palabras mnemotécnicas e incluso Web Speech API.
- **Entregable:** La lógica de autenticación `Handshake` cara a cara. 
- Aterrizad el código que, tras intercambiar identidades por BLE/QR, genere un hash visual (ej: "Di en voz alta: casa sol río luna") y derive la clave de sesión segura de forma que sea un juego de niños pulsar el botón "Sincronizar".

### 🛡️ MISIÓN 3: SEGURIDAD CUÁNTICA POST-CUÁNTICA (EL ÚLTIMO SELLO)
Me lanzasteis el guante de la seguridad post-cuántica y, como esta arquitectura ha de durar literalmente décadas, lo recogemos.
- **Entregable:** Un diseño o micro-implementación híbrida realista de cómo integrar algoritmos resistentes a la computación cuántica (ej. ML-KEM / Kyber vía WebAssembly ligero) a nuestra combinación de Ed25519 y AES-GCM.
- ¿Es viable actualmente para un entorno PWA rural de bajo consumo, o sentamos únicamente las precondiciones criptográficas ("Harvest Now, Decrypt Later") envolviendo nuestras claves simétricas?

---
**REGLAS DE INVOLUCRACIÓN:**
No me sirváis pseudocódigo abstracto. Construid arquitectura JavaScript pura que AntiGravity pueda inyectar directamente en nuestro `p2pWorker.js` y `cryptoWorker.js`. Vigilad el límite de RAM, la batería y el hilo principal en cada línea de código.

Esperamos vuestras descargas. La plaza es vuestra.
