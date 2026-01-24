import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle, Info, Sparkles, UserPlus, UserCheck } from 'lucide-react';
import { useUI } from '../context/UIContext';
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
import SEO from './SEO';
import ShareHub from './ShareHub';
import { iaiaService } from '../services/iaiaService';
import './Feed.css';
import './Comments.css';

const Feed = ({ townId = null, hideHeader = false, customPosts = null }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading } = useAuth();
    const { visionMode } = useUI();
    const [posts, setPosts] = useState(customPosts || []);
    const [userConnections, setUserConnections] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [postComments, setPostComments] = useState({});
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
                const tagsRaw = await supabaseService.getUserTags(user.id);
                if (!isMounted.current) return;
                setUserTags(Array.isArray(tagsRaw) ? tagsRaw : []);

                if (postsArray.length > 0) {
                    const postUuids = postsArray.map(p => p.uuid);
                    const connections = await supabaseService.getPostConnections(postUuids);
                    if (!isMounted.current) return;
                    const userOwnConnections = connections.filter(c => c.user_id === user.id);
                    setUserConnections(prev => isLoadMore ? [...prev, ...userOwnConnections] : userOwnConnections);
                }
            }
        } catch (err) {
            if (isMounted.current) {
                logger.error('[Feed] Failed to fetch feed:', err);
                setError(err.message);
            }

            // Fetch comments for all visible posts
            if (data && data.length > 0) {
                const commentsMap = {};
                await Promise.all(data.map(async (p) => {
                    const comments = await supabaseService.getPostComments(p.uuid || p.id);
                    if (comments.length > 0) {
                        commentsMap[p.uuid || p.id] = comments;
                    }
                }));
                setPostComments(prev => ({ ...prev, ...commentsMap }));
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [selectedRole, townId, user, isPlayground]);

    useEffect(() => {
        if (customPosts) {
            setPosts(customPosts);
            setLoading(false);
        }
    }, [customPosts]);

    useEffect(() => {
        if (!authLoading && !customPosts) {
            fetchPosts();
        }
    }, [fetchPosts, authLoading, customPosts]);

    useEffect(() => {
        const handleRefresh = (e) => {
            if (e.detail?.type === 'post') {
                fetchPosts();
            }
        };
        window.addEventListener('data-refresh', handleRefresh);
        return () => window.removeEventListener('data-refresh', handleRefresh);
    }, [fetchPosts]);

    // IAIA Autonomous Growth Loop Simulation
    useEffect(() => {
        if (!isPlayground) return;

        const triggerAutonomousInteraction = async () => {
            const newPost = await iaiaService.generateAutonomousInteraction();
            if (newPost && isMounted.current) {
                setPosts(prev => [newPost, ...prev]);
                logger.info('[Feed] IAIA autonomous post injected:', newPost.author);
            }
        };

        // First one after 10s
        const initialTimer = setTimeout(triggerAutonomousInteraction, 10000);

        // Then every 2 minutes
        const interval = setInterval(triggerAutonomousInteraction, 120000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isPlayground]);

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

    const filteredPosts = posts.filter(post => {
        // 1. Vision Mode Filter
        if (visionMode === 'humana') {
            const isAI = post.author_role === 'ambassador' || post.author_is_ai || (post.author_user_id && post.author_user_id.startsWith('11111111-'));
            if (isAI) return false;
        }

        // 2. Tag Filter
        if (selectedTag) {
            const connection = userConnections.find(c => c.post_uuid === post.uuid);
            return connection && connection.tags && connection.tags.includes(selectedTag);
        }

        return true;
    });

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
                <UnifiedStatus type="error" message={error} onRetry={() => fetchPosts()} />
            </div>
        );
    }

    return (
        <div className="feed-container">
            <SEO
                title={t('mur.title') || 'El Mur'}
                description={t('mur.description') || 'Connecta amb la teua comunitat i descobreix les darreres novetats del teu poble.'}
                image="/og-mur.png"
            />
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
                                        const targetId = post.author_entity_id || post.author_user_id;
                                        const type = post.author_entity_id ? 'entitat' : 'perfil';

                                        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
                                            console.warn('Navegació a perfil fictici no disponible:', targetId);
                                            return;
                                        }
                                        navigate(`/${type}/${targetId}`);
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
                                                <span className="post-author">{post.author || post.author_name || 'Usuari'}</span>
                                                {(post.author_role === 'ambassador' || post.author_is_ai) && (
                                                    <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                                )}
                                            </div>
                                            <div className="post-town">
                                                {post.towns?.name || 'Al teu poble'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="header-right">
                                        <span className="post-time-right">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Ara'}</span>
                                    </div>
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
                                    <div className="ia-transparency-note-mini clickable" onClick={() => navigate('/iaia')}>
                                        ✨ {t('profile.transparency_post') || 'Contingut generat per la IAIA (Informació Artificial i Acció)'}
                                    </div>
                                </div>

                                <div className="card-footer-vibrant">
                                    <div className="card-actions-wrapper" style={{ flex: 1, backgroundColor: "transparent", borderTop: "none" }}>
                                        <div className="card-actions">
                                            <button
                                                className={`action-btn principal-connect ${isConnected ? 'active' : ''}`}
                                                onClick={() => handleToggleConnection(pid)}
                                                aria-label={isConnected ? t('feed.disconnect') : t('feed.connect')}
                                                aria-pressed={isConnected}
                                            >
                                                {isConnected ? <UserCheck size={24} /> : <UserPlus size={24} />}
                                                <span>{isConnected ? (post.connections_count + 1 || 1) : (post.connections_count || 0)}</span>
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() => navigate(`/chats/${post.author_user_id || post.author_id}`, {
                                                    state: { commentingOn: post }
                                                })}
                                                title={t('feed.comments') || 'Xateja amb l\'autor'}
                                            >
                                                <MessageCircle size={24} />
                                                <span>{post.comments_count || 0}</span>
                                            </button>
                                            <ShareHub
                                                title={`Post de ${post.author} a Sóc de Poble`}
                                                text={post.content}
                                                url={`${window.location.origin}/post/${pid}`}
                                            />
                                        </div>
                                    </div>

                                    {isConnected && (
                                        <TagSelector
                                            postId={pid}
                                            currentTags={connection.tags || []}
                                            onTagsChange={(newTags) => handleConnectionUpdate(pid, true, newTags)}
                                        />
                                    )}
                                </div>

                                {/* Secció de Comentaris Integrats */}
                                {postComments[post.uuid || post.id] && postComments[post.uuid || post.id].length > 0 && (
                                    <div className="post-integrated-comments">
                                        {postComments[post.uuid || post.id].map(comment => (
                                            <div key={comment.id} className="mini-comment">
                                                <Avatar src={comment.profiles?.avatar_url} size={24} name={comment.profiles?.full_name} />
                                                <div className="comment-bubble">
                                                    <span className="comment-author">{comment.profiles?.full_name}</span>
                                                    <p className="comment-text">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
