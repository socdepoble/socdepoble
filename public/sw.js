/* Service Worker for Sóc de Poble PWA */
const CACHE_VERSION = 'v1.2.2';
const CACHE_NAME = `socdepoble-${CACHE_VERSION}`;

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
            .then(() => self.skipWaiting())
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

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response before caching
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
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
            const isIAIA = data.type === 'iaia' || data.is_iaia_notification || data.title?.includes('IAIA');

            // Stratospheric IAIA Logic: Distinct Identity
            const iaiaAvatar = '/images/demo/avatar_woman_old.png'; // Fallback to Grandma avatar

            notificationData = {
                title: data.title || (isIAIA ? '👵 La teua IAIA et diu...' : notificationData.title),
                body: data.body || data.message || notificationData.body,
                icon: data.icon || (isIAIA ? iaiaAvatar : notificationData.icon),
                badge: data.badge || notificationData.badge,
                image: data.image || null, // Allow big images in notifications
                tag: data.tag || (isIAIA ? 'iaia-chat' : 'general'),
                data: { ...data, isIAIA }, // Pass down for click handling
                requireInteraction: isIAIA, // IAIA messages are important!
                actions: data.actions || [],
                // "Stratospheric" Haptic Feedback
                // IAIA = Double heartbeat (bum-bum... bum-bum)
                // Human = Standard quick buzz
                vibrate: data.vibrate || (isIAIA ? [100, 50, 100, 400, 100, 50, 100] : [200, 100, 200])
            };

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

    // [Cache Busting] Force refresh if requested (e.g. for updates)
    if (event.notification.data?.force_refresh) {
        const separator = urlToOpen.includes('?') ? '&' : '?';
        urlToOpen = `${urlToOpen}${separator}refresh_ts=${Date.now()}`;
    }

    const urlToOpenAbsolute = new URL(urlToOpen, self.location.origin).href;

    event.waitUntil(
        clients.openWindow(urlToOpenAbsolute)
            .then((windowClient) => {
                if (windowClient) {
                    windowClient.focus();
                } else {
                    console.error('[SW] Failed to open window');
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
