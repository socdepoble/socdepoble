### INSTRUCCIONES PARA EL USUARIO
1. Copia y pega COMPLETAMENTE este archivo entero (o súbelo como adjunto) en tu chat con Claude (3.7 Sonnet). 
2. El archivo pesa, pero es el "Payload Total" con todas las arterias de la nueva V10.41 Inmortal.
3. ¡Prepárate para las verdades absolutas!

---

### <PROMPT Y PAYLOAD PARA CLAUDE: EL NIVEL 11 SOBRE 10>

Claude, las auditorías anteriores nos están llevando a un sólido 10 sobre 10 (Race conditions de OPFS y Console Noise eliminados). Pero en **Sóc de Poble** no nos conformamos: queremos un **11 sobre 10**. No asumas que nuestro código es perfecto solo porque funciona.

Ya hemos blindado los componentes, las "race conditions" y los problemas de la red en la V10.41. Ahora quiero que mires nuestra arquitectura desde fuera de la caja, con total libertad creativa y analítica. Tienes tokens de sobra, así que exprímelos dándonos las ideas proactivas que nosotros ni siquiera nos hemos atrevido a imaginar. Aquí tienes todo el código fuente brutal de las arterias del sistema.

**El Nivel 11/10: Destrozando los Puntos Ciegos**

1. **El "Hell" de los Context Providers (Rendimiento del Árbol de React)**
   - Mira nuestro `entry.jsx`. Tenemos *13 Providers*. Si uno de los superiores cambia un estado, ¿forzamos avalanchas de re-renders inútiles en todo el `App`? Analiza los `useMemo` y las ineficiencias.
   
2. **Fugas de Memoria en la Transición Offline/Online (El Problema del Tractor)**
   - Mira `LocalFirstGate.jsx`, `sw.js` y `connector.js`. Cuando el usuario del pueblo pierde la cobertura 4G y la recupera intermitentemente mientras va en tractor, ¿cómo estamos manejando la limpieza de listeners y la re-hidratación de datos? ¿Tenemos zombies?

3. **Resiliencia del Edge Proxy (Groq/Gemini)**
   - Mira `supabase/functions/gemini-proxy/index.ts` y `geminiService.js`. Si la conexión es tan lenta que el usuario cancela la petición o abandona, el frontal tira el `AbortController`. ¿Estamos cortando el proceso en el servidor de raíz para no quemar tokens inútilmente?

4. **Rotura Estructural por el Teclado Móvil y Notches (Visual y UX)**
   - Mira `ProjectPresentation.jsx` y `SafeShell.jsx`. ¿Qué pasa en las pantallas cuando el teclado virtual nativo de Android sube y aplasta la altura? ¿Resisten los Flexbox nuestra exigente filosofía de diseño Noto Sans 28px?

5. **La Pesadilla de las Migraciones de Esquema Offline (Zombis de PWA)**
   - Mira `sw.js` y `schema.js`. El día que lancemos la **V11.0** cambiando el esquema de PowerSync, el SW agresivo podría seguir sirviendo el JS antiguo pero conectar con los endpoints o esquemas nuevos. Esto tumba startups enteras. Diseña la estrategia transparente, asincrónica y a prueba de balas para que los cachés locales no corrompan nuestra plataforma durante la migración.

No te guardes nada. Desmonta nuestras ilusiones. Danos advertencias severas, fragmentos de código de alta ingeniería para estos 5 vectores y haznos destructivos a los fallos en el campo. ¡Destripa este Payload!

---

### <CÓDIGO FUENTE - PAYLOAD V10.41 INMORTAL>



#### Archivo: `index.html`
```html
<!DOCTYPE html>
<html lang="ca" prefix="og: http://ogp.me/ns#">
  <head>
    <!-- [BATEGAT SEO GOD] Previsualitzacions d'alt impacte per a WhatsApp/Social -->
    <title>Sóc de Poble | El Sistema Operatiu Rural</title>
    <meta
      name="description"
      content="Connecta amb la teua comunitat i recupera el trellat del territori. Mercat rural, memòria viva i sobirania digital en la xarxa social KM 0."
    />
    <meta name="keywords" content="xarxa social rural, pobles connectats, IAIA, memòria històrica, comerç local, sobirania digital, valencià" />
    <meta name="theme-color" content="#f97316" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Sóc de Poble" />
    <link rel="author" href="https://socdepoble.org" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://socdepoble.org/" />
    <meta
      property="og:title"
      content="Sóc de Poble | El Sistema Operatiu Rural"
    />
    <meta
      property="og:description"
      content="Connecta amb la teua comunitat i recupera el trellat del territori. Mercat rural, memòria viva i sobirania digital."
    />
    <meta
      property="og:image"
      content="https://socdepoble.org/og-image.png"
    />
    <meta
      property="og:image:secure_url"
      content="https://socdepoble.org/og-image.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:site_name" content="Sóc de Poble" />
    <meta property="og:locale" content="ca_ES" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@socdepoble" />
    <meta name="twitter:creator" content="@socdepoble" />
    <meta
      name="twitter:title"
      content="Sóc de Poble | El Sistema Operatiu Rural"
    />
    <meta
      name="twitter:description"
      content="Connecta amb la teua comunitat i recupera el trellat. Mercat rural, memòria viva i sobirania digital."
    />
    <meta
      name="twitter:image"
      content="https://socdepoble.org/og-image.png"
    />

    <meta charset="UTF-8" />
    
    <!-- [Mestre: Bloqueig de FOUC] Erradicació del llamp visual de tema (FOUC) -->
    <script>
      (function() {
        try {
          var savedTheme = localStorage.getItem('nexus_theme') || 'light';
          var root = document.documentElement;
          root.classList.add(savedTheme);
          root.classList.add('theme-' + savedTheme);
        } catch (e) {
          document.documentElement.classList.add('light');
          document.documentElement.classList.add('theme-light');
        }
      })();
    </script>
    
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover">

    <script>
      // [BATEGAT RESCUE v10.33.2] Guardem la versió
      (function () {
        const CURRENT_V = "v10.33.15-CANÒNIC";

        localStorage.setItem("sp_app_version", CURRENT_V);

        window.addEventListener(
          "error",
          function (e) {
            if (e.target.tagName === "LINK" || e.target.tagName === "SCRIPT") {
              console.error(
                "[PURGA] Error d'asset detectat. PWA desfasada. Forçant recàrrega neta:",
                e.target.src || e.target.href,
              );
              if (!sessionStorage.getItem("sw_purged_asset")) {
                sessionStorage.setItem("sw_purged_asset", "true");
                window.location.reload(true);
              }
            }
          },
          true,
        );
      })();
    </script>

    <meta
      http-equiv="Cache-Control"
      content="no-cache, no-store, must-revalidate"
    />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />


    <!-- Google Fonts: Noto Sans (L'Ànima de Sóc de Poble) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300..700&family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300..700&family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap"
      rel="stylesheet"
      media="print"
      onload="this.media='all'"
    />
    <noscript>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300..700&family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap"
        rel="stylesheet"
      />
    </noscript>

    <!-- Estils i Protocols -->

    <style>
      .animate-in {
        animation: fadeIn 0.4s ease-out;
      }
      .animate-up {
        animation: slideUp 0.4s ease-out;
      }
      .zoom-in {
        animation: zoomIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes zoomIn {
        from {
          transform: scale(0.95);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .blueprint-grid {
        background-image: linear-gradient(
            to right,
            rgba(6, 182, 212, 0.1) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(6, 182, 212, 0.1) 1px,
            transparent 1px
          );
        background-size: 20px 20px;
      }

      /* Ruler Overlay */
      .forense-active * {
        outline: 1px solid rgba(249, 115, 22, 0.1) !important;
      }
    </style>
    <meta name="sp-version" content="v10.34.0" />
    <meta name="build-timestamp" content="2026-02-25T02:16:00+01:00" />
  </head>
  <body>
    <!-- Hidden H1 for SEO -->
    <h1
      style="
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      "
    >
      Sóc de Poble - La teua xarxa de territori i sobirania digital
    </h1>
    <div id="root"></div>

    <!-- Groq Turbo Rural Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    </script>

    <!-- Google Identity Services per a One-Tap Login -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <!-- Modern App Entry -->
    <script type="module" src="/src/entry.jsx"></script>

    <!-- [BATEGAT FAILSAFE v3] Si el Mas no arranca en 4 segons, obrim panell d'emergència -->
    <script>
      setTimeout(() => {
        if (!window.__SDP_ROOT_MOUNTED) {
          console.error(
            "Failsafe disparat: React no ha pogut muntar l'aplicació.",
          );
          document.body.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#000;color:#fff;font-family:sans-serif;padding:20px;text-align:center;box-sizing:border-box;">
              <h2 style="color:#f97316;font-size:24px;margin-bottom:10px;font-weight:900;">TANCAT PER REFORMES</h2>
              <p style="color:#9ca3af;margin-bottom:30px;font-size:16px;">El teu telèfon ha guardat una versió corrompuda de l'aplicació a la memòria i s'ha bloquejat.</p>
              <button onclick="caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))); navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())); localStorage.clear(); sessionStorage.clear(); window.location.reload(true);" style="background-color:#f97316;color:#fff;border:none;padding:15px 30px;border-radius:30px;font-weight:bold;font-size:18px;cursor:pointer;box-shadow:0 4px 15px rgba(249,115,22,0.4);">
                Forçar Neteja i Reiniciar
              </button>
            </div>
          `;
        }
      }, 4000);
    </script>
  </body>
