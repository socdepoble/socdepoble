> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_AUDITORIES/AUDITORIA_FINAL_EXTRA_RAYOS_X.md`

# 🚨 PROMPT DE AUDITORÍA FINAL: RAYOS X DESTRUCTIVO 🚨

**Para el Modelo Auditor (DeepSeek/Qwen/O1):**

Tengo este código base que acaba de ser refactorizado para separar radicalmente el ecosistema social (`AppLayout`) del ecosistema de sistema/administración (`SystemRoutes` + `SystemPageLayout`). Además, hemos extraído la virtualización masiva y garantizado "Salas Blancas" sin "scroll hijacking".

El objetivo de esta refactorización era eliminar los problemas de layout y z-index. Te adjunto TODO el código de las capas estructurales y los contenedores clave (incluyendo las cartas, el feed, el grid...) para que lo audites todo, hasta la última línea.

Te exijo una **AUDITORÍA EXTRA FUERTE Y DESTRUCTIVA** (con bombas y con cariño). Busca CUALQUIER fallo, por minúsculo que sea, que pueda causar:
1. Conflictos de colapso de viewport en dispositivos móviles (iOS Safari 100dvh vs 100vh).
2. Temblores de renderizado (Re-renders en cascada).
3. Fugas de memoria vinculadas a Events Listeners o ResizeObservers no cerrados.
4. Código obsoleto o estilos antiguos que ya no aplican y se contradicen con la nueva "Sala Blanca".
5. Anomalías visuales al pasar de layout Grid a List.

A continuación, tienes todo el código susceptible que forma este pilar de la UI. Despedázalo y dime qué defectos quedan para poder limpiarlo.

---
## 📦 CÓDIGO CRÍTICO (V13.0 - ARCHIVO COMPLETO)

### Archivo: `App.jsx`

```jsx
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
import { useLowEndDevice } from './hooks/useLowEndDevice';
import { useTabReconciliation } from './hooks/useTabReconciliation';
import ReloadPrompt from './components/ReloadPrompt';
import { useBlindatgeOPFS } from './hooks/useBlindatgeOPFS';
import { useLocation } from 'react-router-dom';
import SystemRoutes from './components/SystemRoutes';

const LayoutBoundary = () => {
    const location = useLocation();
    const isSystemRoute = 
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/solatge') ||
        location.pathname.startsWith('/hub') ||
        location.pathname.startsWith('/gestio-menu') ||
        location.pathname.startsWith('/gestio/categories') ||
        location.pathname.startsWith('/gestio/xats') ||
        location.pathname.startsWith('/utilitats') ||
        location.pathname.startsWith('/visio') ||
        location.pathname.startsWith('/tools/trellat');

    if (isSystemRoute) {
        return <SystemRoutes />;
    }

    return (
        <>
            <AppLayout />
            <GlobalModals />
        </>
    );
};

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // [BÚNKER]: Persistència i Control de Service Worker
    useBlindatgeOPFS();

    // Sanea "Amnesia BFCache"
    useTabReconciliation();

    // [MONITORING AND CLEANUP] Inicialitzar error tracking y purga fantasma
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

        // Purificación final de imatges fantasma al Mestre
        import('./services/syncService')
            .then(({ syncService }) => {
                if (!isMounted) return; // [OMEGA-FIX: Guardia contra Zombie Effect]
                const report = syncService.purgeGhostMediaCache({ dryRun: false });
                logger.debug('[App] Purga fantasma completada en el arranque:', report);
            })
            .catch(e => {
                if (isMounted) logger.error('[App] Error purging ghost media:', e); // [OMEGA-FIX: Catch explícito]
            });

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

    const isLowEnd = useLowEndDevice();

    useEffect(() => {
        if (isLowEnd) {
            document.body.classList.add('low-end-device');
        } else {
            document.body.classList.remove('low-end-device');
        }
    }, [isLowEnd]);

    return (
        <>
            <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
                <OfflineGate>
                    <LocalFirstGate>
                        <AuthGate>
                            <ReloadPrompt />
                            <LayoutBoundary />
                        </AuthGate>
                    </LocalFirstGate>
                </OfflineGate>
            </ErrorBoundary>
            {/* [OMEGA-FIX: Fuera del ErrorBoundary con atributos y roles explícitos completos] */}
            <div
                id="aria-live-region"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />
        </>
    );
};

export default App;

```

### Archivo: `components/AppLayout.jsx`

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
      className="grid grid-rows-[auto_1fr_auto] h-screen support-dvh:h-[100dvh] w-full overflow-hidden font-sans bg-theme-base text-theme-text relative"
      style={{ height: '100dvh' /* Modern browsers will use this, older will fallback to h-screen class */ }}
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

      {/* CONTENIDOR PRINCIPAL (SIDEBAR + ESCENARI) */}
      <div className="grid md:grid-cols-[auto_1fr] overflow-hidden relative min-h-0">
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
          className={`min-w-0 min-h-0 relative bg-theme-base flex flex-col h-full ${
            isOverflowHidden
              ? "overflow-hidden"
              : "overflow-y-auto overscroll-contain custom-scrollbar main-viewport"
          }`}
        >
          <Suspense fallback={null}>
            <ContextualMenu />
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
                    <Route
                      path="/buscador-ajudes"
                      element={<BuscadorAjudes />}
                    />
                    <Route path="/nexus" element={<NexusFlash />} />
                    <Route path="/genesis" element={<GenesisViewer />} />
                    <Route path="/directori" element={<DirectoriComunitat />} />
                    <Route path="/tools/trellat" element={<Navigate to="/solatge" replace />} />
                    <Route path="/infoteca" element={<InfografiaGallery />} />
                    <Route path="/arxiu" element={<ArxiuOr />} />
                    <Route path="/arxiu/:id" element={<ResourceDetail />} />
                    <Route path="/calendari" element={<CalendariMaster />} />
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

            {/* [ENCAPSULAMENT v10.33.1] Accessibilitat i Onboarding DINS del main */}
            {isAccessibilitatOpen && (
              <div className="absolute inset-0 z-[var(--z-overlay)] glass-overlay bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                <Suspense
                  fallback={FALLBACK_ELEMENT}
                >
                  <AccessibilitatUniversal />
                </Suspense>
              </div>
            )}

            {/* Boto Global d'Accessibilitat IAIA (Només si està activat al perfil) */}
            {accessibilityMode && !isAccessibilitatOpen && (
              <button
                onClick={() => setIsAccessibilitatOpen(true)}
                className="absolute bottom-[5.5rem] md:bottom-24 right-4 md:right-8 w-14 h-14 bg-sky-500 text-white rounded-[var(--radius-genesis)] shadow-xl shadow-sky-500/50 flex items-center justify-center z-[var(--z-dropdown)] hover:scale-110 transition-transform cursor-pointer border-2 border-white/20"
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
        <div className="relative z-[var(--z-nav)] md:hidden bg-black">
          <MobileBottomNav />
        </div>
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
      <div 
        className="fixed inset-0 z-overlay glass-overlay bg-black/40 backdrop-blur-xl md:pl-[280px]"
        style={{
          visibility: architectMode ? 'visible' : 'hidden',
          pointerEvents: architectMode ? 'auto' : 'none',
        }}
        aria-hidden={!architectMode}
        inert={!architectMode ? true : undefined}
      >
        <div className="h-full flex flex-col relative animate-slide-up">
          <Suspense fallback={FALLBACK_ELEMENT}>
            <ArchitecteView />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AppLayout);

```

### Archivo: `components/SystemPageLayout.jsx`

