import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { supabaseService } from '../../core/services/supabaseService';
import { logger } from '../../utils/logger';
import './PlaygroundPortal.css';

const PlaygroundPortal = () => {
    const navigate = useNavigate();
    const { adoptPersona } = useAuth();
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPersonas = async () => {
            try {
                const data = await supabaseService.getAllPersonas(); // Existing method that fetches profiles where is_demo = true
                setPersonas(data);
            } catch (error) {
                logger.error('[PlaygroundPortal] Error loading personas:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPersonas();
    }, []);

    const handleSelectPersona = (persona) => {
        adoptPersona(persona);
        navigate('/chats'); // Redirect to Chat in playground mode
    };

    if (loading) return <div className="portal-loading">Carregant personatges...</div>;

    return (
        <div className="playground-portal">
            <div role="region" aria-label="Capçalera de Secció" className="portal-header">
                <img src="/logo.png" alt="Sóc de Poble" className="portal-logo-large" />
                <h1 className="portal-title">Playground</h1>
                <p className="portal-description">
                    Tria una identitat per entrar al simulador interactiu<br />
                    Tot el que faces aquí és efímer i compartit amb altres "jugadors"
                </p>
                <div className="ai-notice-simple">
                    <div className="ai-notice-text">
                        <span>Interacciona amb la nostra IAIA de Poble</span>
                    </div>
                </div>
                <div className="portal-actions">
                    <button className="portal-back-btn-primary" onClick={() => navigate('/login')}>
                        <ArrowLeft size={18} />
                        <span>Tornar a l'Inici</span>
                    </button>
                </div>
            </div>

            <div className="persona-list-container">
                {personas.map(persona => (
                    <div key={persona.id} className="persona-list-item" onClick={() => handleSelectPersona(persona)}>
                        <div className="persona-list-avatar">
                            {persona.avatar_url ? (
                                <img src={persona.avatar_url} alt={persona.full_name} className="persona-list-img" />
                            ) : (
                                <div className="persona-list-placeholder">
                                    <User size={24} />
                                </div>
                            )}
                        </div>

                        <div className="persona-list-content">
                            <div className="persona-list-header">
                                <h3 className="persona-list-name">{persona.full_name}</h3>
                                {persona.primary_town && (
                                    <span className="persona-list-town">{persona.primary_town}</span>
                                )}
                            </div>
                            <div className="persona-list-bottom">
                                <p className="persona-list-bio-full">
                                    {persona.bio || "Foraster de Sóc de Poble disposat a provar el sistema."}
                                </p>
                            </div>
                        </div>

                        <div className="persona-list-action">
                            <button className="btn-enter-mini">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="portal-footer">
                <p>Estàs a punt d'entrar en un espai de proves. Recorda que les dades són compartides entre tots els que estan a la Demo.</p>
            </footer>
        </div>
    );
};

export default PlaygroundPortal;
