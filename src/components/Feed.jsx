import React, { useState, useCallback, useEffect, useRef, useDeferredValue, useTransition } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false, externalViewMode = null }) => {
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
    const [internalViewMode, setInternalViewMode] = useState(() => {
        return localStorage.getItem('feed_view_mode') || 'grid';
    });
    const viewMode = externalViewMode || internalViewMode;

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

    const [columnCount, setColumnCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const estimatedContainerWidth = Math.min(window.innerWidth - (window.innerWidth > 1024 ? 300 : 0), 1600);
            if (viewMode === 'list' || viewMode === 'single') return 1;
            if (estimatedContainerWidth < 800) return 1;
            if (estimatedContainerWidth < 1200) return 2;
            if (estimatedContainerWidth < 1600) return 3;
            return 4;
        }
        return 1;
    });
    const containerRef = useRef(null);
    const parentRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        let rafId;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    if (viewMode === 'single' || viewMode === 'list') {
                        setColumnCount(1);
                    } else {
                        if (width < 800) setColumnCount(1);
                        else if (width < 1200) setColumnCount(2);
                        else if (width < 1600) setColumnCount(3);
                        else setColumnCount(4);
                    }
                });
            }
        });
        observer.observe(containerRef.current);
        return () => {
             observer.disconnect();
             if (rafId) cancelAnimationFrame(rafId);
        };
    }, [viewMode]);

    const [, startTransition] = useTransition();
    const deferredPosts = useDeferredValue(filteredPosts);

    const rowCount = Math.ceil(deferredPosts.length / columnCount);
    const effectiveViewMode = (viewMode === 'grid' && columnCount === 1) ? 'single' : viewMode;

    const getScrollElement = useCallback(() => parentRef.current, []);
    const estimateSize = useCallback(() => effectiveViewMode === 'list' ? 120 : (effectiveViewMode === 'single' ? 600 : 900), [effectiveViewMode]);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement,
        estimateSize,
        overscan: 5,
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
    }, [viewMode, deferredPosts.length, columnCount]);

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
        const pid = post.uuid || post.id || `post-fallback-${Math.random().toString(36).substring(2, 9)}`;
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
                    onHeaderClick={() => handleHeaderClick(post)}
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
                <div className="sticky top-0 w-full z-[100] shadow-md">
                    <ContextualHeader
                        searchTerm={contextualSearchTerm}
                        onSearchChange={setContextualSearchTerm}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setInternalViewMode(mode);
                            localStorage.setItem('feed_view_mode', mode);
                        }}
                        placeholder="Cerca al mur..."
                    />
                </div>
            )}

            {customPosts ? (
                <div ref={containerRef} className={`feed-list mx-auto w-full pb-20 transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
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
                    style={{ contain: 'content', overflowAnchor: 'none' }}
                >
                    <div
                        ref={containerRef}
                        className={`feed-list mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-3xl'}`}
                        style={{
                            height: `${rowVirtualizer.getTotalSize() + 36}px`,
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
                                            transform: `translateY(${virtualRow.start + 36}px)`,
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                            gap: '24px',
                                            padding: '0 16px',
                                            paddingBottom: '24px', // Critical: this forces the virtualizer to measure height including a gap
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
                        <div className="load-more-container mt-12 mb-12 flex justify-center w-full">
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


export default Feed;
