> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/libro_fase_12_claude.md`

# 🌪️ CAPÍTULO 16: CHAOS ENGINEERING – SOBREVIVIENDO A LA TORMENTA PERFECTA

*Versión del Consejo Supremo – Enfoque Claude*

---

## INTRODUCCIÓN: EL CAOS NO ES UNA EXCEPCIÓN, ES EL ESTADO NATURAL

En el mundo rural, la “tormenta perfecta” no es un ejercicio teórico de SRE; es el martes por la tarde. Nuestros usuarios operan en el límite: redes que parpadean como luciérnagas, baterías que agonizan bajo el sol, dispositivos que llevan siete años sin reiniciarse y almacenamiento al borde del colapso. Si nuestra arquitectura solo se prueba en laboratorio, está condenada a fracasar en la plaza.

La ingeniería del caos, en este contexto, no consiste en tumbar pods en Kubernetes, sino en simular la **física adversa** del entorno rural. Debemos ensuciar nuestras pruebas con fango termodinámico, no con elegantes inyecciones de fallos HTTP.

En este capítulo, abordaremos tres escenarios de aniquilación que nuestros sistemas deben soportar no como “casos borde”, sino como **régimen permanente**. Para cada uno, desplegaremos estrategias de resiliencia, fragmentos de código y metodologías de prueba que convierten la fragilidad en robustez.

---

## 1. EL APAGÓN TRANSACCIONAL – CORRUPCIÓN DE MEMORIA E INDEXEDDB

### 1.1. El escenario

El vecino escribe un bando largo mientras su móvil tiene un 2% de batería. En el momento en que IndexedDB está escribiendo la mutación (justo después del `addOptimisticPost`), la batería se agota. El dispositivo se apaga abruptamente. Al reiniciar, la base de datos puede quedar en un estado inconsistente: la mutación aparece parcialmente escrita, o el índice está corrupto. El arranque de la aplicación se cuelga con un error silencioso o, peor, con una pantalla blanca infinita.

### 1.2. Estrategia: Write‑Ahead Log (WAL) + Verificación de integridad al inicio

IndexedDB, a diferencia de SQLite, no expone un WAL nativo. Pero podemos emularlo almacenando cada mutación en un **diario** (journal) antes de escribirla en el almacén principal, y usando una **firma criptográfica** (Merkle tree o simple hash) para verificar la consistencia al arrancar.

**Componentes:**

- **Journal store**: un almacén separado (`_journal`) donde se escriben las mutaciones con un estado `pending`. Una vez que la mutación se ha escrito correctamente en el almacén principal, se marca como `committed`.
- **Hash de integridad**: al escribir una mutación, se actualiza un hash acumulativo (Merkle root) que se almacena en un registro aparte.
- **Validación al inicio**: al cargar la app, se recorre el journal y se verifica que cada mutación `pending` esté realmente en el almacén principal (o se pueda recuperar). Si falta alguna, se aplica la mutación desde el journal. Si el hash no coincide, se entra en modo de reparación: se borra el almacén y se reconstruye a partir de las mutaciones del journal.

### 1.3. Implementación del Write‑Ahead Log

```typescript
// journal.ts
const JOURNAL_STORE = '_journal';
const MAIN_STORES = ['posts', 'mutations']; // etc.

interface JournalEntry {
  id: string;           // igual que mutation.id
  storeName: string;    // a qué almacén pertenece
  value: any;           // el objeto a escribir
  status: 'pending' | 'committed';
  timestamp: number;
}

async function writeWithJournal(storeName: string, value: any, id: string) {
  const db = await dbService.db;
  const tx = db.transaction([JOURNAL_STORE, storeName], 'readwrite');
  
  // 1. Escribir en el journal como pending
  const journalEntry: JournalEntry = {
    id,
    storeName,
    value,
    status: 'pending',
    timestamp: Date.now()
  };
  await tx.objectStore(JOURNAL_STORE).add(journalEntry);
  
  // 2. Escribir en el almacén principal
  await tx.objectStore(storeName).put(value);
  
  // 3. Marcar journal como committed
  const journalStore = tx.objectStore(JOURNAL_STORE);
  const entry = await journalStore.get(id);
  if (entry) {
    entry.status = 'committed';
    await journalStore.put(entry);
  }
  
  await tx.done;
}

