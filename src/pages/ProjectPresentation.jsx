import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2, Book, Plus, MessageCircle, Globe, MapPin, Calendar, Sparkles, List, X, ChevronRight, History } from 'lucide-react';
import SEO from '../components/SEO';
import GlobalFooter from '../components/GlobalFooter';
import PageHeader from '../components/PageHeader';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { exportService } from '../services/exportService';
import MediaViewerModal from '../components/MediaViewerModal';
import TranslationModal from '../components/TranslationModal';
import HistoryModal from '../components/HistoryModal';
import { sanitizeHtml } from '../utils/sanitizeHtml';

// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
let CachedBookContent = null;

const fetchDefaultBookContent = async () => {
    if (CachedBookContent) return CachedBookContent;
    try {
        const res = await fetch('/assets/llibre-sencer.html');
        if (res.ok) {
            CachedBookContent = await res.text();
            return CachedBookContent;
        }
    } catch (e) {
        console.error("Error fetching default book:", e);
    }
    return "<h1>SÓC DE POBLE (Versió Reduïda)</h1><p>No s'ha pogut carregar el llibre sencer.</p>";
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

    const canEdit = isSuperAdmin || (user && collaborators.includes(user.id));

    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    const [tocElements, setTocElements] = useState([]);
    const [isTocOpen, setIsTocOpen] = useState(false);

    // OMEGA TRANSLATE STATE
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(null);

    // HISTORY STATE
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // FAST SCRUBBER STATE
    const scrollContainerRef = useRef(null);
    const scrubberRef = useRef(null);
    const [scrubberDragging, setScrubberDragging] = useState(false);
    const [scrubberActiveHeading, setScrubberActiveHeading] = useState('');
    const [scrubberPos, setScrubberPos] = useState(0);

    const loadFallbackContent = async (fallbackTitle) => {
        const content = await fetchDefaultBookContent();
        setHtmlContent(content);
        setTitle(fallbackTitle);
        // Special case for the main fallback
        if (fallbackTitle === "El Projecte") {
            setSubtitle("Pròleg: La Veu del Poble");
        }
    };

    const fetchPageContent = useCallback(async (_slug) => {
        setIsLoadingPage(true);
        try {
            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', _slug)
                .maybeSingle();

            if (error) {
                // Silenced for production console cleanliness
                await loadFallbackContent("El Projecte");
            } else if (!data) {
                // If there's no data in Supabase yet, use fallback
                await loadFallbackContent("El Projecte");
            } else {
                setPageId(data.id);
                if (!data.html_content || data.html_content.includes('Aquest text és provisional')) {
                    const fallbackHtml = await fetchDefaultBookContent();
                    setHtmlContent(fallbackHtml);
                } else {
                    setHtmlContent(data.html_content);
                }
                setTitle(data.title || '');
                setSubtitle(data.subtitle || '');
                setCollaborators(data.collaborators || []);
            }
        } catch (error) {
            console.error('Critical error fetching page:', error);
            await loadFallbackContent("El Projecte");
        } finally {
            setIsLoadingPage(false);
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

    useEffect(() => {
        let cleanupFunctions = [];
        if (htmlContent && !isLoadingPage && !isEditing) {
            const timeoutId = setTimeout(() => {
                const contentDiv = document.querySelector('.app-cms-content');
                if (contentDiv) {
                    const headings = Array.from(contentDiv.querySelectorAll('h2, h3'));
                    const toc = headings.map((heading, index) => {
                        const id = heading.id || `heading-${index}`;
                        heading.id = id;
                        return {
                            id,
                            text: heading.innerText,
                            level: heading.tagName ? heading.tagName.toLowerCase() : 'h2'
                        };
                    });
                    setTocElements(toc);

                    // 2. Enhance code blocks (Collapsible + Copy Button)
                    const preElements = Array.from(contentDiv.querySelectorAll('pre'));
                    preElements.forEach((pre) => {
                        // Prevent double wrapping if re-rendered
                        if (pre.parentNode.classList.contains('cms-code-wrapper')) return;

                        // Create details container
                        const details = document.createElement('details');
                        details.className = 'cms-code-block bg-black/5 dark:bg-white/5 border border-[var(--border-master)] rounded-xl my-6 overflow-hidden';
                        
                        // Create summary (the clickable header)
                        const summary = document.createElement('summary');
                        summary.className = 'cursor-pointer p-4 font-bold text-sm uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors';
                        
                        const titleSpan = document.createElement('span');
                        titleSpan.innerHTML = '<span class="mr-2">💻</span> Codi / Format Tècnic';
                        
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] text-xs font-bold uppercase transition-colors hover:bg-[var(--theme-accent-primary)] hover:text-white';
                        copyBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            Copiar
                        `;
                        const handleCopy = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const codeObj = pre.querySelector('code');
                            const codeText = codeObj ? codeObj.innerText : pre.innerText;
                            window.navigator.clipboard.writeText(codeText);
                            const originalHTML = copyBtn.innerHTML;
                            copyBtn.innerHTML = '✅ Copiat!';
                            setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
                        };
                        
                        copyBtn.addEventListener('click', handleCopy);
                        cleanupFunctions.push(() => copyBtn.removeEventListener('click', handleCopy));

                        summary.appendChild(titleSpan);
                        summary.appendChild(copyBtn);
                        details.appendChild(summary);
                        
                        // Container for the pre code
                        const preContainer = document.createElement('div');
                        preContainer.className = 'cms-code-wrapper p-4 overflow-x-auto text-sm border-t border-[var(--border-master)] bg-black/80 text-green-400';
                        
                        // Insert standard before pre
                        pre.parentNode.insertBefore(details, pre);
                        preContainer.appendChild(pre);
                        details.appendChild(preContainer);
                    });
                }
            }, 500);
            return () => {
                clearTimeout(timeoutId);
                cleanupFunctions.forEach(fn => fn());
            };
        }
    }, [htmlContent, isLoadingPage, isEditing]);

    const handleSave = async (updatedHtml) => {
        if (!canEdit) return;
        setIsSaving(true);
        try {
            const payload = {
                slug: routeSlug,
                title: title || 'Pàgina Sense Títol',
                subtitle: subtitle || '',
                html_content: updatedHtml,
                published_at: new Date().toISOString()
            };

            if (pageId) {
                await supabase.from('cms_pages').update(payload).eq('id', pageId);
            } else {
                const { data } = await supabase.from('cms_pages').insert([payload]).select().single();
                if (data) setPageId(data.id);
            }
            // Mantenim l'html sense l'H1 redundant, perquè el cleanHtmlContent s'ha desat.
            setHtmlContent(updatedHtml);
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving CMS page", err);
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const HeroBanner = (
        <div className="relative w-full aspect-video z-0 bg-[#0e0e0e] min-h-[300px] border-b border-[var(--border-master)] group flex flex-col items-center justify-center overflow-hidden">
            {/* Preparat per a suportar qualsevol media (Imatge o Vídeo) en el futur */}
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
                                title="Ver Historial de Cambios / Conformidad"
                            >
                                <History size={20} className="group-hover:animate-pulse" />
                            </button>
                        )}
                        <button 
                            onClick={() => setIsEditing(!isEditing)} 
                            className="bg-black/50 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-lg hover:bg-[var(--theme-accent-primary)] hover:border-transparent transition-all hover:text-black"
                            title={isEditing ? "Tancar edició" : "Editar Pàgina (Génesis)"}
                        >
                            {isEditing ? <ArrowLeft size={20} /> : <Edit2 size={20} />}
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    const PagePresentationHeader = (
        <div className="w-full flex flex-col items-center justify-center py-12 px-6 border-b border-[var(--border-master)] bg-[var(--bg-panel)] rounded-b-3xl shadow-sm mb-8 relative group">
            <img 
                src="/assets/master/logo_socdepoble_white_clean.png" 
                alt="Logo Sóc de Poble" 
                className="h-24 sm:h-32 w-auto mb-6 drop-shadow-md object-contain dark:brightness-100 brightness-0 opacity-90" 
            />
            
            {(routeSlug === 'codex' || collaborators.length > 0) && (
                <div className="flex -space-x-3 mb-6 opacity-90 transition-opacity hover:opacity-100 items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-panel)] shadow-md z-20 bg-black flex items-center justify-center overflow-hidden" title="Mestre">
                        <img src="/pwa-192x192.png" alt="Mestre" className="w-full h-full object-cover" />
                    </div>
                    {/* Simulamos la Co-Autoría constante en los manifiestos, o dinámicamente si los colaboradores superan 1*/}
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
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-accent-primary)] text-center tracking-tight leading-none uppercase bg-transparent border-b-2 border-dashed border-[var(--theme-accent-primary)] outline-none w-full focus:bg-[var(--theme-accent-primary)]/10 transition-colors pb-2"
                        placeholder="INTRODUEIX EL TÍTOL (H1)"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-2 mb-0 font-bold uppercase tracking-wider text-center">Títol Principal Metadades.</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-accent-primary)] text-center tracking-tight leading-none uppercase mb-2">
                        {title || "SENSE TÍTOL"}
                    </h1>
                </div>
            )}
        </div>
    );

    // Strip redundant H1 if it matches the title or simply strip the first H1 if it's the exact same text
    const activeHtmlContent = translatedContent || htmlContent;

    const cleanHtmlContent = useMemo(() => {
        if (!activeHtmlContent) return '';
        // If the first tag is an H1 that contains "SÓC DE POBLE", we can assume it's the redundant one
        const stripped = activeHtmlContent.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, '');
        return sanitizeHtml(stripped);
    }, [activeHtmlContent]);

    // FAST SCRUBBER HANDLING
    useEffect(() => {
        if (tocElements.length === 0 || scrubberDragging || isEditing) return;

        // L'ULL DE DÉU: Delega el càlcul a l'API nativa asíncrona
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.find(e => e.isIntersecting);
            if (visible) {
                const activeItem = tocElements.find(el => el.id === visible.target.id);
                if (activeItem) setScrubberActiveHeading(activeItem.text);
            }
        }, { rootMargin: "-10% 0px -80% 0px" });

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
                    setScrubberPos(scrollHeight > 0 ? (container.scrollTop / scrollHeight) : 0);
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
    }, [tocElements, scrubberDragging, isEditing]);

    const handleScrubberPointerMove = useCallback((e) => {
        if (!scrubberRef.current || !scrollContainerRef.current) return;
        
        const trackBounds = scrubberRef.current.getBoundingClientRect();
        let percentage = (e.clientY - trackBounds.top) / trackBounds.height;
        percentage = Math.max(0, Math.min(1, percentage));
        
        setScrubberPos(percentage);
        
        const container = scrollContainerRef.current;
        container.scrollTop = percentage * (container.scrollHeight - container.clientHeight);

        if (tocElements.length > 0) {
            const index = Math.min(
                Math.floor(percentage * tocElements.length),
                Math.max(0, tocElements.length - 1)
            );
            setScrubberActiveHeading(tocElements[index].text);
        }
    }, [tocElements]);

    const handleScrubberPointerUp = useCallback(() => {
        setScrubberDragging(false);
        window.removeEventListener('pointermove', handleScrubberPointerMove);
        window.removeEventListener('pointerup', handleScrubberPointerUp);
    }, [handleScrubberPointerMove]);

    const handleScrubberPointerDown = (e) => {
        e.preventDefault();
        setScrubberDragging(true);
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

    // OMEGA TRANSLATE EFFECT
    useEffect(() => {
        const controller = new AbortController();

        const handleTranslateRequest = async (e) => {
            const { postId, targetLang } = e.detail;
            if (postId !== routeSlug && postId !== 'projecte') return;

            setTranslating(true);
            try {
                const actualUrl = window.location.hostname === 'localhost' 
                    ? 'http://localhost:8080/marketingBrain' 
                    : 'https://europe-west1-socdepoble.cloudfunctions.net/marketingBrain';

                const response = await fetch(actualUrl, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (import.meta.env.VITE_API_SECRET || 'socdepoble_secret_placeholder') 
                    },
                    body: JSON.stringify({
                        campaignType: 'omega_translate_ondemand',
                        htmlContent: htmlContent, // Siempre traducimos desde la fuente original
                        targetLang: targetLang
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        setTranslatedContent(data.translatedHtml);
                    }
                } else {
                    console.error("Translation failed:", await response.text());
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error connecting to Omega Translation engine:", error);
                }
            } finally {
                setTranslating(false);
            }
        };

        window.addEventListener('omega-translate-request', handleTranslateRequest);
        return () => {
            window.removeEventListener('omega-translate-request', handleTranslateRequest);
            controller.abort();
        };
    }, [htmlContent, routeSlug]);

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
            <div className="w-full flex-1 flex flex-col items-center z-10 -mt-2 sm:mt-0 sm:px-4 pb-10">
                {PagePresentationHeader}
                
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
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-accent-secondary)] uppercase mb-0 mt-8 text-center px-4 w-full">
                                {subtitle}
                            </h2>
                        )
                    )}
                </div>

                {(canEdit && isEditing) ? (
                    <div className="w-full max-w-5xl mx-auto custom-scrollbar px-4">
                        <RichTextEditor 
                            content={cleanHtmlContent} 
                            onChange={setHtmlContent} 
                            onSave={handleSave} 
                            isSaving={isSaving}
                            editable={true}
                        />
                    </div>
                ) : (
                    <div className="flex-1 w-full max-w-4xl mx-auto custom-scrollbar">
                        <div 
                            className="app-cms-content focus:outline-none min-h-[60vh] px-6 lg:px-10 pb-6 lg:pb-10 w-full"
                            dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
                            onClick={(e) => {
                                if (e.target.tagName === 'IMG') {
                                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                                    const combinedImages = [bannerSrc, ...allImagesArray];
                                    
                                    setMediaViewerImages(combinedImages);
                                    setMediaViewerSrc(e.target.src);
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
            <>
                {HeroBanner}
                {ActualContent}
            </>
        );
    }

    return (
        <div className="flex-1 h-full min-h-0 bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full overflow-hidden">
            <TranslationModal 
                isOpen={isTranslationOpen} 
                onClose={() => setIsTranslationOpen(false)} 
                config={{ postId: routeSlug || 'projecte', title: title }} 
            />

            <HistoryModal 
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                pageId={pageId}
                onRestore={(restoredHtml, restoredTitle, restoredSubtitle) => {
                    setHtmlContent(restoredHtml);
                    setTranslatedContent(null); // Clear translation on restore
                    setTitle(restoredTitle);
                    setSubtitle(restoredSubtitle);
                    setIsEditing(true); // Force edit mode so they see what they restored and must click "Save"
                }}
            />
            
            <SEO
                title={title || "El Projecte"}
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda."
                url={routeSlug}
            />
            <PageHeader 
                title={title || "EL PROJECTE"} 
                onBack={() => navigate(-1)} 
            />
            
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto custom-scrollbar relative min-h-0"
            >
                {/* 2. MEDIA (Hero / Banner) */}
                {HeroBanner}

                {/* 1. UNIVERSAL CARD META (Autor i Dades) */}
                <div 
                    onClick={() => navigate('/el-projecte')} 
                    className="w-full bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white px-4 py-2 min-h-[64px] flex flex-col sm:flex-row sm:items-center justify-between shadow-md relative z-10 gap-3 border-b border-black/10 dark:border-white/10 transition-colors cursor-pointer hover:opacity-[0.98] active:scale-[0.99]"
                    role="button"
                    tabIndex={0}
                    title="Obrir presentació de l'autor"
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

                {/* BARRA D'INTERACCIONS (Sticky action bar M3 Nivel Dios) */}
                <div className="sticky top-0 z-[2000] flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 shadow-sm overflow-x-auto no-scrollbar transition-colors">
                    <button 
                        onClick={() => navigate('/hub')}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-[#F97316] text-white dark:bg-[#4F46E5] dark:text-white px-4 py-1.5 font-sans text-xs font-bold tracking-wide transition-opacity active:scale-95 touch-manipulation whitespace-nowrap shrink-0 shadow-md"
                        aria-label="Connectar"
                    >
                        <Plus size={14} className="drop-shadow-sm" strokeWidth={3} />
                        <span className="truncate uppercase">CONNECTAR</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-extrabold uppercase tracking-widest shrink-0">
                        <button 
                            className={`flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0 ${translating ? "text-[#ff6d23] dark:text-white animate-pulse" : ""}`}
                            title="Traduir Pàgina"
                            onClick={() => setIsTranslationOpen(true)}
                            disabled={translating}
                        >
                            <Globe size={16} strokeWidth={2.5} className={translating ? "animate-spin" : ""} />
                            <span className="hidden sm:inline">{translating ? "TRADUINT..." : "TRADUIR"}</span>
                        </button>

                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                            title="Comentar al Xat"
                            onClick={() => navigate('/chats/socdepoble')}
                        >
                            <MessageCircle size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">COMENTAR</span>
                        </button>
                        
                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                            title="Compartir aquesta pàgina"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: 'Sóc de Poble', text: 'Descobreix la Xarxa Rural de Pobles Connectats', url: window.location.href });
                                }
                            }}
                        >
                            <Share2 size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">COMPARTIR</span>
                        </button>

                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0 hidden sm:flex"
                            title="Descarregar E-Book per Imprimir en PDF"
                            onClick={() => {
                                exportService.downloadNoteAsPDF({
                                    title: title || "Documents Sóc de Poble",
                                    content: cleanHtmlContent,
                                    updatedAt: new Date().toISOString()
                                });
                            }}
                        >
                            <Book  size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">E-BOOK</span>
                        </button>
                    </div>
                </div>
                
                {/* 3. CONTINGUT (Títols i Text de la Pàgina) */}
                {ActualContent}
                
                {standAlone && <GlobalFooter />}
            </div>
            
            {tocElements.length > 0 && !isEditing && (
                <>
                    <button 
                        onClick={() => setIsTocOpen(!isTocOpen)} 
                        className="fixed bottom-[100px] right-4 sm:right-6 lg:right-10 z-[3000] w-14 h-14 bg-[var(--theme-accent-primary)] text-white rounded-full shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isTocOpen ? <X size={24} /> : <List size={24} />}
                    </button>

                    {isTocOpen && (
                        <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[var(--bg-panel)] z-[2900] shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col pt-[80px] pb-4 border-l border-[var(--border-master)] animate-in slide-in-from-right duration-300 custom-scrollbar overflow-y-auto">
                            <div className="px-6 pb-4 border-b border-[var(--border-master)] mb-4">
                                <h3 className="font-black text-xl uppercase tracking-wider text-[var(--theme-accent-primary)] m-0">ÍNDEX</h3>
                                <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Navegació Ràpida (E-Pub)</p>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 min-h-0">
                                {tocElements.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            const el = document.getElementById(item.id);
                                            if (el) {
                                                const scrollParent = document.querySelector('.custom-scrollbar');
                                                if (scrollParent) {
                                                    const headerOffset = 150;
                                                    const elementPosition = el.getBoundingClientRect().top;
                                                    const offsetPosition = elementPosition + scrollParent.scrollTop - headerOffset;
                                                    scrollParent.scrollTo({
                                                        top: offsetPosition,
                                                        behavior: "smooth"
                                                    });
                                                } else {
                                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                                setIsTocOpen(false);
                                            }
                                        }}
                                        className={`w-full text-left py-3 px-3 rounded-[12px] hover:bg-white/5 transition-colors flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-primary)] ${item.level === 'h3' ? 'pl-8 text-[13px] opacity-80' : 'font-black text-[14px]'}`}
                                    >
                                        <ChevronRight size={14} className="text-[var(--theme-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        <span className="truncate leading-tight">{item.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {isTocOpen && (
                        <div 
                            className="fixed inset-0 bg-black/60 z-[2800] backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setIsTocOpen(false)}
                        />
                    )}
                </>
            )}

            {/* FAST SCRUBBER NADIU (Google Photos Timeline Style) */}
            {tocElements.length > 0 && !isEditing && (
                <div 
                    ref={scrubberRef}
                    className="fixed right-0 top-[25%] bottom-[25%] w-8 sm:w-16 z-[2500] cursor-ns-resize touch-none justify-end p-2 flex"
                    onPointerDown={handleScrubberPointerDown}
                    style={{ userSelect: 'none' }}
                >
                    <div className="h-full w-2 bg-black/5 dark:bg-white/5 rounded-full relative shadow-inner ml-auto">
                        {/* Punter Escalable */}
                        <div 
                            className="absolute right-0 w-2 bg-[var(--theme-accent-primary)] rounded-full transition-all duration-75 origin-center shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
                            style={{ 
                                height: '24px', 
                                top: `calc(${scrubberPos * 100}% - 12px)`,
                                transform: scrubberDragging ? 'scaleX(2.5) scaleY(1.5)' : 'scaleX(1)'
                            }}
                        ></div>

                        {/* Bafarada amb el Títol (Desvinculada de l'escala del punter) */}
                        <div 
                            className={`absolute right-5 whitespace-nowrap bg-[var(--theme-accent-primary)] text-white font-black uppercase tracking-wider text-xs sm:text-sm py-2 px-4 rounded-xl shadow-2xl pointer-events-none transition-all duration-100 ${scrubberDragging ? 'opacity-100' : 'opacity-0'}`}
                            style={{ 
                                top: `calc(${scrubberPos * 100}%)`,
                                transform: `translateY(-50%) ${scrubberDragging ? 'translateX(0)' : 'translateX(10px)'}`
                            }}
                        >
                            {scrubberActiveHeading || "Inici"}
                            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-[var(--theme-accent-primary)] rotate-45"></div>
                        </div>
                    </div>
                </div>
            )}

            <MediaViewerModal 
                isOpen={!!mediaViewerSrc} 
                onClose={() => {
                    setMediaViewerSrc(null);
                    setMediaViewerImages([]);
                }} 
                src={mediaViewerSrc} 
                images={mediaViewerImages}
                onNavigate={(newSrc) => setMediaViewerSrc(newSrc)}
                title={title || "Sóc de Poble Visuals"} 
            />
        </div>
    );
};

export default ProjectPresentation;
