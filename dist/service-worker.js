// Versió mínima per Safari iOS (sense fantasies modernes)
const CACHE_NAME = 'sdp-v1'

// Recursos essencials (GENÈTICA)
const CORE = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css'
]

// Instal·lació
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE))
  )
})

// Activació (neteja versions antigues)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  )
})

// Estratègia: cache-first, network-fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, res.clone())
          return res
        })
      }).catch(() => cached)
    })
  )
})
