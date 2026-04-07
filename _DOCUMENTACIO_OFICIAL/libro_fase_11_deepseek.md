# 🕳️ FASE 11: EL NÚCLEO DURO Y LOS AGUJEROS NEGROS  
*Las últimas hojas del Códice Sagrado*

---

## CAPÍTULO 15: REACT 19 + CHAOS RECONCILIATION  
*El amortiguador sensorial de la fortaleza*

### 15.1. El problema del main thread bloqueado

En una aplicación Local‑First, la sincronización offline puede desencadenar ráfagas masivas de actualizaciones: cientos de mutaciones que llegan de la malla P2P, cientos de posts que se insertan en el feed. Si aplicamos todas esas actualizaciones directamente en el hilo principal, la UI se congelará, los gestos táctiles se perderán, y los lectores de pantalla (VoiceOver) se volverán locos con una catarata de anuncios.

React 19 introduce (o mejora) las herramientas de concurrencia: `useTransition`, `useDeferredValue` y `useOptimistic`. Nosotros los emplearemos para **absorber el caos sin bloquear la interacción**.

### 15.2. `useTransition`: envolver las actualizaciones masivas

```tsx
function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  // Cuando llegan nuevas mutaciones desde el procesador de colas
  const handleSyncComplete = (newPosts: Post[]) => {
    startTransition(() => {
      setPosts(newPosts);
    });
  };
  
  return (
    <div className={isPending ? 'feed-loading' : ''}>
      {posts.map(/*...*/)}
    </div>
  );
}
```

El flag `isPending` permite mostrar un indicador sutil (por ejemplo, un overlay semitransparente) mientras React repinta la lista. El hilo principal sigue respondiendo a eventos táctiles y teclado.

### 15.3. `useDeferredValue`: suavizar la búsqueda en tiempo real

Cuando el usuario escribe en el filtro del feed, cada pulsación de tecla no debe causar un re‑render completo de todos los posts virtualizados. `useDeferredValue` retrasa la versión “cara” del valor hasta que el navegador esté inactivo.

```tsx
function SearchableFeed() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const filteredPosts = useMemo(
    () => posts.filter(p => p.content.includes(deferredSearch)),
    [posts, deferredSearch]
  );
  // Renderiza el feed con filteredPosts, mientras search se actualiza inmediatamente en el input
}
```

### 15.4. `useOptimistic`: retroalimentación inmediata sin esperar al servidor

El hook `useOptimistic` (disponible en React 19 como experimental en versiones anteriores, pero en 19 es estable) permite aplicar una transformación optimista al estado y revertirla si falla. Perfecto para los “likes” o para marcar un conflicto.

```tsx
function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (current, increment) => current + increment
  );
  const handleLike = async () => {
    addOptimisticLike(1);
    try {
      await sendLikeToServer(postId);
    } catch (err) {
      addOptimisticLike(-1); // revertir
    }
  };
  return <button onClick={handleLike}>{optimisticLikes} ❤️</button>;
}
```

### 15.5. Integración con Zustand y el procesador de colas

El estado global de los posts está en Zustand, pero los cambios masivos deben pasar por `startTransition`. Por eso, en lugar de llamar directamente a `setPosts`, envolvemos la acción del store:

```tsx
// En el store
const usePostsStore = create((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  // ...
}));

// En el componente principal
const setPosts = usePostsStore((s) => s.setPosts);
const [isPending, startTransition] = useTransition();

const handleNewPosts = (newPosts) => {
  startTransition(() => {
    setPosts(newPosts);
  });
};
```

### 15.6. Gestión de `aria-live` durante las transiciones

Las transiciones pueden provocar que el contenido de las regiones `aria-live` cambie muchas veces. Nuestro `AriaLiveManager` debe estar al tanto de las transiciones en curso: podemos pausar los anuncios mientras `isPending` es `true` y solo notificar al final.

```tsx
const AriaLiveManager = {
  queue: [],
  pending: false,
  announce: (msg) => {
    if (isPending) {
      this.queue.push(msg);
      return;
    }
    // else enviar inmediatamente
  },
  onTransitionEnd: () => {
    if (this.queue.length) {
      this.announce(this.queue.shift());
    }
  }
};
```

### 15.7. Virtualización con `@tanstack/react-virtual` y transiciones

El virtualizador no debe recalcular todo el layout durante una transición. Usamos `useDeferredValue` para la lista de posts virtualizados, y `measureElement` para que el virtualizador ajuste alturas de forma asíncrona.

