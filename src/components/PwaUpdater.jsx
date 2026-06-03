// PwaUpdater.jsx
// Component React en valencià que gestiona l'actualització:
// - Detecta waiting worker
// - Inicia handshake: SKIP_WAITING -> espera ready-to-activate -> purga caches -> envia purged-caches -> respir 2000ms -> Hard Navigation Nuclear
import React, { useEffect, useState, useRef } from 'react';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default function PwaUpdater({ registration }) {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | ready | activating | error
  const controllerChangeHandled = useRef(false);

  useEffect(() => {
    if (!registration) return;

    if (registration.waiting) {
      setWaitingWorker(registration.waiting);
      setStatus('ready');
    }

    const onUpdateFound = () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && registration.waiting) {
          setWaitingWorker(registration.waiting);
          setStatus('ready');
        }
      });
    };

    registration.addEventListener('updatefound', onUpdateFound);
    return () => {
      try { registration.removeEventListener('updatefound', onUpdateFound); } catch (e) { /* no-op */ }
    };
  }, [registration]);

  useEffect(() => {
    const onControllerChange = () => {
      if (controllerChangeHandled.current) return;
      controllerChangeHandled.current = true;
      setStatus('activating');
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  const purgeClientCaches = async () => {
    try {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        // Conservar workbox-precache per garantir App Shell offline mínim
        if (name === 'workbox-precache') continue;
        await caches.delete(name);
      }
      // Nota: si feu servir IndexedDB/OPFS, afegiu aquí la neteja específica
      return true;
    } catch (e) {
      console.error('Error purgant caches', e);
      return false;
    }
  };

  const onUpdateNow = async () => {
    if (!waitingWorker) return;
    setStatus('activating');

    try {
      // 1) Demanem al SW que skipWaiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      // 2) Esperem ready-to-activate del SW (timeout per evitar bloqueig)
      const readyPromise = new Promise((resolve, reject) => {
        const onMessage = (ev) => {
          const data = ev.data || {};
          if (data && data.type === 'ready-to-activate') {
            navigator.serviceWorker.removeEventListener('message', onMessage);
            resolve(data);
          }
        };
        const timeout = setTimeout(() => {
          navigator.serviceWorker.removeEventListener('message', onMessage);
          reject(new Error('timeout_ready_to_activate'));
        }, 5000);
        navigator.serviceWorker.addEventListener('message', onMessage);
      });

      await readyPromise;

      // 3) Purga caches locals
      const purged = await purgeClientCaches();

      // 4) Informem al SW que hem purgat
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'purged-caches', ts: Date.now() });
      }

      // 5) Respir per WebKit (2000ms) per alliberar memòria i evitar errors de claim
      await sleep(2000);

      // 6) Hard Navigation Nuclear: forcem nova navegació amb parametre _v únic
      const base = window.location.href.split('?')[0];
      window.location.href = base + '?_v=' + Date.now();
    } catch (err) {
      console.error('Error en procés d\'actualització', err);
      setStatus('error');
      // Fallback: intentar igualment la navegació forçada
      try {
        const base = window.location.href.split('?')[0];
        window.location.href = base + '?_v=' + Date.now();
      } catch (e) {
        console.error('Fallback reload failed', e);
      }
    }
  };

  if (status === 'idle') return null;

  return (
    <div aria-live="polite" style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 9999 }}>
      {status === 'ready' && (
        <div style={{ background: '#ffcc00', padding: 12, borderRadius: 6 }}>
          <div style={{ fontWeight: 700 }}>Nova versió disponible</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={onUpdateNow} style={{ padding: '8px 12px' }}>Actualitzar ara</button>
          </div>
        </div>
      )}
      {status === 'activating' && (
        <div style={{ background: '#00aaff', padding: 12, borderRadius: 6, color: '#fff' }}>
          Activant nova versió...
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: '#ff4444', padding: 12, borderRadius: 6, color: '#fff' }}>
          Error actualitzant. Prova a tancar la pestanya i obrir de nou.
        </div>
      )}
    </div>
  );
}
