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
import SafeShell from './components/SafeShell';
import VersionGatekeeper from './components/VersionGatekeeper';

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

// [RESEMBRA ATÒMICA] Lògica de Sincronització de Versió Segura (v1.11.0-AI-VISION)
const CURRENT_MASTER_VERSION = 'v1.13.0-AI-FULL';
const savedVersion = localStorage.getItem('sp_app_version');

/**
 * [MASTER] performNuclearPurge - Reset atòmic del Mas
 * Segueix el patró: Primer segellar la versió, després purgar.
 */
const performNuclearPurge = (newVersion) => {
  addBootLog(`[NUCLEAR] Seal & Purge sequence initiated for ${newVersion}`);

  // 1. SEGELLAM: Marquem la nova versió abans de res per trencar bucles
  localStorage.setItem('sp_app_version', newVersion);
  localStorage.setItem('sp_nuke_timestamp', Date.now().toString());

  // 2. PURGUEM: Neteja selectiva (mantenim la versió que acabem de posar)
  const keysToKeep = ['sp_app_version', 'sp_nuke_timestamp'];
  Object.keys(localStorage).forEach(key => {
    if (!keysToKeep.includes(key)) localStorage.removeItem(key);
  });

  sessionStorage.clear();

  // 3. CACHES & SW
  if ('caches' in window) {
    caches.keys().then(names => {
      for (let name of names) caches.delete(name);
    });
  }

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.getRegistrations().then(rs => {
        for (let r of rs) r.unregister();
      });
    } catch (e) {
      addBootLog('[NUCLEAR] SW Unregister failed: ' + e.message);
    }
  }

  addBootLog('[NUCLEAR] Purge complete. Reloading Mas...');

  // 4. REINICI: Reload físic per a carregar el nou bategat
  setTimeout(() => {
    window.location.reload(true);
  }, 300);
};

// Emergency Reset Trigger
window.RecordaAtum = () => performNuclearPurge('ATUM_RESET');

// Check Version
if (savedVersion !== CURRENT_MASTER_VERSION) {
  // Si no hi ha versió prèvia, és una instal·lació neta, només segellem
  if (!savedVersion) {
    localStorage.setItem('sp_app_version', CURRENT_MASTER_VERSION);
    addBootLog('[MASTER] Inaugurant el Mas. Versió segellada.');
  } else {
    // Si la versió és diferent, executem el Protocol Nuclear
    performNuclearPurge(CURRENT_MASTER_VERSION);
  }
}

// [PWA DISABLED] Register new SW with cache busting
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`/sw.js?nuke=${CURRENT_MASTER_VERSION}`).then(registration => {
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
*/


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
                <VersionGatekeeper>
                  <SafeShell>
                    <App />
                  </SafeShell>
                </VersionGatekeeper>
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
