import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ShieldCheck, MessageSquare, Smile, Mic, Bell,
    Briefcase, Handshake, Globe, TrendingUp,
    NotebookPen, Save, ArrowRight, X, Loader2, ChevronLeft, Search, Paperclip, ShoppingBag, Send
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
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
    const { setIsGuestInteractionModalOpen } = useUI();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [isNotepadOpen, setIsNotepadOpen] = useState(false);
    const [notepadTitle, setNotepadTitle] = useState('');
    const [notepadContent, setNotepadContent] = useState('');
    
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

        // [PROTOCOL COMUNITAT OBERTA v11.2.0] Blindatge de Convidat
        if (user?.isAnonymous) {
            setIsGuestInteractionModalOpen(true);
            return;
        }

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
        <div className="flex-1 flex flex-col h-full bg-black overflow-hidden relative">
            
            {/* HEADER DEL XAT - CABECERA NEGRA RESPONSIVE (1er MANDAMENT v9.0.0) - EXACTLY 64px */}
            <header className="h-16 min-h-[64px] px-4 md:px-6 flex items-center justify-between bg-black border-b border-gray-800 flex-shrink-0 z-30 text-white">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/chats')} className="md:hidden w-12 h-12 flex items-center justify-center -ml-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={40} />
                        <div className="flex flex-col min-w-0">
                            <h2 className="text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors truncate leading-none">
                                {otherInfo?.name || t('common.unknown')}
                            </h2>
                            <span className="text-xs text-green-500 font-medium whitespace-nowrap">{(otherInfo?.id === 'iaia-oficial') ? 'Bategant' : 'En línia'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button 
                        onClick={() => setIsNotepadOpen(!isNotepadOpen)} 
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isNotepadOpen ? 'bg-[#FF6D00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
                        title="Bloc de Notes"
                    >
                        <NotebookPen size={20} />
                    </button>

                    <Search size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors hidden sm:block" />
                    
                    <button className="text-gray-400 hover:text-yellow-400 transition-colors p-1.5 hidden sm:block">
                        <Smile size={20} />
                    </button>
                    
                    <div className="avatar-box cursor-pointer hover:scale-110 transition-transform flex items-center justify-center w-12 h-12 ml-2" onClick={() => navigate("/perfil")}>
                        <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-[#1a1a1c]">
                            {impersonatedProfile?.avatar_url ? (
                                <img src={impersonatedProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-black text-white uppercase bg-gradient-to-br from-gray-700 to-black">
                                    {(impersonatedProfile?.full_name || user?.email || "U").substring(0, 1).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* SPLIT VIEW ENGINE: CONTENIDOR DE XAT + BLOC DE NOTES (v10.12) */}
            <div className="flex-1 flex overflow-hidden">
                {/* 1. PANNELL DE MISSATGES (FLEX-1) */}
                <div className="flex-1 flex flex-col min-w-0 bg-black/10">
                    {/* LLISTA DE MISSATGES - GEM MODERN v7.1 STYLED */}
                    <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar bg-black/40">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                {otherInfo?.id === 'iaia-oficial' ? (
                                    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500 opacity-100">
                                        <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl shadow-lg border-4 border-white/20">👵</div>
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold text-white mb-2">Hola, Mestre Javi.</h2>
                                            <p className="text-gray-400 max-w-xs mx-auto mb-8">Sóc la teua IAIA. Tinc els dossiers preparats per als nostres socis.</p>
                                            
                                            <div className="grid grid-cols-1 gap-4 w-full">
                                                <button 
                                                    onClick={() => navigate('/ofici?section=partners')}
                                                    className="p-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all text-left flex items-center gap-4 group"
                                                >
                                                    <Briefcase className="w-10 h-10 group-hover:animate-bounce" />
                                                    <div>
                                                        <h3 className="font-bold text-lg">Dossier de Partners 💼</h3>
                                                        <p className="text-xs opacity-70">Viabilitat tècnica i econòmica Sollutia.</p>
                                                    </div>
                                                </button>

                                                <div className="flex gap-4">
                                                    <button className="flex-1 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-all">
                                                        <Globe className="w-6 h-6 mb-2 text-indigo-400" />
                                                        <h4 className="font-bold text-sm">Federació</h4>
                                                    </button>
                                                    <button className="flex-1 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-all">
                                                        <TrendingUp className="w-6 h-6 mb-2 text-green-400" />
                                                        <h4 className="font-bold text-sm">Models</h4>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                <Handshake size={14} />
                                                <span>Focus Sollutia v10.9.0</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <MessageSquare size={56} className="text-gray-600 mb-4" />
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">{t('common.write_message')}</p>
                                    </>
                                )}
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
                </div>

                {/* 2. PANNELL BLOC DE NOTES (DRETA) */}
                {isNotepadOpen && (
                    <div className="hidden md:flex flex-col w-[380px] bg-[#0A0A0A] border-l border-gray-800 animate-in slide-in-from-right duration-300">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-black">
                            <div className="flex items-center gap-3 text-[#FF6D00] font-black uppercase text-xs tracking-widest">
                                <NotebookPen size={18} />
                                <span>Bloc de Notes</span>
                            </div>
                            <button onClick={() => setIsNotepadOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 p-6 flex flex-col gap-6">
                            <input 
                                type="text"
                                value={notepadTitle}
                                onChange={(e) => setNotepadTitle(e.target.value)}
                                placeholder="Títol de l'esborrany..."
                                className="w-full bg-transparent border-b border-gray-800 py-2 text-xl font-black text-white focus:outline-none focus:border-[#FF6D00] placeholder:text-gray-800"
                            />
                            
                            <textarea 
                                value={notepadContent}
                                onChange={(e) => setNotepadContent(e.target.value)}
                                placeholder="Escriu ací la teua idea, un bando o una oferta per al mercat..."
                                className="flex-1 w-full bg-transparent resize-none text-gray-400 leading-relaxed focus:outline-none placeholder:text-gray-800"
                            />
                        </div>

                        <div className="p-6 border-t border-gray-800 bg-black space-y-3">
                            <button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-900/40">
                                <ArrowRight size={16} />
                                <span>Publicar al Mur</span>
                            </button>
                            <button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/40">
                                <ShoppingBag size={16} />
                                <span>Publicar al Mercat</span>
                            </button>
                            <button className="w-full h-12 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest border border-white/10">
                                <Save size={16} />
                                <span>Guardar Esborrany</span>
                            </button>
                        </div>
                    </div>
                )}
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
