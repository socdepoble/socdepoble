// src/App.jsx
import React, { useEffect, useState, useRef } from 'react';
import PwaUpdater from './components/PwaUpdater';
import { useSeoTrellat } from './hooks/useSeoTrellat';
import VisorNano from './components/core/VisorNano';

/*
  App.jsx - registre robust del Service Worker i integració de PwaUpdater
  - Registra /sw.js si el navegador ho suporta
  - Manté l'objecte registration per passar-lo a PwaUpdater
  - Proporciona un control manual "Comprovar actualitzacions"
  - Mostra la versió del servidor (X-App-Version) per diagnosi
  - Logueja missatges rellevants per facilitar la investigació en dispositius antics
  - Tot en valencià i amb fallbacks per navegadors sense SW
*/

function useServiceWorkerRegistration() {
  const [registration, setRegistration] = useState(null);
  const [swSupported, setSwSupported] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if ('serviceWorker' in navigator) {
      setSwSupported(true);

      // Registre inicial i listeners
      const register = async () => {
        try {
          // Registra el SW; si ja està registrat, getRegistration retorna l'objecte
          const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          if (!mountedRef.current) return;
          setRegistration(reg);

          console.info('[App] Service Worker registrat', reg);

          // Observem updatefound per actualitzar l'estat local quan hi ha un installing worker
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            console.info('[App] updatefound, nou worker:', newWorker && newWorker.state);
            // Podem escoltar statechange si volem més detalls
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.info('[App] worker statechange:', newWorker.state);
              });
            }
          });

          // Si ja hi ha un waiting worker, actualitzem l'estat perquè PwaUpdater mostre la UI
          if (reg.waiting) {
            console.info('[App] Hi ha un worker en waiting');
            setRegistration(reg); // ja està, però assegurem re-render
          }
        } catch (err) {
          console.error('[App] Error registrant Service Worker', err);
        }
      };

      // Intentem obtenir una registració existent primer (millora per a reloads)
      navigator.serviceWorker.getRegistration().then((existing) => {
        if (existing) {
          setRegistration(existing);
          console.info('[App] Registració existent trobada', existing);
        } else {
          register();
        }
      }).catch((e) => {
        console.warn('[App] getRegistration fallida', e);
        register();
      });

      // Global message listener per missatges del SW (handshake, logs, etc.)
      const onMessage = (ev) => {
        const data = ev.data || {};
        setLastMessage(data);
        console.info('[App] Missatge del SW:', data);
      };
      navigator.serviceWorker.addEventListener('message', onMessage);

      // controllerchange per detectar quan el nou SW pren control
      const onControllerChange = () => {
        console.info('[App] controllerchange detectat. El nou SW ha pres control.');
      };
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      return () => {
        mountedRef.current = false;
        try {
          navigator.serviceWorker.removeEventListener('message', onMessage);
          navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        } catch (e) { /* no-op */ }
      };
    } else {
      setSwSupported(false);
      console.warn('[App] Service Workers no són suportats en aquest navegador');
    }

    return () => { mountedRef.current = false; };
  }, []);

  return { registration, swSupported, lastMessage, setRegistration };
}

export default function App() {
  const { registration, swSupported, lastMessage, setRegistration } = useServiceWorkerRegistration();
  const [serverVersion, setServerVersion] = useState(null);
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Injecció de SEO base de l'aplicació
  useSeoTrellat({
    titol: 'Inici',
    descripcio: 'Xarxa social rural i sobirana',
    urlCanonica: '/',
  });

  // Llegir X-App-Version del servidor per diagnosi; no bloqueja la UI
  useEffect(() => {
    let mounted = true;
    const fetchVersion = async () => {
      try {
        const resp = await fetch('/', { cache: 'no-store' });
        if (!mounted) return;
        const ver = resp.headers.get('x-app-version') || null;
        setServerVersion(ver);
      } catch (e) {
        console.warn('[App] No s\'ha pogut llegir X-App-Version', e);
      }
    };
    fetchVersion();
    const id = setInterval(fetchVersion, 60_000); // refresca cada minut per diagnosi contínua
    return () => { mounted = false; clearInterval(id); };
  }, []);

  // Observador per detectar waiting worker i marcar updateAvailable
  useEffect(() => {
    if (!registration) return;
    const onUpdateFound = () => {
      if (registration.waiting) {
        setUpdateAvailable(true);
      }
    };
    registration.addEventListener('updatefound', onUpdateFound);

    // També comprovem a l'inici
    if (registration.waiting) setUpdateAvailable(true);

    return () => {
      try { registration.removeEventListener('updatefound', onUpdateFound); } catch (e) {}
    };
  }, [registration]);

  // Funció per forçar comprovació d'actualitzacions (manual)
  const checkForUpdates = async () => {
    if (!swSupported) return;
    setChecking(true);
    try {
      // Si tenim registration, demanem update()
      if (registration) {
        await registration.update();
        // Re-obtenim la registració per reflectir canvis
        const fresh = await navigator.serviceWorker.getRegistration();
        setRegistration(fresh);
        if (fresh && fresh.waiting) setUpdateAvailable(true);
      } else {
        // Intentem registrar si no hi ha registration
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        setRegistration(reg);
      }
    } catch (e) {
      console.error('[App] Error comprovant actualitzacions', e);
    } finally {
      setChecking(false);
    }
  };

  // UI neta i informativa
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', lineHeight: 1.4 }}>
      <header style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18 }}>Socdepoble</h1>
          <div style={{ fontSize: 12, color: '#666' }}>Xarxa social rural i sobirana</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={checkForUpdates}
            disabled={!swSupported || checking}
            style={{
              padding: '8px 12px',
              background: '#0b74de',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: swSupported ? 'pointer' : 'not-allowed'
            }}
            title={swSupported ? 'Comprovar actualitzacions del Service Worker' : 'Service Worker no suportat'}
          >
            {checking ? 'Comprovant...' : 'Comprovar actualitzacions'}
          </button>

          <div style={{ textAlign: 'right', fontSize: 12, color: '#444' }}>
            <div><strong>SW:</strong> {swSupported ? 'suportat' : 'no suportat'}</div>
            <div><strong>Versió servidor:</strong> {serverVersion ?? 'desconeguda'}</div>
          </div>
        </div>
      </header>

      <main style={{ padding: 16 }}>
        {/* Contingut principal de l'aplicació */}
        <section>
          <h2 style={{ marginTop: 0 }}>Benvingut</h2>
          <p>Esta aplicació està preparada per a actualitzacions immediates amb un handshake segur entre client i Service Worker.</p>
        </section>

        {/* Mostrem missatges recents del SW per a diagnosi ràpida */}
        <section style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Logs recents del Service Worker</h3>
          <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 6, maxHeight: 160, overflow: 'auto' }}>
            {lastMessage ? JSON.stringify(lastMessage, null, 2) : 'Cap missatge rebut del Service Worker encara.'}
          </pre>
        </section>
      </main>

      {/* Muntatge del PwaUpdater: li passem la registration perquè gestione waiting worker i l'handshake */}
      <PwaUpdater registration={registration} />
      <VisorNano />

      <footer style={{ padding: 12, borderTop: '1px solid #eee', fontSize: 12, color: '#666', textAlign: 'center' }}>
        <div>Consell de la Petorreta · Arquitectura local-first</div>
      </footer>
    </div>
  );
}
