// src/AppShell.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationRail from './components/NavigationRail';

const BrandBar = () => <div className="bg-orange-600 text-white p-2 text-center text-sm font-bold tracking-widest z-10">SÓC DE POBLE - MASIA VIRTUAL</div>;

const AppShell = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 relative overflow-hidden">
      <BrandBar />

      <div className="flex flex-1 overflow-hidden relative z-0">
        {/* NavigationRail lateral (esquerra) */}
        <NavigationRail />

        {/* Contingut principal */}
        <main 
          id="main-content"
          className="flex-1 overflow-auto bg-slate-50 pt-6 px-4 md:px-8 pb-20 focus:outline-none relative z-10 shadow-inner"
        >
          <div className="max-w-5xl mx-auto h-full">
            <Outlet />   {/* Aquí es renderitzen Mur, Mercat, Xat... */}
          </div>
        </main>

        {/* Panell lateral dret opcional (Xat ràpid o notificacions) */}
        <aside className="hidden xl:block w-80 border-l border-orange-500/20 bg-white/70 overflow-auto z-10">
          <div className="p-4 font-semibold text-slate-700">Panell d'Activitat</div>
        </aside>
      </div>

      {/* Orquestrador Caòtic (placeholder) */}
      <div id="orchestra" className="absolute inset-0 pointer-events-none z-50"></div>
    </div>
  );
};

export default AppShell;
