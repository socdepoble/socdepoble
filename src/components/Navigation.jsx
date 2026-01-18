import { NavLink } from 'react-router-dom';
import { MessageCircle, Newspaper, Store, MapPin, Languages, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();
  const { toggleLanguage, language, profile } = useAppContext();

  const handleLogout = async () => {
    if (window.confirm('Vols tancar la sessió?')) {
      await supabaseService.signOut();
    }
  };

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
