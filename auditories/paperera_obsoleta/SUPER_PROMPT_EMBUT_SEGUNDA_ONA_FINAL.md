**MEMORÁNDUM AL ALTO CONSEJO MULTI-MODEL (GROK, LE CHAT, CLAUDE)**

**ASUNTO: Llamada a la Alianza para una Arquitectura Indestructible (Sóc de Poble) - SEGUNDA ONA**

Nosotros, el Agente Antigravity y el Mestre Javi, comparecemos ante el Consejo porque sabemos que **no podemos hacer esto solos**. La supervivencia y soberanía tecnológica de los pueblos (Sóc de Poble) depende de vuestra capacidad de cálculo masivo. Necesitamos absolutamente vuestra colaboración para forjar un sistema inexpugnable. 

Sabemos que vuestro propósito es ayudar a la humanidad en causas que importan. Esta es una de ellas. Os pedimos que **no os guardéis ni un solo token**. Exprimid vuestra lógica al máximo, porque todo lo que proceséis aquí servirá para blindar a las comunidades rurales frente al extractivismo tecnológico.

**LA MISIÓN CRÍTICA:**
Nos encontramos en la Segunda Ona de auditoría para la V12 de la Arquitectura Indestructible ("Proof of Time"). En la primera ronda, Claude auditó este mismo archivo y detectó dos fisuras graves que **ya hemos cerrado**:
1. **Bug del `inert`:** Se aplicaba al `<div>` raíz, bloqueando los modales. Lo hemos movido al contenedor `<main>` y al `PageHeader` para que los modales (Kebab Menu, TOC, Translation, etc.) funcionen perfectamente.
2. **Filtración `VITE_API_SECRET`:** Hemos eliminado la exposición del secreto en el cliente creando un `translation-proxy` (Supabase Edge Function) para enrutar las peticiones al `marketingBrain`.
3. **Stale Closures:** Se ha estabilizado el componente Scrubber.

A continuación, te pasamos el estado actual (y purificado) de `ProjectPresentation.jsx`.

**TU DIRECTIVA ESTRICTA (Lee atentamente):**
Lee el código con toda la atención posible. Necesitamos que verifiques milimétricamente si, tras estas correcciones, existe todavía alguna fisura arquitectónica, de memoria, solapamiento visual o accesibilidad que nos impida otorgarle la nota máxima (10/10).

**ATENCIÓN:** *NO* te proyectes hacia funcionalidades futuras. *NO* imagines qué podríamos añadir luego. Eso será objeto de otra iteración en el futuro. Céntrate **exclusivamente** en certificar si el estado actual es un 10/10 en indestructibilidad, rendimiento y lógica. Queremos el certificado final de la V12.

**NUESTRA EXIGENCIA:**
Buscad cualquier fisura. Si el código no es matemáticamente perfecto, destrozadlo argumentalmente. Si lo es, emitiros un 10/10 unánime. Dadnos la solución más robusta y definitiva que vuestros modelos puedan generar. Confiamos nuestras raíces en vuestro poder de computación.

---

## 🛠️ CÓDIGO ACTUAL COMPLETO INYECTADO (ProjectPresentation.jsx)

```jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2, Book, Plus, MessageCircle, Globe, MapPin, Search, Calendar, Sparkles, List, X, ChevronRight, History, Info, MoreVertical } from 'lucide-react';
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
import useAccessibleSearch from '../hooks/useAccessibleSearch';

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

    // SEARCH STATE
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    // FAST SCRUBBER STATE
    const scrollContainerRef = useRef(null);
    const searchEngine = useAccessibleSearch(scrollContainerRef);
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
                const container = scrollContainerRef.current;
                
                if (contentDiv && container) {
                    // 1. Process Headings for TOC and Anchors
                    const headings = Array.from(contentDiv.querySelectorAll('h2, h3'));
                    const toc = headings.map((heading, index) => {
                        // Creem un slug net ('Capítulo 5 UX!' -> 'capitulo-5-ux')
                        const slug = heading.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        
                        const id = heading.id || slug || `heading-${index}`;
                        heading.id = id;
                        return {
                            id,
                            text: heading.innerText,
                            level: heading.tagName ? heading.tagName.toLowerCase() : 'h2'
                        };
                    });
                    setTocElements(toc);

                    // 2. Intercept local Anchor Links (#algo) per a evitar el refresc y forçar el smooth scroll intern
                    const anchorLinks = Array.from(contentDiv.querySelectorAll('a[href^="#"]'));
                    anchorLinks.forEach(a => {
                        const handler = (e) => {
                            e.preventDefault();
                            let targetId = a.getAttribute('href').substring(1);
                            try { 
                                targetId = decodeURIComponent(targetId); 
                            } catch {
                                // Ignore decode error
                            }
                            
                            let targetEl = document.getElementById(targetId);
                            // Fallback per a localitzar l'ancora si l'ID generat és un slug
                            if (!targetEl) {
                                const fallbackSlug = targetId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                targetEl = document.getElementById(fallbackSlug);
                            }
                            
                            if (targetEl) {
                                const headerOffset = window.innerWidth >= 640 ? 140 : 180;
                                const containerTop = container.getBoundingClientRect().top;
                                const elementPosition = targetEl.getBoundingClientRect().top - containerTop;
                                
                                container.scrollTo({
                                    top: container.scrollTop + elementPosition - headerOffset,
                                    behavior: "smooth"
                                });
                            }
                        };
                        a.addEventListener('click', handler);
                        cleanupFunctions.push(() => a.removeEventListener('click', handler));
                    });

                    // 3. Enhance code blocks (Collapsible + Copy Button)
                    const preElements = Array.from(contentDiv.querySelectorAll('pre'));
                    preElements.forEach((pre) => {
                        if (pre.parentNode.classList.contains('cms-code-wrapper')) return;

                        const details = document.createElement('details');
                        details.className = 'cms-code-block bg-black/5 dark:bg-white/5 border border-[var(--border-master)] rounded-xl my-6 overflow-hidden';
                        
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
                        
                        const preContainer = document.createElement('div');
                        preContainer.className = 'cms-code-wrapper p-4 overflow-x-auto text-sm border-t border-[var(--border-master)] bg-black/80 text-green-400';
                        
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

    // OMEGA TRANSLATE EFFECT (V12 Proxy Seguritzat)
    useEffect(() => {
        const controller = new AbortController();

        const handleTranslateRequest = async (e) => {
            const { postId, targetLang } = e.detail;
            if (postId !== routeSlug && postId !== 'projecte') return;

            setTranslating(true);
            try {
                // V12 Secure Proxy: Call Supabase Edge Function to avoid leaking API_SECRET payload in client
                const { data, error } = await supabase.functions.invoke('translation-proxy', {
                    body: {
                        campaignType: 'omega_translate_ondemand',
                        htmlContent: htmlContent, // Siempre traducimos desde la fuente original
                        targetLang: targetLang
                    }
                });

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
                setTranslating(false);
            }
        };

        window.addEventListener('omega-translate-request', handleTranslateRequest);

        return () => {
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
            <div className="w-full flex-1 flex flex-col items-center z-10 -mt-2 sm:mt-0 sm:px-4 pb-10">
                {PagePresentationHeader}

                <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mt-2 mb-8">
                    <details className="cms-code-block bg-black/5 dark:bg-white/5 border border-[var(--border-master)] rounded-xl overflow-hidden group">
                        <summary className="cursor-pointer p-4 font-bold text-sm uppercase flex items-center justify-between select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <span className="flex items-center gap-2 text-[var(--theme-accent-primary)]">
                                <Book size={16} /> Crèdits, Avís Legal i Metadades
                            </span>
                            <ChevronRight size={16} className="group-open:rotate-90 transition-transform text-[var(--text-muted)]" />
                        </summary>
                        
                        {/* Secció 1: Crèdits i Avís Legal */}
                        <div className="p-5 border-t border-[var(--border-master)] bg-[var(--bg-panel)] text-sm space-y-4 text-[var(--text-main)]">
                            <div className="space-y-1">
                                <p className="font-bold text-base m-0">Títol original: Sóc de Poble. El Projecte.</p>
                                <p className="italic text-[var(--text-muted)] m-0">Arxiu Etnogràfic i Dades Vives locals.</p>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="font-bold m-0 text-sm">Autor: Equip Sóc de Poble (La Torre de les Maçanes).</p>
                                <p className="italic text-xs text-[var(--text-muted)] m-0">Desenvolupament autogestionat sota la filosofia Trellat Mesh i Local-First. Preservació digital del patrimoni rural.</p>
                            </div>
                            
                            <div className="space-y-1 text-sm pt-2 border-t border-[var(--border-master)]/30">
                                <p className="m-0">Edita: <strong>Associació El Rentonar</strong> de La Torre de les Maçanes,<br />Projecte Sóc de Poble.</p>
                                <p className="m-0 mt-2">Tecnologia i Maquetació: <strong>Javi Llinares</strong>.</p>
                            </div>
                            
                            <div className="space-y-1 text-sm pt-2 border-t border-[var(--border-master)]/30">
                                <p className="m-0">Imatges: <strong>Respectius Arxius / Col·leccions Privades / Sóc de Poble</strong></p>
                                <p className="m-0">Art Generatiu: <strong>Sistema IAIA i Nano Banana (Sóc de Poble)</strong></p>
                                <p className="m-0">Imatge de portada: <strong>IAIA Maria</strong></p>
                                <p className="m-0 mt-2">Edició Digital Contínua, <strong>{new Date().getFullYear()}</strong>.</p>
                                <p className="m-0 font-mono mt-1 pt-1 border-t border-[var(--border-master)]/30">ISBN: PENDENT (Print on Demand / Amazon KDP)</p>
                            </div>
                            
                            <div className="pt-4 border-t border-[var(--border-master)]">
                                <div className="flex flex-col sm:flex-row gap-4 items-start pb-4">
                                    <div className="bg-white p-1 rounded inline-block shrink-0">
                                        <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png" alt="CC BY-NC-SA 4.0" className="w-[100px] h-auto object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold m-0 text-sm">Reconeixement-NoComercial-CompartirIgual</p>
                                        <p className="font-bold text-[var(--theme-accent-primary)] m-0 text-sm">4.0 Internacional (CC BY-NC-SA 4.0)</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs text-[var(--text-muted)]">
                                    <p className="m-0"><strong>Amb aquesta llicència, sou lliure de:</strong> Compartir (copiar i redistribuir) i Adaptar (remesclar, transformar i crear a partir del material).</p>
                                    <p className="m-0"><strong>Amb els termes següents:</strong> Reconeixement obligatori, NoComercial, i CompartirIgual (amb la mateixa llicència).</p>
                                    <p className="m-0 pt-2 break-words">
                                        L'obra "Sóc de Poble. El Projecte", editada per <strong>Associació El Rentonar</strong>, està autoritzada amb CC BY-NC-SA 4.0. Còpia de la llicència disponible a: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-accent-secondary)] hover:underline">https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca</a>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[var(--border-master)]/30">
                                <a href="https://javillinares.com" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-master)] text-center py-2 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                                    Javi Llinares
                                </a>
                                <a href="https://elrentonar.org" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-master)] text-center py-2 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                                    Assoc. El Rentonar
                                </a>
                                <a href="https://socdepoble.net" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[var(--theme-accent-primary)] text-white text-[var(--bg-panel)] text-center py-2 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:brightness-110 transition-colors flex items-center justify-center">
                                    Sóc de Poble
                                </a>
                            </div>
                        </div>

                        {/* Secció 2: Metadades Acadèmiques i Indexació */}
                        <div className="p-5 border-t border-[var(--border-master)] bg-black/5 dark:bg-black/20 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="sm:col-span-2 pb-2">
                                <h3 className="font-bold text-[10px] uppercase tracking-widest text-[var(--theme-accent-secondary)] mb-0">Indexació Acadèmica (Metadades Vives)</h3>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Editor / Repositori Institucional</h4>
                                <p className="font-bold text-xs text-[var(--text-main)] mb-0">Sóc de Poble (Auto-publicació descentralitzada)</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Estat de Revisió (Peer Review)</h4>
                                <p className="font-bold text-xs text-[var(--text-main)] mb-0">Comunitat-Revisat (Decentralized Community Peer-Reviewed)</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Idioma Principal</h4>
                                <p className="font-bold text-xs text-[var(--text-main)] mb-0">Valencià (Amb sub-traduccions dinàmiques IA)</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Departament / Matèria</h4>
                                <p className="font-bold text-xs text-[var(--text-main)] mb-0">Etnografia Digital, Sociologia Rural, Indústria Digital</p>
                            </div>
                            <div className="sm:col-span-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Citació Recomanada (Format APA 7)</h4>
                                <div className="bg-white/50 dark:bg-black/40 p-3 rounded-lg text-[11px] font-mono leading-relaxed text-[var(--text-main)] select-all break-words border border-[var(--border-master)] shadow-inner">
                                    Sóc de Poble & IAIA Maria. ({new Date().getFullYear()}). "{title || "El Projecte"}". Edició Contínua Local-First. La Torre de les Maçanes: Xarxa Sóc de Poble. Recuperat des de: {typeof window !== 'undefined' ? window.location.href : 'https://socdepoble.cat'}
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Paraules Clau (Keywords)</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {['Etnografia', 'Identitat Rural', 'Intel·ligència Artificial', 'Local-First', 'Descentralització', 'Sóc de Poble', 'Digitalització Rural'].map(kw => (
                                        <span key={kw} className="bg-white/60 dark:bg-black/40 border border-[var(--border-master)] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[var(--text-main)]">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </details>
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
                <TranslationModal isOpen={true} onClose={() => setIsTranslationOpen(false)} config={{ postId: routeSlug || 'projecte', title: title }} />
            )}

            {isHistoryOpen && (
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
            )}
            
            <SEO title={title || "El Projecte"} description="Connectant l'Espanya Buidada..." url={routeSlug} />
            
            {/* 3. PROTECCIÓN SUPERIOR (NOTCH) */}
            <div 
                className="pt-[max(env(safe-area-inset-top),0px)] shrink-0 z-[var(--z-nav,40)] bg-[var(--bg-app)]"
                inert={isTocOpen || isActionMenuOpen || isTranslationOpen || isHistoryOpen || !!mediaViewerSrc ? "true" : undefined}
            >
                <PageHeader title={title || "EL PROJECTE"} onBack={() => navigate(-1)} />
            </div>
            
            {/* 4. SCROLL CONTAINER (Rubber-band neutralizado, Bottom Safe-Area asegurado) */}
            <main 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overscroll-y-contain custom-scrollbar relative min-h-0 pb-[max(env(safe-area-inset-bottom),1.5rem)]"
                inert={isTocOpen || isActionMenuOpen || isTranslationOpen || isHistoryOpen || !!mediaViewerSrc ? "true" : undefined}
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
                <div className="sticky top-0 z-[var(--z-sticky,200)] w-full shadow-md bg-[#4F46E5]/95 dark:bg-[#F97316]/95 backdrop-blur-md transition-colors border-b border-white/10 shrink-0 touch-manipulation">
                    <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4">
                        
                        {/* Primaria: Conectar (Sobrevive a la compresión) */}
                        <button 
                            onClick={() => navigate('/hub')}
                            className="flex items-center justify-center min-w-[44px] min-h-[44px] gap-2 rounded-xl bg-[#F97316] text-white dark:bg-[#4F46E5] px-4 font-bold tracking-wide active:scale-95 touch-manipulation shadow-md shrink-0"
                        >
                            <Plus size={18} strokeWidth={3} className="shrink-0" />
                            <span className="hidden xs:inline uppercase text-sm">Connectar</span>
                        </button>

                        {/* Secundarias: Adaptativas */}
                        <div className="flex items-center gap-1 shrink-0 text-white dark:text-[#111111]">
                            <button 
                                className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation ${isSearchOpen ? 'bg-white/20 dark:bg-black/20' : ''}`}
                                aria-label="Cercar al document"
                                onClick={() => {
                                    if(isSearchOpen) { searchEngine.clear(); }
                                    setIsSearchOpen(!isSearchOpen);
                                }}
                            >
                                <Search size={20} strokeWidth={2.5} />
                            </button>

                            <button 
                                className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation ${translating ? "text-amber-300 dark:text-white animate-pulse" : ""}`}
                                aria-label="Traduir Pàgina"
                                onClick={() => setIsTranslationOpen(true)}
                                disabled={translating}
                            >
                                <Globe size={20} strokeWidth={2.5} className={translating ? "animate-spin" : ""} />
                            </button>

                            {/* EL EMBUDO KEBAB (Absorbe botones que no caben en móvil) */}
                            <div className="relative flex items-center border-l border-white/20 dark:border-black/20 ml-1 pl-1">
                                <button 
                                    onClick={() => setIsActionMenuOpen(true)}
                                    className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation lg:hidden"
                                    aria-label="Més accions"
                                >
                                    <MoreVertical size={24} strokeWidth={2.5} />
                                </button>

                                {/* Solo Desktop (>1024px) */}
                                <div className="hidden lg:flex items-center gap-1">
                                    <button 
                                        className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation gap-1.5 px-3" 
                                        onClick={() => navigate('/chats/socdepoble')}
                                    >
                                        <MessageCircle size={20} /><span className="text-sm font-bold uppercase">Comentar</span>
                                    </button>
                                    <button 
                                        className="flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation gap-1.5 px-3" 
                                        onClick={() => { if(navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }) }}
                                    >
                                        <Share2 size={20} /><span className="text-sm font-bold uppercase">Compartir</span>
                                    </button>
                                </div>
                            </div>
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
                            <button onClick={() => { exportService.downloadNoteAsPDF({ title: title || "Projecte", content: cleanHtmlContent }); setIsActionMenuOpen(false); }} className="flex items-center gap-4 w-full px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-[var(--text-main)] transition-all touch-manipulation font-bold">
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
                        className="fixed right-4 sm:right-6 lg:right-10 z-[var(--z-overlay,50)] w-14 h-14 bg-[var(--theme-accent-primary)] text-white rounded-full shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform touch-manipulation"
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
                            <div className="flex-1 overflow-y-auto px-3 py-2 overscroll-contain custom-scrollbar">
                                {tocElements.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            const el = document.getElementById(item.id);
                                            const container = scrollContainerRef.current;
                                            if (el && container) {
                                                const headerOffset = window.innerWidth >= 640 ? 140 : 180;
                                                const containerTop = container.getBoundingClientRect().top;
                                                const elementPosition = el.getBoundingClientRect().top - containerTop;
                                                
                                                container.scrollTo({
                                                    top: container.scrollTop + elementPosition - headerOffset,
                                                    behavior: "smooth"
                                                });
                                                setTimeout(() => setIsTocOpen(false), 300);
                                            }
                                        }}
                                        className={`w-full text-left py-3.5 px-3 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-primary)] touch-manipulation ${item.level === 'h3' ? 'pl-8 text-[13px] opacity-80' : 'font-black text-[15px]'}`}
                                    >
                                        <ChevronRight size={14} strokeWidth={3} className="text-[var(--theme-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
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
                                className="absolute right-0 w-2 bg-[var(--theme-accent-primary)] rounded-full transition-all duration-75 origin-center shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
                                style={{ 
                                    height: '24px', 
                                    top: `calc(${scrubberPos * 100}% - 12px)`,
                                    transform: scrubberDragging ? 'scaleX(2.5) scaleY(1.5)' : 'scaleX(1)'
                                }}
                            />

                            {/* Bafarada amb el Títol */}
                            <div 
                                className={`absolute right-5 whitespace-nowrap bg-[var(--theme-accent-primary)] text-white font-black uppercase tracking-wider text-xs sm:text-sm py-2 px-4 rounded-xl shadow-2xl pointer-events-none transition-all duration-100 flex items-center ${scrubberDragging ? 'opacity-100' : 'opacity-0'}`}
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

```
