import { CalendarDays, UserRound } from 'lucide-react';
import { renderRichText } from '../../detail/detailRichText.jsx';

export function buildEventsDetailSectionMeta({ events = [], t }) {
  return {
    title: t('section.detail.events.title', 'Events'),
    label: t('section.detail.events.label', 'Esdeveniment'),
    listPath: '/events',
    items: events,
    getTitle: (item) => item.title || t('section.detail.events.itemTitle', 'Esdeveniment'),
    getSubtitle: (item) => item.description || '',
    getImage: (item) => item.image_url || null,
    renderBody: (item) => (
      <>
        <div className="detail-grid">
          <span className="pill"><CalendarDays size={14} /> {item.date || ''}</span>
          <span className="pill">{item.type || t('section.detail.events.typeFallback', 'Esdeveniment')}</span>
          <span className="pill"><UserRound size={14} /> {item.author_name || t('section.detail.events.organisation', 'Organització')}</span>
          {item.file ? <span className="pill">{item.file}</span> : null}
        </div>
        {renderRichText(item.description || item.content)}
      </>
    )
  };
}
