import { useDeferredValue, useMemo, useState } from 'react';
import { ChevronLeft, FileText, Folder, List } from 'lucide-react';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

export default function NotesSection() {
  const { language, normalizeSearchText, noteFolders, notes: rawNotes, t } = useAppData();
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [mobileView, setMobileView] = useState('folders');
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  const notes = useMemo(
    () =>
      rawNotes.map((note) => {
        const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
        return {
          ...note,
          plainText,
          searchText: normalizeSearchText(`${note.title} ${plainText}`),
          formattedDate: new Date(note.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
        };
      }),
    [locale, normalizeSearchText, rawNotes]
  );

  const filteredNotes = useMemo(() => {
    const query = normalizeSearchText(deferredSearchQuery);
    return notes
      .filter((note) => (activeFolderId ? note.folderId === activeFolderId : true))
      .filter((note) => (activeCategory ? note.category === activeCategory : true))
      .filter((note) => (!query ? true : note.searchText.includes(query)));
  }, [activeCategory, activeFolderId, deferredSearchQuery, notes, normalizeSearchText]);

  const activeNote = filteredNotes.find((note) => note.id === activeNoteId) || filteredNotes[0] || notes[0];

  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    setMobileView('list');
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    setMobileView('list');
  };

  const handleBack = () => {
    if (mobileView === 'editor') setMobileView('list');
    else if (mobileView === 'list') setMobileView('folders');
  };

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  return (
    <SectionChrome
      kicker={t('section.notes.kicker', 'Notes')}
      title={t('section.notes.title', 'Quadern')}
      subtitle={t('section.notes.subtitle', 'Notes i apunts del projecte organitzats per carpetes.')}
      meta={[t('nav.notes', 'Notes'), `${noteFolders.length} ${t('section.notes.folders', 'carpetes')}`, `${notes.length} ${t('section.notes.note', 'notes')}`]}
    >
      <article className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="topbar" style={{ position: 'static', borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0, background: '#171717', color: '#fff' }}>
          <div className="topbar__title" style={{ color: '#fff' }}>
            <strong style={{ color: '#fff' }}>{t('section.notes.mobileTitle', 'Quadern')}</strong>
          </div>
          <div className="topbar__actions" style={{ gap: 6 }}>
            <button type="button" className={`pill ${mobileView === 'folders' ? 'pill--primary' : ''}`} onClick={() => setMobileView('folders')}>
              <Folder size={16} /> {t('section.notes.mobileFolders', 'Carpetes')}
            </button>
            <button type="button" className={`pill ${mobileView === 'list' ? 'pill--primary' : ''}`} onClick={() => setMobileView('list')}>
              <List size={16} /> {t('section.notes.mobileList', 'Llista')}
            </button>
            <button type="button" className={`pill ${mobileView === 'editor' ? 'pill--primary' : ''}`} onClick={() => setMobileView('editor')}>
              <FileText size={16} /> {t('section.notes.mobileEditor', 'Editor')}
            </button>
          </div>
        </div>

        <div className="notes-shell">
          <aside className={`notes-column notes-column--folders ${mobileView === 'folders' ? 'notes-column--mobile' : ''}`}>
            <div className="notes-column__head">{t('section.notes.archive', 'Arxiu del Poble')}</div>
            <div className="notes-column__body">
              <div className="folders-list">
                {noteFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    className={`folder-button ${folder.id === activeFolderId ? 'folder-button--active' : ''}`}
                    onClick={() => handleSelectFolder(folder.id)}
                  >
                    <Folder size={16} /> {folder.name}
                  </button>
                ))}
              </div>

              <div className="notes-category-block">
                <div className="notes-column__head" style={{ paddingInline: 0, paddingTop: 18 }}>{t('section.notes.categories', 'Categories')}</div>
                <div className="folders-list">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`folder-button ${category === activeCategory ? 'folder-button--active' : ''}`}
                      onClick={() => handleSelectCategory(category)}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className={`notes-column notes-column--list ${mobileView === 'list' ? 'notes-column--mobile' : ''}`}>
            <div className="notes-column__head">{t('nav.notes', 'Notes')}</div>
            <div className="notes-column__body">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('section.notes.searchPlaceholder', 'Cerca al bancal...')}
                className="section-search"
              />

              <div className="note-list" style={{ marginTop: 16 }}>
                {filteredNotes.map((note) => {
                  const isActive = note.id === activeNote?.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      className={`conversation-button ${isActive ? 'conversation-button--active' : ''}`}
                      style={{ gridTemplateColumns: '1fr', alignItems: 'start' }}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setMobileView('editor');
                      }}
                    >
                      <div className="conversation-meta">
                        <strong>{note.title}</strong>
                        <span>{note.formattedDate}</span>
                        <span className="conversation-preview">{note.plainText.slice(0, 100) || t('section.notes.emptyPreview', 'Sense contingut...')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <main className={`notes-column notes-column--editor ${mobileView === 'editor' ? 'notes-column--mobile' : ''}`}>
              <div className="notes-column__head notes-column__head--editor">
                <button type="button" className="pill" onClick={handleBack}>
                <ChevronLeft size={16} /> {t('section.notes.back', 'Tornar')}
                </button>
              <span>{activeNote?.category ? getCategoryLabel(activeNote.category) : t('section.notes.categoryLabel', 'Categoria')}</span>
              </div>
            <div className="notes-column__body notes-editor">
              {activeNote ? (
                <>
                  <h2 className="card__title" style={{ fontSize: '2rem', marginTop: 0 }}>{activeNote.title}</h2>
                  <div className="badge-row" style={{ marginTop: 12 }}>
                    <span className="badge">{getCategoryLabel(activeNote.category)}</span>
                    {activeNote.tags?.map((tag) => <span key={tag} className="badge">{tag}</span>)}
                  </div>
                  <article
                    className="app-note-content"
                    style={{ marginTop: 24 }}
                    dangerouslySetInnerHTML={{ __html: activeNote.content }}
                  />
                </>
              ) : (
                <div className="chat-empty">
                  <FileText size={64} />
                  <h2 className="section-title" style={{ color: 'inherit' }}>{t('section.notes.open', 'Obre un solc')}</h2>
                </div>
              )}
            </div>
          </main>
        </div>
      </article>
    </SectionChrome>
  );
}
