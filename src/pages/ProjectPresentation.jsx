import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2, Book, Plus, MessageCircle, Globe, MapPin, Search, Calendar, Sparkles, List, X, ChevronRight, History, Info, Menu } from 'lucide-react';
import SEO from '../components/SEO';
import GlobalFooter from '../components/GlobalFooter';
import PageHeader from '../components/PageHeader';
const RichTextEditor = lazy(() => import('../components/RichTextEditor'));
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { exportService } from '../services/exportService';
import MediaViewerModal from '../components/MediaViewerModal';
const TranslationModal = lazy(() => import('../components/TranslationModal'));
const HistoryModal = lazy(() => import('../components/HistoryModal'));
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { processContentForToc } from '../utils/tocParser';
import useAccessibleSearch from '../hooks/useAccessibleSearch';
import RoundButton from '../components/ui/RoundButton';
import { useTranslation } from 'react-i18next';

// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
import { get, set } from 'idb-keyval';
import { useAtomicGuard } from '../hooks/useAtomicGuard';

// CACHE KEY estático para el libro base
const BOOK_CACHE_KEY = 'trellat_book_fallback_v4';

const fetchDefaultBookContent = async () => {
    // 1. Intentar IndexedDB primero (Trellat: Local-First)
    const cached = await get(BOOK_CACHE_KEY);
    if (cached) return cached;

    // 2. Fetch de red con timeout agresivo (rural 2G/3G)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s máx en pueblo
        
        // Anti-caché HTTP (busting parameter) para forzar lectura fresca
        const res = await fetch(`/assets/llibre-sencer.html?t=${Date.now()}`, { 
            signal: controller.signal,
            headers: { 'Accept': 'text/html', 'Cache-Control': 'no-cache' }
        });
        clearTimeout(timeout);
        
        if (res.ok) {
            const text = await res.text();
            // Guardar en IndexedDB para offline perpetuo (sin límite LRU, es crítico)
            await set(BOOK_CACHE_KEY, text);
            return text;
        }
    } catch (e) {
        console.warn('[Trellat] Fallo carga libro, modo offline sin caché previa:', e);
    }
    
    // 3. Fallback último recurso (nunca debería pasar si ya usaron la app antes)
    return "<h1>SÓC DE POBLE</h1><p>Mode offline. No hi ha còpia local del llibre encara.</p>";
};

