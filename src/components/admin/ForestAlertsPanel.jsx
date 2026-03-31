import React, { useState } from 'react';
import { Flame, TriangleAlert, SendHorizontal, SignalHigh, Trash2 } from 'lucide-react';
import { useRhizomeAlerts } from '../../hooks/useRhizomeAlerts';
import { useRhizomeMesh } from '../../hooks/useRhizomeMesh';

const ForestAlertsPanel = () => {
    // Hooks Puros de Malla (Componente 100% dependiente del ecosistema Local)
    const { alerts, publishAlert, deleteAlert } = useRhizomeAlerts();
    const { syncedPeers } = useRhizomeMesh();
    
    // Estados Fímeros (Inputs VDOM)
    const [draftAlert, setDraftAlert] = useState('');

    const handleBroadcast = (e) => {
        e.preventDefault();
        if (!draftAlert.trim()) return;

        // Publica la Alerta al Mapa Local Yjs
        // YjsBleTransport asume el control del Vector Inmutable en Binario.
        publishAlert(draftAlert.trim(), 1); 
        setDraftAlert('');
    };

    return (
        <div className="bg-[#1a0f0d] border border-red-500/20 rounded-[24px] p-6 text-white font-sans overflow-hidden relative">
            
            {/* Cabecera del Módulo */}
            <div className="flex justify-between items-start mb-6 border-b border-red-500/10 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className="text-red-500" size={24} />
                        <h3 className="text-xl font-black uppercase tracking-tighter text-red-50">Alertes Forestals</h3>
                    </div>
                    <p className="text-[10px] text-red-300/60 font-bold uppercase tracking-widest">Xarxa SOS Descentralitzada - Zero Network</p>
                </div>
                
                <div className="text-right">
                    <span className="block text-[28px] font-black leading-none text-red-500/40">
                        {alerts.length}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-red-400">Actives</span>
                </div>
            </div>

            {/* ZONA DE BROADCAST: Formulario VDOM Fímero */}
            <form onSubmit={handleBroadcast} className="mb-6">
                <div className="relative">
                    <input 
                        type="text" 
                        value={draftAlert}
                        onChange={(e) => setDraftAlert(e.target.value)}
                        placeholder="Ex: Foc a la Solana. Evitar carretera BV-213..."
                        className="w-full bg-black/40 border border-red-500/30 rounded-[16px] py-4 pl-4 pr-16 text-sm text-red-100 placeholder:text-red-900 focus:outline-none focus:border-red-500/60 transition-colors"
                    />
                    <button 
                        type="submit" 
                        disabled={!draftAlert.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-500 text-white w-12 rounded-[12px] flex items-center justify-center disabled:opacity-30 disabled:hover:bg-red-600 transition-colors"
                    >
                        <SendHorizontal size={18} strokeWidth={3} />
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-2 px-1">
                    <SignalHigh size={12} className={syncedPeers.length > 0 ? 'text-green-500 font-bold' : 'text-orange-500/50'} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                        {syncedPeers.length > 0 
                            ? 'Llest per radiar via DTN a mules properes'
                            : 'Malla en espera. Anoteu el SOS localment.'}
                    </span>
                </div>
            </form>

            {/* ZONA P2P: Lectura Directa Mapeada del Vector */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.length === 0 ? (
                    <div className="text-center py-8 opacity-30">
                        <TriangleAlert size={32} className="mx-auto mb-2 text-white/20" />
                        <span className="block text-xs uppercase font-bold tracking-widest">Sense Incidències</span>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className="bg-red-950/30 border border-red-900/40 rounded-[16px] p-4 group relative">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-mono text-red-400/70 border border-red-500/20 px-2 py-0.5 rounded-[6px]">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-red-500/50 bg-red-500/10 px-2 py-0.5 rounded-[6px]">
                                    {alert.emitter}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-red-100 leading-snug">{alert.content}</p>
                            
                            {/* Control Administrativo Silencioso */}
                            <button 
                                onClick={() => deleteAlert(alert.id)}
                                className="absolute -top-2 -right-2 bg-black/60 border border-red-900 hover:border-red-500 p-1.5 rounded-full text-red-500/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 0, 0, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 0, 0, 0.2);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default ForestAlertsPanel;
