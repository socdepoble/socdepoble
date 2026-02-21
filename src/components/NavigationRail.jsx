import React from "react";
import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  LayoutGrid,
  Store,
  MapPin,
  User,
  Database,
  Calendar,
  Image as ImageIcon,
  LogOut,
  Plus,
  Map as MapIcon,
  Bell,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Terminal,
  Wrench,
  Cpu,
} from "lucide-react";
import { useState } from "react";
import AuditRoleSwitcher from "./AuditRoleSwitcher";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

const menuGroups = [
  {
    id: "base",
    title: "PILARS DEL MAS",
    icon: <LayoutGrid className="w-5 h-5" />,
    items: [
      { path: "/chats", label: "Xat", icon: <MessageSquare /> },
      { path: "/mur", label: "Mur", icon: <LayoutGrid /> },
      { path: "/mercat", label: "Mercat", icon: <Store /> },
      { path: "/pobles", label: "Pobles", icon: <MapPin /> },
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

const NavigationRail = () => {
  const {
    setIsCreateModalOpen,
    closeDrawer,
    setIsGuestInteractionModalOpen,
  } = useUI();
  const { user, isAdmin } = useAuth();

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      closeDrawer();
    }
  };

  return (
    <aside className="w-[280px] h-full flex-shrink-0 flex flex-col bg-theme-sidebar backdrop-blur-3xl border-r border-white/5 z-20 overflow-hidden">
      <div className="h-16 min-h-[64px] flex items-center justify-between px-6 bg-theme-header shrink-0 border-b border-white/5 lg:hidden">
        <div className="flex items-center px-6 py-4 shrink-0">
        <NavLink to="/" onClick={handleNavClick}>
          <img
            src={document.documentElement.classList.contains('light') ? "/assets/master/logo_socdepoble_black_sketch.png" : "/assets/master/logo_socdepoble_white_full.png"}
            alt="Sóc de Poble"
            className="h-8 w-auto object-contain brightness-110"
          />
        </NavLink>
        <button
          onClick={closeDrawer}
          className="lg:hidden ml-auto w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      </div>

      <div className="p-5 flex flex-col gap-3 shrink-0">
        <button
          onClick={() => {
            if (user?.isAnonymous) {
              setIsGuestInteractionModalOpen(true);
            } else {
              setIsCreateModalOpen(true);
            }
            handleNavClick();
          }}
          className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338ca] text-white genesis-radius font-black flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="flex items-center justify-center bg-white/10 w-10 h-10 rounded-xl group-hover:bg-white/20 transition-colors">
            <Plus size={24} strokeWidth={3} />
          </div>
          <span className="tracking-widest text-[14px] uppercase mr-2">
            AFEGIR
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-6 custom-scrollbar pb-10 mt-2 bg-transparent">
        {menuGroups.map((group, index) => (
          <div key={group.id} className="space-y-2">
            {index === 0 ? (
              /* PILARS DEL MAS: SEMPRE VISIBLES */
              <div className="space-y-1.5 px-1">
                {group.items.filter(item => {
                  if (item.path === '/solatge') return isAdmin;
                  return true;
                }).map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) => `
                      w-full flex items-center space-x-4 px-3 h-14 genesis-radius transition-all font-black relative overflow-hidden
                      ${
                        isActive
                          ? "bg-[#FF6B00] text-white shadow-xl scale-[1.01]"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
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
                            strokeWidth: isActive ? 3 : 2.5,
                          })}
                        </div>
                        <span className="text-[18px] leading-none mb-0.5 whitespace-nowrap">
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
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

      <div className="p-4 mt-auto border-t border-white/10 bg-transparent shrink-0 space-y-3">

        <div className="mt-2 text-[8px] text-center opacity-30 font-black uppercase tracking-[0.3em] text-white">
          v10.26.1-CANÒNIC
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
