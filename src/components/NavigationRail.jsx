import React, { useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, MapPin, MessageSquare, Plus, Store, Calendar, Map, BookOpen, FileText, Activity, Users, Image, Compass } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { APP_VERSION } from "../constants";

const menuItems = [
  { path: "/chats", key: "nav.chats", fallback: "Xat", icon: (p) => <MessageSquare {...p} /> },
  { path: "/mur", key: "nav.feed", fallback: "Mur", icon: (p) => <LayoutGrid {...p} /> },
  { path: "/mercat", key: "nav.market", fallback: "Mercat", icon: (p) => <Store {...p} /> },
  { path: "/pobles", key: "nav.towns", fallback: "Pobles", icon: (p) => <MapPin {...p} /> },
  { path: "/calendari", key: "nav.events", fallback: "Calendari", icon: (p) => <Calendar {...p} /> },
  { path: "/mapa", key: "nav.map", fallback: "Mapa", icon: (p) => <Map {...p} /> },
  { path: "/el-projecte", key: "nav.project", fallback: "El Projecte", icon: (p) => <BookOpen {...p} /> },
  { path: "/media", key: "nav.media", fallback: "Multimèdia", icon: (p) => <Image {...p} /> },
  { path: "/notes", key: "nav.notes", fallback: "Bloc de Notes", icon: (p) => <FileText {...p} /> },
  { path: "/ruta", key: "nav.roadmap", fallback: "Full de Ruta", icon: (p) => <Compass {...p} /> },
];

const NavigationRail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { closeDrawer } = useNavigation();
  const { isSuperAdmin } = useAuth();

  const handleNavigate = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) closeDrawer();
  }, [closeDrawer]);

  return (
    <nav className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      
      {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP - PROTOCOL HUB) - FIT 56PX */}
      <div className="h-[56px] min-h-[56px] max-h-[56px] shrink-0 border-b border-[#ffffff14] relative z-20 bg-[#4F46E5]">
        <button
          className="absolute inset-0 text-white flex items-center justify-start px-4 gap-4 transition-colors hover:brightness-110 outline-none w-full"
          onClick={() => navigate("/hub")}
        >
          <div className="flex items-center justify-center w-[22px] h-[22px] rounded shrink-0">
            <Plus size={22} strokeWidth={3} />
          </div>
          <span className="uppercase font-bold tracking-wide">{t("common.add", "Connectar")}</span>
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
                    <div className="absolute inset-0 bg-[#F97316] rounded-tactile transition-all duration-200" />
                  )}
                  <NavLink
                    to={item.path}
                    onClick={handleNavigate}
                    className={`relative flex h-[48px] w-full items-center justify-start text-left gap-4 rounded-tactile px-4 font-semibold transition-colors duration-200 outline-none ${
                        isActive
                          ? "text-black"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.icon({ size: 22, className: isActive ? "drop-shadow-md" : "", strokeWidth: isActive ? 2.5 : 2 })}
                    <span className="truncate">{t(item.key, item.fallback)}</span>
                  </NavLink>
                </li>
              );
            })}
            
            {/* PROTECTED SANDBOX VISIBILITY FOR ADMINS */}
            {isSuperAdmin && (
              <li key="/iaia-sandbox" className="relative mt-2 pt-2 border-t border-[#ffffff14]">
                {location.pathname.startsWith("/iaia-sandbox") && (
                  <div className="absolute inset-0 bg-red-500/10 rounded-tactile transition-all duration-200" />
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
                  <span className="truncate">Laboratori IAIA</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        
      <div className="p-4 mt-auto border-t border-[#ffffff14] bg-transparent shrink-0 relative z-20">
        <div className="mt-2 text-[10px] text-left font-black uppercase text-white opacity-60 px-1">
          <div className="flex flex-col items-start gap-1.5">
            <span className="opacity-80 tracking-wider">{APP_VERSION}</span>
            <div className="w-12 h-[1px] bg-white/20"></div>
            <a href="#/privacitat" onClick={(e) => { e.preventDefault(); alert("Avís Legal i Privacitat: Sóc de Poble és una xarxa local descentralitzada (Local-First). Les teues dades, memòria cau i credencials (CRDTs) es desen prioritàriament al teu dispositiu sota criptografia. En usar l'aplicació acceptes aquest model d'emmagatzematge local."); }} className="text-[#F97316] hover:text-white transition-colors cursor-pointer w-full py-1 tracking-wider text-left block">
              PRIVACITAT
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationRail;
