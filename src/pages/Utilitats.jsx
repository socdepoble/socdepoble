import React, { useState } from 'react';
import { Wrench, FileText, Sparkles, ArrowRight } from 'lucide-react';
import PDFBategatManager from '../components/PDFBategatManager';
import BlueprintOverlay from '../components/BlueprintOverlay';

const Utilitats = () => {
    const [activeTool, setActiveTool] = useState(null);

    const tools = [
        {
            id: 'pdf-bategador',
            name: 'Bategador de PDFs',
            description: 'Converteix qualsevol PDF orfe en un formulari interactiu i rellenable.',
            icon: FileText,
            color: 'orange'
        }
    ];

    if (activeTool === 'pdf-bategador') {
        return <PDFBategatManager onBack={() => setActiveTool(null)} />;
    }

    return (
        <div className="flex-1 bg-theme-base p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <header className="mb-16 relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-[28px] pointer-events-none" />
                
                <div className="flex items-center gap-6 mb-4 relative z-10">
                    <div className="w-16 h-16 bg-theme-panel border border-white/10 genesis-radius flex items-center justify-center backdrop-blur-xl shadow-2xl">
                        <Wrench className="w-8 h-8 text-[var(--theme-accent-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-1 font-condensed">
                            UTILITATS <span className="text-[#0ea5e9]">DEL MAS</span>
                        </h1>
                        <p className="text-white/30 font-bold tracking-widest text-[10px] uppercase font-mono">
                            Sobirania Digital • Protocol Rhizome v10.26
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className="group bg-white/[0.03] border border-white/10 rounded-[28px] p-8 cursor-pointer hover:bg-white/[0.06] hover:border-[#0ea5e9]/30 transition-all duration-500 relative overflow-hidden flex flex-col min-h-[320px] shadow-2xl backdrop-blur-md font-condensed"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                            <tool.icon size={160} />
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#0ea5e9]/20 to-[#0ea5e9]/5 w-16 h-16 genesis-radius flex items-center justify-center mb-8 border border-[#0ea5e9]/20 shadow-inner">
                            <tool.icon className="text-[#0ea5e9]" size={28} />
                        </div>
                        
                        <div className="mt-auto">
                            <h3 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight italic">
                                {tool.name}
                                <Sparkles size={18} className="text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0" />
                            </h3>
                            <p className="text-white/40 text-[15px] leading-relaxed mb-10 font-medium">
                                {tool.description}
                            </p>
                            
                            <div className="flex items-center text-[#0ea5e9] font-black text-xs gap-3 tracking-[0.2em] group-hover:gap-4 transition-all">
                                <span>INICIAR PROTOCOL</span>
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Futuribles Slots */}
                 {[1, 2].map(i => (
                    <div key={i} className="bg-white/[0.01] border border-white/[0.05] border-dashed rounded-[28px] p-8 flex flex-col items-center justify-center text-white/5 italic text-sm min-h-[320px] transition-all hover:bg-white/[0.02]">
                        <div className="w-12 h-12 rounded-[28px] border border-current flex items-center justify-center mb-4 opacity-30">?</div>
                        <span className="font-black tracking-widest uppercase text-[10px]">Properament...</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Utilitats;
