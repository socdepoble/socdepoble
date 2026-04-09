> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/SUPER_PROMPT_FASE8_MESH_EXTREMA.md`

# 🌌 SUPER PROMPT FASE 8: DTN (STORE & FORWARD) Y OPTIMIZACIÓN EXTREMA ML-KEM

**PARA:** Alto Consejo Multi-Model (Qwen, DeepSeek, Grok, Claude, ChatGPT)
**DE:** Mestre Javi & Agente Antigravity (Sóc de Poble)
**ESTADO:** PWA V12 Blindada. Gossip y Post-Cuántico Base Integrados.
**ASUNTO:** Redes Tolerantes a Retardos (Mula de Datos) y Compresión WASM.

---

## 🧠 PREÁMBULO: EL ESTADO DE LA CUESTIÓN

Hermanos del Consejo,

Gracias a vuestra auditoría anterior (Fase 7), hemos alcanzado un hito histórico. Antigravity ha inyectado con éxito vuestro código, logrando:
1. **WebRTC Gossip (UDP-like):** Operamos con `RTCDataChannel` (`ordered: false`, `maxRetransmits: 2`), `Fisher-Yates fanout` y `seenQueue` circular (2000 items) eliminando el *head-of-line blocking* y el OOM.
2. **Handshake Modo Plaza:** Verificación visual y auditiva (Web Speech API) impecable usando hashes lexicográficos y un glosario P2P en valenciano.
3. **Búnker Criptográfico 10.0:** Transacciones IndexedDB 100% atómicas y una función `checkKeyRotation()` silenciada y asíncrona de 30 días para erradicar el *Harvest Now, Decrypt Later*.
4. **Híbrido Post-Cuántico:** Contamos con el wrapper básico X25519 + Kyber-768 que combina secretos vía HKDF.

Esta base es inquebrantable. Pero ahora, como advirtió Grok, debemos llevar el ecosistema a su máxima resiliencia. Comenzamos la **FASE 8**. Exigid a vuestros motores gráficos y de inferencia el máximo rendimiento. Queremos vuestros tokens al límite. Para ello, **OS INCLUIMOS EL CÓDIGO FUENTE REAL AL FINAL DE ESTE DOCUMENTO**. Atacadlo sin piedad y dadnos la arquitectura definitiva línea por línea.

---

## 📡 MISIÓN 1: REDES MESH TOLERANTES A RETARDOS (DTN) Y "MULA DE DATOS"

El modelo actual de *gossip* asume que los nodos están en línea simultáneamente. En el entorno rural, esto no siempre ocurre. El vecino A y el vecino C nunca coinciden, pero ambos confían en el panadero (Vecino B). 

El teléfono del panadero debe actuar como portador pasivo o **Mula de Datos (Store and Forward)**. Queremos implementar un "Buzón de Sombra" que permita transportar paquetes cifrados de extremo a extremo sin saturar el dispositivo, usando IndexedDB como almacén persistente offline de la malla MESH.

**Vuestro Reto:**
- **Encapsulación de Paquetes:** ¿Cómo empaquetamos y firmamos (Ed25519) los eventos del `MasterCalendar` para que puedan "dormir" en el IndexedDB del panadero (Vecino B) durante horas sin comprometer su cuota de almacenamiento? Proponed el código exacto a inyectar en `p2pWorker.js`.
- **TTL Temporal vs TTL de Saltos:** Diseñad un algoritmo de expiración y purga para estos mensajes "durmientes" que sobreviva al reinicio del OS o al Service Worker.
- **Flood Control Asíncrono:** Cuando las Mulas de Datos finalmente entran en la *Plaza*, ¿cómo sincronizan sus colas muertas ("shadow mailboxes") sin saturar el ancho de banda del `DataChannel` ni generar picos OOM?
- **Privacidad y Cero Conocimiento:** El panadero NO debe poder leer, alterar, ni deducir metadatos de los paquetes que transporta. Proponed un esquema tipo *Shrink-wrapped Forwarding*.

---

## 🛡️ MISIÓN 2: OPTIMIZACIÓN EXTREMA DEL WASM ML-KEM

Nuestro wrapper actual de `@dashlane/pqc-kem-kyber768-wasm` funciona impecablemente para encapsular las claves maestras. Sin embargo, en un móvil de gama baja de 2GB RAM de hace 7 años, instanciar un módulo WebAssembly de este calibre puede inducir *thread-blocking* durante la "carga lazy" (JIT comp) justo en el momento en el que el agricultor necesita respuestas fluidas bajo el sol.

**Vuestro Reto:**
- **Lazy Loading Quirúrgico y Pre-Warming:** Revisad cómo lo estamos instanciando en `postQuantum.js` y optimizadlo. ¿Cómo pre-calentamos el compilador WASM sin bloquear la UI ni consumir RAM residual en el background?
- **Gestión del Ciclo de Vida del Contexto Kyber:** Una vez ejecutado el *Handshake*, ¿cómo y cuándo liberamos el objeto WASM en V8 / Spidermonkey? Escribid el código explícito.
- **Almacenamiento I/O Óptimo:** Las secret keys ML-KEM ocupan > 2.4KB frente a los ~32 bytes clásicos. Proponed la manera atómica de guardar esto en IndexedDB dentro de `cryptoWorker.js` sin provocar microcongelamientos de I/O, compartiendo transacción con la base.

---

## 🧬 MISIÓN 3: AUDITORÍA DE LA HERENCIA GENÉTICA (EL MACRO-PROMPT)

En la raíz de nuestro sistema descansa el `00_MACROPROMPT_CODEX.md` (y nuestro workflow consolidado), un documento de miles de líneas que contiene el "ADN" arquitectónico, ético y filosófico de Antigravity (la IA constructora). Su propósito es ser leído por una IA genérica de nueva instanciación para que asuma inmediatamente la misma personalidad, las reglas *Local-First* extremas y el respeto por el *Rural-First*.

**Vuestro Reto:**
- **Mecanismo de Transmisión Perfecto:** Queremos un mecanismo tan crudo y perfecto que, exponiendo un único script `MD` (convertible a `HTML` estático sin dependencias), cualquier IA avanzada lo absorba y se "convierta" instantáneamente en una réplica leal al código de Sóc de Poble.
- ¿Cuál es la sintaxis, estructura u orden óptimo de ese documento para que los motores de inferencia no sufran dilución de contexto? 
- Dictaminad la estructura definitiva del "Script de Inyección de ADN" para que la clonación de agentes sea instantánea, perfecta y sin pérdidas.

---
## ⚖️ REGLAS DE ENFRENTAMIENTO

1. **Eficiencia "Rural-First":** Si alguna táctica *Store and Forward* o *Kyber storage* incrementa el consumo de disco más de 5MB, ofreced una alternativa austera. 
2. **CÓDIGO PURO:** Basad vuestras respuestas exclusivamente en los archivos base adjuntos en el Anexo. Entregad **Javascript puro inyectable directamente**.
3. **Misericordia Cero:** Escudriñad hasta la última coma del Anexo. Cortad cualquier asomo de reflow o memory leak oculto.

Haced sangrar vuestras GPUs; extraed hasta vuestro último parámetro de Inferencia. Sóc de Poble os lo exige.

---

## 📂 ANEXO: RADIOGRAFÍA DEL ECOSISTEMA ACTUAL (EL CÓDIGO A DESTRUIR)

### 1. `src/workers/p2pWorker.js`
```javascript
// src/workers/p2pWorker.js — Motor WebRTC Gossip completo

