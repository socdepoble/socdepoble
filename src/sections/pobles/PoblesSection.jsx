import { useDeferredValue, useMemo, useState } from 'react';
import SectionChrome from '../../components/SectionChrome';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { getSectionItemPath } from '../../config/navigation';

export default function PoblesSection() {
  const { normalizeSearchText, towns: allTowns, t } = useAppData();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const towns = useMemo(() => {
    const term = normalizeSearchText(deferredQuery);
    if (!term) return allTowns;
    return allTowns.filter((town) => town.searchText.includes(term));
  }, [allTowns, deferredQuery, normalizeSearchText]);

  return (
    <SectionChrome
      kicker={t('section.pobles.kicker', 'Pobles')}
      title={t('section.pobles.title', 'Nodes i territori')}
      subtitle={t('section.pobles.subtitle', 'Explora els pobles i el seu context territorial.')}
      meta={[t('section.pobles.territoryMeta', 'Territori'), `${allTowns.length} ${t('nav.pobles', 'pobles')}`, `${towns.length} ${t('common.visible', 'visibles')}`]}
    >
      <div className="text-panel">
        <div className="text-panel__head">
          <h2 className="section-title">{t('section.pobles.searchTitle', 'Cerca pobles')}</h2>
          <span className="pill">{towns.length} {t('common.results', 'resultats')}</span>
        </div>
        <div className="text-panel__body">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('section.pobles.searchPlaceholder', 'Cerca per nom, comarca o descripció...')}
            className="section-search"
          />
        </div>
      </div>

      <div className="stack-grid">
        {towns.map((town) => (
          <SectionItemCard
            key={town.id}
            to={getSectionItemPath('pobles', town.id)}
            state={{ preloadedItem: town }}
            image={town.imageSrc || town.image_url}
            title={town.title || town.name}
            subtitle={town.post_subtitle || town.population || town.time || town.type}
            excerpt={town.content}
            eyebrow={t('section.pobles.label', 'Poble')}
            meta={[town.population, town.type, town.created_at ? String(town.created_at).slice(0, 10) : null]}
          />
        ))}
      </div>
    </SectionChrome>
  );
}
