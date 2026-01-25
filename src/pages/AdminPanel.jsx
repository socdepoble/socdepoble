import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Users, Shield, ArrowLeft, Loader2, UserCheck, Store, Plus, Layout, Settings } from 'lucide-react';
import { logger } from '../utils/logger';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { isSuperAdmin, isAdmin, setImpersonatedProfile, setActiveEntityId } = useAuth();
    const [personas, setPersonas] = useState([]);
    const [entities, setEntities] = useState([]);
    const [lexicon, setLexicon] = useState([]);
    const [loading, setLoading] = useState(true);

    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || 'gent';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [pData, eData, lData] = await Promise.all([
                    supabaseService.getAllPersonas(),
                    supabaseService.getAdminEntities(),
                    supabaseService.getLexiconTerms()
                ]);
                setPersonas(pData || []);
                setEntities(eData || []);
                setLexicon(lData || []);
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

    // Dashboard Mode vs Module Mode
    const [subModule, setSubModule] = useState(null); // null = Dashboard, 'identities', 'lexicon', 'stats', 'proposals'

    // Return to dashboard handler
    const goHome = () => {
        setSubModule(null);
        setActiveTab('gent'); // Reset identities tab default
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <Loader2 className="spinner" />
                <p>Carregant sistema de control...</p>
            </div>
        );
    }

    // MAIN DASHBOARD VIEW
    if (!subModule) {
        return (
            <div className="admin-container">
                <header className="admin-header">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="title-area">
                        <h1><Shield size={24} /> PANELL DE CONTROL</h1>
                        <p>Benvingut, {isSuperAdmin ? 'Super Admin' : 'Administrador'}</p>
                    </div>
                </header>

                <div className="admin-content dashboard-grid">
                    <div className="dashboard-card" onClick={() => setSubModule('identities')}>
                        <div className="dash-icon blue"><Users size={32} /></div>
                        <h3>Gestió d'Identitats</h3>
                        <p>Control de veïns, grups, empreses i entitats.</p>
                        <span className="dash-badge">{personas.length + entities.length} actius</span>
                    </div>

                    <div className="dashboard-card purple" onClick={() => setSubModule('lexicon')}>
                        <div className="dash-icon purple"><Layout size={32} /></div>
                        <h3>Diccionari Local</h3>
                        <p>Gestió del lèxic i paraules clau del poble.</p>
                        <span className="dash-badge">{lexicon.length} termes</span>
                    </div>

                    <div className="dashboard-card green" onClick={() => setSubModule('proposals')}>
                        <div className="dash-icon green"><Settings size={32} /></div>
                        <h3>Bústia de Propostes</h3>
                        <p>Noves funcionalitats i suggeriments.</p>
                        <span className="dash-badge">Futur</span>
                    </div>

                    <div className="dashboard-card orange" onClick={() => alert('Pròximament: Estadístiques detallades')}>
                        <div className="dash-icon orange"><Store size={32} /></div>
                        <h3>Estadístiques</h3>
                        <p>Mètriques d'ús i activitat de la xarxa.</p>
                        <span className="dash-badge">En construcció</span>
                    </div>
                </div>
            </div>
        );
    }

    const groups = entities.filter(e => e.type === 'grup');
    const businesses = entities.filter(e => e.type === 'empresa');
    const officials = entities.filter(e => e.type === 'entitat');

    // SUB-MODULE VIEWS
    return (
        <div className="admin-container">
            <header className="admin-header">
                <button onClick={goHome} className="back-btn">
                    <ArrowLeft size={24} />
                </button>
                <div className="title-area">
                    <h1>
                        {subModule === 'identities' && 'Gestió d\'Identitats'}
                        {subModule === 'lexicon' && 'Diccionari Local'}
                        {subModule === 'proposals' && 'Propostes'}
                    </h1>
                    <p>Panell de Control &gt; {subModule}</p>
                </div>
            </header>

            {/* IDENTITY MANAGEMENT MODULE */}
            {subModule === 'identities' && (
                <>
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
                                        {isSuperAdmin && (
                                            <button className="impersonate-btn" onClick={() => handleImpersonate(p, 'user')}>
                                                ACTUAR COM
                                            </button>
                                        )}
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
                </>
            )}

            {/* LEXICON MODULE */}
            {subModule === 'lexicon' && (
                <div className="admin-content">
                    <div className="lexicon-admin">
                        <div className="admin-section-header">
                            <h3>Gestió del Lèxic Local</h3>
                            <button className="add-btn" onClick={() => alert('Pròximament: Afegir terme')}>
                                <Plus size={16} /> Nou Terme
                            </button>
                        </div>
                        <div className="lexicon-grid">
                            {lexicon.length === 0 && <p className="empty-msg">No hi ha termes al lèxic.</p>}
                            {lexicon.map(term => (
                                <div key={term.id} className="lexicon-item-card">
                                    <div className="term-main">
                                        <span className="term-word">{term.term}</span>
                                        <span className="term-town">{term.towns?.name || 'Comú'}</span>
                                    </div>
                                    <p className="term-def">{term.definition}</p>
                                    <div className="term-footer">
                                        <span className="term-cat">{term.category || 'General'}</span>
                                        <div className="term-actions">
                                            <button className="icon-btn"><Settings size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PROPOSALS MODULE */}
            {subModule === 'proposals' && (
                <div className="admin-content">
                    <div className="proposals-section text-center p-8 bg-white/50 rounded-xl">
                        <div className="empty-state-icon text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold mb-2">Bústia de Noves Implementacions</h3>
                        <p className="text-gray-600 mb-6">Aquest espai està reservat per al futur. Ací podrem gestionar les noves idees que vagen sorgint.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h4 className="font-bold flex items-center gap-2">🛒 E-Commerce Local</h4>
                                <p className="text-sm text-gray-500 mt-1">Gestió centralitzada de comandes per a botigues.</p>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded mt-2 inline-block">Pendent</span>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h4 className="font-bold flex items-center gap-2">📢 Ban Municipal 2.0</h4>
                                <p className="text-sm text-gray-500 mt-1">Sistema d'alertes via WhatsApp/Push per ajuntaments.</p>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded mt-2 inline-block">Pendent</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
