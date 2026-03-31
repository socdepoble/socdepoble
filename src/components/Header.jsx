import { useNavigation } from '../context/NavigationContext';
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, Search, Sun, Moon, UserPlus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { useDesign } from "../context/DesignContext";
import IAIAIcon from "./icons/IAIAIcon";

/**
 * Header [MASTER CANONIC v11.0.3]
 * Arquitectura de Ferro: fons adaptatiu, vella i funcional.
 */
const Header = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { toggleDrawer } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { iaiaLevel } = useDesign();

  const activeLevel0 = iaiaLevel === 0;
  const isOnVisionPage = location.pathname === "/visio";

    return (
    <header className="h-[64px] min-h-[64px] max-h-[64px] w-full flex items-center justify-between px-3 lg:px-6 z-50 transition-all duration-300 bg-[#1a1a1a] border-b border-[var(--border-master)]/50 shrink-0 shadow-sm">
      <div className="flex items-center gap-1 overflow-hidden shrink-0">
        <button
          onClick={toggleDrawer}
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors active:scale-90"
          aria-label={t("nav.menu")}
        >
          <Menu size={30} strokeWidth={2} />
        </button>

        <NavLink
          to="/chats"
          className="flex items-center active:scale-95 transition-transform pb-1"
        >
          <img
            src="/assets/master/logo-socdepoble-rect.svg"
            alt="Sóc de Poble"
            className="w-[130px] lg:w-[160px] h-auto object-contain"
            fetchPriority="high"
          />
        </NavLink>
      </div>

      {/* RIGHT SIDE: Tools (Always Visible) - TACTILE TARGET 48px */}
      <div className="flex items-center gap-0.5 lg:gap-3 ml-auto h-full">
        {/* 0. LANGUAGE SWITCHER (Hidden on mobile as per user layout constraints) */}
        <div className="hidden lg:block shrink-0 z-50">
            <LanguageSelector variant="header" />
        </div>

        {/* 1. IAIA VISION SELECTOR */}
        <button
          className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all scale-90 lg:scale-100 ${
            activeLevel0
              ? "text-white/70"
              : "text-[#F97316] bg-[#F97316]/10 rounded-full"
          } ${isOnVisionPage ? "ring-2 ring-[#F97316]" : ""}`}
          onClick={() => {
            if (isOnVisionPage) navigate(-1);
            else navigate("/visio");
          }}
          title={t("nav.vision_protocol")}
        >
          <IAIAIcon
            size={24}
            color={activeLevel0 ? "currentColor" : "#F97316"}
            className={activeLevel0 ? "opacity-60" : "animate-pulse"}
          />
        </button>

        {/* 2. LUPA DE CERCA (Global) */}
        <button
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          onClick={() => navigate("/search")}
          title={t("nav.search_global")}
        >
          <Search size={22} className="lg:w-7 lg:h-7" />
        </button>

        {/* 3. CANVI DE TEMA (NIT/DIA) */}
        <button
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          onClick={toggleTheme}
          title={theme === "dark" ? t("nav.theme_day") : t("nav.theme_night")}
        >
          {theme === "dark" ? <Sun size={22} className="lg:w-7 lg:h-7" /> : <Moon size={22} className="lg:w-7 lg:h-7" />}
        </button>

        {/* 4. PERFIL / REGISTRE */}
        {user && !user.isAnonymous ? (
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/perfil")}
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-[28px] bg-[#1A1A1A] flex items-center justify-center text-xs font-black text-white border border-[#333] overflow-hidden relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="P"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.parentNode.querySelector(
                      ".header-avatar-placeholder",
                    ).style.display = "block";
                  }}
                />
              ) : null}
              <span
                className={`header-avatar-placeholder ${
                  profile?.avatar_url ? "hidden" : ""
                }`}
              >
                {(profile?.full_name || user?.email || "U")
                  .substring(0, 1)
                  .toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <button
            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            onClick={() => navigate("/registre")}
            title={t("nav.register")}
          >
            <UserPlus size={22} className="lg:w-7 lg:h-7" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
