import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, LayoutGrid, Store, MapPin, 
  User, Database, Calendar, Image as ImageIcon, 
  LogOut, Plus, Map, Bell, Settings, X, Folder, Users
} from 'lucide-react';
import { useUI } from '../context/UIContext';

const NavigationRail = () => {
    const { setIsCreateModalOpen, closeDrawer } = useUI();

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
        <aside className="w-[280px] h-full flex-shrink-0 flex flex-col border-r border-gray-800 bg-black z-20">
            {/* HEADER SIDEBAR: BLINDAT NEGRE I 16 REM D'ALÇADA (1er MANDAMENT v9.1.0) */}
            <div className="h-16 min-h-[64px] flex items-center justify-between px-5 bg-black border-b border-gray-800 shrink-0">
                <NavLink to="/" className="flex items-center">
                    <img 
                        src="/assets/master/logo_socdepoble_white_full.png" 
                        alt="SÓC DE POBLE" 
                        className="h-8 object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/logo.png'; // Fallback
                        }}
                    />
                </NavLink>
                {/* Botó tancar menú mòbil (dins la zona negra) */}
                <button onClick={closeDrawer} className="md:hidden text-white ml-2">
                    <X size={24} />
                </button>
            </div>

            <div className="p-5 flex flex-col">

                {/* BOTÓ 1: AFEGIR (GÉNESIS) - AZUL */}
                <button 
                    onClick={() => { setIsCreateModalOpen(true); handleNavClick(); }}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg mb-3 transition-transform active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span className="tracking-wide text-[15px]">AFEGIR</span>
                </button>

                {/* BOTÓ 2: XAT (BATEGAT) - NARANJA */}
                <NavLink 
                    to="/chats" 
                    onClick={handleNavClick}
                    className={({ isActive }) => `w-full py-3 rounded-xl font-bold flex items-center px-4 gap-3 transition-colors
                        ${isActive ? 'bg-[#FF6B00] text-white shadow-md' : 'text-gray-400 hover:bg-white/10'}`}
                >
                    <MessageSquare size={20} fill="currentColor" />
                    <span className="tracking-wide text-[15px]">Xat</span>
                </NavLink>
            </div>

            {/* NAVEGACIÓ SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                {NAV_ITEMS.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) => `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium
                            ${isActive ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                {/* Separador */}
                <div className="my-4 border-t border-gray-800/50 mx-4"></div>
                <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 font-roboto-condensed">Organització</h3>

                {/* Bloque Organización */}
                {ORG_ITEMS.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) => `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium
                            ${isActive ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                {/* Separador */}
                <div className="my-4 border-t border-gray-800/50 mx-4"></div>
                <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 font-roboto-condensed">Col·leccions</h3>

                {/* Bloque Colecciones */}
                {COLLECTION_ITEMS.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) => `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium
                            ${isActive ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* FOOTER SIDEBAR */}
            <div className="p-4 mt-auto border-t border-gray-800">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                    <span>Tancar Sessió</span>
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
