import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';
import { getSectionItemPath } from '../../config/navigation';
import { buildDetailSectionMeta } from './detailSectionMeta.jsx';

export default function ItemDetailSection() {
  const { events, feedPosts, marketItems, mediaItems, notes, towns, findSectionItem: findSectionItemFromDb, t } = useAppData();
  const { sectionId, itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const SECTION_META = buildDetailSectionMeta({ events, feedPosts, marketItems, mediaItems, notes, towns, t });
  const section = SECTION_META[sectionId];
  const fallbackItem = section ? findSectionItemFromDb(sectionId, itemId) : null;
  const item = location.state?.preloadedItem || fallbackItem;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [sectionId, itemId]);

  if (!section || !item) {
    return (
      <SectionChrome
        kicker={t('section.detail.noFound.kicker', 'No trobat')}
        title={t('section.detail.noFound.title', 'Element no trobat')}
        subtitle={t('section.detail.noFound.subtitle', 'L’enllaç no apunta a cap element existent.')}
        meta={['Error', t('section.detail.invalidLink', 'Enllaç no vàlid')]}
      >
        <button type="button" className="pill pill--primary" onClick={() => navigate(section?.listPath || '/chats')}>
          {t('common.back', 'Torna')}
        </button>
      </SectionChrome>
    );
  }

  const items = section.items || [];
  const currentIndex = items.findIndex((entry) => String(entry.id) === String(item.id));
  const previous = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  const image = section.getImage(item);
  const subtitle = section.getSubtitle(item);

  return (
    <SectionChrome
      kicker={section.title}
      title={section.getTitle(item)}
      subtitle={subtitle}
      meta={[section.label, currentIndex >= 0 ? `${currentIndex + 1}/${items.length}` : section.label]}
    >
      <div className="detail-page">
        <div className="detail-hero card">
          <div className="card__body">
            <div className="badge-row">
              <span className="badge">{section.label}</span>
              <span className="badge">{item.id}</span>
            </div>
            <h2 className="card__title" style={{ marginTop: 14 }}>{section.getTitle(item)}</h2>
            {subtitle ? <p className="section-item-card__subtitle">{subtitle}</p> : null}
            <div style={{ marginTop: 18 }}>
              {section.renderBody(item)}
            </div>
          </div>
          {image ? (
            <div className={`media-frame ${sectionId === 'mercat' ? 'media-frame--contain' : ''} detail-hero__media`}>
              <img src={image} alt={section.getTitle(item)} decoding="async" />
            </div>
          ) : null}
        </div>

        <div className="detail-actions">
          <Link className="pill" to={section.listPath} state={{ preloadedItem: item }}>
            <ChevronLeft size={16} /> {t('section.detail.backToList', 'Tornar al llistat')}
          </Link>
          <div className="detail-actions__nav">
            <button type="button" className="pill" onClick={() => previous && navigate(getSectionItemPath(sectionId, previous.id), { state: { preloadedItem: previous } })} disabled={!previous}>
              <ChevronLeft size={16} /> {t('section.detail.previous', 'Anterior')}
            </button>
            <button type="button" className="pill" onClick={() => next && navigate(getSectionItemPath(sectionId, next.id), { state: { preloadedItem: next } })} disabled={!next}>
              {t('section.detail.next', 'Següent')} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
}
