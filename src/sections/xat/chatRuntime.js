import { AGENT_LIST } from '../profile/profileContent.js';
import { CHAT_MESSAGES, CHAT_THREADS } from './chatContent.js';
const SEED_RULES = [
  { match: ['iaia', 'iaia-maria', 'maria'], key: 'iaia-maria' },
  { match: ['beatriz-ortega', 'beatriz', 'forn'], key: 'beatriz-ortega' },
  { match: ['el-viatjant', 'viatjant'], key: 'el-viatjant' },
  { match: ['vicent-ferris', 'vicent ferris'], key: 'vicent-ferris' },
  { match: ['carla-soriano'], key: 'carla-soriano' },
  { match: ['andreu-soler', 'javi-llinares', 'rentonar'], key: 'andreu-soler' },
  { match: ['marc-el-gall', 'el-gall', 'gall'], key: 'marc-el-gall' },
  { match: ['grup', 'grup-treball'], key: 'grup-treball' }
];

const stripAccents = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cloneMessage = (message) => ({ ...message });

const getPresetKey = (thread) => {
  const haystack = `${stripAccents(thread?.name)} ${stripAccents(thread?.id)}`;
  const rule = SEED_RULES.find(({ match }) => match.some((value) => haystack.includes(stripAccents(value))));
  return rule?.key || null;
};

const buildSeedMessages = (thread) => {
  const key = thread.seedKey || thread.chatKey || thread.messageKey || getPresetKey(thread);
  const preset = key ? CHAT_MESSAGES[key] : null;
  if (Array.isArray(preset) && preset.length > 0) {
    return preset.map(cloneMessage);
  }

  return [
    {
      id: `${thread.id}-welcome-1`,
      text: `Hola, soc ${thread.name}.`,
      sender: 'other',
      time: 'Ara'
    },
    {
      id: `${thread.id}-welcome-2`,
      text: thread.message || thread.role || 'Vols parlar una estona?',
      sender: 'other',
      time: 'Ara'
    }
  ];
};

export const getSeedChatState = () =>
  Object.fromEntries(CHAT_THREADS.map((thread) => [thread.id, buildSeedMessages(thread)]));

const randomPick = (items) => items[Math.floor(Math.random() * items.length)];

export const makeChatReply = (thread, userText) => {
  const name = stripAccents(thread?.name);
  const text = String(userText || '').trim();
  const time = new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });

  const replySets = {
    iaia: [
      'Xe, això està ben tirat. T’ho mire ara mateix i et dic alguna cosa en un moment.',
      'Ho he llegit de cap a peus. Ves fent, que jo quede vigilant el tinglado.',
      'Perfecte. Açò porta trellat, i si li falta una volta, li la pegarem.',
    ],
    'iaia-maria': [
      'Bona pregunta, fill meu. Deixa’m remenar-ho i ara et conteste amb seny.',
      'Ja ho tinc a la vista. Quan fa olor de poble, jo m’hi pose de seguida.',
      'Això té bona pinta. T’ho confirme en un momentet.',
    ],
    'andreu-soler': [
      'L’Andreu està al peu de l’obra. Quan acabe esta volta, t’ho mirem.',
      'Això entra al planning. No et preocupes, que ho tinc anotat.',
      'Perfecte, que no se’n vaja el fil. Ho deixe preparat.',
    ],
    'carmen-la-del-forn': [
      'Xe, això ho contem i ho traiem del forn en un tres i no res.',
      'Ara mateix ho mire. Si fa olor de massa bona, és que anem bé.',
      'Això està fet. Vine quan vulgues i ho comentem tranquil·lament.',
    ],
    'el-viatjant': [
      'M’ho apunte. Quan torne de la ruta, t’ho detalle amb calma.',
      'Molt bona idea. Això necessita una mica de viatge i un poc de mapa.',
      'Perfecte, que no es perda la connexió. Ho revisem de seguida.',
    ],
    'vicent-ferris': [
      'Ull de gall, això té bona pinta. Ho he llegit i t’ho conteste ara mateix.',
      'La potra està de cara, i açò sembla ben encarat. Seguim.',
      'Esmunyir-ho, esmunyir-ho... però amb trellat. Tinc resposta en un moment.',
    ],
    default: [
      'D’acord. Ho mire i et torne resposta ràpida.',
      'Perfecte, t’he llegit. Ara mateix t’ho conteste.',
      'Bona. Açò em val per a seguir xarrant un ratet.',
    ],
  };

  let baseReplies = replySets.default;
  if (name.includes('iaia')) baseReplies = replySets.iaia;
  else if (name.includes('andreu')) baseReplies = replySets['andreu-soler'];
  else if (name.includes('carmen') || name.includes('forn')) baseReplies = replySets['carmen-la-del-forn'];
  else if (name.includes('viatjant')) baseReplies = replySets['el-viatjant'];
  else if (name.includes('vicent')) baseReplies = replySets['vicent-ferris'];
  else if (name.includes('carla')) {
    baseReplies = [
      'Ho he entés. Calma i bona lletra, que la salut no admet presses.',
      'Perfecte, t’ho confirme en un moment i ho deixem clar.',
      'Gràcies per escriure. Vaig amb això amb molta cura.',
    ];
  } else if (name.includes('joan')) {
    baseReplies = [
      'Documentació clara, sí senyor. T’ho deixe preparat i ordenat.',
      'Ho revise i ho deixe amb segell i fil a l’agulla.',
      'Perfecte. Si cal paperassa, ací estic jo per a posar trellat.',
    ];
  }

  const lastWord = text ? text.split(/\s+/).slice(-1)[0] : '';
  const reply = randomPick(baseReplies);

  return {
    id: `${thread.id}-reply-${Date.now()}`,
    text: lastWord && text.length < 28 ? `${reply} (${lastWord})` : reply,
    sender: 'other',
    time
  };
};

export const bootstrapThreads = () => getSeedChatState();

export const threadLookup = new Map(CHAT_THREADS.map((thread) => [thread.id, thread]));

export const getThreadById = (id) => threadLookup.get(id) || AGENT_LIST.find((agent) => agent.id === id) || null;
