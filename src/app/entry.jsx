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




const CURRENT_MASTER_VERSION = APP_VERSION;

import { registerSW } from 'virtual:pwa-register';

async function preBootCheck() {
    const savedVersion = localStorage.getItem("sp_app_version");
    const lastReload = parseInt(localStorage.getItem("sp_last_version_reload") || "0");
    const now = Date.now();

    // Protocol de Prevenció de Bucles
    if (now - lastReload < 10000) {
        return true; 
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch('/version.json?v=' + now, { 
            cache: 'no-store',
            signal: controller.signal
        });
        const data = await res.json();
        clearTimeout(timeoutId);

        const serverVersion = data.version;

        if (savedVersion && serverVersion !== savedVersion) {
            console.warn(`[BOOT] Nova versió detectada (${serverVersion} vs ${savedVersion}). Purgant Zombi...`);
            localStorage.setItem("sp_app_version", serverVersion);
            localStorage.setItem("sp_last_version_reload", now.toString());
            
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const reg of regs) {
                    await reg.unregister();
                }
            }
            
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
            }
            
            window.location.reload(true);
            return false; // No muntar React
        } else if (!savedVersion) {
            localStorage.setItem("sp_app_version", serverVersion || CURRENT_MASTER_VERSION);
        }
    } catch (e) {
        console.warn("[BOOT] Verificació de versió omesa (offline o error).");
    }
    return true; // Continuar amb el muntatge
}

preBootCheck().then((shouldMount) => {
    if (!shouldMount) return;

    registerSW({ immediate: true });

    const container = document.getElementById("root");
    if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);

    window.__SDP_ROOT__.render(
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
                          <CartProvider>
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
        </ErrorBoundary>
    );

    // Signalejar al Failsafe de index.html que hem arrancat amb èxit
    window.__SDP_ROOT_MOUNTED = true;
});

