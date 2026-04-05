import * as Y from 'yjs';
import { rhizomeManager, connectedPeers } from './rhizomeManager';

let isBackground = false;
let lastStateVector = null;
let heartbeat;

export function initLifecycleManager(ydoc, signaling) {
  if (typeof window === 'undefined') return;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) enterBackground();
    else resumeFromBackground(signaling);
  });

  window.addEventListener('pagehide', enterBackground);
  window.addEventListener('pageshow', () => resumeFromBackground(signaling));

  startHeartbeat();
}

function enterBackground() {
  isBackground = true;

  // snapshot rápido
  lastStateVector = Y.encodeStateVector(rhizomeManager.yDoc);

  // cerrar peers limpiamente para que no corrompan estado al suspenderse
  for (const peer of connectedPeers.values()) {
    try { peer.destroy(); } catch { continue; }
  }
  connectedPeers.clear();

  // parar timers/gossip (si los hubiera)
  stopHeartbeat();
}

async function resumeFromBackground(signaling) {
  if (!isBackground) return;
  isBackground = false;

  // evitar stampede jitter(400, 1500)
  await new Promise(r => setTimeout(r, 400 + Math.random() * 1100));

  // reconectar signaling
  if (signaling && typeof signaling.reconnect === 'function') {
      signaling.reconnect();
  }

  // 🔥 pedir diff desde SV para reconverger atómicamente
  if (lastStateVector) {
    const svBase64 = btoa(String.fromCharCode(...new Uint8Array(lastStateVector)));
    // Send to mesh (assuming connectedPeers handles this, or just wait for peers)
    // The gossip layer should intercept SV_REQUEST
    for (const peer of connectedPeers.values()) {
        if (peer.connected) {
            peer.send(JSON.stringify({ type: 'SV_REQUEST', sv: svBase64 }));
        }
    }
  }

  startHeartbeat();
  startSoftKeepAlive();
}

let audioCtx;
export function startSoftKeepAlive() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    gain.gain.value = 0.0001; // inaudible
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
  } catch {
    return; // Unsupported or blocked
  }
}

export function stopSoftKeepAlive() {
  try { 
      if (audioCtx) {
          audioCtx.close();
          audioCtx = null;
      }
  } catch { return; }
}

function startHeartbeat() {
  if (heartbeat) clearInterval(heartbeat);
  heartbeat = setInterval(() => {
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/ping', Date.now().toString());
    }
  }, 25000);
}

function stopHeartbeat() {
  clearInterval(heartbeat);
  stopSoftKeepAlive();
}
