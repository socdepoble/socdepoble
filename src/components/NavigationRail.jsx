import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../config/nav';

const NavigationRail = () => {
  return (
    // A mòbil és una Bottom Bar horitzontal a baix (order-last).
    // A tauleta/PC és una barra lateral (order-first).
    // pb-safe protegeix contra la barra d'iOS.
    <nav className="w-full md:w-20 lg:w-64 bg-black text-white shrink-0 flex flex-row md:flex-col border-t md:border-t-0 md:border-r border-orange-500/20 z-30 pb-[env(safe-area-inset-bottom)] md:pb-0 transition-all duration-300 order-last md:order-first">
      
      {/* Identitat visual (oculta al mòbil per respectar l'espai de lectura vital) */}
      <div className="hidden md:flex p-4 lg:p-6 items-center justify-center lg:justify-start border-b border-white/10 shrink-0 min-h-[64px]">
        <span className="font-black text-2xl text-orange-500 tracking-tighter truncate">
          <span className="lg:hidden">SP</span>
          <span className="hidden lg:inline uppercase">Sóc de Poble</span>
        </span>
      </div>

      <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start px-1 py-2 md:p-3 gap-1 md:gap-2 overflow-x-auto md:overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({isActive}) => `
              group flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 
              px-2 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 w-full md:w-auto
              min-h-[48px]
              ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/60 hover:bg-white/10 hover:text-white'}
            `}
            aria-label={item.label}
          >
            <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform block" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-[10px] md:text-xs lg:text-sm font-bold tracking-wide uppercase lg:normal-case truncate block md:hidden lg:block mt-1 md:mt-0">
              {item.labelCurt || item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavigationRail;