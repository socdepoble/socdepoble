import { supabase } from '../../supabaseClient';
import { logger } from '../../utils/logger';
import { notificationService } from './notificationService';

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
            // [MASTER] Simulem èxit en mode Playground per evitar errors 401 (Unauthorized)
            const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true';
            if (isPlayground) {
                logger.log('[Push] Mode Playground detectat. Simulant guardat de subscripció...');
                return { id: 'demo-sub', user_id: userId, is_demo: true };
            }

            // [MASTER] AUTO-HEALING: Verifiquem sessió activa abans de procedir
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                logger.warn('[Push] No active session. Skipping DB sync to avoid 401.');
                return null;
            }

            // Asegurar que treballem amb el JSON de la subscripció
            const subData = subscription.toJSON ? subscription.toJSON() : subscription;

            const subscriptionData = {
                user_id: userId,
                endpoint: subData.endpoint,
                p256dh: subData.keys?.p256dh || '',
                auth: subData.keys?.auth || '',
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    timestamp: new Date().toISOString()
                }
            };

            // [PROACTIVE CHECK] Verify if profile exists to avoid 23503 (FK) / 409 (Conflict) in browser console
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .limit(1);

            const profile = profiles && profiles.length > 0 ? profiles[0] : null;

            if (profileError || !profile) {
                logger.warn('[Push] User profile not yet indexed in DB. Postponing subscription sync.');
                return { id: 'pending-sync', user_id: userId, status: 'pending_profile' };
            }

            // [MASTER] TWO-STEP UPSERT approach to avoid 409 Conflict errors on some PostgREST versions
            const { data: existing, error: fetchError } = await supabase
                .from('push_subscriptions')
                .select('id')
                .match({ user_id: userId, endpoint: subData.endpoint })
                .maybeSingle();

            if (fetchError) {
                logger.error('[Push] Error checking existing sub:', fetchError.message);
            }

            let result;
            if (existing) {
                result = await supabase
                    .from('push_subscriptions')
                    .update({
                        ...subscriptionData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();
            } else {
                result = await supabase
                    .from('push_subscriptions')
                    .insert([subscriptionData])
                    .select()
                    .single();
            }

            const { data, error } = result;

            if (error) {
                // [MASTER RESILIENCE] Si la taula no existeix
                if (error.code === '42P01') {
                    logger.warn('[Push] Table push_subscriptions does not exist.');
                    return null;
                }

                // Handle 409 Conflict o 23503 (just in case check failed due to race condition)
                if (error.code === '23503' || error.status === 409) {
                    logger.warn('[Push] User profile conflict. Simulating subscription success.');
                    return { id: 'pending-sync', user_id: userId, status: 'pending_profile' };
                }

                logger.error('[Push] Error saving subscription:', error.message || error);
                return null;
            }

            logger.log('[Push] Subscription bategant correctament al Mas');
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

    async triggerNotification(userId, payload) {
        return notificationService.send(userId, {
            type: payload.tag || 'general',
            title: payload.title,
            body: payload.body,
            url: payload.url,
            data: payload.data
        });
    }
};
