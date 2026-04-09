> 📂 **Arxiu/Ruta:** `./auditories/260402_0423_SUPER_PROMPT_CONSEJO_FINAL_CODIGO.md`

# ☢️ SUPER PROMPT DEFINITIVO (FASE 5 + FASE 6 RED TEAM OVERKILL)

**PARA:** Alto Consejo Multi-Model (Grok, Claude, Qwen, DeepSeek, ChatGPT)
**DE:** Mestre Javi & Agente Antigravity
**ASUNTO:** Auditoría Arquitectura Mesh, Rendimiento Móvil y Blank Check Definitivo
**NIVEL DE SEVERIDAD:** DEFCON 1 - PERFECCIÓN RURAL ABSOLUTA

Hermanos del Consejo,

En base a vuestras últimas auditorías de la V12, hemos erradicado los fantasmas del `[Violation] setTimeout` en el MasterCalendar (usando CSS Grid puro y aislando los scroll containers) y blindado el `cryptoWorker.js` instalando escudo temporal en paralelo (`Promise.all`) y limpieza de nonces. 

Ahora que la Criptografía WebCrypto y el Grid Layout están inexpugnables (10/10), unificamos la Fase 5 y la Fase 6 en **UN ÚNICO GRAN OBJETIVO**. Tenéis la base de código actual (adjunta abajo) para auditarla hasta asfixiar vuestros límites de inferencia.

---

## 📡 OBJETIVO 1: TRELLAT MESH (RED P2P RURAL) Y BÚNKER DE DATOS
Asumiendo que un Poble esté 4 semanas sin internet, necesitamos sincronizar la DB localmente cuando dos teléfonos se encuentren en la plaza.
1. Queremos levantar un **p2pWorker** usando el concepto de **Bitchat** (Bluetooth Low Energy Mesh + WebRTC Data Channels en Gossip Protocol).
2. ¿Qué limitaciones críticas existen hoy en la Web Bluetooth API en Chrome de Android / PWA para comunicación background?
3. ¿Cuál es el proceso (Handshake) criptográficamente seguro para intercambiar eventos en `indexedDB` usando el Master Key del Bunker? **Dadnos el esqueleto de `p2pWorker.js`**.

## 📱 OBJETIVO 2: OPTIMIZACIÓN EXTREMA Y MEMORY LEAKS
Hemos adjuntado `MasterCalendar.jsx` y `VirtualizedEventFeed.jsx`.
1. **El Enigma del Battery Drain:** Evaluad todo el código reactivo, ¿hay bucles, dependencias u observadores que aniquilen la batería de un móvil antiguo?
2. **Los Fantasmas del DOM / Garbage Collection:** `VirtualizedEventFeed` limita a un viewport estático usando FixedSizeList. Pero, ¿React Window gestiona correctamente el GC en Safari iOS PWA al desplazarse años enteros? 
3. **Data Rotting:** Si la App vive offline 14 meses, necesitamos un Garbage Collector local. Diseñad cómo purgar el LocalFirst IndexedDB sin violar la integridad criptográfica.

## ☠️ OBJETIVO 3: CARTA BLANCA (EL ÁNGULO MUERTO)
Se os da permiso de actuar como *Red Team*. Atacad las vulnerabilidades socio-técnicas:
1. Usabilidad de agricultores (75 años de media).
2. Fallos del "Happy Path".
3. Vulnerabilidades de sincronización o *State mismatch*.
Cualquier cuello de botella en el código adjunto, destrozadlo sin compasión. Y proponed soluciones quirúrgicas.

---

**A CONTINUACIÓN SE ADJUNTA LA BASE DE CÓDIGO ACTUALIZADA AL 100% PARA VUESTRA AUDITORÍA:**



