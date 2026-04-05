# GESTIÓN DE EXORCISMO Y ARQUITECTURA FINAL (FASE 14)

Estimulado por el debate anterior, nos encontramos en la fase de Ejecución Quirúrgica. 
ChatGPT (como Oracle de la Forma), tienes el permiso y el deber de realizar la auditoría exhaustiva sobre el DOM real. Mistral, verifica la frugalidad. Gemini, consolida los Hooks. Perplexity, asegúrate de que no queden fantasmas de Box-Shadow ni Zombie-Scrolls.

Nuestra misión: Refactorizar **línea por línea** el siguiente código base, aplicando los patrones del Glassmorfismo de Pueblo, y devolviendo la versión 100% blindada de `AppLayout.jsx` e `index.css`.

A continuación, entrego el código fuente literal del Mas Digital para que se le pase el bisturí:

## 1. Código Real Actual de `src/components/AppLayout.jsx`
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
import { useSoftConnectionStatus } from '../hooks/useSoftConnectionStatus';
const DegradedBanner = lazy(() => import("./DegradedBanner"));
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
const AlbumGlobal = lazy(() => import("../pages/GlobalAssetAlbum"));
const SearchDiscover = lazy(() => import("../pages/SearchDiscover"));
const OficiDocumentacio = lazy(() => import("../pages/OficiDocumentacio"));
const NexusFlash = lazy(() => import("../pages/NexusFlash"));
const ProjectPresentation = lazy(() => import("../pages/ProjectPresentation"));
const GenesisViewer = lazy(() => import("../pages/GenesisViewer"));
const Versions = lazy(() => import("../pages/Versions"));
const BuscadorAjudes = lazy(() => import("../pages/BuscadorAjudes"));
const DirectoriComunitat = lazy(() => import("../pages/CommunityDirectory"));
const MapaActius = lazy(() => import('../pages/Map'));
const CalendariMaster = lazy(() => import('../pages/MasterCalendar'));
const Header = lazy(() => import("./Header"));
const HubView = lazy(() => import("../pages/HubView"));
const AccessibilitatUniversal = lazy(() => import("./AccessibilitatUniversal"));

const ArchitecteView = lazy(() => import("./ArchitecteView"));
const ResourceDetail = lazy(() => import("../pages/ResourceDetail"));
const InfografiaGallery = lazy(() => import("./Infoteca/InfografiaGallery"));
const ContextualMenu = lazy(() => import("./ContextualMenu"));
const Notes = lazy(() => import("../pages/Notes"));
const IAIAChatSidebar = lazy(() => import("./IAIAChatSidebar"));
const ProfilePowerMenu = lazy(() => import("./ProfilePowerMenu"));
const Chrome145Report = lazy(() => import("../pages/Chrome145Report"));

const EpubViewer = lazy(() => import("./EpubViewer"));
const MedicationConfirm = lazy(() => import("../pages/MedicationConfirm"));
const VitalSecurity = lazy(() => import("../pages/VitalSecurity"));

