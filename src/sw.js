/* eslint-env serviceworker */
/* global clients */
import { precacheAndRoute } from 'workbox-precaching';

// Precaché automatically injected by VitePWA builder
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle scheduling medication alarms via message
  if (event.data && event.data.type === 'SCHEDULE_MEDICATION') {
    const { title, body, timestamp, meds } = event.data.payload;
    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: '/android-chrome-192x192.png',
          badge: '/android-chrome-192x192.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          requireInteraction: true,
          data: { url: '/medication-confirm', meds },
          actions: [
            {
              action: 'confirm',
              title: 'JA L\'HE PRESA'
            },
            {
              action: 'snooze',
              title: 'AJORNA 10 MIN'
            }
          ]
        });
      }, delay);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  if (event.action === 'confirm') {
    // Navigate with a specific action query param
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url.includes('/medication-confirm')) {
            matchingClient = windowClient;
            break;
          }
        }
        if (matchingClient) {
          return matchingClient.focus().then(() => matchingClient.navigate(urlToOpen + '?action=confirm'));
        } else {
          return clients.openWindow(urlToOpen + '?action=confirm');
        }
      })
    );
  } else if (event.action === 'snooze') {
    // Just a placeholder, snooze will rely on SW getting message or local IDB handling later
    // Could send a message to clients
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        windowClients.forEach((client) => {
          client.postMessage({ type: 'SNOOZE_MEDICATION', payload: event.notification.data });
        });
      })
    );
  } else {
    // Normal tap on notification
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }
        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
