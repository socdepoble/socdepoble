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
        return localVersion && localVersion !== APP_VERSION;
    });

    const [isReady] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return !localVersion || localVersion === APP_VERSION;
    });

    useEffect(() => {
        if (purging) {
            const timer = setTimeout(() => {
                if (window.RecordaAtum) {
                    window.RecordaAtum(APP_VERSION);
                } else {
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    window.location.reload(true);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [purging]);

    if (purging) {
        return (
            <div className="gatekeeper-purge-overlay">
                <div className="purge-spinner">🏺</div>
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
