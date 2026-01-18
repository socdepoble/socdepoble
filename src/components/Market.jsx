import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import AddItemModal from './AddItemModal';

const Market = () => {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFavorites, setUserFavorites] = useState({}); // { itemId: boolean }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchItems = async () => {
        try {
            const data = await supabaseService.getMarketItems();
            setItems(data);

            if (user) {
                const favState = {};
                for (const item of data) {
                    const favs = await supabaseService.getMarketFavorites(item.id);
                    favState[item.id] = favs.includes(user.id);
                }
                setUserFavorites(favState);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [user]);

    const handleFavorite = async (itemId) => {
        if (!user) return alert('Debes iniciar sesión para marcar favoritos');

        try {
            const { favorited } = await supabaseService.toggleMarketFavorite(itemId, user.id);
            setUserFavorites(prev => ({ ...prev, [itemId]: favorited }));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (loading) {
        return (
            <div className="market-container loading">
                <Loader2 className="spinner" />
                <p>{t('market.loading_market')}</p>
            </div>
        );
    }

    return (
        <div className="market-container">
            <header className="page-header">
                <h1>{t('market.title')}</h1>
                <button className="create-fab" onClick={() => setIsModalOpen(true)}>
                    <Plus size={24} />
                </button>
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
