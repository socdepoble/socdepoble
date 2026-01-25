import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ArrowLeft, Loader2, UserPlus, ChevronRight, User } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import StatusLoader from '../components/StatusLoader';
import Avatar from '../components/Avatar';
import { logger } from '../utils/logger';
import './CommunityDirectory.css';

const CommunityDirectory = () => {
    const navigate = useNavigate();
    const [directory, setDirectory] = useState({ people: [], entities: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('gent'); // gent, entitats

    useEffect(() => {
        loadDirectory();
    }, []);

    const loadDirectory = async () => {
        try {
            setIsLoading(true);
            const data = await supabaseService.getPublicDirectory();
            setDirectory(data);
        } catch (error) {
            logger.error('Error loading directory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <StatusLoader type="loading" />;

    const items = activeTab === 'gent' ? directory.people : directory.entities;

    return (
        <div className="directory-page">
            <header className="directory-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Comunitat</h1>
                <p>Connexions que fan poble</p>

                <div className="directory-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'gent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gent')}
                    >
                        <Users size={18} />
                        Gent ({directory.people.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'entitats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('entitats')}
                    >
                        <Building2 size={18} />
                        Entitats ({directory.entities.length})
                    </button>
                </div>
            </header>

            <div className="directory-content">
                <div className="directory-grid">
                    {items.length === 0 ? (
                        <div className="empty-directory">
                            <Users size={48} opacity={0.3} />
                            <p>No s'han trobat resultats en aquesta categoria.</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div
                                key={item.id}
                                className="directory-card"
                                onClick={() => navigate(activeTab === 'gent' ? `/perfil/${item.id}` : `/entitat/${item.id}`)}
                            >
                                <Avatar
                                    src={item.avatar_url}
                                    role={activeTab === 'gent' ? 'user' : item.type}
                                    name={item.full_name || item.name}
                                    size={60}
                                />
                                <div className="card-info">
                                    <h3>{item.full_name || item.name}</h3>
                                    <p>{item.role || item.type} • {item.town_name || item.primary_town}</p>
                                    <span className="bio-mini">{item.bio || item.description || 'Sense descripció'}</span>
                                </div>
                                <div className="card-action">
                                    <button className="connect-btn-mini" onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(activeTab === 'gent' ? `/perfil/${item.id}` : `/entitat/${item.id}`);
                                    }}>
                                        CONECTAR
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityDirectory;
