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
            id: 'AGRONOM',
            name: 'Vicent Ferris',
            role: 'L\'Agrònom Virtual',
            desc: 'Diagnòstic i consells de cultiu IVIA amb humor d\'Ibañez.',
            icon: <Zap size={24} />,
            color: '#4CAF50'
        },
        {
            id: 'CUINERA',
            name: 'Pepica la Vall',
            role: 'Cuina d\'Aprofitament',
            desc: 'Receptes tradicionals i gestió d\'excedents amb fúria creativa.',
            icon: <Zap size={24} />,
            color: '#FF9800'
        },
        {
            id: 'CAPATAS',
            name: 'Andreu Soler',
            role: 'El Jove del Camp',
            desc: 'Planificació de feines del camp amb trellat extrem.',
            icon: <Zap size={24} />,
            color: '#795548'
        },
        {
            id: 'ARXIVER',
            name: 'Joan Batiste',
            role: 'L\'Arxiver Pagès',
            desc: 'La collita ve bona enguany. Traductor de burocràcia.',
            icon: <Zap size={24} />,
            color: '#607D8B'
        },
        {
            id: 'RATOLI',
            name: 'Super Ratolí',
            role: 'Guardià SQLite',
            desc: 'No olviden vitaminarse! Registra logs i memòria offline.',
            icon: <Sparkles size={24} />,
            color: '#FFEB3B'
        },
        {
            id: 'SULTAN',
            name: 'Sultan',
            role: 'Protector DID',
            desc: 'Gos d\'atura que vigila la identitat i seguretat.',
            icon: <Sparkles size={24} />,
            color: '#9E9E9E'
        },
        {
            id: 'MIXA',
            name: 'La Mixa',
            role: 'Exploradora P2P',
            desc: 'Miau! (Vull pernil). Gata misteriosa de la xarxa.',
            icon: <Sparkles size={24} />,
            color: '#E91E63'
        },
        {
            id: 'GALL',
            name: 'El Gall',
            role: 'Pregoner d\'Alertes',
            desc: 'Kikirikí! Bon dia a tothom! Desperta el sistema.',
            icon: <Sparkles size={24} />,
            color: '#F44336'
        },
        {
            id: 'NANOBANANA',
            name: 'Nano Banana',
            role: 'Mestre Estètic',
            desc: 'Tinc els nous dissenys llestos. Bategat de colors.',
            icon: <Zap size={24} />,
            color: '#FFC107'
        },
        {
            id: 'FLASH',
            name: 'Flash',
            role: 'Executor ràpid',
            desc: 'Sistema actualitzat a v9.5.0. Velocitat <0.2s.',
            icon: <Zap size={24} />,
            color: '#03A9F4'
        },
        {
            id: 'VIATJANT',
            name: 'El Viatjant',
            role: 'Turisme i Bota',
            desc: 'Ruta de senderisme confirmada. Connexió exterior.',
            icon: <Zap size={24} />,
            color: '#673AB7'
        },
        {
            id: 'BEATRIZ',
            name: 'Beatriz Ortega',
            role: 'La Mestra',
            desc: 'Reunió escolar a les 17h. Educació i comunitat.',
            icon: <Sparkles size={24} />,
            color: '#9C27B0'
        },
        {
            id: 'CARLA',
            name: 'Carla Soriano',
            role: 'La Doctora',
            desc: 'Campanya de vacunació activa. Salut i benestar.',
            icon: <Sparkles size={24} />,
            color: '#2196F3'
        },
        {
            id: 'ELENA',
            name: 'Elena Popova',
            role: 'La Músic',
            desc: 'Assaig de la banda suspès. Cultura i música.',
            icon: <Sparkles size={24} />,
            color: '#E91E63'
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
