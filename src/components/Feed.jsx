import React, { useState, useCallback, useEffect, useRef, useTransition } from 'react';
import ConflictBanner from './ConflictBanner';
// CACHE BUST SW: Evasió profunda de la catxé del ServiceWorker per forçar re-render del Mur
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, IAIA_ID, CREATOR_EMAILS } from '../constants';
import { isSdPOficial, isLegacyMock } from '../utils/identityUtils';
import { logger } from '../utils/logger';
import PostSkeleton from './Skeletons/PostSkeleton';
import StatusLoader from './StatusLoader';
import SEO from './SEO';
import UniversalCard from './UniversalCard';
import ContextualHeader from './ContextualHeader';
import { useFeedData } from '../hooks/useFeedData';
import { useFeedFilters } from '../hooks/useFeedFilters';
import { useIAIAAutonomousInteractions } from '../hooks/useIAIAAutonomousInteractions';
import { useViewMode } from '../hooks/useViewMode';
import { UniversalGridWrapper, UniversalGridRow } from './UniversalGrid';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

class CardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('[CardErrorBoundary] Card fail:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const CorruptedCardPlaceholder = () => (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md rounded-[20px] border border-red-500/20 p-6 text-center">
        <Sparkles className="text-red-500/40 mb-3 opacity-50" size={32} />
        <span className="text-zinc-500 font-semibold font-['Epilogue'] tracking-tight">Post no disponible</span>
        <span className="text-zinc-600 text-[12px] mt-1">S'ha detectat una divergència CRDT local.</span>
    </div>
);

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false, externalViewMode = null }) => {
    const { iaiaLevel, gloveMode } = useDesign();
    const { selectedTown, enabledAgentIds } = useNavigation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    
    const activeTown = townId || selectedTown;

    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(() => {
        try {
            return localStorage.getItem('isIAIAFiltering') === 'true';
        } catch {
            return false;
        }
    });
    const { viewMode, setViewMode, columnCount, containerRef, effectiveViewMode } = useViewMode('feed_view_mode', 'grid', externalViewMode);
    
    const [contextualSearchTerm, setContextualSearchTerm] = useState('');

    const handleStorageChange = useCallback((e) => {
        if (e.key === 'isIAIAFiltering') {
            setIsIAIAFiltering(e.newValue === 'true');
        }
    }, []);

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
    } = useFeedData({ activeTown, townName, customPosts, isPlayground, user, iaiaLevel, selectedRole: 'tot' });

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

    const [, startTransition] = useTransition();
    const activePosts = filteredPosts;

    const rowCount = Math.ceil(activePosts.length / columnCount);


    const parentRef = useRef(null);
    const getScrollElement = useCallback(() => {
        if (!hideHeader) return parentRef.current;
        if (typeof window === 'undefined' || !parentRef.current) return null;
        // Cerca el primer ancestre que tingui capacitat de scroll real (overflowY: 'auto' o 'scroll')
        let el = parentRef.current.parentElement;
        while (el && el !== document.body && el !== document.documentElement) {
            const style = window.getComputedStyle(el);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') return el;
            el = el.parentElement;
        }
        return parentRef.current;
    }, [hideHeader]);
    const estimateSize = useCallback(() => effectiveViewMode === 'list' ? 120 : (effectiveViewMode === 'single' ? 600 : 900), [effectiveViewMode]);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement,
        estimateSize,
        overscan: columnCount > 1 ? 2 : 5,
        onChange: (instance) => {
            const lastIndex = instance.getVirtualItems().at(-1)?.index ?? 0;
            if (lastIndex > rowCount - 10 && hasMore && !loadingMore) {
                startTransition(() => {
                    fetchPosts(true);
                });
            }
        }
    });

    useEffect(() => {
        rowVirtualizer.measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, activePosts.length, columnCount]);

    const bottomRef = useRef(null);
    const entry = useIntersectionObserver(bottomRef, { threshold: 0.1, rootMargin: '400px' });
    
    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !loadingMore && !customPosts && !selectedTag) {
            startTransition(() => {
                fetchPosts(true);
            });
        }
    }, [entry?.isIntersecting, hasMore, loadingMore, customPosts, selectedTag, fetchPosts]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        if (isSdPOficial(targetId, post.author_name || post.author)) {
            navigate('/entitat/socdepoble');
            return;
        }

        if (post.author_role === USER_ROLES.AMBASSADOR || post.author_is_ai || post.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || isLegacyMock(targetId)) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }

        navigate(`/${type}/${targetId}`);
    }, [navigate]);

    /*
     * F-4: S'elimina headerClickCache (BOMBA 3) per evitar stale closures i fugues de memòria.
     * Es passa directament via onNavigate al UniversalCard.
     */

    const renderPost = useCallback((post) => {
        // FIX: Clave estrictamente determinista y estable. JAMÁS Math.random()
        const pid = post.uuid || post.id || `temp-${post.author_user_id || 'anon'}-${post.created_at || (post.content ? post.content.substring(0, 15) : 'unknown')}`;
        const isOptimistic = post.metadata?.isOptimistic;
        const isDissolving = post.metadata?.isDissolving;

        // FIX: Evitar hardcodear Identificadores Únicos y Lógica de Negocio de roles en el VDOM.
        const headerTitle = post.metadata?.is_verified
            ? post.metadata.display_name
            : (post.author?.name || post.author || 'Gent del Poble');

        const rawTown = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';
        const headerSubtitle = rawTown;

        const postImage = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.coverImage);
        const hasNoImage = !postImage;
        const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

        // Logic to resolve the correct Title for the post avoiding generic fallback or author name repetition
        const extractedTitle = post.title || 
                               (post.content ? post.content.split('\n')[0].replace(/^[#*\s]+/, '').trim() : null) || 
                               'Actualitat del Poble';
        const displayTitle = extractedTitle.length > 80 ? extractedTitle.substring(0, 80) + '...' : extractedTitle;

        return (
            <div key={pid} className={`card-rizoma-wrapper animate-in ${isDissolving ? 'dissolve' : ''} w-full h-full`}>
                <UniversalCard
                    item={post}
                    avatarName={headerTitle}
                    title={displayTitle}
                    subtitle={headerSubtitle}
                    image={hasNoImage ? cinematicPlaceholder : postImage}
                    onNavigate={() => handleHeaderClick(post)}
                    mode="mur"
                    viewMode={effectiveViewMode}
                    className={`universal-card-virtual ${isOptimistic ? 'optimistic' : ''} ${post.is_iaia_inspired ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
                    variant={post.type === 'bando' ? 'ajuntament' : (post.type === 'tramit' ? 'mur' : (post.type === 'mercat' ? 'mercat' : 'post'))}
                >
                    {post.is_iaia_inspired && (
                        <div className="iaia-transparency-genesis mt-2 mb-1">
                            <div className="flex items-center gap-1 font-black text-[12px] text-cyan-400">
                                <Sparkles size={12} /> IAIA + VEÍ [MASTER]
                            </div>
                        </div>
                    )}
                </UniversalCard>
            </div>
        );
    }, [gloveMode, handleHeaderClick, effectiveViewMode]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex-1 flex flex-col h-full bg-theme-base relative overflow-hidden items-center justify-center p-8">
                <Loader2 className="animate-spin text-[#F97316]" size={48} strokeWidth={2.5} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col h-full bg-theme-base relative overflow-hidden items-center justify-center p-8">
                <p className="text-[#EF4444] text-center font-bold mb-4">{t('feed.error_loading') || 'Error de càrrega'}</p>
                <StatusLoader type="error" message={error} onRetry={() => fetchPosts()} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 h-full bg-theme-base relative overflow-hidden w-full">
            <div id="feed-live-region" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {loading && posts.length === 0 && 'Carregant publicacions...'}
                {loadingMore && 'Carregant més publicacions...'}
                {!loading && posts.length > 0 && `${posts.length} publicacions carregades`}
                {error && `Error: ${error}`}
            </div>
            <SEO
                title={t('mur.title') || 'El Mur'}
                description={t('mur.description') || 'Connecta amb la teua comunitat i descobreix les darreres novetats del teu poble.'}
                image="/og-mur.png"
            />

            <h1 className="sr-only">Mur d'Activitat i Notícies de Sóc de Poble</h1>

            {!hideHeader && (
                <div className="flex-none w-full z-dropdown">
                    <ContextualHeader
                        searchTerm={contextualSearchTerm}
                        onSearchChange={setContextualSearchTerm}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setViewMode(mode);
                        }}
                        placeholder="Cerca al mur..."
                    />
                </div>
            )}

            <div
                ref={parentRef}
                className="flex-1 overflow-y-auto custom-scrollbar pb-20 w-full scroll-container-y min-h-0"
                style={{ contain: 'content', overflowAnchor: 'none' }}
                role="region"
                aria-label="Llista de publicacions"
            >
                <ConflictBanner />
                <UniversalGridWrapper viewMode={viewMode}>
                    <div
                        ref={containerRef}
                        className="feed-list mx-auto w-full relative"
                        role="feed"
                        aria-busy={loading || loadingMore}
                        aria-label="Publicacions del Mur"
                        style={{
                            height: `${rowVirtualizer.getTotalSize() + 36}px`,
                        }}
                    >
                        {activePosts.length === 0 ? (
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
                                const rowItems = activePosts.slice(startIndex, startIndex + columnCount);

                                return (
                                    <UniversalGridRow
                                        key={virtualRow.key}
                                        viewMode={viewMode}
                                        columnCount={columnCount}
                                        className="feed-grid"
                                        {...{ "data-index": virtualRow.index }}
                                        ref={rowVirtualizer.measureElement}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${virtualRow.start + 36}px)`,
                                        }}
                                    >
                                        {rowItems.map((post, idx) => (
                                            <article 
                                                key={post.uuid || post.id || idx}
                                                aria-posinset={virtualRow.index * columnCount + idx + 1}
                                                aria-setsize={hasMore ? -1 : activePosts.length}
                                                style={{ contain: 'layout paint style' }}
                                            >
                                                <CardErrorBoundary fallback={<CorruptedCardPlaceholder />}>
                                                    {renderPost(post)}
                                                </CardErrorBoundary>
                                            </article>
                                        ))}
                                    </UniversalGridRow>
                                );
                            })
                        )}
                    </div>
                </UniversalGridWrapper>

                {!customPosts && hasMore && posts.length > 0 && !selectedTag && (
                    <div ref={bottomRef} className="load-more-container mt-12 mb-12 flex justify-center w-full">
                        {loadingMore && (
                            <div className="flex items-center gap-2 text-[#F97316]/50">
                                <Loader2 className="spinner" size={16} /> 
                                <span className="text-sm font-semibold tracking-widest uppercase">Estirant la xàrcia...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};


export default Feed;
