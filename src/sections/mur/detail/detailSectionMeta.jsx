import { MapPin, MessageCircle, UserRound } from 'lucide-react';
import { renderPostContent } from '../../detail/detailRichText.jsx';
import { getFirstImage } from '../../detail/detailHelpers.jsx';

export function buildMurDetailSectionMeta({ feedPosts = [], t }) {
  return {
    title: t('section.detail.mur.title', 'Mur'),
    label: t('section.detail.mur.label', 'Publicació'),
    listPath: '/mur',
    items: feedPosts,
    getTitle: (item) => item.title || t('section.detail.mur.itemTitle', 'Publicació'),
    getSubtitle: (item) => item.post_subtitle || item.description || '',
    getImage: (item) => item.imageSrc || getFirstImage(item.image_url || item.image) || null,
    renderBody: (item) => (
      <>
        <div className="detail-grid">
          <span className="pill"><UserRound size={14} /> {item.author || t('section.detail.mur.author', 'Sóc de Poble')}</span>
          <span className="pill"><MapPin size={14} /> {item.town_name || t('section.detail.mur.town', 'La Torre de les Maçanes')}</span>
          <span className="pill"><MessageCircle size={14} /> {item.comments || 0}</span>
          <span className="pill">{item.likes || 0} {t('section.mur.likes', "m'agrada")}</span>
        </div>
        {renderPostContent(item.content || item.summary)}
        {Array.isArray(item.tags) && item.tags.length > 0 ? (
          <div className="badge-row" style={{ marginTop: 18 }}>
            {item.tags.map((tag) => (
              <span key={tag} className="badge">{tag}</span>
            ))}
          </div>
        ) : null}
      </>
    )
  };
}
