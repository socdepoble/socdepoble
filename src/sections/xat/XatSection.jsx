import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { BriefcaseBusiness, Landmark, MessageSquare, Search, Send, Settings, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';

const GRUPS_DATA = [
  { id: 'grup-1', name: 'Comissió de Festes 2024', role: 'Grup Local', avatar_url: '/assets/uploads/brain/avatar_ratoli_comic_1778960942888.png', members: '142 membres', tag: 'COL·LECTIU' },
  { id: 'grup-2', name: 'Sindicat de Regants', role: 'Gestió Aigua', avatar_url: '/assets/uploads/avatars/vicent-ferris-comic.png', members: '86 membres', tag: 'COL·LECTIU' },
  { id: 'grup-3', name: 'Grup de Muntanya', role: 'Esports', avatar_url: '/assets/uploads/avatars/avatar_samir_comic.png', members: '34 membres', tag: 'COL·LECTIU' },
  { id: 'grup-4', name: 'Banda de Música', role: 'Cultura', avatar_url: '/assets/uploads/brain/beatriz_somriure_1774195114538.png', members: '60 membres', tag: 'COL·LECTIU' }
];
const EMPRESES_DATA = [
  { id: 'emp-1', name: 'El Rentonar Cooperativa', role: 'Agricultura Sostenible', avatar_url: '/assets/uploads/avatars/vicent-ferris-comic.png', desc: 'Productes KM0', tag: 'EMPRESA' },
  { id: 'emp-2', name: 'Forn de Dalt', role: 'Forn i Pastisseria', avatar_url: '/assets/uploads/avatars/beatriz-ortega-comic.png', desc: 'Obert des del 1940', tag: 'EMPRESA' },
  { id: 'emp-3', name: 'Cooperativa Agrícola', role: 'Sector Primari', avatar_url: '/assets/uploads/avatars/andreu-soler-comic.png', desc: "Venda a l'engròs", tag: 'EMPRESA' },
  { id: 'emp-4', name: 'Bar del Poble', role: 'Restauració', avatar_url: '/assets/uploads/avatars/avatar-marc-comic.png', desc: "L'esmorzar de sempre", tag: 'EMPRESA' }
];
const INSTITUCIONS_DATA = [
  { id: 'inst-1', name: "Simulació de l'Ajuntament", role: 'Administració Local', avatar_url: '/assets/uploads/avatars/nano_escola_comic.png', desc: 'Tràmits i avisos', tag: 'ADMIN' },
  { id: 'inst-2', name: "Simulació de l'Escola", role: 'Educació', avatar_url: '/assets/uploads/avatars/nano_escola_comic.png', desc: 'CEIP El Mas', tag: 'ADMIN' },
  { id: 'inst-3', name: 'Simulació Centre de Salut', role: 'Sanitat', avatar_url: '/assets/uploads/avatars/nano_salut_comic.png', desc: 'Atenció primària', tag: 'ADMIN' }
];

const TAB_META = {
  xat: { icon: MessageSquare, label: 'Xat' },
  gent: { icon: Users, label: 'Gent' },
  grups: { icon: Users, label: 'Grups' },
  empreses: { icon: BriefcaseBusiness, label: 'Empreses' },
  institucions: { icon: Landmark, label: 'Institucions' }
};

const toChatListItem = (item, normalize) => ({
  ...item,
  searchText: normalize([item.name, item.role, item.message, item.tag].filter(Boolean).join(' '))
});

function Avatar({ src, name }) {
  const [broken, setBroken] = useState(false);
  const initials = String(name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (!src || broken) {
    return <div className="avatar avatar--fallback">{initials || '?'}</div>;
  }

  return <img className="avatar" src={src} alt={name} loading="lazy" decoding="async" onError={() => setBroken(true)} />;
}

export default function XatSection() {
  const { agents, chatThreads, getThreadMessages, normalizeSearchText, sendChatMessage, t } = useAppData();
  const navigate = useNavigate();
  const { threadId } = useParams();
  const [tab, setTab] = useState('xat');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeId, setActiveId] = useState(threadId || chatThreads[0]?.id || '111');
  const [draft, setDraft] = useState('');
  const replyTimersRef = useRef(new Map());
  const composerRef = useRef(null);

  const items = useMemo(() => {
    const gentData = agents.filter((agent) => agent.tag === 'GENT');
    const dynamicTabItems = {
      xat: chatThreads.map((thread) =>
        toChatListItem({
          id: thread.id,
          name: thread.name,
          role: thread.role || thread.type || 'Xat',
          avatar_url: thread.avatar_url,
          message: thread.message,
          tag: thread.tag || thread.type || 'Xat',
          is_iaia: thread.is_iaia
        }, normalizeSearchText)
      ),
      gent: gentData.map((agent) =>
        toChatListItem({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          avatar_url: agent.avatar_url,
          message: agent.last_message_content || t('section.xat.memberFallback', 'Membre de la comunitat'),
          tag: agent.tag
        }, normalizeSearchText)
      ),
      grups: GRUPS_DATA.map((item) =>
        toChatListItem({
          id: item.id,
          name: item.name,
          role: item.role,
          avatar_url: item.avatar_url,
          message: item.members,
          tag: item.tag
        }, normalizeSearchText)
      ),
      empreses: EMPRESES_DATA.map((item) =>
        toChatListItem({
          id: item.id,
          name: item.name,
          role: item.role,
          avatar_url: item.avatar_url,
          message: item.desc,
          tag: item.tag
        }, normalizeSearchText)
      ),
      institucions: INSTITUCIONS_DATA.map((item) =>
        toChatListItem({
          id: item.id,
          name: item.name,
          role: item.role,
          avatar_url: item.avatar_url,
          message: item.desc,
          tag: item.tag
        }, normalizeSearchText)
      )
    };

    return dynamicTabItems[tab] || dynamicTabItems.xat;
  }, [agents, chatThreads, normalizeSearchText, tab]);

  useEffect(() => {
    if (tab === 'xat' && threadId && items.find((item) => item.id === threadId)) {
      setActiveId(threadId);
      return;
    }
    if (!items.find((item) => item.id === activeId)) {
      setActiveId(items[0]?.id || '');
    }
  }, [activeId, items, tab, threadId]);

  const filteredItems = useMemo(() => {
    const term = normalizeSearchText(deferredSearchTerm);
    if (!term) return items;
    return items.filter((item) => item.searchText.includes(term));
  }, [deferredSearchTerm, items, normalizeSearchText]);

  const activeItem = filteredItems.find((item) => item.id === activeId) || filteredItems[0] || items[0];
  const threadMessages = activeItem ? getThreadMessages(activeItem.id, activeItem) : [];

  useEffect(() => {
    return () => {
      for (const timer of replyTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      replyTimersRef.current.clear();
    };
  }, []);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeItem) return;

    setDraft('');
    const thread = chatThreads.find((item) => item.id === activeItem.id) || activeItem;
    const replyTimer = window.setTimeout(() => {
      sendChatMessage(thread, text).finally(() => {
        replyTimersRef.current.delete(activeItem.id);
      });
    }, 120);

    const previousTimer = replyTimersRef.current.get(activeItem.id);
    if (previousTimer) window.clearTimeout(previousTimer);
    replyTimersRef.current.set(activeItem.id, replyTimer);
  };

  const insertComposerLineBreak = () => {
    const textarea = composerRef.current;
    if (!textarea) {
      setDraft((current) => `${current}\n`);
      return;
    }

    const start = textarea.selectionStart ?? draft.length;
    const end = textarea.selectionEnd ?? draft.length;
    const nextValue = `${draft.slice(0, start)}\n${draft.slice(end)}`;
    setDraft(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const caret = start + 1;
      textarea.setSelectionRange(caret, caret);
    });
  };

  const handleComposerKeyDown = (event) => {
    if (event.nativeEvent?.isComposing) return;
    if (event.key !== 'Enter') return;

    if (event.shiftKey) {
      event.preventDefault();
      insertComposerLineBreak();
      return;
    }

    event.preventDefault();
    sendMessage();
  };

  return (
    <SectionChrome
      kicker={t('section.xat.kicker', 'Xat públic')}
      title={t('section.xat.title', 'Converses i comunitat')}
      subtitle={t('section.xat.subtitle', 'Obri converses amb la gent, els grups i els espais de la xarxa.')}
      meta={[`${items.length} ${t('common.visible', 'visibles')}`, t('section.xat.tab.xat', 'Converses'), t('nav.xat', 'Xat')]}
    >
      <div className="chat-thread">
        <div className="chat-thread__head" style={{ flexWrap: 'wrap' }}>
          <div className="badge-row">
            {Object.entries(TAB_META).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <button
                  key={key}
                  type="button"
                  className={`pill ${tab === key ? 'pill--active' : ''}`}
                  onClick={() => {
                    const gentData = agents.filter((agent) => agent.tag === 'GENT');
                    const nextTabItems = {
                      xat: chatThreads,
                      gent: gentData,
                      grups: GRUPS_DATA,
                      empreses: EMPRESES_DATA,
                      institucions: INSTITUCIONS_DATA
                    };
                    setTab(key);
                    const nextItems = nextTabItems[key] || [];
                    setActiveId(nextItems[0]?.id || '');
                    if (key === 'xat') navigate('/chats');
                  }}
                >
                  <Icon size={16} /> {t(`section.xat.tab.${key}`, meta.label)}
                </button>
              );
            })}
          </div>
          <button type="button" className="pill" aria-label={t('section.xat.options', 'Opcions de xat')} title={t('section.xat.options', 'Opcions de xat')}>
            <Settings size={16} /> {t('section.xat.options', 'Opcions')}
          </button>
        </div>

        <div className="chat-thread__body">
          <div className="split-grid chat-layout">
            <aside className="stack-grid">
              <div className="pill" style={{ justifyContent: 'space-between' }}>
                <span>{t('common.results', 'Resultats')}</span>
                <Search size={16} />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('section.xat.searchPlaceholder', 'Busca converses...')}
                className="section-search"
              />
              <div className="conversation-list">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`conversation-button ${item.id === activeId ? 'conversation-button--active' : ''}`}
                    onClick={() => {
                      setActiveId(item.id);
                      navigate(`/chats/${item.id}`);
                    }}
                  >
                    <Avatar src={item.avatar_url} name={item.name} />
                    <div className="conversation-meta">
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                      <span className="conversation-preview">{item.message}</span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="chat-panel__hero">
              {activeItem ? (
                <>
                  <div className="chat-panel__header">
                    <Avatar src={activeItem.avatar_url} name={activeItem.name} />
                    <div className="chat-panel__header-meta">
                      <div className="badge-row">
                        <span className="badge">{tab}</span>
                        <span className="badge">{activeItem?.tag || t('nav.xat', 'Xat')}</span>
                      </div>
                      <h2 className="section-title" style={{ color: 'inherit', marginTop: 10 }}>{activeItem.name}</h2>
                    </div>
                  </div>

                  <div className="message-stack" style={{ marginTop: 18 }}>
                    {threadMessages.map((message) => {
                      const isSelf = message.sender === 'me' || message.sender === 'self';
                      return (
                        <div
                          key={message.id}
                          className={`message ${isSelf ? 'message--self' : message.sender === 'system' ? 'message--system' : ''}`}
                        >
                          {message.text}
                        </div>
                      );
                    })}
                  </div>

                  <div className="chat-composer">
                    <textarea
                      ref={composerRef}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={handleComposerKeyDown}
                      placeholder={t('section.xat.composePlaceholder', 'Escriu un missatge...')}
                      className="chat-input"
                      rows={3}
                    />
                    <div className="chat-composer__actions">
                      <button type="button" className="pill pill--primary" onClick={sendMessage}>
                        <Send size={16} /> {t('section.xat.send', 'Enviar')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="chat-empty">
                  <h2 className="section-title" style={{ color: 'inherit' }}>{t('section.xat.selectConversation', 'Selecciona una conversa')}</h2>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
}
