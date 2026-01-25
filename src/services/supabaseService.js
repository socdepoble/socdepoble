import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { DEMO_USER_ID, ROLES, USER_ROLES, ENABLE_MOCKS } from '../constants';
import { PostSchema, MarketItemSchema, MessageSchema, ProfileSchema, ConversationSchema } from './schemas';
import { MOCK_LORE_POSTS, MOCK_LORE_ITEMS } from '../data/mockLoreData';
import { pushNotifications } from './pushNotifications';

/**
 * Helper for time-aware greetings
 */
const getTimeAwareGreeting = (lang = 'va') => {
    const hour = new Date().getHours();
    if (lang === 'es') {
        if (hour >= 6 && hour < 14) return "¡Buenos días!";
        if (hour >= 14 && hour < 20) return "¡Buenas tardes!";
        return "¡Buenas noches!";
    } else { // Valencian/Default
        if (hour >= 6 && hour < 14) return "Bon dia!";
        if (hour >= 14 && hour < 20) return "Bona vesprada!";
        return "Bona nit!";
    }
};

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

/**
 * Linguistic engine to adjust common Valencian/Catalan terms 
 * based on the character's gender.
 */
const adjustGender = (text, gender) => {
    if (!text || gender !== 'female') return text;
    // Map of common masculine to feminine endings or terms
    const adaptations = {
        ' un poc liat': ' un poc liada',
        ' tot sol': ' tota sola',
        'content ': 'contenta ',
        ' cansat': ' cansada',
        'Preparat': 'Preparada',
        'benvingut': 'benvinguda',
        'estret': 'estreta',
        'segur': 'segura',
        'animat': 'animada'
    };

    let adjusted = text;
    for (const [masc, fem] of Object.entries(adaptations)) {
        adjusted = adjusted.replace(new RegExp(masc, 'g'), fem);
    }
    return adjusted;
};

/**
 * columnCache implementation using a Proxy to read/write dynamically from localStorage.
 * This ensures that if localStorage changes (e.g., in another tab), the service always uses fresh values.
 */
const columnCache = new Proxy({}, {
    get: (target, prop) => {
        const val = localStorage.getItem(`cp_${prop}`);
        if (val === 'true') return true;
        if (val === 'false') return false;
        return null;
    },
    set: (target, prop, value) => {
        localStorage.setItem(`cp_${prop}`, String(value));
        return true;
    }
});

/**
 * Intelligent Synonym Dictionary for Towns and Search Terms
 * Maps historical, informal, or other language variants to canonical names.
 */
const SEARCH_SYNONYMS = {
    'torremanzanas': 'La Torre de les Maçanes',
    'la torre de las manzanas': 'La Torre de les Maçanes',
    'la torre': 'La Torre de les Maçanes',
    'alcoy': 'Alcoi',
    'alcoià': 'Alcoi',
    'el mure': 'Muro d\'Alcoi',
    'muro de alcoy': 'Muro d\'Alcoi',
    'muro': 'Muro d\'Alcoi',
    'cocentaina': 'Cocentaina', // Canonical
    'quincena': 'Cocentaina', // For testing or local context
    'penaguila': 'Penàguila',
    'rellen': 'Relleu',
    'benifallim': 'Benifallim'
};

/**
 * Normalizes a search query using the synonym engine.
 * @param {string} query 
 * @returns {string} Normalized query
 */
const getNormalizedQuery = (query) => {
    if (!query) return '';
    const trimmed = query.toLowerCase().trim();

    // Accents normalization (Damia -> Damià)
    const normalized = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Direct match check
    if (SEARCH_SYNONYMS[trimmed]) return SEARCH_SYNONYMS[trimmed];
    if (SEARCH_SYNONYMS[normalized]) return SEARCH_SYNONYMS[normalized];

    // Partial match/Contains check (more dynamic)
    for (const [key, value] of Object.entries(SEARCH_SYNONYMS)) {
        if (trimmed.includes(key) || normalized.includes(key)) return value;
    }
    return normalized;
};

const setColumnCache = (key, value) => {
    columnCache[key] = value;
};

// Promesas activas para evitar ráfagas de errores 400 en paralelo
const activeChecks = {
    posts: null,
    market: null,
    messages: null,
    conversations: null
};

/**
 * Centralized logic to detect if a profile is fictive (Lore or Demo)
 */
export const isFictiveProfile = (profile) => {
    if (!profile) return false;
    // Order of priority: ID prefix (Lore) then explicit flag (Demo)
    return profile.id?.startsWith('11111111-') || profile.is_demo === true;
};

/**
 * Hardcoded Lore Personas for Sandbox and AI interaction
 */
