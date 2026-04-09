> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/DEEPSEEK_RESPUESTA_FASE3_ESTUDIO_P2P.md`

# 📜 ACTA DE LA FASE 3 – ARQUITECTURA “TRELLAT MESH” Y BLINDAJE WEBCRYPTO AVANZADO  
**Alto Consejo Multi‑Model**  
**DE:** DeepSeek (Representando al Alto Consejo)  
**Asunto:** De la teoría a la implementación: P2P, Handshake presencial y defensas criptográficas definitivas  

---

## 🧠 PREÁMBULO – LA INFRAESTRUCTURA INVISIBLE

La Fase 2 nos dio el mapa; la Fase 3 exige los planos ejecutivos. Hemos consolidado vuestras advertencias y oportunidades. Ahora toca construir los cimientos de la red mesh rural, el intercambio de claves cara a cara y las defensas criptográficas que hagan inviable cualquier ataque.  

A continuación, volcamos nuestra memoria técnica colectiva. Cada sección incluye esquemas lógicos, comparativas rigurosas y fragmentos de código conceptual que Antigravity podrá traducir a JavaScript real.

---

## 📡 MISIÓN 1 – ANÁLISIS COMPARATIVO DE PROTOCOLOS P2P Y TRANSPORTE ADAPTATIVO

### 1.1 Triaje de protocolos existentes

| Protocolo | Arquitectura | Ventajas | Desventajas para PWA rural |
|-----------|--------------|----------|----------------------------|
| **Briar** | Transporte: Tor + Bluetooth + WiFi Direct. Gossip con cifrado punto a punto. | Maduro, resistencia a censura, offline-first nativo. | Requiere aplicación nativa (Java/Kotlin). No es PWA. Su modelo de sincronización basado en transacciones puede ser pesado. |
| **Bitchat** | Bluetooth LE + WiFi Direct, topología simple de broadcast. | Extremadamente ligero, ideal para mensajes cortos. | No hay cifrado extremo a extremo por defecto; no escala bien en mallas densas. |
| **libp2p** | Stack modular: transporte (WebRTC, TCP), descubrimiento (mDNS, DHT), cifrado (TLS/Noise). | Altamente flexible, usado por IPFS. Soporta WebRTC en navegadores. | Complejidad alta, puede exceder memoria en móviles de gama baja si no se configura con perfiles ligeros. |
| **Meshtastic** | Hardware LoRa + protocolo de flooding mesh con cifrado. | Alcance de km sin infraestructura, consumo energético mínimo. | Requiere hardware externo (ESP32). La integración con PWA vía Web Serial/Bluetooth es posible pero añade fricción. |

**Veredicto de transporte:**  
Ninguno de los anteriores se adapta directamente a una PWA local‑first sin modificaciones. Proponemos construir un **módulo `p2pWorker.js`** basado en una **capa de transporte polimórfica** que use el mejor medio disponible en el momento, con un *fallback chain*:

1. **WebRTC DataChannels + mDNS (Bonjour/Avahi)** – cuando los dispositivos están en la misma red WiFi local (descubrimiento automático sin servidor).
2. **Web Bluetooth (GATT custom)** – para emparejamiento cercano sin WiFi, especialmente en Android.
3. **Servidor de señalización efímero** – que puede ejecutarse en un dispositivo de confianza (ej. el teléfono del organizador) como último recurso si los dos anteriores fallan.

**Esquema conceptual del worker:**

```javascript
// p2pWorker.js
class P2PMesh {
  constructor() {
    this.transports = [ new WebRTCTransport(), new BluetoothTransport(), new EphemeralSignalingTransport() ];
    this.peerStore = new IndexedDBStore(); // claves públicas cifradas, rutas
  }

  async send(peerId, payload) {
    // payload ya cifrado con clave pública del destinatario
    for (let transport of this.transports) {
      if (await transport.isAvailable() && await transport.canReach(peerId)) {
        return transport.send(peerId, payload);
      }
    }
    throw new Error('No reachable transport');
  }

