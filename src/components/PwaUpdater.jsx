// PwaUpdater.jsx
// Component React en valencià que gestiona l'actualització de forma ESPARTANA:
// - Detecta waiting worker
// - Botó de forçar actualització: envia SKIP_WAITING i recarrega immediatament (Hard Navigation).
import React, { useEffect, useState } from 'react';
export default function PwaUpdater({
  registration
}) {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | ready | activating

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
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setWaitingWorker(newWorker);
          setStatus('ready');
        }
      });
    };
    registration.addEventListener('updatefound', onUpdateFound);
    return () => {
      try {
        registration.removeEventListener('updatefound', onUpdateFound);
      } catch (e) {/* no-op */}
    };
  }, [registration]);
  const onUpdateNow = () => {
    if (!waitingWorker) return;
    setStatus('activating');

    // 1) Demanem al SW que salte l'espera de forma immediata
    waitingWorker.postMessage({
      type: 'SKIP_WAITING'
    });

    // 2) Hard Navigation Nuclear: trenquem la cau del navegador de forma determinista
    const base = window.location.href.split('?')[0];
    window.location.href = base + '?_v=' + Date.now();
  };
  if (status === 'idle') return null;
  return <div aria-live="polite" style={{
    position: 'fixed',
    bottom: 12,
    right: 12,
    zIndex: 9999
  }}>
      {status === 'ready' && <div style={{
      background: '#ffcc00',
      padding: 12,
      borderRadius: 6
    }}>
          <div style={{
        fontWeight: 700
      }}>Nova versió disponible</div>
          <div style={{
        marginTop: 8
      }}>
            <button onClick={onUpdateNow} style={{
          padding: '8px 12px'
        }}>Actualitzar ara</button>
          </div>
        </div>}
      {status === 'activating' && <div style={{
      background: '#00aaff',
      padding: 12,
      borderRadius: 6,
      color: '#fff'
    }}>
          Activant nova versió...
        </div>}
    </div>;
}