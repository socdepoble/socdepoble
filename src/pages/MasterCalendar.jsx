/* eslint-disable react-hooks/set-state-in-effect */
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
import { UniversalGridWrapper, UniversalGridRow } from '../components/UniversalGrid';
import { useViewMode } from '../hooks/useViewMode';
import { useTranslation } from 'react-i18next';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';
import frLocale from '@fullcalendar/core/locales/fr';
import deLocale from '@fullcalendar/core/locales/de';
import { useDesign } from '../context/DesignContext';
import UniversalCard from '../components/UniversalCard';
import SEO from '../components/SEO';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { MOCK_EVENTS } from '../data';
import { AGENTS } from '../config/agentsMap';
import { useGoogleAuthCalendar } from '../hooks/useGoogleAuthCalendar';
import { useInternalCalendar } from '../hooks/useInternalCalendar';
import CalendarManagerModal from '../components/CalendarManagerModal';
import UniversalCardFooter from '../components/UniversalCard/UniversalCard.Footer';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
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

    // Filter params
    const queryParams = new URLSearchParams(location.search);
    const currentRole = queryParams.get('role');

    // [MASTER] Centralized view mode manager
    const { viewMode, setViewMode, columnCount, effectiveViewMode } = useViewMode('calendar_view_mode', 'grid');

    // Connexió al cervell de Google Calendar (OAuth2)
    const { 
        calendars, selectedCalIds, toggleCalendar, hostCalId, toggleHost, 
        fetchGoogleEventsRange, login, logout, token 
    } = useGoogleAuthCalendar(currentDate);

    // Xarxa Interna de Sóc de Poble (Calendarios de grupos)
    const {
        internalCalendars, selectedInternalCalIds, toggleInternalCalendar,
        fetchInternalEventsRange
    } = useInternalCalendar(currentDate);

    const [rawEvents, setRawEvents] = useState([]);
    const [currentRange, setCurrentRange] = useState({ startStr: '', endStr: '' });

    const fetchAllEventsRange = useCallback(async (range) => {
        if (!range.startStr) return;
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
        setCurrentRange(newRange);
        fetchAllEventsRange(newRange);
    }, [fetchAllEventsRange]);

    // Refetch ONLY when calendar connection state changes, NOT text search
    useEffect(() => {
        fetchAllEventsRange(currentRange);
    }, [selectedCalIds, selectedInternalCalIds, fetchAllEventsRange, currentRange]);

    const filteredCalendarEvents = useMemo(() => {
        const isImmersive = visionMode !== 'humana';
        const rawMocks = isImmersive ? [...CALENDAR_EVENTS, ...MOCK_EVENTS] : [];
        const startR = new Date(currentRange.startStr || 0);
        const endR = new Date(currentRange.endStr || 0);

        const mEvents = rawMocks.filter(e => {
            const d = new Date(e.date || e.start || e.created_at || 0);
            return d >= startR && d <= endR;
        });

        let combined = [...rawEvents, ...mEvents];
        
        // Client-side Post-filtering
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

        // Fallback Sort for UniversalCard (FullCalendar autoselects dates natively)
        // Add NaN safety by using Number.MAX_SAFE_INTEGER.
        combined.sort((a, b) => {
            let dateA = new Date(a.date || a.start || a.created_at || 0).getTime();
            let dateB = new Date(b.date || b.start || b.created_at || 0).getTime();
            if (isNaN(dateA)) dateA = Number.MAX_SAFE_INTEGER;
            if (isNaN(dateB)) dateB = Number.MAX_SAFE_INTEGER;
            return dateA - dateB;
        });

        // Convert to FC Event Objects
        return combined.map(ev => {
            const isAllDay = !ev.timeStart;
            return {
                id: ev.id,
                title: ev.title,
                start: ev.timeStart || ev.date || ev.start,
                allDay: isAllDay,
                extendedProps: {
                    description: ev.description,
                    agentId: ev.agentId,
                    type: ev.type,
                    sourceCalendarId: ev.sourceCalendarId,
                    emoji: ev.emoji,
                    rawDate: ev.date || ev.start // preserve raw date for external hooks
                },
                backgroundColor: ev.colorId ? 'var(--hud-accent)' : undefined
            };
        });
    }, [rawEvents, visionMode, currentRole, searchTerm, currentRange.startStr, currentRange.endStr]);

    const deferredEvents = useDeferredValue(filteredCalendarEvents);
    const calendarRef = useRef(null);

    // Update ContextualMenu Counter
    useEffect(() => {
        // We use deferred Events to send count event
        window.dispatchEvent(new CustomEvent('calendar-events-count', { detail: deferredEvents.length }));
    }, [deferredEvents.length]);
    return (
        <div className="calendar-master-page animate-in flex flex-col min-h-full">
            <SEO 
                title="Calendari Master [Simbiosi]" 
                description="L'agenda i carpeta visual d'esdeveniments més innovadora del teu municipi. Connecta la teua vida a la comunitat."
                image="/seo-calendar-m3.png"
                url="/calendar"
            />
            
            <ContextualHeader 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                placeholder="Cerca a l'agenda..."
                backButton={<ArrowLeft size={20} className="hover:text-white active:scale-95 transition-transform" onClick={() => navigate(-1)} />}
            />

            <div className="flex-1 flex flex-col w-full h-full">
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

                <div className="flex-1 min-h-[600px] mb-8 relative px-4">
                    <FullCalendar
                        ref={calendarRef}
                        locale={fcLocale}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        views={{
                            timeGridFourDay: {
                                type: 'timeGrid',
                                duration: { days: 4 },
                                buttonText: '4 dies'
                            }
                        }}
                        headerToolbar={{
                            left: 'prev,next today Settings create',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridFourDay,timeGridDay,listWeek'
                        }}
                        customButtons={{
                            Settings: {
                                text: 'G-Cal / Config',
                                click: () => setIsManagerOpen(true)
                            },
                            create: {
                                text: '+ Nou Esdeveniment',
                                click: () => {
                                    // TODO: Lógica per obrir panell de creació
                                    console.log('Open creation modal');
                                }
                            }
                        }}
                        datesSet={handleDatesSet}
                        events={deferredEvents}
                        editable={true} // Permits drag and drop!
                        droppable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        height="auto" // Elimina el scroll intern, s'adapta al contingut
                        contentHeight="auto"
                        eventContent={(eventInfo) => {
                            // Custom Event rendering mapping our "Capsules" visually inside FullCalendar!
                            const { extendedProps, title } = eventInfo.event;
                            const agent = extendedProps?.agentId ? AGENTS.find(a => a.id === extendedProps.agentId) : null;
                            const hasAvatar = agent && agent.avatar_url;

                            return (
                                <div className={`fc-event-capsule ${extendedProps?.type || 'personal'} flex items-center gap-1 overflow-hidden whitespace-nowrap text-xs p-1 rounded w-full backdrop-blur-md cursor-pointer`}>
                                    {hasAvatar ? (
                                        <img src={agent.avatar_url} alt={agent.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <span className="emoji flex items-center justify-center shrink-0">{extendedProps.emoji || '✨'}</span>
                                    )}
                                    <span className="truncate">{title}</span>
                                </div>
                            );
                        }}
                        eventClick={(clickInfo) => {
                            if (!clickInfo.event.id.startsWith('MOCK')) {
                                window.location.href = `/sessio/${clickInfo.event.id.replace('gcal-', '')}`;
                            }
                        }}

                        eventDrop={(dropInfo) => {
                            // Drag And Drop Action Callback
                            console.log(`Event ${dropInfo.event.title} dropped to ${dropInfo.event.start}`);
                        }}
                    />
                </div>

                {/* Franja d'acció inferior estandarditzada estilitzada (ancorada sota l'agenda) */}
                <div className="sticky top-[64px] z-[55] w-full shadow-xl shadow-black/20 mb-8 overflow-hidden">
                    <UniversalCardFooter
                        item={{ id: 'master-calendar', type: 'calendar' }}
                        cardVariant="calendar"
                        displayTitle="Calendari de la Comunitat"
                        isMaster={true}
                        navigate={navigate}
                        handleConnectClick={() => setIsManagerOpen(true)}
                        itemCount={deferredEvents.length}
                        itemCountLabel="PUBLICACIONS"
                    />
                </div>

                <section className="pb-12 px-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain size={20} className="text-[#F97316]" />
                        <h2 className="text-xl font-black tracking-wider text-theme-text uppercase flex items-center gap-3">
                            ÀNCORES DE MEMÒRIA RECENT
                            <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full text-white/70">
                                {deferredEvents.length} PUBLICACIONS
                            </span>
                        </h2>
                    </div>
                    
                    <UniversalGridWrapper viewMode={effectiveViewMode}>
                        <UniversalGridRow viewMode={effectiveViewMode} columnCount={columnCount}>
                            {deferredEvents.slice(0, 100).map(event => (
                                <UniversalCard
                                    key={event.id}
                                    id={event.id}
                                    type={event.type === 'session' ? 'market' : event.type || 'village'}
                                    title={event.title}
                                    description={event.description}
                                    imageUrl={event.image_url}
                                    metadata={{
                                        tag: event.date,
                                        avatar: event.author_avatar,
                                        subTag: `ID: ${event.id.toString().slice(0, 8)}`,
                                        author: event.author_name || 'Project System'
                                    }}
                                    viewMode={effectiveViewMode}
                                    url={`/sessio/${event.id}`}
                                />
                            ))}
                        </UniversalGridRow>
                    </UniversalGridWrapper>
                </section>
            </div>
        </div>
    );
};

const MasterCalendar = () => {
    // Si no hi ha clau (entorn normal de convidats, o .env sense carregar),
    // fiquem un dummy per a que el Provider no explote el Dashboard, però
    // el Pop-up de Google fallarà si s'intenta usar fins que es configure bé.
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || 'dummy-client-id-to-prevent-crash.apps.googleusercontent.com';

    // Wrap del provider d'OAuth2 actiu i aïllat a l'agenda
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GlobalErrorBoundary>
                <MasterCalendarContent />
            </GlobalErrorBoundary>
        </GoogleOAuthProvider>
    );
};

export default MasterCalendar;
