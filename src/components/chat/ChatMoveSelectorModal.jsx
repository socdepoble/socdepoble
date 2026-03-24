import React, { useMemo } from 'react';
import { X, Sparkles, MoveRight } from 'lucide-react';
import { AGENTS } from '../../config/agentsMap';

const ChatMoveSelectorModal = ({ msg, onClose, onSelect }) => {
    // 1. Proposta Intelig·gent Exclusiva (Heurística Local)
    const recommendedAgentId = useMemo(() => {
        if (!msg?.content) return null;
        
        const txt = msg.content.toLowerCase();
        
        // Diccionari heurístic ultra ràpid per Sóc de Poble
        const heuristics = {
            '11111111-0000-0000-0000-000000000004': ['plou', 'oratge', 'temps', 'cel', 'sol', 'núvols', 'vent', 'calor', 'fred'], // Gall (Meteo)
            '11111111-1111-4111-a111-000000000003': ['camp', 'conreu', 'reg', 'aigua', 'collita', 'plantes', 'tomates', 'sèquia', 'agricultura'], // Vicent Ferris (Agrònom)
            '11111111-1111-4111-a111-000000000009': ['cuina', 'recepta', 'menjar', 'aprofitar', 'ingredient', 'olla', 'cassoleta', 'paella'], // Pepica (Cuinera)
            '11111111-1111-4111-a111-000000000008': ['paper', 'ajut', 'ajuda', 'tràmit', 'ajuntament', 'impost', 'banc', 'document'], // Joan Batiste (Arxiver)
            '11111111-1a1a-0001-0000-000000000001': ['obra', 'trencant', 'arreglar', 'tanca', 'eina', 'fusta', 'projecte'] // Andreu (Fuster/Capatas)
        };

        for (const [id, keywords] of Object.entries(heuristics)) {
            if (keywords.some(k => txt.includes(k))) return id;
        }
        
        return null;
    }, [msg]);

    // Filtrem la gent per no mostrar l'agent actual (si ja estem parlant amb ell)
    const availableAgents = AGENTS.filter(a => a.id !== msg?.sender_id);

    return (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full sm:w-[400px] bg-theme-panel sm:rounded-[20px] rounded-t-[20px] flex flex-col max-h-[85vh] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                
                {/* Header Dibuixat a Mà (Estil Sóc de Poble) */}
                <div className="px-5 py-4 border-b border-[var(--border-master)] relative flex items-center justify-between shrink-0">
                    <div className="flex bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] w-10 h-10 rounded-full items-center justify-center -ml-1 mr-3">
                        <MoveRight size={20} className="opacity-90" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-lg text-theme-text leading-tight">Reenviar a Expert</h3>
                        <p className="text-[13px] text-theme-text opacity-60 leading-tight mt-0.5">La conversa s'ha de mantenir al seu lloc.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-theme-text hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Llistat amb Virtuosisme Visual */}
                <div className="overflow-y-auto px-2 py-2 flex-grow custom-scrollbar">
                    {availableAgents.map((agent) => {
                        const isRecommended = recommendedAgentId === agent.id;
                        
                        return (
                            <div 
                                key={agent.id}
                                onClick={() => { onSelect(agent.id); }}
                                className={`flex items-center justify-between p-3 rounded-xl mb-1 cursor-pointer transition-all duration-200 group
                                    ${isRecommended 
                                        ? 'bg-[var(--theme-accent-primary)]/10 border border-[var(--theme-accent-primary)]/30 hover:bg-[var(--theme-accent-primary)]/20' 
                                        : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={agent.avatar_url} 
                                            alt={agent.name} 
                                            className="w-[46px] h-[46px] rounded-full object-cover shadow-sm bg-gray-200 dark:bg-gray-800"
                                        />
                                        {isRecommended && (
                                            <div className="absolute -bottom-1 -right-1 bg-[var(--theme-accent-primary)] text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-theme-panel">
                                                <Sparkles size={11} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[15px] leading-none text-theme-text group-hover:text-[var(--theme-accent-primary)] transition-colors">{agent.name}</h4>
                                        <p className="text-[12px] opacity-60 mt-1 font-medium tracking-tight">
                                            {agent.specialization || agent.role}
                                        </p>
                                    </div>
                                </div>
                                {isRecommended && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-accent-primary)] bg-[var(--theme-accent-primary)]/15 px-2 py-0.5 rounded-full hidden sm:block">Recomanat</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatMoveSelectorModal;
