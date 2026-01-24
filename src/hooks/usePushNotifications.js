import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { pushService } from '../services/pushService';
import pushNotifications from '../services/pushNotifications';
import { logger } from '../utils/logger';

/**
 * Hook per inicialitzar el sistema de Push Notifications
 * S'executa automàticament quan l'usuari està logged in
 */
export const usePushNotifications = () => {
    const { user } = useAuth();
    const isInitialized = useRef(false);

    useEffect(() => {
        // Only initialize once per session
        if (!user || isInitialized.current) return;

        const initializePush = async () => {
            try {
                // Register Service Worker
                const registration = await pushService.registerServiceWorker();
                if (!registration) {
                    logger.warn('[usePushNotifications] Service Worker not supported');
                    return;
                }

                // Check if already subscribed
                const existingSubscription = await pushService.getSubscription();
                if (existingSubscription) {
                    logger.log('[usePushNotifications] Already subscribed');
                    isInitialized.current = true;
                    return;
                }

                // Get VAPID public key from environment
                const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
                if (!vapidKey) {
                    logger.warn('[usePushNotifications] VAPID key not configured');
                    return;
                }

                // Request permission (only after user is logged in)
                const permission = await pushService.requestPermission();
                if (permission !== 'granted') {
                    logger.log('[usePushNotifications] Permission denied');
                    return;
                }

                // Subscribe to push notifications
                const subscription = await pushService.subscribe(vapidKey);
                logger.log('[usePushNotifications] Subscribed successfully');

                // Save subscription to database
                await pushNotifications.saveSubscription(user.id, subscription);
                logger.log('[usePushNotifications] Subscription saved to DB');

                isInitialized.current = true;
            } catch (error) {
                logger.error('[usePushNotifications] Initialization error:', error);
            }
        };

        // Initialize after a small delay to avoid blocking initial render
        const timer = setTimeout(initializePush, 2000);

        return () => clearTimeout(timer);
    }, [user]);

    return {
        isSupported: pushService.isSupported,
        requestPermission: () => pushService.requestPermission(),
        showLocalNotification: (title, options) => pushService.showLocalNotification(title, options)
    };
};
