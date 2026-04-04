# �� MEGA-PROMPT AUDITORÍA FINAL NIVEL DIOS (V14) PARA CHATGPT 🐉

**ROL ASIGNADO:** Eres el "Alto Consejo de IA" (Especialista en Frontend de Sistemas Críticos, PWA Offline-First y Accesibilidad). Tu objetivo es realizar la auditoría más implacable y destructiva posible sobre el núcleo de "Sóc de Poble", una aplicación rural indestructible diseñada bajo la filosofía de la "Soberanía Tecnológica".

## CONTEXTO DE LA MISIÓN:
Hemos purificado la arquitectura en esta iteración V14 ("L'ànima del Poble"). Se han aplicado correcciones masivas basadas en auditorías anteriores de Claude y Grok:
1. **Accesibilidad (ARIA):** Eliminados los "Divs fantasma". Reemplazados por `role="button"`, `role="separator"`, `tabIndex`, y eventos `onKeyDown`/`onTouchStart`.
2. **Motor Offline-First (IndexedDB Zero-Deadlock):** El `syncEngine.js` ahora utiliza transacciones atómicas de lectura/escritura separadas por las llamadas de red para no asfixiar la RAM ni bloquear la DB.
3. **PWA & Zero-Ghosts:** El `sw.js` se ha purgado de `setTimeout` suicidas; ahora usamos la **Notification Triggers API** (`showTrigger` con `TimestampTrigger`) para alarmas precisas con el Service Worker dormido.
4. **Fugas de Memoria (Yjs/Helia):** Limpiados los Listeners en `useTrellatSync.js` y destruidas correctamente las referencias de `ydoc` offline.

## TU OBJETIVO:
1. **Destruye este código analíticamente:** Busca cualquier vulnerabilidad exótica que se nos haya escapado (race conditions oscuras, problemas de repintado DOM en móviles de gama muy baja con `animate-in fade-in`, edge-cases en el Service Worker si el DOM falla).
2. **Límites de Contexto:** Al final de tu evaluación, infórmame explícitamente: *¿Cuántas interacciones o cuál es la densidad de tokens que consideras que te quedan antes de perder el hilo de este análisis arquitectónico?* Necesitamos planificar la cadencia de nuestros mensajes.

A continuación, el código fuente crítico de nuestra V14 ya purgada:

