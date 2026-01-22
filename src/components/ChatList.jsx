import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Building2, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import CategoryTabs from './CategoryTabs';
import './ChatList.css';

const getParticipantInfo = (chat, currentId, t) => {
    // Si somos invitados (DEMO_USER_ID), mostramos los nombres de ambos participantes
    if (!currentId || currentId === '00000000-0000-0000-0000-000000000000') {
        const p1 = chat.p1_info?.name || '...';
        const p2 = chat.p2_info?.name || '...';
        return {
            name: `${p1} & ${p2}`,
            type: chat.participant_2_type,
            avatar: chat.p2_info?.avatar_url
        };
    }

    // Determine which participant is the "other" one
    const isP1Current = chat.participant_1_id === currentId;
    const otherInfo = isP1Current ? chat.p2_info : chat.p1_info;
    const otherType = isP1Current ? chat.participant_2_type : chat.participant_1_type;

    return {
        name: otherInfo?.name || chat.participant_2_id.substring(0, 8),
        type: otherType,
        avatar: otherInfo?.avatar_url
    };
};

const getAvatarIcon = (type, avatarUrl) => {
    if (avatarUrl) {
        // Robust check: if it looks like a URL/path, render img. If it's short (emoji), render as text.
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

const getAvatarColor = (type, avatarUrl) => {
    if (avatarUrl) {
        const isUrl = avatarUrl.includes('://') || avatarUrl.includes('/') || avatarUrl.includes('.');
        return isUrl ? 'transparent' : '#f0f0f0';
    }
    switch (type) {
        case 'entity': return 'var(--color-primary)';
        default: return '#999';
    }
};

const ChatList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, impersonatedProfile, activeEntityId, isSuperAdmin } = useAppContext();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('xat');

    const chatTabs = [
        { id: 'xat', label: t('common.role_xat') },
        { id: 'gent', label: t('common.role_gent') },
        { id: 'grup', label: t('common.role_grup') },
        { id: 'treball', label: t('common.role_treball') },
        { id: 'pobo', label: t('common.role_pobo') }
    ];

    // Si somos Super Admin y estamos personificando a alguien, usamos ese ID
    const currentId = activeEntityId || (isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id);

    useEffect(() => {
        let isMounted = true;
        // En modo Demo o Super Admin bypass, permitimos cargar aunque no haya sesión real de auth.uid()
        const fetchChats = async () => {
            console.log('[ChatList] Fetching chats for currentId:', currentId);
            try {
                const data = await supabaseService.getConversations(currentId);
                if (!isMounted) return;
                console.log('[ChatList] Chats fetched:', data?.length || 0);
                setChats(data);
            } catch (error) {
                if (isMounted) console.error('[ChatList] Error fetching chats:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchChats();
        return () => { isMounted = false; };
    }, [currentId]);

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
            <header className="page-header-with-tabs">
                <div className="header-tabs-wrapper">
                    <CategoryTabs
                        selectedRole={selectedCategory}
                        onSelectRole={setSelectedCategory}
                        tabs={chatTabs}
                    />
                </div>
            </header>
            <div className="chat-list">
                {!Array.isArray(chats) || chats.length === 0 ? (
                    <p className="empty-message">{t('chats.empty')}</p>
                ) : (
                    chats.map(chat => {
                        const otherParticipant = getParticipantInfo(chat, currentId, t);
                        return (
                            <div key={chat.id} className="chat-item" onClick={() => navigate(`/chats/${chat.id}`)}>
                                <div className="chat-avatar" style={{ backgroundColor: getAvatarColor(otherParticipant.type, otherParticipant.avatar) }}>
                                    {getAvatarIcon(otherParticipant.type, otherParticipant.avatar)}
                                </div>
                                <div className="chat-content">
                                    <div className="chat-header">
                                        <span className="chat-name">{otherParticipant.name}</span>
                                        <span className="chat-time">
                                            {new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="chat-preview">
                                        <span className="chat-message">{chat.last_message_content || t('common.write_message')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatList;
