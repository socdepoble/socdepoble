import { APP_SEED, APP_SEED_VERSION, CHAT_MESSAGE_SEED, CHAT_THREADS, DEFAULT_USER_ID } from './appSeed.js';
import { resolveTownImageUrl } from '../config/assetResolver.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';
const DATA_MODE = String(import.meta.env.VITE_DATA_MODE || 'auto').trim().toLowerCase();

const DEV_FALLBACK_STORAGE_KEY = 'socdepoble-dev-chat-messages';
const APP_SNAPSHOT_STORAGE_KEY = 'socdepoble-app-snapshot-v1';
const CHAT_CONVERSATION_MAP_KEY = 'socdepoble-chat-conversation-map';
const CHAT_GUEST_DB_USER_ID_KEY = 'socdepoble-chat-guest-db-user-id';
const CHAT_REMOTE_WRITE_DISABLED_KEY = `socdepoble-chat-remote-write-disabled::${SUPABASE_URL || 'none'}`;
const SECTION_SUBMISSIONS_STORAGE_KEY = 'socdepoble-section-submissions-v1';
const SECTION_REMOTE_WRITE_DISABLED_KEY = `socdepoble-section-remote-write-disabled::${SUPABASE_URL || 'none'}`;
const DATA_SYNC_CHANNEL_NAME = 'socdepoble-data-sync-v1';
const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const LEGACY_PROJECT_URL = 'https://adjlvwtxhpclgmnsvwpm.supabase.co';

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const stripMarkdownImages = (value) => String(value || '').replace(/!\[[^\]]*\]\([^)]+\)/g, '');
const firstAsset = (value) => (Array.isArray(value) ? value[0] || null : value || null);
const slugify = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const buildSearchText = (parts) => normalizeText(parts.filter(Boolean).join(' '));
const toSummary = (value) => stripMarkdownImages(value).replace(/\n{3,}/g, '\n\n').slice(0, 220);
const legacyCompatibilityEnabled = SUPABASE_URL === LEGACY_PROJECT_URL;
const DATA_MODE_VALUES = new Set(['auto', 'supabase', 'hybrid', 'seed', 'local']);
const BRAND_FALLBACK_IMAGE = '/assets/uploads/empresa/soc-de-poble/avatars/logo-socdepoble-cuadrat-verd.svg';
const MARKET_FALLBACK_IMAGE = '/assets/uploads/companies/mercat/generic_market.png';
const MARKET_FALLBACK_IMAGES = [
  '/assets/uploads/companies/mercat/generic_market.png',
  '/assets/uploads/companies/mercat/flowers_bouquet.png',
  '/assets/uploads/companies/mercat/aitana.png',
  '/assets/uploads/companies/mercat/camiseta_portada.png',
  '/assets/uploads/brain/nano_agricola_mas_1773539958988.png',
  '/assets/uploads/brain/nano_mercat_llaurador_1774197050578.png',
  '/assets/uploads/brain/nano_oli_oliva_1774198089084.png',
  '/assets/uploads/brain/art_trellat_farmer_1774708525806.png',
  '/assets/uploads/brain/hero_panoramic_rural_view_1774720664221.png',
  '/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png'
];
const PROFILE_FALLBACK_IMAGE = '/assets/uploads/avatars/iaia_comic_matriarch.png';
const LEGACY_CHAT_AI_ID = '11111111-1a1a-0000-0000-000000000000';
let remoteChatWritesAvailable = typeof window === 'undefined'
  ? true
  : window.localStorage.getItem(CHAT_REMOTE_WRITE_DISABLED_KEY) !== 'true';
const POST_FALLBACK_IMAGES = [
  '/assets/uploads/brain/thermodynamics_ai_hardware_1775882083812.png',
  '/assets/uploads/brain/cuc-de-pi-poster.png',
  '/assets/uploads/brain/art_trellat_farmer_1774708525806.png',
  '/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png',
  '/assets/uploads/brain/hero_panoramic_rural_view_1774720664221.png',
  '/assets/uploads/brain/collita_pomes_valencia_1779774496548.png',
  '/assets/uploads/brain/nano_mercat_llaurador_1774197050578.png',
  '/assets/uploads/brain/nano_astronauta_esmorzar_1773441997380.png',
  '/assets/uploads/brain/nano_mixa_socis_1774215027069.png',
  '/assets/uploads/brain/art_trellat_v2_1774708257858.png',
  '/assets/uploads/brain/nano_pedra_seca_1777089570387.png',
  '/assets/uploads/poble/la-torre-de-les-macanes/img-la-torre-de-les-ma-anes-main.jpg',
  '/assets/uploads/poble/penaguila/img-pen-guila-main.jpg'
];
const MARKET_ASSET_MAP = {
  'tomaca_pot.png': '/assets/uploads/brain/nano_agricola_mas_1773539958988.png',
  'ruta_guiada.png': '/assets/uploads/companies/mercat/aitana.png',
  'senderisme-aitana.png': '/assets/uploads/companies/mercat/aitana.png',
  'senderisme_aitana.png': '/assets/uploads/companies/mercat/aitana.png',
  'pantalons_roba.png': '/assets/uploads/companies/mercat/camiseta_portada.png',
  'camiseta_portada.png': '/assets/uploads/companies/mercat/camiseta_portada.png',
  'mel_premium.png': '/assets/uploads/brain/nano_mel_font_roja_1774216345755.png',
  'maria-mel.png': '/assets/uploads/brain/nano_mel_font_roja_1774216345755.png',
  'oli_premium.png': '/assets/uploads/brain/nano_oli_oliva_1774198089084.png',
  'pa_llenya.png': '/assets/uploads/brain/art_trellat_farmer_1774708525806.png',
  'vi_negre.png': '/assets/uploads/brain/hero_serrella_comic_1774709602282.png',
  'cabas_espart.png': '/assets/uploads/companies/mercat/flowers_bouquet.png',
  'flowers_bouquet.png': '/assets/uploads/companies/mercat/flowers_bouquet.png',
  'generic_market.png': '/assets/uploads/companies/mercat/generic_market.png'
};
const CONNECTABLE_SECTION_IDS = new Set(['mur', 'mercat', 'events']);