const ProjectPresentation = ({ standAlone = true, forcedSlug = null }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, user } = useAuth();

    const [htmlContent, setHtmlContent] = useState('');
    const [pageId, setPageId] = useState(null);
    const [routeSlug, setRouteSlug] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const { t } = useTranslation();

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Trellat: Guardas atómicas
    const { atomicYSave, startCritical } = useAtomicGuard();
    const yDocRef = useRef(null);

    const canEdit = isSuperAdmin || (user && collaborators.includes(user.id));

    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    const [isTocOpen, setIsTocOpen] = useState(false);
    const [activeHeadingId, setActiveHeadingId] = useState(null);

    // OMEGA TRANSLATE STATE
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(null);

    // HISTORY STATE
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // SEARCH STATE
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    // FAST SCRUBBER STATE
    const scrollContainerRef = useRef(null);
    const searchEngine = useAccessibleSearch(scrollContainerRef);
    const scrubberRef = useRef(null);
    const scrubberBoundsRef = useRef(null);
    const scrubberRafRef = useRef(null);
    const scrubberThumbRef = useRef(null);
    const scrubberPosRef = useRef(0);
    const [scrubberDragging, setScrubberDragging] = useState(false);
    const [scrubberActiveHeading, setScrubberActiveHeading] = useState('');

    // BOOK PAGE METRICS (ZERO RE-RENDER SCROLLING)
    const pageNumberRef = useRef(null);
    const totalPages = useMemo(() => {
        if (!htmlContent) return 1;
        const textOnly = htmlContent.replace(/<[^>]*>?/gm, ' ');
        const words = textOnly.match(/\S+/g) || [];
        return Math.max(1, Math.ceil(words.length / 250)); // Amazon format (250 items/page)
    }, [htmlContent]);

    const fetchPageContent = useCallback(async (_slug) => {
        setIsLoadingPage(true);
        
        // Variable acumuladora para estados (evita setState parciales)
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
            // CACHEO AGRESIVO: Supabase con fallback local inmediato
            const cacheKey = `cms_page_${_slug}`;
            localCache = await get(cacheKey);
            
            if (localCache) {
                // Hidratar INMEDIATAMENTE desde IndexedDB (sin esperar red)
                updates.htmlContent = localCache.html;
                updates.title = localCache.title;
                updates.subtitle = localCache.subtitle;
                updates.pageId = localCache.pageId;
                updates.collaborators = localCache.collaborators || [];
                
                // Aplicar inmediatamente para lectura instantánea (Trellat: cero espera)
                setHtmlContent(updates.htmlContent);
                setTitle(updates.title);
                setSubtitle(updates.subtitle);
                setPageId(updates.pageId);
                setCollaborators(updates.collaborators);
                setIsLoadingPage(false); // Liberar UI inmediatamente
            }

            // FETCH SILENCIOSO (background revalidation)
            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', _slug)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                let content = data.html_content;
                const fallback = await fetchDefaultBookContent();
                if (!content || content.includes('Aquest text és provisional') || fallback.length > (content.length + 500)) {
                    content = fallback;
                    console.log('[Trellat] Local asset is larger than DB content. Proceeding with local asset as primary.');
                }
                
                updates.htmlContent = content;
                updates.title = data.title || '';
                updates.subtitle = data.subtitle || '';
                updates.pageId = data.id;
                updates.collaborators = data.collaborators || [];
                
                // Solo actualizar estado si hay cambios reales (evita re-render idéntico)
                if (JSON.stringify(localCache?.html) !== JSON.stringify(content)) {
                    await set(cacheKey, {
                        html: content,
                        title: updates.title,
                        subtitle: updates.subtitle,
                        pageId: updates.pageId,
                        collaborators: updates.collaborators,
                        timestamp: Date.now()
                    });
                    
                    // Actualizar estado solo si diferente al cacheado
                    setHtmlContent(updates.htmlContent);
                    setTitle(updates.title);
                    setSubtitle(updates.subtitle);
                    setPageId(updates.pageId);
                    setCollaborators(updates.collaborators);
                }
            } else {
                // No existe en Supabase, usar libro local como fallback legítimo
                const fallback = await fetchDefaultBookContent();
                updates.htmlContent = fallback;
                updates.title = "El Projecte";
                updates.subtitle = "Pròleg: La Veu del Poble";
                
                setHtmlContent(updates.htmlContent);
                setTitle(updates.title);
                setSubtitle(updates.subtitle);
            }
        } catch (err) {
            console.error('[Trellat] Error fetch:', err);
            updates.error = err;
            
            // Si no hay cacheo previo (primer visita offline), mostrar libro base
            if (!localCache) {
                const emergency = await fetchDefaultBookContent();
                setHtmlContent(emergency);
                setTitle("El Projecte (Offline)");
            }
        } finally {
            // Garantía de estado limpio: solo si no se hidrató antes del try
            if (!localCache) {
                setIsLoadingPage(false);
            }
            // Limpiamos referencias pesadas
            updates.htmlContent = null; 
        }
    }, []);
    useEffect(() => {
        let currentSlug = forcedSlug || location.pathname;
        if (!standAlone && !forcedSlug) {
            currentSlug = '/el-projecte';
        } else if (currentSlug === '/projecte' || currentSlug === '/manifest' || currentSlug === '/el-projecte') {
            currentSlug = '/el-projecte';
        }
        setRouteSlug(currentSlug);
        fetchPageContent(currentSlug);
    }, [location.pathname, standAlone, forcedSlug, fetchPageContent]);

    const activeHtmlContent = translatedContent || htmlContent;

    const baseHtmlContent = useMemo(() => {
        if (!activeHtmlContent) return '';
        // If the first tag is an H1 that contains "SÓC DE POBLE", we can assume it's the redundant one
        const stripped = activeHtmlContent.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, '');
        // HOT-FIX: Clean absolute URLs and prevent 403 GET errors from old IndexedDB/supabase drafts
        const cleanedPaths = stripped.replace(
            /(?:https?:\/\/(?:www\.)?socdepoble\.(?:org|net))?\/Users\/javillinares\/[\w/.-]+\/(media_\d+(_\d+)?\.(jpg|png|jpeg|webp|gif))/gi, 
            '/assets/avatars/comic/iaia_comic_matriarch.png'
        );
        return sanitizeHtml(cleanedPaths);
    }, [activeHtmlContent]);

    const { processedHtml, tocElements } = useMemo(() => {
        return processContentForToc(baseHtmlContent);
    }, [baseHtmlContent]);

    useEffect(() => {
        if (!processedHtml || isLoadingPage || isEditing) return;
        
        const controller = new AbortController();
        const contentDiv = document.querySelector('.app-cms-content');
        if (!contentDiv) return;

        // Delegación única en el contenedor padre, NO en cada botón
        const handleCopyClick = (e) => {
            const btn = e.target.closest('.cms-copy-btn');
            if (!btn) return;
            
            e.preventDefault();
            e.stopPropagation();
            const codeBlock = btn.closest('details')?.querySelector('pre');
            if (codeBlock) {
                const codeObj = codeBlock.querySelector('code');
                const codeText = codeObj ? codeObj.innerText : codeBlock.innerText;
                navigator.clipboard.writeText(codeText).then(() => {
                    const original = btn.innerHTML;
                    btn.innerHTML = '✅ Copiat!';
                    setTimeout(() => btn.innerHTML = original, 2000);
                });
            }
        };

        contentDiv.addEventListener('click', handleCopyClick, { signal: controller.signal });

        // Mutación DOM batcheada (reforzada con cleanup)
        const timeoutId = setTimeout(() => {
            const preElements = Array.from(contentDiv.querySelectorAll('pre:not([data-processed])'));
            if (preElements.length === 0) return;
            
            preElements.forEach((pre) => {
                if (pre.parentNode.classList.contains('cms-code-wrapper')) return;

                pre.setAttribute('data-processed', 'true');
                
                const details = document.createElement('details');
                details.className = 'cms-code-block bg-black/5 dark:bg-white/5 border border-[var(--border-master)] rounded-xl my-6 overflow-hidden';
                
                const summary = document.createElement('summary');
                summary.className = 'cursor-pointer p-4 font-bold text-sm uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors';
                
                const titleSpan = document.createElement('span');
                titleSpan.innerHTML = '<span class="mr-2">💻</span> Codi / Format Tècnic';
                
                const copyBtn = document.createElement('button');
                copyBtn.className = 'cms-copy-btn flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] text-xs font-bold uppercase transition-colors hover:bg-[var(--theme-accent-primary)] hover:text-white';
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Copiar
                `;

                summary.appendChild(titleSpan);
                summary.appendChild(copyBtn);
                details.appendChild(summary);
                
                const preContainer = document.createElement('div');
                preContainer.className = 'cms-code-wrapper p-4 overflow-x-auto text-sm border-t border-[var(--border-master)] bg-black/80 text-green-400';
                
                pre.parentNode.insertBefore(details, pre);
                preContainer.appendChild(pre);
                details.appendChild(preContainer);
            });
        }, 100); 

        return () => {
            clearTimeout(timeoutId);
            controller.abort(); 
        };
    }, [processedHtml, isLoadingPage, isEditing]);

    const handleSave = async (updatedHtml) => {
        if (!canEdit) return;
        
        // Trellat: Iniciar protección contra cierre de pestaña
        const endCritical = startCritical('save-document');
        
        setIsSaving(true);
        try {
            // 1. Guardar en Y.js (CRDT local) atómicamente si existe provider
            if (yDocRef.current && window.indexedDBProvider) {
                await atomicYSave(yDocRef.current, window.indexedDBProvider);
            }

            const payload = {
                slug: routeSlug,
                title: title || 'Pàgina Sense Títol',
                subtitle: subtitle || '',
                html_content: updatedHtml,
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

            setHtmlContent(updatedHtml);
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving CMS page", err);
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
            endCritical();
        }
    };

    const HeroBanner = useMemo(() => (
        <div className="relative w-full aspect-video z-0 bg-[#0e0e0e] min-h-[300px] border-b border-[var(--border-master)] group flex flex-col items-center justify-center overflow-hidden">
            <img 
                src="/assets/banners/hero_nano_final.png" 
                alt="Sóc de Poble Banner" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
                onClick={() => {
                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                    setMediaViewerImages([bannerSrc, ...allImagesArray]);
                    setMediaViewerSrc(bannerSrc);
                }}
            />
            
            <div className="absolute top-4 right-4 flex gap-2 z-50">
                {canEdit && (
                    <>
                        {pageId && (
                            <button 
                                onClick={() => setIsHistoryOpen(true)}
                                className="bg-black/50 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-lg hover:bg-[var(--theme-accent-primary)] hover:border-transparent transition-all hover:text-black group"
                                title="Ver Historial"
                            >
                                <History size={20} className="group-hover:animate-pulse" />
                            </button>
                        )}
                        <button 
                            onClick={() => setIsEditing(!isEditing)} 
                            className="bg-black/50 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-lg hover:bg-[var(--theme-accent-primary)] hover:border-transparent transition-all hover:text-black"
                        >
                            {isEditing ? <ArrowLeft size={20} /> : <Edit2 size={20} />}
                        </button>
                    </>
                )}
            </div>
        </div>
    ), [canEdit, isEditing, pageId]);

    const PagePresentationHeader = useMemo(() => (
        <div className="w-full flex flex-col items-center justify-center py-12 px-6 border-b border-[var(--border-master)] bg-[var(--bg-panel)] rounded-b-3xl shadow-sm mb-8 relative group">
            <img 
                src="/assets/master/logo_socdepoble_white_clean.png" 
                alt="Logo Sóc de Poble" 
                className="h-24 sm:h-32 w-auto mb-6 drop-shadow-md object-contain brightness-0 opacity-90" 
            />
            
            {(routeSlug === 'codex' || collaborators.length > 0) && (
                <div className="flex -space-x-3 mb-6 opacity-90 transition-opacity hover:opacity-100 items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-panel)] shadow-md z-20 bg-black flex items-center justify-center overflow-hidden" title="Mestre">
                        <img src="/pwa-192x192.png" alt="Mestre" className="w-full h-full object-cover" />
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
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-accent-primary)] text-center tracking-tight leading-none uppercase mb-2">
                        {title || "SENSE TÍTOL"}
                    </h1>
                </div>
            )}
        </div>
    ), [routeSlug, collaborators.length, canEdit, isEditing, title]);

    // cleanHtmlContent was moved up and merged with TOC pre-processor

    // FAST SCRUBBER HANDLING
    useEffect(() => {
        if (tocElements.length === 0 || scrubberDragging || isEditing) return;

        // L'ULL DE DÉU: Delega el càlcul a l'API nativa asíncrona
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (visible) {
                const activeItem = tocElements.find(el => el.id === visible.target.id);
                if (activeItem) {
                    setScrubberActiveHeading(activeItem.text);
                    setActiveHeadingId(visible.target.id);
                }
            }
        }, { rootMargin: "-12% 0px -85% 0px", threshold: 0 });

        tocElements.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        // Actualització passiva de la posició de la barra, sincronitzada amb els fotogrames
        const container = scrollContainerRef.current;
        let ticking = false;
        const updateScrubberBar = () => {
            if (!ticking && !scrubberDragging && container) {
                window.requestAnimationFrame(() => {
                    const scrollHeight = container.scrollHeight - container.clientHeight;
                    const percent = scrollHeight > 0 ? (container.scrollTop / scrollHeight) : 0;
                    scrubberPosRef.current = percent;
                    if (scrubberThumbRef.current) {
                        scrubberThumbRef.current.style.top = `calc(${percent * 100}% - 12px)`;
                    }
                    if (pageNumberRef.current) {
                        // Math.max guarantees page 1 min, Math.ceil gives the current page slice
                        pageNumberRef.current.textContent = Math.max(1, Math.ceil(percent * totalPages));
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        if (container) {
            container.addEventListener('scroll', updateScrubberBar, { passive: true });
        }
        return () => { 
            observer.disconnect(); 
            if (container) container.removeEventListener('scroll', updateScrubberBar); 
        };
    }, [tocElements, scrubberDragging, isEditing, totalPages]);

    const handleScrubberPointerMove = useCallback((e) => {
        if (!scrollContainerRef.current || !scrubberBoundsRef.current) return;
        
        if (scrubberRafRef.current) cancelAnimationFrame(scrubberRafRef.current);
        scrubberRafRef.current = requestAnimationFrame(() => {
            const { top, height } = scrubberBoundsRef.current;
            let percentage = (e.clientY - top) / height;
            percentage = Math.max(0, Math.min(1, percentage));
            
            
            scrubberPosRef.current = percentage;
            if (scrubberThumbRef.current) {
                scrubberThumbRef.current.style.top = `calc(${percentage * 100}% - 12px)`;
            }
            if (pageNumberRef.current) {
                pageNumberRef.current.textContent = Math.max(1, Math.ceil(percentage * totalPages));
            }
            
            const container = scrollContainerRef.current;
            container.scrollTop = percentage * (container.scrollHeight - container.clientHeight);

            if (tocElements.length > 0) {
                const index = Math.min(
                    Math.floor(percentage * tocElements.length),
                    Math.max(0, tocElements.length - 1)
                );
                const newHeading = tocElements[index].text;
                setScrubberActiveHeading(prev => prev !== newHeading ? newHeading : prev);
            }
            scrubberRafRef.current = null;
        });
    }, [tocElements, totalPages]);

    const handleScrubberPointerUp = useCallback(() => {
        setScrubberDragging(false);
        window.removeEventListener('pointermove', handleScrubberPointerMove);
        window.removeEventListener('pointerup', handleScrubberPointerUp);
        if (scrubberRafRef.current) cancelAnimationFrame(scrubberRafRef.current);
        // Restaurar transición suave al soltar
        if (scrubberThumbRef.current) {
            scrubberThumbRef.current.style.transition = 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)';
        }
    }, [handleScrubberPointerMove, setScrubberDragging]);

    const handleScrubberPointerDown = (e) => {
        e.preventDefault();
        setScrubberDragging(true);
        
        if (scrubberRef.current) {
            scrubberBoundsRef.current = scrubberRef.current.getBoundingClientRect();
        }
        
        handleScrubberPointerMove(e);
        window.addEventListener('pointermove', handleScrubberPointerMove);
        window.addEventListener('pointerup', handleScrubberPointerUp);
    };
    
    useEffect(() => {
        return () => {
            window.removeEventListener('pointermove', handleScrubberPointerMove);
            window.removeEventListener('pointerup', handleScrubberPointerUp);
        };
    }, [handleScrubberPointerMove, handleScrubberPointerUp]);

    // Auto-scroll TOC to active item
    useEffect(() => {
        if (isTocOpen && activeHeadingId) {
            const timer = setTimeout(() => {
                const activeEl = document.getElementById(`btn-toc-${activeHeadingId}`);
                if (activeEl) {
                    activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isTocOpen, activeHeadingId]);

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
                const { data, error } = await supabase.functions.invoke('translation-proxy', {
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
                if (error.name !== 'AbortError') {
                    console.error("Error connecting to Omega Translation engine:", error);
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
    } else {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col items-center z-10 -mt-2 sm:mt-0 sm:px-4 pb-4">
                {PagePresentationHeader}

                <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mt-2 mb-2">
                    {/* Crèdits i metadades extrets per a reduir l'espai i col·locat a la sidebar com va sol·licitar l'usuari */}
                </div>
                
                <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mb-0">
                    {canEdit && isEditing ? (
                        <input 
                            type="text" 
                            value={subtitle} 
                            onChange={(e) => setSubtitle(e.target.value)} 
                            className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-secondary)] uppercase bg-transparent border-b-2 border-dashed border-[var(--theme-accent-secondary)] outline-none w-full focus:bg-[var(--theme-accent-secondary)]/10 transition-colors pb-1 text-center"
                            placeholder="INTRODUEIX EL SUBTÍTOL (Introducció de l'Article)"
                        />
                    ) : (
                        subtitle && (
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-secondary)] uppercase mb-0 mt-4 text-center px-4 w-full">
                                {subtitle}
                            </h2>
                        )
                    )}
                </div>

                {/* 7. VISIÓN V15 - PLAZA INFINITA (Simulador Interactivo) - Reubicat a dalt a petició de l'usuari */}
                {(!isEditing && (routeSlug === '/el-projecte' || routeSlug === 'el-projecte' || routeSlug === '/manifest' || routeSlug === 'manifest' || routeSlug === '/codex' || routeSlug === 'codex')) && (
                    <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mb-0 mt-2">
                        <details className="cms-code-block bg-black/5 dark:bg-[#111111] border-2 border-[var(--theme-accent-primary)] rounded-[1.5rem] overflow-hidden group shadow-[0_4px_30px_rgba(249,115,22,0.15)] transition-all">
                            <summary className="cursor-pointer p-5 font-black text-[15px] uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors touch-manipulation outline-none focus-visible:ring-4 focus-visible:ring-[var(--theme-accent-primary)]">
                                <span className="flex items-center gap-3 text-[var(--theme-accent-primary)]">
                                    <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-primary)]/10 flex items-center justify-center">
                                        <Globe size={18} className="animate-pulse" /> 
                                    </div>
                                    <span className="truncate">Visión V15: La Plaza Infinita</span>
                                </span>
                                <ChevronRight size={20} strokeWidth={3} className="group-open:rotate-90 transition-transform text-[var(--theme-accent-primary)] shrink-0" />
                            </summary>
                            
                            <div className="border-t border-[var(--theme-accent-primary)]/30 bg-[#0e0e0e] w-full min-h-[600px] sm:min-h-[700px] relative">
                                <div className="absolute top-4 left-0 w-full text-center text-xs font-black text-[var(--theme-accent-primary)] uppercase tracking-widest pointer-events-none z-10 flex flex-col items-center gap-1 opacity-60">
                                    <Sparkles size={14} />
                                    <span>Topologia: Kademlia + DHT</span>
                                </div>
                                <iframe 
                                    src="/assets/simulators/v15-plaza-infinita.html?v=1.0.1" 
                                    className="w-full h-full min-h-[600px] sm:min-h-[700px] border-none z-20 relative pointer-events-auto"
                                    title="Simulador Arquitectura V15"
                                    loading="lazy"
                                />
                                
                                {/* LEYENDA Y EXPLICACIÓN MULTILINGÜE */}
                                <div className="p-4 sm:p-6 bg-gray-100 dark:bg-black/40 border-t border-[var(--theme-accent-primary)]/20 text-sm transition-colors">
                                    <h4 className="font-bold text-[var(--theme-accent-primary)] flex items-center gap-2 mb-3">
                                        <Info size={16} /> 
                                        {t('simulators.legend_title', 'Llegenda del Simulador / Simulator Legend')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-400">
                                        <div className="space-y-4">
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">{t('simulators.v14_gossip', 'Global Gossip (V14)')}</strong>
                                                <p className="text-xs">{t('simulators.v14_desc', 'L\'arquitectura V14 (Gossip) intentava connectar a cada usuari amb la resta de la comarca, provocant una saturació exponencial (Caos) que bloquejava telèfons antics i esgotava la memòria IndexedDB.')}</p>
                                            </div>
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">{t('simulators.v15_kademlia', 'Kademlia Fractal (V15)')}</strong>
                                                <p className="text-xs">{t('simulators.v15_desc', 'L\'arquitectura V15 (Kademlia Fractal) agrupa els usuaris en «placetes» de poble petites i utilitza uns pocs nodes «guaites» per connectar amb altres pobles, mantenint la pantalla totalment fluida.')}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 bg-gray-200/50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-white/5 transition-colors">
                                            <div className="flex items-start gap-2">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-0.5"></div>
                                                <span className="text-xs"><strong className="text-emerald-600 dark:text-emerald-400">{t('simulators.green_nodes', 'Punts Verds')}</strong>: {t('simulators.green_nodes_desc', 'Guaites (Nodos permanents, estables i invulnerables a iOS constraints)')}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500 shrink-0 mt-0.5"></div>
                                                <span className="text-xs"><strong className="text-indigo-600 dark:text-indigo-400">{t('simulators.blue_nodes', 'Punts Blaus')}</strong>: {t('simulators.blue_nodes_desc', 'Usuaris estàndard interactuant només a la seua placeta')}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-3 h-[2px] bg-red-500 shrink-0 mt-1.5 opacity-50"></div>
                                                <span className="text-xs"><strong className="text-red-500 dark:text-red-400">{t('simulators.red_lines', 'Línies Roges')}</strong>: {t('simulators.red_lines_desc', 'Connexions de xafardeig innecessàries i redundants')}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-3 h-[2px] bg-orange-500 border-dashed border-t border-orange-500 shrink-0 mt-1.5"></div>
                                                <span className="text-xs"><strong className="text-orange-600 dark:text-orange-400">{t('simulators.orange_lines', 'Línies Taronges')}</strong>: {t('simulators.orange_lines_desc', 'Enrutament estructurat Kademlia eficient (pocs salts)')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-white/10 text-xs text-gray-600 dark:text-gray-500 transition-colors">
                                        <p><strong>{t('simulators.main_thread_load', 'Main Thread Load')}:</strong> {t('simulators.main_thread_load_desc', 'Mesura el nivell de càrrega del navegador. Si marca "OVERLOAD", significa que Chrome/Safari s\'acabaria penjant.')}</p>
                                    </div>
                                </div>
                            </div>
                        </details>

                        {/* 8. DAFO & VISIÓN 2056 (Testamento del Trellat) */}
                        <details className="cms-code-block bg-black/5 dark:bg-[#111111] border-2 border-[var(--theme-accent-primary)] rounded-[1.5rem] overflow-hidden group shadow-[0_4px_30px_rgba(249,115,22,0.15)] transition-all">
                            <summary className="cursor-pointer p-5 font-black text-[15px] uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors touch-manipulation outline-none focus-visible:ring-4 focus-visible:ring-[var(--theme-accent-primary)]">
                                <span className="flex items-center gap-3 text-[var(--theme-accent-primary)]">
                                    <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-primary)]/10 flex items-center justify-center">
                                        <ShieldAlert size={18} className="animate-pulse" /> 
                                    </div>
                                    <span className="truncate">Visión 2056: DAFO Socio-Técnico</span>
                                </span>
                                <ChevronRight size={20} strokeWidth={3} className="group-open:rotate-90 transition-transform text-[var(--theme-accent-primary)] shrink-0" />
                            </summary>
                            
                            <div className="border-t border-[var(--theme-accent-primary)]/30 bg-gray-100 dark:bg-[#0e0e0e] p-6 sm:p-8 text-sm text-[var(--text-main)] space-y-8">
                                <div className="space-y-3">
                                    <h4 className="font-black text-lg text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Fortaleses</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><strong>Indestructibilitat Atòmica (Local-First):</strong> La font de veritat és al dispositiu. La caiguda de servidors no afecta l'operativitat.</li>
                                        <li><strong>Sobirania de Dades:</strong> IndexedDB i CRDT (Y.js) blinden el coneixement a interferències externes.</li>
                                        <li><strong>Austeritat Tècnica:</strong> Rendiment òptim en xarxes 2G/3G de Riu Sec i La Torre de les Maçanes gràcies a CompressionStream natiu i sense dependències extres.</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-black text-lg text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Debilitats</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><strong>Onboarding Complex:</strong> Dependència dels Guaites per introduir a la gent gran (baixinglading d’usuaris nous).</li>
                                        <li><strong>Quotes d’Emmagatzematge:</strong> IOS Safari pot fer purgues silencioses. Requereix manteniment constant de la sincronització.</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-black text-lg text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Oportunitats</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><strong>El Gen Universal:</strong> Possibilitat de desplegar una instància autònoma a qualsevol comunitat, exportant el "Trellat".</li>
                                        <li><strong>Xarxes en Malla (Kademlia):</strong> Substitució del cloud de pagament per dispositius interconnectats (cost marginal 0).</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-black text-lg text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Amenaces</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><strong>Assimilació Corporativa:</strong> Ecosistemes tancats intentant asfixiar l'operativitat PWA de la comarca.</li>
                                        <li><strong>Obsolescència d'API Web:</strong> Navegadors retirant APIs essencials (previngut pel 'Runtime Abstraction').</li>
                                    </ul>
                                </div>
                            </div>
                        </details>

                        <details className="cms-code-block bg-black/5 dark:bg-[#111111] border-2 border-[var(--theme-accent-primary)] rounded-[1.5rem] overflow-hidden group shadow-[0_4px_30px_rgba(249,115,22,0.15)] transition-all">
                            <summary className="cursor-pointer p-5 font-black text-[15px] uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors touch-manipulation outline-none focus-visible:ring-4 focus-visible:ring-[var(--theme-accent-primary)]">
                                <span className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                        <History size={18} /> 
                                    </div>
                                    <span className="truncate">El Testament del Trellat (2056)</span>
                                </span>
                                <ChevronRight size={20} strokeWidth={3} className="group-open:rotate-90 transition-transform text-indigo-600 dark:text-indigo-400 shrink-0" />
                            </summary>
                            
                            <div className="border-t border-[var(--theme-accent-primary)]/30 bg-gray-100 dark:bg-[#0e0e0e] p-6 sm:p-8 space-y-6 text-sm text-[var(--text-main)] italic">
                                <p className="font-bold border-l-4 border-indigo-500 pl-4 py-1 text-gray-900 dark:text-white">"No hi haurà més codi. No hi haurà més pedaços. Només la mirada retrospectiva des de l'any 2056, tres dècades després de la sembra del Gen Universal."</p>
                                
                                <div className="space-y-4 pt-4 text-gray-700 dark:text-gray-300">
                                    <p><strong className="text-gray-900 dark:text-white">1. L'Algoritme Fòssil:</strong> L'esquema trellat.schema.json va esdevenir metadades santes mentre React i els vells frameworks morien. Els CRDT van sobreviure com a manuscrits als dispositius mòbils rurals.</p>
                                    <p><strong className="text-gray-900 dark:text-white">2. Cultura Descentralitzada:</strong> Centenars de pobles es van independitzar digitalment. Xarxes Kademlia en onades verdes van mantindre viu Sóc de Poble a cost 0. Els mòbils de les iaies són ara nodes fonamentals.</p>
                                    <p><strong className="text-gray-900 dark:text-white">3. Resiliència Absoluta:</strong> Quan el món depenia de servidors centralitzats, els nostres masos seguien vius. Compressió al vol sense dependències va ser la salvació en les èpoques menys connectades.</p>
                                </div>
                                
                                <p className="font-bold text-center mt-8 pt-8 border-t border-[var(--border-master)] text-xl text-[var(--theme-accent-primary)] tracking-widest uppercase">
                                    SÓC DE POBLE ÉS ARA UN VERB.
                                </p>
                            </div>
                        </details>
                    </div>
                )}

                {(canEdit && isEditing) ? (
                    <div className="w-full max-w-5xl mx-auto custom-scrollbar px-4">
                        <Suspense fallback={<div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Carregant editor...</div>}>
                            <RichTextEditor 
                                content={baseHtmlContent} 
                                onChange={setHtmlContent} 
                                onSave={handleSave} 
                                isSaving={isSaving}
                                editable={true}
                            />
                        </Suspense>
                    </div>
                ) : (
                    <div className="flex-1 w-full max-w-4xl mx-auto custom-scrollbar">
                        <div 
                            className="app-cms-content focus:outline-none min-h-[50vh] px-6 lg:px-10 pb-4 w-full"
                            dangerouslySetInnerHTML={{ __html: processedHtml }}
                            onClick={(e) => {
                                if (e.target.tagName === 'IMG') {
                                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                                    const combinedImages = [bannerSrc, ...allImagesArray];
                                    
                                    setMediaViewerImages(combinedImages);
                                    setMediaViewerSrc(e.target.src);
                                }
                                
                                // Intercept anchor links locally (Event Delegation)
                                const anchor = e.target.closest('a[href^="#"]');
                                if (anchor) {
                                    e.preventDefault();
                                    let targetId = anchor.getAttribute('href').substring(1);
                                    try { targetId = decodeURIComponent(targetId); } catch (e) { console.warn(e); }
                                    
                                    let targetEl = document.getElementById(targetId);
                                    if (!targetEl) {
                                        const fallbackSlug = targetId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                        targetEl = document.getElementById(fallbackSlug) || document.querySelector(`[id^="${fallbackSlug}-"]`) || document.querySelector(`[id^="${targetId}-"]`);
                                    }
                                    
                                    if (targetEl) {
                                        targetEl.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    if (!standAlone) {
        return (
            <div className="flex flex-col w-full min-h-0 isolate">
                {HeroBanner}
                {ActualContent}
            </div>
        );
    }

    return (
        // 1. RAÍZ INDESTRUCTIBLE: 100dvh para iOS, overscroll bloqueado (El inert va en los Main/PageHeader, NO aquí, para no bloquear modals)
        <div 
            className="flex-1 h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full overflow-hidden isolate overscroll-none"
        >
            {/* 2. MUERTE AL DOM ZOMBI (Desmontaje Estricto de Modales) */}
            {isTranslationOpen && (
                <Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[var(--z-modal,500)]"><div className="w-8 h-8 rounded-full border-4 border-white/20 border-[var(--theme-accent-primary)] animate-spin"></div></div>}>
                    <TranslationModal isOpen={true} onClose={() => setIsTranslationOpen(false)} config={{ postId: routeSlug || 'projecte', title: title }} />
                </Suspense>
            )}

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
            
            <SEO title={title || "El Projecte"} description="Connectant l'Espanya Buidada..." url={routeSlug} />
            
            {/* 3. PROTECCIÓN SUPERIOR (NOTCH) */}
            <div 
                className="pt-[max(env(safe-area-inset-top),0px)] shrink-0 z-[var(--z-nav,40)] bg-[var(--bg-app)]"
                inert={isTocOpen || isActionMenuOpen || isTranslationOpen || isHistoryOpen || !!mediaViewerSrc ? true : undefined}
            >
                <PageHeader title={title || "EL PROJECTE"} onBack={() => navigate(-1)} />
            </div>
            
            {/* 4. SCROLL CONTAINER (Rubber-band neutralizado, Bottom Safe-Area asegurado) */}
            <main 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overscroll-y-contain custom-scrollbar relative min-h-0 pb-[max(env(safe-area-inset-bottom),1.5rem)]"
                inert={isTocOpen || isActionMenuOpen || isTranslationOpen || isHistoryOpen || !!mediaViewerSrc ? true : undefined}
            >
                {HeroBanner}

                {/* UNIVERSAL CARD META (Táctil protegido, Focus habilitado) */}
                <div 
                    onClick={() => navigate('/el-projecte')} 
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/el-projecte')}
                    className="w-full bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white px-4 py-3 min-h-[72px] flex flex-col sm:flex-row sm:items-center justify-between shadow-md relative z-[var(--z-base,0)] gap-3 border-b border-black/10 transition-colors cursor-pointer touch-manipulation hover:opacity-[0.98] active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-black outline-none"
                    role="button"
                    tabIndex={0}
                    aria-label="Obrir presentació de l'autor Sóc de Poble"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center -space-x-3 shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111111] border-2 border-[#F97316] dark:border-[#4F46E5] flex items-center justify-center shadow-inner relative z-20">
                                <img src="/assets/master/logo_socdepoble_green_square.png" alt="Sóc de Poble" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=SP&background=0e0e0e&color=F97316"; }} />
                            </div>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111111] border-2 border-[#F97316] dark:border-[#4F46E5] flex items-center justify-center shadow-inner relative z-10">
                                <img src="/assets/avatars/comic/iaia_comic_matriarch.png" alt="IAIA Maria" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-[18px] font-black tracking-wide m-0 flex items-center gap-1.5 truncate">
                                Sóc de Poble i la IAIA Maria
                                <Sparkles size={14} className="text-[#111111] dark:text-[#F97316] shrink-0" fill="currentColor"/>
                            </h3>
                            <div className="flex items-center flex-wrap gap-2 text-[14px] text-[#111111]/80 dark:text-white/80 font-bold mt-0.5">
                                <span className="flex items-center gap-1 truncate"><MapPin size={12} className="shrink-0"/> La Torre de les Maçanes</span>
                                <span className="text-[#111111]/50 dark:text-white/80">•</span>
                                <span className="flex items-center gap-1 shrink-0"><Calendar size={12} className="shrink-0"/> {new Date().toLocaleDateString('ca-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ACTION BAR: PATRÓN PRIORITY+ (Erradicado el Scroll Horizontal) */}
                <div className="sticky top-0 z-[var(--z-sticky,200)] w-full shadow-md bg-[#4F46E5]/95 dark:bg-[#F97316]/95 backdrop-blur-md transition-colors shrink-0 touch-manipulation">
                    <div className="flex items-center justify-center min-h-[56px] px-2 sm:px-4">
                        
                        {/* Secundarias: Adaptativas */}
                        <div className="flex items-center justify-center gap-1 shrink-0 text-white dark:text-[#111111]">
                            <button 
                                className={`flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm ${isSearchOpen ? 'bg-white/20 dark:bg-black/20' : ''}`}
                                aria-label="Cercar al document"
                                onClick={() => {
                                    if(isSearchOpen) { searchEngine.clear(); }
                                    setIsSearchOpen(!isSearchOpen);
                                }}
                            >
                                <Search size={20} strokeWidth={2.5} />
                                <span className="hidden sm:inline">Cercar</span>
                            </button>

                            {/* LLIBRE / ÍNDEX WITH PAGE NUMBER */}
                            <button 
                                className={`flex items-center justify-center gap-1.5 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm ${isTocOpen ? 'bg-white/20 dark:bg-black/20 text-[var(--theme-accent-primary)]' : ''}`}
                                aria-label="Obrir Índex i Pàgines"
                                onClick={() => setIsTocOpen(!isTocOpen)}
                            >
                                <Book size={20} strokeWidth={2.5} />
                                <span className="hidden sm:inline">Llibre{htmlContent ? ',' : ''}</span>
                                {htmlContent && (
                                    <span className="tabular-nums font-bold tracking-widest whitespace-nowrap">
                                        <span ref={pageNumberRef}>1</span>/{totalPages}
                                    </span>
                                )}
                            </button>

                            <button 
                                className={`flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm ${translating ? "text-amber-300 dark:text-white animate-pulse" : ""}`}
                                aria-label="Traduir Pàgina"
                                onClick={() => setIsTranslationOpen(true)}
                                disabled={translating}
                            >
                                <Globe size={20} strokeWidth={2.5} className={translating ? "animate-spin" : ""} />
                                <span className="hidden lg:inline">Traduir</span>
                            </button>

                            <button 
                                className="hidden sm:flex items-center justify-center gap-2 min-h-[44px] px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm" 
                                onClick={() => navigate('/chats/socdepoble')}
                            >
                                <MessageCircle size={20} /><span className="hidden lg:inline">Comentar</span>
                            </button>
                            <button 
                                className="hidden sm:flex items-center justify-center gap-2 min-h-[44px] px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm" 
                                onClick={() => { if(navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }) }}
                            >
                                <Share2 size={20} /><span className="hidden lg:inline">Compartir</span>
                            </button>

                        </div>

                    </div>

                    {/* Buscador Desplegable con 44x44px Targets */}
                    {isSearchOpen && (
                        <div className="w-full bg-[var(--bg-panel)] border-b border-[var(--border-master)] p-2 z-[var(--z-nav,40)] shadow-inner animate-in slide-in-from-top-2">
                            <div className="flex max-w-xl w-full mx-auto bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-master)] overflow-hidden items-center p-1 gap-1">
                                <Search size={20} className="text-theme-muted ml-2 shrink-0" />
                                <input 
                                    type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            searchEngine.search(searchText);
                                        }
                                    }}
                                    placeholder="Cerca al document..."
                                    className="flex-1 bg-transparent px-2 min-h-[40px] outline-none text-[var(--text-main)]" autoFocus
                                />
                                <button
                                    onClick={() => searchEngine.search(searchText)} 
                                    className="min-w-[44px] min-h-[44px] px-3 font-bold text-[var(--theme-accent-primary)] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg touch-manipulation active:scale-95"
                                >
                                    Cercar
                                </button>
                                <button 
                                    onClick={() => { searchEngine.clear(); setIsSearchOpen(false); }} 
                                    className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 rounded-lg touch-manipulation active:scale-95"
                                >
                                    <X className="size-5 text-theme-text"/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* 6. CONTENIDO */}
                {ActualContent}
                
                {standAlone && <GlobalFooter />}
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
                                Comentar al Xat
                            </button>
                            <button onClick={() => { if (navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold">
                                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 dark:bg-[#4F46E5]/10 flex items-center justify-center text-[#F97316] dark:text-[#4F46E5]">
                                    <Share2 className="size-5 shrink-0" />
                                </div>
                                Compartir Pàgina
                            </button>
                            <button onClick={() => { exportService.downloadNoteAsPDF({ title: title || "Projecte", content: baseHtmlContent }); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Book className="size-5 shrink-0 text-emerald-500" />
                                </div>
                                Descarregar E-Book
                            </button>
                        </menu>
                    </div>
                </div>
            )}

            {/* 8. ÍNDICE TOC & FAST SCRUBBER */}
            {tocElements.length > 0 && !isEditing && (
                <>
                    {/* Botón flotante blindado sobre safe-areas nav */}
                    <button 
                        onClick={() => setIsTocOpen(!isTocOpen)} 
                        className="fixed right-4 sm:right-6 lg:right-10 z-[var(--z-modal,60)] w-14 h-14 bg-[var(--theme-accent-primary)] text-white rounded-full shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform touch-manipulation"
                        style={{ bottom: 'max(calc(env(safe-area-inset-bottom) + 80px), 80px)' }}
                        aria-label={isTocOpen ? "Tancar índex" : "Obrir Índex"}
                    >
                        {isTocOpen ? <X className="size-6" /> : <List className="size-6" />}
                    </button>

                    {/* Panel TOC purificado */}
                    {isTocOpen && (
                        <div 
                            role="dialog" aria-modal="true"
                            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[var(--bg-panel)] z-[var(--z-modal,60)] shadow-2xl flex flex-col pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)] border-l border-[var(--border-master)] animate-in slide-in-from-right duration-300 isolate"
                        >
                            <div className="px-6 py-4 border-b border-[var(--border-master)] flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="font-black text-xl uppercase tracking-wider text-[var(--theme-accent-primary)] m-0 flex items-center gap-2"><List size={20}/> ÍNDEX</h3>
                                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Navegació Ràpida</p>
                                </div>
                                <button onClick={() => setIsTocOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 touch-manipulation transition-colors text-theme-text">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-3 py-2 overscroll-contain custom-scrollbar leading-none">
                                
                                <div className="mx-3 mt-3 mb-5 p-4 rounded-[14px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col gap-2 shrink-0">
                                    <h4 className="font-black text-[13px] text-theme-text flex items-center gap-1.5 uppercase mb-1">
                                        <Book size={14} className="text-[var(--theme-accent-primary)]" />
                                        Mida del Llibre Físic
                                    </h4>
                                    <div className="flex justify-between items-center text-[12px] font-bold">
                                        <span className="text-[var(--text-muted)] uppercase tracking-wider">Format A4</span>
                                        <span className="text-theme-text px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full">{Math.max(1, Math.ceil(totalPages / 2))} pàgines</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px] font-bold">
                                        <span className="text-[var(--text-muted)] uppercase tracking-wider">Llibre 6x9 (Amazon)</span>
                                        <span className="text-[var(--theme-accent-primary)] px-2 py-0.5 bg-[var(--theme-accent-primary)]/10 rounded-full">{totalPages} pàgines</span>
                                    </div>
                                </div>

                                {tocElements.map((item) => (
                                    <button
                                        key={item.id}
                                        id={`btn-toc-${item.id}`}
                                        onClick={() => {
                                            const el = document.getElementById(item.id);
                                            const scrollContainer = document.getElementById('main-content') || scrollContainerRef.current;
                                            if (el && scrollContainer) {
                                                const headerOffset = window.innerWidth >= 640 ? 140 : 180;
                                                const topDiff = el.getBoundingClientRect().top - headerOffset;
                                                scrollContainer.scrollBy({ top: topDiff, behavior: 'smooth' });
                                                setTimeout(() => setIsTocOpen(false), 300);
                                            }
                                        }}
                                        className={`w-full text-left py-3.5 px-3 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 group touch-manipulation focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-primary)] ${
                                            activeHeadingId === item.id ? 'bg-[var(--theme-accent-primary)]/20 shadow-[inset_4px_0_0_var(--theme-accent-primary)] text-[var(--theme-accent-primary)] font-bold' : ''
                                        } ${item.level === 'h3' ? 'pl-8 text-[13px] opacity-80' : 'font-black text-[15px] pt-4 first:pt-3.5'}`}
                                    >
                                        <ChevronRight size={14} strokeWidth={4} className={`transition-opacity shrink-0 ${activeHeadingId === item.id ? 'opacity-100 text-[var(--theme-accent-primary)]' : 'opacity-0 text-[var(--theme-accent-primary)] group-hover:opacity-100'}`} />
                                        <span className="truncate leading-tight text-theme-text">{item.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Backdrop del TOC */}
                    {isTocOpen && (
                        <div className="fixed inset-0 bg-black/60 z-[var(--z-overlay,50)] backdrop-blur-sm animate-in fade-in duration-300 touch-none" onClick={() => setIsTocOpen(false)} aria-hidden="true" />
                    )}
                    
                    {/* Fast Scrubber: Separado del borde (right-2) para esquivar el Swipe-Back de iOS */}
                    <div 
                        ref={scrubberRef}
                        className="fixed right-1 sm:right-2 top-[20%] bottom-[20%] w-12 sm:w-16 z-[var(--z-nav,40)] cursor-ns-resize touch-none flex justify-end p-2 isolate"
                        onPointerDown={handleScrubberPointerDown}
                        style={{ userSelect: 'none', touchAction: 'none' }}
                        aria-hidden="true" 
                    >
                        <div className="h-full w-2 bg-black/10 dark:bg-white/5 rounded-full relative shadow-inner ml-auto pointer-events-none">
                            {/* Punter Escalable */}
                            <div 
                                ref={scrubberThumbRef}
                                className="absolute right-0 w-2 bg-[var(--theme-accent-primary)] rounded-full transition-all duration-75 origin-center shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
                                style={{ 
                                    height: '24px', 
                                    top: `calc(${scrubberPosRef.current * 100}% - 12px)`,
                                    transform: scrubberDragging ? 'scaleX(2.5) scaleY(1.5)' : 'scaleX(1)'
                                }}
                            />

                            {/* Bafarada amb el Títol */}
                            <div 
                                className={`absolute right-5 whitespace-nowrap bg-[var(--theme-accent-primary)] text-white font-black uppercase tracking-wider text-xs sm:text-sm py-2 px-4 rounded-xl shadow-2xl pointer-events-none transition-all duration-100 flex items-center ${scrubberDragging ? 'opacity-100' : 'opacity-0'}`}
                                style={{ 
                                    top: `calc(${scrubberPosRef.current * 100}%)`,
                                    transform: `translateY(-50%) ${scrubberDragging ? 'translateX(0)' : 'translateX(10px)'}`
                                }}
                            >
                                {scrubberActiveHeading || "Inici"}
                                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-[var(--theme-accent-primary)] rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </>
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
        </div>
    );
};;

export default ProjectPresentation;
