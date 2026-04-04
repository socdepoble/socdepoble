import React, { useState, useEffect } from 'react';
import { APP_VERSION } from '../constants';
import './VersionGatekeeper.css';

/**
 * [MASTER] VersionGatekeeper - El Portal del Temps del Mas
 * Controla que la versió de l'app siga la correcta. Si no, purga nuclear.
 */
const VersionGatekeeper = ({ children }) => {
    // [INITIALIZATION] Check version directly in render state to avoid cascading effects
    const [purging] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        // console.debug('[VersionGatekeeper] Debugging variables:', { localVersion, APP_VERSION });
        return localVersion && localVersion !== APP_VERSION;
    });

    const [isReady] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return !localVersion || localVersion === APP_VERSION;
    });

    useEffect(() => {
        if (purging) {
            const timer = setTimeout(() => {
                const now = Date.now();
                const lastReload = parseInt(localStorage.getItem('sp_last_version_reload') || '0');
                
                if (now - lastReload < 10000) {
                    console.error('[VersionGatekeeper] Circuit breaker actiu. Sincronitzant versió manualment.');
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    window.location.reload(); // Un últim intent per si de cas, però el flag ara coincideix
                } else {
                    if ('caches' in window) {
                        caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))));
                    }
                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({ type: 'FORCE_UPDATE' });
                    }
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    localStorage.setItem('sp_last_version_reload', now.toString());
                    window.location.reload(true);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [purging]);

    if (purging) {
        return (
            <div className="gatekeeper-purge-overlay">
                <img src="/icon-192x192.png" alt="Sóc de Poble" className="purge-logo" />
                <h2 className="purge-title">FENT DISSABTE</h2>
                <p className="purge-subtitle">ACTUALITZANT EL MAS...</p>
                <div className="purge-version">{APP_VERSION}</div>
            </div>
        );
    }

    if (!isReady) return null;
    return <>{children}</>;
};

export default VersionGatekeeper;
