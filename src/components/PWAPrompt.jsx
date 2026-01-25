import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone } from 'lucide-react';
import './PWAPrompt.css';

const PWAPrompt = () => {
    const { isInstallable, promptInstall } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(true);

    if (!isInstallable || !isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        // Optional: Save preference to session storage to not bug them again this session
        sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    // Check if previously dismissed in session
    if (sessionStorage.getItem('pwa_prompt_dismissed')) return null;

    return (
        <div className="pwa-prompt-overlay">
            <div className="pwa-prompt-container">
                <button className="pwa-close-btn" onClick={handleDismiss} aria-label="Tancar">
                    <X size={20} />
                </button>

                <div className="pwa-content">
                    <div className="pwa-icon-area">
                        <img src="/icon-192.png" alt="App Icon" className="pwa-app-icon" />
                    </div>
                    <div className="pwa-text">
                        <h3>Instal·la Sóc de Poble</h3>
                        <p>Per a una millor experiència, afegeix l'app a la teua pantalla d'inici.</p>
                    </div>
                </div>

                <div className="pwa-actions">
                    <button className="btn-pwa-secondary" onClick={handleDismiss}>
                        Ara no
                    </button>
                    <button className="btn-pwa-primary" onClick={promptInstall}>
                        <Download size={18} />
                        Instal·lar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAPrompt;
