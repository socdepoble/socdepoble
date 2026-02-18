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
    id: "identitat_recursos",
    title: (
      <div className="flex flex-col text-left leading-tight">
        <span>IDENTITAT</span>
        <span className="text-[10px] opacity-70">i RECURSOS</span>
      </div>
    ),
    icon: <User className="w-5 h-5" />,
    items: [
      { path: "/notes", label: "Bloc de Notes", icon: <Settings /> },
      { path: "/perfil", label: "Perfil", icon: <User /> },
      { path: "/arxiu", label: "Relíquies", icon: <Database /> },
      { path: "/mapa", label: "Mapa", icon: <MapIcon /> },
      { path: "/calendari", label: "Agenda", icon: <Calendar /> },
      { path: "/infoteca", label: "Infoteca", icon: <ImageIcon /> },
      { path: "/solatge", label: "Solatge", icon: <Database /> },
      { path: "/utilitats", label: "Utilitats", icon: <Wrench /> },
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
    setIsAccessibilitatOpen,
  } = useUI();
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();
  const [expandedFolders, setExpandedFolders] = useState([]); // Tancat per defecte per a màxima neteja
  const [isTechnicalMenuOpen, setIsTechnicalMenuOpen] = useState(false);

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId],
    );
  };

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
            src="/assets/master/logo_socdepoble_white.png"
            alt="Sóc de Poble"
            className="h-8 w-auto object-contain brightness-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/src/assets/logo.png";
            }}
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
          className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 group relative overflow-hidden"
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
                      w-full flex items-center space-x-4 px-3 h-14 rounded-xl transition-all font-black relative overflow-hidden
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
              <>
                <div
                  onClick={() => toggleFolder(group.id)}
                  className="w-full px-2 flex items-center justify-between group/header mb-1 cursor-pointer h-14 rounded-2xl transition-all hover:bg-white/10 bg-white/[0.03] border border-white/5 shadow-xl"
                >
                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 group-hover/header:bg-white/10 group-hover/header:text-white transition-all shadow-inner">
                      {group.icon}
                    </div>
                    <h3 className="text-[13px] font-black text-gray-300 group-hover/header:text-white uppercase tracking-widest transition-colors">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex items-center pr-2">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                        expandedFolders.includes(group.id)
                          ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                          : "bg-white/5 text-gray-500 hover:bg-white/10"
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        strokeWidth={3}
                        className={`transition-transform duration-300 ${
                          expandedFolders.includes(group.id)
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedFolders.includes(group.id) && (
                  <div className="space-y-1 bg-white/[0.02] p-1 rounded-[24px] border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) => `
                          w-full flex items-center px-3 h-12 rounded-full transition-all relative group/item
                          ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {/* M3 Active Indicator Pill */}
                            {isActive && (
                              <div className="absolute inset-x-2 inset-y-1 bg-secondary-container rounded-full -z-10 animate-in zoom-in-95 duration-200" />
                            )}
                            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                              {React.cloneElement(item.icon, {
                                size: 20,
                                strokeWidth: isActive ? 3 : 2.5,
                                className: isActive ? "text-secondary" : "text-gray-400 group-hover/item:text-white transition-colors"
                              })}
                            </div>
                            <span className={`text-[16px] font-medium leading-none mb-0.5 whitespace-nowrap tracking-wide transition-colors ${isActive ? "font-black" : ""}`}>
                              {item.label}
                            </span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-white/10 bg-transparent shrink-0 space-y-3">
        {/* CONSOLA TÈCNICA (SUBMENÚ AGRUPAT) */}
        <div className="space-y-2">
          <button
            onClick={() => setIsTechnicalMenuOpen(!isTechnicalMenuOpen)}
            className={`w-full flex items-center justify-between px-3 h-10 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest
              ${isTechnicalMenuOpen ? "bg-white/10 text-white" : "bg-white/5 text-gray-500 hover:text-white"}`}
          >
            <div className="flex items-center space-x-3">
              <Terminal size={14} className="shrink-0" />
              <span>CONSOLA TÈCNICA</span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${isTechnicalMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isTechnicalMenuOpen && (
            <div className="p-2 space-y-2 bg-black/40 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={() => setIsAccessibilitatOpen(!isAccessibilitatOpen)}
                className={`w-full flex items-center space-x-3 px-3 h-auto min-h-[36px] py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest text-left
                                    ${
                                      isAccessibilitatOpen
                                        ? "bg-[#F97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                        : "bg-orange-900/10 text-orange-500 border border-orange-500/20"
                                    }`}
              >
                <span className="text-base shrink-0">🖐️</span>
                <span>ACCESSIBILITAT</span>
              </button>

              <button
                onClick={toggleForensicMode}
                className={`w-full flex items-center space-x-3 px-3 h-auto min-h-[36px] py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest text-left
                                    ${
                                      forensicMode
                                        ? "bg-[#ff0000] text-white animate-pulse"
                                        : "bg-red-900/10 text-red-500 border border-red-500/20"
                                    }`}
              >
                <span className="text-base shrink-0">🧬</span>
                <span>{forensicMode ? "FORENSE" : "MODE FORENSE"}</span>
              </button>

              <button
                onClick={toggleBlueprintMode}
                className={`w-full flex items-center space-x-3 px-3 h-auto min-h-[36px] py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest text-left
                                    ${
                                      blueprintMode
                                        ? "bg-[#4F46E5] text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                        : "bg-indigo-900/10 text-indigo-400 border border-indigo-500/20"
                                    }`}
              >
                <span className="text-base shrink-0">📐</span>
                <span>{blueprintMode ? "PLÀNOL" : "MODE PLÀNOL"}</span>
              </button>

              <a
                href="https://www.figma.com/design/JXjlHfyx86wTkLPjLGkhf4/Sidebar-Concept--Community-"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 px-3 h-auto min-h-[36px] py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest text-left bg-blue-900/10 text-blue-400 border border-blue-500/20 hover:bg-blue-900/30"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <ExternalLink size={12} />
                </div>
                <span>DESIGN SYSTEM (FIGMA)</span>
              </a>

              {/* BOTÓ GESTIONAR MENÚ (NOMÉS SUPER ADMIN) */}
              <NavLink
                to="/gestio-menu"
                onClick={handleNavClick}
                className="w-full flex items-center space-x-3 px-3 h-auto min-h-[36px] py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest text-left bg-purple-900/10 text-purple-400 border border-purple-500/20 hover:bg-purple-900/30"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Settings size={12} />
                </div>
                <span>GESTIONAR MENÚ</span>
              </NavLink>

              {/* BOTÓ LOGOUT (SORTIR) - ARA DINS DE CONSOLA */}
              {user && (
                <button
                  onClick={signOut}
                  className="w-full flex items-center space-x-3 px-3 h-auto min-h-[36px] py-1.5 rounded-lg transition-all font-black text-[9px] uppercase tracking-widest text-left bg-red-900/10 text-red-500 border border-red-500/20 hover:bg-red-900/30"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <LogOut size={12} />
                  </div>
                  <span>TANCAR SESSIÓ</span>
                </button>
              )}

              {/* SWITCH DE GOVERNANÇA (NOMÉS SUPER ADMIN) */}
              {isSuperAdmin && <AuditRoleSwitcher />}
            </div>
          )}
        </div>

        <div className="mt-2 text-[8px] text-center opacity-30 font-black uppercase tracking-[0.3em] text-white">
          v10.26.0-CANÒNIC
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
