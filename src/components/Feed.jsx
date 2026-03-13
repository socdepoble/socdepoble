import React, { useState, useCallback, useEffect, useMemo, useRef, useDeferredValue, useTransition } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, IAIA_ID, CREATOR_EMAILS } from '../constants';
import { logger } from '../utils/logger';
import PostSkeleton from './Skeletons/PostSkeleton';
import StatusLoader from './StatusLoader';
import SEO from './SEO';
import UniversalCard from './UniversalCard';
import ContextualHeader from './ContextualHeader';
import { useFeedData } from '../hooks/useFeedData';
import { useFeedFilters } from '../hooks/useFeedFilters';
import { useIAIAAutonomousInteractions } from '../hooks/useIAIAAutonomousInteractions';

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false }) => {
    const { iaiaLevel, gloveMode } = useDesign();
    const { selectedTown, enabledAgentIds } = useNavigation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    
    const activeTown = townId || selectedTown;
    const [selectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(
        () => localStorage.getItem('isIAIAFiltering') === 'true'
    );
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('feed_view_mode') || 'single';
    });
    const [contextualSearchTerm, setContextualSearchTerm] = useState('');

    const handleStorageChange = useCallback((e) => {
        if (e.key === 'isIAIAFiltering') {
            setIsIAIAFiltering(e.newValue === 'true');
        }
    }, [setIsIAIAFiltering]);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleStorageChange]);

    const {
        posts,
        setPosts,
        userConnections,
        loading,
        error,
        hasMore,
        loadingMore,
        fetchPosts
    } = useFeedData({ activeTown, townName, customPosts, isPlayground, user, iaiaLevel, selectedRole });

    useEffect(() => {
        if (authLoading || customPosts) return;
        const controller = new AbortController();
        
        fetchPosts(false, controller.signal);
        
        return () => {
             controller.abort();
        };
    }, [fetchPosts, authLoading, customPosts]);

    useIAIAAutonomousInteractions({ isPlayground, isSuperAdmin, setPosts });

    const filteredPosts = useFeedFilters({
        posts,
        contentMode,
        iaiaLevel,
        enabledAgentIds,
        selectedTag,
        contextualSearchTerm,
        isIAIAFiltering,
        activeTown,
        userConnections
    });

    const [columnCount, setColumnCount] = useState(2);
    const containerRef = useRef(null);
    const parentRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (width < 500) setColumnCount(viewMode === 'list' || viewMode === 'single' ? 1 : 2);
                else if (width < 850) setColumnCount(viewMode === 'list' || viewMode === 'single' ? 1 : 2);
                else setColumnCount(viewMode === 'list' || viewMode === 'single' ? 1 : 3);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [viewMode]);

    const [, startTransition] = useTransition();
    const deferredPosts = useDeferredValue(filteredPosts);

    const rowCount = Math.ceil(deferredPosts.length / columnCount);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => viewMode === 'list' ? 120 : (viewMode === 'single' ? 600 : 380),
        overscan: 5,
        measureElement: (element) => {
            if (!element) return;
            const ro = new ResizeObserver(() => {
                rowVirtualizer.measure();
            });
            ro.observe(element);
            return () => ro.disconnect();
        }
    });

    useEffect(() => {
        rowVirtualizer.measure();
    }, [viewMode, deferredPosts.length]);

    useEffect(() => {
        const lastIndex = rowVirtualizer.getVirtualItems().at(-1)?.index ?? 0;
        if (lastIndex > rowCount - 10 && hasMore) {
            startTransition(() => {
                fetchPosts(true);
            });
        }
    }, [rowVirtualizer, rowCount, hasMore, fetchPosts, deferredPosts.length]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        if (post.author?.toLowerCase().includes('sóc de poble') ||
            post.author_name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'mock-business-sdp-1' ||
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        if (post.author_role === USER_ROLES.AMBASSADOR || post.author_is_ai || post.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }

        navigate(`/${type}/${targetId}`);
    }, [navigate]);

    const renderPost = useCallback((post) => {
        const pid = post.uuid || post.id;
        const isOptimistic = post.metadata?.isOptimistic;
        const isDissolving = post.metadata?.isDissolving;

        const headerTitle = (post.author === 'Algú del poble' || !post.author)
            ? (((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : []).includes(post.author_email)) ||
                ['d6325f44-7277-4d20-b020-166c010995ab', '333bd9f1-21ab-41fe-b856-2340ce6dc96c', 'a11ac111-eec1-4111-b111-000000000013', 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0', '031adc10-ce8c-4ec9-8672-330473033a91', '11111111-0000-0000-0000-000000000001'].includes(post.author_user_id)
                ? post.author_name || (
                    post.author_user_id === '333bd9f1-21ab-41fe-b856-2340ce6dc96c' ? 'Lidia Espí' :
                        post.author_user_id === 'a11ac111-eec1-4111-b111-000000000013' ? 'Anna Climent' :
                            post.author_user_id === 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0' ? 'Damià Llorens' :
                                post.author_user_id === '031adc10-ce8c-4ec9-8672-330473033a91' ? 'Nando Llinares' :
                    'Javi Llinares'
                )
                : 'Gent de la Torre')
            : (post.author?.name || post.author);

        const rawTown = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';
        const headerSubtitle = rawTown.includes('La Torre') ? 'Gent de La Torre' : `Gent de ${rawTown}`;

        const postImage = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.coverImage);
        const hasNoImage = !postImage;
        const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

        return (
            <div key={pid} className={`card-rizoma-wrapper animate-in ${isDissolving ? 'dissolve' : ''} w-full`}>
                <UniversalCard
                    item={post}
                    title={headerTitle}
                    subtitle={headerSubtitle}
                    excerpt={post.type === 'book' ? '' : (post.content || post.excerpt)}
                    image={hasNoImage ? cinematicPlaceholder : postImage}
                    onHeaderClick={() => handleHeaderClick(post)}
                    mode="mur"
                    viewMode={viewMode}
                    className={`universal-card-virtual ${isOptimistic ? 'optimistic' : ''} ${post.is_iaia_inspired ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
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
    }, [gloveMode, handleHeaderClick, viewMode]);

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

            <h1 className="sr-only">Mur d'Activitat i Notícies de Sóc de Poble</h1>

            {!hideHeader && (
                <ContextualHeader
                    searchTerm={contextualSearchTerm}
                    onSearchChange={setContextualSearchTerm}
                    viewMode={viewMode}
                    onViewModeChange={(mode) => {
                        setViewMode(mode);
                        localStorage.setItem('feed_view_mode', mode);
                    }}
                    placeholder="Cerca al mur..."
                />
            )}

            {customPosts ? (
                <div className={`feed-list max-w-3xl mx-auto w-full pb-20`}>
                    {deferredPosts.length === 0 ? (
                        <StatusLoader
                            type="empty"
                            message={selectedTag
                                ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                : (t('feed.empty') || 'No hi ha novetats al mur.')
                            }
                            onRetry={selectedTag ? () => setSelectedTag(null) : null}
                        />
                    ) : (
                        <div className={`feed-grid view-mode-${viewMode}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '0 16px' }}>
                            {deferredPosts.map(post => renderPost(post))}
                        </div>
                    )}
                </div>
            ) : (
                <div
                    ref={parentRef}
                    className="flex-1 overflow-auto custom-scrollbar h-[100dvh]"
                    style={{ contain: 'strict', overflowAnchor: 'none' }}
                >
                    <div
                        ref={containerRef}
                        className={`feed-list max-w-3xl mx-auto w-full`}
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: 'relative',
                        }}
                    >
                        {deferredPosts.length === 0 ? (
                            <StatusLoader
                                type="empty"
                                message={selectedTag
                                    ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                    : (t('feed.empty') || 'No hi ha novetats al mur.')
                                }
                                onRetry={selectedTag ? () => setSelectedTag(null) : null}
                            />
                        ) : (
                            rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const startIndex = virtualRow.index * columnCount;
                                const rowItems = deferredPosts.slice(startIndex, startIndex + columnCount);

                                return (
                                    <div
                                        key={virtualRow.key}
                                        data-index={virtualRow.index}
                                        ref={rowVirtualizer.measureElement}
                                        className={`feed-grid view-mode-${viewMode}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${virtualRow.start}px)`,
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                            gap: '16px',
                                            padding: '0 16px',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        {rowItems.map(post => renderPost(post))}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {hasMore && posts.length > 0 && !selectedTag && (
                        <div className="load-more-container mt-12 mb-12" style={{ position: 'relative', top: `${rowVirtualizer.getTotalSize()}px` }}>
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
            )}
        </div >
    );
};

const SANITIZE_CACHE = new Map();
const SANITIZE_CACHE_LIMIT = 800;
let SANITIZE_CACHE_BYTES = 0;
const SANITIZE_CACHE_BYTES_LIMIT = 4 * 1024 * 1024; // 4MB approx

function approxSizeOfString(s) {
  return s ? s.length * 2 : 0; // aproximació UTF-16
}

function stableHash(str) {
  if (!str) return '0';
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

function sanitizeWithCache(key, html, opts) {
  if (!html) return '';
  const htmlHash = stableHash(html);
  const k = `${key}::${htmlHash}`;
  if (SANITIZE_CACHE.has(k)) return SANITIZE_CACHE.get(k);
  const sanitized = DOMPurify.sanitize(html, opts);
  
  SANITIZE_CACHE.set(k, sanitized);
  SANITIZE_CACHE_BYTES += approxSizeOfString(sanitized);

  // Evicció per nombre i per mida (v5)
  while ((SANITIZE_CACHE.size > SANITIZE_CACHE_LIMIT) || (SANITIZE_CACHE_BYTES > SANITIZE_CACHE_BYTES_LIMIT)) {
    const firstKey = SANITIZE_CACHE.keys().next().value;
    const val = SANITIZE_CACHE.get(firstKey);
    SANITIZE_CACHE_BYTES -= approxSizeOfString(val);
    SANITIZE_CACHE.delete(firstKey);
  }
  return sanitized;
}

const PostContent = React.memo(({ content, postId }) => {
    const [expanded, setExpanded] = useState(false);
    const CHAR_LIMIT = 500;
    const safeRaw = typeof content === 'string' ? content : '';
    const isTooLong = safeRaw.length > CHAR_LIMIT;
    const rawContent = expanded ? safeRaw : (isTooLong ? safeRaw.substring(0, CHAR_LIMIT) + '...' : safeRaw);
    
    // BLINDATGE ANTIGRAVITY: Memoització agressiva + LRU Cache de la purificació
    const safeContent = useMemo(() => {
        const key = postId || stableHash(rawContent.slice(0, 64));
        return sanitizeWithCache(key, rawContent, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'span'],
            ALLOWED_ATTR: ['href', 'target', 'rel'],
        });
    }, [rawContent, postId]);

    return (
        <div className="post-text-area-wrapper">
            <div className={`post-text-rich ${isTooLong && !expanded ? 'truncated' : ''}`} dangerouslySetInnerHTML={{ __html: String(safeContent) }} />
            {isTooLong && (
                <button
                    className="read-more-btn font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-2 text-sm select-none cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(p => !p);
                    }}
                >
                    {expanded ? 'Llegir menys ↑' : 'Llegir més 🏺📖'}
                </button>
            )}
        </div>
    );
});

export default Feed;
