import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import NavigationRail from './NavigationRail';
import { useAuth } from '../context/AuthContext';
import { UIProvider } from '../context/UIContext';
import NanoLoader from './NanoLoader';
import ErrorBoundary from './ErrorBoundary';

// Lazy loading de pàgines per a màxima velocitat
const ChatList = lazy(() => import('../components/ChatList'));
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
    if (loading) return <NanoLoader message="Versió v1.16.6 [MASTER]" />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = () => {
    return (
        <UIProvider>
            <BrowserRouter>
                <div className="flex h-screen bg-black text-white overflow-hidden">
                    {/* SIDEBAR (NOMÉS VISIBLE EN ESCRIPTORI segons Ordre del Mestre) */}
                    <aside className="hidden md:flex w-72 h-full flex-col bg-black border-r border-white/5 fixed left-0 top-0 z-50 overflow-y-auto">
                        <NavigationRail />
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col md:ml-72 relative min-h-screen">
                        <Header />
                        <div className="flex-1 overflow-y-auto pt-24 pb-20 md:pb-0 px-4 md:px-8">
                            <Suspense fallback={<NanoLoader message="Bategant..." />}>
                                <ErrorBoundary>
                                    <Routes>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/" element={<Navigate to="/chats" replace />} />
                                        <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
                                        <Route path="/chats/:id" element={<ProtectedRoute><ChatDetail /></ProtectedRoute>} />
                                        <Route path="/mur" element={<Feed />} />
                                        <Route path="/mercat" element={<Market />} />
                                        <Route path="/perfil" element={<ProtectedRoute><UniversalProfile /></ProtectedRoute>} />
                                        <Route path="/perfil/:id" element={<PublicProfile />} />
                                        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                                        <Route path="/nuke" element={<RescueTool />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </ErrorBoundary>
                            </Suspense>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
        </UIProvider>
    );
};

export default AppLayout;
