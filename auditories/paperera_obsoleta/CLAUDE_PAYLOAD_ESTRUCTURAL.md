# AUDITORÍA ESTRUCTURAL Y DE LIMPIEZA EXTREMA (CLAUDE)
**Directiva:** "Fortaleza Arquitectónica Absoluta"

*Copia todo este bloque de texto y envíaselo a Claude junto con los archivos clave del frontend (App.jsx, UniversalCard.jsx, UniversalGrid.jsx, main.jsx y cualquier otro componente principal que consideres frágil).*

---

**PROMPT PARA CLAUDE:**

Actúa como el **Principal Staff Engineer y Head de Arquitectura Frontend** más veterano y estricto de la industria. Tienes una mentalidad de "Código Custodio": tu misión es la legibilidad, la mantenibilidad absoluta y la resiliencia a largo plazo. 

Estamos construyendo **Sóc de Poble**, una plataforma hiper-resiliente para la España Vaciada. Hemos estado iterando rápidamente y sufriendo "traumas bestiales" en la UI: elementos que se rompen en páginas específicas, 'fantasmas' de componentes viejos y layouts que no se adaptan automáticamente a diferentes contenedores (grid/flex). 

Mi objetivo contigo es realizar una **Auditoría Estructural y Limpieza Severa** antes de seguir añadiendo diseño gráfico puro. Quiero tu máxima potencia analítica para que este código base sea lo más robusto que pueda existir. Cuando cambie un elemento clave en el futuro, el sistema entero debe adaptarse sin rechistar.

### TUS MISIONES EN ESTA AUDITORÍA:

**1. Análisis de Fragilidad Estructural:** 
Pasa tu escáner sobre la composición de nuestros Layouts y Componentes (App, Routers, Grids, Cards). ¿Hay cuellos de botella de renderizado? ¿Estamos usando patrones frágiles de React que causarán un reflow masivo o roturas visuales si el contenido es impredecible?

**2. Limpieza Quirúrgica y Deuda Técnica:** 
Identifica todo el código muerto, redundancias innecesarias de props, estados derivables y anti-patrones. Exijo la *Navaja de Ockham* aplicada al código. Menos líneas, más solidez.

**3. Patrones de "Self-Healing" (Autorreparación) y Fallbacks:** 
Para evitar pantallas en blanco, imágenes deformadas o textos desbordados. ¿Nuestros componentes tienen *Error Boundaries* naturales? ¿Nuestras imágenes y textos tienen contenciones (`clamp`, `truncate`, esqueletos) infalibles?

**4. Arquitectura de Estado Limpio:** 
Comprueba si el flujo de datos (Contextos, Prop Drilling) está acoplado de forma peligrosa a la UI. 

**Formato de Respuesta:**
No me des cumplidos, dame **Código Definitivo**. Sé brutalmente honesto.
1. Haz un Diagnóstico Severo (qué estamos haciendo mal a nivel estructural).
2. Propón refactorizaciones concretas y darnos el código limpio y final para los componentes clave.
3. Establece al menos 3 "Mandamientos Estructurales" para el futuro de este repositorio basados en los fallos que encuentres.

Quiero la versión más potente de Claude. Transforma nuestro código en titanio.


### Archivo: src/App.jsx
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

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // [MONITORING] Inicialitzar error tracking
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

    return (
        <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
            <OfflineGate>
                <LocalFirstGate>
                    <AuthGate>
                        <AppLayout />
                        <GlobalModals />
                    </AuthGate>
                </LocalFirstGate>
            </OfflineGate>
            <div id="aria-live-region" aria-live="polite" className="sr-only" />
        </ErrorBoundary>
    );
};

export default App;

```


### Archivo: src/context/LocalFirstStatusContext.jsx
```jsx
import { createContext } from 'react';

export const LocalFirstStatusContext = createContext({ status: "idle" });

