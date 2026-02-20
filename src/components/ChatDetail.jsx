import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { iaiaService } from '../services/iaiaService';
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
    const [isRecording, setIsRecording] = useState(false);
    
    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = activeEntityId || humanId;
    const isP1Current = chat?.participant_1_id === currentUserId;
    const otherInfo = chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { state } = useLocation();

    useEffect(() => {
        if (!user || !currentUserId) return;
        const fetchChatData = async () => {
            try {
                const chats = await supabaseService.getConversations(currentUserId);
                let currentChat = chats.find(c => c.id === id);
                
                if (!currentChat && state?.chatInfo) {
                    currentChat = state.chatInfo;
                }

                if (currentChat) {
                    setChat(currentChat);
                    const msgs = await supabaseService.getConversationMessages(id);
                    setMessages(msgs);
                    await supabaseService.markMessagesAsRead(id, currentUserId);
                } else if (id.startsWith('11111111-')) {
                    const AGENTS = [
                        { id: '11111111-1111-4111-a111-000000000000', name: 'IAIA MarIA' },
                        { id: '11111111-1111-4111-a111-000000000003', name: 'Vicent Ferris' },
                        { id: '11111111-1111-4111-a111-000000000004', name: 'Pepica la Vall' },
                        { id: '11111111-1111-4111-a111-000000000009', name: 'Andreu Soler' },
                        { id: '11111111-1111-4111-a111-000000000008', name: 'Joan Batiste' },
                        { id: '11111111-0000-0000-0000-000000000001', name: 'Super Ratolí' },
                        { id: '11111111-1111-4111-a111-000000000006', name: 'Sultan' },
                        { id: '11111111-1a1a-0001-0000-000000000011', name: 'La Mixa' },
                        { id: '11111111-1a1a-0001-0000-000000000012', name: 'El Gall' },
                        { id: '11111111-1111-4111-a111-000000000007', name: 'Nano Banana' },
                        { id: '11111111-1111-4111-a111-000000000013', name: 'El Viatjant' },
                        { id: '11111111-1111-4111-a111-000000000014', name: 'Beatriz Ortega' },
                        { id: '11111111-1111-4111-a111-000000000015', name: 'Carla Soriano' },
                        { id: '11111111-1111-4111-a111-000000000016', name: 'Elena Popova' }
                    ];
                    const agent = AGENTS.find(a => a.id === id);
                    setChat({ id: id, other_info: { id: id, name: agent?.name || 'Agent Especialista' } });
                }
            } catch (error) {
                logger.error('Error fetching chat data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChatData();
    }, [id, currentUserId, user, state]);

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages.length]);

    useEffect(() => {
        if (!user || !currentUserId || !id) return;

        const channel = supabaseService.subscribeToMessages(id, (payload) => {
            if (payload.new) {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
                if (payload.new.sender_id !== currentUserId) {
                    supabaseService.markMessagesAsRead(id, currentUserId);
                }
            }
        });

        return () => {
            supabaseService.unsubscribe(channel);
        };
    }, [id, currentUserId, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
        if (user?.isAnonymous && !isIAIA) {
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
            
            setMessages(prev => {
                if (prev.find(m => m.id === result.id)) return prev;
                return [...prev, result];
            });

            if (id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-')) {
                iaiaService.generateAIAResponse(id, text, id).then(filler => {
                    if (filler && typeof filler === 'object') {
                        setMessages(prev => {
                            if (prev.find(m => m.id === filler.id)) return prev;
                            return [...prev, filler];
                        });
                    }
                }).catch(err => logger.error('[ChatDetail] Error in IAIA response:', err));
            }
        } catch (err) { logger.error('Error sending message:', err); }
    };

    if (loading) return <div className="flex-1 bg-theme-base flex items-center justify-center"><Loader2 className="animate-spin text-[#FF6B00]" size={40} /></div>;

    return (
        <div className="chat-detail-container flex-1 flex flex-col min-h-0">
            {/* SCANLINES RETRO-FUTURISTES */}
            <div className="chat-list-scanlines" />
            
            {/* HEADER DEL XAT - CABECERA NEGRA RESPONSIVE (1er MANDAMENT v9.0.0) - EXACTLY 64px */}
            <header className="h-16 min-h-[64px] px-4 md:px-6 flex items-center justify-between bg-theme-header border-b border-white/5 flex-shrink-0 z-30 text-theme-text">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/chats')} className="md:hidden w-12 h-12 flex items-center justify-center -ml-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate(`/perfil/${otherInfo?.id}`)}
                    >
                        <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={40} />
                        <div className="flex flex-col min-w-0">
                            <h2 className="text-lg font-bold text-theme-text group-hover:text-[#FF6B00] transition-colors truncate leading-none">
                                {otherInfo?.name || 'Foraster'}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${(otherInfo?.id?.startsWith('11111111-')) ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                    {(otherInfo?.id?.startsWith('11111111-')) ? 'IAIA Bategant' : 'En línia ara'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button 
                        onClick={() => setIsNotepadOpen(!isNotepadOpen)} 
                        className={`w-10 h-10 flex items-center justify-center genesis-radius transition-all ${isNotepadOpen ? 'bg-[#FF6D00] text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
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
            <div className="chat-split-view-container flex-1 flex min-h-0 bg-theme-base">
                {/* 1. PANNELL DE MISSATGES (FLEX-1) */}
                <div className="chat-messages-panel flex-1 flex flex-col min-h-0 bg-theme-base">
                    <div className="messages-container custom-scrollbar chat-messages-list flex-1">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                {otherInfo?.id === 'iaia-oficial' ? (
                                    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500 opacity-100">
                                        <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl shadow-lg border-4 border-white/20">👵</div>
                                        <div className="text-center">
                                            <h2 className="text-3xl font-bold text-theme-text mb-2">Hola, Mestre Javi.</h2>
                                            <p className="text-gray-400 max-w-xs mx-auto mb-8">Sóc la teua IAIA. Tinc els dossiers preparats per als nostres socis.</p>
                                            
                                            <div className="grid grid-cols-1 gap-4 w-full">
                                                <button 
                                                    onClick={() => navigate('/ofici?section=partners')}
                                                    className="p-6 genesis-radius bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all text-left flex items-center gap-4 group"
                                                >
                                                    <Briefcase className="w-10 h-10 group-hover:animate-bounce" />
                                                    <div>
                                                        <h3 className="font-bold text-lg">Dossier de Partners 💼</h3>
                                                        <p className="text-xs opacity-70">Viabilitat tècnica i econòmica Sollutia.</p>
                                                    </div>
                                                </button>

                                                <div className="flex gap-4">
                                                    <button className="flex-1 p-4 card-radius border border-white/10 hover:bg-white/5 text-left transition-all">
                                                        <Globe className="w-6 h-6 mb-2 text-indigo-400" />
                                                        <h4 className="font-bold text-sm">Federació</h4>
                                                    </button>
                                                    <button className="flex-1 p-4 card-radius border border-white/10 hover:bg-white/5 text-left transition-all">
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
                                        <div className={`max-w-[85%] md:max-w-[65%] card-radius p-4 relative shadow-2xl
                                            ${isMe ? 'bg-[#FF6B00] text-white rounded-tr-none' : 'bg-theme-panel text-theme-text rounded-tl-none border border-white/5'}`}>
                                            
                                            {!isMe && (msg.author_name || otherInfo?.name) && (
                                                <div className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest mb-2 opacity-80">
                                                    {msg.author_name || otherInfo?.name}
                                                </div>
                                            )}

                                            <div className="text-[17px] leading-snug break-words font-medium">
                                                {msg.content}
                                            </div>

                                            <div className="mt-2 flex items-center justify-end gap-2 opacity-50">
                                                <span className="text-[10px] font-black uppercase">
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ara'}
                                                </span>
                                                {isMe && (
                                                    <span className={`text-[11px] font-black ${msg.read_at ? 'text-blue-300' : 'text-white/40'}`}>
                                                        {msg.read_at ? '✓✓' : '✓✓'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {/* INDICADOR D'ESCRIPTURA (v-WA Parity) */}
                        <div className="h-4">
                            {otherInfo?.id?.startsWith('11111111-') && messages.length > 0 && messages[messages.length-1].sender_id === humanId && (
                                <div className="flex items-center gap-2 text-[10px] font-black text-[#FF6B00] animate-pulse">
                                    <span>{otherInfo.name.toUpperCase()} ESTÀ BATEGANT</span>
                                    <div className="flex gap-1">
                                        <span className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* ÀREA D'ENTRADA DE MISSATGES (v10.30.0 - GEM MODERN) */}
                    <div className="chat-input-master-wrapper p-4 md:p-6 bg-theme-header/80 backdrop-blur-xl border-t border-white/5 z-[100] flex-shrink-0 safe-area-bottom">
                        <div className="max-w-5xl mx-auto relative">
                            {/* OVERLAY DE GRAVACIÓ DE VEU */}
                            {isRecording ? (
                                <div className="voice-recorder-overlay animate-in slide-in-from-bottom-5 duration-300">
                                    <VoiceRecorder 
                                        onSend={(blob, duration, transcript) => {
                                            logger.log('[ChatDetail] Voice message captured:', duration, transcript);
                                            setIsRecording(false);
                                            // Aquí es podria enviar el blob a Supabase Storage
                                            if (transcript) {
                                                setNewMessage(transcript);
                                            }
                                        }}
                                        onCancel={() => setIsRecording(false)}
                                    />
                                </div>
                            ) : (
                                <form className="flex items-center gap-3" onSubmit={handleSendMessage}>
                                    {/* BOTÓ ADJUNTAR (PLUS MODERN) */}
                                    <button 
                                        type="button" 
                                        className="w-12 h-12 flex items-center justify-center genesis-radius bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                                    >
                                        <Paperclip size={22} />
                                    </button>

                                    {/* INPUT PRINCIPAL BATEGANT */}
                                    <div className="flex-1 relative group">
                                        <input 
                                            type="text" 
                                            value={newMessage} 
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={t('common.write_message')}
                                            className="w-full bg-white/5 border border-white/10 genesis-radius px-6 py-4 text-theme-text focus:outline-none focus:border-[#FF6B00]/40 focus:bg-white/[0.08] transition-all placeholder:text-gray-600 font-medium text-[17px]"
                                        />
                                        
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <button 
                                                type="button" 
                                                className="p-2.5 text-gray-500 hover:text-yellow-400 transition-colors"
                                            >
                                                <Smile size={22} />
                                            </button>
                                            
                                            <button 
                                                type="button" 
                                                onClick={() => setIsRecording(true)}
                                                className="p-2.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                                            >
                                                <Mic size={22} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* BOTÓ ENVIAR CANÒNIC (GEM MODERN) */}
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="w-14 h-14 bg-[#FF6B00] hover:bg-[#ff7b20] disabled:bg-gray-800 disabled:opacity-30 text-white genesis-radius transition-all shadow-[0_8px_24px_rgba(255,107,0,0.3)] active:scale-95 flex items-center justify-center group"
                                    >
                                        <Send size={24} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. PANNELL BLOC DE NOTES (DRETA) */}
                {isNotepadOpen && (
                    <div className="hidden md:flex flex-col w-[380px] bg-theme-sidebar border-l border-white/5 animate-in slide-in-from-right duration-300">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-theme-header">
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
                                className="w-full bg-transparent border-b border-white/5 py-2 text-2xl font-black text-theme-text focus:outline-none focus:border-[#FF6D00] placeholder:text-gray-800"
                            />
                            
                            <textarea 
                                value={notepadContent}
                                onChange={(e) => setNotepadContent(e.target.value)}
                                placeholder="Escriu ací la teua idea, un bando o una oferta per al mercat..."
                                className="flex-1 w-full bg-transparent resize-none text-gray-400 leading-relaxed focus:outline-none placeholder:text-gray-800"
                            />
                        </div>

                        <div className="p-6 border-t border-white/5 bg-theme-header space-y-3">
                            <button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white genesis-radius flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-900/40">
                                <ArrowRight size={16} />
                                <span>Publicar al Mur</span>
                            </button>
                            <button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white genesis-radius flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/40">
                                <ShoppingBag size={16} />
                                <span>Publicar al Mercat</span>
                            </button>
                            <button className="w-full h-12 bg-white/5 hover:bg-white/10 text-gray-400 genesis-radius flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest border border-white/10">
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
