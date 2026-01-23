import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import { logger } from '../utils/logger';
import CreatePostModal from './CreatePostModal';
import CategoryTabs from './CategoryTabs';
import TagSelector from './TagSelector';
import PostSkeleton from './Skeletons/PostSkeleton';
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
    const navigate = useNavigate();
    const { user, isPlayground } = useAuth();
    const [posts, setPosts] = useState([]);
    const [userConnections, setUserConnections] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [initialIsPrivate, setInitialIsPrivate] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async (isLoadMore = false) => {
        let isMounted = true;
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);
        setError(null);
        try {
            const currentPage = isLoadMore ? page + 1 : 0;
            const result = await supabaseService.getPosts(selectedRole, townId, currentPage, 10, isPlayground);
            if (!isMounted) return;

            const postsArray = result.data;
            const totalCount = result.count;

            if (isLoadMore) {
                setPosts(prev => [...prev, ...postsArray]);
                setPage(currentPage);
            } else {
                setPosts(postsArray);
                setPage(0);
            }

            setHasMore(posts.length + postsArray.length < totalCount);

            if (user) {
                // Cargar etiquetas del usuario para la barra de filtros
                const tagsRaw = await supabaseService.getUserTags(user.id);
                if (!isMounted) return;
                setUserTags(Array.isArray(tagsRaw) ? tagsRaw : []);

                if (postsArray.length > 0) {
                    logger.log('[Feed] Fetching user connections...');
                    const postUuids = postsArray.map(p => p.uuid);
                    const connections = await supabaseService.getPostConnections(postUuids);
                    if (!isMounted) return;
                    const userOwnConnections = connections.filter(c => c.user_id === user.id);
                    logger.log('[Feed] User connections loaded:', userOwnConnections.length);
                    setUserConnections(prev => isLoadMore ? [...prev, ...userOwnConnections] : userOwnConnections);
                }
            }
        } catch (err) {
            if (isMounted) {
                logger.error('[Feed] Failed to fetch feed:', err);
                setError(err.message);
            }
        } finally {
            if (isMounted) {
                setLoading(false);
                setLoadingMore(false);
                logger.log('[Feed] Loading sequence finished');
            }
        }
        return () => { isMounted = false; };
    }, [selectedRole, user, townId, page]);

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
                const existing = prev.find(c => c.post_uuid === postId);
                if (existing) {
                    return prev.map(c => c.post_uuid === postId ? { ...c, tags } : c);
                }
                return [...prev, { post_uuid: postId, user_id: user.id, tags }];
            }
            return prev.filter(c => c.post_uuid !== postId);
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
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const result = await supabaseService.togglePostConnection(postId, user.id, isPlayground);
            handleConnectionUpdate(postId, result.connected, result.tags || []);
        } catch (error) {
            logger.error('[Feed] Error toggling connection:', error);
        }
    };

    // Filtrado local por etiquetas personales
    const filteredPosts = selectedTag
        ? posts.filter(post => {
            const connection = userConnections.find(c => c.post_uuid === post.uuid);
            return connection && connection.tags && connection.tags.includes(selectedTag);
        })
        : posts;

    if (loading && posts.length === 0) {
        return (
            <div className="feed-container">
                <div className="feed-list">
                    {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
                </div>
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
                </header>
            )}

            <div className="feed-list">

                <CreatePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onPostCreated={fetchPosts}
                    isPrivateInitial={initialIsPrivate}
                    isPlayground={isPlayground}
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
                        const pid = post.uuid;
                        const connection = userConnections.find(c => c.post_uuid === post.uuid);
                        const isConnected = !!connection;

                        return (
                            <article key={pid} className="universal-card post-card">
                                <div
                                    className="card-header clickable"
                                    onClick={() => {
                                        if (post.author_entity_id) navigate(`/entitat/${post.author_entity_id}`);
                                        else if (post.author_user_id) navigate(`/perfil/${post.author_user_id}`);
                                    }}
                                >
                                    <div className="header-left">
                                        <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.author_role) }}>
                                            {post.author_avatar ? (
                                                <img
                                                    src={post.author_avatar}
                                                    alt={post.author}
                                                    className="post-avatar-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `<div class="avatar-placeholder-mini">${getAvatarIcon(post.author_role)}</div>`;
                                                    }}
                                                />
                                            ) : getAvatarIcon(post.author_role)}
                                        </div>
                                        <div className="post-meta">
                                            <div className="post-author-row">
                                                <span className="post-author">{post.author}</span>
                                            </div>
                                            <div className="post-subtitle-row">
                                                <span className="post-time">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Ara'}</span>
                                                {post.towns?.name && <span className="post-location">• {post.towns.name}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="more-btn"
                                        aria-label={t('common.more_options') || 'Més opcions'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // More options logic here if needed
                                        }}
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

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

                                <div className="card-body">
                                    <p className="post-text">{post.content}</p>
                                </div>

                                <div className="card-footer-vibrant">
                                    <div className="card-actions-wrapper" style={{ flex: 1, backgroundColor: "transparent", borderTop: "none" }}>
                                        <div className="card-actions">
                                            <button
                                                className={`action-btn ${isConnected ? 'active' : ''}`}
                                                onClick={() => handleToggleConnection(pid)}
                                                aria-label={isConnected ? t('feed.disconnect') : t('feed.connect')}
                                                aria-pressed={isConnected}
                                            >
                                                <Link2 size={20} />
                                                <span>{isConnected ? (post.connections_count + 1 || 1) : (post.connections_count || 0)}</span>
                                            </button>
                                            <button
                                                className="action-btn"
                                                aria-label={t('feed.comments')}
                                            >
                                                <MessageCircle size={20} />
                                                <span>{post.comments_count || 0}</span>
                                            </button>
                                            <button
                                                className="action-btn"
                                                aria-label={t('feed.share')}
                                            >
                                                <Share2 size={20} />
                                            </button>
                                        </div>

                                        {isConnected && (
                                            <TagSelector
                                                postId={pid}
                                                currentTags={connection.tags || []}
                                                onTagsChange={(newTags) => handleConnectionUpdate(pid, true, newTags)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}

                {hasMore && posts.length > 0 && !selectedTag && (
                    <div className="load-more-container">
                        <button
                            className="btn-load-more"
                            onClick={() => fetchPosts(true)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Loader2 className="spinner" /> : t('common.load_more') || 'Carregar més'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
