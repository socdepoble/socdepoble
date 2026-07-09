import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  appendChatMessages,
  appendSectionSubmission,
  APP_SNAPSHOT_STORAGE_KEY,
  DATA_SYNC_CHANNEL_NAME,
  DEFAULT_USER_ID,
  hasSupabaseConfig,
  SECTION_SUBMISSIONS_STORAGE_KEY,
  loadAppData,
  runtimeDataMode
} from '../data/supabaseBackend';
import { normalizeSearchText, sortPinnedContent } from '../config/contentHelpers';
import { createTranslator, readStoredLanguage, writeStoredLanguage } from '../config/i18n';
import { makeChatReply } from '../sections/xat/chatRuntime';

const AppDataContext = createContext(null);
const DATA_SYNC_STORAGE_KEYS = new Set([APP_SNAPSHOT_STORAGE_KEY, SECTION_SUBMISSIONS_STORAGE_KEY]);
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

const groupMediaTimeline = (items, t, locale) => {
  const groups = new Map();
  items.forEach((item) => {
    const key = item.created_at ? String(item.created_at).slice(0, 7) : 'sense-data';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return Array.from(groups.entries()).map(([key, groupItems]) => {
    const date = new Date(groupItems[0]?.created_at);
    return {
      key,
      label: Number.isNaN(date.getTime())
        ? t('common.noDate', 'Sense data')
        : date.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
      items: groupItems
    };
  });
};

const sortEvents = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = Number.isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = Number.isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return timeB - timeA;
  });

const buildSearchCollections = (data) => [
  ...data.agents,
  ...data.chatThreads,
  ...data.feedPosts,
  ...data.marketItems,
  ...data.events,
  ...data.towns
];

const buildPageCopy = (pages) =>
  Object.fromEntries(pages.map((page) => [page.key, { title: page.title, subtitle: page.subtitle, html: page.html }]));

const buildMessageMap = (messages) =>
  messages.reduce((accumulator, message) => {
    const current = accumulator[message.threadId] || [];
    current.push(message);
    current.sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
    accumulator[message.threadId] = current;
    return accumulator;
  }, {});

const buildFallbackMessages = (thread) => [
  {
    id: `${DEFAULT_USER_ID}::${thread.id}::fallback-1`,
    ownerUserId: DEFAULT_USER_ID,
    threadId: thread.id,
    messageId: 'fallback-1',
    createdAtTs: 0,
    text: `Hola, soc ${thread.name}.`,
    sender: 'other',
    time: 'Ara'
  },
  {
    id: `${DEFAULT_USER_ID}::${thread.id}::fallback-2`,
    ownerUserId: DEFAULT_USER_ID,
    threadId: thread.id,
    messageId: 'fallback-2',
    createdAtTs: 1,
    text: thread.message || thread.role || 'Vols parlar una estona?',
    sender: 'other',
    time: 'Ara'
  }
];

const appendUniqueById = (items = [], item) => {
  if (!item) return items;
  const map = new Map(items.map((entry) => [String(entry.id), entry]));
  map.set(String(item.id), item);
  return Array.from(map.values());
};

const broadcastDataUpdate = () => {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;

  try {
    const channel = new BroadcastChannel(DATA_SYNC_CHANNEL_NAME);
    channel.postMessage({ type: 'content:updated' });
    channel.close();
  } catch {
    // Ignore sync errors between tabs.
  }
};

