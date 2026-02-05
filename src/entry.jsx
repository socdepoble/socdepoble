import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './design-system/tokens.css'
import './i18n/config'
import { AppProvider } from './context/AppContext'
import { RescueTool } from './components/RescueTool';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UnifiedStatus from './components/UnifiedStatus';
import { injectSeeds } from './rhizome/seeds';

// Intent de injecció de llavors Rhizome (Oli de La Torre & Itineraris)
injectSeeds().catch(err => console.error('[Rhizome] Error fatal en injecció de dades llavor:', err));

// --------------------------------------------------------------------
// NEUTRALITZADOR D'ERRORS EXTERNS (Directiva Master: Silenci Absolut)
// --------------------------------------------------------------------
const SILENCE_PATTERNS = [
  'shadow host',
  'ShadowRoot',
  'extension://',
  'NoteBoolLM',
  'updateActuationOverlay',
  'Failed to find shadow host',
  'Failed to load resource',
  'Uncaught (in promise) Error'
];

const checkSilence = (msg) => {
  if (!msg) return false;
  const message = typeof msg === 'string' ? msg : (msg.message || String(msg));
  return SILENCE_PATTERNS.some(pattern => message.includes(pattern));
};

// 1. SUPPRESS CONSOLE NOISE (Master Silence)
const addBootLog = (msg) => {
  // En fase BATEGA, redirigim el bootlog a un array global per al RescueTool
  if (!window.__BOOT_LOGS__) window.__BOOT_LOGS__ = [];
  window.__BOOT_LOGS__.push(`[${new Date().toISOString()}] ${msg}`);
  // També ho traem per consola amb estil discret
  console.log(`%c${msg}`, 'color: #9A6C63; font-size: 10px;');
};

// Global Error Handlers
window.onerror = (msg, src, lineno, colno, err) => {
  if (checkSilence(msg) || checkSilence(err)) return true; // SILENZIO BRUNO!
  addBootLog(`[FATAL-ERROR] ${msg} at ${src}:${lineno}`);
};

window.onunhandledrejection = (event) => {
  if (checkSilence(event.reason)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
};

// Console Noise Suppression (Doctrine of Maria Esther)
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

const isNoise = (args) => args.some(arg => checkSilence(arg));

console.warn = (...args) => {
  if (isNoise(args)) return;
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  if (isNoise(args)) return;
  originalError.apply(console, args);
};

console.log = (...args) => {
  if (isNoise(args)) return;
  originalLog.apply(console, args);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});


import StatusLoader from './components/StatusLoader';
import { ToastProvider } from './components/ToastProvider';
import { ThemeProvider } from './context/ThemeContext';

// ROBUST SERVICE WORKER REGISTRATION (v1.5.5-resilience-absolute)
// [OPERACIÓ NUCLEAR] Force SW Nuke for v1.5.5 update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
      // console.log('[Cavalleria] SW Unregistered successfully');
    }
  });
}

// [RESEMBRA ATÒMICA/MASTER] Neteja total de Service Workers i Caches per a resiliència
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
      addBootLog('[SW] Purgant Service Worker actiu per a sincronització Master');
    }
  });
}

if ('caches' in window) {
  caches.keys().then(names => {
    for (let name of names) caches.delete(name);
    addBootLog('[CACHE] Memòria cau del navegador purgada');
  });
}

// [RESEMBRA ATÒMICA] Lògica de Sincronització de Versió Segura (v1.6.4-TOTAL-PROPAGATION)
const CURRENT_MASTER_VERSION = 'v1.6.4-TOTAL-PROPAGATION';
const savedVersion = localStorage.getItem('sp_app_version');

// EMERGENCY ATUM: Manual rescue function
window.RecordaAtum = () => {
  console.log('%c[ATUM] PURGA TOTAL FOC I AIGUA ACTIVADA...', 'color: #FF6D23; font-weight: bold; font-size: 14px;');
  localStorage.clear();
  sessionStorage.clear();
  if ('caches' in window) {
    caches.keys().then(names => {
      for (let name of names) caches.delete(name);
    });
  }
  localStorage.setItem('sp_app_version', 'ATUM_RESET');
  window.location.reload(true);
};

// Detect if we just performed a nuke reload to avoid infinite loops
const justReloaded = sessionStorage.getItem('sp_nuke_reload_active');

if (savedVersion !== CURRENT_MASTER_VERSION && !justReloaded) {
  addBootLog(`[MASTER] Transició de versió detectada: ${savedVersion || 'null'} -> ${CURRENT_MASTER_VERSION}`);

  if (savedVersion) {
    addBootLog('[MASTER] Purgant memòria residual per a nova versió...');

    // Set reload flag for this session to break the loop
    sessionStorage.setItem('sp_nuke_reload_active', 'true');

    localStorage.clear();
    localStorage.setItem('sp_app_version', CURRENT_MASTER_VERSION);

    // Small delay before reload to ensure storage is committed
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  } else {
    localStorage.setItem('sp_app_version', CURRENT_MASTER_VERSION);
    addBootLog('[MASTER] Versió fixada. Bategat nominal.');
  }
}

// Clear the reload flag after a successful load to allow future upgrades
if (justReloaded) {
  setTimeout(() => sessionStorage.removeItem('sp_nuke_reload_active'), 1000);
}

// Register new SW with cache busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?nuke=v1.6.3-BATEGA').then(registration => {
      // logger.info('[SW] Registered with scope:', registration.scope);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // console.log('[SW] New content available.');
            // We let the user decide with the toast if needed, or wait for next load
          }
        };
      };
    }).catch(error => {
      // console.log('[SW] Registration failed:', error);
    });
  });
}


// TROJAN HORSE: If SW sends user to index.html for the rescue tool path, intercept it here.
addBootLog('[BOOT] Path check: ' + window.location.pathname);

try {
  if (window.location.pathname.includes('/rescat') || window.location.pathname.includes('/nuke')) {
    addBootLog('[BOOT] Rendering RescueTool branch');
    const container = document.getElementById('root');
    if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);
    window.__SDP_ROOT__.render(
      <React.StrictMode>
        <ThemeDefaultWrapper>
          <RescueTool />
        </ThemeDefaultWrapper>
      </React.StrictMode>
    );
  } else {
    addBootLog('[BOOT] Rendering App branch');
    const container = document.getElementById('root');
    if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);
    window.__SDP_ROOT__.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ThemeProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </ThemeProvider>
          </AppProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
    addBootLog('[BOOT] Render call executed');
  }
} catch (e) {
  addBootLog('[BOOT] RENDER FAILED: ' + e.message);
  alert('Error en el render: ' + e.message);
}

/**
 * Helper to ensure ThemeProvider is available even in rescue mode 
 * but doesn't crash if logic fails.
 */
function ThemeDefaultWrapper({ children }) {
  try {
    return <ThemeProvider>{children}</ThemeProvider>;
  } catch (e) {
    return children;
  }
}
