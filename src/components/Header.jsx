// ☢️ [NOTA NUCLEAR PER A FLASH]: NOMÉS estem tocant el contenidor de continguts estandarditzats. 
// NO TOCAR l'estructura (Sidebar/Header) que ja està bategada i blindada.
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUI } from "../context/UIContext";
import { useState } from "react";
import {
  Search,
  Bell,
  Sparkles,
  Moon,
  Sun,
  Globe,
  BookOpen
} from "lucide-react";

/**
 * [MASTER HEADER V1.23 - PROTOCOL GLOBAL]
 * Arquitectura de Ferro: fons adaptatiu, sempre visible i funcional.
 */
const Header = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { 
    openIAIARoleSelector, 
    iaiaLevel, 
    architectMode, 
    toggleArchitectMode 
  } = useUI();
  const navigate = useNavigate();
  
  // LLISTA D'IDIOMES (Cicle)
  const [language, setLanguage] = useState('CA');
  const languages = ['CA', 'ES', 'EN', 'GL', 'EU'];
  
  const cycleLanguage = (e) => {
    e.stopPropagation();
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <header className="header-fixed-alzina bg-black border-b border-white/10">
      <div className="header-content-wrapper flex items-center justify-between w-full px-4 md:px-10">
        <div 
          className="logo-section cursor-pointer hidden md:flex items-center" 
          onClick={() => navigate('/mur')}
        >
          <img 
            src="/logo-white.png" 
            alt="Sóc de Poble" 
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* CONTENIDOR D'ICONES: NET I ALINEAT */}
        <div className="header-icons-box flex items-center gap-6 ml-auto">
          {user && (
            <div className="avatar-box cursor-pointer hover:scale-110 transition-transform" onClick={() => navigate("/perfil")}>
              <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-[#1a1a1c]">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-black text-white uppercase bg-gradient-to-br from-gray-700 to-black">
                    {(profile?.full_name || user?.email || "U").substring(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />

          <button 
            className="text-gray-400 hover:text-white transition-colors" 
            onClick={() => navigate("/cerca")}
          >
            <Search size={22} />
          </button>

          <button
            className={`hidden sm:block transition-all ${
              architectMode ? 'text-orange-500 scale-110 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'text-gray-400 hover:text-white'
            }`}
            onClick={toggleArchitectMode}
            title="Modo Arquitecto (Definicions)"
          >
            <BookOpen size={22} />
          </button>

          <button 
            onClick={cycleLanguage} 
            className="hidden sm:flex items-center gap-1.5 text-white font-bold text-xs border border-white/30 rounded px-2 py-1 hover:bg-white/10 transition-all font-sans"
          >
            <Globe size={14} /> {language}
          </button>

          <button
            className="hidden sm:block text-gray-400 hover:text-white transition-colors"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              iaiaLevel > 0 
                ? 'text-[#FF6D23] bg-[#FF6D23]/10 border-[#FF6D23]/30 shadow-[0_0_20px_rgba(255,109,35,0.3)]'
                : 'text-white/40 hover:text-white bg-white/5 border-white/10'
            }`}
            onClick={openIAIARoleSelector}
          >
            <Sparkles size={18} className={iaiaLevel > 0 ? 'animate-pulse' : ''} />
            <span className="text-[11px] font-black uppercase tracking-widest hidden lg:inline">
              IAIA {iaiaLevel > 0 ? `LVL ${iaiaLevel}` : ''}
            </span>
          </button>

          {user && (
            <button
              className="text-gray-400 hover:text-white transition-colors relative hidden sm:block"
              onClick={() => navigate("/notificacions")}
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-black">3</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

