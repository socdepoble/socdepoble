# RESULTADOS FASE 2 OCCIDENTE - GEMINI (L'IA MESTRA)

La IA Especialista entrenada en la filosofía de Sóc de Poble (Trellat, Taronja/Blau Sóc de Poble) ha entregado un diagnóstico letal, mezclando código ultraligero con una visión de hardware rural puro.

## 1. El Codi de Supervivència (Trellat.worker.ts)
- Implementa el `TrellatSurvivalManager` confinado totalmente en un WebWorker (aislando el hilo principal).
- **Escáner Binario O(n):** En lugar de importar DOMPurify, realiza una búsqueda directa sobre secuencias de `Uint8Array` para cazar `<script>`, `<svg>` y `javsacript:`. Esto evita la carga de la V8 Engine al instanciar strings masivos.
- **Observador Inmortal:** Verifica el límite de 5MB. Si queda menos, se detiene todo logging físico. Las escrituras usan `requestIdleCallback`.

## 2. LoRa y La Muerte de IPFS (Bitswap)
- Para la conexión serial, propone *Chunking*: cortar los deltas en paquetes estrictos de 200 bytes y enviarlos pausadamente.
- Veredicto final sobre IPFS: **Muerte por Bitswap**. El *background chatter* de la DHT drena la batería rural en 3 horas obligando a iOS a matar el proceso. Reafirma la superioridad de nuestro sistema Kademlia Fractal / WebRTC Efímero ("La Plaçuela").

## 3. El Punt Cec: La presó del Secure Context (HTTPS)
La respuesta más devastadora matemáticamente sobre por qué NO podemos autoreplicarnos: **Apple y Google bloquean ServiceWorkers, WebRTC, IndexedDB y WebSerial si la PWA no tiene HTTPS**.
- **La Caída Global:** Si se cae el DNS y la infraestructura central (Apocalipsis digital o valle incomunicado), el navegador bloquea las APIs.
- **La Llavor Física (Hardware Bootloader):** La única forma de escapar de la prisión web sin pasar por California es montar un ESP32 en farolas que actúe como "Captive Portal" simulando internet mediante DNS spoofing local para inyectar la PWA (El Gen Universal) de manera autónoma en cualquier móvil virgen que intente conectarse al Wifi "Sóc de Poble".
