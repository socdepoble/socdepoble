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
import StatusLoader from './StatusLoader';
import MarketSkeleton from './Skeletons/MarketSkeleton';
import SEO from './SEO';
import Carousel from './Carousel';
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
    const PAGE_SIZE = 100;

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
                isPlayground
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
        if (visionMode === 'humana' && !isSuperAdmin) {
            baseItems = baseItems.filter(item => {
                const idToCheck = String(item.seller_entity_id || item.author_entity_id || item.author_user_id || '');
                const nameToCheck = item.seller || item.seller_name || item.author_name || '';

                // 0. Explicit Name Blacklist (Ambassadors & Mock Businesses)
                // This captures cases where role/ID might be missing in DB items
                const BLACKLIST_NAMES = [
                    'Vicent Ferris', 'Lucía Belda', 'Elena Popova', 'Maria "Mèl"', 'Marc Sendra',
                    'Samir Mensah', 'Andreu Soler', 'Beatriz Ortega', 'Joanet Serra',
                    'Carmen la del Forn', 'Joan Batiste', 'Carla Soriano',
                    'Formatgeria la Vall', 'Cooperativa de la Torre', 'Sabors del Comtat',
                    'Destil·leries de la Serra', 'Forn de Muro', 'Abelles Mariola', 'Abelles de la Serra',
                    'Hort del Tio Pep'
                ];
                if (BLACKLIST_NAMES.some(name => nameToCheck.includes(name))) return false;

                // 1. Filter out AI/Ambassadors by Role/ID
                const isAI = item.author_role === 'ambassador' ||
                    item.author_is_ai ||
                    item.is_iaia_inspired ||
                    idToCheck.startsWith('11111111-');

                if (isAI) return false;

                // 2. Filter out Mock Data (Fake businesses) BUT keep Sóc de Poble official items
                const isMock = idToCheck.startsWith('mock-');
                const isOfficialSdP = idToCheck === 'mock-business-sdp-1' || item.seller === 'Sóc de Poble' || item.title?.includes('Camiseta');

                if (isMock && !isOfficialSdP) return false;

                // 3. Filter out IAIA specific IDs
                if ((item.uuid && String(item.uuid).startsWith('iaia-')) || (item.id && String(item.id).startsWith('iaia-'))) return false;

                // 4. Filter out ALL 0000 reserved IDs including the main system one (IAIA)
                if (idToCheck.startsWith('00000000-')) return false;

                return true;
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

    const handleHeaderClick = (item) => {
        const targetId = item.author_entity_id || item.author_user_id || item.id;
        const type = item.author_entity_id ? 'entitat' : 'perfil';

        // BLINDATGE DE LLINATGE: Si és Sóc de Poble, forcem l'ID canònic
        if (item.seller?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            String(targetId).startsWith('mock-business-sdp') ||
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        const IAIA_ID = '00000000-0000-0000-0000-000000000000'; // Define IAIA_ID if not already available or use role check
        // Si és la IAIA i estem en sessió real, la portem a la seua pàgina de transparència
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
                structuredData={{
                    "@type": "OfferCatalog",
                    "name": "Mercat de Sóc de Poble",
                    "itemListElement": filteredItems.slice(0, 5).map((item, index) => ({
                        "@type": "Product",
                        "position": index + 1,
                        "name": item.title,
                        "description": item.description,
                        "image": item.image_url,
                        "offers": {
                            "@type": "Offer",
                            "price": item.price?.replace('€', '').trim(),
                            "priceCurrency": "EUR",
                            "availability": "https://schema.org/InStock"
                        }
                    }))
                }}
            />
            {/* Semantic Heading for SEO/A11y */}
            <h1 className="sr-only">{t('market.title') || 'Mercat de Proximitat'}</h1>

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
                    <StatusLoader
                        type="empty"
                        message={searchTerm ? `No s'ha trobat cap article per a "${searchTerm}"` : t('market.no_items')}
                        onRetry={null}
                    />
                ) : (
                    filteredItems.map(item => (
                        <article key={item.uuid || item.id} className="universal-card market-item-card">
                            <div
                                className="card-header clickable"
                                onClick={() => handleHeaderClick(item)}
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

                            {item.title?.includes('Camiseta Oficial') ? (
                                <Carousel
                                    images={[
                                        '/images/campaign/night_party.png',
                                        '/images/campaign/young_man_tshirt.png',
                                        '/images/campaign/iaia_tshirt.png',
                                        item.image_url,
                                        '/images/agents/javi_real.png',
                                        '/images/campaign/group_tshirt.png',
                                        '/images/campaign/hiker.png',
                                        '/images/campaign/rustic_detail.png'
                                    ]}
                                    height="280px"
                                />
                            ) : (
                                item.image_url && (
                                    <div className="card-image-wrapper">
                                        <img src={item.image_url} alt={`${item.title} - venut per ${item.seller}`} />
                                    </div>
                                )
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

                                {(item.author_role === 'ambassador' || item.author_is_ai || item.is_iaia_inspired) && (
                                    <div className="ia-transparency-note-mini clickable" onClick={() => navigate('/iaia')}>
                                        ✨ {t('profile.transparency_market') || 'Producte gestionat per la IAIA (Informació Artificial i Acció)'}
                                    </div>
                                )}
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
