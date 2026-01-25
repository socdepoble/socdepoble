import { logger } from '../utils/logger';

/**
 * Service per gestionar les notificacions push PWA
 */
class PushNotificationService {
    constructor() {
        this.registration = null;
        this.subscription = null;
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    }

    /**
     * Registra el Service Worker
     */
    async registerServiceWorker() {
        if (!this.isSupported) {
            logger.warn('[Push] Service Worker o Push API no suportats en aquest navegador');
            return null;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            logger.log('[Push] Service Worker registrat correctament');

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            return this.registration;
        } catch (error) {
            logger.error('[Push] Error registrant Service Worker:', error);
            return null;
        }
    }

    /**
     * Sol·licita permisos de notificació a l'usuari
     */
    async requestPermission() {
        if (!this.isSupported) {
            return 'denied';
        }

        try {
            const permission = await Notification.requestPermission();
            logger.log('[Push] Permís de notificacions:', permission);
            return permission;
        } catch (error) {
            logger.error('[Push] Error demanant permisos:', error);
            return 'denied';
        }
    }

    /**
     * Subscriu l'usuari a les notificacions push
     * @param {string} vapidPublicKey - Clau pública VAPID del servidor
     */
    async subscribe(vapidPublicKey) {
        if (!this.registration) {
            await this.registerServiceWorker();
        }

        if (!this.registration) {
            throw new Error('Service Worker no disponible');
        }

        const permission = await this.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Permisos de notificació denegats');
        }

        try {
            // Convert VAPID key to Uint8Array
            const convertedKey = this.urlBase64ToUint8Array(vapidPublicKey);

            this.subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });

            logger.log('[Push] Subscripció creada:', this.subscription);
            return this.subscription;
        } catch (error) {
            logger.error('[Push] Error creant subscripció:', error);
            throw error;
        }
    }

    /**
     * Cancel·la la subscripció de notificacions
     */
    async unsubscribe() {
        if (!this.subscription) {
            const registration = await navigator.serviceWorker.ready;
            this.subscription = await registration.pushManager.getSubscription();
        }

        if (this.subscription) {
            try {
                await this.subscription.unsubscribe();
                this.subscription = null;
                logger.log('[Push] Subscripció cancel·lada');
                return true;
            } catch (error) {
                logger.error('[Push] Error cancel·lant subscripció:', error);
                return false;
            }
        }

        return false;
    }

    /**
     * Obté la subscripció actual
     */
    async getSubscription() {
        if (!this.registration) {
            const registration = await navigator.serviceWorker.ready;
            this.registration = registration;
        }

        if (this.registration) {
            this.subscription = await this.registration.pushManager.getSubscription();
        }

        return this.subscription;
    }

    /**
     * Comprova si l'usuari està subscrit
     */
    async isSubscribed() {
        const subscription = await this.getSubscription();
        return subscription !== null;
    }

    /**
     * Mostra una notificació local (sense push del servidor)
     */
    async showLocalNotification(title, options = {}) {
        if (!this.registration) {
            await this.registerServiceWorker();
        }

        const permission = Notification.permission;
        if (permission !== 'granted') {
            logger.warn('[Push] No es poden mostrar notificacions sense permisos');
            return;
        }

        const defaultOptions = {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            tag: 'local-notification',
            requireInteraction: false
        };

        await this.registration.showNotification(title, {
            ...defaultOptions,
            ...options
        });
    }

    /**
     * Converteix clau VAPID base64 a Uint8Array
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    /**
     * Actualitza el badge count (iOS/Android)
     */
    async updateBadgeCount(count) {
        if ('setAppBadge' in navigator) {
            try {
                if (count > 0) {
                    await navigator.setAppBadge(count);
                } else {
                    await navigator.clearAppBadge();
                }
            } catch (error) {
                logger.error('[Push] Error actualitzant badge:', error);
            }
        }
    }
}

export const pushService = new PushNotificationService();
