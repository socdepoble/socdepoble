import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { logger } from '../utils/logger';
import { User, Search, Bell, Sparkles, UserCheck, Download, Activity, ChevronRight, Store, Building2, Users } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { pushService } from '../services/pushService';
import { pushNotifications } from '../services/pushNotifications';
import { supabaseService } from '../services/supabaseService';
import { useState, useEffect } from 'react';
import './Header.css';

const ContextMenu = () => {
    const { profile, realProfile, activeEntityId, switchContext } = useAuth();
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
        </div>
    );
};

const Header = () => {
    const { t } = useTranslation();
    const { user, profile, isAdmin, activeEntityId } = useAuth();
    const { language, toggleLanguage } = useI18n();
    const { visionMode, setVisionMode } = useUI();
    const navigate = useNavigate();
    const location = useLocation();

    const handleProfileClick = (e) => {
        if (location.pathname === '/perfil') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const logoSrc = '/logo.png';

    return (
        <header className="main-header">
            <div className="header-content">
                <Link
                    to="/"
                    className="logo-container"
                    onClick={(e) => {
                        if (e.detail >= 3) {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('open-diagnostic-hud'));
                        }
                    }}
                >
                    <img src={logoSrc} alt="Sóc de Poble" className="header-logo" />
                </Link>

                <div className="header-actions">
                    <button
                        className="header-search-btn"
                        onClick={() => navigate('/cerca')}
                        aria-label={t('common.search') || 'Buscar'}
                    >
                        <Search size={22} color="white" />
                    </button>

                    {isAdmin && (
                        <button
                            className="header-admin-btn"
                            onClick={() => navigate('/admin')}
                            aria-label="Admin Panel"
                            title="Panell d'Administració"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                        >
                            <UserCheck size={22} color="#FFD700" />
                        </button>
                    )}


                    <button
                        onClick={toggleLanguage}
                        className="header-lang-switcher"
                        aria-label={t('common.change_language') || 'Canviar idioma'}
                        title={t('common.change_language') || 'Canviar idioma'}
                    >
                        <span aria-hidden="true">{language.toUpperCase()}</span>
                    </button>

                    <button
                        className={`header-vision-toggle ${visionMode}`}
                        onClick={async () => {
                            const nextMode = visionMode === 'hibrida' ? 'humana' : 'hibrida';
                            setVisionMode(nextMode);

                            if (nextMode === 'humana' && user) {
                                try {
                                    const subscription = await pushService.getSubscription();
                                    if (subscription) {
                                        await pushNotifications.removeSubscription(user.id, subscription.endpoint);
                                        await pushService.unsubscribe();
                                        logger.info('[Header] Push subscription cleaned up after disabling IAIA');
                                    }
                                } catch (err) {
                                    logger.error('[Header] Error cleaning up push:', err);
                                }
                            }
                        }}
                        aria-label="Canviar mode de visió"
                        title={visionMode === 'hibrida' ? 'Mode Híbrid actiu' : 'Mode Humà actiu'}
                    >
                        {visionMode === 'hibrida' ? <Sparkles size={20} color="var(--color-primary)" /> : <UserCheck size={20} color="#888" />}
                    </button>

                    <Link
                        to={user ? "/notificacions" : "/login"}
                        className="header-notif-btn"
                        aria-label={t('nav.notifications') || 'Notificacions'}
                        title={t('nav.notifications') || 'Notificacions'}
                    >
                        <Bell size={22} color="white" aria-hidden="true" />
                        {user && <span className="notif-badge" aria-label="3 notificacions pendents">3</span>}
                    </Link>

                    <button
                        className="header-diagnostic-btn"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                        aria-label="Obrir Consola de Diagnòstic"
                        title="Consola Didàctica"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}
                    >
                        <Activity size={22} color="#00f2ff" />
                    </button>

                    {user && (
                        <div className="context-switcher-wrapper">
                            <Link
                                to="/perfil"
                                className={`profile-link ${activeEntityId ? 'active-context' : ''}`}
                                onClick={(e) => {
                                    handleProfileClick(e);
                                    // Toggle context menu on avatar click
                                    const evt = new CustomEvent('toggle-context-menu');
                                    window.dispatchEvent(evt);
                                }}
                                aria-label={t('nav.profile') || 'El meu perfil'}
                                title={t('nav.profile') || 'El meu perfil'}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    const evt = new CustomEvent('toggle-context-menu');
                                    window.dispatchEvent(evt);
                                }}
                            >
                                <div className="user-avatar-small">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name || 'Usuari'} />
                                    ) : (
                                        <User size={20} color="white" aria-hidden="true" />
                                    )}
                                </div>
                            </Link>

                            <ContextMenu />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