```jsx
import React from 'react';

/**
 * Plantilla Base del Sistema (V13.0)
 * Unifica la jerarquía de DOM para que las páginas de la aplicación
 * se comporten de forma idéntica, eliminando divs "fantasma" y 
 * asegurando un scroll nativo predecible sin bloqueos de layout.
 */
const SYSTEM_CHROME_HEIGHT = '64px'; // 64px context header

const SystemPageLayout = ({ 
  header, 
  children, 
  footer, 
  actionBar, 
  className = '', 
  mainClassName = '',
  containerClassName = "w-full max-w-[1600px] mx-auto p-4 md:p-8"
}) => {
  return (
    <div 
      className={`flex flex-col w-full bg-theme-bg isolate ${className}`}
      style={{ '--system-chrome-h': SYSTEM_CHROME_HEIGHT }}
    >
      {header && (
        <header className="flex-none w-full sticky top-0 z-[9999] shadow-md bg-theme-base border-b border-border-master flex flex-col relative isolate">
          {header}
        </header>
      )}

      {/* MAIN CONTENT: Deixa que el scroll el gestione l'AppLayout pare */}
      <main 
          className={`flex-1 w-full relative min-w-0 pt-2 pb-6 ${mainClassName}`}
      >
         {containerClassName ? (
             <div className={containerClassName}>
                {children}
             </div>
         ) : children}
      </main>

      {/* ACTION BAR INFERIOR: En bloc al final, es mou amb l'scroll normalment pacificant problemes de PWA */}
      {actionBar && (
        <div 
          className="w-full z-[50] shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] bg-theme-base border-t border-[rgba(255,255,255,0.05)] transform translate-z-0"
        >
            {actionBar}
        </div>
      )}

      {footer && (
        <footer className="flex-none w-full shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-[55] bg-theme-bg/95 backdrop-blur-xl">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default SystemPageLayout;

```

### Archivo: `components/SystemRoutes.jsx`

```jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SystemLayout from './SystemLayout';
import NanoLoader from './NanoLoader';
import { useAuth } from '../context/AuthContext';

const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const SolatgeConsole = lazy(() => import('../pages/SolatgeConsole'));
const HubView = lazy(() => import('../pages/HubView'));
const MenuManagementView = lazy(() => import('../pages/MenuManagementView'));
const CategoryManager = lazy(() => import('./CategoryManager'));
const ChatManager = lazy(() => import('../pages/ChatManager'));
const Utilitats = lazy(() => import('../pages/Utilitats'));
const VisionView = lazy(() => import('../pages/VisionView'));

const ProtectedSystemRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <NanoLoader />;
  if (!user || user.isAnonymous) return <Navigate to="/registre" state={{ from: location }} replace />;
  return children;
};

const SystemRoutes = () => {
    return (
        <SystemLayout>
            <Suspense fallback={<NanoLoader />}>
                <Routes>
                    <Route path="/admin" element={<ProtectedSystemRoute><AdminPanel /></ProtectedSystemRoute>} />
                    <Route path="/solatge" element={<ProtectedSystemRoute><SolatgeConsole /></ProtectedSystemRoute>} />
                    <Route path="/hub" element={<HubView />} />
                    <Route path="/gestio-menu" element={<ProtectedSystemRoute><MenuManagementView /></ProtectedSystemRoute>} />
                    <Route path="/gestio/categories" element={<ProtectedSystemRoute><CategoryManager /></ProtectedSystemRoute>} />
                    <Route path="/gestio/xats/*" element={<ChatManager />} />
                    <Route path="/utilitats" element={<ProtectedSystemRoute><Utilitats /></ProtectedSystemRoute>} />
                    <Route path="/visio" element={<VisionView />} />
                </Routes>
            </Suspense>
        </SystemLayout>
    );
};

export default SystemRoutes;

```

### Archivo: `components/ContextualHeader.jsx`

```jsx
import React, { forwardRef } from 'react';
import { Search, LayoutGrid, List, Square, X } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import './ContextualHeader.css';

const ContextualHeader = forwardRef(({ searchTerm, onSearchChange, viewMode, onViewModeChange, placeholder = "Cerca...", extraActions = null, backButton = null }, ref) => {
    const { hapticService } = useDesign();

    const handleSearchClear = () => {
        onSearchChange('');
        if (hapticService) hapticService.trigger();
    };

    return (
        <div className="relative z-10 bg-[#F97316] dark:bg-[#4F46E5] w-full h-[64px] min-h-[64px] max-h-[64px] flex items-center justify-between px-3 transition-colors duration-500 shadow-md">
            
            {/* BACK BUTTON */}
            {backButton && (
                <div className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center">
                    {backButton}
                </div>
            )}

            {/* SEARCH BAR (TECH-HUERTA V12 CANÒNICA) */}
            <div className="flex items-center flex-1 h-[36px] bg-white rounded-[24px] overflow-hidden focus-within:ring-2 focus-within:ring-[#169CF9] transition-all group">
                <div className="flex items-center justify-center pl-4 pr-2 h-full">
                    <Search
                        size={18}
                        strokeWidth={3}
                        className="text-gray-400 group-focus-within:text-[#F97316] dark:group-focus-within:text-[#4F46E5] transition-colors"
                    />
                </div>
                <input
                    ref={ref}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder.toUpperCase()}
                    className="font-sans flex-1 w-full h-full bg-transparent text-gray-900 pr-2 py-0 m-0 text-[14px] leading-none font-bold outline-none placeholder:text-gray-800 placeholder:font-bold"
                />
                
                {/* EXTRA ACTIONS */}
                {extraActions && (
                    <div className="flex items-center pr-2 gap-2 shrink-0">
                        {extraActions}
                    </div>
                )}

                {/* CLEAR SEARCH BUTTON */}
                {searchTerm && (
                    <button 
                        onClick={handleSearchClear} 
                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-[#F97316] transition-colors shrink-0"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* VIEW MODE SWITCH */}
            {onViewModeChange && (
            <div className="hidden sm:flex items-center bg-black/20 dark:bg-white/10 p-1 rounded-full gap-1 ml-3 shrink-0">
                <button
                    onClick={() => { onViewModeChange('single'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'single' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Completa (1 Columna)"
                >
                    <Square size={16} strokeWidth={viewMode === 'single' ? 3 : 2} />
                </button>
                <button
                    onClick={() => { 
                        onViewModeChange('grid'); 
                        if (hapticService) hapticService.trigger(); 
                    }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'grid' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Quadrícula"
                >
                    <LayoutGrid size={16} strokeWidth={viewMode === 'grid' ? 3 : 2} />
                </button>
                <button
                    onClick={() => { onViewModeChange('list'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'list' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Llistat Compacte"
                >
                    <List size={16} strokeWidth={viewMode === 'list' ? 3 : 2} />
                </button>
            </div>
            )}
        </div>
    );
});

export default ContextualHeader;

```

### Archivo: `pages/Map.jsx`

```jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, MapPin, Navigation, Layers, Plus, Store, Landmark, Ticket, Activity, Globe, MessageCircle, Share2 } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import BlueprintOverlay from '../components/BlueprintOverlay';
import ContextualHeader from '../components/ContextualHeader';
import TranslationModal from '../components/TranslationModal';
import Feed from '../components/Feed';
import { useUnifiedFeedData } from '../hooks/useUnifiedFeedData';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { useViewMode } from '../hooks/useViewMode';
import SystemPageLayout from '../components/SystemPageLayout';
import SystemActionBar from '../components/SystemActionBar';
import './Map.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const TownPin = ({ colorClass, label }) => (
    <div className="flex flex-row items-center animate-bounce-slow hover:scale-110 transition-transform cursor-pointer relative -top-[40px] -left-[20px] pointer-events-auto w-max">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]`}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="currentColor"/></svg>
        <span className="bg-theme-panel text-theme-text text-base lg:text-lg font-black tracking-wide px-4 py-2 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] ml-1 border-none whitespace-nowrap">{label}</span>
    </div>
);