</html>

```


#### Archivo: `public/manifest.json`
```json
{
  "name": "Sóc de Poble",
  "short_name": "Sóc de Poble",
  "description": "La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#f97316",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "ca-ES",
  "dir": "ltr",
  "categories": ["social", "lifestyle", "productivity"],
  "icons": [
    {
      "src": "/favicon-16x16.png",
      "sizes": "16x16",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "El Mur",
      "short_name": "Mur",
      "description": "Veure les últimes publicacions del poble",
      "url": "/mur"
    },
    {
      "name": "El Mercat",
      "short_name": "Mercat",
      "description": "Explora productes locals i de proximitat",
      "url": "/mercat"
    },
    {
      "name": "Xat",
      "short_name": "Xat",
      "description": "Conversa amb els veïns i agents IAIA",
      "url": "/xat"
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "images",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "related_applications": [],
  "prefer_related_applications": false,
  "serviceworker": {
    "url": "/sw.js",
    "scope": "/",
    "type": "module",
    "update_via_cache": "none"
  }
}

```


#### Archivo: `public/sw.js`
```javascript
// public/sw.js – GROQ TURBO RURAL V10.37
const CACHE_NAME = 'soc-de-poble-v10.37';
const PRECACHE_URLS = [
  '/assets/llibre-sencer.html',
  '/manifest.json',
  '/favicon.png',
  // Añade aquí otros assets críticos si quieres
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW Groq] Precaching rural...');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting(); // Activación inmediata
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Control inmediato de todas las pestañas
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. RUTA CRÍTICA: /gemini-proxy → Network-First (nunca cacheamos IA dinámica)
  if (url.pathname.includes('/gemini-proxy') || url.pathname.includes('/functions/v1/gemini-proxy')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si todo OK, opcionalmente cacheamos la respuesta para ultra-fast retry en rural
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback offline rural: devolvemos un mensaje amable + libro cacheado
          return caches.match('/assets/llibre-sencer.html').then((cachedBook) => {
            if (cachedBook) {
              return new Response(
                `<h1>🌾 Sense connexió al poble</h1><p>El proxy de IA no respon ara mateix, però tens el Llibre Sencer complet guardat localment.</p><div style="margin-top:20px;">${cachedBook.text ? 'Carregant llibre...' : ''}</div>`,
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            return new Response('🌾 Sense connexió. Torna quan tinguis 4G.', { status: 503 });
          });
        })
    );
    return;
  }

  // 2. ASSETS ESTÁTICOS + PÁGINAS → Stale-While-Revalidate (máxima velocidad percibida)
  if (event.request.destination === 'document' ||
      event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. TODO LO DEMÁS → Network-First con fallback cache
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

```


#### Archivo: `src/entry.jsx`
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "./service-worker-manager"; // DESACTIVAT - Sóc de Poble PWA Failsafe

// --- [FAILSAFE PROTOCOL v3] DESACTIVAT ---
// El Service Worker està gestionat ara nativament per Vite PWA sense bucles.
// -----------------------------------------------------------------------------
import "./design-system/tokens.css";
import "./i18n/config";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { DesignProvider } from "./context/DesignContext";
import { NavigationProvider } from "./context/NavigationContext";
import { SocialProvider } from "./context/SocialContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from "./providers/QueryProvider";

import UnifiedStatus from "./components/UnifiedStatus";
import SafeShell from "./components/SafeShell";
import VersionGatekeeper from "./components/VersionGatekeeper";
import { APP_VERSION } from "./constants";
import { checkSilence } from "./utils/logger";

// 1. SILENT BOOT (Master Silence)
// No log noise in production.
// Global Error Handlers (Silent in Production)
window.onerror = (msg, src, lineno, colno, err) => {
  if (checkSilence(msg) || checkSilence(err)) return true;
  if (import.meta.env.DEV) console.error(`[FATAL] ${msg} at ${src}:${lineno}`);
};

// [FAILSAFE PROTOCOL] Capturar i silenciar l'error de Supabase JS "Refresh Token Not Found"
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'AuthApiError' && event.reason.message && event.reason.message.includes('Refresh Token')) {
    console.warn('[BATEGAT SAFETY] Sessió caducada silenciosament (Refresh Token). Supabase gestionarà la sortida.');
    event.preventDefault(); // Evita que l'error trenque la consola en roig
  }
});

// Console Noise Suppression
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;
const originalInfo = console.info;

const isNoise = (args) => args.some((arg) => checkSilence(arg));

console.warn = (...args) => { if (!isNoise(args)) originalWarn.apply(console, args); };
console.error = (...args) => { if (!isNoise(args)) originalError.apply(console, args); };
console.log = (...args) => { if (!isNoise(args)) originalLog.apply(console, args); };
console.info = (...args) => { if (!isNoise(args)) originalInfo.apply(console, args); };



import { I18nProvider } from "./context/I18nContext";
import { ToastProvider } from "./components/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { RealmProvider } from "./contexts/RealmContext";

const CURRENT_MASTER_VERSION = APP_VERSION;

// Simplified Version Gatekeeper
// [RESILIENT VERSION GATEKEEPER] Protocol de Prevenció de Bucles
const savedVersion = localStorage.getItem("sp_app_version");
const lastReload = parseInt(localStorage.getItem("sp_last_version_reload") || "0");
const now = Date.now();

if (savedVersion && savedVersion !== CURRENT_MASTER_VERSION) {
    if (now - lastReload < 120000) { 
        // Resolució del decalatge de versions silenciada per no embrutar la consola amb fantasmes
        // Forçar l'actualització perquè el Gatekeeper pugui avançar i no es quedi encallat 2 minuts.
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
    } else {
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
        localStorage.setItem("sp_last_version_reload", now.toString());
        if ('caches' in window) {
            caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
        }
        window.location.reload(true);
    }
} else if (!savedVersion) {
    localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
}

const container = document.getElementById("root");
if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);

window.__SDP_ROOT__.render(
  <React.StrictMode>
    <QueryProvider>
      <HelmetProvider>
        <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
            <RealmProvider>
              <SocialProvider>
                <DesignProvider>
                  <ThemeProvider>
                    <NavigationProvider>
                      <ModalProvider>
                        <ToastProvider>
                          <VersionGatekeeper>
                            <SafeShell>
                              <App />
                            </SafeShell>
                          </VersionGatekeeper>
                        </ToastProvider>
                      </ModalProvider>
                    </NavigationProvider>
                  </ThemeProvider>
                </DesignProvider>
              </SocialProvider>
            </RealmProvider>
          </AuthProvider>
        </I18nProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryProvider>
  </React.StrictMode>
);

// Signalejar al Failsafe de index.html que hem arrancat amb èxit
window.__SDP_ROOT_MOUNTED = true;


```


#### Archivo: `src/App.jsx`
```javascript
import React, { useEffect, useCallback } from 'react';
import AppLayout from './components/AppLayout';
import { iaiaService } from './services/iaiaService';
import GlobalModals from './components/GlobalModals';
import './index.css';
import { errorTrackingService } from './services/errorTrackingService';
import { healthCheckService } from './services/healthCheckService';
import { logger } from './utils/logger';

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from './components/ErrorBoundary';
import LocalFirstGate from './components/gates/LocalFirstGate';
import AuthGate from './components/gates/AuthGate';
import OfflineGate from './components/gates/OfflineGate';

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // [MONITORING] Inicialitzar error tracking
    useEffect(() => {
        let isMounted = true;
        const initializeMonitoring = async () => {
            try {
                await errorTrackingService.initialize();
                if (isMounted) logger.log('[App] Error tracking initialized');
            } catch (error) {
                if (isMounted) logger.error('[App] Failed to initialize error tracking:', error);
            }
        };

        initializeMonitoring();
        return () => { isMounted = false; };
    }, []);

    // [MONITORING] Iniciar health checks
    useEffect(() => {
        healthCheckService.startMonitoring();
        
        const unsubscribe = healthCheckService.subscribe((health) => {
            if (health.overall !== 'healthy') {
                logger.warn('[App] Health check warning:', health);
                errorTrackingService.captureException(
                    new Error(`Health check: ${health.overall}`),
                    { health }
                );
            }
        });

        return () => {
            healthCheckService.stopMonitoring();
            unsubscribe();
        };
    }, []);

    // [ERROR] Global error handlers refactoritzats
    const handleError = useCallback((event) => {
        errorTrackingService.captureException(event.error || event.message, {
            type: 'global',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }, []);

    const handleUnhandledRejection = useCallback((event) => {
        errorTrackingService.captureException(event.reason, {
            type: 'unhandledrejection'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [handleError, handleUnhandledRejection]);

    useEffect(() => {
        return () => {
            iaiaService.dispose();
        };
    }, []);

    return (
        <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
            <OfflineGate>
                <LocalFirstGate>
                    <AuthGate>
                        <AppLayout />
                        <GlobalModals />
                    </AuthGate>
                </LocalFirstGate>
            </OfflineGate>
            <div id="aria-live-region" aria-live="polite" className="sr-only" />
        </ErrorBoundary>
    );
};

export default App;

```


#### Archivo: `src/components/gates/LocalFirstGate.jsx`
```javascript
import React, { useState, useEffect, useRef } from "react";
import { PowerSyncContext } from "@powersync/react";
import { PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../../powersync/schema";
import { SupabaseConnector } from "../../powersync/connector";
import BrandLogo from "../BrandLogo";

// ─── Tipus d'Estat Honests ──────────────────────────────────────────────────
// 'idle'      → no inicialitzat encara
// 'ready'     → DB init + connect completats, tot correcte
// 'degraded'  → bypass OPFS activat, sense persistència rica
// 'error'     → error crític no recuperable
const STATUS = {
  IDLE: "idle",
  READY: "ready",
  DEGRADED: "degraded",
  ERROR: "error",
};

const OPFS_TIMEOUT_MS = 3500;

export default function LocalFirstGate({ children }) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);

  // ─── Singleton Segur (Immune a StrictMode i re-mounts) ──────────────────
  // useRef garanteix que mai creem dues instàncies, ni en dev (StrictMode
  // executa els efectes dues vegades) ni si el component es desmunta
  // i es torna a muntar per canvis de ruta.
  const dbRef = useRef(null);
  const connectorRef = useRef(null);
  const isInitializedRef = useRef(false); // Guarda contra doble init

  useEffect(() => {
    let isMounted = true;

    const initDb = async () => {
      // ─── Guarda contra doble execució (StrictMode) ──────────────────────
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      // ─── Instanciació Lazy i Segura ──────────────────────────────────────
      if (!dbRef.current) {
        dbRef.current = new PowerSyncDatabase({
          schema: AppSchema,
          database: {
            dbFilename: "socdepoble.db",
            vfs: "OPFSCoopSyncVFS",
          },
          flags: { enableMultiTabs: false },
        });
      }

      if (!connectorRef.current) {
        connectorRef.current = new SupabaseConnector();
      }

      const db = dbRef.current;
      const connector = connectorRef.current;

      try {
        // ─── Race: Init vs Timeout ───────────────────────────────────────
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("TIMEOUT_OPFS")),
            OPFS_TIMEOUT_MS
          )
        );

        await Promise.race([db.init(), timeoutPromise]);

        // init() completat: ara connectem
        await db.connect(connector);

        if (isMounted) setStatus(STATUS.READY);
      } catch (err) {
        const isOpfsError =
          err.message === "TIMEOUT_OPFS" ||
          String(err).toLowerCase().includes("opfs") ||
          String(err).toLowerCase().includes("lockstorage") ||
          String(err).toLowerCase().includes("write lock");

        if (isOpfsError) {
          // ─── Bypass Honest: Mode Degradat ───────────────────────────────
          // No mentim: marquem l'estat com DEGRADED, no READY.
          // Els fills reben la db, però saben (via context ampliat o prop)
          // que estan en mode sense persistència rica.
          console.warn(
            "[LocalFirstGate] ⚠️ Bypass d'Emergència activat. " +
              "OPFS bloquejat (possiblement dues pestanyes obertes). " +
              "Mode degradat: UI operativa, sincronització offline suspesa."
          );
          if (isMounted) setStatus(STATUS.DEGRADED);
        } else {
          console.error("[LocalFirstGate] Error crític PowerSync:", err);
          if (isMounted) {
            setErrorMsg(err.message || "Error desconegut d'emmagatzematge.");
            setStatus(STATUS.ERROR);
          }
        }
      }
    };

    initDb();

    // ─── Listener de Reconnexió ──────────────────────────────────────────
    const handleOnline = () => {
      const db = dbRef.current;
      const connector = connectorRef.current;
      if (!isMounted || !db || status === STATUS.ERROR) return;

      console.log(
        "[LocalFirstGate] 🧢 Cobertura recuperada. Sincronitzant..."
      );
      db.connect(connector).catch((err) =>
        console.error("[LocalFirstGate] Reconnect fallat:", err)
      );
    };

    window.addEventListener("online", handleOnline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
      // NOTA: No fem db.disconnect() aquí perquè el component pot re-muntar-se
      // (StrictMode). La desconnexió real hauria d'anar al cleanup de l'app
      // sencera (beforeunload), no aquí.
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Renders per Estat ──────────────────────────────────────────────────

  if (status === STATUS.ERROR) {
    return (
      <div className="bg-[#111827] text-white min-h-screen flex items-center justify-center flex-col p-6 text-center">
        <h2 className="text-[#F97316] font-black text-2xl mb-4">
          Error Crític d'Emmagatzematge
        </h2>
        <p className="mb-2 text-gray-300">
          No s'ha pogut inicialitzar la base de dades local.
        </p>
        <code className="text-sm bg-black p-3 rounded-[20px] mb-6 text-red-400">
          {errorMsg}
        </code>
        <button
          onClick={async () => {
            const db = dbRef.current;
            if (db) {
              try {
                await db.disconnectAndClear();
              } catch (_) {
                // ignorem errors de neteja
              }
            }
            window.location.reload();
          }}
          className="bg-[#F97316] text-white font-bold py-3 px-6 rounded-[28px]"
        >
          Re-bategar el Sistema
        </button>
      </div>
    );
  }

  if (status === STATUS.IDLE) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col relative overflow-hidden"
        style={{ background: "#0b0b0b" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" />
        <img
          src="/assets/master/logo-socdepoble-rect.svg"
          alt="Sóc de Poble"
          className="h-10 w-auto mb-8 opacity-80 animate-pulse"
          style={{ filter: "drop-shadow(0 0 10px rgba(0,242,255,0.3))" }}
        />
        <div className="flex justify-center gap-2 mb-6">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
        <p className="text-[#00f2ff] text-[12px] font-black uppercase tracking-[0.2em] opacity-70">
          Connectant...
        </p>
      </div>
    );
  }

  // STATUS.READY o STATUS.DEGRADED — tots dos reben la db
  // En mode DEGRADED, la db existeix però pot no tenir dades sincronitzades.
  // Els components fills poden llegir l'estat via un Context ampliat si cal.
  return (
    <PowerSyncContext.Provider value={dbRef.current}>
      {status === STATUS.DEGRADED && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: "env(safe-area-inset-top, 0px)",
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "rgba(249,115,22,0.92)",
            color: "#fff",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 700,
            padding: "6px 12px",
            backdropFilter: "blur(8px)",
          }}
        >
          Mode Sense Connexió · Tanca les pestanyes duplicades per activar la
          sincronització completa.
        </div>
      )}
      {children}
    </PowerSyncContext.Provider>
  );
}

```


#### Archivo: `src/components/VersionGatekeeper.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { APP_VERSION } from '../constants';
import './VersionGatekeeper.css';

/**
 * [MASTER] VersionGatekeeper - El Portal del Temps del Mas
 * Controla que la versió de l'app siga la correcta. Si no, purga nuclear.
 */
const VersionGatekeeper = ({ children }) => {
    // [INITIALIZATION] Check version directly in render state to avoid cascading effects
    const [purging] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        console.log('[VersionGatekeeper] Debugging variables:', { localVersion, APP_VERSION });
        return localVersion && localVersion !== APP_VERSION;
    });

    const [isReady] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return !localVersion || localVersion === APP_VERSION;
    });

    useEffect(() => {
        if (purging) {
            const timer = setTimeout(() => {
                const now = Date.now();
                const lastReload = parseInt(localStorage.getItem('sp_last_version_reload') || '0');
                
                if (now - lastReload < 10000) {
                    console.error('[VersionGatekeeper] Circuit breaker actiu. Sincronitzant versió manualment.');
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    window.location.reload(); // Un últim intent per si de cas, però el flag ara coincideix
                } else {
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    localStorage.setItem('sp_last_version_reload', now.toString());
                    window.location.reload(true);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [purging]);

    if (purging) {
        return (
            <div className="gatekeeper-purge-overlay">
                <img src="/icon-192x192.png" alt="Sóc de Poble" className="purge-logo" />
                <h2 className="purge-title">FENT DISSABTE</h2>
                <p className="purge-subtitle">ACTUALITZANT EL MAS...</p>
                <div className="purge-version">{APP_VERSION}</div>
            </div>
        );
    }

    if (!isReady) return null;
    return <>{children}</>;
};

export default VersionGatekeeper;

```


#### Archivo: `src/components/SafeShell.jsx`
```javascript
import React from 'react';
import './SafeShell.css';

/**
 * [MASTER] SafeShell - Protecció de Safe Areas per a iOS/Android
 * Garanteix que la "Boina Taronja" s'estenga darrere del notch sense tallar contingut.
 */
const SafeShell = ({ children }) => {
    return (
        <div className="safe-shell-container">
            <div className="safe-area-background-top" />
            <main className="safe-shell-main" style={{
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}>
                {children}
            </main>
            <div className="safe-area-background-bottom" />
        </div>
    );
};

export default SafeShell;

```


#### Archivo: `src/pages/ProjectPresentation.jsx`
```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2 } from 'lucide-react';
import SEO from '../components/SEO';
import GlobalFooter from '../components/GlobalFooter';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import MediaViewerModal from '../components/MediaViewerModal';

// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
let CachedBookContent = null;

const fetchDefaultBookContent = async () => {
    if (CachedBookContent) return CachedBookContent;
    try {
        const res = await fetch('/assets/llibre-sencer.html');
        if (res.ok) {
            CachedBookContent = await res.text();
            return CachedBookContent;
        }
    } catch (e) {
        console.error("Error fetching default book:", e);
    }
    return "<h1>SÓC DE POBLE (Versió Reduïda)</h1><p>No s'ha pogut carregar el llibre sencer.</p>";
};

const ProjectPresentation = ({ standAlone = true, forcedSlug = null }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin } = useAuth();

    const [htmlContent, setHtmlContent] = useState('');
    const [pageId, setPageId] = useState(null);
    const [routeSlug, setRouteSlug] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    const loadFallbackContent = async (fallbackTitle) => {
        const content = await fetchDefaultBookContent();
        setHtmlContent(content);
        setTitle(fallbackTitle);
    };

    const fetchPageContent = useCallback(async (slug) => {
        setIsLoadingPage(true);
        try {
            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                if (error.code === 'PGRST116' || error.message?.includes('JSON object requested')) {
                    if (!isSuperAdmin) {
                        if (slug !== '/projecte') {
                            navigate('/mur', { replace: true });
                            return;
                        } else {
                            await loadFallbackContent("Sóc de Poble: El Projecte");
                        }
                    } else {
                        await loadFallbackContent("Nova Pàgina");
                    }
                } else {
                    console.error('Error fetching page (Not 116):', error);
                    await loadFallbackContent("Sóc de Poble: El Projecte");
                }
            } else if (data) {
                setPageId(data.id);
                setHtmlContent(data.html_content || '');
                setTitle(data.title || '');
                setSubtitle(data.subtitle || '');
            }
        } catch (error) {
            console.error('Critical error fetching page:', error);
            await loadFallbackContent("Sóc de Poble: El Projecte");
        } finally {
            setIsLoadingPage(false);
        }
    }, [navigate, isSuperAdmin]);
    useEffect(() => {
        let currentSlug = forcedSlug || location.pathname;
        if (!standAlone && !forcedSlug) {
            currentSlug = '/projecte';
        } else if (currentSlug === '/projecte' || currentSlug === '/manifest') {
            currentSlug = '/projecte';
        }
        setRouteSlug(currentSlug);
        fetchPageContent(currentSlug);
    }, [location.pathname, standAlone, forcedSlug, fetchPageContent]);

    const handleSave = async (updatedHtml) => {
        if (!isSuperAdmin) return;
        setIsSaving(true);
        try {
            const payload = {
                slug: routeSlug,
                title: title || 'Pàgina Sense Títol',
                subtitle: subtitle || '',
                html_content: updatedHtml,
                published_at: new Date().toISOString()
            };

            if (pageId) {
                await supabase.from('cms_pages').update(payload).eq('id', pageId);
            } else {
                const { data } = await supabase.from('cms_pages').insert([payload]).select().single();
                if (data) setPageId(data.id);
            }
            setHtmlContent(updatedHtml);
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving CMS page", err);
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const HeroBanner = (
        <div className="relative w-full aspect-video z-0 bg-black min-h-[300px] border-b-4 border-[var(--theme-accent-primary)] shadow-[0_10px_30px_rgba(255,107,0,0.1)] group flex flex-col items-center justify-center">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes bategant {
                    0%, 100% { color: #f97316; text-shadow: 0 0 15px rgba(249,115,22,0.6); opacity: 1; transform: scale(1); }
                    50% { color: #ffffff; text-shadow: 0 0 5px rgba(255,255,255,0.2); opacity: 0.7; transform: scale(0.98); }
                }
                .animate-bategant {
                    animation: bategant 1.5s ease-in-out infinite;
                }
            `}} />
            
            <img 
                src="/assets/banners/hero_nano_final.png" 
                alt="Sóc de Poble Banner" 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                onClick={() => {
                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                    setMediaViewerImages([bannerSrc, ...allImagesArray]);
                    setMediaViewerSrc(bannerSrc);
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
            
            <div className="absolute top-4 right-4 flex gap-2 z-50">
                {isSuperAdmin && (
                    <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className="bg-black/50 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-lg hover:bg-[var(--theme-accent-primary)] hover:border-transparent transition-all"
                        title={isEditing ? "Tancar edició" : "Editar Pàgina (SuperAdmin)"}
                    >
                        {isEditing ? <ArrowLeft size={20} /> : <Edit2 size={20} />}
                    </button>
                )}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center pt-10">
                <img 
                    src="/assets/master/logo_socdepoble_white_clean.png" 
                    alt="Logo Sóc de Poble" 
                    className="h-16 sm:h-20 w-auto mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] object-contain" 
                />
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white text-center tracking-tight leading-none mb-3 drop-shadow-2xl">
                    {title || "SÓC DE POBLE"}
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-300 font-medium tracking-wide mb-8 drop-shadow-md pb-4">
                    {subtitle || "Portal de Pobles Connectats"}
                </p>

                <div className="flex flex-col items-center gap-6">
                    <button 
                        onClick={() => navigate('/chats')}
                        className="font-['Inter_Tight',sans-serif] text-[13px] font-black uppercase tracking-[0.2em] animate-bategant select-none hover:scale-105 active:scale-95 transition-transform"
                    >
                        CONNECTAR
                    </button>
                    
                    <button 
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors opacity-70 hover:opacity-100"
                        title="Compartir aquesta pàgina"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: 'Sóc de Poble', text: 'Descobreix la Xarxa Rural de Pobles Connectats', url: window.location.href });
                            }
                        }}
                    >
                        Compartir <Share2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );

    let ActualContent;
    if (isLoadingPage) {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-10 min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl">
                    <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full mt-4"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-4/5"></div>
                </div>
            </div>
        );
    } else {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col items-center z-10 -mt-2 sm:mt-0 sm:px-4 pb-10">
                {(isSuperAdmin && isEditing) ? (
                    <RichTextEditor 
                        content={htmlContent} 
                        onChange={setHtmlContent} 
                        onSave={handleSave} 
                        isSaving={isSaving}
                        editable={true}
                    />
                ) : (
                    <div className="flex-1 w-full max-w-4xl mx-auto custom-scrollbar">
                        <div 
                            className="app-cms-content bg-transparent text-[var(--text-main)] focus:outline-none min-h-[60vh] p-6 lg:p-10 w-full
                                [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-black [&>h1]:uppercase [&>h1]:tracking-tight [&>h1]:text-center [&>h1]:mb-6
                                [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:text-[var(--theme-accent-secondary)] [&>h2]:uppercase [&>h2]:mb-4 [&>h2]:mt-8
                                [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-6
                                [&>h4]:text-base [&>h4]:font-bold [&>h4]:uppercase [&>h4]:mb-2 [&>h4]:mt-4 [&>h4]:text-[var(--text-muted)]
                                [&>p]:text-lg [&>p]:md:text-xl [&>p]:leading-relaxed [&>p]:mb-6 text-justify
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:text-lg [&>ol]:md:text-xl
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:text-lg [&>ul]:md:text-xl
                                [&_li]:mb-1 [&_li>p]:m-0
                                [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--theme-accent-primary)] [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:pr-4 [&_blockquote]:my-8 [&_blockquote]:mx-0 [&_blockquote]:bg-[var(--bg-panel)] [&_blockquote]:rounded-r-2xl
                                [&_blockquote_p]:text-xl [&_blockquote_p]:md:text-2xl [&_blockquote_p]:italic [&_blockquote_p]:font-medium [&_blockquote_p]:text-[var(--text-main)] [&_blockquote_p]:mb-0
                                [&_img]:rounded-2xl [&_img]:border [&_img]:border-[var(--border-master)] [&_img]:my-6 [&_img]:w-full [&_img]:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                                [&_a]:text-[var(--theme-accent-primary)] [&_a]:underline hover:[&_a]:text-[var(--theme-accent-secondary)]
                                selection:bg-[var(--theme-accent-primary)] selection:text-white"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                            onClick={(e) => {
                                if (e.target.tagName === 'IMG') {
                                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                                    const combinedImages = [bannerSrc, ...allImagesArray];
                                    
                                    setMediaViewerImages(combinedImages);
                                    setMediaViewerSrc(e.target.src);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    if (!standAlone) {
        return (
            <>
                {HeroBanner}
                {ActualContent}
            </>
        );
    }

    return (
        <div className="h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full overflow-hidden">
            <SEO
                title={title || "Sóc de Poble: El Llibre"}
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda."
                url={routeSlug}
            />
            
            <div className="sticky top-0 w-full bg-[var(--bg-panel)]/90 backdrop-blur-md border-b border-[var(--border-master)] p-4 flex items-center gap-4 z-50">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 border border-[var(--border-master)] rounded-xl hover:bg-[var(--theme-accent-primary)] hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h3 className="text-xl font-bold uppercase tracking-tight m-0 text-ellipsis overflow-hidden whitespace-nowrap">
                    {title || "DOCUMENTACIÓ OFICIAL"}
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {HeroBanner}
                {ActualContent}
                {standAlone && <GlobalFooter />}
            </div>
            
            <MediaViewerModal 
                isOpen={!!mediaViewerSrc} 
                onClose={() => {
                    setMediaViewerSrc(null);
                    setMediaViewerImages([]);
                }} 
                src={mediaViewerSrc} 
                images={mediaViewerImages}
                onNavigate={(newSrc) => setMediaViewerSrc(newSrc)}
                title={title || "Sóc de Poble Visuals"} 
            />
        </div>
    );
};

export default ProjectPresentation;

```


#### Archivo: `src/services/geminiService.js`
```javascript
import { logger } from "../utils/logger";
import { supabase } from "../supabaseClient";
import { AGENTS_MAP } from "../config/agentsMap";
import DOMPurify from 'dompurify';

/**
 * GeminiService: Intel·ligència amb Trellat [V1.2]
 * Gestiona les 4 personalitats d'IA especialitzades en el món rural.
 */
class GeminiService {
  constructor() {
    // La clau API ara s'injecta i gestiona de forma segura des del backend (Supabase Edge Function).
    // Això oculta la clau completament de l'usuari final (Fix O2 - Arquitectura Segura).
    this.model = "gemini-1.5-pro"; // MAX POWER (AI Ultra Plan)

    this.PERSONAS = AGENTS_MAP;
  }

  // --- MESTRE UTILS ---
  
  /**
   * Translates a URL slug or predictable ID into a persona object.
   * e.g., 'vicent-ferris' -> PERSONAS.AGRONOM
   */
  getPersonaBySlug(slug) {
    if (!slug) return null;
    
    // Normalize slug
    const normalizedId = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Manual overrides for known ID structures
    if (normalizedId.includes('iaia') && !normalizedId.includes('ull') && !normalizedId.includes('archon')) return this.PERSONAS.IAIA;
    if (normalizedId.includes('vicent') || normalizedId.includes('ferris')) return this.PERSONAS.AGRONOM;
    if (normalizedId.includes('pepica') || normalizedId.includes('cuinera')) return this.PERSONAS.CUINERA;
    if (normalizedId.includes('andreu') || normalizedId.includes('capatas')) return this.PERSONAS.CAPATAS;
    if (normalizedId.includes('joan') || normalizedId.includes('batiste')) return this.PERSONAS.ARXIVER;
    if (normalizedId.includes('rato') || normalizedId.includes('super')) return this.PERSONAS.RATO;
    if (normalizedId.includes('sultan')) return this.PERSONAS.SULTAN;
    if (normalizedId.includes('mixa')) return this.PERSONAS.MIXA;
    if (normalizedId.includes('gall')) return this.PERSONAS.GALL;
    if (normalizedId.includes('banana') || normalizedId.includes('nano')) return this.PERSONAS.NANOBANANA;
    if (normalizedId.includes('flash')) return this.PERSONAS.FLASH;
    if (normalizedId.includes('viatjant')) return this.PERSONAS.VIATJANT;
    if (normalizedId.includes('beatriz') || normalizedId.includes('ortega')) return this.PERSONAS.BEATRIZ;
    if (normalizedId.includes('carla') || normalizedId.includes('soriano')) return this.PERSONAS.CARLA;
    if (normalizedId.includes('elena') || normalizedId.includes('popova')) return this.PERSONAS.ELENA;
    if (normalizedId.includes('rebost')) return this.PERSONAS.REBOST;
    if (normalizedId.includes('trellat')) return this.PERSONAS.TRELLAT;
    
    // If not found, search by name or role string includes
    for (const key in this.PERSONAS) {
      const p = this.PERSONAS[key];
      const nameMatch = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (nameMatch.includes(normalizedId) || normalizedId.includes(nameMatch)) {
         return p;
      }
    }
    
    return null;
  }

  // setApiKey fue eliminada completamente por requerimientos de seguridad (No se guardan claves en el cliente)

  getMockResponse(personaKey, query, imageData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) return { error: true, message: "Persona no trobada per a la simulació." };

    if (imageData) {
       return {
         error: false,
         text: `(Simulació Visual) Ai fill meu, que bonica la foto! Però tinc activat el Mode Simulació O2 i no veig res, només siluetes bategades!`,
         persona: persona.name,
         avatarName: persona.avatarName,
         type: persona.type,
         is_mock: true,
       };
    }

    const q = query.toLowerCase();
    const isGenesis = q.includes("genesis") || q.includes("directives") || q.includes("directiva");

    const mockResponses = {
      AGRONOM: isGenesis ? "Xe! El GÈNESI és la llei del camp digital. Tot ha de tindre utilitat social." : "La terra vol trellat. Esmunyeix la blanqueta i cuida la llimera!",
      CUINERA: isGenesis ? "El GÈNESI diu que no es malbarata res, ni un píxel! Utilitat a la cassola." : "Ací no es tira res! Amb eixes sobres et faig un arròs al forn de categoría.",
      CAPATAS: isGenesis ? "Directiva GENESIS: Utilitat Social o purga nuclear. Fila recte." : "Neteja el tros i no perdes el temps. La faena és la faena.",
      ARXIVER: isGenesis ? "El codi GENESIS és la constitució rural. Res de bategats buits." : "Mestre, la burocràcia és densa. Em faran falta tres segells póliza abans de processar el document.",
      RATO: "Cric-cric... He rastrejat el territori en Mode Simulació. Vitaminat!",
      SULTAN: "Buf! Bua! Mode Seguretat Actiu. Protegint la masia de peticions duplicades.",
      MIXA: "Mèu... Vaig saltant de node en node pel Rhizome simulat.",
      GALL: "Quiquiriquí! Alerta de bategat fosc: Estàs funcionant en Mode Local!",
      NANOBANANA: "Açò necessita el Ritu de l'Abundància en Mode Simulació!",
      FLASH: "Ordre rebuda. Executant petició ràpida en local... Fet.",
      VIATJANT: "Porte novetats de fora! Però sense internet real, poc et puc comptar.",
      REBOST: "Tinc el perol al foc però m'han tallat la llenya (API Offline)!",
      TRELLAT: "Veredicte en mode simulat: Et falta un poquet d'imaginació.",
    };

    return {
      error: false,
      text: mockResponses[personaKey] || "Santuari de la Saviesa Rural (Mode Simulat: Sense Connexió Real).",
      persona: persona.name,
      avatarName: persona.avatarName,
      type: persona.type,
      is_mock: true,
    };
  }

  /**
   * Crida al model Gemini amb una personalitat específica i suport per a imatges/àudio.
   */
  async ask(personaKey, query, imageData = null, audioData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) throw new Error(`Persona ${personaKey} no trobada.`);

    // [MASTER RESILIENCY] Avaluació de caiguda offline o mode dev
    const isSimulation = localStorage.getItem("isPlaygroundMode") === "true" || localStorage.getItem("sb-simulation-mode") === "true";

    if (isSimulation) {
      // logger.debug(`[Gemini] Mode Simulació activat per a ${persona.name}. Retornant *mock*.`);
      await new Promise((r) => setTimeout(r, 1000));
      return this.getMockResponse(personaKey, query, imageData);
    }

    // logger.debug(`[Gemini] Consultant a ${persona.name}...`);

    try {
      // Si enviem àudio, la query textual podria ser buida o servir de context
      const textQuery = query.trim() || (audioData ? "Atent a l'àudio adjunt." : "Hola.");
      const parts = [{ text: textQuery }];

      if (imageData) {
        parts.push({
          inline_data: {
            mime_type: imageData.mimeType,
            data: imageData.data,
          },
        });
      }

      // [INTEGRACIÓ WALKIE-TALKIE] Audio direct a Gemini API
      if (audioData) {
        parts.push({
          inline_data: {
            mime_type: audioData.mimeType || 'audio/webm',
            data: audioData.data,
          },
        });
      }

      const geminiPayload = {
        contents: [{ role: 'user', parts: parts }],
        system_instruction: { parts: [{ text: persona.systemPrompt + "\n\nDIRECTIVA MASTER OBLIGATÒRIA: Retalla la xerrameca. Si l'usuari et diu simplement 'Bon dia' o fa un comentari molt curt, respon de forma igualment breu, amb una sola frase natural. La longitud de la teua resposta ha de ser estrictament proporcional a la longitud i complexitat de l'usuari. Actua de forma conversacional i directa." }] }
      };

      // Funcio auxiliar d'errors no-reintentables
      class NonRetryableError extends Error {
        constructor(message) { super(message); this.name = "NonRetryableError"; }
      }

      // [RESILIÈNCIA AL MAS] Validem pes client-side per protegir d'esgotar dades innecessàriament
      const payloadString = JSON.stringify(geminiPayload);
      if (payloadString.length > 5 * 1024 * 1024) {
        throw new NonRetryableError("L'arxiu multimèdia és massa pesat i col·lapsarà la xarxa (limitat a ~4.5MB).");
      }

      // [RESISTÈNCIA DE XARXA] Reintents exponencials per a fallades mòbils rurals
      const executeWithRetry = async (task, maxRetries = 2) => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await task();
          } catch (err) {
            if (err.name === "NonRetryableError") throw err;
            if (attempt === maxRetries) throw err;
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            // logger.warn(`[Resiliència] Connectivitat perduda. Reintentant en ${delay.toFixed(0)}ms...`);
            await new Promise(r => setTimeout(r, delay));
          }
        }
      };

      let rawText = "No hi ha resposta.";

      // [PONT LLUM DIRECTA] Si tenim clau API local, prioritzem el funcionament autònom
      const localApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const shouldUseLocalKey = localApiKey && localApiKey !== 'your_new_gemini_api_key_here';

      rawText = await executeWithRetry(async () => {
        if (shouldUseLocalKey) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${localApiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payloadString
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                if (response.status === 400 || response.status === 413 || response.status === 429) {
                  throw new NonRetryableError(errData.error?.message || `Error d'API irreversible: ${response.status}`);
                }
                throw new Error("Error en crida directa Gemini"); // Reintentable
            }
            
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No hi ha resposta.";
        } else {
            // [CRITICAL O2 FIX] Cridem a la Edge Function "gemini-proxy" de Supabase
            const { data, error } = await supabase.functions.invoke('gemini-proxy', {
              body: {
                model: this.model,
                geminiPayload: geminiPayload,
                personaKey: personaKey
              }
            });

            if (error) {
              // Supabase Edge Functions retorna error HTTP si falla o hi ha status 4xx/5xx manualment
              if (error.status && [400, 413, 429].includes(error.status)) {
                // Trobem el payload intern de l'error
                try {
                   // Intenta llegir JSON si "error" és de tipus HTTP
                   const errBody = JSON.parse(await error.context?.text());
                   throw new NonRetryableError(errBody.error?.message || `Error Edge Function: ${error.status}`);
                } catch (e) {
                   if (e.name === "NonRetryableError") throw e;
                   throw new NonRetryableError(`Límit de la IAIA excedit o missatge denegat (Status ${error.status}).`);
                }
              }
              // Si no és un error HTTP conegut de refús, podria ser network, que retente
              throw new Error("Fallada de xarxa amb el Proxy: " + error.message);
            }

            if (data?.error) {
               throw new NonRetryableError(data.error.message || "Error a l'API de Gemini (Proxy).");
            }

            return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No hi ha resposta.";
        }
      });
      
      const cleanResponse = DOMPurify.sanitize(rawText, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'blockquote', 'code'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ADD_TAGS: ['cite'],
        ADD_ATTR: ['data-did', 'data-anchor'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover']
      });

      // Batec hàptic d'èxit (simulat o via hapticService)
      if (navigator.vibrate) navigator.vibrate(50);

      return {
        error: false,
        text: cleanResponse,
        persona: persona.name,
        avatarName: persona.avatarName,
        type: persona.type,
      };
    } catch (err) {
      // Fallback final per a l'Arxiver per evitar frustració de l'usuari
      if (personaKey === "ARXIVER") {
        return {
          error: false,
          text: "Mestre, la burocràcia digital m'ha bloquejat la ploma. Però no patisques: pel que veig, aquesta ajuda és clau per al projecte. Revisa els requisits oficials mentre jo netejo el tinter!",
          persona: persona.name,
          avatarName: persona.avatarName,
          type: persona.type,
          is_mock: true,
        };
      }

      logger.error(`[Gemini] Error consultant a ${persona.name}:`, err);

      return {
        error: true,
        message:
          "L'Expert està fent la migdiada (Error de Connexió). Torna-ho a provar en un moment.",
      };
    }
  }



  /**
   * Genera un resum del dia (Newsletter) basat en les publicacions del mur.
   */
  async generateNewsletterSummary(posts) {
    if (!posts || posts.length === 0)
      return "El mur està més tranquil que una migdiada d'agost. No hi ha novetats per resumir.";

    const postsContent = posts
      .map(
        (p, i) =>
          `${i + 1}. [${p.author_name || p.author || "Foraster"}]: ${
            p.content || p.excerpt || ""
          }`,
      )
      .join("\n");

    const query = `Aquestes són les publicacions d'avui al mur de Sóc de Poble:\n\n${postsContent}\n\nFes-me un resum tipus "Cronista del Poble" per als veïns que tenen pressa.`;

    return this.ask("ARXIVER", query);
  }

  /**
   * Genera una recepta o consell per a un producte del mercat.
   */
  async getMarketRecipe(itemTitle, itemDescription = "") {
    const query = `Dona'm un consell breu i graciós en valencià sobre aquest producte del mercat: "${itemTitle}". Descripció: ${itemDescription}. Si és menjar, una recepta ràpida. Si és roba o un altre objecte, com combinar-ho o donar-li un segon ús.`;
    return this.ask("CUINERA", query);
  }
}

