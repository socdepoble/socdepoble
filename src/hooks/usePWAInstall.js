import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

export const usePWAInstall = () => {
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            // DISABLED: No volem prompts de PWA en mode Native
            setIsInstallable(false);
            logger.log('[PWA] beforeinstallprompt blocked by Sovereign Directive');
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed - Initial state can be handled here if it doesn't trigger loop
        // but for PWA checks we want to be safe.
        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const promptInstall = async () => {
        logger.warn('[PWA] Prompting install is restricted in this version');
    };

    return { isInstallable, promptInstall };
};