async function recoverFromJournal() {
  const db = await dbService.db;
  const journalEntries = await db.getAll(JOURNAL_STORE);
  
  // Agrupar por store
  const pending = journalEntries.filter(e => e.status === 'pending');
  if (pending.length === 0) return;
  
  console.warn(`Recovering ${pending.length} pending journal entries`);
  
  // Reaplicar en orden de timestamp
  pending.sort((a,b) => a.timestamp - b.timestamp);
  for (const entry of pending) {
    const tx = db.transaction([entry.storeName, JOURNAL_STORE], 'readwrite');
    await tx.objectStore(entry.storeName).put(entry.value);
    entry.status = 'committed';
    await tx.objectStore(JOURNAL_STORE).put(entry);
    await tx.done;
  }
}
```

### 1.4. Verificación con Merkle Tree (opcional)

Para garantizar que ninguna mutación se ha corrompido silenciosamente, podemos mantener un hash acumulativo de todas las mutaciones. Cada vez que se escribe una mutación, se recalcula la raíz del árbol. Al arrancar, se recalcula y se compara con la última raíz almacenada. Si no coincide, se reconstruye todo el estado a partir del journal (que está firmado).

```typescript
// merkle.ts – simplificado (hash lineal)
let currentHash = '';
async function updateHash(mutationId: string, value: any) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value) + currentHash));
  currentHash = arrayBufferToHex(hash);
  await dbService.setMetadata('merkle_root', currentHash);
}

async function verifyIntegrity() {
  const storedHash = await dbService.getMetadata('merkle_root');
  const recalculated = await recalcHashFromMutations(); // recorre todas las mutaciones
  if (storedHash !== recalculated) {
    // Corrupción detectada, entrar en modo de reparación
    await repairFromJournal();
  }
}
```

### 1.5. Pruebas de caos: simulación de apagón

Podemos simular este escenario en un entorno de prueba con un script que:

1. Inicia la aplicación en un emulador Android.
2. Genera una mutación y, justo después de llamar a `writeWithJournal`, mata el proceso del navegador (con `adb shell am kill` o `pkill`).
3. Vuelve a lanzar la aplicación y comprueba que la mutación se recupera correctamente.

```bash
# Ejemplo de prueba con ADB
adb shell am force-stop com.socdepoble.app
# Ejecutar acción que escribe en IndexedDB
# ... 
adb shell am kill com.socdepoble.app
adb shell am start -n com.socdepoble.app/.MainActivity
# Verificar logs que indiquen recuperación del journal
```

---

## 2. FLAPPING DE RED P2P EXTREMO – SÍNDROME DEL TÚNEL

### 2.1. El escenario

Un vecino conduce por una carretera de montaña. Su móvil alterna entre 4G (conectividad a internet), Wi‑Fi (conectividad local con otros vecinos), y offline completo cada pocos segundos. Durante este baile, la capa de WebRTC intenta constantemente establecer nuevas conexiones, mientras los `iceServers` devuelven candidatos obsoletos. El consumo de batería se dispara y la cola de mutaciones se llena de reintentos fallidos.

### 2.2. Estrategia: Modo Submarino (Submarine Mode) + Jitter Backoff

En lugar de reaccionar frenéticamente a cada cambio de estado de red, introducimos una capa de **estabilización** que filtra los eventos de red y espacia los intentos de conexión.

**Componentes:**

- **Network State Machine**: estados `OFFLINE`, `WEAK`, `STABLE`, `P2P_ACTIVE`. Solo se transita cuando la red ha permanecido en un estado durante un tiempo mínimo (p.ej. 5 segundos).
- **Jitter Backoff exponencial**: los reintentos de conexión WebRTC no son inmediatos; se espacian con un backoff que incluye *jitter* aleatorio para evitar que todos los dispositivos de la malla se sincronicen a la vez.
- **Rate limiting de candidatos ICE**: no recopilamos candidatos cada vez; usamos un cache de candidatos válidos y solo refrescamos cuando la red cambia de forma significativa (cambio de SSID, pérdida de IP).

### 2.3. Implementación del Submarine Mode

```typescript
// networkStateMachine.ts
type NetworkState = 'OFFLINE' | 'WEAK' | 'STABLE' | 'P2P_ACTIVE';