const SuspenseFallback = () => {
  const { t } = useTranslation();
  return <NanoLoader message={t('common.loading', 'Carregant...')} />;
};
const FALLBACK_ELEMENT = <SuspenseFallback />;

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
  const connectionStatus = useSoftConnectionStatus();
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
    location.pathname.startsWith("/gestio/xats") ||
    location.pathname.startsWith("/gestio-menu"),
  [location.pathname]);

  // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció forçada de Viewport per a evitar escalat d'escriptori
  React.useEffect(() => {
    // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció forçada de Viewport per a evitar escalat d'escriptori
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
      className="grid grid-rows-[auto_1fr_auto] h-screen support-dvh:h-[100dvh] w-full overflow-hidden font-sans bg-theme-base text-theme-text relative"
      style={{ height: '100dvh' /* Modern browsers will use this, older will fallback to h-screen class */ }}
      onDragEnterCapture={handleGlobalDragEnter}
      onDragLeaveCapture={handleGlobalDragLeave}
      onDragOverCapture={handleGlobalDragOver}
      onDropCapture={handleGlobalDrop}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[var(--z-max)] focus:bg-[var(--bg-panel)] focus:text-theme-text focus:px-4 focus:py-2 rounded-[var(--radius-base)] border border-theme-border shadow-xl font-bold"
      >
        {t('common.skip_navigation', 'Saltar al contingut principal')}
      </a>

      {isGlobalDragging && (
        <div className="absolute inset-0 z-overlay bg-[var(--theme-accent-primary)]/90 backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
            <UploadCloud size={64} className="text-white drop-shadow-xl" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-widest drop-shadow-md">
            {t('common.drop_anar', 'Deixa Anar')}
          </h2>
          <p className="text-xl opacity-90 font-bold mt-2">
            {t('common.drop_publish', 'per a publicar ràpidament')}
          </p>
        </div>
      )}

      {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
      {!isMinimal && (
        <div className="w-full relative z-base bg-[#000000]">
          <Suspense fallback={FALLBACK_ELEMENT}>
            <BlueprintOverlay
              label="HEADER_CANONIC"
              dimensions="MATCH"
              color="orange"
              className="h-[64px] min-h-[64px] max-h-[64px] flex-shrink-0"
            >
              <Header />
            </BlueprintOverlay>
          </Suspense>
        </div>
      )}

      {connectionStatus === "reconnecting" && (
        <div className="absolute top-[64px] left-0 right-0 z-[var(--z-overlay)] px-4 py-3 bg-[#FDFBF7]/95 backdrop-blur-md flex items-center justify-center border-b border-[#0055A4]/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] animate-slide-up">
          <div className="flex items-center gap-3 text-[#0055A4] font-semibold text-[22px]">
            <span>🔵</span>
            <span>Reponiendo antena... segueix escrivint mestre</span>
          </div>
        </div>
      )}

      {/* CONTENIDOR PRINCIPAL (SIDEBAR + ESCENARI) */}
      <div className="grid md:grid-cols-[auto_1fr] overflow-hidden relative min-h-0">
        {/* 0. OVERLAY MÒBIL (Sombra de fondo purificada) */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-overlay)] md:hidden transition-opacity duration-300 animate-in fade-in cursor-pointer"
            onClick={closeDrawer}
            role="button"
            tabIndex={0}
            aria-label="Tancar menú lateral"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') closeDrawer(); }}
          />
        )}

        {!isMinimal && (
          <div
            className={`
              flex-shrink-0 transition-transform duration-300 ease-in-out overflow-hidden
              fixed z-[var(--z-sidebar)] top-0 left-0 h-[100dvh] w-[300px] max-w-[85vw] bg-[#0e0e10] border-r border-[#ffffff14]
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
          id="main-content"
          tabIndex={-1}
          className={`min-w-0 min-h-0 relative bg-theme-base flex flex-col flex-1 ${
            isOverflowHidden
              ? "overflow-hidden"
              : "overflow-y-auto overscroll-contain custom-scrollbar main-viewport"
          }`}
          style={{
            paddingBottom: !isChatDetailMobileView
              ? 'calc(72px + env(safe-area-inset-bottom, 0px))'
              : '0px',
          }}
        >
          <Suspense fallback={null}>
            <ContextualMenu />
          </Suspense>
          <Suspense fallback={null}>
            <DegradedBanner />
          </Suspense>

          <BlueprintOverlay
            label={currentLabel}
            dimensions="MATCH"
            color="emerald"
            className="flex-1 min-h-0 relative z-10 flex flex-col"
          >
            <Suspense fallback={<NanoLoader message={t('common.connecting', 'Connectant...')} />}>
              <ErrorBoundary>
                <div className="flex-1 min-h-0 relative min-w-0 m-0 flex flex-col">
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/chats" replace />}
                    />
                    <Route path="/medication-confirm" element={<MedicationConfirm />} />
                    <Route path="/seguretat" element={<VitalSecurity />} />
                    <Route path="/pobles" element={<Towns />} />
                    <Route path="/pobles/:id" element={<ProfileView />} />
                    <Route path="/versions" element={<Versions />} />
                    <Route path="/mapa" element={<MapaActius />} />
                    <Route path="/calendari" element={<CalendariMaster />} />

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
                    <Route path="/search" element={<SearchDiscover />} />
                    <Route path="/ofici" element={<OficiDocumentacio />} />
                    <Route path="/ofici/:id" element={<OficiDocumentacio />} />
                    <Route
                      path="/buscador-ajudes"
                      element={<BuscadorAjudes />}
                    />
                    <Route path="/nexus" element={<NexusFlash />} />
                    <Route path="/genesis" element={<GenesisViewer />} />
                    <Route path="/directori" element={<DirectoriComunitat />} />
                    <Route path="/hub" element={<HubView />} />
                    <Route path="/tools/trellat" element={<Navigate to="/solatge" replace />} />
                    <Route path="/infoteca" element={<InfografiaGallery />} />
                    <Route path="/arxiu" element={<ArxiuOr />} />
                    <Route path="/arxiu/:id" element={<ResourceDetail />} />
                    <Route path="/fotos/global" element={<AlbumGlobal />} />
                    <Route
                      path="/accessibilitat"
                      element={<AccessibilitatUniversal />}
                    />
                    <Route path="/notes" element={<Notes />} />
                    {/* PÀGINES DE PROJECTE I LEGALITAT */}
                    <Route path="/el-projecte" element={<ProjectPresentation forcedSlug="el-projecte" />} />
                    <Route path="/page/:slug" element={<ProjectPresentation />} />
                    <Route path="/reader" element={<EpubViewer url="/assets/books/el-projecte.epub" title={"Sóc de Poble: El Projecte"} onClose={() => window.history.back()} />} />
                    <Route path="/chrome-145" element={<Chrome145Report />} />

                    {/* Fallback 404 Catch-All Route */}
                    <Route path="*" element={<Navigate to="/mur" replace />} />
                  </Routes>
                </div>
              </ErrorBoundary>
            </Suspense>

          </BlueprintOverlay>
        </main>
      </div>

      {/* Boto Global d'Accessibilitat IAIA (Només si està activat al perfil) */}
      {accessibilityMode && !isAccessibilitatOpen && (
        <button
          onClick={() => setIsAccessibilitatOpen(true)}
          className="fixed bottom-[5.5rem] md:bottom-24 right-4 md:right-8 w-14 h-14 bg-sky-500 text-white rounded-[var(--radius-genesis)] shadow-xl shadow-sky-500/50 flex items-center justify-center z-[var(--z-dropdown)] hover:scale-110 transition-transform cursor-pointer border-2 border-white/20"
          aria-label="Obrir Matriu IAIA d'Accessibilitat"
        >
          <Handshake size={28} />
        </button>
      )}

      {/* 3. ACCESIBILITAT (Extraído del main en v10.34, ahora es inexpugnable) */}
      {isAccessibilitatOpen && (
        <div 
          className="fixed inset-0 z-[var(--z-modal)] glass-overlay bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <Suspense fallback={FALLBACK_ELEMENT}>
            <AccessibilitatUniversal />
          </Suspense>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓ MÒBIL (BATEGAT v11.3) - AMAGADA DINS DEL XAT PER EVITAR COL·LISIÓ AMB TECLAT VIRTUAL */}
      {!isChatDetailMobileView && (
        <MobileBottomNav />
      )}

      {/* IAIA CHAT SIDEBAR (DRETA) - GLOBAL & BATEGAT */}
      <Suspense fallback={<div className="w-[300px] md:w-[320px] h-full" aria-hidden="true" />}>
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
        <div 
          className="fixed inset-0 z-[var(--z-modal)] glass-overlay bg-black/40 backdrop-blur-xl md:pl-[280px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="h-full flex flex-col relative animate-slide-up">
            <Suspense fallback={FALLBACK_ELEMENT}>
              <ArchitecteView />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
```

## 2. Código Real Actual de `src/index.css` (GEM MODERN BASE)
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Noto Sans", ui-sans-serif, system-ui, sans-serif, "Noto Color Emoji", "Noto Emoji";
  --font-mono: "Noto Sans Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace, "Noto Color Emoji", "Noto Emoji";
  --font-serif: "Noto Serif", serif, "Noto Color Emoji", "Noto Emoji";

  --color-primary: var(--sdp-orange);
  --color-secondary: var(--sdp-blue);
  --color-theme-base: var(--bg-app);
  --color-theme-sidebar: var(--bg-sidebar);
  --color-theme-panel: var(--bg-panel);
  --color-theme-text: var(--text-main);
  --color-border-master: var(--border-master);

  --radius-genesis: 28px;
  --radius-tactile: 16px;
  --radius-pill: 100px;

  --spacing-header: 56px;
  --spacing-sidebar: 280px;
  --spacing-unit: 1.5rem;

  /* CMS TYPOGRAPHY TOKENS (Vertical Rhythm & Legibility) */
  /* Optims per lectura llegó de llibre: Line Height base 1.6 */
  --cms-lh-base: 1.6;
  --cms-lh-heading: 1.25;
  --cms-gap-paragraph: 1.6rem;         /* Space AFTER paragraph = 1 line height approx */
  --cms-gap-h2-top: 2.8rem;            /* Space BEFORE H2 */
  --cms-gap-h2-bottom: 0.8rem;         /* Space AFTER H2 */
  --cms-gap-h3-top: 2rem;              /* Space BEFORE H3 */
  --cms-gap-h3-bottom: 0.5rem;         /* Space AFTER H3 */
  --cms-gap-subtitle-h3: 80px;         /* Specific spacing between Subtitle (H2) and next element as requested */

  --z-base: 1;
  --z-nav: 50;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-sidebar: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-max: 999;

  --glass-bg: rgba(28, 28, 30, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(16px);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

@layer base {
  * { margin: 0; padding: 0; box-sizing: border-box; font-style: normal !important; }
  html { scroll-behavior: smooth; }
  body { -webkit-font-smoothing: antialiased; }

  blockquote, q, cite, dfn, var {
    font-family: inherit;
  }

  code, pre, kbd {
    font-family: var(--font-mono);
  }

  :root {
    --bg-main: #0e0e10;
    --bg-app: var(--bg-main);
    --bg-panel: #141417;
    --bg-sidebar: #0e0e10;
    --text-main: #f3f4f6; /* Tailwind gray-100 */
    --text-muted: #9ca3af; /* Tailwind gray-400 */
    --border-master: rgba(255, 255, 255, 0.08);

    /* Tech-Huerta GEM Modern Palette (4 Colors) */
    --sdp-orange: #f97316;
    --sdp-blue: #0984E3;
    --theme-accent-primary: var(--sdp-orange);
    --theme-accent-secondary: var(--sdp-blue);

    /* Motion System Tokens (iOS feel) */
    --motion-quick: 120ms;
    --motion-normal: 220ms;
    --motion-expressive: 360ms;
    --spring-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --ease-apple: cubic-bezier(0.22, 1, 0.36, 1);

    --glass-theme-bg: rgba(20, 20, 23, 0.65);
    --glass-theme-border: rgba(255, 255, 255, 0.08);
    --glass-theme-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);

    /* FullCalendar Dynamic Theme Overrides */
    --fc-page-bg-color: transparent;
    --fc-neutral-bg-color: var(--bg-panel);
    --fc-neutral-text-color: var(--text-muted);
    --fc-border-color: var(--border-master);
    --fc-button-text-color: var(--text-main);
    --fc-button-bg-color: transparent;
    --fc-button-border-color: var(--border-master);
    --fc-button-hover-bg-color: color-mix(in srgb, var(--text-main) 10%, transparent);
    --fc-button-hover-border-color: var(--border-master);
    --fc-button-active-bg-color: color-mix(in srgb, var(--text-main) 20%, transparent);
    --fc-button-active-border-color: var(--border-master);
    --fc-event-bg-color: var(--theme-accent-secondary);
    --fc-event-border-color: var(--theme-accent-secondary);
    --fc-event-text-color: #ffffff;
    --fc-non-business-color: color-mix(in srgb, var(--text-main) 5%, transparent);
    --fc-highlight-color: color-mix(in srgb, var(--text-main) 10%, transparent);
    --fc-today-bg-color: color-mix(in srgb, var(--theme-accent-primary) 15%, transparent);
    --fc-now-indicator-color: var(--theme-accent-primary);
    --fc-daygrid-event-dot-width: 8px;
    --fc-list-event-hover-bg-color: color-mix(in srgb, var(--text-main) 5%, transparent);
  }

  :root.light {
    --bg-main: #FDFBF7;
    --bg-app: var(--bg-main); /* Papel reciclado / Cal blanca */
    --bg-panel: #ffffff;
    --bg-sidebar: #FAFAFA;
    --text-main: #1f2937; /* Tailwind gray-800 */
    --text-muted: #6b7280; /* Tailwind gray-500 */
    --border-master: rgba(0, 0, 0, 0.08);

    /* Tech-Huerta GEM Modern Palette (4 Colors) */
    --sdp-orange: #f97316;
    --sdp-blue: #0984E3;
    --theme-accent-primary: var(--sdp-orange);
    --theme-accent-secondary: var(--sdp-blue);

    --glass-theme-bg: rgba(255, 255, 255, 0.75);
    --glass-theme-border: rgba(0, 0, 0, 0.06);
    --glass-theme-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    @apply h-[100dvh] w-[100dvw] m-0 p-0 overflow-hidden bg-theme-base text-theme-text;
    font-family: var(--font-sans);
    font-stretch: 75%;
    font-size: 1.25rem;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior-y: contain; /* Permite inercia, evita rebote global */
  }

  /* Aísla el scroll principal del layout */
  .main-viewport, .system-scroll-container, .profile-scroll-container {
    overscroll-behavior-y: auto; 
    -webkit-overflow-scrolling: touch; /* Fuerza scroll suave en iOS viejo */
  }

  #root {
    @apply h-[100dvh] w-full m-0 p-0 overflow-hidden flex flex-col;
    position: fixed; /* Antigravity Jitter Fix */
    inset: 0;
  }

  p {
    @apply text-[1.05rem] leading-[1.6] mb-6 text-theme-text;
  }
}

@layer components {
  /* RURAL PLACEHOLDER SKELETON (0% FOUC) */
  .image-placeholder {
    background: linear-gradient(90deg, var(--bg-panel) 25%, color-mix(in srgb, var(--border-master) 30%, transparent) 37%, var(--bg-panel) 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 12px;
  }
  
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* GLASSMORPHISM PROTOCOL */
  .glass-panel {
    background: var(--glass-theme-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-theme-border);
    box-shadow: var(--glass-theme-shadow);
    border-radius: var(--radius-genesis);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  /* GPU Compositing for Animated Blur Overlays */
  .glass-overlay {
    will-change: opacity, backdrop-filter;
    transform: translateZ(0);
    isolation: isolate;
  }

  /* TECH-HUERTA PREMIUM COMPONENTS */
  .glass-rural {
    /* Fondo opaco de reemplazo para evitar render lag costoso en hardware limitado */
    background: var(--bg-panel);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid var(--border-master);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    border-radius: var(--radius-genesis);
    position: relative;
    overflow: hidden;
  }
  
  .glass-rural:active {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.12);
    transform: scale(0.98);
  }
  
  /* Textura de Arcilla Digital (Noise SVG sutil) */
  .glass-rural::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.03; /* 3% noise */
    pointer-events: none;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }

  .btn-tactile {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-tactile);
    transition: box-shadow var(--motion-quick) var(--ease-apple), transform var(--motion-quick) var(--ease-apple), background-color var(--motion-quick) var(--ease-apple);
    outline: none;
    cursor: pointer;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }
  
  .btn-tactile:focus-visible {
    box-shadow: 0 0 0 2px var(--theme-accent-primary);
  }

  /* CMS CORE (Vertical Rhythm & Clean Elements) */
  .app-cms-content {
    background: transparent;
    color: var(--text-main);
    line-height: var(--cms-lh-base);
    text-align: left;
    overflow-x: hidden; /* Mata scroll horizontal fantasma provocado por marked/pre */
    contain: layout style; /* Aísla GPU layers suavemente vs strict 'paint' antiguo */
    will-change: scroll-position; /* Optimización de scroll */
  }
  
  /* Selectors text content */
  .app-cms-content h1 {
    font-size: clamp(1.875rem, 4vw, 2.25rem); /* text-3xl to text-4xl */
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.025em;
    text-align: left;
    margin-bottom: var(--cms-gap-paragraph);
    line-height: var(--cms-lh-heading);
  }
  
  .app-cms-content h2 {
    font-size: clamp(1.25rem, 3vw, 1.5rem); /* text-xl to text-2xl */
    font-weight: 700;
    color: var(--theme-accent-secondary);
    text-transform: uppercase;
    margin-top: var(--cms-gap-h2-top);
    margin-bottom: var(--cms-gap-h2-bottom);
    line-height: var(--cms-lh-heading);
  }
  
  .app-cms-content h3 {
    font-size: 1.125rem; /* text-lg */
    font-weight: 700;
    margin-top: var(--cms-gap-h3-top);
    margin-bottom: var(--cms-gap-h3-bottom);
    line-height: var(--cms-lh-heading);
  }

  /* Spacing fix for specifically H3 coming immediately after a section start / subtitle */
  .app-cms-content > h3:first-child,
  .app-cms-content > *:first-child {
    /* Si és el primer element després del subtítol general (que ja compta amb marge),
       apliquem l'espai rígid demanat: "unos 80 pixeles" del subtítol (h2 extern) al h3 (intern CMS).
       Com .app-cms-content té el padding pb-10 i px-10 (hi traiem pt-10!), usarem 80px com margin-top d'aquest primer fill
    */
    margin-top: var(--cms-gap-subtitle-h3);
  }

  .app-cms-content h4 {
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: var(--spacing-unit);
    margin-bottom: 0.5rem;
  }
  
  .app-cms-content h5 {
    font-size: 0.875rem; /* text-sm */
    font-weight: 600;
    color: var(--text-muted);
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .app-cms-content h6 {
    font-size: 0.75rem; /* text-xs, accessible minimum limit */
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .app-cms-content p {
    font-size: clamp(1.05rem, 1.8vw, 1.15rem); 
    line-height: var(--cms-lh-base);
    margin-bottom: var(--cms-gap-paragraph);
  }

  /* Llistes */
  .app-cms-content :where(ul, ol) {
    font-size: clamp(1.05rem, 1.8vw, 1.15rem);
    margin-bottom: var(--cms-gap-paragraph);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  /* Llistes numèriques netes (el disseny tàctil base no val ací per lectura llarga,
     només les apliquem a les de viñetas, mantindrem estil per totes per defecte per ara si no es concreta,
     però la instrucció deia només estils clean) */
  .app-cms-content ul, .app-cms-content ol {
    padding-left: 1.5rem;
    display: block; /* revertims a block per la legibilitat purista */
  }
  
  /* Llistes anidades: llevem l'enorme gap del margin-bottom perquè no trenqui l'harmonia visual entre viñetas */
  .app-cms-content li :where(ul, ol) {
    margin-bottom: 0;
    margin-top: 0.25rem;
  }

  .app-cms-content ol {
    list-style: decimal;
  }
  .app-cms-content ul {
    list-style: disc;
  }

  .app-cms-content li {
    /* Reset táctil antic: en llibres V12 CMS només apliquem un marge senzill excepte si són llistats interactius, però seguim amb el padding lleuger per ara. */
    margin-bottom: 0.25rem;
  }
  .app-cms-content li > p {
    margin: 0;
  }

  /* Blockquotes i Media */
  .app-cms-content blockquote {
    border-left: 4px solid var(--theme-accent-primary);
    padding: 1rem 1rem 1rem 1.5rem;
    margin: 2rem 0;
    background-color: var(--bg-panel);
    border-radius: 0 16px 16px 0;
  }
  .app-cms-content blockquote p {
    font-size: clamp(1.25rem, 2vw, 1.5rem); /* xl to 2xl */
    font-style: italic;
    font-weight: 500;
    color: var(--text-main);
    margin-bottom: 0;
  }

  .app-cms-content img {
    border-radius: 16px;
    border: 1px solid var(--border-master);
    margin: 1.5rem 0;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  
  .app-cms-content a {
    color: var(--theme-accent-primary);
    text-decoration: underline;
  }
  .app-cms-content a:hover {
    color: var(--theme-accent-secondary);
  }
  
  .app-cms-content code {
    background-color: var(--bg-panel);
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875em;
    color: var(--theme-accent-secondary);
    border: 1px solid var(--border-master);
  }
  
  .app-cms-content pre code {
    background-color: transparent;
    padding: 0;
    border: none;
    color: inherit;
    font-size: inherit;
  }
  
  /* Taules (Tables) */
  .app-cms-content table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--cms-gap-paragraph) 0;
    text-align: left; /* Sobreescriu el text-align: justify del contenidor principal */
    font-size: clamp(1rem, 1.8vw, 1.125rem); /* Mida més compacta per cabre millor */
    border: 1px solid var(--border-master);
    border-radius: 12px; /* Radius global */
    overflow: hidden; /* Per mantenir el radius als cantons */
    display: block; /* Habilita l'scroll horitzontal en mòbils */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .app-cms-content th,
  .app-cms-content td {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-master);
    vertical-align: top; /* Millor lectura si el text és llarg */
  }
  
  .app-cms-content th {
    font-weight: 700;
    color: var(--text-main);
    background-color: var(--bg-surface);
    text-transform: uppercase;
    font-size: 0.85em;
    letter-spacing: 0.05em;
  }
  
  .app-cms-content tbody tr {
    transition: background-color var(--motion-quick) var(--ease-apple);
  }
  
  .app-cms-content tbody tr:last-child td {
    border-bottom: none; /* Elimina la línia de l'última fila per neteja visual */
  }
  
  .app-cms-content tbody tr:hover {
    background-color: color-mix(in srgb, var(--bg-surface) 50%, transparent);
  }
  
  .app-cms-content tbody td {
    color: var(--text-muted); /* Dades lleugerament més clares per jerarquia */
  }
  
  .app-cms-content tbody td:first-child {
    font-weight: 600; /* La primera columna fa d'índex visual (Color, Nom, etc.) */
    color: var(--text-main);
  }

  .app-cms-content ::selection {
    background-color: var(--theme-accent-primary);
    color: white;
  }

  /* LOW END FALLBACKS */
  body.low-end-device {
    --glass-blur: none;
    --glass-shadow: none;
    --glass-theme-bg: var(--bg-panel);
    --glass-theme-border: var(--border-master);
  }
  body.low-end-device .glass-panel,
  body.low-end-device * {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  /* ATOMIC MACRO-CONTAINERS */
  .atomic-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .atomic-grid {
    display: grid;
    gap: var(--spacing-unit, 1.5rem);
    width: 100%;
  }

  /* CODEX ATOM SYSTEM */
  .atom-root {
    @apply relative min-h-0 min-w-0 w-full;
    contain: layout paint style;
    isolation: isolate;
  }
  .atom-fill {
    @apply h-full w-full min-h-0 min-w-0;
  }
  .atom-stack {
    @apply h-full w-full min-h-0 min-w-0 flex flex-col;
    gap: clamp(0.75rem, 1.2vw, 1rem);
  }
  .atom-row {
    @apply flex min-w-0 items-center;
    gap: clamp(0.5rem, 0.8vw, 0.75rem);
  }
  .atom-card {
    @apply h-full w-full min-h-0 min-w-0 flex flex-col rounded-genesis border border-border-master bg-theme-panel p-4;
  }
  
  /* 🎨 DOLA UX/UI MICRO-INTERACTIONS (V14 AUDIT) */
  /* This block globally patches the interaction friction detected by Dola across the 40+ components */
  .create-card, .action-btn, .layer-btn, .filter-toggle-btn, .setting-row, .primary-action-btn, 
  .secondary-action-btn, .action-btn-mini, .persona-list-item, .vision-mode-card, .town-card {
    transition: transform var(--motion-quick) var(--spring-bounce), box-shadow var(--motion-quick) ease, background-color var(--motion-quick) ease;
  }

  .create-card:active, .action-btn:active, .layer-btn:active, .filter-toggle-btn:active,
  .primary-action-btn:active, .secondary-action-btn:active, .action-btn-mini:active,
  .persona-list-item:active, .vision-mode-card:active, .town-card:active {
    transform: scale(0.96);
  }

  .create-card:hover, .town-card:hover, .vision-mode-card:hover, .persona-list-item:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.3);
  }

  .managed-entity-item, .module-card, .log-entry, .universal-card {
    transition: box-shadow var(--motion-quick) ease, transform var(--motion-quick) ease;
  }
  
  .managed-entity-item:hover, .module-card:hover, .universal-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-theme-shadow);
  }

  .managed-entity-item:active, .universal-card:active {
    transform: scale(0.98);
  }
}

