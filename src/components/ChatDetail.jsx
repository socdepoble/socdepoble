import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, User, Building2, Paperclip, X, FileText, Image as ImageIcon, Film, Database, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import UnifiedStatus from './UnifiedStatus';
import { logger } from '../utils/logger';
import './ChatDetail.css';


const ChatDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = activeEntityId || humanId;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user || !currentUserId) return;

        if (id.startsWith('new-iaia-') || id.startsWith('mock-')) {
            const personaId = id.replace('new-iaia-', '').replace('mock-', '');
            const fetchVirtualData = async () => {
                try {
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
    }, [id, user, activeEntityId, currentUserId]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length]);

    useEffect(() => {
        fetchStorageStats();
    }, []);

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
                attachmentName
            });

            // Replace optimistic with real
            setMessages(prev => prev.map(m => m.id === tempId ? { ...result, status: 'sent' } : m));
            fetchStorageStats();
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

    if (error) {
        return (
            <div className="chat-detail-container">
                <UnifiedStatus type="error" message={error} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="chat-detail-container">
                <UnifiedStatus type="loading" message={t('common.loading')} />
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="chat-detail-container">
                <UnifiedStatus type="empty" message={t('chats.empty')} />
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
                            {isIAIAConv && (
                                <span className="identity-badge ai" title="Informació Artificial i Acció">IAIA</span>
                            )}
                        </div>
                        <span className={`status ${isOtherOnline ? 'online' : ''}`}>
                            {isOtherTyping ? t('common.typing') : (isOtherOnline ? t('common.online') : t('common.offline'))}
                        </span>
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
                                            {msg.content && <div className="message-text">{msg.content}</div>}
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
                                            <span className={`message-status ${msg.read_at ? 'read' : ''}`}>
                                                {msg.read_at ? '✓✓' : '✓'}
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
                    <div className="input-actions-left">
                        <label className="attachment-trigger" title="Adjuntar archivo (Máx 10MB)">
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                accept="image/*,video/*,.pdf,.doc,.docx"
                            />
                            <Paperclip size={20} />
                        </label>
                    </div>

                    <div className="input-main-area">
                        {selectedFile && (
                            <div className="attachment-preview">
                                {selectedFile.type.startsWith('image/') ? <ImageIcon size={16} /> :
                                    selectedFile.type.startsWith('video/') ? <Film size={16} /> : <FileText size={16} />}
                                <span className="file-name">{selectedFile.name}</span>
                                <button type="button" onClick={() => setSelectedFile(null)} className="clear-attachment">×</button>
                            </div>
                        )}
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleTyping}
                            placeholder={t('common.write_message')}
                            disabled={uploading}
                            autoComplete="off"
                        />
                    </div>

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
                </form>
            </div>
        </div>
    );
};

export default ChatDetail;
