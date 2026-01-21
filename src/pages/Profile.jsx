import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { User, LogOut, Camera, Save, Building2, Store, Settings, Star, Home, Bell, Lock, HelpCircle, Info, ChevronRight, MapPin, MessageCircle, Plus, Moon, Sun } from 'lucide-react';
import TownSelectorModal from '../components/TownSelectorModal';
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
    const { profile, setProfile, user, theme, toggleTheme, logout } = useAppContext();

    const [allTowns, setAllTowns] = useState([]);
    const [isEditingTown, setIsEditingTown] = useState(false);

    useEffect(() => {
        supabaseService.getTowns().then(setAllTowns);
    }, []);

    const userTown = allTowns.find(t => t.uuid === profile?.town_uuid || t.id === profile?.town_id);
    const isLoading = !user && !profile;

    if (isLoading) return <div className="profile-container">{t('common.loading')}</div>;

    // Si no hay perfil pero hay usuario, mostramos una versión "mínima" para que no se cuelgue
    const displayProfile = profile || {
        full_name: user?.email?.split('@')[0] || 'Usuari',
        avatar_url: null,
        town_id: null
    };

    const handleTownChange = async (townId) => {
        try {
            const isUuid = typeof townId === 'string' && townId.includes('-');
            const updatePayload = isUuid ? { town_uuid: townId } : { town_id: parseInt(townId) };
            const updated = await supabaseService.updateProfile(user.id, updatePayload);
            setProfile(updated);
            setIsEditingTown(false);
        } catch (error) {
            console.error('Error updating town:', error);
        }
    };

    const menuItems = [
        { icon: <MessageCircle size={20} />, label: t('nav.my_posts'), id: 'posts' },
        { icon: <Store size={20} />, label: t('nav.my_products'), id: 'products' },
        { icon: theme === 'light' ? <Moon size={20} /> : <Sun size={20} />, label: theme === 'light' ? 'Modo nit' : 'Modo dia', id: 'theme' },
        { icon: <Star size={20} />, label: t('nav.saved'), id: 'saved' },
        { icon: <Home size={20} />, label: t('nav.my_towns'), id: 'towns' },
        { icon: <Bell size={20} />, label: t('nav.profile_notifications') || 'Notificacions', id: 'notifications' },
        { icon: <HelpCircle size={20} />, label: t('nav.support'), id: 'support' },
        { icon: <Info size={20} />, label: t('nav.about'), id: 'about' }
    ];

    const handleMenuClick = (id) => {
        if (id === 'theme') {
            toggleTheme();
        } else {
            console.log('Clicked menu item:', id);
        }
    };

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
                            {displayProfile.avatar_url ? (
                                <img src={displayProfile.avatar_url} alt="Profile" />
                            ) : (
                                <User size={40} color="white" />
                            )}
                        </div>
                    </div>
                    <h2>{displayProfile.full_name || 'Usuari'}</h2>

                    {user?.isDemo && (
                        <div className="demo-badge">
                            <span>🧪 Mode Demo: Volàtil</span>
                        </div>
                    )}

                    <div className="profile-town-management">
                        <button className="main-town-btn" onClick={() => setIsEditingTown(true)}>
                            <MapPin size={18} />
                            {userTown?.name || 'Selecciona poble'}
                        </button>
                        <p className="comarca-text">{userTown ? userTown.comarca : 'Sense poble assignat'}</p>

                        <div className="additional-towns-section">
                            {/* Prototipo: Solo mostramos el principal por ahora */}
                            {allTowns.length > 0 && !displayProfile.town_id && (
                                <button className="add-town-btn-inline" onClick={() => setIsEditingTown(true)}>
                                    <Plus size={14} /> {t('nav.add_town') || 'Afegir poble'}
                                </button>
                            )}
                        </div>
                    </div>

                    <TownSelectorModal
                        isOpen={isEditingTown}
                        onClose={() => setIsEditingTown(false)}
                        onSelect={(town) => handleTownChange(town.uuid || town.id)}
                    />
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
                    <button key={item.id} className="menu-item" onClick={() => handleMenuClick(item.id)}>
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
                <button onClick={logout} className="btn-logout-minimal">
                    <LogOut size={18} />
                    {t('auth.logout')}
                </button>
                <div className="app-version">v1.1.3</div>
            </div>
        </div>
    );
};

export default Profile;
