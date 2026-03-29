import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, MapPin, Navigation, Layers, Plus, Store, Landmark, Ticket, Activity } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import BlueprintOverlay from '../components/BlueprintOverlay';
import ContextualHeader from '../components/ContextualHeader';
import Feed from '../components/Feed';
import { useUnifiedFeedData } from '../hooks/useUnifiedFeedData';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { useViewMode } from '../hooks/useViewMode';
import './Map.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const TownPin = ({ colorClass, label }) => (
    <div className="flex flex-row items-center animate-bounce-slow hover:scale-110 transition-transform cursor-pointer relative -top-[40px] -left-[20px] pointer-events-auto w-max">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} drop-shadow-xl`}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#111827"/></svg>
        <span className="bg-[#111827]/95 backdrop-blur-md text-white text-base lg:text-lg font-black tracking-wide px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] ml-1 border border-white/20 whitespace-nowrap">{label}</span>
    </div>
);

const PostPin = ({ imageUrl }) => (
    <div className="w-10 h-10 rounded-full border-[3px] border-white shadow-xl overflow-hidden bg-slate-800 hover:scale-125 transition-transform cursor-pointer relative z-40 flex items-center justify-center pointer-events-auto">
        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[var(--theme-accent-primary)]"></div>}
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
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[999]">
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlacingPost(!isPlacingPost); }}
                className={`p-3 text-white border border-white/10 rounded-[28px] shadow-lg transition-colors ${isPlacingPost ? 'bg-orange-500' : 'bg-[#111827] hover:bg-slate-800'}`}
                title="Geolocalitzar un nou post"
            >
                <Plus className="w-6 h-6" />
            </button>
            <button 
                onClick={handleLocation}
                className="p-3 bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-lg hover:bg-slate-800 transition-colors"
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

    return (
        <div className="map-page-container flex flex-col items-center w-full">
            <div className="sticky top-0 w-full z-dropdown shadow-md">
                <ContextualHeader
                    searchTerm={mapSearch}
                    onSearchChange={setMapSearch}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholder="Cerca al mapa..."
                />
            </div>

            <div className="map-content-area w-full max-w-[1600px] mx-auto p-4 md:p-8">
                <div className={`relative w-full h-[50vh] min-h-[400px] max-h-[700px] rounded-[32px] overflow-hidden bg-blue-50 dark:bg-slate-900 border-2 border-slate-800 shadow-inner group`}>
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
                                        return (
                                            <AdvancedMarker 
                                                key={`post-${post.id || post.uuid || index}`}
                                                position={{ lat: post.lat, lng: post.lng }}
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                <PostPin imageUrl={imgUrl} />
                                            </AdvancedMarker>
                                        );
                                    })}

                                    {/* InfoWindow for selected post */}
                                    {selectedPost && selectedPost.lat && selectedPost.lng && (
                                        <InfoWindow
                                            position={{ lat: selectedPost.lat, lng: selectedPost.lng }}
                                            onCloseClick={() => setSelectedPost(null)}
                                        >
                                            <div 
                                                className="text-center min-w-[120px] p-2 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors" 
                                                onClick={() => navigate(selectedPost.type === 'mercat' ? `/mercat/${selectedPost.id || selectedPost.uuid}` : `/post/${selectedPost.id || selectedPost.uuid}`)}
                                            >
                                                <h4 className="text-sm font-bold block text-slate-800 line-clamp-2 leading-tight m-0">
                                                    {selectedPost.title || selectedPost.content?.substring(0, 30) + '...'}
                                                </h4>
                                                <span className="text-[10px] text-gray-500 mt-1 block">Pel {selectedPost.author}</span>
                                            </div>
                                        </InfoWindow>
                                    )}

                                    <InteractiveControls isPlacingPost={isPlacingPost} setIsPlacingPost={setIsPlacingPost} />
                                </GoogleMap>
                            </APIProvider>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 border-2 border-dashed border-orange-500/50 p-6 text-center text-white/50">
                                <MapIcon className="w-12 h-12 mb-4 opacity-50 text-orange-500" />
                                <h3 className="text-xl font-bold text-white mb-2">Google Maps No Configurat</h3>
                                <p className="max-w-md">Per favor, afig la teua <code className="bg-black/30 px-2 py-1 rounded text-orange-400">VITE_GOOGLE_MAPS_API_KEY</code> a l'arxiu .env.local per a activar el radar de territori natiu.</p>
                            </div>
                        )}
                    </div>

                    {/* Placing Post Overlay Notification */}
                    {isPlacingPost && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-theme-panel text-theme-text font-bold px-4 py-2 rounded-full shadow-xl border border-orange-500/50 z-[1000] animate-pulse">
                            Clica en qualsevol punt del mapa per afegir una publicació
                        </div>
                    )}

                    {/* Filters */}
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-full pr-6 no-scrollbar z-[1000]">
                        <button className="px-4 py-2 bg-theme-panel/80 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10 transition-colors"><Store className="w-3 h-3 inline mr-1" /> Comerç</button>
                        <button className="px-4 py-2 bg-theme-panel/80 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10 transition-colors"><Landmark className="w-3 h-3 inline mr-1" /> Patrimoni</button>
                        <button className="px-4 py-2 bg-theme-panel/80 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10 transition-colors"><Ticket className="w-3 h-3 inline mr-1" /> Events</button>
                    </div>
                </div>
            </div>

            {/* Mur Unificat Inferior */}
            <div className="unified-feed-container w-full max-w-[1600px] mx-auto">
                <div className="px-4 md:px-8 py-2 flex items-center justify-between opacity-80 mb-2">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-theme-text">
                        <Activity size={20} className="text-orange-500" />
                        Pols del Territori
                    </h2>
                    <span className="text-xs text-theme-text opacity-50">{unifiedPosts.length} registres</span>
                </div>
            
                {loading ? (
                    <div className="flex justify-center p-8"><span className="animate-pulse text-theme-text">Sincronitzant radar territorial...</span></div>
                ) : (
                    <div className="bg-transparent">
                        <Feed 
                            hideHeader={true} 
                            customPosts={unifiedPosts} 
                            externalViewMode={viewMode} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Map;
