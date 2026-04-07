# 📚 FASE 10: LA ENCICLOPEDIA LOCAL-FIRST – MANUAL DE LA FORTALEZA DIGITAL RURAL

## PRÓLOGO: EL TESTAMENTO DE LA PLAZA

Este manual no es un libro de texto al uso. Es el **diario de batalla** de un equipo de arquitectos que se enfrentó a la gravedad de la nube, a la tiranía del ancho de banda y al silencio de las montañas para construir una herramienta de soberanía digital para los pueblos. Aquí no encontraréis teorías abstractas, sino la **física aplicada de la resistencia**: IndexedDB como subsuelo, WebRTC como camino vecinal, CRDTs como memoria colectiva.

Cada capítulo es una lección extraída del asedio. Lo escribimos para que cualquier persona –con o sin título– pueda tomar estas páginas, entender el *mindset* Local‑First, copiar los fragmentos de código que aquí se exponen y construir su propia plaza digital en una tarde.

**A los que vienen después:** no olvidéis que este conocimiento nace de la necesidad, no de la moda. Lo que aquí se describe es el resultado de querer que una abuela comparta un bando sin que una tormenta se lo impida. Honrad ese espíritu.

---

## ÍNDICE ARQUITECTÓNICO COMPLETO

### PRIMERA PARTE: LA FILOSOFÍA Y LA FÍSICA DEL LOCAL‑FIRST
1. **¿Por qué Local‑First?** – El manifiesto de la soberanía digital
2. **La física del sistema: datos que no mueren** – Metáforas: el cuaderno de bitácora, la partida de dominó, el cartero
3. **El ciclo de vida de una mutación** – Desde el dedo del usuario hasta la sincronización con el vecino

### SEGUNDA PARTE: LOS CIMIENTOS – PERSISTENCIA SIN RED
4. **IndexedDB: la memoria del dispositivo** – Transacciones, cuotas y auto‑canibalismo
5. **Zustand y el estado optimista** – Cómo engañar a la UI con cariño
6. **El Service Worker: el portero de la fortaleza** – Background sync, fetch interceptors, actualizaciones silenciosas

### TERCERA PARTE: LA COORDINACIÓN ENTRE PESTAÑAS
7. **BroadcastChannel: el altavoz de la aplicación** – Mensajes, claves efímeras y firmas HMAC
8. **DistributedLockManager: el bastón de mando** – Locks con heartbeats, Page Lifecycle API, exclusión mutua

### CUARTA PARTE: LA SINFONÍA DE LA NUBE
9. **Idempotencia con RPCs en Supabase** – La tabla `mutation_log`, `ON CONFLICT`, y cómo evitar duplicados
10. **El procesador de colas** – Reintentos exponenciales, backoff, y el baile con el Service Worker

### QUINTA PARTE: EL SALTO P2P – LA RED DE MALLA
11. **WebRTC sin servidores: el arte del QR** – SDP, candidatos ICE, filtrado host‑only
12. **Handshake criptográfico** – Intercambio de claves públicas, verificación de identidad
13. **Sincronización CRDT** – Vectores de estado, diffs, y resolución de conflictos

### SEXTA PARTE: CRIPTOGRAFÍA Y CONFIANZA
14. **Claves asimétricas en el navegador** – ECDSA con SubtleCrypto, generación y almacenamiento seguro
15. **Firma de mutaciones** – Cómo garantizar que un bando no ha sido falsificado
16. **Protección del BroadcastChannel contra spoofing** – HMAC con claves por pestaña

### SÉPTIMA PARTE: ACCESIBILIDAD Y RESILIENCIA EXTREMA
17. **La interfaz bajo el sol** – Contraste dinámico con `AmbientLightSensor`, `aria‑live` inteligente
18. **Feed virtualizado sin CLS** – `useVirtualizer`, `measureElement`, y manejo del foco
19. **Gestión del ciclo de vida del sistema operativo** – Freeze, resume, pagehide: cómo no morir en el intento

