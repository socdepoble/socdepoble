import React from 'react';
import { X, MessageCircle, Zap, MapPin, User, Sparkles, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShareHub from './ShareHub';
import { useAuth } from '../context/AuthContext';
import SEO from './SEO';
import './ItemDetailModal.css';

/**
 * ItemDetailModal [CINEMATOGRAPHIC RURALISM]
 * Mostra la informació completa d'un producte del mercat.
 */
const ItemDetailModal = ({ item, onClose, onAstroPayment }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    if (!item) return null;

    const handleChatClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/chats/${item.seller_entity_id || item.author_user_id || item.author_id}`, {
            state: { interestedIn: item }
        });
        onClose();
    };

    const productSchema = {
        "description": item.description,
        "category": item.category || 'Producte Rural',
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": item.price?.toString().replace(/[^\d.,]/g, '').replace(',', '.') || "0",
            "availability": "https://schema.org/InStock"
        },
        "seller": {
            "@type": "Organization",
            "name": item.seller_name || item.seller || 'Sóc de Poble'
        }
    };

    return (
        <div className="item-detail-overlay" onClick={onClose}>
            <SEO 
                title={`${item.title} | Mercat Rural`}
                description={item.description}
                image={item.image_url}
                type="product"
                structuredData={productSchema}
            />
            <div className="item-detail-container glass-morphism" onClick={e => e.stopPropagation()}>
                <button className="item-detail-close" onClick={onClose}>
                    <X size={28} />
                </button>

                <div className="item-detail-content">
                    {/* Multimèdia */}
                    <div className="item-detail-media">
                        <img
                            src={item.image_url || '/images/assets/generic_market.png'}
                            alt={item.title}
                            className="item-detail-img"
                        />
                        <div className="item-detail-price-badge">
                            {item.price}
                        </div>
                    </div>

                    {/* Informació */}
                    <div className="item-detail-info">
                        <header className="item-detail-header">
                            <span className="item-detail-category">{item.category || 'Producte Rural'}</span>
                            <h2 className="item-detail-title">{item.title}</h2>
                            <div className="item-detail-seller-row">
                                <User size={16} />
                                <span>{item.seller_name || item.seller || 'Gent de la Torre'}</span>
                            </div>
                        </header>

                        <div className="item-detail-body">
                            <p className="item-detail-description">{item.description}</p>

                            {item.is_iaia_inspired && (
                                <div className="ia-transparency-note mt-6 bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter text-cyan-400 mb-2">
                                        <Sparkles size={16} className="text-primary" />
                                        <span>SIMBIOSI Master [IAIA + VEÍ]</span>
                                    </div>
                                    <p className="text-[11px] opacity-70 leading-relaxed">
                                        Aquest contingut ha estat cuidat per l'IAIA per a estalviar temps al productor i que puga dedicar-se al camp. 🏛️🌾
                                    </p>
                                </div>
                            )}
                        </div>

                        <footer className="item-detail-footer">
                            <div className="item-detail-actions-grid">
                                <button
                                    className="btn-detail-chat bg-primary text-white"
                                    onClick={handleChatClick}
                                >
                                    <MessageCircle size={24} />
                                    <span>PARLAR AMB EL VENEDOR</span>
                                </button>

                                <button
                                    className="btn-detail-astro bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    onClick={() => onAstroPayment(item)}
                                >
                                    <Zap size={24} fill="currentColor" />
                                    <span>PAGAMENT ASTRO</span>
                                </button>
                            </div>

                            <div className="item-detail-share-row mt-4 flex justify-center">
                                <ShareHub
                                    title={`${item.title} - El Mercat de Sóc de Poble`}
                                    text={`Mira aquest producte de proximitat: ${item.title} per ${item.price}. Bateguem pel comerç local!`}
                                    url={`${window.location.origin}/mercat?id=${item.uuid || item.id}`}
                                />
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;
