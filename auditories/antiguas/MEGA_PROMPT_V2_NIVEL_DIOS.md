# 🚀 MEGA-PROMPT V2: AUDITORÍA ARQUITECTÓNICA "NIVEL DIOS" Y PWA EXTREMA ("Sóc de Poble")
**ROL:** Eres el *Principal Software Architect* y *Staff UI/UX Engineer* especialista en ecosistemas locales, PWAs Offline-First de alta resiliencia y redes descentralizadas. Tu objetivo es auditar la viabilidad de nuestra matriz de renderizado React.
**SISTEMA:** React, Vite, Yjs, IndexedDB, TailwindCSS (Estrategia de z-index y renders implacables).

---
### ⚠️ INSTRUCCIÓN CONDICIONAL DE TOKENS (PARA MODELOS DE MENOR VENTANA / LECHAT)
Si tu ventana de contexto actual está al límite, **IGNORA EVALUAR EL CÓDIGO LÍNEA A LÍNEA**, da por hecho que el código compila y céntrate pura y exclusivamente en los **4 Vectores Ciegos** (Sección 2) aplicando tus conocimientos de arquitectura general y el historial de esta conversación. Si eres nuevo en este chat (ChatGPT o ventana limpia), asimila esta matriz y procesa todo el árbol de dependencias descrito. Devora los tokens y analiza la arquitectura real. No te dejes asustar por el tamaño del código.

---
### 📌 1. ESTADO DEL SISTEMA Y REGLAS INMUTABLES
Acabamos de erradicar inconsistencias de capa (`z-index`) y renders zombi (`modal-overlay`). Reglas:
1. **Regla Matemática del Hamburguesa:** Tolerancia cero al uso de menús hamburguesa por defecto. El icono `Menu` **SOLO** aparece como "rebosadero" (Overflow) si los iconos no caben en una resolución extrema. Excepción: `ContextualMenu` base (arriba) tiene un gestor maestro de categorías que sí usa ese icono por razones semánticas inamovibles.
2. **Entorno Hostil 320px / 3G:** Esta PWA no vivirá en un MacBook Pro con Wi-Fi 6. Su escenario de batalla es un iPhone SE antiguo o un Galaxy J4 en medio del campo a **320px** de ancho y **con cobertura 3G intermitente**. Si el sistema engulle mucha RAM, la PWA provocará que Safari crashee. Todo debe asfixiar la CPU lo mínimo posible.

---
### 🔮 2. LA VISIÓN DE FUTURO Y LOS 4 VECTORES CIEGOS
El ecosistema tiene el ADN *Local-First* activado. Queremos que soporte todo el peso de la comunidad de nuestro Poble. Exijo tu auditoría despiadada (y tus soluciones de arquitectura) sobre estas 4 vulnerabilidades exactas:

1. **Gestión Extremista de Estado (Main Thread Blocking):** Nuestro `AppLayout` anida proveedores como Auth, ModalState, Navigation. Fíjate en cómo inyectamos los modales globales en `GlobalModals` envueltos en `Portal` y cómo el layout cambia por `useLocation()`. Si un campesino con móvil de 2GB RAM dispara un state desde Navbar, ¿infartará la UI con renders anidados en red, congelando la interacción táctil?
2. **Service Workers y Fugas Fantasmas (Caché Zombi):** Desplegaremos OTA (Over-The-Air) actualizando esquemas pesados en *IndexedDB*. ¿Cómo evitamos una Caché Zombi donde Workbox bloquea la app en un estadio intermedio donde mezcla JS de la versión 12 y esquemas de base de datos de la versión 13 provocando una pantalla blanca eterna?
3. **Escalada de Red en Zonas Muertas (Background Sync queue):** Cuando la conexión colapsa, enviamos contenido Yjs/WebRTC. ¿Deberíamos bloquear la carga de imágenes usando "Optimistic Updates" pasivas? Si se corta el GPRS transfiriendo una foto de 5MB en medio de `UniversalCard`, ¿está lista la asincronía de React para rebotar pacíficamente a PouchDB/IndexedDB o matará la app por Memoria Heap Out of Bounds?
4. **Resiliencia XSS (Prototype Pollution)**: En la arquitectura inyectada hay inputs libres en `CreationHub`. Dado que tip-tap manipula el DOM con el motor `DOMPurify`, si atacamos las profundidades del árbol JSON parseado de `Yjs`, ¿pueden reescribirse `__proto__` desde objetos de la base de datos distribuida inyectando malware a otros nodos?

