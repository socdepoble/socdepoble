import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Landmark, Ticket, Globe, MessageCircle, Briefcase, Users, Building, TreePine, Castle, Plus, Minus, Navigation, X, Map as MapIcon, Layers, Check, Activity } from 'lucide-react';
import { resolveImageUrl } from '../../utils/urlHelper';
import { useUnifiedFeedData } from '../../hooks/useUnifiedFeedData';
import { useAuth } from '../../app/context/AuthContext';
import { useDesign } from '../../app/context/DesignContext';
import { useMap, Map as GoogleMap, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useViewMode } from '../../hooks/useViewMode';
import SystemPageLayout from '../../components/layout/SystemPageLayout';
import ContextualHeader from '../../components/layout/ContextualHeader';
import BlueprintOverlay from '../../components/ui/BlueprintOverlay';
import Feed from '../../components/features/Feed';
import './Map.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const LIBRARIES = ['marker'];

const AVAILABLE_CATEGORIES = [
  { id: 'esdeveniments', label: 'Events', icon: Ticket },
  { id: 'mur', label: 'Mur', icon: MessageCircle },
  { id: 'mercat', label: 'Mercat', icon: Store },
  { id: 'pobles', label: 'Pobles', icon: Globe },
  { id: 'comercios', label: 'Comerços i empreses', icon: Briefcase },
  { id: 'asociaciones', label: 'Associacions', icon: Users },
  { id: 'ayuntamientos', label: 'Ajuntaments', icon: Landmark },
  { id: 'entidades', label: 'Entitats', icon: Building },
  { id: 'arboles', label: 'Arbres monumentals', icon: TreePine },
  { id: 'patrimonio', label: 'Patrimoni', icon: Castle }
];

const TOWN_COORDINATES = {
    'latorre': { lat: 38.6042, lng: -0.4266 },
    'penaguila': { lat: 38.6781, lng: -0.3582 },
    'benifallim': { lat: 38.6331, lng: -0.3983 },
    'sella': { lat: 38.6083, lng: -0.2721 },
    'orxeta': { lat: 38.5630, lng: -0.2618 },
    'relleu': { lat: 38.5878, lng: -0.3114 },
    'alcoleja': { lat: 38.6811, lng: -0.3314 },
    'xixona': { lat: 38.5398, lng: -0.5085 },
    'tibi': { lat: 38.5306, lng: -0.5761 }
};

const TownPin = ({ colorClass, label }) => (
    <div className="flex flex-row items-center animate-bounce-slow hover:scale-110 transition-transform cursor-pointer relative -top-[40px] -left-[20px] pointer-events-auto w-max">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]`}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="currentColor"/></svg>
        <span className="bg-theme-panel text-theme-text text-base lg:text-lg font-black tracking-wide px-4 py-2 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] ml-1 border-none whitespace-nowrap">{label}</span>
    </div>
);

const PostPin = ({ imageUrl, type, category, tags }) => {
    let Icon = MessageCircle;
    let bgColor = 'bg-[#F97316]';
    
    const isEsdeveniment = type === 'event_announcement' || type === 'esdeveniment';
    const isMercat = type === 'mercat';
    const tagsLower = Array.isArray(tags) ? tags.map(t => t.toLowerCase()) : [];
    const catLower = category ? category.toLowerCase() : '';

    if (isEsdeveniment) { Icon = Ticket; bgColor = 'bg-rose-500'; }
    else if (isMercat) { Icon = Store; bgColor = 'bg-emerald-500'; }
    else if (tagsLower.includes('comerç') || catLower.includes('comerç')) { Icon = Briefcase; bgColor = 'bg-amber-500'; }
    else if (tagsLower.includes('associació') || catLower.includes('associació')) { Icon = Users; bgColor = 'bg-purple-500'; }
    else if (tagsLower.includes('ajuntament') || catLower.includes('ajuntament')) { Icon = Landmark; bgColor = 'bg-blue-500'; }
    else if (tagsLower.includes('entitat') || catLower.includes('entitat')) { Icon = Building; bgColor = 'bg-cyan-500'; }
    else if (tagsLower.includes('arbre') || catLower.includes('arbre')) { Icon = TreePine; bgColor = 'bg-green-600'; }
    else if (tagsLower.includes('patrimoni') || catLower.includes('patrimoni')) { Icon = Castle; bgColor = 'bg-stone-500'; }

    return (
        <div className={`w-12 h-12 rounded-[20px] border-none shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-visible bg-theme-panel hover:scale-125 transition-transform cursor-pointer relative z-40 flex items-center justify-center pointer-events-auto ring-2 ring-white/20`}>
            {imageUrl ? (
                <>
                    <img 
                        src={imageUrl} 
                        className="w-full h-full rounded-[20px] object-cover bg-theme-base text-[10px]" 
                        alt="Pin" 
                        onError={(e) => { 
                            const fallbackSrc = '/uploads/avatars/nano_llibre_memoria.png';
                            if (!e.target.src.includes(fallbackSrc)) {
                                e.target.src = fallbackSrc;
                            } else {
                                e.target.style.display = 'none';
                            }
                        }}
                    />
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full ${bgColor} flex items-center justify-center shadow-lg border-2 border-theme-panel`}>
                        <Icon className="text-white w-3 h-3" />
                    </div>
                </>
            ) : (
                <div className={`w-full h-full rounded-[20px] ${bgColor} flex items-center justify-center`}>
                    <Icon className="text-white w-5 h-5" />
                </div>
            )}
        </div>
    );
};

