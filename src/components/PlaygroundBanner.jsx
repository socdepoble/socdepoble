import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, LogOut, Terminal } from 'lucide-react';
import './PlaygroundBanner.css';

const PlaygroundBanner = () => {
    const { isPlayground, profile, logout } = useAuth();
    const navigate = useNavigate();

    if (!isPlayground) return null;

    return (
        <div className="playground-banner">
            <div className="banner-content">
                <div className="banner-left">
                    <div className="banner-pulse" aria-hidden="true" />
                    <div className="banner-text-stack">
                        <span className="banner-label">PROVANT • ESTÀS PILOTANT A:</span>
                        <span className="banner-persona-name">{profile?.full_name}</span>
                    </div>
                </div>
                <div className="banner-actions">
                    <button className="banner-btn" onClick={() => navigate('/playground')}>
                        Canviar personatge
                    </button>
                    <button className="banner-btn exit" onClick={() => {
                        logout();
                        navigate('/login');
                    }}>
                        Sortir <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaygroundBanner;
