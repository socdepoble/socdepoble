// sw.js — Canvis de fons:
//   1. El precache llista els fitxers REALS de la Forja amb rutes relatives a l'scope.
//      Abans llistava /assets/app.js, /assets/app.css i /manifest.webmanifest, que no
//      existeixen: addAll rebutjava i el SW no s'instal·lava MAI -> zero offline.
//   2. Fix del fallback: `caches.match(req) || caches.match('./index.html')` retornava sempre
//      la primera Promise (una Promise és truthy encara que resolga undefined). Ara s'awaita.
//   3. El trim per bytes (recompte car de tot el cache) només corre sota demanda (TRIM_CACHE);
//      després de cada put només es fa el trim barat per nombre d'entrades.
const VERSION = 'sdp-v16';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './forja_core.js',
  './opfs_provider.js',
  './opfs_worker.js',
  './ylog_format.js',
  './vendor/yjs.mjs'
];

const ASSET_PATHS = new Set(STATIC_ASSETS.map(u => new URL(u, self.location).pathname));

const MAX_RUNTIME_ITEMS = 48;
const MAX_RUNTIME_BYTES = 24 * 1024 * 1024;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS.map(u => new Request(u, { cache: 'reload' })));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isStatic(req) {
  const url = new URL(req.url);
  return req.method === 'GET' && (
    ASSET_PATHS.has(url.pathname) ||
    /\.(css|js|mjs|woff2?|png|jpg|jpeg|webp|avif|svg|ico)$/.test(url.pathname)
  );
}

function cacheable(res) {
  return res && res.ok && res.type !== 'opaque';
}

async function trimCount(name) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_RUNTIME_ITEMS; i++) {
    await cache.delete(keys[i]);
  }
}

async function trimBytes(name) {
  const cache = await caches.open(name);
  let keys = await cache.keys();
  let bytes = 0;
  for (const req of keys) {
    const res = await cache.match(req);
    bytes += Number(res?.headers.get('content-length') || 0);
  }
  while (bytes > MAX_RUNTIME_BYTES && keys.length) {
    const victim = keys.shift();
    const res = await cache.match(victim);
    bytes -= Number(res?.headers.get('content-length') || 0);
    await cache.delete(victim);
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  if (cacheable(res)) {
    const cache = await caches.open(isStatic(req) ? STATIC_CACHE : RUNTIME_CACHE);
    cache.put(req, res.clone()).then(() => trimCount(RUNTIME_CACHE)).catch(() => {});
  }
  return res;
}

async function networkThenCache(req) {
  try {
    const res = await fetch(req);
    if (cacheable(res)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, res.clone()).then(() => trimCount(RUNTIME_CACHE)).catch(() => {});
    }
    return res;
  } catch {
    return (await caches.match(req))
      ?? (await caches.match('./index.html'))
      ?? Response.error();
  }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () =>
      (await caches.match('./index.html')) ?? fetch(req)
    )());
    return;
  }

  if (isStatic(req)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  event.respondWith(networkThenCache(req));
});

self.addEventListener('message', event => {
  const msg = event.data || {};

  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (msg.type === 'TRIM_CACHE') {
    event.waitUntil(Promise.all([
      trimCount(RUNTIME_CACHE),
      trimBytes(RUNTIME_CACHE)
    ]));
    return;
  }

  if (msg.type === 'CRDT_STATUS') {
    event.waitUntil((async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) client.postMessage({
        type: 'CRDT_STATUS_ACK',
        note: 'El Service Worker no gestiona Y.js/OPFS; només assets i senyals.'
      });
    })());
  }
});