const PostPin = ({ imageUrl }) => (
    <div className="w-12 h-12 rounded-[20px] border-none shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden bg-theme-panel hover:scale-125 transition-transform cursor-pointer relative z-40 flex items-center justify-center pointer-events-auto ring-1 ring-[#F97316]/30">
        {imageUrl ? (
            <img 
                src={imageUrl} 
                className="w-full h-full object-cover bg-theme-base text-[10px]" 
                alt="Pin" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/brain/generations/nano_llibre_memoria.png'; }}
            />
        ) : (
            <div className="w-full h-full bg-[#F97316] flex items-center justify-center">
                <MapPin className="text-white w-5 h-5" />
            </div>
        )}
    </div>
);

const InteractiveControls = ({ isPlacingPost, setIsPlacingPost }) => {
    const map = useMap();
    
    const handleLocation = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!map) return;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    map.panTo(pos);
                    map.setZoom(15);
                },
                () => alert("No hem pogut trobar la teua ubicació. Comprova els permisos del navegador.")
            );
        } else {
            alert("El teu navegador no suporta geolocalització.");
        }
    };

    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[999]">
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlacingPost(!isPlacingPost); }}
                className={`flex items-center justify-center w-14 h-14 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-transform active:scale-95 ${isPlacingPost ? 'bg-[#F97316] text-white' : 'bg-theme-panel text-theme-text/90 hover:brightness-110'}`}
                title="Geolocalitzar un nou post"
            >
                <Plus className="w-7 h-7" />
            </button>
            <button 
                onClick={handleLocation}
                className="flex items-center justify-center w-14 h-14 bg-theme-panel text-theme-text/90 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:brightness-110 transition-transform active:scale-95"
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
    const [mapSearch, setMapSearch] = useState('');
    const { viewMode, setViewMode } = useViewMode('map_view_mode', 'grid');
    const [isPlacingPost, setIsPlacingPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);

    const { posts: unifiedPosts, loading } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

    const activeMarkers = React.useMemo(() => {
        return unifiedPosts.filter(p => p.lat && p.lng);
    }, [unifiedPosts]);

    const handleMapClick = (e) => {
        if (isPlacingPost && e.detail.latLng) {
            alert(`Has seleccionat les coordenades: Lat ${e.detail.latLng.lat.toFixed(4)}, Lng ${e.detail.latLng.lng.toFixed(4)}\n(Açò obrirà el formulari de nou post prompte)`);
            setIsPlacingPost(false);
        } else {
            setSelectedPost(null);
        }
    };

    // DeepSeek R1 Optimization: Memoize the actionBar to prevent O(n) diffing down the React tree on every Map re-render
    const systemActionBar = useMemo(() => <SystemActionBar />, []);

    return (
        <SystemPageLayout
            className="map-page-container"
            containerClassName=""
            header={
                <ContextualHeader
                    searchTerm={mapSearch}
                    onSearchChange={setMapSearch}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholder="Cerca al mapa..."
                />
            }
            actionBar={systemActionBar}
        >
            <TranslationModal 
                isOpen={isTranslationOpen} 
                onClose={() => setIsTranslationOpen(false)} 
                config={{ postId: 'mapa', title: 'Radar Sóc de Poble' }} 
            />

            <div className="map-content-area w-full max-w-[1600px] mx-auto p-0 md:p-8">
                <div className={`relative w-full h-[60vh] min-h-[500px] max-h-[850px] md:rounded-[40px] overflow-hidden bg-theme-panel border-none group shadow-2xl`}>
                    {blueprintMode && <BlueprintOverlay label="MAP_VIEW" info="Interactive Placeholder" color="green" />}
                    
                    {/* Native Google Maps Engine */}
                    <div className="absolute inset-0 z-0 map-container-custom">
                        {GOOGLE_MAPS_API_KEY ? (
                            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                                <GoogleMap
                                    defaultCenter={{ lat: 38.6042, lng: -0.4266 }}
                                    defaultZoom={12}
                                    mapId="DEMO_MAP_ID"
                                    disableDefaultUI={true}
                                    gestureHandling={'greedy'}
                                    onClick={handleMapClick}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    {/* Main Markers */}
                                    <AdvancedMarker position={{ lat: 38.6042, lng: -0.4266 }} onClick={() => navigate('/pobles/gent-de-la-torre')}><TownPin colorClass="text-orange-500" label="La Torre de les Maçanes" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6781, lng: -0.3582 }} onClick={() => navigate('/pobles/gent-de-penaguila')}><TownPin colorClass="text-indigo-500" label="Penàguila" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6331, lng: -0.3983 }} onClick={() => navigate('/pobles/gent-de-benifallim')}><TownPin colorClass="text-emerald-500" label="Benifallim" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6083, lng: -0.2721 }} onClick={() => navigate('/pobles/gent-de-sella')}><TownPin colorClass="text-blue-400" label="Sella" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5630, lng: -0.2618 }} onClick={() => navigate('/pobles/gent-de-orxeta')}><TownPin colorClass="text-yellow-500" label="Orxeta" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5878, lng: -0.3114 }} onClick={() => navigate('/pobles/gent-de-relleu')}><TownPin colorClass="text-red-500" label="Relleu" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6811, lng: -0.3314 }} onClick={() => navigate('/pobles/gent-de-alcoleja')}><TownPin colorClass="text-green-500" label="Alcoleja" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5398, lng: -0.5085 }} onClick={() => navigate('/pobles/gent-de-xixona')}><TownPin colorClass="text-amber-600" label="Xixona" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5306, lng: -0.5761 }} onClick={() => navigate('/pobles/gent-de-tibi')}><TownPin colorClass="text-cyan-500" label="Tibi" /></AdvancedMarker>

                                    {/* Dynamic Post Markers */}
                                    {activeMarkers.map((post, index) => {
                                        const imgUrl = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.image);
                                        const lat = parseFloat(post.lat);
                                        const lng = parseFloat(post.lng);
                                        
                                        if (isNaN(lat) || isNaN(lng)) return null;

                                        return (
                                            <AdvancedMarker 
                                                key={`post-${post.id || post.uuid || index}`}
                                                position={{ lat, lng }}
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                <PostPin imageUrl={imgUrl} />
                                            </AdvancedMarker>
                                        );
                                    })}

                                    {/* InfoWindow for selected post */}
                                    {selectedPost && selectedPost.lat && selectedPost.lng && (
                                        <InfoWindow
                                            position={{ lat: parseFloat(selectedPost.lat), lng: parseFloat(selectedPost.lng) }}
                                            onCloseClick={() => setSelectedPost(null)}
                                        >
                                             <div 
                                                 className="text-center min-w-[140px] p-3 cursor-pointer bg-theme-panel rounded-[20px] transition-transform active:scale-95 shadow-xl border border-border-master" 
                                                 onClick={() => navigate(selectedPost.type === 'mercat' ? `/mercat/${selectedPost.id || selectedPost.uuid}` : `/post/${selectedPost.id || selectedPost.uuid}`)}
                                             >
                                                 <h4 className="text-base font-black block text-theme-text line-clamp-2 leading-tight m-0 tracking-wide">
                                                     {selectedPost.title || selectedPost.content?.substring(0, 30) + '...'}
                                                 </h4>
                                                 <span className="text-[11px] text-[#F97316] mt-2 block font-bold uppercase tracking-wider">PEL {selectedPost.author}</span>
                                             </div>
                                        </InfoWindow>
                                    )}

                                    <InteractiveControls isPlacingPost={isPlacingPost} setIsPlacingPost={setIsPlacingPost} />
                                </GoogleMap>
                            </APIProvider>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-theme-panel p-8 text-center decoration-none relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]"></div>
                                <MapIcon className="w-16 h-16 mb-6 text-[#F97316] drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10" />
                                <h3 className="text-3xl font-black text-theme-text mb-3 tracking-tight z-10">Radar Desconnectat</h3>
                                <p className="max-w-md text-theme-text/60 text-sm leading-relaxed mb-8 z-10 font-medium">
                                    Per activar l'experiència immersiva de la cartografia V12 de Sóc de Poble, es requereix una <strong className="text-theme-text">API Key de Google Maps</strong>.
                                </p>
                                <div className="bg-theme-base p-5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-border-master w-full max-w-sm z-10 group transition-all">
                                    <p className="text-[11px] text-theme-text/50 font-mono text-left mb-2 uppercase font-bold tracking-widest">.env.local</p>
                                    <code className="block w-full text-left text-[#F97316] bg-theme-panel p-3 rounded-[16px] text-sm overflow-x-auto whitespace-nowrap shadow-inner font-mono font-medium">
                                        VITE_GOOGLE_MAPS_API_KEY=AIzA...
                                    </code>
                                </div>
                            </div>
                        )}
                    </div>

                    {isPlacingPost && (
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#F97316] text-white font-black px-6 py-3 rounded-[20px] shadow-[0_10px_40px_rgba(249,115,22,0.4)] z-[1000] animate-pulse tracking-wide text-sm whitespace-nowrap border-none">
                            Clica en qualsevol punt del mapa per afegir
                        </div>
                    )}

                    {/* Filters */}
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-full pr-6 no-scrollbar z-[1000] p-1">
                        <button className="flex items-center h-10 px-5 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"><Store className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> Comerç</button>
                        <button className="flex items-center h-10 px-5 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"><Landmark className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> Patrimoni</button>
                        <button className="flex items-center h-10 px-5 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"><Ticket className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> Calendari</button>
                    </div>
                </div>
            </div>

            {/* SÓC DE POBLE - BARRA DE INTERACCIÓN GLOBAL (Sticky Top) */}
            <div className="sticky top-[64px] z-[1900] flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 py-2 sm:py-0 shadow-sm overflow-x-auto no-scrollbar transition-colors">
                <button 
                    onClick={() => navigate('/hub')}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-[#F97316] text-white dark:bg-[#4F46E5] dark:text-white px-4 py-1.5 font-sans text-xs font-bold tracking-wide transition-opacity active:scale-95 touch-manipulation whitespace-nowrap shrink-0 shadow-md"
                    aria-label="Connectar"
                >
                    <Plus size={14} className="drop-shadow-sm" strokeWidth={3} />
                    <span className="truncate uppercase">CONNECTAR</span>
                </button>

                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-extrabold uppercase tracking-widest shrink-0">
                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Traduir Pàgina"
                        onClick={() => setIsTranslationOpen(true)}
                    >
                        <Globe size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">TRADUIR</span>
                    </button>

                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Comentar al Xat"
                        onClick={() => navigate('/chats/socdepoble')}
                    >
                        <MessageCircle size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">COMENTAR</span>
                    </button>
                    
                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Compartir aquesta pàgina"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: 'Sóc de Poble Mapa', text: 'Descobreix la Xarxa Rural de Pobles Connectats al Mapa', url: window.location.href });
                            }
                        }}
                    >
                        <Share2 size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">COMPARTIR</span>
                    </button>
                </div>
            </div>

            {/* The action bar is now passed as a prop to SystemPageLayout to keep it fixed at bottom */}


            {/* Mur Unificat Inferior */}
            <div className="unified-feed-container w-full max-w-[1600px] mx-auto mt-6 px-4 md:px-8 bg-transparent">
                <div className="py-4 flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black flex items-center gap-3 text-theme-text tracking-tight">
                        <Activity size={24} className="text-[#F97316]" />
                        Pols del Territori
                    </h2>
                    <span className="px-4 py-1.5 bg-theme-panel rounded-[12px] text-xs font-black text-theme-muted tracking-wider uppercase border border-border-master shadow-sm">
                        {unifiedPosts.length} registres
                    </span>
                </div>
            
                {loading ? (
                    <div className="flex justify-center p-12">
                        <span className="animate-pulse text-[#F97316] font-bold tracking-widest text-sm uppercase">Sincronitzant Radar...</span>
                    </div>
                ) : (
                    <div className="bg-transparent pb-24">
                        <Feed 
                            hideHeader={true} 
                            customPosts={unifiedPosts} 
                            externalViewMode={viewMode} 
                        />
                    </div>
                )}
            </div>
        </SystemPageLayout>
    );
};

