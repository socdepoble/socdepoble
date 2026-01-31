import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle, Info, Sparkles, UserPlus, UserCheck, Volume2, StopCircle, EyeOff, BookOpen, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES, CREATOR_EMAILS, IAIA_ID } from '../constants';
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
import Carousel from './Carousel';

const IAIA_INITIAL_DELAY_MS = 10000;
const IAIA_INTERVAL_MS = 120000;

const Feed = ({ townId = null, hideHeader = false, customPosts = null }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isAdmin, isSuperAdmin } = useAuth();
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
                try {
                    const commentsMap = {};
                    await Promise.all(posts.map(async (p) => {
                        try {
                            const comments = await supabaseService.getPostComments(p.uuid || p.id);
                            if (comments && comments.length > 0) {
                                commentsMap[p.uuid || p.id] = comments;
                            }
                        } catch (e) {
                            logger.warn(`[Feed] Error fetching comments for post ${p.id}: `, e);
                        }
                    }));
                    if (isMounted.current) {
                        setPostComments(prev => ({ ...prev, ...commentsMap }));
                    }
                } catch (e) {
                    logger.error('[Feed] Failed to fetch comments map:', e);
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
        // [AUDITORIA V4] Permetem que la IAIA interaccione també per a Superadmins en sessió real
        if (!isPlayground && !isSuperAdmin) return;

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
    }, [isPlayground, isSuperAdmin]);

    const handleToggleConnection = async (postId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const isConnected = userConnections.some(c => c.post_uuid === postId);
            if (isConnected) {
                await supabaseService.removeConnection(user.id, postId);
                handleConnectionUpdate(postId, false);
            } else {
                await supabaseService.addConnection(user.id, postId);
                handleConnectionUpdate(postId, true, []);
            }
        } catch (err) {
            logger.error('[Feed] Error toggling connection:', err);
        }
    };

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

    const filteredPosts = useMemo(() => {
        const filtered = posts.filter(post => {
            // 1. Vision Mode Filter
            if (visionMode === 'humana' && !isSuperAdmin) {
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
    }, [posts, visionMode, selectedTag, isNoiseFiltered, userConnections, isSuperAdmin]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        // BLINDATGE DE LLINATGE: Si és Sóc de Poble, forcem l'ID canònic
        if (post.author?.toLowerCase().includes('sóc de poble') ||
            post.author_name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'mock-business-sdp-1' ||
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        // Si és la IAIA i estem en sessió real, la portem a la seua pàgina de transparència
        if (post.author_role === 'ambassador' || post.author_is_ai || post.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }

        navigate(`/${type}/${targetId}`);
    }, [navigate]);

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
                            if (!isAdmin) return null;

                            return (
                                <article key={pid} className="universal-card post-card internal-report-card" style={{ border: '2px solid #FFD700', background: '#FFFBE6' }}>
                                    <div className="card-header clickable" onClick={() => handleHeaderClick(post)}>
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

                                        <div className="post-text-rich" dangerouslySetInnerHTML={{ __html: post.content }} />

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

                        // HANDLING EVENT ANNOUNCEMENTS
                        if (post.type === 'event_announcement') {
                            return (
                                <article key={pid} className={`universal-card post-card event-announcement-card animate-in`}>
                                    <div className="card-header clickable" onClick={() => handleHeaderClick(post)}>
                                        <div className="header-left">
                                            <Avatar src={post.author_avatar} role="official" name={post.author} size={44} />
                                            <div className="post-town">{post.towns?.name || 'Vida de Poble'}</div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        {post.image_url && (
                                            <div className="card-image-wrapper mb-4">
                                                <img src={post.image_url} alt={post.content} style={{ borderRadius: '0' }} />
                                            </div>
                                        )}
                                        <div className="post-text-rich" dangerouslySetInnerHTML={{ __html: post.content }} />
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
                                    onClick={() => handleHeaderClick(post)}
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
                                                <span className="post-author">
                                                    {(post.author === 'Algú del poble' || !post.author)
                                                        ? (((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : []).includes(post.author_email)) || post.author_user_id === 'd6325f44-7277-4d20-b020-166c010995ab' || post.author_user_id === '11111111-0000-0000-0000-000000000001' ? post.author_name || 'Javi Llinares' : 'Veí de la Comunitat')
                                                        : post.author
                                                    }
                                                </span>
                                                {(post.is_pinned || post.metadata?.is_pinned) && <span className="pin-badge" title="Fichado al muro">📌</span>}
                                                {(post.author_role === 'ambassador' || post.author_is_ai) && (
                                                    <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                                )}
                                            </div>
                                            <div className="post-town">
                                                {post.towns?.name || post.town_name || 'La Torre de les Maçanes'}
                                            </div>
                                            {post.author_role === 'entity' && post.author_name && (
                                                <div className="post-lineage" style={{ fontSize: '11px', fontWeight: '800', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Publicat per {post.author_name}
                                                </div>
                                            )}
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
                                    <PostContent content={post.content} postId={pid} />
                                    {(post.author_role === 'ambassador' || post.author_is_ai || post.is_iaia_inspired) && (
                                        <div className="ia-transparency-note-mini clickable" onClick={() => navigate('/iaia')}>
                                            <div className="simbiosi-header" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '12px' }}>
                                                <Sparkles size={14} />
                                                <span>{t('profile.transparency_post') || 'SIMBIOSI [IAIA + VEÍ]'}</span>
                                            </div>

                                            {post.ai_percentage > 0 && (
                                                <div className="simbiosi-metrics" style={{ marginTop: '8px' }}>
                                                    <div className="simbiosi-bar" style={{ height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                                                        <div className="ai-fill" style={{ width: `${post.ai_percentage}%`, background: 'var(--color-primary)' }}></div>
                                                        <div className="human-fill" style={{ width: `${post.human_percentage}%`, background: '#f59e0b' }}></div>
                                                    </div>
                                                    <div className="simbiosi-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '4px', fontWeight: 600 }}>
                                                        <span>🤖 IA: {post.ai_percentage}%</span>
                                                        <span>👤 Humà: {post.human_percentage}%</span>
                                                    </div>
                                                </div>
                                            )}

                                            {post.time_saved_minutes > 0 && (
                                                <div className="simbiosi-impact" style={{ fontSize: '11px', marginTop: '6px', color: 'var(--color-primary)', fontWeight: 700 }}>
                                                    ⏳ <strong>+{post.time_saved_minutes} minuts</strong> regalats a la teua família
                                                </div>
                                            )}

                                            <div className="simbiosi-footer" style={{ fontSize: '10px', marginTop: '6px', opacity: 0.7, fontStyle: 'italic' }}>
                                                Directiva [MASTER]: {t('feed.simbiosi_footer') || 'La saviesa ancestral i el futur digital bategant junts por el bé de la comunitat.'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="card-footer-vibrant">
                                    <div className="card-actions-wrapper" style={{ flex: 1, backgroundColor: "transparent", borderTop: "none" }}>
                                        {post.type === 'didactic_presentation' && (
                                            <button
                                                className="btn-didactic-master-cta"
                                                onClick={() => navigate(`/didactica/${pid}`)}
                                                style={{ width: '100%', marginBottom: '12px', background: 'var(--color-primary)', color: '#000', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                                            >
                                                <BookOpen size={20} /> VEURE DETALL DIDÀCTIC Master
                                            </button>
                                        )}
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

                                {/* BOOK SEQUENCE FOOTER [MASTER] */}
                                {post.type === 'book' && (
                                    <div className="book-sequence-footer animate-in" style={{
                                        padding: '12px 20px',
                                        background: 'var(--bg-surface-soft)',
                                        borderTop: '1px solid var(--color-divider)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div className="book-ident-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div className="book-title-tag" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: 'var(--color-primary)',
                                                fontWeight: '800',
                                                fontSize: '14px',
                                                textTransform: 'uppercase'
                                            }}>
                                                <BookOpen size={18} />
                                                <span>{post.book_title || 'Llibre sense títol'}</span>
                                            </div>
                                            <div className="chapter-badge" style={{
                                                background: 'var(--color-primary)',
                                                color: '#000',
                                                padding: '2px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '900'
                                            }}>
                                                CAP. {post.chapter_number || '?'}
                                            </div>
                                        </div>

                                        <div className="book-nav-controls" style={{ display: 'flex', gap: '8px' }}>
                                            <button className="book-nav-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--color-divider)', color: 'var(--text-main)', fontSize: '13px', fontWeight: '700' }}>
                                                <ChevronLeft size={18} />
                                                Anterior
                                            </button>
                                            <button
                                                className="book-read-check"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert('Capítol marcat com a llegit! Batega amb la saviesa del poble. ✨');
                                                }}
                                                style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', fontSize: '14px', fontWeight: '800' }}
                                            >
                                                <Check size={18} />
                                                Llegit
                                            </button>
                                            <button className="book-nav-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--color-divider)', color: 'var(--text-main)', fontSize: '13px', fontWeight: '700' }}>
                                                Següent
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}

                {
                    hasMore && posts.length > 0 && !selectedTag && (
                        <div className="load-more-container">
                            <button
                                className="btn-load-more"
                                onClick={() => fetchPosts(true)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? <Loader2 className="spinner" /> : t('common.load_more') || 'Carregar més'}
                            </button>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

const PostContent = ({ content, postId }) => {
    const navigate = useNavigate();
    const CHAR_LIMIT = 500;
    const isTooLong = content.length > CHAR_LIMIT;

    // Simple truncation for HTML (could be improved with a proper parser)
    const displayContent = isTooLong ? content.substring(0, CHAR_LIMIT) + '...' : content;

    return (
        <div className="post-text-area-wrapper">
            <div className={`post-text-rich ${isTooLong ? 'truncated' : ''}`} dangerouslySetInnerHTML={{ __html: displayContent }} />
            {isTooLong && (
                <button
                    className="read-more-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${postId}`);
                    }}
                >
                    Llegir més 🏺📖
                </button>
            )}
        </div>
    );
};

export default Feed;