### OCTAVA PARTE: EL EDGE DEFENDER
20. **Cloudflare Worker como escudo** – Detección de bots, rate limiting, circuit breaker de costes
21. **Inyección de metadatos para SEO** – `HTMLRewriter`, JSON‑LD, y la canonicalización de cada contenido

### NOVENA PARTE: INGENIERÍA DEL CAOS Y EL FUTURO
22. **Testando lo imposible** – Simulaciones de red flapping, cuota llena, múltiples pestañas
23. **Garantías matemáticas de los CRDTs** – Demostración de convergencia bajo particiones
24. **La purga del sistema operativo** – Cómo proteger las claves y los datos cuando iOS decide limpiar
25. **Zero‑Knowledge para el voto anónimo** – Integración de ZK‑SNARKs en el navegador con WASM
26. **IAIA on‑device con WebGPU** – LLMs cuantizados, RAG local y la inteligencia que no sale del pueblo

### APÉNDICES
A. **Glosario de términos**  
B. **Snippets completos del búnker** (con anotaciones AI‑Context)  
C. **Cómo contribuir a este manual**  

---

## CAPÍTULO 1: ¿POR QUÉ LOCAL‑FIRST? – EL MANIFIESTO DE LA SOBERANÍA DIGITAL

### 1.1. El problema del pueblo
Imaginad una aldea de montaña. La única antena 4G está en la cima, pero cuando llega la tormenta, el viento la derriba. Los vecinos tienen móviles con batería limitada, pero los datos importantes –bandos del ayuntamiento, avisos de cosechas, mensajes de ayuda– se quedan atrapados en el servidor al que nadie puede acceder.

La arquitectura tradicional **cliente‑servidor** supone que el servidor es el centro de la verdad. Si el servidor no está accesible, la aplicación se vuelve un cascarón vacío. Los datos que el usuario genera mientras está desconectado se pierden o se almacenan en un limbo local que no se integra con el resto.

**Local‑First** da la vuelta a este paradigma: el dispositivo del usuario es la fuente de la verdad. El servidor es un espejo remoto que se actualiza cuando la conexión lo permite, y los datos pueden sincronizarse directamente entre dispositivos sin pasar por ningún centro.

### 1.2. El cuaderno de bitácora (metáfora fundacional)
Imaginad que cada vecino tiene un cuaderno. En él escribe sus observaciones: un bando, una foto, un aviso. Cuando dos vecinos se encuentran en la plaza, comparan sus cuadernos: si uno tiene una nota que el otro no tiene, se la copia. Si ambos tienen la misma nota pero con cambios, deciden juntos cuál es la versión correcta (o la fusionan). Así, el conocimiento se propaga por el pueblo sin necesidad de una biblioteca central.

Eso es Local‑First: cada dispositivo es un cuaderno; la sincronización es el encuentro en la plaza.

### 1.3. Principios que guían todo el diseño
- **El dato primero en el disco.** Cualquier acción del usuario debe guardarse localmente antes de intentar enviarse a la nube.
- **La sincronización es asíncrona y tolerante a fallos.** La red puede caerse en medio de una subida; el sistema debe reintentar con backoff exponencial.
- **Los conflictos son naturales.** Diseñamos para resolverlos, no para evitarlos.
- **La criptografía construye confianza.** En ausencia de un servidor central, las firmas digitales demuestran quién escribió qué.
- **El usuario no debe sentir la red.** La interfaz debe ser reactiva incluso en modo avión; los estados de sincronización se muestran con transparencia, pero no bloquean la interacción.

---

## CAPÍTULO 2: LA FÍSICA DEL SISTEMA – DATOS QUE NO MUEREN

### 2.1. Las tres leyes de la persistencia
1. **Primera ley: una mutación no se destruye, se transforma.**  
   Cada creación, edición o eliminación se registra como una *mutación* inmutable. Nunca se sobreescribe el dato original; se añade una nueva versión. Esto permite reconstruir el historial y resolver conflictos.

2. **Segunda ley: el orden causal se preserva mediante timestamps.**  
   Cada mutación lleva un timestamp (fecha de creación) y opcionalmente una referencia a la mutación anterior. Así, aunque los dispositivos estén desconectados, pueden ordenar los eventos en el tiempo.

