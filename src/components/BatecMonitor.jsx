import React, { useState, useEffect } from 'react';
import { Zap, Users, HardDrive, Info } from 'lucide-react';
import './BatecMonitor.css';

const BatecMonitor = () => {
    const [status, setStatus] = useState('online'); // 'online', 'mesh', 'offline'

    useEffect(() => {
        const updateStatus = () => {
            if (navigator.onLine) {
                setStatus('online');
            } else {
                // Per ara simulem 'mesh' si no hi ha internet però l'app bategua
                // En el futur, ací aniria la lògica del protocol HyParView
                setStatus('offline');
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    const getStatusConfig = () => {
        switch (status) {
            case 'online':
                return {
                    icon: <Zap size={18} fill="currentColor" />,
                    label: 'Tot connectat. Vola!',
                    agent: 'Super Ratolí',
                    class: 'status-ok'
                };
            case 'mesh':
                return {
                    icon: <Users size={18} />,
                    label: 'Sincronitzant amb el veí',
                    agent: 'Vicent & Pepica',
                    class: 'status-mesh'
                };
            case 'offline':
                return {
                    icon: <HardDrive size={18} />,
                    label: 'Tot guardat al mòbil',
                    agent: 'Nano Banana',
                    class: 'status-offline'
                };
            default:
                return {
                    icon: <Info size={18} />,
                    label: 'Batec desconegut',
                    agent: 'IAIA',
                    class: 'status-unknown'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`batec-monitor-wrapper ${config.class}`}>
            <div className="batec-indicator">
                <div className="batec-icon-circle">
                    {config.icon}
                </div>
                <div className="batec-info">
                    <span className="batec-agent">{config.agent}</span>
                    <span className="batec-label">{config.label}</span>
                </div>
            </div>
            <div className="batec-pulse-ring"></div>
        </div>
    );
};

export default BatecMonitor;
