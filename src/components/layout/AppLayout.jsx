import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Handshake, UploadCloud } from "lucide-react";
import NavigationRail from "./NavigationRail";
import { useDesign } from "../../app/context/DesignContext";
import { useNavigation } from "../../app/context/NavigationContext";
import { useAuth } from "../../app/context/AuthContext";
import { useModal } from "../../app/context/ModalContext";
import NanoLoader from "../ui/NanoLoader";
import ErrorBoundary from "../core/ErrorBoundary";
import { initGA, trackPageView } from "../../core/services/analyticsService";
import MobileBottomNav from "./MobileBottomNav";
import BlueprintOverlay from "../ui/BlueprintOverlay";
import DegradedBanner from "../ui/DegradedBanner";
import ChatLayout from "./ChatLayout";
import ChatEmptyState from "../features/ChatEmptyState";
import ChatDetail from "../features/ChatDetail";
import Feed from "../features/Feed";
import Header from "./Header";
import ContextualMenu from "../ui/ContextualMenu";
const Register = lazy(() => import("../../pages/auth/Register"));
const Towns = lazy(() => import("../../pages/community/Towns"));
const Marketplace = lazy(() => import("../features/Marketplace"));
const UniversalDetail = lazy(() => import("../../pages/features/UniversalDetail"));
const ProfileView = lazy(() => import("../../pages/community/ProfileView"));
const AdminPanel = lazy(() => import("../../pages/admin/AdminPanel"));
const ArxiuOr = lazy(() => import("../../pages/features/Archive"));
const AlbumGlobal = lazy(() => import("../../pages/features/GlobalAssetAlbum"));
const SearchDiscover = lazy(() => import("../../pages/features/SearchDiscover"));
const OficiDocumentacio = lazy(() => import("../../pages/features/OficiDocumentacio"));
const NexusFlash = lazy(() => import("../../pages/admin/NexusFlash"));
const UniversalPage = lazy(() => import("../../pages/public/UniversalPage"));
const DesignSystem = lazy(() => import("../../pages/features/DesignSystem"));
const MediaManager = lazy(() => import("../../pages/features/MediaManager"));
const GenesisViewer = lazy(() => import("../../pages/admin/GenesisViewer"));
const Versions = lazy(() => import("../../pages/admin/Versions"));
const BuscadorAjudes = lazy(() => import("../../pages/features/BuscadorAjudes"));
const DirectoriComunitat = lazy(() => import("../../pages/community/CommunityDirectory"));
const MapaActius = lazy(() => import('../../pages/community/Map'));
const CalendariMaster = lazy(() => import('../../pages/community/MasterCalendar'));
const HubView = lazy(() => import("../../pages/features/HubView"));
const AccessibilitatUniversal = lazy(() => import("../ui/AccessibilitatUniversal"));
const AgentDirectory = lazy(() => import("../../pages/community/AgentDirectory"));
const UsersDirectory = lazy(() => import("../../pages/community/UsersDirectory"));



const ControlGeneral = lazy(() => import("../../pages/admin/ControlGeneral"));
const VisionView = lazy(() => import("../../pages/features/VisionView"));
const ConnectarPage = lazy(() => import("../../pages/features/ConnectarPage"));

const ArchitecteView = lazy(() => import("../features/ArchitecteView"));
const RoadmapView = lazy(() => import("../../pages/public/RoadmapView"));
const ResourceDetail = lazy(() => import("../../pages/features/ResourceDetail"));
const InfografiaGallery = lazy(() => import("../features/infoteca/InfografiaGallery"));
const Notes = lazy(() => import("../../pages/features/Notes"));
const IAIAChatSidebar = lazy(() => import("../features/IAIAChatSidebar"));
const ProfilePowerMenu = lazy(() => import("../ui/ProfilePowerMenu"));
const Chrome145Report = lazy(() => import("../../pages/admin/Chrome145Report"));


// Legal Pages (Virtual Store Compliance)
const CentroLegal = lazy(() => import("../../pages/public/LegalPages").then(module => ({ default: module.CentroLegal })));

const EpubViewer = lazy(() => import("../features/EpubViewer"));
const MedicationConfirm = lazy(() => import("../../pages/features/MedicationConfirm"));
const VitalSecurity = lazy(() => import("../../pages/features/VitalSecurity"));

