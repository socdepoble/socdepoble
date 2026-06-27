import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../core/services/supabaseService';
import { marketService } from '../core/services/marketService';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { Landmark, History, Zap, Store, Sparkles, Library, ArrowLeft } from 'lucide-react';
import NanoLoader from '../components/NanoLoader';
import { UniversalGridWrapper, UniversalGridRow } from '../components/UniversalGrid';
import UniversalCard from '../components/UniversalCard';

const getCollectionConfig = (id) => {
    switch (id) {
        case 'rentonar': return { name: 'El Rentonar', icon: <Landmark size={32} />, color: '#10B981', desc: 'Reviscu l\'arxiu del blog històric de la Torre de les Maçanes. Cròniques, reflexions i cultura popular recuperades amb tot el seu format original.', bgData: '/assets/brand/antigravity_badge.png' };
        case 'historia': return { name: 'Història Viva', icon: <History size={32} />, color: '#CC5500', desc: 'Cròniques i apunts d\'anys i panys. Un arxiu en construcció constant.', bgData: '/assets/brand/antigravity_badge.png' };
        case 'fadrins': return { name: 'Comissió Fadrins', icon: <Zap size={32} />, color: '#00F2FF', desc: 'El batec jove i la festa, els programes de festes d\'ahir i els preparatius de demà.', bgData: '/assets/brand/antigravity_badge.png' };
        case 'mercat': return { name: 'Arxiu Mercat', icon: <Store size={32} />, color: '#F97316', desc: 'El comerç, l\'artifici i el lliure intercanvi. Un passeig pels safarejos comercials.', bgData: '/assets/brand/antigravity_badge.png' };
        case 'master': return { name: 'Llegat Master', icon: <Sparkles size={32} />, color: '#8B5CF6', desc: 'El tresor del diamants absoluts. Documents fundacionals del sistema Sóc de Poble i més.', bgData: '/assets/brand/antigravity_badge.png' };
        default: return { name: 'Catàleg Desconegut', icon: <Library size={32} />, color: '#FFFFFF', desc: 'Recull de memòria sense assignar.', bgData: '/assets/brand/antigravity_badge.png' };
    }
};