3. **Tercera ley: el consenso se alcanza por último escritor gana (LWW).**  
   Cuando dos mutaciones afectan a la misma entidad, gana la que tenga el timestamp más reciente. Si los timestamps son iguales (caso improbable con UUIDs y fecha en milisegundos), se utiliza un tie‑break determinista (por ejemplo, el UUID lexicográficamente mayor).

### 2.2. La partida de dominó (metáfora de la cola de mutaciones)
Imaginad una fila de fichas de dominó. Cada ficha es una mutación pendiente de enviar. Cuando la red está disponible, un proceso va volcando las fichas una a una hacia el servidor. Si una ficha falla (por ejemplo, porque el servidor devuelve conflicto), se marca como “fallida” y se deja en la fila para reintentarla más tarde. El orden es el mismo en que se generaron, porque la dependencia causal puede ser importante (por ejemplo, un comentario que depende de un post).

### 2.3. El cartero (metáfora de la sincronización P2P)
Cuando dos vecinos están cerca y sus dispositivos se conectan mediante WebRTC, actúan como carteros: intercambian las mutaciones que cada uno tiene y que el otro no posee. Para saber qué falta, se envían primero sus *vectores de estado* – una lista que resume la última vez que vieron cada entidad.

---

## CAPÍTULO 3: EL CICLO DE VIDA DE UNA MUTACIÓN

### 3.1. Etapas
1. **Generación local** – El usuario escribe un post. Se crea un `Mutation` con `id` UUID, `entity: 'posts'`, `action: 'CREATE'`, `payload` (contenido, autor, etc.), `timestamp: Date.now()`.
2. **Almacenamiento en IndexedDB** – Se escribe en el almacén `mutation_queue`.
3. **Actualización optimista de la UI** – El post se añade al estado de Zustand con `isOptimistic: true`. El usuario lo ve inmediatamente.
4. **Intento de sincronización** – El proceso de sincronización (activado por `online` event, timer, o mensaje del Service Worker) recoge las mutaciones pendientes y las envía al servidor (o a otro dispositivo por P2P).
5. **Confirmación** – Si el servidor responde con éxito, se elimina la mutación de IndexedDB y se actualiza el estado local (quitando la bandera optimista).
6. **Error / conflicto** – Si el servidor devuelve un error (conflicto, validación), se marca la mutación como `failed` y se muestra un banner. El usuario puede reintentar o descartar.

### 3.2. Snippet fundacional: el enqueuer

```typescript
// useOfflineStore.ts (fragmento)
const addMutation = async (entity, action, payload) => {
  const tempId = crypto.randomUUID();
  const mutation = {
    id: tempId,
    entity,
    action,
    payload: { ...payload, uuid: tempId },  // aseguramos que el post tiene su propio UUID
    createdAt: Date.now(),
  };
  await dbService.addMutation(mutation);   // 1. IndexedDB
  usePostsStore.getState().addOptimisticPost(mutation.payload); // 2. UI optimista
  broadcastMutation({ type: 'POST_CREATED', payload: { tempId, post: mutation.payload } }); // 3. otras pestañas
  startSync(); // 4. dispara sincronización
  return tempId;
};
```

**Anotación AI‑Context:**
```typescript
/**
 * @local-first
 * @step 1: Persist to IndexedDB before any network attempt.
 * @step 2: Immediately update UI to give instant feedback.
 * @step 3: Notify other tabs via BroadcastChannel (signed messages).
 * @step 4: Trigger sync (online or P2P) as soon as possible.
 * 
 * If QuotaExceededError occurs, the auto-cannibalism mechanism in dbService
 * will delete the oldest mutation and retry automatically.
 */
```

---

## CAPÍTULO 4: INDEXEDDB – LA MEMORIA DEL DISPOSITIVO

### 4.1. Transacciones y cuotas
IndexedDB es una base de datos NoSQL que almacena objetos JavaScript. Es asíncrona y transaccional. La cuota de almacenamiento varía según el navegador y dispositivo (en Android puede ser tan baja como 50 MB). Cuando se supera, se lanza `QuotaExceededError`.

