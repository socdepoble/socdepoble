import React, { useState } from 'react';
import { APP_VERSION } from '../../constants';
import './VersionGatekeeper.css';

/**
 * [MASTER] VersionGatekeeper - El Portal del Temps del Mas
 * Renderitza la pantalla 'Fent Dissabte' si detectem una asincronia visual.
 * La purga real ara es gestiona de manera segura a entry.jsx abans de muntar React.
 */
const VersionGatekeeper = ({ children }) => {
    const [purging, setPurging] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return localVersion && localVersion !== APP_VERSION;
    });

    const [isReady, setIsReady] = useState(() => {
        const localVersion = localStorage.getItem('sp_app_version');
        return !localVersion || localVersion === APP_VERSION;
    });

    React.useEffect(() => {
        if (purging || !isReady) {
            const timer = setTimeout(() => {
                localStorage.setItem('sp_app_version', APP_VERSION);
                setPurging(false);
                setIsReady(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [purging, isReady]);

    if (purging) {
        return (
            <div className="gatekeeper-purge-overlay">
                <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Sóc de Poble" className="purge-logo drop-shadow-none" />
                <h2 className="purge-title">FENT DISSABTE</h2>
                <div className="purge-version">{APP_VERSION.replace('-CANÒNIC', '')}</div>
            </div>
        );
    }

    if (!isReady) return null;
    return <>{children}</>;
};

export default VersionGatekeeper;
