import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./design-system/tokens.css";
import "./i18n/config";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UnifiedStatus from "./components/UnifiedStatus";
import { injectSeeds } from "./rhizome/seeds";
import SafeShell from "./components/SafeShell";
import VersionGatekeeper from "./components/VersionGatekeeper";
import { APP_VERSION } from "./constants";
import { checkSilence } from "./utils/logger";

// [BATEGAT 0ms] Injecció de llavors Rhizome (Oli & Itineraris)
// Usem requestIdleCallback per assegurar que la feina pesada ocorre quan el navegador està lliure,
// evitant qualsevol violació de "Long Task" en el fil de la UI.
if (typeof window !== "undefined" && "requestIdleCallback" in window) {
  window.requestIdleCallback(
    () => {
      injectSeeds().catch((err) => {
        // Silenciós en producció, només log en dev
        if (import.meta.env.DEV) {
          console.error("[Rhizome] Error fatal en injecció:", err);
        }
      });
    },
    { timeout: 5000 },
  );
} else {
  setTimeout(() => {
    injectSeeds().catch((err) => {
      // Silenciós en producció, només log en dev
      if (import.meta.env.DEV) {
        console.error("[Rhizome] Error fatal en injecció:", err);
      }
    });
  }, 2000);
}

// 1. SILENT BOOT (Master Silence)
// No log noise in production.

// [SILENT PURGE] Protocol Natiu
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const reg of regs) {
      reg.unregister();
    }
  });
}

// Global Error Handlers (Silent in Production)
window.onerror = (msg, src, lineno, colno, err) => {
  if (checkSilence(msg) || checkSilence(err)) return true;
  if (import.meta.env.DEV) console.error(`[FATAL] ${msg} at ${src}:${lineno}`);
};

// Console Noise Suppression
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;
const isNoise = (args) => args.some((arg) => checkSilence(arg));

console.warn = (...args) => { if (!isNoise(args)) originalWarn.apply(console, args); };
console.error = (...args) => { if (!isNoise(args)) originalError.apply(console, args); };
console.log = (...args) => { if (!isNoise(args)) originalLog.apply(console, args); };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

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
        console.warn('[BATEGAT SAFETY] Bucle de redirecció detectat. Aturant actualització forçada.');
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
    } else {
        console.log('[BATEGAT UPDATE] Versió desfasada detectada. Sincronitzant el Mas...');
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
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nProvider>
            <AppProvider>
              <ThemeProvider>
                <ToastProvider>
                  <VersionGatekeeper>
                    <SafeShell>
                      <App />
                    </SafeShell>
                  </VersionGatekeeper>
                </ToastProvider>
              </ThemeProvider>
            </AppProvider>
          </I18nProvider>
        </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

