import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const RichTextEditor = lazy(() => import('../../components/ui/RichTextEditor'));
import { useAuth } from '../../app/context/AuthContext';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../app/context/ModalContext';
const HistoryModal = lazy(() => import('../../components/modals/HistoryModal'));
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import useAccessibleSearch from '../../hooks/useAccessibleSearch';

import LazyHtmlRenderer from '../../components/ui/LazyHtmlRenderer';
import UniversalShell from '../../components/universal/UniversalShell';
import { createPageViewModel } from '../../factories/PageViewModelFactory';
// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
import { get, set } from 'idb-keyval';
import { useAtomicGuard } from '../../hooks/useAtomicGuard';
import { MEDIA_REGISTRY } from '../../data/media_registry';
import { VERSIONS_HTML } from '../../data/VersionsContent';
import { SKILLS_HTML, DESIGN_HTML } from '../../data/SkillsContent';
import { IAIES_MUNDIALS_HTML } from '../../data/IaiesMundialsContent';
import { HUMAN_PROJECT_HTML } from '../../data/HumanProjectContent';
import { CONSTITUCIO_HTML } from '../../data/ConstitucioContent';
import ContentWithShortcodes from '../../components/core/ContentWithShortcodes';
import { MOCK_FEED } from '../../data';

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
    customActions = null,
    forcedHeroImage = null,
    children
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const { isSuperAdmin, user } = useAuth();
    const { openTranslationModal } = useModal();

    const [htmlContent, setHtmlContent] = useState('');
    const [pageId, setPageId] = useState(null);
    const [routeSlug, setRouteSlug] = useState('');
    const [title, setTitle] = useState(forcedTitle || '');
    const [subtitle, setSubtitle] = useState(forcedSubtitle || '');
    const [collaborators, setCollaborators] = useState([]);
    const [pageAuthor, setPageAuthor] = useState('');

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isIndexOpen, setIsIndexOpen] = useState(false);
    const [isIndexPinned, setIsIndexPinned] = useState(false);
    
    // Trellat: Guardas atómicas
    const { atomicYSave, startCritical } = useAtomicGuard();
    const yDocRef = useRef(null);

    const [customComponentPath, setCustomComponentPath] = useState(null);
    const canEdit = isSuperAdmin || (user && collaborators.includes(user.id));

    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    // VISTA DE RENDER (Document/Calendari/Kanban)
    const [currentViewMode, setViewMode] = useState(defaultViewMode);

    // FORMATO HERO DEL PROYECTO
    const [heroFormat, setHeroFormat] = useState('square');
    const [heroPosition, setHeroPosition] = useState('center');
    const [heroImage, setHeroImage] = useState('');
    const [logoLight, setLogoLight] = useState(() => {
        const _s = slug || window.location.pathname.replace(/^\/+/, '');
        return ['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'ruta'].includes(_s) ? '/assets/system/ui/logo-socdepoble-rect-negre.svg' : '';
    });
    const [logoDark, setLogoDark] = useState(() => {
        const _s = slug || window.location.pathname.replace(/^\/+/, '');
        return ['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'ruta'].includes(_s) ? '/assets/system/ui/logo-socdepoble-rect-blanc.svg' : '';
    });

    // OMEGA TRANSLATE STATE
    const [translating, setTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(null);

    const pageItem = useMemo(() => {
        return MOCK_FEED?.find(item => item.slug === routeSlug || item.slug === slug || item.id === `post-socdepoble-${routeSlug}`);
    }, [routeSlug, slug]);

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

    // SCROLL TO TOP LISTENER (Throttled per evitar Layout Thrashing)
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setShowScrollTop(el.scrollTop > 300);
                    ticking = false;
                });
                ticking = true;
            }
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
                updates.pageAuthor = localCache.pageAuthor || '';
                if (localCache.logoLight) setLogoLight(localCache.logoLight);
                if (localCache.logoDark) setLogoDark(localCache.logoDark);
                
                // RESTORE HERO PROPERTIES OR FALLBACK TO HARDCODED
                const isHardcoded = ['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'ruta', 'constitucio', 'disseny'].includes(_slug);
                
                if (localCache.heroImage !== undefined && localCache.heroImage !== null) {
                    setHeroImage(localCache.heroImage);
                } else if (isHardcoded) {
                    let tempContent = '';
                    if (_slug === 'skills') tempContent = SKILLS_HTML;
                    else if (_slug === 'versions') tempContent = VERSIONS_HTML;
                    else if (_slug === 'iaies-mundials') tempContent = IAIES_MUNDIALS_HTML;
                    else if (_slug === 'disseny') tempContent = DESIGN_HTML;
                    else if (_slug === 'el-projecte' || _slug === 'projecte') tempContent = HUMAN_PROJECT_HTML;
                    else if (_slug === 'constitucio') tempContent = CONSTITUCIO_HTML;
                    
                    if (tempContent) {
                        const imageMatch = tempContent.match(/<!-- HERO_IMAGE: (.*?) -->\n?/);
                        if (imageMatch && imageMatch[1]) setHeroImage(imageMatch[1].trim());
                    }
                }
                
                if (localCache.heroFormat) {
                    setHeroFormat(localCache.heroFormat);
                } else if (isHardcoded) {
                    let tempContent = '';
                    if (_slug === 'skills') tempContent = SKILLS_HTML;
                    else if (_slug === 'versions') tempContent = VERSIONS_HTML;
                    else if (_slug === 'iaies-mundials') tempContent = IAIES_MUNDIALS_HTML;
                    else if (_slug === 'disseny') tempContent = DESIGN_HTML;
                    else if (_slug === 'el-projecte' || _slug === 'projecte') tempContent = HUMAN_PROJECT_HTML;
                    else if (_slug === 'constitucio') tempContent = CONSTITUCIO_HTML;
                    
                    if (tempContent) {
                        const formatMatch = tempContent.match(/<!-- HERO_FORMAT: (.*?) -->\n?/);
                        if (formatMatch && formatMatch[1]) setHeroFormat(formatMatch[1]);
                        else setHeroFormat(['projecte', 'el-projecte'].includes(_slug) ? 'square' : 'horizontal');
                    }
                }
                
                if (localCache.heroPosition) setHeroPosition(localCache.heroPosition);
                
                setHtmlContent(updates.htmlContent);
                setTitle(updates.title);
                setSubtitle(updates.subtitle);
                setPageId(updates.pageId);
                setCollaborators(updates.collaborators);
                setIsLoadingPage(false);
            }
            
            // OPTIMITZACIÓ EXTREMA LCP/FCP: Evitar bloqueig de Supabase per a plantilles hardcoded en incògnit o buides
            const isHardcoded = ['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'ruta', 'constitucio', 'disseny'].includes(_slug);
            if (!localCache && isHardcoded) {
                let tempContent = '';
                if (_slug === 'skills') { tempContent = SKILLS_HTML; updates.title = "Skills"; updates.subtitle = "Com pensem? Tot el que em fa ser qui sóc"; }
                else if (_slug === 'versions') { tempContent = VERSIONS_HTML; updates.title = "Versions del Sistema"; updates.subtitle = "Historial d'actualitzacions i memòria tècnica"; }
                else if (_slug === 'iaies-mundials') { tempContent = IAIES_MUNDIALS_HTML; updates.title = "Iaies Mundials"; updates.subtitle = "Conexions globals"; }
                else if (_slug === 'disseny') { tempContent = DESIGN_HTML; updates.title = "Disseny"; updates.subtitle = "Com construïm la Masia?"; }
                else if (_slug === 'el-projecte' || _slug === 'projecte') { tempContent = HUMAN_PROJECT_HTML; updates.title = "El Projecte"; updates.subtitle = "Per què existim? (Projecte Documental Transmèdia)"; }
                else if (_slug === 'constitucio') { tempContent = CONSTITUCIO_HTML; updates.title = "Constitució"; updates.subtitle = "Quines lleis no podem trencar?"; }
                
                if (tempContent) {
                    const formatMatch = tempContent.match(/<!-- HERO_FORMAT: (.*?) -->\n?/);
                    setHeroFormat(formatMatch && formatMatch[1] ? formatMatch[1] : (['projecte', 'el-projecte'].includes(_slug) ? 'square' : 'horizontal'));
                    
                    const positionMatch = tempContent.match(/<!-- HERO_POSITION: (.*?) -->\n?/);
                    if (positionMatch && positionMatch[1]) setHeroPosition(positionMatch[1]);
                    
                    const imageMatch = tempContent.match(/<!-- HERO_IMAGE: (.*?) -->\n?/);
                    if (imageMatch && imageMatch[1]) setHeroImage(imageMatch[1]);
                    
                    setHtmlContent(tempContent);
                    setTitle(updates.title);
                    setSubtitle(updates.subtitle);
                    setIsLoadingPage(false); // Allibera el render del LoadingSpinner IM-ME-DIA-TA-MENT
                }
            }

            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', _slug)
                .maybeSingle();

            if (error) throw error;

            if (data || ['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'ruta', 'constitucio', 'disseny'].includes(_slug)) {
                let content = data?.html_content || '';
                
                if (['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'constitucio', 'disseny'].includes(_slug)) {
                    if (_slug === 'skills') {
                        content = SKILLS_HTML;
                        updates.title = "Skills";
                        updates.subtitle = "Com pensem? Tot el que em fa ser qui sóc";
                    } else if (_slug === 'versions') {
                        content = VERSIONS_HTML;
                        updates.title = "Versions del Sistema";
                        updates.subtitle = "Historial d'actualitzacions i memòria tècnica";
                    } else if (_slug === 'iaies-mundials') {
                        content = IAIES_MUNDIALS_HTML;
                        updates.title = "Iaies Mundials";
                        updates.subtitle = "Conexions globals";
                    } else if (_slug === 'disseny') {
                        content = DESIGN_HTML;
                        updates.title = "Disseny";
                        updates.subtitle = "Com construïm la Masia?";
                    } else if (_slug === 'el-projecte' || _slug === 'projecte') {
                        content = HUMAN_PROJECT_HTML;
                    } else if (_slug === 'constitucio') {
                        content = CONSTITUCIO_HTML;
                    } 
                    if (_slug === 'el-projecte' || _slug === 'projecte') {
                        updates.title = "El Projecte";
                        updates.subtitle = "Per què existim? (Projecte Documental Transmèdia)";
                    } else if (_slug === 'constitucio') {
                        updates.title = "Constitució";
                        updates.subtitle = "Quines lleis no podem trencar?";
                    }
                }
                
                const formatMatch = content.match(/<!-- HERO_FORMAT: (.*?) -->\n?/);
                const extractedFormat = formatMatch && formatMatch[1] ? formatMatch[1] : (['projecte', 'el-projecte'].includes(_slug) ? 'square' : 'horizontal');
                if (formatMatch && formatMatch[1]) {
                    setHeroFormat(extractedFormat);
                    content = content.replace(formatMatch[0], '');
                } else {
                    setHeroFormat(extractedFormat);
                }
                const positionMatch = content.match(/<!-- HERO_POSITION: (.*?) -->\n?/);
                const extractedPosition = positionMatch && positionMatch[1] ? positionMatch[1] : 'center';
                if (positionMatch && positionMatch[1]) {
                    setHeroPosition(extractedPosition);
                    content = content.replace(positionMatch[0], '');
                }
                const imageMatch = content.match(/<!-- HERO_IMAGE: (.*?) -->\n?/);
                const extractedImage = imageMatch && imageMatch[1] ? imageMatch[1].trim() : null;
                if (imageMatch && imageMatch[1]) {
                    setHeroImage(extractedImage);
                    content = content.replace(imageMatch[0], '');
                }
                const isSocDePobleAuthor = data?.author === 'Sóc de Poble' || data?.author_name === 'Sóc de Poble' || ['skills', 'versions', 'iaies-mundials', 'projecte', 'el-projecte', 'ruta', 'constitucio', 'disseny'].includes(_slug);
                updates.pageAuthor = isSocDePobleAuthor ? 'Sóc de Poble' : (data?.author || data?.author_name || '');

                const logoLightMatch = content.match(/<!-- LOGO_LIGHT: (.*?) -->\n?/);
                let parsedLogoLight = logoLightMatch ? logoLightMatch[1]?.trim() : null;
                if (parsedLogoLight === 'null' || parsedLogoLight === 'undefined' || parsedLogoLight === '') parsedLogoLight = null;
                
                if (parsedLogoLight) {
                    setLogoLight(parsedLogoLight);
                    content = content.replace(logoLightMatch[0], '');
                } else {
                    setLogoLight(isSocDePobleAuthor ? '/assets/system/ui/logo-socdepoble-rect-negre.svg' : '');
                }

                const logoDarkMatch = content.match(/<!-- LOGO_DARK: (.*?) -->\n?/);
                let parsedLogoDark = logoDarkMatch ? logoDarkMatch[1]?.trim() : null;
                if (parsedLogoDark === 'null' || parsedLogoDark === 'undefined' || parsedLogoDark === '') parsedLogoDark = null;

                if (parsedLogoDark) {
                    setLogoDark(parsedLogoDark);
                    content = content.replace(logoDarkMatch[0], '');
                } else {
                    setLogoDark(isSocDePobleAuthor ? '/assets/system/ui/logo-socdepoble-rect-blanc.svg' : '');
                }

                if (import.meta.env.DEV) {
                    console.log("[DEBUG LOGO FETCH]", {
                        slug: _slug,
                        isSocDePobleAuthor,
                        parsedLogoLight,
                        parsedLogoDark,
                        logoLightSetTo: parsedLogoLight || (isSocDePobleAuthor ? '/assets/system/ui/logo-socdepoble-rect-negre.svg' : ''),
                        logoDarkSetTo: parsedLogoDark || (isSocDePobleAuthor ? '/assets/system/ui/logo-socdepoble-rect-blanc.svg' : '')
                    });
                }

                updates.htmlContent = content;
                updates.title = updates.title || data?.title || '';
                updates.subtitle = updates.subtitle || data?.subtitle || '';
                updates.pageId = data?.id;
                updates.collaborators = data?.collaborators || [];
                
                if (JSON.stringify(localCache?.html) !== JSON.stringify(content) || localCache?.subtitle !== updates.subtitle || localCache?.title !== updates.title || localCache?.heroImage !== extractedImage) {
                    await set(cacheKey, {
                        html: content,
                        title: updates.title,
                        subtitle: updates.subtitle,
                        pageId: updates.pageId,
                        collaborators: updates.collaborators,
                        pageAuthor: updates.pageAuthor,
                        logoLight: updates.logoLight || parsedLogoLight || (isSocDePobleAuthor ? '/assets/system/ui/logo-socdepoble-rect-negre.svg' : ''),
                        logoDark: updates.logoDark || parsedLogoDark || (isSocDePobleAuthor ? '/assets/system/ui/logo-socdepoble-rect-blanc.svg' : ''),
                        heroImage: extractedImage,
                        heroFormat: extractedFormat,
                        heroPosition: extractedPosition,
                        timestamp: Date.now()
                    });
                }
                
                // ALWAYS update React state to ensure missing subtitles (or title changes) are reflected immediately
                setHtmlContent(updates.htmlContent);
                setTitle(updates.title);
                setSubtitle(updates.subtitle);
                setPageId(updates.pageId);
                setCollaborators(updates.collaborators);
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

    const hasChildrenWrapper = !!children;
    const hasForcedHtmlWrapper = !!forcedHtml;

    useEffect(() => {
        // Prevent fetching if we are just wrapping children or forcedHtml
        if (hasChildrenWrapper || hasForcedHtmlWrapper) {
            setIsLoadingPage(false);
            return;
        }
        
        let currentSlug = slug || location.pathname;
        const normalizedSlug = currentSlug.replace(/^\/+/, '');
        setRouteSlug(normalizedSlug);
        fetchPageContent(normalizedSlug);
    }, [location.pathname, slug, fetchPageContent, hasChildrenWrapper, hasForcedHtmlWrapper]);


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
        if ((!processedHtml && !hasChildrenWrapper) || isLoadingPage || isEditing) return;
        
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
    }, [processedHtml, isLoadingPage, isEditing, t, navigate, hasChildrenWrapper]);


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

    const PagePresentationHeader = null; // Moved to UniversalView

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
                            className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-primary)] uppercase bg-transparent border-b-2 border-dashed border-[var(--theme-accent-primary)] outline-none w-full focus:bg-[var(--theme-accent-primary)]/10 transition-colors pb-1 text-center mt-6"
                            placeholder="INTRODUEIX EL SUBTÍTOL (Introducció de l'Article)"
                        />
                    ) : (
                        subtitle && (
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-primary)] uppercase mb-0 mt-6 text-center px-4 w-full break-words">
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
                    <div className="app-cms-content w-full flex-1 min-h-0 relative flex flex-col items-center max-w-4xl mx-auto px-4 sm:px-10 lg:px-12 pb-12">
                        {children ? (
                            children
                        ) : activeHtmlContent && activeHtmlContent.includes('[TABS_START]') ? (
                            <ContentWithShortcodes content={processedHtml} />
                        ) : (
                            <LazyHtmlRenderer htmlContent={processedHtml} className="w-full h-full" />
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

    const viewModel = useMemo(() => createPageViewModel({
        standAlone,
        pageId,
        routeSlug,
        pageItem,
        title,
        subtitle,
        heroImage,
        forcedHeroImage,
        forcedImages,
        heroFormat,
        heroPosition,
        logoLight,
        logoDark,
        collaborators,
        customActions,
        renderKanban,
        renderCalendar,
        currentViewMode,
        mediaViewerSrc,
        mediaViewerImages,
        isLoadingPage,
        isEditing,
        canEdit,
        translatedContent,
        htmlContent,
        user
    }), [
        standAlone, pageId, routeSlug, pageItem, title, subtitle, heroImage, forcedHeroImage, forcedImages, heroFormat, heroPosition, logoLight, logoDark, collaborators, customActions, renderKanban, renderCalendar, currentViewMode, mediaViewerSrc, mediaViewerImages, isLoadingPage, isEditing, canEdit, translatedContent, htmlContent, user
    ]);

    const handlers = useMemo(() => ({
        // ESTRUCTURA AGRUPADA (Requerida per UniversalShell.jsx)
        ui: {
            isIndexOpen,
            isIndexPinned,
            toggleIndex: () => setIsIndexOpen(prev => !prev),
            togglePin: () => setIsIndexPinned(prev => !prev)
        },
        media: {
            openViewer: setMediaViewerSrc,
            closeViewer: () => { setMediaViewerSrc(null); setMediaViewerImages([]); },
            navigate: setMediaViewerSrc
        },
        refs: {
            scrollContainerRef
        },
        history: {
            isOpen: isHistoryOpen,
            close: () => setIsHistoryOpen(false),
            restore: (restoredHtml, restoredTitle, restoredSubtitle) => {
                setHtmlContent(restoredHtml);
                setTranslatedContent(null);
                setTitle(restoredTitle);
                setSubtitle(restoredSubtitle);
                setIsEditing(true);
            }
        },
        
        // ESTRUCTURA PLANA COMPATIBLE (Legacy)
        setIsHistoryOpen,
        onRestoreHistory: (restoredHtml, restoredTitle, restoredSubtitle) => {
            setHtmlContent(restoredHtml);
            setTranslatedContent(null);
            setTitle(restoredTitle);
            setSubtitle(restoredSubtitle);
            setIsEditing(true);
        },
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
    }), [isIndexOpen, isIndexPinned, isHistoryOpen]);

    return (
        <UniversalShell 
            viewModel={viewModel}
            handlers={handlers}
        >
            {ActualContent}
        </UniversalShell>
    );
};

export default UniversalPage;
 
