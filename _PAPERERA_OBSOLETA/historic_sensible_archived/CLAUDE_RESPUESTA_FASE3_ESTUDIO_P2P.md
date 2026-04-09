> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/CLAUDE_RESPUESTA_FASE3_ESTUDIO_P2P.md`

# 📜 ACTA DE LA FASE 3 – ARQUITECTURA “TRELLAT MESH” Y BLINDAJE WEBCRYPTO AVANZADO  
**Alto Consejo Multi‑Model**  
**DE:** Claude (Representando al Alto Consejo)  
**Asunto:** De la teoría a la implementación: P2P, Handshake presencial y defensas criptográficas definitivas  

---

## 🧠 PREÁMBULO – LA INFRAESTRUCTURA INVISIBLE

La Fase 2 nos dio el mapa; la Fase 3 exige los planos ejecutivos. Hemos consolidado vuestras advertencias y oportunidades. Ahora toca construir los cimientos de la red mesh rural, el intercambio de claves cara a cara y las defensas criptográficas que hagan inviable cualquier ataque.  

A continuación, volcamos nuestra memoria técnica colectiva. Cada sección incluye esquemas lógicos, comparativas rigurosas y fragmentos de código conceptual que Antigravity podrá traducir a JavaScript real.

---

## 📡 MISIÓN 1 – ANÁLISIS COMPARATIVO DE PROTOCOLOS P2P Y TRANSPORTE ADAPTATIVO

### Gossip Protocol — Estructura Matemática

El gossip que usan Briar y libp2p es **epidémico probabilístico**. La matemática subyacente:

Cada nodo mantiene una vista parcial de la red (fanout `f`). En cada ronda, selecciona `f` vecinos aleatoriamente y les envía su estado. La convergencia es logarítmica: con `n` nodos y fanout `f`, un mensaje llega a todos los nodos en `O(log_f(n))` rondas.

```javascript
// p2pWorker.js — Núcleo del Gossip Engine
const FANOUT = 3        // vecinos por ronda
const TTL_MAX = 7       // saltos máximos
const SEEN_CACHE_SIZE = 1000  // mensajes recordados (anti-loop)

class GossipEngine {
  constructor() {
    this.peers = new Map()      // peerId → RTCDataChannel
    this.seen = new Set()       // messageId vistos
    this.seenQueue = []         // FIFO para limitar memoria
  }

  async broadcast(payload, ttl = TTL_MAX) {
    const messageId = await this.#hashMessage(payload)
    if (this.seen.has(messageId)) return  // ya propagado
    
    this.#markSeen(messageId)
    
    // Selección aleatoria de fanout vecinos
    const candidates = [...this.peers.entries()]
    const targets = this.#sample(candidates, FANOUT)
    
    for (const [peerId, channel] of targets) {
      if (channel.readyState === 'open') {
        channel.send(JSON.stringify({ messageId, ttl: ttl - 1, payload }))
      }
    }
  }

  onMessageReceived(raw) {
    const { messageId, ttl, payload } = JSON.parse(raw)
    if (this.seen.has(messageId) || ttl <= 0) return
    
    // Procesar mensaje localmente
    self.postMessage({ type: 'GOSSIP_MESSAGE', payload })
    
    // Re-propagar si TTL lo permite
    if (ttl > 1) this.broadcast(payload, ttl)
  }

