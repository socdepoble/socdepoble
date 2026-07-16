import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { AppDataProvider } from './app/AppDataContext';
import './styles/global.css';
import { registerSW } from 'virtual:pwa-register';

// Registre del Service Worker per garantir funcionament Offline-First
registerSW({ immediate: true });

const isIsolatedRoute = window.location.pathname.startsWith('/finestreta');

if (isIsolatedRoute) {
  import('./sections/finestreta/FinestretaSection').then(({ default: FinestretaSection }) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <FinestretaSection />
      </React.StrictMode>
    );
  });
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <AppDataProvider>
          <App />
        </AppDataProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
