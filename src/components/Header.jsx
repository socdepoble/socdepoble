import { useNavigation } from '../context/NavigationContext';
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDesign } from '../context/DesignContext';
import { Menu, Search, Sun, Moon, UserPlus } from "lucide-react";
import IAIAIcon from "./icons/IAIAIcon";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

/**
 * [MASTER HEADER v10.33.2-CANÒNIC - PROTOCOL GLOBAL]
 * Arquitectura de Ferro: fons adaptatiu, vella i funcional.
 */
const Header = () => {
  const { iaiaLevel } = useDesign();
    const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { toggleDrawer } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Protocol de Visió: La icona és taronja i polsa si NO estem en Mode Humà (Level 0)
  const activeLevel0 = iaiaLevel === 0;
  const isOnVisionPage = location.pathname === "/visio";

  return (
    <header className="h-14 lg:h-16 flex items-center justify-between px-2 lg:px-6 gap-1 shrink-0 select-none bg-black text-theme-text sticky top-0 z-[2000] w-full border-b border-white/[0.03] transition-colors duration-300">
      <div className="flex items-center gap-1 overflow-hidden shrink-0">
        <button
          onClick={toggleDrawer}
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-slate-400 hover:text-[var(--theme-accent-primary)] transition-colors active:scale-90"
          aria-label={t("nav.menu")}
        >
          <Menu size={30} strokeWidth={2} />
        </button>

        <NavLink
          to="/"
          className="flex items-center active:scale-95 transition-transform pb-1"
        >
          <img
            src="/assets/master/logo_socdepoble_white_full.png"
            alt="Sóc de Poble"
            className="w-[130px] lg:w-[160px] h-auto object-contain brightness-110"
            fetchPriority="high"
          />
        </NavLink>
      </div>

      {/* RIGHT SIDE: Tools (Always Visible) - TACTILE TARGET 48px */}
      <div className="flex items-center gap-0.5 lg:gap-3 ml-auto h-full">
        {/* 1. IAIA VISION SELECTOR */}
        <button
          className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all scale-90 lg:scale-100 ${
            activeLevel0
              ? "text-slate-400"
              : "text-[var(--theme-accent-primary)] bg-[var(--theme-accent-primary)]/10 rounded-full"
          } ${isOnVisionPage ? "ring-2 ring-[var(--theme-accent-primary)]" : ""}`}
          onClick={() => {
            if (isOnVisionPage) navigate(-1);
            else navigate("/visio");
          }}
          title={t("nav.vision_protocol")}
        >
          <IAIAIcon
            size={24}
            color={activeLevel0 ? "currentColor" : "var(--theme-accent-primary)"}
            className={activeLevel0 ? "opacity-60" : "animate-pulse"}
          />
        </button>

        {/* 2. LUPA DE CERCA (Global) */}
        <button
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          onClick={() => navigate("/search")}
          title={t("nav.search_global")}
        >
          <Search size={22} className="lg:w-7 lg:h-7" />
        </button>

        {/* 3. CANVI DE TEMA (NIT/DIA) */}
        <button
          className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
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
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-white border border-white/20 overflow-hidden relative">
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
            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-slate-400 hover:text-[var(--theme-accent-primary)] transition-colors"
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
