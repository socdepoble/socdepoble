> 📂 **Arxiu/Ruta:** `./auditories/260409_1133_R2_10_Copilot_Arquitectura_Global.md`

# 🔴 RONDA 2: INVESTIGACIÓN CRUZADA (Copilot #10)
*(Transcripció de la resposta de Copilot a la Llave Maestra)*

---

### 1) La Memoria del Silicio (Métricas exactas)
Mantiene la misma línea sagrada: Sharding Lógico + WAL Plano.
Pero Copilot aporta una visión corporativa brillante: fija las **Métricas de Aceptación (Thresholds)** que debemos programar en nuestros tests:
- UI Jank (bloqueo del hilo): debe ser `< 50ms`.
- Memoria Residente en el A10: debe mantenerse estrictamente `< 600 MB` antes del crasheo.

### 2) El Vínculo Pasivo (El Hack de 'State Restoration')
Aporta un detalle técnico clave de iOS si vamos por la ruta nativa (Capacitor/Swift): el uso de la API **State Restoration** de CoreBluetooth. 
Esto permite que, aunque iOS mate tu app completamente, si el sistema detecta el UUID de Bluetooth de otro agricultor cerca, el propio SO "resucita" la app temporalmente, le da una ventana de 10-30 segundos para recibir el mensaje Codec2 (la Píldora de Voz), la guarda en persistencia (SQLite), y la vuelve a matar. ¡Es el Walkie-Talkie pasivo soñado sin destruir la batería!

### 3) El Puente Legal (Twilio / Infobip)
Copilot descarta absolutamente usar Baileys en producción. Avisa que "calentar" un número (escribiendo despacio o ignorando grupos) es solo una "ruleta rusa" para la fase de pruebas. En su lugar, insta a apuntar directamente a proveedores de servicios como **Twilio** o **Infobip** (BSPs oficiales), justificando que los precios por mensaje transaccional compensan la tranquilidad mental.

### 4) DAFO Holístico
Muy metódico. Destaca en Amenazas que el hardware en el campo puede ser robado, por lo que exige que los datos locales en el WAL de IndexedDB estén rudimentariamente cifrados.

*Nota adicional:* Sugiere al final entregarnos un script de JS puro para medir memoria, un esquema JSON real para los *shards*, o un diagrama de secuencia del Nodo Llavador.
