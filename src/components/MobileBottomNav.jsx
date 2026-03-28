import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquare, LayoutGrid, Store, MapPin, Plus } from 'lucide-react';

import './MobileBottomNav.css';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handlePlusClick = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/hub');
    }, [navigate]);

    return (
        <nav className="mobile-bottom-nav lg:hidden">
            <div className="nav-container">
                <NavLink to="/chats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={28} />
                    <span>{t('nav.chats')}</span>
                </NavLink>
                
                <NavLink to="/mur" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutGrid size={28} />
                    <span>{t('nav.feed')}</span>
                </NavLink>

                <button className="nav-item plus-item" onClick={handlePlusClick}>
                    <Plus size={28} strokeWidth={3} />
                    <span>{t('common.add')}</span>
                </button>

                <NavLink to="/mercat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Store size={28} />
                    <span>{t('nav.market')}</span>
                </NavLink>

                <NavLink to="/pobles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MapPin size={28} />
                    <span>{t('nav.towns')}</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default MobileBottomNav;
