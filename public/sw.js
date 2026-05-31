// public/sw.js - Escut Trellat iPad A10 (Netejat V15.4)
const CACHE_TRELAT = 'trellat-v15.5'; // Bump version just in case
const POBLE_ASSETS = [
  '/', 
  '/index.css',
  '/assets/master/logo-socdepoble-rect-negre.svg',
  '/assets/master/logo-socdepoble-rect-blanc.svg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
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

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_TRELAT) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Stale-while-revalidate + P2P fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  
  // EXCEPCIÓN LETAL AL FANTASMA: No interponerse en la carga del libro maestro.
  // Dejamos que IndexedDB controle el Offline-First.
  if (url.pathname.includes('/llibres/llibre-humans.html') || url.pathname.includes('/llibres/llibre-maquina.html')) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.open(CACHE_TRELAT).then(cache => {
      return cache.match(e.request).then(cachedResponse => {
        const fetchPromise = fetch(e.request).then(networkResponse => {
          if (e.request.url.startsWith('http') && networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(async () => {
          // Offline fallback
          const offlinePage = await caches.match('/offline-poble.html');
          const fallbackHtml = `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sóc de Poble (Offline)</title>
  <style>
    body { margin: 0; padding: 2rem; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: system-ui, -apple-system, sans-serif; background-color: #f3f4f6; color: #111827; }
    @media (prefers-color-scheme: dark) { body { background-color: #111827; color: #f9fafb; } }
    .card { background: rgba(255, 255, 255, 0.1); padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 100%; box-sizing: border-box; }
    @media (prefers-color-scheme: dark) { .card { border: 1px solid rgba(255,255,255,0.1); } }
    .logo { max-width: 200px; height: auto; margin-bottom: 1.5rem; }
    h2 { margin: 0 0 1rem; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.025em; }
    p { margin: 0 0 1.5rem; opacity: 0.8; line-height: 1.5; }
    .btn { display: inline-block; background-color: #F97316; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: bold; transition: opacity 0.2s; border: none; font-size: 1rem; cursor: pointer; }
    .btn:active { opacity: 0.8; transform: scale(0.95); }
    .dark-logo { display: none; }
    @media (prefers-color-scheme: dark) { .dark-logo { display: block; } .light-logo { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <img src="/assets/master/logo-socdepoble-rect-negre.svg" class="logo light-logo" alt="Sóc de Poble" onerror="this.style.display='none'">
    <img src="/assets/master/logo-socdepoble-rect-blanc.svg" class="logo dark-logo" alt="Sóc de Poble" onerror="this.style.display='none'">
    <h2>Mode Desconnectat</h2>
    <p>Sense connexió al món exterior. L'escut Trellat està actiu i ha retingut la informació local.</p>
    <button class="btn" onclick="window.location.reload()">Reintentar Connexió</button>
  </div>
</body>
</html>`;
          return offlinePage || new Response(fallbackHtml, { 
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        });
        
        // Devolvemos el caché si existe, pero el fetch sigue en segundo plano actualizando el caché
        return cachedResponse || fetchPromise;
      });
    })
  );
});
