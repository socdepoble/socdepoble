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
  Scale,
} from "lucide-react";
import AuditRoleSwitcher from "./AuditRoleSwitcher";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import IAIAIcon from "./icons/IAIAIcon";

const NavigationRail = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { closeDrawer, setIsCreateModalOpen, isInfoOpen, toggleInfo } = useUI();

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
    <div className="w-full h-full flex-shrink-0 flex flex-col bg-theme-sidebar backdrop-blur-3xl z-20 overflow-hidden">
      {/* 0. ESPAI DE SEGURETAT SUPERIOR (SENSE LOGO DUPLICAT) */}
      <div className="h-6 shrink-0 md:hidden" />

      {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP - PROTOCOL HUB) */}
      <div className="px-4 pb-4 shrink-0">
        <button
          onClick={() => {
            if (user?.isAnonymous) {
              navigate(
                "/registre?returnTo=" +
                  encodeURIComponent(window.location.pathname),
              );
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
          <span className="tracking-[0.2em] text-[16px] uppercase whitespace-nowrap">
            {t("common.add") || "AFEGIR"}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar bg-transparent">
        <div className="space-y-6 pb-12">
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
                          w-full flex items-center space-x-4 px-3 h-12 genesis-radius transition-all relative overflow-hidden
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
                            <div
                              className={`w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isActive
                                  ? "text-white"
                                  : "text-[#FF6B00] group-hover/quartet:scale-110"
                              }`}
                            >
                              {React.cloneElement(item.icon, {
                                size: 24,
                                strokeWidth: isActive ? 3 : 2,
                              })}
                            </div>
                            <span
                              className={`text-[22px] leading-none mb-0.5 whitespace-nowrap transition-colors ${
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

                  {/* ALTRES PILARS (NOTEBOOK, ETC) */}
                  <div className="px-1.5 space-y-1">
                    {group.items
                      .slice(4)
                      .filter((item) => {
                        if (item.path === "/solatge") return isAdmin;
                        return true;
                      })
                      .map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={handleNavClick}
                          className={({ isActive }) => `
                          w-full flex items-center space-x-4 px-3 h-12 genesis-radius transition-all relative overflow-hidden
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
                                  strokeWidth: isActive
                                    ? item.thinner
                                      ? 2
                                      : 3
                                    : item.thinner
                                    ? 1.5
                                    : 2.5,
                                })}
                              </div>
                              <span
                                className={`text-[19px] leading-none mb-0.5 whitespace-nowrap ${
                                  item.thinner
                                    ? "uppercase tracking-tighter text-[15px] opacity-70"
                                    : ""
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
                    w-full flex items-center justify-between px-2 h-16 genesis-radius transition-all border border-white/5 shadow-xl
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-white/[0.03] text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 pl-2">
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shadow-inner bg-white/5`}
                    >
                      {group.icon}
                    </div>
                    <h3 className="text-[18px] font-black uppercase tracking-tight leading-[0.95] transition-colors text-left pt-1.5">
                      SISTEMA<br />OPERATIU
                    </h3>
                  </div>
                  <div className="pr-4 opacity-50">
                    <ChevronRight size={20} strokeWidth={3} />
                  </div>
                </NavLink>
              )}
            </div>
          ))}

          {/* ACCIONS DE MANTENIMENT (REPOSICIONADES) */}
          <div className="space-y-3 pt-4 border-t border-white/5 relative">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleInfo();
                }}
                className={`w-full flex items-center justify-center px-4 h-12 rounded-full border-2 text-[16px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${
                  isInfoOpen
                    ? "bg-secondary border-white text-white"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span>Info legal</span>
              </button>

              {/* INFO LEGAL: PANELL FLOTANT BLINDAT (DESPLEGAT CAP AVALL - AMB SCROLL) */}
              {isInfoOpen && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-[#080808]/95 backdrop-blur-3xl border-2 border-white/15 rounded-[28px] p-6 space-y-4 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[2000] w-full max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="leading-tight text-white font-black uppercase tracking-tighter text-center space-y-4">
                    <span className="flex items-center justify-center gap-2 text-lg mb-1">
                      <Scale size={20} className="text-secondary" strokeWidth={4} />
                      2026 SÓC DE POBLE
                    </span>

                    <NavLink
                      to="/perfil/sdp-oficial-1"
                      onClick={handleNavClick}
                      className="block p-4 rounded-[16px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                    >
                      <span className="block text-base mb-1 group-hover:text-secondary transition-colors italic">
                        Plataforma Sóc de Poble
                      </span>
                      <span className="block text-[10px] opacity-50 font-medium tracking-[0.2em]">
                        El Sistema Operatiu Rural
                      </span>
                    </NavLink>

                    <NavLink
                      to="/perfil/el-rentonar"
                      onClick={handleNavClick}
                      className="block p-4 rounded-[16px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                    >
                      <span className="block text-base mb-1 group-hover:text-secondary transition-colors italic">
                        Associació El Rentonar
                      </span>
                      <span className="block text-[10px] opacity-50 font-medium tracking-[0.2em]">
                        CIF G-03967668
                      </span>
                    </NavLink>

                    <div className="pt-2 border-t border-white/5">
                      <span className="block text-[10px] opacity-40 mb-1 tracking-[0.2em]">
                        DIRECCIÓ I COORDINACIÓ
                      </span>
                      <NavLink
                        to="/perfil/d6325f44-7277-4d20-b020-166c010995ab"
                        onClick={handleNavClick}
                        className="block text-lg text-secondary hover:text-white transition-all italic font-black"
                      >
                        Javi Llinares
                      </NavLink>
                    </div>
                    
                    <div className="pt-2 border-t border-white/5 text-[11px] opacity-40 font-black tracking-widest">
                      v10.33.15-CANÒNIC
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-center">
                    <div className="flex justify-center gap-4 text-[11px] font-black tracking-widest opacity-50">
                      <NavLink to="/legal" onClick={handleNavClick} className="hover:text-white transition-all uppercase">AVÍS LEGAL</NavLink>
                      <NavLink to="/legal#cookies" onClick={handleNavClick} className="hover:text-white transition-all uppercase">COOKIES</NavLink>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default NavigationRail;