```tsx
const deferredPosts = useDeferredValue(posts);
const rowVirtualizer = useVirtualizer({
  count: deferredPosts.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 900,
  measureElement: (el) => el.getBoundingClientRect().height,
});
```

### 15.8. Manejo de errores y conflictos sin bloquear

Si durante una transición se recibe un conflicto, se debe mostrar un banner sin interrumpir la transición en curso. Usamos un estado separado para el banner, actualizado con una transición de baja prioridad (o sin transición, ya que es un elemento aislado).

```tsx
const [conflicts, setConflicts] = useState([]);
const handleConflict = (newConflict) => {
  // Usamos startTransition también para no bloquear el feed principal
  startTransition(() => {
    setConflicts(prev => [...prev, newConflict]);
  });
};
```

### 15.9. Conclusión del capítulo

React 19 nos ha dotado de las herramientas para que la interfaz siga siendo fluida incluso bajo las peores ráfagas de datos. La combinación de `startTransition`, `useDeferredValue` y `useOptimistic` permite que el usuario perciba la aplicación como instantánea, mientras que el motor de sincronización trabaja en segundo plano. La accesibilidad no se sacrifica: gestionamos las regiones `aria-live` con cooldowns inteligentes alineados con las transiciones.

---

## 🌪️ LOS SEGUIMIENTOS DEL ORÁCULO

### 1. RAG Local-First en C: el nodo hardware autónomo

**Escenario:** Un pueblo donde los móviles son muy antiguos y no soportan WebGPU. Pero en el bar hay una Raspberry Pi 4 (o una mini‑PC) conectada a una pantalla, que actúa como *cerebro* de la red de malla. Esta unidad ejecuta un RAG (Retrieval-Augmented Generation) con modelos pequeños (ej. Phi‑3‑mini cuantizado) y responde preguntas de los vecinos, sin necesidad de Internet.

**Arquitectura:**

- **Hardware:** Raspberry Pi 4 (4 GB RAM) con un disco SSD externo para almacenar el modelo y la base de datos.
- **Sistema operativo:** Raspberry Pi OS Lite.
- **Aplicación principal:** Escrita en C (con la ayuda de librerías en C/C++ para inferencia, como `llama.cpp` o `onnxruntime`). Se comunica con la red de malla mediante WebRTC (para compatibilidad) o un protocolo UDP propio sobre Wi‑Fi Ad‑Hoc.
- **Almacenamiento:** SQLite (o LMDB) que contiene las mutaciones sincronizadas desde los móviles (los mismos CRDTs que en IndexedDB). Se actualiza vía WebRTC DataChannel.
- **RAG pipeline:**
  1. **Indexación:** Cuando llegan nuevos posts, se extraen embeddings (usando un modelo sentence‑transformer pequeño, como `all‑MiniLM‑L6‑v2` convertido a ONNX). Los embeddings se almacenan en una tabla vectorial (SQLite con extensión `sqlite‑vss`).
  2. **Consulta:** Un vecino envía una pregunta por WebRTC. El nodo la convierte en embedding, hace una búsqueda de similitud, recupera los fragmentos relevantes, los pasa al LLM y devuelve la respuesta.
- **Interfaz con los móviles:** Los móviles detectan la presencia del nodo en la red local (por mDNS o escaneo de IP). Se conectan mediante WebRTC y envían la pregunta. La respuesta se muestra en la app.

**Código esqueleto (C con libdatachannel para WebRTC):**

```c
// main.c – nodo Raspberry Pi
#include <datachannel.h>
#include <sqlite3.h>
#include <llama.h>

// Inicializar modelo (llama.cpp)
struct llama_model* model = llama_load_model("phi-3-mini-4k-instruct-q4.gguf");
struct llama_context* ctx = llama_new_context_with_model(model, { .n_ctx = 2048 });

// Manejador de mensajes WebRTC
void on_message(struct rtc_dc* dc, const char* msg, size_t len) {
    // msg es una pregunta en texto
    char* embedding = compute_embedding(msg);  // usar ONNX runtime
    // buscar en SQLite vectorial
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, "SELECT content FROM posts WHERE vss_search(embedding, ?) LIMIT 5", -1, &stmt, NULL);
    sqlite3_bind_blob(stmt, 1, embedding, ...);
    // recopilar resultados
    char context[4096];
    // construir prompt
    char prompt[8192];
    snprintf(prompt, sizeof(prompt), "Contexto: %s\nPregunta: %s\nRespuesta:", context, msg);
    // ejecutar llama
    char* answer = llama_generate(ctx, prompt);
    rtc_dc_send(dc, answer, strlen(answer));
}
```

