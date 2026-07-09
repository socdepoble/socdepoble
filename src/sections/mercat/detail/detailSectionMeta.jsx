import { Tag, UserRound } from 'lucide-react';
import { renderRichText } from '../../detail/detailRichText.jsx';
import { getFirstImage } from '../../detail/detailHelpers.jsx';

export function buildMercatDetailSectionMeta({ marketItems = [], t }) {
  return {
    title: t('section.detail.mercat.title', 'Mercat'),
    label: t('section.detail.mercat.label', 'Producte'),
    listPath: '/mercat',
    items: marketItems,
    getTitle: (item) => item.title || t('section.detail.mercat.itemTitle', 'Producte'),
    getSubtitle: (item) => item.subtitle || item.description || item.summary || '',
    getImage: (item) => getFirstImage(item.imageSrc || item.image_url || item.image || item.avatar_url) || null,
    renderBody: (item) => (
      <>
        <div className="detail-grid">
          <span className="pill"><Tag size={14} /> {item.tag || t('section.detail.mercat.tag', 'Mercat')}</span>
          <span className="pill">{item.price || '0.00€'}</span>
          <span className="pill"><UserRound size={14} /> {item.seller || t('section.detail.mercat.seller', 'Venda directa')}</span>
        </div>
        {renderRichText(item.description || item.summary || item.content)}
        {Array.isArray(item.variations) && item.variations.length > 0 ? (
          <div className="stack-grid" style={{ marginTop: 18 }}>
            {item.variations.map((variation) => (
              <div key={variation.name} className="note-card">
                <strong>{variation.name}</strong>
                <p className="card__text" style={{ marginTop: 6 }}>{variation.description}</p>
              </div>
            ))}
          </div>
        ) : null}
      </>
    )
  };
}
