import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Sparkles, ArrowLeft, Check, User, Zap, MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { AGENTS, IAIA_MARIA_ID } from '../constants/agents';
import './VisionView.css';

const VisionView = () => {
    const navigate = useNavigate();
    const { 
        visionMode, setIaiaLevel, 
        enabledAgentIds, toggleAgent 
    } = useUI();

    const MODES = [
        {
            id: 'humana',
            level: 0,
            title: 'Nivell 0 (Humà)',
            desc: "Identitat sobirana. Sense IA. Només bategues amb la teua gent.",
            icon: User
        },
        {
            id: 'iaia',
            level: 1,
            title: 'Nivell 1 (Assistent)',
            desc: "Utilitat pura amb la IAIA MarIA. Gestió digital del poble.",
            icon: Zap
        },
        {
            id: 'immersiva',
            level: 2,
            title: 'Nivell 2 (Immersiu)',
            desc: "Tria la teua colla d'agents per al mur i el xat.",
            icon: Sparkles
        },
        {
            id: 'creativa',
            level: 3,
            title: 'Nivell 3 (Creatiu)',
            desc: "Univers total. Tots els agents bategant a l'uníson.",
            icon: Brain
        }
    ];

    return (
        <div className="vision-page-container">
            <header className="vision-page-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={32} />
                </button>
                <div className="vision-page-title">
                    <Shield size={32} color="#F97316" />
                    <h1>Selector de Realitat</h1>
                </div>
                <div style={{ width: 44, opacity: 0 }} />
            </header>

            <main className="vision-page-content">
                <p className="vision-page-intro">Com vols bategar avui al poble?</p>
                
                <div className="vision-modes-grid">
                    {MODES.map(m => (
                        <div key={m.id}>
                            <div 
                                className={`vision-mode-card ${visionMode === m.id ? 'active' : ''}`}
                                onClick={() => setIaiaLevel(m.level)}
                            >
                                <div className="vision-icon-wrapper">
                                    <m.icon size={36} />
                                </div>
                                <div className="vision-card-content">
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                                <div className="vision-status-dot" />
                            </div>

                            {/* [PROTOCOL V4.2] SELECCIÓ GRANULAR (CHAT EMBED) */}
                            {m.id === 'immersiva' && visionMode === 'immersiva' && (
                                <div className="chat-embed-container animate-in-up">
                                    <div className="chat-embed-header">
                                        <MessageSquare size={18} color="#F97316" />
                                        <span>Selecció d'Acompanyants</span>
                                    </div>
                                    <div className="chat-embed-list">
                                        {AGENTS.map(agent => {
                                            const isActive = enabledAgentIds.includes(agent.id);
                                            return (
                                                <div 
                                                    key={agent.id} 
                                                    className={`chat-embed-agent-row ${isActive ? 'active' : ''}`}
                                                    onClick={() => toggleAgent(agent.id)}
                                                >
                                                    <div className="chat-embed-avatar">
                                                        <img src={agent.avatar_url} alt={agent.name} />
                                                    </div>
                                                    <div className="chat-embed-info">
                                                        <span className="chat-embed-name">{agent.name}</span>
                                                        <span className="chat-embed-role">{agent.role}</span>
                                                    </div>
                                                    <div className="chat-embed-toggle">
                                                        {isActive && <Check size={16} strokeWidth={4} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                             {/* [PROTOCOL V4.2] LEVEL 1: IAIA ONLY DISPLAY */}
                             {m.id === 'iaia' && visionMode === 'iaia' && (
                                <div className="chat-embed-container animate-in-up">
                                    <div className="chat-embed-list">
                                        <div className="chat-embed-agent-row active">
                                            <div className="chat-embed-avatar">
                                                <img src={AGENTS.find(a => a.id === IAIA_MARIA_ID)?.avatar_url} alt="IAIA" />
                                            </div>
                                            <div className="chat-embed-info">
                                                <span className="chat-embed-name">IAIA MarIA</span>
                                                <span className="chat-embed-role">Governança Rural Digital</span>
                                            </div>
                                            <div className="chat-embed-toggle active" style={{ background: '#F97316', borderColor: '#F97316' }}>
                                                <Check size={16} strokeWidth={4} color="black" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default VisionView;