export function AppDataProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [language, setLanguage] = useState(() => readStoredLanguage());

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const data = await loadAppData(DEFAULT_USER_ID);
        if (cancelled) return;
        setRawData(data);
        setStatus('ready');
        setError(null);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError);
        setStatus('error');
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let cancelled = false;
    let channel = null;

    const refreshData = async () => {
      try {
        const data = await loadAppData(DEFAULT_USER_ID);
        if (cancelled) return;
        setRawData(data);
        setStatus('ready');
      } catch {
        if (cancelled) return;
      }
    };

    const onStorage = (event) => {
      if (!event?.key || !DATA_SYNC_STORAGE_KEYS.has(event.key)) return;
      refreshData();
    };

    window.addEventListener('storage', onStorage);

    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(DATA_SYNC_CHANNEL_NAME);
      channel.addEventListener('message', (event) => {
        if (event?.data?.type !== 'content:updated') return;
        refreshData();
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      channel?.close();
    };
  }, []);

  useEffect(() => {
    writeStoredLanguage(language);
  }, [language]);

  const value = useMemo(() => {
    const translator = createTranslator(language);
    const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

    if (!rawData) {
      return {
        status,
        error,
        ownerUserId: DEFAULT_USER_ID,
        hasSupabaseConfig,
        dataMode: runtimeDataMode,
        language,
        setLanguage,
        t: translator
      };
    }

    const sortedFeedPosts = sortPinnedContent(rawData.feedPosts);
    const sortedMarketItems = sortPinnedContent(rawData.marketItems);
    const sortedEvents = sortEvents(rawData.events);
    const featuredTowns = rawData.towns.slice(0, 6);
    const mediaTimelineGroups = groupMediaTimeline(rawData.mediaItems, translator, locale);
    const pageCopy = buildPageCopy(rawData.pages);
    const pageDetailLookup = new Map(
      rawData.feedPosts.flatMap((item) => {
        const keys = [];
        if (item.slug) keys.push([String(item.slug), item]);
        if (item.id != null) keys.push([String(item.id), item]);
        return keys;
      })
    );
    const globalSearchItems = buildSearchCollections(rawData);
    const chatMessagesByThread = buildMessageMap(rawData.chatMessages);

    const getSectionItems = (sectionId) => {
      switch (sectionId) {
        case 'xat':
          return rawData.chatThreads;
        case 'mur':
          return rawData.feedPosts;
        case 'mercat':
          return rawData.marketItems;
        case 'events':
          return rawData.events;
        case 'pobles':
          return rawData.towns;
        case 'multimedia':
          return rawData.mediaItems;
        case 'notes':
          return rawData.notes;
        default:
          return [];
      }
    };

    const findSectionItem = (sectionId, itemId) =>
      getSectionItems(sectionId).find((item) => String(item.id) === String(itemId) || String(item.slug) === String(itemId)) || null;

    const sendChatMessage = async (thread, text) => {
      const nowTs = Date.now();
      const messageId = `${nowTs}`;
      const userMessage = {
        id: `${rawData.ownerUserId}::${thread.id}::${messageId}-me`,
        ownerUserId: rawData.ownerUserId,
        threadId: thread.id,
        messageId: `${messageId}-me`,
        createdAtTs: nowTs,
        text,
        sender: 'me',
        time: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      };
      const replyBase = makeChatReply(thread, text);
      const replyMessage = {
        id: `${rawData.ownerUserId}::${thread.id}::${replyBase.id}`,
        ownerUserId: rawData.ownerUserId,
        threadId: thread.id,
        messageId: replyBase.id,
        createdAtTs: nowTs + 1,
        ...replyBase
      };

      await appendChatMessages([userMessage, replyMessage]);

      setRawData((current) => ({
        ...current,
        chatMessages: [...current.chatMessages, userMessage, replyMessage]
      }));
      broadcastDataUpdate();

      return [userMessage, replyMessage];
    };

    const getThreadMessages = (threadId, fallbackThread = null) => {
      const messages = chatMessagesByThread[threadId] || [];
      if (messages.length > 0) return messages;
      const thread = fallbackThread || rawData.chatThreads.find((entry) => entry.id === threadId);
      return thread ? buildFallbackMessages(thread) : [];
    };

    const sendSectionSubmission = async (submission) => {
      const preparedSubmission = {
        ...submission,
        ownerUserId: rawData.ownerUserId
      };
      const persistedSubmission = await appendSectionSubmission(preparedSubmission);
      const item = persistedSubmission.payload || preparedSubmission.payload || preparedSubmission;
      const sectionId = String(persistedSubmission.sectionId || item.sectionId || '').trim();

      setRawData((current) => {
        if (!current) return current;

        const next = {
          ...current,
          sectionSubmissions: appendUniqueById(current.sectionSubmissions || [], persistedSubmission)
        };

        if (sectionId === 'mur') {
          next.feedPosts = appendUniqueById(current.feedPosts || [], item);
        } else if (sectionId === 'mercat') {
          next.marketItems = appendUniqueById(current.marketItems || [], item);
        } else if (sectionId === 'events') {
          next.events = appendUniqueById(current.events || [], item);
        }

        return next;
      });
      broadcastDataUpdate();

      return persistedSubmission;
    };

    return {
      status,
      error,
      ownerUserId: rawData.ownerUserId,
      hasSupabaseConfig,
      dataMode: runtimeDataMode,
      language,
      setLanguage,
      t: translator,
      agents: rawData.agents,
      chatThreads: rawData.chatThreads,
      feedPosts: rawData.feedPosts,
      marketItems: rawData.marketItems,
      events: rawData.events,
      towns: rawData.towns,
      mediaItems: rawData.mediaItems,
      noteFolders: rawData.noteFolders,
      notes: rawData.notes,
      pages: rawData.pages,
      sectionSubmissions: rawData.sectionSubmissions || [],
      pageCopy,
      sortedFeedPosts,
      sortedMarketItems,
      sortedEvents,
      featuredTowns,
      mediaTimelineGroups,
      globalSearchItems,
      pageDetailLookup,
      normalizeSearchText,
      getSectionItems,
      findSectionItem,
      getThreadMessages,
      sendChatMessage,
      sendSectionSubmission
    };
  }, [error, language, rawData, status]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData ha d\'usar-se dins de AppDataProvider.');
  }
  return context;
}
