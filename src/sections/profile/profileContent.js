import { buildSearchText } from '../../config/contentHelpers.js';
import { AGENTS } from './agentsSeed.js';

export const AGENT_LIST = AGENTS.map((item) => ({
  ...item,
  sectionId: 'perfil',
  searchText: buildSearchText([item.name, item.role, item.town_name, item.short_bio, item.tag, item.type])
}));