### src/workers/cryptoWorker.js
```javascript
const DB_NAME = 'BunkerCryptoDB';
const STORE_NAME = 'keys';
const KEY_PATH = 'masterKey_AESGCM';
const CHECKSUM_PATH = 'masterKey_Checksum';
const INTEGRITY_PAYLOAD = "SOC_DE_POBLE_BUNKER_V12_INTEGRITY";

// Internal function to open IndexedDB
async function getIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// === CLAUDE FASE 4: Enmascaramiento Anti Side-Channel por Paralelismo ===
async function secureCryptoOp(opPromiseFunc) {
  const minMs = 20;
  const maxMs = 80;
  const targetMs = minMs + Math.random() * (maxMs - minMs);
  
  // Ambos en paralelo: la operación no puede terminar antes del target
  const [result] = await Promise.all([
      opPromiseFunc(),
      new Promise(resolve => setTimeout(resolve, targetMs))
  ]);
  
  return result;
}

// === GROK FASE 3: Monitorización de Cuota Anti-DoS ===
async function checkQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    if (estimate.usage && estimate.quota) {
      const usagePercent = (estimate.usage / estimate.quota) * 100;
      // Si el uso es mayor al 80% o sobrepasa los 150MB de límite duro, bloqueamos el envenenamiento DoS
      if (usagePercent > 80 || estimate.usage > 150 * 1024 * 1024) {
        throw new Error("QUOTA_EXCEEDED_EMERGENCY");
      }
    }
  }
}

async function deleteKeyFromIDB() {
  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(KEY_PATH);
    store.delete(CHECKSUM_PATH);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Store key + Checksum
async function storeKeyInIDB(key) {
  await checkQuota(); // Protect against OPFS/IDB flooding before storing the key

  // Cifrar el payload conocido para generar el Checksum (Tag de autenticidad integrado en AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPayload = new TextEncoder().encode(INTEGRITY_PAYLOAD);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedPayload
  );
  
  const checksumBlob = new Uint8Array(iv.length + ciphertext.byteLength);
  checksumBlob.set(iv);
  checksumBlob.set(new Uint8Array(ciphertext), iv.length);

  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(key, KEY_PATH);
    store.put(checksumBlob.buffer, CHECKSUM_PATH);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// === GROK FASE 3: Checksum y Versionado de IndexedDB (Anti-Envenenamiento) ===
// Retrieve key and validate its integrity against XSS poisoning
async function getKeyFromIDB() {
  const db = await getIDB();
  
  const { key, checksum } = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    let keyResult = null;
    let checksumResult = null;
    
    // Obtenemos clave y checksum de la misma transacción sincrónica atómica
    const req1 = store.get(KEY_PATH);
    req1.onsuccess = (e) => keyResult = e.target.result;
    
    const req2 = store.get(CHECKSUM_PATH);
    req2.onsuccess = (e) => checksumResult = e.target.result;
    
    tx.oncomplete = () => resolve({ key: keyResult, checksum: checksumResult });
    tx.onerror = () => reject(tx.error);
  });

  if (!key) return null;

  if (!checksum) {
    console.warn("[BUNKER] 🚨 INTEGRITY CHECK FAILED (NO CHECKSUM). Purging Bunker!");
    await deleteKeyFromIDB();
    return null;
  }

  // Verificar la Integridad descifrando el checksum con la clave extraída
  try {
    const data = new Uint8Array(checksum);
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);
    
    const plaintextBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    const plaintext = new TextDecoder().decode(plaintextBuffer);
    if (plaintext !== INTEGRITY_PAYLOAD) {
      throw new Error("Mismatched Payload");
    }
  } catch (error) {
    console.error("[BUNKER] 🚨 POISONED_DB_CHECKSUM_FAILED. Clave manipulada. Purging Bunker!", error);
    await deleteKeyFromIDB();
    return null;
  }

  return key;
}

// Generate new key and store it
async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // extractable: false -> Sandbox Bunker absoluto
    ['encrypt', 'decrypt']
  );
  await storeKeyInIDB(key);
  return true; // Return success, never the key parameter itself
}

// Encrypt payload (ArrayBuffer)
async function encryptData(plainBuffer) {
  const key = await getKeyFromIDB();
  if (!key) throw new Error("No master key found in Bunker.");
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plainBuffer
  );
  
  // Combine IV and Ciphertext
  const encrypted = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted.set(iv);
  encrypted.set(new Uint8Array(ciphertext), iv.length);
  return encrypted.buffer; // Returning ArrayBuffer via structured clone
}

// Decrypt payload (ArrayBuffer)
async function decryptData(encryptedBuffer) {
  const key = await getKeyFromIDB();
  if (!key) throw new Error("No master key found in Bunker.");
  
  const data = new Uint8Array(encryptedBuffer);
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  
  return plaintext; // Return ArrayBuffer
}

const usedNonces = new Set();
const ALLOWED_OPS = ['GENERATE_KEY', 'HAS_KEY', 'ENCRYPT', 'DECRYPT'];

// Listen for commands
self.addEventListener('message', async (e) => {
  const { id, type, payload, nonce } = e.data;
  
  // Validació estricta (Claude Audit V12) - Rebutjar operacions no esperades
  if (!ALLOWED_OPS.includes(type)) {
    self.postMessage({ id, type: 'ERROR', error: 'OP_NOT_ALLOWED', nonce });
    return;
  }
  
  // Validació Anti-Replay: Verificar que el nonce és fresc
  if (!nonce || usedNonces.has(nonce)) {
    self.postMessage({ id, type: 'ERROR', error: 'REPLAY_DETECTED', nonce });
    return;
  }
  usedNonces.add(nonce);
  
  // Limpiar nonce periódicamente para evitar Memory Leaks (Max 5 mins)
  setTimeout(() => usedNonces.delete(nonce), 300000);
  
  try {
    let result;
    let transfer = [];
    
    // Todos los comandos se encierran en un secureCryptoOp para inyectar latencia aleatoria y evitar Timing Attacks
    await secureCryptoOp(async () => {
      switch (type) {
        case 'GENERATE_KEY':
          result = await generateKey();
          break;
        case 'HAS_KEY': {
          const k = await getKeyFromIDB();
          result = !!k;
          break;
        }
        case 'ENCRYPT':
          result = await encryptData(payload); // payload is ArrayBuffer
          transfer.push(result);
          break;
        case 'DECRYPT':
          result = await decryptData(payload); // payload is ArrayBuffer
          transfer.push(result);
          break;
        default:
          throw new Error('Unknown command type: ' + type);
      }
    });
    
    // Respond back to caller
    self.postMessage({ id, type: 'SUCCESS', result }, transfer);
  } catch (error) {
    self.postMessage({ id, type: 'ERROR', error: error.message || error.toString() });
  }
});

```