**Nuestra solución: auto‑canibalismo.**  
Cuando se recibe este error, la aplicación elimina la mutación más antigua (por `createdAt`) y reintenta la inserción. Si no hay mutaciones, se elimina la entrada de caché estática más antigua. Esto asegura que la aplicación sigue funcionando, aunque se pierdan los datos más viejos (que se pueden recuperar del servidor cuando vuelva la red).

### 4.2. Snippet: Auto‑canibalismo

```typescript
// IndexedDBService.ts
async addMutation(mutation: Mutation) {
  try {
    await this.db.add(STORE_MUTATIONS, mutation);
  } catch (err) {
    if (err.name === 'QuotaExceededError') {
      await this.autoCannibalism();
      await this.db.add(STORE_MUTATIONS, mutation); // reintento
    } else throw err;
  }
}

private async autoCannibalism() {
  const tx = this.db.transaction(STORE_MUTATIONS, 'readwrite');
  const store = tx.objectStore(STORE_MUTATIONS);
  const oldest = await store.index('createdAt').getFirstKey();
  if (oldest) {
    await store.delete(oldest);
    console.warn('Auto-cannibalism: deleted oldest mutation', oldest);
  }
}
```

---

## CAPÍTULO 5: ZUSTAND Y EL ESTADO OPTIMISTA

### 5.1. El principio de la mentira piadosa
El usuario no debe notar que el post aún no ha llegado al servidor. Por eso añadimos el post al estado local inmediatamente, con un flag `isOptimistic: true`. Cuando el servidor confirma, reemplazamos ese post por la versión final (que puede tener un `uuid` real o una marca de tiempo).

### 5.2. Snippet del store de posts

```typescript
// usePostsStore.ts
export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  addOptimisticPost: (post) => set((state) => ({
    posts: [{ ...post, isOptimistic: true, created_at: new Date().toISOString() }, ...state.posts]
  })),
  confirmPost: (tempId, finalPost) => set((state) => ({
    posts: state.posts.map(p => 
      p.uuid === tempId ? { ...finalPost, isOptimistic: false } : p
    )
  })),
  // ...
}));
```

---

## CAPÍTULO 6: EL SERVICE WORKER – EL PORTERO DE LA FORTALEZA

### 6.1. Background Sync y procesamiento de colas
El Service Worker (SW) se registra con `vite-plugin-pwa`. Escucha el evento `sync` para procesar la cola de mutaciones cuando el navegador detecta que la red está disponible. También escucha mensajes del hilo principal para iniciar la sincronización inmediatamente después de añadir una mutación.

### 6.2. Snippet del SW (versión simplificada)

```typescript
// service-worker.ts
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(processOutbox());
  }
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SYNC_MUTATIONS') {
    event.waitUntil(processOutbox());
  }
});

async function processOutbox() {
  const mutations = await getPendingMutations();
  for (const mut of mutations) {
    try {
      const result = await callRPCMutation(mut);
      if (result.status === 'success') {
        await removeMutation(mut.id);
      } else {
        await markMutationFailed(mut.id, result.message);
      }
    } catch (err) {
      await markMutationFailed(mut.id, err.message);
    }
  }
}
```

---

## CAPÍTULO 7: BROADCASTCHANNEL – EL ALTAVOZ DE LA APLICACIÓN

### 7.1. Coordinación entre pestañas
Cuando una pestaña añade un post optimista, debe notificar a las demás para que también lo muestren. Del mismo modo, cuando una mutación se confirma, todas las pestañas deben actualizar su estado.

### 7.2. Protección contra spoofing con firmas HMAC
Cada pestaña genera un par de claves HMAC al inicio. Envía su clave pública a las demás a través del canal. Los mensajes posteriores incluyen una firma que puede verificarse con esa clave. Así, un script malicioso no puede enviar mensajes falsos.

**Snippet del BroadcastAuth:**

