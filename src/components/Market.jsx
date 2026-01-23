import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { logger } from '../utils/logger';
import CategoryTabs from './CategoryTabs';
import MarketSkeleton from './Skeletons/MarketSkeleton';
import AddItemModal from './AddItemModal';
import './Market.css';

const Market = ({ townId = null }) => {
    const { t, i18n } = useTranslation();
    const { language } = useI18n(); // Usant I18nContext per a reactivitat neta
    const navigate = useNavigate();
    const { isPlayground, user, loading: authLoading } = useAuth();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('tot');

    useEffect(() => {
        let isMounted = true;
        const loadInitialData = async (isLoadMore = false) => {
            if (authLoading) return; // Gate

            if (isLoadMore) setLoadingMore(true);
            else {
                setLoading(true);
                setPage(0);
            }

            try {
                if (categories.length === 0) {
                    const cats = await supabaseService.getMarketCategories();
                    if (isMounted) {
                        setCategories(cats);
                    }
                }

                const currentPage = isLoadMore ? page + 1 : 0;
                const result = await supabaseService.getMarketItems(activeTab, townId, currentPage, 12, isPlayground);

                if (isMounted) {
                    if (isLoadMore) {
                        setItems(prev => [...prev, ...result.data]);
                        setPage(currentPage);
                    } else {
                        setItems(result.data);
                    }
                    setHasMore(items.length + result.data.length < result.count);
                }
            } catch (error) {
                if (isMounted) {
                    logger.error('Error fetching market data:', error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setLoadingMore(false);
                }
            }
        };

        if (!authLoading) {
            loadInitialData();
        }

        window.loadMoreMarket = () => loadInitialData(true);

        return () => {
            isMounted = false;
        };
    }, [activeTab, townId, isPlayground, authLoading]); // Fixed deps
    // Removed page, items.length, categories.length to avoid loops

    useEffect(() => {
        const handleRefresh = (e) => {
            if (e.detail?.type === 'market') {
                window.location.reload();
            }
        };
        window.addEventListener('data-refresh', handleRefresh);
        return () => window.removeEventListener('data-refresh', handleRefresh);
    }, []);

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const marketTabs = categories.length > 0
        ? categories.map(cat => {
            const langMap = {
                'va': cat.name_va,
                'es': cat.name_es,
                'en': cat.name_en,
                'gl': cat.name_gl,
                'eu': cat.name_eu
            };
            return {
                id: cat.slug,
                label: langMap[i18n.language] || cat.name_va
            };
        })
        : [
            { id: 'tot', label: t('market.all') || 'Tot' },
            { id: 'productes', label: t('market.products') || 'Productes' },
            { id: 'serveis', label: t('market.services') || 'Serveis' },
            { id: 'intercanvi', label: t('market.exchange') || 'Intercanvi' }
        ];

    if (loading && items.length === 0) {
        return (
            <div className="market-container">
                <div className="market-grid">
                    {[1, 2, 3, 4].map(i => <MarketSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="market-container">
            <header className="page-header-with-tabs">
                <div className="header-tabs-wrapper">
                    <CategoryTabs
                        selectedRole={activeTab}
                        onSelectRole={setActiveTab}
                        tabs={marketTabs}
                    />
                </div>
            </header>

            <div className="market-grid">
                {filteredItems.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('market.no_items') || 'No hi ha res al mercat encara.'}</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item.uuid} className="universal-card market-item">
                            <div
                                className="card-header clickable"
                                onClick={() => {
                                    if (item.author_entity_id) navigate(`/entitat/${item.author_entity_id}`);
                                    else if (item.author_user_id) navigate(`/perfil/${item.author_user_id}`);
                                }}
                            >
                                <div className="header-left">
                                    <div className="post-avatar" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                        {item.avatar_url ? (
                                            <img src={item.avatar_url} alt={`Avatar de ${item.seller}`} className="post-avatar-img" />
                                        ) : (
                                            <Plus size={20} aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="post-meta">
                                        <div className="post-author-row">
                                            <span className="post-author">
                                                {item.seller || item.seller_name || 'Usuari'}
                                            </span>
                                        </div>
                                        <div className="post-subtitle-row">
                                            <span className="post-time">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Avui'}</span>
                                            {item.towns?.name && <span className="post-location">• {item.towns.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-image-wrapper">
                                <img src={item.image_url} alt={`${item.title} - venut per ${item.seller}`} />
                            </div>

                            <div className="card-body">
                                <div className="item-header-info-row">
                                    <div className="item-info-left">
                                        <h3 className="item-title">{item.title}</h3>
                                        <p className="item-desc-short">{item.description || t('market.no_description')}</p>
                                    </div>
                                    <div className="item-info-right">
                                        <span className="price-tag-vibrant">{item.price}</span>
                                        {item.category_slug && (
                                            <span className="category-pill-mini">
                                                {categories.find(c => c.slug === item.category_slug)?.[
                                                    i18n.language === 'va' ? 'name_va' :
                                                        i18n.language === 'es' ? 'name_es' :
                                                            i18n.language === 'en' ? 'name_en' :
                                                                i18n.language === 'gl' ? 'name_gl' : 'name_eu'
                                                ] || item.tag || item.category_slug}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="item-footer-unified card-footer-vibrant">
                                <button
                                    className="add-btn-premium-vibrant full-width"
                                    aria-label={`${t('market.interested')} per ${item.title}`}
                                    onClick={() => {
                                        if (!user) navigate('/login');
                                        // Interest logic to be implemented
                                    }}
                                >
                                    <Plus size={18} />
                                    <span>{t('market.interested')}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {hasMore && items.length > 0 && (
                <div className="load-more-container">
                    <button
                        className="btn-load-more"
                        onClick={() => window.loadMoreMarket()}
                        disabled={loadingMore}
                    >
                        {loadingMore ? <Loader2 className="spinner" /> : t('common.load_more') || 'Carregar més'}
                    </button>
                </div>
            )}

        </div>
    );
};

export default Market;
