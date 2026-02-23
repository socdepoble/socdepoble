import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Search, Globe, Moon, Sun, Bell, 
    MoreVertical, MapPin, Menu, Plus, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import Avatar from './Avatar';
import TownSelectorModal from './TownSelectorModal';
import { useUI } from '../context/UIContext';
import ContextualHeader from './ContextualHeader';
import { AGENTS, IAIA_MARIA_ID, LORE_AGENT_IDS } from '../constants/agents';
import './ChatList.css';

const ChatList = () => {
    const { user, isSuperAdmin } = useAuth();
    const { 
        visionMode, iaiaLevel, enabledAgentIds
    } = useUI();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [chats, setChats] = useState([]);
    const [isTownModalOpen, setIsTownModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.id) return;
            try {
                const dbConvs = await supabaseService.getConversations(user.id);
                // Injecció Híbrida: Combinem missatges reals amb l'equip d'Agents IAIA
                let hybridChats = [...(dbConvs || [])];
                
                // [XAT/GENT] Protocol de Visió Granular (v10.33.20)
                // 0: Humana (Sense agents)
                // 1: IAIA (Lore i Tradició)
                // Protocol de Visió Granular (v10.33.20)
                const isMasterByEmail = user?.email?.includes('javillinares');
                
                const activeLevel0 = iaiaLevel === 0;
                const activeLevel1 = iaiaLevel === 1;
                const activeLevel2 = iaiaLevel === 2 || (!iaiaLevel && iaiaLevel !== 0);

                // IDs d'Agents per Nivells
                const LORE_AGENTS_IDS = [
                    '11111111-1111-4111-a111-000000000000', // IAIA MarIA
                    '11111111-1111-4111-a111-000000000003', // Vicent Ferris
                    '11111111-1111-4111-a111-000000000004', // Pepica la Vall
                    '11111111-1111-4111-a111-000000000009', // Andreu Soler
                    '11111111-1111-4111-a111-000000000008', // Joan Batiste
                    '11111111-1111-4111-a111-000000000014', // Beatriz Ortega
                    '11111111-1111-4111-a111-000000000015'  // Carla Soriano
                ];

                const showAgents = !activeLevel0 || isSuperAdmin || isMasterByEmail;

                if (showAgents) {
                    const activeAgents = AGENTS.filter(agent => {
                        if (isSuperAdmin || isMasterByEmail) return true;
                        return enabledAgentIds.includes(agent.id);
                    });

                    activeAgents.forEach(agent => {
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
                
                // [VISION MODE FILTER] Purga de fantasmes en xat real segons nivell
                if (activeLevel0 && !isSuperAdmin && !isMasterByEmail) {
                    // Purga total d'agents en el xat real també
                    hybridChats = hybridChats.filter(chat => {
                        const name = String(chat.other_info?.name || '').toUpperCase();
                        const isAI = chat.id?.startsWith('11111111-') || 
                                     chat.tag === 'IAIA' || 
                                     name.includes('IAIA') ||
                                     name.includes('FLASH') ||
                                     name.includes('GALL') ||
                                     name.includes('VIATJANT');
                        return !isAI;
                    });
                } else if ((activeLevel1 || activeLevel2) && !isSuperAdmin && !isMasterByEmail) {
                    // Protocol V4: Filtram per enabledAgentIds
                    hybridChats = hybridChats.filter(chat => {
                        const id = chat.id || chat.other_info?.id;
                        const isAI = id?.startsWith('11111111-');
                        if (!isAI) return true;
                        return enabledAgentIds.includes(id);
                    });
                }
                
                setChats(hybridChats);
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('[ChatList] Error fetching chats:', err);
                }
                
                // Redefining scoped variables for fallback
                const isMasterByEmailFallback = user?.email?.includes('javillinares');
                const LORE_AGENTS_IDS_FALLBACK = [
                    '11111111-1111-4111-a111-000000000000', // IAIA MarIA
                    '11111111-1111-4111-a111-000000000003', // Vicent Ferris
                    '11111111-1111-4111-a111-000000000004', // Pepica la Vall
                    '11111111-1111-4111-a111-000000000009', // Andreu Soler
                    '11111111-1111-4111-a111-000000000008', // Joan Batiste
                    '11111111-1111-4111-a111-000000000014', // Beatriz Ortega
                    '11111111-1111-4111-a111-000000000015'  // Carla Soriano
                ];

                // Fallback a agents segons nivell
                const fallbackAgents = AGENTS.filter(agent => {
                    const isGuestFB = !user?.id || user?.isAnonymous;
                    const lv2FB = iaiaLevel === 2 || isGuestFB || (!iaiaLevel && iaiaLevel !== 0);
                    const lv1FB = (iaiaLevel === 1) && !isGuestFB;

                    if (isSuperAdmin || isMasterByEmailFallback || lv2FB) return true;
                    if (lv1FB) return LORE_AGENTS_IDS_FALLBACK.includes(agent.id);
                    return false;
                });
                
                setChats(fallbackAgents.map(a => ({
                    id: a.id,
                    other_info: { name: a.name, avatar_url: a.avatar_url, role: a.role },
                    last_message_content: a.last_message_content,
                    last_message_time: a.last_message_time,
                    tag: a.tag
                })));
            }
        };
        fetchChats();
    }, [user?.id, user?.email, user?.isAnonymous, iaiaLevel, enabledAgentIds, isSuperAdmin, visionMode]);

    const filteredChats = useMemo(() => {
        if (!searchTerm) return chats;
        const normalized = searchTerm.toLowerCase();
        return chats.filter(chat => 
            chat.other_info?.name?.toLowerCase().includes(normalized) ||
            chat.other_info?.role?.toLowerCase().includes(normalized) ||
            chat.last_message_content?.toLowerCase().includes(normalized)
        );
    }, [chats, searchTerm]);

    const handleChatClick = (chat) => {
        navigate(`/chats/${chat.id}`, { state: { chatInfo: chat } });
    };

    const formatBategatDate = (date) => {
        if (!date) return { day: 'ARA', time: '' };
        const d = new Date(date);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = d.toDateString() === yesterday.toDateString();

        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (isToday) return { day: 'HUI', time: timeStr };
        if (isYesterday) return { day: 'AHIR', time: timeStr };
        
        return { 
            day: d.toLocaleDateString([], { day: '2-digit', month: '2-digit' }), 
            time: timeStr 
        };
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#000000] relative overflow-hidden h-full chat-list-container">
            {/* SCANLINES RETRO-FUTURISTES */}
            <div className="chat-list-scanlines" />

            {/* HEADER CANÒNIC (RESTAURAT I REFINAT) */}
            <header className="h-[60px] flex flex-col justify-center px-4 bg-black border-b border-white/5 relative z-10 shrink-0">
                <div className="relative group w-full">
                    <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="CERCA UN BATEGAT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm font-black text-white focus:outline-none focus:border-[#FF6B00]/40 focus:bg-white/10 transition-all placeholder:text-gray-700 uppercase tracking-widest"
                    />
                </div>
            </header>

            {/* LLISTA D'AGENTS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black min-h-0">
                {filteredChats.length > 0 ? filteredChats.map(chat => (
                    <div 
                        key={chat.id} 
                        onClick={() => handleChatClick(chat)}
                        className={`flex items-start space-x-3 py-2 px-4 border-b border-gray-800/20 cursor-pointer transition-all relative
                        ${location.pathname.includes(chat.id) ? 'active' : ''} chat-item ${chat.tag === 'IAIA' ? 'iaia-agent' : ''}`}
                    >
                        {chat.tag && (
                            <span className="absolute top-2 right-[1px] bg-black text-[#FF6B00] text-[12px] px-5 py-1.5 rounded border border-[#FF6B00]/40 font-black tracking-tighter uppercase shadow-2xl leading-none z-10">
                                {chat.tag}
                            </span>
                        )}
                        <div className="flex-shrink-0">
                            <Avatar 
                                src={chat.other_info?.avatar_url} 
                                name={chat.other_info?.name} 
                                role={chat.other_info?.role}
                                size={56} 
                            />
                        </div>
                        {/* [REFINAMENT v10.33.15] Text centrat verticalment respecte a l'avatar gran (Baixat exactament +9px des de pt-2 per harmonia total) */}
                        <div className="flex-1 min-w-0 flex flex-col justify-start ml-2 pt-[17px]">
                            <div className="flex justify-between items-center mb-0.5">
                                <h3 className="font-bold text-[17px] text-white truncate pr-2 group-hover:text-[#FF6B00] transition-colors flex-1 tracking-tight m-0 leading-tight">
                                    {chat.other_info?.name || (chat.participant_2_id === user?.id ? chat.p1_info?.name : chat.p2_info?.name) || 'Foraster'}
                                </h3>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                                <p className="text-[14px] text-gray-500 truncate leading-none flex-1 opacity-80 font-medium m-0">
                                    {chat.last_message_content || 'Bategant amb Sóc de Poble...'}
                                </p>
                                <div className="flex flex-col items-end shrink-0 leading-none">
                                    {(() => {
                                        const { day, time } = formatBategatDate(chat.last_message_time);
                                        return (
                                            <>
                                                <span className="text-[11px] text-[#FF6B00] font-black uppercase tracking-tighter mb-0.5">{day}</span>
                                                <span className="text-[13px] text-gray-500 font-bold">{time}</span>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
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
                onSelect={(townId) => {
                    navigate(`/pobles/${townId}`);
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
