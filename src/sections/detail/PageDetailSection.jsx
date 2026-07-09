import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';
import { resolveItemPath } from '../../config/navigation';
import { renderPageHtml } from './detailRichText.jsx';

export default function PageDetailSection() {
  const { pageDetailLookup, t } = useAppData();
  const { slug } = useParams();
  const item = pageDetailLookup.get(String(slug));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  if (!item) {
    return <Navigate to="/mur" replace />;
  }

  const knownPath = resolveItemPath(item);
  if (knownPath && knownPath !== `/page/${slug}`) {
    return <Navigate to={knownPath} replace />;
  }

  return (
    <SectionChrome
      kicker={item.type || t('section.text.page', 'Pàgina')}
      title={item.title || t('section.text.page', 'Pàgina')}
      subtitle={item.post_subtitle || item.author || ''}
      meta={[item.author || t('section.detail.mur.author', 'Sóc de Poble'), item.time || item.created_at || '']}
    >
      <div className="detail-page">
        <div className="detail-hero card">
          {Array.isArray(item.image_url) && item.image_url[0] ? (
            <div className="media-frame media-frame--contain detail-hero__media">
              <img src={item.image_url[0]} alt={item.title || 'Pàgina'} decoding="async" />
            </div>
          ) : null}
          <div className="card__body">
            <div className="badge-row">
              <span className="badge">{item.type || t('section.text.page', 'page')}</span>
              {item.slug ? <span className="badge">{item.slug}</span> : null}
            </div>
            <h2 className="card__title" style={{ marginTop: 14 }}>{item.title || t('section.text.page', 'Pàgina')}</h2>
            {item.post_subtitle ? <p className="section-item-card__subtitle">{item.post_subtitle}</p> : null}
            <article
              className="detail-content"
              style={{ marginTop: 18 }}
              dangerouslySetInnerHTML={{
                __html: renderPageHtml(item.content || '')
              }}
            />
          </div>
        </div>
      </div>
    </SectionChrome>
  );
}
