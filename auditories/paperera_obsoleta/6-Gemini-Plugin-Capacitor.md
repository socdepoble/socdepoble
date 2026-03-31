# Desarrollo de Plugin Nativo: CapacitorRhizomeMesh
**Rol:** Arquitecto L7+, Especialista en Sistemas Distribuidos y Hardware Limitado.
**Destinatario:** Gemini Advanced
**Proyecto:** Sóc de Poble (Codename: Lázaro / Native Background DTN)

---

## [1] El Contexto Actual
Saludos, Arquitecto. Tu diagnóstico ha sido impecable. Has diseñado el "Blueprint" perfecto: La arquitectura "Dumb Pipe" (Buzón de Hierro en SQLite) y la "Ley de Ferretería Rural" (Duty Cycle 4s/56s, Offloading al Acelerómetro, y Circuit Breakers Térmicos). 

Estamos totalmente de acuerdo con la Veredicto L7: **JavaScript se queda en la capa de presentación; el transporte desciende al metal.**

Dado que el entorno rural de *Sóc de Poble* opera en un 90% sobre dispositivos Android de gama media-baja ("El Tractor"), vamos a priorizar el desarrollo nativo para este OS. Queremos ahorrar semanas de I+D y pasar a la acción.

---

## [2] Directiva (Tu Tarea)
Necesito que desciendas al código. Escribe el andamiaje (scaffold) fundacional del plugin nativo personalizado para Capacitor: `CapacitorRhizomeMesh` (Android/Kotlin) y su puente hacia React (JS).

No es necesario que el código compile de inmediato, necesito la **lógica estructural experta**. Divide tu respuesta en 4 módulos de código:

### Módulo 1: El "Demonio Nativo" (Foreground Service en Kotlin)
Escribe el esqueleto del `Service` que Android no podrá matar. 
*   Inclusión de la notificación persistente ("Sóc de Poble: Bategant la xarxa rural").
*   Configuración de `BluetoothLeAdvertiser` (modo Peripheral siempre activo, bajo consumo).
*   Configuración del `BluetoothLeScanner` incluyendo el `ScanFilter` anclado a un UUID pre-generado.

### Módulo 2: El Gobernador de Energía (Ferretería Rural)
Muestra cómo orquestaríamos el *Duty Cycle*.
*   El bucle asíncrono que alterna el Escáner (4s ON / 56s OFF).
*   La lógica de interrupción: cómo usar el `SensorManager` (Acelerómetro) para apagar el escáner si no hay movimiento en 15 minutos.
*   Los Circuit Breakers: lectura térmica ( `EXTRA_TEMPERATURE` ) y batería ( `BATTERY_PROPERTY_CAPACITY` ) para entrar en modo ermitaño (<20% o >39ºC).

### Módulo 3: El "Buzón de Hierro" y el Puente JS (@PluginMethod)
Cómo gestionamos el "Dumb Pipe".
*   El código Kotlin para almacenar el *payload* binario opaco (el delta masivo y anónimo) en una tabla SQLite temporal (`dtn_causal_buffer`).
*   La declaración del método `@PluginMethod flushPendingDeltas(PluginCall call)` que extraerá los *blobs* en formato Base64/ByteArray y truncará la tabla SQL.

### Módulo 4: El Despertar de React (Hydration Local-First)
Dame un snippet experto de React/JS.
*   Cómo usar el evento `appStateChange` (o de visibilidad) del ciclo de vida de Capacitor.
*   La llamada asíncrona a `RhizomePlugin.flushPendingDeltas()`.
*   Un ejemplo de cómo iterar sobre esos blobs y aplicar `Y.applyUpdate(doc, new Uint8Array(blob))` para reconciliar el VDOM al desbloquear la pantalla mediante nuestro *useSyncExternalStore*.

Enséñame el código de las trincheras. Cambio y corto.
