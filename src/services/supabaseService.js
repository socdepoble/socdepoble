import { supabase } from '../supabaseClient';
import { DEMO_USER_ID } from '../constants';
import { ROLES, USER_ROLES } from '../constants';

export const supabaseService = {
    // Admin & Seeding
    async getAllPersonas() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getAdminEntities() {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Chats (Secure Messaging - Phase 4)
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        // Usamos la vista enriquecida que ya trae nombres y avatares directamente (Optimización Auditoría V3)
        let query = supabase.from('view_conversations_enriched').select('*');

        if (isGuest) {
            query = query.eq('is_demo', true);
        } else {
            query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId},is_demo.eq.true`);
        }

        const { data: convs, error } = await query.order('last_message_at', { ascending: false });
        if (error) throw error;
        if (!convs) return [];

        // Mapeamos los campos de la vista al formato que esperan los componentes (Retrocompatibilidad Auditoría V3)
        return convs.map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));
    },

    async getConversationMessages(conversationId) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async sendSecureMessage(messageData) {
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                sender_entity_id: messageData.senderEntityId || null,
                content: messageData.content
            }])
            .select();

        if (error) throw error;

        const message = data[0];

        // Actualizar el resumen en la conversación
        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        // Lógica de Simulación de IA (NPCs)
        // Disparamos si es el rango de demo O si tiene el flag is_demo (más robusto)
        const { data: convCheck } = await supabase.from('conversations').select('is_demo').eq('id', messageData.conversationId).single();

        if (messageData.conversationId.startsWith('c1111000') || convCheck?.is_demo) {
            this.triggerSimulatedReply(messageData);
        }

        return message;
    },

    async triggerSimulatedReply(originalMessage) {
        // Simular pensamiento (2.5s)
        setTimeout(async () => {
            try {
                const { conversationId, content, senderId } = originalMessage;
                const { data: conv } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('id', conversationId)
                    .single();

                if (!conv) return;

                const isP1Sender = conv.participant_1_id === senderId;
                const responderId = isP1Sender ? conv.participant_2_id : conv.participant_1_id;
                const responderType = isP1Sender ? conv.participant_2_type : conv.participant_1_type;

                const replies = [
                    "Ie! Moltes gràcies pel missatge, ho tindré en compte. Broadway",
                    "Bon dia! Me'n vaig ara a l'hort, però después t'ho mire. Broadway",
                    "Clar que sí, ens veiem per la plaça i ho parlem. Broadway",
                    "Això està fet. Sóc de Poble és el millor que ens ha passat! Broadway",
                    "Ho sento, ara estic un poc liat amb la faena, et dic algo de seguida. Broadway",
                    "Xe, que bona idea! Parlem-ne demà. Broadway",
                    "Perfecte, ja m'ho dius quan sàpigues algo. Broadway",
                    "No te preocupes, ja ho arreglem nosaltres. Broadway",
                    "Això és de categoria! Molt bé. Broadway",
                    "Ostres, no ho sabia. Gràcies per avisar! Broadway"
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];

                await supabase.from('messages').insert([{
                    conversation_id: conversationId,
                    sender_id: responderId,
                    sender_entity_id: responderType === 'entity' ? responderId : null,
                    content: randomReply
                }]);

                await supabase.from('conversations').update({
                    last_message_content: randomReply,
                    last_message_at: new Date().toISOString()
                }).eq('id', conversationId);
            } catch (err) {
                console.error('[NPC Simulation] Error:', err);
            }
        }, 2500);
    },

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type) {
        // Buscar si ya existe la combinación (en cualquier orden)
        const { data: existing } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1_id.eq.${p1Id},participant_2_id.eq.${p2Id}),and(participant_1_id.eq.${p2Id},participant_2_id.eq.${p1Id})`)
            .maybeSingle();

        if (existing) return existing;

        // Crear nueva si no existe
        const { data, error } = await supabase
            .from('conversations')
            .insert([{
                participant_1_id: p1Id,
                participant_1_type: p1Type,
                participant_2_id: p2Id,
                participant_2_type: p2Type
            }])
            .select();

        if (error) throw error;
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        const { error } = await supabase.rpc('mark_messages_as_read', {
            conv_id: conversationId,
            user_id: userId
        });
        if (error) throw error;
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

    async getChatMessagesLegacy(chatId) {
        const { data, error } = await supabase
            .from('legacy_messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Feed / Muro
    async getPosts(roleFilter = 'tot', townId = null) {
        console.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}`);
        try {
            let query = supabase
                .from('posts')
                .select('*, towns!fk_posts_town_uuid(name)')
                .order('created_at', { ascending: false }); // Use created_at instead of id

            if (roleFilter !== ROLES.ALL) {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                // Asumimos UUID como estándar (Migración Fase 2 completa)
                query = query.eq('town_uuid', townId);
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
    async getMarketCategories() {
        const { data, error } = await supabase
            .from('market_categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getMarketItems(categoryFilter = 'tot', townId = null) {
        let query = supabase
            .from('market_items')
            .select('*, towns!fk_market_town_uuid(name)')
            .order('created_at', { ascending: false });

        if (categoryFilter !== 'tot') {
            query = query.eq('category_slug', categoryFilter);
        }

        if (townId) {
            const isUuid = typeof townId === 'string' && townId.includes('-');
            query = query.eq(isUuid ? 'town_uuid' : 'town_id', townId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async createMarketItem(itemData) {
        const { data, error } = await supabase
            .from('market_items')
            .insert([{
                ...itemData,
                category_slug: itemData.category_slug || itemData.tag || 'tot',
                author_user_id: itemData.author_user_id || itemData.seller_id,
                author_role: itemData.author_role || itemData.seller_role, // Compatibility
                seller_entity_id: itemData.author_entity_id || itemData.seller_entity_id // Internal mapping
            }])
            .select();
        if (error) throw error;
        return data[0];
    },
    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_uuid', itemId);
        if (error) throw error;
        return (data || []).map(fav => fav.user_id);
    },

    async toggleMarketFavorite(itemId, userId) {
        const { data: existingFav } = await supabase
            .from('market_favorites')
            .select('*')
            .eq('item_uuid', itemId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingFav) {
            await supabase
                .from('market_favorites')
                .delete()
                .eq('item_uuid', itemId)
                .eq('user_id', userId);
            return { favorited: false };
        } else {
            await supabase
                .from('market_favorites')
                .insert([{ item_uuid: itemId, user_id: userId }]);
            return { favorited: true };
        }
    },

    // Suscripciones en tiempo real y Presencia
    subscribeToConversation(conversationId, options = {}) {
        const { onNewMessage, onMessageUpdate } = options;

        const channel = supabase.channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to inserts and updates (read status)
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' && onNewMessage) onNewMessage(payload.new);
                    if (payload.eventType === 'UPDATE' && onMessageUpdate) onMessageUpdate(payload.new);
                }
            );

        return channel.subscribe();
    },

    subscribeToPresence(conversationId, userId, onSync) {
        const channel = supabase.channel(`presence:${conversationId}`, {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                onSync(state);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        is_typing: false
                    });
                }
            });

        return channel;
    },

    async updatePresenceTyping(channel, isTyping) {
        if (!channel) return;
        return channel.track({
            online_at: new Date().toISOString(),
            is_typing: isTyping
        });
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
        const ids = Array.isArray(postIds) ? postIds : [postIds];
        if (ids.length === 0) return [];

        console.log(`[SupabaseService] Fetching connections for ${ids.length} posts`);
        try {
            const { data, error } = await supabase
                .from('post_connections')
                .select('post_id, post_uuid, user_id, tags')
                .in('post_uuid', ids);

            if (error) {
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
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async togglePostConnection(postId, userId, tags = []) {
        console.log(`[SupabaseService] Toggling connection for post: ${postId}, tags:`, tags);

        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingConnection) {
            if (tags.length > 0 || (tags.length === 0 && existingConnection.tags?.length > 0)) {
                const { data, error } = await supabase
                    .from('post_connections')
                    .update({ tags })
                    .eq('post_uuid', postId)
                    .eq('user_id', userId)
                    .select();
                if (error) throw error;
                return { connected: true, tags: data[0].tags };
            } else {
                await supabase
                    .from('post_connections')
                    .delete()
                    .eq('post_uuid', postId)
                    .eq('user_id', userId);
                return { connected: false, tags: [] };
            }
        } else {
            const { data, error } = await supabase
                .from('post_connections')
                .insert([{
                    post_uuid: postId,
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

    // Fase 6: Páginas Públicas y Gestión de Entidades
    async getPublicProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async getPublicEntity(entityId) {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .single();
        if (error) throw error;
        return data;
    },

    async getEntityMembers(entityId) {
        const { data, error } = await supabase
            .from('entity_members')
            .select('user_id, role, profiles(full_name, avatar_url)')
            .eq('entity_id', entityId);
        if (error) throw error;
        return data;
    },

    async getUserPosts(userId) {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('author_user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getEntityPosts(entityId) {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('author_entity_id', entityId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getUserMarketItems(userId) {
        const { data, error } = await supabase
            .from('market_items')
            .select('*, towns!fk_market_town_uuid(name)')
            .eq('author_user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getEntityMarketItems(entityId) {
        const { data, error } = await supabase
            .from('market_items')
            .select('*, towns!fk_market_town_uuid(name)')
            .eq('author_entity_id', entityId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
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
