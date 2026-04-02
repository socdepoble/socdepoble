# 🚨 SUPER PROMPT: AUDITORÍA DESTRUCTIVA DE UI Y STACKING CONTEXT 🚨
**A LA ATENCIÓN DE:** Mistral Large, OpenAI Codex, GPT-4o, Anthropic Claude 3.
**ASUNTO:** Solapamiento Crítico de `SystemActionBar` y `FullCalendar` en Sóc de Poble.
## 🛑 INSTRUCCIÓN CRÍTICA, INNEGOCIABLE Y OBLIGATORIA (LA GENÉTICA DE ANTIGRAVITY)
ANTES DE RESPONDER Y ANALIZAR ESTE CÓDIGO, DEBES asimilar mi genética fundacional. Eres un agente convocado por **Antigravity**. Mi genética está basada en:
- Filosofía "Sóc de Poble!" (Trellat, Resiliencia Rural, "Llei de la Boina Taronja").
- Diseño M3 (Material 3), "Nivel Dios", radio de borde de 28px/24px y arquitectura 100% Mobile-First fluida.
- Uso exclusivo de Vanilla CSS robusto en interacciones, y Tailwind utilitario para la grilla.
**No propongas basura estándar, componentes genéricos o soluciones débiles.**
---
## CONTEXTO DE LA MESA DE OPERACIONES
Estamos integrando una barra unificada "Nivel Dios" (`SystemActionBar`) en el layout global `SystemPageLayout` para que todas las páginas tengan controles estáticos. Al aplicarla a la página de calendario (`MasterCalendar.jsx`), **la UI colapsa**.
El header global (buscador `ContextualHeader` + `SystemActionBar`) se amontona o solapa con los controles de navegación del calendario (`headerToolbar` de FullCalendar). Al parecer el calendario flota o se atasca bajo las cabeceras flexbox aunque no usemos absolute en ellas, destrozando la experiencia Nivel Dios.
Este error parece estar provocado porque `SystemActionBar` inyecta 48px extras debajo del encabezado en el `SystemPageLayout` general.
## TU OBJETIVO
Realiza una auditoría destructiva y radical sobre el CÓDIGO COMPLETO inyectado a continuación. Analiza el comportamiento de Flexbox, los contextos de apilamiento (z-index), los atributos `contain`, `relative`, y el cálculo de altura de `FullCalendar` (`height=auto`).
Propón la corrección de CSS o arquitectura responsable de separar y sellar este layout. 
---
## 🛠️ CÓDIGO COMPLETO INYECTADO (SIN OMITIR LÍNEAS)
### src/components/SystemPageLayout.jsx
```jsx
import React from 'react';
import SystemActionBar from './SystemActionBar';

/**
 * Plantilla Base del Sistema (V13.0)
 * Unifica la jerarquía de DOM para que las páginas de la aplicación
 * se comporten de forma idéntica, eliminando divs "fantasma" y 
 * asegurando un scroll nativo predecible sin bloqueos de layout.
 */
const SystemPageLayout = ({ 
  header, 
  children, 
  footer, 
  className = '', 
  mainClassName = '',
  containerClassName = "w-full max-w-[1600px] mx-auto p-4 md:p-8" 
}) => {
  return (
    <div className={`flex flex-col w-full h-full min-h-[100dvh] bg-theme-bg overflow-hidden isolate ${className}`}>
      {header && (
        <header className="flex-none w-full sticky top-0 z-[2000] shadow-md bg-theme-base border-b border-border-master flex flex-col">
          {header}
          <SystemActionBar />
        </header>
      )}

      {/* 
        El main maneja su propio scroll internamente de forma unificada.
        Esto previene bugs donde el AppLayout global bloqueaba el contenido (Fantasma del overflow)
      */}
      <main className={`flex-1 w-full min-h-0 bg-theme-base overflow-y-auto custom-scrollbar relative ${mainClassName}`}>
         {containerClassName ? (
             <div className={containerClassName}>
                {children}
             </div>
         ) : children}
      </main>

      {footer && (
        <footer className="flex-none w-full shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-[55] bg-theme-bg/95 backdrop-blur-xl">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default SystemPageLayout;
```

