import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import { ROLES } from '../constants';
import AddItemModal from './AddItemModal';
import CategoryTabs from './CategoryTabs';

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
                    try {
                        const favorites = await supabaseService.getMarketFavorites(item.id);
                        favoritesState[item.id] = favorites.includes(user.id);
                    } catch (error) {
                        console.error(`Error loading favorites for item ${item.id}:`, error);
                        favoritesState[item.id] = false;
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
                    items.map(item => (
                        <div key={item.id} className="market-item">
                            <div className="item-image">
                                <img src={item.image_url} alt={item.title} />
                                <span className="item-tag">{item.tag}</span>
                                <button
                                    className={`fav-btn ${userFavorites[item.id] ? 'active' : ''}`}
                                    onClick={() => handleFavorite(item.id)}
                                >
                                    <Heart size={20} fill={userFavorites[item.id] ? "#e91e63" : "none"} />
                                </button>
                            </div>
                            <div className="item-details">
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-seller">{item.seller}</p>
                                <div className="item-footer">
                                    <span className="item-price">{item.price}</span>
                                    <button className="add-btn">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Market;