const InteractiveControls = ({ isPlacingPost, setIsPlacingPost, isAccessible }) => {
    const map = useMap();
    
    const handleLocation = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!map) return;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    map.panTo(pos);
                    map.setZoom(15);
                },
                () => alert("No hem pogut trobar la teua ubicació. Comprova els permisos del navegador.")
            );
        } else {
            alert("El teu navegador no suporta geolocalització.");
        }
    };

    const handleZoomIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (map) {
            map.setZoom(map.getZoom() + 1);
        }
    };

    const handleZoomOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (map) {
            map.setZoom(map.getZoom() - 1);
        }
    };

    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[10]">
            {/* Botons de Zoom */}
            {isAccessible && (
                <div className="flex flex-col gap-2 mb-2 bg-theme-panel rounded-[24px] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                    <button 
                        onClick={handleZoomIn}
                        className="flex items-center justify-center w-12 h-12 rounded-[18px] bg-theme-base text-theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-95"
                        title="Apropar"
                        aria-label="Apropar el mapa"
                    >
                        <Plus className="w-8 h-8 font-black" />
                    </button>
                    <div className="h-[1px] w-full bg-border-master opacity-30"></div>
                    <button 
                        onClick={handleZoomOut}
                        className="flex items-center justify-center w-12 h-12 rounded-[18px] bg-theme-base text-theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-95"
                        title="Allunyar"
                        aria-label="Allunyar el mapa"
                    >
                        <Minus className="w-8 h-8 font-black" />
                    </button>
                </div>
            )}

            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlacingPost(!isPlacingPost); }}
                className={`flex items-center justify-center w-14 h-14 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-transform active:scale-95 ${isPlacingPost ? 'bg-[#F97316] text-white' : 'bg-theme-panel text-theme-text/90 hover:brightness-110'}`}
                title="Geolocalitzar un nou post"
            >
                <Plus className="w-7 h-7" />
            </button>
            <button 
                onClick={handleLocation}
                className="flex items-center justify-center w-14 h-14 bg-theme-panel text-theme-text/90 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:brightness-110 transition-transform active:scale-95"
                title="Troba la meua ubicació"
            >
                <Navigation className="w-6 h-6" />
            </button>
        </div>
    );
};

