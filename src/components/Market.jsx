import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import AddItemModal from './AddItemModal';
import CategoryTabs from './CategoryTabs';

const Market = () => {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFavorites, setUserFavorites] = useState({}); // { itemId: boolean }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getMarketItems(selectedRole);
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
    }, [selectedRole, user]);

    useEffect(() => {
        fetchItems();
    }, [selectedRole, fetchItems]);

    const handleFavorite = async (itemId) => {
        if (!user) return alert('Debes iniciar sesión para marcar favoritos');

        try {
            const { favorited } = await supabaseService.toggleMarketFavorite(itemId, user.id);
            setUserFavorites(prev => ({ ...prev, [itemId]: favorited }));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

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
            <header className="page-header-with-tabs">
                <div className="header-top">
                    <h1>{t('market.title')}</h1>
                    <button className="create-fab-inline" onClick={() => setIsModalOpen(true)}>
                        <Plus size={24} />
                    </button>
                </div>
                <CategoryTabs
                    selectedRole={selectedRole}
                    onSelectRole={setSelectedRole}
                    exclude={['oficial']}
                />
            </header>

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
