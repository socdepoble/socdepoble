# Auditoria Visual Sóc de Poble (CSS Ghosts & Design System)

**Prompt para Qwen/DeepSeek:**
"Actúa como un Staff UI/UX Engineer experto en Design Systems. Aquí tienes los archivos core de CSS y layout de nuestra PWA (Tailwind + Custom CSS). Actualmente arrastramos una grave DEUDA TÉCNICA: no tenemos un sistema de diseño inmutable ni módulos claros, lo que provoca código frágil, z-index caóticos, `!important` redundantes y colisiones entre Tailwind y CSS tradicional.

    Tu misión es dual (Auditoría Final Fase 10):
1. **Validar la Inmutabilidad**: Analizar los nuevos módulos creados (sobre todo los correspondientes a la Universal Card y el Botón Maestro). ¿La arquitectura Compound Components y las variantes CVA garantizan que este código es "indestructible"?
2. **Blindaje de Portales**: Analizar la inyección de `GlobalModals.jsx` en un `createPortal`. ¿Está 100% blindado contra cualquier `overflow: hidden` del layout?
3. **Escalablidad futura**: ¿Qué le falta a esta arquitectura para ser definitiva?

Entrégame tu reseña honesta y despiadada. Si todo está correcto, dame el visto bueno oficial."

---

## Archivo: src/index.css\n```\n@import "tailwindcss";

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




\n```\n\n## Archivo: src/design-system/components/Button/Button.jsx\n```\nimport React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { buttonVariants } from './Button.variants';