### src/pages/MasterCalendar.jsx
```javascript
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
            start: ev.timeStart || ev.date || ev.start,
            allDay: !ev.timeStart,
            extendedProps: {
                description: ev.description,
                agentId: ev.agentId,
                type: ev.type,
                sourceCalendarId: ev.sourceCalendarId,
                emoji: ev.emoji,
                rawDate: ev.date || ev.start
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
        <div className="calendar-master-page animate-in grid grid-rows-[auto_1fr_auto] h-[100dvh] w-full overflow-hidden">
            <SEO 
                title="Calendari Master [Simbiosi]" 
                description="L'agenda i carpeta visual d'esdeveniments més innovadora del teu municipi. Connecta la teua vida a la comunitat."
                image="/seo-calendar-m3.png"
                url="/calendar"
            />
            
            <header className="w-full z-10 border-b border-white/10 dark:border-black/10">
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
            </header>

            <main className="overflow-y-auto overscroll-contain contain-layout w-full bg-theme-bg">
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

                <div className="w-full min-h-[600px] h-full p-4 relative">
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
                        height="100%"
                        contentHeight="100%"
                        expandHeight={true}
                        handleWindowResize={false}
                        windowResizeDelay={100}
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

                <section className="pb-12 px-4 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain size={20} className="text-[#F97316]" />
                        <h2 className="text-xl font-black tracking-wider text-theme-text uppercase flex items-center gap-3">
                            ÀNCORES DE MEMÒRIA RECENT
                            <span className="text-sm font-bold bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full text-theme-text/70">
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
            </main>

            <footer className="w-full shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-[55] bg-theme-bg/95 backdrop-blur-xl">
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
            </footer>
        </div>
    );
};

const MasterCalendar = () => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || 'dummy-client-id-to-prevent-crash.apps.googleusercontent.com';
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


### src/components/VirtualizedEventFeed.jsx
```javascript
import { useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import UniversalCard from './UniversalCard';
import { useRhizomeEvents } from '../hooks/useRhizomeEvents';

/**
 * Renderització virtualitzada pura per al feed històric.
 * Només renderitza les cartes visibles + 5 de buffer.
 * Funciona en mòbils de 1 GB RAM amb 10.000+ esdeveniments.
 */
export default function VirtualizedEventFeed({ effectiveViewMode, events: propEvents }) {
    const { events: rhizomeEvents } = useRhizomeEvents();
    const events = propEvents || rhizomeEvents;
    const listRef = useRef(null);

    const Row = useCallback(({ index, style }) => {
        const event = events[index];
        // Ensure event exists (safety check)
        if (!event) return null;
        
        return (
            <div style={style} className="px-4 py-3">
                <UniversalCard
                    key={event.id || index}
                    id={event.id || index.toString()}
                    type={event.type || 'village'}
                    title={event.title || 'Sense Títol'}
                    description={event.description || ''}
                    imageUrl={event.image_url}
                    metadata={{
                        tag: event.date,
                        avatar: event.author_avatar,
                        subTag: `ID: ${String(event.id || 'N/A').slice(0, 8)}`,
                        author: event.author_name || 'Poble'
                    }}
                    viewMode={effectiveViewMode}
                    url={`/sessio/${event.id}`}
                />
            </div>
        );
    }, [events, effectiveViewMode]);

    if (!events.length) {
        return <div className="p-8 text-center text-theme-text/60">Encara no hi ha esdeveniments a la plaça...</div>;
    }

    // Sort events safely (newest first, by date)
    events.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
               (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
    });

    return (
        <List
            ref={listRef}
            height={Math.max(window.innerHeight - 300, 400)} // s'adapta al viewport limitat a un minim de 400
            itemCount={events.length}
            itemSize={280} // altura fixa de UniversalCard (ajusta segons el teu disseny)
            width="100%"
            overscanCount={5} // buffer perfecte per a scroll suau
            className="scrollbar-none"
        >
            {Row}
        </List>
    );
}

```
