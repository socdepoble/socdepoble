import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "./service-worker-manager"; // DESACTIVAT - Sóc de Poble PWA Failsafe

// --- [FAILSAFE PROTOCOL v3] DESACTIVAT ---
// El Service Worker està gestionat ara nativament per Vite PWA sense bucles.
// -----------------------------------------------------------------------------
import "./tokens.css";
import "../i18n/config";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { DesignProvider } from "./context/DesignContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "../components/core/ErrorBoundary";
import { NavigationProvider } from "./context/NavigationContext";
import { SocialProvider } from "./context/SocialContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from "./providers/QueryProvider";

import SafeShell from "../components/core/SafeShell";
import VersionGatekeeper from "../components/core/VersionGatekeeper";
import { I18nProvider } from "./context/I18nContext";
import { ToastProvider } from "../components/ui/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { RealmProvider } from "./context/RealmContext";

import { APP_VERSION } from "../constants";
import { checkSilence } from "../utils/logger";

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




import { preBootCheck } from './preBootCheck';
import { SystemGuardian } from './SystemGuardian';
import { PwaUpdater } from '../components/pwa/PwaUpdater';
import { initGlobalErrorInterceptor } from '../utils/GlobalErrorInterceptor';
import { runArchitectureGuard } from '../core/CoreArchitectureGuard';

initGlobalErrorInterceptor();
runArchitectureGuard();

const CURRENT_MASTER_VERSION = APP_VERSION;

async function bootSequence() {
  if (sessionStorage.getItem('sw_updating')) {
    sessionStorage.removeItem('sw_updating');
  }

  const container = document.getElementById("root");
  if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);

  if (window.__PRE_BOOT_STATE__) {
    await window.__PRE_BOOT_STATE__;
    if (window.__SDP_BOOT_ABORT) return;
  }

  const setStatus = (k, payload) => {
    console.info('[preBoot]', k, payload || '');
  };

  const result = await preBootCheck({ onStatus: setStatus });

  // Si el preBootCheck determina mode readonly, llancem event per a SystemGuardian
  if (result.mode === 'readonly') {
     setTimeout(() => window.dispatchEvent(new CustomEvent('sdp:offline-quarantine')), 100);
  }

  window.__SDP_ROOT__.render(
      <ErrorBoundary fallbackMessage="💀 ROOT CRASH: Fallada Crítica en el Render Inicial">
        <SystemGuardian>
          <QueryProvider>
            <HelmetProvider>
              <BrowserRouter>
              <DesignProvider>
                <ThemeProvider>
                  <I18nProvider>
                    <RealmProvider>
                      <AuthProvider>
                        <SocialProvider>
                          <CartProvider>
                            <NavigationProvider>
                              <ModalProvider>
                                <ToastProvider>
                                  <VersionGatekeeper>
                                    <SafeShell>
                                      <PwaUpdater />
                                      <App />
                                    </SafeShell>
                                  </VersionGatekeeper>
                                </ToastProvider>
                              </ModalProvider>
                            </NavigationProvider>
                          </CartProvider>
                        </SocialProvider>
                      </AuthProvider>
                    </RealmProvider>
                  </I18nProvider>
                </ThemeProvider>
              </DesignProvider>
              </BrowserRouter>
            </HelmetProvider>
          </QueryProvider>
        </SystemGuardian>
      </ErrorBoundary>
  );

  // Signalejar al Failsafe de index.html que hem arrancat amb èxit
  window.__SDP_ROOT_MOUNTED = true;

  // ─── Ocultar App Shell desprès d'hidratar ───
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const shell = document.getElementById('app-shell-fallback');
      if (shell) {
        shell.style.opacity = '0';
        setTimeout(() => shell.remove(), 300);
      }
    });
  });
}

bootSequence();

