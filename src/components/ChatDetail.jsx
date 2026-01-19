import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';
import './ChatDetail.css';

const ChatDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                // Obtener info del chat
                const chats = await supabaseService.getChats();
                const currentChat = chats.find(c => c.id === parseInt(id));
                setChat(currentChat);

                // Obtener mensajes
                const msgs = await supabaseService.getChatMessages(parseInt(id));
                setMessages(msgs);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();

        // Suscribirse a nuevos mensajes
        const subscription = supabaseService.subscribeToMessages(parseInt(id), (newMsg) => {
            setMessages(prev => {
                // Evitar duplicados si el mensaje ya está (por el insert optimista o carga lenta)
                if (prev.find(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const textToSend = newMessage;
        setNewMessage('');

        try {
            await supabaseService.sendMessage(parseInt(id), textToSend);
            // No añadimos el mensaje manualmente aquí porque la suscripción Realtime lo hará
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

    return (
        <div className="chat-detail-container">
            <div className="chat-nav-bar">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <div className="chat-info">
                    <h2>{chat.name}</h2>
                    <span className="status">{t('common.online')}</span>
                </div>
            </div>

            <div className="messages-list">
                {messages.length === 0 ? (
                    <p className="empty-chat-message">{t('common.write_message')}</p>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'me' : 'other'}`}>
                            <p>{msg.text}</p>
                            <span className="message-time">{msg.time}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder={t('common.write_message')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatDetail;
