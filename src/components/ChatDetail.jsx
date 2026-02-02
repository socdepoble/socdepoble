import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, User, Building2, Paperclip, X, FileText, Image as ImageIcon, Film, Database, Info, MessageSquare, Mic, Video, StopCircle, Smile, ShieldCheck } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessage from './VoiceMessage';
import UniversalCitation from './UniversalCitation';
import { syncService } from '../services/syncService';
import './ChatDetail.css';
import './Comments.css';


const ChatDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { user, profile, impersonatedProfile, activeEntityId, isSuperAdmin } = useAuth();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherPresence, setOtherPresence] = useState(null);
    const [storageStats, setStorageStats] = useState(null);
    const [showStorageModal, setShowStorageModal] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [otherPrivacy, setOtherPrivacy] = useState({ show_read_receipts: true });
    const fileInputRef = useRef(null);
    const presenceChannelRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isMounted = useRef(true);
    const commentingOn = location.state?.commentingOn || null;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const [thinkingTime, setThinkingTime] = useState(30);

    // Media Recording States
    const [isRecording, setIsRecording] = useState(false); // Kept for Video if needed
    const [recordingType, setRecordingType] = useState(null); // 'audio' | 'video'
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaStream, setMediaStream] = useState(null);
    const mediaRecorderRef = useRef(null);
    const videoPreviewRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = activeEntityId || humanId;

    // Harmonized IAIA Detection Logic at component level
    const isP1Current = chat?.participant_1_id === currentUserId;
    const isIAIAConv = chat?.is_iaia ||
        String(id || '').startsWith('new-iaia-') ||
        String(id || '').startsWith('iaia-') ||
        id === 'iaia' ||
        (isP1Current ? chat?.p2_is_ai : chat?.p1_is_ai) ||
        (isP1Current ? chat?.p2_role : chat?.p1_role) === 'ambassador' ||
        String(isP1Current ? chat?.participant_2_id : chat?.participant_1_id).startsWith('11111111-1111-4111-a111-');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user || !currentUserId) return;

        const isVirtual = String(id || '').startsWith('new-iaia-') ||
            String(id || '').startsWith('mock-') ||
            String(id || '').startsWith('iaia-') ||
            id === 'iaia' || id === 'rentonar' ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isVirtual) {
            const personaId = id === 'iaia' ? '11111111-1a1a-0000-0000-000000000000' : id.replace('new-iaia-', '').replace('mock-', '').replace('iaia-post-', '');
            const fetchVirtualData = async () => {
                try {
                    const chats = await supabaseService.getConversations(currentUserId);

                    // 1. Check if there's already a real conversation with this persona
                    const realChat = chats.find(c =>
                        (c.participant_1_id === personaId || c.participant_2_id === personaId) &&
                        !String(c.id || '').startsWith('mock-')
                    );

                    if (realChat) {
                        setChat(realChat);
                        const msgs = await supabaseService.getConversationMessages(realChat.id);
                        setMessages(msgs);
                        await supabaseService.markMessagesAsRead(realChat.id, currentUserId);
                        return;
                    }

                    // 2. Check if there's a mock conversation
                    const existingMock = chats.find(c => c.id === id);
                    if (existingMock) {
                        setChat(existingMock);
                        const msgs = await supabaseService.getConversationMessages(id);
                        setMessages(msgs);
                        await supabaseService.markMessagesAsRead(id, currentUserId);
                        return;
                    }

                    // 3. Fallback for new personas
                    const persona = await supabaseService.getPublicProfile(personaId);
                    setChat({
                        id,
                        participant_1_id: currentUserId,
                        participant_2_id: personaId,
                        p1_info: { id: currentUserId, name: user?.full_name || 'Jo' },
                        p2_info: { id: personaId, name: persona.full_name, avatar_url: persona.avatar_url },
                        p2_role: persona.role,
                        p2_is_ai: persona.is_ai || persona.role === 'ambassador',
                        is_iaia: true
                    });
                    setMessages([]);
                } catch (error) {
                    logger.error('Error fetching virtual persona:', error);
                    // Use mock data if available
                    const chats = await supabaseService.getConversations(currentUserId);
                    const mock = chats.find(c => c.id === id);
                    if (mock) {
                        setChat(mock);
                        const msgs = await supabaseService.getConversationMessages(id);
                        setMessages(msgs);
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchVirtualData();
            return;
        }

        const fetchChatData = async () => {
            // [PILAR 3: INSTANT LOAD CHAT]
            const cachedMsgs = localStorage.getItem(`chat_cache_${id}`);
            if (cachedMsgs) {
                try {
                    const parsed = JSON.parse(cachedMsgs);
                    setMessages(parsed);
                    setLoading(false);
                } catch (e) {
                    logger.warn('[Chat] Error reading cache:', e);
                }
            }

            try {
                const chats = await supabaseService.getConversations(currentUserId);
                const currentChat = chats.find(c => c.id === id);
                setChat(currentChat);
                const msgs = await supabaseService.getConversationMessages(id);
                setMessages(msgs);
                // Save for next time
                localStorage.setItem(`chat_cache_${id}`, JSON.stringify(msgs.slice(-50)));
                await supabaseService.markMessagesAsRead(id, currentUserId);
            } catch (error) {
                logger.error('Error fetching chat data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();

        const subscription = supabaseService.subscribeToConversation(id, {
            onNewMessage: (newMsg) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
                if (newMsg.sender_id !== currentUserId) {
                    supabaseService.markMessagesAsRead(id, currentUserId);
                }
            },
            onMessageUpdate: (updatedMsg) => {
                setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
            }
        });

        presenceChannelRef.current = supabaseService.subscribeToPresence(id, currentUserId, (state) => {
            const otherId = Object.keys(state).find(key => key !== currentUserId);
            if (otherId) {
                setOtherPresence(state[otherId][0]);
            } else {
                setOtherPresence(null);
            }
        });

        return () => {
            if (subscription) subscription.unsubscribe();
            if (presenceChannelRef.current) presenceChannelRef.current.unsubscribe();
        };
    }, [id, currentUserId]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length]);


    useEffect(() => {
        fetchStorageStats();
        // [NEW] Recovery of backup content
        const backups = JSON.parse(localStorage.getItem('sp_chat_backups') || '{}');
        if (backups[id]) {
            setNewMessage(backups[id].text);
            logger.log(`[Sync] S'ha recuperat un borrador per a la conv: ${id}`);
        }
    }, [id]);

    // [Interactive Push] Handle injected message (from Push Notification click)
    useEffect(() => {
        if (location.state?.injectedMessage && chat) {
            const contextMsg = location.state.injectedMessage;

            // Avoid duplicates
            if (messages.some(m => m.content === contextMsg)) return;

            logger.log('[ChatDetail] Injecting context message:', contextMsg);

            const injectedMsg = {
                id: `injected-${Date.now()}`,
                conversation_id: id,
                sender_id: chat.participant_2_id, // The IAIA/Partner
                content: contextMsg,
                created_at: new Date().toISOString(),
                is_ai: true,
                read_at: null
            };

            setMessages(prev => [...prev, injectedMsg]);

            // Clear state to prevent re-injection on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, chat, messages, navigate, location.pathname]);

    // NEW: Fetch other user's privacy settings
    useEffect(() => {
        if (!user) return;

        // Request Notification Permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const fetchPrivacy = async () => {
            if (!chat) return; // Moved this check inside loadMessages

            const isP1Current = chat.participant_1_id === currentUserId;
            const otherId = isP1Current ? chat.participant_2_id : chat.participant_1_id;
            const otherType = isP1Current ? chat.participant_2_type : chat.participant_1_type;

            if (otherType === 'user') {
                try {
                    const profile = await supabaseService.getPublicProfile(otherId);
                    // Default to true if not set
                    const settings = profile?.privacy_settings || { show_read_receipts: true };
                    setOtherPrivacy(settings);
                } catch (err) {
                    logger.error('Error fetching privacy:', err);
                    setOtherPrivacy({ show_read_receipts: true });
                }
            } else {
                // Entities always show read receipts
                setOtherPrivacy({ show_read_receipts: true });
            }
        };

        fetchPrivacy();
    }, [chat, currentUserId]);

    const fetchStorageStats = async () => {
        try {
            const stats = await supabaseService.getStorageStats();
            setStorageStats(stats);
        } catch (err) {
            logger.error('Error fetching storage stats:', err);
        }
    };

    const handleTyping = (e) => {
        const val = e.target.value;
        setNewMessage(val);

        // [NEW] Backup the input
        syncService.backupChatInput(id, val);

        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, true);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user) return;

        const filesToProcess = [...selectedFiles];
        const textToSend = newMessage.trim();

        if (textToSend.length === 0 && filesToProcess.length === 0) return;

        setUploading(filesToProcess.length > 0);

        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, false);
        }

        try {
            let activeId = id;
            if (String(id || '').startsWith('new-iaia-')) {
                const otherParticipantId = chat.participant_2_id;
                const newConv = await supabaseService.getOrCreateConversation(
                    currentUserId, 'user', otherParticipantId, 'user'
                );
                activeId = newConv.id;
                navigate(`/chats/${activeId}`, { replace: true });
            }

            // [PILAR 1: OPTIMISTIC UI] - Bategat immediat a la pantalla
            if (textToSend && filesToProcess.length === 0) {
                const tempId = `temp-${Date.now()}`;
                const optimisticMsg = {
                    id: tempId,
                    conversation_id: activeId,
                    sender_id: humanId,
                    sender_entity_id: activeEntityId,
                    content: textToSend,
                    created_at: new Date().toISOString(),
                    status: 'sending'
                };
                setMessages(prev => [...prev, optimisticMsg]);

                const result = await supabaseService.sendSecureMessage({
                    conversationId: activeId,
                    senderId: humanId,
                    senderEntityId: activeEntityId,
                    content: textToSend,
                });

                // Update temporary message with real one
                setMessages(prev => prev.map(m => m.id === tempId ? { ...result, status: 'sent' } : m));
            }

            // Process each file as a separate message (matches current system architecture best)
            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                const isFirstFile = i === 0;

                const attachmentType = file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : 'document';

                const attachmentUrl = await supabaseService.uploadChatAttachment(file, activeId, humanId);

                // Send message with first file and text, or just file for subsequent ones
                const result = await supabaseService.sendSecureMessage({
                    conversationId: activeId,
                    senderId: humanId,
                    senderEntityId: activeEntityId,
                    content: isFirstFile && textToSend ? textToSend : null,
                    attachmentUrl,
                    attachmentType,
                    attachmentName: file.name,
                });

                // [Optimistic Update] If it's a new conversation, add to local list as sub won't catch it yet
                if (String(id || '').startsWith('new-iaia-')) {
                    setMessages(prev => [...prev, result]);
                }

                // NotebookLM ingestion
                if (isIAIAConv) {
                    try {
                        const { notebookService } = await import('../services/notebookService');
                        await notebookService.ingestSource(
                            attachmentType,
                            `Font: ${file.name}. URL: ${attachmentUrl}`,
                            { title: file.name, url: attachmentUrl, sender_id: humanId }
                        );
                    } catch (nbErr) {
                        logger.error('[Notebook] Error ingesting:', nbErr);
                    }
                }
            }

            setNewMessage('');
            setSelectedFiles([]);
            syncService.clearDraft(`chat_input_${id}`); // Clear specific draft if used
            localStorage.removeItem('sp_chat_backups'); // Clear general backup
            fetchStorageStats();
        } catch (error) {
            logger.error('Error sending message(s):', error);
            alert('Error al enviar. Revisa la consola.');
        } finally {
            setUploading(false);
            if (isIAIAConv) {
                setIsThinking(true);
                setThinkingTime(30);

                // Interval to update thinking time
                const thinkingInterval = setInterval(() => {
                    setThinkingTime(prev => (prev > 1 ? prev - 1 : 1));
                }, 1000);

                // Trigger actual AI response after a more natural delay
                setTimeout(async () => {
                    try {
                        const { iaiaService } = await import('../services/iaiaService');
                        await iaiaService.generateAIAResponse(activeId, textToSend);

                        // Push Notification Logic (Simulated for Demo if backgrounded)
                        if (document.visibilityState === 'hidden') {
                            if ('Notification' in window && Notification.permission === 'granted') {
                                new Notification("MArIA (Sóc de Poble)", {
                                    body: "Tinc una resposta per a les teues idees sobre l'Anna Climent.",
                                    icon: '/assets/avatars/iaia_official.png'
                                });
                            }
                        }
                    } catch (err) {
                        logger.error('Error triggering MArIA response:', err);
                    } finally {
                        clearInterval(thinkingInterval);
                        if (isMounted.current) setIsThinking(false);
                    }
                }, 8000); // 8 seconds of "thinking" for dramatic/analytical effect
            }
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newFiles = [];
            const { audioConverter } = await import('../utils/audioConverter');

            for (let file of files) {
                if (file.size > 10 * 1024 * 1024) {
                    alert(`${file.name}: ${t('chats.storage_limit_warning')}`);
                    continue;
                }

                // Support for WhatsApp .opus
                if (audioConverter.isWhatsAppAudio(file)) {
                    file = await audioConverter.prepareForUpload(file);
                }
                newFiles.push(file);
            }

            setSelectedFiles(prev => [...prev, ...newFiles]);
            fetchStorageStats();
        }
    };

    const handleEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, true);
        }
        // No auto-close for better UX (adding multiple emojis)
    };

    // Media Recording Logic
    const startRecording = async (type) => {
        try {
            const constraints = type === 'video'
                ? { video: { facingMode: "user", width: 320 }, audio: true }
                : { audio: true };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setMediaStream(stream);

            if (type === 'video' && videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
            }

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
                const fileName = `rec_${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`; // WebM container
                const file = new File([blob], fileName, { type: type === 'video' ? 'video/webm' : 'audio/webm' });

                setSelectedFile(file);

                // Stop tracks
                stream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
                setRecordingType(null);
                setIsRecording(false);
                setRecordingTime(0);
                if (timerRef.current) clearInterval(timerRef.current);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingType(type);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 60) { // Max 60s
                        stopRecording();
                        return 60;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            logger.error('Error starting recording:', err);
            alert('No hem pogut accedir al micròfon o càmera.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            // Clear data afterwards logic handled by check
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        setMediaStream(null);
        setRecordingType(null);
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        chunksRef.current = [];
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVoiceSend = async (audioBlob, duration, transcript) => {
        if (!user) return;

        try {
            setUploading(true);

            // Optimistic Update
            const tempId = `temp-voice-${Date.now()}`;
            const optimisticMsg = {
                id: tempId,
                conversation_id: id,
                sender_id: humanId,
                content: '🎵 Missatge de veu',
                attachment_type: 'voice',
                attachment_url: URL.createObjectURL(audioBlob),
                created_at: new Date().toISOString(),
                voice_meta: { duration, waveform: Array(30).fill(0.5) }
            };
            setMessages(prev => [...prev, optimisticMsg]);

            // Simple Waveform Simulation (Real one should come from AudioContext in Recorder)
            const waveform = Array(30).fill(0).map(() => Math.random());

            const result = await supabaseService.sendVoiceMessage(
                id,
                humanId,
                audioBlob,
                duration,
                waveform
            );

            setMessages(prev => prev.map(m => m.id === tempId ? { ...result, status: 'sent' } : m));
            setShowVoiceRecorder(false);

            // Projecte JARVIS: Si és la IAIA i hi ha transcripció, analitzem ordres
            if (isIAIAConv && transcript) {
                const { commandProtocol } = await import('../services/commandProtocol');
                // Passem l'idioma actiu de l'app (i18n.language)
                const analysis = commandProtocol.analyze(transcript, i18n.language || 'va');

                if (analysis && analysis.type !== 'neutral') {
                    setIsThinking(true);
                    setTimeout(() => {
                        setIsThinking(false);
                        const jarvisResponse = {
                            id: `jarvis-${Date.now()}`,
                            conversation_id: id,
                            sender_id: chat.participant_2_id,
                            content: analysis.message,
                            created_at: new Date().toISOString(),
                            is_ai: true,
                            status: 'sent'
                        };
                        setMessages(prev => [...prev, jarvisResponse]);
                        logger.log('[ProjectJARVIS] Ordre executada:', analysis.intent);
                    }, 1500);
                }
            }

        } catch (error) {
            logger.error('Error sending voice:', error);
            alert('Error enviant nota de veu');
        } finally {
            setUploading(false);
        }
    };

    const renderMessageContent = (content) => {
        if (!content) return null;

        // Regex para capturar etiquetas <cite data-did="..." data-anchor="...">[Label]</cite>
        const citeRegex = /<cite data-did="([^"]+)" data-anchor="([^"]+)">([^<]+)<\/cite>/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = citeRegex.exec(content)) !== null) {
            // Texto antes de la cita
            if (match.index > lastIndex) {
                parts.push(content.substring(lastIndex, match.index));
            }

            const [fullMatch, did, anchor, label] = match;
            parts.push(
                <UniversalCitation
                    key={`cite-${match.index}`}
                    did={did}
                    anchor={anchor}
                    label={label}
                />
            );

            lastIndex = match.index + fullMatch.length;
        }

        // Texto restante
        if (lastIndex < content.length) {
            parts.push(content.substring(lastIndex));
        }

        return parts.length > 0 ? parts : content;
    };

    if (error) {
        return (
            <div className="chat-detail-container">
                <StatusLoader type="error" message={error} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="chat-detail-container">
                <StatusLoader type="loading" message={t('common.loading')} />
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="chat-detail-container">
                <StatusLoader type="empty" message={t('chats.empty')} />
            </div>
        );
    }

    const isOtherOnline = !!otherPresence;
    const isOtherTyping = otherPresence?.is_typing;
    const otherInfo = isP1Current ? chat.p2_info : chat.p1_info;
    const otherType = isP1Current ? chat.participant_2_type : chat.participant_1_type;

    return (
        <div className="chat-detail-container">
            <div className="chat-nav-bar">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <div
                    className="chat-header-main clickable"
                    onClick={() => {
                        if (otherType === 'entity') navigate(`/entitat/${otherInfo?.id || otherInfo?.entity_id}`);
                        else navigate(`/perfil/${otherInfo?.id || otherInfo?.user_id}`);
                    }}
                >
                    <Avatar
                        src={otherInfo?.avatar_url}
                        role={otherType === 'entity' ? 'oficial' : (chat.p2_role || 'user')}
                        name={otherInfo?.name}
                        size={44}
                    />
                    <div className="chat-info">
                        <div className="chat-name-row">
                            <h2>{otherInfo?.name || t('common.unknown')}</h2>
                            {chat.verified && (
                                <span className="verified-badge-icon" title={`Entitat Verificada - CIF: ${chat.cif}`}>
                                    <ShieldCheck size={14} fill="#3b82f6" color="white" />
                                </span>
                            )}
                            {isIAIAConv && (
                                <span className="identity-badge ai" title="Memòria Viva d'Acompanyament">MarIA</span>
                            )}
                        </div>

                        {/* Status / Role Line */}
                        <div className="status-line">
                            {chat.user_role ? (
                                <span className="user-role-badge">
                                    {chat.user_role}
                                </span>
                            ) : (
                                <span className={`status ${isOtherOnline ? 'online' : ''}`}>
                                    {isOtherTyping ? t('common.typing') : (isOtherOnline ? t('common.online') : t('common.offline'))}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* IAIA Notice - Transparencia (Visible in Prod and Sandbox) */}
            {isIAIAConv && (
                <div className="iaia-transparency-notice" onClick={() => navigate('/iaia')}>
                    <div className="banner-content">
                        <div className="iaia-icon">👵✨</div>
                        <div className="banner-text-stack">
                            <span className="banner-label">
                                {t('chats.iaia_notice_title')} • {t('chats.iaia_notice_subtitle')}
                            </span>
                            <span className="banner-persona-name">
                                {t('chats.iaia_notice_text')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Commenting Context Banner */}
            {commentingOn && (
                <div className="commenting-context-banner">
                    <div className="context-icon">
                        <MessageSquare size={18} />
                    </div>
                    <div className="context-info">
                        <span className="context-label">Escribint comentari per a la publicació:</span>
                        <span className="context-preview">"{commentingOn.content?.substring(0, 50)}..."</span>
                    </div>
                    <button className="context-close" onClick={() => navigate(location.pathname, { replace: true, state: {} })}>
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="messages-list">
                {messages.length === 0 ? (
                    <p className="empty-chat-message">{t('common.write_message')}</p>
                ) : (
                    messages.map(msg => {
                        const isMe = msg.sender_id === humanId &&
                            ((!msg.sender_entity_id && !activeEntityId) || msg.sender_entity_id === activeEntityId);

                        // Determinar l'avatar del remitent
                        const senderAvatar = isMe
                            ? (isSuperAdmin && impersonatedProfile ? impersonatedProfile.avatar_url : profile?.avatar_url)
                            : otherInfo?.avatar_url;
                        const senderType = isMe ? (activeEntityId ? 'entity' : 'user') : otherType;

                        return (
                            <div key={msg.id} className={`message-row ${isMe ? 'me' : 'other'}`}>
                                {!isMe && (
                                    <div className="message-avatar-container">
                                        <Avatar
                                            src={senderAvatar}
                                            role={senderType === 'entity' ? 'oficial' : 'user'}
                                            name={otherInfo?.name}
                                            size={32}
                                        />
                                    </div>
                                )}
                                <div className={`message-bubble ${isMe ? 'me' : 'other'} ${msg.is_ai ? 'ai-bubble' : ''}`}>
                                    <div className="bubble-content-row">
                                        <div className="message-content-wrapper">
                                            {msg.attachment_url && (
                                                <div className="message-attachment">
                                                    {msg.attachment_type === 'image' ? (
                                                        <img src={msg.attachment_url} alt={msg.attachment_name} className="chat-image" onClick={() => window.open(msg.attachment_url, '_blank')} />
                                                    ) : msg.attachment_type === 'video' ? (
                                                        <video src={msg.attachment_url} controls className="chat-video" />
                                                    ) : (
                                                        <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                                            <FileText size={20} />
                                                            <span>{msg.attachment_name || 'Document'}</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            {msg.attachment_type === 'voice' ? (
                                                <div className="voice-message-container">
                                                    <VoiceMessage
                                                        url={msg.attachment_url}
                                                        duration={msg.voice_meta?.duration || parseInt(msg.attachment_name) || 0}
                                                        waveform={msg.voice_meta?.waveform}
                                                        isOwnMessage={isMe}
                                                    />
                                                </div>
                                            ) : (
                                                msg.content && <div className="message-text">{renderMessageContent(msg.content)}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="message-meta">
                                        {msg.is_ai && (
                                            <span className="bubble-tag ai">MArIA</span>
                                        )}
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            <span className={`message-status ${msg.read_at && otherPrivacy?.show_read_receipts !== false ? 'read' : ''}`}>
                                                {msg.read_at && otherPrivacy?.show_read_receipts !== false ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isMe && (
                                    <div className="message-avatar-container">
                                        <Avatar
                                            src={senderAvatar}
                                            role={senderType === 'entity' ? 'oficial' : 'user'}
                                            name={profile?.full_name}
                                            size={32}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                {isThinking && (
                    <div className="message-row other thinking">
                        <div className="message-avatar-container">
                            <Avatar
                                src={otherInfo?.avatar_url}
                                role="ambassador"
                                name="MArIA"
                                size={32}
                            />
                        </div>
                        <div className="message-bubble other thinking-bubble">
                            <div className="thinking-content">
                                <div className="thinking-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span className="thinking-timer">MArIA està pensant... (aprox {thinkingTime}s)</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="chat-input-area-new">
                {/* Storage Info Bar (Minimalist) */}
                {storageStats && (
                    <div className={`storage-mini-bar ${(storageStats.usagePercentage || 0) > 90 ? 'critical' : ''}`}>
                        <div className="storage-info-mini">
                            <span className="storage-label">{t('chats.storage_banner_title')}</span>
                            <span className="storage-data">{(Number(storageStats.totalMB) || 0).toFixed(1)}MB / 1024MB</span>
                        </div>
                        <div className="storage-progress">
                            <div
                                className="storage-progress-fill"
                                style={{ width: `${Math.min(storageStats.usagePercentage || 0, 100)}%` }}
                            ></div>
                        </div>
                        <button
                            className="storage-info-trigger"
                            title={t('chats.storage_banner_text')}
                            type="button"
                            onClick={() => setShowStorageModal(true)}
                        >
                            <Info size={14} />
                        </button>
                    </div>
                )}

                {/* Storage Info Modal */}
                {showStorageModal && (
                    <div className="storage-modal-overlay" onClick={() => setShowStorageModal(false)}>
                        <div className="storage-modal-content" onClick={e => e.stopPropagation()}>
                            <div className="storage-modal-header">
                                <div className="storage-header-icon">
                                    <Database size={24} color="var(--color-primary)" />
                                </div>
                                <div className="storage-header-text">
                                    <h3>{t('chats.storage_banner_title')}</h3>
                                    <p>Sistem d'Asset Sostenible</p>
                                </div>
                                <button className="modal-close" onClick={() => setShowStorageModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="storage-modal-body">
                                <div className="storage-info-card">
                                    <Info className="info-icon" size={20} />
                                    <p>{t('chats.storage_banner_text')}</p>
                                </div>
                                <div className="storage-rules">
                                    <div className="rule-item">
                                        <strong>10 MB</strong> per fitxer (Imatges, Vídeos, Docs)
                                    </div>
                                    <div className="rule-item">
                                        <strong>1 GB</strong> de quota total compartida per poble
                                    </div>
                                    <div className="rule-item">
                                        Neteja periòdica de fitxers temporals per mantenir el sistema
                                    </div>
                                    <div className="rule-item">
                                        <strong>Privadesa:</strong> Les dades de xat estan xifrades en trànsit
                                    </div>
                                </div>
                                <div className="storage-warning-footer">
                                    <p>Recorda que al mode Playground les dades es poden esborrar i no estan protegides per la política de permanència final.</p>
                                </div>
                            </div>
                            <button className="storage-modal-confirm" onClick={() => setShowStorageModal(false)}>
                                ENTÈS
                            </button>
                        </div>
                    </div>
                )}

                <form className="chat-input-form-new" onSubmit={handleSendMessage}>
                    {showEmojiPicker && (
                        <div className="emoji-picker-wrapper">
                            <button
                                className="close-emoji-btn"
                                type="button"
                                onClick={() => setShowEmojiPicker(false)}
                            >
                                <X size={20} />
                            </button>
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                autoFocusSearch={false}
                                width="100%"
                                height="350px"
                                searchDisabled={false}
                                skinTonesDisabled={true}
                                previewConfig={{ showPreview: false }}
                                emojiStyle="native" // Use native OS emojis for performance and "official" look
                            />
                        </div>
                    )}
                    {/* Redundant triggers removed for WhatsApp-style internal triggers */}

                    <div className="input-main-area-wa">
                        {selectedFiles.length > 0 && (
                            <div className="wa-attachments-preview">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="wa-attachment-tag">
                                        <div className="wa-tag-icon">
                                            {file.type.startsWith('image/') ? <ImageIcon size={14} /> :
                                                file.type.startsWith('video/') ? <Film size={14} /> : <FileText size={14} />}
                                        </div>
                                        <span className="wa-tag-name">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                                            className="wa-tag-remove"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="wa-attachments-count">
                                    {selectedFiles.length} {selectedFiles.length === 1 ? 'arxiu llistat' : 'arxius llistats'}
                                </div>
                            </div>
                        )}

                        {showVoiceRecorder ? (
                            <VoiceRecorder
                                onSend={(blob, duration, transcript) => handleVoiceSend(blob, duration, transcript)}
                                onCancel={() => setShowVoiceRecorder(false)}
                                lang={i18n.language}
                            />
                        ) : (
                            <div className="whatsapp-input-wrapper">
                                <button
                                    type="button"
                                    className="wa-action-btn"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <Smile size={24} />
                                </button>

                                <input
                                    name="message"
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    placeholder={t('common.write_message')}
                                    disabled={uploading}
                                    autoComplete="off"
                                />

                                <label className="wa-action-btn" htmlFor="file-upload">
                                    <input
                                        id="file-upload"
                                        name="attachment"
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                        accept="image/*,video/*,.pdf,.doc,.docx,.opus,.ogg,.mp3,.wav"
                                    />
                                    <Paperclip size={22} className="wa-clip-icon" />
                                </label>
                            </div>
                        )}
                    </div>
                    {(isRecording && recordingType === 'video') ? (
                        <button
                            type="button"
                            className="stop-rec-button"
                            onClick={stopRecording}
                        >
                            <StopCircle size={24} color="red" />
                        </button>
                    ) : (
                        <>
                            {!newMessage && selectedFiles.length === 0 && !showVoiceRecorder && (
                                <div className="media-buttons-row">
                                    <button type="button" className="media-trigger-btn" onClick={() => setShowVoiceRecorder(true)}>
                                        <Mic size={20} />
                                    </button>
                                    <button type="button" className="media-trigger-btn" onClick={() => startRecording('video')}>
                                        <Video size={20} />
                                    </button>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="send-button-new"
                                disabled={(!newMessage.trim() && selectedFiles.length === 0) || uploading}
                            >
                                {uploading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChatDetail;
