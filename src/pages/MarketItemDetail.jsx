import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Zap, MapPin, User, Sparkles, Share2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import ImageCarousel from '../components/ImageCarousel';
import { MOCK_MARKET_ITEMS } from '../data';
import '../components/ItemDetailModal.css';

const MarketItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                // First check mock data for local items (like the Camiseta)
                const mockItem = MOCK_MARKET_ITEMS.find(m => m.id === id || m.id.toString() === id);
                if (mockItem) {
                    setItem(mockItem);
                    return;
                }

                // If not mock, fetch from Supabase
                const { data } = await supabaseService.getMarketItems({ id, limit: 1 });
                if (data && data.length > 0) {
                    setItem(data[0]);
                }
            } catch (error) {
                logger.error('[MarketItemDetail] Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <NanoLoader message="Preparant l'aparador..." />;
    if (!item) return <div className="error-page bg-theme-base min-h-screen text-white flex items-center justify-center">Article no trobat.</div>;

    const handleChatClick = () => {
        if (!user) {
            navigate('/registre?returnTo=' + encodeURIComponent(window.location.pathname));
            return;
        }
        navigate(`/chats/${item.seller_entity_id || item.author_user_id || item.author_id}`, {
            state: { interestedIn: item }
        });
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

    const imageSources = item.image_url || item.images || item.image || ['/images/assets/generic_market.png'];
    const imagesArray = Array.isArray(imageSources) ? imageSources : [imageSources];

    return (
        <div className="min-h-screen bg-theme-base text-white animate-in fade-in duration-300">
            <SEO 
                title={`${item.title} | Mercat Rural`}
                description={item.description}
                image={imagesArray[0]}
                type="product"
                structuredData={productSchema}
            />

            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-theme-base/90 backdrop-blur-md border-b border-white/10">
                <button className="p-2 -ml-2 text-white/70 hover:text-white" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="font-display font-black tracking-widest text-[#F97316]">MERCAT</div>
                <div className="w-10"></div> {/* Spacer for centering */}
            </header>

            <main className="pb-24 max-w-2xl mx-auto">
                {/* Carrusel d'Imatges */}
                <div className="w-full aspect-square bg-[#111111] border-b border-white/5 relative">
                    {imagesArray.length > 1 ? (
                        <ImageCarousel images={imagesArray} />
                    ) : (
                        <img src={imagesArray[0]} alt={item.title} className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Informació del Producte */}
                <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <h1 className="font-display text-2xl font-black leading-tight flex-1">{item.title}</h1>
                        <div className="text-2xl font-black text-[#F97316] whitespace-nowrap bg-[#F97316]/10 px-4 py-1 rounded-[28px] border border-[#F97316]/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            {item.price}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-wider mb-6">
                        <User size={16} />
                        <span>{item.seller_name || item.seller || 'Sóc de Poble'}</span>
                    </div>

                    <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-white/80 max-w-none mb-8 whitespace-pre-line">
                        {item.description}
                    </div>

                    {item.is_iaia_inspired && (
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-[24px] p-5 mb-8">
                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter text-[#0EA5E9] mb-2">
                                <Sparkles size={16} />
                                <span>SIMBIOSI Master [IAIA + VEÍ]</span>
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed">
                                Aquest contingut ha estat cuidat per l'IAIA per a estalviar temps al productor i que puga dedicar-se al camp. 🏛️🌾
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Sticky Action Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-theme-base/95 backdrop-blur-xl border-t border-white/10 z-50">
                <div className="max-w-2xl mx-auto flex gap-3">
                    <button
                        className="flex-1 bg-white text-black h-[56px] rounded-[28px] font-black tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-active active:scale-95 shadow-lg shadow-white/10"
                        onClick={handleChatClick}
                    >
                        <MessageCircle size={20} />
                        <span>PARLAR AMB EL VENEDOR</span>
                    </button>

                    <ShareHub
                        title={`${item.title} - El Mercat de Sóc de Poble`}
                        text={`Mira aquest producte de proximitat: ${item.title} per ${item.price}. Bateguem pel comerç local!`}
                        url={window.location.href}
                        customTrigger={
                            <button className="w-[56px] h-[56px] flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 rounded-[28px] text-white hover:bg-white/10 transition-active active:scale-95">
                                <Share2 size={22} />
                            </button>
                        }
                    />
                </div>
            </footer>
        </div>
    );
};

export default MarketItemDetail;
