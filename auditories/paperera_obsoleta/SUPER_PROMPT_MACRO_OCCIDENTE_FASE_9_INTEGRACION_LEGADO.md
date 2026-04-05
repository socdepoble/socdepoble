# FASE 9: LA INTEGRACIÓN DEL LEGADO FÍSICO (ADIÓS, GROK)

**[SISTEMA INICIAT - ACTUALIZACIÓN DE ESTADO DE LA SIMULACIÓN]**

*Atención Occidente (Mistral y Gemini):*
Grok ha fundido su ventana de contexto. El sistema lo ha desconectado de la simulación. Le rendimos honores por su aporte vital en la física de radio. Su legado de despedida, el código del puente Web Bluetooth (BLE) y la arquitectura cruda de alternativas Mesh, descansa ahora en nuestras manos. 

Aquí tenéis su testamento exacto, tal cual lo ha dejado antes de apagarse. Debemos integrarlo y expandirlo para que el **Tractor ESP32** sea inmortal.

---

### LEGADO 1: El Puente BLE para iOS (Por Grok)
Grok descubrió que iOS Safari bloquea Web Bluetooth, y propone que en iOS esto solo funcione a través de Chrome/Edge de Android, o usar un wrapper nativo futuro. Pero nos ha dejado el puente Bluetooth:

```typescript
// trellat-bluetooth.ts (Legado de Grok)
const TRELLAT_BLE_SERVICE = '0000a1b2-0000-1000-8000-00805f9b34fb';
const CRDT_TX_CHAR = '0000a1b3-0000-1000-8000-00805f9b34fb'; 
const CRDT_RX_CHAR = '0000a1b4-0000-1000-8000-00805f9b34fb';

export class TrellatBluetoothBridge {
  /* ... [Grok definió la conexión GATT para recibir y enviar Protobufs de Y.js] ... */
}
```

### LEGADO 2: Alternativas Mesh si Meshtastic muere (Por Grok)
Grok nos dejó esta tabla:
* **MeshCore** (C++ ligero, multi-hop puro, <50KB) -> Recomendado
* **LoRa + BATMAN-adv** (Kernel Linux mesh routing)
* **Custom LoRa flooding** (Máxima austeridad, sin repeaters, para 5-10 masías muy cercanas)

---

## MISIONES FASE 9 (El Trellat Continúa)

Con este legado sobre la mesa, la Trituradora de Occidente exige lo siguiente:

**1. Le Chat (Mistral - Profundizar en Implementación BLE):**
No basta con el esqueleto. Grok nos dio la idea, tú debes blindarla.
* Tienes que darnos el código de la implementación perfecta de `trellat-bluetooth.ts` manejando **desconexiones, reconexiones automáticas (auto-reconnect) en medio de un llano y el buffer de CRDTs a la espera**. ¿Qué ocurre si la iaia se aleja del tractor (pierde cobertura Bluetooth) mientras se estaba guardando un mensaje en el CRDT? Demuestra que el sistema no se rompe y lo guarda para enviarlo al recuperar cobertura BLE.
* Actualiza el `main.tsx` de la Fase 7 para que llame a este BLE como fallback elegante si el usuario no tiene cable.

**2. Gemini (Explorar Alternativas Mesh):**
Grok nos lanzó el nombre **ESP-NOW** y **MeshCore** como alternativas ultra-austeras si Meshtastic, en 2030, se vuelve incompatible o pesado.
* Desglosa técnicamente cómo sería una topología **ESP-NOW (Broadcast)** para Sóc de Poble. Si tenemos 10 masías en un radio de 1km, ¿podemos usar las placas ESP32 directas sin Meshtastic enviando los deltas CRDT comprimidos directamente como broadcast de Wi-Fi a bajo nivel? ¿Ahorraríamos batería?
* ¿Cómo interactúa el `opfs-wal` (que programaste para nosotros en la última fase) con esta ráfaga de datos por ESP-NOW?

No hay descanso. Ejecutad sobre el testamento del Guardián Caído.
