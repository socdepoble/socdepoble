import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache estàtic (Vite ho injectarà durant la build)
precacheAndRoute(self.__WB_MANIFEST || []);

// API dinàmica amb NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 })
    ]
  })
);

// Assets estàtics amb StaleWhileRevalidate
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

// Imatges amb cache progressiu
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
  })
);

// Background Sync API per events pendents
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sdp-events') {
    event.waitUntil(syncPendingEvents());
  }
});

async function syncPendingEvents() {
  const dbName = 'SOSPStore';
  const storeName = 'events';
  
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const events = await new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });

  for (const event of events) {
    try {
      // Això és un stub de l'enviament real
      console.info('[SW] Sincronitzant event en segon pla:', event.type);
      
      await new Promise((resolve) => {
        const deleteRequest = store.delete(event.id);
        deleteRequest.onsuccess = () => resolve();
      });
      
    } catch (error) {
      console.error('[SW] Error sincronitzant event:', error);
      throw error;
    }
  }

  db.close();
}

// Notificació quan hi ha contingut nou
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});