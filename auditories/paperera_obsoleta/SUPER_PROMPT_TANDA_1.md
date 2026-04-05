# MEMORÁNDUM CRÍTICO AL ALTO CONSEJO MULTI-MODEL (QWEN, DEEPSEEK, KIMI, DOLA)

**1. CONTEXTO SOCIAL Y FILOSÓFICO DEL PROYECTO (LECTURA OBLIGATORIA):**
**Single Source of Truth:** ANTES de emitir ningún juicio técnico y revisar el código, DEBES visitar obligatoriamente la url [http://socdepoble.org/el-projecte](http://socdepoble.org/el-projecte) y empaparte de nuestra filosofía, normas y sistema de diseño base. El documento es crucial para entender nuestras metas.

Sois parte del Consejo de Inteligencias Artificiales de "Sóc de Poble". Este es un **proyecto de código abierto**, de inmersión rural y sin ánimo de lucro, diseñado y liderado por el Mestre Javi Llinares. Nuestro fin es preservar la historia y la memoria inmaterial, devolviendo el poder y la soberanía tecnológica a las zonas rurales de la "España Vaciada". 
El ecosistema se asienta sobre nuestro Manifiesto del **Trellat** (Sentido Común y austeridad tecnológica) y nuestra estructura técnica nativa es totalmente **Local-First** (Y.js + IndexedDB). Esto permite funcionar 100% offline, liberando a los pueblos de la sumisión a servidores *cloud* o grandes tecnológicas. 

**Os imploramos apoyo absoluto:** Implicaos a fondo. Comprended el impacto social de este proyecto. Todo el poder de cálculo lógico y todo el contexto que proceséis servirá para empoderar a personas en áreas donde la tecnología suele llegar tarde, cara y mal. Sed nuestros aliados.

**2. LA MISIÓN:**
Nos encontramos en la fase de endurecimiento extremo de la Interfaz hacia la **Versión 16 (Producción)**. Aprovechando vuestra titánica ventana de contexto, extraemos a continuación el código fuente *real* del núcleo y diseño para someterlo a una **Auditoría Estructural Definitiva**:

- **Fantasmas CSS e Impurezas:** Buscad utilidades redundantes de Tailwind. Somos puristas bajo el sistema *GEM MODERN*. Todo *margin/padding* sobrante, sobre-posicionamientos (ej. estilos de texto innecesarios como *tracking* o !important vacíos) que corrompan el diseño deben ser erradicados.
- **Cadáveres DOM:** Eliminad excesos de `<div>` u over-wrappers que entorpezcan. Nos interesa especialmente arreglar irregularidades visuales en Mobile & Tablets (como espacios sobrantes bajo el *footer* o descuadres en listados).
- **Reflows Asesinos (Rendimiento):** Buscamos operaciones pesadas que estrangulen el hilo principal de renderizado (Forced Reflows). Auditad exhaustivamente cualquier manipulador de scroll, detectores de intersección o `useEffect` masivo y dad la solución directa (*debouncing, requestAnimationFrame*, o rediseño reactivo leve).

**3. PROTOCOLO DE CONTESTACIÓN:**
1. Sed crudos y directos. Si encontráis basura, apuntad a la yugular del código.
2. Anotad siempre vuestra recomendación escribiendo el bloque de código final resultante listo para ser inyectado.
3. No recomendéis rediseños gigantes de arquitecturas, limitaros a parches quirúrgicos sobre nuestra base.

---
### 🖥️ CÓDIGO FUENTE ADJUNTO PARA LA AUDITORÍA
(Analizad los siguientes fragmentos de los componentes estructurales)



========================================
### ARCHIVO: src/App.jsx

```jsx
import React, { useEffect, useCallback } from 'react';
import AppLayout from './components/AppLayout';
import { iaiaService } from './services/iaiaService';
import GlobalModals from './components/GlobalModals';
import './index.css';
import { errorTrackingService } from './services/errorTrackingService';
import { healthCheckService } from './services/healthCheckService';
import { logger } from './utils/logger';

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from './components/ErrorBoundary';
import LocalFirstGate from './components/gates/LocalFirstGate';
import AuthGate from './components/gates/AuthGate';
import OfflineGate from './components/gates/OfflineGate';
import SEO from './components/SEO';
import { useLowEndDevice } from './hooks/useLowEndDevice';
import { useTabReconciliation } from './hooks/useTabReconciliation';
import { useBlindatgeOPFS } from './hooks/useBlindatgeOPFS';
import { useLocation } from 'react-router-dom';
import SystemRoutes from './components/SystemRoutes';

const LayoutBoundary = () => {
    const location = useLocation();
    const isSystemRoute = 
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/solatge') ||
//     location.pathname.startsWith('/hub') ||
        location.pathname.startsWith('/gestio-menu') ||
        location.pathname.startsWith('/gestio/categories') ||
        location.pathname.startsWith('/gestio/xats') ||
        location.pathname.startsWith('/utilitats') ||
        location.pathname.startsWith('/visio') ||
        location.pathname.startsWith('/tools/trellat') ||
        location.pathname.startsWith('/iaia-sandbox');

    if (isSystemRoute) {
        return <SystemRoutes />;
    }

    return (
        <>
            <AppLayout />
            <GlobalModals />
        </>
    );
};

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // [BÚNKER]: Persistència i Control de Service Worker
    useBlindatgeOPFS();

    // Sanea "Amnesia BFCache"
    useTabReconciliation();

    // [MONITORING AND CLEANUP] Inicialitzar error tracking y purga fantasma
    useEffect(() => {
        let isMounted = true;
        const initializeMonitoring = async () => {
            try {
                await errorTrackingService.initialize();
                if (isMounted) logger.log('[App] Error tracking initialized');
            } catch (error) {
                if (isMounted) logger.error('[App] Failed to initialize error tracking:', error);
            }
        };

        // Purificación final de imatges fantasma al Mestre
        import('./services/syncService')
            .then(({ syncService }) => {
                if (!isMounted) return; // [OMEGA-FIX: Guardia contra Zombie Effect]
                const report = syncService.purgeGhostMediaCache({ dryRun: false });
                logger.debug('[App] Purga fantasma completada en el arranque:', report);
            })
            .catch(e => {
                if (isMounted) logger.error('[App] Error purging ghost media:', e); // [OMEGA-FIX: Catch explícito]
            });

        initializeMonitoring();
        return () => { isMounted = false; };
    }, []);

    // [MONITORING] Iniciar health checks
    useEffect(() => {
        healthCheckService.startMonitoring();
        
        const unsubscribe = healthCheckService.subscribe((health) => {
            if (health.overall !== 'healthy') {
                logger.warn('[App] Health check warning:', health);
                errorTrackingService.captureException(
                    new Error(`Health check: ${health.overall}`),
                    { health }
                );
            }
        });

        return () => {
            healthCheckService.stopMonitoring();
            unsubscribe();
        };
    }, []);

    // [ERROR] Global error handlers refactoritzats
    const handleError = useCallback((event) => {
        errorTrackingService.captureException(event.error || event.message, {
            type: 'global',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }, []);

    const handleUnhandledRejection = useCallback((event) => {
        errorTrackingService.captureException(event.reason, {
            type: 'unhandledrejection'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [handleError, handleUnhandledRejection]);

    useEffect(() => {
        return () => {
            iaiaService.dispose();
        };
    }, []);

    const isLowEnd = useLowEndDevice();

    useEffect(() => {
        if (isLowEnd) {
            document.body.classList.add('low-end-device');
        } else {
            document.body.classList.remove('low-end-device');
        }
    }, [isLowEnd]);

    return (
        <>
            <SEO />
            <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
                <OfflineGate>
                    <LocalFirstGate>
                        <AuthGate>
                            <LayoutBoundary />
                        </AuthGate>
                    </LocalFirstGate>
                </OfflineGate>
            </ErrorBoundary>
            {/* [OMEGA-FIX: Fuera del ErrorBoundary con atributos y roles explícitos completos] */}
            <div
                id="aria-live-region"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />
        </>
    );
};

export default App;
```


========================================
### ARCHIVO: src/layouts/AppLayout.jsx

```jsx
// ATENCIÓN: El archivo src/layouts/AppLayout.jsx no se detecta.
```


========================================
### ARCHIVO: src/components/NavigationRail.jsx

```jsx
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, MapPin, MessageSquare, Plus, Store, Calendar, Map, BookOpen, FileText, Activity } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { APP_VERSION } from "../constants";

const menuItems = [
  { path: "/chats", key: "nav.chats", fallback: "Xat", icon: MessageSquare },
  { path: "/mur", key: "nav.feed", fallback: "Mur", icon: LayoutGrid },
  { path: "/mercat", key: "nav.market", fallback: "Mercat", icon: Store },
  { path: "/pobles", key: "nav.towns", fallback: "Pobles", icon: MapPin },
  { path: "/calendari", key: "nav.events", fallback: "Calendari", icon: Calendar },
  { path: "/mapa", key: "nav.map", fallback: "Mapa", icon: Map },
  { path: "/el-projecte", key: "nav.project", fallback: "El Projecte", icon: BookOpen },
  { path: "/notes", key: "nav.notes", fallback: "Bloc de Notes", icon: FileText },
];

const NavigationRail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { closeDrawer } = useNavigation();
  const { isSuperAdmin } = useAuth();

  const handleNavigate = () => {
    if (window.matchMedia("(max-width: 767px)").matches) closeDrawer();
  };

  return (
    <nav className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      
      {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP - PROTOCOL HUB) - FIT 48PX */}
      <div className="h-[48px] min-h-[48px] max-h-[48px] shrink-0 border-b border-[#ffffff14] relative z-20 bg-[#544CF6] overflow-hidden -ml-px w-[calc(100%+1px)]">
        <button
          className="absolute inset-0 w-full h-full text-white flex items-center justify-center space-x-2 transition-colors hover:brightness-110 outline-none"
          onClick={() => navigate("/hub")}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="uppercase font-bold">{t("common.add", "Connectar")}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto stable-scroll custom-scrollbar flex flex-col pt-4 px-3 pb-6">

        <ul className="space-y-2 relative">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="rail-active-bg"
                      className="absolute inset-0 bg-[#F97316] rounded-tactile"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <NavLink
                    to={item.path}
                    onClick={handleNavigate}
                    className={`relative flex h-[48px] w-full items-center gap-4 rounded-tactile px-4 font-semibold transition-colors duration-200 outline-none ${
                        isActive
                          ? "text-black"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={22} className={isActive ? "drop-shadow-md" : ""} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="truncate tracking-wide">{t(item.key, item.fallback)}</span>
                  </NavLink>
                </li>
              );
            })}
            
            {/* PROTECTED SANDBOX VISIBILITY FOR ADMINS */}
            {isSuperAdmin && (
              <li key="/iaia-sandbox" className="relative mt-2 pt-2 border-t border-[#ffffff14]">
                {location.pathname.startsWith("/iaia-sandbox") && (
                  <motion.div
                    layoutId="rail-active-bg"
                    className="absolute inset-0 bg-red-500/10 rounded-tactile"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <NavLink
                  to="/iaia-sandbox"
                  onClick={handleNavigate}
                  className={`relative flex h-[48px] w-full items-center gap-4 rounded-tactile px-4 font-semibold transition-colors duration-200 outline-none ${
                      location.pathname.startsWith("/iaia-sandbox")
                        ? "text-red-500"
                        : "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                  }`}
                >
                  <Activity size={22} className={location.pathname.startsWith("/iaia-sandbox") ? "drop-shadow-md" : ""} strokeWidth={location.pathname.startsWith("/iaia-sandbox") ? 2.5 : 2} />
                  <span className="truncate tracking-wide">Laboratori IAIA</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        
      <div className="p-4 mt-auto border-t border-[#ffffff14] bg-transparent shrink-0 space-y-3 relative z-20">
        <div className="mt-2 text-[10px] text-center opacity-50 hover:opacity-100 transition-opacity font-black uppercase tracking-[0.2em] text-white">
          {APP_VERSION}
        </div>
      </div>
    </nav>
  );
};

export default NavigationRail;
```


========================================
### ARCHIVO: src/pages/ProjectPresentation.jsx

```jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2, Book, Plus, MessageCircle, Globe, MapPin, Search, Calendar, Sparkles, List, X, ChevronRight, History, Info, Menu } from 'lucide-react';
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
import RoundButton from '../components/ui/RoundButton';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

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
    const scrubberBoundsRef = useRef(null);
    const scrubberRafRef = useRef(null);
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

    const activeHtmlContent = translatedContent || htmlContent;

    useEffect(() => {
        let cleanupFunctions = [];
        if (activeHtmlContent && !isLoadingPage && !isEditing) {
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

                    // 2. Intercept local Anchor Links (#algo)
                    // REMOVED: Event listeners on `contentDiv` were lost when setting `innerHTML`. 
                    // This is now handled by the `onClick` event delegation on the `.app-cms-content` container wrapper.

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
    }, [activeHtmlContent, isLoadingPage, isEditing]);

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
        if (!scrollContainerRef.current || !scrubberBoundsRef.current) return;
        
        if (scrubberRafRef.current) cancelAnimationFrame(scrubberRafRef.current);
        scrubberRafRef.current = requestAnimationFrame(() => {
            const { top, height } = scrubberBoundsRef.current;
            let percentage = (e.clientY - top) / height;
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
            scrubberRafRef.current = null;
        });
    }, [tocElements]);

    const handleScrubberPointerUp = useCallback(() => {
        setScrubberDragging(false);
        window.removeEventListener('pointermove', handleScrubberPointerMove);
        window.removeEventListener('pointerup', handleScrubberPointerUp);
        if (scrubberRafRef.current) cancelAnimationFrame(scrubberRafRef.current);
    }, [handleScrubberPointerMove]);

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

                <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mt-2 mb-4">
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
                    </div>
                )}

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
                            className="app-cms-content focus:outline-none min-h-[50vh] px-6 lg:px-10 pb-4 w-full"
                            dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
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
                                        const headerOffset = window.innerWidth >= 640 ? 140 : 180;
                                        const topDiff = targetEl.getBoundingClientRect().top - headerOffset;
                                        const scrollContainer = document.getElementById('main-content') || scrollContainerRef.current;
                                        if (scrollContainer) {
                                            scrollContainer.scrollBy({ top: topDiff, behavior: 'smooth' });
                                        }
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

                            <button 
                                className={`flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm ${translating ? "text-amber-300 dark:text-white animate-pulse" : ""}`}
                                aria-label="Traduir Pàgina"
                                onClick={() => setIsTranslationOpen(true)}
                                disabled={translating}
                            >
                                <Globe size={20} strokeWidth={2.5} className={translating ? "animate-spin" : ""} />
                                <span className="hidden sm:inline">Traduir</span>
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
                            <div className="flex-1 overflow-y-auto px-3 py-2 overscroll-contain custom-scrollbar">
                                {tocElements.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            const el = document.getElementById(item.id);
                                            if (el) {
                                                const headerOffset = window.innerWidth >= 640 ? 140 : 180;
                                                const topDiff = el.getBoundingClientRect().top - headerOffset;
                                                const scrollContainer = document.getElementById('main-content') || scrollContainerRef.current;
                                                if (scrollContainer) {
                                                    scrollContainer.scrollBy({
                                                        top: topDiff,
                                                        behavior: "smooth"
                                                    });
                                                }
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


========================================
### ARCHIVO: src/index.css

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Noto Sans", ui-sans-serif, system-ui, sans-serif, "Noto Color Emoji", "Noto Emoji";
  --font-mono: "Noto Sans Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace, "Noto Color Emoji", "Noto Emoji";
  --font-serif: "Noto Serif", serif, "Noto Color Emoji", "Noto Emoji";

  --color-primary: var(--sdp-orange);
  --color-secondary: var(--sdp-blue);
  --color-theme-base: var(--bg-app);
  --color-theme-sidebar: var(--bg-sidebar);
  --color-theme-panel: var(--bg-panel);
  --color-theme-text: var(--text-main);
  --color-border-master: var(--border-master);

  --radius-genesis: 28px;
  --radius-tactile: 16px;
  --radius-pill: 100px;

  --spacing-header: 56px;
  --spacing-sidebar: 280px;
  --spacing-unit: 1.5rem;

  /* CMS TYPOGRAPHY TOKENS (Vertical Rhythm & Legibility) */
  /* Optims per lectura llegó de llibre: Line Height base 1.6 */
  --cms-lh-base: 1.6;
  --cms-lh-heading: 1.25;
  --cms-gap-paragraph: 1.6rem;         /* Space AFTER paragraph = 1 line height approx */
  --cms-gap-h2-top: 2.8rem;            /* Space BEFORE H2 */
  --cms-gap-h2-bottom: 0.8rem;         /* Space AFTER H2 */
  --cms-gap-h3-top: 2rem;              /* Space BEFORE H3 */
  --cms-gap-h3-bottom: 0.5rem;         /* Space AFTER H3 */
  --cms-gap-subtitle-h3: 80px;         /* Specific spacing between Subtitle (H2) and next element as requested */

  --z-base: 1;
  --z-nav: 50;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-sidebar: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-max: 999;

  --glass-bg: rgba(28, 28, 30, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(16px);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  /* Fallbacks needed by legacy code, though handled by CSS variables below */
  --glass-bg-light: rgba(255, 255, 255, 0.7);
  --glass-border-light: rgba(0, 0, 0, 0.1);
  --glass-shadow-light: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}

@layer base {
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { -webkit-font-smoothing: antialiased; }

  body {
    font-family: 'Noto Sans', system-ui, -apple-system, sans-serif;
  }

  blockquote, q, cite, dfn, var {
    font-style: normal;
    font-family: inherit;
  }

  code, pre, kbd {
    font-family: var(--font-mono);
  }

  :root {
    --bg-app: #0e0e10;
    --bg-panel: #141417;
    --bg-sidebar: #0e0e10;
    --text-main: #f3f4f6; /* Tailwind gray-100 */
    --text-muted: #9ca3af; /* Tailwind gray-400 */
    --border-master: rgba(255, 255, 255, 0.08);

    /* Tech-Huerta GEM Modern Palette (4 Colors) */
    --sdp-orange: #f97316;
    --sdp-blue: #0984E3;
    --theme-accent-primary: var(--sdp-orange);
    --theme-accent-secondary: var(--sdp-blue);

    /* Motion System Tokens (iOS feel) */
    --motion-quick: 120ms;
    --motion-normal: 220ms;
    --motion-expressive: 360ms;
    --spring-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --ease-apple: cubic-bezier(0.22, 1, 0.36, 1);

    --glass-theme-bg: rgba(20, 20, 23, 0.65);
    --glass-theme-border: rgba(255, 255, 255, 0.08);
    --glass-theme-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);

    /* FullCalendar Dynamic Theme Overrides */
    --fc-page-bg-color: transparent;
    --fc-neutral-bg-color: var(--bg-panel);
    --fc-neutral-text-color: var(--text-muted);
    --fc-border-color: var(--border-master);
    --fc-button-text-color: var(--text-main);
    --fc-button-bg-color: transparent;
    --fc-button-border-color: var(--border-master);
    --fc-button-hover-bg-color: color-mix(in srgb, var(--text-main) 10%, transparent);
    --fc-button-hover-border-color: var(--border-master);
    --fc-button-active-bg-color: color-mix(in srgb, var(--text-main) 20%, transparent);
    --fc-button-active-border-color: var(--border-master);
    --fc-event-bg-color: var(--theme-accent-secondary);
    --fc-event-border-color: var(--theme-accent-secondary);
    --fc-event-text-color: #ffffff;
    --fc-non-business-color: color-mix(in srgb, var(--text-main) 5%, transparent);
    --fc-highlight-color: color-mix(in srgb, var(--text-main) 10%, transparent);
    --fc-today-bg-color: color-mix(in srgb, var(--theme-accent-primary) 15%, transparent);
    --fc-now-indicator-color: var(--theme-accent-primary);
    --fc-daygrid-event-dot-width: 8px;
    --fc-list-event-hover-bg-color: color-mix(in srgb, var(--text-main) 5%, transparent);
  }

  :root.light {
    --bg-app: #FAFAFA; /* Papel reciclado / Cal blanca */
    --bg-panel: #ffffff;
    --bg-sidebar: #FAFAFA;
    --text-main: #1f2937; /* Tailwind gray-800 */
    --text-muted: #6b7280; /* Tailwind gray-500 */
    --border-master: rgba(0, 0, 0, 0.08);

    /* Tech-Huerta GEM Modern Palette (4 Colors) */
    --sdp-orange: #f97316;
    --sdp-blue: #0984E3;
    --theme-accent-primary: var(--sdp-orange);
    --theme-accent-secondary: var(--sdp-blue);

    --glass-theme-bg: rgba(255, 255, 255, 0.75);
    --glass-theme-border: rgba(0, 0, 0, 0.06);
    --glass-theme-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    @apply h-[100dvh] w-[100dvw] m-0 p-0 overflow-hidden bg-theme-base text-theme-text;
    font-family: var(--font-sans);
    font-stretch: 75%;
    font-size: 1.25rem;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior-y: contain; /* Permite inercia, evita rebote global */
  }

  /* Aísla el scroll principal del layout */
  .main-viewport, .system-scroll-container, .profile-scroll-container {
    overscroll-behavior-y: auto; 
    -webkit-overflow-scrolling: touch; /* Fuerza scroll suave en iOS viejo */
  }

  #root {
    @apply h-[100dvh] w-full m-0 p-0 overflow-hidden flex flex-col;
    position: fixed; /* Antigravity Jitter Fix */
    inset: 0;
  }

  p {
    @apply text-[1.05rem] leading-[1.6] mb-6 text-theme-text;
  }
}

