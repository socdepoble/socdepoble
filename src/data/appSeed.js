import {
  AGENT_LIST,
  CHAT_MESSAGES,
  CHAT_THREADS,
  EVENTS,
  FEED_POSTS,
  MARKET_ITEMS,
  MEDIA_ITEMS,
  PAGE_COPY,
  TOWNS
} from './sectionContent.js';

export const APP_SEED_VERSION = 1;
export const DEFAULT_USER_ID = 'foraster';

export const NOTE_FOLDERS_SEED = [
  { id: 'f-root', name: 'General', parentId: null },
  { id: 'f-art', name: 'Articles', parentId: null },
  { id: 'f-poble', name: 'Histories del Poble', parentId: null },
  { id: 'f-prompts', name: 'Prompts de Recerca', parentId: null },
  { id: 'f-captures', name: 'Captures', parentId: null }
];

export const NOTES_SEED = [
  {
    id: 'n1',
    title: 'Benvinguda al Quadern de Trellat 📓🏺',
    type: 'rich-text',
    content: '<h1>Benvingut al teu nou espai editorial!</h1><p>Quadern de Trellat v2.0</p>',
    folderId: 'f-root',
    category: 'Trellat',
    tags: ['#benvinguda', '#manual'],
    createdAt: '2026-06-25T09:00:00.000Z',
    updatedAt: '2026-06-25T09:00:00.000Z'
  }
];

export const PAGES_SEED = Object.entries(PAGE_COPY).map(([key, page]) => ({
  id: key,
  key,
  ...page
}));

const CHAT_THREAD_ID_SET = new Set(CHAT_THREADS.map((thread) => thread.id));

export const CHAT_MESSAGE_SEED = Object.entries(CHAT_MESSAGES)
  .filter(([threadId]) => CHAT_THREAD_ID_SET.has(threadId))
  .flatMap(([threadId, messages]) =>
    messages.map((message, index) => ({
      ...message,
      id: `${DEFAULT_USER_ID}::${threadId}::${message.id ?? index + 1}`,
      ownerUserId: DEFAULT_USER_ID,
      threadId,
      messageId: String(message.id ?? index + 1),
      createdAtTs: index
    }))
  );

export { CHAT_THREADS };

export const APP_SEED = {
  agents: AGENT_LIST,
  chatThreads: CHAT_THREADS,
  chatMessages: CHAT_MESSAGE_SEED,
  feedPosts: FEED_POSTS,
  marketItems: MARKET_ITEMS,
  events: EVENTS,
  towns: TOWNS,
  mediaItems: MEDIA_ITEMS,
  noteFolders: NOTE_FOLDERS_SEED,
  notes: NOTES_SEED,
  pages: PAGES_SEED
};

export const APP_CONTENT_ROWS = [
  { key: 'agents', payload: AGENT_LIST },
  { key: 'feedPosts', payload: FEED_POSTS },
  { key: 'marketItems', payload: MARKET_ITEMS },
  { key: 'events', payload: EVENTS },
  { key: 'towns', payload: TOWNS },
  { key: 'mediaItems', payload: MEDIA_ITEMS },
  { key: 'noteFolders', payload: NOTE_FOLDERS_SEED },
  { key: 'notes', payload: NOTES_SEED },
  { key: 'pages', payload: PAGES_SEED }
].map((row) => ({
  ...row,
  version: APP_SEED_VERSION
}));
