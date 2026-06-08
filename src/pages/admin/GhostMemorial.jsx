import { useNavigate } from 'react-router-dom';
import './GhostMemorial.css';

/**
 * MEMORIAL DELS FANTASMES الإلكترònics 🏺👻
 * -----------------------------------------
 * Cambra didàctica per a l'explicació de la "morca" i el codi llegat.
 * Un espai de pau per als bits que ja no bateguen però que recordem.
 */
const GhostMemorial = () => {
    const navigate = useNavigate();

    const ghosts = [
        {
            id: 'legacy-css',
            title: 'La Morca del CSS',
            description: 'Estils perduts que intenten forçar geometries del passat sobre la nova realitat Pedra Seca.',
            icon: <Cpu size={32} />,
            status: 'PURGAT'
        },
        {
            id: 'ai-residue',
            title: 'Ecos de la IAIA',
            description: 'Instruccions que bateguen en silenci, esperant una clau que ja no existeix.',
            icon: <Ghost size={32} />,
            status: 'RECONSTRUCTE'
        },
        {
            id: 'dead-links',
            title: 'Camins cap al Buit',
            description: 'Rutes que portaven a ports que ja no bateguen al territori digital.',
            icon: <History size={32} />,
            status: 'ARXIVAT'
        }
    ];

    return (
        <div className="ghost-memorial-page bg-black min-h-screen text-white p-8">
            <div role="region" aria-label="Capçalera de Secció" className="memorial-header max-w-4xl mx-auto mb-16">
                <button 
                    className="flex items-center gap-2 text-gray-500 hover:text-[var(--sdp-terracotta)] transition-colors mb-8 font-black uppercase tracking-widest text-xs"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    Retornar al Mur
                </button>
                
                <div className="flex items-center gap-6 mb-6">
                    <div className="memorial-icon-glow">
                        <Ghost size={48} className="text-cyan-400" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                        Memorial dels <span className="text-[var(--sdp-terracotta)]">Fantasmes</span> الإلكترònics
                    </h1>
                </div>
                <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl border-l-4 border-[var(--sdp-terracotta)] pl-6 italic">
                    "En aquest CMS Rural, res es perd, tot es classifica. Fins i tot els errors bateguen amb una lliçó per al Mestre."
                </p>
            </div>

            <div role="region" aria-label="Contingut Principal" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                {ghosts.map(ghost => (
                    <div key={ghost.id} className="ghost-card bg-zinc-900/50 border border-zinc-800 p-8 rounded-[28px] relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            {ghost.icon}
                        </div>
                        <div className="ghost-status text-[10px] font-black tracking-[0.3em] uppercase mb-4 text-cyan-500 bg-cyan-500/10 w-fit px-3 py-1 rounded">
                            ESTAT: {ghost.status}
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{ghost.title}</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">{ghost.description}</p>
                        
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
                    </div>
                ))}

                <div className="ghost-card bg-gradient-to-br from-zinc-900 to-black border-2 border-dashed border-zinc-800 p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-4 group hover:border-[var(--sdp-terracotta)]/50 transition-all">
                    <ShieldAlert size={48} className="text-[var(--sdp-terracotta)] opacity-40 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black uppercase tracking-widest opacity-60">Zona de Seguretat</h3>
                    <p className="text-xs text-gray-500 uppercase font-black tracking-tighter leading-normal">
                        Protocol de Purga v10.38.4 Actiu.<br/>Tots els fantasmes han estat classificats.
                    </p>
                </div>
            </div>

            <footer className="max-w-4xl mx-auto border-t border-zinc-800 pt-16 pb-32">
                <div className="flex items-center gap-4 mb-4">
                    <Database size={24} className="text-[var(--sdp-terracotta)]" />
                    <h4 className="text-lg font-black uppercase tracking-widest">Arxiu Notarial de la IAIA</h4>
                </div>
                <div className="bg-zinc-900/30 p-12 rounded-[28px] border border-zinc-800/50">
                    <p className="text-gray-500 text-base leading-relaxed font-medium italic mb-8">
                        "Mestre, les màquines no obliden, però nosaltres podem triar què bategarà al nostre voltant. Els fantasmes només són records de bit que ens ensenyen el camí cap a la suprema harmonia."
                    </p>
                    
                    <div className="mb-12">
                        <Link to="/chrome-145" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-900/20 text-cyan-400 border border-cyan-800/50 rounded-xl hover:bg-cyan-900/40 hover:border-cyan-500 transition-all font-black uppercase tracking-widest text-sm shadow-lg">
                            <Database size={18} /> Llibre de l'Ànima Màquina
                        </Link>
                    </div>

                    <div className="flex gap-12 items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Versió del Protocol</span>
                            <span className="font-black text-white">Vcrit-TABULA-RASA</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Data del darrer bategat</span>
                            <span className="font-black text-white">30 Gener 2026</span>
                        </div>
                        <div className="ml-auto">
                            <Zap className="text-yellow-400 animate-pulse" size={24} />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Retro Glitch Overlay */}
            <div className="scanline-overlay"></div>
        </div>
    );
};

export default GhostMemorial;