export default Map;

```

### Archivo: `pages/MasterCalendar.jsx`

```jsx
import { useState, useMemo, useRef, useEffect, useCallback, useDeferredValue } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Brain, ArrowLeft, ArrowRight, Grid, LayoutList, Settings, Plus, Globe, MessageCircle, Share2 } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import ContextualHeader from '../components/ContextualHeader';
import SystemPageLayout from '../components/SystemPageLayout';
import SystemActionBar from '../components/SystemActionBar';
import { useViewMode } from '../hooks/useViewMode';
import { useTranslation } from 'react-i18next';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';
import frLocale from '@fullcalendar/core/locales/fr';
import deLocale from '@fullcalendar/core/locales/de';
import { useDesign } from '../context/DesignContext';
import SEO from '../components/SEO';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { MOCK_EVENTS } from '../data';
import { AGENTS } from '../config/agentsMap';
import { useGoogleAuthCalendar } from '../hooks/useGoogleAuthCalendar';
import { useInternalCalendar } from '../hooks/useInternalCalendar';
import CalendarManagerModal from '../components/CalendarManagerModal';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
import VirtualizedEventFeed from '../components/VirtualizedEventFeed';
import TranslationModal from '../components/TranslationModal';
import { useRhizomeEvents } from '../hooks/useRhizomeEvents';
import './MasterCalendar.css';

const MasterCalendarContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);

    const { i18n } = useTranslation();
    const { visionMode } = useDesign();

    const fcLocale = useMemo(() => {
        const lang = i18n.language?.toLowerCase().split('-')[0];
        if (lang === 'va' || lang === 'ca') return caLocale;
        if (lang === 'es') return esLocale;
        if (lang === 'fr') return frLocale;
        if (lang === 'de') return deLocale;
        return enLocale;
    }, [i18n.language]);

    const queryParams = new URLSearchParams(location.search);
    const currentRole = queryParams.get('role');

    const { viewMode, setViewMode, columnCount, effectiveViewMode } = useViewMode('calendar_view_mode', 'grid');

    const { 
        calendars, selectedCalIds, toggleCalendar, hostCalId, toggleHost, 
        fetchGoogleEventsRange, login, logout, token 
    } = useGoogleAuthCalendar(currentDate);

    const {
        internalCalendars, selectedInternalCalIds, toggleInternalCalendar,
        fetchInternalEventsRange
    } = useInternalCalendar(currentDate);

    const { events: rhizomeEvents } = useRhizomeEvents();

    const [rawEvents, setRawEvents] = useState([]);
    const [currentRangeStr, setCurrentRangeStr] = useState('');

    const fetchAllEventsRange = useCallback(async (range) => {
        if (!range?.startStr) return;
        try {
            const [gEvents, iEvents] = await Promise.all([
                fetchGoogleEventsRange(range.startStr, range.endStr),
                fetchInternalEventsRange(range.startStr, range.endStr)
            ]);
            setRawEvents([...gEvents, ...iEvents]);
        } catch (e) {
            console.error("Calendar fetch error:", e);
        }
    }, [fetchGoogleEventsRange, fetchInternalEventsRange]);

    const handleDatesSet = useCallback((arg) => {
        const newRange = { startStr: arg.start.toISOString(), endStr: arg.end.toISOString() };
        setCurrentDate(arg.view.currentStart);
        setCurrentRangeStr(JSON.stringify(newRange));
    }, []);

    useEffect(() => {
        if (!currentRangeStr) return;
        const range = JSON.parse(currentRangeStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllEventsRange(range);
    }, [selectedCalIds, selectedInternalCalIds, fetchAllEventsRange, currentRangeStr]);

    const { combinedEvents, calendarEvents } = useMemo(() => {
        const isImmersive = visionMode !== 'humana';
        const rawMocks = isImmersive ? [...CALENDAR_EVENTS, ...MOCK_EVENTS] : [];
        const range = currentRangeStr ? JSON.parse(currentRangeStr) : { startStr: '1970-01-01', endStr: '2100-01-01' };
        const startR = new Date(range.startStr);
        const endR = new Date(range.endStr);

        const mEvents = rawMocks.filter(e => {
            const d = new Date(e.date || e.start || e.created_at || 0);
            return d >= startR && d <= endR;
        });

        let combined = [...rawEvents, ...mEvents, ...rhizomeEvents];

        if (currentRole && currentRole !== 'events') {
            combined = combined.filter(e => (e.type || 'personal').toLowerCase() === currentRole.toLowerCase());
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            combined = combined.filter(e => 
                e.title?.toLowerCase().includes(searchLower) || 
                e.description?.toLowerCase().includes(searchLower)
            );
        }

        combined.sort((a, b) => {
            const dateA = new Date(a.date || a.start || a.created_at || 0).getTime();
            const dateB = new Date(b.date || b.start || b.created_at || 0).getTime();
            return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
                   (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
        });

        const calEvents = combined.map(ev => ({
            id: ev.id,
            title: ev.title,
            start: ev.timeStart || ev.date || ev.start || ev.created_at, // Incluir created_at para posts
            allDay: !ev.timeStart,
            extendedProps: {
                description: ev.description,
                agentId: ev.agentId,
                type: ev.type,
                sourceCalendarId: ev.sourceCalendarId,
                emoji: ev.emoji,
                rawDate: ev.date || ev.start || ev.created_at
            },
            backgroundColor: ev.colorId ? 'var(--hud-accent)' : undefined
        }));

        return { combinedEvents: combined, calendarEvents: calEvents };
    }, [rawEvents, visionMode, currentRole, searchTerm, currentRangeStr, rhizomeEvents]);

    const deferredEvents = useDeferredValue(calendarEvents);
    const deferredCombined = useDeferredValue(combinedEvents);
    const calendarRef = useRef(null);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('calendar-events-count', { 
            detail: deferredEvents.length 
        }));
    }, [deferredEvents.length]);

    return (
        <SystemPageLayout
            className="calendar-master-page animate-in"
            containerClassName=""
            mainClassName="flex flex-col relative"
            header={
                <ContextualHeader 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholder="Cerca a l'agenda..."
                    backButton={
                        <button 
                            onClick={() => navigate(-1)}
                            aria-label="Torna enrere"
                            className="flex items-center gap-1 hover:text-white active:scale-95 transition-transform"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    }
                />
            }
        >
            <SEO 
                title="Calendari Master [Simbiosi]" 
                description="L'agenda i carpeta visual d'esdeveniments més innovadora del teu municipi. Connecta la teua vida a la comunitat."
                image="/seo-calendar-m3.png"
                url="/calendari"
            />

            <div className="flex-1 flex flex-col w-full h-full min-h-0">
                <CalendarManagerModal 
                    isOpen={isManagerOpen}
                    onClose={() => setIsManagerOpen(false)}
                    calendars={calendars}
                    selectedCalIds={selectedCalIds}
                    toggleCalendar={toggleCalendar}
                    hostCalId={hostCalId}
                    toggleHost={toggleHost}
                    token={token}
                    login={login}
                    logout={logout}
                    internalCalendars={internalCalendars}
                    selectedInternalCalIds={selectedInternalCalIds}
                    toggleInternalCalendar={toggleInternalCalendar}
                />

                <div className="flex-1 min-h-[600px] relative w-full mb-8 pt-2">
                    <FullCalendar
                        ref={calendarRef}
                        locale={fcLocale}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        views={{ timeGridFourDay: { type: 'timeGrid', duration: { days: 4 }, buttonText: '4 dies' } }}
                        headerToolbar={{
                            left: 'prev,next today Settings create',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridFourDay,timeGridDay,listWeek'
                        }}
                        customButtons={{
                            Settings: { text: 'G-Cal / Config', click: () => setIsManagerOpen(true) },
                            create: { text: '+ Nou Esdeveniment', click: () => console.log('Open creation modal') }
                        }}
                        datesSet={handleDatesSet}
                        events={deferredEvents}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        height="auto"
                        contentHeight="auto"
                        eventContent={(eventInfo) => {
                            const { extendedProps, title } = eventInfo.event;
                            const agent = extendedProps?.agentId ? AGENTS.find(a => a.id === extendedProps.agentId) : null;
                            const hasAvatar = agent && agent.avatar_url;

                            return (
                                <div 
                                    className={`fc-event-capsule ${extendedProps?.type || 'personal'} flex items-center gap-1 overflow-hidden whitespace-nowrap text-xs p-1 rounded w-full backdrop-blur-md cursor-pointer`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={title}
                                >
                                    {hasAvatar ? (
                                        <img src={agent.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" aria-hidden="true" />
                                    ) : (
                                        <span className="emoji flex items-center justify-center shrink-0" aria-hidden="true">
                                            {extendedProps.emoji || '✨'}
                                        </span>
                                    )}
                                    <span className="truncate">{title}</span>
                                </div>
                            );
                        }}
                        eventClick={(clickInfo) => {
                            if (!clickInfo.event.id.startsWith('MOCK')) {
                                navigate(`/sessio/${clickInfo.event.id.replace('gcal-', '')}`);
                            }
                        }}
                        eventDrop={(dropInfo) => {
                            console.log(`Event ${dropInfo.event.title} dropped to ${dropInfo.event.start}`);
                        }}
                    />
                </div>

                {/* SÓC DE POBLE - BARRA DE INTERACCIÓN GLOBAL (Sticky Top) */}
                <div className="sticky top-[64px] z-[1900] flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 py-2 sm:py-0 shadow-sm overflow-x-auto no-scrollbar transition-colors">
                    <button 
                        onClick={() => navigate('/hub')}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-[#F97316] text-white dark:bg-[#4F46E5] dark:text-white px-4 py-1.5 font-sans text-xs font-bold tracking-wide transition-opacity active:scale-95 touch-manipulation whitespace-nowrap shrink-0 shadow-md"
                        aria-label="Connectar"
                    >
                        <Plus size={14} className="drop-shadow-sm" strokeWidth={3} />
                        <span className="truncate uppercase">CONNECTAR</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-extrabold uppercase tracking-widest shrink-0">
                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                            title="Traduir Pàgina"
                            onClick={() => setIsTranslationOpen(true)}
                        >
                            <Globe size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">TRADUIR</span>
                        </button>

                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                            title="Comentar al Xat"
                            onClick={() => navigate('/chats/socdepoble')}
                        >
                            <MessageCircle size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">COMENTAR</span>
                        </button>
                        
                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                            title="Compartir aquesta pàgina"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: 'Sóc de Poble Calendari', text: 'Descobreix la Xarxa Rural de Pobles Connectats al Calendari', url: window.location.href });
                                }
                            }}
                        >
                            <Share2 size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">COMPARTIR</span>
                        </button>
                    </div>
                </div>

                <TranslationModal 
                    isOpen={isTranslationOpen} 
                    onClose={() => setIsTranslationOpen(false)} 
                />


                <section className="pb-12 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.05)] pt-8">
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <Brain size={20} className="text-[#F97316]" />
                        <h2 className="text-xl font-black tracking-wider text-theme-text uppercase flex items-center gap-3">
                            ÀNCORES DE MEMÒRIA RECENT
                            <span className="text-sm font-bold bg-theme-accent-primary/10 px-3 py-1 rounded-full text-theme-text/70">
                                {deferredEvents.length} PUBLICACIONS
                            </span>
                        </h2>
                    </div>
                    
                    <VirtualizedEventFeed 
                        effectiveViewMode={effectiveViewMode} 
                        columnCount={columnCount} 
                        events={deferredCombined}
                    />
                </section>
            </div>
        </SystemPageLayout>
    );
};

export default function MasterCalendar() {
    return (
        <GlobalErrorBoundary>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id'}>
                <MasterCalendarContent />
            </GoogleOAuthProvider>
        </GlobalErrorBoundary>
    );
}

