import React, { useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, Home, ShoppingCart, MapPin, Calendar, Map, Image as ImageIcon, 
  FileText, Settings, Scale, Palette, Layers, Brain, Route as RouteIcon, Shield,
  Globe, Search, Moon, Plus
} from 'lucide-react';
import { useSession } from '../adapters/authHooks';


const NavItem = ({ to, icon: Icon, children }) => (
  <NavLink to={to} className={({ isActive }) => `sp-nav-item ${isActive ? 'active' : ''}`}>
    <span className="sp-nav-icon"><Icon size={20} /></span>
    {children}
  </NavLink>
);

const NavItemMobile = ({ to, icon: Icon }) => (
  <NavLink to={to} className={({ isActive }) => `sp-nav-item ${isActive ? 'active' : ''}`}>
    <span className="sp-nav-icon"><Icon size={24} /></span>
  </NavLink>
);

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useSession();

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden font-sans bg-theme-base text-theme-text">
      
      {/* BARRA SUPERIOR GLOBAL SÓC DE POBLE */}
      <header className="sp-top-bar z-50">
        <div className="sp-logo-container" onClick={() => navigate('/hub')}>
          <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Logo Sóc de Poble" style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
        </div>
        
        <div className="sp-top-icons flex items-center gap-4">
          <span className="cursor-pointer hover:text-white transition-colors"><Globe size={20} /></span>
          <span className="cursor-pointer transition-colors flex items-center justify-center" style={{ color: "var(--sp-orange-100)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="M12 6v6"/><path d="M10 12v10"/><path d="M14 12v10"/><path d="M12 8h-4"/><path d="M12 8h4"/><path d="M8 8v6"/><path d="M16 8v6"/></svg>
          </span>
          <span className="cursor-pointer hover:text-white transition-colors"><Search size={20} /></span>
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => document.documentElement.classList.toggle('light')}><Moon size={20} /></span>
        </div>
      </header>

      {/* CONTENIDOR PRINCIPAL (Sota la barra) */}
      <div className="sp-app-container relative">
        
        {/* SIDEBAR ESCRIPTORI */}
        <nav className="sp-app-shell-sidebar">
          
          <div className="sp-module-btn" onClick={() => navigate('/connectar')}>
            <span style={{ marginRight: '8px', display: 'flex' }}><Plus size={20} /></span>
            CONNECTAR
          </div>
          
          <div className="sp-sidebar-nav">
            <NavItem to="/xat" icon={MessageSquare}>XAT</NavItem>
            <NavItem to="/mur" icon={Home}>MUR</NavItem>
            <NavItem to="/mercat" icon={ShoppingCart}>MERCAT</NavItem>
            <NavItem to="/pobles" icon={MapPin}>POBLES</NavItem>
            <NavItem to="/events" icon={Calendar}>EVENTS</NavItem>
            <NavItem to="/mapa" icon={Map}>MAPA</NavItem>
            <NavItem to="/multimedia" icon={ImageIcon}>MULTIMÈDIA</NavItem>
            <NavItem to="/notes" icon={FileText}>NOTES</NavItem>
            <NavItem to="/projecte" icon={Settings}>EL PROJECTE</NavItem>
            <NavItem to="/constitucio" icon={Scale}>CONSTITUCIÓ</NavItem>
            <NavItem to="/disseny" icon={Palette}>DISSENY</NavItem>
            <NavItem to="/skills" icon={Layers}>SKILLS</NavItem>
            <NavItem to="/ia" icon={Brain}>L'ÀNIMA DE LA IAIA</NavItem>
            <NavItem to="/roadmap" icon={RouteIcon}>FULL DE RUTA</NavItem>
            <NavItem to="/legal" icon={Shield}>LEGAL I PRIVACITAT</NavItem>
            
            <div className="sp-sidebar-footer" style={{ borderTop: 'none', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="text-xs font-mono" style={{ opacity: 0.7 }}>V10.38.43</div>
                <a href="/gestoria/index.html" style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--sp-blue-100)', textDecoration: 'none' }}>
                  GESTORIA LOCAL
                </a>
              </div>
              
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <img src={profile?.avatar || "/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg"} alt={profile?.name || "Usuari"} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sp-text)' }}>{profile?.name || "Javi Llinares"}</span>
                    <span style={{ fontSize: '10px', color: 'var(--sp-text-muted)' }}>El Mas</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ÀREA DE CONTINGUT (Main) */}
        <main className="sp-app-shell-main system-scroll-container">
          <Outlet />
        </main>

        {/* NAV MÒBIL (Substitueix la Sidebar en < 768px) */}
        <nav className="sp-app-shell-nav-mobil">
          <NavItemMobile to="/mur" icon={Home} />
          <NavItemMobile to="/xat" icon={MessageSquare} />
          <div className="sp-nav-item-center" onClick={() => navigate('/connectar')}>
            <div className="sp-nav-mobil-btn-add">
              <Plus size={24} />
            </div>
          </div>
          <NavItemMobile to="/mercat" icon={ShoppingCart} />
          <NavItemMobile to="/hub" icon={Settings} />
        </nav>
      </div>
    </div>
  );
}

export default AppLayout;
