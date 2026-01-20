import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { User, LogOut, Camera, Save, Building2, Store, Settings, Star, Home, Bell, Lock, HelpCircle, Info, ChevronRight, MapPin, MessageCircle } from 'lucide-react';
import './Profile.css';

const MyEntitiesList = ({ userId }) => {
    const [entities, setEntities] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        if (userId) {
            supabaseService.getUserEntities(userId).then(setEntities);
        }
    }, [userId]);

    if (entities.length === 0) {
        return <p className="empty-entities-message">{t('nav.empty_entities')}</p>;
    }

    return (
        <div className="entities-grid">
            {entities.map(ent => (
                <div key={ent.id} className="entity-card">
                    <div className={`entity-avatar ${ent.type}`}>
                        {ent.avatar_url ? (
                            <img src={ent.avatar_url} alt={ent.name} />
                        ) : (
                            ent.type === 'empresa' ? <Store size={20} /> : <Building2 size={20} />
                        )}
                    </div>
                    <div className="entity-info">
                        <h4>{ent.name}</h4>
                        <span className="entity-role">
                            {ent.type} • {ent.member_role}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Profile = () => {
    const { t } = useTranslation();
    const { profile, user } = useAppContext();

    if (!profile) return <div className="profile-container">{t('common.loading')}</div>;

    const menuItems = [
        { icon: <MessageCircle size={20} />, label: t('nav.my_posts'), id: 'posts' },
        { icon: <Store size={20} />, label: t('nav.my_products'), id: 'products' },
        { icon: <Star size={20} />, label: t('nav.saved'), id: 'saved' },
        { icon: <Home size={20} />, label: t('nav.my_towns'), id: 'towns' },
        { icon: <Bell size={20} />, label: t('nav.profile_notifications') || 'Notificacions', id: 'notifications' },
        { icon: <Lock size={20} />, label: t('nav.privacy'), id: 'privacy' },
        { icon: <HelpCircle size={20} />, label: t('nav.support'), id: 'support' },
        { icon: <Info size={20} />, label: t('nav.about'), id: 'about' }
    ];

    return (
        <div className="profile-container">
            <header className="profile-dashboard-header">
                <div className="header-top-actions">
                    <button className="settings-btn" onClick={() => console.log('Open settings')}>
                        <Settings size={22} />
                    </button>
                </div>

                <div className="profile-main-info">
                    <div className="avatar-wrapper">
                        <div className="avatar-big">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" />
                            ) : (
                                <User size={40} color="white" />
                            )}
                        </div>
                    </div>
                    <h2>{profile.full_name || 'Usuari'}</h2>
                    <p className="profile-location">
                        <MapPin size={14} /> Calp, Alacant
                    </p>
                </div>
            </header>

            <div className="profile-stats-bar">
                <div className="stat-card">
                    <span className="stat-value">23</span>
                    <span className="stat-label">{t('nav.stats_posts')}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">5</span>
                    <span className="stat-label">{t('nav.stats_sales')}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">142</span>
                    <span className="stat-label">{t('nav.stats_connections')}</span>
                </div>
            </div>

            <div className="profile-menu">
                {menuItems.map(item => (
                    <button key={item.id} className="menu-item">
                        <div className="menu-item-left">
                            <span className={`menu-icon ${item.id}`}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="chevron" />
                    </button>
                ))}
            </div>

            <div className="profile-entities-box">
                <h3 className="section-subtitle">{t('nav.my_entities')}</h3>
                <MyEntitiesList userId={user?.id} />
            </div>

            <div className="logout-wrapper">
                <button onClick={() => supabaseService.signOut()} className="btn-logout-minimal">
                    <LogOut size={18} />
                    {t('auth.logout')}
                </button>
            </div>
        </div>
    );
};

export default Profile;