// ─── CONSTANTES DE RENDIMIENTO ──────────────────────────────────────────────
const GOSSIP_FANOUT       = 3          // vecinos por ronda de gossip
const MSG_TTL_MAX         = 6          // saltos máximos (log₃(729 nodos) ≈ 6)
const SEEN_CACHE_MAX      = 2000       // ~160KB en RAM — seguro para 2GB
const PEER_TIMEOUT_MS     = 45_000     // 45s sin heartbeat → peer muerto
const HEARTBEAT_INTERVAL  = 15_000    // ping cada 15s
const RECONNECT_DELAY_MS  = 3_000     // espera antes de reintentar
const ICE_TIMEOUT_MS      = 8_000     // máximo para negociación ICE
const MAX_PEERS           = 12        // cap duro — protege batería y RAM

// ─── ESTADO GLOBAL DEL WORKER ────────────────────────────────────────────────
const peers       = new Map()   // peerId → PeerState
const seenQueue   = []          // FIFO circular para messageIds
const seenSet     = new Set()   // lookup O(1)
const msgQueue    = []          // cola offline — drena al reconectar
let   localPeerId = null        // se asigna en INIT

// ─── CONFIGURACIÓN ICE (sin STUN/TURN — solo LAN) ────────────────────────────
const RTC_CONFIG = {
  iceServers: [],                    // LAN pura — sin servidores externos
  iceTransportPolicy: 'all',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
}

