import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, LogOut, Terminal } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import './PlaygroundBanner.css';

const PlaygroundBanner = () => {
    const { isPlayground, isAdmin, profile, forceNukeSimulation, exitPlayground } = useAuth();
    const navigate = useNavigate();

    if (!isPlayground || isAdmin) return null;

    return (
        <div className="playground-banner">
            <div className="banner-content">
                <div className="banner-left">
                    <div className="banner-text-stack">
                        <span className="banner-label">PROVANT • ESTÀS PILOTANT A:</span>
                        <span className="banner-persona-name">{profile?.full_name}</span>
                    </div>
                </div>
                <div className="banner-actions">
                    <button className="banner-btn" onClick={() => navigate('/playground')}>
                        Canviar personatge
                    </button>
                    <button className="banner-btn exit" onClick={async () => {
                        const confirmExit = window.confirm("Segur que vols tornar al món real (Producció)?");
                        if (confirmExit) {
                            await exitPlayground();
                        }
                    }}>
                        TORNAR A PRODUCCIÓ <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaygroundBanner;
