import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageCircle, Newspaper, Store, MapPin, User, Settings, Info, Plus, Hash, Folder, Archive, Book, Star, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useSocial } from '../context/SocialContext';
import './NavigationRail.css';

const NavigationRail = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { setIsCreateModalOpen } = useUI();
    const { activeCategories } = useSocial();

    return (
        <nav className="navigation-drawer">
            <div className="drawer-header">
                <div className="drawer-logo-container">
                    <img src="/logo.png" alt="Sóc de Poble" className="drawer-logo" />
                </div>
                <button
                    className="drawer-fab"
                    onClick={() => setIsCreateModalOpen(true)}
                    aria-label="Crear nou"
                >
                    <Plus size={24} color="white" />
                    <span className="fab-label">Afegir</span>
                </button>
            </div>

            <div className="drawer-scroll-area">
                <div className="drawer-section">
                    <NavLink to="/chats" className={({ isActive }) => `drawer-item ${isActive ? 'active' : ''}`}>
                        <MessageCircle size={20} />
                        <span>Xat</span>
                    </NavLink>
                    <NavLink to="/mur" className={({ isActive }) => `drawer-item ${isActive ? 'active' : ''}`}>
                        <Newspaper size={20} />
                        <span>Mur d'Històries</span>
                    </NavLink>
                    <NavLink to="/mercat" className={({ isActive }) => `drawer-item ${isActive ? 'active' : ''}`}>
                        <Store size={20} />
                        <span>Mercat Rural</span>
                    </NavLink>
                    <NavLink to="/pobles" className={({ isActive }) => `drawer-item ${isActive ? 'active' : ''}`}>
                        <MapPin size={20} />
                        <span>El Meu Territori</span>
                    </NavLink>
                </div>

                <div className="drawer-divider"></div>

                <div className="drawer-section">
                    <h4 className="drawer-section-title">Organització</h4>
                    <NavLink to="/iaia" className="drawer-item">
                        <Star size={20} />
                        <span>La IAIA (Hub)</span>
                    </NavLink>
                    <NavLink to="/arxiu" className="drawer-item">
                        <Archive size={20} />
                        <span>Arxiu d'Or</span>
                    </NavLink>
                    <NavLink to="/calendari" className="drawer-item">
                        <BookOpen size={20} />
                        <span>Calendari Master</span>
                    </NavLink>
                </div>

                <div className="drawer-divider"></div>

                <div className="drawer-section">
                    <h4 className="drawer-section-title">Col·leccions</h4>
                    {activeCategories.map(cat => (
                        <div key={cat} className="drawer-item category-item">
                            <Folder size={18} />
                            <span className="capitalize">{cat}</span>
                        </div>
                    ))}
                    <div className="drawer-item add-collection" onClick={() => window.dispatchEvent(new CustomEvent('open-social-manager'))}>
                        <Plus size={18} />
                        <span>Nova Col·lecció</span>
                    </div>
                </div>
            </div>

            <div className="drawer-footer">
                <NavLink to="/perfil" className="drawer-item footer-item">
                    <User size={20} />
                    <span>El meu Perfil</span>
                </NavLink>
                <NavLink to="/solatge" className="drawer-item footer-item">
                    <Settings size={20} />
                    <span>Consola Solatge</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default NavigationRail;
