// public/sw.js – GROQ TURBO RURAL V10.37
const CACHE_NAME = 'soc-de-poble-v10.37';
const PRECACHE_URLS = [
  '/assets/llibre-sencer.html',
  '/manifest.json',
  '/favicon.png',
  // Añade aquí otros assets críticos si quieres
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Silenciat: console.log('[SW Groq] Precaching rural...');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting(); // Activación inmediata
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim().then(() => {
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    });
  });
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. RUTA CRÍTICA: /gemini-proxy → Network-First (nunca cacheamos IA dinámica)
  if (url.pathname.includes('/gemini-proxy') || url.pathname.includes('/functions/v1/gemini-proxy')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si todo OK, opcionalmente cacheamos la respuesta para ultra-fast retry en rural
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback offline rural: devolvemos un mensaje amable + libro cacheado
          return caches.match('/assets/llibre-sencer.html').then((cachedBook) => {
            if (cachedBook) {
              return new Response(
                `<h1>🌾 Sense connexió al poble</h1><p>El proxy de IA no respon ara mateix, però tens el Llibre Sencer complet guardat localment.</p><div style="margin-top:20px;">${cachedBook.text ? 'Carregant llibre...' : ''}</div>`,
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            return new Response('🌾 Sense connexió al proxy.', { status: 503, statusText: 'Offline' });
          });
        })
    );
    return;
  }

  // 2. ASSETS ESTÁTICOS + PÁGINAS → Stale-While-Revalidate (máxima velocidad percibida)
  if (event.request.destination === 'document' ||
      event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return new Response('', { status: 503, statusText: 'Offline' });
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. TODO LO DEMÁS → Network-First con fallback cache
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request).then(res => {
        return res || new Response('', { status: 503, statusText: 'Offline' });
      }))
  );
});
