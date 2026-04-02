import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "./service-worker-manager"; // DESACTIVAT - Sóc de Poble PWA Failsafe

// --- [FAILSAFE PROTOCOL v3] DESACTIVAT ---
// El Service Worker està gestionat ara nativament per Vite PWA sense bucles.
// -----------------------------------------------------------------------------
import "./design-system/tokens.css";
import "./i18n/config";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { DesignProvider } from "./context/DesignContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { NavigationProvider } from "./context/NavigationContext";
import { SocialProvider } from "./context/SocialContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from "./providers/QueryProvider";

import UnifiedStatus from "./components/UnifiedStatus";
import SafeShell from "./components/SafeShell";
import VersionGatekeeper from "./components/VersionGatekeeper";
import { APP_VERSION } from "./constants";
import { checkSilence } from "./utils/logger";

// 1. SILENT BOOT (Master Silence)
// No log noise in production.
// Global Error Handlers (Silent in Production)
window.onerror = (msg, src, lineno, colno, err) => {
  if (checkSilence(msg) || checkSilence(err)) return true;
  if (import.meta.env.DEV) console.error(`[FATAL] ${msg} at ${src}:${lineno}`);
};

// [FAILSAFE PROTOCOL] Capturar i silenciar l'error de Supabase JS "Refresh Token Not Found"
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'AuthApiError' && event.reason.message && event.reason.message.includes('Refresh Token')) {
    console.warn('[BATEGAT SAFETY] Sessió caducada silenciosament (Refresh Token). Supabase gestionarà la sortida.');
    event.preventDefault(); // Evita que l'error trenque la consola en roig
  }
});

// Console Noise Suppression
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;
const originalInfo = console.info;

const isNoise = (args) => args.some((arg) => checkSilence(arg));

console.warn = (...args) => { if (!isNoise(args)) originalWarn.apply(console, args); };
console.error = (...args) => { if (!isNoise(args)) originalError.apply(console, args); };
console.log = (...args) => { if (!isNoise(args)) originalLog.apply(console, args); };
console.info = (...args) => { if (!isNoise(args)) originalInfo.apply(console, args); };



import { I18nProvider } from "./context/I18nContext";
import { ToastProvider } from "./components/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { RealmProvider } from "./contexts/RealmContext";

const CURRENT_MASTER_VERSION = APP_VERSION;

// Simplified Version Gatekeeper
// [RESILIENT VERSION GATEKEEPER] Protocol de Prevenció de Bucles
const savedVersion = localStorage.getItem("sp_app_version");
const lastReload = parseInt(localStorage.getItem("sp_last_version_reload") || "0");
const now = Date.now();

if (savedVersion && savedVersion !== CURRENT_MASTER_VERSION) {
    if (now - lastReload < 120000) { 
        // Resolució del decalatge de versions silenciada per no embrutar la consola amb fantasmes
        // Forçar l'actualització perquè el Gatekeeper pugui avançar i no es quedi encallat 2 minuts.
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
    } else {
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
        localStorage.setItem("sp_last_version_reload", now.toString());
        if ('caches' in window) {
            caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
        }
        window.location.reload(true);
    }
} else if (!savedVersion) {
    localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
}

const container = document.getElementById("root");
if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);

window.__SDP_ROOT__.render(
  <React.StrictMode>
    <ErrorBoundary fallbackMessage="💀 ROOT CRASH: Fallada Crítica en el Render Inicial">
      <QueryProvider>
        <HelmetProvider>
          <BrowserRouter>
          <DesignProvider>
            <ThemeProvider>
              <I18nProvider>
                <RealmProvider>
                  <AuthProvider>
                    <SocialProvider>
                      <NavigationProvider>
                        <ModalProvider>
                          <ToastProvider>
                            <VersionGatekeeper>
                              <SafeShell>
                                <App />
                              </SafeShell>
                            </VersionGatekeeper>
                          </ToastProvider>
                        </ModalProvider>
                      </NavigationProvider>
                    </SocialProvider>
                  </AuthProvider>
                </RealmProvider>
              </I18nProvider>
            </ThemeProvider>
          </DesignProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Signalejar al Failsafe de index.html que hem arrancat amb èxit
window.__SDP_ROOT_MOUNTED = true;

