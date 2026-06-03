// src/main.jsx (opcional, registre explícit si injectRegister: false)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Registre manual del SW (si no ho fa vite-plugin-pwa automàticament)
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.info('[main] SW registrat manualment', reg);
    } catch (e) {
      console.warn('[main] Error registrant SW manualment', e);
    }
  } else {
    console.warn('[main] Service Worker no suportat');
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Registrem en background per no bloquejar el render inicial
registerServiceWorker();
