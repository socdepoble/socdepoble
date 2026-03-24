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
} from "lucide-react";
import { useNavigation } from '../context/NavigationContext';

const NavigationRail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { closeDrawer } = useNavigation();

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
      path: "/ofici",
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
    <div className="w-full h-full flex-shrink-0 flex flex-col bg-theme-sidebar z-20 overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
        {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP FRAME) - EXACTAMENT h-12 COM EL CONTEXTUAL MENU */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.innerWidth < 768) {
              closeDrawer();
              setTimeout(() => navigate("/hub"), 150);
            } else {
              navigate("/hub");
            }
          }}
          className="w-full h-12 shrink-0 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-black flex items-center justify-start px-8 space-x-3 transition-colors active:bg-[#3730a3] group relative overflow-hidden rounded-none shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10"
        >
          <div className="flex items-center justify-center bg-white/10 w-8 h-8 rounded-[28px] group-hover:bg-white/20 transition-colors shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="tracking-[0.2em] text-[15px] uppercase whitespace-nowrap pt-0.5">
            {t("common.add") || "CONNECTAR"}
          </span>
        </button>

        <div className="px-4 pt-4 space-y-3 pb-[100px] md:pb-8 -mt-[1px] relative z-0">
          {menuGroups.map((group, index) => (
            <div key={group.id} className="space-y-3">
              {index === 0 ? (
                /* PILARS DEL MAS: SEMPRE VISIBLES */
                <div className="space-y-2">
                  {/* EL QUARTET SAGRAT (RESSALTAT CANÒNIC) */}
                  <div className="bg-orange-500/[0.03] rounded-[28px] p-2 space-y-0.5 shadow-[inset_0_0_30px_rgba(255,107,0,0.08)] relative overflow-hidden group/quartet">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent-primary)]/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                    {group.items.slice(0, 4).map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) => `
                          w-full flex items-center space-x-3 px-3 h-11 rounded-xl transition-all relative overflow-hidden
                          ${
                            isActive
                              ? "bg-[var(--theme-accent-primary)] text-white shadow-[0_0_25px_rgba(255,107,0,0.4)] scale-[1.02] z-10"
                              : "text-white opacity-90 hover:bg-[var(--theme-accent-primary)]/10 hover:text-white"
                          }
                          font-black
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#111827] text-white border border-white/10 rounded-r-full shadow-[0_0_15px_white]" />
                            )}
                            <div
                              className={`w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isActive
                                  ? "text-white"
                                  : "text-[var(--theme-accent-primary)] group-hover/quartet:scale-110"
                              }`}
                            >
                              {React.cloneElement(item.icon, {
                                size: 22,
                                strokeWidth: isActive ? 3 : 2,
                              })}
                            </div>
                            <span
                              className={`leading-none mb-0.5 whitespace-nowrap transition-colors text-[20px] ${
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

                  {/* ALTRES PILARS (SENSE BORDA/FONS RESALTAT) */}
                  <div className="space-y-0.5 mt-2">
                    {group.items.slice(4).map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) => `
                          w-full flex items-center space-x-3 px-3 h-9 rounded-[18px] transition-all relative overflow-hidden
                          ${
                            isActive
                              ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                              : "text-white opacity-70 hover:bg-white/5 hover:text-white hover:opacity-100"
                          }
                          font-medium
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--theme-accent-primary)] rounded-r-full shadow-[0_0_10px_var(--theme-accent-primary)]" />
                            )}
                            <div
                              className={`w-8 h-8 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isActive
                                  ? "text-[var(--theme-accent-primary)]"
                                  : "text-white/70 group-hover:scale-110"
                              }`}
                            >
                              {React.cloneElement(item.icon, {
                                size: 20,
                                strokeWidth: isActive ? 2.5 : 1.5,
                              })}
                            </div>
                            <span
                              className={`leading-none mb-0.5 whitespace-nowrap transition-colors uppercase tracking-tighter text-[15px] ${
                                isActive
                                  ? "text-white font-bold tracking-widest uppercase"
                                  : "text-gray-300"
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
                    w-full flex items-center justify-between px-2 h-14 rounded-[16px] transition-all border border-white/5 shadow-xl
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-white/[0.03] text-white opacity-90 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 pl-2">
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shadow-inner bg-white/10`}
                    >
                      {group.icon}
                    </div>
                    <h3 className="text-[16px] font-black uppercase tracking-tight leading-[0.95] transition-colors text-left pt-1">
                      {t("nav.system_op_part_1", "SISTEMA")}
                      <br />
                      {t("nav.system_op_part_2", "OPERATIU")}
                    </h3>
                  </div>
                  <div className="pr-4 opacity-50">
                    <ChevronRight size={20} strokeWidth={3} />
                  </div>
                </NavLink>
              )}
            </div>
          ))}

          {/* ACCIONS DE MANTENIMENT (ENLLAÇ DIRECTE A INFO LEGAL) */}
          <div className="space-y-2 pt-2 border-t border-white/5 relative">
            <NavLink
              to="/legal"
              onClick={handleNavClick}
              className={({ isActive }) => `
                w-full flex items-center justify-center px-4 h-10 rounded-[16px] border-2 text-[14px] font-black uppercase tracking-[0.2em] transition-all active:scale-95
                ${
                  isActive
                    ? "bg-secondary border-white text-white"
                    : "bg-white/10 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                }
              `}
            >
              <span>Info legal</span>
            </NavLink>
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
