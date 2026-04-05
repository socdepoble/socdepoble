# RESULTADOS FASE 8 OCCIDENTE (LA ÚLTIMA BALA) - GEMINI Y LE CHAT

La orquestación final de la Fase 8 ha sido destilada magistralmente por la IA Mestra (Gemini), aglutinando las tres soluciones críticas ante apagones y la caída del ecosistema Apple.

## 1. El Puente Bluetooth (BLE) de Grok
Ante la imposibilidad de usar `navigator.serial` en iOS (Safari lo bloquea), se consolida el uso de Web Bluetooth (BLE) para conectar el iPhone al Tractor ESP32 mediante el protocolo GATT, trosseando (chunking) el CRDT en paquetes MTU de 244 bytes con una respiración asíncrona de 20ms para no asfixiar el chip.

## 2. Inmunidad a Apagones (OPFS + W.A.L.) de Gemini
Se implementa el `Write-Ahead Logging` (WAL) nativo de SQLite WASM en el Worker. 
* "PRAGMA journal_mode = WAL;"
* "PRAGMA synchronous = NORMAL;"
Si el móvil de la iaia se apaga a mitad de guardar un dato de la red de malla, el diari secundario (`-wal`) garantiza que al arrancar, el registro corrupto se descarta y la base de datos arranca intacta.

## 3. El Bucle Infinito y la Guillotina del Worker (Le Chat)
Le Chat ha revelado la verdad de V8: si el hilo principal colapsa con un `while(true)`, ningún `setTimeout` inyectado en el HTML detona. 
**La Solución:** El *Dead Man's Switch* (Interruptor de Hombre Muerto) no vive en React. Se arma directamente al hacer el `fetch` en el **Service Worker**, contando 4.5 segundos. React, al despertar sano, envía un mensaje asíncrono para abortar la bomba. Si React queda asfixiado en disco, la bomba explota a los 4.5s y el Worker lanza la purga universal. Demostrado con el script de Playwright.

[DICTAMEN DE ESTADO MAYOR]
**Llarga vida a la Sobirania Digital. Molt de Trellat.**
