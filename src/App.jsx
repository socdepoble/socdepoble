import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ChatList from './components/ChatList';
import ChatDetail from './components/ChatDetail';
import Feed from './components/Feed';
import Market from './components/Market';
import { supabase } from './supabaseClient';
import { MOCK_CHATS, MOCK_FEED, MOCK_MARKET_ITEMS } from './data';

function App() {
  useEffect(() => {
    const checkAndSeed = async () => {
      const { count } = await supabase.from('chats').select('*', { count: 'exact', head: true });

      if (count === 0) {
        console.log('Base de dades buida. Iniciant seeding...');

        // Seed Chats
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

        // Seed Muro
        await supabase.from('posts').upsert(
          MOCK_FEED.map(post => ({
            id: post.id,
            author: post.author,
            avatar_type: post.avatarType,
            content: post.content,
            likes: post.likes,
            comments_count: post.comments,
            image_url: post.image,
            created_at: new Date().toISOString()
          }))
        );

        // Seed Mercado
        await supabase.from('market_items').upsert(
          MOCK_MARKET_ITEMS.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            seller: item.seller,
            image_url: item.image,
            tag: item.tag
          }))
        );

        console.log('Seeding completat!');
        window.location.reload(); // Recargar para ver los cambios
      }
    };

    checkAndSeed();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chats" replace />} />
          <Route path="chats" element={<ChatList />} />
          <Route path="chats/:id" element={<ChatDetail />} />
          <Route path="mur" element={<Feed />} />
          <Route path="mercat" element={<Market />} />
          <Route path="pobles" element={<div className="container"><h1>Pobles</h1><p>Funcionalitat pròximament...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
