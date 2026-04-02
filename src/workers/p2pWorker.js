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

// ─── DTN CONSTANTS ───────────────────────────────────────────────────────────
const DTN_STORE    = 'dtn_mailbox'
const DTN_TTL_MS   = 7 * 24 * 60 * 60 * 1000  // 7 días máximo en tránsito
const DTN_MAX_PKT  = 50_000                     // 50KB por paquete — cap duro
const DTN_MAX_STORE= 4 * 1024 * 1024            // 4MB total para el buzón
const DTN_BATCH_SZ = 5                          // paquetes por ráfaga al drena

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
  // 12 chars Base64 → 72 bits de entropía — suficiente para dedup
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
      purgeDTNExpired().catch(console.error)
      flushDTNToPeer(peerId, peer.channel).catch(console.error)
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

    if (msg.type === 'DTN_PACKET') {
      await receiveDTNPacket(msg.packet, msg.senderVerifyKey).catch(console.error)
      return
    }

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

// ─── ABRIR/MIGRAR IDB CON STORE DTN ─────────────────────────────────────────
async function getDTNStore(mode = 'readonly') {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BunkerCryptoDB', 2)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('keys')) {
        db.createObjectStore('keys')
      }
      if (!db.objectStoreNames.contains(DTN_STORE)) {
        const store = db.createObjectStore(DTN_STORE, { keyPath: 'packetId' })
        store.createIndex('expiresAt', 'expiresAt', { unique: false })
        store.createIndex('recipientId', 'recipientId', { unique: false })
      }
    }
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(DTN_STORE, mode)
      resolve({ db, store: tx.objectStore(DTN_STORE), tx })
    }
    request.onerror = () => reject(request.error)
  })
}

// ─── CREAR PAQUETE DTN (remitente) ───────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
async function createDTNPacket(encryptedPayload, recipientId, senderSignKey) {
  const payloadBytes = new Uint8Array(encryptedPayload)

  if (payloadBytes.byteLength > DTN_MAX_PKT) {
    throw new Error(`DTN_PKT_TOO_LARGE: ${payloadBytes.byteLength} > ${DTN_MAX_PKT}`)
  }

  const now = Date.now()
  const packetId = await fastHash(payloadBytes.buffer + now + Math.random())
  const expiresAt = now + DTN_TTL_MS

  const envelopeData = new TextEncoder().encode(
    JSON.stringify({ packetId, recipientId, expiresAt, sizeBytes: payloadBytes.byteLength })
  )
  const signature = await crypto.subtle.sign(
    { name: 'Ed25519' },
    senderSignKey,
    envelopeData
  )

  return {
    packetId,
    recipientId,
    expiresAt,
    sizeBytes: payloadBytes.byteLength,
    signature: new Uint8Array(signature),
    payload: payloadBytes,
    createdAt: now,
    hopCount: 0,
  }
}

// ─── GUARDAR EN BUZÓN LOCAL (relay / mula) ────────────────────────────────────
async function storeDTNPacket(packet) {
  const { store, tx } = await getDTNStore('readwrite')

  const allPkts = await idbRequest(store.getAll())
  const totalBytes = allPkts.reduce((sum, p) => sum + (p.sizeBytes || 0), 0)

  if (totalBytes + packet.sizeBytes > DTN_MAX_STORE) {
    const sorted = allPkts.sort((a, b) => a.expiresAt - b.expiresAt)
    let freed = 0
    for (const old of sorted) {
      if (freed >= packet.sizeBytes) break
      store.delete(old.packetId)
      freed += old.sizeBytes || 0
    }
  }

  store.put(packet)
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(packet.packetId)
    tx.onerror = () => reject(tx.error)
  })
}

// ─── PURGA DE PAQUETES EXPIRADOS ─────────────────────────────────────────────
async function purgeDTNExpired() {
  const now = Date.now()
  const { store, tx } = await getDTNStore('readwrite')
  const index = store.index('expiresAt')
  const expired = IDBKeyRange.upperBound(now)

  let purged = 0
  await new Promise((resolve, reject) => {
    const req = index.openCursor(expired)
    req.onsuccess = (e) => {
      const cursor = e.target.result
      if (!cursor) { resolve(); return }
      cursor.delete()
      purged++
      cursor.continue()
    }
    req.onerror = () => reject(req.error)
    tx.oncomplete = resolve
  })

  if (purged > 0) {
    self.postMessage({ type: 'DTN_PURGED', count: purged })
  }
  return purged
}

// ─── FLUSH CONTROLADO AL ENCONTRAR UN PEER ───────────────────────────────────
async function flushDTNToPeer(recipientId, channel) {
  const { store } = await getDTNStore('readonly')

  const index = store.index('recipientId')
  const packets = await idbRequest(index.getAll(recipientId))

  const allPackets = await idbRequest(store.getAll())
  const forwardable = allPackets.filter(p =>
    p.recipientId !== localPeerId &&
    p.hopCount < 3 &&
    p.expiresAt > Date.now()
  )

  const toSend = [...new Map(
    [...packets, ...forwardable].map(p => [p.packetId, p])
  ).values()]

  for (let i = 0; i < toSend.length; i += DTN_BATCH_SZ) {
    const batch = toSend.slice(i, i + DTN_BATCH_SZ)

    for (const packet of batch) {
      if (channel.readyState !== 'open') return
      if (channel.bufferedAmount > 256_000) {
        await new Promise(r => setTimeout(r, 200))
      }

      const fwdPacket = { ...packet, hopCount: packet.hopCount + 1 }
      channel.send(JSON.stringify({
        type: 'DTN_PACKET',
        packet: {
          ...fwdPacket,
          payload: Array.from(fwdPacket.payload),
          signature: Array.from(fwdPacket.signature),
        }
      }))
    }

    if (i + DTN_BATCH_SZ < toSend.length) {
      await new Promise(r => setTimeout(r, 100))
    }
  }
}

// ─── RECIBIR PAQUETE DTN (relay) ──────────────────────────────────────────────
async function receiveDTNPacket(rawPacket, senderVerifyKey) {
  const packet = {
    ...rawPacket,
    payload: new Uint8Array(rawPacket.payload),
    signature: new Uint8Array(rawPacket.signature),
  }

  if (packet.expiresAt < Date.now()) return

  if (senderVerifyKey) {
    const envelopeData = new TextEncoder().encode(
      JSON.stringify({
        packetId: packet.packetId,
        recipientId: packet.recipientId,
        expiresAt: packet.expiresAt,
        sizeBytes: packet.sizeBytes,
      })
    )
    const valid = await crypto.subtle.verify(
      { name: 'Ed25519' },
      senderVerifyKey,
      packet.signature,
      envelopeData
    )
    if (!valid) {
      console.warn('[DTN] Firma inválida — paquete descartado')
      return
    }
  }

  if (packet.recipientId === localPeerId) {
    self.postMessage({ type: 'DTN_DELIVERY', packet: rawPacket })
    return
  }

  await storeDTNPacket(packet)
}

function idbRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = () => reject(req.error)
  })
}

// ─── PURGA PERIÓDICA (cada hora) ──────────────────────────────────────────────
setInterval(purgeDTNExpired, 60 * 60 * 1000)
