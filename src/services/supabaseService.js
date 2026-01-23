import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { DEMO_USER_ID, ROLES, USER_ROLES } from '../constants';

// Cache para detectar columnas disponibles y evitar errores 400 ruidosos
const columnCache = {
    profiles_is_demo: null,
    posts_is_playground: null,
    market_is_playground: null,
    messages_is_ai: null
};

export const supabaseService = {
    // Admin & Seeding
    async getAllPersonas() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        // Personatges extra del Lore (per fer el joc més gran de forma inmediata)
        const lorePersonas = [
            { id: '11111111-1111-4111-a111-000000000001', full_name: 'Vicent Ferris', username: 'vferris', role: 'Fuster', primary_town: 'La Torre de les Maçanes', bio: 'Treballant la fusta amb l\'amor de tres generacions. Artesania de la Torre.', avatar_url: '/images/demo/avatar_man_old.png' },
            { id: '11111111-1111-4111-a111-000000000002', full_name: 'Lucía Belda', username: 'lubelda', role: 'Farmacèutica', primary_town: 'La Torre de les Maçanes', bio: 'Molt més que vendre remeis; cuidant la salut emocional de les nostres veïnes.', avatar_url: '/images/demo/avatar_lucia.png' },
            { id: '11111111-1111-4111-a111-000000000003', full_name: 'Elena Popova', username: 'elenap', role: 'Cuidadora', primary_town: 'La Torre de les Maçanes', bio: 'Vinent de Bulgària, cuidant de la nostra gent gran amb tota la paciència del món.', avatar_url: '/images/demo/avatar_elena.png' },
            { id: '11111111-1111-4111-a111-000000000004', full_name: 'Maria "Mèl"', username: 'mariamel', role: 'Apicultora', primary_town: 'La Torre de les Maçanes', bio: 'Si vols mèl de veritat, puja a la Torre de les Maçanes. Tradició de muntanya.', avatar_url: '/images/demo/avatar_mariamel.png' },
            { id: '11111111-1111-4111-a111-000000000005', full_name: 'Marc Sendra', username: 'marcs', role: 'Ciclisme', primary_town: 'La Torre de les Maçanes', bio: 'Aficionat al ciclisme de muntanya. No hi ha millor port que el de la Carrasqueta.', avatar_url: '/images/demo/avatar_marc.png' },
            { id: '11111111-1111-4111-a111-000000000011', full_name: 'Carla Soriano', username: 'carlas', role: 'Disseny', primary_town: 'Penàguila', bio: 'Dissenyadora gràfica treballant en remot des de Penàguila. Buscant l\'equilibri.', avatar_url: '/images/demo/avatar_carla.png' },
            { id: '11111111-1111-4111-a111-000000000006', full_name: 'Samir Mensah', username: 'samirm', role: 'Camp i Suport', primary_town: 'Muro d\'Alcoi', bio: 'Treballant a la Cooperativa i ajudant al manteniment de les masies. Nova saba.', avatar_url: '/images/demo/avatar_samir.png' },
            { id: '11111111-1111-4111-a111-000000000007', full_name: 'Andreu Soler', username: 'andreus', role: 'Cuina tradicional', primary_town: 'Muro d\'Alcoi', bio: 'Passió per l\'olleta de blat. El secret està en la paciència i el foc lento.', avatar_url: '/images/demo/avatar_man_1.png' },
            { id: '11111111-1111-4111-a111-000000000008', full_name: 'Beatriz Ortega', username: 'beatrizo', role: 'Guia Turística', primary_town: 'Cocentaina', bio: 'Explicant les històries que amaguen les pedres del Palau Comtal.', avatar_url: '/images/demo/avatar_woman_1.png' },
            { id: '11111111-1111-4111-a111-000000000009', full_name: 'Joanet Serra', username: 'joanets', role: 'Fotògraf', primary_town: 'Muro d\'Alcoi', bio: 'Revelant la bellesa quotidiana del Comtat en cada instantània.', avatar_url: '/images/demo/avatar_joanet.png' },
            { id: '11111111-1111-4111-a111-000000000010', full_name: 'Carmen la del Forn', username: 'carmenf', role: 'Fornera', primary_town: 'Relleu', bio: 'El millor pa de llenya de la Marina Baixa, amb recepta de la rebesàvia.', avatar_url: '/images/demo/avatar_carmen.png' },
            { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joan Batiste', username: 'joanb', role: 'Pastor', primary_town: 'Benifallim', bio: 'Les meues cabres i jo coneixem bé la Serra d\'Aitana. Sempre amb el meu gaito.', avatar_url: '/images/demo/avatar_man_old.png' }
        ];

        const dbPersonas = (data || []).filter(p => {
            const isRealUser = p.full_name?.toLowerCase().includes('javi') ||
                p.username?.toLowerCase().includes('javillinares');

            const isLoreCharacter = lorePersonas.some(lp => lp.full_name === p.full_name);
            return !isRealUser && !isLoreCharacter;
        }).map(p => {
            // Aseguramos que siempre tengan un pueblo asignado
            if (!p.primary_town) {
                // Fallback inteligente para perfiles de la DB que puedan estar incompletos
                if (p.username === 'vferris') p.primary_town = 'La Torre de les Maçanes';
                else if (p.username === 'carlas') p.primary_town = 'Penàguila';
                else if (p.username === 'joanets') p.primary_town = 'Muro d\'Alcoi';
                else p.primary_town = 'La Torre de les Maçanes'; // Default para la simulación
            }
            return p;
        });

        // Combinem
        const finalPersonas = [...dbPersonas, ...lorePersonas];

        return finalPersonas.sort((a, b) => a.full_name.localeCompare(b.full_name));
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

        if (!isGuest) {
            query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);
        }

        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            return [];
        }

        // Mapeamos los campos de la vista al formato que esperan los componentes
        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        // FALLBACK RESTAURADOR: Si no hi ha converses a la DB (o si estem en sandbox buit), 
        // mostrem els MOCK_CHATS per "omplir" el disseny com vol el user.
        if (dbConvs.length === 0) {
            const { MOCK_CHATS } = await import('../data');
            const currentParticipantId = userIdOrEntityId || 'me';
            return MOCK_CHATS.map(m => ({
                id: `mock-${m.id}`,
                last_message_content: m.message,
                last_message_at: new Date().toISOString(),
                p1_info: { id: currentParticipantId, name: 'Jo' },
                p2_info: { id: `m${m.id}`, name: m.name, avatar_url: `/images/demo/avatar_${m.id}.png` },
                participant_1_id: currentParticipantId,
                participant_2_id: `m${m.id}`,
                participant_1_type: 'user',
                participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
            }));
        }

        return dbConvs;
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

        // Lógica de Simulación de IA (NPCs / Lore Personas)
        // Busquem si el receptor és una Lore Persona per activar la IA
        const { data: conv } = await supabase
            .from('conversations')
            .select('participant_1_id, participant_2_id')
            .eq('id', messageData.conversationId)
            .single();

        const recipientId = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_id : conv?.participant_1_id;
        const isToLore = recipientId?.startsWith('11111111-1111-4111-a111-');

        if (isToLore || messageData.conversationId.startsWith('c1111000')) {
            this.triggerSimulatedReply({ ...messageData, recipientId });
        }

        return message;
    },

    async triggerSimulatedReply(originalMessage) {
        // Simular pensamiento (1.5s - 4.5s random para que parezca más "humano")
        const delay = 1500 + Math.random() * 3000;

        setTimeout(async () => {
            try {
                const { conversationId, content, senderId } = originalMessage;

                // Obtenemos info del chat para saber quién responde
                const { data: conv } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('id', conversationId)
                    .single();

                if (!conv) return;

                const isP1Sender = conv.participant_1_id === senderId;
                const responderId = isP1Sender ? conv.participant_2_id : conv.participant_1_id;
                const responderType = isP1Sender ? conv.participant_2_type : conv.participant_1_type;

                // Buscamos si es un personaje del Lore para ajustar la personalidad
                const allPersonas = await this.getAllPersonas();
                const persona = allPersonas.find(p => p.id === responderId);

                let reply = "";
                const randomVal = Math.random();

                if (persona) {
                    // Respuestas con personalidad según el Lore
                    if (persona.username === 'vferris') {
                        const vReplies = [
                            "Ie! Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.",
                            "Bona vesprada! Recorda que la fusta vol paciència. T'ho conteste després.",
                            "Això està fet. Si és per a la Torre, compte amb mi!",
                            "Passa't pel taller quan vullgues i ho mirem amb un café de l'avellà."
                        ];
                        reply = vReplies[Math.floor(randomVal * vReplies.length)];
                    } else if (persona.username === 'mariamel') {
                        const mReplies = [
                            "Hola! Les meues abelles estan ara a tope amb el romer. Després parlem!",
                            "Dolç com la mèl! Gràcies pel missatge, ja et dic algo.",
                            "Xe, que bona idea. El poble necessita més gent així.",
                            "Estic per la serra sense cobertura, quan baixe al poble t'ho mire."
                        ];
                        reply = mReplies[Math.floor(randomVal * mReplies.length)];
                    } else if (persona.username === 'elenap') {
                        const eReplies = [
                            "Bon dia. Estic cuidant de la iaia Rosa, té molt poca paciència hui. Et dic algo més tard!",
                            "Sí, d'acord. Jo ajudar en tot el que pugui al poble.",
                            "Xe! Molt bé. Aquí a la Torre la gent és molt bona.",
                            "Tinc molta feina ara, però t'ho agraeixo molt."
                        ];
                        reply = eReplies[Math.floor(randomVal * eReplies.length)];
                    } else if (persona.username === 'joanb') {
                        const jReplies = [
                            "Ieee! Estic dalt l'Aitana amb el ramat. No se sent res per aquí.",
                            "Si vols parlar de veres, vine a Benifallim i ho fem amb un bon gaito.",
                            "Les meues cabres i jo estem d'acord. Bona proposta!",
                            "Buff, la política de despatxos no és per a mi. Millor parlem a la fresca."
                        ];
                        reply = jReplies[Math.floor(randomVal * jReplies.length)];
                    } else {
                        // Genérico para otros personajes del Lore
                        const genericReplies = [
                            "Xe, que bona idea! Gràcies per compartir-ho.",
                            "Ara estic un poc liat, però m'ho apunto i et dic alguna cosa.",
                            "Sóc de Poble som tots, així que compte amb el meu suport!",
                            "Perfecte, ja m'ho dius quan sàpigues algo segur."
                        ];
                        reply = genericReplies[Math.floor(randomVal * genericReplies.length)];
                    }
                } else {
                    reply = "D'acord! Ho tindré en compte. Gràcies pel missatge.";
                }

                // Insertamos el mensaje marcado como IA (con gestión de errores por si la columna no existe aún)
                const payload = {
                    conversation_id: conversationId,
                    sender_id: responderId,
                    sender_entity_id: responderType === 'entity' ? responderId : null,
                    content: reply
                };

                // Solo añadimos is_ai si la caché no dice lo contrario
                if (columnCache.messages_is_ai !== false) {
                    payload.is_ai = true;
                }

                const { error: insError } = await supabase.from('messages').insert([payload]);

                if (insError && insError.code === '42703') { // Undefined column
                    columnCache.messages_is_ai = false;
                    delete payload.is_ai;
                    await supabase.from('messages').insert([payload]);
                } else if (!insError) {
                    columnCache.messages_is_ai = true;
                }

                // Actualizamos la conversación
                await supabase.from('conversations').update({
                    last_message_content: reply,
                    last_message_at: new Date().toISOString()
                }).eq('id', conversationId);

            } catch (err) {
                logger.error('[NPC Simulation] Error:', err);
            }
        }, delay);
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
        logger.log(`[SupabaseService] Performed search for: "${query}"`);
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(`name.ilike.%${query}%,comarca.ilike.%${query}%,province.ilike.%${query}%`)
                .order('name', { ascending: true })
                .limit(20);

            if (error) throw error;
            logger.log(`[SupabaseService] Search results for "${query}":`, data?.length || 0);
            return data || [];
        } catch (err) {
            logger.error('[SupabaseService] Robust search failed, falling back to simple search:', err);
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
    async getPosts(roleFilter = 'tot', townId = null, page = 0, pageSize = 10, isPlayground = false) {
        logger.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}, page: ${page}, playground: ${isPlayground}`);
        try {
            let query = supabase
                .from('posts')
                .select('*, towns!fk_posts_town_uuid(name)', { count: 'exact' });

            // Solo aplicamos is_playground si estamos en playground Y la columna existe
            if (isPlayground && columnCache.posts_is_playground !== false) {
                try {
                    query = query.eq('is_playground', true);
                } catch (e) {
                    columnCache.posts_is_playground = false;
                }
            }

            if (roleFilter !== ROLES.ALL) {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            // FALLBACK RESTAURADOR: Si no hi ha posts a la DB, mostrem els MOCK_FEED
            if ((!data || data.length === 0) && page === 0) {
                const { MOCK_FEED } = await import('../data');
                return { data: MOCK_FEED, count: MOCK_FEED.length };
            }

            return { data: data || [], count: count || 0 };
        } catch (err) {
            // Si el error es falta de columna is_playground, guardamos en cache y reintentamos
            if (err.code === '42703' && isPlayground) {
                columnCache.posts_is_playground = false;
                logger.warn('[SupabaseService] is_playground column missing in posts, retrying without filter');
                const { data, count } = await supabase
                    .from('posts')
                    .select('*, towns!fk_posts_town_uuid(name)', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .range(page * pageSize, (page * pageSize) + pageSize - 1);
                return { data: data || [], count: count || 0 };
            }
            logger.error('[SupabaseService] Error in getPosts:', err);
            return { data: [], count: 0 };
        }
    },

    async createPost(postData, isPlayground = false) {
        const payload = { ...postData };
        if (isPlayground) payload.is_playground = true;

        const { data, error } = await supabase
            .from('posts')
            .insert([payload])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            // Fallback si la columna no existe
            delete payload.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('posts').insert([payload]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
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

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false) {
        try {
            let query = supabase
                .from('market_items')
                .select('*, towns!fk_market_town_uuid(name)', { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground !== false) {
                try {
                    query = query.eq('is_playground', true);
                } catch (e) {
                    columnCache.market_is_playground = false;
                }
            }

            if (categoryFilter !== 'tot') {
                query = query.eq('category_slug', categoryFilter);
            }

            if (townId) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            // FALLBACK RESTAURADOR: Si no hi ha items a la DB, mostrem els MOCK_MARKET_ITEMS
            if ((!data || data.length === 0) && page === 0) {
                const { MOCK_MARKET_ITEMS } = await import('../data');
                return { data: MOCK_MARKET_ITEMS, count: MOCK_MARKET_ITEMS.length };
            }

            return { data: data || [], count: count || 0 };
        } catch (err) {
            if (err.code === '42703' && isPlayground) {
                columnCache.market_is_playground = false;
                logger.warn('[SupabaseService] is_playground column missing in market_items, retrying without filter');
                const { data, count } = await supabase
                    .from('market_items')
                    .select('*, towns!fk_market_town_uuid(name)', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .range(page * pageSize, (page * pageSize) + pageSize - 1);
                return { data: data || [], count: count || 0 };
            }
            throw err;
        }
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        const { data, error } = await supabase
            .from('market_items')
            .insert([payload])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            delete payload.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('market_items').insert([payload]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
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
                    logger.log(`[SupabaseService] No profile found for user ${userId}, returning null`);
                    return null;
                }
                throw error;
            }
            return data;
        } catch (err) {
            if (import.meta.env.DEV) {
                logger.error('[SupabaseService] Error in getProfile:', err);
            } else {
                logger.error('[SupabaseService] Error loading profile');
            }
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        const ids = Array.isArray(postIds) ? postIds : [postIds];
        if (ids.length === 0) return [];

        logger.log(`[SupabaseService] Fetching connections for ${ids.length} posts`);
        try {
            const { data, error } = await supabase
                .from('post_connections')
                .select('post_uuid, user_id, tags')
                .in('post_uuid', ids);

            if (error) {
                if (error.code === 'PGRST116' || error.code === '42703' || error.code === '42P01') {
                    logger.warn('[SupabaseService] post_connections table error. Check schema.');
                    return [];
                }
                logger.error('[SupabaseService] Error fetching post connections:', error);
                return [];
            }
            logger.log(`[SupabaseService] getPostConnections success: ${data?.length || 0} connections found`);
            return data || [];
        } catch (err) {
            logger.error('[SupabaseService] Unexpected error in getPostConnections:', err);
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
        logger.log(`[SupabaseService] Toggling connection for post: ${postId}, tags:`, tags);

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
        logger.log(`[SupabaseService] Deleting user tag: ${tagName}`);
        const { error } = await supabase
            .from('user_tags')
            .delete()
            .match({ user_id: userId, tag_name: tagName.toLowerCase() });

        if (error) {
            logger.error('[SupabaseService] Error deleting user tag:', error);
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
