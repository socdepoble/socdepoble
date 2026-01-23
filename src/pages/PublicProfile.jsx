import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Calendar, Settings, ChevronRight, Loader2, AlertCircle, Building2, Store, Users as UsersIcon, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import Feed from '../components/Feed';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './Profile.css';

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
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

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

                const [postsData, itemsData, followers] = await Promise.all([
                    supabaseService.getUserPosts(id),
                    supabaseService.getUserMarketItems(id),
                    supabaseService.getFollowers(id)
                ]);

                setUserPosts(postsData || []);
                setItems(itemsData || []);
                setFollowersCount(followers?.length || 0);
            } catch (err) {
                logger.error('[PublicProfile] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfileData();
            if (currentUser && id !== currentUser.id) {
                supabaseService.isFollowing(currentUser.id, id).then(setIsConnected);
            }
        }
    }, [id, isOwnProfile, currentUser]);

    const handleConnect = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setIsConnecting(true);
        try {
            if (isConnected) {
                const success = await supabaseService.disconnectFromProfile(currentUser.id, id);
                if (success) {
                    setIsConnected(false);
                    setFollowersCount(prev => Math.max(0, prev - 1));
                }
            } else {
                const success = await supabaseService.connectWithProfile(currentUser.id, id);
                if (success) {
                    setIsConnected(true);
                    setFollowersCount(prev => prev + 1);
                }
            }
        } catch (err) {
            logger.error('Error handling connection:', err);
        } finally {
            setIsConnecting(false);
        }
    };

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

    const handleShare = async () => {
        const shareData = {
            title: profile.full_name,
            text: profile.bio || `Mira el perfil de ${profile.full_name} a Sóc de Poble`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Enllaç copiat al porta-retalls');
            }
        } catch (err) {
            logger.error('Error sharing:', err);
        }
    };

    const getSocialImage = () => {
        switch (profile.social_image_preference) {
            case 'avatar': return profile.avatar_url;
            case 'cover': return profile.cover_url;
            default: return null; // SEO component will use default logo
        }
    };

    return (
        <div className="profile-container">
            <SEO
                title={profile.full_name}
                description={profile.bio || `${profile.full_name} a Sóc de Poble. ${profile.role || 'Veí de la Comunitat'}.`}
                image={getSocialImage()}
                type="profile"
            />
            <ProfileHeaderPremium
                type="person"
                title={profile.full_name}
                subtitle={profile.role === 'ambassador' ? 'Ambaixador' : 'Veí'}
                town={profile.town_name || 'La Torre de les Maçanes'}
                bio={profile.bio}
                avatarUrl={profile.avatar_url}
                coverUrl={profile.cover_url}
                badges={profile.role === 'ambassador' ? ['IAIA'] : []}
                onAction={isOwnProfile ? () => navigate('/perfil', { state: { fromProfile: true } }) : null}
                actionIcon={<Settings size={24} />}
                onShare={handleShare}
            >
                {!isOwnProfile && (
                    <div className="profile-actions-inline">
                        <button
                            className={`connect-btn-inline-vibrant ${isConnected ? 'connected' : ''}`}
                            onClick={handleConnect}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <Loader2 className="spinner" size={18} />
                            ) : isConnected ? (
                                <><UserMinus size={18} /> DESCONECTAR</>
                            ) : (
                                <><UserPlus size={18} /> CONECTAR</>
                            )}
                        </button>
                    </div>
                )}

                <div className="profile-stats-bar">
                    <div className="stat-card">
                        <span className="stat-value">{userPosts.length}</span>
                        <span className="stat-label">Publicacions</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{items.length}</span>
                        <span className="stat-label">En Venda</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{followersCount}</span>
                        <span className="stat-label">Connexions</span>
                    </div>
                </div>
            </ProfileHeaderPremium>

            {
                isOwnProfile && managedEntities.length > 0 && (
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
                )
            }

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
