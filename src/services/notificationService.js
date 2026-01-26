import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * notificationService.js
 * Centralizes the creation and dispatching of push notifications.
 * Implements "God Level" abstraction to avoid abstraction leaks.
 */

const IAIA_AVATAR = '/images/demo/avatar_woman_old.png';

export const notificationService = {
    /**
     * Send a notification to a specific user
     */
    async send(userId, { type, title, body, url, data = {}, actions = [] }) {
        if (!userId) {
            logger.error('[NotificationService] Missing userId');
            return false;
        }

        const payload = this.preparePayload(type, { title, body, url, data, actions });

        try {
            const { data: response, error } = await supabase.functions.invoke('send-push-notification', {
                body: {
                    userId,
                    ...payload
                }
            });

            if (error) {
                logger.error('[NotificationService] Edge Function error:', error);
                return false;
            }

            logger.log('[NotificationService] Notification sent:', response);
            return true;
        } catch (error) {
            logger.error('[NotificationService] Unexpected error:', error);
            return false;
        }
    },

    /**
     * Standardize payloads based on type
     */
    preparePayload(type, { title, body, url, data, actions }) {
        const basePayload = {
            title: title || 'Sóc de Poble',
            body: body || '',
            url: url || '/',
            tag: type || 'general',
            data: { ...data, type },
            actions: actions || []
        };

        switch (type) {
            case 'iaia':
                return {
                    ...basePayload,
                    title: title || '👵 La teua IAIA et diu...',
                    icon: IAIA_AVATAR,
                    vibrate: [100, 50, 100, 400, 100, 50, 100], // IAIA heartbeat
                    data: { ...basePayload.data, isIAIA: true },
                    requireInteraction: true
                };

            case 'chat':
                return {
                    ...basePayload,
                    tag: 'chat-message',
                    vibrate: [200, 100, 200]
                };

            case 'system':
                return {
                    ...basePayload,
                    title: `🛠️ ${basePayload.title}`,
                    vibrate: [500]
                };

            default:
                return basePayload;
        }
    },

    /**
     * Broadcast to all admins (convenience method)
     */
    async broadcastToAdmins(payload) {
        // Implementation would fetch admin IDs and send to each
        // For now, this is a placeholder for the logic in AdminPanel
        logger.log('[NotificationService] Broadcast to admins requested');
    }
};

export default notificationService;
