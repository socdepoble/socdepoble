import { buildSearchText, byId, stripAccents } from '../../config/contentHelpers.js';
import { AGENT_LIST } from '../profile/profileContent.js';
import { MOCK_CHATS, MOCK_MESSAGES } from './chatSeed.js';

const agentLookup = new Map();
AGENT_LIST.forEach((agent) => {
  agentLookup.set(stripAccents(agent.name), agent);
});

const buildChatThread = (item, fallbackAgent = null) => {
  const agent = fallbackAgent || agentLookup.get(stripAccents(item.name)) || agentLookup.get(stripAccents(item.id));
  const name = agent?.name || item.name;
  const avatar = agent?.avatar_url || item.avatar_url || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg';
  const role = agent?.role || item.type || 'Xat';
  const kind = agent?.tag || item.type || 'Xat';
  const isIa = Boolean(item.is_iaia || agent?.type === 'AI' || kind === 'MASTER');

  return {
    ...item,
    id: item.id || stripAccents(name),
    name,
    message: item.message || agent?.last_message_content || 'Hola! Vols que parlem?',
    time: item.time || 'Ara',
    role,
    avatar_url: avatar,
    tag: kind,
    is_iaia: isIa
  };
};

const representedAgentNames = new Set(MOCK_CHATS.map((item) => stripAccents(item.name)));

const extraAgentThreads = AGENT_LIST
  .filter((agent) => !representedAgentNames.has(stripAccents(agent.name)))
  .map((agent) => buildChatThread({
    id: agent.id,
    name: agent.name,
    message: agent.last_message_content,
    time: 'Ara',
    type: agent.tag
  }, agent));

export const CHAT_THREADS = byId([
  ...MOCK_CHATS.map((item) => buildChatThread(item)),
  ...extraAgentThreads
]).map((item) => ({
  ...item,
  searchText: buildSearchText([item.name, item.message, item.role, item.tag])
}));

export const CHAT_MESSAGES = MOCK_MESSAGES;
