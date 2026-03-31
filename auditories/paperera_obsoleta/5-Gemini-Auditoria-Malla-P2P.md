# Auditoría Arquitectónica: Segunda Fase Rhizome (Malla Persistente)
**Rol:** Arquitecto L7+, Especialista en Sistemas Distribuidos y Hardware Limitado.
**Destinatario:** Gemini Advanced
**Proyecto:** Sóc de Poble (Core V10 - Zero Network)

---

## [1] El Contexto Actual ("Doctrina Zero-Patch")
Hola Gemini. Estamos construyendo "Sóc de Poble", una plataforma digital que actúa como infraestructura cívica en zonas rurales de la "España Vaciada" (baja conectividad 3G, dispositivos Android de 2GB de RAM, altas temperaturas). 

Recientemente hemos implementado lo que llamamos la doctrina **"Zero-Patch"**:
- **Erradicación del Polling:** Hemos purgado todos los `setInterval` destructivos de la capa de presentación (UI) de React. 
- **Desacoplamiento UI-Malla:** Hemos implementado `useSyncExternalStore` en nuestros hooks (`useRhizomeAlerts.js` y `useRhizomeMesh.js`). Esto permite suscribir directamente la UI a los observadores del motor P2P nativo (Yjs) en la capa inferior, mutando el DOM solo frente a fragmentos binarios (deltas) confirmados, sin encadenar re-renders innecesarios (cascadas).
- **Aislamiento Criptográfico:** Eliminación de dependencias pesadas usando `crypto.randomUUID()` nativo.

**Resultado:** El sistema es totalmente reactivo y consume un 80% menos de recursos visuales. Es una malla viva.

---

## [2] El Problema Crítico: La "Muerte Silenciosa" del Background
Nuestra capa de presentación es ahora indestructible, pero tenemos un problema a nivel de Sistema Operativo (OS). Al estar ejecutándonos en un entorno PWA/Híbrido, cuando el agricultor se mete el teléfono en el bolsillo y **apaga la pantalla**, Android/iOS **congela el hilo principal de JavaScript**.

Esto significa que nuestro `RhizomeMesh` (transporte Bluetooth LE / DTN (Delay-Tolerant Networking)) se apaga por completo. El móvil deja de actuar como nodo puente (mula de datos / store-and-forward) y la red de emergencia se colapsa hasta que la pantalla vuelve a encenderse.

---

## [3] Directiva (Tu Tarea)
Necesito que audites nuestra filosofía y nos propongas una **hoja de ruta de ingeniería** clara para resolver el problema del "Background Service". 

**Responde abordando los siguientes puntos:**

1. **Autopsia del Problema:** Confirma en base a tu conocimiento hasta qué punto es severo el problema de suspensión de Android/iOS en entornos de malla PWA vs Nativo. 
2. **Estrategia Capacitor / Híbrida:** ¿Cuál es el camino menos invasivo para inyectar un *Service Worker* o un plugin nativo de Capacitor capaz de mantener Viva y publicando a la red Bluetooth LE `(BLE Peripheral/Central)` con la pantalla bloqueada durante horas?
3. **El Motor CRDT (Yjs) en Background:** Si logramos que Bluetooth funcione en segundo plano, ¿cómo deberíamos comunicar el hilo nativo que recibe fragmentos binarios con nuestro árbol principal de estado (Yjs Doc)? ¿Mantenemos la lógica de Yjs en un Worker paralelo, o hacemos puente JS-Nativo a través de un Intent/Notification Service?
4. **Ley de Ferretería Rural:** Propón cómo podemos controlar térmicamente y a nivel de batería este proceso. Si el usuario activa el modo "Nodo Reflector", ¿cuánta batería real consumiría un scan BLE cada 1 minuto vs pasivo continuo?

Necesito una respuesta cruda, nivel ingeniero senior. No asumas infraestructura de red tradicional; somos una malla autónoma desconectada de Internet.