function normalizeDataMode(value) {
  return DATA_MODE_VALUES.has(value) ? value : 'auto';
}

function resolveRuntimeDataMode() {
  const mode = normalizeDataMode(DATA_MODE);
  if (mode !== 'auto') return mode;
  return hasSupabaseConfig ? 'hybrid' : 'seed';
}

const runtimeDataMode = resolveRuntimeDataMode();

function pickDeterministicImage(seed, options) {
  const list = options.filter(Boolean);
  if (list.length === 0) return BRAND_FALLBACK_IMAGE;

  const text = String(seed || '');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return list[hash % list.length];
}

function resolveLegacyMarketAsset(raw, context = '', seed = '') {
  const filename = String(raw || '').split('/').pop()?.toLowerCase() || '';
  if (filename && MARKET_ASSET_MAP[filename]) {
    return MARKET_ASSET_MAP[filename];
  }

  const text = normalizeText(`${raw} ${context}`);
  if (text.includes('mel')) return MARKET_ASSET_MAP['mel_premium.png'];
  if (text.includes('oli')) return MARKET_ASSET_MAP['oli_premium.png'];
  if (text.includes('tomaca') || text.includes('hort')) return MARKET_ASSET_MAP['tomaca_pot.png'];
  if (text.includes('ruta') || text.includes('excurs') || text.includes('aitana') || text.includes('sender')) return MARKET_ASSET_MAP['ruta_guiada.png'];
  if (text.includes('pantal') || text.includes('camiset') || text.includes('roba')) return MARKET_ASSET_MAP['pantalons_roba.png'];
  if (text.includes('pa') || text.includes('forn')) return MARKET_ASSET_MAP['pa_llenya.png'];
  if (text.includes('vi')) return MARKET_ASSET_MAP['vi_negre.png'];
  if (text.includes('cabas') || text.includes('espart') || text.includes('flor')) return MARKET_ASSET_MAP['cabas_espart.png'];
  if (text.includes('formatge') || text.includes('queso') || text.includes('llet')) return MARKET_FALLBACK_IMAGES[5];
  if (text.includes('sabo') || text.includes('sabó') || text.includes('neteja')) return MARKET_FALLBACK_IMAGES[4];
  if (text.includes('bota') || text.includes('trekking') || text.includes('senderisme') || text.includes('muntanya')) return MARKET_FALLBACK_IMAGES[8];

  return pickDeterministicImage(seed || text, MARKET_FALLBACK_IMAGES);
}