---
### 💾 3. MATRIZ DE CÓDIGO MASIVA (PAYLOAD DE AUDITORÍA FULL)
Analiza exhaustivamente cada fragmento para respaldar tu veredicto.

**FILE 1: src/components/AppLayout.jsx (El Corazón)**
```jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// (Imports Omitidos por Seguridad de Buffer... se asume presencia de Providers: Auth, Design, Navigation)
const ContextualMenu = lazy(() => import("./ContextualMenu"));
const MobileBottomNav = lazy(() => import("./MobileBottomNav"));
// ... (Multiples lazy components)

const AppLayout = () => {
  const { architectMode, accessibilityMode } = useDesign();
  const { isDrawerOpen, closeDrawer, iaiaSidebarOpen } = useNavigation();
  const location = useLocation();
  const isOverflowHidden = location.pathname.startsWith("/chats");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen support-dvh:h-[100dvh] w-full overflow-hidden bg-theme-base">
      {/* HEADER ESCUDO NEGRO */}
      <div className="w-full relative z-base bg-[#000000] h-[64px] min-h-[64px]" />

      <div className="grid md:grid-cols-[auto_1fr] overflow-hidden relative min-h-0">
        {/* SIDEBAR NAVIGATION RAIL */}
        <div className={`fixed z-[var(--z-sidebar)] h-[100dvh] w-[300px] transition-transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} md:relative`}>
           {/* SidebarContent */}
        </div>

        {/* MAIN VIEWPORT - EL ESCENARIO (Aquí corre el contenido pesado) */}
        <main className={`min-w-0 min-h-0 flex flex-col flex-1 ${isOverflowHidden ? "overflow-hidden" : "overflow-y-auto"}`} style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}>
          <Suspense fallback={null}>
            <ContextualMenu />
          </Suspense>
          
          <div className="flex-1 min-h-0 relative flex flex-col">
            <Suspense fallback={<div className="NanoLoader..."/>}>
               <Routes>
                 <Route path="/mur" element={<Feed />} />
                 <Route path="/chats/*" element={<ChatLayout />} />
                 {/* Decenas de rutas dinámicas anidadas */}
               </Routes>
            </Suspense>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};
export default AppLayout;
```

**FILE 2: src/components/ContextualMenu.jsx (El Sticky Top Gestor de Categorías)**
```jsx
// El botón hamburguesa está aquí de forma legítima como centro de mando.
import React from 'react';
import { Menu } from 'lucide-react';
// ... otros imports

const ContextualMenu = () => {
    // Este menú lidia con anchos extremos de 320px, ahora reforzado con Tailwind y Z-Index Dinámico
    return (
        <div className="h-[48px] w-full bg-[#1a1a1a] flex items-center sticky top-0 z-[calc(var(--z-nav)+1)] select-none shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
            <div className="flex-1 overflow-x-auto no-scrollbar pl-2 pr-2">
                <div className="flex justify-center gap-6 h-full min-w-max mx-auto">
                    {/* Botoneras Flex Horizontales */}
                </div>
            </div>
            {/* El botón Hamburguesa Oficial (Gestor de Categorías) con ancho protegido */}
            <div className="flex items-center bg-[#1a1a1a]/90 backdrop-blur-sm px-2 xs:px-4">
                <button className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center">
                    <Menu size={16} />
                </button>
            </div>
        </div>
    );
};

export default React.memo(ContextualMenu);
```