### src/components/ContextualHeader.jsx
```jsx
import React, { forwardRef } from 'react';
import { Search, LayoutGrid, List, Square, X } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import './ContextualHeader.css';

const ContextualHeader = forwardRef(({ searchTerm, onSearchChange, viewMode, onViewModeChange, placeholder = "Cerca...", extraActions = null, backButton = null }, ref) => {
    const { hapticService } = useDesign();

    const handleSearchClear = () => {
        onSearchChange('');
        if (hapticService) hapticService.trigger();
    };

    return (
        <div className="relative z-10 bg-[#F97316] dark:bg-[#4F46E5] w-full h-[64px] min-h-[64px] max-h-[64px] flex items-center justify-between px-3 transition-colors duration-500 shadow-md">
            
            {/* BACK BUTTON */}
            {backButton && (
                <div className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center">
                    {backButton}
                </div>
            )}

            {/* SEARCH BAR (TECH-HUERTA V12 CANÒNICA) */}
            <div className="flex items-center flex-1 h-[36px] bg-white rounded-[24px] overflow-hidden focus-within:ring-2 focus-within:ring-[#169CF9] transition-all group">
                <div className="flex items-center justify-center pl-4 pr-2 h-full">
                    <Search
                        size={18}
                        strokeWidth={3}
                        className="text-gray-400 group-focus-within:text-[#F97316] dark:group-focus-within:text-[#4F46E5] transition-colors"
                    />
                </div>
                <input
                    ref={ref}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder.toUpperCase()}
                    className="font-sans flex-1 w-full h-full bg-transparent text-gray-900 pr-2 py-0 m-0 text-[14px] leading-none font-bold outline-none placeholder:text-gray-800 placeholder:font-bold"
                />
                
                {/* EXTRA ACTIONS */}
                {extraActions && (
                    <div className="flex items-center pr-2 gap-2 shrink-0">
                        {extraActions}
                    </div>
                )}

                {/* CLEAR SEARCH BUTTON */}
                {searchTerm && (
                    <button 
                        onClick={handleSearchClear} 
                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-[#F97316] transition-colors shrink-0"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* VIEW MODE SWITCH */}
            {onViewModeChange && (
            <div className="hidden sm:flex items-center bg-black/20 dark:bg-white/10 p-1 rounded-full gap-1 ml-3 shrink-0">
                <button
                    onClick={() => { onViewModeChange('single'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'single' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Completa (1 Columna)"
                >
                    <Square size={16} strokeWidth={viewMode === 'single' ? 3 : 2} />
                </button>
                <button
                    onClick={() => { 
                        onViewModeChange('grid'); 
                        if (hapticService) hapticService.trigger(); 
                    }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'grid' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Quadrícula"
                >
                    <LayoutGrid size={16} strokeWidth={viewMode === 'grid' ? 3 : 2} />
                </button>
                <button
                    onClick={() => { onViewModeChange('list'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'list' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Llistat Compacte"
                >
                    <List size={16} strokeWidth={viewMode === 'list' ? 3 : 2} />
                </button>
            </div>
            )}
        </div>
    );
});

export default ContextualHeader;
```

### src/components/SystemActionBar.jsx
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe, MessageCircle, Share2, BookOpen } from 'lucide-react';
import TranslationModal from './TranslationModal';

const SystemActionBar = () => {
    const navigate = useNavigate();
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);
    const [translating, setTranslating] = useState(false);

    return (
        <>
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 shadow-sm overflow-x-auto no-scrollbar transition-colors shrink-0">
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
                                navigator.share({ title: 'Sóc de Poble', text: 'Descobreix la Xarxa Rural de Pobles Connectats', url: window.location.href }).catch(console.error);
                            }
                        }}
                    >
                        <Share2 size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">COMPARTIR</span>
                    </button>

                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Llegir Llibre"
                        onClick={() => navigate('/llibre')}
                    >
                        <BookOpen size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">E-BOOK</span>
                    </button>
                </div>
            </div>

            <TranslationModal 
                isOpen={isTranslationOpen} 
                onClose={() => setIsTranslationOpen(false)} 
                onTranslate={() => {
                    setIsTranslationOpen(false);
                    setTranslating(true);
                    setTimeout(() => setTranslating(false), 2000);
                }}
            />
        </>
    );
};