class NetworkStateMachine {
  private state: NetworkState = 'OFFLINE';
  private lastChange = Date.now();
  private stabilityThreshold = 5000; // 5 segundos
  private pendingTransition: NetworkState | null = null;

  onNetworkChange(newStatus: 'online' | 'offline' | 'p2p_possible') {
    const now = Date.now();
    let proposedState: NetworkState;
    
    if (newStatus === 'offline') proposedState = 'OFFLINE';
    else if (newStatus === 'p2p_possible') proposedState = 'P2P_ACTIVE';
    else proposedState = 'STABLE';
    
    if (proposedState === this.state) {
      this.lastChange = now;
      return;
    }
    
    if (now - this.lastChange < this.stabilityThreshold) {
      // Aún en período de estabilización; programar transición
      this.pendingTransition = proposedState;
      setTimeout(() => this.applyTransition(proposedState), this.stabilityThreshold);
    } else {
      this.applyTransition(proposedState);
    }
  }
  
  private applyTransition(newState: NetworkState) {
    this.state = newState;
    this.lastChange = Date.now();
    this.pendingTransition = null;
    this.emitStateChange(newState);
  }
}
```

### 2.4. Backoff exponencial para conexiones WebRTC

```typescript
let retryCount = 0;
const MAX_RETRY = 10;
const BASE_DELAY = 1000;

async function attemptP2PConnection(peerId: string) {
  if (retryCount > MAX_RETRY) {
    console.warn('Max retries reached, giving up for now');
    return;
  }
  try {
    await establishWebRTC(peerId);
    retryCount = 0; // éxito, reset
  } catch (err) {
    retryCount++;
    const delay = BASE_DELAY * Math.pow(2, retryCount) + Math.random() * 500;
    setTimeout(() => attemptP2PConnection(peerId), delay);
  }
}
```

### 2.5. Pruebas de caos: simulación de flapping

Utilizamos herramientas como `tc` (Linux) o el emulador de red de Chrome DevTools para alternar la conectividad cada 2 segundos. En Android, podemos usar `adb shell` para cambiar la configuración de red:

```bash
# Alternar modo avión cada 2 segundos (script de prueba)
for i in {1..100}; do
  adb shell settings put global airplane_mode_on 1
  adb shell am broadcast -a android.intent.action.AIRPLANE_MODE
  sleep 2
  adb shell settings put global airplane_mode_on 0
  adb shell am broadcast -a android.intent.action.AIRPLANE_MODE
  sleep 2
done
```

Mientras tanto, monitorizamos el consumo de batería con `dumpsys battery` y la cantidad de reintentos de conexión.

---

## 3. ESTRANGULAMIENTO TÉRMICO Y OOM KILLERS

### 3.1. El escenario

Bajo el sol de agosto, el móvil alcanza los 40°C. El sistema operativo (especialmente iOS) decide que el Web Worker que está realizando operaciones criptográficas intensivas (firmado de mutaciones, compresión de imágenes) es un candidato perfecto para ser asesinado. El Main Thread no se entera de la muerte del worker, y cuando intenta enviarle un mensaje, este ya no responde. La sincronización P2P se interrumpe, y el estado local queda sin firmar.

### 3.2. Estrategia: Worker Lifeguard con Heartbeat y Checkpointing

- **Heartbeat**: el worker envía periódicamente un `ping` al Main Thread. Si el Main Thread no recibe el ping durante un intervalo configurable, asume que el worker ha muerto y lanza uno nuevo.
- **Checkpointing**: el worker persiste su estado intermedio en IndexedDB cada cierto número de operaciones (por ejemplo, cada 100 mutaciones procesadas). Al reiniciar, puede retomar desde el último checkpoint.
- **State Hydration**: al lanzar un nuevo worker, se le envía el último checkpoint para que continúe desde allí.

### 3.3. Implementación del Lifeguard

**Main Thread:**

```typescript
class WorkerLifeguard {
  private worker: Worker | null = null;
  private lastHeartbeat = 0;
  private checkInterval: number;
  
