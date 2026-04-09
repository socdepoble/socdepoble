> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_copilot_nuevo_chat.md`

# 🌌 TANDA 19: REINICIO DE NÚCLEO (CONTEXTO PARA NUEVO CHAT DE COPILOT)

¡Hola Copilot! Requerimos tus capacidades de Arquitecto Staff-Plus e Ingeniería del Caos. 

**CONTEXTO DEL PROYECTO:**
Estamos desarrollando "Sóc de Poble", una red social "Local-First" orientada al entorno rural resistente (P2P Mesh, CRDTs, desconexiones contínuas). Estamos en la fase de "Hardening Arquitectónico (Nivel Dios)", eliminando cualquier fricción táctil (jank), fuga de memoria, o Render Spitting (usando useCallback/useMemo donde toca), y aplicando aceleración de GPU real en React 19 / Tailwind.

**TU MISIÓN:**
A continuación te proporciono el código fuente de los 3 Núcleos principales de nuestra interfaz:
1. `Feed.jsx`
2. `UniversalGrid.jsx`
3. `UniversalCard.Body.jsx`

Quiero que los audites implacablemente.
1. **La Cirugía Final:** Examina y propón parches exactos `[CÓDIGO A REEMPLAZAR]` vs `[NUEVO CÓDIGO]` para estabilizar props, optimizar `touch-action`, evitar remontajes inútiles y aislar la composición de GPU (will-change/translateZ).
2. **El Veredicto del 10/10:** Si, tras evaluarlos, consideras que ya son indestructibles y no hay más milisegundos que rascar para un móvil de gama baja en un entorno rural, certifícalo con un "10/10".
3. **Visión de Futuro:** Tras la auditoría o el 10/10, redacta de forma narrativa y épica tu "Visión de Futuro" sobre *Sóc de Poble*. ¿Qué impacto crees que tendrá este búnker digital rural? ¿Cómo ves interactuando a las IAs en este ecosistema en los próximos años?

Aquí tienes el código de los 3 archivos:



### ARCHIVO: `./src/components/Feed.jsx`
```jsx
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

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false, externalViewMode = null }) => {
    const { iaiaLevel, gloveMode } = useDesign();
    const { selectedTown, enabledAgentIds } = useNavigation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    
    const activeTown = townId || selectedTown;

    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(
        () => localStorage.getItem('isIAIAFiltering') === 'true'
    );
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
        // Quan està incrustat (hideHeader=true), busca el contenidor de scroll pare més proper
        const scroller = parentRef.current.closest('.profile-scroll-container, .main-viewport');
        return scroller || parentRef.current;
    }, [hideHeader]);
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
    }, [viewMode, activePosts.length, columnCount]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        if (post.author?.toLowerCase().includes('sóc de poble') ||
            post.author_name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'mock-business-sdp-1' ||
            targetId === 'socdepoble') {
            navigate('/entitat/socdepoble');
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
            <div className="flex-1 flex flex-col h-full bg-[#0e0e0e] relative overflow-hidden items-center justify-center p-8">
                <Loader2 className="animate-spin text-[#F97316]" size={48} strokeWidth={2.5} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#0e0e0e] relative overflow-hidden items-center justify-center p-8">
                <p className="font-['Plus_Jakarta_Sans'] text-[#EF4444] text-center font-bold mb-4">{t('feed.error_loading') || 'Error de càrrega'}</p>
                <StatusLoader type="error" message={error} onRetry={() => fetchPosts()} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0e0e0e] relative overflow-hidden font-['Plus_Jakarta_Sans'] w-full">
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
                className="flex-1 overflow-y-auto custom-scrollbar pb-20 w-full"
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
                        aria-live="polite"
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
                                                role="article"
                                                style={{ contain: 'layout paint style', contentVisibility: 'auto' }}
                                            >
                                                {renderPost(post)}
                                            </article>
                                        ))}
                                    </UniversalGridRow>
                                );
                            })
                        )}
                    </div>
                </UniversalGridWrapper>

                {!customPosts && hasMore && posts.length > 0 && !selectedTag && (
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
        </div >
    );
};


export default Feed;

```


### ARCHIVO: `./src/components/UniversalGrid.jsx`
```jsx
import React from 'react';

