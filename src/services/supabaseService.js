import { supabase } from '../supabaseClient';

export const supabaseService = {
    // Chats
    async getChats() {
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Pueblos
    async getTowns() {
        const { data, error } = await supabase
            .from('towns')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getChatMessages(chatId) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async sendMessage(chatId, text, sender = 'me') {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ chat_id: chatId, text, sender, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
            .select();
        if (error) throw error;

        // Opcional: Actualizar el last_message del chat
        await supabase
            .from('chats')
            .update({ last_message: text, time: 'Ara' })
            .eq('id', chatId);

        return data[0];
    },

    // Feed / Muro
    async getPosts() {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('id', { ascending: false });
        if (error) throw error;
        return data;
    },

    async createPost(postData) {
        const { data, error } = await supabase
            .from('posts')
            .insert([postData])
            .select();
        if (error) throw error;
        return data[0];
    },

    // Mercado
    async getMarketItems() {
        const { data, error } = await supabase
            .from('market_items')
            .select('*')
            .order('id', { ascending: false });
        if (error) throw error;
        return data;
    },

    async createMarketItem(itemData) {
        const { data, error } = await supabase
            .from('market_items')
            .insert([itemData])
            .select();
        if (error) throw error;
        return data[0];
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_id', itemId);
        if (error) throw error;
        return data.map(fav => fav.user_id);
    },

    async toggleMarketFavorite(itemId, userId) {
        const { data: existingFav } = await supabase
            .from('market_favorites')
            .select('*')
            .eq('item_id', itemId)
            .eq('user_id', userId)
            .single();

        if (existingFav) {
            await supabase
                .from('market_favorites')
                .delete()
                .eq('item_id', itemId)
                .eq('user_id', userId);
            return { favorited: false };
        } else {
            await supabase
                .from('market_favorites')
                .insert([{ item_id: itemId, user_id: userId }]);
            return { favorited: true };
        }
    },

    // Suscripciones en tiempo real
    subscribeToMessages(chatId, onNewMessage) {
        return supabase
            .channel(`chat:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {
                    onNewMessage(payload.new);
                }
            )
            .subscribe();
    },

    // Autenticación
    async signUp(email, password, metadata) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getProfile(userId) {
        // ... (lógica existente)
    },

    // Likes
    async getPostLikes(postId) {
        const { data, error } = await supabase
            .from('post_likes')
            .select('user_id')
            .eq('post_id', postId);
        if (error) throw error;
        return data.map(like => like.user_id);
    },

    async togglePostLike(postId, userId) {
        // Verificar si ya existe el like
        const { data: existingLike } = await supabase
            .from('post_likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();

        if (existingLike) {
            // Quitar like
            await supabase
                .from('post_likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', userId);

            // Decrementar contador en post (opcional si usamos count dinámico)
            return { liked: false };
        } else {
            // Añadir like
            await supabase
                .from('post_likes')
                .insert([{ post_id: postId, user_id: userId }]);

            return { liked: true };
        }
    },

    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select();
        if (error) throw error;
        return data[0];
    }
};
