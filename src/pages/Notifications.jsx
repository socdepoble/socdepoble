import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Heart, MessageCircle, UserPlus, Gift, AlertCircle, Trash2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import StatusLoader from '../components/StatusLoader';
import './Notifications.css';

const Notifications = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchNotifs = async () => {
            try {
                // Fetch real notifications from DB
                // We need to implement getNotifications in supabaseService or query directly here for MVP
                // For now, let's assume we add getNotifications to service or query directly
                // To keep it clean, let's mock it for a second if service method missing, 
                // but ideally we query supabase.

                // Importing supabase directly here to avoid changing service file again if possible,
                // but better practice is to use service. 
                // Let's rely on the service existing or add it implicitly. 
                // Wait, I didn't add getNotifications to service yet. I'll add the query here for speed/safety.

                const { supabase } = await import('../supabaseClient');
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (error) throw error;
                setNotifications(data || []);
            } catch (err) {
                logger.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifs();
    }, [user]);

    const handleNotificationClick = async (notif) => {
        // Mark as read
        if (!notif.is_read) {
            try {
                const { supabase } = await import('../supabaseClient');
                await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            } catch (e) {
                logger.error('Error marking read:', e);
            }
        }

        // Logic for Interactive Push (Deep Link)
        if (notif.related_url) {
            if (notif.meta?.is_iaia && notif.meta?.context_message) {
                // Find IAIA and redirect with context (Same logic as Layout.jsx)
                const personas = await supabaseService.getAllPersonas();
                const iaia = personas.find(p => p.full_name?.toUpperCase().includes('IAIA') || p.role === 'ambassador');

                if (iaia) {
                    navigate(`/chats/${iaia.id}`, {
                        state: { injectedMessage: notif.meta.context_message }
                    });
                } else {
                    navigate(notif.related_url);
                }
            } else {
                navigate(notif.related_url);
            }
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { supabase } = await import('../supabaseClient');
            await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) {
            logger.error('Error marking all read:', e);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm(t('common.confirm_delete_all', 'Vols esborrar totes les notificacions?'))) return;
        try {
            const { supabase } = await import('../supabaseClient');
            await supabase.from('notifications').delete().eq('user_id', user.id);
            setNotifications([]);
        } catch (e) {
            logger.error('Error clearing all:', e);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigating
        try {
            const { supabase } = await import('../supabaseClient');
            await supabase.from('notifications').delete().eq('id', id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (e) {
            logger.error('Error deleting notification:', e);
        }
    };

    if (loading) return <StatusLoader type="loading" />;

    return (
        <div className="notifications-container">
            <header className="page-header-simple">
                <h1>{t('notifications.title') || 'Notificacions'}</h1>
                {notifications.length > 0 && (
                    <div className="header-actions">
                        <button className="text-btn" onClick={handleMarkAllRead}>
                            {t('common.mark_read', 'Llegit')}
                        </button>
                        <button className="text-btn danger" onClick={handleClearAll}>
                            {t('common.clear', 'Netejar')}
                        </button>
                    </div>
                )}
            </header>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <StatusLoader type="empty" message="No tens notificacions recents." />
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <div className="notif-icon-wrapper">
                                {notif.type === 'like' && <Heart size={18} fill="var(--color-primary)" color="var(--color-primary)" />}
                                {notif.type === 'comment' && <MessageCircle size={18} color="var(--color-secondary)" />}
                                {notif.type === 'system' && <AlertCircle size={18} color="#e63946" />}
                                {!['like', 'comment', 'system'].includes(notif.type) && <Bell size={18} />}
                            </div>
                            <div className="notif-content">
                                <p>{notif.content}</p>
                                <span className="notif-time">
                                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="notif-actions">
                                {!notif.is_read && <div className="unread-dot"></div>}
                                <button className="delete-btn" onClick={(e) => handleDelete(e, notif.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
