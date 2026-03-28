import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
// import { Awareness } from 'y-protocols/awareness';

const awarenessDoc = new Y.Doc();

/**
 * Proveïdor P2P NOMÉS per a la presència (Awareness).
 * NO transmet dades CRDT per evitar el by-pass de RLS de Supabase, segons la directiva de DeepSeek.
 */
const provider = new WebrtcProvider('room-awareness', awarenessDoc, {
  signaling: ['wss://tu-signaling-server.com/ws'], // El teu Cloudflare Worker (p2pcf)
  // En l'entorn de producció, WebRTCProvider té funcionalitats no documentades per inhabilitar
  // l'escriptura per defecte, o directament l'ús d'un Document purament sense text.
});

export const awareness = provider.awareness;

// Funció helper per fixar el typing indicator localment a la malla:
export const setLocalTypingState = (currentUser, isTyping) => {
  awareness.setLocalState({
    user: {
      id: currentUser.id,
      name: currentUser.name,
      typing: isTyping,
    }
  });
};
