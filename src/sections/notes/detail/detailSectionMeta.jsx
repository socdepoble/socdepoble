import { renderRichText } from '../../detail/detailRichText.jsx';

export function buildNotesDetailSectionMeta({ notes = [], t }) {
  return {
    title: t('section.detail.notes.title', 'Notes'),
    label: t('section.detail.notes.label', 'Nota'),
    listPath: '/notes',
    items: notes,
    getTitle: (item) => item.title || t('section.detail.notes.itemTitle', 'Nota'),
    getSubtitle: (item) => item.body || item.content || '',
    getImage: () => null,
    renderBody: (item) => (
      <>
        <div className="detail-grid">
          <span className="pill">{item.folderId || t('section.detail.notes.folderFallback', 'General')}</span>
          <span className="pill">{item.updatedAt || ''}</span>
        </div>
        {renderRichText(item.body || item.content)}
      </>
    )
  };
}
