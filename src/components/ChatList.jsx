import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Search, Globe, Moon, Sun, Bell, 
    MoreVertical, MapPin, Menu, Plus, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import Avatar from './Avatar';
import TownSelectorModal from './TownSelectorModal';

const AGENTS = [
    { id: '11111111-1a1a-0000-0000-000000000000', name: 'IAIA MarIA', role: 'Matriarca', avatar_url: '/assets/avatars/iaia_official.png', last_message_time: new Date(), last_message_content: 'Benvingut al xat del poble.', tag: 'IAIA', color: 'bg-orange-100 text-orange-600' },
    { id: '11111111-1a1a-0001-0000-000000000005', name: 'Nano Banana', role: 'Artista', avatar_url: '/assets/avatars/nano_banana.png', last_message_time: new Date(), last_message_content: 'Tinc els nous dissenys llestos.', tag: 'IAIA', color: 'bg-yellow-100 text-yellow-600' },
    { id: '11111111-0000-0000-0000-000000000001', name: 'Super Ratolí', role: 'Heroi', avatar_url: '/assets/avatars/super_ratoli.png', last_message_time: new Date(), last_message_content: 'No olviden vitaminarse!', tag: 'IAIA', color: 'bg-gray-200 text-gray-600' },
    { id: '11111111-1a1a-0001-0000-000000000001', name: 'Andreu Soler', role: 'Jove', avatar_url: 'https://ui-avatars.com/api/?name=Andreu+Soler&background=5D5FEF&color=fff', last_message_time: new Date(), last_message_content: 'Hola! Vols que parlem?', tag: 'IAIA', color: 'bg-blue-100 text-blue-600' }
];

const ChatList = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [chats, setChats] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('xat');
    const [isTownModalOpen, setIsTownModalOpen] = useState(false);

    const chatTabs = [
        { id: 'xat', label: 'XAT' },
        { id: 'gent', label: 'GENT' },
        { id: 'grups', label: 'GRUPS' },
        { id: 'treball', label: 'TREBALL' },
        { id: 'pobles', label: 'POBLES' }
    ];

    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.id) return;
            try {
                const dbConvs = await supabaseService.getConversations(user.id);
                // Injecció Híbrida: Combinem missatges reals amb l'equip d'Agents IAIA
                const hybridChats = [...(dbConvs || [])];
                
                // Si la categoria és XAT o GENT, ens assegurem que els agents bateguen
                if (selectedCategory === 'xat' || selectedCategory === 'gent') {
                    AGENTS.forEach(agent => {
                        if (!hybridChats.find(c => c.id === agent.id || c.other_info?.id === agent.id)) {
                             hybridChats.push({
                                 id: agent.id,
                                 other_info: { id: agent.id, name: agent.name, avatar_url: agent.avatar_url, role: agent.role },
                                 last_message_content: agent.last_message_content,
                                 last_message_time: agent.last_message_time,
                                 tag: agent.tag
                             });
                        }
                    });
                }
                
                setChats(hybridChats);
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('[ChatList] Error fetching chats:', err);
                }
                // Fallback a agents si falla la xarxa
                setChats(AGENTS.map(a => ({
                    id: a.id,
                    other_info: { name: a.name, avatar_url: a.avatar_url, role: a.role },
                    last_message_content: a.last_message_content,
                    last_message_time: a.last_message_time,
                    tag: a.tag
                })));
            }
        };
        fetchChats();
    }, [user?.id, selectedCategory]);

    const handleChatClick = (chat) => {
        navigate(`/chats/${chat.id}`);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#000000] relative overflow-hidden h-full">
            {/* HEADER LLISTA: MONÒLIT NEGRE 64px (v10.12) */}
            <header className="h-16 px-4 flex items-center bg-black border-b border-gray-800/50 flex-shrink-0 z-30 text-white">
                
                {/* REDUNDÀNCIES ELIMINADES (v11.0.6) - LA CABECERA SUPERIOR ÉS L'ALTAR ÚNIC */}
                <div className="flex-1 text-[#FF6B00] font-black uppercase tracking-[0.2em] text-[10px] text-center opacity-50">
                    Bategant Ara mateix
                </div>
            </header>

            {/* TABS DE NAVEGACIÓ */}
            <div className="px-2 pt-3 border-b border-gray-800 bg-black flex-shrink-0">
                <div className="flex space-x-1 px-2 overflow-x-auto no-scrollbar">
                    {chatTabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-4 pb-3 text-[12px] font-black tracking-widest border-b-2 transition-all whitespace-nowrap uppercase
                            ${selectedCategory === tab.id ? 'text-[#FF6B00] border-[#FF6B00]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* LLISTA D'AGENTS (FIX: min-h-0 per a permetre scroll en flex) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black min-h-0">
                {chats.length > 0 ? chats.map(chat => (
                    <div 
                        key={chat.id} 
                        onClick={() => handleChatClick(chat)}
                        className={`flex items-center space-x-4 p-4 border-b border-gray-800/40 cursor-pointer transition-all
                        ${location.pathname.includes(chat.id) ? 'bg-white/5 border-l-4 border-l-[#FF6B00]' : 'hover:bg-white/5'}`}
                    >
                        <div className="relative flex-shrink-0">
                            <Avatar 
                                src={chat.other_info?.avatar_url} 
                                name={chat.other_info?.name} 
                                role={chat.other_info?.role}
                                size={52} 
                            />
                            {chat.tag && (
                                <span className="absolute -top-1 -right-1 bg-black text-[#FF6B00] text-[9px] px-1.5 py-0.5 rounded border border-[#FF6B00]/30 font-black tracking-tighter uppercase shadow-xl">{chat.tag}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-[16px] text-white truncate group-hover:text-[#FF6B00] transition-colors">{chat.other_info?.name || 'Vveí'}</h3>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">{chat.last_message_time ? new Date(chat.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Ara'}</span>
                            </div>
                            <p className="text-[14px] text-gray-500 truncate leading-tight">
                                {chat.last_message_content || 'Bategant amb Sóc de Poble...'}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 p-12 text-center">
                        <MessageSquare size={56} className="mb-6 text-[#FF6B00] mx-auto opacity-50" />
                        <p className="text-white text-sm font-black uppercase tracking-[0.2em]">Silence total.</p>
                        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Inicia la conversa al mur</p>
                    </div>
                )}
            </div>

            <TownSelectorModal
                isOpen={isTownModalOpen}
                onClose={() => setIsTownModalOpen(false)}
                onSelect={() => {
                    setSelectedCategory('pobles');
                }}
            />
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #FF6B00; }
            `}</style>
        </div>
    );
};

export default ChatList;
