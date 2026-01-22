import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Plus, Loader2, Store } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import { ROLES } from '../constants';
import AddItemModal from './AddItemModal';
import CategoryTabs from './CategoryTabs';
import './Market.css';

const Market = ({ townId = null, hideHeader = false }) => {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFavorites, setUserFavorites] = useState({}); // { itemId: boolean }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(ROLES.ALL);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getMarketItems(selectedRole, townId);
            setItems(data);

            if (user) {
                const favoritesState = {};
                for (const item of data) {
                    const iid = item.uuid || item.id;
                    try {
                        const favorites = await supabaseService.getMarketFavorites(iid);
                        favoritesState[iid] = favorites.includes(user.id);
                    } catch (error) {
                        console.error(`Error loading favorites for item ${iid}:`, error);
                        favoritesState[iid] = false;
                    }
                }
                setUserFavorites(favoritesState);
            }
        } catch (error) {
            console.error('Error fetching market items:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedRole, user, townId]);

    useEffect(() => {
        fetchItems();
    }, [selectedRole, fetchItems]);

    useEffect(() => {
        const handleOpenModal = () => setIsModalOpen(true);
        window.addEventListener('open-add-market-item', handleOpenModal);
        return () => window.removeEventListener('open-add-market-item', handleOpenModal);
    }, []);

    const handleFavorite = async (itemId) => {
        if (!user) return alert('Has d\'iniciar sessió per a marcar favorits');

        try {
            const { favorited } = await supabaseService.toggleMarketFavorite(itemId, user.id);
            setUserFavorites(prev => ({ ...prev, [itemId]: favorited }));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };


    const marketTabs = [
        { id: ROLES.ALL, label: t('common.role_mercat') },
        { id: ROLES.PEOPLE, label: t('common.role_gent') },
        { id: ROLES.GROUPS, label: t('common.role_grup') },
        { id: ROLES.BUSINESS, label: t('common.role_empresa') },
        { id: ROLES.OFFICIAL, label: t('common.role_oficial') || t('common.role_pobo') }
    ];

    if (loading && items.length === 0) {
        return (
            <div className="market-container loading">
                <Loader2 className="spinner" />
                <p>{t('market.loading_market')}</p>
            </div>
        );
    }

    return (
        <div className="market-container">
            {!hideHeader && (
                <header className="page-header-with-tabs">
                    <div className="header-tabs-wrapper-with-fab">
                        <CategoryTabs
                            selectedRole={selectedRole}
                            onSelectRole={setSelectedRole}
                            tabs={marketTabs}
                        />
                    </div>
                </header>
            )}

            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onItemCreated={fetchItems}
            />

            <div className="market-grid">
                {items.length === 0 ? (
                    <p className="empty-message">{t('market.empty')}</p>
                ) : (
                    items.map(item => {
                        const iid = item.uuid || item.id;
                        return (
                            <div key={iid} className="universal-card market-item">
                                <div className="card-header">
                                    <div className="header-left">
                                        <div className="post-avatar" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                            {item.seller_avatar ? (
                                                <img
                                                    src={item.seller_avatar}
                                                    alt={item.seller}
                                                    className="post-avatar-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<div class="avatar-placeholder-mini"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>';
                                                    }}
                                                />
                                            ) : <Store size={20} />}
                                        </div>
                                        <div className="post-meta">
                                            <span className="post-author">{item.seller}</span>
                                            <span className="post-time">{item.tag}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={`fav-btn-clean ${userFavorites[iid] ? 'active' : ''}`}
                                        onClick={() => handleFavorite(iid)}
                                    >
                                        <Heart size={20} fill={userFavorites[iid] ? "#e91e63" : "none"} stroke={userFavorites[iid] ? "#e91e63" : "currentColor"} />
                                    </button>
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
                                            <span className="category-pill-mini">#{item.tag}</span>
                                        </div>
                                    </div>

                                    <div className="item-footer-unified">
                                        <button className="add-btn-premium-vibrant">
                                            <Plus size={18} />
                                            <span>Interessat</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Market;
