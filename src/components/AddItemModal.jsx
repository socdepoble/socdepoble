import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Send, Loader2, Tag } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './AddItemModal.css';

const AddItemModal = ({ isOpen, onClose, onItemCreated }) => {
    const { t } = useTranslation();
    const { profile } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        tag: 'Producte',
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' // Placeholder
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price) return;

        setLoading(true);
        try {
            const newItem = {
                title: formData.title,
                price: formData.price.includes('€') ? formData.price : `${formData.price}€`,
                seller: profile?.full_name || 'Vendedor',
                image_url: formData.image_url,
                tag: formData.tag
            };

            await supabaseService.createMarketItem(newItem);
            onItemCreated();
            onClose();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error al publicar artículo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Vendre Article</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="market-form">
                    <div className="form-group">
                        <label>Títol de l'article</label>
                        <input
                            type="text"
                            placeholder="Ex: Tomates de l'horta"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Preu</label>
                            <input
                                type="text"
                                placeholder="Ex: 2€/kg"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Categoria</label>
                            <select
                                value={formData.tag}
                                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                            >
                                <option value="Producte">Producte</option>
                                <option value="Verdura">Verdura</option>
                                <option value="Fruita">Fruita</option>
                                <option value="Artesania">Artesania</option>
                                <option value="Segona mà">Segona mà</option>
                            </select>
                        </div>
                    </div>

                    <div className="image-upload-box">
                        <Camera size={24} />
                        <span>Afegeix una foto</span>
                    </div>

                    <div className="post-actions">
                        <button
                            type="submit"
                            className="submit-btn full-width"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="spinner" /> : <Send size={20} />}
                            Publicar Article
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
