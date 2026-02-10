import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './design-system/tokens.css'
import './i18n/config'
import { AppProvider } from './context/AppContext'
import { BrowserRouter } from 'react-router-dom';
import { RescueTool } from './components/RescueTool';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UnifiedStatus from './components/UnifiedStatus';
import { injectSeeds } from './rhizome/seeds';
import SafeShell from './components/SafeShell';
import VersionGatekeeper from './components/VersionGatekeeper';
import { APP_VERSION } from './constants';
import { checkSilence } from './utils/logger';

// [BATEGAT 0ms] Injecció de llavors Rhizome (Oli & Itineraris)
// Usem requestIdleCallback per assegurar que la feina pesada ocorre quan el navegador està lliure,
// evitant qualsevol violació de "Long Task" en el fil de la UI.
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  window.requestIdleCallback(() => {
    injectSeeds().catch(err => console.error('[Rhizome] Error fatal en injecció:', err));
  }, { timeout: 5000 });
} else {
  setTimeout(() => {
    injectSeeds().catch(err => console.error('[Rhizome] Error fatal en injecció:', err));
  }, 2000);
}

// 1. SUPPRESS CONSOLE NOISE (Master Silence)
const addBootLog = (msg) => {
  // En fase BATEGA, redirigim el bootlog a un array global per al RescueTool
  if (!window.__BOOT_LOGS__) window.__BOOT_LOGS__ = [];
  window.__BOOT_LOGS__.push(`[${new Date().toISOString()}] ${msg}`);
  // També ho traem per consola amb estil discret
  console.log(`%c${msg}`, 'color: #9A6C63; font-size: 10px;');
  if (import.meta.env.DEV) {
    console.log(`%c[BOOT] ${msg}`, 'color: #00f2ff; font-weight: bold;');
  }
};

// [SILENT PURGE] Protocol Natiu: Eliminació de qualsevol Service Worker orfe
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    for (const reg of regs) {
      reg.unregister();
      addBootLog('[SW] Service Worker orfe desregistrat silenciosament.');
    }
  });
}

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

// [STORAGE GUARD] Defansa contra fallades de quota/memòria
const safeStorage = {
  get: (key) => {
    try {
      const local = localStorage.getItem(key);
      if (local) return local;
    } catch (e) { /* silent */ }
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  },
  set: (key, val) => {
    let okLocal = false;
    let okSession = false;
    try { localStorage.setItem(key, val); okLocal = true; } catch (e) { /* silent */ }
    try { sessionStorage.setItem(key, val); okSession = true; } catch (e) { /* silent */ }
    return okLocal || okSession;
  },
  clear: () => {
    try { localStorage.clear(); } catch (e) { /* silent */ }
    try { sessionStorage.clear(); } catch (e) { /* silent */ }
    return true;
  }
};

// [RESEMBRA ATÒMICA] Lògica de Sincronització de Versió Segura (SSOT)
const CURRENT_MASTER_VERSION = APP_VERSION;

// Detecció precoç de LocalStorage bloquejat (Mode Privat o Quota Plena)
let isStorageBroken = false;
try {
  localStorage.setItem('iaia_probe', '1');
  localStorage.removeItem('iaia_probe');
} catch (e) {
  isStorageBroken = true;
  addBootLog('[CRITICAL] LocalStorage bloquejat o ple. Entrant en mode Resiliència Suau.');
}

const savedVersion = isStorageBroken ? sessionStorage.getItem('sp_app_version') : safeStorage.get('sp_app_version');

/**
 * [MASTER] performNuclearPurge - Protocol de Reset Atòmic Síncron
 * Neteja multi-capa (SW, Cache, Storage) i bypass de cache de xarxa.
 */
const performNuclearPurge = async (newVersion) => {
  addBootLog(`[NUCLEAR] Iniciant purga total per a ${newVersion}...`);

  // 1. Neteja de Service Workers (SÍNCRONA)
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
        addBootLog('[SW] Service Worker eliminat.');
      }
    } catch (e) { addBootLog('[SW] Error eliminant SW: ' + e.message); }
  }

  // 2. Neteja de Storage & Caches
  try {
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      const names = await caches.keys();
      for (const name of names) await caches.delete(name);
    }
  } catch (e) { /* ignore */ }

  // 3. Marcador de Triple Persistència (Local, Session, i Marker URL)
  safeStorage.set('sp_app_version', newVersion);
  sessionStorage.setItem('sp_app_version', newVersion);
  sessionStorage.setItem('iaia_entry_reload_count', '0');

  addBootLog('[NUCLEAR] Purga completada. Reiniciant dispositiu...');

  // 4. Bypass de Cache Agressiu (Hard Reload + Version Marker)
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('reset', 'true');
  currentUrl.searchParams.set('force_v', Date.now().toString());

  // Forcem reload des de servidor (bypass browser cache) si el navegador ho permet
  window.location.replace(currentUrl.toString());
};

// Emergency Reset Trigger
window.RecordaAtum = (forceVersion) => performNuclearPurge(forceVersion || CURRENT_MASTER_VERSION);

// [CIRCUIT BREAKER V4]
const reloadCount = parseInt(sessionStorage.getItem('iaia_entry_reload_count') || '0');
const isResetUrl = window.location.search.includes('bategat_rescue=true') || window.location.search.includes('rescue=true') || window.location.search.includes('reset=true');

// Lògica de Decisió de Bategat: Prioritzem sessionStorage per a l'estat del bucle
const sessionVersion = sessionStorage.getItem('sp_app_version');

if (!isStorageBroken && savedVersion && savedVersion !== CURRENT_MASTER_VERSION && !isResetUrl && sessionVersion !== CURRENT_MASTER_VERSION) {
  addBootLog(`[GATEKEEPER] Versió obsoleta detectada: ${savedVersion}.`);

  if (reloadCount > 2) {
    addBootLog('[CIRCUIT-BREAKER] Protocol de Seguretat Activat. Aturant bucle forçosament.');
    safeStorage.set('sp_app_version', CURRENT_MASTER_VERSION);
    sessionStorage.setItem('sp_app_version', CURRENT_MASTER_VERSION);
  } else {
    sessionStorage.setItem('iaia_entry_reload_count', (reloadCount + 1).toString());
    performNuclearPurge(CURRENT_MASTER_VERSION);
  }
} else if (isResetUrl || isStorageBroken || savedVersion === CURRENT_MASTER_VERSION || sessionVersion === CURRENT_MASTER_VERSION) {
  // L'app està sincronitzada o en mode rescat
  if (savedVersion !== CURRENT_MASTER_VERSION || sessionVersion !== CURRENT_MASTER_VERSION) {
    safeStorage.set('sp_app_version', CURRENT_MASTER_VERSION);
    sessionStorage.setItem('sp_app_version', CURRENT_MASTER_VERSION);
  }
  sessionStorage.setItem('iaia_entry_reload_count', '0');
  addBootLog('[MASTER] Harmonia de versió confirmada.');
}

// [PWA DISABLED] Protocol de Manteniment (Oli Suau)
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
                    <BrowserRouter>
                      <App />
                    </BrowserRouter>
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
