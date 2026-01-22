import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, User, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './ChatDetail.css';

const getAvatarIcon = (type, avatarUrl) => {
    if (avatarUrl) {
        const isUrl = avatarUrl.includes('://') || avatarUrl.includes('/') || avatarUrl.includes('.');
        if (isUrl) {
            return <img src={avatarUrl} alt="Avatar" className="avatar-img" />;
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
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin } = useAppContext();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherPresence, setOtherPresence] = useState(null);
    const presenceChannelRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Si somos Super Admin y estamos personificando a alguien, usamos ese ID
    const currentUserId = activeEntityId || (isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user || !currentUserId) return;

        const fetchChatData = async () => {
            try {
                // Obtener info del chat
                const chats = await supabaseService.getConversations(currentUserId);
                const currentChat = chats.find(c => c.id === id);
                setChat(currentChat);

                // Obtener mensajes
                const msgs = await supabaseService.getConversationMessages(id);
                setMessages(msgs);

                // Marcar como leídos al entrar
                await supabaseService.markMessagesAsRead(id, currentUserId);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();

        // Suscribirse a nuevos mensajes y actualizaciones (leídos)
        const subscription = supabaseService.subscribeToConversation(id, {
            onNewMessage: (newMsg) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
                // Si el mensaje es del otro, marcar como leído
                if (newMsg.sender_id !== currentUserId) {
                    supabaseService.markMessagesAsRead(id, currentUserId);
                }
            },
            onMessageUpdate: (updatedMsg) => {
                setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
            }
        });

        // Suscribirse a Presencia (Online/Typing)
        presenceChannelRef.current = supabaseService.subscribeToPresence(id, currentUserId, (state) => {
            // Buscar al "otro" participante en el estado de presencia
            const otherId = Object.keys(state).find(key => key !== currentUserId);
            if (otherId) {
                setOtherPresence(state[otherId][0]);
            } else {
                setOtherPresence(null);
            }
        });

        return () => {
            subscription.unsubscribe();
            if (presenceChannelRef.current) presenceChannelRef.current.unsubscribe();
        };
    }, [id, user, activeEntityId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, e.target.value.length > 0);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const textToSend = newMessage;
        setNewMessage('');

        // Stop typing indicator
        if (presenceChannelRef.current) {
            supabaseService.updatePresenceTyping(presenceChannelRef.current, false);
        }

        try {
            await supabaseService.sendSecureMessage({
                conversationId: id,
                senderId: user.id,
                senderEntityId: activeEntityId,
                content: textToSend
            });
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error al enviar el missatge');
        }
    };

    if (loading) {
        return (
            <div className="chat-detail-container loading">
                <Loader2 className="spinner" />
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (!chat) return <div className="chat-detail-container">{t('chats.empty')}</div>;

    const isOtherOnline = !!otherPresence;
    const isOtherTyping = otherPresence?.is_typing;

    // Info del interlocutor
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
                        <h2>{otherInfo?.name || t('common.unknown')}</h2>
                        <span className={`status ${isOtherOnline ? 'online' : ''}`}>
                            {isOtherTyping ? t('common.typing') : (isOtherOnline ? t('common.online') : t('common.offline'))}
                        </span>
                    </div>
                </div>
            </div>

            <div className="messages-list">
                {messages.length === 0 ? (
                    <p className="empty-chat-message">{t('common.write_message')}</p>
                ) : (
                    messages.map(msg => {
                        const isMe = msg.sender_id === user.id && (!msg.sender_entity_id || msg.sender_entity_id === activeEntityId);
                        return (
                            <div key={msg.id} className={`message-bubble ${isMe ? 'me' : 'other'}`}>
                                <p>{msg.content}</p>
                                <div className="message-meta">
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

            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <div className="chat-input-wrapper">
                    <input
                        id="chat-message-input"
                        name="message"
                        type="text"
                        placeholder={t('common.write_message')}
                        value={newMessage}
                        onChange={handleTyping}
                        autoComplete="off"
                    />
                </div>
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatDetail;
