import { useNavigation } from '../../app/context/NavigationContext';
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import { Menu, Search, Sun, Moon, UserPlus } from "lucide-react";
import { useTheme } from "../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../ui/LanguageSelector";
import { useDesign } from "../../app/context/DesignContext";
import IAIAIcon from "../icons/IAIAIcon";
import { UniversalHeader } from "../ui/universal-header";


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
    <UniversalHeader>
      {/* LEFT SIDE: Logo (Obre el menú) */}
      <UniversalHeader.Group position="left" className="!pl-[30px]">
        <UniversalHeader.Logo onClick={toggleDrawer} />
      </UniversalHeader.Group>

      {/* RIGHT SIDE: Tools (Always Visible) */}
      <UniversalHeader.Group position="right">
        {/* 0. LANGUAGE SWITCHER (Always Visible) */}
        <div className="shrink-0 z-50">
            <LanguageSelector variant="header" />
        </div>

        {/* 1. IAIA VISION SELECTOR */}
        <UniversalHeader.Button
          variant="custom"
          className={`shrink-0 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all scale-95 lg:scale-100 ${
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
            size={36}
            color={activeLevel0 ? "currentColor" : "#F97316"}
            className={`shrink-0 w-[36px] h-[36px] ${activeLevel0 ? "opacity-60" : "animate-pulse"}`}
          />
        </UniversalHeader.Button>

        <UniversalHeader.Button
          variant="tool"
          onClick={() => navigate("/search")}
          title={t("nav.search_global")}
        >
          <Search className="shrink-0 w-[36px] h-[36px]" />
        </UniversalHeader.Button>

        {/* 3. CANVI DE TEMA (NIT/DIA) */}
        <UniversalHeader.Button
          variant="tool"
          onClick={toggleTheme}
          title={theme === "dark" ? t("nav.theme_day") : t("nav.theme_night")}
        >
          {theme === "dark" ? <Sun className="shrink-0 w-[36px] h-[36px]" /> : <Moon className="shrink-0 w-[36px] h-[36px]" />}
        </UniversalHeader.Button>

        {/* 4. PERFIL / REGISTRE */}
        {user && !user.isAnonymous ? (
          <UniversalHeader.Button
            variant="profile"
            onClick={() => navigate("/perfil")}
          >
            <div className="notranslate shrink-0 w-[36px] h-[36px] rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs font-black text-white border border-[#333] overflow-hidden relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="P"
                  className="w-full h-full object-cover shrink-0"
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
                className={`header-avatar-placeholder shrink-0 ${
                  profile?.avatar_url ? "hidden" : ""
                }`}
              >
                {(profile?.full_name || user?.email || "U")
                  .substring(0, 1)
                  .toUpperCase()}
              </span>
            </div>
          </UniversalHeader.Button>
        ) : (
          <UniversalHeader.Button
            variant="tool"
            onClick={() => navigate("/registre")}
            title={t("nav.register")}
          >
            <UserPlus className="shrink-0 w-[36px] h-[36px]" />
          </UniversalHeader.Button>
        )}
      </UniversalHeader.Group>
    </UniversalHeader>
  );
};

export default Header;
