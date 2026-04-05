import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, MapPin, Navigation, Layers, Plus, Store, Landmark, Ticket, Activity, Globe, MessageCircle, Share2 } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import BlueprintOverlay from '../components/BlueprintOverlay';
import ContextualHeader from '../components/ContextualHeader';
import TranslationModal from '../components/TranslationModal';
import Feed from '../components/Feed';
import { useUnifiedFeedData } from '../hooks/useUnifiedFeedData';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { useViewMode } from '../hooks/useViewMode';
import SystemPageLayout from '../components/SystemPageLayout';
import SystemActionBar from '../components/SystemActionBar';
import './Map.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const TownPin = ({ colorClass, label }) => (
    <div className="flex flex-row items-center animate-bounce-slow hover:scale-110 transition-transform cursor-pointer relative -top-[40px] -left-[20px] pointer-events-auto w-max">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]`}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="currentColor"/></svg>
        <span className="bg-theme-panel text-theme-text text-base lg:text-lg font-black tracking-wide px-4 py-2 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] ml-1 border-none whitespace-nowrap">{label}</span>
    </div>
);

const PostPin = ({ imageUrl }) => (
    <div className="w-12 h-12 rounded-[20px] border-none shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden bg-theme-panel hover:scale-125 transition-transform cursor-pointer relative z-40 flex items-center justify-center pointer-events-auto ring-1 ring-[#F97316]/30">
        {imageUrl ? (
            <img 
                src={imageUrl} 
                className="w-full h-full object-cover bg-theme-base text-[10px]" 
                alt="Pin" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/brain/generations/nano_llibre_memoria.png'; }}
            />
        ) : (
            <div className="w-full h-full bg-[#F97316] flex items-center justify-center">
                <MapPin className="text-white w-5 h-5" />
            </div>
        )}
    </div>
);

const InteractiveControls = ({ isPlacingPost, setIsPlacingPost }) => {
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

    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[10]">
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
    const [selectedPost, setSelectedPost] = useState(null);
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);

    const { posts: unifiedPosts, loading } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

    const activeMarkers = React.useMemo(() => {
        return unifiedPosts.filter(p => p.lat && p.lng);
    }, [unifiedPosts]);

    const handleMapClick = (e) => {
        if (isPlacingPost && e.detail.latLng) {
            alert(`Has seleccionat les coordenades: Lat ${e.detail.latLng.lat.toFixed(4)}, Lng ${e.detail.latLng.lng.toFixed(4)}\n(Açò obrirà el formulari de nou post prompte)`);
            setIsPlacingPost(false);
        } else {
            setSelectedPost(null);
        }
    };

    // DeepSeek R1 Optimization: Memoize the actionBar to prevent O(n) diffing down the React tree on every Map re-render
    const systemActionBar = useMemo(() => <SystemActionBar />, []);

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
                    {systemActionBar}
                </div>
            }
        >

            <div className="map-content-area w-full max-w-[1600px] mx-auto p-0 md:p-8">
                <div className={`relative w-full h-[60vh] min-h-[500px] max-h-[850px] md:rounded-[40px] overflow-hidden bg-theme-panel border-none group shadow-2xl`}>
                    {blueprintMode && <BlueprintOverlay label="MAP_VIEW" info="Interactive Placeholder" color="green" />}
                    
                    {/* Native Google Maps Engine */}
                    <div className="absolute inset-0 z-0 map-container-custom">
                        {GOOGLE_MAPS_API_KEY ? (
                            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                                <GoogleMap
                                    defaultCenter={{ lat: 38.6042, lng: -0.4266 }}
                                    defaultZoom={12}
                                    mapId="DEMO_MAP_ID"
                                    disableDefaultUI={true}
                                    gestureHandling={'greedy'}
                                    onClick={handleMapClick}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    {/* Main Markers */}
                                    <AdvancedMarker position={{ lat: 38.6042, lng: -0.4266 }} onClick={() => navigate('/pobles/gent-de-la-torre')}><TownPin colorClass="text-orange-500" label="La Torre de les Maçanes" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6781, lng: -0.3582 }} onClick={() => navigate('/pobles/gent-de-penaguila')}><TownPin colorClass="text-indigo-500" label="Penàguila" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6331, lng: -0.3983 }} onClick={() => navigate('/pobles/gent-de-benifallim')}><TownPin colorClass="text-emerald-500" label="Benifallim" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6083, lng: -0.2721 }} onClick={() => navigate('/pobles/gent-de-sella')}><TownPin colorClass="text-blue-400" label="Sella" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5630, lng: -0.2618 }} onClick={() => navigate('/pobles/gent-de-orxeta')}><TownPin colorClass="text-yellow-500" label="Orxeta" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5878, lng: -0.3114 }} onClick={() => navigate('/pobles/gent-de-relleu')}><TownPin colorClass="text-red-500" label="Relleu" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.6811, lng: -0.3314 }} onClick={() => navigate('/pobles/gent-de-alcoleja')}><TownPin colorClass="text-green-500" label="Alcoleja" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5398, lng: -0.5085 }} onClick={() => navigate('/pobles/gent-de-xixona')}><TownPin colorClass="text-amber-600" label="Xixona" /></AdvancedMarker>
                                    <AdvancedMarker position={{ lat: 38.5306, lng: -0.5761 }} onClick={() => navigate('/pobles/gent-de-tibi')}><TownPin colorClass="text-cyan-500" label="Tibi" /></AdvancedMarker>

                                    {/* Dynamic Post Markers */}
                                    {activeMarkers.map((post, index) => {
                                        const imgUrl = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.image);
                                        const lat = parseFloat(post.lat);
                                        const lng = parseFloat(post.lng);
                                        
                                        if (isNaN(lat) || isNaN(lng)) return null;

                                        return (
                                            <AdvancedMarker 
                                                key={`post-${post.id || post.uuid || index}`}
                                                position={{ lat, lng }}
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                <PostPin imageUrl={imgUrl} />
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

                                    <InteractiveControls isPlacingPost={isPlacingPost} setIsPlacingPost={setIsPlacingPost} />
                                </GoogleMap>
                            </APIProvider>
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
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-full pr-6 no-scrollbar z-[10] p-1">
                        <button className="flex items-center h-10 px-5 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"><Store className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> Comerç</button>
                        <button className="flex items-center h-10 px-5 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"><Landmark className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> Patrimoni</button>
                        <button className="flex items-center h-10 px-5 bg-white dark:bg-[#1C1C1E] rounded-full text-[14px] font-black tracking-wide text-gray-900 dark:text-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2C2C2E] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"><Ticket className="w-[18px] h-[18px] mr-2 text-[#F97316]" /> Calendari</button>
                    </div>
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
                        {unifiedPosts.length} registres
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
                            customPosts={unifiedPosts} 
                            externalViewMode={viewMode} 
                        />
                    </div>
                )}
            </div>
        </SystemPageLayout>

        <TranslationModal 
            isOpen={isTranslationOpen} 
            onClose={() => setIsTranslationOpen(false)} 
            config={{ postId: 'mapa', title: 'Radar Sóc de Poble' }} 
        />
        </>
    );
};

export default Map;
