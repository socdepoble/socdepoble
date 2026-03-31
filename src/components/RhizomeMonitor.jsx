import React, { useState } from 'react';
import { Shield, Zap, Database, Trash2, RefreshCw } from 'lucide-react';
import { useRhizomeMesh } from '../hooks/useRhizomeMesh';
import { rhizomeManager } from '../services/rhizomeManager';

const RhizomeMonitor = () => {
    // Zero-Patch: Hook nativo que evita cascadas de Efectos y Polling
    const { docSize, syncedPeers, queueSize } = useRhizomeMesh();
    
    // El versionado crítico puede leerse estáticamente sin re-renders constantes
    const version = localStorage.getItem('sp_rhizome_version') || '1.0.0';
    const [lastPrune, setLastPrune] = useState(localStorage.getItem('sp_rhizome_last_prune') || 'Mai');
    const [isPruning, setIsPruning] = useState(false);

    const handlePrune = async () => {
        setIsPruning(true);
        // Operación atómica de RhizomeManager (limpia historial Yjs)
        const success = await rhizomeManager.pruneHistory('global');
        if (success) {
            const time = new Date().toLocaleTimeString();
            localStorage.setItem('sp_rhizome_last_prune', time);
            setLastPrune(time);
        }
        setIsPruning(false);
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 text-white font-sans mt-8 shadow-2xl relative overflow-hidden">
            {/* Animación Sutil de Rastro Físico P2P */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Database className="text-orange-500" size={24} />
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tighter leading-none">Malla Rhizome</h3>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Motor CRDT Offline-First</span>
                    </div>
                </div>
                {syncedPeers.length > 0 ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-[8px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap size={10} className="animate-pulse" /> P2P ACTIU
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-white/10 text-white/50 rounded-[8px] text-[10px] font-black uppercase tracking-widest">
                        AÏLLAT
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Métricas DTN en tiempo real inyectadas vía useSyncExternalStore */}
                <div className="bg-white/5 p-4 rounded-[20px] border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Longitud Cola DTN</span>
                    <div className="flex items-baseline gap-2">
                        <div className={`text-3xl font-black ${queueSize > 0 ? 'text-orange-500' : 'text-gray-300'}`}>{queueSize}</div>
                        <span className="text-xs text-gray-500 font-mono">deltas</span>
                    </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-[20px] border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Mules Connectades</span>
                    <div className="flex items-baseline gap-2">
                        <div className={`text-3xl font-black ${syncedPeers.length > 0 ? 'text-green-500' : 'text-gray-300'}`}>{syncedPeers.length}</div>
                        <span className="text-xs text-gray-500 font-mono">nodes</span>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-[20px] border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">Pes Document Local</span>
                    <div className="text-2xl font-black text-cyan-400">{docSize} <span className="text-xs text-gray-500 font-mono">B</span></div>
                </div>

                <div className="bg-white/5 p-4 rounded-[20px] border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">V-Crit Node</span>
                    <div className="text-2xl font-black text-gray-300">{version}</div>
                </div>
            </div>

            <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-[20px] font-mono text-xs">
                <div className="flex justify-between items-center opacity-70">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Darrera Poda Atòmica:</span>
                    <span className="text-white bg-white/10 px-2 py-1 rounded-[8px]">{lastPrune}</span>
                </div>
                <div className="flex justify-between items-center opacity-70">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Estat BLE Transport:</span>
                    <span className="text-green-400 font-bold">ESCOLTANT...</span>
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={handlePrune}
                    disabled={isPruning}
                    className="flex-1 py-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 rounded-[20px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Trash2 size={16} className={isPruning ? 'animate-bounce' : ''} />
                    <span className="text-xs font-black uppercase tracking-wider">{isPruning ? 'Pudant Graph...' : 'Executar Poda Atòmica'}</span>
                </button>
            </div>

            <div className="mt-5 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[20px] flex items-start gap-4">
                <Shield className="text-indigo-400 mt-1 flex-shrink-0" size={20} />
                <p className="text-[11px] text-indigo-200/80 italic leading-relaxed font-serif">
                    Arquitectura "Zero Network": Aquest terminal propaga dades via Bluetooth de Baixa Energia (DTN). 
                    Cap servidor, ni onada de calor pot destruir la memòria inactiva encriptada del Mas.
                </p>
            </div>
        </div>
    );
};

export default RhizomeMonitor;