const Map = () => {
    const navigate = useNavigate();
    const { blueprintMode } = useDesign();
    const { user, isPlayground } = useAuth();
    const [mapSearch, setMapSearch] = useState('');
    const { viewMode, setViewMode } = useViewMode('map_view_mode', 'grid');
    const [isPlacingPost, setIsPlacingPost] = useState(false);
    const [isAccessible, setIsAccessible] = useState(() => localStorage.getItem('sp_accessibility') === 'true');

    React.useEffect(() => {
        const handleAccessibilityChange = (e) => {
            setIsAccessible(e.detail.isAccessible);
        };
        window.addEventListener('accessibilityChanged', handleAccessibilityChange);
        return () => window.removeEventListener('accessibilityChanged', handleAccessibilityChange);
    }, []);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(AVAILABLE_CATEGORIES.map(c => c.id));
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const { posts: unifiedPosts, loading } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

    const filteredUnifiedPosts = React.useMemo(() => {
        return unifiedPosts.filter(p => {
            const isEsdeveniment = p.type === 'event_announcement' || p.type === 'esdeveniment';
            const isMur = p.type === 'post' || !p.type;
            const isMercat = p.type === 'mercat';
            const tags = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : [];
            const category = p.category ? p.category.toLowerCase() : '';

            // Check if matches selected filters
            if (selectedCategories.includes('esdeveniments') && isEsdeveniment) return true;
            if (selectedCategories.includes('mur') && isMur) return true;
            if (selectedCategories.includes('mercat') && isMercat) return true;
            
            // Text matching for specific niches
            const matchesNiche = (nicheId, keywords) => {
                if (!selectedCategories.includes(nicheId)) return false;
                return keywords.some(k => tags.includes(k) || category.includes(k));
            };

            if (matchesNiche('comercios', ['comerç', 'comercio', 'empresa', 'negocio'])) return true;
            if (matchesNiche('asociaciones', ['associació', 'asociación'])) return true;
            if (matchesNiche('ayuntamientos', ['ajuntament', 'ayuntamiento'])) return true;
            if (matchesNiche('entidades', ['entitat', 'entidad'])) return true;
            if (matchesNiche('arboles', ['arbre monumental', 'arbol', 'arbre'])) return true;
            if (matchesNiche('patrimonio', ['patrimoni', 'patrimonio', 'monument'])) return true;
            if (selectedCategories.includes('pobles') && p.town) return true;

            return false;
        });
    }, [unifiedPosts, selectedCategories]);

    const activeMarkers = React.useMemo(() => {
        return filteredUnifiedPosts.map(p => {
            let lat = parseFloat(p.lat);
            let lng = parseFloat(p.lng);
            
            // If missing coords, attempt to infer from town
            if (isNaN(lat) || isNaN(lng)) {
                const townId = p.town?.toLowerCase() || '';
                let matchedTown = null;
                for (const key of Object.keys(TOWN_COORDINATES)) {
                    if (townId.includes(key) || (p.tags && p.tags.some(t => t.toLowerCase().includes(key)))) {
                        matchedTown = key;
                        break;
                    }
                }
                if (matchedTown) {
                    const coords = TOWN_COORDINATES[matchedTown];
                    // Derive a pseudo-random offset based on ID so it's consistent
                    const seedStr = (p.id || p.uuid || Math.random()).toString();
                    let hash = 0;
                    for (let i = 0; i < seedStr.length; i++) hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
                    
                    const randomLat = coords.lat + (Math.sin(hash) * 0.008);
                    const randomLng = coords.lng + (Math.cos(hash) * 0.008);
                    lat = randomLat;
                    lng = randomLng;
                }
            }
            return { ...p, lat, lng, position: { lat, lng } };
        }).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
    }, [filteredUnifiedPosts]);

    const handleMapClick = (e) => {
        if (isPlacingPost && e.detail.latLng) {
            alert(`Has seleccionat les coordenades: Lat ${e.detail.latLng.lat.toFixed(4)}, Lng ${e.detail.latLng.lng.toFixed(4)}\n(Açò obrirà el formulari de nou post prompte)`);
            setIsPlacingPost(false);
        } else {
            setSelectedPost(null);
        }
    };



    return (
        <>
        <SystemPageLayout
            className="map-page-container"
            containerClassName="flex flex-col relative"
            header={
                <div className="flex flex-col w-full">
                    <ContextualHeader
                        searchTerm={mapSearch}
                        onSearchChange={setMapSearch}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        placeholder="Cerca al mapa..."
                    />
                </div>
            }
        >

            <div className="map-content-area w-full max-w-[1600px] mx-auto p-0 md:p-8">
                <div className={`relative w-full h-[60vh] min-h-[500px] max-h-[850px] md:rounded-[40px] overflow-hidden bg-theme-panel border-none group shadow-2xl`}>
                    {blueprintMode && <BlueprintOverlay label="MAP_VIEW" info="Interactive Placeholder" color="green" />}
                    
                    {/* Native Google Maps Engine */}
                    <div className="absolute inset-0 z-0 map-container-custom">
                        {GOOGLE_MAPS_API_KEY ? (
                            <GoogleMap
                                defaultCenter={{ lat: 38.6042, lng: -0.4266 }}
                                defaultZoom={12}
                                mapId="DEMO_MAP_ID"
                                disableDefaultUI={true}
                                gestureHandling={isAccessible ? 'none' : 'greedy'}
                                onClick={handleMapClick}
                                style={{ width: '100%', height: '100%' }}
                            >
                                {/* Main Markers */}
                                {selectedCategories.includes('pobles') && (
                                    <>
                                        <AdvancedMarker position={TOWN_COORDINATES.latorre} onClick={() => navigate('/pobles/gent-de-la-torre')}><TownPin colorClass="text-orange-500" label="La Torre de les Maçanes" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.penaguila} onClick={() => navigate('/pobles/gent-de-penaguila')}><TownPin colorClass="text-indigo-500" label="Penàguila" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.benifallim} onClick={() => navigate('/pobles/gent-de-benifallim')}><TownPin colorClass="text-emerald-500" label="Benifallim" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.sella} onClick={() => navigate('/pobles/gent-de-sella')}><TownPin colorClass="text-blue-400" label="Sella" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.orxeta} onClick={() => navigate('/pobles/gent-de-orxeta')}><TownPin colorClass="text-yellow-500" label="Orxeta" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.relleu} onClick={() => navigate('/pobles/gent-de-relleu')}><TownPin colorClass="text-red-500" label="Relleu" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.alcoleja} onClick={() => navigate('/pobles/gent-de-alcoleja')}><TownPin colorClass="text-green-500" label="Alcoleja" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.xixona} onClick={() => navigate('/pobles/gent-de-xixona')}><TownPin colorClass="text-amber-600" label="Xixona" /></AdvancedMarker>
                                        <AdvancedMarker position={TOWN_COORDINATES.tibi} onClick={() => navigate('/pobles/gent-de-tibi')}><TownPin colorClass="text-cyan-500" label="Tibi" /></AdvancedMarker>
                                    </>
                                )}

                                {/* Dynamic Post Markers */}
                                {activeMarkers.map((post, index) => {
                                    const rawUrl = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.image || post.seo_image || post.header_image_url || post.logo_url || post.avatar_url);
                                    const imgUrl = resolveImageUrl(rawUrl);
                                    const lat = parseFloat(post.lat);
                                    const lng = parseFloat(post.lng);
                                    
                                    if (isNaN(lat) || isNaN(lng)) return null;

                                    return (
                                        <AdvancedMarker 
                                            key={`post-${post.id || post.uuid || index}`}
                                            position={post.position}
                                            onClick={() => setSelectedPost(post)}
                                        >
                                            <PostPin imageUrl={imgUrl} type={post.type} category={post.category} tags={post.tags} />
                                        </AdvancedMarker>
                                    );
                                })}

                                {/* InfoWindow for selected post */}
                                {selectedPost && selectedPost.lat && selectedPost.lng && (
                                    <InfoWindow
                                        position={{ lat: parseFloat(selectedPost.lat), lng: parseFloat(selectedPost.lng) }}
                                        onCloseClick={() => setSelectedPost(null)}
                                    >
                                         <div 
                                             className="text-center min-w-[140px] p-3 cursor-pointer bg-theme-panel rounded-[20px] transition-transform active:scale-95 shadow-xl border border-border-master" 
                                             onClick={() => navigate(selectedPost.type === 'mercat' ? `/mercat/${selectedPost.id || selectedPost.uuid}` : `/post/${selectedPost.id || selectedPost.uuid}`)}
                                         >
                                             <h4 className="text-base font-black block text-theme-text line-clamp-2 leading-tight m-0 tracking-wide">
                                                 {selectedPost.title || selectedPost.content?.substring(0, 30) + '...'}
                                             </h4>
                                             <span className="text-[11px] text-[#F97316] mt-2 block font-bold uppercase tracking-wider">PEL {selectedPost.author}</span>
                                         </div>
                                    </InfoWindow>
                                )}

                                <InteractiveControls isPlacingPost={isPlacingPost} setIsPlacingPost={setIsPlacingPost} isAccessible={isAccessible} />
                            </GoogleMap>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-theme-panel p-8 text-center decoration-none relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]"></div>
                                <MapIcon className="w-16 h-16 mb-6 text-[#F97316] drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10" />
                                <h3 className="text-3xl font-black text-theme-text mb-3 tracking-tight z-10">Radar Desconnectat</h3>
                                <p className="max-w-md text-theme-text/60 text-sm leading-relaxed mb-8 z-10 font-medium">
                                    Per activar l'experiència immersiva de la cartografia V12 de Sóc de Poble, es requereix una <strong className="text-theme-text">API Key de Google Maps</strong>.
                                </p>
                                <div className="bg-theme-base p-5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-border-master w-full max-w-sm z-10 group transition-all">
                                    <p className="text-[11px] text-theme-text/50 font-mono text-left mb-2 uppercase font-bold tracking-widest">.env.local</p>
                                    <code className="block w-full text-left text-[#F97316] bg-theme-panel p-3 rounded-[16px] text-sm overflow-x-auto whitespace-nowrap shadow-inner font-mono font-medium">
                                        VITE_GOOGLE_MAPS_API_KEY=AIzA...
                                    </code>
                                </div>
                            </div>
                        )}
                    </div>

                    {isPlacingPost && (
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#F97316] text-white font-black px-6 py-3 rounded-[20px] shadow-[0_10px_40px_rgba(249,115,22,0.4)] z-[20] animate-pulse tracking-wide text-sm whitespace-nowrap border-none">
                            Clica en qualsevol punt del mapa per afegir
                        </div>
                    )}

                    {/* Filters */}
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-[calc(100%-80px)] pr-6 no-scrollbar z-[10] p-1 items-center">
                        <button 
                            onClick={() => setIsFilterModalOpen(true)}
                            className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[#F97316] text-white rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        
                        {AVAILABLE_CATEGORIES.filter(c => selectedCategories.includes(c.id)).map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button 
                                    key={cat.id}
                                    onClick={() => setSelectedCategories(prev => prev.filter(id => id !== cat.id))}
                                    className="flex items-center h-10 px-4 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap group"
                                >
                                    <Icon className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> 
                                    {cat.label}
                                    <X className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Category Selection Modal */}
                    {isFilterModalOpen && (
                        <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none p-4 md:p-8">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsFilterModalOpen(false)} />
                            <div className="relative bg-theme-panel w-full max-w-md mx-auto rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] pointer-events-auto flex flex-col animate-slide-up-custom border border-border-master max-h-[80vh]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-theme-text tracking-tight flex items-center gap-2">
                                        <Layers className="w-6 h-6 text-[#F97316]" />
                                        Filtres del Mapa
                                    </h3>
                                    <button onClick={() => setIsFilterModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-base text-theme-text hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 space-y-2 pr-2">
                                    <div className="flex gap-2 mb-4">
                                        <button 
                                            onClick={() => setSelectedCategories(AVAILABLE_CATEGORIES.map(c => c.id))}
                                            className="flex-1 bg-theme-base hover:bg-theme-base/80 text-theme-text text-[15px] font-black py-2.5 rounded-[12px] border border-border-master transition-colors"
                                        >
                                            Tots
                                        </button>
                                        <button 
                                            onClick={() => setSelectedCategories([])}
                                            className="flex-1 bg-theme-base hover:bg-theme-base/80 text-theme-text text-[15px] font-black py-2.5 rounded-[12px] border border-border-master transition-colors"
                                        >
                                            Cap
                                        </button>
                                    </div>
                                    {AVAILABLE_CATEGORIES.map(cat => {
                                        const Icon = cat.icon;
                                        const isSelected = selectedCategories.includes(cat.id);
                                        return (
                                            <button 
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategories(prev => 
                                                        isSelected ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                                    );
                                                }}
                                                className={`w-full flex items-center justify-between p-2 rounded-[16px] transition-all active:scale-95 ${isSelected ? 'bg-theme-base border border-[#F97316] shadow-sm' : 'bg-theme-base/50 border border-transparent hover:bg-theme-base'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#F97316] text-white' : 'bg-theme-panel text-theme-muted'}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className={`font-black text-[14px] tracking-wide ${isSelected ? 'text-[#F97316]' : 'text-theme-text'}`}>
                                                        {cat.label}
                                                    </span>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#F97316] bg-[#F97316]' : 'border-theme-muted'}`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="pt-4 border-t border-border-master">
                                    <button 
                                        onClick={() => setIsFilterModalOpen(false)}
                                        className="w-full bg-[#F97316] text-white font-black rounded-[20px] py-3 shadow-[0_8px_24px_rgba(249,115,22,0.4)] active:scale-95 transition-transform uppercase tracking-wider text-sm"
                                    >
                                        Aplicar Filtres
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mur Unificat Inferior */}
            <div className="unified-feed-container w-full max-w-[1600px] mx-auto mt-6 px-4 md:px-8 bg-transparent">
                <div className="py-4 flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black flex items-center gap-3 text-theme-text tracking-tight">
                        <Activity size={24} className="text-[#F97316]" />
                        Pols del Territori
                    </h2>
                    <span className="px-4 py-1.5 bg-theme-panel rounded-[12px] text-xs font-black text-theme-muted tracking-wider uppercase border border-border-master shadow-sm">
                        {filteredUnifiedPosts.length} registres
                    </span>
                </div>
            
                {loading ? (
                    <div className="flex justify-center p-12">
                        <span className="animate-pulse text-[#F97316] font-bold tracking-widest text-sm uppercase">Sincronitzant Radar...</span>
                    </div>
                ) : (
                    <div className="bg-transparent pb-24">
                        <Feed 
                            hideHeader={true} 
                            customPosts={filteredUnifiedPosts} 
                            externalViewMode={viewMode} 
                        />
                    </div>
                )}
            </div>
        </SystemPageLayout>
        </>
    );
};

export default Map;
