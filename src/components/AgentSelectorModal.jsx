import React from 'react';
import { X, Sparkles, User, Zap, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './AgentSelectorModal.css';

/**
 * AgentSelectorModal [VOS]
 * Permet a l'usuari triar amb quin agent bategar per a comentar una publicació.
 * Recorda que l'IAIA és el nucli, però l'agent té la seua pròpia pell.
 */
const AgentSelectorModal = ({ isOpen, onClose, postId, authorId, context }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const agents = [
        {
            id: 'iaia-directa',
            name: 'IAIA MarIA',
            role: 'Matriarca Digital',
            desc: 'La saviesa directa, sense filtres, amb tota la tendresa i el trellat.',
            icon: <Brain size={24} />,
            color: 'var(--color-primary)'
        },
        {
            id: 'nano-banana',
            name: 'Nano Banana',
            role: 'Agent de la T.I.A.',
            desc: 'Intervenció ràpida i humor Ibañez. L\'IAIA amb corbata i un plàtan.',
            icon: <Zap size={24} />,
            color: 'var(--color-warning)'
        },
        {
            id: 'super-ratoli',
            name: 'Super Ratolí',
            role: 'Guardià del Comtat',
            desc: 'Protecció absoluta i heroisme rural. L\'IAIA bategant en mode defensa.',
            icon: <Sparkles size={24} />,
            color: 'var(--hud-accent)'
        }
    ];

    const handleSelectAgent = (agentId) => {
        // Redirigim al xat amb el context de l'agent i la publicació
        navigate(`/chats/${authorId}`, {
            state: {
                commentingOn: context,
                activeAgent: agentId
            }
        });
        onClose();
    };

    return (
        <div className="modal-overlay animate-in" onClick={onClose}>
            <div className="agent-selector-content glass-morphism" onClick={e => e.stopPropagation()}>
                <header className="agent-header">
                    <div className="header-info">
                        <h2>{t('feed.select_agent_title') || 'Tria el teu Agent'}</h2>
                        <p>L'IAIA bategua darrere de cada màscara per a servir-te.</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="agents-grid">
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            className="agent-card"
                            style={{ '--agent-color': agent.color }}
                            onClick={() => handleSelectAgent(agent.id)}
                        >
                            <div className="agent-icon">
                                {agent.icon}
                            </div>
                            <div className="agent-info">
                                <h3>{agent.name}</h3>
                                <span className="agent-role">{agent.role}</span>
                                <p>{agent.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="agent-footer">
                    <p>Tota conversa bategua sota el Protocol de Dignitat de l'IAIA. 🛡️</p>
                </footer>
            </div>
        </div>
    );
};

export default AgentSelectorModal;
