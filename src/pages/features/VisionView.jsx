import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, User, Zap, ArrowLeft, Shield, MessageSquare, Check } from 'lucide-react';
import SEO from '../../components/core/SEO';
import { useDesign } from '../../app/context/DesignContext';
import { useNavigation } from '../../app/context/NavigationContext';
import { AGENTS } from '../../constants';
const IAIA_MARIA_ID = '11111111-1a1a-0000-0000-000000000000';
import './VisionView.css';
const VisionView = () => {
  const navigate = useNavigate();
  const {
    visionMode,
    setVisionMode
  } = useDesign();
  const {
    enabledAgentIds,
    setEnabledAgentIdsState
  } = useNavigation();
  const toggleAgent = id => {
    if (setEnabledAgentIdsState) {
      setEnabledAgentIdsState(prev => prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]);
    }
  };
  const MODES = [{
    id: 'humana',
    level: 0,
    title: 'Nivell 0 (Humà)',
    desc: "Identitat sobirana. Sense IA. Només bategues amb la teua gent.",
    icon: User
  }, {
    id: 'iaia',
    level: 1,
    title: 'Nivell 1 (Assistent)',
    desc: "Utilitat pura amb la IAIA MarIA. Gestió digital del poble.",
    icon: Zap
  }, {
    id: 'immersiva',
    level: 2,
    title: 'Nivell 2 (Immersiu)',
    desc: "Tria la teua colla d'agents per al mur i el xat.",
    icon: Sparkles
  }, {
    id: 'creativa',
    level: 3,
    title: 'Nivell 3 (Creatiu)',
    desc: "Univers total. Tots els agents bategant a l'uníson.",
    icon: Brain
  }];
  return <div className="vision-page-container">
            <SEO title="Selector de Realitat | Sóc de Poble" description="Com vols bategar avui al poble?" />
            <div role="region" aria-label="Capçalera de Secció" className="vision-page-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={32} />
                </button>
                <div className="vision-page-title">
                    <Shield size={32} color="#F97316" />
                    <h1>Selector de Realitat</h1>
                </div>
                <div style={{
        width: 44,
        opacity: 0
      }} />
            </div>

            <div role="region" aria-label="Contingut Principal" className="vision-page-content">
                <p className="vision-page-intro">Com vols bategar avui al poble?</p>
                
                <div className="vision-modes-grid">
                    {MODES.map(m => <div key={m.id}>
                            <div className={`vision-mode-card ${visionMode === m.id ? 'active' : ''}`} onClick={() => setVisionMode(m.id)}>
              
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
                            {m.id === 'immersiva' && visionMode === 'immersiva' && <div className="chat-embed-container animate-in-up">
                                    <div className="chat-embed-header">
                                        <MessageSquare size={18} color="#F97316" />
                                        Selecció d'Acompanyants
                                    </div>
                                    <div className="chat-embed-list custom-scrollbar">
                                        {AGENTS.map(agent => {
                const isActive = enabledAgentIds.includes(agent.id);
                return <div key={agent.id} className={`chat-embed-agent-row ${isActive ? 'active' : ''}`} onClick={() => toggleAgent(agent.id)}>
                      
                                                    <div className="chat-embed-avatar">
                                                        <img src={agent.avatar_url} alt={agent.name} />
                                                        {agent.tag && <span className="agent-tag-badge">{agent.tag}</span>}
                                                    </div>
                                                    <div className="chat-embed-info">
                                                        <div className="chat-embed-name-row">
                                                            <span className="chat-embed-name">{agent.name}</span>
                                                        </div>
                                                        <span className="chat-embed-phrase">{agent.last_message_content || agent.role}</span>
                                                    </div>
                                                    <div className="chat-embed-toggle-wrapper">
                                                        <div className={`chat-embed-toggle ${isActive ? 'active' : ''}`}>
                                                            {isActive && <Check size={14} strokeWidth={4} />}
                                                        </div>
                                                    </div>
                                                </div>;
              })}
                                    </div>
                                </div>}

                             {/* [PROTOCOL V4.2] LEVEL 1: IAIA ONLY DISPLAY */}
                             {m.id === 'iaia' && visionMode === 'iaia' && <div className="chat-embed-container animate-in-up">
                                    <div className="chat-embed-list">
                                        {AGENTS.filter(a => a.id === IAIA_MARIA_ID).map(agent => <div key={agent.id} className="chat-embed-agent-row active" onClick={() => navigate('/iaia')}>
                                                <div className="chat-embed-avatar">
                                                    <img src={agent.avatar_url} alt="IAIA" />
                                                    <span className="agent-tag-badge">MASTER</span>
                                                </div>
                                                <div className="chat-embed-info">
                                                    <div className="chat-embed-name-row">
                                                        <span className="chat-embed-name">{agent.name}</span>
                                                    </div>
                                                    <span className="chat-embed-phrase">{agent.last_message_content}</span>
                                                </div>
                                                <div className="chat-embed-toggle-wrapper">
                                                    <div className="chat-embed-toggle active" style={{
                    background: '#F97316',
                    borderColor: '#F97316'
                  }}>
                                                        <Check size={14} strokeWidth={4} color="black" />
                                                    </div>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>}
                        </div>)}
                </div>
            </div>
        </div>;
};
export default VisionView;