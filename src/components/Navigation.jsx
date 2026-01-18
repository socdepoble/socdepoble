import { NavLink } from 'react-router-dom';
import { MessageCircle, Newspaper, Store, MapPin } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/chats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MessageCircle size={24} />
        <span>Xats</span>
      </NavLink>
      <NavLink to="/mur" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Newspaper size={24} />
        <span>Mur</span>
      </NavLink>
      <NavLink to="/mercat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Store size={24} />
        <span>Mercat</span>
      </NavLink>
      <NavLink to="/pobles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MapPin size={24} />
        <span>Pobles</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