export const geminiService = new GeminiService();

```


#### Archivo: `supabase/functions/gemini-proxy/index.ts`
```javascript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-store, no-cache, must-revalidate', // ← nueva capa anti-cache dinámica
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') || `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;
    const isAnon = authHeader === `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    let userId = 'anonymous-guest-user';
    if (!isAnon) {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) userId = user.user.id;
    } else {
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
      userId = `guest-${ip}`;
    }

    // RATE LIMIT → UNA ÚNICA RPC (la magia que rascaba 150-250 ms)
    const { data: rateLimit } = await supabase.rpc('enforce_rate_limit', {
      p_user_id: userId,
      p_max_requests: isAnon ? 10 : 100
    });

    if (rateLimit && rateLimit[0]?.limited) {
      return new Response(
        JSON.stringify({ error: { message: `Límit excedit: ${rateLimit[0].max_requests}/h` } }),
        { status: 429, headers: corsHeaders }
      );
    }

    const { model, geminiPayload, personaKey } = await req.json();

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );

    const data = await response.json();

    // Log ultra-rápido sin bloquear (mejor que Promise.allSettled)
    queueMicrotask(() => {
      supabase.from('api_usage_logs').insert({
        user_id: userId,
        persona_key: personaKey,
        model,
        timestamp: new Date().toISOString(),
        success: !data.error
      }).catch(() => {}); // fail-silent total
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      { status: 500, headers: corsHeaders }
    );
  }
});

```