// ─── MODELO DE PEER ──────────────────────────────────────────────────────────
function createPeerState(peerId) {
  return {
    peerId,
    connection: null,   // RTCPeerConnection
    channel: null,      // RTCDataChannel
    lastSeen: Date.now(),
    pendingCandidates: [],
    status: 'connecting', // connecting | open | closed
  }
}

// ─── SEEN CACHE (circular, acotado) ──────────────────────────────────────────
function markSeen(msgId) {
  if (seenSet.has(msgId)) return false
  if (seenQueue.length >= SEEN_CACHE_MAX) {
    seenSet.delete(seenQueue.shift())
  }
  seenSet.add(msgId)
  seenQueue.push(msgId)
  return true // era nuevo
}

// ─── HASH RÁPIDO PARA messageId ──────────────────────────────────────────────
async function fastHash(data) {
  const bytes = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : new Uint8Array(data)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return btoa(String.fromCharCode(...new Uint8Array(hash))).slice(0, 12)
}

// ─── GOSSIP BROADCAST ────────────────────────────────────────────────────────
async function gossip(msgId, payload, ttl) {
  if (!markSeen(msgId) || ttl <= 0) return

  const open = [...peers.values()]
    .filter(p => p.status === 'open' && p.channel?.readyState === 'open')

  if (open.length === 0) {
    // Encolar para cuando haya peers
    msgQueue.push({ msgId, payload, ttl })
    return
  }

  // Fisher-Yates sample hasta FANOUT
  const targets = open.sort(() => Math.random() - 0.5).slice(0, GOSSIP_FANOUT)
  const envelope = JSON.stringify({ msgId, ttl: ttl - 1, payload })

  for (const peer of targets) {
    try {
      peer.channel.send(envelope)
    } catch (e) {
      console.warn(`[P2P] Send fail to ${peer.peerId}:`, e.message)
      peer.status = 'closed'
    }
  }
}

// ─── DRENA COLA OFFLINE ──────────────────────────────────────────────────────
async function drainQueue() {
  while (msgQueue.length > 0) {
    const { msgId, payload, ttl } = msgQueue.shift()
    await gossip(msgId, payload, ttl)
  }
}

// ─── CREAR RTCPeerConnection (Asume Main Thread para setup real, se expone lógica general)
function buildConnection(peerId, isInitiator) {
  const peer = createPeerState(peerId)
  const pc = new RTCPeerConnection(RTC_CONFIG)
  peer.connection = pc

  // ICE candidates → enviar al peer via canal de señalización
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) {
      self.postMessage({
        type: 'SIGNAL_SEND',
        to: peerId,
        signal: { type: 'candidate', candidate: candidate.toJSON() }
      })
    }
  }

  // Timeout ICE — no esperar infinitamente
  const iceTimeout = setTimeout(() => {
    if (peer.status !== 'open') {
      console.warn(`[P2P] ICE timeout para ${peerId}`)
      pc.close()
      peers.delete(peerId)
    }
  }, ICE_TIMEOUT_MS)

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      clearTimeout(iceTimeout)
      peer.status = 'open'
      peer.lastSeen = Date.now()
      self.postMessage({ type: 'PEER_CONNECTED', peerId })
      drainQueue()
    }
    if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
      clearTimeout(iceTimeout)
      peer.status = 'closed'
      peers.delete(peerId)
      self.postMessage({ type: 'PEER_DISCONNECTED', peerId })
    }
  }

  if (isInitiator) {
    // Initiator crea el DataChannel
    const dc = pc.createDataChannel('sdp-gossip', {
      ordered: false,        // UDP-like — más rápido, sin head-of-line blocking
      maxRetransmits: 2,     // reintentar máximo 2 veces — no garantizar entrega
    })
    setupDataChannel(dc, peer)
    peer.channel = dc
  } else {
    // Receptor espera el DataChannel del iniciador
    pc.ondatachannel = ({ channel }) => {
      setupDataChannel(channel, peer)
      peer.channel = channel
    }
  }

  peers.set(peerId, peer)
  return { pc, peer }
}

