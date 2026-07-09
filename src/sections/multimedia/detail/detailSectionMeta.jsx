import { UserRound } from 'lucide-react';
import { renderRichText } from '../../detail/detailRichText.jsx';

export function buildMultimediaDetailSectionMeta({ mediaItems = [], t }) {
  return {
    title: t('section.detail.multimedia.title', 'Multimèdia'),
    label: t('section.detail.multimedia.label', 'Element'),
    listPath: '/multimedia',
    items: mediaItems,
    getTitle: (item) => item.title || t('section.detail.multimedia.itemTitle', 'Element multimèdia'),
    getSubtitle: (item) => item.subtitle || item.tag || item.kind || '',
    getImage: (item) => item.src || null,
    renderBody: (item) => (
      <>
        <div className="detail-grid">
          <span className="pill">{item.tag || t('section.detail.multimedia.mediaType', 'Media')}</span>
          <span className="pill">{item.kind || t('section.detail.multimedia.imageType', 'Imatge')}</span>
          {item.source ? <span className="pill"><UserRound size={14} /> {item.source}</span> : null}
          {item.created_at ? <span className="pill">{String(item.created_at).slice(0, 10)}</span> : null}
        </div>
        {renderRichText(item.description || item.content)}
        {item.src ? (
          <div className="media-frame media-frame--contain detail-hero__media" style={{ marginTop: 18 }}>
            <img src={item.src} alt={item.title} decoding="async" />
          </div>
        ) : null}
      </>
    )
  };
}
