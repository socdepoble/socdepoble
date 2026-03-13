import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, MessageSquare, Smile, Mic, Bell,
    Briefcase, Handshake, Globe, TrendingUp,
    NotebookPen, Save, ArrowRight, X, Loader2, ChevronLeft, Search, Paperclip, ShoppingBag, Send, Settings,
    Check, CheckCheck, MoreVertical, Image, Camera, MapPin, User, FileText, Headphones, BarChart2, CalendarDays
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useModal } from '../context/ModalContext';
import Avatar from './Avatar';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import { iaiaService } from '../services/iaiaService';
import VoiceRecorder from './VoiceRecorder';
import UniversalCitation from './UniversalCitation';
import CopyButton from './CopyButton';

const ChatDetail = () => {
    const { chatSettings } = useNavigation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin } = useAuth();
    const { setIsGuestInteractionModalOpen, openPostModal } = useModal();
    const [chat, setChat] = useState(null);
    const [realChatId, setRealChatId] = useState(id);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [isNotepadOpen, setIsNotepadOpen] = useState(false);
    const [notepadTitle, setNotepadTitle] = useState('');
    const [notepadContent, setNotepadContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    // Drag & Drop State
    const [isDragging, setIsDragging] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [attachedFilePreview, setAttachedFilePreview] = useState(null);
    const dragCounter = useRef(0);
    
    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = user?.id || (user?.isAnonymous ? `anon-${Math.random().toString(36).substr(2, 9)}` : 'guest');
    
    // BISTURÍ 4: Escut d'existència (React Unmount Crashes)
    const isComponentMounted = useRef(true);
    useEffect(() => {
        isComponentMounted.current = true;
        return () => { isComponentMounted.current = false; };
    }, []);
    const isP1Current = chat?.participant_1_id === currentUserId;
    const otherInfo = chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { state } = useLocation();

    const readReceiptsRef = useRef(chatSettings.readReceipts);
    useEffect(() => { readReceiptsRef.current = chatSettings.readReceipts; }, [chatSettings.readReceipts]);

    const isRealChatIdResolved = useRef(false);
    
    // DeepSeek V7: Ref del canal WebSocket per evitar fuites en canvis de visibilitat
    const channelRef = useRef(null);

    useEffect(() => {
        setRealChatId(id);
        isRealChatIdResolved.current = false;
    }, [id]);

    useEffect(() => {
        if (!user || !currentUserId) return;
        let isMounted = true;
        const fetchChatData = async () => {
            try {
                const chats = await supabaseService.getConversations(currentUserId);
                if (!isMounted) return;
                
                let currentChat = chats.find(c => c.id === id);
                
                if (!currentChat && state?.chatInfo) {
                    currentChat = state.chatInfo;
                }

                if (currentChat) {
                    setRealChatId(currentChat.id);
                    isRealChatIdResolved.current = true;
                    setChat(currentChat);
                    const msgs = await supabaseService.getConversationMessages(currentChat.id);
                    if (!isMounted) return;
                    
                    setMessages(msgs);
                    if (readReceiptsRef.current) {
                        await supabaseService.markMessagesAsRead(currentChat.id, currentUserId);
                    }
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
                    
                    // Ensured AI persistence: Resolve real Supabase UUID
                    const realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'ai');
                    if (!isMounted) return;
                    
                    if (realConv && realConv.id) {
                        setRealChatId(realConv.id);
                        isRealChatIdResolved.current = true;
                        setChat({ id: realConv.id, other_info: { id: id, name: agent?.name || 'Agent Especialista' } });
                        const msgs = await supabaseService.getConversationMessages(realConv.id);
                        if (!isMounted) return;
                        setMessages(msgs);
                    } else {
                        setChat({ id: id, other_info: { id: id, name: agent?.name || 'Agent Especialista' } });
                    }
                }
            } catch (error) {
                if (!isMounted) return;
                logger.error('Error fetching chat data:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchChatData();
        return () => { isMounted = false; };
    }, [id, currentUserId, user, state]);

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages.length]);

    useEffect(() => {
        if (!user || !currentUserId || !realChatId) return;
        if (realChatId === id && !isRealChatIdResolved.current) return;

        channelRef.current = supabaseService.subscribeToMessages(realChatId, (payload) => {
            if (payload.new) {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
                if (payload.new.sender_id !== currentUserId && readReceiptsRef.current) {
                    supabaseService.markMessagesAsRead(realChatId, currentUserId);
                }
            }
        });

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (channelRef.current) supabaseService.unsubscribe(channelRef.current);
                channelRef.current = supabaseService.subscribeToMessages(realChatId, (payload) => {
                    if (payload.new) {
                        setMessages(prev => {
                            if (prev.find(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new];
                        });
                        if (payload.new.sender_id !== currentUserId && readReceiptsRef.current) {
                            supabaseService.markMessagesAsRead(realChatId, currentUserId);
                        }
                    }
                });
                
                supabaseService.getConversationMessages(realChatId).then(msgs => {
                    if (!isComponentMounted.current) return; // ESCUT ACTIVAT
                    if (msgs?.length) {
                        setMessages(prev => {
                            const existingIds = new Set(prev.map(m => m.id));
                            const newMsgs = msgs.filter(m => !existingIds.has(m.id));
                            return newMsgs.length ? [...prev, ...newMsgs] : prev;
                        });
                    }
                }).catch(err => logger.error('[ChatDetail] Background recovery fetch error:', err));
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (channelRef.current) supabaseService.unsubscribe(channelRef.current);
        };
    }, [realChatId, currentUserId, user, id]);

    const handleNotReady = () => {
        alert("Una alquímia del Mestre Javi està forjant aquesta funcionalitat. Prompte bategarà.");
        setIsAttachmentMenuOpen(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
        if (user?.isAnonymous && !isIAIA) {
            setIsGuestInteractionModalOpen(true);
            return;
        }

        if (isSending || !newMessage.trim()) return;
        const text = newMessage.trim();
        
        // 2. UI Optimista: Neteja IMMEDIATA i bloqueig per a alliberar l'usuari
        setNewMessage('');
        setIsSending(true);
        setIsAttachmentMenuOpen(false);
        
        // --- MASTER COMMAND INTERCEPT: AI-to-AI Debate ---
        if (text === '/solatge interact') {
            setNewMessage('');
            iaiaService.simulateAgentDebate().catch(err => logger.error('[Solatge Interact]', err));
            setMessages(prev => [
                ...prev, 
                {
                    id: `cmd-req-${Date.now()}`,
                    sender_id: humanId,
                    content: text,
                    created_at: new Date().toISOString()
                },
                {
                    id: `cmd-res-${Date.now()}`,
                    sender_id: 'system',
                    content: '⚙️ Bategat remot: Iniciant debat entre IAIAs a la DB pública. Comprova el fil de Pobles.',
                    created_at: new Date().toISOString()
                }
            ]);
            return;
        }

        let timerId;
        try {
            const timeoutPromise = new Promise((_, reject) => {
                timerId = setTimeout(() => reject(new Error('NETWORK_TIMEOUT')), 12000);
            });
            
            const result = await Promise.race([
                supabaseService.sendSecureMessage({
                    conversationId: realChatId,
                    senderId: humanId,
                    senderEntityId: activeEntityId,
                    content: text,
                    isGuest: user?.isAnonymous
                }),
                timeoutPromise
            ]);
            clearTimeout(timerId);
            
            if (!result?.id) throw new Error('Invalid server response');

            setMessages(prev => {
                if (prev.find(m => m.id === result.id)) return prev;
                return [...prev, result];
            });

            if (id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-')) {
                iaiaService.generateAIAResponse(realChatId, text, otherInfo?.id || id).then(filler => {
                    if (!isComponentMounted.current) return;
                    if (filler && typeof filler === 'object') {
                        setMessages(prev => {
                            if (prev.find(m => m.id === filler.id)) return prev;
                            return [...prev, filler];
                        });
                    }
                }).catch(err => logger.error('[ChatDetail] Error in IAIA response:', err));
            }
        } catch (err) { 
            clearTimeout(timerId);
            logger.error('Error sending message:', err); 
            setNewMessage(text); // 3. Rollback: Recupera el text només si la xarxa falla
        } finally {
            setIsSending(false); // 4. Desactiva l'escut
        }
    };

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => !searchQuery || msg.content?.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [messages, searchQuery]);

    const renderedMessages = useMemo(() => {
        return filteredMessages.map(msg => {
            const isMe = msg.sender_id === humanId;
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] md:max-w-[65%] card-radius p-4 relative shadow-2xl
                        ${isMe ? 'bg-[#fff3e0] text-[#000] dark:bg-[#bfdbfe] dark:text-[#000] rounded-tr-none' : 'bg-theme-panel text-theme-text rounded-tl-none border border-[var(--border-master)]'}`}>
                        
                        {!isMe && (msg.author_name || otherInfo?.name) && (
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 opacity-80 text-[var(--theme-accent-primary)]`}>
                                {msg.author_name || otherInfo?.name}
                            </div>
                        )}

                        <div className="text-[17px] leading-snug break-words font-medium">
                            {msg.attachment_type === 'voice' ? (
                                <div className="flex items-center gap-3 py-1 min-w-[200px]">
                                    <button
                                        onClick={() => {
                                            const audio = new Audio(msg.attachment_url);
                                            audio.play().catch(err => logger.error('[Voice] Play error:', err));
                                        }}
                                        className="w-10 h-10 rounded-[28px] bg-white/20 flex items-center justify-center shrink-0 hover:bg-white/30 transition-colors active:scale-95 cursor-pointer"
                                        aria-label="Reproduir missatge de veu"
                                    >
                                        <Mic size={20} className="text-white" />
                                    </button>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-1 bg-white/30 rounded-full w-full overflow-hidden">
                                            <div className="h-full bg-white/70 w-1/3 rounded-[28px]" />
                                        </div>
                                        <div className="text-[10px] opacity-70 flex justify-between">
                                            <span>{msg.voice_meta?.duration ? `${msg.voice_meta.duration}s` : '—'}</span>
                                            <span className="uppercase tracking-tighter">Bategat de veu</span>
                                        </div>
                                    </div>
                                </div>
                            ) : msg.attachment_url ? (
                                <div className="space-y-2">
                                    {msg.attachment_type === 'image' ? (
                                        <img src={msg.attachment_url} alt={msg.attachment_name} className="rounded-[20px] max-h-60 w-auto object-cover" />
                                    ) : (
                                        <div className="flex items-center gap-2 p-2 bg-black/10 rounded-[20px] border border-[var(--border-master)]">
                                            <Paperclip size={16} />
                                            <span className="text-xs truncate max-w-[150px]">{msg.attachment_name || 'Arxiu'}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>

                        <div className="mt-2 flex items-center justify-end gap-1.5 opacity-60">
                            <span className="text-[10px] font-black uppercase text-white/50">
                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ara'}
                            </span>
                            {isMe && (
                                <div className="flex items-center -space-x-1">
                                    {msg.read_at ? (
                                        <CheckCheck size={14} className="text-[var(--theme-accent-secondary)] animate-in zoom-in duration-300" title="Llegit" />
                                    ) : msg.status === 'delivered' ? (
                                        <CheckCheck size={14} className="text-black/40 dark:text-white/40" title="Entregat" />
                                    ) : (
                                        <Check size={14} className="text-black/40 dark:text-white/40" title="Enviat" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    }, [filteredMessages, humanId, otherInfo?.name]);

    if (loading) return <div className="flex-1 bg-theme-base flex items-center justify-center"><Loader2 className="animate-spin text-[var(--theme-accent-primary)]" size={40} /></div>;

    return (
        <div className="chat-detail-container flex-1 flex flex-col min-h-0 relative">
            {/* SCANLINES RETRO-FUTURISTES */}
            <div className="chat-list-scanlines" />
            
            {/* HEADER DEL XAT - CABECERA NEGRA RESPONSIVE (1er MANDAMENT v9.0.0) - EXACTLY 64px */}
            <header className={`h-16 min-h-[64px] px-4 md:px-6 flex items-center justify-between border-b border-[var(--border-master)] flex-shrink-0 z-30 transition-colors ${otherInfo?.id?.startsWith('11111111-') ? 'bg-[var(--theme-accent-primary)] text-white' : 'bg-theme-header text-theme-text'}`}>
                {/* ZONA CLICABLE GLOBAL: Tot el costat esquerre porta al perfil */}
                <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer group transition-all"
                    onClick={() => {
                         if (otherInfo?.id?.startsWith('11111111-')) {
                            navigate(`/perfil/${otherInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                         } else {
                            navigate(`/perfil/${otherInfo?.id}`);
                         }
                    }}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/chats'); }} 
                        className="md:hidden w-12 h-12 flex items-center justify-center -ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    
                    {isHeaderSearchOpen ? (
                        <input
                            autoFocus
                            type="text"
                            placeholder="Cerca fragments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-black/20 border border-[var(--border-master)] text-white placeholder:text-white/50 px-4 py-2 rounded-[28px] focus:outline-none mr-2"
                        />
                    ) : (
                        <>
                            <div className={otherInfo?.id?.startsWith('11111111-') ? 'bg-white rounded-full p-0.5 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : ''}>
                                <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={40} />
                            </div>
                            
                            <div className="flex flex-col min-w-0 pr-2 flex-1">
                                <h2 className={`text-lg font-bold truncate leading-none transition-colors ${otherInfo?.id?.startsWith('11111111-') ? 'text-white' : 'text-theme-text group-hover:text-[var(--theme-accent-primary)]'}`}>
                                    {otherInfo?.name || 'Foraster'}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${(otherInfo?.id?.startsWith('11111111-')) ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'bg-green-500'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest opacity-80 ${otherInfo?.id?.startsWith('11111111-') ? 'text-[var(--sdp-white)]' : 'text-gray-400'}`}>
                                        {(otherInfo?.id?.startsWith('11111111-')) ? 'IAIA Bategant' : 'En línia ara'}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4 ml-auto z-10 bg-[var(--theme-accent-secondary)] dark:bg-[var(--theme-accent-primary)] rounded-[20px] px-5 py-2 shadow-inner shadow-black/20">
                    <button 
                        onClick={() => setIsNotepadOpen(!isNotepadOpen)} 
                        className={`transition-all hover:scale-110 active:scale-95 text-white filter drop-shadow-md ${isNotepadOpen ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-80'}`}
                        title="Bloc de Notes"
                    >
                        <NotebookPen size={22} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                        className={`transition-all hover:bg-white/10 rounded-full p-2 text-white filter drop-shadow-md sm:block ${isHeaderSearchOpen ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-80'}`}
                        title="Cercar en la conversa"
                    >
                        <Search size={22} strokeWidth={2.5} />
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                            className={`transition-all hover:bg-white/10 rounded-full p-2 text-white filter drop-shadow-md sm:block ${isSettingsMenuOpen ? 'opacity-100 bg-white/10' : 'opacity-80'}`}
                            title="Opcions del Xat"
                        >
                            <MoreVertical size={22} strokeWidth={2.5} />
                        </button>

                        {isSettingsMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
                                <div className="absolute top-12 right-0 w-64 bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.2)] py-2 z-50 text-[15px] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Afegeix membres</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); navigate(`/gestio/xats/${realChatId}`); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Informació del grup</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Fitxers multimèdia del grup</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Cerca</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Silenciar notificacions</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Missatges temporals</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Tema del xat</button>
                                    <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors flex justify-between items-center group">
                                        Més
                                        <ChevronLeft size={16} className="rotate-180 text-gray-400 group-hover:text-white" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* SPLIT VIEW ENGINE: CONTENIDOR DE XAT + BLOC DE NOTES (v10.12) */}
            <div className="chat-split-view-container flex-1 flex min-h-0 bg-theme-base">
                {/* 1. PANNELL DE MISSATGES (FLEX-1) */}
                <div className="chat-messages-panel flex-1 flex flex-col min-h-0 bg-theme-base">
                    <div className="messages-container custom-scrollbar chat-messages-list flex-1 px-4 md:px-6 py-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                {otherInfo?.id === 'iaia-oficial' ? (
                                    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500 opacity-100">
                                        <div className="w-24 h-24 rounded-[28px] bg-orange-500 flex items-center justify-center text-4xl shadow-lg border-4 border-[var(--border-master)]">👵</div>
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
                                                    <button className="flex-1 p-4 card-radius border border-[var(--border-master)] hover:bg-white/5 text-left transition-all">
                                                        <Globe className="w-6 h-6 mb-2 text-indigo-400" />
                                                        <h4 className="font-bold text-sm">Federació</h4>
                                                    </button>
                                                    <button className="flex-1 p-4 card-radius border border-[var(--border-master)] hover:bg-white/5 text-left transition-all">
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
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
                                            {otherInfo?.name ? `PARLA AMB ${otherInfo.name.toUpperCase()}` : t('common.write_message')}
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            renderedMessages
                        )}
                        {/* INDICADOR D'ESCRIPTURA (v-WA Parity) */}
                        <div className="h-4">
                            {otherInfo?.id?.startsWith('11111111-') && messages.length > 0 && messages[messages.length-1].sender_id === humanId && (
                                <div className="flex items-center gap-2 text-[10px] font-black text-[var(--theme-accent-primary)] animate-pulse">
                                    <span>{otherInfo.name.toUpperCase()} ESTÀ BATEGANT</span>
                                    <div className="flex gap-1">
                                        <span className="w-1 h-1 bg-[var(--theme-accent-primary)] rounded-[28px] animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1 h-1 bg-[var(--theme-accent-primary)] rounded-[28px] animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1 h-1 bg-[var(--theme-accent-primary)] rounded-[28px] animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 3. ÀREA D'ENTRADA DE MISSATGES (AMB EXD/VOICE CANÒNIC) */}
                <div className="chat-input-master-wrapper px-4 md:px-6 py-[12px] bg-[var(--theme-accent-primary)] dark:bg-[var(--theme-accent-secondary)] border-t border-transparent z-[50] flex-shrink-0 relative focus-within:z-[60] transition-colors">
                        <div className="max-w-5xl mx-auto relative">
                            {/* OVERLAY DE GRAVACIÓ DE VEU */}
                            {isRecording ? (
                                <div className="voice-recorder-overlay animate-in slide-in-from-bottom-5 duration-300">
                                    <VoiceRecorder 
                                        onSend={async (blob, duration, transcript) => {
                                            logger.log('[ChatDetail] Voice message captured:', duration, transcript);
                                            setIsRecording(false);
                                            if (!blob) return;

                                            try {
                                                const fileName = `voice-${Date.now()}-${humanId}.webm`;
                                                const { error: uploadError } = await supabase.storage
                                                    .from('voice-messages')
                                                    .upload(fileName, blob, { contentType: 'audio/webm' });
                                                
                                                if (uploadError) throw uploadError;

                                                const { data: urlData } = supabase.storage
                                                    .from('voice-messages')
                                                    .getPublicUrl(fileName);

                                                await supabaseService.sendSecureMessage({
                                                    conversationId: realChatId,
                                                    senderId: humanId,
                                                    senderEntityId: activeEntityId,
                                                    content: transcript || '🎤 Missatge de veu',
                                                    attachmentUrl: urlData.publicUrl,
                                                    attachmentType: 'voice',
                                                    voice_meta: { duration },
                                                });
                                            } catch (err) {
                                                logger.error('[ChatDetail] Error sending voice message:', err);
                                                if (transcript) setNewMessage(transcript);
                                            }
                                        }}
                                        onCancel={() => setIsRecording(false)}
                                    />
                                </div>
                            ) : user?.isAnonymous && !id.startsWith('11111111-') ? (
                                <div className="w-full relative">
                                    <button 
                                        onClick={(e) => { e.preventDefault(); setIsGuestInteractionModalOpen(true); }}
                                        className="w-full h-[48px] genesis-radius bg-theme-panel border border-orange-500/50 hover:bg-orange-500/10 text-orange-400 font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={18} />
                                        <span>Atenció: Conversació Efímera. Toca per Registrar-te.</span>
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-2 uppercase tracking-widest hidden md:block">
                                        Aquest xat no s'està guardant al teu nom.
                                    </p>
                                </div>
                            ) : (
                                    <div className="flex flex-col gap-2 w-full">
                                        
                                        {/* PREVISUALITZACIÓ D'ADJUNT (DRAG & DROP) */}
                                        {attachedFile && (
                                            <div className="flex w-full overflow-x-auto custom-scrollbar pb-2 pt-1 px-1">
                                                <div className="relative inline-flex flex-col animate-in fade-in slide-in-from-bottom-2 bg-white dark:bg-[#1f1f1f] rounded-2xl p-2 shadow-sm border border-[var(--border-master)] max-w-xs shrink-0">
                                                    <button 
                                                        onClick={() => { setAttachedFile(null); setAttachedFilePreview(null); }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                                                    >
                                                        <X size={14} strokeWidth={3} />
                                                    </button>
                                                    
                                                    {attachedFilePreview ? (
                                                        <img src={attachedFilePreview} alt={attachedFile.name} className="w-full h-32 object-cover rounded-xl" />
                                                    ) : (
                                                        <div className="w-full h-32 bg-[var(--bg-master)] rounded-xl flex items-center justify-center text-[var(--theme-accent-primary)]">
                                                            <FileText size={48} opacity={0.5} />
                                                        </div>
                                                    )}
                                                    
                                                    <div className="mt-2 text-xs font-semibold text-center truncate px-2 text-[var(--text-main)] w-full">
                                                        {attachedFile.name}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <form className="flex items-center gap-2 m-0 p-0 w-full" onSubmit={handleSendMessage}>
                                            {/* BOTÓ ADJUNTAR (PLUS MODERN + WA PARITY) */}
                                        <div className="relative flex items-end">
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAttachmentMenuOpen(!isAttachmentMenuOpen); setIsEmojiPickerOpen(false); }}
                                                className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[24px] bg-white/20 dark:bg-black/20 text-white hover:bg-white/30 dark:hover:bg-black/30 transition-all active:scale-95 relative z-10"
                                            >
                                                <Paperclip size={22} />
                                            </button>

                                            {isAttachmentMenuOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsAttachmentMenuOpen(false);}}></div>
                                                    <div className="absolute bottom-[60px] left-0 md:left-4 w-[320px] bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-[0_8px_40px_rgb(0,0,0,0.15)] p-5 z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom">
                                                        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                                                            {/* NORMAL ATTACHMENT GRID (8 ICONS) */}
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <Image size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Galeria</span>
                                                            </button>
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-pink-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <Camera size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Càmera</span>
                                                            </button>
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-green-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <MapPin size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Ubicació</span>
                                                            </button>
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-blue-400 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <User size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Contacte</span>
                                                            </button>
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-indigo-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <FileText size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Document</span>
                                                            </button>
                                                            <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); setIsRecording(true); }} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-red-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <Mic size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Gravar</span>
                                                            </button>
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-yellow-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <BarChart2 size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Enquesta</span>
                                                            </button>
                                                            <button type="button" onClick={handleNotReady} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <CalendarDays size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Esdeveniment</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* INPUT PRINCIPAL BATEGANT */}
                                        <div className="flex-1 relative group flex items-end min-w-0 bg-white dark:bg-[#1f1f1f] rounded-[24px] transition-all shadow-inner">
                                            {/* EMOJI A L'ESQUERRA (ESTIL WHATSAPP) */}
                                            <button
                                                type="button"
                                                onClick={(e) => { 
                                                    e.preventDefault(); 
                                                    e.stopPropagation(); 
                                                    setIsEmojiPickerOpen(!isEmojiPickerOpen); 
                                                    setIsAttachmentMenuOpen(false);
                                                    if (!isEmojiPickerOpen && inputRef.current) {
                                                        inputRef.current.blur(); // Dismiss virtual keyboard
                                                    }
                                                }}
                                                className={`w-[48px] h-[48px] flex items-center justify-center transition-colors shrink-0 ${isEmojiPickerOpen ? 'text-[var(--theme-accent-primary)] drop-shadow-md' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                                            >
                                                <Smile size={24} strokeWidth={2.5} />
                                            </button>

                                            <textarea 
                                                ref={inputRef}
                                                rows={1}
                                                value={newMessage} 
                                                onChange={(e) => {
                                                    setNewMessage(e.target.value);
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage(e);
                                                    }
                                                }}
                                                placeholder={otherInfo?.name ? `Parla amb ${otherInfo.name}...` : t('common.write_message')}
                                                className="flex-1 min-h-[48px] max-h-[120px] bg-transparent border-none py-[12px] px-1 text-black dark:text-white focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium text-[16px] md:text-[17px] align-middle box-border m-0 min-w-0 resize-none overflow-y-auto custom-scrollbar leading-snug"
                                                style={{ height: 'auto' }}
                                                onPaste={(e) => {
                                                    const items = e.clipboardData?.items;
                                                    if (!items) return;
                                                    for (let i = 0; i < items.length; i++) {
                                                        if (items[i].type.indexOf('image') !== -1) {
                                                            e.preventDefault();
                                                            const file = items[i].getAsFile();
                                                            setAttachedFile(file);
                                                            const url = URL.createObjectURL(file);
                                                            setAttachedFilePreview(url);
                                                            break;
                                                        }
                                                    }
                                                }}
                                            />

                                            {isEmojiPickerOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsEmojiPickerOpen(false);}}></div>
                                                    <div className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-0 bottom-[60px] z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom md:origin-bottom-right drop-shadow-2xl flex justify-center w-[calc(100vw-32px)] md:w-auto overflow-hidden rounded-2xl">
                                                        <EmojiPicker 
                                                            theme="auto" 
                                                            onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} 
                                                            width={window.innerWidth < 768 ? '100%' : 350}
                                                            height={window.innerHeight < 600 ? 300 : 400}
                                                            searchPlaceHolder={t('common.search', { defaultValue: 'Cerca...' })}
                                                            categories={[
                                                                { category: 'suggested', name: t('emoji.frequently_used', { defaultValue: 'Utilitzats recentment' }) },
                                                                { category: 'smileys_people', name: t('emoji.smileys_people', { defaultValue: 'Cares i persones' }) },
                                                                { category: 'animals_nature', name: t('emoji.animals_nature', { defaultValue: 'Animals i natura' }) },
                                                                { category: 'food_drink', name: t('emoji.food_drink', { defaultValue: 'Menjar i beguda' }) },
                                                                { category: 'travel_places', name: t('emoji.travel_places', { defaultValue: 'Viatges i llocs' }) },
                                                                { category: 'activities', name: t('emoji.activities', { defaultValue: 'Activitats' }) },
                                                                { category: 'objects', name: t('emoji.objects', { defaultValue: 'Objectes' }) },
                                                                { category: 'symbols', name: t('emoji.symbols', { defaultValue: 'Símbols' }) },
                                                                { category: 'flags', name: t('emoji.flags', { defaultValue: 'Banderes' }) }
                                                            ]}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* BOTÓ ENVIAR CANÒNIC (GEM MODERN) */}
                                        <div className="flex items-end">
                                            <button
                                                type="submit"
                                                disabled={isSending || !newMessage.trim()}
                                                className="w-[48px] h-[48px] shrink-0 bg-white dark:bg-black text-[var(--theme-accent-secondary)] dark:text-[var(--theme-accent-primary)] disabled:opacity-50 rounded-[24px] transition-all shadow-xl active:scale-95 flex items-center justify-center group z-10"
                                            >
                                                <Send size={20} strokeWidth={2.5} className={(newMessage.trim() || attachedFile) ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" : ""} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. PANNELL BLOC DE NOTES (DRETA) */}
                {isNotepadOpen && (
                    <div className="hidden md:flex flex-col w-[380px] bg-theme-sidebar border-l border-[var(--border-master)] animate-in slide-in-from-right duration-300">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-master)] bg-theme-header">
                            <div className="flex items-center gap-3 text-[#FF6D00] font-black uppercase text-xs tracking-widest">
                                <NotebookPen size={18} />
                                <span>Bloc de Notes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CopyButton textToCopy={notepadTitle + "\n\n" + notepadContent} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-[#ff6d23]" />
                                <button onClick={() => setIsNotepadOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-6 flex flex-col gap-6">
                            <input 
                                type="text"
                                value={notepadTitle}
                                onChange={(e) => setNotepadTitle(e.target.value)}
                                placeholder="Títol de l'esborrany..."
                                className="w-full bg-transparent border-b border-[var(--border-master)] py-2 text-2xl font-black text-theme-text focus:outline-none focus:border-[#FF6D00] placeholder:text-gray-800"
                            />
                            
                            <textarea 
                                value={notepadContent}
                                onChange={(e) => setNotepadContent(e.target.value)}
                                placeholder="Escriu ací la teua idea, un bando o una oferta per al mercat..."
                                className="flex-1 w-full bg-transparent resize-none text-gray-400 leading-relaxed focus:outline-none placeholder:text-gray-800"
                            />
                        </div>

                        <div className="p-6 border-t border-[var(--border-master)] bg-theme-header space-y-3">
                            <button onClick={() => { 
                                if (!notepadContent.trim() && !notepadTitle.trim()) return;
                                openPostModal({ isPrivate: false, prefillContent: notepadContent, prefillTitle: notepadTitle }); 
                                setIsNotepadOpen(false); 
                                setNotepadTitle('');
                                setNotepadContent('');
                            }} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white genesis-radius flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-900/40">
                                <ArrowRight size={16} />
                                <span>Publicar al Mur</span>
                            </button>
                            <button onClick={() => handleNotReady()} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white genesis-radius flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/40">
                                <ShoppingBag size={16} />
                                <span>Publicar al Mercat</span>
                            </button>
                            <button onClick={() => { localStorage.setItem('notepad_draft', JSON.stringify({ title: notepadTitle, content: notepadContent, savedAt: new Date().toISOString() })); alert('Esborrany guardat localment ✓'); }} className="w-full h-12 bg-white/5 hover:bg-white/10 text-gray-400 genesis-radius flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest border border-[var(--border-master)]">
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
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary); }
            `}</style>
        </div>
    );
};

export default ChatDetail;
