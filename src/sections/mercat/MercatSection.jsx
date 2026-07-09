import { useDeferredValue, useMemo, useState } from 'react';
import SectionChrome from '../../components/SectionChrome';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { getSectionItemPath } from '../../config/navigation';

export default function MercatSection() {
  const { normalizeSearchText, sortedMarketItems, t } = useAppData();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const items = useMemo(() => {
    const term = normalizeSearchText(deferredQuery);
    if (!term) return sortedMarketItems;
    return sortedMarketItems.filter((item) => item.searchText.includes(term));
  }, [deferredQuery, normalizeSearchText, sortedMarketItems]);

  const featuredItem = items[0] || sortedMarketItems[0];

  return (
    <SectionChrome
      kicker={t('section.mercat.kicker', 'Mercat')}
      title={t('section.mercat.title', 'Productes i intercanvis')}
      subtitle={t('section.mercat.subtitle', 'Explora els productes i les ofertes disponibles.')}
      meta={[t('nav.mercat', 'Mercat'), `${sortedMarketItems.length} ${t('section.mercat.products', 'productes')}`, `${items.length} ${t('common.visible', 'visibles')}`]}
    >
      <div className="text-panel">
        <div className="text-panel__head">
          <h2 className="section-title">{t('section.mercat.searchTitle', 'Cerca al mercat')}</h2>
          <span className="pill">{items.length} {t('common.results', 'resultats')}</span>
        </div>
        <div className="text-panel__body">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('section.mercat.searchPlaceholder', 'Cerca productes, botigues o categories...')}
            className="section-search"
          />
        </div>
      </div>

      {featuredItem ? (
        <div className="card card--soft">
          <div className="split-grid">
            <div className="media-frame" style={{ aspectRatio: '1 / 1' }}>
              <img src={featuredItem.imageSrc} alt={featuredItem.title} />
            </div>
            <div className="card__body" style={{ display: 'grid', alignContent: 'center' }}>
              <span className="badge" style={{ width: 'fit-content' }}>{featuredItem.tag || 'Mercat'}</span>
              <h2 className="card__title" style={{ marginTop: 14 }}>{featuredItem.title}</h2>
              <p className="section-item-card__subtitle">{featuredItem.seller}</p>
              <p className="card__text">{featuredItem.description}</p>
              <div className="feed-card__meta" style={{ marginTop: 12 }}>
                <span>{featuredItem.price || '0.00€'}</span>
                <span>{featuredItem.category_slug || 'mercat'}</span>
                <span>{featuredItem.variations?.length || 0} {t('section.mercat.variations', 'variants')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="feed-grid">
        {items.map((item) => {
          return (
            <SectionItemCard
              key={item.id}
              to={getSectionItemPath('mercat', item.id)}
              state={{ preloadedItem: item }}
              image={item.imageSrc}
              title={item.title}
              subtitle={item.seller}
              excerpt={item.description}
              eyebrow={item.tag || 'Mercat'}
              meta={[item.price || '0.00€', item.category_slug, item.variations?.length ? `${item.variations.length} ${t('section.mercat.variations', 'variants')}` : null]}
            />
          );
        })}
      </div>
    </SectionChrome>
  );
}