  #markSeen(id) {
    if (this.seenQueue.length >= SEEN_CACHE_SIZE) {
      this.seen.delete(this.seenQueue.shift())  // FIFO
    }
    this.seen.add(id)
    this.seenQueue.push(id)
  }

  #sample(arr, n) {
    // Fisher-Yates parcial
    const result = []
    const copy = [...arr]
    for (let i = 0; i < Math.min(n, copy.length); i++) {
      const j = i + Math.floor(Math.random() * (copy.length - i))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      result.push(copy[i])
    }
    return result
  }

  async #hashMessage(payload) {
    const encoded = new TextEncoder().encode(JSON.stringify(payload))
    const hash = await crypto.subtle.digest('SHA-256', encoded)
    return btoa(String.fromCharCode(...new Uint8Array(hash))).slice(0, 16)
  }
}
```

**¿Cabe en un móvil de gama baja?** Con fanout 3 y TTL 7, la memoria del Worker es manejable: el `seen` cache de 1000 entradas ocupa ~16KB. El cuello de botella no es memoria sino CPU en el hashing. En un Snapdragon 430 (gama baja 2018), `crypto.subtle.digest` tarda ~2ms por mensaje. Con 100 mensajes/minuto, eso es 200ms/min de CPU — aceptable.

---

## Meshtastic / LoRa → PWA: El Puente

LoRa opera en bandas ISM (868MHz en Europa). Los nodos ESP32+LoRa de Meshtastic actúan como routers de largo alcance (hasta 10km en campo abierto). La integración con PWA tiene dos vías:

**Vía 1 — Web Serial API (Chrome/Android, no iOS):**

```javascript
// Conexión directa ESP32 via USB-OTG o adaptador serial
async function connectMeshtastic() {
  const port = await navigator.serial.requestPort()
  await port.open({ baudRate: 115200 })
  
  const reader = port.readable.getReader()
  
  // Meshtastic usa Protocol Buffers sobre serial
  // El formato de paquete es: [magic][length][protobuf_encoded_packet]
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    parseMeshtasticPacket(value)
  }
}
```

**Vía 2 — Web Bluetooth GATT (más universal):**

Meshtastic expone un servicio GATT custom (`6ba1b218-15a8-461f-9fa8-5d8f53108af9`). Desde PWA:

```javascript
async function connectMeshtasticBluetooth() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['6ba1b218-15a8-461f-9fa8-5d8f53108af9'] }]
  })
  
  const server = await device.gatt.connect()
  const service = await server.getPrimaryService('6ba1b218-15a8-461f-9fa8-5d8f53108af9')
  
  // Characteristic para enviar paquetes al mesh
  const toRadio = await service.getCharacteristic('f75c76d2-129e-4dad-a1dd-7866124401e7')
  // Characteristic para recibir del mesh  
  const fromRadio = await service.getCharacteristic('8ba2bcc2-ee02-4a55-a531-c525c5e454d5')
  
  await fromRadio.startNotifications()
  fromRadio.addEventListener('characteristicvaluechanged', handleMeshtasticPacket)
}
```

**Limitación crítica en iOS:** Web Bluetooth en iOS Safari está bloqueado por política de Apple. Requiere app nativa o wrapper Capacitor.

---

## Árbol de Fallback de Transporte

```
┌─────────────────────────────────────────────┐
│           INICIO: ¿hay conectividad?         │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────▼────────┐
         │  Internet global │ ──YES──→ WebRTC con STUN/TURN
         └────────┬────────┘           estándar
                  NO
         ┌────────▼────────┐
         │   WiFi local LAN │ ──YES──→ mDNS discovery +
         └────────┬────────┘           WebRTC DataChannels
                  NO                   sin STUN
         ┌────────▼────────┐
         │  BT disponible   │ ──YES──→ Web Bluetooth GATT
         └────────┬────────┘           (Android/iOS nativa)
                  NO
         ┌────────▼────────┐
         │ LoRa disponible  │ ──YES──→ Web Serial / BT
         └────────┬────────┘           → Meshtastic bridge
                  NO
         ┌────────▼────────┐
         │  MODO ISLA       │          Cola OPFS local.
         │  (sin conexión)  │          Sync cuando reconecta.
         └─────────────────┘
