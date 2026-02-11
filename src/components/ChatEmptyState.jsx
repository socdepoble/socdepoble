import React from 'react';
import { Settings, BookOpen, ShieldCheck } from 'lucide-react';
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
                            <ShieldCheck size={14} /> Protocol 1er Mandament v9.8.0
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
            {/* Grid de fons subtil (Protocol v9.1.0) */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Logo SP en Box */}
            <div className={`relative z-10 p-8 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-black/10'} mb-8 shadow-sm`}>
                <div className={`border-2 ${darkMode ? 'border-white' : 'border-black'} px-3 py-1 text-3xl font-bold ${colors.textPrimary}`}>
                    SP
                </div>
            </div>
            
            <h1 className={`relative z-10 text-5xl font-bold text-center mb-6 tracking-tight ${colors.textPrimary}`}>
                Sóc de Poble<br/>per a Web
            </h1>
            <p className={`relative z-10 text-center max-w-md text-lg px-4 ${colors.textSecondary}`}>
                Envia i rep missatges, connecta amb els veïns i parla amb la IAIA sense treure el telèfon.
            </p>
            
            <div className="mt-12 flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 font-bold text-gray-500">
                <Settings size={14} /> 
                <span>Xifrat d'extrem a extrem</span>
            </div>
        </div>
    );
};

export default ChatEmptyState;
