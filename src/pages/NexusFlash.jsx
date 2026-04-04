import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap, Sparkles, Shield, MessageCircle, BellRing,
    Palette, Activity, Terminal, ArrowLeft, Send,
    Layout, Cpu, Database, Eye, CheckCircle2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import SEO from '../components/SEO';
import GlassCard from '../components/ui/GlassCard';
import './NexusFlash.css';

const NexusFlash = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [iaiaInput, setIaiaInput] = useState('');
    const [iaiaResponse, setIaiaResponse] = useState('Bon dia fill! Què busques al Nexes?');
    const [isIaiaThinking, setIsIaiaThinking] = useState(false);
    const [pregonerInput, setPregonerInput] = useState('');
    const [pregonerResult, setPregonerResult] = useState('');
    const [isPregonerThinking, setIsPregonerThinking] = useState(false);
    const [isV2, setIsV2] = useState(true);

    const handleIaia = async () => {
        if (!iaiaInput.trim()) return;
        setIsIaiaThinking(true);
        const result = await geminiService.ask('IAIA', iaiaInput);
        setIaiaResponse(result.text);
        setIsIaiaThinking(false);
        setIaiaInput('');
    };

    const handlePregoner = async () => {
        if (!pregonerInput) return;
        setIsPregonerThinking(true);
        const result = await geminiService.ask('CRONISTA', pregonerInput);
        setPregonerResult(result.text);
        setIsPregonerThinking(false);
    };

    return (
        <div className="nexus-container">
            <SEO title="NEXUS | Sóc de Poble" description="La fulla de ruta de Flash [V2.0-BATEGA]." />
            <header className="nexus-header">
                <div className="nexus-header-content">
                    <button className="nexus-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="nexus-title-group">
                        <h1 className="nexus-glitch-title">NEXUS</h1>
                        <p className="nexus-subtitle">LA FULLA DE RUTA DE FLASH [V2.0-BATEGA]</p>
                    </div>
                    <div className="nexus-status-pill">
                        <Activity size={12} className="pulse" />
                        <span>SISTEMA ÒPTIM</span>
                    </div>
                </div>
                <nav className="nexus-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <Layout size={18} /> <span>PANELL</span>
                    </button>
                    <button className={activeTab === 'lab' ? 'active' : ''} onClick={() => setActiveTab('lab')}>
                        <Palette size={18} /> <span>LABORATORI</span>
                    </button>
                    <button className={activeTab === 'ia' ? 'active' : ''} onClick={() => setActiveTab('ia')}>
                        <Cpu size={18} /> <span>IA SIM</span>
                    </button>
                    <button className={activeTab === 'solatge' ? 'active' : ''} onClick={() => setActiveTab('solatge')}>
                        <Terminal size={18} /> <span>SOLATGE</span>
                    </button>
                </nav>
            </header>

            <main className="nexus-main-content">
                {activeTab === 'dashboard' && (
                    <div className="nexus-dashboard fade-in">
                        <GlassCard className="nexus-welcome-card">
                            <h2>👋 Benvingut al Nexes, Flash!</h2>
                            <p>Aquest és el teu entorn segur per a provar la transició a la <b>Nit Digital (V2)</b>.</p>
                            <div className="nexus-stats-grid">
                                <div className="nexus-stat">
                                    <span className="stat-value">32px</span>
                                    <span className="stat-label">Geometria [MAX]</span>
                                </div>
                                <div className="nexus-stat">
                                    <span className="stat-value">60%</span>
                                    <span className="stat-label">Glassmorphism</span>
                                </div>
                                <div className="nexus-stat warning">
                                    <span className="stat-value">0px</span>
                                    <span className="stat-label">Brutalisme Purga</span>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="nexus-directives-grid">
                            <GlassCard className="directive-card">
                                <Shield className="icon-gold" />
                                <h3>Offline-First</h3>
                                <p>La dada ha de romandre al dispositiu del veí. La SQLite és sobirana.</p>
                            </GlassCard>
                            <GlassCard className="directive-card">
                                <Eye className="icon-cyan" />
                                <h3>Trellat Visual</h3>
                                <p>L'estètica ha d'evolucionar cap al futur sense perdre l'ànima rural.</p>
                            </GlassCard>
                            <GlassCard className="directive-card">
                                <Zap className="icon-orange" />
                                <h3>Batec Atòmic</h3>
                                <p>Cada acció té haptic feedback i una transició orgànica.</p>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {activeTab === 'lab' && (
                    <div className="nexus-lab fade-in">
                        <div className="lab-controls">
                            <h3>Comparativa d'Arquitectura</h3>
                            <button className={`btn-toggle ${isV2 ? 'v2' : 'v1'}`} onClick={() => setIsV2(!isV2)}>
                                {isV2 ? 'Mode: NIT DIGITAL (V2)' : 'Mode: LLEGAT (V1)'}
                            </button>
                        </div>

                        <div className="lab-preview-grid">
                            <div className={`preview-card ${isV2 ? 'style-v2' : 'style-v1'}`}>
                                <h4>TARGETA UNIVERSAL</h4>
                                <div className="preview-avatar"></div>
                                <div className="preview-line"></div>
                                <div className="preview-line short"></div>
                                <button className="preview-btn">ACCIÓ MASTER</button>
                            </div>

                            <GlassCard className="lab-notes">
                                <h4>Tokens de la Prova:</h4>
                                <ul>
                                    <li><b>Radius:</b> {isV2 ? '24px - 32px' : '0px - 4px'}</li>
                                    <li><b>Background:</b> {isV2 ? 'Glassmorphism Fosc' : 'Sòlid / Taronja Boina'}</li>
                                    <li><b>Border:</b> {isV2 ? 'Subtil (rgba)' : '2px solid #000'}</li>
                                </ul>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {activeTab === 'ia' && (
                    <div className="nexus-ia fade-in">
                        <section className="ia-sim-section">
                            <h3>👵 IAIA MarIA SIM</h3>
                            <GlassCard className={`iaia-chat-bubble ${isIaiaThinking ? 'bategant' : ''}`}>
                                {isIaiaThinking ? "L'IAIA està connectant mil detalls..." : iaiaResponse}
                                {isIaiaThinking && <div className="bategat-indicator">🏺</div>}
                            </GlassCard>
                            <div className="iaia-input-group">
                                <input
                                    type="text"
                                    placeholder="Demana-li trellat..."
                                    value={iaiaInput}
                                    onChange={(e) => setIaiaInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleIaia()}
                                    disabled={isIaiaThinking}
                                />
                                <button onClick={handleIaia} disabled={isIaiaThinking}>
                                    {isIaiaThinking ? <Activity size={18} className="pulse" /> : <Send size={18} />}
                                </button>
                            </div>
                        </section>

                        <section className="ia-sim-section">
                            <h3>📢 EL PREGONER MÀGIC</h3>
                            <GlassCard className="pregoner-box">
                                <textarea
                                    placeholder="Escriu el que vols anunciar..."
                                    value={pregonerInput}
                                    onChange={(e) => setPregonerInput(e.target.value)}
                                    disabled={isPregonerThinking}
                                />
                                <button className={`btn-pregonar ${isPregonerThinking ? 'thinking' : ''}`} onClick={handlePregoner} disabled={isPregonerThinking}>
                                    {isPregonerThinking ? 'PREGONANT AL MAS...' : 'CRIDAR BANDO 🏺'}
                                </button>
                                {pregonerResult && !isPregonerThinking && (
                                    <div className="pregoner-result fade-in">
                                        {pregonerResult}
                                    </div>
                                )}
                            </GlassCard>
                        </section>
                    </div>
                )}

                {activeTab === 'solatge' && (
                    <div className="nexus-solatge fade-in">
                        <GlassCard className="solatge-console">
                            <div className="console-header">
                                <Terminal size={14} />
                                <span>SOLATGE_CONSOLE_v2.0</span>
                            </div>
                            <div className="console-body">
                                <div className="line">[SISTEMA] Iniciant protocol de visió...</div>
                                <div className="line">[OK] Base de dades Rhizome en línia i estable.</div>
                                <div className="line">[ERROR] Brutalisme detectat a la frontera de l'index.css</div>
                                <div className="line">[ACCIONS] Purga de 0px en marxa...</div>
                                <div className="line cursor">{">"} _</div>
                            </div>
                        </GlassCard>

                        <div className="solatge-widgets mt-6">
                            <div className="widget-row">
                                <GlassCard className="widget">
                                    <span className="label">SYNC_ENGINE</span>
                                    <span className="value">98.2%</span>
                                </GlassCard>
                                <GlassCard className="widget">
                                    <span className="label">DATA_SIFTER</span>
                                    <span className="value">ACTIU</span>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="nexus-footer">
                <Shield size={14} />
                <span>DIRECTIVA MASTER: SÓC DE POBLE</span>
            </footer>
        </div>
    );
};

export default NexusFlash;
