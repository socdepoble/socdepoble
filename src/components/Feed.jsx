import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './Feed.css';

const getAvatarIcon = (type) => {
    switch (type) {
        case 'gov': return <Building2 size={20} />;
        case 'shop': return <Store size={20} />;
        case 'group': return <Users size={20} />;
        case 'coop': return <Store size={20} />;
        default: return <User size={20} />;
    }
};

const getAvatarColor = (type) => {
    switch (type) {
        case 'gov': return 'var(--color-primary)';
        case 'shop': return 'var(--color-secondary)';
        case 'group': return 'var(--color-accent)';
        case 'coop': return '#6B705C';
        default: return '#999';
    }
};

import CategoryTabs from './CategoryTabs';

const Feed = () => {
    const { t } = useTranslation();
    const { user, profile } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userConnections, setUserConnections] = useState({}); // { postId: boolean }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getPosts(selectedRole);
            setPosts(data);

            // Si hay usuario, cargar sus conexiones
            if (user) {
                const connectionsState = {};
                for (const post of data) {
                    try {
                        const connections = await supabaseService.getPostConnections(post.id);
                        connectionsState[post.id] = connections.includes(user.id);
                    } catch (error) {
                        console.error(`Error loading connections for post ${post.id}:`, error);
                        connectionsState[post.id] = false;
                    }
                }
                setUserConnections(connectionsState);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedRole, user]);

    useEffect(() => {
        fetchPosts();
    }, [selectedRole, fetchPosts]);

    const handleConnect = async (postId) => {
        if (!user) return alert('Debes iniciar sesión para conectar');

        try {
            const { connected } = await supabaseService.togglePostConnection(postId, user.id);
            setUserConnections(prev => ({ ...prev, [postId]: connected }));

            // Actualizar contador localmente (usando el nuevo campo connections_count o fallback a likes si no existe aun)
            setPosts(prev => prev.map(p =>
                p.id === postId ? {
                    ...p,
                    connections_count: (p.connections_count || 0) + (connected ? 1 : -1)
                } : p
            ));
        } catch (error) {
            console.error('Error toggling connection:', error);
        }
    };

    if (loading && posts.length === 0) { // Solo spinner si no hay posts previos (para cambio de tab suave)
        return (
            <div className="feed-container loading">
                <Loader2 className="spinner" />
                <p>{t('feed.loading_feed')}</p>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <header className="page-header-with-tabs">
                <h1>{t('feed.title')}</h1>
                <CategoryTabs selectedRole={selectedRole} onSelectRole={setSelectedRole} />
            </header>

            <div className="feed-list">
                <div className="feed-input-trigger" onClick={() => setIsModalOpen(true)}>
                    <div className="user-avatar-small">
                        {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" /> : <User size={20} />}
                    </div>
                    <input type="text" placeholder={t('feed.placeholder')} readOnly />
                </div>

                <CreatePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onPostCreated={fetchPosts}
                />

                {posts.length === 0 ? (
                    <p className="empty-message">{t('feed.empty')}</p>
                ) : (
                    posts.map(post => (
                        <article key={post.id} className="post-card">
                            <div className="card-header">
                                <div className="header-left">
                                    <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.avatar_type) }}>
                                        {getAvatarIcon(post.avatar_type)}
                                    </div>
                                    <div className="post-meta">
                                        <span className="post-author">{post.author}</span>
                                        <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button className="more-btn">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="card-content">
                                <p>{post.content}</p>
                                {post.image_url && (
                                    <div className="post-image">
                                        <img src={post.image_url} alt="Post content" />
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                <button
                                    className={`action-btn ${userConnections[post.id] ? 'connected' : ''}`}
                                    onClick={() => handleConnect(post.id)}
                                >
                                    <Link2 size={20} />
                                    <span>{post.connections_count || 0}</span>
                                </button>
                                <button className="action-btn">
                                    <MessageCircle size={20} />
                                    <span>{post.comments_count}</span>
                                </button>
                                <button className="action-btn">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;
