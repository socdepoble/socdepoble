import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, User, Building2, Paperclip, X, FileText, Image as ImageIcon, Film, Database, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import UnifiedStatus from './UnifiedStatus';
import { logger } from '../utils/logger';
import './ChatDetail.css';

const getAvatarIcon = (type, avatarUrl) => {
    if (avatarUrl) {
        const isUrl = avatarUrl.includes('://') || avatarUrl.includes('/') || avatarUrl.includes('.');
        if (isUrl) {
            return (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatar-img"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'avatar-placeholder';
                        fallback.innerHTML = type === 'entity' ? '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><rect width="16" height="20" x="4" y="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>' : '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                        e.target.parentNode.appendChild(fallback);
                    }}
                />
            );
        }
        return <span className="avatar-emoji">{avatarUrl}</span>;
    }
    switch (type) {
        case 'entity': return <Building2 size={24} />;
        default: return <User size={24} />;
    }
};

const ChatDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin } = useAuth();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherPresence, setOtherPresence] = useState(null);
    const [storageStats, setStorageStats] = useState(null);
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

            await supabaseService.sendSecureMessage({
                conversationId: activeId,
                senderId: humanId,
                senderEntityId: activeEntityId,
                content: textToSend,
                attachmentUrl,
                attachmentType,
                attachmentName
            });
            fetchStorageStats();
        } catch (error) {
            logger.error('Error sending message:', error);
            const errorMsg = error.message?.includes('bucket not found')
                ? 'Error: El bucket "chat_attachments" no existe en Supabase Storage.'
                : 'Error al enviar el mensaje. Revisa la consola para más detalles.';
            alert(errorMsg);
        } finally {
            setUploading(false);
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
                    <div className="chat-header-avatar">
                        {getAvatarIcon(otherType, otherInfo?.avatar_url)}
                    </div>
                    <div className="chat-info">
                        <div className="chat-name-row">
                            <h2>{otherInfo?.name || t('common.unknown')}</h2>
                            {(chat.is_iaia ||
                                (isP1Current ? chat.p2_is_ai : chat.p1_is_ai) ||
                                (isP1Current ? chat.p2_role : chat.p1_role) === 'ambassador' ||
                                (isP1Current ? chat.participant_2_id : chat.participant_1_id)?.startsWith('11111111-1111-4111-a111-')) && (
                                    <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                )}
                        </div>
                        <span className={`status ${isOtherOnline ? 'online' : ''}`}>
                            {isOtherTyping ? t('common.typing') : (isOtherOnline ? t('common.online') : t('common.offline'))}
                        </span>
                    </div>
                </div>
            </div>

            {/* IAIA Notice - Transparencia */}
            {chat.is_iaia && (
                <div className="iaia-transparency-notice">
                    <div className="iaia-icon">🤖</div>
                    <div className="iaia-notice-content">
                        <h4>{t('chats.iaia_notice_title')} <span className="iaia-sub">{t('chats.iaia_notice_subtitle')}</span></h4>
                        <p>{t('chats.iaia_notice_text')}</p>
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
                        return (
                            <div key={msg.id} className={`message-bubble ${isMe ? 'me' : 'other'} ${msg.is_ai ? 'ai-bubble' : ''}`}>
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
                                    <span className={`bubble-tag ${msg.is_ai ? 'ai' : 'human'}`}>
                                        {msg.is_ai ? 'IAIA' : 'HUMÀ'}
                                    </span>
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
                        );
                    })
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
                        <button className="storage-info-trigger" title={t('chats.storage_banner_text')} type="button">
                            <Info size={14} />
                        </button>
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