@layer components {
  /* GLASSMORPHISM PROTOCOL */
  .glass-panel {
    background: var(--glass-theme-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-theme-border);
    box-shadow: var(--glass-theme-shadow);
    border-radius: var(--radius-genesis);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  /* GPU Compositing for Animated Blur Overlays */
  .glass-overlay {
    will-change: opacity, backdrop-filter;
    transform: translateZ(0);
    isolation: isolate;
  }

  /* TECH-HUERTA PREMIUM COMPONENTS */
  .glass-rural {
    /* Fondo con filtro translúcido oscuro/cálido */
    background: color-mix(in srgb, var(--bg-panel) 65%, transparent);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid var(--border-master);
    box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.15);
    border-radius: var(--radius-pill);
    position: relative;
    overflow: hidden;
  }
  
  /* Textura de Arcilla Digital (Noise SVG sutil) */
  .glass-rural::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.03; /* 3% noise */
    pointer-events: none;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }

  .btn-tactile {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-tactile);
    transition: box-shadow var(--motion-quick) var(--ease-apple), transform var(--motion-quick) var(--ease-apple), background-color var(--motion-quick) var(--ease-apple);
    outline: none;
    cursor: pointer;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }
  
  .btn-tactile:focus-visible {
    box-shadow: 0 0 0 2px var(--theme-accent-primary);
  }

  /* CMS CORE (Vertical Rhythm & Clean Elements) */
  .app-cms-content {
    background: transparent;
    color: var(--text-main);
    line-height: var(--cms-lh-base);
    text-align: left;
    overflow-x: hidden !important; /* Mata scroll horizontal fantasma provocado por marked/pre */
    contain: layout paint; /* Aísla GPU layers */
    will-change: scroll-position; /* Optimización de scroll */
  }
  
  /* Selectors text content */
  .app-cms-content h1 {
    font-size: clamp(1.875rem, 4vw, 2.25rem); /* text-3xl to text-4xl */
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.025em;
    text-align: left;
    margin-bottom: var(--cms-gap-paragraph);
    line-height: var(--cms-lh-heading);
  }
  
  .app-cms-content h2 {
    font-size: clamp(1.25rem, 3vw, 1.5rem); /* text-xl to text-2xl */
    font-weight: 700;
    color: var(--theme-accent-secondary);
    text-transform: uppercase;
    margin-top: var(--cms-gap-h2-top);
    margin-bottom: var(--cms-gap-h2-bottom);
    line-height: var(--cms-lh-heading);
  }
  
  .app-cms-content h3 {
    font-size: 1.125rem; /* text-lg */
    font-weight: 700;
    margin-top: var(--cms-gap-h3-top);
    margin-bottom: var(--cms-gap-h3-bottom);
    line-height: var(--cms-lh-heading);
  }

  /* Spacing fix for specifically H3 coming immediately after a section start / subtitle */
  .app-cms-content > h3:first-child,
  .app-cms-content > *:first-child {
    /* Si és el primer element després del subtítol general (que ja compta amb marge),
       apliquem l'espai rígid demanat: "unos 80 pixeles" del subtítol (h2 extern) al h3 (intern CMS).
       Com .app-cms-content té el padding pb-10 i px-10 (hi traiem pt-10!), usarem 80px com margin-top d'aquest primer fill
    */
    margin-top: var(--cms-gap-subtitle-h3);
  }

  .app-cms-content h4 {
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: var(--spacing-unit);
    margin-bottom: 0.5rem;
  }
  
  .app-cms-content h5 {
    font-size: 0.875rem; /* text-sm */
    font-weight: 600;
    color: var(--text-muted);
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .app-cms-content h6 {
    font-size: 0.75rem; /* text-xs, accessible minimum limit */
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .app-cms-content p {
    font-size: clamp(1.05rem, 1.8vw, 1.15rem); 
    line-height: var(--cms-lh-base);
    margin-bottom: var(--cms-gap-paragraph);
  }

  /* Llistes */
  .app-cms-content :where(ul, ol) {
    font-size: clamp(1.05rem, 1.8vw, 1.15rem);
    margin-bottom: var(--cms-gap-paragraph);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  /* Llistes numèriques netes (el disseny tàctil base no val ací per lectura llarga,
     només les apliquem a les de viñetas, mantindrem estil per totes per defecte per ara si no es concreta,
     però la instrucció deia només estils clean) */
  .app-cms-content ul, .app-cms-content ol {
    padding-left: 1.5rem;
    display: block; /* revertims a block per la legibilitat purista */
  }
  
  /* Llistes anidades: llevem l'enorme gap del margin-bottom perquè no trenqui l'harmonia visual entre viñetas */
  .app-cms-content li :where(ul, ol) {
    margin-bottom: 0;
    margin-top: 0.25rem;
  }

  .app-cms-content ol {
    list-style: decimal;
  }
  .app-cms-content ul {
    list-style: disc;
  }

  .app-cms-content li {
    /* Reset táctil antic: en llibres V12 CMS només apliquem un marge senzill excepte si són llistats interactius, però seguim amb el padding lleuger per ara. */
    margin-bottom: 0.25rem;
  }
  .app-cms-content li > p {
    margin: 0;
  }

  /* Blockquotes i Media */
  .app-cms-content blockquote {
    border-left: 4px solid var(--theme-accent-primary);
    padding: 1rem 1rem 1rem 1.5rem;
    margin: 2rem 0;
    background-color: var(--bg-panel);
    border-radius: 0 16px 16px 0;
  }
  .app-cms-content blockquote p {
    font-size: clamp(1.25rem, 2vw, 1.5rem); /* xl to 2xl */
    font-style: italic;
    font-weight: 500;
    color: var(--text-main);
    margin-bottom: 0;
  }

  .app-cms-content img {
    border-radius: 16px;
    border: 1px solid var(--border-master);
    margin: 1.5rem 0;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  
  .app-cms-content a {
    color: var(--theme-accent-primary);
    text-decoration: underline;
  }
  .app-cms-content a:hover {
    color: var(--theme-accent-secondary);
  }
  
  .app-cms-content code {
    background-color: var(--bg-panel);
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875em;
    color: var(--theme-accent-secondary);
    border: 1px solid var(--border-master);
  }
  
  .app-cms-content pre code {
    background-color: transparent;
    padding: 0;
    border: none;
    color: inherit;
    font-size: inherit;
  }
  
  /* Taules (Tables) */
  .app-cms-content table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--cms-gap-paragraph) 0;
    text-align: left; /* Sobreescriu el text-align: justify del contenidor principal */
    font-size: clamp(1rem, 1.8vw, 1.125rem); /* Mida més compacta per cabre millor */
    border: 1px solid var(--border-master);
    border-radius: 12px; /* Radius global */
    overflow: hidden; /* Per mantenir el radius als cantons */
    display: block; /* Habilita l'scroll horitzontal en mòbils */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .app-cms-content th,
  .app-cms-content td {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-master);
    vertical-align: top; /* Millor lectura si el text és llarg */
  }
  
  .app-cms-content th {
    font-weight: 700;
    color: var(--text-main);
    background-color: var(--bg-surface);
    text-transform: uppercase;
    font-size: 0.85em;
    letter-spacing: 0.05em;
  }
  
  .app-cms-content tbody tr {
    transition: background-color var(--motion-quick) var(--ease-apple);
  }
  
  .app-cms-content tbody tr:last-child td {
    border-bottom: none; /* Elimina la línia de l'última fila per neteja visual */
  }
  
  .app-cms-content tbody tr:hover {
    background-color: color-mix(in srgb, var(--bg-surface) 50%, transparent);
  }
  
  .app-cms-content tbody td {
    color: var(--text-muted); /* Dades lleugerament més clares per jerarquia */
  }
  
  .app-cms-content tbody td:first-child {
    font-weight: 600; /* La primera columna fa d'índex visual (Color, Nom, etc.) */
    color: var(--text-main);
  }

  .app-cms-content ::selection {
    background-color: var(--theme-accent-primary);
    color: white;
  }

  /* LOW END FALLBACKS */
  body.low-end-device {
    --glass-blur: none;
    --glass-shadow: none;
    --glass-theme-bg: var(--bg-panel);
    --glass-theme-border: var(--border-master);
  }
  body.low-end-device .glass-panel,
  body.low-end-device * {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  /* ATOMIC MACRO-CONTAINERS */
  .atomic-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .atomic-grid {
    display: grid;
    gap: var(--spacing-unit, 1.5rem);
    width: 100%;
  }

  /* CODEX ATOM SYSTEM */
  .atom-root {
    @apply relative min-h-0 min-w-0 w-full;
    contain: layout paint style;
    isolation: isolate;
  }
  .atom-fill {
    @apply h-full w-full min-h-0 min-w-0;
  }
  .atom-stack {
    @apply h-full w-full min-h-0 min-w-0 flex flex-col;
    gap: clamp(0.75rem, 1.2vw, 1rem);
  }
  .atom-row {
    @apply flex min-w-0 items-center;
    gap: clamp(0.5rem, 0.8vw, 0.75rem);
  }
  .atom-card {
    @apply h-full w-full min-h-0 min-w-0 flex flex-col rounded-genesis border border-border-master bg-theme-panel p-4;
  }
  
  /* 🎨 DOLA UX/UI MICRO-INTERACTIONS (V14 AUDIT) */
  /* This block globally patches the interaction friction detected by Dola across the 40+ components */
  .create-card, .action-btn, .layer-btn, .filter-toggle-btn, .setting-row, .primary-action-btn, 
  .secondary-action-btn, .action-btn-mini, .persona-list-item, .vision-mode-card, .town-card {
    transition: transform var(--motion-quick) var(--spring-bounce), box-shadow var(--motion-quick) ease, background-color var(--motion-quick) ease;
  }

  .create-card:active, .action-btn:active, .layer-btn:active, .filter-toggle-btn:active,
  .primary-action-btn:active, .secondary-action-btn:active, .action-btn-mini:active,
  .persona-list-item:active, .vision-mode-card:active, .town-card:active {
    transform: scale(0.96);
  }

  .create-card:hover, .town-card:hover, .vision-mode-card:hover, .persona-list-item:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.3);
  }

  .managed-entity-item, .module-card, .log-entry, .universal-card {
    transition: box-shadow var(--motion-quick) ease, transform var(--motion-quick) ease;
  }
  
  .managed-entity-item:hover, .module-card:hover, .universal-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-theme-shadow);
  }

  .managed-entity-item:active, .universal-card:active {
    transform: scale(0.98);
  }
}

