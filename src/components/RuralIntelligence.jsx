import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { hapticService } from '../services/hapticService';
import { Tractor, ChefHat, ClipboardList, FileSearch, Sparkles, Send, Info, ShieldCheck, Share2, BellRing, Palette, Zap, Globe, Settings, Users } from 'lucide-react';
import LlarDeFocMenu from './LlarDeFocMenu';
import './RuralIntelligence.css';

/**
 * RuralIntelligence: La Ràdio Nova [V1.2]
 * Interfície d'IA especialitzada amb Glassmorphism i accents Teal.
 */
const RuralIntelligence = () => {
    const navigate = useNavigate();
    const [selectedPersona, setSelectedPersona] = useState('AGRONOM');
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState([]); // List of { persona, query, response, timestamp }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem('sp_ia_mode') || 'faena');

    const personas = [
        { key: 'AGRONOM', icon: <Tractor size={20} />, label: "L'Agrònom", avatar: "Vicent Ferris", type: "PERSON" },
        { key: 'CUINERA', icon: <ChefHat size={20} />, label: "La Cuinera", avatar: "Pepica", type: "PERSON" },
        { key: 'CAPATAS', icon: <ClipboardList size={20} />, label: "El Capatàs", avatar: "Andreu", type: "PERSON" },
        { key: 'ARXIVER', icon: <FileSearch size={20} />, label: "L'Arxiver", avatar: "Joan", type: "PERSON" },
        { key: 'RATOLI', icon: <Info size={20} />, label: "Dades", avatar: "Ratolí", type: "ANIMAL" },
        { key: 'SULTAN', icon: <ShieldCheck size={20} />, label: "Seguretat", avatar: "Sultan", type: "ANIMAL" },
        { key: 'MIXA', icon: <Share2 size={20} />, label: "Xarxa", avatar: "Mixa", type: "ANIMAL" },
        { key: 'GALL', icon: <BellRing size={20} />, label: "Alertes", avatar: "El Gall", type: "ANIMAL" },
        { key: 'NANOBANANA', icon: <Palette size={20} />, label: "L'Artista", avatar: "Nano Banana", type: "SYSTEM" },
        { key: 'FLASH', icon: <Zap size={20} />, label: "Executor", avatar: "Flash", type: "SYSTEM" },
        { key: 'VIATJANT', icon: <Globe size={20} />, label: "Exterior", avatar: "El Viatjant", type: "PERSON" }
    ];

    const handleConsult = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        hapticService.batec(); // Feedback inicial

        try {
            const result = await geminiService.ask(selectedPersona, query);

            if (result.error) {
                setError(result.message);
                hapticService.notifyError();
            } else {
                const newBatec = {
                    id: Date.now(),
                    persona: personas.find(p => p.key === selectedPersona),
                    query: query,
                    text: result.text,
                    avatarName: result.avatarName || personas.find(p => p.key === selectedPersona).avatar,
                    timestamp: new Date().toLocaleTimeString()
                };
                setHistory(prev => [newBatec, ...prev]);
                setQuery(''); // Netegem per a la següent consulta
                hapticService.notifyAIReady(); // Batec llarg d'èxit
            }
        } catch (err) {
            setError("S'ha produït un error inesperat.");
            hapticService.notifyError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rural-ia-container animate-bategat">
            <header className="rural-ia-header">
                <div className="header-main">
                    <div className="llumeta">
                        <Sparkles size={24} />
                    </div>
                    <h2>Intel·ligència Rural</h2>
                </div>
                <div className="header-actions">
                    <button className="icon-btn-ia" onClick={() => navigate('/ia/habitants')} title="Els Habitants del Mas">
                        <Users size={20} />
                    </button>
                    <button className="icon-btn-ia" onClick={() => setIsMenuOpen(true)} title="La Llar de Foc">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            <LlarDeFocMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                currentMode={mode}
                onModeChange={(newMode) => {
                    setMode(newMode);
                    localStorage.setItem('sp_ia_mode', newMode);
                }}
            />

            <div className="persona-selector">
                {personas.map(p => (
                    <button
                        key={p.key}
                        className={`persona-chip ${selectedPersona === p.key ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedPersona(p.key);
                            setError(null);
                            hapticService.batec();
                        }}
                    >
                        {p.icon}
                        <div className="persona-info-mini">
                            <span className="persona-label">{p.label}</span>
                            <span className="persona-name">{p.avatar}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="query-box glass-ia">
                <textarea
                    id="rural-ia-query"
                    name="rural-ia-query"
                    placeholder={`Pregunta-li a ${personas.find(p => p.key === selectedPersona).avatar}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                />
                <button
                    className={`consult-btn ${loading ? 'loading' : ''}`}
                    onClick={handleConsult}
                    disabled={loading || !query.trim()}
                >
                    {loading ? (
                        <span className="status-pulse">Consultant...</span>
                    ) : (
                        <>
                            <span>Consultar</span>
                            <Send size={18} />
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="error-card glass-ia animate-bategat">
                    <Info size={24} />
                    <p>{error}</p>
                    {error.includes("clau del tractor") && (
                        <button
                            className="btn-setup"
                            onClick={() => navigate('/perfil?tab=settings')}
                        >
                            Configurar API Key
                        </button>
                    )}
                </div>
            )}

            {history.length > 0 && (
                <div className="history-container">
                    {history.map(batec => (
                        <div key={batec.id} className="response-card glass-ia animate-bategat">
                            <div className="response-header">
                                <div className="header-left">
                                    {batec.persona.icon}
                                    <div className="header-names">
                                        <div className="name-row">
                                            <small className="header-label">{batec.persona.label}</small>
                                            {batec.persona.type === 'ANIMAL' && (
                                                <span className="pet-badge">Mascota de l'IAIA</span>
                                            )}
                                        </div>
                                        <strong className="header-avatar-name">{batec.avatarName}</strong>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <small className="timestamp">{batec.timestamp}</small>
                                    <button
                                        className="copy-btn-mini"
                                        onClick={() => {
                                            navigator.clipboard.writeText(batec.text);
                                            hapticService.batec();
                                        }}
                                        title="Copiar saviesa"
                                    >
                                        <Sparkles size={14} />
                                        <span>COPIAR</span>
                                    </button>
                                </div>
                            </div>
                            <div className="response-query">
                                <strong>P:</strong> {batec.query}
                            </div>
                            <div className="response-content">
                                {batec.text}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RuralIntelligence;
