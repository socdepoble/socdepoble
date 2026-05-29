import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Book, Plus, Search, MessageCircle, Minimize, Maximize, Share2, ChevronUp, ChevronDown, X, Globe, Database } from 'lucide-react';
import FloatingIndex from '../../components/ui/FloatingIndex';
const ProjectPresentation = lazy(() => import('../../pages/public/ProjectPresentationNew'));
const RichTextEditor = lazy(() => import('../../components/ui/RichTextEditor'));
import { useAuth } from '../../app/context/AuthContext';
import { supabase } from '../../supabaseClient';
import { exportService } from '../../core/services/exportService';
import { useModal } from '../../app/context/ModalContext';
const HistoryModal = lazy(() => import('../../components/modals/HistoryModal'));
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import useAccessibleSearch from '../../hooks/useAccessibleSearch';
import SEO from '../../components/core/SEO';
import { APP_VERSION } from '../../constants';
import GlobalFooter from '../../components/layout/GlobalFooter';
import UniversalCardHeader from '../../components/ui/universal-card/UniversalCard.Header';
import MediaViewerModal from '../../components/modals/MediaViewerModal';
import ImageCarousel from '../../components/ui/ImageCarousel';
import LazyHtmlRenderer from '../../components/ui/LazyHtmlRenderer';

// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
import { get, set } from 'idb-keyval';
import { useAtomicGuard } from '../../hooks/useAtomicGuard';
import { MEDIA_REGISTRY } from '../../data/media_registry';
import { VERSIONS_HTML } from '../../data/VersionsContent';
import { GENOTIP_HTML } from '../../data/GenotipContent';
import { IAIES_MUNDIALS_HTML } from '../../data/IaiesMundialsContent';
import ContentWithShortcodes from '../../components/core/ContentWithShortcodes';

const resolveMedia = (originalPath) => {
    if (!originalPath || originalPath.startsWith('http')) return originalPath;
    
    // Si viene del registry, buscar por nombre base. Esto arregla los links rotos por cambios de carpeta
    const filename = originalPath.split('/').pop().split('?')[0];
    const found = MEDIA_REGISTRY.media.find(m => m.filename === filename);
    return found ? found.path : originalPath;
};



