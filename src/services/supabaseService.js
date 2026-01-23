import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { DEMO_USER_ID, ROLES, USER_ROLES, ENABLE_MOCKS } from '../constants';
import { PostSchema, MarketItemSchema, MessageSchema, ProfileSchema } from './schemas';

/**
 * Sanitizes input strings to prevent common injection patterns 
 * and remove potentially dangerous characters.
 */
const sanitizeInput = (text) => {
    if (typeof text !== 'string') return '';
    // Remove characters often used in SQL injection or HTML injection
    // Keep letters (any lang), numbers, spaces and common punctuation
    return text.replace(/[<>{}[\]\\^`|%'"?]/g, '').trim();
};

// Cache para detectar columnas disponibles y evitar errores 400 ruidosos
// Usamos localStorage para persistir y que solo falle una vez "en la vida" del usuario
const columnCache = {
    profiles_is_demo: localStorage.getItem('cp_profiles_is_demo') === 'true' ? true : (localStorage.getItem('cp_profiles_is_demo') === 'false' ? false : null),
    posts_is_playground: localStorage.getItem('cp_posts_is_playground') === 'true' ? true : (localStorage.getItem('cp_posts_is_playground') === 'false' ? false : null),
    market_is_playground: localStorage.getItem('cp_market_is_playground') === 'true' ? true : (localStorage.getItem('cp_market_is_playground') === 'false' ? false : null),
    messages_is_ai: localStorage.getItem('cp_messages_is_ai') === 'true' ? true : (localStorage.getItem('cp_messages_is_ai') === 'false' ? false : null)
};

const setColumnCache = (key, value) => {
    columnCache[key] = value;
    localStorage.setItem(`cp_${key}`, value);
};

// Promesas activas para evitar ráfagas de errores 400 en paralelo
const activeChecks = {
    posts: null,
    market: null
};

/**
 * Centralized logic to detect if a profile is fictive (Lore or Demo)
 */
export const isFictiveProfile = (profile) => {
    if (!profile) return false;
    // Order of priority: ID prefix (Lore) then explicit flag (Demo)
    return profile.id?.startsWith('11111111-') || profile.is_demo === true;
};

export const supabaseService = {
    // Admin & Seeding
    async getAllPersonas(isPlayground = false) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        // Personatges extra del Lore (per fer el joc més gran de forma inmediata)
        const lorePersonas = [
            { id: '11111111-0000-0000-0000-000000000001', full_name: 'Vicent Ferris', username: 'vferris', role: 'Fuster', primary_town: 'La Torre de les Maçanes', bio: 'Treballant la fusta amb l\'amor de tres generacions. Artesania de la Torre.', avatar_url: '/images/demo/avatar_man_old.png', cover_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000002', full_name: 'Lucía Belda', username: 'lubelda', role: 'Farmacèutica', primary_town: 'La Torre de les Maçanes', bio: 'Molt més que vendre remeis; cuidant la salut emocional de les nostres veïnes.', avatar_url: '/images/demo/avatar_lucia.png', cover_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000003', full_name: 'Elena Popova', username: 'elenap', role: 'Cuidadora', primary_town: 'La Torre de les Maçanes', bio: 'Vinent de Bulgària, cuidant de la nostra gent gran amb tota la paciència del món.', avatar_url: '/images/demo/avatar_elena.png', cover_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', category: 'gent', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000004', full_name: 'Maria "Mèl"', username: 'mariamel', role: 'Apicultora', primary_town: 'La Torre de les Maçanes', bio: 'Si vols mèl de veritat, puja a la Torre de les Maçanes. Tradició de muntanya.', avatar_url: '/images/demo/avatar_mariamel.png', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000005', full_name: 'Marc Sendra', username: 'marcs', role: 'Ciclisme', primary_town: 'La Torre de les Maçanes', bio: 'Aficionat al ciclisme de muntanya. No hi ha millor port que el de la Carrasqueta.', avatar_url: '/images/demo/avatar_marc.png', category: 'grup', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000011', full_name: 'Carla Soriano', username: 'carlas', role: 'Disseny', primary_town: 'Penàguila', bio: 'Dissenyadora gràfica treballant en remot des de Penàguila. Buscant l\'equilibri.', avatar_url: '/images/demo/avatar_carla.png', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000006', full_name: 'Samir Mensah', username: 'samirm', role: 'Camp i Suport', primary_town: 'Muro d\'Alcoi', bio: 'Treballant a la Cooperativa i ajudant al manteniment de les masies. Nova saba.', avatar_url: '/images/demo/avatar_samir.png', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000007', full_name: 'Andreu Soler', username: 'andreus', role: 'Cuina tradicional', primary_town: 'Muro d\'Alcoi', bio: 'Passió per l\'olleta de blat. El secret està en la paciència i el foc lento.', avatar_url: '/images/demo/avatar_man_1.png', cover_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop', category: 'gent', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000008', full_name: 'Beatriz Ortega', username: 'beatrizo', role: 'Guia Turística', primary_town: 'Cocentaina', bio: 'Explicant les històries que amaguen les pedres del Palau Comtal.', avatar_url: '/images/demo/avatar_woman_1.png', cover_url: 'https://images.unsplash.com/photo-1549412639-66172551000f?q=80&w=2070&auto=format&fit=crop', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000009', full_name: 'Joanet Serra', username: 'joanets', role: 'Fotògraf', primary_town: 'Muro d\'Alcoi', bio: 'Revelant la bellesa quotidiana del Comtat en cada instantània.', avatar_url: '/images/demo/avatar_joanet.png', cover_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1952&auto=format&fit=crop', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000010', full_name: 'Carmen la del Forn', username: 'carmenf', role: 'Fornera', primary_town: 'Relleu', bio: 'El millor pa de llenya de la Marina Baixa, amb recepta de la rebesàvia.', avatar_url: '/images/demo/avatar_carmen.png', cover_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop', category: 'treball', type: 'person' },
            { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joan Batiste', username: 'joanb', role: 'Pastor', primary_town: 'Benifallim', bio: 'Les meues cabres i jo coneixem bé la Serra d\'Aitana. Sempre amb el meu gaito.', avatar_url: '/images/demo/avatar_man_old.png', cover_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop', category: 'gent', type: 'person' }
        ];

        const dbPersonas = (data || []).filter(p => {
            const isRealUser = p.is_demo === false ||
                p.full_name?.toLowerCase().includes('javi') ||
                p.username?.toLowerCase().includes('javillinares') ||
                p.email?.toLowerCase().includes('socdepoblecom');

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
        const mergedPersonas = [...dbPersonas, ...lorePersonas];

        // Lògica de Sincronització de Producció:
        if (!isPlayground) {
            // A producció volem:
            // 1. Persones Reals (de la DB, no demo)
            // 2. IAIAs/Lore Personatges si són de tipus 'person' (humanes)
            // BLOQUEGEM: Entitats fictícies (negocis, grups ficticis)
            return mergedPersonas.filter(p => {
                const fictive = isFictiveProfile(p);
                const isHuman = p.type === 'person' || p.type === 'user';

                if (fictive) {
                    return isHuman; // Només si és humà (IAIA)
                }
                return true; // Perfils reals sempre OK
            }).sort((a, b) => a.full_name.localeCompare(b.full_name));
        }

        return mergedPersonas.sort((a, b) => a.full_name.localeCompare(b.full_name));
    },

    async getAdminEntities(isPlayground = false) {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        if (!data) return [];

        // En producció filtrem les entitats fictícies (demo o Lore-based)
        if (!isPlayground) {
            return data.filter(e => !isFictiveProfile(e));
        }

        return data;
    },

    // Chats (Secure Messaging - Phase 4)
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdOrEntityId))) {
            // Bypass DB for guest or invalid UUID (mock user)
            const { MOCK_CHATS } = await import('../data');
            const currentParticipantId = userIdOrEntityId || 'me';
            return MOCK_CHATS.map(m => ({
                id: `mock-${m.id}`,
                last_message_content: m.message,
                last_message_at: new Date().toISOString(),
                p1_info: { id: currentParticipantId, name: 'Jo' },
                p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                participant_1_id: currentParticipantId,
                participant_2_id: `m${m.id}`,
                participant_1_type: 'user',
                participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
            }));
        }

        // Usamos la vista enriquecida que ya trae nombres y avatares directamente (Optimización Auditoría V3)
        let query = supabase.from('view_conversations_enriched').select(`
            id, 
            participant_1_id, 
            participant_2_id, 
            participant_1_type, 
            participant_2_type, 
            last_message_content, 
            last_message_at, 
            p1_name, 
            p1_avatar_url, 
            p1_role,
            p1_is_ai,
            p2_name, 
            p2_avatar_url,
            p2_role,
            p2_is_ai
        `);

        query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);

        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            // Si hay error (posiblemente la vista no existe aún), devolvemos vacío o mocks si habilitado
            if (ENABLE_MOCKS) {
                const { MOCK_CHATS } = await import('../data');
                const currentParticipantId = userIdOrEntityId || 'me';
                return MOCK_CHATS.map(m => ({
                    id: `mock-${m.id}`,
                    last_message_content: m.message,
                    last_message_at: new Date().toISOString(),
                    p1_info: { id: currentParticipantId, name: 'Jo' },
                    p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                    participant_1_id: currentParticipantId,
                    participant_2_id: `m${m.id}`,
                    participant_1_type: 'user',
                    participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
                }));
            }
            return [];
        }

        // Mapeamos los campos de la vista al formato que esperan los componentes
        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        return dbConvs;
    },

    async getConversationMessages(conversationId) {
        if (conversationId?.startsWith('mock-')) {
            try {
                const mockIdx = conversationId.split('-')[1];
                const { MOCK_MESSAGES } = await import('../data');
                const messages = MOCK_MESSAGES[mockIdx] || [];
                return messages.map(m => ({
                    id: `msg-mock-${m.id}`,
                    conversation_id: conversationId,
                    sender_id: m.sender === 'me' ? 'me' : 'other', // En la UI lo gestionamos
                    content: m.text,
                    created_at: new Date().toISOString(),
                    is_ai: false
                }));
            } catch (err) {
                logger.error('Error loading mock messages:', err);
                return [];
            }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async sendSecureMessage(messageData) {
        if (messageData.conversationId?.startsWith('mock-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation');
            return {
                id: `msg-sent-${Date.now()}`,
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString()
            };
        }

        // Validació estructural amb Zod
        const validated = MessageSchema.parse({
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,
            sender_entity_id: messageData.senderEntityId || null,
            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null
        });

        const { data, error } = await supabase
            .from('messages')
            .insert([validated])
            .select();

        if (error) throw error;

        const message = data[0];

        // Actualizar el resumen en la conversación
        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
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
        if (conversationId?.startsWith('mock-')) return;

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
        const sanitizedQuery = sanitizeInput(query);
        if (!sanitizedQuery || sanitizedQuery.length < 2) return [];

        logger.log(`[SupabaseService] Performed search for: "${sanitizedQuery}"`);
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(`name.ilike.%${sanitizedQuery}%,comarca.ilike.%${sanitizedQuery}%,province.ilike.%${sanitizedQuery}%`)
                .order('name', { ascending: true })
                .limit(20);

            if (error) throw error;
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

    async searchProfiles(query) {
        if (!query || query.length < 2) return [];
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, town_name, bio')
                .or(`full_name.ilike.%${query}%,username.ilike.%${query}%,role.ilike.%${query}%,town_name.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;

            // Include lore personas in search
            const allPersonas = await this.getAllPersonas();
            const filteredLore = allPersonas.filter(p =>
                p.full_name?.toLowerCase().includes(query.toLowerCase()) ||
                p.username?.toLowerCase().includes(query.toLowerCase()) ||
                p.role?.toLowerCase().includes(query.toLowerCase()) ||
                p.primary_town?.toLowerCase().includes(query.toLowerCase())
            );

            // Merge and deduplicate by full_name
            const combined = [...(data || []), ...filteredLore];
            const unique = [];
            const names = new Set();
            combined.forEach(p => {
                const name = p.full_name?.toLowerCase();
                if (!names.has(name)) {
                    names.add(name);
                    // Normalize town field
                    const normalized = {
                        ...p,
                        town_name: p.town_name || p.primary_town
                    };
                    unique.push(normalized);
                }
            });

            return unique;
        } catch (error) {
            logger.error('[SupabaseService] Error in searchProfiles:', error);
            return [];
        }
    },

    async searchEntities(query) {
        if (!query || query.length < 2) return [];
        try {
            const { data, error } = await supabase
                .from('entities')
                .select('id, name, type, avatar_url, town_name, description')
                .or(`name.ilike.%${query}%,type.ilike.%${query}%,town_name.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;

            // Include mock entities for Sandbox feel
            const mockEntities = [
                { id: 'm1', name: 'Ajuntament de la Torre', type: 'oficial', town_name: 'La Torre de les Maçanes', description: 'Administració local i serveis al ciutadà.' },
                { id: 'm2', name: 'Cooperativa de Muro', type: 'empresa', town_name: 'Muro d\'Alcoi', description: 'Oli d\'oliva verge extra de la serra Mariola.' },
                { id: 'm3', name: 'Centre Excursionista d\'Alcoi', type: 'grup', town_name: 'Alcoi', description: 'Rutes i activitats de muntanya per a tots.' },
                { id: 'm4', name: 'Forn del Barri', type: 'empresa', town_name: 'La Torre de les Maçanes', description: 'Pa de llenya i coques tradicionals.' }
            ];

            const filteredMock = mockEntities.filter(e =>
                e.name.toLowerCase().includes(query.toLowerCase()) ||
                e.type.toLowerCase().includes(query.toLowerCase()) ||
                e.town_name.toLowerCase().includes(query.toLowerCase())
            );

            return [...(data || []), ...filteredMock];
        } catch (error) {
            logger.error('[SupabaseService] Error in searchEntities:', error);
            return [];
        }
    },

    async getPublicDirectory() {
        try {
            const [profiles, entities] = await Promise.all([
                this.getAllPersonas(),
                this.getAdminEntities()
            ]);

            return {
                people: profiles || [],
                entities: entities || []
            };
        } catch (error) {
            logger.error('[SupabaseService] Error in getPublicDirectory:', error);
            return { people: [], entities: [] };
        }
    },

    async connectWithProfile(followerId, targetId) {
        if (!followerId || !targetId) return false;
        try {
            const { error } = await supabase
                .from('connections')
                .upsert({
                    follower_id: followerId,
                    target_id: targetId,
                    status: 'connected',
                    created_at: new Date().toISOString()
                }, { onConflict: 'follower_id,target_id' });

            if (error) {
                if (error.code === '42P01') {
                    logger.warn('[SupabaseService] connections table missing, simulating connection');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error connecting:', error);
            return false;
        }
    },

    async disconnectFromProfile(followerId, targetId) {
        try {
            const { error } = await supabase
                .from('connections')
                .delete()
                .eq('follower_id', followerId)
                .eq('target_id', targetId);

            if (error) throw error;
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error disconnecting:', error);
            return false;
        }
    },

    async isFollowing(followerId, targetId) {
        if (!followerId || !targetId) return false;
        try {
            const { data, error } = await supabase
                .from('connections')
                .select('*')
                .eq('follower_id', followerId)
                .eq('target_id', targetId)
                .maybeSingle();

            if (error) {
                if (error.code === '42P01') return false;
                throw error;
            }
            return !!data;
        } catch (error) {
            return false;
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
                .select('id, uuid:id, content, created_at, author_id, author:author_name, author_avatar:author_avatar_url, image_url, author_role, is_playground, entity_id, towns!fk_posts_town_uuid(name)', { count: 'exact' });

            // Si no sabemos si la columna existe, hacemos una comprobación SILENCIOSA (select *)
            if (isPlayground && columnCache.posts_is_playground === null) {
                if (!activeChecks.posts) {
                    activeChecks.posts = (async () => {
                        try {
                            // Usar select('*') no falla si falta una columna específica, es silencioso
                            const { data, error } = await supabase.from('posts').select('*').limit(1);
                            if (error) throw error;
                            if (data && data.length > 0) {
                                setColumnCache('posts_is_playground', 'is_playground' in data[0]);
                            } else {
                                // Si no hay datos, no podemos saberlo seguro sin arriesgar un 400.
                                // Lo dejamos en null para que el catch del fetch principal lo decida.
                            }
                        } catch (e) {
                            // Si falla el select * es un error mayor, pero no de columna faltante
                        } finally {
                            activeChecks.posts = null;
                        }
                    })();
                }
                await activeChecks.posts;
            }

            if (isPlayground && columnCache.posts_is_playground !== false) {
                query = query.eq('is_playground', true);
            }

            if (roleFilter && roleFilter !== ROLES.ALL && roleFilter !== 'tot') {
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

            if (error) {
                if (error.code === '42703' && isPlayground) {
                    setColumnCache('posts_is_playground', false);
                    logger.warn('[SupabaseService] is_playground missing in posts, retrying silent...');
                    return this.getPosts(roleFilter, townId, page, pageSize, false);
                }
                throw error;
            }

            // FALLBACK RESTAURADOR: Si no hi ha posts a la DB, mostrem els MOCK_FEED
            if ((!data || data.length === 0) && page === 0 && ENABLE_MOCKS) {
                const { MOCK_FEED } = await import('../data');
                return { data: MOCK_FEED, count: MOCK_FEED.length };
            }

            return { data: data || [], count: count || 0 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getPosts:', err);
            return { data: [], count: 0 };
        }
    },

    async createPost(postData, isPlayground = false) {
        const payload = { ...postData };
        if (isPlayground) payload.is_playground = true;

        // Validació estructural amb Zod
        const validated = PostSchema.parse(payload);

        const { data, error } = await supabase
            .from('posts')
            .insert([validated])
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
                .select('id, uuid:id, title, description, price, category_slug, created_at, author_id, seller:author_name, avatar_url:author_avatar_url, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)', { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground === null) {
                if (!activeChecks.market) {
                    activeChecks.market = (async () => {
                        try {
                            const { data, error } = await supabase.from('market_items').select('*').limit(1);
                            if (error) throw error;
                            if (data && data.length > 0) {
                                setColumnCache('market_is_playground', 'is_playground' in data[0]);
                            }
                        } catch (e) {
                            // Silence
                        } finally {
                            activeChecks.market = null;
                        }
                    })();
                }
                await activeChecks.market;
            }

            if (isPlayground && columnCache.market_is_playground !== false) {
                query = query.eq('is_playground', true);
            }

            if (categoryFilter && categoryFilter !== 'tot') {
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

            if (error) {
                if (error.code === '42703' && isPlayground) {
                    setColumnCache('market_is_playground', false);
                    logger.warn('[SupabaseService] is_playground missing in market, retrying silent...');
                    return this.getMarketItems(categoryFilter, townId, page, pageSize, false);
                }
                throw error;
            }

            // FALLBACK RESTAURADOR: Si no hi ha items a la DB, mostrem els MOCK_MARKET_ITEMS
            if ((!data || data.length === 0) && page === 0 && ENABLE_MOCKS) {
                const { MOCK_MARKET_ITEMS } = await import('../data');
                return { data: MOCK_MARKET_ITEMS, count: MOCK_MARKET_ITEMS.length };
            }

            return { data: data || [], count: count || 0 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getMarketItems:', err);
            return { data: [], count: 0 };
        }
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(payload);

        const { data, error } = await supabase
            .from('market_items')
            .insert([validated])
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
        if (conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
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
                .select('id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at')
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
        const ids = (Array.isArray(postIds) ? postIds : [postIds]).filter(id =>
            typeof id === 'string' && id.includes('-')
        );
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
        // Validació estructural amb Zod (parcial admès per a actualitzacions)
        const validated = ProfileSchema.partial().parse(updates);

        const { data, error } = await supabase
            .from('profiles')
            .update(validated)
            .eq('id', userId)
            .select();

        if (error) {
            logger.error('[SupabaseService] Error updating profile:', error);
            throw error;
        }
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
        // If it's a Lore character ID, return mock data
        if (userId && userId.startsWith('11111111-')) {
            const personas = await this.getAllPersonas();
            const found = personas.find(p => p.id === userId);
            if (found) return found;
        }

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
        if (error) {
            logger.error('[SupabaseService] Error getting entity members:', error);
            throw error;
        }
        return data;
    },

    async getUserPosts(userId, isPlayground = false) {
        try {
            let query = supabase
                .from('posts')
                .select('id, content, created_at, author_id, image_url, is_playground, entity_id')
                .eq('author_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserPosts:', error);
            return [];
        }
    },

    async getEntityPosts(entityId, isPlayground = false) {
        try {
            let query = supabase
                .from('posts')
                .select('id, content, created_at, author_id, image_url, is_playground, entity_id')
                .eq('entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityPosts:', error);
            return [];
        }
    },

    async getUserMarketItems(userId, isPlayground = false) {
        try {
            let query = supabase
                .from('market_items')
                .select('id, title, description, price, category_slug, created_at, author_id, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)')
                .eq('author_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserMarketItems:', error);
            return [];
        }
    },

    async getEntityMarketItems(entityId, isPlayground = false) {
        try {
            let query = supabase
                .from('market_items')
                .select('id, title, description, price, category_slug, created_at, author_id, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)')
                .eq('entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityMarketItems:', error);
            return [];
        }
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
        if (error) {
            logger.error('[SupabaseService] Error creating lexicon entry:', error);
            throw error;
        }
        return data[0];
    },

    // Herramientas de Control de Almacenamiento (Auditoría)
    async getStorageStats() {
        try {
            const bucket = 'chat_attachments';
            const { data, error } = await supabase.storage.from(bucket).list('', { recursive: true });

            if (error) throw error;

            // Supabase list() returns metadata including size in bytes
            const totalBytes = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

            return {
                count: data.length,
                totalBytes,
                totalMB,
                limitMB: 1024, // Supabase Free Tier: 1GB
                percentage: ((totalBytes / (1024 * 1024 * 1024)) * 100).toFixed(2)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error getting storage stats:', err);
            return null;
        }
    },

    // Subida de imágenes de perfil y portada
    // --- Media Deduplication & Upload Helpers ---

    /**
     * Internal helper to process a media upload with deduplication.
     * Checks hash first, then uploads if necessary, and finally registers usage.
     */
    async processMediaUpload(userId, file, bucket, context, isPublic = true, parentId = null) {
        const { calculateFileHash } = await import('../utils/crypto');
        const hash = await calculateFileHash(file);

        // 1. Check if asset already exists
        const existingAsset = await this.getMediaAssetByHash(hash);

        if (existingAsset) {
            // Already exists! Just register usage
            await this.registerMediaUsage(existingAsset.id, userId, context, isPublic);
            return { url: existingAsset.url, deduplicated: true, asset: existingAsset };
        }

        // 2. No duplicate, perform actual upload
        const filePath = `${userId}/${context}_${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        // 3. Create the asset record
        const newAsset = await this.createMediaAsset({
            hash,
            url: publicUrl,
            mime_type: file.type,
            size_bytes: file.size,
            parent_id: parentId,
            is_playground: context === 'playground' || (typeof window !== 'undefined' && localStorage.getItem('isPlaygroundMode') === 'true')
        });

        // 4. Register usage
        await this.registerMediaUsage(newAsset.id, userId, context, isPublic);

        return { url: publicUrl, deduplicated: false, asset: newAsset };
    },

    async uploadAvatar(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'avatar', true);
        await this.updateProfile(userId, { avatar_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadCover(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'cover', true);
        await this.updateProfile(userId, { cover_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadChatAttachment(file, conversationId, userId) {
        const result = await this.processMediaUpload(userId, file, 'chat_attachments', 'chat', true);
        return result.url;
    },

    // --- Media Deduplication System ---

    async getMediaAssetByUrl(url) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('url', url)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async getUserMediaAssets(userId) {
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                asset_id,
                context,
                media_assets (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const assets = [];
        const seenIds = new Set();
        const seenHashes = new Set();

        const hasPrimarySource = data?.some(u =>
            ['raw', 'post', 'chat', 'direct', 'item'].includes(u.context)
        );

        data?.forEach(usage => {
            const asset = usage.media_assets;
            const context = usage.context;

            if (asset && !seenIds.has(asset.id)) {
                // 1. Never show crops with parents
                if (asset.parent_id) return;

                // 2. Exact file deduplication (legacy support)
                if (seenHashes.has(asset.hash)) return;

                // 3. Hide automated contexts if original source exists
                const isAutomated = context === 'avatar' || context === 'cover';
                if (hasPrimarySource && isAutomated) return;

                if (asset.mime_type?.startsWith('image/')) {
                    assets.push(asset);
                    seenIds.add(asset.id);
                    seenHashes.add(asset.hash);
                }
            }
        });

        return assets;
    },

    async getMediaAssetByHash(hash) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('hash', hash)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async getParentAsset(assetId) {
        const { data: asset, error: assetError } = await supabase
            .from('media_assets')
            .select('parent_id')
            .eq('id', assetId)
            .single();

        if (assetError || !asset.parent_id) return null;

        const { data: parent, error: parentError } = await supabase
            .from('media_assets')
            .select('*')
            .eq('id', asset.parent_id)
            .single();

        if (parentError) throw parentError;
        return parent;
    },

    async createMediaAsset(assetData) {
        const { data, error } = await supabase
            .from('media_assets')
            .insert(assetData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async registerMediaUsage(assetId, userId, context, isPublic = true) {
        const { data, error } = await supabase
            .from('media_usage')
            .insert({
                asset_id: assetId,
                user_id: userId,
                context,
                is_public: isPublic
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMediaAttribution(assetId) {
        const { data, error } = await supabase
            .from('media_attribution')
            .select('*')
            .eq('asset_id', assetId);

        if (error) throw error;
        return data;
    },

    async getUserMedia(userId, isPlayground = false) {
        let query = supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*)
            `)
            .eq('user_id', userId);

        if (isPlayground) {
            // Also include media associated with common demo IDs to feel more "filled"
            // but focused on the current character's simulated activity
            // query = query.or(...) // Future expansion: aggregate common persona assets
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Purges all ephemeral data generated during a playground session.
     */
    async cleanupPlaygroundSession(userId) {
        if (!userId) return;
        logger.log(`[SupabaseService] Starting cleanup for user ${userId}...`);

        try {
            // 1. Delete posts
            const { error: postError } = await supabase
                .from('posts')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (postError) logger.error('Error cleaning posts:', postError);

            // 2. Delete market items
            const { error: marketError } = await supabase
                .from('market_items')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (marketError) logger.error('Error cleaning market items:', marketError);

            // 3. Mark playground messages or delete
            // Note: messages might not have is_playground column, but they belong to playground conversations
            // This is a simplified version, more robust would be deleting by conversation_id

            // 4. Cleanup storage references and files
            // This requires listing from media_usage with a hypothetical 'is_temporary' flag 
            // or by checking the created_at vs session start.

            logger.log(`[SupabaseService] Cleanup finished for ${userId}`);
            return true;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in cleanup:', err);
            return false;
        }
    }
};
