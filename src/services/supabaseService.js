import { supabase } from '../supabaseClient';
import { ROLES, USER_ROLES } from '../constants';

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
    async getTowns(filters = {}) {
        let query = supabase
            .from('towns')
            .select('*')
            .order('name', { ascending: true });

        if (filters.province) query = query.eq('province', filters.province);
        if (filters.comarca) query = query.eq('comarca', filters.comarca);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async getProvinces() {
        const { data, error } = await supabase
            .from('towns')
            .select('province')
            .not('province', 'is', null)
            .order('province', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.province))];
    },

    async getComarcas(province) {
        const { data, error } = await supabase
            .from('towns')
            .select('comarca')
            .eq('province', province)
            .not('comarca', 'is', null)
            .order('comarca', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.comarca))];
    },

    async searchAllTowns(query) {
        console.log(`[SupabaseService] Performed search for: "${query}"`);
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(`name.ilike.%${query}%,comarca.ilike.%${query}%,province.ilike.%${query}%`)
                .order('name', { ascending: true })
                .limit(20);

            if (error) throw error;
            console.log(`[SupabaseService] Search results for "${query}":`, data?.length || 0);
            return data || [];
        } catch (err) {
            console.error('[SupabaseService] Robust search failed, falling back to simple search:', err);
            const { data } = await supabase
                .from('towns')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(10);
            return data || [];
        }
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
    async getPosts(roleFilter = 'tot', townId = null) {
        console.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}`);
        try {
            let query = supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false }); // Use created_at instead of id

            if (roleFilter !== ROLES.ALL) {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                query = query.eq('town_id', townId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('[SupabaseService] Error in getPosts query:', error);
                throw error;
            }

            console.log(`[SupabaseService] getPosts success: ${data?.length || 0} posts found`);
            return data || [];
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('[SupabaseService] Error in getPosts:', err);
            } else {
                console.error('[SupabaseService] Error fetching posts');
            }
            return [];
        }
    },

    async createPost(postData) {
        // author_user_id is the new standard for RLS
        // author_role is the target category (gent, grup, empresa, oficial)
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                ...postData,
                author_user_id: postData.author_user_id || postData.author_id // Fallback for transition
            }])
            .select();
        if (error) throw error;
        return data[0];
    },

    // Mercado
    async getMarketItems(roleFilter = 'tot', townId = null) {
        let query = supabase
            .from('market_items')
            .select('*')
            .order('id', { ascending: false });

        if (roleFilter !== ROLES.ALL) {
            // Compatibility layer: check both as we migrate
            query = query.or(`author_role.eq.${roleFilter},seller_role.eq.${roleFilter}`);
        }

        if (townId) {
            query = query.eq('town_id', townId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async createMarketItem(itemData) {
        const { data, error } = await supabase
            .from('market_items')
            .insert([{
                ...itemData,
                author_user_id: itemData.author_user_id || itemData.seller_id,
                author_role: itemData.author_role || itemData.seller_role // Compatibility
            }])
            .select();
        if (error) throw error;
        return data[0];
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_id', itemId); // Added missing .eq()
        if (error) throw error;
        return (data || []).map(fav => fav.user_id); // Corrected map property
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
                'INSERT',
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
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log(`[SupabaseService] No profile found for user ${userId}, returning null`);
                    return null;
                }
                throw error;
            }
            return data;
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('[SupabaseService] Error in getProfile:', err);
            } else {
                console.error('[SupabaseService] Error loading profile');
            }
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        // Soporta tanto un ID único como un array de IDs
        const ids = Array.isArray(postIds) ? postIds : [postIds];
        if (ids.length === 0) return [];

        console.log(`[SupabaseService] Fetching connections for ${ids.length} posts`);
        try {
            const { data, error } = await supabase
                .from('post_connections')
                .select('post_id, user_id, tags')
                .in('post_id', ids);

            if (error) {
                // Si la tabla no existe o la columna no existe, fallamos silenciosamente con array vacío
                // para no romper la app mientras se aplica el SQL
                if (error.code === 'PGRST116' || error.code === '42703' || error.code === '42P01') {
                    console.warn('[SupabaseService] post_connections table or tags column missing. Run update SQL.');
                    return [];
                }
                console.error('[SupabaseService] Error fetching post connections:', error);
                return [];
            }
            console.log(`[SupabaseService] getPostConnections success: ${data?.length || 0} connections found`);
            return data || [];
        } catch (err) {
            console.error('[SupabaseService] Unexpected error in getPostConnections:', err);
            return [];
        }
    },

    async getPostUserConnection(postId, userId) {
        const { data, error } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async togglePostConnection(postId, userId, tags = []) {
        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingConnection) {
            // Si pasamos etiquetas explícitas, asumimos que estamos editando la conexión
            if (tags.length > 0 || (tags.length === 0 && existingConnection.tags?.length > 0)) {
                // Si ya había etiquetas y mandamos un array (aunque sea vacío), actualizamos
                // Esto permite que el componente de etiquetas limpie todas las etiquetas sin desconectar
                const { data, error } = await supabase
                    .from('post_connections')
                    .update({ tags })
                    .eq('post_id', postId)
                    .eq('user_id', userId)
                    .select();
                if (error) throw error;
                return { connected: true, tags: data[0].tags };
            } else {
                // Toggle simple sin etiquetas: Desconectar
                await supabase
                    .from('post_connections')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', userId);
                return { connected: false, tags: [] };
            }
        } else {
            // Conectar nuevo
            const { data, error } = await supabase
                .from('post_connections')
                .insert([{
                    post_id: postId,
                    user_id: userId,
                    tags: tags
                }])
                .select();
            if (error) throw error;
            return { connected: true, tags: data[0].tags };
        }
    },

    async getUserTags(userId) {
        const { data, error } = await supabase
            .from('user_tags')
            .select('tag_name')
            .eq('user_id', userId)
            .order('tag_name', { ascending: true });
        if (error) throw error;
        return (data || []).map(t => t.tag_name);
    },

    async addUserTag(userId, tagName) {
        // Normalizar etiqueta
        const name = tagName.trim().toLowerCase();
        if (!name) return null;

        const { data, error } = await supabase
            .from('user_tags')
            .insert([{ user_id: userId, tag_name: name }])
            .select();

        if (error) {
            if (error.code === '23505') return { tag_name: name }; // Ya existe
            throw error;
        }
        return data[0];
    },

    async deleteUserTag(userId, tagName) {
        console.log(`[SupabaseService] Deleting user tag: ${tagName}`);
        const { error } = await supabase
            .from('user_tags')
            .delete()
            .match({ user_id: userId, tag_name: tagName.toLowerCase() });

        if (error) {
            console.error('[SupabaseService] Error deleting user tag:', error);
            throw error;
        }
        return true;
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
        return (data || []).map(item => ({
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
