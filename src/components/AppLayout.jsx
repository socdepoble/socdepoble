import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationRail from './NavigationRail';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
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

const ArchitecteView = lazy(() => import('../components/ArchitecteView'));

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <NanoLoader message="Bategant..." />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = () => {
    const { isDrawerOpen, closeDrawer, architectMode } = useUI();

    return (
        <div className="h-screen w-screen flex overflow-hidden font-sans bg-black text-white relative">
            
            {/* 0. OVERLAY MÒBIL (Sombra de fondo) */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeDrawer}
                />
            )}

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

            {/* 1. SIDEBAR (LA ROCA - 280px) - RESPONSIVE DRAWER */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r border-gray-800 bg-black
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 
                ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <NavigationRail />
            </aside>

            {/* 2. MAIN VIEWPORT (EL ESCENARIO) */}
            <main className="flex-1 flex overflow-hidden relative bg-black">
                <Suspense fallback={<NanoLoader message="Bategant..." />}>
                    <ErrorBoundary>
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
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
            </main>
        </div>
    );
};

export default AppLayout;
