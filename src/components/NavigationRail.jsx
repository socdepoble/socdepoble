import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, LayoutGrid, Store, MapPin, 
  User, Database, Calendar, Image as ImageIcon, 
  LogOut, Plus, Map, Bell, Settings, X, Folder, Users, Briefcase
} from 'lucide-react';
import { useUI } from '../context/UIContext';

const NavigationRail = () => {
    const { setIsCreateModalOpen, closeDrawer, forensicMode, toggleForensicMode } = useUI();

    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            closeDrawer();
        }
    };

    const NAV_ITEMS = [
        { id: 'mur', label: "Mur d'Històries", icon: LayoutGrid, to: '/mur' },
        { id: 'mercat', label: 'Mercat Rural', icon: Store, to: '/mercat' },
        { id: 'poble', label: 'Pobles', icon: MapPin, to: '/pobles' },
        { id: 'esdeveniments', label: 'Esdeveniments', icon: Calendar, to: '/calendari' },
        { id: 'mapa', label: 'Mapa', icon: Map, to: '/mapa' },
    ];

    const ORG_ITEMS = [
        { id: 'perfil', label: 'El meu Perfil', icon: User, to: '/perfil' },
        { id: 'iaia_hub', label: 'La IAIA (Hub)', icon: MessageSquare, to: '/iaia' },
        { id: 'dossier', label: 'Dossier de Socis', icon: Briefcase, to: '/dossier' },
        { id: 'trellat', label: 'Taller de Trellat', icon: Settings, to: '/tools/trellat' },
        { id: 'arxiu', label: "L'Arxiu d'Or", icon: Database, to: '/arxiu' },
        { id: 'directori', label: "Directori de Veïns", icon: Users, to: '/directori' },
    ];

    const COLLECTION_ITEMS = [
        { id: 'col_xat', label: 'xat', icon: Folder, to: '/chats' },
        { id: 'col_gent', label: 'gent', icon: Folder, to: '/directori' },
        { id: 'mapa', label: 'Mapa d\'Actius', icon: Map, to: '/mapa' },
        { id: 'calendari_master', label: 'Calendari Master', icon: Calendar, to: '/calendari' },
        { id: 'album_global', label: 'Àlbum Global', icon: ImageIcon, to: '/fotos/global' },
    ];

    return (
        <aside className="w-[280px] h-full flex-shrink-0 flex flex-col bg-black z-20">
            {/* HEADER SIDEBAR: BLINDAT NEGRE I 64px D'ALÇADA (1er MANDAMENT v9.1.0) */}
            <div className="h-16 min-h-[64px] flex items-center justify-between px-5 bg-black shrink-0">
                <NavLink to="/" className="flex items-center">
                    <img 
                        src="/logo-white.png" 
                        alt="SÓC DE POBLE" 
                        className="h-8 object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/logo-white.png'; // Fallback robust
                        }}
                    />
                </NavLink>
                {/* Botó tancar menú mòbil (dins la zona negra) - TACTILE TARGET 48px */}
                <button onClick={closeDrawer} className="md:hidden text-white ml-2 w-12 h-12 flex items-center justify-center">
                    <X size={24} />
                </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
                {/* BOTÓ 1: AFEGIR (GÉNESIS) - AZUL - TACTILE 48px+ */}
                <button 
                    onClick={() => { setIsCreateModalOpen(true); handleNavClick(); }}
                    className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span className="tracking-widest text-[14px] uppercase">AFEGIR</span>
                </button>

                {/* BOTÓ 2: XAT (BATEGAT) - NARANJA - TACTILE 48px+ */}
                <NavLink 
                    to="/chats" 
                    onClick={handleNavClick}
                    className={({ isActive }) => `w-full h-14 rounded-2xl font-black flex items-center px-5 gap-4 transition-all
                        ${isActive ? 'bg-[#FF6B00] text-white shadow-xl scale-[1.02]' : 'bg-transparent text-gray-400 border border-white/10 hover:bg-white/5'}`}
                >
                    {({ isActive }) => (
                        <>
                            <MessageSquare 
                                size={20} 
                                fill={isActive ? 'currentColor' : 'none'} 
                                className={isActive ? 'text-white' : 'text-gray-400'} 
                            />
                            <span className="tracking-wide text-[16px]">Xat</span>
                        </>
                    )}
                </NavLink>
@
            </div>

            {/* NAVEGACIÓ SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar pb-10">
                {NAV_ITEMS.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) => `w-full flex items-center space-x-4 px-4 h-12 rounded-xl transition-all font-bold
                            ${isActive ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-white' : ''} />
                                <span className="text-[15px]">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Separador */}
                <div className="my-4 border-t border-white/5 mx-4"></div>
                <h3 className="px-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Organització</h3>

                {ORG_ITEMS.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) => `w-full flex items-center space-x-4 px-4 h-12 rounded-xl transition-all font-bold
                            ${isActive ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[15px]">{item.label}</span>
                    </NavLink>
                ))}

                <div className="my-4 border-t border-white/5 mx-4"></div>
                <h3 className="px-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Col·leccions</h3>

                {COLLECTION_ITEMS.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) => `w-full flex items-center space-x-4 px-4 h-12 rounded-xl transition-all font-bold
                            ${isActive ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[15px]">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* FOOTER SIDEBAR */}
            <div className="p-4 mt-auto border-t border-white/10 bg-black/50 backdrop-blur-sm">
                <button className="w-full flex items-center space-x-4 px-4 h-12 text-gray-500 hover:text-red-500 transition-colors font-bold text-[14px]">
                    <LogOut size={20} />
                    <span>Tancar Sessió</span>
                </button>
                
                {/* [MASTER FORENSE] Antioblits Toggle */}
                <button 
                    onClick={toggleForensicMode}
                    className={`w-full mt-2 flex items-center space-x-4 px-4 h-10 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest
                        ${forensicMode ? 'bg-[#ff0000] text-white animate-pulse' : 'bg-red-900/20 text-red-500 border border-red-500/30'}`}
                >
                    <Database size={14} />
                    <span>{forensicMode ? 'FORENSE ACTIU' : 'MODE FORENSE'}</span>
                </button>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
            `}</style>
        </aside>
    );
};

export default NavigationRail;
