// ☢️ [NOTA NUCLEAR PER A FLASH]: NOMÉS estem tocant el contenidor de continguts estandarditzats. 
// NO TOCAR l'estructura (Sidebar/Header) que ja està bategada i blindada.
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import {
  Search,
  Bell,
  Menu
} from "lucide-react";

/**
 * [MASTER HEADER V1.23 - PROTOCOL GLOBAL]
 * Arquitectura de Ferro: fons adaptatiu, sempre visible i funcional.
 */
const Header = () => {
  const { user, profile } = useAuth();
  const { toggleDrawer } = useUI();
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-3 lg:px-6 gap-2 shrink-0 select-none bg-black text-white sticky top-0 z-[1000] w-full border-b border-white/5">
        <div className="flex items-center gap-1 lg:gap-4 overflow-hidden">
          <button 
            onClick={toggleDrawer} 
            className="lg:hidden w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          
          <NavLink 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 flex items-center active:scale-95 transition-transform"
          >
            <img
              src="/logo-white.png"
              alt="SÓC DE POBLE"
              className="h-6 lg:h-7 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo-white.png';
              }}
            />
          </NavLink>
        </div>

      {/* RIGHT SIDE: Tools (Always Visible) - TACTILE TARGET 48px */}
      <div className="flex items-center gap-1 lg:gap-3 ml-auto h-full">
        <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors" onClick={() => navigate("/search")}>
          <Search size={20} />
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