function resolveLegacyPostAsset(raw, context = '', seed = '') {
  const value = String(raw || '').trim();
  if (/^https?:\/\//i.test(value)) return value;

  const filename = value.split('/').pop()?.toLowerCase() || '';
  if (filename && MARKET_ASSET_MAP[filename]) {
    return MARKET_ASSET_MAP[filename];
  }
  if (value === '/assets/brand/default_socdepoble.webp' || value === '/assets/system/brand/logo.png') {
    return pickDeterministicImage(seed || context || value, POST_FALLBACK_IMAGES);
  }

  const text = normalizeText(`${value} ${context}`);
  if (text.includes('termodinam')) return '/assets/uploads/brain/thermodynamics_ai_hardware_1775882083812.png';
  if (text.includes('cuc de pi')) return '/assets/uploads/brain/cuc-de-pi-poster.png';
  if (text.includes('picardia') || text.includes('iaia')) return '/assets/uploads/avatars/iaia_comic_matriarch.png';
  if (text.includes('mercat') || text.includes('hort') || text.includes('agric')) return '/assets/uploads/brain/nano_agricola_mas_1773539958988.png';
  if (text.includes('aitana') || text.includes('serra') || text.includes('poble')) return '/assets/uploads/poble/la-torre-de-les-macanes/img-la-torre-de-les-ma-anes-main.jpg';

  return pickDeterministicImage(seed || text, POST_FALLBACK_IMAGES);
}

function resolveLegacyAssetUrl(value, { type = 'generic' } = {}) {
  const raw = String(value || '').trim();
  if (!raw) {
    if (type === 'market') return MARKET_FALLBACK_IMAGE;
    if (type === 'profile') return PROFILE_FALLBACK_IMAGE;
    return BRAND_FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(raw)) return raw;

  if (raw === '/assets/brand/default_socdepoble.webp') {
    return BRAND_FALLBACK_IMAGE;
  }

  if (raw.startsWith('/assets/market/')) {
    return resolveLegacyMarketAsset(raw);
  }

  if (raw.startsWith('/assets/avatars/comic/')) {
    const filename = raw.split('/').pop();
    if (!filename) return PROFILE_FALLBACK_IMAGE;
    return `/assets/uploads/avatars/${filename}`;
  }

  if (type === 'town' || raw.startsWith('/assets/uploads/poble/')) {
    return resolveTownImageUrl(raw, raw, raw);
  }

  if (raw.startsWith('/assets/brain/')) {
    return pickDeterministicImage(raw, [
      '/assets/uploads/brain/thermodynamics_ai_hardware_1775882083812.png',
      '/assets/uploads/brain/art_trellat_farmer_1774708525806.png',
      '/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png',
      '/assets/uploads/brain/hero_serrella_comic_1774709602282.png'
    ]);
  }

  return raw;
}

const buildHeaders = (extra = {}) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${response.status}: ${text || 'Error desconegut.'}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function requestMaybe(path, options = {}) {
  try {
    const data = await request(path, options);
    return { ok: true, data, status: 200 };
  } catch (error) {
    const match = String(error?.message || '').match(/^Supabase\s+(\d+):\s+(.*)$/s);
    return {
      ok: false,
      status: match ? Number(match[1]) : 500,
      errorMessage: match ? match[2] : String(error?.message || error)
    };
  }
}

function mapContentRowsToData(rows) {
  const lookup = new Map(rows.map((row) => [row.key, row.payload]));
  return {
    ownerUserId: DEFAULT_USER_ID,
    agents: lookup.get('agents') || [],
    chatThreads: CHAT_THREADS,
    feedPosts: lookup.get('feedPosts') || [],
    marketItems: lookup.get('marketItems') || [],
    events: lookup.get('events') || [],
    towns: lookup.get('towns') || [],
    mediaItems: lookup.get('mediaItems') || [],
    noteFolders: lookup.get('noteFolders') || [],
    notes: lookup.get('notes') || [],
    pages: lookup.get('pages') || [],
    sectionSubmissions: []
  };
}

function buildSeedAppData(ownerUserId = DEFAULT_USER_ID) {
  return {
    ownerUserId,
    agents: APP_SEED.agents,
    chatThreads: APP_SEED.chatThreads,
    chatMessages: mergeChatMessages(
      APP_SEED.chatMessages.filter((message) => message.ownerUserId === ownerUserId),
      loadDevFallbackMessages(ownerUserId)
    ),
    feedPosts: APP_SEED.feedPosts,
    marketItems: APP_SEED.marketItems,
    events: APP_SEED.events,
    towns: APP_SEED.towns,
    mediaItems: APP_SEED.mediaItems,
    noteFolders: APP_SEED.noteFolders,
    notes: APP_SEED.notes,
    pages: APP_SEED.pages,
    sectionSubmissions: [],
    seedVersion: APP_SEED_VERSION
  };
}

function sanitizeSnapshotArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

function saveLocalAppSnapshot(snapshot) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(APP_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage issues in local demo mode.
  }
}

function loadLocalAppSnapshot(ownerUserId = DEFAULT_USER_ID) {
  const fallback = buildSeedAppData(ownerUserId);
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(APP_SNAPSHOT_STORAGE_KEY);
    if (!raw) {
      saveLocalAppSnapshot(fallback);
      return fallback;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      saveLocalAppSnapshot(fallback);
      return fallback;
    }

    const snapshot = {
      ...fallback,
      ...parsed,
      ownerUserId,
      agents: sanitizeSnapshotArray(parsed.agents, fallback.agents),
      chatThreads: sanitizeSnapshotArray(parsed.chatThreads, fallback.chatThreads),
      feedPosts: sanitizeSnapshotArray(parsed.feedPosts, fallback.feedPosts),
      marketItems: sanitizeSnapshotArray(parsed.marketItems, fallback.marketItems),
      events: sanitizeSnapshotArray(parsed.events, fallback.events),
      towns: sanitizeSnapshotArray(parsed.towns, fallback.towns),
      mediaItems: sanitizeSnapshotArray(parsed.mediaItems, fallback.mediaItems),
      noteFolders: sanitizeSnapshotArray(parsed.noteFolders, fallback.noteFolders),
      notes: sanitizeSnapshotArray(parsed.notes, fallback.notes),
      pages: sanitizeSnapshotArray(parsed.pages, fallback.pages),
      sectionSubmissions: sanitizeSnapshotArray(
        parsed.sectionSubmissions,
        loadLocalSectionSubmissions(ownerUserId)
      ),
      chatMessages: mergeChatMessages(
        sanitizeSnapshotArray(parsed.chatMessages, fallback.chatMessages).filter(
          (message) => message.ownerUserId === ownerUserId
        ),
        loadDevFallbackMessages(ownerUserId)
      ),
      seedVersion: APP_SEED_VERSION
    };

    return snapshot;
  } catch {
    saveLocalAppSnapshot(fallback);
    return fallback;
  }
}

function persistMessagesToLocalSnapshot(messages, ownerUserId = DEFAULT_USER_ID) {
  const current = loadLocalAppSnapshot(ownerUserId);
  const merged = mergeChatMessages(current.chatMessages, messages);
  const nextSnapshot = {
    ...current,
    ownerUserId,
    chatMessages: merged
  };
  saveLocalAppSnapshot(nextSnapshot);
  saveDevFallbackMessages(merged);
  return merged;
}