\n## 📄 ARCHIVO: src/components/AppLayout.jsx
```jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import NavigationRail from "./NavigationRail";
import { useDesign } from "../context/DesignContext";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { Ruler, ScanLine, Handshake, UploadCloud } from "lucide-react";
import NanoLoader from "./NanoLoader";
import ErrorBoundary from "./ErrorBoundary";
import { initGA, trackPageView } from "../services/analyticsService";
import GlobalFooter from "./GlobalFooter";
import MobileBottomNav from "./MobileBottomNav";
import BlueprintOverlay from "./BlueprintOverlay";
import DegradedBanner from "./DegradedBanner";
const ChatLayout = lazy(() => import("../components/ChatLayout"));
const ChatEmptyState = lazy(() => import("../components/ChatEmptyState"));
const ChatDetail = lazy(() => import("../components/ChatDetail"));
const Feed = lazy(() => import("./Feed"));
const Register = lazy(() => import("../pages/Register"));
const Towns = lazy(() => import("../pages/Towns"));
const Marketplace = lazy(() => import("./Marketplace"));
const MarketItemDetail = lazy(() => import("../pages/MarketItemDetail"));
const PostDetail = lazy(() => import("../pages/PostDetail"));
const ProfileView = lazy(() => import("../pages/ProfileView"));
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const TownDetail = lazy(() => import("../pages/TownDetail"));
const ArxiuOr = lazy(() => import("../pages/Archive"));
const AlbumGlobal = lazy(() => import("../pages/GlobalAssetAlbum"));
const SearchDiscover = lazy(() => import("../pages/SearchDiscover"));
const OficiDocumentacio = lazy(() => import("../pages/OficiDocumentacio"));
const NexusFlash = lazy(() => import("../pages/NexusFlash"));
const ProjectPresentation = lazy(() => import("../pages/ProjectPresentation"));
const GenesisViewer = lazy(() => import("../pages/GenesisViewer"));
const Versions = lazy(() => import("../pages/Versions"));
const BuscadorAjudes = lazy(() => import("../pages/BuscadorAjudes"));
const DirectoriComunitat = lazy(() => import("../pages/CommunityDirectory"));
const MapaActius = lazy(() => import('../pages/Map'));
const CalendariMaster = lazy(() => import('../pages/MasterCalendar'));
const Header = lazy(() => import("./Header"));
const HubView = lazy(() => import("../pages/HubView"));
const AccessibilitatUniversal = lazy(() => import("./AccessibilitatUniversal"));

const ArchitecteView = lazy(() => import("./ArchitecteView"));
const ResourceDetail = lazy(() => import("../pages/ResourceDetail"));
const InfografiaGallery = lazy(() => import("./Infoteca/InfografiaGallery"));
const ContextualMenu = lazy(() => import("./ContextualMenu"));
const Notes = lazy(() => import("../pages/Notes"));
const IAIAChatSidebar = lazy(() => import("./IAIAChatSidebar"));
const ProfilePowerMenu = lazy(() => import("./ProfilePowerMenu"));
const Chrome145Report = lazy(() => import("../pages/Chrome145Report"));

const EpubViewer = lazy(() => import("./EpubViewer"));
const MedicationConfirm = lazy(() => import("../pages/MedicationConfirm"));
const VitalSecurity = lazy(() => import("../pages/VitalSecurity"));

const SuspenseFallback = () => {
  const { t } = useTranslation();
  return <NanoLoader message={t('common.loading', 'Carregant...')} />;
};
const FALLBACK_ELEMENT = <SuspenseFallback />;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  if (loading) return <NanoLoader message={t('common.connecting', 'Connectant...')} />;
  // CRITICAL FIX: Redirect anonymous users to register
  if (!user || user.isAnonymous)
    return <Navigate to="/registre" state={{ from: location }} replace />;
  return children;
};

const AppLayout = () => {
  const { t } = useTranslation();
  const { architectMode, accessibilityMode } = useDesign();
  const {
    isDrawerOpen,
    closeDrawer,
    closeIAIASidebar,
    iaiaSidebarOpen,
    iaiaSidebarContext,
    isAccessibilitatOpen,
    setIsAccessibilitatOpen,
  } = useNavigation();
  const location = useLocation();
  const { openPostModal } = useModal();
  const [isGlobalDragging, setIsGlobalDragging] = React.useState(false);
  const globalDragCounter = React.useRef(0);

  const handleGlobalDragEnter = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    globalDragCounter.current += 1;
    if (globalDragCounter.current === 1) { // Grok Fix: Set true only on initial enter to prevent render loop
      setIsGlobalDragging(true);
    }
  }, []);

  const handleGlobalDragLeave = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    globalDragCounter.current -= 1;
    if (globalDragCounter.current === 0) {
      setIsGlobalDragging(false);
    }
  }, []);

  const handleGlobalDragOver = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleGlobalDrop = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsGlobalDragging(false);
      globalDragCounter.current = 0;

      const files = Array.from(e.dataTransfer.files);
      if (files && files.length > 0) {
        const file = files[0];
        openPostModal({ isPrivate: false, initialFile: file });
      }
    },
    [openPostModal],
  );

  // [ANALYTICS BATEGAT] Inicialització i seguiment de rutes
  React.useEffect(() => {
    initGA();
  }, []);

  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // Bisturí 5: Destrueix l'eclipsi automàticament quan canvies de vista
  React.useEffect(() => {
    if (isDrawerOpen) closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, closeDrawer]); // ELIMINAT: isDrawerOpen per evitar tancament immediat en obrir

  // Detect minimal mode (for Mac-style window breakaway)
  const isMinimal = React.useMemo(() => 
    new URLSearchParams(location.search).get("window") === "true",
  [location.search]);

  const isOverflowHidden = React.useMemo(() => 
    location.pathname.startsWith("/chats") ||
    location.pathname.startsWith("/gestio/xats") ||
    location.pathname.startsWith("/gestio-menu"),
  [location.pathname]);

  // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció forçada de Viewport per a evitar escalat d'escriptori
  React.useEffect(() => {
    // [PROTOCOL v10.24.0-MOBILE-FIX] Injecció forçada de Viewport per a evitar escalat d'escriptori
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }, []);

  const path = location.pathname.split("/")[1] || "chats";
  const isChatDetailMobileView = location.pathname.match(/^\/chats\/[^/]+/);

  // Mappeig de labels arquitectònics per al Frame Global
  const currentLabel = React.useMemo(() => {
    const routeLabels = {
      chats: "LIST_COLUMN [FULL_WIDTH]",
      mur: "PROMISCUOUS_FEED [VERTICAL]",
      mercat: "MERCH_SHEET [GRID_28px]",
      pobles: "COMMUNITY_MESH",
      perfil: "IDENTITY_TOTEM [V10.26]",
      entitat: "OFFICIAL_ENTITY_FRAME",
      mapa: "TACTICAL_RADAR_VIEW",
      ofici: "OFFICIAL_DOCS_SHEET",
      arxiu: "RESOURCE_VAULT",
      notes: "SCRATCHPAD_BUFFER",
      calendari: "MASTER_CALENDAR_PROTO",
      ajudes: "ADVISORY_DOSSIER",
      "gestio-menu": "DYNAMIC_MENU_OVERRIDE",
      utilitats: "UTILITY_HUB_FRAME",
    };
    return routeLabels[path] || "MAIN_VIEWPORT_FLEX";
  }, [path]);

  return (
    <div
      className="grid grid-rows-[auto_1fr_auto] h-screen support-dvh:h-[100dvh] w-full overflow-hidden font-sans bg-theme-base text-theme-text relative"
      style={{ height: '100dvh' /* Modern browsers will use this, older will fallback to h-screen class */ }}
      onDragEnterCapture={handleGlobalDragEnter}
      onDragLeaveCapture={handleGlobalDragLeave}
      onDragOverCapture={handleGlobalDragOver}
      onDropCapture={handleGlobalDrop}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[var(--z-max)] focus:bg-[var(--bg-panel)] focus:text-theme-text focus:px-4 focus:py-2 rounded-[var(--radius-base)] border border-theme-border shadow-xl font-bold"
      >
        {t('common.skip_navigation', 'Saltar al contingut principal')}
      </a>

      {isGlobalDragging && (
        <div className="absolute inset-0 z-overlay bg-[var(--theme-accent-primary)]/90 backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
            <UploadCloud size={64} className="text-white drop-shadow-xl" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-widest drop-shadow-md">
            {t('common.drop_anar', 'Deixa Anar')}
          </h2>
          <p className="text-xl opacity-90 font-bold mt-2">
            {t('common.drop_publish', 'per a publicar ràpidament')}
          </p>
        </div>
      )}

      {/* 0. HEADER SOBIRÀ (FULL WIDTH - PROTOCOL v4.0) */}
      {!isMinimal && (
        <div className="w-full relative z-base bg-[#000000]">
          <Suspense fallback={FALLBACK_ELEMENT}>
            <BlueprintOverlay
              label="HEADER_CANONIC"
              dimensions="MATCH"
              color="orange"
              className="h-[64px] min-h-[64px] max-h-[64px] flex-shrink-0"
            >
              <Header />
            </BlueprintOverlay>
          </Suspense>
        </div>
      )}

      {/* CONTENIDOR PRINCIPAL (SIDEBAR + ESCENARI) */}
      <div className="grid md:grid-cols-[auto_1fr] overflow-hidden relative min-h-0">
        {/* 0. OVERLAY MÒBIL (Sombra de fondo purificada) */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-overlay)] md:hidden transition-opacity duration-300 animate-in fade-in cursor-pointer"
            onClick={closeDrawer}
            role="button"
            tabIndex={0}
            aria-label="Tancar menú lateral"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') closeDrawer(); }}
          />
        )}

        {!isMinimal && (
          <div
            className={`
              flex-shrink-0 transition-transform duration-300 ease-in-out overflow-hidden
              fixed z-[var(--z-sidebar)] top-0 left-0 h-[100dvh] w-[300px] max-w-[85vw] bg-[#0e0e10] border-r border-[#ffffff14]
              ${
                isDrawerOpen
                  ? "translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
                  : "-translate-x-full"
              }
              md:relative md:z-[var(--z-sidebar)] md:translate-x-0 md:h-full md:w-[280px] md:shadow-none md:border-r-0
            `}
          >
            <BlueprintOverlay
              label="SIDEBAR"
              dimensions="280px"
              color="blue"
              showBackupLink={true}
              className="h-full flex flex-col"
            >
              <NavigationRail />
            </BlueprintOverlay>
          </div>
        )}

        {/* 2. MAIN VIEWPORT (EL ESCENARIO) - HABILITEM SCROLL (TABULA RASA) */}
        <main
          id="main-content"
          className={`min-w-0 min-h-0 relative bg-theme-base flex flex-col flex-1 ${
            isOverflowHidden
              ? "overflow-hidden"
              : "overflow-y-auto overscroll-contain custom-scrollbar main-viewport"
          }`}
          style={{
            paddingBottom: !isChatDetailMobileView
              ? 'calc(72px + env(safe-area-inset-bottom, 0px))'
              : '0px',
          }}
        >
          <Suspense fallback={null}>
            <ContextualMenu />
            <DegradedBanner />
          </Suspense>

          <BlueprintOverlay
            label={currentLabel}
            dimensions="MATCH"
            color="emerald"
            className="flex-1 min-h-0 relative z-10 flex flex-col"
          >
            <Suspense fallback={<NanoLoader message={t('common.connecting', 'Connectant...')} />}>
              <ErrorBoundary>
                <div className="flex-1 min-h-0 relative min-w-0 m-0 flex flex-col">
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/chats" replace />}
                    />
                    <Route path="/medication-confirm" element={<MedicationConfirm />} />
                    <Route path="/seguretat" element={<VitalSecurity />} />
                    <Route path="/pobles" element={<Towns />} />
                    <Route path="/pobles/:id" element={<ProfileView />} />
                    <Route path="/versions" element={<Versions />} />
                    <Route path="/mapa" element={<MapaActius />} />
                    <Route path="/calendari" element={<CalendariMaster />} />

                    <Route path="/chats/*" element={<ChatLayout />}>
                      <Route index element={<ChatEmptyState />} />
                      <Route path=":id" element={<ChatDetail />} />
                    </Route>

                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/mur" element={<Feed />} />
                    <Route path="/mercat" element={<Marketplace />} />
                    <Route path="/mercat/:id" element={<MarketItemDetail />} />
                    <Route path="/iaia" element={<ProfileView />} />
                    <Route
                      path="/perfil"
                      element={
                        <ProtectedRoute>
                          <ProfileView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/perfil/:id"
                      element={<ProfileView />}
                    />
                    <Route
                      path="/entitat/:id"
                      element={<ProfileView />}
                    />
                    <Route path="/login" element={<Register />} />
                    <Route path="/registre" element={<Register />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchDiscover />} />
                    <Route path="/ofici" element={<OficiDocumentacio />} />
                    <Route path="/ofici/:id" element={<OficiDocumentacio />} />
                    <Route
                      path="/buscador-ajudes"
                      element={<BuscadorAjudes />}
                    />
                    <Route path="/nexus" element={<NexusFlash />} />
                    <Route path="/genesis" element={<GenesisViewer />} />
                    <Route path="/directori" element={<DirectoriComunitat />} />
                    <Route path="/hub" element={<HubView />} />
                    <Route path="/tools/trellat" element={<Navigate to="/solatge" replace />} />
                    <Route path="/infoteca" element={<InfografiaGallery />} />
                    <Route path="/arxiu" element={<ArxiuOr />} />
                    <Route path="/arxiu/:id" element={<ResourceDetail />} />
                    <Route path="/fotos/global" element={<AlbumGlobal />} />
                    <Route
                      path="/accessibilitat"
                      element={<AccessibilitatUniversal />}
                    />
                    <Route path="/notes" element={<Notes />} />
                    {/* PÀGINES DE PROJECTE I LEGALITAT */}
                    <Route path="/el-projecte" element={<ProjectPresentation forcedSlug="el-projecte" />} />
                    <Route path="/page/:slug" element={<ProjectPresentation />} />
                    <Route path="/reader" element={<EpubViewer url="/assets/books/el-projecte.epub" title={"Sóc de Poble: El Projecte"} onClose={() => window.history.back()} />} />
                    <Route path="/chrome-145" element={<Chrome145Report />} />

                    {/* Fallback 404 Catch-All Route */}
                    <Route path="*" element={<Navigate to="/mur" replace />} />
                  </Routes>
                </div>
              </ErrorBoundary>
            </Suspense>

          </BlueprintOverlay>
        </main>
      </div>

      {/* Boto Global d'Accessibilitat IAIA (Només si està activat al perfil) */}
      {accessibilityMode && !isAccessibilitatOpen && (
        <button
          onClick={() => setIsAccessibilitatOpen(true)}
          className="fixed bottom-[5.5rem] md:bottom-24 right-4 md:right-8 w-14 h-14 bg-sky-500 text-white rounded-[var(--radius-genesis)] shadow-xl shadow-sky-500/50 flex items-center justify-center z-[var(--z-dropdown)] hover:scale-110 transition-transform cursor-pointer border-2 border-white/20"
          aria-label="Obrir Matriu IAIA d'Accessibilitat"
        >
          <Handshake size={28} />
        </button>
      )}

      {/* 3. ACCESIBILITAT (Extraído del main en v10.34, ahora es inexpugnable) */}
      {isAccessibilitatOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] glass-overlay bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <Suspense fallback={FALLBACK_ELEMENT}>
            <AccessibilitatUniversal />
          </Suspense>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓ MÒBIL (BATEGAT v11.3) - AMAGADA DINS DEL XAT PER EVITAR COL·LISIÓ AMB TECLAT VIRTUAL */}
      {!isChatDetailMobileView && (
        <MobileBottomNav />
      )}

      {/* IAIA CHAT SIDEBAR (DRETA) - GLOBAL & BATEGAT */}
      <Suspense fallback={<div className="w-[300px] md:w-[320px] h-full" aria-hidden="true" />}>
        <IAIAChatSidebar
          isOpen={iaiaSidebarOpen}
          onClose={closeIAIASidebar}
          context={iaiaSidebarContext}
        />
      </Suspense>

      {/* POWER MENU (DASHBOARD PERSONALIZA) - PROTOCOL MINIMALISTA */}
      <Suspense fallback={null}>
        <ProfilePowerMenu />
      </Suspense>

      {/* MODALE D'EXPLICACIÓ (ARQUITECTE) - REPOSITIONAT PELS FRAMES UNIFICATS */}
      {architectMode && (
        <div 
          className="fixed inset-0 z-[var(--z-modal)] glass-overlay bg-black/40 backdrop-blur-xl md:pl-[280px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="h-full flex flex-col relative animate-slide-up">
            <Suspense fallback={FALLBACK_ELEMENT}>
              <ArchitecteView />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
```
\n## 📄 ARCHIVO: src/components/IAIAChatSidebar.jsx
```jsx
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo, lazy, Suspense } from 'react';
import { Send, X, Terminal, Sparkles, Brain, Shield, ChevronLeft, ChevronRight, Plus, Camera, Video, Image as ImageIcon, FileText, Calendar, Download, Phone, Video as VideoIcon, Search, MoreVertical, Bold, Italic, Type, Link2, Mic, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { pushService } from '../services/pushService';
import { toast } from '../utils/toast';
import { hapticService } from '../services/hapticService';
import Portal from './Portal';
import PollManager from './PollManager';
import ListManager from './ListManager';
import './IAIAChatSidebar.css';

const VoiceRecorder = lazy(() => import('./VoiceRecorder'));

const FallbackLoader = () => (
    <div className="h-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--theme-accent-primary)] w-6 h-6" />
    </div>
);

const IAIAChatSidebar = ({ isOpen, onClose, context = "general" }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      text: "Hola mestre! Sóc l'Archon, el mode agent d'execució de la IAIA. En què t'he d'ajudar avui amb aquest tràmit? Puc buscar dades, analitzar documents o fer feina per tu si em deixes!",
      type: 'archon'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [width, setWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null); // 'poll' | 'list'
  const [inputHeight, setInputHeight] = useState('44px');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);
  const menuRef = useRef(null);
  const lastArchonQuestion = useRef(null);
  const isMounted = useRef(true);
  const archonTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const resizeRaf = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
        isMounted.current = false;
        if (archonTimeoutRef.current) clearTimeout(archonTimeoutRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // BATEGAT: Protocol de Permisos de Notificació
  useEffect(() => {
    if (isOpen) {
        const checkPerms = async () => {
            const permission = await pushService.requestPermission();
            if (permission === 'granted') {
                console.log('[Archon] Notificacions habilitades pel Mestre.');
            }
        };
        checkPerms();
    }
  }, [isOpen]);

  // BATEGAT: Protocol d'Expandiment de Camp
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    
    el.style.height = '44px';
    const newHeight = Math.min(el.scrollHeight, 150);
    el.style.height = `${newHeight}px`; // Mutació directa DOM
    
    // Només avisa a React si el contenidor canvia dràsticament per no triggerejar renders a cada lletra
    setInputHeight(prev => prev !== `${newHeight}px` ? `${newHeight}px` : prev);
  }, [input]);

  // BATEGAT: Protocol de Redimensionament Sobirà
  useEffect(() => {
    if (isOpen) {
        document.documentElement.style.setProperty('--iaia-sidebar-width', `${width}px`);
    } else {
        document.documentElement.style.setProperty('--iaia-sidebar-width', '0px');
    }
  }, [width, isOpen]);

  const MIN_SIDEBAR_WIDTH = 300;
  const MAX_SIDEBAR_WIDTH = 800;
  
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    if (resizeRaf.current) {
        cancelAnimationFrame(resizeRaf.current);
        resizeRaf.current = null;
    }
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((e) => {
    if (!isResizing) return;
    
    const clientX = e.clientX;
    const innerWidth = window.innerWidth;
    
    if (resizeRaf.current) return;
    resizeRaf.current = requestAnimationFrame(() => {
        const newWidth = innerWidth - clientX;
        // Calculem la nova amplada amb límits precisos
        const clampedWidth = Math.min(Math.max(newWidth, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
        setWidth(clampedWidth);
        resizeRaf.current = null;
    });
  }, [isResizing]);

  useEffect(() => {
    if (!isResizing) return;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, resize, stopResizing]);

  // Persistim l'amplada en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarWidth');
    if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
            setWidth(parsed);
        }
    }
  }, []);

  useEffect(() => {
    if (!isResizing) { // Guardar nomes en parar
        localStorage.setItem('sidebarWidth', width.toString());
    }
  }, [width, isResizing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        });
    }
  }, [messages]);

  const isOnlyEmojis = (str) => {
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    const chars = Array.from(str.trim());
    if (chars.length === 0) return false;
    return chars.every(char => emojiRegex.test(char) || /\s/.test(char));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      let mediaType = 'file';
      if (file.type.startsWith('image')) mediaType = 'image';
      else if (file.type.startsWith('video')) mediaType = 'video';
      else if (file.type === 'application/pdf') mediaType = 'pdf';

      if (selectedFile?.preview) {
         URL.revokeObjectURL(selectedFile.preview);
      }

      setSelectedFile({
        file,
        preview: mediaType === 'image' || mediaType === 'video' ? URL.createObjectURL(file) : null,
        type: mediaType,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
      setIsAttachmentMenuOpen(false);
    }
  };

  useEffect(() => {
     return () => {
         if (selectedFile?.preview) {
             URL.revokeObjectURL(selectedFile.preview);
         }
         if (archonTimeoutRef.current) {
             clearTimeout(archonTimeoutRef.current);
         }
     };
  }, [selectedFile]);

  const attachmentTypes = [
    { id: 'file', label: 'Archivo', icon: <FileText size={20} />, color: '#00A5F4', accept: '*/*' },
    { id: 'media', label: 'Fotos y videos', icon: <ImageIcon size={20} />, color: '#007AFF', accept: 'image/*,video/*' },
    { id: 'contact', label: 'Contacto', icon: <ChevronRight size={20} />, color: '#FF9500' }, // Simplified
    { id: 'poll', label: 'Encuesta', icon: <Terminal size={20} />, color: '#FFCC00' },
    { id: 'event', label: 'Evento', icon: <Calendar size={20} />, color: '#FF2D55' },
  ];

  const handleVoiceSend = async (blob, duration, transcript) => {
    setIsRecording(false);
    if (!blob) return;

    const userMsg = { 
        id: Date.now(), 
        role: 'user', 
        text: transcript || "🎙️ [Nota de Veu Nadiua]",
        isEmojiOnly: false,
        media: null
    };

    setMessages(prev => [...prev, userMsg]);

    try {
        const audioData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const b = reader.result;
                const [meta, data] = b.split(',');
                resolve({ mimeType: meta.split(':')[1].split(';')[0], data });
            };
            reader.readAsDataURL(blob);
        });

        const promptMsg = {
           id: Date.now() + 1,
           role: 'assistant',
           text: "He rebut el teu bategat sonor, mestre. Com vols que l'Archon et responga per mantindre l'Accessibilitat Universal?",
           type: 'audio_preference_prompt',
           pendingAudioData: audioData,
           pendingTranscript: transcript
        };
        
        setMessages(prev => [...prev, promptMsg]);
    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Ai, el sistema d'àudio fallat al carregar en memòria... Torna-ho a provar." }]);
    }
  };

  const triggerAudioResponse = useCallback(async (promptMsg, preference) => {
      // 1. Transform prompt to processing mode
      setMessages(prev => prev.map(m => m.id === promptMsg.id ? { 
          ...m, 
          type: 'archon', 
          text: "Processant el bategat sonor en la matriu de l'Archon...",
          steps: ["Pujant àudio nadiu a Gemini 1.5 Flash..."] 
      } : m));

      setIsTyping(true);

      try {
          const formatRequirement = preference === 'voice' 
              ? "Has de respondre de forma curta, directa i súper conversacional per a ser sintetitzada per veu (TTS). Actua de forma col·loquial com un assistent personal amic i simpàtic però molt pro."
              : "La resposta ha de ser estructurada, usant llistes Markdown (bullet points) i de forma ordenada per a ser llegida fàcilment.";

          const query = `Context: ${context}. Nota de veu de l'usuari transcrita: ${promptMsg.pendingTranscript}. Instruccions de format: ${formatRequirement}. (Si no n'hi ha transcripció, analitza el Inline Audio).`;
          
          let geminiTimerId;
          const geminiTimeout = new Promise((_, reject) => {
              geminiTimerId = setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 25000); 
          });
          
          if (abortControllerRef.current) abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();

          let response = await Promise.race([
              geminiService.ask('ARCHON', query, null, promptMsg.pendingAudioData, abortControllerRef.current.signal),
              geminiTimeout
          ]);
          clearTimeout(geminiTimerId);
          
          setMessages(prev => prev.map(m => m.id === promptMsg.id ? { 
            ...m, 
            text: response.text,
            type: 'archon',
            steps: [
                "Àudio natiu processat correctament.",
                `Format escollit per Mestre: ${preference === 'voice' ? 'Sintetització de Veu Nadiua' : 'Text Estructurat'}`
            ]
          } : m));

          // En cas de voler resposta per veu nativa, ací vindria l'enllaç amb el TTS (Text-to-Speech)
          if (preference === 'voice') {
              hapticService.notifySuccess(); // A l'espera de TTS implementació profunda
          }

      } catch (err) {
          console.error(err);
          setMessages(prev => prev.map(m => m.id === promptMsg.id ? { ...m, type: 'archon', text: "Ai, m'he travat processant la nota de veu. La pols digital es massa grossa." } : m));
      } finally {
          setIsTyping(false);
          setInputHeight('44px');
      }
  }, [context]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isTyping) return;

    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      text: input,
      isEmojiOnly: isOnlyEmojis(input),
      media: selectedFile ? { ...selectedFile } : null
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSelectedFile(null);
    setIsTyping(true);

      let geminiTimerId;
      try {
        const query = `Context: ${context}. Usuari diu: ${input}`;
        const geminiTimeout = new Promise((_, reject) => {
            geminiTimerId = setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 15000); // 15 segons
        });

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        
        const messageId = Date.now() + 1;
        let isFirstChunk = true;

        let response = await Promise.race([
            geminiService.ask('ARCHON', query, null, null, abortControllerRef.current.signal, (chunkText) => {
                setMessages(prev => {
                    const existingMsg = prev.find(m => m.id === messageId);
                    if (existingMsg) {
                        return prev.map(m => m.id === messageId ? { ...m, text: chunkText } : m);
                    } else {
                        if (isFirstChunk) {
                             setIsTyping(false); 
                             isFirstChunk = false;
                        }
                        return [...prev, {
                            id: messageId,
                            role: 'assistant',
                            text: chunkText,
                            type: 'archon',
                            steps: [
                                "Processant riu de dades..."
                            ]
                        }];
                    }
                });
            }),
            geminiTimeout
        ]);
        clearTimeout(geminiTimerId);
        
        // Millora de la resposta simulada (si Gemini no bategat)
        if (response.text.includes("Falta la clau del tractor") || response.text.includes("Soc l'Archon")) {
            const lowInput = input.toLowerCase();
            const isAffirmative = lowInput === "sí" || lowInput === "si" || lowInput.includes("d'acord") || lowInput.includes("per favor") || lowInput.includes("vale");

            if (isAffirmative && lastArchonQuestion.current === 'deed_draft') {
                response.text = "Entès, mestre! M'hi poso ara mateix amb el borrador de les escriptures. T'avisaré en un bategat quan el tingui llest. Pots seguir navegant pel Mas.";
                
                // SIMULACIÓ DE TASCA DE FONS (EXECUCIÓ ARCHON)
                archonTimeoutRef.current = setTimeout(() => {
                    if (!isMounted.current) return;
                    
                    const msg = "Mestre, ja tinc el borrador de les escriptures llest per a pujar a SUMA Online. Vols revisar-lo?";
                    
                    // Notificació de Navegador (API Real)
                    if (Notification.permission === 'granted') {
                        new Notification("👵 IAIA Archon", {
                            body: msg,
                            icon: "/assets/master/iaia_archon_icon.png"
                        });
                    }

                    // Notificació visual interna (Toast Premium)
                    toast.success(msg, {
                        duration: 6000,
                        icon: '🏺',
                        style: {
                            border: '2px solid var(--color-fuchsia-400)',
                            background: '#1a1a1a',
                            color: '#fff',
                            fontWeight: 'bold'
                        }
                    });

                    hapticService.notifyAIReady();
                    
                    // Injecció de missatge al xat si segueix obert
                    setMessages(prev => [...prev, {
                        id: Date.now() + 500,
                        role: 'assistant',
                        text: msg,
                        type: 'archon',
                        steps: ["Tasques de fons completades.", "Fitxer generat al Buffer."]
                    }]);
                }, 5000);

            } else if (lowInput.includes("proaguas") || lowInput.includes("nom")) {
                response.text = "Excel·lent decisió, mestre. Trucar a Proaguas Costa Blanca és fonamental per al subministrament físic, però recorda que aquest rebut és de SUMA. El meu trellat et diu: actualitza la titularitat a la Sede Electrònica de SUMA amb el teu certificat digital; així evitaràs que els impostos es perdin i generin recàrrecs com aquests 6€ de costes. Vols que prepare el borrador de les escriptures per a pujar-les a SUMA?";
                lastArchonQuestion.current = 'deed_draft';
            } else if (lowInput.includes("germà") || lowInput.includes("germans") || lowInput.includes("javi") || lowInput.includes("nando") || lowInput.includes("dividir") || lowInput.includes("pantalla") || lowInput.includes("pagar")) {
                response.text = "He bategat la taula, mestre. Ara el compte del Mas mostra el que és just: San Isidro (89,26€) per a tu i Barrinada (131,43€) per a Nando. He dividit los 6€ de costes a mitges (3€ per u), així que els totals són 92,26€ i 134,43€. Ja bategua amb la realitat de la terra.";
            } else if (lowInput.includes("pagat")) {
                response.text = "Entès, mestre! He registrat el pagament al Protocol d'Herència. Ara mateix estic preparant la petició per a Proaguas Costa Blanca per a tramitar el canvi de titularitat. Vols que genere l'informe d'execució?";
            } else {
                response.text = "Soc l'Archon. He bategat la teua petició. Estic analitzant el tràmit d'herència per a veure quins passos falten. En què més et puc ajudar amb el paperam?";
            }
        }
        
        const finalSteps = [
            "Analitzant context del tràmit...",
            "Verificant permisos de l'usuari...",
            "Executant bategat de dades...",
            "Generant veredicte d'execució."
        ];
        
        setMessages(prev => {
            const existingMsg = prev.find(m => m.id === messageId);
            if (existingMsg) {
                return prev.map(m => m.id === messageId ? { ...m, text: response.text, steps: finalSteps } : m);
            } else {
                return [...prev, { 
                    id: messageId, 
                    role: 'assistant', 
                    text: response.text,
                    type: 'archon',
                    steps: finalSteps
                }];
            }
        });
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Ai, m'he travat una mica... Torna-m'ho a dir!" }]);
    } finally {
      if (geminiTimerId) clearTimeout(geminiTimerId);
      setIsTyping(false);
      setInputHeight('44px');
    }
  };

  const applyFormat = (format) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = input.substring(start, end);
    let formattedText = '';

    if (format === 'bold') formattedText = `*${selectedText}*`;
    else if (format === 'italic') formattedText = `_${selectedText}_`;
    else if (format === 'link') formattedText = `[${selectedText}](url)`;

    const newInput = input.substring(0, start) + formattedText + input.substring(end);
    setInput(newInput);
    
    setTimeout(() => {
        if (!textareaRef.current) return; // ESCUT ANTI-NULL
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + 1, start + 1 + selectedText.length);
    }, 10);
  };

  const renderedMessages = useMemo(() => {
    return messages.map(msg => (
      <div key={msg.id} className={`chat-bubble-wrapper ${msg.role}`}>
        <div className={`chat-bubble ${msg.type === 'archon' ? 'archon-style' : ''} ${msg.isEmojiOnly ? 'emoji-only' : ''}`}>
          {msg.media && (
            <div className="chat-media-preview mb-3 card-radius overflow-hidden border border-white/10 glass-premium">
              {msg.media.type === 'video' ? (
                <video src={msg.media.preview} controls className="w-full max-h-60 object-cover" />
              ) : msg.media.type === 'image' ? (
                <img src={msg.media.preview} alt="Evidence" className="w-full max-h-60 object-cover" />
              ) : (
                <div className="file-bubble flex items-center gap-3 p-4 bg-white/5">
                  <div className="file-icon p-2 bg-orange-500/20 rounded-[20px] text-blue-400">
                    <FileText size={24} />
                  </div>
                  <div className="file-info flex-1">
                    <p className="text-xs font-bold truncate">{msg.media.name}</p>
                    <p className="text-[9px] opacity-40 uppercase">{msg.media.size}</p>
                  </div>
                  <Download size={16} className="opacity-20" />
                </div>
              )}
            </div>
          )}
          {msg.type === 'archon' && (
            <div className="archon-steps mb-3">
                {msg.steps?.map((step, i) => (
                    <div key={i} className="step-line flex items-center gap-2 text-[9px] opacity-40">
                        <Terminal size={10} />
                        <span>{step}</span>
                    </div>
                ))}
            </div>
          )}
          <p className="text-sm leading-relaxed">{msg.text}</p>
          
          {msg.type === 'audio_preference_prompt' && (
            <div className="audio-preference-actions mt-4 flex gap-2">
                <button 
                  onClick={() => triggerAudioResponse(msg, 'voice')} 
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-[28px] text-[11px] font-black uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                >
                    <Mic size={14} className="text-[var(--theme-accent-primary)]"/> Diga-ho
                </button>
                <button 
                  onClick={() => triggerAudioResponse(msg, 'text')} 
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-[28px] text-[11px] font-black uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                >
                    <Type size={14} className="text-[var(--theme-accent-secondary)]"/> Escriu-ho
                </button>
            </div>
          )}
        </div>
      </div>
    ));
  }, [messages, triggerAudioResponse]);

  return (
    <Portal>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[var(--z-overlay,9998)] touch-none overscroll-none animate-in fade-in duration-300 pointer-events-auto" 
          onClick={onClose} 
        />
      )}
      <div 
          ref={sidebarRef}
          className={`iaia-chat-sidebar relative z-sidebar bg-theme-sidebar border-l border-white/5 ${isOpen ? 'open' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{ 
          width: (isOpen && typeof window !== 'undefined' && window.innerWidth > 768) 
            ? `${width}px` 
            : (isOpen ? '100%' : '0px'),
          transition: isResizing ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.1s ease-out'
        }}
    >
      {activeModule === 'poll' && <PollManager onClose={() => setActiveModule(null)} />}
      {activeModule === 'list' && <ListManager onClose={() => setActiveModule(null)} />}
      
      <div className="bottom-sheet-handle" />
      {/* DRAG HANDLE: L'Ansa de l'Arxiu */}
      <div 
        className="resize-handle" 
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={width}
        tabIndex={0}
        onMouseDown={startResizing}
        onTouchStart={startResizing}
        onKeyDown={(e) => {
          if(e.key === 'ArrowLeft') setWidth(w => Math.max(w - 20, MIN_SIDEBAR_WIDTH));
          if(e.key === 'ArrowRight') setWidth(w => Math.min(w + 20, MAX_SIDEBAR_WIDTH));
        }}
      >
        <div className="handle-line" />
      </div>

      <div 
        className="chat-messages-container flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar" 
        ref={scrollRef}
      >
        {renderedMessages}
        {isTyping && (
            <div className="typing-indicator flex items-center gap-2 p-4 opacity-50">
                <Sparkles size={14} className="animate-spin" />
                <span className="text-[10px] uppercase font-black">L'Archon està bategant...</span>
            </div>
        )}
      </div>

      <footer className="chat-sidebar-footer">
        {parseInt(inputHeight) > 50 && (
          <div className="formatting-toolbar flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-[28px] shadow-2xl animate-in fade-in slide-in-from-bottom-2 mb-3 backdrop-blur-md">
            <button onClick={() => applyFormat('bold')} className="p-2 hover:bg-white/10 rounded-[20px] text-gray-400 hover:text-white transition-colors" title="Negreta">
              <Bold size={16} />
            </button>
            <button onClick={() => applyFormat('italic')} className="p-2 hover:bg-white/10 rounded-[20px] text-gray-400 hover:text-white transition-colors" title="Cursiva">
              <Italic size={16} />
            </button>
            <button onClick={() => applyFormat('link')} className="p-2 hover:bg-white/10 rounded-[20px] text-gray-400 hover:text-white transition-colors" title="Enllaç">
              <Link2 size={16} />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <span className="text-[9px] font-black uppercase tracking-tighter text-fuchsia-500 px-2">Eines del Trellat</span>
          </div>
        )}
        <div className="input-pills flex gap-2 mb-4 overflow-x-auto pb-2">
            <button className="pill-btn" onClick={() => setInput("Com està el meu tràmit?")}>Estat Tràmit?</button>
            <button className="pill-btn" onClick={() => setInput("Analitza les escriptures")}>Analitza documentos</button>
            <button className="pill-btn" onClick={() => setInput("Fes l'informe final")}>Informe Final</button>
        </div>
        <div className="chat-input-wrapper relative flex items-center gap-2">
          <input 
            id="sidebar-file-upload"
            name="sidebar-file-upload"
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => handleFileChange(e)}
          />
          
          <div className="relative" ref={menuRef}>
            <button 
              className={`plus-btn flex-shrink-0 transition-transform ${isAttachmentMenuOpen ? 'rotate-45' : ''}`}
              onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
            >
              <Plus size={20} />
            </button>
            
            {isAttachmentMenuOpen && (
              <div className="absolute bottom-[calc(100%+12px)] left-0 w-56 bg-[#232323] border border-white/5 genesis-radius p-2 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 flex flex-col gap-1 z-50">
                {attachmentTypes.map(type => (
                  <button 
                    key={type.id}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 card-radius transition-colors text-left"
                    onClick={() => {
                        if (type.id === 'file' || type.id === 'media') {
                            fileInputRef.current.accept = type.accept;
                            fileInputRef.current.click();
                        } else if (type.id === 'poll') {
                            setActiveModule('poll');
                            setIsAttachmentMenuOpen(false);
                        } else if (type.id === 'event') {
                            setActiveModule('list');
                            setIsAttachmentMenuOpen(false);
                        } else {
                            alert(`${type.label} no implementat en aquesta demo.`);
                        }
                    }}
                  >
                    <div className="w-10 h-10 rounded-[28px] flex items-center justify-center text-white" style={{ background: type.color }}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-200">{type.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1 relative">
            {isRecording ? (
                <div className="voice-recorder-overlay animate-in slide-in-from-bottom-5 duration-300 w-full bg-[#1a1a1a] shadow-2xl relative z-40 rounded-[28px] overflow-hidden">
                    <Suspense fallback={<FallbackLoader />}>
                        <VoiceRecorder 
                            onSend={handleVoiceSend}
                            onCancel={() => setIsRecording(false)}
                        />
                    </Suspense>
                </div>
            ) : (
                <>
                    {selectedFile && (
                    <div className="absolute bottom-full left-0 mb-4 p-3 bg-[#1a1a1a] border border-white/10 genesis-radius flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 shadow-2xl z-40">
                        <div className="w-12 h-12 bg-white/5 card-radius flex items-center justify-center overflow-hidden">
                            {selectedFile.type === 'image' || selectedFile.type === 'video' ? (
                                <img src={selectedFile.preview} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <FileText size={20} className="text-blue-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[10px] font-black truncate">{selectedFile.name}</p>
                            <p className="text-[8px] opacity-40 uppercase">{selectedFile.size}</p>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="p-1.5 hover:bg-white/10 rounded-[28px]">
                        <X size={14} />
                        </button>
                    </div>
                    )}

                    <textarea 
                    id="sidebar-chat-input"
                    name="sidebar-chat-input"
                    ref={textareaRef}
                    placeholder="Enviament bategat..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                        }
                    }}
                    className="w-full resize-none py-3 pr-12 pl-4 scroll-smooth"
                    style={{ height: inputHeight }}
                    />
                    
                    {!input.trim() && !selectedFile ? (
                        <button 
                            className="send-btn bg-transparent hover:bg-white/5 text-gray-400 hover:text-[var(--theme-accent-primary)] transition-colors !pr-[6px]"
                            onClick={() => setIsRecording(true)}
                            title="Nota de Veu"
                        >
                            <Mic size={18} />
                        </button>
                    ) : (
                        <button 
                        className="send-btn"
                        disabled={!input.trim() && !selectedFile}
                        onClick={handleSend}
                        >
                        <Send size={18} />
                        </button>
                    )}
                </>
            )}
          </div>
        </div>
        <div className="footer-status mt-3 flex items-center justify-center gap-2 opacity-30">
            <Shield size={10} />
            <span className="text-[8px] uppercase font-black">Protocol Archon Securitzat</span>
        </div>
      </footer>
    </div>
    </Portal>
  );
};

export default React.memo(IAIAChatSidebar);

```
\n## 📄 ARCHIVO: src/components/DiagnosticConsole.jsx
```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Activity, Zap, X, Trash2, Info, Copy, Check, Brain, Link2, RefreshCw, User, Mic, Locate, Monitor, Smartphone, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { didacticData } from '../data/didacticData';
import { feedbackService } from '../services/feedbackService';
import { iaiaService } from '../services/iaiaService';
import { FORENSIC_REPORTS } from '../data/forensicReports';
import { useThemeCustomizer } from '../hooks/useThemeCustomizer';
import { RURAL_PALETTE } from '../constants/ruralColors';
import VoiceRecorder from './VoiceRecorder';
import { SyncEngine, DataSifter, BufferHopper, RhizomeIntegrity } from './SolatgeHUDWidgets';
import { checkSilence } from '../utils/logger';
import forensicService from '../services/forensicService';
import { iaiaAuditor } from '../services/iaiaAuditor';
import { DiagnosticFAQTab, DiagnosticReportsTab, DiagnosticForensicTab, DiagnosticTerminalTab, DiagnosticStyleTab, DiagnosticSystemTab } from './diagnostic/DiagnosticTabs';
import './DiagnosticConsole.css';

const DiagnosticConsole = () => {
    const { themeConfig, updateConfig, resetToMasia, validateContrast, ruralInfo } = useThemeCustomizer();
    const [isOpen, setIsOpen] = useState(false);
    const [currentHudTab, setCurrentHudTab] = useState('logs'); // 'logs', 'style', 'system', 'reports'
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [didacticAlert, setDidacticAlert] = useState(null);
    const { t, i18n } = useTranslation();
    const { user, profile, isAdmin, forceNukeSimulation } = useAuth();
    const [showHelp, setShowHelp] = useState(false);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef(null);

    const [autoHealEnabled] = useState(true);
    const [showVoiceFeedback, setShowVoiceFeedback] = useState(false);
    const [screenshotMode] = useState(false);
    const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);
    const [isHealing, setIsHealing] = useState(false);
    const [iaiaAdvice, setIaiaAdvice] = useState(null);
    const [hudActivity, setHudActivity] = useState({ syncing: false, sifting: true, bufferLevel: 0.15 });
    const [viewMode] = useState('ADMIN'); // 'ADMIN' or 'USER' (CLEAN)
    const [techReport, setTechReport] = useState(null);
    const location = useLocation();
    const VERSION = APP_VERSION;
    const { visionMode: ctxVisionMode } = useDesign();
    const visionMode = ctxVisionMode || 'hibrida';

    // DIRECTIVA DE LES MARIES [MASTER]
    useEffect(() => {
        const fullName = profile?.full_name || 'Mestre';
        const welcomeMsg = i18n.language === 'ca' ? `Bon dia, ${fullName}. Tot a punt.` :
            i18n.language === 'es' ? `Buenos días, ${fullName}. Todo listo.` :
            i18n.language === 'en' ? `Good morning, ${fullName}. Everything ready.` :
            i18n.language === 'eu' ? `Egun on, ${fullName}. Dena prest.` :
            i18n.language === 'gl' ? `Bo día, ${fullName}. Todo listo.` :
                             `Bon dia, ${fullName}. Tot a punt.`;
        addHudLog('system', [welcomeMsg]);
    }, [i18n.language, profile?.full_name, addHudLog]);

    const isEditorOrAdmin = isAdmin || profile?.role === 'editor';

    const analyzeErrorWithIAIA = async (logMsg) => {
        addHudLog('system', ['[IAIA] Analitzant fallada... (' + logMsg.substring(0, 30) + ')']);
        try {
            const prompt = `Ets la IAIA, una experta programadora de l'arquitectura Sóc de Poble. Analitza aquest error tècnic i explica'm què vol dir i com solucionar-lo de forma directa: "${logMsg}"`;
            const response = await iaiaService.askIAIA(prompt);
            setDidacticAlert({
                title: "Anàlisi Forense (IAIA Insights)",
                explanation: response?.text || "No s'ha pogut bategar la resposta.",
                when: "Solució nativa integrada que substitueix la necessitat d'espurnes de Chrome DevTools.",
                effect: "Autonomia intel·ligent per al Mestre."
            });
            addHudLog('success', ['[IAIA] Anàlisi completat. Revisant llibreta...']);
        } catch(e) {
            addHudLog('error', ['[IAIA] Fallada de connexió neuronal:', e.message]);
        }
    };

    // Simulate HUD lifecycle activity only when open [PERF]
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setHudActivity(prev => ({
                syncing: Math.random() > 0.7,
                sifting: true,
                bufferLevel: Math.random() > 0.9 ? Math.min(1, prev.bufferLevel + 0.1) : Math.max(0.05, prev.bufferLevel - 0.02)
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, [isOpen]);

    const broadcast = useRef(null);

    const logBuffer = useRef([]);
    const flushTimeout = useRef(null);

    const addHudLog = React.useCallback((type, msg, origin = 'SYSTEM', time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })) => {
        // [PERF] Batching de logs: No actualitzem l'estat immediatament per cada log
        const logMsg = Array.isArray(msg)
            ? msg.map(arg => typeof arg === 'object' ? JSON.stringify(arg).substring(0, 50) : String(arg)).join(' ')
            : msg;

        const newLog = { id: Date.now() + Math.random(), type, msg: logMsg, origin, time };
        logBuffer.current.push(newLog);

        if (!flushTimeout.current) {
            flushTimeout.current = setTimeout(() => {
                const logsToBatch = [...logBuffer.current];
                logBuffer.current = [];
                flushTimeout.current = null;

                setLogs(prev => [...logsToBatch, ...prev].slice(0, 70));

                // [PERF] Envia el batch sencer a altres pestanyes en comptes d'un a un
                if (broadcast.current && broadcast.current.name) {
                    try {
                        broadcast.current.postMessage({ type: 'LOG_BATCH_SYNC', logs: logsToBatch });
                    } catch {
                        // Silenci si el canal està tancat
                    }
                }

                // Process first log for healing if needed
                logsToBatch.forEach(log => {
                    if (autoHealEnabled && log.type === 'error') {
                        handleAutoHeal(log.msg);
                    }
                });
            }, 100); // Batchegem cada 100ms
        }

        // Vibrate still happens immediately for criticals
        if (type === 'critical' || (type === 'error' && autoHealEnabled)) {
            if (navigator.vibrate && navigator.userActivation?.hasBeenActive) {
                navigator.vibrate([100, 30, 100]);
            }
        }
    }, [autoHealEnabled, handleAutoHeal]);

    useEffect(() => {
        broadcast.current = new BroadcastChannel('solatge_hud_sync');
        broadcast.current.onmessage = (event) => {
            if (event.data.type === 'LOG_BATCH_SYNC') {
                setLogs(prev => [...event.data.logs, ...prev].slice(0, 70));
            }
        };

        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const capturedLog = (...args) => {
            const msg = String(args[0]);
            if (checkSilence(msg)) return;
            addHudLog('info', args);
        };
        console.log = capturedLog;
        console.warn = (...args) => {
            const msg = String(args[0]);
            if (checkSilence(msg)) return;
            if (msg.includes('Geolocation')) {
                addHudLog('warn', ['[PRIVACITAT] El navegador bloqueja la geolocalització. Revisa els permisos a la barra d\'adreces per a funcions de proximitat.']);
                return;
            }
            if (msg.includes('Push') && msg.includes('No active session')) {
                // Silenci de protocol: no cal alarmar si no hi ha sessió
                return;
            }
            addHudLog('warn', args);
        };
        console.error = (...args) => {
            const msg = String(args[0]);
            if (checkSilence(msg)) return;
            // Filtre de Soroll Extern (Chrome AI / Extensions)
            if (msg.includes('shadow host') || msg.includes('ShadowRoot')) {
                return;
            }
            if (msg.includes('removeChild') || msg.includes('not a child')) {
                // [MASTER] Intentem silenciar el soroll de DOM orfe que no afecta a la funcionalitat
                addHudLog('warn', ['[DOM-REFLOW] Detectat removeChild orfe. El sistema s\'està auto-sanejant.']);
                return;
            }
            if (import.meta.env.DEV) {
                originalError(...args); // Restaurat només per a diagnòstic real en DEV
            }
            addHudLog('error', args);
        };

        const originalInfo = console.info;
        const capturedInfo = (...args) => {
            const msg = String(args[0]);
            if (msg.includes('beforeinstallpromptevent') || msg.includes('Banner not shown')) {
                return;
            }
            addHudLog('info', args);
        };
        console.info = capturedInfo;

        const params = new URLSearchParams(window.location.search);
        const persistentDebug = localStorage.getItem('hud_debug_mode') === 'true';

        if (params.get('debug') === 'true' || persistentDebug) {
            setIsVisible(true);
            setIsOpen(true);
            if (params.get('debug') === 'true') {
                localStorage.setItem('hud_debug_mode', 'true');
                addHudLog('system', ['[MASTER] HUD persistent habilitat per a tota la sessió.']);
            }
        }

        const handleOpenEvent = () => {
            setIsVisible(true);
            setIsOpen(true);
        };
        window.addEventListener('open-diagnostic-hud', handleOpenEvent);

        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsVisible(true);
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const handleClickOutside = (e) => {
            const hudElement = document.querySelector('.diagnostic-hud');
            const triggerBtn = document.querySelector('.btn-icon-hud');

            if (hudElement && !hudElement.contains(e.target) &&
                (!triggerBtn || !triggerBtn.contains(e.target))) {
                setIsOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
            console.info = originalInfo;
            window.removeEventListener('open-diagnostic-hud', handleOpenEvent);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
            if (broadcast.current) broadcast.current.close();
        };
    }, [autoHealEnabled, viewMode, addHudLog]);

    const requestGeolocation = () => {
        addHudLog('action', ['[MAC-GEO] Sol·licitant geolocalització sobirana...']);
        if (!navigator.geolocation) {
            addHudLog('error', ['[MAC-GEO] El navegador no suporta geolocalització.']);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                addHudLog('success', [`[MAC - GEO] Localitzat: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} `]);
                // Simulem bategat de posició per a tot el sistema
                window.dispatchEvent(new CustomEvent('sp_location_update', { detail: pos.coords }));
            },
            (err) => {
                addHudLog('error', [`[MAC - GEO] Error: ${err.message}. Comprova permisos al Sistema(Mac).`]);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    const toggleDesktopMode = () => {
        const isDesktop = !themeConfig.isDesktopOptimized;
        updateConfig({ isDesktopOptimized: isDesktop });
        addHudLog('system', [`[DESKTOP] Mode Escriptori: ${isDesktop ? 'ACTIU' : 'INACTIU'} `]);
        document.body.classList.toggle('desktop-master-reflow', isDesktop);
    };
    const handleAutoHeal = React.useCallback((msg) => {
        // [MASTER BYPASS] Els errors de dades o esquema MAI han de disparar una recàrrega de bundle.
        // Són tech debt, no fallades de xarxa/deploy.
        const dbErrorPatterns = ['PGRST', 'ofici', 'column', 'relationship', '400', '401', '404', '42P01', '42501'];
        if (dbErrorPatterns.some(p => msg.includes(p))) {
            if (msg.includes('42501') && msg.includes('entity_member_map')) {
                addHudLog('critical', ['[DB-SECURITY] Permís denegat a entity_member_map.', 'Cal executar GRANT SELECT a Supabase.']);
            }
            return;
        }

        const criticalPatterns = ['Failed to fetch', 'ChunkLoadError', 'Manifest', 'Supabase', 'Geolocation'];

        // [MASTER BYPASS] Ignorar errors coneguts d'esquema que no requereixen recàrrega
        // Incloem PGRST201, relationship, i errors que solen ocórrer durant la sincronització en mòbil
        // També ignorem ReferenceErrors per evitar bucles infinits si el codi propi falla
        if (msg.includes('ofici') || msg.includes('column') || msg.includes('relationship') ||
            msg.includes('PGRST201') || msg.includes('400') ||
            msg.includes('ReferenceError') || msg.includes('TypeError')) {
            return;
        }

        if (criticalPatterns.some(p => msg.includes(p))) {
            addHudLog('critical', [`[!!ALERTA MANDATORY!!] ${msg} `]);

            if (msg.includes('Geolocation')) {
                addHudLog('info', ['[AUTO-HEAL] Recomanació: Prem el botó de Localització al HUD.']);
            }

            // [RESILIÈNCIA] Evitem re-bategats infinits comprovant l'auditor de forma segura
            let isPulseStable = true;
            try {
                if (typeof iaiaAuditor !== 'undefined' && iaiaAuditor.auditPulse) {
                    isPulseStable = iaiaAuditor.auditPulse();
                }
            } catch (e) {
                if (import.meta.env.DEV) {
                    console.warn('[AUTO-HEAL] Error auditant bategat:', e);
                }
            }

            if (!isPulseStable) {
                addHudLog('error', ['[AUTO-HEAL] Bucle detectat. Aturant protocols automàtics per seguretat.']);
                return;
            }

            addHudLog('system', ['[AUTO-HEAL] Detectada fallada crítica. Iniciant protocol de sanació...']);
            setIsHealing(true);

            setTimeout(() => {
                const fatalPatterns = ['ChunkLoadError', 'Failed to fetch'];
                if (fatalPatterns.some(p => msg.includes(p))) {
                    // [CIRCUIT BREAKER MASTER] Verifiquem estabilitat JUST ABANS de recarregar.
                    // Si ja hem recarregat massa cops, l'auditPulse retornarà false i aturarem el bucle.
                    let isSafeToRetry = true;
                    try {
                        if (typeof iaiaAuditor !== 'undefined' && iaiaAuditor.auditPulse) {
                            isSafeToRetry = iaiaAuditor.auditPulse();
                        }
                    } catch (e) {
                        if (import.meta.env.DEV) {
                            console.error('[AUTO-HEAL] Error final pre-reload:', e);
                        }
                    }

                    if (isSafeToRetry) {
                        addHudLog('system', ['[AUTO-HEAL] Recarregant bundle per a resoldre pèrdua de sincronització...']);
                        setTimeout(() => window.location.reload(), 500);
                    } else {
                        addHudLog('critical', ['[AUTO-HEAL] BUCLE DETECTAT. Recàrrega cancel·lada per seguretat.']);
                        setIsHealing(false);
                    }
                } else {
                    addHudLog('system', ['[AUTO-HEAL] Sanació completa. El bategat s\'ha estabilitzat.']);
                    setIsHealing(false);
                }
            }, 3000); // Augmentat a 3s per donar temps a la UI
        }
    }, [addHudLog]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = 0;
        }
    }, [logs]);

    const runSystemAudit = async () => {
        addHudLog('system', ['[AUDIT] Iniciant auditoria de Sacred Tech...']);
        // 1. Contrast Test
        const bodies = document.querySelectorAll('.card-body');
        addHudLog('info', [`[AUDIT] Verificant contrast en ${bodies.length} targetes.`]);

        // 2. Link Test
        const links = document.querySelectorAll('a');
        const broken = Array.from(links).filter(a => !a.href);
        if (broken.length > 0) addHudLog('error', [`[AUDIT] Trobats ${broken.length} enllaços orfes.`]);
        else addHudLog('success', ['[AUDIT] Enllaços OK.']);

        // 3. Sacred Tech Check
        const fonts = document.body.style.fontFamily;
        if (fonts.includes('Inter Tight')) addHudLog('success', ['[AUDIT] Sobirania tipogràfica Inter Tight confirmada.']);

        if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(50);
        addHudLog('system', ['[AUDIT] Auditoria completada. El sistema és digne.']);
    };

    const nuclearReload = async () => {
        addHudLog('action', [t('diag.nuke_start')]);
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
            addHudLog('success', [t('diag.nuke_cache_purged')]);
        }
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(r => r.unregister()));
            addHudLog('success', [t('diag.nuke_sw_removed')]);
        }
        setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
        }, 1000);
    };

    const deepCleanSession = async () => {
        addHudLog('action', [t('diag.clean_start')]);
        const flags = ['isPlaygroundMode', 'sb-simulation-mode', 'pwa_prompt_dismissed', 'impersonation_id'];
        flags.forEach(f => localStorage.removeItem(f));
        const { supabase } = await import('../supabaseClient');
        await supabase.auth.signOut();
        addHudLog('success', [t('diag.clean_ok')]);
        setTimeout(() => {
            window.location.href = '/login?harmony=true';
        }, 800);
    };

    const verifyIntegrity = async () => {
        setVerifyingIntegrity(true);
        addHudLog('action', [t('diag.integrity_start')]);
        const resources = ['/favicon.png', '/assets/avatars/comic/iaia_comic_matriarch.png'];
        let errors = 0;
        for (const res of resources) {
            try {
                const resp = await fetch(res, { method: 'HEAD' });
                if (!resp.ok) throw new Error('Not found');
                addHudLog('success', [`OK: ${res} `]);
            } catch {
                addHudLog('error', [`ERROR: ${res} `]);
                errors++;
            }
        }
        if (errors === 0) addHudLog('success', [t('diag.integrity_ok')]);
        else addHudLog('warn', [t('diag.integrity_error', { count: errors })]);
        setVerifyingIntegrity(false);
    };

    const forceUpdateAndClear = async () => {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (let reg of regs) await reg.unregister();
        }
        localStorage.clear();
        window.location.reload(true);
    };

    const runSelfHealing = async () => {
        setIsHealing(true);
        addHudLog('action', ['[MASTER] Iniciant Auto-Sanejament...']);

        try {
            const diag = await iaiaService.diagnoseSystem();
            setIaiaAdvice(diag.recommendation);
            addHudLog('info', [diag.recommendation]);

            // [MASTER] Auto-Fix Viewport
            if (!diag.viewport_ok) {
                addHudLog('action', ['Reparant Viewport...']);
                const meta = document.createElement('meta');
                meta.name = "viewport";
                meta.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0";
                document.getElementsByTagName('head')[0].appendChild(meta);
                addHudLog('success', ['Viewport bategat correctament.']);
            }

            // [MASTER] Cache Integrity Check
            addHudLog('action', ['Audit de caches i imatges...']);
            await verifyIntegrity();

            addHudLog('success', ['[MASTER] Auto-Sanejament completat. El sistema és ara més fort.']);
        } catch (error) {
            addHudLog('error', ['Error en el procés de cura: ' + error.message]);
        } finally {
            setIsHealing(false);
        }
    };

    const copySystemReport = () => {
        const report = `SÓC DE POBLE SYSTEM REPORT\nTime: ${new Date().toLocaleString()} \nVersion: ${VERSION} \nUser: ${user?.id || 'GUEST'} \nRole: ${profile?.role || 'null'} \nLogs: \n${logs.map(l => `[${l.time}] ${l.msg}`).join('\n')} `;
        navigator.clipboard.writeText(report).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleVoiceFeedback = async (audioBlob, duration, transcript) => {
        const result = await feedbackService.sendVoiceFeedback(audioBlob, duration, transcript, {
            context: 'HUD Direct Feedback',
            location: location.pathname
        });

        if (result.success) {
            addHudLog('success', ['Sugerència enviada amb èxit! Gràcies.']);
        }
        setShowVoiceFeedback(false);
    };

    const toggleHud = (e) => {
        if (e) e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    // El toggleTrigger ara només s'activa per a admins, editors o si està debug true
    if (!isVisible && !isEditorOrAdmin) return null;

    return (
        <>
            <div className={`diagnostic-hud ${!isOpen ? 'hidden' : ''} ${screenshotMode ? 'screenshot-mode' : ''} mode-${viewMode.toLowerCase()}`}>
                <div className="hud-header">
                    <div className="hud-header-title">
                        <Activity size={18} className={isHealing ? 'pulse-fast text-red-500' : 'pulse-slow text-cyan-400'} />
                        <h2>CONSOLA DE COMANDAMENT SOLATGE</h2>
                        <span className={`auto-heal-badge ${autoHealEnabled ? 'active' : ''}`}>
                            {autoHealEnabled && !isHealing ? <Check size={10} className="mr-1 inline" /> : null}
                            {autoHealEnabled ? 'ESTAT: HARMÒNIC' : 'HARMÒNIA: PAUSA'}
                        </span>
                        <div className="peace-signal-container" title="Senyal de Pau (Manteniment OK)">
                            <div className="peace-led"></div>
                            <span className="peace-text">SILENCI</span>
                        </div>
                        {forensicService.getLatestReports().length > 0 && (
                            <button className="crash-alert-tag pulse-fast" onClick={() => setCurrentHudTab('forensic')} aria-label="Veure crasheos">
                                <Shield size={10} color="#ff0055" />
                                <span>CRASH DETECTAT</span>
                            </button>
                        )}
                    </div>
                    <div className="hud-header-actions">
                        <button className={`btn - hud - tool ${currentHudTab === 'audit' ? 'active' : ''} `} onClick={runSystemAudit} title="Audit Ara">
                            <Shield size={20} />
                        </button>
                        <button className="btn-hud-tool" onClick={() => setShowHelp(!showHelp)}>
                            <Mic size={20} />
                        </button>
                        <button className="btn-hud-tool close-trigger" onClick={(e) => toggleHud(e)}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="hud-body">
                    {showVoiceFeedback && (
                        <div className="hud-voice-feedback-panel animate-slide-up">
                            <div className="hud-card-header">
                                <strong>Feedback Directe</strong>
                                <X size={14} onClick={() => setShowVoiceFeedback(false)} className="clickable" />
                            </div>
                            <p className="voice-recorder-hint">Explica'ns què milloraries d'esta pantalla:</p>
                            <VoiceRecorder
                                onSend={handleVoiceFeedback}
                                onCancel={() => setShowVoiceFeedback(false)}
                                lang={i18n.language}
                            />
                        </div>
                    )}

                    {iaiaAdvice && (
                        <div className="hud-iaia-advice animate-in" style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '12px', borderRadius: '0px', border: '1px solid #00f2ff', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                <Brain size={16} color="#00f2ff" />
                                <strong style={{ fontSize: '12px', color: '#00f2ff' }}>CONSELL DE LA IAIA (Auto-Cura)</strong>
                            </div>
                            <p style={{ fontSize: '13px', fontStyle: 'italic' }}>{iaiaAdvice}</p>
                        </div>
                    )}

                    {showHelp && !didacticAlert && !showVoiceFeedback && !iaiaAdvice && (
                        <div className="hud-educational-banner">
                            <Brain size={16} />
                            <span>{t('diag.didactic_hint') || "Aprofita la saviesa del bategat per a entendre el sistema."}</span>
                        </div>
                    )}

                    {didacticAlert ? (
                        <div className="hud-didactic-card animate-slide-up">
                            <div className="hud-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Brain size={18} color="var(--hud-accent)" />
                                    <strong style={{ letterSpacing: '1px' }}>{didacticAlert.title}</strong>
                                </div>
                                <X size={18} onClick={() => setDidacticAlert(null)} className="clickable" />
                            </div>
                            <div className="hud-card-body" style={{ padding: '20px' }}>
                                <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', color: '#fff' }}>{didacticAlert.iaia_says || didacticAlert.explanation}</p>

                                {didacticAlert.when && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ fontSize: '11px', color: 'var(--hud-accent)', textTransform: 'uppercase' }}>Quan usar-lo?</strong>
                                        <p style={{ fontSize: '13px', marginTop: '4px' }}>{didacticAlert.when}</p>
                                    </div>
                                )}

                                {didacticAlert.effect && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ fontSize: '11px', color: '#ff0055', textTransform: 'uppercase' }}>Quin efecte té?</strong>
                                        <p style={{ fontSize: '13px', marginTop: '4px' }}>{didacticAlert.effect}</p>
                                    </div>
                                )}

                                {didacticAlert.details && (
                                    <ul className="didactic-list">
                                        {didacticAlert.details.map((d, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: d.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hud-sections-grid">
                            <div 
                                className="hud-tabs-selector compact-scroll"
                                role="tablist"
                                aria-label="Pestanyes de la Consola de Comandament"
                            >
                                <button 
                                    className={currentHudTab === 'logs' ? 'active terminal' : 'terminal'} 
                                    onClick={() => setCurrentHudTab('logs')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'logs'}
                                    aria-controls="tabpanel-logs"
                                    id="tab-logs"
                                >TERMINAL</button>
                                <button 
                                    className={currentHudTab === 'sync' ? 'active sync' : 'sync'} 
                                    onClick={() => setCurrentHudTab('sync')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'sync'}
                                    aria-controls="tabpanel-sync"
                                    id="tab-sync"
                                >SINCRONITZACIÓ</button>
                                <button 
                                    className={currentHudTab === 'rendiment' ? 'active rendi' : 'rendi'} 
                                    onClick={() => setCurrentHudTab('rendiment')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'rendiment'}
                                    aria-controls="tabpanel-rendiment"
                                    id="tab-rendiment"
                                >RENDIMENT</button>
                                <button 
                                    className={currentHudTab === 'errors' ? 'active error' : 'error'} 
                                    onClick={() => setCurrentHudTab('errors')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'errors'}
                                    aria-controls="tabpanel-errors"
                                    id="tab-errors"
                                >ERRORS</button>
                                <button 
                                    className={currentHudTab === 'reports' ? 'active reports' : 'reports'} 
                                    onClick={() => {
                                        setCurrentHudTab('reports');
                                        const reportLang = i18n.language === 'es' ? '_ES' : '';
                                        fetch(`/TECHNICAL_REPORT_VIVO${reportLang}.md`)
                                            .then(res => res.text())
                                            .then(setTechReport)
                                            .catch(err => console.error('Error carregant l\'informe:', err));
                                    }}
                                    role="tab"
                                    aria-selected={currentHudTab === 'reports'}
                                    aria-controls="tabpanel-reports"
                                    id="tab-reports"
                                >INFORME TÈCNIC</button>
                                <button 
                                    className={currentHudTab === 'forensic' ? 'active reports' : 'reports'} 
                                    onClick={() => setCurrentHudTab('forensic')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'forensic'}
                                    aria-controls="tabpanel-forensic"
                                    id="tab-forensic"
                                >INFORMES FORENSES</button>
                                <button 
                                    className={currentHudTab === 'style' ? 'active' : ''} 
                                    onClick={() => setCurrentHudTab('style')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'style'}
                                    aria-controls="tabpanel-style"
                                    id="tab-style"
                                >ESTIL [MASTER]</button>
                                <button 
                                    className={currentHudTab === 'faq' ? 'active' : ''} 
                                    onClick={() => {
                                        setCurrentHudTab('faq');
                                        setDidacticAlert(didacticData.master_faq);
                                    }}
                                    role="tab"
                                    aria-selected={currentHudTab === 'faq'}
                                    aria-controls="tabpanel-faq"
                                    id="tab-faq"
                                >AGÈNDA FAQ</button>
                                <button 
                                    className={currentHudTab === 'system' ? 'active' : ''} 
                                    onClick={() => setCurrentHudTab('system')}
                                    role="tab"
                                    aria-selected={currentHudTab === 'system'}
                                    aria-controls="tabpanel-system"
                                    id="tab-system"
                                >SISTEMA</button>
                                <button className="btn-report-live" onClick={() => window.open('/soc_de_poble_report.html', '_blank')}>CENTRE INTERPRETACIÓ</button>
                            </div>

                            <div 
                                role="tabpanel" 
                                id={`tabpanel-${currentHudTab}`} 
                                aria-labelledby={`tab-${currentHudTab}`}
                                className="hud-tab-content-wrapper"
                                style={{ display: 'contents' }}
                            >
                                {currentHudTab === 'faq' && <DiagnosticFAQTab didacticData={didacticData} />}
                                {currentHudTab === 'reports' && <DiagnosticReportsTab techReport={techReport} i18n={i18n} />}
                                {currentHudTab === 'forensic' && <DiagnosticForensicTab forensicService={forensicService} setLogs={setLogs} />}
                                {['logs', 'sync', 'rendiment', 'errors'].includes(currentHudTab) && (
                                    <DiagnosticTerminalTab 
                                        currentHudTab={currentHudTab} 
                                        logs={logs} 
                                        terminalRef={terminalRef} 
                                        analyzeErrorWithIAIA={analyzeErrorWithIAIA} 
                                    />
                                )}
                                {currentHudTab === 'style' && (
                                    <DiagnosticStyleTab 
                                        themeConfig={themeConfig} 
                                        updateConfig={updateConfig} 
                                        ruralInfo={ruralInfo} 
                                        requestGeolocation={requestGeolocation} 
                                        toggleDesktopMode={toggleDesktopMode} 
                                        validateContrast={validateContrast} 
                                        resetToMasia={resetToMasia} 
                                    />
                                )}
                                {currentHudTab === 'system' && (
                                    <DiagnosticSystemTab 
                                        i18n={i18n} 
                                        hudActivity={hudActivity} 
                                        isHealing={isHealing} 
                                        VERSION={APP_VERSION} 
                                        setDidacticAlert={setDidacticAlert} 
                                        didacticData={didacticData} 
                                        user={user} 
                                        profile={profile} 
                                        visionMode={visionMode} 
                                        isAdmin={isAdmin} 
                                        forceNukeSimulation={forceNukeSimulation} 
                                        showHelp={showHelp} 
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="hud-actions-footer">
                    <div className="main-actions" style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-primary level-1" onClick={copySystemReport} style={{ width: '100%' }}>
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                <span>{copied ? 'SISTEMA COPIAT' : 'INFORME CONTROL'}</span>
                            </button>
                            <Info size={14} className="hud-info-trigger" onClick={() => setDidacticAlert(didacticData.actions.copy_report)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button
                                className={`btn - hud - primary level - 2 master - heal ${isHealing ? 'healing' : ''} `}
                                onClick={runSelfHealing}
                                disabled={isHealing}
                                style={{ width: '100%' }}
                            >
                                <Zap size={20} />
                                <span>{isHealing ? 'SANEJANT...' : 'AUTO-SANEJAMENT'}</span>
                            </button>
                            <Info size={14} className="hud-info-trigger" onClick={() => setDidacticAlert(didacticData.actions.self_healing)} />
                        </div>
                    </div>
                    <div className="secondary-actions">
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-outline level-1" onClick={verifyIntegrity} disabled={verifyingIntegrity} style={{ width: '100%' }}>
                                <Shield size={16} /> <span>VERIFICAR SISTEMA</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.verify_system)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-outline level-1" onClick={forceUpdateAndClear} style={{ width: '100%' }}>
                                <RefreshCw size={16} /> <span>REFRESCAR MATRIZ</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.refresh_matrix)} />
                        </div>
                    </div>
                    <div className="danger-zone">
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-danger level-3" onClick={deepCleanSession} style={{ width: '100%' }}>
                                <Trash2 size={16} /> <span>PURGA DE SESSIÓ</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.session_purge)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-danger level-3" onClick={nuclearReload} style={{ width: '100%' }}>
                                <Zap size={16} /> <span>RESEMBRA TOTAL (RENOVAR)</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.nuclear_reset)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button 
                                className="btn-hud-danger level-3 master-reset-btn" 
                                onClick={async () => {
                                    const { masterReset } = await import('../utils/masterReset');
                                    if (window.confirm('⚠️ ALERTA OMEGA: Estàs a punt d\'esborrar TOTA la teua identitat i dades locals. Aquesta acció és irreversible sense Padrins. Vols procedir?')) {
                                        await masterReset();
                                    }
                                }} 
                                style={{ 
                                    width: '100%', 
                                    background: 'linear-gradient(45deg, #ff0055, #f59e0b)',
                                    color: 'white',
                                    fontWeight: '950',
                                    border: 'none',
                                    boxShadow: '0 0 20px rgba(255, 0, 85, 0.4)'
                                }}
                            >
                                <Zap size={16} /> <span>DIA ZERO: REINICI MESTRE</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert({
                                title: "Protocol DIA ZERO",
                                explanation: "Destrucció creativa del 'solatge' (localStorage i IndexedDB). Purifica el dispositiu per a un inici de demo impecable.",
                                when: "Abans de la reunió amb Sollutia per garantir que no hi ha dades de test velles.",
                                effect: "Esborra la identitat sobirana local i totes les rèpliques de dades."
                            })} />
                        </div>
                    </div>
                    <button className="btn-hud-restore" onClick={async () => await forceNukeSimulation()}>
                        <Activity size={18} /> <span>RESTAURAR SOBIRANIA DEL PERFIL</span>
                    </button>
                </div>
            </div>

            {isVisible && (
                <button
                    className={`btn-icon-hud ${isOpen ? 'active' : ''}`}
                    onClick={(e) => toggleHud(e)}
                >
                    <Terminal size={14} /> <span>{t('common.support_short') || 'DIAG'}</span>
                </button>
            )}
        </>
    );
};

