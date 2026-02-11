import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2, MapPin, Sparkles, Filter, Zap, Check } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import CategoryTabs from './CategoryTabs';
import StatusLoader from './StatusLoader';
import MarketSkeleton from './Skeletons/MarketSkeleton';
import SEO from './SEO';
import Carousel from './Carousel';
import { iaiaService } from '../services/iaiaService';
import { rhizomeManager } from '../services/rhizomeManager';
import { paymentService } from '../services/paymentService';
import { hapticService } from '../services/hapticService';
import ShareHub from './ShareHub';
import ItemDetailModal from './ItemDetailModal';
import UniversalCard from './UniversalCard';
import './Marketplace.css';

const Market = ({ searchTerm = '' }) => {
    const { t, i18n } = useTranslation();
    const { user, isPlayground, isAdmin, isSuperAdmin } = useAuth();
    const { visionMode } = useUI();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState('tot');
    const [page, setPage] = useState(0);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(localStorage.getItem('isIAIAFiltering') === 'true');
    const PAGE_SIZE = 100;

    const marketTabs = [
        { id: 'tot', label: t('market.tabs.all') || 'Tot', role: 'tot' },
        { id: 'producte-local', label: t('market.tabs.local') || 'Producte local', role: 'producte-local' },
        { id: 'artesania', label: t('market.tabs.crafts') || 'Artesania', role: 'artesania' },
        { id: 'segona-ma', label: t('market.tabs.secondhand') || 'Segona mà', role: 'segona-ma' },
        { id: 'excedents', label: 'Excedents (Km 0)', role: 'excedents' }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await supabaseService.getMarketCategories();
                setCategories(cats);
            } catch (err) {
                logger.error('[Market] Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // [PILAR 1: INSTANT LOAD] - Bategat immediat des de la memòria local
        const cacheKey = `market_${activeTab}_global_0`;
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
    }, [activeTab]);

    const loadMarketData = async (append = false) => {
        const currentPage = append ? page + 1 : 0;
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const result = await supabaseService.getMarketItems(
                activeTab,
                null,
                currentPage,
                PAGE_SIZE,
                isPlayground
            );

            // [MASTER] Robust handling of { data, count } response
            const fetchedItems = result?.data || [];

            if (append) {
                setItems(prev => [...(Array.isArray(prev) ? prev : []), ...fetchedItems]);
            } else {
                setItems(fetchedItems);
            }

            setHasMore(fetchedItems.length === PAGE_SIZE);
            setPage(currentPage);
        } catch (err) {
            logger.error('[Market] Error loading market items:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const filteredItems = useMemo(() => {
        let baseItems = items;

        // 1. Vision Mode Filter
        if (visionMode === 'humana' && !isSuperAdmin) {
            baseItems = baseItems.filter(item => {
                const idToCheck = String(item.seller_entity_id || item.author_entity_id || item.author_user_id || '');
                const nameToCheck = item.seller || item.seller_name || item.author_name || '';

                const BLACKLIST_NAMES = [
                    'Vicent Ferris', 'Lucía Belda', 'Elena Popova', 'Maria "Mèl"', 'Marc Sendra',
                    'Samir Mensah', 'Andreu Soler', 'Beatriz Ortega', 'Joanet Serra',
                    'Carmen la del Forn', 'Joan Batiste', 'Carla Soriano',
                    'Formatgeria la Vall', 'Cooperativa de la Torre', 'Sabors del Comtat',
                    'Destil·leries de la Serra', 'Forn de Muro', 'Abelles Mariola', 'Abelles de la Serra',
                    'Hort del Tio Pep'
                ];
                if (BLACKLIST_NAMES.some(name => nameToCheck.includes(name))) return false;

                const isAI = item.author_role === 'ambassador' ||
                    item.author_is_ai ||
                    item.is_iaia_inspired ||
                    idToCheck.startsWith('11111111-');

                if (isAI) return false;

                const isMock = idToCheck.startsWith('mock-');
                const isOfficialSdP = idToCheck === 'mock-business-sdp-1' || item.seller === 'Sóc de Poble' || item.title?.includes('Camiseta');

                if (isMock && !isOfficialSdP) return false;
                if (idToCheck.startsWith('00000000-')) return false;

                return true;
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
        const normalizedSearch = searchTerm?.toLowerCase().trim();
        let result = normalizedSearch ? baseItems.filter(item =>
            item.title?.toLowerCase().includes(normalizedSearch) ||
            item.description?.toLowerCase().includes(normalizedSearch) ||
            item.seller?.toLowerCase().includes(normalizedSearch)
        ) : baseItems;

        // 4. [MASTER] Priority Sort (Pinned items first)
        const safeResult = Array.isArray(result) ? result : [];
        return [...safeResult].sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            if (a.pinned_position !== undefined && b.pinned_position !== undefined) {
                return a.pinned_position - b.pinned_position;
            }
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });
    }, [items, searchTerm, visionMode, isIAIAFiltering]);

    const [payingItemId, setPayingItemId] = useState(null);
    const [paidItems, setPaidItems] = useState(new Set());
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
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        if (item.author_role === 'ambassador' || item.author_is_ai || item.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }
        navigate(`/${type}/${targetId}`);
    };

    if (loading && items.length === 0) {
        return (
            <div className="market-container">
                <div className="market-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => <MarketSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="market-container">
            <SEO
                title={t('market.title') || 'El Mercat'}
                description={t('market.description') || 'Productes de proximitat, artesania i segona mà directament dels teus veïns.'}
                image="/og-mercat.png"
                url="/mercat"
                type="website"
            />
            {/* Semantic Heading for SEO/A11y */}
            <h1 className="sr-only">Mercat de Proximitat de Sóc de Poble</h1>

            <header className="page-header-with-tabs">
                <div className="header-top-actions px-4 pt-4 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Mercat Rural</h2>
                    <button
                        className="btn-vendre-sobrants bg-orange-500 text-black font-black px-4 py-2 rounded-none flex items-center gap-2 text-sm shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all"
                        onClick={() => {
                            hapticService.notifySuccess();
                            navigate('/vendre-excedent');
                        }}
                    >
                        <Plus size={18} strokeWidth={3} />
                        VENDRE SOBRANTS
                    </button>
                </div>
                <div className="header-tabs-wrapper mt-4">
                    <CategoryTabs
                        selectedRole={activeTab}
                        onSelectRole={setActiveTab}
                        tabs={marketTabs}
                    />
                </div>
            </header>

            {/* IAIA PORTERA TOGGLE [PILLAR 4] */}
            <div className="iaia-filter-bar px-4 py-3 flex justify-between items-center font-black border-b border-white/10 bg-black/60 backdrop-blur-2xl sticky top-14 z-20">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className={isIAIAFiltering ? "text-primary animate-pulse" : "text-white/40"} />
                    <span className={`text-xs tracking-widest uppercase ${isIAIAFiltering ? "text-primary" : "text-white"}`}>
                        IAIA PORTERA: <span className="opacity-60">{isIAIAFiltering ? "FILTRE KM 0" : "SENSE FILTRE"}</span>
                    </span>
                </div>
                <button
                    onClick={() => {
                        hapticService.bategat();
                        const next = !isIAIAFiltering;
                        setIsIAIAFiltering(next);
                        localStorage.setItem('isIAIAFiltering', next);
                    }}
                    className={`px-4 py-1.5 rounded-[18px] text-[10px] font-black tracking-tighter transition-all ${isIAIAFiltering ? 'bg-accent-violet text-white shadow-glow-violet' : 'bg-white/10 text-white'}`}
                >
                    {isIAIAFiltering ? "PAU RURAL" : "VEURE TOT"}
                </button>
            </div>

            <div className="market-grid">
                {filteredItems.length === 0 ? (
                    <StatusLoader
                        type="empty"
                        message={searchTerm ? `No s'ha trobat cap article per a "${searchTerm}"` : t('market.no_items')}
                        onRetry={null}
                    />
                ) : (
                    filteredItems.map(item => (
                        <UniversalCard
                            key={item.uuid || item.id}
                            item={item}
                            title={item.title}
                            excerpt={item.description}
                            subtitle={item.seller_name || item.seller || 'Veí de la Torre'}
                            image={item.image_url || '/images/assets/generic_market.png'}
                            onHeaderClick={() => handleHeaderClick(item)}
                            onRecipeClick={() => handleRecipeClick(item)}
                            mode="mercat"
                            className="market-item-standard"
                        />
                    ))
                )}
            </div>

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
