import { useState } from 'react';
import { useDesign } from '../app/context/DesignContext';
import { useModalDispatch } from '../app/context/ModalContext';

const GestoriaPanel = () => {
    const { theme } = useDesign();
    const isDayMode = theme === 'light';
    const { openAgentModal } = useModalDispatch();
    
    const [dragActive, setDragActive] = useState(false);
    
    // Theme setup based on GEM MODERN
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const textMuted = isDayMode ? 'text-black/60' : 'text-white/60';
    const cardBgColor = isDayMode ? 'bg-white' : 'bg-[#141414] border border-white/5';
    const borderColor = isDayMode ? 'border-orange-500/20' : 'border-white/10';

    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log("File dropped for gestoría:", e.dataTransfer.files[0]);
            // Todo: upload to Supabase storage + pass to Mixa
        }
    };

    const openGestorChat = () => {
        // SYSTEM_GESTORIA ID
        openAgentModal('SYSTEM_GESTORIA');
    };

    return (
        <div className="w-full flex justify-center py-8">
            <div className={`w-full max-w-4xl px-4 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out-expo ${textColor}`}>
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase drop-shadow-sm mb-3">La Meua Gestoria</h2>
                        <p className={`text-base sm:text-lg max-w-xl ${textMuted} font-medium leading-relaxed`}>
                            Arxiu personal, tràmits i llibre de comptes. Tot atès confidencialment per <strong>La Mixa</strong>, la teua inspectora financera personal.
                        </p>
                    </div>
                    
                    <button 
                        onClick={openGestorChat}
                        className="flex items-center gap-3 px-8 py-4 rounded-[28px] bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                    >
                        <MessageCircle size={22} className="shrink-0" />
                        <span>Parlar amb la Mixa</span>
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
                    {/* Upload Zone */}
                    <div 
                        className={`md:col-span-2 rounded-[36px] ${cardBgColor} p-8 border-2 border-dashed ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : borderColor} transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/50 group min-h-[300px] shadow-sm`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-black uppercase mb-3 text-theme-text group-hover:text-indigo-500 transition-colors">Pujar Factura o Document</h3>
                        <p className={`${textMuted} text-sm max-w-sm mb-6`}>Arrossega els teus PDFs o imatges ací, o fes clic per obrir la càmera i escanejar el tiquet directament.</p>
                        
                        <div className="px-6 py-3 rounded-full bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest pointer-events-none group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                            Seleccionar Arxiu
                        </div>
                    </div>

                    {/* Quick Stats Panel */}
                    <div className={`rounded-[36px] ${cardBgColor} border ${borderColor} p-8 flex flex-col gap-6 shadow-sm`}>
                        <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-[var(--theme-accent-primary)] border-b border-white/10 pb-4">Estat Fiscal</h4>
                        
                        <div className="flex-1 flex flex-col justify-center gap-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                    3
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-sm uppercase tracking-wider text-theme-text transition-colors">Pendents</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest ${textMuted}`}>Per Processar</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                    12
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-sm uppercase tracking-wider text-theme-text transition-colors">Comptabilitzats</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest ${textMuted}`}>Aquest Trimestre</span>
                                </div>
                            </div>
                        </div>

                        <button className={`w-full py-3 rounded-full border ${borderColor} font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors ${textMuted} hover:text-theme-text`}>
                            Veure Resum
                        </button>
                    </div>
                </div>

                {/* Recent Documents Table (Mocked) */}
                <div className={`mt-8 rounded-[36px] ${cardBgColor} border ${borderColor} shadow-sm overflow-hidden`}>
                    <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-black/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <FolderOpen size={20} className="text-indigo-400" />
                            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-theme-text">Darrers Documents</h3>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${textMuted} bg-black/20 px-3 py-1 rounded-full`}>Trimestre 1 - 2026</span>
                    </div>
                    
                    <div className="p-4 md:p-6 flex flex-col gap-2">
                        {/* Mock Row 1 */}
                        <div className="flex items-center justify-between p-4 rounded-[20px] hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
                                    <FileText size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm md:text-base text-theme-text">Factura Llum_Gen_26.pdf</span>
                                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Pujat fa 2 dies properament per l'Assessor</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex bg-green-500/20 text-green-500 px-3 py-1 rounded-full gap-1 items-center">
                                    <CheckCircle size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Registrat</span>
                                </div>
                                <button className="p-2 text-white/50 hover:text-indigo-400 hover:bg-white/10 rounded-full transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Mock Row 2 */}
                        <div className="flex items-center justify-between p-4 rounded-[20px] hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl group-hover:scale-110 transition-transform">
                                    <PieChart size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm md:text-base text-theme-text">Tiquet_Cooperativa.jpg</span>
                                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Pujat fa 5h - Pendent</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full gap-1 items-center">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">En Procés</span>
                                </div>
                                <button className="p-2 text-white/50 hover:text-indigo-400 hover:bg-white/10 rounded-full transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className={`mt-8 rounded-[36px] ${cardBgColor} border ${borderColor} shadow-sm overflow-hidden p-6 md:p-8`}>
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-theme-text border-b border-white/5 pb-4 mb-4">Preguntes Freqüents (FAQ)</h3>
                    <div className="space-y-4">
                        <div className={`p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/5`}>
                            <h4 className="font-bold text-base text-theme-text mb-2 tracking-wide">¿Estic a temps de presentar els papers la setmana que ve?</h4>
                            <p className={`text-sm ${textMuted} leading-relaxed font-medium`}>Sí! Segons el calendari fiscal d'aquest trimestre, estàs completament a temps per a presentar totes les factures i la documentació pendent la setmana que ve. La Mixa s'encarregarà de processar-ho tot ràpidament un cop ho puges ací.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GestoriaPanel;
