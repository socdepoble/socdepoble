import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2, AlertCircle, Info, Sparkles, UserPlus, UserCheck, Volume2, StopCircle, EyeOff, BookOpen, ChevronLeft, ChevronRight, Check, Filter } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { supabaseService, isValidUUID } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES, CREATOR_EMAILS, IAIA_ID } from '../constants';
import { logger } from '../utils/logger';
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
import { townContentGenerator } from '../utils/town_content_generator';
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

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec' }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // const { user, profile, isPlayground, loading: authLoading, isAdmin, isSuperAdmin } = useAuth();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    const _isSovereign = user?.is_sovereign;
    const { visionMode, gloveMode, selectedTown, iaiaLevel } = useUI();
    const activeTown = townId || selectedTown;
    const [posts, setPosts] = useState(customPosts || []);
    const [userConnections, setUserConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [selectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(localStorage.getItem('isIAIAFiltering') === 'true');
    const [error, setError] = useState(null);
    const isMounted = useRef(true);


    // [CRONISTA AI] State for summary
    const [isCronistaLoading, setIsCronistaLoading] = useState(false);
    const hasAttemptedSeed = useRef(false);

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
            let finalPosts = postsArray;
            
            // [IAIA DISCONNECT] Si Nivell 0, purguem posts d'IA
            if (iaiaLevel === 0) {
                finalPosts = postsArray.filter(p => !p.is_iaia_inspired && !p.is_ai);
            }

            const sortedPosts = finalPosts.sort((a, b) => {
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

                // [PHASE 4: TERRITORIAL EXPANSION]
                // If the feed is for a specific town and it's empty, trigger a seed event
                if (sortedPosts.length === 0 && activeTown && activeTown !== 'global' && isPlayground && !hasAttemptedSeed.current) {
                    logger.info(`[Phase 4] Feed buit per a ${townName || activeTown}. Iniciant inyecció de contingut...`);
                    hasAttemptedSeed.current = true;
                    townContentGenerator.seedTownFeed(activeTown, townName || "el seu poble").then(success => {
                        if (success && isMounted.current) {
                            setTimeout(() => fetchPosts(false), 2000);
                        }
                    });
                }
            }

            setHasMore(posts.length + postsArray.length < totalCount);

            if (user && isValidUUID(user.id)) {
                if (!isMounted.current) return;

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
    }, [selectedRole, activeTown, townName, user, isPlayground, iaiaLevel, page, posts.length]);



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
            {/* REDUNDÀNCIA DE CABECERA ELIMINADA (v11.0.6) */}

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

            <div className="feed-list mur-masonry max-w-3xl mx-auto w-full">
                {/* 🧧 PANELL DE BENVINGUDA / PUBLICITAT (CLOSETABLE) */}
                {localStorage.getItem('hideWelcomePanel') !== 'true' && (
                    <div className="welcome-panel-wrapper mb-8 animate-in relative group">
                        <div className="bg-gradient-to-br from-indigo-900/40 to-black border-2 border-indigo-500/30 rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button 
                                    onClick={() => {
                                        localStorage.setItem('hideWelcomePanel', 'true');
                                        window.dispatchEvent(new CustomEvent('data-refresh'));
                                    }}
                                    className="p-3 bg-white/10 hover:bg-red-500/20 text-white rounded-full transition-all border border-white/10"
                                    title="Tancar Panell (Focus Mode)"
                                >
                                    <EyeOff size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-24 h-24 bg-orange-500 rounded-[28px] flex items-center justify-center shrink-0 shadow-2xl shadow-orange-500/20">
                                    <Sparkles size={48} className="text-black" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Benvingut al Mas Digital 🏺</h2>
                                    <p className="text-indigo-200/70 text-base leading-relaxed max-w-md font-medium">
                                        Estàs en mode <span className="text-orange-400 font-bold">Mail (Obert)</span>. Explora les històries del teu poble o tanca aquest panell per entrar en mode <span className="text-cyan-400 font-bold">Focus</span>.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                                        <button className="h-12 px-6 bg-white text-black font-black uppercase text-xs rounded-full hover:scale-105 transition-transform">Guia de l'Agent</button>
                                        <button className="h-12 px-6 bg-white/10 text-white font-black uppercase text-xs rounded-full border border-white/20">Història de la Torre</button>
                                    </div>
                                </div>
                            </div>
                            {/* Blueprint Indicator inside panel if active */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                        </div>
                    </div>
                )}

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
                            : (post.author?.name || post.author);

                        const rawTown = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';
                        const headerSubtitle = rawTown.includes('La Torre') ? 'Gent de La Torre' : `Gent de ${rawTown}`;

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
                                    variant={post.type === 'bando' ? 'ajuntament' : (post.type === 'tramit' ? 'mur' : 'post')}
                                >
                                    <PostContent content={post.content || post.excerpt || ''} postId={pid} />
                                    {post.is_iaia_inspired && (
                                        <div className="iaia-transparency-genesis mt-4">
                                            <div className="flex items-center gap-1 font-black text-[10px] text-cyan-400">
                                                <Sparkles size={12} /> IAIA + VEÍ [MASTER]
                                            </div>
                                        </div>
                                    )}
                                </UniversalCard>
                            </div>
                        );
                    })
                )}
            </div>

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
