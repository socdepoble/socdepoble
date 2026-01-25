import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/config'
import { AppProvider } from './context/AppContext'


import StatusLoader from './components/StatusLoader';

// ROBUST SERVICE WORKER REGISTRATION (v1.3.4-hotfix)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // We append a timestamp to force the browser to treat this as a new file (cache-busting)
    navigator.serviceWorker.register('/sw.js?v=' + Date.now()).then(registration => {
      console.log('[SW] Registered with scope:', registration.scope);

      // Check for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('[SW] New content available; forced reload...');
              // Optional: Force reload if it's a critical update
            } else {
              console.log('[SW] Content is cached for offline use.');
            }
          }
        };
      };
    }).catch(error => {
      console.log('[SW] Registration failed:', error);
    });
  });
}



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
