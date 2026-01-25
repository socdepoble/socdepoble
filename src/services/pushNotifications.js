import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * Funcions d'utilitat per gestionar les subscripcions push
 * Aquestes funcions s'exporten des de supabaseService.js
 */

export const pushNotifications = {
    /**
     * Guardar subscripció push a la base de dades
     */
    async saveSubscription(userId, subscription) {
        if (!subscription || !userId) {
            logger.error('[Push] Invalid subscription or userId');
            return null;
        }

        try {
            // Asegurar que treballem amb el JSON de la subscripció
            const subData = subscription.toJSON ? subscription.toJSON() : subscription;

            const subscriptionData = {
                user_id: userId,
                endpoint: subData.endpoint,
                p256dh: subData.keys?.p256dh,
                auth: subData.keys?.auth,
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    timestamp: new Date().toISOString()
                }
            };

            const { data, error } = await supabase
                .from('push_subscriptions')
                .upsert(subscriptionData, { onConflict: 'user_id,endpoint' })
                .select()
                .single();

            if (error) {
                // Si la taula no existeix, no fer crash
                if (error.code === '42P01') {
                    logger.warn('[Push] Table push_subscriptions does not exist. Run migration_push_notifications.sql');
                    return null;
                }
                logger.error('[Push] Error saving subscription:', error);
                throw error;
            }

            logger.log('[Push] Subscription saved successfully');
            return data;
        } catch (error) {
            logger.error('[Push] Failed to save subscription:', error);
            return null;
        }
    },

    /**
     * Eliminar subscripció push
     */
    async removeSubscription(userId, endpoint) {
        if (!userId || !endpoint) return false;

        try {
            const { error } = await supabase
                .from('push_subscriptions')
                .delete()
                .match({ user_id: userId, endpoint });

            if (error) {
                logger.error('[Push] Error removing subscription:', error);
                return false;
            }

            logger.log('[Push] Subscription removed');
            return true;
        } catch (error) {
            logger.error('[Push] Failed to remove subscription:', error);
            return false;
        }
    },

    /**
     * Obtenir totes les subscripcions actives d'un usuari
     */
    async getUserSubscriptions(userId) {
        if (!userId) return [];

        try {
            const { data, error } = await supabase
                .from('push_subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true);

            if (error) {
                if (error.code === '42P01') {
                    return []; // Taula no existeix
                }
                throw error;
            }

            return data || [];
        } catch (error) {
            logger.error('[Push] Failed to get subscriptions:', error);
            return [];
        }
    },

    /**
     * Disparar notificació via Edge Function
     * Aquesta funció crida l'Edge Function de Supabase
     */
    async triggerNotification(userId, payload) {
        const { title, body, url, icon, tag, data } = payload;

        try {
            const { data: response, error } = await supabase.functions.invoke('send-push-notification', {
                body: {
                    userId,
                    title,
                    body,
                    url,
                    icon,
                    tag,
                    data
                }
            });

            if (error) {
                logger.error('[Push] Error triggering notification:', error);
                return false;
            }

            logger.log('[Push] Notification triggered:', response);
            return true;
        } catch (error) {
            logger.error('[Push] Failed to trigger notification:', error);
            return false;
        }
    }
};

export default pushNotifications;
