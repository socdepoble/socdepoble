import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Search, Bell } from 'lucide-react';
import logo from '/logo.png';
import './Header.css';

const Header = () => {
    const { profile, toggleLanguage, language } = useAppContext();
    const logoSrc = '/logo_dark.png';

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo-container">
                    <img src={logoSrc} alt="Sóc de Poble" className="header-logo" />
                </Link>

                <div className="header-actions">
                    <button className="header-search-btn" onClick={() => console.log('Open search screen/popup')}>
                        <Search size={22} color="white" />
                    </button>

                    <button onClick={toggleLanguage} className="header-lang-switcher">
                        <span>{language.toUpperCase()}</span>
                    </button>

                    <Link to="/notificacions" className="header-notif-btn">
                        <Bell size={22} color="white" />
                        <span className="notif-badge">3</span>
                    </Link>

                    {profile && (
                        <Link to="/perfil" className="profile-link">
                            <div className="user-avatar-small">
                                {profile.avatar_url ? (
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
