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
    async getPosts(roleFilter = 'tot') {
        let query = supabase
            .from('posts')
            .select('*')
            .order('id', { ascending: false });

        if (roleFilter !== 'tot') {
            query = query.eq('author_role', roleFilter);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async createPost(postData) {
        // Aseguramos que el post tenga el rol del usuario actual si no se pasa explícitamente
        // (Esto idealmente se hace en backend, pero aquí podemos reforzarlo)
        const { data, error } = await supabase
            .from('posts')
            .insert([postData])
            .select();
        if (error) throw error;
        return data[0];
    },

    // Mercado
    async getMarketItems(roleFilter = 'tot') {
        let query = supabase
            .from('market_items')
            .select('*')
            .order('id', { ascending: false });

        if (roleFilter !== 'tot') {
            query = query.eq('seller_role', roleFilter);
        }

        const { data, error } = await query;
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
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    // Likes
    // Conexiones (Antiguos Likes)
    async getPostConnections(postId) {
        // Obtenemos solo los IDs para saber si YO he conectado
        const { data, error } = await supabase
            .from('post_connections')
            .select('user_id')
            .eq('post_id', postId);
        if (error) throw error;
        return data.map(conn => conn.user_id);
    },

    async togglePostConnection(postId, userId) {
        // Verificar si ya existe la conexión
        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();

        if (existingConnection) {
            // Desconectar (Borrar)
            await supabase
                .from('post_connections')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', userId);

            // Opcional: Borrar también etiquetas privadas asociadas (cascade debería hacerlo, pero por si acaso)

            return { connected: false };
        } else {
            // Conectar (Insertar)
            await supabase
                .from('post_connections')
                .insert([{
                    post_id: postId,
                    user_id: userId
                    // created_at se pone solo
                }]);

            // Aquí en el futuro podríamos insertar las etiquetas privadas iniciales si el usuario eligió alguna

            return { connected: true };
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
    },

    // Multi-Identidad (Phase 6)
    async getUserEntities(userId) {
        // Obtenemos las entidades donde el usuario es miembro
        const { data, error } = await supabase
            .from('entity_members')
            .select(`
                role,
                entities (
                    id,
                    name,
                    type,
                    avatar_url
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;
        // Aplanamos la respuesta
        return data.map(item => ({
            ...item.entities,
            member_role: item.role
        }));
    },

    // Fase 6: Lèxic
    async getLexiconTerms() {
        const { data, error } = await supabase
            .from('lexicon')
            .select('*, towns(name)')
            .order('term', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getDailyWord() {
        // En una app real, esto sería aleatorio o rotativo por fecha.
        // Aquí cogemos uno aleatorio simple.
        const { data, error } = await supabase
            .from('lexicon')
            .select('*');

        if (error) throw error;
        if (!data || data.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    },

    async createLexiconEntry(entryData) {
        const { data, error } = await supabase
            .from('lexicon')
            .insert([entryData])
            .select();
        if (error) throw error;
        return data[0];
    }
};