#### Archivo: `src/powersync/connector.js`
```javascript
import { supabaseService } from '../services/supabaseService';

export class SupabaseConnector {
  async fetchCredentials() {
    const { data: { session } } = await supabaseService.supabase.auth.getSession();
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL || 'https://foo.powersync.com',
      token: session?.access_token ?? ''
    };
  }

  async uploadData() {
    // PowerSync gestiona automàticament uploads para Sync Rules.
    // Lógica para capturar las operaciones a tablas no-sync o Custom CRDT subidas.
    console.log('[PowerSync] Upload check triggered');
  }
}

```


#### Archivo: `src/powersync/schema.js`
```javascript
import { column, Schema, Table } from "@powersync/web";

export const postsTable = new Table(
  {
    uuid: column.text,
    content: column.text,
    author_id: column.text,
    author_entity_id: column.text,
    town_uuid: column.text,
    created_at: column.text,
    images: column.text,
    image_url: column.text,
    type: column.text,
    author_name: column.text,
    bategats_count: column.integer,
    language: column.text,
    // Add other matching columns from Supabase 'posts' table required by UniversalCard
  },
  { indexes: { town: ["town_uuid"] } },
);

export const bategatsTable = new Table(
  {
    post_uuid: column.text,
    user_id: column.text,
    action: column.text,
    delta: column.integer,
    vector_clock: column.text,
  },
  { indexes: { post: ["post_uuid"] } },
);

export const townsTable = new Table({
  id: column.text,
  name: column.text,
  uuid: column.text,
});

export const AppSchema = new Schema({
  posts: postsTable,
  bategats: bategatsTable,
  towns: townsTable,
});

```


