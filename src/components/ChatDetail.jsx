import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, MessageSquare, Smile, Mic, Bell,
    Briefcase, Handshake, Globe, TrendingUp,
    NotebookPen, Save, ArrowRight, X, Loader2, ChevronLeft, ChevronDown, Search, Paperclip, ShoppingBag, Send, Settings,
    Check, CheckCheck, MoreVertical, Image, Camera, MapPin, User, FileText, Headphones, BarChart2, CalendarDays,
    Reply, Star, Pin, Forward, Copy, Info, Eye, Download, DownloadCloud, Trash2, CheckCircle2
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
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin, isGuest } = useAuth();
    const { setIsGuestInteractionModalOpen, openPostModal } = useModal();
    const [chat, setChat] = useState(null);
    const [realChatId, setRealChatId] = useState(id);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const documentInputRef = useRef(null);
    const [isNotepadOpen, setIsNotepadOpen] = useState(false);
    const [notepadTitle, setNotepadTitle] = useState('');
    const [notepadContent, setNotepadContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [contextMenuId, setContextMenuId] = useState(null);
    const [contextMenuPosition, setContextMenuPosition] = useState('up');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const isSendingRef = useRef(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    
    // Drag & Drop State
    const [attachedFile, setAttachedFile] = useState(null);
    const [attachedFilePreview, setAttachedFilePreview] = useState(null);
    
    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = user?.id || (user?.isAnonymous ? `anon-${Math.random().toString(36).substr(2, 9)}` : 'guest');
    
    // BISTURÍ 4: Escut d'existència (React Unmount Crashes)
    const isComponentMounted = useRef(true);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsAttachmentMenuOpen(false);
        setAttachedFile(file);
        if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setAttachedFilePreview(previewUrl);
        } else {
            setAttachedFilePreview(null);
        }
        e.target.value = null; // Reset
    };
    useEffect(() => {
        isComponentMounted.current = true;
        return () => { isComponentMounted.current = false; };
    }, []);

    // 📱 TACTIL MASTER: Virtual Keyboard & Visual Viewport Engine
    useEffect(() => {
        const handleMobileViewport = () => {
            if (window.visualViewport) {
                const vvHeight = window.visualViewport.height;
                const innerHeight = window.innerHeight;
                setIsKeyboardOpen(vvHeight < innerHeight - 100);
                
                // Nativament, dvh ja s'encarrega d'empetitir el container a Android. 
                // Només hem de forçar l'scroll avall perquè el text no se'ns quede arrere.
                setTimeout(scrollToBottom, 50);
            }
        };

        window.visualViewport?.addEventListener('resize', handleMobileViewport);
        handleMobileViewport();
        
        return () => {
            window.visualViewport?.removeEventListener('resize', handleMobileViewport);
        };
    }, []);

    // Auditoria V3: Alliberament en viu de memòria Blob URL (50MB/h salvats)
    useEffect(() => {
        return () => {
            if (attachedFilePreview) {
                URL.revokeObjectURL(attachedFilePreview);
            }
        };
    }, [attachedFilePreview]);
    const isP1Current = chat?.participant_1_id === currentUserId;
    const otherInfo = chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { state } = useLocation();

    const readReceiptsRef = useRef(chatSettings.readReceipts);
    useEffect(() => { readReceiptsRef.current = chatSettings.readReceipts; }, [chatSettings.readReceipts]);

    const isRealChatIdResolved = useRef(false);

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
                
                if (!currentChat && state?.chatInfo && !id.startsWith('11111111-')) {
                    currentChat = state.chatInfo;
                }

                if (currentChat && !id.startsWith('11111111-')) {
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
                        { id: '11111111-1a1a-0000-0000-000000000000', name: 'IAIA MarIA' },
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
                    
                    // Ensured AI persistence: Resolve real Supabase UUID (Participant type is CANONICALLY 'entity', not 'ai', to pass DB Check Constraint 23514)
                    let realConv = null;
                    if (!user?.isAnonymous) {
                        try {
                            realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
                        } catch {
                            console.warn('[ChatDetail] No s\'ha pogut establir persistència Supabase. Continuant localment...');
                        }
                    }
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
        let isActive = true;
        let currentChannel = null;
        let timeoutId;
        
        const establishSubscription = async () => {
            if (!user || !currentUserId || !realChatId) return;
            if (realChatId === id && !isRealChatIdResolved.current) return;
            
            // Cleanup explícit ABANS de crear nou canal
            if (currentChannel) {
                supabaseService.unsubscribe(currentChannel);
                currentChannel = null;
            }
            
            currentChannel = supabaseService.subscribeToMessages(realChatId, async (payload) => {
                if (!isActive) return;
                if (payload.new) {
                    setMessages(prev => {
                        // Early exit per estalviar React Renders
                        if (prev.find(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                    if (payload.new.sender_id !== currentUserId && readReceiptsRef.current) {
                        await supabaseService.markMessagesAsRead(realChatId, currentUserId);
                    }
                }
            });
        };
        
        establishSubscription();
        
        const handleVisibilityChange = () => {
            if (!isActive) return;
            if (document.visibilityState === 'visible') {
                if (currentChannel) {
                    supabaseService.unsubscribe(currentChannel);
                    currentChannel = null;
                }
                establishSubscription();
                
                // Recovery fetch
                const controller = new AbortController();
                if (timeoutId) clearTimeout(timeoutId); // Auditoria V4 (DeepSeek): Evitem acumulació
                timeoutId = setTimeout(() => controller.abort(), 5000);
                supabaseService.getConversationMessages(realChatId, controller.signal)
                    .then(msgs => {
                        clearTimeout(timeoutId);
                        if (!isActive) return;
                        if (msgs && msgs.length) {
                            setMessages(prev => {
                                const existingIds = new Set(prev.map(m => m.id));
                                const newMsgs = msgs.filter(m => !existingIds.has(m.id));
                                return newMsgs.length ? [...prev, ...newMsgs] : prev;
                            });
                        }
                    })
                    .catch(() => {}); // Silent fail contra l'usuari
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            isActive = false;
            clearTimeout(timeoutId);
            setContextMenuId(null); // Auditoria V3: Listener netejat
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (currentChannel) {
                supabaseService.unsubscribe(currentChannel);
                currentChannel = null;
            }
        };
    }, [realChatId, currentUserId, user?.id, id]);

    const handleNotReady = () => {
        alert("Una alquímia del Mestre Javi està forjant aquesta funcionalitat. Prompte bategarà.");
        setIsAttachmentMenuOpen(false);
    };

    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
        if (user?.isAnonymous && !isIAIA) {
            setIsGuestInteractionModalOpen(true);
            return;
        }

        if (isSendingRef.current || isSending || (!newMessage.trim() && !attachedFile)) return;
        
        const text = newMessage.trim();
        
        // 2. UI Optimista: Neteja IMMEDIATA i bloqueig per a alliberar l'usuari
        isSendingRef.current = true;
        setNewMessage('');
        setIsSending(true);
        setIsAttachmentMenuOpen(false);
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'; // Reset text area height
        }
        
        // --- MASTER COMMAND INTERCEPT: AI-to-AI Debate ---
        if (text === '/solatge interact') {
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
            setIsSending(false);
            isSendingRef.current = false;
            return;
        }

        let timerId;
        try {
            // Si hi ha arxiu adjunt (Drag&Drop/Paste), primer el pugem
            let fileUrl = null;
            if (attachedFile) {
                const extension = attachedFile.name.split('.').pop() || 'unknown';
                const fileName = `attach-${Date.now()}-${humanId}.${extension}`;
                
                // Determine bucket based on file type
                const bucketName = attachedFile.type.startsWith('image/') ? 'images' : 'documents';
                
                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(fileName, attachedFile, { contentType: attachedFile.type });
                    
                if (uploadError) throw uploadError;
                
                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(fileName);
                    
                fileUrl = urlData.publicUrl;
            }

            // Auditoria P0 (Antigravity Tribunal): Destrucció de Zombis amb AbortController
            const controller = new AbortController();
            timerId = setTimeout(() => controller.abort('NETWORK_TIMEOUT'), 12000);
            const result = await supabaseService.sendSecureMessage({
                conversationId: realChatId,
                senderId: humanId,
                senderEntityId: activeEntityId,
                content: text,
                isGuest: user?.isAnonymous,
                attachmentUrl: fileUrl,
                attachmentType: attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null,
                attachment_name: attachedFile ? attachedFile.name : null
            }, controller.signal);
            
            if (timerId) clearTimeout(timerId);
            
            if (!result?.id) throw new Error('Invalid server response');

            setAttachedFile(null);
            setAttachedFilePreview(null);

            setMessages(prev => {
                if (prev.find(m => m.id === result.id)) return prev;
                return [...prev, result];
            });

            if (isIAIA) {
                // Afegit per l'Auditoria: Vinculem multimèdia al cervell
                const textFinal = text || (attachedFile ? '[L\'usuari t\' acaba d\'enviar un document o fotografia]' : '');
                
                iaiaService.generateAIAResponse(realChatId, textFinal, otherInfo?.id || id, {
                    attachmentUrl: fileUrl,
                    attachmentType: attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null
                }).then(filler => {
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
            if (timerId) clearTimeout(timerId);
            logger.error('Error sending message:', err); 
            setNewMessage(text); // 3. Rollback: Recupera el text només si la xarxa falla
            // Es manté l'attachedFile si falla l'enviament
        } finally {
            setIsSending(false); // 4. Desactiva l'escut
            isSendingRef.current = false; // Allibera el cadenat per a nous missatges
        }
    };

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => !searchQuery || msg.content?.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [messages, searchQuery]);

    const renderedMessages = useMemo(() => {
        return filteredMessages.map((msg, index) => {
            const isMe = msg.sender_id === humanId;
            const nextMsg = filteredMessages[index + 1];
            const isSameSenderAsNext = nextMsg && nextMsg.sender_id === msg.sender_id;
            const marginClass = isSameSenderAsNext ? 'mb-[3px]' : 'mb-2';
            
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${marginClass} animate-in fade-in slide-in-from-bottom-2 duration-300 ${contextMenuId === msg.id ? 'z-[60] relative' : ''}`}>
                    <div className={`group max-w-[85%] md:max-w-[65%] !rounded-[8px] px-2.5 pt-1.5 pb-[3px] md:px-3 md:pt-2 md:pb-1 relative shadow-sm
                        ${isMe ? 'bg-[#d9fdd3] text-[#000] dark:bg-[#005c4b] dark:text-[#e9edef] !rounded-tr-[2px]' : 'bg-theme-panel text-theme-text !rounded-tl-[2px] border border-[var(--border-master)]'}`}>

                        
                        {/* Autor Name (Apareix dalt de l'espai i espenta contingut) */}
                        {(!isMe && (msg.author_name || otherInfo?.name)) && (
                            <div className={`text-[11px] font-bold tracking-wide mb-0.5 text-[var(--theme-accent-primary)] truncate pr-6`}>
                                {msg.author_name || otherInfo?.name}
                            </div>
                        )}

                        <div className="text-[16px] leading-[1.3] break-words font-medium">
                            {msg.attachment_type === 'voice' ? (
                                <div className="flex items-center gap-3 py-1 min-w-[200px]">
                                    <button
                                        onClick={() => {
                                            const audio = new Audio(msg.attachment_url);
                                            audio.play().catch(err => logger.error('[Voice] Play error:', err));
                                        }}
                                        className="w-10 h-10 rounded-[28px] bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0 hover:bg-black/20 dark:hover:bg-white/20 transition-colors active:scale-95 cursor-pointer"
                                        aria-label="Reproduir missatge de veu"
                                    >
                                        <Mic size={20} className="text-current opacity-80" />
                                    </button>
                                    <div className="flex-1 space-y-1 pr-6">
                                        <div className="h-1 bg-black/20 dark:bg-white/20 rounded-full w-full overflow-hidden">
                                            <div className="h-full bg-current opacity-50 w-1/3 rounded-[28px]" />
                                        </div>
                                        <div className="text-[10px] opacity-70 flex justify-between">
                                            <span>{msg.voice_meta?.duration ? `${msg.voice_meta.duration}s` : '—'}</span>
                                            <span className="uppercase tracking-tighter">Bategat</span>
                                        </div>
                                    </div>
                                </div>
                            ) : msg.attachment_url ? (
                                <div className={`flex flex-col ${msg.content ? 'pb-1' : ''}`}>
                                    {msg.attachment_type === 'image' ? (
                                        <img 
                                            src={msg.attachment_url} 
                                            alt={msg.attachment_name} 
                                            className={`max-h-[280px] w-auto object-cover -mx-2.5 md:-mx-3 relative z-0
                                                ${(!isMe && (msg.author_name || otherInfo?.name)) ? 'mt-1 !rounded-[6px]' : '-mt-1.5 md:-mt-2'}
                                                ${msg.content ? 'mb-1 !rounded-t-[8px]' : '-mb-[3px] md:-mb-1 ' + ((!isMe && (msg.author_name || otherInfo?.name)) ? '!rounded-b-[8px]' : '!rounded-[8px]')}
                                                ${!(!isMe && (msg.author_name || otherInfo?.name)) && isMe ? '!rounded-tr-[2px]' : ''}
                                                ${!(!isMe && (msg.author_name || otherInfo?.name)) && !isMe ? '!rounded-tl-[2px]' : ''}
                                            `} 
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-master)] mt-1 mb-1">
                                            <Paperclip size={16} />
                                            <span className="text-xs truncate max-w-[150px]">{msg.attachment_name || 'Arxiu'}</span>
                                        </div>
                                    )}
                                    {msg.content && <span className="whitespace-pre-wrap mt-1 block">{msg.content}</span>}
                                </div>
                            ) : (
                                <span className="whitespace-pre-wrap">{msg.content}</span>
                            )}
                            
                            {/* WhatsApp Magic Spacer for floating absolute timestamp without overlapping */}
                            <span className="inline-block w-[95px] h-[1em]" />
                        </div>

                            {/* WhatsApp Floating Timestamp */}
                        <div 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (contextMenuId === msg.id) {
                                    setContextMenuId(null);
                                } else {
                                    const yPosition = e.clientY;
                                    const windowHeight = window.innerHeight;
                                    setContextMenuPosition(yPosition < windowHeight / 2 ? 'down' : 'up');
                                    setContextMenuId(msg.id);
                                }
                            }}
                            className="absolute right-2 bottom-[3px] flex items-center justify-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group/meta"
                            aria-label="Opcions del missatge"
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-medium text-current opacity-75 pt-[1px] relative top-[1px]">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}
                                </span>
                                <span className="text-[10px] font-medium text-current opacity-90 pt-[1px] relative top-[1px] leading-none">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ara'}
                                </span>
                            </div>
                                {isMe && (
                                    <div className="flex items-center -ml-[2px]">
                                        {msg.read_at ? (
                                            <CheckCheck size={14} className="text-[#53bdeb] animate-in zoom-in duration-300" title="Llegit" />
                                        ) : msg.status === 'delivered' ? (
                                            <CheckCheck size={14} className="text-current opacity-60" title="Entregat" />
                                        ) : (
                                            <Check size={14} className="text-current opacity-60" title="Enviat" />
                                        )}
                                    </div>
                                )}
                            </div>

                        {/* Top-Right Absolute Settings Gear */}
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (contextMenuId === msg.id) {
                                    setContextMenuId(null);
                                } else {
                                    const yPosition = e.clientY;
                                    const windowHeight = window.innerHeight;
                                    setContextMenuPosition(yPosition < windowHeight / 2 ? 'down' : 'up');
                                    setContextMenuId(msg.id);
                                }
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md opacity-30 hover:opacity-100 group-hover:opacity-100 transition-all duration-300 shadow-sm z-20 hover:rotate-90"
                            aria-label="Menú del missatge"
                        >
                            <Settings size={14} className="text-current dark:text-gray-300" />
                        </button>

                        {/* WhatsApp Context Menu Dropdown */}
                        {contextMenuId === msg.id && (
                            <div className={`absolute right-2 w-64 bg-white dark:bg-[#233138] border border-gray-200 dark:border-[#111b21]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] rounded-lg py-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150 text-gray-800 dark:text-[#d1d7db]
                                ${contextMenuPosition === 'up' ? 'bottom-6 origin-bottom-right' : 'top-full -mt-2 origin-top-right'}
                            `}>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>Responder <Reply size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>Reaccionar <Smile size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>Destacar <Star size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>Fijar <Pin size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>Reenviar <Forward size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => { if(msg.content) navigator.clipboard.writeText(msg.content); setContextMenuId(null); }}>Copiar <Copy size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors border-b border-gray-100 dark:border-[#304049]" onClick={() => setContextMenuId(null)}>Info. <Info size={16} className="opacity-70" /></button>
                                
                                {msg.attachment_url && (
                                    <>
                                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors mt-1" onClick={() => setContextMenuId(null)}>Ver <Eye size={16} className="opacity-70" /></button>
                                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>Guardar en Descargas <Download size={16} className="opacity-70" /></button>
                                        <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors border-b border-gray-100 dark:border-[#304049]" onClick={() => setContextMenuId(null)}>Guardar como... <DownloadCloud size={16} className="opacity-70" /></button>
                                    </>
                                )}
                                
                                <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors border-b border-gray-100 dark:border-[#304049] mt-1 text-red-500" onClick={() => setContextMenuId(null)}>Eliminar <Trash2 size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors mt-1" onClick={() => setContextMenuId(null)}>Seleccionar mensajes <CheckCircle2 size={16} className="opacity-70" /></button>
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    }, [filteredMessages, humanId, otherInfo?.name, contextMenuId, contextMenuPosition]);

    if (loading) return <div className="flex-1 bg-theme-base flex items-center justify-center"><Loader2 className="animate-spin text-[var(--theme-accent-primary)]" size={40} /></div>;

    return (
        <div className="chat-detail-container flex-1 flex flex-col min-h-0 relative" onClick={() => setContextMenuId(null)}>
            {/* SCANLINES RETRO-FUTURISTES */}
            <div className="chat-list-scanlines" />
            
            {/* HEADER DEL XAT - CABECERA COMPACTA RESPONSIVE ESTIL WHATSAPP */}
            <header className={`h-[56px] min-h-[56px] md:h-16 md:min-h-[64px] px-2 md:px-6 flex items-center justify-between border-b border-[var(--border-master)] flex-shrink-0 z-30 transition-colors ${otherInfo?.id?.startsWith('11111111-') ? 'bg-[var(--theme-accent-primary)] text-white' : 'bg-theme-header text-white'}`}>
                {/* ZONA CLICABLE GLOBAL: Tot el costat esquerre porta al perfil */}
                <div 
                    className="flex items-center gap-2 md:gap-3 flex-1 cursor-pointer group transition-all"
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
                            <div className={otherInfo?.id?.startsWith('11111111-') ? 'bg-white rounded-full p-[1px] md:p-0.5 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : ''}>
                                <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={36} />
                            </div>
                            
                            <div className="flex flex-col min-w-0 pr-1 md:pr-2 flex-1">
                                <h2 className={`text-base md:text-lg font-bold truncate leading-none transition-colors ${otherInfo?.id?.startsWith('11111111-') ? 'text-white' : 'text-white group-hover:text-[var(--theme-accent-primary)]'}`}>
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

                <div className="flex items-center ml-auto z-10">
                    <button 
                        onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                        className={`hidden md:block transition-all hover:bg-white/10 rounded-full p-2 md:mr-2 filter drop-shadow-md ${otherInfo?.id?.startsWith('11111111-') ? 'text-white' : 'text-gray-300 hover:text-white'} ${isHeaderSearchOpen ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-80'}`}
                        title="Cercar en la conversa"
                    >
                        <Search size={22} strokeWidth={2.5} />
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                            className={`transition-all hover:bg-white/10 rounded-full p-1.5 md:p-2 filter drop-shadow-md ${otherInfo?.id?.startsWith('11111111-') ? 'text-white' : 'text-gray-300 hover:text-white'} ${isSettingsMenuOpen ? 'opacity-100 bg-white/10' : 'opacity-80'}`}
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
                <div className="chat-messages-panel flex-1 flex flex-col min-h-0 bg-theme-base relative">
                    
                    {/* [BÀNNER FORASTER EPÍMER] */}
                    {isGuest && otherInfo?.id?.startsWith('11111111-') && (
                        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-[13px] px-4 py-2 border-b border-orange-200 dark:border-orange-800/50 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 justify-center text-center shadow-sm z-10 shrink-0 animate-in slide-in-from-top-2 duration-300">
                            <span><span className="font-bold">Avís:</span> Estàs parlant com a Foraster i aquest xat temporal s'esborrarà prompte.</span>
                            <a href="/registre" className="font-bold underline cursor-pointer hover:text-orange-950 dark:hover:text-orange-100 transition-colors">Registra't per a guardar les converses.</a>
                        </div>
                    )}

                    <div className="messages-container custom-scrollbar chat-messages-list flex-1 overflow-y-auto min-h-0 px-4 md:px-6 py-4 pb-12">
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
                <div className={`chat-input-master-wrapper px-2 sm:px-4 md:px-6 py-[8px] md:py-[12px] bg-[var(--theme-accent-primary)] dark:bg-[var(--theme-accent-secondary)] border-t border-transparent z-[50] flex-shrink-0 relative focus-within:z-[60] transition-colors ${isKeyboardOpen ? 'pb-[8px] md:pb-[12px]' : 'pb-[calc(8px+env(safe-area-inset-bottom))] md:pb-[12px]'}`}>
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
                                                
                                                const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
                                                if (isIAIA) {
                                                    iaiaService.generateAIAResponse(realChatId, transcript || '📢 [Nota de Veu]', otherInfo?.id || id).catch(err => logger.error('[ChatDetail] Error in IAIA response:', err));
                                                }
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
                                                className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] shrink-0 flex items-center justify-center rounded-[24px] bg-white/20 dark:bg-black/20 text-white hover:bg-white/30 dark:hover:bg-black/30 transition-all active:scale-95 relative z-10"
                                            >
                                                <Paperclip className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
                                            </button>

                                            {isAttachmentMenuOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsAttachmentMenuOpen(false);}}></div>
                                                    <div className="absolute bottom-[60px] left-0 md:left-4 w-[320px] bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-[0_8px_40px_rgb(0,0,0,0.15)] p-5 z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom">
                                                        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                                                            {/* INPUTS HIDDENS MESTRES */}
                                                            <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={handleFileSelect} />
                                                            <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleFileSelect} />
                                                            <input type="file" ref={documentInputRef} hidden accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" onChange={handleFileSelect} />

                                                            {/* NORMAL ATTACHMENT GRID (8 ICONS) */}
                                                            <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
                                                                <div className="w-12 h-12 rounded-[28px] bg-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                                    <Image size={22} strokeWidth={2} />
                                                                </div>
                                                                <span className="text-[11px] text-gray-500 font-medium">Galeria</span>
                                                            </button>
                                                            <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
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
                                                            <button type="button" onClick={() => documentInputRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer group hover:opacity-90">
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
                                                className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center transition-colors shrink-0 ${isEmojiPickerOpen ? 'text-[var(--theme-accent-primary)] drop-shadow-md' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                                            >
                                                <Smile className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" strokeWidth={2.5} />
                                            </button>

                                            <textarea 
                                                ref={inputRef}
                                                rows={1}
                                                autoComplete="on"
                                                autoCorrect="on"
                                                spellCheck="true"
                                                enterKeyHint="send"
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
                                                className="flex-1 min-h-[40px] md:min-h-[48px] max-h-[120px] bg-transparent border-none py-[10px] md:py-[12px] px-1 text-black dark:text-white focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium text-[15px] md:text-[17px] align-middle box-border m-0 min-w-0 resize-none overflow-y-auto custom-scrollbar leading-snug"
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
                                                disabled={isSending || (!newMessage.trim() && !attachedFile)}
                                                onClick={handleSendMessage}
                                                onPointerDown={(e) => { 
                                                    e.preventDefault(); // Evita que es tanque el teclat a mòbils
                                                    if (!isSending && (newMessage.trim() || attachedFile)) {
                                                        handleSendMessage(e);
                                                    }
                                                }}
                                                className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] shrink-0 bg-white dark:bg-black text-[var(--theme-accent-secondary)] dark:text-[var(--theme-accent-primary)] disabled:opacity-50 rounded-full transition-all shadow-xl active:scale-95 flex items-center justify-center group z-10"
                                            >
                                                {/* Ajust òptic: el Send de Lucide té un pes visual desigual. El desplacem lleugerament -1px a l'esquerra i +1px avall */}
                                                <Send strokeWidth={2.5} className={`w-[18px] h-[18px] md:w-[20px] md:h-[20px] relative -left-[1px] top-[1px] ${(newMessage.trim() || attachedFile) ? "md:group-hover:translate-x-[1px] md:group-hover:-translate-y-[1px] transition-transform" : ""}`} />
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
