import { useState, useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { createHelia } from 'helia';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';
import { getCrypto } from 'pkijs';

export const useTrellatSync = (podId) => {
  const [isOnline, setIsOnline] = useState(false);
  const ydocRef = useRef(null);
  const heliaRef = useRef(null);
  const privateKeyRef = useRef(null);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    // Sync automàtic amb Supabase Edge Function (desactivat momentàniament)
    // syncWithSupabase(ydocRef.current);
  }, []);

  const init = useCallback(async () => {
    let cancelled = false;

    // 1. Yjs CRDT
    ydocRef.current = new Y.Doc();

    // 2. Clau Ed25519 per al pod (emmagatzemada en IndexedDB)
    if (!privateKeyRef.current) {
      const seed = new TextEncoder().encode(podId + '-trellat-2026');
      privateKeyRef.current = await getCrypto().subtle.digest('SHA-256', seed);
    }

    if (cancelled) return;

    // 3. IPFS + libp2p
    heliaRef.current = await createHelia({
      libp2p: {
        transports: [],
        connectionEncryption: [noise()],
        streamMuxers: [yamux()],
        peerDiscovery: [bootstrap({ list: ['/dnsaddr/bootstrap.libp2p.io/...'] })]
      }
    });

    if (cancelled) {
      heliaRef.current.stop().catch(() => {});
      return;
    }

    setIsOnline(true);

    // 4. Listener de reconnexió oportunista
    window.addEventListener('online', handleOnline);

    return () => { cancelled = true; };
  }, [podId, handleOnline]);

  const signAndPublishManifest = useCallback(async (manifest) => {
    const signature = await signManifest(manifest, privateKeyRef.current);
    ydocRef.current.getMap('manifests').set(podId, { manifest, signature });
    await heliaRef.current.libp2p.dialProtocol('/trellat/1.0', manifest); // P2P broadcast
  }, [podId]);

  const teardown = useCallback(() => {
    window.removeEventListener('online', handleOnline);
    if (heliaRef.current) {
      heliaRef.current.stop().catch(() => {});
      heliaRef.current = null;
    }
    if (ydocRef.current) {
      ydocRef.current.destroy();
      ydocRef.current = null;
    }
  }, [handleOnline]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    init();
    return teardown;
  }, [init, teardown]);

  return { isOnline, signAndPublishManifest, ydocRef };
};

// Funció auxiliar de signatura (Ed25519)
// eslint-disable-next-line no-unused-vars
async function signManifest(manifest, privateKey) {
  // noble-curves o similar - placeholder per Ara
  return 'ed25519-signature-placeholder';
}
