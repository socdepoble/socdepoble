/* 
   PROJECTE: SÓC DE POBLE (Village OS)
   ARQUITECTURA: Local-First / Offline-Capable [Source 79, 266]
   ESTRATÈGIA: Cache-First (Primer el Rebost)
*/

const NOM_REBOST = 'soc-de-poble-rebost-v1'; // Canviar v1 a v2 per forçar actualització

// L'Inventari: Què necessitem per a sobreviure al bancal sense internet?
const INVENTARI_CRITIC = [
    './',
    './index.html',
    './offline.html',
    './manifest.json',
    './static/css/nano_banana.css',
    './static/js/app.js',
    './static/js/haptics.js',
    './assets/master/logo_socdepoble_square_192.png'
];

// 1. INSTAL·LACIÓ: OMPLIR EL REBOST (Pre-caching)
self.addEventListener('install', (event) => {
    console.log('🚜 [Service Worker] Instal·lant i omplint el rebost...');
    event.waitUntil(
        caches.open(NOM_REBOST).then((cache) => {
            console.log('   📦 Guardant inventari crític...');
            return cache.addAll(INVENTARI_CRITIC);
        })
    );
});

// 2. ACTIVACIÓ
self.addEventListener('activate', (event) => {
    console.log('🚜 [Service Worker] Activant i netejant rebost vell...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== NOM_REBOST) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. INTERCEPCIÓ (FETCH): LA LLEI DEL "PRIMER A CASA"
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((respostaRebost) => {
            // Si està al rebost, el servim immediatament ⚡️
            if (respostaRebost) {
                return respostaRebost;
            }

            // Si no, intentem anar a Internet 📡
            return fetch(event.request).catch(() => {
                // ⚠️ ALERTA: NO HI HA INTERNET I NO ESTÀ AL REBOST
                if (event.request.mode === 'navigate') {
                    return caches.match('./offline.html');
                }
            });
        })
    );
});
