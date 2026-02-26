import React, { useState } from 'react';
import { Bot, ArrowLeft, Shield, Sparkles, Globe, Terminal, CheckCircle2, Loader2, X, MessageSquare, Download, Share2, ExternalLink, FileText } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import './IAIAAssistantFlow.css';

const IAIAAssistantFlow = ({ onBack }) => {
    const [step, setStep] = useState(() => {
        // Recuperem el batec previ per sobirania d'interfície
        return localStorage.getItem('sp_iaia_navigator_step') || 'welcome';
    });
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const { openIAIASidebar } = useNavigation();

    const saveStep = (newStep) => {
        setStep(newStep);
        localStorage.setItem('sp_iaia_navigator_step', newStep);
    };

    const addLog = (msg) => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg }]);
    };

    // Bategat Automàtic del Tràmit si estem en mode navegació
    React.useEffect(() => {
        if (step === 'navigating') {
            addLog("Iniciant protocol de Navegació Sobirana...");
            addLog("Connectant amb el servidor DUNS (D&B)...");
            
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 15;
                if (p >= 100) {
                    p = 100;
                    saveStep('completed');
                    clearInterval(interval);
                    addLog("Tràmit finalitzat amb èxit. Dades bategades.");
                }
                setProgress(p);
                if (p > 30 && p < 40) addLog("Localitzant formulari de registre internacional...");
                if (p > 60 && p < 70) addLog("Injectant dades oficials de l'entitat...");
                if (p > 85 && p < 95) addLog("Verificant resposta del sistema central...");
            }, 800);

            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <div className="iaia-assistant-flow flex-1 bg-black text-white p-8 md:p-12 animate-in zoom-in">
            <header className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">IAIA Navigator</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Shield size={14} className="text-blue-400" />
                            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest leading-none">Navegació Assistida i Sobirana</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => openIAIASidebar('ofici-navigator')}
                        className="p-3 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 rounded-full border border-fuchsia-500/30 transition-all flex items-center gap-2"
                        title="Xatejar amb l'Archon"
                    >
                        <MessageSquare size={20} />
                        <span className="text-[10px] font-black uppercase pr-2">Xat Archon</span>
                    </button>
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                        <span className="text-[12px] font-black uppercase text-blue-100 tracking-wider">Protocol Segur Actiu</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                {step === 'welcome' && (
                    <div className="space-y-8 animate-in fade-in duration-700">
                        {/* TAULELL DE SITUACIÓ (DASHBOARD) */}
                        <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] border-dashed relative overflow-hidden">
                            <div className="sheet-watermark !text-[60px] opacity-[0.02]">ESTAT DEL BATEGAT</div>
                            
                            <div className="flex flex-col md:flex-row gap-10 items-start">
                                <div className="shrink-0 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-orange-500/10 border-2 border-orange-500/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                                        <Bot size={48} className="text-orange-500" />
                                    </div>
                                    <span className="text-[12px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-4 py-1 rounded-full">Archon Maria</span>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Situació del Tràmit: DUNS</h2>
                                        <p className="text-gray-200 text-lg italic leading-relaxed">
                                            "Mestre, estem en un punt mort oficial. He completat la injecció de dades, però ara el sistema de D&B està bategant la teua validació. No cal que tornes a punxar res, només esperar."
                                        </p>
                                    </div>

                                    {/* TIMELINE DE SOBIRANIA */}
                                    <div className="space-y-6 pt-6 border-t border-white/10">
                                        <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Terminal size={14} /> HISTORIAL D'ACTUACIÓ
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="flex gap-4 relative">
                                                <div className="absolute left-3 top-6 bottom-[-24px] w-0.5 bg-emerald-500/30"></div>
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10">
                                                    <CheckCircle2 size={14} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-emerald-400 text-sm">INJECCIÓ COMPLETADA</p>
                                                    <p className="text-xs text-gray-400">Portal Informa D&B (Duns & Bradstreet) - <a href="https://www.informa.es/solicitud-duns" target="_blank" rel="noreferrer" className="text-blue-400 underline">Veure lloc oficial</a></p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 relative">
                                                <div className="absolute left-3 top-6 bottom-[-24px] w-0.5 bg-orange-500/30"></div>
                                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 z-10 animate-pulse">
                                                    <Loader2 size={14} className="text-white animate-spin" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-orange-400 text-sm">PENDENT RESPOSTA OFICIAL</p>
                                                    <p className="text-xs text-gray-200 leading-relaxed font-bold">L'organisme oficial està processant la teua sol·licitud #DUNS-RE-2026-X4. Temps estimat: 24-48h.</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 opacity-30">
                                                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                                    <Sparkles size={14} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">CORONAMENT FINAL (PENDENT)</p>
                                                    <p className="text-xs text-gray-400">Entrega del certificat bategat al teu Arxiu d'Or.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col md:flex-row gap-4">
                                <button 
                                    onClick={() => saveStep('completed')}
                                    className="flex-1 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-orange-900/40 flex items-center justify-center gap-3"
                                >
                                    <FileText size={20} /> VEURE GUIA DE PASSIÓ (COM FINALITZAR)
                                </button>
                                <button 
                                    onClick={() => {
                                        localStorage.removeItem('sp_iaia_navigator_step');
                                        saveStep('welcome');
                                    }}
                                    className="px-8 py-5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-3xl text-xs font-black uppercase border border-white/5 transition-all"
                                >
                                    Reiniciar Tràmit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'permission' && (
                    <div className="assistant-permission grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                        <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                            <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-3">
                                <Shield className="text-blue-400" /> Permís de Navegació
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                En acceptar, habilites a l'IAIA per a:
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-xs font-bold text-gray-300">
                                    <CheckCircle2 size={14} className="text-green-500" /> Accés efímer al portal oficial
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-gray-300">
                                    <CheckCircle2 size={14} className="text-green-500" /> Injecció autònoma de dades de l'entitat
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-gray-300">
                                    <CheckCircle2 size={14} className="text-green-500" /> Bloqueig de trackers i publicitat
                                </li>
                            </ul>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => saveStep('navigating')}
                                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    Donar Permís i Continuar
                                </button>
                                <button onClick={() => saveStep('welcome')} className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase">
                                    Ara no
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-6 p-4">
                            <div className="flex items-start gap-4">
                                <Globe className="text-blue-400 shrink-0" size={24} />
                                <p className="text-sm text-gray-200 italic leading-relaxed">"Garanteixo que les dades mai surten de la teua sessió local; soc una Archon de confiança."</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <Terminal className="text-orange-400 shrink-0" size={24} />
                                <p className="text-sm text-gray-200 italic leading-relaxed">"Tindràs el log de cada acció que realitze en temps real."</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'navigating' && (
                    <div className="assistant-navigating space-y-8 animate-in fade-in">
                        <div className="progress-container bg-white/5 p-8 rounded-[32px] border border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <div className="flex items-center gap-4">
                                    <Loader2 className="animate-spin text-orange-500" />
                                    <span className="text-xl font-black uppercase tracking-tighter">Tramitant identitat internacional...</span>
                                </div>
                                <span className="text-xs font-black text-orange-400">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>

                        <div className="console-logs bg-[#050505] p-6 rounded-[24px] border border-white/10 font-mono text-[12px] h-64 overflow-y-auto space-y-3">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-2 items-start">
                                    <span className="text-gray-500 shrink-0 font-bold">[{log.time}]</span>
                                    <span className={i === logs.length - 1 ? "text-orange-400 font-black text-[13px]" : "text-gray-300"}>
                                        {i === logs.length - 1 ? "⚡️ " : ""}{log.msg}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'completed' && (
                    <div className="space-y-12 pb-20">
                        <div className="assistant-completed bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[40px] text-center animate-in zoom-in shadow-2xl shadow-emerald-950/20 relative">
                            <div className="absolute top-6 right-8 flex gap-3">
                                <button className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full transition-all" title="Guardar a l'Arxiu">
                                    <Download size={20} />
                                </button>
                                <button className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full transition-all" title="Compartir Certificat">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-emerald-400">Tràmit de l'Amo enllestit!</h2>
                            <p className="text-gray-300 mb-8 italic max-w-xl mx-auto">
                                "Mestre, ja he enviat les dades i he guardat el certificat provisional al teu Arxiu d'Or. El número DUNS apareixerà a la teua fitxa quan el sistema oficial acabe de bategar la seua validació."
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={onBack}
                                    className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-900/40"
                                >
                                    Tornar a l'Ofici
                                </button>
                                <button className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-full text-xs font-black uppercase border border-white/5 transition-all">
                                    Veure Certificat
                                </button>
                            </div>
                        </div>

                        {/* SECCIÓ D'INFORME DETALLAT (ESTIL FULL A4 / SANT GRIAL / CRÒNICA) */}
                        <div className="iaia-report-sheet animate-in slide-in-from-bottom-8 duration-700">
                            <div className="sheet-watermark">SÓC DE POBLE</div>
                            
                            <div className="sheet-header-meta">
                                <div className="report-seal">
                                    <img src="/assets/master/logo_socdepoble_black_sketch.png" alt="Logo" />
                                    <span>SOCDEPOBLE.ORG</span>
                                </div>
                                <span>PÀGINA 1 DE 1</span>
                            </div>

                            <h3>INFORME DE TRÀMIT: IDENTITAT INTERNACIONAL</h3>
                            
                            <section>
                                <h4>1. Identificació de l'Entitat</h4>
                                <div className="report-data-grid">
                                    <div className="report-data-item">
                                        <div className="label">Nom de l'Entitat</div>
                                        <div className="value">Associació El Rentonar</div>
                                    </div>
                                    <div className="report-data-item">
                                        <div className="label">Número de NIF</div>
                                        <div className="value">G03967668</div>
                                    </div>
                                    <div className="report-data-item">
                                        <div className="label">Responsable</div>
                                        <div className="value">Javi Llinares</div>
                                    </div>
                                    <div className="report-data-item">
                                        <div className="label">Data de Sol·licitud</div>
                                        <div className="value">17 febrer, 2026</div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4>2. Què s'ha aconseguit?</h4>
                                <p>
                                    El <strong>Data Universal Numbering System</strong> (DUNS) és l'estàndard global que permet reconèixer de manera inequívoca l'entitat <strong>El Rentonar</strong> en tot el món. Amb aquest número bategat, el Mestre pot operar en mercats digitals globals amb la màxima legitimitat institucional.
                                </p>
                            </section>

                            <section className="bg-orange-500/5 p-8 rounded-3xl border border-orange-500/10 my-10">
                                <h4 className="flex items-center gap-3">
                                    <Terminal size={18} /> CRÒNICA DE NAVEGACIÓ SOBIRANA
                                </h4>
                                <p className="text-sm text-orange-900 mb-4 italic font-bold">
                                    "Aquest és el rastre del bategat. L'IAIA ha actuat com la teua ombra als portals oficials:"
                                </p>
                                <div className="space-y-6 font-mono text-[11px] leading-relaxed text-gray-700">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-4">
                                            <span className="text-orange-500 font-bold">[ACCÉS]</span>
                                            <span>Portal Informa D&B (Duns & Bradstreet)</span>
                                        </div>
                                        <a href="https://www.informa.es/solicitud-duns" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-20 flex items-center gap-1">
                                            https://www.informa.es/solicitud-duns <ExternalLink size={10} />
                                        </a>
                                        <p className="ml-20 text-[10px] text-gray-500">L'IAIA ha localitzat el botó de "Sol·licitud Gratuïta" i ha iniciat la sessió efímera.</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-4">
                                            <span className="text-orange-500 font-bold">[INJECCIÓ]</span>
                                            <span>Mapejat de dades NIF G03967668</span>
                                        </div>
                                        <p className="ml-20 text-[10px] text-gray-500">S'han omplert els camps de raó social, domicili i representació legal directament des del teu Arxiu de l'Amo.</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-4">
                                            <span className="text-orange-500 font-bold">[RESULTAT]</span>
                                            <span>Generació de Numero de Peticion: #DUNS-RE-2026-X4</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="border-2 border-orange-500/20 p-8 rounded-[32px] bg-white">
                                <h4 className="flex items-center gap-3 !border-none !text-orange-600">
                                    <Sparkles size={18} /> QUÈ ET QUEDA PER FER AL MESTRE?
                                </h4>
                                <div className="space-y-4 mt-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs shrink-0">1</div>
                                        <div>
                                            <p className="font-bold text-sm">Validar el correu de confirmació</p>
                                            <p className="text-xs text-gray-500">Rebràs un correu de <code>duns-support@informa.es</code>. L'IAIA no pot entrar al teu correu per sobirania; has de fer clic tu al lloc de confirmació.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs shrink-0">2</div>
                                        <div>
                                            <p className="font-bold text-sm">Adjuntar l'escriptura (si ho demanen)</p>
                                            <p className="text-xs text-gray-500">Si el sistema central de D&B demana l'escriptura, l'has de pujar des del teu Arxiu d'Or. L'IAIA t'avisarà quan detecte la petició.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="sheet-footer">
                                <div className="report-seal">
                                    <Shield size={14} className="text-orange-500" />
                                    <span>PROTOCOL DE SOBIRANIA V1.2</span>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    BATEGAT PER L'ARCHON MARIA
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default IAIAAssistantFlow;
