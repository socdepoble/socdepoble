/**
 * SÓC DE POBLE - SERVICE WORKER V1 (PEDRA SECA EDITION)
 * Zero Workbox. Stale-While-Revalidate. VRAM & NAND Protection (FIFO).
 */
const CACHE_CORE = 'sdp-core-v3.1';
const CACHE_API = 'sdp-api-v3.1';
const CACHE_MEDIA = 'sdp-media-v3.1';
const MAX_IMAGES = 60;
const MAX_CORE_ITEMS = 300; // 🛡️ Substituït el pes per quantitat per evitar l'O(N^2) ArrayBuffer crash
const MAX_API_ITEMS = 100;

// 🛡️ Neteja de cache per quantitat per evitar el col·lapse de memòria (Fix d'Emergència)
const cleanupCache = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    const deleteCount = keys.length - maxItems;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
};

// 🛡️ Compressió d'imatges (Vibe Audit)
const compressImage = async (response) => {
  if ('CompressionStream' in window) {
    try {
      const blob = await response.blob();
      const stream = new Blob([blob]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      return new Response(compressedStream, {
        headers: { 'Content-Encoding': 'gzip' }
      });
    } catch (e) {
      return response;
    }
  }
  return response;
};

const CORE_ASSETS = [
  '/', 
  '/index.html'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_CORE)
      .then(c => c.addAll(CORE_ASSETS))
      .catch(err => console.error('SW Install Error:', err))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('sdp-') && k !== CACHE_CORE && k !== CACHE_API && k !== CACHE_MEDIA)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // 1. Imatges amb compressió i límit
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(async (cached) => {
        if (cached) return cached;
        return fetch(e.request).then(async (res) => {
          if (res && res.ok) {
            const compressedRes = await compressImage(res.clone());
            caches.open(CACHE_MEDIA).then(cache => {
              cache.put(e.request, compressedRes);
              cleanupCache(CACHE_MEDIA, MAX_IMAGES); // ~60 imatges
            });
            return res;
          }
          return res;
        });
      }).catch(() => new Response('', { status: 503, statusText: 'Offline' }))
    );
    return;
  }

  // 2. Stale-While-Revalidate per a HTML/API
  if (url.pathname.endsWith('.html') || url.pathname.includes('/api/')) {
    e.respondWith(
      caches.match(e.request).then(async (cached) => {
        const fetchPromise = fetch(e.request).then(async (res) => {
          if (res && res.ok) {
            caches.open(CACHE_API).then(cache => {
              cache.put(e.request, res.clone());
              cleanupCache(CACHE_API, MAX_API_ITEMS);
            });
            return res;
          }
        }).catch(() => {
          if (url.pathname.endsWith('.html')) {
             return new Response('<h1>Sense Connexió</h1>', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/html' } });
          } else {
             return new Response(JSON.stringify({ error: 'offline', cached: true }), { status: 503, headers: { 'Content-Type': 'application/json' } });
          }
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3. Default: Cache First per a la resta
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(async res => {
        if (res && res.ok) {
           caches.open(CACHE_CORE).then(cache => {
             cache.put(e.request, res.clone());
             cleanupCache(CACHE_CORE, MAX_CORE_ITEMS);
           });
        }
        return res;
      }).catch(() => new Response('', { status: 503, statusText: 'Offline' }))
    })
  );
});
