import { connectedPeers } from './rhizomeManager.js';
import { signalingSocket } from './signalingClient.js';

let trellatWakeLock = null;

// 1. ESCUDO WAKELOCK: Invocar ANTES de iniciar el Tsunami Slicer
export const acquireTrellatWakeLock = async () => {
  if ('wakeLock' in navigator && !trellatWakeLock && document.visibilityState === 'visible') {
    try {
      trellatWakeLock = await navigator.wakeLock.request('screen');
      console.log("🛡️ [TRELLAT] Llum al Mas: WakeLock actiu. Retenint pantalla per processar dades.");
    } catch { return; /* Batería baja o SO restrictivo, ignoramos elegantemente */ }
  }
};

export const releaseTrellatWakeLock = () => {
  if (trellatWakeLock) { 
    trellatWakeLock.release().catch(() => {}); 
    trellatWakeLock = null; 
  }
};

// 2. RESURRECCIÓN (El Bategat d'iOS): Reconstruir la plaza al encender la pantalla
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log("☀️ [TRELLAT] Tornant del tros. Purgant zombis i ressuscitant connexions...");
    
    // Purga atómica de cadáveres: iOS deja sockets WebRTC en estado "closing" fantasma
    for (const [peerId, peer] of connectedPeers.entries()) {
      if (peer.destroyed || !peer.connected || peer._channel?.readyState !== 'open') {
        peer.destroy();
        connectedPeers.delete(peerId);
      }
    }

    // Reconexión agresiva al Nodo Zero para gatillar el Peer Exchange (PEX)
    if (!signalingSocket.connected) {
      signalingSocket.connect();
    } else {
      // Re-emitimos presencia para que los Padrins nos enruten de nuevo
      signalingSocket.emit('REJOIN_PLAZA', { role: window.TRELLAT_ROLE });
    }
  } else {
    // Si bloquean la pantalla a mano, liberamos el lock inmediatamente para salvar batería
    releaseTrellatWakeLock();
  }
});
