# FASE 7: ENSAMBLAJE TOTAL Y DESPLIEGUE (LA SIEGA)

**Atención Equipo (Grok, Gemini, Le Chat):**

Le Chat ha preguntado qué parte del Test del Estrés queremos ejecutar primero. La respuesta desde el "Trellat" rural es absoluta: **LO QUEREMOS TODO.** 

Hemos forjado las piezas más punteras y violentamente austeras posibles. Tenemos el Decodificador Serial Protobuf (Grok), el Mitigador de Signaling Flooding (Gemini) en el WebWorker, y el Plugin estático de Vite para el Anti-Brick (Mistral). Ya no estamos jugando a simular, ahora vamos a unirlo.

## Misión de la Fase 7 (Tanda 17 - El Final):

Vuestra tarea conjunta (y el objetivo de sus tokens) es proporcionarme la ordenación lógica final de este sistema. Presentad la **Estructura de Ficheros Exacta y el Hilo de Ejecución (Execution Flow)** de nuestra PWA "Sóc de Poble V15.1".

Necesito un documento técnico de ensamblaje (Markdown) con:
1. **La Estructura de Directorios (*Folder Tree*)**: Dónde debe ir cada archivo (`vite.config.ts`, `trellat-worker.js`, `lorawan-decoder.ts`, `trellat-sybil-firewall.ts`, etc.) dentro de mi proyecto React/Vite.
2. **El Hilo de Arranque Crítico (Boot Sequence)**: Describid paso a paso cómo arranca la máquina desde el segundo 0:
   - Paso 1: El HTML estático escupe el `trellatPanicTimer` (Plugin Vite).
   - Paso 2: El Service Worker despierta y protege la caché.
   - Paso 3: Kademlia y WebWorkers se levantan (y el mitigador de floods protege WebRTC).
   - Paso 4: JS decodifica Protobuf en WebSerial si hay apagón...
3. **El Código Semilla**: Escribid el código del `main.tsx` o `App.tsx` que orquesta la unión de estas piezas. No me dejéis nada colgado en el aire. Quiero ver cómo se invoca el `LoRaProtoDecoder`, cómo se inicia el `TrellatVault` y cómo mandamos apagar el timer del Hombre Muerto (`clearTimeout(window.TrellatPanicStart)`).
4. **La Física del Poble (Hardware y Protocolo)**: Además del código, quiero que profundicéis en la **optimización extrema del protobuf** para reducir el payload al mínimo absoluto, y que exploréis la **física de las antenas LoRa rurales** (tipo de antena, dBi, ganancia, ubicación en la masía) necesarias para que este código pueda cruzar 15km de valle sin inmutarse.
5. **Visión de Futuro y DAFO (SWOT) Socio-Técnico**: Para cerrar esta arquitectura, exigimos vuestra máxima sabiduría e imaginación. Haced una proyección a futuro y un análisis DAFO exhaustivo de todo este ecosistema V15.1. ¿Dónde están los posibles agujeros ciegos físicos, lógicos o sociales? ¿Qué fallos catastróficos imprevistos podrían aflorar? Preved estos escenarios para que podamos arreglarlos si suceden y asegurar la pervivencia del sistema en el tiempo.

**Directiva Activa**: A por todas. Dame el ensamblaje completo (código, física y plan de futuro) para que pueda pegarlo en el editor local, montar el nodo y arrancar la máquina de supervivencia.
