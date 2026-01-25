import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Users, Store, MessageSquare, MapPin, Database, RefreshCw } from 'lucide-react';
import './LiveStats.css';

const LiveStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await supabaseService.getPublicStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh every 30s to feel "live"
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="live-stats-loading"><RefreshCw className="animate-spin" size={24} /></div>;

    return (
        <div className="live-stats-container">
            <div className="live-stats-header">
                <h3><Database size={18} /> Transparència de Dades</h3>
                <span className="live-badge">EN VIU</span>
            </div>

            <div className="stats-grid-dashboard">
                <div className="stat-card blue">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.users}</span>
                        <span className="stat-label">Veïns Reals</span>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><Store size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.entities}</span>
                        <span className="stat-label">Entitats/Grups</span>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon"><MessageSquare size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.posts}</span>
                        <span className="stat-label">Interaccions</span>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon"><MapPin size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.towns}</span>
                        <span className="stat-label">Pobles Actius</span>
                    </div>
                </div>
            </div>

            <p className="stats-footer-note">
                Dades actualitzades directament des de la base de dades PostgreSQL (Supabase).
            </p>
        </div>
    );
};

export default LiveStats;
