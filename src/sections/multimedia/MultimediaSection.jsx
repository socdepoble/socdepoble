import { useMemo, useState } from 'react';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import SectionChrome from '../../components/SectionChrome';
import { getSectionItemPath } from '../../config/navigation';

export default function MultimediaSection() {
  const { mediaItems, mediaTimelineGroups, t } = useAppData();
  const [viewMode, setViewMode] = useState('grid');
  const featured = useMemo(() => mediaItems[0] || null, [mediaItems]);
  const timelineGroups = useMemo(() => mediaTimelineGroups, [mediaTimelineGroups]);

  return (
    <SectionChrome
      kicker={t('section.multimedia.kicker', 'Multimèdia')}
      title={t('section.multimedia.title', 'Arxiu visual')}
      subtitle={t('section.multimedia.subtitle', 'Galeria d’imatges i cronologia visual del projecte.')}
      meta={[t('section.multimedia.gallery', 'Galeria'), `${mediaItems.length} ${t('section.multimedia.elements', 'elements')}`, viewMode === 'grid' ? t('section.multimedia.grid', 'Quadrícula') : t('section.multimedia.timeline', 'Cronologia')]}
    >
      <div className="section-actions" style={{ justifyContent: 'flex-start' }}>
        <button type="button" className={`pill ${viewMode === 'grid' ? 'pill--primary' : ''}`} onClick={() => setViewMode('grid')}>
          {t('section.multimedia.gallery', 'Galeria')}
        </button>
        <button type="button" className={`pill ${viewMode === 'timeline' ? 'pill--primary' : ''}`} onClick={() => setViewMode('timeline')}>
          {t('section.multimedia.timeline', 'Cronologia')}
        </button>
      </div>

      {featured ? (
        <div className="card card--soft">
          <div className="split-grid">
            <div className="media-frame" style={{ aspectRatio: '1 / 1' }}>
              <img src={featured.src} alt={featured.title} />
            </div>
            <div className="card__body" style={{ display: 'grid', alignContent: 'center' }}>
              <span className="badge" style={{ width: 'fit-content' }}>{featured.tag}</span>
              <h2 className="card__title" style={{ marginTop: 14 }}>{featured.title}</h2>
              <p className="card__text">
                {featured.description || t('section.multimedia.featuredFallback', 'Recurs visual destacat del projecte.')}
              </p>
              <div className="feed-card__meta" style={{ marginTop: 12 }}>
                <span>{featured.source}</span>
                <span>{featured.created_at ? String(featured.created_at).slice(0, 10) : t('common.noDate', 'Sense data')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {viewMode === 'grid' ? (
        <div className="gallery-grid">
          {mediaItems.map((item, index) => (
            <SectionItemCard
              key={`${item.id}-${index}`}
              to={getSectionItemPath('multimedia', item.id)}
              state={{ preloadedItem: item }}
              image={item.src}
              title={item.title}
              subtitle={item.subtitle || item.kind}
              excerpt={item.description || item.tag}
              eyebrow={t('nav.multimedia', 'Multimèdia')}
              meta={[item.source, item.created_at ? String(item.created_at).slice(0, 10) : null]}
              buttonLabel={t('section.multimedia.open', 'Obrir')}
            />
          ))}
        </div>
      ) : (
        <div className="stack-grid">
          {timelineGroups.map((group) => (
            <section key={group.key} className="card card--soft">
              <div className="card__body">
                <div className="text-panel__head" style={{ padding: 0, border: 0, marginBottom: 18 }}>
                  <h2 className="section-title">{group.label}</h2>
                  <span className="pill">{group.items.length} {t('section.multimedia.elements', 'elements')}</span>
                </div>
                <div className="gallery-grid">
                  {group.items.map((item, idx) => (
                    <SectionItemCard
                      key={`${item.id}-${idx}`}
                      to={getSectionItemPath('multimedia', item.id)}
                      state={{ preloadedItem: item }}
                      image={item.src}
                      title={item.title}
                      subtitle={item.subtitle || item.kind}
                      excerpt={item.description || item.tag}
                      eyebrow={item.tag}
                      meta={[item.source]}
                      buttonLabel={t('section.multimedia.open', 'Obrir')}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </SectionChrome>
  );
}
