// ☢️ [NOTA NUCLEAR PER A FLASH]: NOMÉS estem tocant el contenidor de continguts estandarditzats. 
// NO TOCAR l'estructura (Sidebar/Header) que ja està bategada i blindada.
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import VisionSelectorModal from "./VisionSelectorModal";

/**
 * [MASTER HEADER v10.26.0-CANÒNIC - PROTOCOL GLOBAL]
 * Arquitectura de Ferro: fons adaptatiu, sempre visible i funcional.
 */
const Header = () => {
  const { user, profile } = useAuth();
  const { 
    toggleDrawer, visionMode, setVisionMode, 
    isIAIARoleSelectorOpen, setIsIAIARoleSelectorOpen,
    iaiaSidebarOpen, toggleIAIASidebar
  } = useUI();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-3 lg:px-6 gap-2 shrink-0 select-none bg-black text-theme-text sticky top-0 z-[1000] w-full border-b border-white/[0.03] transition-colors duration-300">
        <div className="flex items-center gap-6 overflow-hidden shrink-0">
          <button 
            onClick={toggleDrawer} 
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-[#FF6B00] transition-colors active:scale-90"
            aria-label="Menu"
          >
            <Menu size={30} strokeWidth={2} />
          </button>
          
          <NavLink 
            to="/" 
            className="flex items-center active:scale-95 transition-transform ml-2 lg:ml-4"
          >
              <img 
                src="/assets/master/logo_socdepoble_white_full.png" 
                alt="Sóc de Poble" 
                className="h-10 lg:h-11 w-auto object-contain brightness-110"
                fetchPriority="high"
              />
          </NavLink>
        </div>

      {/* RIGHT SIDE: Tools (Always Visible) - TACTILE TARGET 48px */}
      <div className="flex items-center gap-1 lg:gap-3 ml-auto h-full">
        {/* IAIA VISION SELECTOR [MASTER RESTORED] */}
        <button 
          className={`w-12 h-12 flex items-center justify-center transition-all ${visionMode === 'humana' ? 'text-slate-400' : 'text-[#00D2FF] bg-[#00D2FF]/10 rounded-full'}`} 
          onClick={() => setIsIAIARoleSelectorOpen(true)}
          title="Protocol de Visió"
        >
          <span className={`text-3xl ${visionMode === 'humana' ? "opacity-40" : "animate-pulse"}`}>👁️</span>
        </button>

        {/* IAIA ARCHON SIDEBAR TOGGLE [MASTER BATEGAT] */}
        <button 
          className={`w-12 h-12 flex items-center justify-center transition-all ${iaiaSidebarOpen ? 'text-fuchsia-400 bg-fuchsia-400/10 rounded-full' : 'text-slate-400 hover:text-fuchsia-400'}`} 
          onClick={toggleIAIASidebar}
          title="Consola Archon"
        >
          <span className={`text-3xl ${iaiaSidebarOpen ? "animate-pulse" : ""}`}>🧠</span>
        </button>

        {/* CANVI DE TEMA (NIT/DIA) - EL BATEGAT LUMÍNIC */}
        <button 
          className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mode Dia' : 'Mode Nit'}
        >
          <span className="text-3xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        <button
          className="hidden sm:flex w-12 h-12 items-center justify-center text-slate-400 hover:text-white transition-colors"
          onClick={() => navigate("/search")}
        >
          <span className="text-3xl">🔍</span>
        </button>

        {user && (
          <div className="relative hidden sm:block">
            <button
              className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              onClick={() => navigate("/notificacions")}
            >
              <span className="text-xl">🔔</span>
            </button>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border border-black animate-pulse"></span>
          </div>
        )}

        {user && (
          <div 
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ml-1"
            onClick={() => {
              navigate("/perfil");
            }}
          >
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-white border border-white/20 overflow-hidden relative">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="P" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('.header-avatar-placeholder').style.display = 'block';
                  }}
                />
              ) : null}
              <span className={`header-avatar-placeholder ${profile?.avatar_url ? 'hidden' : ''}`}>
                {(profile?.full_name || user?.email || "U").substring(0, 1).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      <VisionSelectorModal 
        isOpen={isIAIARoleSelectorOpen}
        onClose={() => setIsIAIARoleSelectorOpen(false)}
        currentMode={visionMode}
        onSelect={(mode) => setVisionMode(mode)}
      />
    </header>
  );
};

export default Header;

