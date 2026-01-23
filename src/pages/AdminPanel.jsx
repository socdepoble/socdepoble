import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import { Users, Shield, ArrowLeft, Loader2, UserCheck, Store } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { isSuperAdmin, setImpersonatedProfile, setActiveEntityId } = useAppContext();
    const [personas, setPersonas] = useState([]);
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('gent');

    useEffect(() => {
        if (!isSuperAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [pData, eData] = await Promise.all([
                    supabaseService.getAllPersonas(),
                    supabaseService.getAdminEntities()
                ]);
                setPersonas(pData || []);
                setEntities(eData || []);
            } catch (error) {
                logger.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isSuperAdmin, navigate]);

    const handleImpersonate = (item, type = 'user') => {
        if (type === 'user') {
            setImpersonatedProfile(item);
            setActiveEntityId(null);
            alert(`Ara estàs actuant com a: ${item.full_name}`);
        } else {
            setImpersonatedProfile(null);
            setActiveEntityId(item.id);
            alert(`Ara estàs gestionant l'entitat: ${item.name}`);
        }
        navigate('/');
    };

    const renderAvatar = (url, name) => {
        if (!url) return <div className="avatar-placeholder">{name?.charAt(0)}</div>;
        if (url.length < 5) return <span className="emoji-avatar">{url}</span>;
        return <img src={url} alt={name} className="avatar-img" />;
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <Loader2 className="spinner" />
                <p>Carregant sistema de control...</p>
            </div>
        );
    }

    const groups = entities.filter(e => e.type === 'grup');
    const businesses = entities.filter(e => e.type === 'empresa');
    const officials = entities.filter(e => e.type === 'entitat');

    return (
        <div className="admin-container">
            <header className="admin-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <div className="title-area">
                    <h1><Shield size={24} /> PANELL DE CONTROL</h1>
                    <p>Gestió d'ecosistema i identitats</p>
                </div>
            </header>

            <nav className="admin-tabs">
                <button className={activeTab === 'gent' ? 'active' : ''} onClick={() => setActiveTab('gent')}>
                    <Users size={18} /> Gent ({personas.length})
                </button>
                <button className={activeTab === 'grups' ? 'active' : ''} onClick={() => setActiveTab('grups')}>
                    <Users size={18} /> Grups ({groups.length})
                </button>
                <button className={activeTab === 'empreses' ? 'active' : ''} onClick={() => setActiveTab('empreses')}>
                    <Store size={18} /> Empreses ({businesses.length})
                </button>
                <button className={activeTab === 'entitats' ? 'active' : ''} onClick={() => setActiveTab('entitats')}>
                    <Shield size={18} /> Entitats ({officials.length})
                </button>
            </nav>

            <div className="admin-content">
                {activeTab === 'gent' && (
                    <div className="persona-grid">
                        {personas.length === 0 && <p className="empty-msg">No s'han trobat persones.</p>}
                        {personas.map(p => (
                            <div key={p.id} className="persona-card">
                                <div className="persona-avatar">{renderAvatar(p.avatar_url, p.full_name)}</div>
                                <div className="persona-info">
                                    <h3>{p.full_name}</h3>
                                    <p>@{p.username}</p>
                                    <span className="location-tag">{p.role === 'vei' ? 'Veí' : p.role}</span>
                                </div>
                                <button className="impersonate-btn" onClick={() => handleImpersonate(p, 'user')}>
                                    ACTUAR COM
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'grups' && (
                    <div className="entity-grid">
                        {groups.length === 0 && <p className="empty-msg">No s'han trobat grups.</p>}
                        {groups.map(e => (
                            <div key={e.id} className="persona-card entity">
                                <div className="persona-avatar">{renderAvatar(e.avatar_url, e.name)}</div>
                                <div className="persona-info">
                                    <h3>{e.name}</h3>
                                    <p>{e.description || 'Grup social/cultural'}</p>
                                </div>
                                <button className="impersonate-btn" onClick={() => handleImpersonate(e, 'entity')}>
                                    GESTIONAR
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'empreses' && (
                    <div className="entity-grid">
                        {businesses.length === 0 && <p className="empty-msg">No s'han trobat empreses.</p>}
                        {businesses.map(e => (
                            <div key={e.id} className="persona-card entity work">
                                <div className="persona-avatar">{renderAvatar(e.avatar_url, e.name)}</div>
                                <div className="persona-info">
                                    <h3>{e.name}</h3>
                                    <p>{e.description || 'Comerç local / Empresa'}</p>
                                </div>
                                <button className="impersonate-btn" onClick={() => handleImpersonate(e, 'entity')}>
                                    GESTIONAR
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'entitats' && (
                    <div className="entity-grid">
                        {officials.length === 0 && <p className="empty-msg">No s'han trobat entitats.</p>}
                        {officials.map(e => (
                            <div key={e.id} className="persona-card entity official">
                                <div className="persona-avatar">{renderAvatar(e.avatar_url, e.name)}</div>
                                <div className="persona-info">
                                    <h3>{e.name}</h3>
                                    <p>{e.description || 'Entitat institucional'}</p>
                                </div>
                                <button className="impersonate-btn" onClick={() => handleImpersonate(e, 'entity')}>
                                    GESTIONAR
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