#### Archivo: `src/index.css`
```css
@import "tailwindcss";

/* 🏺 SÓC DE POBLE: LA BÍBLIA VISUAL v10.33.2-CANÒNIC [PROTOCOL NOTO]
   Aquest fitxer és el ciment únic. 
*/
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Noto Sans", ui-sans-serif, system-ui, sans-serif,
    "Noto Color Emoji", "Noto Emoji";
  --font-serif: "Noto Sans", serif, "Noto Color Emoji", "Noto Emoji";
  --font-mono: "Noto Sans", monospace, "Noto Color Emoji", "Noto Emoji";
  --font-condensed: "Noto Sans", sans-serif, "Noto Color Emoji", "Noto Emoji";

  /* M3 ADAPTIVE TOKENS - SÓC DE POBLE OFFICIAL */
  --color-primary: #f97316; /* Terracotta (Primary) */
  --color-on-primary: #ffffff;
  --color-primary-container: rgba(249, 115, 22, 0.15);

  --color-secondary: #06b6d4; /* Cyan (Secondary) */
  --color-on-secondary: #000000;
  --color-secondary-container: rgba(6, 182, 212, 0.15);

  --color-surface: #000000;
  --color-on-surface: #ffffff;
  --color-surface-container: rgba(0, 0, 0, 0.7); /* Standard Glass */
  --color-outline: rgba(255, 255, 255, 0.08);

  --radius-m3-large: 28px;
  --radius-m3-medium: 100px; /* Full Rounded / Pill */
  --radius-m3-small: 16px;

  --radius-genesis: var(--radius-m3-large);
  --radius-tactile: var(--radius-m3-small);

  --spacing-header: 56px;
  --spacing-sidebar: 280px;

  --touch-target: 44px;

  /* Gradients Canònics v15 */
  --gradient-bategat: linear-gradient(
    135deg,
    #ff6b00 0%,
    #0ea5e9 100%
  ); /* Orange to Sky Blue */

  /* [SISTEMA DE CAPES Z-INDEX - TAILWIND V4] */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-sidebar: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-max: 999;

  /* SÓC DE POBLE UNIVERSAL CARD TOKENS (No Magic Numbers) */
  --card-max-width: 480px;
  --card-grid-height: 864px;
  --card-list-height: 80px;
  --card-radius: 28px;
}

:root {

  /* [PROTOCOL GÈNESI v10.26.0 - CANÒNIC] */
  --bg-app: #000000;
  --bg-master: #000000;
  --bg-panel: #000000;
  --bg-sidebar: #000000;
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  
  /* [CMS CONFIGURABLE TOKENS - CHAT LIST] */
  --text-chat-snippet: var(--text-main);
  --text-chat-time: var(--text-main);

  --border-master: rgba(255, 255, 255, 0.08);

  /* Hover & Active states */
  --hover-overlay: rgba(255, 255, 255, 0.08);
  --active-overlay: rgba(255, 255, 255, 0.12);

  /* [MAESTRO RULE] Night/Dark Colors */
  --sdp-black: #000000;
  --sdp-white: #ffffff;
  --sdp-orange: #ff6b00;
  --sdp-blue: #0984e3;

  --theme-accent-primary: #0984e3; /* Blau a Nit */
  --on-theme-accent-primary: #ffffff; /* Contrast blanc per llegibilitat al fosc */
  --theme-accent-primary-muted: rgba(9, 132, 227, 0.4);
  --theme-accent-primary-faint: rgba(9, 132, 227, 0.1);

  --theme-accent-secondary: #ff6b00; /* Taronja a Nit */
  --theme-accent-secondary-muted: rgba(255, 107, 0, 0.4);
  --theme-accent-secondary-faint: rgba(255, 107, 0, 0.1);

  --bg-theme-base: var(--bg-app);
  --bg-theme-sidebar: #000000;
  --bg-theme-panel: #000000;
  --text-theme-text: #ffffff;
  --bg-theme-header: #000000;

  /* [FASE 2: GLASSMORPHISM] Night Mode Tokens */
  --glass-bg-dark: rgba(28, 28, 30, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-dark);
}

:root.light {
  /* [PALETA CANÒNICA INVERSA - LLEI 4 COLORS] */
  --bg-app: #f8fafc; /* Blanc/Llum */
  --bg-master: #ffffff;
  --bg-panel: #ffffff;
  --bg-sidebar: #ffffff; /* SENSE TERRACOTTA */
  --text-main: #000000;
  --text-secondary: #000000;
  --text-muted: #4b5563;
  
  /* [CMS CONFIGURABLE TOKENS - CHAT LIST] */
  --text-chat-snippet: var(--text-main);
  --text-chat-time: var(--text-main);

  --border-master: rgba(0, 0, 0, 0.1);

  /* Hover & Active states */
  --hover-overlay: rgba(0, 0, 0, 0.05);
  --active-overlay: rgba(0, 0, 0, 0.08);

  /* Inversió de Variables Directes */
  --sdp-black: #ffffff;
  --sdp-white: #000000;
  --sdp-orange: #0984e3; /* Taronja => Blau */
  --sdp-blue: #ff6b00; /* Blau => Taronja */

  --theme-accent-primary: #ff6b00; /* Taronja de Dia */
  --on-theme-accent-primary: #111827; /* Negre profund per màxim contrast Taronja */
  --theme-accent-primary-muted: rgba(255, 107, 0, 0.4);
  --theme-accent-primary-faint: rgba(255, 107, 0, 0.1);

  --theme-accent-secondary: #0984e3; /* Blau de Dia */
  --theme-accent-secondary-muted: rgba(9, 132, 227, 0.4);
  --theme-accent-secondary-faint: rgba(9, 132, 227, 0.1);

  --bg-theme-base: var(--bg-app);
  --bg-theme-sidebar: #000000; /* CORREGIT: Barra lateral NEGRA en Mode Clar per decisió de disseny */
  --bg-theme-panel: var(--bg-panel);
  --text-theme-text: #000000;
  --bg-theme-header: #000000; /* CORREGIT: Header SEMPRE clar encara que estiguem en Mode Clar */

  /* [FASE 2: GLASSMORPHISM] Day Mode Tokens */
  --glass-bg-light: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-light);
}

.text-on-accent {
  color: var(--on-theme-accent-primary) ;
}

.text-on-accent-muted {
  color: var(--on-theme-accent-primary) ;
  opacity: 0.85;
}

/* Redundant custom theme utility classes removed as per Audit 2.1 (Tailwind handles them via @theme) */

.card,
.universal-card,
.bg-panel {
  border-radius: var(--radius-genesis) ;
  overflow: hidden;
}

/* [FASE 2: GLASSMORPHISM] Universal Class */
.glass-panel {
  background: var(--glass-theme-bg) ;
  backdrop-filter: var(--glass-blur) ;
  -webkit-backdrop-filter: var(--glass-blur) ;
  border: 1px solid var(--glass-border) ;
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-genesis);
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.modal-content,
.dialog-panel {
  border-radius: var(--radius-genesis) ;
}

/* 📱 COMPORTAMENT TÀCTIL NATIU (v10.30.0 BLUEPRINT) */
html,
body,
#root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--bg-app);
  overflow: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

body {
  touch-action: pan-x pan-y;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: var(--font-sans);
  font-stretch: 75%; /* Equivalent exacte al disseny "Condensed" (62.5% = Extra Condensed, 100% = Normal) */
  font-size: 1.25rem; /* [ACCESSIBILITAT SUPREMA v15] Augmentat per a llegibilitat imponent */
  font-display: swap;
}

/* [ACCESSIBILITAT MESTRA] Regla global per a paràgrafs bategats */
@layer base {
  p {
    font-size: 1.15rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

/* 📜 PROTOCOL TIPOGRÀFIC DOCS - SÓC DE POBLE v1 */
/* Mapeig estricte per a contingut Ric tipus Google Docs */



/* 🧬 ESTRUCTURA SUPREMA (PROTOCOL TABULA RASA v10.30.0) */
.main-viewport {
  flex: 1;
  display: flex;
  position: relative;
  min-width: 0;
}

.flex-container-safe {
  display: flex;
  min-width: 0;
  flex: 1;
}

/* 📱 RESPONSIVE CANÒNIC (Strict Monocolumn < 1024px) */
@media (max-width: 1023px) {
  .sidebar-desktop {
    position: fixed;
    left: 0;
    top: var(--spacing-header, 56px);
    z-index: 1000;
    width: var(--spacing-sidebar);
    height: calc(100dvh - var(--spacing-header, 56px));
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    background: #000000;
  }

  .sidebar-desktop.drawer-open {
    transform: translateX(0);
    box-shadow: 20px 0 60px rgba(0, 0, 0, 0.8);
  }

  /* Backdrop Master */
  .drawer-backdrop {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: none;
    z-index: 1000;
    animation: fade-in 0.3s ease-out;
  }

  .safe-area-padding {
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
  }

  /* Toxic mobile override deleted and Ghost exorcised */
}

/* 🧬 ANIMACIONS CANÒNIQUES (BATEGAT UNIVERSAL) */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.animate-in.fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.bategant {
  animation: pulse-soft 2s infinite ease-in-out;
}

/* 📜 THE ANTIGRAVITY SCROLL v1.0 (SILK SCROLL) */
/* [MODERN SCROLLBARS v10.33.7] */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 0, 0.4);
  background-clip: padding-box;
}

/* Utility to hide scrollbar but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 📜 BÍBLIA: TACTILE GEOMETRY (GEOMETRIA DEL TACTE v10.33.2-CANÒNIC) */
.tactile-target {
  min-height: var(--touch-target);
  min-width: var(--touch-target);
  display: flex;
  align-items: center;
  justify-content: center;
}

.genesis-radius {
  border-radius: 28px ;
}

.card-radius {
  border-radius: var(--radius-genesis) ;
}



.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px) ;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0) ;
}

/* [MASTER CANONIC BUTTONS] Design System GEM MODERN v1.0 */
/* Botó Connectar Canònic (UniversalCard) */
.btn-connect-canonic {
  font-weight: 900 ;
  text-transform: uppercase ;
  font-size: 14px;
  height: 40px;
  padding: 0 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--theme-accent-secondary);
  color: #111827;
  transition: background-color 0.3s ease, transform 0.1s;
}
.btn-connect-canonic:hover {
  background-color: #ea580c;
  cursor: pointer;
}
.btn-connect-canonic:active {
  transform: scale(0.95);
}

.master-button-canonic {
  height: 44px ;
  border-radius: 22px ;
  font-weight: 900 ;
  letter-spacing: 0.05em ;
  text-transform: uppercase ;
  display: flex ;
  align-items: center ;
  justify-content: center ;
  padding: 0 24px ;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ;
}

.master-button-canonic:active {
  transform: scale(0.95);
}

/* [NOTION-DYNAMICS] Folder styling for high-accessibility organization */
.notion-folder {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.notion-folder:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(255, 107, 0, 0.2);
}

.notion-folder .folder-icon {
  font-size: 32px;
  color: #ff6b00;
  margin-bottom: 4px;
}

.notion-folder .folder-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.notion-folder .folder-description {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.5;
}

/* [NOTION-GRID] 28px geometry inspired grid */
.notion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 28px;
}

/* UNIFICACIÓ COLOR DE PÀRRAFS: SEMPRE NEGRE (LIGHT) O BLANC (DARK) */
p {
  color: var(--text-main);
}

/* [CMS GHOST BUTTON FIX] Recuperació tipogràfica per a la purge de Tailwind */
.app-cms-content ul,
.app-cms-content ol {
  list-style: none !important;
  padding-left: 0 !important;
  display: flex !important;
  flex-direction: column;
  gap: 12px;
}

.app-cms-content li {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 20px !important;
  background-color: var(--bg-panel) !important;
  border-left: 6px solid var(--theme-accent-primary) !important;
  border-radius: var(--radius-m3-small);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
  cursor: pointer;
  margin-bottom: 2px !important;
  font-weight: 700;
  color: var(--text-main);
}

.app-cms-content li:hover {
  transform: translateX(4px);
  background-color: var(--theme-accent-primary-faint) !important;
  color: var(--theme-accent-primary);
}

.app-cms-content li:active {
  transform: scale(0.97);
}

```


