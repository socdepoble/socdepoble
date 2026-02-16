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
const IAIAPage = lazy(() => import('../pages/IAIAPage'));
const Login = lazy(() => import('../pages/Login'));
const UniversalProfile = lazy(() => import('../pages/UniversalProfile'));
const PublicProfile = lazy(() => import('../pages/PublicProfile'));
const PublicEntity = lazy(() => import('../pages/PublicEntity'));
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
const GhostMemorial = lazy(() => import('../pages/GhostMemorial'));
const InfografiaGallery = lazy(() => import('./Infoteca/InfografiaGallery'));
const ContextualMenu = lazy(() => import('./ContextualMenu'));
const CategoryManager = lazy(() => import('./CategoryManager'));
const ChatManager = lazy(() => import('../pages/ChatManager'));

import BlueprintOverlay from './BlueprintOverlay';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <NanoLoader message="Bategant..." />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = () => {
    const { isDrawerOpen, closeDrawer, architectMode, blueprintMode } = useUI();
    const location = useLocation();
    
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
        // [MASTER SCROLL FIX] Ensure passive: true to not block scroll
        document.addEventListener('touchstart', fixZoom, { passive: true });
        return () => document.removeEventListener('touchstart', fixZoom);
    }, []);

    return (
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden font-sans bg-theme-base text-theme-text relative max-h-[100dvh]">
            
            {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
            <Suspense fallback={<NanoLoader message="Preparant la barra..." />}>
                {blueprintMode ? (
                    <BlueprintOverlay label="HEADER_CANONIC" dimensions="64px" color="orange" className="h-[64px] flex-shrink-0">
                        <Header />
                    </BlueprintOverlay>
                ) : (
                    <Header />
                )}
            </Suspense>

            <div className="flex-1 flex overflow-hidden min-h-0 relative">
                {/* 0. OVERLAY MÒBIL (Sombra de fondo) */}
                {isDrawerOpen && (
                    <div 
                        className="drawer-backdrop lg:hidden"
                        onClick={closeDrawer}
                    />
                )}

                {/* 0. ACCESSIBILITAT & RESILIÈNCIA (L'ULL DEL MAS) */}
                <Suspense fallback={null}>
                    <AccessibilitatUniversal />
                </Suspense>

                {/* 1. SIDEBAR (LA ROCA - 280px) - JUMBO DRAWER */}
                <aside className={`
                    sidebar-desktop
                    ${isDrawerOpen ? 'drawer-open lg:block' : 'hidden lg:block'}
                    lg:relative lg:translate-x-0 min-w-0 flex-shrink-0
                `}>
                    {blueprintMode ? (
                        <BlueprintOverlay label="SIDEBAR_FIXED" dimensions="280px" color="blue" showBackupLink={true}>
                            <NavigationRail />
                        </BlueprintOverlay>
                    ) : (
                        <NavigationRail />
                    )}
                </aside>

                {/* 2. MAIN VIEWPORT (EL ESCENARIO) - HABILITEM SCROLL (TABULA RASA) */}
                <main className={`flex-1 flex flex-col min-w-0 min-h-0 relative bg-theme-base custom-scrollbar ${location.pathname.startsWith('/chats') ? 'overflow-hidden' : ''}`}>
                    <Suspense fallback={null}>
                        <ContextualMenu />
                    </Suspense>
                    
                    {blueprintMode && <div className="pointer-events-none absolute inset-0 z-[50] border-2 border-emerald-500/20" />}
                    <Suspense fallback={<NanoLoader message="Bategant..." />}>
                        <ErrorBoundary>
                            <div className={`flex-1 flex flex-col relative min-w-0 min-h-0 main-viewport h-full custom-scrollbar ${location.pathname.startsWith('/chats') ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                                {blueprintMode && location.pathname.startsWith('/chats') && (
                                    <div className="absolute inset-0 z-[40] pointer-events-none">
                                        <BlueprintOverlay label="VIEWPORT_FLEX" dimensions="AUTO" color="cyan" />
                                    </div>
                                )}
                                <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Navigate to="/chats" replace />} />
                                
                                <Route path="/chats/*" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
                                    <Route index element={<ChatEmptyState />} />
                                    <Route path=":id" element={<ChatDetail />} />
                                </Route>

                                <Route path="/mur" element={<Feed />} />
                                <Route path="/mercat" element={<Marketplace />} />
                                <Route path="/iaia" element={<IAIAPage />} />
                                <Route path="/pobles" element={<Towns />} />
                                <Route path="/pobles/:id" element={<TownDetail />} />
                                <Route path="/perfil" element={<ProtectedRoute><UniversalProfile /></ProtectedRoute>} />
                                <Route path="/perfil/:id" element={<PublicProfile />} />
                                <Route path="/entitat/:id" element={<PublicEntity />} />
                                <Route path="/memorial" element={<GhostMemorial />} />
                                <Route path="/ajudes" element={<BuscadorAjudes />} />
                                
                                <Route path="/mapa" element={<MapaActius />} />
                                <Route path="/search" element={<SearchDiscover />} />
                                <Route path="/ofici" element={<OficiDocumentacio />} />
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
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </ErrorBoundary>
                </Suspense>
                </main>
            </div>

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
        </div>
    );
};

export default AppLayout;
