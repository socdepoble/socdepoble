/**
 * tcu.worker.js - Termodinàmica de la Comunicació (TCU)
 * Sóc de Poble! 
 * 
 * LLEIS IMMUTABLES (V17):
 * 1. Zero-Text: Només rep Float32Array (números).
 * 2. Pressupost: MAX_HEAP=512KB, MAX_TICK_MS=1ms.
 * 3. Degradació: Fallar en silenci sense afectar la UI principal.
 * 4. APIs volàtils: Mètriques opcionals (no penalitzen).
 */

const MAX_TICK_MS = 1;
const HISTORY_SIZE = 120; // 30 segons d'historial a 4Hz

let tickCount = 0;
let lastSaveTime = Date.now();
let lastIct = 0;

// Matrius circulars pre-al·locades per a l'historial (0 al·locacions per tick per evitar Garbage Collector)
const history = {
    kineticFriction: new Float32Array(HISTORY_SIZE),
    bureaucraticDensity: new Float32Array(HISTORY_SIZE),
    batteryLevel: new Float32Array(HISTORY_SIZE),
    networkType: new Float32Array(HISTORY_SIZE)
};

let historyIndex = 0;

// Taula CRC32 Pre-calculada (C++ style)
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  crcTable[i] = c >>> 0;
}

function crc32(ab) {
  const data = new Uint8Array(ab);
  let crc = 0 ^ (-1);
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

self.onmessage = function(e) {
    const t0 = performance.now();
    
    // Validació Handshake & CRC32 (Copilot Network Logic)
    const m = e.data;
    if (!m || m.type !== 'buffer' || !(m.buffer instanceof ArrayBuffer)) return;
    
    const computedCrc = crc32(m.buffer);
    if (computedCrc !== m.crc) {
        self.postMessage({ type: 'nack', id: m.id });
        return;
    }
    
    // Si és correcte, fem ACK per alliberar el pending buffer de l'UI Thread
    self.postMessage({ type: 'ack', id: m.id });
    
    const f32 = new Float32Array(m.buffer);
    if (f32.length < 4) return;
    
    const [kinetic, bureaucratic, battery, network] = f32;
    
    // 1. Guardar a l'historial
    history.kineticFriction[historyIndex] = kinetic;
    history.bureaucraticDensity[historyIndex] = bureaucratic;
    history.batteryLevel[historyIndex] = battery;
    history.networkType[historyIndex] = network;
    
    historyIndex = (historyIndex + 1) % HISTORY_SIZE;
    tickCount++;
    
    // --- 🧠 CÀLCUL TERMODINÀMIC (ÀNIMA DIGITAL) ---
    // 1. Càrrega Cognitiva (Ψ) basada en la fricció cinètica (Scroll Thrashing)
    let psi = Math.min(100, kinetic * 10);
    
    // 2. Empatia Algorítmica (baixa fricció i baixa densitat burocràtica)
    let empathyScore = 100 - (psi * 0.5) - (bureaucratic * 2);
    if (empathyScore < 0) empathyScore = 0;
    
    // 3. Índex d'Abric (Warmth Factor) - Llei APIs Volàtils
    // Les APIs s'indiquen amb -1 si no estan presents (Safari, etc.)
    let warmthFactor = 0;
    if (battery !== -1 && battery < 0.15) {
        warmthFactor += 20; // Bonificació per empatia extrema (estalvi d'energia)
    }
    if (network === 1) { // 1 = offline/slow (ex: 2g/3g)
        warmthFactor += 10;
    }
    
    // 4. Índex de Comunicació Termodinàmica (ICT) - "Language Pulse"
    const ict = Math.min(100, (empathyScore * 0.7) + warmthFactor);
    
    // --- 💾 PERSISTÈNCIA MANDROSA (IndexedDB) ---
    const now = Date.now();
    if (now - lastSaveTime >= 30000) { // Cada 30 segons
        if (Math.abs(ict - lastIct) > 5) { // Només si hi ha variació substancial
            saveToIDB(ict, psi);
            lastIct = ict;
        }
        lastSaveTime = now;
    }
    
    const t1 = performance.now();
    const tickDuration = t1 - t0;
    
    // Llei del Pressupost Computacional
    if (tickDuration > MAX_TICK_MS) {
        console.warn(`[TCU BUDGET EXCEEDED] Worker tick = ${tickDuration.toFixed(2)}ms`);
    }
    
    // --- 📡 RETORN A LA UI (Llei de Degradació) ---
    try {
        const bc = new BroadcastChannel('sdp-thermo');
        bc.postMessage({
            type: 'tcu-metrics',
            ict: ict,
            psi: psi,
            warmthFactor: warmthFactor,
            bureaucratic: bureaucratic,
            costMs: tickDuration
        });
        bc.close();
    } catch (err) {
        // Llei de Degradació: Si BroadcastChannel falla, morim en silenci sense trencar la UI.
    }
};

function saveToIDB(ict, psi) {
    try {
        const request = indexedDB.open('sdp-tcu', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('snapshots')) {
                db.createObjectStore('snapshots', { autoIncrement: true });
            }
        };
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('snapshots', 'readwrite');
            tx.objectStore('snapshots').add({ timestamp: Date.now(), ict, psi });
            tx.oncomplete = () => db.close();
        };
    } catch (e) {
        // Fallback silenciós (Pedra Seca)
    }
}
