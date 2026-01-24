import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Layout from './components/Layout';
import UnifiedStatus from './components/UnifiedStatus';

// Lazy loaded components
const ChatList = lazy(() => import('./components/ChatList'));
const ChatDetail = lazy(() => import('./components/ChatDetail'));
const Feed = lazy(() => import('./components/Feed'));
const Market = lazy(() => import('./components/Market'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Towns = lazy(() => import('./pages/Towns'));
const Map = lazy(() => import('./pages/Map'));
const Notifications = lazy(() => import('./pages/Notifications'));
const TownDetail = lazy(() => import('./pages/TownDetail'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const PublicEntity = lazy(() => import('./pages/PublicEntity'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const PlaygroundPortal = lazy(() => import('./pages/PlaygroundPortal'));
const MediaAlbum = lazy(() => import('./pages/MediaAlbum'));
const EntityManagement = lazy(() => import('./pages/EntityManagement'));
const SearchDiscover = lazy(() => import('./pages/SearchDiscover'));
const CommunityDirectory = lazy(() => import('./pages/CommunityDirectory'));
const IAIAPage = lazy(() => import('./pages/IAIAPage'));
import { supabase } from './supabaseClient';
import { MOCK_CHATS, MOCK_FEED, MOCK_MARKET_ITEMS } from './data';
import { useAuth } from './context/AuthContext';
import { useUI } from './context/UIContext';
import { supabaseService } from './services/supabaseService';

// Exponer para depuración en consola solo en desarrollo
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.supabase = supabase;
  window.supabaseService = supabaseService;
}

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregant sessió...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<UnifiedStatus type="loading" />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/playground" element={<PlaygroundPortal />} />

          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Layout />
              </ErrorBoundary>
            }
          >
            <Route index element={<Navigate to="/chats" replace />} />
            <Route
              path="chats"
              element={
                <ProtectedRoute>
                  <ChatList />
                </ProtectedRoute>
              }
            />
            <Route
              path="chats/:id"
              element={
                <ProtectedRoute>
                  <ChatDetail />
                </ProtectedRoute>
              }
            />
            <Route path="mur" element={<Feed />} />
            <Route path="mercat" element={<Market />} />
            <Route
              path="perfil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/@:username" element={<PublicProfile />} />
            <Route path="perfil/:id" element={<PublicProfile />} />
            <Route path="entitat/:id" element={<PublicEntity />} />
            <Route
              path="notificacions"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="fotos"
              element={
                <ProtectedRoute>
                  <MediaAlbum />
                </ProtectedRoute>
              }
            />
            <Route
              path="gestio-entitats"
              element={
                <ProtectedRoute>
                  <EntityManagement />
                </ProtectedRoute>
              }
            />
            <Route path="cerca" element={<SearchDiscover />} />
            <Route path="comunitat" element={<CommunityDirectory />} />
            <Route path="pobles" element={<Towns />} />
            <Route path="pobles/:id" element={<TownDetail />} />
            <Route
              path="mapa"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="iaia" element={<IAIAPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