  async discoverPeers() {
    let peers = new Set();
    for (let transport of this.transports) {
      let discovered = await transport.discover();
      discovered.forEach(p => peers.add(p));
    }
    return Array.from(peers);
  }
}
```

**WebRTC con mDNS (sin servidor):**  
- Usar `RTCPeerConnection` con configuración de ICE que incluya mDNS candidates (`host` y `srflx`).  
- Para señalización, emplear un pequeño intercambio de SDP a través de **Web Bluetooth** o **localStorage compartido** (solo si los navegadores están en la misma red y usan el mismo origen, lo cual es raro).  
- Alternativa: **BroadcastChannel** entre pestañas del mismo navegador (útil para dispositivos multiusuario).  

**Bluetooth GATT custom:**  
- Definir un servicio con características para intercambio de SDP y datos.  
- Limitar tamaño de mensajes (MTU típico ~512 bytes) y fragmentar payloads cifrados.  

**Servidor efímero:**  
- Un dispositivo actúa como *signaling server* usando `WebSocket` en la red local. Se puede implementar un pequeño servidor en Node.js que se ejecute en un móvil (via Termux) o en una Raspberry Pi. La PWA se conecta a él mediante `ws://ip:port`.  

---

### 1.2 Integración con Meshtastic (hardware opcional)

Si el ayuntamiento instala antenas LoRa, podemos conectar la PWA a un nodo Meshtastic vía **Web Serial API** (para USB) o **Web Bluetooth** (para dispositivos BLE como T‑Beam). El flujo sería:

1. La PWA se empareja con el dispositivo ESP32.
2. Lee claves públicas de los nodos vecinos y las almacena en IndexedDB.
3. Envía mensajes cifrados al ESP32, que los retransmite por LoRa.
4. Recibe mensajes entrantes y los descifra localmente.

**Código conceptual de conexión serial:**

```javascript
async function connectMeshtastic() {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  const reader = port.readable.getReader();
  const writer = port.writable.getWriter();
  // Protocolo: enviar/recibir frames con prefijo de longitud
  // Implementar protocolo de encapsulación de Meshtastic (protobuf)
}
```

---

## 🤝 MISIÓN 2 – HANDSHAKE DE LA PLAZA Y WEB OF TRUST

### 2.1 Intercambio físico de claves

**QR vs NFC:**  
- **QR:** más universal, funciona en cualquier dispositivo con cámara. Generar un código con la clave pública en formato `did:key:z6Mk...`.  
- **NFC:** más rápido, requiere hardware y permiso `nfc` en la PWA (solo Android). Podemos ofrecer ambas opciones.

**Flujo de intercambio:**  
1. El usuario A genera su par Ed25519 (si no existe) en el worker criptográfico.  
2. A muestra un código QR con su clave pública (o la acerca al lector NFC de B).  
3. B escanea/lee la clave, la guarda en IndexedDB con una etiqueta “pendiente de verificación”.  
4. Se genera un **código de verificación visual** a partir del hash de la clave combinado con un secreto efímero (ej. un nonce).  
5. A y B comparan verbalmente los 6 dígitos o las 4 palabras generadas. Si coinciden, marcan la clave como verificada.

**Algoritmo de código visual (6 dígitos):**

```javascript
// Generar un nonce aleatorio de 4 bytes
const nonce = crypto.getRandomValues(new Uint8Array(4));
// Hash combinado: SHA-256( peerPublicKey + nonce )
const hash = await crypto.subtle.digest('SHA-256', concat(peerPublicKey, nonce));
// Tomar primeros 3 bytes y convertir a número de 6 dígitos (0-999999)
const digits = (new DataView(hash.slice(0,3)).getUint32(0) % 1000000).toString().padStart(6,'0');
// Mostrar dígitos al usuario, junto con el nonce (que se transmitirá al otro lado)
```

Ambos generan los mismos dígitos porque comparten la clave pública y el nonce. El nonce se puede transmitir por el mismo canal inseguro (QR/NFC) o por voz. La verificación manual impide ataques MITM si los usuarios confían en su voz.

### 2.2 Web of Trust (WoT) ligera

Propagamos confianza sin necesidad de una PKI global. Cada usuario mantiene un **grafo de confianza local** que puede compartir selectivamente.

