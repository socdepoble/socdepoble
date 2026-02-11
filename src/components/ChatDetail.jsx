import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Send, Loader2, Paperclip, Search, 
    MoreVertical, ChevronLeft,
    ShieldCheck, MessageSquare, Smile, Mic, Bell
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import VoiceRecorder from './VoiceRecorder';
import UniversalCitation from './UniversalCitation';

const ChatDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin } = useAuth();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    
    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = activeEntityId || humanId;

    const isP1Current = chat?.participant_1_id === currentUserId;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user || !currentUserId) return;
        const fetchChatData = async () => {
            try {
                const chats = await supabaseService.getConversations(currentUserId);
                const currentChat = chats.find(c => c.id === id);
                if (currentChat) {
                    setChat(currentChat);
                    const msgs = await supabaseService.getConversationMessages(id);
                    setMessages(msgs);
                    await supabaseService.markMessagesAsRead(id, currentUserId);
                }
            } catch (error) {
                logger.error('Error fetching chat data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChatData();
    }, [id, currentUserId, user]);

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages.length]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const text = newMessage.trim();
        setNewMessage('');
        try {
            const result = await supabaseService.sendSecureMessage({
                conversationId: id,
                senderId: humanId,
                senderEntityId: activeEntityId,
                content: text,
            });
            setMessages(prev => [...prev, result]);
        } catch (err) { logger.error('Error sending message:', err); }
    };

    const otherInfo = isP1Current ? chat?.p2_info : chat?.p1_info;

    if (loading) return <div className="flex-1 bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#FF6B00]" size={40} /></div>;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden relative">
            
            {/* HEADER DEL XAT - CABECERA NEGRA RESPONSIVE (1er MANDAMENT v9.0.0) */}
            <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-black border-b border-gray-800 flex-shrink-0 z-30 text-white">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/chats')} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={40} />
                        <div className="flex flex-col min-w-0">
                            <h2 className="text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors truncate leading-none">
                                {otherInfo?.name || t('common.unknown')}
                            </h2>
                            <span className="text-xs text-green-500 font-medium">En línia</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <Search size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    
                    <button className="text-gray-400 hover:text-yellow-400 transition-colors p-1.5">
                        <Smile size={20} />
                    </button>

                  {/* Marca Mòbil (Centrada) */}
                <div className="md:hidden flex-1 flex justify-center pr-8">
                    <img 
                      src="/assets/master/logo_socdepoble_white_full.png" 
                      alt="SÓC DE POBLE" 
                      className="h-8 w-auto object-contain" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="hidden font-bold tracking-[0.15em] uppercase text-white">SÓC DE POBLE</span>
                </div>
                    
                    <div className="relative cursor-pointer group p-1.5">
                        <Bell size={20} className="text-gray-400 group-hover:text-white" />
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-black">3</span>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-black text-white border border-gray-600 cursor-pointer overflow-hidden hover:border-[#FF6B00] transition-colors">
                        {impersonatedProfile?.avatar_url ? <img src={impersonatedProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : user?.email?.substring(0,2).toUpperCase() || 'JL'}
                    </div>
                </div>
            </header>

            {/* LLISTA DE MISSATGES - GEM MODERN v7.1 STYLED */}
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar bg-black/40">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                        <MessageSquare size={56} className="text-gray-600 mb-4" />
                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">{t('common.write_message')}</p>
                    </div>
                ) : (
                    messages.map(msg => {
                        const isMe = msg.sender_id === humanId;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] md:max-w-[65%] rounded-2xl p-4 relative shadow-2xl
                                    ${isMe ? 'bg-[#FF6B00] text-white rounded-tr-none' : 'bg-[#1a1a1a] text-gray-100 rounded-tl-none border border-gray-800'}`}>
                                    
                                    {!isMe && (msg.author_name || otherInfo?.name) && (
                                        <div className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest mb-2 opacity-80">
                                            {msg.author_name || otherInfo?.name}
                                        </div>
                                    )}

                                    <div className="text-[15px] leading-snug break-words font-medium">
                                        {msg.content}
                                    </div>

                                    <div className="mt-2 flex items-center justify-end gap-2 opacity-50">
                                        <span className="text-[10px] font-black uppercase">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            <span className={`text-[10px] font-black ${msg.read_at ? 'text-blue-300' : 'text-gray-300'}`}>
                                                {msg.read_at ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* BARRA D'ENTRADA - PROTOCOL SUPREMA */}
            <div className="p-4 bg-black border-t border-white/10 z-20">
                <form className="flex items-center gap-3 max-w-5xl mx-auto" onSubmit={handleSendMessage}>
                    <button type="button" className="p-2.5 text-gray-400 hover:text-[#FF6B00] transition-colors"><Smile size={24} /></button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={t('common.write_message')}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#FF6B00]/40 transition-all placeholder:text-gray-600 font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <button type="button" className="p-1 text-gray-500 hover:text-white transition-colors"><Paperclip size={20} /></button>
                             <button type="button" className="p-1 text-gray-500 hover:text-white transition-colors"><Mic size={20} /></button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="bg-[#FF6B00] hover:bg-[#ff7b20] disabled:bg-gray-800 disabled:opacity-50 text-white p-3.5 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center"
                    >
                        <Send size={22} strokeWidth={2.5} />
                    </button>
                </form>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #222; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #FF6B00; }
            `}</style>
        </div>
    );
};

export default ChatDetail;
