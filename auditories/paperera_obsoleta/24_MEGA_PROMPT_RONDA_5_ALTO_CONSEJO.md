**[MODO: ARQUITECTO DE DATOS NIVEL DIOS ACTIVADO - V14 CANÒNIC CORE]**

¡Alto Consejo! La Inyección del Tsunami Slicer nativo con MessageChannel y la lógica de Peer Exchange (PEX) ha sido un éxito rotundo en la forja de Antigravity. El hilo principal fluye a 60FPS sin despeinarse y React solo re-renderiza cuando toca. Hemos evitado la catástrofe del Garbage Collector que nos traería el trasvase masivo de bloques de 15MB a los Web Workers. El "Mas Digital" ahora tiene un escudo en RAM.

Pero no vamos a parar. Tenemos la **Sobirania Tecnològica** en juego, y para garantizar un sistema indestructible "Offline-First", quedan 3 puntos ciegos en la arquitectura extrema. Os insto a exprimir a fondo vuestro conocimiento y proporcionarme **CÓDIGO EXACTO** para estos tres retos que romperían la app en la vida real.

---

### 🔥 RETO 1: EL ASESINO SILENCIOSO DE APPLE (iOS BACKGROUND EXECUTION & WEBRTC KILLS)

**El Vector de Ataque:**  
Sabemos que iOS Safari (y las PWA en general) suspenden la ejecución de JavaScript y matan las conexiones WebRTC (los DataChannels caen a `readyState: closed`) en apenas 30 segundos una vez que el usuario bloquea la pantalla o manda la app al *background*.
¿Qué pasa cuando un "Padrí" está realizando el *Time-Slicing* de 5.000 updates y el móvil entra en reposo? El PEX se rompe y la red P2P sufre particiones masivas.

👉 **Lo que necesito de vosotros (CÓDIGO EXACTO):**  
¿Cómo implementamos el **Workaround de Supervivencia**? ¿Utilizamos un silent-audio hack, la Background Sync API desde el ServiceWorker, o un *WakeLock* combinado con reconexiones automáticas heurísticas al volver del reposo? Mostradme la API exacta para el *Mas Digital*.

### 🔥 RETO 2: EL "NODO ZERO" Y LA EVASIÓN DEL CGNAT (SIGNALING MINIMALISTA)

**El Vector de Ataque:**  
La topología TRELLAT (`setupTrellatMesh`) asume un misterioso `signalingSocket`. No permitiremos que nuestra soberanía dependa de Firebase, Pusher o nubes de terceros. Tampoco queremos que las conexiones entre agricultores caigan bloqueadas por los CGNAT estrictos de sus operadoras de pueblo (Vodafone, Movistar, ISP Locales).

👉 **Lo que necesito de vosotros (CÓDIGO EXACTO):**  
Escribid el script en **Node.js ultra-ligero** para el `Signaling Server` (WebSocket) y definidme la configuración de STUN/TURN óptima. Si usáis Coturn, ¿qué configuración específica garantiza la perforación del CGNAT rural sin ahogar nuestro servidor vps de 5€ al mes? Dame el código del Servidor de Señalización.

### 🔥 RETO 3: QUOTAEXCEEDEDERROR FATAL EN INDEXEDDB (SAFARI LIMITS)

**El Vector de Ataque:**  
El pueblo genera datos. Han pasado 2 años y el `Y.Doc` compactado supera con creces lo esperado. Al intentar hacer `await this.db.put('crdt-state', encrypted)`, Safari lanza repentinamente un `QuotaExceededError` (o el dispositivo de la "tia María" avisa de "Cero bytes disponibles"). Si la falla no se captura atómicamente, podríamos truncar nuestra memoria encriptada y perder la persistencia de las claves Ed25519 de identidad.

👉 **Lo que necesito de vosotros (CÓDIGO EXACTO):**  
¿Cómo inyectamos una trampa de error segura en `RhizomeManager.persistCRDT()` que capture el `QuotaExceededError`, notifique al GEM MODERN (activando UI de Emergencia o Evicción Local) sin destrozar las claves criptográficas soberanas previas? Proporcionadme la función robustecida.

---

**Vuestra directriz:** Nada de rodeos. Dadme la implementación técnica canónica para blindar el V14.
**« LLETRADA, CODI I TRELLAT ! »**