const UniversalPage = ({ 
    slug = null, 
    standAlone = true,
    forcedHtml = null, 
    forcedTitle = null, 
    forcedSubtitle = null, 
    forcedImages = null, 
    isSquareHero = false,
    defaultViewMode = 'document',
    renderKanban = null,
    renderCalendar = null,
    renderDocument = null,
    seoImage = null,
    customActions = null
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const { isSuperAdmin, user } = useAuth();
    const { openTranslationModal } = useModal();

    const [htmlContent, setHtmlContent] = useState('');
    const [pageId, setPageId] = useState(null);
    const [routeSlug, setRouteSlug] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [collaborators, setCollaborators] = useState([]);

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Trellat: Guardas atómicas
    const { atomicYSave, startCritical } = useAtomicGuard();
    const yDocRef = useRef(null);


    const canEdit = isSuperAdmin || (user && collaborators.includes(user.id));

    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    // VISTA DE RENDER (Document/Calendari/Kanban)
    const [currentViewMode] = useState(defaultViewMode);

    // FORMATO HERO DEL PROYECTO
    const [heroFormat, setHeroFormat] = useState('square');
    const [heroPosition, setHeroPosition] = useState('center');
    const [heroImage, setHeroImage] = useState('');
    const [logoLight, setLogoLight] = useState('');
    const [logoDark, setLogoDark] = useState('');

    // OMEGA TRANSLATE STATE
    const [translating, setTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(null);

    // HISTORY STATE
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // SEARCH STATE
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // FAST SCRUBBER STATE (DEPRECATED)
    const scrollContainerRef = useRef(null);
    const searchEngine = useAccessibleSearch(scrollContainerRef);

    // SCROLL TO TOP LISTENER
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const onScroll = () => {
            setShowScrollTop(el.scrollTop > 300);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    // BOOK PAGE METRICS (ZERO RE-RENDER SCROLLING)
    const pageNumberRef = useRef(null);
    const [totalPages, setTotalPages] = useState(1);


    const fetchPageContent = useCallback(async (_slug) => {
        setIsLoadingPage(true);
        
        if (forcedHtml) {
            setHtmlContent(forcedHtml);
            setTitle(forcedTitle || "Pàgina Sense Títol");
            setSubtitle(forcedSubtitle || '');
            setIsLoadingPage(false);
            return;
        }

        const updates = {
            htmlContent: null,
            title: null,
            subtitle: null,
            pageId: null,
            collaborators: [],
            error: null
        };
        let localCache = null;

        try {
            let cacheKey = `page_${_slug}_v2`;
            localCache = await get(cacheKey);
            if (!import.meta.env.DEV) {
                localCache = await get(cacheKey);
            }
            
            if (localCache) {
                updates.htmlContent = localCache.html;
                updates.title = localCache.title;
                updates.subtitle = localCache.subtitle;
                updates.pageId = localCache.pageId;
                updates.collaborators = localCache.collaborators || [];
                
                setHtmlContent(updates.htmlContent);
                setTitle(updates.title);
                setSubtitle(updates.subtitle);
                setPageId(updates.pageId);
                setCollaborators(updates.collaborators);
                setIsLoadingPage(false);
            }

            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', _slug)
                .maybeSingle();

            if (error) throw error;

            if (data || _slug === 'genotip' || _slug === 'versions' || _slug === 'iaies-mundials') {
                let content = data?.html_content || '';
                
                if (!content || content.includes('Aquest text és provisional') || content.includes('Aquesta funcionalitat està en desenvolupament')) {
                    if (_slug === 'genotip') {
                        content = GENOTIP_HTML;
                        updates.title = "Genotip";
                        updates.subtitle = "L'ADN artificial del sistema";
                    } else if (_slug === 'versions') {
                        content = VERSIONS_HTML;
                        updates.title = "Versions del Sistema";
                        updates.subtitle = "Historial d'actualitzacions i memòria tècnica";
                    } else if (_slug === 'iaies-mundials') {
                        content = IAIES_MUNDIALS_HTML;
                        updates.title = "Iaies Mundials";
                        updates.subtitle = "Conexions globals";
                    }
                }
                
                const formatMatch = content.match(/<!-- HERO_FORMAT: (.*?) -->\n?/);
                if (formatMatch && formatMatch[1]) {
                    setHeroFormat(formatMatch[1]);
                    content = content.replace(formatMatch[0], '');
                }
                const positionMatch = content.match(/<!-- HERO_POSITION: (.*?) -->\n?/);
                if (positionMatch && positionMatch[1]) {
                    setHeroPosition(positionMatch[1]);
                    content = content.replace(positionMatch[0], '');
                }
                const imageMatch = content.match(/<!-- HERO_IMAGE: (.*?) -->\n?/);
                if (imageMatch && imageMatch[1]) {
                    setHeroImage(imageMatch[1]);
                    content = content.replace(imageMatch[0], '');
                }
                const logoLightMatch = content.match(/<!-- LOGO_LIGHT: (.*?) -->\n?/);
                if (logoLightMatch && logoLightMatch[1]) {
                    setLogoLight(logoLightMatch[1]);
                    content = content.replace(logoLightMatch[0], '');
                } else {
                    setLogoLight('/assets/system/ui/logo-socdepoble-rect-negre.svg');
                }
                const logoDarkMatch = content.match(/<!-- LOGO_DARK: (.*?) -->\n?/);
                if (logoDarkMatch && logoDarkMatch[1]) {
                    setLogoDark(logoDarkMatch[1]);
                    content = content.replace(logoDarkMatch[0], '');
                } else {
                    setLogoDark('/assets/system/ui/logo-socdepoble-rect-blanc.svg');
                }

                updates.htmlContent = content;
                updates.title = updates.title || data?.title || '';
                updates.subtitle = updates.subtitle || data?.subtitle || '';
                updates.pageId = data?.id;
                updates.collaborators = data?.collaborators || [];
                
                if (JSON.stringify(localCache?.html) !== JSON.stringify(content)) {
                    await set(cacheKey, {
                        html: content,
                        title: updates.title,
                        subtitle: updates.subtitle,
                        pageId: updates.pageId,
                        collaborators: updates.collaborators,
                        timestamp: Date.now()
                    });
                    
                    setHtmlContent(updates.htmlContent);
                    setTitle(updates.title);
                    setSubtitle(updates.subtitle);
                    setPageId(updates.pageId);
                    setCollaborators(updates.collaborators);
                }
            } else {
                updates.htmlContent = "<p>Aquesta pàgina encara no té contingut. (Error 404 local)</p>";
                updates.title = "Pàgina No Trobada";
                updates.subtitle = "";
                
                setHtmlContent(updates.htmlContent);
                setTitle(updates.title);
                setSubtitle(updates.subtitle);
            }
        } catch (err) {
            console.error('[Trellat] Error fetch:', err);
            updates.error = err;
            if (!localCache) {
                setHtmlContent("<p>Error carregant la pàgina.</p>");
                setTitle("Error de connexió");
            }
        } finally {
            if (!localCache) setIsLoadingPage(false);
            updates.htmlContent = null; 
        }
    }, [forcedHtml, forcedSubtitle, forcedTitle]);

    useEffect(() => {
        let currentSlug = slug || location.pathname;
        const normalizedSlug = currentSlug.replace(/^\/+/, '');
        setRouteSlug(normalizedSlug);
        fetchPageContent(normalizedSlug);
    }, [location.pathname, slug, fetchPageContent]);


    const activeHtmlContent = translatedContent || htmlContent;

    const processedHtml = useMemo(() => {
        if (!activeHtmlContent) return '';
        // If the first tag is an H1 that contains "SÓC DE POBLE", we can assume it's the redundant one
        const stripped = activeHtmlContent.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, '');
        // HOT-FIX: Clean absolute URLs and prevent 403 GET errors from old IndexedDB/supabase drafts
        const cleanedPaths = stripped.replace(
            /(?:https?:\/\/(?:www\.)?socdepoble\.(?:org|net))?\/Users\/javillinares\/[\w/.-]+\/([a-zA-Z0-9_-]+\.(?:jpg|png|jpeg|webp|gif))/gi, 
            (match, filename) => resolveMedia(filename)
        );
        return sanitizeHtml(cleanedPaths);
    }, [activeHtmlContent]);

    useEffect(() => {
        if (!processedHtml || isLoadingPage || isEditing) return;
        
        const controller = new AbortController();
        const contentDiv = document.querySelector('.app-cms-content');
        if (!contentDiv) return;

        const handleContentClick = (e) => {
            // 1. Interceptar clics en el botón de copiar
            const btn = e.target.closest('.cms-copy-btn');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                const codeBlock = btn.closest('details')?.querySelector('pre');
                if (codeBlock) {
                    const codeObj = codeBlock.querySelector('code');
                    const codeText = codeObj ? codeObj.innerText : codeBlock.innerText;
                    navigator.clipboard.writeText(codeText).then(() => {
                        const original = btn.innerHTML;
                        btn.innerHTML = `✅ ${t('project.copied', 'Copiat!')}`;
                        setTimeout(() => btn.innerHTML = original, 2000);
                    });
                }
                return;
            }

            // 2. Interceptar clics en imágenes
            if (e.target.tagName === 'IMG') {
                const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                setMediaViewerImages(allImagesArray);
                setMediaViewerSrc(e.target.src);
                return;
            }

            // 3. Interceptar enlaces
            const anyAnchor = e.target.closest('a');
            if (anyAnchor) {
                const href = anyAnchor.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    let targetId = href.substring(1);
                    try { targetId = decodeURIComponent(targetId); } catch (err) { console.warn(err); }
                    
                    let targetEl = document.getElementById(targetId);
                    if (!targetEl) {
                        const fallbackSlug = targetId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        targetEl = document.getElementById(fallbackSlug) || document.querySelector(`[id^="${fallbackSlug}-"]`) || document.querySelector(`[id^="${targetId}-"]`);
                    }
                    
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }
                } else if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.endsWith('.html')) {
                    e.preventDefault();
                    navigate(href);
                }
            }
        };

        contentDiv.addEventListener('click', handleContentClick, { signal: controller.signal });

        // Mutación DOM batcheada (reforzada con cleanup)
        const processPreBlocks = () => {
            const preElements = Array.from(contentDiv.querySelectorAll('pre:not([data-processed])'));
            if (preElements.length === 0) return;
            
            preElements.forEach((pre) => {
                if (pre.parentNode.classList.contains('cms-code-wrapper')) return;

                pre.setAttribute('data-processed', 'true');
                
                const wrapper = document.createElement('div');
                wrapper.className = 'cms-code-wrapper bg-black/5 dark:bg-[#111111] group border border-[var(--border-master)] rounded-[1.5rem] my-6 overflow-hidden shadow-[0_4px_30px_rgba(249,115,22,0.15)] relative';
                
                const header = document.createElement('div');
                header.className = 'p-4 font-bold text-sm uppercase flex items-center justify-between select-none bg-black/5 dark:bg-white/5 border-b border-[var(--border-master)]';
                
                const titleSpan = document.createElement('span');
                titleSpan.className = 'flex items-center gap-2 text-theme-text';
                titleSpan.innerHTML = `<span class="text-lg">💻</span> ${t('project.tech_format', 'Format Tècnic')}`;
                
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'flex items-center gap-3 pr-8';

                const copyBtn = document.createElement('div');
                copyBtn.className = 'cms-copy-btn absolute top-3 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-theme-text text-[0.65rem] font-bold uppercase transition-colors hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 cursor-pointer z-10';
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    ${t('project.copy', 'Copiar')}
                `;

                header.appendChild(titleSpan);
                
                const codeEl = pre.querySelector('code');
                if (codeEl && codeEl.className) {
                    const match = codeEl.className.match(/language-(\w+)/);
                    if (match) {
                        const langSpan = document.createElement('span');
                        langSpan.className = 'text-[0.65rem] uppercase tracking-wider font-bold font-mono text-stone-500 mr-2';
                        langSpan.innerText = match[1];
                        actionsContainer.appendChild(langSpan);
                    }
                }
                
                actionsContainer.appendChild(copyBtn);
                header.appendChild(actionsContainer);
                
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(header);
                
                const contentInner = document.createElement('div');
                contentInner.className = 'p-4 overflow-x-auto custom-scrollbar';
                contentInner.appendChild(pre);
                wrapper.appendChild(contentInner);
                
                pre.className = (pre.className + ' !bg-transparent !p-0 !m-0 !border-0').trim();
            });
        };

        const timeoutId = setTimeout(processPreBlocks, 100); 
        contentDiv.addEventListener('html-chunk-rendered', processPreBlocks, { signal: controller.signal });

        return () => {
            clearTimeout(timeoutId);
            controller.abort(); 
        };
    }, [processedHtml, isLoadingPage, isEditing, t, navigate]);


    const handleSave = async (updatedHtml) => {
        if (!canEdit) return;
        
        // Trellat: Iniciar protección contra cierre de pestaña
        const endCritical = startCritical('save-document');
        
        setIsSaving(true);
        try {
            // META-INJECTION: Persist metadata accurately within HTML string without strict schema dependencies
            const cleanHtml = updatedHtml
                .replace(/<!-- HERO_FORMAT: (.*?) -->\n?/g, '')
                .replace(/<!-- HERO_POSITION: (.*?) -->\n?/g, '')
                .replace(/<!-- HERO_IMAGE: (.*?) -->\n?/g, '')
                .replace(/<!-- LOGO_LIGHT: (.*?) -->\n?/g, '')
                .replace(/<!-- LOGO_DARK: (.*?) -->\n?/g, '');
            const finalHtmlToSave = `<!-- HERO_FORMAT: ${heroFormat} -->\n<!-- HERO_POSITION: ${heroPosition} -->\n<!-- HERO_IMAGE: ${heroImage} -->\n<!-- LOGO_LIGHT: ${logoLight} -->\n<!-- LOGO_DARK: ${logoDark} -->\n` + cleanHtml;

            // 1. Guardar en Y.js (CRDT local) atómicamente si existe provider
            if (yDocRef.current && window.indexedDBProvider) {
                await atomicYSave(yDocRef.current, window.indexedDBProvider);
            }

            const payload = {
                slug: routeSlug,
                title: title || 'Pàgina Sense Títol',
                subtitle: subtitle || '',
                html_content: finalHtmlToSave,
                published_at: new Date().toISOString()
            };

            // 2. Intentar sync con servidor (con timeout 5s offline-first)
            const syncPromise = pageId 
                ? supabase.from('cms_pages').update(payload).eq('id', pageId)
                : supabase.from('cms_pages').insert([payload]).select().single();

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout (Local-First Fallback)')), 5000)
            );

            await Promise.race([syncPromise, timeoutPromise])
                .then(res => {
                    if (res && res.data && !pageId) setPageId(res.data.id);
                })
                .catch(err => {
                    console.warn('[Trellat] Guardado local OK, sync remoto pendiente:', err);
                    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
                        navigator.serviceWorker.ready.then(reg => {
                            if ('sync' in reg) {
                                reg.sync.register('trellat-sync-pending');
                            }
                        });
                    }
                });

            setHtmlContent(finalHtmlToSave);
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving CMS page", err);
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
            endCritical();
        }
    };

    const HeroBanner = useMemo(() => {
        const mediaList = forcedImages && forcedImages.length > 0 ? forcedImages : (heroImage ? [heroImage] : []);
        if (mediaList.length === 0) return null;
        
        // Mapeig de posicions
        const positionClass = heroPosition === 'top' ? 'object-top' : heroPosition === 'bottom' ? 'object-bottom' : 'object-center';
        const displayImage = mediaList[0];

        const handleHeroClick = () => {
            setMediaViewerImages(mediaList);
            setMediaViewerSrc(displayImage);
        };
        
        return (
            <div 
                className={`relative w-full z-0 flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-panel)] cursor-pointer active:scale-[0.99] transition-transform ${heroFormat === 'horizontal' ? 'h-[40vh] min-h-[300px] max-h-[500px]' : ''}`}
                onClick={handleHeroClick}
            >
                {mediaList.length > 1 ? (
                    <div className="w-full h-full relative">
                        <ImageCarousel 
                            images={mediaList} 
                            onImageClick={(index) => {
                                setMediaViewerImages(mediaList);
                                setMediaViewerSrc(mediaList[index]);
                            }} 
                            aspectMode={heroFormat === 'horizontal' ? 'video' : 'square'} 
                        />
                    </div>
                ) : (
                    <img 
                        src={displayImage || undefined} 
                        alt="Hero Banner" 
                        className={`block ${heroFormat === 'horizontal' ? `w-full h-full object-cover ${positionClass} m-0 p-0` : 'w-full h-auto m-0 p-0'}`}
                    />
                )}
            </div>
        );
    }, [heroImage, heroFormat, heroPosition, forcedImages]);

    const PagePresentationHeader = (
        <div className="w-full flex flex-col items-center justify-center px-6 relative group pt-8">
            {logoLight && logoDark && (
                <>
                    <img 
                        src={logoLight || undefined} 
                        alt="Logo (Clar)" 
                        className="h-24 sm:h-32 w-auto mb-6 drop-shadow-md object-contain transition-all dark:hidden" 
                    />
                    <img 
                        src={logoDark || undefined} 
                        alt="Logo (Fosc)" 
                        className="h-24 sm:h-32 w-auto mb-6 drop-shadow-md object-contain transition-all hidden dark:block" 
                    />
                </>
            )}
            
            {(routeSlug === 'codex' || collaborators.length > 0) && (
                <div className="flex -space-x-3 mb-6 opacity-90 transition-opacity hover:opacity-100 items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-panel)] shadow-md z-20 bg-black flex items-center justify-center overflow-hidden" title="Mestre">
                        <img src="/uploads/avatars/javi-llinares_comic.png" alt="Mestre" className="w-full h-full object-cover" />
                    </div>
                    {(routeSlug === 'codex' || routeSlug === 'manifest' || collaborators.length > 1) && (
                        <div className="w-10 h-10 rounded-full border-2 border-[var(--theme-accent-primary)] shadow-md z-10 bg-black flex items-center justify-center overflow-hidden" title="Antigravity IAIA">
                            <span className="text-[var(--theme-accent-primary)] text-xs font-black tracking-tighter">IA</span>
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
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-accent-primary)] text-center tracking-tight leading-none uppercase border-b-2 border-dashed border-[var(--theme-accent-primary)] outline-none w-full focus:bg-[var(--theme-accent-primary)]/10 transition-colors pb-2 bg-transparent"
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
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-accent-primary)] text-center tracking-tight leading-none uppercase mb-6 mt-4">
                        {title || "Pàgina Sense Títol"}
                    </h1>
                </div>
            )}
        </div>
    );

    // Page Number Scroll Listener (Horizontal Native Columns)
    useEffect(() => {
        const scrollContainer = document.getElementById('main-content') || scrollContainerRef.current;
        if (!scrollContainer) return;

        let ticking = false;
        const updateMetrics = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
                    if (clientWidth > 0) {
                        const calculatedTotalPages = Math.max(1, Math.ceil(scrollWidth / clientWidth));
                        if (calculatedTotalPages > 0 && calculatedTotalPages < 10000) {
                            setTotalPages(prev => prev !== calculatedTotalPages ? calculatedTotalPages : prev);
                        }

                        if (scrollWidth > clientWidth) {
                            const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
                            const currentPage = Math.max(1, Math.min(calculatedTotalPages, Math.round(scrollPercentage * (calculatedTotalPages - 1)) + 1));
                            if (pageNumberRef.current && pageNumberRef.current.innerText !== currentPage.toString()) {
                                pageNumberRef.current.innerText = currentPage.toString();
                            }
                        } else {
                            if (pageNumberRef.current && pageNumberRef.current.innerText !== '1') {
                                pageNumberRef.current.innerText = '1';
                            }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        const resizeObserver = new ResizeObserver(() => updateMetrics());
        resizeObserver.observe(scrollContainer);

        scrollContainer.addEventListener('scroll', updateMetrics, { passive: true });
        
        // Timeout to ensure fonts & images are loaded before column calc
        setTimeout(updateMetrics, 500);
        setTimeout(updateMetrics, 1500); 
        
        return () => {
            scrollContainer.removeEventListener('scroll', updateMetrics);
            resizeObserver.disconnect();
        };
    }, [processedHtml, isSearchOpen]);

    // OMEGA TRANSLATE EFFECT (V12 Proxy Seguritzat)
    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const handleTranslateRequest = async (e) => {
            const { postId, targetLang } = e.detail;
            if (postId !== routeSlug && postId !== 'projecte') return;

            if (isMounted) setTranslating(true);
            try {
                // V12 Secure Proxy: Call Supabase Edge Function to avoid leaking API_SECRET payload in client
                const { data, error } = await supabase.functions.invoke('translation', {
                    body: {
                        campaignType: 'omega_translate_ondemand',
                        htmlContent: htmlContent, // Siempre traducimos desde la fuente original
                        targetLang: targetLang
                    }
                });

                if (!isMounted) return;

                if (error) {
                    console.error("Translation proxy error:", error);
                } else if (data && data.status === 'success') {
                    setTranslatedContent(data.translatedHtml);
                } else {
                    console.error("Translation failed:", data);
                }
            } catch (error) {
                if (error && error.name !== 'AbortError') {
                    console.warn("AI Translation failed (CORS?), falling back to Google Translate:", error);
                    const select = document.querySelector('.goog-te-combo');
                    if (select) {
                        select.value = targetLang;
                        select.dispatchEvent(new Event('change'));
                    }
                }
            } finally {
                if (isMounted) setTranslating(false);
            }
        };

        window.addEventListener('omega-translate-request', handleTranslateRequest);

        return () => {
            isMounted = false;
            controller.abort();
            window.removeEventListener('omega-translate-request', handleTranslateRequest);
        };
    }, [routeSlug, htmlContent]);

    // TRANSLATION FOCUS HOOK: Scroll a la primera pàgina quan canvia la traducció
    useEffect(() => {
        if (translatedContent && scrollContainerRef.current) {
            const contentSection = document.getElementById('dynamic-content-section');
            if (contentSection) {
               scrollContainerRef.current.scrollTo({ left: contentSection.offsetLeft, behavior: 'smooth' });
            }
        }
    }, [translatedContent]);

    let ActualContent;
    if (isLoadingPage) {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-10 min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl">
                    <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full mt-4"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-4/5"></div>
                </div>
            </div>
        );
    } else if (currentViewMode === 'calendar' && renderCalendar) {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col min-h-0">
                {renderCalendar()}
            </div>
        );
    } else if (currentViewMode === 'kanban' && renderKanban) {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col min-h-0">
                {renderKanban()}
            </div>
        );
    } else {
        ActualContent = (
            <div className="h-full bg-transparent flex flex-col z-10 flex-1 min-w-0 w-full">
                <div className="w-full shrink-0 px-4 sm:px-6 lg:px-10 mb-0 pt-6 max-w-4xl mx-auto">
                    {canEdit && isEditing ? (
                        <input 
                            type="text" 
                            value={subtitle} 
                            onChange={(e) => setSubtitle(e.target.value)} 
                            className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-secondary)] uppercase bg-transparent border-b-2 border-dashed border-[var(--theme-accent-secondary)] outline-none w-full focus:bg-[var(--theme-accent-secondary)]/10 transition-colors pb-1 text-center mt-6"
                            placeholder="INTRODUEIX EL SUBTÍTOL (Introducció de l'Article)"
                        />
                    ) : (
                        subtitle && (
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-secondary)] uppercase mb-0 mt-6 text-center px-4 w-full break-words">
                                {subtitle}
                            </h2>
                        )
                    )}
                </div>

                {(canEdit && isEditing) ? (
                    <div className="w-full custom-scrollbar px-4 pt-6 shrink-0">
                        <Suspense fallback={<div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Carregant editor...</div>}>
                            <RichTextEditor 
                                content={processedHtml} 
                                onChange={setHtmlContent} 
                                onSave={handleSave} 
                                isSaving={isSaving}
                                editable={true}
                            />
                        </Suspense>
                    </div>
                ) : (
                    <div className="flex-1 w-full h-full min-h-0 relative flex flex-col items-center">
                        <div className="app-cms-content w-full h-full max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 py-10 md:py-12">
                            {processedHtml && processedHtml.includes('[TABS_START]') ? (
                                <ContentWithShortcodes content={processedHtml} />
                            ) : (
                                <LazyHtmlRenderer htmlContent={processedHtml} className="w-full h-full" />
                            )}
                        </div>

                        {(location.pathname.includes('projecte') || routeSlug?.includes('projecte')) && (
                            <div className="mt-12 p-8 bg-stone-100 dark:bg-stone-800/80 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-xl flex flex-col items-center w-full max-w-4xl mb-16 relative z-20">
                                <h3 className="text-2xl font-black text-stone-800 dark:text-white mb-3 text-center uppercase tracking-wider">Vols aprofundir en el codi?</h3>
                                <p className="text-stone-600 dark:text-stone-400 mb-8 text-center max-w-2xl text-lg">
                                    Per als més curiosos, o si ets una Intel·ligència Artificial llegint-nos per entendre les nostres entranyes. Dos accessos reservats per a arquitectes del sistema.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-3xl">
                                    <a href="/llibres/llibre-maquina.html" target="_blank" rel="noopener noreferrer" className="select-none !no-underline !text-inherit cursor-pointer group flex-1 flex flex-col items-center justify-center p-6 bg-stone-900 dark:bg-white rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 outline outline-2 outline-transparent hover:outline-stone-500">
                                        <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🤖</span>
                                        <span className="text-white dark:text-stone-900 font-black uppercase tracking-widest text-sm text-center">Llegir el Llibre</span>
                                        <span className="text-stone-400 dark:text-stone-500 text-xs mt-1 font-medium text-center">El codi font obert i sencer</span>
                                    </a>
                                    <Link to="/genotip" className="select-none !no-underline !text-white cursor-pointer group flex-1 flex flex-col items-center justify-center p-6 bg-orange-600 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 outline outline-2 outline-transparent hover:outline-orange-400">
                                        <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🧬</span>
                                        <span className="text-white font-black uppercase tracking-widest text-sm text-center">Explorar el Genotip</span>
                                        <span className="text-orange-200 text-xs mt-1 font-medium text-center">L'ADN artificial del sistema</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    return (
        // 1. RAÍZ INDESTRUCTIBLE: 100dvh para iOS només en standAlone
        <div 
            className={standAlone 
                ? "flex-1 h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full max-w-[100vw] overflow-hidden isolate overscroll-none touch-none relative" 
                : "flex-1 h-full overflow-hidden w-full min-h-0 isolate bg-white dark:bg-[#121212] relative flex flex-col"}
        >
            {/* 2. MUERTE AL DOM ZOMBI (Desmontaje Estricto de Modales) */}
            {isHistoryOpen && (
                <Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[var(--z-modal,500)]"><div className="w-8 h-8 rounded-full border-4 border-white/20 border-[var(--theme-accent-primary)] animate-spin"></div></div>}>
                    <HistoryModal 
                        isOpen={true} 
                        onClose={() => setIsHistoryOpen(false)} 
                        pageId={pageId} 
                        onRestore={(restoredHtml, restoredTitle, restoredSubtitle) => {
                            setHtmlContent(restoredHtml);
                            setTranslatedContent(null);
                            setTitle(restoredTitle);
                            setSubtitle(restoredSubtitle);
                            setIsEditing(true);
                        }} 
                    />
                </Suspense>
            )}
            
            {standAlone && (
                <SEO 
                    title={title || "Sóc de Poble: El Projecte"} 
                    description="La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat." 
                    image="/uploads/avatars/soc-de-poble_book_comic_nano_1770526279743.png"
                    url={routeSlug} 
                />
            )}
            
            {/* 3. ACTION BAR: PATRÓN PRIORITY+ (ARRIBA, FUERA DEL SCROLL) */}
            <header className="z-[var(--z-sticky,200)] w-full max-w-full overflow-hidden shadow-lg bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] transition-all shrink-0 touch-manipulation border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto overflow-hidden">
                    
                    {/* Esquerra: Tornar i Llibre */}
                    <div className="flex items-center justify-start gap-1 shrink-0">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center justify-center min-h-[44px] w-[44px] rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation shrink-0"
                            aria-label="Tornar arrere"
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                        </button>
                        
                        <button 
                            className="flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm"
                            aria-label={t('project.open_search', "Obrir Cercador")}
                            title={t('project.open_search', "Obrir Cercador")}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search size={20} strokeWidth={2.5} />
                        </button>

                        <button 
                            className="hidden md:flex items-center justify-center min-h-[44px] w-[44px] hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation shrink-0" 
                            title={isFullscreen ? "Surt de Pantalla Completa" : "Llegit a Pantalla Completa"}
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? <Minimize size={20} strokeWidth={2.5} /> : <Maximize size={20} strokeWidth={2.5} />}
                        </button>
                    </div>

                    {/* Centre: Buit en aquesta configuració */}
                    <div className="flex items-center justify-center shrink-0 mx-2">
                        {/* Es pot utilitzar per posar un títol si s'escau */}
                    </div>

                    {/* Dreta: Connectar, Traduir, Comentar, etc. */}
                    <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth">
                        <button 
                            className={`flex items-center justify-center gap-1.5 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0 ${translating ? "text-amber-300 dark:text-white animate-pulse" : ""}`}
                            aria-label="Traduir Pàgina"
                            onClick={() => openTranslationModal({ postId: routeSlug || 'projecte', title: title })}
                            disabled={translating}
                        >
                            {translating ? (
                                <Globe size={20} strokeWidth={2.5} className="animate-spin" />
                            ) : (
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Google Translate" className="w-[20px] h-[20px] object-contain drop-shadow-sm brightness-110" />
                            )}
                            <span className="hidden xl:inline tracking-wider">{t('project.translate', 'Traduir')}</span>
                        </button>

                        <button 
                            className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" 
                            onClick={() => navigate('/chats/socdepoble')}
                        >
                            <MessageCircle size={20} /><span className="hidden xl:inline tracking-wider">{t('project.comment', 'Comentar')}</span>
                        </button>

                        <button 
                            className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" 
                            onClick={() => { if(navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }) }}
                        >
                            <Share2 size={20} /><span className="hidden xl:inline tracking-wider">{t('project.share', 'Compartir')}</span>
                        </button>

                        <button 
                            className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0 bg-white text-[#4F46E5] dark:bg-[#111111] dark:text-[#F97316]"
                            aria-label={t('common.add', 'Connectar')}
                            onClick={() => navigate('/connectar')}
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span className="hidden sm:inline tracking-wider">{t('common.add', 'Connectar')}</span>
                        </button>
                    </div>

                </div>
                {/* Buscador Desplegable con 44x44px Targets */}
                {isSearchOpen && (
                    <div className="w-full bg-[var(--bg-panel)] border-b border-[var(--border-master)] p-2 z-[var(--z-nav,40)] shadow-inner animate-in slide-in-from-top-2">
                        <div className="flex max-w-2xl w-full mx-auto bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-master)] overflow-hidden items-center p-1 gap-1">
                            <Search size={20} className="text-theme-muted ml-2 shrink-0" />
                            <input 
                                type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        searchEngine.search(searchText);
                                    }
                                }}
                                placeholder="Cerca al document..."
                                className="flex-1 bg-transparent px-2 min-h-[40px] outline-none text-[var(--text-main)] w-[100px] sm:w-auto" autoFocus
                            />
                            
                            {searchEngine.matchCount > 0 && (
                                <div className="flex items-center gap-1.5 mr-1 bg-black/5 dark:bg-white/5 pr-1 py-1 pl-3 rounded-lg border border-black/5 dark:border-white/5 shrink-0">
                                    <span className="text-[13px] font-bold text-theme-muted tabular-nums whitespace-nowrap min-w-[36px] text-center">
                                        {searchEngine.currentMatchIndex + 1} / {searchEngine.matchCount}
                                    </span>
                                    <div className="flex items-center ml-1">
                                        <button onClick={() => searchEngine.prev()} className="p-1.5 min-w-[32px] min-h-[32px] hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 rounded-md transition-colors text-theme-text flex items-center justify-center touch-manipulation" aria-label="Resultat anterior">
                                            <ChevronUp size={18} strokeWidth={2.5} />
                                        </button>
                                        <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5"></div>
                                        <button onClick={() => searchEngine.next()} className="p-1.5 min-w-[32px] min-h-[32px] hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 rounded-md transition-colors text-theme-text flex items-center justify-center touch-manipulation" aria-label="Resultat següent">
                                            <ChevronDown size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => searchEngine.search(searchText)} 
                                className="min-w-[44px] min-h-[44px] px-3 font-bold text-[var(--theme-accent-primary)] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg touch-manipulation active:scale-95 shrink-0 hidden sm:block"
                            >
                                {t('project.search', 'Cercar')}
                            </button>
                            <button 
                                onClick={() => { searchEngine.clear(); setIsSearchOpen(false); }} 
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 rounded-lg touch-manipulation active:scale-95 shrink-0"
                            >
                                <X className="size-5 text-theme-text"/>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* 4. SCROLL CONTAINER NADIU VERTICAL */}
            <main 
                ref={scrollContainerRef}
                className={standAlone
                    ? "flex-1 min-h-0 w-full relative bg-[var(--bg-app)] pb-[max(env(safe-area-inset-bottom),0px)] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"
                    : "flex-1 min-h-0 w-full relative bg-[var(--bg-app)] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"}
                inert={(isActionMenuOpen || isHistoryOpen || !!mediaViewerSrc) ? true : undefined}
                style={{ scrollBehavior: 'smooth' }}
            >
                {/* 1. INVERTED TAB: PORTADA I TÍTOL */}
                <section className="w-full flex flex-col items-center justify-center bg-[var(--bg-panel)] relative z-10">
                    <div className="w-full relative z-0 group flex flex-col items-center justify-center overflow-hidden">
                       {HeroBanner}
                    </div>
                </section>

                {/* 2. CAPUCHA NARANJA FIXA */}
                <div className="sticky top-0 z-[190] w-full shrink-0 shadow-sm">
                    <UniversalCardHeader
                        item={null}
                        cardVariant="project"
                        displayTown="La Torre de les Maçanes"
                        displayAuthor="Sóc de Poble"
                        avatarSrc="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
                        avatarRole="official"
                        isOfficial={false}
                        infoText={`${APP_VERSION.replace('-CANÒNIC', '').toUpperCase()}`}
                        infoLink="/versions"
                        displayDate="15/5/2026"
                        displayTime="12:00"
                        isPageHeader={true}
                    />
                </div>

                <section className="w-full flex flex-col items-center justify-center pb-8 bg-[var(--bg-panel)] rounded-b-[2.5rem] shadow-sm mb-6 relative z-10">
                    {PagePresentationHeader}
                </section>
                
                {/* 6. CONTENIDO (EPUB / CALENDAR / KANBAN) */}
                <section id="dynamic-content-section" className="w-full flex-1 shrink-0 relative flex flex-col">
                    {ActualContent}
                </section>
                
                {/* PEU DE PÀGINA */}
                {standAlone && (
                    <section className="w-full shrink-0 flex flex-col items-center justify-center mt-0 pb-0">
                        <GlobalFooter />
                    </section>
                )}
            </main>

            {/* 7. KEBAB MENU BOTTOM SHEET (Exclusivo Móvil) */}
            {isActionMenuOpen && (
                <div className="fixed inset-0 z-[var(--z-modal,60)] flex flex-col justify-end touch-none lg:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsActionMenuOpen(false)} aria-hidden="true" />
                    <div className="relative w-full bg-[var(--bg-panel)] border-t border-[var(--border-master)] rounded-t-[2.5rem] shadow-2xl p-4 pt-3 pb-[max(env(safe-area-inset-bottom),1.5rem)] animate-in slide-in-from-bottom isolate">
                        {/* Píldora de arrastre UI */}
                        <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-6" />
                        
                        <menu className="flex flex-col gap-2 p-0 m-0">
                            <button onClick={() => { navigate('/chats/socdepoble'); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold">
                                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 dark:bg-[#4F46E5]/10 flex items-center justify-center text-[#F97316] dark:text-[#4F46E5]">
                                    <MessageCircle className="size-5 shrink-0" /> 
                                </div>
                                {t('project.comment_chat', 'Comentar al Xat')}
                            </button>
                            <button onClick={() => { if (navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold">
                                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 dark:bg-[#4F46E5]/10 flex items-center justify-center text-[#F97316] dark:text-[#4F46E5]">
                                    <Share2 className="size-5 shrink-0" />
                                </div>
                                {t('project.share_page', 'Compartir Pàgina')}
                            </button>
                            <button onClick={() => { exportService.downloadNoteAsPDF({ title: title || "Projecte", content: processedHtml }); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Book className="size-5 shrink-0 text-emerald-500" />
                                </div>
                                Descarregar E-Book
                            </button>
                            <button onClick={() => { navigate('/reader'); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Database className="size-5 shrink-0 text-emerald-500 animate-pulse" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="leading-tight">Obrir OS</span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-black">Llegir Sistema Operatiu</span>
                                </div>
                            </button>
                        </menu>
                    </div>
                </div>
            )}



            {/* 9. MEDIA VIEWER (Desmontable) */}
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
            {console.log("RENDER FLOATING INDEX IN UNIVERSAL PAGE:", scrollContainerRef.current)}
            <FloatingIndex scrollRef={scrollContainerRef} />
        </div>
    );
};

export default UniversalPage;
 
