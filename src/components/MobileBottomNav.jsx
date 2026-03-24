import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, LayoutGrid, Store, MapPin, Plus } from 'lucide-react';

import './MobileBottomNav.css';

const MobileBottomNav = () => {
    const navigate = useNavigate();

    const handlePlusClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/hub');
    };

    return (
        <nav className="mobile-bottom-nav lg:hidden">
            <div className="nav-container">
                <NavLink to="/chats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={28} />
                    <span>Xats</span>
                </NavLink>
                
                <NavLink to="/mur" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutGrid size={28} />
                    <span>Mur</span>
                </NavLink>

                <button className="nav-item plus-item" onClick={handlePlusClick}>
                    <Plus size={28} strokeWidth={3} />
                    <span>Connectar</span>
                </button>

                <NavLink to="/mercat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Store size={28} />
                    <span>Mercat</span>
                </NavLink>

                <NavLink to="/pobles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MapPin size={28} />
                    <span>Pobles</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default MobileBottomNav;
