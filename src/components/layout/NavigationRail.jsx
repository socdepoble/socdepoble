import { useCallback } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../../app/context/NavigationContext";
import { useAuth } from "../../app/context/AuthContext";
import { APP_VERSION } from "../../constants";
import { Plus, MessageSquare, LayoutGrid, Store, MapPin, Calendar, Map, BookOpen, Image, FileText, Compass, Activity, Palette } from "lucide-react";

const menuItems = [
  { path: "/chats", key: "nav.chats", fallback: "Xat", icon: (p) => <MessageSquare {...p} /> },
  { path: "/mur", key: "nav.feed", fallback: "Mur", icon: (p) => <LayoutGrid {...p} /> },
  { path: "/mercat", key: "nav.market", fallback: "Mercat", icon: (p) => <Store {...p} /> },
  { path: "/pobles", key: "nav.towns", fallback: "Pobles", icon: (p) => <MapPin {...p} /> },
  { path: "/calendari", key: "nav.events", fallback: "Calendari", icon: (p) => <Calendar {...p} /> },
  { path: "/mapa", key: "nav.map", fallback: "Mapa", icon: (p) => <Map {...p} /> },
  { path: "/el-projecte", key: "nav.project", fallback: "El Projecte", icon: (p) => <BookOpen {...p} /> },
  { path: "/genotip", key: "nav.genotip", fallback: "Genotip", icon: (p) => <Activity {...p} /> },
  { path: "/disseny", key: "nav.design", fallback: "Disseny", icon: (p) => <Palette {...p} /> },
  { path: "/ruta", key: "nav.roadmap", fallback: "Full de Ruta", icon: (p) => <Compass {...p} /> },
  { path: "/media", key: "nav.media", fallback: "Multimèdia", icon: (p) => <Image {...p} /> },
  { path: "/notes", key: "nav.notes", fallback: "Notes", icon: (p) => <FileText {...p} /> },
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
    <nav className="w-full h-full flex flex-col bg-transparent relative overflow-hidden notranslate">
      
      {/* 1. BOTÓ D'ACCIÓ RÀPIDA (TOP - PROTOCOL HUB) - FIT 56PX */}
      <div 
        className="min-h-[50px] sm:min-h-[56px] w-full shrink-0 flex items-center justify-start px-7 gap-4 bg-[#4F46E5] text-white cursor-pointer hover:opacity-90 transition-opacity z-20 relative"
        onClick={() => {
          navigate("/hub");
          handleNavigate();
        }}
      >
        <Plus size={22} strokeWidth={3} className="shrink-0" />
        <span className="font-bold tracking-widest uppercase text-[17px] truncate">
          {t("common.add", "CONNECTAR")}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto stable-scroll custom-scrollbar flex flex-col pt-1 px-3 pb-6">

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
                  <span className="truncate">{t("nav.iaia_lab", "Laboratori IAIA")}</span>
                </NavLink>
              </li>
            )}

            {/* LEGAL I VERSIONS - DINS DE LA LLISTA (SCROLLABLE) */}
            <li className="relative mt-6 pt-4 border-t border-[#ffffff14]">
              <div className="flex flex-col items-start gap-3 px-4">
                <a 
                  href="#/legal-privacitat-i-seguretat" 
                  onClick={(e) => { e.preventDefault(); navigate("/legal-privacitat-i-seguretat"); handleNavigate(); }} 
                  className="text-sm font-bold text-[#F97316] hover:text-white transition-colors cursor-pointer w-full tracking-wide block outline-none py-1"
                >
                  {t("nav.privacy", "LEGAL")}
                </a>
                <a 
                  href="#/versions" 
                  onClick={(e) => { e.preventDefault(); navigate("/versions"); handleNavigate(); }} 
                  className="text-sm font-bold text-[#F97316] tracking-wide hover:text-white transition-colors cursor-pointer block outline-none py-1"
                >
                  {APP_VERSION}
                </a>
              </div>
            </li>
          </ul>
        </div>
    </nav>
  );
};

export default NavigationRail;