function loadDevFallbackMessages(ownerUserId = DEFAULT_USER_ID) {
  if (typeof window === 'undefined') {
    return CHAT_MESSAGE_SEED;
  }

  try {
    const raw = window.localStorage.getItem(DEV_FALLBACK_STORAGE_KEY);
    if (!raw) return CHAT_MESSAGE_SEED;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return CHAT_MESSAGE_SEED;
    return parsed.filter((message) => message.ownerUserId === ownerUserId);
  } catch {
    return CHAT_MESSAGE_SEED;
  }
}

function saveDevFallbackMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DEV_FALLBACK_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage issues in fallback mode.
  }
}

function loadLocalSectionSubmissions(ownerUserId = DEFAULT_USER_ID) {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(SECTION_SUBMISSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((submission) => submission?.ownerUserId === ownerUserId || !submission?.ownerUserId);
  } catch {
    return [];
  }
}

function saveLocalSectionSubmissions(submissions) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SECTION_SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    // Ignore storage issues in fallback mode.
  }
}

function persistSectionSubmissionToLocal(submission, ownerUserId = DEFAULT_USER_ID) {
  const current = loadLocalSectionSubmissions(ownerUserId);
  const next = mergeById(current, [submission]);
  saveLocalSectionSubmissions(next);
  return next;
}

function persistRemoteSectionWriteDisabled() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SECTION_REMOTE_WRITE_DISABLED_KEY, 'true');
  } catch {
    // Ignore storage issues in fallback mode.
  }
}

let remoteSectionWritesAvailable = typeof window === 'undefined'
  ? true
  : window.localStorage.getItem(SECTION_REMOTE_WRITE_DISABLED_KEY) !== 'true';

function mergeById(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((item) => {
    if (!item) return;
    map.set(String(item.id), item);
  });
  return Array.from(map.values());
}

function mapSectionSubmissionToItem(submission) {
  const payload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const sectionId = String(submission?.sectionId || payload.sectionId || '').trim();
  const createdAt = submission?.createdAt || payload.created_at || new Date().toISOString();
  const baseItem = {
    ...payload,
    id: payload.id || submission.id || crypto.randomUUID(),
    sectionId,
    created_at: payload.created_at || createdAt
  };

  if (sectionId === 'mur') {
    return {
      ...baseItem,
      type: baseItem.type || 'post',
      title: baseItem.title || 'Publicació',
      summary: baseItem.summary || baseItem.post_subtitle || baseItem.description || '',
      content: baseItem.content || baseItem.description || baseItem.post_subtitle || '',
      post_subtitle: baseItem.post_subtitle || baseItem.description || '',
      author: baseItem.author || baseItem.author_name || 'Foraster',
      author_name: baseItem.author_name || baseItem.author || 'Foraster',
      author_avatar: baseItem.author_avatar || baseItem.avatar_url || null,
      town_name: baseItem.town_name || 'La Torre de les Maçanes',
      imageSrc: baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null,
      image_url: baseItem.image_url || baseItem.image || baseItem.imageSrc || null,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.post_subtitle,
        baseItem.description,
        baseItem.content,
        baseItem.author,
        baseItem.author_name,
        baseItem.town_name,
        baseItem.tag,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'mercat') {
    const imageSrc = baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null;
    return {
      ...baseItem,
      type: baseItem.type || 'product',
      title: baseItem.title || 'Producte',
      description: baseItem.description || baseItem.summary || '',
      summary: baseItem.summary || baseItem.description || '',
      seller: baseItem.seller || baseItem.author_name || 'Foraster',
      avatar_url: baseItem.avatar_url || null,
      imageSrc,
      image_url: baseItem.image_url || baseItem.image || imageSrc || null,
      image: baseItem.image || imageSrc || null,
      category_slug: baseItem.category_slug || 'connectat',
      tag: baseItem.tag || 'Connectat',
      variations: Array.isArray(baseItem.variations) ? baseItem.variations : [],
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.summary,
        baseItem.seller,
        baseItem.tag,
        baseItem.category_slug,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'events') {
    return {
      ...baseItem,
      type: baseItem.type || 'event',
      title: baseItem.title || 'Esdeveniment',
      description: baseItem.description || baseItem.summary || '',
      summary: baseItem.summary || baseItem.description || '',
      author_name: baseItem.author_name || baseItem.author || 'Foraster',
      date: baseItem.date || createdAt.slice(0, 10),
      image_url: baseItem.image_url || null,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.summary,
        baseItem.author_name,
        baseItem.type,
        baseItem.sectionId
      ])
    };
  }

  return baseItem;
}

function applySectionSubmissionsToData(data, ownerUserId = DEFAULT_USER_ID) {
  const remoteSubmissions = Array.isArray(data.sectionSubmissions) ? data.sectionSubmissions : [];
  const localSubmissions = loadLocalSectionSubmissions(ownerUserId);
  const mergedSubmissions = mergeById(remoteSubmissions, localSubmissions);

  const sectionItems = mergedSubmissions.reduce((accumulator, submission) => {
    const item = mapSectionSubmissionToItem(submission);
    if (!CONNECTABLE_SECTION_IDS.has(item.sectionId)) return accumulator;
    const items = accumulator[item.sectionId] || [];
    items.push(item);
    accumulator[item.sectionId] = items;
    return accumulator;
  }, {});

  return {
    ...data,
    sectionSubmissions: mergedSubmissions,
    feedPosts: mergeById(data.feedPosts || [], sectionItems.mur || []),
    marketItems: mergeById(data.marketItems || [], sectionItems.mercat || []),
    events: mergeById(data.events || [], sectionItems.events || [])
  };
}

