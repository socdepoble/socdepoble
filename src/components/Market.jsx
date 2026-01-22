import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import CategoryTabs from './CategoryTabs';
import './Market.css';

const Market = ({ townId = null }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('tot');

    useEffect(() => {
        let isMounted = true; // Flag to track if the component is mounted
        const loadInitialData = async () => {
            setLoading(true);
            try {
                // Cargar categorías primero si no están cargadas
                if (categories.length === 0) {
                    const cats = await supabaseService.getMarketCategories();
                    if (isMounted) {
                        setCategories(cats);
                    }
                }

                const data = await supabaseService.getMarketItems(activeTab, townId);
                if (isMounted) {
                    setItems(data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching market data:', error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadInitialData();

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false when component unmounts
        };
    }, [activeTab, townId, categories.length]);

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const marketTabs = categories.length > 0
        ? categories.map(cat => {
            // Mapeo dinámico de idioma a columna de la DB
            const langMap = {
                'va': cat.name_va,
                'es': cat.name_es,
                'en': cat.name_en,
                'gl': cat.name_gl,
                'eu': cat.name_eu
            };
            return {
                id: cat.slug,
                label: langMap[i18n.language] || cat.name_va // Fallback a valencià
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
            <div className="market-container loading">
                <Loader2 className="spinner" />
                <p>{t('market.loading') || 'Carregant el mercat...'}</p>
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
                <div className="personal-tag-bar">
                    <div className="search-bar-mini">
                        <label htmlFor="market-search" className="sr-only">{t('market.search_placeholder') || 'Buscar al mercat'}</label>
                        <Search size={16} />
                        <input
                            type="text"
                            id="market-search"
                            name="market-search"
                            autoComplete="on"
                            placeholder={t('market.search_placeholder') || 'Buscar al mercat...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="market-grid">
                {filteredItems.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('market.no_items') || 'No hi ha res al mercat encara.'}</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item.uuid || item.id} className="universal-card market-item">
                            <div className="card-header">
                                <div className="header-left">
                                    <div className="post-avatar" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                        <Plus size={20} />
                                    </div>
                                    <div className="post-meta">
                                        <div className="post-author-row">
                                            <span
                                                className="post-author clickable"
                                                onClick={() => {
                                                    if (item.author_entity_id) navigate(`/entitat/${item.author_entity_id}`);
                                                    else if (item.author_user_id) navigate(`/perfil/${item.author_user_id}`);
                                                }}
                                            >
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
                                <img src={item.image_url} alt={item.title} />
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
                                <button className="add-btn-premium-vibrant full-width">
                                    <Plus size={18} />
                                    <span>{t('market.interested')}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Market;
