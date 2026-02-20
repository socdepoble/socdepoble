import React from 'react';
import { Sparkles, MessageSquare, ShieldCheck, MapIcon } from 'lucide-react';

const ForasterWelcome = ({ onStart }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="max-w-md w-full bg-[#1a1b23] border border-white/10 rounded-[28px] p-8 shadow-2xl relative overflow-hidden">
                {/* Geometria Sagrada Background Accent */}
                <div className="absolute -top-24 -right-24 w-48 height-48 bg-orange-500/10 blur-3xl rounded-full" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
                        <Sparkles className="text-orange-500" size={32} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">
                        Benvingut, Foraster
                    </h2>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Has entrat a <strong>Sóc de Poble</strong> amb identitat sobirana. 
                        Explora el territori, consulta la saviesa de la <strong>IAIA</strong> i bategua amb la comunitat. 
                        Sense permisos, sense traçabilitat central.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                        <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <MessageSquare size={20} className="text-orange-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Xat</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <MapIcon size={20} className="text-cyan-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Mapa</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onStart}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    >
                        Començar a Bategar
                    </button>
                    
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em]">
                        Protocol Ancestral v10.26.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForasterWelcome;
