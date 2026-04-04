import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, MapPin, MessageSquare, Plus, Store, Calendar, Map, BookOpen, FileText, Activity } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { APP_VERSION } from "../constants";

const menuItems = [
  { path: "/chats", key: "nav.chats", fallback: "Xat", icon: MessageSquare },
  { path: "/mur", key: "nav.feed", fallback: "Mur", icon: LayoutGrid },
  { path: "/mercat", key: "nav.market", fallback: "Mercat", icon: Store },
  { path: "/pobles", key: "nav.towns", fallback: "Pobles", icon: MapPin },
  { path: "/calendari", key: "nav.events", fallback: "Calendari", icon: Calendar },
  { path: "/mapa", key: "nav.map", fallback: "Mapa", icon: Map },
  { path: "/el-projecte", key: "nav.project", fallback: "El Projecte", icon: BookOpen },
  { path: "/notes", key: "nav.notes", fallback: "Bloc de Notes", icon: FileText },
];

const NavigationRail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { closeDrawer } = useNavigation();
  const { isSuperAdmin } = useAuth();

  const handleNavigate = () => {
    if (window.matchMedia("(max-width: 767px)").matches) closeDrawer();
  };

  return (
    <nav className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      
      {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP - PROTOCOL HUB) - FIT 48PX */}
      <div className="h-[48px] min-h-[48px] max-h-[48px] shrink-0 border-b border-[#ffffff14] relative z-20 bg-[#544CF6] overflow-hidden -ml-px w-[calc(100%+1px)]">
        <button
          className="absolute inset-0 w-full h-full text-white flex items-center justify-center space-x-2 transition-colors hover:brightness-110 outline-none"
          onClick={() => navigate("/hub")}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="uppercase font-bold tracking-[0.2em]">{t("common.add", "Connectar")}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto stable-scroll custom-scrollbar flex flex-col pt-4 px-3 pb-6">

        <ul className="space-y-2 relative">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="rail-active-bg"
                      className="absolute inset-0 bg-[var(--theme-accent-primary)] opacity-10 rounded-tactile"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <NavLink
                    to={item.path}
                    onClick={handleNavigate}
                    className={`relative flex h-[48px] w-full items-center gap-4 rounded-tactile px-4 font-semibold transition-colors duration-200 outline-none ${
                        isActive
                          ? "text-[var(--theme-accent-primary)]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={22} className={isActive ? "drop-shadow-md" : ""} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="truncate tracking-wide">{t(item.key, item.fallback)}</span>
                  </NavLink>
                </li>
              );
            })}
            
            {/* PROTECTED SANDBOX VISIBILITY FOR ADMINS */}
            {isSuperAdmin && (
              <li key="/iaia-sandbox" className="relative mt-2 pt-2 border-t border-[#ffffff14]">
                {location.pathname.startsWith("/iaia-sandbox") && (
                  <motion.div
                    layoutId="rail-active-bg"
                    className="absolute inset-0 bg-red-500/10 rounded-tactile"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <NavLink
                  to="/iaia-sandbox"
                  onClick={handleNavigate}
                  className={`relative flex h-[48px] w-full items-center gap-4 rounded-tactile px-4 font-semibold transition-colors duration-200 outline-none ${
                      location.pathname.startsWith("/iaia-sandbox")
                        ? "text-red-500"
                        : "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                  }`}
                >
                  <Activity size={22} className={location.pathname.startsWith("/iaia-sandbox") ? "drop-shadow-md" : ""} strokeWidth={location.pathname.startsWith("/iaia-sandbox") ? 2.5 : 2} />
                  <span className="truncate tracking-wide">Laboratori IAIA</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        
      <div className="p-4 mt-auto border-t border-[#ffffff14] bg-transparent shrink-0 space-y-3 relative z-20">
        <div className="mt-2 text-[10px] text-center opacity-50 hover:opacity-100 transition-opacity font-black uppercase tracking-[0.2em] text-white">
          {APP_VERSION}
        </div>
      </div>
    </nav>
  );
};

export default NavigationRail;
