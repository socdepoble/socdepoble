# MASTER AUDIT PROMPT - SÓC DE POBLE CSS ARCHITECTURE REFACTOR
> **Instrucciones para la IA (Grok / Gemini / Claude):** Lee este prompt detenidamente antes de generar ninguna respuesta. Este es un `Payload de Ingeniería` diseñado para solicitar tu ayuda en una refactorización arquitectónica profunda del CSS y la estructura visual de una aplicación React/Tailwind.

## 1. El Contexto del Proyecto
El proyecto se llama **Sóc de Poble**. Es una red social / plataforma Hyperlocal P2P diseñada bajo una estética *Glassmorphic*, *Dark Mode* por defecto, y que debe correr de forma extremadamente eficiente en móviles y webviews de escritorio.

Actualmente, el sistema CSS base (`index.css`) y los componentes estructurales (como `AppLayout.jsx` y `NavigationRail.jsx`) sufren de "deuda técnica por parcheo iterativo" (Spaghetti CSS). Existen conflictos de especificidad resueltos pobremente con la directiva `!important`, variables globales dispersas, y fallos de layout (conocidos como *fantasmas de layout*) que causan espacios vacíos porque los contenedores padre e hijo no cuadran matemáticamente y los scrollbars "roban" píxeles alterando anchos enteros.

## 2. El Problema a Auditar

**A. El Fantasma Estructural de Layout:**
Inconsistencias matemáticas en anchos rígidos (`w-[300px]` vs `w-[260px]`) que generan espacios muertos. Capas fijas y z-index colisionantes con overlays en móvil vs web. Se te pide auditar y refactorizar usando `grid` o flex puro. 

**B. Especificidad Pobre y Abuso de `!important` en el index.css:**
El diseño carece de una plantilla real y global de temas (por ejemplo, definir temas light/dark solo desde variables o clases raíz). Existen `!important` esparcidos (`.app-cms-content`, `.low-end-device`, etc) que imposibilitan el autoescalado de Tailwind.

**C. Problemas de Scrollbars (Force Gutter):**
Para intentar domar el scrollbar globalmente se sobreescribió globalmente `-webkit-scrollbar` lo cual obligó a Webkit a "reservar" ese espacio, aplastando componentes enteros.

## 3. La Directiva de Refactorización (La "Plantilla Perfecta")

Te exijo generar la **Arquitectura CSS / UI Perfecta y Desacoplada**. Leyes inmutables de código:

1. **Plantilla Definitiva de Diseño (Single Source of Truth):** Propón un `tailwind.config.js` y `index.css` maestro. Todos los colores, grillas y botones *deben* heredar variables maestras. Debe haber UN solo sitio para cambiar diseños. 
2. **Zero-Patch Doctrine (`!important` = 0):** Prohibido usar `!important`.
3. **Aislamiento Categorizado de Componentes:** Cada componente debe ser autónomo. Si el padre (AppLayout) determina el Grid, el Sidebar no necesita widths condicionales fijos, solo heredar `h-full w-full`. Ocultar o borrar algo (e.g. `hidden md:flex`) jamás debe desequilibrar a los demás.
4. **Resiliencia de Scroll y Responsividad Estricta:** Reestablece el layout con `overflow: overlay` fallback y usa gutters que eviten que el UI "baile" al aparecer contenido largo.

## 4. El Código Base a Destruir y Refactorizar
A continuación se provee el código en crudo para que audites sus fantasmas y procedas a generar de cero las versiones modulares y maestras solicitadas.


