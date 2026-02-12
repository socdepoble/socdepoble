import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
const RescueTool = lazy(() => import('../components/RescueTool'));
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
const DirectoriComunitat = lazy(() => import('../pages/CommunityDirectory'));
const Header = lazy(() => import('./Header'));
const AmphoraFAB = lazy(() => import('./AmphoraFAB'));
const CreationHub = lazy(() => import('./CreationHub'));
const AccessibilitatUniversal = lazy(() => import('./AccessibilitatUniversal'));
const ArchitecteView = lazy(() => import('./ArchitecteView'));
const DossierSocis = lazy(() => import('../pages/DossierSocis'));

import BlueprintOverlay from './BlueprintOverlay';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <NanoLoader message="Bategant..." />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = () => {
    const { isDrawerOpen, closeDrawer, architectMode, blueprintMode } = useUI();
    
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
        document.addEventListener('touchstart', fixZoom, { passive: false });
        return () => document.removeEventListener('touchstart', fixZoom);
    }, []);

    return (
        <div className="h-full w-full flex overflow-hidden font-sans bg-black text-white relative">
            
            {/* 0. OVERLAY MÒBIL (Sombra de fondo) */}
            {isDrawerOpen && (
                <div 
                    className="drawer-backdrop md:hidden"
                    onClick={closeDrawer}
                />
            )}

            {/* 0. ACCESSIBILITAT & RESILIÈNCIA (L'ULL DEL MAS) */}
            <Suspense fallback={null}>
                <AccessibilitatUniversal />
            </Suspense>

            {/* 0. MODALE D'EXPLICACIÓ (ARQUITECTE) */}

            {architectMode && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl md:pl-[280px]">
                    <div className="h-full flex flex-col relative animate-slide-up">
                        <Suspense fallback={<NanoLoader message="Obrint el Mapa..." />}>
                            <ArchitecteView />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* 1. SIDEBAR (LA ROCA - 280px) - JUMBO DRAWER */}
            <aside className={`
                sidebar-desktop
                ${isDrawerOpen ? 'drawer-open' : ''}
                md:relative md:translate-x-0 md:block min-w-0 flex-shrink-0
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
            <main className="flex-1 flex flex-col min-w-0 h-full relative bg-black custom-scrollbar">
                {blueprintMode && <div className="pointer-events-none absolute inset-0 z-[50] border-2 border-emerald-500/20" />}
                <Suspense fallback={<NanoLoader message="Bategant..." />}>
                    <ErrorBoundary>
                        <Suspense fallback={<NanoLoader message="Preparant la barra..." />}>
                            {blueprintMode ? (
                                <div className="h-16 shrink-0 z-10 border-b border-white/5">
                                    <BlueprintOverlay label="HEADER_CANONIC" dimensions="64px" color="orange">
                                        <Header />
                                    </BlueprintOverlay>
                                </div>
                            ) : (
                                <Header />
                            )}
                        </Suspense>
                        <div className="flex-1 relative min-w-0 overflow-y-auto custom-scrollbar">
                            {blueprintMode && <BlueprintOverlay label="VIEWPORT_FLEX" dimensions="AUTO" color="cyan" />}
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Navigate to="/chats" replace />} />
                                
                                <Route path="/chats/*" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
                                    <Route index element={<ChatEmptyState />} />
                                    <Route path=":id" element={<ChatDetail />} />
                                </Route>

                                <Route path="/mur" element={<Feed hideHeader={true} />} />
                                <Route path="/mercat" element={<Marketplace hideHeader={true} />} />
                                <Route path="/iaia" element={<IAIAPage />} />
                                <Route path="/pobles" element={<Towns />} />
                                <Route path="/pobles/:id" element={<TownDetail />} />
                                <Route path="/perfil" element={<ProtectedRoute><UniversalProfile /></ProtectedRoute>} />
                                <Route path="/perfil/:id" element={<PublicProfile />} />
                                <Route path="/entitat/:id" element={<PublicEntity />} />
                                
                                <Route path="/mapa" element={<MapaActius />} />
                                <Route path="/search" element={<SearchDiscover />} />
                                <Route path="/ofici" element={<OficiDocumentacio />} />
                                <Route path="/nexus" element={<NexusFlash />} />
                                <Route path="/solatge" element={<SolatgeConsole />} />
                                <Route path="/genesis" element={<GenesisViewer />} />
                                <Route path="/directori" element={<DirectoriComunitat />} />
                                <Route path="/tools/trellat" element={<SolatgeConsole />} />

                                <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                                <Route path="/arxiu" element={<ArxiuOr />} />
                                <Route path="/calendari" element={<CalendariMaster />} />
                                <Route path="/fotos/global" element={<AlbumGlobal />} />
                                <Route path="/nuke" element={<RescueTool />} />
                                <Route path="/dossier" element={<DossierSocis />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                        <Suspense fallback={null}>
                            <AmphoraFAB />
                        </Suspense>
                    </ErrorBoundary>
                </Suspense>
            </main>
        </div>
    );
};

export default AppLayout;
