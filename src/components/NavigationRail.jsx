import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageCircle, Newspaper, Store, MapPin, User, Settings, Info, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './NavigationRail.css';

const NavigationRail = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { setIsCreateModalOpen } = useUI();

    return (
        <nav className="navigation-rail">
            <div className="rail-top">
                <button
                    className="rail-fab"
                    onClick={() => setIsCreateModalOpen(true)}
                    aria-label="Crear nou"
                >
                    <Plus size={24} color="white" />
                </button>
            </div>

            <div className="rail-destinations">
                <NavLink to="/chats" className={({ isActive }) => `rail-item ${isActive ? 'active' : ''}`}>
                    <div className="rail-icon-wrapper">
                        <MessageCircle size={24} />
                    </div>
                    <span className="rail-label">Xat</span>
                </NavLink>

                <NavLink to="/mur" className={({ isActive }) => `rail-item ${isActive ? 'active' : ''}`}>
                    <div className="rail-icon-wrapper">
                        <Newspaper size={24} />
                    </div>
                    <span className="rail-label">Mur</span>
                </NavLink>

                <NavLink to="/mercat" className={({ isActive }) => `rail-item ${isActive ? 'rail-active' : ''}`}>
                    <div className="rail-icon-wrapper">
                        <Store size={24} />
                    </div>
                    <span className="rail-label">Mercat</span>
                </NavLink>

                <NavLink to="/pobles" className={({ isActive }) => `rail-item ${isActive ? 'rail-active' : ''}`}>
                    <div className="rail-icon-wrapper">
                        <MapPin size={24} />
                    </div>
                    <span className="rail-label">Pobles</span>
                </NavLink>
            </div>

            <div className="rail-bottom">
                <NavLink to="/perfil" className="rail-item">
                    <div className="rail-icon-wrapper">
                        <User size={24} />
                    </div>
                    <span className="rail-label">Perfil</span>
                </NavLink>
                <NavLink to="/solatge" className="rail-item">
                    <div className="rail-icon-wrapper">
                        <Settings size={24} />
                    </div>
                    <span className="rail-label">Solatge</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default NavigationRail;