#### Archivo: `src/design-system/tokens.css`
```css
/* 🔡 PROTOCOL NOTO SANS [MASTER v1.0] 🏛️ */

/* 1. Noto Sans (Principal) */
@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Italic.ttf") format("truetype");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/noto/NotoSans-Black.ttf") format("truetype");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* 2. Noto Sans Condensed (Estalvi d'espai) */
@font-face {
  font-family: "Noto Sans Condensed";
  src: url("/fonts/noto/NotoSans-Condensed.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans Condensed";
  src: url("/fonts/noto/NotoSans-CondensedBold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 3. Noto Sans Mono (Dades i Codi) */
@font-face {
  font-family: "Noto Sans Mono";
  src: url("/fonts/noto/NotoSansMono-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Noto Sans Mono";
  src: url("/fonts/noto/NotoSansMono-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  /* COLORS MESTRES (Sacred Palette - v1.6.3) */
  --sdp-terracotta: #f97316;
  --sdp-blau: #06b6d4;
  --sdp-neon-pulse: #f97316;

  /* CONTRAST WEBER CLASS 6 (Sol Directe) */
  --sdp-bg-dark: #0a0a0a;
  --sdp-bg-surface: #1c1b1f;
  --sdp-text-high: #e6e1e5;
  --sdp-text-med: #938f99;

  /* SUPERFÍCIES GLASSMORPHISM (Gemini Style) */
  --sdp-glass-bg: rgba(28, 27, 31, 0.7);
  --sdp-glass-border: rgba(255, 255, 255, 0.08);
  --sdp-glass-blur: 24px;

  /* BANCAL MODE TOKENS (Sóc de Poble Gènesi - Auditoria X) */
  --sdp-boina-taronja: #f97316;
  --sdp-fons-crema: #fdf5e6;
  --sdp-text-fosc: #111827;
  --sdp-radius-card: 28px;
  --sdp-radius-button: 28px;

  /* GEOMETRIA (Master Monolith v10.30.0) */
  --sdp-radius-lg: var(--sdp-radius-card);
  --sdp-radius-genesis: var(--sdp-radius-card);
  --sdp-radius-tactile: var(--sdp-radius-button);

  /* 🔡 UNIFICACIÓ TIPOGRÀFICA [PROTOCOL NOTO SANS VARIABLE] */
  --sdp-font-sans: "Noto Sans", sans-serif;
  --sdp-font-serif: "Noto Sans", sans-serif;
  --sdp-font-mono: "Noto Sans", monospace;
  --sdp-font-condensed: "Noto Sans", sans-serif;

  /* Variables llegades */
  --sdp-font-booter: var(--sdp-font-sans);
  --sdp-font-playball: var(--sdp-font-sans);
  --sdp-font-pump: var(--sdp-font-sans);
  --sdp-font-dearjoefour: var(--sdp-font-sans);
  --sdp-font-myriadpro: var(--sdp-font-sans);
  --sdp-font-respublica: var(--sdp-font-sans);
}

body {
  font-family: var(--sdp-font-sans);
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

```


