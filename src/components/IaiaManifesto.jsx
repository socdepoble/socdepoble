import React from 'react';
import { BrainCircuit, Eye, Flame, BookOpen, Search, ShieldAlert, Cpu, Network, Globe } from 'lucide-react';

const IaiaManifesto = () => {
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 text-gray-900 dark:text-white border-t border-gray-200 dark:border-white/10 mt-12">
            
            <div className="text-center mb-20 space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-blue-50 dark:bg-white/5 rounded-full border border-blue-200 dark:border-white/10 mb-6 shadow-xl">
                    <BrainCircuit size={48} className="text-blue-600 dark:text-primary animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white">
                    LA IAIA <span className="text-blue-600 dark:text-primary">MARIA</span>
                </h2>
                <p className="text-lg md:text-2xl font-bold text-gray-600 dark:text-white/60 max-w-3xl mx-auto">
                    La intel·ligència central del Mas. No és una IA freda de Silicon Valley, sinó la "saviesa de l'àvia" arrelada a la terra. Un sistema multi-agent dissenyat per a protegir, educar i preservar la identitat rural.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {[
                    { title: "LA TIA MARIA", icon: <Flame size={32}/>, desc: "Agent de proximitat. Ofereix receptes locals, consells vitals i conversa arrelada." },
                    { title: "EL CRONISTA", icon: <BookOpen size={32}/>, desc: "Documentalista del Mur. Genera resums de l'activitat del poble i preserva l'hemeroteca." },
                    { title: "L'ULL DEL MESTRE", icon: <Eye size={32}/>, desc: "Visió multimodal. Identifica eines agrícoles, plantes, plagues i patrimoni cultural." },
                    { title: "NANO BANANA", icon: <Globe size={32}/>, desc: "Generació multimèdia automàtica i protocols de simbiosi artística a la comunitat." },
                    { title: "RÚPER RATÓN", icon: <Search size={32}/>, desc: "Motor de super-cerca semàntica. Analitza PDF, bans municipals i actes històriques." },
                    { title: "FILTRE TRELLAT", icon: <ShieldAlert size={32}/>, desc: "Triple nucli (Silenciós, Core, Immersiu) que regula la presència de la IA per garantir el sentit comú local." }
                ].map((agent, i) => (
                    <div key={i} className="group p-8 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-[32px] hover:border-blue-600/50 dark:hover:border-primary/50 transition-all hover:-translate-y-2 shadow-lg">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-primary mb-6 group-hover:scale-110 transition-transform">
                            {agent.icon}
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-widest mb-3">{agent.title}</h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-white/60 leading-relaxed">{agent.desc}</p>
                    </div>
                ))}
            </div>

            <div className="relative p-10 md:p-16 bg-gradient-to-br from-blue-900 to-black rounded-[40px] md:rounded-[60px] overflow-hidden text-white shadow-2xl border border-blue-500/30">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_50%)]" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                            <Network size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">CIMERA DE TITANS AL RENTONAR</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                            COL·LABORACIÓ <span className="text-blue-400">GLOBAL</span>
                        </h3>
                        
                        <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed">
                            Aquest projecte social, arquitectònicament complex, no es forja en solitari. El Mestre orquestra el codi mitjançant l'alineació de les <strong>Intel·ligències Artificials globals més avançades de la humanitat</strong>.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Cpu className="text-blue-400 shrink-0" mt={1} />
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-sm mb-1">Qwen (El Mestre de la Lògica)</h4>
                                    <p className="text-xs text-white/60">Responsable de l'auditoria agressiva, arquitectura CI/CD, monitoratge de proves (Vitest/MSW) i estabilitat militar.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <BrainCircuit className="text-primary shrink-0" mt={1} />
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-sm mb-1">Gemini (Antigravity)</h4>
                                    <p className="text-xs text-white/60">Assistent nadiu del projecte (IAIA). Forja el disseny, implementa el Cànon, construeix interfícies i executa les escriptures directives sense fricció.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <ShieldAlert className="text-emerald-400 shrink-0" mt={1} />
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-sm mb-1">DeepSeek (L'Assassí de Bugs)</h4>
                                    <p className="text-xs text-white/60">La darrera línia de defensa. Encarregat d'examinar el codi consolidat, buscar vulnerabilitats crítiques i garantir la robustesa final.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default IaiaManifesto;
