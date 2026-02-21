import React from 'react';
import { Sparkles, MessageSquare, ShieldCheck, MapIcon } from 'lucide-react';

const ForasterWelcome = ({ onStart }) => {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-700">
            {/* Ambient Glow */}
            <div className="absolute inset-x-0 top-1/4 h-1/2 bg-orange-500/10 blur-[120px] rounded-full -z-10" />
            
            <div className="max-w-md w-full bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-[28px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Geometria Sagrada Background Accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/15 blur-3xl rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                        <Sparkles className="text-orange-500" size={32} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase leading-none">
                        Benvingut, Foraster
                    </h2>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                        Has entrat a <strong className="text-white">Sóc de Poble</strong> amb identitat sobirana. 
                        Explora el territori, consulta la saviesa de la <strong className="text-orange-400">IAIA</strong> i bategua amb la comunitat. 
                        Sense permisos, sense traçabilitat central.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                        <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <MessageSquare size={20} className="text-orange-400" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Xat</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <MapIcon size={20} className="text-cyan-400" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Mapa</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onStart}
                        className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] mb-4 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                    >
                        Començar a Bategar
                    </button>
                    
                    <div className="flex items-center gap-2 opacity-40">
                        <ShieldCheck size={12} className="text-orange-500" />
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.3em]">
                            Protocol Ancestral v10.26.1
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForasterWelcome;
