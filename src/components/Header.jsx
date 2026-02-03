import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { logger } from '../utils/logger';
import { User, Search, Bell, Sparkles, UserCheck, Download, Activity, ChevronRight, Store, Building2, Users, Zap, Book } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { pushService } from '../services/pushService';
import { pushNotifications } from '../services/pushNotifications';
import { supabaseService } from '../services/supabaseService';
import { useState, useEffect } from 'react';
import MasterConsole from './MasterConsole';
import MeshStar from './MeshStar';
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
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const { status = 'synced', hops = 3 } = user?.is_sovereign ? { status: 'offline', hops: 0 } : {};

    const logoSrc = '/logo.png';

    return (
        <header className="m3-top-app-bar">
            <div className="bar-leading">
                <Link to="/" className="bar-logo-link">
                    <img src={logoSrc} alt="Logo" className="bar-logo" />
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

                <button className="bar-status-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}>
                    <MeshStar status={status} hops={hops} />
                </button>

                {user && (
                    <div className="bar-avatar-wrapper">
                        <Link to="/perfil" className="bar-avatar-link">
                            <div className="bar-avatar">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Perfil" />
                                ) : (
                                    <User size={20} />
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
