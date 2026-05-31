import { useState, useMemo, useRef, useEffect, useCallback, useDeferredValue } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalErrorBoundary from '../../components/core/GlobalErrorBoundary';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Activity, Plus, X, Layers, Ticket, MessageCircle, Store, Globe, Briefcase, Users, Landmark, Building, TreePine, Castle, Check } from 'lucide-react';

const AVAILABLE_CATEGORIES = [
  { id: 'esdeveniments', label: 'Events', icon: Ticket },
  { id: 'mur', label: 'Mur', icon: MessageCircle },
  { id: 'mercat', label: 'Mercat', icon: Store },
  { id: 'pobles', label: 'Pobles', icon: Globe },
  { id: 'comercios', label: 'Comerços i empreses', icon: Briefcase },
  { id: 'asociaciones', label: 'Associacions', icon: Users },
  { id: 'ayuntamientos', label: 'Ajuntaments', icon: Landmark },
  { id: 'entidades', label: 'Entitats', icon: Building },
  { id: 'arboles', label: 'Arbres monumentals', icon: TreePine },
  { id: 'patrimonio', label: 'Patrimoni', icon: Castle }
];

import SystemPageLayout from '../../components/layout/SystemPageLayout';
import ContextualHeader from '../../components/layout/ContextualHeader';
import SEO from '../../components/core/SEO';
import CalendarManagerModal from '../../components/modals/CalendarManagerModal';
import Feed from '../../components/features/Feed';

import { useViewMode } from '../../hooks/useViewMode';
import { useTranslation } from 'react-i18next';
import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';
import frLocale from '@fullcalendar/core/locales/fr';
import deLocale from '@fullcalendar/core/locales/de';
import { useDesign } from '../../app/context/DesignContext';
import { CALENDAR_EVENTS } from '../../data/calendarData';
import { MOCK_EVENTS } from '../../data';
import { AGENTS } from '../../app/config/agentsMap';
import { useGoogleAuthCalendar } from '../../hooks/useGoogleAuthCalendar';
import { useInternalCalendar } from '../../hooks/useInternalCalendar';
import { useRhizomeEvents } from '../../hooks/useRhizomeEvents';
import { useUnifiedFeedData } from '../../hooks/useUnifiedFeedData';
import { useAuth } from '../../app/context/AuthContext';
import './MasterCalendar.css';

const MasterCalendarContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(['esdeveniments']);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const { user, isPlayground } = useAuth();
    const { posts: rawUnifiedPosts } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

    const unifiedPosts = useMemo(() => {
        return rawUnifiedPosts.filter(p => {
            const isEsdeveniment = p.type === 'event_announcement' || p.type === 'esdeveniment';
            const isMur = p.type === 'post' || !p.type;
            const isMercat = p.type === 'mercat';
            const tags = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : [];
            const category = p.category ? p.category.toLowerCase() : '';

            if (selectedCategories.includes('esdeveniments') && isEsdeveniment) return true;
            if (selectedCategories.includes('mur') && isMur) return true;
            if (selectedCategories.includes('mercat') && isMercat) return true;
            
            if (selectedCategories.includes('pobles') && (p.town || tags.some(t => t.includes('poble')))) return true;
            if (selectedCategories.includes('comercios') && (category.includes('comer') || tags.includes('comerç'))) return true;
            if (selectedCategories.includes('asociaciones') && (category.includes('assoc') || tags.includes('associació'))) return true;
            if (selectedCategories.includes('ayuntamientos') && p.type === 'bando') return true;
            if (selectedCategories.includes('entidades') && (category.includes('entitat') || tags.includes('entitat'))) return true;
            
            return false;
        });
    }, [rawUnifiedPosts, selectedCategories]);

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

                {/* Mur Unificat Inferior (Igual que al Mapa) */}
                <div className="unified-feed-container w-full max-w-[1600px] mx-auto mt-6 px-4 md:px-8 bg-transparent relative">
                    <div className="py-4 flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black flex items-center gap-3 text-theme-text tracking-tight">
                            <Activity size={24} className="text-[#F97316]" />
                            Àncores de Memòria Recent
                        </h2>
                        <span className="px-4 py-1.5 bg-theme-panel rounded-[12px] text-xs font-black text-theme-muted tracking-wider uppercase border border-border-master shadow-sm">
                            {unifiedPosts.length} registres
                        </span>
                    </div>

                    {/* Menu de Filtres (Portat des del Mapa) */}
                    <div className="flex gap-2 overflow-x-auto w-full no-scrollbar z-[10] pb-4 mb-2 items-center">
                        <button 
                            onClick={() => setIsFilterModalOpen(true)}
                            className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[#F97316] text-white rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        
                        {AVAILABLE_CATEGORIES.filter(c => selectedCategories.includes(c.id)).map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button 
                                    key={cat.id}
                                    onClick={() => setSelectedCategories(prev => prev.filter(id => id !== cat.id))}
                                    className="flex items-center h-10 px-4 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap group"
                                >
                                    <Icon className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> 
                                    {cat.label}
                                    <X className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Modal de selecció de categories */}
                    {isFilterModalOpen && (
                        <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none p-4 md:p-8">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsFilterModalOpen(false)} />
                            <div className="relative bg-theme-panel w-full max-w-md mx-auto rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] pointer-events-auto flex flex-col animate-slide-up-custom border border-border-master max-h-[80vh]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-theme-text tracking-tight flex items-center gap-2">
                                        <Layers className="w-6 h-6 text-[#F97316]" />
                                        Filtres del Calendari
                                    </h3>
                                    <button onClick={() => setIsFilterModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-base text-theme-text hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 space-y-2 pr-2">
                                    <div className="flex gap-2 mb-4">
                                        <button 
                                            onClick={() => setSelectedCategories(AVAILABLE_CATEGORIES.map(c => c.id))}
                                            className="flex-1 bg-theme-base hover:bg-theme-base/80 text-theme-text text-[15px] font-black py-2.5 rounded-[12px] border border-border-master transition-colors"
                                        >
                                            Tots
                                        </button>
                                        <button 
                                            onClick={() => setSelectedCategories([])}
                                            className="flex-1 bg-theme-base hover:bg-theme-base/80 text-theme-text text-[15px] font-black py-2.5 rounded-[12px] border border-border-master transition-colors"
                                        >
                                            Cap
                                        </button>
                                    </div>
                                    {AVAILABLE_CATEGORIES.map(cat => {
                                        const Icon = cat.icon;
                                        const isSelected = selectedCategories.includes(cat.id);
                                        return (
                                            <button 
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategories(prev => 
                                                        isSelected ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                                    );
                                                }}
                                                className={`w-full flex items-center justify-between p-2 rounded-[16px] transition-all active:scale-95 ${isSelected ? 'bg-theme-base border border-[#F97316] shadow-sm' : 'bg-theme-base/50 border border-transparent hover:bg-theme-base'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#F97316] text-white' : 'bg-theme-panel text-theme-muted'}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className={`font-black text-[14px] tracking-wide ${isSelected ? 'text-[#F97316]' : 'text-theme-text'}`}>
                                                        {cat.label}
                                                    </span>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#F97316] bg-[#F97316]' : 'border-theme-muted'}`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="pt-4 border-t border-border-master">
                                    <button 
                                        onClick={() => setIsFilterModalOpen(false)}
                                        className="w-full bg-[#F97316] text-white font-black rounded-[20px] py-3 shadow-[0_8px_24px_rgba(249,115,22,0.4)] active:scale-95 transition-transform uppercase tracking-wider text-sm"
                                    >
                                        Aplicar Filtres
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                
                    {unifiedPosts.length === 0 ? (
                        <div className="flex justify-center p-12">
                            <span className="animate-pulse text-[#F97316] font-bold tracking-widest text-sm uppercase">Sincronitzant Radar...</span>
                        </div>
                    ) : (
                        <div className="bg-transparent pb-24">
                            <Feed 
                                hideHeader={true} 
                                customPosts={unifiedPosts} 
                                externalViewMode={viewMode} 
                            />
                        </div>
                    )}
                </div>
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
