const CACHE_VERSION = 'Vitamin-1.5.6-BATEGA-MASTER-v1';
const CACHE_NAME = `socdepoble-${CACHE_VERSION}`;
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.png',
    '/splash_screen.png'
];

self.addEventListener('install', (event) => {
    // console.log('[SW-PURGATORI-ACTIU] Iniciant bategat de resiliència...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // console.log('[SW] Protegint actius estàtics...');
            for (const asset of STATIC_ASSETS) {
                try {
                    await cache.add(asset);
                    // console.log(`[SW-Cura] Actiu guardat: ${asset}`);
                } catch (err) {
                    // console.warn(`[SW-Alerta] No s'ha pogut guardar ${asset}. El bategat continua.`, err);
                }
            }
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    // console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        // console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    if (event.request.method !== 'GET') {
        return;
    }
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const responseClone = response.clone();
                if (response.status === 200 && event.request.method === 'GET' && response.type === 'basic') {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

self.addEventListener('push', (event) => {
    // console.log('[SW] Push notification received');
    let notificationData = {
        title: 'Sóc de Poble',
        body: 'Tens un missatge nou',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'default',
        requireInteraction: false
    };
    if (event.data) {
        try {
            const data = event.data.json();
            const isRepair = data.type === 'system-repair';
            const isIAIA = data.is_iaia || data.type === 'iaia-chat';
            const iaiaAvatar = '/images/demo/avatar_woman_old.png';
            notificationData = {
                title: data.title || (isRepair ? '🛠️ AUTO-CURA EN CURS...' : (isIAIA ? '👵 La teua IAIA et diu...' : notificationData.title)),
                body: data.body || data.message || (isRepair ? 'La IAIA està plegt la xarxa per arreglar un problema. Reiniciant...' : notificationData.body),
                icon: data.icon || (isIAIA ? iaiaAvatar : notificationData.icon),
                badge: data.badge || notificationData.badge,
                image: data.image || null,
                tag: data.tag || (isRepair ? 'system-repair' : (isIAIA ? 'iaia-chat' : 'general')),
                data: { ...data, isIAIA, isRepair },
                requireInteraction: isIAIA || isRepair,
                actions: data.actions || [],
                vibrate: data.vibrate || (isRepair ? [500, 100, 500, 100, 500] : (isIAIA ? [100, 50, 100, 400, 100, 50, 100] : [200, 100, 200]))
            };
            if (isRepair) {
                // console.log('[SW-Repair] Critical Command Received. Purging caches...');
                event.waitUntil(
                    caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
                        .then(() => {
                            // console.log('[SW-Repair] Caches purged. Triggering update...');
                            return self.registration.update();
                        })
                );
            }
        } catch (e) {
            // console.error('[SW] Error parsing push data:', e);
        }
    }
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

self.addEventListener('notificationclick', (event) => {
    // console.log('[SW] Notification clicked');
    event.notification.close();
    let urlToOpen = event.notification.data?.url || '/chats';
    if (event.notification.data?.isIAIA) {
        const messageBody = event.notification.body;
        const separator = urlToOpen.includes('?') ? '&' : '?';
        urlToOpen = `${urlToOpen}${separator}iaia_context=${encodeURIComponent(messageBody)}`;
    }
    if (event.notification.data?.force_refresh || event.notification.data?.isRepair) {
        const separator = urlToOpen.includes('?') ? '&' : '?';
        urlToOpen = `${urlToOpen}${separator}refresh_ts=${Date.now()}&repair=active`;
    }
    const urlToOpenAbsolute = new URL(urlToOpen, self.location.origin).href;
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                for (let client of windowClients) {
                    if (client.url === urlToOpenAbsolute || (client.url.startsWith(self.location.origin) && 'focus' in client)) {
                        return client.focus().then(focusedClient => {
                            if (focusedClient.navigate) {
                                return focusedClient.navigate(urlToOpenAbsolute);
                            }
                            return focusedClient;
                        });
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpenAbsolute);
                }
            })
    );
});

self.addEventListener('sync', (event) => {
    // console.log('[SW] Background sync event:', event.tag);
    if (event.tag === 'sync-messages') {
        event.waitUntil(
            Promise.resolve()
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
