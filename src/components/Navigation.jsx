import { useNavigate, NavLink } from 'react-router-dom';
import { MessageCircle, Newspaper, Store, MapPin, Plus } from 'lucide-react';
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
    <nav className="bottom-nav">
      <NavLink to="/chats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MessageCircle size={24} />
        <span>{t('nav.chats')}</span>
      </NavLink>
      <NavLink to="/mur" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Newspaper size={24} />
        <span>{t('nav.feed')}</span>
      </NavLink>

      <div className="nav-fab-container">
        <button
          className="nav-fab"
          onClick={() => {
            if (!user) {
              navigate('/login');
            } else {
              setIsCreateModalOpen(true);
            }
          }}
        >
          <Plus size={32} color="white" strokeWidth={3} />
        </button>
      </div>

      <NavLink to="/mercat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Store size={24} />
        <span>{t('nav.market')}</span>
      </NavLink>
      <NavLink to="/pobles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MapPin size={24} />
        <span>{t('nav.towns')}</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
