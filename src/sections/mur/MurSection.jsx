import { useDeferredValue, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionChrome from '../../components/SectionChrome';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { resolveItemPath } from '../../config/navigation';

export default function MurSection() {
  const { normalizeSearchText, sortedFeedPosts, t } = useAppData();
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const visiblePosts = useMemo(() => sortedFeedPosts.slice(0, visibleCount), [sortedFeedPosts, visibleCount]);
  const filteredPosts = useMemo(() => {
    const term = normalizeSearchText(deferredSearchTerm);
    const source = term ? sortedFeedPosts : visiblePosts;
    if (!term) return source;
    return source.filter((post) => post.searchText.includes(term));
  }, [deferredSearchTerm, normalizeSearchText, sortedFeedPosts, visiblePosts]);

  return (
    <SectionChrome
      kicker={t('section.mur.kicker', 'Mur')}
      title={t('section.mur.title', 'Publicacions recents')}
      subtitle={t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.')}
      meta={[t('section.mur.feed', 'Feed original'), `${sortedFeedPosts.length} ${t('section.mur.posts', 'publicacions')}`, searchTerm.trim() ? `${filteredPosts.length} ${t('common.results', 'resultats')}` : `${visiblePosts.length} ${t('common.visible', 'visibles')}`]}
    >
      <div className="text-panel">
        <div className="text-panel__head">
          <h2 className="section-title">{t('section.mur.searchTitle', 'Cerca al mur')}</h2>
          <span className="pill">{filteredPosts.length} {t('common.results', 'resultats')}</span>
        </div>
        <div className="text-panel__body">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('section.mur.searchPlaceholder', 'Busca per títol, autor, poble o text...')}
            className="section-search"
          />
        </div>
      </div>

      <div className="feed-grid">
        {filteredPosts.map((post) => {
          const author = post.author || post.author_name || post.seller || 'Sóc de Poble';
          const avatar = post.author_avatar || post.avatar_url || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg';
          const town = post.town_name || post.towns?.name || 'La Torre de les Maçanes';
          return (
            <SectionItemCard
              key={post.id}
              to={resolveItemPath(post)}
              state={{ preloadedItem: post }}
              image={post.imageSrc}
              title={post.title}
              subtitle={`${author} · ${town}`}
              excerpt={post.summary}
              eyebrow={post.type || 'post'}
              meta={[
                post.time || post.created_at?.slice(0, 10),
                `${post.comments || 0} ${t('section.mur.comments', 'comentaris')}`,
                `${post.likes || 0} ${t('section.mur.likes', "m'agrada")}`
              ]}
              buttonLabel={t('common.readMore', 'Llegir més')}
            >
              <div className="feed-card__author">
                <img className="avatar avatar--small" src={avatar} alt={author} />
                <div>
                  <strong>{author}</strong>
                  <span>{town}</span>
                </div>
              </div>
            </SectionItemCard>
          );
        })}
      </div>

      {visibleCount < sortedFeedPosts.length ? (
        <div className="section-actions">
          <button type="button" className="pill pill--primary" onClick={() => setVisibleCount((value) => Math.min(value + 6, sortedFeedPosts.length))}>
            <ChevronDown size={16} /> {t('common.showMore', 'Mostra més')}
          </button>
        </div>
      ) : null}
    </SectionChrome>
  );
}
