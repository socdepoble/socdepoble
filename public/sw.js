const CACHE_VERSION = 'v1.5.6-BATEGA';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

// [STRATEGY] Passive Service Worker - Silence & Resilience
// This SW now only handles installation and activation for cache cleanup.
// Fetch events are removed to follow Chrome's best practices and avoid overhead.

