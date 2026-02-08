import { useEffect } from 'react';

/**
 * Hook per inicialitzar el sistema de Push Notifications [DESACTIVAT]
 * S'ha desactivat per evitar bucles de recàrrega infinita amb el Service Worker.
 */
export const usePushNotifications = () => {
    useEffect(() => {
        // [BLOCK] Protocol Natiu: Notificacions Push PWA desactivades
        return;
    }, []);

    return {
        isSupported: false,
        requestPermission: async () => 'denied',
        showLocalNotification: () => { }
    };
};

export default usePushNotifications;
