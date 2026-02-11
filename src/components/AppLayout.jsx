import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import NavigationRail from './NavigationRail';
import { useAuth } from '../context/AuthContext';
import { UIProvider } from '../context/UIContext';
import NanoLoader from './NanoLoader';
import ErrorBoundary from './ErrorBoundary';

// Lazy loading de pàgines per a màxima velocitat
const ChatLayout = lazy(() => import('../components/ChatLayout'));
const ChatEmptyState = lazy(() => import('../components/ChatEmptyState'));
const ChatDetail = lazy(() => import('../components/ChatDetail'));
const Feed = lazy(() => import('../components/Feed'));
const Market = lazy(() => import('../components/Marketplace'));
const Login = lazy(() => import('../pages/Login'));
const UniversalProfile = lazy(() => import('../pages/UniversalProfile'));
const PublicProfile = lazy(() => import('../pages/PublicProfile'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const RescueTool = lazy(() => import('../components/RescueTool'));

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <NanoLoader message="Versió v1.16.12 [MASTER]" />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = () => {
    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
                    {/* SIDEBAR (NOMÉS VISIBLE EN ESCRIPTORI segons Ordre del Mestre) */}
                    <aside className="hidden md:flex w-72 h-full flex-col bg-black border-r border-white/5 fixed left-0 top-0 z-50 overflow-y-auto">
                        <NavigationRail />
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col md:ml-72 relative min-h-screen">
                        <Header />
                        <div className="flex-1 overflow-y-auto pt-24 pb-20 md:pb-0">
                            <Suspense fallback={<NanoLoader message="Bategant..." />}>
                                <ErrorBoundary>
                                    <Routes>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/" element={<Navigate to="/chats" replace />} />
                                        
                                        {/* RUTA DE XAT EINSTITUCIONALITZADA (SPLIT VIEW) */}
                                        <Route path="/chats" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
                                            <Route index element={<ChatEmptyState />} />
                                            <Route path=":id" element={<ChatDetail />} />
                                        </Route>

                                        <Route path="/mur" element={<div className="px-4 md:px-8"><Feed /></div>} />
                                        <Route path="/mercat" element={<div className="px-4 md:px-8"><Market /></div>} />
                                        <Route path="/perfil" element={<ProtectedRoute><div className="px-4 md:px-8"><UniversalProfile /></div></ProtectedRoute>} />
                                        <Route path="/perfil/:id" element={<div className="px-4 md:px-8"><PublicProfile /></div>} />
                                        <Route path="/admin" element={<ProtectedRoute><div className="px-4 md:px-8"><AdminPanel /></div></ProtectedRoute>} />
                                        <Route path="/nuke" element={<RescueTool />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </ErrorBoundary>
                            </Suspense>
                        </div>
                    </main>
                </div>
    );
};

export default AppLayout;
