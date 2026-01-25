import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';

const ResetPage = () => {
    const { signOut } = useAuth();

    useEffect(() => {
        const performReset = async () => {
            logger.warn('[Reset] Starting emergency session reset...');

            try {
                // 1. Supabase Sign Out
                await signOut();
            } catch (e) {
                logger.error('[Reset] Sign out error (ignored):', e);
            }

            try {
                // 2. Clear Local Storage
                localStorage.clear();
                sessionStorage.clear();
                logger.info('[Reset] Storage cleared.');

                // 3. Clear Caches if possible
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => caches.delete(key)));
                    logger.info('[Reset] Caches cleared.');
                }

                // 4. Unregister Service Workers
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                        await registration.unregister();
                    }
                    logger.info('[Reset] Service Workers unregistered.');
                }
            } catch (e) {
                logger.error('[Reset] System cleanup error:', e);
            }

            // 5. Force Redirect to Login
            window.location.href = '/login';
        };

        performReset();
    }, [signOut]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#000',
            color: '#fff',
            fontFamily: 'system-ui'
        }}>
            <h2 style={{ color: '#FF6B35' }}>⚠️ Reiniciant Sistema...</h2>
            <p>Esborrant memòria cau i tancant sessió.</p>
        </div>
    );
};

export default ResetPage;
