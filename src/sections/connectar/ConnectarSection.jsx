import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Globe, Lock, Plus, Tag } from 'lucide-react';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';

const TAGS = ['Història local', 'Patrimoni', 'Gent del poble', 'Debat', 'Mercat', 'Tecnologia'];

export default function ConnectarSection({ agents = [] }) {
  const { t, sendSectionSubmission } = useAppData();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('xat');
  const [isPrivate, setIsPrivate] = useState(true);
  const [customTags, setCustomTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const QUICK_AREAS = [
    { id: 'xat', label: t('nav.xat', 'Xat'), description: t('section.connectar.area.xat', 'Obri una conversa amb la gent del poble.') },
    { id: 'mur', label: t('nav.mur', 'Mur'), description: t('section.connectar.area.mur', 'Publica o revisa el mur públic.') },
    { id: 'mercat', label: t('nav.mercat', 'Mercat'), description: t('section.connectar.area.mercat', 'Explora productes i intercanvis.') },
    { id: 'events', label: t('nav.events', 'Events'), description: t('section.connectar.area.events', 'Mira sessions, cites i rituals.') }
  ];

  const agentOptions = useMemo(() => agents.slice(0, 8), [agents]);
  const selectedAgentData = useMemo(
    () => agentOptions.find((agent) => agent.id === selectedAgent) || agentOptions[0] || null,
    [agentOptions, selectedAgent]
  );
  const selectedLabel = QUICK_AREAS.find((item) => item.id === selectedArea)?.label || t('nav.xat', 'Xat');
  const supportsPublishing = ['mur', 'mercat', 'events'].includes(selectedArea);
  const canConnect = selectedArea === 'xat' || (entryTitle.trim() && entryDescription.trim());

  const addTag = (tag) => {
    const value = String(tag || '').trim();
    if (!value || customTags.includes(value)) return;
    setCustomTags((current) => [...current, value]);
    setTagInput('');
  };

  const buildSubmissionPayload = () => {
    const now = new Date().toISOString();
    const title = entryTitle.trim();
    const description = entryDescription.trim();
    const authorName = selectedAgentData?.name || 'Foraster';
    const authorAvatar = selectedAgentData?.avatar_url || null;
    const authorTown = selectedAgentData?.town_name || 'La Torre de les Maçanes';

    if (selectedArea === 'mur') {
      return {
        id: crypto.randomUUID(),
        sectionId: 'mur',
        type: 'post',
        title,
        post_subtitle: description,
        description,
        summary: description,
        content: description,
        author: authorName,
        author_name: authorName,
        author_avatar: authorAvatar,
        town_name: authorTown,
        image_url: [],
        tags: [...customTags],
        likes: 0,
        comments: 0,
        created_at: now,
        searchText: `${title} ${description} ${authorName} ${authorTown} ${customTags.join(' ')}`
      };
    }

    if (selectedArea === 'mercat') {
      return {
        id: crypto.randomUUID(),
        sectionId: 'mercat',
        type: 'product',
        title,
        description,
        summary: description,
        seller: authorName,
        author_name: authorName,
        avatar_url: authorAvatar,
        town_name: authorTown,
        image_url: [],
        image: null,
        category_slug: 'connectat',
        tag: customTags[0] || 'Connectat',
        variations: [],
        price: '0.00€',
        created_at: now,
        searchText: `${title} ${description} ${authorName} ${customTags.join(' ')} connectat mercat`
      };
    }

    return {
      id: crypto.randomUUID(),
      sectionId: 'events',
      type: 'event',
      title,
      description,
      summary: description,
      author_name: authorName,
      image_url: [],
      date: now.slice(0, 10),
      created_at: now,
      tags: [...customTags],
      searchText: `${title} ${description} ${authorName} ${customTags.join(' ')} events`
    };
  };

  const handleConnect = async () => {
    if (selectedArea === 'xat') {
      navigate('/chats');
      return;
    }

    if (!canConnect || isSaving) return;

    const payload = buildSubmissionPayload();
    setIsSaving(true);

    try {
      await sendSectionSubmission({
        sectionId: selectedArea,
        title: entryTitle.trim(),
        description: entryDescription.trim(),
        payload,
        createdAt: payload.created_at
      });
      setEntryTitle('');
      setEntryDescription('');
      setCustomTags([]);
      setTagInput('');
      navigate(`/${selectedArea}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionChrome
      kicker={t('section.connectar.kicker', 'Connectar')}
      title={t('section.connectar.title', 'On vols continuar?')}
      subtitle={t('section.connectar.subtitle', 'Tria l’espai on vols entrar i continua navegant.')}
      meta={[t('section.connectar.privacy', 'Connexió'), 'Portal', t('nav.login', 'Accés ràpid')]}
    >
      <div className="connect-layout">
        <section className="connect-panel">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.privacy', 'Privacitat de la connexió')}</h2>
            </div>
          </div>
          <div className="connect-panel__body">
            <div className="toggle-row">
              <button type="button" className={`toggle-button ${isPrivate ? 'toggle-button--active' : ''}`} onClick={() => setIsPrivate(true)}>
                <Lock size={16} /> {t('section.connectar.private', 'Privada')}
              </button>
              <button type="button" className={`toggle-button ${!isPrivate ? 'toggle-button--active' : ''}`} onClick={() => setIsPrivate(false)}>
                <Globe size={16} /> {t('section.connectar.public', 'Pública')}
              </button>
            </div>
            <p className="card__text">{isPrivate ? t('section.connectar.tagState.private', 'Privada') : t('section.connectar.tagState.public', 'Pública')}</p>
          </div>
        </section>

        <section className="connect-panel">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.where', 'On vols connectar-ho?')}</h2>
            </div>
            <span className="pill">{selectedLabel}</span>
          </div>
          <div className="connect-panel__body">
            <div className="connect-grid">
              {QUICK_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className={`connect-card ${selectedArea === area.id ? 'connect-card--active' : ''}`}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <strong>{area.label}</strong>
                  <span>{area.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="connect-panel">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.context', 'Etiquetes i context')}</h2>
            </div>
          </div>
          <div className="connect-panel__body">
            <div className="badge-row">
              {TAGS.map((tag) => (
                <button key={tag} type="button" className="pill" onClick={() => addTag(tag)}>
                  <Tag size={14} /> {tag}
                </button>
              ))}
            </div>

            <div className="tag-input-row">
              <input
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && addTag(tagInput)}
                placeholder={t('section.connectar.tagsPlaceholder', 'Afig una etiqueta lliure...')}
                className="section-search"
              />
              <button type="button" className="pill pill--primary" onClick={() => addTag(tagInput)}>
                <Plus size={16} /> {t('section.connectar.add', 'Afegir')}
              </button>
            </div>

            {customTags.length > 0 ? (
              <div className="badge-row" style={{ marginTop: 12 }}>
                {customTags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                    <button type="button" className="badge-remove" onClick={() => setCustomTags((current) => current.filter((item) => item !== tag))}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {supportsPublishing ? (
          <section className="connect-panel connect-panel--wide">
            <div className="connect-panel__head">
              <div>
                <h2 className="section-title">Nou element en {selectedLabel}</h2>
              </div>
              <span className="pill">Es guardarà i quedarà visible en recarregar</span>
            </div>
            <div className="connect-panel__body" style={{ display: 'grid', gap: 16 }}>
              <input
                type="text"
                value={entryTitle}
                onChange={(event) => setEntryTitle(event.target.value)}
                placeholder={selectedArea === 'mur'
                  ? 'Títol de la publicació'
                  : selectedArea === 'mercat'
                    ? 'Nom del producte'
                    : 'Títol de l’esdeveniment'}
                className="section-search"
              />
              <textarea
                value={entryDescription}
                onChange={(event) => setEntryDescription(event.target.value)}
                placeholder={selectedArea === 'mur'
                  ? 'Escriu la publicació que vols afegir al mur...'
                  : selectedArea === 'mercat'
                    ? 'Descriu el producte o l’oferta...'
                    : 'Descriu l’esdeveniment o la convocatòria...'}
                className="section-search"
                rows={4}
                style={{ minHeight: 120, resize: 'vertical' }}
              />
            </div>
          </section>
        ) : null}

        <section className="connect-panel connect-panel--wide">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.people', 'Persones i agents')}</h2>
            </div>
            <button type="button" className="pill" onClick={() => navigate(`/` + selectedArea)}>
              {t('section.connectar.go', 'Anar a')} {selectedLabel}
            </button>
          </div>
          <div className="connect-panel__body">
            <div className="conversation-list">
              {agentOptions.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  className={`conversation-button ${selectedAgent === agent.id ? 'conversation-button--active' : ''}`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <img className="avatar" src={agent.avatar_url} alt={agent.name} />
                  <div className="conversation-meta">
                    <strong>{agent.name}</strong>
                    <span>{agent.role}</span>
                    <span className="conversation-preview">{agent.last_message_content}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="connect-final">
              <button
                type="button"
                className="pill pill--primary"
                onClick={handleConnect}
                disabled={isSaving || (selectedArea !== 'xat' && !canConnect)}
              >
                <CheckCircle2 size={16} />
                {isSaving
                  ? 'Guardant...'
                  : selectedArea === 'xat'
                    ? `${t('section.connectar.connect', 'Connectar a')} ${selectedLabel}`
                    : `Guardar i anar a ${selectedLabel}`}
              </button>
            </div>
          </div>
        </section>
      </div>
    </SectionChrome>
  );
}