### 1. src/index.css (Rediseñar a un sistema de plantillas limpio sin !important, categorizando base/components/utils)
```css
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

  /* [SISTEMA DE CAPES Z-INDEX - TAILWIND V4] */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-sidebar: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-max: 999;

  /* SÓC DE POBLE UNIVERSAL CARD TOKENS (No Magic Numbers) */
  --card-max-width: 480px;
  --card-grid-height: 864px;
  --card-list-height: 80px;
  --card-radius: 28px;

  /* [FASE 10: ARQUITECTURA SKELETON / FÍSICA] */
  --animate-shine: shine 2s linear infinite;
  --animate-press: physical-press 0.15s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes shine {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  @keyframes physical-press {
    0% { transform: scale(1); }
    50% { transform: scale(0.98); }
    100% { transform: scale(1); }
  }
}

:root {

  /* [PROTOCOL GÈNESI v10.26.0 - CANÒNIC] */
  --bg-app: #000000;
  --bg-master: #000000;
  --bg-panel: #000000;
  --bg-sidebar: #000000;
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  
  /* [CMS CONFIGURABLE TOKENS - CHAT LIST] */
  --text-chat-snippet: var(--text-main);
  --text-chat-time: var(--text-main);

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
  
  /* [CMS CONFIGURABLE TOKENS - CHAT LIST] */
  --text-chat-snippet: var(--text-main);
  --text-chat-time: var(--text-main);

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
  --bg-theme-header: #000000; /* CORREGIT: Header SEMPRE clar encara que estiguem en Mode Clar */

  /* [FASE 2: GLASSMORPHISM] Day Mode Tokens */
  --glass-bg-light: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-light);
}

.text-on-accent {
  color: var(--on-theme-accent-primary) ;
}

.text-on-accent-muted {
  color: var(--on-theme-accent-primary) ;
  opacity: 0.85;
}

/* Redundant custom theme utility classes removed as per Audit 2.1 (Tailwind handles them via @theme) */

.card,
.universal-card,
.bg-panel {
  border-radius: var(--radius-genesis) ;
  overflow: hidden;
}

/* [FASE 2: GLASSMORPHISM] Universal Class */
.glass-panel {
  background: var(--glass-theme-bg) ;
  backdrop-filter: var(--glass-blur) ;
  -webkit-backdrop-filter: var(--glass-blur) ;
  border: 1px solid var(--glass-border) ;
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-genesis);
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.modal-content,
.dialog-panel {
  border-radius: var(--radius-genesis) ;
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
@layer base {
  p {
    font-size: 1.15rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

/* 📜 PROTOCOL TIPOGRÀFIC DOCS - SÓC DE POBLE v1 */
/* Mapeig estricte per a contingut Ric tipus Google Docs */



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
    height: calc(100dvh - var(--spacing-header, 56px));
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
  border-radius: 28px ;
}

.card-radius {
  border-radius: var(--radius-genesis) ;
}



.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px) ;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0) ;
}

/* [MASTER CANONIC BUTTONS] Design System GEM MODERN v1.0 */
/* Botó Connectar Canònic (UniversalCard) */
.btn-connect-canonic {
  font-weight: 900 ;
  text-transform: uppercase ;
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
  height: 44px ;
  border-radius: 22px ;
  font-weight: 900 ;
  letter-spacing: 0.05em ;
  text-transform: uppercase ;
  display: flex ;
  align-items: center ;
  justify-content: center ;
  padding: 0 24px ;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ;
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

/* UNIFICACIÓ COLOR DE PÀRRAFS: SEMPRE NEGRE (LIGHT) O BLANC (DARK) */
p {
  color: var(--text-main);
}

/* [CMS GHOST BUTTON FIX] Recuperació tipogràfica per a la purge de Tailwind */
.app-cms-content ul,
.app-cms-content ol {
  list-style: none !important;
  padding-left: 0 !important;
  display: flex !important;
  flex-direction: column;
  gap: 12px;
}

.app-cms-content li {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 20px !important;
  background-color: var(--bg-panel) !important;
  border-left: 6px solid var(--theme-accent-primary) !important;
  border-radius: var(--radius-m3-small);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
  cursor: pointer;
  margin-bottom: 2px !important;
  font-weight: 700;
  color: var(--text-main);
}

.app-cms-content li:hover {
  transform: translateX(4px);
  background-color: var(--theme-accent-primary-faint) !important;
  color: var(--theme-accent-primary);
}

.app-cms-content li:active {
  transform: scale(0.97);
}

/* [PROTOCOL v11] LOW-END DEVICE (RURAL HARDWARE OPTIMIZATION) */
body.low-end-device * {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
}

body.low-end-device .bg-black\/40 {
  background-color: #080808 !important;
}

body.low-end-device .bg-black\/60 {
  background-color: #040404 !important;
}

body.low-end-device .bg-white\/5,
body.low-end-device .bg-white\/10 {
  background-color: #111111 !important;
  border: 1px solid var(--border-master) !important;
}


/* Custom Scrollbar for specific containers */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

```

