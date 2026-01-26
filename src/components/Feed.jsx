import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle, Info, Sparkles, UserPlus, UserCheck, Volume2, StopCircle, EyeOff } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import { logger } from '../utils/logger';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import CreatePostModal from './CreatePostModal';
import CategoryTabs from './CategoryTabs';
import TagSelector from './TagSelector';
import PostSkeleton from './Skeletons/PostSkeleton';
import StatusLoader from './StatusLoader';
import Avatar from './Avatar';
import SEO from './SEO';
import ShareHub from './ShareHub';
import { iaiaService } from '../services/iaiaService';
import './Feed.css';
import './Comments.css';
import ImageCarousel from './ImageCarousel';

const IAIA_INITIAL_DELAY_MS = 10000;
const IAIA_INTERVAL_MS = 120000;

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
    const [isNoiseFiltered, setIsNoiseFiltered] = useState(localStorage.getItem('isNoiseFiltered') === 'true');
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    const { speak, stop, isPlaying } = useTextToSpeech();
    const [speakingPostId, setSpeakingPostId] = useState(null);

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
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [selectedRole, townId, user, isPlayground]);

    // Fetch comments separately when posts change
    useEffect(() => {
        const fetchCommentsForPosts = async () => {
            if (posts.length > 0) {
                const commentsMap = {};
                await Promise.all(posts.map(async (p) => {
                    const comments = await supabaseService.getPostComments(p.uuid || p.id);
                    if (comments.length > 0) {
                        commentsMap[p.uuid || p.id] = comments;
                    }
                }));
                if (isMounted.current) {
                    setPostComments(prev => ({ ...prev, ...commentsMap }));
                }
            }
        };
        fetchCommentsForPosts();
    }, [posts]);


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
        const initialTimer = setTimeout(triggerAutonomousInteraction, IAIA_INITIAL_DELAY_MS);

        // Then every 2 minutes
        const interval = setInterval(triggerAutonomousInteraction, IAIA_INTERVAL_MS);

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

    const displayedPosts = useMemo(() => {
        const filtered = posts.filter(post => {
            // 1. Vision Mode Filter
            if (visionMode === 'humana') {
                const isAI = post.author_role === 'ambassador' ||
                    post.author_is_ai ||
                    post.is_iaia_inspired ||
                    (post.author_user_id && String(post.author_user_id).startsWith('11111111-')) ||
                    (post.author_id && String(post.author_id).startsWith('11111111-')) ||
                    (post.author_entity_id && String(post.author_entity_id).startsWith('11111111-')) ||
                    (post.author_entity_id && String(post.author_entity_id).startsWith('00000000-')) ||
                    (post.id && String(post.id).startsWith('iaia-')) ||
                    post.creator_entity_id === '00000000-0000-0000-0000-000000000000';

                if (isAI) return false;
            }

            // 2. Tag Filter
            if (selectedTag) {
                const connection = userConnections.find(c => c.post_uuid === (post.uuid || post.id));
                return connection && connection.tags && connection.tags.includes(selectedTag);
            }

            // 3. Noise Filter
            if (isNoiseFiltered) {
                const isNoisy = post.author_is_noise || post.author?.is_noise || post.is_noise;
                if (isNoisy) return false;
            }

            return true;
        });

        // 4. Sorting logic OMNISCIENT (Pins first)
        return [...filtered].sort((a, b) => {
            const aPinned = a.is_pinned || a.metadata?.is_pinned;
            const bPinned = b.is_pinned || b.metadata?.is_pinned;
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return 0; // Maintain original time order for the rest
        });
    }, [posts, visionMode, selectedTag, isNoiseFiltered, userConnections]);

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
                <StatusLoader type="error" message={error} onRetry={() => fetchPosts()} />
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
                        <button
                            className={`noise-filter-toggle ${isNoiseFiltered ? 'active' : ''}`}
                            onClick={() => {
                                const newVal = !isNoiseFiltered;
                                setIsNoiseFiltered(newVal);
                                localStorage.setItem('isNoiseFiltered', String(newVal));
                                logger.info(`[Feed] Filtre de soroll ${newVal ? 'ACTIVAT' : 'DESACTIVAT'}`);
                            }}
                            title={isNoiseFiltered ? "Mostra tot el contingut (soroll inclòs)" : "Activa filtre de soroll (contingut de baixa qualitat)"}
                        >
                            {isNoiseFiltered ? <EyeOff size={16} /> : <Sparkles size={16} />}
                            <span className="ml-1.5">{isNoiseFiltered ? "SOROLL OCULT" : "FILTRE SOROLL"}</span>
                        </button>
                    </div>
                </header>
            )}

            {/* Semantic Heading for SEO/A11y */}
            <h1 className="sr-only">{t('mur.title') || 'Mur d\'Activitat i Notícies'}</h1>

            <div className="feed-list">
                {filteredPosts.length === 0 ? (
                    <StatusLoader
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

                        // HANDLING INTERNAL REPORTS (WORK GROUP)
                        if (post.type === 'internal_report') {
                            const isAdmin = user && (user.email === 'socdepoblecom@gmail.com' || user.email === 'javillinares@gmail.com' || user.role === 'admin' || isPlayground);
                            if (!isAdmin) return null;

                            return (
                                <article key={pid} className="universal-card post-card internal-report-card" style={{ border: '2px solid #FFD700', background: '#FFFBE6' }}>
                                    <div className="card-header clickable" onClick={() => {
                                        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
                                        const type = post.author_entity_id ? 'entitat' : 'perfil';
                                        if (targetId) navigate(`/${type}/${targetId}`);
                                    }}>
                                        <div className="header-left">
                                            <Avatar src={post.author_avatar} role="ambassador" name="IAIA" size={44} />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author" style={{ color: '#B45309' }}>Grup de Treball: Sóc de Poble</span>
                                                    <span className="identity-badge" style={{ background: '#FFD700', color: 'black' }}>CONFIDENCIAL</span>
                                                </div>
                                                <div className="post-town">Visible només per a la Direcció</div>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <span className="post-time-right">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                                            <div style={{ fontSize: '40px' }}>🍌</div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Informe Tècnic: {post.metadata?.title || 'Document de Treball'}</h3>
                                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Generat per Nano Banana & IAIA</p>
                                            </div>
                                        </div>

                                        <p className="post-text" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                                        <button
                                            className="action-btn principal-connect"
                                            style={{ width: '100%', marginTop: '15px', justifyContent: 'center', background: '#000', color: '#FFD700', border: 'none' }}
                                            onClick={() => window.open(post.metadata?.document_url || '#', '_blank')}
                                        >
                                            <span style={{ marginRight: '8px' }}>📄</span>
                                            LLEGIR DOCUMENT COMPLET
                                        </button>
                                    </div>
                                </article>
                            );
                        }

                        // HANDLING DIDACTIC PRESENTATION (Anna Calvo / Project News)
                        if (post.type === 'didactic_presentation') {
                            return (
                                <article key={pid} className="universal-card post-card didactic-card">
                                    <div className="card-header clickable" onClick={() => {
                                        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
                                        const type = post.author_entity_id ? 'entitat' : 'perfil';
                                        if (targetId) navigate(`/${type}/${targetId}`);
                                    }}>
                                        <div className="header-left">
                                            <Avatar src={post.author_avatar} role="official" name={post.author} size={44} />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author">{post.author}</span>
                                                    <span className="identity-badge official">PROJECTE</span>
                                                </div>
                                                <div className="post-town">Innovació Rural</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="video-embed-wrapper mb-4">
                                            {post.video_url && (
                                                <iframe
                                                    width="100%"
                                                    height="215"
                                                    src={`https://www.youtube.com/embed/${post.video_url.split('v=')[1]?.split('&')[0] || 'Fadaa7Kyxm0'}`}
                                                    title="Anna Calvo Presentation"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                                                ></iframe>
                                            )}
                                        </div>

                                        {post.image_url && (
                                            <div className="card-image-wrapper mb-4">
                                                {Array.isArray(post.image_url) ? (
                                                    <ImageCarousel images={post.image_url} />
                                                ) : (
                                                    <img
                                                        src={post.image_url}
                                                        alt={`${post.author} post image`}
                                                        loading="lazy"
                                                        style={{ borderRadius: '12px' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <div className="didactic-content">
                                            {post.content.split('\n').map((line, idx) => {
                                                if (line.startsWith('# ')) return <h1 key={idx} className="didactic-h1">{line.replace('# ', '')}</h1>;
                                                if (line.startsWith('## ')) return <h2 key={idx} className="didactic-h2">{line.replace('## ', '')}</h2>;
                                                return <p key={idx} className="didactic-p">{line}</p>;
                                            })}
                                        </div>

                                        <button
                                            className="action-btn didactic-modal-trigger mt-4"
                                            onClick={() => alert(`MODAL DIDÀCTIC ACCESSIBLE:\n\n${post.metadata?.didactic_text}`)}
                                            style={{
                                                width: '100%',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #00f2ff, #00d4ff)',
                                                color: '#000',
                                                fontWeight: 'bold',
                                                borderRadius: '12px',
                                                padding: '12px'
                                            }}
                                        >
                                            <Sparkles size={18} className="mr-2" />
                                            LLEGIR EN MODE ACCESSIBLE
                                        </button>
                                    </div>
                                </article>
                            );
                        }

                        // HANDLING EVENT ANNOUNCEMENTS
                        if (post.type === 'event_announcement') {
                            return (
                                <article key={pid} className={`universal-card post-card event-announcement-card animate-in`}>
                                    <div className="card-header clickable" onClick={() => {
                                        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
                                        const type = post.author_entity_id ? 'entitat' : 'perfil';
                                        if (targetId) navigate(`/${type}/${targetId}`);
                                    }}>
                                        <div className="header-left">
                                            <Avatar src={post.author_avatar} role="official" name={post.author} size={44} />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author">{post.author}</span>
                                                    <span className="event-badge">ESDEVENIMENT</span>
                                                </div>
                                                <div className="post-town">{post.towns?.name || 'Vida de Poble'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        {post.image_url && (
                                            <div className="card-image-wrapper mb-4">
                                                <img src={post.image_url} alt={post.content} style={{ borderRadius: '12px' }} />
                                            </div>
                                        )}
                                        <p className="post-text" style={{ fontWeight: '600' }}>{post.content}</p>
                                    </div>

                                    <div className="card-footer-vibrant">
                                        <div className="card-actions">
                                            <button className="action-btn principal-connect active" style={{ width: '100%', background: '#ff0055' }}>
                                                M'INTERESSA EL PLAN!
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        }

                        // STANDARD POSTS
                        return (
                            <article key={pid} className={`universal-card post-card ${post.is_iaia_inspired ? 'animate-in' : ''}`}>
                                <div
                                    className="card-header clickable"
                                    onClick={() => {
                                        const targetId = post.author_entity_id || post.author_user_id;
                                        const type = post.author_entity_id ? 'entitat' : 'perfil';

                                        // BLINDATGE DE LLINATGE: Si és Sóc de Poble, forcem l'ID canònic
                                        if (post.author?.includes('Sóc de Poble') || post.author_name?.includes('Sóc de Poble') || targetId === 'sdp-core' || targetId === 'mock-business-sdp-1') {
                                            navigate('/entitat/sdp-oficial-1');
                                            return;
                                        }

                                        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
                                            logger.warn('Navegació a perfil fictici no disponible:', targetId);
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
                                                {(post.is_pinned || post.metadata?.is_pinned) && <span className="pin-badge" title="Fichado al muro">📌</span>}
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
                                        {Array.isArray(post.image_url) ? (
                                            <ImageCarousel images={post.image_url} />
                                        ) : (
                                            <img
                                                src={post.image_url}
                                                alt={`${post.author} post image`}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="card-body">
                                    <p className="post-text">{post.content}</p>
                                    {(post.author_role === 'ambassador' || post.author_is_ai || post.is_iaia_inspired) && (
                                        <div className="ia-transparency-note-mini clickable" onClick={() => navigate('/iaia')}>
                                            ✨ {t('profile.transparency_post') || 'Contingut generat per la IAIA (Informació Artificial i Acció)'}
                                        </div>
                                    )}
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
                                            <button
                                                className={`action-btn ${speakingPostId === pid ? 'active-voice' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (speakingPostId === pid) {
                                                        stop();
                                                        setSpeakingPostId(null);
                                                    } else {
                                                        const textToRead = `Publicació de ${post.author}. ${post.content}`;
                                                        speak(textToRead);
                                                        setSpeakingPostId(pid);
                                                    }
                                                }}
                                                title="Llegir en veu alta"
                                            >
                                                {speakingPostId === pid ? <StopCircle size={24} className="pulse-red" /> : <Volume2 size={24} />}
                                            </button>
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
