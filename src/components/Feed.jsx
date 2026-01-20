import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import CreatePostModal from './CreatePostModal';
import CategoryTabs from './CategoryTabs';
import TagSelector from './TagSelector';
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

const Feed = () => {
    console.log('[Feed] Component mounting/rendering');
    const { t } = useTranslation();
    const { profile, user } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [userConnections, setUserConnections] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        console.log('[Feed] fetchPosts triggered for role:', selectedRole);
        setLoading(true);
        setError(null);
        try {
            const data = await supabaseService.getPosts(selectedRole);
            console.log('[Feed] Posts data received:', data?.length || 0);
            const postsArray = Array.isArray(data) ? data : [];
            setPosts(postsArray);

            if (user) {
                // Cargar etiquetas del usuario para la barra de filtros
                const tagsRaw = await supabaseService.getUserTags(user.id);
                setUserTags(Array.isArray(tagsRaw) ? tagsRaw : []);

                if (postsArray.length > 0) {
                    console.log('[Feed] Fetching user connections...');
                    const connections = await supabaseService.getPostConnections(postsArray.map(p => p.id));
                    const userOwnConnections = connections.filter(c => c.user_id === user.id);
                    console.log('[Feed] User connections loaded:', userOwnConnections.length);
                    setUserConnections(userOwnConnections);
                }
            }
        } catch (err) {
            console.error('[Feed] Failed to fetch feed:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log('[Feed] Loading sequence finished');
        }
    }, [selectedRole, user]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleConnectionUpdate = (postId, connected, tags) => {
        setUserConnections(prev => {
            if (connected) {
                const existing = prev.find(c => c.post_id === postId);
                if (existing) {
                    return prev.map(c => c.post_id === postId ? { ...c, tags } : c);
                }
                return [...prev, { post_id: postId, user_id: user.id, tags }];
            }
            return prev.filter(c => c.post_id !== postId);
        });

        // Actualizar el diccionario local si hay etiquetas nuevas
        if (tags && user) {
            tags.forEach(tag => {
                if (!userTags.includes(tag)) {
                    setUserTags(prev => [...prev, tag].sort());
                }
            });
        }
    };

    const handleToggleConnection = async (postId) => {
        if (!user) return;
        try {
            const result = await supabaseService.togglePostConnection(postId, user.id);
            handleConnectionUpdate(postId, result.connected, result.tags || []);
        } catch (error) {
            console.error('[Feed] Error toggling connection:', error);
        }
    };

    // Filtrado local por etiquetas personales
    const filteredPosts = selectedTag
        ? posts.filter(post => {
            const connection = userConnections.find(c => c.post_id === post.id);
            return connection && connection.tags && connection.tags.includes(selectedTag);
        })
        : posts;

    if (loading && posts.length === 0) {
        return (
            <div className="feed-container loading">
                <Loader2 className="spinner" />
                <p>{t('feed.loading_feed') || 'Carregant el mur...'}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feed-container error-state">
                <AlertCircle size={48} color="var(--color-primary)" />
                <h3>Ha ocurregut un error</h3>
                <p>{error}</p>
                <button className="primary-btn" onClick={fetchPosts}>Tornar a intentar</button>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <header className="page-header-with-tabs">
                <h1 className="feed-title">{t('feed.title') || 'Mur'}</h1>
                <CategoryTabs selectedRole={selectedRole} onSelectRole={(role) => {
                    setSelectedRole(role);
                    setSelectedTag(null);
                }} />

                {user && userTags.length > 0 && (
                    <div className="personal-tag-bar">
                        <button
                            className={`tag-filter-btn ${!selectedTag ? 'active' : ''}`}
                            onClick={() => setSelectedTag(null)}
                        >
                            {t('feed.all') || 'Tots'}
                        </button>
                        {userTags.map(tag => (
                            <button
                                key={tag}
                                className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <div className="feed-list">
                {!selectedTag && (
                    <div className="feed-input-trigger" onClick={() => setIsModalOpen(true)}>
                        <div className="user-avatar-small">
                            {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" /> : <User size={20} />}
                        </div>
                        <input type="text" placeholder={t('feed.placeholder') || 'Què vols compartir?'} readOnly />
                    </div>
                )}

                <CreatePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onPostCreated={fetchPosts}
                />

                {filteredPosts.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-message">
                            {selectedTag
                                ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                : (t('feed.empty') || 'No hi ha novetats al mur.')
                            }
                        </p>
                        {selectedTag && (
                            <button className="secondary-btn" onClick={() => setSelectedTag(null)}>
                                {t('feed.show_all') || 'Veure tot'}
                            </button>
                        )}
                    </div>
                ) : (
                    filteredPosts.map(post => {
                        const connection = userConnections.find(c => c.post_id === post.id);
                        const isConnected = !!connection;

                        return (
                            <article key={post.id} className="post-card">
                                <div className="card-header">
                                    <div className="header-left">
                                        <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.avatar_type) }}>
                                            {getAvatarIcon(post.avatar_type)}
                                        </div>
                                        <div className="post-meta">
                                            <span className="post-author">{post.author}</span>
                                            <span className="post-time">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Ara'}</span>
                                        </div>
                                    </div>
                                    <button className="more-btn"><MoreHorizontal size={20} /></button>
                                </div>

                                <div className="card-content">
                                    <p>{post.content}</p>
                                    {post.image_url && (
                                        <div className="post-image">
                                            <img src={post.image_url} alt="Post content" />
                                        </div>
                                    )}
                                </div>

                                <div className="card-actions-wrapper">
                                    <div className="card-actions">
                                        <button
                                            className={`action-btn ${isConnected ? 'active' : ''}`}
                                            onClick={() => handleToggleConnection(post.id)}
                                        >
                                            <Link2 size={20} />
                                            <span>{isConnected ? (post.connections_count + 1 || 1) : (post.connections_count || 0)}</span>
                                        </button>
                                        <button className="action-btn">
                                            <MessageCircle size={20} />
                                            <span>{post.comments_count || 0}</span>
                                        </button>
                                        <button className="action-btn"><Share2 size={20} /></button>
                                    </div>

                                    {isConnected && (
                                        <TagSelector
                                            postId={post.id}
                                            currentTags={connection.tags || []}
                                            onTagsChange={(newTags) => handleConnectionUpdate(post.id, true, newTags)}
                                        />
                                    )}
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Feed;
