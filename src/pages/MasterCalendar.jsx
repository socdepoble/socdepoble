import { useState, useMemo, useRef, useEffect, useCallback, useDeferredValue } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Brain, ArrowLeft, ArrowRight, Grid, LayoutList, Settings, Plus, Globe, MessageCircle, Share2 } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import ContextualHeader from '../components/ContextualHeader';
import SystemPageLayout from '../components/SystemPageLayout';
import SystemActionBar from '../components/SystemActionBar';
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
import TranslationModal from '../components/TranslationModal';
import { useRhizomeEvents } from '../hooks/useRhizomeEvents';
import { useUnifiedFeedData } from '../hooks/useUnifiedFeedData';
import { useAuth } from '../context/AuthContext';
import './MasterCalendar.css';

const MasterCalendarContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);

    const { user, isPlayground } = useAuth();
    const { posts: unifiedPosts } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

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

    const { viewMode, setViewMode, columnCount, effectiveViewMode, containerRef } = useViewMode('calendar_view_mode', 'grid');

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

        // Adapta los unifiedPosts para que el calendário visual no se vuelva loco
        // pero que sí aparezcan en el timeline del VirtualizedEventFeed
        const uEvents = (unifiedPosts || []).map(p => ({
            ...p,
            start: p.created_at || p.date,
            date: p.created_at || p.date,
            // Forzamos que los posts no abarroten el calendario (se muestran como dots si acaso)
            // pero que estén íntegros para el feed
            isPost: true
        }));

        // Deduplicar eventos combinados basándose en ID explícito (evitando clashing de React Keys y duplicidad visual)
        const combinedMap = new Map();
        [...rawEvents, ...mEvents, ...rhizomeEvents, ...uEvents].forEach((evt, idx) => {
            const key = String(evt.uuid || evt.id || `temp-${idx}`);
            // Preferir la primera aparición (mEvents/Calendar) antes que el fallback de uEvents
            if (!combinedMap.has(key)) {
                combinedMap.set(key, evt);
            }
        });
        

        let combined = Array.from(combinedMap.values());

        if (currentRole && currentRole !== 'events') {
            combined = combined.filter(e => (e.type || 'personal').toLowerCase() === currentRole.toLowerCase());
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            combined = combined.filter(e => 
                e.title?.toLowerCase().includes(searchLower) || 
                e.description?.toLowerCase().includes(searchLower) ||
                e.content?.toLowerCase().includes(searchLower)
            );
        }

        // Ordenar cronològicament garantint newest first en el timeline
        combined.sort((a, b) => {
            const dateA = new Date(a.date || a.start || a.created_at || 0).getTime();
            const dateB = new Date(b.date || b.start || b.created_at || 0).getTime();
            return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
                   (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
        });

        // Generar calendarEvents exclusivament per al calendari visual (FullCalendar)
        const calEvents = combined.filter(e => !e.isPost).map(ev => ({
            id: String(ev.id || ev.uuid),
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
    }, [rawEvents, visionMode, currentRole, searchTerm, currentRangeStr, rhizomeEvents, unifiedPosts]);

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

                <div className="flex-1 min-h-[600px] relative w-full mb-8 pt-2 max-w-[1500px] mx-auto px-0 md:px-8">
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

                <div className="w-full overflow-hidden sticky top-16 z-40 bg-theme-base">
                   <SystemActionBar hideEbook={true} />
                </div>
                <TranslationModal 
                    isOpen={isTranslationOpen} 
                    onClose={() => setIsTranslationOpen(false)} 
                />


                <section ref={containerRef} className="pb-12 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.05)] pt-8 w-full relative max-w-[1500px] mx-auto px-0 md:px-8">
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