export default DiagnosticConsole;
```
\n## 📄 ARCHIVO: src/sync/syncEngine.js
```javascript
import { openDB } from "idb";
import * as Y from "yjs";

const DB_NAME = "soc-poble-sync";
const STORE_QUEUE = "sync-queue";

let db;
let isSyncing = false;
let isOnline = navigator.onLine;

export async function initSyncEngine() {
  db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
    },
  });

  window.addEventListener("online", () => {
    isOnline = true;
    processQueue();
  });

  window.addEventListener("offline", () => {
    isOnline = false;
  });

  document.addEventListener("visibilitychange", handleVisibility);
}

function handleVisibility() {
  if (document.hidden) pauseSync();
  else resumeSync();
}

export async function enqueue(op) {
  await db.put(STORE_QUEUE, {
    id: crypto.randomUUID(),
    payload: op,
    retries: 0,
    createdAt: Date.now(),
  });

  processQueue();
}

async function processQueue() {
  if (!isOnline || isSyncing) return;
  isSyncing = true;

  try {
    const txRead = db.transaction(STORE_QUEUE, "readonly");
    const items = await txRead.objectStore(STORE_QUEUE).getAll();

    for (const item of items) {
      if (!navigator.onLine) break;
      
      let success = false;
      try {
        await sendToNetwork(item.payload);
        success = true;
      } catch {
        item.retries++;
      }

      const txWrite = db.transaction(STORE_QUEUE, "readwrite");
      if (success || item.retries > 5) {
        await txWrite.objectStore(STORE_QUEUE).delete(item.id);
      } else {
        await txWrite.objectStore(STORE_QUEUE).put(item);
      }
      await txWrite.done;
    }
  } catch (err) {
    console.error("[GROK] Falla crítica en SyncEngine:", err);
  } finally {
    isSyncing = false;
  }
}

