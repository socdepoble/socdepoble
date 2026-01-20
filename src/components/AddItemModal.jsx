import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Send, Loader2, Tag, Globe, Lock, Users } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './AddItemModal.css';

import EntitySelector from './EntitySelector';

const AddItemModal = ({ isOpen, onClose, onItemCreated, isPrivateInitial = false }) => {
    const { t } = useTranslation();
    const { profile } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [privacy, setPrivacy] = useState(isPrivateInitial ? 'groups' : 'public');
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        tag: 'Producte',
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' // Placeholder
    });
    useEffect(() => {
        if (isOpen) {
            setPrivacy(isPrivateInitial ? 'groups' : 'public');
        }
    }, [isOpen, isPrivateInitial]);
    const [selectedIdentity, setSelectedIdentity] = useState({
        id: 'user',
        name: profile?.full_name || 'Jo',
        type: 'user',
        avatar_url: profile?.avatar_url
    });

    // Use useEffect for resetting identity when profile loads or modal opens
    useEffect(() => {
        if (isOpen && profile && selectedIdentity.id === 'user') {
            setSelectedIdentity({
                id: 'user',
                name: profile.full_name || 'Jo',
                type: 'user',
                avatar_url: profile.avatar_url
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, profile]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price) return;

        setLoading(true);
        try {
            const newItem = {
                title: formData.title,
                price: formData.price.includes('€') ? formData.price : `${formData.price}€`,
                image_url: formData.image_url,
                tag: formData.tag,
                privacy: privacy,
                is_private: privacy !== 'public',

                // Multi-Identidad Vendedor
                seller: selectedIdentity.name, // Display legacy
                seller_type: selectedIdentity.type === 'user' ? 'user' : 'entity',
                seller_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
                seller_role: selectedIdentity.type === 'user' ? 'gent' : selectedIdentity.type
            };

            await supabaseService.createMarketItem(newItem);
            onItemCreated();
            onClose();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error al publicar l\'article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{t('market.sell_title')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="market-form">
                    <div className="identity-selector-wrapper">
                        <EntitySelector
                            currentIdentity={selectedIdentity}
                            onSelectIdentity={setSelectedIdentity}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('market.item_title')}</label>
                        <input
                            type="text"
                            placeholder="Ex: Tomaques de l'horta"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('market.price')}</label>
                            <input
                                type="text"
                                placeholder="Ex: 2€/kg"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('market.category')}</label>
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
                        <span>{t('market.add_photo')}</span>
                    </div>

                    <div className="privacy-selector-container">
                        <label className="form-label-small">{t('common.privacy')}</label>
                        <div className="privacy-options">
                            <button
                                type="button"
                                className={`privacy-btn ${privacy === 'public' ? 'active' : ''}`}
                                onClick={() => setPrivacy('public')}
                            >
                                <Globe size={16} />
                                {t('common.public')}
                            </button>
                            <button
                                type="button"
                                className={`privacy-btn ${privacy === 'groups' ? 'active' : ''}`}
                                onClick={() => setPrivacy('groups')}
                            >
                                <Users size={16} />
                                {t('common.groups')}
                            </button>
                            <button
                                type="button"
                                className={`privacy-btn ${privacy === 'private' ? 'active' : ''}`}
                                onClick={() => setPrivacy('private')}
                            >
                                <Lock size={16} />
                                {t('common.private')}
                            </button>
                        </div>
                    </div>

                    <div className="post-actions">
                        <button
                            type="submit"
                            className="btn-primary full-width"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="spinner" /> : <Send size={20} />}
                            {t('market.publish')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
