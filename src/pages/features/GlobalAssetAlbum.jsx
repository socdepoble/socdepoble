import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../../core/services/supabaseService';
import { logger } from '../../utils/logger';
import { ArrowLeft, LayoutGrid, Calendar, Brain } from 'lucide-react';
import StatusLoader from '../../components/ui/StatusLoader';
import brainMediaData from '../../data/brain_media.json';
import './GlobalAssetAlbum.css';

const GlobalAssetAlbum = () => {
    const navigate = useNavigate();
    const [dbMediaItems, setDbMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // grid, timeline, brain

    useEffect(() => {
        const loadGlobalMedia = async () => {
            try {
                setIsLoading(true);
                const data = await supabaseService.getGlobalMedia();
                setDbMediaItems(data || []);
            } catch (err) {
                logger.error('[GlobalAssetAlbum] Error loading global media:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadGlobalMedia();
    }, []);

    const activeItems = viewMode === 'brain' ? brainMediaData : dbMediaItems;

    if (isLoading) return <StatusLoader type="loading" message="Sincronitzant l'Àlbum Global..." />;

    return (
        <div className="global-album-page anim-fade-in bg-[#FDF5E6] dark:bg-[#0a0a0a] min-h-screen text-black dark:text-white pb-20">
            <div role="region" aria-label="Capçalera de Secció" className="global-album-header p-4 border-b border-black/10 dark:border-white/10">
                <div className="header-top flex items-center mb-6">
                    <button className="back-btn mr-4 p-2 bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 transition-colors" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="header-title-wrapper flex-1">
                        <h1 className="text-2xl font-black uppercase tracking-tight">Àlbum Global del Poble</h1>
                        <p className="text-sm opacity-60">Totes les imatges i records compartits a la xarxa.</p>
                    </div>
                </div>

                <div className="header-tabs flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <button
                        className={`header-tab flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/10'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={18} /> Galeria
                    </button>
                    <button
                        className={`header-tab flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${viewMode === 'timeline' ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/10'}`}
                        onClick={() => setViewMode('timeline')}
                    >
                        <Calendar size={18} /> Cronologia
                    </button>
                    <button
                        className={`header-tab flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${viewMode === 'brain' ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/10'}`}
                        onClick={() => setViewMode('brain')}
                    >
                        <Brain size={18} /> Records de la IAIA
                    </button>
                </div>
            </div>

            <div role="region" aria-label="Contingut Principal" className="global-album-content p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeItems.map((item, index) => (
                        <div key={item.id || index} className="relative aspect-square bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden group border border-black/10 dark:border-white/10 cursor-pointer hover:border-orange-500 transition-colors">
                            <img 
                                src={item.media_url || item.url} 
                                alt={item.title || item.id} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            {viewMode === 'brain' && (
                                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] font-mono truncate">{item.title}</p>
                                    <p className="text-[9px] opacity-70">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {activeItems.length === 0 && (
                    <div className="text-center py-20 opacity-50">
                        <p>No hi ha imatges per mostrar en aquesta vista.</p>
                    </div>
                )}
            </div>

            {/* FLOATING ACTION BADGE - Sóc de Poble Style */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl z-50">
                <span>Vist per {activeItems.length} records autèntics</span>
            </div>
        </div>
    );
};

export default GlobalAssetAlbum;
