import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Copyright, ExternalLink } from 'lucide-react';

const GlobalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/5 py-3 px-6 shrink-0 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-400 transition-colors">
      
      {/* AUTORIA */}
      <div className="flex flex-col items-center md:items-start gap-1 mb-2 md:mb-0">
        <div className="flex items-center gap-2">
          <Copyright size={10} className="text-primary/50" />
          <span>{currentYear} SÓC DE POBLE</span>
          <span className="opacity-30">|</span>
          <span className="text-primary/70">Javi Llinares</span>
        </div>
        <NavLink to="/perfil/el-rentonar" className="text-[8px] opacity-40 font-bold tracking-normal uppercase hover:opacity-100 hover:text-primary transition-all">
          Associació Cultural El Rentonar · CIF G-03967668
        </NavLink>
      </div>

      {/* ENLLAÇOS LEGenericS */}
      <nav className="flex items-center gap-6">
        <NavLink 
          to="/legal" 
          className="hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Shield size={10} />
          AVÍS LEGAL
        </NavLink>
        
        <NavLink 
          to="/legal#cookies" 
          className="hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Shield size={10} />
          POLÍTICA DE COOKIES
        </NavLink>

        <a 
          href="https://socdepoble.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white flex items-center gap-1.5 transition-colors text-primary/80"
        >
          WEBSITE
          <ExternalLink size={10} />
        </a>
      </nav>

      {/* VERSION SHORTHAND */}
      <div className="hidden lg:block opacity-20 hover:opacity-100 transition-opacity">
        v10.33.3-CANÒNIC
      </div>
    </footer>
  );
};

export default GlobalFooter;
