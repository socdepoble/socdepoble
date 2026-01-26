import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Calendar, Settings, ChevronRight, Loader2, AlertCircle, Building2, Store, Users as UsersIcon, ArrowLeft, UserPlus, UserMinus, Plus, Layout, Activity } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { logger } from '../utils/logger';
import Feed from '../components/Feed';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import Avatar from '../components/Avatar';
import './Profile.css';

const PublicProfile = () => {
    const { id, username } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { setIsSocialManagerOpen, setSocialManagerContext } = useUI();
    const [profile, setProfile] = useState(null);
    const [managedEntities, setManagedEntities] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const isOwnProfile = currentUser?.id === id || currentUser?.username === username;

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Determine if we have a username or ID
                let profileId = id;

                if (username) {
                    // Fetch by username
                    const profileData = await supabaseService.getUserByUsername(username);
                    if (!profileData) {
                        setError('Usuari no trobat');
                        setLoading(false);
                        return;
                    }
                    profileId = profileData.id;
                    setProfile(profileData);
                } else {
                    // Fetch by ID
                    const data = await supabaseService.getPublicProfile(profileId);
                    setProfile(data);
                }

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
    }, [id, username, isOwnProfile, currentUser]);

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
                    // Proactive UX: Open social manager to tag the new connection
                    setSocialManagerContext({ type: 'person', id: profile.id, name: profile.full_name });
                    setIsSocialManagerOpen(true);
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

    // Share function removed as it was unused. Can be restored if needed.

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
                url={profile.username ? `/@${profile.username}` : `/perfil/${profile.id}`}
                type="profile"
                structuredData={{
                    "@type": profile.role === 'admin' || profile.role === 'entitat' ? "Organization" : "Person",
                    "name": profile.full_name,
                    "description": profile.bio,
                    "image": getSocialImage() || profile.avatar_url,
                    "url": window.location.href,
                    "jobTitle": profile.ofici || profile.role,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": profile.town_name || "Comunitat Valenciana"
                    }
                }}
            />
            <ProfileHeaderPremium
                type="person"
                title={profile.full_name}
                subtitle={profile.ofici ? (profile.ofici.charAt(0).toUpperCase() + profile.ofici.slice(1)) : (profile.role === 'ambassador' ? 'Ambaixador' : (profile.role && profile.role !== 'user' ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : 'Veí'))}
                town={profile.town_name || 'La Torre de les Maçanes'}
                bio={profile.bio}
                avatarUrl={profile.avatar_url}
                coverUrl={profile.cover_url}
                badges={profile.id?.startsWith('11111111-1a1a') ? ['INTEL·LIGÈNCIA'] : (profile.role === 'ambassador' ? ['IAIA'] : [])}
                onAction={isOwnProfile ? () => navigate('/perfil', { state: { fromProfile: true } }) : null}
                actionIcon={<Settings size={24} />}
                shareData={{
                    title: profile.full_name,
                    text: profile.bio || `Mira el perfil de ${profile.full_name} a Sóc de Poble`,
                    url: window.location.href
                }}
            >
                <div className="profile-stats-bar">
                    <div className="stat-card">
                        <span className="stat-value">{userPosts.length}</span>
                        <span className="stat-label">{t('profile.publications')}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{items.length}</span>
                        <span className="stat-label">{t('nav.stats_sales')}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{followersCount}</span>
                        <span className="stat-label">Connexions</span>
                    </div>
                </div>
            </ProfileHeaderPremium>

            {
                !isOwnProfile && (
                    <div className="profile-actions-premium-fullwidth">
                        <button
                            className={`connect-btn-premium-full ${isConnected ? 'connected' : ''}`}
                            onClick={handleConnect}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <Loader2 className="spinner" size={24} />
                            ) : isConnected ? (
                                <><UserMinus size={22} /> DESCONECTAR</>
                            ) : (
                                <><UserPlus size={22} /> CONNECTAR AMB {profile.full_name?.split(' ')[0].toUpperCase()}</>
                            )}
                        </button>

                        <div className="noise-filter-manager-container">
                            <div className={`noise-filter-manager ${isConnected ? 'active' : ''}`}>
                                <div className="filter-info-stack">
                                    <h4>Filtre de Soroll</h4>
                                    <p>Oculta posts promocionals d'aquest perfil al mur.</p>
                                </div>
                                <button className={`filter-action-btn ${isConnected ? 'active' : ''}`}>
                                    {isConnected ? 'ACTIU' : 'INACTIU'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isOwnProfile && managedEntities.length > 0 && (
                    <section className="profile-section-premium managed-pages-section">
                        <h2 className="section-header-premium">
                            <Layout size={20} />
                            Gestió de Pàgines
                        </h2>
                        <div className="entities-scroll-container">
                            {managedEntities.map(entity => (
                                <Link to={`/entitat/${entity.id}`} key={entity.id} className="entity-card-modern">
                                    <div className={`entity-avatar-modern ${entity.type}`}>
                                        {entity.avatar_url ? (
                                            <img src={entity.avatar_url} alt={entity.name} />
                                        ) : (
                                            entity.type === 'oficial' ? <Building2 size={24} /> :
                                                entity.type === 'negoci' ? <Store size={24} /> : <UsersIcon size={24} />
                                        )}
                                        <span className="manage-badge"><Settings size={12} /></span>
                                    </div>
                                    <div className="entity-info">
                                        <h4>{entity.name}</h4>
                                        <span className="entity-role">
                                            {entity.type === 'negoci' ? 'Negoci Local' : (entity.type === 'oficial' ? 'Ajuntament / Oficial' : 'Associació')}
                                        </span>
                                        <div className="entity-meta">
                                            <span className={`role-pill ${entity.member_role}`}>
                                                {entity.member_role === 'admin' ? 'Administrador' : 'Membre'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <div className="entity-card-create" onClick={() => navigate('/gestio-entitats')}>
                                <div className="create-icon-area">
                                    <Plus size={24} />
                                </div>
                                <div className="entity-info">
                                    <h4>Nova</h4>
                                    <span className="entity-role">Pàgina</span>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }

            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <UsersIcon size={20} />
                    {t('profile.publications')}
                </h2>
                <div className="profile-feed-wrapper">
                    {userPosts.length > 0 ? (
                        <Feed townId={null} hideHeader={true} customPosts={userPosts} />
                    ) : (
                        <div className="empty-state-premium">
                            <Activity size={40} className="empty-icon" />
                            <p>El mur de {profile.full_name.split(' ')[0]} encara està tranquil.</p>
                            <span className="empty-subtext">Torna prompte per a veure novetats!</span>
                        </div>
                    )}
                </div>
            </section>

            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <Store size={20} />
                    {t('profile.market')}
                </h2>
                <div className="profile-feed-wrapper market-grid-profile">
                    {items.length > 0 ? (
                        <div className="market-grid">
                            {items.map(item => (
                                <article key={item.uuid || item.id} className="universal-card market-item-card">
                                    <div
                                        className="card-header clickable"
                                        onClick={() => {
                                            if (item.author_entity_id) navigate(`/entitat/${item.author_entity_id}`);
                                            else if (id) navigate(`/perfil/${id}`);
                                        }}
                                    >
                                        <div className="header-left">
                                            <Avatar
                                                src={item.avatar_url || profile.avatar_url}
                                                role={item.author_role || profile.role}
                                                name={item.seller || profile.full_name}
                                                size={44}
                                            />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author">
                                                        {item.seller || item.author_name || profile.full_name || 'Venedor'}
                                                    </span>
                                                    {(item.author_role === 'ambassador' || item.author_is_ai || profile.role === 'ambassador') && (
                                                        <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                                    )}
                                                </div>
                                                <div className="post-town">
                                                    {item.towns?.name || item.town_name || item.location || profile.town_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <span className="post-time-right">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Avui'}
                                            </span>
                                        </div>
                                    </div>

                                    {item.image_url && (
                                        <div className="card-image-wrapper">
                                            <img src={item.image_url} alt={item.title} />
                                        </div>
                                    )}

                                    <div className="card-body">
                                        <div className="market-price-row">
                                            <h3 className="item-title">{item.title}</h3>
                                            <span className="price-tag-vibrant">{item.price}</span>
                                        </div>
                                        <p className="item-desc-premium">{item.description || t('market.no_description')}</p>
                                    </div>

                                    <div className="card-footer-vibrant">
                                        <button className="add-btn-premium-vibrant full-width" onClick={() => navigate('/chats')}>
                                            <Plus size={20} />
                                            <span>{t('market.interested')}</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-premium">
                            <Store size={40} className="empty-icon" />
                            <p>{profile.full_name.split(' ')[0]} no té res a la venda ara mateix.</p>
                            <span className="empty-subtext">Descobreix més joies en el Mercat general.</span>
                        </div>
                    )}
                </div>
            </section>
        </div >
    );
};

export default PublicProfile;
