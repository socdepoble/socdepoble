// ☢️ [NOTA NUCLEAR PER A FLASH]: NOMÉS estem tocant el contenidor de continguts estandarditzats. 
// NO TOCAR l'estructura (Sidebar/Header) que ja està bategada i blindada.
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUI } from "../context/UIContext";
import { useI18n } from "../context/I18nContext";
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  Moon,
  Sun
} from "lucide-react";

/**
 * [MASTER HEADER V1.23 - PROTOCOL GLOBAL]
 * Arquitectura de Ferro: fons adaptatiu, sempre visible i funcional.
 */
const Header = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isDrawerOpen, toggleDrawer } = useUI();
  const { language, toggleLanguage } = useI18n();
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-4 gap-2 shrink-0 select-none bg-black text-white sticky top-0 z-[1000] w-full border-b border-white/5">
      {/* LEFT SIDE: Mobile Menu + Logo (Always Visible) */}
      <div className="flex items-center gap-2">
        {!isDrawerOpen && (
          <button 
            onClick={toggleDrawer} 
            className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white transition-colors"
            title="Obrir Menú"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="border-2 border-white px-2 py-0.5 cursor-pointer bg-black active:scale-95 transition-transform" onClick={() => navigate('/mur')}>
          <span className="font-bold text-base tracking-widest uppercase text-white whitespace-nowrap">SÓC DE POBLE</span>
        </div>
      </div>

      {/* RIGHT SIDE: Tools (Always Visible) - TACTILE TARGET 48px */}
      <div className="flex items-center gap-1 md:gap-3 ml-auto h-full">
        <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors" onClick={() => navigate("/search")}>
          <Search size={20} />
        </button>
        
        <button onClick={toggleTheme} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          {theme === 'dark' ? <Moon size={20} fill="currentColor" /> : <Sun size={20} className="text-yellow-500" fill="currentColor" />}
        </button>
        
        <button 
          onClick={toggleLanguage} 
          className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border border-slate-700 text-slate-300 hover:text-white hover:border-white transition-all ml-1" 
          title="Canviar Idioma"
        >
          {(language || 'VA').split('-')[0].toUpperCase()}
        </button>
        
        {user && (
          <div className="relative">
            <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors" onClick={() => navigate("/notificacions")}>
              <Bell size={20} />
            </button>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border border-black animate-pulse"></span>
          </div>
        )}

        {user && (
          <div 
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ml-1"
            onClick={() => navigate('/perfil')}
          >
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-white border border-white/20 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name || user?.email || "U").substring(0, 1).toUpperCase()
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

