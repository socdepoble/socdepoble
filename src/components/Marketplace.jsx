import { useDesign } from '../context/DesignContext';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import StatusLoader from './StatusLoader';
import MarketSkeleton from './Skeletons/MarketSkeleton';
import SEO from './SEO';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { geminiService } from '../services/geminiService';
import { rhizomeManager } from '../services/rhizomeManager';
import { paymentService } from '../services/paymentService';
import { hapticService } from '../services/hapticService';
import { IAIA_ID, USER_ROLES } from '../constants';

import ItemDetailModal from './ItemDetailModal';
import UniversalCard from './UniversalCard';
import ContextualHeader from './ContextualHeader';
import { MOCK_MARKET_ITEMS } from '../data';
import './Marketplace.css';
import { marketService } from '../services/marketService';

const Market = ({ searchTerm = '' }) => {
    const { t } = useTranslation();
    const { isSuperAdmin } = useAuth();
    const { visionMode } = useDesign();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [isIAIAFiltering] = useState(localStorage.getItem('isIAIAFiltering') === 'true');
    const [viewMode, setViewMode] = useState(localStorage.getItem('market_view_mode') || 'grid');
    const [internalSearchTerm, setInternalSearchTerm] = useState('');
    const PAGE_SIZE = 100;

    const loadMarketData = React.useCallback(async (append = false) => {
        const currentPage = append ? page + 1 : 0;
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const { data } = await marketService.getMarketItems({
                page: currentPage,
                limit: PAGE_SIZE,
                categorySlug: 'tot', // Default to all as tab is removed
                isIAIAFiltering
            });

            // [MASTER] Robust handling of { data, count } response
            const fetchedItems = data || [];
            
            // Mix local mock items on the first page
            let combinedItems = fetchedItems;
            if (currentPage === 0) {
                // Remove duplicates by ID if they happen to overlap
                const fetchedIds = new Set(fetchedItems.map(i => i.id));
                const uniqueMocks = MOCK_MARKET_ITEMS.filter(m => !fetchedIds.has(m.id));
                combinedItems = [...uniqueMocks, ...fetchedItems];
            }

            if (append) {
                setItems(prev => [...(Array.isArray(prev) ? prev : []), ...combinedItems]);
            } else {
                setItems(combinedItems);
            }

            setHasMore(fetchedItems.length === PAGE_SIZE);
            setPage(currentPage);
        } catch (err) {
            logger.error('[Market] Error loading market items:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [page, isIAIAFiltering]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await marketService.getMarketCategories();
                setCategories(cats);
            } catch (err) {
                logger.error('[Market] Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // [PILAR 1: INSTANT LOAD] - Bategat immediat des de la memòria local
        const cacheKey = `market_global_0`;
        const localData = localStorage.getItem(`lc_${cacheKey}`);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (parsed && parsed.data && Array.isArray(parsed.data)) {
                    logger.log('[Market] Instant Load: Bategant dades des del solatge local...');
                    setItems(parsed.data);
                    setLoading(false);
                }
            } catch (e) {
                logger.warn('[Market] Error en Instant Load:', e);
            }
        }
        loadMarketData(false);
    }, [searchTerm, isIAIAFiltering, loadMarketData]);

    const filteredItems = useMemo(() => {
        let baseItems = items;

        // 1. Vision Mode Filter
        if (visionMode === 'humana' && !isSuperAdmin) {
            baseItems = baseItems.filter(item => {
                const nameToCheck = item.seller || item.seller_name || item.author_name || '';

                // [MASTER BLACKLIST] Purga de fantasmes i noms reservats per a IAIA
                const BLACKLIST_NAMES = [
                    'Vicent Ferris', 'Lucía Belda', 'Elena Popova', 'Maria "Mèl"', 'Marc Sendra',
                    'Samir Mensah', 'Andreu Soler', 'Beatriz Ortega', 'Joanet Serra',
                    'Carmen la del Forn', 'Joan Batiste', 'Carla Soriano', 'El Viatjant', 'Flash',
                    'Formatgeria la Vall', 'Cooperativa de la Torre', 'Sabors del Comtat',
                    'Destil·leries de la Serra', 'Forn de Muro', 'Abelles Mariola', 'Abelles de la Serra',
                    'Hort del Tio Pep', 'IAIA MARIA'
                ];
                if (BLACKLIST_NAMES.some(name => nameToCheck.includes(name))) return false;

            // 1. Vision Mode Filter (Protocol de Visió Humana: Purga Radical de IA)
            if (visionMode === 'humana') {
                const idToCheckMarket = item.author_id || item.seller_id || item.creator_entity_id || '';
                const isSDPOfficial = item.seller_entity_id === 'socdepoble' || 
                                     item.seller?.includes('Sóc de Poble') || 
                                     item.title?.includes('Camiseta');

                const isAI = item.author_role === USER_ROLES.AMBASSADOR ||
                    item.author_is_ai ||
                    item.is_iaia_inspired ||
                    (idToCheckMarket && idToCheckMarket.startsWith('11111111-')) ||
                    (item.id && String(item.id).startsWith('iaia-'));

                if (isAI && !isSDPOfficial) return false;
                
                // [PROTOCOL FANTASMA] Eliminem tot el que bategui amb mock- que no sigui oficial
                if (idToCheckMarket.startsWith('mock-') && !isSDPOfficial) return false;
                if (idToCheckMarket.startsWith('00000000-')) return false;
            }
            });
        }

        // 2. IAIA Portera (Cognitive Filter Km 0) [PILLAR 4]
        if (isIAIAFiltering) {
            const userPrefs = {
                primary_town_id: 1, // La Torre
                anchors: ['oli', 'mel', 'farina', 'proximitat', 'producte-local']
            };
            baseItems = rhizomeManager.cognitiveFilter(baseItems, userPrefs);
        }

        // 3. Search Filter
        const combinedSearch = (searchTerm || internalSearchTerm || '')?.toLowerCase().trim();
        let result = combinedSearch ? baseItems.filter(item =>
            item.title?.toLowerCase().includes(combinedSearch) ||
            item.description?.toLowerCase().includes(combinedSearch) ||
            item.seller?.toLowerCase().includes(combinedSearch)
        ) : baseItems;

        // 4. [MASTER] Priority Sort (Pinned items first)
        const safeResult = Array.isArray(result) ? result : [];
        return [...safeResult].sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            if (a.pinned_position !== undefined && b.pinned_position !== undefined) {
                return a.pinned_position - b.pinned_position;
            }
            return new Date(b.created_at || 0) - new Date(a.date || a.created_at || 0);
        });
    }, [items, searchTerm, internalSearchTerm, visionMode, isIAIAFiltering, isSuperAdmin]);

    const [, setPayingItemId] = useState(null);
    const [, setPaidItems] = useState(new Set());
    const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

    const handleAstroPayment = async (item) => {
        const confirm = window.confirm(`Vols activar un Bategat Econòmic (Astro) de ${item.price} per ${item.title}? L'IAIA segellarà la transacció immediatament al teu mòbil.`);
        if (!confirm) return;

        const itemId = item.uuid || item.id;
        setPayingItemId(itemId);

        // [SUPREME USABILITY] Confiança Optimista: Bateguem ràpid!
        try {
            const result = await paymentService.sendEconomicBeat({
                amount: parseFloat(item.price.replace('€', '').replace(',', '.').trim()) || 0,
                receiver_id: item.seller_entity_id || item.author_id,
                reference: `Tele-Oli: ${item.title}`
            });

            if (result.success) {
                // Vibració de confirmació segons el nou mandament [MASTER]
                hapticService.notifySuccess();

                setPaidItems(prev => new Set([...prev, itemId]));

                // Mostrem l'èxit bategat per un moment abans de netejar el loader si n'hi hagués
                setTimeout(() => {
                    setPayingItemId(null);
                    // Mantenim el check verd un moment més per a satisfacció de l'usuari
                    setTimeout(() => {
                        setPaidItems(prev => {
                            const next = new Set(prev);
                            next.delete(itemId);
                            return next;
                        });
                    }, 3000);
                }, 500);
            } else {
                alert(`Error en el bategat: ${result.error}`);
                setPayingItemId(null);
            }
        } catch (err) {
            logger.error('[Market] Payment error:', err);
            setPayingItemId(null);
        }
    };

    const handleRecipeClick = async (item) => {
        hapticService.batec();
        const loadingMsg = `👵 La Tia Maria està pensant una idea per a: ${item.title}...`;

        // Simple optimistic UI / Toast if available, but let's use a themed alert for now
        // to match the user's requested behavior.
        logger.info(loadingMsg);

        try {
            const result = await geminiService.getMarketRecipe(item.title, item.description);
            if (result.error) {
                alert("Ay fill, no m'escolte bé ara mateix.");
            } else {
                alert(`👵 LA TIA MARIA DIU:\n\n"${result.text}"`);
            }
        } catch (err) {
            logger.error('[Market] Recipe error:', err);
        }
    };

    const handleHeaderClick = (item) => {
        const targetId = item.author_entity_id || item.author_user_id || item.id;
        const type = item.author_entity_id ? 'entitat' : 'perfil';

        if (item.seller?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            String(targetId).startsWith('mock-business-sdp') ||
            targetId === 'socdepoble') {
            navigate('/entitat/socdepoble');
            return;
        }

        if (item.author_role === USER_ROLES.AMBASSADOR || item.author_is_ai || item.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }
        navigate(`/${type}/${targetId}`);
    };

    const [columnCount, setColumnCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (viewMode === 'list' || viewMode === 'single') return 1;
            if (width < 850) return 1;
            if (width < 1300) return 2;
            if (width < 1800) return 3;
            return 4;
        }
        return 1;
    });
    const containerRef = React.useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (viewMode === 'single' || viewMode === 'list') {
                    setColumnCount(1);
                } else {
                    if (width < 850) setColumnCount(1);
                    else if (width < 1300) setColumnCount(2);
                    else if (width < 1800) setColumnCount(3);
                    else setColumnCount(4);
                }
            }
        });
        
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [viewMode]);

    const rowCount = Math.ceil(filteredItems.length / columnCount);

    const virtualizer = useWindowVirtualizer({
        count: rowCount,
        estimateSize: () => viewMode === 'list' ? 80 : 900, // Estimació d'alçada: List (80px), Grid (900px)
        overscan: 3, 
    });

    if (loading && items.length === 0) {
        return (
            <div className="market-container">
                <div className="market-grid max-w-3xl mx-auto">
                    {[1, 2, 3, 4, 5, 6].map(i => <MarketSkeleton key={i} />)}
                </div>
            </div>
        );
    }



    return (
        <div className="market-container" ref={containerRef}>
            <SEO
                title={t('market.title') || 'El Mercat'}
                description={t('market.description') || 'Productes de proximitat, artesania i segona mà directament dels teus veïns.'}
                image="/og-mercat.png"
                url="/mercat"
                type="website"
                structuredData={{
                    "@type": "ItemList",
                    "name": "Productes del Mercat Local",
                    "itemListElement": filteredItems.slice(0, 10).map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Product",
                            "name": item.title,
                            "description": item.description,
                            "url": `https://socdepoble.org/mercat`,
                            "image": item.image_url || "https://socdepoble.org/og-mercat.png",
                            "offers": {
                                "@type": "Offer",
                                "price": item.price ? parseFloat(item.price.toString().replace('€','').replace(',','.')) || 0 : 0,
                                "priceCurrency": "EUR",
                                "seller": {
                                    "@type": "Organization",
                                    "name": item.seller_name || item.seller || 'Sóc de Poble'
                                }
                            }
                        }
                    }))
                }}
            />
            {/* Semantic Heading for SEO/A11y */}
            <h1 className="sr-only">Mercat de Proximitat de Sóc de Poble</h1>


            <div className="sticky top-0 w-full z-[100] shadow-md">
                <ContextualHeader
                    searchTerm={internalSearchTerm}
                    onSearchChange={setInternalSearchTerm}
                    viewMode={viewMode}
                    onViewModeChange={(mode) => {
                        setViewMode(mode);
                        localStorage.setItem('market_view_mode', mode);
                    }}
                    placeholder="Cerca al mercat..."
                />
            </div>



            {filteredItems.length === 0 ? (
                <StatusLoader
                    type="empty"
                    message={searchTerm ? `No s'ha trobat cap article per a "${searchTerm}"` : t('market.no_items')}
                    onRetry={null}
                />
            ) : (
                <div 
                    className={`market-list mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}
                    style={{
                        height: `${virtualizer.getTotalSize() + 36}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                        const startIndex = virtualRow.index * columnCount;
                        const rowItems = filteredItems.slice(startIndex, startIndex + columnCount);
                        
                        return (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className={`market-grid view-mode-${viewMode}`}
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
                                    paddingBottom: '24px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {rowItems.map(item => {
                                    const imageSources = item.image_url || item.images || item.image || '/images/assets/generic_market.png';
                                    return (
                                        <div key={item.uuid || item.id} className="card-rizoma-wrapper animate-in w-full h-full" style={{ height: '100%' }}>
                                            <UniversalCard
                                                item={item}
                                                title={item.title}
                                                excerpt={item.description}
                                                subtitle={item.seller_name || item.seller || 'Sóc de Poble'}
                                                image={imageSources}
                                                onHeaderClick={() => handleHeaderClick(item)}
                                                onRecipeClick={() => handleRecipeClick(item)}
                                                mode="mercat"
                                                className="market-item-standard"
                                                variant="mercat"
                                                viewMode={viewMode}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}

            {
                hasMore && items.length > 0 && (
                    <div className="load-more-container">
                        <button
                            className="btn-load-more"
                            onClick={() => loadMarketData(true)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Loader2 className="spinner" size={20} /> : t('common.load_more') || 'Carregar més'}
                        </button>
                    </div>
                )
            }

            {selectedItemForDetail && (
                <ItemDetailModal
                    item={selectedItemForDetail}
                    onClose={() => setSelectedItemForDetail(null)}
                    onAstroPayment={handleAstroPayment}
                />
            )}
        </div>
    );
};

export default Market;
