import { useState, useEffect, useCallback, useRef } from 'react';
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
import UnifiedStatus from './UnifiedStatus';
import Avatar from './Avatar';
import './Feed.css';



const Feed = ({ townId = null, hideHeader = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState([]);
    const [userConnections, setUserConnections] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const fetchPosts = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);
        setError(null);
        try {
            const currentPage = isLoadMore ? page + 1 : 0;
            const result = await supabaseService.getPosts(selectedRole, townId, currentPage, 10, isPlayground);
            if (!isMounted.current) return;

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
                if (!isMounted.current) return;
                setUserTags(Array.isArray(tagsRaw) ? tagsRaw : []);

                if (postsArray.length > 0) {
                    logger.log('[Feed] Fetching user connections...');
                    const postUuids = postsArray.map(p => p.uuid);
                    const connections = await supabaseService.getPostConnections(postUuids);
                    if (!isMounted.current) return;
                    const userOwnConnections = connections.filter(c => c.user_id === user.id);
                    logger.log('[Feed] User connections loaded:', userOwnConnections.length);
                    setUserConnections(prev => isLoadMore ? [...prev, ...userOwnConnections] : userOwnConnections);
                }
            }
        } catch (err) {
            if (isMounted.current) {
                logger.error('[Feed] Failed to fetch feed:', err);
                setError(err.message);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setLoadingMore(false);
                logger.log('[Feed] Loading sequence finished');
            }
        }
    }, [selectedRole, townId]); // Removed page, user to avoid infinite loops and redundant triggers

    useEffect(() => {
        if (!authLoading) {
            fetchPosts();
        }
    }, [fetchPosts, authLoading]);

    useEffect(() => {
        const handleRefresh = (e) => {
            if (e.detail?.type === 'post') {
                fetchPosts();
            }
        };
        window.addEventListener('data-refresh', handleRefresh);
        return () => window.removeEventListener('data-refresh', handleRefresh);
    }, [fetchPosts]);

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
            <div className="feed-container">
                <UnifiedStatus
                    type="error"
                    message={error}
                    onRetry={() => fetchPosts()}
                />
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


                {filteredPosts.length === 0 ? (
                    <UnifiedStatus
                        type="empty"
                        message={selectedTag
                            ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                            : (t('feed.empty') || 'No hi ha novetats al mur.')
                        }
                        onRetry={selectedTag ? () => setSelectedTag(null) : null}
                    />
                ) : (
                    filteredPosts.map(post => {
                        const pid = post.uuid || post.id;
                        const connection = userConnections.find(c => c.post_uuid === (post.uuid || post.id));
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
                                        <Avatar
                                            src={post.author_avatar}
                                            role={post.author_role}
                                            name={post.author}
                                            size={44}
                                        />
                                        <div className="post-meta">
                                            <div className="post-author-row">
                                                <span className="post-author">{post.author}</span>
                                                {(post.author_role === 'ambassador' || post.author_is_ai) && (
                                                    <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                                )}
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
                                    {(post.author_role === 'ambassador' || post.author_is_ai) && (
                                        <div className="ia-transparency-note-mini">
                                            ✨ Contingut generat per IAIA (Informació i Acció Artificial)
                                        </div>
                                    )}
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
                                                aria-label={`${t('feed.comments') || 'Comentaris'} (${post.comments_count || 0})`}
                                            >
                                                <MessageCircle size={20} aria-hidden="true" />
                                                <span>{post.comments_count || 0}</span>
                                            </button>
                                            <button
                                                className="action-btn"
                                                aria-label={t('feed.share') || 'Compartir'}
                                            >
                                                <Share2 size={20} aria-hidden="true" />
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
