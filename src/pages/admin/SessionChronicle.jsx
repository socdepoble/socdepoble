import { useNavigate } from 'react-router-dom';
import './SessionChronicle.css';

const SessionChronicle = () => {
    const navigate = useNavigate();

    // Mock session data for the current session
    // In a real scenario, this would come from a database based on the 'id'
    const sessionData = {
        date: new Date().toLocaleDateString(),
        title: "Integració d'Estructures Literàries i Cròniques [MASTER]",
        tasks: [
            "Actualització de Directrius MASTER (Protocol de Cròniques i Estructures de Llibre)",
            "Extensió de l'esquema de dades PostSchema per a tipologies de llibre",
            "Implementació del selector de tipus (Post/Llibre) al CreatePostModal",
            "Disseny del peu de targeta seqüencial per a llibres al Mur",
            "Creació de la infraestructura de Pàgines de Sessió i Shareability"
        ],
        stats: {
            durationHours: 1.5,
            humanRate: 60, // €/h
            aiTokenCost: 0.12, // €
        }
    };

    const humanCost = sessionData.stats.durationHours * sessionData.stats.humanRate;
    const aiCost = sessionData.stats.aiTokenCost;
    const savings = humanCost - aiCost;
    const efficiencyBoost = (humanCost / aiCost).toFixed(0);

    return (
        <div className="session-chronicle-container animate-in">
            <div role="region" aria-label="Capçalera de Secció" className="session-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-titles">
                    <h1>Sessió [MASTER]</h1>
                    <div className="session-meta">
                        <Calendar size={16} />
                        <span>{sessionData.date}</span>
                    </div>
                </div>
            </div>

            <div role="region" aria-label="Contingut Principal" className="session-main">
                <section className="session-summary-card">
                    <h2 className="section-title">Què hem fet avui?</h2>
                    <ul className="task-list">
                        {sessionData.tasks.map((task, index) => (
                            <li key={index} className="task-item">
                                <CheckCircle2 size={20} className="check-icon" />
                                <span>{task}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="economic-contrast-hud">
                    <div className="hud-header">
                        <Zap size={24} />
                        <h2>Economic Contrast HUD</h2>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card human">
                            <div className="stat-icon"><User size={24} /></div>
                            <div className="stat-content">
                                <p className="stat-label">Cost Humà Estimat</p>
                                <p className="stat-value">{humanCost}€</p>
                                <small>{sessionData.stats.durationHours}h @ {sessionData.stats.humanRate}€/h</small>
                            </div>
                        </div>

                        <div className="stat-card ai">
                            <div className="stat-icon"><Cpu size={24} /></div>
                            <div className="stat-content">
                                <p className="stat-label">Cost AI [MASTER]</p>
                                <p className="stat-value">{aiCost}€</p>
                                <small>Tokens + Computació</small>
                            </div>
                        </div>
                    </div>

                    <div className="savings-banner">
                        <div className="savings-content">
                            <TrendingDown size={32} />
                            <div>
                                <p className="savings-label">Estalvi Comunitari</p>
                                <p className="savings-value">{savings.toFixed(2)}€</p>
                            </div>
                        </div>
                        <div className="efficiency-badge">
                            x{efficiencyBoost} més eficient
                        </div>
                    </div>
                </section>

                <div className="share-actions">
                    <button className="btn-share" onClick={() => navigate('/chats')}>
                        <Share2 size={20} />
                        Anar als Xats del Mas
                    </button>
                </div>
            </div>

            <footer className="session-footer">
                <p>Gravat en la memòria de Sóc de Poble per l'Antigravity.</p>
                <small>Directiva [MASTER] v1.6.0</small>
            </footer>
        </div>
    );
};

export default SessionChronicle;