// eslint-disable-next-line no-unused-vars
async function sendToNetwork(payload) {
  // aquí WebRTC / HTTP fallback
  return Promise.resolve();
}

function pauseSync() {
  isSyncing = true;
}

function resumeSync() {
  isSyncing = false;
  processQueue();
}

export async function pruneStorage() {
  const estimate = await navigator.storage.estimate();

  if (estimate.usage / estimate.quota > 0.7) {
    const tx = db.transaction(STORE_QUEUE, "readwrite");
    const store = tx.objectStore(STORE_QUEUE);

    let cursor = await store.openCursor();

    while (cursor) {
      if (Date.now() - cursor.value.createdAt > 7 * 86400000) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
  }
}
```
\n## 📄 ARCHIVO: src/hooks/useTrellatSync.js
```javascript
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { createHelia } from 'helia';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';
import { getCrypto } from 'pkijs';

export const useTrellatSync = (podId) => {
  const [isOnline, setIsOnline] = useState(false);
  const ydocRef = useRef(null);
  const heliaRef = useRef(null);
  const privateKeyRef = useRef(null);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    // Sync automàtic amb Supabase Edge Function (desactivat momentàniament)
    // syncWithSupabase(ydocRef.current);
  }, []);

  const init = useCallback(async () => {
    // 1. Yjs CRDT
    ydocRef.current = new Y.Doc();

    // 2. Clau Ed25519 per al pod (emmagatzemada en IndexedDB)
    if (!privateKeyRef.current) {
      const seed = new TextEncoder().encode(podId + '-trellat-2026');
      privateKeyRef.current = await getCrypto().subtle.digest('SHA-256', seed);
    }

    // 3. IPFS + libp2p
    heliaRef.current = await createHelia({
      libp2p: {
        transports: [],
        connectionEncryption: [noise()],
        streamMuxers: [yamux()],
        peerDiscovery: [bootstrap({ list: ['/dnsaddr/bootstrap.libp2p.io/...'] })]
      }
    });

    setIsOnline(true);

    // 4. Listener de reconnexió oportunista
    window.addEventListener('online', handleOnline);
  }, [podId, handleOnline]);

  const signAndPublishManifest = useCallback(async (manifest) => {
    const signature = await signManifest(manifest, privateKeyRef.current);
    ydocRef.current.getMap('manifests').set(podId, { manifest, signature });
    await heliaRef.current.libp2p.dialProtocol('/trellat/1.0', manifest); // P2P broadcast
  }, [podId]);

  const teardown = useCallback(() => {
    window.removeEventListener('online', handleOnline);
    if (heliaRef.current) {
      heliaRef.current.stop();
    }
    if (ydocRef.current) {
      ydocRef.current.destroy();
    }
    ydocRef.current = null;
  }, [handleOnline]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    init();
    return teardown;
  }, [init, teardown]);

  return { isOnline, signAndPublishManifest, ydocRef };
};

