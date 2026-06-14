import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/context/AuthContext';
import { logger } from '../../utils/logger';
import { ROLES } from '../../constants';
import './CreatePostModal.css'; // Use unified modal styles

import { marketService } from '../../core/services/marketService';
const AddItemModal = ({
  isOpen,
  onClose,
  onItemCreated,
  isPrivateInitial = false,
  isPlayground = false
}) => {
  const {
    t
  } = useTranslation();
  const {
    profile,
    user,
    impersonatedProfile
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(isPrivateInitial ? 'groups' : 'public');
  const [formData, setFormData] = React.useReducer((state, action) => {
    // [10/10] Optimitza les mutacions parciais:
    return typeof action === 'function' ? action(state) : {
      ...state,
      ...action
    };
  }, {
    title: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    stock_quantity: 1,
    tax_class: 'standard',
    product_type: 'physical',
    is_downloadable: false,
    tag: 'Producte',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    // Placeholder
    video_url: null
  });
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const handleCapture = media => {
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
    name: impersonatedProfile ? impersonatedProfile.full_name : profile?.full_name || 'Jo',
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
  const handleSubmit = async e => {
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
        author_name: selectedIdentity.type === 'user' ? profile.full_name : `${selectedIdentity.name} | ${profile.full_name}`,
        author_avatar_url: selectedIdentity.avatar_url,
        price: parseFloat(formData.price.toString().replace(/[^\d.]/g, '')) || 0,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price.toString().replace(/[^\d.]/g, '')) || 0 : null,
        sku: formData.sku || 'EMPTY',
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        tax_class: formData.tax_class,
        product_type: formData.product_type,
        is_downloadable: formData.is_downloadable,
        author_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
        author_role: selectedIdentity.type === 'user' ? ROLES.PEOPLE : selectedIdentity.type
      };
      await marketService.createMarketItem(newItem, isPlayground);
      onItemCreated();
      onClose();
    } catch (error) {
      logger.error('Error adding item:', error);
      alert('Error al publicar l\'article');
    } finally {
      setLoading(false);
    }
  };
  return <div className="m3-dialog-overlay" onClick={onClose}>
            <div className="m3-dialog-content animate-in-up" onClick={e => e.stopPropagation()}>
                <div role="region" aria-label="Capçalera de Secció" className="m3-dialog-header">
                    <button className="m3-icon-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <div className="header-title-group">
                        <h2 className="m3-headline-small">{t('market.sell_title') || 'Publicar al Mercat'}</h2>
                    </div>
                    <button className="m3-button-text" onClick={handleSubmit} disabled={loading || !formData.title || !formData.price}>
            
                        {loading ? 'Publicant...' : 'PUBLICAR'}
                    </button>
                </div>

                <div className="m3-dialog-body scrollable">
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <EntitySelector currentIdentity={selectedIdentity} onSelectIdentity={setSelectedIdentity} mini={true} />
            
                        <button type="button" className="bg-white/5 p-2 rounded-[28px] hover:bg-white/10 transition-colors" onClick={() => {
            const flow = ['public', 'groups', 'private'];
            const next = flow[(flow.indexOf(privacy) + 1) % 3];
            setPrivacy(next);
          }} title={t(`common.${privacy}`)}>
              
                            {privacy === 'public' ? <Globe size={18} /> : privacy === 'groups' ? <Users size={18} /> : <Lock size={18} />}
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <label htmlFor="market-item-title" className="sr-only">Títol de l'article</label>
                            <input id="market-item-title" name="market_title" type="text" className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30" placeholder={t('market.item_title') || 'Títol de l\'article'} value={formData.title} onChange={e => setFormData({
              ...formData,
              title: e.target.value
            })} required />
              
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="market-item-price" className="sr-only">Preu</label>
                                <input id="market-item-price" name="market_price" type="text" className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30" placeholder={t('market.price') || 'Preu (ex: 5€)'} value={formData.price} onChange={e => setFormData({
                ...formData,
                price: e.target.value
              })} required />
                
                            </div>
                            <div className="flex-1">
                                <label htmlFor="market-item-tag" className="sr-only">Categoria</label>
                                <input id="market-item-tag" list="market-tags-list" name="market_tag" className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30" placeholder={t('common.tag') || 'Etiqueta (ex: Alimentació)'} value={formData.tag} onChange={e => setFormData({
                ...formData,
                tag: e.target.value
              })} />
                
                                <datalist id="market-tags-list">
                                    <option value="Producte" />
                                    <option value="Verdura" />
                                    <option value="Fruita" />
                                    <option value="Alimentació" />
                                    <option value="Frescos" />
                                    <option value="Turisme" />
                                    <option value="Souvenirs" />
                                    <option value="Artesania" />
                                    <option value="Llar" />
                                    <option value="Segona mà" />
                                </datalist>
                            </div>
                        </div>

                        {/* Virtual Store Extensió */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30" placeholder="Preu antic (Opcional)" value={formData.compare_at_price} onChange={e => setFormData({
                ...formData,
                compare_at_price: e.target.value
              })} />
                
                            </div>
                            <div className="flex-1">
                                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30" placeholder="Estoc" value={formData.stock_quantity} onChange={e => setFormData({
                ...formData,
                stock_quantity: e.target.value
              })} min="0" />
                
                            </div>
                            <div className="flex-1">
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30" placeholder="SKU" value={formData.sku} onChange={e => setFormData({
                ...formData,
                sku: e.target.value
              })} />
                
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <select className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white focus:outline-none focus:border-white/30" value={formData.tax_class} onChange={e => setFormData({
                ...formData,
                tax_class: e.target.value
              })}>
                  
                                    <option value="standard">IVA Estàndard (21%)</option>
                                    <option value="reduced">IVA Reduït (10%)</option>
                                    <option value="super_reduced">IVA Superreduït (4%)</option>
                                    <option value="exempt">Sense IVA / Exempt</option>
                                    <option value="second_hand">Béns Usats (REBU)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <select className="w-full bg-white/5 border border-white/10 rounded-[28px] p-4 text-white focus:outline-none focus:border-white/30" value={formData.product_type} onChange={e => setFormData({
                ...formData,
                product_type: e.target.value
              })}>
                  
                                    <option value="physical">Producte Físic</option>
                                    <option value="digital">Producte Digital</option>
                                    <option value="service">Servei</option>
                                </select>
                            </div>
                            <div className="flex-1 flex items-center px-4">
                                <label className="flex items-center gap-2 text-white cursor-pointer">
                                    <input type="checkbox" checked={formData.is_downloadable} onChange={e => setFormData({
                  ...formData,
                  is_downloadable: e.target.checked
                })} className="w-5 h-5 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900" />
                  
                                    És descarregable?
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="m3-editor-container mt-6">
                        <RichTextEditor value={formData.description} onChange={val => setFormData({
            ...formData,
            description: val
          })} placeholder={t('market.description_placeholder') || 'Descripció detallada de l\'article...'} minimal={true} />
            
                    </div>
                </div>

                <footer className="m3-dialog-footer border-t border-white/10 p-4">
                    <div className="flex items-center gap-4">
                        <button type="button" className="m3-icon-button" onClick={() => setIsCaptureOpen(true)}>
                            <Camera size={20} />
                        </button>
                        <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Foto/Vídeo de l'article</span>

                        {capturedMedia && <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold animate-in zoom-in ml-auto">
                                {capturedMedia.type === 'photo' ? <ImageIcon size={14} /> : <Video size={14} />}
                                Llest!
                                <button type="button" onClick={() => setCapturedMedia(null)} className="ml-1 hover:text-white"><X size={12} /></button>
                            </div>}
                    </div>
                </footer>
            </div>

            <CaptureStudio isOpen={isCaptureOpen} onClose={() => setIsCaptureOpen(false)} onCapture={handleCapture} mode="all" />
      
        </div>;
};
export default AddItemModal;