// --- ORPHAN PAGES CONNECTED ---
const Ideoteca = lazy(() => import("../../pages/admin/Ideoteca"));
const AulaRural = lazy(() => import("../../pages/admin/AulaRural"));
const DAFOPage = lazy(() => import("../../pages/admin/DAFOPage"));
const DesignCanon = lazy(() => import("../../pages/admin/DesignCanon"));
const DidacticPage = lazy(() => import("../../pages/admin/DidacticPage"));
const GhostMemorial = lazy(() => import("../../pages/admin/GhostMemorial"));
const ManualPage = lazy(() => import("../../pages/admin/ManualPage"));
const PlaygroundPortal = lazy(() => import("../../pages/admin/PlaygroundPortal"));
const SessionChronicle = lazy(() => import("../../pages/admin/SessionChronicle"));


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

const SuperAdminRoute = () => {
  const { isSuperAdmin, loading } = useAuth();
  const { t } = useTranslation();
  if (loading) return <NanoLoader message={t('common.connecting', 'Connectant...')} />;
  // Restricció severa basada en el Genotip de Privacitat: Sóc de Poble Privado
  if (!isSuperAdmin) return <Navigate to="/ruta" replace />;
  return <Outlet />;
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
    setGlobalDroppedFile,
    preferredAgentId,
  } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
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
        if (file.type.startsWith('image/')) {
           setGlobalDroppedFile(file);
           navigate(`/chats/${preferredAgentId || '11111111-1a1a-0000-0000-000000000000'}`);
        } else {
           openPostModal({ isPrivate: false, initialFile: file });
        }
      }
    },
    [openPostModal, navigate, setGlobalDroppedFile, preferredAgentId],
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

  const isReaderRoute = React.useMemo(() => 
    location.pathname === "/el-projecte" ||
    location.pathname.startsWith("/page/") ||
    location.pathname.startsWith("/reader"),
  [location.pathname]);

  const isOverflowHidden = React.useMemo(() => 
    isReaderRoute ||
    location.pathname.startsWith("/chats") ||
    location.pathname.startsWith("/ofici/xats") ||
    location.pathname.startsWith("/ofici/menu") ||
    location.pathname === "/genotip" ||
    location.pathname === "/versions" ||
    location.pathname === "/notes",
  [location.pathname, isReaderRoute]);

  // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció dinàmica de Viewport depenent de l'accessibilitat
  React.useEffect(() => {
    const updateViewport = (isAccessible) => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const content = isAccessible 
        ? "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        : "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover";
        
      if (viewport) {
        viewport.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = content;
        document.getElementsByTagName("head")[0].appendChild(meta);
      }
    };

    // Establir viewport inicial
    const isAccessible = localStorage.getItem('sp_accessibility') === 'true';
    updateViewport(isAccessible);

    // Escoltar canvis d'accessibilitat per a actualitzar el viewport en temps real
    const handleAccessibilityChange = (e) => {
      updateViewport(e.detail.isAccessible);
    };

    window.addEventListener('accessibilityChanged', handleAccessibilityChange);
    return () => window.removeEventListener('accessibilityChanged', handleAccessibilityChange);
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
      veins: "USER_DIRECTORY",
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
      className="flex flex-col h-screen support-dvh:h-[100dvh] w-full overflow-hidden font-sans bg-theme-base text-theme-text relative"
      style={{ height: 'var(--vv-height, 100dvh)' /* Modern browsers will use this, older will fallback to h-screen class */ }}
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
        <div className="absolute inset-0 z-[var(--z-overlay)] bg-[var(--theme-accent-primary)]/95 flex flex-col items-center justify-center text-white pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
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
        <div className="w-full relative z-[500] bg-[#000000]">
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
      <div className="flex-1 grid md:grid-cols-[auto_1fr] overflow-hidden relative min-h-0">
        {/* 0. OVERLAY MÒBIL (Sombra de fondo purificada) */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-[var(--z-overlay)] md:hidden transition-opacity duration-300 animate-in fade-in cursor-pointer"
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
              fixed z-[var(--z-sidebar)] top-[64px] left-0 h-[calc(100dvh-64px)] w-[300px] max-w-[85vw] bg-[#000000] border-r border-[#ffffff14]
              shadow-[4px_0_15px_rgba(0,0,0,0.3)]
              ${
                isDrawerOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }
              md:relative md:top-0 md:h-full md:z-[var(--z-sidebar)] md:translate-x-0 md:w-[240px] md:border-r-0
            `}
          >
            <BlueprintOverlay
              label="SIDEBAR"
              dimensions="240px"
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
                    <Route path="/mapa" element={<MapaActius />} />
                    <Route path="/calendari" element={<CalendariMaster />} />

                    <Route path="/chats/*" element={<ChatLayout />}>
                      <Route index element={<ChatEmptyState />} />
                      <Route path=":id" element={<ChatDetail />} />
                    </Route>

                    <Route path="/post/:id" element={<UniversalDetail type="post" />} />
                    <Route path="/connectar" element={<ConnectarPage />} />
                    <Route path="/media" element={<MediaManager />} />
                    <Route path="/mur" element={<Feed />} />
                    <Route path="/mercat" element={<Marketplace />} />
                    <Route path="/mercat/:id" element={<UniversalDetail type="mercat" />} />
                    <Route path="/iaia" element={<ProfileView />} />
                    <Route
                      path="/perfil"
                      element={
                        <ProtectedRoute>
                          <ProfileView />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/gent/:id" element={<ProfileView />} />
                    <Route path="/empresa/:id" element={<ProfileView />} />
                    <Route path="/ajuntament/:id" element={<ProfileView />} />
                    <Route path="/login" element={<Register />} />
                    <Route path="/registre" element={<Register />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchDiscover />} />
                    
                    {/* ENTORNS PROTEGITS (NOMÉS ADMIN/PROPIETARI) */}
                    <Route path="/versions" element={<UniversalPage slug="versions" standAlone={false} />} />
                    <Route element={<SuperAdminRoute />}>
                      <Route path="/control-general" element={<ControlGeneral />} />
                      
                      {/* CONEXIONES HUÉRFANAS */}
                      <Route path="/ideoteca" element={<Ideoteca />} />
                      <Route path="/aula-rural" element={<AulaRural />} />
                      <Route path="/dafo" element={<DAFOPage />} />
                      <Route path="/dafo/:id" element={<DAFOPage />} />
                      <Route path="/canon" element={<DesignCanon />} />
                      <Route path="/didactica" element={<DidacticPage />} />
                      <Route path="/didactica/:slug" element={<DidacticPage />} />
                      <Route path="/fantasmes" element={<GhostMemorial />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/manual" element={<ManualPage />} />
                      <Route path="/playground" element={<PlaygroundPortal />} />
                      <Route path="/cronica" element={<SessionChronicle />} />
                    </Route>
                    <Route path="/ofici" element={<OficiDocumentacio />} />
                    <Route path="/ofici/:id" element={<OficiDocumentacio />} />
                    <Route
                      path="/buscador-ajudes"
                      element={<BuscadorAjudes />}
                    />
                    <Route path="/nexus" element={<NexusFlash />} />
                    <Route path="/genesis" element={<GenesisViewer />} />
                    <Route path="/genotip" element={<UniversalPage slug="genotip" standAlone={false} />} />
                    <Route path="/disseny" element={<DesignSystem />} />
                    <Route path="/ruta" element={<RoadmapView />} />
                    <Route path="/directori" element={<DirectoriComunitat />} />
                    <Route path="/agents" element={<AgentDirectory />} />
                    <Route path="/veins" element={<UsersDirectory />} />
                    <Route path="/iaies-mundials" element={<UniversalPage slug="iaies-mundials" standAlone={false} />} />
                    <Route path="/iaies-mundials/:id" element={<ProfileView />} />
                    <Route path="/hub" element={<HubView />} />
                    <Route path="/visio" element={<VisionView />} />
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
                    <Route path="/legal-privacitat-i-seguretat" element={<CentroLegal />} />
                    <Route path="/el-projecte" element={<UniversalPage slug="el-projecte" standAlone={false} />} />
                    <Route path="/page/:slug" element={<UniversalPage standAlone={false} />} />
                    <Route path="/reader" element={<EpubViewer url="/system/books/el-projecte.epub" title={"Sóc de Poble: El Projecte"} onClose={() => window.history.back()} />} />
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
          className="fixed inset-0 z-[var(--z-modal)] glass-overlay bg-black/80 animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Configuració d'Accessibilitat"
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
          className="fixed inset-0 z-[var(--z-modal)] glass-overlay bg-black/90 md:pl-[240px]"
          role="dialog"
          aria-modal="true"
          aria-label="Mode Arquitecte"
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
