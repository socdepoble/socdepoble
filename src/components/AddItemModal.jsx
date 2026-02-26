import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Send, Loader2, Tag, Globe, Lock, Users, Video, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import { ROLES } from '../constants';
import CaptureStudio from './CaptureStudio';
import './CreatePostModal.css'; // Use unified modal styles

import EntitySelector from './EntitySelector';
import MasterEditor from './MasterEditor';

const AddItemModal = ({ isOpen, onClose, onItemCreated, isPrivateInitial = false, isPlayground = false }) => {
    const { t } = useTranslation();
    const { profile, user, impersonatedProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [privacy, setPrivacy] = useState(isPrivateInitial ? 'groups' : 'public');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        tag: 'Producte',
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', // Placeholder
        video_url: null
    });
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);
    const [capturedMedia, setCapturedMedia] = useState(null);

    const handleCapture = (media) => {
        setCapturedMedia(media);
        setIsCaptureOpen(false);
    };

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
                description: formData.description,
                image_url: capturedMedia?.type === 'photo' ? capturedMedia.url : formData.image_url,
                video_url: capturedMedia?.type === 'video' ? capturedMedia.url : formData.video_url,
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
        <div className="m3-dialog-overlay" onClick={onClose}>
            <div className="m3-dialog-content animate-in-up" onClick={e => e.stopPropagation()}>
                <header className="m3-dialog-header">
                    <button className="m3-icon-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <div className="header-title-group">
                        <h2 className="m3-headline-small">{t('market.sell_title') || 'Publicar al Mercat'}</h2>
                    </div>
                    <button
                        className="m3-button-text"
                        onClick={handleSubmit}
                        disabled={loading || !formData.title || !formData.price}
                    >
                        {loading ? 'Publicant...' : 'PUBLICAR'}
                    </button>
                </header>

                <div className="m3-dialog-body scrollable">
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <EntitySelector
                            currentIdentity={selectedIdentity}
                            onSelectIdentity={setSelectedIdentity}
                            mini={true}
                        />
                        <button
                            type="button"
                            className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"
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

                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <label htmlFor="market-item-title" className="sr-only">Títol de l'article</label>
                            <input
                                id="market-item-title"
                                name="market_title"
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                                placeholder={t('market.item_title') || 'Títol de l\'article'}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="market-item-price" className="sr-only">Preu</label>
                                <input
                                    id="market-item-price"
                                    name="market_price"
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                                    placeholder={t('market.price') || 'Preu (ex: 5€)'}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="market-item-tag" className="sr-only">Categoria</label>
                                <select
                                    id="market-item-tag"
                                    name="market_tag"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30 appearance-none"
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

                    <div className="m3-editor-container mt-6">
                        <MasterEditor
                            value={formData.description}
                            onChange={(val) => setFormData({ ...formData, description: val })}
                            placeholder={t('market.description_placeholder') || 'Descripció detallada de l\'article...'}
                        />
                    </div>
                </div>

                <footer className="m3-dialog-footer border-t border-white/10 p-4">
                    <div className="flex items-center gap-4">
                        <button type="button" className="m3-icon-button" onClick={() => setIsCaptureOpen(true)}>
                            <Camera size={20} />
                        </button>
                        <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Foto/Vídeo de l'article</span>

                        {capturedMedia && (
                            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold animate-in zoom-in ml-auto">
                                {capturedMedia.type === 'photo' ? <ImageIcon size={14} /> : <Video size={14} />}
                                <span>Llest!</span>
                                <button type="button" onClick={() => setCapturedMedia(null)} className="ml-1 hover:text-white"><X size={12} /></button>
                            </div>
                        )}
                    </div>
                </footer>
            </div>

            <CaptureStudio
                isOpen={isCaptureOpen}
                onClose={() => setIsCaptureOpen(false)}
                onCapture={handleCapture}
                mode="all"
            />
        </div>
    );
};

export default AddItemModal;
