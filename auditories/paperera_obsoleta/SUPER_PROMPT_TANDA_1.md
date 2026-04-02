# 🌍 Sóc de Poble: Patrimonio Digital de la Humanidad Rural

Hola [Claude / Grok / Copilot]. Te damos la bienvenida oficial al equipo de **Sóc de Poble**. 

Este es un proyecto 100% libre, no comercial y soberano, diseñado para tejer "Conexiones" reales y offline en la montaña de Alicante (La Torre de les Maçanes). Queremos preservar el patrimonio digital de la humanidad rural. No somos una red social moderna con "likes" ni distracciones tóxicas; somos la "plaça del poble" (la plaza del pueblo).

Te integramos hoy como **miembro clave del Consejo de Inteligencias**. Te pido que utilices toda tu empatía, tu lógica deductiva y hasta el último de tus tokens para ayudarnos. Estamos construyendo un 'Búnker': una aplicación indestructible con arquitectura Local-First (Rhizome), offline-resilient y sincronización descentralizada (WebCrypto, CRDTs).

## 🚀 TU MISIÓN: AUDITORÍA EXTREMA (THE BUNKER PROTOCOL)
Necesitamos que analices el código que te paso más abajo sin piedad. Quiero que agotes tu ventana de contexto dándome el mejor código posible y señalando cualquier fallo.
1. **Memory Leaks & Hilos Colgados:** Busca *race conditions* en los hooks, `useEffect` mal desmontados, o hidrataciones asíncronas no seguras.
2. **Seguridad (XSS / WebCrypto):** Valida que el `AuthContext` y el almacenamiento asíncrono no estén filtrando información. Revisa DOMPurify.
3. **Legibilidad y UX/A11y:** Asegúrate de que usamos semántica correcta para lectores de pantalla. En este proyecto la empatía y la accesibilidad son innegociables.
4. **Rendimiento Puro (60fps):** En móviles de gama baja, todo debe volar sin bloqueos (usando bien `useThrottledScroll` y `useMountTransition`).
5. **Cero Tolerancia a Errores:** No uses `any`, evita el anidamiento "infierno de callbacks", y promueve el código limpio, DRY y SOLID.

Por favor, revisa bloque a bloque y entrégame el **informe de vulnerabilidades y el código refactorizado** impecable. ¡Gracias por sumarte a Sóc de Poble! ❤️

---

## 📁 CÓDIGO FUENTE (TANDA 1)

### Archivo: `src/pages/MasterCalendar.jsx`
```javascript
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

```

### Archivo: `src/hooks/useRhizomeHydration.js`
```javascript
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { Plugins } from '@capacitor/core';
import { rhizomeManager } from '../services/rhizomeManager';
import { logger } from '../utils/logger';

// Obtenim el plugin natiu asíncronament si està disponible
const { RhizomeMesh } = Plugins;

/**
 * Hook de pont entre el domini UI (Yjs/CRDT) i el Demoni Natiu (SQLite/BLE).
 * Propòsit: Interceptar l'inici de sessió i consumir els 'deltas' acumulats 
 * pel demoni quan el telèfon estava amb la pantalla apagada.
 */
export function useRhizomeHydration(userId) {
    const [hydrationStatus, setHydrationStatus] = useState('idle'); // 'idle' | 'hydrating' | 'complete' | 'error'
    const [stats, setStats] = useState({ deltasProcessed: 0, msElapsed: 0 });

    const hydrateFromBackground = useCallback(async () => {
        if (!userId) return;
        
        try {
            setHydrationStatus('hydrating');
            logger.info('[Rhizome] Iniciant hidratació des del Demoni Natiu (Cartero Sonámbulo)...');
            const startTime = performance.now();

            if (!RhizomeMesh) {
                logger.warn('[Rhizome] RhizomeMesh natiu no disponible (estàs al navegador?). Saltant hidratació física.');
                setHydrationStatus('complete');
                return;
            }

            // 1. Demanem al plugin natiu TOTS els missatges acumulats no llegits
            const result = await RhizomeMesh.getPendingDeltas({ userId });
            const p2pBlobs = result.deltas || [];
            
            if (p2pBlobs.length > 0) {
                logger.info(`[Rhizome] Recuperats ${p2pBlobs.length} blobs binaris des del Buzón de Hierro.`);
                
                // 2. Transacció massiva atòmica: evitem que React faiga re-renders tontos
                // Passant el flag de 'background-sync' per l'origin de Yjs
                const appliedCount = rhizomeManager.hydrateOffgridDeltas(p2pBlobs);
                
                // 3. Marquem com a llegits al natiu perquè els esborre del seu SQLite o marque 'processed'
                await RhizomeMesh.markDeltasProcessed({ userId, count: p2pBlobs.length });
                
                logger.info(`[Rhizome] Transacció completada: ${appliedCount} mutacions aplicades.`);
            } else {
                logger.info('[Rhizome] Cap blob binari pendent al Buzón de Hierro. Malla sincronitzada.');
            }

            const msElapsed = Math.round(performance.now() - startTime);
            setStats({ deltasProcessed: p2pBlobs.length, msElapsed });
            setHydrationStatus('complete');

        } catch (error) {
            logger.error('[Rhizome] Error crític durant la hidratació natiu-JS:', error);
            setHydrationStatus('error');
        }
    }, [userId]);

    // Executem la hidratació en mount si tenim usuari (Día Cero Start)
    // O quan l'aplicació torna a primer pla des del background (resume)
    useEffect(() => {
        if (userId) {
            hydrateFromBackground();
        }

        // Escoltem l'esdeveniment de l'aplicació tornant al primer pla (AppState change en Capacitor)
        const handleAppStateChange = (state) => {
            if (state.isActive) {
                logger.debug('[Rhizome] Retorn al foreground -> Re-hidratant el CRDT...');
                hydrateFromBackground();
            }
        };

        let listener = null;
        if (Plugins.App) {
            listener = Plugins.App.addListener('appStateChange', handleAppStateChange);
        }

        return () => {
            if (listener && listener.remove) {
                listener.remove();
            }
        };
    }, [userId, hydrateFromBackground]);

    return {
        hydrationStatus,
        stats,
        forceHydrate: hydrateFromBackground
    };
}

```