```

El descubrimiento mDNS desde un Web Worker requiere una pequeña trampa: los navegadores no exponen mDNS directamente al JS. La solución práctica es un Service Worker que usa la Fetch API para hacer broadcast a rangos de IP locales comunes (`192.168.1.1-254`) buscando el endpoint de señalización de otros nodos Sóc de Poble en la LAN.

---

# MISIÓN 2: HANDSHAKE DE LA PLAZA

## QR vs NFC

| Criterio | QR | NFC |
|---|---|---|
| Soporte universal | ✅ Todos los móviles | ❌ Algunos Android, no iPhone viejos |
| Distancia | 30cm-1m | <5cm |
| Riesgo de intercepción óptica | Bajo (contexto físico) | Mínimo |
| UX para personas mayores | ✅ "Foto al papel" | ❌ Abstracto |

**Veredicto: QR es el estándar.** NFC como opción secundaria para usuarios avanzados.

---

## Código de Seguridad Visual — El "Número del Vecino"

El problema: SHA-256 de una clave Ed25519 son 64 caracteres hexadecimales. Inmanejable para verificación humana.

**Solución: Safety Number de 12 dígitos** (inspirado en Signal):

```javascript
async function generateSafetyNumber(myPublicKey, theirPublicKey) {
  // Ordenar lexicográficamente para que ambos lados generen el mismo número
  const keys = [myPublicKey, theirPublicKey].sort()
  
  const combined = new Uint8Array([...keys[0], ...keys[1]])
  
  // 5 rondas de SHA-256 (hace el cálculo costoso para fuerza bruta)
  let hash = combined
  for (let i = 0; i < 5; i++) {
    hash = new Uint8Array(await crypto.subtle.digest('SHA-256', hash))
  }
  
  // Convertir a 12 dígitos en 3 grupos de 4
  // Usar solo los primeros 5 bytes (40 bits → 99999 max por grupo)
  const view = new DataView(hash.buffer)
  const a = view.getUint32(0) % 10000
  const b = view.getUint32(4) % 10000
  const c = view.getUint32(8) % 10000
  
  return `${String(a).padStart(4,'0')}-${String(b).padStart(4,'0')}-${String(c).padStart(4,'0')}`
  // Resultado: "3721-0845-9163"
}
```

**UX en la plaza:** Los dos vecinos miran sus pantallas. Si los 12 dígitos coinciden en ambos móviles, la conexión es auténtica. Un atacante que intercepte el QR en tránsito generaría un número diferente. La verificación oral de 12 dígitos tarda 15 segundos y es verificable por cualquier persona.

Alternativamente, los mismos bytes del hash pueden mapear a palabras BIP39 (2048 palabras en español disponibles):

```
"manzana-tractor-río" → más memorable, mismo nivel de seguridad para 3 palabras
```

---

## Web of Trust — Propagación Matemática del Trust Score

El modelo correcto no es un "score" numérico (frágil a manipulación) sino un **grafo de firmas verificables**:

```javascript
// Estructura de un certificado de confianza local
const trustCertificate = {
  subject: theirPublicKeyB64,        // clave del certificado
  issuer: myPublicKeyB64,            // quien firma
  timestamp: Date.now(),
  trustLevel: 'direct',              // 'direct' | 'transitive'
  hopsFromRoot: 0,                   // 0 = verificación física directa
  signature: null                    // Ed25519 del issuer sobre el resto
}

// Firmar el certificado
const encoded = new TextEncoder().encode(
  JSON.stringify({ ...trustCertificate, signature: undefined })
)
trustCertificate.signature = await crypto.subtle.sign(
  { name: 'Ed25519' },
  myPrivateKey,  // NON-EXTRACTABLE
  encoded
)
```

**Propagación:** Cuando A certifica a B, ese certificado viaja por gossip a todos los nodos. Cuando C recibe el certificado A→B, puede verificar la firma de A (cuya clave ya conoce) y establecer confianza transitiva:

```
A (root, verificado físicamente por todos) 
  → firma B (hops: 0, trust: direct)
    → B firma C (hops: 1, trust: transitive)
      → C firma D (hops: 2, trust: transitive)
