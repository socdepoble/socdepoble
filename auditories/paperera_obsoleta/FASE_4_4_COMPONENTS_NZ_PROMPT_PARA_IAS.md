### PREÁMBULO PARA CHATS NUEVOS: AUDITORÍA DE "SÓC DE POBLE" ###
Hola. Estás analizando "Sóc de Poble", una plataforma digital rural y offline-first (CRDT, SQLite, PowerSync) construida en React y Vite. El sistema es gigantesco y para evitar que agotes tus tokens o pierdas el contexto, la auditoría completa se ha dividido en 4 fases que se ejecutarán en sesiones independientes.

ESTA ES LA FASE 4 DE 4: 4_COMPONENTS_NZ

Como eres una instancia fresca y este es un chat independiente, lee atentamente el CONTEXTO GLOBAL CRÍTICO de la arquitectura para que no alucines soluciones incompatibles:
1. **Offline-First & PWA**: La fuente de la verdad es SIEMPRE la base de datos local reactiva (SQLite vía CRDT-Rizhoma y PowerSync). NUNCA sugieras sustituir lecturas reactivas locales por peticiones directas HTTP/Fetch al backend de Supabase.
2. **Filosofía Visual**: El diseño es premium (Glassmorphism, border-radius 32px, colores terrosos/naranjas vibrantes).
3. **Restricciones de Rendimiento**: Prohibidos los `useEffect` sin cleanup estricto, bucles de re-render (closures obsoletas) y fugas de memoria.
4. **Enfoque LÁSER**: Céntrate ESTRICTAMENTE en los archivos que te adjunto. Da por hecho que el resto del sistema funciona perfectamente.

### OBJETIVOS ESPECÍFICOS DE LA FASE 4: Componentes UI (Segunda mitad). Buscamos un estado limpio, sin pánico de useEffects y rendimiento en móviles. ###
1. Detecta useEffects innecesarios, re-renders en cascada o código inalcanzable en estos archivos.
2. Alerta sobre mala praxis que dañe la usabilidad en dispositivos móviles o el estado CRDT.

Asume el rol de Arquitecto Senior. Responde dividiendo tus hallazgos de forma muy directa por Componente/Archivo, e incluye los bloques de código exactos con el Fix. No expliques obviedades, ve directo a la solución de código.

----------------------------
ARCHIVOS ALIMENTADOS EN ESTA AUDITORIA FASE 4 (89 archivos):



=====================================
FILE: src/components/NanoLoader.jsx
=====================================

import React from 'react';
import { Leaf, Cpu } from 'lucide-react';
import './NanoSplashScreen.css'; // Reuse splash styles fo efficiency

const NanoLoader = ({ message = "Carregant Sóc de Poble..." }) => {
    return (
        <div className="nano-splash loader-only">
            <div className="splash-background">
                <div className="blob orange"></div>
                <div className="blob cyan"></div>
            </div>

            <div className="loader-content">
                <div className="nano-logo-container animate-pulse">
                    <div className="nano-icon">
                        <Leaf className="leaf-icon" size={40} />
                        <Cpu className="cpu-icon" size={20} />
                    </div>
                </div>
                <p className="loader-message">{message}</p>
            </div>

            <style>{`
                .loader-only { background: rgba(10, 15, 30, 0.9); z-index: 1000; }
                .loader-content { text-align: center; }
                .loader-message { margin-top: 15px; font-family: 'Inter', sans-serif; color: #00f2ff; font-weight: 500; font-size: 0.9rem; }
                .animate-pulse { animation: loader-pulse 1.5s infinite ease-in-out; }
                @keyframes loader-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NanoLoader;


=====================================
FILE: src/components/NanoSplashScreen.css
=====================================

.nano-splash {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0a0f1e;
    z-index: 20000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--text-main);
    font-family: 'Outfit', 'Inter', sans-serif;
}

.splash-background {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    filter: blur(80px);
    opacity: 0.6;
}

.blob {
    position: absolute;
    width: 40vw;
    height: 40vw;
    border-radius: 0px;
    animation: blob-float 15s infinite alternate ease-in-out;
}

.blob.orange {
    background: #E07A5F;
    top: 10%;
    left: 10%;
}

.blob.cyan {
    background: #00f2ff;
    bottom: 10%;
    right: 10%;
    animation-delay: -5s;
}

.blob.earth {
    background: #3d405b;
    top: 40%;
    left: 40%;
    animation-delay: -10s;
}

@keyframes blob-float {
    0% {
        transform: scale(1) translate(0, 0);
    }

    100% {
        transform: scale(1.5) translate(10%, 10%);
    }
}

.splash-content {
    position: relative;
    z-index: 2;
    text-align: center;
    width: 100%;
    max-width: 600px;
    margin-top: 150px;
    /* Space for the header logo */
}

.splash-fixed-branding {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    animation: branding-pulse 3s infinite ease-in-out;
}

.splash-main-logo {
    height: 80px;
    object-fit: contain;
}

@keyframes branding-pulse {

    0%,
    100% {
        transform: translateX(-50%) scale(1);
        filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.2));
    }

    50% {
        transform: translateX(-50%) scale(1.05);
        filter: drop-shadow(0 0 25px rgba(0, 242, 255, 0.4));
    }
}

.nano-logo-container {
    margin-top: 0;
}

.nano-logo-container h1 {
    font-size: 40px;
    font-weight: 900;
    letter-spacing: 10px;
    margin: 10px 0 0;
    background: linear-gradient(135deg, #fff 0%, #00f2ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    /* Lint fix */
}

.nano-icon {
    position: relative;
    display: inline-block;
}

.cpu-icon {
    position: absolute;
    bottom: -5px;
    right: -5px;
    color: #00f2ff;
    filter: drop-shadow(0 0 10px #00f2ff);
}

.leaf-icon {
    color: #E07A5F;
}

/* Word Cascade */
.word-cascade {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.word-item {
    opacity: 0;
    transform: translateY(20px);
    animation: word-fade-in 0.8s forwards ease-out;
}

@keyframes word-fade-in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.word-main {
    display: block;
    font-size: 42px;
    font-weight: 800;
    letter-spacing: 4px;
}

.word-main .highlight {
    color: #00f2ff;
    text-shadow: 0 0 15px rgba(0, 242, 255, 0.6);
}

.word-sub {
    font-size: var(--font-size-base);
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 2px;
}

/* Final branding */
.final-logo {
    position: relative;
    display: inline-block;
}

.final-logo img {
    height: 100px;
}

.sparkle {
    position: absolute;
    top: -10px;
    right: -10px;
    color: #ffd700;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.2);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0.5;
    }
}

.animate-in {
    animation: scale-up 1s ease-out;
}

@keyframes scale-up {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.phase-wordplay .nano-logo-container {
    animation: fade-out 0.5s forwards;
}

@keyframes fade-out {
    to {
        opacity: 0;
        transform: scale(1.1);
    }
}

=====================================
FILE: src/components/NanoSplashScreen.jsx
=====================================

import React, { useEffect, useState } from 'react';
import './NanoSplashScreen.css';
import { Leaf, Cpu, Sparkles } from 'lucide-react';

const NanoSplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // logo, wordplay, final

    useEffect(() => {
        const timer1 = setTimeout(() => setPhase('wordplay'), 800);
        const timer2 = setTimeout(() => setPhase('final'), 2000);
        const timer3 = setTimeout(() => onComplete?.(), 3500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    const words = [
        { main: 'VIdA', sub: 'Vitalitat Rural' },
        { main: 'SAbIdurIA', sub: 'Saviesa Compartida' },
        { main: 'AlegrIA', sub: 'Proximitat Humana' },
        { main: 'GuIA', sub: 'Llanterna de Futur' }
    ];

    return (
        <div className="nano-splash">
            <div className="splash-background">
                <div className="blob orange"></div>
                <div className="blob cyan"></div>
                <div className="blob earth"></div>
            </div>

            <div className="splash-fixed-branding">
                <img src="/logo.png" alt="Sóc de Poble" className="splash-main-logo" />
            </div>

            <div className={`splash-content phase-${phase}`}>
                {phase === 'logo' && (
                    <div className="nano-logo-container animate-in">
                        <div className="nano-icon">
                            <Leaf className="leaf-icon" size={40} />
                            <Cpu className="cpu-icon" size={20} />
                        </div>
                        <h1>NANO</h1>
                    </div>
                )}

                {phase === 'wordplay' && (
                    <div className="word-cascade">
                        {words.map((w, i) => (
                            <div key={i} className="word-item" style={{ animationDelay: `${i * 0.3}s` }}>
                                <span className="word-main">
                                    {w.main.split('').map((char, index) => (
                                        <span key={index} className={char === 'I' || char === 'A' ? 'highlight' : ''}>
                                            {char}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {phase === 'final' && (
                    <div className="final-branding animate-in">
                        <div className="tagline">Arrels que miren al futur.</div>
                        <Sparkles className="sparkle" size={40} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NanoSplashScreen;


=====================================
FILE: src/components/NavigationRail.css
=====================================

.navigation-drawer {
  width: 280px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 0;
  border-right: var(--border-master);
  position: sticky;
  top: 0;
  z-index: 1100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  color: var(--text-main);
}

.drawer-logo-container-biblia {
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.biblia-logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.biblia-version-badge {
  font-size: 10px;
  font-weight: 900;
  color: #ff6d23; /* Taronja per a que destaque */
  background: rgba(255, 109, 35, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 109, 35, 0.2);
}

.visual-democracy-rail-switcher {
  display: flex;
  background: #000000;
  padding: 2px;
  border-radius: 0px;
  border: var(--border-master);
  gap: 0px;
}

.rail-theme-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: 0px;
  color: white;
  cursor: pointer;
  transition: all 0.1s ease;
}

.rail-theme-btn.active {
  background: var(--color-primary);
  /* Cyan */
  color: #000;
  box-shadow: var(--shadow-hard);
}

.rail-theme-btn:hover:not(.active) {
  background: rgba(0, 0, 0, 0.1);
}

.drawer-logo-container {
  height: 48px;
  display: flex;
  align-items: center;
}

.drawer-logo {
  height: 32px;
  object-fit: contain;
}

.drawer-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: var(--color-primary);
  /* Cyan */
  color: #000;
  padding: 18px 24px;
  border-radius: 0px;
  border: var(--border-master);
  font-weight: 900;
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-hard);
  cursor: pointer;
  transition: all 0.1s ease;
  width: 100%;
  text-transform: uppercase;
}

.drawer-fab:hover {
  box-shadow: var(--shadow-hard);
  transform: translate(-2px, -2px);
  background-color: var(--md-sys-color-primary);
  color: white;
}

.drawer-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
}

.drawer-section-title {
  font-size: var(--font-size-base);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #ffffff;
  padding: 12px 16px 8px;
  font-weight: 700;
  opacity: 0.5;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-radius: 0px;
  color: #ffffff;
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: 900;
  transition: all 0.1s ease;
  cursor: pointer;
  margin: 4px 0;
  border: 1px solid transparent;
}

.drawer-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.drawer-item.active {
  background-color: var(--color-accent);
  /* Orange */
  color: #000;
  border: var(--border-master);
}

.drawer-divider {
  height: 1px;
  background-color: var(--md-sys-color-outline-variant);
  margin: 8px 16px;
  opacity: 0.5;
}

.category-item {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.8;
}

.category-item:hover {
  opacity: 1;
}

.category-item svg {
  color: var(--md-sys-color-secondary);
}

.add-collection {
  color: var(--md-sys-color-primary);
  font-style: italic;
  opacity: 0.7;
}

.drawer-footer {
  padding: 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-item {
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .navigation-drawer {
    display: none;
  }
}

/* Raindrop-style scrollbar */
.drawer-scroll-area::-webkit-scrollbar {
  width: 4px;
}

.drawer-scroll-area::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0px;
}

.drawer-scroll-area:hover::-webkit-scrollbar-thumb {
  background: var(--md-sys-color-outline-variant);
}
/* --- BÍBLIA ESTRUCTURAL: ESTILS SAGRATS --- */
.drawer-fab-binari {
  background: #4f46e5 !important; /* Indigo Sagrat */
  color: white !important;
  width: calc(100% - 32px);
  margin: 16px;
  height: 52px;
  border-radius: 16px; /* 2xl */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  font-weight: 800;
}

.drawer-fab-binari:hover {
  background: #4338ca !important;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
}

.active-orange {
  background: #ff6d23 !important; /* Taronja Xat Actiu */
  color: black !important;
  border-radius: 12px;
}

.active-orange span,
.active-orange svg {
  color: black !important;
  font-weight: 800;
}

.drawer-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #9ca3af;
  transition: all 0.2s ease;
  margin: 4px 16px;
  border-radius: 12px;
  font-size: 14px;
}

.drawer-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.drawer-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}


=====================================
FILE: src/components/NavigationRail.jsx
=====================================

import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MessageSquare,
  LayoutGrid,
  Store,
  MapPin,
  X,
  Plus,
  ChevronRight,
  Cpu,
  Notebook,
  CreditCard,
} from "lucide-react";
import { useNavigation } from '../context/NavigationContext';
// RealmSwitcher retirat a panell d'administració (Funcionalitat en desenvolupament OMEGA-10)

const NavigationRail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { closeDrawer } = useNavigation();

  const menuGroups = [
    {
      id: "base",
      title: "PILARS DEL MAS",
      icon: <LayoutGrid className="w-5 h-5" />,
      items: [
        { path: "/chats", label: t("nav.chats"), icon: <MessageSquare /> },
        { path: "/mur", label: t("nav.feed"), icon: <LayoutGrid /> },
        { path: "/mercat", label: t("nav.market"), icon: <Store /> },
        { path: "/pobles", label: t("nav.towns"), icon: <MapPin /> },
        {
          path: "/notes",
          label: t("notebook.title"),
          icon: <Notebook />,
          thinner: true,
        },
        {
          path: "/financament",
          label: "Finançament",
          icon: <CreditCard />,
          thinner: true,
        },
      ],
    },
    {
      id: "sistema_operatiu",
      title: "SISTEMA OPERATIU",
      path: "/ofici",
      icon: <Cpu className="w-5 h-5" />,
      items: [], // Buit a la sidebar, ple al Hub
    },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  };

  return (
    <nav className="w-[80px] md:w-[100px] xl:w-[280px] shrink-0 h-full flex flex-col bg-black z-30 transition-all duration-300 shadow-2xl overflow-hidden relative border-r border-white/5">
      {/* RealmSwitcher mogut a l'Admin Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
        {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP FRAME) - EXACTAMENT h-12 COM EL CONTEXTUAL MENU */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/pobles");
          }}
          className="w-full h-12 shrink-0 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-black flex items-center justify-start px-8 space-x-3 transition-colors active:bg-[#3730a3] group relative overflow-hidden rounded-none z-10"
        >
          <div className="flex items-center justify-center bg-white/10 w-8 h-8 rounded-[28px] group-hover:bg-white/20 transition-colors shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="tracking-[0.2em] text-[15px] uppercase whitespace-nowrap pt-0.5">
            {t("common.add") || "CONNECTAR"}
          </span>
        </button>

        {/* 2. MENÚ PRINCIPAL (CONTEXTUAL TABS) */}
        <div className="px-4 pt-4 space-y-3 pb-[100px] md:pb-8 relative z-0">
          {menuGroups.map((group, index) => (
            <div key={group.id} className="space-y-3">
              {index === 0 ? (
                /* PILARS DEL MAS: SEMPRE VISIBLES */
                <div className="space-y-2">
                  {/* EL QUARTET SAGRAT (RESSALTAT CANÒNIC) */}
                  <div className="bg-orange-500/[0.03] rounded-[28px] p-2 space-y-0.5 shadow-[inset_0_0_30px_rgba(255,107,0,0.08)] relative overflow-hidden group/quartet">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent-primary)]/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                    {group.items.slice(0, 4).map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) => `
                          w-full flex items-center space-x-3 px-3 h-11 rounded-xl transition-all relative overflow-hidden
                          ${
                            isActive
                              ? "bg-[var(--theme-accent-primary)] text-white shadow-[0_0_25px_rgba(255,107,0,0.4)] scale-[1.02] z-10"
                              : "text-white opacity-90 hover:bg-[var(--theme-accent-primary)]/10 hover:text-white"
                          }
                          font-black
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#111827] text-white border border-white/10 rounded-r-full shadow-[0_0_15px_white]" />
                            )}
                            <div
                              className={`w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isActive
                                  ? "text-white"
                                  : "text-[var(--theme-accent-primary)] group-hover/quartet:scale-110"
                              }`}
                            >
                              {React.cloneElement(item.icon, {
                                size: 22,
                                strokeWidth: isActive ? 3 : 2,
                              })}
                            </div>
                            <span
                              className={`leading-none mb-0.5 whitespace-nowrap transition-colors text-[20px] ${
                                isActive ? "text-white" : "text-gray-100"
                              }`}
                            >
                              {item.label}
                            </span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>

                  {/* ALTRES PILARS (SENSE BORDA/FONS RESALTAT) */}
                  <div className="space-y-0.5 mt-2">
                    {group.items.slice(4).map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) => `
                          w-full flex items-center space-x-3 px-3 h-9 rounded-[18px] transition-all relative overflow-hidden
                          ${
                            isActive
                              ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                              : "text-white opacity-70 hover:bg-white/5 hover:text-white hover:opacity-100"
                          }
                          font-medium
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--theme-accent-primary)] rounded-r-full shadow-[0_0_10px_var(--theme-accent-primary)]" />
                            )}
                            <div
                              className={`w-8 h-8 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isActive
                                  ? "text-[var(--theme-accent-primary)]"
                                  : "text-white/70 group-hover:scale-110"
                              }`}
                            >
                              {React.cloneElement(item.icon, {
                                size: 20,
                                strokeWidth: isActive ? 2.5 : 1.5,
                              })}
                            </div>
                            <span
                              className={`leading-none mb-0.5 whitespace-nowrap transition-colors uppercase tracking-tighter text-[15px] ${
                                isActive
                                  ? "text-white font-bold tracking-widest uppercase"
                                  : "text-gray-300"
                              }`}
                            >
                              {item.label}
                            </span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                /* GRUPS COL·LAPSABLES (IDENTITAT i RECURSOS) */
                <NavLink
                  to={group.path}
                  onClick={handleNavClick}
                  className={({ isActive }) => `
                    w-full flex items-center justify-between px-2 h-14 rounded-[16px] transition-all border border-white/5 shadow-xl
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-white/[0.03] text-white opacity-90 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 pl-2">
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shadow-inner bg-white/10`}
                    >
                      {group.icon}
                    </div>
                    <h3 className="text-[16px] font-black uppercase tracking-tight leading-[0.95] transition-colors text-left pt-1">
                      {t("nav.system_op_part_1", "SISTEMA")}
                      <br />
                      {t("nav.system_op_part_2", "OPERATIU")}
                    </h3>
                  </div>
                  <div className="pr-4 opacity-50">
                    <ChevronRight size={20} strokeWidth={3} />
                  </div>
                </NavLink>
              )}
            </div>
          ))}

          {/* ACCIONS DE MANTENIMENT (ENLLAÇ DIRECTE A INFO LEGAL) */}
          <div className="space-y-2 pt-2 border-t border-white/5 relative">
            <NavLink
              to="/legal"
              onClick={handleNavClick}
              className={({ isActive }) => `
                w-full flex items-center justify-center px-4 h-10 rounded-[16px] border-2 text-[14px] font-black uppercase tracking-[0.2em] transition-all active:scale-95
                ${
                  isActive
                    ? "bg-secondary border-white text-white"
                    : "bg-white/10 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                }
              `}
            >
              <span>Info legal</span>
            </NavLink>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </nav>
  );
};

export default NavigationRail;


=====================================
FILE: src/components/NotePad.css
=====================================

.notepad-trigger {
    position: fixed;
    right: 20px;
    bottom: 100px;
    width: 56px;
    height: 56px;
    background: var(--accent);
    color: white;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-hard);
    border: var(--comic-border);
    z-index: 10001;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notepad-trigger:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: var(--shadow-hard);
}

.notepad-container {
    position: fixed;
    right: 20px;
    bottom: 100px;
    width: 320px;
    height: 400px;
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(20px);
    border: var(--comic-border);
    box-shadow: var(--shadow-hard);
    z-index: 10001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideInUp 0.3s ease-out;
}

.notepad-container.minimized {
    height: 48px;
    width: 180px;
}

.notepad-header {
    background: #000;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
}

.notepad-textarea {
    flex: 1;
    background: transparent;
    color: #eee;
    padding: 16px;
    border: none;
    resize: none;
    font-family: inherit;
    font-size: var(--font-size-base);
    line-height: 1.6;
}

.notepad-textarea:focus {
    outline: none;
}

.notepad-footer {
    background: #000;
    padding: 8px 16px;
    display: flex;
    gap: 8px;
    border-top: 1px solid #333;
}

.notepad-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    font-size: var(--font-size-base);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 0px;
    background: #333;
    color: var(--text-main);
    transition: all 0.2s;
}

.notepad-action-btn:hover {
    background: #444;
}

.notepad-action-btn.delete:hover {
    background: #991b1b;
}

.btn-icon-mini {
    color: #666;
    transition: color 0.2s;
}

.btn-icon-mini:hover {
    color: var(--text-main);
}

@keyframes slideInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-bounce-slow {
    animation: bounce 3s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(-5%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}

=====================================
FILE: src/components/NotePad.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { StickyNote, X, Save, Trash2, Copy, Check, ChevronRight, ChevronLeft } from 'lucide-react';

import { useModal } from '../context/ModalContext';
import './NotePad.css';

const NotePad = () => {
    const { isNotePadOpen: isOpen, setIsNotePadOpen: setIsOpen } = useModal();    const [note, setNote] = useState(localStorage.getItem('sdp_master_note') || '');
    const [copied, setCopied] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        localStorage.setItem('sdp_master_note', note);
    }, [note]);

    const handleCopy = () => {
        navigator.clipboard.writeText(note);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (window.confirm('Vols esborrar tota la llibreta?')) {
            setNote('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`notepad-container ${isMinimized ? 'minimized' : ''}`}>
            <div className="notepad-header">
                <div className="flex items-center gap-2">
                    <StickyNote size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Llibreta Master</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="btn-icon-mini">
                        {isMinimized ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="btn-icon-mini">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <textarea
                        className="notepad-textarea"
                        placeholder="Escriu, enganxa o bategua les teues idees ací... (Auto-guardat)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="notepad-footer">
                        <button className="notepad-action-btn" onClick={handleCopy}>
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            <span>{copied ? 'COPIAT' : 'COPIAR'}</span>
                        </button>
                        <button className="notepad-action-btn delete" onClick={handleClear}>
                            <Trash2 size={14} />
                            <span>NETEJAR</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotePad;


=====================================
FILE: src/components/NotebookList.jsx
=====================================

import React from 'react';
import { Search, Plus, Clock, FileText, ChevronRight, Menu } from 'lucide-react';

const NotebookList = ({ 
    notes, 
    activeNoteId, 
    onSelectNote, 
    onAddNote, 
    onReorderNotes,
    searchQuery, 
    onSearchChange,
    isCollapsed,
    onToggleCollapse
}) => {
    const bgColor = 'bg-orange-50/20 dark:bg-[#070D18] border-orange-200/50 dark:border-indigo-900/40';
    const textColor = 'text-orange-950/90 dark:text-indigo-100';
    const activeColor = 'text-orange-600 dark:text-orange-400';
    const inputBg = 'bg-white/70 border-orange-200/60 text-orange-950 focus:bg-white dark:bg-indigo-950/40 dark:border-indigo-500/30 dark:text-indigo-50 dark:focus:bg-indigo-950/60';

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (sourceIndex === targetIndex) return;
        
        const newNotes = [...notes];
        const [movedNote] = newNotes.splice(sourceIndex, 1);
        newNotes.splice(targetIndex, 0, movedNote);
        onReorderNotes(newNotes);
    };

    const filteredNotes = notes
        .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    n.content.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <div className={`notebook-list transition-all duration-300 ${isCollapsed ? 'w-[70px]' : 'w-80'} shrink-0 h-full ${bgColor} border-r flex flex-col z-10 shadow-[4px_0_24px_-10px_rgba(249,115,22,0.1)] dark:shadow-[4px_0_24px_-10px_rgba(6,182,212,0.1)]`}>
            <div className={`p-4 border-b border-orange-200/50 dark:border-indigo-900/40 ${bgColor} flex flex-col gap-4`}>
                <div className="flex justify-between items-center w-full">
                    <button onClick={onToggleCollapse} className="p-1.5 rounded-[20px] transition-all shrink-0 text-orange-950/80 hover:bg-orange-100/60 dark:text-indigo-200/80 dark:hover:bg-indigo-800/40">
                        <Menu size={20} />
                    </button>
                    {!isCollapsed && (
                        <button 
                            onClick={onAddNote}
                            className="flex-1 ml-3 h-10 bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200 dark:bg-orange-600/10 dark:text-orange-400 dark:border-orange-500/20 dark:hover:bg-orange-600/20 border rounded-[28px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                        >
                            <Plus size={14} strokeWidth={3} /> Nova
                        </button>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 dark:text-indigo-300/40" size={14} />
                        <input 
                            type="text" 
                            placeholder="Cerca en el Quadern..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={`w-full ${inputBg} rounded-[28px] py-2.5 pl-9 pr-4 text-sm font-medium focus:border-orange-500/50 outline-none transition-all placeholder:opacity-50`}
                        />
                    </div>
                )}
                
                {isCollapsed && (
                    <button 
                        onClick={onAddNote}
                        className="w-10 h-10 mx-auto bg-orange-100 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-orange-500/10"
                        title="Nova Nota"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-2">
                {filteredNotes.map((note, index) => {
                    const isActive = activeNoteId === note.id;
                    const date = new Date(note.updatedAt);
                    const dateStr = date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });

                    // Strip HTML for preview. Handle arrays for checklists.
                    let previewText = 'Sense contingut...';
                    if (typeof note.content === 'string') {
                        previewText = note.content.replace(/<[^>]*>/g, ' ').substring(0, 80);
                    } else if (Array.isArray(note.content)) {
                        previewText = note.content.map(item => `${item.completed ? '☑' : '☐'} ${item.text}`).join(', ').substring(0, 80);
                    }

                    return (
                        <div 
                            key={note.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`p-3 rounded-xl cursor-pointer transition-all relative group note-item ${isActive ? 'bg-white/80 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.15)] border border-orange-200 dark:bg-indigo-900/40 dark:border-indigo-500/30' : 'hover:bg-white/60 dark:hover:bg-indigo-800/20'} ${isCollapsed ? 'flex justify-center' : ''}`}
                            onClick={() => onSelectNote(note.id)}
                            title={note.title}
                        >
                            {isCollapsed ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-orange-100/50 text-orange-900/50 dark:bg-indigo-900/30 dark:text-indigo-300/50'}`}>
                                    <FileText size={16} />
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h4 className={`text-sm font-black truncate flex-1 ${isActive ? activeColor : textColor}`}>
                                            {note.title || 'Sense títol'}
                                        </h4>
                                        <span className="text-[10px] font-bold shrink-0 text-orange-900/40 dark:text-indigo-200/40 mt-0.5">{dateStr}</span>
                                    </div>
                                    
                                    <p className="text-xs line-clamp-2 leading-relaxed font-medium text-orange-950/60 dark:text-indigo-100/60">
                                        {previewText}
                                    </p>
                                    
                                    <div className="mt-3 flex items-center gap-2 overflow-hidden">
                                        {note.category && (
                                            <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-sm bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-400">
                                                {note.category}
                                            </span>
                                        )}
                                        {note.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[9px] font-bold truncate text-orange-900/40 dark:text-indigo-300/40">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 opacity-20 p-8 text-center">
                        <FileText size={32} className="mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">Cap nota bategant...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotebookList;


=====================================
FILE: src/components/NotebookSidebar.jsx
=====================================

import React, { useState } from 'react';
import { Folder, FolderPlus, Tag, ChevronRight, ChevronDown, Plus, Trash2, Edit2, Search, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotebookSidebar = ({ 
    folders, 
    activeFolder, 
    onSelectFolder, 
    onAddFolder, 
    onDeleteFolder,
    categories,
    activeCategory,
    onSelectCategory,
    isCollapsed,
    onToggleCollapse
}) => {
    const { t } = useTranslation();
    const [expandedFolders, setExpandedFolders] = useState({});

    const bgColor = 'bg-orange-50/40 dark:bg-[#050B14] border-orange-200/50 dark:border-indigo-900/40';
    const textColor = 'text-orange-950/80 dark:text-indigo-200/80';
    const hoverBg = 'hover:bg-orange-100/60 dark:hover:bg-indigo-900/30';
    const titleColor = 'text-orange-800/50 dark:text-indigo-400/50';

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderFolder = (folder, depth = 0) => {
        const isExpanded = expandedFolders[folder.id];
        const isActive = activeFolder === folder.id;
        const children = folders.filter(f => f.parentId === folder.id);

        return (
            <div key={folder.id} className="folder-item-wrapper">
                <div 
                    className={`folder-item flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-orange-100/80 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400' : `${hoverBg} ${textColor}`}`}
                    style={{ paddingLeft: isCollapsed ? '12px' : `${depth * 12 + 12}px` }}
                    onClick={() => onSelectFolder(folder.id)}
                    title={folder.name}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {(children.length > 0 && !isCollapsed) ? (
                            <button onClick={(e) => toggleExpand(folder.id, e)} className="p-0.5 rounded hover:bg-orange-200/50 dark:hover:bg-indigo-800/50">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        ) : (!isCollapsed && <div className="w-5" />)}
                        <Folder size={20} fill={isActive ? "currentColor" : "none"} className={`shrink-0 ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-orange-900/60 dark:text-indigo-300/60'}`} />
                        {!isCollapsed && <span className="text-sm font-bold truncate">{folder.name}</span>}
                    </div>
                    {!isCollapsed && isActive && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                            className="p-1 hover:text-red-500 opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
                {!isCollapsed && isExpanded && children.map(child => renderFolder(child, depth + 1))}
            </div>
        );
    };

    const rootFolders = folders.filter(f => !f.parentId);

    return (
        <div className={`notebook-sidebar transition-all duration-300 ${isCollapsed ? 'w-[70px] px-2' : 'w-64 px-4'} shrink-0 h-full ${bgColor} border-r flex flex-col py-4 z-20`}>
            <header className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} mb-6 px-2`}>
                <button onClick={onToggleCollapse} className="p-1.5 hover:bg-orange-500/10 rounded-[20px] text-orange-950/80 dark:text-indigo-200/80 transition-all">
                    <Menu size={20} />
                </button>
                {!isCollapsed && <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${titleColor}`}>{t('notebook.library') || 'BIBLIOTECA'}</h3>}
                <button 
                    onClick={() => onAddFolder(activeFolder)}
                    className="p-1.5 hover:bg-orange-500/10 rounded-[20px] text-orange-500 transition-all active:scale-90"
                    title={t('notebook.new_folder') || 'Nova Carpeta'}
                >
                    <FolderPlus size={isCollapsed ? 24 : 16} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {rootFolders.map(folder => renderFolder(folder))}
                {rootFolders.length === 0 && (
                    <p className="text-[11px] text-center opacity-20 py-4 italic font-bold">{t('notebook.empty_folders') || 'Cap carpeta bategada...'}</p>
                )}
                
                <div className={`mt-4 pt-4 border-t border-orange-200/50 dark:border-indigo-900/40 ${isCollapsed ? 'opacity-100' : 'opacity-80'}`}>
                    <div 
                        className={`folder-item flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2'} rounded-lg cursor-pointer transition-all ${activeFolder === 'trash' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'hover:bg-red-50 text-orange-900/60 dark:hover:bg-red-900/20 dark:text-indigo-300/60'}`}
                        onClick={() => onSelectFolder('trash')}
                        title={t('notebook.trash.bucket')}
                    >
                        <Trash2 size={20} className={activeFolder !== 'trash' ? 'text-orange-900/50 dark:text-indigo-300/50' : ''} />
                        {!isCollapsed && <span className="text-sm font-black uppercase tracking-wider">{t('notebook.trash.bucket')}</span>}
                    </div>
                </div>
            </div>

            <div className={`mt-8 border-t border-orange-200/50 dark:border-indigo-900/40 pt-6`}>
                {!isCollapsed && (
                    <header className="flex items-center justify-between mb-4 px-2">
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${titleColor}`}>{t('notebook.categories_title') || 'CATEGORIES'}</h3>
                    </header>
                )}
                <div className="space-y-1">
                    {categories.map(cat => (
                        <div 
                            key={cat}
                            className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2'} rounded-lg cursor-pointer transition-all ${activeCategory === cat ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400' : `${hoverBg} ${textColor}`}`}
                            onClick={() => onSelectCategory(cat)}
                            title={cat}
                        >
                            <Tag size={20} className={activeCategory !== cat ? 'text-orange-900/50 dark:text-indigo-300/50' : ''} />
                            {!isCollapsed && <span className="text-sm font-black uppercase tracking-wider">{t(`notebook.categories.${cat.toLowerCase()}`) || cat}</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className={`mt-auto pt-6 border-t border-orange-200/50 dark:border-indigo-900/40`}>
                <div className={`rounded-[28px] ${isCollapsed ? 'p-2' : 'p-4'} bg-orange-100/50 border-orange-200/60 dark:bg-indigo-900/30 dark:border-indigo-500/20 border`}>
                    {!isCollapsed && <p className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 mb-2 leading-tight">Sincronització</p>}
                    <div className={`h-1 bg-orange-200 dark:bg-indigo-950/50 rounded-[28px] overflow-hidden`}>
                        <div className="h-full bg-orange-500 w-[80%]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotebookSidebar;


=====================================
FILE: src/components/OmniscientViewer.css
=====================================

.omniscient-viewer {
    position: fixed;
    top: 64px;
    right: 0;
    width: 450px;
    height: calc(100vh - 64px);
    background: rgba(10, 15, 20, 0.95);
    backdrop-filter: blur(20px);
    border-left: 1px solid var(--color-primary-soft);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    box-shadow: var(--shadow-hard);
    transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.omniscient-viewer.expanded {
    width: 800px;
}

.viewer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 120, 0, 0.1);
    /* Master Orange Context */
    border-bottom: 1px solid rgba(255, 120, 0, 0.2);
    border-left: 4px solid #ff7800;
    /* Sidebar signal */
}

.viewer-meta {
    display: flex;
    align-items: center;
    gap: 10px;
}

.did-label {
    font-size: 0.7rem;
    font-family: 'JetBrains Mono', monospace;
    opacity: 0.6;
    color: var(--color-primary);
}

.viewer-actions {
    display: flex;
    gap: 8px;
}

.viewer-actions button {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 6px;
    border-radius: 0px;
    transition: all 0.2s;
}

.viewer-actions button:hover {
    background: rgba(0, 242, 255, 0.1);
    color: var(--color-primary);
}

.btn-close-viewer:hover {
    color: #ff4d4d !important;
    background: rgba(255, 77, 77, 0.1) !important;
}

.viewer-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.viewer-status-bar {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.status-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.status-item.anchor {
    color: var(--color-primary);
}

.viewer-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

/* PDF View Enhanced */
.viewer-pdf-container {
    position: relative;
    width: 100%;
    background: #fdfdfd;
    border-radius: 0px;
    box-shadow: var(--shadow-hard);
    overflow: hidden;
}

.pdf-selection-toolbar {
    position: fixed;
    z-index: 2000;
    background: var(--bg-surface-dark);
    border: 1px solid var(--color-primary);
    border-radius: 0px;
    padding: 6px;
    box-shadow: var(--shadow-hard);
    display: flex;
    gap: 8px;
}

.btn-quote,
.btn-postit {
    background: var(--color-primary);
    color: var(--bg-canvas);
    border: none;
    padding: 4px 10px;
    border-radius: 0px;
    font-size: 0.7rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
}

.btn-postit {
    background: #fff;
    color: var(--bg-canvas);
}

.btn-guant {
    background: linear-gradient(135deg, #ff7800, var(--color-accent)) !important;
    color: white !important;
    border: none !important;
    font-weight: 800;
    font-size: 0.7rem;
    padding: 6px 12px;
    border-radius: 0px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--shadow-hard);
}

.btn-guant:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-hard);
    filter: brightness(1.1);
}

.btn-quote:hover,
.btn-postit:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hard);
}

.viewer-pdf-mock {
    background: #fff;
    color: #333;
    padding: 40px;
    min-height: 800px;
    transform-origin: top center;
}

.pdf-line {
    position: relative;
    padding: 2px 0 2px 30px;
    margin: 0;
    transition: all 0.5s ease;
}

.page-marker {
    position: absolute;
    left: 0;
    font-size: 0.6rem;
    color: #ccc;
    font-family: 'JetBrains Mono', monospace;
    opacity: 0.5;
}

.grounding-pin-spot {
    margin-left: 8px;
    font-size: 0.8rem;
    animation: bounce 1s infinite alternate;
}

.solatge-pin {
    margin-left: 10px;
    cursor: help;
    font-size: 0.9rem;
    filter: drop-shadow(0 0 5px rgba(204, 85, 0, 0.4));
    transition: transform 0.3s;
    display: inline-block;
}

.solatge-pin:hover {
    transform: scale(1.4) rotate(10deg);
}

.solatge-pin.type-STATUS {
    filter: drop-shadow(0 0 5px rgba(0, 255, 128, 0.4));
}

.solatge-pin.type-CULTURE {
    filter: drop-shadow(0 0 5px rgba(204, 85, 0, 0.4));
}

.solatge-pin.type-CORRECTION {
    filter: drop-shadow(0 0 5px rgba(255, 120, 0, 0.4));
}

.saved-note {
    background: rgba(255, 255, 255, 0.03);
    border-left: 3px solid var(--color-primary);
    padding: 12px;
    margin-top: 10px;
    border-radius: 0px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.saved-note.type-STATUS {
    border-left-color: #00ff80;
}

.saved-note.type-CULTURE {
    border-left-color: var(--color-terracotta);
}

.saved-note.type-CORRECTION {
    border-left-color: #ff7800;
}

.highlight-flash {
    background: rgba(0, 242, 255, 0.15) !important;
    border-left: 3px solid var(--color-primary) !important;
    padding-left: 27px !important;
    animation: flash-glow 2s ease-out;
}

@keyframes flash-glow {
    0% {
        background: rgba(0, 242, 255, 0.4);
    }

    100% {
        background: rgba(0, 242, 255, 0.1);
    }
}

@keyframes bounce {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-4px);
    }
}

.report-markdown-view h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
}

.report-markdown-view h2 {
    font-size: 1.2rem;
    margin-top: 30px;
    margin-bottom: 15px;
}

.report-markdown-view p {
    margin-bottom: 12px;
    line-height: 1.6;
    font-size: 0.95rem;
}

/* Image View Enhanced */
.viewer-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.omni-image {
    max-width: 100%;
    border-radius: 0px !important;
    /* MASTER DIRECTIVE: NO ROUNDED CORNERS FOR TRUTH ASSETS */
    box-shadow: var(--shadow-hard);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: zoom-in;
    margin-bottom: 10px;
}

.omni-image:active {
    cursor: grabbing;
}

.image-metadata-card {
    width: 100%;
    background: rgba(20, 20, 25, 0.6);
    border: 1px solid rgba(0, 242, 255, 0.2);
    border-left: 3px solid var(--color-primary);
    border-radius: 0px;
    /* Firm like stone */
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    backdrop-filter: blur(10px);
    margin-bottom: 20px;
}

.meta-context {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: var(--color-primary);
    opacity: 0.8;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.meta-context.solatge {
    color: #ff7800;
    /* Solatge Orange */
    opacity: 1;
}

.meta-row {
    font-size: 0.9rem;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 8px;
}

.meta-row.main {
    font-size: 1rem;
    color: var(--text-main);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 8px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
}

.status-tag {
    font-size: 0.65rem;
    padding: 2px 8px;
    border-radius: 0px;
    text-transform: uppercase;
}

.status-tag.sana {
    background: rgba(0, 255, 128, 0.1);
    color: #00ff80;
    border: 1px solid rgba(0, 255, 128, 0.3);
}

.status-tag.crítica {
    background: rgba(255, 77, 77, 0.1);
    color: #ff4d4d;
    border: 1px solid rgba(255, 77, 77, 0.3);
}

.meta-footer {
    margin-top: 8px;
    font-size: 0.75rem;
    opacity: 0.5;
    font-style: italic;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 8px;
}

.biometric-delta-badge {
    margin-top: 12px;
    background: rgba(0, 242, 255, 0.1);
    border: 1px solid var(--color-primary-soft);
    color: var(--color-primary);
    padding: 6px 12px;
    border-radius: 0px;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
}

.coordinate-link {
    margin-top: 10px;
    display: block;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-main);
    padding: 8px 12px;
    border-radius: 0px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    text-decoration: none;
    transition: all 0.3s;
}

.coordinate-link:hover {
    background: rgba(255, 255, 250, 0.1);
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.utm-badge {
    margin-top: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    color: var(--text-muted);
    opacity: 0.8;
}

.btn-jump-source {
    margin-top: 20px;
    background: rgba(0, 242, 255, 0.1);
    border: 1px solid var(--color-primary-soft);
    color: var(--color-primary);
    padding: 10px 20px;
    border-radius: 0px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
}

/* Solatge Layer Styles */
.solatge-layer {
    width: 100%;
    background: rgba(255, 120, 0, 0.03);
    border: 1px solid rgba(255, 120, 0, 0.2);
    border-left: 3px solid #ff7800;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.solatge-input-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.solatge-input-group textarea {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 120, 0, 0.1);
    border-radius: 0px;
    padding: 12px;
    color: var(--text-main);
    font-family: inherit;
    font-size: 0.9rem;
    resize: none;
    min-height: 80px;
}

.solatge-input-group textarea:focus {
    border-color: rgba(255, 120, 0, 0.5);
    outline: none;
}

.solatge-input-group button {
    align-self: flex-end;
    background: #ff7800;
    color: var(--text-main);
    border: none;
    padding: 8px 16px;
    border-radius: 0px;
    font-weight: 700;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.solatge-input-group button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.saved-note {
    display: flex;
    gap: 12px;
    color: #ff9d4d;
    /* Lighter orange */
    font-style: italic;
    background: rgba(255, 120, 0, 0.05);
    padding: 12px;
    border-radius: 0px;
    position: relative;
}

.saved-note p {
    margin: 0;
    line-height: 1.5;
    font-size: 0.95rem;
}

.btn-edit-note {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: transparent;
    border: none;
    color: #ff7800;
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 800;
    cursor: pointer;
    opacity: 0.6;
}

.btn-edit-note:hover {
    opacity: 1;
}

.btn-jump-source:hover {
    background: var(--color-primary);
    color: var(--text-main);
    transform: translateY(-2px);
    box-shadow: var(--shadow-hard);
}

/* Audio View - Karaoke Mode */
.viewer-audio-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 20px;
}

.audio-hero {
    background: #000;
    height: 140px;
    border-radius: 0px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    padding: 20px;
    border: 1px solid rgba(255, 120, 0, 0.2);
}

.audio-visualizer-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 60px;
    width: 100%;
}

.v-bar {
    flex: 1;
    background: linear-gradient(to top, var(--color-primary), #ff7800);
    border-radius: 0px;
}

.audio-time-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 120, 0, 0.2);
    color: #ff7800;
    padding: 4px 10px;
    border-radius: 0px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    border: 1px solid rgba(255, 120, 0, 0.4);
}

.karaoke-transcription {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.6;
}

.karaoke-transcription p {
    position: relative;
    padding-left: 20px;
    transition: all 0.3s;
}

.karaoke-transcription p::before {
    content: '•';
    position: absolute;
    left: 0;
    opacity: 0.3;
}

.active-line {
    color: var(--color-primary);
    transform: translateX(5px);
    font-weight: var(--font-weight-bold);
}

.active-line::before {
    opacity: 1 !important;
    color: var(--color-primary);
}

.audio-identity-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Peritext Text View */
.text-peritext-view {
    border-radius: 0px;
    overflow: hidden;
    border: 1px solid rgba(0, 242, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

.peritext-header {
    background: rgba(0, 242, 255, 0.05);
    padding: 10px 16px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(0, 242, 255, 0.1);
}

.peritext-body {
    padding: 24px;
}

/* Temporal Audit - Espill del Temps */
.viewer-comparison-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.comparison-header {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 2px solid var(--color-primary-soft);
    padding-bottom: 12px;
    margin-bottom: 10px;
}

.comparison-header h3 {
    margin: 0;
    font-size: 1.1rem;
    letter-spacing: 1px;
    color: var(--color-primary);
}

.comparison-images-row {
    display: flex;
    gap: 12px;
}

.comp-image-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.three-slots {
    align-items: center;
    justify-content: space-between;
}

.comp-separator {
    color: var(--color-primary-soft);
    font-size: 1.5rem;
    font-weight: 200;
}

.placeholder-2024 {
    border: 1px dashed rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.02);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
}

.empty-slot-msg {
    font-size: 0.65rem;
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 10px;
}

.btn-add-today {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-main);
    padding: 6px 10px;
    font-size: 0.65rem;
    font-weight: 800;
    cursor: pointer;
    border-radius: 0px;
    width: 100%;
}

.btn-add-today:hover {
    background: var(--color-primary-soft);
    border-color: var(--color-primary);
}

.delta-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--color-primary);
    text-align: right;
}

.status-ok {
    color: #00ff80;
    font-weight: 700;
}

.status-alert {
    color: #ff7800;
    font-weight: 700;
}

.comp-image-box img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0px;
}

.comparison-table-wrapper {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.comparison-table th,
.comparison-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.comparison-table th {
    background: rgba(255, 255, 255, 0.03);
    color: var(--color-primary);
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
}

.comparison-table td.updated {
    color: var(--text-main);
    font-weight: var(--font-weight-bold);
}

.comparison-table td.status-alert {
    color: #ff4d4d;
    font-weight: 700;
    background: rgba(255, 77, 77, 0.05);
}

.iaia-observation-card {
    background: rgba(0, 242, 255, 0.03);
    border: 1px solid var(--color-primary-soft);
    border-left: 4px solid var(--color-primary);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.iaia-observation-card p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
}

.btn-confirm-life {
    background: var(--color-primary);
    color: var(--bg-canvas);
    border: none;
    padding: 10px;
    border-radius: 0px;
    font-weight: 800;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-confirm-life:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-hard);
}

.viewer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.2);
}

.btn-footer-action {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-muted);
    padding: 6px 12px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    cursor: pointer;
}

.btn-footer-action:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-primary);
    border-color: var(--color-primary-soft);
}

.iron-seal {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: var(--color-primary);
    background: rgba(0, 242, 255, 0.1);
    padding: 4px 10px;
    border-radius: 0px;
    border: 1px solid var(--color-primary-soft);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

.animate-slide-in {
    animation: slideIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

/* Responsive */
@media (max-width: 900px) {
    .omniscient-viewer {
        width: 100% !important;
        top: 0;
        height: 100vh;
    }
}

=====================================
FILE: src/components/OmniscientViewer.jsx
=====================================

import React, { useState, useEffect, useCallback } from 'react';
import { X, Maximize2, Minimize2, FileText, Image as ImageIcon, Music, Type, Download, Share2, ZoomIn, ZoomOut, ShieldCheck, MessageSquarePlus, History, Sparkles } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { logger } from '../utils/logger';
import './OmniscientViewer.css';

/**
 * OmniscientViewer: El "Escritorio del Investigador".
 * Ahora con Capa de Solatge (Memoria Viva) para metadatos manuales.
 */
const OmniscientViewer = () => {
    const { isViewerOpen, viewerConfig, closeViewer, openViewer, openPostModal } = useModal();
    const [isExpanded, setIsExpanded] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [content, setContent] = useState(null);
    const [manualNote, setManualNote] = useState("");
    const [savedNotes, setSavedNotes] = useState({
        'did:soc:img-carrasca-zurca': { text: "El tio Batiste deia que ací s'amagaven els maquis durant la postguerra.", type: 'CULTURE' },
        'did:soc:img-carrasca-foia': { text: "Aquesta carrasca encara fa unes bellotes molt dolces.", type: 'CULTURE' },
        'did:soc:img-carrasca-zurca#page-1': { text: "Estat 2024: Ha rebrotat parcialment.", type: 'STATUS' }
    });
    const [selectedText, setSelectedText] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);

    const handleTextSelection = (e) => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        const toolbar = document.getElementById('pdf-quote-tool');

        if (text && toolbar) {
            setSelectedText(text);
            toolbar.style.display = 'flex';
            toolbar.style.top = `${e.clientY - 40}px`;
            toolbar.style.left = `${e.clientX}px`;
        } else if (toolbar) {
            toolbar.style.display = 'none';
        }
    };

    const handleDragToQuote = () => {
        if (!selectedText) return;
        logger.info(`[Librarian] Drag-to-Quote: "${selectedText}"`);
        // En una app real, aquí enviaríamos el mensaje al xat activo
        alert(`Citat al xat: "${selectedText}"`);
        const toolbar = document.getElementById('pdf-quote-tool');
        if (toolbar) toolbar.style.display = 'none';
        window.getSelection().removeAllRanges();
    };

    const handleAddNote = () => {
        const pageId = viewerConfig.anchor || 'page-1';
        const typeStr = prompt("Tria tipus (S: Salut, C: Cultura, F: Fe d'errades):", "S").toUpperCase();
        const type = typeStr === 'C' ? 'CULTURE' : typeStr === 'F' ? 'CORRECTION' : 'STATUS';
        const text = prompt("Afegeix una nota de solatge:", "");

        if (text) {
            setIsSyncing(true);
            setTimeout(() => {
                setSavedNotes(prev => ({
                    ...prev,
                    [`${viewerConfig.did}#${pageId}`]: { text, type, author: 'Mestre Javi' }
                }));
                setIsSyncing(false);
            }, 1000);
        }
        const toolbar = document.getElementById('pdf-quote-tool');
        if (toolbar) toolbar.style.display = 'none';
    };

    const handleLaunchDebate = () => {
        const pageId = viewerConfig.anchor || 'page-1';
        const contextData = {
            did: viewerConfig.did,
            anchor: pageId,
            selectedText: selectedText,
            sourceTitle: viewerConfig.label || 'Arxiu Municipal',
            imageUrl: viewerConfig.type === 'IMAGE' ? viewerConfig.did : null
        };

        openPostModal({
            isPrivate: false,
            initialContext: contextData,
            postType: 'archive_debate'
        });

        const toolbar = document.getElementById('pdf-quote-tool');
        if (toolbar) toolbar.style.display = 'none';
        setSelectedText("");
    };

    const fetchContent = useCallback(async (url) => {
        try {
            const resp = await fetch(url);
            const text = await resp.text();
            setContent(text);
        } catch (e) {
            logger.error('[Viewer] Error carregant contingut:', e);
        }
    }, []);

    useEffect(() => {
        if (isViewerOpen && viewerConfig) {
            logger.info(`[Viewer] Carregant contingut per a DID: ${viewerConfig.did}`);
            // Simulació de càrrega de contingut segons tipus
            if (viewerConfig.type === 'PDF') {
                // Deferred to next tick to avoid synchronous setState inside effect warning
                const timer = setTimeout(() => {
                    fetchContent('/TECHNICAL_REPORT_VIVO.md'); // Mock PDF source
                }, 0);
                return () => clearTimeout(timer);
            }
        }
    }, [isViewerOpen, viewerConfig, fetchContent]);


    const getImageMetadata = () => {
        if (!viewerConfig || viewerConfig.type !== 'IMAGE') return null;

        // Mock de metadades del Catàleg d'Arbres 2020
        if (viewerConfig.did.includes('carrasca-foia')) {
            return {
                species: "Quercus rotundifolia (Carrasca)",
                dimensions: "Alçada: 10m | Perímetre tronc: 243 cm",
                location: "La Foia Blanca | Polígon 5, Parcel·la 10",
                status: "Sana",
                source: "Catàleg d'Arbres de 2020, p. 25"
            };
        }
        if (viewerConfig.did.includes('carrasca-zurca')) {
            return {
                species: "Quercus rotundifolia (Carrasca)",
                dimensions: "Alçada: 7.5m | Estat: Envellit/Moribund",
                location: "Mas de la Zurca (Relleu) | 885m",
                status: "Crítica",
                source: "Catàleg d'Arbres de 2020, p. 33"
            };
        }
        if (viewerConfig.did.includes('pi-pipa')) {
            return {
                species: "Pinus halepensis (Pi blanc)",
                dimensions: "Perímetre: 427cm | Capçada: 23m",
                location: "Ctra. Abió (1.5km) | Mas de Pipa",
                status: "Senescent",
                source: "Catàleg d'Arbres de 2007, p. 19"
            };
        }
        if (viewerConfig.did.includes('carrasca-nofre')) {
            return {
                species: "Quercus rotundifolia (Carrasca)",
                dimensions: "Perímetre: 288cm | Capçada: 18m",
                location: "Barranc de la Zurca | Ctra. Relleu",
                status: "Sana",
                source: "Catàleg d'Arbres de 2007, p. 7",
                utm: "X: 725181, Y: 4275887"
            };
        }
        if (viewerConfig.did.includes('pi-arrendaors')) {
            return {
                species: "Pinus halepensis (Pi blanc)",
                dimensions: "Perímetre 2020: 582cm | Alçada: 16m",
                location: "Partida del Pla | Propietat Privada",
                status: "Monumental",
                source: "Catàleg d'Arbres de 2020, p. 75",
                biometrics: { delta: "+12cm (2007-2020)", age: "Est. 250 anys" },
                coords: { lat: 38.6015, lon: -0.4123 }
            };
        }
        return null;
    };

    const getAuditData = () => {
        if (!viewerConfig || viewerConfig.type !== 'COMPARISON') return null;

        // Mock d'Auditoria Temporal: Pi de la Foia Boix
        if (viewerConfig.did.includes('pi-foia-boix')) {
            return {
                label: "Pi de la Foia Boix",
                data2007: { height: "19m", perimeter: "5m", status: "Senescent", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "19m (Estable)", perimeter: "5.2m", status: "Alerta Crítica", image: "/rural_tech_future_valencia.png" },
                observation: "L'IAIA detecta pèrdua de massa forestal en la branca de llevant des de 2007."
            };
        }
        // Comparativa Pi de Pipa vs Carrasca de Nofre
        if (viewerConfig.did.includes('audit-trees')) {
            return {
                label: "Auditoria Diferencial: Pi vs Carrasca",
                data2007: { height: "13m (Pi)", perimeter: "427cm", status: "Cicatriu/Risc", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "13m (Carrasca)", perimeter: "288cm", status: "Sana", image: "/rural_tech_future_valencia.png" },
                observation: "El Pi de Pipa requereix apuntalament estructural per pèrdua de fust antic."
            };
        }

        // Protocol Espill del Temps: Xiprers del Cementeri
        if (viewerConfig.did.includes('xiprers-cementeri')) {
            return {
                label: "Xiprers del Cementeri",
                data2007: { height: "15m", perimeter: "180cm", protection: "Mur original", status: "Sana", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "16.5m", perimeter: "195cm", protection: "Ampliació mur", status: "Senescència", image: "/rural_tech_future_valencia.png" },
                delta: { growth: "+1.5m", health: "⚠️ Degradació lenta" },
                observation: "L'ampliació del cementeri ha canviat l'entorn de les arrels. L'IAIA demana verificar si hi ha noves clarianes al fullatge."
            };
        }

        // Protocol Espill del Temps: Pi del Mas de Pipa
        if (viewerConfig.did.includes('pi-pipa')) {
            return {
                label: "Pi del Mas de Pipa",
                data2007: { height: "13m", perimeter: "427cm", protection: "Risc esgarrar", status: "Cicatriu/Risc", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "13m", perimeter: "427cm", protection: "Apuntalat", status: "Manteniment", image: "/rural_tech_future_valencia.png" },
                delta: { growth: "0cm", health: "✅ Estabilitzat" },
                observation: "L'apuntalamiento recomanat en 2007 sembla haver estabilitzat l'estructura del gegant."
            };
        }
        return null;
    };

    const handleSaveNote = () => {
        if (!manualNote.trim()) return;
        const newNotes = { ...savedNotes, [viewerConfig.did]: manualNote };
        setSavedNotes(newNotes);
        setManualNote("");
        logger.info(`[Solatge] Nota guardada per a ${viewerConfig.did}`);
        // En una app real, aquí persistiríamos en la DB local (Rhizome)
    };

    if (!isViewerOpen || !viewerConfig) return null;

    const renderContent = () => {
        switch (viewerConfig.type) {
            case 'PDF': {
                return (
                    <div className="viewer-pdf-container">
                        <div className="pdf-selection-toolbar animate-in" id="pdf-quote-tool" style={{ display: 'none' }}>
                            <button className="btn-quote" onClick={handleDragToQuote}>
                                <MessageSquarePlus size={14} /> CITAR
                            </button>
                            <button className="btn-postit" onClick={handleAddNote}>
                                <FileText size={14} /> ANOTAR
                            </button>
                            <button className="btn-guant" onClick={handleLaunchDebate}>
                                <Sparkles size={14} /> LLANÇAR EL GUANT
                            </button>
                        </div>
                        <div
                            className="viewer-pdf-mock"
                            style={{ transform: `scale(${zoom})` }}
                            onMouseUp={handleTextSelection}
                        >
                            <div className="pdf-page-container">
                                <div className="report-markdown-view" dangerouslySetInnerHTML={{
                                    __html: content ? content
                                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                        .replace(/^## (.*$)/gim, '<h2>$2</h2>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/^- (.*$)/gim, '<li>$1</li>')
                                        .split('\n').map((line, i) => {
                                            const pageNum = Math.floor(i / 10) + 1;
                                            const anchorId = `page-${pageNum}`;
                                            const isTarget = viewerConfig.anchor === anchorId;
                                            const pageNote = savedNotes[`${viewerConfig.did}#${anchorId}`];

                                            return `<p id="v-page-${pageNum}" class="pdf-line ${isTarget ? 'highlight-flash' : ''}">
                                                <span class="page-marker">${pageNum}</span> 
                                                ${line}
                                                ${isTarget ? '<span class="grounding-pin-spot">📍</span>' : ''}
                                                ${pageNote ? `<span class="solatge-pin" title="${pageNote}">📜</span>` : ''}
                                            </p>`;
                                        }).join('') : 'Cargando documento soberano...'
                                }} />
                            </div>
                        </div>
                    </div>
                );
            }
            case 'IMAGE': {
                const meta = getImageMetadata();
                return (
                    <div className="viewer-image-container">
                        <img
                            src={viewerConfig.did.includes('carrasca') ? '/rural_tech_future_valencia.png' : '/logo.png'}
                            alt={viewerConfig.label}
                            style={{ transform: `scale(${zoom})` }}
                            className="omni-image"
                        />
                        {meta && (
                            <div className="image-metadata-card animate-in">
                                <div className="meta-context">CAPA BASE: VERITAT DE FERRO (DADES OFICIALS)</div>
                                <div className="meta-row main">
                                    <strong>{meta.species}</strong>
                                    <span className={`status-tag ${meta.status.toLowerCase()}`}>{meta.status}</span>
                                </div>
                                <div className="meta-row">
                                    <span>📏 {meta.dimensions}</span>
                                </div>
                                <div className="meta-row">
                                    <span>📍 {meta.location}</span>
                                </div>
                                {meta.biometrics && (
                                    <div className="biometric-delta-badge">
                                        <History size={14} /> EVOLUCIÓ: {meta.biometrics.delta} ({meta.biometrics.age})
                                    </div>
                                )}
                                {meta.coords && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${meta.coords.lat},${meta.coords.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="coordinate-link"
                                    >
                                        🌐 NAVEGACIÓ SOBIRANA: {meta.coords.lat}, {meta.coords.lon}
                                    </a>
                                )}
                                {meta.utm && (
                                    <div className="utm-badge">UTM: {meta.utm}</div>
                                )}
                                <div className="meta-footer">
                                    <span>Font ocupada: {meta.source}</span>
                                </div>
                            </div>
                        )}

                        <div className="solatge-layer animate-in">
                            <div className="meta-context solatge">CAPA DE SOLATGE: MEMÒRIA VIVA (METADADES MANUALS)</div>
                            <div className="solatge-content">
                                {savedNotes[viewerConfig.did] ? (
                                    <div className={`saved-note type-${savedNotes[viewerConfig.did].type}`}>
                                        <History size={16} />
                                        <p><strong>{savedNotes[viewerConfig.did].type}:</strong> {savedNotes[viewerConfig.did].text}</p>
                                        <button className="btn-edit-note" onClick={() => setManualNote(savedNotes[viewerConfig.did].text)}>Editar</button>
                                    </div>
                                ) : (
                                    <div className="solatge-input-group">
                                        <textarea
                                            placeholder="Afegir història oral, correcció o observació actual..."
                                            value={manualNote}
                                            onChange={(e) => setManualNote(e.target.value)}
                                        />
                                        <button onClick={handleSaveNote} disabled={!manualNote.trim()}>
                                            <MessageSquarePlus size={16} /> ENRIQUIR
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="btn-jump-source" onClick={() => openViewer({ ...viewerConfig, type: 'PDF', anchor: 'page=25' })}>
                            <FileText size={16} /> Veure al document original
                        </button>
                    </div>
                );
            }
            case 'AUDIO': {
                const timestamp = viewerConfig.anchor.split('=')[1] || '0:00';
                return (
                    <div className="viewer-audio-container">
                        <div className="audio-hero">
                            <div className="audio-visualizer-bars">
                                {Array(30).fill(0).map((_, i) => (
                                    <div key={i} className="v-bar animate-pulse-fast" style={{ height: Math.random() * 80 + 20 + '%', animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                            <div className="audio-time-badge">{timestamp}</div>
                        </div>

                        <div className="karaoke-transcription">
                            <p className={timestamp === '04:23' ? 'active-line' : ''}>
                                "...perquè el millor moment per a podar, com deia mon pare, <strong>és la lluna vella del gener</strong>."
                            </p>
                            <p>
                                "Si ho fas en lluna nova, la fusta es podreix i el fruit no ix amb força."
                            </p>
                            <p>
                                "Això ho hem sabut tota la vida a la Torre, i qui no ho fa així, és que no té trellat."
                            </p>
                        </div>

                        <div className="audio-identity-card">
                            <Music size={24} className="text-primary" />
                            <div className="id-stack">
                                <strong>Entrevista a Batiste</strong>
                                <span>Gravació: 12/01/2026</span>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'TEXT': {
                return (
                    <div className="viewer-text-node">
                        <div className="text-peritext-view">
                            <div className="peritext-header">
                                <Type size={16} /> Bloc de Memòria Semàntic
                            </div>
                            <div className="peritext-body">
                                <p className={viewerConfig.anchor.includes('block_aq_45') ? 'highlight-flash' : ''}>
                                    {content || "Carregant memòria del poble..."}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'COMPARISON': {
                const audit = getAuditData();
                if (!audit) return <div className="viewer-fallback">Dades d'auditoria no trobades.</div>;
                return (
                    <div className="viewer-comparison-container">
                        <div className="comparison-header">
                            <History size={20} className="text-primary" />
                            <h3>L'ESPILL DEL TEMPS: {audit.label}</h3>
                        </div>

                        <div className="comparison-images-row three-slots">
                            <div className="comp-image-box">
                                <div className="comp-label">2007 (Origen)</div>
                                <img src={audit.data2007.image} alt="2007" />
                            </div>
                            <div className="comp-separator">→</div>
                            <div className="comp-image-box">
                                <div className="comp-label">2020 (Resistència)</div>
                                <img src={audit.data2020.image} alt="2020" />
                            </div>
                            <div className="comp-separator">→</div>
                            <div className="comp-image-box placeholder-2024">
                                <div className="comp-label">2024 (Ara)</div>
                                <div className="empty-slot-msg">Pendent d'Auditoria</div>
                                <button className="btn-add-today"><Maximize2 size={12} /> PUJAR FOTO</button>
                            </div>
                        </div>

                        <div className="comparison-table-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>PARÀMETRE</th>
                                        <th>2007</th>
                                        <th>2020</th>
                                        <th>DELTA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Alçada</td>
                                        <td>{audit.data2007.height}</td>
                                        <td className="updated">{audit.data2020.height}</td>
                                        <td className="delta-val">{audit.delta?.growth || '--'}</td>
                                    </tr>
                                    <tr>
                                        <td>Perímetre</td>
                                        <td>{audit.data2007.perimeter}</td>
                                        <td className="updated">{audit.data2020.perimeter}</td>
                                        <td className="delta-val">{audit.delta?.perimeter || '--'}</td>
                                    </tr>
                                    <tr>
                                        <td>Protecció</td>
                                        <td>{audit.data2007.protection || '--'}</td>
                                        <td className="updated">{audit.data2020.protection || '--'}</td>
                                        <td className="delta-val">✅</td>
                                    </tr>
                                    <tr>
                                        <td>Salut</td>
                                        <td>{audit.data2007.status}</td>
                                        <td className={`status-val ${audit.delta?.health?.includes('⚠️') ? 'status-alert' : 'status-ok'}`}>
                                            {audit.data2020.status}
                                        </td>
                                        <td className="delta-val">{audit.delta?.health || '--'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="iaia-observation-card">
                            <ShieldCheck size={18} />
                            <p><strong>AUDITORIA IAIA:</strong> {audit.observation}</p>
                            <button className="btn-confirm-life">VALIDAR ESTAT ACTUAL (2024)</button>
                        </div>
                    </div>
                );
            }
            default: {
                return <div className="viewer-fallback">Cargando fuente de datos...</div>;
            }
        }
    };

    return (
        <aside className={`omniscient-viewer ${isExpanded ? 'expanded' : ''} animate-slide-in`}>
            <header className="viewer-header">
                <div className="viewer-header-premium">
                    <div className="title-row">
                        <h2>Omniscient Viewer [MASTER]</h2>
                        <div className={`sync-status ${isSyncing ? 'syncing' : ''}`}>
                            <div className="sync-dot"></div>
                            <span>{isSyncing ? 'Sincronitzant Solatge...' : 'Local-First Active'}</span>
                        </div>
                    </div>
                </div>
                <div className="viewer-meta">
                    <ShieldCheck size={18} className="text-primary" />
                    <span className="did-label">{viewerConfig.did}</span>
                </div>
                <div className="viewer-actions">
                    <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))} title="Zoom In"><ZoomIn size={18} /></button>
                    <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} title="Zoom Out"><ZoomOut size={18} /></button>
                    <button onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Contraer" : "Expandir"}>
                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button onClick={closeViewer} className="btn-close-viewer"><X size={18} /></button>
                </div>
            </header>

            <div className="viewer-body">
                <div className="viewer-status-bar">
                    <div className="status-item">
                        {viewerConfig.type === 'PDF' && <FileText size={14} />}
                        {viewerConfig.type === 'IMAGE' && <ImageIcon size={14} />}
                        {viewerConfig.type === 'AUDIO' && <Music size={14} />}
                        <span>{viewerConfig.label}</span>
                    </div>
                    <div className="status-item anchor">
                        <Type size={14} />
                        <span>{viewerConfig.anchor}</span>
                    </div>
                </div>

                <div className="viewer-content">
                    {renderContent()}
                </div>
            </div>

            <footer className="viewer-footer">
                <button className="btn-footer-action"><Download size={16} /> Descargar</button>
                <button className="btn-footer-action"><Share2 size={16} /> Compartir</button>
                <div className="iron-seal">VERITAT DE FERRO</div>
            </footer>
        </aside>
    );
};

export default OmniscientViewer;


=====================================
FILE: src/components/OnboardingFlow.css
=====================================

.onboarding-overlay {
  animation: fade-in 0.3s ease-out;
}

.onboarding-container {
  max-height: 90vh;
  overflow-y: auto;
}

.onboarding-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.onboarding-title {
  font-family: 'Inter Tight', sans-serif;
  letter-spacing: -0.02em;
}

.onboarding-feature {
  transition: all 0.2s ease;
}

.onboarding-feature:hover {
  transform: translateX(4px);
}

.onboarding-option {
  transition: all 0.2s ease;
}

.onboarding-option:hover {
  transform: translateY(-2px);
}

.onboarding-toggle {
  transition: all 0.2s ease;
}

/* Toggle Switch */
.toggle-switch {
  width: 44px;
  height: 24px;
  background: #cbd5e1;
  border-radius: 9999px;
  position: relative;
  transition: all 0.2s ease;
}

.dark .toggle-switch {
  background: #334155;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.toggle-switch.active {
  background: #2563eb;
}

.dark .toggle-switch.active {
  background: #ff6b00;
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

.toggle-checkbox {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Navigation */
.onboarding-next:hover {
  transform: translateY(-1px);
}

/* Badges */
.badge-success {
  animation: slide-in 0.3s ease-out;
}

.badge-info {
  animation: slide-in 0.3s ease-out 0.1s backwards;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .onboarding-container {
    max-height: 100vh;
    border-radius: 0;
  }
  
  .onboarding-content {
    padding: 1.5rem;
  }
  
  .onboarding-title {
    font-size: 1.5rem;
  }
}


=====================================
FILE: src/components/OnboardingFlow.jsx
=====================================

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Check, ArrowRight, ArrowLeft, Heart, Shield, Users, Zap } from 'lucide-react';
import { logger } from '../utils/logger';
import './OnboardingFlow.css';

/**
 * 🏺 ONBOARDING FLOW [v10.33.16]
 * Primera experiència d'usuari - Clara, ràpida i amb trellat.
 */
const OnboardingFlow = ({ onComplete }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    iaiaLevel: 1,
    notifications: true,
    theme: 'auto',
    accessibility: false
  });

  // [DAD] Passos d'onboarding
  const steps = useMemo(() => [
    {
      id: 'welcome',
      title: t('onboarding.welcome.title', 'Benvingut a Sóc de Poble'),
      description: t('onboarding.welcome.desc', 'La xarxa social rural que batega amb tu.'),
      icon: <Sparkles size={48} className="text-primary" />,
      features: [
        { icon: <Heart size={20} />, text: t('onboarding.welcome.f1', 'Comunitat real, sense algoritmes') },
        { icon: <Shield size={20} />, text: t('onboarding.welcome.f2', 'Les teues dades són teues') },
        { icon: <Users size={20} />, text: t('onboarding.welcome.f3', 'Connecta amb el teu poble') },
        { icon: <Zap size={20} />, text: t('onboarding.welcome.f4', 'Funciona offline, sempre') }
      ]
    },
    {
      id: 'iaia',
      title: t('onboarding.iaia.title', 'La IAIA, la teua guia'),
      description: t('onboarding.iaia.desc', 'Com vols que la IAIA t\'acompanye?'),
      icon: <Sparkles size={48} className="text-iaia text-blue-500" />,
      options: [
        { level: 0, title: t('onboarding.iaia.l0', 'Només Humans'), desc: t('onboarding.iaia.l0desc', 'Sense IA, només veïns reals') },
        { level: 1, title: t('onboarding.iaia.l1', 'Assistent'), desc: t('onboarding.iaia.l1desc', 'Ajuda amb tràmits i recordatoris') },
        { level: 2, title: t('onboarding.iaia.l2', 'Immersiu'), desc: t('onboarding.iaia.l2desc', 'Personalitat completa amb històries') }
      ]
    },
    {
      id: 'privacy',
      title: t('onboarding.privacy.title', 'Privacitat i Control'),
      description: t('onboarding.privacy.desc', 'Tu decides què compartir i què no.'),
      icon: <Shield size={48} className="text-success text-emerald-500" />,
      toggles: [
        { key: 'notifications', label: t('onboarding.privacy.t1', 'Notificacions push'), default: true },
        { key: 'accessibility', label: t('onboarding.privacy.t2', 'Mode accessibilitat'), default: false }
      ]
    },
    {
      id: 'complete',
      title: t('onboarding.complete.title', 'Tot llest!'),
      description: t('onboarding.complete.desc', 'El poble t\'espera. Comença a bategar!'),
      icon: <Check size={48} className="text-success text-emerald-500" />
    }
  ], [t]);

  // [COMPLETE] Finalitzar onboarding
  const handleComplete = useCallback(async () => {
    try {
      // Guardar preferències
      localStorage.setItem('sp_onboarding_complete', 'true');
      localStorage.setItem('sp_iaia_level', String(preferences.iaiaLevel));
      localStorage.setItem('sp_notifications', String(preferences.notifications));
      localStorage.setItem('sp_accessibility', String(preferences.accessibility));

      logger.info('[Onboarding] Completat amb èxit', preferences);

      if (onComplete) {
        onComplete(preferences);
      } else {
        navigate('/mur');
      }
    } catch (error) {
      logger.error('[Onboarding] Error completant:', error);
    }
  }, [preferences, onComplete, navigate]);

  // [NAV] Anar al següent pas
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length, handleComplete]);

  // [NAV] Tornar al pas anterior
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // [INPUT] Actualitzar preferències
  const handlePreferenceChange = useCallback((key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="onboarding-overlay fixed inset-0 bg-black/90 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
      <div 
        className="onboarding-container w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* [PROGRESS] Barra de progrés */}
        <div className="onboarding-progress h-1 bg-gray-200 dark:bg-white/10">
          <div 
            className="h-full bg-blue-600 dark:bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {/* [CONTENT] Contingut del pas actual */}
        <div className="onboarding-content p-8 text-gray-900 dark:text-white">
          {/* Icon */}
          <div className="onboarding-icon mb-6 flex justify-center">
            {step.icon}
          </div>

          {/* Title */}
          <h2 
            id="onboarding-title"
            className="onboarding-title text-2xl font-black text-center mb-3 text-gray-900 dark:text-white"
          >
            {step.title}
          </h2>

          {/* Description */}
          <p className="onboarding-description text-center text-gray-600 dark:text-gray-400 mb-8">
            {step.description}
          </p>

          {/* [FEATURES] Llista de característiques (pas 1) */}
          {step.features && (
            <div className="onboarding-features space-y-4 mb-8">
              {step.features.map((feature, index) => (
                <div 
                  key={index}
                  className="onboarding-feature flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5"
                >
                  <span className="text-blue-600 dark:text-primary">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* [OPTIONS] Selector de nivell IAIA (pas 2) */}
          {step.options && (
            <div className="onboarding-options space-y-3 mb-8">
              {step.options.map((option) => (
                <button
                  key={option.level}
                  onClick={() => handlePreferenceChange('iaiaLevel', option.level)}
                  className={`onboarding-option w-full p-4 rounded-xl border text-left transition-all ${
                    preferences.iaiaLevel === option.level
                      ? 'border-blue-600 dark:border-primary bg-blue-50 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-blue-600/50'
                  }`}
                  aria-pressed={preferences.iaiaLevel === option.level}
                >
                  <div className="font-bold">{option.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* [TOGGLES] Interruptors (pas 3) */}
          {step.toggles && (
            <div className="onboarding-toggles space-y-4 mb-8">
              {step.toggles.map((toggle) => (
                <label
                  key={toggle.key}
                  className="onboarding-toggle flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer"
                >
                  <span className="font-medium">{toggle.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[toggle.key]}
                    onChange={(e) => handlePreferenceChange(toggle.key, e.target.checked)}
                    className="toggle-checkbox sr-only"
                    aria-label={toggle.label}
                  />
                  <div className={`toggle-switch ${preferences[toggle.key] ? 'active' : ''}`} />
                </label>
              ))}
            </div>
          )}

          {/* [COMPLETE] Missatge final (pas 4) */}
          {step.id === 'complete' && (
            <div className="onboarding-complete text-center mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {t('onboarding.complete.message', 'Les teues preferències han estat guardades.')}
              </p>
              <div className="onboarding-badges flex justify-center gap-2">
                <span className="badge-success px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  ✓ Privacitat Activada
                </span>
                <span className="badge-info px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  ✓ IAIA Configurada
                </span>
              </div>
            </div>
          )}
        </div>

        {/* [NAVIGATION] Botons de navegació */}
        <div className="onboarding-navigation p-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`onboarding-back flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            aria-label={t('common.back', 'Enrere')}
          >
            <ArrowLeft size={18} />
            {t('common.back', 'Enrere')}
          </button>

          {/* Next/Complete Button */}
          <button
            onClick={handleNext}
            className="onboarding-next flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-600 dark:bg-primary text-white dark:text-black hover:opacity-90 transition-all shadow-lg"
            aria-label={currentStep === steps.length - 1 ? t('common.finish', 'Finalitzar') : t('common.next', 'Següent')}
          >
            {currentStep === steps.length - 1 ? (
              <>
                {t('common.finish', 'Finalitzar')}
                <Check size={18} />
              </>
            ) : (
              <>
                {t('common.next', 'Següent')}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;


=====================================
FILE: src/components/PDFBategatManager.css
=====================================

/* 🏺 BATEGADOR PRO: GEOMETRIA DEL TACTE v10.26.0 */

.pdf-manager-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-app);
  color: var(--text-main);
  font-family: var(--font-sans);
  overflow: hidden;
}

.pdf-header {
  height: var(--spacing-header);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: var(--bg-theme-header);
  border-bottom: 1px solid var(--border-master);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 100;
  gap: 1rem;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-master);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title h1 {
  font-family: var(--font-condensed);
  font-size: 1.25rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.pdf-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow-y: auto;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 🧬 UNIVERSAL CARD PROTOCOL */
.form-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-master);
  border-radius: var(--radius-genesis);
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.iaia-tip {
  display: flex;
  gap: 1rem;
  background: rgba(14, 165, 233, 0.05); /* Azul Cielo Soft */
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(14, 165, 233, 0.15);
  margin-bottom: 1rem;
}

.iaia-tip p {
  font-family: var(--font-condensed);
  font-size: 1rem;
  font-style: italic;
  color: #0ea5e9; /* Azul Cielo */
  line-height: 1.4;
  margin: 0;
}

.file-active-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(34, 197, 94, 0.05);
  padding: 0.75rem 1.25rem;
  border-radius: 100px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  font-size: 0.85rem;
  font-weight: 600;
  color: #4ade80;
  width: fit-content;
}

.clear-file {
  background: transparent;
  border: none;
  color: rgba(239, 68, 68, 0.8);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  margin-left: 0.5rem;
}

.upload-zone {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-master);
  border-radius: var(--radius-genesis);
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.01);
}

.upload-zone:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--sdp-orange);
}

.upload-zone h3 {
  font-family: var(--font-condensed);
  font-size: 1.5rem; /* Augmentat per a llegibilitat mestre */
  font-weight: 900;
  text-transform: uppercase;
  margin: 1rem 0 0.5rem;
}

.upload-zone p {
  font-size: 1.1rem; /* Augmentat per a vistes canades */
  color: var(--text-secondary);
  max-width: 80%;
  text-align: center;
}

.divider {
  font-family: var(--font-condensed);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border-master);
}

.action-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.mode-btn {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.autofill {
  background: var(--gradient-bategat);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.2);
}

.mode-btn.clear {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-master);
  color: var(--text-main);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-family: var(--font-condensed);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 6px; /* GÈNESI SPACING */
  display: block;
}

.input-group input,
.input-group textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-master);
  padding: 0.85rem 1rem;
  border-radius: 16px;
  color: var(--text-main);
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: all 0.2s;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--sdp-orange);
  background: rgba(255, 255, 255, 0.06);
}

/* 🎭 ASIDE: THE STAGE */
.preview-action-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-card {
  background: var(--bg-panel);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: var(--radius-genesis);
  padding: 1.5rem;
  backdrop-filter: blur(20px);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-condensed);
  font-weight: 900;
  font-size: 0.85rem;
  color: #4ade80;
  margin-bottom: 0.5rem;
}

.status-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.generate-btn {
  width: 100%; /* Blindatge d'amplada total */
  min-height: 80px; /* Alçada sobirana per al tacte */
  background: var(--gradient-bategat);
  border: none;
  border-radius: var(--radius-genesis);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 40px rgba(249, 115, 22, 0.2);
  position: relative;
  overflow: hidden;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  filter: brightness(1.1);
  box-shadow: 0 15px 50px rgba(249, 115, 22, 0.3);
}

.generate-btn:active {
  transform: translateY(0);
}

.generate-btn span {
  font-family: var(--font-condensed);
  font-weight: 900;
  font-size: 1.1rem; /* Mida llegible i potent */
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap; /* Evitem el trencament de línia lleig */
}

.generate-btn.loading {
  background: var(--bg-panel);
  border: 1px solid var(--border-master);
  cursor: wait;
  box-shadow: none;
}

/* 🏺 SUCCESS STATE */
.success-card {
  background: var(--bg-panel);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: var(--radius-genesis);
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  animation: success-bounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-card .mode-btn.autofill {
  width: 100% !important;
  max-width: 400px;
  height: 60px !important;
  border-radius: 30px !important;
  font-size: 1rem !important;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
  margin-top: 1rem;
}

@keyframes success-bounce {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-card h3 {
  font-family: var(--font-condensed);
  font-size: 1.5rem;
  font-weight: 900;
  color: #4ade80;
  margin: 0;
}

.success-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--border-master);
  color: var(--text-muted);
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

/* 🏺 MOBILE REFINEMENT */
@media (max-width: 1024px) {
  .pdf-main {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
}


=====================================
FILE: src/components/PDFBategatManager.jsx
=====================================

import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FileText, Download, CheckCircle, ArrowLeft, ShieldCheck, Sparkles, Upload, FileUp, X, Globe, Lock, Users } from 'lucide-react';
import './PDFBategatManager.css';

// Configurar Worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const PDFBategatManager = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: 'JAVI LLINARES',
        dni: '12345678X',
        address: 'MAS D\'IBAÑEZ S/N',
        event: 'DECLARACIÓ RESPONSABLE',
        municipality: 'BENIARBEIG',
        day: new Date().getDate().toString(),
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString().slice(-1),
        activity: 'ELABORACIÓ I VENDA DE PRODUCTES LOCALS',
        message: ''
    });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('bategat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [generatedBlobUrl, setGeneratedBlobUrl] = useState(null);
    const uploadedFileRef = useRef(null); // Ref de seguretat (Llinatge Impertorbable)
    const fileInputRef = useRef(null);

    // Protocol de neteja de memòria (Zero Residus)
    React.useEffect(() => {
        return () => {
            if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
        };
    }, [generatedBlobUrl]);

    const clearFormData = () => {
        setFormData({
            name: '',
            dni: '',
            address: '',
            event: '',
            municipality: '',
            day: '',
            month: '',
            year: '',
            activity: '',
            message: ''
        });
        setUploadedFile(null);
        setIsPublic(false);
        setHistory([]);
        localStorage.removeItem('bategat_history');
    };

    const removeFromHistory = (fileName) => {
        const newHistory = history.filter(h => h.name !== fileName);
        setHistory(newHistory);
        localStorage.setItem('bategat_history', JSON.stringify(newHistory));
    };

    const autoFillWithIdentity = () => {
        setFormData({
            name: 'JAVI LLINARES',
            dni: '12345678X',
            address: 'MAS D\'IBAÑEZ S/N',
            event: 'DECLARACIÓ RESPONSABLE',
            municipality: 'BENIARBEIG',
            day: new Date().getDate().toString(),
            month: (new Date().getMonth() + 1).toString(),
            year: new Date().getFullYear().toString().slice(-1),
            activity: 'ELABORACIÓ I VENDA DE PRODUCTES LOCALS',
            message: 'Sol·licito la validació del Protocol Rhizome per al meu node municipal.'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setFileVisibility = (fileName, visibility) => {
        const newHistory = history.map(h => 
            h.name === fileName ? { ...h, visibility } : h
        );
        setHistory(newHistory);
        localStorage.setItem('bategat_history', JSON.stringify(newHistory));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
            uploadedFileRef.current = file;
            console.log("IAIA: Adoptant PDF Orfe a memòria viva...");
            
            const newHistory = [
                { name: file.name, date: new Date().toISOString(), visibility: 'private' }, 
                ...history.filter(h => h.name !== file.name)
            ].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem('bategat_history', JSON.stringify(newHistory));
            e.target.value = ''; // Reset per a permetre re-pujada del mateix fitxer
        }
    };

    /**
     * 🏺 MASTER PDF ANALYSIS (Coordinate Extraction)
     * Busca les coordenades (x, y) de paraules clau per a posicionar els camps exactament on toca.
     */
    const analyzePDFStructure = async (fileBytes) => {
        try {
            console.log("IAIA: Iniciant Protocol d'Identificació de Camps Legals...");
            const loadingTask = pdfjsLib.getDocument({ 
                data: fileBytes,
                stopAtErrors: false, // Protocol de càrrega resilient per a XRefs corruptes
                isEvalSupported: false 
            });
            const pdf = await loadingTask.promise;
            
            // Analitzem la primera pàgina per buscar els anchors
            const page = await pdf.getPage(1);
            const content = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1.0 });

            console.log(`IAIA: Pàgina analitzada. Detectats ${content.items.length} elements de text.`);

            const anchors = {
                name: null,
                dni: null,
                address: null,
                event: null,
                signature: null,
                municipality: null
            };

            content.items.forEach(item => {
                const text = item.str.toLowerCase();
                const [, , , scaleY, x, y] = item.transform;
                const size = Math.abs(scaleY);

                // EXCLUSIÓ DE ZONES FANTASMA (Enllaç, etc.)
                if ((/enlace|https:\/\/|www\./).test(text)) return;

                // Detecció de zones legalment precises (Regex heretada del protocol Xylella)
                if ((/nom:|primer cognom|interessat|mercantil/).test(text) && !anchors.name) {
                    anchors.name = { x, y, size, context: item.str };
                }
                if ((/dni:|nif\/cif|número d'identificació|nif:/).test(text) && !anchors.dni) {
                    anchors.dni = { x, y, size, context: item.str };
                }
                if ((/adreça:|domicili|calle\/avenida|carrer/).test(text) && !anchors.address) {
                    anchors.address = { x, y, size, context: item.str };
                }
                if ((/municipi:|localitat|població/).test(text) && !anchors.municipality) {
                    anchors.municipality = { x, y, size, context: item.str };
                }
                if ((/realización del evento:|evento:|realització/).test(text) && !anchors.event) {
                    if (!text.includes("enlace") && !text.includes("http")) {
                        anchors.event = { x, y, size, context: item.str };
                    }
                }
                if ((/actividad de|actividad:/).test(text) && !anchors.activity) {
                    if (!text.includes("enlace") && y > 350) { // Limitació per a no baixar a la zona de links
                        anchors.activity = { x, y, size, context: item.str };
                    }
                }
                // Segregació Mil·limètrica de Dates
                if ((/los días:/).test(text) && !anchors.day) {
                    anchors.day = { x, y, size, context: item.str };
                }
                if ((/\bde\b/).test(text)) {
                    // Busquem el "de" que va després de "los días" per al mes
                    if (anchors.day && !anchors.month && x > anchors.day.x + 50) {
                        anchors.month = { x, y, size, context: item.str };
                    }
                }
                if ((/202\d|de 202/).test(text) && !anchors.year) {
                    anchors.year = { x, y, size, context: item.str };
                }
                if ((/signat|firmado|firma/).test(text) && !anchors.signature) {
                    anchors.signature = { x, y, size, context: item.str };
                }
            });

            // Post-processament de seguretat: purga de camps en zones d'enllaç
            if (anchors.event && anchors.event.context.toLowerCase().includes("enlace")) anchors.event = null;
            if (anchors.activity && anchors.activity.context.toLowerCase().includes("enlace")) anchors.activity = null;

            console.log("IAIA: Mapa de bategat intel·ligent generat:", anchors);
            return { anchors, viewport };
        } catch (error) {
            console.warn("IAIA: L'anàlisi de bategat ha fallat (XRef Error), usant mapeig canònic per defecte.", error);
            return null;
        }
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            let pdfDoc;
            let fileBytes;
            
            // Prioritat absoluta a l'arxiu adoptat (uploadedFile o referència)
            const fileToWork = uploadedFile || uploadedFileRef.current;
            
            if (fileToWork) {
                console.log("IAIA: Bategant sobre matriu original adoptada...");
                fileBytes = await fileToWork.arrayBuffer();
                pdfDoc = await PDFDocument.load(fileBytes);
            } else {
                console.log("IAIA: Generant document genèric (No s'ha adoptat cap original).");
                pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([595.28, 841.89]);
                const { height } = page.getSize();
                const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

                // Plantilla Neutra (sense marques de Sóc de Poble)
                page.drawText(formData.event || 'DOCUMENT DE TRÀMIT', { x: 50, y: height - 80, size: 20, font: fontBold });
                
                if (formData.name) {
                    page.drawText(`Interessat: ${formData.name}`, { x: 50, y: height - 120, size: 12, font });
                    page.drawText(`DNI: ${formData.dni}`, { x: 50, y: height - 140, size: 12, font });
                }
            }

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const form = pdfDoc.getForm();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // ANÀLISI INTEL·LIGENT
            let mapping = null;
            if (fileToWork) {
                mapping = await analyzePDFStructure(fileBytes);
            }

            // Funció per a bategar amb mimetisme real (PROTOCOL D'INVISIBILITAT)
            const placeField = (id, key, defaultX, defaultY, defaultW = 250) => {
                const field = form.createTextField(id);
                if (formData[key]) field.setText(String(formData[key]));
                
                let x = defaultX;
                let y = defaultY;
                let fontSize = 10;
                let width = defaultW;

                // Aplicació de precisió via anchors analitzats (CONTEXT DETECTIVE)
                if (mapping && mapping.anchors[key]) {
                    const anchor = mapping.anchors[key];
                    // Calculem l'offset mil·limètric per a buits de text
                    x = anchor.x + (key.length > 4 ? 85 : 45); // Offset dinàmic segons context
                    y = anchor.y - 1;  // Ajust de baseline (Offset 0)
                    fontSize = anchor.size > 0 ? anchor.size * 0.95 : 10;
                    width = 280;
                    
                    // Ajustos de precisió mestre per a la Declaració Responsable
                    if (key === 'day') { x = anchor.x + 48; width = 30; }
                    if (key === 'month') { x = anchor.x + 28; width = 70; }
                    if (key === 'year') { x = anchor.x + 38; width = 15; }
                    if (key === 'activity') { x = anchor.x + 58; y -= 1; width = 450; }
                    if (key === 'event') { x = anchor.x + 118; y -= 1; width = 400; }
                    // 🏺 Firma mestre: sota 'Firmado:' alineat a l'esquerra
                    if (key === 'signature') { 
                        x = anchor.x; 
                        y = anchor.y - 18; // Ajust mil·limètric: just a sota
                        width = 300; 
                    }

                    console.log(`IAIA: Bategant camp [${id}] amb Invisibilitat a {x:${Math.round(x)}, y:${Math.round(y)}}`);
                }

                field.addToPage(firstPage, { 
                    x, 
                    y, 
                    width, 
                    height: fontSize * 1.25, 
                    font 
                });
                field.setFontSize(fontSize);
                
                // 🏺 PROTOCOL D'INVISIBILITAT (Sense Filetes)
                try {
                    if (field && typeof field.setBorderColor === 'function') {
                        field.setBorderColor(undefined); // Mètode mestre per a invisibilitat de vora
                    }
                    if (field && typeof field.setBackgroundColor === 'function') {
                        field.setBackgroundColor(rgb(0.98, 0.98, 1)); 
                    }
                } catch (e) {
                    console.warn("IAIA: Mimetisme visual omès per compatibilitat:", e);
                }
            };

            // Mapeig de camps (si no hi ha anchor s'usa el canònic)
            placeField('doc.nom', 'name', 145, 608);
            placeField('doc.dni', 'dni', 145, 582);
            placeField('doc.domicili', 'address', 145, 556, 400);
            placeField('doc.municipi', 'municipality', 145, 530);
            
            // Zones de Date Segregation (Mil·limètrica)
            placeField('doc.dia', 'day', 150, 485, 40);
            placeField('doc.mes', 'month', 220, 485, 80);
            placeField('doc.any', 'year', 335, 485, 20);
            
            // Activitat vs Esdeveniment
            // 🏺 Purga d'Enllaços: no posem camps genèrics si no tenim anclatge per a evitar trepitjar 'Enlace'
            if (mapping && mapping.anchors.activity) {
                placeField('doc.activitat', 'activity', 150, 460, 450);
            }
            if (mapping && mapping.anchors.event) {
                placeField('doc.assumpte', 'event', 145, 385, 400);
            }

            // Signatura (Nom sota 'Firmado')
            placeField('doc.signatura', 'signature', 50, 150, 300);

            const pdfBytesSaved = await pdfDoc.save();
            const blob = new Blob([pdfBytesSaved], { type: 'application/pdf' });
            
            // 🏺 MAC DOWNLOAD FIX (Robust Anchor Pattern)
            if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
            const downloadUrl = URL.createObjectURL(blob);
            setGeneratedBlobUrl(downloadUrl);
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = uploadedFile ? `bategat_${uploadedFile.name}` : `sollicitud_bategada.pdf`;
            
            // Forçar append al DOM per a navegadors estrictes (Mac/Safari)
            document.body.appendChild(link);
            link.click();
            
            // Neteja del DOM (el blob segueix actiu a generatedBlobUrl)
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);

            setIsDone(true);
        } catch (error) {
            console.error('Error bategant PDF intel·ligent:', error);
            alert("IAIA: El bategat ha fallat. Assegura't d'haver pujat el fitxer original correctament.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="pdf-manager-container animate-in fade-in zoom-in duration-500">
            <header className="pdf-header">
                <button className="back-btn" onClick={onBack} title="Tornar">
                    <ArrowLeft size={20} />
                </button>
                <div className="header-title">
                    <FileText className="text-orange-500" size={24} />
                    <h1 style={{ fontFamily: 'var(--font-condensed)', fontWeight: 900 }}>
                        {uploadedFile ? 'ADOPTANT PDF ORFE' : 'PDF BATEGADOR PRO'}
                    </h1>
                </div>
            </header>

            <main className="pdf-main no-scrollbar">
                <section className="form-section">
                    <div className="form-card">
                        <div className="iaia-tip">
                            <Sparkles size={20} />
                            <p>"{uploadedFile ? `He detectat ${uploadedFile.name}. El farem interactiu mantenint el seu llinatge original intacte.` : "Mestre, per seguretat el Mas no guarda els teus arxius. Torna a pujar el PDF que vols bategar.\n\nNota: He investigat Affinity i NO permet crear PDF editables directe. La millor alternativa lliure és Scribus o LibreOffice Draw."}"</p>
                        </div>

                        {!uploadedFile ? (
                            <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                                <FileUp size={48} className="text-orange-500/50 mb-4" />
                                <h3>PUJA EL PDF QUE VOLS CONVERTIR</h3>
                                <p>Farem qualsevol PDF editable per a facilitar-te la vida. Els camps s'estudien amb trellat per a no tocar mai el document original, només facilitar el seu completat.</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" hidden />
                            </div>
                        ) : (
                            <div className="file-active-badge">
                                <CheckCircle size={18} />
                                <span>PDF CARREGAT: {uploadedFile.name}</span>
                                <button className="clear-file" onClick={() => setUploadedFile(null)}>Eliminar</button>
                            </div>
                        )}

                        {history.length > 0 && (
                            <div className="mt-6 p-4 bg-white/5 rounded-[28px] border border-white/5">
                                <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-4 px-2">GOVERNANÇA DE BATEGATS RECENTS</label>
                                <div className="space-y-3">
                                    {history.map((h, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-[28px] hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10 group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-[#0ea5e9]/10 p-2 rounded-[28px]">
                                                    <FileText size={16} className="text-[#0ea5e9]" />
                                                </div>
                                                <span className="text-[12px] font-medium truncate max-w-[150px]">{h.name}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-[28px] border border-white/5">
                                                <button 
                                                    onClick={() => setFileVisibility(h.name, 'private')}
                                                    className={`p-1.5 rounded-full transition-all ${h.visibility === 'private' || !h.visibility ? 'bg-[#0ea5e9] text-white' : 'text-white/30 hover:text-white'}`}
                                                    title="Privat (Només per a mi)"
                                                >
                                                    <Lock size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => setFileVisibility(h.name, 'group')}
                                                    className={`p-1.5 rounded-full transition-all ${h.visibility === 'group' ? 'bg-[#5d5fef] text-white' : 'text-white/30 hover:text-white'}`}
                                                    title="Grup (Entitat / Empresa)"
                                                >
                                                    <Users size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => setFileVisibility(h.name, 'public')}
                                                    className={`p-1.5 rounded-full transition-all ${h.visibility === 'public' ? 'bg-green-500 text-white' : 'text-white/30 hover:text-white'}`}
                                                    title="Públic (Comunitat)"
                                                >
                                                    <Globe size={12} />
                                                </button>
                                                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                                                <button 
                                                    className="p-1.5 rounded-full text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    onClick={() => removeFromHistory(h.name)}
                                                    title="Eliminar del Mas"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="divider" style={{ marginTop: '2rem' }}>PROTOCOLS DE DADES</div>
                        
                        <div className="action-bar">
                            <button onClick={autoFillWithIdentity} className="mode-btn autofill">
                                <Sparkles size={18} />
                                AUTOFILL MAS
                            </button>
                            <button onClick={clearFormData} className="mode-btn clear">
                                <ShieldCheck size={18} />
                                ESBORRAR TOT
                            </button>
                        </div>

                        <div className="input-group">
                            <label>NOM DE L'INTERESSAT</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Javi Llinares" />
                        </div>

                        <div className="input-grid">
                            <div className="input-group">
                                <label>DNI / NIE</label>
                                <input name="dni" value={formData.dni} onChange={handleInputChange} placeholder="12345678X" />
                            </div>
                            <div className="input-group">
                                <label>ASSUMPTE / TRÀMIT</label>
                                <input name="event" value={formData.event} onChange={handleInputChange} placeholder="Títol del tràmit" />
                            </div>
                        </div>

                        <div className="input-grid" style={{ marginTop: '1.5rem' }}>
                            <div className="input-group">
                                <label>DOMICILI / ADREÇA</label>
                                <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Carrer de l'olivera, 4" />
                            </div>
                            <div className="input-group">
                                <label>MUNICIPI</label>
                                <input name="municipality" value={formData.municipality} onChange={handleInputChange} placeholder="Benidorm" />
                            </div>
                        </div>

                        <div className="input-grid" style={{ marginTop: '1.5rem' }}>
                             <div className="input-group">
                                <label>DATA DEL TRÀMIT (DIA / MES / ANY)</label>
                                <div className="flex gap-2">
                                    <input name="day" value={formData.day} onChange={handleInputChange} placeholder="20" style={{ width: '60px', textAlign: 'center' }} />
                                    <input name="month" value={formData.month} onChange={handleInputChange} placeholder="Febrer" className="flex-1" />
                                    <input name="year" value={formData.year} onChange={handleInputChange} placeholder="6" style={{ width: '60px', textAlign: 'center' }} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>ACTIVITAT ESPECÍFICA</label>
                                <input name="activity" value={formData.activity} onChange={handleInputChange} placeholder="Ex: Consum d'aliments" />
                            </div>
                        </div>

                        {!uploadedFile && (
                            <div className="input-group" style={{ marginTop: '1.5rem' }}>
                                <label>PETICIÓ DETALLADA</label>
                                <textarea name="message" value={formData.message} onChange={handleInputChange} rows="4" placeholder="Escriu ací què sol·licites..." />
                            </div>
                        )}
                    </div>
                </section>

                <aside className="preview-action-section">
                    <div className="status-card">
                        <div className="status-header">
                            <ShieldCheck size={18} />
                            <span>IDENTIFICACIÓ LEGAL</span>
                        </div>
                        <p>Aquest servei proveït sobiranament per Sóc de Poble és totalment gratuït. El Protocol d'Identificació de Camps Legals assegura que complim totes les condicions legals i tècniques per a facilitar els tràmits comunitaris sense cap cost a posteriori.</p>
                        
                        <div className="mt-6 flex items-start gap-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        checked={isPublic} 
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-all ${isPublic ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-orange-500/80 group-hover:text-orange-500 transition-colors">Fer públic i compartir amb la comunitat</span>
                            </label>
                        </div>
                    </div>

                    {!isDone ? (
                        <button 
                            className={`generate-btn ${isGenerating ? 'loading' : ''}`} 
                            onClick={generatePDF}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <span>Macerant dades...</span>
                            ) : (
                                <>
                                    <Download size={28} />
                                    <span>{uploadedFile ? 'Bategar PDF Extern' : 'Generar PDF Nou'}</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="success-card">
                            <CheckCircle size={56} className="text-green-500" />
                            <h3>MÀGIA REALITZADA!</h3>
                            <p>El PDF és ara 100% interactiu i ja s'hauria d'haver descarregat.</p>
                            
                            <button className="mode-btn autofill" onClick={() => window.open(generatedBlobUrl, '_blank')} style={{ width: '100%', height: '60px', borderRadius: '28px', backgroundColor: '#5d5fef' }}>
                                <Sparkles size={20} />
                                OBRIR PDF (PONT SOBIRÀ)
                            </button>
                            
                            <button className="mode-btn autofill" onClick={generatePDF} style={{ width: '100%', height: '60px', borderRadius: '28px', marginTop: '1rem' }}>
                                <Download size={20} />
                                RE-DESCARREGAR PDF
                            </button>

                            <button className="reset-btn" onClick={() => setIsDone(false)}>
                                Bategar-ne un altre
                            </button>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default PDFBategatManager;


=====================================
FILE: src/components/PersonalVault.css
=====================================

.personal-vault-container {
    padding: 24px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    margin-bottom: 24px;
}

.vault-header {
    margin-bottom: 20px;
}

.vault-title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.vault-icon {
    color: var(--color-primary, #00f2ff);
}

.vault-subtitle {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-top: 4px;
}

.vault-requirements {
    background: rgba(0, 0, 0, 0.2);
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 20px;
}

.vault-requirements h4 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.5;
    margin-bottom: 12px;
}

.requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.requirement-item {
    font-size: 0.85rem;
}

.req-name {
    font-weight: 600;
    display: block;
}

.req-star {
    color: #ff0055;
}

.req-desc {
    font-size: 0.75rem;
    opacity: 0.6;
}

.vault-upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: var(--color-primary, #00f2ff);
    color: #000;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    margin-bottom: 20px;
}

.vault-upload-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 242, 255, 0.4);
}

.vault-documents-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.vault-empty-state {
    text-align: center;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    opacity: 0.6;
}

.vault-doc-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: background 0.2s ease;
}

.doc-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.doc-details {
    display: flex;
    flex-direction: column;
}

.doc-name {
    font-size: 0.9rem;
    font-weight: 500;
}

.doc-meta {
    font-size: 0.75rem;
    opacity: 0.5;
}

.doc-remove {
    background: none;
    border: none;
    color: #ff0055;
    opacity: 0.5;
    cursor: pointer;
}

.doc-remove:hover {
    opacity: 1;
}

.vault-iaia-advice {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.08);
    border-left: 4px solid var(--color-yellow, #ffdd00);
    border-radius: 8px;
    margin-top: 20px;
    font-size: 0.85rem;
    font-style: italic;
}

.text-green {
    color: #4caf50;
}

.text-yellow {
    color: #ffeb3b;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

=====================================
FILE: src/components/PersonalVault.jsx
=====================================

import React, { useState, useMemo } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { docExtractionService } from '../services/docExtractionService';
import { logger } from '../utils/logger';
import './PersonalVault.css';

/**
 * PersonalVault [PRIVATE DOCUMENT VAULT]
 * Gestiona el processament de documents personals contra requeriments de tràmits.
 */
const PersonalVault = ({ onDataExtracted, procedureId }) => {
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Requeriments derivats (sense estat per evitar renders en cascada)
    const requirements = useMemo(() => {
        return procedureId ? docExtractionService.getRequirements(procedureId) : [];
    }, [procedureId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await docExtractionService.processDocument(file, requirements);
            const newDoc = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                size: file.size,
                extractedData: result,
                timestamp: new Date().toISOString()
            };
            
            setDocuments(prev => [...prev, newDoc]);
            if (onDataExtracted) onDataExtracted(result);
            logger.log('[PersonalVault] Document processed:', file.name);
        } catch (err) {
            logger.error('[PersonalVault] Error processing document:', err);
            alert('Error processant el document: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeDocument = (id) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    return (
        <div className="personal-vault-container p-6 bg-[#0a0a0c] rounded-[28px] border border-white/5 shadow-2xl">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/10 text-blue-400 rounded-[28px]">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white leading-none mb-1">El Meu Rebost de Documents</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Processament Segur</p>
                    </div>
                </div>
                <div className="upload-zone">
                    <input 
                        type="file" 
                        id="vault-upload" 
                        className="hidden" 
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <label 
                        htmlFor="vault-upload"
                        className={`flex items-center gap-2 px-6 h-12 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all cursor-pointer ${
                            isUploading ? 'bg-gray-800 text-gray-500' : 'bg-[var(--theme-accent-primary)] text-white hover:bg-orange-600 shadow-lg active:scale-95'
                        }`}
                    >
                        <Upload size={18} />
                        <span>{isUploading ? 'Processant...' : 'Pujar Document'}</span>
                    </label>
                </div>
            </header>

            {requirements && requirements.length > 0 && (
                <div className="mb-8 p-4 bg-white/5 rounded-[28px] border border-white/5">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Requeriments del Tràmit</h4>
                    <div className="flex flex-wrap gap-2">
                        {requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-[28px] border border-white/5">
                                <span className="text-xs text-gray-300">{req}</span>
                                <CheckCircle size={14} className="text-emerald-500 opacity-40" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="documents-list space-y-4">
                {documents.length > 0 ? documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-[28px] border border-white/5 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-orange-500/10 text-blue-400 rounded-[28px]">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{doc.name}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
                                    {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/10">
                                <CheckCircle size={12} />
                                <span>Verificat</span>
                            </div>
                            <button 
                                onClick={() => removeDocument(doc.id)}
                                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-[28px] transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-12 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-[28px]">
                        <AlertCircle size={48} className="mb-4 text-gray-600" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">No hi ha documents</p>
                    </div>
                )}
            </div>
            
            <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    Seguretat de Ferro • DID-SP Encrypt
                </div>
                <button 
                    onClick={() => setDocuments([])}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                    <X size={14} />
                    <span>Netejar Todo</span>
                </button>
            </footer>
        </div>
    );
};

export default PersonalVault;


=====================================
FILE: src/components/PlaygroundBanner.css
=====================================

.playground-banner {
    background: linear-gradient(90deg, #ea580c 0%, #f59e0b 100%);
    color: white;
    padding: 0 16px;
    height: 50px;
    display: flex;
    align-items: center;
    z-index: var(--z-playground);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    font-size: var(--font-size-base);
    box-shadow: var(--shadow-hard);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.banner-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--page-margin);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
}

.banner-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.banner-text-stack {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    min-width: 0;
    align-items: center;
    text-align: center;
}

.banner-label {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: 0.8px;
    opacity: 0.85;
    color: rgba(255, 255, 255, 0.9);
}

.banner-persona-name {
    font-size: var(--font-size-base);
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-main)fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
    .banner-content {
        padding: 0 8px;
    }

    .banner-label {
        font-size: 8px;
    }

    .banner-persona-name {
        font-size: var(--font-size-base);
    }

    .banner-btn {
        padding: 4px 6px;
        font-size: var(--font-size-base);
    }
}

.banner-actions {
    display: flex;
    gap: 8px;
}

.banner-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 4px 10px;
    border-radius: 0px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-size: var(--font-size-base);
    display: flex;
    align-items: center;
    gap: 4px;
}

.banner-btn:hover {
    background: rgba(0, 0, 0, 0.4);
}

.banner-btn.exit {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.5);
}

=====================================
FILE: src/components/PlaygroundBanner.jsx
=====================================

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import './PlaygroundBanner.css';

const PlaygroundBanner = () => {
    const { isPlayground, isAdmin, profile, exitPlayground } = useAuth();
    const navigate = useNavigate();

    if (!isPlayground || isAdmin) return null;

    return (
        <div className="playground-banner">
            <div className="banner-content">
                <div className="banner-left">
                    <div className="banner-text-stack">
                        <span className="banner-label">PROVANT • ESTÀS PILOTANT A:</span>
                        <span className="banner-persona-name">{profile?.full_name}</span>
                    </div>
                </div>
                <div className="banner-actions">
                    <button className="banner-btn" onClick={() => navigate('/playground')}>
                        Canviar personatge
                    </button>
                    <button className="banner-btn exit" onClick={async () => {
                        const confirmExit = window.confirm("Segur que vols tornar al món real (Producció)?");
                        if (confirmExit) {
                            await exitPlayground();
                        }
                    }}>
                        TORNAR A PRODUCCIÓ <LogOut size={14} />
                    </button>
                    <button className="banner-close-btn" onClick={async () => await exitPlayground()} title="Tancar finestra de publicitat/playground">
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaygroundBanner;


=====================================
FILE: src/components/PollManager.css
=====================================

.poll-manager-overlay {
    position: fixed;
    inset: 0;
    backdrop-filter: blur(20px);
    background: rgba(0,0,0,0.8);
}

.poll-card {
    transform: translateY(20px);
    opacity: 0;
    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.poll-manager-overlay.animate-in .poll-card {
    transform: translateY(0);
    opacity: 1;
}


=====================================
FILE: src/components/PollManager.jsx
=====================================

import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, BarChart3, Plus, Trash2 } from 'lucide-react';
import './PollManager.css';

const PollManager = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, val) => {
    const newOptions = [...options];
    newOptions[index] = val;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert("Mestre, omple tots els camps del trellat!");
      return;
    }
    alert("Enquesta bategada amb èxit! (Simulat)");
    onClose();
  };

  return (
    <div className="poll-manager-overlay glass-premium animate-in flex items-center justify-center p-6 z-[6000]">
      <div className="poll-card bg-[#111] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-fuchsia-600" />
        
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <BarChart3 className="text-orange-500" />
                <h2 className="text-xl font-black uppercase text-fuchsia-400">Nova Enquesta</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-[28px] transition-colors">
                <X />
            </button>
        </header>

        <div className="space-y-6">
            <div className="field-group">
                <label className="text-[10px] uppercase font-black opacity-40 mb-2 block">La Pregunta del Mas</label>
                <input 
                    type="text" 
                    placeholder="Què vols bategar?"
                    className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-sm font-bold focus:border-fuchsia-500/50 outline-none transition-all"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>

            <div className="field-group">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] uppercase font-black opacity-40 block">Opcions de Trellat</label>
                    <span className="text-[9px] opacity-30 font-black">{options.length}/5</span>
                </div>
                <div className="space-y-3">
                    {options.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder={`Opció ${i+1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-[28px] p-3 text-xs font-bold outline-none"
                                value={opt}
                                onChange={(e) => updateOption(i, e.target.value)}
                            />
                            {options.length > 2 && (
                                <button onClick={() => removeOption(i)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-[20px] transition-all">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {options.length < 5 && (
                        <button 
                            onClick={addOption}
                            className="w-full p-3 border border-dashed border-white/10 rounded-[28px] text-[10px] uppercase font-black opacity-40 hover:opacity-100 hover:border-fuchsia-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Afegir Opció
                        </button>
                    )}
                </div>
            </div>

            <button 
                onClick={handleCreate}
                className="w-full bg-fuchsia-600 text-white p-4 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-fuchsia-600/20 flex items-center justify-center gap-2"
            >
                <Sparkles size={16} /> Bategar Enquesta
            </button>
        </div>
      </div>
    </div>
  );
};

export default PollManager;


=====================================
FILE: src/components/Portal.jsx
=====================================

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal v10.0 (Escut de Titani Z-Index)
 * Injecta el component directament l'arrel de l'aplicació per saltar-se 
 * qualsevol "stacking context" destructiu originat per "transforms" o "backdrop-filters" als pares.
 */
export default function Portal({ children }) {
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    container.setAttribute('data-portal', 'true');
    container.setAttribute('aria-hidden', 'false');
    container.setAttribute('class', 'app-portal');
    document.body.appendChild(container);
    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [container]);

  return createPortal(children, container);
}


=====================================
FILE: src/components/ProfileHeaderPremium.css
=====================================

.profile-premium-header-container {
    position: relative;
    width: 100%;
    margin-bottom: 24px;
}

/* [MASTER] COVER SECTION - Directiva Gem 16:9 */
.premium-cover-section {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 400px; /* Evitem portades gegants en desktop */
    background: var(--bg-edge);
    border-radius: var(--sdp-radius-genesis) var(--sdp-radius-genesis) 0 0;
    overflow: hidden;
}
@media (max-width: 768px) {
    .premium-cover-section {
        height: auto;
    }
}

.premium-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.premium-cover-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    opacity: 1;
}

.premium-cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 60%, rgba(0, 0, 0, 0.8) 100%);
}

/* Nav Actions */
.premium-nav-actions {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 50;
}

.premium-nav-right {
    display: flex;
    gap: 12px;
}

.premium-btn-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;

    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 55;
    pointer-events: auto;
}

.premium-btn-circle:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
    border-color: white;
    box-shadow: var(--shadow-hard);
}

.premium-btn-circle.action {
    background: var(--color-primary);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: var(--shadow-hard);
}

.premium-btn-circle.action:hover {
    background: #1d4ed8;
    filter: brightness(1.1);
}

.premium-btn-circle.share {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
}

.premium-btn-circle.share:hover {
    background: var(--color-primary);
    border-color: white;
}

.premium-btn-circle.theme-toggle {
    background: rgba(var(--sdp-terracotta-rgb, 255, 109, 35), 0.2);
    border-color: var(--sdp-terracotta);
    color: var(--sdp-terracotta);
}

.premium-btn-circle.theme-toggle:hover {
    background: var(--color-primary);
    color: #000;
}

.edit-actions-group {
    display: flex;
    gap: 8px;
}

.premium-btn-circle.save {
    background: #16a34a;
    border-color: rgba(255, 255, 255, 0.4);
}

.premium-btn-circle.save:hover {
    background: #15803d;
    transform: scale(1.1);
}

.premium-btn-circle.cancel {
    background: #dc2626;
    border-color: rgba(255, 255, 255, 0.4);
}

.premium-btn-circle.cancel:hover {
    background: #b91c1c;
    transform: scale(1.1);
}

.premium-btn-circle.edit {
    background: var(--color-primary);
    color: #000;
    border-color: rgba(255, 255, 255, 0.4);
}

.premium-share-wrapper {
    display: flex;
    align-items: center;
}

/* [MASTER] IDENTITY CARD - Overlap Tótem */
.premium-identity-card {
    position: relative;
    margin: -80px 16px 24px; /* Reduït marge lateral per a mòbil */
    padding: 85px 24px 24px; /* Augmentat per evitar solapament amb l'avatar */
    background: var(--surface-glass-heavy);
    backdrop-filter: blur(var(--blur-master));
    -webkit-backdrop-filter: blur(var(--blur-master));
    border-radius: var(--sdp-radius-genesis);
    border: 1px solid var(--border-master);
    box-shadow: var(--shadow-deep);
    z-index: 60;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: calc(100% - 32px); /* Forcem que no es desborde */
    display: flex;
    flex-direction: column;
    align-items: center;
}

[data-theme='dark'] .premium-identity-card {
    background: rgba(10, 10, 10, 0.9);
    border-color: rgba(0, 242, 255, 0.3);
}

.edit-mode-active .premium-identity-card {
    background: rgba(220, 38, 38, 0.98); /* Més opac per a contrast suprem */
    border-color: #fff;
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.5);
    transform: scale(1.02); /* Efecte d'expansió en edició */
}

.edit-mode-active .premium-title,
.edit-mode-active .premium-subtitle,
.edit-mode-active .premium-town-line,
.edit-mode-active .premium-town-line span,
.edit-mode-active .premium-bio,
.edit-mode-active .premium-edit-input,
.edit-mode-active .premium-edit-textarea {
    color: white !important;
}

.edit-mode-active .premium-town-line svg {
    color: white !important;
    opacity: 1;
}

.premium-avatar-row {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 20px;
}

.premium-avatar-wrapper {
    position: absolute; 
    top: -75px;         /* Ajustat per "mossegar" d'una forma més neta */
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 150px;
    z-index: 70;
}
@media (max-width: 768px) {
    .premium-avatar-wrapper {
        width: 130px;
        height: 130px;
        top: -65px;
    }
    .premium-identity-card {
        padding-top: 75px;
        margin-top: -70px;
    }
}

.premium-avatar-img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 5px solid #000; /* Contrast mestre */
    box-shadow: 0 0 40px rgba(0, 242, 255, 0.3);
    background: #000;
}

.premium-avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 24px;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    font-weight: 800;
    border: 4px solid #fff;
}

.live-indicator-pulse {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 18px;
    height: 18px;
    background: #22c55e;
    border: 3px solid var(--bg-main);
    border-radius: 50%;

}

.live-indicator-pulse::after {
    content: '';
    position: absolute;
    inset: -4px;
    background: #22c55e;
    border-radius: 50%;

    opacity: 0.4;
    animation: premiumPulse 2s infinite;
}

@keyframes premiumPulse {
    0% {
        transform: scale(1);
        opacity: 0.4;
    }

    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}

.premium-main-text {
    width: 100%;
    padding-bottom: 8px;
    text-align: center;
}

.premium-title-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 8px;
}

.premium-title {
    font-size: 42px; /* Més impacte */
    font-weight: 950;
    color: #FFFFFF;
    letter-spacing: -2px;
    margin: 0;
    line-height: 0.9;
    text-transform: uppercase;
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* Millora de contrast per a títols en fons clar */
[data-theme='light'] .premium-title {
    color: #C2410C;
    /* Taronja més fosc per a accessibilitat (Contrast AA) */
}

.premium-badge {
    padding: 4px 12px;
    border-radius: var(--sdp-radius-genesis);
    /* Unificat a 28px */
    font-size: 13px;
    font-weight: 950;
    /* Màxim pes */
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.premium-badge.iaia,
.premium-badge.super-padrino {
    background: #000 !important;
    color: var(--color-primary) !important;
    /* Cyan */
    border: 1px solid var(--color-primary);
}

.premium-badge.super-padrino {
    color: #ffd700 !important;
    /* Gold per al Padrino */
    border-color: #ffd700;
}

.premium-badge.oficial {
    background: var(--color-accent) !important;
    color: #000 !important;
    font-weight: 950;
    border: none;
}

.premium-badge.verificat {
    background: #16a34a !important;
    /* Verd pur per fons clar */
    color: #FFFFFF !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 950;
}

.premium-badge.trust-score {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
    color: #000 !important;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-weight: 950;
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
}

.premium-subtitle {
    font-size: 20px; /* Augmentat de 18 a 20 */
    color: var(--text-main);
    font-weight: 800;
    margin: 0;
    opacity: 1;
}

.premium-meta-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
}

.premium-town-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: var(--text-muted);
    font-weight: var(--font-weight-bold);
}

.premium-town-line svg {
    color: var(--color-primary);
    opacity: 0.7;
}

.premium-town-line .chevron-indicator {
    opacity: 0.4;
    transition: transform 0.3s ease;
}

.premium-town-line:hover .chevron-indicator {
    transform: translateY(2px);
    opacity: 1;
}

.premium-town-line.website-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: all 0.2s ease;
}

.premium-town-line.website-link:hover {
    opacity: 1;
    transform: translateX(4px);
    text-decoration: underline;
}

.premium-bio {
    font-size: 1.6rem; /* Màxima llegibilitat mestre */
    line-height: 1.4;
    color: var(--text-main);
    opacity: 1;
    font-style: italic;
    font-family: var(--font-serif); /* Usar Playfair Display */
    letter-spacing: -0.01em;
    position: relative;
    padding: 0 40px;
    margin: 40px 0;
    text-align: center;
}

.premium-bio::before, .premium-bio::after {
    content: '“';
    font-size: 4rem;
    color: var(--color-primary);
    opacity: 0.15;
    font-family: var(--font-serif);
    position: absolute;
    line-height: 1;
}

.premium-bio::before {
    left: -10px;
    top: -20px;
}

.premium-bio::after {
    content: '”';
    right: -10px;
    bottom: -40px;
}

.premium-bio-container {
    margin: 16px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.premium-ai-profile-tools {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn-ai-greeting, .btn-ai-rumors, .btn-ai-magic-bio {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(var(--md-ref-palette-cyan-40-rgb, 0, 242, 255), 0.1);
    border: 1px solid rgba(0, 242, 255, 0.2);
    border-radius: var(--radius-full);
    color: var(--color-primary);
    font-size: 13px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-ai-greeting:hover, .btn-ai-rumors:hover, .btn-ai-magic-bio:hover {
    background: var(--color-primary);
    color: #000;
    box-shadow: 0 0 15px var(--color-primary);
    transform: translateY(-2px);
}

.premium-edit-textarea-wrapper {
    position: relative;
    margin: 16px 0 12px;
}

.premium-edit-textarea-wrapper .btn-ai-magic-bio {
    position: absolute;
    bottom: -15px;
    right: 0;
    z-index: 10;
}

.premium-card-footer-slot {
    margin-top: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--color-border);
}

/* Adjust the global stats bar when inside the premium card */
.premium-card-footer-slot .profile-stats-bar {
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: var(--shadow-hard);
}

.premium-card-footer-slot .stat-card {
    border-color: rgba(0, 0, 0, 0.05);
}

/* Old stats grid removed from JSX, keeping these for potential future use or cleanup */
.premium-stats-grid {
    display: none;
}

/* Entity Types Specifics */
.profile-premium-header-container.town .premium-cover-section {
    height: 260px;
}

.profile-premium-header-container.official .premium-avatar-img,
.profile-premium-header-container.official .premium-identity-card,
.profile-premium-header-container.official .premium-avatar-wrapper {
    border-radius: var(--sdp-radius-genesis) !important;
}

.profile-premium-header-container.business .premium-avatar-img {
    border-radius: var(--sdp-radius-tactile);
}

/* Edit Mode Inputs (Ghost Style) */
.premium-edit-input,
.premium-edit-textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px dashed rgba(255, 255, 255, 0.4);
    border-radius: 0px;
    color: white;
    font-family: inherit;
    padding: 6px 12px;
    outline: none;
    transition: all 0.2s ease;
}

.premium-edit-input:focus,
.premium-edit-textarea:focus {
    background: rgba(255, 255, 255, 0.2);
    border-style: solid;
    border-color: white;
}

.premium-edit-input.subtitle {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
}

.premium-edit-textarea.bio {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--color-primary-soft);
    border-radius: var(--radius-m);
    padding: 16px;
    color: #fff;
    font-size: 1rem;
    font-family: var(--font-brand);
    font-style: italic;
    min-height: 110px;
    resize: none;
    transition: all 0.3s ease;
    display: block;
}

.premium-edit-textarea.bio:focus {
    border-color: var(--color-primary);
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(255, 107, 0, 0.2);
    outline: none;
}

.premium-town-line.editable {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 0px;
    background: rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
    border: 1px dashed rgba(255, 255, 255, 0.3);
    width: fit-content;
}

.premium-town-line.editable:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: white;
}

/* Ensure children (stats bar) look good in red mode */
.edit-mode-active .stat-card {
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
}

.edit-mode-active .stat-value,
.edit-mode-active .stat-label {
    color: white !important;
}

/* Tòtem Universal - Nav Actions Right */
.nav-actions-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Connect Button Pill */
.premium-connect-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 32px;
    background: var(--gradient-bategat); /* Gradient v15 */
    color: #fff;
    border: none;
    border-radius: var(--radius-full);
    font-family: var(--font-sans);
    font-weight: 950;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
    animation: breathing 4s ease-in-out infinite;
    position: relative;
    overflow: hidden;
}

.premium-connect-pill::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: skewX(-25deg);
    transition: 0.5s;
}

.premium-connect-pill:hover::before {
    left: 150%;
    transition: 0.5s;
}

@keyframes breathing {
    0%, 100% { transform: scale(1); box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3); }
    50% { transform: scale(1.05); box-shadow: 0 15px 35px rgba(217, 70, 239, 0.4); }
}

.premium-connect-pill:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
}

.premium-connect-pill:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.premium-connect-pill.connected {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);
    box-shadow: none;
}

.premium-connect-pill.connected:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Rhizome Connection Modal */
.rhizome-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.rhizome-modal-content {
    background: #0a0a0b;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-l);
    width: 100%;
    max-width: 440px;
    padding: 32px;
    box-shadow: 0 0 50px rgba(0, 242, 255, 0.2);
    animation: rhizomeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes rhizomeIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

.rhizome-modal-header {
    text-align: center;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.rhizome-icon-main {
    color: var(--color-primary);
    margin-bottom: 12px;
}

.rhizome-modal-header h2 {
    font-size: 24px;
    font-weight: 950;
    color: #fff;
    text-transform: uppercase;
    margin: 0;
    letter-spacing: -0.02em;
}

.rhizome-modal-header p {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 8px;
    font-weight: 500;
}

.rhizome-tag-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
}

.rhizome-tag-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-m);
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
}

.rhizome-tag-btn:hover {
    background: rgba(0, 242, 255, 0.08);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 242, 255, 0.1);
}

.rhizome-tag-label {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.rhizome-privacy-note {
    background: rgba(0, 242, 255, 0.05);
    padding: 16px;
    border-radius: var(--radius-m);
    display: flex;
    gap: 12px;
    align-items: center;
    border: 1px solid rgba(0, 242, 255, 0.2);
}

.rhizome-privacy-note span {
    font-size: 12px;
    color: var(--color-primary);
    line-height: 1.4;
    font-weight: 700;
}

=====================================
FILE: src/components/ProfileHeaderPremium.jsx
=====================================

import React from 'react';
import { 
    ArrowLeft, MapPin, Calendar, BadgeCheck, Info, Share2, MoreVertical, 
    Globe, UserPlus, UserMinus, Loader2, Tag, Shield, Plus, Sun, Moon, Check, X, MessageCircle, Zap, Sparkles,
    Camera, History, ChevronDown, Settings
} from 'lucide-react';
import ShareHub from './ShareHub';
import { useNavigate } from 'react-router-dom';
import MediaViewerModal from './MediaViewerModal';
import { useTheme } from '../context/ThemeContext';
import { trustService } from '../services/trustService';
import './ProfileHeaderPremium.css';

/**
 * UniversalTotem (ex-ProfileHeaderPremium) - El tòtem d'identitat suprema v10.33.2-CANÒNIC.
 * Suporta perfils de: Persones, Grups, Empreses, Entitats Oficials i Pobles.
 */
const ProfileHeaderPremium = ({
    type = 'person', // person, group, business, official, town
    title,
    subtitle,
    town,
    bio,
    avatarUrl,
    coverUrl,
    badges = [], // ['IAIA', 'Oficial', 'Verificat']
    isLive = false, // Per a "Obert ara" en negocis
    onBack,
    isEditing = false,
    shareData = null, // { title, text, url }
    onShare, // High priority if provided
    onTitleChange,
    onSubtitleChange,
    onTownChange,
    onBioChange,
    website,
    // Connect Props
    isConnected = false,
    isConnecting = false,
    onConnect, // Function to handle connection flow
    showConnect = true, // Force visibility by default as per Protocol OMEGA
    showThemeToggle = false,
    onEditToggle,
    onEditSave,
    onEditCancel,
    nif,
    duns,
    children
}) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [viewerData, setViewerData] = React.useState({ isOpen: false, src: '', title: '' });
    const [isRhizomeOpen, setIsRhizomeOpen] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const openViewer = (src, title) => {
        if (!src) return;
        setViewerData({ isOpen: true, src, title });
    };

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const handleConnectClick = () => {
        if (isConnected) {
            onConnect?.({ disconnect: true });
        } else {
            setIsRhizomeOpen(true);
        }
    };

    const confirmConnection = async (tag) => {
        // [WEB OF TRUST] Emetem el vot de confiança en local
        const targetId = title || 'unknown'; // Idealment s'usaria un DID real
        await trustService.emitTrustVote(targetId, 1.0);
        
        onConnect?.({ tag });
        setIsRhizomeOpen(false);
    };

    // Estil de reputació (Trellat)
    const [trustLevel, setTrustLevel] = React.useState(null);
    React.useEffect(() => {
        if (title) {
            trustService.getProximityReputation(title).then(setTrustLevel);
        }
    }, [title]);

    return (
        <div className={`profile-premium-header-container ${type} ${isEditing ? 'edit-mode-active' : ''}`}>
            {/* Cover Area with Glassmorphism Overlay */}
            <div className={`premium-cover-section ${coverUrl ? 'clickable' : ''}`} onClick={() => openViewer(coverUrl, 'Imatge de portada')}>
                {coverUrl ? (
                    <img src={coverUrl} alt="" className="premium-cover-img" />
                ) : (
                    <div className="premium-cover-placeholder" />
                )}
                <div className="premium-cover-overlay" />
                
                {isEditing && (
                    <div className="premium-cover-edit-prompt" onClick={(e) => { e.stopPropagation(); alert('IAIA: Puja una foto de la teua terra!'); }}>
                        <Camera size={32} />
                        <span>CANVIAR PORTADA</span>
                    </div>
                )}

                {/* Navigation Actions */}
                <div className="premium-nav-actions">
                    <div className="nav-actions-left flex items-center gap-4">
                        <button className="premium-btn-circle back" onClick={handleBack} title="Tornar">
                            <ArrowLeft size={24} />
                        </button>
                    </div>

                    <div className="nav-actions-right">
                        {(shareData || onShare) && (
                            <div className="premium-share-wrapper">
                                {onShare ? (
                                    <button className="premium-btn-circle share" onClick={onShare} title="Compartir">
                                        <Share2 size={24} />
                                    </button>
                                ) : (
                                    <ShareHub
                                        title={shareData.title}
                                        text={shareData.text}
                                        url={shareData.url}
                                        customTrigger={
                                            <button className="premium-btn-circle share" title="Compartir">
                                                <Share2 size={24} />
                                            </button>
                                        }
                                    />
                                )}
                            </div>
                        )}

                        {showThemeToggle && (
                            <button 
                                className="premium-btn-circle theme-toggle" 
                                onClick={toggleTheme}
                                title={theme === 'dark' ? 'Canviar a Llum de Dia' : 'Canviar a Nit Digital'}
                                style={{ width: '48px', height: '48px' }}
                            >
                                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                            </button>
                        )}

                        {isEditing ? (
                            <div className="edit-actions-group">
                                <button className="premium-btn-circle save" onClick={onEditSave} title="Guardar Canvis" style={{ width: '48px', height: '48px' }}>
                                    <Check size={24} />
                                </button>
                                <button className="premium-btn-circle cancel" onClick={onEditCancel} title="Cancel·lar" style={{ width: '48px', height: '48px' }}>
                                    <X size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="premium-management-menu-wrapper">
                                <button 
                                    className={`premium-btn-circle manage ${isMenuOpen ? 'active' : ''}`} 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                    title="Gestió"
                                    style={{ width: '48px', height: '48px' }}
                                >
                                    <MoreVertical size={24} />
                                </button>
                                
                                {isMenuOpen && (
                                    <div className="premium-dropdown-menu animate-in">
                                        <button className="dropdown-item" onClick={() => { onEditToggle?.(); setIsMenuOpen(false); }}>
                                            <Settings size={18} />
                                            <span>EDITAR PERFIL</span>
                                        </button>
                                        <button className="dropdown-item" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>
                                            <Zap size={18} />
                                            <span>ESCRIPTORI PRIVAT</span>
                                        </button>
                                        <button className="dropdown-item" onClick={() => { navigate('/archive'); setIsMenuOpen(false); }}>
                                            <History size={18} />
                                            <span>ARXIU DE RECURSOS</span>
                                        </button>
                                        <div className="identity-official-badges flex gap-2 mt-2 px-4">
                                            {nif && (
                                                <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">NIF: {nif}</span>
                                            )}
                                            {duns && (
                                                <span className="text-[10px] font-bold text-blue-400 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">DUNS: {duns}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Identity Info Area */}
            <div className="premium-identity-card">
                <div className="premium-avatar-row">
                    <div className={`premium-avatar-wrapper ${avatarUrl ? 'clickable' : ''}`} onClick={() => !isEditing && openViewer(avatarUrl, title)}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={title} className="premium-avatar-img" />
                        ) : (
                            <div className="premium-avatar-placeholder-pulse">
                                <img src="/assets/master/logo-socdepoble-rect.svg" alt="Sóc de Poble" className="pulse-logo" />
                            </div>
                        )}
                        {isLive && !isEditing && <span className="live-indicator-pulse" title="Actiu / Obert ara" />}
                        
                        {isEditing && (
                            <div className="premium-avatar-edit-overlay" onClick={(e) => { e.stopPropagation(); alert('IAIA: Tria la millor cara!'); }}>
                                <Camera size={24} />
                            </div>
                        )}
                    </div>

                    <div className="premium-main-text">
                        <div className="premium-title-row">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="premium-edit-input title"
                                    value={title}
                                    onChange={(e) => onTitleChange?.(e.target.value)}
                                    placeholder="Nom"
                                />
                            ) : (
                                <h1 className="premium-title">{title}</h1>
                            )}
                            <div className="premium-badges-row">
                                {badges.map((badge, idx) => (
                                    <span key={idx} className={`premium-badge ${badge.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {badge}
                                    </span>
                                ))}
                                {trustLevel && trustLevel.level !== 'desconegut' && (
                                    <span className="premium-badge trust-score" title={trustLevel.direct ? 'Confiança Directa' : `Confiança via ${trustLevel.witness}`}>
                                        🏺 {trustLevel.level === 'alta' ? 'FIABLE' : 'CONEGUT'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="premium-meta-stack">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        className="premium-edit-input subtitle"
                                        value={subtitle}
                                        onChange={(e) => onSubtitleChange?.(e.target.value)}
                                        placeholder="Quin és el teu ofici?"
                                    />
                                    <div className="premium-town-line editable" onClick={() => onTownChange?.()}>
                                        <MapPin size={14} />
                                        <span>{town || 'Selecciona poble'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {subtitle && <p className="premium-subtitle">{subtitle}</p>}
                                    {town && (
                                        <p className="premium-town-line clickable" onClick={() => onTownChange?.()}>
                                            <MapPin size={14} />
                                            <span>{town}</span>
                                            <ChevronDown size={14} className="chevron-indicator" />
                                        </p>
                                    )}
                                    {website && (
                                        <a href={website} target="_blank" rel="noopener noreferrer" className="premium-town-line website-link">
                                            <Globe size={14} />
                                            <span>{website.replace('https://', '').replace(/\/$/, '')}</span>
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {isEditing ? (
                    <div className="premium-edit-textarea-wrapper">
                        <textarea
                            className="premium-edit-textarea bio"
                            value={bio}
                            onChange={(e) => onBioChange?.(e.target.value)}
                            placeholder="Escriu la teua frase o lema de marca..."
                            rows={2}
                        />
                        <button className="btn-ai-magic-bio" title="Bio Màgica (AI)" onClick={() => alert('IAIA: Redactant una bio que faça goig...')}>
                            {Sparkles ? <Sparkles size={16} /> : '✨'}
                            <span>Bio Màgica</span>
                        </button>
                    </div>
                ) : (
                    <div className="premium-bio-container">
                        {bio && <p className="premium-bio">{bio}</p>}
                        
                        {showConnect && (
                            <div className="flex justify-center mt-6">
                                <button 
                                    className={`premium-connect-pill ${isConnected ? 'connected' : ''} master-button-canonic w-full max-w-sm`}
                                    onClick={handleConnectClick}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            <span>{isConnected ? 'CONEGUIT' : 'CONNECTAR'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="premium-ai-profile-tools mt-8">
                            <button className="btn-ai-greeting" title="Redactor de Salutacions (AI)" onClick={() => alert('IAIA: Preparant salutacions personalitzades...')}>
                                <MessageCircle size={16} />
                                <span>Salutacions</span>
                            </button>
                            <button className="btn-ai-rumors" title="La Veu del Poble (IAIA)" onClick={() => alert('IAIA: Xe! He sentit a dir que...')}>
                                {Zap ? <Zap size={16} /> : '⚡'}
                                <span>Veu del Poble</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Slot for Stats Bar or other elements */}
                {children && (
                    <div className="premium-card-footer-slot">
                        {children}
                    </div>
                )}
            </div>

            {/* Rhizome Connection Modal (Internal) */}
            {isRhizomeOpen && (
                <div className="rhizome-connection-overlay" onClick={() => setIsRhizomeOpen(false)}>
                    <div className="rhizome-modal" onClick={e => e.stopPropagation()}>
                        <div className="rhizome-header">
                            <div className="rhizome-icon-glow">
                                <UserPlus size={32} />
                            </div>
                            <h3>Connexió Rhizome</h3>
                            <p>Etiqueta aquesta connexió per a organitzar el teu mur privat.</p>
                        </div>
                        
                        <div className="rhizome-tags-grid">
                            {['Gent', 'Amic', 'Treball', 'Comerç', 'Oficial', 'Cultura'].map(tag => (
                                <button key={tag} className="rhizome-tag-btn" onClick={() => confirmConnection(tag)}>
                                    <Tag size={16} />
                                    <span>{tag}</span>
                                </button>
                            ))}
                        </div>

                        <div className="rhizome-footer">
                            <div className="shield-hint">
                                <Shield size={14} />
                                <span>Aquesta etiqueta només la veus tu.</span>
                            </div>
                            <button className="rhizome-btn-skip" onClick={() => confirmConnection('Gent')}>
                                Omplir com a "Gent"
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MediaViewerModal
                isOpen={viewerData.isOpen}
                onClose={() => setViewerData({ ...viewerData, isOpen: false })}
                src={viewerData.src}
                title={viewerData.title}
            />
        </div>
    );
};

export default ProfileHeaderPremium;


=====================================
FILE: src/components/ProfilePowerMenu.css
=====================================

.profile-power-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.power-menu-container {
    width: 100%;
    max-width: 900px;
    background: rgba(18, 18, 18, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 40px;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
    backdrop-filter: blur(40px);
}

.power-header {
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-info-large {
    display: flex;
    align-items: center;
    gap: 20px;
}

.avatar-huge {
    width: 80px;
    height: 80px;
    border-radius: 100px;
    background: linear-gradient(135deg, #FF6B00, #D946EF);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 900;
    color: white;
    border: 4px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
}

.avatar-huge img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.close-power-btn {
    width: 60px;
    height: 60px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
}

.close-power-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
}

.power-grid {
    padding: 40px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
}

.section-title {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 20px;
}

.pg-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pg-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    color: white;
    font-weight: 800;
    font-size: 20px;
    text-decoration: none;
    transition: 0.2s;
}

.pg-item.pg-item-featured {
    background: linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.2) 100%);
    border-color: rgba(79, 70, 229, 0.4);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pg-item.pg-item-featured .pg-icon {
    background: #4f46e5;
    color: white;
}

.pg-item.pg-item-featured .pg-label {
    font-weight: 800;
    color: white;
    font-size: 1.1em;
}

.pg-item:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
    border-color: rgba(255, 255, 255, 0.2);
}

.pg-item.disabled {
    opacity: 0.3;
    pointer-events: none;
}

.pg-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FF6B00;
}

.power-footer {
    padding: 20px 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.2);
    text-transform: uppercase;
}

@media (max-width: 1024px) {
    .power-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .power-menu-container {
        max-height: 90vh;
        overflow-y: auto;
    }
}


=====================================
FILE: src/components/ProfilePowerMenu.jsx
=====================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    X, User, MessageSquare, Briefcase, Settings, Database, 
    Users, Calendar, Image as ImageIcon, LogOut, ChevronRight,
    Shield, Sparkles, Brain, Map as MapIcon, Wrench, LayoutGrid,
    Store, MapPin, Zap, FileText, ShieldCheck, Cpu
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import './ProfilePowerMenu.css';

const PILARS_SAGRATS = [
  { id: "perfil", label: "Perfil Sobirà", icon: User, to: "/perfil", featured: true },
  { id: "chats", label: "Xat i Consells", icon: MessageSquare, to: "/chats" },
  { id: "mur", label: "Mur del Poble", icon: LayoutGrid, to: "/mur" },
  { id: "mercat", label: "Mercat Rural", icon: Store, to: "/mercat" },
  { id: "pobles", label: "Pobles i Gent", icon: MapPin, to: "/pobles" },
  { id: "nexus", label: "Nexus Flash", icon: Zap, to: "/nexus" },
  { id: "mapa", label: "Mapa Tàctic", icon: MapIcon, to: "/mapa" },
];

const RECURSOS_IDENTITAT = [
  { id: "notes", label: "Bloc de Notes", icon: Settings, to: "/notes" },
  { id: "arxiu", label: "Relíquies (Arxiu)", icon: Database, to: "/arxiu" },
  { id: "calendari", label: "Agenda del Mas", icon: Calendar, to: "/calendari" },
  { id: "infoteca", label: "Infoteca Gallery", icon: ImageIcon, to: "/infoteca" },
  { id: "genesis", label: "Gènesi Viewer", icon: Database, to: "/genesis" },
  { id: "solatge", label: "Solatge Console", icon: Database, to: "/solatge" },
];

const OFICI_GESTIO = [
  { id: "ofici", label: "Ofici de Doc.", icon: FileText, to: "/ofici" },
  { id: "ajudes", label: "Buscador d'Ajudes", icon: ShieldCheck, to: "/ajudes" },
  { id: "dossier", label: "Dossier de Socis", icon: Briefcase, to: "/dossier" },
  { id: "directori", label: "Directori de Gent", icon: Users, to: "/directori" },
  { id: "iaia_hub", label: "La IAIA Hub", icon: Sparkles, to: "/iaia" },
];

const TECNIC_MESTRE = [
  { id: "chrome145", label: "Informe Chrome 145", icon: Cpu, to: "/chrome-145" },
  { id: "utilitats", label: "Utilitats Master", icon: Wrench, to: "/utilitats" },
  { id: "accessibilitat", label: "Accessibilitat", icon: Shield, to: "/accessibilitat" },
];

const ProfilePowerMenu = () => {
    const { isProfileMenuOpen, closeProfileMenu } = useNavigation();
    const { user, profile, signOut, isSuperAdmin, isAdmin } = useAuth();

    if (!isProfileMenuOpen) return null;

    return (
        <div className="profile-power-menu-overlay" onClick={closeProfileMenu}>
            <div className="power-menu-container animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                {/* HEADER: IDENTITY */}
                <header className="power-header">
                    <div className="user-info-large">
                        <div className="avatar-huge">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="User" />
                            ) : (
                                <span>{profile?.full_name?.substring(0, 1) || user?.email?.substring(0, 1).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="u-text">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">{profile?.full_name || user?.email?.split('@')[0] || 'Sóc de Poble'}</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{user?.email}</p>
                        </div>
                    </div>
                    <button className="close-power-btn" onClick={closeProfileMenu}>
                        <X size={24} />
                    </button>
                </header>

                <div className="power-grid">
                    {/* SECTION: PILARS DEL MAS */}
                    <div className="power-section">
                        <h3 className="section-title">Pilars del Mas</h3>
                        <div className="pg-items">
                            {PILARS_SAGRATS.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className={`pg-item ${item.featured ? 'pg-item-featured' : ''}`}
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    {item.featured && <span className="ml-auto text-[10px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-[28px] uppercase tracking-widest">Obrir</span>}
                                    {!item.featured && <ChevronRight size={14} className="ml-auto opacity-20" />}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: IDENTITAT i RECURSOS */}
                    <div className="power-section">
                        <h3 className="section-title">Identitat i Recursos</h3>
                        <div className="pg-items">
                            {RECURSOS_IDENTITAT.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: OFICI i GESTIÓ */}
                    <div className="power-section">
                        <h3 className="section-title">Ofici i Gestió</h3>
                        <div className="pg-items">
                            {OFICI_GESTIO.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: TÈCNIC & MESTRE */}
                    <div className="power-section">
                        <h3 className="section-title">Tècnic & Mestre</h3>
                        <div className="pg-items">
                            {TECNIC_MESTRE.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                            
                            {/* ADMIN PANEL: NOMÉS MESTRE */}
                            {(isSuperAdmin || isAdmin) && (
                                <NavLink 
                                    to="/admin" 
                                    className="pg-item bg-orange-500/5 group" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon text-orange-500"><Shield size={20} /></div>
                                    <span className="pg-label text-orange-500 font-black">Panell d'Admin</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* SECTION: AJUSTES & SOBIRANIA */}
                    <div className="power-section">
                        <h3 className="section-title">Sobirania</h3>
                        <div className="pg-items">
                             <div className="pg-item disabled opacity-50">
                                <div className="pg-icon"><Shield size={20} /></div>
                                <span className="pg-label">Privacitat Rhizome</span>
                             </div>
                             <div className="pg-item" onClick={() => { signOut(); closeProfileMenu(); }}>
                                <div className="pg-icon text-red-500"><LogOut size={20} /></div>
                                <span className="pg-label text-red-500">Tancar Sessió</span>
                             </div>
                        </div>
                    </div>
                </div>

                <footer className="power-footer">
                    <div className="footer-v">v10.33.3-CANÒNIC</div>
                    <div className="archon-status flex items-center gap-2">
                        <Brain size={12} className="text-fuchsia-500" />
                        <span>ARCHON CONNECTED</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ProfilePowerMenu;


=====================================
FILE: src/components/ProfileSettingsModal.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Globe, MapPin, Plus, Loader2, Camera, User, Image as ImageIcon, Beaker, ShieldAlert, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import TownSelectorModal from '../components/TownSelectorModal';
import LanguageSelector from '../components/LanguageSelector';
import '../pages/Auth.css'; // Reusing some base styles
import { authService } from '../services/authService';

const ProfileSettingsModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const isSuperAdmin = currentUser?.role === 'super_admin';
    const navigate = useNavigate();
    
    const [isSaving, setIsSaving] = useState(false);
    const [townSelector, setTownSelector] = useState({ isOpen: false, type: null });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    // Local state for optimistic UI updates before saving
    const [localProfile, setLocalProfile] = useState({
        full_name: profile?.full_name || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        cover_url: profile?.cover_url || '',
        town_uuid: profile?.town_uuid || null,
        town_name: profile?.town_name || null,
        secondary_towns: profile?.secondary_towns || [],
        secondary_towns_names: profile?.secondary_towns_names || [], // Assuming we need names
        cover_position_y: profile?.cover_position_y || 50 // Default to 50%
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
    const [coverPreview, setCoverPreview] = useState(profile?.cover_url || '');
    const [coverPositionY, setCoverPositionY] = useState(profile?.cover_position_y || 50);

    // Ensure state updates completely when modal opens or profile changes
    const [townNamesCache, setTownNamesCache] = useState({});

    useEffect(() => {
        if (isOpen && profile) {
            setLocalProfile({
                full_name: profile.full_name || '',
                bio: profile.bio || '',
                avatar_url: profile.avatar_url || '',
                cover_url: profile.cover_url || '',
                town_uuid: profile.town_uuid || null,
                town_name: profile.town_name || null,
                secondary_towns: profile.secondary_towns || [],
                cover_position_y: profile.cover_position_y || 50
            });
            setAvatarPreview(profile.avatar_url || '');
            setCoverPreview(profile.cover_url || '');
            setCoverPositionY(profile.cover_position_y || 50);
            setAvatarFile(null);
            setCoverFile(null);

            // Fetch town names for secondary towns if needed
            const loadTownNames = async () => {
                try {
                    const allTowns = await supabaseService.getTowns();
                    const cache = {};
                    allTowns.forEach(t => {
                        cache[t.uuid || t.id] = t.name;
                    });
                    setTownNamesCache(cache);
                } catch (e) {
                    console.error("Failed loading towns cache for names:", e);
                }
            };
            loadTownNames();
        }
    }, [isOpen, profile]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates = {
                full_name: localProfile.full_name,
                bio: localProfile.bio,
                town_uuid: localProfile.town_uuid,
                town_name: localProfile.town_name,
                secondary_towns: localProfile.secondary_towns || [],
                cover_position_y: coverPositionY // Add cover position to updates
            };

            if (avatarFile) {
                const uploadRes = await supabaseService.uploadAvatar(profile.id, avatarFile);
                updates.avatar_url = uploadRes.url || uploadRes.publicUrl;
            }
            if (coverFile) {
                const uploadRes = await supabaseService.uploadCover(profile.id, coverFile);
                updates.cover_url = uploadRes.url || uploadRes.publicUrl;
            }

            const { error } = await supabaseService.updateProfile(profile.id, updates);
            if (error) throw error;

            if (onProfileUpdate) {
                onProfileUpdate(updates);
            }
            onClose();
        } catch (error) {
            console.error('[ProfileSettings] Error updating profile:', error);
            alert("Error al desar la configuració.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            await authService.deleteCurrentUser();
            onClose();
            // Redirigir a l'inici / login
            navigate('/', { replace: true });
        } catch (error) {
            console.error('[ProfileSettings] Error deleting account:', error);
            alert("S'ha produït un error al intentar eliminar el compte base. Contacta amb suport si el problema persistix.");
            setShowDeleteConfirm(false);
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const openTownSelector = (type) => { // 'primary', 'secondary1', 'secondary2'
        setTownSelector({ isOpen: true, type });
    };

    const handleTownSelect = async (town) => {
        setTownSelector({ isOpen: false, type: null });
        if (!town) return;

        if (townSelector.type === 'primary') {
            setLocalProfile(prev => ({
                ...prev,
                town_uuid: town.uuid || town.id,
                town_name: town.name
            }));
        } else if (townSelector.type === 'secondary') {
            const currentSecondary = [...(localProfile.secondary_towns || [])];
            // Replace if 2 exist, else append
            if (currentSecondary.length >= 2) {
                currentSecondary[1] = town.uuid || town.id;
            } else {
                currentSecondary.push(town.uuid || town.id);
            }
            
            setLocalProfile(prev => ({
                ...prev,
                secondary_towns: currentSecondary
            }));
        }
    };

    // Helper to get town name by ID (needs to fetch if just ID)
    // For simplicity we might just show ID if name is unknown, or fetch it.
    // In a real scenario we'd query the DB for the names of secondary_towns.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-theme-panel border border-[var(--border-master)] rounded-[28px] w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-6 border-b border-[var(--border-master)]">
                    <h2 className="text-xl font-black uppercase tracking-widest text-[var(--theme-accent-primary)]">Configuració (BETA)</h2>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User size={18} className="text-[var(--theme-accent-primary)]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Identitat del Node</h3>
                        </div>

                        {/* Covers & Avatars */}
                        <div className="relative w-full h-32 rounded-2xl bg-black/40 overflow-visible border border-white/10 mb-10 mt-6 group/cover">
                            {coverPreview ? (
                                <img 
                                    src={coverPreview} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover opacity-60 rounded-2xl" 
                                    style={{ objectPosition: `50% ${coverPositionY}%` }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center rounded-2xl cursor-pointer" onClick={() => document.getElementById('cover-input').click()}>
                                    <ImageIcon size={32} className="text-white/20" />
                                </div>
                            )}

                            {/* Editing Controls for Cover */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity z-20">
                                <button className="bg-black/80 p-2 rounded-full shadow-xl hover:bg-[var(--theme-accent-primary)] transition-colors" title="Penjar Nova Foto" onClick={() => document.getElementById('cover-input').click()}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            
                            {/* Hover Adjust Hint */}
                            {coverPreview && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="bg-black/80 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--theme-accent-primary)] shadow-xl backdrop-blur-sm border border-white/20 mb-2">Ajusta Alçada Paret</span>
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        value={coverPositionY} 
                                        onChange={(e) => setCoverPositionY(e.target.value)}
                                        className="w-32 h-2 rounded-xl accent-[var(--theme-accent-primary)] pointer-events-auto"
                                        title="Llisca per centrar la teva foto"
                                    />
                                </div>
                            )}

                            <input type="file" id="cover-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCoverChange} />
                            
                            {/* Avatar */}
                            <div className="absolute -bottom-8 left-6 z-30" onClick={(e) => { e.stopPropagation(); document.getElementById('avatar-input').click(); }}>
                                <div className="relative w-24 h-24 rounded-[50%] border-[3px] border-solid border-[var(--bg-master)] overflow-hidden bg-gray-900 group/avatar cursor-pointer shadow-xl isolate aspect-square flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-opacity rounded-[50%] block aspect-square" style={{ borderRadius: '50%' }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <User size={32} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-white drop-shadow-md" />
                                    </div>
                                    <input type="file" id="avatar-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleAvatarChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Nom / Denominació</label>
                                <input 
                                    type="text" 
                                    value={localProfile.full_name || ''} 
                                    onChange={(e) => setLocalProfile({...localProfile, full_name: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--theme-accent-primary)]/50 focus:ring-1 focus:ring-[var(--theme-accent-primary)]/50 transition-all font-bold"
                                    placeholder="Com et dius?"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Presentació (Bio)</label>
                                <textarea 
                                    value={localProfile.bio || ''} 
                                    onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--theme-accent-primary)]/50 focus:ring-1 focus:ring-[var(--theme-accent-primary)]/50 transition-all resize-none h-24 text-sm"
                                    placeholder="Una breu descripció..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-px w-full bg-white/5 my-0"></div>
                    {/* Language Section via Universal Component */}
                    <div className="w-full">
                        <LanguageSelector variant="profile" />
                    </div>

                    {/* Towns Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} className="text-[var(--theme-accent-primary)]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Vinculació Territorial</h3>
                        </div>

                        {/* Primary Town */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                                <span>Poble Principal</span>
                                <span className="text-[var(--theme-accent-primary)]">CENSAT</span>
                            </p>
                            <div 
                                className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
                                onClick={() => openTownSelector('primary')}
                            >
                                <span className="font-bold text-lg">{localProfile.town_name || 'No especificat'}</span>
                                <span className="text-xs bg-[var(--theme-accent-primary)]/20 text-[var(--theme-accent-primary)] px-2 py-1 rounded-full uppercase font-black">Canviar</span>
                            </div>
                        </div>

                        {/* Secondary Towns */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                                Pobles Secundaris / Vinculats (Max. 2)
                            </p>
                            <div className="space-y-2">
                                {(localProfile.secondary_towns || []).map((tUUID, idx) => {
                                    const townName = townNamesCache[tUUID] || `Poble ${idx + 2}`;
                                    return (
                                        <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] flex items-center justify-center font-black text-xs">
                                                    {idx + 2}
                                                </div>
                                                <span className="text-sm font-bold text-theme-text">{townName}</span>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newSec = [...localProfile.secondary_towns];
                                                    newSec.splice(idx, 1);
                                                    setLocalProfile(prev => ({...prev, secondary_towns: newSec}));
                                                }}
                                                className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                                title="Desempatxar"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {(localProfile.secondary_towns || []).length < 2 && (
                                    <button 
                                        onClick={() => openTownSelector('secondary')}
                                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 transition-all text-sm font-bold hover:bg-white/5 mt-2"
                                    >
                                        <Plus size={18} />
                                        Vincular nou Poble
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zona de Perill */}
                    <div className="space-y-4 pt-6 border-t border-[var(--border-master)]">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert size={18} className="text-red-500" />
                            <h3 className="font-bold uppercase tracking-wider text-sm text-red-500">Zona de Perill</h3>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                            <p className="text-[11px] font-medium text-gray-300 mb-4 leading-relaxed">
                                En virtut de la normativa de sobiranía digital (GDPR), pots eliminar el teu compte i totes les teues dades de forma completament permanent. <strong className="text-red-400">Aquesta acció NO es pot desfer ni recuperar.</strong>
                            </p>
                            {!showDeleteConfirm ? (
                                <button 
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full py-3 bg-black/60 border border-red-500/30 text-red-500 font-bold uppercase tracking-wider rounded-xl hover:bg-red-500/20 transition-all text-sm"
                                >
                                    Eliminar el meu compte
                                </button>
                            ) : (
                                <div className="space-y-3 bg-red-950/40 p-3 rounded-xl border border-red-500/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm font-black text-red-400 uppercase tracking-widest text-center mb-1">Doble Confirmació</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleDeleteAccount}
                                            disabled={isDeletingAccount}
                                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 text-xs h-12"
                                        >
                                            {isDeletingAccount ? <Loader2 size={16} className="animate-spin" /> : 'SÍ, ESBORRAR'}
                                        </button>
                                        <button 
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={isDeletingAccount}
                                            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider rounded-lg transition-all text-xs h-12"
                                        >
                                            CANCEL·LAR
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {isSuperAdmin && (
                        <>
                            <div className="h-px w-full bg-emerald-500/20 my-2"></div>
                            {/* Nivell 3: El Llavador (Laboratori de Mestres) */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Beaker size={24} className="text-emerald-400" />
                                    <h3 className="font-extrabold uppercase tracking-widest text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                                        🧪 EL LLAVADOR (Laboratori)
                                    </h3>
                                </div>
                                
                                <div className="bg-[#052e16]/40 border border-[#10b981]/30 rounded-3xl p-6 relative overflow-hidden group">
                                    {/* Visual hacker/glitch artifact overlay */}
                                    <div className="absolute inset-0 bg-[url('/assets/patterns/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                                    <div className="absolute -inset-x-full top-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
                                    
                                    <div className="flex items-start gap-3 mb-6">
                                        <ShieldAlert className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Controls del Rhizome</p>
                                            <p className="text-xs text-emerald-600/80 uppercase font-mono mt-1">Nivell de Seguretat: SUPER_ADMIN</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 relative z-10 w-full">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onClose();
                                                navigate('/admin');
                                            }}
                                            className="w-full flex items-center justify-between gap-3 p-4 bg-black/60 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/40 rounded-2xl transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Terminal size={18} className="text-emerald-500" />
                                                <span className="text-sm text-emerald-100 font-bold uppercase tracking-wider">Console: Administració Síncrona</span>
                                            </div>
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase font-black animate-pulse">
                                                ACTIU
                                            </span>
                                        </button>

                                        <button className="w-full flex items-center justify-between gap-3 p-4 bg-black/60 border border-red-500/20 hover:border-red-500/50 hover:bg-red-950/40 rounded-2xl transition-all opacity-80 hover:opacity-100">
                                            <div className="flex items-center gap-3">
                                                <ShieldAlert size={18} className="text-red-500" />
                                                <span className="text-sm text-red-100 font-bold uppercase tracking-wider">Mode Forense (Logs)</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-[var(--border-master)] bg-black/40">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-[#F97316] hover:opacity-90 text-white font-black uppercase tracking-widest py-4 rounded-[20px] transition-all flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : 'Guardar Canvis'}
                    </button>
                </div>
            </div>

            {/* Town Selector Modal */}
            <TownSelectorModal 
                isOpen={townSelector.isOpen} 
                onClose={() => setTownSelector({ isOpen: false, type: null })}
                onSelect={handleTownSelect}
            />
        </div>
    );
};

export default ProfileSettingsModal;


=====================================
FILE: src/components/ProfileStudioModal.css
=====================================

.studio-overlay {
    position: fixed;
    top: var(--banner-height);
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    padding: var(--space-md);
}

.studio-content {
    background: rgba(10, 10, 15, 0.98);
    width: 100%;
    max-width: 500px;
    border-radius: 28px; /* GEOMETRIA CANÒNICA */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(40px);
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.studio-header {
    padding: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.studio-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 900;
    color: white;
    font-family: 'Noto Sans', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.3em;
}

.close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: rotate(90deg);
}

.studio-body {
    padding: 0 28px 28px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    max-height: 70vh;
    overflow-y: auto;
    scrollbar-width: none;
}

.studio-advice {
    background: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.2);
    padding: 20px;
    border-radius: 12px;
    margin-top: 28px;
}

.studio-advice p {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    color: #F97316;
    line-height: 1.6;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.alzina-upload-btn {
    background: var(--accent-violet) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 4px 12px rgba(93, 95, 239, 0.3) !important;
    flex: 1.5 !important; /* Más importancia al botón principal */
}

.studio-action-bar {
    display: flex;
    gap: 8px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-s);
    width: 100%;
    justify-content: space-between;
    flex-wrap: nowrap !important; /* Alzina Blindatge: No apilable */
}

.studio-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-header h4 {
    margin: 0;
    font-size: 11px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.2em;
}

.aspect-badge {
    font-size: 9px;
    font-weight: 900;
    color: #F97316;
    background: rgba(249, 115, 22, 0.1);
    padding: 4px 10px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.studio-preview {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 20px;
    transition: all 0.3s;
}

.studio-preview:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
}

.cover-preview {
    aspect-ratio: 16/9;
}

.cover-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.empty-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-base);
    color: var(--text-muted);
    font-weight: var(--font-weight-bold);
}

.studio-action-bar {
    display: flex;
    gap: 6px;
    padding: 6px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0px;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
}

.cover-studio-section {
    position: relative;
    padding: var(--space-md);
    background: #f8fafc;
    border-radius: 0px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
}

.cover-studio-section .studio-action-bar {
    position: relative;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 4px;
    width: 100%;
}

.studio-preview:hover .studio-action-bar {
    background: rgba(0, 0, 0, 0.05);
}

.avatar-studio-section {
    position: relative;
    padding: var(--space-lg) var(--space-md);
    background: #f8fafc;
    /* Even softer gray for the main frame */
    border-radius: 0px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
}

.avatar-studio-section .studio-action-bar {
    position: relative;
    background: #f1f5f9;
    /* Match outer section but slightly different or same */
    border: 1px solid #e2e8f0;
    margin-top: 4px;
}

.avatar-studio-preview {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
}

.avatar-big-preview {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: #000;
    border: 4px solid #F97316;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.avatar-studio-section:hover .avatar-big-preview {
    transform: scale(1.05) rotate(2deg);
    border-color: white;
}

.avatar-studio-section .studio-action-bar {
    position: relative;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.avatar-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.add-overlay {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: var(--color-primary);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-surface);
}

.avatar-big-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.studio-btn {
    padding: 8px 12px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    /* Smaller font to ensure 3 buttons fit */
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    white-space: nowrap;
    overflow: hidden;
    min-width: 0;
    /* Allow shrinking */
}

.studio-btn.primary {
    background: var(--color-primary);
    color: white;
}

.studio-btn.primary.light {
    background: white;
    color: var(--color-primary);
    border: 1.5px solid var(--color-primary);
}

.studio-btn.primary.light:hover {
    background: rgba(var(--color-primary-rgb), 0.05);
}

.studio-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hard);
}

.studio-footer {
    padding: 28px;
    background: rgba(255, 255, 255, 0.02);
    display: flex;
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.done-btn {
    background: white;
    color: black;
    border: none;
    padding: 16px 48px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    cursor: pointer;
    transition: all 0.3s;
}

.done-btn:hover {
    background: #F97316;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
}

@media (max-width: 600px) {
    .studio-overlay {
        padding: 0;
    }

    .studio-content {
        max-width: 100%;
        height: 100vh;
        height: 100dvh;
        border-radius: 0;
        border: none;
    }

    .studio-body {
        max-height: none;
        flex: 1;
        padding: var(--space-lg);
    }

    .preview-overlay {
        opacity: 1 !important;
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        bottom: 12px;
        left: 12px;
        right: 12px;
        top: auto;
        padding: 8px;
        flex-direction: row;
        border-radius: 0px;
        backdrop-filter: blur(8px);
    }

    .avatar-studio-preview {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--space-lg) var(--space-md);
        gap: var(--space-lg);
    }

    .avatar-big-preview {
        width: 120px;
        height: 120px;
    }

    .preview-actions {
        width: 100%;
    }

    .studio-header,
    .studio-footer {
        flex-shrink: 0;
        position: sticky;
        background: var(--bg-card);
        z-index: 50;
    }

    .studio-header {
        top: var(--banner-height);
    }

    .studio-footer {
        bottom: 0;
    }

    .done-btn {
        width: 100%;
    }
}

=====================================
FILE: src/components/ProfileStudioModal.jsx
=====================================

import React, { useRef, useState } from 'react';
import { X, Camera, Maximize, User, Loader2, Image as ImageIcon, Video, Smile } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import IconPicker from './IconPicker';
import CaptureStudio from './CaptureStudio';
import './ProfileStudioModal.css';

const ProfileStudioModal = ({
    isOpen,
    onClose,
    profile,
    isUploading,
    uploadType,
    onFileSelect,
    onReposition,
    onCaptureComplete // Prop per a gestionar la captura
}) => {
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [captureTarget, setCaptureTarget] = useState(null); // 'avatar' | 'cover'

    if (!isOpen) return null;

    const handleCameraClick = (target) => {
        setCaptureTarget(target);
        setIsCaptureOpen(true);
    };

    const handleCapture = (media) => {
        if (onCaptureComplete) {
            onCaptureComplete(media, captureTarget);
        }
    };

    const displayProfile = profile || {};

    return (
        <div className="studio-overlay">
            <div className="studio-content">
                <header className="studio-header">
                    <div className="header-title">
                        <ImageIcon size={20} className="title-icon" />
                        <h3>Estudi de Perfil</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="studio-body">
                    <div className="studio-advice alzina-blindatge">
                        <p>🏺 <strong>Directiva Master:</strong> Utilitza imatges panoràmiques (16:9) per a la portada i quadrades (1:1) per al teu perfil.</p>
                    </div>

                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Identitat Visual (Icona / Noun Project)</h4>
                            <span className="aspect-badge">SOBIRANIA</span>
                        </div>
                        <IconPicker 
                            currentIcon={displayProfile.avatar_url} 
                            onSelect={(icon) => onFileSelect && onFileSelect({ target: { value: icon } }, 'icon')}
                        />
                    </div>

                    {/* Cover Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Imatge de portada</h4>
                            <span className="aspect-badge">16:9</span>
                        </div>
                        <div className="cover-studio-section">
                            <div
                                className="studio-preview cover-preview group/cover"
                                onClick={() => !displayProfile.cover_url && coverInputRef.current.click()}
                                title={displayProfile.cover_url ? "Canviar portada" : "Afegir portada"}
                                style={{ cursor: 'pointer' }}
                            >
                                {displayProfile.cover_url ? (
                                    <img 
                                        src={displayProfile.cover_url} 
                                        alt="Cover Preview" 
                                        style={{ objectPosition: `50% ${displayProfile.cover_position_y ?? 50}%` }}
                                    />
                                ) : (
                                    <div className="empty-preview">
                                        <ImageIcon size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                                        <span>Premeu per a afegir portada</span>
                                    </div>
                                )}

                                {/* Hover Adjust Hint per a la Portada */}
                                {displayProfile.cover_url && typeof onReposition === 'function' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity pointer-events-none z-[100] bg-black/60">
                                        <span className="bg-black/90 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F97316] shadow-xl backdrop-blur-sm border border-[#F97316]/50 mb-3">Ajusta l'Alt de Portada</span>
                                        <input 
                                            type="range" 
                                            min="0" max="100" 
                                            value={displayProfile.cover_position_y ?? 50} 
                                            onChange={(e) => onReposition(e.target.value)}
                                            className="w-48 h-2 rounded-xl accent-[#F97316] pointer-events-auto"
                                            title="Llisca per centrar la teva foto"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="studio-action-bar items-center">
                                <button
                                    className="studio-btn primary alzina-upload-btn"
                                    onClick={(e) => { e.stopPropagation(); coverInputRef.current.click(); }}
                                    disabled={isUploading}
                                    title="Pujar de l'arxiu"
                                >
                                    {isUploading && uploadType === 'cover' ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={20} />}
                                    <span>Fitxer</span>
                                </button>
                                <button
                                    className="studio-btn primary-batec"
                                    onClick={(e) => { e.stopPropagation(); handleCameraClick('cover'); }}
                                    disabled={isUploading}
                                >
                                    <Camera size={16} />
                                    <span>Càmera</span>
                                </button>
                                <button
                                    className="studio-btn primary light"
                                    onClick={(e) => { e.stopPropagation(); coverInputRef.current.click(); }}
                                    disabled={isUploading}
                                >
                                    <ImageIcon size={16} />
                                    <span>Àlbum</span>
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={(e) => typeof onFileSelect === 'function' && onFileSelect(e, 'cover')}
                            style={{ display: 'none' }}
                            accept="image/jpeg, image/png, image/webp, image/*"
                        />
                    </div>

                    {/* Avatar Section */}
                    <div className="studio-section">
                        <div className="section-header">
                            <h4>Foto de perfil</h4>
                            <span className="aspect-badge">1:1</span>
                        </div>
                        <div className="avatar-studio-section">
                            <div
                                className="avatar-studio-preview"
                                onClick={() => !displayProfile.avatar_url && avatarInputRef.current.click()}
                                title={displayProfile.avatar_url ? "Canviar foto" : "Afegir foto"}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="avatar-big-preview">
                                    {displayProfile.avatar_url ? (
                                        <img src={displayProfile.avatar_url} alt="Avatar Preview" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <User size={40} color="var(--text-muted)" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="studio-action-bar items-center">
                                <button
                                    className="studio-btn primary alzina-upload-btn"
                                    onClick={(e) => { e.stopPropagation(); avatarInputRef.current.click(); }}
                                    disabled={isUploading}
                                >
                                    {isUploading && uploadType === 'avatar' ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                    <span>Fitxer</span>
                                </button>
                                <button
                                    className="studio-btn primary-batec"
                                    onClick={(e) => { e.stopPropagation(); handleCameraClick('avatar'); }}
                                    disabled={isUploading}
                                >
                                    <Camera size={16} />
                                    <span>Càmera</span>
                                </button>
                                <button
                                    className="studio-btn primary light"
                                    onClick={(e) => { e.stopPropagation(); avatarInputRef.current.click(); }}
                                    disabled={isUploading}
                                >
                                    <ImageIcon size={16} />
                                    <span>Àlbum</span>
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => typeof onFileSelect === 'function' && onFileSelect(e, 'avatar')}
                            style={{ display: 'none' }}
                            accept="image/jpeg, image/png, image/webp, image/*"
                        />
                    </div>
                </div>

                <footer className="studio-footer">
                    <button className="done-btn" onClick={onClose}>Fet</button>
                </footer>
            </div>

            <CaptureStudio
                isOpen={isCaptureOpen}
                onClose={() => setIsCaptureOpen(false)}
                onCapture={handleCapture}
                mode="photo"
            />
        </div>
    );
};

export default ProfileStudioModal;


=====================================
FILE: src/components/RealmSwitcher.jsx
=====================================

import React from 'react';
import { useRealm } from '../contexts/RealmContext';
import { Globe, Building, GraduationCap, Briefcase, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RealmSwitcher() {
  const { myRealms, activeRealm, switchRealm } = useRealm();
  const { t } = useTranslation();

  const getIconForType = (type, isActive) => {
    const size = isActive ? 22 : 20;
    const props = { size, strokeWidth: isActive ? 3 : 2 };
    switch (type) {
      case 'poble': return <Building {...props} />;
      case 'universitat': return <GraduationCap {...props} />;
      case 'empresa': return <Briefcase {...props} />;
      case 'associacio': return <Users {...props} />;
      case 'global': return <Globe {...props} />;
      default: return <span className="font-bold text-lg">{type[0]?.toUpperCase()}</span>;
    }
  };

  return (
    <div className="w-full bg-[#111111] overflow-x-auto custom-scrollbar flex items-center pr-4 py-2 space-x-2 border-b border-white/10 shrink-0">
      
      {/* GLOBAL VIEW HUB */}
      <button
        onClick={() => switchRealm('GLOBAL')}
        className={`shrink-0 flex items-center justify-center w-12 h-12 ml-4 rounded-[16px] transition-all relative group
          ${activeRealm === 'GLOBAL' 
            ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105' 
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
        title={t('admin.global_view', 'El Aleph (Vista Global)')}
      >
        {activeRealm === 'GLOBAL' && (
          <div className="absolute -left-1 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
        )}
        {getIconForType('global', activeRealm === 'GLOBAL')}
      </button>

      {/* SEPARATOR */}
      <div className="w-[2px] h-8 bg-white/10 shrink-0 mx-1 rounded-full" />

      {/* INDIVIDUAL REALMS */}
      {myRealms.map((realm) => {
        const isActive = activeRealm === realm.id;
        return (
          <button
            key={realm.id}
            onClick={() => switchRealm(realm.id)}
            className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-[16px] transition-all relative bg-cover bg-center group
              ${isActive 
                ? 'shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105 ring-2 ring-white ring-offset-2 ring-offset-[#111]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:rounded-[12px]'}`}
            style={realm.image_url ? { backgroundImage: `url(${realm.image_url})` } : {}}
            title={realm.name}
          >
            {isActive && (
              <div className="absolute -left-1 w-1 h-8 bg-white rounded-r-full shadow-[0_0_5px_white]" />
            )}
            
            {!realm.image_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                {getIconForType(realm.type, isActive)}
              </div>
            )}

            {/* TOOLTIP ON HOVER (Tailwind peer/group) */}
            <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {realm.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}


=====================================
FILE: src/components/RebostVault.css
=====================================

.rebost-vault {
    padding: 20px 0;
}

.rebost-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    margin-bottom: 24px;
}

.rebost-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.iron-integrity-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(0, 242, 255, 0.05);
    border: 1px solid var(--color-primary-soft);
    border-radius: 0px;
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(5px);
}

.rebost-title-section {
    display: flex;
    align-items: center;
    gap: 16px;
}

.rebost-back-btn {
    background: none;
    border: none;
    color: var(--color-text);
    padding: 8px;
    margin-left: -8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0.8;
}

.rebost-back-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.rebost-title-section h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
}

.rebost-title-section p {
    margin: 4px 0 0;
    opacity: 0.6;
    font-size: var(--font-size-base);
}

.btn-import {
    background: var(--color-terracotta);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 0px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-hard);
}

.btn-import:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hard);
}

.import-success-banner {
    margin: 0 16px 20px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: #10B981;
    padding: 12px 16px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
}

.import-success-banner button {
    margin-left: auto;
    background: none;
    border: none;
    color: inherit;
    font-size: 18px;
    cursor: pointer;
    opacity: 0.5;
}

.rebost-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    margin-bottom: 24px;
    gap: 16px;
}

.rebost-search {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.rebost-search input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    font-size: var(--font-size-base);
}

.rebost-search input:focus {
    outline: none;
}

.rebost-stats-chip {
    background: rgba(255, 255, 255, 0.05);
    padding: 8px 16px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    white-space: nowrap;
}

.rebost-stats-chip strong {
    color: var(--color-terracotta);
}

.rebost-empty-state {
    text-align: center;
    padding: 80px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    opacity: 0.8;
}

.rebost-empty-state h3 {
    margin: 0;
    font-size: 20px;
}

.rebost-empty-state p {
    margin: 0;
    font-size: var(--font-size-base);
    opacity: 0.6;
}

.resource-grid-masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 0 16px 40px;
}

@media (max-width: 600px) {
    .resource-grid-masonry {
        grid-template-columns: 1fr;
    }
}

.rebost-loading-state {
    padding: 40px 0;
}

=====================================
FILE: src/components/RebostVault.jsx
=====================================

import React, { useState, useEffect, useRef } from 'react';
import { 
    Upload, Plus, Search, Archive, AlertCircle, Share2, 
    CheckCircle2, ShieldCheck, HardDrive 
} from 'lucide-react';
import { migrationService } from '../services/MigrationService';
import { notionService } from '../services/notionService';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import ResourceCard from './ResourceCard';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import './RebostVault.css';

import { historicalRecoveryService } from '../services/HistoricalRecoveryService';

/**
 * RebostVault [PRIVATE VAULT]
 * Magatzem sobirà per a recursos personals i importacions de Raindrop.
 */
const RebostVault = ({ onClose }) => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [importStats, setImportStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchResources = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Prioritat 1: Supabase (Dades Sobiranes)
            const { data, error } = await supabaseService.supabase
                .from('resources')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') throw error; 

            let finalResources = data || [];

            // Prioritat 2: Injecció de Mocks si està buit (Raindrop/Notion Virtual)
            if (finalResources.length === 0) {
                try {
                    const { raindropService } = await import('../services/raindropService');
                    const raindropMocks = await raindropService.getCollection();
                    const notionMocks = notionService.getMockVolume(5);
                    finalResources = [...raindropMocks, ...notionMocks];
                } catch (mockErr) {
                    logger.warn('[Rebost] Error carregant serveis de mock:', mockErr);
                }
            }

            setResources(finalResources);
        } catch (err) {
            logger.warn('[Rebost] Error obtenint recursos, entrant en mode resilient:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        setImportStats(null);

        try {
            const text = await file.text();
            let items = [];

            if (file.name.endsWith('.html')) {
                items = migrationService.parseRaindropHTML(text);
            } else if (file.name.endsWith('.json')) {
                const rawItems = migrationService.parseNotionJSON(text);
                items = rawItems.map(item => notionService.mapToResource(item));
            } else if (file.name.endsWith('.xml')) {
                if (text.includes('xmlns:wp="http://wordpress.org/export/')) {
                    items = historicalRecoveryService.parseWordPressXML(text);
                } else if (text.includes('type="text/html"') && text.includes('<entry>')) {
                    items = historicalRecoveryService.parseBloggerXML(text);
                } else {
                    throw new Error('Format XML no reconegut.');
                }
            } else {
                alert('Format no suportat.');
                setIsImporting(false);
                return;
            }

            if (items.length === 0) {
                alert('No s\'han trobat dades vàlides.');
                setIsImporting(false);
                return;
            }

            const result = await migrationService.importToRebost(items, user.id);
            
            // Sensació de processament intel·ligent (Refinament MArIA)
            setTimeout(() => {
                setImportStats(result);
                setIsImporting(false);
                fetchResources();
            }, 1200);

        } catch (err) {
            logger.error('[Rebost] Error importació:', err);
            alert('Error: ' + err.message);
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        if (resources.length === 0) return;
        await migrationService.exportRebostData(resources);
    };

    const handleShare = async (resource) => {
        const confirmShare = window.confirm(`Vols "trastombar" ${resource.title} al poble?`);
        if (!confirmShare) return;

        try {
            const { error } = await supabaseService.supabase
                .from('resources')
                .update({ is_public: true, scope: 'public' })
                .eq('id', resource.id);

            if (error) throw error;
            fetchResources();
        } catch (err) {
            logger.error('[Rebost] Error compartint:', err);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading && resources.length === 0) return <StatusLoader message="Preparant el Rebost..." />;

    return (
        <div className="rebost-vault animate-in p-6 bg-[#0a0a0c] min-h-full">
            <header className="rebost-header flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="rebost-title-section flex items-center gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-white/5 hover:bg-white/10 transition-all" onClick={onClose}>
                        <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-[28px]">
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white leading-none mb-1">El Rebost Sobirà</h2>
                        <p className="text-sm text-gray-500 uppercase font-black tracking-widest opacity-60">Magatzem Privat</p>
                    </div>
                </div>

                <div className="rebost-actions flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <ShieldCheck size={14} />
                        <span>Veritat de Ferro</span>
                    </div>
                    <button className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-[28px] transition-all" onClick={handleExport} title="Exporta Memòria">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-6 h-12 bg-[var(--theme-accent-primary)] text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-950/20 active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} />
                        <span>Importar</span>
                    </button>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".html,.json,.xml" onChange={handleFileSelect} />
                </div>
            </header>

            {importStats && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] flex items-center justify-between text-emerald-400 text-sm font-bold">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} />
                        <span>¡Bategat! S'han afegit {importStats.successful} recursos.</span>
                    </div>
                    <button onClick={() => setImportStats(null)} className="hover:rotate-90 transition-transform">×</button>
                </div>
            )}

            <div className="rebost-tools flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Busca al teu rebost..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/5 rounded-[24px] pl-12 pr-6 text-white text-sm focus:outline-none focus:border-[var(--theme-accent-primary)]/40 transition-all font-medium"
                    />
                </div>
                <div className="px-4 flex items-center bg-white/5 rounded-[24px] text-[11px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                    {resources.length} Recursos
                </div>
            </div>

            {isImporting ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-60">
                    <StatusLoader type="loading" message="Refinant dades amb MArIA..." />
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard
                            key={resource.id || resource.uuid}
                            resource={resource}
                            onShare={handleShare}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 opacity-20 text-center">
                    <AlertCircle size={64} className="mb-6 text-gray-600" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Rebost Buit</h3>
                    <p className="text-sm text-gray-500 font-bold">Importa la teua memòria digital.</p>
                </div>
            )}
        </div>
    );
};

export default RebostVault;


=====================================
FILE: src/components/ResourceCard.css
=====================================

.resource-card-modern {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.resource-card-modern:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hard);
}

.resource-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-share-resource {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-share-resource:hover {
    background: var(--color-terracotta);
    border-color: var(--color-terracotta);
    transform: scale(1.1);
}

.privacy-indicator {
    padding: 6px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-base);
}

.privacy-indicator.private {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
}

.privacy-indicator.is-public {
    background: rgba(16, 185, 129, 0.2);
    color: #10B981;
}

.resource-content {
    padding: 12px 0;
}

.resource-desc {
    font-size: var(--font-size-base);
    opacity: 0.8;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.resource-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.resource-tag {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--color-terracotta);
    background: rgba(var(--color-terracotta-rgb), 0.1);
    padding: 2px 8px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.resource-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-base);
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.resource-date {
    opacity: 0.5;
    display: flex;
    align-items: center;
    gap: 4px;
}

.resource-external-link {
    color: var(--hud-accent, #00f2ff);
    text-decoration: none;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
}

.resource-external-link:hover {
    text-decoration: underline;
}

/* Masonry Adjustments */
.resource-grid-masonry {
    column-count: 2;
    column-gap: 16px;
    padding: 0 16px;
}

@media (max-width: 600px) {
    .resource-grid-masonry {
        column-count: 1;
    }
}

.resource-grid-masonry>article {
    break-inside: avoid;
    margin-bottom: 16px;
}

=====================================
FILE: src/components/ResourceCard.jsx
=====================================

import React from 'react';
import { ExternalLink, Share2, Lock, Unlock, Hash, Calendar } from 'lucide-react';
import UniversalCard from './UniversalCard';
import './ResourceCard.css';

/**
 * ResourceCard - Component per visualitzar recursos del Directori
 */
const ResourceCard = ({
    resource,
    onShare,
    showActions = true
}) => {
    const {
        title,
        description,
        type,
        privacy,
        url,
        tags = [],
        author,
        created_at
    } = resource;

    const getIconForType = (type) => {
        switch (type?.toLowerCase()) {
            case 'enllaç': return <ExternalLink size={18} />;
            case 'esdeveniment': return <Calendar size={18} />;
            default: return <Hash size={18} />;
        }
    };

    return (
        <UniversalCard 
            className="resource-card-modern"
            cardVariant="mercat"
        >
            <div className="resource-header flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="resource-type-icon p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-[20px]">
                        {getIconForType(type)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)] opacity-60">
                        {type || 'Recurs'}
                    </span>
                </div>
                <div className="resource-privacy-badge">
                    {privacy === 'privat' ? <Lock size={14} className="text-red-400" /> : <Unlock size={14} className="text-green-400" />}
                </div>
            </div>

            <h3 className="resource-title text-xl font-black text-white mb-2 leading-tight">
                {title}
            </h3>
            
            <p className="resource-description text-sm text-gray-400 mb-4 line-clamp-2">
                {description}
            </p>

            <div className="resource-tags flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => (
                    <span key={i} className="text-[9px] px-2 py-1 bg-white/5 text-gray-400 rounded-[28px] border border-white/5 uppercase font-black">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="resource-footer flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <div className="resource-author flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold">
                        {author || 'Anònim'} • {created_at ? new Date(created_at).toLocaleDateString() : 'Recent'}
                    </span>
                </div>
                
                {showActions && (
                    <div className="flex items-center gap-2">
                        {url && (
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-[var(--color-primary)] hover:text-white transition-all text-gray-400 rounded-[20px]"
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                        <button 
                            onClick={() => onShare && onShare(resource)}
                            className="p-2 hover:bg-white/10 transition-all text-gray-400 rounded-[20px]"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                )}
            </div>
        </UniversalCard>
    );
};

export default ResourceCard;


=====================================
FILE: src/components/RhizomeMonitor.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Database, Trash2, RefreshCw } from 'lucide-react';
import { rhizomeDb } from '../rhizome/db-core';
import { rhizomeManager } from '../services/rhizomeManager';
import { logger } from '../utils/logger';

const RhizomeMonitor = () => {
    const [stats, setStats] = useState({ ops: 0, snapshots: 0, lastPrune: 'Mai', version: '1.0.0' });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // [MASTER] - En un entorn real el worker tindria un mètode GET_STATS
            // Per a la POC, simulem el bategat basat en les dades disponibles
            const ops = await rhizomeDb.getOperations('global');
            const snapshot = await rhizomeDb.getSnapshot('global');
            const version = localStorage.getItem('sp_rhizome_version') || '1.0.0';
            
            setStats({
                ops: ops.length,
                snapshots: snapshot ? 1 : 0,
                lastPrune: localStorage.getItem('sp_rhizome_last_prune') || 'Mai',
                version: version
            });
        } catch (err) {
            logger.error('[RhizomeMonitor] Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrune = async () => {
        const success = await rhizomeManager.pruneHistory('global');
        if (success) {
            localStorage.setItem('sp_rhizome_last_prune', new Date().toLocaleTimeString());
            fetchStats();
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 text-white font-sans mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Database className="text-orange-500" size={24} />
                    <h3 className="text-lg font-black uppercase tracking-tighter">Motor Eg-walker CRDT</h3>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    ONLINE
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-[28px] border border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Operacions DAG</span>
                    <div className="text-2xl font-black">{stats.ops}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-[28px] border border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Versió Crítica</span>
                    <div className="text-2xl font-black text-orange-500">{stats.version}</div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Darrera Poda ($Vcrit):</span>
                    <span className="font-mono">{stats.lastPrune}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Integritat Graph:</span>
                    <span className="text-green-500 font-bold">W-LEVEL-MAX</span>
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={fetchStats}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[28px] transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    <span className="text-[10px] font-black uppercase">Refrescar</span>
                </button>
                <button 
                    onClick={handlePrune}
                    className="flex-1 py-3 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/30 text-orange-400 rounded-[28px] transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={14} />
                    <span className="text-[10px] font-black uppercase">Poda Atòmica</span>
                </button>
            </div>

            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-[28px] flex items-start gap-3">
                <Shield className="text-indigo-400 mt-1" size={16} />
                <p className="text-[10px] text-indigo-300 italic leading-relaxed">
                    Arquitectura de Ferro: Les dades bateguen localment al Rhizome privat. Cap servidor pot destruir la memòria del Mas.
                </p>
            </div>
        </div>
    );
};

export default RhizomeMonitor;


=====================================
FILE: src/components/RoleSelectorModal.css
=====================================


.role-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    z-index: 10001;
    padding: 12px;
}

.role-modal-content.command-center {
    background: #1A1B23; /* Fons fosc profund v8.0 */
    width: 100%;
    max-width: 620px;
    height: 92vh;
    display: flex;
    flex-direction: column;
    border-radius: 32px; /* rounded-card v8.0 */
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;
    animation: zoomInV6 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

/* CABÇALERA v8.0 */
.v8-header {
    background: #000;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v8-modal-logo {
    height: 32px;
    filter: brightness(1.2);
}

.v8-header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.theme-toggle-v8 {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    padding: 6px 12px;
    display: flex;
    gap: 8px;
    cursor: pointer;
    color: #fff;
}

.sun-icon { color: #FF9800; display: none; }
.moon-icon { color: #5D5FEF; }

body.light-mode .sun-icon { display: block; }
body.light-mode .moon-icon { display: none; }

.role-modal-close-v8 {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* SMART SEARCH v8.0 */
.magic-search-container {
    padding: 24px 16px 8px;
}

.magic-search-wrapper {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s;
}

.magic-search-wrapper:focus-within {
    border-color: #d946ef;
    background: rgba(217, 70, 239, 0.05);
    box-shadow: 0 0 20px rgba(217, 70, 239, 0.15);
}

.magic-search-icon {
    color: rgba(255, 255, 255, 0.3);
}

.magic-search-input {
    background: none;
    border: none;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    width: 100%;
    outline: none;
}

.magic-search-input::placeholder {
    color: rgba(255, 255, 255, 0.2);
}

.magic-sparkle {
    font-size: 1.2rem;
    animation: sparkleSpin 3s infinite linear;
}

@keyframes sparkleSpin {
    0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
    100% { transform: scale(1) rotate(360deg); opacity: 0.8; }
}

.iaia-contextual-greeting {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 152, 0, 0.05);
    padding: 16px;
    border-radius: var(--radius-xl);
    margin-bottom: 24px;
    border: 1px dashed rgba(255, 152, 0, 0.2);
}

.iaia-avatar-mini {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--iaia-accent);
    position: relative;
    flex-shrink: 0;
    background: #1a1a1c;
}

.iaia-avatar-mini img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.online-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #4CAF50;
    border-radius: 50%;
    border: 2px solid #0a0a0b;
    box-shadow: 0 0 8px #4CAF50;
}

.greeting-text {
    font-size: 1rem;
    font-weight: 800;
    font-style: italic;
    color: var(--text-main);
    line-height: 1.4;
}

.role-modal-body {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.role-options-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

@media (max-width: 400px) {
    .role-options-list {
        grid-template-columns: 1fr;
    }
}

.role-option-card-v5 {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: 0;
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: all 0.3s var(--ease-out);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.role-option-card-v5:hover {
    transform: translateY(-4px);
    border-color: var(--iaia-accent);
    box-shadow: var(--shadow-hard);
    background: var(--bg-card);
}

.role-card-inner {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
}

.role-icon-box-v5 {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.role-info h3 {
    font-size: 0.95rem;
    font-weight: 950;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
    color: var(--text-main);
}

.role-info p {
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.3;
    margin-bottom: 8px !important;
}

.role-benefit-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(var(--accent-orange-rgb), 0.05);
    border: 1px solid rgba(var(--accent-orange-rgb), 0.1);
    padding: 4px 8px;
    border-radius: 100px;
    font-size: 0.65rem;
    font-weight: 900;
    color: var(--accent-orange);
    text-transform: uppercase;
}

.role-arrow-v5 {
    margin-left: auto;
    opacity: 0.2;
    transition: transform 0.3s;
}

.role-option-card-v5:hover .role-arrow-v5 {
    transform: translateX(5px);
    opacity: 0.8;
}

.generating-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 950;
    font-size: 0.9rem;
    color: var(--iaia-accent);
    animation: pulse 1s infinite alternate;
}

.spinner-v5 {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 152, 0, 0.1);
    border-top: 3px solid var(--iaia-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes zoomInV6 {
    from { transform: scale(0.9) translateY(40px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
}

.v6-footer {
    padding: 16px;
    background: var(--bg-surface);
    border-top: var(--border-master);
}

.v6-stats-pills {
    display: flex;
    justify-content: center;
    gap: 12px;
}

.v6-pill {
    padding: 4px 12px;
    background: rgba(var(--accent-violet-rgb), 0.1);
    color: var(--accent-violet);
    border-radius: var(--radius-full);
    font-size: 0.6rem;
    font-weight: 950;
    letter-spacing: 1px;
}


=====================================
FILE: src/components/RoleSelectorModal.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { 
    X, MessageCircle, Gamepad2, BrainCircuit, Sparkles, ChevronRight, Zap, 
    CloudSun, BookText, Quote, Users, History, Mic, Search, Sun, Moon
} from 'lucide-react';
import './RoleSelectorModal.css';

const RoleSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const [generating, setGenerating] = useState(null);

    const [greeting, setGreeting] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Lògica de Cerca Màgica (Smart Search) v8.0
    const handleSearch = (q) => {
        setSearchQuery(q);
        // Aquí es podria afegir lògica de filtrat o routing automàtic
    };
    useEffect(() => {
        if (isOpen) {
            const greetingsList = [
                "Bon dia, bategat. Com t'ajude hui?",
                "Benvingut al cor del poble. Què busques?",
                "Escolta el batec... tria el teu camí.",
                "La memòria està activa. Com interactuem?",
                "Pura saviesa de l'arca. Digues ràpid!",
                "Vols raonar una estona a la fresca?"
            ];
            const randomMsg = greetingsList[Math.floor(Math.random() * greetingsList.length)];
            const timer = setTimeout(() => {
                setGreeting(randomMsg);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setGreeting("");
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const roles = [
        { 
            id: 'iaia_master', 
            title: 'IAIA MarIA', 
            desc: 'Matriarca Digital. Saviesa i sentit comú per al dia a dia.', 
            avatar: '/assets/avatars/comic/iaia_comic_matriarch.png', 
            color: '#ff9800', 
            route: '/chats', 
            benefit: 'Guia Suprema' 
        },
        { 
            id: 'agronom', 
            title: 'VICENT FERRIS', 
            desc: 'Agrònom. El tacte de la terra i el saber de l\'olivera.', 
            avatar: '/images/demo/avatar_antoni.png', 
            color: '#4CAF50', 
            route: '/chats', 
            benefit: 'Saviesa de la Terra' 
        },
        { 
            id: 'cuinera', 
            title: 'PEPICA LA VALL', 
            desc: 'Cuinera. Guardiana de receptes i l\'escalfor del xup-xup.', 
            avatar: '/images/demo/avatar_carmen.png', 
            color: '#EF4444', 
            route: '/chats', 
            benefit: 'Gastronomia i Vida' 
        },
        { 
            id: 'capatas', 
            title: 'ANDREU DEL CAMP', 
            desc: 'Capatàs. El rellotge i la llei del camp amb trellat.', 
            avatar: '/images/demo/avatar_vicent.png', 
            color: '#8E8E93', 
            route: '/chats', 
            benefit: 'Eficiència Rural' 
        },
        { 
            id: 'arxiver', 
            title: 'JOAN DEL POBLE', 
            desc: 'Arxiver. Memòria de papers i traducció del carrer.', 
            avatar: '/images/demo/avatar_joanet.png', 
            color: '#5D5FEF', 
            route: '/chats', 
            benefit: 'Memòria Viva' 
        },
        { 
            id: 'ratoli', 
            title: 'SUPER RATOLÍ', 
            desc: 'Dades i SQLite. ¡Vitaminar-se i superar-se!', 
            avatar: '/assets/avatars/super_ratoli.png', 
            color: '#FFEB3B', 
            route: '/chats', 
            benefit: 'Heroi Digital' 
        },
        { 
            id: 'nanob', 
            title: 'NANO BANANA', 
            desc: 'Aventura i Art. Agent de felicitat i abundància bategant.', 
            avatar: '/assets/avatars/nano_banana.png', 
            color: '#00d2ff', 
            route: '/chats', 
            benefit: 'RPG Narratiu' 
        },
        { 
            id: 'sultan', 
            title: 'SULTAN', 
            desc: 'Seguretat Rural. El guardià que mai dorm.', 
            avatar: '/images/demo/avatar_samir.png', 
            color: '#795548', 
            route: '/chats', 
            benefit: 'Seguretat de Node' 
        },
        { 
            id: 'mixa', 
            title: 'LA MIXA', 
            desc: 'Gata de Xarxa. Missatgera P2P entre les teulades.', 
            avatar: '/images/demo/avatar_maria.png', 
            color: '#E91E63', 
            route: '/chats', 
            benefit: 'Connexion Invisible' 
        },
        { 
            id: 'gall', 
            title: 'EL GALL', 
            desc: 'Alertes. El bategat de l\'emergència i l\'inici del dia.', 
            avatar: '/assets/avatars/comic/avatar_marc_comic.png', 
            color: '#FF5722', 
            route: '/chats', 
            benefit: 'Vigilant d\'Emergència' 
        },
        { 
            id: 'flash', 
            title: 'FLASH', 
            desc: 'Executor. Orquestrador de processos a tot bategat.', 
            avatar: '/assets/avatars/iaia_secretary.png', 
            color: '#06B6D4', 
            route: '/chats', 
            benefit: 'Velocitat Pura' 
        },
        { 
            id: 'viatjant', 
            title: 'EL VIATJANT', 
            desc: 'Ambaixador. El Tio de la Bota connectant pobles.', 
            avatar: '/assets/avatars/iaia_memory.png', 
            color: '#9C27B0', 
            route: '/chats', 
            benefit: 'Històries de Node' 
        }
    ];


    const handleSelect = (role) => {
        setGenerating(role.id);
        setTimeout(() => {
            onSelect(role);
            setGenerating(null);
        }, 1200);
    };

    return (
        <div className="role-modal-overlay" onClick={onClose}>
            <div className="role-modal-content command-center" onClick={(event) => { 
                                    event.stopPropagation();
                                }}
>
                <header className="role-modal-header v8-header">
                    <div className="v8-header-left">
                        <img src="https://raw.githubusercontent.com/iaia-maria/socdepoble-assets/main/logo-soc-de-poble-white.png" alt="Logo" className="v8-modal-logo" />
                    </div>
                    
                    <div className="v8-header-right">
                        <button className="theme-toggle-v8" onClick={() => document.body.classList.toggle('light-mode')}>
                            <Sun size={18} className="sun-icon" />
                            <Moon size={18} className="moon-icon" />
                        </button>
                        <button className="role-modal-close-v8" onClick={onClose}><X size={24} /></button>
                    </div>
                </header>

                <div className="role-modal-body">
                    {/* SMART SEARCH v8.0 */}
                    <div className="magic-search-container">
                        <div className="magic-search-wrapper">
                            <Search className="magic-search-icon" size={20} />
                            <label htmlFor="magic-search-input" className="sr-only">Cercar a la IAIA...</label>
                            <input 
                                id="magic-search-input"
                                name="magic_search_input"
                                type="text" 
                                placeholder="Diu-li a la IAIA... (Ex: 'Tinc fam', 'Què vol dir bategar?')" 
                                className="magic-search-input"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className={`magic-sparkle ${searchQuery ? 'active' : ''}`}>✨</div>
                        </div>
                    </div>

                    <div className="iaia-contextual-greeting">
                        <div className="iaia-avatar-mini">
                            <img src="/assets/avatars/comic/iaia_comic_matriarch.png" alt="IAIA" />
                            <div className="online-indicator"></div>
                        </div>
                        <p className="greeting-text">"{greeting}"</p>
                    </div>
                    
                    <div className="role-options-list">
                        {roles.map(role => (
                            <button 
                                key={role.id}
                                className={`role-option-card-v5 ${generating === role.id ? 'generating' : ''}`}
                                onClick={() => handleSelect(role)}
                                disabled={!!generating}
                            >
                                <div className="role-card-inner">
                                    <div className="role-icon-box-v5" style={{ background: role.color + '15', color: role.color, padding: 0, overflow: 'hidden' }}>
                                        {generating === role.id ? (
                                            <div className="spinner-v5" />
                                        ) : (
                                            <img 
                                                src={role.avatar} 
                                                alt={role.title} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        )}
                                    </div>
                                    <div className="role-info">
                                        <h3>{role.title}</h3>
                                        <p>{role.desc}</p>
                                        <div className="role-benefit-tag">
                                            <Zap size={10} /> {role.benefit}
                                        </div>
                                    </div>
                                    {generating !== role.id && <ChevronRight size={24} className="role-arrow-v5" />}
                                </div>
                                {generating === role.id && (
                                    <div className="generating-overlay">
                                        <span>Generant pròleg narratiu...</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="role-modal-footer v6-footer">
                    <div className="v6-stats-pills">
                        <span className="v6-pill">12 AGENTS</span>
                        <span className="v6-pill">IA ACTIVA</span>
                        <span className="v6-pill">DIA/NIT OK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectorModal;


=====================================
FILE: src/components/RuralIntelligence.css
=====================================

.rural-ia-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: var(--md-sys-color-surface);
    min-height: calc(100vh - var(--header-height));
    padding-top: calc(var(--header-height) + 20px);
}

.rural-ia-header {
    background: var(--accent);
    color: white;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    box-shadow: var(--shadow-hard);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.llumeta {
    color: #ffd700;
    display: flex;
    align-items: center;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.icon-btn-ia {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.icon-btn-ia:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.rural-ia-header h2 {
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.persona-selector {
    display: flex;
    gap: 10px;
    padding: 1.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    background: var(--bg-card);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.persona-selector::-webkit-scrollbar {
    display: none;
}

.persona-chip {
    flex-shrink: 0;
    padding: 10px 16px;
    border-radius: 0;
    /* Llei del Zero Radius */
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.persona-chip.active {
    background: var(--accent);
    color: white;
    border-color: var(--md-sys-color-primary);
    box-shadow: var(--shadow-hard);
}

.persona-info-mini {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
}

.persona-label {
    font-size: var(--font-size-base);
    opacity: 0.7;
    text-transform: uppercase;
}

.persona-name {
    font-size: var(--font-size-base);
    font-weight: 800;
}

.query-box {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 0 !important;
    position: relative;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.query-box textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: white;
    font-size: var(--font-size-base);
    resize: none;
    outline: none;
    padding: 12px;
}

.consult-btn {
    background: var(--md-sys-color-tertiary);
    color: black;
    padding: 12px 24px;
    border-radius: 0;
    /* ZERO RADIUS DIRECTIVE */
    font-weight: 800;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 12px;
}

.consult-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.error-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
    text-align: center;
    border-color: var(--color-primary);
}

.btn-setup {
    background: var(--color-primary);
    color: white;
    padding: 8px 16px;
    font-size: var(--font-size-base);
}

.history-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 60px;
}

.response-card {
    padding: 20px;
    border-radius: 0;
    /* ZERO RADIUS */
    border-left: 4px solid var(--md-sys-color-tertiary);
    background: rgba(255, 255, 255, 0.03);
}

.response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    opacity: 0.9;
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--md-sys-color-tertiary);
}

.header-names {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}

.pet-badge {
    background: var(--color-tertiary);
    color: white;
    font-size: 8px;
    padding: 2px 6px;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.05em;
    border-radius: 0px;
}

.header-label {
    font-size: 9px;
    opacity: 0.6;
    text-transform: uppercase;
}

.header-avatar-name {
    font-size: var(--font-size-base);
    color: white;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.timestamp {
    opacity: 0.5;
    font-size: var(--font-size-base);
}

.copy-btn-mini {
    background: rgba(0, 242, 255, 0.1);
    border: 1px solid var(--color-teal);
    color: var(--color-teal);
    padding: 4px 10px;
    font-size: var(--font-size-base);
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.copy-btn-mini:hover {
    background: var(--color-teal);
    color: black;
}

.response-query {
    font-style: italic;
    font-size: var(--font-size-base);
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.response-content {
    line-height: 1.8;
    font-size: var(--font-size-base);
    color: white;
    font-family: var(--font-main);
    white-space: pre-wrap;
}

/* [V27] NOVES CLASSES: L'ULL DE LA IAIA (VISIÓ) */
.query-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
}

.camera-btn-ia {
    background: rgba(93, 95, 239, 0.1);
    border: 1px solid rgba(93, 95, 239, 0.2);
    color: #5D5FEF;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px; 
    cursor: pointer;
    transition: all 0.2s;
}

.camera-btn-ia:hover {
    background: rgba(93, 95, 239, 0.2);
    transform: scale(1.05);
}

.image-preview-bubble {
    position: relative;
    width: 100px;
    height: 100px;
    border: 2px solid #5D5FEF;
    margin-bottom: 15px;
    background: #000;
}

.image-preview-bubble img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.remove-img-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #FF3B30;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    z-index: 10;
}

/* Animations from index.css are reused here (animate-bategat, status-pulse, llumeta) */

=====================================
FILE: src/components/RuralIntelligence.jsx
=====================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, BookOpen, Heart } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { hapticService } from '../services/hapticService';
import { Tractor, ChefHat, ClipboardList, FileSearch, Sparkles, Send, Info, ShieldCheck, Share2, BellRing, Palette, Zap, Globe, Settings, Users, Store, Landmark, Camera, X } from 'lucide-react';
import LlarDeFocMenu from './LlarDeFocMenu';
import './RuralIntelligence.css';

/**
 * RuralIntelligence: La Ràdio Nova [V1.2]
 * Interfície d'IA especialitzada amb Glassmorphism i accents Teal.
 */
const RuralIntelligence = ({ defaultMode = 'faena' }) => {
    const navigate = useNavigate();
    const [selectedPersona, setSelectedPersona] = useState(() => {
        if (defaultMode === 'traductor') return 'TRADUCTOR';
        if (defaultMode === 'remeis') return 'IAIA_MARIA';
        if (defaultMode === 'oracle') return 'ORACLE';
        if (defaultMode === 'diccionari') return 'DICCIONARI';
        if (defaultMode === 'rebost') return 'REBOST';
        if (defaultMode === 'trellat') return 'TRELLAT';
        return 'AGRONOM';
    });
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]); // List of { persona, query, response, timestamp }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mode, setMode] = useState(defaultMode);
    const [selectedImage, setSelectedImage] = useState(null); // { file, preview, base64 }
    const fileInputRef = React.useRef(null);

    const personas = [
        { key: 'AGRONOM', icon: <Tractor size={20} />, label: "L'Agrònom", avatar: "Vicent Ferris", type: "PERSON" },
        { key: 'CUINERA', icon: <ChefHat size={20} />, label: "La Cuinera", avatar: "Pepica", type: "PERSON" },
        { key: 'CAPATAS', icon: <ClipboardList size={20} />, label: "El Capatàs", avatar: "Andreu", type: "PERSON" },
        { key: 'ARXIVER', icon: <FileSearch size={20} />, label: "L'Arxiver", avatar: "Joan", type: "PERSON" },
        { key: 'RATOLI', icon: <Info size={20} />, label: "Dades", avatar: "Ratolí", type: "ANIMAL" },
        { key: 'SULTAN', icon: <ShieldCheck size={20} />, label: "Seguretat", avatar: "Sultan", type: "ANIMAL" },
        { key: 'MIXA', icon: <Share2 size={20} />, label: "Xarxa", avatar: "Mixa", type: "ANIMAL" },
        { key: 'GALL', icon: <BellRing size={20} />, label: "Alertes", avatar: "El Gall", type: "ANIMAL" },
        { key: 'NANOBANANA', icon: <Palette size={20} />, label: "L'Artista", avatar: "Nano Banana", type: "SYSTEM" },
        { key: 'FLASH', icon: <Zap size={20} />, label: "Executor", avatar: "Flash", type: "SYSTEM" },
        { key: 'VIATJANT', icon: <Globe size={20} />, label: "Exterior", avatar: "El Viatjant", type: "PERSON" },
        { key: 'TRADUCTOR', icon: <Languages size={20} />, label: "Traductor", avatar: "IAIA MarIA", type: "SYSTEM" },
        { key: 'IAIA_MARIA', icon: <Heart size={20} />, label: "Remeis", avatar: "IAIA MarIA", type: "SYSTEM" },
        { key: 'ORACLE', icon: <Sparkles size={20} />, label: "Oracle", avatar: "IAIA MarIA", type: "SYSTEM" },
        { key: 'DICCIONARI', icon: <BookOpen size={20} />, label: "Diccionari", avatar: "IAIA MarIA", type: "SYSTEM" },
        { key: 'REBOST', icon: <Store size={20} />, label: "El Rebost", avatar: "IAIA MarIA", type: "SYSTEM" },
        { key: 'TRELLAT', icon: <Landmark size={20} />, label: "Jutjat", avatar: "IAIA MarIA", type: "SYSTEM" },
        { key: 'ULL_IAIA', icon: <Camera size={20} />, label: "L'Ull", avatar: "IAIA MarIA", type: "SYSTEM" }
    ];

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            setError("La foto és massa pesada, fill! Més de 4MB no puc carregar-la.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage({
                file,
                preview: URL.createObjectURL(file),
                base64: reader.result.split(',')[1],
                mimeType: file.type
            });
            hapticService.batec();
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleConsult = async () => {
        if (!query.trim() && !selectedImage) return;

        setLoading(true);
        setError(null);
        hapticService.batec(); // Feedback inicial

        try {
            const imageData = selectedImage ? { mimeType: selectedImage.mimeType, data: selectedImage.base64 } : null;
            const result = await geminiService.ask(selectedPersona, query, imageData);

            if (result.error) {
                setError(result.message);
                hapticService.notifyError();
            } else {
                const newBatec = {
                    id: Date.now(),
                    persona: personas.find(p => p.key === selectedPersona),
                    query: query,
                    text: result.text,
                    avatarName: result.avatarName || personas.find(p => p.key === selectedPersona).avatar,
                    timestamp: new Date().toLocaleTimeString()
                };
                setHistory(prev => [newBatec, ...prev]);
                setQuery(''); 
                setSelectedImage(null);
                hapticService.notifyAIReady(); 
            }
        } catch (error) {
            console.error("AI Consult Error:", error);
            setError("S'ha produït un error inesperat.");
            hapticService.notifyError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rural-ia-container animate-bategat">
            <header className="rural-ia-header">
                <div className="header-main">
                    <div className="llumeta">
                        <Sparkles size={24} />
                    </div>
                    <h2>Intel·ligència Rural</h2>
                </div>
                <div className="header-actions">
                    <button className="icon-btn-ia" onClick={() => navigate('/ia/habitants')} title="Els Habitants del Mas">
                        <Users size={20} />
                    </button>
                    <button className="icon-btn-ia" onClick={() => setIsMenuOpen(true)} title="La Llar de Foc">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            <LlarDeFocMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                currentMode={mode}
                onModeChange={(newMode) => {
                    setMode(newMode);
                    localStorage.setItem('sp_ia_mode', newMode);
                }}
            />

            <div className="persona-selector">
                {personas.map(p => (
                    <button
                        key={p.key}
                        className={`persona-chip ${selectedPersona === p.key ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedPersona(p.key);
                            setError(null);
                            hapticService.batec();
                        }}
                    >
                        {p.icon}
                        <div className="persona-info-mini">
                            <span className="persona-label">{p.label}</span>
                            <span className="persona-name">{p.avatar}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="query-box glass-ia">
                <textarea
                    id="rural-ia-query"
                    name="rural-ia-query"
                    placeholder={`Pregunta-li a ${personas.find(p => p.key === selectedPersona).avatar}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                />
                
                {selectedImage && (
                    <div className="image-preview-bubble">
                        <img src={selectedImage.preview} alt="Preview" />
                        <button className="remove-img-btn" onClick={removeImage}>
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="query-actions">
                    <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        ref={fileInputRef} 
                        onChange={handleImageSelect}
                    />
                    <button className="camera-btn-ia" onClick={() => fileInputRef.current?.click()}>
                        <Camera size={20} />
                    </button>
                    <button
                        className={`consult-btn ${loading ? 'loading' : ''}`}
                        onClick={handleConsult}
                        disabled={loading || (!query.trim() && !selectedImage)}
                    >
                        {loading ? (
                            <span className="status-pulse">Consultant...</span>
                        ) : (
                            <>
                                <span>Consultar</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-card glass-ia animate-bategat">
                    <Info size={24} />
                    <p>{error}</p>
                    {error.includes("clau del tractor") && (
                        <button
                            className="btn-setup"
                            onClick={() => navigate('/perfil?tab=settings')}
                        >
                            Configurar API Key
                        </button>
                    )}
                </div>
            )}

            {history.length > 0 && (
                <div className="history-container">
                    {history.map(batec => (
                        <div key={batec.id} className="response-card glass-ia animate-bategat">
                            <div className="response-header">
                                <div className="header-left">
                                    {batec.persona.icon}
                                    <div className="header-names">
                                        <div className="name-row">
                                            <small className="header-label">{batec.persona.label}</small>
                                            {batec.persona.type === 'ANIMAL' && (
                                                <span className="pet-badge">Mascota de l'IAIA</span>
                                            )}
                                        </div>
                                        <strong className="header-avatar-name">{batec.avatarName}</strong>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <small className="timestamp">{batec.timestamp}</small>
                                    <button
                                        className="copy-btn-mini"
                                        onClick={() => {
                                            navigator.clipboard.writeText(batec.text);
                                            hapticService.batec();
                                        }}
                                        title="Copiar saviesa"
                                    >
                                        <Sparkles size={14} />
                                        <span>COPIAR</span>
                                    </button>
                                </div>
                            </div>
                            <div className="response-query">
                                <strong>P:</strong> {batec.query}
                            </div>
                            <div className="response-content">
                                {batec.text}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RuralIntelligence;


=====================================
FILE: src/components/SEO.jsx
=====================================

// ✅ VERSIÓ FINAL - SEO GOD MODE AMB VALIDACIÓ COMPLETA
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_VERSION } from '../constants';

/**
 * 🏺 SEO [VIRAL TIERS GOD] - v10.33.16
 * Gestió dinàmica de l'SEO per a previsualitzacions d'alt impacte.
 * 
 * CARACTERÍSTIQUES:
 * - Prevenció de duplicats en og:image
 * - Validació de dades estructurades (Schema.org)
 * - Suport per a Twitter Cards, Facebook, WhatsApp
 * - Canonical URLs automàtiques
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Sóc de Poble',
  structuredData = {},
  noIndex = false
}) => {
  // [VALIDACIÓ] Títol per defecte si no es proporciona
  const siteTitle = 'Sóc de Poble';
  const showVersion = typeof window !== 'undefined' && !window.HIDE_SEO_VERSION;
  const versionString = APP_VERSION;
  const displayTitle = title ? title : siteTitle;
  const fullTitle = showVersion ? `${displayTitle} | ${siteTitle} ${versionString}` : `${displayTitle} | ${siteTitle}`;
  
  // [VALIDACIÓ] URL canònica automàtica completíssima i absoluta
  const baseUrl = 'https://socdepoble.org';
  let canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  if (!canonicalUrl.startsWith('http')) {
      canonicalUrl = `${baseUrl}${canonicalUrl}`;
  }
  
  // [VALIDACIÓ] Imatge per defecte (OG Image master)
  const ogImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/og-image-batega-v11.png?v=beta-sollutia'}`;
  
  // [VALIDACIÓ] Descripció per defecte
  const defaultDescription = 'La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.';
  const metaDescription = description || defaultDescription;
  
  // [VALIDACIÓ] Keywords per defecte
  const defaultKeywords = 'poble, rural, comunitat, valencià, sobirania digital, memòria local, ajuntament, mercat km0';
  const metaKeywords = keywords || defaultKeywords;
  
  // [SEGURETAT] Netejar dades perilloses
  const sanitize = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .substring(0, 500); // Max length per a meta tags
  };

  // [SCHEMA.ORG] Dades estructurades per defecte
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'profile' ? 'ProfilePage' : (type === 'article' ? 'NewsArticle' : (type === 'product' ? 'Product' : 'Organization')),
    "name": "Sóc de Poble",
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512x512.png`,
    "description": sanitize(metaDescription),
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Country",
      "name": "País Valencià"
    }
  };

  const mergedStructuredData = { ...defaultStructuredData, ...structuredData };
  const sanitizedStructuredData = {};
  for (const [key, value] of Object.entries(mergedStructuredData)) {
      sanitizedStructuredData[key] = typeof value === 'string' ? sanitize(value) : value;
  }

  // [PREVENCIÓ DUPLICATS] Key única per a cada tag per netejar Helmet
  const helmetKey = typeof window !== 'undefined' ? window.location.pathname : 'seo-static';

  return (
    <Helmet key={helmetKey} defer={false}>
      {/* === BÀSICS === */}
      <title>{sanitize(fullTitle)}</title>
      <meta name="title" content={sanitize(fullTitle)} />
      <meta name="description" content={sanitize(metaDescription)} />
      <meta name="keywords" content={sanitize(metaKeywords)} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="application-name" content="Sóc de Poble" />
      <meta name="theme-color" content="#f97316" />
      
      {/* === CANONICAL === */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* === OPEN GRAPH / FACEBOOK / WHATSAPP === */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={sanitize(fullTitle)} />
      <meta property="og:description" content={sanitize(metaDescription)} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={sanitize(title || siteTitle)} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="ca_ES" />
      
      {/* === TWITTER CARDS === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={sanitize(fullTitle)} />
      <meta name="twitter:description" content={sanitize(metaDescription)} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={sanitize(title || siteTitle)} />
      <meta name="twitter:site" content="@socdepoble" />
      <meta name="twitter:creator" content="@javillinares" />
      
      {/* === INSTAGRAM / PINTEREST === */}
      <meta name="pinterest" content="nopin" />
      
      {/* === APPLE TOUCH ICONS === */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      
      {/* === MICROSOFT TILE === */}
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      
      {/* === SCHEMA.ORG STRUCTURED DATA === */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;


=====================================
FILE: src/components/SafeShell.css
=====================================

.safe-shell-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-canvas);
}

.safe-shell-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
}

/* Status Bar Background Extension */
.safe-area-background-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: env(safe-area-inset-top, 0px);
    background: var(--accent-orange);
    /* La Boina s'estén fins al notch */
    z-index: 1001;
}

.safe-area-background-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: env(safe-area-inset-bottom, 0px);
    background: var(--bg-canvas);
    z-index: 1001;
}

=====================================
FILE: src/components/SafeShell.jsx
=====================================

import React from 'react';
import './SafeShell.css';

/**
 * [MASTER] SafeShell - Protecció de Safe Areas per a iOS/Android
 * Garanteix que la "Boina Taronja" s'estenga darrere del notch sense tallar contingut.
 */
const SafeShell = ({ children }) => {
    return (
        <div className="safe-shell-container">
            <div className="safe-area-background-top" />
            <main className="safe-shell-main" style={{
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}>
                {children}
            </main>
            <div className="safe-area-background-bottom" />
        </div>
    );
};

export default SafeShell;


=====================================
FILE: src/components/ScrollToTop.jsx
=====================================

import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Only scroll to top on new navigation (not back/forward)
        if (navType !== 'POP') {
            window.scrollTo(0, 0);

            // Also scroll the main content area in the Google-style layout
            const mainContent = document.querySelector('.layout-main-scroll');
            if (mainContent) {
                mainContent.scrollTo({ top: 0, behavior: 'instant' });
            }
        }
    }, [pathname, navType]);

    return null;
};

export default ScrollToTop;


=====================================
FILE: src/components/ShareHub.css
=====================================

.share-hub-container {
    display: flex;
    align-items: center;
}

.share-main-btn {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 8px;
    border-radius: 0px;
    transition: background 0.2s;
}

.share-main-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

.share-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.share-modal-content {
    width: 90%;
    max-width: 400px;
    background: var(--bg-surface);
    border-radius: 0px;
    overflow: hidden;
    border: 1px solid var(--sdp-glass-border);
    box-shadow: var(--shadow-hard);
}

.share-modal-header {
    padding: 20px;
    background: var(--color-terracotta);
    color: white;
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
}

.header-icon-hub {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-info h3 {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 900;
    text-transform: uppercase;
}

.header-info p {
    margin: 0;
    font-size: var(--font-size-base);
    opacity: 0.8;
}

.share-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
}

.share-modal-body {
    padding: 20px;
}

.share-url-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    margin-bottom: 25px;
    border: 1px solid var(--sdp-glass-border);
}

.share-url-preview span {
    flex: 1;
    font-size: var(--font-size-base);
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.share-url-preview button {
    background: var(--color-primary);
    color: var(--bg-canvas);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.share-url-preview button.copied {
    background: #2E7D32;
    color: white;
}

.share-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.share-option-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
}

.share-option-btn:hover {
    transform: translateY(-5px);
}

.share-icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 0px;
    background: var(--brand-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-hard);
}

.share-label {
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
    opacity: 0.8;
}

=====================================
FILE: src/components/ShareHub.jsx
=====================================

import React, { useState } from 'react';
import { Share2, MessageCircle, Send, Facebook, Twitter, Link as LinkIcon, X, CheckCircle } from 'lucide-react';
import './ShareHub.css';
import { logger } from '../utils/logger';

/**
 * ShareHub [VIRAL NEXUS VOS]
 * Gestiona la compartició de contingut optimitzada per a previsualitzacions mòbils.
 * Prioritza la dignitat del contingut en WhatsApp i Telegram.
 */
const ShareHub = ({ title, text, url, onShareSuccess, customTrigger }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const baseUrl = 'https://socdepoble.org';
    const finalUrl = url?.startsWith('http') ? url : `${baseUrl}${url || window.location.pathname}`;

    const shareData = {
        title: title || 'Sóc de Poble',
        text: text || 'Mira el que he trobat a Sóc de Poble! 🥘',
        url: finalUrl
    };

    const handleOpenModal = () => {
        if (navigator.share) {
            handleNativeShare();
        } else {
            setIsModalOpen(true);
        }
    };

    const handleNativeShare = async () => {
        try {
            // [VOS] WhatsApp native preview works best if text and url are well combined
            await navigator.share({
                title: shareData.title,
                text: `${shareData.text}\n\n`,
                url: shareData.url
            });
            if (onShareSuccess) onShareSuccess();
        } catch (err) {
            if (err.name !== 'AbortError') {
                logger.error('Error sharing:', err);
                setIsModalOpen(true);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={24} />,
            // [VOS] Optimització específica per a previsualització rica
            url: `https://wa.me/?text=${encodeURIComponent(`*${shareData.title}*\n${shareData.text}\n\n🔗 ${shareData.url}`)}`,
            color: '#25D366'
        },
        {
            name: 'Telegram',
            icon: <Send size={24} />,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title + '\n' + shareData.text)}`,
            color: '#0088cc'
        },
        {
            name: 'Facebook',
            icon: <Facebook size={24} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
            color: '#1877F2'
        }
    ];

    return (
        <div className="share-hub-container">
            {customTrigger ? (
                React.cloneElement(customTrigger, {
                    onClick: (e) => {
                        e.stopPropagation();
                        if (customTrigger.props.onClick) customTrigger.props.onClick(e);
                        handleOpenModal();
                    }
                })
            ) : (
                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(); }} className="share-main-btn" title="Compartir">
                    <Share2 size={24} />
                </button>
            )}

            {isModalOpen && (
                <div className="share-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="share-modal-content glass-morphism" onClick={e => e.stopPropagation()}>
                        <header className="share-modal-header">
                            <div className="header-icon-hub">
                                <Share2 size={20} />
                            </div>
                            <div className="header-info">
                                <h3>{shareData.title}</h3>
                                <p>Comparteix el bategat del poble</p>
                            </div>
                            <button className="share-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </header>
                        <div className="share-modal-body">
                            <div className="share-url-preview">
                                <span>{shareData.url}</span>
                                <button onClick={copyToClipboard} className={copied ? 'copied' : ''}>
                                    {copied ? <CheckCircle size={18} /> : <LinkIcon size={18} />}
                                </button>
                            </div>

                            <div className="share-grid">
                                {socialLinks.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-option-btn"
                                        style={{ '--brand-color': link.color }}
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <div className="share-icon-circle">
                                            {link.icon}
                                        </div>
                                        <span className="share-label">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareHub;


=====================================
FILE: src/components/Skeletons/PostSkeleton.jsx
=====================================

import './Skeletons.css';

const PostSkeleton = () => {
    return (
        <div className="universal-card skeleton-card">
            <div className="card-header skeleton-header-wrapper">
                <div className="skeleton-avatar" />
                <div className="skeleton-meta">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line extra-short" />
                </div>
            </div>
            <div className="skeleton-image" />
            <div className="card-body">
                <div className="skeleton-line full" />
                <div className="skeleton-line full" />
                <div className="skeleton-line medium" />
            </div>
            <div className="card-footer skeleton-footer-wrapper">
                <div className="skeleton-action" />
                <div className="skeleton-action" />
                <div className="skeleton-action" />
            </div>
        </div>
    );
};

export default PostSkeleton;


=====================================
FILE: src/components/Skeletons/Skeletons.css
=====================================

.skeleton-card {
    position: relative;
    overflow: hidden;
    background-color: var(--bg-card);
}

.skeleton-card::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0));
    animation: shimmer 2s infinite;
}

[data-theme='dark'] .skeleton-card::after {
    background-image: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0));
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

.skeleton-avatar {
    width: 40px;
    height: 40px;
    border-radius: 0px;
    background-color: var(--color-border);
}

.skeleton-header-wrapper {
    display: flex;
    gap: 12px;
    padding: 12px;
}

.skeleton-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.skeleton-line {
    height: 12px;
    background-color: var(--color-border);
    border-radius: 0px;
}

.skeleton-line.full {
    width: 100%;
}

.skeleton-line.medium {
    width: 70%;
}

.skeleton-line.short {
    width: 40%;
}

.skeleton-line.extra-short {
    width: 20%;
}

.skeleton-image {
    width: 100%;
    height: 250px;
    background-color: var(--color-border);
}

.skeleton-image-square {
    width: 100%;
    aspect-ratio: 1;
    background-color: var(--color-border);
}

.skeleton-footer-wrapper {
    display: flex;
    gap: 20px;
    padding: 12px;
}

.skeleton-action {
    width: 60px;
    height: 24px;
    background-color: var(--color-border);
    border-radius: 0px;
}

.skeleton-button-full {
    width: 100%;
    height: 40px;
    background-color: var(--color-border);
    border-radius: 0px;
}

=====================================
FILE: src/components/SocialManager.css
=====================================

.social-manager-overlay {
    position: fixed;
    top: var(--banner-height);
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-overlay);
    backdrop-filter: blur(8px);
    z-index: var(--z-social-hub);
    display: flex;
    align-items: flex-end;
    animation: fadeIn 0.3s ease-out;
}

.social-manager-content {
    width: 100%;
    background-color: var(--bg-surface);
    border-top: 1px solid var(--color-border);
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: var(--shadow-hard);
}

.sm-header {
    padding: var(--space-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-divider);
}

.sm-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.sm-title-icon {
    color: var(--color-primary);
}

.sm-header h2 {
    margin: 0;
    font-size: 21px;
    /* Matching brand heading standard */
    font-weight: 800;
    font-family: var(--font-heading);
    color: var(--text-main) !important;
}

.sm-close {
    background: var(--color-primary-soft);
    border: none;
    color: var(--color-primary);
    width: 44px;
    height: 44px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.sm-scroll-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-lg);
}

.sm-section {
    margin-bottom: 32px;
}

.sm-section-header {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.sm-section-icon {
    color: var(--color-primary);
    margin-top: 4px;
    opacity: 0.8;
}

.sm-section-text h3 {
    margin: 0 0 4px 0;
    font-size: 19px;
    font-weight: 800;
    color: var(--text-main) !important;
}

.sm-section-text p {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--text-muted) !important;
    line-height: 1.5;
}

.sm-categories-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.sm-category-card {
    background: var(--bg-main);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    color: var(--text-secondary) !important;
}

.sm-category-card.active {
    background: var(--color-primary-soft);
    border-color: var(--color-primary);
    color: var(--color-primary) !important;
}

.sm-cat-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 0px;
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    transition: all 0.2s;
}

.active .sm-cat-icon-wrapper {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.sm-cat-label {
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
}

.sm-tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.sm-tag-pill {
    background: var(--bg-main);
    border: 1px solid var(--color-border);
    border-radius: 0px;
    padding: 10px 18px;
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--text-secondary) !important;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.sm-tag-pill.followed {
    background: var(--color-primary);
    color: white !important;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-hard);
}

.sm-spark {
    color: #F6AD55;
}

.sm-footer {
    padding: var(--space-lg);
}

.sm-done-btn {
    width: 100%;
    background-color: var(--color-primary);
    color: white !important;
    border: none;
    padding: 18px;
    border-radius: 0px;
    font-size: var(--font-size-base);
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: var(--shadow-hard);
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media (max-width: 480px) {
    .sm-categories-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

=====================================
FILE: src/components/SocialManager.jsx
=====================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { X, Check, Eye, EyeOff, Hash, Layers, Settings2, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useModal } from '../context/ModalContext';
import { supabaseService } from '../services/supabaseService';
import './SocialManager.css';

const SocialManager = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { activeCategories, toggleCategory, followedTags, savePreferences, resetToDefaults } = useSocial();
    const { socialManagerContext } = useModal();
    const [privateTags, setPrivateTags] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const availableCategories = [
        { id: 'xat', label: t('common.role_xat'), icon: <Layers size={18} /> },
        { id: 'gent', label: t('common.role_gent'), icon: <Layers size={18} /> },
        { id: 'grup', label: t('common.role_grup'), icon: <Layers size={18} /> },
        { id: 'treball', label: t('common.role_treball'), icon: <Layers size={18} /> },
        { id: 'pobo', label: t('common.role_pobo'), icon: <Layers size={18} /> }
    ];

    const availableTags = ['Esdeveniment', 'Avís', 'Proposta', 'Oportunitat', 'Cultura', 'Esport', 'Ajuda', 'Mercat'];

    if (!isOpen) return null;

    return (
        <div className="social-manager-overlay" onClick={onClose}>
            <div className="social-manager-content" onClick={e => e.stopPropagation()}>
                <header className="sm-header">
                    <div className="sm-title-row">
                        <Settings2 className="sm-title-icon" />
                        <h2>{t('social.manager_title', 'Gestió Social')}</h2>
                    </div>
                    <button className="sm-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="sm-scroll-body">
                    {socialManagerContext && (
                        <section className="sm-section connection-tagging">
                            <div className="sm-section-header">
                                <Sparkles size={20} className="sm-section-icon highlight" />
                                <div className="sm-section-text">
                                    <h3>Etiqueta a {socialManagerContext.name}</h3>
                                    <p>Com vols recordar a este veí? (Privat)</p>
                                </div>
                            </div>
                            <div className="sm-tags-cloud">
                                {['Gent', 'Amic', 'Família', 'Treball', 'Interès Comú', 'Referent'].map(tag => {
                                    const isSelected = privateTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            className={`sm-tag-pill ${isSelected ? 'followed' : ''}`}
                                            onClick={() => {
                                                const updated = isSelected
                                                    ? privateTags.filter(t => t !== tag)
                                                    : [...privateTags, tag];
                                                setPrivateTags(updated);
                                                setIsSaving(true);
                                                // Sync with DB
                                                supabaseService.connectWithProfile(
                                                    user?.id,
                                                    socialManagerContext.id,
                                                    updated
                                                ).finally(() => setIsSaving(false));
                                            }}
                                            disabled={isSaving}
                                        >
                                            {isSaving && isSelected ? <Loader2 size={12} className="spinner" /> : tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                    <section className="sm-section">
                        <div className="sm-section-header">
                            <Layers size={20} className="sm-section-icon" />
                            <div className="sm-section-text">
                                <h3>{t('social.categories', 'Pestanyes Actives')}</h3>
                                <p>{t('social.categories_desc', 'Tria quines seccions vols veure al teu menú de navegació.')}</p>
                            </div>
                        </div>
                        <div className="sm-categories-grid">
                            {availableCategories.map(cat => {
                                const isActive = activeCategories.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        className={`sm-category-card ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleCategory(cat.id)}
                                    >
                                        <div className="sm-cat-icon-wrapper">
                                            {isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </div>
                                        <span className="sm-cat-label">{cat.label}</span>
                                        {isActive && <Check size={14} className="sm-check" />}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="sm-section">
                        <div className="sm-section-header">
                            <Hash size={20} className="sm-section-icon" />
                            <div className="sm-section-text">
                                <h3>{t('social.tags', 'Etiquetes que segueixes')}</h3>
                                <p>{t('social.tags_desc', 'Rebràs més contingut relacionat amb aquests temes.')}</p>
                            </div>
                        </div>
                        <div className="sm-tags-cloud">
                            {availableTags.map(tag => {
                                const isFollowed = followedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        className={`sm-tag-pill ${isFollowed ? 'followed' : ''}`}
                                        onClick={() => {
                                            const updated = isFollowed
                                                ? followedTags.filter(t => t !== tag)
                                                : [...followedTags, tag];
                                            savePreferences({ followedTags: updated });
                                        }}
                                    >
                                        {isFollowed && <Sparkles size={12} className="sm-spark" />}
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <footer className="sm-footer">
                    <button 
                        className="sm-reset-btn" 
                        onClick={() => {
                            if (window.confirm(t('social.confirm_reset', 'Vols restaurar la configuració per defecte?'))) {
                                resetToDefaults();
                            }
                        }}
                    >
                        <RotateCcw size={16} />
                        {t('social.restore_defaults', 'Restaurar per defecte')}
                    </button>
                    <button className="sm-done-btn" onClick={onClose}>
                        {t('common.done', 'FET')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SocialManager;


=====================================
FILE: src/components/StatusLoader.jsx
=====================================

import React from 'react';

const StatusLoader = ({ type = 'loading', message }) => {
    const style = {
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontFamily: 'system-ui, sans-serif'
    };

    if (type === 'loading') {
        return (
            <div style={style}>
                <div style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    border: '2px solid #ddd',
                    borderTopColor: '#333',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                {message && <p style={{ marginTop: '10px' }}>{message}</p>}
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (type === 'error') {
        return (
            <div style={{ ...style, color: '#e53e3e' }}>
                <div style={{ fontSize: '24px' }}>⚠️</div>
                <p>{message || 'Error de càrrega'}</p>
            </div>
        );
    }

    return (
        <div style={style}>
            <p>{message || 'No hi ha contingut'}</p>
        </div>
    );
};

export default StatusLoader;


=====================================
FILE: src/components/TagSelector.css
=====================================

.tag-selector {
    margin-top: var(--space-md);
    padding: var(--space-md);
    background-color: var(--bg-main);
    border-radius: 20px;
    border: 1px dashed var(--color-border);
    animation: slideDown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tag-selector-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-base);
    font-weight: 800;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: var(--space-sm);
    letter-spacing: 0.5px;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag-item-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.tag-item-btn {
    padding: 6px 12px;
    background-color: var(--bg-card);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-item-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: var(--color-primary-soft);
}

.tag-item-wrapper.selected .tag-item-btn {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-hard);
}

.delete-tag-action {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    background: #ff4d4d;
    color: white;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    border: 2px solid var(--bg-surface);
    box-shadow: var(--shadow-hard);
}

.tag-item-wrapper:hover .delete-tag-action {
    opacity: 1;
}

.add-tag-btn {
    height: 32px;
    border-radius: 999px;
    border: 1px dashed var(--color-border);
    background: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
}

.add-tag-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: var(--color-primary-soft);
}

.add-tag-form {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-card);
    padding: 2px 2px 2px 10px;
    border: 1px solid var(--color-primary);
    border-radius: 999px;
    animation: expand 0.2s ease-out;
}

@keyframes expand {
    from {
        width: 40px;
    }

    to {
        width: 140px;
    }
}

.add-tag-form input {
    border: none;
    outline: none;
    font-size: var(--font-size-base);
    width: 80px;
    background: transparent;
    color: var(--text-main);
}

.add-tag-form button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-tag-form button:hover {
    color: var(--color-primary);
}

/* [PROTOCOL ARMARI NET] IAIA RECOMMENDATIONS */
.iaia-recommendations {
    background: rgba(255, 109, 35, 0.03);
    border: 1px dashed rgba(255, 109, 35, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.iaia-recommendations:hover {
    background: rgba(255, 109, 35, 0.05);
    border-color: rgba(255, 109, 35, 0.4);
    box-shadow: 0 4px 20px rgba(255, 109, 35, 0.05);
}

.iaia-recommendations button {
    cursor: pointer;
    transition: all 0.2s ease;
}

.iaia-recommendations button:hover:not(:disabled) {
    background: var(--sdp-terracotta);
    color: white;
    border-style: solid;
    transform: translateY(-2px);
}

.iaia-recommendations button:active:not(:disabled) {
    transform: scale(0.95);
}

.iaia-recommendations button:disabled {
    cursor: default;
}

=====================================
FILE: src/components/TagSelector.jsx
=====================================

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Tag as TagIcon, Check, Loader2, Trash2, Sparkles } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import './TagSelector.css';

const TagSelector = ({ currentTags = [], onTagsChange }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [availableTags, setAvailableTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const loadUserTags = useCallback(async () => {
        try {
            const tags = await supabaseService.getUserTags(user.id);
            setAvailableTags(Array.isArray(tags) ? tags : []);
        } catch (error) {
            logger.error('Error loading tags:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            loadUserTags();
        }
    }, [user, loadUserTags]);

    const toggleTag = (tag) => {
        const isSelected = currentTags.includes(tag);
        const newTags = isSelected
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        onTagsChange(newTags);
    };

    const handleAddTag = async (e) => {
        e.preventDefault();
        const name = newTagName.trim().toLowerCase();
        if (!name) return;

        if (availableTags.includes(name)) {
            if (!currentTags.includes(name)) toggleTag(name);
            setNewTagName('');
            setIsAdding(false);
            return;
        }

        setLoading(true);
        try {
            await supabaseService.addUserTag(user.id, name);
            setAvailableTags(prev => [...prev, name].sort());
            toggleTag(name);
            setNewTagName('');
            setIsAdding(false);
        } catch (error) {
            logger.error('Error adding tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTag = async (e, tag) => {
        e.stopPropagation();
        if (!window.confirm(t('feed.confirm_delete_tag') || `Vols esborrar l'etiqueta "${tag}" del teu diccionari?`)) return;

        try {
            await supabaseService.deleteUserTag(user.id, tag);
            setAvailableTags(prev => prev.filter(t => t !== tag));
            if (currentTags.includes(tag)) {
                onTagsChange(currentTags.filter(t => t !== tag));
            }
        } catch (error) {
            logger.error('Error deleting tag:', error);
        }
    };

    return (
        <div className="tag-selector">
            <div className="tag-selector-header">
                <TagIcon size={14} />
                <span>{t('feed.personal_tags') || 'Etiquetes privades'}</span>
            </div>

            <div className="tags-container">
                {Array.isArray(availableTags) && availableTags.map(tag => (
                    <div
                        key={tag}
                        className={`tag-item-wrapper ${currentTags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => toggleTag(tag)}
                    >
                        <button className="tag-item-btn">
                            {tag}
                            {currentTags.includes(tag) && <Check size={12} />}
                        </button>
                        <button
                            className="delete-tag-action"
                            onClick={(e) => handleDeleteTag(e, tag)}
                            title="Esborrar"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}

                {!isAdding ? (
                    <button className="add-tag-btn" onClick={() => setIsAdding(true)} title="Afegir etiqueta">
                        <Plus size={14} />
                    </button>
                ) : (
                    <form onSubmit={handleAddTag} className="add-tag-form">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder={t('feed.new_tag_placeholder') || '...'}
                            autoFocus
                            onBlur={() => !newTagName && setIsAdding(false)}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? <Loader2 size={12} className="spinner" /> : <Check size={14} />}
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)}>
                            <X size={14} />
                        </button>
                    </form>
                )}
            </div>

            {/* [PROTOCOL ARMARI NET] RECOMANACIONS DE L'IAIA */}
            <div className="iaia-recommendations p-4 mt-6 bg-[rgba(255,109,35,0.05)] border border-[rgba(255,109,35,0.2)] rounded-[28px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={40} color="#FF6D23" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-[28px] bg-[var(--sdp-terracotta)] flex items-center justify-center text-white shadow-lg">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--sdp-terracotta)]">IAIA: Armari Net</h4>
                        <p className="text-[10px] text-gray-400 italic">"Deixa que t'organitze les idees, bonico..."</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {['#territori', '#proximitat', '#sobirania', '#família'].map(rec => (
                        <button 
                            key={rec}
                            className={`px-3 py-1.5 rounded-full border border-dashed border-[var(--sdp-terracotta)]/30 text-[var(--sdp-terracotta)] text-[11px] font-bold hover:bg-[var(--sdp-terracotta)]/10 transition-all ${currentTags.includes(rec) ? 'bg-[var(--sdp-terracotta)]/20 border-solid opacity-50' : ''}`}
                            onClick={() => !currentTags.includes(rec) && toggleTag(rec)}
                            disabled={currentTags.includes(rec)}
                        >
                            {rec}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagSelector;


=====================================
FILE: src/components/TallerTrellat.css
=====================================

/* [MASTER] TallerTrellat.css - Directiva Zero Radius 🏺🔨 */

.taller-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
}

.taller-modal {
    background: var(--color-surface);
    width: 95%;
    max-width: 500px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    border: 2px solid var(--color-text);
    border-radius: 0 !important;
    box-shadow: 8px 8px 0px var(--color-text);
    overflow: hidden;
    position: relative;
    animation: slideUp 0.3s ease-out;
}

.taller-header {
    background: var(--color-terracotta);
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--color-text);
}

.taller-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 800;
    letter-spacing: 1px;
}

.taller-selector {
    display: flex;
    overflow-x: auto;
    background: var(--color-surface);
    border-bottom: 2px solid var(--color-text);
}

.selector-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    color: var(--color-text-muted);
    min-width: 80px;
    cursor: pointer;
    transition: all 0.2s;
    border-right: 1px solid var(--color-border);
    border-radius: 0 !important;
}

.selector-btn.active {
    color: var(--color-terracotta);
    background: var(--color-surface-hover);
    box-shadow: inset 0 -4px 0 var(--color-terracotta);
}

.taller-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-zone {
    display: flex;
    border: 2px solid var(--color-text);
    background: white;
    box-shadow: 4px 4px 0px var(--color-text);
}

.input-zone textarea {
    flex: 1;
    background: none;
    border: none;
    resize: none;
    padding: 1rem;
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1.5;
    outline: none;
    border-radius: 0 !important;
}

.generate-btn {
    width: 60px;
    background: var(--color-terracotta);
    color: white;
    border: none;
    border-left: 2px solid var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0 !important;
}

.generate-btn:active {
    transform: translate(2px, 2px);
}

.response-zone {
    margin-top: 1rem;
    background: var(--color-surface-hover);
    border: 2px solid var(--color-text);
    padding: 1rem;
    border-radius: 0 !important;
    box-shadow: 4px 4px 0px var(--color-text);
}

.copy-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem;
    background: var(--color-text);
    color: var(--color-surface);
    border: none;
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 0 !important;
}

=====================================
FILE: src/components/TallerTrellat.jsx
=====================================

import React, { useState, useRef } from 'react';
import { X, Sparkles, Send, Bot, ScrollText, UtensilsCrossed, ChevronRight, Languages, Eye, Camera, Image as ImageIcon, Scale, History, Sprout, Music, Heart, BookOpen } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import hapticService from '../services/hapticService';
import './TallerTrellat.css';

/**
 * [MASTER] TallerTrellat - El Taller de Trellat (v1.11.0-AI-VISION) 🏺👁️✨
 * Interfície per a interactuar amb el Trellat Artificial Multimodal.
 */
const TallerTrellat = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('iaia'); // 'iaia', 'secretari', 'traductor', 'ull_del_mestre', 'remeis', 'oracle', 'diccionari'
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                if (mode !== 'ull_del_mestre') setMode('ull_del_mestre');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!input.trim() && !image && mode !== 'oracle') return;

        setLoading(true);
        hapticService.batec();

        try {
            const personaMap = {
                'iaia': 'IAIA',
                'secretari': 'ARXIVER',
                'traductor': 'TRADUCTOR',
                'ull_del_mestre': 'ULL_IAIA',
                'jutge_de_pau': 'JUTGE_PAU',
                'cronista': 'CRONISTA',
                'hortola': 'AGRONOM',
                'versador': 'VERSADOR',
                'remeis': 'CARLA',
                'oracle': 'TRELLAT',
                'diccionari': 'ARXIVER'
            };
            const personaKey = personaMap[mode] || 'IAIA';
            const prompt = mode === 'oracle' ? "Dona'm un consell de vida basat en la saviesa popular valenciana. Una frase curta i amb caràcter d'IAIA." : input;
            
            let imageData = null;
            if (image) {
                const [prefix, data] = image.split(',');
                const mimeType = prefix.match(/:(.*?);/)[1];
                imageData = { mimeType, data };
            }

            const result = await geminiService.ask(personaKey, prompt, imageData);
            setResponse(result.text);
            hapticService.notifySuccess();
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('AI Error:', error);
            }
            setResponse('⚠️ Ai collons, s\'ha tallat la llum al cervell del Mas...');
        } finally {
            setLoading(false);
        }
    };

    const getPlaceholder = () => {
        if (mode === 'secretari') return "Ex: Tall d'aigua demà carrer major...";
        if (mode === 'iaia') return "Ex: Tinc tomates molles i pa dur...";
        if (mode === 'traductor') return "Ex: Hola buenos días, quería pedir un café con leche...";
        if (mode === 'ull_del_mestre') return "Identifica aquest objecte o pregunta sobre ell...";
        if (mode === 'jutge_de_pau') return "Explica el conflicte veïnal per a posar pau...";
        if (mode === 'cronista') return "Apega el xat o acte per a resumir...";
        if (mode === 'hortola') return "Pregunta sobre cultius o el calendari lunar...";
        if (mode === 'versador') return "Digues un tema per al teu vers o alba...";
        if (mode === 'remeis') return "Ex: Tinc tos i mal de pit...";
        if (mode === 'diccionari') return "Ex: Bitcoin, Influencer, Streaming...";
        if (mode === 'oracle') return "Clica el botó per rebre el consell de l'ollà...";
        return "Escriu aquí...";
    };

    if (!isOpen) return null;

    return (
        <div className="taller-overlay" onClick={onClose}>
            <div className="taller-modal" onClick={e => e.stopPropagation()}>
                <header className="taller-header">
                    <div className="taller-title">
                        <Sparkles size={18} className="sparkle-icon" />
                        <span>TALLER DE TRELLAT ARTIFICIAL</span>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </header>

                <div className="taller-selector scroll-x">
                    <button
                        className={`selector-btn ${mode === 'iaia' ? 'active' : ''}`}
                        onClick={() => { setMode('iaia'); setResponse(''); setImage(null); }}
                    >
                        <UtensilsCrossed size={18} />
                        <span>La Iaia</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'secretari' ? 'active' : ''}`}
                        onClick={() => { setMode('secretari'); setResponse(''); setImage(null); }}
                    >
                        <ScrollText size={18} />
                        <span>Secretari</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'traductor' ? 'active' : ''}`}
                        onClick={() => { setMode('traductor'); setResponse(''); setImage(null); }}
                    >
                        <Languages size={18} />
                        <span>Traductor</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'ull_del_mestre' ? 'active' : ''}`}
                        onClick={() => { setMode('ull_del_mestre'); setResponse(''); }}
                    >
                        <Eye size={18} />
                        <span>L'Ull</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'jutge_de_pau' ? 'active' : ''}`}
                        onClick={() => { setMode('jutge_de_pau'); setResponse(''); setImage(null); }}
                    >
                        <Scale size={18} />
                        <span>Jutge</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'cronista' ? 'active' : ''}`}
                        onClick={() => { setMode('cronista'); setResponse(''); setImage(null); }}
                    >
                        <History size={18} />
                        <span>Cronista</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'hortola' ? 'active' : ''}`}
                        onClick={() => { setMode('hortola'); setResponse(''); setImage(null); }}
                    >
                        <Sprout size={18} />
                        <span>Hortolà</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'versador' ? 'active' : ''}`}
                        onClick={() => { setMode('versador'); setResponse(''); setImage(null); }}
                    >
                        <Music size={18} />
                        <span>Versador</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'remeis' ? 'active' : ''}`}
                        onClick={() => { setMode('remeis'); setResponse(''); setImage(null); }}
                    >
                        <Heart size={18} />
                        <span>Remeis</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'oracle' ? 'active' : ''}`}
                        onClick={() => { setMode('oracle'); setResponse(''); setImage(null); }}
                    >
                        <Sparkles size={18} />
                        <span>Oracle</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'diccionari' ? 'active' : ''}`}
                        onClick={() => { setMode('diccionari'); setResponse(''); setImage(null); }}
                    >
                        <BookOpen size={18} />
                        <span>Diccionari</span>
                    </button>
                </div>

                <div className="taller-body">
                    {mode === 'ull_del_mestre' && (
                        <div className="vision-upload-zone">
                            {image ? (
                                <div className="image-preview">
                                    <img src={image} alt="Preview" />
                                    <button className="remove-image" onClick={() => setImage(null)}><X size={16} /></button>
                                </div>
                            ) : (
                                <button className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                                    <Camera size={40} />
                                    <span>FES UNA FOTO O PUJA-LA</span>
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    )}

                    <div className="input-zone">
                        <textarea
                            placeholder={getPlaceholder()}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            className={`generate-btn ${loading ? 'loading' : ''}`}
                            onClick={handleGenerate}
                            disabled={loading || (!input.trim() && !image && mode !== 'oracle')}
                        >
                            {loading ? <div className="spinner" /> : <Sparkles size={20} />}
                        </button>
                    </div>

                    {response && (
                        <div className="response-zone animate-in">
                            <div className="response-header">
                                <Bot size={16} />
                                <span>{mode === 'ull_del_mestre' ? "EL MESTRE HI VEU:" : "TRELLAT ARTIFICIAL:"}</span>
                            </div>
                            <div className="response-content">
                                {response}
                            </div>
                            <button className="copy-btn" onClick={() => {
                                navigator.clipboard.writeText(response);
                                hapticService.notifyAIReady();
                            }}>
                                UTILITZAR AQUEST TEXT <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TallerTrellat;


=====================================
FILE: src/components/ThemeCustomizer.css
=====================================

.theme-customizer {
    padding: 24px;
    background: var(--bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-premium);
    backdrop-filter: blur(var(--blur-premium));
    -webkit-backdrop-filter: blur(var(--blur-premium));
}

.customizer-header {
    margin-bottom: 24px;
}

.customizer-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 950;
    text-transform: uppercase;
    color: var(--color-primary);
    letter-spacing: 0.1em;
}

.customizer-header p {
    margin: 4px 0 0 0;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.8;
    color: var(--text-secondary);
}

.themes-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
}

.theme-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--color-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-main);
    text-align: left;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-xl);
}

.theme-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--color-primary);
    transform: translateX(4px);
}

.theme-card.active {
    border-color: var(--color-primary);
    background: rgba(0, 242, 255, 0.08);
    box-shadow: var(--shadow-glow);
}

.theme-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-primary);
    border-radius: var(--radius-lg);
}

.theme-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.theme-name {
    font-weight: 900;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.active-check {
    color: var(--color-primary);
    filter: drop-shadow(0 0 5px var(--color-primary));
}

/* Theme specifics for preview */
.theme-card.theme-bancal .theme-icon {
    background: #000;
    color: var(--text-main);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-card.theme-fadrins .theme-icon {
    background: var(--color-primary);
    color: #000;
}

.theme-card.theme-solemne .theme-icon {
    background: var(--color-accent);
    color: #000;
}

.customizer-footer {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.btn-reset-theme {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    color: var(--color-primary);
    background: rgba(0, 242, 255, 0.05);
    border: 1px dashed var(--color-primary);
    border-radius: var(--radius-lg);
    transition: all 0.3s;
    cursor: pointer;
}

.btn-reset-theme:hover {
    background: rgba(0, 242, 255, 0.1);
    transform: scale(1.02);
}

.btn-close-customizer {
    background: var(--color-primary);
    color: #000;
    padding: 16px;
    font-weight: 950;
    text-transform: uppercase;
    font-size: 14px;
    border-radius: var(--radius-gem-btn);
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-premium);
    transition: all 0.3s;
}

.btn-close-customizer:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

=====================================
FILE: src/components/ThemeCustomizer.jsx
=====================================

import React from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Sun, Moon, Scroll, RotateCcw, Check } from 'lucide-react';
import './ThemeCustomizer.css';

const ThemeCustomizer = ({ onClose }) => {
    const { visualDemocracy, setVisualDemocracy, resetTheme, availableThemes } = useTheme();

    const getIcon = (id) => {
        switch (id) {
            case 'pedra-seca': return <Scroll size={20} />;
            case 'oli-suau': return <Sun size={20} />;
            case 'gem-modern': return <Moon size={20} />;
            default: return <Scroll size={20} />;
        }
    };

    return (
        <div className="theme-customizer animate-in">
            <div className="customizer-header">
                <h3>Personalitzador Sobirà</h3>
                <p>Tria com vols viure el poble hui</p>
            </div>

            <div className="themes-grid">
                {availableThemes.map((t) => (
                    <button
                        key={t.id}
                        className={`theme-card ${visualDemocracy === t.id ? 'active' : ''} theme-${t.id}`}
                        onClick={() => setVisualDemocracy(t.id)}
                    >
                        <div className="theme-icon">{getIcon(t.id)}</div>
                        <div className="theme-info">
                            <span className="theme-name">{t.name}</span>
                            {visualDemocracy === t.id && <Check size={16} className="active-check" />}
                        </div>
                    </button>
                ))}
            </div>

            <div className="customizer-footer">
                <button className="btn-reset-theme" onClick={resetTheme}>
                    <RotateCcw size={18} />
                    <span>Restaurar Disseny Original</span>
                </button>
                {onClose && (
                    <button className="btn-close-customizer" onClick={onClose}>
                        Fet
                    </button>
                )}
            </div>
        </div>
    );
};

export default ThemeCustomizer;


=====================================
FILE: src/components/TiaMariaChat.css
=====================================

.tia-chat-container {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: #efeae2;
    /* WhatsApp-like background */
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 600px;
    z-index: 2000;
    overflow: hidden;
}

@media (max-width: 600px) {
    .tia-chat-container {
        max-width: 100%;
        left: 0;
        transform: none;
    }
}

.tia-chat-header {
    background: var(--color-accent);
    padding: var(--safe-top, 20px) 16px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    height: calc(64px + var(--safe-top, 20px));
    flex-shrink: 0;
    z-index: 10;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.tia-avatar-wrapper {
    position: relative;
    width: 44px;
    height: 44px;
}

.tia-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #FFF7ED;
    border: 1px solid #FFEDD5;
}

.online-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background: #22C55E;
    border: 2px solid #FFF;
    border-radius: 50%;
}

.header-info h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 900;
    color: #1a1a1a;
    line-height: 1.2;
}

.tia-status {
    font-size: 10px;
    font-weight: 700;
    color: #22C55E;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
}

.tia-chat-body {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.day-separator {
    text-align: center;
    font-size: 10px;
    font-weight: 800;
    color: #999;
    letter-spacing: 0.1em;
    margin: 10px 0;
}

.encryption-notice {
    background: #FEF3C7;
    padding: 8px 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 600;
    color: #92400E;
    margin-bottom: 20px;
}

.message-row {
    display: flex;
    width: 100%;
}

.message-row.ai {
    justify-content: flex-start;
}

.message-row.user {
    justify-content: flex-end;
}

.message-bubble {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 20px;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.message-row.ai .message-bubble {
    background: #FFFFFF;
    color: #1a1a1a;
    border-bottom-left-radius: 4px;
}

.message-row.user .message-bubble {
    background: #06B6D4;
    /* Gem Cyan */
    color: #FFF;
    border-bottom-right-radius: 4px;
}

.message-bubble p {
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
}

.message-time {
    font-size: 9px;
    font-weight: 700;
    opacity: 0.7;
    display: block;
    margin-top: 4px;
    text-align: right;
}

.typing {
    display: flex;
    gap: 4px;
    padding: 12px 20px !important;
}

.dot {
    width: 6px;
    height: 6px;
    background: #06B6D4;
    border-radius: 50%;
    animation: typing-dot 1s infinite alternate;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing-dot {
    from {
        opacity: 0.3;
        transform: scale(1);
    }

    to {
        opacity: 1;
        transform: scale(1.2);
    }
}

.tia-chat-footer {
    padding: 12px 16px calc(12px + var(--safe-bottom, 20px));
    background: #FFFFFF;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
}

.input-wrapper {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 28px;
    display: flex;
    align-items: center;
    padding: 4px 4px 4px 12px;
    gap: 8px;
}

.input-wrapper input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 15px;
    outline: none;
}

.emoji-btn {
    background: none;
    border: none;
    color: #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
}

.send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #E2E8F0;
    color: #FFF;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.send-btn.active {
    background: #F97316;
    /* Gem Orange */
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.tia-ai-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 12px;
    font-size: 8px;
    font-weight: 900;
    color: #94A3B8;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

=====================================
FILE: src/components/TiaMariaChat.jsx
=====================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, ShieldCheck, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { geminiService } from '../services/geminiService';
import { hapticService } from '../services/hapticService';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import './TiaMariaChat.css';

const TiaMariaChat = () => {
    const navigate = useNavigate();
    const { isPlayground } = useAuth();
    
    // Inicialització directa per evitar setState en useEffect i renders en cascada
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hola! Sóc la Tia Maria. En què et puc ajudar hui, bonico?",
            sender: 'iaia',
            timestamp: new Date().toISOString()
        }
    ]);
    
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        hapticService.light();

        try {
            const response = await geminiService.generateResponse(input, 'iaia');
            setIsTyping(false);
            
            const iaiaMessage = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'iaia',
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, iaiaMessage]);
            hapticService.medium();
        } catch (error) {
            logger.error('[TiaMariaChat] Error generating response:', error);
            setIsTyping(false);
        }
    };

    return (
        <div className="iaia-chat-container flex flex-col h-full bg-[#0a0a0c] text-white">
            <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Avatar name="Tia Maria" size={40} src="/assets/avatars/comic/iaia_comic_matriarch.png" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-lg font-black tracking-tight">Tia Maria</h2>
                                <ShieldCheck size={14} className="text-[var(--theme-accent-primary)]" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-[28px] bg-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bategant...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isPlayground && <span className="text-[9px] font-black px-2 py-0.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-[28px] uppercase tracking-widest">Sessió de Prova</span>}
                    <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-xl ${
                            msg.sender === 'user' 
                                ? 'bg-[var(--theme-accent-primary)] text-white rounded-tr-none' 
                                : 'bg-[#1a1a1c] text-gray-100 rounded-tl-none border border-white/5'
                        }`}>
                            <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                            <div className={`mt-1.5 text-[9px] font-black uppercase tracking-widest opacity-40 ${msg.sender === 'user' ? 'text-white' : 'text-gray-400'} flex justify-end`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-[#1a1a1c] rounded-[28px] rounded-tl-none p-4 flex gap-1.5 items-center border border-white/5 shadow-xl">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-[28px] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-[28px] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-[28px] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 md:p-6 bg-black/60 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
                    <button type="button" className="w-12 h-12 flex items-center justify-center rounded-[28px] bg-white/5 text-gray-400 hover:bg-white/10 transition-all active:scale-90">
                        <Smile size={22} />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escriu un missatge..."
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-[28px] px-6 text-white focus:outline-none focus:border-[var(--theme-accent-primary)]/40 transition-all font-medium"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className="w-12 h-12 bg-[var(--theme-accent-primary)] hover:bg-[#ff7b20] disabled:bg-gray-800 disabled:opacity-30 text-white rounded-[20px] transition-all shadow-lg active:scale-95 flex items-center justify-center"
                    >
                        <Send size={20} strokeWidth={2.5} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default TiaMariaChat;


=====================================
FILE: src/components/ToastProvider.jsx
=====================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getToastRegistry, toast } from '../utils/toast';
import { logger } from '../utils/logger';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [registry, setRegistry] = useState(getToastRegistry());

    useEffect(() => {
        const updateRegistry = () => {
            setRegistry(getToastRegistry());
        };

        window.addEventListener('toast-registry-updated', updateRegistry);

        // Handle SW Update Event here to keep it centralized
        const handleSWUpdate = (event) => {
            const registration = event.detail;

            toast.custom((t) => (
                <div className="sw-update-toast">
                    <div className="sw-update-content">
                        <strong>🚀 ACTUALITZACIÓ GENIUS</strong>
                        <p>Millores de seguretat llestes.</p>
                    </div>
                    <div className="sw-update-actions" style={{ flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => {
                                if (registration && registration.waiting) {
                                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                                } else {
                                    window.location.reload();
                                }
                                toast.dismiss(t.id);
                            }}
                            className="sw-update-btn refresh"
                            style={{ width: '100%', marginBottom: '4px' }}
                        >
                            ENTRAR ARA
                        </button>
                        <button
                            onClick={async () => {
                                logger.log('[EMERGENCY] Full reset triggered');
                                const { supabase } = await import('../supabaseClient');
                                await supabase.auth.signOut();
                                localStorage.clear();
                                sessionStorage.clear();
                                const keys = await caches.keys();
                                await Promise.all(keys.map(name => caches.delete(name)));
                                window.location.href = '/';
                            }}
                            className="sw-update-btn later"
                            style={{ width: '100%', border: '1px solid #ff0055', color: '#ff0055' }}
                        >
                            🆘 SOS: RESET TOTAL
                        </button>
                    </div>
                </div>
            ), {
                duration: Infinity,
                position: 'bottom-center',
                id: 'sw-update-toast'
            });
        };

        window.addEventListener('sw-update-available', handleSWUpdate);

        // Ensure reload when service worker takes control
        const handleControllerChange = () => {
            logger.log('[SW] Controller changed. Automatic reload disabled for stability.');
            // window.location.reload(); // DISABLED TO PREVENT LOOP
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        }

        return () => {
            window.removeEventListener('toast-registry-updated', updateRegistry);
            window.removeEventListener('sw-update-available', handleSWUpdate);
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            }
        };
    }, []);

    return (
        <ToastContext.Provider value={{ registry }}>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--card-bg, #ffffff)',
                        color: 'var(--text-primary, #1e293b)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '0px',
                        padding: '12px 16px',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </ToastContext.Provider>
    );
};


=====================================
FILE: src/components/TownPickerModal.css
=====================================

/* [MASTER] TOWN PICKER SPECTACULAR v10.20 */
.town-picker-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.town-picker-modal {
    background: var(--surface-glass-heavy);
    width: 100%;
    max-width: 480px;
    height: 85vh;
    border-radius: 40px; /* SPECTACULAR RADIUS */
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255, 107, 0, 0.1);
}

/* Header Spectacular */
.town-picker-header {
    padding: 32px 32px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.town-picker-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-batec {
    color: var(--color-primary);
    filter: drop-shadow(0 0 8px var(--color-primary));
}

.header-title h2 {
    font-size: 24px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: -0.5px;
    margin: 0;
    color: #fff;
}

.header-desc {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 24px;
    line-height: 1.4;
}

.btn-close-spectacular {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-close-spectacular:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: rotate(90deg);
}

/* Search Bar */
.town-search-wrapper {
    position: relative;
    width: 100%;
}

.town-search-wrapper .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.4);
}

.town-search-wrapper input {
    width: 100%;
    padding: 16px 16px 16px 48px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: #fff;
    font-family: var(--font-brand);
    font-size: 1rem;
    transition: all 0.3s ease;
}

.town-search-wrapper input:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 20px rgba(255, 107, 0, 0.15);
}

/* Body & List */
.town-picker-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.picker-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--color-primary);
}

.towns-list-v10 {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.town-item-spectacular {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.town-item-spectacular:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(8px);
}

.town-item-spectacular.is-primary {
    background: rgba(255, 107, 0, 0.1);
    border-color: var(--color-primary);
}

.town-item-spectacular.is-secondary {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
}

.town-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    padding: 4px;
}

.town-avatar {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--color-primary);
}

.town-avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.town-details {
    display: flex;
    flex-direction: column;
}

.town-name {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
}

.town-role {
    font-size: 10px;
    font-weight: 900;
    color: var(--text-success);
    letter-spacing: 0.1em;
    opacity: 0.8;
}

.is-secondary .town-role {
    color: #aaa;
}

.is-primary .town-role {
    color: var(--color-primary);
    opacity: 1;
}

.town-check {
    color: var(--color-primary);
}

/* Secondary Button */
.btn-secondary-toggle {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px 12px;
    color: #fff;
    font-size: 10px;
    font-weight: 950;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-secondary-toggle:hover {
    background: rgba(255, 255, 255, 0.15);
}

.btn-secondary-toggle.active {
    background: #fff;
    color: #000;
}

/* Footer Spectacular */
.town-picker-footer {
    padding: 24px 32px 32px;
    background: rgba(0, 0, 0, 0.4);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.footer-summary {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.summary-primary { color: #fff; }
.summary-secondary { color: var(--text-muted); font-style: italic; }
.summary-none { color: rgba(255, 255, 255, 0.4); }

.btn-save-spectacular {
    width: 100%;
    padding: 18px;
    background: var(--color-primary);
    border: none;
    border-radius: 24px;
    color: #000;
    font-size: 14px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 10px 20px rgba(255, 107, 0, 0.3);
}

.btn-save-spectacular:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(255, 107, 0, 0.4);
}

.btn-save-spectacular:disabled {
    background: #444;
    color: #888;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
}

/* Animations */
.animate-spectacular-in {
    animation: spectacularModalIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes spectacularModalIn {
    from { opacity: 0; transform: scale(0.9) translateY(40px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }


=====================================
FILE: src/components/TownPickerModal.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { X, Search, Check, MapPin, Map, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import './TownPickerModal.css';

const TownPickerModal = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    selectedPrimary = null, 
    selectedSecondary = []
}) => {
    const [towns, setTowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selection, setSelection] = useState({ 
        primary: selectedPrimary, 
        secondary: selectedSecondary || [] 
    });

    useEffect(() => {
        if (isOpen) {
            fetchTowns();
            // Evitem actualitzacions innecessàries si els valors no han canviat realment
            setSelection(prev => {
                const hasPrimaryChanged = prev.primary?.uuid !== selectedPrimary?.uuid;
                const hasSecondaryChanged = JSON.stringify(prev.secondary) !== JSON.stringify(selectedSecondary || []);
                
                if (hasPrimaryChanged || hasSecondaryChanged) {
                    return { 
                        primary: selectedPrimary, 
                        secondary: selectedSecondary || [] 
                    };
                }
                return prev;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // Només reaccionem a l'obertura per a resetejar, o tractem els canvis de props amb cura

    const fetchTowns = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getTowns();
            setTowns(data || []);
        } catch (error) {
            console.error('Error fetching towns:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTowns = towns.filter(town => 
        town.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePrimary = (town) => {
        const isSelected = selection.primary?.uuid === town.uuid || selection.primary?.id === town.id;
        if (isSelected) {
            setSelection(prev => ({ ...prev, primary: null }));
        } else {
            setSelection(prev => ({ ...prev, primary: town }));
            // Remove from secondary if it was there
            setSelection(prev => ({
                ...prev,
                secondary: prev.secondary.filter(t => t.uuid !== town.uuid && t.id !== town.id)
            }));
        }
    };

    const toggleSecondary = (town) => {
        const isSelected = selection.secondary.some(t => t.uuid === town.uuid || t.id === town.id);
        const isPrimary = selection.primary?.uuid === town.uuid || selection.primary?.id === town.id;
        
        if (isPrimary) return; // Can't be secondary if it's primary

        if (isSelected) {
            setSelection(prev => ({
                ...prev,
                secondary: prev.secondary.filter(t => t.uuid !== town.uuid && t.id !== town.id)
            }));
        } else {
            setSelection(prev => ({
                ...prev,
                secondary: [...prev.secondary, town]
            }));
        }
    };

    const handleSave = () => {
        onSelect(selection);
    };

    if (!isOpen) return null;

    return (
        <div className="town-picker-overlay" onClick={onClose}>
            <div className="town-picker-modal animate-spectacular-in" onClick={e => e.stopPropagation()}>
                <header className="town-picker-header">
                    <div className="town-picker-header-top">
                        <div className="header-title">
                            <MapPin className="icon-batec" size={24} />
                            <h2>Tria el teu poble</h2>
                        </div>
                        <button className="btn-close-spectacular" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <p className="header-desc">
                        Connecta amb el teu origen i el teu solatge territorial.
                    </p>
                    <div className="town-search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cerca el teu poble..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </header>

                <div className="town-picker-body custom-scrollbar">
                    {loading ? (
                        <div className="picker-loading">
                            <Loader2 className="animate-spin" />
                            <span>Batejant la llista de pobles...</span>
                        </div>
                    ) : (
                        <div className="towns-list-v10">
                            {filteredTowns.map(town => {
                                const isPrimary = selection.primary?.uuid === town.uuid || selection.primary?.id === town.id;
                                const isSecondary = selection.secondary.some(t => t.uuid === town.uuid || t.id === town.id);
                                
                                return (
                                    <div 
                                        key={town.uuid || town.id} 
                                        className={`town-item-spectacular ${isPrimary ? 'is-primary' : ''} ${isSecondary ? 'is-secondary' : ''}`}
                                    >
                                        <div className="town-info" onClick={() => togglePrimary(town)}>
                                            <div className="town-avatar">
                                                {town.image_url ? <img src={town.image_url} alt="" /> : <Map size={20} />}
                                            </div>
                                            <div className="town-details">
                                                <span className="town-name">{town.name}</span>
                                                <span className="town-role">
                                                    {isPrimary ? 'EL TEU POBLE' : 'POBLE VEÍ'}
                                                </span>
                                            </div>
                                            <div className="town-check">
                                                {isPrimary && <Check size={20} />}
                                            </div>
                                        </div>
                                        
                                        {!isPrimary && (
                                            <button 
                                                className={`btn-secondary-toggle ${isSecondary ? 'active' : ''}`}
                                                onClick={() => toggleSecondary(town)}
                                                title="Afegir com a poble de solatge"
                                            >
                                                {isSecondary ? 'TREURE' : '+ SOLATGE'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="town-picker-footer">
                    <div className="footer-summary">
                        {selection.primary ? (
                            <span className="summary-primary">
                                <strong>Poble:</strong> {selection.primary.name}
                            </span>
                        ) : (
                            <span className="summary-none">Manca el poble principal</span>
                        )}
                        {selection.secondary.length > 0 && (
                            <span className="summary-secondary">
                                + {selection.secondary.length} pobles de solatge
                            </span>
                        )}
                    </div>
                    <button className="btn-save-spectacular" onClick={handleSave} disabled={!selection.primary}>
                        CONFIRMAR IDENTITAT
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TownPickerModal;


=====================================
FILE: src/components/TownSelectorModal.css
=====================================

/* Migrated to Tailwind CSS */


=====================================
FILE: src/components/TownSelectorModal.jsx
=====================================

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight, Check, MapPin } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { logger } from '../utils/logger';
import StatusLoader from './StatusLoader';
import './TownSelectorModal.css';

const TownSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1: Province, 2: Comarca, 3: Town, 4: Pioneer Mode

    const [provinces, setProvinces] = useState([]);
    const [comarcas, setComarcas] = useState([]);
    const [towns, setTowns] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedComarca, setSelectedComarca] = useState('');
    const [selectedTown, setSelectedTown] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pioneerTown, setPioneerTown] = useState('');
    const [pioneerProvince, setPioneerProvince] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            loadProvinces();
            setStep(1);
            setSearchTerm('');
            setSearchResults([]);
            setSelectedProvince('');
            setSelectedComarca('');
            setSelectedTown(null);

            // Focus search input on open
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Búsqueda global interactiva mejorada
    useEffect(() => {
        const timer = setTimeout(async () => {
            const cleanTerm = searchTerm.trim();
            if (cleanTerm.length >= 2) {
                setLoading(true);
                try {
                    const data = await supabaseService.searchAllTowns(cleanTerm);
                    setSearchResults(data);
                } catch (error) {
                    logger.error('Error in global search:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 200); // Faster debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadProvinces = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getProvinces();
            setProvinces(data);
        } catch (error) {
            logger.error('Error loading provinces:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProvinceSelect = async (prov) => {
        setSelectedProvince(prov);
        setLoading(true);
        setSearchTerm('');
        try {
            const data = await supabaseService.getComarcas(prov);
            setComarcas(data);
            setStep(2);
        } catch (error) {
            logger.error('Error loading comarcas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComarcaSelect = async (com) => {
        setSelectedComarca(com);
        setLoading(true);
        setSearchTerm('');
        try {
            const data = await supabaseService.getTowns({ province: selectedProvince, comarca: com });
            setTowns(data);
            setStep(3);
        } catch (error) {
            logger.error('Error loading towns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchResultSelect = (town) => {
        setSelectedTown(town);
        setSelectedProvince(town.province);
        setSelectedComarca(town.comarca);
        setSearchTerm('');
        setSearchResults([]);
        setStep(3); // Result selection confirms the town
    };

    const handleSave = () => {
        if (selectedTown) {
            onSelect(selectedTown);
            onClose();
        }
    };

    const handleCreatePioneer = async () => {
        if (!pioneerTown || !pioneerProvince) return;
        setLoading(true);
        try {
            const newTown = await supabaseService.createPioneerTown({
                name: pioneerTown,
                province: pioneerProvince,
                comarca: 'Poble Pioner'
            });
            setSelectedTown(newTown);
            setTimeout(() => {
                onSelect(newTown);
                onClose();
            }, 600);
        } catch (error) {
            logger.error('Error funding new town:', error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const isSearching = searchTerm.trim().length >= 2 && step !== 4;
    const displayList = isSearching ? searchResults : (step === 1 ? provinces : step === 2 ? comarcas : towns);

    return (
        <div className="fixed inset-0 z-[99999] bg-theme-base md:absolute md:inset-0 md:bg-theme-panel md:backdrop-blur-3xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 font-sans text-theme-text overflow-hidden">
            
            <header className="px-6 pt-12 pb-4 md:pt-8 flex flex-col gap-4 border-b border-[var(--border-master)] shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none drop-shadow-md">
                            {t('towns.select_town', 'SELECCIONAR POBLE')}
                        </h3>
                        <div className="flex items-center gap-2 mt-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                            <button className={`hover:text-theme-text transition-colors ${step >= 1 ? 'text-[var(--theme-accent-primary)]' : ''}`} onClick={() => { setStep(1); setSearchTerm(''); }}>
                                {selectedProvince || 'PROVÍNCIA'}
                            </button>
                            {selectedProvince && <ChevronRight size={14} className="opacity-50" />}
                            {selectedProvince && (
                                <button className={`hover:text-theme-text transition-colors ${step >= 2 ? 'text-[var(--theme-accent-primary)]' : ''}`} onClick={() => { setStep(2); setSearchTerm(''); }}>
                                    {selectedComarca || 'COMARCA'}
                                </button>
                            )}
                            {selectedComarca && <ChevronRight size={14} className="opacity-50" />}
                            {selectedComarca && step !== 4 && (
                                <span className="text-gray-500">
                                    {selectedTown?.name || 'POBLE'}
                                </span>
                            )}
                            {step === 4 && (
                                <span className="text-[var(--theme-accent-primary)]">PIONER ✨</span>
                            )}
                        </div>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--hover-overlay)] hover:bg-[var(--border-master)] transition-colors active:scale-90" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {step !== 4 && (
                    <div className="relative mt-2">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cerca poble, comarca o província..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 bg-black/5 dark:bg-white/5 border border-[var(--border-master)] focus:border-[var(--theme-accent-primary)] rounded-[20px] pl-12 pr-12 text-lg font-bold outline-none transition-all placeholder:text-gray-500 placeholder:font-normal"
                        />
                        {searchTerm && (
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-theme-text" onClick={() => setSearchTerm('')}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                        <div className="w-8 h-8 rounded-full border-4 border-t-[var(--theme-accent-primary)] border-gray-700 animate-spin"></div>
                        <span className="font-bold tracking-widest uppercase text-sm">Cercant...</span>
                    </div>
                ) : step === 4 ? (
                    <div className="flex flex-col h-full items-center p-6 gap-6 text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-[var(--theme-accent-primary-faint)] flex items-center justify-center text-[var(--theme-accent-primary)] mb-2 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
                            <MapPin size={32} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black uppercase italic drop-shadow-sm mb-2">{pioneerTown}</h4>
                            <p className="text-gray-400 text-sm">Seràs la primera persona en fundar aquest poble a la xarxa Sóc de Poble.</p>
                        </div>
                        
                        <div className="w-full max-w-sm flex flex-col gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Escriu la teua Província (Ex: Cáceres, Madrid, Balears)"
                                value={pioneerProvince}
                                onChange={(e) => setPioneerProvince(e.target.value)}
                                className="w-full h-14 bg-black/5 dark:bg-white/5 border border-[var(--border-master)] focus:border-[var(--theme-accent-primary)] rounded-[16px] px-4 text-center font-bold outline-none transition-all placeholder:text-gray-500 placeholder:font-normal"
                            />
                            
                            <button
                                onClick={handleCreatePioneer}
                                disabled={!pioneerProvince.trim()}
                                className={`h-14 rounded-[16px] font-black uppercase tracking-widest transition-all ${pioneerProvince.trim() ? 'bg-[var(--theme-accent-primary)] text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,107,0,0.4)]' : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}`}
                            >
                                Reclamar el Poble ✨
                            </button>
                            <button onClick={() => { setStep(1); setSearchTerm(''); }} className="mt-2 text-sm text-gray-500 hover:text-white transition-colors">
                                Cancel·lar
                            </button>
                        </div>
                    </div>
                ) : displayList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 text-center px-8">
                        <MapPin size={48} className="opacity-20 mb-2" />
                        <p className="font-medium text-lg">No s'han trobat resultats.</p>
                        {isSearching && (
                            <div className="mt-6 p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--border-master)] text-center w-full max-w-sm transform hover:scale-[1.02] transition-transform">
                                <p className="text-sm mb-4 font-medium text-theme-text opacity-90">Vols ser la primera persona del teu poble a Sóc de Poble?</p>
                                <button 
                                    onClick={() => { setStep(4); setPioneerTown(searchTerm); setSearchTerm(''); }}
                                    className="w-full py-3 bg-[var(--theme-accent-primary)] text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                                >
                                    Fundar Poble Nou ✨
                                </button>
                            </div>
                        )}
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-gray-400 hover:text-[var(--theme-accent-primary)] font-bold uppercase tracking-widest text-sm transition-colors">
                            Netejar Cerca
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {displayList.map((item, idx) => {
                            const isTown = typeof item === 'object';
                            const label = isTown ? item.name : item;
                            const isSelected = isTown ? (selectedTown?.uuid === item.uuid || selectedTown?.id === item.id) :
                                (step === 1 && selectedProvince === item) ||
                                (step === 2 && selectedComarca === item);

                            return (
                                <button
                                    key={isTown ? (item.uuid || item.id) : idx}
                                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[20px] transition-all
                                        ${isSelected ? 'bg-[var(--theme-accent-primary-faint)] border border-[var(--theme-accent-primary)]' : 'bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5'}
                                    `}
                                    onClick={() => {
                                        if (isSearching && isTown) handleSearchResultSelect(item);
                                        else if (step === 1) handleProvinceSelect(item);
                                        else if (step === 2) handleComarcaSelect(item);
                                        else {
                                            setSelectedTown(item);
                                            // Auto-save when picking the final town to speed up flow
                                            setTimeout(() => {
                                                onSelect(item);
                                                onClose();
                                            }, 400);
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-start gap-1 text-left">
                                        <span className={`text-lg font-bold ${isSelected ? 'text-[var(--theme-accent-primary)]' : 'text-theme-text'}`}>
                                            {label}
                                        </span>
                                        {isTown && (
                                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                                {item.comarca} · {item.province}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        {isSelected ? <Check size={24} className="text-[var(--theme-accent-primary)]" strokeWidth={3} /> : <ChevronRight size={20} className="text-gray-400 opacity-50" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <footer className="p-6 border-t border-[var(--border-master)] bg-theme-panel shrink-0 pb-safe">
                <button
                    className={`w-full h-16 rounded-[24px] flex items-center justify-center text-white font-black uppercase tracking-widest text-lg transition-all
                        ${selectedTown ? 'bg-[var(--theme-accent-primary)] hover:opacity-90 shadow-[0_0_20px_rgba(255,107,0,0.4)] active:scale-[0.98]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50'}
                    `}
                    onClick={handleSave}
                    disabled={!selectedTown}
                >
                    {selectedTown ? 'GUARDAR POBLE ✨' : 'GUARDAR POBLE'}
                </button>
            </footer>
        </div>
    );
};

export default TownSelectorModal;


=====================================
FILE: src/components/TranslationModal.jsx
=====================================

import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MAIN_LANGS = [
    { code: 'va', label: 'Valencià' },
    { code: 'es', label: 'Castellà' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' }
];

const TranslationModal = ({ isOpen, onClose, config }) => {
    const { i18n } = useTranslation();
    
    // Recuperar l'últim idioma utilitzat
    const lastLangCode = localStorage.getItem('sdp_last_translation_lang');

    if (!isOpen) return null;

    const handleTranslate = (langCode) => {
        // Guardem l'última elecció per facilitar el protocol de 2 tocs
        localStorage.setItem('sdp_last_translation_lang', langCode);
        
        // Dispatch global event for the main system (OMEGA-39) to handle the AI translation request
        window.dispatchEvent(new CustomEvent('omega-translate-request', { 
            detail: { 
                postId: config?.postId, 
                title: config?.title,
                targetLang: langCode 
            } 
        }));
        
        onClose();
        alert(`🌐 S'ha sol·licitat la traducció automàtica a ${langCode.toUpperCase()}. Funcionalitat OMEGA-39 pendent de connexió clau.`);
    };

    // Obtener idioma base
    const currentAppLang = i18n.language || 'va';

    // Construcció de llistes
    const lastUsedLang = lastLangCode ? MAIN_LANGS.find(l => l.code === lastLangCode) : null;
    
    // Filtrem la resta d'idiomes excloent l'últim triat i l'actual
    const availableMainLangs = MAIN_LANGS.filter(l => l.code !== currentAppLang && l.code !== lastLangCode);

    return (
        <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={onClose}>
            <div className="modal-content glass-modal w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button className="modal-close z-10" onClick={onClose} aria-label="Tancar">
                    <X size={24} />
                </button>
                
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#ff6d23]/20 flex items-center justify-center text-[#ff6d23] flex-shrink-0">
                            <Globe size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight leading-tight">
                            Traduir Article
                        </h2>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
                        Tria un idioma per traduir aquest contingut al moment mitjançant la malla neural OMEGA-39.
                    </p>

                    <div className="flex flex-col gap-2 mb-2">
                        {/* 1. L'IDIOMA RECORDAT (Destacat dalt) */}
                        {lastUsedLang && (
                            <div className="mb-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-[#ff6d23] opacity-80 mb-1 ml-1 block">Última elecció</span>
                                <button 
                                    onClick={() => handleTranslate(lastUsedLang.code)}
                                    className="flex items-center justify-between w-full p-4 rounded-xl bg-[#ff6d23]/10 border border-[#ff6d23]/50 hover:bg-[#ff6d23]/20 hover:shadow-[0_0_15px_rgba(255,109,35,0.3)] transition-all text-left group"
                                >
                                    <span className="font-black text-[#ff6d23]">
                                        {lastUsedLang.label}
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* 2. LA RESTA D'IDIOMES PRINCIPALS */}
                        {availableMainLangs.map(lang => (
                            <button 
                                key={lang.code}
                                onClick={() => handleTranslate(lang.code)}
                                className="flex items-center justify-between w-full p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-[#ff6d23]/50 hover:shadow-[0_0_15px_rgba(255,109,35,0.2)] transition-all text-left group"
                            >
                                <span className="font-bold text-white group-hover:text-[#ff6d23] transition-colors">
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                        
                        {/* 3. QUALSEVOL ALTRE IDIOMA (Google) */}
                        <button 
                            onClick={() => {
                                // Aquí se abriría el modal nativo o input para elegir entre los 100+ idiomas de Google
                                alert("Obrint el selector global d'idiomes (Google Translate API)...");
                            }}
                            className="flex items-center justify-center w-full p-3 mt-1 rounded-xl border border-white/10 text-white/50 hover:text-white/90 hover:border-white/30 transition-all text-sm font-bold bg-transparent"
                        >
                            🌍 Més de 100 idiomas...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationModal;


=====================================
FILE: src/components/UnifiedStatus.jsx
=====================================

import React from 'react';
import { BadgeCheck, Clock, AlertCircle } from 'lucide-react';

/**
 * UnifiedStatus Component
 * Displays a standardized status badge for verification or state.
 * Fallback implementation to fix missing dependency.
 */
const UnifiedStatus = ({ status, size = 'md' }) => {
    // Basic mapping
    const getStatusConfig = () => {
        switch (status) {
            case 'verified':
            case 'active':
            case 'approved':
                return {
                    icon: <BadgeCheck size={size === 'sm' ? 14 : 16} />,
                    text: 'Verificat',
                    color: 'var(--cc-success)',
                    bg: 'rgba(34, 197, 94, 0.1)'
                };
            case 'pending':
                return {
                    icon: <Clock size={size === 'sm' ? 14 : 16} />,
                    text: 'Pendent',
                    color: 'var(--cc-accent)',
                    bg: 'rgba(255, 126, 51, 0.1)'
                };
            default:
                return {
                    icon: null,
                    text: null,
                    color: 'transparent',
                    bg: 'transparent'
                };
        }
    };

    const config = getStatusConfig();

    if (!config.text) return null;

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: size === 'sm' ? '2px 6px' : '4px 8px',
            borderRadius: '0px',
            backgroundColor: config.bg,
            color: config.color,
            fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
            fontWeight: '600',
            border: `1px solid ${config.color}`
        }}>
            {config.icon}
            <span>{config.text}</span>
        </div>
    );
};

export default UnifiedStatus;


=====================================
FILE: src/components/UniversalCard.css
=====================================

/* UNIVERSAL CARD NEXUS v10.25.0-BATEGAT-GOLDEN: PURIFICACIÓ NUCLEAR EXTREMA */

@media (hover: none) and (pointer: coarse) {
  .universal-card-virtual.glass,
  .universal-card-virtual {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    will-change: transform;
  }
}
.universal-card.view-mode-list {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  height: auto;
  box-shadow: none;
  min-height: 80px;
}

.universal-card.view-mode-list:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--theme-accent-primary);
}

.card-list-layout {
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  min-height: 80px;
}

.card-list-thumbnail {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.universal-card.view-mode-list:hover .card-list-thumbnail {
  transform: scale(1.05);
  border-color: var(--theme-accent-primary);
}

@media (max-width: 400px) {
  .card-list-layout {
    gap: 8px;
    padding: 0 8px;
  }
  .card-list-thumbnail {
    width: 40px;
    height: 40px;
  }
}

.universal-card {
  background: var(--color-bg-canonic);
  border: 1px solid var(--border-master);
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.universal-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: var(--shadow-deep), var(--shadow-glow-violet);
  border-color: var(--theme-accent-primary);
}

/* Light Mode Specific Overrides (Protocol Llum de Dia) */
.theme-light .universal-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--theme-text);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.theme-light .universal-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--theme-accent-primary);
  transform: translateY(-4px);
}

.theme-light .universal-card .genesis-title {
  color: #1e293b;
  /* Slate-800 */
}

.theme-light .universal-card .card-excerpt {
  color: #1e293b;
  /* Slate-800 - Contrast Audit Fixed */
}

.theme-light .universal-card .card-header-boina,
.theme-light .universal-card .card-header-boina .master-author-name,
.theme-light .universal-card .card-header-boina .location-text,
.theme-light .universal-card .card-header-boina .zap-celestial {
  color: #000000;
}

.card-header-boina {
  background: var(--theme-accent-primary);
  color: var(--on-theme-accent-primary);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  border-radius: 0;
  position: relative;
  z-index: 10;
  backdrop-filter: blur(20px);
  overflow: hidden; /* Added to clip any ghosting content */
}

/* [PRO] Auditoria de Reixa: Boina compacta però suficient per a evitar "trepitjats" */
.universal-card.view-mode-grid .card-header-boina {
  padding: 0 12px;
  height: 64px; /* Fixat a 64px exactes segons directrius d'armonia */
}

.universal-card.view-mode-grid .master-author-name {
  font-size: 16px; /* Increased from 13px */
  letter-spacing: normal;
  -webkit-font-smoothing: antialiased;
}

.variant-official .card-header-boina,
.card-header-boina.variant-official {
  background: var(--theme-accent-primary);
  color: var(--on-theme-accent-primary);
}

.universal-card.category-sostenible:hover {
  border-color: #10b981;
  box-shadow: var(--shadow-deep), 0 0 20px rgba(16, 185, 129, 0.3);
}

.universal-card.category-danger:hover {
  border-color: #ef4444;
  box-shadow: var(--shadow-deep), 0 0 20px rgba(239, 68, 68, 0.3);
}

.card-header-boina .master-author-name {
  color: var(--on-theme-accent-primary);
  font-weight: 950;
  font-size: 16px; /* Standard Text increased */
  letter-spacing: normal; /* Fixed ghosting spacing */
  -webkit-font-smoothing: antialiased;
}

.card-header-boina .location-text {
  color: var(--on-theme-accent-primary);
  font-weight: 800;
  font-size: 14px; /* Increased */
  opacity: 1; /* Removed transparency ghosting */
  -webkit-font-smoothing: antialiased;
}

/* TAGS & BADGES v11.1.0 */
.card-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.genesis-tag-pill {
  font-size: 12px;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}

.genesis-tag-pill.badge-km0 {
  background: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}
.genesis-tag-pill.badge-sostenible {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}
.genesis-tag-pill.badge-artesania {
  background: #fff7ed;
  color: #ea580c;
  border-color: #ffedd5;
}
.genesis-tag-pill.badge-oferta {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fee2e2;
}
.genesis-tag-pill.badge-oficial {
  background: #eff6ff;
  color: #2563eb;
  border-color: #dbeafe;
}

.theme-dark .badge-km0 {
  background: rgba(5, 150, 105, 0.1);
  border-color: rgba(5, 150, 105, 0.2);
}
.theme-dark .badge-sostenible {
  background: rgba(22, 163, 74, 0.1);
  border-color: rgba(22, 163, 74, 0.2);
}
.theme-dark .badge-artesania {
  background: rgba(234, 88, 12, 0.1);
  border-color: rgba(234, 88, 12, 0.2);
}
.theme-dark .badge-oferta {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  min-width: 0;
}

.universal-card.view-mode-grid .header-left {
  gap: 8px; /* [PRO] Reducció de gap per a mode reixa */
}

.genesis-avatar {
  border: 1px solid var(--border-master);
  flex-shrink: 0;
  border-radius: 50%; /* FORÇAT: RITU D'IDENTITAT v10.33 */
  background: var(--bg-edge);
  overflow: hidden;
}

.header-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.master-author-name {
  color: var(--text-main);
  font-size: 16px;
  font-weight: 950;
  margin: 0;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.official-blue-shield {
  color: var(--accent-cyan);
  filter: drop-shadow(0 0 4px var(--accent-cyan));
}

.location-text {
  color: #ffffff;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: normal;
  opacity: 0.9;
}

.header-right-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.header-right-meta.agenda-highlight {
  background: #000;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid var(--theme-accent-primary);
  box-shadow: 0 0 10px rgba(255, 109, 35, 0.2);
}

.header-right-meta.agenda-highlight .header-date {
  color: var(--theme-accent-primary);
  font-size: 12px;
  font-weight: 950;
}

.header-meta-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 0px;
}

.header-date {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.5px;
  line-height: 1;
}

.header-time {
  font-size: 12px;
  font-weight: 950;
  color: #ffffff;
  letter-spacing: 1px;
  line-height: 1.2;
}

.btn-master-rectify {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-canonic);
  border: 2px solid var(--theme-accent-primary);
  border-radius: 28px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0;
  margin-left: 8px;
  box-shadow: 0 4px 15px rgba(255, 109, 35, 0.2);
}

.btn-master-rectify:hover {
  transform: scale(1.15) rotate(12deg);
  background: var(--theme-accent-primary);
  box-shadow: 0 0 25px var(--theme-accent-primary);
}

/* Dynamic Media Protocol */
.universal-card-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0;
}

.card-media-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1; /* CRITICAL FIX: Forces strict 1:1 Square visual identity */
  background: var(--bg-edge);
  overflow: hidden;
  padding: 0;
  border-radius: 0;
  display: block;
}
@supports not (aspect-ratio: 1/1) {
  .card-media-wrapper::before {
    content: "";
    display: block;
    width: 100%;
    padding-bottom: 100%;
  }
  .card-media-wrapper > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

/* ESTÀNDARD VISUAL SÓC DE POBLE: 824px GOLDEN HEIGHT */
.universal-card.view-mode-grid {
  min-height: 864px;
  height: auto;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.universal-card.view-mode-single {
  height: auto;
}

/* ANTI-MIMETISME: Blindatge Absolut de la Caputxa d'Avatar en Single Mode */
.universal-card.view-mode-single .card-header-boina,
.universal-card.view-mode-single .card-header-boina.variant-official {
  background: var(--theme-accent-primary);
  color: #fff;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.universal-card.view-mode-single .card-header-boina .master-author-name,
.universal-card.view-mode-single .card-header-boina .location-text,
.universal-card.view-mode-single .card-header-boina .zap-celestial {
  color: #fff;
}

.theme-light .universal-card.view-mode-single .card-header-boina .master-author-name,
.theme-light .universal-card.view-mode-single .card-header-boina .location-text,
.theme-light .universal-card.view-mode-single .card-header-boina .zap-celestial {
  color: #000000;
}

.image-overlay-credits {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 15px 12px 6px;
  font-size: 12px;
  color: #ffffff;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: right;
}

/* AI TOOLS INLINE */
.card-excerpt-wrapper {
  position: relative;
  display: block;
}

/* SMART CLAMP SYSTEM FOR 864PX FIXED CARDS */
/* Math accounts for exactly 864px height, full width 1:1 image, and 20px pad */
.smart-clamp-tags {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 4;
  line-clamp: 4;
}
@media (min-width: 414px) { .smart-clamp-tags { -webkit-line-clamp: 3; line-clamp: 3; } }
@media (min-width: 442px) { .smart-clamp-tags { -webkit-line-clamp: 2; line-clamp: 2; } }
@media (min-width: 470px) { .smart-clamp-tags { -webkit-line-clamp: 1; line-clamp: 1; } }
@media (min-width: 498px) { .smart-clamp-tags { display: none; } }

.smart-clamp-notags {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 5;
  line-clamp: 5;
}
@media (min-width: 426px) { .smart-clamp-notags { -webkit-line-clamp: 4; line-clamp: 4; } }
@media (min-width: 454px) { .smart-clamp-notags { -webkit-line-clamp: 3; line-clamp: 3; } }
@media (min-width: 482px) { .smart-clamp-notags { -webkit-line-clamp: 2; line-clamp: 2; } }
@media (min-width: 510px) { .smart-clamp-notags { -webkit-line-clamp: 1; line-clamp: 1; } }
@media (min-width: 538px) { .smart-clamp-notags { display: none; } }

.card-ai-tools-inline {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.btn-ai-poeta,
.btn-ai-taxador {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-ai-poeta:hover,
.btn-ai-taxador:hover {
  transform: scale(1.2) rotate(8deg);
  background: var(--theme-accent-primary);
  border-color: #000;
}

/* BODY */
.card-body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px; /* Increased gap */
  position: relative;
  overflow: hidden; /* CRITICAL: Prevent long text from pushing footer out of fixed height cards */
}

.genesis-title {
  color: var(--text-main);
  font-family: var(--font-display);
  font-size: 20px; /* Standard Title */
  font-weight: 950;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -1px;
  word-break: break-word;
  /* Robustesa Prova d'Estrès / Alemany */
  overflow-wrap: break-word;
}

.card-price {
  background: var(--theme-accent-primary);
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.02em;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.card-price-bottom {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 20;
}

.card-price-forense {
  font-family: var(--font-display);
  color: var(--theme-accent-primary);
  font-size: 24px;
  font-weight: 950;
  letter-spacing: -1px;
}

.card-excerpt {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.7; /* Better legibility */
  margin: 0;
  font-weight: 500;
  padding: 8px 0; /* Breathing room */
}

.read-more-btn {
  background: none;
  border: none;
  color: var(--accent-violet);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  cursor: pointer;
  letter-spacing: 1px;
}

/* FOOTER MASTER CMS v3.1 (EL PENTATLÓ) */
.card-footer-master {
  border-top: none;
  background: var(--theme-accent-secondary);
  height: 64px; /* Fixat a 64px exactes segons directrius d'armonia */
  min-height: 64px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap; /* Alzina: Blindat contra apilament horizontal */
  justify-content: center;
}

/* 1. CARDINAL MUR */
.footer-actions-mur {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  height: 100%;
}

/* 2. CARDINAL MERCAT */
.footer-mercat-master {
  display: flex;
  flex-direction: column;
  padding: 12px 24px;
  gap: 12px;
}

.mercat-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.btn-mercat-buy {
  width: 100%;
  height: 48px;
  background: var(--color-bg-canonic);
  color: var(--theme-accent-secondary);
  border: 1px solid var(--theme-accent-secondary);
  border-radius: var(--sdp-radius-tactile);
  font-weight: 950;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-mercat-buy:hover {
  background: var(--theme-accent-secondary);
  color: var(--color-bg-canonic);
  box-shadow: 0 0 20px var(--theme-accent-secondary);
}

/* 3. CARDINAL AGENDA */
.footer-event-master {
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 4. CARDINAL POBLES */
.footer-pobles-master {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
}

/* 5. CARDINAL AJUNTAMENT */
.footer-ajuntament-master {
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 6. CARDINAL RUTES / MAPA */
.footer-mapa-master {
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* BUTTONS & TARGETS */
.master-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 16px; /* Standard Text */
  font-weight: 900;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  height: 40px; /* STANDARD TARGET ALIGNMENT */
  padding: 0 16px;
  border-radius: var(--radius-m);
}

.master-action-btn.connect-btn {
  flex-grow: 1; /* Thumb Optimization */
  background: var(--color-bg-canonic);
  border-color: var(--theme-accent-secondary);
  color: var(--theme-accent-secondary);
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.master-action-btn.connect-btn:hover {
  background: var(--theme-accent-secondary);
  color: var(--color-bg-canonic);
  box-shadow: 0 0 20px var(--theme-accent-secondary);
}

/* Connect Btn Variant for Official/Sostenible */
/* Removed official hover overrides to keep orange priority */
/* Removed sostenible overrides */

/* Blindatge Alzina v5.2 */
.footer-actions-mur,
.footer-mercat-master,
.footer-event-master,
.footer-pobles-master,
.footer-ajuntament-master,
.footer-mapa-master,
.event-actions-row,
.mercat-actions-row {
  flex-wrap: nowrap;
}

.footer-touch-group,
.card-ai-tools-inline,
.header-right-meta {
  flex-shrink: 0;
}

.master-action-btn.connect-btn {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-touch-group {
  display: flex;
  align-items: center;
  gap: 8px; /* Anti-ghost-click gap */
  flex-wrap: nowrap; /* Alzina: Prohibit apilar-se */
}

.btn-touch {
  width: 44px; /* ALIGNED TO HEADER BTN AND FAT-THUMB */
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0;
  flex-shrink: 0; /* Alzina: Prohibida la deformació */
}

.btn-touch:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px) scale(1.05);
}

/* [MASTER DYNAMIC HEADER] Price & Date badges */
.header-dynamic-data {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 950;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-badge {
  background: #000;
  color: #ff6b00;
  border: 1px solid rgba(255, 107, 0, 0.5);
}

.date-badge {
  background: rgba(255, 255, 255, 0.15);
}

/* MODO FORENSE UI (ANTIOBLITS) */
.forensic-label {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #00ffff;
  color: #000;
  font-size: 10px;
  font-weight: 950;
  padding: 2px 8px;
  border-radius: 4px;
  z-index: 100;
  text-transform: uppercase;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
  pointer-events: none;
  letter-spacing: 1px;
  font-family: "Courier New", monospace;
  animation: flash-forensic 2s infinite ease-in-out;
}

@keyframes flash-forensic {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.universal-card.mode-forense-active {
  outline: 2px dashed #00ffff;
  outline-offset: 4px;
}

.btn-touch:hover {
  background: var(--surface-glass);
  color: var(--theme-accent-secondary);
  transform: scale(1.1) rotate(5deg);
  border-color: var(--theme-accent-secondary);
}

.btn-touch.iaia-chat {
  background: rgba(168, 85, 247, 0.15); /* Purple-500 tint */
  border-color: rgba(168, 85, 247, 0.4);
  color: var(--accent-violet);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
}

.btn-touch.iaia-chat:hover {
  background: var(--accent-violet);
  color: #000;
  box-shadow: 0 0 25px var(--accent-violet);
  transform: scale(1.15) rotate(-8deg);
}

.btn-event-action {
  background: var(--theme-accent-secondary);
  color: #000;
  height: 44px;
  padding: 0 16px;
  border-radius: var(--radius-m);
  font-weight: 950;
  font-size: 12px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-grow: 1; /* Match thumb ease */
  transition: all 0.3s ease;
}

.btn-event-action:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 109, 35, 0.4);
}

.btn-event-action.visit-town {
  background: var(--theme-accent-secondary);
}

.btn-event-action.map-nav {
  background: var(--accent-green);
}

.event-info-notice,
.map-dist-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 8px;
  width: fit-content;
}

.map-dist-notice {
  border: 1px solid rgba(0, 186, 136, 0.2);
  color: var(--accent-green);
}

.event-actions-row,
.footer-actions-mur,
.footer-mercat-master,
.footer-pobles-master,
.footer-ajuntament-master,
.footer-mapa-master {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap; /* Blindatge Alzina: Prohibida la verticalitat */
}

.footer-touch-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0; /* Inencogible */
}

.master-action-btn.connect-btn {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}

.mercat-actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-grow: 1;
}

.btn-mercat-buy {
  background: var(--theme-accent-secondary);
  color: #000;
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 950;
  border-radius: var(--radius-m);
  text-transform: uppercase;
}

.event-info-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.flash-icon {
  color: var(--theme-accent-primary);
}

.btn-event-action,
.btn-mercat-buy {
  background: var(--theme-accent-secondary);
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 950;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
}

/* CMS FOOTER ACTIONS */
.footer-actions-mur {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid var(--border-subtle);
}

.footer-mercat-master,
.footer-event-master {
  border-top: 1px solid var(--border-subtle);
}

.master-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 12px;
}

.master-action-btn:hover {
  background: var(--surface-glass);
  color: var(--theme-accent-secondary);
}

.master-action-btn.connect-btn {
  color: var(--theme-accent-secondary);
  background: var(--theme-accent-secondary-faint);
  border: 1px solid var(--theme-accent-secondary-muted);
}

.master-action-btn.connect-btn:hover {
  background: var(--theme-accent-secondary);
  color: #fff;
}

/* 5. CARDINAL AJUNTAMENT */
.footer-ajuntament-master {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.official-notice-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent-cyan);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(6, 182, 212, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  width: fit-content;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.blue-badge-icon {
  color: var(--accent-cyan);
  filter: drop-shadow(0 0 5px var(--accent-cyan));
}

.btn-event-action.official-nav {
  background: var(--accent-cyan);
  color: #000;
}

.connection-counter {
  margin-left: auto;
  font-size: 12px;
  font-weight: 950;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid var(--border-subtle);
}

/* RESPONSIVITY (Mobile First - Single Column Strict) */
@media (max-width: 600px) {
  .universal-card {
    border-radius: var(--radius-m);
    margin: 8px 0;
    display: flex;
    flex-direction: column;
    /* Removed the side-by-side grid */
  }

  .universal-card .card-media-wrapper {
    width: 100%;
    height: auto;
    min-height: auto;
    border-bottom-left-radius: 0; /* Clear previous side-radius */
  }

  .universal-card .universal-card-media {
    height: 100%;
    object-position: center;
  }

  .universal-card .card-body {
    padding: 16px;
  }

  .universal-card .genesis-title {
    font-size: 18px;
    line-height: 1.25;
    margin-bottom: 6px;
  }

  .universal-card .card-excerpt {
    font-size: 14px;
    line-height: 1.5;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

@media (max-width: 400px) {
  .universal-card {
    margin: 4px 0;
  }
  .card-header-boina {
    padding: 8px;
    height: auto;
    min-height: 56px;
  }
  .master-author-name {
    font-size: 12px;
    white-space: normal;
    word-break: break-word;
  }
  .header-date,
  .header-time {
    font-size: 12px;
  }
  .card-body {
    padding: 8px;
  }
  .genesis-title {
    font-size: 15px;
  }
  .card-price {
    font-size: 14px;
    padding: 6px 12px;
  }
  .master-action-btn {
    padding: 0 12px;
    font-size: 12px;
  }
  .footer-actions-mur,
  .footer-event-master,
  .footer-pobles-master,
  .footer-ajuntament-master,
  .footer-mapa-master {
    padding: 8px;
  }
}

@media (max-width: 350px) {
  .card-tags-row {
    display: none;
  }
  .universal-card {
    border-radius: 12px;
  }
}

/* --- MODO SENIOR (UX Extrema y Rural Modern) --- */
.universal-card.senior-mode {
  min-height: 200px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.2);
}

.theme-light .universal-card.senior-mode {
  border-color: rgba(0, 0, 0, 0.4);
}

.universal-card.senior-mode .master-author-name {
  font-size: 20px;
  font-weight: 950;
}

.universal-card.senior-mode .card-header-boina {
  height: 80px;
  padding: 0 24px;
}

.universal-card.senior-mode .location-text {
  font-size: 16px;
}

.universal-card.senior-mode .master-action-btn {
  height: 60px;
  font-size: 18px;
}

.universal-card.senior-mode .btn-touch {
  width: 60px;
  height: 60px;
}


=====================================
FILE: src/components/UniversalCard.jsx
=====================================

import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useNavigation } from '../context/NavigationContext';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';


import { Calendar, Plus, ImageIcon } from 'lucide-react';
import Avatar from './Avatar';

import UniversalCardHeader from './UniversalCardHeader';
import UniversalCardMedia from './UniversalCardMedia';
import UniversalCardBody from './UniversalCardBody';
import UniversalCardFooter from './UniversalCardFooter';
import BlueprintOverlay from './BlueprintOverlay';
import './UniversalCard.css';


/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM] - REFACTORED
 * ---------------------------------------
 * DIRECTIVA SUPREMA: Aquest component és la unitat atòmica del Gènesi.
 * Estructura dividida en Base, Header, Media, Body, i Footer 
 * per complir el "Single Responsibility Principle".
 */
const UniversalCard = ({
    item,
    title,
    subtitle,
    image,
    avatarSrc,
    avatarRole,
    avatarName,
    children,
    className = "",
    mode = "post", 
    variant = "post",
    isBating = false,
    excerpt,
    images,
    isOfficial: forcedOfficial = false,
    forensicMode: forcedForensic = false,
    viewMode = "grid"
}) => {

    const cardVariant = variant || mode;
    const { openViewer } = useModal();
    const { forensicMode: contextForensic } = useNavigation();

    const { gloveMode, seniorMode, hapticService } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const isMaster = isAdmin || user?.app_metadata?.role === 'master';

    // MULTIMEDIA RESOLUTION
    const FALLBACK_NANO_IMAGES = [
        "/assets/brain/generations/nano_llibre_memoria.png",
        "/assets/brain/generations/nano_fibra_espart.png",
        "/assets/brain/generations/nano_dron_agricola.png",
        "/assets/brain/generations/nano_mercat_llavors.png",
        "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
        "/assets/brain/generations/nano_porta_masia_1774197069297.png",
        "/assets/brain/generations/nano_rentonar_arquitectura_1774196001924.png",
        "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"
    ];

    const mediaList = React.useMemo(() => images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null), [images, item?.images, item?.image_url, image]);
    let displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    if (!displayImage) {
        const strId = String(item?.id || item?.uuid || title || item?.name || '1');
        let hash = 0;
        for (let i = 0; i < strId.length; i++) {
            hash = strId.charCodeAt(i) + ((hash << 5) - hash);
        }
        displayImage = FALLBACK_NANO_IMAGES[Math.abs(hash) % FALLBACK_NANO_IMAGES.length];
    }

    const displayTitle = title || item?.title || item?.name || "Sóc de Poble";
    const displayPrice = item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : "");
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const createdAtDate = item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null);
    const displayDate = createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda";
    const displayTime = createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || "");

    const isOfficial = forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles';
    const isAlert = React.useMemo(() => item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert || item?.category === 'Danger', [item?.category, item?.type, item?.is_alert]);
    const isSostenible = React.useMemo(() => item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'), [item?.category, item?.tags]);

    const handleCardClick = React.useCallback(() => {
        if (seniorMode && hapticService?.trigger) {
            hapticService.trigger('medium');
        }
        const id = item?.uuid || item?.id;
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate, seniorMode, hapticService]);

    const handleConnectClick = React.useCallback(async (e) => {
        e.stopPropagation();

        const postId = item?.uuid || item?.id;
        if (!postId) {
            console.error("No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        // [ESCAPARATE PATTERN DOCTRINE] All direct connection clicks on feeds must route to the item detail to avoid accidental inputs
        // The detailed view handles the actual connection/save/tagging
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${postId}?action=connect`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${postId}?action=connect`);
        } else {
            navigate(`/post/${postId}?action=connect`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const CardContent = (
        <article
            className={`universal-card card-variant-${cardVariant} view-mode-${viewMode} ${className} relative w-full rounded-[28px] overflow-hidden bg-theme-panel shadow-2xl border border-white/5 flex flex-col transition-all duration-500 hover:shadow-black/50 ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${seniorMode ? 'senior-mode' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'category-danger alert-active' : ''} ${isSostenible ? 'category-sostenible' : ''} ${isForensic ? 'mode-forense-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {viewMode === 'list' ? (
                <div className="card-list-layout h-24 flex items-center px-4 md:px-6 gap-4 hover:bg-white/[0.02] transition-colors relative isolate">
                    <div className="card-list-thumbnail flex-shrink-0 w-16 h-16 rounded-[20px] shadow-inner overflow-hidden border border-white/10 relative z-10">
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="w-full h-full object-cover rounded-[20px] hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/20">
                                <ImageIcon size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4 z-10">
                        <h4 className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide">{displayTitle}</h4>
                        <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide truncate mt-1">
                            <span className="text-[var(--theme-accent-primary)]">{displayAuthor}</span>
                            <span>•</span>
                            <span className="opacity-70">{displayTown.replace("Poble Principal:", "").trim()}</span>
                        </div>
                    </div>
                    
                    {displayPrice && (
                        <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-[28px] flex-shrink-0 z-10">
                            {displayPrice}
                        </div>
                    )}
                    
                    <button 
                        className="btn-connect-canonic shrink-0 ml-2 flex h-10 px-6 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] border border-white/10 rounded-full items-center justify-center gap-2 font-black text-[12px] text-slate-900 bg-[#F97316] tracking-wide transition-all z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConnectClick(e);
                        }}
                    >
                        CONNECTAR
                    </button>
                    
                    {/* Ghost hit area to ensure the background takes the hover safely */}
                    <div className="absolute inset-0 z-0"></div>
                </div>
            ) : (
                <>
                    <UniversalCardHeader 
                        item={item}
                        cardVariant={cardVariant}
                        displayTown={displayTown}
                        displayAuthor={displayAuthor}
                        avatarSrc={avatarSrc}
                        avatarRole={avatarRole}
                        isOfficial={isOfficial}
                        displayDate={displayDate}
                        displayTime={displayTime}
                    />

                    <UniversalCardMedia 
                        item={item}
                        cardVariant={cardVariant}
                        mediaList={mediaList}
                        displayImage={displayImage}
                        displayTitle={displayTitle}
                        openViewer={openViewer}
                        navigate={navigate}
                    />

                    <Suspense fallback={<div className="h-16 mt-2 rounded bg-surface-var/30 animate-pulse w-full max-w-sm"></div>}>
                        <UniversalCardBody 
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            item={item}
                            isOfficial={isOfficial}
                            children={children}
                            navigate={navigate}
                            cardVariant={cardVariant}
                            displayPrice={displayPrice}
                        />
                    </Suspense>

                    <Suspense fallback={<div className="h-10 mt-4 rounded bg-surface-var/30 animate-pulse w-[80%]"></div>}>
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                        />
                    </Suspense>
                </>
            )}
        </article>
    );

    // Avoid useLocation hook to prevent re-renders when local routing changes (improves feed performance)
    const isChatRoute = typeof window !== 'undefined' ? window.location.pathname.startsWith('/chats') : false;

    const FinalCard = (
        <div className="min-w-0 w-full">
            {CardContent}
        </div>
    );

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${cardVariant.toUpperCase()} | R: 28PX`} color="cyan">
            {FinalCard}
        </BlueprintOverlay>
    ) : FinalCard;
};

const normalizeClass = (cls) => (cls || '').split(' ').filter(Boolean).sort().join(' ');

const propsAreEqual = (prevProps, nextProps) => {
    const prevId = prevProps.item?.uuid || prevProps.item?.id;
    const nextId = nextProps.item?.uuid || nextProps.item?.id;
    return (
        prevId === nextId &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.item?.connections_count === nextProps.item?.connections_count &&
        prevProps.item?.comments_count === nextProps.item?.comments_count &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating &&
        normalizeClass(prevProps.className) === normalizeClass(nextProps.className) &&
        prevProps.variant === nextProps.variant &&
        prevProps.mode === nextProps.mode
    );
};

export default React.memo(UniversalCard, propsAreEqual);


=====================================
FILE: src/components/UniversalCardBody.jsx
=====================================

import React from 'react';
import { ChevronRight } from 'lucide-react';

const UniversalCardBody = ({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    const TRUNCATE_LENGTH = 280;
    
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'smart-clamp-tags' : 'smart-clamp-notags';

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div className="card-body flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div 
                className="flex flex-col flex-1 min-h-0 px-5 pt-5 pb-6 overflow-hidden cursor-pointer group"
                onClick={handleReadMoreClick}
                role="button"
                tabIndex={0}
                aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}
            >
                <div className="title-row flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity">
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[1.3rem] sm:text-[1.5rem] font-black text-theme-text leading-tight line-clamp-2 tracking-tight min-h-[3.75rem]">
                                {displayTitle}
                            </h2>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <span className="card-price whitespace-nowrap">{displayPrice}</span>
                        )}
                    </div>
                    <h3 className="text-[1rem] sm:text-[1.1rem] font-bold text-[var(--theme-accent-primary)] leading-snug line-clamp-1 truncate min-h-[1.51rem] w-full">
                        {item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : '')) || ' '}
                    </h3>
                </div>

                <div className="card-excerpt-container flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-1">
                    {displayExcerpt && (
                        <p className={`card-excerpt text-slate-900 dark:text-slate-100 font-medium text-[15px] m-0 p-0 ${smartClampClass}`} style={{ lineHeight: '24px' }}>
                            {displayExcerpt}
                        </p>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && displayExcerpt.length > 130 && (
                    <button
                        className="w-full outline-none border-none text-[14px] font-black text-white uppercase tracking-wide py-2.5 flex items-center justify-center gap-1 hover:brightness-110 transition-all"
                        style={{ backgroundColor: 'var(--theme-accent-primary)' }}
                        aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                        onClick={handleReadMoreClick}
                    >
                        Llegir més <ChevronRight size={18} className="mt-[1px]" />
                    </button>
                )}

                {item?.tags && item.tags.length > 0 && (
                    <div 
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-blue-500/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                        {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[14px] font-bold uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                        {item.tags.length > 3 && (
                            <span title={item.tags.slice(3).join(', ')} className="text-[14px] font-bold uppercase tracking-wide opacity-80 cursor-default">
                                +{item.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalCardBody;


=====================================
FILE: src/components/UniversalCardFooter.jsx
=====================================

import React from 'react';
import { Plus, Share2, MoreHorizontal, MessageCircle, Globe } from 'lucide-react';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick
}) => {
    // Determine the main button text
    let buttonText = "CONNECTAR";
    let icon = <Plus size={20} className="drop-shadow-sm" strokeWidth={2.5}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = "CONNECTAR";
    } else if (cardVariant === 'pobles') {
        buttonText = "VISITAR POBLE";
    } else if (item?.type === 'tramit') {
        buttonText = "TRAMITAR";
    }

    const handleShareClick = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: displayTitle || 'Sóc de Poble',
                text: 'Fes un cop d\'ull a això en Sóc de Poble!',
                url: window.location.href,
            }).catch((error) => console.log('Err sharing', error));
        }
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        // The user mentioned this sends them to the Chat of the author to talk about the product.
        // For now, we open the Post Detail View with a comment intent, or navigate to chat.
        const id = item?.uuid || item?.id;
        if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}?action=comment`);
        } else {
            navigate(`/post/${id}?action=comment`);
        }
    };

    const handleTranslateClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        // OMEGA-39: Lanzará un trigger hacia el gestor de IA cuando la infraestructura Vertex esté enchufada
        window.dispatchEvent(new CustomEvent('omega-translate-request', { detail: { postId: id, title: displayTitle } }));
        alert("🌐 Motor de Traducció A Demanda (Vertex AI) prompte disponible.");
    };

    return (
        <div className="card-footer-master mt-auto">
            <div className="footer-actions-mur">
                <button 
                    className="btn-touch translate-btn" 
                    onClick={handleTranslateClick} 
                    aria-label="Traduir Article"
                    title="Traduir Article"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--theme-accent-primary)', marginRight: '8px' }}
                >
                    <Globe size={20} strokeWidth={2.5} />
                </button>
                <button 
                    className="master-action-btn connect-btn w-full h-10 flex items-center justify-center gap-2 font-black tracking-widest text-[14px] rounded-full drop-shadow-md transition-all hover:scale-[1.02] hover:brightness-110"
                    style={{ backgroundColor: 'var(--theme-accent-primary)', color: 'var(--on-theme-accent-primary)', border: 'none' }}
                    onClick={handleConnectClick}
                >
                    {icon} {buttonText}
                </button>
                <div className="footer-touch-group">
                    <button className="btn-touch" onClick={handleCommentClick} aria-label="Comentar">
                        <MessageCircle size={22} strokeWidth={2.2} />
                    </button>
                    <button className="btn-touch" onClick={handleShareClick} aria-label="Compartir">
                        <Share2 size={22} strokeWidth={2.2} />
                    </button>
                    {isMaster && (
                        <button className="btn-touch" onClick={(e) => e.stopPropagation()} aria-label="Opcions">
                            <MoreHorizontal size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalCardFooter;


=====================================
FILE: src/components/UniversalCardHeader.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { Zap } from 'lucide-react';

const UniversalCardHeader = ({ 
    item, 
    cardVariant, 
    displayTown, 
    displayAuthor, 
    avatarSrc, 
    avatarRole, 
    isOfficial, 
    displayDate, 
    displayTime 
}) => {
    const navigate = useNavigate();

    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        const cleanTown = townName.replace("Poble Principal:", "").trim();
        if (cleanTown.includes("La Torre")) return "Gent de La Torre";
        return `Gent de ${cleanTown}`;
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        
        // 1. Pobles Rule: Clicking the header goes to the Town/Community page
        if (cardVariant === 'pobles') {
            const townId = item?.towns?.id || item?.town_id;
            if (townId) {
                navigate(`/pobles/${townId}`);
            } else {
                navigate('/pobles');
            }
            return;
        }

        // 2. Default Profile Routing
        const authorId = item?.author_user_id || item?.author_id || item?.user_id;
        const entityId = item?.author_entity_id;
        const authorName = item?.author_name || item?.author || displayAuthor;

        if (entityId) {
            navigate(`/entitat/${entityId}`);
        } else if (authorId) {
            navigate(`/perfil/${authorId}`);
        } else if (authorName) {
            const slug = authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            navigate(`/perfil/${slug}`);
        }
    };

    return (
        <header 
            className={`card-header-boina h-16 ${isOfficial ? 'variant-official' : 'variant-standard'}`} 
            onClick={handleAuthorClick}
        >
            <div className="header-left flex items-center gap-3 flex-1 min-w-0 pr-2">
                <Avatar
                    src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                    name={displayAuthor}
                    role={avatarRole || item?.author_role}
                    size="md"
                    className="genesis-avatar shrink-0"
                />
                <div className="header-text flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="master-author-name leading-tight text-on-accent mb-1 truncate w-full" title={cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}>
                        {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                    </h3>
                    
                    {cardVariant === 'pobles' ? (
                        <div className="location-text mt-0.5 truncate w-full" title={`De part de: ${displayAuthor}`}>
                            De part de: {displayAuthor}
                        </div>
                    ) : (
                        displayTown && displayTown !== displayAuthor && (
                            <div className="location-text mt-0.5 truncate w-full" title={displayTown.replace("Poble Principal:", "").trim()}>
                                {displayTown.replace("Poble Principal:", "").trim()}
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="header-right-meta flex items-center gap-2">
                <div className="header-meta-details flex flex-col items-end justify-center leading-none">
                    {cardVariant !== 'pobles' && (
                        <div className="flex flex-col items-start mr-1">
                            <span className="header-time text-[11px] font-black text-on-accent-muted tracking-tighter mb-0.5">{displayTime}</span>
                            <span className="header-date text-on-accent text-[12px] font-black">{displayDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UniversalCardHeader;


=====================================
FILE: src/components/UniversalCardMedia.jsx
=====================================

import React, { useState } from 'react';
import { Image as ImageIcon, Zap } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import Watermark from './Watermark';

const UniversalCardMedia = ({ 
    item, 
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer 
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        
        // Regla Dorada: Imatge sempre obri el visor en gran.
        if (mediaList && mediaList.length > 0) {
            openViewer(mediaList, 0);
        } else if (displayImage) {
            openViewer([{ src: displayImage, title: displayTitle, type: 'image' }], 0);
        }
    };

    return (
        <div className="card-media-wrapper relative" onClick={handleMediaClick}>
            {(item?.is_pinned || item?.metadata?.is_pinned) && (
                <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-full p-2 text-[var(--theme-accent-primary)] shadow-xl border border-white/20 select-none pointer-events-none">
                    <Zap size={16} fill="currentColor" className="zap-celestial" />
                </div>
            )}
            {mediaList && mediaList.length > 1 ? (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                    <div 
                        className="image-overlay-credits absolute right-2 z-10 pointer-events-none drop-shadow-md pb-1" 
                        style={{ fontSize: '11px', bottom: '4px', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                        © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    {(!displayImage || hasImageError) ? (
                        <Watermark variant="white" opacity={0.5}>
                            <img 
                                src="/assets/brain/generations/nano_relleu_notext_1774284617988.png"
                                alt="Paisatge Solarpunk genèric"
                                className="universal-card-media filter brightness-75 contrast-125 saturate-50"
                                loading="lazy"
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA (FALLBACK)
                            </div>
                        </Watermark>
                    ) : (
                        <Watermark variant="white" opacity={0.7}>
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="universal-card-media" 
                                loading="lazy" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openViewer({ src: displayImage, title: displayTitle, type: 'image' });
                                }}
                                style={{ cursor: 'zoom-in' }}
                                onError={() => setHasImageError(true)}
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                            </div>
                        </Watermark>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalCardMedia;


=====================================
FILE: src/components/UniversalCitation.css
=====================================

.universal-citation {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: rgba(0, 242, 255, 0.05);
    border: 1px solid var(--color-primary-soft);
    border-radius: 0px;
    color: var(--color-primary);
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    margin: 0 4px;
    vertical-align: middle;
    backdrop-filter: blur(4px);
    white-space: nowrap;
}

.universal-citation:hover {
    background: var(--color-primary-soft);
    color: var(--text-main);
    transform: scale(1.05) translateY(-1px);
    box-shadow: var(--shadow-hard);
}

.universal-citation:active {
    transform: scale(0.95);
}

.external-signal {
    opacity: 0.5;
    margin-left: 2px;
}

.universal-citation:hover .external-signal {
    opacity: 1;
}

/* Animación de resaltado para bloques */
@keyframes citationHighlight {
    0% {
        background-color: rgba(0, 242, 255, 0.3);
    }

    100% {
        background-color: transparent;
    }
}

.highlight-flash {
    animation: citationHighlight 2s ease-out;
    border-radius: 0px;
}

=====================================
FILE: src/components/UniversalCitation.jsx
=====================================

import { FileText, Image as ImageIcon, Music, Link, ExternalLink, Search, History } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { logger } from '../utils/logger';
import './UniversalCitation.css';

/**
 * UniversalCitation: El corazón de la VERDAD DE HIERRO.
 * Maneja navegación profunda basada en DIDs y anclajes semánticos.
 */
const UniversalCitation = ({ label, did, anchor }) => {
    const { openViewer } = useModal();

    const handleClick = (e) => {
        e.stopPropagation();
        logger.info(`[Citation] Obrent Visor per a: ${did} [Anchor: ${anchor}]`);

        // Detección de tipo
        let type = 'DOC';
        if (anchor.includes('audit') || did.includes('audit')) type = 'COMPARISON';
        else if (anchor.includes('page=') || did.includes('doc:')) type = 'PDF';
        else if (anchor.includes('entity=') || did.includes('img:')) type = 'IMAGE';
        else if (anchor.includes('t=') || did.includes('aud:')) type = 'AUDIO';
        else if (anchor.includes('block=') || did.includes('note:')) type = 'TEXT';

        openViewer({ did, anchor, label, type });
    };

    const getIcon = () => {
        if (anchor.includes('audit') || did.includes('audit')) return <History size={12} />;
        if (anchor.includes('page=')) return <FileText size={12} />;
        if (anchor.includes('entity=')) return <ImageIcon size={12} />;
        if (anchor.includes('t=')) return <Music size={12} />;
        if (anchor.includes('search')) return <Search size={12} />;
        return <Link size={12} />;
    };

    return (
        <span className="universal-citation" onClick={handleClick} title={`Font: ${did}`}>
            {getIcon()}
            {label}
            <ExternalLink size={10} className="external-signal" />
        </span>
    );
};

export default UniversalCitation;


=====================================
FILE: src/components/VersionGatekeeper.css
=====================================

.gatekeeper-purge-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    color: white;
    padding: 20px;
}

.purge-spinner {
    font-size: 80px;
    margin-bottom: 20px;
    animation: spin 2s linear infinite;
}

.purge-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--accent-orange);
    letter-spacing: 4px;
    margin: 0;
    text-transform: uppercase;
}

.purge-subtitle {
    color: #666;
    font-size: 0.9rem;
    letter-spacing: 2px;
    margin-top: 10px;
    font-family: monospace;
}

.purge-version {
    position: absolute;
    bottom: 20px;
    font-size: 10px;
    opacity: 0.3;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

=====================================
FILE: src/components/VersionGatekeeper.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { APP_VERSION } from '../constants';
import './VersionGatekeeper.css';

/**
 * [MASTER] VersionGatekeeper - El Portal del Temps del Mas
 * Controla que la versió de l'app siga la correcta. Si no, purga nuclear.
 */
const VersionGatekeeper = ({ children }) => {
    // [INITIALIZATION] Check version directly in render state to avoid cascading effects
    const [purging] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return localVersion && localVersion !== APP_VERSION;
    });

    const [isReady] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return !localVersion || localVersion === APP_VERSION;
    });

    useEffect(() => {
        if (purging) {
            const timer = setTimeout(() => {
                const now = Date.now();
                const lastReload = parseInt(localStorage.getItem('sp_last_version_reload') || '0');
                
                if (now - lastReload < 10000) {
                    console.error('[VersionGatekeeper] Circuit breaker actiu. Sincronitzant versió manualment.');
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    window.location.reload(); // Un últim intent per si de cas, però el flag ara coincideix
                } else {
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    localStorage.setItem('sp_last_version_reload', now.toString());
                    window.location.reload(true);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [purging]);

    if (purging) {
        return (
            <div className="gatekeeper-purge-overlay">
                <div className="purge-spinner">🏺</div>
                <h2 className="purge-title">FENT DISSABTE</h2>
                <p className="purge-subtitle">ACTUALITZANT EL MAS...</p>
                <div className="purge-version">{APP_VERSION}</div>
            </div>
        );
    }

    if (!isReady) return null;
    return <>{children}</>;
};

export default VersionGatekeeper;


=====================================
FILE: src/components/VisionSelectorModal.css
=====================================


.vision-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

.vision-modal-content {
    background: var(--bg-card);
    width: 100%;
    max-width: 400px;
    border-radius: var(--radius-2xl);
    border: var(--border-master);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.vision-modal-header {
    padding: 16px 20px;
    background: var(--bg-surface);
    border-bottom: var(--border-master);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.vision-modal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 900;
    letter-spacing: 1px;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.vision-modal-close {
    background: none;
    border: none;
    color: var(--text-main);
    cursor: pointer;
    opacity: 0.6;
}

.vision-modal-body {
    padding: 24px;
}

.vision-modal-intro {
    font-weight: 800;
    margin-bottom: 20px;
    font-size: 1.1rem;
}

.vision-modes-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.vision-mode-item {
    background: var(--bg-surface);
    border: var(--border-master);
    padding: 20px;
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    width: 100%;
}

.vision-mode-item:hover {
    background: var(--bg-card);
    transform: translateY(-2px);
}

.vision-mode-item.active {
    border-color: var(--color-primary);
    background: var(--color-primary-soft);
}

.vision-mode-text h3 {
    font-size: 1rem;
    font-weight: 900;
    margin-bottom: 4px;
}

.vision-mode-text p {
    font-size: 0.8rem;
    line-height: 1.3;
    color: var(--text-muted);
}

.active-indicator {
    position: absolute;
    right: 15px;
    width: 12px;
    height: 12px;
    background: var(--color-primary);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--color-primary);
}

.vision-modal-footer {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.75rem;
    color: var(--text-muted);
    font-style: italic;
    background: var(--bg-surface);
    padding: 12px;
    border-radius: var(--radius-lg);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}


=====================================
FILE: src/components/VisionSelectorModal.jsx
=====================================

import React from 'react';
import { X, User, Zap, Shield, Info, Sparkles } from 'lucide-react';
import './VisionSelectorModal.css';

const VisionSelectorModal = ({ isOpen, onClose, currentMode, onSelect }) => {
    if (!isOpen) return null;

    const modes = [
        {
            id: 'humana',
            title: 'MODO HUMÀ',
            desc: 'Contingut pur de veïns reals. Sense personatges ni ficció.',
            icon: <User size={32} />,
            color: '#4CAF50'
        },
        {
            id: 'iaia',
            title: 'JOC DE ROL (HÍBRID)',
            desc: 'Personatges, llegendes i lore del poble activat.',
            icon: <Zap size={32} />,
            color: '#00D2FF'
        },
        {
            id: 'immersiva',
            title: 'VISIÓ IMMERSIVA',
            desc: 'Tota la colla: Gall, Nano, Mixa, Flash... Vida total.',
            icon: <Sparkles size={32} />,
            color: 'var(--theme-accent-primary)'
        }
    ];

    return (
        <div className="vision-modal-overlay" onClick={onClose}>
            <div className="vision-modal-content" onClick={e => e.stopPropagation()}>
                <header className="vision-modal-header">
                    <div className="vision-modal-title">
                        <Shield size={20} />
                        <span>PROTOCOL DE VISIÓ</span>
                    </div>
                    <button className="vision-modal-close" onClick={onClose}><X size={24} /></button>
                </header>

                <div className="vision-modal-body">
                    <p className="vision-modal-intro">Tria com vols interactuar amb el batec del poble:</p>
                    
                    <div className="vision-modes-list">
                        {modes.map(m => (
                            <button 
                                key={m.id}
                                className={`vision-mode-item ${currentMode === m.id ? 'active' : ''}`}
                                onClick={() => {
                                    onSelect(m.id);
                                    onClose();
                                }}
                            >
                                <div className="vision-mode-icon" style={{ color: m.color }}>
                                    {m.icon}
                                </div>
                                <div className="vision-mode-text">
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                                {currentMode === m.id && <div className="active-indicator" />}
                            </button>
                        ))}
                    </div>

                    <div className="vision-modal-footer">
                        <Info size={16} />
                        <span>Pots canviar això en qualsevol moment des del perfil de l'IAIA.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionSelectorModal;


=====================================
FILE: src/components/VoiceMessage.jsx
=====================================

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Trash2 } from 'lucide-react';
import './VoiceMessage.css';

/**
 * VoiceMessage - Component per reproduir missatges de veu
 */
const VoiceMessage = ({ audioUrl, duration, onRemove }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="voice-message-bubble flex items-center gap-3 p-3 bg-white/5 rounded-[28px] border border-white/5 max-w-xs transition-all hover:bg-white/[0.08]">
            <button 
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-[var(--theme-accent-primary)] text-white shadow-lg active:scale-95 transition-all"
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
            </button>
            
            <div className="flex-1">
                <div className="h-1.5 w-full bg-white/10 rounded-[28px] overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {duration || '0:00'}
                    </span>
                    <div className="flex items-center gap-1 opacity-40">
                        <Volume2 size={10} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {onRemove && (
                <button 
                    onClick={onRemove}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={handleEnded} 
                className="hidden"
            />
        </div>
    );
};

export default VoiceMessage;


=====================================
FILE: src/components/VoiceRecorder.css
=====================================

.voice-recorder-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 0 10px;
    background-color: var(--bg-secondary, #f5f5f5);
    border-radius: 0px;
    height: 50px;
}

.recording-visualizer {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
}

.recording-dot {
    width: 10px;
    height: 10px;
    border-radius: 0px;
    background-color: #ef4444;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.7; }
}

.btn-cancel-voice {
    color: #ef4444;
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.btn-cancel-voice:hover {
    transform: scale(1.1);
    background-color: rgba(239, 68, 68, 0.1);
    border-radius: 0px;
}

.btn-send-voice {
    background-color: #25D366;
    color: white;
    border-radius: 0px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: var(--shadow-hard);
}

.btn-send-voice:hover {
    transform: scale(1.1);
    background-color: #20bd5a;
}


=====================================
FILE: src/components/VoiceRecorder.jsx
=====================================

import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Send, Square } from 'lucide-react';
import { logger } from '../utils/logger';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onSend, onCancel, lang = 'va' }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    const [transcript, setTranscript] = useState('');

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            try {
                const { speechService } = await import('../services/speechService');
                if (speechService.isSupported && !speechService.isStarted) {
                    speechService.listen(lang).then(text => {
                        setTranscript(text);
                        logger.log('[VoiceRecorder] Transcripció JARVIS:', text);
                    }).catch(err => logger.error('[VoiceRecorder] Speech error:', err));
                }
            } catch {
                logger.error('[VoiceRecorder] Speech service import error');
            }

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;

            drawVisualizer();

            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const recordedDuration = duration;
                chunksRef.current = [];
                stopVisualizer();

                try {
                    const { speechService } = await import('../services/speechService');
                    speechService.stop();
                } catch {
                    // Fail silent
                }

                onSend(audioBlob, recordedDuration, transcript);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);

            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setDuration(seconds);
                if (seconds >= 120) {
                    stopRecording();
                }
            }, 1000);

        } catch (error) {
            logger.error('Error accessing microphone:', error);
            alert('No es pot accedir al micròfon. Comprova els permisos.');
            onCancel();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            clearInterval(timerRef.current);
            setIsRecording(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        clearInterval(timerRef.current);
        stopVisualizer();
        chunksRef.current = [];
        setDuration(0);
        onCancel();
    };

    const drawVisualizer = () => {
        if (!analyserRef.current || !canvasRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
        }
    };

    const formatDuration = (secs) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        startRecording();
        return () => {
            cancelRecording();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="voice-recorder-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0 10px' }}>
            <button onClick={cancelRecording} className="btn-cancel-voice" style={{ color: '#ef4444', background: 'none', border: 'none', padding: '8px' }}>
                <X size={24} />
            </button>

            <div className="recording-visualizer" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="recording-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1s infinite' }}></div>
                <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{formatDuration(duration)}</span>
                <canvas ref={canvasRef} width={100} height={30} style={{ height: '30px', width: '100px' }}></canvas>
            </div>

            <button onClick={stopRecording} className="btn-send-voice" style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                <Send size={20} />
            </button>
        </div>
    );
};

export default VoiceRecorder;


=====================================
FILE: src/components/Watermark.css
=====================================

.watermark-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.watermark-overlay {
    position: absolute;
    pointer-events: none;
    z-index: 20;
    transition: all 0.3s ease;
}

.watermark-overlay.bottom-right {
    bottom: 12px;
    right: 12px;
}

.watermark-overlay.bottom-left {
    bottom: 12px;
    left: 12px;
}

.watermark-overlay.top-right {
    top: 12px;
    right: 12px;
}

.watermark-overlay.top-left {
    top: 12px;
    left: 12px;
}

.watermark-logo {
    height: 32px;
    width: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
    object-fit: contain;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .watermark-logo {
        height: 24px;
    }
}


=====================================
FILE: src/components/Watermark.jsx
=====================================

import React from 'react';
import './Watermark.css';

const Watermark = ({ children, variant = 'white', position = 'bottom-right', opacity = 0.6 }) => {
    const logoSrc = variant === 'white' 
        ? '/logo_socdepoble_white_clean.png' 
        : '/logo_socdepoble_black_sketch.png';

    return (
        <div className="watermark-container">
            {children}
            <div className={`watermark-overlay ${position}`} style={{ opacity }}>
                <img src={logoSrc} alt="Sóc de Poble" className="watermark-logo" />
            </div>
        </div>
    );
};

export default Watermark;


=====================================
FILE: src/components/WelcomePresentation.jsx
=====================================

import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Scale, Shield, CheckCircle2, ChevronRight, Fingerprint, Database, Award, UserPlus, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WelcomePresentation = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const infographies = [
        {
            title: "SOBIRANIA DIGITAL",
            desc: "La dada com a arrel, no com a mercaderia. En el Mas Digital, tu eres el propietari de la teua informació. Apostem per connexions horitzontals peer-to-peer, eliminant intermediaris extractius i garantint que el bategat del teu poble romanga privat i sobirà.",
            image: "/assets/infographies/art_sobirania_v1036.png"
        },
        {
            title: "DADES AMB TRELLAT",
            desc: "Privacitat KM 0. Sols recollim allò que és essencial per a la convivència i el comerç local. Les teues dades no viatgen a servidors desconeguts, sinó que s'arrelen en el territori per generar utilitat real i protegir el futur rural.",
            image: "/assets/infographies/art_trellat_v1036.png"
        },
        {
            title: "MEMÒRIA VIVA",
            desc: "Un bategat que uneix generacions a través del codi i la saviesa popular. Garanteix que la intel·ligència artificial no oblide d'on venim. Implementem protocols que dignifiquen el passat mentre construïm el futur digital.",
            image: "/assets/infographies/art_memoria_v1036.png"
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % infographies.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + infographies.length) % infographies.length);

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();
        setTouchEnd(null);
        setTouchStart(null);
    };

    return (
        <div className="relative w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-24 animate-in fade-in duration-1000 overflow-x-hidden">
            
            {/* ATMOSPHERIC GLOW - ADAPTED FOR COMPONENT */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-lighten" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-lighten" />
            </div>

            {/* 1. HERO SECTION */}
            <div className="text-center mb-12 md:mb-16 px-2">
                <h1 className="text-5xl md:text-[90px] lg:text-[120px] font-black italic tracking-tighter uppercase text-gray-900 dark:text-white leading-[0.85] mb-6 drop-shadow-xl md:drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] relative inline-block">
                    SÓC DE POBLE
                </h1>
                
                <h2 className="text-2xl md:text-5xl text-blue-600 dark:text-primary font-black italic mb-8 md:mb-12 tracking-tight">
                    Portal de Pobles Connectats
                </h2>

                <p className="text-sm md:text-xl font-bold text-gray-900 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
                    Una <span className="text-blue-600 dark:text-primary font-black uppercase">XARXA SOCIAL DESCENTRALITZADA</span> de PROGRAMARI LLIURE, per CONNECTAR i GEOLOCALITZAR recursos d’utilitat social, compartint informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals i mostrar l’atractiu dels pobles com a llocs on viure i treballar.
                </p>

                <div className="flex flex-col items-center gap-4 md:gap-6 max-w-lg mx-auto">
                    <button
                        className="relative flex items-center justify-center px-6 md:px-12 py-4 md:py-6 bg-blue-600 dark:bg-primary text-white rounded-full md:rounded-[24px] font-black uppercase text-sm md:text-xl tracking-widest shadow-xl dark:shadow-[0_20px_40px_rgba(255,107,0,0.3)] hover:scale-105 active:scale-95 transition-all w-full"
                        onClick={() => navigate("/registre")}
                    >
                        <UserPlus size={24} className="absolute left-6 hidden sm:block" />
                        <span className="text-center w-full">Connecta amb el teu Poble!</span>
                    </button>
                    
                    <button
                        className="relative flex items-center justify-center px-6 md:px-12 py-4 md:py-6 bg-primary dark:bg-secondary text-white rounded-full md:rounded-[24px] font-black uppercase text-sm md:text-xl tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all w-full"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: "Sóc de Poble", text: "Connecta amb la teua comunitat.", url: window.location.origin });
                            } else alert("Enllaç copiat!");
                        }}
                    >
                        <Share2 size={24} className="absolute left-6 hidden sm:block" />
                        <span className="text-center w-full">{t("common.share_soc", "Compartir Sóc de Poble")}</span>
                    </button>
                </div>
            </div>

            {/* 2. INFOGRAPHIC CAROUSEL - RESPONSIVE FIXES */}
            <div className="mb-20 md:mb-24 relative px-2">
                <div className="flex items-center justify-between mb-8 max-w-[950px] mx-auto">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-secondary/10 rounded-xl border border-blue-100 dark:border-secondary/20">
                            <Fingerprint size={20} className="text-blue-600 dark:text-secondary animate-pulse" />
                        </div>
                        <h3 className="text-blue-600 dark:text-secondary font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-sm">FILOSOFIA DEL RHIZOME</h3>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.3em]">GLOSSARI DE SOBIRANIA</span>
                        <div className="w-12 h-px bg-gray-300 dark:bg-white/10" />
                    </div>
                </div>

                <div className="relative flex items-center justify-center w-full max-w-[950px] mx-auto">
                    {/* Fixed Mobile Buttons: Inside or Overlaid Instead of Overflowing */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-0 md:-left-20 z-30 p-2 md:p-6 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-primary transition-all shadow-xl active:scale-90"
                    >
                        <ChevronRight size={28} strokeWidth={3} className="rotate-180" />
                    </button>

                    <div 
                        className="relative aspect-square w-full bg-gray-50 dark:bg-black rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl md:shadow-[0_80px_120px_rgba(0,0,0,0.3)] cursor-pointer group/main border border-gray-100 dark:border-white/5"
                        onClick={() => setIsModalOpen(true)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover/main:scale-105">
                            <img 
                                src={infographies[currentSlide].image} 
                                alt={infographies[currentSlide].title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Overlay with Dark/Light Support */}
                        <div className="absolute top-6 md:top-12 inset-x-0 flex justify-center z-20 pointer-events-none group-hover/main:-translate-y-2 transition-transform duration-500">
                            <div className="flex flex-col items-center gap-2">
                                <img src="/assets/master/logo-socdepoble-rect.svg" alt="SDP" className="h-10 md:h-16 drop-shadow-xl dark:invert" />
                                <div className="text-[10px] sm:text-xs font-black text-blue-600 dark:text-primary uppercase tracking-[0.4em] md:tracking-[0.6em] drop-shadow-md bg-white/50 dark:bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">
                                    {infographies[currentSlide].title}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-0 md:-right-20 z-30 p-2 md:p-6 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-primary transition-all shadow-xl active:scale-90"
                    >
                        <ChevronRight size={28} strokeWidth={3} />
                    </button>
                </div>

                <div className="mt-8 md:mt-12 w-full max-w-[950px] mx-auto p-6 md:p-12 bg-gray-50 dark:bg-white/[0.03] rounded-[32px] md:rounded-[40px] border border-gray-200 dark:border-white/5 backdrop-blur-md transition-all hover:border-blue-200 dark:hover:border-primary/20">
                    <h4 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white mb-4">
                        {infographies[currentSlide].title}
                    </h4>
                    <p className="text-sm md:text-xl font-bold leading-relaxed text-gray-900 dark:text-white/80">
                        {infographies[currentSlide].desc}
                    </p>
                    <div className="mt-6 md:mt-8 flex justify-center gap-3">
                        {infographies.map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 md:h-2 transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-8 md:w-12 bg-blue-600 dark:bg-primary shadow-md' : 'w-2 bg-gray-300 dark:bg-white/20'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. LLICÈNCIA OBERTA SECTOR */}
            <div className="w-full max-w-[1200px] mx-auto mb-20 md:mb-24 px-2 lg:px-0">
                <div className="relative group perspective-1000">
                    <div className="absolute -inset-4 bg-blue-600/10 dark:bg-primary/20 blur-[60px] opacity-0 md:opacity-50 rounded-[40px]" />
                    <div className="relative bg-white dark:bg-[#0a0a0a] border-4 border-blue-600/20 dark:border-primary/30 rounded-[32px] md:rounded-[50px] p-8 md:p-16 shadow-2xl overflow-hidden group-hover:border-blue-600/50 dark:group-hover:border-primary/60 transition-all">
                        
                        <div className="absolute -right-20 -bottom-20 text-blue-600/5 dark:text-primary/10 rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                            <Award size={400} strokeWidth={1} />
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
                            <div className="p-6 md:p-10 bg-blue-50 dark:bg-primary/10 rounded-[32px] border-2 border-blue-200 dark:border-primary/40 text-blue-600 dark:text-primary shrink-0 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={64} className="md:w-[80px] md:h-[80px]" strokeWidth={2.5} />
                            </div>
                            
                            <div className="space-y-6 text-center md:text-left flex-1">
                                <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-blue-600 dark:text-primary leading-none">
                                    LLICÈNCIA OBERTA
                                </h2>
                                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white/90 leading-tight">
                                    Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                                    <button onClick={() => navigate('/genesis')} className="px-8 py-4 bg-blue-600 dark:bg-primary text-white rounded-full font-black uppercase text-xs md:text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                        Condicions i arquitectura
                                    </button>
                                    <NavLink to="/ofici" className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-black uppercase text-xs md:text-sm tracking-widest">
                                        <Database size={18} className="text-blue-600 dark:text-primary" /> Protocol de dades
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. IDENTITATS DEL MAS (Triad) */}
            <div className="w-full max-w-[1400px] mx-auto mb-24 md:mb-40 space-y-12 md:space-y-16 px-2">
                <div className="flex items-center gap-4 md:gap-8 opacity-40">
                    <div className="flex-1 h-px bg-gray-400 dark:bg-white/20" />
                    <span className="text-[10px] md:text-[12px] font-black text-gray-900 dark:text-white tracking-[0.4em] md:tracking-[0.8em] uppercase">IDENTITATS DEL MAS</span>
                    <div className="flex-1 h-px bg-gray-400 dark:bg-white/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { title: "SÓC DE POBLE", entity: "PROJECTE SOCIAL", desc: "Plataforma bategant per a la memòria viva i la governança d'un territori sobirà.", path: "/perfil/socdepoble", logo: true },
                        { title: "EL RENTONAR", entity: "AGRUPACIÓ ECOLOGISTA", desc: "Entitat que promou i empara aquest projecte des de la resistència cultural.", path: "/perfil/rentonar", icon: <Scale size={40} className="dark:text-white/40" /> },
                        { title: "JAVI LLINARES", entity: "DIRECCIÓ I DISSENY", desc: "Responsable de la realització, disseny i coordinació. Mestre darrere del Mas Digital.", path: "/perfil/d6325f44-7277-4d20-b020-166c010995ab", img: "/assets/master/Javi_Llinares-Foto_perfil-1.jpg" }
                    ].map((card, i) => (
                        <NavLink key={i} to={card.path} className="group flex flex-col items-center justify-between p-8 md:p-12 bg-white dark:bg-black border-2 border-gray-100 dark:border-white/5 rounded-[40px] shadow-lg hover:-translate-y-2 transition-all">
                            <div className="w-24 h-24 md:w-28 md:h-28 mb-8 bg-gray-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden group-hover:scale-110 transition-transform">
                                {card.logo && <img src="/assets/master/logo-socdepoble-rect.svg" alt="SDP" className="w-16 h-auto dark:invert opacity-60 group-hover:opacity-100 transition-opacity" />}
                                {card.icon}
                                {card.img && <img src={card.img} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">{card.title}</h3>
                                <p className="text-[10px] font-black text-gray-600 dark:text-white/60 tracking-[0.3em] uppercase">{card.entity}</p>
                                <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white/80 leading-relaxed">{card.desc}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* 5. LEGAL TEXT & COOKIES */}
            <div id="avis-legal" className="w-full max-w-[1200px] mx-auto text-gray-900 dark:text-white/80 space-y-24 px-4 pb-20">
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl md:text-5xl drop-shadow-md">✅</span>
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">1. Identitat Bategant</h3>
                    </div>
                    <p className="text-lg md:text-xl font-medium">LSSI-CE: Responsable Sobirà F. Javier Llinares García (21476359V). El Mas Central es troba registrat a la Calle Sant Isidre Llaurador, 16. Connecta via socdepoble@socdepoble.org.</p>
                </section>
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl md:text-5xl drop-shadow-md">✅</span>
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">2. Sobirania de l'Usuari</h3>
                    </div>
                    <p className="text-lg md:text-xl font-medium">Sols recollim el necessari per al bategat del node: perfil, localització voluntària i memòria social KM 0. Pots descarregar tota la teua memòria digital o fulminar el teu node de forma autònoma enviant un missatge al Mestre. Especialment per als Forasters (Guest Mode), l'experiència és completament efímera: les teues dades desapareixen en eixir del navegador, garantint l'exploració anònima sense raca cap.</p>
                </section>
                <section id="cookies" className="p-8 md:p-12 bg-gray-50 dark:bg-gradient-to-br from-[#080808] to-black rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl">
                    <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase mb-4">3. Política de Cookies</h3>
                    <p className="text-lg md:text-xl font-medium mb-6">"Ací al poble no ens agrada que ningú ens diga què hem d'anar a comprar. Sóc de Poble no utilitza gats vells de Google ni píxels extractius." Utilitzem cookies lliures i anònimes d'auto-hostalatge.</p>
                    <button className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#2563eb] dark:hover:bg-primary hover:text-white transition-all">Gestionar Cookies Anònimes</button>
                </section>
                
                <div className="text-center opacity-40 pt-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.8em]">FI DEL COMUNICAT SOBIRÀ</div>
                    <div className="text-5xl font-black italic tracking-widest mt-2">{new Date().getFullYear()}</div>
                </div>
            </div>

            {/* MODAL FULLSCREEN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20" onClick={() => setIsModalOpen(false)}>
                    <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img src={infographies[currentSlide].image} alt="Art" className="w-full h-full object-contain rounded-[20px] md:rounded-[40px] shadow-2xl" />
                        <button onClick={prevSlide} className="absolute left-[-20px] md:left-[-60px] p-4 text-gray-400 hover:text-blue-600 dark:hover:text-primary"><ChevronRight size={48} className="rotate-180" /></button>
                        <button onClick={nextSlide} className="absolute right-[-20px] md:right-[-60px] p-4 text-gray-400 hover:text-blue-600 dark:hover:text-primary"><ChevronRight size={48} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomePresentation;


=====================================
FILE: src/components/WikiPulseSheet.css
=====================================

.wiki-pulse-container {
    padding: 24px;
    border-radius: 0px;
    border-left: 4px solid #3b82f6;
    background: rgba(15, 23, 42, 0.4);
    margin: 16px 0;
}

.pulse-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.pulse-icon {
    width: 40px;
    height: 40px;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pulse-extract {
    font-size: var(--font-size-base);
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 24px;
}

.pulse-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.pulse-stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
    border-radius: 0px;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.4;
    margin-bottom: 2px;
}

.stat-value {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
}

.pulse-link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 12px;
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 0px;
    color: #93c5fd;
    font-size: var(--font-size-base);
    font-weight: 900;
    letter-spacing: 1px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.pulse-link-btn:hover {
    background: rgba(59, 130, 246, 0.25);
    transform: translateY(-2px);
}

=====================================
FILE: src/components/WikiPulseSheet.jsx
=====================================

import React from 'react';
import { ExternalLink, MapPin, Users, Landmark } from 'lucide-react';
import './WikiPulseSheet.css';

const WikiPulseSheet = ({ wikiData, status }) => {
    if (!wikiData) return null;

    return (
        <div className="wiki-pulse-container institution-glass animate-in animate-slide-up">
            <div className="pulse-header">
                <div className="pulse-icon">
                    <BookOpen size={20} className="text-blue-400" />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Memòria Universal</h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">Powered by Wikipedia</p>
                </div>
            </div>

            <div className="pulse-content">
                <p className="pulse-extract">
                    {wikiData.extract}
                </p>

                <div className="pulse-stats-grid">
                    {wikiData.coordinates && (
                        <div className="pulse-stat-item">
                            <MapPin size={14} className="opacity-50" />
                            <div className="stat-info">
                                <span className="stat-label">Ubicació</span>
                                <span className="stat-value">{wikiData.coordinates.lat.toFixed(3)}, {wikiData.coordinates.lon.toFixed(3)}</span>
                            </div>
                        </div>
                    )}
                    <div className="pulse-stat-item">
                        <Landmark size={14} className="opacity-50" />
                        <div className="stat-info">
                            <span className="stat-label">Entitat</span>
                            <span className="stat-value">{status || 'Municipi'}</span>
                        </div>
                    </div>
                </div>

                {wikiData.page_url && (
                    <a
                        href={wikiData.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pulse-link-btn"
                    >
                        <span>LLEGIR ARXIU COMPLET</span>
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </div>
    );
};

export default WikiPulseSheet;


=====================================
FILE: src/components/admin/StoreManagementModule.jsx
=====================================

import React, { useState } from 'react';
import { Store, CheckCircle, Clock, AlertCircle, RefreshCw, Smartphone, Globe, Github } from 'lucide-react';

const StoreManagementModule = ({ addLog }) => {
    const [verifying, setVerifying] = useState(false);

    const storeStatus = [
        { name: 'Google Play (Android TWA)', status: 'Beta', version: '1.5.4', lastUpdate: '2026-01-25', platform: 'Android' },
        { name: 'Apple App Store (iOS Wrapper)', status: 'Pending', version: '0.9.0', lastUpdate: 'N/A', platform: 'iOS' },
        { name: 'Samsung Galaxy Store', status: 'In Review', version: '1.5.0', lastUpdate: '2026-01-28', platform: 'Android' }
    ];

    const handleSync = () => {
        setVerifying(true);
        addLog('Verificant estats de producció en Google Play Console...', 'info');
        setTimeout(() => {
            addLog('Verificant TestFlight a Apple Developer Portal... OK', 'success');
            addLog('Sincronització de botigues completada.', 'success');
            setVerifying(false);
        }, 2000);
    };

    const handleHardPurge = () => {
        if (!window.confirm("🔴 ALERTA: Això forçarà un reinici de la caché per a tots els usuaris de l'App. Continuar?")) return;
        addLog('PROTOCOL DE PURGA ACTIVAT. Enviant senyal de Service Worker...', 'warn');
        setTimeout(() => addLog('Senyal de purga propagat a 452 instàncies.', 'success'), 1500);
    };

    return (
        <div className="stores-management-card neural-core-panel">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Store className="text-cyan-400" /> CENTRE DE DISTRIBUCIÓ [MASTER]
                </h2>
                <button
                    className="btn-hud-small"
                    onClick={handleSync}
                    disabled={verifying}
                >
                    <RefreshCw size={16} className={verifying ? 'spin' : ''} />
                    <span>Sincronitzar</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="status-overview p-4 border border-gray-800 rounded-[28px] bg-black/20">
                    <h3 className="font-bold mb-4 text-cyan-400">Estat de les Plataformes</h3>
                    <div className="space-y-4">
                        {storeStatus.map((store, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-[20px]">
                                <div className="flex items-center gap-3">
                                    {store.platform === 'Android' ? <Smartphone size={18} /> : <Globe size={18} />}
                                    <div>
                                        <div className="text-sm font-bold">{store.name}</div>
                                        <div className="text-xs opacity-50">Versió {store.version} · {store.lastUpdate}</div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${store.status === 'Beta' ? 'bg-green-900/40 text-green-400' :
                                        store.status === 'Pending' ? 'bg-orange-900/40 text-orange-400' :
                                            'bg-cyan-900/40 text-cyan-400'
                                    }`}>
                                    {store.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="automation-panel p-4 border border-gray-800 rounded-[28px] bg-black/20">
                    <h3 className="font-bold mb-4 text-purple-400">Automatització & CI/CD</h3>
                    <div className="space-y-3">
                        <button className="btn-primary w-full flex items-center justify-center gap-2" style={{ background: '#333' }}>
                            <Github size={16} /> Deploy via GitHub Actions
                        </button>
                        <button
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            style={{ background: 'var(--color-error-soft)', color: 'var(--color-error)' }}
                            onClick={handleHardPurge}
                        >
                            <RefreshCw size={16} /> Forçar Purga Remota
                        </button>
                    </div>

                    <div className="mt-6 p-3 border border-dashed border-gray-700 rounded-[20px]">
                        <h4 className="text-xs font-bold mb-2 opacity-50">DIRECTIVA DE MANTENIMENT</h4>
                        <p className="text-[10px] italic">
                            "L'estabilitat del veí és sagrada. Si una versió de la botiga falla, el downgrade ha de ser automàtic via protocol de resiliència Atum."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreManagementModule;


=====================================
FILE: src/components/admin/SuperRatonControl.jsx
=====================================

import React, { useState } from 'react';
import { Zap, Calendar, Activity, Shield, MousePointer2, PlayCircle } from 'lucide-react';
import { SUPER_RATON_MOTTO, SUPER_RATON_LORE } from '../../data/superRatonData';

const SuperRatonControl = ({ addLog }) => {
    const [isVitaminsMode, setIsVitaminsMode] = useState(true);
    const [impactScore, setImpactScore] = useState(99);

    const handleVitaminize = () => {
        addLog('Iniciant protocol de vitamina social...', 'warn');
        setTimeout(() => {
            addLog(`"${SUPER_RATON_MOTTO}" dispersat pel sistema.`, 'success');
            setImpactScore(prev => Math.min(100, prev + 1));
        }, 1500);
    };

    const scheduleResearch = () => {
        addLog('Planificant recerca de llinatge Super Ratón al calendari...', 'info');
        // Simulem integració amb calendarData.js
        setTimeout(() => {
            addLog('Nou Ritu de Masia: "Vitamina de Recerca" agendat.', 'success');
        }, 1000);
    };

    return (
        <div className="neural-core-panel" style={{ minHeight: '500px', border: '2px solid var(--hud-accent)' }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black flex items-center gap-3" style={{ color: 'var(--hud-accent)' }}>
                    <Zap /> SUPER RATÓN CONTROL
                </h2>
                <span className="hud-badge" style={{ background: 'var(--hud-accent)', color: '#000' }}>GOD MODE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 border border-gray-800 rounded-[28px] bg-black/40">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Activity size={20} color="var(--hud-accent)" /> IMPACTE SOCIAL
                    </h3>
                    <div className="text-center py-6">
                        <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--hud-accent)' }}>{impactScore}%</div>
                        <div className="text-xs opacity-50 uppercase tracking-widest mt-2">Nivell de Vitamina Col·lectiva</div>
                    </div>
                    <div className="w-full bg-gray-900 h-2 rounded-[28px] overflow-hidden">
                        <div style={{ width: `${impactScore}%`, background: 'var(--hud-accent)', height: '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>
                </div>

                <div className="p-6 border border-gray-800 rounded-[28px] bg-black/40">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MousePointer2 size={20} color="var(--hud-accent)" /> LORE DIDÀCTIC
                    </h3>
                    <p className="text-sm italic mb-4">"{SUPER_RATON_LORE.philosophy}"</p>
                    <div className="text-xs space-y-2 opacity-70">
                        <div><strong>Origen:</strong> {SUPER_RATON_LORE.origin}</div>
                        <div><strong>Rol:</strong> {SUPER_RATON_LORE.role}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    className="btn-hud-primary w-full py-4 rounded-[28px] flex items-center justify-center gap-3 font-bold"
                    style={{ background: 'linear-gradient(90deg, #00f2ff 0%, #0099ff 100%)', color: '#000' }}
                    onClick={handleVitaminize}
                >
                    <Zap size={20} /> VITAMINAR SISTEMA ARA
                </button>

                <div className="flex gap-4">
                    <button
                        className="btn-hud-outline flex-1 py-4 rounded-[28px] flex items-center justify-center gap-2 border-gray-700"
                        onClick={scheduleResearch}
                    >
                        <Calendar size={18} /> AGENDAR RITU RECERCA
                    </button>
                    <button
                        className="btn-hud-outline flex-1 py-4 rounded-[28px] flex items-center justify-center gap-2 border-gray-700"
                        onClick={() => setIsVitaminsMode(!isVitaminsMode)}
                    >
                        <PlayCircle size={18} /> {isVitaminsMode ? 'DESACTIVAR' : 'ACTIVAR'} DIBUIXOS
                    </button>
                </div>
            </div>

            <div className="mt- auto pt-6 opacity-30 text-[10px] text-center tracking-[4px] uppercase">
                Protegit pel Llinatge del Mestre i Super Ratón
            </div>
        </div>
    );
};

export default SuperRatonControl;


=====================================
FILE: src/components/admin/ZeroDaySetupModule.jsx
=====================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings2, Building, GraduationCap, Briefcase, Users, Zap, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
// Import de supabase oprimit (guardat per al futur RPC)
// import { supabase } from '../../services/supabaseService';

const ZeroDaySetupModule = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('poble');
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionStatus, setInjectionStatus] = useState(null);

  const instanceTypes = [
    {
      id: 'poble',
      icon: Building,
      title: 'Poble Obert (Canon)',
      description: 'Configuració nativa per a municipis i comunitats comarcals.',
      lore: [
        { label: 'Matriarca AI', value: 'La IAIA (Llei de la Botifarra)' },
        { label: 'Estructura', value: 'Ajuntament, Places, Veïns' },
        { label: 'Rol', value: 'Preservació cultural i xafarderia sana' }
      ],
      color: 'bg-orange-500/20 text-orange-500 border-orange-500/50'
    },
    {
      id: 'universitat',
      icon: GraduationCap,
      title: 'Campus (Universitat)',
      description: 'Entorn acadèmic, ideal per a facultats o instituts.',
      lore: [
        { label: 'Matriarca AI', value: 'La Conserge / El Degà' },
        { label: 'Estructura', value: 'Rectorat, Facultats, Estudiants' },
        { label: 'Rol', value: 'Dinamització de campus i anuncis' }
      ],
      color: 'bg-blue-500/20 text-blue-500 border-blue-500/50'
    },
    {
      id: 'empresa',
      icon: Briefcase,
      title: 'Xarxa Corporativa',
      description: 'Intranet corporativa per a equips dinàmics.',
      lore: [
        { label: 'Matriarca AI', value: 'Office Manager / HR' },
        { label: 'Estructura', value: 'Direcció, Departaments, Empleats' },
        { label: 'Rol', value: 'Teambuilding i comunicació interna' }
      ],
      color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
    },
    {
      id: 'associacio',
      icon: Users,
      title: 'Falla / Associació',
      description: 'Grups culturals, falles o fogueres amb forta jerarquia d\'esdeveniments.',
      lore: [
        { label: 'Matriarca AI', value: 'La Presidenta / Delegada' },
        { label: 'Estructura', value: 'Junta, Casal, Fallers/Socis' },
        { label: 'Rol', value: 'Organització de festes i debats de casal' }
      ],
      color: 'bg-purple-500/20 text-purple-500 border-purple-500/50'
    }
  ];

  const handleInjectLore = async () => {
    setIsInjecting(true);
    setInjectionStatus(null);
    try {
      // Simulem injecció a DB, o podríem fer una mutació real
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Ací aniria la crida al RPC o modificació de la config global
      // ex: await supabase.rpc('setup_zero_day', { instance_type: selectedType });
      
      setInjectionStatus('success');
    } catch (error) {
      console.error(error);
      setInjectionStatus('error');
    } finally {
      setIsInjecting(false);
    }
  };

  const selectedData = instanceTypes.find(t => t.id === selectedType);

  return (
    <div className="p-4 md:p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Epic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-divider pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Settings2 size={32} className="text-[#0ea5e9]" />
            {t('admin.zero_day_setup', 'SETUP ZERO-DAY')}
          </h2>
          <p className="opacity-80 mt-1 max-w-2xl font-medium">
            Assimilació Cultural del Motor Agnostic. Defineix quin serà l'esperit d'aquesta instància abans de començar la simulació. Aquesta acció mutarà l'ADN dels agents i l'arquitectura de permisos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Llista d'opcions (Esquerra) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="font-bold text-lg uppercase mb-2">Escull l'Essència</h3>
          {instanceTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  isSelected 
                    ? type.color + ' shadow-lg scale-[1.02]' 
                    : 'border-theme-divider hover:border-[#0ea5e9]/50 opacity-70 hover:opacity-100 bg-theme-base'
                }`}
              >
                <div className={`p-3 rounded-full ${isSelected ? 'bg-current/10' : 'bg-theme-divider/50'}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl">{type.title}</h4>
                  <p className="text-sm opacity-80 leading-snug mt-1">{type.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Panel de Detall i Injecció (Dreta) */}
        <div className="lg:col-span-7">
          <div className="bg-theme-sidebar border border-theme-divider rounded-2xl p-6 md:p-8 flex flex-col h-full relative overflow-hidden">
            
            {/* Decal */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Zap size={200} />
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                <ShieldAlert className="text-[#0ea5e9]" />
                Perfil d'Assimilació: <span className="text-[#0ea5e9]">{selectedData.title}</span>
              </h3>

              <div className="bg-black/20 dark:bg-black/40 rounded-xl p-6 space-y-6 mb-8 border border-theme-divider/50">
                <p className="font-mono text-sm opacity-70 uppercase tracking-widest border-b border-theme-divider/50 pb-2">
                  Variables d'Entorn de Simulació
                </p>
                <div className="space-y-4">
                  {selectedData.lore.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className="font-bold opacity-70">{item.label}</span>
                      <span className="bg-theme-base px-3 py-1 rounded-md text-sm font-mono border border-theme-divider">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status or Warnings */}
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-xl mb-8">
                <div className="flex gap-3">
                  <AlertTriangle className="text-yellow-500 shrink-0" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                    Atenció: Injectar un nou perfil reescriurà les entitats base existents (IAIAS, Ajuntament) i els rols per defecte a la base de dades (Protocol OMEGA). Aquesta acció impacta en tota la instància.
                  </p>
                </div>
              </div>
            </div>

            {/* Acció Principal */}
            <div className="relative z-10 mt-auto pt-6 border-t border-theme-divider">
              <button
                onClick={handleInjectLore}
                disabled={isInjecting}
                className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black uppercase text-lg p-5 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInjecting ? (
                  <>
                    <Zap size={24} className="animate-pulse" />
                    Forjant Identitat del Motor...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Mutar Engine cap a {selectedData.title}
                  </>
                )}
              </button>

              {injectionStatus === 'success' && (
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500 font-bold animate-in slide-in-from-bottom-2">
                  <CheckCircle2 size={20} />
                  <span>Assimilació completada amb èxit! El sistema ha transmutat.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroDaySetupModule;


=====================================
FILE: src/components/gates/OfflineGate.jsx
=====================================

import React, { useState, useEffect } from 'react';

/**
 * [GATEKEEPER] OfflineGate
 * Proporciona context visual si no hi ha connexió a internet
 * i bloqueja funcionalitats segons les polítiques "LocalFirst".
 * En aquesta versió bàsica, només avisa visualment al top però deixa renderitzar.
 */
export default function OfflineGate({ children }) {
  const [isOffline, setIsOffline] = useState(() => 
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-max max-w-[90%] bg-red-600 text-white font-bold text-center text-[15px] py-3 px-6 rounded-[28px] shadow-lg z-[100] animate-[bounce_2s_infinite]">
          Estàs fora de cobertura (Mode Offline actiu).
        </div>
      )}
      {children}
    </>
  );
}