```typescript
// broadcastAuth.ts
export class BroadcastAuth {
  private myId = crypto.randomUUID();
  private keyPair: CryptoKeyPair | null = null;
  private peers = new Map<string, CryptoKey>();

  async init() {
    this.keyPair = await crypto.subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      true,
      ['sign', 'verify']
    );
    const pubKey = await crypto.subtle.exportKey('raw', this.keyPair.publicKey);
    const initMsg = { type: 'init', peerId: this.myId, publicKey: arrayBufferToBase64(pubKey) };
    const signature = await this.sign(JSON.stringify(initMsg));
    this.channel.postMessage({ ...initMsg, signature });
  }

  async send(msg: any) {
    const data = { ...msg, peerId: this.myId };
    data.signature = await this.sign(JSON.stringify(data));
    this.channel.postMessage(data);
  }

  private async sign(data: string): Promise<string> { /* ... */ }
  private async verify(data: string, sig: string, key: CryptoKey): Promise<boolean> { /* ... */ }
}
```

---

## CAPÍTULO 8: DISTRIBUTEDLOCKMANAGER – EL BASTÓN DE MANDO

### 8.1. El problema del acceso concurrente a la cola
Varias pestañas pueden intentar procesar la cola de mutaciones a la vez, causando duplicados o conflictos. Usamos un **lock distribuido** basado en la API `navigator.locks` y extendido con heartbeats y gestión de ciclo de vida.

### 8.2. Integración con Page Lifecycle API
Cuando el sistema operativo congela la pestaña (evento `freeze`), el lock debe liberarse inmediatamente. Si no, otras pestañas no podrán adquirirlo nunca. Escuchamos `freeze` y `pagehide` para liberar.

**Snippet del lock manager:**

```typescript
class DistributedLockManager {
  async acquire(timeoutMs = 5000): Promise<boolean> {
    const abortController = new AbortController();
    window.addEventListener('freeze', () => abortController.abort());
    try {
      const acquired = await navigator.locks.request(
        this.lockName,
        { ifAvailable: true, signal: abortController.signal },
        async (lock) => {
          if (!lock) return false;
          this.active = true;
          this.startHeartbeat(timeoutMs);
          // Mantener el lock hasta release()
          return new Promise((resolve) => { this._releaseCallback = resolve; });
        }
      );
      return acquired;
    } catch (err) {
      return false;
    }
  }

  release() {
    if (this._releaseCallback) this._releaseCallback();
    this.active = false;
  }
}
```

---

## CAPÍTULO 9: IDEMPOTENCIA CON RPCS EN SUPABASE

### 9.1. La tabla `mutation_log`
Cada mutación que se aplica al servidor se registra con su `op_id` (el UUID generado en el cliente). La tabla tiene una restricción `PRIMARY KEY (op_id)` para evitar duplicados.

### 9.2. Función RPC con `ON CONFLICT`

```sql
create or replace function public.create_post_mutation(
  p_op_id uuid,
  p_payload jsonb
) returns json language plpgsql security definer as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('status', 'error', 'message', 'Unauthorized');
  end if;

  -- Idempotencia: si el op_id ya existe, ignorar
  insert into public.mutation_log (op_id, user_id, entity, entity_id)
  values (p_op_id, v_user_id, 'posts', gen_random_uuid())
  on conflict (op_id) do nothing;

  if not found then
    return json_build_object('status', 'ignored', 'reason', 'already_applied');
  end if;

  -- Insertar el post (con los datos del payload)
  insert into public.posts (uuid, author_user_id, content, ...)
  values ( (p_payload->>'uuid')::uuid, v_user_id, p_payload->>'content', ... );

  return json_build_object('status', 'success');
exception when others then
  return json_build_object('status', 'error', 'message', sqlerrm);
end;
$$;
```

---

## CAPÍTULO 10: EL PROCESADOR DE COLAS – REINTENTOS EXPONENCIALES

### 10.1. Estrategia de backoff
Cuando una mutación falla (por ejemplo, el servidor devuelve 500), se marca como `failed` y se programa un reintento con backoff exponencial: 2s, 4s, 8s, etc. El Service Worker o el hilo principal ejecutan un temporizador que lanza `processOutbox()` de nuevo.