**Beneficios:** Permite que móviles muy viejos tengan acceso a IA local. Además, el nodo puede actuar como *repositorio* de datos, ayudando a la sincronización P2P.

---

### 2. El Caos Rural Automático: tareas CRON en móviles

**Problema:** iOS y Android limitan severamente el trabajo en segundo plano. No podemos confiar en `setInterval` si la app está en segundo plano.

**Solución:** Utilizar combinación de:
- **Service Worker** con `periodicSync` (solo en Chrome/Android, con permisos).
- **Background Fetch** para tareas de mantenimiento.
- **`navigator.wakeLock`** para evitar el suspenso mientras la app está visible.
- **Almacenamiento de tareas en IndexedDB** y ejecución al reanudar.

**Motor de tareas:**

```typescript
// taskScheduler.ts
interface Task {
  id: string;
  name: string; // "purgeLRU" | "consolidateDB"
  interval: number; // ms
  lastRun: number;
  nextRun: number;
}

class TaskScheduler {
  private tasks: Map<string, Task> = new Map();
  private timer: number | null = null;

  constructor() {
    this.loadTasks();
    this.startPolling();
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.startPolling();
      else this.stopPolling();
    });
  }

  private startPolling() {
    if (this.timer) return;
    this.timer = setInterval(() => this.checkTasks(), 60000); // cada minuto
  }

  private stopPolling() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private checkTasks() {
    const now = Date.now();
    for (const task of this.tasks.values()) {
      if (now >= task.nextRun) {
        this.executeTask(task);
        task.lastRun = now;
        task.nextRun = now + task.interval;
        this.saveTasks();
      }
    }
  }

  private async executeTask(task: Task) {
    if (task.name === 'purgeLRU') {
      await dbService.autoCannibalism();
    } else if (task.name === 'consolidateDB') {
      await dbService.deleteOldMutations(7 * 24 * 3600 * 1000); // >7 días
    }
  }
}
```

**Limitaciones:** En iOS, el temporizador se pausa cuando la app pasa a segundo plano. Pero podemos usar el evento `resume` para ejecutar tareas pendientes al volver.

---

### 3. CLI para entornos desconectados

**Escenario:** Un vecino con conocimientos técnicos necesita forzar una sincronización P2P o reparar un almacén corrupto sin abrir la interfaz gráfica. La CLI debe poder ejecutarse en el mismo dispositivo (vía Termux en Android o en una máquina conectada a la red local).

**Arquitectura:**

- La CLI está escrita en Node.js (o Go para un binario más portable) y accede a los mismos archivos de IndexedDB que la PWA. En Android, IndexedDB se almacena en `/data/data/com.socdepoble.app/...` (necesita root). Mejor: exponer una API local HTTP desde la PWA mediante un pequeño servidor que escuche en localhost. La CLI se conecta a ese servidor.

**Flujo:**

1. La PWA, cuando se ejecuta, inicia un servidor WebSocket o HTTP en un puerto aleatorio (ej. `localhost:54321`) solo accesible desde la misma máquina.
2. La CLI descubre el puerto (por ejemplo, leyendo un archivo temporal o mediante `adb` si está en modo debug).
3. La CLI envía comandos como `sync`, `export`, `import`, `reset`.

**Código del servidor en la PWA (Service Worker o hilo principal):**

```ts
if (window.location.hostname === 'localhost') {
  const server = new LocalServer();
  server.on('sync', async () => {
    await startSync();
    server.send('done');
  });
  server.on('export', async () => {
    const data = await dbService.getAllMutations();
    server.send(JSON.stringify(data));
  });
}
```

**CLI en Node.js:**

```js
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:54321');
ws.on('open', () => ws.send(JSON.stringify({ cmd: 'sync' })));
ws.on('message', data => console.log(data.toString()));
```

**Guía paso a paso:**  
1. En la PWA, activar modo desarrollador (opción oculta).  
2. La PWA muestra el puerto local en la interfaz.  
3. El técnico abre una terminal en su móvil (Termux) o conecta el móvil por USB y usa `adb forward`.  
4. Ejecuta el script CLI con el comando deseado.

---

