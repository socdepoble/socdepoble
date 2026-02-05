import React, { useState, useEffect } from 'react';
import './VersionGatekeeper.css';

/**
 * [MASTER] VersionGatekeeper - El Portal del Temps del Mas
 * Controla que la versió de l'app siga la correcta. Si no, purga nuclear.
 */
const APP_VERSION = 'v1.13.0-AI-FULL';
const CRITICAL_THRESHOLD = 'v1.6.0';

const VersionGatekeeper = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [purging, setPurging] = useState(false);

    useEffect(() => {
        try {
            const localVersion = localStorage.getItem('sp_app_version');

            if (localVersion !== APP_VERSION) {
                // Si la versió local no coincideix, iniciem purga
                setPurging(true);

                const timer = setTimeout(() => {
                    console.log(`[GATEKEEPER] Versió obsoleta (${localVersion}) detectada. Actualitzant a ${APP_VERSION}...`);

                    // Neteja de memòria sense bucle
                    localStorage.setItem('sp_app_version', APP_VERSION);

                    if (window.RecordaAtum) {
                        window.RecordaAtum();
                    } else {
                        // Neteja selectiva per no perdre sessió si no és crític
                        // Però aquí fem neteja de caches si podem
                        if ('caches' in window) {
                            caches.keys().then(names => {
                                for (let name of names) caches.delete(name);
                            });
                        }
                    }

                    // En lloc de reload inmediat, marquem com a llest per a que l'usuari puga continuar
                    // i forcem un reload suau o simplement continuem
                    setPurging(false);
                    setIsReady(true);
                }, 1500);
                return () => clearTimeout(timer);
            } else {
                setIsReady(true);
            }
        } catch (e) {
            console.error("[GATEKEEPER] Error accedint a localStorage:", e);
            setIsReady(true); // Fail safe
        }
    }, []);

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
