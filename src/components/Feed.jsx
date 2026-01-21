import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import { ROLES } from '../constants';
import CreatePostModal from './CreatePostModal';
import CategoryTabs from './CategoryTabs';
import TagSelector from './TagSelector';
import './Feed.css';

const getAvatarIcon = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return <Building2 size={20} />;
        case ROLES.BUSINESS: return <Store size={20} />;
        case ROLES.GROUPS: return <Users size={20} />;
        default: return <User size={20} />;
    }
};

const getAvatarColor = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return 'var(--color-primary)';
        case ROLES.BUSINESS: return 'var(--color-secondary)';
        case ROLES.GROUPS: return 'var(--color-accent)';
        default: return 'var(--text-muted)';
    }
};

const Feed = ({ townId = null, hideHeader = false }) => {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [userConnections, setUserConnections] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [initialIsPrivate, setInitialIsPrivate] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await supabaseService.getPosts(selectedRole, townId);
            console.log('[Feed] Posts data received:', data?.length || 0);
            const postsArray = Array.isArray(data) ? data : [];
            setPosts(postsArray);

            if (user) {
                // Cargar etiquetas del usuario para la barra de filtros
                const tagsRaw = await supabaseService.getUserTags(user.id);
                setUserTags(Array.isArray(tagsRaw) ? tagsRaw : []);

                if (postsArray.length > 0) {
                    console.log('[Feed] Fetching user connections...');
                    // Intentamos usar UUIDs si están disponibles, si no IDs
                    const postIdsForConnections = postsArray.map(p => p.uuid || p.id);
                    const connections = await supabaseService.getPostConnections(postIdsForConnections);
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
    }, [selectedRole, user, townId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const handleOpenModal = (e) => {
            setInitialIsPrivate(e.detail?.isPrivate || false);
            setIsModalOpen(true);
        };
        window.addEventListener('open-create-post', handleOpenModal);
        return () => window.removeEventListener('open-create-post', handleOpenModal);
    }, []);

    const handleConnectionUpdate = (postId, connected, tags) => {
        setUserConnections(prev => {
            if (connected) {
                const existing = prev.find(c => (c.post_uuid === postId || c.post_id === postId));
                if (existing) {
                    return prev.map(c => (c.post_uuid === postId || c.post_id === postId) ? { ...c, tags } : c);
                }
                const isUuid = typeof postId === 'string' && postId.includes('-');
                return [...prev, { [isUuid ? 'post_uuid' : 'post_id']: postId, user_id: user.id, tags }];
            }
            return prev.filter(c => (c.post_uuid !== postId && c.post_id !== postId));
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
            const connection = userConnections.find(c => c.post_uuid === post.uuid || c.post_id === post.id);
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
            {!hideHeader && (
                <header className="page-header-with-tabs">
                    <div className="header-tabs-wrapper">
                        <CategoryTabs selectedRole={selectedRole} onSelectRole={(role) => {
                            setSelectedRole(role);
                            setSelectedTag(null);
                        }} />
                    </div>

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
            )}

            <div className="feed-list">

                <CreatePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onPostCreated={fetchPosts}
                    isPrivateInitial={initialIsPrivate}
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
                        const pid = post.uuid || post.id;
                        const connection = userConnections.find(c => c.post_uuid === post.uuid || c.post_id === post.id);
                        const isConnected = !!connection;

                        return (
                            <article key={pid} className="universal-card post-card">
                                <div className="card-header">
                                    <div className="header-left">
                                        <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.author_role) }}>
                                            {getAvatarIcon(post.author_role)}
                                        </div>
                                        <div className="post-meta">
                                            <span className="post-author">{post.author}</span>
                                            <span className="post-time">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Ara'}</span>
                                        </div>
                                    </div>
                                    <button className="more-btn"><MoreHorizontal size={20} /></button>
                                </div>

                                <div className="card-content">
                                    {post.image_url && (
                                        <div className="card-image-wrapper">
                                            <img
                                                src={post.image_url}
                                                alt={`${post.author} post image`}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <p className="post-text">{post.content}</p>
                                </div>

                                <div className="card-actions-wrapper">
                                    <div className="card-actions">
                                        <button
                                            className={`action-btn ${isConnected ? 'active' : ''}`}
                                            onClick={() => handleToggleConnection(pid)}
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
                                            postId={pid}
                                            currentTags={connection.tags || []}
                                            onTagsChange={(newTags) => handleConnectionUpdate(pid, true, newTags)}
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
