import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Calendar, Layout, Settings, ChevronRight, Loader2, AlertCircle, Building2, Store, Users as UsersIcon, ArrowLeft } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import Feed from '../components/Feed';
import './Profile.css'; // Reuse profile base styles

const PublicProfile = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [managedEntities, setManagedEntities] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = currentUser?.id === id;

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const data = await supabaseService.getPublicProfile(id);
                setProfile(data);

                if (isOwnProfile) {
                    const entities = await supabaseService.getUserEntities(id);
                    setManagedEntities(entities);
                }

                const [postsData, itemsData] = await Promise.all([
                    supabaseService.getUserPosts(id),
                    supabaseService.getUserMarketItems(id)
                ]);

                setUserPosts(postsData);
                setItems(itemsData);
            } catch (err) {
                logger.error('[PublicProfile] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfileData();
    }, [id, isOwnProfile]);

    if (loading) return (
        <div className="profile-container loading">
            <Loader2 className="spinner" />
            <p>Carregant perfil...</p>
        </div>
    );

    if (error || !profile) return (
        <div className="profile-container error">
            <AlertCircle size={48} />
            <h3>No s'ha trobat el perfil</h3>
            <button className="primary-btn" onClick={() => navigate('/mur')}>Tornar al mur</button>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-header-premium">
                <div className="header-top-actions floating">
                    <button className="giga-back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={30} />
                    </button>
                </div>
                <div className="profile-avatar-wrapper">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="profile-avatar-large" />
                    ) : (
                        <div className="avatar-placeholder-large"><User size={48} /></div>
                    )}
                </div>
                <div className="profile-info-main">
                    <h1 className="heading-xl">{profile.full_name}</h1>
                    <p className="profile-bio-vibrant">{profile.bio}</p>
                    <div className="profile-stats-row">
                        <div className="profile-stat-item">
                            <MapPin size={18} />
                            <span>{profile.town_name || 'La Torre de les Maçanes'}</span>
                        </div>
                        <div className="profile-stat-item">
                            <Calendar size={18} />
                            <span>Membre des de {new Date(profile.created_at).getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isOwnProfile && managedEntities.length > 0 && (
                <section className="profile-section-premium">
                    <h2 className="section-header-premium">
                        <Layout size={20} />
                        Gestió de Pàgines
                    </h2>
                    <div className="entities-grid-mini">
                        {managedEntities.map(entity => (
                            <Link to={`/entitat/${entity.id}`} key={entity.id} className="entity-manage-card">
                                <div className="entity-icon-small">
                                    {entity.type === 'oficial' ? <Building2 size={24} /> :
                                        entity.type === 'negoci' ? <Store size={24} /> : <UsersIcon size={24} />}
                                </div>
                                <div className="entity-info-mini">
                                    <span className="entity-name-mini">{entity.name}</span>
                                    <span className="entity-role-mini">{entity.member_role}</span>
                                </div>
                                <ChevronRight size={20} />
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <Store size={20} />
                    Mercat
                </h2>
                <div className="profile-feed-wrapper">
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.uuid || item.id} className="mini-post-card entity-item-card">
                                <div className="item-mini-content">
                                    <div className="item-mini-text">
                                        <span className="item-mini-title">{item.title}</span>
                                        <span className="item-mini-price">{item.price}</span>
                                    </div>
                                    {item.image_url && <img src={item.image_url} alt={item.title} className="item-mini-img" />}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state-mini">
                            <p>No hi ha articles al mercat de {profile.full_name.split(' ')[0]}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <UsersIcon size={20} />
                    Activitat Recent
                </h2>
                <div className="profile-feed-wrapper">
                    {userPosts.length > 0 ? (
                        <Feed townId={null} hideHeader={true} customPosts={userPosts} />
                    ) : (
                        <div className="empty-state-mini">
                            <p>No hi ha publicacions de {profile.full_name.split(' ')[0]}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PublicProfile;
