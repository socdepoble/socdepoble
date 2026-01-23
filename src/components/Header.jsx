import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { logger } from '../utils/logger';
import { User, Search, Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const { language, toggleLanguage } = useI18n();
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
                        onClick={() => logger.log('Open search screen/popup')}
                        aria-label={t('common.search') || 'Buscar'}
                    >
                        <Search size={22} color="white" />
                    </button>

                    <button onClick={toggleLanguage} className="header-lang-switcher">
                        <span>{language.toUpperCase()}</span>
                    </button>

                    <Link
                        to={user ? "/notificacions" : "/login"}
                        className="header-notif-btn"
                    >
                        <Bell size={22} color="white" />
                        {user && <span className="notif-badge">3</span>}
                    </Link>

                    {user && (
                        <Link to="/perfil" className="profile-link">
                            <div className="user-avatar-small">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} />
                                ) : (
                                    <User size={20} color="white" />
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
