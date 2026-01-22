import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Store, Users, MapPin, MessageSquare, Share2, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './Profile.css';

const PublicEntity = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAppContext();
    const [entity, setEntity] = useState(null);
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntityData = async () => {
            setLoading(true);
            try {
                const entityData = await supabaseService.getPublicEntity(id);
                setEntity(entityData);

                const [membersData, postsData, itemsData] = await Promise.all([
                    supabaseService.getEntityMembers(id),
                    supabaseService.getEntityPosts(id),
                    supabaseService.getEntityMarketItems(id)
                ]);

                setMembers(membersData);
                setPosts(postsData);
                setItems(itemsData);
            } catch (err) {
                console.error('[PublicEntity] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEntityData();
    }, [id]);

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
            <div className="profile-header-premium entity-header">
                <div className="profile-avatar-wrapper entity-avatar-wrapper">
                    {entity.avatar_url ? (
                        <img src={entity.avatar_url} alt={entity.name} className="profile-avatar-large entity-thumb" />
                    ) : (
                        <div className="avatar-placeholder-large">{getEntityIcon(entity.type)}</div>
                    )}
                </div>
                <div className="profile-info-main">
                    <h1 className="heading-xl">{entity.name}</h1>
                    <div className="profile-stats-row">
                        <div className="profile-stat-item">
                            <MapPin size={18} />
                            <span>La Torre de les Maçanes</span>
                        </div>
                        <div className="profile-stat-item">
                            <Users size={18} />
                            <span>{members.length} col·laboradors</span>
                        </div>
                    </div>
                </div>
                <div className="entity-actions-header">
                    <button className="connect-btn-vibrant">
                        Connectar
                    </button>
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
