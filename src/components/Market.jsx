import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Market.css';

const Market = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase
                .from('market_items')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching items:', error);
            } else {
                setItems(data);
            }
            setLoading(false);
        };

        fetchItems();
    }, []);

    if (loading) {
        return (
            <div className="market-container loading">
                <Loader2 className="spinner" />
                <p>Carregant el mercat...</p>
            </div>
        );
    }

    return (
        <div className="market-container">
            <header className="page-header">
                <h1>Mercat</h1>
            </header>

            <div className="market-grid">
                {items.length === 0 ? (
                    <p className="empty-message">No hi ha productes en el mercat.</p>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="market-item">
                            <div className="item-image">
                                <img src={item.image_url} alt={item.title} />
                                <span className="item-tag">{item.tag}</span>
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