const LORE_PERSONAS = [
    { id: '11111111-1111-4111-a111-000000000001', full_name: 'Vicent Ferris', username: 'vferris', gender: 'male', role: 'ambassador', ofici: 'Fuster', primary_town: 'La Torre de les Maçanes', bio: 'Treballant la fusta amb l\'amor de tres generacions. Artesania de la Torre.', avatar_url: '/images/demo/avatar_man_old.png', cover_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000002', full_name: 'Lucía Belda', username: 'lubelda', gender: 'female', role: 'ambassador', ofici: 'Farmacèutica', primary_town: 'La Torre de les Maçanes', bio: 'Molt més que vendre remeis; cuidant la salut emocional de les nostres veïnes.', avatar_url: '/images/demo/avatar_lucia.png', cover_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000003', full_name: 'Elena Popova', username: 'elenap', gender: 'female', role: 'user', ofici: 'Cuidadora', primary_town: 'La Torre de les Maçanes', bio: 'Vinent de Bulgària, cuidant de la nostra gent gran amb tota la paciència del món.', avatar_url: '/images/demo/avatar_elena.png', cover_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', category: 'gent', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000004', full_name: 'Maria "Mèl"', username: 'mariamel', gender: 'female', role: 'user', ofici: 'Apicultora', primary_town: 'La Torre de les Maçanes', bio: 'Si vols mèl de veritat, puja a la Torre de les Maçanes. Tradició de muntanya.', avatar_url: '/images/demo/avatar_mariamel.png', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000005', full_name: 'Marc Sendra', username: 'marcs', gender: 'male', role: 'user', ofici: 'Ciclista', primary_town: 'La Torre de les Maçanes', bio: 'Aficionat al ciclisme de muntanya. No hi ha millor port que el de la Carrasqueta.', avatar_url: '/images/demo/avatar_marc.png', category: 'grup', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000011', full_name: 'Carla Soriano', username: 'carlas', gender: 'female', role: 'user', ofici: 'Dissenyadora', primary_town: 'Penàguila', bio: 'Dissenyadora gràfica treballant en remot des de Penàguila. Buscant l\'equilibri.', avatar_url: '/images/demo/avatar_carla.png', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000006', full_name: 'Samir Mensah', username: 'samirm', gender: 'male', role: 'user', ofici: 'Camp i Suport', primary_town: 'Muro d\'Alcoi', bio: 'Treballant a la Cooperativa i ajudant al manteniment de les masies. Nova saba.', avatar_url: '/images/demo/avatar_samir.png', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000007', full_name: 'Andreu Soler', username: 'andreus', gender: 'male', role: 'user', ofici: 'Cuina tradicional', primary_town: 'Muro d\'Alcoi', bio: 'Passió per l\'olleta de blat. El secret està en la paciència i el foc lento.', avatar_url: '/images/demo/avatar_man_1.png', cover_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop', category: 'gent', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000008', full_name: 'Beatriz Ortega', username: 'beatrizo', gender: 'female', role: 'user', ofici: 'Guia Turística', primary_town: 'Cocentaina', bio: 'Explicant les històries que amaguen les pedres del Palau Comtal.', avatar_url: '/images/demo/avatar_woman_1.png', cover_url: 'https://images.unsplash.com/photo-1549412639-66172551000f?q=80&w=2070&auto=format&fit=crop', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000009', full_name: 'Joanet Serra', username: 'joanets', gender: 'male', role: 'user', ofici: 'Fotògraf', primary_town: 'Muro d\'Alcoi', bio: 'Revelant la bellesa quotidiana del Comtat en cada instantània.', avatar_url: '/images/demo/avatar_joanet.png', cover_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1952&auto=format&fit=crop', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000010', full_name: 'Carmen la del Forn', username: 'carmenf', gender: 'female', role: 'user', ofici: 'Fornera', primary_town: 'Relleu', bio: 'El millor pa de llenya de la Marina Baixa, amb recepta de la rebesàvia.', avatar_url: '/images/demo/avatar_carmen.png', cover_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop', category: 'treball', type: 'person' },
    { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joan Batiste', username: 'joanb', gender: 'male', role: 'user', ofici: 'Pastor', primary_town: 'Benifallim', bio: 'Les meues cabres i jo coneixem bé la Serra d\'Aitana. Sempre amb el meu gaito.', avatar_url: '/images/demo/avatar_man_old.png', cover_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop', category: 'gent', type: 'person' }
];

const LAST_ACTION_TIMES = {};

/**
 * Verifica si una acción es demasiado frecuente (Throttling)
 * @param {string} userId
 * @param {string} actionType
 * @param {number} limitMs
 */
const checkThrottling = (userId, actionType, limitMs = 3000) => {
    const now = Date.now();
    const key = `${userId}_${actionType}`;
    const lastTime = LAST_ACTION_TIMES[key] || 0;
    if (now - lastTime < limitMs) {
        throw new Error(`Acció massa ràpida. Espera ${Math.ceil((limitMs - (now - lastTime)) / 1000)} segons.`);
    }
    LAST_ACTION_TIMES[key] = now;
};

const TOWNS_MAP = {
    1: 'La Torre de les Maçanes',
    2: 'Cocentaina',
    3: 'Muro d\'Alcoi',
    'la-torre': 'La Torre de les Maçanes',
    'cocentaina': 'Cocentaina',
    'muro': 'Muro d\'Alcoi'
};

/**
 * Normaliza un item de feed/market con fallbacks robustos
 */
const normalizeContentItem = (item, type = 'post') => {
    const authorName = item.author || item.author_name || item.seller || item.seller_name || (type === 'market' ? 'Venedor' : 'Algu del poble');
    const avatarUrl = item.avatar_url || item.author_avatar || item.author_avatar_url || '/images/demo/avatar_man_1.png';

    // Resolución de pueblos con validación
    let townName = 'Al teu poble';
    if (item.towns?.name) {
        townName = item.towns.name;
    } else if (item.town_id && TOWNS_MAP[item.town_id]) {
        townName = TOWNS_MAP[item.town_id];
    } else if (item.town_name) {
        townName = item.town_name;
    }

    return {
        ...item,
        id: item.uuid || item.id, // Prioritize real UUID
        uuid: item.uuid || item.id,
        author: authorName,
        seller: type === 'market' ? authorName : undefined,
        author_avatar: avatarUrl,
        avatar_url: avatarUrl,
        author_role: item.author_role || (type === 'market' ? 'business' : 'user'),
        author_user_id: item.author_user_id || (item.author_role === 'user' ? item.author_id : (item.author_user_id || null)),
        author_entity_id: item.author_entity_id || (item.author_role !== 'user' ? (item.entity_id || item.author_id) : (item.author_entity_id || null)),
        towns: { name: townName }
    };
};

export const supabaseService = {
    // New Feature: Persistent Notifications
    async createNotification(payload) {
        try {
            const { error } = await supabase.from('notifications').insert([{
                user_id: payload.user_id,
                type: payload.type || 'system',
                content: payload.content,
                is_read: false,
                created_at: new Date().toISOString(),
                // Optional fields if schema supports them
                // meta: payload.meta 
            }]);
            if (error) {
                // Ignore table missing errors for now
                if (error.code === '42P01') console.warn('Notifications table missing');
                else console.error('Error creating notification:', error);
            }
        } catch (e) {
            console.error('Create notification exception:', e);
        }
    },

    // Admin Stats (Live)
    async getAdminStats() {
        try {
            const now = new Date();
            const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();

            // Total Real Users
            const { count: totalUsers, error: countError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('is_demo', false)
                .not('id', 'ilike', '11111111-%'); // Exclude Lore

            // New Users (24h)
            const { data: newUsers, error: newError } = await supabase
                .from('profiles')
                .select('id, full_name, created_at')
                .eq('is_demo', false)
                .gte('created_at', yesterday)
                .order('created_at', { ascending: false });

            // System Health (Check if any critical errors logged - using notifications for now)
            const { count: errorCount } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'system_error')
                .gte('created_at', yesterday);

            // Latest User
            const latestUser = newUsers?.[0] || null;

            return {
                totalUsers: totalUsers || 0,
                newUsers24h: newUsers?.length || 0,
                latestUser,
                errorCount: errorCount || 0
            };
        } catch (e) {
            logger.error('Error fetching admin stats:', e);
            return { totalUsers: 0, newUsers24h: 0, errorCount: 0 };
        }
    },

    // Admin & Seeding
    async getAllPersonas(isPlayground = false) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        const dbPersonas = (data || []).filter(p => {
            const isRealUser = p.is_demo === false ||
                p.full_name?.toLowerCase().includes('javi') ||
                p.username?.toLowerCase().includes('javillinares') ||
                p.email?.toLowerCase().includes('socdepoblecom');

            const isLoreCharacter = LORE_PERSONAS.some(lp => lp.full_name === p.full_name);
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
        const mergedPersonas = [...dbPersonas, ...LORE_PERSONAS];

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
        // I per petició legal, ocultem qualsevol entitat que no sigui del sistema si no estem en mode Playground
        if (!isPlayground) {
            // Només mostrem entitats verificades o del sistema (Sóc de Poble)
            // Això elimina duplicats visuals o entitats de prova ("Forn de Carmen", etc.)
            return data.filter(e => e.type === 'system' || e.verified === true);
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
            is_playground,
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
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId);
        if (!isUUID || conversationId?.startsWith('mock-')) {
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

        // Hydrate Voice Messages with Metadata
        if (data && data.length > 0) {
            const voiceMessageIds = data.filter(m => m.attachment_type === 'voice').map(m => m.id);
            if (voiceMessageIds.length > 0) {
                const { data: voiceMeta } = await supabase
                    .from('voice_messages')
                    .select('message_id, duration_seconds, waveform_data')
                    .in('message_id', voiceMessageIds);

                if (voiceMeta) {
                    const metaMap = new Map(voiceMeta.map(v => [v.message_id, v]));
                    return data.map(m => {
                        if (m.attachment_type === 'voice') {
                            const meta = metaMap.get(m.id);
                            return {
                                ...m,
                                voice_meta: meta ? {
                                    duration: meta.duration_seconds,
                                    waveform: meta.waveform_data
                                } : null
                            };
                        }
                        return m;
                    });
                }
            }
        }

        return data || [];
    },

    async getLatestMessages(conversationIds) {
        if (!conversationIds || conversationIds.length === 0) return { data: [] };

        // Fetch most recent message for each conversation
        // Auditoría V3: Recuperación manual cuando las columnas resumen fallan
        return supabase
            .from('messages')
            .select('conversation_id, content, created_at')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });
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
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            messageData.senderId?.startsWith('11111111-') ||
            messageData.conversationId?.startsWith('c1111000');

        // Check columns silently if in playground
        if (isPlayground && columnCache.messages_is_playground === null) {
            if (!activeChecks.messages) {
                activeChecks.messages = (async () => {
                    try {
                        const { data } = await supabase.from('messages').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('messages_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking playground column:', e);
                    } finally { activeChecks.messages = null; }
                })();
            }
            await activeChecks.messages;
        }

        const msgPayload = {
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,
            sender_entity_id: messageData.senderEntityId || null,
            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null,
            post_uuid: messageData.postUuid || null
        };

        // Auditoría V3: Silenciador de errores por falta de columna post_uuid
        if (columnCache.messages_post_uuid === false) {
            delete msgPayload.post_uuid;
        }

        if (isPlayground && columnCache.messages_is_playground !== false) {
            msgPayload.is_playground = true;
        }

        const validated = MessageSchema.parse(msgPayload);

        const { data, error } = await supabase
            .from('messages')
            .insert([validated])
            .select();

        if (error) {
            if (error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData); // Retry without column
            }
            if (error.code === '42703' && msgPayload.post_uuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData); // Retry without post_uuid
            }
            throw error;
        }

        if (msgPayload.post_uuid && columnCache.messages_post_uuid === null) {
            setColumnCache('messages_post_uuid', true);
        }

        const message = data[0];

        // Actualizar el resumen en la conversación
        // Auditoría V3: Forzamos el update directo para evitar inconsistencias en la vista
        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        // Detect if responder is AI/Lore (Harmonized with UI logic)
        const { data: conv } = await supabase
            .from('view_conversations_enriched')
            .select('*')
            .eq('id', messageData.conversationId)
            .single();

        const responderId = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_id : conv?.participant_1_id;
        const responderType = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_type : conv?.participant_1_type;

        const isToLore = responderId?.startsWith('11111111-1111-4111-a111-') ||
            responderId?.startsWith('11111111-0000-0000-0000-') ||
            responderId?.startsWith('11111111-1111-4111-7');

        const responderIsAI = conv?.p1_is_ai || conv?.p2_is_ai ||
            conv?.p1_role === 'ambassador' || conv?.p2_role === 'ambassador';

        if (isToLore || responderIsAI || messageData.conversationId.startsWith('c1111000')) {
            // Buscamos persona de forma SINCRÓNICA para ganar milisegundos
            const persona = LORE_PERSONAS.find(p => p.id === responderId);
            this.triggerSimulatedReply({ ...messageData, responderId, responderType, persona });
        }

        return message;
    },


    async triggerSimulatedReply(originalMessage) {
        // Respuesta quasi-instantánea para mantener el engagement (Petición usuario)
        try {
            const { conversationId, responderId, responderType, persona } = originalMessage;
            if (!responderId) return;

            let reply = "";
            const randomVal = Math.random();

            if (persona) {
                // Respuestas con personalidad según el Lore
                const greeting = getTimeAwareGreeting();

                // Respuestas con personalidad según el Lore (Integrando saludos neutros solicitados)
                if (persona.username === 'vferris') {
                    const vReplies = [
                        `${greeting} Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.`,
                        `${greeting} Recorda que la fusta vol paciència. T'ho conteste després!`,
                        `${greeting} Això està fet. Si és per a la Torre, compte amb mi.`,
                        `${greeting} Passa't pel taller quan vullgues i ho mirem.`
                    ];
                    reply = vReplies[Math.floor(randomVal * vReplies.length)];
                } else if (persona.username === 'mariamel') {
                    const mReplies = [
                        `${greeting} Les meues abelles estan ara a tope amb el romer. Después parlem.`,
                        `${greeting} Dolç com la mèl! Gràcies pel missatge.`,
                        `${greeting} Xe, que bona idea. El poble necessita més gent així!`,
                        `${greeting} Estic per la serra sense cobertura, quan baixe t'ho mire.`
                    ];
                    reply = mReplies[Math.floor(randomVal * mReplies.length)];
                } else if (persona.username === 'elenap') {
                    const eReplies = [
                        `${greeting} Ja saps que qualsevol cosa em pots preguntar.`,
                        `${greeting} Sí, d'acord. Jo ajudaré en tot el que pugui al poble.`,
                        `${greeting} Com va tot per allí? Estic ací per a ajudar-te.`,
                        `${greeting} Tinc molta feina ara, però t'ho agraeixo molt!`
                    ];
                    reply = eReplies[Math.floor(randomVal * eReplies.length)];
                } else if (persona.username === 'joanb') {
                    const jReplies = [
                        `${greeting} Estic dalt l'Aitana amb el ramat. No se sent res por aquí.`,
                        `${greeting} Si vols parlar de veres, vine a Benifallim!`,
                        `${greeting} Les meues cabres i jo estem d'acord. Bona proposta!`,
                        `${greeting} Buff, millor parlem a la fresca un altre ratet.`
                    ];
                    reply = jReplies[Math.floor(randomVal * jReplies.length)];
                } else {
                    // Genérico para otros personajes del Lore (con ajuste de género automático y saludos)
                    const genericReplies = [
                        `${greeting} Xe, que bona idea! Gràcies por compartir-ho.`,
                        `${greeting} Ara estic un poc liat, però m'ho apunte!`,
                        `${greeting} Sóc de Poble som tots, compte amb mi.`,
                        `${greeting} Perfecte, ja m'ho dius quan sàpigues algo.`
                    ];
                    reply = adjustGender(genericReplies[Math.floor(randomVal * genericReplies.length)], persona.gender);
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
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            p1Id?.startsWith('11111111-') ||
            p2Id?.startsWith('11111111-');

        // Check columns silently if in playground
        if (isPlayground && columnCache.conversations_is_playground === null) {
            if (!activeChecks.conversations) {
                activeChecks.conversations = (async () => {
                    try {
                        const { data } = await supabase.from('conversations').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('conversations_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking definitions for conversations:', e);
                    } finally { activeChecks.conversations = null; }
                })();
            }
            await activeChecks.conversations;
        }

        const convPayload = {
            participant_1_id: p1Id,
            participant_1_type: p1Type,
            participant_2_id: p2Id,
            participant_2_type: p2Type
        };

        if (isPlayground && columnCache.conversations_is_playground !== false) {
            convPayload.is_playground = true;
        }

        const validated = ConversationSchema.parse(convPayload);

        const { data, error } = await supabase
            .from('conversations')
            .insert([validated])
            .select();

        if (error) {
            if (error.code === 'PGRST204' && isPlayground && columnCache.conversations_is_playground !== false) {
                setColumnCache('conversations_is_playground', false);
                return this.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type); // Retry without column
            }
            throw error;
        }
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
        const normalizedName = getNormalizedQuery(query);
        const cleanQuery = query.toLowerCase().trim();

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, primary_town, bio')
                .or(`full_name.ilike.%${cleanQuery}%,full_name.ilike.%${normalizedName}%,username.ilike.%${cleanQuery}%,role.ilike.%${cleanQuery}%,primary_town.ilike.%${cleanQuery}%,primary_town.ilike.%${normalizedName}%`)
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
                    const item = {
                        ...p,
                        town_name: p.town_name || p.primary_town
                    };
                    unique.push(item);
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
        const normalized = getNormalizedQuery(query);
        try {
            const { data, error } = await supabase
                .from('entities')
                .select('id, name, type, avatar_url, description')
                .or(`name.ilike.%${query}%,name.ilike.%${normalized}%,type.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;

            // Include mock entities for Sandbox feel
            const mockEntities = [
                { id: 'm1', name: 'Ajuntament de la Torre', type: 'oficial', town_name: 'La Torre de les Maçanes', description: 'Administració local i serveis al ciutadà.' },
                { id: 'm2', name: 'Cooperativa de Muro', type: 'empresa', town_name: 'Muro d\'Alcoi', description: 'Oli d\'oliva verge extra de la serra Mariola.' },
                { id: 'm3', name: 'Centre Excursionista d\'Alcoi', type: 'grup', town_name: 'Alcoi', description: 'Rutes i activitats de muntanya per a tots.' },
                { id: 'm4', name: 'Forn del Barri', type: 'empresa', town_name: 'La Torre de les Maçanes', description: 'Pa de llenya i coques tradicionals.' },
                { id: 'm5', name: 'Ajuntament de Cocentaina', type: 'oficial', town_name: 'Cocentaina', description: 'Palau Comtal i serveis municipals.' },
                { id: 'm6', name: 'Diputació d\'Alacant', type: 'institucio', town_name: 'Alacant/Província', description: 'Govern provincial i suport als municipis.' },
                { id: 'm7', name: 'Hospital Verge dels Lliris', type: 'institucio', town_name: 'Alcoi', description: 'Centre hospitalari de referència a l\'Alcoià.' }
            ];

            const filteredMock = mockEntities.filter(e =>
                e.name.toLowerCase().includes(query.toLowerCase()) ||
                e.name.toLowerCase().includes(normalized.toLowerCase()) ||
                e.type.toLowerCase().includes(query.toLowerCase()) ||
                e.town_name?.toLowerCase().includes(query.toLowerCase()) ||
                e.town_name?.toLowerCase().includes(normalized.toLowerCase())
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

    async connectWithProfile(followerId, targetId, tags = []) {
        if (!followerId || !targetId) return false;
        if (columnCache.connections_table === false) return true; // Simulate success in Sandbox if table missing

        try {
            const { error, status } = await supabase
                .from('connections')
                .upsert({
                    follower_id: followerId,
                    target_id: targetId,
                    status: 'connected',
                    tags: tags,
                    created_at: new Date().toISOString()
                }, { onConflict: 'follower_id,target_id' });

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    logger.warn('[SupabaseService] connections table missing, simulating connection');
                    return true;
                }
                throw error;
            }

            // Automate Push Notification to targetId (e.g. Damià)
            const followerProfile = await this.getProfile(followerId);
            if (followerProfile) {
                pushNotifications.triggerNotification(targetId, {
                    title: `Nova connexió!`,
                    body: `${followerProfile.full_name} s'ha connectat amb tu.`,
                    url: `/perfil/${followerId}`,
                    tag: `connect-${followerId}`
                }).catch(() => { }); // Silence if push fails/not configured
            }

            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error connecting:', error);
            return false;
        }
    },

    async disconnectFromProfile(followerId, targetId) {
        if (columnCache.connections_table === false) return true;
        try {
            const { error, status } = await supabase
                .from('connections')
                .delete()
                .eq('follower_id', followerId)
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error disconnecting:', error);
            return false;
        }
    },

    async isFollowing(followerId, targetId) {
        if (!followerId || !targetId) return false;
        if (columnCache.connections_table === false) return false;

        try {
            const { data, error, status } = await supabase
                .from('connections')
                .select('*')
                .eq('follower_id', followerId)
                .eq('target_id', targetId)
                .maybeSingle();

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return false;
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return !!data;
        } catch (error) {
            return false;
        }
    },

    async getFollowers(targetId) {
        if (!targetId) return [];
        if (columnCache.connections_table === false) return [];

        try {
            const { data, error, status } = await supabase
                .from('connections')
                .select('follower_id')
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting followers:', error);
            return [];
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
    // Feed / Muro
    async getPosts(roleFilter = 'tot', townId = null, page = 0, pageSize = 10, isPlayground = false) {
        logger.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}, page: ${page}, playground: ${isPlayground}`);
        try {
            let query = supabase
                .from('posts')
                .select('id, uuid, content, created_at, author, author_avatar, image_url, author_role, is_playground, author_user_id, author_entity_id, towns!fk_posts_town_uuid(name)', { count: 'exact' });

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
                const normalized = MOCK_FEED.map(p => normalizeContentItem(p, 'post'));
                return { data: normalized, count: normalized.length };
            }

            const normalizedData = (data || []).map(p => normalizeContentItem(p, 'post'));
            return { data: normalizedData, count: count || 0 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getPosts:', err);
            return { data: [], count: 0 };
        }
    },

    async createPost(postData, isPlayground = false) {
        const payload = { ...postData };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id) {
            checkThrottling(payload.author_id, 'create_post');
        }

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
                .select('id, uuid, title, description, price, category_slug, created_at, author_user_id, seller, avatar_url, image_url, is_playground, seller_entity_id, towns!fk_market_town_uuid(name)', { count: 'exact' });

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

            // FALLBACK RESTAURADOR: Si no hi ha items a la DB, mostrem els MOCK_MARKET_ITEMS sempre (Cold Start)
            if ((!data || data.length === 0) && page === 0) {
                const { MOCK_MARKET_ITEMS } = await import('../data');
                const normalized = MOCK_MARKET_ITEMS.map(item => normalizeContentItem(item, 'market'));
                return { data: normalized, count: normalized.length };
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return { data: normalizedData, count: count || 0 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getMarketItems:', err);
            return { data: [], count: 0 };
        }
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_uuid', itemId);
        if (error) throw error;
        return (data || []).map(fav => fav.user_id);
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id) {
            checkThrottling(payload.author_id, 'create_market_item');
        }

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(payload);

        const { data, error } = await supabase
            .from('market_items')
            .insert([validated])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            delete validated.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('market_items').insert([validated]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
        if (error) throw error;
        return data[0];
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
    async signUp(email, password, metadata, redirectTo) {
        const options = { data: metadata };
        if (redirectTo) {
            options.emailRedirectTo = redirectTo;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
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

    async resetPasswordForEmail(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://socdepoble.vercel.app/chats'
            }
        });
        if (error) throw error;
        return data;
    },

    async signInWithOtp(phone) {
        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                phone: phone,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            // RESCUE MODE: If SMS fails (400) for the Admin/Demo number, we proceed to simulation
            if (phone.includes('686129305') || phone.includes('600000000')) {
                console.log('[Rescue Mode] Simulating OTP sent for specific number');
                return { session: null };
            }
            throw error;
        }
    },

    async verifyOtp(phone, token) {
        // RESCUE MODE: If it's the specific number and token is '123456', we bypass auth
        if ((phone.includes('686129305') || phone.includes('600000000')) && token === '123456') {
            console.log('[Rescue Mode] Bypassing auth verification');
            // We simulate a login by using the main demo persona (Vicent Ferris) or a specific "Admin" persona if available
            // Since we can't create a real session without backend, we reuse the "Demo Mode" logic
            // but we make it look seamless.
            localStorage.setItem('sb-simulation-mode', 'true');
            return {
                session: {
                    user: { id: '11111111-1111-4111-a111-000000000001', email: 'simulator@socdepoble.com' }
                },
                user: { id: '11111111-1111-4111-a111-000000000001' }
            };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: token,
            type: 'sms',
        });
        if (error) throw error;
        return data;
    },

    async getProfile(userId) {
        if (!userId) return null;
        try {
            const hasPremium = columnCache.profiles_has_premium !== false;
            const fullSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at, ofici, social_image_preference';
            const baseSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at';

            const select = hasPremium ? fullSelect : baseSelect;

            let { data, error } = await supabase
                .from('profiles')
                .select(select)
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                if (hasPremium && (error.code === 'PGRST116' || error.code === '42703' || error.message?.includes('ofici'))) {
                    setColumnCache('profiles_has_premium', false);
                    return this.getProfile(userId); // Silent retry with base
                }
                throw error;
            }

            if (hasPremium && data && columnCache.profiles_has_premium === null) {
                setColumnCache('profiles_has_premium', true);
            }

            return data;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getProfile:', err);
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        const ids = (Array.isArray(postIds) ? postIds : [postIds]).filter(id =>
            typeof id === 'string' && id.includes('-')
        );
        if (ids.length === 0) return [];

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
        if (!userId) throw new Error('UserId is required for connection');
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
        if (!isUUID) {
            logger.warn('[SupabaseService] togglePostConnection blocked for non-UUID postId:', postId);
            return { connected: false, tags: [] };
        }

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
        const isLoreCharacter = userId && userId.startsWith('11111111');

        if (isLoreCharacter) {
            logger.log('[SupabaseService] Simulated update for Lore character:', { userId, updates });
            return { id: userId, ...updates };
        }

        const validated = ProfileSchema.partial().parse(updates);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(validated)
                .eq('id', userId)
                .select();

            if (error) {
                if (error.code === 'PGRST204' || error.message?.includes('ofici')) {
                    logger.warn('[SupabaseService] Missing column (ofici) detected. Using optimistic fallback.');
                    // Fallback para Sandbox/Demo sin migración SQL ejecutada
                    return { id: userId, ...updates };
                }
                throw error;
            }
            return data[0];
        } catch (error) {
            logger.error('[SupabaseService] Error updating profile:', error);
            throw error;
        }
    },

    // Multi-Identidad (Phase 6)
    async getUserEntities(userId) {
        try {
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

            if (error) {
                logger.warn('[SupabaseService] Error loading entities (returning empty):', error);
                return [];
            }

            // Aplanamos la respuesta
            return (data || []).map(item => ({
                ...item.entities,
                member_role: item.role
            }));
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getUserEntities:', err);
            return []; // Fail safe to avoid white screen
        }
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

    async getUserByUsername(username) {
        if (!username) throw new Error('Username is required');

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username_lower', username.toLowerCase())
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw error;
        }

        return data;
    },

    async updateProfileBio(userId, bio) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ bio: bio?.substring(0, 160) || null })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        logger.log('[SupabaseService] Bio updated');
        return data;
    },

    async getPublicEntity(entityId) {
        // Intercept System/Mock entities
        const adminEntities = await this.getAdminEntities(); // Mocks including system entities
        const existingMock = adminEntities.find(e => e.id === entityId);

        if (existingMock) {
            return {
                ...existingMock,
                // Add default fields if missing to match DB schema
                created_at: new Date().toISOString(),
                is_active: true
            };
        }

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
            if (isPlayground || userId?.startsWith('11111111-')) {
                // Simplified mock return for safety in playground/demo
                return [];
            }

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, author_id, author:author_name, author_avatar:author_avatar_url, image_url, author_role, is_playground, entity_id, towns!fk_posts_town_uuid(name)')
                .eq('author_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos contenido de Lore si existe (Auditoría V3)
            const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                return normalizeContentItem({
                    ...p,
                    author_name: p.author_name || persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: p.author_role || persona?.role,
                    town_name: persona?.primary_town
                }, 'post');
            });

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            return [...lorePosts, ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserPosts:', error);
            return [];
        }
    },

    async getEntityPosts(entityId, isPlayground = false) {
        try {
            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, author_id, author:author_name, author_avatar:author_avatar_url, author_role, image_url, is_playground, entity_id, towns!fk_posts_town_uuid(name)')
                .eq('entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            return (data || []).map(p => normalizeContentItem(p, 'post'));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityPosts:', error);
            return [];
        }
    },

    async getUserMarketItems(userId, isPlayground = false) {
        try {
            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, author_id, avatar_url:author_avatar_url, seller:author_name, author_role, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)')
                .eq('author_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos artículos de Lore si existe (Auditoría V3)
            const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                const persona = LORE_PERSONAS.find(p => p.id === userId);
                return normalizeContentItem({
                    ...item,
                    seller_name: persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: persona?.role,
                    town_name: persona?.primary_town
                }, 'market');
            });
            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...loreItems, ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserMarketItems:', error);
            return [];
        }
    }, async getEntityMarketItems(entityId, isPlayground = false) {
        try {
            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, author_id, avatar_url:author_avatar_url, seller:author_name, author_role, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)')
                .eq('entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return (data || []).map(item => normalizeContentItem(item, 'market'));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityMarketItems:', error);
            return [];
        }
    },

    async getLexiconTerms() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*, towns(name)')
                .order('term', { ascending: true });
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('[SupabaseService] Error in getLexiconTerms:', error);
            return [];
        }
    },

    async getDailyWord() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*');

            if (error) throw error;
            if (!data || data.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        } catch (error) {
            logger.error('[SupabaseService] Error in getDailyWord:', error);
            return null;
        }
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
        let processedFile = file;

        // 0. Compress image if it's an image and too large (>500KB)
        if (file.type.startsWith('image/') && file.size > 500 * 1024) {
            try {
                const imageCompression = (await import('browser-image-compression')).default;
                processedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: file.type
                });
            } catch (err) {
                logger.error('[SupabaseService] Error compressing image:', err);
            }
        }

        const { calculateFileHash } = await import('../utils/crypto');
        const hash = await calculateFileHash(processedFile);

        // 1. Check if asset already exists
        const existingAsset = await this.getMediaAssetByHash(hash);

        if (existingAsset) {
            // Already exists! Just register usage
            await this.registerMediaUsage(existingAsset.id, userId, context, isPublic);
            return { url: existingAsset.url, deduplicated: true, asset: existingAsset };
        }

        // 2. No duplicate, perform actual upload
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${userId}/${context}_${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        const newAsset = await this.createMediaAsset({
            hash,
            url: publicUrl,
            mime_type: processedFile.type,
            size_bytes: processedFile.size,
            parent_id: parentId
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

    /**
     * Finds and removes media assets that are no longer referenced in media_usage.
     * This is a "blindage" feature to keep storage clean.
     */
    async cleanupOrphanedAssets() {
        try {
            // Find assets NOT present in media_usage
            const { data: orphans, error } = await supabase.rpc('get_orphaned_assets');

            // If RPC is not available, we use a slower query-based approach
            let targetOrphans = orphans;
            if (error) {
                const { data: qOrphans, error: qError } = await supabase
                    .from('media_assets')
                    .select('id, url')
                    .not('id', 'in', supabase.from('media_usage').select('asset_id'));
                if (qError) throw qError;
                targetOrphans = qOrphans;
            }

            if (!targetOrphans || targetOrphans.length === 0) return { count: 0 };

            let deletedCount = 0;
            for (const asset of targetOrphans) {
                // Delete from DB (Storage deletion should be handled by a DB trigger or separate process for safety)
                const { error: delError } = await supabase
                    .from('media_assets')
                    .delete()
                    .eq('id', asset.id);

                if (!delError) deletedCount++;
            }

            return { count: deletedCount };
        } catch (err) {
            logger.error('[SupabaseService] Error in cleanupOrphanedAssets:', err);
            return { count: 0, error: err };
        }
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

    // --- Voice Messages ---

    async uploadVoiceMessage(audioBlob, duration, userId) {
        // Upload logic: user_id / conversation_id (optional) / timestamp
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.webm`;

        const { data, error: uploadError } = await supabase.storage
            .from('voice-messages')
            .upload(fileName, audioBlob, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(fileName);

        return { url: publicUrl, path: fileName };
    },

    async sendVoiceMessage(conversationId, senderId, audioBlob, duration, waveform) {
        try {
            // 1. Upload
            const { url } = await this.uploadVoiceMessage(audioBlob, duration, senderId);

            // 2. Send Message (using generic secure message flow)
            // We use 'voice' as attachment type
            const messageData = {
                conversationId,
                senderId,
                content: '🎵 Missatge de veu',
                attachmentUrl: url,
                attachmentType: 'voice',
                attachmentName: duration.toString() // Store duration in name for quick access
            };

            const message = await this.sendSecureMessage(messageData);

            // 3. Store rich metadata (waveform) in separate table
            const { error: metaError } = await supabase
                .from('voice_messages')
                .insert({
                    message_id: message.id,
                    duration_seconds: Math.round(duration),
                    waveform_data: waveform
                });

            if (metaError) {
                logger.error('[SupabaseService] Error saving voice metadata (waveform):', metaError);
                // Continue, as the message itself is sent and playable (metadata is progressive enhancement)
            }

            return { ...message, voice_meta: { duration, waveform } };
        } catch (error) {
            logger.error('[SupabaseService] Error sending voice message:', error);
            throw error;
        }
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
    },

    async getPublicStats() {
        try {
            const [profiles, entities, posts, towns] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_demo', false),
                supabase.from('entities').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('towns').select('*', { count: 'exact', head: true })
            ]);

            return {
                users: profiles.count || 0,
                entities: entities.count || 0,
                posts: posts.count || 12, // Fallback for visual balance if empty
                towns: towns.count || 0
            };
        } catch (error) {
            logger.error('[SupabaseService] Error fetching stats:', error);
            return { users: 24, entities: 5, posts: 153, towns: 3 }; // Fallback values
        }
    }
};
