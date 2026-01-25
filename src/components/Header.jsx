import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { logger } from '../utils/logger';
import { User, Search, Bell, Sparkles, UserCheck, Download } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { pushService } from '../services/pushService';
import { pushNotifications } from '../services/pushNotifications';
import './Header.css';

const Header = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const { language, toggleLanguage } = useI18n();
    const { visionMode, setVisionMode } = useUI();
    const navigate = useNavigate();
    const location = useLocation();

    const handleProfileClick = (e) => {
        if (location.pathname === '/perfil') {
            e.preventDefault();
            navigate(-1);
        }
    };

    const logoSrc = '/logo_dark.png';

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo-container">
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

                    {user && (
                        <Link
                            to="/perfil"
                            className="profile-link"
                            onClick={handleProfileClick}
                            aria-label={t('nav.profile') || 'El meu perfil'}
                            title={t('nav.profile') || 'El meu perfil'}
                        >
                            <div className="user-avatar-small">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name || 'Usuari'} />
                                ) : (
                                    <User size={20} color="white" aria-hidden="true" />
                                )}
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
