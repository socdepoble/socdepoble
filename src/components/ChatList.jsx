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
import './ChatList.css';

const AGENTS = [
    { id: '11111111-1111-4111-a111-000000000000', name: 'IAIA MarIA', role: 'Governança Rural Digital', avatar_url: '/assets/avatars/iaia_official.png', last_message_time: new Date(), last_message_content: 'Benvingut al xat del poble.', tag: 'MASTER', color: 'bg-orange-100 text-orange-600' },
    { id: '11111111-1111-4111-a111-000000000003', name: 'Vicent Ferris', role: 'Enginyer del Camp', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/vicent_ferris_tia_style_1770057456428.png', last_message_time: new Date(), last_message_content: 'L\'horta bategua amb força!', tag: 'AGRICULTURA', color: 'bg-green-100 text-green-600' },
    { id: '11111111-1111-4111-a111-000000000004', name: 'Pepica la Vall', role: 'Sobirania Alimentària', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/pepica_tia_style_1770057472277.png', last_message_time: new Date(), last_message_content: 'Ací no es tira res!', tag: 'CULTURA', color: 'bg-orange-50 text-orange-500' },
    { id: '11111111-1111-4111-a111-000000000009', name: 'Andreu Soler', role: 'Gestor de Projectes', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/andreu_tia_style_1770057709875.png', last_message_time: new Date(), last_message_content: 'Planificació bategant...', tag: 'GESTIÓ', color: 'bg-blue-100 text-blue-600' },
    { id: '11111111-1111-4111-a111-000000000008', name: 'Joan Batiste', role: 'Secretari Notarial', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/joan_tia_style_1770057725757.png', last_message_time: new Date(), last_message_content: 'Papers en ordre, bategat segur.', tag: 'GESTIÓ', color: 'bg-gray-100 text-gray-600' },
    { id: '11111111-0000-0000-0000-000000000001', name: 'Super Ratolí', role: 'Arxiver Digital', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png', last_message_time: new Date(), last_message_content: 'No obliden vitaminar-se!', tag: 'TECNOLOGIA', color: 'bg-yellow-100 text-yellow-600' },
    { id: '11111111-1111-4111-a111-000000000006', name: 'Sultan', role: 'Seguretat i Identitat', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/sultan_tia_style_1770057487451.png', last_message_time: new Date(), last_message_content: 'Guardià del DID.', tag: 'TECNOLOGIA', color: 'bg-slate-100 text-slate-600' },
    { id: '11111111-1a1a-0001-0000-000000000011', name: 'La Mixa', role: 'Exploradora P2P', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/mixa_tia_style_1770057756276.png', last_message_time: new Date(), last_message_content: 'Sincronia bategant...', tag: 'TECNOLOGIA', color: 'bg-pink-100 text-pink-600' },
    { id: '11111111-1a1a-0001-0000-000000000012', name: 'El Gall', role: 'Comunicació i Pregó', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/gall_tia_style_1770057773537.png', last_message_time: new Date(), last_message_content: 'Alerta push bategant!', tag: 'GESTIÓ', color: 'bg-red-100 text-red-600' },
    { id: '11111111-1111-4111-a111-000000000007', name: 'Nano Banana', role: 'Mestre d\'Estètica', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/nanobanana_tia_style_1770057831273.png', last_message_time: new Date(), last_message_content: 'Tot bonic amb Zero Radius.', tag: 'CULTURA', color: 'bg-yellow-50 text-yellow-500' },
    { id: '11111111-1111-4111-a111-000000000013', name: 'El Viatjant', role: 'Ambaixador i Connexió', avatar_url: '/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/viatjant_tia_style_1770057860995.png', last_message_time: new Date(), last_message_content: 'Connectant pobles.', tag: 'CULTURA', color: 'bg-purple-100 text-purple-600' },
    { id: '11111111-1111-4111-a111-000000000014', name: 'Beatriz Ortega', role: 'Dinamitzadora Educativa', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz', last_message_time: new Date(), last_message_content: 'Formació i joventut.', tag: 'CULTURA', color: 'bg-indigo-100 text-indigo-600' },
    { id: '11111111-1111-4111-a111-000000000015', name: 'Carla Soriano', role: 'Benestar i Sanitat', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla', last_message_time: new Date(), last_message_content: 'Salut rural i prevenció.', tag: 'GESTIÓ', color: 'bg-teal-100 text-teal-600' }
];

const ChatList = () => {
    const { user, isSuperAdmin } = useAuth();
    const { visionMode } = useUI();
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
                
                // [XAT/GENT] Ens assegurem que els agents bateguen si el mode bategat està actiu
                // [MASTER IDENTITY PROTECTION]
                const isMasterByEmail = user?.email?.includes('javillinares');
                // [DIRECTIVA MESTRE] Sempre mostrar agents si no s'especifica el contrari o si és un Foraster/Mestre
                const showAgents = visionMode !== 'humana' || isSuperAdmin || isMasterByEmail || !user?.id || user?.isAnonymous;

                if (showAgents) {
                    const activeAgents = AGENTS; 
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
                
                // [VISION MODE FILTER] Purga de fantasmes en xat real
                if (visionMode === 'humana' && !isSuperAdmin && !isMasterByEmail) {
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
                }
                
                setChats(hybridChats);
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('[ChatList] Error fetching chats:', err);
                }
                // Fallback a agents si falla la xarxa
                const fallback = (visionMode === 'iaia' || isSuperAdmin) ? AGENTS.map(a => ({
                    id: a.id,
                    other_info: { name: a.name, avatar_url: a.avatar_url, role: a.role },
                    last_message_content: a.last_message_content,
                    last_message_time: a.last_message_time,
                    tag: a.tag
                })) : [];
                setChats(fallback);
            }
        };
        fetchChats();
    }, [user?.id, user?.email, user?.isAnonymous, visionMode, isSuperAdmin]);

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

            {/* HEADER CANÒNIC (RESTAURAT) */}
            <header className="h-20 flex flex-col justify-center px-6 bg-black border-b border-white/5 relative z-10 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-white tracking-tighter">XATS</span>
                        <div className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                </div>
                
                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Cerca un bategat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#FF6B00]/40 focus:bg-white/10 transition-all placeholder:text-gray-700"
                    />
                </div>
            </header>

            {/* LLISTA D'AGENTS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black min-h-0">
                {filteredChats.length > 0 ? filteredChats.map(chat => (
                    <div 
                        key={chat.id} 
                        onClick={() => handleChatClick(chat)}
                        className={`flex items-center space-x-4 p-4 border-b border-gray-800/40 cursor-pointer transition-all relative
                        ${location.pathname.includes(chat.id) ? 'active' : ''} chat-item ${chat.tag === 'IAIA' ? 'iaia-agent' : ''}`}
                    >
                        {chat.tag && (
                            <span className="absolute top-2 right-[3px] bg-black text-[#FF6B00] text-[12px] px-5 py-1.5 rounded border border-[#FF6B00]/40 font-black tracking-tighter uppercase shadow-2xl leading-none z-10">
                                {chat.tag}
                            </span>
                        )}
                        <div className="flex-shrink-0">
                            <Avatar 
                                src={chat.other_info?.avatar_url} 
                                name={chat.other_info?.name} 
                                role={chat.other_info?.role}
                                size={64} 
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 ml-2">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-[22px] text-white truncate pr-2 group-hover:text-[#FF6B00] transition-colors flex-1 tracking-tight">
                                    {chat.other_info?.name || (chat.participant_2_id === user?.id ? chat.p1_info?.name : chat.p2_info?.name) || 'Foraster'}
                                </h3>
                            </div>
                            <div className="flex justify-between items-end gap-3">
                                <p className="text-[18px] text-gray-500 truncate leading-tight flex-1 opacity-80 font-medium">
                                    {chat.last_message_content || 'Bategant amb Sóc de Poble...'}
                                </p>
                                <div className="flex flex-col items-end shrink-0 leading-none pb-1">
                                    {(() => {
                                        const { day, time } = formatBategatDate(chat.last_message_time);
                                        return (
                                            <>
                                                <span className="text-[12px] text-[#FF6B00] font-black uppercase tracking-tighter mb-1">{day}</span>
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