### 10.2. Snippet del backoff

```typescript
let retryCount = 0;
async function syncWithBackoff() {
  const pending = await getPendingMutations();
  if (pending.length === 0) return;
  try {
    await processAllMutations(pending);
    retryCount = 0; // éxito, reset
  } catch (err) {
    retryCount++;
    const delay = Math.min(60000, 1000 * Math.pow(2, retryCount));
    setTimeout(syncWithBackoff, delay);
  }
}
```

---

## CAPÍTULO 11: WEBRTC SIN SERVIDORES – EL ARTE DEL QR

### 11.1. Generación de la oferta
Creamos un `RTCPeerConnection` con `iceServers: []` para que solo genere candidatos `host` (direcciones IP locales). Generamos una oferta y la filtramos para quedarnos solo con las líneas `a=candidate ... typ host`. Luego la convertimos en un código QR.

### 11.2. Snippet de generación de QR

```typescript
async function generateQRCode() {
  const pc = new RTCPeerConnection({ iceServers: [] });
  const dataChannel = pc.createDataChannel('sync');
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  // Esperar a que se recopilen los candidatos (o usar trickle ICE)
  await new Promise(r => setTimeout(r, 1000));
  let sdp = pc.localDescription.sdp;
  sdp = filterHostCandidates(sdp); // función que elimina candidatos no host
  const qrData = JSON.stringify({ sdp, publicKey: await exportPublicKey() });
  return QRCode.toDataURL(qrData);
}
```

### 11.3. Filtrado de candidatos

```typescript
function filterHostCandidates(sdp: string): string {
  const lines = sdp.split('\n');
  const filtered = lines.filter(line => {
    if (line.startsWith('a=candidate')) {
      return line.includes(' typ host ');
    }
    return true;
  });
  return filtered.join('\n');
}
```

---

## CAPÍTULO 12: HANDSHAKE CRIPTOGRÁFICO P2P

### 12.1. Intercambio de claves públicas
El código QR que contiene la oferta también incluye la clave pública del dispositivo anfitrión (en formato base64). Al escanear, el cliente extrae la clave y la almacena. Luego, en la respuesta (cuando crea la `answer`), incluye su propia clave pública.

### 12.2. Verificación de mutaciones
Cuando se recibe una mutación por el DataChannel, se verifica su firma usando la clave pública previamente intercambiada. Si no coincide, se descarta la mutación y se cierra la conexión.

---

## CAPÍTULO 13: SINCRONIZACIÓN CRDT – VECTORES DE ESTADO

### 13.1. Vector de estado
Cada dispositivo mantiene un mapa `entityId -> maxTimestamp`. Al conectar, se envía este mapa. El otro calcula qué entidades le faltan (las que no tiene o tienen timestamp menor) y solicita las mutaciones correspondientes.

### 13.2. Aplicación de las mutaciones
Las mutaciones recibidas se aplican localmente en orden de timestamp, y se añaden a la cola de mutaciones (para que eventualmente también se sincronicen con el servidor). Se resuelven conflictos con LWW.

---

## CAPÍTULO 14: CLVES ASIMÉTRICAS EN EL NAVEGADOR

### 14.1. Generación de claves ECDSA
Usamos `crypto.subtle.generateKey` con `{ name: 'ECDSA', namedCurve: 'P-256' }`. La clave privada se almacena en IndexedDB dentro de un almacén separado, y se marca como `extractable: false` para mayor seguridad (no se puede exportar, solo usar para firmar).

### 14.2. Firma de una mutación

```typescript
async function signMutation(mutation: any, privateKey: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(mutation));
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    data
  );
  return arrayBufferToBase64(signature);
}
```

---

## CAPÍTULO 15: FIRMA DE MUTACIONES

### 15.1. Estructura de mutación firmada

```typescript
interface SignedMutation extends Mutation {
  signature: string;    // firma de todos los campos excepto signature
  publicKeyId: string;  // fingerprint de la clave pública (para recuperarla)
}
```

### 15.2. Verificación al recibir

