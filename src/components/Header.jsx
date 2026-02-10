// ☢️ [NOTA NUCLEAR PER A FLASH]: NOMÉS estem tocant el contenidor de continguts estandarditzats. 
// NO TOCAR l'estructura (Sidebar/Header) que ja està bategada i blindada.
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUI } from "../context/UIContext";
import {
  Search,
  Bell,
  Sparkles,
  Moon,
  Sun
} from "lucide-react";

/**
 * [MASTER HEADER V11 - PROTOCOL OMEGA]
 * Arquitectura de Ferro: fons #050505, altura var(--header-h).
 */
const Header = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openIAIARoleSelector, iaiaLevel } = useUI();
  const navigate = useNavigate();

  return (
    <header className="header-fixed-alzina">
      <div className="header-icons-box flex items-center gap-6">
        {/* 1. Lupa (Cerca) */}
        <button 
          className="text-gray-400 hover:text-white transition-all hover:scale-110 p-2" 
          onClick={() => navigate("/cerca")}
          title="Buscar"
        >
          <Search size={22} />
        </button>

        {/* 2. Chispa (IAIA) - ESTAT CERO / ACTIVE */}
        <button
          className={`flex items-center gap-2 transition-all p-2 rounded-full px-4 border ${
            iaiaLevel > 0 
              ? 'text-[#FF6D23] bg-[#FF6D23]/10 border-[#FF6D23]/20 shadow-[0_0_15px_rgba(255,109,35,0.2)]'
              : 'text-white/40 hover:text-white bg-white/5 border-white/10'
          }`}
          onClick={openIAIARoleSelector}
          title="Configura el teu nivell d'IAIA"
        >
          <Sparkles size={20} className={iaiaLevel > 0 ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline">
            {iaiaLevel === 0 ? 'IAIA' : `NIVELL ${iaiaLevel}`}
          </span>
        </button>

        {/* 3. Lluna/Sol (Tema) */}
        <button
          className="text-gray-400 hover:text-white transition-all hover:scale-110 p-2"
          onClick={toggleTheme}
          title="Canviar Mode Nit/Dia"
        >
          {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        {/* 4. Notificacions (Campana) */}
        {user && (
          <button
            className="text-gray-400 hover:text-white transition-all hover:scale-110 relative p-2"
            onClick={() => navigate("/notificacions")}
            title="Notificacions"
          >
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 bg-[#FF3B30] text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black shadow-sm">3</span>
          </button>
        )}

        {/* 5. Perfil (Avatar) */}
        <div className="h-[32px] w-[1px] bg-white/10 mx-2" /> {/* Divider */}
        {user && (
          <div className="avatar-box cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/perfil")}>
            <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-[#1a1a1c] flex items-center justify-center">
              {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                  <div className="text-[10px] font-black text-white uppercase">
                      {(profile?.full_name || user?.email || "U").substring(0, 1).toUpperCase()}
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
