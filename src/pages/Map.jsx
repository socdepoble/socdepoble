import { useDesign } from '../context/DesignContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, MapPin, Navigation, Layers, Plus, Store, Landmark, Ticket, Activity } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import BlueprintOverlay from '../components/BlueprintOverlay';
import ContextualHeader from '../components/ContextualHeader';
import Feed from '../components/Feed';
import { useUnifiedFeedData } from '../hooks/useUnifiedFeedData';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

const createPinIcon = (colorClass, label) => L.divIcon({
    className: 'custom-map-pin bg-transparent border-none outline-none',
    html: `
        <div class="flex flex-row items-center animate-bounce-slow hover:scale-110 transition-transform cursor-pointer absolute -top-[40px] -left-[20px] pointer-events-auto w-max">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${colorClass} drop-shadow-xl"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#111827"/></svg>
            <span class="bg-[#111827]/95 backdrop-blur-md text-white text-base lg:text-lg font-black tracking-wide px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] ml-1 border border-white/20 whitespace-nowrap">${label}</span>
        </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
});

const createPostIcon = (imageUrl) => L.divIcon({
    className: 'post-map-pin bg-transparent border-none outline-none',
    html: `
        <div class="w-10 h-10 rounded-full border-[3px] border-white shadow-xl overflow-hidden bg-slate-800 hover:scale-125 transition-transform cursor-pointer relative z-40 flex items-center justify-center pointer-events-auto">
            ${imageUrl ? `<img src="${imageUrl}" class="w-full h-full object-cover" />` : `<div class="w-full h-full bg-[var(--theme-accent-primary)]"></div>`}
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const torreIcon = createPinIcon('text-orange-500', 'La Torre de les Maçanes');
const penaguilaIcon = createPinIcon('text-indigo-500', 'Penàguila');
const benifallimIcon = createPinIcon('text-emerald-500', 'Benifallim');
const sellaIcon = createPinIcon('text-blue-400', 'Sella');
const orxetaIcon = createPinIcon('text-yellow-500', 'Orxeta');
const relleuIcon = createPinIcon('text-red-500', 'Relleu');
const alcolejaIcon = createPinIcon('text-green-500', 'Alcoleja');
const xixonaIcon = createPinIcon('text-amber-600', 'Xixona');
const tibiIcon = createPinIcon('text-cyan-500', 'Tibi');

const InteractiveMapControls = ({ isPlacingPost, setIsPlacingPost }) => {
    const map = useMap();
    
    useMapEvents({
        click(e) {
            if (isPlacingPost) {
                // Future: Open standard post creation modal with these coordinates
                alert(`Has seleccionat les coordenades: Lat ${e.latlng.lat.toFixed(4)}, Lng ${e.latlng.lng.toFixed(4)}\n(Açò obrirà el formulari de nou post prompte)`);
                setIsPlacingPost(false);
            }
        }
    });

    const handleLocation = (e) => {
        e.preventDefault();
        e.stopPropagation();
        map.locate().on("locationfound", function (evt) {
            map.flyTo(evt.latlng, map.getZoom(), { duration: 1.5 });
        }).on("locationerror", function () {
            alert("No hem pogut trobar la teua ubicació. Comprova els permisos del navegador.");
        });
    };

    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[1000]">
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlacingPost(!isPlacingPost); }}
                className={`p-3 text-white border border-white/10 rounded-[28px] shadow-lg transition-colors ${isPlacingPost ? 'bg-orange-500' : 'bg-[#111827] hover:bg-slate-800'}`}
                title="Geolocalitzar un nou post"
            >
                <Plus className="w-6 h-6" />
            </button>
            <button 
                onClick={handleLocation}
                className="p-3 bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-lg hover:bg-slate-800"
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
    const [mapSearch, setMapSearch] = React.useState('');
    const [viewMode, setViewMode] = React.useState(localStorage.getItem('map_view_mode') || 'grid');
    const [isPlacingPost, setIsPlacingPost] = React.useState(false);

    const { posts: unifiedPosts, loading } = useUnifiedFeedData({ 
        activeTown: 'global', 
        isPlayground, 
        user 
    });

    return (
        <div className="map-page-container">
            <div className="sticky top-0 w-full z-[100] shadow-md">
                <ContextualHeader
                    searchTerm={mapSearch}
                    onSearchChange={setMapSearch}
                    viewMode={viewMode}
                    onViewModeChange={(mode) => {
                        setViewMode(mode);
                        localStorage.setItem('map_view_mode', mode);
                    }}
                    placeholder="Cerca al mapa..."
                />
            </div>

            <div className="flex flex-col items-center w-full">
                <div className="map-content-area w-full max-w-[1600px] mx-auto p-4 md:p-8">
                    <div className={`relative w-full h-[50vh] min-h-[400px] max-h-[700px] rounded-[32px] overflow-hidden bg-blue-50 dark:bg-slate-900 border-2 border-slate-800 shadow-inner group`}>
                        {blueprintMode && <BlueprintOverlay label="MAP_VIEW" info="Interactive Placeholder" color="green" />}
                    {/* React Leaflet Map */}
                    <div className="absolute inset-0 z-0 map-container-custom">
                        <MapContainer 
                            center={[38.6042, -0.4266]} 
                            zoom={12} 
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <LayersControl position="topleft">
                                <LayersControl.BaseLayer checked name="OpenStreetMap">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>
                                <LayersControl.BaseLayer name="Topogràfic (Muntanya)">
                                    <TileLayer
                                        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>
                            </LayersControl>

                            {/* Main Markers */}
                            <Marker position={[38.6042, -0.4266]} icon={torreIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-la-torre') }} />
                            <Marker position={[38.6781, -0.3582]} icon={penaguilaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-penaguila') }} />
                            <Marker position={[38.6331, -0.3983]} icon={benifallimIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-benifallim') }} />
                            <Marker position={[38.6083, -0.2721]} icon={sellaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-sella') }} />
                            <Marker position={[38.5630, -0.2618]} icon={orxetaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-orxeta') }} />
                            <Marker position={[38.5878, -0.3114]} icon={relleuIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-relleu') }} />
                            <Marker position={[38.6811, -0.3314]} icon={alcolejaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-alcoleja') }} />
                            <Marker position={[38.5398, -0.5085]} icon={xixonaIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-xixona') }} />
                            <Marker position={[38.5306, -0.5761]} icon={tibiIcon} eventHandlers={{ click: () => navigate('/pobles/gent-de-tibi') }} />

                            {/* Dynamic Post Markers */}
                            {unifiedPosts.filter(p => p.lat && p.lng).map((post, index) => {
                                const imgUrl = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.image);
                                return (
                                    <Marker 
                                        key={`post-${post.id || post.uuid || index}`}
                                        position={[post.lat, post.lng]}
                                        icon={createPostIcon(imgUrl)}
                                        eventHandlers={{ 
                                            click: () => {
                                                if(post.type === 'mercat') navigate(`/mercat/${post.id || post.uuid}`);
                                                else navigate(`/post/${post.id || post.uuid}`);
                                            } 
                                        }}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="text-center min-w-[120px]">
                                                <b className="text-sm font-bold block text-slate-800 line-clamp-2 leading-tight">
                                                    {post.title || post.content?.substring(0, 30) + '...'}
                                                </b>
                                                <span className="text-[10px] text-gray-500 mt-1 block">Pel {post.author}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Custom Controls inside map context */}
                            <InteractiveMapControls isPlacingPost={isPlacingPost} setIsPlacingPost={setIsPlacingPost} />
                        </MapContainer>
                    </div>

                    {/* Placing Post Overlay Notification */}
                    {isPlacingPost && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-theme-panel text-theme-text font-bold px-4 py-2 rounded-full shadow-xl border border-orange-500/50 z-[1000] animate-pulse">
                            Clica en qualsevol punt del mapa per afegir una publicació
                        </div>
                    )}

                    {/* Filters */}
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-full pr-6 no-scrollbar z-10">
                        <button className="px-4 py-2 bg-theme-panel backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10"><Store className="w-3 h-3 inline mr-1" /> Comerç</button>
                        <button className="px-4 py-2 bg-theme-panel backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10"><Landmark className="w-3 h-3 inline mr-1" /> Patrimoni</button>
                        <button className="px-4 py-2 bg-theme-panel backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white/10 text-theme-text border border-white/10"><Ticket className="w-3 h-3 inline mr-1" /> Events</button>
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
                        <span className="text-xs text-white/50">{unifiedPosts.length} registres</span>
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
        </div>
    );
};

export default Map;