function loadChatConversationMap() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CHAT_CONVERSATION_MAP_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveChatConversationMap(map) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHAT_CONVERSATION_MAP_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage issues in fallback mode.
  }
}

function persistRemoteChatWriteDisabled() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHAT_REMOTE_WRITE_DISABLED_KEY, 'true');
  } catch {
    // Ignore storage issues in fallback mode.
  }
}

function getGuestDbUserId() {
  if (typeof window === 'undefined') return LEGACY_CHAT_AI_ID;
  try {
    const stored = window.localStorage.getItem(CHAT_GUEST_DB_USER_ID_KEY);
    if (stored) return stored;
    const generated = crypto.randomUUID();
    window.localStorage.setItem(CHAT_GUEST_DB_USER_ID_KEY, generated);
    return generated;
  } catch {
    return LEGACY_CHAT_AI_ID;
  }
}

function buildChatConversationMap(threadIds = [], messages = []) {
  const storedMap = loadChatConversationMap();
  const usedConversationIds = new Set(
    Object.values(storedMap)
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  );
  const availableConversationIds = [
    ...new Set(messages.map((message) => String(message.conversation_id || '').trim()).filter(Boolean))
  ].filter((conversationId) => !usedConversationIds.has(conversationId));

  const nextMap = { ...storedMap };
  threadIds.forEach((threadId) => {
    if (nextMap[threadId]) return;
    const conversationId = availableConversationIds.shift() || crypto.randomUUID();
    nextMap[threadId] = conversationId;
    usedConversationIds.add(conversationId);
  });

  saveChatConversationMap(nextMap);
  return nextMap;
}

function mapLegacyDbMessagesToThreads(messages = [], threadMap = {}, ownerUserId = DEFAULT_USER_ID) {
  const conversationToThread = new Map(
    Object.entries(threadMap).map(([threadId, conversationId]) => [String(conversationId), threadId])
  );
  const guestDbUserId = getGuestDbUserId();
  const fallbackThreadId = Object.keys(threadMap)[0] || 'xat';

  return messages.map((message, index) => {
    const threadId = conversationToThread.get(String(message.conversation_id || '').trim()) || fallbackThreadId;
    const senderIsMe = String(message.sender_id || '') === guestDbUserId;
    const createdAt = message.created_at ? new Date(message.created_at) : null;
    const createdAtTs = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.getTime() : index;

    return {
      id: message.id,
      ownerUserId,
      threadId,
      messageId: message.message_id || String(message.id || index + 1),
      text: message.content || '',
      sender: message.is_ai || !senderIsMe ? 'other' : 'me',
      time: createdAt ? createdAt.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }) : 'Ara',
      createdAtTs
    };
  });
}

function mergeChatMessages(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((message) => {
    if (!message) return;
    map.set(String(message.id), message);
  });
  return Array.from(map.values()).sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
}

function mapLegacyProfilesToAgents(profiles = [], entities = []) {
  const profileAgents = profiles.map((profile) => ({
    id: profile.id,
    name: profile.full_name || profile.username || 'Perfil',
    role: profile.role || profile.ofici || 'Membre de la comunitat',
    avatar_url: resolveLegacyAssetUrl(profile.avatar_url, { type: 'profile' }),
    last_message_content: profile.bio || 'Perfil de la comunitat',
    tag: profile.is_ai ? 'MASTER' : 'GENT',
    type: profile.is_ai ? 'AI' : 'PERSON',
    color: profile.is_ai ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600',
    town_name: profile.primary_town || 'Sóc de Poble',
    short_bio: profile.bio || '',
    sectionId: 'perfil',
    searchText: buildSearchText([
      profile.full_name,
      profile.username,
      profile.role,
      profile.ofici,
      profile.bio,
      profile.primary_town
    ])
  }));

  const entityAgents = entities.map((entity) => ({
    id: entity.id,
    name: entity.name || 'Entitat',
    role: entity.type || 'Entitat',
    avatar_url: resolveLegacyAssetUrl(entity.avatar_url, { type: 'profile' }),
    last_message_content: entity.description || entity.motto || 'Entitat de la comunitat',
    tag: entity.type === 'institution' ? 'ADMIN' : 'ENTITAT',
    type: 'ENTITY',
    color: 'bg-indigo-100 text-indigo-600',
    town_name: entity.slug || 'Sóc de Poble',
    short_bio: entity.description || entity.motto || '',
    sectionId: 'perfil',
    searchText: buildSearchText([entity.name, entity.type, entity.description, entity.slug])
  }));

  return [...profileAgents, ...entityAgents];
}

