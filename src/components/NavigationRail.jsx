import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, MapPin, MessageSquare, Plus, Store, Calendar, Map, BookOpen, FileText } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigation } from "../context/NavigationContext";

const menuItems = [
  { path: "/chats", key: "nav.chats", fallback: "Xat", icon: MessageSquare },
  { path: "/mur", key: "nav.feed", fallback: "Mur", icon: LayoutGrid },
  { path: "/mercat", key: "nav.market", fallback: "Mercat", icon: Store },
  { path: "/pobles", key: "nav.towns", fallback: "Pobles", icon: MapPin },
  { path: "/calendari", key: "nav.events", fallback: "Events", icon: Calendar },
  { path: "/mapa", key: "nav.map", fallback: "Mapa", icon: Map },
  { path: "/el-projecte", key: "nav.project", fallback: "El Projecte", icon: BookOpen },
  { path: "/notes", key: "nav.notes", fallback: "Bloc de Notes", icon: FileText },
];

const NavigationRail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { closeDrawer } = useNavigation();

  const handleNavigate = () => {
    if (window.matchMedia("(max-width: 767px)").matches) closeDrawer();
  };

  return (
    <nav className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      {/* CONNECTAR BOTÓ - ATOMIC SQUARE COHESION */}
      <button
        className="w-full h-[48px] shrink-0 bg-[var(--sdp-blue)] text-white flex items-center justify-center space-x-2 transition-colors hover:brightness-110 focus:outline-none"
        onClick={() => navigate("/hub")}
      >
        <Plus size={20} strokeWidth={3} />
        <span className="uppercase font-bold tracking-widest">{t("common.add", "Connectar")}</span>
      </button>

      <div className="flex-1 mt-6 px-3 overflow-y-auto stable-scroll custom-scrollbar flex flex-col">
          <ul className="space-y-2 relative">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="rail-active-bg"
                      className="absolute inset-0 bg-[#F97316]/10 rounded-tactile"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <NavLink
                    to={item.path}
                    onClick={handleNavigate}
                    className={`relative flex h-[48px] w-full items-center gap-4 rounded-tactile px-4 font-semibold transition-colors duration-200 outline-none ${
                        isActive
                          ? "text-[#F97316]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={22} className={isActive ? "drop-shadow-md" : ""} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="truncate tracking-wide">{t(item.key, item.fallback)}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
    </nav>
  );
};

export default NavigationRail;
