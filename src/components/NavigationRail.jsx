import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    MessageCircle, Newspaper, Store, MapPin, 
    Archive, BookOpen, Star, Image as ImageIcon, 
    Folder, Plus, Layout, Sparkles, Calendar,
    Settings, LogOut, User, Grid, Heart, Share2, Edit3
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import './NavigationRail.css';

/**
 * 📖 NAVIGATION RAIL - LA BÍBLIA ESTRUCTURAL
 * Aquest component és SAGRAT. No es poden eliminar ítems del menú.
 * Estructura: Xat, Mur, Mercat, Pobles | Organització | Col·leccions.
 */
const NavigationRail = () => {
    const { setIsCreateModalOpen } = useUI();
    const navigate = useNavigate();

    return (
        <nav className="navigation-drawer bg-[var(--bg-sidebar)]">
            <div className="drawer-header-suprema">
                <div className="drawer-logo-container-biblia" onClick={() => navigate('/')}>
                    <h1 className="biblia-logo-text">Sóc de Poble</h1>
                    <span className="biblia-version-badge">v1.21</span>
                </div>

                {/* BOTÓ AFEGIR (BINARI / BLAU MESTRE) */}
                <button
                    className="drawer-fab-binari"
                    onClick={() => setIsCreateModalOpen(true)}
                    aria-label="Crear nou"
                >
                    <Plus size={24} color="white" />
                    <span className="fab-label uppercase tracking-widest font-black text-sm">Afegir</span>
                </button>
            </div>

            <div className="drawer-scroll-area">
                {/* SECCIÓ PRINCIPAL */}
                <div className="drawer-section mt-4">
                    <NavLink to="/chats" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <MessageCircle size={20} />
                        <span>Xat</span>
                    </NavLink>
                    <NavLink to="/mur" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <Newspaper size={20} />
                        <span>Mur d'Històries</span>
                    </NavLink>
                    <NavLink to="/mercat" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <Store size={20} />
                        <span>Mercat Rural</span>
                    </NavLink>
                    <NavLink to="/pobles" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <MapPin size={20} />
                        <span>Pobles</span>
                    </NavLink>
                    <NavLink to="/perfil" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <User size={20} />
                        <span>El meu Perfil</span>
                    </NavLink>
                </div>

                {/* SECCIÓ ORGANITZACIÓ (BÍBLIA) */}
                <div className="drawer-section mt-8">
                    <h4 className="drawer-section-title uppercase text-[10px] font-black text-white/30 tracking-[0.2em] px-4 mb-4">Organització</h4>
                    <NavLink to="/iaia" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <Star size={20} className="text-yellow-500" />
                        <span>La IAIA (Hub)</span>
                    </NavLink>
                    <NavLink to="/arxiu" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <Archive size={20} />
                        <span>Arxiu d'Or</span>
                    </NavLink>
                    <NavLink to="/calendari" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <Calendar size={20} />
                        <span>Calendari Master</span>
                    </NavLink>
                    <NavLink to="/fotos/global" className={({ isActive }) => `drawer-item ${isActive ? 'active-orange' : ''}`}>
                        <ImageIcon size={20} />
                        <span>Àlbum Global</span>
                    </NavLink>
                </div>

                {/* SECCIÓ COL·LECCIONS (BÍBLIA) */}
                <div className="drawer-section mt-8">
                    <h4 className="drawer-section-title uppercase text-[10px] font-black text-white/30 tracking-[0.2em] px-4 mb-4">Col·leccions</h4>
                    <div className="drawer-item">
                        <Folder size={18} />
                        <span>xat</span>
                    </div>
                </div>
            </div>

            <div className="drawer-footer-minimal p-4 border-t border-white/5">
                {/* 🛡️ SEGELLAT: Switcher de democràcia visual eliminat per a puresa bíblica */}
            </div>
        </nav>
    );
};

export default NavigationRail;