```

### Archivo: `components/Feed.jsx`

```jsx
import React, { useState, useCallback, useEffect, useRef, useTransition } from 'react';
import ConflictBanner from './ConflictBanner';
// CACHE BUST SW: Evasió profunda de la catxé del ServiceWorker per forçar re-render del Mur
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, IAIA_ID, CREATOR_EMAILS } from '../constants';
import { isSdPOficial, isLegacyMock } from '../utils/identityUtils';
import { logger } from '../utils/logger';
import PostSkeleton from './Skeletons/PostSkeleton';
import StatusLoader from './StatusLoader';
import SEO from './SEO';
import UniversalCard from './UniversalCard';
import ContextualHeader from './ContextualHeader';
import { useFeedData } from '../hooks/useFeedData';
import { useFeedFilters } from '../hooks/useFeedFilters';
import { useIAIAAutonomousInteractions } from '../hooks/useIAIAAutonomousInteractions';
import { useViewMode } from '../hooks/useViewMode';
import { UniversalGridWrapper, UniversalGridRow } from './UniversalGrid';

class CardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('[CardErrorBoundary] Card fail:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const CorruptedCardPlaceholder = () => (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md rounded-[20px] border border-red-500/20 p-6 text-center">
        <Sparkles className="text-red-500/40 mb-3 opacity-50" size={32} />
        <span className="text-zinc-500 font-semibold font-['Epilogue'] tracking-tight">Post no disponible</span>
        <span className="text-zinc-600 text-[12px] mt-1">S'ha detectat una divergència CRDT local.</span>
    </div>
);

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false, externalViewMode = null }) => {
    const { iaiaLevel, gloveMode } = useDesign();
    const { selectedTown, enabledAgentIds } = useNavigation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    
    const activeTown = townId || selectedTown;

    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(() => {
        try {
            return localStorage.getItem('isIAIAFiltering') === 'true';
        } catch {
            return false;
        }
    });
    const { viewMode, setViewMode, columnCount, containerRef, effectiveViewMode } = useViewMode('feed_view_mode', 'grid', externalViewMode);
    
    const [contextualSearchTerm, setContextualSearchTerm] = useState('');

    const handleStorageChange = useCallback((e) => {
        if (e.key === 'isIAIAFiltering') {
            setIsIAIAFiltering(e.newValue === 'true');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleStorageChange]);

    const {
        posts,
        setPosts,
        userConnections,
        loading,
        error,
        hasMore,
        loadingMore,
        fetchPosts
    } = useFeedData({ activeTown, townName, customPosts, isPlayground, user, iaiaLevel, selectedRole: 'tot' });

    useEffect(() => {
        if (authLoading || customPosts) return;
        const controller = new AbortController();
        
        fetchPosts(false, controller.signal);
        
        return () => {
             controller.abort();
        };
    }, [fetchPosts, authLoading, customPosts]);

    useIAIAAutonomousInteractions({ isPlayground, isSuperAdmin, setPosts });

    const filteredPosts = useFeedFilters({
        posts,
        contentMode,
        iaiaLevel,
        enabledAgentIds,
        selectedTag,
        contextualSearchTerm,
        isIAIAFiltering,
        activeTown,
        userConnections
    });

    const [, startTransition] = useTransition();
    const activePosts = filteredPosts;

    const rowCount = Math.ceil(activePosts.length / columnCount);


    const parentRef = useRef(null);
    const getScrollElement = useCallback(() => {
        if (!hideHeader) return parentRef.current;
        if (typeof window === 'undefined' || !parentRef.current) return null;
        // Quan està incrustat (hideHeader=true), busca el contenidor de scroll pare més proper
        const scroller = parentRef.current.closest('.profile-scroll-container, .main-viewport');
        return scroller || parentRef.current;
    }, [hideHeader]);
    const estimateSize = useCallback(() => effectiveViewMode === 'list' ? 120 : (effectiveViewMode === 'single' ? 600 : 900), [effectiveViewMode]);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement,
        estimateSize,
        overscan: columnCount > 1 ? 2 : 5,
        onChange: (instance) => {
            const lastIndex = instance.getVirtualItems().at(-1)?.index ?? 0;
            if (lastIndex > rowCount - 10 && hasMore && !loadingMore) {
                startTransition(() => {
                    fetchPosts(true);
                });
            }
        }
    });

    useEffect(() => {
        rowVirtualizer.measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, activePosts.length, columnCount]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        if (isSdPOficial(targetId, post.author_name || post.author)) {
            navigate('/entitat/socdepoble');
            return;
        }

        if (post.author_role === USER_ROLES.AMBASSADOR || post.author_is_ai || post.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || isLegacyMock(targetId)) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }

        navigate(`/${type}/${targetId}`);
    }, [navigate]);

    /*
     * F-4: Estabilización de handlers por post ID.
     * Un Map persiste entre renders (via ref) y devuelve la misma referencia.
     */
    const headerClickCache = useRef(new Map());

    const getHeaderClickHandler = useCallback((post) => {
        const key = post.uuid || post.id;
        if (!headerClickCache.current.has(key)) {
            headerClickCache.current.set(key, () => handleHeaderClick(post));
        }
        return headerClickCache.current.get(key);
    }, [handleHeaderClick]);

    const renderPost = useCallback((post) => {
        // FIX: Clave estrictamente determinista y estable. JAMÁS Math.random()
        const pid = post.uuid || post.id || `temp-${post.author_user_id || 'anon'}-${post.created_at || (post.content ? post.content.substring(0, 15) : 'unknown')}`;
        const isOptimistic = post.metadata?.isOptimistic;
        const isDissolving = post.metadata?.isDissolving;

        // FIX: Evitar hardcodear Identificadores Únicos y Lógica de Negocio de roles en el VDOM.
        const headerTitle = post.metadata?.is_verified
            ? post.metadata.display_name
            : (post.author?.name || post.author || 'Gent del Poble');

        const rawTown = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';
        const headerSubtitle = rawTown;

        const postImage = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.coverImage);
        const hasNoImage = !postImage;
        const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

        // Logic to resolve the correct Title for the post avoiding generic fallback or author name repetition
        const extractedTitle = post.title || 
                               (post.content ? post.content.split('\n')[0].replace(/^[#*\s]+/, '').trim() : null) || 
                               'Actualitat del Poble';
        const displayTitle = extractedTitle.length > 80 ? extractedTitle.substring(0, 80) + '...' : extractedTitle;

        return (
            <div key={pid} className={`card-rizoma-wrapper animate-in ${isDissolving ? 'dissolve' : ''} w-full h-full`}>
                <UniversalCard
                    item={post}
                    avatarName={headerTitle}
                    title={displayTitle}
                    subtitle={headerSubtitle}
                    image={hasNoImage ? cinematicPlaceholder : postImage}
                    onHeaderClick={getHeaderClickHandler(post)}
                    mode="mur"
                    viewMode={effectiveViewMode}
                    className={`universal-card-virtual ${isOptimistic ? 'optimistic' : ''} ${post.is_iaia_inspired ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
                    variant={post.type === 'bando' ? 'ajuntament' : (post.type === 'tramit' ? 'mur' : (post.type === 'mercat' ? 'mercat' : 'post'))}
                >
                    {post.is_iaia_inspired && (
                        <div className="iaia-transparency-genesis mt-2 mb-1">
                            <div className="flex items-center gap-1 font-black text-[12px] text-cyan-400">
                                <Sparkles size={12} /> IAIA + VEÍ [MASTER]
                            </div>
                        </div>
                    )}
                </UniversalCard>
            </div>
        );
    }, [gloveMode, getHeaderClickHandler, effectiveViewMode]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex-1 flex flex-col h-full bg-theme-base relative overflow-hidden items-center justify-center p-8">
                <Loader2 className="animate-spin text-[#F97316]" size={48} strokeWidth={2.5} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col h-full bg-theme-base relative overflow-hidden items-center justify-center p-8">
                <p className="text-[#EF4444] text-center font-bold mb-4">{t('feed.error_loading') || 'Error de càrrega'}</p>
                <StatusLoader type="error" message={error} onRetry={() => fetchPosts()} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 h-full bg-theme-base relative overflow-hidden w-full">
            <div id="feed-live-region" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {loading && posts.length === 0 && 'Carregant publicacions...'}
                {loadingMore && 'Carregant més publicacions...'}
                {!loading && posts.length > 0 && `${posts.length} publicacions carregades`}
                {error && `Error: ${error}`}
            </div>
            <SEO
                title={t('mur.title') || 'El Mur'}
                description={t('mur.description') || 'Connecta amb la teua comunitat i descobreix les darreres novetats del teu poble.'}
                image="/og-mur.png"
            />

            <h1 className="sr-only">Mur d'Activitat i Notícies de Sóc de Poble</h1>

            {!hideHeader && (
                <div className="flex-none w-full z-dropdown">
                    <ContextualHeader
                        searchTerm={contextualSearchTerm}
                        onSearchChange={setContextualSearchTerm}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setViewMode(mode);
                        }}
                        placeholder="Cerca al mur..."
                    />
                </div>
            )}

            <div
                ref={parentRef}
                className="flex-1 overflow-y-auto custom-scrollbar pb-20 w-full scroll-container-y min-h-0"
                style={{ contain: 'content', overflowAnchor: 'none' }}
                role="region"
                aria-label="Llista de publicacions"
            >
                <ConflictBanner />
                <UniversalGridWrapper viewMode={viewMode}>
                    <div
                        ref={containerRef}
                        className="feed-list mx-auto w-full relative"
                        role="feed"
                        aria-busy={loading || loadingMore}
                        aria-label="Publicacions del Mur"
                        style={{
                            height: `${rowVirtualizer.getTotalSize() + 36}px`,
                        }}
                    >
                        {activePosts.length === 0 ? (
                            <StatusLoader
                                type="empty"
                                message={selectedTag
                                    ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                    : (t('feed.empty') || 'No hi ha novetats al mur.')
                                }
                                onRetry={selectedTag ? () => setSelectedTag(null) : null}
                            />
                        ) : (
                            rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const startIndex = virtualRow.index * columnCount;
                                const rowItems = activePosts.slice(startIndex, startIndex + columnCount);

                                return (
                                    <UniversalGridRow
                                        key={virtualRow.key}
                                        viewMode={viewMode}
                                        columnCount={columnCount}
                                        className="feed-grid"
                                        {...{ "data-index": virtualRow.index }}
                                        ref={rowVirtualizer.measureElement}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${virtualRow.start + 36}px)`,
                                        }}
                                    >
                                        {rowItems.map((post, idx) => (
                                            <article 
                                                key={post.uuid || post.id || idx}
                                                aria-posinset={virtualRow.index * columnCount + idx + 1}
                                                aria-setsize={hasMore ? -1 : activePosts.length}
                                                style={{ contain: 'layout paint style', contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
                                            >
                                                <CardErrorBoundary fallback={<CorruptedCardPlaceholder />}>
                                                    {renderPost(post)}
                                                </CardErrorBoundary>
                                            </article>
                                        ))}
                                    </UniversalGridRow>
                                );
                            })
                        )}
                    </div>
                </UniversalGridWrapper>

                {!customPosts && hasMore && posts.length > 0 && !selectedTag && (
                    <div className="load-more-container mt-12 mb-12 flex justify-center w-full">
                        <button
                            className="btn-load-more"
                            onClick={() => fetchPosts(true)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Loader2 className="spinner" /> : t('common.load_more') || 'Carregar més'}
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
};


export default Feed;

```

### Archivo: `components/VirtualizedEventFeed.jsx`

```jsx
import { useMemo } from 'react';

import UniversalCard from './UniversalCard';

/**
 * Renderització fluida i natural per al feed històric.
 * S'ha suprimit la virtualització (react-window) que empresonava els components
 * en divs fantasmes de 280px d'altura, permetent el scroll natiu del navegador.
 */
export default function VirtualizedEventFeed({ effectiveViewMode, events }) {
    // Sort una sola vez + memo, y copia el array para no mutar el padre
    const sortedEvents = useMemo(() => {
        if (!events) return [];
        return [...events].sort((a, b) => {
            const dateA = new Date(a.date || a.start || a.created_at || 0).getTime();
            const dateB = new Date(b.date || b.start || b.created_at || 0).getTime();
            return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
                   (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
        });
    }, [events]);



    if (!sortedEvents.length) {
        return <div className="p-8 text-center text-theme-text/60">Encara no hi ha esdeveniments a la plaça...</div>;
    }

    return (
        <div className="w-full pb-16">
            <div className={`grid gap-4 px-4 ${
                effectiveViewMode === 'grid' 
                    ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
                    : 'flex flex-col gap-4'
            }`}>
                {sortedEvents.map((event, index) => (
                    <UniversalCard
                        key={event.id || index.toString()}
                        id={event.id || index.toString()}
                        type={event.type || 'village'}
                        title={event.title || 'Sense Títol'}
                        description={event.description || ''}
                        imageUrl={event.image_url}
                        metadata={{
                            tag: event.date || event.start,
                            avatar: event.author_avatar,
                            subTag: `ID: ${String(event.id || 'N/A').slice(0, 8)}`,
                            author: event.author_name || 'Poble'
                        }}
                        viewMode={effectiveViewMode}
                        url={!String(event.id || '').startsWith('MOCK') ? `/sessio/${String(event.id || '').replace('gcal-', '')}` : '#'}
                    />
                ))}
            </div>
        </div>
    );
}

```

### Archivo: `components/UniversalGrid.jsx`

```jsx
import React from 'react';

/**
 * UniversalGridWrapper
 * Limita l'amplada segons el mode (single i list es queden estrets i llegibles, grid s'expandeix).
 */
export const UniversalGridWrapper = React.memo(({ viewMode, children, className = "" }) => {
    const isRestrictedWidth = viewMode === 'list' || viewMode === 'single';
    // [BLINDAJE 4K]: max-w-7xl (aprox 1280px) para evitar tracks kilométricas 
    const maxWidthClass = isRestrictedWidth ? 'max-w-3xl' : 'max-w-7xl';

    return (
        <div className={`mx-auto w-full transition-[max-width] duration-300 ease-in-out ${maxWidthClass} px-2 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
});
UniversalGridWrapper.displayName = 'UniversalGridWrapper';

/**
 * UniversalGridRow
 * Fila estàndard que aplica "display: grid" amb un "gap" innegociable de 24px per evitar encavalcaments.
 * Compatible amb `isVirtualRow` si passem un obj `style` que incloga transform i absolute position.
 */
export const UniversalGridRow = React.memo(React.forwardRef(({
    viewMode,
    columnCount,
    children,
    className = "",
    style = {},
    ...props
}, ref) => {
    const actualColumns = (viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry')
        ? 1
        : columnCount;

    /*
     * G-2: baseStyle memoizado dentro del componente.
     * `style` viene del virtualizador y SIEMPRE es un objeto nuevo (transform cambia).
     * Los valores estáticos se separan del spread dinámico para que el motor V8
     * pueda cachear la forma del objeto base.
     */
    const gridStyle = React.useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${actualColumns}, minmax(min(100%, 340px), 1fr))`,
        gap: '24px',
        padding: '24px 16px', // Added 24px top padding to prevent sticking to ContextualHeader
        boxSizing: 'border-box',
    }), [actualColumns]);

    const mergedStyle = React.useMemo(() => ({ ...gridStyle, ...style }), [gridStyle, style]);

    return (
        <div
            ref={ref}
            className={`universal-grid-row view-mode-${viewMode} ${className}`}
            style={mergedStyle}
            {...props}
        >
            {children}
        </div>
    );
}));
UniversalGridRow.displayName = 'UniversalGridRow';

```

### Archivo: `components/UniversalCard/index.jsx`

```jsx
import React, { Suspense, useCallback, useMemo } from 'react';
// CACHE BUST SW: Evasió profunda de la catxé per a targeta indestructible.
import { useNavigate, useLocation } from 'react-router-dom';
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

import { normalizePostData } from '../../normalizers/post.normalizer';
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

// Hook reactiu i net per a detectar ruta de xat
const useIsChatRoute = () => {
    const location = useLocation();
    return location.pathname.startsWith('/chats');
};

// Funció memoitzada i purament determinista per a imatges fallback
const getFallbackImage = (id) => {
    const strId = String(id || '1');
    let hash = 0;
    for (let i = 0; i < strId.length; i++) {
        hash = strId.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Usant exclusivament l'array local sense duplicacions fallides.
    const baseModulo = FALLBACK_NANO_IMAGES.length;
    const safeIndex = Math.abs(hash) % baseModulo;
    return FALLBACK_NANO_IMAGES[safeIndex];
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
    viewMode = "grid",
    onNavigate // DeepSeek Audit: Allow decoupled routing
}) => {
    const cardVariant = (variant === "post" && mode && mode !== "post") ? mode : (variant || mode);
    const { openViewer, openConnectionModal } = useModal();
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
    // Logica Isolada: Absorbeix si un poble o negoci és oficial en lloc de fer-ho pel cap de la UI.
    const isOfficial = useMemo(() => {
        const normalized = normalizePostData(item, { forcedOfficial });
        return normalized ? normalized.isOfficial : false;
    }, [item, forcedOfficial]);

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
        
        // DeepSeek Audit: Decoupled navigation priority
        if (onNavigate) {
            return onNavigate(item);
        }

        const id = item?.uuid || item?.id;
        if (item?.type === 'page' && item?.slug) {
            navigate(`/${item.slug}`);
        } else if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item, cardVariant, navigate, seniorMode, hapticService, onNavigate]);

    const handleConnectClick = useCallback(async (e) => {
        e.stopPropagation();
        const postId = item?.uuid || item?.id;
        if (!postId) {
            logger.error("[UniversalCard] No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        openConnectionModal({ 
            postId, 
            currentTags: item?.tags || [] 
        });
    }, [item?.uuid, item?.id, item?.tags, openConnectionModal]);

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
            className={`${cardClasses} cursor-pointer`}
            onClick={handleCardClick}
            role="article"
            aria-label={displayTitle}
        >
            {viewMode === 'list' ? (
                <div className="flex flex-col w-full h-full">
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
                    <div className="flex items-center gap-4 p-4 w-full flex-grow">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={displayTitle}
                                className="w-24 h-24 object-cover rounded-[28px] hover:scale-110 transition-transform duration-500 flex-shrink-0"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-24 h-24 flex items-center justify-center rounded-[28px] bg-white/5 flex-shrink-0">
                                <ImageIcon size={20} className="text-gray-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0 pr-4 z-10">
                            <div className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide"><h4>{displayTitle}</h4></div>
                            <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide min-w-0 mt-1">
                                <div className="text-[var(--theme-accent-primary)] truncate"><span>{displayAuthor}</span></div>
                                <span className="shrink-0">•</span>
                                <div className="opacity-70 truncate"><span>{displayTown.replace("Poble Principal: ", "").trim()}</span></div>
                            </div>
                        </div>
                        {displayPrice && (
                            <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 rounded-[28px] flex-shrink-0 z-10">
                                <span>{displayPrice}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 z-0" aria-hidden="true"></div>
                    </div>
                    <div className="mt-auto">
                        <Suspense fallback={<div className="h-10 rounded bg-surface-var/30 animate-pulse w-full" role="status"><div className="sr-only"><span>Carregant peu...</span></div></div>}>
                            <UniversalCardFooter 
                                item={item}
                                cardVariant={cardVariant}
                                displayTitle={displayTitle}
                                isMaster={isMaster}
                                navigate={navigate}
                                handleConnectClick={handleConnectClick}
                                viewMode={viewMode}
                            />
                        </Suspense>
                    </div>
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
                    <Suspense fallback={<div className="h-16 mt-2 rounded bg-surface-var/30 animate-pulse w-full max-w-sm" role="status"><div className="sr-only"><span>Carregant contingut...</span></div></div>}>
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
                    <Suspense fallback={<div className="h-10 mt-4 rounded bg-surface-var/30 animate-pulse w-[80%]" role="status"><div className="sr-only"><span>Carregant peu...</span></div></div>}>
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                            viewMode={viewMode}
                        />
                    </Suspense>
                </>
            )}
        </article>
    );

    const FinalCard = CardContent;

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${(cardVariant || 'POST').toUpperCase()} | R: 28PX`} color="cyan">
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

```

### Archivo: `components/UniversalCard/UniversalCard.Header.jsx`

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import { Zap, MapPin, MoreHorizontal, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const isEventOrAgenda = cardVariant === 'event' || item?.type === 'agenda';

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

    const finalAvatarSrc = avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url;
    const finalAvatarRole = avatarRole || item?.author_role;

    return (
        <header 
            className="flex items-center justify-between px-4 py-2 h-[64px] bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white relative z-10 w-full transition-colors" 
            onClick={handleAuthorClick}
            role="button"
            tabIndex={0}
            aria-label={`Obrir perfil de ${displayAuthor}`}
        >
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-theme-panel cursor-pointer active:scale-95 transition-all duration-300 ease-out flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (finalAvatarRole === 'master') {
                            navigate('/iaia');
                        }
                    }}
                >
                    <Avatar 
                        name={displayAuthor} 
                        src={finalAvatarSrc} 
                        role={finalAvatarRole}
                        size="md"
                    />
                </div>
                
                <div className="flex flex-col min-w-0">
                    <div className="text-[#111111] dark:text-white text-[18px] font-black tracking-wide leading-tight flex items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity">
                        <div className="truncate lowercase first-letter:uppercase"><span>{cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}</span></div>
                        {item?.is_iaia_inspired && (
                            <Sparkles size={14} className="text-[#111111] dark:text-[#F97316] shrink-0" fill="currentColor" />
                        )}
                        {isOfficial && (
                            <Zap size={14} className="text-[#111111] dark:text-[#38BDF8] drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_4px_#38BDF8] shrink-0" fill="currentColor" />
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5 min-w-0">
                        {cardVariant !== 'pobles' && (
                            <div className="text-[14px] text-black/80 dark:text-white/80 font-bold">
                                <span>{displayTime} - {displayDate}</span>
                            </div>
                        )}
                        {(displayTown && displayTown !== displayAuthor && cardVariant !== 'pobles') && (
                            <>
                                <div className="text-black/80 dark:text-white/80 shrink-0"><span>•</span></div>
                                <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold" title={displayTown.replace("Poble Principal:", "").trim()}>
                                    <MapPin size={12} className="shrink-0" />
                                    <div className="truncate"><span>{displayTown.replace("Poble Principal:", "").trim()}</span></div>
                                </div>
                            </>
                        )}
                        {cardVariant === 'pobles' && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold" title={`De part de: ${displayAuthor}`}>
                                <MapPin size={12} className="shrink-0" />
                                <div className="truncate lowercase first-letter:uppercase"><span>De part de: {displayAuthor}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-2">
                {isEventOrAgenda && (
                    <div className="bg-theme-panel px-2.5 py-1 rounded-[8px] shadow-[0_0_10px_rgba(249,115,22,0.15)] flex flex-col items-center justify-center">
                         <div className="text-[11px] font-black text-[#F97316] uppercase tracking-wider">
                             <span>{t('card.agenda_tag') || 'Agenda'}</span>
                         </div>
                    </div>
                )}
                
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 duration-300 ease-out shrink-0"
                    aria-label="Més opcions"
                >
                    <MoreHorizontal size={20} className="text-[#111111] dark:text-white/80" />
                </button>
            </div>
        </header>
    );
};

export default UniversalCardHeader;

```