/**
 * UniversalGridWrapper
 * Limita l'amplada segons el mode (single i list es queden estrets i llegibles, grid s'expandeix).
 */
export const UniversalGridWrapper = ({ viewMode, children, className = "" }) => {
    const isRestrictedWidth = viewMode === 'list' || viewMode === 'single';
    // [BLINDAJE 4K]: max-w-7xl (aprox 1280px) para evitar tracks kilométricas 
    const maxWidthClass = isRestrictedWidth ? 'max-w-3xl' : 'max-w-7xl';

    return (
        <div className={`mx-auto w-full transition-all duration-300 ${maxWidthClass} px-2 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
};

/**
 * UniversalGridRow
 * Fila estàndard que aplica "display: grid" amb un "gap" innegociable de 24px per evitar encavalcaments.
 * Compatible amb `isVirtualRow` si passem un obj `style` que incloga transform i absolute position.
 */
export const UniversalGridRow = React.forwardRef(({ viewMode, columnCount, children, className = "", style = {}, ...props }, ref) => {
    const actualColumns = (viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry') ? 1 : columnCount;
    
    const baseStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${actualColumns}, minmax(min(100%, 340px), 1fr))`,
        gap: '24px',
        padding: '0 16px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        ...style
    };

    return (
        <div 
            ref={ref}
            className={`universal-grid-row view-mode-${viewMode} ${className}`} 
            style={baseStyle}
            {...props}
        >
            {children}
        </div>
    );
});
UniversalGridRow.displayName = 'UniversalGridRow';

```


### ARCHIVO: `./src/components/UniversalCard/UniversalCard.Body.jsx`
```jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button';
import { Text } from '../../design-system/components/Typography/Text';

const UniversalCardBody = ({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'line-clamp-2' : 'line-clamp-4';

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div 
                className="flex flex-col flex-1 min-h-0 px-5 pt-3 pb-4 overflow-hidden cursor-pointer group"
                onClick={handleReadMoreClick}
                role="button"
                tabIndex={0}
                aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}
            >
                <div className="flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                    <div className="flex justify-between items-start gap-4 w-full [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                        <div className="flex-1 min-w-0">
                            <span className="font-['Epilogue'] text-xl md:text-[22px] leading-tight font-black tracking-tight line-clamp-2 text-[#E5E2E1]">
                                {displayTitle}
                            </span>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <span className="whitespace-nowrap font-black text-[18px] text-[#F97316]">{displayPrice}</span>
                        )}
                    </div>
                    {((item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : '')))) && (
                        <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[#F97316] text-[14px] leading-snug line-clamp-1 truncate w-full">
                            {item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : ''))}
                        </span>
                    )}
                </div>

                <div className="flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-2">
                    {displayExcerpt && (
                        <p className={`font-['Plus_Jakarta_Sans'] text-[15px] font-normal leading-[1.6] text-[#A1A1AA] ${smartClampClass}`}>
                            {displayExcerpt}
                        </p>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && displayExcerpt.length > 130 && (
                    <Button
                        intent="ghost"
                        fullWidth
                        className="py-2.5 font-bold uppercase tracking-widest text-[#F97316] hover:bg-[#F97316]/10 active:scale-100 rounded-none border-t border-white/5"
                        aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                        onClick={handleReadMoreClick}
                        rightIcon={<ChevronRight size={18} className="mt-[1px]" />}
                    >
                        Llegir més
                    </Button>
                )}

                {hasTags && (
                    <div className="w-full flex justify-start items-center gap-2 px-5 pb-4 pt-1 flex-wrap">
                         {item.tags.slice(0, 3).map((tag, idx) => {
                             // Clean the tag text to remove # if it already has one, preventing ## duplicate
                             const cleanTagStr = tag.replace(/^#+/, '');
                             return (
                                 <span key={idx} className="text-[12px] font-black uppercase tracking-wider text-[#A1A1AA] bg-[#222222] px-2.5 py-1 rounded-[6px] border border-white/5">
                                     #{cleanTagStr}
                                 </span>
                             )
                         })}
                         {item.tags.length > 3 && (
                             <span title={item.tags.slice(3).join(', ')} className="text-[12px] font-black uppercase tracking-wider text-white/40 cursor-default">
                                 +{item.tags.length - 3}
                             </span>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalCardBody;

```