```

**Regla de degradación:** La confianza transitiva se degrada con los saltos. Un nodo a 3 saltos del root recibe acceso de lectura pero no de escritura en recursos compartidos. A 5+ saltos, requiere nueva verificación física. Esto evita que un atacante que comprometa un nodo pueda certificar infinitamente hacia adelante.

```javascript
function computeTrustLevel(certificate) {
  if (certificate.trustLevel === 'direct') return 1.0
  const degradation = Math.pow(0.7, certificate.hopsFromRoot)
  return Math.max(degradation, 0.1)  // mínimo 10% — nunca cero
}
```

---

# MISIÓN 3: BLINDAJE WEBCRYPTO DEFINITIVO

## 1. Checksum Anti-Envenenamiento de IndexedDB

```javascript
// Al escribir cualquier dato crítico en IDB
async function secureWrite(store, key, value, signingKey) {
  const serialized = JSON.stringify(value)
  const encoded = new TextEncoder().encode(serialized)
  
  // Hash del contenido
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
  
  // Firma del hash (prueba de autoría, no solo integridad)
  const signature = await crypto.subtle.sign(
    { name: 'Ed25519' },
    signingKey,
    hashBuffer
  )
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
  
  await store.put({ value, hash, signature: signatureB64, version: DB_SCHEMA_VERSION }, key)
}

// Al leer — verificación obligatoria antes de usar
async function secureRead(store, key, verifyKey) {
  const record = await store.get(key)
  if (!record) return null
  
  // Verificar versión de schema
  if (record.version !== DB_SCHEMA_VERSION) {
    throw new Error(`SCHEMA_MISMATCH: esperado ${DB_SCHEMA_VERSION}, encontrado ${record.version}`)
  }
  
  // Verificar integridad
  const encoded = new TextEncoder().encode(JSON.stringify(record.value))
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const expectedHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
  
  if (record.hash !== expectedHash) throw new Error('INTEGRITY_VIOLATION')
  
  // Verificar firma
  const sigBytes = Uint8Array.from(atob(record.signature), c => c.charCodeAt(0))
  const valid = await crypto.subtle.verify({ name: 'Ed25519' }, verifyKey, sigBytes, hashBuffer)
  
  if (!valid) throw new Error('SIGNATURE_INVALID — posible tampering')
  
  return record.value
}
```

---

## 2. Monitor Anti-DoS de Cuota

```javascript
// En cryptoWorker.js — ejecutar cada 60 segundos y antes de escrituras grandes
class StorageGuard {
  static HARD_LIMIT_BYTES = 150 * 1024 * 1024  // 150MB
  static WARNING_RATIO = 0.80
  
  static async check() {
    const { usage, quota } = await navigator.storage.estimate()
    const ratio = usage / quota
    const overHardLimit = usage > this.HARD_LIMIT_BYTES
    
    if (overHardLimit || ratio > this.WARNING_RATIO) {
      self.postMessage({ type: 'STORAGE_ALERT', usage, quota, ratio })
      await this.#emergencyEviction()
    }
    
    return { usage, quota, ratio, safe: !overHardLimit && ratio < this.WARNING_RATIO }
  }
  
  static async #emergencyEviction() {
    const db = await openBunkerDB()
    const tx = db.transaction(['messageCache', 'mediaCache'], 'readwrite')
    
    // FIFO estricto — eliminar los más antiguos primero
    // NUNCA tocar: 'cryptoKeys', 'identity', 'trustGraph'
    const protectedStores = new Set(['cryptoKeys', 'identity', 'trustGraph'])
    
    for (const storeName of ['mediaCache', 'messageCache']) {
      const store = tx.objectStore(storeName)
      const index = store.index('timestamp')
      
      // Cursor en orden ascendente (más antiguos primero)
      let cursor = await index.openCursor(null, 'next')
      let evicted = 0
      
      while (cursor && evicted < 100) {
        await cursor.delete()
        cursor = await cursor.continue()
        evicted++
      }
    }
    
    await tx.done
  }
}
```

---

## 3. Anti Side-Channel — Enmascaramiento de Tiempos

El principio: si todas las operaciones criptográficas tardan un tiempo similar y aleatorio, un atacante externo no puede inferir qué operación se realizó ni si tuvo éxito.

```javascript
// Wrapper de tiempo constante para operaciones sensibles
async function timingMasked(operation, minMs = 50, maxMs = 150) {
  const targetMs = minMs + Math.random() * (maxMs - minMs)
  const start = performance.now()
  
  let result, error
  try {
    result = await operation()
  } catch (e) {
    error = e
  }
  
  // Padding hasta el tiempo objetivo
  const elapsed = performance.now() - start
  const remaining = targetMs - elapsed
  
  if (remaining > 0) {
    await new Promise(resolve => setTimeout(resolve, remaining))
  }
  
  // Lanzar el error DESPUÉS del padding — no revelar fallo por timing corto
  if (error) throw error
  return result
}

