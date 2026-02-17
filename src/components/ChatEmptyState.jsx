import React from 'react';
import { Settings, BookOpen, ShieldCheck, X, NotebookPen, ArrowRight, UserPlus, MessageCircle, Share2 } from 'lucide-react';
import { useUI } from '../context/UIContext';

const ChatEmptyState = () => {
    const { darkMode, architectMode } = useUI();
    const colors = {
        textPrimary: darkMode ? 'text-white' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    };

    if (architectMode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-[#050505] text-white">
                <div className="max-w-2xl w-full border border-orange-500/30 bg-orange-500/5 rounded-[32px] p-8 md:p-10 backdrop-blur-xl animate-fade-in">
                    <div className="flex items-center gap-3 mb-8 text-orange-500 font-black text-xs uppercase tracking-[0.3em]">
                        <BookOpen size={20} />
                        <span>MIRALL DIDÀCTIC: ESTRUCTURA MESTRA</span>
                    </div>
                    
                    <h2 className="text-3xl font-black mb-6 tracking-tight leading-none">🏗️ ARQUITECTURA GENERAL</h2>
                    
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-2">LA ROCA (Sidebar)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Bloc immovible a l'esquerra (280px). Conté l'accés universal (AFEGIR), el botó de Xat taronja i tota la navegació per "Bategats". El Header de la sidebar és SEMPRE NEGRE per jerarquia visual.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2">EL MERCAT (Panell Central)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Espai de trànsit de 400px. Aquí és on "passes llista": veus qui parla, quines notícies hi ha o quins productes es venen. La capçalera central és el quadre de comandament (Eines).
                            </p>
                        </section>

                        <section>
                            <h3 className="text-purple-500 font-black text-[10px] uppercase tracking-widest mb-2">L'ESCENARI (Panell de Detall)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                On passa l'acció. Ocupa tot l'espai restant. En "Mode Producció" veus el contingut; en "Mode Arquitecte", veus aquesta mateixa explicació tècnica.
                            </p>
                        </section>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2">
                            <ShieldCheck size={14} /> Protocol 1er Mandament v10.26.0-PURGA
                        </span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-orange-600/40"></div>
                            <div className="w-2 h-2 rounded-full bg-orange-600/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
            {/* Botó per tancar (v10.26.0-PURGA - PROTOCOL SORTIDA D'EMERGÈNCIA) */}
            <div className="absolute top-6 right-6 z-50">
                <button 
                    onClick={() => window.location.href = '/'}
                    className="w-12 h-12 flex items-center justify-center bg-black/20 backdrop-blur-md hover:bg-black/60 text-white rounded-full border border-white/10 shadow-2xl transition-all active:scale-90"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Grid de fons subtil (Protocol v9.1.0) */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Logo SP en Box */}
            <div className={`relative z-10 p-8 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-black/10'} mb-8 shadow-sm`}>
                <div className={`border-2 ${darkMode ? 'border-white' : 'border-black'} px-3 py-1 text-3xl font-bold ${colors.textPrimary}`}>
                    SP
                </div>
            </div>
            
            <h1 className={`relative z-10 text-5xl font-black text-center mb-6 tracking-tighter leading-none ${colors.textPrimary}`}>
                Sóc de<br/>Poble<br/>per a<br/><span className="text-[#FF6B00]">Web</span>
            </h1>
            
            <div className={`relative z-10 text-center max-w-lg mb-10 space-y-4 ${colors.textSecondary}`}>
                <p className="text-xl font-bold leading-tight italic">
                    "Connecta amb la teua comunitat. El bategat de la terra en format digital."
                </p>
                <p className="text-sm leading-relaxed px-6">
                    <strong>Sóc de Poble</strong> és un <strong>Sistema Operatiu Rural</strong>. Una eina per a veïns, ajuntaments i negocis KM 0 per a protegir la memòria, dinamitzar l'economia local i bategar amb utilitat social. Envia missatges, connecta amb el mercat i consulta la saviesa de la IAIA.
                </p>
            </div>

            {/* ACCIONS AL PEU (RESTAURADES v11.0.1) */}
            <div className="relative z-10 flex items-center gap-4 mb-10">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-full font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform" onClick={() => alert('Bategant Connexió...')}>
                    <UserPlus size={16} /> Connectar
                </button>
                <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest border border-white/10 hover:bg-white/5 transition-colors ${colors.textPrimary}`} onClick={() => alert('Obrint Safareig...')}>
                    <MessageCircle size={16} /> Comentar
                </button>
                <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest border border-white/10 hover:bg-white/5 transition-colors ${colors.textPrimary}`} onClick={() => {
                    const shareData = { title: 'Sóc de Poble', text: 'Connecta amb la teua comunitat.', url: window.location.origin };
                    if (navigator.share) navigator.share(shareData);
                    else alert('Enllaç copiat!');
                }}>
                    <Share2 size={16} /> Compartir
                </button>
            </div>
            
            <div className={`relative z-10 p-6 rounded-2xl border text-left max-w-sm mt-8 ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <h4 className="font-bold flex items-center gap-2 mb-2 text-[#FF6B00]">
                    <ShieldCheck size={18} /> Licència Oberta
                </h4>
                <p className={`text-xs leading-relaxed ${colors.textSecondary}`}>
                    Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre. Consulta l'Arquitectura per a més detalls tècnics.
                </p>
                <button 
                    onClick={() => window.location.href = '/ofici'}
                    className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#FF6B00] hover:underline flex items-center gap-1"
                >
                    Llegir Condicions i Arquitectura <ArrowRight size={10} />
                </button>
            </div>

            <div className="mt-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-40 font-black text-gray-500">
                <Settings size={12} /> 
                <span>Xifrat d'Extrem a Extrem | v10.26.0-PURGA</span>
            </div>
        </div>
    );
};

export default ChatEmptyState;