function mapLegacyPosts(posts = [], townLookup = new Map(), profileLookup = new Map()) {
  return posts.map((post) => {
    const town = townLookup.get(post.town_uuid);
    const authorProfile = profileLookup.get(post.author_user_id);
    const title = post.title || post.seo_title || toSummary(post.content) || 'Publicació';
    const summary = post.post_subtitle || post.seo_description || toSummary(post.content);
    const imageSrc = resolveLegacyPostAsset(
      firstAsset(post.image_url) || authorProfile?.avatar_url,
      [title, summary, post.content, post.author, authorProfile?.name, town?.title, town?.name].filter(Boolean).join(' '),
      post.id || post.slug || title
    );

    return {
      ...post,
      sectionId: 'mur',
      title,
      summary,
      content: post.content || summary,
      imageSrc,
      image_url: imageSrc,
      author_avatar: resolveLegacyAssetUrl(authorProfile?.avatar_url, { type: 'profile' }),
      author_name: post.author || authorProfile?.name || 'Sóc de Poble',
      town_name: town?.title || town?.name || 'La Torre de les Maçanes',
      type: post.type || 'post',
      likes: post.connections_count || post.connections || 0,
      comments: post.comments_count || 0,
      time: post.created_at ? 'BD remota' : 'Ara',
      searchText: buildSearchText([
        title,
        summary,
        post.content || summary,
        post.author,
        authorProfile?.name,
        town?.title,
        town?.name
      ])
    };
  });
}

function mapLegacyMarketItems(items = [], townLookup = new Map(), profileLookup = new Map()) {
  return items.map((item) => {
    const town = townLookup.get(item.town_uuid);
    const authorProfile = profileLookup.get(item.author_user_id);
    const imageSrc = resolveLegacyMarketAsset(
      firstAsset(item.image_url) || item.avatar_url || authorProfile?.avatar_url,
      [item.title, item.subtitle, item.description, item.category_slug, authorProfile?.name, town?.title, town?.name].filter(Boolean).join(' '),
      item.uuid || item.id || item.slug || item.title
    );
    const authorAvatar = resolveLegacyAssetUrl(item.avatar_url || authorProfile?.avatar_url, { type: 'profile' });

    return {
      ...item,
      id: item.uuid || item.id,
      sectionId: 'mercat',
      imageSrc,
      image_url: imageSrc,
      image: imageSrc,
      avatar_url: authorAvatar,
      seller: authorProfile?.name || item.seller_name || item.author_name || 'Venedor local',
      town_name: town?.title || town?.name || 'La Torre de les Maçanes',
      subtitle: item.subtitle || '',
      summary: item.subtitle || item.description || '',
      searchText: buildSearchText([
        item.title,
        item.subtitle,
        item.description,
        item.category_slug,
        authorProfile?.name,
        town?.title
      ])
    };
  });
}

function mapLegacyTowns(towns = []) {
  return towns.map((town) => ({
    ...town,
    title: town.name,
    post_subtitle: town.description || `${town.comarca || ''} ${town.province || ''}`.trim(),
    content: town.description || '',
    image_url: resolveTownImageUrl(
      town.cover_url || town.avatar_url || town.copy_img,
      town.name || town.title || town.slug || town.description,
      town.id || town.slug || town.name
    ),
    type: town.comarca || 'Territori',
    population: town.population ? `${town.population} habitants` : 'Sense dada',
    sectionId: 'pobles',
    searchText: buildSearchText([town.name, town.description, town.comarca, town.province, town.slug])
  }));
}

function mapLegacyMediaItems(mediaAssets = [], posts = [], marketItems = [], towns = []) {
  const assetItems = mediaAssets.map((asset) => ({
    id: asset.id,
    title: asset.alt_text || asset.file_name || 'Arxiu visual',
    subtitle: asset.caption || asset.folder_category || 'Multimèdia',
    description: asset.caption || asset.alt_text || '',
    src: asset.url,
    kind: asset.mime_type?.startsWith('video/') ? 'video' : 'image',
    tag: 'Arxiu',
    source: 'Supabase',
    created_at: asset.created_at,
    sectionId: 'multimedia',
    searchText: buildSearchText([asset.alt_text, asset.caption, asset.file_name, asset.folder_category])
  }));

  const postItems = posts
    .filter((post) => post.imageSrc)
    .slice(0, 24)
    .map((post) => ({
      id: `post-${post.id}`,
      title: post.title,
      subtitle: post.author_name,
      description: post.summary,
      src: post.imageSrc,
      kind: 'image',
      tag: 'Mur',
      source: post.author_name,
      created_at: post.created_at,
      sectionId: 'multimedia',
      searchText: post.searchText
    }));

  const marketMedia = marketItems
    .filter((item) => item.imageSrc)
    .slice(0, 24)
    .map((item) => ({
      id: `market-${item.id}`,
      title: item.title,
      subtitle: item.seller,
      description: item.summary,
      src: item.imageSrc,
      kind: 'image',
      tag: 'Mercat',
      source: item.seller,
      created_at: item.created_at,
      sectionId: 'multimedia',
      searchText: item.searchText
    }));

  const townMedia = towns
    .filter((town) => town.image_url)
    .slice(0, 24)
    .map((town) => ({
      id: `town-${town.id}`,
      title: town.title,
      subtitle: town.post_subtitle,
      description: town.content,
      src: town.image_url,
      kind: 'image',
      tag: 'Poble',
      source: town.title,
      created_at: town.created_at,
      sectionId: 'multimedia',
      searchText: town.searchText
    }));

  return [...assetItems, ...postItems, ...marketMedia, ...townMedia];
}

