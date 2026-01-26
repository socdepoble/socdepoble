import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/config'
import { AppProvider } from './context/AppContext'
import RescueTool from './components/RescueTool';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UnifiedStatus from './components/UnifiedStatus';

// --------------------------------------------------------------------
// EMERGENCY FIX: Global UnifiedStatus Fallback
// Prevents "White Screen of Death" if stale code references it.
// --------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.UnifiedStatus = UnifiedStatus;
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

// ROBUST SERVICE WORKER REGISTRATION (v1.5.1-resilience)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=Genesis-1.5.2').then(registration => {
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
if (window.location.pathname.includes('/tools/rescue.html')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RescueTool />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AppProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </React.StrictMode>,
  )
}