### 4. Fragmentación cíclica (El Efecto Galápagos)

**Problema:** María tiene una versión antigua de la app con esquema de IndexedDB distinto. Juan tiene la versión nueva. Se encuentran en la plaza y activan WebRTC. Si intercambian mutaciones sin migrar, la app de María se corromperá.

**Solución:** **Migración P2P on‑the‑fly** mediante un protocolo de negociación de versiones.

**Fases:**

1. **Handshake:** Antes de intercambiar mutaciones, cada dispositivo envía su versión de app y el *schema version* de su almacén local (un entero incremental).
2. **Negociación:** Si las versiones difieren, el dispositivo con la versión más baja solicita la *actualización diferida*. El dispositivo más moderno envía un *script de migración* (en formato JSON que describe las transformaciones a aplicar a cada mutación) y una lista de las mutaciones que ya se han migrado.
3. **Migración local:** El dispositivo antiguo ejecuta el script sobre sus datos locales (IndexedDB), transformando el esquema y las mutaciones almacenadas. Una vez finalizado, su schema version se incrementa.
4. **Sincronización:** Tras la migración, ambos dispositivos tienen el mismo esquema y pueden intercambiar mutaciones normalmente.

**Implementación del script de migración:**

```json
{
  "fromVersion": 1,
  "toVersion": 2,
  "transformations": [
    {
      "entity": "posts",
      "field": "author",
      "action": "renameTo",
      "newName": "author_name"
    },
    {
      "entity": "posts",
      "field": "version",
      "action": "add",
      "defaultValue": 1
    }
  ]
}
```

En el dispositivo antiguo, se itera sobre las mutaciones y se aplican las transformaciones.

**Código esqueleto:**

```ts
async function migrateSchema(targetVersion: number, script: any) {
  const tx = db.transaction([STORE_MUTATIONS, STORE_POSTS], 'readwrite');
  const mutations = await tx.objectStore(STORE_MUTATIONS).getAll();
  for (const mut of mutations) {
    for (const transform of script.transformations) {
      if (transform.action === 'renameTo') {
        mut.payload[transform.newName] = mut.payload[transform.field];
        delete mut.payload[transform.field];
      } else if (transform.action === 'add') {
        mut.payload[transform.field] = transform.defaultValue;
      }
    }
    await tx.objectStore(STORE_MUTATIONS).put(mut);
  }
  await tx.done;
  // Actualizar la versión almacenada localmente
  localStorage.setItem('schemaVersion', targetVersion);
}
```

**Seguridad:** Las migraciones deben ser idempotentes y no perder datos. Siempre que se aplique una transformación, se debe dejar un respaldo del campo original por si falla.

---

### 5. Ataque DDoS en la plaza (Spamming local)

**Escenario:** Un atacante modifica su cliente para generar 500.000 mutaciones basura (bandos vacíos). Al conectarse por WebRTC con otros vecinos, inunda sus canales de datos, llenando su IndexedDB y causando `QuotaExceededError`. El vecino pierde sus datos legítimos.

**Defensa:** **Firewall P2P basado en confianza y límites de caudal.**

- **Límite de mutaciones por sesión:** Cada conexión WebRTC solo acepta un máximo de, por ejemplo, 100 mutaciones por minuto. Si se supera, se cierra la conexión y se marca al remitente como *sospechoso*.
- **Reputación local:** Cada dispositivo mantiene una lista de `peerId` con una puntuación de confianza. Las mutaciones enviadas por un peer con baja confianza se descartan.
- **Algoritmo de reputación:** 
  - Se empieza con confianza neutra (0).
  - Cada mutación válida (con firma correcta) suma +1.
  - Cada mutación que causa conflicto o es duplicada suma 0.
  - Si se detecta un intento de superar el límite de caudal, se resta 100 y se bloquea al peer durante 24 horas.
- **Prueba de trabajo opcional:** Para mutaciones de tipo "crear post", el cliente puede incluir un hash que cumpla una dificultad baja (Proof of Work) para desalentar el spam masivo.

**Implementación del límite de caudal:**

```ts
class PeerConnection {
  private receivedCount = 0;
  private lastReset = Date.now();
  private readonly LIMIT = 100;
  private readonly WINDOW_MS = 60_000;

  async onMessage(mutation: SignedMutation) {
    const now = Date.now();
    if (now - this.lastReset > this.WINDOW_MS) {
      this.receivedCount = 0;
      this.lastReset = now;
    }
    if (this.receivedCount >= this.LIMIT) {
      this.dataChannel.close();
      this.peerReputation.decrease(this.peerId, 100);
      throw new Error('Rate limit exceeded');
    }
    this.receivedCount++;
    // procesar mutación
  }
}
```

