import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * PÀGINA DE RESOLUCIÓ DE CONFLICTES (Fase 6 - Protocol Sociològic)
 * Activa't automàticament quan stateLedger detecta un conflicte CRDT offline
 * entre dos usuaris que van modificar el mateix node.
 */
export const ConflictResolutionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Llig les dades passades des de SystemGuardian via sessionStorage
    const [conflictData, setConflictData] = useState(() => {
        const stored = sessionStorage.getItem('sdp_conflict_data');
        return stored ? JSON.parse(stored) : null;
    });

    // 1 hora de temps sociològic per decidir
    const [timeLeft, setTimeLeft] = useState(3600); 

    const handleFirstWriteWins = React.useCallback(() => {
        alert("⏱️ Temps esgotat. S'aplica la regla d'Or: El primer que va publicar, guanya. El sistema ha resolt automàticament el conflicte.");
        sessionStorage.removeItem('sdp_conflict_data');
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        if (!conflictData) {
            navigate('/');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFirstWriteWins();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [conflictData, navigate, handleFirstWriteWins]);

    const handleSelectMine = () => {
        alert("✅ Has decidit imposar el teu camp. El Ledger s'ha actualitzat.");
        sessionStorage.removeItem('sdp_conflict_data');
        // stateLedger.forceResolution('local')
        navigate('/');
    };

    const handleSelectTheirs = () => {
        alert("✅ Has acceptat el camp del veí. El Ledger ha descartat el teu esborrany.");
        sessionStorage.removeItem('sdp_conflict_data');
        // stateLedger.forceResolution('remote')
        navigate('/');
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!conflictData) return null;

    return (
        <div className="min-h-screen bg-[#121212] text-[#e0e0e0] flex items-center justify-center p-6 font-sans">
            <div className="max-w-4xl w-full bg-[#1e1e1e] border border-red-900/50 rounded-2xl shadow-2xl p-8 space-y-8">
                
                <div className="text-center space-y-4 border-b border-gray-800 pb-6">
                    <h1 className="text-4xl font-bold text-red-500 tracking-tight">Paradoxa del Bancal Detectada</h1>
                    <p className="text-xl text-gray-400">
                        L'Eixam ha detectat que un altre veí ha modificat la mateixa fitxa mentre tu estaves sense internet.
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full font-mono text-lg">
                        <span>⏳ Temps per a decidir:</span>
                        <span className="font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* El teu camp */}
                    <div className="bg-[#2a2a2a] rounded-xl p-6 border-l-4 border-emerald-500">
                        <h2 className="text-2xl font-bold text-emerald-400 mb-4">El teu camp (Offline)</h2>
                        <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                            {JSON.stringify(conflictData.localState || { nom: "Canvi Local", desc: "La teua edició sense connexió" }, null, 2)}
                        </pre>
                        <button 
                            onClick={handleSelectMine}
                            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            Imposar la meua versió
                        </button>
                    </div>

                    {/* El camp del veí */}
                    <div className="bg-[#2a2a2a] rounded-xl p-6 border-l-4 border-blue-500">
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">El camp del veí (Núvol)</h2>
                        <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                            {JSON.stringify(conflictData.remoteState || { nom: "Canvi Remot", desc: "Publicat a les 18:04 per Jaume" }, null, 2)}
                        </pre>
                        <button 
                            onClick={handleSelectTheirs}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            Acceptar la versió del veí
                        </button>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500 pt-4">
                    Segons el Còdex de Sóc de Poble, si el temporitzador arriba a zero sense acord,
                    s'aplicarà la llei del "Primer que publica, guanya".
                </div>
            </div>
        </div>
    );
};