const CollectionLanding = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const config = getCollectionConfig(id);

    useEffect(() => {
        const loadObjects = async () => {
            setLoading(true);
            try {
                // Fetch from Supabase
                const [postsResponse, itemsResponse] = await Promise.all([
                    supabaseService.getPosts('tot', null, 0, 100),
                    marketService.getMarketItems('tot', null, 0, 100)
                ]);

                const dbPosts = postsResponse?.data || [];
                const dbItems = itemsResponse?.data || [];

                // Filter Logic identical to Archive, but ONLY for this collection
                const historicalPosts = MOCK_FEED.filter(p => 
                    p.id.toString().includes('rentonar') || 
                    p.author?.includes('Rentonar') || 
                    p.author?.includes('Javi Llinares') ||
                    p.type === 'didactic_presentation'
                );

                const legacyItems = MOCK_MARKET_ITEMS.filter(i => i.type === 'memory' || i.is_pinned);

                const unified = [
                    ...dbPosts.map(p => ({
                        id: p.uuid || p.id,
                        type: 'post',
                        title: p.content?.substring(0, 80).replace(/[#*]/g, '') + (p.content?.length > 80 ? '...' : ''),
                        description: "Crònica bategada al mur del poble.",
                        author: p.profiles?.username || p.author || 'Foraster',
                        date: p.created_at,
                        tags: p.tags || ['#comunitat'],
                        image: (Array.isArray(p.image_url) ? p.image_url[0] : p.image_url) || '/assets/brand/antigravity_badge.png',
                        collection: p.author?.includes('Rentonar') ? 'rentonar' : 'historia'
                    })),
                    ...historicalPosts.map(p => ({
                        id: p.id,
                        type: 'legacy_post',
                        title: p.content?.split('\n')[0].replace(/[#*]/g, '') || 'Sense títol',
                        description: p.content?.substring(0, 120).replace(/[#*]/g, '') + '...',
                        author: p.author,
                        date: p.created_at || '2024-01-01',
                        tags: p.tags || ['#llegat', '#arxiu'],
                        image: (Array.isArray(p.image_url) ? p.image_url[0] : p.image_url) || '/assets/brand/antigravity_badge.png',
                        collection: p.author?.includes('Rentonar') ? 'rentonar' : 'master'
                    })),
                    ...dbItems.map(i => ({
                        id: i.uuid || i.id,
                        type: 'product',
                        title: i.title,
                        description: i.description,
                        author: i.profiles?.username || i.seller || 'Comerç',
                        date: i.created_at,
                        tags: ['#mercat'],
                        image: (Array.isArray(i.images) ? i.images[0] : i.image_url) || '/assets/brand/antigravity_badge.png',
                        collection: 'mercat'
                    })),
                    ...legacyItems.map(i => ({
                        id: i.id,
                        type: 'legacy_market',
                        title: i.title,
                        description: i.description,
                        author: i.seller,
                        date: i.created_at || '2024-01-01',
                        tags: ['#llegat', '#mercat'],
                        image: (Array.isArray(i.images) ? i.images[0] : i.image_url) || '/assets/brand/antigravity_badge.png',
                        collection: 'mercat'
                    }))
                ];

                // Remove duplicates by ID natively
                const uniqueObjects = Array.from(new Map(unified.map(item => [item.id, item])).values());
                const filtered = uniqueObjects.filter(item => item.collection === id);
                setItems(filtered);
            } catch (err) {
                console.error('[CollectionLanding] Error fetching items', err);
            } finally {
                setLoading(false);
            }
        };
        loadObjects();
    }, [id]);

    if (loading) return <NanoLoader />;

    return (
        <div className="w-full min-h-[100dvh] bg-black text-white relative font-sans overflow-x-hidden">
            {/* HERO SECTION GEM MODERN */}
            <div className="relative w-full h-[55vh] md:h-[65vh] flex flex-col justify-end p-6 md:p-12 overflow-hidden rounded-b-3xl">
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(${config.bgData})`, filter: 'brightness(0.6) contrast(1.1) saturate(1.2)' }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                
                {/* Tornar */}
                <button 
                    onClick={() => navigate('/arxiu')}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                >
                    <ArrowLeft size={18} />
                    <span>Tornar a l'Arxiu</span>
                </button>

                <div className="relative z-10 max-w-4xl w-full">
                    <div 
                        className="inline-flex items-center justify-center p-3 mb-4 sm:mb-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl"
                        style={{ color: config.color }}
                    >
                        {config.icon}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-3 sm:mb-4 break-words hyphens-auto" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
                        {config.name}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl font-light mb-6 sm:mb-8 leading-relaxed break-words">
                        {config.desc}
                    </p>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="w-full p-2 md:p-6 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl font-bold">Monografies i Registres ({items.length})</h2>
                    </div>

                    <UniversalGridWrapper viewMode="masonry" columnCount={3}>
                        {items.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-white/50 border border-dashed border-white/20 rounded-3xl">
                                Cap document trobat en aquesta col·lecció.
                            </div>
                        ) : (
                            items.map(item => (
                                <UniversalGridRow key={item.id}>
                                    <UniversalCard 
                                        resource={{
                                            ...item,
                                            // Ensure specific sources get a UI treatment
                                            metadata: { ...(item.metadata || {}), sourceCollection: config.name }
                                        }} 
                                        viewMode="masonry" 
                                        hideAuthor={true}
                                    />
                                </UniversalGridRow>
                            ))
                        )}
                    </UniversalGridWrapper>
                </div>
            </div>
        </div>
    );
};

export default CollectionLanding;
