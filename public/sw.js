/*
 * [SÓC DE POBLE] Service Worker v1.13.0
 * Gestió de Notificacions Push i Bategat en Segon Pla
 */

const CACHE_NAME = 'sp-cache-v1.13.0';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || 'Sóc de Poble';
    const options = {
      body: payload.body || 'Tens una nova actualització al poble.',
      icon: payload.icon || '/favicon.png',
      badge: '/icon-192.png',
      data: payload.data || {},
      vibrate: payload.vibrate || [200, 100, 200],
      actions: payload.actions || [],
      requireInteraction: payload.requireInteraction || false,
      tag: payload.tag || 'general'
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (e) {
    console.error('[SW] Error handling push event:', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (let client of windowClients) {
        if (client.url.includes(new URL(urlToOpen, self.location.origin).pathname) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
