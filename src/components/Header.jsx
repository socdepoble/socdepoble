import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import { User, Search, Bell, Sparkles, UserCheck, Download, Activity, ChevronRight, Store, Building2, Users, Zap, BookOpen, Eye, EyeOff } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useState, useEffect } from 'react';
import MasterConsole from './MasterConsole';
import './Header.css';

const ContextMenu = () => {
    const { realProfile, activeEntityId, switchContext, simulatedRole, setSimulatedRole, isAdmin, isEditor, isSuperAdmin } = useAuth();
    const { t } = useTranslation();
    const [entities, setEntities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchManaged = async () => {
            if (realProfile?.id) {
                try {
                    const data = await supabaseService.getUserEntities(realProfile.id);
                    setEntities(data || []);
                } catch (err) {
                    logger.error('[ContextMenu] Error fetching entities:', err);
                }
            }
        };
        fetchManaged();

        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener('toggle-context-menu', handleToggle);
        const handleClickOutside = () => setIsOpen(false);
        window.addEventListener('scroll', handleClickOutside);
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.context-switcher-wrapper')) setIsOpen(false);
        });

        return () => {
            window.removeEventListener('toggle-context-menu', handleToggle);
            window.removeEventListener('scroll', handleClickOutside);
        };
    }, [realProfile]);

    if (!isOpen) return null;

    return (
        <div className="context-menu-dropdown">
            <div className="context-menu-header">Canviar Identitat</div>

            {/* Personal Profile */}
            <div
                className={`context-option ${!activeEntityId ? 'active' : ''}`}
                onClick={() => { switchContext(null); setIsOpen(false); }}
            >
                <div className="context-option-avatar">
                    {realProfile?.avatar_url ? (
                        <img src={realProfile.avatar_url} alt={realProfile.full_name} />
                    ) : <User size={20} />}
                </div>
                <div className="context-option-info">
                    <span className="context-option-name">{realProfile?.full_name}</span>
                    <span className="context-option-role">Perfil Personal</span>
                </div>
            </div>

            {/* Managed Entities */}
            {entities.map(entity => (
                <div
                    key={entity.id}
                    className={`context-option ${activeEntityId === entity.id ? 'active' : ''}`}
                    onClick={() => { switchContext(entity.id); setIsOpen(false); }}
                >
                    <div className="context-option-avatar">
                        {entity.avatar_url ? (
                            <img src={entity.avatar_url} alt={entity.name} />
                        ) : (
                            entity.type === 'oficial' ? <Building2 size={18} /> :
                                entity.type === 'negoci' ? <Store size={18} /> : <Users size={18} />
                        )}
                    </div>
                    <div className="context-option-info">
                        <span className="context-option-name">{entity.name}</span>
                        <span className="context-option-role">
                            {entity.type === 'negoci' ? 'Negoci' : (entity.type === 'oficial' ? 'Pàgina Oficial' : 'Grup')}
                        </span>
                    </div>
                </div>
            ))}

            {/* [MASTER] ROLE SIMULATOR (Only for Privileged Users) */}
            {(isSuperAdmin || isEditor || isAdmin) && (
                <div className="context-menu-simulator-section">
                    <div className="context-menu-header">{t('sim.perspective')}</div>

                    {/* User Perspective */}
                    <div
                        className={`context-option sim-option ${simulatedRole === 'vei' ? 'active-sim' : ''}`}
                        onClick={() => { setSimulatedRole(simulatedRole === 'vei' ? null : 'vei'); setIsOpen(false); }}
                    >
                        <div className="context-option-avatar sim-icon">
                            <Eye size={18} />
                        </div>
                        <div className="context-option-info">
                            <span className="context-option-name">{t('sim.role_user')}</span>
                            {simulatedRole === 'vei' && <span className="sim-status-label">{t('sim.active')}</span>}
                        </div>
                    </div>

                    {/* Editor Perspective (If Admin or SuperAdmin) */}
                    {(isSuperAdmin || isAdmin) && (
                        <div
                            className={`context-option sim-option ${simulatedRole === 'editor' ? 'active-sim' : ''}`}
                            onClick={() => { setSimulatedRole(simulatedRole === 'editor' ? null : 'editor'); setIsOpen(false); }}
                        >
                            <div className="context-option-avatar sim-icon">
                                <Sparkles size={18} />
                            </div>
                            <div className="context-option-info">
                                <span className="context-option-name">{t('sim.role_editor')}</span>
                                {simulatedRole === 'editor' && <span className="sim-status-label">{t('sim.active')}</span>}
                            </div>
                        </div>
                    )}

                    {/* Reset Perspective */}
                    {simulatedRole && (
                        <div
                            className="context-option stop-sim"
                            onClick={() => { setSimulatedRole(null); setIsOpen(false); }}
                        >
                            <div className="context-option-avatar sim-icon stop">
                                <EyeOff size={18} />
                            </div>
                            <div className="context-option-info">
                                <span className="context-option-name">{t('sim.stop')}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Header = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const { simulatedRole } = useAuth();


    return (
        <header className="m3-top-app-bar premium-master-bar">
            <div className="bar-leading desktop-hide">
                <Link to="/" className="header-logo-link" title="Torna a l'Inici">
                    <img
                        src="/assets/master/logo_socdepoble_white_full.png"
                        alt="Sóc de Poble"
                        className="header-main-logo"
                    />
                </Link>
            </div>

            {/* Mobile-only logo or space to push trailing to the right */}
            <div className="bar-leading mobile-only">
                 <Link to="/" className="header-logo-link">
                    <img
                        src="/assets/master/logo_socdepoble_white_full.png"
                        alt="Sóc de Poble"
                        className="header-main-logo"
                    />
                </Link>
            </div>

            <div className="bar-trailing">
                <button className="bar-icon-btn" onClick={() => navigate('/cerca')}>
                    <Search size={24} />
                </button>

                <button className="bar-icon-btn llumeta" onClick={() => navigate('/ia')}>
                    <Sparkles size={24} />
                </button>

                {user && (
                    <button className="bar-icon-btn" onClick={() => navigate('/notificacions')}>
                        <Bell size={24} />
                        <span className="bar-badge">3</span>
                    </button>
                )}


                {user && (
                    <div className="bar-avatar-wrapper">
                        <Link to="/perfil" className="bar-avatar-link">
                            <div className={`bar-avatar ${simulatedRole ? 'simulating-avatar' : ''}`}>
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Perfil" />
                                ) : (
                                    <div className="profile-initials">
                                        {(profile?.full_name || user?.email || 'U').substring(0, 1).toUpperCase()}
                                    </div>
                                )}
                                {simulatedRole && (
                                    <div className="sim-indicator-badge" title={t('sim.active')}>
                                        <Zap size={10} fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                )}
            </div>
            <MasterConsole isOpen={isMasterOpen} onClose={() => setIsMasterOpen(false)} />
        </header>
    );
};

export default Header;