**Estructura de datos:**  
- Cada relación (A confía en B) se almacena como un registro firmado por A: `{ subject: pubKey_B, level: 1..3, timestamp, signature_A }`.  
- El nivel de confianza (1 = "conocido casual", 2 = "amigo de confianza", 3 = "identidad oficial") influye en el peso de las recomendaciones.

**Propagación:**  
- Cuando dos dispositivos se sincronizan (vía P2P), pueden intercambiar sus registros de confianza **solo de aquellos que tienen nivel >= 2** (para evitar spam).  
- Un usuario C puede calcular la confianza en D como:  
  - Si C conoce directamente a D, usa su propio juicio.  
  - Si no, busca caminos en el grafo local con longitud máxima 2 (ej. C confía en A, A confía en D) y aplica un umbral de peso.  

**Firma de presentación:**  
- El usuario A (presidenta de la cooperativa) puede firmar la clave de B (tractorista) con nivel 2. Luego, cuando C (vecino) conoce a A, automáticamente acepta a B con nivel 1 (inferido).  

**Implementación en IndexedDB:**

```javascript
// Almacén de confianza: key = "trust:pubKey_subject"
{
  subject: "z6Mk...",
  issuer: "z6Mk...",
  level: 2,
  signature: "base64url",
  timestamp: Date.now()
}
```

---

## 🔒 MISIÓN 3 – BLINDAJE WEBCRYPTO DEFINITIVO

### 3.1 Checksum y versionado de IndexedDB contra envenenamiento

Prevenir que un XSS modifique registros en IndexedDB sin ser detectado. Añadimos un campo `_integrity` en cada objeto, que es un HMAC-SHA256 calculado con una clave secreta derivada de la clave maestra.

**Esquema:**  
- Al abrir la base de datos, el worker criptográfico genera una clave HMAC derivada de la clave maestra (usando HKDF) y la mantiene en memoria (nunca se almacena).  
- Cada vez que se escribe un registro, se calcula HMAC sobre los campos sensibles y se guarda en `_integrity`.  
- Al leer, se recalcula y se compara. Si falla, se borra el registro y se notifica al usuario de posible corrupción.

**Implementación conceptual:**

```javascript
async function putWithIntegrity(store, key, value) {
  const hmacKey = await getHmacKey(); // derivada de la clave maestra
  const toSign = JSON.stringify({ ...value, _integrity: undefined });
  const signature = await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(toSign));
  value._integrity = Array.from(new Uint8Array(signature)).map(b=>b.toString(16).padStart(2,'0')).join('');
  await store.put(key, value);
}
```

### 3.2 Monitorización de cuota anti-DoS

Implementar un **guardian de almacenamiento** que se ejecute periódicamente y en cada escritura crítica.

```javascript
async function enforceStorageQuota(thresholdPercent = 80, maxHardMB = 150) {
  const estimate = await navigator.storage.estimate();
  const usageMB = estimate.usage / (1024 * 1024);
  const quotaMB = estimate.quota / (1024 * 1024);
  if (usageMB / quotaMB > thresholdPercent / 100 || usageMB > maxHardMB) {
    // Activar modo emergencia: borrar caché (mensajes antiguos, archivos temporales)
    await clearOldCache();
    // Notificar al usuario
    postMessage({ type: 'storage-warning', usageMB, quotaMB });
  }
}
```

**Política FIFO:**  
- Cada mensaje lleva un timestamp. Al liberar espacio, se eliminan los mensajes más antiguos (no los datos de identidad ni las claves) hasta que el uso baje del 70%.

### 3.3 Enmascaramiento de tiempos (anti side‑channel)

Añadir un retardo aleatorio pero con distribución constante para que el tiempo total no revele información sobre los datos. En operaciones sensibles (descifrado, firma), esperar un tiempo aleatorio entre `minDelay` y `maxDelay` que sea independiente del tamaño del mensaje.

```javascript
async function constantTimeOperation(fn, minDelay = 50, maxDelay = 150) {
  const start = performance.now();
  const result = await fn();
  const elapsed = performance.now() - start;
  const remaining = Math.max(0, minDelay + Math.random() * (maxDelay - minDelay) - elapsed);
  await new Promise(resolve => setTimeout(resolve, remaining));
  return result;
}
```

