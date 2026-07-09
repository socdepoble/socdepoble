import { AGENT_LIST } from '../sections/profile/profileContent.js';
import { CHAT_MESSAGES, CHAT_THREADS } from '../sections/xat/chatContent.js';
import { EVENTS } from '../sections/events/eventsContent.js';
import { MARKET_ITEMS } from '../sections/mercat/marketContent.js';
import { MEDIA_ITEMS } from '../sections/multimedia/mediaContent.js';
import { FEED_POSTS } from '../sections/mur/feedContent.js';
import { NOTES, NOTE_FOLDERS } from '../sections/notes/notesContent.js';
import { TOWNS } from '../sections/pobles/townsContent.js';
import { PAGE_COPY } from '../sections/text/pageContent.js';

export {
  AGENT_LIST,
  CHAT_MESSAGES,
  CHAT_THREADS,
  EVENTS,
  FEED_POSTS,
  MARKET_ITEMS,
  MEDIA_ITEMS,
  NOTES,
  NOTE_FOLDERS,
  PAGE_COPY,
  TOWNS
};

export const GLOBAL_SEARCH_ITEMS = [
  ...AGENT_LIST,
  ...CHAT_THREADS,
  ...FEED_POSTS,
  ...MARKET_ITEMS,
  ...EVENTS,
  ...TOWNS
];

export const PAGE_DETAIL_LOOKUP = new Map(
  FEED_POSTS.flatMap((item) => {
    const keys = [];
    if (item.slug) keys.push([String(item.slug), item]);
    if (item.id != null) keys.push([String(item.id), item]);
    return keys;
  })
);
