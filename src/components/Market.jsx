import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import CategoryTabs from './CategoryTabs';
import UnifiedStatus from './UnifiedStatus';
import MarketSkeleton from './Skeletons/MarketSkeleton';
import SEO from './SEO';
import './Market.css';

const Market = ({ searchTerm = '' }) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { visionMode } = useUI();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState('tot');
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 12;

    const marketTabs = [
        { id: 'tot', label: t('market.tabs.all') || 'Tot', role: 'tot' },
        { id: 'producte-local', label: t('market.tabs.local') || 'Producte local', role: 'producte-local' },
        { id: 'artesania', label: t('market.tabs.crafts') || 'Artesania', role: 'artesania' },
        { id: 'segona-ma', label: t('market.tabs.secondhand') || 'Segona mà', role: 'segona-ma' }
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
        loadMarketData(false);
    }, [activeTab]);

    const loadMarketData = async (append = false) => {
        const currentPage = append ? page + 1 : 0;
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const { data, count } = await supabaseService.getMarketItems(
                activeTab,
                null,
                currentPage,
                PAGE_SIZE,
                true // isPlayground
            );

            if (append) {
                setItems(prev => [...prev, ...data]);
            } else {
                setItems(data);
            }

            setHasMore(data.length === PAGE_SIZE);
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
        if (visionMode === 'humana') {
            baseItems = baseItems.filter(item => {
                const isAI = item.author_role === 'ambassador' || item.author_is_ai || (item.author_user_id && item.author_user_id.startsWith('11111111-'));
                return !isAI;
            });
        }

        // 2. Search Filter
        if (!searchTerm) return baseItems;
        const normalizedSearch = searchTerm.toLowerCase();
        return baseItems.filter(item =>
            item.title?.toLowerCase().includes(normalizedSearch) ||
            item.description?.toLowerCase().includes(normalizedSearch) ||
            item.seller?.toLowerCase().includes(normalizedSearch)
        );
    }, [items, searchTerm, visionMode]);

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
            />
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
                                    const targetId = item.author_entity_id || item.author_user_id;
                                    const type = item.author_entity_id ? 'entitat' : 'perfil';

                                    if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
                                        console.warn('Navegació a perfil fictici no disponible:', targetId);
                                        return;
                                    }
                                    navigate(`/${type}/${targetId}`);
                                }}
                            >
                                <div className="header-left">
                                    <Avatar
                                        src={item.avatar_url}
                                        role={item.author_role}
                                        name={item.seller || item.seller_name}
                                        size={44}
                                    />
                                    <div className="post-meta">
                                        <div className="post-author-row">
                                            <span className="post-author">
                                                {item.seller || item.seller_name || item.author_name || 'Venedor'}
                                            </span>
                                            {(item.author_role === 'ambassador' || item.author_is_ai) && (
                                                <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                            )}
                                        </div>
                                        <div className="post-town">
                                            {item.towns?.name || 'Al teu poble'}
                                        </div>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <span className="post-time-right">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Avui'}</span>
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
                                <p className="item-desc-premium">{item.description || t('market.no_description') || 'Sense descripció'}</p>

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

                                <div className="ia-transparency-note-mini clickable" onClick={() => navigate('/iaia')}>
                                    ✨ {t('profile.transparency_market') || 'Producte gestionat per la IAIA (Informació Artificial i Acció)'}
                                </div>
                            </div>

                            <div className="card-footer-vibrant">
                                <button
                                    className="add-btn-premium-vibrant full-width"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!user) navigate('/login');
                                        // Interest logic here
                                    }}
                                >
                                    <Plus size={20} />
                                    <span>{t('market.interested') || 'M\'interessa'}</span>
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
                        {loadingMore ? <Loader2 className="spinner" size={20} /> : t('common.load_more') || 'Carregar més'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Market;
