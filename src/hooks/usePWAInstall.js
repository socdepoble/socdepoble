import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
            logger.log('[PWA] beforeinstallprompt captured');
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
        if (isAppInstalled) {
            setIsInstallable(false);
            logger.log('[PWA] App is already running in standalone mode');
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) {
            logger.warn('[PWA] No deferred prompt available');
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        logger.log(`[PWA] User response to install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return { isInstallable, promptInstall };
};
