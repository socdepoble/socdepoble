import React, { memo, Suspense } from 'react';
import UniversalHeader from './UniversalHeader';
import UniversalHero from './UniversalHero';
import UniversalCardHeader from '../ui/universal-card/UniversalCard.Header';
import MediaViewerModal from '../modals/MediaViewerModal';
import FloatingIndex from '../ui/FloatingIndex';
import SEO from '../core/SEO';
import { MEDIA_REGISTRY } from '../../data/media_registry';

const resolveMedia = (originalPath) => {
    if (!originalPath || originalPath.startsWith('http')) return originalPath;
    const filename = originalPath.split('/').pop().split('?')[0];
    const found = MEDIA_REGISTRY?.media?.find(m => m.filename === filename);
    return found ? found.path : originalPath;
};

// Lazy load the history modal
const HistoryModal = React.lazy(() => import('../modals/HistoryModal'));

const UniversalView = memo(({
    viewModel,
    handlers,
    children,
    ActualContent
}) => {
    const {
        standAlone,
        isHistoryOpen,
        pageId,
        title,
        subtitle,
        routeSlug,
        isIndexOpen,
        isIndexPinned,
        translating,
        isActionMenuOpen,
        mediaViewerSrc,
        mediaViewerImages,
        pageItem,
        canEdit,
        isEditing,
        heroFormat,
        heroPosition,
        heroImage,
        forcedImages,
        forcedHeroImage,
        logoLight,
        logoDark,
        renderKanban,
        renderCalendar,
        customActions,
        collaborators,
        user,
        currentViewMode
    } = viewModel;

    const {
        setIsHistoryOpen,
        onRestoreHistory,
        setIsIndexOpen,
        setIsIndexPinned,
        setMediaViewerSrc,
        setMediaViewerImages,
        setTitle,
        setSubtitle,
        setHeroImage,
        setHeroFormat,
        setHeroPosition,
        setLogoLight,
        setLogoDark,
        setViewMode,
        scrollContainerRef
    } = handlers;

    const mediaList = forcedImages && forcedImages.length > 0 ? forcedImages : ((forcedHeroImage || heroImage) ? [forcedHeroImage || heroImage] : []);

    return (
        <div 
            className={standAlone 
                ? "flex-1 h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full max-w-[100vw] overflow-hidden isolate overscroll-none touch-none relative" 
                : "flex-1 h-full overflow-hidden w-full min-h-0 isolate bg-white dark:bg-[#121212] relative flex flex-col"}
        >
            {isHistoryOpen && (
                <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[var(--z-modal,500)]"><div className="w-8 h-8 rounded-full border-4 border-white/20 border-[var(--theme-accent-primary)] animate-spin"></div></div>}>
                    <HistoryModal 
                        isOpen={true} 
                        onClose={() => setIsHistoryOpen(false)} 
                        pageId={pageId} 
                        onRestore={onRestoreHistory} 
                    />
                </Suspense>
            )}
            
            {standAlone && (
                <SEO 
                    title={title || "Sóc de Poble: El Projecte"} 
                    description={subtitle || "La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat."} 
                    image={heroImage || (forcedImages ? forcedImages[0] : "/uploads/avatars/soc-de-poble_book_comic_nano_1770526279743.png")}
                    url={routeSlug} 
                />
            )}

            <UniversalHeader 
                isIndexOpen={isIndexOpen}
                onToggleIndex={() => setIsIndexOpen(!isIndexOpen)}
                routeSlug={routeSlug}
                title={title}
                translating={translating}
            />

            <main 
                ref={scrollContainerRef}
                className={standAlone
                    ? "flex-1 min-h-0 w-full relative bg-[var(--bg-app)] pb-[max(env(safe-area-inset-bottom),0px)] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"
                    : "flex-1 min-h-0 w-full relative bg-[var(--bg-app)] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"}
                inert={(isActionMenuOpen || isHistoryOpen || !!mediaViewerSrc) ? true : undefined}
                style={{ scrollBehavior: 'smooth' }}
            >
                <UniversalHero 
                    images={mediaList.map(img => resolveMedia(img))}
                    format={heroFormat}
                    position={heroPosition}
                    onImageClick={(imgs, src) => {
                        const contentImages = Array.from(document.querySelectorAll('.app-cms-content img, .universal-content img')).map(img => img.src);
                        const allImages = [src, ...contentImages].filter((v, i, a) => a.indexOf(v) === i);
                        setMediaViewerImages(allImages);
                        setMediaViewerSrc(src);
                    }}
                />

                <div className="sticky top-0 z-[190] w-full shrink-0 shadow-sm">
                    <UniversalCardHeader
                        item={pageItem || null}
                        cardVariant="project"
                        displayTown={pageItem?.town_name || "La Torre de les Maçanes"}
                        displayAuthor={pageItem?.author || "Sóc de Poble"}
                        avatarSrc={pageItem?.author_avatar || "/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"}
                        avatarRole={pageItem?.author_role || "official"}
                        isOfficial={false}
                        infoText={pageItem ? undefined : null}
                        infoLink="/versions"
                        displayDate="15/5/2026"
                        displayTime="12:00"
                        isPageHeader={true}
                    />
                </div>

                <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10 mt-0 mb-0">
                    <div className="app-cms-content bg-white dark:bg-[#1a1a1a] rounded-b-[28px] rounded-t-none shadow-sm px-6 py-6 pb-0 flex flex-col items-center justify-center text-center border-x border-b border-black/5 dark:border-white/5 border-t-0">
                        {/* PagePresentationHeader Content */}
                        <div className={`w-full flex flex-col items-center justify-center px-6 relative group pt-8 transition-all duration-300 ${isIndexPinned ? 'lg:pl-[320px]' : ''}`}>
                            {(routeSlug === 'codex' || (collaborators && collaborators.length > 0)) && (
                                <div className="flex -space-x-3 mb-6 opacity-90 transition-opacity hover:opacity-100 items-center justify-center">
                                    <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-panel)] shadow-md z-20 bg-black flex items-center justify-center overflow-hidden" title="Mestre">
                                        <img src="/uploads/avatars/javi-llinares_comic.png" alt="Mestre" className="w-full h-full object-cover" />
                                    </div>
                                    {(routeSlug === 'codex' || routeSlug === 'manifest' || (collaborators && collaborators.length > 1)) && (
                                        <div className="w-10 h-10 rounded-full border-2 border-[var(--theme-accent-primary)] shadow-md z-10 bg-black flex items-center justify-center overflow-hidden" title="Antigravity IAIA">
                                            <span className="text-[var(--theme-accent-secondary)] text-xs font-black tracking-tighter">IA</span>
                                        </div>
                                    )}
                                    <span className="ml-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        CO-AUTORIA ACTIVA
                                    </span>
                                </div>
                            )}

                            {canEdit && isEditing ? (
                                <div className="w-full max-w-4xl flex flex-col items-center gap-4">
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-accent-secondary)] text-center tracking-tight leading-none uppercase border-b-2 border-dashed border-[var(--theme-accent-primary)] outline-none w-full focus:bg-[var(--theme-accent-primary)]/10 transition-colors pb-2 bg-transparent"
                                        placeholder="INTRODUEIX EL TÍTOL (H1)"
                                    />
                                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Hero Image URL</label>
                                            <input type="text" value={heroImage} onChange={e => setHeroImage(e.target.value)} className="bg-transparent border-b border-black/20 dark:border-white/20 outline-none text-sm p-1" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Format de la Portada</label>
                                            <select value={heroFormat} onChange={e => setHeroFormat(e.target.value)} className="bg-transparent border-b border-black/20 dark:border-white/20 outline-none text-sm p-1 cursor-pointer">
                                                <option value="horizontal" className="bg-[var(--bg-panel)] text-[var(--text-main)]">Horitzontal (Retallat)</option>
                                                <option value="square" className="bg-[var(--bg-panel)] text-[var(--text-main)]">Original (Complet / Fluid)</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Posició Portada (Només Horitzontal)</label>
                                            <select value={heroPosition} onChange={e => setHeroPosition(e.target.value)} disabled={heroFormat !== 'horizontal'} className={`bg-transparent border-b border-black/20 dark:border-white/20 outline-none text-sm p-1 cursor-pointer ${heroFormat !== 'horizontal' ? 'opacity-50' : ''}`}>
                                                <option value="top" className="bg-[var(--bg-panel)] text-[var(--text-main)]">Superior (Dalt/Cel)</option>
                                                <option value="center" className="bg-[var(--bg-panel)] text-[var(--text-main)]">Centre</option>
                                                <option value="bottom" className="bg-[var(--bg-panel)] text-[var(--text-main)]">Inferior (Baix/Terra)</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Logo URL (Mode Clar)</label>
                                            <input type="text" value={logoLight} onChange={e => setLogoLight(e.target.value)} className="bg-transparent border-b border-black/20 dark:border-white/20 outline-none text-sm p-1" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Logo URL (Mode Fosc)</label>
                                            <input type="text" value={logoDark} onChange={e => setLogoDark(e.target.value)} className="bg-transparent border-b border-black/20 dark:border-white/20 outline-none text-sm p-1" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center w-full max-w-4xl">
                                    {(logoLight || logoDark) && (
                                        <>
                                            {logoLight && (
                                                <img 
                                                    src={logoLight} 
                                                    alt="Logo (Clar)" 
                                                    className={`h-16 sm:h-20 w-auto mb-4 object-contain transition-all drop-shadow-none ${logoDark ? 'dark:hidden' : ''}`}
                                                />
                                            )}
                                            {logoDark && (
                                                <img 
                                                    src={logoDark} 
                                                    alt="Logo (Fosc)" 
                                                    className={`h-16 sm:h-20 w-auto mb-4 object-contain transition-all drop-shadow-none ${logoLight ? 'hidden dark:block' : ''}`}
                                                />
                                            )}
                                        </>
                                    )}
                                    <div className="app-cms-content w-full flex flex-col items-center justify-center">
                                        <h1>
                                            {(title || "Pàgina Sense Títol").replace(/^Sóc de Poble:\s*/i, '')}
                                        </h1>
                                    </div>
                                    
                                    {/* Elements Custom Renderitzats Sota el H1 */}
                                    <div className="w-full max-w-4xl flex flex-col items-center gap-4 mb-[25px]">
                                        {renderKanban && <div className="w-full">{typeof renderKanban === 'function' ? renderKanban() : renderKanban}</div>}
                                        {renderCalendar && <div className="w-full">{typeof renderCalendar === 'function' ? renderCalendar() : renderCalendar}</div>}
                                        {customActions && <div className="w-full flex items-center justify-center gap-2 flex-wrap">{customActions}</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {(renderKanban || renderCalendar) && (
                            <div className="flex justify-center mt-6 w-full mb-[25px]">
                                <div className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-full shadow-inner border border-black/5 dark:border-white/5">
                                    <button 
                                        onClick={() => setViewMode('document')}
                                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase transition-all ${currentViewMode === 'document' ? 'bg-[var(--theme-accent-primary)] text-white shadow-md' : 'text-gray-500 hover:text-[var(--theme-accent-secondary)] dark:hover:text-[var(--theme-accent-secondary)]'}`}
                                    >
                                        Llistat
                                    </button>
                                    {renderKanban && (
                                        <button 
                                            onClick={() => setViewMode('kanban')}
                                            className={`px-4 py-2 rounded-full text-sm font-bold uppercase transition-all ${currentViewMode === 'kanban' ? 'bg-[var(--theme-accent-primary)] text-white shadow-md' : 'text-gray-500 hover:text-[var(--theme-accent-secondary)] dark:hover:text-[var(--theme-accent-secondary)]'}`}
                                        >
                                            Tauler
                                        </button>
                                    )}
                                    {renderCalendar && (
                                        <button 
                                            onClick={() => setViewMode('calendar')}
                                            className={`px-4 py-2 rounded-full text-sm font-bold uppercase transition-all ${currentViewMode === 'calendar' ? 'bg-[var(--theme-accent-primary)] text-white shadow-md' : 'text-gray-500 hover:text-[var(--theme-accent-secondary)] dark:hover:text-[var(--theme-accent-secondary)]'}`}
                                        >
                                            Línia de Temps
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* CONTINGUT DINÀMIC */}
                <section id="dynamic-content-section" className="w-full flex-1 shrink-0 relative flex flex-col items-center">
                    {ActualContent}
                </section>
            </main>

            {/* MEDIA VIEWER */}
            {!!mediaViewerSrc && (
                <MediaViewerModal 
                    isOpen={true} 
                    onClose={() => {
                        setMediaViewerSrc(null);
                        setMediaViewerImages([]);
                    }} 
                    src={mediaViewerSrc} 
                    images={mediaViewerImages}
                    onNavigate={(newSrc) => setMediaViewerSrc(newSrc)}
                    title={title || "Sóc de Poble Visuals"} 
                />
            )}

            {/* SCROLL TO TOP & INDEX BUTTONS */}
            <FloatingIndex 
                scrollRef={scrollContainerRef} 
                isOpen={isIndexOpen} 
                onToggle={setIsIndexOpen} 
                isPinned={isIndexPinned}
                onPinToggle={setIsIndexPinned}
            />
        </div>
    );
});

export default UniversalView;
