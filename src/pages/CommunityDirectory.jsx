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
        <div className="directory-page bg-black min-h-screen">
            {/* Header Master Blindat v9.4.0 */}
            <header className="h-16 flex items-center px-4 bg-black border-b border-gray-800 sticky top-0 z-30">
                <button className="text-white mr-4" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest m-0">Comunitat</h1>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter m-0">Connexions que fan poble</p>
                </div>
            </header>

            <div className="px-4 py-4 bg-black border-b border-gray-800">
                <div className="flex gap-2">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all
                            ${activeTab === 'gent' ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
                        onClick={() => setActiveTab('gent')}
                    >
                        <Users size={16} />
                        Gent ({directory.people.length})
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all
                            ${activeTab === 'entitats' ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
                        onClick={() => setActiveTab('entitats')}
                    >
                        <Building2 size={16} />
                        Entitats ({directory.entities.length})
                    </button>
                </div>
            </div>

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
