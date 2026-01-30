import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/config'
import { AppProvider } from './context/AppContext'
import { RescueTool } from './components/RescueTool';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UnifiedStatus from './components/UnifiedStatus';

// --------------------------------------------------------------------
// ANCORA DE SEGURETAT GLOBAL: Evita el ReferenceError si el bundle es carrega parcialment.
// --------------------------------------------------------------------
window.RescueTool = RescueTool;
window.UnifiedStatus = UnifiedStatus;

console.log('[NUCLEAR-BOOT] main.jsx execution started');
window.BOOT_LOG = ['[BOOT] started'];
const addBootLog = (m) => {
  console.log(m);
  window.BOOT_LOG.push(m);
};

window.onerror = (msg, src, lineno, colno, err) => {
  addBootLog(`[FATAL-ERROR] ${msg} at ${src}:${lineno}`);
  alert(`🚨 ERROR CRÍTIC: ${msg}\nEnvia una captura al suport.`);
};

// --------------------------------------------------------------------
// EMERGENCY FIX: Global UnifiedStatus Fallback
// Prevents "White Screen of Death" if stale code references it.
// --------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.UnifiedStatus = UnifiedStatus;
  window.RescueTool = RescueTool; // GLOBAL DEFENSE
  // GLOBAL DEFENSE: Ensure CREATOR_EMAILS is never undefined
  window.CREATOR_EMAILS = window.CREATOR_EMAILS || ['socdepoblecom@gmail.com', 'damimus@gmail.com'];
}

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

// ROBUST SERVICE WORKER REGISTRATION (v1.5.5-resilience-absolute)
// [OPERACIÓ NUCLEAR] Force SW Nuke for v1.5.5 update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('[Cavalleria] SW Unregistered successfully');
    }
  });
}

// Register new SW with cache busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=NUCLEAR-STRIKE-1.5.5-Absolute-Force').then(registration => {
      console.log('[SW] Registered with scope:', registration.scope);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New content available.');
            // We let the user decide with the toast if needed, or wait for next load
          }
        };
      };
    }).catch(error => {
      console.log('[SW] Registration failed:', error);
    });
  });
}


// TROJAN HORSE: If SW sends user to index.html for the rescue tool path, intercept it here.
addBootLog('[BOOT] Path check: ' + window.location.pathname);

try {
  if (window.location.pathname.includes('/rescat') || window.location.pathname.includes('/nuke')) {
    addBootLog('[BOOT] Rendering RescueTool branch');
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <RescueTool />
      </React.StrictMode>
    );
  } else {
    addBootLog('[BOOT] Rendering App branch');
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
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