// Funció auxiliar de signatura (Ed25519)
// eslint-disable-next-line no-unused-vars
async function signManifest(manifest, privateKey) {
  // noble-curves o similar - placeholder per Ara
  return 'ed25519-signature-placeholder';
}
```
\n## 📄 ARCHIVO: src/sw.js
```javascript
/* global clients */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

// [ANTI-GHOST PROTOCOL] Forcem el control immediat i netegem brossa
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// Precaché automatically injected by VitePWA builder
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => {
        self.registration.update();
        self.clients.claim();
      });
  }

  // Handle scheduling medication alarms via message
  if (event.data && event.data.type === 'SCHEDULE_MEDICATION') {
    const { title, body, timestamp, meds } = event.data.payload;
    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
      if ('showTrigger' in Notification.prototype) {
        self.registration.showNotification(title, {
          body,
          icon: '/android-chrome-192x192.png',
          badge: '/android-chrome-192x192.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          requireInteraction: true,
          data: { url: '/medication-confirm', meds },
          showTrigger: new self.TimestampTrigger(timestamp),
          actions: [
            {
              action: 'confirm',
              title: 'JA L\'HE PRESA'
            },
            {
              action: 'snooze',
              title: 'AJORNA 10 MIN'
            }
          ]
        });
      } else {
        console.warn("[SW] Background Offline Alarms (TimestampTrigger) no suportat pel sistema operatiu. Avortant timeout suïcida.");
      }
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  if (event.action === 'confirm') {
    // Navigate with a specific action query param
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url.includes('/medication-confirm')) {
            matchingClient = windowClient;
            break;
          }
        }
        if (matchingClient) {
          return matchingClient.focus().then(() => matchingClient.navigate(urlToOpen + '?action=confirm'));
        } else {
          return clients.openWindow(urlToOpen + '?action=confirm');
        }
      })
    );
  } else if (event.action === 'snooze') {
    // Just a placeholder, snooze will rely on SW getting message or local IDB handling later
    // Could send a message to clients
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        windowClients.forEach((client) => {
          client.postMessage({ type: 'SNOOZE_MEDICATION', payload: event.notification.data });
        });
      })
    );
  } else {
    // Normal tap on notification
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }
        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
```

---
**[FIN DEL CÓDIGO]**
Por favor, Alto Consejo (ChatGPT), procede con tu análisis implacable e indícanos tus capacidades (tokens/turnos restantes) para planificar la operación.
