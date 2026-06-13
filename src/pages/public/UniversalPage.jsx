import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useAtomicGuard } from '../../hooks/useAtomicGuard';
import { supabase } from '../../supabaseClient';

// ─── Components Atòmics ─────────────────────────────────────
import UniversalShell from '../../components/universal/UniversalShell';
import LazyHtmlRenderer from '../../components/ui/LazyHtmlRenderer';
import ContentWithShortcodes from '../../components/core/ContentWithShortcodes';
import { MOCK_FEED } from '../../data';

// ─── Lazy Loads ─────────────────────────────────────────────
const RichTextEditor = lazy(() => import('../../components/ui/RichTextEditor'));

// ─── L'Ànima Atòmica (Hooks propis) ──────────────────────────
import { usePageData } from '../../hooks/usePageData';
import { useProcessedContent } from '../../hooks/useProcessedContent';
import { useCmsInteractions } from '../../hooks/useCmsInteractions';
import { usePreBlockFormatter } from '../../hooks/usePreBlockFormatter';
import { useScrollMetrics } from '../../hooks/useScrollMetrics';
import { useOmegaTranslate } from '../../hooks/useOmegaTranslate';

// ═══════════════════════════════════════════════════════════════
// COMPONENT: UniversalPage (Orquestrador Prim)
// ═══════════════════════════════════════════════════════════════