export const Button = React.forwardRef(
  (
    {
      className,
      intent,
      size,
      shape,
      fullWidth,
      isLoading,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseClasses = buttonVariants({
      intent,
      size,
      shape,
      fullWidth,
      isLoading,
    });

    const mergedClasses = twMerge(clsx(baseClasses, className));

    return (
      <button
        ref={ref}
        className={mergedClasses}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregant...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
\n```\n\n## Archivo: src/components/UniversalCard/index.jsx\n```\nimport React, { Suspense, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useNavigation } from '../../context/NavigationContext';
import { useDesign } from '../../context/DesignContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, ImageIcon } from 'lucide-react';
import Avatar from '../Avatar';
import { Button } from '../../design-system/components/Button';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardMedia from './UniversalCard.Media';
import UniversalCardBody from './UniversalCard.Body';
import UniversalCardFooter from './UniversalCard.Footer';
import BlueprintOverlay from '../BlueprintOverlay';
import { logger } from '../../utils/logger';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cardVariants } from './UniversalCard.variants';
import './UniversalCard.css';

const FALLBACK_NANO_IMAGES = [
    "/assets/brain/generations/nano_llibre_memoria.png",
    "/assets/brain/generations/nano_fibra_espart.png",
    "/assets/brain/generations/nano_dron_agricola.png",
    "/assets/brain/generations/nano_mercat_llavors.png",
    "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
    "/assets/brain/generations/nano_porta_masia_1774197069297.png",
    "/assets/brain/generations/nano_rentonar_arquitectura_1774196001928.png",
    "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"
];

// Hook personalitzat per a detectar ruta de xat sense re-renders
const useIsChatRoute = () => {
    const locationRef = useRef(window?.location?.pathname || '');
    const [isChat, setIsChat] = React.useState(() => 
        locationRef.current.startsWith('/chats')
    );
    
    React.useEffect(() => {
        const checkRoute = () => {
            const newPath = window.location.pathname;
            if (newPath !== locationRef.current) {
                locationRef.current = newPath;
                setIsChat(newPath.startsWith('/chats'));
            }
        };
        
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('popstate'));
            checkRoute();
        };
        
        window.addEventListener('popstate', checkRoute);
        
        return () => {
            history.pushState = originalPushState;
            window.removeEventListener('popstate', checkRoute);
        };
    }, []);
    
    return isChat;
};

// Funcció memoitzada per a imatges fallback
const getFallbackImage = (id) => {
    const strId = String(id || '1');
    let hash = 0;
    for (let i = 0; i < strId.length; i++) {
        hash = strId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_NANO_IMAGES[Math.abs(hash) % FALLBACK_NANO_IMAGES.length];
};

const UniversalCard = ({
    item,
    title,
    subtitle,
    image,
    avatarSrc,
    avatarRole,
    avatarName,
    children,
    className = "",
    mode = "post",
    variant = "post",
    isBating = false,
    excerpt,
    images,
    isOfficial: forcedOfficial = false,
    forensicMode: forcedForensic = false,
    viewMode = "grid"
}) => {
    const cardVariant = variant || mode;
    const { openViewer } = useModal();
    const { forensicMode: contextForensic } = useNavigation();
    const { gloveMode, seniorMode, hapticService } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const isMaster = isAdmin || user?.app_metadata?.role === 'master';
    const isChatRoute = useIsChatRoute();
    
    // MEMOITZACIÓ DE DADES DERIVADES
    const mediaList = useMemo(() => 
        images || item?.images || 
        (Array.isArray(item?.image_url) ? item.image_url : null) || 
        (Array.isArray(image) ? image : null),
        [images, item?.images, item?.image_url, image]
    );

    const displayImage = useMemo(() => {
        return image || item?.image_url || item?.image || 
               (mediaList ? mediaList[0] : null) ||
               getFallbackImage(item?.id || item?.uuid || title);
    }, [image, item?.image_url, item?.image, mediaList, item?.id, item?.uuid, title]);

    const displayTitle = useMemo(() => 
        title || item?.title || item?.name || "Sóc de Poble",
        [title, item?.title, item?.name]
    );

    const displayAuthor = useMemo(() => 
        avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble",
        [avatarName, item?.author_name, item?.author, item?.seller]
    );

    const displayExcerpt = useMemo(() => 
        excerpt || item?.description || item?.content || "",
        [excerpt, item?.description, item?.content]
    );

    const displayTown = useMemo(() => 
        subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes',
        [subtitle, item?.location?.town, item?.town_name]
    );

    const createdAtDate = useMemo(() => 
        item?.created_at ? new Date(item.created_at) : 
        (item?.date ? new Date(item.date) : null),
        [item]
    );

    const displayDate = useMemo(() => 
        createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda",
        [createdAtDate]
    );

    const displayTime = useMemo(() => 
        createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        (item?.metadata?.bategat_time || ""),
        [createdAtDate, item?.metadata?.bategat_time]
    );

    const isOfficial = useMemo(() => 
        forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || 
        item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || 
        item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles',
        [forcedOfficial, item?.author_role, item?.type, item?.official, cardVariant]
    );

    const isAlert = useMemo(() => 
        item?.category === 'Alert' || item?.type === 'alert' || 
        item?.is_alert || item?.category === 'Danger',
        [item?.category, item?.type, item?.is_alert]
    );

    const isSostenible = useMemo(() => 
        item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'),
        [item?.category, item?.tags]
    );

    const displayPrice = useMemo(() => 
        item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : ""),
        [item?.price, cardVariant]
    );

    // HANDLERS MEMOITZATS
    const handleCardClick = useCallback(() => {
        if (seniorMode && hapticService?.trigger) {
            hapticService.trigger('medium');
        }
        const id = item?.uuid || item?.id;
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate, seniorMode, hapticService]);

    const handleConnectClick = useCallback(async (e) => {
        e.stopPropagation();
        const postId = item?.uuid || item?.id;
        if (!postId) {
            logger.error("[UniversalCard] No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        if (cardVariant === 'pobles') {
            navigate(`/pobles/${postId}?action=connect`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${postId}?action=connect`);
        } else {
            navigate(`/post/${postId}?action=connect`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const cardClasses = useMemo(() => {
        let activeVariant = 'post';
        if (isAlert) activeVariant = 'alert';
        else if (isOfficial) activeVariant = 'official';
        else if (isSostenible) activeVariant = 'sostenible';
        else activeVariant = cardVariant;

        return twMerge(
            clsx(
                cardVariants({
                    variant: activeVariant,
                    viewMode,
                    interactive: true,
                    seniorMode,
                    forensicMode: isForensic,
                    gloveMode,
                    isBating
                }),
                className,
                "universal-card" // Preserving identifier for backward compatibility with UniversalCard.css
            )
        );
    }, [cardVariant, viewMode, className, isBating, gloveMode, seniorMode, isOfficial, isAlert, isSostenible, isForensic]);

    const CardContent = (
        <article
            className={cardClasses}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
            role="article"
            aria-label={displayTitle}
        >
            {viewMode === 'list' ? (
                <div className="flex items-center gap-4 p-4 w-full">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={displayTitle}
                            className="w-24 h-24 object-cover rounded-[20px] hover:scale-110 transition-transform duration-500 flex-shrink-0"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-24 h-24 flex items-center justify-center rounded-[20px] bg-white/5 flex-shrink-0">
                            <ImageIcon size={20} className="text-gray-500" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0 pr-4 z-10">
                        <h4 className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide">{displayTitle}</h4>
                        <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide truncate mt-1">
                            <span className="text-[var(--theme-accent-primary)]">{displayAuthor}</span>
                            <span>•</span>
                            <span className="opacity-70">{displayTown.replace("Poble Principal: ", "").trim()}</span>
                        </div>
                    </div>
                    {displayPrice && (
                        <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-[28px] flex-shrink-0 z-10">
                            {displayPrice}
                        </div>
                    )}
                    <Button 
                        intent="canonic"
                        shape="pill"
                        size="sm"
                        className="shrink-0 ml-2 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConnectClick(e);
                        }}
                        aria-label="Connectar"
                    >
                        CONNECTAR
                    </Button>
                    <div className="absolute inset-0 z-0" aria-hidden="true"></div>
                </div>
            ) : (
                <>
                    <UniversalCardHeader 
                        item={item}
                        cardVariant={cardVariant}
                        displayTown={displayTown}
                        displayAuthor={displayAuthor}
                        avatarSrc={avatarSrc}
                        avatarRole={avatarRole}
                        isOfficial={isOfficial}
                        displayDate={displayDate}
                        displayTime={displayTime}
                    />
                    <UniversalCardMedia 
                        item={item}
                        cardVariant={cardVariant}
                        mediaList={mediaList}
                        displayImage={displayImage}
                        displayTitle={displayTitle}
                        openViewer={openViewer}
                        navigate={navigate}
                    />
                    <Suspense fallback={<div className="h-16 mt-2 rounded bg-surface-var/30 animate-pulse w-full max-w-sm" role="status"><span className="sr-only">Carregant contingut...</span></div>}>
                        <UniversalCardBody 
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            item={item}
                            isOfficial={isOfficial}
                            children={children}
                            navigate={navigate}
                            cardVariant={cardVariant}
                            displayPrice={displayPrice}
                        />
                    </Suspense>
                    <Suspense fallback={<div className="h-10 mt-4 rounded bg-surface-var/30 animate-pulse w-[80%]" role="status"><span className="sr-only">Carregant peu...</span></div>}>
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                        />
                    </Suspense>
                </>
            )}
        </article>
    );

    const FinalCard = CardContent;

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${cardVariant.toUpperCase()} | R: 28PX`} color="cyan">
            {FinalCard}
        </BlueprintOverlay>
    ) : FinalCard;
};



const propsAreEqual = (prevProps, nextProps) => {
    const prevId = prevProps.item?.uuid || prevProps.item?.id;
    const nextId = nextProps.item?.uuid || nextProps.item?.id;
    
    return (
        prevId === nextId &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.item?.connections_count === nextProps.item?.connections_count &&
        prevProps.item?.comments_count === nextProps.item?.comments_count &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating &&
        prevProps.className === nextProps.className &&
        prevProps.variant === nextProps.variant &&
        prevProps.mode === nextProps.mode &&
        prevProps.avatarSrc === nextProps.avatarSrc &&
        prevProps.image === nextProps.image &&
        prevProps.title === nextProps.title &&
        prevProps.subtitle === nextProps.subtitle &&
        prevProps.isOfficial === nextProps.isOfficial &&
        prevProps.forensicMode === nextProps.forensicMode
    );
};

const MemoizedCard = React.memo(UniversalCard, propsAreEqual);

MemoizedCard.Header = UniversalCardHeader;
MemoizedCard.Media = UniversalCardMedia;
MemoizedCard.Body = UniversalCardBody;
MemoizedCard.Footer = UniversalCardFooter;

export default MemoizedCard;
\n```\n\n## Archivo: src/components/UniversalCard/UniversalCard.variants.js\n```\nimport { cva } from 'class-variance-authority';

export const cardVariants = cva(
  `
    relative w-full overflow-hidden 
    bg-theme-panel shadow-2xl border border-white/5 
    flex flex-col transition-all duration-500 
    hover:shadow-black/50 hover:-translate-y-1 hover:scale-[1.01]
  `,
  {
    variants: {
      variant: {
        post: 'rounded-[28px]',
        mercat: 'rounded-[28px] border-primary/20',
        market: 'rounded-[28px] border-primary/20',
        pobles: 'rounded-[28px]',
        ajuntament: 'rounded-[28px]',
        official: 'rounded-[28px] border-2 border-primary',
        alert: 'rounded-[28px] border-2 border-feedback-error',
        sostenible: 'rounded-[28px] border-2 border-feedback-success',
      },
      viewMode: {
        grid: 'h-auto mx-auto max-w-[480px] min-h-[864px]',
        list: 'min-h-[80px] bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary !shadow-none !h-auto flex-row',
        single: 'h-auto max-w-[480px] mx-auto',
      },
      interactive: {
        true: 'cursor-pointer hover:border-primary',
        false: 'cursor-default',
      },
      seniorMode: {
        true: 'border-2 text-lg',
        false: '',
      },
      forensicMode: {
        true: 'outline-2 outline-dashed outline-cyan-400',
        false: '',
      },
      gloveMode: {
        true: 'scale-105',
        false: '',
      },
      isBating: {
        true: 'animate-bategat',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'post',
      viewMode: 'grid',
      interactive: true,
      seniorMode: false,
      gloveMode: false,
      forensicMode: false,
      isBating: false
    },
  }
);
\n```\n\n## Archivo: src/components/UniversalCard/UniversalCard.Header.jsx\n```\nimport React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import { Zap } from 'lucide-react';

const UniversalCardHeader = ({ 
    item, 
    cardVariant, 
    displayTown, 
    displayAuthor, 
    avatarSrc, 
    avatarRole, 
    isOfficial, 
    displayDate, 
    displayTime 
}) => {
    const navigate = useNavigate();

    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        const cleanTown = townName.replace("Poble Principal:", "").trim();
        if (cleanTown.includes("La Torre")) return "Gent de La Torre";
        return `Gent de ${cleanTown}`;
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        
        // 1. Pobles Rule: Clicking the header goes to the Town/Community page
        if (cardVariant === 'pobles') {
            const townId = item?.towns?.id || item?.town_id;
            if (townId) {
                navigate(`/pobles/${townId}`);
            } else {
                navigate('/pobles');
            }
            return;
        }

        // 2. Default Profile Routing
        const authorId = item?.author_user_id || item?.author_id || item?.user_id;
        const entityId = item?.author_entity_id;
        const authorName = item?.author_name || item?.author || displayAuthor;

        if (entityId) {
            navigate(`/entitat/${entityId}`);
        } else if (authorId) {
            navigate(`/perfil/${authorId}`);
        } else if (authorName) {
            const slug = authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            navigate(`/perfil/${slug}`);
        }
    };

    return (
        <header 
            className={`card-header-boina h-16 ${isOfficial ? 'variant-official' : 'variant-standard'}`} 
            onClick={handleAuthorClick}
        >
            <div className="header-left flex items-center gap-3 flex-1 min-w-0 pr-2">
                <Avatar
                    src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                    name={displayAuthor}
                    role={avatarRole || item?.author_role}
                    size="md"
                    className="genesis-avatar shrink-0"
                />
                <div className="header-text flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="master-author-name leading-tight text-on-accent mb-1 truncate w-full" title={cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}>
                        {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                    </h3>
                    
                    {cardVariant === 'pobles' ? (
                        <div className="location-text mt-0.5 truncate w-full" title={`De part de: ${displayAuthor}`}>
                            De part de: {displayAuthor}
                        </div>
                    ) : (
                        displayTown && displayTown !== displayAuthor && (
                            <div className="location-text mt-0.5 truncate w-full" title={displayTown.replace("Poble Principal:", "").trim()}>
                                {displayTown.replace("Poble Principal:", "").trim()}
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="header-right-meta flex items-center gap-2">
                <div className="header-meta-details flex flex-col items-end justify-center leading-none">
                    {cardVariant !== 'pobles' && (
                        <div className="flex flex-col items-start mr-1">
                            <span className="header-time text-[11px] font-black text-on-accent-muted tracking-tighter mb-0.5">{displayTime}</span>
                            <span className="header-date text-on-accent text-[12px] font-black">{displayDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UniversalCardHeader;
\n```\n\n## Archivo: src/components/UniversalCard/UniversalCard.Body.jsx\n```\nimport React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button';

const UniversalCardBody = ({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    const TRUNCATE_LENGTH = 280;
    
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'smart-clamp-tags' : 'smart-clamp-notags';

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div className="card-body flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div 
                className="flex flex-col flex-1 min-h-0 px-5 pt-5 pb-6 overflow-hidden cursor-pointer group"
                onClick={handleReadMoreClick}
                role="button"
                tabIndex={0}
                aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}
            >
                <div className="title-row flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity">
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[1.3rem] sm:text-[1.5rem] font-black text-theme-text leading-tight line-clamp-2 tracking-tight min-h-[3.75rem]">
                                {displayTitle}
                            </h2>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <span className="card-price whitespace-nowrap">{displayPrice}</span>
                        )}
                    </div>
                    <h3 className="text-[1rem] sm:text-[1.1rem] font-bold text-[var(--theme-accent-primary)] leading-snug line-clamp-1 truncate min-h-[1.51rem] w-full">
                        {item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : '')) || ' '}
                    </h3>
                </div>

                <div className="card-excerpt-container flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-1">
                    {displayExcerpt && (
                        <p className={`card-excerpt text-slate-900 dark:text-slate-100 font-medium text-[15px] m-0 p-0 ${smartClampClass}`} style={{ lineHeight: '24px' }}>
                            {displayExcerpt}
                        </p>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && displayExcerpt.length > 130 && (
                    <Button
                        intent="primary"
                        fullWidth
                        className="py-2.5 uppercase tracking-wide rounded-none"
                        aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                        onClick={handleReadMoreClick}
                        rightIcon={<ChevronRight size={18} className="mt-[1px]" />}
                    >
                        Llegir més
                    </Button>
                )}

                {item?.tags && item.tags.length > 0 && (
                    <div 
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-blue-500/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                        {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[14px] font-bold uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                        {item.tags.length > 3 && (
                            <span title={item.tags.slice(3).join(', ')} className="text-[14px] font-bold uppercase tracking-wide opacity-80 cursor-default">
                                +{item.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalCardBody;
\n```\n\n## Archivo: src/components/UniversalCard/UniversalCard.Media.jsx\n```\nimport React, { useState } from 'react';
import { Image as ImageIcon, Zap } from 'lucide-react';
import ImageCarousel from '../ImageCarousel';
import Watermark from '../Watermark';

const UniversalCardMedia = ({ 
    item, 
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer 
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        
        // Regla Dorada: Imatge sempre obri el visor en gran.
        if (mediaList && mediaList.length > 0) {
            openViewer(mediaList, 0);
        } else if (displayImage) {
            openViewer([{ src: displayImage, title: displayTitle, type: 'image' }], 0);
        }
    };

    return (
        <div className="card-media-wrapper relative" onClick={handleMediaClick}>
            {(item?.is_pinned || item?.metadata?.is_pinned) && (
                <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-full p-2 text-[var(--theme-accent-primary)] shadow-xl border border-white/20 select-none pointer-events-none">
                    <Zap size={16} fill="currentColor" className="zap-celestial" />
                </div>
            )}
            {mediaList && mediaList.length > 1 ? (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                    <div 
                        className="image-overlay-credits absolute right-2 z-10 pointer-events-none drop-shadow-md pb-1" 
                        style={{ fontSize: '11px', bottom: '4px', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                        © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    {(!displayImage || hasImageError) ? (
                        <Watermark variant="white" opacity={0.5}>
                            <img 
                                src="/assets/brain/generations/nano_relleu_notext_1774284617988.png"
                                alt="Paisatge Solarpunk genèric"
                                className="universal-card-media filter brightness-75 contrast-125 saturate-50"
                                loading="lazy"
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA (FALLBACK)
                            </div>
                        </Watermark>
                    ) : (
                        <Watermark variant="white" opacity={0.7}>
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="universal-card-media" 
                                loading="lazy" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openViewer({ src: displayImage, title: displayTitle, type: 'image' });
                                }}
                                style={{ cursor: 'zoom-in' }}
                                onError={() => setHasImageError(true)}
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                            </div>
                        </Watermark>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalCardMedia;
\n```\n\n## Archivo: src/components/UniversalCard/UniversalCard.Footer.jsx\n```\nimport React from 'react';
import { Plus, Share2, MoreHorizontal, MessageCircle, Globe } from 'lucide-react';
import { Button } from '../../design-system/components/Button';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick
}) => {
    // Determine the main button text
    let buttonText = "CONNECTAR";
    let icon = <Plus size={20} className="drop-shadow-sm" strokeWidth={2.5}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = "CONNECTAR";
    } else if (cardVariant === 'pobles') {
        buttonText = "VISITAR POBLE";
    } else if (item?.type === 'tramit') {
        buttonText = "TRAMITAR";
    }

    const handleShareClick = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: displayTitle || 'Sóc de Poble',
                text: 'Fes un cop d\'ull a això en Sóc de Poble!',
                url: window.location.href,
            }).catch((error) => console.log('Err sharing', error));
        }
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        // The user mentioned this sends them to the Chat of the author to talk about the product.
        // For now, we open the Post Detail View with a comment intent, or navigate to chat.
        const id = item?.uuid || item?.id;
        if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}?action=comment`);
        } else {
            navigate(`/post/${id}?action=comment`);
        }
    };

    const handleTranslateClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        // OMEGA-39: Lanzará un trigger hacia el gestor de IA cuando la infraestructura Vertex esté enchufada
        window.dispatchEvent(new CustomEvent('omega-translate-request', { detail: { postId: id, title: displayTitle } }));
        alert("🌐 Motor de Traducció A Demanda (Vertex AI) prompte disponible.");
    };

    return (
        <div className="card-footer-master mt-auto">
            <div className="footer-actions-mur">
                <button 
                    className="btn-touch translate-btn" 
                    onClick={handleTranslateClick} 
                    aria-label="Traduir Article"
                    title="Traduir Article"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--theme-accent-primary)', marginRight: '8px' }}
                >
                    <Globe size={20} strokeWidth={2.5} />
                </button>
                <Button 
                    intent="primary"
                    shape="pill"
                    fullWidth
                    leftIcon={icon}
                    className="tracking-widest"
                    onClick={handleConnectClick}
                >
                    {buttonText}
                </Button>
                <div className="footer-touch-group">
                    <button className="btn-touch" onClick={handleCommentClick} aria-label="Comentar">
                        <MessageCircle size={22} strokeWidth={2.2} />
                    </button>
                    <button className="btn-touch" onClick={handleShareClick} aria-label="Compartir">
                        <Share2 size={22} strokeWidth={2.2} />
                    </button>
                    {isMaster && (
                        <button className="btn-touch" onClick={(e) => e.stopPropagation()} aria-label="Opcions">
                            <MoreHorizontal size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalCardFooter;
\n```\n\n## Archivo: src/components/GlobalModals.jsx\n```\nimport React from 'react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Portal from './Portal';
import CreatePostModal from './CreatePostModal';
import AddItemModal from './AddItemModal';
import CreateEventModal from './CreateEventModal';
import SocialManager from './SocialManager';
import ConnectionSelectorModal from './ConnectionSelectorModal';
import AgentSelectorModal from './AgentSelectorModal';
import MediaViewerModal from './MediaViewerModal';
import LegalDocsModal from './LegalDocsModal';
import TallerTrellat from './TallerTrellat';
import IAIARoleSelectorModal from './IAIARoleSelectorModal';
import MagicPregoner from './MagicPregoner';
import CreationHub from './CreationHub';
import GuestInteractionModal from './GuestInteractionModal';

const GlobalModals = () => {
    const { isCreateModalOpen, isPostModalOpen, setIsPostModalOpen, isEventModalOpen, setIsEventModalOpen, isMarketModalOpen, setIsMarketModalOpen, isSocialManagerOpen, setIsSocialManagerOpen, postModalConfig, isConnectionModalOpen, connectionConfig, closeConnectionModal, isAgentSelectorOpen, closeAgentSelector, agentSelectorConfig, isViewerOpen, closeViewer, viewerConfig, isLegalModalOpen, closeLegalModal, legalConfig, editConfig, isEditModalOpen, closeEditModal, isMagicPregonerOpen, setIsMagicPregonerOpen } = useModal();
    const { isPlayground } = useAuth();

    // Import ConnectionSelectorModal inside if needed or at top

    const handlePostCreated = () => {
        setIsPostModalOpen(false);
        // Dispatch a global event to refresh any mounted feed
        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'post' } }));
    };

    const handleEventCreated = () => {
        setIsEventModalOpen(false);
        // Events are also posts in the feed
        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'post' } }));
    };

    const handleItemCreated = () => {
        setIsMarketModalOpen(false);
        // Dispatch a global event to refresh any mounted market
        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'market' } }));
    };

    return (
        <Portal>
            {isPostModalOpen && (
                <CreatePostModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                    onPostCreated={handlePostCreated}
                    isPrivateInitial={postModalConfig?.isPrivate}
                    initialFile={postModalConfig?.initialFile}
                    isPlayground={isPlayground}
                />
            )}

            {isEventModalOpen && (
                <CreateEventModal
                    isOpen={isEventModalOpen}
                    onClose={() => setIsEventModalOpen(false)}
                    onEventCreated={handleEventCreated}
                    isPlayground={isPlayground}
                />
            )}

            {isMarketModalOpen && (
                <AddItemModal
                    isOpen={isMarketModalOpen}
                    onClose={() => setIsMarketModalOpen(false)}
                    onItemCreated={handleItemCreated}
                    isPlayground={isPlayground}
                />
            )}

            {isSocialManagerOpen && (
                <SocialManager
                    isOpen={isSocialManagerOpen}
                    onClose={() => setIsSocialManagerOpen(false)}
                />
            )}

            {isConnectionModalOpen && connectionConfig && (
                <ConnectionSelectorModal
                    isOpen={isConnectionModalOpen}
                    onClose={closeConnectionModal}
                    postId={connectionConfig.postId}
                    currentTags={connectionConfig.currentTags || []}
                    onUpdate={connectionConfig.onUpdate}
                />
            )}

            {isAgentSelectorOpen && agentSelectorConfig && (
                <AgentSelectorModal
                    isOpen={isAgentSelectorOpen}
                    onClose={closeAgentSelector}
                    postId={agentSelectorConfig.postId}
                    authorId={agentSelectorConfig.authorId}
                    context={agentSelectorConfig.context}
                />
            )}

            {isViewerOpen && viewerConfig && (
                <MediaViewerModal
                    isOpen={isViewerOpen}
                    onClose={closeViewer}
                    src={viewerConfig.src}
                    title={viewerConfig.title}
                    type={viewerConfig.type}
                />
            )}

            {isLegalModalOpen && legalConfig && (
                <LegalDocsModal
                    isOpen={isLegalModalOpen}
                    onClose={closeLegalModal}
                    title={legalConfig.title}
                    content={legalConfig.content}
                    type={legalConfig.type}
                />
            )}
            {isEditModalOpen && editConfig && (
                <CreatePostModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    editMode={true}
                    postData={editConfig.postData}
                    onPostCreated={handlePostCreated}
                    isPlayground={isPlayground}
                />
            )}

            {isMagicPregonerOpen && (
                <MagicPregoner 
                    onClose={() => setIsMagicPregonerOpen(false)} 
                    onContentGenerated={(text) => {
                        window.dispatchEvent(new CustomEvent('magic-text-generated', { detail: { text } }));
                        setIsMagicPregonerOpen(false);
                    }}
                />
            )}
            {isCreateModalOpen && <CreationHub />}
        </Portal>
    );
};

export default React.memo(GlobalModals);
\n```\n\n## Archivo: src/components/AppLayout.jsx\n```\nimport React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
const BuscadorAjudes = lazy(() => import("../pages/BuscadorAjudes"));
const DirectoriComunitat = lazy(() => import("../pages/CommunityDirectory"));
const Header = lazy(() => import("./Header"));
const CreationHub = lazy(() => import("./CreationHub"));
const AccessibilitatUniversal = lazy(() => import("./AccessibilitatUniversal"));
const ArchitecteView = lazy(() => import("./ArchitecteView"));
const DossierSocis = lazy(() => import("../pages/DossierSocis"));
const ResourceDetail = lazy(() => import("../pages/ResourceDetail"));
const InfografiaGallery = lazy(() => import("./Infoteca/InfografiaGallery"));
const ContextualMenu = lazy(() => import("./ContextualMenu"));
const CategoryManager = lazy(() => import("./CategoryManager"));
const ChatManager = lazy(() => import("../pages/ChatManager"));
const Notes = lazy(() => import("../pages/Notes"));
const LegalNotice = lazy(() => import("../pages/LegalNotice.jsx"));
const IAIAChatSidebar = lazy(() => import("./IAIAChatSidebar"));
const ProfilePowerMenu = lazy(() => import("./ProfilePowerMenu"));
const MenuManagementView = lazy(() => import("../pages/MenuManagementView"));
const Utilitats = lazy(() => import("../pages/Utilitats"));
const Chrome145Report = lazy(() => import("../pages/Chrome145Report"));
const HubView = lazy(() => import("../pages/HubView"));
const Financament = lazy(() => import("../pages/Financament"));
const VisionView = lazy(() => import("../pages/VisionView"));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <NanoLoader message="Bategant..." />;
  // CRITICAL FIX: Redirect anonymous users to register
  if (!user || user.isAnonymous)
    return <Navigate to="/registre" state={{ from: location }} replace />;
  return children;
};

const AppLayout = () => {
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
  const { openPostModal } = useModal();
  const [isGlobalDragging, setIsGlobalDragging] = React.useState(false);
  const globalDragCounter = React.useRef(0);

  const handleGlobalDragEnter = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    globalDragCounter.current += 1;
    if (globalDragCounter.current === 1) { // Grok Fix: Set true only on initial enter to prevent render loop
      setIsGlobalDragging(true);
    }
  }, []);

  const handleGlobalDragLeave = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    globalDragCounter.current -= 1;
    if (globalDragCounter.current === 0) {
      setIsGlobalDragging(false);
    }
  }, []);

  const handleGlobalDragOver = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleGlobalDrop = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsGlobalDragging(false);
      globalDragCounter.current = 0;

      const files = Array.from(e.dataTransfer.files);
      if (files && files.length > 0) {
        const file = files[0];
        openPostModal({ isPrivate: false, initialFile: file });
      }
    },
    [openPostModal],
  );

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
      onDragEnterCapture={handleGlobalDragEnter}
      onDragLeaveCapture={handleGlobalDragLeave}
      onDragOverCapture={handleGlobalDragOver}
      onDropCapture={handleGlobalDrop}
    >
      {isGlobalDragging && (
        <div className="absolute inset-0 z-overlay bg-[var(--theme-accent-primary)]/90 backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
            <UploadCloud size={64} className="text-white drop-shadow-xl" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-widest drop-shadow-md">
            Deixa Anar
          </h2>
          <p className="text-xl opacity-90 font-bold mt-2">
            per a publicar ràpidament
          </p>
        </div>
      )}

      {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
      {!isMinimal && (
        <div className="w-full relative z-base">
          <Suspense fallback={<NanoLoader message="Preparant la barra..." />}>
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
            <Suspense fallback={<NanoLoader message="Bategant..." />}>
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
                    <Route path="/dossier" element={<DossierSocis />} />
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
                    <Route path="/legal" element={<LegalNotice />} />
                    <Route path="/projecte" element={<ProjectPresentation />} />
                    <Route path="/chrome-145" element={<Chrome145Report />} />
                    <Route
                      path="/hub"
                      element={<HubView />}
                    />
                    <Route path="/financament" element={<Financament />} />
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
                    <NanoLoader message="Carregant accessibilitat..." />
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

      {/* FOOTER CANÒNIC (AVÍS LEGAL, AUTORIA, ETC.) - BLINDATGE v1.0 */}
      <GlobalFooter />

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
            <Suspense fallback={<NanoLoader message="Obrint el Mapa..." />}>
              <ArchitecteView />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AppLayout);
\n```\n\n