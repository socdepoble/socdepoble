/* sw.js - injectManifest compatible amb vite-plugin-pwa
   Funcions:
   - precache amb ignoreURLParametersMatching per a _v
   - Activation Handshake: ready-to-activate -> espera purged-caches -> clients.claim()
   - Network-first per a navegacions amb fallback a precache
   - Logs estructurats JSON-friendly per diagnosi en dispositius antics
*/

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

const LOG = (...args) => {
  try { console.log(JSON.stringify({ sw: true, payload: args })); } catch (e) { /* no-op */ }
};

const manifestEntries = self.__WB_MANIFEST || [];

// Precache generat per injectManifest; ignore _v per evitar 404 offline
precacheAndRoute(manifestEntries, {
  ignoreURLParametersMatching: [/^_v$/]
});

LOG({ event: 'precache_done', count: manifestEntries.length, ts: Date.now() });

/*
 Activation handshake:
 - Quan s'activa el nou SW, envia 'ready-to-activate' a tots els clients.
 - Cada client ha de purgar caches i respondre amb 'purged-caches'.
 - El SW espera confirmacions fins a ACTIVATION_WAIT_MS i després fa clients.claim().
*/
const pendingActivationConfirmations = new Map();
const ACTIVATION_WAIT_MS = 5000;

self.addEventListener('install', (event) => {
  LOG({ event: 'install', phase: 'start', ts: Date.now() });
  // Forcem que el SW arribe a installed
  // Eliminar self.skipWaiting() ací perquè ho controle PwaUpdater manualment
  event.waitUntil((async () => {
    LOG({ event: 'install', phase: 'done', ts: Date.now() });
  })());
});

self.addEventListener('activate', (event) => {
  LOG({ event: 'activate', phase: 'start', ts: Date.now() });
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ includeUncontrolled: true });
    const clientIds = clientsList.map(c => c.id);
    LOG({ event: 'activate', phase: 'announce_ready', clients: clientIds, ts: Date.now() });

    // Preparem promeses per cada client
    const confirmations = clientIds.map(clientId => {
      return new Promise((resolve) => {
        pendingActivationConfirmations.set(clientId, { resolved: false, resolve });
      });
    });

    // Enviem missatge a tots els clients
    for (const client of clientsList) {
      try {
        client.postMessage({ type: 'ready-to-activate', ts: Date.now() });
      } catch (e) {
        LOG({ event: 'activate', phase: 'postMessage_error', clientId: client.id, error: String(e) });
      }
    }

    // Esperem confirmacions o timeout
    await Promise.race([
      Promise.all(confirmations),
      new Promise(res => setTimeout(res, ACTIVATION_WAIT_MS))
    ]);

    // Netegem i prenem control
    pendingActivationConfirmations.clear();
    try {
      await self.clients.claim();
      LOG({ event: 'activate', phase: 'claimed', ts: Date.now() });
    } catch (e) {
      LOG({ event: 'activate', phase: 'claim_error', error: String(e), ts: Date.now() });
    }
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  const clientId = event.source && event.source.id;
  LOG({ event: 'message_received', data, clientId, ts: Date.now() });

  if (data && data.type === 'purged-caches' && clientId) {
    const entry = pendingActivationConfirmations.get(clientId);
    if (entry && !entry.resolved) {
      entry.resolved = true;
      entry.resolve(true);
      LOG({ event: 'purged_caches_ack', clientId, ts: Date.now() });
    }
  }

  if (data && data.type === 'SKIP_WAITING') {
    LOG({ event: 'skip_waiting_requested', clientId, ts: Date.now() });
    self.skipWaiting();
  }
});

// NavigationRoute amb Network-first manual (fetch) i fallback a precache index.html
registerRoute(
  new NavigationRoute(async ({ request }) => {
    const url = new URL(request.url);
    LOG({ event: 'navigation_request', url: url.href, ts: Date.now() });

    try {
      const networkResponse = await fetch(request);
      LOG({ event: 'navigation_network_success', url: url.href, status: networkResponse.status, ts: Date.now() });
      return networkResponse;
    } catch (err) {
      LOG({ event: 'navigation_network_failed', url: url.href, error: String(err), ts: Date.now() });
      const cache = await caches.open('workbox-precache');
      // Precache ignora _v, així que podem buscar index.html directament
      const precached = await cache.match('/index.html');
      if (precached) {
        LOG({ event: 'navigation_served_precache', url: url.href, ts: Date.now() });
        return precached;
      }
      LOG({ event: 'navigation_no_fallback', url: url.href, ts: Date.now() });
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })
);

// ... (altres rutes) ...

// Recursos estàtics amb CacheFirst per rendiment
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  new CacheFirst({ cacheName: 'static-resources' })
);

// [BUGFIX FIREFOX WASM] Excepció per a Web Workers i WASM.
// Firefox bloca agressivament els Web Workers servits des de la Cache del SW.
registerRoute(
  ({ request, url }) => request.destination === 'worker' || url.pathname.endsWith('.wasm') || url.pathname.includes('.worker'),
  new NetworkFirst({ 
    cacheName: 'wasm-worker-cache',
    plugins: [{
      cacheWillUpdate: async ({ response }) => {
        if (response && response.status === 200) {
          // Assegurem que tinga el MIME type correcte si el necessitem (opcional)
          return response;
        }
        return null;
      }
    }]
  })
);

// Log de navegacions per diagnosi addicional
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    LOG({ event: 'fetch_navigate', url: event.request.url, ts: Date.now() });
  }
});
