import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { TrellatWebTransport } from '../utils/syncTransport';
import { Auth } from '@supabase/auth-ui-react'; // Example, shouldn't be strictly needed.

/**
 * Hybrid Sync Provider para Sóc de Poble.
 * Prioriza WebTransport (HTTP/3), con WebRTC (P2P) como fallback rural 
 * y guardado estricto en IndexedDB.
 */
export class HybridSyncProvider {
  constructor(roomName, ydoc) {
    this.roomName = roomName;
    this.ydoc = ydoc;

    // 1. Capa Local (IndexedDB) con durabilidad estricta offline
    this.indexeddbProvider = new IndexeddbPersistence(roomName, ydoc);
    
    // 2. Capa Primaria de Transporte: WebTransport (HTTP/3 QUIC)
    // El puerto 4433 es el estándar HTTP/3
    const wtUrl = import.meta.env.VITE_WEBTRANSPORT_URL || 'https://socdepoble.org:4433';
    this.wtProvider = new TrellatWebTransport(wtUrl, ydoc);

    // 3. Fallback P2P puro para redes mesh o sin internet a exterior
    this.webrtcProvider = new WebrtcProvider(roomName, ydoc, {
      signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com'],
      password: null,
      awareness: null,
      maxConns: 20,
      filterBcConns: true,
      peerOpts: {}
    });

    this.indexeddbProvider.on('synced', () => {
      console.log(`[IndexedDB Sync] Documento ${roomName} cargado localmente.`);
    });
  }

  destroy() {
    this.wtProvider.destroy();
    this.webrtcProvider.destroy();
    this.indexeddbProvider.destroy();
  }
}
