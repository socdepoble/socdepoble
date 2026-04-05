// public/sw.js - Escut Trellat iPad A10
const CACHE_TRELAT = 'trellat-v15.3';
const POBLE_ASSETS = [
  '/', '/index.css', '/app.js', '/p2p-worker.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_TRELAT).then(cache => 
      cache.addAll(POBLE_ASSETS)
    )
  );
  // Persistència forçada iOS
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist();
  }
});

// Cache-first + P2P fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;
      
      return fetch(e.request).catch(async () => {
        // Offline fallback
        const offlinePage = await caches.match('/offline-poble.html');
        return offlinePage || new Response("<div style='padding:2rem;font-family:sans-serif;'><h2>Sóc de Poble (Offline)</h2><p>Estàs sense connexió. Torna a intentar-ho panxa amunt.</p></div>", { 
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      });
    })
  );
});

// Background P2P sync
self.addEventListener('sync', (e) => {
  if (e.tag === 'p2p-sync') {
    e.waitUntil(syncP2PBancal());
  }
});

async function syncP2PBancal() {
  // Circuit breaker: max 50 pactes
  const pending = await getPendingPactes();
  if (pending.length > 50) return;
  
  requestIdleCallback(async () => {
    await postMessageToMain({ type: 'sync-batch', data: pending.slice(0, 32) });
  }, { timeout: 5000 });
}
