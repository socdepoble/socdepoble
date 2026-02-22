import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  Copyright,
} from "lucide-react";
import AuditRoleSwitcher from "./AuditRoleSwitcher";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

const NavigationRail = () => {
  const { t } = useTranslation();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const {
    setIsCreateModalOpen,
    closeDrawer,
    setIsGuestInteractionModalOpen,
  } = useUI();
  const { user, isAdmin } = useAuth();

  const menuGroups = [
    {
      id: "base",
      title: "PILARS DEL MAS",
      icon: <LayoutGrid className="w-5 h-5" />,
      items: [
        { path: "/chats", label: t('nav.chats'), icon: <MessageSquare /> },
        { path: "/mur", label: t('nav.feed'), icon: <LayoutGrid /> },
        { path: "/mercat", label: t('nav.market'), icon: <Store /> },
        { path: "/pobles", label: t('nav.towns'), icon: <MapPin /> },
        { path: "/notes", label: t('notebook.title'), icon: <Notebook />, thinner: true },
        { path: "/financament", label: 'Finançament', icon: <CreditCard />, thinner: true },
      ],
    },
    {
      id: "sistema_operatiu",
      title: "SISTEMA OPERATIU",
      path: "/hub",
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
    <aside className="w-full h-full flex-shrink-0 flex flex-col bg-theme-sidebar backdrop-blur-3xl border-r border-white/5 z-20 overflow-hidden">
      <div className="h-16 min-h-[64px] flex items-center justify-between px-6 bg-theme-header shrink-0 border-b border-white/5 md:hidden">
        <NavLink to="/" onClick={handleNavClick}>
          <img
            src={document.documentElement.classList.contains('light') ? "/assets/master/logo_socdepoble_black_sketch.png" : "/assets/master/logo_socdepoble_white_full.png"}
            alt="Sóc de Poble"
            className="h-8 w-auto object-contain brightness-110"
          />
        </NavLink>
        <button
          onClick={closeDrawer}
          className="md:hidden ml-auto w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="px-5 py-6 flex flex-col gap-3 shrink-0">
        <button
          onClick={() => {
            if (user?.isAnonymous) {
              setIsGuestInteractionModalOpen(true);
            } else {
              setIsCreateModalOpen(true);
            }
            handleNavClick();
          }}
          className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338ca] text-white genesis-radius font-black flex items-center justify-start px-4 gap-4 shadow-lg transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="flex items-center justify-center bg-white/10 w-10 h-10 rounded-xl group-hover:bg-white/20 transition-colors shrink-0">
            <Plus size={24} strokeWidth={3} />
          </div>
          <span className="tracking-widest text-[14px] uppercase whitespace-nowrap">
            {t('common.add_town') || 'AFEGIR'}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar pb-10 mt-2 bg-transparent">
        {menuGroups.map((group, index) => (
          <div key={group.id} className="space-y-3">
            {index === 0 ? (
              /* PILARS DEL MAS: SEMPRE VISIBLES */
              <div className="space-y-4">
                {/* EL QUARTET SAGRAT (RESSALTAT CANÒNIC) */}
                <div className="bg-orange-500/[0.03] border border-[#FF6B00]/40 rounded-[32px] p-2.5 space-y-1 shadow-[inset_0_0_30px_rgba(255,107,0,0.08)] relative overflow-hidden group/quartet">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                  {group.items.slice(0, 4).map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) => `
                        w-full flex items-center space-x-4 px-3 h-14 genesis-radius transition-all relative overflow-hidden
                        ${
                          isActive
                            ? "bg-[#FF6B00] text-white shadow-[0_0_25px_rgba(255,107,0,0.4)] scale-[1.02] z-10"
                            : "text-gray-300 hover:bg-[#FF6B00]/10 hover:text-white"
                        }
                        font-black
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-white rounded-r-full shadow-[0_0_15px_white]" />
                          )}
                          <div className={`w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? 'text-white' : 'text-[#FF6B00] group-hover/quartet:scale-110'}`}>
                            {React.cloneElement(item.icon, {
                              size: 24,
                              strokeWidth: isActive ? 3 : 2,
                            })}
                          </div>
                          <span className={`text-[20px] leading-none mb-0.5 whitespace-nowrap transition-colors ${isActive ? 'text-white' : 'text-gray-100'}`}>
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>

                {/* ALTRES PILARS (NOTEBOOK, ETC) */}
                <div className="px-1.5 space-y-1">
                  {group.items.slice(4).filter(item => {
                    if (item.path === '/solatge') return isAdmin;
                    return true;
                  }).map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) => `
                        w-full flex items-center space-x-4 px-3 h-14 genesis-radius transition-all relative overflow-hidden
                        ${
                          isActive
                            ? "bg-theme-accent text-white shadow-xl scale-[1.01]"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }
                        ${item.thinner ? "font-medium" : "font-black"}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-white rounded-r-full shadow-[0_0_15px_white]" />
                          )}
                          <div className="w-10 h-10 flex items-center justify-center shrink-0">
                            {React.cloneElement(item.icon, {
                              size: 20,
                              strokeWidth: isActive ? (item.thinner ? 2 : 3) : (item.thinner ? 1.5 : 2.5),
                            })}
                          </div>
                          <span className={`text-[17px] leading-none mb-0.5 whitespace-nowrap ${item.thinner ? 'uppercase tracking-tighter text-[12px] opacity-70' : ''}`}>
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
                  w-full flex items-center justify-between px-2 h-14 genesis-radius transition-all border border-white/5 shadow-xl
                  ${isActive 
                    ? "bg-[#0ea5e9] text-white" 
                    : "bg-white/[0.03] text-gray-300 hover:bg-white/10 hover:text-white"}
                `}
              >
                <div className="flex items-center gap-4 pl-2">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-inner bg-white/5`}>
                    {group.icon}
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-widest transition-colors">
                    {group.title}
                  </h3>
                </div>
                <div className="pr-4 opacity-50">
                   <ChevronRight size={18} strokeWidth={3} />
                </div>
              </NavLink>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-white/10 bg-transparent shrink-0 flex flex-col gap-3">
        {isInfoOpen && (
          <div className="bg-white/[0.08] border-2 border-white/30 rounded-[40px] p-8 space-y-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="leading-tight text-white font-black uppercase tracking-tighter text-center space-y-6">
              <span className="flex items-center justify-center gap-3 text-2xl md:text-3xl mb-4">
                <Copyright size={32} className="text-primary" strokeWidth={4} />
                2026 SÓC DE POBLE
              </span>
              
              <NavLink to="/perfil/el-rentonar" onClick={handleNavClick} className="block p-6 rounded-[32px] bg-white/5 border-2 border-white/15 hover:bg-white/15 hover:border-primary transition-all group active:scale-95">
                <span className="block text-xl md:text-2xl mb-1 group-hover:text-primary transition-colors italic">Associació El Rentonar</span>
                <span className="block text-[14px] opacity-60 font-medium tracking-[0.3em]">CIF G-03967668</span>
              </NavLink>
              
              <div className="pt-4 border-t border-white/5">
                <span className="block text-[12px] opacity-40 mb-2 tracking-[0.4em]">DIRECCIÓ I COORDINACIÓ</span>
                <NavLink to="/perfil/d6325f44-7277-4d20-b020-166c010995ab" onClick={handleNavClick} className="block text-2xl md:text-3xl text-primary hover:text-white transition-all italic font-black hover:scale-105">
                  Javi Llinares
                </NavLink>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10 text-center">
              <div className="flex justify-center gap-6 text-[11px] font-black tracking-widest opacity-60">
                <NavLink to="/legal" onClick={handleNavClick} className="hover:text-white hover:opacity-100 transition-all">AVÍS LEGAL</NavLink>
                <NavLink to="/legal#cookies" onClick={handleNavClick} className="hover:text-white hover:opacity-100 transition-all">COOKIES</NavLink>
              </div>
              <a 
                href="https://socdepoble.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black text-primary opacity-60 hover:opacity-100 transition-opacity"
              >
                WWW.SOCDEPOBLE.ORG
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] text-center opacity-40 font-black uppercase tracking-[0.3em] text-white">
            v10.33.6-CANÒNIC
          </div>
          
          <button 
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="flex items-center gap-4 px-8 py-4 rounded-full bg-white/15 border-2 border-white/30 text-[18px] font-black uppercase tracking-[0.3em] text-white hover:bg-primary hover:border-white transition-all shadow-2xl active:scale-90"
          >
            <span>Info legal</span>
            <ChevronRight size={24} className={`transition-transform duration-300 ${isInfoOpen ? 'rotate-90' : ''}`} strokeWidth={4} />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </aside>
  );
};

export default NavigationRail;
