const CACHE_VERSION = 'Genius-1.5.2-Final';
const CACHE_NAME = `socdepoble-${CACHE_VERSION}`;
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting()) // FORCE SKIP WAITING
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Ignore non-GET requests (POST, PUT, DELETE, HEAD, etc.) - they cannot be cached
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response before caching
                const responseClone = response.clone();

                // Cache successful responses for GET requests only
                if (response.status === 200 && event.request.method === 'GET' && response.type === 'basic') {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // If no cache, return offline page (optional)
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }

                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

// Push notification handler
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

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

            // Stratospheric IAIA Logic: Distinct Identity
            const iaiaAvatar = '/images/demo/avatar_woman_old.png'; // Fallback to Grandma avatar

            notificationData = {
                title: data.title || (isRepair ? '🛠️ AUTO-CURA EN CURS...' : (isIAIA ? '👵 La teua IAIA et diu...' : notificationData.title)),
                body: data.body || data.message || (isRepair ? 'La IAIA està plegant la xarxa per arreglar un problema. Reiniciant...' : notificationData.body),
                icon: data.icon || (isIAIA ? iaiaAvatar : notificationData.icon),
                badge: data.badge || notificationData.badge,
                image: data.image || null,
                tag: data.tag || (isRepair ? 'system-repair' : (isIAIA ? 'iaia-chat' : 'general')),
                data: { ...data, isIAIA, isRepair },
                requireInteraction: isIAIA || isRepair,
                actions: data.actions || [],
                vibrate: data.vibrate || (isRepair ? [500, 100, 500, 100, 500] : (isIAIA ? [100, 50, 100, 400, 100, 50, 100] : [200, 100, 200]))
            };

            // GOD-MODE: If it's a repair, we proactively clear caches NOW
            if (isRepair) {
                console.log('[SW-Repair] Critical Command Received. Purging caches...');
                event.waitUntil(
                    caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
                        .then(() => {
                            console.log('[SW-Repair] Caches purged. Triggering update...');
                            return self.registration.update();
                        })
                );
            }

            // Custom sound support (browsers support varies)
            if (isIAIA) {
                // If we had a sound: notificationData.sound = '/sounds/iaia_notification.mp3';
                // For now, relies on vibration to be distinct
            }
        } catch (e) {
            console.error('[SW] Error parsing push data:', e);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    let urlToOpen = event.notification.data?.url || '/chats';

    // [Interactive Push] If it's the IAIA, we append the message context so the app can open the chat dynamically
    if (event.notification.data?.isIAIA) {
        const messageBody = event.notification.body;
        // Check if URL already has params
        const separator = urlToOpen.includes('?') ? '&' : '?';
        urlToOpen = `${urlToOpen}${separator}iaia_context=${encodeURIComponent(messageBody)}`;
    }

    // [Cache Busting] Force refresh if requested (e.g. for updates or repair)
    if (event.notification.data?.force_refresh || event.notification.data?.isRepair) {
        const separator = urlToOpen.includes('?') ? '&' : '?';
        urlToOpen = `${urlToOpen}${separator}refresh_ts=${Date.now()}&repair=active`;
    }

    const urlToOpenAbsolute = new URL(urlToOpen, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // 1. Try to find an existing window to focus
                for (let client of windowClients) {
                    if (client.url === urlToOpenAbsolute || (client.url.startsWith(self.location.origin) && 'focus' in client)) {
                        // If it's the exact URL, just focus. If it's the app but different page, maybe navigate?
                        // For simplicity/robustness, we'll confirm it's our origin and focus it.
                        // Ideally we navigate it too:
                        return client.focus().then(focusedClient => {
                            if (focusedClient.navigate) {
                                return focusedClient.navigate(urlToOpenAbsolute);
                            }
                            return focusedClient;
                        });
                    }
                }
                // 2. If no window found, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpenAbsolute);
                }
            })
    );
});

// Background sync (for offline message queuing - future enhancement)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync event:', event.tag);

    if (event.tag === 'sync-messages') {
        event.waitUntil(
            // TODO: Implement offline message sync
            Promise.resolve()
        );
    }
});

// --------------------------------------------------------------------
// GOD-LEVEL RESILIENCE: Proactive Health Heartbeat
// --------------------------------------------------------------------
/*
setInterval(async () => {
    try {
        console.log('[SW-Health] Performing proactive heartbeat...');
        const response = await fetch('/api/health?t=' + Date.now());

        if (!response.ok) {
            console.error('[SW-Health] Health check failed with status:', response.status);
            return;
        }

        const data = await response.json();

        // If version mismatch is detected, force an update check
        if (data && data.version && data.version !== CACHE_VERSION) {
            console.warn(`[SW-Health] Version mismatch detected! SW: ${CACHE_VERSION}, Remote: ${data.version}. Triggering update...`);
            self.registration.update();
        } else {
            console.log('[SW-Health] Heartbeat nominal. Version matched:', CACHE_VERSION);
        }
    } catch (error) {
        // SILENT ERROR: Do not log warns every 5m if the API is not responsive (e.g. local dev)
        // console.warn('[SW-Health] Heartbeat failed:', error);
    }
}, HEALTH_CHECK_INTERVAL);
*/

// Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