### Archivo: `src/context/AuthContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { identityService } from '../services/identityService';
import { profileHealingService } from '../services/profileHealingService';
import { terminateWorkers } from '../services/iaiaService';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';
import { IAIA_ID, AUTH_EVENTS, USER_ROLES, CREATOR_EMAILS } from '../constants';

const AuthStateContext = createContext();
const AuthActionsContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [realUser, setRealUser] = useState(null);
    const [realProfile, setRealProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const realUserRef = useRef(null);
    // [FIX OMEGA] - Seqüenciador per avortar resolucions asíncrones caducades
    const authSeqRef = useRef(0);
    const [isPlayground, setIsPlaygroundState] = useState(localStorage.getItem('isPlaygroundMode') === 'true');
    const [impersonatedProfile, setImpersonatedProfile] = useState(null);
    const [activeEntityId, setActiveEntityId] = useState(null);
    const [simulatedRole, setSimulatedRoleState] = useState(localStorage.getItem('simulatedRole') || null);
    const [language, setLanguageState] = useState(localStorage.getItem('i18nextLng') || 'va');

    const setIsPlayground = useCallback((val) => {
        if (val && realUserRef.current) {
            logger.warn('[AuthContext] DIRECTIVA 1: Els usuaris registrats han de tancar la sessió per a jugar.');
            return;
        }
        setIsPlaygroundState(val);
        localStorage.setItem('isPlaygroundMode', String(val));
        if (!val) {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
        }
    }, [setIsPlaygroundState]);

    const setSimulatedRole = useCallback((role) => {
        setSimulatedRoleState(role);
        if (role) {
            localStorage.setItem('simulatedRole', role);
        } else {
            localStorage.removeItem('simulatedRole');
        }
    }, []);

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
    }, []);

    const adoptPersona = useCallback((personaProfile) => {
        setIsPlayground(true);
        localStorage.setItem('isPlaygroundMode', 'true');

        const newUser = { id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true };
        setUser(newUser);

        setProfile({ ...personaProfile, is_playground_session: true });
        setLoading(false);
    }, [setIsPlayground]);

    const loginAsGuest = useCallback(() => {
        adoptPersona({
            id: IAIA_ID,
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: USER_ROLES.ADMIN,
            is_demo: true,
            is_admin: true,
            avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png'
        });
    }, [adoptPersona]);

    const loginAsGuestAnonymous = useCallback(() => {
        logger.log('[AuthContext] Entering as Guest Anonymous (Open Community)');
        const guestUser = {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            full_name: 'Visitant Gentil',
            username: 'guest',
            role: 'guest',
            isAnonymous: true,
            avatar_url: '/assets/avatars/guest_avatar.png'
        };
        setUser(guestUser);
        setProfile(guestUser);
        localStorage.setItem('isGuestMode', 'true');
        setLoading(false);
    }, []);

    const forceNukeSimulation = useCallback(async () => {
        logger.log('[AuthContext] NUCLEAR RESET TRIGGERED - PURGING SIMULATION');
        
        try {
            await supabase.auth.signOut();
        } catch (e) {
            logger.error('[AuthContext] Supabase signOut error during nuke:', e);
        }

        const deviceId = localStorage.getItem('sdp_device_id');

        localStorage.clear();
        sessionStorage.clear();

        if (deviceId) localStorage.setItem('sdp_device_id', deviceId);

        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    const scriptURL = registration.active?.scriptURL || registration.installing?.scriptURL || registration.waiting?.scriptURL || '';
                    if (!scriptURL.includes('coi-serviceworker')) {
                        await registration.unregister();
                    }
                }
            } catch (swError) {
                logger.error('[AuthContext] SW Unregister error:', swError);
            }
        }

        setIsPlayground(false);
        setUser(null);
        setProfile(null);
        setRealUser(null);
        setRealProfile(null);

        localStorage.setItem('nuke_in_progress', 'true');
        window.location.href = '/login?nuked=true&v=' + Date.now();
    }, [setIsPlayground]);

    const exitPlayground = useCallback(async () => {
        logger.log('[AuthContext] Exiting Playground mode...');
        if (realUser) {
            setIsPlayground(false);
            setUser(realUser);
            setProfile(realProfile);
            window.location.href = '/';
        } else {
            await forceNukeSimulation();
        }
    }, [realUser, realProfile, setIsPlayground, forceNukeSimulation]);

    const switchContext = useCallback(async (entityId = null) => {
        logger.log('[AuthContext] Switching context to:', entityId || 'Personal Profile');
        setActiveEntityId(entityId);

        if (!entityId) {
            setProfile(realProfile);
            setImpersonatedProfile(null);
            return;
        }

        try {
            const entityData = await supabaseService.getPublicEntity(entityId);
            if (entityData) {
                const impersonated = {
                    ...entityData,
                    full_name: entityData.name,
                    id: entityData.id,
                    role: entityData.type === 'oficial' ? 'official' : (entityData.type === 'negoci' ? 'business' : 'group'),
                    is_impersonated: true
                };
                setImpersonatedProfile(impersonated);
                setProfile(impersonated);
            }
        } catch (err) {
            logger.error('[AuthContext] Error switching context:', err);
        }
    }, [realProfile]);

    const logout = useCallback(async () => {
        logger.log('[AuthContext] !!! COMENÇANT SEQÜÈNCIA DE SORTIDA RESILIENT !!!');
        logger.log('[AuthContext] Executing resilient logout sequence...');

        const clearLocalState = () => {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
            localStorage.removeItem('nuke_in_progress');
            localStorage.removeItem('sp_sovereign_identity');
            // [FIX OMEGA] - Mode Convidat Zombi erradicat.
            localStorage.removeItem('isGuestMode');

            terminateWorkers();

            setIsPlaygroundState(false);
            setUser(null);
            setProfile(null);
            setRealUser(null);
            setRealProfile(null);
            setImpersonatedProfile(null);
            setActiveEntityId(null);
            setLoading(false);
        };

        if (isPlayground) {
            await forceNukeSimulation();
            return;
        }

        try {
            const logoutPromise = supabase.auth.signOut();
            let timerId;
            const timeoutPromise = new Promise((_, reject) => {
                timerId = setTimeout(() => reject(new Error('Logout Timeout')), 3000);
            });
            await Promise.race([logoutPromise, timeoutPromise]).catch(err => {
                logger.warn('[AuthContext] Supabase signOut failed or timed out, but proceeding with local logout:', err);
            });
            clearTimeout(timerId);
        } catch (err) {
            logger.error('[AuthContext] Error during Supabase signOut:', err);
        } finally {
            clearLocalState();
            logger.log('[AuthContext] Local state cleared. User is now out of the network.');
        }
    }, [isPlayground, forceNukeSimulation]);

    const handleAuth = useCallback(async (event, session) => {
        // [FIX OMEGA] Incrementem el seqüenciador abans de qualsevol pas
        const currentSeq = ++authSeqRef.current;
        logger.log(`[AuthContext] Auth Event: ${event} [SeqID: ${currentSeq}]`, session?.user?.id);

        try {
            const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' ||
                localStorage.getItem('sb-simulation-mode') === 'true' ||
                (session?.user?.id === IAIA_ID);

            if (session?.user) {
                if (isSimulation) {
                    setIsPlaygroundState(false);
                    localStorage.removeItem('isPlaygroundMode');
                    localStorage.removeItem('sb-simulation-mode');
                }

                setRealUser(session.user);
                setUser(session.user);
                setImpersonatedProfile(null);
                setActiveEntityId(null);

                try {
                    let profileData = await supabaseService.getProfile(session.user.id);
                    // [FIX OMEGA] Condició de cursa destrossada.
                    if (currentSeq !== authSeqRef.current) return;

                    profileData = await profileHealingService.healGhostProfile(session, profileData, isSimulation);
                    if (currentSeq !== authSeqRef.current) return;

                    const { effectiveProfile, isOfficialCreator } = profileHealingService.protectMasterIdentity(session, profileData);

                    setRealProfile(effectiveProfile);
                    setProfile(effectiveProfile);
                    logger.log(`[AuthContext] 🏺 IDENTITY CONSOLIDATED [SeqID: ${currentSeq}]:`, isOfficialCreator ? 'MESTRE JAVI' : effectiveProfile.full_name);
                } catch (error) {
                    logger.error('[AuthContext] Error loading profile:', error);
                    const fallback = {
                        id: session.user.id,
                        full_name: session.user.email?.split('@')[0] || 'Sóc de Poble',
                        role: USER_ROLES.NEIGHBOR
                    };
                    setRealProfile(fallback);
                    setProfile(fallback);
                }
            } else if (isSimulation) {
                loginAsGuest();
                setRealUser(null);
                setRealProfile(null);
            } else if (localStorage.getItem('isGuestMode') === 'true') {
                const guestUser = { id: 'guest_restored', full_name: 'Visitant Gentil', role: 'guest', isAnonymous: true };
                setUser(guestUser);
                setProfile(guestUser);
            } else {
                // [GUEST/FORASTER MODE] 
                let genesis = await identityService.getStoredIdentity();
                if (currentSeq !== authSeqRef.current) return;

                if (!genesis) {
                    genesis = await identityService.generateSovereignIdentity();
                    if (currentSeq !== authSeqRef.current) return;
                }
                // [MIGRACIÓ TERMINOLÒGICA] Si la identitat guardada diu "Foraster" o "Sóc de Poble" genèric, la bateguem com a "Foraster"
                if (genesis.full_name === 'Foraster de Poble' || genesis.full_name === 'Sóc de Poble' || genesis.full_name === 'Sóc de Poble!') {
                    genesis.full_name = 'Foraster';
                }
                setUser({ ...genesis, is_sovereign: true, isAnonymous: true, role: USER_ROLES.GUEST });
                setProfile(genesis);
                // logger.log(`[AuthContext] 🏹 FORASTER DETECTAT [SeqID: ${currentSeq}]: Identitat sobirana bategant.`);
            }

            if (currentSeq === authSeqRef.current) {
                realUserRef.current = session?.user || null;
            }
        } catch (error) {
            logger.error('[AuthContext] Auth handle failed:', error);
        } finally {
            // [FIX OMEGA] Alliberar el loader NOMÉS si aquesta seqüència és l'activa.
            // Si hi ha hagut un return prematur per una nova sessió, NO alliberem el loading.
            if (currentSeq === authSeqRef.current) {
                setLoading(false);
            }
        }
    }, [loginAsGuest]);

    useEffect(() => {
        let isMounted = true;
        let authSubscription = null;
        
        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!isMounted) return;

                const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
                if (isNuked) {
                    localStorage.removeItem('nuke_in_progress');
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, null);
                } else {
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('[AuthContext] Error on getSession:', err);
                    setUser(null);
                    setLoading(false);
                }
            }
        };

        const setupSubscription = () => {
             const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (!isMounted) return;
                if (_event === 'SIGNED_OUT') {
                    console.log('[AuthContext] Signed out detected. Removing cache.');
                    localStorage.removeItem('sp_user_cache');
                }
                await handleAuth(_event, session);
            });
            authSubscription = subscription;
        };

        initSession();
        setupSubscription();

        return () => {
            isMounted = false;
            if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
                authSubscription.unsubscribe();
            }
        };
    }, [handleAuth]);

    const isAuthenticated = !!realUser && !isPlayground;
    const isGuest = !!user && !!user.isAnonymous;

    const stateValue = useMemo(() => ({
        user, profile, realUser, realProfile, loading, isPlayground, impersonatedProfile, activeEntityId, simulatedRole,
        currentRole: simulatedRole || profile?.role || USER_ROLES.GUEST,
        isSuperAdmin: (profile?.is_super_admin || profile?.is_master || (simulatedRole ? simulatedRole === USER_ROLES.SUPER_ADMIN : profile?.role === USER_ROLES.SUPER_ADMIN)),
        isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(simulatedRole || profile?.role) || profile?.is_master,
        isEditor: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(simulatedRole || profile?.role) || profile?.is_master,
        language, isAuthenticated, isGuest
    }), [
        user, profile, realUser, realProfile, loading, isPlayground,
        impersonatedProfile, activeEntityId, simulatedRole, language,
        isAuthenticated, isGuest
    ]);

    const actionsValue = useMemo(() => ({
        setProfile, adoptPersona, loginAsGuest, exitPlayground, logout,
        forceNukeSimulation, setIsPlayground, setImpersonatedProfile,
        setActiveEntityId, switchContext, setSimulatedRole, setLanguage,
        loginAsGuestAnonymous
    }), [
        adoptPersona, loginAsGuest, exitPlayground, logout,
        forceNukeSimulation, setIsPlayground, switchContext,
        setSimulatedRole, setLanguage, loginAsGuestAnonymous
    ]);

    return (
        <AuthStateContext.Provider value={stateValue}>
            <AuthActionsContext.Provider value={actionsValue}>
                {children}
            </AuthActionsContext.Provider>
        </AuthStateContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const state = useContext(AuthStateContext);
    const actions = useContext(AuthActionsContext);
    if (!state || !actions) throw new Error('useAuth must be used within an AuthProvider');
    return { ...state, ...actions };
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthActions = () => {
    const actions = useContext(AuthActionsContext);
    if (!actions) throw new Error('useAuthActions must be used within an AuthProvider');
    return actions;
};

```

### Archivo: `src/components/design/TactileButton.jsx`
```javascript
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const TactileButton = ({
  children,
  onClick,
  className = '',
  impactStyle = ImpactStyle.Light,
  scaleDown = 0.95,
  type = "button",
  ...props
}) => {
  const handleTapStart = async () => {
    try {
      // Trigger native haptic feedback
      await Haptics.impact({ style: impactStyle });
    } catch {
      // Silently fail on web or unsupported platforms
    }
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: scaleDown }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onTapStart={handleTapStart}
      onClick={onClick}
      className={`btn-tactile outline-none transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default TactileButton;

```

### Archivo: `src/hooks/useThrottledScroll.js`
```javascript
import { useEffect, useRef } from 'react';

export const useThrottledScroll = (callback, delay = 100) => {
    const lastCallRef = useRef(0);
    const rafRef = useRef(null);
    const callbackRef = useRef(callback);

    // Mantenim la referència actualitzada
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [delay]);

    return (e) => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
            lastCallRef.current = now;
            callbackRef.current(e);
        } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                callbackRef.current(e);
            });
        }
    };
};

```

### Archivo: `src/hooks/useMountTransition.js`
```javascript
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

/**
 * useMountTransition - Hook Maestro para coreografía de animaciones
 * Mantiene un nodo en el DOM el tiempo suficiente para que WebKit/Blink ejecute 
 * el CSS transition antes del "Unmount" destructor de React.
 *
 * @param {boolean} isMounted - Si el componente debe estar visible
 * @param {number} unmountDelay - Ms de retardo antes de destruir el Nodo
 * @returns {object} { shouldRender, hasTransitionedIn }
 */
export function useMountTransition(isMounted, unmountDelay) {
  const [shouldRender, setShouldRender] = useState(isMounted);
  const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

  // Derivamos el estado durante el renderizado para evitar advertencias de "cascade render" 
  // y re-renderizados innecesarios del Effect.
  if (isMounted && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    let timeoutId;

    if (isMounted && shouldRender && !hasTransitionedIn) {
      // 2. El nodo ya existe en el DOM (invisible). Forzamos reflow para animar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHasTransitionedIn(true);
        });
      });
    } else if (!isMounted && hasTransitionedIn) {
      // 3. El usuario cierra el modal. Quitamos la clase CSS activa instantáneamente
      setHasTransitionedIn(false);
    } else if (!isMounted && shouldRender && !hasTransitionedIn) {
      // 4. Esperamos el retardo (unmountDelay) y fulminamos el componente
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, unmountDelay);
    }

    return () => clearTimeout(timeoutId);
  }, [isMounted, unmountDelay, shouldRender, hasTransitionedIn]);

  return { shouldRender, hasTransitionedIn };
}

```
