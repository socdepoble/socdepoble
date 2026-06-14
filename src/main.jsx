import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { iniciarLcpTracker } from './utils/lcp-tracker';
import { initThermoConsole } from './utils/thermoConsole';
import App from './App';

// Iniciem el tracker ABANS de muntar React
// (captured: true per a entrades que ja han passat)
iniciarLcpTracker();

// Iniciem la Consola Termodinàmica de la Pedra Seca (Canvas pur, bypass de React)
initThermoConsole();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registre del Service Worker (Offline-First Pedra Seca)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[SW] Registrat correctament:', registration.scope);
      })
      .catch(error => {
        console.warn('[SW] Fallada en el registre:', error);
      });
  });
}