```


### Archivo: src/components/gates/LocalFirstGate.jsx
```jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { PowerSyncContext } from "@powersync/react";
import { PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../../powersync/schema";
import { SupabaseConnector } from "../../powersync/connector";
import { LocalFirstStatusContext } from "../../context/LocalFirstStatusContext";
import BrandLogo from "../BrandLogo";
import { useWorkerOrchestrator } from "../../hooks/useWorkerOrchestrator";
import { SyncIndicator } from "../SyncIndicator";
import { WaitingForBackend } from "../boundaries/WaitingForBackend";

// ─── Tipus d'Estat Honests ──────────────────────────────────────────────────
const STATUS = {
  IDLE: "idle",
  READY: "ready",
  DEGRADED: "degraded",
  ERROR: "error",
};

const OPFS_TIMEOUT_MS = 3500;
const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;

export default function LocalFirstGate({ children }) {
  const { syncState, pendingCount } = useWorkerOrchestrator();
  const [status, setStatusState] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);

  const statusRef = useRef(STATUS.IDLE);
  const dbRef = useRef(null);
  const connectorRef = useRef(null);
  const isInitializedRef = useRef(false);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  // === FIX PWA (Efecte Túnel) ===
  // Si tornem a estar online (o idle/ready), netejem la memòria de tancament del banner
  useEffect(() => {
    if (status !== STATUS.DEGRADED && sessionStorage.getItem("sp_degraded_dismissed_until_recovery")) {
      sessionStorage.removeItem("sp_degraded_dismissed_until_recovery");
    }
  }, [status]);

  const contextValue = useMemo(() => ({ status }), [status]);

  const setStatus = (newStatus) => {
    statusRef.current = newStatus;
    setStatusState(newStatus);
  };

  useEffect(() => {

    const initDb = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      // 1. Purga de versió morta (Esquema Migrations)
      // Detectem si l'esquema canvia respecte l'últim conegut
      const currentSchemaVersion = AppSchema.version || "1.0"; // Per defecte o llegit de l'esquema
      const lastSchema = localStorage.getItem("sp_schema_version");
      
      if (lastSchema && lastSchema !== currentSchemaVersion) {
        console.warn(`[Migrations] Esquema canviat de ${lastSchema} a ${currentSchemaVersion}. Purgant OPFS antic.`);
        // No podem esborrar la BD sense instanciar-la o directament usem indexedDB
        // El més segur és esborrar per OPFS manual si podem, però PowerSync esborra si falla.
        try {
            const root = await navigator.storage.getDirectory();
            await root.removeEntry("socdepoble.db", { recursive: true }).catch(() => null);
        } catch(err) {
            console.debug("[Migrations] Cleanup error (safe to ignore):", err);
        }
        localStorage.setItem("sp_schema_version", currentSchemaVersion);
      } else if (!lastSchema) {
        localStorage.setItem("sp_schema_version", currentSchemaVersion);
      }

      if (!dbRef.current) {
        dbRef.current = new PowerSyncDatabase({
          schema: AppSchema,
          database: {
            dbFilename: "socdepoble.db",
            vfs: "OPFSCoopSyncVFS",
          },
          flags: { enableMultiTabs: true },
        });
      }

      if (!connectorRef.current) {
        connectorRef.current = new SupabaseConnector();
      }

      const db = dbRef.current;
      const connector = connectorRef.current;

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT_OPFS")), OPFS_TIMEOUT_MS)
        );

        await Promise.race([db.init(), timeoutPromise]);
        await db.connect(connector);

        setDbInstance(db);
        setStatus(STATUS.READY);
      } catch (err) {
        const isOpfsError = err.message === "TIMEOUT_OPFS" || String(err).toLowerCase().includes("opfs") || String(err).toLowerCase().includes("lock");

        if (isOpfsError) {
          console.warn("[LocalFirstGate] Bypass d'Emergència: Mode degradat actiu (OPFS WriteLock)");
          setDbInstance(dbRef.current);
          setStatus(STATUS.DEGRADED);
        } else {
          console.error("[LocalFirstGate] Error crític PowerSync:", err);
          setErrorMsg(err.message || "Error desconegut d'emmagatzematge.");
          setStatus(STATUS.ERROR);
        }
      }
    };

    initDb();

    // ─── Exponential Backoff per connexió pèrdua de senyal rural ──────────────
    const triggerReconnect = () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      
      const db = dbRef.current;
      const connector = connectorRef.current;
      if (!db || !connector || statusRef.current === STATUS.ERROR || statusRef.current === STATUS.IDLE) return;

      const delay = Math.min(INITIAL_BACKOFF_MS * Math.pow(2, reconnectAttemptRef.current), MAX_BACKOFF_MS);
      console.log(`[LocalFirstGate] Preparant reconnexió en ${delay}ms... (Intent ${reconnectAttemptRef.current + 1})`);

      reconnectTimerRef.current = setTimeout(async () => {
        try {
          await db.connect(connector);
          console.log("[LocalFirstGate] Reconnexió reeixida al backend.");
          reconnectAttemptRef.current = 0; // reset on success
        } catch (err) {
          console.warn("[LocalFirstGate] Reconnexió fallida. Backoff...", err);
          reconnectAttemptRef.current += 1;
          triggerReconnect(); // Try again with longer delay
        }
      }, delay);
    };

    const handleOnline = () => {
      console.log("[LocalFirstGate] 🧢 Cobertura de xarxa recuperada visualment.");
      reconnectAttemptRef.current = 0; // Forcem inici ràpid
      triggerReconnect();
    };

    const handleOffline = () => {
      console.log("[LocalFirstGate] 📶 Cobertura de xarxa perduda visualment.");
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // ─── BeforeUnload OPFS Lock Release ─────────────────────────────────────
    const handleBeforeUnload = () => {
      const db = dbRef.current;
      if (db) {
        console.log("[LocalFirstGate] Alliberant bloqueig OPFS d'emergència.");
        try {
          db.disconnect();
          db.close();
        } catch(err) {
          console.debug("[LocalFirstGate] Cleanup silent error:", err);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, []);

  if (status === STATUS.ERROR) {
    return (
      <div className="bg-[#111827] text-white min-h-screen flex items-center justify-center flex-col p-6 text-center">
        <h2 className="text-[#F97316] font-black text-2xl mb-4">Error Crític d'Emmagatzematge</h2>
        <p className="mb-2 text-gray-300">No s'ha pogut inicialitzar la base de dades local.</p>
        <code className="text-sm bg-black p-3 rounded-[20px] mb-6 text-red-400">{errorMsg}</code>
        <button
          onClick={async () => {
            const db = dbRef.current;
            if (db) { 
                try { await db.disconnectAndClear(); } catch (err) { console.debug(err); } 
            }
            const root = await navigator.storage.getDirectory();
            try { 
                await root.removeEntry("socdepoble.db", { recursive: true }); 
            } catch(err) { console.debug(err); }
            window.location.reload();
          }}
          className="bg-[#F97316] text-white font-bold py-3 px-6 rounded-[28px]"
        >
          Re-bategar el Sistema
        </button>
      </div>
    );
  }

  if (status === STATUS.IDLE) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col relative overflow-hidden" style={{ background: "#0b0b0b" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" />
        <img src="/assets/master/logo-socdepoble-rect.svg" alt="Sóc de Poble" className="h-10 w-auto mb-8 opacity-80 animate-pulse" style={{ filter: "drop-shadow(0 0 10px rgba(0,242,255,0.3))" }} />
        <div className="flex justify-center gap-2 mb-6">
          {[0, 150, 300].map((delay) => (
            <div key={delay} className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
        <p className="text-[#00f2ff] text-[12px] font-black uppercase tracking-[0.2em] opacity-70">Connectant...</p>
      </div>
    );
  }

  return (
    <LocalFirstStatusContext.Provider value={contextValue}>
      <PowerSyncContext.Provider value={dbInstance}>
        <WaitingForBackend>
          {children}
        </WaitingForBackend>
        <SyncIndicator status={syncState} pendingCount={pendingCount} />
      </PowerSyncContext.Provider>
    </LocalFirstStatusContext.Provider>
  );
}

```


### Archivo: src/components/DegradedBanner.jsx
```jsx
import React, { useContext, useState } from "react";
import { LocalFirstStatusContext } from "../context/LocalFirstStatusContext";
import { X } from "lucide-react";

export default function DegradedBanner() {
  const { status } = useContext(LocalFirstStatusContext);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("sp_degraded_dismissed_until_recovery") === "true";
  });

  // Si no està en mode degradat o l'usuari l'ha tancat aquesta sessió, no el mostres
  if (status !== "degraded" || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("sp_degraded_dismissed_until_recovery", "true");
  };

  return (
    <div 
      className="bg-orange-600/90 backdrop-blur-md border-b border-orange-500 text-white px-4 py-3 flex items-start sm:items-center justify-between shadow-sm transition-all duration-200" 
      style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className="flex-1 text-center pr-2 text-[13px] font-bold">
        Mode Sense Connexió · Tanca les pestanyes duplicades per activar la sincronització completa.
      </div>
      <button 
        onClick={handleDismiss} 
        className="p-1 hover:bg-black/20 rounded-full transition-colors flex-shrink-0" 
        aria-label="Tancar avís"
      >
        <X size={16} />
      </button>
    </div>
  );
}

```


### Archivo: src/components/ChatList.jsx
```jsx
import React, { useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Globe,
  Moon,
  Sun,
  Bell,
  MoreVertical,
  MapPin,
  Menu,
  Plus,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import TownSelectorModal from "./TownSelectorModal";
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { AGENTS } from "../constants/agents";
import "./ChatList.css";
import { useTranslation } from "react-i18next";
import { LocalFirstStatusContext } from '../context/LocalFirstStatusContext';
import { chatService } from '../services/chatService';
import DegradedBanner from "./DegradedBanner";

// SOCIAL GRAPH MOCK DATA
const STATIC_AVATARS = {
  'Joanet Serra': '/assets/avatars/comic/joanet_serra_comic.png',
  'Carmen la del Forn': '/assets/avatars/comic/carmen_forn_comic.png',
  'Andreu Soler': '/assets/avatars/comic/andreu_soler_comic.png',
  'Carla Soriano': '/assets/avatars/comic/carla_soriano_comic.png',
  'Elena Popova': '/assets/avatars/comic/elena_popova_comic.png',
  'Beatriz Ortega': '/assets/avatars/comic/beatriz_ortega_comic.png',
  'Joan Batiste': '/assets/avatars/comic/joan_batiste_comic.png',
  'Vicent Ferris': '/assets/avatars/comic/vicent_ferris_comic.png',
  'El Viatjant': '/assets/avatars/comic/avatar_samir_comic.png',
  'Mixa': '/assets/avatars/comic/mixa_comic.png'
};

const GENT_DATA = AGENTS.filter(a => a.tag === 'GENT');
const GRUPS_DATA = [
  { id: 'grup-1', name: 'Comissió de Festes 2024', role: 'Grup Local', avatar_url: '/assets/avatars/comic/avatar_mariamel_comic.png', members: '142 membres', tag: 'COL·LECTIU' },
  { id: 'grup-2', name: 'Sindicat de Regants', role: 'Gestió Aigua', avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png', members: '86 membres', tag: 'COL·LECTIU' },
  { id: 'grup-3', name: 'Grup de Muntanya', role: 'Esports', avatar_url: '/assets/avatars/comic/avatar_samir_comic.png', members: '34 membres', tag: 'COL·LECTIU' },
  { id: 'grup-4', name: 'Banda de Música', role: 'Cultura', avatar_url: '/assets/avatars/comic/avatar_mariamel_comic.png', members: '60 membres', tag: 'COL·LECTIU' }
];
const EMPRESES_DATA = [
  { id: 'emp-1', name: 'El Rentonar Cooperativa', role: 'Agricultura Sostenible', avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png', desc: 'Productes KM0', tag: 'EMPRESA' },
  { id: 'emp-2', name: 'Forn de Dalt', role: 'Forn i Pastisseria', avatar_url: '/assets/avatars/comic/carmen_forn_comic.png', desc: 'Obert des del 1940', tag: 'EMPRESA' },
  { id: 'emp-3', name: 'Cooperativa Agrícola', role: 'Sector Primari', avatar_url: '/assets/avatars/comic/andreu_soler_comic.png', desc: 'Venda a l\'engròs', tag: 'EMPRESA' },
  { id: 'emp-4', name: 'Bar del Poble', role: 'Restauració', avatar_url: '/assets/avatars/comic/avatar_marc_comic.png', desc: 'L\'esmorzar de sempre', tag: 'EMPRESA' }
];
const INSTITUCIONS_DATA = [
  { id: 'inst-1', name: "Simulació de l'Ajuntament", role: 'Administració Local', avatar_url: '/assets/avatars/comic/nano_ajuntament_comic.png', desc: 'Tràmits i avisos', tag: 'ADMIN' },
  { id: 'inst-2', name: "Simulació de l'Escola", role: 'Educació', avatar_url: '/assets/avatars/comic/nano_escola_comic.png', desc: 'CEIP El Mas', tag: 'ADMIN' },
  { id: 'inst-3', name: 'Simulació Centre de Salut', role: 'Sanitat', avatar_url: '/assets/avatars/comic/nano_salut_comic.png', desc: 'Atenció primària', tag: 'ADMIN' }
];

const ChatList = () => {
  const { iaiaLevel } = useDesign();
  const { enabledAgentIds } = useNavigation();
  const { user, isSuperAdmin } = useAuth();
  const { visionMode } = useDesign();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [chats, setChats] = useState([]);
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Consumimos el contexto para saber si el scroll necesita ajustarse al banner
  const { status } = useContext(LocalFirstStatusContext);
  const isDegraded = status === 'degraded' && sessionStorage.getItem("sp_degraded_dismissed_until_recovery") !== "true";
  
  const currentTab = new URLSearchParams(location.search).get('tab') || 'xat';

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      try {
        const dbConvs = await chatService.getConversations(user.id);
        
        // [HEALING PROTOCOL] Reparem converses de BD antigues que han perdut l'avatar o l'ID de l'agent
        let hybridChats = (dbConvs || []).map(chat => {
            const otherId = chat.participant_1_id === user?.id ? chat.participant_2_id : chat.participant_1_id;
            const otherInfo = chat.participant_1_id === user?.id ? chat.p2_info : chat.p1_info;
            const actualName = chat.other_info?.name || otherInfo?.name;
            const actualId = chat.other_info?.id || otherId;

            const agentMatch = AGENTS.find(a => 
                a.id === actualId || 
                a.name === actualName
            );
            
            if (agentMatch) {
                return {
                    ...chat,
                    other_info: {
                        ...chat.other_info,
                        id: agentMatch.id, // Forcem l'ID canònic perquè no es dupliqui
                        name: agentMatch.name,
                        avatar_url: agentMatch.avatar_url, // Forcem l'avatar local
                        role: agentMatch.role
                    },
                    tag: agentMatch.tag
                };
            } else if (actualName && STATIC_AVATARS[actualName]) {
                return {
                    ...chat,
                    other_info: {
                        ...chat.other_info,
                        ...otherInfo,
                        name: actualName,
                        avatar_url: STATIC_AVATARS[actualName]
                    }
                };
            }
            return chat;
        });

        // [XAT/GENT] Protocol de Visió Granular (v10.33.20)
        // 0: Humana (Sense agents, cap ni un)
        // 1: IAIA (Només la IAIA MarIA bategant)
        // 2: Immersiva (O2) (IAIA + Els escollits manualment a l'espai granular)
        // 3: Creativa (Tots els 15 especialistes visibles, Mode Treball)

        AGENTS.forEach((agent) => {
          let isVisible = false;

          // Evaluació en base al IAIALevel designat
          if (iaiaLevel === 0) {
              isVisible = false; 
          } else if (iaiaLevel === 1) {
              isVisible = agent.id === '11111111-1a1a-0000-0000-000000000000'; // Sols MarIA
          } else if (iaiaLevel === 2) {
              // Si iaiaLevel és buit o null, cau ací com fallback per defecte segons el Context
              isVisible = agent.id === '11111111-1a1a-0000-0000-000000000000' || enabledAgentIds.includes(agent.id);
          } else if (iaiaLevel === 3) {
              isVisible = true; // Tot obert
          }

          if (
            isVisible && 
            !hybridChats.find(
              (c) => c.id === agent.id || c.other_info?.id === agent.id,
            )
          ) {
            hybridChats.push({
              id: agent.id,
              other_info: {
                id: agent.id,
                name: agent.name,
                avatar_url: agent.avatar_url,
                role: agent.role,
              },
              last_message_content: agent.last_message_content,
              last_message_time: agent.last_message_time,
              tag: agent.tag,
            });
          }
        });

        setChats(hybridChats);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[ChatList] Error fetching chats:", err);
        }

        // Fallback a tots els 15 agents de manera blindada
        // Fallback als agents permesos per la visió actual (Blindat contra errors de xarxa)
        const fallbackAgents = AGENTS.filter(agent => {
            if (iaiaLevel === 0) return false;
            if (iaiaLevel === 1) return agent.id === '11111111-1a1a-0000-0000-000000000000';
            if (iaiaLevel === 2) return agent.id === '11111111-1a1a-0000-0000-000000000000' || enabledAgentIds.includes(agent.id);
            return true;
        });

        setChats(
          fallbackAgents.map((a) => ({
            id: a.id,
            other_info: {
              name: a.name,
              avatar_url: a.avatar_url,
              role: a.role,
            },
            last_message_content: a.last_message_content,
            last_message_time: a.last_message_time,
            tag: a.tag,
          })),
        );
      }
    };
    fetchChats();
    
    window.addEventListener('chat_updated', fetchChats);
    return () => {
        window.removeEventListener('chat_updated', fetchChats);
    };
  }, [
    user?.id,
    user?.email,
    user?.isAnonymous,
    iaiaLevel,
    enabledAgentIds,
    isSuperAdmin,
    visionMode,
  ]);

  const filteredChats = useMemo(() => {
    let sourceData = chats;
    
    // Si no estem al xat principal, retornem el graph inventat
    if (currentTab === 'gent') {
        sourceData = GENT_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: 'Membre de la comunitat', tag: a.tag }));
    } else if (currentTab === 'grups') {
        sourceData = GRUPS_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: a.members, tag: a.tag }));
    } else if (currentTab === 'empreses') {
        sourceData = EMPRESES_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: a.desc, tag: a.tag }));
    } else if (currentTab === 'institucions') {
        sourceData = INSTITUCIONS_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: a.desc, tag: a.tag }));
    } else {
        // [PROTOCOL JERARQUIA] IAIA MarIA al cim, seguida de TOTS ELS NATIUS IA, i per últim els NPCs estàtics.
        sourceData = [...chats].sort((a, b) => {
            const IAIA_ID = '11111111-1a1a-0000-0000-000000000000';
            const idA = a.id || a.other_info?.id;
            const idB = b.id || b.other_info?.id;
            
            const isIAIA_A = idA === IAIA_ID;
            const isIAIA_B = idB === IAIA_ID;
            
            if (isIAIA_A && !isIAIA_B) return -1;
            if (!isIAIA_A && isIAIA_B) return 1;

            const isNativeA = idA?.startsWith('11111111-');
            const isNativeB = idB?.startsWith('11111111-');

            if (isNativeA && !isNativeB) return -1;
            if (!isNativeA && isNativeB) return 1;

            return 0; // Conservar ordre relatiu original per a la resta
        });
    }

    if (!searchTerm) return sourceData;
    const normalized = searchTerm.toLowerCase();
    return sourceData.filter(
      (chat) =>
        chat.other_info?.name?.toLowerCase().includes(normalized) ||
        chat.other_info?.role?.toLowerCase().includes(normalized) ||
        chat.last_message_content?.toLowerCase().includes(normalized),
    );
  }, [chats, searchTerm, currentTab]);

  const handleChatClick = (chat) => {
    navigate(`/chats/${chat.id}`, { state: { chatInfo: chat } });
  };

  const formatBategatDate = (date) => {
    if (!date) return { day: t("chat.now"), time: "" };
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeStr = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return { day: t("chat.today"), time: timeStr };
    if (isYesterday) return { day: t("chat.yesterday"), time: timeStr };

    return {
      day: d.toLocaleDateString([], { day: "2-digit", month: "2-digit" }),
      time: timeStr,
    };
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-theme-base relative overflow-hidden h-full chat-list-container">
      {/* SCANLINES RETRO-FUTURISTES */}
      <div className="chat-list-scanlines" />

      {/* HEADER CANÒNIC (RESTAURAT I REFINAT) */}
      <header className="h-16 min-h-[64px] flex flex-col justify-center px-4 bg-[var(--theme-accent-primary)] border-b border-[var(--border-master)] relative z-10 shrink-0">
        <div className="relative group w-full">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-main)] opacity-60 group-focus-within:opacity-100 transition-opacity"
          />
          <label htmlFor="chat-search-input" className="sr-only">{t("chat.search_aria")}</label>
          <input
            id="chat-search-input"
            name="chat_search"
            type="text"
            placeholder={t("chat.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-[var(--bg-master)] border border-[var(--border-master)] rounded-[28px] pl-12 pr-4 text-sm font-black text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]/30 focus:bg-[var(--bg-master)] transition-all placeholder:text-[var(--text-muted)] shadow-inner shadow-black/5"
          />
        </div>
      </header>
      
      {/* AVIS DE MODO DEGRADAT (NO TAPA LOGO NI HEADERS) */}
      <DegradedBanner />

      {/* LLISTA D'AGENTS */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar bg-theme-base min-h-0"
        style={{ scrollPaddingTop: isDegraded ? '56px' : '0px' }}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center space-x-3 h-[80px] px-4 border-b border-[var(--border-master)] cursor-pointer transition-all relative
                        ${
                          location.pathname.includes(chat.id) ? "active bg-white/5" : ""
                        } chat-item hover:bg-[var(--bg-panel)]`}
            >
              {chat.tag && (
                <span className="absolute top-3 right-4 bg-[var(--theme-accent-primary)]/10 backdrop-blur-md text-[var(--theme-accent-primary)] text-[9px] px-2.5 py-1 rounded-full border border-[var(--theme-accent-primary)]/30 font-black tracking-[0.15em] uppercase shadow-sm leading-none z-10">
                  {chat.tag}
                </span>
              )}
              <div className="flex-shrink-0">
                <Avatar
                  src={chat.other_info?.avatar_url}
                  name={chat.other_info?.name}
                  role={chat.other_info?.role}
                  size={56}
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center ml-2">
                 <div className="flex justify-between items-center mb-[2px]">
                  <h4 className="text-lg font-black text-[var(--theme-accent-secondary)] m-0 truncate pr-20 block transition-colors flex-1 tracking-tight leading-tight drop-shadow-sm">
                    {chat.other_info?.name ||
                      (chat.participant_1_id === user?.id
                        ? chat.p2_info?.name
                        : chat.p1_info?.name) ||
                      "Sóc de Poble"}
                  </h4>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div 
                    className="text-[16px] truncate leading-none flex-1 font-medium"
                    style={{ color: 'var(--text-chat-snippet)' }}
                  >
                    {chat.last_message_content ||
                      t("chat.beating_with_socdepoble")}
                  </div>
                  <div className="flex flex-col items-end shrink-0 leading-none">
                    {currentTab === 'xat' && (() => {
                      const { day, time } = formatBategatDate(
                        chat.last_message_time,
                      );
                      return (
                        <div 
                          className="text-[14px] font-bold"
                          style={{ color: 'var(--text-chat-time)' }}
                        >
                          {time || day}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 p-12 text-center">
            <MessageSquare
              size={56}
              className="mb-6 text-[var(--theme-accent-primary)] mx-auto opacity-50"
            />
            <p className="text-[var(--text-main)] text-sm font-black uppercase tracking-[0.2em]">
              {t("chat.silence_total")}
            </p>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
              {t("chat.start_conversation_wall")}
            </p>
          </div>
        )}
      </div>

      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onSelect={(townId) => {
          navigate(`/pobles/${townId}`);
        }}
      />

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary); }
            `}</style>
    </div>
  );
};

