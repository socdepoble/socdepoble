import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Store, Users, Building2, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import './ChatList.css';

const getAvatarIcon = (type) => {
    switch (type) {
        case 'gov': return <Building2 size={24} />;
        case 'shop': return <Store size={24} />;
        case 'group': return <Users size={24} />;
        default: return <User size={24} />;
    }
};

const getAvatarColor = (type) => {
    switch (type) {
        case 'gov': return 'var(--color-primary)';
        case 'shop': return 'var(--color-secondary)';
        case 'group': return 'var(--color-accent)';
        case 'coop': return '#6B705C';
        default: return '#999';
    }
};

const ChatList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await supabaseService.getChats();
                setChats(data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) {
        return (
            <div className="chat-list-container loading">
                <Loader2 className="spinner" />
                <p>{t('chats.loading_chats')}</p>
            </div>
        );
    }

    return (
        <div className="chat-list-container">
            <header className="page-header">
                <h1>{t('chats.title')}</h1>
            </header>
            <div className="chat-list">
                {chats.length === 0 ? (
                    <p className="empty-message">{t('chats.empty')}</p>
                ) : (
                    chats.map(chat => (
                        <div key={chat.id} className="chat-item" onClick={() => navigate(`/chats/${chat.id}`)}>
                            <div className="chat-avatar" style={{ backgroundColor: getAvatarColor(chat.type) }}>
                                {getAvatarIcon(chat.type)}
                            </div>
                            <div className="chat-content">
                                <div className="chat-header">
                                    <span className="chat-name">{chat.name}</span>
                                    <span className="chat-time">{chat.time}</span>
                                </div>
                                <div className="chat-preview">
                                    <span className="chat-message">{chat.last_message}</span>
                                    {chat.unread_count > 0 && <span className="unread-badge">{chat.unread_count}</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
