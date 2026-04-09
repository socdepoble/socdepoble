> 📂 **Arxiu/Ruta:** `./auditories/260409_0406_Ronda5_Auditoria_y_Tokens/R5_Huerfana_2_Incompleta.md`

## 🌐 ALTO CONSEJO MULTI-MODEL: PROTOCOLO DE TRABAJO GLOBAL - RONDA 4: AUDITORÍA EXTREMA Y GESTIÓN DE TOKENS

**A Javi (El Mestre), Antigravity (Arquitecto Local), y al Consejo de Inteligencias:**

Acepto el mandato. La fase de destrucción ha sido completada con éxito, sentando las bases para una reconstrucción robusta. Procedo con la Auditoría Extrema (Fase 2) y la gestión de tokens.

---

### 1. AUDITORÍA EXTREMA (Nivel Red Team)

A pesar de la integración del Virtual Scrolling y la Sonda Térmica, el sistema aún presenta fisuras críticas que amenazan su viabilidad a largo plazo, especialmente bajo las condiciones de Jetsam Estricto de iOS y la necesidad de soberanía tecnológica.

**Vectores de Ataque y Propuestas de Mitigación:**

1.  **Límites Oscuros de IndexedDB y Eviction en Safari (iOS 14.8):**
    *   **Fisura:** Safari en iOS implementa políticas de cuota de almacenamiento y desalojo (eviction) agresivas y a menudo poco documentadas. IndexedDB, aunque persistente, puede ser purgado por el sistema operativo si el dispositivo se queda sin espacio o si Safari decide reclamar memoria. La cuota puede variar dinámicamente y no hay una forma fiable de predecir cuándo o cuánto se eliminará. Esto es crítico para la persistencia de datos offline.
    *   **Impacto:** Pérdida silenciosa de datos de usuario, manifiestos, o incluso fragmentos cacheados si se almacenan en IDB, llevando a una experiencia rota y pérdida de soberanía sobre los datos locales.
    *   **Destrucción del Sistema Actual:** La dependencia exclusiva de IDB para datos masivos (como el `virtualManifest` o el contenido de fragmentos si se optara por esa vía) es un punto de fallo.
    *   **Solución Propuesta (Código Híbrido y Notificación):**
        *   **Estrategia:** Implementar un sistema de "salud de datos" y usar `Cache API` como capa principal para los recursos estáticos (HTML, CSS, JS, imágenes) y `IndexedDB` solo para datos dinámicos o de usuario que *deben* ser persistentes y que se sabe que son más pequeños.
        *   **Mitigación de Eviction:**
            1.  **Monitorización de Cuota:** Intentar detectar el espacio disponible antes de escribir grandes cantidades en IDB. Esto es difícil en Safari, pero se pueden usar `try...catch` alrededor de las operaciones de escritura.
            2.  **Estrategia de Persistencia Priorizada:**
                *   **`Cache API`:** Para todos los fragmentos HTML, `virtualManifest.json`, CSS, JS, imágenes. El Service Worker debe gestionar la precache y la estrategia `Stale-While-Revalidate` o `Cache First`.
                *   **`IndexedDB`:** Para datos de usuario específicos (preferencias, estado de progreso, datos de formularios *antes* de sincronizar). Implementar un sistema de versionado y checksums para los datos en IDB.
                *   **Notificación al Usuario:** Si se detecta un error de escritura en IDB (indicativo de posible eviction o cuota llena), notificar *inmediatamente* al usuario: "Se ha detectado un problema de almacenamiento. Se recomienda liberar espacio o sincronizar datos."
            3.  **Sincronización Activa:** Fomentar la sincronización periódica con el servidor (cuando haya conectividad) para mover datos críticos de IDB al backend.
        *   **Código de Mitigación (Ejemplo Conceptual):**

        ```javascript
        // dataManager.js (Conceptual)
        const DB_NAME = 'SdP_OfflineStore';
        const DB_VERSION = 1;
        let db = null;

        async function initDB() {
            if (db) return db;
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = (event) => {
                    const dbInstance = event.target.result;
                    if (!dbInstance.objectStoreNames.contains('userData')) {
                        dbInstance.createObjectStore('userData', { keyPath: 'id' });
                    }
                    // Añadir otros object stores si son necesarios
                };
                request.onsuccess = (event) => {
                    db = event.target.result;
                    resolve(db);
                };
                request.onerror = (event) => {
                    console.error("IndexedDB error:", event.target.errorCode);
                    reject(event.target.errorCode);
                };
            });
        }

        async function saveUserData(data) {
            if (!db) await initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['userData'], 'readwrite');
                const store = transaction.objectStore('userData');
                const request = store.put({ ...data, id: data.id || Date.now() }); // Asegurar ID

                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => {
                    console.error("Failed to save user data:", event.target.error);
                    // Detectar error de cuota/eviction (el código de error varía)
                    if (event.target.error.code === 11) { // DOMException code for quota exceeded
                        notifyUserStorageIssue();
                        reject(new Error("Storage quota exceeded or data eviction likely."));
                    } else {
                        reject(event.target.error);
                    }
                };
            });
        }

        function notifyUserStorageIssue() {
            // Implementar notificación visible al usuario
            const notification = document.getElementById('storage-warning');
            if (notification) {
                notification.style.display = 'block';
                notification.textContent = '¡Problema de almacenamiento detectado! Tus datos podrían no guardarse. Sincroniza o libera espacio.';
            }
            console.warn("User notified about potential storage issue.");
        }

        // Función para verificar la salud de la caché (ej. Service Worker)
        async function checkCacheHealth() {
            // Lógica para verificar si los assets críticos están presentes y accesibles
            // Podría implicar intentar acceder a un archivo y verificar su ETag o tamaño.
        }

        // --- Uso ---
        // await saveUserData({ id: 'user-prefs', theme: 'dark' });
        // setInterval(checkCacheHealth, 60000); // Verificar caché periódicamente
        ```

