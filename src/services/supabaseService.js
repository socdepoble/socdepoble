import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { DEMO_USER_ID, ROLES, USER_ROLES, ENABLE_MOCKS, CREATOR_EMAILS } from '../constants';
import { PostSchema, MarketItemSchema, MessageSchema, ProfileSchema, ConversationSchema } from './schemas';
import { MOCK_LORE_POSTS, MOCK_LORE_ITEMS } from '../data/mockLoreData';
import { pushNotifications } from './pushNotifications';
import { isRealDBUUID } from '../utils/identityUtils';

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
 * Normalizes Wikimedia URLs to standardized thumbnails (500px).
 * Purged aggressive thumb.php guessing to prevent 404 network spam.
 */
const normalizeWikipediaUrl = (url) => {
    if (!url) return null;

    let normalized = decodeURIComponent(String(url).trim());

    // Strict validation: must be a full URL
    if (!normalized.startsWith('http') && !normalized.startsWith('//')) {
        return null; // Return null so components naturally fallback to CSS initials
    }

    // Protocol-relative handling
    if (normalized.startsWith('//')) {
        normalized = 'https:' + normalized;
    }

    // Standardize Wikimedia existing thumbs to 500px if possible
    if (normalized.includes('wikimedia.org') || normalized.includes('wikipedia.org')) {
        if (normalized.includes('/thumb/')) {
            return normalized.replace(/\/\d+px-/g, '/500px-');
        }
    }

    return normalized;
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
/**
 * [OMEGA-3 FIXED] columnCache implementation using a Proxy and L1 RAM mirror.
 * Zero-Jank policy: synchronous gets hit RAM, synchronous sets hit RAM.
 * Disk writes are batched and debounced async.
 */
const _ramColumnCache = {};
let _columnCacheWriteTimer = null;
const _columnCachePendingWrites = new Set();

const columnCache = new Proxy({}, {
    get: (target, prop) => {
        // [MASTER BLINDATGE] Evitem consultes amb IDs malformats
        if (prop === 'sp_node_befd9c41142744f6') return null;
        if (prop.includes('_punt')) return null; // [GHOST-SHIELD] Blocking dynamic project_ref prefixes

        // 1. Resposta instantània des de RAM (L1)
        if (prop in _ramColumnCache) return _ramColumnCache[prop];

        // 2. Fallback síncron: Només 1 vegada per propietat en tota la sessió
        const val = localStorage.getItem(`cp_${prop}`);
        if (val === 'true') {
            _ramColumnCache[prop] = true;
            return true;
        }
        if (val === 'false') {
            _ramColumnCache[prop] = false;
            return false;
        }

        _ramColumnCache[prop] = null;
        return null;
    },
    set: (target, prop, value) => {
        // 1. L1 RAM Hit
        _ramColumnCache[prop] = value;
        
        // 2. Asynchronous Batched Debounced Write L2 (Zero Main-Thread Jank)
        _columnCachePendingWrites.add(prop);
        if (!_columnCacheWriteTimer) {
            _columnCacheWriteTimer = setTimeout(() => {
                _columnCachePendingWrites.forEach(p => {
                    try {
                        localStorage.setItem(`cp_${p}`, String(_ramColumnCache[p]));
                    } catch {
                         // Silently swallow quota errors to keep the application responsive locally
                    }
                });
                _columnCachePendingWrites.clear();
                _columnCacheWriteTimer = null;
            }, 1000); // 1000ms flush
        }
        return true;
    }
});

// [MASTER PURGE] Self-healing logic for legacy data
// })();


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
    'benifallim': 'Benifallim',
    'soc de poble': 'Sóc de Poble',
    'socdepoble': 'Sóc de Poble',
    'soc de': 'Sóc de Poble',
    'poble': 'Sóc de Poble',
    'soc': 'Sóc de Poble',
    'rutadelpoble': 'Sóc de Poble',
    'merchandising': 'Sóc de Poble',
    'xixona': 'Xixona',
    'jijona': 'Xixona',
    'alacant': 'Alacant',
    'alicante': 'Alacant',
    'alacantí': 'L\'Alacantí',
    'el campello': 'El Campello',
    'mutxamel': 'Mutxamel',
    'sant joan': 'Sant Joan d\'Alacant',
    'sant vicent': 'Sant Vicent del Raspeig',
    'agost': 'Agost'
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
    const accentLess = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Direct match check in Synonyms
    if (SEARCH_SYNONYMS[trimmed]) return SEARCH_SYNONYMS[trimmed];
    if (SEARCH_SYNONYMS[accentLess]) return SEARCH_SYNONYMS[accentLess];

    // Partial match/Contains check (more dynamic)
    for (const [key, value] of Object.entries(SEARCH_SYNONYMS)) {
        if (trimmed.includes(key) || accentLess.includes(key)) return value;
    }
    return accentLess;
};

/**
 * [SUPER-SEARCH] Unified search with semantic awareness
 */
export const unifiedSearch = async (query) => {
    const normalized = getNormalizedQuery(query);
    // logger.log(`[Super-Search] Executing unified search for: ${normalized} (${category})`);

    // Logic will be expanded to use FTS5/GIN indexes in the next phase
    // For now, we enhance the existing filtering with semantic tag matching
    return normalized;
};

/**
 * Utilitat interna per a comparació OMNISCIENT (Ignora accents, espais i majúscules)
 */
const omniMatch = (target, search) => {
    if (!target || !search) return false;
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    return normalize(target).includes(normalize(search));
};

const setColumnCache = (key, value) => {
    columnCache[key] = value;
};

/**
 * [PILAR 1: LOCAL-FIRST] Advanced Cache Layer for Latency Zero
 */
const LocalCache = {
    _storage: {},
    get: (key) => {
        const item = LocalCache._storage[key] || JSON.parse(localStorage.getItem(`lc_${key}`) || 'null');
        if (item && Date.now() < item.expires) {
            LocalCache._storage[key] = item; // Repopulate L1 if missing
            return item.data;
        }
        return null;
    },
    set: (key, data, ttl = 300000) => { // Default 5 min
        const item = { data, expires: Date.now() + ttl };
        LocalCache._storage[key] = item;
        try {
            localStorage.setItem(`lc_${key}`, JSON.stringify(item));
        } catch {
            // [CRÍTIC OMEGA-3] Fallback QuotaExceededError - Continuem només en RAM pura.
            // Ajudant als telèfons amb limitació dràstica d'espai al navegador
            console.warn('[LocalCache] Evitant crash de QuotaExceededError. Caiguda cap L1 RAM.');
        }
    },
    invalidate: (key) => {
        delete LocalCache._storage[key];
        localStorage.removeItem(`lc_${key}`);
    }
};

/**
 * [MASTER] Ensures column cache is populated with robust SQL checks
 */
