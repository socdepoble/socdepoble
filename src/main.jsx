import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/config'
import { AppProvider } from './context/AppContext'


import StatusLoader from './components/StatusLoader';

// EMERGENCY CACHE BUSTER for v1.3.1
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      console.log('Unregistering Service Worker to force update:', registration);
      registration.unregister();
    }
  });
}



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