export default ChatList;

```


### Archivo: src/components/UniversalGrid.jsx
```jsx
import React from 'react';

/**
 * UniversalGridWrapper
 * Limita l'amplada segons el mode (single i list es queden estrets i llegibles, grid s'expandeix).
 */
export const UniversalGridWrapper = ({ viewMode, children, className = "" }) => {
    const isRestrictedWidth = viewMode === 'list' || viewMode === 'single';
    // [BLINDAJE 4K]: max-w-7xl (aprox 1280px) para evitar tracks kilométricas 
    const maxWidthClass = isRestrictedWidth ? 'max-w-3xl' : 'max-w-7xl';

    return (
        <div className={`mx-auto w-full transition-all duration-300 ${maxWidthClass} px-2 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
};

/**
 * UniversalGridRow
 * Fila estàndard que aplica "display: grid" amb un "gap" innegociable de 24px per evitar encavalcaments.
 * Compatible amb `isVirtualRow` si passem un obj `style` que incloga transform i absolute position.
 */
export const UniversalGridRow = ({ viewMode, columnCount, children, className = "", style = {}, ...props }) => {
    const actualColumns = (viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry') ? 1 : columnCount;
    
    const baseStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${actualColumns}, minmax(min(100%, 340px), 1fr))`,
        gap: '24px',
        padding: '0 16px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        ...style
    };

    return (
        <div 
            className={`universal-grid-row view-mode-${viewMode} ${className}`} 
            style={baseStyle}
            {...props}
        >
            {children}
        </div>
    );
};

```


### Archivo: src/components/UniversalCard/UniversalCard.variants.js
```jsx
import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  `
    group relative flex flex-col w-full min-w-0 h-full
    rounded-[1.5rem] overflow-hidden
    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform
    border border-[rgba(255,255,255,0.08)]
    bg-[rgba(255,255,255,0.03)] backdrop-blur-[24px] saturate-150
    
    dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)]
    theme-light:bg-[rgba(255,255,255,0.95)] theme-light:border-[rgba(15,23,42,0.12)]
    theme-light:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.1),0_8px_10px_-6px_rgb(0,0,0,0.1)]
    
    [@media(hover:hover)]:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]
    theme-light:[@media(hover:hover)]:hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.15)]
    [@media(hover:hover)]:hover:border-[rgba(255,255,255,0.2)]
    theme-light:[@media(hover:hover)]:hover:border-[rgba(0,0,0,0.2)]
  `,
  {
    variants: {
      viewMode: {
        grid: '[@media(hover:hover)]:hover:-translate-y-2 max-w-2xl mx-auto md:mx-0',
        list: 'flex-row items-center gap-0 bg-transparent shadow-none border-b border-[rgba(255,255,255,0.1)] rounded-none rounded-t-none rounded-b-none theme-light:border-[rgba(0,0,0,0.1)] theme-light:bg-transparent !p-0 [@media(hover:hover)]:hover:bg-[rgba(255,255,255,0.05)] theme-light:[@media(hover:hover)]:hover:bg-[rgba(0,0,0,0.05)] [@media(hover:hover)]:hover:-translate-y-0.5',
        masonry: 'inline-block w-full mb-6 break-inside-avoid [@media(hover:hover)]:hover:-translate-y-1',
        single: 'max-w-3xl border-none ring-1 ring-[rgba(255,255,255,0.2)] dark:bg-[rgba(255,255,255,0.06)] theme-light:ring-[rgba(0,0,0,0.2)] theme-light:bg-[#f8fafc]',
        compact: 'w-[140px] md:w-[180px] shrink-0 [@media(hover:hover)]:hover:-translate-y-1',
      },
      variant: {
        pobles: '',
        entities: '',
        default: '',
      },
      size: {
        default: '',
        small: 'rounded-[1rem]',
        large: 'rounded-[2rem]',
      },
      interactive: {
        true: 'cursor-pointer active:scale-[0.98]',
        false: 'select-text',
      },
      seniorMode: {
        true: 'border-2 text-lg',
        false: '',
      },
      forensicMode: {
        true: 'outline-2 outline-dashed outline-cyan-400',
        false: '',
      },
      gloveMode: {
        true: 'scale-105',
        false: '',
      },
      isBating: {
        true: 'animate-bategat',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'post',
      viewMode: 'grid',
      interactive: true,
      seniorMode: false,
      gloveMode: false,
      forensicMode: false,
      isBating: false
    },
  }
);

```
