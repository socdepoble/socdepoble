import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Newspaper, MapPin, Store, MessageCircle, User, Plus, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();
  const { setIsCreateModalOpen } = useUI();
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="m3-bottom-nav">
      <NavLink to="/chats" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <MessageCircle size={28} />
        </div>
        <span className="m3-nav-label">Xat</span>
        {location.pathname === '/chats' && <div className="active-dot" />}
      </NavLink>

      <NavLink to="/mur" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <Newspaper size={28} />
        </div>
        <span className="m3-nav-label">Mur</span>
        {location.pathname === '/mur' && <div className="active-dot" />}
      </NavLink>

      <div className="m3-fab-item">
        <button
          className="m3-fab master-plus"
          onClick={() => {
            if (!user) navigate('/login');
            else setIsCreateModalOpen(true);
          }}
        >
          <Plus size={36} strokeWidth={2.5} />
        </button>
      </div>

      <NavLink to="/mercat" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <Store size={28} />
        </div>
        <span className="m3-nav-label">Mercat</span>
        {location.pathname === '/mercat' && <div className="active-dot" />}
      </NavLink>

      <NavLink to="/pobles" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <MapPin size={28} />
        </div>
        <span className="m3-nav-label">Pobles</span>
        {location.pathname === '/pobles' && <div className="active-dot" />}
      </NavLink>
    </nav>
  );
};

export default Navigation;
