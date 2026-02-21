import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import NavigationRail from './NavigationRail';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { Ruler, ScanLine } from 'lucide-react';
import NanoLoader from './NanoLoader';
import ErrorBoundary from './ErrorBoundary';

const ChatLayout = lazy(() => import('../components/ChatLayout'));
const ChatEmptyState = lazy(() => import('../components/ChatEmptyState'));
const ChatDetail = lazy(() => import('../components/ChatDetail'));
const Feed = lazy(() => import('./Feed'));
const Marketplace = lazy(() => import('./Marketplace'));
const ProfileView = lazy(() => import('../pages/ProfileView'));
const Login = lazy(() => import('../pages/Login'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const Towns = lazy(() => import('../pages/Towns'));
const TownDetail = lazy(() => import('../pages/TownDetail'));
const ArxiuOr = lazy(() => import('../pages/Archive'));
const CalendariMaster = lazy(() => import('../pages/MasterCalendar'));
const AlbumGlobal = lazy(() => import('../pages/GlobalAssetAlbum'));
const MapaActius = lazy(() => import('../pages/Map'));
const SearchDiscover = lazy(() => import('../pages/SearchDiscover'));
const OficiDocumentacio = lazy(() => import('../pages/OficiDocumentacio'));
const NexusFlash = lazy(() => import('../pages/NexusFlash'));
const SolatgeConsole = lazy(() => import('../pages/SolatgeConsole'));
const GenesisViewer = lazy(() => import('../pages/GenesisViewer'));
const BuscadorAjudes = lazy(() => import('../pages/BuscadorAjudes'));
const DirectoriComunitat = lazy(() => import('../pages/CommunityDirectory'));
const Header = lazy(() => import('./Header'));
const CreationHub = lazy(() => import('./CreationHub'));
const AccessibilitatUniversal = lazy(() => import('./AccessibilitatUniversal'));
const ArchitecteView = lazy(() => import('./ArchitecteView'));
const DossierSocis = lazy(() => import('../pages/DossierSocis'));
const ResourceDetail = lazy(() => import('../pages/ResourceDetail'));
const InfografiaGallery = lazy(() => import('./Infoteca/InfografiaGallery'));
const ContextualMenu = lazy(() => import('./ContextualMenu'));
const CategoryManager = lazy(() => import('./CategoryManager'));
const ChatManager = lazy(() => import('../pages/ChatManager'));
const Notes = lazy(() => import('../pages/Notes'));
const LegalNotice = lazy(() => import('../pages/LegalNotice.jsx'));
const IAIAChatSidebar = lazy(() => import('./IAIAChatSidebar'));
const ProfilePowerMenu = lazy(() => import('./ProfilePowerMenu'));
const MenuManagementView = lazy(() => import('../pages/MenuManagementView'));
const Utilitats = lazy(() => import('../pages/Utilitats'));
const Chrome145Report = lazy(() => import('../pages/Chrome145Report'));
const HubView = lazy(() => import('../pages/HubView'));
import GlobalFooter from './GlobalFooter';
import MobileBottomNav from './MobileBottomNav';
import ForasterWelcome from './ForasterWelcome';

import BlueprintOverlay from './BlueprintOverlay';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <NanoLoader message="Bategant..." />;
    // [GUEST-FIRST] Allow anonymous access for viewing. Interaction will trigger AuthModal.
    if (!user) return children; 
    return children;
};

const AppLayout = () => {
    const { user } = useAuth();
    const { 
        isDrawerOpen, closeDrawer, architectMode,
        iaiaSidebarOpen, closeIAIASidebar, iaiaSidebarContext,
        isAccessibilitatOpen, setIsAccessibilitatOpen
    } = useUI();
    const location = useLocation();
    
    const [showWelcome, setShowWelcome] = React.useState(false);

    const handleWelcomeDismiss = () => {
        localStorage.setItem('sp_seen_welcome', 'true');
        setShowWelcome(false);
    };

    React.useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('sp_seen_welcome') === 'true';
        if (user?.isAnonymous && !hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, [user?.isAnonymous]);

    // Detect minimal mode (for Mac-style window breakaway)
    const isMinimal = new URLSearchParams(location.search).get('window') === 'true';
    
    // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció forçada de Viewport per a evitar escalat d'escriptori
    React.useEffect(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        } else {
            const meta = document.createElement('meta');
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
        
        // Bloqueig de zoom accidental en inputs (iOS fix)
        const fixZoom = (e) => {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        };
        // [MASTER SCROLL FIX] Ensure passive: true and only attach if needed
        document.addEventListener('touchstart', fixZoom, { passive: true });
        
        // [SCROLL PERSISTENCE] Ensure root body is not jumpy
        document.body.style.overscrollBehaviorY = 'none';
        
        return () => {
            document.removeEventListener('touchstart', fixZoom);
        };
    }, []);

    const path = location.pathname.split("/")[1] || "chats";

    // Mappeig de labels arquitectònics per al Frame Global
    const routeLabels = {
        'chats': 'LIST_COLUMN [FULL_WIDTH]',
        'mur': 'PROMISCUOUS_FEED [VERTICAL]',
        'mercat': 'MERCH_SHEET [GRID_28px]',
        'pobles': 'COMMUNITY_MESH',
        'perfil': 'IDENTITY_TOTEM [V10.26]',
        'entitat': 'OFFICIAL_ENTITY_FRAME',
        'mapa': 'TACTICAL_RADAR_VIEW',
        'ofici': 'OFFICIAL_DOCS_SHEET',
        'arxiu': 'RESOURCE_VAULT',
        'notes': 'SCRATCHPAD_BUFFER',
        'calendari': 'MASTER_CALENDAR_PROTO',
        'ajudes': 'ADVISORY_DOSSIER',
        'gestio-menu': 'DYNAMIC_MENU_OVERRIDE',
        'utilitats': 'UTILITY_HUB_FRAME'
    };

    const currentLabel = routeLabels[path] || 'MAIN_VIEWPORT_FLEX';

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden font-sans bg-theme-base text-theme-text relative max-h-[100dvh]">
            
            {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
            {!isMinimal && (
                <Suspense fallback={<NanoLoader message="Preparant la barra..." />}>
                    <BlueprintOverlay label="HEADER_CANONIC" dimensions="64px" color="orange" className="h-[64px] flex-shrink-0">
                        <Header />
                    </BlueprintOverlay>
                </Suspense>
            )}

            {/* CONTENIDOR PRINCIPAL (SIDEBAR + ESCENARI) */}
            <div className="flex-1 flex overflow-hidden lg:relative">
                {/* 0. OVERLAY MÒBIL (Sombra de fondo) */}
                {isDrawerOpen && (
                    <div 
                        className="drawer-backdrop lg:hidden"
                        onClick={closeDrawer}
                    />
                )}

                {/* 0. ACCESSIBILITAT & RESILIÈNCIA (L'ULL DEL MAS) - INTEGRAT AL VIEWPORT */}
                <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-4">
                    {/* RÀDIO DE POBLE (POC) */}
                    <button 
                        className="w-14 h-14 bg-[#F97316] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white/20"
                        onClick={async () => {
                            const { speechService } = await import('../services/speechService');
                            const { geminiService } = await import('../services/geminiService');
                            const { MOCK_FEED } = await import('../data');
                            
                            // 1. Capturar context (GÈNESI LIGHT)
                            const feedText = MOCK_FEED.slice(0, 3).map(p => p.content).join(' ');
                            
                            // 2. Bategar resum amb Gemini
                            const summary = await geminiService.ask('IAIA', `Fes un resum de pregoner d'un màxim de 30 paraules per a la ràdio del poble sobre això: ${feedText}`);
                            
                            // 3. Parlar!
                            speechService.speak(summary.text || "Bategant les ones del poble...");
                        }}
                        title="Ràdio de Poble"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
                    </button>
                    
                    {/* TRIGGER D'ACCESSIBILITAT (PROTOCOL MESTRE) */}
                    <button 
                         className="w-14 h-14 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white/20"
                         onClick={() => setIsAccessibilitatOpen(true)}
                         title="Accessibilitat Universal"
                    >
                         <span className="text-xl">🖐️</span>
                    </button>
                </div>
                {!isMinimal && (
                    <aside className={`
                        sidebar-desktop h-full
                        ${isDrawerOpen ? 'drawer-open lg:block' : 'hidden lg:block'}
                        lg:relative lg:translate-x-0 min-w-0 flex-shrink-0
                    `}>
                        <BlueprintOverlay label="SIDEBAR_FIXED" dimensions="280px" color="blue" showBackupLink={true}>
                            <NavigationRail />
                        </BlueprintOverlay>
                    </aside>
                )}

                {/* 2. MAIN VIEWPORT (EL ESCENARIO) - HABILITEM SCROLL (TABULA RASA) */}
                <main className={`flex-1 flex flex-col min-w-0 min-h-0 relative bg-theme-base custom-scrollbar ${location.pathname.startsWith('/chats') || location.pathname.startsWith('/gestio-menu') ? 'overflow-hidden' : ''}`}>
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
                                <div className={`flex-1 flex flex-col relative min-w-0 main-viewport custom-scrollbar ${location.pathname.startsWith('/chats') || location.pathname.startsWith('/gestio-menu') ? 'h-full overflow-hidden' : 'min-h-full overflow-y-auto'}`}>
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/chats" replace />} />
                                        <Route path="/pobles" element={<Towns />} />
                                        <Route path="/pobles/:id" element={<TownDetail />} />
                                        
                                        <Route path="/chats/*" element={<ChatLayout />}>
                                            <Route index element={<ChatEmptyState />} />
                                            <Route path=":id" element={<ChatDetail />} />
                                        </Route>

                                        <Route path="/mur" element={<Feed />} />
                                        <Route path="/mercat" element={<Marketplace />} />
                                        <Route path="/iaia" element={<ProfileView />} />
                                        <Route path="/perfil" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
                                        <Route path="/perfil/:id" element={<ProfileView />} />
                                        <Route path="/entitat/:id" element={<ProfileView />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/ajudes" element={<BuscadorAjudes />} />
                                        
                                        <Route path="/mapa" element={<MapaActius />} />
                                        <Route path="/search" element={<SearchDiscover />} />
                                        <Route path="/ofici" element={<OficiDocumentacio />} />
                                        <Route path="/ofici/:id" element={<OficiDocumentacio />} />
                                        <Route path="/buscador-ajudes" element={<BuscadorAjudes />} />
                                        <Route path="/nexus" element={<NexusFlash />} />
                                        <Route path="/solatge" element={<ProtectedRoute><SolatgeConsole /></ProtectedRoute>} />
                                        <Route path="/genesis" element={<GenesisViewer />} />
                                        <Route path="/directori" element={<DirectoriComunitat />} />
                                        <Route path="/tools/trellat" element={<SolatgeConsole />} />
                                        <Route path="/infoteca" element={<InfografiaGallery />} />

                                        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                                        <Route path="/arxiu" element={<ArxiuOr />} />
                                        <Route path="/arxiu/:id" element={<ResourceDetail />} />
                                        <Route path="/calendari" element={<CalendariMaster />} />
                                        <Route path="/fotos/global" element={<AlbumGlobal />} />
                                        <Route path="/dossier" element={<DossierSocis />} />
                                        <Route path="/gestio/categories" element={<CategoryManager />} />
                                        <Route path="/gestio/xats" element={<ProtectedRoute><ChatManager /></ProtectedRoute>} />
                                        <Route path="/gestio-menu" element={<ProtectedRoute><MenuManagementView /></ProtectedRoute>} />
                                        <Route path="/utilitats" element={<Utilitats />} />
                                        <Route path="/accessibilitat" element={<AccessibilitatUniversal />} />
                                        <Route path="/notes" element={<Notes />} />
                                        <Route path="/legal" element={<LegalNotice />} />
                                        <Route path="/chrome-145" element={<Chrome145Report />} />
                                        <Route path="/hub" element={<HubView />} />
                                    </Routes>
                                </div>
                            </ErrorBoundary>
                        </Suspense>

                        {/* [ENCAPSULAMENT v10.33.1] Accessibilitat i Onboarding DINS del main */}
                        {isAccessibilitatOpen && (
                            <div className="absolute inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                                <Suspense fallback={<NanoLoader message="Carregant accessibilitat..." />}>
                                    <AccessibilitatUniversal />
                                </Suspense>
                            </div>
                        )}

                        {showWelcome && (
                            <div className="absolute inset-0 z-[110] bg-black/20 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
                                <ForasterWelcome onStart={handleWelcomeDismiss} />
                            </div>
                        )}
                    </BlueprintOverlay>
                </main>
            </div>

            {/* FOOTER CANÒNIC (AVÍS LEGAL, AUTORIA, ETC.) - BLINDATGE v1.0 */}
            <GlobalFooter />

            {/* BARRA DE NAVEGACIÓ MÒBIL (BATEGAT v11.3) */}
            <MobileBottomNav />

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
                <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-xl lg:pl-[280px]">
                    <div className="h-full flex flex-col relative animate-slide-up">
                        <Suspense fallback={<NanoLoader message="Obrint el Mapa..." />}>
                            <ArchitecteView />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* ONBOARDING FORASTER */}
            {showWelcome && <ForasterWelcome onStart={handleWelcomeDismiss} />}
        </div>
    );
};

export default AppLayout;
