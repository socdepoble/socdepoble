import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Heart, MessageCircle, UserPlus, Gift, AlertCircle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    const { t } = useTranslation();

    const notifications = [
        {
            id: 1,
            type: 'like',
            user: 'Maria Garcia',
            content: 'li ha agradat la teua publicació',
            time: 'Fa 5 min',
            unread: true,
            icon: <Heart size={18} fill="var(--color-primary)" color="var(--color-primary)" />
        },
        {
            id: 2,
            type: 'comment',
            user: 'Marc Soler',
            content: 'ha comentat: "Bona iniciativa!"',
            time: 'Fa 20 min',
            unread: true,
            icon: <MessageCircle size={18} color="var(--color-secondary)" />
        },
        {
            id: 3,
            type: 'follow',
            user: 'La Panaderia de Pau',
            content: 'ha començat a seguir-te',
            time: 'Fa 1 h',
            unread: true,
            icon: <UserPlus size={18} color="#9b51e0" />
        },
        {
            id: 4,
            type: 'market',
            user: 'Mercat de l\'Horta',
            content: 'Nou producte disponible que t\'interessa',
            time: 'Fa 3 h',
            unread: false,
            icon: <Gift size={18} color="var(--color-accent)" />
        },
        {
            id: 5,
            type: 'system',
            user: 'Ajuntament',
            content: 'Recordatori: Tall de carrer demà per obres',
            time: 'Fa 5 h',
            unread: false,
            icon: <AlertCircle size={18} color="#e63946" />
        }
    ];

    return (
        <div className="notifications-container">
            <header className="page-header-simple">
                <h1>{t('notifications.title') || 'Notificacions'}</h1>
            </header>

            <div className="notifications-list">
                {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                        <div className="notif-icon-wrapper">
                            {notif.icon}
                        </div>
                        <div className="notif-content">
                            <p>
                                <span className="notif-user">{notif.user}</span> {notif.content}
                            </p>
                            <span className="notif-time">{notif.time}</span>
                        </div>
                        {notif.unread && <div className="unread-dot"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
