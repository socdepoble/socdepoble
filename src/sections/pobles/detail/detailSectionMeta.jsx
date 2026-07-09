import { MapPin } from 'lucide-react';
import { renderRichText } from '../../detail/detailRichText.jsx';

export function buildPoblesDetailSectionMeta({ towns = [], t }) {
  return {
    title: t('section.detail.pobles.title', 'Pobles'),
    label: t('section.detail.pobles.label', 'Poble'),
    listPath: '/pobles',
    items: towns,
    getTitle: (item) => item.title || item.name || t('section.detail.pobles.itemTitle', 'Poble'),
    getSubtitle: (item) => item.post_subtitle || item.content || '',
    getImage: (item) => item.image_url || null,
    renderBody: (item) => (
      <>
        <div className="detail-grid">
          <span className="pill">{item.population || item.type || t('section.detail.pobles.itemTitle', 'Poble')}</span>
          <span className="pill"><MapPin size={14} /> {item.town_name || item.title || ''}</span>
        </div>
        {renderRichText(item.content || item.description)}
      </>
    )
  };
}