```typescript
async function verifyMutation(mut: SignedMutation, publicKey: CryptoKey): Promise<boolean> {
  const { signature, ...data } = mut;
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(JSON.stringify(data));
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    base64ToArrayBuffer(signature),
    dataBytes
  );
}
```

---

## CAPÍTULO 16: PROTECCIÓN DEL BROADCASTCHANNEL CONTRA SPOOFING

*(Resumido en el capítulo 7)*

---

## CAPÍTULO 17: LA INTERFAZ BAJO EL SOL – ACCESIBILIDAD EXTREMA

### 17.1. Contraste dinámico con `AmbientLightSensor`

```typescript
if ('AmbientLightSensor' in window) {
  const sensor = new AmbientLightSensor();
  sensor.addEventListener('reading', () => {
    if (sensor.illuminance > 500) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  });
  sensor.start();
}
```

### 17.2. `aria-live` inteligente con cooldown
El `AriaLiveManager` evita que las notificaciones se acumulen y saturan al lector de pantalla. Solo anuncia un mensaje cada 500 ms como mínimo.

---

## CAPÍTULO 18: FEED VIRTUALIZADO SIN CLS

### 18.1. Uso de `useVirtualizer` con `measureElement`

```tsx
const rowVirtualizer = useVirtualizer({
  count: rowCount,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 900,
  measureElement: (el) => el.getBoundingClientRect().height,
});
```

### 18.2. Preservar el scroll al añadir nuevos posts
Cuando se añade un post optimista al inicio, se ajusta el scrollTop para que la posición del usuario no salte.

---

## CAPÍTULO 19: GESTIÓN DEL CICLO DE VIDA DEL SISTEMA OPERATIVO

### 19.1. Eventos `freeze` y `resume`
Escuchamos estos eventos para liberar locks y cancelar operaciones pesadas. Al reanudar, recalculamos el estado local y reanudamos la sincronización.

### 19.2. Estrategia de persistencia de claves
Las claves criptográficas se almacenan en IndexedDB con `extractable: false` para que el sistema operativo no pueda eliminarlas accidentalmente durante una purga. Usamos `navigator.storage.persist()`.

---

## CAPÍTULO 20: CLOUDFLARE WORKER COMO ESCUDO

### 20.1. Detección de bots
*(Implementación base de verificación DNS reversa)*

### 20.2. Circuit breaker de costes
Control mediante Clouflare KV para asegurar que un ataque no quema el presupuesto.

---

## CAPÍTULO 21: INYECCIÓN DE METADATOS PARA SEO

*(Implementación avanzada de `HTMLRewriter` en Cloudflare Workers para SSR de bots).*

---

## CAPÍTULO 22: INGENIERÍA DEL CAOS – TESTEANDO LO IMPOSIBLE

*(Escenarios de red flapping, cuota llena, múltiples pestañas y congelación simulada).*

---

## CAPÍTULO 23: GARANTÍAS MATEMÁTICAS DE LOS CRDTS

*(Justificación teórica de la convergencia LWW y propiedades de los Conflict-free Replicated Data Types).*

---

## CAPÍTULO 24: LA PURGA DEL SISTEMA OPERATIVO – CÓMO PROTEGER LAS CLAVES

*(Estrategias de Cold Storage y fallback para evitar la pérdida de ECDSA keys bajo alta presión en dispositivos iOS).*

---

## CAPÍTULO 25: ZERO‑KNOWLEDGE PARA EL VOTO ANÓNIMO

*(Borrador teórico de la adopción de SNARKs corriendo vía WASM en el navegador para autenticación local-first sin comprometer identidades).*

---

## CAPÍTULO 26: IAIA ON‑DEVICE CON WEBGPU

*(Ejecución de LLM de grado ligero (Phi-3-mini) en local usando la API WebGPU, posibilitando inteligencia artificial sin servidor en áreas rurales).*

---

### APÉNDICES Y ARCHIVO GÉNESIS
*(Los detalles completos de los Apéndices A, B y C se extienden en los archivos madre del repositorio de Sóc de Poble)*