async function loadLegacyRemoteData(ownerUserId) {
  const [postsResponse, marketResponse, profilesResponse, townsResponse, entitiesResponse, mediaResponse, sectionSubmissionsResponse] = await Promise.all([
    request('/rest/v1/posts?select=*&order=created_at.desc&limit=60'),
    request('/rest/v1/market_items?select=*&order=created_at.desc&limit=60'),
    request('/rest/v1/profiles?select=*&order=created_at.desc&limit=60'),
    request('/rest/v1/towns?select=*&order=created_at.desc&limit=60'),
    request('/rest/v1/entities?select=*&order=created_at.desc&limit=40'),
    request('/rest/v1/media_assets?select=*&order=created_at.desc&limit=40'),
    requestMaybe(`/rest/v1/section_submissions?select=*&owner_user_id=eq.${encodeURIComponent(ownerUserId)}&order=created_at.asc`)
  ]);
  let messagesResponse = [];
  try {
    messagesResponse = await request('/rest/v1/messages?select=id,conversation_id,sender_id,content,created_at,is_ai,is_playground&order=created_at.asc');
  } catch {
    messagesResponse = [];
  }

  const legacyTowns = mapLegacyTowns(townsResponse || []);
  const townLookup = new Map(legacyTowns.map((town) => [town.id, town]));
  const profileAgents = mapLegacyProfilesToAgents(profilesResponse || [], entitiesResponse || []);
  const profileLookup = new Map(profileAgents.map((agent) => [agent.id, agent]));
  const feedPosts = mapLegacyPosts(postsResponse || [], townLookup, profileLookup);
  const marketItems = mapLegacyMarketItems(marketResponse || [], townLookup, profileLookup);
  const mediaItems = mapLegacyMediaItems(mediaResponse || [], feedPosts, marketItems, legacyTowns);
  const chatThreads = APP_SEED.chatThreads;
  const threadMap = buildChatConversationMap(chatThreads.map((thread) => thread.id), messagesResponse || []);
  const chatMessages = mapLegacyDbMessagesToThreads(messagesResponse || [], threadMap, ownerUserId);

  return {
    ownerUserId,
    agents: profileAgents.length ? profileAgents : APP_SEED.agents,
    chatThreads,
    chatMessages: mergeChatMessages(chatMessages, loadDevFallbackMessages(ownerUserId)),
    feedPosts: feedPosts.length ? feedPosts : APP_SEED.feedPosts,
    marketItems: marketItems.length ? marketItems : APP_SEED.marketItems,
    events: APP_SEED.events,
    towns: legacyTowns.length ? legacyTowns : APP_SEED.towns,
    mediaItems: mediaItems.length ? mediaItems : APP_SEED.mediaItems,
    noteFolders: APP_SEED.noteFolders,
    notes: APP_SEED.notes,
    pages: APP_SEED.pages,
    sectionSubmissions: Array.isArray(sectionSubmissionsResponse?.data) ? sectionSubmissionsResponse.data : [],
    seedVersion: APP_SEED_VERSION
  };
}

async function loadStructuredSupabaseData(ownerUserId) {
  const [contentRows, chatThreads, chatMessages, sectionSubmissionsResponse] = await Promise.all([
    request('/rest/v1/app_content?select=key,payload,version'),
    request('/rest/v1/chat_threads?select=id,payload'),
    request(`/rest/v1/chat_messages?select=id,owner_user_id,thread_id,message_id,text,sender,time_label,created_at&owner_user_id=eq.${encodeURIComponent(ownerUserId)}&order=created_at.asc`),
    requestMaybe(`/rest/v1/section_submissions?select=*&owner_user_id=eq.${encodeURIComponent(ownerUserId)}&order=created_at.asc`)
  ]);

  if (!Array.isArray(contentRows) || contentRows.length === 0) {
    throw new Error('La BD remota està buida. Executa supabase/schema.sql i supabase/seed.sql.');
  }

  if (!Array.isArray(chatThreads) || chatThreads.length === 0) {
    throw new Error('Falten fils de xat en la BD remota. Executa supabase/seed.sql.');
  }

  const baseData = mapContentRowsToData(contentRows || []);
  return {
    ...baseData,
    ownerUserId,
    chatThreads: (chatThreads || []).map((thread) => ({ id: thread.id, ...thread.payload })),
    chatMessages: mergeChatMessages(
      (chatMessages || []).map((message) => ({
      id: message.id,
      ownerUserId: message.owner_user_id,
      threadId: message.thread_id,
      messageId: message.message_id,
      text: message.text,
      sender: message.sender,
      time: message.time_label,
      createdAtTs: message.created_at ? new Date(message.created_at).getTime() : 0
      })),
      loadDevFallbackMessages(ownerUserId)
    ),
    sectionSubmissions: Array.isArray(sectionSubmissionsResponse?.data) ? sectionSubmissionsResponse.data : [],
    seedVersion: APP_SEED_VERSION
  };
}

async function loadRemoteAppData(ownerUserId = DEFAULT_USER_ID) {
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  if (legacyCompatibilityEnabled) {
    return loadLegacyRemoteData(ownerUserId);
  }

  return loadStructuredSupabaseData(ownerUserId);
}

export async function loadAppData(ownerUserId = DEFAULT_USER_ID) {
  const loadAndMerge = async (loader) => applySectionSubmissionsToData(await loader, ownerUserId);

  if (runtimeDataMode === 'seed') {
    return loadAndMerge(buildSeedAppData(ownerUserId));
  }

  if (runtimeDataMode === 'local') {
    return loadAndMerge(loadLocalAppSnapshot(ownerUserId));
  }

  if (runtimeDataMode === 'hybrid') {
    if (!hasSupabaseConfig) {
      return loadAndMerge(loadLocalAppSnapshot(ownerUserId));
    }

    try {
      return await loadAndMerge(loadRemoteAppData(ownerUserId));
    } catch {
      return loadAndMerge(loadLocalAppSnapshot(ownerUserId));
    }
  }

  if (!hasSupabaseConfig) {
    return loadAndMerge(buildSeedAppData(ownerUserId));
  }

  return loadAndMerge(loadRemoteAppData(ownerUserId));
}

