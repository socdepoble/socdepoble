import React from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';

/**
 * [CONTEXTUAL MENU v12.0 - PROTOCOL BATEGAT]
 * Barra de navegació horitzontal que s'adapta al contingut de cada pàgina.
 * Sempre pegada sota el Header.
 */
const ContextualMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Mapatge de menús segons la ruta
    const standardMenu = [
        { id: 'xat', label: 'XAT', path: '/chats' },
        { id: 'mur', label: 'MUR', path: '/mur' },
        { id: 'mercat', label: 'MERCAT', path: '/mercat' },
        { id: 'pobles', label: 'POBLES', path: '/pobles' }
    ];

    const menuConfigs = {
        '/chats': [
            { id: 'xat', label: 'XAT', path: '/chats' },
            { id: 'gent', label: 'GENT', path: '/directori' },
            { id: 'grups', label: 'GRUPS', path: '/nexus' },
            { id: 'treball', label: 'TREBALL', path: '/ajudes' },
            { id: 'pob', label: 'POB', path: '/pobles' }
        ],
        // Qualsevol altra ruta usarà el standardMenu
    };

    // Obtenim la config per a la ruta actual
    const isChat = location.pathname.startsWith('/chats');
    const isNotes = location.pathname.startsWith('/notes');
    
    if (isNotes) return null;

    const items = isChat ? menuConfigs['/chats'] : standardMenu;

    return (
        <div className="h-12 w-full bg-black border-b border-white/[0.02] flex items-center sticky top-0 z-[900] select-none">
            {/* ÀREA D'ÍTEMS AMB SCROLL HORITZONTAL */}
            <div className="flex-1 h-full overflow-x-auto no-scrollbar px-4">
                <div className="flex items-center gap-6 lg:gap-10 h-full min-w-max">
                    {items.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                                relative h-full flex items-center text-[11px] font-black tracking-[0.2em] transition-all
                                ${isActive 
                                    ? 'text-[#FF6B00] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FF6B00]' 
                                    : 'text-slate-500 hover:text-white'}
                            `}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* BOTÓ "+" FIX A LA DRETA (CENTRE DE CONTROL) */}
            <div className="flex items-center h-full px-4 bg-black/80 backdrop-blur-md border-l border-white/5 shadow-[-10px_0_15px_rgba(0,0,0,0.5)]">
                <button 
                    onClick={() => navigate('/gestio/categories')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-[#FF6B00] hover:text-white transition-all active:scale-95 shadow-inner"
                    title="Gestionar Categories"
                >
                    <Plus size={16} strokeWidth={4} />
                </button>
            </div>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ContextualMenu;
