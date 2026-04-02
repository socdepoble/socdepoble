import { useRegisterSW } from 'virtual:pwa-register/react';

export function useUpdateSW() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker
    } = useRegisterSW({
        onRegistered(registration) {
            // Actualització periòdica cada 30 minuts (evita embussos)
            if (registration) {
                setInterval(() => {
                    registration.update();
                }, 1000 * 60 * 30);
            }
        },
        onRegisterError(error) {
            console.error('SW registration failed:', error);
        }
    });

    return { needRefresh, updateServiceWorker, setNeedRefresh };
}