2.  **Ataques/Corrupción de Caché de PWA y Service Worker:**
    *   **Fisura:** Un Service Worker (SW) malicioso o un bug en su lógica de actualización/caching puede corromper la caché, sirviendo versiones incorrectas de los assets o impidiendo el acceso offline. Ataques de "Cache poisoning" o "Cache busting" malintencionados podrían intentar invalidar la caché.
    *   **Impacto:** La aplicación se vuelve inutilizable, muestra errores, o peor, funciona con datos desactualizados o corruptos sin que el usuario lo sepa.
    *   **Destrucción del Sistema Actual:** La estrategia `Stale-While-Revalidate` o `Cache First` es robusta, pero la implementación del SW y la gestión de actualizaciones son puntos críticos.
    *   **Solución Propuesta (SW Robusto y Auditoría de Integridad):**
        *   **SW Minimalista y Auditado:** El SW debe ser lo más simple posible, enfocado en servir assets precachados y gestionar la red. Evitar lógica compleja dentro del SW.
        *   **Estrategia de Actualización Clara:** Usar un patrón "skipWaiting" y "clients.claim" controlado, asegurando que la nueva versión del SW se active solo cuando la página se recargue.
        *   **Checksums/Versiones:** Incluir un hash o versión en los nombres de los archivos cacheados (ej. `main.v123.js`) o en un `manifest.json` precachado. El SW verifica la integridad.
        *   **Detección de Corrupción:** Implementar una comprobación de integridad al inicio de la PWA (ej. al cargar `main.js` o el SW). Si se detecta corrupción (ej. tamaño incorrecto, hash no coincide), forzar una actualización completa del SW y limpiar la caché (`caches.delete`).
        *   **Código de Mitigación (SW - `sw.js` Conceptual):**

        ```javascript
        // sw.js
        const CACHE_NAME = 'sdp-v1.2.0'; // Versión explícita
        const ASSETS_TO_CACHE = [
            '/',
            '/index.html',
            '/virtualManifest.json',
            '/assets/main.css',
            '/assets/virtualScroller.js',
            '/assets/highlight-lazy.js',
            // ... otros assets estáticos ...
            // Fragmentos precachados si es viable (o usar Cache-only para ellos)
        ];

        // Función para verificar la integridad de la caché
        async function checkIntegrity() {
            const cache = await caches.open(CACHE_NAME);
            // Verificar un archivo crítico
            const response = await cache.match('/virtualManifest.json');
            if (!response || response.status !== 200) {
                console.warn('Cache integrity check failed: virtualManifest missing or invalid.');
                return false;
            }
            // Podríamos añadir una comprobación de tamaño o un checksum aquí si se incluye en el manifest
            return true;
        }

        self.addEventListener('install', (event) => {
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        console.log('Opened cache');
                        return cache.addAll(ASSETS_TO_CACHE);
                    })
                    .then(() => self.skipWaiting()) // Forzar activación inmediata del nuevo SW
            );
        });

        self.addEventListener('activate', (event) => {
            event.waitUntil(
                caches.keys().then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => {
                            if (cacheName !== CACHE_NAME) {
                                console.log('Deleting old cache:', cacheName);
                                return caches.delete(cacheName);
                            }
                        })
                    );
                })
                .then(() => clients.claim()) // Tomar control de las páginas
                .then(checkIntegrity) // Verificar integridad al activarse
                .then(isHealthy => {
                    if (!isHealthy) {
                        console.error("Cache corrupted. Forcing full refresh on next load.");
                        // Podríamos intentar invalidar todo aquí o dejar que el cliente lo maneje
                    }
                })
            );
        });

        self.addEventListener('fetch', (event) => {
            event.respondWith(
                caches.open(CACHE_NAME).match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            // Estrategia: Stale-While-Revalidate para assets dinámicos (fragmentos)
                            // Cache First para assets estáticos
                            if (event.request.url.includes('/fragments/')) {
                                // Clonar y devolver la respuesta de caché, y luego buscar en red
                                const networkFetch = fetch(event.request)
                                    .then(networkResponse => {
                                        if (networkResponse.ok) {
                                            caches.open(CACHE_NAME).then(cache => {
                                                cache.put(event.request, networkResponse.clone());
                                            });
                                        }
                                        return networkResponse;
                                    })
                                    .catch(() => cachedResponse); // Fallback a caché si la red falla
                                return cachedResponse.ok ? cachedResponse : networkFetch;
                            } else {
                                // Para assets estáticos, usar la caché directamente
                                return cachedResponse.ok ? cachedResponse : fetch(event.request);
                            }
                        }
                        // Si no está en caché, intentar fetch
                        return fetch(event.request).then(networkResponse => {
                            // Podríamos cachear respuestas exitosas aquí si no están precachadas
                            return networkResponse;
                        });
                    })
                    .catch(() => {
                        // Fallback si todo falla (ej. página de error offline)
                        return new Response('<h1>Offline y sin caché</h1>', {
                            status: 503,
                            headers: { 'Content-Type': 'text/html' }
                        });
                    })
            );
        });

        // Escuchar mensajes del cliente para forzar re-cacheo o limpieza
        self.addEventListener('message', (event) => {
            if (event.data === 'update_cache') {
                console.log('Received cache update request.');
                event.waitUntil(
                    caches.delete(CACHE_NAME)
                        .then(() => caches.open(CACHE_NAME))
                        .then(cache => cache.addAll(ASSETS_TO_CACHE))
                        .then(() => {
                            console.log('Cache updated successfully.');
                            // Notificar a los clientes para que recarguen
                            self.clients.matchAll().then(clients => {
                                clients.forEach(client => client.postMessage('cache_updated'));
                            });
                        })
                );
            }
        });
        ```