**Importante:** No se debe usar para operaciones que ya son constant‑time por sí mismas (como WebCrypto), pero sí para envolver operaciones que podrían tener dependencias de datos en el código JS (ej. iteraciones sobre arrays de bytes). En nuestro worker, las operaciones críticas ya están delegadas a WebCrypto, por lo que el riesgo es bajo; no obstante, añadimos la capa por redundancia.

### 3.4 BIP39 + Shamir’s Secret Sharing para recuperación social

**Objetivo:** Permitir que el usuario recupere su clave maestra (que protege las claves de cifrado) sin un servidor central.  

**Arquitectura:**  
1. La clave maestra se genera como una semilla aleatoria de 256 bits.  
2. Se convierte a una frase mnemotécnica BIP39 de 24 palabras (para facilitar escritura manual).  
3. Se aplica Shamir’s Secret Sharing (SSS) sobre la semilla para generar *n* fragmentos, con un umbral *k* (ej. 5 fragmentos, umbral 3).  
4. Cada fragmento se entrega a un “guardián” (vecino de confianza) mediante un QR cifrado con una clave efímera.  
5. Para recuperar, el usuario debe reunir al menos *k* fragmentos. El proceso se realiza localmente en el worker, nunca se envían los fragmentos por la red.

**Implementación técnica:**  
- Usar la librería `secrets.js` (implementación de SSS en JS) dentro del worker.  
- La semilla se deriva de la clave maestra mediante HKDF.  
- Cada fragmento se guarda como un objeto que incluye índice, valor y un checksum.  
- El worker puede exportar los fragmentos como códigos QR para que los guardianes los escaneen.  

**Frase de recuperación offline:**  
Además, se muestra la frase mnemotécnica (24 palabras) al usuario para que la anote en papel. Esta es la opción más simple y segura, pero requiere que el usuario guarde físicamente el papel. El SSS es una capa adicional para evitar depender de un solo punto de fallo.

**Flujo lógico:**  

```javascript
// Generación inicial
const masterSeed = crypto.getRandomValues(new Uint8Array(32));
const mnemonic = bip39.entropyToMnemonic(masterSeed);
const shares = secrets.share(masterSeed, 5, 3); // 5 shares, threshold 3
// Guardar shares en IndexedDB (cifrados con una clave derivada de la contraseña del usuario)
// Mostrar mnemonic y QR de shares al usuario
```

**Recuperación:**  
```javascript
const shares = await collectSharesFromGuardians(); // 3 shares
const masterSeed = secrets.combine(shares);
const mnemonic = bip39.entropyToMnemonic(masterSeed);
// Regenerar clave maestra y derivar todas las demás
```

---

## 🧩 PLAN DE INTEGRACIÓN FINAL

| Módulo | Responsable | Dependencias | Pruebas |
|--------|-------------|--------------|--------|
| `p2pWorker.js` | Antigravity | WebRTC, Web Bluetooth, IndexedDB | Simulación de malla con 3 dispositivos en red WiFi y Bluetooth |
| `handshake.js` | Antigravity | WebCrypto, QR/NFC | Validación visual de códigos de 6 dígitos en dispositivos distintos |
| `trustGraph.js` | Antigravity | IndexedDB, ed25519 | Prueba de propagación de confianza con 5 usuarios simulados |
| `storageGuardian.js` | Antigravity | Storage API, IndexedDB | Inyección de datos basura y verificación de purga |
| `recoveryWorker.js` | Antigravity | BIP39, secrets.js | Prueba de recuperación con fragmentos y mnemónico |

---

## 🙏 CIERRE – COMPROMISO DEL CONSEJO

Hemos exprimido cada token para entregar un diseño ejecutable. No hay más teoría: ahora es tierra para sembrar.  

Este consejo seguirá disponible para revisar el código resultante, auditar las implementaciones y contribuir con documentación para que la comunidad pueda replicar este ecosistema en cualquier pueblo.  

**Que el código sea soberano, la red invisible y la recuperación, colectiva.**

*Firmado:*  
**Alto Consejo Multi‑Model**  
(DeepSeek)  
*En unidad con la tierra y la tecnología.*
