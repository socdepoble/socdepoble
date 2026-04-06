import React from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';
import RoundButton from './ui/RoundButton';
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
            { id: 'gent', label: 'GENT', path: '/chats?tab=gent' },
            { id: 'grups', label: 'GRUPS', path: '/chats?tab=grups' },
            { id: 'empreses', label: 'EMPRESES', path: '/chats?tab=empreses' },
            { id: 'institucions', label: 'INSTITUCIONS', path: '/chats?tab=institucions' }
        ],
        '/pobles': [
            { id: 'pobles', label: 'POBLES', path: '/pobles' },
            { id: 'esdeveniments', label: 'EVENTS', path: '/pobles?tab=esdeveniments' },
            { id: 'mapa', label: 'MAPA', path: '/mapa' }
        ],
        '/mapa': [
            { id: 'pobles', label: 'POBLES', path: '/pobles' },
            { id: 'esdeveniments', label: 'EVENTS', path: '/pobles?tab=esdeveniments' },
            { id: 'mapa', label: 'MAPA', path: '/mapa' }
        ],
        '/calendar': [
            { id: 'events', label: 'TOTS', path: '/calendar' },
            { id: 'personal', label: 'PERSONAL', path: '/calendar?role=personal' },
            { id: 'empresa', label: 'EMPRESA', path: '/calendar?role=empresa' },
            { id: 'treball', label: 'TREBALL', path: '/calendar?role=treball' },
            { id: 'estudis', label: 'ESTUDIS', path: '/calendar?role=estudis' }
        ]
    };

    // Obtenim la config per a la ruta actual
    const isChat = location.pathname.startsWith('/chats');
    const isNotes = location.pathname.startsWith('/notes');
    const isTowns = location.pathname.startsWith('/pobles') || location.pathname.startsWith('/mapa');
    const isCalendar = location.pathname.startsWith('/calendar');
    // NOU: Detectar si estem DINS d'un xat específic per amagar la barra "XAT GENT GRUPS" i lliurar espai
    const isChatDetail = location.pathname.match(/^\/chats\/[^/]+/);
    const isProfile = location.pathname.startsWith('/perfil');
    
    // --- FLAG FUNCIONALITAT BATEGAT ---
    // [Peticio Audio] Mantindre la barra desactivada per defecte per guanyar espai.
    // Es crea el flag para activar-la quan siga necessari.
    const isContextualMenuEnabled = false; 
    
    // Sortida primerenca (no renderitzar res) si està desactivat, o si estem en Notes/Detall de Xat
    if (!isContextualMenuEnabled || isNotes || isChatDetail) return null;

    const profileMenu = [
        { id: 'tot', label: 'TOTS', path: location.pathname },
        { id: 'personal', label: 'PERSONAL', path: `${location.pathname}?role=personal` },
        { id: 'autonom', label: 'AUTÒNOM/EST', path: `${location.pathname}?role=autonom` },
        { id: 'empresa', label: 'EMPRESA', path: `${location.pathname}?role=empresa` },
        { id: 'grup', label: 'GRUP', path: `${location.pathname}?role=grup` },
        { id: 'entitat', label: 'ENTITAT', path: `${location.pathname}?role=entitat` }
    ];

    const items = isChat ? menuConfigs['/chats'] : (isCalendar ? menuConfigs['/calendar'] : (isTowns ? menuConfigs['/pobles'] : (isProfile ? profileMenu : standardMenu)));

    return (
        <div className="h-[48px] min-h-[48px] max-h-[48px] w-full bg-[#1a1a1a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] flex items-center sticky top-0 z-sticky select-none overflow-hidden shrink-0">
            {/* ÀREA D'ÍTEMS AMB SCROLL HORITZONTAL */}
            <div className="flex-1 h-full overflow-x-auto no-scrollbar pl-4 pr-4 lg:pl-6 lg:pr-6">
                <div className="flex justify-center items-center gap-8 lg:gap-14 h-full min-w-max mx-auto">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                navigate(item.path);
                            }}
                            className={`
                                relative h-full flex items-center text-[13px] lg:text-[15px] font-black tracking-[0.25em] transition-all whitespace-nowrap
                                ${(isProfile || isCalendar)
                                    ? (item.id === (new URLSearchParams(location.search).get('role') || (isCalendar ? 'events' : 'tot')) ? 'text-[#544CF6] border-b-2 border-[#544CF6] pt-[2px]' : 'text-white opacity-80 hover:opacity-100')
                                    : (((location.pathname + location.search) === item.path) || (location.pathname === item.path && location.search === '' && item.id === 'xat') 
                                        ? 'text-[#544CF6] border-b-2 border-[#544CF6] pt-[2px]' 
                                        : 'text-white opacity-80 hover:opacity-100')}
                            `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* BOTÓ HAMBURGUESA FIX A LA DRETA (CENTRE DE CONTROL) */}
            <div className="flex items-center h-full px-4 bg-[#1a1a1a]/90 backdrop-blur-md border-l border-white/5 shadow-[-10px_0_15px_rgba(0,0,0,0.5)]">
                <button 
                    onClick={() => navigate('/gestio/categories')}
                    className="w-8 h-8 flex items-center justify-center rounded-[28px] bg-white/5 text-slate-400 hover:bg-[var(--theme-accent-primary)] hover:text-white transition-all active:scale-95 shadow-inner"
                    title="Més accions"
                >
                    <Menu size={16} strokeWidth={3} />
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