@layer utilities {
  /* Aislamiento de renderizado para secciones fuera de viewport (Tanda 5) */
  .app-cms-content {
    content-visibility: auto;
    contain-intrinsic-size: auto 500px;
    contain: layout style paint;
  }
  .app-cms-content > * {
    content-visibility: auto;
  }
  @media print {
    .app-cms-content, .app-cms-content > * {
      content-visibility: visible !important;
    }
  }

  /* GHOST BORDERS */
  .border-ghost-r { box-shadow: inset -1px 0 0 0 var(--border-master); }
  .border-ghost-b { box-shadow: inset 0 -1px 0 0 var(--border-master); }
  .border-ghost-t { box-shadow: inset 0 1px 0 0 var(--border-master); }

  /* SCROLLBAR V4 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklab, currentColor 20%, transparent) transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, currentColor 18%, transparent);
    border-radius: 999px;
    background-clip: padding-box;
    border: 2px solid transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: color-mix(in oklab, currentColor 30%, transparent);
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* STABLE SCROLL CODEX */
  .stable-scroll {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable both-edges;
    overscroll-behavior: contain;
    transform: translateZ(0); 
  }
  @media (pointer: fine) {
    .stable-scroll { scrollbar-gutter: auto; } /* Let's keep Codex gutter but avoid floating mouse offset in fine pointer if needed, or stick to both-edges? Standard is both-edges from codex */
  }

  /* Z-INDEX TOKENS */
  .z-token-base { z-index: var(--z-base); }
  .z-token-sticky { z-index: var(--z-sticky); }
  .z-token-overlay { z-index: var(--z-overlay); }
  .z-token-sidebar { z-index: var(--z-sidebar); }
  .z-token-modal { z-index: var(--z-modal); }

  /* CONTAINMENT */
  .contain-strict { contain: layout style paint; }
  .contain-layout { contain: layout style; }
  .gpu-accelerate {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }
  .content-visibility-auto {
    content-visibility: auto;
    contain-intrinsic-size: 88px;
  }
  .paint-contain {
    contain: paint;
  }

  /* MODAL & SIDEBAR RENDER ISOLATION */
  .modal-root, .portal-overlay, .iaia-chat-sidebar {
    isolation: isolate;
  }

  /* VARIOUS */
  .flex-safe {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex: 1;
  }
  .text-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .safe-area-top { padding-top: env(safe-area-inset-top, 0px); }
  .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }

  .app-cms-content h2, .app-cms-content h3 {
    scroll-margin-top: calc(var(--spacing-header) + 120px);
  }
  @media (min-width: 640px) {
    .app-cms-content h2, .app-cms-content h3 {
      scroll-margin-top: calc(var(--spacing-header) + 80px);
    }
  }
}

