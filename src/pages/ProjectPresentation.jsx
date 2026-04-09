import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2, Book, BookText, Plus, MessageCircle, Globe, MapPin, Search, Calendar, Sparkles, List, X, ChevronRight, History, Info, Menu, ChevronUp, ChevronDown, Database, Download } from 'lucide-react';
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
import Carousel from '../components/Carousel';


// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
import { get, set, keys, del } from 'idb-keyval';
import { useAtomicGuard } from '../hooks/useAtomicGuard';
import { MEDIA_REGISTRY } from '../data/media_registry';
import { IAIES_MUNDIALS_ARRAY } from '../config/iaiesMundialsMap';

const resolveMedia = (originalPath) => {
    if (!originalPath || originalPath.startsWith('http')) return originalPath;
    
    // Si viene del registry, buscar por nombre base. Esto arregla los links rotos por cambios de carpeta
    const filename = originalPath.split('/').pop().split('?')[0];
    const found = MEDIA_REGISTRY.media.find(m => m.filename === filename);
    return found ? found.path : originalPath;
};

const BOOK_CACHE_KEY = 'trellat_book_fallback_v5';

const fetchDefaultBookContent = async () => {
    // 1. Network-First con timeout agresivo (Trellat)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000); // 6s máx en pueblo
        
        // Anti-caché HTTP (busting parameter) para forzar lectura fresca SIEMPRE
        const res = await fetch(`/llibre-sencer.html?t=${Date.now()}`, { 
            signal: controller.signal,
            headers: { 'Accept': 'text/html', 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        });
        clearTimeout(timeout);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        
        // --- INICI PURGA ZOMBI PWA (Tabula Rasa en cambios) ---
        try {
            const cachedGenotipo = await get(BOOK_CACHE_KEY);
            if (cachedGenotipo !== text) {
                console.info('[Trellat] Cambios detectados en el Genotipo. Aplicando Tabula Rasa a cachés antiguas...');
                const allKeys = await keys();
                const keysToDelete = allKeys.filter(k => 
                    (typeof k === 'string') && 
                    ((k.startsWith('trellat_book_fallback_') && k !== BOOK_CACHE_KEY) || k.startsWith('page_'))
                );
                await Promise.all(keysToDelete.map(k => del(k)));
            }
        } catch(err) {
            console.warn('[Trellat] Error purgando cachés zombies:', err);
        }
        // --- FINAL PURGA ---

        // Guardar la versión más fresca en IndexedDB para el modo offline perpetuo
        await set(BOOK_CACHE_KEY, text);
        return text;
    } catch (e) {
        console.warn('[Trellat] Falló carga fresca desde red, intentando caché offline:', e);
        
        // 2. Fallback a IndexedDB (Offline-first de emergencia)
        if (!import.meta.env.DEV) {
            const cached = await get(BOOK_CACHE_KEY);
            if (cached) {
                console.info('[Trellat] Sirviendo libro desde IndexedDB por fallo de red.');
                return cached;
            }
        }
        
        // 3. Modos extremos sin red ni caché
        return "<h1>SÓC DE POBLE</h1><p>Mode offline extrem. No hi ha connexió ni còpia local del llibre.</p>";
    }
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

    // FAST SCRUBBER STATE (DEPRECATED)
    const scrollContainerRef = useRef(null);
    const searchEngine = useAccessibleSearch(scrollContainerRef);

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
            let cacheKey = `page_${_slug}_v2`;
            localCache = await get(cacheKey);         // En DEV ignoramos la caché local al leer para permitir Live Reload fluido de las skills del HTML
            if (!import.meta.env.DEV) {
                localCache = await get(cacheKey);
            }
            
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
                
                // FIX CRÍTICO: llibre-sencer.html es ahora el Genotip de 5MB. NO debe sobrescribir el contenido de DB si este es válido y no vacío.
                if (!content || content.includes('Aquest text és provisional')) {
                    // Extraemos solo la parte humana si tenemos que recurrir al fallback (Genotip).
                    // Para evitar parsear 5MB enteros en el cliente con DOMParser si es enorme, hacemos un split rápido:
                    if (fallback.includes('id="prefaci-humano"')) {
                        const humanPartSplit = fallback.split('<article id="prefaci-humano"')[1];
                        if (humanPartSplit) {
                            const endOfArticle = humanPartSplit.indexOf('</article>');
                            if (endOfArticle !== -1) {
                                content = '<article id="prefaci-humano"' + humanPartSplit.substring(0, endOfArticle + 10);
                            } else {
                                content = fallback;
                            }
                        } else {
                            content = fallback;
                        }
                    } else {
                        content = fallback;
                    }
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
            '/assets/avatars/iaia_comic_matriarch.png'
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
            const existingDetails = Array.from(contentDiv.querySelectorAll('details.cms-code-block'));
            existingDetails.forEach((d) => d.removeAttribute('open'));

            const preElements = Array.from(contentDiv.querySelectorAll('pre:not([data-processed])'));
            if (preElements.length === 0) return;
            
            preElements.forEach((pre) => {
                if (pre.parentNode.classList.contains('cms-code-wrapper')) return;

                pre.setAttribute('data-processed', 'true');
                
                const details = document.createElement('details');
                details.className = 'cms-code-block bg-black/5 dark:bg-[#111111] group border border-[var(--border-master)] rounded-[1.5rem] my-6 overflow-hidden shadow-[0_4px_30px_rgba(249,115,22,0.15)] transition-all';
                
                const summary = document.createElement('summary');
                summary.className = 'cursor-pointer p-4 font-bold text-sm uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-primary)]';
                
                const titleSpan = document.createElement('span');
                titleSpan.className = 'flex items-center gap-2 text-theme-text';
                titleSpan.innerHTML = '<span class="text-lg">💻</span> Format Tècnic';
                
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'flex items-center gap-2';

                const toggleSpanDesplegar = document.createElement('span');
                toggleSpanDesplegar.className = 'text-[0.65rem] uppercase tracking-wider font-bold font-mono bg-black/10 dark:bg-white/10 text-theme-text px-3 py-1.5 rounded-full group-open:hidden transition-transform active:scale-95';
                toggleSpanDesplegar.innerText = 'Desplegar';

                const toggleSpanPlegar = document.createElement('span');
                toggleSpanPlegar.className = 'text-[0.65rem] uppercase tracking-wider font-bold font-mono bg-[var(--theme-accent-primary)] text-white px-3 py-1.5 rounded-full hidden group-open:block transition-transform active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.4)]';
                toggleSpanPlegar.innerText = 'Plegar';

                const copyBtn = document.createElement('button');
                copyBtn.className = 'cms-copy-btn flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-theme-text text-[0.65rem] font-bold uppercase transition-colors hover:bg-black/10 dark:hover:bg-white/10 active:scale-95';
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Copiar
                `;

                actionsContainer.appendChild(toggleSpanDesplegar);
                actionsContainer.appendChild(toggleSpanPlegar);
                actionsContainer.appendChild(copyBtn);

                summary.appendChild(titleSpan);
                summary.appendChild(actionsContainer);
                details.appendChild(summary);
                
                const preContainer = document.createElement('div');
                preContainer.className = 'cms-code-wrapper p-4 overflow-x-auto text-sm border-t border-[var(--border-master)] bg-[#050505] text-green-400';
                
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

    const HeroBanner = useMemo(() => {
        const carouselImages = [
            resolveMedia("hero_nano_final.png"),
            resolveMedia("night_party.png"),
            resolveMedia("nano_sonambulo.png")
        ];

        return (
        <div className="relative w-full aspect-video z-0 bg-transparent min-h-[300px] border-b border-[var(--border-master)] group flex flex-col items-center justify-center overflow-visible">
            <Carousel images={carouselImages} height="100%" />
            
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
        );
    }, [canEdit, isEditing, pageId]);

    const PagePresentationHeader = useMemo(() => (
        <div className="w-full flex flex-col items-center justify-center py-12 px-6 border-b border-[var(--border-master)] bg-[var(--bg-panel)] rounded-b-3xl shadow-sm mb-8 relative group">
            <img 
                src="/assets/brand/logo_socdepoble_white_clean.png" 
                alt="Logo Sóc de Poble" 
                className="h-24 sm:h-32 w-auto mb-6 drop-shadow-md object-contain brightness-0 dark:brightness-100 opacity-90 transition-all" 
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
                    
                    {routeSlug === 'codex' && (
                        <a 
                            href="/llibre-sencer.html" 
                            download="Soc_de_Poble_Genotip.html"
                            className="mt-6 flex items-center gap-2 bg-[var(--theme-accent-primary)] text-black font-bold uppercase tracking-widest px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-all outline outline-1 outline-offset-4 outline-[var(--theme-accent-primary)]"
                        >
                            <Download size={20} />
                            Descarregar Codi Autoinstal·lable (Genotip)
                        </a>
                    )}
                </div>
            )}
        </div>
    ), [routeSlug, collaborators.length, canEdit, isEditing, title]);

    // cleanHtmlContent was moved up and merged with TOC pre-processor

    // FAST SCRUBBER HANDLING AND TOC OBSERVER
    useEffect(() => {
        if (tocElements.length === 0 || isEditing) return;

        // IntersectionObserver realment fixat i lligat al contenidor adequat:
        const scrollContainer = document.getElementById('main-content');
        if (!scrollContainer) return;

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (visible) {
                const activeItem = tocElements.find(el => el.id === visible.target.id);
                if (activeItem) {
                    setActiveHeadingId(visible.target.id);
                }
            }
        }, { 
            root: scrollContainer,
            rootMargin: "-20px 0px -70% 0px", 
            threshold: 0 
        });

        tocElements.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => { 
            observer.disconnect(); 
        };
    }, [tocElements, isEditing]);
    // Page Number Scroll Listener\n    useEffect(() => {\n        const scrollContainer = document.getElementById('main-content');\n        if (!scrollContainer) return;\n        \n        let ticking = false;\n        const handleScroll = () => {\n            if (!ticking) {\n                window.requestAnimationFrame(() => {\n                    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;\n                    if (scrollHeight > clientHeight) {\n                        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);\n                        const currentPage = Math.max(1, Math.min(totalPages, Math.round(scrollPercentage * (totalPages - 1)) + 1));\n                        if (pageNumberRef.current && pageNumberRef.current.innerText !== currentPage.toString()) {\n                            pageNumberRef.current.innerText = currentPage.toString();\n                        }\n                    }\n                    ticking = false;\n                });\n                ticking = true;\n            }\n        };\n\n        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });\n        setTimeout(handleScroll, 100);\n        \n        return () => scrollContainer.removeEventListener('scroll', handleScroll);\n    }, [totalPages, processedHtml]);
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
            <div className="w-full flex-1 flex flex-col items-center z-10 sm:px-4 pb-4 bg-white dark:bg-[#121212]">
                <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mb-0">
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
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-secondary)] uppercase mb-0 mt-6 text-center px-4 w-full">
                                {subtitle}
                            </h2>
                        )
                    )}
                </div>

                {(canEdit && isEditing) ? (
                    <div className="w-full max-w-5xl mx-auto custom-scrollbar px-4 pt-6">
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
                    <div className="flex-1 w-full max-w-4xl mx-auto custom-scrollbar mt-4 mb-16">
                        <div 
                            className="app-cms-content focus:outline-none min-h-[50vh] px-6 lg:px-10 pb-4 w-full markdown-body"
                            dangerouslySetInnerHTML={{ __html: processedHtml }}
                            onClick={(e) => {
                                if (e.target.tagName === 'IMG') {
                                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                                    setMediaViewerImages(allImagesArray);
                                    setMediaViewerSrc(e.target.src);
                                }
                                
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
            <div className="flex flex-col w-full min-h-0 isolate bg-theme-base pt-6">
                {ActualContent}
            </div>
        );
    }

    return (
        // 1. RAÍZ INDESTRUCTIBLE: 100dvh para iOS, overscroll bloqueado (El inert va en los Main/PageHeader, NO aquí, para no bloquear modals)
        <div 
            className="flex-1 h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full overflow-hidden isolate overscroll-none relative"
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
            
            {/* 4. SCROLL CONTAINER NADIU (Delegat a AppLayout sense fantasmes locals) */}
            <main 
                ref={scrollContainerRef}
                className="flex-1 w-full relative bg-white dark:bg-[#121212] pb-[max(env(safe-area-inset-bottom),1.5rem)] flex flex-col"
                inert={isTocOpen || isActionMenuOpen || isTranslationOpen || isHistoryOpen || !!mediaViewerSrc ? true : undefined}
            >

                                {/* 5. ACTION BAR: PATRÓN PRIORITY+ (Format Barra Total) */}
                <div className="sticky top-0 z-[var(--z-sticky,200)] w-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] transition-all shrink-0 touch-manipulation border-b border-black/10 dark:border-white/10">
                    <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto">
                        
                        {/* Esquerra: Tornar i Llibre */}
                        <div className="flex items-center justify-start gap-1 flex-1 min-w-0">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="flex items-center justify-center min-h-[44px] w-[44px] rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation shrink-0"
                                aria-label="Tornar arrere"
                            >
                                <ArrowLeft size={20} strokeWidth={2.5} />
                            </button>
                            
                            <button 
                                className={`flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm ${isTocOpen ? 'bg-white/20 dark:bg-black/20 opacity-100 shadow-inner' : ''}`}
                                aria-label="Obrir Índex i Pàgines"
                                onClick={() => setIsTocOpen(!isTocOpen)}
                            >
                                <Book size={20} strokeWidth={2.5} />
                                <span className="font-extrabold tracking-wide hidden sm:inline">Llibre{htmlContent ? ',' : ''}</span>
                                {htmlContent && (
                                    <span className="tabular-nums font-black tracking-widest whitespace-nowrap ml-1 opacity-90">
                                        <span ref={pageNumberRef}>1</span>/{totalPages}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Centre: Buit en aquesta configuració */}
                        <div className="flex items-center justify-center shrink-0 mx-2">
                            {/* Es pot utilitzar per posar un títol si s'escau */}
                        </div>

                        {/* Dreta: Cercar, Traduir, Comentar, etc. */}
                        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
                            <button 
                                className={`flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0 ${isSearchOpen ? 'bg-white/20 dark:bg-black/20' : ''}`}
                                aria-label="Cercar al document"
                                onClick={() => {
                                    if(isSearchOpen) { searchEngine.clear(); }
                                    setIsSearchOpen(!isSearchOpen);
                                }}
                            >
                                <Search size={20} strokeWidth={2.5} />
                                <span className="hidden xl:inline tracking-wider">Cercar</span>
                            </button>

                            <button 
                                className={`flex items-center justify-center gap-1.5 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0 ${translating ? "text-amber-300 dark:text-white animate-pulse" : ""}`}
                                aria-label="Traduir Pàgina"
                                onClick={() => setIsTranslationOpen(true)}
                                disabled={translating}
                            >
                                {translating ? (
                                    <Globe size={20} strokeWidth={2.5} className="animate-spin" />
                                ) : (
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Google Translate" className="w-[20px] h-[20px] object-contain drop-shadow-sm brightness-110" />
                                )}
                                <span className="hidden xl:inline tracking-wider">Traduir</span>
                            </button>

                            <button 
                                className="hidden sm:flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" 
                                onClick={() => navigate('/chats/socdepoble')}
                            >
                                <MessageCircle size={20} /><span className="hidden xl:inline tracking-wider">Comentar</span>
                            </button>
                            <button 
                                className="hidden sm:flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0 text-emerald-300 dark:text-emerald-700 hover:text-emerald-400" 
                                title="Genotip Sintètic: Llegir Codi Font com a Llibre"
                                onClick={() => window.location.href = '/llibre-sencer.html'}
                            >
                                <Database size={20} /><span className="hidden xl:inline tracking-wider">Genotip</span>
                            </button>
                            <button 
                                className="hidden sm:flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" 
                                onClick={() => { if(navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }) }}
                            >
                                <Share2 size={20} /><span className="hidden xl:inline tracking-wider">Compartir</span>
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
                                    Cercar
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
                            <a href="/llibre-sencer.html" download="Soc_de_Poble_Sistema_Operatiu.html" onClick={() => setIsActionMenuOpen(false)} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Database className="size-5 shrink-0 text-emerald-500 animate-pulse" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="leading-tight">Descarregar OS</span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-black">Sistema Operatiu Autoexecutable</span>
                                </div>
                            </a>
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
