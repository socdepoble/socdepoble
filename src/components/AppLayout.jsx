import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import NavigationRail from './NavigationRail';
import Navigation from './Navigation';
import { useAuth } from '../context/AuthContext';
import NanoLoader from './NanoLoader';
import ErrorBoundary from './ErrorBoundary';

// Lazy loading de pàgines per a màxima velocitat
const ChatLayout = lazy(() => import('../components/ChatLayout'));
const ChatEmptyState = lazy(() => import('../components/ChatEmptyState'));
const ChatDetail = lazy(() => import('../components/ChatDetail'));
const Feed = lazy(() => import('./Feed'));
const Marketplace = lazy(() => import('./Marketplace'));
const IAIAPage = lazy(() => import('../pages/IAIAPage'));
const Login = lazy(() => import('../pages/Login'));
const UniversalProfile = lazy(() => import('../pages/UniversalProfile'));
const PublicProfile = lazy(() => import('../pages/PublicProfile'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const RescueTool = lazy(() => import('../components/RescueTool'));
const Towns = lazy(() => import('../pages/Towns'));
const TownDetail = lazy(() => import('../pages/TownDetail'));
const ArxiuOr = lazy(() => import('../pages/Archive'));
const CalendariMaster = lazy(() => import('../pages/MasterCalendar'));
const AlbumGlobal = lazy(() => import('../pages/GlobalAssetAlbum'));

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <NanoLoader message="Bategant..." />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

/**
 * 🏺 APP LAYOUT - LA BÍBLIA ESTRUCTURAL v1.21
 * Arquitectura blindada. Sidebar fixa lateral, contingut central bategant.
 */
const AppLayout = () => {
    return (
        <div className="flex h-screen bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden relative">
            {/* 1. SIDEBAR (BÍBLIA: NOMÉS PC) */}
            <aside className="hidden md:flex w-[280px] h-full flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-master)] fixed left-0 top-0 z-50">
                <NavigationRail />
            </aside>

            {/* 2. MAIN AREA */}
            <main className="flex-1 flex flex-col md:ml-[280px] relative min-h-screen overflow-hidden">
                <Header />
                
                <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pb-0 scroll-smooth custom-scrollbar-alzina">
                    <Suspense fallback={<NanoLoader message="Bategant..." />}>
                        <ErrorBoundary>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Navigate to="/mur" replace />} />
                                
                                {/* RUTA DE XAT INSTITUCIONALITZADA */}
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
                                <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                                <Route path="/arxiu" element={<ArxiuOr />} />
                                <Route path="/calendari" element={<CalendariMaster />} />
                                <Route path="/fotos/global" element={<AlbumGlobal />} />
                                <Route path="/nuke" element={<RescueTool />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </ErrorBoundary>
                    </Suspense>
                </div>

                {/* 3. MENÚ INFERIOR (BÍBLIA: NOMÉS MÒBIL) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60]">
                    <Navigation />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
