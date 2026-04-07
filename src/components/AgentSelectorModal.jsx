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
const AgentSelectorModal = ({ isOpen, onClose, authorId, context }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const agents = [
        {
            id: 'iaia-directa',
            name: 'IAIA MarIA',
            role: 'Governança Rural Digital',
            scope: 'MASTER',
            desc: 'La saviesa directa, sense filtres, coordinant els especialistes.',
            icon: <Brain size={24} />,
            color: 'var(--color-primary)'
        },
        {
            id: 'AGRONOM',
            id_real: '11111111-1111-4111-a111-000000000003',
            name: 'Vicent Ferris',
            role: 'Enginyer del Camp',
            scope: 'AGRICULTURA',
            desc: 'Especialista en cultius mediterranis, reg i sèquies.',
            icon: <Zap size={24} />,
            color: '#4CAF50'
        },
        {
            id: 'CUINERA',
            id_real: '11111111-1111-4111-a111-000000000004',
            name: 'Pepica la Vall',
            role: 'Sobirania Alimentària',
            scope: 'CULTURA',
            desc: 'Receptes tradicionals, aprofitament i excedents.',
            icon: <Zap size={24} />,
            color: '#FF9800'
        },
        {
            id: 'CAPATAS',
            id_real: '11111111-1111-4111-a111-000000000009',
            name: 'Andreu Soler',
            role: 'Gestor de Projectes i Obres',
            scope: 'GESTIÓ',
            desc: 'Planificació de feines, manteniment i obres rurals.',
            icon: <Zap size={24} />,
            color: '#795548'
        },
        {
            id: 'ARXIVER',
            id_real: '11111111-1111-4111-a111-000000000008',
            name: 'Joan Batiste',
            role: 'Secretari Notarial',
            scope: 'GESTIÓ',
            desc: 'Traductor de burocràcia, ajudes de la PAC i bancs.',
            icon: <Zap size={24} />,
            color: '#607D8B'
        },
        {
            id: 'RATOLI',
            id_real: '11111111-0000-0000-0000-000000000001',
            name: 'Super Ratolí',
            role: 'Arxiver Digital (SQLite)',
            scope: 'TECNOLOGIA',
            desc: 'Guardià de les dades locals i la memòria offline.',
            icon: <Sparkles size={24} />,
            color: '#FFEB3B'
        },
        {
            id: 'SULTAN',
            id_real: '11111111-1111-4111-a111-000000000006',
            name: 'Sultan',
            role: 'Seguretat i Identitat (DID)',
            scope: 'TECNOLOGIA',
            desc: 'Protector de claus, privacitat i identitat sobirana.',
            icon: <Sparkles size={24} />,
            color: '#9E9E9E'
        },
        {
            id: 'MIXA',
            id_real: '11111111-1a1a-0001-0000-000000000011',
            name: 'La Mixa',
            role: 'Xarxa i Sincronització (P2P)',
            scope: 'TECNOLOGIA',
            desc: 'Exploradora de nodes descentralitzats i dades àgils.',
            icon: <Sparkles size={24} />,
            color: '#E91E63'
        },
        {
            id: 'GALL',
            id_real: '11111111-1a1a-0001-0000-000000000012',
            name: 'El Gall',
            role: 'Comunicació i Alertes',
            scope: 'GESTIÓ',
            desc: 'Pregoner digital per a avisos oficials i meteorologia.',
            icon: <Sparkles size={24} />,
            color: '#F44336'
        },
        {
            id: 'NANOBANANA',
            id_real: '11111111-1111-4111-a111-000000000007',
            name: 'Nano Banana',
            role: 'Mestre d\'Estètica i Disseny',
            scope: 'CULTURA',
            desc: 'Artista visual, generació d\'imatges i abundància.',
            icon: <Zap size={24} />,
            color: '#FFC107'
        },
        {
            id: 'FLASH',
            name: 'Flash',
            role: 'Orquestrador de Velocitat',
            scope: 'TECNOLOGIA',
            desc: 'Executor de processos a temps real (<0.2s).',
            icon: <Zap size={24} />,
            color: '#03A9F4'
        },
        {
            id: 'VIATJANT',
            id_real: '11111111-1111-4111-a111-000000000013',
            name: 'El Viatjant',
            role: 'Relacions Inter-municipals',
            scope: 'CULTURA',
            desc: 'Ambaixador del poble i connexió amb l\'exterior.',
            icon: <Zap size={24} />,
            color: '#673AB7'
        },
        {
            id: 'BEATRIZ',
            id_real: '11111111-1111-4111-a111-000000000014',
            name: 'Beatriz Ortega',
            role: 'Dinamitzadora Educativa',
            scope: 'CULTURA',
            desc: 'Gestió escolar, oci juvenil i formació d\'adults.',
            icon: <Sparkles size={24} />,
            color: '#9C27B0'
        },
        {
            id: 'CARLA',
            id_real: '11111111-1111-4111-a111-000000000015',
            name: 'Carla Soriano',
            role: 'Benestar i Sanitat Rural',
            scope: 'GESTIÓ',
            desc: 'Consells de salut, campanyes i prevenció sanitària.',
            icon: <Sparkles size={24} />,
            color: '#2196F3'
        },
        {
            id: 'ELENA',
            id_real: '11111111-1111-4111-a111-000000000016',
            name: 'Elena Popova',
            role: 'Patrimoni i Festes Locals',
            scope: 'CULTURA',
            desc: 'Coordinació de la Banda, festes i memòria cultural.',
            icon: <Sparkles size={24} />,
            color: '#E91E63'
        }
    ];

    const handleSelectAgent = (agentId) => {
        const agent = agents.find(a => a.id === agentId);
        const targetId = agent.id_real || authorId;

        // Redirigim al xat amb el context de l'agent i la publicació
        navigate(`/chats/${targetId}`, {
            state: {
                commentingOn: context,
                activeAgent: agentId,
                chatInfo: {
                    id: targetId,
                    other_info: {
                        id: targetId,
                        name: agent.name,
                        avatar_url: agent.avatar_url || (agent.id === 'iaia-directa' ? '/assets/avatars/iaia_comic_matriarch.png' : ''),
                        role: agent.role,
                        scope: agent.scope
                    }
                }
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