### 2. src/components/AppLayout.jsx (Refactorizar estructura global)
```jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import NavigationRail from "./NavigationRail";
import { useDesign } from "../context/DesignContext";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { Ruler, ScanLine, Handshake, UploadCloud } from "lucide-react";
import NanoLoader from "./NanoLoader";
import ErrorBoundary from "./ErrorBoundary";
import { initGA, trackPageView } from "../services/analyticsService";
import GlobalFooter from "./GlobalFooter";
import MobileBottomNav from "./MobileBottomNav";
import BlueprintOverlay from "./BlueprintOverlay";
import GlobalDropZone from "./GlobalDropZone";
const ChatLayout = lazy(() => import("../components/ChatLayout"));
const ChatEmptyState = lazy(() => import("../components/ChatEmptyState"));
const ChatDetail = lazy(() => import("../components/ChatDetail"));
const Feed = lazy(() => import("./Feed"));
const Register = lazy(() => import("../pages/Register"));
const Towns = lazy(() => import("../pages/Towns"));
const Marketplace = lazy(() => import("./Marketplace"));
const MarketItemDetail = lazy(() => import("../pages/MarketItemDetail"));
const PostDetail = lazy(() => import("../pages/PostDetail"));
const ProfileView = lazy(() => import("../pages/ProfileView"));
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const TownDetail = lazy(() => import("../pages/TownDetail"));
const ArxiuOr = lazy(() => import("../pages/Archive"));
const CalendariMaster = lazy(() => import("../pages/MasterCalendar"));
const AlbumGlobal = lazy(() => import("../pages/GlobalAssetAlbum"));
const MapaActius = lazy(() => import("../pages/Map"));
const SearchDiscover = lazy(() => import("../pages/SearchDiscover"));
const OficiDocumentacio = lazy(() => import("../pages/OficiDocumentacio"));
const NexusFlash = lazy(() => import("../pages/NexusFlash"));
const SolatgeConsole = lazy(() => import("../pages/SolatgeConsole"));
const ProjectPresentation = lazy(() => import("../pages/ProjectPresentation"));
const GenesisViewer = lazy(() => import("../pages/GenesisViewer"));
const Versions = lazy(() => import("../pages/Versions"));
const BuscadorAjudes = lazy(() => import("../pages/BuscadorAjudes"));
const DirectoriComunitat = lazy(() => import("../pages/CommunityDirectory"));
const Header = lazy(() => import("./Header"));
const CreationHub = lazy(() => import("./CreationHub"));
const AccessibilitatUniversal = lazy(() => import("./AccessibilitatUniversal"));

const ArchitecteView = lazy(() => import("./ArchitecteView"));
const ResourceDetail = lazy(() => import("../pages/ResourceDetail"));
const InfografiaGallery = lazy(() => import("./Infoteca/InfografiaGallery"));
const ContextualMenu = lazy(() => import("./ContextualMenu"));
const CategoryManager = lazy(() => import("./CategoryManager"));
const ChatManager = lazy(() => import("../pages/ChatManager"));
const Notes = lazy(() => import("../pages/Notes"));
const IAIAChatSidebar = lazy(() => import("./IAIAChatSidebar"));
const ProfilePowerMenu = lazy(() => import("./ProfilePowerMenu"));
const MenuManagementView = lazy(() => import("../pages/MenuManagementView"));
const Utilitats = lazy(() => import("../pages/Utilitats"));
const Chrome145Report = lazy(() => import("../pages/Chrome145Report"));
const HubView = lazy(() => import("../pages/HubView"));

const VisionView = lazy(() => import("../pages/VisionView"));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  if (loading) return <NanoLoader message={t('common.connecting', 'Connectant...')} />;
  // CRITICAL FIX: Redirect anonymous users to register
  if (!user || user.isAnonymous)
    return <Navigate to="/registre" state={{ from: location }} replace />;
  return children;
};

const AppLayout = () => {
  const { t } = useTranslation();
  const { architectMode, accessibilityMode } = useDesign();
  const {
    isDrawerOpen,
    closeDrawer,
    closeIAIASidebar,
    iaiaSidebarOpen,
    iaiaSidebarContext,
    isAccessibilitatOpen,
    setIsAccessibilitatOpen,
  } = useNavigation();
  const location = useLocation();

  // [ANALYTICS BATEGAT] Inicialització i seguiment de rutes
  React.useEffect(() => {
    initGA();
  }, []);

  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // Bisturí 5: Destrueix l'eclipsi automàticament quan canvies de vista
  React.useEffect(() => {
    if (isDrawerOpen) closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, closeDrawer]); // ELIMINAT: isDrawerOpen per evitar tancament immediat en obrir

  // Detect minimal mode (for Mac-style window breakaway)
  const isMinimal = React.useMemo(() => 
    new URLSearchParams(location.search).get("window") === "true",
  [location.search]);

  const isOverflowHidden = React.useMemo(() => 
    location.pathname.startsWith("/chats") ||
    location.pathname.startsWith("/gestio-menu") ||
    location.pathname.startsWith("/notes"),
  [location.pathname]);

  // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció forçada de Viewport per a evitar escalat d'escriptori
  React.useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    // [SCROLL PERSISTENCE] Ensure root body is not jumpy
    document.body.style.overscrollBehaviorY = "none";
  }, []);

  const path = location.pathname.split("/")[1] || "chats";
  const isChatDetailMobileView = location.pathname.match(/^\/chats\/[^/]+/);

  // Mappeig de labels arquitectònics per al Frame Global
  const currentLabel = React.useMemo(() => {
    const routeLabels = {
      chats: "LIST_COLUMN [FULL_WIDTH]",
      mur: "PROMISCUOUS_FEED [VERTICAL]",
      mercat: "MERCH_SHEET [GRID_28px]",
      pobles: "COMMUNITY_MESH",
      perfil: "IDENTITY_TOTEM [V10.26]",
      entitat: "OFFICIAL_ENTITY_FRAME",
      mapa: "TACTICAL_RADAR_VIEW",
      ofici: "OFFICIAL_DOCS_SHEET",
      arxiu: "RESOURCE_VAULT",
      notes: "SCRATCHPAD_BUFFER",
      calendari: "MASTER_CALENDAR_PROTO",
      ajudes: "ADVISORY_DOSSIER",
      "gestio-menu": "DYNAMIC_MENU_OVERRIDE",
      utilitats: "UTILITY_HUB_FRAME",
    };
    return routeLabels[path] || "MAIN_VIEWPORT_FLEX";
  }, [path]);

  return (
    <div
      className="h-[100dvh] w-full flex flex-col overflow-hidden font-sans bg-theme-base text-theme-text relative max-h-[100dvh]"
    >
      <GlobalDropZone />

      {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
      {!isMinimal && (
        <div className="w-full relative z-base">
          <Suspense fallback={<NanoLoader message={t('common.loading', 'Carregant...')} />}>
            <BlueprintOverlay
              label="HEADER_CANONIC"
              dimensions="MATCH"
              color="orange"
              className="h-14 lg:h-16 flex-shrink-0"
            >
              <Header />
            </BlueprintOverlay>
          </Suspense>
        </div>
      )}

      {/* CONTENIDOR PRINCIPAL (SIDEBAR + ESCENARI) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 0. OVERLAY MÒBIL (Sombra de fondo purificada) */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-overlay)] md:hidden transition-opacity duration-300 animate-in fade-in"
            onClick={closeDrawer}
          />
        )}

        {!isMinimal && (
          <div
            className={`
              flex-shrink-0 transition-transform duration-300 ease-in-out overflow-hidden
              fixed z-sidebar top-0 left-0 h-[100dvh] w-[300px] max-w-[85vw] bg-theme-sidebar border-r border-[var(--border-master)]
              ${
                isDrawerOpen
                  ? "translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
                  : "-translate-x-full"
              }
              md:relative md:z-[var(--z-sidebar)] md:translate-x-0 md:h-full md:w-[280px] md:shadow-none md:border-r-0
            `}
          >
            <BlueprintOverlay
              label="SIDEBAR"
              dimensions="280px"
              color="blue"
              showBackupLink={true}
              className="h-full flex flex-col"
            >
              <NavigationRail />
            </BlueprintOverlay>
          </div>
        )}

        {/* 2. MAIN VIEWPORT (EL ESCENARIO) - HABILITEM SCROLL (TABULA RASA) */}
        <main
          className={`flex-1 flex flex-col min-w-0 min-h-0 relative bg-theme-base custom-scrollbar ${
            isOverflowHidden
              ? "overflow-hidden"
              : ""
          }`}
        >
          <Suspense fallback={null}>
            <ContextualMenu />
          </Suspense>

          <BlueprintOverlay
            label={currentLabel}
            dimensions="FLEX_GROW"
            color="emerald"
            className="flex-1 flex flex-col min-h-0 relative z-10"
          >
            <Suspense fallback={<NanoLoader message={t('common.connecting', 'Connectant...')} />}>
              <ErrorBoundary>
                <div
                  className={`flex-1 flex flex-col relative min-w-0 main-viewport custom-scrollbar !m-0 ${
                    isOverflowHidden
                      ? "h-full overflow-hidden"
                      : "min-h-full overflow-y-auto"
                  }`}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/chats" replace />}
                    />
                    <Route path="/pobles" element={<Towns />} />
                    <Route path="/pobles/:id" element={<ProfileView />} />
                    <Route path="/versions" element={<Versions />} />

                    <Route path="/chats/*" element={<ChatLayout />}>
                      <Route index element={<ChatEmptyState />} />
                      <Route path=":id" element={<ChatDetail />} />
                    </Route>

                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/mur" element={<Feed />} />
                    <Route path="/mercat" element={<Marketplace />} />
                    <Route path="/mercat/:id" element={<MarketItemDetail />} />
                    <Route path="/iaia" element={<ProfileView />} />
                    <Route
                      path="/perfil"
                      element={
                        <ProtectedRoute>
                          <ProfileView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/perfil/:id"
                      element={<ProfileView />}
                    />
                    <Route
                      path="/entitat/:id"
                      element={<ProfileView />}
                    />
                    <Route path="/login" element={<Register />} />
                    <Route path="/registre" element={<Register />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/mapa" element={<MapaActius />} />
                    <Route path="/search" element={<SearchDiscover />} />
                    <Route path="/ofici" element={<OficiDocumentacio />} />
                    <Route path="/ofici/:id" element={<OficiDocumentacio />} />
                    <Route path="/visio" element={<VisionView />} />
                    <Route
                      path="/buscador-ajudes"
                      element={<BuscadorAjudes />}
                    />
                    <Route path="/nexus" element={<NexusFlash />} />
                    <Route
                      path="/solatge"
                      element={
                        <ProtectedRoute>
                          <SolatgeConsole />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/genesis" element={<GenesisViewer />} />
                    <Route path="/directori" element={<DirectoriComunitat />} />
                    <Route path="/tools/trellat" element={<SolatgeConsole />} />
                    <Route path="/infoteca" element={<InfografiaGallery />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/arxiu" element={<ArxiuOr />} />
                    <Route path="/arxiu/:id" element={<ResourceDetail />} />
                    <Route path="/calendari" element={<CalendariMaster />} />
                    <Route path="/fotos/global" element={<AlbumGlobal />} />
                    <Route
                      path="/gestio/categories"
                      element={
                        <ProtectedRoute>
                          <CategoryManager />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestio/xats/:id?"
                      element={<ChatManager />}
                    />
                    <Route
                      path="/gestio-menu"
                      element={
                        <ProtectedRoute>
                          <MenuManagementView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/utilitats"
                      element={
                        <ProtectedRoute>
                          <Utilitats />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/accessibilitat"
                      element={<AccessibilitatUniversal />}
                    />
                    <Route path="/notes" element={<Notes />} />
                    {/* PÀGINES DE PROJECTE I LEGALITAT */}
                    <Route path="/projecte" element={<ProjectPresentation />} />
                    <Route path="/page/:slug" element={<ProjectPresentation />} />
                    <Route path="/chrome-145" element={<Chrome145Report />} />
                    <Route
                      path="/hub"
                      element={<HubView />}
                    />

                    {/* Fallback 404 Catch-All Route */}
                    <Route path="*" element={<Navigate to="/mur" replace />} />
                  </Routes>
                </div>
              </ErrorBoundary>
            </Suspense>

            {/* [ENCAPSULAMENT v10.33.1] Accessibilitat i Onboarding DINS del main */}
            {isAccessibilitatOpen && (
              <div className="absolute inset-0 !m-0 !p-0 z-[var(--z-overlay)] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                <Suspense
                  fallback={
                    <NanoLoader message={t('common.loading', 'Carregant...')} />
                  }
                >
                  <AccessibilitatUniversal />
                </Suspense>
              </div>
            )}

            {/* Boto Global d'Accessibilitat IAIA (Només si està activat al perfil) */}
            {accessibilityMode && !isAccessibilitatOpen && (
              <button
                onClick={() => setIsAccessibilitatOpen(true)}
                className="absolute bottom-[5.5rem] md:bottom-24 right-4 md:right-8 w-14 h-14 bg-[#0ea5e9] text-white rounded-[28px] shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center z-[var(--z-dropdown)] hover:scale-110 transition-transform cursor-pointer border-2 border-white/20"
                aria-label="Obrir Matriu IAIA d'Accessibilitat"
              >
                <Handshake size={28} />
              </button>
            )}
          </BlueprintOverlay>
        </main>
      </div>

      {/* BARRA DE NAVEGACIÓ MÒBIL (BATEGAT v11.3) - AMAGADA DINS DEL XAT PER EVITAR COL·LISIÓ AMB TECLAT VIRTUAL */}
      {!isChatDetailMobileView && (
        <div className="relative z-base md:hidden bg-[#000000]">
          <MobileBottomNav />
        </div>
      )}

      {/* IAIA CHAT SIDEBAR (DRETA) - GLOBAL & BATEGAT */}
      <Suspense fallback={null}>
        <IAIAChatSidebar
          isOpen={iaiaSidebarOpen}
          onClose={closeIAIASidebar}
          context={iaiaSidebarContext}
        />
      </Suspense>

      {/* POWER MENU (DASHBOARD PERSONALIZA) - PROTOCOL MINIMALISTA */}
      <Suspense fallback={null}>
        <ProfilePowerMenu />
      </Suspense>

      {/* MODALE D'EXPLICACIÓ (ARQUITECTE) - REPOSITIONAT PELS FRAMES UNIFICATS */}
      {architectMode && (
        <div className="fixed inset-0 z-overlay bg-black/40 backdrop-blur-xl md:pl-[280px]">
          <div className="h-full flex flex-col relative animate-slide-up">
            <Suspense fallback={<NanoLoader message={t('common.loading', 'Carregant...')} />}>
              <ArchitecteView />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AppLayout);

```

