// public/sw.js - Escut Trellat iPad A10 (Netejat V15.4)
const CACHE_TRELAT = 'trellat-v15.5'; // Bump version just in case
const POBLE_ASSETS = [
  '/', '/index.css'
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

// Cache-first + P2P fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;
      
      return fetch(e.request).catch(async () => {
        // Offline fallback
        const offlinePage = await caches.match('/offline-poble.html');
        return offlinePage || new Response("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Sóc de Poble (Offline)</title></head><body style='padding:2rem;font-family:sans-serif;'><h2>Sóc de Poble (Offline)</h2><p>Estàs sense connexió. Torna a intentar-ho panxa amunt.</p></body></html>", { 
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      });
    })
  );
});