const UniversalPage = ({ 
    slug = null,
    standAlone = true,
    forcedHtml = null,
    forcedTitle = null,
    forcedSubtitle = null,
    forcedImages = null,
    defaultViewMode = 'document',
    renderKanban = null,
    renderCalendar = null,
    customActions = null,
    forcedHeroImage = null,
    children
}) => {
    const location = useLocation();
    const { isSuperAdmin, user } = useAuth();
    const { atomicYSave, startCritical } = useAtomicGuard();
    const yDocRef = useRef(null);

    // ─── Slug normalitzat ──────────────────────────────────────
    const routeSlug = useMemo(() => {
        const raw = slug || location.pathname;
        return raw.replace(/^\/+/, '');
    }, [slug, location.pathname]);

    // ─── Dades de pàgina (offline-first) ──────────────────────
    const {
        htmlContent,
        title,
        subtitle,
        pageId,
        collaborators,
        pageAuthor,
        heroFormat,
        heroPosition,
        heroImage,
        logoLight,
        logoDark,
        isLoadingPage,
        fetchPageContent,
    } = usePageData(routeSlug, forcedHtml, forcedTitle, forcedSubtitle);

    // ─── Estat d'edició / UI ──────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isIndexOpen, setIsIndexOpen] = useState(false);
    const [isIndexPinned, setIsIndexPinned] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [currentViewMode, setViewMode] = useState(defaultViewMode);
    
    // Fallback d'estat d'edició pel sub-títol (per a UI)
    const [localSubtitle, setLocalSubtitle] = useState(subtitle);
    useEffect(() => { setLocalSubtitle(subtitle); }, [subtitle]);

    // ─── Media Viewer ──────────────────────────────────────────
    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    // ─── Referències ────────────────────────────────────────────
    const scrollContainerRef = useRef(null);
    const contentRef = useRef(null);

    // ─── Traducció ──────────────────────────────────────────────
    const { translatedContent, translating, clearTranslation } = useOmegaTranslate(routeSlug, htmlContent);

    // ─── Scroll metrics ─────────────────────────────────────────
    const { pageNumberRef, totalPages } = useScrollMetrics(scrollContainerRef);

    // ─── Processament de contingut (Puresa React) ──────────────
    const hasChildrenWrapper = !!children;
    const hasForcedHtmlWrapper = !!forcedHtml;
    const activeHtmlContent = translatedContent || htmlContent;
    const processedHtml = useProcessedContent(activeHtmlContent, hasChildrenWrapper);

    // ─── Formatació de blocs <pre> (Sense DOM Mutation) ────────
    const formattedHtml = usePreBlockFormatter(processedHtml);

    // ─── Interaccions CMS (Delegació purs) ─────────────────────
    useCmsInteractions(contentRef, {
        onImageClick: (src, allImages) => {
            setMediaViewerImages(allImages);
            setMediaViewerSrc(src);
        },
    });

    // ─── Scroll listener (throttled) per al "Scroll to top" ─────
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setShowScrollTop(el.scrollTop > 300);
                ticking = false;
            });
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    // ─── Fullscreen listener ────────────────────────────────────
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen?.();
        }
    }, []);

    // ─── Permisos i Context ─────────────────────────────────────
    const canEdit = isSuperAdmin || (user && collaborators.includes(user.id));

    const pageItem = useMemo(() => {
        return MOCK_FEED?.find(item => 
            item.slug === routeSlug || 
            item.slug === slug || 
            item.id === `post-socdepoble-${routeSlug}`
        );
    }, [routeSlug, slug]);

    // ─── Guardar (Aïllat, preparat per extraure si cal) ─────────
    const handleSave = useCallback(async (updatedHtml) => {
        if (!canEdit) return;

        const endCritical = startCritical('save-document');
        setIsSaving(true);

        try {
            const cleanHtml = updatedHtml
                .replace(/<!-- HERO_FORMAT: (.*?) -->\n?/g, '')
                .replace(/<!-- HERO_POSITION: (.*?) -->\n?/g, '')
                .replace(/<!-- HERO_IMAGE: (.*?) -->\n?/g, '')
                .replace(/<!-- LOGO_LIGHT: (.*?) -->\n?/g, '')
                .replace(/<!-- LOGO_DARK: (.*?) -->\n?/g, '');

            const finalHtml = `<!-- HERO_FORMAT: ${heroFormat} -->\n<!-- HERO_POSITION: ${heroPosition} -->\n<!-- HERO_IMAGE: ${heroImage} -->\n<!-- LOGO_LIGHT: ${logoLight} -->\n<!-- LOGO_DARK: ${logoDark} -->\n${cleanHtml}`;

            // Y.js atomic guard
            if (yDocRef.current && window.indexedDBProvider) {
                await atomicYSave(yDocRef.current, window.indexedDBProvider);
            }

            const payload = {
                slug: routeSlug,
                title: title || 'Pàgina Sense Títol',
                subtitle: localSubtitle || '',
                html_content: finalHtml,
                published_at: new Date().toISOString(),
            };

            const syncPromise = pageId
                ? supabase.from('cms_pages').update(payload).eq('id', pageId)
                : supabase.from('cms_pages').insert([payload]).select().single();

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout')), 5000)
            );

            await Promise.race([syncPromise, timeoutPromise])
                .then(res => {
                    if (res?.data && !pageId) {
                        fetchPageContent(routeSlug); // Re-fetch si és nou ID
                    } else {
                        // Forcem reload de dades pures
                        fetchPageContent(routeSlug);
                    }
                })
                .catch(err => {
                    console.warn('[Trellat] Sync pendent:', err);
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(reg => {
                            if ('sync' in reg) reg.sync.register('trellat-sync-pending');
                        });
                    }
                });

            setIsEditing(false);
        } catch (err) {
            console.error('Error guardant:', err);
            alert('Error al guardar: ' + err.message);
        } finally {
            setIsSaving(false);
            endCritical();
        }
    }, [canEdit, routeSlug, title, localSubtitle, heroFormat, heroPosition, heroImage, logoLight, logoDark, pageId, atomicYSave, startCritical, fetchPageContent]);

    // ─── Renderitzat del Contingut (UniversalContent inline prim) 
    const ActualContent = useMemo(() => {
        if (isLoadingPage) {
            return (
                <div className="w-full flex-1 flex flex-col items-center justify-center p-10 min-h-[50vh]">
                    <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl">
                        <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-3/4 mb-4" />
                        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
                        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
                        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6" />
                        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full mt-4" />
                        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-4/5" />
                    </div>
                </div>
            );
        }

        if (currentViewMode === 'calendar' && renderCalendar) {
            return <div className="w-full flex-1 flex flex-col min-h-0">{renderCalendar()}</div>;
        }

        if (currentViewMode === 'kanban' && renderKanban) {
            return <div className="w-full flex-1 flex flex-col min-h-0">{renderKanban()}</div>;
        }

        // Extracció de Tags sense useMemo intern (ja està dins del useMemo pare)
        const rawDesc = pageItem?.content || pageItem?.subtitle || '';
        const extractedTags = (rawDesc.match(/#[a-zA-Z0-9_À-ÿ]+/g) || []).map(t => t.replace(/^#+/, ''));
        const allTags = [...new Set([...(pageItem?.tags || []), ...extractedTags])];

        return (
            <div className="h-full bg-transparent flex flex-col z-10 flex-1 min-w-0 w-full">
                {/* 4. CONTINGUT TITULAR (Quadre blanc amb fons arrodonit penjat del header) */}
                <div className="w-full px-2 md:px-3">
                    <section className="w-full flex flex-col items-center justify-center pb-5 pt-8 bg-[var(--bg-panel)] rounded-b-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] mb-0 relative z-10 shrink-0">
                        <div className="w-full flex flex-col items-center justify-center px-4 md:px-6 relative group max-w-4xl mx-auto">
                            
                            {/* SLOT SUPERIOR: Logo */}
                            {(logoLight || logoDark) ? (
                                <>
                                    {logoLight && <img src={logoLight} alt="Logo Light" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all dark:hidden" />}
                                    {logoDark && <img src={logoDark} alt="Logo Dark" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all hidden dark:block" />}
                                    {(logoLight && !logoDark) && <img src={logoLight} alt="Logo Dark Fallback" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all hidden dark:block" />}
                                    {(!logoLight && logoDark) && <img src={logoDark} alt="Logo Light Fallback" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all dark:hidden" />}
                                </>
                            ) : (
                                <>
                                    <img src="/assets/system/ui/logo-socdepoble-rect-negre.svg" alt="Logo Sóc de Poble (Negre)" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all dark:hidden" />
                                    <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Logo Sóc de Poble (Fosc)" className="h-20 sm:h-28 w-auto mb-6 object-contain transition-all hidden dark:block" />
                                </>
                            )}

                            {/* EL TÍTOL (H1) */}
                            {title && (
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center tracking-tight leading-none uppercase mb-0 mt-2 max-w-4xl w-full break-words">
                                    {title}
                                </h1>
                            )}

                            {/* CUSTOM ACTIONS (ex: Botons de Full de Ruta) */}
                            {customActions && (
                                <div className="w-full mt-6">
                                    {customActions}
                                </div>
                            )}

                            {/* SLOT INFERIOR: Etiquetes */}
                            {allTags.length > 0 && (
                                <div className="w-full flex justify-center items-center gap-2 mt-6 flex-wrap">
                                    {allTags.map((tag, index) => {
                                        const cleanTagStr = tag.replace(/^#+/, '');
                                        const bgClasses = ['bg-[#0369A1]/10 text-[#0369A1]', 'bg-[#F97316]/10 text-[#F97316]', 'bg-black/5 dark:bg-white/10 text-theme-text'];
                                        const colorClass = bgClasses[index % bgClasses.length];
                                        return (
                                            <div key={cleanTagStr} className={`text-[13px] md:text-[14px] font-black tracking-wide px-4 py-2 rounded-full ${colorClass}`}>
                                                <span>{cleanTagStr}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Subtítol editable / visible (H2) */}
                <div className="w-full shrink-0 px-4 sm:px-6 lg:px-10 mb-0 pt-8 max-w-4xl mx-auto">
                    {canEdit && isEditing ? (
                        <input
                            type="text"
                            value={localSubtitle}
                            onChange={e => setLocalSubtitle(e.target.value)}
                            className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-primary)] uppercase bg-transparent border-b-2 border-dashed border-[var(--theme-accent-primary)] outline-none w-full focus:bg-[var(--theme-accent-primary)]/10 transition-colors pb-1 text-center mt-2"
                            placeholder="INTRODUEIX EL SUBTÍTOL (H2)"
                        />
                    ) : localSubtitle ? (
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-primary)] uppercase mb-0 text-center px-4 w-full break-words">
                            {localSubtitle}
                        </h2>
                    ) : null}
                </div>

                {/* Entradilla (Excerpt) */}
                {pageItem?.description && (
                    <div className="w-full shrink-0 px-6 sm:px-10 lg:px-12 mt-4 max-w-4xl mx-auto text-center">
                        <p className="text-lg md:text-xl font-medium text-theme-text/80 leading-relaxed">
                            {pageItem.description.replace(/#[a-zA-Z0-9_À-ÿ]+/g, '').trim()}
                        </p>
                    </div>
                )}

                {/* Editor o Contingut */}
                {canEdit && isEditing ? (
                    <div className="w-full custom-scrollbar px-4 pt-6 shrink-0">
                        <Suspense fallback={<div className="p-8 text-center animate-pulse">Carregant editor...</div>}>
                            <RichTextEditor
                                content={formattedHtml}
                                onChange={() => {}} // Aïllat dins del component RichText
                                onSave={handleSave}
                                isSaving={isSaving}
                                editable={true}
                            />
                        </Suspense>
                    </div>
                ) : (
                    <div
                        ref={contentRef}
                        className="app-cms-content w-full flex-1 min-h-0 relative flex flex-col items-center max-w-4xl mx-auto px-4 sm:px-10 lg:px-12 pb-12"
                    >
                        {children || (activeHtmlContent?.includes('[TABS_START]') ? (
                            <ContentWithShortcodes content={formattedHtml} />
                        ) : (
                            <LazyHtmlRenderer htmlContent={formattedHtml} className="w-full h-full" />
                        ))}
                    </div>
                )}
            </div>
        );
    }, [
        isLoadingPage, currentViewMode, renderCalendar, renderKanban,
        canEdit, isEditing, localSubtitle, formattedHtml, activeHtmlContent,
        children, isSaving, handleSave, title, logoLight, logoDark, pageItem, customActions
    ]);

    // ─── ViewModel ──────────────────────────────────────────────
    const viewModel = useMemo(() => ({
        seo: {
            enabled: true,
            title: title || 'Sóc de Poble',
            description: localSubtitle || '',
            image: forcedHeroImage || heroImage || '',
            url: typeof window !== 'undefined' ? window.location.href : ''
        },
        page: {
            id: pageId,
            slug: routeSlug,
            item: pageItem,
            author: pageAuthor
        },
        presentation: {
            title: title || 'Sense Títol'
        },
        hero: {
            images: forcedImages || (forcedHeroImage || heroImage ? [forcedHeroImage || heroImage] : []),
            format: heroFormat,
            position: heroPosition,
            videoUrl: pageItem?.video_url
        },
        media: {
            current: mediaViewerSrc,
            images: mediaViewerImages
        },
        standAlone, pageId, routeSlug, pageItem, title, subtitle: localSubtitle,
        heroImage: forcedHeroImage || heroImage, forcedImages, heroFormat, heroPosition,
        logoLight, logoDark, collaborators, customActions,
        renderKanban, renderCalendar, currentViewMode, mediaViewerSrc, mediaViewerImages,
        isLoadingPage, isEditing, canEdit, translating, user, isFullscreen, showScrollTop,
        isActionMenuOpen, isIndexOpen, isIndexPinned, isHistoryOpen, totalPages,
        pageNumberRef, hasChildrenWrapper, hasForcedHtmlWrapper, pageAuthor
    }), [
        standAlone, pageId, routeSlug, pageItem, title, localSubtitle,
        heroImage, forcedHeroImage, forcedImages, heroFormat, heroPosition,
        logoLight, logoDark, collaborators, customActions,
        renderKanban, renderCalendar, currentViewMode, mediaViewerSrc, mediaViewerImages,
        isLoadingPage, isEditing, canEdit, translating, user, isFullscreen, showScrollTop,
        isActionMenuOpen, isIndexOpen, isIndexPinned, isHistoryOpen, totalPages,
        hasChildrenWrapper, hasForcedHtmlWrapper, pageAuthor, pageNumberRef
    ]);

    // ─── Handlers ───────────────────────────────────────────────
    const handlers = useMemo(() => ({
        ui: {
            isIndexOpen, isIndexPinned,
            toggleIndex: () => setIsIndexOpen(p => !p),
            togglePin: () => setIsIndexPinned(p => !p),
        },
        media: {
            openViewer: setMediaViewerSrc,
            closeViewer: () => { setMediaViewerSrc(null); setMediaViewerImages([]); },
        },
        refs: { scrollContainerRef },
        history: {
            isOpen: isHistoryOpen,
            close: () => setIsHistoryOpen(false),
            restore: () => { clearTranslation(); setIsEditing(true); },
        },
        editing: { start: () => setIsEditing(true), stop: () => setIsEditing(false) },
        viewMode: { set: setViewMode },
        fullscreen: { toggle: toggleFullscreen },
        scroll: { toTop: () => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) },
        
        // Legacy Support per UniversalShell antic
        setIsHistoryOpen,
        onRestoreHistory: () => { clearTranslation(); setIsEditing(true); },
        setIsIndexOpen, setIsIndexPinned, setMediaViewerSrc, setMediaViewerImages,
        setViewMode, scrollContainerRef,
    }), [
        isIndexOpen, isIndexPinned, isHistoryOpen, clearTranslation,
        toggleFullscreen, setViewMode
    ]);

    return (
        <UniversalShell viewModel={viewModel} handlers={handlers}>
            {ActualContent}
        </UniversalShell>
    );
};

export default UniversalPage;