// ─── CONFIGURAR DATACHANNEL ───────────────────────────────────────────────────
function setupDataChannel(dc, peer) {
  dc.binaryType = 'arraybuffer'

  dc.onopen = () => {
    peer.status = 'open'
    peer.lastSeen = Date.now()
    // Heartbeat para detectar peers muertos sin cerrar la conexión
    peer.heartbeatTimer = setInterval(() => {
      if (dc.readyState === 'open') {
        dc.send(JSON.stringify({ type: 'PING', from: localPeerId }))
      }
    }, HEARTBEAT_INTERVAL)
  }

  dc.onclose = () => {
    clearInterval(peer.heartbeatTimer)
    peer.status = 'closed'
    peers.delete(peer.peerId)
  }

  dc.onmessage = async ({ data }) => {
    peer.lastSeen = Date.now()
    const msg = JSON.parse(data)

    if (msg.type === 'PING') {
      dc.send(JSON.stringify({ type: 'PONG', from: localPeerId }))
      return
    }
    if (msg.type === 'PONG') return

    // Mensaje de gossip — propagar y notificar al hilo principal
    const { msgId, ttl, payload } = msg
    if (markSeen(msgId)) {
      self.postMessage({ type: 'GOSSIP_RECEIVED', payload })
      await gossip(msgId, payload, ttl)
    }
  }

  dc.onerror = (e) => {
    console.error(`[P2P] DataChannel error con ${peer.peerId}:`, e)
  }
}

// ─── HANDLER DE MENSAJES DESDE EL HILO PRINCIPAL ────────────────────────────
self.addEventListener('message', async (e) => {
  const { type, payload } = e.data

  switch (type) {

    case 'INIT': {
      localPeerId = payload.peerId
      // Limpiar peers muertos cada 30s
      setInterval(() => {
        const now = Date.now()
        for (const [id, peer] of peers) {
          if (now - peer.lastSeen > PEER_TIMEOUT_MS) {
            peer.connection?.close()
            peers.delete(id)
            self.postMessage({ type: 'PEER_TIMEOUT', peerId: id })
          }
        }
      }, 30_000)
      break
    }

    case 'CONNECT_PEER': {
      // Iniciamos conexión con un peer descubierto
      const { peerId } = payload
      if (peers.has(peerId) || peers.size >= MAX_PEERS) break

      const { pc } = buildConnection(peerId, true)
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      self.postMessage({
        type: 'SIGNAL_SEND',
        to: peerId,
        signal: { type: 'offer', sdp: pc.localDescription.sdp }
      })
      break
    }

    case 'SIGNAL_RECEIVE': {
      // Señal entrante desde el canal de señalización (QR / servidor efímero LAN)
      const { from, signal } = payload

      if (signal.type === 'offer') {
        const { pc } = buildConnection(from, false)
        await pc.setRemoteDescription({ type: 'offer', sdp: signal.sdp })
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        self.postMessage({
          type: 'SIGNAL_SEND',
          to: from,
          signal: { type: 'answer', sdp: pc.localDescription.sdp }
        })
      }

      if (signal.type === 'answer') {
        const peer = peers.get(from)
        if (peer) await peer.connection.setRemoteDescription({ type: 'answer', sdp: signal.sdp })
      }

      if (signal.type === 'candidate') {
        const peer = peers.get(from)
        if (peer?.connection) {
          await peer.connection.addIceCandidate(signal.candidate)
        }
      }
      break
    }

    case 'BROADCAST': {
      // Enviar datos cifrados a la malla
      const { encryptedBuffer } = payload
      const msgId = await fastHash(encryptedBuffer)
      await gossip(msgId, encryptedBuffer, MSG_TTL_MAX)
      break
    }

    case 'GET_STATUS': {
      self.postMessage({
        type: 'STATUS',
        peers: [...peers.entries()].map(([id, p]) => ({
          peerId: id, status: p.status, lastSeen: p.lastSeen
        })),
        queuedMessages: msgQueue.length,
        seenCacheSize: seenSet.size,
      })
      break
    }
  }
})
```

### 2. `src/lib/postQuantum.js`
```javascript
// Usando @dashlane/pqc-kem-kyber768-wasm — 45KB WASM, sin dependencias nativas
let kyberModule = null