### 3. src/components/NavigationRail.jsx (Modularizar y aislar del layout rígido)
```jsx
import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MessageSquare,
  LayoutGrid,
  Store,
  MapPin,
  X,
  Plus,
  ChevronRight,
  Cpu,
  Notebook,
  CreditCard,
} from "lucide-react";
import { useNavigation } from '../context/NavigationContext';
// RealmSwitcher retirat a panell d'administració (Funcionalitat en desenvolupament OMEGA-10)

const NavigationRail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { closeDrawer } = useNavigation();

  const menuGroups = [
    {
      id: "base",
      title: "PILARS DEL MAS",
      icon: <LayoutGrid className="w-5 h-5" />,
      items: [
        { path: "/chats", label: t("nav.chats"), icon: <MessageSquare /> },
        { path: "/mur", label: t("nav.feed"), icon: <LayoutGrid /> },
        { path: "/mercat", label: t("nav.market"), icon: <Store /> },
        { path: "/pobles", label: t("nav.towns"), icon: <MapPin /> },
      ],
    },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  };

  return (
    <nav className="w-[80px] md:w-[260px] xl:w-[280px] shrink-0 h-full flex flex-col bg-black z-30 transition-all duration-300 shadow-2xl overflow-hidden relative">
      {/* RealmSwitcher mogut a l'Admin Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
        {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP FRAME) - EXACTAMENT h-12 COM EL CONTEXTUAL MENU */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/hub");
          }}
          className="w-full h-12 shrink-0 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-black flex items-center justify-start px-8 space-x-3 transition-colors active:bg-[#3730a3] group relative overflow-hidden rounded-none z-10"
        >
          <div className="flex items-center justify-center bg-white/10 w-8 h-8 rounded-[28px] group-hover:bg-white/20 transition-colors shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="tracking-[0.2em] text-[15px] uppercase whitespace-nowrap pt-0.5">
            {t("common.add") || "CONNECTAR"}
          </span>
        </button>

        {/* 2. MENÚ PRINCIPAL (CONTEXTUAL TABS) */}
        <div className="px-4 pt-4 space-y-3 pb-[100px] md:pb-8 relative z-0">
          <div className="bg-orange-500/[0.03] rounded-[28px] p-2 space-y-0.5 shadow-[inset_0_0_30px_rgba(255,107,0,0.08)] relative overflow-hidden group/quartet">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent-primary)]/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
            {menuGroups[0].items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => `
                  w-full flex items-center space-x-3 px-3 h-11 rounded-xl transition-all relative overflow-hidden
                  ${
                    isActive
                      ? "bg-[var(--theme-accent-primary)] text-white shadow-[0_0_25px_rgba(255,107,0,0.4)] scale-[1.02] z-10"
                      : "text-white opacity-90 hover:bg-[var(--theme-accent-primary)]/10 hover:text-white"
                  }
                  font-black
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#111827] text-white border border-white/10 rounded-r-full shadow-[0_0_15px_white]" />
                    )}
                    <div
                      className={`w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-[var(--theme-accent-primary)] group-hover/quartet:scale-110"
                      }`}
                    >
                      {React.cloneElement(item.icon, {
                        size: 22,
                        strokeWidth: isActive ? 3 : 2,
                      })}
                    </div>
                    <span
                      className={`leading-none mb-0.5 whitespace-nowrap transition-colors text-[20px] ${
                        isActive ? "text-white" : "text-gray-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </nav>
  );
};

export default NavigationRail;

```
