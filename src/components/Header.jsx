import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  Bell,
  Sparkles,
  Moon,
  Sun
} from "lucide-react";

/**
 * [MASTER HEADER V8.5 - V11 HARMONY]
 * Arquitectura de Ferro: fons #000000, altura 112px, icones a la dreta amb de tema.
 */
const Header = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="h-[64px] min-h-[64px] max-h-[64px] flex items-center justify-end px-8 bg-[#050505] border-b border-[#27272a]/30 relative z-50">
      <div className="header-icons-box flex items-center gap-6">
        {/* 1. Lupa (Cerca) */}
        <button 
          className="text-gray-400 hover:text-white transition-all hover:scale-110 p-2" 
          onClick={() => navigate("/cerca")}
          title="Buscar"
        >
          <Search size={22} />
        </button>

        {/* 2. Chispa (IAIA) */}
        <button
          className="text-[#5D5FEF] hover:scale-110 transition-all p-2"
          onClick={() => navigate("/iaia")}
          title="IAIA Hub"
        >
          <Sparkles size={22} />
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
        <div className="h-[32px] w-[1px] bg-white/10 mx-2" /> {/* Divider com a la captura */}
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