#### Archivo: `src/utils/logger.js`
```javascript
const isDev = import.meta.env.DEV;

// [SILENCE PROTOCOL] Master Patterns to suppress
export const SILENCE_PATTERNS = [
    'beforeinstallpromptevent',
    'Banner not shown',
    'shadow host',
    'ShadowRoot',
    'User denied Geolocation',
    'ADVERTIMENT',
    'Self-XSS',
    'Si feu servir aquesta consola',
    '[ThemeEngine]',
    '[BOOT]',
    '[Rhizome]',
    '[Towns]',
    '[Feed]',
    '[SupabaseService]',
    'Applying strict author-territory filter',
    'townId entry',
    'Instant Load',
    'ResizeObserver',
    'React does not recognize',
    'React DevTools',
    'Download the React DevTools',
    '[AuthProvider] Montat',
    'INITIAL_SESSION',
    'Violation',
    "Bypass d'Emergència",
    "TIMEOUT_OPFS",
    "Update on reload",
    "ServiceWorker registration",
    "workbox",
    "Precaching",
    "PWA"
];

export const checkSilence = (msg) => {
    if (!msg) return false;
    let text = typeof msg === 'string' ? msg : '';
    if (!text) {
        try {
            text = JSON.stringify(msg);
        } catch {
            text = String(msg);
        }
    }
    return SILENCE_PATTERNS.some(p => text.includes(p));
};

export const logger = {
    log: (message, ...args) => {
        if (isDev && !checkSilence(message)) {
            console.log(`%c[INFO] ${message}`, 'color: #94a3b8', ...args);
        }
    },
    error: (...args) => {
        if (isDev) console.error(...args);
    },
    warn: (...args) => {
        if (isDev) console.warn(...args);
    },
    info: (...args) => {
        if (isDev) console.info(...args);
    },
    debug: (...args) => {
        if (isDev) console.debug(...args);
    }
};

/**
 * Creates a prefixed logger for a specific component.
 */
export const createLogger = (prefix) => ({
    log: (...args) => logger.log(`[${prefix}]`, ...args),
    error: (...args) => logger.error(`[${prefix}]`, ...args),
    warn: (...args) => logger.warn(`[${prefix}]`, ...args),
    info: (...args) => logger.info(`[${prefix}]`, ...args),
    debug: (...args) => logger.debug(`[${prefix}]`, ...args),
});

export default logger;

```