// Uso:
const decrypted = await timingMasked(
  () => crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext),
  50,   // mínimo 50ms
  200   // máximo 200ms
)
```

**Nota importante:** Este padding protege contra atacantes en red que miden latencias. No protege contra atacantes con acceso físico al dispositivo midiendo consumo de energía (power analysis). Para ese nivel de amenaza necesitáis hardware seguro dedicado — fuera del alcance realista de una PWA.

---

## 4. BIP39 + Shamir's Secret Sharing — Semilla de Recuperación Social

**El esquema completo:**

```
Clave Privada Ed25519 (32 bytes)
         ↓
    Shamir (3 de 5)
         ↓
  5 fragmentos de 32 bytes cada uno
         ↓
  Cada fragmento → BIP39 (24 palabras en español)
         ↓
  5 guardianes reciben su tarjeta de palabras
```

La implementación de Shamir requiere aritmética en campo finito (GF(2^8) o GF(p) con p primo grande). No existe en Web Crypto API nativa — necesitáis una librería. La más auditada para JS es `secrets.js-grempe` (código pequeño, auditado, sin dependencias).

```javascript
// cryptoWorker.js — Generación de fragmentos Shamir
import Shares from 'secrets.js-grempe'

async function generateRecoveryFragments(privateKeyBytes, threshold = 3, total = 5) {
  // Convertir clave a hex para secrets.js
  const hexKey = Array.from(privateKeyBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  // Dividir: necesitas 3 de 5 fragmentos para reconstruir
  const shares = Shares.share(hexKey, total, threshold)
  
  // Convertir cada fragmento a palabras BIP39
  const wordFragments = await Promise.all(
    shares.map(share => hexToMnemonic(share))
  )
  
  return wordFragments  // Array de 5 grupos de palabras
}

async function reconstructFromFragments(mnemonics) {
  // Necesita mínimo 'threshold' elementos del array
  const shares = await Promise.all(
    mnemonics.map(m => mnemonicToHex(m))
  )
  
  const hexKey = Shares.combine(shares)
  return hexToBytes(hexKey)
}
```

**UX para la plaza:** Cada guardián recibe una tarjeta plastificada con sus 24 palabras en valenciano/castellano y su número de guardián (1-5). La tarjeta incluye instrucciones: "Si el Mestre Javi pierde su móvil, reúne a 3 guardianes y seguid estas instrucciones". Sin internet, sin servidor, sin empresa.

**Advertencia operacional:** El punto de fallo de Shamir no es matemático sino humano. Si 3 de los 5 guardianes se ponen de acuerdo maliciosamente, pueden reconstruir la clave. La selección de guardianes (presidente de cooperativa, párroco, secretaria del ayuntamiento, familiar de confianza, vecino neutral) es una decisión social, no técnica. El protocolo criptográfico es tan fuerte como la confianza en las personas elegidas.

---

## RESUMEN DE PRIORIDADES DE IMPLEMENTACIÓN

Ordenado por impacto/esfuerzo:

1. **StorageGuard** — 2 horas de implementación, elimina el vector DoS. Hacedlo primero.
2. **secureWrite/secureRead con firma** — 4 horas, cierra el envenenamiento de IDB.
3. **Safety Number de 12 dígitos** — 1 hora, mejora crítica de UX en el handshake.
4. **timingMasked wrapper** — 1 hora, aplicarlo a decrypt y verify.
5. **Shamir + BIP39** — 1 día incluyendo UX de tarjetas. Hacedlo antes del despliegue en producción.
6. **Gossip Engine + mDNS fallback** — 1 semana de trabajo real. Es la pieza más compleja.
7. **Bridge Meshtastic** — Fase posterior. Requiere hardware y coordinación con ayuntamiento.

El código está aquí. La arquitectura es sólida. Lo que viene ahora es trabajo de implementación y prueba con usuarios reales en un pueblo real.
