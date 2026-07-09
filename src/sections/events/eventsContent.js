import { buildSearchText, sortDateValue } from '../../config/contentHelpers.js';
import { CALENDAR_EVENTS } from './eventsSeed.js';

export const EVENTS = CALENDAR_EVENTS.map((item) => ({
  ...item,
  sectionId: 'events',
  searchText: buildSearchText([item.title, item.description, item.author_name, item.type, item.file]),
  sortDateValue: sortDateValue(item.date)
}));
