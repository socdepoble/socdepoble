// [BATEGAT NUCLEAR PURGE]
// Aquest Service Worker actua com anticossos. Sobreescriu qualsevol SW zombi previ,
// rebenta totes les caches i s'auto-aniquila. Usat explícitament per purgar localhost.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[DEV PURGE] Esborrant memòria cau:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[DEV PURGE] Totes les memòries de Workbox netejades. Suïcidant SW...');
      return self.registration.unregister();
    })
  );
});