export async function appendChatMessages(messages) {
  if (runtimeDataMode === 'local' || runtimeDataMode === 'hybrid') {
    const localMerged = persistMessagesToLocalSnapshot(messages, DEFAULT_USER_ID);
    if (runtimeDataMode === 'local') return localMerged;
  }

  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const current = loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = [...current, ...messages];
    saveDevFallbackMessages(merged);
    return merged;
  }

  if (!remoteChatWritesAvailable) {
    if (runtimeDataMode === 'hybrid') {
      return persistMessagesToLocalSnapshot(messages, DEFAULT_USER_ID);
    }
    const current = loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = mergeChatMessages(current, messages);
    saveDevFallbackMessages(merged);
    return merged;
  }

  try {
    if (legacyCompatibilityEnabled) {
      const threadMap = buildChatConversationMap(
        [...new Set(messages.map((message) => String(message.threadId || '').trim()).filter(Boolean))],
        []
      );
      const legacyRows = messages.map((message) => ({
        id: crypto.randomUUID(),
        conversation_id: threadMap[message.threadId] || message.conversationId || message.threadId,
        sender_id: message.senderId || (message.sender === 'me' ? getGuestDbUserId() : LEGACY_CHAT_AI_ID),
        content: message.text,
        created_at: new Date(message.createdAtTs || Date.now()).toISOString()
      }));

      await request(`/rest/v1/messages?on_conflict=${encodeURIComponent('id')}`, {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: legacyRows
      });
    } else {
      const rows = messages.map((message) => ({
        id: String(message.id),
        owner_user_id: message.ownerUserId || DEFAULT_USER_ID,
        thread_id: String(message.threadId),
        message_id: String(message.messageId || message.id),
        text: message.text,
        sender: message.sender === 'me' ? 'me' : 'other',
        time_label: message.time || null,
        created_at: new Date(message.createdAtTs || Date.now()).toISOString()
      }));

      await request(`/rest/v1/chat_messages?on_conflict=${encodeURIComponent('id')}`, {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: rows
      });
    }

    const current = loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = mergeChatMessages(current, messages);
    saveDevFallbackMessages(merged);
    return merged;
  } catch (error) {
    const message = String(error?.message || '');
    const isRlsDenied =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('401') ||
      message.includes('403');

    if (!isRlsDenied) {
      throw error;
    }

    remoteChatWritesAvailable = false;
    persistRemoteChatWriteDisabled();
    if (runtimeDataMode === 'hybrid') {
      return persistMessagesToLocalSnapshot(messages, DEFAULT_USER_ID);
    }
    const current = loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = mergeChatMessages(current, messages);
    saveDevFallbackMessages(merged);
    return merged;
  }
}

export async function appendSectionSubmission(submission) {
  const ownerUserId = submission?.ownerUserId || DEFAULT_USER_ID;
  const sectionId = String(submission?.sectionId || '').trim();
  if (!CONNECTABLE_SECTION_IDS.has(sectionId)) {
    throw new Error('Secció no suportada per a connectar.');
  }

  const id = String(submission?.id || crypto.randomUUID());
  const createdAt = submission?.createdAt || new Date().toISOString();
  const basePayload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const payload = mapSectionSubmissionToItem({
    ...submission,
    id,
    ownerUserId,
    sectionId,
    createdAt,
    payload: {
      ...basePayload,
      id,
      ownerUserId,
      sectionId,
      created_at: basePayload.created_at || createdAt
    }
  });
  const storedSubmission = {
    id,
    ownerUserId,
    sectionId,
    title: submission?.title || payload.title || '',
    description: submission?.description || payload.description || payload.summary || '',
    createdAt,
    payload
  };

  persistSectionSubmissionToLocal(storedSubmission, ownerUserId);

  if (runtimeDataMode === 'seed' || runtimeDataMode === 'local' || !hasSupabaseConfig) {
    return storedSubmission;
  }

  if (!remoteSectionWritesAvailable) {
    return storedSubmission;
  }

  try {
    await request('/rest/v1/section_submissions?on_conflict=' + encodeURIComponent('id'), {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: [
        {
          id,
          owner_user_id: ownerUserId,
          section_id: sectionId,
          title: storedSubmission.title,
          description: storedSubmission.description,
          payload,
          created_at: createdAt
        }
      ]
    });
    return storedSubmission;
  } catch (error) {
    const message = String(error?.message || '');
    const isRemoteUnavailable =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('401') ||
      message.includes('403') ||
      message.includes('404') ||
      message.includes('does not exist');

    if (isRemoteUnavailable) {
      remoteSectionWritesAvailable = false;
      persistRemoteSectionWriteDisabled();
    }

    return storedSubmission;
  }
}

export {
  APP_SNAPSHOT_STORAGE_KEY,
  DATA_SYNC_CHANNEL_NAME,
  DEFAULT_USER_ID,
  SECTION_SUBMISSIONS_STORAGE_KEY,
  hasSupabaseConfig,
  runtimeDataMode
};