**FILE 3: src/components/MobileBottomNav.jsx (La Botonera de Acción Fija Inferior)**
```jsx
// Cero Hamburguesas por Regla 1. Si sobra contenido, se hará scroll horizontal.
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutGrid, Store, MapPin, Plus } from 'lucide-react';

const TABS = [
  { id: '/chats', icon: MessageSquare, label: 'XAT' },
  { id: '/mur', icon: LayoutGrid, label: 'MUR' },
  { id: 'ADD', icon: Plus, label: 'CONNECTAR', isAction: true },
  { id: '/mercat', icon: Store, label: 'MERCAT' },
  { id: '/pobles', icon: MapPin, label: 'POBLES' },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleActionClick = React.useCallback(
    (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      if (id === 'ADD') {
        navigate('/hub');
      } else {
        navigate(id);
      }
    },
    [navigate]
  );

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] lg:hidden bg-[#050505] border-t border-white/5 shadow-[0_-4px_10px_rgba(0,0,0,0.5)] select-none touch-manipulation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(72px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-between w-full h-full px-1 xs:px-2">
        {TABS.map((tab) => {
          const isActive = location.pathname.startsWith(tab.id) && !tab.isAction;
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={(e) => handleActionClick(e, tab.id)}
                aria-label={tab.label}
                className="flex-1 max-w-[100px] h-[56px] bg-[#544CF6] text-white rounded-[16px] flex flex-col items-center justify-center space-y-0.5 mx-1 transition-colors active:bg-[#4338CA] outline-none"
              >
                <Icon size={22} strokeWidth={3} />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden min-[360px]:block">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={(e) => handleActionClick(e, tab.id)}
              aria-label={tab.label}
              className={`flex-1 flex flex-col items-center justify-center h-full space-y-1 transition-colors outline-none
                ${isActive ? 'text-[#F97316]' : 'text-white/60 hover:text-white/90'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 3 : 2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden min-[400px]:block">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
```

**FILE 4: src/components/GlobalModals.jsx (El Controlador Maestro de Portales z-index extremos)**
```jsx
import React, { useRef } from 'react';
import { useModalState, useModalDispatch } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Portal from './Portal';
import CreatePostModal from './CreatePostModal';
import ConnectionSelectorModal from './ConnectionSelectorModal';
import { useModalFocusTrap } from '../hooks/useModalFocusTrap';

const GlobalModals = () => {
    // Escucha masiva al contexto de Modales.
    const { isPostModalOpen, isConnectionModalOpen, connectionConfig /*...otros 10 modales...*/ } = useModalState();
    const { setIsPostModalOpen, closeConnectionModal } = useModalDispatch();
    const portalRef = useRef(null);

    const isAnyModalOpen = isPostModalOpen || isConnectionModalOpen;
    useModalFocusTrap(isAnyModalOpen, () => { /* close connection modal logic */ }, portalRef);

    return (
        <Portal>
            {/* Este div outline-none engloba todos los modales para FocusTrap */}
            <div ref={portalRef} tabIndex="-1" className="outline-none contents">
                <CreatePostModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                />

                {isConnectionModalOpen && connectionConfig && (
                    <ConnectionSelectorModal
                        isOpen={isConnectionModalOpen}
                        onClose={closeConnectionModal}
                        postId={connectionConfig.postId}
                        currentTags={connectionConfig.currentTags || []}
                        onUpdate={connectionConfig.onUpdate}
                    />
                )}
                {/* ...Otros Múltiples Componentes Renderizables Condicionalmente... */}
            </div>
        </Portal>
    );
};

export default React.memo(GlobalModals);
```

**FILE 5: src/components/UniversalCard/index.jsx (El Renderizador de Bucle de Datos Local-First)**
```jsx
// La UniversalCard procesa eventos pesados (posts, mercat, etc) dentro del main viewport en iteraciones infinitas.
import React, { Suspense, useMemo, useCallback } from 'react';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardFooter from './UniversalCard.Footer';

const UniversalCard = ({ item, viewMode, onNavigate }) => {
    // Computaciones masivas de variables según el tipo de datos
    const isAlert = useMemo(() => item?.category === 'Alert' || item?.is_alert, [item]);

    const handleCardClick = useCallback(() => { /* triggers haptic & navigate */ }, []);

    return (
        <article className="universal-card cursor-pointer transition-transform transform-gpu" onClick={handleCardClick}>
            <UniversalCardHeader item={item} />
            <Suspense fallback={<div className="animate-pulse bg-surface/30 h-10 w-full" />}>
                <UniversalCardFooter item={item} viewMode={viewMode} />
            </Suspense>
        </article>
    );
};
export default React.memo(UniversalCard, propsAreEqual);
```

---
### 🟢 AHORA SE ESPERA TU RETORNO CRÍTICO
Audita este MEGA-PAYLOAD a fondo y entréganos el "Plan de Supervivencia".
1. Escudriña cada React.memo, useCallback y Suspense en estos archivos. ¿Hay renderizados síncronos escondidos que provoquen janks graves?
2. Da implementaciones específicas (o pseudo-código JavaScript robusto) que blinden las debilidades reales y teóricas que encuentres.
3. Sé franco: ¿Ves un colapso inminente en la manera en que inyectamos el DOM con los Contextos y modales globales (GlobalModals + AppLayout)?
4. Dicta las directivas de seguridad para Yjs / WebRTC y Background Sync.

Termina dándonos tu opinión honesta sobre la salud del código y la ruta de estabilización.
```
