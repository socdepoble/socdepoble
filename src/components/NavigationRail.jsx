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
// RealmSwitcher retirat a panell d'administració (Funcionalitat en desenvolupament OMEGA-10)

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
      ],
    },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  };

  return (
    <nav className="w-[80px] md:w-[260px] xl:w-[280px] shrink-0 h-full flex flex-col bg-black z-30 transition-all duration-300 shadow-2xl overflow-hidden relative">
      {/* RealmSwitcher mogut a l'Admin Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
        {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP FRAME) - EXACTAMENT h-12 COM EL CONTEXTUAL MENU */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/hub");
          }}
          className="w-full h-12 shrink-0 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-black flex items-center justify-start px-8 space-x-3 transition-colors active:bg-[#3730a3] group relative overflow-hidden rounded-none z-10"
        >
          <div className="flex items-center justify-center bg-white/10 w-8 h-8 rounded-[28px] group-hover:bg-white/20 transition-colors shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="tracking-[0.2em] text-[15px] uppercase whitespace-nowrap pt-0.5">
            {t("common.add") || "CONNECTAR"}
          </span>
        </button>

        {/* 2. MENÚ PRINCIPAL (CONTEXTUAL TABS) */}
        <div className="px-4 pt-4 space-y-3 pb-[100px] md:pb-8 relative z-0">
          <div className="bg-orange-500/[0.03] rounded-[28px] p-2 space-y-0.5 shadow-[inset_0_0_30px_rgba(255,107,0,0.08)] relative overflow-hidden group/quartet">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent-primary)]/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
            {menuGroups[0].items.map((item) => (
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
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </nav>
  );
};

export default NavigationRail;
