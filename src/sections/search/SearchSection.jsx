import { useDeferredValue, useMemo, useState } from 'react';
import SectionChrome from '../../components/SectionChrome';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { resolveItemPath } from '../../config/navigation';

export default function SearchSection() {
  const { globalSearchItems, normalizeSearchText, t } = useAppData();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const term = normalizeSearchText(deferredQuery);
    if (!term) {
      return [];
    }

    return globalSearchItems.filter((item) => item.searchText.includes(term)).slice(0, 24);
  }, [deferredQuery, globalSearchItems, normalizeSearchText]);

  return (
    <SectionChrome
      kicker={t('section.search.kicker', 'Cercador')}
      title={t('section.search.title', 'Busca dins del contingut')}
      subtitle={t('section.search.subtitle', 'Busca persones, pobles, publicacions i pàgines en un sol lloc.')}
      meta={[t('section.search.globalMeta', 'Cerca global'), t('section.search.quickMeta', 'Ràpid'), t('section.search.unifiedMeta', 'Unificada')]}
    >
      <div className="text-panel">
        <div className="text-panel__head">
          <h2 className="section-title">{t('section.search.searchTitle', 'Cerca')}</h2>
          <span className="pill">{t('section.search.filter', 'Filtre global')}</span>
        </div>
        <div className="text-panel__body" style={{ display: 'grid', gap: 18 }}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('section.search.searchPlaceholder', 'Cerca persones, pobles, posts...')}
            className="section-search"
          />

          <div className="stack-grid">
            {results.map((item) => {
              const path = resolveItemPath(item);
              const content = item.role || item.post_subtitle || item.content || item.message;
              return path ? (
                <SectionItemCard
                  key={`${item.sectionId}-${item.id}`}
                  to={path}
                  state={{ preloadedItem: item }}
                  title={item.name || item.title}
                  excerpt={content}
                  eyebrow={item.sectionId || t('section.search.resultLabel', 'Resultat')}
                  buttonLabel={t('common.readMore', 'Llegir més')}
                />
              ) : (
                <SectionItemCard
                  key={`${item.sectionId || 'item'}-${item.id}`}
                  title={item.name || item.title}
                  excerpt={content}
                  eyebrow={item.sectionId || t('section.search.resultLabel', 'Resultat')}
                />
              );
            })}
            {query && results.length === 0 ? <div className="note-card">{t('section.search.noResults', 'Cap resultat.')}</div> : null}
          </div>
        </div>
      </div>
    </SectionChrome>
  );
}
