import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationRail from './components/NavigationRail';

const BrandBar = () => (
  <header className="bg-black/95 text-white text-center text-[10px] sm:text-xs font-bold tracking-[0.2em] py-2 shrink-0 border-b border-orange-500/20 uppercase select-none z-20">
    Sóc de Poble <span className="text-orange-500">— Mas Virtual</span>
  </header>
);

const AppShell = () => {
  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row bg-neutral-950 text-neutral-100 font-sans overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* BrandBar només visible ací en mòbils */}
      <div className="md:hidden flex flex-col shrink-0">
         <BrandBar />
      </div>

      <NavigationRail />
      
      <div className="flex flex-1 flex-col overflow-hidden relative z-0 order-first md:order-last">
        {/* BrandBar visible a dalt de la matriu en escriptori */}
        <div className="hidden md:block shrink-0">
           <BrandBar />
        </div>
        
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden bg-white text-black focus:outline-none relative z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] md:rounded-tl-2xl border-t md:border-t-0 md:border-l border-orange-500/20">
          <div className="mx-auto h-full p-0 sm:p-4 md:p-6 lg:p-8 w-full max-w-7xl relative">
            <Outlet />
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default AppShell;