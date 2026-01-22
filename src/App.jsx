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
import { supabase } from './supabaseClient';
import { MOCK_CHATS, MOCK_FEED, MOCK_MARKET_ITEMS } from './data';
import { useAppContext } from './context/AppContext';
import { supabaseService } from './services/supabaseService';

// Exponer para depuración en consola
if (typeof window !== 'undefined') {
  window.supabase = supabase;
  window.supabaseService = supabaseService;
}

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

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

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/chats" replace />} />
          <Route path="chats" element={<ChatList />} />
          <Route path="chats/:id" element={<ChatDetail />} />
          <Route path="mur" element={<Feed />} />
          <Route path="mercat" element={<Market />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="perfil/:id" element={<PublicProfile />} />
          <Route path="entitat/:id" element={<PublicEntity />} />
          <Route path="notificacions" element={<Notifications />} />
          <Route path="pobles" element={<Towns />} />
          <Route path="pobles/:id" element={<TownDetail />} />
          <Route path="mapa" element={<Map />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
