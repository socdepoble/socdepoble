import { supabase } from './supabaseClient';
import { MOCK_CHATS, MOCK_FEED, MOCK_MARKET_ITEMS } from './data';

async function seedDatabase() {
    console.log('Iniciando carga de datos a Supabase...');

    // 1. Cargar Chats
    const { error: chatsError } = await supabase.from('chats').upsert(
        MOCK_CHATS.map(chat => ({
            id: chat.id,
            name: chat.name,
            last_message: chat.message,
            time: chat.time,
            type: chat.type,
            unread_count: chat.unread
        }))
    );
    if (chatsError) console.error('Error cargando chats:', chatsError);
    else console.log('✅ Chats cargados');

    // 2. Cargar Feed (Muro)
    const { error: feedError } = await supabase.from('posts').upsert(
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
    if (feedError) console.error('Error cargando muro:', feedError);
    else console.log('✅ Muro cargado');

    // 3. Cargar Mercado
    const { error: marketError } = await supabase.from('market_items').upsert(
        MOCK_MARKET_ITEMS.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            seller: item.seller,
            image_url: item.image,
            tag: item.tag
        }))
    );
    if (marketError) console.error('Error cargando mercado:', marketError);
    else console.log('✅ Mercado cargado');

    console.log('Proceso finalizado.');
}

// Para ejecutarlo puedes llamarlo desde un componente temporalmente o mediante un script.
// seedDatabase();