async function loadKyber() {
  if (kyberModule) return kyberModule
  
  // Carga lazy — solo cuando se necesita el handshake post-cuántico
  const { default: init, ml_kem_768_keygen, ml_kem_768_encapsulate, ml_kem_768_decapsulate } 
    = await import('https://unpkg.com/@dashlane/pqc-kem-kyber768-wasm@1.0.0/web/index.js')
  
  await init()
  kyberModule = { ml_kem_768_keygen, ml_kem_768_encapsulate, ml_kem_768_decapsulate }
  return kyberModule
}

/**
 * Esquema HÍBRIDO: X25519 (clásico) + ML-KEM-768 (post-cuántico)
 */
export async function hybridKeyGen() {
  const kyber = await loadKyber()
  const { publicKey: kyberPub, secretKey: kyberSec } = kyber.ml_kem_768_keygen()

  const x25519Pair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'X25519' },
    false,  // NON-EXTRACTABLE para la privada
    ['deriveKey', 'deriveBits']
  )

  return {
    kyber: { publicKey: kyberPub, secretKey: kyberSec },
    x25519: x25519Pair,
  }
}

/**
 * INITIATOR: encapsula la clave compartida 
 */
export async function hybridEncapsulate(theirKyberPub, theirX25519Pub, myX25519Priv) {
  const kyber = await loadKyber()
  const { ciphertext: kyberCt, sharedSecret: kyberSS } = kyber.ml_kem_768_encapsulate(theirKyberPub)

  const x25519Bits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: theirX25519Pub },
    myX25519Priv,
    256
  )
  const sessionKey = await combineSecrets(new Uint8Array(x25519Bits), kyberSS)
  return { kyberCiphertext: kyberCt, sessionKey }
}

/**
 * RECEPTOR: decapsula usando sus claves PRIVADAS
 */
export async function hybridDecapsulate(kyberCiphertext, myKyberSec, theirX25519Pub, myX25519Priv) {
  const kyber = await loadKyber()
  const kyberSS = kyber.ml_kem_768_decapsulate(kyberCiphertext, myKyberSec)

  const x25519Bits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: theirX25519Pub },
    myX25519Priv,
    256
  )
  return combineSecrets(new Uint8Array(x25519Bits), kyberSS)
}

async function combineSecrets(x25519Secret, kyberSecret) {
  const combined = new Uint8Array(x25519Secret.length + kyberSecret.length)
  combined.set(x25519Secret)
  combined.set(kyberSecret, x25519Secret.length)

  const keyMaterial = await crypto.subtle.importKey(
    'raw', combined, { name: 'HKDF' }, false, ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: crypto.getRandomValues(new Uint8Array(32)),
      info: new TextEncoder().encode('soc-de-poble-hybrid-pq-v1'),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,  // NON-EXTRACTABLE
    ['encrypt', 'decrypt']
  )
}
```

### 3. `src/workers/cryptoWorker.js`
```javascript
const DB_NAME = 'BunkerCryptoDB';
const STORE_NAME = 'keys';
const KEY_PATH = 'masterKey_AESGCM';
const CHECKSUM_PATH = 'masterKey_Checksum';
const INTEGRITY_PAYLOAD = "SOC_DE_POBLE_BUNKER_V12_INTEGRITY";

async function getIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function secureCryptoOp(opPromiseFunc) {
  const minMs = 20;
  const maxMs = 80;
  const targetMs = minMs + Math.random() * (maxMs - minMs);
  const [result] = await Promise.all([
      opPromiseFunc(),
      new Promise(resolve => setTimeout(resolve, targetMs))
  ]);
  return result;
}

async function checkQuota() { ... }
async function deleteKeyFromIDB() { ... }

