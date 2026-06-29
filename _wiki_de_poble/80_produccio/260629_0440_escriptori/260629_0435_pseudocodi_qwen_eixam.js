// Pseudocodi extret de l'auditoria de Qwen (en nom de L'Eixam Sencer, Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// 1. PERPLEXITY: Protocol "Quiesce" / Swap Atòmic (Punt 8)
import { set, get } from 'idb-keyval';

export const QuiesceProtocol = {
  _isQuiesced: false,
  _pendingDeltas: [],

  async enterQuiesce() {
    this._isQuiesced = true;
    this._pendingDeltas = [];
    await set('SDP_QUIESCE_STATE', true);
    console.log('[QUiesce] Estat congelat. WebRTC en pausa.');
  },

  async queueDelta(delta) {
    if (this._isQuiesced) {
      this._pendingDeltas.push(delta);
      return; 
    }
    await window.__YJS_PROVIDER__.sendDelta(delta);
  },

  async exitQuiesce() {
    this._isQuiesced = false;
    await set('SDP_QUIESCE_STATE', false);
    
    for (const delta of this._pendingDeltas) {
      await window.__YJS_PROVIDER__.sendDelta(delta);
    }
    this._pendingDeltas = [];
    console.log('[QUiesce] Estat alliberat. Cua buidada.');
  }
};

// 2. VIBE: Timeouts Anti-Deadlock del SOSP_LOCK (Punt 11)
export function withTimeout(promise, ms = 10000, fallbackMsg = 'Temps esgotat') {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`[TIMEOUT] ${fallbackMsg}`)), ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ]);
}

// 3. KIMI: Mutex Global del Bancal Budget Manager (Punt 15)
export class BancalMutex {
  constructor() {
    this._locks = new Map();
  }

  async acquire(resource, timeout = 5000) {
    const start = Date.now();
    while (this._locks.has(resource)) {
      if (Date.now() - start > timeout) {
        throw new Error(`[MUTEX] Recurs '${resource}' ocupat. Timeout superat.`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    this._locks.set(resource, true);
    return true;
  }

  release(resource) {
    this._locks.delete(resource);
  }
}
export const bancalMutex = new BancalMutex();

// 4. GEMINI: Comptador de Supervivència iOS 15 (Punt 9 Corregit)
export async function checkIOSSurvival() {
  const lastOpened = await get('SDP_LAST_OPENED') || Date.now();
  const daysPassed = Math.floor((Date.now() - lastOpened) / (1000 * 60 * 60 * 24));
  
  await set('SDP_LAST_OPENED', Date.now());

  if (daysPassed >= 20) {
    const event = new CustomEvent('sdp-avisador-efimer', {
      detail: {
        tipus: 'SUPERVIVENCIA',
        missatge: `Fa ${daysPassed} dies que no obrim el Mas. Apple esborrarà tot en 10 dies. Fes una còpia o sincronitza ara.`,
        persistencia: true
      }
    });
    window.dispatchEvent(event);
  }
}


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
