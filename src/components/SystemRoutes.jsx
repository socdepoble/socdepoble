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
