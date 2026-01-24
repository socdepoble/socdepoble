import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Send, Loader2, Tag, Globe, Lock, Users } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import { logger } from '../utils/logger';
import './CreatePostModal.css'; // Use unified modal styles
import './AddItemModal.css';

import EntitySelector from './EntitySelector';

const AddItemModal = ({ isOpen, onClose, onItemCreated, isPrivateInitial = false, isPlayground = false }) => {
    const { t } = useTranslation();
    const { profile, user, impersonatedProfile } = useAuth();
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
        id: impersonatedProfile ? impersonatedProfile.id : 'user',
        name: impersonatedProfile ? impersonatedProfile.full_name : (profile?.full_name || 'Jo'),
        type: impersonatedProfile ? impersonatedProfile.role : 'user',
        avatar_url: impersonatedProfile ? impersonatedProfile.avatar_url : profile?.avatar_url
    });

    useEffect(() => {
        if (isOpen) {
            if (impersonatedProfile) {
                setSelectedIdentity({
                    id: impersonatedProfile.id,
                    name: impersonatedProfile.full_name,
                    type: impersonatedProfile.role,
                    avatar_url: impersonatedProfile.avatar_url
                });
            } else if (profile) {
                setSelectedIdentity({
                    id: 'user',
                    name: profile.full_name || 'Jo',
                    type: 'user',
                    avatar_url: profile.avatar_url
                });
            }
        }
    }, [isOpen, profile, impersonatedProfile]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price || loading) return;

        setLoading(true);
        try {
            const newItem = {
                title: formData.title,
                image_url: formData.image_url,
                tag: formData.tag,
                privacy: privacy,
                is_private: privacy !== 'public',

                author_id: user?.id,
                author_name: selectedIdentity.type === 'user'
                    ? profile.full_name
                    : `${selectedIdentity.name} | ${profile.full_name}`,
                author_avatar_url: selectedIdentity.avatar_url,

                price: parseFloat(formData.price.replace(/[^\d.]/g, '')) || 0,

                author_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
                author_role: selectedIdentity.type === 'user' ? ROLES.PEOPLE : selectedIdentity.type
            };

            await supabaseService.createMarketItem(newItem, isPlayground);
            onItemCreated();
            onClose();
        } catch (error) {
            logger.error('Error adding item:', error);
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

                <form onSubmit={handleSubmit} className="post-form-compact market-form-optimized">
                    <div className="post-identity-bar">
                        <EntitySelector
                            currentIdentity={selectedIdentity}
                            onSelectIdentity={setSelectedIdentity}
                            mini={true}
                        />
                        <div className="post-privacy-mini">
                            <button
                                type="button"
                                className={`privacy-toggle ${privacy}`}
                                onClick={() => {
                                    const flow = ['public', 'groups', 'private'];
                                    const next = flow[(flow.indexOf(privacy) + 1) % 3];
                                    setPrivacy(next);
                                }}
                                title={t(`common.${privacy}`)}
                            >
                                {privacy === 'public' ? <Globe size={18} /> :
                                    privacy === 'groups' ? <Users size={18} /> : <Lock size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="market-inputs-grid">
                        <div className="form-group-compact">
                            <input
                                type="text"
                                placeholder={t('market.item_title') || 'Títol de l\'article'}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row-compact">
                            <div className="form-group-compact">
                                <input
                                    type="text"
                                    placeholder={t('market.price') || 'Preu (ex: 5€)'}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group-compact">
                                <select
                                    value={formData.tag}
                                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                >
                                    <option value="Producte">{t('common.product') || 'Producte'}</option>
                                    <option value="Verdura">Verdura</option>
                                    <option value="Fruita">Fruita</option>
                                    <option value="Artesania">Artesania</option>
                                    <option value="Segona mà">Segona mà</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="post-footer-tools">
                        <div className="tools-left">
                            <button type="button" className="tool-btn">
                                <Camera size={20} />
                            </button>
                            <span className="tool-label-mini">{t('market.add_photo')}</span>
                        </div>

                        <button
                            type="submit"
                            className="btn-send-round"
                            disabled={!formData.title || !formData.price || loading}
                        >
                            {loading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