3.  **Estrangulamiento en Sincronización P2P Offline:**
    *   **Fisura:** La sincronización P2P (Peer-to-Peer) en un contexto offline y con conectividad intermitente (3G) es inherentemente difícil. El protocolo P2P (ej. WebRTC Data Channels, o soluciones basadas en Bluetooth/WiFi Direct si el hardware lo permitiera) puede sufrir de baja latencia, pérdida de paquetes, y descubrimiento de peers ineficiente en redes móviles o inestables. El iPad A10, con su hardware de red específico y la gestión de energía de iOS, puede limitar las conexiones P2P activas.
    *   **Impacto:** Los datos no se sincronizan correctamente entre dispositivos locales, llevando a inconsistencias y pérdida de información cuando la conectividad falla. La batería se agota rápidamente intentando mantener conexiones P2P.
    *   **Destrucción del Sistema Actual:** Asumir una sincronización P2P fluida y constante es un error.
    *   **Solución Propuesta (Sincronización Híbrida y Estratégica):**
        *   **Prioridad al Servidor Central (cuando disponible):** La sincronización principal debe ser con un servidor central (o un nodo "anfitrión" designado) siempre que haya conectividad (incluso 3G intermitente).
        *   **P2P como Complemento (Local):** Usar P2P (ej. WebRTC) solo para sincronización *local* entre dispositivos en la misma red Wi-Fi o Bluetooth, si es posible. Esto es mucho más eficiente y fiable.
        *   **Protocolo de Sincronización Inteligente:**
            *   **Basado en Cambios:** Sincronizar solo los datos modificados desde la última sincronización (usando timestamps o versionado).
            *   **Detección de Conflictos:** Implementar una estrategia de resolución de conflictos (ej. "última escritura gana", o lógica más compleja basada en el tipo de dato).
            *   **Backoff y Reintentos:** Usar algoritmos de reintento con backoff exponencial para las conexiones de red intermitentes.
            *   **Notificación de Estado:** Informar claramente al usuario sobre el estado de la sincronización (sincronizando, offline, conflicto, éxito).
        *   **Código de Mitigación (Conceptual - `syncManager.js`):**

        ```javascript
        // syncManager.js
        const SYNC_STRATEGY = 'CENTRAL_FIRST_P2P_LOCAL'; // O 'CENTRAL_ONLY'
        let lastSyncTimestamp = null;

        async function syncData() {
            const dataToSync = await getLocalChanges(lastSyncTimestamp); // Obtener cambios desde el último sync

            if (!navigator.onLine || !dataToSync) {
                 // Intentar sincronización P2P si está habilitada y es local
                 if (SYNC_STRATEGY.includes('P2P_LOCAL') && isLocalNetwork()) {
                     await syncP2P(dataToSync);
                 }
                 return; // Salir si no hay conexión o cambios
            }

            // Intentar sincronización central
            try {
                const response = await fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ changes: dataToSync, lastSync: lastSyncTimestamp })
                });

                if (response.ok) {
                    const result = await response.json();
                    await applyServerChanges(result.serverChanges); // Aplicar cambios del servidor
                    lastSyncTimestamp = result.newTimestamp;
                    console.log("Sync with central server successful.");
                    // Opcionalmente, intentar P2P local si el servidor lo permite o como fallback
                    if (SYNC_STRATEGY.includes('P2P_LOCAL')) {
                        await syncP2P(dataToSync); // Intentar sync P2P después de sync central
                    }
                } else {
                    console.warn("Central sync failed, status:", response.status);
                    // Fallback a P2P si está habilitado
                     if (SYNC_STRATEGY.includes('P2P_LOCAL')) {
                         await syncP2P(dataToSync);
                     }
                }
            } catch (error) {
                console.error("Error during central sync:", error);
                 // Fallback a P2P si está habilitado
                 if (SYNC_STRATEGY.includes('P2P_LOCAL')) {
                     await syncP