/* HOSTILE CONTENT */
.app-content-rich {
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* ANIMATIONS */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-in.fade-in { animation: fade-in 0.3s ease-out forwards; }
.animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* HIGH CONTRAST ACCESSIBILITY MODES */
@media screen and (prefers-contrast: more) {
  :root {
    --theme-text: #000000;
    --theme-text-secondary: #000000;
    --theme-text-muted: #111111;
    --theme-bg: #FFFFFF;
    --theme-bg-panel: #FFFFFF;
    --theme-border: #000000;
    --theme-accent-primary: #000000;
    --theme-danger: #D32F2F;
  }
  
  .dark-mode, [data-theme="dark"] {
    --theme-text: #FFFFFF;
    --theme-text-secondary: #FFFFFF;
    --theme-text-muted: #EEEEEE;
    --theme-bg: #000000;
    --theme-bg-panel: #000000;
    --theme-border: #FFFFFF;
    --theme-accent-primary: #FFFFFF;
  }
}

@media screen and (forced-colors: active) {
  button, a, input, select, textarea, .btn-primary, .btn-secondary {
    border: 1px solid CanvasText !important;
  }
}
```

### INSTRUCCIONES DE EJECUCIÓN (EL QUIRÓFANO):
Al Alto Consejo: Proceded a entregar las versiones refactorizadas, limpias y libres de dudas técnicas, como se acordó en el acta.
