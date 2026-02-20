import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, MapPin, Navigation, Layers, Plus, Store, Landmark, Ticket } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import { useUI } from '../context/UIContext';
import BlueprintOverlay from '../components/BlueprintOverlay';
import ContextualHeader from '../components/ContextualHeader';
import './Map.css';

const Map = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { blueprintMode } = useUI();
    const [mapSearch, setMapSearch] = React.useState('');
    const [viewMode, setViewMode] = React.useState(localStorage.getItem('map_view_mode') || 'grid');

    const townTabs = [
        { id: 'pobles', label: t('nav.towns') || 'Pobles' },
        { id: 'esdeveniments', label: t('nav.events') || 'Esdeveniments' },
        { id: 'mapa', label: t('nav.map_tab') || 'Mapa' }
    ];

    return (
        <div className="map-page-container">
            <header className="page-header-with-tabs">
                <div className="header-tabs-wrapper">
                    <CategoryTabs
                        selectedRole="mapa"
                        onSelectRole={(role) => {
                            if (role === 'pobles') {
                                navigate('/pobles');
                            } else if (role === 'esdeveniments') {
                                navigate('/pobles', { state: { initialTab: 'esdeveniments' } });
                            }
                        }}
                        tabs={townTabs}
                    />
                </div>
            </header>

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

            <div className={`map-content-area p-4 md:p-8 view-mode-${viewMode}`}>
                <div className={`relative w-full h-[600px] rounded-[32px] overflow-hidden bg-blue-50 dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 shadow-inner group`}>
                    {blueprintMode && <BlueprintOverlay label="MAP_VIEW" info="Interactive Placeholder" color="green" />}
                    
                    {/* Fake Map Background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px', color: '#94a3b8' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <MapIcon className="w-64 h-64" />
                    </div>

                    {/* Map Pins */}
                    <div 
                        className="absolute top-1/4 left-1/4 flex flex-col items-center animate-bounce-slow cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => navigate('/pobles/1')}
                    >
                        <MapPin className="w-10 h-10 text-orange-500 drop-shadow-lg" fill="currentColor" />
                        <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-md shadow-md mt-1">La Torre</span>
                    </div>
                    
                    <div 
                        className="absolute top-1/2 right-1/3 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => alert('Viatjant a Penàguila...')}
                    >
                        <MapPin className="w-8 h-8 text-indigo-500 drop-shadow-lg" fill="currentColor" />
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mt-1">Penàguila</span>
                    </div>
                    
                    <div 
                        className="absolute bottom-1/3 left-1/3 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => alert('Viatjant a Benifallim...')}
                    >
                        <MapPin className="w-8 h-8 text-emerald-500 drop-shadow-lg" fill="currentColor" />
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mt-1">Benifallim</span>
                    </div>

                    {/* Map Controls */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                        <button className="p-3 bg-white text-slate-700 rounded-full shadow-lg hover:bg-slate-50"><Plus className="w-6 h-6" /></button>
                        <button className="p-3 bg-white text-slate-700 rounded-full shadow-lg hover:bg-slate-50"><Layers className="w-6 h-6" /></button>
                        <button className="p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600"><Navigation className="w-6 h-6" /></button>
                    </div>

                    {/* Filters */}
                    <div className="absolute top-6 left-6 flex gap-2 overflow-x-auto max-w-full pr-6 no-scrollbar">
                        <button className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white text-slate-800 border border-slate-200"><Store className="w-3 h-3 inline mr-1" /> Comerç</button>
                        <button className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white text-slate-800 border border-slate-200"><Landmark className="w-3 h-3 inline mr-1" /> Patrimoni</button>
                        <button className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm hover:bg-white text-slate-800 border border-slate-200"><Ticket className="w-3 h-3 inline mr-1" /> Events</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;
