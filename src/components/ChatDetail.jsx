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
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherPresence, setOtherPresence] = useState(null);
    const [storageStats, setStorageStats] = useState(null);
    const [showStorageModal, setShowStorageModal] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const fileInputRef = useRef(null);
    const presenceChannelRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isMounted = useRef(true);
    const commentingOn = location.state?.commentingOn || null;
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user || !currentUserId) return;

        if (id.startsWith('new-iaia-') || id.startsWith('mock-') || id.startsWith('iaia-') || id === 'rentonar') {
            const personaId = id.replace('new-iaia-', '').replace('mock-', '').replace('iaia-post-', '');
            const fetchVirtualData = async () => {
                try {
                    // Check if it's a mock chat first
                    const chats = await supabaseService.getConversations(currentUserId);
                    const existingMock = chats.find(c => c.id === id);

                    if (existingMock) {
                        setChat(existingMock);
                        const msgs = await supabaseService.getConversationMessages(id);
                        setMessages(msgs);
                        await supabaseService.markMessagesAsRead(id, currentUserId);
                        return;
                    }

                    // Fallback for new personas
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
            try {
                const chats = await supabaseService.getConversations(currentUserId);
                const currentChat = chats.find(c => c.id === id);
                setChat(currentChat);
                const msgs = await supabaseService.getConversationMessages(id);
                setMessages(msgs);
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

    const [otherPrivacy, setOtherPrivacy] = useState(null);

    useEffect(() => {
        fetchStorageStats();
    }, []);

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
        if (!chat) return;

        const fetchPrivacy = async () => {
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
        setNewMessage(e.target.value);
        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, e.target.value.length > 0);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedFile) return;
        if (!user) return;

        const textToSend = newMessage;
        const fileToSend = selectedFile;

        setNewMessage('');
        setSelectedFile(null);
        setUploading(!!fileToSend);

        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, false);
        }

        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = {
            id: tempId,
            conversation_id: id,
            sender_id: humanId,
            content: textToSend,
            attachment_url: fileToSend ? URL.createObjectURL(fileToSend) : null,
            attachment_type: fileToSend?.type.startsWith('image/') ? 'image' :
                fileToSend?.type.startsWith('video/') ? 'video' : 'document',
            created_at: new Date().toISOString(),
            status: 'sending'
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            let activeId = id;
            if (id.startsWith('new-iaia-')) {
                const otherParticipantId = chat.participant_2_id;
                const newConv = await supabaseService.getOrCreateConversation(
                    currentUserId, 'user', otherParticipantId, 'user'
                );
                activeId = newConv.id;
                navigate(`/chats/${activeId}`, { replace: true });
            }

            let attachmentUrl = null;
            let attachmentType = null;
            let attachmentName = null;

            if (fileToSend) {
                attachmentName = fileToSend.name;
                attachmentType = fileToSend.type.startsWith('image/') ? 'image' :
                    fileToSend.type.startsWith('video/') ? 'video' : 'document';
                attachmentUrl = await supabaseService.uploadChatAttachment(fileToSend, activeId, humanId);
            }

            const result = await supabaseService.sendSecureMessage({
                conversationId: activeId,
                senderId: humanId,
                senderEntityId: activeEntityId,
                content: textToSend,
                attachmentUrl,
                attachmentType,
                attachmentName,
                postUuid: commentingOn?.uuid || commentingOn?.id
            });

            // Replace optimistic with real
            setMessages(prev => prev.map(m => m.id === tempId ? { ...result, status: 'sent' } : m));
            fetchStorageStats();

            // If it was a comment, return to previous page after small delay
            if (commentingOn) {
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            }
        } catch (error) {
            logger.error('Error sending message:', error);
            const errorMsg = error.message?.includes('bucket not found')
                ? 'Error: El bucket "chat_attachments" no existe en Supabase Storage.'
                : 'Error al enviar el mensaje. Revisa la consola para más detalles.';
            alert(errorMsg);
        } finally {
            setUploading(false);
            if (isIAIAConv) {
                setIsThinking(true);
                setTimeout(() => {
                    if (isMounted.current) setIsThinking(false);
                }, 2000);
            }
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert(t('chats.storage_limit_warning'));
                return;
            }
            setSelectedFile(file);
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

    const handleVoiceSend = async (audioBlob, duration) => {
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

        } catch (error) {
            logger.error('Error sending voice:', error);
            alert('Error enviant nota de veu');
        } finally {
            setUploading(false);
        }
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
    const isP1Current = chat.participant_1_id === currentUserId;
    const otherInfo = isP1Current ? chat.p2_info : chat.p1_info;
    const otherType = isP1Current ? chat.participant_2_type : chat.participant_1_type;

    // Harmonized IAIA Detection Logic
    const isIAIAConv = chat.is_iaia ||
        (isP1Current ? chat.p2_is_ai : chat.p1_is_ai) ||
        (isP1Current ? chat.p2_role : chat.p1_role) === 'ambassador' ||
        (isP1Current ? chat.participant_2_id : chat.participant_1_id)?.startsWith('11111111-1111-4111-a111-');

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
                                <span className="identity-badge ai" title="Informació Artificial i Acció">IAIA</span>
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
                <div className="iaia-transparency-notice clickable" onClick={() => navigate('/iaia')}>
                    <div className="banner-content">
                        <div className="banner-left">
                            <div className="iaia-icon">🤖</div>
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
                                                msg.content && <div className="message-text">{msg.content}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="message-meta">
                                        {msg.is_ai && (
                                            <span className="bubble-tag ai">IAIA</span>
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
                                name="IAIA"
                                size={32}
                            />
                        </div>
                        <div className="message-bubble other thinking-bubble">
                            <div className="thinking-dots">
                                <span></span>
                                <span></span>
                                <span></span>
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
                    <div className="input-actions-left">
                        <button
                            type="button"
                            className={`attachment-trigger ${showEmojiPicker ? 'active' : ''}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            title="Afegir emoji"
                        >
                            <Smile size={20} />
                        </button>
                        <label className="attachment-trigger" htmlFor="file-upload" title="Adjuntar archivo (Máx 10MB)">
                            <input
                                id="file-upload"
                                name="attachment"
                                type="file"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                accept="image/*,video/*,.pdf,.doc,.docx"
                            />
                            <Paperclip size={20} />
                        </label>
                    </div>

                    <div className="input-main-area">
                        {showVoiceRecorder ? (
                            <VoiceRecorder
                                onSend={handleVoiceSend}
                                onCancel={() => setShowVoiceRecorder(false)}
                            />
                        ) : (
                            <>
                                {selectedFile && (
                                    <div className="attachment-preview">
                                        {selectedFile.type.startsWith('image/') ? <ImageIcon size={16} /> :
                                            selectedFile.type.startsWith('video/') ? <Film size={16} /> : <FileText size={16} />}
                                        <span className="file-name">{selectedFile.name}</span>
                                        <button type="button" onClick={() => setSelectedFile(null)} className="clear-attachment">×</button>
                                    </div>
                                )}

                                {isRecording ? (
                                    <div className="recording-status-panel">
                                        <div className="recording-indicator">
                                            <div className="rec-dot"></div>
                                            <span>{recordingType === 'audio' ? 'Gravant Àudio...' : 'Gravant Vídeo...'}</span>
                                        </div>
                                        <span className="recording-timer">{formatTime(recordingTime)} / 01:00</span>
                                        {recordingType === 'video' && (
                                            <video ref={videoPreviewRef} autoPlay muted playsInline className="video-recording-preview" />
                                        )}
                                        <button type="button" onClick={cancelRecording} className="cancel-rec-btn">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        name="message"
                                        type="text"
                                        value={newMessage}
                                        onChange={handleTyping}
                                        placeholder={t('common.write_message')}
                                        disabled={uploading}
                                        autoComplete="off"
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {isRecording ? (
                        <button
                            type="button"
                            className="stop-rec-button"
                            onClick={stopRecording}
                        >
                            <StopCircle size={24} color="red" />
                        </button>
                    ) : (
                        <>
                            {!newMessage && !selectedFile && !showVoiceRecorder && (
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
                                disabled={(!newMessage.trim() && !selectedFile) || uploading}
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
