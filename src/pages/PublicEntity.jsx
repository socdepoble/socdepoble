import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Store, Users, MapPin, MessageSquare, Share2, Loader2, AlertCircle, Calendar, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './Profile.css';

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
            console.error('Error handling connection:', err);
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

    return (
        <div className="profile-container">
            <SEO
                title={entity.name}
                description={entity.description || `${entity.name} a Sóc de Poble. ${entity.type} de la Comunitat Valenciana.`}
                image={entity.avatar_url}
                type="article"
            />
            <ProfileHeaderPremium
                type={entity.type === 'negoci' ? 'business' : (entity.type === 'oficial' ? 'official' : 'group')}
                title={entity.name}
                subtitle={entity.type === 'oficial' ? 'Canal Oficial' : (entity.type === 'negoci' ? 'Comerç Local' : 'Associació')}
                bio={entity.description}
                avatarUrl={entity.avatar_url}
                coverUrl={entity.cover_url}
                isLive={entity.type === 'negoci'} // Simplified live status
                badges={entity.type === 'oficial' ? ['Oficial'] : (entity.is_ai ? ['IAIA'] : [])}
                stats={[
                    { label: 'Poble', value: entity.town_name || 'La Torre', icon: <MapPin size={18} /> },
                    { label: 'Seguidors', value: followersCount.toString(), icon: <Users size={18} /> }
                ]}
            />

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

            <div className="profile-grid-custom">
                <section className="profile-section-premium">
                    <h2 className="section-header-premium">
                        <MessageSquare size={20} />
                        Publicacions
                    </h2>
                    <div className="entity-feed">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <div key={post.uuid || post.id} className="mini-post-card">
                                    <p>{post.content}</p>
                                    <span className="post-date-small">
                                        <Calendar size={12} />
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
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
        </div>
    );
};

export default PublicEntity;
