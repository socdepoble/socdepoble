import React from 'react';
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
  ChevronRight
} from "lucide-react";
import { useState } from 'react';
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

const menuGroups = [
  {
    id: "base",
    title: "PILARS DEL MAS",
    icon: "🏠",
    items: [
      { path: "/chats", label: "Xat", icon: "💬" },
      { path: "/mur", label: "Mur", icon: "🖼️" },
      { path: "/mercat", label: "Mercat", icon: "🏬" },
      { path: "/pobles", label: "Pobles", icon: "📍" },
    ],
  },
  {
    id: "recursos",
    title: "RECURSOS",
    icon: "🏺",
    items: [
      { path: "/arxiu", label: "Relíquies", icon: "📜" },
      { path: "/mapa", label: "Mapa", icon: "🗺️" },
      { path: "/calendari", label: "Agenda", icon: "📅" },
      { path: "/infoteca", label: "Infoteca", icon: "📊" },
    ],
  },
  {
    id: "identitat",
    title: "IDENTITAT",
    icon: "👤",
    items: [
      { path: "/perfil", label: "Perfil", icon: "🆔" },
      { path: "/notes", label: "Notes", icon: "📝" },
      { path: "/solatge", label: "Solatge", icon: "💾" },
    ],
  },
];

const NavigationRail = () => {
  const {
    setIsCreateModalOpen,
    closeDrawer,
    forensicMode,
    toggleForensicMode,
    blueprintMode,
    toggleBlueprintMode,
    setIsGuestInteractionModalOpen,
    isAccessibilitatOpen,
    setIsAccessibilitatOpen
  } = useUI();
  const { user } = useAuth();
  const [expandedFolders, setExpandedFolders] = useState(['base', 'recursos', 'identitat']);

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      closeDrawer();
    }
  };

  return (
    <aside className="w-[280px] h-full flex-shrink-0 flex flex-col bg-black border-r border-white/5 z-20 overflow-hidden">
      <div className="h-16 min-h-[64px] flex items-center justify-between px-6 bg-black shrink-0 border-b border-white/5 lg:hidden">
        <button
          onClick={closeDrawer}
          className="text-white w-12 h-12 flex items-center justify-center"
        >
          <X size={24} />
        </button>
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
          className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="flex items-center justify-center bg-white/10 w-10 h-10 rounded-xl group-hover:bg-white/20 transition-colors">
            <span className="text-xl">➕</span>
          </div>
          <span className="tracking-widest text-[14px] uppercase mr-2">AFEGIR</span>
          <span className="text-sm opacity-50">🏺</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-6 custom-scrollbar pb-10 mt-2 bg-black">
        {menuGroups.map((group) => (
          <div key={group.id} className="space-y-2">
            <div
              onClick={() => toggleFolder(group.id)}
              className="w-full px-2 flex items-center justify-between group/header mb-1 cursor-pointer h-14 rounded-2xl transition-all hover:bg-white/10 bg-white/[0.03] border border-white/5 shadow-xl"
            >
              <div className="flex items-center gap-4 pl-2">
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 group-hover/header:bg-white/10 group-hover/header:text-white transition-all shadow-inner">
                  <span className="text-2xl">{group.icon}</span>
                </div>
                <h3 className="text-[13px] font-black text-gray-300 group-hover/header:text-white uppercase tracking-widest transition-colors">
                  {group.title}
                </h3>
              </div>
              <div className="flex items-center pr-2">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${expandedFolders.includes(group.id) ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                  <ChevronDown size={18} strokeWidth={3} className={`transition-transform duration-300 ${expandedFolders.includes(group.id) ? 'rotate-180' : 'rotate-0'}`} />
                </div>
              </div>
            </div>

            {expandedFolders.includes(group.id) && (
              <div className="space-y-1.5 bg-black/40 p-1.5 rounded-3xl border border-white/5 shadow-2xl">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) => `
                      w-full flex items-center space-x-4 px-3 h-14 rounded-xl transition-all font-black relative overflow-hidden
                      ${isActive 
                        ? "bg-[#FF6B00] text-white shadow-xl scale-[1.01]" 
                        : "text-gray-300 hover:bg-white/10 hover:text-white"}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-white rounded-r-full shadow-[0_0_15px_white]" />
                        )}
                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                            <span className="text-2xl">{item.icon}</span>
                        </div>
                        <span className="text-[18px] leading-none mb-0.5 whitespace-nowrap">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-white/10 bg-black shrink-0">
        <button
          onClick={() => setIsAccessibilitatOpen(!isAccessibilitatOpen)}
          className={`w-full mt-2 flex items-center space-x-4 px-4 h-auto min-h-[40px] py-2 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest text-left
                        ${
                          isAccessibilitatOpen
                            ? "bg-[#F97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                            : "bg-orange-900/20 text-orange-500 border border-orange-500/30"
                        }`}
        >
          <span className="text-lg shrink-0">🖐️</span>
          <span>ACCESSIBILITAT UNIVERSAL</span>
        </button>

        <button
          onClick={toggleForensicMode}
          className={`w-full mt-2 flex items-center space-x-4 px-4 h-auto min-h-[40px] py-2 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest text-left
                        ${
                          forensicMode
                            ? "bg-[#ff0000] text-white animate-pulse"
                            : "bg-red-900/20 text-red-500 border border-red-500/30"
                        }`}
        >
          <span className="text-lg shrink-0">🧬</span>
          <span>{forensicMode ? "FORENSE ACTIU" : "MODE FORENSE"}</span>
        </button>

        <button
          onClick={toggleBlueprintMode}
          className={`w-full mt-2 flex items-center space-x-4 px-4 h-auto min-h-[40px] py-2 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest text-left
                        ${
                          blueprintMode
                            ? "bg-[#4F46E5] text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                            : "bg-indigo-900/20 text-indigo-400 border border-indigo-500/30"
                        }`}
        >
          <span className="text-lg shrink-0">📐</span>
          <span>{blueprintMode ? "PLÀNOL ACTIU" : "MODE PLÀNOL"}</span>
        </button>

        <div className="mt-4 text-[8px] text-center opacity-30 font-black uppercase tracking-[0.3em] text-white">
          v10.26.0-PURGA
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
