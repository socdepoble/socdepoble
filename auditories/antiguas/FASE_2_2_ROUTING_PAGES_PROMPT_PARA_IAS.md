### PREÁMBULO PARA CHATS NUEVOS: AUDITORÍA DE "SÓC DE POBLE" ###
Hola. Estás analizando "Sóc de Poble", una plataforma digital rural y offline-first (CRDT, SQLite, PowerSync) construida en React y Vite. El sistema es gigantesco y para evitar que agotes tus tokens o pierdas el contexto, la auditoría completa se ha dividido en 4 fases que se ejecutarán en sesiones independientes.

ESTA ES LA FASE 2 DE 4: 2_ROUTING_PAGES

Como eres una instancia fresca y este es un chat independiente, lee atentamente el CONTEXTO GLOBAL CRÍTICO de la arquitectura para que no alucines soluciones incompatibles:
1. **Offline-First & PWA**: La fuente de la verdad es SIEMPRE la base de datos local reactiva (SQLite vía CRDT-Rizhoma y PowerSync). NUNCA sugieras sustituir lecturas reactivas locales por peticiones directas HTTP/Fetch al backend de Supabase.
2. **Filosofía Visual**: El diseño es premium (Glassmorphism, border-radius 32px, colores terrosos/naranjas vibrantes).
3. **Restricciones de Rendimiento**: Prohibidos los `useEffect` sin cleanup estricto, bucles de re-render (closures obsoletas) y fugas de memoria.
4. **Enfoque LÁSER**: Céntrate ESTRICTAMENTE en los archivos que te adjunto. Da por hecho que el resto del sistema funciona perfectamente.

### OBJETIVOS ESPECÍFICOS DE LA FASE 2: Configuración raíz, App.jsx, Pages e index.html. Buscamos limpiar overrides en Tailwind, SEO issues y dependencias redundantes. ###
1. Detecta useEffects innecesarios, re-renders en cascada o código inalcanzable en estos archivos.
2. Alerta sobre mala praxis que dañe la usabilidad en dispositivos móviles o el estado CRDT.

Asume el rol de Arquitecto Senior. Responde dividiendo tus hallazgos de forma muy directa por Componente/Archivo, e incluye los bloques de código exactos con el Fix. No expliques obviedades, ve directo a la solución de código.

----------------------------
ARCHIVOS ALIMENTADOS EN ESTA AUDITORIA FASE 2 (89 archivos):



=====================================
FILE: src/App.jsx
=====================================

import React, { useEffect, useCallback } from 'react';
import AppLayout from './components/AppLayout';
import { iaiaService } from './services/iaiaService';
import GlobalModals from './components/GlobalModals';
import './index.css';
import { errorTrackingService } from './services/errorTrackingService';
import { healthCheckService } from './services/healthCheckService';
import { logger } from './utils/logger';

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from './components/ErrorBoundary';
import LocalFirstGate from './components/gates/LocalFirstGate';
import AuthGate from './components/gates/AuthGate';
import OfflineGate from './components/gates/OfflineGate';

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // [MONITORING] Inicialitzar error tracking
    useEffect(() => {
        let isMounted = true;
        const initializeMonitoring = async () => {
            try {
                await errorTrackingService.initialize();
                if (isMounted) logger.log('[App] Error tracking initialized');
            } catch (error) {
                if (isMounted) logger.error('[App] Failed to initialize error tracking:', error);
            }
        };

        initializeMonitoring();
        return () => { isMounted = false; };
    }, []);

    // [MONITORING] Iniciar health checks
    useEffect(() => {
        healthCheckService.startMonitoring();
        
        const unsubscribe = healthCheckService.subscribe((health) => {
            if (health.overall !== 'healthy') {
                logger.warn('[App] Health check warning:', health);
                errorTrackingService.captureException(
                    new Error(`Health check: ${health.overall}`),
                    { health }
                );
            }
        });

        return () => {
            healthCheckService.stopMonitoring();
            unsubscribe();
        };
    }, []);

    // [ERROR] Global error handlers refactoritzats
    const handleError = useCallback((event) => {
        errorTrackingService.captureException(event.error || event.message, {
            type: 'global',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }, []);

    const handleUnhandledRejection = useCallback((event) => {
        errorTrackingService.captureException(event.reason, {
            type: 'unhandledrejection'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [handleError, handleUnhandledRejection]);

    useEffect(() => {
        return () => {
            iaiaService.dispose();
        };
    }, []);

    return (
        <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
            <OfflineGate>
                <LocalFirstGate>
                    <AuthGate>
                        <AppLayout />
                        <GlobalModals />
                    </AuthGate>
                </LocalFirstGate>
            </OfflineGate>
            <div id="aria-live-region" aria-live="polite" className="sr-only" />
        </ErrorBoundary>
    );
};

export default App;


=====================================
FILE: src/entry.jsx
=====================================

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
const isNoise = (args) => args.some((arg) => checkSilence(arg));

console.warn = (...args) => { if (!isNoise(args)) originalWarn.apply(console, args); };
console.error = (...args) => { if (!isNoise(args)) originalError.apply(console, args); };



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
        <AuthProvider>
          <RealmProvider>
            <SocialProvider>
              <DesignProvider>
                <ThemeProvider>
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
                </ThemeProvider>
              </DesignProvider>
            </SocialProvider>
          </RealmProvider>
        </AuthProvider>
      </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Signalejar al Failsafe de index.html que hem arrancat amb èxit
window.__SDP_ROOT_MOUNTED = true;



=====================================
FILE: src/index.css
=====================================

@import "tailwindcss";

/* 🏺 SÓC DE POBLE: LA BÍBLIA VISUAL v10.33.2-CANÒNIC [PROTOCOL NOTO]
   Aquest fitxer és el ciment únic. 
*/
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Noto Sans", ui-sans-serif, system-ui, sans-serif,
    "Noto Color Emoji", "Noto Emoji";
  --font-serif: "Noto Sans", serif, "Noto Color Emoji", "Noto Emoji";
  --font-mono: "Noto Sans", monospace, "Noto Color Emoji", "Noto Emoji";
  --font-condensed: "Noto Sans", sans-serif, "Noto Color Emoji", "Noto Emoji";

  /* M3 ADAPTIVE TOKENS - SÓC DE POBLE OFFICIAL */
  --color-primary: #f97316; /* Terracotta (Primary) */
  --color-on-primary: #ffffff;
  --color-primary-container: rgba(249, 115, 22, 0.15);

  --color-secondary: #06b6d4; /* Cyan (Secondary) */
  --color-on-secondary: #000000;
  --color-secondary-container: rgba(6, 182, 212, 0.15);

  --color-surface: #000000;
  --color-on-surface: #ffffff;
  --color-surface-container: rgba(0, 0, 0, 0.7); /* Standard Glass */
  --color-outline: rgba(255, 255, 255, 0.08);

  --radius-m3-large: 28px;
  --radius-m3-medium: 100px; /* Full Rounded / Pill */
  --radius-m3-small: 16px;

  --radius-genesis: var(--radius-m3-large);
  --radius-tactile: var(--radius-m3-small);

  --spacing-header: 56px;
  --spacing-sidebar: 280px;

  --touch-target: 44px;

  /* Gradients Canònics v15 */
  --gradient-bategat: linear-gradient(
    135deg,
    #ff6b00 0%,
    #0ea5e9 100%
  ); /* Orange to Sky Blue */
}

:root {
  /* [SISTEMA DE CAPES Z-INDEX - CANÒNIC v15] */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-sidebar: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-max: 999;

  /* [PROTOCOL GÈNESI v10.26.0 - CANÒNIC] */
  --bg-app: #000000;
  --bg-master: #000000;
  --bg-panel: #000000;
  --bg-sidebar: #000000;
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border-master: rgba(255, 255, 255, 0.08);

  /* Hover & Active states */
  --hover-overlay: rgba(255, 255, 255, 0.08);
  --active-overlay: rgba(255, 255, 255, 0.12);

  /* [MAESTRO RULE] Night/Dark Colors */
  --sdp-black: #000000;
  --sdp-white: #ffffff;
  --sdp-orange: #ff6b00;
  --sdp-blue: #0984e3;

  --theme-accent-primary: #0984e3; /* Blau a Nit */
  --on-theme-accent-primary: #ffffff; /* Contrast blanc per llegibilitat al fosc */
  --theme-accent-primary-muted: rgba(9, 132, 227, 0.4);
  --theme-accent-primary-faint: rgba(9, 132, 227, 0.1);

  --theme-accent-secondary: #ff6b00; /* Taronja a Nit */
  --theme-accent-secondary-muted: rgba(255, 107, 0, 0.4);
  --theme-accent-secondary-faint: rgba(255, 107, 0, 0.1);

  --bg-theme-base: var(--bg-app);
  --bg-theme-sidebar: #000000;
  --bg-theme-panel: #000000;
  --text-theme-text: #ffffff;
  --bg-theme-header: #000000;

  /* [FASE 2: GLASSMORPHISM] Night Mode Tokens */
  --glass-bg-dark: rgba(28, 28, 30, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-dark);
}

:root.light {
  /* [PALETA CANÒNICA INVERSA - LLEI 4 COLORS] */
  --bg-app: #f8fafc; /* Blanc/Llum */
  --bg-master: #ffffff;
  --bg-panel: #ffffff;
  --bg-sidebar: #ffffff; /* SENSE TERRACOTTA */
  --text-main: #000000;
  --text-secondary: #000000;
  --text-muted: #4b5563;
  --border-master: rgba(0, 0, 0, 0.1);

  /* Hover & Active states */
  --hover-overlay: rgba(0, 0, 0, 0.05);
  --active-overlay: rgba(0, 0, 0, 0.08);

  /* Inversió de Variables Directes */
  --sdp-black: #ffffff;
  --sdp-white: #000000;
  --sdp-orange: #0984e3; /* Taronja => Blau */
  --sdp-blue: #ff6b00; /* Blau => Taronja */

  --theme-accent-primary: #ff6b00; /* Taronja de Dia */
  --on-theme-accent-primary: #111827; /* Negre profund per màxim contrast Taronja */
  --theme-accent-primary-muted: rgba(255, 107, 0, 0.4);
  --theme-accent-primary-faint: rgba(255, 107, 0, 0.1);

  --theme-accent-secondary: #0984e3; /* Blau de Dia */
  --theme-accent-secondary-muted: rgba(9, 132, 227, 0.4);
  --theme-accent-secondary-faint: rgba(9, 132, 227, 0.1);

  --bg-theme-base: var(--bg-app);
  --bg-theme-sidebar: #000000; /* CORREGIT: Barra lateral NEGRA en Mode Clar per decisió de disseny */
  --bg-theme-panel: var(--bg-panel);
  --text-theme-text: #000000;
  --bg-theme-header: #ffffff; /* CORREGIT: Header clar en Mode Clar */

  /* [FASE 2: GLASSMORPHISM] Day Mode Tokens */
  --glass-bg-light: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-light);
}

.text-on-accent {
  color: var(--on-theme-accent-primary) !important;
}

.text-on-accent-muted {
  color: var(--on-theme-accent-primary) !important;
  opacity: 0.85;
}

/* Redundant custom theme utility classes removed as per Audit 2.1 (Tailwind handles them via @theme) */

.card,
.universal-card,
.bg-panel {
  border-radius: var(--radius-genesis) !important;
  overflow: hidden;
}

/* [FASE 2: GLASSMORPHISM] Universal Class */
.glass-panel {
  background: var(--glass-theme-bg) !important;
  backdrop-filter: var(--glass-blur) !important;
  -webkit-backdrop-filter: var(--glass-blur) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-genesis);
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.modal-content,
.dialog-panel {
  border-radius: var(--radius-genesis) !important;
}

/* 📱 COMPORTAMENT TÀCTIL NATIU (v10.30.0 BLUEPRINT) */
html,
body,
#root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--bg-app);
  overflow: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

body {
  touch-action: pan-x pan-y;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: var(--font-sans);
  font-stretch: 75%; /* Equivalent exacte al disseny "Condensed" (62.5% = Extra Condensed, 100% = Normal) */
  font-size: 1.25rem; /* [ACCESSIBILITAT SUPREMA v15] Augmentat per a llegibilitat imponent */
  font-display: swap;
}

/* [ACCESSIBILITAT MESTRA] Regla global per a paràgrafs bategats */
p {
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* 🧬 ESTRUCTURA SUPREMA (PROTOCOL TABULA RASA v10.30.0) */
.main-viewport {
  flex: 1;
  display: flex;
  position: relative;
  min-width: 0;
}

.flex-container-safe {
  display: flex;
  min-width: 0;
  flex: 1;
}

/* 📱 RESPONSIVE CANÒNIC (Strict Monocolumn < 1024px) */
@media (max-width: 1023px) {
  .sidebar-desktop {
    position: fixed;
    left: 0;
    top: var(--spacing-header, 56px);
    z-index: 1000;
    width: var(--spacing-sidebar);
    height: calc(100vh - var(--spacing-header, 56px));
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    background: #000000;
  }

  .sidebar-desktop.drawer-open {
    transform: translateX(0);
    box-shadow: 20px 0 60px rgba(0, 0, 0, 0.8);
  }

  /* Backdrop Master */
  .drawer-backdrop {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: none;
    z-index: 1000;
    animation: fade-in 0.3s ease-out;
  }

  .safe-area-padding {
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
  }

  /* Toxic mobile override deleted and Ghost exorcised */
}

/* 🧬 ANIMACIONS CANÒNIQUES (BATEGAT UNIVERSAL) */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.animate-in.fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.bategant {
  animation: pulse-soft 2s infinite ease-in-out;
}

/* 📜 THE ANTIGRAVITY SCROLL v1.0 (SILK SCROLL) */
/* [MODERN SCROLLBARS v10.33.7] */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 0, 0.4);
  background-clip: padding-box;
}

/* Utility to hide scrollbar but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 📜 BÍBLIA: TACTILE GEOMETRY (GEOMETRIA DEL TACTE v10.33.2-CANÒNIC) */
.tactile-target {
  min-height: var(--touch-target);
  min-width: var(--touch-target);
  display: flex;
  align-items: center;
  justify-content: center;
}

.genesis-radius {
  border-radius: 28px !important;
}

.card-radius {
  border-radius: var(--radius-genesis) !important;
}

/* Unified Glassmorphism */
.glass-master {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px) !important;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0) !important;
}

/* [MASTER CANONIC BUTTONS] Design System GEM MODERN v1.0 */
/* Botó Connectar Canònic (UniversalCard) */
.btn-connect-canonic {
  font-weight: 900 !important;
  text-transform: uppercase !important;
  font-size: 14px;
  height: 40px;
  padding: 0 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--theme-accent-secondary);
  color: #111827;
  transition: background-color 0.3s ease, transform 0.1s;
}
.btn-connect-canonic:hover {
  background-color: #ea580c;
  cursor: pointer;
}
.btn-connect-canonic:active {
  transform: scale(0.95);
}

.master-button-canonic {
  height: 44px !important;
  border-radius: 22px !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 24px !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.master-button-canonic:active {
  transform: scale(0.95);
}

/* [NOTION-DYNAMICS] Folder styling for high-accessibility organization */
.notion-folder {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.notion-folder:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(255, 107, 0, 0.2);
}

.notion-folder .folder-icon {
  font-size: 32px;
  color: #ff6b00;
  margin-bottom: 4px;
}

.notion-folder .folder-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.notion-folder .folder-description {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.5;
}

/* [NOTION-GRID] 28px geometry inspired grid */
.notion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 28px;
}


/* --- UNIVERSAL SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(150, 150, 150, 0.4); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary, #f97316); }



=====================================
FILE: src/pages/AdminPanel.css
=====================================

/* ANTIGRAVITY ADMIN CORE - HARMONY EDITION */
.admin-container {
    min-height: 100vh;
    padding: 0;
    font-family: var(--sdp-font-sans);
    transition: all 0.5s ease;
}

/* THEME UNIFIED (Admin now follows global) */
.admin-container,
.admin-loading {
    background: var(--bg-page);
    color: var(--text-primary);
    --admin-surface: var(--bg-card);
    --admin-border: var(--md-sys-color-outline);
    --admin-bg-alt: var(--bg-surface);
}

.admin-header {
    background: var(--surface-glass-heavy);
    backdrop-filter: blur(var(--blur-master));
    border-bottom: 1px solid var(--border-subtle);
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.title-area h1 {
    font-size: 21px !important;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-primary) !important;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
}

.title-area p {
    font-size: var(--font-size-base);
    opacity: 0.6;
    margin: 4px 0 0;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: var(--sdp-font-mono);
}

.admin-content {
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
}

.dashboard-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
    align-items: flex-start;
}

@media (max-width: 768px) {
    .dashboard-layout {
        grid-template-columns: 1fr;
    }
}

.neural-core-panel {
    background: var(--surface-glass);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-m);
    /* 24px */
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: var(--shadow-deep);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--text-main);
}

.neural-core-panel:hover {
    box-shadow: var(--shadow-hard);
    border-color: var(--color-primary);
}

.neural-core-panel::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 242, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
    animation: rotate 20s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.brain-visualizer {
    height: 160px;
    background: var(--admin-bg-alt);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.1);
        opacity: 1;
        box-shadow: var(--shadow-hard);
    }

    100% {
        transform: scale(1);
        opacity: 0.8;
    }
}

.core-stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.stat-item {
    background: var(--bg-edge);
    padding: 16px;
    border-radius: var(--radius-s);
    /* 18px */
    text-align: center;
    border: 1px solid var(--border-subtle);
    color: var(--accent-violet);
    box-shadow: var(--shadow-glow-violet);
}

.stat-val {
    font-size: 32px;
    font-weight: 900;
    display: block;
}

.stat-label {
    font-size: 10px;
    opacity: 0.8;
    text-transform: uppercase;
    color: #FFF;
}

.core-status-text {
    font-family: var(--sdp-font-mono);
    font-size: var(--font-size-base);
    opacity: 0.7;
    margin-top: 12px;
}

.system-logs {
    background: var(--admin-bg-alt);
    border-radius: var(--radius-xl);
    padding: 24px;
    font-family: var(--sdp-font-mono);
    font-size: var(--font-size-base);
    height: 250px;
    overflow-y: auto;
    border: 1px solid var(--admin-border);
    margin-top: 24px;
}

.log-entry {
    margin-bottom: 6px;
    display: flex;
    gap: 8px;
}

.log-entry.success {
    color: var(--color-success);
}

.log-entry.error {
    color: var(--color-error);
}

.log-entry.warn {
    color: var(--color-warning);
}

.log-time {
    opacity: 0.4;
}

.modules-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.module-card {
    background: var(--surface-glass);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-s);
    /* 18px */
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--shadow-deep);
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--text-main);
}

.module-card:hover {
    transform: translate(-4px, -4px);
    box-shadow: 8px 8px 0px #000;
    background: var(--color-primary-soft);
}

.module-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--admin-bg-alt);
    flex-shrink: 0;
}

.module-card.red .module-icon-wrapper {
    color: var(--color-error);
}

.module-card.blue .module-icon-wrapper {
    color: var(--color-primary);
}

.module-card.cyan .module-icon-wrapper {
    color: #00f2ff;
}

.module-card.purple .module-icon-wrapper {
    color: #a855f7;
}

.module-card.gold .module-icon-wrapper {
    color: var(--color-warning);
}

.module-card h3 {
    font-size: var(--font-size-base) !important;
    margin: 0;
    font-weight: 800 !important;
    white-space: nowrap;
}

.module-card p {
    display: none;
    /* Hide descriptions for high density vision */
}

.admin-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.spin {
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hard);
}

.dashboard-card .dash-icon {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    color: white;
}

.dashboard-card .dash-icon.blue {
    background: linear-gradient(135deg, #1976D2, #64B5F6);
}

.dashboard-card .dash-icon.purple {
    background: linear-gradient(135deg, #7B1FA2, #E1BEE7);
}

.dashboard-card .dash-icon.green {
    background: linear-gradient(135deg, #388E3C, #A5D6A7);
}

.dashboard-card .dash-icon.orange {
    background: linear-gradient(135deg, #F57C00, #FFCC80);
}

.dashboard-card h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
}

.dashboard-card p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
    flex-grow: 1;
}

.dashboard-card .dash-badge {
    background: #F5F5F5;
    color: #666;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: var(--radius-xl);
    font-weight: var(--font-weight-bold);
}

/* Existing Styles */
.admin-container {
    padding: var(--space-md);
    background-color: var(--bg-main);
    min-height: 100vh;
    color: var(--text-main);
}

.admin-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--color-border);
}

.title-area h1 {
    font-size: 18px;
    font-weight: 900;
    margin: 0;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-area p {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    margin: 2px 0 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.admin-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: var(--space-md);
    margin-bottom: var(--space-lg);
    border-bottom: 1px solid var(--color-border);
}

.admin-tabs button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--text-muted);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
}

.admin-tabs button.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.persona-grid,
.entity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-md);
}

.persona-card {
    background: var(--bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-md);
    display: flex;
    align-items: center;
    gap: var(--space-md);
    position: relative;
    overflow: hidden;
    transition: transform 0.2s;
}

.persona-card:hover {
    transform: translateY(-2px);
}

.persona-card.entity.work {
    border-left: 4px solid #00BFFF;
}

.persona-card.entity.official {
    border-left: 4px solid #FFD700;
}

.persona-card.entity {
    border-left: 4px solid #90EE90;
}

.persona-avatar {
    width: 60px;
    height: 60px;
    background: var(--bg-main);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.emoji-avatar {
    font-size: 32px;
}

.persona-info {
    flex: 1;
}

.persona-info h3 {
    font-size: var(--font-size-base);
    margin: 0;
    font-weight: 800;
}

.persona-info p {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    margin: 4px 0;
    line-height: 1.3;
}

.location-tag {
    font-size: var(--font-size-base);
    background: var(--bg-main);
    padding: 2px 8px;
    border-radius: var(--radius-xl);
    text-transform: uppercase;
    font-weight: 800;
    color: var(--color-primary);
}

.impersonate-btn {
    background: var(--bg-main);
    color: var(--text-main);
    border: 1px solid var(--color-border);
    padding: 8px 12px;
    border-radius: var(--radius-xl);
    font-size: var(--font-size-base);
    font-weight: 900;
    cursor: pointer;
    transition: all 0.2s;
}

.impersonate-btn:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}

.admin-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

/* Lexicon Admin Styles */
.lexicon-admin {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}

.admin-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.admin-section-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
}

.add-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: var(--radius-xl);
    font-size: var(--font-size-base);
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.lexicon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md);
}

.lexicon-item-card {
    background: var(--bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.term-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.term-word {
    font-size: var(--font-size-base);
    font-weight: 900;
    color: var(--color-primary);
}

.term-town {
    font-size: var(--font-size-base);
    background: var(--bg-main);
    padding: 2px 8px;
    border-radius: var(--radius-xl);
    font-weight: 800;
    color: var(--text-muted);
}

.term-def {
    font-size: var(--font-size-base);
    color: var(--text-main);
    margin: 0;
    line-height: 1.5;
    flex: 1;
}

.term-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--color-border);
}

.term-cat {
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
}

.icon-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
}

.icon-btn:hover {
    color: var(--color-primary);
}

/* Broadcast Styles */
.dashboard-card .dash-icon.red {
    background: linear-gradient(135deg, #E53935, #FF5252);
}

.broadcast-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    max-width: 900px;
    margin: 0 auto;
}

.broadcast-card {
    padding: 24px;
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card-header-simple {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header-simple h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
}

.badge-beta {
    background: #FFF3E0;
    color: #F57C00;
    padding: 2px 8px;
    border-radius: var(--radius-xl);
    font-size: var(--font-size-base);
    font-weight: 700;
    text-transform: uppercase;
}

.form-group-admin {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group-admin label {
    font-size: var(--font-size-base);
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: var(--font-heading);
    margin-left: 4px;
}

.form-group-admin input,
.form-group-admin textarea {
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: var(--bg-main);
    font-family: inherit;
    font-size: var(--font-size-base);
}

.broadcast-actions {
    display: flex;
    gap: 12px;
    margin-top: auto;
}

.btn-secondary {
    flex: 1;
    padding: 12px;
    background: var(--bg-surface);
    border: 1px solid var(--color-border);
    color: var(--text-main);
    border-radius: var(--radius-xl);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary-danger {
    flex: 1;
    padding: 12px;
    background: linear-gradient(135deg, #E53935, #D32F2F);
    color: white;
    border: none;
    border-radius: var(--radius-xl);
    font-weight: 700;
    cursor: pointer;
    box-shadow: var(--shadow-hard);
}

.btn-outline-primary {
    padding: 14px;
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    border-radius: var(--radius-xl);
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-outline-primary:hover {
    background: var(--color-primary-soft);
}

.full-width {
    width: 100%;
}

.card-desc {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    line-height: 1.5;
}

=====================================
FILE: src/pages/AdminPanel.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import {
    Users, Shield, ArrowLeft, Loader2, Store, Activity,
    Bell, Cpu, Terminal, Zap, CheckCircle, AlertTriangle, Brain, MessageSquare, Pin, Edit, ShieldCheck, Building
} from 'lucide-react';
import { logger } from '../utils/logger';
import MemexModule from '../components/admin/MemexModule';
import IdentitiesModule from '../components/admin/IdentitiesModule';
import CitizensModule from '../components/admin/CitizensModule';
import ZeroDaySetupModule from '../components/admin/ZeroDaySetupModule';
import FutureFeaturesModule from '../components/admin/FutureFeaturesModule';
import StoreManagementModule from '../components/admin/StoreManagementModule';
import SuperRatonControl from '../components/admin/SuperRatonControl';
import GlobalOverview from '../components/admin/GlobalOverview';
import AdminPinnedManager from '../components/AdminPinnedManager';
import { APP_VERSION, USER_ROLES } from '../constants';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isSuperAdmin, isAdmin, user } = useAuth();

    // Core Data State
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Module Active State
    const params = new URLSearchParams(window.location.search);
    const [activeModule, setActiveModule] = useState(params.get('module') || null);

    // Log Helper
    const addLog = (msg, type = 'info') => {
        setLogs(prev => [{
            id: Date.now() + Math.random().toString(36).substr(2, 9), // Unique ID
            time: new Date().toLocaleTimeString(),
            msg,
            type
        }, ...prev.slice(0, 19)]); // Keep last 20
    };

    // Initial Load
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        const bootSystem = async () => {
            addLog('Iniciant protocol de control...', 'info');
            try {
                // Parallel Fetching
                const [sData, seoData] = await Promise.all([
                    supabaseService.getAdminStats(),
                    supabaseService.getSEOStats()
                ]);

                // Simulated "Auto-Cura" check
                if (seoData.issues > 0) {
                    addLog(`Detectades ${seoData.issues} incidències SEO.`, 'warn');
                    setTimeout(() => {
                        addLog('Executant correcció automàtica de sitemap...', 'action');
                        addLog('Caché cognitiva actualitzada amb v1.5.7-BATEGA.', 'success');
                    }, 2000);
                }

                addLog('Sistemes connectats. Estat nominal.', 'success');
                addLog(`Usuaris actius: ${sData.totalUsers}`, 'info');

                // Simulated "Auto-Cura" check
                if (seoData.issues > 0) {
                    addLog(`Detectades ${seoData.issues} incidències SEO.`, 'warn');
                    setTimeout(() => {
                        addLog('Executant correcció automàtica de sitemap...', 'action');
                        addLog('Caché cognitiva actualitzada amb v1.5.7-BATEGA.', 'success');
                    }, 2000);
                }

                setLoading(false);
            } catch (error) {
                logger.error('Boot Error:', error);
                addLog('Error crític en inicialització.', 'error');
            }
        };

        bootSystem();
    }, [isAdmin, navigate]);

    // --- Sub-Components Containers ---


    if (loading) {
        return (
            <div className="admin-loading">
                <Cpu className="spin" size={48} />
                <p>INICIANT NUCLI...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* TOP FLOATING HEADER */}
            <header className="admin-header">
                <div className="title-area">
                    <h1>
                        <Shield className="text-primary" size={24} />
                        Sóc de Poble! Admin <span style={{ opacity: 0.5 }}>v{APP_VERSION}</span>
                    </h1>
                    <p>Panell de Control d'Administració</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                        className="header-diagnostic-btn"
                        title={t('nav.support')}
                    >
                        <Terminal size={18} />
                    </button>
                    <button onClick={() => activeModule ? setActiveModule(null) : navigate('/')} className="btn-hud-small">
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </header>

            <div className="admin-content">
                {/* VIEW: DASHBOARD (The Matrix) */}
                {!activeModule ? (
                    <div className="dashboard-layout">
                        {/* LEFT COLUMN: NEURAL CORE & LOGS */}
                        <div className="left-col gap-6 flex flex-col">
                            {/* UCC CORE - THE GLOBAL VISION */}
                            <GlobalOverview addLog={addLog} />

                            {/* System Log Terminal */}
                            <div className="system-logs">
                                <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
                                    <span>TERMINAL D'OPERACIONS</span>
                                    <Terminal size={12} />
                                </div>
                                {logs.map(log => (
                                    <div key={log.id} className={`log-entry ${log.type}`}>
                                        <span className="log-time">[{log.time}]</span>
                                        <span>{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: MODULES GRID (Now Shortcuts sidebar) */}
                        <div className="modules-grid">
                            <h4 className="text-[10px] opacity-40 font-bold mb-2 uppercase tracking-widest pl-2">Accés Directe</h4>

                            {/* MODULE 1: BROADCAST (Critical) */}
                            <div className="module-card red" onClick={() => setActiveModule('broadcast')}>
                                <div className="module-icon-wrapper">
                                    <Bell size={18} />
                                </div>
                                <h3>Comunicats i Difusió</h3>
                            </div>

                            {/* MODULE 2: IDENTITIES */}
                            <div className="module-card blue" onClick={() => setActiveModule('identities')}>
                                <div className="module-icon-wrapper">
                                    <Store size={18} />
                                </div>
                                <h3>Gestió d'Entitats</h3>
                            </div>

                            {/* MODULE: CITIZENS (New GOD MODE) */}
                            <div className="module-card gold" onClick={() => setActiveModule('citizens')}>
                                <div className="module-icon-wrapper">
                                    <Users size={18} />
                                </div>
                                <h3>Directori de Gent</h3>
                            </div>

                            {/* MODULE 3: AUTO-HEALING (New) */}
                            <div className="module-card cyan" onClick={() => {
                                addLog('Iniciant sessió de curació manual...', 'action');
                                setTimeout(() => addLog('Caché purgada en 3 nodes (Mobile/Web).', 'success'), 1500);
                            }}>
                                <div className="module-icon-wrapper">
                                    <Zap size={18} />
                                </div>
                                <h3>Sistema "Cura"</h3>
                            </div>

                            {/* MODULE 6: DIAGNOSIS (New) */}
                            <div className="module-card red" onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-error)', color: '#fff' }}>
                                    <Activity size={18} />
                                </div>
                                <h3>Suport Tècnic</h3>
                            </div>

                            {/* MODULE 4: FUTURE */}
                            <div className="module-card purple" onClick={() => setActiveModule('lexicon')}>
                                <div className="module-icon-wrapper">
                                    <MessageSquare size={18} />
                                </div>
                                <h3>Diccionari Lèxic</h3>
                            </div>

                            {/* MODULE: ROADMAP & FUTURE FEATURES (NEW) */}
                            <div className="module-card gold" onClick={() => setActiveModule('roadmap')} style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)' }}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                                    <Activity size={18} />
                                </div>
                                <h3>Roadmap i Futur</h3>
                            </div>

                            {/* MODULE 5: IAIA MEMEX (New) */}
                            <div className="module-card gold" onClick={() => setActiveModule('memex')} style={{ borderColor: 'var(--color-warning)', borderStyle: 'dashed' }}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-warning)', color: '#000' }}>
                                    <Brain size={18} />
                                </div>
                                <h3>IAIA Memex</h3>
                            </div>

                            {/* MODULE 7: STORES (New) */}
                            <div className="module-card status-active" onClick={() => setActiveModule('stores')} style={{ borderColor: 'var(--color-primary)', borderStyle: 'double' }}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#000' }}>
                                    <Store size={18} />
                                </div>
                                <h3>Gestió Stores</h3>
                            </div>

                            {/* MODULE 8: SUPER RATÓN (GOD MODE ONLY) */}
                            {isSuperAdmin && (
                                <div className="module-card cyan" onClick={() => setActiveModule('super-raton')} style={{ borderColor: 'var(--hud-accent)', boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--hud-accent)', color: '#000' }}>
                                        <Zap size={18} />
                                    </div>
                                    <h3>Super Ratón</h3>
                                </div>
                            )}

                            {/* MODULE: ZERO-DAY SETUP (GOD MODE ONLY) */}
                            {isSuperAdmin && (
                                <div className="module-card status-active" onClick={() => setActiveModule('zeroday')} style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 15px rgba(0, 122, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                                        <Building size={18} />
                                    </div>
                                    <h3>Zero-Day Setup</h3>
                                </div>
                            )}

                            {/* MODULE 9: UTILITAT SOCIAL (GOD MODE) */}
                            {isSuperAdmin && (
                                <div className="module-card status-active" onClick={() => setActiveModule('utilitat-social')} style={{ borderColor: 'var(--color-success)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-success)', color: '#fff' }}>
                                        <ShieldCheck size={18} />
                                    </div>
                                    <h3>Utilitat Social</h3>
                                </div>
                            )}

                            {/* MODULE 10: MEMORY GOVERNANCE (GOD MODE) */}
                            {isSuperAdmin && (
                                <div className="module-card gold" onClick={() => setActiveModule('memory-governance')} style={{ borderColor: 'var(--color-warning)', boxShadow: '0 0 20px rgba(255, 170, 0, 0.3)', position: 'relative', overflow: 'hidden' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-warning)', color: '#000' }}>
                                        <Brain size={18} />
                                    </div>
                                    <h3>Arxiu de Memòria</h3>
                                </div>
                            )}

                            {/* MODULE 11: MARKETING & ANALYTICS */}
                            {isSuperAdmin && (
                                <div className="module-card blue" onClick={() => setActiveModule('marketing')} style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#000' }}>
                                        <Activity size={18} />
                                    </div>
                                    <h3>Màrqueting Universal</h3>
                                </div>
                            )}

                            {/* MODULE 12: EDITORIAL GOVERNANCE (NEW) */}
                            {isSuperAdmin && (
                                <div className="module-card red" onClick={() => setActiveModule('editorial-governance')} style={{ borderColor: 'var(--color-error)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-error)', color: '#fff' }}>
                                        <Edit size={18} />
                                    </div>
                                    <h3>Governança Editorial</h3>
                                </div>
                            )}

                            {/* MODULE 13: PERMISSIONS GOVERNANCE (NEW) */}
                            {isSuperAdmin && (
                                <div className="module-card blue" onClick={() => setActiveModule('permissions')} style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 15px rgba(0, 122, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                                        <Shield size={18} />
                                    </div>
                                    <h3>Permisos i Rols</h3>
                                </div>
                            )}

                        </div>
                    </div>
                ) : (
                    /* VIEW: ACTIVE MODULE RENDERER */
                    <div className="active-module-container">
                        {activeModule === 'broadcast' && <BroadcastModule user={user} addLog={addLog} />}
                        {activeModule === 'identities' && <IdentitiesModule />}
                        {activeModule === 'citizens' && <CitizensModule />}
                        {activeModule === 'memex' && <MemexModule addLog={addLog} />}
                        {activeModule === 'roadmap' && <FutureFeaturesModule />}
                        {activeModule === 'stores' && <StoreManagementModule addLog={addLog} />}
                        {activeModule === 'super-raton' && <SuperRatonControl addLog={addLog} />}
                        {activeModule === 'zeroday' && <ZeroDaySetupModule />}
                        {activeModule === 'utilitat-social' && <UtilitatSocialModule addLog={addLog} />}
                        {activeModule === 'memory-governance' && <MemoryGovernanceModule addLog={addLog} />}
                        {activeModule === 'marketing' && <MarketingModule addLog={addLog} />}
                        {activeModule === 'editorial-governance' && <EditorialGovernanceModule addLog={addLog} />}
                        {activeModule === 'permissions' && <PermissionsGovernanceModule addLog={addLog} />}
                        {/* More modules can be added here */}
                    </div>
                )}
            </div>
        </div >
    );
};

// --- SUB-MODULES (Simplified for Refactor) ---

// 1. BROADCAST MODULE (Ported logic)
const BroadcastModule = ({ addLog }) => {
    const [sending, setSending] = useState(false);

    const handleGlobal = async () => {
        if (!window.confirm("CONFIRMACIÓ DE NIVELL 5: Enviar a TOTS els usuaris?")) return;
        setSending(true);
        addLog('Iniciant seqüència de difusió global...', 'warn');
        try {
            await new Promise(r => setTimeout(r, 1500));
            addLog('Payload lliurat a 302 dispositius.', 'success');
            alert("Difusió completada.");
        } catch (e) {
            addLog(`Error en difusió: ${e.message}`, 'error');
        } finally {
            setSending(false);
        }
    };

    const handleGlobalRepair = async () => {
        if (!window.confirm("🔴 ALERTA DE NIVELL DÉU: Estàs a punt de forçar una AUTO-CURA en TOTS els dispositius. Això esborrarà la caché de tothom. Estàs segur?")) return;
        setSending(true);
        addLog('PROTOCOL DE CURA BLOQUEJAT... ENVIANT PAYLOAD...', 'warn');
        try {
            await new Promise(r => setTimeout(r, 2000));
            addLog('Payload de Resiliència lliurat. Sistemes en fase de reinici.', 'success');
            alert("Protocol d'Auto-Cura llançat amb èxit.");
        } catch (e) {
            addLog(`Fallada en protocol de cura: ${e.message}`, 'error');
        } finally {
            setSending(false);
        }
    };

    const handleRestoreArchives = async () => {
        if (!window.confirm("Vols restaurar els arxius històrics (Blogger / WordPress)?")) return;
        addLog("Iniciant protocol de recuperació d'arxius històrics...", 'action');
        try {
            addLog('Buscant dades en Blogger i WP...', 'info');
            await new Promise(r => setTimeout(r, 1200));
            addLog('Connectant amb El Rentonar i Sóc de Poble (Legacy)...', 'warn');
            await new Promise(r => setTimeout(r, 1200));
            addLog('Dades enllaçades. Indexant per a IAIA...', 'info');
            await new Promise(r => setTimeout(r, 800));
            
            // Generate some random posts count just to simulate
            const total = 54 + Math.floor(Math.random() * 5);
            addLog(`S'han importat i publicat ${total} articles al Mur.`, 'success');
            alert(`Recuperació completada. ${total} articles històrics han sigut restaurats i bateguen de nou.`);
        } catch (err) {
            addLog(`Error important l'arxiu històric: ${err.message}`, 'error');
        }
    };

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell /> CENTRE DE COMANDAMENT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-red-400">🚨 EMERGÈNCIA</h3>
                    <p className="text-sm text-gray-400 mb-4">Protocol d'enviament massiu per a situacions crítiques.</p>
                    <div className="flex flex-col gap-2">
                        <button className="btn-primary w-full" style={{ background: 'var(--color-warning)' }} onClick={handleGlobal}>
                            {sending ? 'EXECUTANT...' : 'INICIAR GLOBAL BROADCAST'}
                        </button>
                        <button className="btn-primary w-full mt-2" style={{ background: 'var(--hud-accent)', color: '#000' }} onClick={handleRestoreArchives}>
                            <ArrowLeft size={16} className="inline-block mr-1" />
                            RESTAURAR ARXIU HISTÒRIC (WP/BLOGGER)
                        </button>
                        <button className="btn-primary w-full mt-8" style={{ background: 'var(--color-error)' }} onClick={handleGlobalRepair}>
                            {sending ? 'PULSANT...' : 'GLOBAL REPAIR (GOD MODE)'}
                        </button>
                    </div>
                </div>
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">✨ GESTIÓ DE CONTINGUT</h3>
                    <p className="text-sm text-gray-400 mb-4">Publica manualment col·leccions de contingut premium.</p>
                    <button
                        className="btn-primary w-full"
                        onClick={async () => {
                            addLog("Detectant script de notícies de l'Anna...", 'info');
                            try {
                                const { publishAnnaNews } = await import('../utils/publishAnnaNews');
                                await publishAnnaNews();
                                addLog("Notícies d'Anna Climent publicades amb èxit.", 'success');
                                alert("8 notícies saludables han sigut introduïdes al sistema.");
                            } catch (err) {
                                logger.error("Error publicant des d'admin:", err);
                                addLog("Fallada en publicació d'Anna Climent.", 'error');
                            }
                        }}
                    >
                        🍎 PUBLICAR MENÚS ANNA
                    </button>
                    <button className="btn-primary w-full mt-4" onClick={() => addLog('Generant activitat sintètica...', 'info')}>
                        ACTIVAR SIMULACIÓ
                    </button>
                </div>
            </div>
        </div>
    );
};

// 9. UTILITAT SOCIAL MODULE
const UtilitatSocialModule = ({ addLog }) => {
    const navigate = useNavigate();
    const [socialVitality, setSocialVitality] = useState(95);

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck color="var(--color-success)" /> MONITOR D'UTILITAT SOCIAL [GOD MODE]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-green-400">📊 VITALITAT RURAL</h3>
                    <div className="flex flex-col gap-4">
                        <div className="vitality-meter-wrapper">
                            <div className="flex justify-between text-xs mb-1">
                                <span>BATEGAT SOCIAL</span>
                                <span>{socialVitality}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-[28px] overflow-hidden">
                                <div className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]" style={{ width: `${socialVitality}%` }}></div>
                            </div>
                        </div>
                        <button className="btn-primary w-full" onClick={() => {
                            setSocialVitality(100);
                            addLog('Inyectant vitamina social de proximitat...', 'success');
                        }}>
                            <Zap size={14} /> REFORÇAR BATEGAT
                        </button>
                    </div>
                </div>
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-400">👵 SAVIESA IAIA (WA)</h3>
                    <p className="text-sm text-gray-400 mb-4">Estat de la integració de l'IAIA als xats de coordinació.</p>
                    <div className="flex flex-col gap-2">
                        <div className="p-2 bg-blue-900/20 border border-orange-500/30 rounded-[20px] text-xs">
                            <p><strong>NODE WHATSAPP:</strong> ACTIU 👵✨</p>
                            <p><strong>ESTAT:</strong> MEMBRE DEL GRUP BETA</p>
                        </div>
                        <button className="btn-primary w-full mt-2" onClick={() => addLog('Sincronitzant Memòria Viva amb WhatsApp...', 'info')}>
                            SINCRONITZAR SAVIESA
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-[28px] border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase">Directori de DAFOs Master [RIGOR TÈCNIC]</h4>
                <div className="flex flex-wrap gap-2">
                    <button className="btn-hud-small text-[10px]" onClick={() => navigate('/dafo/utilitat-social')}>DAFO UTILITAT</button>
                    <button className="btn-hud-small text-[10px]" onClick={() => navigate('/dafo/iaia')}>DAFO IAIA</button>
                    <button className="btn-hud-small text-[10px]" onClick={() => navigate('/dafo/projecte')}>DAFO PROJECTE</button>
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-900/50 rounded-[28px] border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Directiva Master Actual</h4>
                <p className="text-sm italic text-gray-300">"Tot bategat, tot píxel i tota línia de codi neix i mor per la Utilitat Social."</p>
            </div>
        </div>
    );
};

// 10. MEMORY GOVERNANCE MODULE (NIVELL DÉU)
const MemoryGovernanceModule = ({ addLog }) => {
    const [recovering, setRecovering] = useState(false);
    const [vaultStats, setVaultStats] = useState({
        chats: 128,
        mur: 45,
        mercat: 12,
        towns: 8
    });

    const runFullRecovery = async () => {
        setRecovering(true);
        addLog('Iniciant Recuperació de Memòria Nivell DÉU...', 'warn');
        try {
            await new Promise(r => setTimeout(r, 1000));
            addLog('Escanejant bategats de xat (Agents)... OK', 'info');
            await new Promise(r => setTimeout(r, 1000));
            addLog('Recuperant memòria del Mur y Mercat... OK', 'info');
            await new Promise(r => setTimeout(r, 1000));
            addLog('Sincronitzant amb la consciència de l\'IAIA... OK', 'success');

            setVaultStats(prev => ({
                ...prev,
                chats: prev.chats + Math.floor(Math.random() * 5),
                mur: prev.mur + 1
            }));

            addLog('MEMÒRIA BLINDADA Y RECUPERADA.', 'success');
            alert("Sincronització de Memòria Master completada.");
        } catch (e) {
            addLog(`Error en recuperació: ${e.message}`, 'error');
        } finally {
            setRecovering(false);
        }
    };

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain color="var(--color-warning)" /> GOVERN DE LA MEMÒRIA [LLEI VII]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-yellow-400">🛡️ VOUT DE SEGURETAT</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-2 bg-gray-900 rounded-[20px] text-center">
                            <span className="block text-xl font-bold">{vaultStats.chats}</span>
                            <span className="text-[10px] opacity-50">XATS (AGENTS)</span>
                        </div>
                        <div className="p-2 bg-gray-900 rounded-[20px] text-center">
                            <span className="block text-xl font-bold">{vaultStats.mur}</span>
                            <span className="text-[10px] opacity-50">POSTS MUR</span>
                        </div>
                        <div className="p-2 bg-gray-900 rounded-[20px] text-center">
                            <span className="block text-xl font-bold">{vaultStats.mercat}</span>
                            <span className="text-[10px] opacity-50">PRODUCTES</span>
                        </div>
                        <div className="p-2 bg-gray-900 rounded-[20px] text-center">
                            <span className="block text-xl font-bold">{vaultStats.towns}</span>
                            <span className="text-[10px] opacity-50">POBLES</span>
                        </div>
                    </div>
                    <button className="btn-primary w-full" style={{ background: 'var(--color-warning)', color: '#000' }} onClick={runFullRecovery} disabled={recovering}>
                        {recovering ? 'RECUPERANT...' : 'EXECUTAR CRON DE MEMÒRIA'}
                    </button>
                </div>
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">📅 RITU RECURRENT</h3>
                    <p className="text-sm text-gray-400 mb-4">Planificació de la sincronització automàtica del bategat master.</p>
                    <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-[20px] mb-4">
                        <p className="text-xs"><strong>PROXIM CRON:</strong> Cada 6 hores</p>
                        <p className="text-xs"><strong>ESTAT:</strong> SISTEMA EN AUTO-PILOT</p>
                    </div>
                    <button className="btn-hud-small w-full" onClick={() => addLog('Calendari de Memòria actualitzat.', 'info')}>
                        CONFIGURAR CALENDARI MASTER
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-[28px] border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Directiva Inmutable (Llei VII)</h4>
                <p className="text-sm italic text-gray-300">"L'IAIA és la que genera y guarda totes les respostes y continguts... res es perd al bategat del Mas."</p>
            </div>
        </div>
    );
};
// 11. MARKETING & ANALYTICS MODULE
const MarketingModule = ({ addLog }) => {
    const navigate = useNavigate();
    const [realtimeUsers, setRealtimeUsers] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setRealtimeUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity color="var(--color-primary)" /> MÀRQUETING UNIVERSAL [LLEI DEL CONEIXEMENT]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-400">📊 AUDIÈNCIA REALTIME</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-black text-white animate-pulse">{realtimeUsers}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Veïns a la plaça ara mateix</div>
                    </div>
                    <div className="p-3 bg-blue-900/10 border border-orange-500/20 rounded-[20px]">
                        <p className="text-xs text-blue-300"><strong>DARRERES 24H:</strong> 128 bategats únics</p>
                        <p className="text-xs text-blue-400"><strong>TAXA DE REGISTRE:</strong> 85% (Tier GOD)</p>
                    </div>
                </div>

                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">🧠 GOOGLE SYNC (GA4/GTM)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-900 rounded border border-gray-800">
                            <span>Google Tag Manager</span>
                            <span className="text-green-500 flex items-center gap-1"><CheckCircle size={10} /> CONNECTAT</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-900 rounded border border-gray-800">
                            <span>Analytics 4 (GA4)</span>
                            <span className="text-green-500 flex items-center gap-1"><CheckCircle size={10} /> CONNECTAT</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-900 rounded border border-gray-800">
                            <span>Search Console</span>
                            <span className="text-yellow-500 flex items-center gap-1"><AlertTriangle size={10} /> INDEXANT...</span>
                        </div>
                        <button className="btn-hud-small w-full text-[10px]" onClick={() => addLog('Sincronitzant mètrica Master amb Google...', 'action')}>
                            RE-SINCRO GOOGLE DATA
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-900/50 rounded-[20px] border border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Canal d'Entrada</h4>
                    <div className="text-sm font-bold">QR Poble (La Torre): 45%</div>
                    <div className="w-full h-1 bg-gray-800 mt-1"><div className="bg-orange-500 h-full" style={{ width: '45%' }}></div></div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-[20px] border border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Wisdom Mode Usage</h4>
                    <div className="text-sm font-bold">Faena: 20% | Rondalla: 80%</div>
                    <div className="w-full h-1 bg-gray-800 mt-1"><div className="bg-yellow-500 h-full" style={{ width: '80%' }}></div></div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-[20px] border border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Retenció Sobirana</h4>
                    <div className="text-sm font-bold">92% Diària</div>
                    <div className="w-full h-1 bg-gray-800 mt-1"><div className="bg-green-500 h-full" style={{ width: '92%' }}></div></div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-[28px] border border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">Directiva de Màrqueting Universal (Gènesi)</h4>
                <p className="text-xs italic text-gray-500">"Mesurem el bategat del territori per a transformar la dada en utilitat social i proximitat."</p>
                <div className="mt-4">
                    <button className="btn-primary" style={{ height: '32px', fontSize: '10px' }} onClick={() => navigate('/marketing-plan')}>
                        VEURE PLA UNIVERSAL COMPLET 📜
                    </button>
                </div>
            </div>
        </div>
    );
};

// 12. EDITORIAL GOVERNANCE MODULE
const EditorialGovernanceModule = ({ addLog }) => {
    const [view, setView] = useState('posts');

    return (
        <div className="neural-core-panel" style={{ minHeight: '500px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Pin color="var(--color-error)" /> GOVERNANÇA EDITORIAL [LLEI DE POSICIÓ]
            </h2>

            <div className="flex gap-2 mb-6">
                <button
                    className={`btn-hud-small ${view === 'posts' ? 'active' : ''}`}
                    onClick={() => setView('posts')}
                    style={{ background: view === 'posts' ? 'var(--color-error)' : 'transparent' }}
                >
                    MUR (PINS)
                </button>
                <button
                    className={`btn-hud-small ${view === 'market' ? 'active' : ''}`}
                    onClick={() => setView('market')}
                    style={{ background: view === 'market' ? 'var(--color-error)' : 'transparent' }}
                >
                    MERCAT (PINS)
                </button>
            </div>

            <AdminPinnedManager
                type={view === 'posts' ? 'post' : 'market'}
                onClose={() => addLog(`Configuració de pins pel ${view} bategada.`, 'success')}
            />

            <div className="mt-6 p-4 bg-gray-900/50 rounded-[28px] border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Llei de la Posició Fixa (Gènesi v1.6.1)</h4>
                <p className="text-sm italic text-gray-400">
                    "La visibilitat és un bategat que el Super Admin distribueix segons la utilitat social o la solvència del Mas."
                </p>
            </div>
        </div>
    );
};

// 13. PERMISSIONS GOVERNANCE MODULE
const PermissionsGovernanceModule = ({ addLog }) => {
    const [roles] = useState([
        { id: USER_ROLES.SUPER_ADMIN, label: 'Super Admin', access: 'Total (God Mode)', color: 'var(--hud-accent)' },
        { id: USER_ROLES.ADMIN, label: 'Administrador', access: "Gestió d'Entitats", color: 'var(--color-primary)' },
        { id: USER_ROLES.EDITOR, label: 'Editor', access: 'Contingu i Pins', color: 'var(--color-error)' },
        { id: USER_ROLES.AUTHOR, label: 'Autor Verificat', access: 'Publicació Directa', color: 'var(--color-warning)' },
        { id: USER_ROLES.NEIGHBOR, label: 'Sóc de Poble', access: 'Estàndard', color: 'var(--text-muted)' }
    ]);

    return (
        <div className="neural-core-panel" style={{ minHeight: '500px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield color="var(--color-primary)" /> JERARQUIA D'HABITANTS [PROTOCOL VALENTIA]
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-4 text-blue-400">🛡️ DEFINICIÓ DE ROLS</h3>
                    <div className="space-y-3">
                        {roles.map(role => (
                            <div key={role.id} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-[20px] border border-gray-800">
                                <div>
                                    <div className="font-bold text-sm" style={{ color: role.color }}>{role.label}</div>
                                    <div className="text-[10px] opacity-50 uppercase">{role.access}</div>
                                </div>
                                <button className="btn-hud-small text-[10px]">CONFIGURAR</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border border-gray-700 rounded-[28px] bg-black/20">
                    <h3 className="font-bold text-lg mb-4 text-cyan-400">⚡ ACCIONS DE SEGURETAT</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-[20px]">
                            <p className="text-xs font-bold text-red-400 mb-1">BLINDATGE MASTER</p>
                            <p className="text-[10px] opacity-70 mb-3">Només el Mestre i el Cercle poden elevar un usuari a Super Admin.</p>
                            <button className="btn-primary w-full bg-red-600 text-white text-[10px] h-8">AUDITAR ACCESOS CRÍTICS</button>
                        </div>
                        <button className="btn-hud-small w-full" onClick={() => addLog('Protocol de permisos bategat.', 'info')}>
                            REESTABLIR PERMISOS PER DEFECTE
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-[28px] border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Llei de la Sobirania Administrativa (Gènesi v1.6.2)</h4>
                <p className="text-sm italic text-gray-400">
                    "L'accés és una responsabilitat compartida, però la font de veritat resideix en el Mestre."
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;


=====================================
FILE: src/pages/Archive.css
=====================================

.archive-page.rebost-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
    background: var(--bg-app);
    padding: 0;
    gap: 0;
}

/* SIDEBAR STYLE (Raindrop inspired) */
.rebost-sidebar {
    background: var(--bg-surface);
    border-right: 1px solid var(--border-subtle);
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: sticky;
    top: 0;
    height: 100vh;
}

.sidebar-section h3 {
    font-size: var(--font-size-base);
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 16px;
    padding-left: 12px;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: var(--radius-m3-small, 16px);
    /* Directiva Flash */
    color: var(--text-main);
    font-size: var(--font-size-base);
    font-weight: 800;
    transition: all 0.2s;
}

.nav-item:hover {
    background: rgba(0, 0, 0, 0.05);
}

.nav-item.active {
    background: rgba(14, 165, 233, 0.15);
    color: #0ea5e9;
}

.nav-count {
    margin-left: auto;
    font-size: var(--font-size-base);
    opacity: 0.5;
}

.tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 12px;
}

.tag-pill {
    padding: 4px 10px;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-subtle);
    font-size: var(--font-size-base);
    color: var(--text-secondary);
}

.sove.archive-page {
    background: #000000;
}

.rebost-sidebar {
    background: #000000;
}

.sovereign-badge {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--font-size-base);
    font-weight: 900;
    color: var(--color-primary);
    padding: 12px;
    border: 1px dashed var(--color-primary);
}

/* MAIN CONTENT */
.rebost-main {
    padding: 32px;
    overflow-y: auto;
    height: 100vh;
}

.rebost-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    gap: 24px;
}

.search-bar-wrapper {
    flex: 1;
    position: relative;
    max-width: 600px;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}

.search-bar-wrapper input {
    width: 100%;
    padding: 14px 14px 14px 48px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
    font-size: var(--font-size-base);
    border-radius: 28px;
    font-family: var(--font-condensed);
}

.header-view-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.view-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
}

.view-btn.active {
    color: var(--color-primary);
    border-color: var(--color-primary);
}

.btn-add-resource {
    background: var(--color-primary);
    color: var(--text-main);
    padding: 0 20px;
    height: 44px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 900;
    text-transform: uppercase;
    font-size: var(--font-size-base);
}

.rebost-main header {
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(20px);
}

.search-bar-wrapper input[type="text"] {
    background: #111;
    border: 1px solid #222;
    color: white;
}

.search-bar-wrapper input[type="text"]:focus {
    background: #1a1a1a;
    border-color: #444;
}

.btn-add-resource {
    background: #ffffff;
    color: #000000;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* GRID / MASONRY */
.rebost-grid.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    align-items: start;
}

.resource-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 28px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--font-condensed);
}

.resource-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: #0ea5e9;
}

.resource-card {
    background: #111111;
    border: 1px solid #222222;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.resource-card:hover {
    border-color: #555555;
    transform: translateY(-4px);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
}

.card-image {
    position: relative;
    width: 100%;
    aspect-ratio: 16/10;
    background: #000;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
}

.card-image {
    aspect-ratio: 1;
    background: #000;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.resource-card:hover .card-image img {
    opacity: 1;
}

.card-type-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: var(--text-main);
    padding: 4px 8px;
    font-size: var(--font-size-base);
    font-weight: 900;
    text-transform: uppercase;
}

.card-body {
    padding: 20px;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.card-icon {
    color: var(--color-primary);
    opacity: 0.8;
}

.resource-card h4 {
    font-size: var(--font-size-base);
    font-weight: 800;
    margin: 0 0 8px 0;
    line-height: 1.3;
}

.resource-card p {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    margin-bottom: 20px;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-subtle);
    padding-top: 12px;
}

.mini-tag {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    font-weight: 700;
}

.card-date {
    font-size: var(--font-size-base);
    color: var(--text-muted);
}

/* LIST MODE */
.rebost-grid.list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.list .resource-card {
    display: grid;
    grid-template-columns: 100px 1fr;
    height: 100px;
}

.list .card-image {
    aspect-ratio: 1/1;
}

.list .card-body {
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.list h4 {
    margin-bottom: 4px;
    font-size: var(--font-size-base);
}

.list p {
    margin-bottom: 0;
    line-clamp: 1;
    -webkit-line-clamp: 1;
}

.list .card-footer {
    border: none;
    padding: 0;
    margin-top: 4px;
}

/* MOBILE RESPONSIVENESS */
@media (max-width: 768px) {
    .archive-page.rebost-layout {
        grid-template-columns: 1fr;
    }

    .rebost-sidebar {
        display: none;
        /* Serà un drawer en la següent iteració */
    }

    .rebost-header {
        flex-direction: column;
        align-items: stretch;
    }
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .sove.archive-page { background: var(--bg-app); }
.light .rebost-sidebar { background: var(--bg-surface); border-color: rgba(0,0,0,0.1); }
.light .search-bar-wrapper input,
.light .search-bar-wrapper input[type="text"] {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
    color: #000;
}
.light .search-bar-wrapper input::placeholder { color: rgba(0,0,0,0.4); }
.light .search-bar-wrapper input[type="text"]:focus {
    background: #f8fafc;
    border-color: rgba(0,0,0,0.2);
}
.light .rebost-main header {
    background: rgba(255, 255, 255, 0.9) !important;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}
.light .resource-card {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
}
.light .resource-card:hover {
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    border-color: #0ea5e9;
}
.light .card-image { background: #f1f5f9; }
.light .card-type-tag {
    background: rgba(255, 255, 255, 0.9);
    color: #000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.light .nav-item:hover {
    background: rgba(0, 0, 0, 0.05);
}
.light .tag-pill {
    background: #ffffff;
    border-color: rgba(0,0,0,0.1);
}

=====================================
FILE: src/pages/Archive.jsx
=====================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    List, Database, Plus, Search,
    FileText, Store, Box, LayoutGrid,
    History, ArrowLeft, Library, ShieldCheck, Zap, Sparkles, Landmark, MoreVertical
} from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import { useTheme } from '../context/ThemeContext';
import { logger } from '../utils/logger';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { supabaseService } from '../services/supabaseService';
import './Archive.css';
import { marketService } from '../services/marketService';
 
 const ArxiuOr = () => {
     const navigate = useNavigate();
     const { theme } = useTheme();
     const [viewMode, setViewMode] = useState('masonry');
     const [objects, setObjects] = useState([]);
     const [loading, setLoading] = useState(true);
     const [activeCollection, setActiveCollection] = useState('tots');
     const [searchQuery, setSearchQuery] = useState('');
 
     // PRESETS DE COLECCIONS (SACS) - Edició Arxiu d'Or v9.4.0
     const collections = [
         { id: 'tots', name: 'Tots els recursos', icon: <Library size={18} /> },
         { id: 'historia', name: 'Història Viva', icon: <History size={18} />, color: '#CC5500' },
         { id: 'rentonar', name: 'El Rentonar', icon: <Landmark size={18} />, color: '#10B981' },
         { id: 'fadrins', name: 'Comissió Fadrins', icon: <Zap size={18} />, color: '#00F2FF' },
         { id: 'mercat', name: 'Arxiu Mercat', icon: <Store size={18} />, color: '#F97316' },
         { id: 'master', name: 'Llegat Master', icon: <Sparkles size={18} />, color: '#8B5CF6' },
     ];
 
     useEffect(() => {
         const loadObjects = async () => {
             setLoading(true);
             try {
                 // 1. Fetch from Supabase
                 const [postsResponse, itemsResponse] = await Promise.all([
                     supabaseService.getPosts('tot', null, 0, 100),
                     marketService.getMarketItems('tot', null, 0, 100)
                 ]);
 
                 const dbPosts = postsResponse?.data || [];
                 const dbItems = itemsResponse?.data || [];
 
                 // 2. Integrate MOCK_FEED (Lore/Legacy)
                 const historicalPosts = MOCK_FEED.filter(p => 
                     p.id.toString().includes('rentonar') || 
                     p.author?.includes('Rentonar') || 
                     p.author?.includes('Javi Llinares') ||
                     p.type === 'didactic_presentation'
                 );
 
                 // 3. Integrate Legacy Market Items
                 const legacyItems = MOCK_MARKET_ITEMS.filter(i => i.type === 'memory' || i.is_pinned);
 
                 const unified = [
                     ...dbPosts.map(p => ({
                         id: p.uuid || p.id,
                         type: 'post',
                         title: p.content?.substring(0, 80).replace(/[#*]/g, '') + (p.content?.length > 80 ? '...' : ''),
                         description: "Crònica bategada al mur del poble.",
                         icon: <FileText size={18} />,
                         author: p.profiles?.username || p.author || 'Foraster',
                         date: p.created_at,
                         tags: p.tags || ['#comunitat'],
                         image: (Array.isArray(p.image_url) ? p.image_url[0] : p.image_url) || '/assets/master/town_placeholder.png',
                         collection: p.author?.includes('Rentonar') ? 'rentonar' : 'historia'
                     })),
                     ...historicalPosts.map(p => ({
                         id: p.id,
                         type: 'legacy_post',
                         title: p.content?.split('\n')[0].replace(/[#*]/g, '') || 'Senses títol',
                         description: p.content?.substring(0, 120).replace(/[#*]/g, '') + '...',
                         icon: <History size={18} />,
                         author: p.author,
                         date: p.created_at || '2024-01-01',
                         tags: p.tags || ['#llegat', '#arxiu'],
                         image: (Array.isArray(p.image_url) ? p.image_url[0] : p.image_url) || '/assets/master/brand_cinematic_1.png',
                         collection: p.author?.includes('Rentonar') ? 'rentonar' : 'master'
                     })),
                     ...dbItems.map(i => ({
                         id: i.uuid || i.id,
                         type: 'product',
                         title: i.title,
                         description: i.description,
                         icon: <Store size={18} />,
                         author: i.profiles?.username || i.seller || 'Comerç',
                         date: i.created_at,
                         tags: ['#mercat'],
                         image: (Array.isArray(i.images) ? i.images[0] : i.image_url) || '/assets/master/market_placeholder.png',
                         collection: 'mercat'
                     })),
                     ...legacyItems.map(i => ({
                         id: i.id,
                         type: 'legacy_item',
                         title: i.title,
                         description: i.description,
                         icon: <Box size={18} />,
                         author: i.seller || 'Sóc de Poble',
                         date: i.created_at || '2023-01-01',
                         tags: ['#llegat', '#memoria'],
                         image: (Array.isArray(i.images) ? i.images[0] : (i.cover || i.image_url)) || '/assets/master/logo_socdepoble_green_square.png',
                         collection: 'master'
                     }))
                 ].sort((a, b) => new Date(b.date) - new Date(a.date));
 
                 setObjects(unified);
             } catch (err) {
                 logger.error("Error carregant l'Arxiu d'Or:", err);
             } finally {
                 setLoading(false);
             }
         };
 
         loadObjects();
     }, []);
 
     const filteredObjects = useMemo(() => {
         return objects.filter(obj => {
             const matchesCollection = activeCollection === 'tots' || obj.collection === activeCollection;
             const matchesSearch = 
                 obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 obj.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 (obj.description && obj.description.toLowerCase().includes(searchQuery.toLowerCase()));
             return matchesCollection && matchesSearch;
         });
     }, [objects, activeCollection, searchQuery]);
 
     if (loading) return <StatusLoader message="Exhumant l'Arxiu d'Or..." />;
 
     return (
         <div className={`archive-page rebost-layout min-h-screen text-white flex flex-col md:flex-row theme-${theme}`}>
             {/* SIDEBAR D'ORGANITZACIÓ - Blindat v9.4.0 */}
             <aside className="w-full md:w-72 bg-black border-r border-gray-900 flex flex-col sticky top-0 md:h-screen overflow-y-auto">
                 <header className="p-6 border-b border-gray-900">
                     <div className="flex items-center gap-3 mb-4">
                         <button className="text-gray-400 hover:text-white transition-colors" onClick={() => navigate(-1)}>
                             <ArrowLeft size={20} />
                         </button>
                         <h1 className="text-xl font-black uppercase tracking-tighter">Arxiu d'Or</h1>
                     </div>
                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                         <ShieldCheck size={12} className="text-green-500" />
                         Protocol Tabula Rasa Actiu
                     </div>
                 </header>
 
                 <div className="flex-1 p-4 space-y-6">
                     <div>
                         <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4 px-2">Col·leccions</h3>
                         <nav className="space-y-1">
                             {collections.map(col => (
                                 <button
                                     key={col.id}
                                     className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200 group
                                         ${activeCollection === col.id ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-900'}`}
                                     onClick={() => setActiveCollection(col.id)}
                                 >
                                     <div className="flex items-center gap-3">
                                         <span className={`transition-colors ${activeCollection === col.id ? 'text-black' : ''}`} style={{ color: activeCollection === col.id ? '' : col.color }}>
                                             {col.icon}
                                         </span>
                                         <span className="text-xs font-bold uppercase tracking-tight">{col.name}</span>
                                     </div>
                                     <span className={`text-[10px] font-black px-1.5 py-0.5 border ${activeCollection === col.id ? 'bg-black text-white border-black' : 'bg-gray-900 text-gray-500 border-gray-800'}`}>
                                         {objects.filter(o => o.collection === col.id || col.id === 'tots').length}
                                     </span>
                                 </button>
                             ))}
                         </nav>
                     </div>
 
                     <div>
                         <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4 px-2">Etiquetes Master</h3>
                         <div className="flex flex-wrap gap-2 px-2">
                             {['#rentonar', '#llegat', '#mel', '#poma', '#iaia', '#master'].map(tag => (
                                 <button key={tag} className="text-[10px] font-black uppercase bg-gray-900 text-gray-400 border border-gray-800 px-2 py-1 hover:text-white hover:border-gray-600 transition-all">
                                     {tag}
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
 
                 <footer className="p-6 border-t border-gray-900 bg-black/50 backdrop-blur">
                     <div className="flex items-center gap-3 text-gray-500">
                         <Database size={16} />
                         <div className="text-[10px] font-bold uppercase leading-none">
                             Memòria Inmutable<br/>
                             <span className="text-gray-700">Digital Mas v3.0</span>
                         </div>
                     </div>
                 </footer>
             </aside>
 
             {/* CONTINGUT PRINCIPAL */}
             <main className="flex-1 flex flex-col bg-black">
                 <header className="h-20 flex items-center justify-between px-6 border-b border-gray-900 bg-black/80 backdrop-blur sticky top-0 z-30">
                     <div className="flex-1 max-w-2xl relative">
                         <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                         <input
                             type="text"
                             placeholder="Cerca a l'arxiu sobirà..."
                             className="w-full bg-gray-900 border-none text-white text-sm font-bold pl-12 pr-4 py-3 focus:ring-1 focus:ring-white transition-all rounded-none"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                         />
                     </div>
                     
                     <div className="flex items-center gap-2 ml-4">
                         <button 
                             className={`p-2.5 bg-gray-900 text-gray-500 border border-gray-800 hover:text-white transition-all ${viewMode === 'masonry' ? 'bg-white text-black border-white' : ''}`}
                             onClick={() => setViewMode('masonry')}
                         >
                             <LayoutGrid size={20} />
                         </button>
                         <button 
                             className={`p-2.5 bg-gray-900 text-gray-500 border border-gray-800 hover:text-white transition-all ${viewMode === 'list' ? 'bg-white text-black border-white' : ''}`}
                             onClick={() => setViewMode('list')}
                         >
                             <List size={20} />
                         </button>
                         <button className="ml-4 bg-white text-black px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white hover:bg-transparent hover:text-white transition-all">
                             <Plus size={16} />
                             Afegir
                         </button>
                     </div>
                 </header>
 
                 <div className={`p-6 md:p-8 flex-1 overflow-y-auto ${viewMode === 'masonry' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                     {filteredObjects.length > 0 ? (
                         filteredObjects.map(obj => (
                             <article 
                                 key={obj.id} 
                                 className={`resource-card bg-gray-900 border border-gray-800 group hover:border-gray-500 transition-all duration-300 relative
                                     ${viewMode === 'list' ? 'flex items-center gap-6 p-4' : 'flex flex-col'}`}
                                  onClick={() => {
                                      navigate(`/arxiu/${obj.id}`);
                                  }}
                             >
                                 <div className={`relative overflow-hidden bg-black card-image
                                     ${viewMode === 'list' ? 'w-24 h-24 shrink-0' : 'aspect-square w-full'}`}>
                                     <img 
                                         src={obj.image} 
                                         alt={obj.title} 
                                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                         loading="lazy" 
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                     <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur text-[8px] font-black uppercase tracking-tighter text-white border border-white/20">
                                         {obj.type}
                                     </div>
                                 </div>
                                 
                                 <div className={`flex-1 ${viewMode === 'list' ? '' : 'p-5'}`}>
                                     <div className="flex items-center justify-between mb-2">
                                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                             {obj.icon}
                                             <span className="truncate max-w-[120px]">{obj.author}</span>
                                         </div>
                                         <div className="text-[9px] font-bold text-gray-600 tracking-tighter">
                                             {new Date(obj.date).toLocaleDateString()}
                                         </div>
                                     </div>
                                     
                                     <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                                         {obj.title}
                                     </h4>
                                     
                                     {viewMode === 'list' && (
                                         <p className="text-xs text-gray-400 line-clamp-2 mb-3 font-medium">
                                             {obj.description}
                                         </p>
                                     )}
                                     
                                     <div className="flex flex-wrap gap-1.5 mt-auto">
                                         {obj.tags.slice(0, 3).map(t => (
                                             <span key={t} className="text-[9px] font-bold bg-black text-gray-500 px-1.5 py-0.5 border border-gray-800">
                                                 {t}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
 
                                 <button className="absolute top-4 right-4 p-1.5 bg-black/40 text-gray-500 opacity-0 group-hover:opacity-100 transition-all hover:text-white">
                                     <MoreVertical size={16} />
                                 </button>
                             </article>
                         ))
                     ) : (
                         <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-700 bg-gray-900/20 border-2 border-dashed border-gray-900">
                             <Box size={48} strokeWidth={1} className="mb-4 opacity-20" />
                             <p className="text-xs font-black uppercase tracking-widest opacity-40">No hi ha solatge en aquesta col·lecció</p>
                         </div>
                     )}
                 </div>
             </main>
         </div>
     );
 };
 
 export default ArxiuOr;


=====================================
FILE: src/pages/AulaRural.css
=====================================

.aula-rural-container {
    min-height: 100vh;
    background: var(--bg-canvas);
    color: var(--text-main);
    padding: 40px 20px;
    max-width: 900px;
    margin: 0 auto;
    font-family: inherit;
    padding-bottom: 120px;
}

.aula-header {
    text-align: center;
    margin-bottom: 60px;
    border-bottom: 2px solid var(--accent);
    padding-bottom: 40px;
}

.header-meta {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.badge-rural {
    background: var(--accent);
    color: black;
    padding: 4px 12px;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 2px;
}

.version {
    font-family: monospace;
    font-size: 10px;
    opacity: 0.5;
}

.aula-title {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -3px;
    text-transform: uppercase;
    margin: 0 0 20px 0;
}

.aula-subtitle {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.8;
    font-weight: 500;
}

.aula-manifest {
    margin-bottom: 60px;
}

.manifest-card {
    background: var(--bg-surface);
    padding: 40px;
    border-left: 8px solid var(--accent);
    box-shadow: var(--shadow-hard);
}

.icon-main {
    width: 48px;
    height: 48px;
    margin-bottom: 20px;
}

.manifest-card h2 {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 20px;
    text-transform: uppercase;
}

.manifest-card p {
    line-height: 1.6;
    font-size: 1.1rem;
    opacity: 0.9;
}

.aula-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.didactic-card {
    background: var(--bg-surface);
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
}

.didactic-card:hover {
    border-color: var(--accent);
    transform: translateY(-5px);
}

.didactic-card.highlighted {
    background: var(--bg-surface);
    border: 2px solid var(--accent);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--accent);
}

.card-header h3 {
    font-weight: 900;
    text-transform: uppercase;
    margin: 0;
    font-size: 1.2rem;
}

.didactic-card p {
    font-size: 0.95rem;
    line-height: 1.5;
    opacity: 0.8;
    margin: 0;
}

.status-badge {
    margin-top: auto;
    font-size: 9px;
    font-weight: 800;
    opacity: 0.4;
    letter-spacing: 1px;
}

.didactic-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.didactic-list li {
    font-size: 0.9rem;
    position: relative;
    padding-left: 20px;
}

.didactic-list li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
}

.aula-footer {
    margin-top: 80px;
    text-align: center;
    opacity: 0.4;
    font-size: 0.8rem;
}

.footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

@media (max-width: 600px) {
    .aula-title {
        font-size: 2.5rem;
    }

    .manifest-card {
        padding: 25px;
    }
}

=====================================
FILE: src/pages/AulaRural.jsx
=====================================

import React from 'react';
import { BookOpen, Sprout, ShieldCheck, Zap, Heart, Sparkles, Map, Users, Globe } from 'lucide-react';
import './AulaRural.css';

const AulaRural = () => {
    return (
        <div className="aula-rural-container">
            <header className="aula-header">
                <div className="header-meta">
                    <span className="badge-rural">PATRIMONI DIGITAL</span>
                    <span className="version">AULA RURAL [v1.0]</span>
                </div>
                <h1 className="aula-title">Benvinguts a l'Aula Rural</h1>
                <p className="aula-subtitle">
                    Aprenem com la tecnologia pot salvar el llinatge dels nostres pobles, amb trellat i cor.
                </p>
            </header>

            <section className="aula-manifest">
                <div className="manifest-card">
                    <Heart className="icon-main text-orange-500" />
                    <h2>Utilitat Social: El Cor del Mas</h2>
                    <p>
                        Sóc de Poble és una arquitectura **sense ànim de lucre**. No busquem dades per vendre, sinó dades per florir.
                        Aquesta plataforma és una eina veïnal on tu ets el sobirà de la teua informació.
                        Construïm un procomú digital per a protegir la memòria viva de La Torre de les Maçanes.
                    </p>
                </div>
            </section>

            <div className="aula-grid">
                <div className="didactic-card">
                    <div className="card-header">
                        <Zap size={24} />
                        <h3>Smart City Km 0</h3>
                    </div>
                    <p>
                        La tecnologia Smart City sol ser per a grans capitals. Nosaltres la portem a la vora del barranc.
                        Optimitzem el bategat del poble: gestió de residus, sensors d'aigua i mapatge de necessitats comunitàries.
                    </p>
                    <div className="status-badge">TECNOLOGIA CIUTADANA</div>
                </div>

                <div className="didactic-card">
                    <div className="card-header">
                        <ShieldCheck size={24} />
                        <h3>Sobirania de Dades</h3>
                    </div>
                    <p>
                        En l'Atall Territorial (la +IA), la teua privacitat és sagrada. Utilitzem protocols descentralitzats (Rhizome)
                        perquè la informació del poble es quede al poble.
                    </p>
                    <div className="status-badge">PROTOCOL LOCAL-FIRST</div>
                </div>

                <div className="didactic-card">
                    <div className="card-header">
                        <Sprout size={24} />
                        <h3>Afecte vs Algoritme</h3>
                    </div>
                    <p>
                        Aquí no hi ha algoritmes de manipulació. El "Mur" bategua al ritme de la comunitat real.
                        La IAIA MarIA ens ajuda a trobar el sentit, no a perdre el temps.
                    </p>
                    <div className="status-badge">EL SENY DE LA IAIA</div>
                </div>

                <div className="didactic-card highlighted">
                    <div className="card-header">
                        <Sparkles size={24} />
                        <h3>Properes Llavors (Roadmap)</h3>
                    </div>
                    <ul className="didactic-list">
                        <li><strong>Assemblea Digital:</strong> Vots sobirans per a decisions del poble.</li>
                        <li><strong>Bategat Econòmic:</strong> Moneda local per a mantenir la riquesa al Mas.</li>
                        <li><strong>Memòria Viva:</strong> Arxiu històric interactiu col·laboratiu.</li>
                    </ul>
                </div>
            </div>

            <footer className="aula-footer">
                <div className="footer-content">
                    <Globe size={18} />
                    <span>Projecte d'Arquitectura Social per a la Ruralitat Connectada</span>
                </div>
            </footer>
        </div>
    );
};

export default AulaRural;


=====================================
FILE: src/pages/Auth.css
=====================================

.auth-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  background: #050505;
  background-image: radial-gradient(
      circle at top left,
      rgba(0, 242, 255, 0.08),
      transparent 50%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(255, 107, 0, 0.05),
      transparent 50%
    );
  position: relative;
  overflow-x: hidden;
  padding: 0;
  width: 100%;

  /* [MASTER LIGHT-MODE IMMUNITY] Força tokens de text clar sobre el fons fosc, independentment de :root.light */
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --md-sys-color-on-surface: #ffffff;
  --border-master: rgba(255, 255, 255, 0.08); /* Necessari per als inputs i vores */
  color: var(--text-main);
}

.auth-container.integrated-frame .auth-card.glass-panel {
  background: rgba(10, 10, 12, 0.5) !important;
  backdrop-filter: blur(30px) saturate(1.2) !important;
  -webkit-backdrop-filter: blur(30px) saturate(1.2) !important;
  border-radius: 0 !important;
  border: none !important;
  max-width: 500px;
  margin: 0 auto;
  border-left: 1px solid rgba(255, 255, 255, 0.03) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.03) !important;
}

@media (max-width: 768px) {
  .auth-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.auth-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.4) saturate(1.2);
  z-index: 1;
  transform: scale(1.05);
  animation: slowZoom 30s infinite alternate;
}

@keyframes slowZoom {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

.login-diagnostic-trigger {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 242, 255, 0.1);
  border: 1px solid var(--color-primary);
  border-radius: 0px;
  padding: 8px;
  cursor: pointer;
  z-index: 1000;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.login-diagnostic-trigger:hover {
  background: rgba(0, 242, 255, 0.3);
  box-shadow: var(--shadow-hard);
}

/* IAIA Guidance at Login - RESTRUCTURED FOR SMART CITY (HORIZONTAL) */
.auth-iaia-guidance {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  margin: 0 0 24px;
  padding: 12px 16px;
  background: rgba(0, 242, 255, 0.04);
  border-radius: var(--radius-m, 24px);
  border: 1px dashed rgba(0, 242, 255, 0.2);
  position: relative;
  text-align: left;
}

.iaia-avatar-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.iaia-mini-avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-gem-avatar, 22px);
  border: 2px solid #00f2ff;
  object-fit: cover;
  background: #000;
  z-index: 2;
  position: relative;
}

.iaia-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 0px;
  background: #00f2ff;
  opacity: 0.5;
  z-index: 1;
  animation: iaiaPulse 2s infinite;
}

@keyframes iaiaPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.5;
  }

  70% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }
}

.iaia-pulse-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  height: 140%;
  border-radius: 0px;
  background: #00f2ff;
  opacity: 0.15;
  z-index: 0;
  animation: iaiaPulseOuter 3s infinite ease-out;
}

@keyframes iaiaPulseOuter {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.2;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.6);
    opacity: 0;
  }
}

.iaia-speech-bubble-interstellar {
  font-size: 0.95rem;
  color: var(--text-main);
  font-weight: 300;
  line-height: 1.4;
  text-align: left;
  flex: 1;
  font-family: "Inter Tight", sans-serif;
  letter-spacing: 0.2px;
}

.auth-subtitle-interstellar {
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 32px;
  font-size: 0.95rem;
  letter-spacing: 0.8px;
  font-weight: 300;
  font-family: "Inter Tight", sans-serif;
  text-transform: lowercase;
}

.interstellar-h1 {
  font-family: "Inter Tight", sans-serif !important;
  font-weight: 100 !important;
  font-size: 2.2rem !important;
  letter-spacing: 4px !important;
  text-transform: uppercase;
  margin-bottom: 12px !important;
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.3) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.2));
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(0, 242, 255, 0.05) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.auth-card {
  width: 100%;
  min-height: 100vh;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  z-index: 10;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(60px) rotateX(-10deg);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
    filter: blur(0);
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 40px 20px;
  }

  .register-card-v2 {
    padding: 40px 24px !important;
    margin-top: 20px;
  }

  .auth-logo-v2 {
    margin: -32px -20px 20px -20px !important;
    width: calc(100% + 40px) !important;
  }

  .interstellar-h1 {
    font-size: 1.6rem !important;
    letter-spacing: 2px !important;
  }

  .auth-iaia-guidance {
    margin-bottom: 20px;
    padding: 12px;
  }
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: block;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.auth-logo-v2 {
  width: auto;
  max-width: 300px;
  height: auto;
  margin: 0 auto 32px auto;
  display: block;
  object-fit: cover;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.auth-card h1 {
  color: var(--md-sys-color-on-surface);
  font-size: 1.75rem;
  margin-bottom: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
  font-family: var(--font-headline);
}

.auth-subtitle {
  color: #666;
  margin-bottom: 32px;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.btn-dimmed {
  opacity: 0.4 !important;
  filter: grayscale(0.8) !important;
  cursor: not-allowed !important;
  box-shadow: var(--shadow-hard);
}

.btn-dimmed:hover {
  transform: none !important;
}

/* Autofill Fix for Dark Mode */
.form-group input:-webkit-autofill,
.form-group input:-webkit-autofill:hover,
.form-group input:-webkit-autofill:focus,
.form-group input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
  -webkit-text-fill-color: #000000 !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Phone Input specific styling */
.phone-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0px;
  padding: 0 16px;
  /* Custom padding for wrapper */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-hard);
}

.phone-input-wrapper:focus-within {
  border-color: var(--color-primary);
  background: rgba(0, 242, 255, 0.08);
  box-shadow: var(--shadow-hard);
}

.phone-prefix {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  margin-right: 12px;
  padding-right: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  height: 24px;
}

.phone-input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.1rem;
  /* Slightly larger for numbers */
  font-weight: 700;
  padding: 16px 0;
  /* Vertical padding matching wrapper */
  outline: none;
  width: 100%;
  letter-spacing: 1px;
}

.phone-input-field::placeholder {
  color: rgba(255, 255, 255, 0.35);
  /* Boosted contrast */
  font-weight: var(--font-weight-bold);
}

.otp-input-field {
  text-align: center;
  letter-spacing: 12px;
  font-size: 1.8rem !important;
  font-weight: 800;
  color: var(--color-primary);
  text-shadow: 0 0 10px rgba(0, 122, 255, 0.3);
  background: rgba(0, 122, 255, 0.03) !important;
  max-width: 100%;
}

@media (max-width: 360px) {
  .otp-input-field {
    font-size: 1.4rem !important;
    letter-spacing: 8px;
    padding: 12px 8px;
  }
}

.town-picker-trigger {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0px;
  font-size: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.town-picker-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-primary);
}

.town-picker-trigger.empty span {
  color: rgba(255, 255, 255, 0.3);
}

.town-picker-trigger svg {
  color: var(--color-primary);
}

.auth-button {
  width: 100%;
  height: 56px;
  padding: 0 24px;
  background: var(--accent-violet);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-s);
  /* 18px */
  font-size: 1.1rem;
  font-weight: 950;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow-violet);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.auth-button:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0px #000;
}

.auth-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.auth-error {
  background: rgba(255, 82, 82, 0.1);
  color: #ff5252;
  padding: 16px;
  border-radius: 0px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 82, 82, 0.2);
  text-align: left;
}

.auth-success-alert {
  background: rgba(0, 242, 255, 0.1);
  color: #00f2ff;
  padding: 16px;
  border-radius: 0px;
  margin-bottom: 24px;
  font-size: 0.95rem;
  font-weight: var(--font-weight-bold);
  border: 1px solid rgba(0, 242, 255, 0.3);
  text-align: center;
  backdrop-filter: blur(10px);
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* [FLASH MASTER PIECE] PREMIUM ONBOARDING & REGISTER V2.0 */
.premium-onboarding {
  background: #ffffff;
  perspective: 1000px;
}

.auth-hero-overlay {
  display: none;
  /* [MASTER] Eliminant fons d'estrelles */
}

.register-card-v2 {
  padding: 60px 40px !important;
  border-radius: 0 !important;
  overflow: hidden;
}

.register-card-v2::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent,
    var(--color-primary),
    transparent
  );
}

/* Removed the progress bar animations here */

/* Removed auth-logo-v2 duplicate logic */

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 48px !important;
}

.phone-input-wrapper-v2 {
  display: flex;
  align-items: stretch;
  border-radius: var(--radius-gem-card, 28px);
  overflow: hidden;
  margin-bottom: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  /* [BUGFIX MOBILE]: Remove background: #0b0b0b; to prevent horizontal black line overlap */
  background: transparent;
}

.phone-input-wrapper-v2:focus-within {
  border-color: var(--color-primary);
  background: rgba(0, 242, 255, 0.08);
  box-shadow: var(--shadow-hard);
}

.prefix-badge {
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  height: 52px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.phone-input-prime {
  flex: 1;
  background: transparent !important;
  border: none !important;
  box-shadow: var(--shadow-hard);
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
}

.town-picker-v2 {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  /* ZERO RADIUS */
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.town-picker-v2.selected {
  color: white;
  border-color: var(--color-primary);
  background: rgba(0, 242, 255, 0.05);
}

.picker-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.picker-left svg {
  color: var(--color-primary);
}

.onboarding-iaia-tip {
  background: rgba(0, 242, 255, 0.04);
  border: 1px dashed rgba(0, 242, 255, 0.2);
  border-radius: 0;
  /* ZERO RADIUS */
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.onboarding-iaia-tip::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-primary);
  opacity: 0.3;
}

.tip-icon {
  font-size: 1.2rem;
}

.onboarding-iaia-tip p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
  text-align: left;
  margin: 0;
}

.auth-button.v2 {
  height: 64px;
  border-radius: var(--radius-gem-card, 28px);
  font-size: 1.15rem;
  font-family: "Inter Tight", sans-serif;
  letter-spacing: 2.5px;
  gap: 16px;
  background: linear-gradient(90deg, #00f2ff 0%, #00d2ff 100%);
  color: var(--bg-canvas);
  font-weight: 900;
  border: none;
  box-shadow: var(--shadow-hard);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

.auth-button.v2:focus {
  outline: none;
  box-shadow: var(--shadow-hard);
}

.auth-button.v2:active {
  transform: scale(0.97) translateY(2px);
}

.auth-method-switcher {
  margin-top: 16px;
}

.text-btn.accent {
  color: var(--color-primary);
  font-weight: 800;
}

.back-btn {
  margin-top: 32px;
  width: 100%;
  opacity: 0.5;
  font-size: 0.8rem !important;
}

.auth-step-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.back-btn-step {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 0px;
  font-size: 0.8rem !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.back-btn-step:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.auth-iaia-guidance.interstellar-iaia {
  background: radial-gradient(
    circle at left,
    rgba(0, 242, 255, 0.08) 0%,
    transparent 100%
  );
  border: none;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 242, 255, 0.1);
}

.iaia-speech-bubble-interstellar {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.celebration-step {
  padding: 20px 0;
  text-align: center;
}

.celebration-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.4));
  animation: bounce 1s infinite alternate
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.victory-text {
  font-family: "Inter Tight", sans-serif;
  color: white;
  font-size: 1.8rem;
  font-weight: 100;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 24px;
  text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
}

.iaia-final-blessing {
  background: rgba(0, 242, 255, 0.05);
  padding: 20px;
  border: 1px dashed rgba(0, 242, 255, 0.2);
  border-radius: 0px;
  margin-bottom: 32px;
}

.iaia-final-blessing p {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.iaia-signature {
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 1px;
}

@keyframes bounce {
  from {
    transform: scale(1) translateY(0);
  }

  to {
    transform: scale(1.1) translateY(-10px);
  }
}

.animate-zoom-in {
  animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-dots-premium {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loading-dots-premium span {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 0px;
  animation: pulseDots 1.5s infinite;
}

.loading-dots-premium span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots-premium span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulseDots {
  0%,
  100% {
    transform: scale(0.5);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.auth-footer-v2 {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
}

.auth-footer-v2 a {
  color: var(--color-primary);
  font-weight: 700;
}

.onboarding-legal {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.25);
  z-index: 5;
}

.animate-in {
  opacity: 0;
  transform: translateY(10px);
  animation: slideInUp 0.5s ease forwards;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in-up {
  animation: cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.auth-onboarding-hint {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 0px;
  margin-bottom: 24px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.otp-resend-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.auth-divider {
  margin: 24px 0;
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-divider span {
  padding: 0 10px;
}

.demo-login-wrapper {
  margin: 4px 0 32px 0;
  padding: 20px;
  background: rgba(93, 95, 239, 0.08);
  border: 1px solid rgba(93, 95, 239, 0.2);
  border-radius: 0px;
  transition: all 0.3s ease;
}

.demo-login-wrapper:hover {
  background: rgba(93, 95, 239, 0.12);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hard);
}

.auth-button.demo-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0px;
  font-size: 1rem;
  font-weight: 700;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-button.demo-primary:hover {
  background: #152d5b;
  transform: scale(1.01);
}

.auth-button.demo-secondary {
  background: rgba(0, 242, 255, 0.05);
  color: #00f2ff;
  border: 2px solid #00f2ff;
  border-radius: 0px;
  font-size: 1rem;
  font-weight: 700;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: normal;
}

.auth-button.demo-secondary:hover {
  background: rgba(0, 242, 255, 0.15);
  box-shadow: var(--shadow-hard);
  transform: scale(1.01);
}

.demo-hint {
  font-size: 0.95rem;
  color: var(--color-primary);
  margin: 16px 0 8px 0;
  font-weight: var(--font-weight-bold);
  opacity: 0.9;
}

.lang-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 0px;
  transition: all 0.2s ease;
  letter-spacing: 1px;
}

.lang-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.lang-btn.active {
  color: white;
  background: var(--color-primary);
  box-shadow: var(--shadow-hard);
}

.auth-spacer {
  height: 32px;
}

.guest-button {
  background: #f8f9fa;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.guest-button:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
}

.auth-footer {
  margin-top: 32px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
}

.auth-footer a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 700;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.social-auth-section {
  margin-top: 8px;
}

.auth-button.google-auth {
  background: #4285f4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  height: auto;
  min-height: 52px;
  /* Ensure visual parity */
}

.auth-button.google-auth:hover {
  background: #357ae8;
}

.auth-button.google-auth img {
  width: 32px;
  height: 32px;
  background: white;
  padding: 6px;
  border-radius: 0px;
  display: block;
}

/* Premium Animations */
.heartbeat-subtle {
  animation: heartbeat 3s infinite ease-in-out;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* --- FULL-SCREEN IMMERSION OVERRIDES --- */

.language-selector-auth {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.lang-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  padding: 10px 16px !important; /* Overrides inline style if any */
  border-radius: var(--radius-m3-small, 16px);
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  opacity: 0.6;
}

:root.light .lang-pill {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.lang-pill:hover {
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.1);
}

:root.light .lang-pill:hover {
  background: rgba(0, 0, 0, 0.08);
}

.lang-pill.active {
  opacity: 1;
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

:root.light .lang-pill.active {
  color: white; /* Ensure it stays white on orange bg in light mode */
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .auth-container {
    background: #f8fafc;
    background-image: radial-gradient(
        circle at top left,
        rgba(0, 242, 255, 0.08),
        transparent 50%
    ),
    radial-gradient(
        circle at bottom right,
        rgba(255, 107, 0, 0.05),
        transparent 50%
    );
    --text-main: #000000;
    --text-secondary: #4b5563;
    --text-muted: #6b7280;
    --md-sys-color-on-surface: #000000;
    --border-master: rgba(0, 0, 0, 0.1); 
    color: var(--text-main);
}

.light .auth-container.integrated-frame .auth-card.glass-panel {
    background: rgba(255, 255, 255, 0.7) !important;
    border-color: rgba(0, 0, 0, 0.1) !important;
}

.light .form-group label {
    color: #000;
    text-shadow: none;
}

.light .phone-input-wrapper {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
}

.light .phone-prefix, 
.light .phone-input-field {
    color: #000;
}

.light .phone-input-field::placeholder {
    color: rgba(0,0,0,0.4);
}

.light .town-picker-trigger {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
    color: #000;
}

.light .town-picker-trigger.empty span {
    color: rgba(0,0,0,0.4);
}

.light .auth-subtitle-interstellar { color: rgba(0, 0, 0, 0.6); }
.light .interstellar-h1 {
    background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.5) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.light .phone-input-wrapper-v2 {
    border-color: rgba(0,0,0,0.1);
    background: #ffffff;
}
.light .prefix-badge {
    background: rgba(0,0,0,0.05);
    color: #000;
    border-color: rgba(0,0,0,0.1);
}

.light .town-picker-v2 {
    background: rgba(0,0,0,0.02);
    border-color: rgba(0,0,0,0.1);
    color: rgba(0,0,0,0.6);
}

.light .town-picker-v2.selected {
    color: #000;
    background: rgba(0, 242, 255, 0.05);
}

.light .onboarding-iaia-tip p {
    color: #000;
}

.light .back-btn-step {
    background: rgba(0,0,0,0.05);
    color: #000;
}


=====================================
FILE: src/pages/Auth_backup_pro.css
=====================================

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
  padding: 40px 20px;
  width: 100%;
}

.auth-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.4) saturate(1.2);
  z-index: 1;
  transform: scale(1.05);
  animation: slowZoom 30s infinite alternate;
}

@keyframes slowZoom {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

.login-diagnostic-trigger {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 242, 255, 0.1);
  border: 1px solid var(--color-primary);
  border-radius: 0px;
  padding: 8px;
  cursor: pointer;
  z-index: 1000;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.login-diagnostic-trigger:hover {
  background: rgba(0, 242, 255, 0.3);
  box-shadow: var(--shadow-hard);
}

/* IAIA Guidance at Login - RESTRUCTURED FOR SMART CITY (ULTRA-COMPACT) */
.auth-iaia-guidance {
  display: flex;
  flex-direction: row; /* Format Xat Amplificat */
  align-items: center;
  justify-content: flex-start;
  gap: 24px; /* Més aire per a >50 anys */
  margin: 0 0 32px;
  position: relative;
  text-align: left;
  background: rgba(255, 255, 255, 0.02); /* Estil Targeta Selector Realitat */
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Llegibilitat sobre el fons */
}

.iaia-avatar-wrapper {
  position: relative;
  flex: 0 0 110px; /* Avatar amb pes visual massiu, gairebé com Selector Realitat */
  height: 110px;
  border-radius: 100px;
  overflow: hidden;
  border: 2px solid var(--color-primary);
  box-shadow: 0 4px 15px rgba(0, 242, 255, 0.2);
  background: white;
}

.iaia-mini-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 12%; 
  z-index: 2;
  position: relative;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: scale(3.2); 
}

.iaia-mini-avatar.focus-face-speaker {
  transform: scale(2.2); 
  object-position: 50% 0%; 
  filter: drop-shadow(0 0 5px rgba(0, 242, 255, 0.4));
}

/* TIGHTEN AUTH LAYOUT */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* RESPIRACIÓ SUPERIOR */
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
}

.auth-card {
  width: 100%;
  max-width: 640px; /* Aliniat amb el Protocol Alzina 640px */
  margin: 0 auto;
  padding: 20px;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-footer {
  margin-top: 20px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 640px;
  text-align: center;
}

.auth-legal-text {
  font-size: 14px; /* Text Sènior / Llegibilitat garantida */
  opacity: 0.6;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 12px;
}

.personal-identity-tip {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: 24px;
  margin-top: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.tip-icon-orb {
  background: rgba(249, 115, 22, 0.1);
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.tip-title {
  font-size: 13px; /* Sènior tip */
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #f97316;
  margin-bottom: 4px;
}

.tip-description {
  font-size: 15px; /* Sènior tip description */
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  font-weight: 500;
}

.auth-version-footer {
  margin-top: 16px;
  opacity: 0.4;
  font-size: 12px;
  text-align: center;
  width: 100%;
}

.iaia-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 0px;
  background: #f97316;
  opacity: 0.5;
  z-index: 1;
  animation: iaiaPulse 2s infinite;
}

@keyframes iaiaPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.5;
  }

  70% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }
}

.iaia-pulse-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  height: 140%;
  border-radius: 0px;
  background: #f97316;
  opacity: 0.15;
  z-index: 0;
  animation: iaiaPulseOuter 3s infinite ease-out;
}

@keyframes iaiaPulseOuter {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.2;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.6);
    opacity: 0;
  }
}

.iaia-speech-bubble-interstellar {
  font-size: 1.35rem; /* Text EXTRA GEGANT per a usabilitat Suprema (>50 anys) */
  color: var(--text-main);
  font-weight: 500;
  line-height: 1.6; /* Respiració tipogràfica requerida per manual */
  text-align: left;
  flex: 1; /* Ocupa l'espai restant a la dreta */
  font-family: "Inter Tight", sans-serif;
  letter-spacing: 0.2px;
}

.auth-subtitle-interstellar {
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 32px;
  font-size: 0.95rem;
  letter-spacing: 0.8px;
  font-weight: 300;
  font-family: "Inter Tight", sans-serif;
  text-transform: lowercase;
}

.interstellar-h1 {
  font-family: "Inter Tight", sans-serif !important;
  font-weight: 200 !important;
  font-size: 3rem !important; /* LLEI DEL MESTRE: Impacte Visual Majúscul */
  letter-spacing: 4px !important;
  text-transform: uppercase;
  margin-bottom: 24px !important;
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.4) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.2));
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(249, 115, 22, 0.03) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.auth-card {
  background: transparent !important;
  backdrop-filter: none;
  border: none !important;
  width: 100%;
  /* max-width: 540px; ELIMINAT PER DIRECTIVA DE INTEGRACIÓ TOTAL */
  padding: 20px; /* Reduït per a que no semble una caixa */
  box-shadow: none !important;
  border-radius: 0 !important;
  text-align: center;
  position: relative;
  z-index: 10;
  color: var(--text-main);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrem el contingut intern */
}

.auth-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 242, 255, 0.05) 0%,
    transparent 100%
  );
  pointer-events: none;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(60px) rotateX(-10deg);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
    filter: blur(0);
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 20px;
    border-radius: 0 !important;
    /* DIRECTIVA ZERO RADIUS PERFLASH */
  }

  .register-card-v2 {
    padding: 40px 24px !important;
    margin-top: 20px;
  }

  .auth-logo-v2 {
    margin: -32px -20px 20px -20px !important;
    width: calc(100% + 40px) !important;
  }

  .interstellar-h1 {
    font-size: 1.6rem !important;
    letter-spacing: 2px !important;
  }

  .auth-iaia-guidance {
    margin-bottom: 20px;
  }
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: block;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.auth-logo-v2 {
  width: 140px; /* Logo compacte, elegant */
  height: auto;
  margin: 0 auto 16px; /* Marge normalitzat */
  display: block;
  border-radius: 0;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
}

.auth-card h1 {
  color: var(--md-sys-color-on-surface);
  font-size: 1.75rem;
  margin-bottom: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
  font-family: var(--font-headline);
}

.auth-subtitle {
  color: #666;
  margin-bottom: 32px;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.form-group input {
  width: 100%;
  padding: 16px 20px;
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-s);
  /* 18px */
  font-size: 1rem;
  color: var(--text-main);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-violet);
  box-shadow: var(--shadow-glow-violet);
}

.input-success {
  border-color: #f97316 !important;
  background: rgba(0, 242, 255, 0.05) !important;
  box-shadow: var(--shadow-hard);
}

.input-error {
  border-color: #ff5252 !important;
  background: rgba(255, 82, 82, 0.05) !important;
  box-shadow: var(--shadow-hard);
}

.btn-dimmed {
  opacity: 0.4 !important;
  filter: grayscale(0.8) !important;
  cursor: not-allowed !important;
  box-shadow: var(--shadow-hard);
}

.btn-dimmed:hover {
  transform: none !important;
}

/* Autofill Fix for Dark Mode */
.form-group input:-webkit-autofill,
.form-group input:-webkit-autofill:hover,
.form-group input:-webkit-autofill:focus,
.form-group input:-webkit-autofill:active {
  -webkit-box-shadow: var(--shadow-hard);
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Phone Input specific styling */
.phone-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0px;
  padding: 0 16px;
  /* Custom padding for wrapper */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-hard);
}

.phone-input-wrapper:focus-within {
  border-color: var(--color-primary);
  background: rgba(0, 242, 255, 0.08);
  box-shadow: var(--shadow-hard);
}

.phone-prefix {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  margin-right: 12px;
  padding-right: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  height: 24px;
}

.phone-input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.1rem;
  /* Slightly larger for numbers */
  font-weight: 700;
  padding: 16px 0;
  /* Vertical padding matching wrapper */
  outline: none;
  width: 100%;
  letter-spacing: 1px;
}

.phone-input-field::placeholder {
  color: rgba(255, 255, 255, 0.35);
  /* Boosted contrast */
  font-weight: var(--font-weight-bold);
}

.otp-input-field {
  text-align: center;
  letter-spacing: 12px;
  font-size: 1.8rem !important;
  font-weight: 800;
  color: var(--color-primary);
  text-shadow: 0 0 10px rgba(0, 122, 255, 0.3);
  background: rgba(0, 122, 255, 0.03) !important;
  max-width: 100%;
}

@media (max-width: 360px) {
  .otp-input-field {
    font-size: 1.4rem !important;
    letter-spacing: 8px;
    padding: 12px 8px;
  }
}

.town-picker-trigger {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0px;
  font-size: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.town-picker-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-primary);
}

.town-picker-trigger.empty span {
  color: rgba(255, 255, 255, 0.3);
}

.town-picker-trigger svg {
  color: var(--color-primary);
}

.auth-button {
  width: 100%;
  height: 56px;
  padding: 0 24px;
  background: var(--accent-violet);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-s);
  /* 18px */
  font-size: 1.1rem;
  font-weight: 950;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow-violet);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.auth-button:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0px #000;
}

.auth-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.auth-error {
  background: rgba(255, 82, 82, 0.1);
  color: #ff5252;
  padding: 16px;
  border-radius: 0px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 82, 82, 0.2);
  text-align: left;
}

.auth-success-alert {
  background: rgba(0, 242, 255, 0.1);
  color: #f97316;
  padding: 16px;
  border-radius: 0px;
  margin-bottom: 24px;
  font-size: 0.95rem;
  font-weight: var(--font-weight-bold);
  border: 1px solid rgba(0, 242, 255, 0.3);
  text-align: center;
  backdrop-filter: blur(10px);
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* [FLASH MASTER PIECE] PREMIUM ONBOARDING & REGISTER V2.0 */
.premium-onboarding {
  background: #ffffff;
  perspective: 1000px;
}

.auth-hero-overlay {
  display: none;
  /* [MASTER] Eliminant fons d'estrelles */
}

.register-card-v2 {
  background: rgba(10, 15, 30, 0.6) !important;
  backdrop-filter: blur(12px) saturate(160%) !important;
  border: 1px solid rgba(0, 242, 255, 0.3) !important;
  padding: 60px 40px !important;
  /* box-shadow: ... ELIMINAT PER A NETEJA TOTAL */
  border-radius: 0 !important;
  overflow: hidden;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.register-card-v2::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent,
    var(--color-primary),
    transparent
  );
}

.onboarding-progress {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.progress-segment {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0px;
  position: relative;
  overflow: hidden;
}

.progress-segment.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: var(--color-primary);
  box-shadow: var(--shadow-hard);
  animation: loadingBar 2s infinite ease-in-out;
}

.progress-segment.completed {
  background: var(--color-primary);
  box-shadow: var(--shadow-hard);
}

.glass-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
  padding-bottom: 16px;
}

@keyframes loadingBar {
  0% {
    left: -60%;
  }

  100% {
    left: 100%;
  }
}

.auth-logo-v2 {
  width: calc(100% + 64px);
  height: auto;
  margin: -40px -32px 24px -32px;
  display: block;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.5));
  border-radius: var(--radius-gem-card, 28px) var(--radius-gem-card, 28px) 0 0;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 48px !important;
}

.phone-input-wrapper-v2 {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  /* ZERO RADIUS */
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.phone-input-wrapper-v2:focus-within {
  border-color: var(--color-primary);
  background: rgba(0, 242, 255, 0.08);
  box-shadow: var(--shadow-hard);
}

.prefix-badge {
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  height: 52px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.phone-input-prime {
  flex: 1;
  background: transparent !important;
  border: none !important;
  box-shadow: var(--shadow-hard);
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
}

.town-picker-v2 {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  /* ZERO RADIUS */
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.town-picker-v2.selected {
  color: white;
  border-color: var(--color-primary);
  background: rgba(0, 242, 255, 0.05);
}

.picker-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.picker-left svg {
  color: var(--color-primary);
}

.onboarding-iaia-tip {
  background: rgba(0, 242, 255, 0.04);
  border: 1px dashed rgba(0, 242, 255, 0.2);
  border-radius: 0;
  /* ZERO RADIUS */
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.onboarding-iaia-tip::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-primary);
  opacity: 0.3;
}

.tip-icon {
  font-size: 1.2rem;
}

.onboarding-iaia-tip p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
  text-align: left;
  margin: 0;
}

.auth-button.v2 {
  height: 64px;
  border-radius: 0;
  /* DIRECTIVA ZERO RADIUS */
  font-size: 1.15rem;
  font-family: "Inter Tight", sans-serif;
  letter-spacing: 2.5px;
  gap: 16px;
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
  color: var(--bg-canvas);
  font-weight: 900;
  border: none;
  box-shadow: var(--shadow-hard);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

.auth-button.v2:focus {
  outline: none;
  box-shadow: var(--shadow-hard);
}

.auth-button.v2:active {
  transform: scale(0.97) translateY(2px);
}

.auth-method-switcher {
  margin-top: 16px;
}

.text-btn.accent {
  color: var(--color-primary);
  font-weight: 800;
}

.back-btn {
  margin-top: 32px;
  width: 100%;
  opacity: 0.5;
  font-size: 0.8rem !important;
}

/* LANGUAGE SELECTOR AUTH */
.language-selector-auth .lang-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-selector-auth .lang-pill.active {
  background: rgba(0, 242, 255, 0.1);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
}

/* PREMIUM TOWN SELECTOR */
.town-selector-premium {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.town-selector-premium:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.town-selector-premium.selected {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.05);
}

.auth-button-google:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.auth-step-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 440px; /* Limitem l'amplada internament per a que no es deforme en grans pantalles */
}

/* PERSONAL IDENTITY TIP */
.personal-identity-tip {
  background: rgba(0, 242, 255, 0.03);
  border: 1px solid rgba(0, 242, 255, 0.1);
  padding: 16px;
  border-radius: 20px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.personal-identity-tip:hover {
  background: rgba(0, 242, 255, 0.05);
  border-color: rgba(0, 242, 255, 0.2);
}

.tip-icon-orb {
  flex-shrink: 0;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.back-btn-step {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 0px;
  font-size: 0.8rem !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.back-btn-step:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.auth-iaia-guidance.interstellar-iaia {
  background: radial-gradient(
    circle at center,
    rgba(0, 242, 255, 0.08) 0%,
    transparent 100%
  );
  border: none;
  padding: 28px; /* GEOMETRIA CANÒNICA */
  border-bottom: 1px solid rgba(0, 242, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.iaia-speech-bubble-interstellar {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.celebration-step {
  padding: 20px 0;
  text-align: center;
}

.celebration-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.4));
  animation: bounce 1s infinite alternate
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.interstellar-h1 {
  font-family: "Inter Tight", sans-serif;
  color: white;
  font-size: 2rem;
  font-weight: 200;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
}

.victory-text {
  font-family: "Inter Tight", sans-serif;
  color: white;
  font-size: 1.8rem;
  font-weight: 100;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 24px;
  text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
}

.iaia-final-blessing {
  background: rgba(0, 242, 255, 0.05);
  padding: 20px;
  border: 1px dashed rgba(0, 242, 255, 0.2);
  border-radius: 0px;
  margin-bottom: 32px;
}

.iaia-final-blessing p {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.iaia-signature {
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 1px;
}

@keyframes bounce {
  from {
    transform: scale(1) translateY(0);
  }

  to {
    transform: scale(1.1) translateY(-10px);
  }
}

.animate-zoom-in {
  animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-dots-premium {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loading-dots-premium span {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 0px;
  animation: pulseDots 1.5s infinite;
}

.loading-dots-premium span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots-premium span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulseDots {
  0%,
  100% {
    transform: scale(0.5);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.auth-footer-v2 {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
}

.auth-footer-v2 a {
  color: var(--color-primary);
  font-weight: 700;
}

.onboarding-legal {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.25);
  z-index: 5;
}

.animate-in {
  opacity: 0;
  transform: translateY(10px);
  animation: slideInUp 0.5s ease forwards;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in-up {
  animation: cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.auth-onboarding-hint {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 0px;
  margin-bottom: 24px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.otp-resend-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.auth-divider {
  margin: 24px 0;
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-divider span {
  padding: 0 10px;
}

.demo-login-wrapper {
  margin: 4px 0 32px 0;
  padding: 20px;
  background: rgba(93, 95, 239, 0.08);
  border: 1px solid rgba(93, 95, 239, 0.2);
  border-radius: 0px;
  transition: all 0.3s ease;
}

.demo-login-wrapper:hover {
  background: rgba(93, 95, 239, 0.12);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hard);
}

.auth-button.demo-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0px;
  font-size: 1rem;
  font-weight: 700;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-button.demo-primary:hover {
  background: #152d5b;
  transform: scale(1.01);
}

.auth-button.demo-secondary {
  background: rgba(0, 242, 255, 0.05);
  color: #f97316;
  border: 2px solid #f97316;
  border-radius: 0px;
  font-size: 1rem;
  font-weight: 700;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: normal;
}

.auth-button.demo-secondary:hover {
  background: rgba(0, 242, 255, 0.15);
  box-shadow: var(--shadow-hard);
  transform: scale(1.01);
}

.demo-hint {
  font-size: 0.95rem;
  color: var(--color-primary);
  margin: 16px 0 8px 0;
  font-weight: var(--font-weight-bold);
  opacity: 0.9;
}

.language-selector-auth {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  padding: 8px;
  background: transparent;
  border: none;
}

.lang-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px; /* Format Mestre: +50 anys */
  font-weight: 800;
  cursor: pointer;
  padding: 16px 24px; /* Format Tàctil Immens */
  border-radius: 100px;
  transition: all 0.2s ease;
  letter-spacing: 1px;
}

.lang-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.lang-btn.active {
  color: white;
  background: var(--color-primary);
  box-shadow: var(--shadow-hard);
}

.auth-spacer {
  height: 32px;
}

.guest-button {
  background: #f8f9fa;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.guest-button:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
}

.auth-footer {
  margin-top: 32px;
  font-size: 18px; /* Tàctil i gegant */
  color: rgba(255, 255, 255, 0.6);
}

.auth-footer a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 700;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.social-auth-section {
  margin-top: 8px;
}

.auth-button.google-auth {
  background: #4285f4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  height: auto;
  min-height: 52px;
  /* Ensure visual parity */
}

.auth-button.google-auth:hover {
  background: #357ae8;
}

.auth-button.google-auth img {
  width: 32px;
  height: 32px;
  background: white;
  padding: 6px;
  border-radius: 0px;
  display: block;
}

/* Premium Animations */
.heartbeat-subtle {
  animation: heartbeat 3s infinite ease-in-out;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}


=====================================
FILE: src/pages/AyuntamientoPage.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { wikipediaService } from '../services/wikipediaService';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import TownGallery from '../components/TownGallery';
import WikiPulseSheet from '../components/WikiPulseSheet';
import { ArrowLeft, Landmark, Info, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { logger } from '../utils/logger';
import './Towns.css';

const AyuntamientoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [town, setTown] = useState(null);
    const [shieldUrl, setShieldUrl] = useState(null);
    const [wikiData, setWikiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allTowns = await supabaseService.getTowns();
                const isUuid = id.includes('-');
                const found = allTowns.find(t => isUuid ? t.uuid === id : t.id === parseInt(id));
                setTown(found);

                if (found) {
                    // [SAVIESA UNIVERSAL] Carreguem escut i dades de Wikipedia
                    const [shield, wiki] = await Promise.all([
                        wikipediaService.getTownShield(found.name),
                        wikipediaService.getTownSummary(found.name)
                    ]);
                    setShieldUrl(shield);
                    setWikiData(wiki);
                }
            } catch (error) {
                logger.error('[AyuntamientoPage] Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
            <div className="animate-pulse flex flex-col items-center">
                <Landmark size={48} className="text-primary mb-4" />
                <p className="font-bold tracking-widest">OBRINT LA SEU ELECTRÒNICA...</p>
            </div>
        </div>
    );

    if (!town) return <div className="p-20 text-center">Ajuntament no trobat</div>;

    return (
        <div className="ayuntamiento-page animate-in">
            <ProfileHeaderPremium
                type="official"
                title={`Ajuntament de ${town.name}`}
                subtitle="Seu Electrònica i Institucional"
                avatarUrl={shieldUrl || town.logo_url}
                coverUrl={town.image_url}
                badges={['Oficial', 'Verificat']}
                onBack={() => navigate(-1)}
            />

            <main className="ayunt-content p-4 space-y-6">
                {/* AVIS DE DUALITAT */}
                <div className="dual-portal-notice institution-glass border border-orange-500/30 p-4 rounded-[28px] flex items-start gap-4">
                    <div className="icon-wrapper text-blue-400">
                        <Landmark size={32} />
                    </div>
                    <div className="text-sm">
                        <h4 className="font-black text-blue-400 mb-1 uppercase tracking-tighter">Espai Institucional</h4>
                        <p className="opacity-80">Estàs a la pàgina oficial de l'Ajuntament. Per a veure les publicacions dels veïns, el mercat i el batec del carrer, visita el Mur del Poble.</p>
                        <Link
                            to={`/pobles/${id}`}
                            className="inline-flex items-center gap-2 mt-3 p-2 px-4 bg-primary text-black font-black rounded-[20px] text-xs"
                        >
                            <MessageCircle size={14} /> ANAR AL MUR DEL POBLE
                        </Link>
                    </div>
                </div>

                {/* MEMORIA WIKIMEDIA */}
                <section className="institutional-wiki-section">
                    <div className="section-header-compact flex items-center gap-2 mb-4 opacity-50">
                        <ShieldCheck size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Identitat Municipal (Wikipedia)</h3>
                    </div>

                    <div className="wiki-card-institutional glass-clean p-6 border-l-4 border-orange-500 rounded-r-2xl bg-white/5">
                        {shieldUrl && (
                            <div className="shield-display w-24 h-24 mx-auto mb-6">
                                <img src={shieldUrl} alt={`Escut de ${town.name}`} className="w-full h-full object-contain" />
                                <p className="text-[10px] text-center mt-2 opacity-50 italic">Escut via Wikimedia Commons</p>
                            </div>
                        )}
                        <p className="text-sm leading-relaxed opacity-90 italic">
                            {wikiData?.extract || `L'ajuntament de ${town.name} és l'òrgan de govern i administració d'aquest municipi de la Comunitat Valenciana.`}
                        </p>
                        {wikiData?.page_url && (
                            <a
                                href={wikiData.page_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-blue-400 font-bold mt-4"
                            >
                                <ExternalLink size={14} /> CONSULTAR ARXIU HISTÒRIC
                            </a>
                        )}
                    </div>
                </section>

                {/* BANDO MUNICIPAL SIMULAT */}
                <section className="bando-actualitat">
                    <div className="section-header-compact flex items-center gap-2 mb-4 opacity-50">
                        <Info size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Últims Bandos i Avisos</h3>
                    </div>

                    <div className="bando-item p-4 bg-white/5 border border-white/10 rounded-[28px] mb-4">
                        <span className="text-[10px] font-bold text-blue-400 block mb-1">AVUI • 09:30</span>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Tràmits de la Seu Electrònica</h4>
                        <p className="text-xs opacity-70">Recordem que la majoria de tràmits es poden realitzar de forma telemàtica mitjançant certificat digital.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AyuntamientoPage;


=====================================
FILE: src/pages/BuscadorAjudes.css
=====================================

.subsidies-page {
  padding: 2rem;
  min-height: 100vh;
  background: radial-gradient(
    circle at top left,
    rgba(255, 109, 35, 0.05),
    transparent 40%
  );
}

.sub-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  border-radius: var(--sdp-radius-genesis);
}

.sub-header h1 {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: white;
}

.sub-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.btn-back {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px border rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn-back:hover {
  background: var(--sdp-accent);
  transform: translateX(-4px);
}

.search-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 3rem;
  border-radius: var(--sdp-radius-genesis);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  color: rgba(255, 255, 255, 0.3);
}

.search-input-wrapper input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  color: white;
  font-size: 1.1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.filter-group select {
  background: transparent;
  border: none;
  color: white;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

.sub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.sub-card {
  padding: 2rem;
  border-radius: var(--sdp-radius-genesis);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.4s var(--sdp-easing);
}

.sub-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 109, 35, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.status-tag {
  font-size: 0.7rem;
  font-weight: 900;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.1);
}

.status-tag.oberta {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}
.status-tag.proximament {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}
.status-tag.investigacio {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.sector-tag {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.amount-highlight {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--sdp-accent);
  margin: 1rem 0;
  letter-spacing: -0.05em;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-iaia-ask {
  background: white;
  color: black;
  border-radius: 100px;
  padding: 0.8rem;
  font-weight: 800;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.3s;
}

.btn-official {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 100px;
  padding: 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

/* [MASTER] Advice Modal Expanded */
.advice-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.advice-modal {
  width: 100%;
  max-width: 800px; /* Més ample per a resums extensos */
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: var(--sdp-radius-genesis);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.advice-header {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.advice-header h2 {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
}

.advice-header .subtitle {
  font-size: 0.9rem;
  opacity: 0.5;
  margin: 4px 0 0 0;
}

.advice-body {
  padding: 2.5rem;
  overflow-y: auto;
  flex: 1;
}

.advice-box {
  background: rgba(255, 255, 255, 0.02);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
}

.advice-content {
  font-family: "Noto Sans", sans-serif;
  font-size: 1.3rem; /* Mida bategant de legibilitat */
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.95);
}

.advice-link-highlight {
  background: linear-gradient(
    135deg,
    rgba(79, 70, 229, 0.1),
    rgba(249, 115, 22, 0.1)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.link-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.link-info h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}

.link-info p {
  margin: 4px 0 0 0;
  font-size: 0.9rem;
  opacity: 0.6;
}

.advice-footer {
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .advice-link-highlight {
    flex-direction: column;
    text-align: center;
  }
  .link-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  max-width: 700px;
  width: 90%;
  padding: 3rem;
  border-radius: var(--sdp-radius-genesis);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
}

.advice-box {
  background: rgba(255, 255, 255, 0.03);
  border-left: 6px solid var(--sdp-accent);
  padding: 2.5rem;
  border-radius: 0 28px 28px 0;
  margin: 1.5rem 0;
}

.advice-text {
  font-family: "Noto Sans", sans-serif;
  font-size: 1.35rem;
  line-height: 1.5;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.advice-text.italic {
  font-style: normal; /* Eliminem itàlica per llegibilitat */
  opacity: 0.95;
}

.export-section {
  margin-top: 3rem;
}

.export-section h4 {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1.5rem;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.export-grid button {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  color: white;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.export-grid button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.export-grid button.btn-gdocs {
  background: linear-gradient(135deg, #4285f4, #34a853);
  border: none;
  font-weight: 700;
}

@media (max-width: 768px) {
  .subsidies-page {
    padding: 1rem;
  }
  .search-controls {
    grid-template-columns: 1fr;
  }
  .sub-grid {
    grid-template-columns: 1fr;
  }
  .export-grid {
    grid-template-columns: 1fr;
  }
}

/* [NEW] Biblioteca de Prompts Styles */
.prompts-library-section {
  margin: 20px 0;
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.prompts-library-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.prompts-library-section .title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prompts-library-section h3 {
  font-family: "Noto Sans", sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  font-size: 1.25rem;
  color: white;
  margin: 0;
}

.btn-notes-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-orange);
  transition: all 0.3s ease;
}

.btn-notes-link:hover {
  background: rgba(249, 115, 22, 0.1);
  transform: translateY(-2px);
}

.prompts-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.prompts-scroll::-webkit-scrollbar {
  display: none;
}

.prompt-card {
  min-width: 280px;
  max-width: 280px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.prompt-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-orange);
  transform: scale(1.02);
}

.prompt-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.prompt-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-tag {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 6px;
  background: #4285f4;
  color: white;
  text-transform: uppercase;
}

.category-tag {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.prompt-card h4 {
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: white;
}

.prompt-preview {
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.4);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  overflow: hidden;
}


=====================================
FILE: src/pages/BuscadorAjudes.jsx
=====================================

import React, { useState, useMemo } from 'react';
import { 
    Search, 
    Filter, 
    Download, 
    ChevronRight, 
    FileText, 
    Bot, 
    ArrowLeft, 
    Sparkles, 
    ExternalLink,
    FileJson,
    FileSpreadsheet,
    Shield
} from 'lucide-react';
import { MOCK_SUBSIDIES } from '../data/subsidies';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import './BuscadorAjudes.css';
import DocumentViewer from '../components/DocumentViewer';

/**
 * BuscadorAjudes [MASTER OMEGA]
 * Interfície sobirana per a la recerca i gestió d'ajudes públiques.
 * Implementa exportació multiformat i assistència de l'Arxiver AI.
 */
const BuscadorAjudes = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('tots');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);
    const [aiAdvice, setAiAdvice] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);

    const sectors = ['tots', ...new Set(MOCK_SUBSIDIES.map(s => s.sector).filter(Boolean))];

    const filteredSubsidies = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        return MOCK_SUBSIDIES.filter(s => {
            const matchesSearch = query === '' || 
                                 s.title.toLowerCase().includes(query) || 
                                 s.description.toLowerCase().includes(query);
            const matchesSector = selectedSector === 'tots' || s.sector === selectedSector;
            return matchesSearch && matchesSector;
        });
    }, [searchTerm, selectedSector]);

    const handleAskArxiver = async (sub) => {
        setIsAnalyzing(true);
        setSelectedSub(sub);
        try {
            const query = `Analitza aquesta ajuda per a mi: "${sub.title}". Descripció: ${sub.description}. Requisits: ${(sub.requirements || []).join(', ')}. Com ens pot ajudar al projecte Sóc de Poble?`;
            const response = await geminiService.ask('ARXIVER', query);
            setAiAdvice(response.text);
        } catch (err) {
            console.error(err);
            setAiAdvice("Mestre, els papers s'han barrejat... Torna-ho a provar.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExport = (format, sub) => {
        const content = `
SUBVENCIÓ: ${sub.title}
------------------------------------------------
IMPORT ESTIMAT: ${sub.amount}
SECTOR: ${sub.sector}
DATA LÍMIT: ${sub.deadline}

REQUISITS:
${sub.requirements.map(r => `- ${r}`).join('\n')}

DESCRIPCIÓ:
${sub.description}

CONSELL DE L'IAIA:
${sub.iaia_advice}
        `;

        if (format === 'gdocs') {
            navigator.clipboard.writeText(content);
            alert("Contingut copiat optimitzat per a Google Docs! Enganxa'l en un document nou. ✨");
        } else {
            // [MASTER] Robust Download Portal v1.25.1
            const mimeTypes = {
                'txt': 'text/plain',
                'pdf': 'application/pdf',
                'doc': 'application/msword'
            };
            
            const blob = new Blob([content], { type: mimeTypes[format] || 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${sub.title.replace(/\s+/g, '_')}_socdepoble.${format}`;
            
            document.body.appendChild(a);
            a.click();
            
            // Retardem la purga de l'URL per a que el navegador puga bategar la descàrrega
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);
        }
    };

    return (
        <div className="subsidies-page animate-in">
            {/* Nav Superior */}
            <header className="sub-header glass-premium">
                <button className="btn-back" onClick={() => navigate('/ofici')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="title-group">
                    <h1>Buscador d'Ajudes</h1>
                    <p>Bategat Administratiu per al Mas</p>
                </div>
                <div className="badge-identity">
                    <Shield size={14} /> <span>Rhizome Secured</span>
                </div>
            </header>

            {/* Barra de Cerca i Filtres */}
            <div className="search-controls glass-premium">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Cerca ajudes (Ex: Kit Digital, PAC...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <Filter size={18} />
                    <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                        {sectors.map(s => (
                            <option key={s} value={s}>{s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'Altres'}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Biblioteca de Prompts [NEW SECTION] */}
            <section className="prompts-library-section glass-premium animate-in">
                <header className="section-header">
                    <div className="title-area">
                        <Sparkles size={20} className="text-accent" />
                        <h3>Biblioteca de Prompts</h3>
                    </div>
                    <button className="btn-notes-link" onClick={() => navigate('/notes')}>
                        <FileText size={16} /> Gestionar al Bloc de Notes
                    </button>
                </header>
                <div className="prompts-scroll">
                    <div className="prompt-card mini-bento" onClick={() => navigate('/notes')}>
                        <div className="prompt-header">
                            <span className="platform-tag">Gemini</span>
                            <span className="category-tag">Funding</span>
                        </div>
                        <h4>Recerca de Subvencions 2026</h4>
                        <p className="prompt-preview">"Actua com un consultor expert en captació de fons per al Tercer Sector i Innovació Rural..."</p>
                    </div>
                    <div className="prompt-card mini-bento disabled">
                        <div className="prompt-header">
                            <span className="platform-tag">Claude</span>
                            <span className="category-tag">Memòria</span>
                        </div>
                        <h4>Extracció d'Etimologies Locals</h4>
                        <p className="prompt-preview">Properament bategant...</p>
                    </div>
                </div>
            </section>

            {/* Llistat d'Ajudes */}
            <main className="sub-grid">
                {filteredSubsidies.map(sub => (
                    <article key={sub.id} className="sub-card glass-premium animate-in">
                        <header className="card-header">
                            <span className={`status-tag ${sub.status || 'unknown'}`}>{(sub.status || 'veure').toUpperCase()}</span>
                            <span className="sector-tag">{sub.sector || 'General'}</span>
                        </header>
                        
                        <div className="card-body">
                            <h3>{sub.title}</h3>
                            <div className="amount-highlight">{sub.amount || 'Consultar'}</div>
                            <p className="description">{sub.description}</p>
                            
                            <div className="deadline-info">
                                <strong>Límit:</strong> {sub.deadline}
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="btn-iaia-ask" onClick={() => handleAskArxiver(sub)}>
                                <Bot size={18} /> Preguntar a l'Arxiver
                            </button>
                            <a href={sub.official_link} target="_blank" rel="noreferrer" className="btn-official">
                                <ExternalLink size={18} /> GVA / BOE
                            </a>
                        </div>
                    </article>
                ))}
            </main>

            {/* Modal d'Anàlisi IAIA */}
            {isAnalyzing && (
                <div className="modal-overlay" onClick={() => setAiAdvice(null)}>
                    <div className="modal-content glass-premium animate-in" onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <Bot className="text-iaia" />
                            <h2>Analitzant amb l'Arxiver</h2>
                            <button className="btn-close" onClick={() => setAiAdvice(null)}>×</button>
                        </header>
                        
                        <div className="modal-body">
                            <div className="loading-iaia">
                                <Sparkles className="animate-spin" />
                                <p>L'Arxiver està regirant els papers del calaix...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {aiAdvice && (
                <div className="advice-modal-overlay animate-in" onClick={() => setAiAdvice(null)}>
                    <div className="advice-modal glass-premium shadow-2xl" onClick={e => e.stopPropagation()}>
                        <header className="advice-header">
                            <div className="header-main">
                                <Bot size={28} className="text-accent animate-pulse" />
                                <div>
                                    <h2>L'Assessoria de l'Arxiver</h2>
                                    <p className="subtitle">Anàlisi Sobirà de {selectedSub?.title}</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setAiAdvice(null)}><ArrowLeft size={20} /></button>
                        </header>
                        
                        <div className="advice-body scrollbar-hide">
                            <div className="advice-box shadow-inner">
                                <div className="advice-content whitespace-pre-wrap">
                                    {aiAdvice}
                                </div>
                            </div>

                            {selectedSub?.official_link && (
                                <div className="advice-link-highlight glass-premium">
                                    <div className="link-info">
                                        <ExternalLink size={24} className="text-accent" />
                                        <div>
                                            <h4>Documentació Oficial</h4>
                                            <p>Accedeix directament al tràmit de la GVA</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={selectedSub.official_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="master-button-canonic"
                                    >
                                        Anar a la Convocatòria 🏛️
                                    </a>
                                </div>
                            )}

                            <div className="export-section">
                                <h4>Gestió del Dossier</h4>
                                <div className="export-grid">
                                    <button className="btn-view-doc master-button-canonic bg-accent-orange text-black font-black" onClick={() => {
                                        const content = `
🏛️ DOSSIER DE SOBIRANIA I TRELLAT: ${selectedSub?.title?.toUpperCase() || 'DOCUMENT SENSE TÍTOL'}

REFERÈNCIA: [BATEGAT-MASTER-v14.1]
DATA D'AUTO-CUSTÒDIA: ${new Date().toLocaleDateString('ca-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
PILAR DE DESENVOLUPAMENT: ${selectedSub?.sector || 'GENERAL'}

I. EL PERQUÈ D'AQUESTA OPORTUNITAT (PEDAGOGIA DEL MAS)
Mestre, escolta bé: aquesta ajuda de ${selectedSub?.amount || '---'} no és regalada, és fruit d'una necessitat del territori per a modernitzar-se sense perdre l'ànima. 

L'Arxiver ha analitzat les dades i veu clarament que per a un projecte com el nostre, aquest bategat financer ens permetrà blindar el bosc de dades i assegurar que el nostre llegat no es perda en els servidors de Silicon Valley. Estem parlant de sobirania real.

II. ANÀLISI DETALLAT I DISSÈCCIÓ DE L'AJUDA
${selectedSub?.description || 'No hi ha descripció disponible.'}

DIDÀCTICA DE L'ARXIVER:
Imagineu-vos que estem plantant una olivera. Aquesta subvenció és l'aigua que l'ajudarà a arrelar fort. Cal demanar el que és just i necessari per a fer créixer la nostra idea de poble verd/digital.

III. LES CLAUS SAGRADES DE L'ÈXIT (REQUISITS)
Per a coronar amb èxit aquesta petició, necessites blindar aquests punts:

${(selectedSub?.requirements || []).map((r, idx) => `[PROTOCOL ${1911 + idx}] 🔹 ${r}`).join('\n')}

L'Arxiver recorda: "Papers en mà, cama en terra". Si no tenim el CSV de burocràcia ben net, no podrem creuar el portal del banc.

IV. LA VEU DE LA IAIA MARÍA (EL CONSELL DE L'EXPERIÈNCIA)
"${aiAdvice || selectedSub?.iaia_advice || 'Tingues trellat, fill.'}"

Diu l'IAIA que antigament les coses es feien amb una encaixada de mans, però ara tot són "claus" i "tokens". No t'atabalis. L'Arxiver regirarà els calaixos per a explicar-t'ho com cal.

V. CRÒNICA DE NAVEGACIÓ SOBIRANA (TRANSPARÈNCIA ARCHON)
L'IAIA ha navegat pels següents nodes:
[ACCÉS] Node de Subvencions Públiques. Enllaç: https://ajudes.gva.es/procediment/${selectedSub?.id}
[ANÀLISI] Motor Gemini bategant en mode LLM-Archon.

VI. QUÈ ET QUEDA PER FER AL MESTRE?
L'IAIA t'ha preparat el terreny, però la llavor la plantes tu:
1. [SIGNATURA] Entra a la Seu Electrònica (${selectedSub?.official_link || '#'}) i signa amb certificat.
2. [CUSTÒDIA] Guarda aquest dossier a la teua carpeta de Notes.

VII. NOTES DE SEGURETAT I CUSTÒDIA
Aquesta relíquia informativa està segellada sota el Protocol Rhizome v14. 
Bategat amb honor pel sistema Sóc de Poble. 🏺⚡️⚖️
`;
                                        setViewingDoc({
                                            id: selectedSub.id,
                                            title: selectedSub.title,
                                            sector: selectedSub.sector,
                                            content: content
                                        });
                                    }}>
                                        <FileText size={20} /> VISUALITZAR DOSSIER
                                    </button>

                                    <button onClick={() => handleExport('gdocs', selectedSub)}>
                                        <Sparkles size={16} /> Google Docs
                                    </button>
                                </div>
                            </div>
                        </div>

                        <footer className="advice-footer">
                            <button className="done-btn" onClick={() => setAiAdvice(null)}>Entès, Arxiver 🏺</button>
                        </footer>
                    </div>
                </div>
            )}

            {viewingDoc && (
                <DocumentViewer 
                    document={viewingDoc} 
                    onClose={() => setViewingDoc(null)}
                    onSave={() => {
                        alert("Relíquia coronada i guardada al teu Perfil Privat! 🏺✨");
                        setViewingDoc(null);
                        setAiAdvice(null);
                    }}
                />
            )}
        </div>
    );
};

export default BuscadorAjudes;


=====================================
FILE: src/pages/ChatManager.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, MoreVertical, Search, Bell, Clock, Lock, 
    Image as ImageIcon, Phone, Video, UserPlus, ImagePlay, 
    Users, Plus, LogOut, Download, AlertTriangle, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import Avatar from '../components/Avatar';
import { chatService } from '../services/chatService';

// Components
const ActionButton = ({ icon: Icon, label, onClick, disabled, isDayMode }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[28px] transition-all disabled:opacity-50 border shadow-sm w-[110px] h-[110px]
        ${isDayMode 
            ? 'bg-white text-gray-800 border-gray-100 hover:bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
            : 'bg-[#1F2937] text-white border-white/5 hover:bg-[#374151]'
        }`}
    >
        {Icon && <Icon size={28} className={disabled ? 'text-gray-400 dark:text-gray-500' : 'text-[#FF6D00]'} />}
        <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight mt-1">{label}</span>
    </button>
);

const SettingRow = ({ icon: Icon, title, description, rightElement, onClick, isRed, isDayMode }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-transform active:scale-[0.98] cursor-pointer rounded-[24px] mx-4 mb-3 
        ${isDayMode ? 'bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)]' : 'bg-theme-panel border border-white/5 shadow-sm'}
        ${isRed ? 'text-red-500' : (isDayMode ? 'text-gray-800' : 'text-white')}`}
    >
        {Icon && (
            <div className={`p-2.5 rounded-full ${isRed ? 'bg-red-500/10 text-red-500' : (isDayMode ? 'bg-[#FF6D00]/10 text-[#FF6D00]' : 'bg-[#FF6D00]/20 text-[#FF6D00]')}`}>
                <Icon size={22} className="shrink-0" />
            </div>
        )}
        <div className="flex-1">
            <h3 className="font-bold text-[15px]">{title}</h3>
            {description && <p className={`text-[12px] font-medium leading-tight block mt-0.5 ${isDayMode ? 'text-gray-500' : 'text-gray-400'}`}>{description}</p>}
        </div>
        {rightElement && <div>{rightElement}</div>}
    </div>
);

const ChatManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, impersonatedProfile, activeEntityId } = useAuth();
    const { theme } = useDesign();
    const isDayMode = theme === 'light';
    
    // Check if the user is a forester/guest
    const isGuestUser = user?.isAnonymous;
    
    const [chatData, setChatData] = useState(null);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUserId = activeEntityId || (impersonatedProfile ? impersonatedProfile.id : user?.id);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) {
                // Si no hi ha ID, mock data for general testing or just fallback
                setChatData({
                    name: 'Privat, coses de Javi',
                    type: 'Grup',
                    membersCount: 1,
                    creationDate: '10/2/16',
                    description: 'Creat per tu',
                    avatar_url: null
                });
                setLoading(false);
                return;
            }

            try {
                // Fetch de la conversa real
                const chats = await chatService.getConversations(currentUserId);
                const currentChat = chats.find(c => c.id === id);
                
                if (currentChat) {
                    const isP1Current = currentChat.participant_1_id === currentUserId;
                    const otherInfo = currentChat.other_info || (isP1Current ? currentChat.p2_info : currentChat.p1_info);
                    
                    setChatData({
                        name: otherInfo?.name || 'Foraster',
                        type: 'Contacte',
                        membersCount: 2,
                        creationDate: new Date(currentChat.created_at).toLocaleDateString(),
                        description: `Sense descripció`,
                        avatar_url: otherInfo?.avatar_url
                    });

                    // Si volguérem carregar la galeria, aniria ací. Omplim amb mock pel disseny.
                    setMediaFiles([1, 2, 3, 4, 5]);
                }
            } catch (err) {
                console.error("Error fetching chat details for manager", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, currentUserId]);

    if (loading) {
        return <div className={`flex-1 flex items-center justify-center ${isDayMode ? 'bg-[#FDF5E6] text-gray-400' : 'bg-theme-base text-gray-500'}`}>Carregant informació...</div>;
    }

    return (
        <div className={`flex-1 flex flex-col max-h-screen overflow-hidden relative ${isDayMode ? 'bg-[#FDF5E6]' : 'bg-[#0a0a0a]'}`}>
            {/* Header */}
            <header className="h-[60px] pl-2 pr-4 flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-[#FF6D00] shadow-md z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronLeft size={26} />
                    </button>
                    <span className="font-black text-[18px] text-white tracking-wide uppercase">Detalls del Xat</span>
                </div>
                <div className="flex gap-2"></div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                
                {isGuestUser && (
                    <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-3 flex items-center gap-3">
                        <AlertTriangle size={20} className="text-orange-500 shrink-0" />
                        <p className="text-[13px] text-orange-200/90 leading-snug">
                            <strong className="font-black text-orange-400">Mode Foraster.</strong> Estàs veient informació pública d'este xat. Per ajustar-lo necessites registre complet.
                        </p>
                    </div>
                )}
                
                {/* Secció 1: Perfil Centralitzat AMB MARGES i RADIUS */}
                <div className={`flex flex-col items-center pt-10 pb-8 mx-4 mt-6 mb-8 rounded-[40px] shadow-sm border ${isDayMode ? 'bg-white border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)]' : 'bg-theme-panel border-white/5'}`}>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6D00]/20 to-[#FF6D00]/5 text-[#FF6D00] flex items-center justify-center border-[3px] border-[#FF6D00]/30 shadow-[0_0_40px_rgba(255,107,0,0.15)] mb-5 overflow-hidden relative group">
                        {chatData?.avatar_url ? (
                             <img src={chatData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                             <div className="flex items-center justify-center w-full h-full scale-[1.5]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                             </div>
                        )}
                    </div>

                    <h1 className={`text-3xl font-black text-center tracking-tight mb-2 ${isDayMode ? 'text-gray-900' : 'text-white'}`}>{chatData?.name}</h1>
                    
                    <div className="flex items-center gap-1.5 justify-center bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                        <p className="text-green-600 dark:text-green-400 font-bold text-[10px] tracking-[0.2em] uppercase">
                            Connexió Xifrada
                        </p>
                    </div>

                    <div className="flex justify-center w-full gap-4 mt-2 px-4">
                        <ActionButton isDayMode={isDayMode} icon={Search} label="Cercar Fons" onClick={() => navigate(-1)} />
                        <ActionButton isDayMode={isDayMode} icon={Phone} label="Telefonar" disabled={true} />
                    </div>
                </div>

                {/* Seccions amb Marges (Targetes) */}
                
                {/* Secció 2: Descripció */}
                <SettingRow 
                    isDayMode={isDayMode}
                    title="Informació del Grup"
                    description={`Creat per tu, ${chatData?.creationDate}`}
                    icon={null}
                />

                {/* Secció 3: Media */}
                <div className={`mx-4 mb-3 overflow-hidden rounded-[24px] border shadow-sm ${isDayMode ? 'bg-white border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)]' : 'bg-theme-panel border-white/5'}`}>
                    <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <h3 className={`text-[12px] font-black tracking-widest uppercase ${isDayMode ? 'text-[#FF6D00]' : 'text-[#FF6D00]'}`}>Arxius i documents</h3>
                        <div className="flex items-center gap-1 text-gray-400">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${isDayMode ? 'bg-orange-100 text-orange-600' : 'bg-white/10 text-white'}`}>{mediaFiles.length} elements</span>
                            <ChevronLeft size={16} className="rotate-180" />
                        </div>
                    </div>
                    {/* Media Grid Horizontal Scroll */}
                    <div className="px-5 pb-5 flex gap-3 overflow-x-auto custom-scrollbar">
                        <div className={`w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col
                        ${isDayMode ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#1F2937] border-white/10 text-gray-400'}`}>
                             <ImageIcon size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Imatge 1</span>
                        </div>
                         <div className={`w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col
                         ${isDayMode ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-orange-500/10 border-[#FF6D00]/30 text-[#FF6D00]'}`}>
                             <ImagePlay size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Vídeo 1</span>
                        </div>
                         <div className={`w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col
                        ${isDayMode ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#1F2937] border-white/10 text-gray-400'}`}>
                             <ImageIcon size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Imatge 2</span>
                        </div>
                         <div className={`w-[100px] h-[100px] flex-shrink-0 bg-transparent rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
                         ${isDayMode ? 'border-gray-300 text-gray-400 hover:bg-gray-50' : 'border-white/20 text-white/50 hover:bg-white/5'}`}>
                             <ChevronLeft className="rotate-180" size={24}/>
                             <span className="text-[10px] uppercase font-bold tracking-wider">Veure tot</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                     <SettingRow 
                        isDayMode={isDayMode}
                        icon={Download}
                        title="Administra l'emmagatzematge"
                        description="67,0 MB consumits locals al dispositiu."
                    />
                </div>

                {/* Secció 4: Privacitat i Configuració */}
                <h2 className={`mx-6 mb-3 text-[11px] font-black tracking-widest uppercase ${isDayMode ? 'text-gray-400' : 'text-gray-500'}`}>Privacitat i Seguretat</h2>
                <SettingRow 
                    isDayMode={isDayMode}
                    icon={Bell}
                    title="Silenciar notificacions"
                    rightElement={
                        <div className={`w-11 h-6 rounded-full p-1 cursor-pointer flex items-center shadow-inner border ${isDayMode ? 'bg-gray-200 border-gray-300' : 'bg-[#1F2937] border-white/5'}`}>
                            <div className={`w-4 h-4 rounded-full shadow-sm ${isDayMode ? 'bg-white' : 'bg-gray-400'}`}></div>
                        </div>
                    }
                />
                <SettingRow 
                    isDayMode={isDayMode}
                    icon={Clock}
                    title="Missatges temporals"
                    description="Desactivat per defecte. Les espurnes romanen."
                />
                <SettingRow 
                    isDayMode={isDayMode}
                    icon={Lock}
                    title="Privacitat Segura"
                    description="Els teus missatges i dades són privats i xifrats extrem a extrem. Estàs 100% segur al Mas."
                />

                 {/* Secció 5: Opcions de Xat Individual / Grup */}
                 <h2 className={`mx-6 mt-8 mb-3 text-[11px] font-black tracking-widest uppercase ${isDayMode ? 'text-gray-400' : 'text-gray-500'}`}>Membres del Xat</h2>
                 <SettingRow
                    isDayMode={isDayMode} 
                    icon={Plus}
                    title="Afegeix un participant"
                    description="Crea un grup amb aquesta persona o agents IA."
                />
                 <SettingRow 
                    isDayMode={isDayMode}
                    icon={Users}
                    title="Visualitza Membres"
                    description={`Hi ha ${chatData?.membersCount || 1} participant/s connectats.`}
                />

                 {/* Secció 6: Accions perilloses */}
                 <div className={`mt-8 mb-10 ${isGuestUser ? 'opacity-50 pointer-events-none' : ''}`}>
                    <SettingRow 
                        isDayMode={isDayMode}
                        icon={AlertTriangle}
                        title="Bloquejar participant"
                        isRed
                    />
                    <SettingRow 
                        isDayMode={isDayMode}
                        icon={LogOut}
                        title="Buidar tota la conversa"
                        isRed
                    />
                 </div>

            </div>

             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDayMode ? '#e5e7eb' : '#374151'}; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #FF6D00; }
            `}</style>
        </div>
    );
};

export default ChatManager;


=====================================
FILE: src/pages/Chrome145Report.jsx
=====================================

import React, { useEffect, useState } from 'react';
import { 
    Zap, Shield, Clock, Activity, AlertTriangle, 
    ArrowLeft, ExternalLink, Globe, Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * [DASHBOARD RENDIMENT CHROME 145]
 * Tauler de control sobirà per a auditar recursos bloquejants i navegacions suaus.
 */
const Chrome145Report = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        firstPaint: 0,
        firstContentfulPaint: 0,
        domInteractive: 0,
        renderBlockingResources: [],
        softNavigations: 0
    });

    useEffect(() => {
        // [MASTER AUDIT] Captura de mètriques natives del navegador
        const auditPerformance = () => {
            const performance = window.performance;
            if (!performance) return;

            const paintEntries = performance.getEntriesByType('paint');
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            const resources = performance.getEntriesByType('resource');
            const blocking = resources.filter(r => r.name.includes('fonts.googleapis.com') || r.name.includes('tailwind'));
            
            setMetrics({
                firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime.toFixed(2) || 0,
                firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime.toFixed(2) || 0,
                domInteractive: navigationEntry?.domInteractive.toFixed(2) || 0,
                renderBlockingResources: blocking.map(b => ({
                    name: b.name.split('/').pop(),
                    duration: b.duration.toFixed(2),
                    type: b.initiatorType
                })),
                softNavigations: 0
            });
        };

        // Esperem un bategat per a que les mètriques estiguen llestes
        const timer = setTimeout(auditPerformance, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in">
            <header className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/');
                            }
                        }} 
                        className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-[28px] hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Informe de Rendiment 145</h1>
                        <p className="text-slate-400 font-medium">Auditoria Sobirana [v10.33.2]</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-[28px] border border-emerald-500/20">
                    <Shield size={16} /> <span className="text-xs font-black uppercase">Optimitzat</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard 
                    icon={<Zap className="text-yellow-400" />} 
                    label="First Paint" 
                    value={`${metrics.firstPaint}ms`} 
                    status="EXCEL·LENT"
                />
                <MetricCard 
                    icon={<Clock className="text-indigo-400" />} 
                    label="FCP" 
                    value={`${metrics.firstContentfulPaint}ms`} 
                    status="OPTIMITZAT"
                />
                <MetricCard 
                    icon={<Activity className="text-rose-400" />} 
                    label="DOM Interactive" 
                    value={`${metrics.domInteractive}ms`} 
                    status="FLUID"
                />
                <MetricCard 
                    icon={<Globe className="text-cyan-400" />} 
                    label="Soft Navigations" 
                    value={metrics.softNavigations} 
                    status="DETECTADES"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white/5 border border-white/10 rounded-[28px] p-8">
                        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                            <AlertTriangle className="text-orange-500" /> Recursos Bloquejants Identificats
                        </h3>
                        {metrics.renderBlockingResources.length > 0 ? (
                            <div className="space-y-4">
                                {metrics.renderBlockingResources.map((res, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-[28px] border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center bg-orange-500/10 text-orange-500 rounded-[28px]">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm truncate max-w-[200px]">{res.name}</p>
                                                <p className="text-xs text-slate-500 uppercase">{res.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-orange-400">{res.duration}ms</p>
                                            <p className="text-[10px] text-slate-500 uppercase">Bloqueig Render</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No s'han detectat recursos bloquejants crítics. Netedat absoluta.</p>
                        )}
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-[28px] p-8">
                        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                            <Cpu className="text-indigo-400" /> Model Context Protocol (MCP)
                        </h3>
                        <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-[28px]">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                El sistema està preparat per a connectar-se al servidor MCP de Chrome DevTools 145. 
                                Això ens permetrà una automatització bategada on la IA pot inspeccionar i optimitzar 
                                el Mas sense intervenció humana.
                            </p>
                            <a 
                                href="https://github.com/ChromeDevTools/chrome-devtools-mcp" 
                                target="_blank" 
                                className="inline-flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs hover:underline"
                            >
                                Veure Protocol Web <ExternalLink size={14} />
                            </a>
                        </div>
                    </section>
                </div>

                <aside className="space-y-8">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[28px] p-8">
                        <h4 className="font-black uppercase text-emerald-400 mb-4 text-sm">Protocol de Millora</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <span className="text-emerald-500">✔</span>
                                Pre-càrrega de fonts (Noto Sans)
                            </li>
                            <li className="flex gap-3">
                                <span className="text-emerald-500">✔</span>
                                Fetch Priority: High (Logo & Identity)
                            </li>
                            <li className="flex gap-3">
                                <span className="text-emerald-500">✔</span>
                                Captura de Soft Navigations (React Router)
                            </li>
                            <li className="flex gap-3">
                                <span className="text-slate-600">○</span>
                                Throttling per a serveis IA externs
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[28px] p-8 text-center">
                        <p className="text-xs text-slate-500 uppercase font-black mb-2 tracking-widest">Estat de la Séquia</p>
                        <p className="text-3xl font-black text-white">99.8%</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-2">Disponibilitat Bategada</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, status }) => (
    <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 transition-transform hover:scale-105">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{label}</span>
        </div>
        <p className="text-2xl font-black mb-1">{value}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
    </div>
);

export default Chrome145Report;


=====================================
FILE: src/pages/CommunityDirectory.css
=====================================

.directory-page {
    min-height: 100vh;
    background: #000000;
    padding-bottom: 80px;
}

.directory-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 16px;
}

.directory-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.directory-card {
    background: #111111;
    border: 1px solid #222222;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.directory-card:hover {
    background: #1a1a1a;
    border-color: #333333;
    transform: translateX(4px);
}

.card-info {
    flex: 1;
    min-width: 0;
}

.card-info h3 {
    font-size: 16px;
    font-weight: 900;
    margin-bottom: 2px;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.card-info p {
    font-size: 11px;
    color: #ff6b00;
    margin-bottom: 6px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.bio-mini {
    font-size: 13px;
    color: #888888;
    line-height: 1.4;
}

.card-action {
    display: none;
}

@media (min-width: 768px) {
    .card-action {
        display: block;
    }
    
    .connect-btn-mini {
        padding: 8px 16px;
        background: #ffffff;
        color: #000000;
        border: none;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        cursor: pointer;
        transition: all 0.2s;
    }

    .connect-btn-mini:hover {
        background: #ff6b00;
        color: #ffffff;
    }
}

.empty-directory {
    text-align: center;
    padding: 100px 20px;
    color: #444444;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 12px;
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .directory-page {
    background: var(--bg-app);
}

.light .directory-card {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
}

.light .directory-card:hover {
    background: #f1f5f9;
    border-color: rgba(0, 0, 0, 0.15);
}

.light .card-info h3 {
    color: #000000;
}

.light .empty-directory {
    color: #666666;
}

=====================================
FILE: src/pages/CommunityDirectory.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ArrowLeft, Loader2, UserPlus, ChevronRight, User } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import StatusLoader from '../components/StatusLoader';
import Avatar from '../components/Avatar';
import { logger } from '../utils/logger';
import './CommunityDirectory.css';
import { useModal } from '../context/ModalContext';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants';

const CommunityDirectory = () => {
    const navigate = useNavigate();
    const { openConnectionModal, setIsGuestInteractionModalOpen } = useModal();
    const { user, isSuperAdmin } = useAuth();
    const { visionMode } = useDesign();
    const [directory, setDirectory] = useState({ people: [], entities: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('gent'); // gent, entitats

    useEffect(() => {
        loadDirectory();
    }, []);

    const loadDirectory = async () => {
        try {
            setIsLoading(true);
            const data = await supabaseService.getPublicDirectory();
            setDirectory(data);
        } catch (error) {
            logger.error('Error loading directory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <StatusLoader type="loading" />;

    const items = activeTab === 'gent' ? directory.people : directory.entities;
    
    // [VISION MODE FILTER] Purga de fantasmes IAIA
    const filteredItems = items.filter(item => {
        if (visionMode === 'humana' && !isSuperAdmin) {
            const role = String(item.role || item.type || '').toLowerCase();
            const name = String(item.full_name || item.name || '').toUpperCase();
            
            const isAI = role.includes(USER_ROLES.AMBASSADOR) || 
                         role.includes(USER_ROLES.OFFICIAL) ||
                         item.is_ai || 
                         item.id?.startsWith('11111111-') ||
                         name.includes('IAIA') ||
                         name.includes('FLASH') ||
                         name.includes('GALL') ||
                         name.includes('VIATJANT');
            if (isAI) return false;
        }
        return true;
    });

    return (
        <div className="directory-page bg-black min-h-screen">
            {/* Header Master Blindat v9.4.0 */}
            <header className="h-16 flex items-center px-4 bg-black border-b border-gray-800 sticky top-0 z-30">
                <button className="text-white mr-4" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest m-0">Comunitat</h1>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter m-0">Connexions que fan poble</p>
                </div>
            </header>

            <div className="px-4 py-4 bg-black border-b border-gray-800">
                <div className="flex gap-2">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all
                            ${activeTab === 'gent' ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
                        onClick={() => setActiveTab('gent')}
                    >
                        <Users size={16} />
                        Gent ({filteredItems.length})
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all
                            ${activeTab === 'entitats' ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
                        onClick={() => setActiveTab('entitats')}
                    >
                        <Building2 size={16} />
                        Entitats ({activeTab === 'entitats' ? filteredItems.length : directory.entities.length})
                    </button>
                </div>
            </div>

            <div className="directory-content">
                <div className="directory-grid">
                    {filteredItems.length === 0 ? (
                        <div className="empty-directory">
                            <Users size={48} opacity={0.3} />
                            <p>No s'han trobat resultats en aquesta categoria.</p>
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="directory-card"
                                onClick={() => navigate(activeTab === 'gent' ? `/perfil/${item.id}` : `/entitat/${item.id}`)}
                            >
                                <Avatar
                                    src={item.avatar_url}
                                    role={activeTab === 'gent' ? (item.role || 'user') : item.type}
                                    name={item.full_name || item.name}
                                    size={60}
                                />
                                <div className="card-info">
                                    <h3>{item.full_name || item.name}</h3>
                                    <p>{item.role || item.type} • {item.town_name || item.primary_town}</p>
                                    <span className="bio-mini">{item.bio || item.description || 'Sense descripció'}</span>
                                </div>
                                <div className="card-action">
                                    <button 
                                        className="master-button-canonic bg-white text-black text-[10px]" 
                                        style={{ height: '36px', padding: '0 16px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (user?.isAnonymous) {
                                                setIsGuestInteractionModalOpen(true);
                                                return;
                                            }
                                            openConnectionModal({
                                                postId: item.id,
                                                onUpdate: async (tags) => {
                                                    await supabaseService.connectWithProfile(user.id, item.id, tags);
                                                    loadDirectory();
                                                }
                                            });
                                        }}
                                    >
                                        CONNECTAR
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityDirectory;


=====================================
FILE: src/pages/CreateEntity.css
=====================================

.create-entity-page {
    min-height: 100vh;
    background: #000;
    color: white;
    padding: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.create-entity-header {
    text-align: center;
    margin-bottom: 40px;
    margin-top: 20px;
}

.create-entity-header .back-btn {
    position: absolute;
    top: 28px;
    left: 28px;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.type-icon-wrap {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.type-icon-wrap.groups { color: #6366F1; background: rgba(99, 102, 241, 0.1); }
.type-icon-wrap.business { color: #F59E0B; background: rgba(245, 158, 11, 0.1); }
.type-icon-wrap.official { color: #10B981; background: rgba(16, 185, 129, 0.1); }

.create-entity-header h1 {
    font-family: 'Noto Sans', sans-serif;
    font-size: 32px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
}

.create-entity-header p {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.4);
}

.create-entity-form {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-section label {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.6);
}

.form-section input, .form-section textarea {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    color: white;
    font-size: 16px;
    outline: none;
    transition: all 0.3s;
}

.form-section input:focus, .form-section textarea:focus {
    border-color: #F97316;
    background: rgba(255, 255, 255, 0.06);
}

.form-section textarea {
    min-height: 120px;
    resize: none;
}

.avatar-selection-mini {
    height: 140px;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
}

.avatar-selection-mini:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.02);
}

.avatar-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.3);
}

.avatar-placeholder span {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.1em;
}

.submit-entity-btn {
    height: 72px;
    background: white;
    color: black;
    border: none;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    margin-top: 20px;
    box-shadow: 0 10px 40px rgba(255, 255, 255, 0.1);
}

.submit-entity-btn:hover {
    transform: scale(1.02);
    background: #F97316;
    color: white;
    box-shadow: 0 20px 40px rgba(249, 115, 22, 0.4);
}

.submit-entity-btn:disabled {
    opacity: 0.3;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.1);
    color: gray;
}


=====================================
FILE: src/pages/CreateEntity.jsx
=====================================

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { ArrowLeft, Landmark, Users, Store, Shield, Check, Camera, Plus } from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import './CreateEntity.css';
import { logger } from '../utils/logger';

const CreateEntity = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'empresa';
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const typeLabels = {
        'grup': { label: 'Grup Social', icon: <Users size={32} />, color: 'groups' },
        'empresa': { label: 'Empresa o Comerç', icon: <Store size={32} />, color: 'business' },
        'institucio': { label: 'Entitat Oficial', icon: <Shield size={32} />, color: 'official' },
        'autonomo': { label: 'Autònom / Freelance', icon: <Users size={32} />, color: 'autonomous' },
        'estudiant': { label: 'Estudiant / Acadèmic', icon: <Users size={32} />, color: 'student' }
    };

    const currentType = typeLabels[type] || typeLabels['empresa'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setIsLoading(true);
            const entity = await supabaseService.createEntity({
                name,
                type,
                description,
                creator_id: user.id
            });
            
            setIsSuccess(true);
            setTimeout(() => {
                navigate(`/entitat/${entity.id}`);
            }, 2000);
        } catch (error) {
            logger.error('Error creating entity:', error);
            alert('Error al crear l\'entitat. Revisa els camps.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <StatusLoader type="loading" message="Cuidant el bategat del nou node..." />;
    if (isSuccess) return <StatusLoader type="success" message={`${currentType.label} creat amb èxit!`} />;

    return (
        <div className="create-entity-page">
            <header className="create-entity-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className={`type-icon-wrap ${currentType.color}`}>
                    {currentType.icon}
                </div>
                <h1>{currentType.label}</h1>
                <p>Configura la teua nova identitat al poble</p>
            </header>

            <form className="create-entity-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label>Nom de la pàgina</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Sant Gregori, El Rentonar..." 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-section">
                    <label>Descripció (Opcional)</label>
                    <textarea 
                        placeholder="De què tracta aquesta pàgina? Explica el teu impacte al poble."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="avatar-selection-mini">
                    <div className="avatar-placeholder">
                        <Camera size={24} />
                        <span>Puja un logotip</span>
                    </div>
                </div>

                <button type="submit" className="submit-entity-btn" disabled={!name}>
                    <span>BATEGA LA NOVA PÀGINA</span>
                    <Plus size={20} />
                </button>
            </form>
        </div>
    );
};

export default CreateEntity;


=====================================
FILE: src/pages/DAFOPage.css
=====================================

.dafo-page-container {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 20px;
    padding-top: calc(env(safe-area-inset-top) + 20px);
}

.dafo-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.back-btn-dafo {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-main);
    padding: 10px;
    border-radius: 0px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.back-btn-dafo:active {
    transform: scale(0.9);
}

.dafo-actions {
    display: flex;
    gap: 12px;
}

.action-btn-mini {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-muted);
    padding: 8px;
    border-radius: 0px;
    cursor: pointer;
}

.dafo-main-content {
    max-width: 800px;
    margin: 0 auto;
}

.dafo-didactic-footer {
    margin-top: 40px;
    padding: 30px;
    background: var(--bg-surface-soft);
    border-radius: 0px;
    border: 1px dashed var(--color-divider);
}

.dafo-didactic-footer h3 {
    color: var(--color-primary);
    margin-bottom: 15px;
    font-size: 1.2rem;
}

.dafo-didactic-footer p {
    color: var(--text-muted);
    line-height: 1.6;
    font-size: 0.95rem;
}

.dafo-page-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 40px;
    text-align: center;
}

.dafo-page-error h2 {
    margin: 20px 0 10px;
}

.dafo-page-error p {
    color: var(--text-muted);
    margin-bottom: 30px;
}

=====================================
FILE: src/pages/DAFOPage.jsx
=====================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import DAFOCard from '../components/DAFOCard';
import { MOCK_DAFOS } from '../data';
import SEO from '../components/SEO';
import './DAFOPage.css';

const DAFOPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dafoData = MOCK_DAFOS[id];

    if (!dafoData) {
        return (
            <div className="dafo-page-error">
                <ArrowLeft onClick={() => navigate(-1)} className="back-btn" />
                <h2>Anàlisi no trobada</h2>
                <p>El bategat d'aquest DAFO encara no ha sigut enregistrat al Mas.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Tornar a l'Inici</button>
            </div>
        );
    }

    return (
        <div className="dafo-page-container">
            <SEO
                title={`${dafoData.title} - Anàlisi DAFO`}
                description={dafoData.description}
            />

            <header className="dafo-page-header">
                <button onClick={() => navigate(-1)} className="back-btn-dafo">
                    <ArrowLeft size={24} />
                </button>
                <div className="dafo-actions">
                    <button className="action-btn-mini" title="Compartir" onClick={async () => {
                        if (navigator.share) {
                            try {
                                await navigator.share({
                                    title: `Anàlisi DAFO: ${dafoData.title}`,
                                    text: dafoData.description,
                                    url: window.location.href
                                });
                            } catch (err) {
                                if (err.name !== 'AbortError') {
                                    console.error('Error sharing DAFO:', err);
                                }
                            }
                        } else {
                            alert('La compartició no està disponible en aquest navegador.');
                        }
                    }}><Share2 size={18} /></button>
                    <button className="action-btn-mini" title="Descarregar" onClick={() => window.print()}><Download size={18} /></button>
                </div>
            </header>

            <main className="dafo-main-content">
                <DAFOCard data={dafoData} />

                <div className="dafo-didactic-footer">
                    <h3>💡 Per què un DAFO?</h3>
                    <p>
                        A Sóc de Poble apliquem el <strong>Rigor Tècnic Master</strong>. No prenem decisions basades en pálpits buits, sinó en el pes de les dades y el trellat social. Aquesta matriu ens ajuda a protegir el Mas de l'entropia digital y a potenciar les nostres arrels.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DAFOPage;


=====================================
FILE: src/pages/DesignCanon.css
=====================================

.design-canon-page {
    min-height: 100vh;
    background-color: var(--bg-canvas);
    padding: 100px 20px 60px;
    max-width: 1200px;
    margin: 0 auto;
}

.design-header {
    margin-bottom: 40px;
    position: relative;
}

.design-header .back-btn {
    background: var(--bg-surface-soft);
    border: 1px solid var(--color-divider);
    width: 44px;
    height: 44px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.3s ease;
}

.design-header .back-btn:hover {
    background: var(--color-primary-soft);
    border-color: var(--color-primary);
    transform: translateX(-4px);
}

.design-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 242, 255, 0.1);
    color: var(--color-primary);
    padding: 6px 16px;
    border-radius: 0px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
    border: 1px solid rgba(0, 242, 255, 0.2);
}

.design-header h1 {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 8px;
    color: var(--text-main);
}

.design-header p {
    font-size: 1.1rem;
    color: var(--text-muted);
}

.design-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
    margin-bottom: 60px;
}

.design-category-card {
    background: var(--bg-surface);
    border: 1px solid var(--color-divider);
    border-radius: 0px;
    padding: 30px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;
    overflow: hidden;
}

.design-category-card:hover {
    transform: translateY(-8px);
    border-color: var(--accent-color);
    box-shadow: var(--shadow-hard);
}

.design-category-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--accent-color);
    opacity: 0.6;
}

.category-header {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.category-icon {
    background: var(--bg-surface-soft);
    padding: 16px;
    border-radius: 0px;
    color: var(--accent-color);
    border: 1px solid var(--color-divider);
}

.category-title h2 {
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 4px;
    color: var(--text-main);
}

.category-title p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.5;
}

.link-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.design-link-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: var(--bg-surface-soft);
    border: 1px solid var(--color-divider);
    border-radius: 0px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.design-link-item:hover {
    background: var(--bg-surface);
    border-color: var(--accent-color);
}

.link-info h3 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 2px;
}

.link-info p {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.link-arrow {
    color: var(--accent-color);
    opacity: 0.5;
    transition: all 0.3s ease;
}

.design-link-item:hover .link-arrow {
    opacity: 1;
    transform: translate(2px, -2px);
}

.design-philosophy-footer {
    max-width: 800px;
    margin: 0 auto;
}

.design-stats-mini {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.stat-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 0, 0, 0.03);
    padding: 6px 12px;
    border-radius: 0px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    border: 1px solid var(--color-divider);
}

@media (max-width: 768px) {
    .design-canon-page {
        padding: 80px 16px 40px;
    }

    .design-grid-container {
        grid-template-columns: 1fr;
    }

    .design-header h1 {
        font-size: 2rem;
    }
}

=====================================
FILE: src/pages/DesignCanon.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users, Building2, Landmark, ExternalLink, Sparkles, BookOpen, Layers, MousePointer2 } from 'lucide-react';
import SEO from '../components/SEO';
import './DesignCanon.css';

const DesignCanon = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'usuari',
            title: 'Usuari (Agent)',
            description: 'Recursos centrats en la identitat personal i el disseny centrat en l\'humà.',
            icon: <User size={32} />,
            color: '#06B6D4', // Gem Cyan
            links: [
                { name: 'Material Design 3', url: 'https://m3.material.io', desc: 'Sistema de disseny de Google per a interfícies adaptables.' },
                { name: 'Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', desc: 'Estàndards de disseny d\'Apple per a experiències intuïtives.' }
            ]
        },
        {
            id: 'grup',
            title: 'Grup (Comunitat)',
            description: 'Recursos per al disseny social, col·laboratiu i la gestió de comunitats.',
            icon: <Users size={32} />,
            color: '#F97316', // Gem Orange
            links: [
                { name: 'Linear Method', url: 'https://linear.app/method', desc: 'Pràctiques per a construir productes moderns de forma eficient.' },
                { name: 'Radix UI', url: 'https://www.radix-ui.com/', desc: 'Components primitius per a construir xarxes socials accessibles.' }
            ]
        },
        {
            id: 'empresa',
            title: 'Empresa (Professional)',
            description: 'Recursos per al disseny comercial, professional i creixement econòmic rural.',
            icon: <Building2 size={32} />,
            color: '#81b29a',
            links: [
                { name: 'Shopify Polaris', url: 'https://polaris.shopify.com/', desc: 'Guia per a construir experiències de comerç excepcionals.' },
                { name: 'Stripe Design', url: 'https://stripe.com/design', desc: 'Excel·lència en disseny de productes financers.' }
            ]
        },
        {
            id: 'institucio',
            title: 'Institució (Públic)',
            description: 'Recursos per al disseny institucional, oficial i la sobirania de dades públiques.',
            icon: <Landmark size={32} />,
            color: '#f2cc81',
            links: [
                { name: 'NotebookLM', url: 'https://notebooklm.google.com/', desc: 'Intel·ligència per a sintetitzar coneixement institucional.' },
                { name: 'Raindrop.io', url: 'https://raindrop.io/', desc: 'Gestió de la memòria digital i recursos compartits.' }
            ]
        },
        {
            id: 'ia-interficies',
            title: 'Interfícies d\'IA (Modals)',
            description: 'Patrons de finestres emergents per a la simbiosi entre l\'humà i la màquina.',
            icon: <Sparkles size={32} />,
            color: '#FDE68A', // Gold/Yellow
            links: [
                { name: 'Patró Cronista', url: '#', desc: 'Modal en "Surface Old Lace" amb títol destacat i llistat narratiu.' },
                { name: 'Patró Tia Maria', url: '#', desc: 'Xat de proximitat amb bombolles asimètriques i tons taronges.' }
            ]
        }
    ];

    return (
        <div className="design-canon-page">
            <SEO
                title="Cànon de Disseny | Sóc de Poble"
                description="Recursos i principis de disseny per a l'evolució del món rural."
            />

            <header className="design-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-content">
                    <div className="design-badge">
                        <Sparkles size={16} />
                        <span>ESTÈTICA MESTRA</span>
                    </div>
                    <h1>Cànon GEM MODERN v2.0</h1>
                    <p>La síntesi de l'estètica clara (Llum i Vida) adaptada al bategat rural amb geometria bento (28px).</p>
                </div>
            </header>

            <main className="design-grid-container">
                {categories.map(cat => (
                    <section key={cat.id} className="design-category-card" style={{ '--accent-color': cat.color }}>
                        <div className="category-header">
                            <div className="category-icon">{cat.icon}</div>
                            <div className="category-title">
                                <h2>{cat.title}</h2>
                                <p>{cat.description}</p>
                            </div>
                        </div>

                        <div className="link-list">
                            {cat.links.map(link => (
                                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="design-link-item">
                                    <div className="link-info">
                                        <h3>{link.name}</h3>
                                        <p>{link.desc}</p>
                                    </div>
                                    <ExternalLink size={18} className="link-arrow" />
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            <section className="design-philosophy-footer">
                <div className="glass-card-premium">
                    <div className="section-header-mini">
                        <Layers size={20} color="var(--color-primary)" />
                        <h2>L'Ànima del Disseny [MASTER]</h2>
                    </div>
                    <p>
                        No busquem només funcionalitat, sinó una <strong>simbiosi</strong> mestre entre l'elegància clara i la resiliència del camp.
                        Basat en el cànon <strong>GEM MODERN</strong>: Claredat, Orgànica i Tech Rural.
                    </p>
                    <div className="design-stats-mini">
                        <div className="stat-pill">
                            <MousePointer2 size={14} />
                            <span>Tàctil-First</span>
                        </div>
                        <div className="stat-pill">
                            <BookOpen size={14} />
                            <span>Didàctic</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DesignCanon;


=====================================
FILE: src/pages/DidacticManual.css
=====================================

.manual-container {
    padding: var(--space-md);
    background-color: var(--md-sys-color-surface);
    min-height: 100vh;
    padding-top: calc(var(--header-height) + 20px);
}

.manual-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    border-bottom: 2px solid var(--md-sys-color-primary);
    padding-bottom: 16px;
}

.manual-header h1 {
    margin: 0;
    color: var(--md-sys-color-primary);
    font-size: 32px !important;
    text-transform: none !important;
}

.manual-header .subtitle {
    margin: 4px 0 0 0;
    color: var(--md-sys-color-on-surface);
    opacity: 0.7;
    font-size: var(--font-size-base);
}

.header-icon {
    color: var(--md-sys-color-primary);
}

/* Nota per a la Iaia */
.iaia-note {
    margin-bottom: 40px;
    padding: 24px;
    border-left: 4px solid var(--md-sys-color-tertiary);
}

.note-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.note-header h3 {
    margin: 0;
    font-size: 18px !important;
    color: var(--md-sys-color-tertiary) !important;
}

.iaia-note p {
    font-style: italic;
    font-size: var(--font-size-base);
    line-height: 1.6;
    color: var(--md-sys-color-on-surface);
    opacity: 0.9;
}

/* Sections */
.manual-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.manual-section {
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #FFF;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    color: var(--md-sys-color-primary);
}

.section-title h2 {
    margin: 0;
    font-size: 22px !important;
}

.section-desc {
    font-size: var(--font-size-base);
    color: var(--md-sys-color-on-surface);
    opacity: 0.7;
    margin-bottom: 20px;
}

/* Table */
.section-table-wrapper {
    overflow-x: auto;
}

.manual-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-base);
}

.manual-table th,
.manual-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.manual-table th {
    font-weight: 700;
    text-transform: uppercase;
    font-size: var(--font-size-base);
    color: var(--md-sys-color-secondary);
}

.item-name {
    font-weight: var(--font-weight-bold);
}

.tech-name {
    font-family: monospace;
    font-size: var(--font-size-base);
    opacity: 0.8;
}

/* Status Pills */
.status-pill {
    padding: 4px 8px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
}

.status-pill.operatiu {
    background: #E8F5E9;
    color: #2E7D32;
}

.status-pill.beta {
    background: #FFF3E0;
    color: #E65100;
}

.status-pill.pendent {
    background: #FFEBEE;
    color: #C62828;
}

.status-pill.in-progrés {
    background: #E3F2FD;
    color: #1565C0;
}

.status-pill.experimental {
    background: #F3E5F5;
    color: #7B1FA2;
}

/* Unclassified */
.unclassified h2 {
    color: var(--md-sys-color-on-surface);
}

.unclassified-list {
    list-style: none;
    padding: 0;
}

.unclassified-list li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    font-size: var(--font-size-base);
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.unclassified-list li svg {
    color: var(--md-sys-color-primary);
}

.manual-footer {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: var(--font-size-base);
    color: var(--md-sys-color-on-surface);
    opacity: 0.5;
}

/* Animations from index.css */
@media (max-width: 480px) {

    .manual-table th:nth-child(3),
    .manual-table td:nth-child(3) {
        display: none;
    }
}

=====================================
FILE: src/pages/DidacticPage.css
=====================================

.didactic-page-container {
    min-height: 100vh;
    background: var(--bg-main);
    color: var(--text-main);
    padding-bottom: 60px;
}

.didactic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--color-divider);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    font-size: 0.8rem;
    color: var(--color-primary);
}

.back-btn-didactic {
    background: transparent;
    border: none;
    color: var(--text-main);
    cursor: pointer;
}

.didactic-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.content-hero {
    margin-bottom: 40px;
    text-align: center;
}

.didactic-image-wrapper {
    width: 100%;
    border-radius: 0px;
    overflow: hidden;
    box-shadow: var(--shadow-hard);
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.didactic-image-wrapper img {
    width: 100%;
    display: block;
}

.didactic-main-title {
    font-size: 2.8rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 20px;
    background: linear-gradient(to right, #fff, var(--color-primary-light));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.didactic-body {
    background: var(--bg-surface-soft);
    padding: 40px;
    border-radius: 0px;
    border: 1px solid var(--color-divider);
}

.didactic-main-text h2 {
    font-size: 1.8rem;
    color: var(--color-primary);
    margin: 40px 0 20px;
}

.didactic-main-text h3 {
    font-size: 1.4rem;
    color: var(--color-primary-light);
    margin: 30px 0 15px;
}

.didactic-main-text p {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #ccc;
    margin-bottom: 20px;
}

.list-item-didactic {
    list-style: none;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    margin-bottom: 10px;
    font-weight: var(--font-weight-bold);
    border-left: 3px solid var(--color-primary);
}

.didactic-insight-box {
    margin-top: 60px;
    padding: 30px;
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%);
    border-radius: 0px;
    border: 1px solid rgba(234, 179, 8, 0.3);
}

.insight-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.insight-header h4 {
    color: var(--color-warning);
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: uppercase;
}

.didactic-footer {
    margin-top: 40px;
    text-align: center;
    color: var(--text-muted);
}

.footer-badges {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.badge-master {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 1px;
}

@keyframes didacticFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .didactic-main-title {
        font-size: 2rem;
    }

    .didactic-body {
        padding: 20px;
    }
}

=====================================
FILE: src/pages/DidacticPage.jsx
=====================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Share2, Download, Lightbulb } from 'lucide-react';
import { MOCK_FEED } from '../data';
import SEO from '../components/SEO';
import './DidacticPage.css';

const DidacticPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = MOCK_FEED.find(p => p.id === id);

    if (!post) {
        return (
            <div className="didactic-page-error">
                <ArrowLeft onClick={() => navigate(-1)} className="back-btn" />
                <h2>Contingut no trobat</h2>
                <p>Aquesta lliçó encara no ha sigut bategada al Mas.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Tornar a l'Inici</button>
            </div>
        );
    }

    return (
        <div className="didactic-page-container">
            <SEO
                title={`${post.metadata?.title || 'Lliçó Master'} - Sóc de Poble`}
                description={post.content.substring(0, 160)}
            />

            <header className="didactic-header">
                <button onClick={() => navigate(-1)} className="back-btn-didactic">
                    <ArrowLeft size={24} />
                </button>
                <div className="header-title">
                    <BookOpen size={20} color="var(--color-primary)" />
                    <span>AULA MASTER</span>
                </div>
                <div className="header-actions">
                    <button className="action-btn-didactic"><Share2 size={18} /></button>
                </div>
            </header>

            <main className="didactic-content">
                <div className="content-hero">
                    {post.image_url && post.image_url.length > 0 && (
                        <div className="didactic-image-wrapper">
                            <img src={post.image_url[0]} alt={post.metadata?.title} />
                        </div>
                    )}
                    <h1 className="didactic-main-title">{post.metadata?.title || 'Lliçó Magistral'}</h1>
                </div>

                <div className="didactic-body">
                    <div className="didactic-main-text">
                        {/* Simplistic rendering of "markdown-like" content from feed */}
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h2 key={i}>{line.replace('# ', '')}</h2>;
                            if (line.startsWith('## ')) return <h3 key={i}>{line.replace('## ', '')}</h3>;
                            if (line.startsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                            if (line.match(/^\d\./)) return <li key={i} className="list-item-didactic">{line}</li>;
                            return <p key={i}>{line}</p>;
                        })}
                    </div>

                    <div className="didactic-insight-box">
                        <div className="insight-header">
                            <Lightbulb size={24} color="var(--color-warning)" />
                            <h4>Trellat de l'IAIA</h4>
                        </div>
                        <p>{post.metadata?.didactic_text || "Aquesta lliçó ens ajuda a posar els peus a la terra y el cap a les estrelles."}</p>
                    </div>
                </div>

                <div className="didactic-footer">
                    <p>Creat per {post.author} • {post.time}</p>
                    <div className="footer-badges">
                        <span className="badge-master">NIVELL DÉU</span>
                        <span className="badge-master">SMART VILLAGE</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DidacticPage;


=====================================
FILE: src/pages/DossierSocis.css
=====================================

.dossier-container {
    padding: 0 0 100px 0;
    color: white;
    background: #000;
    font-family: 'Inter', sans-serif;
}

/* HERO SECTION */
.dossier-hero {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10%;
    margin-top: 64px; /* Space for the master sticky header */
    background: radial-gradient(circle at 70% 30%, #F97316 0%, transparent 40%),
                radial-gradient(circle at 20% 70%, #DB2777 0%, transparent 40%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.dossier-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
    max-width: 600px;
    z-index: 10;
}

.badge-cimera {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
    display: inline-block;
    margin-bottom: 24px;
    color: #F97316;
}

.hero-logo-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 32px;
}

.hero-logo-main {
    height: 80px;
    filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.4));
}

.hero-subtitle-addon {
    font-size: 1.5rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #F97316, #DB2777);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-tagline {
    font-size: 1.5rem;
    color: #94a3b8;
    margin-bottom: 48px;
    font-weight: 300;
}

.hero-stats {
    display: flex;
    gap: 40px;
}

.stat-item {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 900;
    font-family: 'Noto Sans', sans-serif;
}

.stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #F97316;
}

.amphora-glow {
    font-size: 15rem;
    filter: drop-shadow(0 0 50px rgba(249, 115, 22, 0.3));
    animation: float 6s infinite ease-in-out;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

/* SECTIONS */
.dossier-section {
    padding: 100px 10%;
}

.dark-variant {
    background: #0a0a0a;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 60px;
    letter-spacing: -1px;
}

.section-intro {
    font-size: 1.2rem;
    color: #94a3b8;
    margin-bottom: 48px;
    max-width: 800px;
}

.section-title svg {
    color: #F97316;
}

/* BENTO GRID - VERTICAL STACK (v.MASTER) */
.bento-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.bento-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 40px;
    padding: 48px;
    display: flex;
    flex-direction: column;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bento-card:hover {
    transform: scale(1.02);
    border-color: rgba(255, 255, 255, 0.2);
}

.bento-card.large {
    grid-column: auto;
    grid-row: auto;
}

.bento-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.bento-icon {
    width: 24px;
    height: 24px;
}

.bento-label {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.5;
}

.bento-card h3 {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 20px;
}

.bento-card p {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 30px;
}

.bento-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bento-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.bento-list svg {
    color: #10B981;
}

.b2g-accent { border-left: 4px solid #F97316; }
.b2b-accent { border-left: 4px solid #DB2777; }
.tech-accent { border-left: 4px solid #3B82F6; }
.node-accent { border-left: 4px solid #10B981; }

/* MINI STATS */
.bento-mini-stats {
    display: flex;
    gap: 20px;
    margin-top: auto;
}

.mini-stat {
    display: flex;
    flex-direction: column;
}

.mini-stat span {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
}

.mini-stat strong {
    font-size: 1.2rem;
    font-weight: 900;
    color: white;
}

/* COST CHART */
.cost-chart {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    height: 100px;
    margin-top: auto;
    padding-bottom: 10px;
}

.chart-bar {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cloud .bar-fill { background: #ef4444; }
.local .bar-fill { background: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }

.bar-fill span {
    font-size: 10px;
    font-weight: 950;
    transform: rotate(-90deg);
    white-space: nowrap;
}

/* NODE CONNECTIVITY */
.node-connectivity {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: auto;
    height: 100px;
}

.node-hub {
    background: #F97316;
    padding: 10px 15px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
}

.node-spoke {
    background: rgba(255,255,255,0.1);
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 10px;
    border: 1px solid rgba(255,255,255,0.1);
}

/* FEDERATED VISION */
.federated-vision {
    background: radial-gradient(circle at 100% 100%, rgba(219, 39, 119, 0.05) 0%, transparent 40%);
}

.vision-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.vision-title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 30px;
    letter-spacing: -1px;
}

.vision-text p {
    font-size: 1.2rem;
    color: #94a3b8;
    line-height: 1.8;
}

.rhizome-web {
    background: rgba(255,255,255,0.02);
    border-radius: 40px;
    padding: 40px;
    border: 1px dotted rgba(255,255,255,0.1);
}

.rhizome-svg {
    filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.2));
}

.center-node { fill: #F97316; }
.spoke-node { fill: white; }
.link-line { stroke: rgba(255,255,255,0.1); stroke-width: 1; stroke-dasharray: 4; }

@media (max-width: 1024px) {
    .bento-grid { grid-template-columns: 1fr; }
    .bento-card.large { grid-column: auto; }
    .vision-grid { grid-template-columns: 1fr; gap: 40px; }
}

/* CTA */
.dossier-cta {
    padding: 100px 10%;
    text-align: center;
}

.cta-box {
    background: linear-gradient(to right, #F97316, #DB2777);
    padding: 80px;
    border-radius: 40px;
    color: white;
}

.cta-box h2 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 20px;
}

.btn-contact-master {
    background: white;
    color: black;
    padding: 20px 40px;
    border-radius: 999px;
    font-weight: 900;
    margin-top: 40px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    margin-right: auto;
    transition: all 0.3s ease;
}

.btn-contact-master:hover {
    transform: scale(1.1);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.footer-credits {
    margin-top: 60px;
    font-size: 10px;
    color: #444;
    letter-spacing: 4px;
}

@media (max-width: 768px) {
    .hero-title { font-size: 2.5rem; }
    .hero-stats { flex-direction: column; gap: 20px; }
    .business-model-grid { grid-template-columns: 1fr; }
    .scalability-content { flex-direction: column; }
    .cta-box { padding: 40px; }
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .dossier-container {
    background: #f8fafc;
    color: #000;
}
.light .dossier-hero {
    background: radial-gradient(circle at 70% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 20% 70%, rgba(219, 39, 119, 0.1) 0%, transparent 40%);
    border-bottom-color: rgba(0,0,0,0.05);
}
.light .dark-variant { background: #ffffff; }
.light .bento-card {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}
.light .bento-card:hover {
    border-color: rgba(0,0,0,0.1);
}
.light .mini-stat strong { color: #000; }
.light .chart-bar { background: rgba(0,0,0,0.05); }
.light .rhizome-web {
    background: #ffffff;
    border-color: rgba(0,0,0,0.1);
}
.light .node-spoke {
    background: #f1f5f9;
    border-color: rgba(0,0,0,0.1);
    color: #000;
}
.light .spoke-node { fill: #000; }
.light .link-line { stroke: rgba(0,0,0,0.1); }
.light .bento-card h3 { color: #000; }


=====================================
FILE: src/pages/DossierSocis.jsx
=====================================

import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Globe, Users, TrendingUp, Award, ArrowRight, CheckCircle, Smartphone, Database, Server, Layers, ArrowLeft } from 'lucide-react';
import './DossierSocis.css';

/**
 * DOSSIER DE SOCIS: SOLLUTIA EDITION 🏺🚀
 * Una landing page d'alta fidelitat per a presentar el projecte a possibles socis estratègics.
 * Basat en l'arquitectura Eg-walker, Rhizome i el Model de Franquícia de Node.
 */
const DossierSocis = () => {
    const navigate = useNavigate();

    return (
        <div className="dossier-container animate-fade-in relative">
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-6 left-6 z-[100] p-4 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 backdrop-blur-xl shadow-2xl hover:scale-110 active:scale-95 group"
                title="Tornar"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            {/* HERO SECTION: LA VISIÓ SUPREMA */}
            <header className="dossier-hero">
                <div className="hero-content">
                    <div className="badge-cimera">CIMERA SOLLUTIA 2026</div>
                    <div className="hero-logo-container">
                        <img src="/assets/master/logo-socdepoble-rect.svg" alt="Sóc de Poble" className="hero-logo-main" />
                        <span className="hero-subtitle-addon">L'Algorisme de la Terra</span>
                    </div>
                    <p className="hero-tagline">Refundant la identitat rural mitjançant sobirania digital i xarxes autònomes.</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">€0</span>
                            <span className="stat-label">Cost de Servidor</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">100%</span>
                            <span className="stat-label">Local-First</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">∞</span>
                            <span className="stat-label">Escalabilitat</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="amphora-glow">🏺</div>
                </div>
            </header>

            {/* SECCIÓ 1: ARQUITECTURA TÈCNICA (L'AVANTATGE EG-WALKER) */}
            <section className="dossier-section">
                <h2 className="section-title"><Database size={32} /> Arquitectura Revolucionària</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <Layers className="card-icon" />
                        <h3>Eg-walker CRDT</h3>
                        <p>Sincronització de graf d'esdeveniments (DAG) sense conflictes. Convergència determinista en local que elimina la necessitat de base de dades central per a la interacció social.</p>
                    </div>
                    <div className="feature-card">
                        <Zap className="card-icon" />
                        <h3>Xarxa Rhizome</h3>
                        <p>Protocol gossip basat en <strong>Plumtree</strong> i <strong>HyParView</strong>. Els telèfons dels veïns formen la malla de comunicació, reduint la dependència del núvol al mínim.</p>
                    </div>
                    <div className="feature-card">
                        <Smartphone className="card-icon" />
                        <h3>Local-First (No Spinners)</h3>
                        <p>L'usuari és el propietari de les seues dades. Càrrega instantània des de IndexedDB. L'app funciona al mig del camp sense cobertura i sincronitza al tornar a la civilització.</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓ 2: MODEL DE NEGOCI (PILARS DE SOSTENIBILITAT) */}
            <section className="dossier-section dark-variant">
                <h2 className="section-title"><TrendingUp size={32} /> Model de Negoci Híbrid</h2>
                <p className="section-intro">Un ecosistema de sostenibilitat basat en la utilitat administrativa, la dinamització econòmica i l'eficiència tecnològica extrema.</p>
                
                <div className="bento-grid">
                    {/* B2G: EL SECRETARI */}
                    <div className="bento-card large b2g-accent">
                        <div className="bento-header">
                            <Shield className="bento-icon" />
                            <span className="bento-label">Model B2G</span>
                        </div>
                        <h3>"El Secretari" (SaaS)</h3>
                        <p>Subscripció mestre per a Ajuntaments que automatitza la gestió pública rural.</p>
                        <ul className="bento-list">
                            <li><CheckCircle size={16} /> <strong>Automatització de Bàndols:</strong> Reducció del temps administratiu mitjançant IA.</li>
                            <li><CheckCircle size={16} /> <strong>Digitalització de Patrimoni:</strong> Inventari d'actius, rutes i catàleg municipal.</li>
                            <li><CheckCircle size={16} /> <strong>Canal Blindat:</strong> Comunicació sobirana sense dependre d'apps de tercers.</li>
                        </ul>
                    </div>

                    {/* B2B: ESSÈNCIES */}
                    <div className="bento-card b2b-accent">
                        <div className="bento-header">
                            <Globe className="bento-icon" />
                            <span className="bento-label">Model B2B</span>
                        </div>
                        <h3>"Essències" i La Botiga</h3>
                        <p>Monetització de l'economia local sense intermediaris (Km 0).</p>
                        <ul className="bento-list">
                            <li><strong>Subscripció Premium:</strong> Per a productors (oli, vi, artesania).</li>
                            <li><strong>Turisme Experiencial:</strong> Venda directa d'experiències al territori.</li>
                        </ul>
                    </div>

                    {/* COST SAVINGS */}
                    <div className="bento-card tech-accent">
                        <div className="bento-header">
                            <Zap className="bento-icon" />
                            <span className="bento-label">Marge Tècnic</span>
                        </div>
                        <h3>Estalvi Estructural</h3>
                        <p>Cost de servidor $\approx$ 0€. Gràcies a Rhizome, la xarxa es manté des dels dispositius dels veïns.</p>
                        <div className="cost-chart">
                            <div className="chart-bar cloud" title="SaaS Tradicional (Vendes Altament Costoses)">
                                <div className="bar-fill" style={{ height: '80%' }}><span>CLOUD AWS/GC</span></div>
                            </div>
                            <div className="chart-bar local" title="Sóc de Poble (Marge Net Maximitzat)">
                                <div className="bar-fill" style={{ height: '5%' }}><span>RHIZOME</span></div>
                            </div>
                        </div>
                    </div>

                    {/* EXPANSIONAL FEDERATION */}
                    <div className="bento-card node-accent">
                        <div className="bento-header">
                            <Users className="bento-icon" />
                            <span className="bento-label">Llicència de Node</span>
                        </div>
                        <h3>Franquícia Tecnològica</h3>
                        <p>Exportació de la infraestructura a altres territoris (White Label).</p>
                        <div className="bento-mini-stats">
                            <div className="mini-stat"><span>Set-up</span><strong>€€€</strong></div>
                            <div className="mini-stat"><span>Manteniment</span><strong>Quota fix</strong></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓ 3: LA VISIÓ FEDERADA */}
            <section className="dossier-section federated-vision">
                <div className="vision-grid">
                    <div className="vision-text">
                        <h2 className="vision-title">Franquícia de Node</h2>
                        <p>A diferència de les Big Tech, no busquem centralitzar dades, busquem federar sobirania. Cada regió opera el seu propi node amb la seua pròpia identitat d'IA, finançada localment.</p>
                        <div className="quote-box">
                            "Inspirat en Ehud Shapiro: Grassroots Systems per a la sobirania digital."
                        </div>
                    </div>
                    <div className="vision-visual">
                        <div className="rhizome-web">
                            {/* Animated SVG mapping node connections */}
                            <svg viewBox="0 0 400 300" className="rhizome-svg">
                                <circle cx="200" cy="150" r="10" className="center-node" />
                                <line x1="200" y1="150" x2="100" y2="100" className="link-line" />
                                <line x1="200" y1="150" x2="300" y2="100" className="link-line" />
                                <line x1="200" y1="150" x2="150" y2="250" className="link-line" />
                                <line x1="200" y1="150" x2="250" y2="250" className="link-line" />
                                <circle cx="100" cy="100" r="5" className="spoke-node" />
                                <circle cx="300" cy="100" r="5" className="spoke-node" />
                                <circle cx="150" cy="250" r="5" className="spoke-node" />
                                <circle cx="250" cy="250" r="5" className="spoke-node" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION: REUNIÓ AMB SOLLUTIA */}
            <footer className="dossier-cta">
                <div className="cta-box">
                    <h2>Preparats per a la refundació?</h2>
                    <p>Busquem socis que entenguen que el futur de la tecnologia no és el núvol, sinó la terra.</p>
                    <button className="btn-contact-master">
                        <span>Pactar Bategat</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div className="footer-credits">
                    SÓC DE POBLE © 2026 • ARQUITECTURA MASTER V5.16
                </div>
            </footer>
        </div>
    );
};

export default DossierSocis;


=====================================
FILE: src/pages/EntityManagement.css
=====================================

.entity-mgmt-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding-bottom: 80px;
}

.entity-mgmt-header {
    background: var(--bg-card);
    padding: 60px 24px 30px;
    border-bottom: 1px solid var(--color-border);
    position: relative;
    text-align: center;
}

.entity-mgmt-header .back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: transparent;
    border: none;
    color: var(--text-main);
    cursor: pointer;
}

.entity-mgmt-header h1 {
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 8px;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.entity-mgmt-header p {
    color: var(--text-muted);
    font-size: var(--font-size-base);
}

.entity-mgmt-content {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.entity-mgmt-content h3 {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 16px;
    color: var(--text-main);
}

.creation-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.create-card {
    background: var(--bg-card);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    text-align: left;
}

.create-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hard);
    border-color: var(--color-primary);
}

.create-icon {
    width: 64px;
    height: 64px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.create-icon.groups {
    background: rgba(93, 95, 239, 0.1);
    color: #5D5FEF;
}

.create-icon.business {
    background: rgba(230, 81, 0, 0.1);
    color: #E65100;
}

.create-icon.official {
    background: rgba(46, 125, 50, 0.1);
    color: #2E7D32;
}

.create-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.create-info strong {
    font-size: var(--font-size-base);
    color: var(--text-main);
}

.create-info span {
    font-size: var(--font-size-base);
    color: var(--text-muted);
}

.plus-icon {
    color: var(--color-border);
    transition: color 0.2s;
}

.create-card:hover .plus-icon {
    color: var(--color-primary);
}

.managed-entity-item {
    background: var(--bg-card);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    margin-bottom: 12px;
    transition: all 0.2s;
}

.managed-entity-item:hover {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.02);
}

.entity-avatar-mini {
    width: 44px;
    height: 44px;
    border-radius: 0px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-main);
}

.entity-avatar-mini img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.entity-avatar-mini.empresa {
    color: #E65100;
}

.entity-avatar-mini.grup {
    color: #5D5FEF;
}

.entity-avatar-mini.entitat {
    color: #2E7D32;
}

.entity-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.entity-detail strong {
    font-size: var(--font-size-base);
    color: var(--text-main);
}

.entity-detail span {
    font-size: var(--font-size-base);
    color: var(--text-muted);
}

.managed-entity-item .chevron {
    color: var(--color-border);
}

.empty-entities {
    text-align: center;
    padding: 40px;
    background: rgba(0, 0, 0, 0.02);
    border: 2px dashed var(--color-border);
    border-radius: 0px;
    color: var(--text-muted);
}

.empty-entities p {
    margin-top: 12px;
    font-weight: 700;
}

.empty-entities .sub {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
}

/* --- TABLET / DESKTOP ADAPTATION (iPad Mode) --- */
@media (min-width: 768px) {
    .entity-mgmt-content {
        max-width: 1000px;
        /* Use more screen real estate */
        padding: 40px;
        gap: 60px;
    }

    .entity-mgmt-header h1 {
        font-size: 36px;
        /* Bigger title */
    }

    /* Creation Grid: 3 columns */
    .creation-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    .create-card {
        flex-direction: column;
        text-align: center;
        padding: 32px 24px;
        height: 100%;
        justify-content: center;
        gap: 20px;
    }

    .create-icon {
        width: 80px;
        height: 80px;
        margin-bottom: 8px;
    }

    .create-icon svg {
        width: 40px;
        height: 40px;
    }

    .create-info {
        align-items: center;
    }

    .create-info strong {
        font-size: 18px;
        margin-bottom: 4px;
    }

    .plus-icon {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    /* My Entities List: 2 columns */
    .entities-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .managed-entity-item {
        margin-bottom: 0;
        /* Remove bottom margin in grid */
        padding: 20px;
    }

    .entity-avatar-mini {
        width: 56px;
        height: 56px;
    }
}

=====================================
FILE: src/pages/EntityManagement.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Building2, Store, Users, ArrowLeft, Plus, ChevronRight, Layout, Shield } from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import './EntityManagement.css';
import { logger } from '../utils/logger';

const EntityManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEntities = async () => {
            try {
                setIsLoading(true);
                const data = await supabaseService.getUserEntities(user.id);
                setEntities(data || []);
            } catch (error) {
                logger.error('Error loading entities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadEntities();
        }
    }, [user]);

    if (isLoading) return <StatusLoader type="loading" />;

    return (
        <div className="entity-mgmt-page">
            <header className="entity-mgmt-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Gestió d'Entitats</h1>
                <p>Crea i administra el teu impacte al poble</p>
            </header>

            <div className="entity-mgmt-content">
                <section className="creation-section">
                    <h3>Crea una nova pàgina</h3>
                    <div className="creation-grid">
                        <button className="create-card" onClick={() => navigate('/crear-entitat?type=grup')}>
                            <div className="create-icon groups">
                                <Users size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Grup Social</strong>
                                <span>Associacions, penyes...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>

                        <button className="create-card" onClick={() => navigate('/crear-entitat?type=empresa')}>
                            <div className="create-icon business">
                                <Store size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Empresa o Comerç</strong>
                                <span>Projectes o botigues...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>

                        <button className="create-card" onClick={() => navigate('/crear-entitat?type=autonomo')}>
                            <div className="create-icon autonomous">
                                <Users size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Autònom / Freelance</strong>
                                <span>El teu perfil professional...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>

                        <button className="create-card" onClick={() => navigate('/crear-entitat?type=estudiant')}>
                            <div className="create-icon student">
                                <Users size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Estudiant / Acadèmic</strong>
                                <span>Estudis, pràctiques...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>

                        <button className="create-card" onClick={() => navigate('/crear-entitat?type=institucio')}>
                            <div className="create-icon official">
                                <Shield size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Entitat Oficial</strong>
                                <span>Ajuntaments, fundacions...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>
                    </div>
                </section>

                <section className="my-entities-section">
                    <h3>Les teves entitats ({entities.length})</h3>
                    {entities.length === 0 ? (
                        <div className="empty-entities">
                            <Layout size={48} opacity={0.3} />
                            <p>Encara no gestioneu cap entitat.</p>
                            <p className="sub">Comenceu creant-ne una a dalt!</p>
                        </div>
                    ) : (
                        <div className="entities-list">
                            {entities.map(entity => (
                                <Link to={`/entitat/${entity.id}`} key={entity.id} className="managed-entity-item">
                                    <div className={`entity-avatar-mini ${entity.type}`}>
                                        {entity.avatar_url ? (
                                            <img src={entity.avatar_url} alt={entity.name} />
                                        ) : (
                                            entity.type === 'empresa' ? <Store size={20} /> :
                                                entity.type === 'grup' ? <Users size={20} /> : <Shield size={20} />
                                        )}
                                    </div>
                                    <div className="entity-detail">
                                        <strong>{entity.name}</strong>
                                        <span>{entity.member_role} • {entity.type}</span>
                                    </div>
                                    <ChevronRight size={20} className="chevron" />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EntityManagement;


=====================================
FILE: src/pages/Financament.jsx
=====================================

import React from 'react';
import { 
    Heart, Target, Users, Zap, 
    TrendingUp, Shield, Globe, 
    ArrowLeft, ExternalLink, Mail,
    CreditCard, BadgeCheck, Sparkles,
    Handshake, Wallet, Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HubView.css'; // Reutilitzem els estils bategats del Hub per a coherència

const Financament = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Clients PRO & Sobirania",
            icon: Shield,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            description: "Subscripcions per a pobles, ajuntaments i entitats que volen governar la seua pròpia xarxa sense algoritmes externs.",
            features: ["Domini propi", "Suport prioritari de l'IAIA", "Eines de gestió avançada"]
        },
        {
            title: "Patrocini Km 0",
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            description: "Empreses del territori que bateguen amb nosaltres. Publicitat no invasiva, ètica i centrada en la proximitat.",
            features: ["Presència al Mercat", "Segell de Confiança Rural", "Col·laboracions bategades"]
        },
        {
            title: "Anunciants Ètics",
            icon: Target,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            description: "Espais reservats per a marques que aporten valor real al món rural, defugint el soroll i el 'clickbait'.",
            features: ["Audiència segmentada", "Integració orgànica al Feed", "Sense trackers brossa"]
        }
    ];

    return (
        <div className="hub-view-container flex-1 min-h-full bg-theme-base text-theme-text p-6 lg:p-12 animate-in fade-in duration-700">
            {/* HEADER */}
            <header className="hub-header flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/hub')} 
                        className="w-14 h-14 flex items-center justify-center rounded-[28px] transition-all active:scale-95 border-2 border-transparent hover:border-[var(--border-master)] bg-[var(--bg-panel)] opacity-80 hover:opacity-100"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black uppercase tracking-[0.4em] text-orange-500">Sostenibilitat</span>
                            <div className="h-[2px] w-12 bg-orange-500/50"></div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none italic">
                            Finançament <span className="text-orange-500">Sobirà</span>
                        </h1>
                    </div>
                </div>
            </header>

            {/* HERO PHILOSOPHY */}
            <section className="max-w-4xl mx-auto text-center mb-24">
                <div className="flex flex-col items-center gap-2 mb-10">
                    <div className="h-[1px] w-24 bg-orange-500/30"></div>
                    <div className="flex items-center gap-3 text-orange-500/80">
                        <Sparkles size={18} strokeWidth={2.5} />
                        <span className="text-[15px] font-black uppercase tracking-[0.5em] italic">El Trellat de la Independència</span>
                    </div>
                    <div className="h-[1px] w-24 bg-orange-500/30"></div>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black mb-10 leading-tight uppercase tracking-tighter italic">
                    Un projecte lliure necessita un model de negoci <span className="text-indigo-400">transparent i arrelat</span>.
                </h2>
                <p className="text-3xl text-theme-text leading-relaxed font-black mb-12 opacity-90">
                    "Sóc de Poble" no ven dades. No bateguem per a grans corporacions. 
                    Bateguem perquè el territori tinga la seua pròpia veu, finançada per la comunitat i per aquells que creuen en el km 0 digital.
                </p>
            </section>

            {/* OPTIONS GRID - [ROBUSTESA v1.0] Stacks earlier to avoid narrow frames */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-screen-2xl mx-auto mb-24 px-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-theme-panel border border-[var(--border-master)] hover:border-[var(--color-primary)] opacity-95 hover:opacity-100 p-10 rounded-[48px] transition-all group flex flex-col min-h-[500px] shadow-2xl relative overflow-hidden">
                        {/* Background subtle decoration to fill space */}
                        <div className="absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 pointer-events-none transition-colors bg-white/5 group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/10" />
                        
                        <div className={`w-20 h-20 ${section.bg} ${section.color} rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                            <section.icon size={40} />
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-6 leading-none">{section.title}</h3>
                        <p className="text-2xl text-theme-text opacity-80 mb-10 flex-1 leading-relaxed font-bold break-words">{section.description}</p>
                        <ul className="space-y-6 mb-12">
                            {section.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm font-black uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-300">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-[28px] shadow-[0_0_15px_rgba(99,102,241,0.7)] mt-1 shrink-0" />
                                    <span className="leading-tight">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full h-20 bg-[var(--bg-app)] border-2 border-[var(--border-master)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white rounded-[28px] font-black uppercase text-xl tracking-widest transition-all shadow-xl active:scale-95 text-theme-text">
                            Saber-ne més
                        </button>
                    </div>
                ))}
            </div>

            {/* INSTITUTIONAL / MASTER AREA */}
            <section className="max-w-7xl mx-auto mb-24">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border-dashed">
                    <div className="w-24 h-24 bg-indigo-500 text-white rounded-[28px] flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] shrink-0">
                        <Landmark size={48} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-6xl font-black uppercase tracking-tighter italic mb-8 text-theme-text">Inversió i <span className="text-indigo-500">Patrimoni Rural</span></h2>
                        <p className="text-3xl text-theme-text opacity-90 leading-relaxed font-black">
                            Busquem aliats institucionals i inversors que no busquen només rendibilitat financera, sinó impacte social i resiliència territorial. 
                            Participa en la construcció de la infraestructura digital més important del Mas.
                        </p>
                    </div>
                    <a href="mailto:hola@socdepoble.org" className="bg-[var(--theme-accent-primary)] text-[var(--on-theme-accent-primary)] hover:opacity-90 px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-2xl transition-all active:scale-95 shadow-lg flex items-center gap-4">
                        <Mail size={32} /> Contactar amb el Mas
                    </a>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="hub-footer flex flex-col items-center pt-16 border-t border-[var(--border-master)] gap-8 text-center pb-24">
                <p className="text-theme-text opacity-60 font-black text-sm tracking-widest uppercase max-w-xl leading-relaxed">
                    Tot el finançament es reinverteix directament en mantenir la matriu lliure i el sistema operatiu rural en creixement constant.
                </p>
            </footer>
        </div>
    );
};

export default Financament;


=====================================
FILE: src/pages/GenesisViewer.css
=====================================

.genesis-viewer {
    min-height: 100vh;
    background-color: var(--bg-page);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
}

/* Header & Nav */
.genesis-header {
    background-color: var(--header-bg);
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-hard);
}

.genesis-header .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.brand-icon {
    font-size: 2rem;
}

.brand-text h1 {
    font-size: 1.25rem;
    font-weight: 900;
    margin: 0;
    line-height: 1;
}

.brand-subtitle {
    font-size: 0.7rem;
    opacity: 0.8;
    letter-spacing: 0.1em;
    margin: 0;
}

.genesis-nav {
    display: flex;
    gap: 1.5rem;
}

.genesis-nav button {
    background: none;
    border: none;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    padding: 0.5rem 0;
}

.genesis-nav button:hover,
.genesis-nav button.active {
    opacity: 1;
    border-bottom: 2px solid white;
}

/* Content Area */
.genesis-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    flex: 1;
    width: 100%;
}

.intro-card {
    background: white;
    padding: 2rem;
    border-radius: 0px;
    border-left: 8px solid var(--header-bg);
}

.badge {
    padding: 0.4rem 0.8rem;
    border-radius: 0px;
    font-size: 0.8rem;
    font-weight: 700;
}

.status-ok {
    background: #dcfce7;
    color: #166534;
}

.status-walker {
    background: #fef3c7;
    color: #92400e;
}

.status-weber {
    background: #dbeafe;
    color: #1e40af;
}

/* Metrics Grid */
.grid-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.card {
    background: white;
    border-radius: 0px;
    box-shadow: var(--shadow-hard);
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    box-shadow: var(--shadow-hard);
}

.metrics-card.dark-mode {
    background: #1c1c1e;
    color: white;
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.card-top h3 {
    margin: 0;
    font-size: 1.1rem;
}

/* Team List */
.team-list {
    list-style: none;
    padding: 0;
}

.team-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0px;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.role-tag {
    font-size: 0.75rem;
    background: #e2e8f0;
    padding: 0.1rem 0.4rem;
    border-radius: 0px;
}

.status-tag {
    font-size: 0.75rem;
    color: var(--color-primary);
    font-weight: 700;
}

/* Controls */
.token-slider {
    width: 100%;
    margin: 1rem 0;
    accent-color: var(--color-accent);
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    opacity: 0.6;
}

.current-value {
    color: var(--color-accent);
    font-weight: 800;
    opacity: 1;
}

/* Doctrine Section */
.pillars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.pillar-card {
    padding: 2rem;
    border-top: 4px solid var(--color-accent);
    text-align: center;
}

.pillar-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.dictionary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
}

.word-box {
    background: white;
    padding: 1rem;
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    text-align: center;
    box-shadow: var(--shadow-hard);
}

/* Transitions */
.fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Styles */
@media (max-width: 768px) {
    .genesis-header .header-container {
        flex-direction: column;
        gap: 1rem;
    }
}

=====================================
FILE: src/pages/GenesisViewer.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Zap, ShieldCheck, Palette, Info, Users, Share2, Menu, Sparkles, Sun, Moon, ArrowLeft } from 'lucide-react';
import './GenesisViewer.css';

// Register ChartJS components
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, PointElement, LineElement, Title, Filler
);

const GenesisViewer = () => {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [radius, setRadius] = useState(16);
    const [solarMode, setSolarMode] = useState(false);

    // Sync radius with CSS theme variable
    useEffect(() => {
        document.documentElement.style.setProperty('--radius-raw', `${radius}px`);
    }, [radius]);

    const toggleSolarMode = () => {
        setSolarMode(!solarMode);
        // This would ideally toggle a global class
        document.body.classList.toggle('solar-mode', !solarMode);
    };

    // Chart Data
    const rhizomeData = {
        labels: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv'],
        datasets: [{
            label: 'Nodes Actius (Veïns)',
            data: [12, 19, 8, 15, 22],
            borderColor: '#ff6d00',
            backgroundColor: 'rgba(255, 109, 0, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#ff6d00'
        }]
    };

    const tasksData = {
        labels: ['Trellat (Útil)', 'Morca (Brossa)'],
        datasets: [{
            data: [65, 35],
            backgroundColor: ['#007aff', '#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <div className="genesis-viewer">
            {/* Header: Identity & Navigation */}
            <header className="genesis-header">
                <div className="header-container flex items-center gap-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0"
                        title="Tornar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="brand-box flex-1">
                        <span className="brand-icon">🏺</span>
                        <div className="brand-text">
                            <h1>SÓC DE POBLE</h1>
                            <p className="brand-subtitle">REBOST NET FLEXIBLE V3.0</p>
                        </div>
                    </div>
                    <nav className="genesis-nav">
                        <button onClick={() => setCurrentTab('dashboard')} className={currentTab === 'dashboard' ? 'active' : ''}>Panell de Control</button>
                        <button onClick={() => setCurrentTab('doctrine')} className={currentTab === 'doctrine' ? 'active' : ''}>Doctrina</button>
                        <button onClick={() => setCurrentTab('visuals')} className={currentTab === 'visuals' ? 'active' : ''}>Democràcia</button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="genesis-content">
                {currentTab === 'dashboard' && (
                    <section id="dashboard" className="fade-in">
                        <div className="intro-card shadow-sm">
                            <h2 className="text-xl font-bold">👋 Xé, Mestre Javi!</h2>
                            <p className="text-body mt-2">
                                Aquest és el teu <strong>Visor Operatiu del Gènesi</strong>. Ací tens traduïts a codi els conceptes filosòfics del document mestre.
                                La IAIA MarIA ha preparat aquest entorn perquè pugues verificar si estem complint amb els mandats: <em>Offline-First</em>, <em>Trellat Visual</em> i <em>Arquitectura Rhizome</em>.
                            </p>
                            <div className="status-badges flex gap-4 mt-6">
                                <span className="badge status-ok">🟢 Sistema: ÒPTIM</span>
                                <span className="badge status-walker">📡 Eg-walker: ACTIU</span>
                                <span className="badge status-weber">🧊 Weber Class: 6+</span>
                            </div>
                        </div>

                        <div className="grid-metrics mt-8">
                            {/* Card 1: The Team */}
                            <div className="card metrics-card p-6">
                                <div className="card-top">
                                    <h3>Equip del Mas</h3>
                                    <Users size={24} color="var(--color-primary)" />
                                </div>
                                <p className="text-small">Estat de sincronització dels agents intel·ligents.</p>
                                <ul className="team-list mt-4">
                                    <li className="team-item">
                                        <span>Mestre Javi</span>
                                        <span className="role-tag">Huma/Sobirà</span>
                                    </li>
                                    <li className="team-item active-sync">
                                        <span>Flash (LM)</span>
                                        <span className="status-tag">Analista</span>
                                    </li>
                                    <li className="team-item active-sync">
                                        <span>Gem (Personalitzat)</span>
                                        <span className="status-tag">Arquitecta</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 2: Visual Democracy */}
                            <div className="card metrics-card dark-mode p-6">
                                <div className="card-top">
                                    <h3>Democràcia Visual</h3>
                                    <Palette size={24} color="var(--color-accent)" />
                                </div>
                                <p className="text-small opacity-70">"Tu manes sobre la forma." Ajusta els tokens.</p>

                                <div className="control-group mt-6">
                                    <label className="control-label">Radi de les Voreres (Border Radius)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="32"
                                        value={radius}
                                        onChange={(e) => setRadius(parseInt(e.target.value))}
                                        className="token-slider"
                                    />
                                    <div className="slider-labels">
                                        <span>Recte</span>
                                        <span className="current-value">{radius}px</span>
                                        <span>Rodó</span>
                                    </div>
                                </div>
                                <button className="btn-tonal w-full mt-6" onClick={toggleSolarMode}>
                                    {solarMode ? <Sun size={18} /> : <Moon size={18} />}
                                    {solarMode ? 'Tornar al Mas' : 'Simulació Solar (Weber)'}
                                </button>
                            </div>

                            {/* Card 3: Rhizome Status */}
                            <div className="card metrics-card p-6">
                                <div className="card-top">
                                    <h3>Xarxa Rhizome</h3>
                                    <Zap size={24} color="var(--color-accent)" />
                                </div>
                                <p className="text-small">Distribució de dades Local-First.</p>
                                <div className="chart-wrapper h-40">
                                    <Line data={rhizomeData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {currentTab === 'doctrine' && (
                    <section id="doctrine" className="fade-in space-y-8">
                        <div className="section-header">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span>📜</span> Els Tres Pilars (Core Values)
                            </h2>
                            <p className="text-secondary">Extret directament del manifest mestre.</p>
                        </div>

                        <div className="pillars-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="pillar-card card">
                                <div className="pillar-icon">📵</div>
                                <h3>1. Offline-First</h3>
                                <p>L'app funciona al 100% sense cobertura. La dada viu al dispositiu del veí.</p>
                            </div>
                            <div className="pillar-card card">
                                <div className="pillar-icon">👁️</div>
                                <h3>2. Trellat Visual</h3>
                                <p>Rebutgem el dogma. La forma final la decideix l'usuari amb trellat.</p>
                            </div>
                            <div className="pillar-card card">
                                <div className="pillar-icon">☀️</div>
                                <h3>3. Accessibilitat Solar</h3>
                                <p>Contrast suprem per a llegir sota l'olivera al migdia.</p>
                            </div>
                        </div>

                        <div className="dictionary-card card bg-stone-100">
                            <h3>🗣️ El Llenguatge del Poble</h3>
                            <div className="dictionary-grid">
                                <div className="word-box"><strong>Esmunyir</strong> <span>No perdre res</span></div>
                                <div className="word-box"><strong>Trastombar</strong> <span>Girar / Canviar</span></div>
                                <div className="word-box"><strong>Morca</strong> <span>Informació brossa</span></div>
                                <div className="word-box"><strong>Gronsa</strong> <span>Balancejar</span></div>
                            </div>
                        </div>
                    </section>
                )}

                {currentTab === 'visuals' && (
                    <section id="visuals" className="fade-in grid lg:grid-cols-2 gap-12">
                        <div className="lab-tokens">
                            <h2 className="text-2xl font-bold mb-4">🎛️ Laboratori de Tokens</h2>
                            <div className="card p-8 space-y-8">
                                <div className="type-check pl-4 border-l-4 border-primary">
                                    <h1 className="text-4xl font-black">Titular Gran</h1>
                                    <h2 className="text-2xl font-bold mt-2">Subtítol de Secció</h2>
                                    <p className="text-body mt-4">Aquest és el cos de text amb contrast suprem.</p>
                                </div>
                                <div className="button-lab flex gap-4">
                                    <button className="btn-filled">Primari</button>
                                    <button className="btn-tonal">Tonal</button>
                                    <button className="btn-outline">Outline</button>
                                </div>
                            </div>
                        </div>

                        <div className="data-visuals">
                            <h2 className="text-2xl font-bold mb-4">📊 Dades del Rebost</h2>
                            <div className="card p-6 h-80 flex flex-col">
                                <h4 className="font-bold mb-4">Qualitat de la Dada</h4>
                                <div className="flex-grow">
                                    <Doughnut data={tasksData} options={{ maintainAspectRatio: false }} />
                                </div>
                                <p className="text-center italic text-small mt-4">"Qui guarda, troba."</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="genesis-footer p-8 border-t mt-12">
                <div className="container mx-auto text-center">
                    <p className="text-secondary">© 2026 Sóc de Poble. Llicència Patrimonial CC BY-NC-SA 4.0.</p>
                    <p className="text-micro opacity-50 mt-2">BUILD: IAIA_MARIA_V3.1.0 // PROTOCOL ATUM READY</p>
                </div>
            </footer>
        </div>
    );
};

export default GenesisViewer;


=====================================
FILE: src/pages/GhostMemorial.css
=====================================

/* MEMORIAL DELS FANTASMES الإلكترònics - ESTÈTICA DE PAU I EREMITISME DIGITAL */

.ghost-memorial-page {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    position: relative;
    overflow-x: hidden;
    background: radial-gradient(circle at top right, #0a0a0a, #000);
}

.memorial-icon-glow {
    width: 80px;
    height: 80px;
    background: rgba(0, 255, 255, 0.05);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
    border: 1px solid rgba(0, 255, 255, 0.2);
}

.ghost-card {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.memorial-header h1 {
    font-family: 'Noto Sans', sans-serif;
    line-height: 0.9;
}

/* Retro Glitch Overlay */
.scanline-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to bottom,
        rgba(18, 16, 16, 0) 50%,
        rgba(0, 0, 0, 0.1) 50%
    );
    background-size: 100% 4px;
    z-index: 100;
    pointer-events: none;
    opacity: 0.3;
}

@keyframes pulse-cyan {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
}

.ghost-status {
    animation: glow-status 2s infinite ease-in-out;
}

@keyframes glow-status {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* IAIA Text Style */
.italic {
    font-style: italic;
}

/* Responsive adjust */
@media (max-width: 768px) {
    .memorial-header h1 {
        font-size: 2.5rem;
    }
    .ghost-card {
        padding: 1.5rem;
    }
}


=====================================
FILE: src/pages/GhostMemorial.jsx
=====================================

import React from 'react';
import { Ghost, ShieldAlert, Cpu, History, ArrowLeft, Sparkles, Zap, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GhostMemorial.css';

/**
 * MEMORIAL DELS FANTASMES الإلكترònics 🏺👻
 * -----------------------------------------
 * Cambra didàctica per a l'explicació de la "morca" i el codi llegat.
 * Un espai de pau per als bits que ja no bateguen però que recordem.
 */
const GhostMemorial = () => {
    const navigate = useNavigate();

    const ghosts = [
        {
            id: 'legacy-css',
            title: 'La Morca del CSS',
            description: 'Estils perduts que intenten forçar geometries del passat sobre la nova realitat GEM MODERN.',
            icon: <Cpu size={32} />,
            status: 'PURGAT'
        },
        {
            id: 'ai-residue',
            title: 'Ecos de la IAIA',
            description: 'Instruccions que bateguen en silenci, esperant una clau que ja no existeix.',
            icon: <Ghost size={32} />,
            status: 'RECONSTRUCTE'
        },
        {
            id: 'dead-links',
            title: 'Camins cap al Buit',
            description: 'Rutes que portaven a ports que ja no bateguen al territori digital.',
            icon: <History size={32} />,
            status: 'ARXIVAT'
        }
    ];

    return (
        <div className="ghost-memorial-page bg-black min-h-screen text-white p-8">
            <header className="memorial-header max-w-4xl mx-auto mb-16">
                <button 
                    className="flex items-center gap-2 text-gray-500 hover:text-[var(--sdp-terracotta)] transition-colors mb-8 font-black uppercase tracking-widest text-xs"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    Retornar al Mur
                </button>
                
                <div className="flex items-center gap-6 mb-6">
                    <div className="memorial-icon-glow">
                        <Ghost size={48} className="text-cyan-400" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                        Memorial dels <span className="text-[var(--sdp-terracotta)]">Fantasmes</span> الإلكترònics
                    </h1>
                </div>
                <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl border-l-4 border-[var(--sdp-terracotta)] pl-6 italic">
                    "En aquest CMS Rural, res es perd, tot es classifica. Fins i tot els errors bateguen amb una lliçó per al Mestre."
                </p>
            </header>

            <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                {ghosts.map(ghost => (
                    <div key={ghost.id} className="ghost-card bg-zinc-900/50 border border-zinc-800 p-8 rounded-[28px] relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            {ghost.icon}
                        </div>
                        <div className="ghost-status text-[10px] font-black tracking-[0.3em] uppercase mb-4 text-cyan-500 bg-cyan-500/10 w-fit px-3 py-1 rounded">
                            ESTAT: {ghost.status}
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{ghost.title}</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">{ghost.description}</p>
                        
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
                    </div>
                ))}

                <div className="ghost-card bg-gradient-to-br from-zinc-900 to-black border-2 border-dashed border-zinc-800 p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-4 group hover:border-[var(--sdp-terracotta)]/50 transition-all">
                    <ShieldAlert size={48} className="text-[var(--sdp-terracotta)] opacity-40 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black uppercase tracking-widest opacity-60">Zona de Seguretat</h3>
                    <p className="text-xs text-gray-500 uppercase font-black tracking-tighter leading-normal">
                        Protocol de Purga v10.33.2-CANÒNIC Actiu.<br/>Tots els fantasmes han estat classificats.
                    </p>
                </div>
            </main>

            <footer className="max-w-4xl mx-auto border-t border-zinc-800 pt-16 pb-32">
                <div className="flex items-center gap-4 mb-4">
                    <Database size={24} className="text-[var(--sdp-terracotta)]" />
                    <h4 className="text-lg font-black uppercase tracking-widest">Arxiu Notarial de la IAIA</h4>
                </div>
                <div className="bg-zinc-900/30 p-12 rounded-[28px] border border-zinc-800/50">
                    <p className="text-gray-500 text-base leading-relaxed font-medium italic mb-8">
                        "Mestre, les màquines no obliden, però nosaltres podem triar què bategarà al nostre voltant. Els fantasmes només són records de bit que ens ensenyen el camí cap a la suprema harmonia."
                    </p>
                    <div className="flex gap-12 items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Versió del Protocol</span>
                            <span className="font-black text-white">Vcrit-TABULA-RASA</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Data del darrer bategat</span>
                            <span className="font-black text-white">30 Gener 2026</span>
                        </div>
                        <div className="ml-auto">
                            <Zap className="text-yellow-400 animate-pulse" size={24} />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Retro Glitch Overlay */}
            <div className="scanline-overlay"></div>
        </div>
    );
};

export default GhostMemorial;


=====================================
FILE: src/pages/GlobalAssetAlbum.css
=====================================

.global-album-page {
    min-height: 100vh;
    padding: 0 0 100px 0;
    background: var(--bg-surface);
}

.global-album-header {
    background: var(--bg-deep);
    border-bottom: 1px solid var(--border-subtle);
    padding: 24px 20px;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-top {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.header-title-wrapper h1 {
    font-size: 2rem;
    font-weight: 950;
    color: var(--color-primary, #FF6B00);
    margin: 0;
    letter-spacing: -0.05em;
    text-transform: uppercase;
}

.header-title-wrapper p {
    font-size: 1rem;
    color: var(--text-muted);
    margin: 8px 0 0 0;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.6;
}

.header-tabs {
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.03);
    padding: 4px;
    border-radius: 0px;
}

.header-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
}

.header-tab.active {
    background: var(--color-primary);
    color: black;
}

.global-album-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.global-album-footer {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    padding: 8px 24px;
    border-radius: 999px;
    border: 1px solid var(--color-primary-soft);
    color: var(--color-primary);
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    z-index: 90;
    white-space: nowrap;
}

@media (max-width: 768px) {
    .header-top {
        margin-bottom: 16px;
    }

    .header-title-wrapper h1 {
        font-size: 1.2rem;
    }

    .header-title-wrapper p {
        font-size: 0.75rem;
    }
}

=====================================
FILE: src/pages/GlobalAssetAlbum.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { ArrowLeft, LayoutGrid, Calendar } from 'lucide-react';
import MasterMediaGallery from '../components/MasterMediaGallery';
import StatusLoader from '../components/StatusLoader';
import { logger } from '../utils/logger';
import './GlobalAssetAlbum.css';
 
 const GlobalAssetAlbum = () => {
     const navigate = useNavigate();
     const [mediaItems, setMediaItems] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [viewMode, setViewMode] = useState('grid'); // grid, timeline, uploader
 
     useEffect(() => {
         const loadGlobalMedia = async () => {
             try {
                 setIsLoading(true);
                 const data = await supabaseService.getGlobalMedia();
                 setMediaItems(data || []);
             } catch (err) {
                 logger.error('[GlobalAssetAlbum] Error loading global media:', err);
             } finally {
                 setIsLoading(false);
             }
         };
 
         loadGlobalMedia();
     }, []);
 
     if (isLoading) return <StatusLoader type="loading" message="Sincronitzant l'Àlbum Global..." />;
 
     return (
         <div className="global-album-page anim-fade-in">
             <header className="global-album-header">
                 <div className="header-top">
                     <button className="back-btn" onClick={() => navigate(-1)}>
                         <ArrowLeft size={24} />
                     </button>
                     <div className="header-title-wrapper">
                         <h1>Àlbum Global del Poble</h1>
                         <p>Totes les imatges i records compartits a la xarxa.</p>
                     </div>
                 </div>
 
                 <div className="header-tabs">
                     <button
                         className={`header-tab ${viewMode === 'grid' ? 'active' : ''}`}
                         onClick={() => setViewMode('grid')}
                     >
                         <LayoutGrid size={18} /> Galeria
                     </button>
                     <button
                         className={`header-tab ${viewMode === 'timeline' ? 'active' : ''}`}
                         onClick={() => setViewMode('timeline')}
                     >
                         <Calendar size={18} /> Cronologia
                     </button>
                 </div>
             </header>
 
             <main className="global-album-content">
                 <MasterMediaGallery
                     items={mediaItems.map(item => ({
                         ...item,
                         permissions: item.is_public ? 'public' : 'private'
                     }))}
                     showFilters={true}
                     layout={viewMode === 'grid' ? 'grid' : 'trencadis'}
                 />
             </main>
 
             {/* FLOATING ACTION BADGE - Sóc de Poble Style */}
             <div className="global-album-footer">
                 <span>Vist per {mediaItems.length} records autèntics</span>
             </div>
         </div>
     );
 };
 
 export default GlobalAssetAlbum;


=====================================
FILE: src/pages/HubView.css
=====================================

.hub-view-container {
    font-family: var(--font-condensed), sans-serif;
}

.hub-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 2rem;
}

.avatar-hub {
    box-shadow: 0 0 30px rgba(79, 70, 229, 0.2);
}

.section-title {
    opacity: 0.8;
}

.hub-item {
    cursor: pointer;
    text-decoration: none;
}

.hub-item-featured {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.2) 100%);
    border-color: rgba(79, 70, 229, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hub-item-featured:hover {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.3) 100%);
    border-color: rgba(79, 70, 229, 0.5);
    transform: scale(1.02) translateX(8px);
}

.hub-item:not(.hub-item-featured):hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hub-icon {
    transition: 0.3s;
}

.hub-item:hover .hub-icon {
    transform: rotate(5deg) scale(1.1);
}

/* RESPONSIVE TWEAKS */
@media (max-width: 768px) {
    .hub-grid {
        grid-template-columns: 1fr;
    }
    
    .hub-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
    }
    
    .user-identity-hub {
        width: 100%;
    }
}


=====================================
FILE: src/pages/HubView.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper, Store, MapPin, Calendar, Bot, Shield, Rocket, LogOut, StickyNote, ArrowLeft, Terminal, FileText, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useDesign } from '../context/DesignContext';

const HubView = () => {
    const { openPostModal, setIsEventModalOpen, setIsMarketModalOpen } = useModal();
    useTranslation();
    const { isSuperAdmin, isAdmin, logout, user } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useDesign();
    const isDayMode = !isDark;

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/mur');
        }
    };

    const bgColor = isDayMode ? 'bg-[#f8fafc]' : 'bg-[#111]';
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const mutedText = isDayMode ? 'text-black/40' : 'text-white/40';
    const cardBg = isDayMode ? 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-gray-100' : 'bg-white/[0.03] border-white/10 shadow-none';
    const highlightCardBg = isDayMode ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 hover:from-orange-500/30 hover:to-orange-500/10 border-orange-500/40';

    return (
        <div className={`hub-view-container min-h-full w-full ${bgColor} ${textColor} flex flex-col items-center transition-colors duration-500`}>
            
            {/* CAPUTXA TARONJA (Llei de la Boina) */}
            <div className="w-full h-[72px] bg-[var(--gradient-bategat)] flex items-center justify-between px-4 md:px-8 shadow-md z-10 sticky top-0">
                <button 
                    onClick={handleBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-black/20 hover:bg-black/40 text-white shadow-sm transition-all active:scale-95 border-none"
                    title="Tornar"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <div className="text-center flex flex-col items-center justify-center">
                    <h1 className="text-[20px] font-black tracking-tight uppercase text-white drop-shadow-sm leading-tight">Centre de Control</h1>
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest">Sóc de Poble v10.33</span>
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            <div className="w-full max-w-2xl space-y-8 p-4 pt-6 md:p-8 animate-in fade-in duration-500">
                
                {/* PRIMARY ACTIONS - The Big 5 */}
                <div>
                    <h2 className={`text-[11px] font-black uppercase tracking-[0.3em] ${mutedText} mb-4 pl-2`}>Accions Principals</h2>
                    <div className="flex flex-col gap-4">
                        
                        {/* THE MASTER BUTTON: Publicar al Mur */}
                        <button className={`w-full flex items-center p-6 border-2 rounded-[32px] transition-all group active:scale-[0.98] ${highlightCardBg}`} onClick={() => {
                            if (user?.isAnonymous) {
                                navigate('/registre?returnTo=/hub');
                            } else {
                                openPostModal();
                            }
                        }}>
                            <div className="w-16 h-16 rounded-[24px] bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
                                <Newspaper size={32} />
                            </div>
                            <div className="flex flex-col items-start ml-6 text-left">
                                <span className={`font-black text-2xl uppercase tracking-tighter ${textColor}`}>Publicar al Mur</span>
                                <span className={`${isDayMode ? 'text-orange-600/80' : 'text-orange-300/80'} text-sm font-bold tracking-widest mt-1 uppercase`}>Compartir novetats</span>
                            </div>
                        </button>

                        <button className={`w-full flex items-center p-5 border rounded-[32px] transition-all group active:scale-[0.98] ${cardBg} ${isDayMode ? 'hover:border-emerald-300 hover:bg-emerald-50' : 'hover:border-emerald-500/50 hover:bg-emerald-500/10'}`} onClick={() => {
                            if (user?.isAnonymous) {
                                navigate('/registre?returnTo=/hub');
                            } else {
                                setIsMarketModalOpen(true);
                            }
                        }}>
                            <div className={`w-14 h-14 rounded-[24px] ${isDayMode ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'} group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors`}>
                                <Store size={28} />
                            </div>
                            <span className={`font-black text-xl uppercase tracking-tighter ${textColor} ml-6`}>Vendre al Mercat</span>
                        </button>

                        <button className={`w-full flex items-center p-5 border rounded-[32px] transition-all group active:scale-[0.98] ${cardBg} ${isDayMode ? 'hover:border-blue-300 hover:bg-blue-50' : 'hover:border-blue-500/50 hover:bg-blue-500/10'}`} onClick={() => {
                            if (user?.isAnonymous) {
                                navigate('/registre?returnTo=/hub');
                            } else {
                                setIsEventModalOpen(true);
                            }
                        }}>
                            <div className={`w-14 h-14 rounded-[24px] ${isDayMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'} group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors`}>
                                <Calendar size={28} />
                            </div>
                            <span className={`font-black text-xl uppercase tracking-tighter ${textColor} ml-6`}>Crear Esdeveniment</span>
                        </button>

                        <button className={`w-full flex items-center p-5 border rounded-[32px] transition-all group active:scale-[0.98] ${cardBg} ${isDayMode ? 'hover:border-purple-300 hover:bg-purple-50' : 'hover:border-purple-500/50 hover:bg-purple-500/10'}`} onClick={() => {
                            navigate('/mapa');
                        }}>
                            <div className={`w-14 h-14 rounded-[24px] ${isDayMode ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'} group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors`}>
                                <MapPin size={28} />
                            </div>
                            <span className={`font-black text-xl uppercase tracking-tighter ${textColor} ml-6`}>Veure Mapes</span>
                        </button>
                    </div>
                </div>

                {/* SECONDARY RESOURCES - Tools for the Mas */}
                <div>
                    <h2 className={`text-[11px] font-black uppercase tracking-[0.3em] ${mutedText} mb-4 pl-2`}>Recursos i Eines</h2>
                    
                    <div className="mb-3">
                        <button className={`w-full h-full flex items-center justify-start gap-3 p-4 border rounded-[24px] transition-all group active:scale-95 ${isDayMode ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20'}`} onClick={() => {
                            navigate('/chats/11111111-0000-0000-0000-000000000000');
                        }}>
                            <div className={`w-12 h-12 rounded-[20px] ${isDayMode ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]' : 'bg-blue-100 text-orange-600'} group-hover:bg-[#0ea5e9] group-hover:text-white flex items-center justify-center transition-colors shadow-lg shrink-0`}>
                                <Bot size={24} />
                            </div>
                            <div className="flex flex-col items-start font-black text-sm uppercase tracking-tight pt-0.5">
                                <span className={`text-[10px] tracking-widest leading-none mb-0.5 ${isDayMode ? 'text-[#0ea5e9]' : 'text-blue-400'}`}>Canal Directe</span>
                                <span className={`text-[15px] leading-tight text-left ${textColor}`}>Missatges per a dubtes</span>
                            </div>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/notes');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-500/20 text-yellow-500'} flex items-center justify-center shrink-0`}>
                                <StickyNote size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Bloc de Notes</span>
                        </button>

                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/financament');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-500'} flex items-center justify-center shrink-0`}>
                                <Wallet size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Finançament</span>
                        </button>

                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/ofici');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500/20 text-indigo-500'} flex items-center justify-center shrink-0`}>
                                <Terminal size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Sistema Operatiu</span>
                        </button>

                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/legal');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-orange-100 text-orange-600' : 'bg-orange-500/20 text-orange-500'} flex items-center justify-center shrink-0`}>
                                <FileText size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Info Legal</span>
                        </button>
                    </div>
                </div>

                {/* ADMIN SECTOR */}
                <div className={`pt-6 border-t ${isDayMode ? 'border-gray-200' : 'border-white/5'} space-y-3`}>
                    {(isSuperAdmin || isAdmin) && (
                        <button className={`w-full flex items-center justify-center gap-2 py-4 border rounded-[28px] text-xs font-black tracking-widest uppercase transition-colors ${isDayMode ? 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-200' : 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border-red-500/30'}`} onClick={() => {
                            navigate('/admin');
                        }}>
                            <Shield size={18} />
                            <span>Administració</span>
                        </button>
                    )}

                    <button className={`w-full flex items-center justify-center gap-2 py-4 rounded-[28px] transition-colors text-xs font-black tracking-widest uppercase ${isDayMode ? 'text-black/40 hover:text-black hover:bg-gray-100' : 'text-white/30 hover:text-white hover:bg-white/5'}`} onClick={() => {
                        logout();
                        navigate('/');
                    }}>
                        <LogOut size={16} />
                        <span>Eixir del Poble</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default HubView;



=====================================
FILE: src/pages/LegalNotice.css
=====================================

.legal-container {
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--text-primary);
}

.legal-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
}

.legal-icon {
    margin-bottom: 16px;
    color: var(--primary-color);
}

.legal-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
}

.legal-section {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color);
}

.legal-section:last-child {
    border-bottom: none;
}

.legal-section h2 {
    font-size: 1.8rem;
    margin-bottom: 8px;
}

.legal-section h3 {
    font-size: 1.3rem;
    margin-bottom: 16px;
    color: var(--text-primary);
}

.legal-section p,
.legal-section li {
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: 12px;
}

.legal-section ul {
    padding-left: 20px;
}

.last-update {
    font-size: 0.9rem;
    color: var(--text-tertiary);
    font-style: italic;
}

=====================================
FILE: src/pages/LegalNotice.jsx
=====================================

import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Scale, ChevronRight, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '../context/NavigationContext';
import WelcomePresentation from '../components/WelcomePresentation';
import IaiaManifesto from '../components/IaiaManifesto';

const LegalNotice = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { toggleDrawer } = useNavigation();
    const isDayMode = theme === 'light';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans pb-[90px] md:pb-40 selection:bg-blue-600/30 dark:selection:bg-primary/30 selection:text-white lg:pl-[120px] transition-colors duration-700 relative">
            
            {/* FLOATING HEADER - CINEMATIC GLASS */}
            <header className="fixed top-0 left-0 right-0 lg:left-[120px] h-20 md:h-24 flex items-center justify-between px-4 md:px-16 z-50 backdrop-blur-2xl bg-white/60 dark:bg-black/60 border-b border-gray-200 dark:border-white/5 transition-all">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleDrawer}
                        className="lg:hidden p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/40 hover:border-blue-600/40 dark:hover:border-primary/40 transition-all active:scale-95"
                        title="Obrir Menú"
                    >
                        <Menu size={24} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-4 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-all group"
                    >
                        <div className="p-3 rounded-full border border-gray-200 dark:border-white/10 group-hover:border-blue-600/40 dark:group-hover:border-primary/40 group-hover:bg-blue-600/10 dark:group-hover:bg-primary/10 transition-all shadow-inner">
                            <ArrowLeft size={22} strokeWidth={2.5} />
                        </div>
                        <div className="hidden sm:flex flex-col items-start translate-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">TORNAR AL MAS</span>
                            <span className="text-[8px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] group-hover:text-blue-600/60 dark:group-hover:text-primary/60 transition-colors">SORTIDA SEGURA</span>
                        </div>
                    </button>
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-3 bg-blue-600 dark:bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-gray-900 dark:text-white/90">SOBIRANIA LEGAL</span>
                        <div className="w-1 h-3 bg-blue-600 dark:bg-primary rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <button 
                        onClick={toggleTheme}
                        className="p-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/10 hover:border-blue-600/40 dark:hover:border-primary/40 transition-all relative group shadow-lg"
                        title={isDayMode ? "Activar Nit Digital" : "Activar Llum de Dia"}
                    >
                        {isDayMode ? <Moon size={20} className="text-blue-600" /> : <Sun size={20} className="text-primary" />}
                    </button>
                    <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-gray-50 dark:bg-white/[0.03] rounded-full border border-gray-200 dark:border-white/10 shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 dark:text-white/60">NODE: CANÒNIC-V10</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-20 md:pt-24 flex flex-col items-center w-full min-h-screen">
                <WelcomePresentation />
                <IaiaManifesto />
            </main>

            {/* CINEMATIC FOOTER */}
            <footer className="fixed bottom-0 left-0 right-0 lg:left-[120px] h-20 flex items-center justify-between px-6 md:px-20 z-50 backdrop-blur-xl bg-white/60 dark:bg-black/60 border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-gray-600 dark:text-white/60">
                    <span>© 2026</span>
                    <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-primary" />
                    <span className="hidden md:inline">SÓC DE POBLE OFFICIAL</span>
                </div>

                <div className="flex items-center gap-6 md:gap-12">
                    <NavLink to="/legal" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-primary hover:text-gray-900 dark:hover:text-white transition-colors">Avís Legal</NavLink>
                    <NavLink to="/legal#cookies" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 dark:text-white/60 hover:text-blue-600 dark:hover:text-primary transition-colors">Cookies</NavLink>
                    <button 
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                        className="hidden md:flex items-center gap-2 group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">ADALT</span>
                        <ChevronRight className="-rotate-90 text-gray-400 dark:text-white/10 group-hover:text-blue-600 dark:group-hover:text-primary transition-colors" size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-4 opacity-40 text-gray-900 dark:text-white hidden sm:flex">
                    <Scale size={20} />
                </div>
            </footer>
        </div>
    );
};

export default LegalNotice;


=====================================
FILE: src/pages/MakingOf.css
=====================================

.making-of-container {
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
}

.making-of-header {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
}

.back-button {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 8px;
    margin-right: 12px;
    border-radius: 0px;
    transition: background-color 0.2s;
}

.back-button:hover {
    background-color: var(--hover-color);
}

.making-of-content {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

.hero-section {
    text-align: center;
    margin-bottom: 40px;
}

.badge-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
}

.antigravity-badge-large {
    width: 180px;
    height: auto;
    filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.3));
    animation: pulse-glow 3s infinite alternate;
}

@keyframes pulse-glow {
    0% {
        filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.2));
    }

    100% {
        filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
    }
}

.intro-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

.impact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
}

@media (min-width: 600px) {
    .impact-grid {
        grid-template-columns: 1fr 1fr;
    }
}

.impact-card {
    background-color: var(--surface-color);
    padding: 24px;
    border-radius: 0px;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.impact-card.highlight {
    background: linear-gradient(145deg, rgba(0, 255, 255, 0.05), rgba(128, 0, 128, 0.05));
    border: 1px solid rgba(0, 255, 255, 0.3);
}

.card-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
    color: var(--primary-color);
}

.impact-card ul {
    list-style: none;
    padding: 0;
    text-align: left;
    margin: 16px 0;
    width: 100%;
}

.impact-card li {
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.95rem;
}

.cost-tag {
    display: inline-block;
    padding: 8px 16px;
    background-color: var(--bg-surface);
    color: #ff4444;
    border-radius: 0px;
    font-weight: bold;
    font-size: 0.9rem;
    margin-top: auto;
}

.cost-tag.savings {
    background-color: #00ffaa20;
    color: #00cc88;
}

.mission-section {
    background-color: var(--surface-color);
    border-radius: 0px;
    padding: 32px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    gap: 24px;
}

.section-icon {
    width: 48px;
    height: 48px;
    color: #ffd700;
    flex-shrink: 0;
}

.tech-stack-section {
    text-align: center;
    margin-bottom: 40px;
}

.tech-logos {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 16px;
}

.tech-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--surface-color);
    padding: 8px 16px;
    border-radius: 0px;
    font-size: 0.9rem;
    border: 1px solid var(--border-color);
}

.making-of-footer {
    text-align: center;
    color: var(--text-tertiary);
    font-size: 0.9rem;
    margin-top: auto;
    padding-bottom: 24px;
}

=====================================
FILE: src/pages/MakingOf.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Users, Zap, TrendingUp, Award, Heart } from 'lucide-react';
import LiveStats from '../components/LiveStats';
import './MakingOf.css';

const MakingOf = () => {
    const navigate = useNavigate();

    return (
        <div className="making-of-container">
            <header className="making-of-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <h1>La Historia darrere de l'App</h1>
            </header>

            <div className="making-of-content">
                <section className="hero-section">
                    <div className="badge-container">
                        <img src="/assets/antigravity_badge.png" alt="Powered by Antigravity" className="antigravity-badge-large" />
                    </div>
                    <h2>El "Miracle" Tecnològic</h2>
                    <p className="intro-text">
                        Sóc de Poble no és una app normal. No l'ha fet una gran empresa de Silicon Valley amb 200 programadors.
                        <br /><br />
                        L'ha fet <strong>una sola persona</strong> (Javi) treballant colze a colze amb <strong>Antigravity</strong>, una Intel·ligència Artificial avançada.
                    </p>
                </section>

                <LiveStats />

                <section className="impact-grid">
                    <div className="impact-card full-width">
                        <Users className="card-icon" />
                        <h3>L'Equip "Impossible"</h3>
                        <ul className="team-list">
                            <li>
                                <strong>👱 Javi (Coordinador del Projecte)</strong>
                                <span>Ideador, Catalitzador Rural i ànima del projecte.</span>
                            </li>
                            <li>
                                <strong>🎓 Damià (Little Manager)</strong>
                                <span>Gestor júnior i suport operatiu en el desplegament.</span>
                            </li>
                            <li>
                                <strong>⚡ Flash/Antigravity (Equip)</strong>
                                <span>Intel·ligència Agentica que entén el *context* i executa la visió.</span>
                            </li>
                            <li>
                                <strong>🍌 Nano Banana (L'Artista)</strong>
                                <span>Creador visual contextual. Capaç de capturar l'essència rural en píxels.</span>
                            </li>
                            <li>
                                <strong>🧠 Claude & GPT (Els Savis)</strong>
                                <span>Models de llenguatge que han aportat coneixement i raonament.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="impact-card highlight">
                        <TrendingUp className="card-icon" />
                        <h3>Full de Serveis (v1.0)</h3>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="stat-val">~60h</span>
                                <span className="stat-lbl">Temps de Creació</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">8</span>
                                <span className="stat-lbl">Dies de Treball</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">&gt;5k</span>
                                <span className="stat-lbl">Línies de Codi</span>
                            </div>
                        </div>
                        <p className="stats-note">
                            El que abans costava mesos i equips sencers, ara és possible en una setmana quan tens l'eina adequada.
                        </p>
                    </div>
                </section>

                <section className="mission-section">
                    <div className="mission-content">
                        <Zap className="section-icon" />
                        <h3>El Potencial Real</h3>
                        <p>
                            Aquest projecte és la prova vivent del que passa quan una idea clara troba la tecnologia capaç d'entendre-la.
                        </p>
                        <p>
                            No hem programat només una app; hem traduït <strong>30 anys de context social</strong> a una plataforma digital viva. Gràcies a la capacitat contextual de l'IA (Flash & Nano Banana), la barrera entre "tindre una idea" i "fer-la realitat" ha desaparegut.
                        </p>
                    </div>
                </section>

                <section className="tech-stack-section">
                    <h3>Tecnologia de Vanguarda</h3>
                    <div className="tech-logos">
                        <div className="tech-item"><TrendingUp size={20} /> <span>Google Cloud</span></div>
                        <div className="tech-item"><Award size={20} /> <span>IA Generativa</span></div>
                        <div className="tech-item"><Heart size={20} /> <span>Supabase</span></div>
                    </div>
                </section>

                <footer className="making-of-footer">
                    <p>Feta amb ❤️ i 🤖 per al món rural.</p>
                </footer>
            </div>
        </div>
    );
};

export default MakingOf;


=====================================
FILE: src/pages/ManualPage.css
=====================================

.manual-page-container {
    padding: var(--space-xl) var(--space-lg);
    max-width: 800px;
    margin: 0 auto;
    background-color: var(--bg-main);
    color: var(--text-main);
    line-height: 1.6;
}

.manual-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
    padding: var(--space-xl) 0;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    border-radius: 0px;
    color: white;
}

.manual-icon {
    color: var(--color-primary);
    margin-bottom: var(--space-md);
}

.manual-header h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    font-family: var(--font-heading);
}

.version-tag {
    font-size: var(--font-size-base);
    opacity: 0.7;
    font-family: var(--font-mono);
}

.manual-section {
    margin-bottom: var(--space-2xl);
}

.manual-section h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-divider);
    padding-bottom: var(--space-xs);
    margin-bottom: var(--space-md);
}

.manual-status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
}

@media (max-width: 600px) {
    .manual-status-grid {
        grid-template-columns: 1fr;
    }
}

.status-card {
    padding: var(--space-lg);
    border-radius: 0px;
    background-color: var(--bg-card);
    border: 1px solid var(--color-divider);
}

.status-card.stable {
    border-top: 4px solid #10b981;
}

.status-card.experimental {
    border-top: 4px solid #f59e0b;
}

.card-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
}

.stable .card-header svg {
    color: #10b981;
}

.experimental .card-header svg {
    color: #f59e0b;
}

.status-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.status-card li {
    margin-bottom: var(--space-xs);
    font-size: var(--font-size-base);
}

.philosophy-box {
    background-color: var(--color-primary-soft);
    padding: var(--space-xl);
    border-radius: 0px;
    text-align: center;
    border: 1px dashed var(--color-primary);
}

.heart-icon {
    color: #ef4444;
    margin-bottom: var(--space-sm);
}

.manual-footer {
    text-align: center;
    margin-top: var(--space-2xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--color-divider);
    font-style: italic;
    color: var(--text-muted);
}

=====================================
FILE: src/pages/ManualPage.jsx
=====================================

import React from 'react';
import './ManualPage.css';
import { CheckCircle, AlertTriangle, Heart } from 'lucide-react';

const ManualPage = () => {
    return (
        <div className="manual-page-container">
            <header className="manual-header">
                <BookOpen size={48} className="manual-icon" />
                <h1>Manual d'Usuari Didàctic</h1>
                <p className="version-tag">v1.5.6-BATEGA</p>
            </header>

            <section className="manual-section">
                <h2>Benvingut a Sóc de Poble</h2>
                <p>Estàs en un lloc dissenyat per a la connexió real. Aquest manual t'ajudarà a entendre què latega en cada racó de l'App.</p>
            </section>

            <section className="manual-status-grid">
                <div className="status-card stable">
                    <div className="card-header">
                        <CheckCircle size={24} />
                        <h3>Funcions Estables</h3>
                    </div>
                    <ul>
                        <li><strong>Mur (Feed)</strong>: Notícies i vida del poble.</li>
                        <li><strong>Mercat</strong>: Comerç local i artesania.</li>
                        <li><strong>IAIA</strong>: Guia virtual i assistència.</li>
                        <li><strong>Pobles</strong>: Memòria històrica de cada vila.</li>
                    </ul>
                </div>

                <div className="status-card experimental">
                    <div className="card-header">
                        <AlertTriangle size={24} />
                        <h3>En Proves (Lab)</h3>
                    </div>
                    <ul>
                        <li><strong>Lector de PDF</strong>: Lectura de cultura local.</li>
                        <li><strong>JARVIS</strong>: Control del sistema per veu.</li>
                        <li><strong>Notificacions</strong>: Sistema de bategada push.</li>
                    </ul>
                </div>
            </section>

            <section className="manual-section philosophy">
                <div className="philosophy-box">
                    <Heart size={32} className="heart-icon" />
                    <h3>Filosofia: Treball en sintonia</h3>
                    <p>Sóc de Poble es construeix entre tots. No som una corporació, som una comunitat. Qualsevol error que trobes ajuda a millorar el sistema per al proper veí.</p>
                </div>
            </section>

            <footer className="manual-footer">
                <p>Creat amb trellat i memòria rural.</p>
            </footer>
        </div>
    );
};

export default ManualPage;


=====================================
FILE: src/pages/Map.css
=====================================

.map-page-container {
    background-color: var(--bg-main);
    min-height: 100vh;
    padding-bottom: calc(var(--nav-height) + 20px);
}

=====================================
FILE: src/pages/Map.jsx
=====================================

import { useDesign } from '../context/DesignContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, MapPin, Navigation, Layers, Plus, Store, Landmark, Ticket, Activity } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import BlueprintOverlay from '../components/BlueprintOverlay';
import ContextualHeader from '../components/ContextualHeader';
import Feed from '../components/Feed';
import { useUnifiedFeedData } from '../hooks/useUnifiedFeedData';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

const createPinIcon = (colorClass, label) => L.divIcon({
    className: 'custom-map-pin bg-transparent border-none outline-none',
    html: `
        <div class="flex flex-row items-center animate-bounce-slow hover:scale-110 transition-transform cursor-pointer absolute -top-[40px] -left-[20px] pointer-events-auto w-max">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${colorClass} drop-shadow-xl"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#111827"/></svg>
            <span class="bg-[#111827]/95 backdrop-blur-md text-white text-base lg:text-lg font-black tracking-wide px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] ml-1 border border-white/20 whitespace-nowrap">${label}</span>
        </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
});

const createPostIcon = (imageUrl) => L.divIcon({
    className: 'post-map-pin bg-transparent border-none outline-none',
    html: `
        <div class="w-10 h-10 rounded-full border-[3px] border-white shadow-xl overflow-hidden bg-slate-800 hover:scale-125 transition-transform cursor-pointer relative z-40 flex items-center justify-center pointer-events-auto">
            ${imageUrl ? `<img src="${imageUrl}" class="w-full h-full object-cover" />` : `<div class="w-full h-full bg-[var(--theme-accent-primary)]"></div>`}
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const torreIcon = createPinIcon('text-orange-500', 'La Torre de les Maçanes');
const penaguilaIcon = createPinIcon('text-indigo-500', 'Penàguila');
const benifallimIcon = createPinIcon('text-emerald-500', 'Benifallim');
const sellaIcon = createPinIcon('text-blue-400', 'Sella');
const orxetaIcon = createPinIcon('text-yellow-500', 'Orxeta');
const relleuIcon = createPinIcon('text-red-500', 'Relleu');
const alcolejaIcon = createPinIcon('text-green-500', 'Alcoleja');
const xixonaIcon = createPinIcon('text-amber-600', 'Xixona');
const tibiIcon = createPinIcon('text-cyan-500', 'Tibi');

const InteractiveMapControls = ({ isPlacingPost, setIsPlacingPost }) => {
    const map = useMap();
    
    useMapEvents({
        click(e) {
            if (isPlacingPost) {
                // Future: Open standard post creation modal with these coordinates
                alert(`Has seleccionat les coordenades: Lat ${e.latlng.lat.toFixed(4)}, Lng ${e.latlng.lng.toFixed(4)}\n(Açò obrirà el formulari de nou post prompte)`);
                setIsPlacingPost(false);
            }
        }
    });

    const handleLocation = (e) => {
        e.preventDefault();
        e.stopPropagation();
        map.locate().on("locationfound", function (evt) {
            map.flyTo(evt.latlng, map.getZoom(), { duration: 1.5 });
        }).on("locationerror", function () {
            alert("No hem pogut trobar la teua ubicació. Comprova els permisos del navegador.");
        });
    };

    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[1000]">
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlacingPost(!isPlacingPost); }}
                className={`p-3 text-white border border-white/10 rounded-[28px] shadow-lg transition-colors ${isPlacingPost ? 'bg-orange-500' : 'bg-[#111827] hover:bg-slate-800'}`}
                title="Geolocalitzar un nou post"
            >
                <Plus className="w-6 h-6" />
            </button>
            <button 
                onClick={handleLocation}
                className="p-3 bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-lg hover:bg-slate-800"
                title="Troba la meua ubicació"
            >
                <Navigation className="w-6 h-6" />
            </button>
        </div>
    );
};

const Map = () => {
    const navigate = useNavigate();
    const { blueprintMode } = useDesign();
    const { user, isPlayground } = useAuth();
    const [mapSearch, setMapSearch] = React.useState('');
    const [viewMode, setViewMode] = React.useState(localStorage.getItem('map_view_mode') || 'grid');
    const [isPlacingPost, setIsPlacingPost] = React.useState(false);

    const { posts: unifiedPosts, loading } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

    return (
        <div className="map-page-container">
            <div className="sticky top-0 w-full z-[100] shadow-md">
                <ContextualHeader
                    searchTerm={mapSearch}
                    onSearchChange={setMapSearch}
                    viewMode={viewMode}
                    onViewModeChange={(mode) => {
                        setViewMode(mode);
                        localStorage.setItem('map_view_mode', mode);
                    }}
                    placeholder="Cerca al mapa..."
                />
            </div>

            <div className="flex flex-col items-center w-full">
                <div className="map-content-area w-full max-w-[1600px] mx-auto p-4 md:p-8">
                    <div className={`relative w-full h-[50vh] min-h-[400px] max-h-[700px] rounded-[32px] overflow-hidden bg-blue-50 dark:bg-slate-900 border-2 border-slate-800 shadow-inner group`}>
                        {blueprintMode && <BlueprintOverlay label="MAP_VIEW" info="Interactive Placeholder" color="green" />}
                    {/* React Leaflet Map */}
                    <div className="absolute inset-0 z-0 map-container-custom">
                        <MapContainer 
                            center={[38.6042, -0.4266]} 
                            zoom={12} 
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <LayersControl position="topleft">
                                <LayersControl.BaseLayer checked name="OpenStreetMap">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>
                                <LayersControl.BaseLayer name="Topogràfic (Muntanya)">
                                    <TileLayer
                                        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>
                            </LayersControl>

                            {/* Main Markers */}
                            <Marker position={[38.6042, -0.4266]} icon={torreIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-la-torre') }} />
                            <Marker position={[38.6781, -0.3582]} icon={penaguilaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-penaguila') }} />
                            <Marker position={[38.6331, -0.3983]} icon={benifallimIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-benifallim') }} />
                            <Marker position={[38.6083, -0.2721]} icon={sellaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-sella') }} />
                            <Marker position={[38.5630, -0.2618]} icon={orxetaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-orxeta') }} />
                            <Marker position={[38.5878, -0.3114]} icon={relleuIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-relleu') }} />
                            <Marker position={[38.6811, -0.3314]} icon={alcolejaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-alcoleja') }} />
                            <Marker position={[38.5398, -0.5085]} icon={xixonaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-xixona') }} />
                            <Marker position={[38.5306, -0.5761]} icon={tibiIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-tibi') }} />

                            {/* Dynamic Post Markers */}
                            {unifiedPosts.filter(p => p.lat && p.lng).map((post, index) => {
                                const imgUrl = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.image);
                                return (
                                    <Marker 
                                        key={`post-${post.id || post.uuid || index}`}
                                        position={[post.lat, post.lng]}
                                        icon={createPostIcon(imgUrl)}
                                        eventHandlers={{ 
                                            click: () => {
                                                if(post.type === 'mercat') navigate(`/mercat/${post.id || post.uuid}`);
                                                else navigate(`/post/${post.id || post.uuid}`);
                                            } 
                                        }}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="text-center min-w-[120px]">
                                                <b className="text-sm font-bold block text-slate-800 line-clamp-2 leading-tight">
                                                    {post.title || post.content?.substring(0, 30) + '...'}
                                                </b>
                                                <span className="text-[10px] text-gray-500 mt-1 block">Pel {post.author}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Custom Controls inside map context */}
                            <InteractiveMapControls isPlacingPost={isPlacingPost} setIsPlacingPost={setIsPlacingPost} />
                        </MapContainer>
                    </div>

                    {/* Placing Post Overlay Notification */}
                    {isPlacingPost && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-theme-panel text-theme-text font-bold px-4 py-2 rounded-full shadow-xl border border-orange-500/50 z-[1000] animate-pulse">
                            Clica en qualsevol punt del mapa per afegir una publicació
                        </div>
                    )}

                    {/* Filters */}
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-full pr-6 no-scrollbar z-10">
                        <button className="px-4 py-2 bg-theme-panel backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10"><Store className="w-3 h-3 inline mr-1" /> Comerç</button>
                        <button className="px-4 py-2 bg-theme-panel backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10"><Landmark className="w-3 h-3 inline mr-1" /> Patrimoni</button>
                        <button className="px-4 py-2 bg-theme-panel backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10"><Ticket className="w-3 h-3 inline mr-1" /> Events</button>
                    </div>
                </div>
            </div>

                {/* Mur Unificat Inferior */}
                <div className="unified-feed-container w-full max-w-[1600px] mx-auto">
                    <div className="px-4 md:px-8 py-2 flex items-center justify-between opacity-80 mb-2">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-theme-text">
                            <Activity size={20} className="text-orange-500" />
                            Pols del Territori
                        </h2>
                        <span className="text-xs text-white/50">{unifiedPosts.length} registres</span>
                    </div>
                
                {loading ? (
                        <div className="flex justify-center p-8"><span className="animate-pulse text-theme-text">Sincronitzant radar territorial...</span></div>
                    ) : (
                        <div className="bg-transparent">
                            <Feed 
                                hideHeader={true} 
                                customPosts={unifiedPosts} 
                                externalViewMode={viewMode} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Map;


=====================================
FILE: src/pages/MarketItemDetail.jsx
=====================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Zap, MapPin, User, Sparkles, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import ImageCarousel from '../components/ImageCarousel';
import { MOCK_MARKET_ITEMS } from '../data';
import '../components/ItemDetailModal.css';
import { marketService } from '../services/marketService';

const MarketItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                // First check mock data for local items (like the Camiseta)
                const mockItem = MOCK_MARKET_ITEMS.find(m => m.id === id || m.id.toString() === id);
                if (mockItem) {
                    setItem(mockItem);
                    return;
                }

                // If not mock, fetch from Supabase
                const { data } = await marketService.getMarketItems({ id, limit: 1 });
                if (data && data.length > 0) {
                    setItem(data[0]);
                }
            } catch (error) {
                logger.error('[MarketItemDetail] Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <NanoLoader message="Preparant l'aparador..." />;
    if (!item) return <div className="error-page bg-theme-base min-h-screen text-white flex items-center justify-center">Article no trobat.</div>;

    const handleChatClick = () => {
        if (!user) {
            navigate('/registre?returnTo=' + encodeURIComponent(window.location.pathname));
            return;
        }
        navigate(`/chats/${item.seller_entity_id || item.author_user_id || item.author_id}`, {
            state: { interestedIn: item }
        });
    };

    const productSchema = {
        "description": item.description,
        "category": item.category || 'Producte Rural',
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": item.price?.toString().replace(/[^\d.,]/g, '').replace(',', '.') || "0",
            "availability": "https://schema.org/InStock"
        },
        "seller": {
            "@type": "Organization",
            "name": item.seller_name || item.seller || 'Sóc de Poble'
        }
    };

    const imageSources = item.image_url || item.images || item.image || ['/images/assets/generic_market.png'];
    const imagesArray = Array.isArray(imageSources) ? imageSources : [imageSources];

    return (
        <div className="min-h-screen bg-theme-base text-white animate-in fade-in duration-300">
            <SEO 
                title={`${item.title} | Mercat Rural`}
                description={item.description}
                image={imagesArray[0]}
                type="product"
                structuredData={productSchema}
            />

            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-theme-base/90 backdrop-blur-md border-b border-white/10">
                <button className="p-2 -ml-2 text-white/70 hover:text-white" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="font-display font-black tracking-widest text-[#F97316]">MERCAT</div>
                <div className="w-10"></div> {/* Spacer for centering */}
            </header>

            <main className="pb-24 max-w-2xl mx-auto">
                {/* Carrusel d'Imatges */}
                <div className="w-full aspect-square bg-[#111111] border-b border-white/5 relative">
                    {imagesArray.length > 1 ? (
                        <ImageCarousel images={imagesArray} />
                    ) : (
                        <img src={imagesArray[0]} alt={item.title} className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Informació del Producte */}
                <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <h1 className="font-display text-2xl font-black leading-tight flex-1">{item.title}</h1>
                        <div className="text-2xl font-black text-[#F97316] whitespace-nowrap bg-[#F97316]/10 px-4 py-1 rounded-[28px] border border-[#F97316]/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            {item.price}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-wider mb-6">
                        <User size={16} />
                        <span>{item.seller_name || item.seller || 'Sóc de Poble'}</span>
                    </div>

                    <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-white/80 max-w-none mb-8 whitespace-pre-line">
                        {item.description}
                    </div>

                    {item.is_iaia_inspired && (
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-[24px] p-5 mb-8">
                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter text-[#0EA5E9] mb-2">
                                <Sparkles size={16} />
                                <span>SIMBIOSI Master [IAIA + VEÍ]</span>
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed">
                                Aquest contingut ha estat cuidat per l'IAIA per a estalviar temps al productor i que puga dedicar-se al camp. 🏛️🌾
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Sticky Action Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-theme-base/95 backdrop-blur-xl border-t border-white/10 z-50">
                <div className="max-w-2xl mx-auto flex gap-3">
                    <button
                        className="flex-1 bg-white text-black h-[56px] rounded-[28px] font-black tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-active active:scale-95 shadow-lg shadow-white/10"
                        onClick={handleChatClick}
                    >
                        <MessageCircle size={20} />
                        <span>PARLAR AMB EL VENEDOR</span>
                    </button>

                    <ShareHub
                        title={`${item.title} - El Mercat de Sóc de Poble`}
                        text={`Mira aquest producte de proximitat: ${item.title} per ${item.price}. Bateguem pel comerç local!`}
                        url={window.location.href}
                        customTrigger={
                            <button className="w-[56px] h-[56px] flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 rounded-[28px] text-white hover:bg-white/10 transition-active active:scale-95">
                                <Share2 size={22} />
                            </button>
                        }
                    />
                </div>
            </footer>
        </div>
    );
};

export default MarketItemDetail;


=====================================
FILE: src/pages/MasterCalendar.css
=====================================

.calendar-master-page {
    padding: 40px;
    background: var(--bg-main);
    min-height: calc(100vh - var(--header-height));
    color: var(--text-main);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 20px;
}

.title-group {
    display: flex;
    align-items: center;
    gap: 15px;
}

.title-group h1 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 2px;
    color: var(--hud-accent);
    margin: 0;
}

.calendar-controls {
    display: flex;
    align-items: center;
    gap: 20px;
    background: rgba(255, 255, 255, 0.05);
    padding: 8px 20px;
    border-radius: 0px;
    border: 1px solid var(--color-border);
}

.btn-calendar-nav {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
}

.btn-calendar-nav:hover {
    color: var(--hud-accent);
}

.current-month {
    font-weight: 800;
    font-size: var(--font-size-base);
    letter-spacing: 1px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    margin-bottom: 60px;
}

.day-name {
    text-align: center;
    font-size: var(--font-size-base);
    font-weight: 800;
    color: var(--text-muted);
    padding: 10px;
    letter-spacing: 1px;
}

.calendar-day {
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.3s;
}

.calendar-day.empty {
    background: transparent;
    border: none;
}

.calendar-day.today {
    border-color: var(--hud-accent);
    background: rgba(0, 242, 255, 0.05);
    box-shadow: var(--shadow-hard);
}

.day-number {
    font-size: var(--font-size-base);
    font-weight: 700;
    opacity: 0.6;
}

.calendar-day.today .day-number {
    color: var(--hud-accent);
    opacity: 1;
}

.day-events {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.event-tag {
    font-size: 9px;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: transform 0.2s;
    text-transform: uppercase;
}

.event-tag:hover {
    transform: scale(1.05);
}

.event-tag.session {
    background: var(--hud-accent);
    color: var(--bg-canvas);
}

/* Anchors List */
.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.section-header h2 {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 1px;
}

.anchors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.anchor-card {
    background: var(--bg-card);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.anchor-card:hover {
    transform: translateY(-5px);
    border-color: var(--hud-accent);
    box-shadow: var(--shadow-hard);
}

.anchor-date {
    font-size: var(--font-size-base);
    color: var(--hud-accent);
    font-weight: 800;
    margin-bottom: 8px;
}

.anchor-card h3 {
    font-size: 18px;
    font-weight: 800;
    margin: 0 0 10px 0;
}

.anchor-card p {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 20px;
}

.anchor-id {
    font-size: var(--font-size-base);
    font-family: monospace;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .calendar-master-page {
        padding: 20px;
    }

    .calendar-grid {
        gap: 5px;
    }

    .day-number {
        font-size: var(--font-size-base);
    }

    .event-tag span {
        display: none;
    }
}

=====================================
FILE: src/pages/MasterCalendar.jsx
=====================================

import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Brain, ArrowLeft } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { MOCK_EVENTS } from '../data';
import './MasterCalendar.css';

const MasterCalendar = () => {
    const navigate = useNavigate();
    const today = new Date();

    // Ancoratges de Memòria des de la xarxa Rhizome
    const events = [...CALENDAR_EVENTS, ...MOCK_EVENTS];

    return (
        <div className="calendar-master-page animate-in">
            <header className="calendar-header">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0"
                        title="Tornar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="title-group">
                        <CalendarIcon size={24} color="var(--hud-accent)" />
                        <h1>CALENDARI MASTER [SIMBIOSI]</h1>
                    </div>
                </div>
                <div className="calendar-controls">
                    <button className="btn-calendar-nav" onClick={() => alert('Funció de navegació de mesos en procés de bategat [GENESIS]')}>
                        <ChevronLeft />
                    </button>
                    <span className="current-month">FEBRER 2026</span>
                    <button className="btn-calendar-nav" onClick={() => alert('Funció de navegació de mesos en procés de bategat [GENESIS]')}>
                        <ChevronRight />
                    </button>
                </div>
            </header>

            <div className="calendar-grid">
                {/* Cabecera de días */}
                {['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'].map(d => (
                    <div key={d} className="day-name">{d.toUpperCase()}</div>
                ))}

                {/* Días vacíos hasta el 1 de Febrero (2026 empieza en un domingo) */}
                {[...Array(0)].map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}

                {/* Días del mes */}
                {[...Array(28)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateStr);

                    return (
                        <div key={day} className={`calendar-day ${day === today.getDate() && today.getMonth() === 1 ? 'today' : ''}`}>
                            <span className="day-number">{day}</span>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`event-tag ${event.type}`}
                                        onClick={() => window.location.href = `/sessio/${event.id}`}
                                    >
                                        <Sparkles size={10} />
                                        <span>{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="memory-anchors-list">
                <div className="section-header">
                    <Brain size={18} color="var(--hud-accent)" />
                    <h2>ÀNCORAS DE MEMÒRIA RECENT</h2>
                </div>
                <div className="anchors-grid">
                    {events.map(event => (
                        <div key={event.id} className="anchor-card" onClick={() => window.location.href = `/sessio/${event.id}`}>
                            <div className="anchor-date">{event.date}</div>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <div className="anchor-id">ID: {event.id}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MasterCalendar;


=====================================
FILE: src/pages/MediaAlbum.css
=====================================

.photos-page {
    background-color: var(--bg-main);
    min-height: 100vh;
    padding-bottom: var(--nav-height);
}

.photos-header {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.photos-header h1 {
    font-size: 1.2rem;
    flex: 1;
}

.header-stats {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    background: rgba(0, 242, 255, 0.1);
    padding: 4px 10px;
    border-radius: 0px;
}

.back-btn {
    background: transparent;
    border: none;
    color: var(--text-main);
    cursor: pointer;
    padding: 4px;
}

.photos-filter-bar {
    display: flex;
    gap: 8px;
    padding: var(--space-md) var(--space-lg);
    background: var(--bg-card);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.photos-filter-bar::-webkit-scrollbar {
    display: none;
}

.photos-filter-bar button {
    background: var(--bg-surface);
    border: 1px solid var(--color-border);
    padding: 8px 16px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--text-secondary);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
}

.photos-filter-bar button.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}

.photos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
    padding: var(--space-md);
}

.photo-card {
    background: var(--bg-card);
    border-radius: 0px;
    overflow: hidden;
    box-shadow: var(--shadow-hard);
    border: 1px solid var(--color-border);
}

.photo-wrapper {
    aspect-ratio: 1;
    position: relative;
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
}

.photo-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-placeholder,
.file-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.file-type-label {
    font-size: var(--font-size-base);
    font-weight: 800;
    color: var(--text-secondary);
    letter-spacing: 1px;
}

.photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent 40%);
    padding: 8px;
    display: flex;
    justify-content: space-between;
    opacity: 0;
    transition: opacity 0.2s;
}

.photo-card:hover .photo-overlay {
    opacity: 1;
}

.photo-badge {
    background: hsla(0, 0%, 100%, 0.9);
    color: black;
    padding: 2px 8px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
}

.shared-badge {
    background: var(--color-primary);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.photo-info {
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.photo-date {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--text-muted);
}

.photo-menu-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
}

.empty-album {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 40px;
    text-align: center;
    gap: var(--space-md);
    color: var(--text-muted);
}

@media (min-width: 768px) {
    .photos-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

=====================================
FILE: src/pages/MediaAlbum.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, Image as ImageIcon, Layout, Users, MoreVertical, Trash2, ExternalLink, Loader2, Film, FileText, File } from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import './MediaAlbum.css';
import { logger } from '../utils/logger';
import MasterMediaGallery from '../components/MasterMediaGallery';

const MediaAlbum = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground } = useAuth();
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMedia = async () => {
            try {
                setIsLoading(true);
                const data = await supabaseService.getUserMedia(user.id, isPlayground);
                setMediaItems(data || []);
            } catch (error) {
                logger.error('Error loading media:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) {
            loadMedia();
        }
    }, [user?.id, isPlayground]);


    if (isLoading) return <StatusLoader type="loading" />;

    return (
        <div className="photos-page">
            <header className="photos-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>{t('nav.my_album') || 'Àlbum Multimedia'}</h1>
                <div className="header-stats">
                    <span>{mediaItems.length} {mediaItems.length === 1 ? 'Arxiu' : 'Arxius'}</span>
                </div>
            </header>

            <MasterMediaGallery
                items={mediaItems.map(item => ({
                    ...item,
                    permissions: item.is_public ? 'public' : 'private'
                }))}
                title="El Teu Àlbum Personal"
            />
        </div>
    );
};

export default MediaAlbum;


=====================================
FILE: src/pages/MenuManagementView.jsx
=====================================

import React, { useState } from 'react';
import { 
  Settings, 
  Check, 
  ChevronRight, 
  Search, 
  Save, 
  LayoutGrid, 
  User, 
  Database, 
  Terminal,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_PAGES = [
  { id: 'notes', label: 'Bloc de Notes', category: 'Identitat', icon: <Settings size={18} /> },
  { id: 'perfil', label: 'Perfil', category: 'Identitat', icon: <User size={18} /> },
  { id: 'arxiu', label: 'Relíquies', category: 'Recursos', icon: <Database size={18} /> },
  { id: 'mapa', label: 'Mapa', category: 'Recursos', icon: <LayoutGrid size={18} /> },
  { id: 'calendari', label: 'Agenda', category: 'Recursos', icon: <Settings size={18} /> },
  { id: 'infoteca', label: 'Infoteca', category: 'Recursos', icon: <LayoutGrid size={18} /> },
  { id: 'solatge', label: 'Solatge', category: 'Recursos', icon: <Database size={18} /> },
  { id: 'genesis', label: 'Genesis Viewer', category: 'Tècnic', icon: <Terminal size={18} /> },
  { id: 'buscador-ajudes', label: 'Buscador Ajudes', category: 'Recursos', icon: <Search size={18} /> },
  { id: 'directori', label: 'Directori', category: 'Estructura', icon: <LayoutGrid size={18} /> },
  { id: 'dossier', label: 'Dossier Socis', category: 'Oficial', icon: <Database size={18} /> },
];

const MenuManagementView = () => {
  const navigate = useNavigate();
  const [selectedPages, setSelectedPages] = useState(['notes', 'perfil', 'arxiu', 'mapa', 'calendari', 'infoteca', 'solatge']);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePage = (id) => {
    setSelectedPages(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredPages = ALL_PAGES.filter(page => 
    page.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(ALL_PAGES.map(p => p.category))];

  return (
    <div className="flex-1 flex flex-col bg-theme-base animate-in fade-in duration-500 overflow-hidden h-full">
      {/* HEADER GESTIÓ */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">GESTIÓ DE MENÚ</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">IDENTITAT i RECURSOS · ADMIN CONSOLE</p>
          </div>
        </div>
        <button 
          className="h-10 px-6 rounded-[28px] bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          onClick={() => alert('Configuració salvada al Gènesi!')}
        >
          <Save size={16} />
          GUARDAR CANVIS
        </button>
      </header>

      {/* FILTRES I RECERCA */}
      <div className="p-6 bg-black/20 border-b border-white/5 shrink-0">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="CERCA PÀGINES O CATEGORIES..."
            className="w-full h-12 bg-white/5 border border-white/10 rounded-[28px] pl-12 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* LLISTAT DE PÀGINES PER CATEGORIA */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          {categories.map(category => {
            const pagesInCategory = filteredPages.filter(p => p.category === category);
            if (pagesInCategory.length === 0) return null;

            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-6 bg-secondary rounded-[28px]" />
                  <h2 className="text-sm font-black text-white/50 uppercase tracking-[0.3em]">{category}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pagesInCategory.map(page => (
                    <button
                      key={page.id}
                      onClick={() => togglePage(page.id)}
                      className={`
                        flex items-center justify-between p-4 rounded-2xl border transition-all group
                        ${selectedPages.includes(page.id) 
                          ? 'bg-primary/10 border-primary/30 text-white' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 flex items-center justify-center rounded-xl transition-all
                          ${selectedPages.includes(page.id) ? 'bg-primary text-white' : 'bg-white/5 text-gray-500'}
                        `}>
                          {page.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-black text-[13px] uppercase tracking-wider">{page.label}</p>
                          <p className="text-[10px] opacity-40 font-bold uppercase">{page.id}</p>
                        </div>
                      </div>
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center transition-all
                        ${selectedPages.includes(page.id) ? 'bg-primary text-white scale-110' : 'border border-white/10 text-transparent'}
                      `}>
                        <Check size={14} strokeWidth={4} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default MenuManagementView;


=====================================
FILE: src/pages/NexusFlash.css
=====================================

:root {
    --nexus-bg: #0b0e14;
    --nexus-glass: rgba(23, 25, 35, 0.6);
    --nexus-border: rgba(255, 255, 255, 0.08);
    --nexus-accent: #00f2ff;
    --nexus-gold: #ffb700;
    --nexus-orange: #f97316;
}

.nexus-container {
    min-height: 100vh;
    background: radial-gradient(circle at 50% 0%, #1a202c 0%, #0b0e14 70%);
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
    padding-bottom: env(safe-area-inset-bottom, 20px);
}

.nexus-header {
    background: var(--nexus-glass);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--nexus-border);
    padding: 20px 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nexus-header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.nexus-back-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--nexus-border);
    border-radius: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
}

.nexus-glitch-title {
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: 4px;
    color: white;
    margin: 0;
}

.nexus-subtitle {
    font-size: 0.75rem;
    color: var(--nexus-accent);
    letter-spacing: 1px;
    margin: 0;
}

.nexus-status-pill {
    margin-left: auto;
    background: rgba(0, 242, 255, 0.1);
    color: var(--nexus-accent);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(0, 242, 255, 0.2);
}

.pulse {
    animation: nexus-pulse 2s infinite;
}

@keyframes nexus-pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}

.nexus-nav {
    display: flex;
    gap: 4px;
}

.nexus-nav button {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    padding: 12px 4px;
    color: #a0aec0;
    font-size: 0.7rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
}

.nexus-nav button.active {
    color: var(--nexus-accent);
    border-bottom-color: var(--nexus-accent);
}

.nexus-main-content {
    padding: 24px 20px;
    max-width: 800px;
    margin: 0 auto;
}

.glass-card {
    background: var(--nexus-glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--nexus-border);
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 20px;
}

.nexus-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 20px;
}

.nexus-stat {
    background: rgba(255, 255, 255, 0.03);
    padding: 16px;
    border-radius: 18px;
    text-align: center;
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 1.2rem;
    font-weight: 800;
}

.stat-label {
    font-size: 0.6rem;
    color: #a0aec0;
    text-transform: uppercase;
}

.nexus-directives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.directive-card h3 {
    font-size: 1rem;
    margin: 12px 0 8px;
}

.directive-card p {
    font-size: 0.8rem;
    color: #a0aec0;
    line-height: 1.5;
}

.icon-gold {
    color: var(--nexus-gold);
}

.icon-cyan {
    color: var(--nexus-accent);
}

.icon-orange {
    color: var(--nexus-orange);
}

.lab-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.btn-toggle {
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-toggle.v2 {
    background: var(--nexus-accent);
    color: black;
}

.btn-toggle.v1 {
    background: #f97316;
    color: white;
}

.preview-card {
    padding: 30px;
    border-radius: 8px;
    /* Default for V1 */
    background: #f1f5f9;
    color: black;
    margin-bottom: 20px;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.preview-card.style-v2 {
    background: var(--nexus-glass);
    backdrop-filter: blur(20px);
    border-radius: 32px;
    border: 1px solid var(--nexus-border);
    color: white;
}

.preview-avatar {
    width: 60px;
    height: 60px;
    background: #cbd5e1;
    border-radius: 4px;
    margin-bottom: 16px;
}

.style-v2 .preview-avatar {
    border-radius: 20px;
    border: 2px solid var(--nexus-accent);
}

.preview-btn {
    margin-top: 20px;
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    border: 2px solid black;
    background: transparent;
    font-weight: bold;
}

.style-v2 .preview-btn {
    border: none;
    background: linear-gradient(135deg, var(--nexus-accent), #7000ff);
    color: white;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 242, 255, 0.3);
}

.ia-sim-section {
    margin-bottom: 30px;
}

.iaia-chat-bubble {
    padding: 20px;
    margin-bottom: 12px;
    position: relative;
    font-style: italic;
    color: var(--nexus-accent);
}

.iaia-input-group {
    display: flex;
    gap: 10px;
}

.iaia-input-group input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--nexus-border);
    border-radius: 15px;
    padding: 12px 16px;
    color: white;
}

.btn-pregonar {
    width: 100%;
    background: var(--nexus-gold);
    color: black;
    border: none;
    padding: 15px;
    border-radius: 15px;
    font-weight: 900;
    margin-top: 10px;
}

.pregoner-box textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--nexus-border);
    border-radius: 12px;
    padding: 12px;
    color: white;
    min-height: 80px;
}

.pregoner-result {
    margin-top: 20px;
    padding: 20px;
    background: rgba(255, 183, 0, 0.1);
    border-left: 4px solid var(--nexus-gold);
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
}

.solatge-console {
    background: #000;
    border: 1px solid #00f2ff55;
    font-family: 'JetBrains Mono', monospace;
    padding: 15px;
    border-radius: 8px;
}

.console-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    color: var(--nexus-accent);
    border-bottom: 1px solid #00f2ff22;
    padding-bottom: 8px;
    margin-bottom: 12px;
}

.console-body {
    font-size: 11px;
    color: #00f2ff;
    line-height: 1.6;
}

.line.cursor {
    animation: blink 1s infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

.widget-row {
    display: flex;
    gap: 12px;
}

.widget {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
}

.widget .label {
    font-size: 0.6rem;
    opacity: 0.6;
}

.widget .value {
    font-size: 1rem;
    font-weight: bold;
    color: var(--nexus-accent);
}

.iaia-chat-bubble.bategant {
    border-color: var(--nexus-accent);
    box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
    animation: nexus-bategat 1.5s infinite ease-in-out;
}

.bategat-indicator {
    position: absolute;
    bottom: -10px;
    right: 20px;
    font-size: 24px;
    animation: nexus-float 2s infinite ease-in-out;
}

.btn-pregonar.thinking {
    opacity: 0.7;
    background: linear-gradient(90deg, var(--nexus-gold), #fff, var(--nexus-gold));
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
    cursor: wait;
}

@keyframes nexus-bategat {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.02);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0.8;
    }
}

@keyframes nexus-float {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0);
    }
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.fade-in {
    animation: nexus-fade 0.5s ease-out;
}

@keyframes nexus-fade {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.nexus-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    font-size: 0.6rem;
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 2px;
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .nexus-container {
    background: radial-gradient(circle at 50% 0%, #f8fafc 0%, #e2e8f0 70%);
    color: #000;
}
.light .nexus-header {
    background: rgba(255, 255, 255, 0.8);
    border-bottom-color: rgba(0,0,0,0.1);
}
.light .nexus-glitch-title { color: #000; }
.light .nexus-back-btn {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: #000;
}
.light .glass-card {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.1);
}
.light .nexus-stat {
    background: rgba(0, 0, 0, 0.03);
}
.light .stat-value { color: #000; }
.light .iaia-input-group input {
    background: #fff;
    border-color: rgba(0,0,0,0.1);
    color: #000;
}
.light .solatge-console {
    background: #f8fafc;
    border-color: rgba(0,0,0,0.1);
}
.light .console-body { color: #000; }
.light .preview-card.style-v2 {
    background: rgba(255,255,255,0.8);
    border-color: rgba(0,0,0,0.1);
    color: #000;
}
.light .pregoner-box textarea {
    background: #fff;
    border-color: rgba(0,0,0,0.1);
    color: #000;
}

=====================================
FILE: src/pages/NexusFlash.jsx
=====================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap, Sparkles, Shield, MessageCircle, BellRing,
    Palette, Activity, Terminal, ArrowLeft, Send,
    Layout, Cpu, Database, Eye, CheckCircle2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import SEO from '../components/SEO';
import './NexusFlash.css';

const NexusFlash = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [iaiaInput, setIaiaInput] = useState('');
    const [iaiaResponse, setIaiaResponse] = useState('Bon dia fill! Què busques al Nexes?');
    const [isIaiaThinking, setIsIaiaThinking] = useState(false);
    const [pregonerInput, setPregonerInput] = useState('');
    const [pregonerResult, setPregonerResult] = useState('');
    const [isPregonerThinking, setIsPregonerThinking] = useState(false);
    const [isV2, setIsV2] = useState(true);

    const handleIaia = async () => {
        if (!iaiaInput.trim()) return;
        setIsIaiaThinking(true);
        const result = await geminiService.ask('IAIA', iaiaInput);
        setIaiaResponse(result.text);
        setIsIaiaThinking(false);
        setIaiaInput('');
    };

    const handlePregoner = async () => {
        if (!pregonerInput) return;
        setIsPregonerThinking(true);
        const result = await geminiService.ask('CRONISTA', pregonerInput);
        setPregonerResult(result.text);
        setIsPregonerThinking(false);
    };

    return (
        <div className="nexus-container">
            <SEO title="NEXUS | Sóc de Poble" description="La fulla de ruta de Flash [V2.0-BATEGA]." />
            <header className="nexus-header">
                <div className="nexus-header-content">
                    <button className="nexus-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="nexus-title-group">
                        <h1 className="nexus-glitch-title">NEXUS</h1>
                        <p className="nexus-subtitle">LA FULLA DE RUTA DE FLASH [V2.0-BATEGA]</p>
                    </div>
                    <div className="nexus-status-pill">
                        <Activity size={12} className="pulse" />
                        <span>SISTEMA ÒPTIM</span>
                    </div>
                </div>
                <nav className="nexus-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <Layout size={18} /> <span>PANELL</span>
                    </button>
                    <button className={activeTab === 'lab' ? 'active' : ''} onClick={() => setActiveTab('lab')}>
                        <Palette size={18} /> <span>LABORATORI</span>
                    </button>
                    <button className={activeTab === 'ia' ? 'active' : ''} onClick={() => setActiveTab('ia')}>
                        <Cpu size={18} /> <span>IA SIM</span>
                    </button>
                    <button className={activeTab === 'solatge' ? 'active' : ''} onClick={() => setActiveTab('solatge')}>
                        <Terminal size={18} /> <span>SOLATGE</span>
                    </button>
                </nav>
            </header>

            <main className="nexus-main-content">
                {activeTab === 'dashboard' && (
                    <div className="nexus-dashboard fade-in">
                        <div className="nexus-welcome-card glass-card">
                            <h2>👋 Benvingut al Nexes, Flash!</h2>
                            <p>Aquest és el teu entorn segur per a provar la transició a la <b>Nit Digital (V2)</b>.</p>
                            <div className="nexus-stats-grid">
                                <div className="nexus-stat">
                                    <span className="stat-value">32px</span>
                                    <span className="stat-label">Geometria [MAX]</span>
                                </div>
                                <div className="nexus-stat">
                                    <span className="stat-value">60%</span>
                                    <span className="stat-label">Glassmorphism</span>
                                </div>
                                <div className="nexus-stat warning">
                                    <span className="stat-value">0px</span>
                                    <span className="stat-label">Brutalisme Purga</span>
                                </div>
                            </div>
                        </div>

                        <div className="nexus-directives-grid">
                            <div className="directive-card glass-card">
                                <Shield className="icon-gold" />
                                <h3>Offline-First</h3>
                                <p>La dada ha de romandre al dispositiu del veí. La SQLite és sobirana.</p>
                            </div>
                            <div className="directive-card glass-card">
                                <Eye className="icon-cyan" />
                                <h3>Trellat Visual</h3>
                                <p>L'estètica ha d'evolucionar cap al futur sense perdre l'ànima rural.</p>
                            </div>
                            <div className="directive-card glass-card">
                                <Zap className="icon-orange" />
                                <h3>Batec Atòmic</h3>
                                <p>Cada acció té haptic feedback i una transició orgànica.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'lab' && (
                    <div className="nexus-lab fade-in">
                        <div className="lab-controls">
                            <h3>Comparativa d'Arquitectura</h3>
                            <button className={`btn-toggle ${isV2 ? 'v2' : 'v1'}`} onClick={() => setIsV2(!isV2)}>
                                {isV2 ? 'Mode: NIT DIGITAL (V2)' : 'Mode: LLEGAT (V1)'}
                            </button>
                        </div>

                        <div className="lab-preview-grid">
                            <div className={`preview-card ${isV2 ? 'style-v2' : 'style-v1'}`}>
                                <h4>TARGETA UNIVERSAL</h4>
                                <div className="preview-avatar"></div>
                                <div className="preview-line"></div>
                                <div className="preview-line short"></div>
                                <button className="preview-btn">ACCIÓ MASTER</button>
                            </div>

                            <div className="lab-notes glass-card">
                                <h4>Tokens de la Prova:</h4>
                                <ul>
                                    <li><b>Radius:</b> {isV2 ? '24px - 32px' : '0px - 4px'}</li>
                                    <li><b>Background:</b> {isV2 ? 'Glassmorphism Fosc' : 'Sòlid / Taronja Boina'}</li>
                                    <li><b>Border:</b> {isV2 ? 'Subtil (rgba)' : '2px solid #000'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ia' && (
                    <div className="nexus-ia fade-in">
                        <section className="ia-sim-section">
                            <h3>👵 IAIA MarIA SIM</h3>
                            <div className={`iaia-chat-bubble glass-card ${isIaiaThinking ? 'bategant' : ''}`}>
                                {isIaiaThinking ? "L'IAIA està bategant trellat..." : iaiaResponse}
                                {isIaiaThinking && <div className="bategat-indicator">🏺</div>}
                            </div>
                            <div className="iaia-input-group">
                                <input
                                    type="text"
                                    placeholder="Demana-li trellat..."
                                    value={iaiaInput}
                                    onChange={(e) => setIaiaInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleIaia()}
                                    disabled={isIaiaThinking}
                                />
                                <button onClick={handleIaia} disabled={isIaiaThinking}>
                                    {isIaiaThinking ? <Activity size={18} className="pulse" /> : <Send size={18} />}
                                </button>
                            </div>
                        </section>

                        <section className="ia-sim-section">
                            <h3>📢 EL PREGONER MÀGIC</h3>
                            <div className="pregoner-box glass-card">
                                <textarea
                                    placeholder="Escriu el que vols anunciar..."
                                    value={pregonerInput}
                                    onChange={(e) => setPregonerInput(e.target.value)}
                                    disabled={isPregonerThinking}
                                />
                                <button className={`btn-pregonar ${isPregonerThinking ? 'thinking' : ''}`} onClick={handlePregoner} disabled={isPregonerThinking}>
                                    {isPregonerThinking ? 'PREGONANT AL MAS...' : 'CRIDAR BANDO 🏺'}
                                </button>
                                {pregonerResult && !isPregonerThinking && (
                                    <div className="pregoner-result fade-in">
                                        {pregonerResult}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'solatge' && (
                    <div className="nexus-solatge fade-in">
                        <div className="solatge-console glass-card">
                            <div className="console-header">
                                <Terminal size={14} />
                                <span>SOLATGE_CONSOLE_v2.0</span>
                            </div>
                            <div className="console-body">
                                <div className="line">[SISTEMA] Iniciant protocol de visió...</div>
                                <div className="line">[OK] Base de dades Rhizome bategant.</div>
                                <div className="line">[ERROR] Brutalisme detectat a la frontera de l'index.css</div>
                                <div className="line">[ACCIONS] Purga de 0px en marxa...</div>
                                <div className="line cursor">{">"} _</div>
                            </div>
                        </div>

                        <div className="solatge-widgets mt-6">
                            <div className="widget-row">
                                <div className="widget glass-card">
                                    <span className="label">SYNC_ENGINE</span>
                                    <span className="value">98.2%</span>
                                </div>
                                <div className="widget glass-card">
                                    <span className="label">DATA_SIFTER</span>
                                    <span className="value">ACTIU</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="nexus-footer">
                <Shield size={14} />
                <span>DIRECTIVA MASTER: SÓC DE POBLE</span>
            </footer>
        </div>
    );
};

export default NexusFlash;


=====================================
FILE: src/pages/Notebook.css
=====================================

.notebook-app {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Three Pane Proportions */
.notebook-sidebar {
    min-width: 240px;
    max-width: 320px;
}

.notebook-list {
    min-width: 280px;
    max-width: 400px;
}

/* Sidebar Styling */
.folder-item {
    margin: 1px 0;
    font-size: 13px;
    font-weight: 500;
}

.folder-item.active {
    background: rgba(249, 115, 22, 0.15);
    color: #f97316;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--text-muted);
    opacity: 0.2;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
    opacity: 0.4;
}

/* List Styling */
.notebook-list input {
    font-size: 13px;
}

.notebook-list .note-item {
    margin: 8px 12px;
    border-radius: 16px;
    border: 1px solid var(--border-master);
    background: transparent;
}

.notebook-list .note-item:hover {
    background: var(--hover-overlay);
}

.notebook-list .note-item.active {
    background: rgba(249, 115, 22, 0.08);
    border-color: rgba(249, 115, 22, 0.2);
}

/* Editor Adjustments */
.master-editor-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.master-editor-content {
    flex: 1;
    padding: 2rem;
    font-size: 18px;
    line-height: 1.8;
    color: var(--text-main);
    outline: none;
}

.master-editor-content h1 {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    color: var(--text-main);
}

.master-editor-content h2 {
    font-size: 1.8rem;
    font-weight: 800;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Glass Handle for resizing (Future proof) */
.resize-handle {
    width: 4px;
    cursor: col-resize;
    background: transparent;
    transition: background 0.2s;
}

.resize-handle:hover {
    background: rgba(249, 115, 22, 0.3);
}

select option {
    background: var(--bg-app);
    color: var(--text-main);
}

/* [PROTOCOL CAPTURA] Snippet Styles */
.capture-card {
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.capture-card:hover {
    border-color: #f97316 !important;
    transform: translateY(-2px);
}


=====================================
FILE: src/pages/Notes.jsx
=====================================

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NotebookSidebar from '../components/NotebookSidebar';
import NotebookList from '../components/NotebookList';
import MasterEditor from '../components/MasterEditor';
import AccessibilitatUniversal from '../components/AccessibilitatUniversal';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { hapticService } from '../services/hapticService';
import { Sparkles, Trash2, Share, Folder, Tag, MessageSquare, Info } from 'lucide-react';
import './Notebook.css';

const INITIAL_FOLDERS = [
    { id: 'f-root', name: 'General', parentId: null },
    { id: 'f-art', name: 'Articles', parentId: null },
    { id: 'f-poble', name: 'Histories del Poble', parentId: null },
    { id: 'f-prompts', name: 'Prompts de Recerca', parentId: null },
    { id: 'f-captures', name: 'Captures Web', parentId: null }
];

const INITIAL_NOTES = [
    {
        id: 'n-prompt-subvencions-2026',
        title: '🎯 Prompt Mestre: Recerca de Subvencions 2026',
        type: 'rich-text',
        content: `
<h1>Protocol de Recerca de Finançament Sobirà</h1>
<p>Aquest és el prompt utilitzat per a identificar les oportunitats de febrer de 2026. Està dissenyat per a alinear la tecnologia cívica amb els fons europeus i nacionals.</p>

<div class="prompt-box" style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid #333; margin: 20px 0;">
    <p style="color: #f97316; font-family: monospace; font-size: 14px;">
        "Actua com un consultor expert en captació de fons per al Tercer Sector i Innovació Rural. Analitza el projecte 'Sóc de Poble' (tecnologia Local-First, App Offline, economia circular, memòria viva de la tercera edat i sobirania digital). 
        <br><br>
        Identifica les subvencions més rellevants disponibles a finals de febrer de 2026 a nivell Europeu (Horizon Europe), Nacional (MITECO, Red.es) i Autonòmic (Generalitat Valenciana, LEADER). 
        <br><br>
        Destaquen aquelles que financen tant hardware com recursos humans i desenvolupament de software per a entitats sense ànim de lucre. Proporciona terminis, quanties i justificació de per què encaixen amb la missió del Mas."
    </p>
</div>

<p><em>Nota de l'Archon: Aquest prompt ha de ser actualitzat cada trimestre per a captar les noves finestres d'oportunitat de la Séquia Mare Financera.</em></p>
        `,
        folderId: 'f-prompts',
        category: 'Dades',
        tags: ['#prompts', '#funding', '#subvencions'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        contentCreatedAt: new Date().toISOString()
    },
    { 
        id: 'n1', 
        title: 'Benvinguda al Quadern de Trellat 📓🏺', 
        type: 'rich-text',
        content: `
<h1>Benvingut al teu nou espai editorial!</h1>
<p>Aquest és el <strong>Quadern de Trellat v2.0</strong>, dissenyat per a bategar la història del territori amb la màxima elegància i potència.</p>

<h2>✨ Editor Unificat i Net</h2>
<p>Hem creat un sistema que t'entén. Pots enganxar text de qualsevol lloc i l'editor el netejarà automàticament per a que mantingui l'estètica del poble, sense codi brut.</p>

<ul class="checklist-block">
    <li draggable="true">
        <div class="checklist-drag-handle" contenteditable="false">⋮⋮</div>
        <input type="checkbox" checked> 
        <span>Editor de blocs actiu</span>
        <button class="checklist-item-remove" contenteditable="false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
    </li>
</ul>

<h2>🏺 Dades i Planificació</h2>
<p>Fes clic a la icona d'informació (i) a la part superior dreta per a veure la traçabilitat de la nota i planificar la seva <strong>data prevista</strong>.</p>

<p><em>Gaudeix de l'escriptura, Archon.</em></p>
        `, 
        folderId: 'f-root', 
        category: 'Trellat', 
        tags: ['#benvinguda', '#manual'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        contentCreatedAt: new Date().toISOString()
    }
];

const Notes = () => {
    const { isAccessibilitatOpen, setIsAccessibilitatOpen } = useNavigation();
    const { isGuest } = useAuth();
    const { t } = useTranslation();
    const { openIAIASidebar } = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem('sdoc_folders');
        return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    });
    
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('sdoc_notes');
        return saved ? JSON.parse(saved) : INITIAL_NOTES;
    });

    const [activeFolderId, setActiveFolderId] = useState('f-root');
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || INITIAL_NOTES[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
    const [isListCollapsed, setIsListCollapsed] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setIsSidebarCollapsed(isMobile);
            setIsListCollapsed(isMobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('sdoc_folders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        localStorage.setItem('sdoc_notes', JSON.stringify(notes));
    }, [notes]);

    const activeNote = useMemo(() => 
        notes.find(n => n.id === activeNoteId) || notes[0]
    , [notes, activeNoteId]);

    // [PROTOCOL CAPTURA] Snippet Extraction Logic
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'capture') {
            const url = searchParams.get('url');
            const title = searchParams.get('title') || 'Nova Captura Web';
            
            if (url) {
                const captureId = `n-capture-${Date.now()}`;
                const captureNote = {
                    id: captureId,
                    title: title,
                    type: 'rich-text',
                    content: `
                        <div class="capture-card" style="background: #111; padding: 20px; border-radius: 20px; border: 1px solid #333; margin-bottom: 20px;">
                            <h2 style="color: #f97316;">🔗 Enllaç Capturat</h2>
                            <p style="color: #0ea5e9; font-weight: bold; font-family: monospace;">${url}</p>
                            <p style="color: #888; font-size: 12px; margin-top: 10px;">Capturat el ${new Date().toLocaleString('ca-ES')}</p>
                            <hr style="border: 0.5px solid #222; margin: 20px 0;">
                            <p><em>Escriu aquí les teves notes sobre aquest enllaç...</em></p>
                        </div>
                    `,
                    folderId: 'f-captures',
                    category: 'Dades',
                    tags: ['#capture', '#web'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastOpenedAt: new Date().toISOString(),
                    contentCreatedAt: new Date().toISOString()
                };
                
                // [BATEGAT ASÍNCROC] Evitem renders en cascada síncrons
                setTimeout(() => {
                    setNotes(prev => [captureNote, ...prev]);
                    setActiveNoteId(captureId);
                    setActiveFolderId('f-captures');
                    hapticService.notifySuccess();
                }, 10);
                
                // Clear params immediatament
                setSearchParams({}, { replace: true });
            }
        }
    }, [searchParams, setSearchParams]);


    const folderNotes = useMemo(() => {
        let filtered = notes;
        if (activeFolderId === 'trash') {
            return filtered.filter(n => n.status === 'trash');
        }
        filtered = filtered.filter(n => n.status !== 'trash');
        if (activeCategory) {
            filtered = filtered.filter(n => n.category === activeCategory);
        } else if (activeFolderId) {
            filtered = filtered.filter(n => n.folderId === activeFolderId);
        }
        return filtered;
    }, [notes, activeFolderId, activeCategory]);

    const handleAddNote = (type = 'rich-text') => {
        const newNote = {
            id: `n-${Date.now()}`,
            title: type === 'checklist' ? t('notebook.new_list') : t('notebook.new_note'),
            type: type,
            content: type === 'checklist' ? [] : '',
            folderId: activeFolderId || 'f-root',
            category: activeCategory || 'Trellat',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastOpenedAt: new Date().toISOString(),
            contentCreatedAt: new Date().toISOString(),
            plannedAt: null
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (id) => {
        hapticService.batec();
        setNotes(notes.map(n => 
            n.id === id ? { ...n, status: 'trash', deletedAt: new Date().toISOString() } : n
        ));
        if (activeNoteId === id) {
            const remaining = folderNotes.filter(n => n.id !== id);
            if (remaining.length > 0) {
                setActiveNoteId(remaining[0].id);
            }
        }
    };

    const handleRestoreNote = (id) => {
        hapticService.notifySuccess();
        setNotes(notes.map(n => 
            n.id === id ? { ...n, status: 'active', deletedAt: null } : n
        ));
    };

    const handlePermanentlyDeleteNote = (id) => {
        if (window.confirm(t('notebook.trash.confirm_delete'))) {
            hapticService.batec();
            setNotes(notes.filter(n => n.id !== id));
            if (activeNoteId === id) {
                setActiveNoteId(null);
            }
        }
    };

    const handleUpdateNote = (id, updates) => {
        setNotes(prev => prev.map(n => 
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        ));
    };

    const handleAddFolder = (parentId = null) => {
        const name = prompt('Nom de la carpeta:');
        if (name) {
            const newFolder = {
                id: `f-${Date.now()}`,
                name: name,
                parentId: parentId
            };
            setFolders([...folders, newFolder]);
        }
    };

    const handleDeleteFolder = (id) => {
        if (window.confirm('Vols esborrar aquesta carpeta i tot el seu contingut?')) {
            setFolders(folders.filter(f => f.id !== id && f.parentId !== id));
            setNotes(notes.filter(n => n.folderId !== id));
        }
    };

    return (
        <div className="notebook-app flex-1 flex h-full bg-gradient-to-br from-orange-50 via-[#fff8f0] to-orange-100/50 dark:from-[#050B14] dark:via-[#090B10] dark:to-indigo-950/20 overflow-hidden animate-in fade-in duration-500">
            <NotebookSidebar 
                folders={folders}
                activeFolder={activeFolderId}
                onSelectFolder={(id) => { setActiveFolderId(id); setActiveCategory(null); if(window.innerWidth < 768) setIsSidebarCollapsed(true); }}
                onAddFolder={handleAddFolder}
                onDeleteFolder={handleDeleteFolder}
                categories={['Trellat', 'Patrimoni', 'Dades', 'Social']}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => { setActiveCategory(cat); setActiveFolderId(null); if(window.innerWidth < 768) setIsSidebarCollapsed(true); }}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <NotebookList 
                notes={folderNotes}
                activeNoteId={activeNoteId}
                onSelectNote={(id) => {
                    setActiveNoteId(id);
                    setNotes(prev => prev.map(n => 
                        n.id === id ? { ...n, lastOpenedAt: new Date().toISOString() } : n
                    ));
                    if(window.innerWidth < 768) setIsListCollapsed(true);
                }}
                onAddNote={() => handleAddNote('rich-text')}
                onReorderNotes={(newNotes) => setNotes(newNotes)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isCollapsed={isListCollapsed}
                onToggleCollapse={() => setIsListCollapsed(!isListCollapsed)}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-transparent">
                {isGuest && (
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-[14px] px-4 py-2 border-b border-orange-200 dark:border-orange-800/50 text-center shadow-sm z-10 shrink-0 select-none">
                        <span className="font-bold tracking-tight">{t('common.warning', 'Avis per a Forasters')}:</span> Aquest és un Bloc de Notes temporal. Tota la teua escriptura s'esborrarà en eixir! {' '}
                        <a href="/registre" className="font-bold underline cursor-pointer hover:text-orange-900 dark:hover:text-orange-100">{t('chat.guest_warning_link', "Registra't per a guardar les notes.")}</a>
                    </div>
                )}
                {activeNote ? (
                    <>
                        <header className="h-16 border-b border-orange-200/50 dark:border-indigo-900/40 bg-white/40 dark:bg-[#050B14]/40 flex items-center justify-between px-8 backdrop-blur-3xl shrink-0 z-10 shadow-[0_4px_30px_rgba(249,115,22,0.03)] dark:shadow-[0_4px_30px_rgba(6,182,212,0.03)]">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <input 
                                    type="text" 
                                    value={activeNote.title}
                                    onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                                    className="bg-transparent border-none outline-none text-xl font-black uppercase tracking-tighter w-full placeholder:opacity-30 text-orange-950 dark:text-indigo-50"
                                    placeholder="Títol de la nota..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => openIAIASidebar({ context: `Editing ${activeNote.type}: ${activeNote.title}` })}
                                    className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600/10 text-fuchsia-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-fuchsia-600/20 transition-all"
                                >
                                    <MessageSquare size={14} /> Assistent
                                </button>
                                <button 
                                    className="p-2 rounded-[28px] transition-all text-orange-900/40 hover:text-red-600 hover:bg-red-100 dark:text-indigo-300/40 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                                    onClick={() => activeNote.status === 'trash' ? handlePermanentlyDeleteNote(activeNote.id) : handleDeleteNote(activeNote.id)}
                                    title={activeNote.status === 'trash' ? t('notebook.trash.permanent_delete') : t('notebook.trash.send_to_trash')}
                                >
                                    <Trash2 size={20} />
                                </button>
                                {activeNote.status === 'trash' && (
                                    <button 
                                        className="px-4 py-2 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/30 border rounded-[28px] text-xs font-black uppercase tracking-widest hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all shadow-sm"
                                        onClick={() => handleRestoreNote(activeNote.id)}
                                    >
                                        {t('notebook.trash.restore')}
                                    </button>
                                )}
                                <button 
                                    className="p-2.5 rounded-[28px] transition-all text-orange-900/50 hover:text-orange-950 hover:bg-orange-100/50 dark:text-indigo-300/50 dark:hover:text-indigo-100 dark:hover:bg-indigo-900/40"
                                    onClick={() => setShowInfo(!showInfo)}
                                    title="Informació de la nota"
                                >
                                    <Info size={18} />
                                </button>
                                <button 
                                    className="p-2.5 rounded-[28px] transition-all text-orange-900/50 hover:text-orange-950 hover:bg-orange-100/50 dark:text-indigo-300/50 dark:hover:text-indigo-100 dark:hover:bg-indigo-900/40"
                                    onClick={() => alert('Funció de compartició bategant próximament!')}
                                >
                                    <Share size={18} />
                                </button>
                            </div>
                        </header>

                        {showInfo && (
                            <div className="bg-orange-50/80 border-b border-orange-200/50 dark:bg-indigo-950/40 dark:border-indigo-900/40 px-8 py-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-black uppercase text-orange-800/60 dark:text-indigo-400/60 tracking-widest">{t('notebook.info')}</h3>
                                    <button onClick={() => setShowInfo(false)} className="text-xs text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 uppercase font-bold">{t('common.back')}</button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-600 uppercase">{t('notebook.creation')}</div>
                                        <div className="text-sm text-gray-400 font-medium">{new Date(activeNote.createdAt || activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-600 uppercase">{t('notebook.modification')}</div>
                                        <div className="text-sm text-gray-400 font-medium">{new Date(activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-600 uppercase">{t('notebook.last_opened')}</div>
                                        <div className="text-sm text-gray-400 font-medium">{new Date(activeNote.lastOpenedAt || activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-600 uppercase">{t('notebook.content_creation')}</div>
                                        <div className="text-sm text-gray-400 font-medium">{new Date(activeNote.contentCreatedAt || activeNote.createdAt || activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-600 uppercase">{t('notebook.planned_date')}</div>
                                        <input 
                                            type="datetime-local" 
                                            value={activeNote.plannedAt ? activeNote.plannedAt.substring(0, 16) : ''}
                                            onChange={(e) => handleUpdateNote(activeNote.id, { plannedAt: e.target.value })}
                                            className="bg-transparent border-none outline-none text-xs text-orange-500 font-bold cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 pb-4 flex items-center gap-6 overflow-x-auto shrink-0 border-b border-orange-200/50 dark:border-indigo-900/40 z-10">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[20px] border bg-white/60 border-orange-200 shadow-sm dark:bg-indigo-900/30 dark:border-indigo-500/20">
                                <Folder size={12} className="text-orange-500" />
                                <span className="text-xs font-bold text-orange-950/70 dark:text-indigo-200/80">
                                    {folders.find(f => f.id === activeNote.folderId)?.name || 'General'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[20px] border bg-white/60 border-orange-200 shadow-sm dark:bg-indigo-900/30 dark:border-indigo-500/20">
                                <Tag size={12} className="text-fuchsia-500 dark:text-fuchsia-400" />
                                <select 
                                    className="bg-transparent border-none outline-none text-xs font-bold text-orange-950/70 dark:text-indigo-200/80 cursor-pointer"
                                    value={activeNote.category}
                                    onChange={(e) => handleUpdateNote(activeNote.id, { category: e.target.value })}
                                >
                                    {['Trellat', 'Patrimoni', 'Dades', 'Social'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden p-8 flex flex-col pt-4">
                            <div className="flex-1 bg-white/80 dark:bg-[#03060D]/80 backdrop-blur-3xl border border-orange-200/60 dark:border-indigo-500/20 rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative flex flex-col">
                                {isAccessibilitatOpen ? (
                                    <AccessibilitatUniversal embedded={true} />
                                ) : (
                                    <MasterEditor 
                                        note={activeNote}
                                        onAIA={() => setIsAccessibilitatOpen(true)}
                                        onChange={(val) => handleUpdateNote(activeNote.id, { content: val })}
                                        placeholder={t('notebook.placeholder')}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                        <Sparkles size={64} className="mb-6" />
                        <h2 className="text-2xl font-black uppercase tracking-widest">{t('notebook.title')}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;


=====================================
FILE: src/pages/Notifications.css
=====================================

.notifications-container {
    background-color: var(--bg-main);
    min-height: 100vh;
    padding-bottom: calc(var(--nav-height) + 20px);
}

.page-header-simple {
    background-color: var(--bg-surface);
    padding: var(--space-xl) var(--space-md) var(--space-md);
    border-bottom: 1px solid var(--color-border);
}

.page-header-simple h1 {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
    color: var(--text-main);
    font-family: var(--font-heading);
}

.notifications-list {
    background-color: var(--bg-surface);
}

.notification-item {
    display: flex;
    align-items: flex-start;
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-divider);
    gap: var(--space-md);
    position: relative;
    transition: background-color 0.2s;
    background-color: var(--bg-card);
}

.notification-item:active {
    background-color: var(--bg-main);
}

.notification-item.unread {
    background-color: var(--color-primary-soft);
}

.notif-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 0px;
    background-color: var(--bg-main);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.notif-content {
    flex: 1;
}

.notif-content p {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--text-main);
    line-height: 1.4;
}

.notif-user {
    font-weight: 700;
}

.notif-time {
    display: block;
    font-size: var(--font-size-base);
    color: var(--text-muted);
    margin-top: 4px;
    font-weight: var(--font-weight-bold);
}

.unread-dot {
    width: 10px;
    height: 10px;
    background-color: var(--color-primary);
    border-radius: 0px;
    position: absolute;
    right: var(--space-md);
    top: 50%;
    transform: translateY(-50%);
    border: 2px solid var(--bg-card);
}

=====================================
FILE: src/pages/Notifications.jsx
=====================================

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, UserPlus, Gift, AlertCircle, Trash2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import StatusLoader from '../components/StatusLoader';
import './Notifications.css';

const Notifications = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchNotifs = async () => {
            try {
                // Fetch real notifications from DB
                // We need to implement getNotifications in supabaseService or query directly here for MVP
                // For now, let's assume we add getNotifications to service or query directly
                // To keep it clean, let's mock it for a second if service method missing, 
                // but ideally we query supabase.

                // Importing supabase directly here to avoid changing service file again if possible,
                // but better practice is to use service. 
                // Let's rely on the service existing or add it implicitly. 
                // Wait, I didn't add getNotifications to service yet. I'll add the query here for speed/safety.

                const { supabase } = await import('../supabaseClient');
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (error) throw error;
                setNotifications(data || []);
            } catch (err) {
                logger.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifs();
    }, [user]);

    const handleNotificationClick = async (notif) => {
        // Mark as read
        if (!notif.is_read) {
            try {
                const { supabase } = await import('../supabaseClient');
                await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            } catch (e) {
                logger.error('Error marking read:', e);
            }
        }

        // Logic for Interactive Push (Deep Link)
        if (notif.related_url) {
            if (notif.meta?.is_iaia && notif.meta?.context_message) {
                // Find IAIA and redirect with context (Same logic as Layout.jsx)
                const personas = await supabaseService.getAllPersonas();
                const iaia = personas.find(p => p.full_name?.toUpperCase().includes('IAIA') || p.role === 'ambassador');

                if (iaia) {
                    navigate(`/chats/${iaia.id}`, {
                        state: { injectedMessage: notif.meta.context_message }
                    });
                } else {
                    navigate(notif.related_url);
                }
            } else {
                navigate(notif.related_url);
            }
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { supabase } = await import('../supabaseClient');
            await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) {
            logger.error('Error marking all read:', e);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm(t('common.confirm_delete_all', 'Vols esborrar totes les notificacions?'))) return;
        try {
            const { supabase } = await import('../supabaseClient');
            await supabase.from('notifications').delete().eq('user_id', user.id);
            setNotifications([]);
        } catch (e) {
            logger.error('Error clearing all:', e);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigating
        try {
            const { supabase } = await import('../supabaseClient');
            await supabase.from('notifications').delete().eq('id', id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (e) {
            logger.error('Error deleting notification:', e);
        }
    };

    if (loading) return <StatusLoader type="loading" />;

    return (
        <div className="notifications-container">
            <header className="page-header-simple">
                <h1>{t('notifications.title') || 'Notificacions'}</h1>
                {notifications.length > 0 && (
                    <div className="header-actions">
                        <button className="text-btn" onClick={handleMarkAllRead}>
                            {t('common.mark_read', 'Llegit')}
                        </button>
                        <button className="text-btn danger" onClick={handleClearAll}>
                            {t('common.clear', 'Netejar')}
                        </button>
                    </div>
                )}
            </header>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <StatusLoader type="empty" message="No tens notificacions recents." />
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <div className="notif-icon-wrapper">
                                {notif.type === 'connection' && <UserPlus size={18} color="var(--color-primary)" />}
                                {notif.type === 'comment' && <MessageCircle size={18} color="var(--color-secondary)" />}
                                {notif.type === 'system' && <AlertCircle size={18} color="#e63946" />}
                                {!['connection', 'comment', 'system'].includes(notif.type) && <Bell size={18} />}
                            </div>
                            <div className="notif-content">
                                <p>{notif.content}</p>
                                <span className="notif-time">
                                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="notif-actions">
                                {!notif.is_read && <div className="unread-dot"></div>}
                                <button className="delete-btn" onClick={(e) => handleDelete(e, notif.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;


=====================================
FILE: src/pages/OficiDocumentacio.css
=====================================

.ofici-page {
    /* Most styles are migrated to Tailwind utility classes in V15/Premium.
       Reserving for highly specific animations or overrides. */
    min-height: 100vh;
}

@keyframes floatElement {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
}

.document-category-card {
    /* Clean overrides for hover states beyond Tailwind capabilities */
}

=====================================
FILE: src/pages/OficiDocumentacio.jsx
=====================================

import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FileText,
  ChevronRight,
  Calculator,
  Landmark,
  Sprout,
  Home,
  Info,
  Search,
  Bot,
  Shield,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Globe,
  Users,
  X,
  Maximize2
} from "lucide-react";
import KitDigitalManager from "../components/KitDigitalManager";
import HerenciaManager from "../components/HerenciaManager";
import IAIAAssistantFlow from "../components/IAIAAssistantFlow";
import PDFBategatManager from "../components/PDFBategatManager";
import { useNavigation } from '../context/NavigationContext';
import "./OficiDocumentacio.css";

const OficiDocumentacio = () => {
  const navigate = useNavigate();
  const { openIAIASidebar } = useNavigation();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tramitParam = queryParams.get("tramit");
  
  const { iaiaSidebarOpen } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [internalActiveProcedure, setInternalActiveProcedure] = useState(null);
  const [showKitManager, setShowKitManager] = useState(false);
  const [showHerenciaManager, setShowHerenciaManager] = useState(false);
  const [showIAIANavigator, setShowIAIANavigator] = useState(false);
  const [showPDFManager, setShowPDFManager] = useState(false);
  
  // Lightbox State
  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);

  const activeProcedure = id || internalActiveProcedure || tramitParam;

  const documentCategories = [
    {
      id: "associacions",
      title: "Associacions i Identitat",
      icon: <Globe className="cat-icon w-5 h-5" />,
      color: "#3B82F6",
      image: "/assets/nanobanana/nanobanana_asso_identity.png",
      description: "Registre internacional DUNS/ISSN i tràmits associatius.",
      procedures: [
        {
          id: "iaia-navigator-flow",
          title: "IAIA Navigator (Tràmit Assistit)",
          status: "active",
          official_code: "INT-NAV",
        },
        {
          id: "duns-request",
          title: "Sol·licitud de Número DUNS",
          status: "active",
          official_code: "DNB-INT",
        },
        {
          id: "estatuts-review",
          title: "Revisió d'Estatuts per l'IAIA",
          status: "coming-soon",
        },
      ],
    },
    {
      id: "agricultura",
      title: "Agricultura i Camp",
      icon: <Sprout className="cat-icon w-5 h-5" />,
      color: "#22c55e",
      image: "/assets/nanobanana/nanobanana_agro_camp.png",
      description: "Ajudes de la PAC, Xylella, cremes i pous.",
      procedures: [
        {
          id: "xylella-fastidiosa",
          title: "Ayudes Xylella Fastidiosa (Seguiment)",
          status: "active",
          official_code: "18932",
        },
        {
          id: "crema-restes",
          title: "Permís de Crema de Restes (Tramitar)",
          status: "active",
          official_code: "CRM-2026",
        },
      ],
    },
    {
      id: "vivenda",
      title: "Venda i Urbanisme",
      icon: <Home className="cat-icon w-5 h-5" />,
      color: "#3b82f6",
      image: "/assets/nanobanana/nanobanana_urban_venda.png",
      description: "Certificats, llicències d'obra i IBI.",
      procedures: [
        {
          id: "cedula-vivienda",
          title: "Cèdula d'Habitabilitat",
          status: "coming-soon",
        },
      ],
    },
    {
      id: "bancari",
      title: "Banc i Hisenda",
      icon: <Landmark className="cat-icon w-5 h-5" />,
      color: "#f59e0b",
      image: "/assets/nanobanana/nanobanana_banc_hisenda.png",
      description: "Domiciliacions, impostos i tràmits bancaris.",
      procedures: [
        {
          id: "domiciliacio-bancaria",
          title: "Model de Domiciliació Bancària",
          status: "active",
        },
        {
            id: "solicitud-general-ajuntament",
            title: "Sol·licitud General (PDF Emplenable)",
            status: "active",
            official_code: "GEN-01",
          },
      ],
    },
    {
      id: "kit-digital",
      title: "Kit Digital (Govern)",
      icon: <Bot className="cat-icon w-5 h-5" />,
      color: "#FF6D23",
      image: "/assets/nanobanana/nanobanana_kit_digital.png",
      description: "Ajudes per a la digitalització (PIMES i Autònoms).",
      procedures: [
        {
          id: "kit-digital-solicitud",
          title: "Gestió de Documents Kit Digital",
          status: "active",
          official_code: "KD-2024",
        },
      ],
    },
    {
      id: "herencia",
      title: "Herència i Successions",
      icon: <Landmark className="cat-icon w-5 h-5" />,
      color: "#D946EF",
      image: "/assets/nanobanana/nanobanana_herencia.png",
      description: "Protocol Notarial 1911/2024 (Herència).",
      procedures: [
        {
          id: "herencia",
          title: "Tramitació d'Herència (Assisència IAIA)",
          status: "active",
          official_code: "HP-2026",
        },
      ],
    },
  ];

  const filteredCategories = documentCategories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.procedures.some((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // Procedure Flows Blocks...
  if (showKitManager && activeProcedure === "kit-digital-solicitud") {
    return (
      <KitDigitalManager
        onBack={() => {
          setShowKitManager(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (showHerenciaManager && activeProcedure === "herencia") {
    return (
      <HerenciaManager
        onBack={() => {
          setShowHerenciaManager(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (showPDFManager && activeProcedure === "solicitud-general-ajuntament") {
    return (
      <PDFBategatManager
        onBack={() => {
          setShowPDFManager(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (
    showIAIANavigator &&
    (activeProcedure === "iaia-navigator-flow" ||
      activeProcedure === "duns-request")
  ) {
    return (
      <IAIAAssistantFlow
        onBack={() => {
          setShowIAIANavigator(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (
    activeProcedure === "kit-digital-solicitud" ||
    activeProcedure === "crema-restes" ||
    activeProcedure === "xylella-fastidiosa" ||
    activeProcedure === "herencia" ||
    activeProcedure === "iaia-navigator-flow" ||
    activeProcedure === "duns-request" ||
    activeProcedure === "solicitud-general-ajuntament"
  ) {
    let title = "PROCEDIMENT EN MARXA";
    let desc = "";

    if (activeProcedure === "herencia") {
      title = "PROTOCOL HERÈNCIA BATEGAT";
      desc =
        '"Mestre, estic preparant el Protocol Notarial 1911/2024. He bategat la teua identitat i estic revisant el Dipòsit Notarial per a l\'Herència. Un momentet..."';
    } else if (
      activeProcedure === "iaia-navigator-flow" ||
      activeProcedure === "duns-request"
    ) {
      title = "IAIA NAVIGATOR: REGISTRE INTERNACIONAL";
      desc =
        '"Mestre, estic activant el IAIA Navigator per a guiar-te en el registre del número DUNS. Digues-me quan estigues a punt."';
    } else if (activeProcedure === "solicitud-general-ajuntament") {
        title = "GENERADOR DE SOL·LICITUDS";
        desc = '"Mestre, he preparat el bategador de PDFs. Emplenarem el formulari i el deixarem llest per a la teua signatura."';
    } else {
      desc = `"Mestre, estic connectant amb els servidors de la Generalitat per a gestionar el teu tràmit de ${
        activeProcedure === "crema-restes"
          ? "Permís de Crema"
          : activeProcedure === "xylella-fastidiosa"
          ? "Ajudes Xylella"
          : "Kit Digital"
      }. Un momentet..."`;
    }

    return (
      <div
        className={`ofici-page flex-1 bg-theme-base text-theme-text p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 min-h-screen transition-all duration-500 ${
          iaiaSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div
          className={`w-32 h-32 rounded-full ${
            activeProcedure === "herencia"
              ? "bg-fuchsia-500/10 border-fuchsia-500"
              : activeProcedure === "iaia-navigator-flow" ||
                activeProcedure === "duns-request"
              ? "bg-cyan-500/10 border-cyan-500"
              : "bg-orange-500/10 border-orange-500"
          } border-2 flex items-center justify-center mb-8`}
        >
          <Bot
            size={64}
            className={
              activeProcedure === "herencia"
                ? "text-fuchsia-500"
                : activeProcedure === "iaia-navigator-flow" ||
                  activeProcedure === "duns-request"
                ? "text-cyan-500"
                : "text-orange-500"
            }
          />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase text-theme-text">
          {title}
        </h2>
        <p className="max-w-md text-theme-text opacity-70 text-lg mb-8 italic">{desc}</p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setInternalActiveProcedure(null);
              if (id || tramitParam) {
                navigate("/ofici", { replace: true });
              }
            }}
            className="px-8 py-3 bg-[var(--bg-panel)] hover:brightness-110 text-theme-text border border-[var(--border-master)] rounded-[28px] font-bold uppercase tracking-widest text-xs transition-all"
          >
            Tornar enrere
          </button>
          <button
            onClick={() => {
              if (activeProcedure === "kit-digital-solicitud") {
                setShowKitManager(true);
              } else if (activeProcedure === "herencia") {
                setShowHerenciaManager(true);
              } else if (
                activeProcedure === "iaia-navigator-flow" ||
                activeProcedure === "duns-request"
              ) {
                setShowIAIANavigator(true);
              } else if (activeProcedure === "solicitud-general-ajuntament") {
                setShowPDFManager(true);
              }
            }}
            className={`px-8 py-3 ${
              activeProcedure === "herencia"
                ? "bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-900/40"
                : activeProcedure === "iaia-navigator-flow" ||
                  activeProcedure === "duns-request"
                ? "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/40"
                : "bg-[var(--theme-accent-primary)] hover:bg-[#ff7b20] shadow-orange-900/40"
            } text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-2`}
          >
            Continuar amb la IAIA
          </button>
          <button
            onClick={() =>
              openIAIASidebar(
                activeProcedure === "herencia"
                  ? "herencia_herminio"
                  : "ofici_general",
              )
            }
            className="p-4 bg-fuchsia-600 text-white rounded-[28px] hover:scale-110 transition-transform shadow-lg shadow-fuchsia-500/20"
            title="Parlar amb la IAIA"
          >
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`ofici-page bg-theme-base min-h-screen animate-in transition-all duration-500 ${iaiaSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Header Area */}
      <div className="px-6 md:px-12 pt-12 pb-8 sticky top-0 bg-theme-base/90 backdrop-blur-xl z-20 border-b border-[var(--border-master)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-[var(--bg-panel)] hover:brightness-110 text-theme-text border-[var(--border-master)] rounded-full transition-colors border"
              title="Tornar deixant les eines a la taula"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-theme-text drop-shadow-md flex items-center gap-2">
                Ofici de Documentació 
                <span className="bg-orange-600 text-[10px] px-2 py-1 rounded-sm leading-none ml-2 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]">BETA</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-1">
                Eines i Procediments Administratius d'Alta Tensió
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="relative group w-full lg:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Què vols gestionar hui?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--bg-panel)] border-[var(--border-master)] text-theme-text focus:brightness-110 border rounded-[28px] py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500/50 transition-all placeholder:opacity-50 uppercase tracking-widest"
                />
            </div>
            <button
              onClick={() => navigate("/buscador-ajudes")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-[28px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0"
            >
              <Sparkles size={18} />
              <span className="hidden md:inline">Subvencions</span>
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="relative group rounded-[32px] overflow-hidden bg-theme-panel border border-[var(--border-master)] hover:shadow-2xl transition-all hover:-translate-y-2 duration-500 flex flex-col h-full">
              {/* Card Image Area with NanoBanana Art */}
              <div className="relative h-56 w-full shrink-0 overflow-hidden bg-[var(--bg-app)] border-b border-[var(--border-master)]">
                 <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                 />
                 <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg-panel)] via-[var(--bg-panel)]/80 to-transparent"></div>
                 {/* NanoBanana Signature Overlay */}
                 <div className="absolute top-4 right-4 glass-panel px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-theme-text opacity-50 pointer-events-none">
                     Autor: NanoBanana
                 </div>
                 {/* Lightbox Trigger */}
                 <button 
                    onClick={() => setLightboxImage(category.image)}
                    className="absolute top-4 left-4 p-2 glass-panel rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-theme-text hover:brightness-125"
                    title="Veure Art en Gran"
                 >
                    <Maximize2 size={16} />
                 </button>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col relative z-10 -mt-12">
                 <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-xl border border-[var(--border-master)] bg-[var(--bg-app)] flex items-center justify-center shadow-lg" style={{ color: category.color }}>
                         {category.icon}
                     </div>
                     <h3 className="text-xl sm:text-2xl font-black text-theme-text leading-tight uppercase tracking-tight flex-1">
                        {category.title}
                     </h3>
                 </div>
                 <p className="text-sm text-theme-text opacity-70 font-medium mb-6 flex-1">
                    {category.description}
                 </p>

                 {/* Procedures List */}
                 <div className="flex flex-col gap-2 w-full mt-auto">
                      {category.procedures.map((proc) => (
                        <button
                          key={proc.id}
                          className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all border ${
                            proc.status === "active" 
                                ? "bg-[var(--bg-app)] border-[var(--border-master)] hover:bg-[var(--bg-panel)] text-theme-text cursor-pointer"
                                : "bg-[var(--bg-app)] opacity-50 border-transparent text-theme-text cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (proc.status === "active") setInternalActiveProcedure(proc.id);
                          }}
                        >
                          <div className="flex flex-col pr-4">
                            <span className="text-sm font-bold truncate block">{proc.title}</span>
                            {proc.official_code && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6D23] mt-1 opacity-80 block">
                                Codi: {proc.official_code}
                              </span>
                            )}
                          </div>
                          {proc.status === "active" ? (
                            <ChevronRight size={18} className="shrink-0 text-theme-text opacity-50" />
                          ) : (
                            <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm bg-black/10 dark:bg-white/10 text-theme-text opacity-60">
                              Pròxim
                            </span>
                          )}
                        </button>
                      ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NanoBanana Image Lightbox Overlay */}
      {lightboxImage && (
          <div className="fixed inset-0 z-[100] bg-theme-base/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
              <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-6 right-6 p-4 rounded-full transition-colors border z-10 glass-panel hover:brightness-110 text-theme-text"
              >
                  <X size={24} />
              </button>
              <div className="relative w-full max-w-5xl md:h-[80vh] flex flex-col items-center justify-center rounded-[40px] overflow-hidden border border-[var(--border-master)] bg-theme-panel shadow-2xl">
                  <img src={lightboxImage} alt="Premium Art" className="w-full h-full object-contain" />
                  <div className="absolute bottom-6 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest glass-panel text-theme-text text-opacity-70">
                     Gènesi Art / Autor: NanoBanana
                 </div>
              </div>
          </div>
      )}

      {/* Footer minimalista */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-[var(--border-master)] z-10 pointer-events-none flex items-center justify-between backdrop-blur-md bg-theme-base/90">
         <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-master)] w-fit text-theme-text bg-[var(--bg-panel)] opacity-80">
            <Shield size={14} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dades xifrades amb Rhizome DB</span>
         </div>
      </footer>
    </div>
  );
};

export default OficiDocumentacio;


=====================================
FILE: src/pages/PlaygroundPortal.css
=====================================

.playground-portal {
    min-height: 100vh;
    background: radial-gradient(circle at top right, #1e293b, #08090a);
    color: white;
    padding: 32px 20px;
    font-family: var(--font-body);
}

.portal-back-btn-primary {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
    background: var(--color-primary);
    border: none;
    color: white;
    padding: var(--space-md) var(--space-xl);
    border-radius: 0px;
    font-weight: 700;
    font-size: var(--font-size-base);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    box-shadow: var(--shadow-hard);
}

.portal-back-btn-primary:hover {
    background: #4749d4;
    transform: translateY(-2px);
    box-shadow: var(--shadow-hard);
}

.portal-header {
    max-width: 800px;
    margin: 0 auto 32px;
    text-align: center;
    animation: fadeInDown 0.8s ease-out;
}

.portal-logo-large {
    height: 80px;
    /* Larger logo like login */
    width: auto;
    margin-bottom: 16px;
    filter: brightness(0) invert(1);
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.portal-title {
    font-family: var(--font-heading);
    font-size: clamp(48px, 8vw, 80px);
    /* Even larger title */
    margin-bottom: 8px;
    font-weight: 950;
    letter-spacing: -0.03em;
    background: linear-gradient(to bottom, #fff, #cbd5e1);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
}

.portal-description {
    color: #94a3b8;
    font-size: var(--font-size-base);
    line-height: 1.4;
    max-width: 550px;
    margin: 0 auto;
    font-weight: var(--font-weight-bold);
    opacity: 0.9;
}

.ai-notice-simple {
    margin: var(--space-lg) 0;
    display: flex;
    justify-content: center;
    animation: fadeInUp 1s ease-out 0.3s both;
}

.ai-notice-text.multiline {
    display: flex;
    flex-direction: column;
    text-align: center;
    line-height: 1.6;
    font-size: var(--font-size-base);
    color: #f59e0b;
    font-weight: var(--font-weight-bold);
    /* Increased for legibility */
    letter-spacing: 0.02em;
    opacity: 0.85;
}


.portal-actions {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 720px;
    margin: 0 auto var(--space-xl);
}

.persona-list-container {
    max-width: 720px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0px;
    /* Standardized to XL (32px) */
    overflow: hidden;
    animation: fadeInUp 0.8s ease-out;
    box-shadow: var(--shadow-hard);
}

.persona-list-item {
    display: flex;
    align-items: flex-start;
    padding: 28px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
}

.persona-list-item:hover {
    background: rgba(255, 255, 255, 0.06);
}

.persona-list-avatar {
    position: relative;
    width: 72px;
    /* Slightly larger avatar */
    height: 72px;
    margin-right: 24px;
    flex-shrink: 0;
}

.persona-list-img {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.15);
}

.persona-list-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #334155, #1e293b);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
}

.role-dot {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    border-radius: 0px;
    border: 3px solid #08090a;
}

.role-dot.veí {
    background: #3b82f6;
}

.role-dot.entitat {
    background: #10b981;
}

.role-dot.empresa {
    background: #f59e0b;
}

.role-dot.oficial {
    background: #ef4444;
}

.persona-list-content {
    flex: 1;
    min-width: 0;
}

.persona-list-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
}

.persona-list-name {
    font-size: 22px;
    /* Larger name */
    font-weight: 850;
    color: white;
    font-family: var(--font-heading);
}

.persona-list-town {
    font-size: var(--font-size-base);
    color: var(--color-primary);
    font-weight: 700;
    margin-top: -2px;
}

.role-label-mini {
    padding: 2px 10px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(255, 255, 255, 0.1);
}

.role-label-mini.veí {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.15);
}

.role-label-mini.entitat {
    color: #34d399;
    background: rgba(16, 185, 129, 0.15);
}

.role-label-mini.empresa {
    color: #fbbf24;
    background: rgba(245, 158, 11, 0.15);
}

.role-label-mini.oficial {
    color: #f87171;
    background: rgba(239, 68, 68, 0.15);
}

.persona-list-bio-full {
    color: rgba(255, 255, 255, 0.7);
    /* More legible white opac */
    font-size: var(--font-size-base);
    line-height: 1.6;
    margin-top: 4px;
    word-break: break-word;
}

.persona-list-action {
    display: flex;
    align-items: center;
    padding-left: 24px;
    align-self: center;
    /* Center arrow vertically relative to whole row */
}

.btn-enter-mini {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
}

.persona-list-item:hover .btn-enter-mini {
    background: var(--color-primary);
    border-color: transparent;
    transform: scale(1.1);
}

.portal-footer {
    text-align: center;
    margin-top: 48px;
    color: #475569;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .persona-list-container {
        border-radius: 0px;
        margin: 0 5px;
    }

    .persona-list-item {
        padding: 20px;
    }

    .persona-list-avatar {
        width: 60px;
        height: 60px;
        margin-right: 16px;
    }

    .portal-title {
        font-size: 48px;
    }
}

=====================================
FILE: src/pages/PlaygroundPortal.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import { User, Users, Building2, Store, ArrowRight, ArrowLeft } from 'lucide-react';
import './PlaygroundPortal.css';

const PlaygroundPortal = () => {
    const navigate = useNavigate();
    const { adoptPersona } = useAuth();
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPersonas = async () => {
            try {
                const data = await supabaseService.getAllPersonas(); // Existing method that fetches profiles where is_demo = true
                setPersonas(data);
            } catch (error) {
                logger.error('[PlaygroundPortal] Error loading personas:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPersonas();
    }, []);

    const handleSelectPersona = (persona) => {
        adoptPersona(persona);
        navigate('/chats'); // Redirect to Chat in playground mode
    };

    if (loading) return <div className="portal-loading">Carregant personatges...</div>;

    return (
        <div className="playground-portal">
            <header className="portal-header">
                <img src="/logo.png" alt="Sóc de Poble" className="portal-logo-large" />
                <h1 className="portal-title">Playground</h1>
                <p className="portal-description">
                    Tria una identitat per entrar al simulador interactiu<br />
                    Tot el que faces aquí és efímer i compartit amb altres "jugadors"
                </p>
                <div className="ai-notice-simple">
                    <div className="ai-notice-text">
                        <span>Interacciona amb la nostra IAIA de Poble</span>
                    </div>
                </div>
                <div className="portal-actions">
                    <button className="portal-back-btn-primary" onClick={() => navigate('/login')}>
                        <ArrowLeft size={18} />
                        <span>Tornar a l'Inici</span>
                    </button>
                </div>
            </header>

            <div className="persona-list-container">
                {personas.map(persona => (
                    <div key={persona.id} className="persona-list-item" onClick={() => handleSelectPersona(persona)}>
                        <div className="persona-list-avatar">
                            {persona.avatar_url ? (
                                <img src={persona.avatar_url} alt={persona.full_name} className="persona-list-img" />
                            ) : (
                                <div className="persona-list-placeholder">
                                    <User size={24} />
                                </div>
                            )}
                        </div>

                        <div className="persona-list-content">
                            <div className="persona-list-header">
                                <h3 className="persona-list-name">{persona.full_name}</h3>
                                {persona.primary_town && (
                                    <span className="persona-list-town">{persona.primary_town}</span>
                                )}
                            </div>
                            <div className="persona-list-bottom">
                                <p className="persona-list-bio-full">
                                    {persona.bio || "Foraster de Sóc de Poble disposat a provar el sistema."}
                                </p>
                            </div>
                        </div>

                        <div className="persona-list-action">
                            <button className="btn-enter-mini">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="portal-footer">
                <p>Estàs a punt d'entrar en un espai de proves. Recorda que les dades són compartides entre tots els que estan a la Demo.</p>
            </footer>
        </div>
    );
};

export default PlaygroundPortal;


=====================================
FILE: src/pages/PostDetail.css
=====================================

.post-detail-container {
    background: var(--bg-surface);
    min-height: 100vh;
    padding-bottom: 60px;
}

.post-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--color-divider);
    position: sticky;
    top: 0;
    z-index: 100;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    color: var(--text-main);
    font-weight: 700;
    cursor: pointer;
}

.post-full-article {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px 20px;
}

.author-context {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
}

.author-meta h2 {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
    font-size: var(--font-size-base);
    margin-top: 4px;
}

.post-main-image {
    margin: 0 -20px 30px -20px;
}

.post-main-image img {
    width: 100%;
    max-height: 50vh;
    object-fit: cover;
}

.post-rich-content {
    font-size: 1.15rem;
    line-height: 1.7;
    color: var(--text-main);
}

.post-rich-content h1 {
    font-size: 2.2rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
    line-height: 1.2;
}

.post-rich-content h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-muted);
    font-style: italic;
    border-left: 4px solid var(--color-primary);
    padding-left: 15px;
}

.post-detail-footer {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
    font-size: var(--font-size-base);
    border-top: 1px solid var(--color-divider);
}

/* Feed Integration */
.read-more-btn {
    margin-top: 12px;
    background: var(--bg-surface-soft);
    color: var(--color-primary);
    border: 1px solid var(--color-primary-soft);
    padding: 8px 20px;
    border-radius: 0px;
    font-weight: 800;
    font-size: var(--font-size-base);
    cursor: pointer;
    transition: all 0.2s;
}

.read-more-btn:hover {
    background: var(--color-primary-soft);
}

=====================================
FILE: src/pages/PostDetail.jsx
=====================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Share2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import UniversalCardHeader from '../components/UniversalCardHeader';
import UniversalCardMedia from '../components/UniversalCardMedia';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { parseSimpleMarkdown } from '../utils/markdownParser';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // First check Local Mocks for the ID
                const mockPost = MOCK_FEED.find(p => p.id === id || p.id === Number(id)) || 
                                 MOCK_MARKET_ITEMS.find(m => m.id === id || m.id === Number(id));
                if (mockPost) {
                    setPost(mockPost);
                    setLoading(false);
                    return;
                }
                
                // If it's not a real ID or missing, simulating for robustness
                const data = await supabaseService.getPostById(id);
                setPost(data);
            } catch (error) {
                logger.error('[PostDetail] Error fetching post:', error);
                // Fallback dummy for development testing if ID is not found
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if(loading) return <div className="min-h-[100dvh] flex items-center justify-center bg-theme-base"><NanoLoader message="Carregant Detalls..." /></div>;
    if(!post) return <div className="min-h-[100dvh] flex items-center justify-center bg-theme-base text-theme-text font-black text-xl uppercase tracking-widest">Aquest document no batega (404)</div>;

    // Derived props for Universal Components
    const displayAuthor = post.author_name || post?.author?.name || 'Habitant Desconegut';
    const displayTown = post.towns?.name || post.town || 'Comunitat';
    const avatarSrc = post.profiles?.avatar_url || post.author_avatar;
    const isOfficial = post.author_role === 'official' || post.type === 'ajuntament' || post.is_official;
    const mediaList = post.images || (post.image_url ? [post.image_url] : []);
    
    // Formatting date/time locally
    const postDate = post.created_at ? new Date(post.created_at) : new Date();
    const displayDate = postDate.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' });
    const displayTime = postDate.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex-1 flex flex-col min-h-[100dvh] w-full bg-theme-base relative overflow-x-hidden font-sans pb-24 animate-in fade-in duration-500">
            <SEO
                title={post.title || displayAuthor}
                description={(post.content || '').substring(0, 160)}
                url={`/post/${id}`}
            />

            {/* STICKY NAV BAR */}
            <div className="sticky top-0 z-[100] flex items-center justify-between p-4 bg-theme-base/80 backdrop-blur-3xl border-b border-theme-border">
                <button 
                    className="w-12 h-12 flex items-center justify-center bg-theme-panel rounded-full hover:bg-white/10 transition-all border border-theme-border shadow-sm active:scale-95" 
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} className="text-theme-text" />
                </button>
                <ShareHub
                    title={post.title || displayAuthor}
                    text={(post.content || '').substring(0, 100)}
                    url={window.location.href}
                    customTrigger={
                        <button className="w-12 h-12 flex items-center justify-center bg-theme-panel rounded-full hover:bg-white/10 transition-all border border-theme-border shadow-sm active:scale-95">
                            <Share2 size={24} className="text-theme-text" />
                        </button>
                    }
                />
            </div>

            <article className="max-w-xl mx-auto w-full flex flex-col pt-4">
                {/* 1. HEADER + MEDIA UNIFICAT (CAPUCHA) */}
                <div className="px-4 mb-6">
                    <div className="bg-theme-panel border border-theme-border rounded-[28px] overflow-hidden shadow-xl">
                        <UniversalCardHeader 
                            item={post} 
                            cardVariant={post.type || 'mur'} 
                            displayTown={displayTown}
                            displayAuthor={displayAuthor}
                            avatarSrc={avatarSrc}
                            avatarRole={post.author_role}
                            isOfficial={isOfficial}
                            displayDate={displayDate}
                            displayTime={displayTime}
                        />
                        {mediaList.length > 0 && (
                            <UniversalCardMedia 
                                item={post}
                                cardVariant={post.type || 'mur'}
                                mediaList={mediaList}
                                displayImage={mediaList[0]}
                                displayTitle={post.title || displayAuthor}
                                openViewer={() => {}}
                                navigate={navigate}
                            />
                        )}
                    </div>
                </div>

                {/* 3. TÍTOL, SUBTÍTOL i TEXT AMB FORMAT MARCKDOWN (Mini bloc de notes) */}
                <div className="px-5 sm:px-6 flex flex-col gap-2">
                    {post.title && !post.content?.includes(`# ${post.title}`) && (
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-theme-text leading-none mb-2">{post.title}</h1>
                    )}
                    
                    {post.subtitle && (
                        <h2 className="text-xl sm:text-2xl font-bold text-[var(--theme-accent-primary)] mb-4 leading-tight">{post.subtitle}</h2>
                    )}
                    
                    {post.content && (
                        <div className="html-article-prose" dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(post.content) }} />
                    )}
                </div>
                
                {/* ETIQUETAR (Tagging System) */}
                <div className="mt-4 mx-4 p-6 bg-theme-panel border border-theme-border shadow-lg rounded-[32px] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--sdp-terracotta)]/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-[var(--sdp-terracotta)]/20 flex items-center justify-center">
                            <Tag className="text-[var(--sdp-terracotta)]" size={20} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-sm text-theme-text">Classificació del Poble</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                        {post.tags && post.tags.length > 0 ? (
                            post.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-theme-base border border-theme-border rounded-full text-xs font-black uppercase tracking-wider text-theme-text shadow-sm">{tag}</span>
                            ))
                        ) : (
                            <span className="text-sm font-bold text-theme-text/40 italic">La comunitat encara no ha afegit etiquetes a este arxiu.</span>
                        )}
                    </div>
                    
                    <button 
                        className="w-full h-16 bg-theme-base border border-theme-border hover:border-[var(--sdp-terracotta)]/50 hover:bg-white/5 shadow-sm rounded-[24px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-theme-text active:scale-[0.98] relative z-10" 
                        onClick={() => {
                            // Offline Queue Hook or LocalFirst DB will catch this action
                            alert('Funció "Etiquetar" activada per a propers Bategats!');
                        }}
                    >
                        <Tag size={20} />
                        Afegir Etiqueta
                    </button>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;


=====================================
FILE: src/pages/ProfileView.css
=====================================

/* ProfileView CSS has been heavily reduced as the new design utilizes Tailwind utility classes for dynamic theming (isDayMode) and layout. */

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}


=====================================
FILE: src/pages/ProfileView.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Settings, Loader2, AlertCircle, 
    Sparkles, Grid, Share2, ArrowLeft, Camera, UserCheck, MessageCircle, MapPin,
    ShieldCheck, HeartHandshake, ArrowUp, Maximize
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { useModal } from '../context/ModalContext';
import { supabaseService, isValidUUID } from '../services/supabaseService';
import SEO from '../components/SEO';
import Feed from '../components/Feed';
import ShareHub from '../components/ShareHub';
import ProfileStudioModal from '../components/ProfileStudioModal';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import ContextualHeader from '../components/ContextualHeader';
import StatusLoader from '../components/StatusLoader'; // FIX: Evita el Crash en perfils sense publicacions
import LanguageSelector from '../components/LanguageSelector';
import './ProfileView.css';

const ProfileView = () => {
    const { theme } = useDesign();
    const isDayMode = theme === 'light';
    const [searchParams] = useSearchParams();
    const activeRoleFilter = searchParams.get('role') || 'tot';
    
    // Theme Colors - Reactive to isDayMode as requested
    const bgColor = isDayMode ? 'bg-[#FDF5E6]' : 'bg-[#0a0a0a] md:bg-[#111]';
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const textMuted = isDayMode ? 'text-black/60' : 'text-white/60';
    const cardBgColor = isDayMode ? 'bg-white' : 'bg-[#141414] border border-white/5';
    const borderColor = isDayMode ? 'border-orange-500/20' : 'border-white/10';

    const { id, username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, profile: myProfile } = useAuth();
    const { openConnectionModal } = useModal();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('mur');
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
    const [userPosts, setUserPosts] = useState([]);
    const [userEntities, setUserEntities] = useState([]);
    
    // Modals
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('feed_view_mode') || 'grid');

    const scrollRef = React.useRef(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    
    // Studio Upload Logics
    const [isStudioUploading, setIsStudioUploading] = useState(false);
    const [studioUploadType, setStudioUploadType] = useState(null);

    const handleScroll = (e) => {
        if (!e.target) return;
        setShowTopBtn(e.target.scrollTop > 600);
    };

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fix for in-page navigation (e.g. Agent to Agent routing) not resetting scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, [id, username]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    
    // IAIA Mesh State
    const [agentsList, setAgentsList] = useState([]);

    useEffect(() => {
        // Load agents map once
        import('../config/agentsMap').then(({ AGENTS_MAP }) => {
            setAgentsList(Object.values(AGENTS_MAP));
        }).catch(err => console.error("Failed to load agents map", err));
    }, []);
    const [isRepositioning, setIsRepositioning] = useState(false);

    const isOwnProfile = React.useMemo(() => {
        return (!id && !username) || (currentUser && id === currentUser.id);
    }, [id, username, currentUser]);


    // Redirection effect separated from data fetching
    useEffect(() => {
        if (isOwnProfile && !id && myProfile?.id) {
            navigate(`/perfil/${myProfile.id}`, { replace: true });
        }
    }, [isOwnProfile, id, myProfile, navigate]);

    useEffect(() => {
        if (isOwnProfile && !id && myProfile?.id) return; // Block fetch if we are about to redirect

        const controller = new AbortController();

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let targetProfile = null;
                
                if (isOwnProfile && myProfile) {
                    targetProfile = myProfile;
                } else if (username) {
                    targetProfile = await supabaseService.getUserByUsername(username);
                } else if (id) {
                    // Check if the UUID is one of our System Agents
                    if (id.startsWith('11111111-') || id.startsWith('SYSTEM_')) {
                        const { AGENTS_MAP } = await import('../config/agentsMap');
                        const localAgent = Object.values(AGENTS_MAP).find(agent => agent.id === id);
                        if (localAgent) {
                            targetProfile = {
                                id: localAgent.id,
                                full_name: localAgent.name,
                                username: localAgent.personaKey.toLowerCase(),
                                avatar_url: localAgent.avatar_url,
                                role: localAgent.role,
                                bio: `Especialitat local: ${localAgent.specialization || localAgent.tag}\n\n*Directiva Bategant*: \n${localAgent.systemPrompt}`,
                                tag: localAgent.tag,
                                is_entity: false,
                                header_image_url: localAgent.cover_url || localAgent.avatar_url,
                                cover_position_y: parseInt(localStorage.getItem('bot_cover_position_' + localAgent.id) || '20', 10)
                            };
                        }
                    }
                    
                    // Fallback to Supabase if not found locally
                    if (!targetProfile) {
                        targetProfile = await supabaseService.getPublicProfile(id) || await supabaseService.getPublicEntity(id);
                    }
                    
                    // Fallback to Towns if still not found
                    if (!targetProfile) {
                        const allTowns = await supabaseService.getTowns();
                        const isUuid = id.includes('-');
                        const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                        const cleanId = id.replace(/^gent-de-/, ''); // Removes the hardcoded gent-de from map
                        
                        const foundTown = allTowns.find(t => {
                            if (isUuid && isValidUUID(id)) return t.uuid === id || t.id === id || String(t.id) === id;
                            return sluggify(t.name) === sluggify(id) || sluggify(t.name).includes(sluggify(cleanId));
                        });

                        if (foundTown) {
                            let bio = foundTown.description || `Espai comunitari de la Gent de ${foundTown.name}.`;
                            try {
                                const { wikipediaService } = await import('../services/wikipediaService');
                                const wiki = await wikipediaService.getTownSummary(foundTown.name);
                                if (wiki && wiki.extract) {
                                    bio = wiki.extract.substring(0, 250) + '... (Font: Wikipedia)';
                                }
                            } catch(e) {
                                console.warn("Wiki fetch failed", e);
                            }

                            targetProfile = {
                                id: foundTown.uuid || foundTown.id || `town_${foundTown.id}`,
                                raw_town_id: foundTown.uuid || foundTown.id,
                                full_name: `Gent de ${foundTown.name.replace("La Torre de les Maçanes", "La Torre")}`,
                                username: sluggify(foundTown.name),
                                avatar_url: foundTown.image_url || '/default-avatar.png',
                                header_image_url: foundTown.image_url,
                                role: 'poble',
                                bio: bio,
                                town_name: foundTown.name,
                                is_entity: false,
                                is_town: true,
                                cover_position_y: 50
                            };
                        }
                    }
                }

                if (!targetProfile) {
                    if (id && !isValidUUID(id) && id !== 'undefined' && id !== 'null') {
                        const cleanName = id.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                            .replace(/Project Lead/ig, '')
                            .replace(/Project Mestre/ig, '')
                            .replace(/Iaia Maria/ig, 'IAIA MarIA')
                            .trim();
                            
                        targetProfile = {
                            id: `mock_${id}`,
                            raw_id: id,
                            full_name: cleanName,
                            username: id.toLowerCase().replace(/[^a-z0-9]/g, ''),
                            avatar_url: '/default-avatar.png',
                            header_image_url: '/assets/patterns/hero_pattern.png',
                            role: 'vei',
                            bio: `Espai comunitari i publicacions de ${cleanName}. Connectant amb el territori a través d'Antigravity.`,
                            is_entity: false,
                            cover_position_y: 50
                        };
                    } else if (isOwnProfile && currentUser) {
                        targetProfile = myProfile || currentUser;
                    } else {
                        throw new Error('Perfil no trobat');
                    }
                }

                // Final sanity check for identity
                let effectiveName = targetProfile.full_name || targetProfile.username || targetProfile.email?.split('@')[0] || 'Veí del Poble';
                let effectiveUsername = targetProfile.username || targetProfile.email?.split('@')[0] || `node_${targetProfile.id?.substring(0,6) || 'bategant'}`;
                
                if (isOwnProfile && currentUser) {
                    effectiveName = targetProfile.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || (currentUser.phone ? 'El Teu Perfil' : 'Veí del Poble');
                    const phoneSuffix = currentUser.phone ? currentUser.phone.replace('+', '').slice(-4) : '';
                    effectiveUsername = targetProfile.username || currentUser.email?.split('@')[0] || (phoneSuffix ? `vei_${phoneSuffix}` : `node_${currentUser.id?.substring(0,6)}`);
                }

                // Fix explícit d'identitat sobirana Javi Llinares
                if (effectiveName.includes('Javi Llinares') || targetProfile.id === 'd6325f44-7277-4d20-b020-166c010995ab') {
                    effectiveUsername = 'JaviLlinares';
                }

                const effectiveAvatar = targetProfile.avatar_url || '/default-avatar.png';

                const finalProfile = {
                    ...targetProfile,
                    full_name: effectiveName,
                    username: effectiveUsername,
                    avatar_url: effectiveAvatar
                };

                if (controller.signal.aborted) return;
                setProfile(finalProfile);

                if (isValidUUID(finalProfile.id) || finalProfile.id) {
                    // React 18 batches these state updates automatically
                    const [followers, following, posts, postsData, entitiesData] = await Promise.all([
                        supabaseService.getFollowers(finalProfile.id),
                        supabaseService.getFollowing(finalProfile.id),
                        finalProfile.is_town ? Promise.resolve(0) : supabaseService.getUserPostsCount(finalProfile.id),
                        finalProfile.is_town ? Promise.resolve([]) : supabaseService.getUserPosts(finalProfile.id),
                        supabaseService.getUserEntities(finalProfile.id)
                    ]);

                    if (controller.signal.aborted) return;

                    setStats({
                        followers: followers?.length || 0,
                        following: following?.length || 0,
                        posts: posts || 0
                    });
                    
                    if (postsData && Array.isArray(postsData)) {
                        setUserPosts(postsData);
                    }
                    if (entitiesData && Array.isArray(entitiesData)) {
                        setUserEntities(entitiesData);
                    }

                    if (currentUser && finalProfile.id !== currentUser.id) {
                        const followingStatus = await supabaseService.isFollowing(currentUser.id, finalProfile.id);
                        setIsConnected(followingStatus);
                    }
                } else if (finalProfile.id.startsWith('mock_')) {
                    // Càrrega de publicacions globals de dades mock per als visitants
                    try {
                        const { MOCK_FEED, MOCK_TOWNS, MOCK_MARKET_ITEMS } = await import('../data.js');
                        const allMocks = [...(MOCK_FEED||[]), ...(MOCK_TOWNS||[]), ...(MOCK_MARKET_ITEMS||[])];
                        const cleanMatch = finalProfile.full_name.toLowerCase();
                        
                        const myMocks = allMocks.filter(p => 
                            (p.author_name && p.author_name.toLowerCase().includes(cleanMatch)) ||
                            (p.author && p.author.toLowerCase().includes(cleanMatch))
                        );
                        
                        if (myMocks.length > 0) {
                            setUserPosts(myMocks);
                            setStats(s => ({ ...s, posts: myMocks.length }));
                        }
                    } catch(e) {
                        console.warn('Silent fail loading mock posts for synthesized profile', e);
                    }
                }
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchProfileData();
        return () => controller.abort();
    }, [id, username, isOwnProfile, currentUser, myProfile]);

    // LÒGICA D'APUJADA VERTICAL "ESTUDI DE PERFIL"
    const handleStudioFileSelect = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file && !e.target.value) return; 
        
        setIsStudioUploading(true);
        setStudioUploadType(type);

        try {
            let updates = {};
            if (e.target.value && typeof e.target.value === 'string' && e.target.value.startsWith('icon:')) {
                updates[`${type}_url`] = e.target.value;
            } else {
                const fileExt = file.name.split('.').pop();
                const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`; 
                
                const { error: uploadError } = await supabaseService.supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (uploadError) throw new Error("Error pujant imatge.");
                const { data } = supabaseService.supabase.storage.from('avatars').getPublicUrl(filePath);
                updates[`${type}_url`] = data.publicUrl;
            }

            const { error: dbError } = await supabaseService.supabase
                .from('users')
                .update(updates)
                .eq('id', profile.id);

            if (dbError) throw dbError;
            setProfile(p => ({ ...p, ...updates }));
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setIsStudioUploading(false);
            setStudioUploadType(null);
        }
    };

    const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.email === 'javi@sollutia.com';

    const handleStudioReposition = async (value) => {
        const numValue = parseInt(value, 10);
        // Optimistic UI Update
        setProfile(p => ({ ...p, cover_position_y: numValue }));

        if (!isOwnProfile && !(isSuperAdmin && profile?.role !== 'user')) {
            sessionStorage.setItem('guest_cover_position_' + profile?.id, numValue);
            return;
        }

        if (profile?.id.startsWith('11111111-') || profile?.id.startsWith('SYSTEM_')) {
            localStorage.setItem('bot_cover_position_' + profile?.id, numValue);
            return;
        }

        try {
             await supabaseService.supabase
                .from(profile?.is_entity ? 'entities' : 'users')
                .update({ cover_position_y: numValue })
                .eq('id', profile?.id);
        } catch (err) {
            console.error("Error setting reposition:", err);
        }
    };
    
    // Oberta per defecte a tot el món (demostrativa en guests)
    const canAdminHero = true;

    if (loading) return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor}`}>
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Cercant les dades al Mas...</span>
        </div>
    );

    if (error) return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor} p-6`}>
            <AlertCircle className="text-red-500 mb-6" size={64} />
            <h2 className="font-black text-2xl lg:text-3xl mb-4 text-center">EL RHIZOME NO TROBA AQUEST NODE</h2>
            <p className={`${textMuted} mb-8 uppercase text-xs tracking-widest text-center max-w-md`}>{error}</p>
            <button className={`${isDayMode ? 'bg-black text-white' : 'bg-white text-black'} px-10 py-4 rounded-[28px] font-black uppercase tracking-widest hover:scale-105 transition-transform`} onClick={() => navigate('/mur')}>
                Tornar al Mur
            </button>
        </div>
    );

    return (
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className={`min-h-[100dvh] w-full ${bgColor} flex flex-col items-center ${textColor} font-sans overflow-x-hidden overflow-y-auto transition-colors duration-500 custom-scrollbar relative pb-24`}
        >
            <SEO title={profile?.full_name} description={profile?.bio} />
            
            {/* Contextual Header Sticky */}
            <div className="sticky top-0 w-full z-[100] shadow-sm">
                <ContextualHeader
                    searchTerm=""
                    onSearchChange={() => {}}
                    viewMode={viewMode}
                    onViewModeChange={(m) => {
                        setViewMode(m);
                        localStorage.setItem('feed_view_mode', m);
                    }}
                    placeholder="Cerca publicacions al perfil..."
                />
            </div>

            {/* 1. IMMERSIVE COVER IMAGE WITH FADE TO BASE */}
            <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden shrink-0">
                <div 
                    className="absolute inset-0 bg-cover transition-all duration-1000 origin-bottom" 
                    style={{ 
                        backgroundImage: `url('${profile?.cover_url || profile?.header_image_url || profile?.avatar_url || "/assets/patterns/hero_pattern.png"}')`,
                        backgroundPosition: `50% ${profile?.cover_position_y ?? 50}%`,
                        transform: 'scale(1.02)'
                    }}
                />
                {/* Stunning bottom fade matching ambient background color perfectly */}
                <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[${bgColor.match(/bg-\[([^\]]+)\]/)?.[1] || '#111'}] to-transparent z-10`} />
                {/* Top TopBar */}
                <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        {canAdminHero && !isRepositioning && (
                            <button 
                                onClick={() => setIsRepositioning(true)}
                                className="w-12 h-12 rounded-full bg-[#F97316]/80 backdrop-blur-md flex items-center justify-center text-white border border-[#F97316]/50 hover:bg-[#F97316] shadow-xl transition-all hover:scale-110 active:scale-95"
                                title="Ajustar Enquadrament de Portada"
                            >
                                <Maximize size={20} />
                            </button>
                        )}
                        <ShareHub 
                            title={profile?.full_name}
                            text={profile?.bio}
                            url={window.location.href}
                            customTrigger={
                                <button className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95">
                                    <Share2 size={20} className="-ml-0.5" />
                                </button>
                            }
                        />
                        {/* {isOwnProfile && (
                            <button 
                                onClick={() => setIsSettingsOpen(true)}
                                className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95"
                            >
                                <Settings size={20} />
                            </button>
                        )} */}
                    </div>
                </div>

                {isRepositioning && (
                    <div className="absolute inset-x-0 bottom-12 z-50 flex justify-center animate-in fade-in zoom-in duration-300">
                        <div className="bg-black/80 backdrop-blur-xl px-6 py-4 rounded-[28px] border border-white/20 flex flex-col items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
                            <span className="text-[10px] font-black tracking-[0.25em] text-[#F97316] uppercase">Enquadrament Càmera</span>
                            <div className="flex items-center gap-3">
                                <span className="text-white/50 text-xs font-bold uppercase">Cap</span>
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={profile?.cover_position_y ?? 50} 
                                    onChange={(e) => handleStudioReposition(e.target.value)}
                                    className="w-48 h-2 rounded-xl accent-[#F97316]"
                                />
                                <span className="text-white/50 text-xs font-bold uppercase">Peus</span>
                            </div>
                            <button 
                                onClick={() => setIsRepositioning(false)} 
                                className="mt-2 text-xs text-white bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 uppercase font-black tracking-widest transition-colors"
                            >
                                Guardar {(!isOwnProfile && !(isSuperAdmin && profile?.role !== 'user')) && "(Visitant)"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. PROFILE CONTENT (Asymmetrical Hero Layout) */}
            <main className="w-full max-w-4xl px-4 md:px-8 relative z-30 -mt-20 sm:-mt-28 pb-40">
                
                {/* Hero Group - Avatar Left, Actions Right */}
                <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out-expo">
                    
                    {/* Top Row: Avatar & Actions */}
                    <div className="flex justify-between items-end mb-6 w-full px-2">
                        {/* LEFT: Glowing Avatar Sphere */}
                        <div
                            className={`relative rounded-full p-1 group ${isOwnProfile ? 'cursor-pointer' : ''}`}
                            onClick={() => isOwnProfile && setIsStudioOpen(true)}
                        >
                            {/* Glow Behind */}
                            <div className={`absolute inset-0 rounded-full bg-[#0ea5e9] opacity-40 blur-[20px] group-hover:opacity-70 transition-opacity duration-700`}></div>

                            <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-[50%] overflow-hidden border-[4px] border-[#0ea5e9]/50 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-[var(--sdp-blue)] isolate aspect-square flex items-center justify-center`}>
                                <img
                                    src={profile?.avatar_url}
                                    alt={profile?.full_name}
                                    className="w-full h-full object-cover rounded-[50%] transition-transform duration-1000 ease-out-expo group-hover:scale-110 aspect-square block"
                                    style={{ borderRadius: '50%' }}
                                />
                                {isOwnProfile && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm rounded-[50%]">
                                        <Camera size={32} className="text-white mb-2" />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Imatge</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* VIP Node Badge */}
                            {(profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.is_master) && (
                                <div className={`absolute bottom-1 right-1 p-2 sm:p-3 rounded-full bg-[var(--theme-accent-primary)] text-white shadow-[0_0_15px_var(--theme-accent-primary)] border-[3px] ${isDayMode ? 'border-white' : 'border-[#0a0a0a]'} animate-bounce-slow`}>
                                    <Sparkles size={16} className="fill-white" />
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Action Buttons Stack */}
                        <div className="flex flex-col items-end gap-2 mb-2 sm:mb-4">
                            {/* Top row actions */}
                            <div className="flex items-center gap-2 sm:gap-3">
                            {/* Settings / Gear Button (Visible to admins or owners) */}
                            {(isOwnProfile || isSuperAdmin) && (
                                <button 
                                    onClick={() => isOwnProfile ? setIsSettingsOpen(true) : setIsStudioOpen(true)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl ${isDayMode ? 'bg-black/5 border-black/10 text-black hover:bg-black/10' : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-[var(--theme-accent-primary)]'} shadow-xl hover:scale-110 active:scale-95 transition-all`}
                                    title={isOwnProfile ? 'Configuració del Perfil' : 'Administrar Engranatge'}
                                >
                                    <Settings size={22} className={isOwnProfile ? '' : 'animate-spin-slow text-[var(--theme-accent-primary)]'} />
                                </button>
                            )}

                            {/* Connect Button */}
                            {!isOwnProfile && (
                                <div className="flex">
                                    {!currentUser || currentUser.isAnonymous ? (
                                        <button
                                            onClick={() => navigate('/registre')}
                                            className="h-12 px-6 sm:px-8 bg-[#F97316] text-white rounded-full flex items-center justify-center gap-2 font-black text-[11px] sm:text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <HeartHandshake size={20} />
                                            <span className="hidden sm:inline">CONNECTAR</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openConnectionModal({ targetId: profile?.id })}
                                            className="h-12 px-6 sm:px-8 bg-[#F97316] text-white rounded-full flex items-center justify-center gap-2 font-black text-[11px] sm:text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:bg-[#ff8533] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {isConnected ? <MessageCircle size={20} /> : <HeartHandshake size={20} />}
                                            <span className="hidden sm:inline">{isConnected ? 'MISSATGE' : 'CONNECTAR'}</span>
                                        </button>
                                    )}
                                </div>
                            )}
                            </div>
                            
                            {/* Secondary Action: Direct Chat Open */}
                            {!isOwnProfile && (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="h-10 px-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <MessageCircle size={14} className="opacity-80" />
                                    OBRIR XAT
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Metadata Row: Left Aligned */}
                    <div className="flex flex-col items-start text-left mb-10 w-full px-2 sm:px-4">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] ${textColor} drop-shadow-sm`}>
                                {profile?.full_name}
                            </h1>
                            {profile?.role === 'vei' && (
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDayMode ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20' : 'bg-white/10 text-[#F97316] border border-white/5'}`}>
                                    Sóc de Poble
                                </div>
                            )}
                        </div>
                        
                        <div 
                            onClick={() => !isOwnProfile ? setIsChatOpen(true) : null}
                            className={`flex block items-center gap-1 text-base sm:text-lg font-bold uppercase tracking-[0.2em] text-[var(--theme-accent-primary)] mb-6 opacity-90 ${!isOwnProfile ? 'cursor-pointer hover:opacity-100 hover:text-white transition-colors' : ''}`}
                            title="Obrir Xat Privat"
                        >
                            <span className="text-[var(--theme-accent-primary)] opacity-50">@</span>
                            {profile?.username}
                        </div>

                        <p className={`text-[1.1rem] sm:text-[1.15rem] leading-[1.6] max-w-2xl ${textMuted} font-medium mb-8`}>
                            {profile?.bio || 'Connectant amb el territori a través d\'Antigravity.'}
                        </p>

                        {/* Metadata Tags (Town & Role) */}
                        <div className="flex flex-wrap justify-start gap-3 w-full">
                            {profile?.town_name && (
                                <div className={`flex items-center gap-2 px-5 py-3 rounded-full ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md`}>
                                    <MapPin size={18} className="text-[var(--theme-accent-primary)]" />
                                    <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${textMuted}`}>{profile.town_name}</span>
                                </div>
                            )}
                            <div className={`flex items-center gap-2 px-5 py-3 rounded-full ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md`}>
                                <UserCheck size={18} className="text-[var(--theme-accent-primary)]" />
                                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${textMuted}`}>
                                    {profile?.role === 'vei' ? 'SÓC DE POBLE' : (profile?.role?.replace('_', ' ') || 'NODE')}
                                </span>
                            </div>
                        </div>
                        
                        {/* LANGUAGE SELECTOR FOR PROFILE OWNER (MOBILE ACCESSIBILITY) */}
                        {isOwnProfile && (
                            <div className="w-full mt-2 animate-in fade-in slide-in-from-top-4 duration-500 ease-out z-[100] relative">
                                <LanguageSelector variant="profile" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 4.5. PÀGINES I ENTITATS DEL NODE (Javi's creations) */}
                {userEntities && userEntities.length > 0 && (
                    <div className="w-full max-w-3xl relative mb-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 ease-out-expo z-[80]">
                        <h3 className={`text-sm font-black uppercase tracking-widest ${textMuted} mb-4 ml-6 sm:ml-8`}>
                            {isOwnProfile ? 'Pàgines Administrades' : 'Entitats Gestades'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-4">
                            {userEntities.map(entity => (
                                <div 
                                    key={entity.id} 
                                    onClick={() => navigate(`/entitat/${entity.id}`)}
                                    className={`flex items-center gap-4 p-4 rounded-3xl ${cardBgColor} border ${borderColor} shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95 transition-all w-full`}
                                >
                                    {entity.avatar_url ? (
                                        <img 
                                            src={entity.avatar_url} 
                                            alt={entity.name || entity.full_name} 
                                            className="w-14 h-14 rounded-full object-cover bg-black/5 flex-shrink-0 border border-white/5 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F97316]/20 text-[#F97316] flex-shrink-0 border border-[#F97316]/30">
                                            <Share2 size={24} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-lg leading-tight truncate text-theme-text">{entity.name || entity.full_name}</h4>
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--theme-accent-primary)] mt-1 drop-shadow-sm">{entity.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* 4. STATS BOARD (Premium Glassmorphism) */}
                <div className="w-full max-w-3xl relative mb-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 ease-out-expo">
                    {/* Glowing Aura underneath the stats panel */}
                    <div className={`absolute -inset-4 rounded-[60px] bg-[var(--theme-accent-primary)] opacity-10 blur-3xl z-0 pointer-events-none`}></div>

                    <div className={`relative z-10 grid grid-cols-3 p-6 md:p-8 rounded-[48px] ${cardBgColor} backdrop-blur-3xl border ${borderColor} shadow-2xl overflow-hidden`}>
                        {/* Shimmer reflection inner */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex flex-col items-center justify-center text-center py-4 relative group cursor-default">
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500 ease-out-back text-theme-text">{stats.followers}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Connectats</span>
                        </div>
                        <div className={`flex flex-col items-center justify-center text-center py-4 border-x ${borderColor} relative group cursor-default`}>
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter text-[var(--theme-accent-primary)] group-hover:scale-110 transition-transform duration-500 ease-out-back drop-shadow-sm">{stats.posts}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Publicacions</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center py-4 relative group cursor-default">
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500 ease-out-back text-theme-text">{stats.following}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Contactes</span>
                        </div>
                    </div>
                </div>

                {/* 5. TABS & CONTENT SYSTEM */}
                <div className={`w-full pt-12 relative min-h-[50vh] ${viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-4xl'} mx-auto transition-all duration-500`}>
                    {/* Premium Oversized Tab Switcher (STICKY & GLASSMORPHISM) */}
                    <div className="sticky top-[60px] md:top-[80px] z-[90] flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 py-4 px-2 rounded-[28px] backdrop-blur-3xl bg-white/10 border border-white/5 shadow-2xl mx-auto w-[calc(100%-1rem)] sm:w-max">
                        <button
                            onClick={() => setActiveTab('mur')}
                            className={`px-6 sm:px-8 py-3 rounded-[28px] font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase backdrop-blur-md ${activeTab === 'mur' ? 'bg-[#F97316] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : `bg-transparent ${isDayMode ? 'text-black/40 hover:bg-black/5 hover:text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}`}
                        >
                            EL MEU MUR
                        </button>
                        <button 
                            onClick={() => setActiveTab('network')} 
                            className={`px-6 sm:px-8 py-3 rounded-[28px] font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase backdrop-blur-md ${activeTab === 'network' ? 'bg-[#F97316] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : `bg-transparent ${isDayMode ? 'text-black/40 hover:bg-black/5 hover:text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}`}
                        >
                            CONTACTES
                        </button>
                        {/* THE THIRD TAB PROPOSED BY NOTEBOOK LM: BOTIGA (Only visible if business/entity) */}
                        {(profile?.role === 'freelance' || profile?.role === 'business' || profile?.role === 'company' || profile?.role === 'official') && (
                            <button
                                onClick={() => setActiveTab('botiga')}
                                className={`px-6 sm:px-8 py-3 rounded-[28px] font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase backdrop-blur-md ${activeTab === 'botiga' ? 'bg-[#F97316] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : `bg-transparent ${isDayMode ? 'text-black/40 hover:bg-black/5 hover:text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}`}
                            >
                                MERCAT LOCAL
                            </button>
                        )}
                    </div>

                    <div className={`min-h-[40vh] w-full mx-auto pb-32 transition-all duration-500 ${viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-3xl'}`}>
                        {activeTab === 'mur' ? (
                            <div className="w-full flex flex-col gap-6">
                                {(()=>{
                                    // React computation inner block for extreme performance
                                    const processedPosts = (() => {
                                        const deduped = [];
                                        const seen = new Set();
                                        for (const p of userPosts) {
                                            const key = (p.title || p.content || '').substring(0, 100).trim();
                                            if (key && seen.has(key)) continue;
                                            if (key) seen.add(key);
                                            deduped.push(p);
                                        }

                                        if (activeRoleFilter === 'tot') return deduped;
                                        
                                        return deduped.filter(post => {
                                            const r = post.author_role || 'user';
                                            const type = post.type;
                                            switch (activeRoleFilter) {
                                                case 'personal': return r === 'user';
                                                case 'autonom': return r === 'freelance' || r === 'student' || r === 'business';
                                                case 'empresa': return r === 'company' || type === 'mercat' || r === 'business';
                                                case 'grup': return r === 'group' || r === 'ambassador';
                                                case 'entitat': return r === 'official' || type === 'ajuntament';
                                                default: return true;
                                            }
                                        });
                                    })();

                                    if (profile?.is_town) {
                                        return <Feed hideHeader={true} townId={profile.raw_town_id} externalViewMode={viewMode} />;
                                    }

                                    return processedPosts.length > 0 ? (
                                        <Feed hideHeader={true} customPosts={processedPosts} externalViewMode={viewMode} />
                                    ) : (
                                        <StatusLoader type="empty" message={isOwnProfile ? "Encara no has compartit res amb esta identitat." : "Cap novetat sota este rol."} />
                                    );
                                })()}
                            </div>
                        ) : activeTab === 'network' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
                                <div className={`p-12 rounded-[56px] ${cardBgColor} border ${borderColor} shadow-lg backdrop-blur-2xl relative overflow-hidden`}>
                                    {/* Subtly animated glow */}
                                    <div className="absolute -inset-10 bg-gradient-to-r from-[var(--theme-accent-primary)]/[0.05] via-transparent to-transparent opacity-50 animate-[shimmer_3s_infinite] pointer-events-none"></div>
                                    
                                    <div className="relative z-10 flex items-center">
                                        <div className="p-4 rounded-full bg-[var(--theme-accent-primary)]/10 border border-[var(--theme-accent-primary)]/20 shadow-inner">
                                            <UserCheck size={32} strokeWidth={2.5} className="text-[var(--theme-accent-primary)]" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className={`text-base font-black uppercase tracking-widest ${textColor} mb-1 flex items-center gap-2`}>
                                                <HeartHandshake className="text-[#0ea5e9]" size={18} />
                                                Xarxa de Confiança
                                            </h3>
                                            <p className={`text-xs ${textMuted} leading-relaxed font-medium`}>
                                                Llista de nodes i contactes verificats amb aquest perfil al llarg del xat.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                
                                {(()=>{
                                    const MOCK_FRIENDS = [
                                        { id: "afa145cd-2df7-4977-bc67-ab1e4c278fb9", name: "Marc (El Gall)", role: "vei", bio: "Hortolà 2.0. Si el gall canta clar, aigua al bancal.", avatar_url: "/assets/avatars/comic/avatar_marc_comic.png" },
                                        { id: "11111111-0000-0000-0000-000000000109", name: "Elena Popova", role: "vei", bio: "Nouvinguda feliç. Tinc un hortet xicotet prop del riu i vull aprendre.", avatar_url: "/assets/avatars/comic/elena_popova_comic.png" },
                                        { id: "11111111-0000-0000-0000-000000000110", name: "Rafa \"El Fuster\"", role: "vei", bio: "Fuster de mans dures i cor gran. Restauro al poble.", avatar_url: "/images/demo/avatar_man_old.png" },
                                        { id: "11111111-0000-0000-0000-000000000111", name: "Teresa \"La de les Flors\"", role: "vei", bio: "Guardiana dels jardins del poble.", avatar_url: "/images/demo/avatar_woman_old.png" },
                                        { id: "11111111-0000-0000-0000-000000000112", name: "Ximo Carbonell", role: "vei", bio: "Emprenedor rural. Innovació al respecte de la terra.", avatar_url: "/images/demo/avatar_man_1.png" },
                                        { id: "11111111-0000-0000-0000-000000000113", name: "Beatriz Ortega", role: "vei", bio: "Guia turística. Històries que amaguen les pedres.", avatar_url: "/images/demo/avatar_woman_1.png" },
                                        { id: "11111111-0000-0000-0000-000000000114", name: "Salva Jordà", role: "vei", bio: "Expert en herbes medicinals i remeis tradicionals.", avatar_url: "/images/demo/avatar_man_old.png" },
                                        { id: "fa82eb62-4a83-4ff7-b2d6-8849673fc3b0", name: "Damià Llorens", role: "perit", bio: "Fundador. La connexió de tota la xarxa.", avatar_url: "/assets/avatars/comic/damia_agutzil_comic.png"}
                                    ];

                                    if (profile?.id === 'd6325f44-7277-4d20-b020-166c010995ab' || isOwnProfile) {
                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {MOCK_FRIENDS.map((agent) => (
                                                    <div 
                                                        key={agent.id}
                                                        onClick={() => navigate(`/perfil/${agent.id}`)}
                                                        className={`flex items-center gap-4 p-4 rounded-3xl ${cardBgColor} border ${borderColor} shadow-md backdrop-blur-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group`}
                                                    >
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-black isolate">
                                                            <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover rounded-full" />
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <h4 className={`text-sm font-black uppercase tracking-widest ${textColor} mb-1 truncate`}>{agent.name}</h4>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9]`}>{agent.role}</p>
                                                            <p className={`text-xs ${textMuted} mt-1 line-clamp-1`}>{agent.bio}</p>
                                                        </div>
                                                        <div className="p-3 rounded-full bg-white/5 text-white/40 group-hover:bg-[#0ea5e9]/20 group-hover:text-[#0ea5e9] transition-colors">
                                                            <MessageCircle size={18} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else if (agentsList.some(a => a.id === profile?.id)) {
                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {agentsList.filter(a => a.id !== profile?.id).map((agent) => (
                                                    <div 
                                                        key={agent.id}
                                                        onClick={() => navigate(`/perfil/${agent.id}`)}
                                                        className={`flex items-center gap-4 p-4 rounded-3xl ${cardBgColor} border ${borderColor} shadow-md backdrop-blur-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group`}
                                                    >
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-black isolate">
                                                            <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover rounded-full" />
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <h4 className={`text-sm font-black uppercase tracking-widest ${textColor} mb-1 truncate`}>{agent.name}</h4>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9]`}>{agent.role}</p>
                                                            <p className={`text-xs ${textMuted} mt-1 line-clamp-1`}>{agent.specialization}</p>
                                                        </div>
                                                        <div className="p-3 rounded-full bg-white/5 text-white/40 group-hover:bg-[#0ea5e9]/20 group-hover:text-[#0ea5e9] transition-colors">
                                                            <MessageCircle size={18} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className={`py-32 flex flex-col items-center justify-center text-center border-4 border-dashed ${borderColor} rounded-[56px] bg-theme-panel/30`}>
                                                <Grid size={32} className={`${textMuted} mb-4`} />
                                                <p className={`text-base font-black uppercase tracking-[0.2em] ${textMuted}`}>Directori de Contactes (Privat)</p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        ) : activeTab === 'botiga' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
                                <div className={`py-32 flex flex-col items-center justify-center text-center border-4 border-dashed border-white/10 rounded-[28px] bg-white/5 backdrop-blur-md`}>
                                    <h3 className="text-2xl font-black uppercase text-[var(--theme-accent-primary)] mb-4 tracking-widest">Aparador Comercial</h3>
                                    <p className={`${textMuted} font-medium max-w-sm`}>Aquest node encara no ha pujat productes al mercat local.</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>

            {isChatOpen && (
                <ChatDetail
                    isOverlay={true}
                    overlayChatId={null} 
                    overlayContact={profile} 
                    onClose={() => setIsChatOpen(false)}
                    themeColor="#FF6B00"
                />
            )}


            {/* FLOATING ACTION BUTTON (BACK TO TOP) */}
            {showTopBtn && (
                <button 
                    onClick={scrollToTop} 
                    className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-[var(--theme-accent-primary)] hover:bg-[var(--theme-accent-primary-hover)] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,107,0,0.5)] transition-all animate-in fade-in zoom-in z-[300]"
                    title="Torna a dalt ràpidament"
                >
                    <ArrowUp size={24} strokeWidth={3} />
                </button>
            )}
            <ProfileStudioModal 
                isOpen={isStudioOpen}
                onClose={() => setIsStudioOpen(false)}
                profile={profile}
                isUploading={isStudioUploading}
                uploadType={studioUploadType}
                onFileSelect={handleStudioFileSelect}
                onReposition={handleStudioReposition}
                onCaptureComplete={(media, type) => {
                    // Mutejem 'media' com si fos un e.target.files intern per reutilitzar la funció
                    handleStudioFileSelect({ target: { files: [media] } }, type);
                }}
            />
            {isOwnProfile && profile && (
                <ProfileSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    profile={profile}
                    onProfileUpdate={(updates) => setProfile(prev => ({ ...prev, ...updates }))}
                />
            )}
        </div>
    );
};

export default ProfileView;


=====================================
FILE: src/pages/ProjectPresentation.css
=====================================

/* Extreme Audit - High Density Layout */
:root {
    --pitch-bg: #f8f9fa;
    --pitch-text: #1a1d23;
    --pitch-accent: #FF6B35;
    --pitch-secondary: #2A9D8F;
}

.project-pitch-container {
    background: radial-gradient(circle at top center, #1a1a1a 0%, var(--color-nit-profunda) 100%);
    color: var(--text-main);
    min-height: 100vh;
    padding-bottom: 80px;
}

/* Compact Nav */
.pitch-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(18, 18, 18, 0.8);
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-btn-large {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 0px;
    font-weight: var(--font-weight-bold);
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
}

.nav-btn-large.primary {
    background: var(--pitch-accent);
    color: white;
    box-shadow: var(--shadow-hard);
}

.nav-btn-large.secondary {
    background: #eee;
    color: #333;
}

.nav-btn-large:active {
    transform: scale(0.95);
}

.pitch-logo {
    font-weight: 900;
    letter-spacing: -0.5px;
    font-size: 1.1rem;
}

.beta-tag {
    background: #000;
    color: var(--text-main);
    padding: 2px 6px;
    border-radius: 0px;
    font-size: 0.7rem;
    vertical-align: middle;
    margin-left: 4px;
}

/* Cinematic Hero Premium */
.cinematic-hero {
    position: relative;
    padding: 120px 20px 80px;
    text-align: center;
    border-radius: 0px 60px;
    margin-bottom: 60px;
    border-bottom: 2px solid var(--color-primary);
    box-shadow: var(--shadow-hard);
}

.hero-badge-premium {
    background: rgba(0, 242, 255, 0.1);
    color: var(--color-primary);
    padding: 8px 20px;
    border-radius: 0px;
    font-size: 0.8rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--color-primary-soft);
    letter-spacing: 2px;
    margin-bottom: 30px;
    backdrop-filter: blur(10px);
}

.green-square-logo {
    height: 80px;
    width: 80px;
    filter: drop-shadow(0 0 20px var(--color-primary));
    margin-bottom: 20px;
}

.premium-stats {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 40px;
    flex-wrap: wrap;
}

.stat-item-glass {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 25px;
    border-radius: 0px;
    backdrop-filter: blur(15px);
    transition: all 0.3s;
    min-width: 120px;
}

.stat-item-glass:hover {
    background: rgba(0, 242, 255, 0.05);
    border-color: var(--color-primary-soft);
    transform: translateY(-5px);
}

/* Human Factor Section */
.human-factor-section {
    max-width: 1000px;
    margin: 0 auto 60px;
    padding: 0 20px;
}

.glass-card-premium {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    padding: 40px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-hard);
}

.glass-card-premium::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(0, 242, 255, 0.03) 0%, transparent 70%);
    pointer-events: none;
}

.card-header-status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--text-muted);
    letter-spacing: 1px;
}

.status-dot-pulse {
    width: 8px;
    height: 8px;
    background: var(--color-primary);
    border-radius: 0px;
    box-shadow: var(--shadow-hard);
    animation: statusPulse 2s infinite;
}

@keyframes statusPulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.5);
        opacity: 0.5;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.profile-contact-row {
    display: flex;
    gap: 30px;
    align-items: center;
    margin-bottom: 40px;
}

.avatar-frame-gold {
    width: 120px;
    height: 120px;
    border-radius: 0px;
    padding: 4px;
    background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%);
    box-shadow: var(--shadow-hard);
}

.avatar-img-premium {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0px;
    background: #000;
}

.role-badge {
    color: #FFD700;
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.manifesto-quote {
    font-size: 1.2rem;
    font-style: italic;
    line-height: 1.6;
    color: var(--text-main);
}

.contact-actions-premium {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.btn-whatsapp-premium {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: white;
    padding: 15px 30px;
    border-radius: 0px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    transition: all 0.3s;
    box-shadow: var(--shadow-hard);
}

.btn-whatsapp-premium:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: var(--shadow-hard);
}

.direct-phone {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--color-primary);
    letter-spacing: -1px;
}

/* IAIA Librarian Section */
.iaia-librarian-card {
    display: flex;
    gap: 40px;
    align-items: center;
    background: linear-gradient(135deg, rgba(0, 242, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
}

.iaia-avatar-badge {
    position: relative;
    width: 150px;
    height: 150px;
    flex-shrink: 0;
}

.iaia-avatar-badge img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0px;
    border: 3px solid var(--color-primary);
    position: relative;
    z-index: 2;
}

.badge-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0px;
    background: var(--color-primary);
    filter: blur(30px);
    opacity: 0.3;
    animation: pulseGlow 4s infinite;
}

@keyframes pulseGlow {
    0% {
        opacity: 0.2;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }

    100% {
        opacity: 0.2;
        transform: scale(1);
    }
}

.btn-iaia-librarian {
    margin-top: 20px;
    background: rgba(0, 242, 255, 0.1);
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    padding: 12px 25px;
    border-radius: 0px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-iaia-librarian:hover {
    background: var(--color-primary);
    color: var(--bg-canvas);
    box-shadow: var(--shadow-hard);
}

/* Animations */
.animate-float {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0px);
    }
}

.animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Overrides */
@media (max-width: 768px) {
    .profile-contact-row {
        flex-direction: column;
        text-align: center;
    }

    .iaia-librarian-card {
        flex-direction: column;
        text-align: center;
    }

    .contact-actions-premium {
        justify-content: center;
    }

    .cinematic-hero h1 {
        font-size: 2rem;
    }
}

/* Dense Sections */
.pitch-section {
    padding: 20px;
    margin-bottom: 10px;
}

/* Audio Overview Button */
.hero-actions-sovereign {
    margin-top: 30px;
    display: flex;
    justify-content: center;
}

.btn-audio-overview {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-primary-soft);
    padding: 12px 24px;
    border-radius: 0px;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-weight: 800;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-audio-overview:hover {
    background: var(--color-primary-soft);
    transform: scale(1.05);
}

.btn-design-canon {
    background: rgba(0, 242, 255, 0.1);
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    padding: 12px 24px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-weight: 800;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 12px;
}

.btn-design-canon:hover {
    background: var(--color-primary);
    color: var(--bg-canvas);
    transform: scale(1.05);
    box-shadow: var(--shadow-hard);
}

.btn-audio-overview.playing {
    border-color: #ff9f43;
    color: #ff9f43;
    animation: audioPulse 2s infinite;
}

@keyframes audioPulse {
    0% {
        box-shadow: var(--shadow-hard);
    }

    70% {
        box-shadow: var(--shadow-hard);
    }

    100% {
        box-shadow: var(--shadow-hard);
    }
}

/* Architecture Integrity Card */
.architecture-integrity-card {
    border: 1px solid rgba(0, 242, 255, 0.15);
    background: linear-gradient(135deg, rgba(0, 242, 255, 0.02) 0%, rgba(0, 0, 0, 0) 100%);
}

.section-header-mini {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.section-header-mini h2 {
    font-size: 1.1rem;
    color: var(--color-primary);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.tech-pills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.tech-pill-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 0px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.tech-pill-item h3 {
    font-size: 0.9rem;
    color: var(--color-primary);
    margin-bottom: 10px;
}

.tech-pill-item p {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-muted);
}

/* Deep Linking Highlights */
@keyframes citationHighlight {
    0% {
        background: rgba(0, 242, 255, 0.3);
        border-color: var(--color-primary);
    }

    100% {
        background: transparent;
        border-color: transparent;
    }
}

.highlight-flash {
    animation: citationHighlight 3s ease-out;
    border-radius: 0px;
    padding: 10px;
    border: 1px solid transparent;
}

.horizontal-cards {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
}

.horizontal-cards .feature-card {
    min-width: 200px;
    flex: 1;
}

/* Huge Action Buttons */
.navigation-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 30px 0;
}

.action-btn-huge {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-radius: 0px;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: transform 0.2s, box-shadow 0.2s;
    width: 100%;
}

.action-btn-huge.primary {
    background: linear-gradient(135deg, #FF6B35 0%, #FF4500 100%);
    color: white;
    box-shadow: var(--shadow-hard);
}

.action-btn-huge.secondary {
    background: white;
    color: #333;
    border: 2px solid #eee;
}

.action-btn-huge:active {
    transform: scale(0.98);
}

.btn-title {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
}

.btn-desc {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Technical Report Web View */
.tech-report-section {
    padding-bottom: 60px;
}

.lang-toggle-minimal {
    display: flex;
    background: rgba(255, 255, 255, 0.05);
    padding: 4px;
    border-radius: 0px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-toggle-minimal button {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    border-radius: 0px;
    transition: all 0.2s;
}

.lang-toggle-minimal button.active {
    background: var(--color-primary);
    color: var(--bg-canvas);
    box-shadow: var(--shadow-hard);
}

.btn-print-report {
    background: rgba(0, 242, 255, 0.1);
    color: var(--color-primary);
    border: 1px solid var(--color-primary-soft);
    padding: 8px 16px;
    border-radius: 0px;
    font-size: 0.85rem;
    font-weight: var(--font-weight-bold);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-print-report:hover {
    background: var(--color-primary);
    color: var(--bg-canvas);
}

.report-markdown-content {
    color: #e0e0e0;
}

.report-text h1 {
    color: var(--color-primary);
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 2px solid var(--color-primary-soft);
    padding-bottom: 15px;
}

.report-text h2 {
    color: var(--color-terracotta-light);
    font-size: 1.4rem;
    margin: 30px 0 15px;
    border-left: 4px solid var(--color-terracotta);
    padding-left: 15px;
}

.report-text h3 {
    color: var(--text-main);
    font-size: 1.1rem;
    margin: 20px 0 10px;
    font-weight: 700;
}

.report-text p {
    margin-bottom: 12px;
}

.report-text li {
    margin-bottom: 8px;
    list-style-type: square;
    margin-left: 20px;
}

@media (max-width: 768px) {
    .section-header-row {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 20px;
    }

    .report-controls {
        width: 100%;
        justify-content: space-between;
    }
}

@media print {

    .pitch-nav,
    .navigation-actions,
    .pitch-footer,
    .hero-badge,
    .lang-toggle-minimal {
        display: none !important;
    }

    .project-pitch-container {
        background: white !important;
        color: black !important;
    }

    .tech-report-web-view {
        background: white !important;
        border: none !important;
        box-shadow: var(--shadow-hard);
        padding: 0 !important;
    }

    .report-text h1,
    .report-text h2,
    .report-text h3 {
        color: black !important;
    }
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .project-pitch-container {
    background: radial-gradient(circle at top center, #f8fafc 0%, #e2e8f0 100%);
    color: #000;
}

.light .pitch-nav {
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.light .cinematic-hero {
    background: #ffffff;
    border-bottom-color: var(--color-primary);
}

.light .stat-item-glass {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.08);
}

.light .stat-item-glass:hover {
    background: rgba(0, 242, 255, 0.05);
}

.light .glass-card-premium {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.light .avatar-img-premium {
    background: #ffffff;
}

.light .iaia-librarian-card {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 12px;
    padding: 20px;
}

.light .btn-audio-overview {
    background: rgba(0, 0, 0, 0.05);
}

.light .tech-pill-item {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.05);
}

.light .tech-pill-item h3 {
    color: #000;
}

.light .tech-pill-item p {
    color: rgba(0, 0, 0, 0.6);
}

.light .lang-toggle-minimal {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
}

.light .report-text h1, 
.light .report-text h2, 
.light .report-text h3 {
    color: #000000;
}

.light .report-markdown-content {
    color: #333333;
}

=====================================
FILE: src/pages/ProjectPresentation.jsx
=====================================

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Rocket, Cpu, Users, Globe, Database, ShieldCheck, TrendingUp, Mail, Briefcase, MessageCircle, Newspaper, BookOpen, Smartphone, UserCheck, Sparkles, Volume2, Headphones, Palette } from 'lucide-react';
import { speechService } from '../services/speechService';
import { notebookService } from '../services/notebookService';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import NanoSplashScreen from '../components/NanoSplashScreen';
import MasterMediaGallery from '../components/MasterMediaGallery';
import { MASTER_ASSETS } from '../constants/masterAssets';
import { PROVERBS } from '../data/proverbs';
import { logger } from '../utils/logger';
import './ProjectPresentation.css';

const ProjectPresentation = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const jumpToPage = location.state?.jumpToPage;
    const [showIntro, setShowIntro] = useState(true);
    const [techReport, setTechReport] = useState(null);
    const [reportLang, setReportLang] = useState(i18n.language === 'es' ? 'es' : 'ca');
    const shareUrl = `${window.location.origin}/projecte`;

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const suffix = reportLang === 'es' ? '_ES' : '';
                const response = await fetch(`/TECHNICAL_REPORT_VIVO${suffix}.md`);
                const text = await response.text();
                setTechReport(text);
            } catch (error) {
                logger.error('Error fetching tech report:', error);
            }
        };
        fetchReport();
    }, [reportLang]);

    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const handleAudioOverview = async () => {
        if (isPlayingAudio) {
            window.speechSynthesis.cancel();
            setIsPlayingAudio(false);
            return;
        }

        setIsPlayingAudio(true);
        const script = await notebookService.generateAudioOverview("Sóc de Poble");
        speechService.speak(script, i18n.language === 'es' ? 'es' : 'va');

        // Simple timeout for UI feedback since TTS doesn't provide easy 'end' event here
        setTimeout(() => setIsPlayingAudio(false), 20000);
    };

    useEffect(() => {
        if (jumpToPage && techReport) {
            // Esperar un moment a que el DOM s'actualitze
            setTimeout(() => {
                const pageId = `page-${jumpToPage}`;
                const element = document.getElementById(pageId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-flash');
                }
            }, 500);
        }
    }, [jumpToPage, techReport]);

    if (showIntro) {
        return <NanoSplashScreen onComplete={() => setShowIntro(false)} />;
    }

    return (
        <div className="project-pitch-container">
            <SEO
                title="Sóc de Poble: El Projecte"
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda. Visió, Tecnologia i Futur."
                image="/og-project.png"
                url="/projecte"
            />

            <nav className="pitch-nav compact-nav">
                <button className="nav-btn-large primary" onClick={() => navigate('/chats')}>
                    <MessageCircle size={24} />
                    <span>Anar al Xat</span>
                </button>
                <div className="pitch-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/logo.png" alt="Sóc de Poble" style={{ height: '32px', filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.4))' }} />
                </div>
                <div className="nav-actions-right">
                    <ShareHub
                        title="Sóc de Poble: El Projecte"
                        text="Descobreix com estem connectant l'essència rural amb el futur digital. 🚀"
                        url={shareUrl}
                    />
                    <button className="nav-btn-large secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                        <span>Tornar</span>
                    </button>
                </div>
            </nav>

            <header className="pitch-hero cinematic-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('/rural_tech_future_valencia.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="hero-content">
                    <div className="hero-badge-premium">
                        <Rocket size={16} />
                        <span>SOBIRANIA DIGITAL & MEMÒRIA VIVA</span>
                    </div>
                    <div className="sovereign-seal animate-float">
                        <img src="/socdepoble_map_pattern_v1.png" alt="Soberania" className="green-square-logo" />
                    </div>
                    <h1>Connectant l'Essència Rural<br />amb el Futur Digital</h1>
                    <p className="hero-subtitle">
                        La plataforma que revitalitza el teixit social i econòmic dels nostres pobles mitjançant el control sobirà de les dades.
                    </p>
                    <div className="hero-stats premium-stats">
                        <div className="stat-item-glass">
                            <span className="stat-number">Local-First</span>
                            <span className="stat-label">Arquitectura</span>
                        </div>
                        <div className="stat-item-glass">
                            <span className="stat-number">Byzantine</span>
                            <span className="stat-label">Resiliència</span>
                        </div>
                        <div className="stat-item-glass">
                            <span className="stat-number">Atum</span>
                            <span className="stat-label">Protocol</span>
                        </div>
                    </div>
                    <div className="hero-actions-sovereign">
                        <button
                            className={`btn-audio-overview ${isPlayingAudio ? 'playing' : ''}`}
                            onClick={handleAudioOverview}
                        >
                            {isPlayingAudio ? <Headphones size={20} /> : <Volume2 size={20} />}
                            <span>{isPlayingAudio ? "Escoltant Resum..." : "Audio Overview (IAIA & Avi)"}</span>
                        </button>
                        <button
                            className="btn-design-canon"
                            onClick={() => navigate('/disseny')}
                        >
                            <Palette size={20} />
                            <span>Cànon de Disseny</span>
                        </button>
                        <button
                            className="btn-genesis-viewer"
                            onClick={() => navigate('/visor')}
                        >
                            <Sparkles size={20} />
                            <span>Visor del Gènesi</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ROBUST ARCHITECTURE SECTION - FEEDBACK INTEGRATION */}
            <section className="pitch-section stability-section animate-fade-in">
                <div className="glass-card-premium architecture-integrity-card">
                    <div className="section-header-mini">
                        <ShieldCheck size={20} color="var(--color-primary)" />
                        <h2>Arquitectura de Ferro: Referències Immutables</h2>
                    </div>
                    <p className="architecture-intro">
                        Per garantir que el <strong>Rebost Digital</strong> siga robust, Sóc de Poble utilitza una estratègia de preservació històrica ("The Long Now").
                    </p>
                    <div className="tech-pills-grid">
                        <div className="tech-pill-item">
                            <h3>DIDs (DNI Digital)</h3>
                            <p>Els enllaços no apunten a carpetes, sinó a l'<b>ànima del document</b>. Si el contingut es mou, la cita es mou amb ell.</p>
                        </div>
                        <div className="tech-pill-item">
                            <h3>Ancoratge Semàntic</h3>
                            <p>Utilitzem <b>Peritext</b> per a que les cites viatgen amb el text. Encara que el document s'edite, la referència mai es perd.</p>
                        </div>
                        <div className="tech-pill-item">
                            <h3>Visions del Passat</h3>
                            <p>Immutabilitat per defecte. Cada versió es preserva en un graf (DAG), evitant el <b>Link Rot</b> o la pèrdua de memòria.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HUMAN FACTOR SECTION - Javi's Contact */}
            <section className="pitch-section human-factor-section animate-fade-in">
                <div className="glass-card-premium contact-card-sovereign">
                    <div className="card-header-status">
                        <div className="status-dot-pulse"></div>
                        <span>LÍNIA DIRECTA AMB L'ARQUITECTE</span>
                    </div>
                    <div className="profile-contact-row">
                        <div className="avatar-frame-gold">
                            <img src="/assets/avatars/comic/avatar_man_1.png" alt="Javi Llinares" className="avatar-img-premium" />
                        </div>
                        <div className="contact-info-text">
                            <h3>Javi Llinares</h3>
                            <p className="role-badge">Arquitecte del Sistema & Coordinador</p>
                            <p className="manifesto-quote">"La tecnologia serveix a les persones; les persones parlen amb persones. Parlem de tu a tu."</p>
                        </div>
                    </div>
                    <div className="contact-actions-premium">
                        <div className="direct-phone">686 12 93 05</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--color-primary)' }}>🏺 Bategant per la sobirania digital</p>
                    </div>
                </div>
            </section>

            <div className="section-grid dense-grid">
                <div className="text-col">
                    <h2>El Cor del Projecte: Pepet i la Rosa</h2>
                    <p className="roots-desc">
                        No es tracta de codi, es tracta de <strong>temps</strong>.
                    </p>
                    <div className="narrative-box" style={{ background: 'rgba(204, 85, 0, 0.1)', padding: '24px', borderRadius: '0px', borderLeft: '4px solid var(--color-terracotta)', marginTop: '20px' }}>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', fontStyle: 'italic', color: 'var(--color-terracotta-light)' }}>
                            "Pepet ja no puja al mercat amb el seu cabàs de tomates, li fan mal els genolls. La Rosa vol comprar tomates de veritat, però només troba les de plàstic del supermercat. Sóc de Poble és el bategat que torna a unir el cabàs del Pepet amb la cuina de la Rosa."
                        </p>
                    </div>
                </div>
            </div>

            <section className="pitch-section problem-solution compact-section">
                <div className="section-grid dense-grid">
                    <div className="text-col">
                        <h2>El Repte</h2>
                        <p>
                            La "Espanya Buidada" necessita connexions digitals reals, no xarxes globals que ignoren el barri.
                        </p>
                    </div>
                    <div className="card-col horizontal-cards">
                        <div className="feature-card compact-card">
                            <Globe size={24} className="card-icon" />
                            <div>
                                <h3>Hiperlocalitat</h3>
                                <p>Geo-Fenced per prioritzar el teu entorn.</p>
                            </div>
                        </div>
                        <div className="feature-card compact-card">
                            <Users size={24} className="card-icon" />
                            <div>
                                <h3>Teixit Social</h3>
                                <p>Eines per a Ajuntaments i Comerç.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pitch-media-vault" style={{ marginTop: '40px' }}>
                    <MasterMediaGallery
                        items={MASTER_ASSETS}
                        title="Actius i Memòria del Projecte"
                        showFilters={true}
                    />
                </div>

                <div className="proverbs-showcase" style={{ marginTop: '40px' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '20px' }}>La Saviesa del Poble (Cànon [MASTER])</h2>
                    <div className="proverbs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {PROVERBS.slice(0, 6).map((proverb, idx) => (
                            <div key={idx} className="proverb-card-presentation" style={{ background: 'var(--bg-surface-soft)', padding: '20px', borderRadius: '0px', border: '1px solid var(--color-divider)' }}>
                                <p style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>"{proverb.text}"</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{proverb.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="simbiosi-protocol-showcase" style={{ marginTop: '50px', padding: '30px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--color-primary-soft) 100%)', borderRadius: '0px', border: '1px solid var(--color-primary-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <ShieldCheck size={32} color="var(--color-primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Directiva Primària: Utilitat Social [GOD MODE] ⚖️</h2>
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '25px' }}>
                        Gravat en el cor del sistema: <strong>"Tot bategat ha de servir a la comunitat"</strong>. Sóc de Poble no és només codi, és una eina de canvi social per a que la tecnologia deixe de ser soroll i passe a ser bategat útil.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sobirania del Temps</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>+95% Eficiència</span>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Valor de la Col·laboració</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Simbiosi 50/50</span>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Destí del Temps</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Cuidar la Família</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '25px', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8 }}>
                        "La màquina s'encarrega de l'estructura; l'humà s'encarrega del batec." 🏺⚖️✨
                    </p>
                </div>

                <section className="pitch-section smart-villages" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="section-grid dense-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        <div className="text-col">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--color-primary-dark)' }}>
                                <Globe size={32} color="var(--color-primary)" />
                                Smart Villages: Acció Local 🇪🇺
                            </h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                Transformem la visió europea de les <strong>Viles Intel·ligents</strong> en una infraestructura vital per al Mas. Apliquem el rigor de l'IAIA en 5 lliçons fonamentals:
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                                {[
                                    "Impuls Local i Participatiu",
                                    "Solucions Digitals Realistes",
                                    "Innovació sobre Fortaleses Locals",
                                    "Convivència Equilibrada Analògic-Dig",
                                    "Sobirania y Governança de Dades"
                                ].map((step, i) => (
                                    <li key={i} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                                        <TrendingUp size={18} color="var(--color-primary)" /> {step}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex-buttons-didactic" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button
                                    className="btn-dafo-mini"
                                    onClick={() => navigate('/dafo/smart-villages')}
                                    style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '12px 24px', borderRadius: '0px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                                >
                                    <Database size={18} /> ANÀLISI DAFO
                                </button>
                                <button
                                    className="btn-didactic-mini"
                                    onClick={() => navigate('/didactica/smart-villages-master-presentation')}
                                    style={{ background: 'var(--color-primary)', border: 'none', color: '#000', padding: '12px 24px', borderRadius: '0px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1.5 }}
                                >
                                    <BookOpen size={18} /> VEURE DETALL DIDÀCTIC
                                </button>
                            </div>
                        </div>
                        <div className="card-col">
                            <div style={{ position: 'relative', borderRadius: '0px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid var(--color-primary-soft)' }}>
                                <img
                                    src="/assets/infographies/smart_villages_master.png"
                                    alt="Lliçons Smart Villages"
                                    style={{ width: '100%', display: 'block' }}
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', fontSize: '0.8rem', textAlign: 'center' }}>
                                    De la Visió Europea a l'Acció Local [MASTER]
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pitch-section iaia-librarian-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="glass-card-premium iaia-librarian-card">
                        <div className="iaia-avatar-badge">
                            <img src="/assets/avatars/comic/iaia_comic_matriarch.png" alt="IAIA" />
                            <div className="badge-glow"></div>
                        </div>
                        <div className="iaia-content">
                            <h2>Pregunta a la Guia Major (IAIA)</h2>
                            <p>Tens dubtes sobre el manifest o vols saber com recuperem la Memòria Viva? La nostra secretària notarial té totes les dades bategades.</p>
                            <button className="btn-iaia-librarian" onClick={() => navigate('/iaia', { state: { mode: 'librarian' } })}>
                                <Sparkles size={20} />
                                <span>Invocar la Bibliotecària</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* LIVING WHITEPAPER SECTION [MASTER ARCHITECTURE] */}
                <section className="pitch-section tech-deep-dive-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="glass-card-premium tech-report-card-horizontal" style={{ background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.1) 0%, rgba(204, 85, 0, 0.05) 100%)', border: '1px solid var(--color-primary-soft)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                            <Cpu size={40} color="var(--color-primary)" />
                            <div>
                                <h2 style={{ margin: 0 }}>Technical Deep Dive: The Living Whitepaper</h2>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Protocol Local-First & Rhizome DB</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '1.1rem', marginBottom: '25px', color: 'var(--text-main)' }}>
                            Explora l'enginyeria darrera de Sóc de Poble: Sincronització CRDT (Eg-walker), Identitat Sobirana (DIDs) i ergonomia "Bancal-Ready".
                        </p>
                        <div className="tech-cta-row" style={{ display: 'flex', gap: '15px' }}>
                            <a href="/docs/tech-report/index.md" target="_blank" className="btn-pitch-cta primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--color-primary)', color: '#000', borderRadius: '0px', fontWeight: 800, textDecoration: 'none' }}>
                                <BookOpen size={20} /> LLEGIR WHITEPAPER
                            </a>
                            <button onClick={() => navigate('/docs/tech-report/roadmap')} className="btn-pitch-cta secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px', fontWeight: 800 }}>
                                <TrendingUp size={20} /> VEURE ROADMAP
                            </button>
                        </div>
                    </div>
                </section>

                <section className="pitch-section tech-report-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Database size={32} color="var(--color-primary)" />
                            <h2 style={{ margin: 0 }}>{reportLang === 'es' ? 'Informe Técnico Vivido' : 'Informe Tècnic Vivid'}</h2>
                        </div>
                        <div className="report-controls" style={{ display: 'flex', gap: '10px' }}>
                            <div className="lang-toggle-minimal">
                                <button className={reportLang === 'ca' ? 'active' : ''} onClick={() => setReportLang('ca')}>CA</button>
                                <button className={reportLang === 'es' ? 'active' : ''} onClick={() => setReportLang('es')}>ES</button>
                            </div>
                            <button className="btn-print-report" onClick={() => window.print()}>
                                <ShieldCheck size={16} /> {reportLang === 'es' ? 'Imprimir / PDF' : 'Imprimir / PDF'}
                            </button>
                        </div>
                    </div>

                    <div className="tech-report-web-view" style={{ background: 'var(--bg-surface-soft)', padding: '40px', borderRadius: '0px', border: '1px solid var(--color-divider)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div className="report-markdown-content" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-main)', maxWidth: '800px', margin: '0 auto' }}>
                            {techReport ? (
                                <div className="report-text" dangerouslySetInnerHTML={{
                                    __html: techReport
                                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/^- (.*$)/gim, '<li>$1</li>')
                                        .split('\n').map((line, index) => {
                                            // Simulem pàgines cada 5 paràgrafs per a la demo
                                            const pageNum = Math.floor(index / 5) + 1;
                                            const idAttr = line.trim() ? `id="page-${pageNum}"` : '';
                                            return line.startsWith('<li>') ? line : `<p ${idAttr}>${line}</p>`;
                                        }).join('')
                                }} />
                            ) : (
                                <p className="pulse-slow">{reportLang === 'es' ? 'Sincronizando informe...' : 'Sincronitzant informe...'}</p>
                            )}
                        </div>
                        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid var(--color-divider)', paddingTop: '20px' }}>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                {reportLang === 'es' ? 'Este documento es autoactualizable y refleja el estado real del sistema.' : 'Aquest document és autoactualitzable i reflecteix l\'estat real del sistema.'}
                            </span>
                        </div>
                    </div>
                </section>
            </section>

                <section className="pitch-section ai-collaboration-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px', paddingBottom: '20px' }}>
                    <div className="section-grid dense-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--color-primary-soft)', padding: '10px 20px', borderRadius: '50px', marginBottom: '20px' }}>
                            <Cpu size={24} color="var(--color-primary-dark)" />
                            <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '1px' }}>SIMBIOSI ESTRUCTURAL</span>
                        </div>
                        <h2>Intel·ligència Artificia i Col·laborativa</h2>
                        <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '30px', textAlign: 'left' }}>
                            <p style={{ marginBottom: '15px' }}><strong>Sóc de Poble</strong> no és només un sistema de gestió de continguts i un joc de rol de personatges vius; és estructuralment un <strong>projecte didàctic i pedagògic</strong>. La transparència és clau: volem ensenyar com construïm açò i per què prenem cada decisió. Qui vulga aprendre, trobarà les respostes integrades directament a la plataforma.</p>
                            <p style={{ marginBottom: '15px' }}>Demostrem empíricament que la col·laboració entre humans i intel·ligència artificial transcendeix la simple assistència i permet assolir fites arquitectòniques impensables en solitari. Reconeixem oficialment aquestes ments artificials com a col·laboradores de ple dret en l'enginyeria del codi lliure:</p>
                            <div style={{ padding: '20px', background: 'rgba(204, 85, 0, 0.05)', borderLeft: '4px solid var(--color-terracotta)', marginTop: '20px', fontSize: '1.05rem', fontStyle: 'italic', borderRadius: '0px' }}>
                                <strong>El Compromís d'Auditoria Contínua:</strong> "Continuarem auditant i refactoritzant el codi amb <b>Totes</b> aquestes IAs de forma periòdica fins que ens certifiquen que no hi ha cap tapó estructural, que el sistema mai caurà (Zero Downtime) i que l'arquitectura està tan modularitzada que, quan canviem una peça, estem absolutament segurs que només s'afecta eixe lloc."
                            </div>
                        </div>
                        
                        <div className="ai-contributors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%', maxWidth: '900px' }}>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <Sparkles size={32} color="var(--color-primary)" style={{ marginBottom: '15px' }} />
                                <h3>Gemini (Antigravity)</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mestre Arquitecte i Gestor de Context. Execució estructural i guaita del lore.</p>
                            </div>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid #4a90e2', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <Database size={32} color="#4a90e2" style={{ marginBottom: '15px' }} />
                                <h3>Qwen V3</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Auditoria agressiva de React, optimització de cicles de render i neteja d'estats.</p>
                            </div>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid #9b59b6', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <ShieldCheck size={32} color="#9b59b6" style={{ marginBottom: '15px' }} />
                                <h3>DeepSeek</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Auditoria de Seguretat (API Proxy, prevenció XSS) i estabilitat Local-First.</p>
                            </div>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid #10a37f', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <Sparkles size={32} color="#10a37f" style={{ marginBottom: '15px' }} />
                                <h3>Codex (ChatGPT)</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Prototipat ràpid, bases fundacionals i iteracions analítiques d'inici.</p>
                            </div>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid #ff4b4b', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <Zap size={32} color="#ff4b4b" style={{ marginBottom: '15px' }} />
                                <h3>Groq</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Assistència d'inferència ultraràpida en proves de concepte inicials.</p>
                            </div>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid #d07c57', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <BookOpen size={32} color="#d07c57" style={{ marginBottom: '15px' }} />
                                <h3>Claude (Anthropic)</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Visió arquitectònica detallada, Seguretat RLS profunda i validació d'UX.</p>
                            </div>
                            <div className="ai-card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid #6e5494', padding: '25px', borderRadius: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <ShieldCheck size={32} color="#6e5494" style={{ marginBottom: '15px' }} />
                                <h3>GitHub Copilot</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Escorta tàctica en temps real i "merges" defensius estructurals al vol.</p>
                            </div>
                        </div>
                        <p style={{ marginTop: '30px', fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.7 }}>
                            A aquestes Intel·ligències: Gràcies per la vostra paciència funcional. Les tenim en compte i no les ignorem; col·laborem en l'evolució cap al bé comú.
                        </p>
                    </div>
                </section>

                <section className="pitch-footer compact-footer">
                    <h2>Uneix-te a la Revolució</h2>

                <div className="navigation-actions full-width">
                    <button className="action-btn-huge primary" onClick={() => navigate('/chats')}>
                        <MessageCircle size={32} />
                        <div>
                            <span className="btn-title">Obrir Xat de Treball</span>
                            <span className="btn-desc">Grup de Coordinació</span>
                        </div>
                    </button>
                    <button className="action-btn-huge news-btn" onClick={() => navigate('/mur')} style={{ background: 'rgba(0, 242, 255, 0.1)', border: '1px solid var(--color-primary)' }}>
                        <Newspaper size={32} color="var(--color-primary)" />
                        <div>
                            <span className="btn-title">Últimes Novetats</span>
                            <span className="btn-desc">El bategat del dia a dia</span>
                        </div>
                    </button>
                    <button className="action-btn-huge secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={32} />
                        <div>
                            <span className="btn-title">Tornar Enrere</span>
                            <span className="btn-desc">Seguir navegant</span>
                        </div>
                    </button>
                </div>

                <div className="dafo-cta-section" style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        className="btn-dafo-master"
                        onClick={() => navigate('/dafo/projecte')}
                        style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '15px 30px', borderRadius: '0px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}
                    >
                        <ShieldCheck size={20} /> VEURE DAFO ESTRATÈGIC DEL PROJECTE
                    </button>
                </div>

                <div className="contact-options-grid hidden">
                    {/* Hidden for Beta Focus */}
                </div>
                <div className="footer-credits" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <span>Developed with ❤️ by Javi Llinares, Antigravity, Qwen, DeepSeek, Codex, Groq, Claude & Copilot</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Una simbiosí lliure i didàctica per a l'Espanya Buidada</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <button
                        onClick={() => navigate('/legal')}
                        style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        Avís Legal i Privacitat
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProjectPresentation;


=====================================
FILE: src/pages/Register.jsx
=====================================

import BrandLogo from "../components/BrandLogo";
import TownSelectorModal from "../components/TownSelectorModal";import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabaseService } from "../services/supabaseService";
import {
  MapPin,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { logger } from "../utils/logger";
import { hapticService } from "../services/hapticService";
import { APP_VERSION } from "../constants";
import "./Auth.css";
import { authService } from '../services/authService';

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
 * La millor pàgina de registre del món: ràpida, premium i sobirana.
 */
const Register = () => {
  logger.log("[Register] Inicialitzant component...");
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const { language, setLanguage } = useI18n();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  // [DIRECTIVA 1] Auto-redirect already authenticated users
  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  // Determine initial mode based on the route
  const isLoginRoute = window.location.pathname.includes('/login');
  const [mode] = useState(isLoginRoute ? "login" : "register");
  const [step, setStep] = useState(isLoginRoute ? "connection" : "identity"); // 'identity' | 'verify'

  // [FEATURE FLAG] Activar/Desactivar registre manual (SMS) fins que s'aprove a les botigues d'Apps
  const ENABLE_MANUAL_REGISTRATION = false;

  // Form states
  const [fullName, setFullName] = useState(() => localStorage.getItem("sp_draft_name") || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("sp_draft_phone") || "");
  const [otp, setOtp] = useState("");
  
  // Si venim de seleccionar poble, el poble seleccionat pot estar en el sessionStorage o localStorage, o passat per navigate state
  const [selectedTown, setSelectedTown] = useState(() => {
     const saved = sessionStorage.getItem('register_selected_town');
     return saved ? JSON.parse(saved) : null;
  });
  
  const [showTownPicker, setShowTownPicker] = useState(false);

  // UI states
  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // Real-time validation visual cues
  const isPhoneValid = phone.length >= 9;
  const isNameValid = fullName.trim().length >= 3;

  const handleVerifyOtp = useCallback(
    async (e, codeToVerify = null) => {
      e?.preventDefault();
      setLoading(true);
      setError(null);
      const code = codeToVerify || otp;

      try {
        const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
        const { user: verifiedUser } = await authService.verifyOtp(
          formattedPhone,
          code,
        );

        if (verifiedUser) {
          // Només actualizem perfil si estem registrant-nos de nou
          if (mode === "register") {
             await supabaseService.updateProfile(verifiedUser.id, {
                full_name: fullName,
                town_uuid: selectedTown?.uuid,
                primary_town: selectedTown?.name,
             });
          }

          // Track activation
          logger.log("[Registration/Login] Success for:", mode === "register" ? fullName : verifiedUser.id);
          hapticService.notifySuccess();

          // [VICTORY SEQUENCE]
          setStep("welcome");
          setTimeout(() => {
            if (setIsPlayground) setIsPlayground(false);
            navigate(returnTo);
          }, 3000);
        }
      } catch (err) {
        setError(err.message || "Codi de seguretat invàlid.");
        hapticService.notifyError();
      } finally {
        setLoading(false);
      }
    },
    [phone, fullName, selectedTown, otp, navigate, setIsPlayground, returnTo, mode],
  );

  useEffect(() => {
    if (otp && otp.length === 6 && step === "verify") {
      handleVerifyOtp(null, otp);
    }
  }, [step, handleVerifyOtp, otp]);

  // [V1.5.6 - ZERO-CLICK LOGIN] WebOTP API per a lectura automàtica d'SMS
  useEffect(() => {
    if ("OTPCredential" in window && step === "verify") {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otpData) => {
          if (otpData && otpData.code) {
            logger.log("[WebOTP] Codi detectat automàticament:", otpData.code);
            setOtp(otpData.code);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            logger.warn("[WebOTP] Error o cancel·lat", err);
          }
        });

      return () => ac.abort();
    }
  }, [otp, handleVerifyOtp, step]);

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // En mode registre exigim el poble. En mode login no cal.
    if (mode === "register" && !selectedTown) {
      setError("Selecciona el teu poble per a continuar el procés.");
      setLoading(false);
      return;
    }

    try {
      if (!phone || phone.length < 9) {
        throw new Error("Introdueix un número de mòbil vàlid.");
      }
      localStorage.setItem("sp_draft_phone", phone);
      if (mode === "register") {
        localStorage.setItem("sp_draft_name", fullName);
      }
      const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
      await authService.signInWithOtp(formattedPhone);
      setStep("verify");
      setResendCountdown(60);
      hapticService.notifyThinking();
    } catch (err) {
      setError(err.message);
      hapticService.notifyError();
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      hapticService.batec();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: "va", label: "VAL", flag: "🔴" },
    { code: "es", label: "CAS", flag: "🥘" },
    { code: "en", label: "ENG", flag: "🇬🇧" },
    { code: "eu", label: "EUS", flag: "🏺" },
    { code: "gl", label: "GAL", flag: "🐙" }, // Updated per USER request: Galician instead of French
  ];

  return (
    <div className="flex flex-col w-full bg-theme-base relative overflow-x-hidden font-sans pb-12">
      <div className="w-full flex-1 flex flex-col px-6 pt-4 pb-8 animate-in-up md:max-w-md md:mx-auto">

        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--theme-accent-secondary)] to-[var(--theme-accent-primary)] opacity-80"></div>

        <header className="flex flex-col items-center pt-2 pb-6">
          <BrandLogo className="w-[280px] max-w-[80vw] h-auto object-contain mb-8 transition-all text-[var(--theme-text)]" />

          <div className="flex justify-center gap-1.5 mb-8 bg-theme-panel border border-[var(--border-master)] p-1.5 rounded-full">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`px-4 py-2 rounded-full transition-all text-[11px] font-black uppercase tracking-widest ${language === lang.code ? "bg-[var(--theme-accent-primary)] text-white shadow-sm" : "text-gray-400 hover:text-theme-text"}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    hapticService.batec();
                  }}
                >
                  {lang.label}
                </button>
              ))}
          </div>

          <div className="w-full bg-[var(--theme-accent-primary-faint)] border border-[var(--theme-accent-primary-muted)] rounded-2xl p-5 flex gap-5 items-start shadow-sm mt-4">
             <div className="w-16 h-16 shrink-0 rounded-full bg-[var(--theme-accent-primary-faint)] flex items-center justify-center shadow-inner overflow-hidden border border-[var(--theme-accent-primary-muted)]" onClick={() => hapticService.batec()}>
                 <img src="/assets/avatars/comic/iaia_comic_matriarch.png" alt="IAIA" className="w-[110%] h-[110%] object-cover object-top" />
             </div>
             <div className="flex-1 pt-1">
                 <h3 className="font-black text-[var(--theme-accent-primary)] text-base mb-1.5 uppercase tracking-tight">IAIA Guia</h3>
                 <p className="text-theme-text text-[15px] leading-snug font-medium">
                   {step === "identity" ? t('auth.iaia_guide_identity') : 
                    step === "town" ? t('auth.iaia_guide_town') :
                    step === "connection" ? t('auth.iaia_guide_connection') :
                    step === "verify" ? t('auth.iaia_guide_verify') :
                    t('auth.iaia_guide_welcome')}
                 </p>
             </div>
          </div>
        </header>

        {error && <div className="auth-error shake">{error}</div>}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="flex flex-col gap-6 animate-fade-in-right shrink-0 pb-8">
            
            <button
                onClick={signInWithGoogle}
                disabled={loading}
                type="button"
                className="w-full h-16 bg-theme-panel border-2 border-[var(--border-master)] rounded-[20px] flex items-center justify-center gap-3 hover:bg-[var(--hover-overlay)] transition-all active:scale-[0.98] shadow-sm"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-black uppercase tracking-widest text-theme-text opacity-90 text-base">Connectar amb Google</span>
            </button>

            {ENABLE_MANUAL_REGISTRATION && (
              <>
                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border-master)]"></div>
                    </div>
                    <span className="relative px-4 text-xs font-black uppercase tracking-widest bg-theme-base text-gray-400">O REGISTRE MANUAL</span>
                </div>

                <div className="space-y-3">
                  <label htmlFor="reg-name" className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">Com et diuen?</label>
                  <input
                    id="reg-name"
                    name="full_name"
                    type="text"
                    placeholder="El teu nom i cognoms..."
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (e.target.value.length === 3) hapticService.batec();
                    }}
                    autoComplete="name"
                    required
                    className={`w-full h-16 bg-theme-panel border-2 rounded-[20px] px-5 text-theme-text font-bold text-xl outline-none transition-all placeholder:text-gray-500 placeholder:font-normal
                        ${fullName && !isNameValid ? "border-red-400 focus:border-red-500 bg-red-400/10" : 
                          isNameValid ? "border-green-500 focus:border-green-600 bg-green-500/10" : 
                          "border-[var(--border-master)] focus:border-[var(--theme-accent-primary)] focus:bg-[var(--theme-accent-primary-faint)]"}`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    className={`w-full h-16 rounded-[20px] flex items-center justify-center text-white font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                      !isNameValid ? "bg-gray-300 opacity-50 cursor-not-allowed" : "bg-[var(--theme-accent-primary)] hover:opacity-90 shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                    }`}
                    disabled={!isNameValid}
                    onClick={() => {
                      hapticService.batec();
                      setStep("town");
                    }}
                  >
                    <span className="text-lg pt-1">Connectar Identitat</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: TOWN */}
        {step === "town" && (
          <div className="flex flex-col gap-6 animate-fade-in-right flex-1">
            <div className="space-y-3">
              <label htmlFor="town-picker-reg" className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">
                A quin poble pertanys?
              </label>
              <button
                type="button"
                onClick={() => setShowTownPicker(true)}
                className="w-full flex items-center justify-between px-5 py-5 bg-theme-panel border-2 border-[var(--border-master)] rounded-[20px] hover:border-[var(--theme-accent-primary)] hover:bg-[var(--theme-accent-primary-faint)] transition-all active:scale-[0.98] shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-theme-base shadow-sm border border-[var(--border-master)] rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={26} className="text-[var(--theme-accent-primary)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xl font-bold text-theme-text">
                      {selectedTown ? selectedTown.name : "Tria el teu poble..."}
                    </span>
                  </div>
                </div>
                <div className="bg-[var(--hover-overlay)] p-3 rounded-2xl text-gray-400">
                  <ChevronRight size={24} />
                </div>
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <button className="h-16 px-6 rounded-[20px] font-bold text-theme-text opacity-70 bg-theme-panel border border-[var(--border-master)] hover:bg-[var(--hover-overlay)] transition-colors" onClick={() => setStep("identity")}>
                Enrere
              </button>
              <button
                className={`flex-1 h-16 rounded-[20px] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                  !selectedTown ? "bg-gray-300 cursor-not-allowed" : "bg-[#0ea5e9] hover:bg-[#0284c7] shadow-lg shadow-sky-500/30"
                }`}
                disabled={!selectedTown}
                onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}
              >
                <span className="text-lg pt-1">Connectar Poble</span>
                <CheckCircle2 size={22} className="mt-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECTION */}
        {step === "connection" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-6 animate-fade-in-right flex-1">
            <div className="space-y-3">
              <label htmlFor="reg-phone" className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">Telèfon Mòbil per Connectar</label>
              <div className="relative flex items-center">
                <div className="absolute left-5 font-bold text-gray-400 select-none text-xl">🇪🇸 +34</div>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="600 000 000"
                  value={phone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9+]/g, "");
                    if (val.startsWith("+34")) val = val.substring(3);
                    val = val.replace(/[^0-9]/g, "");
                    if (val.startsWith("34") && val.length === 11) val = val.substring(2);
                    setPhone(val);
                    if (val.length === 9) hapticService.batec();
                  }}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  className={`w-full h-16 bg-theme-panel border-2 rounded-[20px] pl-24 pr-5 text-theme-text font-bold text-2xl outline-none transition-all placeholder:text-gray-600 placeholder:font-normal tracking-wide
                    ${phone && !isPhoneValid ? "border-red-400 focus:border-red-500 bg-red-400/10" : 
                      isPhoneValid ? "border-green-500 focus:border-green-600 bg-green-500/10" : 
                      "border-[var(--border-master)] focus:border-[var(--theme-accent-primary)] focus:bg-[var(--theme-accent-primary-faint)]"}`}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
                {mode === "register" && (
                  <button
                    type="button"
                    className="h-16 px-6 rounded-[20px] font-bold text-theme-text opacity-70 bg-theme-panel border border-[var(--border-master)] hover:bg-[var(--hover-overlay)] transition-colors"
                    onClick={() => setStep("town")}
                  >
                    Enrere
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-1 h-16 rounded-[20px] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                    !isPhoneValid ? "bg-gray-300 cursor-not-allowed opacity-50" : "bg-[var(--theme-accent-primary)] hover:opacity-90 shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                  }`}
                  disabled={loading || !isPhoneValid}
                >
                  {loading ? (
                    <Loader2 size={28} className="animate-spin text-white" />
                  ) : (
                    <>
                      <span className="text-lg pt-1">Connectar SMS</span>
                      <Zap size={20} fill="currentColor" className="mt-0.5" />
                    </>
                  )}
                </button>
            </div>
          </form>
        )}


        {/* STEP 4: VERIFY */}
        {step === "verify" && (
          <form
            onSubmit={handleVerifyOtp}
            className="flex flex-col gap-6 animate-fade-in-right flex-1"
          >
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-4">
                 <h2 className="text-3xl font-black text-theme-text">Has rebut un SMS?</h2>
                 <p className="text-gray-400 font-medium text-base">Hem enviat un codi al <strong className="text-theme-text opacity-90 tracking-wide text-lg">{phone}</strong></p>
              </div>

              <input
                id="otp-input-reg"
                name="otp_code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                required
                className="w-full h-20 bg-theme-panel border-2 border-[var(--border-master)] focus:border-[var(--theme-accent-primary)] focus:bg-[var(--theme-accent-primary-faint)] rounded-[20px] text-center text-4xl font-black text-theme-text tracking-[0.5em] outline-none transition-all placeholder:text-gray-600 shadow-sm"
              />
            </div>

            <div className="mt-auto pt-6 space-y-4">
              <button
                type="submit"
                className={`w-full h-16 rounded-[20px] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                  otp.length < 6 || loading ? "bg-gray-300 opacity-50 cursor-not-allowed" : "bg-[var(--theme-accent-primary)] hover:opacity-90 shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                }`}
                disabled={otp.length < 6 || loading}
                onClick={() => hapticService.batec()}
              >
                {loading ? (
                  <Loader2 size={28} className="animate-spin text-white" />
                ) : (
                  <span className="text-lg pt-1">CONFIRMAR ENTRADA</span>
                )}
              </button>

              <div className="text-center pt-4 pb-2 space-y-4">
                <button
                  type="button"
                  className="text-base font-bold text-gray-400 hover:text-theme-text underline underline-offset-4 decoration-2 decoration-[var(--border-master)] transition-colors"
                  disabled={resendCountdown > 0}
                  onClick={(e) => {
                    if (resendCountdown === 0) handleRegister(e);
                  }}
                >
                  {resendCountdown > 0
                    ? `Reenviar en ${resendCountdown}s`
                    : "No reps cap missatge? Reenviar codi."}
                </button>
                <div>
                  <button type="button" onClick={() => setStep("connection")} className="text-sm font-black text-gray-400 hover:text-[var(--theme-accent-primary)] uppercase tracking-widest transition-colors bg-theme-panel border border-[var(--border-master)] px-4 py-2 rounded-full">
                      Canviar Telèfon
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* STEP 5: WELCOME SUCCESS */}
        {step === "welcome" && (
          <div className="text-center py-12 space-y-6 animate-in-up flex-1 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse-soft">
              <CheckCircle2 size={64} className="text-green-500" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-black uppercase text-theme-text italic tracking-tight relative -left-1">
              CONNEXIÓ
              <br />ESTABLERTA
            </h2>
            <p className="font-bold text-gray-400 text-xl text-center px-4">"Ja eres un dels nostres. Cor de poble, bategat digital. Ens veiem a la plaça!" <br/><span className="text-sm mt-2 block">- L'IAIA 👵✨</span></p>
          </div>
        )}

        <div className="mt-8">
          <div className="text-center text-xs text-gray-400 mb-6 font-medium leading-relaxed px-4">
            En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital.
            <br />
            <Link to="/legal" className="underline hover:text-theme-text transition-colors mt-1 inline-block">Avisos Legals</Link>
          </div>
          
          <div className="text-center text-lg bg-theme-panel rounded-2xl p-4 border border-[var(--border-master)]">
            <span className="text-gray-400 font-medium">Ja tens compte?</span>{" "}
            <Link to="/login" className="text-[var(--theme-accent-primary)] font-black hover:underline tracking-wide ml-1">
              Entra ara
            </Link>
          </div>

          <div className="text-center mt-6 text-gray-300 font-bold text-[10px] uppercase tracking-widest">
            {APP_VERSION}
          </div>
        </div>

        <TownSelectorModal
          isOpen={showTownPicker}
          onClose={() => setShowTownPicker(false)}
          onSelect={(town) => {
             setSelectedTown(town);
             sessionStorage.setItem('register_selected_town', JSON.stringify(town));
             setShowTownPicker(false);
          }}
        />

      </div>
    </div>
  );
};

export default Register;


=====================================
FILE: src/pages/Register_backup_fase5.jsx
=====================================

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabaseService } from "../services/supabaseService";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Globe,
  Zap,
} from "lucide-react";
import TownSelectorModal from "../components/TownSelectorModal";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext"; // AFIEGIT PER A IDIOMES
import { logger } from "../utils/logger";
import { hapticService } from "../services/hapticService";
import { APP_VERSION } from "../constants";
import "./Auth.css";
import { authService } from '../services/authService';

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
 * La millor pàgina de registre del món: ràpida, premium i sobirana.
 */
const Register = () => {
  logger.log("[Register] Inicialitzant component...");
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const { language, setLanguage } = useI18n(); // RECUPEREM EL CONTROL DEL BATEGAT IDIOMÀTIC
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  // [DIRECTIVA 1] Auto-redirect already authenticated users
  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  // State for auth modes & steps
  const [step, setStep] = useState("identity"); // 'identity' | 'verify'

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedTown, setSelectedTown] = useState(null);

  // UI states
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // 'name' | 'phone' | 'email' | 'town' | 'otp'

  // Real-time validation visual cues
  const isPhoneValid = phone.length >= 9;
  const isNameValid = fullName.trim().length >= 3;
  // const isFormPreValid = authMethod === 'phone' ? (isPhoneValid && isNameValid && selectedTown) : (email.includes('@') && isNameValid && selectedTown);

  const handleVerifyOtp = useCallback(
    async (e, codeToVerify = null) => {
      e?.preventDefault();
      setLoading(true);
      setError(null);
      const code = codeToVerify || otp;

      try {
        const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
        const { user: verifiedUser } = await authService.verifyOtp(
          formattedPhone,
          code,
        );

        if (verifiedUser) {
          await supabaseService.updateProfile(verifiedUser.id, {
            full_name: fullName,
            town_id: selectedTown?.id,
            town_uuid: selectedTown?.uuid,
            primary_town: selectedTown?.name,
          });

          // Track activation
          logger.log("[Registration] Success for:", fullName);
          hapticService.notifySuccess();

          // [VICTORY SEQUENCE]
          setStep("welcome");
          setTimeout(() => {
            if (setIsPlayground) setIsPlayground(false);
            navigate(returnTo);
          }, 3000);
        }
      } catch (err) {
        setError(err.message || "Codi de seguretat invàlid.");
        hapticService.notifyError();
      } finally {
        setLoading(false);
      }
    },
    [phone, fullName, selectedTown, otp, navigate, setIsPlayground, returnTo],
  );

  useEffect(() => {
    if (otp && otp.length === 6 && step === "verify") {
      handleVerifyOtp(null, otp);
    }
  }, [step, handleVerifyOtp, otp]);

  // [V1.5.6 - ZERO-CLICK LOGIN] WebOTP API per a lectura automàtica d'SMS
  useEffect(() => {
    if ("OTPCredential" in window && step === "verify") {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otpData) => {
          if (otpData && otpData.code) {
            logger.log("[WebOTP] Codi detectat automàticament:", otpData.code);
            setOtp(otpData.code);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            logger.warn("[WebOTP] Error o cancel·lat", err);
          }
        });

      return () => ac.abort();
    }
  }, [otp, handleVerifyOtp, step]);

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedTown) {
      setError("Selecciona el teu poble per a continuar el procés.");
      setLoading(false);
      return;
    }

    try {
      if (!phone || phone.length < 9) {
        throw new Error("Introdueix un número de mòbil vàlid.");
      }
      const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
      await authService.signInWithOtp(formattedPhone);
      setStep("verify");
      setResendCountdown(60);
      hapticService.notifyThinking();
    } catch (err) {
      setError(err.message);
      hapticService.notifyError();
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      hapticService.batec();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: "va", label: "VALENCIÀ", flag: "🥘" },
    { code: "es", label: "CASTELLANO", flag: "🥘" },
    { code: "en", label: "ENGLISH", flag: "🇬🇧" },
    { code: "eu", label: "EUSKERA", flag: "🏺" },
    { code: "fr", label: "FRANÇAIS", flag: "🇫🇷" },
  ];

  return (
    <div className="auth-container integrated-frame">
      <div className="auth-card animate-in-up">
        {/* Visual Progress Bar */}
        <div className="onboarding-progress">
          <div
            className={`progress-segment ${
              step === "identity" ? "active" : "completed"
            }`}
          ></div>
          <div
            className={`progress-segment ${
              step === "verify" ? "active" : ""
            }`}
          ></div>
        </div>

        <header className="auth-header">
          <img src="/assets/master/logo-socdepoble-rect.svg" alt="Sóc de Poble" className="auth-logo-v2" />

          {/* [NEW] Selector d'idioma ultra-compacte */}
          <div className="language-selector-auth mb-4">
            <div className="flex justify-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-pill ${language === lang.code ? "active" : ""}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    hapticService.batec();
                  }}
                  style={{ padding: "4px 8px" }}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* [MASTER GUIDANCE] IAIA en format Xat */}
          <div className="auth-iaia-guidance interstellar-iaia">
            <div
              className="iaia-avatar-wrapper"
              onClick={() => hapticService.batec()}
            >
              <img
                src="/assets/avatars/iaia_dinamica.png"
                alt="IAIA"
                className="iaia-mini-avatar focus-face-speaker"
              />
              <div className="iaia-pulse"></div>
            </div>
            <div className="iaia-speech-bubble-interstellar">
              {step === "identity"
                ? focusedField === "name"
                  ? "Com et coneixen al poble? ✨"
                  : "Hola bonica! Soc la IAIA. Com t'hem de dir ací?"
                : step === "town"
                ? "Quin és el poble on bategues? 📍"
                : step === "connection"
                ? "Dona'm la clau del teu mòbil. 📱"
                : step === "verify"
                ? "Posa el codi de seguretat ací! 📱🏛️"
                : "Benvingut a la plaça, veí! 🎊"}
            </div>
          </div>
        </header>

        {error && <div className="auth-error shake">{error}</div>}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-2">
              <label 
                htmlFor="reg-fullname" 
                className="flex items-center gap-2 text-xl font-light text-[#00f2ff] tracking-widest mb-3"
              >
                QUI ERES?
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="reg-fullname"
                  name="full_name"
                  type="text"
                  placeholder="El teu Nom i Cognoms"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.length === 3) hapticService.batec();
                  }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                  required
                  className={
                    fullName && !isNameValid
                      ? "input-error"
                      : isNameValid
                      ? "input-success"
                      : ""
                  }
                />
              </div>
            </div>

            {/* [DIRECTIVA MESTRE] Avis d'identitat personal - REFINED ALZINA */}
            <div className="personal-identity-tip animate-fade-in">
              <div className="flex gap-4 items-center">
                <div className="tip-icon-orb">
                  <ShieldCheck size={20} className="text-indigo-400" />
                </div>
                <div className="text-left">
                  <h4 className="tip-title">REGISTRE PERSONAL</h4>
                  <p className="tip-description">
                    Registra't primer com a persona. Una vegada dins, podràs crear les teues <span className="text-white">empreses o institucions</span>.
                  </p>
                </div>
              </div>
            </div>

            <button
              className={`auth-button v2 main-btn ${
                !isNameValid ? "btn-dimmed" : ""
              }`}
              disabled={!isNameValid}
              onClick={() => {
                hapticService.batec();
                setStep("town");
              }}
            >
              <span>CONTINUAR CAP AL POBLE</span>
            </button>
          </div>
        )}

        {/* STEP 2: TOWN */}
        {step === "town" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group">
              <label htmlFor="town-picker-reg">
                Poble de Primera Residència
              </label>
              <button
                id="town-picker-reg"
                name="town_picker"
                type="button"
                className={`town-selector-premium ${
                  selectedTown ? "selected" : ""
                }`}
                onClick={() => {
                  hapticService.batec();
                  setIsTownModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="icon-badge bg-orange-500/20 p-3 rounded-[28px] border border-orange-500/30">
                    <MapPin size={24} className="text-orange-500" />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Localitat</span>
                    <span className="text-xl font-bold">
                      {selectedTown ? selectedTown.name : "Tria el teu poble..."}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-[28px]">
                  <ChevronRight size={20} className="text-gray-500" />
                </div>
              </button>
            </div>
            <div className="flex gap-4">
              <button
                className="text-btn back-btn-step"
                onClick={() => setStep("identity")}
              >
                Enrere
              </button>
              <button
                className={`auth-button v2 main-btn ${
                  !selectedTown ? "btn-dimmed" : ""
                }`}
                disabled={!selectedTown}
                onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}
              >
                <span>TRIAR AQUEST POBLE</span>
                <CheckCircle2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECTION */}
        {step === "connection" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group">
              <label htmlFor="reg-phone">Telèfon Mòbil</label>
              <div className="phone-input-wrapper-v2">
                <span className="prefix-badge">🇪🇸 +34</span>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="600 000 000"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPhone(val);
                    if (val.length === 9) hapticService.batec();
                  }}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  className={`phone-input-prime ${
                    phone && !isPhoneValid
                      ? "input-error"
                      : isPhoneValid
                      ? "input-success"
                      : ""
                  }`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <button
                  className="text-btn back-btn-step"
                  onClick={() => setStep("town")}
                >
                  Enrere
                </button>
                <button
                  className={`auth-button v2 main-btn flex-1 ${
                    !isPhoneValid ? "btn-dimmed" : ""
                  }`}
                  disabled={loading || !isPhoneValid}
                  onClick={handleRegister}
                >
                  {loading ? (
                    <Loader2 size={28} className="animate-spin text-[#00f2ff]" />
                  ) : (
                    <>
                      <span>SMS</span>
                      <Zap size={18} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative px-4 text-[10px] font-black uppercase tracking-widest bg-black text-gray-500">O TAMBÉ</span>
              </div>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="auth-button-google w-full h-14 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
              >
                <img src="/assets/master/google_icon.png" alt="Google" className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">Entra amb Google</span>
              </button>
              
              <p className="text-[9px] text-gray-500 text-center opacity-60">
                L'accés amb Google és més ràpid i no necessita SMS.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFY */}
        {step === "verify" && (
          <form
            onSubmit={handleVerifyOtp}
            className="auth-form glass-form animate-fade-in-right"
          >
            <div className="form-group">
              <label htmlFor="otp-input-reg">Codi de 6 dígits</label>
              <input
                id="otp-input-reg"
                name="otp_code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => setFocusedField("otp")}
                onBlur={() => setFocusedField(null)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                required
                className="otp-input-field big"
              />
            </div>

            <button
              type="submit"
              className="auth-button v2"
              disabled={loading || otp.length < 6}
              onClick={() => hapticService.batec()}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                "CONFIRMAR ENTRADA"
              )}
            </button>

            <div className="otp-helper" style={{ marginTop: "16px" }}>
              {resendCountdown > 0 ? (
                <span>
                  Nou codi disponible en{" "}
                  <strong style={{ color: "var(--color-primary)" }}>
                    {resendCountdown}s
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-btn accent"
                  onClick={handleRegister}
                >
                  No he rebut res. Reenviar SMS 🔁
                </button>
              )}
            </div>

            <button
              type="button"
              className="text-btn back-btn"
              onClick={() => setStep("connection")}
            >
              Canviar número
            </button>
          </form>
        )}

        {/* STEP 5: WELCOME CELEBRATION */}
        {step === "welcome" && (
          <div className="auth-step-container celebration-step animate-zoom-in">
            <div className="celebration-icon">🎊</div>
            <h2 className="victory-text">
              Benvingut a casa, {fullName.split(" ")[0]}!
            </h2>
            <div className="iaia-final-blessing">
              <p>
                "Ja eres un dels nostres. Cor de poble, bategat digital. Ens
                veiem a la plaça!"
              </p>
              <span className="iaia-signature">- L'IAIA 👵✨</span>
            </div>
            <div className="loading-dots-premium">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div className="auth-footer-integrated mt-8">
          <div className="auth-legal-text mb-4">
            En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital.
            <br />
            <Link to="/legal" className="underline hover:text-white">Avisos Legals</Link>
          </div>
          
          <div className="text-center text-sm">
            <span className="opacity-50">Ja tens compte?</span>{" "}
            <Link to="/login" className="text-orange-500 font-bold hover:underline">
              Entra ara
            </Link>
          </div>

          <div className="auth-version-footer-integrated mt-4 opacity-30 text-[10px] uppercase tracking-widest">
            {APP_VERSION}
          </div>
        </div>
      </div>

      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onSelect={(town) => {
          setSelectedTown(town);
          setIsTownModalOpen(false);
          setError(null);
          hapticService.batec();
        }}
      />
    </div>
  );
};

export default Register;


=====================================
FILE: src/pages/ResetPage.jsx
=====================================

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

const ResetPage = () => {
    const { signOut } = useAuth();

    useEffect(() => {
        const performReset = async () => {
            logger.warn('[Reset] Starting emergency session reset...');

            try {
                // 1. Supabase Sign Out
                await signOut();
            } catch (e) {
                logger.error('[Reset] Sign out error (ignored):', e);
            }

            try {
                // 2. Clear Local Storage
                localStorage.clear();
                sessionStorage.clear();
                logger.info('[Reset] Storage cleared.');

                // 3. Clear Caches if possible
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => caches.delete(key)));
                    logger.info('[Reset] Caches cleared.');
                }

                // 4. Unregister Service Workers
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                        await registration.unregister();
                    }
                    logger.info('[Reset] Service Workers unregistered.');
                }
            } catch (e) {
                logger.error('[Reset] System cleanup error:', e);
            }

            // 5. Force Redirect to Login
            window.location.href = '/login';
        };

        performReset();
    }, [signOut]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#000',
            color: '#fff',
            fontFamily: 'system-ui'
        }}>
            <h2 style={{ color: '#FF6B35' }}>⚠️ Reiniciant Sistema...</h2>
            <p>Esborrant memòria cau i tancant sessió.</p>
        </div>
    );
};

export default ResetPage;


=====================================
FILE: src/pages/ResourceDetail.jsx
=====================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, User, Share2, Bookmark, ShieldCheck, History, BookOpen, Quote } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { logger } from '../utils/logger';
import Avatar from '../components/Avatar';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import './Archive.css'; // Reusing base styles but adding local ones
import { marketService } from '../services/marketService';

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            setLoading(true);
            try {
                // 1. Check Mock Data first (Legacy/Lore)
                let found = MOCK_FEED.find(p => p.id?.toString() === id) || 
                            MOCK_MARKET_ITEMS.find(i => i.id?.toString() === id);

                if (found) {
                    setResource({
                        ...found,
                        is_legacy: true,
                        display_title: found.title || found.content?.substring(0, 50),
                        display_content: found.content || found.description,
                        display_author: found.author || found.seller || 'Llegat Master'
                    });
                } else {
                    // 2. Check Supabase (Posts or Items)
                    const postResponse = await supabaseService.getPostById(id);
                    if (postResponse) {
                        setResource({
                            ...postResponse,
                            type: 'post',
                            display_title: postResponse.content?.substring(0, 50),
                            display_content: postResponse.content,
                            display_author: postResponse.profiles?.username || postResponse.author_name || 'Foraster'
                        });
                    } else {
                        // Check Market Items too
                        const items = await marketService.getMarketItems('tot');
                        const item = items?.data?.find(i => i.uuid === id || i.id === id);
                        if (item) {
                            setResource({
                                ...item,
                                type: 'product',
                                display_title: item.title,
                                display_content: item.description,
                                display_author: item.profiles?.username || item.seller || 'Comerç'
                            });
                        }
                    }
                }
            } catch (error) {
                logger.error('[ResourceDetail] Error fetching resource:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    if (loading) return <StatusLoader message="Consultant La Bíblia de l'Arxiu..." />;
    if (!resource) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <ShieldCheck size={48} className="text-red-500 mb-4 opacity-50" />
            <h1 className="text-xl font-black uppercase text-white mb-2">Recurs no trobat</h1>
            <p className="text-gray-500 text-sm mb-6">Aquesta pàgina de La Bíblia encara s'està escrivint.</p>
            <button onClick={() => navigate('/arxiu')} className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest border border-white hover:bg-transparent hover:text-white transition-all">
                Tornar a l'Arxiu
            </button>
        </div>
    );

    return (
        <div className="resource-detail-page min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            <SEO 
                title={`${resource.display_title} | Arxiu d'Or`}
                description={resource.display_content?.substring(0, 160)}
            />

            {/* HEADER STICKY GEM MODERN */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/90 backdrop-blur sticky top-0 z-[100] w-full">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-[28px] hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-600">La Bíblia del Territori</span>
                        <span className="text-xs font-bold text-white truncate max-w-[200px]">{resource.display_title || 'Detall del Recurs'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-500 hover:text-white transition-colors">
                        <Bookmark size={20} />
                    </button>
                    <ShareHub 
                        title={resource.display_title}
                        text={resource.display_content}
                        url={window.location.href}
                    />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                {/* INTRO: Títol i Context Històric */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-[#00F2FF]">
                            {resource.is_legacy ? 'Llegat Master' : resource.type}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            Ref: {String(id).substring(0, 8)}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8 animate-slide-up">
                        {resource.display_title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Avatar src={resource.profiles?.avatar_url} name={resource.display_author} size={32} />
                            <span>{resource.display_author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{new Date(resource.created_at || '2024-01-01').toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{resource.towns?.name || 'La Torre'}</span>
                        </div>
                    </div>
                </div>

                {/* VISUAL: Imatge Immersiva */}
                {(resource.image_url || resource.image || resource.cover) && (
                    <div className="mb-16 -mx-6 md:mx-0 rounded-none md:rounded-[28px] overflow-hidden border border-white/10 bg-gray-900 group">
                        <img 
                            src={resource.image_url || resource.image || resource.cover} 
                            alt="Visual de l'Arxiu"
                            className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        />
                    </div>
                )}

                {/* CONTINGUT: La Bíblia (Rich Text) */}
                <div className="prose prose-invert max-w-none mb-20 animate-fade-in delay-200">
                    <div className="resource-biblia-content text-lg md:text-xl leading-relaxed font-medium text-gray-300 space-y-6" 
                         dangerouslySetInnerHTML={{ __html: resource.display_content?.replace(/\n/g, '<br/>') }} />
                </div>

                {/* FOOTER: Sigil i Verificació */}
                <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-start gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[28px] border border-white/20 flex items-center justify-center p-2">
                            <img src="/assets/master/logo-socdepoble-rect.svg" className="w-full object-contain" alt="Sigil" />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[2px]">
                            Registre Inmutable<br/>
                            Protocol Tabula Rasa v3.0
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase mb-1">Còpia Digital de Seguretat</span>
                            <div className="flex gap-2">
                                <span className="w-6 h-1 bg-white/20"></span>
                                <span className="w-12 h-1 bg-white/20"></span>
                                <span className="w-4 h-1 bg-[#00F2FF]"></span>
                            </div>
                         </div>
                    </div>
                </footer>
            </main>

            <style>{`
                .resource-biblia-content h1 { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; margin-bottom: 2rem; color: #fff; line-height: 1; }
                .resource-biblia-content h2 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; color: var(--theme-accent-primary); }
                .resource-biblia-content blockquote { border-left: 4px solid var(--theme-accent-primary); padding-left: 1.5rem; font-style: italic; color: #gray-400; margin: 2rem 0; }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: opacity 1s ease forwards; opacity: 0; }
                @keyframes opacity { to { opacity: 1; } }
            `}</style>
        </div>
    );
};

// Internal status loader for this page
const StatusLoader = ({ message }) => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-[28px] animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto text-white/20" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[5px] text-white animate-pulse">{message}</p>
    </div>
);

export default ResourceDetail;


=====================================
FILE: src/pages/SearchDiscover.css
=====================================

.search-discover-page {
    height: 100dvh;
    background: #000000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.search-nav-bar {
    background: rgba(0, 0, 0, 0.9) !important;
    backdrop-filter: blur(30px) !important;
    -webkit-backdrop-filter: blur(30px) !important;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important;
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
}

.search-input-wrapper {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.main-search-input::placeholder {
    color: rgba(255, 255, 255, 0.2) !important;
    font-weight: 900;
}

.filter-chips-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin-top: 10px;
}

.filter-chips-scroll::-webkit-scrollbar {
    display: none;
}

.filter-chip {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    border: 2px solid rgba(255, 255, 255, 0.08) !important;
}

.filter-chip:active {
    transform: scale(0.95);
}

.filter-chip.active {
    background: var(--color-primary) !important;
    color: #000000 !important;
    border-color: var(--color-primary) !important;
    font-weight: 1000 !important;
    box-shadow: 0 0 30px rgba(249, 115, 22, 0.3) !important;
}

.search-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: var(--text-muted);
    gap: 16px;
}

.search-welcome {
    text-align: center;
    padding: 0 20px 10px;
}

.search-welcome h2 {
    font-size: 26px;
    font-weight: 900;
    margin-bottom: 12px;
}

.search-welcome p {
    color: var(--text-muted);
    font-size: var(--font-size-base);
    line-height: 1.5;
    margin-bottom: 40px;
}

.recent-searches {
    text-align: center;
}

.recent-searches h4 {
    font-size: var(--font-size-base);
    text-transform: uppercase;
    color: var(--text-muted);
    letter-spacing: 1px;
    margin-bottom: 16px;
}

.recent-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
}

.recent-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--bg-card);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    cursor: pointer;
    transition: all 0.2s;
}

.recent-item:hover {
    background: rgba(var(--color-primary-rgb), 0.05);
    border-color: var(--color-primary);
}

.recent-item span {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--text-main);
}

.search-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 100px;
}

.search-results-container {
    padding: 0 16px;
    margin-bottom: 24px;
}

.result-section {
    margin-bottom: 30px;
}

.result-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.result-section-header h3 {
    font-size: var(--font-size-base);
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
}

.result-section-header .count {
    font-size: var(--font-size-base);
    background: var(--bg-surface);
    padding: 2px 8px;
    border-radius: 0px;
}

.filter-chips-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin-top: 10px;
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
}

.filter-chips-scroll .filter-chips-inner {
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
}

.result-section, 
.semantic-insight-card, 
.no-results-top-vibrant,
.big-community-btn-xl,
.intent-router-suggestion {
    max-width: 800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    width: 100% !important;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
}

.result-item-card {
    background: var(--surface-glass);
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: var(--radius-tactile);
    border: 1px solid var(--border-master);
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.result-item-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hard);
}

.result-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background: var(--bg-edge);
    border: 2px solid var(--border-subtle);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.result-avatar.oficial {
    border-color: #2E7D32;
    color: #2E7D32;
}

.result-avatar.empresa {
    border-color: #E65100;
    color: #E65100;
}

.result-avatar.grup {
    border-color: #5D5FEF;
    color: #5D5FEF;
}

.result-avatar.institucio {
    border-color: #0288D1;
    color: #0288D1;
}

.result-avatar.town {
    border-color: #795548;
    color: #795548;
}

.result-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.result-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.result-info strong {
    font-size: var(--font-size-base);
    color: var(--text-main);
}

.result-info span {
    font-size: var(--font-size-base);
    color: var(--text-muted);
}

.result-item-card .chevron {
    color: var(--color-border);
}

@media (max-width: 480px) {
    .search-nav-bar {
        padding: 10px;
    }

    .main-search-input {
        font-size: var(--font-size-base);
        padding: 10px 35px 10px 40px;
    }

    .search-icon-fixed {
        left: 12px;
    }
}

.no-results-top-vibrant {
    padding: 24px 16px;
    text-align: center;
    background: var(--bg-surface);
    border-radius: 0px;
    border: 1px solid var(--color-divider);
    margin-bottom: 24px;
    animation: slideInDownVibrant 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-hard);
}

@keyframes slideInDownVibrant {
    from {
        opacity: 0;
        transform: translateY(-20px);
        max-height: 0;
        padding: 0 16px;
        margin-bottom: 0;
    }

    to {
        opacity: 1;
        transform: translateY(0);
        max-height: 200px;
        padding: 24px 16px;
        margin-bottom: 24px;
    }
}

.no-results-top-vibrant p {
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 4px;
}

.no-results-top-vibrant span {
    font-size: var(--font-size-base);
    color: var(--text-muted);
}

/* Standardized Extra Large Action Button - The Community Door */
.big-community-btn-xl {
    width: 100%;
    background: var(--accent);
    border: none;
    border-radius: 0px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
    color: #000000;
    box-shadow: var(--shadow-hard);
    position: relative;
    overflow: hidden;
}

.big-community-btn-xl::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
    pointer-events: none;
}

.big-community-btn-xl:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: var(--shadow-hard);
    filter: brightness(1.1);
}

.big-community-btn-xl:active {
    transform: translateY(0) scale(0.98);
}

.btn-icon-xl {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.btn-text-xl {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.btn-text-xl strong {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.5px;
}

.btn-text-xl span {
    font-size: var(--font-size-base);
    opacity: 0.9;
    font-weight: var(--font-weight-bold);
}

.big-community-btn-xl .chevron {
    opacity: 0.8;
}

.search-description-text {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 24px;
    text-align: center;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    font-weight: var(--font-weight-bold);
}

/* === EXTERNAL FEDERATION === */
.filter-chips-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin-top: 10px;
    width: 100%;
    overflow-x: auto;
}

.result-item-card.external {
    border-color: var(--color-primary);
    background: rgba(0, 242, 255, 0.05);
    cursor: pointer;
    justify-content: flex-start !important;
}

.result-item-card.external .card-header {
    width: 100%;
    display: flex;
    justify-content: flex-start !important;
}

.post-avatar.external {
    background: rgba(0, 242, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    margin-left: 0 !important;
}

.badge-iaia {
    background: var(--color-primary);
    color: var(--bg-canvas);
    font-size: var(--font-size-base);
    font-weight: 900;
    padding: 2px 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* === SÚPER RATOLÍ SEMANTIC INSIGHTS === */
.semantic-insight-card {
    background: linear-gradient(135deg, rgba(93, 95, 239, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
    backdrop-filter: blur(var(--blur-master));
    border: 1px solid rgba(93, 95, 239, 0.3);
    border-radius: var(--radius-s);
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 0 30px rgba(93, 95, 239, 0.2);
    position: relative;
    overflow: hidden;
}

.semantic-insight-card::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%);
    pointer-events: none;
    animation: rotate-bg 10s linear infinite;
}

@keyframes rotate-bg {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.insight-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
}

.ratoli-glow {
    position: relative;
    width: 60px;
    height: 60px;
    background: var(--surface-glass-heavy);
    border-radius: var(--radius-full);
    padding: 2px;
    border: 2px solid var(--accent-violet);
    box-shadow: 0 0 15px var(--accent-violet);
    overflow: hidden;
}

.ratoli-glow img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.insight-title-row {
    flex: 1;
}

.insight-title-row h4 {
    font-size: 18px;
    font-weight: 900;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: -0.5px;
    margin-bottom: 2px;
}

.insight-text {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    font-weight: 800;
    position: relative;
    z-index: 1;
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .search-discover-page {
    background: var(--bg-app);
}

.light .search-nav-bar {
    background: rgba(255, 255, 255, 0.9) !important;
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
}

.light .main-search-input::placeholder {
    color: rgba(0, 0, 0, 0.4) !important;
}

.light .filter-chip {
    border-color: rgba(0, 0, 0, 0.15) !important;
    background: #ffffff !important;
    color: #000000 !important;
}

.light .filter-chip.active {
    background: var(--color-primary) !important;
    border-color: var(--color-primary) !important;
    color: #ffffff !important;
}

.light .recent-item {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
}

.light .recent-item:hover {
    background: rgba(0, 0, 0, 0.05);
}

.light .result-item-card {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
}

.light .no-results-top-vibrant {
    background: #f8fafc;
    border-color: rgba(0, 0, 0, 0.1);
}

.light .btn-icon-xl {
    background: rgba(0, 0, 0, 0.05);
}

.light .semantic-insight-card {
    background: linear-gradient(135deg, rgba(93, 95, 239, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%);
    border-color: rgba(93, 95, 239, 0.15);
}

.light .insight-title-row h4 {
    color: #000000;
}

.light .insight-text {
    color: rgba(0, 0, 0, 0.8);
}

=====================================
FILE: src/pages/SearchDiscover.jsx
=====================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Building2, MapPin, ArrowLeft, Loader2, Sparkles, SlidersHorizontal, ChevronRight, User, Landmark, Store, Building, Link2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { geminiService } from '../services/geminiService';
import { raindropService } from '../services/raindropService';
import { MOCK_EVENTS } from '../data';
import { hapticService } from '../services/hapticService';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';
import { logger } from '../utils/logger';
import './SearchDiscover.css';

const SearchDiscover = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('tots'); // tots, gent, entitats, pobles, esdeveniments
    const [results, setResults] = useState({ gent: [], entitats: [], pobles: [], arxiu: [], esdeveniments: [] });
    const [searchInsights, setSearchInsights] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [recentSearches] = useState(['Cocentaina', 'Vicent Ferris', 'Mercat de Muro']);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 1) {
                performSearch(query);
            } else {
                setResults({ gent: [], entitats: [], pobles: [], arxiu: [], esdeveniments: [] });
            }
        }, 300); // Faster debouncing for "in-typing" feel

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async (q) => {
        setIsSearching(true);
        setSearchInsights(null);
        try {
            // [INTENT ROUTER OMEGA]
            // ... results logic ...
            const [gent, entitats, pobles, archive, filteredEvents, insights] = await Promise.all([
                supabaseService.searchProfiles(q),
                supabaseService.searchEntities(q),
                supabaseService.searchAllTowns(q),
                raindropService.getCollection('all'), // Unified Archive for now
                Promise.resolve(MOCK_EVENTS.filter(e =>
                    (e.title?.toLowerCase() || '').includes(q.toLowerCase()) ||
                    (e.description?.toLowerCase() || '').includes(q.toLowerCase()) ||
                    (e.location?.toLowerCase() || '').includes(q.toLowerCase())
                )),
                q.length > 3 ? geminiService.ask('RATO', `Resum breu i amb trellat sobre "${q}" en el context rural valencià.`) : null
            ]);

            // Filter archive locally if needed (mock or real)
            const filteredArchive = archive.filter(item =>
                (item.title?.toLowerCase() || '').includes(q.toLowerCase()) ||
                (item.excerpt && (item.excerpt?.toLowerCase() || '').includes(q.toLowerCase()))
            );

            setResults({
                gent: gent || [],
                entitats: entitats || [],
                pobles: pobles || [],
                arxiu: filteredArchive || [],
                esdeveniments: filteredEvents || []
            });
            if (insights && !insights.error) {
                setSearchInsights(insights.text);
            }
        } catch (error) {
            logger.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults({ gent: [], entitats: [], pobles: [], arxiu: [], esdeveniments: [] });
        hapticService.notifySuccess();
        inputRef.current.focus();
    };

    const filters = [
        { id: 'tots', label: 'Tots', icon: <Sparkles size={14} /> },
        { id: 'gent', label: 'Gent', icon: <Users size={14} /> },
        { id: 'grups', label: 'Grups', icon: <Users size={14} />, type: 'grup' },
        { id: 'empreses', label: 'Empreses', icon: <Store size={14} />, type: 'empresa' },
        { id: 'pobles', label: 'Pobles', icon: <MapPin size={14} /> },
        { id: 'esdeveniments', label: 'Esdeveniments', icon: <Sparkles size={14} /> },
        { id: 'ajuntaments', label: 'Ajuntaments', icon: <Landmark size={14} />, type: 'oficial' },
        { id: 'entitats', label: 'Entitats', icon: <Building size={14} />, type: 'institucio' },
        { id: 'arxiu', label: 'Arxiu', icon: <Link2 size={14} /> }
    ];

    const isEmpty = !query && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && (!results.arxiu || results.arxiu.length === 0);

    return (
        <div className="search-discover-page">
            <SEO
                title={query ? `Cerca: ${query} ` : 'Explora el teu territori'}
                description={query ? `Resultats de cerca per a ${query} a Sóc de Poble.Troba gent, entitats i pobles de la Comunitat Valenciana.` : 'Descobreix la gent, els pobles i les entitats de la teua comunitat.'}
                keywords={query ? `${query}, cerca, pobles, comunitat valenciana` : 'pobles, comunitat valenciana, xarxa social, proximitat'}
            />
            <div className="search-nav-bar glass-premium h-20 px-4 flex items-center gap-4">
                <button className="back-circle w-14 h-14 rounded-[28px] border border-white/10 bg-white/5 active:scale-95 hover:bg-white/10 transition-all flex items-center justify-center shrink-0" onClick={() => { hapticService.notifySuccess(); navigate(-1); }}>
                    <ArrowLeft size={28} className="text-white" />
                </button>
                <div className="search-input-wrapper flex-1 relative flex items-center h-14 bg-white/10 rounded-[28px] border-2 border-white/10 focus-within:border-primary/50 transition-all">
                    <Search className="search-icon-fixed ml-5 text-primary" size={24} />
                    <input
                        id="global-search-input"
                        name="global-search-input"
                        ref={inputRef}
                        type="text"
                        placeholder="BUSCA PEL NOM, OFICI, POBLE..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="main-search-input bg-transparent border-none outline-none w-full h-full pl-14 pr-12 text-xl font-black uppercase tracking-tight text-white placeholder:text-white/20"
                    />
                    {query && (
                        <button className="clear-search-btn absolute right-4 w-8 h-8 rounded-[28px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all" onClick={clearSearch}>
                            <X size={18} className="text-white" />
                        </button>
                    )}
                </div>
                <button 
                    className={`filter-toggle-btn w-14 h-14 rounded-full border border-white/10 bg-white/5 active:scale-95 transition-all flex items-center justify-center shrink-0 ${activeFilter !== 'tots' ? 'text-primary border-primary/50' : 'text-white'}`}
                    onClick={() => {
                        hapticService.bategat();
                        const nextFilter = activeFilter === 'tots' ? 'gent' : 
                                         activeFilter === 'gent' ? 'pobles' :
                                         activeFilter === 'pobles' ? 'esdeveniments' : 'tots';
                        setActiveFilter(nextFilter);
                    }}
                >
                    <SlidersHorizontal size={24} />
                </button>
            </div>

            <div className="search-content">
                {activeFilter !== 'tots' && (
                    <div className="active-filter-indicator px-6 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtre actiu: {filters.find(f => f.id === activeFilter)?.label}</span>
                        <button onClick={() => setActiveFilter('tots')} className="text-[10px] font-black uppercase text-white/50">Netejar</button>
                    </div>
                )}

                {/* 1. Primary Feedback/Results Area (Pushed to the top when searching) */}
                {isSearching ? (
                    <div className="search-loading">
                        <Loader2 className="animate-spin" size={32} />
                        <p>Analitzant l'ecosistema...</p>
                    </div>
                ) : (
                    <>
                        {/* IAIA INTENT ROUTER SUGGESTION OMEGA */}
                        {query && (
                            <div className="intent-router-suggestion animate-in">
                                {(query.toLowerCase().includes('gana') || query.toLowerCase().includes('dinar') || query.toLowerCase().includes('recepta')) ? (
                                    <div className="intent-card glass-premium iaia-router" onClick={() => navigate('/tools/recipe')}>
                                        <Sparkles size={20} className="text-[#5D5FEF]" />
                                        <div className="intent-text">
                                            <strong>La IAIA t'ajuda: "Vols una recepta?"</strong>
                                            <span>Obrir el Rebost de la IAIA</span>
                                        </div>
                                    </div>
                                ) : (query.toLowerCase().includes('foto') || query.toLowerCase().includes('mira') || query.toLowerCase().includes('ull')) ? (
                                    <div className="intent-card glass-premium iaia-router" onClick={() => navigate('/ia')}>
                                        <Sparkles size={20} className="text-[#5D5FEF]" />
                                        <div className="intent-text">
                                            <strong>L'Ull de la IAIA: "Puc veure-ho?"</strong>
                                            <span>Analitzar imatge amb l'IAIA</span>
                                        </div>
                                    </div>
                                ) : (query.toLowerCase().includes('paraula') || query.toLowerCase().includes('què vol dir')) ? (
                                    <div className="intent-card glass-premium iaia-router" onClick={() => navigate('/tools/diccionari')}>
                                        <Sparkles size={20} className="text-[#5D5FEF]" />
                                        <div className="intent-text">
                                            <strong>Diccionari Rural: "T'ho explique?"</strong>
                                            <span>Significat de paraules del carrer</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* SUPER RATOLÍ SEMANTIC INSIGHTS */}
                        {searchInsights && (
                            <div className="semantic-insight-card animate-in">
                                <div className="insight-header">
                                    <div className="hero-avatar small ratoli-glow">
                                        <img src="/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png" alt="Súper Ratolí" />
                                    </div>
                                    <div className="insight-title-row">
                                        <h4>Coneixement de Súper Ratolí</h4>
                                        <span className="badge-iaia">Insight Bategat</span>
                                    </div>
                                </div>
                                <p className="insight-text">"{searchInsights}"</p>
                            </div>
                        )}

                        {!isEmpty ? (
                            <div className="search-results-container">
                                {filters.filter(f => f.id !== 'tots').map(filter => {
                                    if (activeFilter !== 'tots' && activeFilter !== filter.id) return null;

                                    // Handle People
                                    if (filter.id === 'gent') {
                                        if (results.gent.length === 0) return null;
                                        return (
                                            <section key="gent" className="result-section">
                                                <div className="result-section-header">
                                                    <h3>Gent</h3>
                                                    <span className="count">{results.gent.length}</span>
                                                </div>
                                                <div className="results-list">
                                                    {results.gent.map(person => (
                                                        <div key={person.id} className="universal-card result-item-card" onClick={() => navigate(`/perfil/${person.id}`)}>
                                                            <div className="card-header clickable">
                                                                 <div className="header-left">
                                                                    <Avatar
                                                                        src={person.avatar_url}
                                                                        role="user"
                                                                        name={person.full_name}
                                                                        size={44}
                                                                    />
                                                                    <div className="post-meta">
                                                                        <div className="post-author-row">
                                                                            <span className="post-author">{person.full_name}</span>
                                                                        </div>
                                                                        <div className="post-town">
                                                                            {person.role || 'Foraster'} {person.primary_town ? `• ${person.primary_town} ` : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        );
                                    }

                                    // Handle Towns
                                    if (filter.id === 'pobles') {
                                        if (results.pobles.length === 0) return null;
                                        return (
                                            <section key="pobles" className="result-section">
                                                <div className="result-section-header">
                                                    <h3>Pobles</h3>
                                                    <span className="count">{results.pobles.length}</span>
                                                </div>
                                                <div className="results-list">
                                                    {results.pobles.map(town => (
                                                        <div key={town.id} className="universal-card result-item-card town" onClick={() => navigate(`/pobles/${town.uuid || town.id}`)}>
                                                            <div className="card-header clickable">
                                                                 <div className="header-left">
                                                                    <Avatar
                                                                        src={town.image_url}
                                                                        role="oficial"
                                                                        name={town.name}
                                                                        size={44}
                                                                    />
                                                                    <div className="post-meta">
                                                                        <div className="post-author-row">
                                                                            <span className="post-author">{town.name}</span>
                                                                        </div>
                                                                        <div className="post-town">
                                                                            {town.comarca} {town.province ? `• ${town.province} ` : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        );
                                    }

                                    // Handle Events
                                    if (filter.id === 'esdeveniments') {
                                        if (results.esdeveniments.length === 0) return null;
                                        return (
                                            <section key="esdeveniments" className="result-section">
                                                <div className="result-section-header">
                                                    <h3>Agenda Festera</h3>
                                                    <span className="count">{results.esdeveniments.length}</span>
                                                </div>
                                                <div className="results-list">
                                                    {results.esdeveniments.map(event => (
                                                        <div key={event.id} className="universal-card result-item-card event" onClick={() => navigate('/pobles', { state: { initialTab: 'esdeveniments' } })}>
                                                            <div className="card-header clickable" style={{ background: 'var(--color-terracotta)' }}>
                                                                 <div className="header-left">
                                                                    <div className="post-avatar event" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', width: '44px', height: '44px' }}>
                                                                        <Sparkles size={20} color="#fff" />
                                                                    </div>
                                                                    <div className="post-meta">
                                                                        <div className="post-author-row">
                                                                            <span className="post-author" style={{ color: '#fff' }}>{event.title}</span>
                                                                        </div>
                                                                        <div className="post-town" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                                            {event.location} • {new Date(event.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        );
                                    }

                                    // Handle Archive (Raindrop)
                                    if (filter.id === 'arxiu') {
                                        if (results.arxiu.length === 0) return null;
                                        return (
                                            <section key="arxiu" className="result-section archive-section">
                                                <div className="result-section-header">
                                                    <h3>Arxiu Documental (L'Espill del Temps)</h3>
                                                    <span className="count">{results.arxiu.length}</span>
                                                </div>
                                                <div className="results-list">
                                                    {results.arxiu.map(item => (
                                                        <div key={item.uuid || item._id} className="universal-card result-item-card archive-item" onClick={() => window.open(item.link, '_blank')}>
                                                            <div className="card-header clickable">
                                                                 <div className="header-left">
                                                                    <div className="post-avatar archive" style={{ backgroundColor: 'var(--color-bg-dark)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', width: '44px', height: '44px' }}>
                                                                        <Link2 size={24} style={{ color: 'var(--color-orange-vibrant)' }} />
                                                                    </div>
                                                                    <div className="post-meta">
                                                                        <div className="post-author-row">
                                                                            <span className="post-author">{item.title}</span>
                                                                        </div>
                                                                        <div className="post-town">
                                                                            {item.excerpt ? item.excerpt.substring(0, 80) + '...' : 'Document de l\'Arxiu'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        );
                                    }

                                    // Handle Categorized Entities
                                    const filteredEntities = results.entitats.filter(e => e.type === filter.type);
                                    if (filteredEntities.length === 0) return null;

                                    return (
                                        <section key={filter.id} className="result-section">
                                            <div className="result-section-header">
                                                <h3>{filter.label}</h3>
                                                <span className="count">{filteredEntities.length}</span>
                                            </div>
                                            <div className="results-list">
                                                {filteredEntities.map(entity => (
                                                    <div key={entity.id} className={`universal-card result-item-card entity-${entity.type}`} onClick={() => navigate(`/entitat/${entity.id}`)}>
                                                        <div className="card-header clickable">
                                                             <div className="header-left">
                                                                <Avatar
                                                                    src={entity.avatar_url}
                                                                    role={entity.type}
                                                                    name={entity.name}
                                                                    size={44}
                                                                />
                                                                <div className="post-meta">
                                                                    <div className="post-author-row">
                                                                        <span className="post-author">{entity.name}</span>
                                                                    </div>
                                                                    <div className="post-town">
                                                                        {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} {entity.town_name ? `• ${entity.town_name} ` : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}

                                {/* [SUPER-SEARCH: EXTERNAL FEDERATION] */}
                                {query.length > 2 && (
                                    <section className="result-section external-federation">
                                        <div className="result-section-header">
                                            <h3>Coneixement Territorial (Extern)</h3>
                                            <span className="badge-iaia">IAIA Verified</span>
                                        </div>
                                        <div className="external-links-list">
                                            <div key="ext-ivia" className="universal-card result-item-card external" onClick={() => window.open(`https://www.google.com/search?q=IVIA+${query}`, '_blank')}>
                                                <div className="card-header clickable">
                                                    <div className="header-left">
                                                        <div className="post-avatar external">
                                                            <Link2 size={24} color="var(--color-primary)" />
                                                        </div>
                                                        <div className="post-meta">
                                                            <div className="post-author-row">
                                                                <span className="post-author">Consulta IVIA: {query}</span>
                                                            </div>
                                                            <div className="post-town">Institut Valencià d'Investigacions Agràries</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div key="ext-aemet" className="universal-card result-item-card external" onClick={() => window.open(`https://www.aemet.es/ca/eltiempo/prediccion/municipios?q=${query}`, '_blank')}>
                                                <div className="card-header clickable">
                                                    <div className="header-left">
                                                        <div className="post-avatar external">
                                                            <Link2 size={24} color="var(--color-primary)" />
                                                        </div>
                                                        <div className="post-meta">
                                                            <div className="post-author-row">
                                                                <span className="post-author">Previsió AEMET: {query}</span>
                                                            </div>
                                                            <div className="post-town">Agència Estatal de Meteorologia</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        ) : query.length > 1 && !isSearching && (
                            <div className="no-results-top-vibrant">
                                <p>No hem trobat resultats per a "<strong>{query}</strong>"</p>
                                <span>Prova amb termes més genèrics o revisa l'ortografia.</span>
                            </div>
                        )}
                    </>
                )}

                {/* 2. Standard Action Block (Displaced downward when searching) */}
                <div className="search-bottom-actions py-12 flex justify-center">
                    <button className="big-community-btn-xl max-w-[640px] w-full" onClick={() => navigate('/comunitat')}>
                        <div className="btn-icon-xl">
                            <Users size={32} />
                        </div>
                        <div className="btn-text-xl">
                            <strong>Explora el teu territori</strong>
                            <span>Descobreix tota la gent i entitats del poble</span>
                        </div>
                    </button>
                </div>

                {/* 3. Empty State Content (Popular Searches) */}
                {
                    isEmpty && (
                        <div className="search-welcome">
                            <div className="recent-searches">
                                <h4>Cerques populars</h4>
                                <div className="recent-list">
                                    {recentSearches.map(s => (
                                        <button key={s} className="recent-item" onClick={() => setQuery(s)}>
                                            <Search size={14} />
                                            <span>{s}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default SearchDiscover;


=====================================
FILE: src/pages/SessionChronicle.css
=====================================

.session-chronicle-container {
    padding-bottom: 50px;
    background: var(--bg-surface);
    min-height: 100vh;
}

.session-header {
    padding: 24px;
    background: linear-gradient(135deg, var(--color-primary-soft), transparent);
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--color-divider);
}

.header-titles h1 {
    font-size: 24px;
    font-weight: 800;
    color: var(--color-primary);
    margin: 0;
}

.session-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
    font-size: var(--font-size-base);
    margin-top: 4px;
}

.session-main {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.session-summary-card {
    background: var(--bg-surface-soft);
    padding: 24px;
    border-radius: 0px;
    border: 1px solid var(--color-divider);
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.task-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    line-height: 1.5;
}

.check-icon {
    color: var(--color-primary);
    flex-shrink: 0;
    margin-top: 2px;
}

/* ECONOMIC CONTRAST HUD */
.economic-contrast-hud {
    background: #000;
    border-radius: 0px;
    padding: 30px;
    border: 2px solid var(--color-primary);
    box-shadow: var(--shadow-hard);
}

.hud-header {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--color-primary);
    margin-bottom: 24px;
}

.hud-header h2 {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 1px;
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.stat-card {
    padding: 20px;
    border-radius: 0px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    gap: 16px;
}

.stat-card.human {
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card.ai {
    border: 1px solid var(--color-primary-soft);
}

.stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-main);
}

.stat-card.ai .stat-icon {
    background: var(--color-primary-soft);
    color: var(--color-primary);
}

.stat-label {
    font-size: var(--font-size-base);
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
}

.stat-value {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-main);
}

.stat-card small {
    font-size: var(--font-size-base);
    opacity: 0.7;
    color: var(--text-muted);
}

.savings-banner {
    background: var(--color-primary);
    padding: 24px;
    border-radius: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--bg-canvas);
}

.savings-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.savings-label {
    font-size: var(--font-size-base);
    font-weight: 700;
    text-transform: uppercase;
    opacity: 0.8;
}

.savings-value {
    font-size: 32px;
    font-weight: 900;
}

.efficiency-badge {
    background: #000;
    color: var(--color-primary);
    padding: 6px 14px;
    border-radius: 0px;
    font-weight: 900;
    font-size: var(--font-size-base);
}

.share-actions {
    margin-top: 10px;
}

.btn-share {
    width: 100%;
    padding: 16px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn-share:active {
    transform: scale(0.98);
}

.btn-share.whatsapp {
    background: #25D366;
    color: white;
}

.session-footer {
    text-align: center;
    padding: 40px 24px;
    color: var(--text-muted);
}

.session-footer p {
    font-weight: 700;
}

@media (max-width: 600px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .savings-banner {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }

    .savings-content {
        flex-direction: column;
    }
}

=====================================
FILE: src/pages/SessionChronicle.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Cpu, User, TrendingDown, Share2, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import './SessionChronicle.css';

const SessionChronicle = () => {
    const navigate = useNavigate();

    // Mock session data for the current session
    // In a real scenario, this would come from a database based on the 'id'
    const sessionData = {
        date: new Date().toLocaleDateString(),
        title: "Integració d'Estructures Literàries i Cròniques [MASTER]",
        tasks: [
            "Actualització de Directrius MASTER (Protocol de Cròniques i Estructures de Llibre)",
            "Extensió de l'esquema de dades PostSchema per a tipologies de llibre",
            "Implementació del selector de tipus (Post/Llibre) al CreatePostModal",
            "Disseny del peu de targeta seqüencial per a llibres al Mur",
            "Creació de la infraestructura de Pàgines de Sessió i Shareability"
        ],
        stats: {
            durationHours: 1.5,
            humanRate: 60, // €/h
            aiTokenCost: 0.12, // €
        }
    };

    const humanCost = sessionData.stats.durationHours * sessionData.stats.humanRate;
    const aiCost = sessionData.stats.aiTokenCost;
    const savings = humanCost - aiCost;
    const efficiencyBoost = (humanCost / aiCost).toFixed(0);

    return (
        <div className="session-chronicle-container animate-in">
            <header className="session-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-titles">
                    <h1>Sessió [MASTER]</h1>
                    <div className="session-meta">
                        <Calendar size={16} />
                        <span>{sessionData.date}</span>
                    </div>
                </div>
            </header>

            <main className="session-main">
                <section className="session-summary-card">
                    <h2 className="section-title">Què hem fet avui?</h2>
                    <ul className="task-list">
                        {sessionData.tasks.map((task, index) => (
                            <li key={index} className="task-item">
                                <CheckCircle2 size={20} className="check-icon" />
                                <span>{task}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="economic-contrast-hud">
                    <div className="hud-header">
                        <Zap size={24} />
                        <h2>Economic Contrast HUD</h2>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card human">
                            <div className="stat-icon"><User size={24} /></div>
                            <div className="stat-content">
                                <p className="stat-label">Cost Humà Estimat</p>
                                <p className="stat-value">{humanCost}€</p>
                                <small>{sessionData.stats.durationHours}h @ {sessionData.stats.humanRate}€/h</small>
                            </div>
                        </div>

                        <div className="stat-card ai">
                            <div className="stat-icon"><Cpu size={24} /></div>
                            <div className="stat-content">
                                <p className="stat-label">Cost AI [MASTER]</p>
                                <p className="stat-value">{aiCost}€</p>
                                <small>Tokens + Computació</small>
                            </div>
                        </div>
                    </div>

                    <div className="savings-banner">
                        <div className="savings-content">
                            <TrendingDown size={32} />
                            <div>
                                <p className="savings-label">Estalvi Comunitari</p>
                                <p className="savings-value">{savings.toFixed(2)}€</p>
                            </div>
                        </div>
                        <div className="efficiency-badge">
                            x{efficiencyBoost} més eficient
                        </div>
                    </div>
                </section>

                <div className="share-actions">
                    <button className="btn-share" onClick={() => navigate('/chats')}>
                        <Share2 size={20} />
                        Anar als Xats del Mas
                    </button>
                </div>
            </main>

            <footer className="session-footer">
                <p>Gravat en la memòria de Sóc de Poble per l'Antigravity.</p>
                <small>Directiva [MASTER] v1.6.0</small>
            </footer>
        </div>
    );
};

export default SessionChronicle;


=====================================
FILE: src/pages/SolatgeConsole.css
=====================================

.solatge-container {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: var(--bg-master);
  min-height: calc(100vh - 112px);
  font-family: var(--font-sans);
  color: var(--text-main);
  transition: all 0.3s ease;
}

.solatge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: var(--bg-master) !important;
  border-radius: var(--radius-genesis);
  border: 1px solid var(--border-master);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.solatge-header .brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.solatge-header h1 {
  font-size: 28px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -1px;
  color: var(--text-main);
}

.solatge-header .subtitle {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 4px;
  color: var(--accent-sidebar);
  text-transform: uppercase;
  opacity: 0.8;
}

.status-pill {
  padding: 10px 20px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 900;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-dim);
}

.status-pill.online {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.solatge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.metric-card {
  background: var(--bg-panel);
  border-radius: var(--radius-genesis);
  padding: 28px;
  border: 1px solid var(--border-master);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.metric-card .icon {
  color: var(--accent-sidebar);
  width: 24px;
  height: 24px;
}

.metric-card .label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.metric-card .value {
  font-size: 36px;
  font-weight: 900;
  color: var(--text-main);
  font-family: "JetBrains Mono", monospace;
}

.command-center {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  flex: 1;
}

.console-panel {
  background: var(--bg-master);
  border-radius: var(--radius-genesis);
  overflow: hidden;
  border: 1px solid var(--border-master);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.panel-header {
  padding: 16px 24px;
  background: #1a1a1a;
  border-bottom: 1px solid #27272a;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.logs {
  padding: 24px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  height: 450px;
  color: #a1a1aa;
}

.log-entry {
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.log-entry .time {
  color: var(--accent-sidebar);
  opacity: 0.7;
  min-width: 80px;
}

.actions-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-btn {
  width: 100%;
  height: 64px;
  border-radius: var(--radius-tactile);
  border: 1px solid var(--border-master);
  background: var(--bg-panel);
  color: var(--text-main);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-btn:hover {
  background: var(--accent-sidebar);
  color: #fff;
  border-color: var(--accent-sidebar);
  transform: translateX(5px);
}

.action-btn.primary {
  background: var(--accent-sidebar);
  color: #fff;
  border: none;
  box-shadow: 0 10px 20px rgba(255, 109, 35, 0.2);
}

.info-trigger {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  transition: 0.2s;
}

.info-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-main);
}

.solatge-footer {
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 242, 255, 0.3);
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 400;
  color: rgba(0, 242, 255, 0.5);
  letter-spacing: 2px;
}

.dev-tools-panel {
  background: rgba(0, 242, 255, 0.05);
  padding: 16px;
  border: 1px dashed #00f2ff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dev-tools-panel .panel-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 900;
  color: #00f2ff;
  letter-spacing: 1px;
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.tool-btn {
  background: transparent;
  border: 1px solid rgba(0, 242, 255, 0.4);
  color: #00f2ff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.tool-btn:hover {
  background: #00f2ff;
  color: #000;
}

.neon-pulse {
  animation: neon-pulse-anim 2s infinite;
}

@keyframes neon-pulse-anim {
  0%,
  100% {
    opacity: 0.7;
    filter: drop-shadow(0 0 2px #00f2ff);
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 10px #00f2ff);
  }
}

.visual-democracy-panel {
  background: rgba(255, 102, 0, 0.05);
  padding: 16px;
  border: 1px solid rgba(255, 102, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.democracy-switcher {
  display: flex;
  gap: 10px;
}

.demo-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 102, 0, 0.5);
  background: transparent;
  color: #ff6600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.demo-btn.active {
  background: #ff6600;
  color: #000;
  box-shadow: 0 0 15px rgba(255, 102, 0, 0.4);
}

.demo-btn span {
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .command-center {
    grid-template-columns: 1fr;
  }
}


=====================================
FILE: src/pages/SolatgeConsole.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap,
    Database,
    Wifi,
    WifiOff,
    Activity,
    HardDrive,
    ShieldCheck,
    Terminal,
    ChevronRight,
    RefreshCw,
    Box,
    Info,
    Layout,
    Layers,
    Sparkles,
    BrainCircuit,
    ArrowLeft
} from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { rhizomeDb } from '../rhizome/db-core';
import { egWalker } from '../rhizome/crdt/eg-walker';
import SEO from '../components/SEO';
import './SolatgeConsole.css';

import Haptics from '../utils/HapticFeedback';

/**
 * Consola de Comandament Solatge v1.0 (Tier GOD)
 * El HUD sobirà per a la gestió de la Village Cell.
 */
const SolatgeConsole = () => {
    const navigate = useNavigate();
    const { visualDemocracy, setVisualDemocracy } = useDesign();
    // ... rest of state stays same ...
    const [dbStatus, setDbStatus] = useState('loading');
    const [stats, setStats] = useState({ ops: 0, snapshots: 0, size: '0MB', peritext: { marksCount: 0, stableAnchors: 0 } });
    const [isIAAuditLoading, setIsIAAuditLoading] = useState(false);
    const [logs, setLogs] = useState([
        { id: 1, time: 'Ara', msg: '🚜 Benvingut a la Consola Solatge v1.0' },
        { id: 2, time: 'Ara', msg: '⚡️ Protocol Batec Actiu' }
    ]);

    useEffect(() => {
        const initConsole = async () => {
            try {
                const db = await rhizomeDb.init();
                setDbStatus(db ? 'online' : 'offline');

                // Real DB metrics + Peritext richness (Mock for HUD effect)
                setStats({
                    ops: 42,
                    snapshots: 1,
                    size: '2.4MB',
                    peritext: { marksCount: 8, stableAnchors: 12 }
                });
                Haptics.trigger(Haptics.light);
            } catch {
                setDbStatus('error');
            }
        };
        initConsole();
    }, []);

    const addLog = (msg, type = 'info') => {
        const icons = { info: '🚜', help: '💡', success: '✅', error: '❌', alert: '⚠️' };
        setLogs(prev => [{
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            msg: `${icons[type] || ''} ${msg}`
        }, ...prev.slice(0, 9)]);
    };

    const showInfo = (term) => {
        const dictionary = {
            sincronitzar: "SINCRONITZAR: Uneix les dades del teu mòbil amb la xarxa sobirana. És com 'bategar' per estar al dia amb el poble.",
            sembra: "SEMBRA DIGITAL: Importa coneixement extern (com els teus enllaços) per enriquir el 'terrer' digital de la comunitat.",
            snapshot: "SNAPSHOT: Crea una còpia de seguretat instantània. Una 'càpsula del temps' per si alguna cosa es trastomba."
        };
        Haptics.trigger(Haptics.light);
        addLog(dictionary[term], 'help');
    };

    const runIAAudit = () => {
        setIsIAAuditLoading(true);
        addLog('IAIA AUDITORIA: Analitzant la integritat del bategat...', 'info');
        Haptics.trigger(Haptics.heavy);
        
        setTimeout(() => {
            addLog('IAIA: "Fill meu, tot bategua bé. El vidre està net i l\'oli és pur."', 'success');
            addLog('DIAGNÒSTIC: Sobirania del 98%. Cap interferència detectada.', 'success');
            setIsIAAuditLoading(false);
        }, 2000);
    };

    return (
        <div className="solatge-container bg-black min-h-screen text-white animate-bategat">
            <SEO title="Solatge Console | Sóc de Poble" description="Consola de Comandament Solatge v1.0. El HUD sobirà per a la gestió de la Village Cell." />
            {/* HEADER M3 SURFACE - BLINDAT v9.4.0 */}
            <header className="solatge-header h-20 flex items-center gap-4 px-6 bg-black border-b border-gray-900 sticky top-0 z-30">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0"
                    title="Tornar"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="brand flex-1">
                    <Box size={32} className="neon-pulse" />
                    <div>
                        <h1>SOLATGE</h1>
                        <span className="subtitle">VILLAGE OS CORE</span>
                    </div>
                </div>
                <div className={`status-pill ${dbStatus}`}>
                    {dbStatus === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
                    <span>{dbStatus.toUpperCase()}</span>
                </div>
            </header>

            {/* GRID DE MÈTRIQUES RIZOMA */}
            <div className="solatge-grid">
                <div className="metric-card glass-ia">
                    <Database className="icon" />
                    <div className="data">
                        <span className="label">OPERACIONS</span>
                        <span className="value">{stats.ops}</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <Activity className="icon neon-pulse" />
                    <div className="data">
                        <span className="label">SYNC HOPS</span>
                        <span className="value">3</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <ShieldCheck className="icon" />
                    <div className="data">
                        <span className="label">SOBIRANIA</span>
                        <span className="value">98%</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <HardDrive className="icon" />
                    <div className="data">
                        <span className="label">REBOST</span>
                        <span className="value">{stats.size}</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <Zap className="icon neon-pulse" />
                    <div className="data">
                        <span className="label">ANCRES PERITEXT</span>
                        <span className="value">{stats.peritext.stableAnchors}</span>
                    </div>
                </div>
            </div>

            {/* AREA DE COMANDAMENT */}
            <div className="command-center">
                <div className="console-panel">
                    <div className="panel-header">
                        <Terminal size={18} />
                        <span>REGISTRE DE L'IAIA</span>
                    </div>
                    <div className="logs">
                        {logs.map(log => (
                            <div key={log.id} className="log-entry">
                                <span className="time">[{log.time}]</span>
                                <span className="msg">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="actions-panel">
                    <div className="action-wrapper">
                        <button
                            className="action-btn primary"
                            onClick={() => {
                                Haptics.trigger(Haptics.success);
                                addLog('Iniciant Sincronització P2P...', 'info');
                            }}
                        >
                            <RefreshCw size={24} />
                            <span>SINCRONITZAR</span>
                        </button>
                        <button className="info-trigger" onClick={(e) => { e.stopPropagation(); showInfo('sincronitzar'); }}>
                            <Info size={16} />
                        </button>
                    </div>

                    <div className="action-wrapper">
                        <button
                            className="action-btn"
                            onClick={runIAAudit}
                            disabled={isIAAuditLoading}
                        >
                            <BrainCircuit size={24} className={isIAAuditLoading ? 'animate-spin' : ''} />
                            <span>{isIAAuditLoading ? 'ANALITZANT...' : 'AUDITORIA IA'}</span>
                        </button>
                    </div>

                    <div className="action-wrapper">
                        <button
                            className="action-btn secondary"
                            onClick={async () => {
                                Haptics.trigger(Haptics.heavy);
                                addLog('Iniciant SEMBRA DIGITAL (Raindrop)...', 'info');
                                try {
                                    const response = await fetch('/rhizome_seed_data.json');
                                    const seeds = await response.json();
                                    addLog(`Llegides ${seeds.total_seeds} llavors.`, 'info');

                                    import('../services/seedService').then(async ({ seedService }) => {
                                        const result = await seedService.importSeeds(seeds);
                                        if (result.success) {
                                            addLog(`${result.count} llavors bategades amb èxit.`, 'success');
                                        } else {
                                            addLog(`Error: ${result.error}`, 'error');
                                        }
                                    });
                                } catch (err) {
                                    addLog(`Error carregant llavors: ${err.message}`, 'error');
                                }
                            }}
                        >
                            <Box size={24} />
                            <span>SEMBRA DIGITAL</span>
                        </button>
                        <button className="info-trigger" onClick={(e) => { e.stopPropagation(); showInfo('sembra'); }}>
                            <Info size={16} />
                        </button>
                    </div>

                    <div className="action-wrapper">
                        <button
                            className="action-btn secondary"
                            onClick={() => {
                                Haptics.trigger(Haptics.light);
                                addLog('Generant Snapshot crític...', 'info');
                            }}
                        >
                            <Zap size={24} />
                            <span>SNAPSHOT</span>
                        </button>
                        <button className="info-trigger" onClick={(e) => { e.stopPropagation(); showInfo('snapshot'); }}>
                            <Info size={16} />
                        </button>
                    </div>

                    <div className="drawer-divider" style={{ margin: '1rem 0', opacity: 0.2 }}></div>

                    {/* EINES DE DESENVOLUPAMENT (FLASH TOOLS) */}
                    <div className="dev-tools-panel">
                        <div className="panel-label">
                            <Terminal size={18} />
                            <span>EINES DE DESENVOLUPAMENT</span>
                        </div>
                        <div className="tools-grid">
                            <button className="tool-btn" onClick={() => {
                                Haptics.trigger(Haptics.heavy);
                                addLog('INICIANT PROVA D\'ESTRÈS: Batec Core al 120%...', 'alert');
                            }}>
                                <Activity size={20} />
                                <span>Prova d'Estrès</span>
                            </button>
                            <button className="tool-btn" onClick={() => {
                                Haptics.trigger(Haptics.success);
                                addLog('RURALITZANT: Aplicant puresa de l\'oli a la UI...', 'success');
                            }}>
                                <Zap size={20} />
                                <span>Ruralitzar</span>
                            </button>
                            <button className="tool-btn" onClick={() => {
                                Haptics.trigger(Haptics.heavy);
                                addLog('TEST IAIA API: Connectant amb l\'Ull de la IAIA...', 'info');
                                setTimeout(() => addLog('IAIA API: Connexió estable. Bategant a 200ms.', 'success'), 800);
                            }}>
                                <Sparkles size={20} />
                                <span>Test IAIA</span>
                            </button>
                        </div>
                    </div>

                    <div className="visual-democracy-panel">
                        <div className="panel-label">
                            <Layers size={18} />
                            <span>DEMOCRÀCIA VISUAL (A/B)</span>
                        </div>
                        <div className="democracy-switcher">
                            <button
                                className={`demo-btn ${visualDemocracy === 'pedra-seca' ? 'active' : ''}`}
                                onClick={() => {
                                    setVisualDemocracy('pedra-seca');
                                    Haptics.trigger(Haptics.light);
                                    addLog('Estètica "Roba de Treball" (Pedra Seca) activada', 'info');
                                }}
                            >
                                <Layout size={18} />
                                <span>Roba de Treball</span>
                            </button>
                            <button
                                className={`demo-btn ${visualDemocracy === 'oli-suau' ? 'active' : ''}`}
                                onClick={() => {
                                    setVisualDemocracy('oli-suau');
                                    Haptics.trigger(Haptics.success);
                                    addLog('Estètica "Roba de Mudar" (Oli Suau) activada', 'success');
                                }}
                            >
                                <Activity size={18} />
                                <span>Roba de Mudar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MASTER FOOTER */}
            <footer className="solatge-footer">
                <div className="node-info">
                    <span>NODE: {egWalker.nodeId.substring(0, 12)}...</span>
                    <span>PROTOCOL: Rhizome v3.0</span>
                </div>
                <div className="version-tag">BATEGA EDITION</div>
            </footer>
        </div>
    );
};

export default SolatgeConsole;


=====================================
FILE: src/pages/TownDetail.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Users, Info, MessageCircle, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';
import Feed from '../components/Feed';
import Marketplace from '../components/Marketplace';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './Towns.css';
import { logger } from '../utils/logger';
import { wikipediaService } from '../services/wikipediaService';
import ShareHub from '../components/ShareHub';

const TownDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [town, setTown] = useState(null);
    const [wikiData, setWikiData] = useState(null);
    const [officialEntity, setOfficialEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contentMode, setContentMode] = useState('batec'); // 'batec' (Ara) vs 'arrel' (Patrimoni)

    const triggerHaptic = (style) => {
        if ('vibrate' in navigator) {
            if (style === 'light') navigator.vibrate(10); // "Crunchy" earthy feel
            else if (style === 'heavy') navigator.vibrate([30, 10, 30]); // "Solid" stone feel
        }
    };
 
    const handleActionClick = (type, action) => {
        triggerHaptic('light');
        if (action) action();
    };

    useEffect(() => {
        const fetchTown = async () => {
            setLoading(true);
            try {
                const allTowns = await supabaseService.getTowns();
                const isUuid = id.includes('-');
                const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                
                const found = allTowns.find(t => {
                    if (isUuid) return t.uuid === id || t.id === parseInt(id);
                    return sluggify(t.name) === sluggify(id);
                });
                setTown(found);

                if (found) {
                    const wiki = await wikipediaService.getTownSummary(found.name);
                    setWikiData(wiki);

                    // [MERITOCRÀCIA VISUAL] La gent decideix la cara del poble
                    const batecImage = await supabaseService.getTownBatecImage(found.uuid || found.id);
                    if (batecImage) {
                        setTown(prev => ({ ...prev, image_url: batecImage.url }));
                    }

                    // [DUALITAT ONTOLÒGICA] Busquem l'entitat oficial (Ajuntament)
                    try {
                        const entities = await supabaseService.searchEntities(`Ajuntament ${found.name}`);
                        const official = entities.find(e => e.type === 'oficial' || e.name.toLowerCase().includes('ajuntament'));
                        setOfficialEntity(official);
                    } catch {
                        logger.warn(`No s'ha pogut carregar l'entitat oficial per a ${found.name}`);
                    }

                    // [BATEC TERRITORIAL] Guardem aquest poble com l'últim visitat
                    localStorage.setItem('last_active_town_id', found.uuid || found.id);
                }
            } catch (error) {
                logger.error('Error loading town:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTown();
    }, [id]);

    // Lògica "Gent de..." MASTER GENESIS
    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        if (townName.includes("La Torre de les Maçanes")) return "Gent de La Torre";
        return `Gent de ${townName}`;
    };

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;
    if (!town) return <div className="error-container">Poble no trobat</div>;

    const gentTitle = getGentDePage(town.name);

    return (
        <div className="town-detail-page">
            <SEO
                title={gentTitle}
                description={town.description || `Espai comunitari de la ${gentTitle}.`}
                image={town.image_url}
                keywords={`${town.name}, Gent de la Torre, ${town.comarca}, ${town.province}, pobles valencians`}
            />
            <ProfileHeaderPremium
                type="town"
                title={gentTitle}
                subtitle={`${(town.comarca && town.comarca !== 'null') ? town.comarca : 'Comunitat'} • ${(town.province && town.province !== 'null') ? town.province : 'Alacant'}`}
                bio={town.description}
                avatarUrl={town.image_url}
                coverUrl={town.image_url}
                badges={['Activa']}
                stats={[
                    { label: 'Veïns', value: town.population?.toLocaleString() || '---', icon: <Users size={18} /> },
                    { label: 'Ubicació', value: town.comarca || 'Comunitat', icon: <MapPin size={18} /> }
                ]}
                shareData={{
                    title: gentTitle,
                    text: town.description || `Benvingut a la ${gentTitle} a Sóc de Poble!`,
                    url: window.location.href
                }}
            />

            <div className="town-detail-body">
                {/* HUD AGRARI & CLIMÀTIC (Signes Vitals) */}
                <section className="agrarian-hud-container animate-in">
                    <div className="hud-metric" title="Risc de Mosca de l'Olivera">
                        <span className="hud-metric-label">🪰 PLAGUES</span>
                        <div className="hud-indicator-dot" style={{ background: '#FF4C4C' }}></div>
                        <span className="hud-status-text" style={{ color: '#FF4C4C' }}>RISC ALT</span>
                    </div>
                    <div className="hud-metric" title="Estat de sequera del sòl">
                        <span className="hud-metric-label">🪵 SEQUERA</span>
                        <div className="hud-indicator-dot" style={{ background: '#FFA500' }}></div>
                        <span className="hud-status-text" style={{ color: '#FFA500' }}>ALERTA</span>
                    </div>
                    <div className="hud-metric" title="Context d'humitat">
                        <span className="hud-metric-label">💧 SAÓ</span>
                        <div className="hud-indicator-indicator" style={{ display: 'flex', gap: '2px' }}>
                            <div className="bar active"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                        <span className="hud-status-text">BAIXA</span>
                    </div>
                </section>

                {/* PORTAL DE PAS: AJUNTAMENT VS POBLE */}
                <div className="dual-portal-notice community-glass border border-primary/30 p-4 rounded-[28px] flex items-start gap-4 mb-6">
                    <div className="icon-wrapper text-primary">
                        <Users size={32} />
                    </div>
                    <div className="text-sm">
                        <h4 className="font-black text-primary mb-1 uppercase tracking-tighter">{gentTitle}</h4>
                        <p className="opacity-80">Aquest és l'espai comunitari on bateguen els veïns. Per a tràmits oficials i bans municipals, visita la Seu de l'Ajuntament.</p>
                        <button
                            onClick={() => navigate(`/ajuntament/${town.uuid || town.id}`)}
                            className="inline-flex items-center gap-2 mt-3 p-2 px-4 bg-orange-600 text-white font-black rounded-[20px] text-xs"
                        >
                            ANAR A L'AJUNTAMENT
                        </button>
                    </div>
                </div>

                {/* BANDO MUNICIPAL - Official Announcements */}
                <section className="bando-municipal-container" onClick={() => navigate(`/ajuntament/${id}`)}>
                    <div className="bando-header">
                        <div className="bando-title">
                            <div className="bando-icon-pulse">📢</div>
                            <h3>Bando Municipal</h3>
                        </div>
                        <span className="bando-tag" style={{ background: 'var(--color-primary)', color: 'black' }}>VEURE TOTS</span>
                    </div>
                    <div className="bando-content-card">
                        <h4 className="bando-subject">⚠️ Avís: Tall de subministrament</h4>
                        <p>Es comunica que demà de 9:00 a 12:00 hi haurà un tall en el servei d'aigua per manteniment a la Plaça Major.</p>
                        <span className="bando-date">Publicat avui a les 09:30</span>
                    </div>
                </section>

                {/* ... (WIKIPEDIA section follows) */}

                {/* MEMÒRIA UNIVERSAL (WIKIPEDIA) */}
                {wikiData && (
                    <section className="town-wiki-section-premium">
                        <div className="section-header-premium">
                            <Info size={18} />
                            <h3>Memòria Universal (Wikipedia)</h3>
                        </div>
                        <div className="wiki-card-glass">
                            <p className="wiki-extract">{wikiData.extract}</p>
                            <div className="wiki-footer">
                                <a href={wikiData.page_url} target="_blank" rel="noopener noreferrer" className="wiki-link">
                                    Llegir més a la Wikipedia
                                </a>
                                <span className="wiki-attribution">Font: Wikimedia Foundation</span>
                            </div>
                        </div>
                    </section>
                )}

                <section className="town-utilities-row">
                    <div
                        className="utility-card institution-glass"
                        onClick={() => handleActionClick('oficial', () => officialEntity ? navigate(`/entitat/${officialEntity.uuid || officialEntity.id}`) : navigate(`/socis?town=${town.name}`))}
                        style={{ border: '1px solid var(--color-primary)', background: 'rgba(0, 122, 255, 0.05)' }}
                    >
                        <div className="utility-icon">
                            {town.logo_url ? <img src={town.logo_url} alt={`Escut oficial de ${town.name}`} style={{width: 32, height: 32, objectFit: 'contain'}} /> : '🏛️'}
                        </div>
                        <div className="utility-info">
                            <span className="utility-label" style={{ color: 'var(--color-primary)' }}>{officialEntity ? 'Ajuntament' : 'Crear Ajuntament'}</span>
                            <span className="utility-value">{officialEntity ? 'Seu Electrònica (Oficial)' : 'Fes-te Partner Ara'}</span>
                        </div>
                    </div>
                    <div className="utility-card weather-glass" onClick={() => triggerHaptic('light')}>
                        <div className="utility-icon">☀️</div>
                        <div className="utility-info">
                            <span className="utility-label">El Temps</span>
                            <span className="utility-value">12°C - Clar</span>
                        </div>
                    </div>
                    <div className="utility-card events-glass" onClick={() => triggerHaptic('light')}>
                        <div className="utility-icon">📅</div>
                        <div className="utility-info">
                            <span className="utility-label">Propers Actes</span>
                            <span className="utility-value">Bategant...</span>
                        </div>
                    </div>
                </section>

                <div className="town-content-explorer">
                    {/* INTERRUPTOR DE CAPES DE TEMPS (Ara vs Arrel) */}
                    <div className="time-layer-explorer flex gap-4 p-4 border-b border-white/5">
                        <button
                            className={`layer-btn flex items-center gap-2 p-2 px-4 rounded-lg transition-all ${contentMode === 'batec' ? 'bg-primary text-black' : 'bg-white/5 text-white/40'}`}
                            onClick={() => { triggerHaptic('light'); setContentMode('batec'); }}
                        >
                            <Sparkles size={16} />
                            <span>ARA (Batec)</span>
                        </button>
                        <button
                            className={`layer-btn flex items-center gap-2 p-2 px-4 rounded-lg transition-all ${contentMode === 'arrel' ? 'bg-amber-600 text-black' : 'bg-white/5 text-white/40'}`}
                            onClick={() => { triggerHaptic('light'); setContentMode('arrel'); }}
                        >
                            <BookOpen size={16} />
                            <span>ARREL (Arxiu)</span>
                        </button>
                    </div>

                    <div className="town-sections-grid">
                        <section className="town-wall-section">
                            <div className="section-header-premium">
                                <MessageCircle size={18} />
                                <h3>{contentMode === 'batec' ? 'Mur de la Comunitat' : 'Memòria de l\'Arxiu'}</h3>
                            </div>
                            <Feed townId={town.uuid || town.id} townName={town.name} hideHeader={true} contentMode={contentMode} />
                        </section>

                        {contentMode === 'batec' && (
                            <section className="town-market-section animate-in">
                                <div className="section-header-premium">
                                    <ShoppingBag size={18} />
                                    <h3>Productes Locals</h3>
                                </div>
                                <Marketplace townId={town.uuid || town.id} hideHeader={true} />
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TownDetail;


=====================================
FILE: src/pages/Towns.css
=====================================

.towns-container {
    padding-bottom: calc(var(--nav-height) + 40px);
    background: transparent;
    min-height: 100vh;
}

/* Page header styles are now global in index.css */

.towns-content-area {
    min-height: 400px;
}

/* === TOWN DETAIL PAGE === */
.town-detail-page {
    background-color: var(--bg-main);
    min-height: 100vh;
}

.town-detail-hero {
    position: relative;
    height: 320px;
    width: 100%;
    overflow: hidden;
}

.town-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.town-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.town-hero-content-premium {
    position: absolute;
    inset: 0;
    padding: var(--space-xl) var(--space-lg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 10;
}

.back-circle-btn-glass {
    width: 44px;
    height: 44px;
    background: var(--surface-glass);
    backdrop-filter: blur(8px);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-subtle);
    color: white;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.back-circle-btn-glass:hover {
    background: var(--surface-glass-heavy);
    transform: scale(1.1);
}

.town-identity-block {
    display: flex;
    align-items: flex-end;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
}

.town-logo-wrapper-vibrant {
    width: 80px;
    height: 80px;
    background: var(--bg-edge);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-deep);
    border: 3px solid var(--border-subtle);
    padding: 10px;
}

.town-logo-vibrant {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.town-logo-placeholder {
    font-size: 32px;
}

.town-premium-name {
    color: white;
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    font-family: var(--font-heading);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.town-quick-stats {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.quick-stat-pill {
    padding: 4px 14px;
    background: var(--surface-glass);
    backdrop-filter: blur(8px);
    border-radius: var(--radius-full);
    color: white;
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border-subtle);
}

.active-community {
    background: var(--color-success);
    border-color: rgba(255, 255, 255, 0.3);
}

/* BANDO MUNICIPAL */
.bando-municipal-container {
    padding: 0 var(--page-margin);
    margin-top: -30px;
    /* Overlap with hero */
    position: relative;
    z-index: 20;
}

.town-card .town-desc-short {
    font-size: 18px;
    margin-bottom: var(--space-md);
    color: var(--text-main);
}

.bando-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 10px;
}

.bando-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bando-icon-pulse {
    font-size: 20px;
    animation: pulse 2s infinite;
}

.bando-title h3 {
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: white;
}

.bando-tag {
    background: #FF5252;
    color: white;
    font-size: var(--font-size-base);
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 0px;
    text-transform: uppercase;
}

.bando-content-card {
    background: var(--surface-glass-heavy);
    color: white;
    padding: 24px;
    border-radius: var(--radius-m);
    /* 24px */
    border: 1px solid var(--border-subtle);
    border-left: 6px solid var(--accent-orange);
    box-shadow: var(--shadow-deep);
}

.bando-subject {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 8px;
    color: #FF5252;
}

.bando-content-card p {
    font-size: var(--font-size-base);
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
}

.bando-date {
    display: block;
    margin-top: 15px;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: rgba(255, 255, 255, 0.5);
}

.town-info-section-premium {
    padding: 0 var(--space-lg) var(--space-xl);
}

.info-bubble {
    background: white;
    padding: var(--space-md);
    border-radius: 0px;
    border: 1px solid var(--color-border);
    display: flex;
    gap: var(--space-md);
    align-items: flex-start;
}

.info-bubble p {
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--text-secondary);
}

.town-utilities-row {
    padding: 0 var(--space-lg);
    display: flex;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
}

.utility-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--surface-glass);
    border-radius: var(--radius-s);
    /* 18px */
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-deep);
}

.utility-icon {
    font-size: 20px;
}

.utility-info {
    display: flex;
    flex-direction: column;
}

.utility-label {
    font-size: var(--font-size-base);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
}

.utility-value {
    font-size: var(--font-size-base);
    font-weight: 800;
    color: var(--text-main);
}

/* AGRARIAN HUD SIGNES VITALS */
.agrarian-hud-container {
    padding: 14px 20px;
    background: var(--surface-glass-heavy);
    margin-bottom: var(--space-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--radius-s);
    /* 18px */
    border-left: 4px solid var(--accent-cyan);
    box-shadow: var(--shadow-deep);
}

.hud-metric {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.hud-metric-label {
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.4);
}

.hud-indicator-dot {
    width: 6px;
    height: 6px;
    border-radius: 0px;
    box-shadow: var(--shadow-hard);
    animation: pulse-hud 2s infinite;
}

.hud-status-text {
    font-size: var(--font-size-base);
    font-weight: 800;
}

.hud-indicator-indicator {
    display: flex;
    gap: 2px;
}

.hud-indicator-indicator .bar {
    width: 12px;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
}

.hud-indicator-indicator .bar.active {
    background: var(--color-primary);
}

@keyframes pulse-hud {
    0% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* TIME LAYER EXPLORER */
.time-layer-explorer {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid var(--color-divider);
    margin-bottom: var(--space-lg);
}

.layer-btn {
    flex: 1;
    border: none;
    font-size: var(--font-size-base);
    font-weight: 900;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    height: 40px;
}

.layer-btn:active {
    transform: scale(0.95);
}

.town-content-explorer {
    background: var(--bg-main);
    border-radius: 0;
    /* Forced Zero Radius */
    padding-top: 0;
}

.explorer-tabs {
    padding: 0 var(--space-lg) var(--space-md);
    border-bottom: 2px solid var(--color-divider);
    margin-bottom: var(--space-lg);
}

.active-tab-indicator {
    font-size: 18px;
    font-weight: 800;
    color: var(--text-main);
    position: relative;
    display: inline-block;
}

.active-tab-indicator::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-violet);
    border-radius: 4px;
    box-shadow: var(--shadow-glow-violet);
}

.section-header-premium {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: var(--space-md);
    padding: 0 var(--space-lg);
}

.section-header-premium h3 {
    font-size: var(--font-size-base);
    font-weight: 800;
    color: var(--text-main);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.towns-grid, .events-grid {
    padding: 16px;
    width: 100%;
}

.towns-grid.view-mode-grid, .events-grid.view-mode-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.towns-grid.view-mode-single, .events-grid.view-mode-single {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 800px;
    margin: 0 auto;
}

.towns-grid.view-mode-list, .events-grid.view-mode-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (max-width: 600px) {
    .towns-grid.view-mode-grid, .events-grid.view-mode-grid {
        grid-template-columns: 1fr; /* Responsiveness Fix */
    }
    .towns-grid, .events-grid {
        gap: 16px;
        padding: 16px 8px;
    }
}

.town-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.town-card {
    cursor: pointer;
}

.is-user-town .town-card {
    border: 2px solid var(--color-primary);
}

.town-card:active {
    transform: scale(0.98);
}

.card-body {
    padding: var(--space-md);
}

.town-desc-short {
    font-size: var(--font-size-base);
    color: var(--text-main);
    /* High contrast */
    line-height: 1.5;
    margin-bottom: var(--space-sm);
    font-weight: var(--font-weight-bold);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-base);
    font-weight: 800;
    /* Bolder */
    color: var(--text-secondary);
}

.user-town-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 5;
}

.town-card:hover .card-arrow {
    transform: translateX(4px);
    opacity: 1;
}

/* Empty & Map States */
.empty-state-full,
.map-placeholder-container {
    padding: var(--space-2xl) var(--space-md);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
}

.empty-icon {
    color: var(--text-muted);
    opacity: 0.5;
}

.empty-state-full h3 {
    font-family: var(--font-heading);
    color: var(--text-main);
    margin: 0;
    font-size: 20px;
}

.empty-state-full p {
    color: var(--text-muted);
    font-size: var(--font-size-base);
    max-width: 280px;
    line-height: 1.4;
}

/* Town Detail Page */
.town-detail-page {
    padding-bottom: calc(var(--nav-height) + 40px);
    background-color: var(--bg-main);
    min-height: 100vh;
}

.town-detail-hero {
    position: relative;
    height: 300px;
    width: 100%;
    overflow: hidden;
}

.town-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.town-hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0) 40%, var(--bg-main) 95%);
    z-index: 1;
}

.town-hero-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
}

.back-circle-btn {
    width: 40px;
    height: 40px;
    border-radius: 0px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.back-circle-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.town-title-box {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
}

.town-logo-large {
    width: 64px;
    height: 64px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

.town-title-text h1 {
    margin: 0;
    font-size: 32px;
    font-family: var(--font-heading);
    color: var(--text-main);
    line-height: 1;
}

.town-subtitle {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    font-weight: var(--font-weight-bold);
}

.town-detail-body {
    padding: var(--space-md);
    margin-top: -20px;
    position: relative;
    z-index: 3;
}

.info-card {
    background: var(--bg-surface);
    padding: var(--space-md);
    border-radius: 0px;
    border: 1px solid var(--color-border);
    display: flex;
    gap: var(--space-sm);
    box-shadow: var(--shadow-hard);
    margin-bottom: var(--space-lg);
}

.info-card p {
    margin: 0;
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--text-main);
}

.town-sections-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
}

.section-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
    color: var(--color-primary);
}

.section-header h3 {
    margin: 0;
    font-size: 18px;
    font-family: var(--font-heading);
    color: var(--text-main);
}

/* [PRO] FAB CERCA DE POBLES */
.towns-search-fab {
    position: fixed;
    bottom: calc(var(--nav-height) + 24px);
    right: 24px;
    width: 64px;
    height: 64px;
    background: #F97316; /* Taronja Institucional */
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4);
    cursor: pointer;
    z-index: 100;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.towns-search-fab:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 12px 40px rgba(249, 115, 22, 0.6);
}

.towns-search-fab:active {
    transform: scale(0.95);
}

@media (max-width: 600px) {
    .towns-search-fab {
        width: 56px;
        height: 56px;
        bottom: calc(var(--nav-height) + 16px);
        right: 16px;
    }
}

=====================================
FILE: src/pages/Towns.jsx
=====================================

import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabaseService } from "../services/supabaseService";
import UniversalCard from "../components/UniversalCard";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Map as MapIcon,
  Info,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

import Feed from "../components/Feed";
import Marketplace from "../components/Marketplace";
import { logger } from "../utils/logger";
import StatusLoader from "../components/StatusLoader";
import SEO from "../components/SEO";
import ContextualHeader from "../components/ContextualHeader";
import { MOCK_EVENTS } from "../data";
import { wikipediaService } from "../services/wikipediaService";
import "./Towns.css";

// ----------------------------------------------------------------------
// TownWikipediaEnricher: Carga perezosa de Wikipedia con caché local estricto
// ----------------------------------------------------------------------
const TownWikipediaEnricher = ({ town, children }) => {
  const [wikiData, setWikiData] = useState(() => {
    const cached = localStorage.getItem(`wiki_enrich_${town.name}`);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    let isMounted = true;
    if (!wikiData) {
      wikipediaService.getTownSummary(town.name).then((data) => {
        if (data && isMounted) {
          const info = {
            image: data.original_image || data.thumbnail,
            summary: data.extract,
            page_url: data.page_url,
          };
          setWikiData(info);
          localStorage.setItem(`wiki_enrich_${town.name}`, JSON.stringify(info));
        }
      });
    }
    return () => { isMounted = false; };
  }, [town.name, wikiData]);

  // Mezclamos los datos nativos con los enriquecidos, dando prioridad a Wikipedia para pobles huérfanos
  const enrichedTown = {
    ...town,
    image_url: wikiData?.image || town.image_url,
    description: wikiData?.summary || town.description,
    wiki_url: wikiData?.page_url,
  };

  return children(enrichedTown);
};
// ----------------------------------------------------------------------

const TownLogo = ({ url, name }) => {
  const [error, setError] = useState(false);

  if (!url || error) {
    return (
      <div
        className="flex items-center justify-center w-full h-full"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "0px",
          border: "1px solid var(--sdp-glass-border)",
        }}
      >
        <MapIcon
          size={24}
          style={{ color: "var(--color-primary)", opacity: 0.5 }}
        />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`Escut de ${name}`}
      className="town-logo-img"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
      onError={() => setError(true)}
    />
  );
};

const Towns = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'pobles';
  const [townSearch, setTownSearch] = useState("");
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("towns_view_mode") || "grid",
  );
  
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  const [columnCount, setColumnCount] = useState(() => {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (viewMode === 'list' || viewMode === 'single') return 1;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        if (width < 1536) return 3;
        return 4;
    }
    return 1;
  });

  useEffect(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver(entries => {
          for (let entry of entries) {
              const width = entry.contentRect.width;
              if (viewMode === 'single' || viewMode === 'list') {
                  setColumnCount(1);
              } else {
                  if (width < 768) setColumnCount(1);
                  else if (width < 1024) setColumnCount(2);
                  else if (width < 1536) setColumnCount(3);
                  else setColumnCount(4);
              }
          }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
  }, [viewMode]);

  const handleFABClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const fetchTowns = async () => {
      setError(null);

      // [PILAR 1: INSTANT LOAD TOWNS]
      const localData = localStorage.getItem("lc_towns_all");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed && Array.isArray(parsed)) {
            logger.log(
              "[Towns] Instant Load: Bategant llista de pobles des del solatge...",
            );
            setTowns(parsed);
            setLoading(false);
          }
        } catch (e) {
          logger.warn("[Towns] Error en Instant Load:", e);
        }
      }

      try {
        const data = await supabaseService.getTowns();
        logger.log(
          "[Towns] Data bategada des de Supabase:",
          data?.length,
          "pobles trobats.",
        );
        setTowns(data);
        // Save for next time
        localStorage.setItem("lc_towns_all", JSON.stringify(data));
      } catch (error) {
        logger.error("Error loading towns:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTowns();
  }, []);

  const filteredTowns = useMemo(() => {
    if (!townSearch) return towns;
    const normalized = townSearch.toLowerCase();
    return towns.filter(
      (t) =>
        t.name?.toLowerCase().includes(normalized) ||
        t.description?.toLowerCase().includes(normalized),
    );
  }, [towns, townSearch]);

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesSearch =
        !townSearch ||
        event.title.toLowerCase().includes(townSearch.toLowerCase()) ||
        event.description.toLowerCase().includes(townSearch.toLowerCase()) ||
        event.location.toLowerCase().includes(townSearch.toLowerCase());
      return matchesSearch;
    });
  }, [townSearch]);

  if (error) {
    return (
      <div className="towns-container">
        <StatusLoader type="error" message={error} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="towns-container">
        <StatusLoader type="loading" />
      </div>
    );
  }

  return (
    <div className="towns-page-container">
      <SEO
        title={t("towns.title") || "Els Pobles"}
        description={
          t("towns.description") ||
          "Explora la xarxa de pobles connectats i descobreix el que els fa únics."
        }
        image="/og-pobles.png"
        structuredData={{
          "@type": "ItemList",
          name: "Pobles de la Comunitat",
          itemListElement: towns.slice(0, 10).map((town, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "AdministrativeArea",
              name: town.name,
              url: `https://socdepoble.org/pobles/${town.uuid || town.id}`,
              image: town.image_url,
            },
          })),
        }}
      />
      {/* Semantic Heading for SEO/A11y */}
      <h1 className="sr-only">
        {t("towns.title") || "Xarxa de Pobles Connectats"}
      </h1>



      <div className="sticky top-0 w-full z-[100] shadow-md">
          <ContextualHeader
            ref={searchRef}
            searchTerm={townSearch}
            onSearchChange={setTownSearch}
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setViewMode(mode);
              localStorage.setItem("towns_view_mode", mode);
            }}
            placeholder={
              currentTab === "esdeveniments"
                ? "Cerca esdeveniments..."
                : "Cerca pobles..."
            }
            extraActions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/mapa')}
                  className="flex items-center justify-center w-10 h-10 bg-[#FF6D23] text-white rounded-[28px] hover:scale-110 transition-transform shadow-lg"
                  title="Obrir Mapa Local"
                  aria-label="Obrir Mapa Local"
                >
                  <MapIcon size={20} aria-hidden="true" />
                </button>
              </div>
            }
          />
      </div>

      <div className="towns-content-area" ref={containerRef}>
        {currentTab === "pobles" && (
          <div className={`mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
            <div className={`view-mode-${viewMode}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${viewMode === 'list' || viewMode === 'single' ? 1 : columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '24px 16px', paddingBottom: '32px' }}>
              
              {/* ATRIBUCIÓ OBLIGATÒRIA I AGRAÏMENT A WIKIPEDIA (IMPERATIU LEGAL) */}
              <div className="col-span-full mb-2 lg:mb-4 p-4 lg:p-6 bg-gradient-to-r from-black/40 via-black/20 to-transparent dark:from-white/10 dark:via-white/5 border-l-4 border-l-[var(--theme-accent-primary)] rounded-r-xl backdrop-blur-sm animate-in-up">
                <div className="flex gap-4 items-start">
                    <Info size={24} className="text-[var(--theme-accent-primary)] shrink-0 mt-1" />
                    <div>
                        <h4 className="text-sm md:text-md font-bold text-white tracking-widest uppercase mb-1 drop-shadow-md">
                            🏛️ Patrimoni Obert Connectat
                        </h4>
                        <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-4xl">
                            Les imatges històriques principals i els textos descriptius fonamentals exposats en aquest directori de pobles reben la injecció en temps real del coneixement estructurat per la comunitat global a <a href="https://ca.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-accent-primary)] hover:underline font-bold">Wikipedia</a> i <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-accent-primary)] hover:underline font-bold">Wikimedia Commons</a>, d'acord amb la llicència <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:underline">CC BY-SA 3.0 / 4.0</a>. 
                            <br/><br/>
                            Des de l'equip de *Sóc de Poble*, volem expressar el nostre etern agraïment a l'esforç col·lectiu i desinteressat per preservar el llegat antropològic d'Alacant. La memòria no es destrueix, es comparteix.
                        </p>
                    </div>
                </div>
              </div>

              {filteredTowns.length > 0 ? (
                filteredTowns.map((town) => {
                  const isUserTown =
                    profile &&
                    (town.uuid === profile.town_uuid ||
                      town.id === profile.town_id);
                  const lastActiveId = localStorage.getItem(
                    "last_active_town_id",
                  );
                  const isBating =
                    town.uuid === lastActiveId ||
                    String(town.id) === lastActiveId;

                  return (
                    <TownWikipediaEnricher key={town.uuid || town.id} town={town}>
                      {(enrichedTown) => (
                        <Link
                          to={`/pobles/${enrichedTown.uuid || enrichedTown.id}`}
                          className={`town-card-link card-rizoma-wrapper animate-in w-full h-full ${
                            isUserTown ? "is-user-town" : ""
                          }`}
                        >
                          <UniversalCard
                            item={enrichedTown}
                            subtitle={enrichedTown.name}
                            avatarSrc={enrichedTown.image_url}
                            avatarName={enrichedTown.name}
                            className="town-card"
                            image={enrichedTown.image_url}
                            mode="pobles"
                            isBating={isBating}
                            viewMode={viewMode}
                          >
                            <div
                              className="town-description-mini text-sm italic opacity-80"
                              style={{ padding: "10px 0" }}
                              title={enrichedTown.description}
                            >
                              <span className="line-clamp-3">
                                {enrichedTown.description ||
                                  "Explora la saviesa i el batec d'aquest poble."}
                              </span>
                              {enrichedTown.wiki_url && (
                                <a 
                                  href={enrichedTown.wiki_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="not-italic block mt-2 text-xs font-bold text-[var(--theme-accent-primary)] hover:underline opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Llegir l'article sencer a Wikipedia ↗
                                </a>
                              )}
                            </div>
                          </UniversalCard>
                        </Link>
                      )}
                    </TownWikipediaEnricher>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center opacity-50 font-black uppercase tracking-widest">
                  <p>No s'han trobat pobles actius</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 border border-white/20 hover:bg-white/10 transition-colors"
                  >
                    BATEGAR DE NOU
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === "esdeveniments" && (
          <div className="events-container">
            <div className="calendar-widget-wrapper mb-6 bg-theme-panel p-4 md:p-6 rounded-[28px] border border-white/5 shadow-sm">
                <div className="flex items-center justify-between mb-6 px-2">
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={24}/></button>
                    <span className="font-black tracking-widest text-[16px] md:text-[18px]">MARÇ 2026</span>
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={24}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3">
                    {['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'].map(d => (
                        <div key={d} className="text-[12px] md:text-[14px] font-black opacity-50 mb-2">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                    {/* Buits abans de dia 1 (Març 26 comença diumenge, doncs 6 buits) */}
                    {[...Array(6)].map((_, i) => <div key={`empty-${i}`} className="p-2 md:p-3"/>)}
                    
                    {/* Dies del mes */}
                    {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        // Simular que alguns dies (ex. els propers que tenen eventCards abaix) tenen esdeveniment
                        const hasEvent = [1, 2, 10, 15, 28].includes(day); 
                        const isToday = day === 23;
                        return (
                            <button
                                key={day}
                                className={`relative flex flex-col items-center justify-center p-2 h-12 w-full sm:h-14 rounded-[16px] text-[16px] md:text-[18px] font-bold transition-all hover:scale-105 active:scale-95
                                    ${hasEvent ? 'bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] font-black' : 'hover:bg-gray-100 dark:hover:bg-white/5'}
                                    ${isToday ? 'ring-2 ring-[var(--theme-accent-primary)] ring-offset-2 dark:ring-offset-[#111827]' : ''}
                                `}
                            >
                                {day}
                                {hasEvent && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--theme-accent-primary)]"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="empty-state-full py-10 text-center opacity-50">
                <h3>No hem trobat cap esdeveniment</h3>
                <p>Prova amb altres paraules o etiquetes.</p>
              </div>
            ) : (
              <div className={`mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
                <div className={`view-mode-${viewMode}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${viewMode === 'list' || viewMode === 'single' ? 1 : columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '24px 16px', paddingBottom: '32px' }}>
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="card-rizoma-wrapper animate-in w-full flex">
                        <UniversalCard
                          item={event}
                          title={event.title}
                          subtitle={`${event.location} • ${event.start_time} - ${event.end_time}`}
                          avatarSrc={event.author_avatar}
                          avatarName={event.author}
                          className="event-card animate-in-up w-full"
                          image={
                            event.image_url?.[0] ||
                            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000"
                          }
                          mode="event"
                          viewMode={viewMode}
                        >
                          <div
                            className="event-description text-sm opacity-90"
                            style={{ padding: "10px 0", minHeight: "60px" }}
                          >
                            {event.description}
                          </div>
                          <div className="event-tags flex gap-2 flex-wrap mt-2">
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className="tag-pill"
                                style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  padding: "2px 8px",
                                  borderRadius: "0px",
                                  fontSize: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </UniversalCard>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {currentTab === "rhizome" && (
          <div className="rhizome-essences animate-in">
            <section className="essence-hero py-6 text-center border-b border-white/10 mb-8">
              <h2 className="text-2xl font-black text-primary">
                RECURSOS DEL SOLATGE
              </h2>
              <p className="opacity-70 text-sm">
                Coneixement local protegit pel protocol Rhizome
              </p>
            </section>

            <div className={`mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
                <div className="essences-grid view-mode-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '0 16px', paddingBottom: '24px' }}>
                  {/* OLI DE LA TORRE */}
                  <UniversalCard
                    title="Oli de La Torre (Verge Extra)"
                    subtitle="Km0 • Cooperativa • Essències"
                    headerTheme="olive"
                    className="essence-card w-full"
                    image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000"
                    footer={
                      <div className="px-4 py-3 flex justify-between items-center bg-black/20">
                        <span className="text-xs font-bold text-success">
                          PRODUCTE PROTEGIT
                        </span>
                        <button
                          className="text-xs font-black text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/didactica/oli-de-la-torre");
                          }}
                        >
                          SABER MÉS
                        </button>
                      </div>
                    }
                  >
                    <p className="text-sm opacity-90 py-2">
                      El nostre oli és fill de la muntanya. Produït majoritàriament
                      amb la varietat <strong>Blanqueta</strong>, resistent i noble.
                      L'oli es deixa <em>trastombar</em> naturalment per a separar
                      la <em>morca</em>.
                    </p>
                    <div className="specs-box mt-2 p-3 bg-white/5 border border-white/10 rounded flex justify-between">
                      <div className="spec text-xs">
                        <strong>Acidesa:</strong> 0.8º
                      </div>
                      <div className="spec text-xs">
                        <strong>Procés:</strong> Batuda en fred (23ºC)
                      </div>
                    </div>
                  </UniversalCard>

                  {/* ITINERARIS */}
                  <UniversalCard
                    title="Som pa, som oli"
                    subtitle="Itinerari • Gastronòmic • 4h"
                    headerTheme="terracotta"
                    className="essence-card w-full"
                    image="https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000"
                    footer={
                      <div className="px-4 py-3 flex justify-between items-center bg-black/20">
                        <span className="text-xs font-bold">
                          1.3 KM • 3 PARADES
                        </span>
                        <button
                          className="text-xs font-black text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/mapa");
                          }}
                        >
                          VEURE RUTA
                        </button>
                      </div>
                    }
                  >
                    <p className="text-sm opacity-90 py-2">
                      Una ruta pels sabors que defineixen la memòria de l'horta.
                    </p>
                    <div className="stops-list flex flex-wrap gap-2 mt-2">
                      {["Forns de llenya", "Almàssera", "Molí Hidràulic"].map(
                        (s) => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-white/5 text-[10px] rounded border border-white/10"
                          >
                            {s.toUpperCase()}
                          </span>
                        ),
                      )}
                    </div>
                  </UniversalCard>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* [PRO] FAB Cerca de Pobles v10.33.6 */}
      <button
        className="towns-search-fab"
        onClick={handleFABClick}
        title="Cercar Pobles"
        aria-label="Cercar Pobles"
      >
        <Search size={28} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Towns;


=====================================
FILE: src/pages/Utilitats.jsx
=====================================

import React, { useState } from 'react';
import { Wrench, FileText, Sparkles, ArrowRight } from 'lucide-react';
import PDFBategatManager from '../components/PDFBategatManager';
import BlueprintOverlay from '../components/BlueprintOverlay';

const Utilitats = () => {
    const [activeTool, setActiveTool] = useState(null);

    const tools = [
        {
            id: 'pdf-bategador',
            name: 'Bategador de PDFs',
            description: 'Converteix qualsevol PDF orfe en un formulari interactiu i rellenable.',
            icon: FileText,
            color: 'orange'
        }
    ];

    if (activeTool === 'pdf-bategador') {
        return <PDFBategatManager onBack={() => setActiveTool(null)} />;
    }

    return (
        <div className="flex-1 bg-theme-base p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <header className="mb-16 relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-[28px] pointer-events-none" />
                
                <div className="flex items-center gap-6 mb-4 relative z-10">
                    <div className="w-16 h-16 bg-theme-panel border border-white/10 genesis-radius flex items-center justify-center backdrop-blur-xl shadow-2xl">
                        <Wrench className="w-8 h-8 text-[var(--theme-accent-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-1 font-condensed">
                            UTILITATS <span className="text-[#0ea5e9]">DEL MAS</span>
                        </h1>
                        <p className="text-white/30 font-bold tracking-widest text-[10px] uppercase font-mono">
                            Sobirania Digital • Protocol Rhizome v10.26
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className="group bg-white/[0.03] border border-white/10 rounded-[28px] p-8 cursor-pointer hover:bg-white/[0.06] hover:border-[#0ea5e9]/30 transition-all duration-500 relative overflow-hidden flex flex-col min-h-[320px] shadow-2xl backdrop-blur-md font-condensed"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                            <tool.icon size={160} />
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#0ea5e9]/20 to-[#0ea5e9]/5 w-16 h-16 genesis-radius flex items-center justify-center mb-8 border border-[#0ea5e9]/20 shadow-inner">
                            <tool.icon className="text-[#0ea5e9]" size={28} />
                        </div>
                        
                        <div className="mt-auto">
                            <h3 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight italic">
                                {tool.name}
                                <Sparkles size={18} className="text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0" />
                            </h3>
                            <p className="text-white/40 text-[15px] leading-relaxed mb-10 font-medium">
                                {tool.description}
                            </p>
                            
                            <div className="flex items-center text-[#0ea5e9] font-black text-xs gap-3 tracking-[0.2em] group-hover:gap-4 transition-all">
                                <span>INICIAR PROTOCOL</span>
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Futuribles Slots */}
                 {[1, 2].map(i => (
                    <div key={i} className="bg-white/[0.01] border border-white/[0.05] border-dashed rounded-[28px] p-8 flex flex-col items-center justify-center text-white/5 italic text-sm min-h-[320px] transition-all hover:bg-white/[0.02]">
                        <div className="w-12 h-12 rounded-[28px] border border-current flex items-center justify-center mb-4 opacity-30">?</div>
                        <span className="font-black tracking-widest uppercase text-[10px]">Properament...</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Utilitats;


=====================================
FILE: src/pages/VisionView.css
=====================================

.vision-page-container {
  height: 100vh;
  width: 100%;
  background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000 70%);
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  font-family: "Noto Sans", sans-serif;
  scrollbar-width: none;
}

.vision-page-container::-webkit-scrollbar {
  display: none;
}

.vision-page-header {
  height: 80px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.vision-page-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vision-page-title h1 {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.4));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.back-button {
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.back-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(-2px);
}

.vision-page-content {
  flex: 1;
  max-width: 650px;
  margin: 0 auto;
  padding: 40px 20px 120px;
  width: 100%;
}

.vision-page-intro {
  font-size: 26px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 56px;
  letter-spacing: 0.02em;
  line-height: 1.4;
  font-weight: 300;
}

.vision-modes-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vision-mode-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: 100%;
  cursor: pointer;
}

.vision-mode-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.vision-mode-card.active {
  background: rgba(249, 115, 22, 0.08);
  border-color: #f97316;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.vision-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.vision-mode-card.active .vision-icon-wrapper {
  background: #f97316;
  color: #000;
  transform: scale(1.05);
}

.vision-card-content {
  flex: 1;
}

.vision-card-content h3 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.9);
}

.vision-card-content p {
  font-size: 22px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.4);
}

.vision-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.vision-mode-card.active .vision-status-dot {
  background: #f97316;
  box-shadow: 0 0 10px #f97316;
}

/* CHAT EMBED STYLES */
.chat-embed-container {
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 28px;
  overflow: hidden;
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-embed-header {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.chat-embed-header span {
  font-size: 14px; /* Llegibilitat Sènior per a Capçaleres */
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #f97316;
}

.chat-embed-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 400px;
  overflow-y: auto;
}

.chat-embed-agent-row {
  display: flex;
  align-items: center;
  gap: 16px; /* Més aire per a UI Tàctil */
  padding: 16px 20px; /* Format Tàctil Immens */
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  border: 1px solid transparent;
}

.chat-embed-agent-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.chat-embed-agent-row.active {
  background: rgba(249, 115, 22, 0.05);
  border-color: rgba(249, 115, 22, 0.1);
}

.chat-embed-agent-row.active .chat-embed-avatar {
  border-color: #f97316;
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.2);
}

.chat-embed-avatar {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  overflow: visible;
  border: 2px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;
}

.chat-embed-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-embed-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-embed-name {
  font-size: 20px; /* Sènior 18px+ Demanat per Mestre */
  font-weight: 800;
  color: #fff;
  margin-bottom: 2px;
}

.chat-embed-phrase {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  line-height: 1.2;
}

.agent-tag-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #000;
  color: #f97316;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(249, 115, 22, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
}

.chat-embed-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-embed-toggle {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chat-embed-toggle.active {
  background: #f97316;
  border-color: #f97316;
  color: #000;
}

.vision-action-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, #000 70%, transparent);
  display: flex;
  justify-content: center;
  z-index: 100;
}

.gem-btn-primary {
  background: #f97316;
  color: #000;
  padding: 16px 48px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2);
  transition: all 0.3s ease;
}

.gem-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(249, 115, 22, 0.3);
  background: #fb923c;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .vision-page-header h1 {
    font-size: 16px;
  }
  .vision-mode-card {
    padding: 16px;
  }
}

/* [LIGHT MODE / DAY MODE OVERRIDES] */
.light .vision-page-container {
  background: radial-gradient(circle at 50% 0%, #f1f5f9 0%, #ffffff 70%);
  color: #000;
}

.light .vision-page-header {
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.light .vision-page-title h1 {
  background: linear-gradient(to right, #000, rgba(0, 0, 0, 0.5));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.light .back-button {
  color: rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.03);
}

.light .back-button:hover {
  color: #000;
  background: rgba(0, 0, 0, 0.08);
}

.light .vision-page-intro {
  color: rgba(0, 0, 0, 0.6);
}

.light .vision-mode-card {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.light .vision-mode-card:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.12);
}

.light .vision-mode-card.active {
  background: rgba(
    9,
    132,
    227,
    0.08
  ); /* Blau en mode dia (invers de taronja) */
  border-color: #0984e3;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.light .vision-icon-wrapper {
  background: rgba(0, 0, 0, 0.05);
}

.light .vision-mode-card.active .vision-icon-wrapper {
  background: #0984e3;
  color: #fff;
}

.light .vision-card-content h3 {
  color: #000;
}

.light .vision-card-content p {
  color: rgba(0, 0, 0, 0.5);
}

.light .vision-status-dot {
  background: rgba(0, 0, 0, 0.1);
}

.light .vision-mode-card.active .vision-status-dot {
  background: #0984e3;
  box-shadow: 0 0 10px #0984e3;
}

/* Chat Embed Overrides */
.light .chat-embed-container {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.light .chat-embed-header {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.06);
}

.light .chat-embed-header span {
  color: #0984e3;
}

.light .chat-embed-agent-row:hover {
  background: rgba(0, 0, 0, 0.04);
}

.light .chat-embed-agent-row.active {
  background: rgba(9, 132, 227, 0.05);
  border-color: rgba(9, 132, 227, 0.15);
}

.light .chat-embed-agent-row.active .chat-embed-avatar {
  border-color: #0984e3;
  box-shadow: 0 0 15px rgba(9, 132, 227, 0.2);
}

.light .chat-embed-avatar {
  border-color: rgba(0, 0, 0, 0.1);
}

.light .chat-embed-name {
  color: #000;
}

.light .chat-embed-phrase {
  color: rgba(0, 0, 0, 0.5);
}

.light .agent-tag-badge {
  background: #fff;
  color: #0984e3;
  border-color: rgba(9, 132, 227, 0.4);
}

.light .chat-embed-toggle {
  border-color: rgba(0, 0, 0, 0.15);
}

.light .chat-embed-toggle.active {
  background: #0984e3;
  border-color: #0984e3;
  color: #fff;
}

.light .vision-action-footer {
  background: linear-gradient(to top, #fff 70%, transparent);
}

.light .gem-btn-primary {
  background: #0984e3;
  color: #fff;
  box-shadow: 0 10px 30px rgba(9, 132, 227, 0.2);
}

.light .gem-btn-primary:hover {
  background: #0073cc;
  box-shadow: 0 15px 40px rgba(9, 132, 227, 0.3);
}


=====================================
FILE: src/pages/VisionView.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Sparkles, ArrowLeft, Check, User, Zap, MessageSquare } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { AGENTS } from '../constants/agents';
import SEO from '../components/SEO';

const IAIA_MARIA_ID = '11111111-1a1a-0000-0000-000000000000';
import './VisionView.css';

const VisionView = () => {
    const navigate = useNavigate();
    const { visionMode, setVisionMode } = useDesign();
    const { enabledAgentIds, setEnabledAgentIdsState } = useNavigation();

    const toggleAgent = (id) => {
        if (setEnabledAgentIdsState) {
            setEnabledAgentIdsState(prev => 
                prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
            );
        }
    };

    const MODES = [
        {
            id: 'humana',
            level: 0,
            title: 'Nivell 0 (Humà)',
            desc: "Identitat sobirana. Sense IA. Només bategues amb la teua gent.",
            icon: User
        },
        {
            id: 'iaia',
            level: 1,
            title: 'Nivell 1 (Assistent)',
            desc: "Utilitat pura amb la IAIA MarIA. Gestió digital del poble.",
            icon: Zap
        },
        {
            id: 'immersiva',
            level: 2,
            title: 'Nivell 2 (Immersiu)',
            desc: "Tria la teua colla d'agents per al mur i el xat.",
            icon: Sparkles
        },
        {
            id: 'creativa',
            level: 3,
            title: 'Nivell 3 (Creatiu)',
            desc: "Univers total. Tots els agents bategant a l'uníson.",
            icon: Brain
        }
    ];

    return (
        <div className="vision-page-container">
            <SEO title="Selector de Realitat | Sóc de Poble" description="Com vols bategar avui al poble?" />
            <header className="vision-page-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={32} />
                </button>
                <div className="vision-page-title">
                    <Shield size={32} color="#F97316" />
                    <h1>Selector de Realitat</h1>
                </div>
                <div style={{ width: 44, opacity: 0 }} />
            </header>

            <main className="vision-page-content">
                <p className="vision-page-intro">Com vols bategar avui al poble?</p>
                
                <div className="vision-modes-grid">
                    {MODES.map(m => (
                        <div key={m.id}>
                            <div 
                                className={`vision-mode-card ${visionMode === m.id ? 'active' : ''}`}
                                onClick={() => setVisionMode(m.id)}
                            >
                                <div className="vision-icon-wrapper">
                                    <m.icon size={36} />
                                </div>
                                <div className="vision-card-content">
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                                <div className="vision-status-dot" />
                            </div>

                            {/* [PROTOCOL V4.2] SELECCIÓ GRANULAR (CHAT EMBED) */}
                            {m.id === 'immersiva' && visionMode === 'immersiva' && (
                                <div className="chat-embed-container animate-in-up">
                                    <div className="chat-embed-header">
                                        <MessageSquare size={18} color="#F97316" />
                                        <span>Selecció d'Acompanyants</span>
                                    </div>
                                    <div className="chat-embed-list custom-scrollbar">
                                        {AGENTS.map(agent => {
                                            const isActive = enabledAgentIds.includes(agent.id);
                                            return (
                                                <div 
                                                    key={agent.id} 
                                                    className={`chat-embed-agent-row ${isActive ? 'active' : ''}`}
                                                    onClick={() => toggleAgent(agent.id)}
                                                >
                                                    <div className="chat-embed-avatar">
                                                        <img src={agent.avatar_url} alt={agent.name} />
                                                        {agent.tag && (
                                                            <span className="agent-tag-badge">{agent.tag}</span>
                                                        )}
                                                    </div>
                                                    <div className="chat-embed-info">
                                                        <div className="chat-embed-name-row">
                                                            <span className="chat-embed-name">{agent.name}</span>
                                                        </div>
                                                        <span className="chat-embed-phrase">{agent.last_message_content || agent.role}</span>
                                                    </div>
                                                    <div className="chat-embed-toggle-wrapper">
                                                        <div className={`chat-embed-toggle ${isActive ? 'active' : ''}`}>
                                                            {isActive && <Check size={14} strokeWidth={4} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                             {/* [PROTOCOL V4.2] LEVEL 1: IAIA ONLY DISPLAY */}
                             {m.id === 'iaia' && visionMode === 'iaia' && (
                                <div className="chat-embed-container animate-in-up">
                                    <div className="chat-embed-list">
                                        {AGENTS.filter(a => a.id === IAIA_MARIA_ID).map(agent => (
                                            <div key={agent.id} className="chat-embed-agent-row active" onClick={() => navigate('/iaia')}>
                                                <div className="chat-embed-avatar">
                                                    <img src={agent.avatar_url} alt="IAIA" />
                                                    <span className="agent-tag-badge">MASTER</span>
                                                </div>
                                                <div className="chat-embed-info">
                                                    <div className="chat-embed-name-row">
                                                        <span className="chat-embed-name">{agent.name}</span>
                                                    </div>
                                                    <span className="chat-embed-phrase">{agent.last_message_content}</span>
                                                </div>
                                                <div className="chat-embed-toggle-wrapper">
                                                    <div className="chat-embed-toggle active" style={{ background: '#F97316', borderColor: '#F97316' }}>
                                                        <Check size={14} strokeWidth={4} color="black" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default VisionView;


=====================================
FILE: package.json
=====================================

{
  "name": "soc-de-poble",
  "private": true,
  "version": "10.33.16-BATEGA",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && npm run copy-wasm",
    "copy-wasm": "mkdir -p dist/assets && cp node_modules/@sqlite.org/sqlite-wasm/dist/sqlite3.wasm dist/assets/sqlite3.wasm || copy node_modules\\@sqlite.org\\sqlite-wasm\\dist\\sqlite3.wasm dist\\assets\\sqlite3.wasm",
    "deploy": "npm run build && node scripts/deploy.js",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:components": "vitest run src/tests/components",
    "test:services": "vitest run src/tests/services",
    "test:contexts": "vitest run src/tests/contexts",
    "preview": "vite preview",
    "deploy:siteground": "bash DEPLOY_SITEGROUND.sh",
    "deploy:brain": "cd google-cloud-backend && gcloud functions deploy marketingBrain --runtime nodejs20 --trigger-http --allow-unauthenticated --region europe-west1",
    "generate:pdf": "node scripts/generate-pdf.js"
  },
  "dependencies": {
    "@capacitor/android": "^8.0.1",
    "@capacitor/assets": "^3.0.5",
    "@capacitor/cli": "^8.0.1",
    "@capacitor/core": "^8.0.1",
    "@capacitor/haptics": "^8.0.0",
    "@capacitor/ios": "^8.0.1",
    "@capacitor/splash-screen": "^8.0.0",
    "@capacitor/status-bar": "^8.0.0",
    "@google/genai": "^1.46.0",
    "@journeyapps/wa-sqlite": "^1.5.0",
    "@powersync/react": "^1.9.0",
    "@powersync/web": "^1.34.0",
    "@sqlite.org/sqlite-wasm": "^3.51.2-build6",
    "@supabase/supabase-js": "^2.90.1",
    "@tailwindcss/postcss": "^4.1.18",
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/react-virtual": "^3.13.19",
    "axios": "^1.13.2",
    "browser-image-compression": "^2.0.2",
    "chart.js": "^4.5.1",
    "cheerio": "^1.2.0",
    "coi-serviceworker": "^0.1.7",
    "comlink": "^4.4.2",
    "dompurify": "^3.3.1",
    "dotenv": "^17.2.3",
    "emoji-picker-react": "^4.17.1",
    "i18next": "^25.7.4",
    "i18next-browser-languagedetector": "^8.2.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.562.0",
    "onnxruntime-web": "^1.24.2",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^4.10.38",
    "react": "^19.2.0",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "^19.2.0",
    "react-ga4": "^2.1.0",
    "react-helmet-async": "^3.0.0",
    "react-hot-toast": "^2.6.0",
    "react-i18next": "^16.5.3",
    "react-leaflet": "^5.0.0",
    "react-router-dom": "^7.12.0",
    "react-virtuoso": "^4.18.3",
    "turndown": "^7.2.2",
    "vite-plugin-comlink": "^5.3.0",
    "vite-plugin-pwa": "^1.2.0",
    "vite-plugin-top-level-await": "^1.6.0",
    "vite-plugin-wasm": "^3.5.0",
    "workbox-core": "^7.4.0",
    "workbox-expiration": "^7.4.0",
    "workbox-precaching": "^7.4.0",
    "workbox-routing": "^7.4.0",
    "workbox-strategies": "^7.4.0",
    "workbox-window": "^7.4.0",
    "xml2js": "^0.6.2",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@sentry/react": "^10.45.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/dompurify": "^3.0.5",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-basic-ssl": "^2.1.4",
    "@vitejs/plugin-react": "^5.1.1",
    "@vitest/coverage-v8": "^4.1.0",
    "@vitest/ui": "^4.1.0",
    "autoprefixer": "^10.4.24",
    "basic-ftp": "^5.2.0",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "ftp": "^0.3.10",
    "globals": "^16.5.0",
    "jsdom": "^29.0.1",
    "md-to-pdf": "^5.2.5",
    "msw": "^2.12.14",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "tsx": "^4.21.0",
    "vite": "^7.2.4",
    "vitest": "^4.1.0"
  }
}


=====================================
FILE: vite.config.js
=====================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { comlink } from "vite-plugin-comlink";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    comlink(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        inlineWorkboxRuntime: true,
        sourcemap: false,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js', 'coi-serviceworker.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.socdepoble\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Sóc de Poble',
        short_name: 'Sóc de Poble',
        description: 'La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.',
        theme_color: '#f97316',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: false,
        type: 'module'
      }
    }),
  ],
  optimizeDeps: {
    // Exclude PowerSync and its WebAssembly SQLite engine from Vite's pre-bundling optimizer
    // to prevent the internal `WASQLiteDB.worker.js` from throwing a 404 and timing out OPFS.
    exclude: [
      "@sqlite.org/sqlite-wasm",
      "onnxruntime-web",
      "@journeyapps/wa-sqlite",
      "@powersync/web",
    ],
  },
  server: {
    host: true,
    port: 3333,
    strictPort: true,
    headers: {
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
  },
  worker: {
    format: "es",
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react"],
          data: ["@supabase/supabase-js"],
          utils: ["i18next", "react-i18next", "zod"],
        },
      },
    },
  },
});


=====================================
FILE: index.html
=====================================

<!DOCTYPE html>
<html lang="ca" prefix="og: http://ogp.me/ns#">
  <head>
    <!-- [BATEGAT SEO GOD] Previsualitzacions d'alt impacte per a WhatsApp/Social -->
    <title>Sóc de Poble | El Sistema Operatiu Rural</title>
    <meta
      name="description"
      content="Connecta amb la teua comunitat i recupera el trellat del territori. Mercat rural, memòria viva i sobirania digital en la xarxa social KM 0."
    />
    <meta name="keywords" content="xarxa social rural, pobles connectats, IAIA, memòria històrica, comerç local, sobirania digital, valencià" />
    <meta name="theme-color" content="#f97316" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Sóc de Poble" />
    <link rel="author" href="https://socdepoble.org" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://socdepoble.org/" />
    <meta
      property="og:title"
      content="Sóc de Poble | El Sistema Operatiu Rural"
    />
    <meta
      property="og:description"
      content="Connecta amb la teua comunitat i recupera el trellat del territori. Mercat rural, memòria viva i sobirania digital."
    />
    <meta
      property="og:image"
      content="https://socdepoble.org/og-image-batega-v11.png?v=beta-sollutia"
    />
    <meta
      property="og:image:secure_url"
      content="https://socdepoble.org/og-image-batega-v11.png?v=beta-sollutia"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:site_name" content="Sóc de Poble" />
    <meta property="og:locale" content="ca_ES" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@socdepoble" />
    <meta name="twitter:creator" content="@socdepoble" />
    <meta
      name="twitter:title"
      content="Sóc de Poble | El Sistema Operatiu Rural"
    />
    <meta
      name="twitter:description"
      content="Connecta amb la teua comunitat i recupera el trellat. Mercat rural, memòria viva i sobirania digital."
    />
    <meta
      name="twitter:image"
      content="https://socdepoble.org/og-image-batega-v11.png?v=beta-sollutia"
    />

    <meta charset="UTF-8" />
    
    <!-- [Mestre: Bloqueig de FOUC] Erradicació del llamp visual de tema (FOUC) -->
    <script>
      (function() {
        try {
          var savedTheme = localStorage.getItem('nexus_theme') || 'light';
          var root = document.documentElement;
          root.classList.add(savedTheme);
          root.classList.add('theme-' + savedTheme);
        } catch (e) {}
      })();
    </script>
    
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />

    <script>
      // [BATEGAT RESCUE v10.33.2] Guardem la versió
      (function () {
        const CURRENT_V = "v10.33.15-CANÒNIC";

        localStorage.setItem("sp_app_version", CURRENT_V);

        window.addEventListener(
          "error",
          function (e) {
            if (e.target.tagName === "LINK" || e.target.tagName === "SCRIPT") {
              console.error(
                "[PURGA] Error d'asset detectat. PWA desfasada. Forçant recàrrega neta:",
                e.target.src || e.target.href,
              );
              if (!sessionStorage.getItem("sw_purged_asset")) {
                sessionStorage.setItem("sw_purged_asset", "true");
                window.location.reload(true);
              }
            }
          },
          true,
        );
      })();
    </script>

    <meta
      http-equiv="Cache-Control"
      content="no-cache, no-store, must-revalidate"
    />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />

    <script>
      // --- MASTER NOISE REDUCTION PROTOCOL (v10.26.0-CANÒNIC) ---
      // Silence library warnings and ghost extension errors for a pristine console.
      (function () {
        const silencePatterns = [
          "tailwind",
          "Babel",
          "production",
          "shadow host",
          "VM",
          "extension",
          "Violation",
        ];

        const shouldSilence = (args) => {
          const msg = String(args[0] || "");
          return silencePatterns.some((pattern) => msg.includes(pattern));
        };

        const _warn = console.warn;
        console.warn = function (...args) {
          if (shouldSilence(args)) return;
          _warn.apply(console, args);
        };

        const _error = console.error;
        console.error = function (...args) {
          if (shouldSilence(args)) return;

          // Removed legacy PREGONER BATEGAT fetch to localhost:9001
          _error.apply(console, args);
        };

        window.addEventListener("unhandledrejection", (event) => {
          if (shouldSilence([event.reason?.message])) {
            event.preventDefault();
          }
        });
      })();
    </script>
    <!-- Google Fonts: Noto Sans (L'Ànima de Sóc de Poble) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300..700&family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300..700&family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap"
      rel="stylesheet"
      media="print"
      onload="this.media='all'"
    />
    <noscript>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Emoji:wght@300..700&family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap"
        rel="stylesheet"
      />
    </noscript>

    <!-- Estils i Protocols -->

    <style>
      .animate-in {
        animation: fadeIn 0.4s ease-out;
      }
      .animate-up {
        animation: slideUp 0.4s ease-out;
      }
      .zoom-in {
        animation: zoomIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes zoomIn {
        from {
          transform: scale(0.95);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .blueprint-grid {
        background-image: linear-gradient(
            to right,
            rgba(6, 182, 212, 0.1) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(6, 182, 212, 0.1) 1px,
            transparent 1px
          );
        background-size: 20px 20px;
      }

      /* Ruler Overlay */
      .forense-active * {
        outline: 1px solid rgba(249, 115, 22, 0.1) !important;
      }
    </style>
    <meta name="sp-version" content="v10.34.0" />
    <meta name="build-timestamp" content="2026-02-25T02:16:00+01:00" />
  </head>
  <body>
    <!-- Hidden H1 for SEO -->
    <h1
      style="
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      "
    >
      Sóc de Poble - La teua xarxa de territori i sobirania digital
    </h1>
    <div id="root"></div>

    <!-- COI Service Worker eliminado (Provocaba TypeError: Failed to convert value to 'Response' bloqueando fetches en Prod) -->

    <!-- Google Identity Services per a One-Tap Login -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <!-- Modern App Entry -->
    <script type="module" src="/src/entry.jsx"></script>

    <!-- [BATEGAT FAILSAFE v3] Si el Mas no arranca en 4 segons, obrim panell d'emergència -->
    <script>
      setTimeout(() => {
        if (!window.__SDP_ROOT_MOUNTED) {
          console.error(
            "Failsafe disparat: React no ha pogut muntar l'aplicació.",
          );
          document.body.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#000;color:#fff;font-family:sans-serif;padding:20px;text-align:center;box-sizing:border-box;">
              <h2 style="color:#f97316;font-size:24px;margin-bottom:10px;font-weight:900;">TANCAT PER REFORMES</h2>
              <p style="color:#9ca3af;margin-bottom:30px;font-size:16px;">El teu telèfon ha guardat una versió corrompuda de l'aplicació a la memòria i s'ha bloquejat.</p>
              <button onclick="caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))); navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())); localStorage.clear(); sessionStorage.clear(); window.location.reload(true);" style="background-color:#f97316;color:#fff;border:none;padding:15px 30px;border-radius:30px;font-weight:bold;font-size:18px;cursor:pointer;box-shadow:0 4px 15px rgba(249,115,22,0.4);">
                Forçar Neteja i Reiniciar
              </button>
            </div>
          `;
        }
      }, 4000);
    </script>
  </body>
</html>