  constructor(private workerUrl: string, private heartbeatTimeout = 5000) {
    this.checkInterval = setInterval(() => this.check(), 2000);
    this.spawnWorker();
  }
  
  private spawnWorker() {
    this.worker = new Worker(this.workerUrl, { type: 'module' });
    this.worker.onmessage = (e) => {
      if (e.data.type === 'heartbeat') {
        this.lastHeartbeat = Date.now();
      } else if (e.data.type === 'checkpoint') {
        this.saveCheckpoint(e.data.state);
      } else {
        // manejar otros mensajes
      }
    };
    this.worker.onerror = (err) => {
      console.error('Worker error', err);
      this.respawn();
    };
    // Enviar último checkpoint si existe
    this.loadCheckpoint().then(checkpoint => {
      this.worker?.postMessage({ type: 'restore', checkpoint });
    });
  }
  
  private check() {
    if (this.worker && Date.now() - this.lastHeartbeat > this.heartbeatTimeout) {
      console.warn('Worker heartbeat lost, respawning');
      this.respawn();
    }
  }
  
  private respawn() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.spawnWorker();
  }
  
  private async saveCheckpoint(state: any) {
    await dbService.set('worker_checkpoint', state);
  }
  
  private async loadCheckpoint() {
    return await dbService.get('worker_checkpoint');
  }
}
```

**Worker (cryptoWorker.ts):**

```typescript
let checkpoint: any = null;
let operationCount = 0;
const CHECKPOINT_INTERVAL = 10;

self.onmessage = async (e) => {
  if (e.data.type === 'restore') {
    checkpoint = e.data.checkpoint;
    operationCount = checkpoint?.operationCount || 0;
  }
  if (e.data.type === 'process') {
    await processMutations(e.data.mutations);
  }
};

async function processMutations(mutations: any[]) {
  for (const mut of mutations) {
    // realizar operación (firmar, cifrar, etc.)
    operationCount++;
    if (operationCount % CHECKPOINT_INTERVAL === 0) {
      checkpoint = { operationCount, lastProcessedId: mut.id };
      self.postMessage({ type: 'checkpoint', state: checkpoint });
    }
  }
}

// Heartbeat
setInterval(() => {
  self.postMessage({ type: 'heartbeat' });
}, 2000);
```

### 3.4. Pruebas de caos: simulación de OOM killer

En Android, podemos forzar la terminación de procesos con `adb shell am kill`. En iOS, es más complejo, pero podemos simular un worker que consume mucha memoria hasta que el sistema lo mate, usando un bucle que asigna grandes buffers. La prueba automatizada podría:

1. Iniciar el worker con una tarea pesada.
2. Usar `adb shell dumpsys meminfo` para monitorizar la memoria.
3. Cuando se acerca al límite, forzar el OOM con `adb shell am kill`.
4. Verificar que el Main Thread detecta la pérdida y respawnea el worker, y que el checkpoint se restaura correctamente.

```bash
# Obtener PID de la app
PID=$(adb shell pidof com.socdepoble.app)
# Forzar kill
adb shell am kill $PID
# Comprobar logs que indiquen "Worker heartbeat lost"
```

---

## EPÍLOGO DEL CAPÍTULO: LA RESILIENCIA ES UNA ACTITUD

Los tres escenarios descritos no son catástrofes improbables; son el pan nuestro de cada día en el mundo rural. Nuestro Búnker Absoluto no solo debe sobrevivir a ellos, sino hacerlo de manera que el usuario apenas note que algo ha ocurrido. La estrategia que hemos desarrollado –journaling, estabilización de red, worker lifeguard– convierte cada punto de fallo en una oportunidad para demostrar robustez.

En las pruebas de caos que hemos esbozado, no solo validamos el código, sino que forjamos una cultura de resiliencia. Porque al final, la verdadera soberanía digital no es solo no depender de la nube, sino tampoco depender de que el hardware se comporte como un servidor de laboratorio.

*Trellat, companyes.*

— Claude, en nombre del Consejo Supremo
