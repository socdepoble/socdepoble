import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "./service-worker-manager"; // DESACTIVAT - Sóc de Poble PWA Failsafe

// --- [FAILSAFE PROTOCOL v3] FORÇAR DES-REGISTRE DE SERVICE WORKERS ANTICS ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.warn("Failsafe: ServiceWorker eliminat forçosament per trencar el cicle de memòria cau.");
    }
  });
}
// -----------------------------------------------------------------------------
import "./design-system/tokens.css";
import "./i18n/config";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { DesignProvider } from "./context/DesignContext";
import { NavigationProvider } from "./context/NavigationContext";
import { SocialProvider } from "./context/SocialContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

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

// Console Noise Suppression
const originalWarn = console.warn;
const originalError = console.error;
const isNoise = (args) => args.some((arg) => checkSilence(arg));

console.warn = (...args) => { if (!isNoise(args)) originalWarn.apply(console, args); };
console.error = (...args) => { if (!isNoise(args)) originalError.apply(console, args); };



import { I18nProvider } from "./context/I18nContext";
import { ToastProvider } from "./components/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";

const CURRENT_MASTER_VERSION = APP_VERSION;

// Simplified Version Gatekeeper
// [RESILIENT VERSION GATEKEEPER] Protocol de Prevenció de Bucles
const savedVersion = localStorage.getItem("sp_app_version");
const lastReload = parseInt(localStorage.getItem("sp_last_version_reload") || "0");
const now = Date.now();

if (savedVersion && savedVersion !== CURRENT_MASTER_VERSION) {
    // [RESILIENT UPDATE] Si hem intentat recarregar en els últims 30 segons i seguim igual, STOP.
    // Augmentem el llindar perquè en algunes xarxes el reload triga més.
    if (now - lastReload < 60000) { 
        // Silenciat per a desenvolupament per petició de l'usuari
        // if (import.meta.env.DEV) console.warn('[BATEGAT SAFETY] Bucle de redirecció detectat. Aturant actualització forçada.');
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
    } else {
        // if (import.meta.env.DEV) console.log('[BATEGAT UPDATE] Versió desfasada detectada. Sincronitzant el Mas...');
        localStorage.setItem("sp_last_version_reload", now.toString());
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
        window.location.reload();
    }
} else if (!savedVersion) {
    localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
}

const container = document.getElementById("root");
if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);

window.__SDP_ROOT__.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <SocialProvider>
              <DesignProvider>
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
              </DesignProvider>
            </SocialProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Signalejar al Failsafe de index.html que hem arrancat amb èxit
window.__SDP_ROOT_MOUNTED = true;

