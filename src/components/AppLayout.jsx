import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import NavigationRail from "./NavigationRail";
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from "../context/AuthContext";
import { Ruler, ScanLine, Handshake } from "lucide-react";
import NanoLoader from "./NanoLoader";
import ErrorBoundary from "./ErrorBoundary";

const ChatLayout = lazy(() => import("../components/ChatLayout"));
const ChatEmptyState = lazy(() => import("../components/ChatEmptyState"));
const ChatDetail = lazy(() => import("../components/ChatDetail"));
const Feed = lazy(() => import("./Feed"));
const Register = lazy(() => import("../pages/Register"));
const Towns = lazy(() => import("../pages/Towns"));
const Marketplace = lazy(() => import("./Marketplace"));
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
import GlobalFooter from "./GlobalFooter";
import MobileBottomNav from "./MobileBottomNav";
import BlueprintOverlay from "./BlueprintOverlay";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <NanoLoader message="Bategant..." />;
  // CRITICAL FIX: To protect admin routes, redirect properly.
  if (!user) return <Navigate to="/registre" state={{ from: location }} replace />;
  return children;
};

import { initGA, trackPageView } from "../services/analyticsService";

const AppLayout = () => {
  const { architectMode, accessibilityMode } = useDesign();
  const { isDrawerOpen, closeDrawer, closeIAIASidebar, iaiaSidebarOpen, iaiaSidebarContext, isAccessibilitatOpen, setIsAccessibilitatOpen } = useNavigation();
  const location = useLocation();

  // [ANALYTICS BATEGAT] Inicialització i seguiment de rutes
  React.useEffect(() => {
    initGA();
  }, []);

  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Detect minimal mode (for Mac-style window breakaway)
  const isMinimal =
    new URLSearchParams(location.search).get("window") === "true";

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

  // Mappeig de labels arquitectònics per al Frame Global
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

  const currentLabel = routeLabels[path] || "MAIN_VIEWPORT_FLEX";

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden font-sans bg-theme-base text-theme-text relative max-h-[100dvh]">
      {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
      {!isMinimal && (
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
      )}

      {/* CONTENIDOR PRINCIPAL (SIDEBAR + ESCENARI) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 0. OVERLAY MÒBIL (Sombra de fondo) */}
        {isDrawerOpen && (
          <div className="drawer-backdrop md:hidden" onClick={closeDrawer} />
        )}

        {!isMinimal && (
          <div
            className={`
                        flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
                        ${isDrawerOpen ? "w-[280px]" : "w-0"}
                        ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
                        md:relative absolute z-[1001] bg-theme-sidebar border-white/10
                        md:h-full top-14 md:top-0 bottom-[calc(70px+env(safe-area-inset-bottom))] md:bottom-auto left-0 md:left-auto
                    `}
          >
            <BlueprintOverlay
              label="SIDEBAR"
              dimensions={isDrawerOpen ? "280px" : "0px"}
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
            location.pathname.startsWith("/chats") ||
            location.pathname.startsWith("/gestio-menu") ||
            location.pathname.startsWith("/notes") ||
            location.pathname.startsWith("/financament") ||
            location.pathname.startsWith("/hub")
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
            className="flex-1 flex flex-col min-h-0 relative"
          >
            <Suspense fallback={<NanoLoader message="Bategant..." />}>
              <ErrorBoundary>
                <div
                  className={`flex-1 flex flex-col relative min-w-0 main-viewport custom-scrollbar !m-0 !p-0 ${
                    location.pathname.startsWith("/chats") ||
                    location.pathname.startsWith("/gestio-menu") ||
                    location.pathname.startsWith("/notes") ||
                    location.pathname.startsWith("/financament") ||
                    location.pathname.startsWith("/hub")
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
                    <Route path="/pobles/:id" element={<TownDetail />} />

                    <Route path="/chats/*" element={<ChatLayout />}>
                      <Route index element={<ChatEmptyState />} />
                      <Route path=":id" element={<ChatDetail />} />
                    </Route>

                    <Route path="/mur" element={<Feed />} />
                    <Route path="/mercat" element={<Marketplace />} />
                    <Route path="/iaia" element={<ProfileView />} />
                    <Route
                      path="/perfil"
                      element={
                        <ProtectedRoute>
                          <ProfileView />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/perfil/:id" element={<ProfileView />} />
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
                      element={
                        <ProtectedRoute>
                          <ChatManager />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestio-menu"
                      element={
                        <ProtectedRoute>
                          <MenuManagementView />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/utilitats" element={<Utilitats />} />
                    <Route
                      path="/accessibilitat"
                      element={<AccessibilitatUniversal />}
                    />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/legal" element={<LegalNotice />} />
                    <Route path="/projecte" element={<ProjectPresentation />} />
                    <Route path="/chrome-145" element={<Chrome145Report />} />
                    <Route path="/hub" element={<HubView />} />
                    <Route path="/financament" element={<Financament />} />
                    {/* Fallback 404 Catch-All Route */}
                    <Route path="*" element={<Navigate to="/mur" replace />} />
                  </Routes>
                </div>
              </ErrorBoundary>
            </Suspense>

            {/* [ENCAPSULAMENT v10.33.1] Accessibilitat i Onboarding DINS del main */}
            {isAccessibilitatOpen && (
              <div className="absolute inset-0 !m-0 !p-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
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
                className="absolute bottom-[5.5rem] md:bottom-24 right-4 md:right-8 w-14 h-14 bg-[#0ea5e9] text-white rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center z-[90] hover:scale-110 transition-transform cursor-pointer border-2 border-white/20"
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

      {/* BARRA DE NAVEGACIÓ MÒBIL (BATEGAT v11.3) */}
      <div className="relative z-[3000]">
        <MobileBottomNav />
      </div>

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
        <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-xl md:pl-[280px]">
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

export default AppLayout;
