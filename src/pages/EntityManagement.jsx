import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Building2, Store, Users, ArrowLeft, Plus, ChevronRight, Layout, Shield } from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import './EntityManagement.css';
import { logger } from '../utils/logger';

const EntityManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEntities = async () => {
            try {
                setIsLoading(true);
                const data = await supabaseService.getUserEntities(user.id);
                setEntities(data || []);
            } catch (error) {
                logger.error('Error loading entities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadEntities();
        }
    }, [user]);

    if (isLoading) return <StatusLoader type="loading" />;

    return (
        <div className="entity-mgmt-page">
            <header className="entity-mgmt-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Gestió d'Entitats</h1>
                <p>Crea i administra el teu impacte al poble</p>
            </header>

            <div className="entity-mgmt-content">
                <section className="creation-section">
                    <h3>Crea una nova pàgina</h3>
                    <div className="creation-grid">
                        <button className="create-card" onClick={() => alert('Pròximament: Creació de Grups')}>
                            <div className="create-icon groups">
                                <Users size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Grup Social</strong>
                                <span>Associacions, penyes, colles...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>

                        <button className="create-card" onClick={() => alert('Pròximament: Creació d\'Empreses')}>
                            <div className="create-icon business">
                                <Store size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Empresa o Comerç</strong>
                                <span>Autònoms, tendes, serveis...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>

                        <button className="create-card" onClick={() => alert('Pròximament: Creació d\'Entitats')}>
                            <div className="create-icon official">
                                <Shield size={32} />
                            </div>
                            <div className="create-info">
                                <strong>Entitat Oficial</strong>
                                <span>Ajuntaments, fundacions...</span>
                            </div>
                            <Plus size={20} className="plus-icon" />
                        </button>
                    </div>
                </section>

                <section className="my-entities-section">
                    <h3>Les teves pàgines ({entities.length})</h3>
                    {entities.length === 0 ? (
                        <div className="empty-entities">
                            <Layout size={48} opacity={0.3} />
                            <p>Encara no gestioneu cap entitat.</p>
                            <p className="sub">Comenceu creant-ne una a dalt!</p>
                        </div>
                    ) : (
                        <div className="entities-list">
                            {entities.map(entity => (
                                <Link to={`/entitat/${entity.id}`} key={entity.id} className="managed-entity-item">
                                    <div className={`entity-avatar-mini ${entity.type}`}>
                                        {entity.avatar_url ? (
                                            <img src={entity.avatar_url} alt={entity.name} />
                                        ) : (
                                            entity.type === 'empresa' ? <Store size={20} /> :
                                                entity.type === 'grup' ? <Users size={20} /> : <Shield size={20} />
                                        )}
                                    </div>
                                    <div className="entity-detail">
                                        <strong>{entity.name}</strong>
                                        <span>{entity.member_role} • {entity.type}</span>
                                    </div>
                                    <ChevronRight size={20} className="chevron" />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EntityManagement;
