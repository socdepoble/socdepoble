import React, { useState } from 'react';
import { Zap, Calendar, Activity, Shield, MousePointer2, PlayCircle } from 'lucide-react';
import { SUPER_RATON_MOTTO, SUPER_RATON_LORE } from '../../data/superRatonData';

const SuperRatonControl = ({ addLog }) => {
    const [isVitaminsMode, setIsVitaminsMode] = useState(true);
    const [impactScore, setImpactScore] = useState(99);

    const handleVitaminize = () => {
        addLog('Iniciant protocol de vitamina social...', 'warn');
        setTimeout(() => {
            addLog(`"${SUPER_RATON_MOTTO}" dispersat pel sistema.`, 'success');
            setImpactScore(prev => Math.min(100, prev + 1));
        }, 1500);
    };

    const scheduleResearch = () => {
        addLog('Planificant recerca de llinatge Super Ratón al calendari...', 'info');
        // Simulem integració amb calendarData.js
        setTimeout(() => {
            addLog('Nou Ritu de Masia: "Vitamina de Recerca" agendat.', 'success');
        }, 1000);
    };

    return (
        <div className="neural-core-panel" style={{ minHeight: '500px', border: '2px solid var(--hud-accent)' }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black flex items-center gap-3" style={{ color: 'var(--hud-accent)' }}>
                    <Zap /> SUPER RATÓN CONTROL
                </h2>
                <span className="hud-badge" style={{ background: 'var(--hud-accent)', color: '#000' }}>GOD MODE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 border border-gray-800 rounded-3xl bg-black/40">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Activity size={20} color="var(--hud-accent)" /> IMPACTE SOCIAL
                    </h3>
                    <div className="text-center py-6">
                        <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--hud-accent)' }}>{impactScore}%</div>
                        <div className="text-xs opacity-50 uppercase tracking-widest mt-2">Nivell de Vitamina Col·lectiva</div>
                    </div>
                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${impactScore}%`, background: 'var(--hud-accent)', height: '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>
                </div>

                <div className="p-6 border border-gray-800 rounded-3xl bg-black/40">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MousePointer2 size={20} color="var(--hud-accent)" /> LORE DIDÀCTIC
                    </h3>
                    <p className="text-sm italic mb-4">"{SUPER_RATON_LORE.philosophy}"</p>
                    <div className="text-xs space-y-2 opacity-70">
                        <div><strong>Origen:</strong> {SUPER_RATON_LORE.origin}</div>
                        <div><strong>Rol:</strong> {SUPER_RATON_LORE.role}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    className="btn-hud-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold"
                    style={{ background: 'linear-gradient(90deg, #00f2ff 0%, #0099ff 100%)', color: '#000' }}
                    onClick={handleVitaminize}
                >
                    <Zap size={20} /> VITAMINAR SISTEMA ARA
                </button>

                <div className="flex gap-4">
                    <button
                        className="btn-hud-outline flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 border-gray-700"
                        onClick={scheduleResearch}
                    >
                        <Calendar size={18} /> AGENDAR RITU RECERCA
                    </button>
                    <button
                        className="btn-hud-outline flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 border-gray-700"
                        onClick={() => setIsVitaminsMode(!isVitaminsMode)}
                    >
                        <PlayCircle size={18} /> {isVitaminsMode ? 'DESACTIVAR' : 'ACTIVAR'} DIBUIXOS
                    </button>
                </div>
            </div>

            <div className="mt- auto pt-6 opacity-30 text-[10px] text-center tracking-[4px] uppercase">
                Protegit pel Llinatge del Mestre i Super Ratón
            </div>
        </div>
    );
};

export default SuperRatonControl;
