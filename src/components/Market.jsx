import { useState, useEffect, useCallback, useRef } from 'react';
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
import UnifiedStatus from './UnifiedStatus';
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
    const [error, setError] = useState(null);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const loadMarketData = useCallback(async (isLoadMore = false) => {
        if (authLoading) return; // Gate

        if (isLoadMore) setLoadingMore(true);
        else {
            setLoading(true);
            setPage(0);
        }
        setError(null);

        try {
            if (categories.length === 0) {
                const cats = await supabaseService.getMarketCategories();
                if (isMounted.current) {
                    setCategories(cats);
                }
            }

            const currentPage = isLoadMore ? page + 1 : 0;
            const result = await supabaseService.getMarketItems(activeTab, townId, currentPage, 12, isPlayground);

            if (isMounted.current) {
                if (isLoadMore) {
                    setItems(prev => [...prev, ...result.data]);
                    setPage(currentPage);
                } else {
                    setItems(result.data);
                }
                setHasMore(items.length + result.data.length < result.count);
            }
        } catch (error) {
            if (isMounted.current) {
                logger.error('Error fetching market data:', error);
                setError(error.message);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [authLoading, categories.length, page, activeTab, townId, isPlayground, items.length]);

    useEffect(() => {
        if (!authLoading) {
            loadMarketData();
        }
    }, [loadMarketData, authLoading]);
    // Removed page, items.length, categories.length to avoid loops

    useEffect(() => {
        const handleRefresh = (e) => {
            if (e.detail?.type === 'market') {
                loadMarketData();
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

    if (error) {
        return (
            <div className="market-container">
                <UnifiedStatus
                    type="error"
                    message={error}
                    onRetry={() => loadMarketData()}
                />
            </div>
        );
    }

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
                    <UnifiedStatus
                        type="empty"
                        message={searchTerm ? `No s'ha trobat cap article per a "${searchTerm}"` : t('market.no_items')}
                        onRetry={searchTerm ? () => setSearchTerm('') : null}
                    />
                ) : (
                    filteredItems.map(item => (
                        <article key={item.uuid || item.id} className="universal-card market-item-card">
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
                                            {(item.author_role === 'ambassador' || item.author_is_ai) && (
                                                <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                            )}
                                        </div>
                                        <div className="post-subtitle-row">
                                            <span className="post-time">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Avui'}</span>
                                            {item.towns?.name && <span className="post-location">• {item.towns.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {item.image_url && (
                                <div className="card-image-wrapper">
                                    <img src={item.image_url} alt={`${item.title} - venut per ${item.seller}`} />
                                </div>
                            )}

                            <div className="card-body">
                                <div className="market-price-row">
                                    <h3 className="item-title">{item.title}</h3>
                                    <span className="price-tag-vibrant">{item.price}</span>
                                </div>
                                <p className="item-desc-premium">{item.description || t('market.no_description')}</p>

                                {item.category_slug && (
                                    <div className="item-tags-row">
                                        <span className="category-pill-mini">
                                            {categories.find(c => c.slug === item.category_slug)?.[
                                                i18n.language === 'va' ? 'name_va' :
                                                    i18n.language === 'es' ? 'name_es' :
                                                        i18n.language === 'en' ? 'name_en' :
                                                            i18n.language === 'gl' ? 'name_gl' : 'name_eu'
                                            ] || item.tag || item.category_slug}
                                        </span>
                                    </div>
                                )}

                                {(item.author_role === 'ambassador' || item.author_is_ai) && (
                                    <div className="ia-transparency-note-mini">
                                        ✨ Producte gestionat per IAIA
                                    </div>
                                )}
                            </div>

                            <div className="card-footer-vibrant">
                                <button
                                    className="add-btn-premium-vibrant full-width"
                                    onClick={() => {
                                        if (!user) navigate('/login');
                                        // Interest logic here
                                    }}
                                >
                                    <Plus size={20} />
                                    <span>{t('market.interested')}</span>
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {hasMore && items.length > 0 && (
                <div className="load-more-container">
                    <button
                        className="btn-load-more"
                        onClick={() => loadMarketData(true)}
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