const _ensureColumnCache = async () => {
    // 1. Check Posts columns
    if (columnCache.posts_ai_percentage === null) {
        if (!activeChecks.posts) {
            activeChecks.posts = (async () => {
                try {
                    const { data, error } = await supabase.from('posts').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        const exists = 'ai_percentage' in row;
                        setColumnCache('posts_ai_percentage', exists);
                        setColumnCache('posts_human_percentage', exists);
                        setColumnCache('posts_time_saved', exists);
                        setColumnCache('posts_is_iaia_inspired', exists);
                        setColumnCache('posts_pinned_position', 'pinned_position' in row);
                        setColumnCache('posts_town_uuid', 'town_uuid' in row);
                    } else if (error) {
                        setColumnCache('posts_ai_percentage', false);
                        setColumnCache('posts_pinned_position', false);
                    }
                    // logger.log(`[SupabaseService] Posts columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking posts columns:', e);
                } finally { activeChecks.posts = null; }
            })();
        }
    }

    // 2. Check Market columns
    if (columnCache.market_pinned_position === null) {
        if (!activeChecks.market) {
            activeChecks.market = (async () => {
                try {
                    // Check multiple columns in one go (market_items select *)
                    const { data, error } = await supabase.from('market_items').select('*').limit(1);
                    if (!error && data && data.length >= 0) {
                        const row = data[0] || {};
                        setColumnCache('market_pinned_position', 'pinned_position' in row);
                        setColumnCache('market_is_pinned', 'is_pinned' in row);
                        setColumnCache('market_is_iaia_inspired', 'is_iaia_inspired' in row);
                        setColumnCache('market_is_playground', 'is_playground' in row);
                    } else if (error) {
                        // If we can't select *, let's be conservative
                        setColumnCache('market_pinned_position', false);
                        setColumnCache('market_is_pinned', false);
                    }

                    // Check for the specific town join hint (PostgREST syntax)
                    const { error: fkError } = await supabase.from('market_items').select('towns!fk_market_town_uuid(name)').limit(1);
                    setColumnCache('market_fk_town_uuid', !fkError);

                    // logger.log(`[SupabaseService] Market columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking market columns:', e);
                } finally { activeChecks.market = null; }
            })();
        }
    }

    // 3. Check Messages columns
    if (columnCache.messages_post_uuid === null) {
        if (!activeChecks.messages) {
            activeChecks.messages = (async () => {
                try {
                    const { data, error } = await supabase.from('messages').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        setColumnCache('messages_post_uuid', 'post_uuid' in row);
                        setColumnCache('messages_is_playground', 'is_playground' in row);
                    } else if (error) {
                        setColumnCache('messages_post_uuid', false);
                        setColumnCache('messages_is_playground', false);
                    }
                    logger.log(`[SupabaseService] Messages columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking messages columns:', e);
                } finally { activeChecks.messages = null; }
            })();
        }
    }

    await Promise.all([activeChecks.posts, activeChecks.market, activeChecks.messages]);
}

export const isValidUUID = (id) => {
    if (!id) return false;
    const isStandardUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isSovereignID = typeof id === 'string' && id.startsWith('sp_node_');
    return isStandardUUID || isSovereignID;
};



// Promesas activas para evitar ráfagas de errores 400 en paralelo
const activeChecks = {
    posts: null,
    market: null,
    messages: null,
    conversations: null
};

/**
 * Centralized System Entities (Virtual Identities)
 */
const SYSTEM_ENTITIES = [
    {
        id: 'socdepoble',
        full_name: 'Sóc de Poble',
        username: 'socdepoble',
        type: 'empresa',
        town_name: 'Global',
        description: 'La plataforma de connexió rural definitiva. Gent, terra i xarxa. Connectem pobles, persones i territori a través de la tecnologia i la identitat.',
        avatar_url: '/assets/brand/logo_socdepoble_green_square.png',
        cover_url: '/images/campaign/rustic_detail.png',
        category: 'Tecnologia i Comunitat',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'el-rentonar',
        full_name: 'Associació Cultural El Rentonar',
        username: 'rentonar',
        type: 'empresa',
        town_name: 'La Torre de les Maçanes',
        description: 'Entitat gestora de Sóc de Poble i custòdia de la tradició i identitat de La Torre de les Maçanes. Treballem per la memòria viva i la sobirania tecnològica rural. CIF G-03967668.',
        avatar_url: '/assets/brand/logo_socdepoble_green_square.png',
        cover_url: '/images/campaign/rustic_detail.png',
        category: 'Cultura i Tradició',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: '11111111-1a1a-0000-0000-000000000000',
        full_name: 'IAIA (Guia del Poble)',
        type: 'oficial',
        town_name: 'Sóc de Poble',
        description: 'Assistència virtual i guia de la comunitat. Soc la teua acompanyant digital per a tot el que necessites al poble.',
        avatar_url: '/images/agents/iaia_avatar.png',
        cover_url: '/images/campaign/night_party.png',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0',
        full_name: 'Damià Llorens (Perit)',
        username: 'damianllorens',
        type: 'persona',
        town_name: 'Global',
        description: 'Fundador de Sóc de Poble. Dissenyant el futur de la connexió rural viva.',
        avatar_url: '/assets/brand/damia_agutzil_comic.png',
        cover_url: '/images/campaign/night_party.png',
        category: 'Tecnologia',
        is_active: true,
        is_admin: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'a11ac111-eec1-4111-b111-000000000013',
        full_name: 'Anna Climent',
        type: 'persona',
        town_name: 'Ibi / Global',
        description: 'Biòloga, arquitecta i professora. Experta en nutrició saludable i sostenibilitat rural.',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        cover_url: '/images/campaign/night_party.png',
        category: 'gent',
        is_active: true,
        is_admin: true, // Elevating to admin
        created_at: '2026-01-27T18:00:00Z'
    }
];

/**
 * Centralized logic to detect if a profile is fictive (Lore or Demo)
 */
export const isFictiveProfile = (profile) => {
    if (!profile) return false;
    const pid = profile.id || '';
    const email = profile.email || '';

    // Order of priority: Creator account (NEVER fictive), ID prefix (Lore), System IDs, then explicit flag (Demo)
    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
    if (masters.includes(email)) return false;

    return pid.startsWith('11111111-') ||
        pid.startsWith('sdp-') ||
        profile.is_demo === true;
};

/**
 * Hardcoded Lore Personas for Sandbox and AI interaction
 */
const LORE_PERSONAS = [
    { id: '11111111-1a1a-0000-0000-000000000000', full_name: 'IAIA MarIA', username: 'iaia_master', gender: 'female', role: 'official', ofici: 'Matriarca Digital', primary_town: 'Sóc de Poble (Global)', bio: 'Dignitat, terra i xarxa. Soc la teua assistenta (MArIA: Memòria Artificial i Acció) per a tot el que necessites al poble.', avatar_url: '/assets/avatars/iaia_comic_matriarch.png', category: 'gent', type: 'person', onomatopoeia: '🏺', time: 'Sempre' },
    { id: '11111111-1a1a-0001-0000-000000000001', full_name: 'Andreu Soler', username: 'andreu_soler', gender: 'male', role: 'ambassador', ofici: 'Capatàs del Mas', primary_town: 'La Torre de les Maçanes', bio: "L'Andreu és el rellotge del camp.", avatar_url: '/assets/brand/andreu_soler_comic.png', onomatopoeia: '¡PLAS!', category: 'treball', type: 'person', time: '3:35 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000002', full_name: 'Beatriz Ortega', username: 'beatriz_ortega', gender: 'female', role: 'ambassador', ofici: 'Arquitecta de Ferro', primary_town: 'Global', bio: 'Mestre, la V15 està bategant forta!', avatar_url: '/assets/avatars/beatriz_ortega_comic.png', onomatopoeia: '¡CLINC!', category: 'treball', type: 'person', time: '12:19 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000003', full_name: 'Carla Soriano', username: 'carla_soriano', gender: 'female', role: 'ambassador', ofici: 'Harmonitzadora de Batecs', primary_town: 'Ibi', bio: 'Bategat equilibrat, mestre Javi.', avatar_url: '/assets/brand/carla_soriano_comic.png', onomatopoeia: '¡OMMM!', category: 'gent', type: 'person', time: '6:13 p. m.' },
    { id: '11111111-1111-4111-a111-000000000009', full_name: 'Carmen la del Forn', username: 'cuinera', gender: 'female', role: 'ambassador', ofici: 'Cuinera del Mas', primary_town: 'La Torre de les Maçanes', bio: 'La cuina de Pepica és el cor del Mas.', avatar_url: '/assets/brand/carmen_forn_comic.png', onomatopoeia: '¡XUP!', category: 'treball', type: 'person', time: '2:16 p. m.' },
    { id: '11111111-1111-4111-a111-000000000003', full_name: 'Vicent Ferris', username: 'vferris', gender: 'male', role: 'ambassador', ofici: 'Agricultor Gran', primary_town: 'La Torre de les Maçanes', bio: 'Els cicles lunars manen sobre la collita.', avatar_url: '/assets/brand/vicent_ferris_comic.png', onomatopoeia: '¡ZAS!', category: 'treball', type: 'person', time: '5:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000004', full_name: 'Samir Mensah', username: 'samirm', gender: 'male', role: 'ambassador', ofici: 'Artesà', primary_town: 'Ibi', bio: 'Integrant tradicions.', avatar_url: '/assets/avatars/avatar_samir_comic.png', onomatopoeia: '¡TAC!', category: 'gent', type: 'person', time: '4:15 p. m.' },
    { id: '11111111-1111-4111-a111-000000000005', full_name: 'Mariamel', username: 'mariamel', gender: 'female', role: 'ambassador', ofici: 'Historiadora', primary_town: 'Muro', bio: 'Conservant el llegat del poble.', avatar_url: '/assets/products/avatar_mariamel_comic.png', onomatopoeia: '¡SHH!', category: 'gent', type: 'person', time: '1:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000008', full_name: 'Joan Batiste (Avi dels Papers)', username: 'joanbat', gender: 'male', role: 'ambassador', ofici: 'Arxiver', primary_town: 'Cocentaina', bio: 'Tots els documents en regla.', avatar_url: '/assets/brand/joan_batiste_comic.png', onomatopoeia: '¡RASS!', category: 'gent', type: 'person', time: '10:00 a. m.' },
    { id: '11111111-0000-0000-0000-000000000004', full_name: 'Marc (El Gall)', username: 'marcgall', gender: 'male', role: 'official', ofici: 'Alertes Globals', primary_town: 'Global', bio: 'Alçant al Mas cada dia.', avatar_url: '/assets/avatars/avatar_marc_comic.png', onomatopoeia: '¡KIKIRIKI!', category: 'gent', type: 'person', time: '6:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000011', full_name: 'Elena Popova', username: 'elenap', gender: 'female', role: 'ambassador', ofici: 'Innovadora', primary_town: 'Agost', bio: "Buscant el futur a l'entorn rural.", avatar_url: '/assets/brand/elena_popova_comic.png', onomatopoeia: '¡PING!', category: 'gent', type: 'person', time: '2:30 p. m.' },
    { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joanet Serra', username: 'joanets', gender: 'male', role: 'ambassador', ofici: 'Sereno', primary_town: 'Relleu', bio: 'Vigilant les estreles.', avatar_url: '/assets/brand/joanet_serra_comic.png', onomatopoeia: '¡FIUU!', category: 'gent', type: 'person', time: '11:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000013', full_name: 'Lucia', username: 'lucia', gender: 'female', role: 'ambassador', ofici: 'Llibretera', primary_town: 'Banyeres', bio: 'La màgia dels contes vells.', avatar_url: '/assets/avatars/avatar_lucia_comic.png', onomatopoeia: '¡CLAP!', category: 'gent', type: 'person', time: '5:45 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000007', full_name: 'Pepica la de la Vall', username: 'pepica_vall', gender: 'female', role: 'ambassador', ofici: 'Herbolària', primary_town: 'La Vall', bio: 'Remeis naturals.', avatar_url: '/assets/brand/pepica_vall_comic.png', onomatopoeia: '¡TSH!', category: 'treball', type: 'person', time: '8:00 a. m.' },
    { id: '11111111-1a1a-0000-0000-000000000005', full_name: 'Nano Banana', username: 'nanob', gender: 'male', role: 'official', ofici: 'Artista T.I.A.', primary_town: 'Global', bio: '🎨 Píxels i humor.', avatar_url: '/assets/avatars/nano_banana_comic.png', onomatopoeia: '¡POW!', category: 'gent', type: 'person', time: '4:20 p. m.' },
    { id: 'javillinares', full_name: 'Javi Llinares', username: 'javillinares', gender: 'male', role: 'official', ofici: 'Mestre Arquitecte', primary_town: 'La Torre de les Maçanes', bio: '# 🛠 Architect Mode\n\nDesenvolupador principal d\'Antigravity i creador de la xarxa **Sóc de Poble**.\n\n## Els Meus Principis\n- Local-First per garantir la resiliència del poble davant caigudes.\n- Trellat en l\'escriptura de codi.\n- Protecció de l\'Essència Rural mitjançant la IAIA.\n\n### Visió de Futur\n*Programant infraestructures indestructibles.*', avatar_url: '/Javi_Llinares-Foto_perfil-1.jpg', header_image_url: '/assets/avatars/javi_cover.jpg', category: 'tecnologia', type: 'person', time: 'Sempre' }
];

const _throttleLocks = new Map();

/**
 * Verifica si una acción es demasiado frecuente (Throttling) con locks de concurrencia
 * @param {string} userId
 * @param {string} actionType
 * @param {number} limitMs
 */
const checkThrottling = async (userId, actionType, limitMs = 3000) => {
    const now = Date.now();
    const key = `${userId}_${actionType}`;
    const lock = _throttleLocks.get(key) || { lastTime: 0, pending: 0 };

    if (lock.pending > 5) {
        throw new Error('Massa peticions simultànies. Espera un poc.');
    }

    lock.pending++;
    _throttleLocks.set(key, lock);

    try {
        if (now - lock.lastTime < limitMs) {
            throw new Error(`Acció massa ràpida. Espera ${Math.ceil((limitMs - (now - lock.lastTime)) / 1000)} segons.`);
        }
        lock.lastTime = now;
    } finally {
        lock.pending--;
        // Mantenim el lock actualitzat
        _throttleLocks.set(key, lock);
        
        // [GC OMEGA-3] Garbage Collection del lock per no saturar memòria en sessions llargues
        if (lock.pending === 0) {
            setTimeout(() => {
                const currentLock = _throttleLocks.get(key);
                if (currentLock && currentLock.pending === 0 && Date.now() - currentLock.lastTime >= limitMs) {
                    _throttleLocks.delete(key);
                }
            }, limitMs + 50);
        }
    }
};

const TOWNS_MAP = {
    1: 'La Torre de les Maçanes',
    2: 'Cocentaina',
    3: 'Muro d\'Alcoi',
    'la-torre': 'La Torre de les Maçanes',
    'cocentaina': 'Cocentaina',
    'muro': 'Muro d\'Alcoi',
    4: 'Agost',
    'agost': 'Agost'
};

/**
 * Normaliza un item de feed/market con fallbacks robustos
 */
const normalizeContentItem = (item, type = 'post') => {
    if (!item) return null;

    const isJaviMaster = (
        item.author_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || 
        item.author_user_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || 
        item.author === 'Javi Llinares' || 
        item.author_name === 'Javi Llinares' ||
        item.author === 'socdepoblecom' || 
        item.author_name === 'socdepoblecom' || 
        item.username === 'socdepoblecom' ||
        item.author_email?.includes('socdepoblecom')
    );

    const joinedAvatar = item.profiles?.avatar_url || item.entities?.avatar_url;
    const joinedName = item.profiles?.full_name || item.entities?.name;

    const authorName = isJaviMaster ? 'Javi Llinares' : (joinedName || item.author || item.author_name || item.seller || item.seller_name || (type === 'market' ? 'Productor Local' : 'Veí del Poble'));
    const avatarUrl = isJaviMaster ? '/assets/master/javi_avatar_cinematic.png' : (joinedAvatar || item.avatar_url || item.author_avatar || item.author_avatar_url || '/assets/avatars/avatar_man_1.png');

    // [MASTER HEALER] Fallback d'imatges intel·ligent per al Mercat
    let imageUrl = item.image_url || item.image;
    if (!imageUrl && type === 'market') {
        const title = (item.title || '').toLowerCase();
        if (title.includes('mel')) imageUrl = '/images/assets/mel_premium.png';
        else if (title.includes('oli')) imageUrl = '/images/assets/oli_premium.png';
        else if (title.includes('poma') || title.includes('apple')) imageUrl = '/images/assets/apples_premium.png';
        else if (title.includes('tomate')) imageUrl = '/images/assets/tomates_premium.png';
        else if (title.includes('coque')) imageUrl = '/images/assets/coques_premium.png';
        else if (title.includes('formatge')) imageUrl = '/images/assets/formatge.png';
        else imageUrl = '/images/assets/generic_market.png';
    }

    // Resolución de pueblos con validación
    let townName = isJaviMaster ? 'La Torre de les Maçanes' : 'Al teu poble';
    if (!isJaviMaster) {
        if (item.towns?.name) {
            townName = item.towns.name;
        } else if (item.town_id && TOWNS_MAP[item.town_id]) {
            townName = TOWNS_MAP[item.town_id];
        } else if (item.town_name) {
            townName = item.town_name;
        }
    }

    return {
        ...item,
        id: item.uuid || item.id,
        uuid: item.uuid || item.id,
        author: authorName,
        seller: type === 'market' ? authorName : undefined,
        author_avatar: avatarUrl,
        author_role: isJaviMaster ? 'official' : (type === 'market' ? 'freelance' : (item.author_role || 'vei')),
        avatar_url: avatarUrl,
        author_user_id: isJaviMaster ? '25218ea4-5d7d-4db4-bdc5-7ae035629242' : (item.author_user_id || (item.author_role === 'user' ? item.author_id : (item.author_user_id || null))),
        author_entity_id: item.author_entity_id || (item.author_role !== 'user' ? (item.entity_id || item.author_id) : (item.author_entity_id || null)),
        towns: { name: townName },
        image_url: imageUrl,
        is_iaia_inspired: item.is_iaia_inspired || false,
        ai_percentage: item.ai_percentage || 0,
        human_percentage: item.human_percentage || 100,
        time_saved_minutes: item.time_saved_minutes || 0,
        semantic_tags: item.semantic_tags || [],
        external_links: item.external_links || []
    };
};
// [GHOST-SHIELD] Known broken or legacy storage assets that trigger 404/400 console errors
const BROKEN_STORAGE_URLS = [
    'javi_avatar.png',
    'profiles/javi_avatar.png',
    'avatars/javi_avatar.png'
];

export { columnCache, setColumnCache, _ensureColumnCache, LocalCache, isRealDBUUID, normalizeContentItem, checkThrottling, activeChecks, getTimeAwareGreeting, adjustGender, LORE_PERSONAS, ENABLE_MOCKS, DEMO_USER_ID };

export const supabaseService = {
    supabase,
    /**
     * [STORAGE HEALING]
     * Detects and fixes legacy or broken storage URLs.
     */
    normalizeStorageUrl(url) {
        if (!url) return url;

        // [GHOST-SHIELD] Pre-flight block for known broken remote assets
        if (typeof url === 'string') {
            const isBroken = BROKEN_STORAGE_URLS.some(broken => url.includes(broken));
            if (isBroken) {
                logger.debug(`[GhostShield] Blocking request to known broken asset: ${url}`);
                // Return a safe local placeholder that exists in the repo
                return '/assets/master/javi_avatar_cinematic.png';
            }
        }

        // [MASTER BLINDATGE] Purguem rutes absolutes locals que s'hagen pogut colar
        // Admitem 'Users/' sense barra inicial per caçar rutes relatives malformades
        const localPathPattern = /(\/?Users\/|C:\\|D:\\|E:\\|F:\\|G:\\|H:\\|I:\\|J:\\)/i;
        if (typeof url === 'string' && localPathPattern.test(url)) {
            const fileName = url.split(/[/\\]/).pop();
            // Intentem recuperar-la de la carpeta de relíquies del Mas o fallback d'assets
            logger.warn(`[SupabaseService] Ruta absoluta detectada i sanejada: ${url}`);
            
            // Si el fitxer sembla un avatar, usem el path de profiles
            if (url.includes('avatar') || url.includes('profile')) {
                return `/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
            }
            
            // Fallback general a assets/brain
            return `/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
        }

        return url;
    },

    normalizeProfile(profile) {
        if (!profile) return null;
        return {
            ...profile,
            avatar_url: this.normalizeStorageUrl(profile.avatar_url),
            cover_url: this.normalizeStorageUrl(profile.cover_url)
        };
    },

    /**
    /**
     * Account Deletion System (5s Fast Track)
     * Calls the secure RPC 'delete_user' which invokes PostgreSQL ON DELETE CASCADE.
     */
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
                if (error.code === '42P01') logger.warn('Notifications table missing');
                else logger.error('Error creating notification:', error);
            }
        } catch (e) {
            logger.error('Create notification exception:', e);
        }
    },

    // Admin Stats (Live)
    async getAdminStats() {
        try {
            const now = new Date();
            const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();

            // Total Real Users
            const { count: totalUsers, error: _countError } = await supabase
                .from('profiles')
                .select('id', { count: 'exact' })
                .eq('is_demo', false)
                .limit(1);

            // New Users (24h)
            const { data: newUsers, error: _newError } = await supabase
                .from('profiles')
                .select('id, full_name, created_at')
                .eq('is_demo', false)
                .gte('created_at', yesterday)
                .order('created_at', { ascending: false });

            // System Health (Check if any critical errors logged - using notifications for now)
            const { count: errorCount } = await supabase
                .from('notifications')
                .select('id', { count: 'exact' })
                .eq('type', 'system_error')
                .gte('created_at', yesterday)
                .limit(1);

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

    // Global OverView (Total Vision for UCC)
    async getGlobalOverview() {
        try {
            const [stats, seo, { data: recentPosts }, { data: recentMarket }, { data: recentProfiles }] = await Promise.all([
                this.getAdminStats(),
                this.getSEOStats(),
                supabase.from('posts').select('id, content, created_at, author, author_role').order('created_at', { ascending: false }).limit(10),
                supabase.from('market_items').select('uuid, title, price, created_at, seller:author_role, avatar_url').order('created_at', { ascending: false }).limit(10),
                supabase.from('profiles').select('id, full_name, created_at').eq('is_demo', false).order('created_at', { ascending: false }).limit(10)
            ]);

            // Combine and normalize for Activity Pipeline
            const timeline = [
                ...(recentPosts || []).map(p => normalizeContentItem({ ...p, type: 'post', label: 'Nou Post al Mur' }, 'post')),
                ...(recentMarket || []).map(m => normalizeContentItem({ ...m, type: 'market', label: 'Nou Producte' }, 'market')),
                ...(recentProfiles || []).map(u => ({ ...u, type: 'user', label: 'Nou Ciutadà', title: u.full_name, author: u.full_name }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return {
                stats,
                seo,
                timeline: timeline.slice(0, 20)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error in getGlobalOverview:', err);
            // Trace the exact error structure for 400/404 debugging
            if (err.details || err.hint) {
                logger.warn(`[SupabaseService] Query Fail: ${err.message} | ${err.details} | ${err.hint}`);
            }
            return { stats: {}, seo: {}, timeline: [] };
        }
    },

    // God-Level User Management (Noise Filtering)
    async updateUserModeration(userId, data) {
        try {
            logger.info(`[Admin] Actualitzant moderació per a ${userId}:`, data);
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_noise: data.is_noise,
                    is_silenced: data.is_silenced,
                    reputation_score: data.reputation_score
                })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('Error updating user moderation:', e);
            throw e;
        }
    },

    async getModeratedPosts(options = {}) {
        try {
            let query = supabase.from('posts').select('*, towns(name), author:profiles!author_id(*)');

            // Logic to filter ONLY if 'filterNoise' is active
            if (options.filterNoise) {
                query = query.eq('author.is_noise', false);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data.map(normalizeContentItem);
        } catch (e) {
            logger.error('Error fetching moderated posts:', e);
            return [];
        }
    },

    // SEO / Health Stats (Admin)
    async getSEOStats() {
        try {
            // Simulated SEO Metrics for now (until we integrate Google Search Console API)
            // Real checks for sitemap and robots (Using GET to avoid SW Cache conflicts)
            const hasSitemap = await fetch('/sitemap.xml', { method: 'GET' }).then(r => r.ok).catch(() => false);
            const hasRobots = await fetch('/robots.txt', { method: 'GET' }).then(r => r.ok).catch(() => false);

            return {
                healthScore: hasSitemap && hasRobots ? 98 : 85, // Mock score based on basic checks
                indexedPages: 142, // Mock
                issues: !hasSitemap ? 1 : 0,
                lastCrawl: new Date().toISOString(),
                hasSitemap,
                hasRobots
            };
        } catch (error) {
            logger.warn('Error checking SEO stats:', error);
            return {
                healthScore: 0,
                indexedPages: 0,
                issues: 0,
                lastCrawl: null,
                hasSitemap: false,
                hasRobots: false
            };
        }
    },

    async getPostComments(postId) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
            if (!isUUID || String(postId).startsWith('mock-') || String(postId).startsWith('anna-') || String(postId).includes('-')) {
                // If it's a slug or mock, return empty array without crashing
                // Slugs (like 'busquem-socis-tecnologics') don't have comments in DB yet
                return [];
            }

            const { data, error } = await supabase
                .from('post_comments')
                .select('*, profiles!user_id(full_name, avatar_url)')
                .eq('post_uuid', postId)
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    logger.warn('post_comments table missing, returning empty array');
                    return [];
                }
                throw error;
            }
            return data || [];
        } catch (e) {
            logger.error('Error fetching post comments:', e);
            return [];
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
            const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
            const isRealUser = p.is_demo === false ||
                masters.includes(p.email) ||
                p.username?.toLowerCase().includes('javillinares') ||
                p.username?.toLowerCase().includes('socdepoble');

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
        const rawPersonas = [...dbPersonas, ...LORE_PERSONAS];

        // Deduplicació real vs fictici per ID (Prioritat al Real/DB)
        const uniqueById = new Map();
        rawPersonas.forEach(p => {
            const pid = p.id;
            if (!pid) return;
            // Si ja existeix, donem prioritat al perfil que NO siga fictici o que tinga més info
            if (!uniqueById.has(pid)) {
                uniqueById.set(pid, p);
            } else {
                const existing = uniqueById.get(pid);
                const isExistingFictive = isFictiveProfile(existing);
                const isNewFictive = isFictiveProfile(p);

                if (isExistingFictive && !isNewFictive) {
                    uniqueById.set(pid, p);
                }
            }
        });

        const mergedPersonas = Array.from(uniqueById.values());

        // Lògica de Sincronització de Producció:
        // [MASTER IDENTITY PROTECTION] Solo dejamos perfiles reales en producción
        if (!isPlayground) {
            return mergedPersonas.filter(p => {
                const pid = p.id || '';
                // [GHOST-SHIELD EXTREME] Purgamos cualquier ID ficticio o de demo
                const isFictive = pid.startsWith('11111111-') || pid.startsWith('sdp-') || p.is_demo === true;
                const _isOfficial = p.role === 'official' || p.type === 'oficial';
                const isRealUser = (p.type === 'person' || p.type === 'user') && !isFictive;

                // En producció REAL, permetem humans autenticats i IDENTITATS CORE de la IAIA (ID 11111111-*)
                return (isRealUser && !isFictive) || (isFictive && pid.startsWith('11111111-'));
            }).sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        }

        return mergedPersonas.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    },

    async getAdminEntities(isPlayground = false) {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            logger.warn(`[SupabaseService] getAdminEntities error ignorat (probablement falta la taula entities):`, error);
        }
        
        const safeData = data || [];

        // En producció filtrem les entitats fictícies (demo o Lore-based)
        // I per petició legal, ocultem qualsevol entitat que no sigui del sistema si no estem en mode Playground
        if (!isPlayground) {
            // Mostrem entitats de sistema o del llinatge oficial
            const dbSystem = safeData.filter(e => e.type === 'system' || e.type === 'oficial' || e.owner_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242');
            return [...SYSTEM_ENTITIES, ...dbSystem];
        }

        return [...SYSTEM_ENTITIES, ...safeData];
    },

    // Chats (Secure Messaging - Phase 4)
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !isRealDBUUID(userIdOrEntityId))) {
            // [GUEST-FIRST] Forsters and sovereign IDs don't use Mock Chats anymore
            // to keep the Chat List clean with the 13+ official Agents.
            return [];
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
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
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

    async sendSecureMessage(messageData, abortSignal = null, retryCount = 0) {
        if (retryCount > 2) {
            logger.error('[SupabaseService] Recursió infinita aturada en sendSecureMessage');
            throw new Error("Recursió infinita detectada a l'enviar missatge");
        }
        
        if (messageData.senderId && !messageData.isGuest && !messageData.is_ai) {
            await checkThrottling(messageData.senderId, 'send_message', 1000).catch(e => logger.warn('Throttling warn', e));
        }
        // [FAILSAFE GLOBAL]: Si el conversationId és un Mock, un Local-Conv de Playground, o no s'ha arribat a canviar mai (1111... que és la IA)
        if (messageData.conversationId?.startsWith('mock-') || 
            messageData.conversationId?.startsWith('local-conv-') || 
            messageData.conversationId?.startsWith('11111111-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation or unhydrated IAIA agent');
            return {
                id: crypto.randomUUID(), // Prevent mapping issues
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString(),
                is_ai: false
            };
        }

        // [BATEGAT ANONYMOUS BYPASS] 
        // Si és un usuari anònim enviant a la IAIA, no ho guardem a Supabase
        // per evitar errors de constraint (400) pel sender_id no existent.
        // Simularem l'èxit i invocarem la resposta local.
        if (messageData.isGuest || !messageData.senderId || messageData.senderId === 'guest' || String(messageData.senderId).startsWith('anonymous')) {
            logger.warn('[supabaseService] Intent de sendSecureMessage per usuari anònim. Guardant en local (efímer).');
            const guestMessage = { 
                id: `guest-msg-${Date.now()}`, 
                conversation_id: messageData.conversationId, 
                sender_id: messageData.senderId || 'guest', 
                content: messageData.content, 
                created_at: new Date().toISOString(),
                is_ai: false
            };
            
            // Si la conversació és amb una IAIA (p.ex. IAIA MarIA), activem la resposta ràpida simulada
            if (messageData.conversationId && messageData.conversationId.startsWith('c1111000')) {
                 const personaInfo = LORE_PERSONAS.find(p => p.id === '11111111-1a1a-0000-0000-000000000000'); // IAIA Maria default
                 const responderId = messageData.conversationId.replace('c', ''); // Aproximació per al Mock
                 this.triggerSimulatedReply({ ...messageData, responderId, responderType: 'bot', persona: personaInfo || LORE_PERSONAS[0] });
            }

            return guestMessage;
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
            id: crypto.randomUUID(),
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

        // [BUGFIX 400 Bad Request] We construct the select query string dynamically to PREVENT
        // asking for columns that don't exist.
        let safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read';
        
        if (columnCache.messages_is_playground !== false) {
           safeColumns += ', is_playground';
        }
        
        const selectStr = columnCache.messages_post_uuid !== false ? `${safeColumns}, post_uuid` : safeColumns;

        let query = supabase
            .from('messages')
            .insert(validated)
            .select(selectStr);
            
        if (abortSignal) {
            query = query.abortSignal(abortSignal);
        }

        const { data, error } = await query;

        if (error) {
            const isMissingPostUuid = (error.code === '42703' || error.code === 'PGRST204') && msgPayload.post_uuid;
            const isMissingPlayground = error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false;

            if (isMissingPlayground) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData, abortSignal, retryCount + 1);
            }
            if (isMissingPostUuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData, abortSignal, retryCount + 1);
            }
            if (error.code === '42501') {
                logger.error('[SupabaseService] RLS Permission Denied on messages table.');
                throw { success: false, error: 'Accés denegat (RLS)', code: '42501' }; // Fals èxit suprimit per seguretat (C5)
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
        // const { data: conv } = await supabase
        //     .from('view_conversations_enriched')
        //     .select('*')
        //     .eq('id', messageData.conversationId)
        //     .limit(1)
        //     .maybeSingle();

        // const responderId = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_id : conv?.participant_1_id;
        // [Bot Reply Engine]
        // Lógica de respuesta simulada removida de aquí. Ahora iaiaService.js (generateAIAResponse) 
        // gestiona de forma exclusiva los fillers asépticos y la IA real (Gemini) para evitar duplicidades.
        // if (isToLore || responderIsAI || messageData.conversationId.startsWith('c1111000')) {
        //     // Buscamos persona de forma SINCRÓNICA para ganar milisegundos
        //     // const persona = LORE_PERSONAS.find(p => p.id === responderId);
        //     // this.triggerSimulatedReply({ ...messageData, responderId, responderType, persona });
        // }

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
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: responderId,
                sender_entity_id: responderType === 'entity' ? responderId : null,
                content: reply
            };

            // Solo añadimos is_ai si la caché no dice lo contrario
            if (columnCache.messages_is_ai !== false) {
                payload.is_ai = true;
            }

            const { error: insError } = await supabase.from('messages').insert(payload);

            if (insError && insError.code === '42703') { // Undefined column
                columnCache.messages_is_ai = false;
                delete payload.is_ai;
                await supabase.from('messages').insert(payload);
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

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type, retryCount = 0) {
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

        // [HOTFIX] Eliminat `is_playground` del payload i del .select() per evitar el llançament 
        // constants errors HTTP 400 (42703) quan la columna no està desplegada al Postgres de Producció.
        const validated = ConversationSchema.parse(convPayload);
        
        const selectStr = 'id, participant_1_id, participant_2_id, created_at';

        const { data, error } = await supabase
            .from('conversations')
            .insert(validated)
            .select(selectStr);

        if (error) {
            // Retratem per console però sense llançar el warning d'error PGRST204 ni el reintent circular
            if (error.code === 'PGRST204' || error.code === '42703') {
                logger.warn('[SupabaseService] PGRST204 o 42703 rebut. Ignorant i bypassejant a causa de diferències en esquemes de Database', error);
            }

            // Auditoria V4 (DeepSeek): Resolució Condició de Cursa Optimística
            if (error.code === '23505') {
                if (retryCount > 2) throw new Error('Recursió aturada en getOrCreateConversation');
                logger.warn('[SupabaseService] 💥 Condició de cursa detectada creant conversació (23505 Unique Violation). Aplicant lectura recursiva salvadora (Optimistic Lock).');
                return await this.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type, retryCount + 1);
            }

            // [RLS / FK / CHECK BYPASS] EN MODE PLAYGROUND O SENSE PERFILS, L'ERROR 401, 403, 23503 (FK) O 23514 (CHECK) ÉS ESPERAT
            if (isPlayground && (error.code === '42501' || error.code === '23503' || error.code === '23514' || error.status === 401 || error.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ DB Bypass Activat (Error ${error.code || error.status}): Creant conversa local/mock per a la IA.`);
                return {
                    id: `local-conv-${p1Id.substring(0, 4)}-${p2Id.substring(0, 4)}`,
                    participant_1_id: p1Id,
                    participant_1_type: p1Type,
                    participant_2_id: p2Id,
                    participant_2_type: p2Type,
                    is_playground: true,
                    created_at: new Date().toISOString()
                };
            }
            throw error;
        }
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        if (!conversationId || conversationId.startsWith('mock-') || !isRealDBUUID(conversationId)) return;
        
        // [GUEST SHIELD] Si el userId no és un UUID vàlid de base de dades, no marquem a la DB real
        if (!userId || !isRealDBUUID(userId)) {
            logger.info('[SupabaseService] Foraster detectat, markMessagesAsRead virtualitzat.');
            return;
        }

        const { error } = await supabase.rpc('mark_messages_as_read', {
            conv_id: conversationId,
            user_id: userId
        });

        if (error) {
            if (error.code === '22P02') {
                logger.warn('[SupabaseService] UUID syntax error in markMessagesAsRead, skipping.');
                return;
            }
            throw error;
        }
    },

    // [PROTOCOL REALTIME OMEGA] Bategat monitoritzat màxima eficiència
    subscribeToMessages(conversationId, callback) {
        if (!conversationId) return null;
        
        if (!this._activeChannels) this._activeChannels = new Map();
        if (!this._zombieChannels) this._zombieChannels = new Map();
        const MAX_ACTIVE_CHANNELS = 50; // Supabase Free tier permet màx 100 de forma segura
        
        // LRU Eviction: Tancar canal si estem al límit
        if (this._activeChannels.size >= MAX_ACTIVE_CHANNELS) {
            const oldestKey = this._activeChannels.keys().next().value;
            const oldestChannel = this._activeChannels.get(oldestKey);
            supabase.removeChannel(oldestChannel);
            this._activeChannels.delete(oldestKey);
            logger.warn(`[SupabaseService] LRU Eviction executada: Canal ${oldestKey} liquidat per saturació.`);
        }
        
        const channelKey = `chat:${conversationId}`;
        
        // [MASTER FIX] Purge Ghost Timeouts & Zombie Channels
        if (this._zombieChannels.has(channelKey)) {
            const zombie = this._zombieChannels.get(channelKey);
            clearTimeout(zombie.timeoutId);
            try {
                supabase.removeChannel(zombie.channel).catch(() => {});
            } catch (e) {
                logger.debug('[SupabaseService] Silent zombie remove error', e);
            }
            this._zombieChannels.delete(channelKey);
            logger.info(`[SupabaseService] Ghost timeout i canal zombie purgats per ${channelKey} abans de reconnectar.`);
        }
        
        if (this._activeChannels.has(channelKey)) {
            supabase.removeChannel(this._activeChannels.get(channelKey));
            this._activeChannels.delete(channelKey);
        }
        
        logger.info(`[SupabaseService] Connectant al canal realtime per a: ${conversationId}`);
        const channel = supabase.channel(channelKey)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, callback)
            .subscribe();
            
        this._activeChannels.set(channelKey, channel);
        return channel;
    },

    unsubscribe(channel) {
        if (channel) {
            const channelKey = channel.topic || channel.name || 'unknown-channel';
            
            if (!this._zombieChannels) this._zombieChannels = new Map();

            // Evitar duplicitat de timeouts si s'invoca repetidament sobre el mateix canal
            if (this._zombieChannels.has(channelKey)) {
                clearTimeout(this._zombieChannels.get(channelKey).timeoutId);
            }

            // [MASTER FIX] Prevenir 'WebSocket closed before the connection is established'
            // Retardem l'ordre de desconnexió per donar oxigen al handshake de Connexió
            const timeoutId = setTimeout(() => {
                try {
                    supabase.removeChannel(channel).catch(() => {});
                } catch (e) {
                    logger.debug('[SupabaseService] Silent remove error', e);
                }
                this._zombieChannels.delete(channelKey);
            }, 800);

            this._zombieChannels.set(channelKey, { channel, timeoutId });

            if (this._activeChannels) {
                this._activeChannels.forEach((val, key) => {
                    if (val === channel) this._activeChannels.delete(key);
                });
            }
            logger.info(`[SupabaseService] Canal realtime ${channelKey} desconnectat netament sense bloquejos orfes.`);
        }
    },

    // Pueblos
    async getTowns() {
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*');

            if (error) throw error;

            let townsList = data || [];
            
            // [GHOST-BATEGAT] Inyectem Agost si no està a la DB (Integració Sixto Pina)
            if (!townsList.some(t => t.id === 4 || t.name === 'Agost')) {
                townsList.push({
                    id: 4,
                    uuid: 'agost-4-uuid',
                    name: 'Agost',
                    description: 'Poble de tradició terrissaire i artesana, on el bategat del ferro de Sixto Pina i el fang de les seues fàbriques crea una identitat única.',
                    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Escudo_de_Agost.svg',
                    image_url: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000',
                    province: 'Alacant',
                    comarca: 'L\'Alacantí'
                });
            }

            return townsList.map(town => {
                // [MASTER DIRECTIVE] ALGORISME DEL BATEC TERRITORIAL
                // 1. Identifiquem l'activitat de l'usuari des del solatge local
                const lastActiveTownId = localStorage.getItem('last_active_town_id');
                const secondaryTownId = localStorage.getItem('secondary_town_id');
                const profile = JSON.parse(localStorage.getItem('sdp_profile') || 'null');
                const primaryTownId = profile?.town_uuid || profile?.town_id;

                // [ONTOMÈTRICA] Calculem la força de la connexió (Batec)
                let connectionStrength = 0;
                const townId = town.uuid || town.id;

                if (townId === lastActiveTownId) connectionStrength += 1000;
                if (townId === primaryTownId) connectionStrength += 500;
                if (townId === secondaryTownId) connectionStrength += 250;

                // [MASTER PRIORITY] Benimassot, La Torre, Penàguila
                const lowerName = town.name?.toLowerCase() || "";
                if (lowerName.includes("benimassot") || 
                    lowerName.includes("la torre") || 
                    lowerName.includes("penàguila")) {
                    connectionStrength += 5000; // Force to top
                }

                // [MASTER IMAGE FALLBACK]
                let townImage = town.image_url;
                if (!townImage) {
                  if (lowerName.includes("benimassot")) townImage = "/assets/brand/img_benimassot_main.jpg";
                  if (lowerName.includes("la torre")) townImage = "/assets/brand/img_la_torre_de_les_ma_anes_main.jpg";
                  if (lowerName.includes("penàguila")) townImage = "/assets/brand/img_pen_guila_main.jpg";
                }

                return {
                    ...town,
                    logo_url: normalizeWikipediaUrl(town.logo_url),
                    image_url: normalizeWikipediaUrl(townImage),
                    connection_strength: connectionStrength,
                    is_community: true // Diferenciació Poble vs Ajuntament
                };
            }).sort((a, b) => {
                // Prioritat: Força del Batec > Ordre Alfabètic
                if (b.connection_strength !== a.connection_strength) {
                    return b.connection_strength - a.connection_strength;
                }
                return a.name.localeCompare(b.name);
            });
        } catch (e) {
            logger.error('Error in getTowns:', e);
            return [];
        }
    },

    async getTownBatecImage(townId) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // [PROTOCOL FLASH] Meritocràcia Visual + Atribució CC BY
            const { data, error } = await supabase
                .from('posts')
                .select('image_url, connections_count, author_name')
                .eq('town_id', townId)
                .not('image_url', 'is', null)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('connections_count', { ascending: false })
                .limit(1);

            if (error || !data || data.length === 0) return null;
            return {
                url: normalizeWikipediaUrl(data[0].image_url),
                author: data[0].author_name
            };
        } catch (e) {
            logger.warn(`No s'ha pogut trobar imatge de batec recent per a ${townId}:`, e);
            return null;
        }
    },

    async createPioneerTown({ name, province, comarca }) {
        try {
            // [ESCALA NACIONAL] Si un usuario de Extremadura o fuera busca su pueblo y no existe, 
            // este método lo crea dinámicamente usando Wikipedia para el resumen y shield.
            
            // 1. Obtener información básica de la Wikipedia española o catalana
            const { wikipediaService } = await import('./wikipediaService');
            const summary = await wikipediaService.getTownSummary(name, 'es'); // Preferimos español para expansión nacional, fallará seguro la 'ca' para Extremadura.
            const shield = await wikipediaService.getTownShield(name);

            const newTownData = {
                name: name.trim(),
                province: province.trim(),
                comarca: comarca ? comarca.trim() : 'Poble Pioner',
                description: summary?.extract || `Municipi pioner de ${province.trim()} recentment fundat a la xarxa Sóc de Poble.`,
                logo_url: shield || null,
                population: summary?.population || null
            };

            const { data, error } = await supabase
                .from('towns')
                .insert(newTownData)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`[Towns] Error creating pioneer town ${name}:`, error);
            throw error;
        }
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
            // Deduplicació de filtres per evitar error 400
            // Nota: towns només té name i description seguint supabase_towns_setup.sql
            const filterTerms = new Set();
            ['name', 'description'].forEach(col => {
                filterTerms.add(`${col}.ilike.%${sanitizedQuery}%`);
            });

            const orClause = Array.from(filterTerms).join(',');

            // NIVELL DIOS: Cerca transversal en municipis
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(orClause)
                .order('name', { ascending: true })
                .limit(40);

            if (error) throw error;
            return (data || []).map(t => ({
                ...t,
                logo_url: normalizeWikipediaUrl(t.logo_url),
                image_url: normalizeWikipediaUrl(t.image_url)
            }));
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
            // Deduplicació intel·ligent per evitar error 400 (Duplicate filters)
            const filterTerms = new Set();
            [cleanQuery, normalizedName].forEach(q => {
                if (!q) return;
                // [FIX] Robusteza en PostgREST: Remove commas and quotes instead of wrapping in quotes
                const safeQ = q.replace(/[,"]/g, '');
                filterTerms.add(`full_name.ilike.%${safeQ}%`);
                filterTerms.add(`username.ilike.%${safeQ}%`);
                filterTerms.add(`primary_town.ilike.%${safeQ}%`);
            });

            // Afegim els altres camps que no depenen de la normalització de noms de poble/persona
            filterTerms.add(`role.ilike."%${cleanQuery}%"`);
            filterTerms.add(`ofici.ilike."%${cleanQuery}%"`);
            filterTerms.add(`bio.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] profiles orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Cerca OMNISCIENT en perfils
            let queryBuilder = supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, primary_town, bio, ofici, is_demo')
                .or(orClause);

            const isPlayground = localStorage.getItem('playground_mode') === 'true';
            if (!isPlayground) {
                queryBuilder = queryBuilder.eq('is_demo', false);
            }

            const { data, error } = await queryBuilder
                .order('full_name', { ascending: true })
                .limit(50);

            if (error) throw error;

            // Include lore personas in search with OmniMatch (Nivell Dios)
            const allPersonas = await this.getAllPersonas();
            const filteredLore = allPersonas.filter(p =>
                omniMatch(p.full_name, query) ||
                omniMatch(p.username, query) ||
                omniMatch(p.role, query) ||
                omniMatch(p.primary_town, query) ||
                omniMatch(p.ofici, query) ||
                omniMatch(p.bio, query)
            );

            // Merge and deduplicate by ID and full_name, prioritizing DB/Real
            const unique = [];
            const seenIds = new Set();
            const seenNames = new Set();

            const _combined = [...filteredLore, ...(data || [])];

            // Prioritzem data (DB) al final del merge si volem que "machaque", 
            // però aquí la lògica de .forEach d'un array barrejant-los un a un és clau.
            // Millor: Processar primer els Reals (DB) i després Lore si no s'han vist.

            const profilesToProcess = [
                ...(data || []), // DB first (Priority)
                ...filteredLore  // Lore second
            ];

            profilesToProcess.forEach(p => {
                const id = p.id;
                const nameKey = p.full_name?.toLowerCase().trim();

                if (!seenIds.has(id) && !seenNames.has(nameKey)) {
                    seenIds.add(id);
                    if (nameKey) seenNames.add(nameKey);

                    unique.push({
                        ...p,
                        town_name: p.town_name || p.primary_town
                    });
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
        const normalizedCanonical = getNormalizedQuery(query); // E.g. "Sóc de Poble"
        const cleanQuery = query.toLowerCase().trim();

        // 1. DEFINICIÓ D'ENTITATS DE SISTEMA (Veritat Única - Usant constant centralitzada)
        const systemEntities = SYSTEM_ENTITIES;

        // 2. FILTRATGE OMNISCIENT DE SISTEMA (Sempre disponible)
        const filteredSystem = systemEntities.filter(e =>
            omniMatch(e.name, query) ||
            omniMatch(e.name, normalizedCanonical) ||
            omniMatch(e.type, query) ||
            omniMatch(e.town_name, query)
        );

        let dbResults = [];
        try {
            const filterTerms = new Set();
            const termsToTry = [cleanQuery, normalizedCanonical].filter(Boolean);

            termsToTry.forEach(q => {
                const term = q.trim().toLowerCase().replace(/[,"]/g, '');
                filterTerms.add(`full_name.ilike.%${term}%`);
                filterTerms.add(`username.ilike.%${term}%`);
            });

            // Camps extra
            filterTerms.add(`role.ilike."%${cleanQuery}%"`);
            filterTerms.add(`bio.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] entities properly querying profiles with orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Entitats, Comerços i Projectes mapped to profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, bio')
                .eq('role', 'entitat')
                .or(orClause)
                .limit(50);

            if (error) throw error;
            // Map the profile fields to match entity expected fields (name, type, description)
            dbResults = (data || []).map(p => ({
                id: p.id,
                name: p.full_name || p.username,
                type: p.role,
                avatar_url: p.avatar_url,
                description: p.bio
            }));
        } catch (error) {
            logger.error('[SupabaseService] Error in searchEntities (DB):', error);
            // Seguim endavant amb filteredSystem encara que la DB falle
        }

        // 3. TAXONOMIA I NETEJA
        const sanitizedDbResults = dbResults.map(e => {
            let mappedType = e.type;
            if (e.type === 'negoci' || e.type === 'comerç') mappedType = 'empresa';
            if (e.type === 'associacio') mappedType = 'institucio';

            // Forçar "Sóc de Poble" com a empresa si el nom quadra (OmniMatch)
            if (omniMatch(e.name, 'Sóc de Poble') || omniMatch(e.name, 'Soc de Poble')) {
                mappedType = 'empresa';
            }

            return {
                ...e,
                type: mappedType,
                avatar_url: normalizeWikipediaUrl(e.avatar_url)
            };
        });

        // 4. MERGE I PRIORITZACIÓ (Codi Genius: Sistema > DB)
        // Posem primer les del sistema per a que eixquen dalt i deduplicació no les esborre
        const combined = [...filteredSystem, ...sanitizedDbResults];
        const unique = [];
        const ids = new Set();

        combined.forEach(e => {
            if (!ids.has(e.id)) {
                ids.add(e.id);
                unique.push(e);
            }
        });

        return unique;
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
        if (columnCache.connections_table === false) return true;

        const isRealFollower = isRealDBUUID(followerId);
        const isRealTarget = isRealDBUUID(targetId);

        // Simulation for System/Lore entities that don't have valid UUIDs or aren't in auth.users
        if (!isRealFollower || !isRealTarget || isFictiveProfile({ id: targetId })) {
            logger.info(`[SupabaseService] Virtual Connection detected for ${targetId}. Simulating...`);
            // Store virtually in localStorage for current session persistence
            const virtualKey = `v_conn_${followerId}`;
            const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
            if (!connections.includes(targetId)) {
                connections.push(targetId);
                localStorage.setItem(virtualKey, JSON.stringify(connections));
            }
            return true;
        }

        try {
            const { error, status } = await supabase
                .from('connections')
                .upsert({
                    follower_id: followerId,
                    target_id: targetId,
                    status: 'connected',
                    tags: tags,
                    created_at: new Date().toISOString()
                }, {
                    onConflict: 'follower_id,target_id',
                    ignoreDuplicates: false
                });

            if (error) {
                // Handle 409 Conflict (Key not in users) gracefully by falling back to virtual
                if (error.code === '23503' || error.code === '409' || error.code === '23514') { // Added 23514
                    logger.warn(`[SupabaseService] Foreign key constraint for connection ${targetId}. Falling back to virtual.`);
                    // The following lines seem to be from a different context (ChatDetail.jsx) and are commented out to maintain syntax.
                    // // Ensured AI persistence: Resolve real Supabase UUID (Passing 'entity' instead of 'ai' to avoid Postgres 23514 CHECK constraint)
                    // const realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
                    // if (!isMounted) return;}. Falling back to virtual.`);
                    const virtualKey = `v_conn_${followerId}`;
                    const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
                    if (!connections.includes(targetId)) {
                        connections.push(targetId);
                        localStorage.setItem(virtualKey, JSON.stringify(connections));
                    }
                    return true;
                }

                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }

            // Automate Push Notification
            const followerProfile = await this.getProfile(followerId);
            if (followerProfile) {
                pushNotifications.triggerNotification(targetId, {
                    title: `Nova connexió!`,
                    body: `${followerProfile.full_name} s'ha connectat amb tu.`,
                    url: `/perfil/${followerId}`,
                    tag: `connect-${followerId}`
                }).catch(() => { });
            }

            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error connecting:', error);
            return false;
        }
    },

    async disconnectFromProfile(followerId, targetId) {
        if (!followerId || !targetId) return false;

        // 1. Remove from Virtual Persistence
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) {
            const filtered = virtualConns.filter(id => id !== targetId);
            localStorage.setItem(virtualKey, JSON.stringify(filtered));
        }

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
        if (!followerId || !targetId || !isRealDBUUID(followerId) || !isRealDBUUID(targetId)) return false;

        // 1. Check Virtual Persistence first
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) return true;

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
        } catch {
            return false;
        }
    },

    async getFollowers(targetId) {
        if (!targetId || !isRealDBUUID(targetId)) return [];
        try {
            if (columnCache.connections_table === false) return [];

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

    async getFollowing(userId) {
        if (!userId || !isRealDBUUID(userId)) return [];
        try {
            if (columnCache.connections_table === false) return [];
            const { data, error, status } = await supabase
                .from('connections')
                .select('target_id')
                .eq('follower_id', userId);
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
            logger.error('[SupabaseService] Error getting following:', error);
            return [];
        }
    },

    async addConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .upsert({ user_id: userId, post_uuid: postId }, { onConflict: 'user_id,post_uuid' });
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, simulating connection');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error addConnection:', e);
            return false;
        }
    },

    async removeConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .delete()
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error removeConnection:', e);
            return false;
        }
    },



    async updateConnectionTags(userId, postId, tags) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .update({ tags })
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, cannot update tags');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error updateConnectionTags:', e);
            return false;
        }
    },


    // Feed / Muro
    // Feed / Muro
    async getPosts(roleFilter = 'tot', townId = null, page = 0, pageSize = 10, isPlayground = false) {
        logger.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}, page: ${page}, playground: ${isPlayground}`);
        try {
            // [MASTER] Robust Column Sync with retry limit
            await _ensureColumnCache();
            const retryCount = (typeof arguments[5] === 'number') ? arguments[5] : 0;
            if (retryCount > 3) {
                logger.error('[SupabaseService] Maximum retry limit reached for getPosts. Aborting to prevent infinite loop.');
                return { data: [], count: 0, error: 'Retry limit reached' };
            }

            let selectStr = 'id, uuid, content, created_at, author, image_url, image_alt, author_role, author_type, is_playground, author_user_id, author_entity_id, towns(name), profiles!fk_posts_author_profile(avatar_url, full_name, town_uuid), entities!fk_posts_author_entity(avatar_url, name)';
            if (columnCache.posts_pinned_position !== false) {
                selectStr += ', pinned_position';
            }
            if (columnCache.posts_ai_percentage === true) {
                selectStr += ', ai_percentage, human_percentage, is_iaia_inspired';
            }

            let query = supabase
                .from('posts')
                .select(selectStr, { count: 'exact' });

            // [PILAR 1 & 3] Check Local Cache for instant return
            const cacheKey = `posts_${townId || 'global'}_${page}_${pageSize}`;
            const cachedData = LocalCache.get(cacheKey);

            if (isPlayground && columnCache.posts_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.posts_is_playground !== false) {
                // [GHOST-SHIELD] En producción, filtramos OBLIGATORIAMENTE el contenido de prueba
                query = query.eq('is_playground', false);
            }

            if (roleFilter && roleFilter !== ROLES.ALL && roleFilter !== 'tot') {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                logger.log(`[SupabaseService] townId entry: ${townId} (${typeof townId})`);
                if (!isRealDBUUID(townId)) {
                    const isNumeric = /^\d+$/.test(townId.toString());
                    let townSearch = supabase.from('towns').select('uuid, id');
                    if (isNumeric) {
                        townSearch = townSearch.or(`id.eq.${townId},town_id.eq.${townId}`);
                    } else {
                        townSearch = townSearch.ilike('name', `%${townId}%`);
                    }
                    const { data: townData } = await townSearch.limit(1).maybeSingle();
                    if (townData) {
                        townId = townData.uuid || townData.id;
                    } else {
                        townId = null;
                    }
                }

                if (townId && isRealDBUUID(townId)) {
                    logger.log(`[SupabaseService] Applying strict author-territory filter: ${townId}`);
                    // Enforce that the author must belong to this town
                    query = query.eq('profiles.town_uuid', townId);
                }
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Robust Column Error Detection (42703: undefined_column, PGRST204: PostgREST specific column error)
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError && error.message?.includes('pinned_position')) {
                    setColumnCache('posts_pinned_position', false);
                    logger.warn('[SupabaseService] pinned_position missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && (error.message?.includes('ai_percentage') || error.message?.includes('human_percentage'))) {
                    setColumnCache('posts_ai_percentage', false);
                    logger.warn('[SupabaseService] AI columns missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && isPlayground) {
                    setColumnCache('posts_is_playground', false);
                    logger.warn('[SupabaseService] is_playground missing in posts, retrying silent...');
                    return this.getPosts(roleFilter, townId, page, pageSize, false, retryCount + 1);
                }
                // [PILAR 3] Offline Resilience: Return cached data if available
                if (cachedData) {
                    logger.warn('[Posts] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            let normalizedData = (data || []).map(p => normalizeContentItem(p, 'post'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            // [MASTER PURGE] No fallbacks a Mocks en producción real para evitar "fantasmas"
            if ((!data || data.length === 0) && page === 0 && ENABLE_MOCKS && isPlayground) {
                const { MOCK_FEED } = await import('../data');
                const normalized = MOCK_FEED.map(p => normalizeContentItem(p, 'post'));
                return { data: normalized, count: normalized.length };
            }

            // INYECCIÓN PREMIUM: Auxili Music Expansion (Only in Playground or Dev)
            const isDev = import.meta.env.MODE === 'development';
            if (page === 0 && (isPlayground || isDev) && normalizedData.length < 3) {
                const auxiliPost = {
                    id: 'didactic-auxili-2026',
                    uuid: 'didactic-auxili-2026',
                    type: 'didactic_presentation',
                    author: 'Auxili (Official)',
                    author_role: 'official',
                    author_avatar: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop', // Reggae vibes
                    content: '# Auxili: Reggae des de l\'Ontinyent\n\nAmb més de 10 anys damunt dels escenaris, **Auxili** s\'ha convertit en el crit musical de tota una generació. Des de la Vall d\'Albaida, han fusionat el reggae amb les arrels valencianes.\n\n## "La música és la nostra eina de transformació."\n\nEste 2026 tornem amb noves energies per a fer vibrar cada racó dels nostres pobles. Gràcies per formar part d\'aquesta família!',
                    image_url: [
                        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop', // Festival crowd
                        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop', // Band on stage
                        'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1000&auto=format&fit=crop'  // Musical instruments
                    ],
                    video_url: 'https://www.youtube.com/watch?v=Fadaa7Kyxm0', // Pàgines Blanques
                    created_at: new Date().toISOString(),
                    metadata: {
                        didactic_text: 'Auxili és un grup de música nascut a Ontinyent l\'any 2005. El seu estil musical és el reggae, amb tocs de ska, raggamuffin i música de banda. Les seues lletres parlen de lluita, amor i territori, amb un fort compromís social i cultural.'
                    },
                    towns: { name: 'Ontinyent (La Vall d\'Albaida)' },
                    connections_count: 850,
                    comments_count: 42
                };
                normalizedData = [auxiliPost, ...normalizedData];
            }

            return { data: normalizedData, count: (count || 0) + 1 };
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

        // Multi-Llinatge master: Mapetgem camps si venen de components amb noms antics
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            author: payload.author_name || payload.author || 'Sóc de Poble',
            author_avatar: payload.author_avatar_url || payload.author_avatar,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = payload.iaia_id || '11111111-1a1a-0000-0000-000000000000';
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;
        delete mappedData.town_id;

        // Validació estructural amb Zod
        const validated = PostSchema.parse(mappedData);

        // Pre-generem id si no existeix (FIX 400 Bad Request)
        if (!validated.id && !validated.uuid) {
            validated.uuid = crypto.randomUUID();
        }

        // [MIGRACIÓ 10.33.20] Normalitzar town_uuid per evitar errors de tipat (ex: 'la-torre')
        if (validated.town_uuid === 'la-torre' || validated.town_uuid === '1') {
            validated.town_uuid = 'eecc1a91-db53-4bf0-a3ce-b33df011df6b';
        } else if (validated.town_uuid && !isValidUUID(validated.town_uuid)) {
            validated.town_uuid = null; // Prevent crashes against UUID columns
        }

        const { error } = await supabase
            .from('posts')
            .insert([validated]);

        if (error) {
            // [SUPER-HEALING] Fk_posts_author_profile error (missing user in profiles table locally)
            if (error.code === '23503' && (error.message?.includes('profile') || error.details?.includes('profile'))) {
                logger.warn(`[SupabaseService] Missing profile for user ${validated.author_user_id}. Auto-healing...`);
                try {
                    const profilePayload = {
                        id: validated.author_user_id,
                        full_name: validated.author || 'Sóc de Poble',
                        avatar_url: validated.author_avatar || null,
                        role: 'neighbor',
                        is_certified: false,
                        updated_at: new Date().toISOString()
                    };
                    await supabase.from('profiles').upsert([profilePayload]);
                    logger.info(`[SupabaseService] Profile created. Retrying post...`);
                    const { error: retryFkError } = await supabase.from('posts').insert([validated]);
                    if (retryFkError) throw retryFkError;
                    return validated;
                } catch (healingError) {
                    logger.error(`[SupabaseService] Auto-healing profile failed:`, healingError);
                    throw error;
                }
            }

            // [MASTER] Self-healing: if column not found, invalidate cache and retry
            if (error.code === '42703' || error.code === 'PGRST204') {
                logger.warn(`[SupabaseService] Column sync error (${error.code}) in createPost, invalidating cache...`);
                setColumnCache('posts_ai_percentage', false);
                setColumnCache('posts_human_percentage', false);
                setColumnCache('posts_time_saved', false);
                setColumnCache('posts_is_iaia_inspired', false);

                // Retry once without symbiosis columns
                const cleanPayload = { ...validated };
                delete cleanPayload.ai_percentage;
                delete cleanPayload.human_percentage;
                delete cleanPayload.time_saved_minutes;
                delete cleanPayload.economic_value_saved;
                delete cleanPayload.is_iaia_inspired;

                if (!cleanPayload.uuid) cleanPayload.uuid = crypto.randomUUID();
                const { error: retryError } = await supabase.from('posts').insert([cleanPayload]);
                
                if (retryError) {
                    logger.warn(`[SupabaseService] Second sync error (${retryError.code}), trying minimal payload...`);
                    const minimalPayload = {
                        id: validated.id || undefined,
                        uuid: validated.uuid || cleanPayload.uuid,
                        author_user_id: validated.author_user_id,
                        author: validated.author,
                        content: validated.content,
                        town_uuid: validated.town_uuid || payload.town_uuid
                    };
                    const { error: finalError } = await supabase.from('posts').insert([minimalPayload]);
                    if (finalError) throw finalError;
                    return minimalPayload;
                }
                return cleanPayload;
            }
            if (isPlayground || error.code === '42501' || error.code === '403') {
                // Fallback si la columna no existe o hay RLS restrictivo en campos extra
                logger.warn(`[SupabaseService] Security/RLS block in createPost, retrying minimal payload...`);
                const minimalPayload = {
                    id: validated.id || undefined,
                    uuid: validated.uuid || crypto.randomUUID(),
                    author_user_id: validated.author_user_id,
                    author: validated.author,
                    content: validated.content,
                    town_uuid: validated.town_uuid || payload.town_uuid
                };
                const { error: retryError } = await supabase.from('posts').insert([minimalPayload]);
                if (retryError) throw retryError;
                return minimalPayload;
            }
            throw error;
        }
        return validated;
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

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false, _retryCount = 0) {
        try {
            await _ensureColumnCache();

            const cacheKey = `market_${categoryFilter || 'all'}_${townId || 'global'}_${page}`;
            const cachedData = LocalCache.get(cacheKey);

            let townJoin = columnCache.market_fk_town_uuid !== false ? 'towns!fk_market_town_uuid(name)' : 'towns(name)';
            let selectStr = `uuid, title, description, price, category_slug, created_at, author_user_id, avatar_url, image_url, ${townJoin}`;

            if (columnCache.market_is_playground !== false) selectStr += ', is_playground';
            if (columnCache.market_is_pinned !== false) selectStr += ', is_pinned';
            if (columnCache.market_pinned_position !== false) selectStr += ', pinned_position';
            if (columnCache.market_is_iaia_inspired !== false) selectStr += ', is_iaia_inspired';

            let query = supabase.from('market_items').select(selectStr, { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.market_is_playground !== false) {
                // [GHOST-SHIELD] In production, only real products
                query = query.eq('is_playground', false);
            }

            if (categoryFilter && categoryFilter !== 'tot') {
                query = query.eq('category_slug', categoryFilter);
            }

            if (townId && isRealDBUUID(townId)) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            let queryBuilder = query;
            if (columnCache.market_is_pinned !== false) {
                queryBuilder = queryBuilder.order('is_pinned', { ascending: false });
            }
            if (columnCache.market_pinned_position !== false) {
                queryBuilder = queryBuilder.order('pinned_position', { ascending: true });
            }

            const { data, error, count } = await queryBuilder
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Self-healing logic for PostgREST 400/PGRST204
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError) {
                    logger.warn(`[SupabaseService] Market column error (${error.code}), invalidating cache... retry ${_retryCount}`);
                    
                    // PREVENT INFINITE LOOP (Hard limit super estricto 1)
                    if (_retryCount >= 1) { // ❌ ANTES ERA >= 2 (peligroso en arrays de fallos)
                        logger.error('[SupabaseService] Breaking infinite retry loop HARD.');
                        if (cachedData) return { data: cachedData, count: cachedData.length, fromCache: true };
                        return { data: [], count: 0 };
                    }

                    // Invalidate specific column cache items found in error message or just reset
                    if (error.message?.includes('pinned_position')) setColumnCache('market_pinned_position', false);
                    if (error.message?.includes('is_pinned')) setColumnCache('market_is_pinned', false);
                    if (error.message?.includes('is_playground')) setColumnCache('market_is_playground', false);
                    if (error.message?.includes('fk_market_town_uuid')) setColumnCache('market_fk_town_uuid', false);

                    // Esperar para no bloquear el stack (backoff)
                    await new Promise(resolve => setTimeout(resolve, 300 * (_retryCount + 1)));

                    // Retry with incremented counter
                    return this.getMarketItems(categoryFilter, townId, page, pageSize, isPlayground, _retryCount + 1);
                }
                if (cachedData) {
                    logger.warn('[Market] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            return {
                data: normalizedData,
                count: count || 0
            };
        } catch (error) {
            logger.error('Error in getMarketItems:', error);
            // Return empty list on error to keep UI alive
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
        if (payload.author_id || payload.author_user_id) {
            checkThrottling(payload.author_id || payload.author_user_id, 'create_market_item');
        }

        // Multi-Llinatge master: Mapetgem camps del mercat
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            seller: payload.author_name || payload.seller || 'Sóc de Poble',
            avatar_url: payload.author_avatar_url || payload.avatar_url,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = '11111111-1a1a-0000-0000-000000000000'; // IAIA MarIA default
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(mappedData);

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
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
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
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
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

    // Autenticació s'importa directament d'authService arreu de l'aplicació

    /**
     * Cachea de forma segura la presencia de columnas, evitando bucles de error 42703.
     */
    async checkColumn(tableName, columnName) {
        const cacheKey = `${tableName}_has_${columnName}`;
        if (columnCache[cacheKey] !== null) return columnCache[cacheKey];

        if (!activeChecks[cacheKey]) {
            activeChecks[cacheKey] = (async () => {
                try {
                    const { data, error } = await supabase.from(tableName).select('*').limit(1);
                    if (data && data.length > 0) {
                        const exists = columnName in data[0];
                        setColumnCache(cacheKey, exists);
                        return exists;
                    }
                    if (error) {
                        setColumnCache(cacheKey, false);
                        return false;
                    }
                    setColumnCache(cacheKey, true); // Optimistic true si la taula està buida
                    return true;
                } catch {
                    setColumnCache(cacheKey, false);
                    return false;
                } finally {
                    activeChecks[cacheKey] = null;
                }
            })();
        }
        return await activeChecks[cacheKey];
    },

    async getProfile(id) {
        console.log('[getProfile] Called with id:', id);
        if (!id || !isRealDBUUID(id)) {
            // Check in Lore Personas first
            const lore = LORE_PERSONAS.find(p => p.id === id);
            if (lore) return lore;
            return null;
        }

        if (this._profileCache.has(id)) {
            console.log('[getProfile] Returning from cache');
            return this._profileCache.get(id);
        }

        try {
            const hasPremium = columnCache.profiles_has_premium !== false;
            const fullSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at, ofici, social_image_preference';
            const baseSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at';

            const select = hasPremium ? fullSelect : baseSelect;

            console.log(`[getProfile] Fetching from supabase with select: ${select}...`);
            
            // [BATEGAT FAILSAFE] Timeout de 6s per previndre deadlock del mutex de Supabase
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Supabase getProfile FETCH TIMEOUT')), 6000);
            });

            const queryPromise = supabase
                .from('profiles')
                .select(select)
                .eq('id', id)
                .maybeSingle();

            let { data, error } = await Promise.race([queryPromise, timeoutPromise]);
            
            console.log(`[getProfile] Supabase response received. Error:`, error);

            if (error) {
                if (hasPremium && (error.code === '42703' || error.message?.includes('ofici'))) {
                    setColumnCache('profiles_has_premium', false);
                    return this.getProfile(id); // Silent retry with base solo por falta de columnas
                }
                if (error.code === 'PGRST116') return null; // Stop crash loop on 404
                throw error;
            }

            if (hasPremium && data && columnCache.profiles_has_premium === null) {
                setColumnCache('profiles_has_premium', true);
            }

            const normalized = this.normalizeProfile(data);
            this._profileCache.set(id, normalized);
            return normalized;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getProfile:', err);
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const ids = (Array.isArray(postIds) ? postIds : [postIds]).filter(id =>
            typeof id === 'string' && uuidRegex.test(id)
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
        if (!isRealDBUUID(userId)) return [];
        const { data, error } = await supabase
            .from('user_tags')
            .select('tag_name')
            .eq('user_id', userId)
            .order('tag_name', { ascending: true });
        if (error) throw error;
        return (data || []).map(t => t.tag_name);
    },

    async addUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return null;
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
        if (!isRealDBUUID(userId)) return;
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

    async upsertProfile(userId, data) {
        if (!userId) return null;
        try {
            const payload = { id: userId, ...data };
            
            // [BATEGAT FAILSAFE] Timeout de 6s
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Supabase upsertProfile FETCH TIMEOUT')), 6000);
            });

            const queryPromise = supabase
                .from('profiles')
                .upsert(payload, { onConflict: 'id' })
                .select();
                
            const { data: result, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                logger.warn('[SupabaseService] Error upserting profile:', error);
                throw error;
            }
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error('[SupabaseService] Critical error in upsertProfile:', error);
            throw error;
        }
    },

    async updateProfile(userId, updates) {
        if (userId && !updates.is_playground) {
            await checkThrottling(userId, 'update_profile', 3000).catch(e => logger.warn('Throttling warn', e));
        }
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

    async createEntity(payload) {
        try {
            // 1. Crear l'entitat
            const { data: entity, error: entityError } = await supabase
                .from('entities')
                .insert([{
                    name: payload.name,
                    type: payload.type || 'empresa',
                    avatar_url: payload.avatar_url || null,
                    description: payload.description || null,

                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (entityError) throw entityError;

            // 2. Afegir el creador com a 'admin'
            if (payload.creator_id) {
                const { error: memberError } = await supabase
                    .from('entity_members')
                    .insert([{
                        entity_id: entity.id,
                        user_id: payload.creator_id,
                        role: 'admin',
                        created_at: new Date().toISOString()
                    }]);
                
                if (memberError) throw memberError;
            }

            return entity;
        } catch (error) {
            logger.error('[SupabaseService] Error creating entity:', error);
            throw error;
        }
    },

    // Multi-Identidad (Phase 6)
    async getUserEntities(userId) {
        if (!userId) return [];
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
                // [RESILIÈNCIA OMEGA] Catch permission errors (401/403/42501) or missing table errors
                const isPermissionError = error.code === '42501' || error.status === 401 || error.status === 403;
                if (isPermissionError || error.code === 'PGRST201' || error.code === '42P01' || error.code === '42703') {
                    logger.warn(`[SupabaseService] getUserEntities blindat: ${error.message || error.code}. Ignorant permisos/esquema.`);
                    return [];
                }
                logger.error('[SupabaseService] Error loading entities:', error);
                return [];
            }

            // SANEJAMENT DE LLINATGE: Transformar Sóc de Poble a Empresa i netejar duplicats
            let processedEntities = (data || []).map(item => ({
                ...item.entities,
                member_role: item.role
            }));

            // If it's Javi, enforce "Sóc de Poble" as Empresa and hide Association duplicate
            const isJavi = userId === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || userId === 'javillinares' || userId === 'mock_javi-llinares';
            if (isJavi) {
                const sdpExists = processedEntities.some(e => e.id === 'socdepoble');
                const rentonarExists = processedEntities.some(e => e.id === 'el-rentonar');

                if (!sdpExists) {
                    const sdp = SYSTEM_ENTITIES.find(e => e.id === 'socdepoble');
                    if(sdp) processedEntities.push({ ...sdp, name: sdp.full_name, member_role: 'admin' });
                }
                if (!rentonarExists) {
                    const rento = SYSTEM_ENTITIES.find(e => e.id === 'el-rentonar');
                    if(rento) processedEntities.push({ ...rento, name: rento.full_name, member_role: 'admin' });
                }

                const socDePobleEmpresa = processedEntities.find(e => e.name?.toLowerCase().includes('sóc de poble') && e.type === 'empresa');
                if (socDePobleEmpresa) {
                    processedEntities = processedEntities.filter(e => !(e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio'));
                } else {
                    processedEntities = processedEntities.map(e => {
                        if (e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio') {
                            return { ...e, type: 'empresa' };
                        }
                        return e;
                    });
                }
            }

            return processedEntities;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getUserEntities:', err);
            return []; // Fail safe to avoid white screen
        }
    },

    // Fase 6: Páginas Públicas y Gestión de Entidades
    // [EMERGENCY FIX] Cache for profiles to prevent infinite network loops
    _profileCache: new Map(),

    async getPublicProfile(userId) {
        // [OMNISCIENT] Universal Resolver for System Entities and Lore Personas
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.id === userId);
        if (foundPersona) return foundPersona;

        const system = SYSTEM_ENTITIES.find(e => e.id === userId);
        if (system) return system;

        if (!isRealDBUUID(userId)) {
            logger.debug(`[SupabaseService] getPublicProfile: Saltant crida a DB per ID no-UUID o Sobirà: ${userId}`);
            return null; // Silent fail for malformed or sovereign IDs
        }

        // Return from cache if available to prevent generic infinite loops
        if (this._profileCache.has(userId)) {
            return this._profileCache.get(userId);
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                if (userId === '25218ea4-5d7d-4db4-bdc5-7ae035629242') {
                    const masterProfile = {
                        id: '25218ea4-5d7d-4db4-bdc5-7ae035629242',
                        full_name: 'Javi Llinares',
                        username: 'javillinares',
                        type: 'persona',
                        town_name: 'La Torre de les Maçanes',
                        bio: 'Desenvolupador principal d\'Antigravity i arquitecte de Sóc de Poble. Programant el futur rural.',
                        avatar_url: '/assets/master/javi_avatar_cinematic.png',
                        cover_url: '/assets/patterns/hero_pattern.png',
                        category: 'Tecnologia',
                        is_active: true,
                        is_admin: true,
                        created_at: '2025-01-01T00:00:00Z'
                    };
                    this._profileCache.set(userId, masterProfile);
                    return masterProfile;
                }
                return null;
            }
            throw error;
        }
        
        const normalized = this.normalizeProfile(data);
        this._profileCache.set(userId, normalized);
        return normalized;
    },

    async getUserByUsername(username) {
        if (!username) throw new Error('Username is required');
        const cleanUsername = username.toLowerCase();

        // [OMNISCIENT] Search in virtual personas first
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.username?.toLowerCase() === cleanUsername);
        if (foundPersona) return foundPersona;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username_lower', cleanUsername)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw error;
        }

        return this.normalizeProfile(data);
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

    async getAllCitizens() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async updateUserRole(userId, role) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', userId)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getPublicEntity(entityId) {
        // Intercept System/Mock entities (Blindatge OMNISCIENT)
        const systemMatch = SYSTEM_ENTITIES.find(e => e.id === entityId);
        if (systemMatch) return systemMatch;

        const adminEntities = await this.getAdminEntities(); // Includes system and curated DB entities
        const existingMock = adminEntities.find(e => e.id === entityId);

        if (existingMock) return existingMock;

        if (!isRealDBUUID(entityId)) {
            logger.debug(`[SupabaseService] getPublicEntity: Saltant crida a DB per ID no-UUID o Sobirà: ${entityId}`);
            return null;
        }

        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .limit(1)
            .maybeSingle();
        
        if (error) {
            if (error.code === 'PGRST116' || error.code === '42P01' || String(error.message).includes('404')) return null;
            logger.warn(`[SupabaseService] getPublicEntity error ignorat transversalment:`, error);
            return null;
        }
        
        if (!data) return null;

        const entity = data;
        return {
            ...entity,
            avatar_url: this.normalizeStorageUrl(entity.avatar_url),
            cover_url: this.normalizeStorageUrl(entity.cover_url)
        };
    },

    async getEntityMembers(entityId) {
        // Blindatge OMNISCIENT per a entitats de sistema
        if (entityId === 'socdepoble') {
            return [{
                user_id: '25218ea4-5d7d-4db4-bdc5-7ae035629242', // Javi Real
                role: 'Fundador',
                profiles: {
                    full_name: 'Javi Linares',
                    avatar_url: '/images/agents/javi_real.png'
                }
            }];
        }

        const { data, error } = await supabase
            .from('entity_members')
            .select('user_id, role, profiles(full_name, avatar_url)')
            .eq('entity_id', entityId);
        if (error) {
            logger.error('[SupabaseService] Error getting entity members:', error);
            return []; // Fail gracefully
        }
        return data;
    },

    async getUserPosts(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            // [MOCK HEALER] Support for virtual entities / agents in the feed
            let virtualPosts = [];
            const JAVI_REAL_ID = '25218ea4-5d7d-4db4-bdc5-7ae035629242';
            if (userId.startsWith('11111111-') || userId === JAVI_REAL_ID || typeof ENABLE_MOCKS !== 'undefined') {
                try {
                    const { MOCK_FEED } = await import('../data.js');
                    virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId || p.author_user_id === userId);
                } catch {
                     logger.warn("Could not import MOCK_FEED for user posts");
                }
            }

            if (!isRealDBUUID(userId)) {
                // Si és un ID sobirà o malformat, mirem si té posts de Lore, si no, retornem buit sense cridar a DB
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
                return [...lorePosts, ...virtualPosts];
            }
            // const isUcc = localStorage.getItem('active_ucc_view') === 'true';
            if (isPlayground && !userId?.startsWith('11111111-')) {
                // Simplified mock return only for non-demo users in playground
                return [];
            }

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, image_url, image_alt, author, author_role, author_type, author_user_id, author_entity_id, is_playground, categories, tags, towns!fk_posts_town_uuid(name)');

            // LLINATGE DE L'ARQUITECTE: Si és en Javi, mostrem els seus posts naturals I els de l'Empresa Sóc de Poble
            if (userId === JAVI_REAL_ID) {
                // Busquem l'ID de l'empresa Sóc de Poble (es pot optimitzar amb un cache o constant)
                query = query.or(`author_user_id.eq.${userId},author.ilike.%Sóc de Poble%`);
            } else {
                query = query.eq('author_user_id', userId);
            }

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
            return [...lorePosts, ...virtualPosts.map(p => normalizeContentItem(p, 'post')), ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserPosts:', error);
            return [];
        }
    },

    async getImportedPosts(userId) {
        if (!isRealDBUUID(userId)) return { data: [], error: null };
        try {
            return await supabase
                .from('posts')
                .select('*')
                .eq('author_user_id', userId)
                .eq('type', 'imported_story')
                .order('created_at', { ascending: false });
        } catch (error) {
            logger.error('[SupabaseService] Error in getImportedPosts:', error);
            return { data: [], error };
        }
    },

    async getUserPostsCount(userId) {
        if (!isRealDBUUID(userId)) return 0;
        try {
            let virtualCount = 0;
            if (userId.startsWith('11111111-')) {
                 try {
                     const { MOCK_FEED } = await import('../data.js');
                     virtualCount = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId).length;
                 } catch {
                     logger.warn("Could not import MOCK_FEED for user posts count");
                 }
                 return virtualCount; // Fast path for agents
            }

            const { count, error } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('author_user_id', userId);
            if (error) throw error;
            return count || 0;
        } catch (err) {
            logger.error('[SupabaseService] Error in getUserPostsCount:', err);
            return 0;
        }
    },

    async getEntityPosts(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the feed (Lore injection)
            const { MOCK_FEED } = await import('../data');
            const virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === entityId || p.entity_id === entityId);

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, image_url, image_alt, author, author_role, author_type, author_user_id, author_entity_id, is_playground, categories, tags, towns!fk_posts_town_uuid(name)')
                .eq('author_entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualPosts.length === 0) throw error;

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            // Merge virtual and real posts
            return [...virtualPosts, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityPosts:', error);
            return [];
        }
    },

    async getUserMarketItems(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            if (!isRealDBUUID(userId)) {
                // Lore injection for non-DB IDs
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
                return loreItems;
            }
            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, image_url, seller, author_role, author_type, author_user_id, author_entity_id, is_playground, is_active, towns!fk_market_town_uuid(name)')
                .eq('author_user_id', userId);

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
            // Support for virtual entities in the market (Lore injection)
            const { MOCK_MARKET_ITEMS } = await import('../data');
            const virtualItems = MOCK_MARKET_ITEMS.filter(item => item.author_entity_id === entityId || item.entity_id === entityId);

            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, image_url, seller, author_role, author_type, author_user_id, author_entity_id, is_playground, is_active, towns!fk_market_town_uuid(name)')
                .eq('author_entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualItems.length === 0) throw error;

            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...virtualItems, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
        if (file.type.startsWith('image/') && file.size > 100 * 1024) {
            try {
                const imageCompression = (await import('browser-image-compression')).default;
                
                // [CRITICAL FIX] BANDWIDTH LEAK
                const isAvatar = context === 'avatar';
                const configuredMaxMB = isAvatar ? 0.08 : 1; 
                const configuredMaxWidth = isAvatar ? 400 : 1920;

                processedFile = await imageCompression(file, {
                    maxSizeMB: configuredMaxMB,
                    maxWidthOrHeight: configuredMaxWidth,
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

        const { error: uploadError, data: _data } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedFile, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' || userId?.startsWith('11111111-');
            if (isPlayground && (uploadError.code === '42501' || uploadError.status === 400 || uploadError.status === 401 || uploadError.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ RLS Bypass [${context}]: Creant URL local per a Playground.`);
                const localUrl = URL.createObjectURL(processedFile);
                return { url: localUrl, deduplicated: false, asset: { id: `mock-asset-${Date.now()}`, url: localUrl } };
            }
            throw uploadError;
        }

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
            .limit(1)
            .maybeSingle();

        if (assetError || !asset.parent_id) return null;

        const { data: parent, error: parentError } = await supabase
            .from('media_assets')
            .select('*')
            .eq('id', asset.parent_id)
            .limit(1)
            .maybeSingle();

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

    async getGlobalMedia() {
        // [MASTER ASSET HUB] Fetch all media with uploader info
        // Note: Using !user_id as hint if PostgREST cannot find the implicit relationship
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*),
                user:profiles!user_id(id, full_name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            logger.warn('[SupabaseService] Error in primary getGlobalMedia join, attempting robust fallback:', error);
            
            // SECOND ATTEMPT: Try without the profiles join (which sometimes fails if hinted incorrectly)
            const { data: q2Data, error: q2Error } = await supabase
                .from('media_usage')
                .select(`
                    *,
                    media_assets(*)
                `)
                .order('created_at', { ascending: false });

            if (q2Error) {
                logger.error('[SupabaseService] Critical failure in media_usage query:', q2Error);
                // FINAL FALLBACK: Raw media_usage and manual hydration (Maximum Resilience)
                const { data: rawData, error: rawError } = await supabase
                    .from('media_usage')
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (rawError) throw rawError;
                
                // Hydrate assets
                const assetIds = [...new Set(rawData.map(d => d.asset_id))].filter(Boolean);
                const { data: assets } = await supabase.from('media_assets').select('*').in('id', assetIds);
                
                // Hydrate users
                const userIds = [...new Set(rawData.map(d => d.user_id))].filter(Boolean);
                const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
                
                return rawData.map(item => ({
                    ...item,
                    asset: assets?.find(a => a.id === item.asset_id),
                    user: profiles?.find(p => p.id === item.user_id)
                }));
            }

            // Normal retry logic for Q2: Manual profile hydration
            const userIds = [...new Set(q2Data.map(d => d.user_id))].filter(Boolean);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

            return q2Data.map(item => ({
                ...item,
                asset: item.media_assets, // Handle fallback field name
                user: profiles?.find(p => p.id === item.user_id)
            }));
        }
        return data;
    },

    // --- Voice Messages ---

    async uploadVoiceMessage(audioBlob, duration, userId) {
        // Upload logic: user_id / conversation_id (optional) / timestamp
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.webm`;

        const { data: _data, error: uploadError } = await supabase.storage
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
    },

    /**
     * Obté una publicació específica per ID [MASTER]
     */
    async getPostById(postId) {
        try {
            const { data, error } = await supabase
                .from('posts_universal_view')
                .select('*, profiles(*), towns(*)')
                .eq('id', postId)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error(`[SupabaseService] Error fetching post ${postId}:`, err);
            return null;
        }
    },

    /**
     * [PILLAR 3: Rèplica Representant] - Sincronització de xlogs
     */
    async upsertXLogs(userId, xlogs) {
        try {
            // En un entorn real, açò usaria una taula 'account_logs' amb RLS
            logger.log(`[SupabaseService] Sincronitzant ${xlogs.length} xlogs per a l'usuari ${userId}`);
            const { error } = await supabase
                .from('account_logs')
                .upsert(xlogs.map(log => ({ ...log, user_id: userId })), { onConflict: 'id' });

            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en upsertXLogs:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Crea petició de recuperació.
     */
    async createRecoveryRequest(request) {
        try {
            logger.log(`[SupabaseService] Petició de recuperació bategada per a: ${request.user_id}`);
            // Simulem l'escriptura a una taula 'recovery_requests' via upsert
            const { error } = await supabase
                .from('recovery_requests')
                .upsert([request], { onConflict: 'user_id' });
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en createRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Signatura de petició.
     */
    async signRecoveryRequest(userId, padrinId) {
        try {
            // En un sistema real, açò incrementaria signatures a la taula 'recovery_requests'
            logger.log(`[SupabaseService] Padrí ${padrinId} signant per a ${userId}`);
            return { success: true };
        } catch (err) {
            logger.error('[SupabaseService] Error en signRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * Obté les entitats (identitats) gestionades per l'usuari actual.
     */
    async getMyEntities() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('entities')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error('[SupabaseService] Error en getMyEntities:', err);
            return [];
        }
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Puja un blob binari opac al relay sense coneixement semàntic.
     */
    async uploadOpaqueBlob(path, packageData) {
        try {
            logger.log(`[SupabaseService] Pujant blob opac a: ${path}`);
            const { error } = await supabase
                .from('opaque_relays')
                .upsert([{ 
                    path, 
                    payload: packageData.payload, 
                    v: packageData.v,
                    updated_at: new Date().toISOString()
                }]);
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error pujant blob opac:', err);
            return { error: err };
        }
    }
};

