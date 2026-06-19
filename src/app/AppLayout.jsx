import React, { memo } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const getNavClass = ({ isActive }) =>
  `w-full flex items-center gap-4 px-3 py-3 rounded-xl font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70 hover:text-white'
  }`;

const getSubNavClass = ({ isActive }) =>
  `w-full flex items-center gap-4 px-3 py-3 rounded-xl font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70 hover:text-white'
  }`;

function AppLayout() {

  return (
    <div className="bg-[#f3f4f6] min-h-screen min-h-[100dvh] w-full flex font-sans text-gray-900">
      <aside className="hidden md:flex flex-col w-[240px] lg:w-[280px] bg-[#050505] text-white shrink-0 h-screen h-[100dvh] overflow-y-auto border-r border-white/10 z-50" style={{ overscrollBehavior: 'contain', scrollBehavior: 'auto' }}>
        <div className="h-[64px] flex items-center px-6 shrink-0" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <NavLink to="/" className="block" aria-label="Inici Sóc de Poble">
            <img alt="Sóc de Poble" className="h-8 sm:h-10 object-contain" src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" width="180" height="42" />
          </NavLink>
        </div>
        <button type="button" className="min-h-[56px] w-full flex items-center px-6 gap-3 bg-[#0984E3] hover:bg-[#076aba] text-white font-bold tracking-widest uppercase shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
          <span className="text-2xl font-bold leading-none" aria-hidden="true">+</span>
          <span className="text-[17px]">CONNECTAR</span>
        </button>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <NavLink to="/xat" className={getNavClass}>
            <span className="text-xl" aria-hidden="true">💬</span> XAT
          </NavLink>
          <NavLink to="/mur" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🏠</span> MUR
          </NavLink>
          <NavLink to="/mercat" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🛒</span> MERCAT
          </NavLink>
          <NavLink to="/pobles" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">📍</span> POBLES
          </NavLink>
          <NavLink to="/events" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">📅</span> EVENTS
          </NavLink>
          <NavLink to="/mapa" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🗺️</span> MAPA
          </NavLink>
          <NavLink to="/multimedia" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🖼️</span> MULTIMÈDIA
          </NavLink>
          <NavLink to="/notes" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">📝</span> NOTES
          </NavLink>
          <NavLink to="/projecte" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">⚙️</span> EL PROJECTE
          </NavLink>
          <NavLink to="/constitucio" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">⚖️</span> CONSTITUCIÓ
          </NavLink>
          <NavLink to="/disseny" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🎨</span> DISSENY
          </NavLink>
          <NavLink to="/skills" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">📈</span> SKILLS
          </NavLink>
          <NavLink to="/ia" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🤖</span> L'ÀNIMA DE LA IAIA
          </NavLink>
          <NavLink to="/roadmap" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">🛣️</span> FULL DE RUTA
          </NavLink>
          <NavLink to="/legal" className={getSubNavClass}>
            <span className="text-xl" aria-hidden="true">⚖️</span> LEGAL I PRIVACITAT
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="shrink-0 w-full flex items-center justify-end px-4 lg:px-6 bg-[#000000] border-b border-white/10 z-40 shadow-sm" style={{ height: 'calc(56px + env(safe-area-inset-top, 0px))', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex items-center gap-1 sm:gap-2 text-white/70">
            <button type="button" aria-label="Web" className="w-10 h-10 flex items-center justify-center hover:text-white rounded-full">🌐</button>
            <button type="button" aria-label="Accessibilitat" className="w-10 h-10 flex items-center justify-center hover:text-white rounded-full">🧍</button>
            <button type="button" aria-label="Cercador" className="w-10 h-10 flex items-center justify-center hover:text-white rounded-full">🔍</button>
            <button type="button" aria-label="Tema fosc" className="w-10 h-10 flex items-center justify-center hover:text-white rounded-full">🌙</button>
            <button type="button" aria-label="Perfil" className="w-10 h-10 flex items-center justify-center hover:text-white rounded-full">👤</button>
            <button type="button" aria-label="Visor Nano (Diagnòstic)" className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] rounded-full">👁️</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#f3f4f6] md:bg-[#1a1a1a] pb-safe-bottom md:pb-0 relative" style={{ overscrollBehavior: 'contain' }}>
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505] border-t border-white/5 flex items-center justify-evenly px-2 shadow-sm" style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <NavLink to="/xat" className={({ isActive }) => `w-12 h-12 flex items-center justify-center transition-colors ${isActive ? 'text-[#0984E3]' : 'text-white/60 hover:text-white'}`} aria-label="Anar al Xat"><span className="text-2xl" aria-hidden="true">💬</span></NavLink>
        <NavLink to="/mur" className={({ isActive }) => `w-12 h-12 flex items-center justify-center transition-colors ${isActive ? 'text-[#0984E3]' : 'text-white/60 hover:text-white'}`} aria-label="Anar al Mur"><span className="text-2xl" aria-hidden="true">🏠</span></NavLink>
        <button type="button" className="w-[52px] h-[52px] bg-[#0984E3] text-white rounded-full flex items-center justify-center shadow-md shrink-0 -mt-6 border-[4px] border-[#f3f4f6]" aria-label="Nova publicació"><span className="text-3xl font-bold leading-none mt-[-2px]" aria-hidden="true">+</span></button>
        <NavLink to="/mercat" className={({ isActive }) => `w-12 h-12 flex items-center justify-center transition-colors ${isActive ? 'text-[#0984E3]' : 'text-white/60 hover:text-white'}`} aria-label="Anar al Mercat"><span className="text-2xl" aria-hidden="true">🛒</span></NavLink>
        <NavLink to="/pobles" className={({ isActive }) => `w-12 h-12 flex items-center justify-center transition-colors ${isActive ? 'text-[#0984E3]' : 'text-white/60 hover:text-white'}`} aria-label="Anar a Pobles"><span className="text-2xl" aria-hidden="true">📍</span></NavLink>
      </nav>
    </div>
  );
}
export default AppLayout;
