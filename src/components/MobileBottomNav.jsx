import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, LayoutGrid, Store, MapPin, Plus } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
    const { setIsCreateModalOpen, setIsGuestInteractionModalOpen } = useUI();
    const { user } = useAuth();

    const handlePlusClick = (e) => {
        e.preventDefault();
        if (user?.isAnonymous) {
            setIsGuestInteractionModalOpen(true);
        } else {
            setIsCreateModalOpen(true);
        }
    };

    return (
        <nav className="mobile-bottom-nav lg:hidden">
            <div className="nav-container">
                <NavLink to="/chats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={24} />
                    <span>Xats</span>
                </NavLink>
                
                <NavLink to="/mur" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutGrid size={24} />
                    <span>Mur</span>
                </NavLink>

                {/* BOTÓ CENTRAL DE PUBLICACIÓ RÀPIDA */}
                <button className="nav-plus-btn" onClick={handlePlusClick}>
                    <div className="plus-icon-wrap">
                        <Plus size={32} strokeWidth={3} />
                    </div>
                </button>

                <NavLink to="/mercat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Store size={24} />
                    <span>Mercat</span>
                </NavLink>

                <NavLink to="/pobles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MapPin size={24} />
                    <span>Pobles</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default MobileBottomNav;
