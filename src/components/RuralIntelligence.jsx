import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { hapticService } from '../services/hapticService';
import { Tractor, ChefHat, ClipboardList, FileSearch, Sparkles, Send, Info } from 'lucide-react';
import './RuralIntelligence.css';

/**
 * RuralIntelligence: La Ràdio Nova [V1.2]
 * Interfície d'IA especialitzada amb Glassmorphism i accents Teal.
 */
const RuralIntelligence = () => {
    const navigate = useNavigate();
    const [selectedPersona, setSelectedPersona] = useState('AGRONOM');
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const personas = [
        { key: 'AGRONOM', icon: <Tractor size={20} />, label: "L'Agrònom" },
        { key: 'CUINERA', icon: <ChefHat size={20} />, label: "La Cuinera" },
        { key: 'CAPATAS', icon: <ClipboardList size={20} />, label: "El Capatàs" },
        { key: 'ARXIVER', icon: <FileSearch size={20} />, label: "L'Arxiver" }
    ];

    const handleConsult = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResponse('');
        hapticService.batec(); // Feedback inicial

        try {
            const result = await geminiService.ask(selectedPersona, query);

            if (result.error) {
                setError(result.message);
                hapticService.notifyError();
            } else {
                setResponse(result.text);
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
                <div className="llumeta">
                    <Sparkles size={24} />
                </div>
                <h2>Intel·ligència Rural</h2>
            </header>

            <div className="persona-selector">
                {personas.map(p => (
                    <button
                        key={p.key}
                        className={`persona-chip ${selectedPersona === p.key ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedPersona(p.key);
                            hapticService.batec();
                        }}
                    >
                        {p.icon}
                        <span>{p.label}</span>
                    </button>
                ))}
            </div>

            <div className="query-box glass-ia">
                <textarea
                    placeholder={`Pregunta-li a ${personas.find(p => p.key === selectedPersona).label}...`}
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

            {response && (
                <div className="response-card glass-ia animate-bategat">
                    <div className="response-header">
                        <small>{personas.find(p => p.key === selectedPersona).label} diu:</small>
                    </div>
                    <div className="response-content">
                        {response}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RuralIntelligence;
