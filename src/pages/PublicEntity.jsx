import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Store, Users, MapPin, MessageSquare, Share2, Loader2, AlertCircle, Calendar, ArrowLeft, UserPlus, UserMinus, Settings } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './Profile.css';
import { logger } from '../utils/logger';
import Avatar from '../components/Avatar';

const PublicEntity = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [entity, setEntity] = useState(null);
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        const fetchEntityData = async () => {
            setLoading(true);
            try {
                const entityData = await supabaseService.getPublicEntity(id);
                setEntity(entityData);

                const [membersData, postsData, itemsData, followers] = await Promise.all([
                    supabaseService.getEntityMembers(id),
                    supabaseService.getEntityPosts(id),
                    supabaseService.getEntityMarketItems(id),
                    supabaseService.getFollowers(id)
                ]);

                setMembers(membersData || []);
                setPosts(postsData || []);
                setItems(itemsData || []);
                setFollowersCount(followers?.length || 0);
            } catch (err) {
                logger.error('[PublicEntity] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEntityData();
            if (currentUser && id) {
                supabaseService.isFollowing(currentUser.id, id).then(setIsConnected);
            }
        }
    }, [id, currentUser]);

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
            <p>Carregant entitat...</p>
        </div>
    );

    if (error || !entity) return (
        <div className="profile-container error">
            <AlertCircle size={48} />
            <h3>No s'ha trobat l'entitat</h3>
            <button className="primary-btn" onClick={() => navigate('/mur')}>Tornar al mur</button>
        </div>
    );

    const getEntityIcon = (type) => {
        switch (type) {
            case 'oficial': return <Building2 size={32} />;
            case 'negoci': return <Store size={32} />;
            default: return <Users size={32} />;
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: entity.name,
            text: entity.description || `Mira l'entitat ${entity.name} a Sóc de Poble`,
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

    const handleHeaderClick = (item) => {
        const targetId = item.author_entity_id || item.author_user_id || item.author_id || item.entity_id || id;
        const type = (item.author_entity_id || item.entity_id) ? 'entitat' : 'perfil';

        if (item.author?.toLowerCase().includes('sóc de poble') ||
            item.name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        if (item.author_role === 'ambassador' || item.author_is_ai || item.is_ai) {
            navigate('/iaia');
            return;
        }

        if (targetId && targetId !== id) {
            navigate(`/${type}/${targetId}`);
        }
    };

    const getSocialImage = () => {
        switch (entity.social_image_preference) {
            case 'avatar': return entity.avatar_url;
            case 'cover': return entity.cover_url;
            default: return null;
        }
    };

    return (
        <div className="profile-container">
            <SEO
                title={entity.name}
                description={entity.description || `${entity.name} a Sóc de Poble. ${entity.type} de la Comunitat Valenciana.`}
                image={getSocialImage()}
                type="article"
            />
            <ProfileHeaderPremium
                type={entity.type === 'negoci' ? 'business' : (entity.type === 'oficial' ? 'official' : 'group')}
                title={entity.name}
                subtitle={entity.type === 'oficial' ? 'Canal Oficial' : (entity.type === 'negoci' ? 'Comerç Local' : 'Associació')}
                town={entity.town_name || 'La Torre de les Maçanes'}
                bio={entity.description}
                avatarUrl={entity.avatar_url}
                coverUrl={entity.cover_url}
                isLive={entity.type === 'negoci'}
                badges={entity.type === 'oficial' ? ['Oficial'] : (entity.is_ai ? ['IAIA'] : [])}
                onAction={members.some(m => m.user_id === currentUser?.id) ? () => navigate('/gestio-entitats', { state: { fromProfile: true } }) : null}
                actionIcon={<Settings size={24} />}
                shareData={{
                    title: entity.name,
                    text: entity.description || `Mira la pàgina de ${entity.name} a Sóc de Poble`,
                    url: window.location.href
                }}
            >
                <div className="profile-stats-bar">
                    <div className="stat-card">
                        <span className="stat-value">{posts.length}</span>
                        <span className="stat-label">Publicacions</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{entity.type === 'negoci' ? (items?.length || 0) : members.length}</span>
                        <span className="stat-label">{entity.type === 'negoci' ? 'En Venda' : 'Membres'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{followersCount}</span>
                        <span className="stat-label">Seguidors</span>
                    </div>
                </div>
            </ProfileHeaderPremium>

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
                        <><UserPlus size={22} /> CONNECTAR AMB {entity.name.toUpperCase()}</>
                    )}
                </button>

                <div className="noise-filter-manager-container">
                    <div className={`noise-filter-manager ${isConnected ? 'active' : ''}`}>
                        <div className="filter-info-stack">
                            <h4>Filtre de Soroll</h4>
                            <p>Oculta posts promocionals d'aquesta entitat al mur.</p>
                        </div>
                        <button className={`filter-action-btn ${isConnected ? 'active' : ''}`}>
                            {isConnected ? 'ACTIU' : 'INACTIU'}
                        </button>
                    </div>
                </div>
            </div>



            <div className="profile-grid-custom">
                <section className="profile-section-premium">
                    <h2 className="section-header-premium">
                        <MessageSquare size={20} />
                        Publicacions
                    </h2>
                    <div className="entity-feed">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <article key={post.uuid || post.id} className="universal-card social-post">
                                    <div className="card-header clickable" onClick={() => handleHeaderClick(post)}>
                                        <div className="header-left">
                                            <Avatar
                                                src={post.author_avatar || entity.avatar_url}
                                                role={post.author_role || entity.type}
                                                name={post.author || entity.name}
                                                size={44}
                                            />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author">{post.author || entity.name}</span>
                                                    {(post.author_role === 'ambassador' || post.author_is_ai || entity.is_ai) && (
                                                        <span className="identity-badge ai">IAIA</span>
                                                    )}
                                                </div>
                                                <div className="post-town">{entity.town_name || 'La Comunitat'}</div>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <span className="post-time-right">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <p>{post.content}</p>
                                    </div>
                                    {post.image_url && (
                                        <div className="card-image-wrapper">
                                            <img src={post.image_url} alt="Post image" />
                                        </div>
                                    )}
                                </article>
                            ))
                        ) : (
                            <p className="text-secondary">No hi ha publicacions recents.</p>
                        )}
                    </div>
                </section>

                <section className="profile-section-premium">
                    <h2 className="section-header-premium">
                        <Store size={20} />
                        Mercat
                    </h2>
                    <div className="entity-market">
                        {items.length > 0 ? (
                            items.map(item => (
                                <article key={item.uuid || item.id} className="universal-card market-item-card">
                                    <div className="card-header clickable" onClick={() => handleHeaderClick(item)}>
                                        <div className="header-left">
                                            <Avatar
                                                src={item.avatar_url || entity.avatar_url}
                                                role={item.author_role || entity.type}
                                                name={item.seller || entity.name}
                                                size={44}
                                            />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author">{item.seller || entity.name}</span>
                                                    {entity.is_ai && <span className="identity-badge ai">IAIA</span>}
                                                </div>
                                                <div className="post-town">{entity.town_name || 'La Comunitat'}</div>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <span className="post-time-right">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="market-price-row">
                                            <h3 className="item-title">{item.title}</h3>
                                            <span className="price-tag-vibrant">{item.price}</span>
                                        </div>
                                        {item.image_url && (
                                            <div className="card-image-wrapper">
                                                <img src={item.image_url} alt={item.title} />
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))
                        ) : (
                            <p className="text-secondary">No hi ha articles al mercat.</p>
                        )}
                    </div>
                </section>

                <aside className="profile-sidebar">
                    <section className="profile-section-premium">
                        <h2 className="section-header-premium">Mantenidors</h2>
                        <div className="members-list">
                            {members.map(member => (
                                <div key={member.user_id} className="member-row-mini">
                                    <img
                                        src={member.profiles.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                        alt={member.profiles.full_name}
                                        className="member-avatar-mini"
                                    />
                                    <div className="member-meta-mini">
                                        <span className="member-name-mini">{member.profiles.full_name}</span>
                                        <span className="member-role-badge">{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div >
    );
};

export default PublicEntity;
