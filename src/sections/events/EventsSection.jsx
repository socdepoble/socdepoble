import { useDeferredValue, useMemo, useState } from 'react';
import SectionChrome from '../../components/SectionChrome';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { getSectionItemPath } from '../../config/navigation';

const groupKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'sense-data';
  return date.toISOString().slice(0, 10);
};

export default function EventsSection() {
  const { normalizeSearchText, sortedEvents, t } = useAppData();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const events = useMemo(() => {
    const term = normalizeSearchText(deferredQuery);
    if (!term) return sortedEvents;
    return sortedEvents.filter((event) => event.searchText.includes(term));
  }, [deferredQuery, normalizeSearchText, sortedEvents]);

  const groupedEvents = useMemo(() => {
    const groups = new Map();
    events.forEach((event) => {
      const key = groupKey(event.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(event);
    });
    return Array.from(groups.entries());
  }, [events]);

  return (
    <SectionChrome
      kicker={t('section.events.kicker', 'Events')}
      title={t('section.events.title', 'Calendari i sessions')}
      subtitle={t('section.events.subtitle', 'Consulta els esdeveniments i activitats programades.')}
      meta={[t('section.events.calendarMeta', 'Calendari'), `${sortedEvents.length} ${t('section.events.records', 'esdeveniments')}`, t('section.events.listMeta', 'Llistat')]}
    >
      <div className="text-panel">
        <div className="text-panel__head">
          <h2 className="section-title">{t('section.events.searchTitle', 'Cerca d’esdeveniments')}</h2>
          <span className="pill">{events.length} {t('common.results', 'resultats')}</span>
        </div>
        <div className="text-panel__body">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('section.events.searchPlaceholder', 'Cerca sessions, rituals, cites...')}
            className="section-search"
          />
        </div>
      </div>

      <div className="stack-grid">
        {groupedEvents.map(([key, group]) => (
            <section key={key} className="card card--soft">
              <div className="card__body">
                <div className="text-panel__head" style={{ padding: 0, border: 0, marginBottom: 18 }}>
                  <h2 className="section-title">{group[0]?.date || t('common.noDate', 'Sense data')}</h2>
                  <span className="pill">{group.length} {t('section.events.records', 'registres')}</span>
                </div>
              <div className="stack-grid">
                {group.map((event) => (
                  <SectionItemCard
                    key={event.id}
                    to={getSectionItemPath('events', event.id)}
                    state={{ preloadedItem: event }}
                    image={event.image_url}
                    title={event.title}
                    subtitle={event.author_name}
                    excerpt={event.description}
                    eyebrow={event.type || 'event'}
                    meta={[event.date, event.file]}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </SectionChrome>
  );
}
