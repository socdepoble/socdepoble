import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Layout from './components/Layout';
import ChatList from './components/ChatList';
import ChatDetail from './components/ChatDetail';
import Feed from './components/Feed';
import Market from './components/Market';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Towns from './pages/Towns';
import Map from './pages/Map';
import Notifications from './pages/Notifications';
import TownDetail from './pages/TownDetail';
import PublicProfile from './pages/PublicProfile';
import PublicEntity from './pages/PublicEntity';
import AdminPanel from './pages/AdminPanel';
import PlaygroundPortal from './pages/PlaygroundPortal';
import MediaAlbum from './pages/MediaAlbum';
import EntityManagement from './pages/EntityManagement';
import SearchDiscover from './pages/SearchDiscover';
import CommunityDirectory from './pages/CommunityDirectory';
import IAIAPage from './pages/IAIAPage';
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
    </BrowserRouter>
  );
}

export default App;