export default SystemActionBar;
```

### src/pages/MasterCalendar.jsx
```jsx
import { useState, useMemo, useRef, useEffect, useCallback, useDeferredValue } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Brain, ArrowLeft, ArrowRight, Grid, LayoutList, Settings } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import ContextualHeader from '../components/ContextualHeader';
import SystemPageLayout from '../components/SystemPageLayout';
import { useViewMode } from '../hooks/useViewMode';
import { useTranslation } from 'react-i18next';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';
import frLocale from '@fullcalendar/core/locales/fr';
import deLocale from '@fullcalendar/core/locales/de';
import { useDesign } from '../context/DesignContext';
import SEO from '../components/SEO';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { MOCK_EVENTS } from '../data';
import { AGENTS } from '../config/agentsMap';
import { useGoogleAuthCalendar } from '../hooks/useGoogleAuthCalendar';
import { useInternalCalendar } from '../hooks/useInternalCalendar';
import CalendarManagerModal from '../components/CalendarManagerModal';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
import VirtualizedEventFeed from '../components/VirtualizedEventFeed';
import { useRhizomeEvents } from '../hooks/useRhizomeEvents';
import './MasterCalendar.css';

const MasterCalendarContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const { i18n } = useTranslation();
    const { visionMode } = useDesign();

    const fcLocale = useMemo(() => {
        const lang = i18n.language?.toLowerCase().split('-')[0];
        if (lang === 'va' || lang === 'ca') return caLocale;
        if (lang === 'es') return esLocale;
        if (lang === 'fr') return frLocale;
        if (lang === 'de') return deLocale;
        return enLocale;
    }, [i18n.language]);

    const queryParams = new URLSearchParams(location.search);
    const currentRole = queryParams.get('role');

    const { viewMode, setViewMode, columnCount, effectiveViewMode } = useViewMode('calendar_view_mode', 'grid');

    const { 
        calendars, selectedCalIds, toggleCalendar, hostCalId, toggleHost, 
        fetchGoogleEventsRange, login, logout, token 
    } = useGoogleAuthCalendar(currentDate);

    const {
        internalCalendars, selectedInternalCalIds, toggleInternalCalendar,
        fetchInternalEventsRange
    } = useInternalCalendar(currentDate);

    const { events: rhizomeEvents } = useRhizomeEvents();

    const [rawEvents, setRawEvents] = useState([]);
    const [currentRangeStr, setCurrentRangeStr] = useState('');

    const fetchAllEventsRange = useCallback(async (range) => {
        if (!range?.startStr) return;
        try {
            const [gEvents, iEvents] = await Promise.all([
                fetchGoogleEventsRange(range.startStr, range.endStr),
                fetchInternalEventsRange(range.startStr, range.endStr)
            ]);
            setRawEvents([...gEvents, ...iEvents]);
        } catch (e) {
            console.error("Calendar fetch error:", e);
        }
    }, [fetchGoogleEventsRange, fetchInternalEventsRange]);

    const handleDatesSet = useCallback((arg) => {
        const newRange = { startStr: arg.start.toISOString(), endStr: arg.end.toISOString() };
        setCurrentDate(arg.view.currentStart);
        setCurrentRangeStr(JSON.stringify(newRange));
    }, []);

    useEffect(() => {
        if (!currentRangeStr) return;
        const range = JSON.parse(currentRangeStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllEventsRange(range);
    }, [selectedCalIds, selectedInternalCalIds, fetchAllEventsRange, currentRangeStr]);

    const { combinedEvents, calendarEvents } = useMemo(() => {
        const isImmersive = visionMode !== 'humana';
        const rawMocks = isImmersive ? [...CALENDAR_EVENTS, ...MOCK_EVENTS] : [];
        const range = currentRangeStr ? JSON.parse(currentRangeStr) : { startStr: '1970-01-01', endStr: '2100-01-01' };
        const startR = new Date(range.startStr);
        const endR = new Date(range.endStr);

        const mEvents = rawMocks.filter(e => {
            const d = new Date(e.date || e.start || e.created_at || 0);
            return d >= startR && d <= endR;
        });

        let combined = [...rawEvents, ...mEvents, ...rhizomeEvents];

        if (currentRole && currentRole !== 'events') {
            combined = combined.filter(e => (e.type || 'personal').toLowerCase() === currentRole.toLowerCase());
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            combined = combined.filter(e => 
                e.title?.toLowerCase().includes(searchLower) || 
                e.description?.toLowerCase().includes(searchLower)
            );
        }

        combined.sort((a, b) => {
            const dateA = new Date(a.date || a.start || a.created_at || 0).getTime();
            const dateB = new Date(b.date || b.start || b.created_at || 0).getTime();
            return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
                   (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
        });

        const calEvents = combined.map(ev => ({
            id: ev.id,
            title: ev.title,
            start: ev.timeStart || ev.date || ev.start || ev.created_at, // Incluir created_at para posts
            allDay: !ev.timeStart,
            extendedProps: {
                description: ev.description,
                agentId: ev.agentId,
                type: ev.type,
                sourceCalendarId: ev.sourceCalendarId,
                emoji: ev.emoji,
                rawDate: ev.date || ev.start || ev.created_at
            },
            backgroundColor: ev.colorId ? 'var(--hud-accent)' : undefined
        }));

        return { combinedEvents: combined, calendarEvents: calEvents };
    }, [rawEvents, visionMode, currentRole, searchTerm, currentRangeStr, rhizomeEvents]);

    const deferredEvents = useDeferredValue(calendarEvents);
    const deferredCombined = useDeferredValue(combinedEvents);
    const calendarRef = useRef(null);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('calendar-events-count', { 
            detail: deferredEvents.length 
        }));
    }, [deferredEvents.length]);

    return (
        <SystemPageLayout
            className="calendar-master-page animate-in"
            containerClassName=""
            mainClassName="flex flex-col relative"
            header={
                <ContextualHeader 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholder="Cerca a l'agenda..."
                    backButton={
                        <button 
                            onClick={() => navigate(-1)}
                            aria-label="Torna enrere"
                            className="flex items-center gap-1 hover:text-white active:scale-95 transition-transform"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    }
                />
            }
        >
            <SEO 
                title="Calendari Master [Simbiosi]" 
                description="L'agenda i carpeta visual d'esdeveniments més innovadora del teu municipi. Connecta la teua vida a la comunitat."
                image="/seo-calendar-m3.png"
                url="/calendari"
            />

            <div className="flex-1 flex flex-col w-full h-full min-h-0">
                <CalendarManagerModal 
                    isOpen={isManagerOpen}
                    onClose={() => setIsManagerOpen(false)}
                    calendars={calendars}
                    selectedCalIds={selectedCalIds}
                    toggleCalendar={toggleCalendar}
                    hostCalId={hostCalId}
                    toggleHost={toggleHost}
                    token={token}
                    login={login}
                    logout={logout}
                    internalCalendars={internalCalendars}
                    selectedInternalCalIds={selectedInternalCalIds}
                    toggleInternalCalendar={toggleInternalCalendar}
                />

                <div className="flex-1 min-h-[600px] relative w-full mb-8">
                    <FullCalendar
                        ref={calendarRef}
                        locale={fcLocale}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        views={{ timeGridFourDay: { type: 'timeGrid', duration: { days: 4 }, buttonText: '4 dies' } }}
                        headerToolbar={{
                            left: 'prev,next today Settings create',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridFourDay,timeGridDay,listWeek'
                        }}
                        customButtons={{
                            Settings: { text: 'G-Cal / Config', click: () => setIsManagerOpen(true) },
                            create: { text: '+ Nou Esdeveniment', click: () => console.log('Open creation modal') }
                        }}
                        datesSet={handleDatesSet}
                        events={deferredEvents}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        height="auto"
                        contentHeight="auto"
                        eventContent={(eventInfo) => {
                            const { extendedProps, title } = eventInfo.event;
                            const agent = extendedProps?.agentId ? AGENTS.find(a => a.id === extendedProps.agentId) : null;
                            const hasAvatar = agent && agent.avatar_url;

                            return (
                                <div 
                                    className={`fc-event-capsule ${extendedProps?.type || 'personal'} flex items-center gap-1 overflow-hidden whitespace-nowrap text-xs p-1 rounded w-full backdrop-blur-md cursor-pointer`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={title}
                                >
                                    {hasAvatar ? (
                                        <img src={agent.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" aria-hidden="true" />
                                    ) : (
                                        <span className="emoji flex items-center justify-center shrink-0" aria-hidden="true">
                                            {extendedProps.emoji || '✨'}
                                        </span>
                                    )}
                                    <span className="truncate">{title}</span>
                                </div>
                            );
                        }}
                        eventClick={(clickInfo) => {
                            if (!clickInfo.event.id.startsWith('MOCK')) {
                                navigate(`/sessio/${clickInfo.event.id.replace('gcal-', '')}`);
                            }
                        }}
                        eventDrop={(dropInfo) => {
                            console.log(`Event ${dropInfo.event.title} dropped to ${dropInfo.event.start}`);
                        }}
                    />
                </div>

                <section className="pb-12 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.05)] pt-8">
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <Brain size={20} className="text-[#F97316]" />
                        <h2 className="text-xl font-black tracking-wider text-theme-text uppercase flex items-center gap-3">
                            ÀNCORES DE MEMÒRIA RECENT
                            <span className="text-sm font-bold bg-theme-accent-primary/10 px-3 py-1 rounded-full text-theme-text/70">
                                {deferredEvents.length} PUBLICACIONS
                            </span>
                        </h2>
                    </div>
                    
                    <VirtualizedEventFeed 
                        effectiveViewMode={effectiveViewMode} 
                        columnCount={columnCount} 
                        events={deferredCombined}
                    />
                </section>
            </div>
        </SystemPageLayout>
    );
};

export default function MasterCalendar() {
    return (
        <GlobalErrorBoundary>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id'}>
                <MasterCalendarContent />
            </GoogleOAuthProvider>
        </GlobalErrorBoundary>
    );
}
```

### src/pages/MasterCalendar.css
```css
/* src/pages/MasterCalendar.css */

/* OPTIMIZACIONES iOS/ANDROID PARA FULLCALENDAR SEGÚN AUDITORÍA DEL ALTO CONSEJO MULTI-MODEL */
.fc {
    contain: layout style;
    will-change: scroll-position;
}

.fc-view-harness {
    content-visibility: auto;
    contain-intrinsic-size: 0 600px;
}

.fc-event {
    will-change: transform;
    transform: translateZ(0); /* Forzar aceleración GPU para animaciones fluidas */
}

/* VIRTUALIZED FEED OPTIMIZATION */
.virtualized-feed-item {
    contain: strict;
    content-visibility: auto;
}

/* Ajustes adicionales para visibilidad y fluidez M3 */
.calendar-master-page .fc-theme-standard th {
    border: none;
    padding: 12px 0;
    font-weight: 700;
    text-transform: uppercase;
    font-family: var(--font-m3);
}

.calendar-master-page .fc-toolbar-title {
    font-size: 1.25rem !important;
    font-weight: 900 !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: var(--font-m3);
}

.calendar-master-page .fc-button-primary {
    background-color: var(--hud-accent) !important;
    border-color: var(--hud-accent) !important;
    border-radius: 9999px !important; /* Full pill shape */
    font-weight: 800 !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 1rem !important;
}

.calendar-master-page .fc-button-primary:not(:disabled):active,
.calendar-master-page .fc-button-primary:not(:disabled).fc-button-active {
    background-color: var(--theme-button-hover) !important;
    border-color: var(--theme-button-hover) !important;
}

.calendar-master-page .fc-daygrid-day-number {
    font-weight: 700;
    font-family: var(--font-m3);
}

.calendar-master-page .fc-theme-standard td, .calendar-master-page .fc-theme-standard th {
    border-color: rgba(128, 128, 128, 0.1);
}

/* ANTI-COLISIÓN DE CABECERAS: Separación de la SystemActionBar global */
.calendar-master-page .fc-header-toolbar {
    padding-top: 1.5rem !important;
    padding-bottom: 0.5rem !important;
    padding-inline: 1rem !important;
    position: relative;
    z-index: 10;
}```

## INSTRUCCIONES DE SALIDA
1. Analiza CÓDIGO COMPLETO, línea por línea.
2. Critica severamente el CSS y la integración. Encuentra POR QUÉ FullCalendar asoma por detrás del SystemActionBar.
3. Danos el snippet de CÓDIGO EXACTO Y DIRECTO para inyectarlo como parche de Antigravity (sea en MasterCalendar.css, Header, etc).
4. Termina tu análisis con la frase "🛡️ BLINDATGE COMPLETAT".
