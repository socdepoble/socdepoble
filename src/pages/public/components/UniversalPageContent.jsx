import React, { Suspense, lazy } from 'react';
import ContentWithShortcodes from '../../../components/core/ContentWithShortcodes';
import { useExtractedTags } from '../../../hooks/useExtractedTags';

const RichTextEditor = lazy(() => import('../../../components/ui/RichTextEditor'));

const TAG_COLORS = [
  'bg-[#0369A1]/10 text-[#0369A1]',
  'bg-[#F97316]/10 text-[#F97316]',
  'bg-black/5 dark:bg-white/10 text-theme-text'
];

function LogoSlot({ logoLight, logoDark }) {
  if (logoLight || logoDark) {
    return <>
      {logoLight && <img src={logoLight} alt="" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all dark:hidden" aria-hidden="true" />}
      {logoDark && <img src={logoDark} alt="" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all hidden dark:block" aria-hidden="true" />}
    </>;
  }
  return <>
    <img src="/assets/system/ui/logo-socdepoble-rect-negre.svg" alt="" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all dark:hidden" aria-hidden="true" />
    <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all hidden dark:block" aria-hidden="true" />
  </>;
}

function LoadingSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-10 min-h-[50vh]">
      <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl">
        <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-3/4 mb-4" />
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6" />
      </div>
    </div>
  );
}

const ARTICLE_STYLE = {};
const HASHTAG_REGEX = /#[a-zA-Z0-9_À-ÿ]+/g;
const SHORTCODE_TABS = '[TABS_START]';

export const UniversalPageContent = React.memo(function UniversalPageContent({
  isLoadingPage,
  currentViewMode,
  renderCalendar,
  renderKanban,
  canEdit,
  isEditing,
  localSubtitle,
  formattedHtml,
  activeHtmlContent,
  children,
  isSaving,
  handleSave,
  title,
  logoLight,
  logoDark,
  pageItem,
  customActions,
  setLocalSubtitle
}) {
  const allTags = useExtractedTags(pageItem);

  const cleanDescription = React.useMemo(() => {
    if (!pageItem?.description) return null;
    return pageItem.description.replace(HASHTAG_REGEX, '').trim();
  }, [pageItem]);

  const hasShortcodes = React.useMemo(() => {
    return activeHtmlContent?.includes(SHORTCODE_TABS);
  }, [activeHtmlContent]);

  if (isLoadingPage) return <LoadingSkeleton />;
  if (currentViewMode === 'calendar' && renderCalendar) {
    return <div className="w-full flex-1 flex flex-col min-h-0">{renderCalendar()}</div>;
  }
  if (currentViewMode === 'kanban' && renderKanban) {
    return <div className="w-full flex-1 flex flex-col min-h-0">{renderKanban()}</div>;
  }

  return (
    <article className="bg-transparent flex flex-col z-10 flex-1 min-w-0 w-full" aria-label={`Pàgina de ${title}`}>
      <header className="flex flex-col items-center justify-center pb-5 pt-8 bg-sdp-bg-panel rounded-b-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] mb-0 relative z-10 shrink-0 mx-2 md:mx-3">
        <div className="w-full flex flex-col items-center justify-center px-4 md:px-6 relative max-w-4xl mx-auto">
          <LogoSlot logoLight={logoLight} logoDark={logoDark} />
          
          {title && <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center tracking-tight leading-none uppercase mb-0 mt-2 max-w-4xl w-full break-words">{title}</h1>}
          
          {customActions && <div className="w-full mt-6">{customActions}</div>}
          
          {allTags.length > 0 && (
            <div className="w-full flex justify-center items-center gap-2 mt-6 flex-wrap">
              {allTags.map((tag, i) => (
                <span key={`${tag}-${i}`} className={`text-[13px] md:text-[14px] font-black tracking-wide px-4 py-2 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-center flex-1 min-h-0 pb-12 shrink-0">
        {canEdit && isEditing ? (
          <input
            type="text"
            value={localSubtitle}
            onChange={e => setLocalSubtitle(e.target.value)}
            className="text-2xl md:text-3xl font-bold text-sdp-theme-accent-primary uppercase bg-transparent border-b-2 border-dashed border-sdp-theme-accent-primary outline-none w-full focus:bg-sdp-theme-accent-primary/10 transition-colors pb-1 text-center mt-10 mb-4"
            placeholder="INTRODUEIX EL SUBTÍTOL (H2)"
          />
        ) : localSubtitle ? (
          <h2 className="text-2xl md:text-3xl font-bold text-sdp-theme-accent-primary uppercase mb-4 mt-10 text-center w-full break-words">{localSubtitle}</h2>
        ) : null}

        {cleanDescription && (
          <p className="text-lg md:text-xl font-medium text-theme-text/80 leading-relaxed text-center mb-6 w-full">
            {cleanDescription}
          </p>
        )}

        {canEdit && isEditing ? (
          <div className="w-full custom-scrollbar pt-2">
            <Suspense fallback={<div className="p-8 text-center animate-pulse">Carregant editor...</div>}>
              <RichTextEditor content={formattedHtml} onSave={handleSave} isSaving={isSaving} editable />
            </Suspense>
          </div>
        ) : (
          <div className="app-cms-content w-full relative flex flex-col items-center">
            {children || (hasShortcodes 
              ? <ContentWithShortcodes content={formattedHtml} /> 
              : <div dangerouslySetInnerHTML={{ __html: formattedHtml }} className="w-full h-full" />)}
          </div>
        )}
      </section>
    </article>
  );
});
