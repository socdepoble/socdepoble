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
                    <span className="banner-text">
                        <strong>PROVANT:</strong> Estàs pilotant a <em>{profile?.full_name}</em>
                    </span>
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
