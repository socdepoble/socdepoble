import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle, Info, Sparkles, UserPlus, UserCheck, Volume2, StopCircle, EyeOff, BookOpen, ChevronLeft, ChevronRight, Check, Filter } from 'lucide-react';
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
import { rhizomeManager } from '../services/rhizomeManager';
import './Feed.css';
import './Comments.css';
import ImageCarousel from './ImageCarousel';
import Carousel from './Carousel';
import AttributionBadge from './AttributionBadge';
import UniversalCard from './UniversalCard';
import { MOCK_EVENTS } from '../data';
import { geminiService } from '../services/geminiService';
import CronistaSummaryModal from './CronistaSummaryModal';

const IAIA_INITIAL_DELAY_MS = 10000;
const IAIA_INTERVAL_MS = 120000;

const Feed = ({ townId = null, hideHeader = false, customPosts = null, contentMode = 'batec' }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, isPlayground, loading: authLoading, isAdmin, isSuperAdmin } = useAuth();
    const isSovereign = user?.is_sovereign;
    const { visionMode, gloveMode, selectedTown } = useUI();
    const activeTown = townId || selectedTown;
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
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(localStorage.getItem('isIAIAFiltering') === 'true');
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    const { speak, stop, isPlaying } = useTextToSpeech();
    const [speakingPostId, setSpeakingPostId] = useState(null);

    // [CRONISTA AI] State for summary
    const [isCronistaLoading, setIsCronistaLoading] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [showSummaryModal, setShowSummaryModal] = useState(false);

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
            const result = await supabaseService.getPosts(selectedRole, activeTown, currentPage, 10, isPlayground);
            if (!isMounted.current) return;

            const postsArray = result.data;
            const totalCount = result.count;

            // [MASTER PINNED LOGIC] Sort by pinned_position (1, 2, 3) then by date
            const sortedPosts = postsArray.sort((a, b) => {
                const posA = (a && typeof a.pinned_position !== 'undefined' && a.pinned_position !== null) ? a.pinned_position : Infinity;
                const posB = (b && typeof b.pinned_position !== 'undefined' && b.pinned_position !== null) ? b.pinned_position : Infinity;
                if (posA !== posB) return posA - posB;
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            });

            if (isLoadMore) {
                setPosts(prev => [...prev, ...sortedPosts]);
                setPage(currentPage);
            } else {
                setPosts(sortedPosts);
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
    }, [selectedRole, activeTown, user, isPlayground]);

    // Fetch comments separately when posts change
    useEffect(() => {
        const fetchCommentsForPosts = async () => {
            if (posts.length > 0) {
                try {
                    const commentsMap = {};
                    await Promise.all(posts.map(async (p) => {
                        const postId = p.uuid || p.id;
                        if (!postId) return;
                        try {
                            const comments = await supabaseService.getPostComments(postId);
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
            return;
        }

        // [PILAR 1: INSTANT LOAD] - Bategat immediat des de la memòria local
        const cacheKey = `posts_${activeTown || 'global'}_0_10`;
        const localData = localStorage.getItem(`lc_${cacheKey}`);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (parsed && parsed.data && Array.isArray(parsed.data)) {
                    logger.log('[Feed] Instant Load: Bategant dades des del solatge local...');
                    setPosts(parsed.data);
                    setLoading(false);
                }
            } catch (e) {
                logger.warn('[Feed] Error en Instant Load:', e);
            }
        }
    }, [customPosts, activeTown]);

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
                // logger.info('[Feed] IAIA autonomous post injected:', newPost.author);
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
            // Persist to DB
            supabaseService.updateConnectionTags(user.id, postId, tags).catch(e =>
                logger.error('[Feed] Error persisting connection tags:', e)
            );

            tags.forEach(tag => {
                if (!userTags.includes(tag)) {
                    setUserTags(prev => [...prev, tag].sort());
                }
            });
        }
    };

    const filteredPosts = useMemo(() => {
        let filtered = posts.filter(post => {
            // 0. Content Mode Filter (Ara vs Arrel)
            const isArchive = post.metadata?.is_archive_debate || post.type === 'book' || post.category === 'Heritage';
            if (contentMode === 'batec' && isArchive) return false;
            if (contentMode === 'arrel' && !isArchive) return false;

            // 1. Vision Mode Filter
            if (visionMode === 'humana' && !isSuperAdmin) {
                const isAI = post.author_role === 'ambassador' ||
                    post.author_is_ai ||
                    post.is_iaia_inspired ||
                    (post.author_user_id && String(post.author_user_id).startsWith('11111111-')) ||
                    (post.id && String(post.id).startsWith('iaia-')) ||
                    post.creator_entity_id === '00000000-0000-0000-0000-000000000000';

                if (isAI) return false;
            }

            // 2. Tag Filter
            if (selectedTag) {
                const connection = userConnections.find(c => c.post_uuid === (post.uuid || post.id));
                return connection && connection.tags && connection.tags.includes(selectedTag);
            }

            return true;
        });

        // 3. IAIA Portera (Cognitive Filter Km 0) [PILLAR 4]
        if (isIAIAFiltering) {
            const userPrefs = {
                primary_town_id: activeTown || 1, // Default to current town
                anchors: ['mel', 'poma', 'fusta', 'tradició', 'IAIA', 'Master']
            };
            filtered = rhizomeManager.cognitiveFilter(filtered, userPrefs);
        }

        // 4. Sorting logic OMNISCIENT (Pins first, then Time) [PILLAR 3]
        return [...filtered].sort((a, b) => {
            const aPinned = a.is_pinned || a.metadata?.is_pinned || (typeof a.pinned_position !== 'undefined' && a.pinned_position !== null);
            const bPinned = b.is_pinned || b.metadata?.is_pinned || (typeof b.pinned_position !== 'undefined' && b.pinned_position !== null);
            
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            
            // Monetization tie-breaker: if both are pinned, use pinned_position
            if (aPinned && bPinned) {
                const posA = a.pinned_position || a.metadata?.pinned_position || Infinity;
                const posB = b.pinned_position || b.metadata?.pinned_position || Infinity;
                if (posA !== posB) return posA - posB;
            }

            // Strict inverse chronological order for the rest
            return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
        });
    }, [posts, visionMode, selectedTag, isIAIAFiltering, activeTown, userConnections, isSuperAdmin, contentMode]);

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

    const handleGenerateSummary = async () => {
        if (isCronistaLoading) return;

        setIsCronistaLoading(true);
        try {
            // Get the current visible posts (filtered)
            const result = await geminiService.generateNewsletterSummary(filteredPosts);
            if (result.error) {
                setError(result.message);
            } else {
                setSummaryContent(result.text);
                setShowSummaryModal(true);
            }
        } catch (err) {
            logger.error('[Cronista] Error generating summary:', err);
            setError("No s'ha pogut generar el resum. Torna-ho a provar.");
        } finally {
            setIsCronistaLoading(false);
        }
    };

    const handleShareSummary = async () => {
        if (!summaryContent || !user) {
            navigate('/login');
            return;
        }

        try {
            const summaryPost = {
                author_id: user.id,
                author_name: user.user_metadata?.full_name || user.email,
                content: `🗞️ **RESUM DEL DIA: CRÒNICA COMUNITÀRIA** 🗞️\n\n${summaryContent}\n\n#CronistaAI #ResumDelDia #SócDePoble`,
                town_uuid: activeTown || 'global',
                is_playground: isPlayground,
                type: 'news_summary',
                is_iaia_inspired: true
            };

            await supabaseService.createPost(summaryPost);
            setShowSummaryModal(false);
            window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'post' } }));
        } catch (err) {
            logger.error('[Cronista] Error sharing summary:', err);
        }
    };

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
            <h1 className="sr-only">Mur d'Activitat i Notícies de Sóc de Poble</h1>

            {/* IAIA PORTERA TOGGLE [PILLAR 4] */}
            <div className="iaia-filter-bar px-4 py-2 flex justify-between items-center text-xs font-bold border-b border-gray-100 bg-white sticky top-14 z-20">
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className={isIAIAFiltering ? "text-primary animate-pulse" : "text-gray-300"} />
                    <span className={isIAIAFiltering ? "text-primary" : "text-gray-400"}>IAIA PORTERA: {isIAIAFiltering ? "SENTIT KM 0" : "SENSE FILTRE"}</span>
                </div>
                <button
                    onClick={() => {
                        const next = !isIAIAFiltering;
                        setIsIAIAFiltering(next);
                        localStorage.setItem('isIAIAFiltering', next);
                    }}
                    className={`px-3 py-1 rounded-none transition-all ${isIAIAFiltering ? 'bg-primary text-black' : 'bg-gray-100 text-gray-500'}`}
                >
                    {isIAIAFiltering ? "PAU RURAL" : "VEURE TOT"}
                </button>

                <button
                    onClick={handleGenerateSummary}
                    disabled={isCronistaLoading || filteredPosts.length === 0}
                    className={`ml-2 px-3 py-1 rounded-none transition-all flex items-center gap-2 ${isCronistaLoading ? 'bg-gray-200 animate-pulse' : 'bg-secondary text-black hover:bg-opacity-90'}`}
                    style={{ background: '#F97316' }} /* Gem Orange */
                >
                    <Sparkles size={14} />
                    <span>{isCronistaLoading ? "PENSANT..." : "RESUM"}</span>
                </button>
            </div>

            <CronistaSummaryModal
                isOpen={showSummaryModal}
                onClose={() => setShowSummaryModal(false)}
                summary={summaryContent}
                onShare={handleShareSummary}
            />

            <div className="feed-list mur-masonry">
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
                    filteredPosts.map((post, index) => {
                        const pid = post.uuid || post.id || `post-${index}`;
                        const connection = userConnections.find(c => c.post_uuid === (post.uuid || post.id));
                        const isConnected = !!connection;

                        // OPTIMISTIC & DISSOLVE LOGIC [Q1]
                        const isOptimistic = post.metadata?.isOptimistic;
                        const isDissolving = post.metadata?.isDissolving;

                        // 1. Capçalera (Header): Navegació i Metadades
                        const headerTitle = (post.author === 'Algú del poble' || !post.author)
                            ? (((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : []).includes(post.author_email)) ||
                                post.author_user_id === 'd6325f44-7277-4d20-b020-166c010995ab' ||
                                post.author_user_id === '333bd9f1-21ab-41fe-b856-2340ce6dc96c' ||
                                post.author_user_id === 'a11ac111-eec1-4111-b111-000000000013' ||
                                post.author_user_id === 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0' ||
                                post.author_user_id === '031adc10-ce8c-4ec9-8672-330473033a91' ||
                                post.author_user_id === '11111111-0000-0000-0000-000000000001'
                                ? post.author_name || (
                                    post.author_user_id === '333bd9f1-21ab-41fe-b856-2340ce6dc96c' ? 'Lidia Espí' :
                                        post.author_user_id === 'a11ac111-eec1-4111-b111-000000000013' ? 'Anna Climent' :
                                            post.author_user_id === 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0' ? 'Damià Llorens' :
                                                post.author_user_id === '031adc10-ce8c-4ec9-8672-330473033a91' ? 'Nando Llinares' :
                                                    'Javi Llinares'
                                )
                                : 'Veí de la Comunitat')
                            : (post.author?.name || post.author); // Handle author object from Raindrop mappings

                        const headerSubtitle = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';

                        // 1. CONTENT RENDERING LOGIC
                        const renderContent = () => {
                            if (post.type === 'internal_report') {
                                return (
                                    <>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                                            <div style={{ fontSize: '40px' }}>🍌</div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Informe Tècnic: {post.metadata?.title || 'Document de Treball'}</h3>
                                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Generat per Nano Banana & IAIA</p>
                                            </div>
                                        </div>
                                        <div className="post-text-rich" dangerouslySetInnerHTML={{ __html: post.content }} />
                                    </>
                                );
                            }

                            if (post.type === 'book') {
                                return (
                                    <div className="book-content-wrapper">
                                        <div className="post-text-rich" dangerouslySetInnerHTML={{ __html: post.content }} />
                                        <div className="book-sequence-footer animate-in" style={{
                                            padding: '12px 20px',
                                            background: 'rgba(0,0,0,0.05)',
                                            marginTop: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div className="book-ident-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div className="book-title-tag" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6D00', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase' }}>
                                                    <BookOpen size={18} />
                                                    <span>{post.book_title || 'Llibre'}</span>
                                                </div>
                                                <div className="chapter-badge" style={{ background: '#FF6D00', color: '#fff', padding: '2px 10px', borderRadius: '0px', fontSize: '12px', fontWeight: '900' }}>
                                                    CAP. {post.chapter_number || '?'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <>
                                    <PostContent content={post.content || post.excerpt || ''} postId={pid} />
                                    {post.is_iaia_inspired && (
                                        <div className="iaia-transparency-genesis mt-4">
                                            <div className="flex items-center gap-1 font-black text-[10px] text-cyan-400">
                                                <Sparkles size={12} /> IAIA + VEÍ [MASTER]
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        };

                        // 2. CENTRALIZED CARD RENDERING
                        const postImage = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.coverImage);
                        const hasNoImage = !postImage;
                        const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

                        return (
                            <div key={pid} className="card-rizoma-wrapper animate-in">
                                <UniversalCard
                                    item={post}
                                    title={headerTitle}
                                    subtitle={headerSubtitle}
                                    excerpt={post.type === 'book' ? '' : (post.content || post.excerpt)}
                                    image={hasNoImage ? cinematicPlaceholder : postImage}
                                    onHeaderClick={() => handleHeaderClick(post)}
                                    mode="mur"
                                    className={`${isOptimistic ? 'optimistic' : ''} ${isDissolving ? 'dissolve' : ''} ${post.is_iaia_inspired ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
                                    syncState={post.syncState}
                                >
                                    {renderContent()}
                                </UniversalCard>
                            </div>
                        );
                    })
                )}
            </div >

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