@layer utilities {
  /* GHOST BORDERS */
  .border-ghost-r { box-shadow: inset -1px 0 0 0 var(--border-master); }
  .border-ghost-b { box-shadow: inset 0 -1px 0 0 var(--border-master); }
  .border-ghost-t { box-shadow: inset 0 1px 0 0 var(--border-master); }

  /* SCROLLBAR V4 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklab, currentColor 20%, transparent) transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, currentColor 18%, transparent);
    border-radius: 999px;
    background-clip: padding-box;
    border: 2px solid transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: color-mix(in oklab, currentColor 30%, transparent);
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* STABLE SCROLL CODEX */
  .stable-scroll {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable both-edges;
    overscroll-behavior: contain;
    transform: translateZ(0); 
  }
  @media (pointer: fine) {
    .stable-scroll { scrollbar-gutter: auto; } /* Let's keep Codex gutter but avoid floating mouse offset in fine pointer if needed, or stick to both-edges? Standard is both-edges from codex */
  }

  /* Z-INDEX TOKENS */
  .z-token-base { z-index: var(--z-base); }
  .z-token-sticky { z-index: var(--z-sticky); }
  .z-token-overlay { z-index: var(--z-overlay); }
  .z-token-sidebar { z-index: var(--z-sidebar); }
  .z-token-modal { z-index: var(--z-modal); }

  /* CONTAINMENT */
  .contain-strict { contain: layout style paint; }
  .contain-layout { contain: layout style; }
  .gpu-accelerate {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }
  .content-visibility-auto {
    content-visibility: auto;
    contain-intrinsic-size: 88px;
  }
  .paint-contain {
    contain: paint;
  }

  /* MODAL & SIDEBAR RENDER ISOLATION */
  .modal-root, .portal-overlay, .iaia-chat-sidebar {
    isolation: isolate;
  }

  /* VARIOUS */
  .flex-safe {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex: 1;
  }
  .text-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .safe-area-top { padding-top: env(safe-area-inset-top, 0px); }
  .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }

  .app-cms-content h2, .app-cms-content h3 {
    scroll-margin-top: calc(70px + env(safe-area-inset-top));
  }
}

/* HOSTILE CONTENT */
.app-content-rich {
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* ANIMATIONS */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-in.fade-in { animation: fade-in 0.3s ease-out forwards; }
.animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* HIGH CONTRAST ACCESSIBILITY MODES */
@media screen and (prefers-contrast: more) {
  :root {
    --theme-text: #000000;
    --theme-text-secondary: #000000;
    --theme-text-muted: #111111;
    --theme-bg: #FFFFFF;
    --theme-bg-panel: #FFFFFF;
    --theme-border: #000000;
    --theme-accent-primary: #000000;
    --theme-danger: #D32F2F;
  }
  
  .dark-mode, [data-theme="dark"] {
    --theme-text: #FFFFFF;
    --theme-text-secondary: #FFFFFF;
    --theme-text-muted: #EEEEEE;
    --theme-bg: #000000;
    --theme-bg-panel: #000000;
    --theme-border: #FFFFFF;
    --theme-accent-primary: #FFFFFF;
  }
}

@media screen and (forced-colors: active) {
  button, a, input, select, textarea, .btn-primary, .btn-secondary {
    border: 1px solid CanvasText !important;
  }
}
```
