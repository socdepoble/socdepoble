import { useNavigate, NavLink } from 'react-router-dom';
import { Newspaper, MapPin, Store, MessageCircle, User, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();
  const { setIsCreateModalOpen } = useUI();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="m3-bottom-nav">
      <NavLink to="/chats" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <MessageCircle size={24} />
        </div>
        <span className="m3-nav-label">Xat</span>
      </NavLink>

      <NavLink to="/mur" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <Newspaper size={24} />
        </div>
        <span className="m3-nav-label">Mur</span>
      </NavLink>

      <div className="m3-fab-item">
        <button
          className="m3-fab"
          onClick={() => {
            if (!user) navigate('/login');
            else setIsCreateModalOpen(true);
          }}
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <NavLink to="/mercat" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <Store size={24} />
        </div>
        <span className="m3-nav-label">Mercat</span>
      </NavLink>

      <NavLink to="/pobles" className={({ isActive }) => `m3-nav-item ${isActive ? 'active' : ''}`}>
        <div className="m3-icon-indicator">
          <MapPin size={24} />
        </div>
        <span className="m3-nav-label">Pobles</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