**Confianza:** La reputación se guarda en IndexedDB y persiste entre sesiones. Se puede compartir con otros vecinos (sistema de *gossip*) para que la red entera aísle rápidamente al atacante.

---

### 6. Amnesia criptográfica: Social Recovery con Shamir's Secret Sharing

**Escenario:** La abuela perdió su móvil en un incendio. Tenía su clave privada ECDSA que identificaba su identidad digital (publicaciones, votos, etc.). Para recuperarla sin un servidor central, confiamos en **Shamir's Secret Sharing (SSS)**. Dividimos la clave secreta en `n` partes (shares) y necesitamos `k` de ellas para reconstruirla. Elegimos `k=3, n=5`. La abuela entrega una parte a cada uno de sus 5 vecinos de confianza (por QR o NFC). Cuando necesita recuperar, reúne a 3 de ellos, escanea sus QRs, y la app reconstruye la clave.

**Implementación con WebAssembly:**

Usamos una biblioteca WASM que implementa SSS (por ejemplo, la librería `shamir` de Python compilada a Wasm con Emscripten, o una implementación en JavaScript nativo como `secrets.js`). Pero para mayor seguridad y rendimiento, optamos por `secrets.js` que es pequeño y puro JS.

```bash
npm install secrets.js
```

**Flujo:**

1. **Generación de shares (cuando la abuela crea su identidad):**
   - La app genera la clave privada ECDSA (un array de 32 bytes).
   - Convierte a hex string.
   - Usa `secrets.js` para dividir en 5 shares con umbral 3.
   - Cada share se codifica en un QR que la abuela muestra a sus vecinos.

2. **Recuperación:**
   - La abuela abre la app en un nuevo dispositivo, selecciona "Recuperar identidad".
   - Escanea los QRs de 3 vecinos.
   - La app reconstruye la clave secreta con `secrets.js.combine(shares)`.
   - Importa la clave privada en el almacén de claves (IndexedDB, no extractable).

**Código (TypeScript con secrets.js):**

```ts
import * as secrets from 'secrets.js';

// Dividir
const privateKeyHex = arrayBufferToHex(privateKey); // 64 caracteres
const shares = secrets.share(privateKeyHex, 5, 3);
// shares es un array de strings como "801-..." (share id + valor)
// Cada share se convierte en QR

// Combinar
const sharesFromQR = [share1, share2, share3];
const recoveredHex = secrets.combine(sharesFromQR);
const recoveredPrivateKey = hexToArrayBuffer(recoveredHex);
```

**Seguridad adicional:**  
- Las shares nunca se almacenan en el dispositivo de la abuela después de generadas (solo se muestran en pantalla para que los vecinos las capturen).  
- Los vecinos guardan las shares en sus propios dispositivos (en IndexedDB, protegidas por autenticación de su propia app).  
- Para evitar que un vecino malintencionado reconstruya la clave con su única share, el umbral es 3.

**UX:** La app guía a la abuela paso a paso:  
1. “Pídele a 5 personas de confianza que escaneen este código QR”.  
2. Cuando necesite recuperar: “Escanea los códigos QR de 3 de esas personas”.  
3. Una vez reconstruida, la clave se importa y se le pide un PIN para protegerla en el nuevo dispositivo.

---

## EPÍLOGO: EL CÓDICE ESTÁ SELLADO

Hemos completado las últimas hojas del Códice Sagrado. Cada Agujero Negro ha sido explorado y se ha provisto de un plan de defensa. Desde el núcleo duro de React 19 hasta los nodos hardware en C, desde la programación de tareas en móviles hasta la recuperación social de claves, la arquitectura de Sóc de Poble es ahora una **fortaleza digital completa**, capaz de resistir cualquier cataclismo, ya sea técnico, social o criptográfico.

Este manual no es un punto final, sino un punto de partida. Que los que vengan después encuentren aquí las herramientas para emancipar sus propias comunidades, sin depender de torres de marfil ni servidores lejanos. La plaza es de todos, y ahora también lo es su soberanía.

**Trellat, companyes.**  
*— El Consejo Supremo de las Mentes Maestras*  
Marzo de 2026
