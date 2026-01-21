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
  useEffect(() => {
    const checkAndSeed = async () => {
      try {
        // Verificar cada tabla individualmente para un seeding más robusto
        const { count: chatCount } = await supabase.from('chats').select('*', { count: 'exact', head: true });
        const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
        const { count: marketCount } = await supabase.from('market_items').select('*', { count: 'exact', head: true });

        let seeded = false;

        if (chatCount === 0) {
          console.log('Seeding Chats...');
          await supabase.from('chats').upsert(
            MOCK_CHATS.map(chat => ({
              id: chat.id,
              name: chat.name,
              last_message: chat.message,
              time: chat.time,
              type: chat.type,
              unread_count: chat.unread
            }))
          );
          seeded = true;
        }

        if (postCount === 0) {
          console.log('Seeding Muro...');
          await supabase.from('posts').upsert(
            MOCK_FEED.map(post => ({
              id: post.id,
              author: post.author,
              author_role: post.authorRole || 'gent',
              content: post.content,
              likes: post.likes || 0,
              comments_count: post.comments || 0,
              connections_count: 0,
              image_url: post.image,
              town_id: post.town_id || null,
              created_at: new Date().toISOString()
            }))
          );
          seeded = true;
        }

        if (marketCount === 0) {
          console.log('Seeding Mercado...');
          await supabase.from('market_items').upsert(
            MOCK_MARKET_ITEMS.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              seller: item.seller,
              image_url: item.image,
              tag: item.tag,
              town_id: item.town_id || null
            }))
          );
          seeded = true;
        }

        if (seeded) {
          console.log('Seeding completat amb èxit.');
          // Ya no recargamos automáticamente para evitar bucles infinitos.
          // El usuario verá los datos en el siguiente renderizado si el estado cambia
          // o puede recargar manualmente si es necesario.
        }
      } catch (error) {
        console.error('Error during seeding process:', error);
      }
    };

    checkAndSeed();
  }, []);

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
          <Route path="notificacions" element={<Notifications />} />
          <Route path="pobles" element={<Towns />} />
          <Route path="pobles/:id" element={<TownDetail />} />
          <Route path="mapa" element={<Map />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