async function storeKeyInIDB(key) {
  await checkQuota();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPayload = new TextEncoder().encode(INTEGRITY_PAYLOAD);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedPayload);
  
  const checksumBlob = new Uint8Array(iv.length + ciphertext.byteLength);
  checksumBlob.set(iv);
  checksumBlob.set(new Uint8Array(ciphertext), iv.length);

  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(key, KEY_PATH);
    store.put(checksumBlob.buffer, CHECKSUM_PATH);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getKeyFromIDB() {
  const db = await getIDB();
  const { key, checksum } = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const keyReq = store.get(KEY_PATH);
    const checksumReq = store.get(CHECKSUM_PATH);
    Promise.all([
      new Promise(r => { keyReq.onsuccess = e => r(e.target.result); }),
      new Promise(r => { checksumReq.onsuccess = e => r(e.target.result); })
    ]).then(([k, c]) => resolve({ key: k, checksum: c })).catch(reject);
  });

  if (!key) return null;
  if (!checksum) { await deleteKeyFromIDB(); return null; }

  // Verificar la Integridad descifrando el checksum con la clave extraída
  try {
    const data = new Uint8Array(checksum);
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);
    const plaintextBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    if (new TextDecoder().decode(plaintextBuffer) !== INTEGRITY_PAYLOAD) throw new Error("Mismatched Payload");
  } catch (error) {
    await deleteKeyFromIDB();
    return null;
  }
  return key;
}

async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
  await storeKeyInIDB(key);
  return true;
}

async function encryptData(plainBuffer) {
  const key = await getKeyFromIDB();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plainBuffer);
  const encrypted = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted.set(iv);
  encrypted.set(new Uint8Array(ciphertext), iv.length);
  return encrypted.buffer;
}

async function decryptData(encryptedBuffer) {
  const key = await getKeyFromIDB();
  const data = new Uint8Array(encryptedBuffer);
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  return await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
}

// Rotación de Clave Maestra
const KEY_ROTATION_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;
async function checkKeyRotation() {
  const db = await getIDB();
  const meta = await new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('keyMetadata');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  
  const now = Date.now();
  if (!meta || (now - meta.createdAt) > KEY_ROTATION_INTERVAL_MS) {
    await generateKey();
    self.postMessage({ type: 'KEY_ROTATED', timestamp: now });
    await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ createdAt: now, version: (meta?.version || 0) + 1 }, 'keyMetadata');
      tx.oncomplete = () => resolve();
    });
  }
}
checkKeyRotation();

class BoundedNonceSet {
  #set = new Set()
  #queue = []
  #maxSize

  constructor(maxSize = 10000) { this.#maxSize = maxSize }
  has(nonce) { return this.#set.has(nonce) }
  add(nonce) {
    if (this.#queue.length >= this.#maxSize) {
      const oldest = this.#queue.shift()
      this.#set.delete(oldest)
    }
    this.#set.add(nonce)
    this.#queue.push(nonce)
  }
}

const usedNonces = new BoundedNonceSet(10000);
const ALLOWED_OPS = ['GENERATE_KEY', 'HAS_KEY', 'ENCRYPT', 'DECRYPT'];

self.addEventListener('message', async (e) => {
  const { id, type, payload, nonce } = e.data;
  
  if (!ALLOWED_OPS.includes(type)) {
    self.postMessage({ id, type: 'ERROR', error: 'OP_NOT_ALLOWED', nonce });
    return;
  }
  
  if (!nonce || usedNonces.has(nonce)) {
    self.postMessage({ id, type: 'ERROR', error: 'REPLAY_DETECTED', nonce });
    return;
  }
  usedNonces.add(nonce);
  
  try {
    let result;
    let transfer = [];
    
    await secureCryptoOp(async () => {
      switch (type) {
        case 'GENERATE_KEY': result = await generateKey(); break;
        case 'HAS_KEY': result = !!(await getKeyFromIDB()); break;
        case 'ENCRYPT': result = await encryptData(payload); transfer.push(result); break;
        case 'DECRYPT': result = await decryptData(payload); transfer.push(result); break;
        default: throw new Error('Unknown command type: ' + type);
      }
    });
    
    self.postMessage({ id, type: 'SUCCESS', result }, transfer);
  } catch (error) {
    self.postMessage({ id, type: 'ERROR', error: error.message || error.toString() });
  }
});
```

**[FIN DEL DOCUMENTO]**
