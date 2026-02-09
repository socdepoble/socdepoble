import React, { useState, useEffect } from 'react';
import { APP_VERSION, CRITICAL_THRESHOLD } from '../constants';
import './VersionGatekeeper.css';

/**
 * [MASTER] VersionGatekeeper - El Portal del Temps del Mas
 * Controla que la versió de l'app siga la correcta. Si no, purga nuclear.
 */
const VersionGatekeeper = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [purging, setPurging] = useState(false);

    useEffect(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        if (localVersion && localVersion !== APP_VERSION) {
            // [GATEKEEPER] Versió antiga detectada al magatzem local.
            // Invoquem el protocol de purga nuclear per garantir la puresa del Mas.
            setPurging(true);
            setTimeout(() => {
                if (window.RecordaAtum) {
                    window.RecordaAtum(APP_VERSION);
                } else {
                    localStorage.setItem('sp_app_version', APP_VERSION);
                    window.location.reload(true);
                }
            }, 1500);
        } else {
            setIsReady(true);
        }
    }, [APP_VERSION]);

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
