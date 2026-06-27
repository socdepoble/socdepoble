import { useState } from 'react';
import { Plus, History, Bug } from 'lucide-react';

const XylellaManager = ({ onBack, predefinedUser }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [view, setView] = useState('history'); // 'history' | 'new'

    const documentImages = [
        "/assets/docs/xylella/PXL_20260512_135548480.jpg",
        "/assets/docs/xylella/PXL_20260512_135604995.jpg",
        "/assets/docs/xylella/PXL_20260512_135617094.jpg",
        "/assets/docs/xylella/PXL_20260512_135636107.jpg",
        "/assets/docs/xylella/PXL_20260512_135645371.jpg"
    ];

    return (
        <TramitBaseTemplate
            title="Declaració de Xylella"
            description="Gestió d'alertes sanitàries i control de plagues per a la Conselleria."
            icon={Bug}
            status="pending"
            onBack={onBack}
            predefinedUser={predefinedUser}
            tabs={[
                { id: 'history', label: "Historial de Declaracions", icon: History },
                { id: 'new', label: "Nova Declaració", icon: Plus }
            ]}
            activeTab={view}
            onTabChange={setView}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visualitzador del Document (Columna Esquerra) */}
                <div className="lg:col-span-7 space-y-4">

                    {view === 'history' ? (
                        <>
                            <div className="bg-theme-panel border border-theme-border rounded-[32px] overflow-hidden flex flex-col h-[70vh] shadow-xl relative">
                                {/* Status bar simulada del PDF */}
                                <div className="bg-[#1a1a1a] p-3 flex justify-between items-center text-xs text-white/70 font-mono uppercase border-b border-white/10 shrink-0">
                                    <span>Pàgina {selectedImage + 1} de {documentImages.length}</span>
                                    <span className="text-orange-500 font-bold">Document Confidencial</span>
                                </div>
                                
                                {/* Contenidor de la imatge amb scroll intern */}
                                <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4 flex items-start justify-center">
                                    <img 
                                        src={documentImages[selectedImage]} 
                                        alt={`Pàgina ${selectedImage + 1} de Xylella`}
                                        className="max-w-full h-auto object-contain shadow-2xl rounded-sm"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Miniatures */}
                            <div className="flex gap-2 overflow-x-auto p-2 custom-scrollbar">
                                {documentImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-theme-border opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-theme-panel border border-theme-border rounded-[32px] p-8 shadow-xl flex items-center justify-center text-center">
                            <div className="text-white/50 space-y-2">
                                <Bug className="w-12 h-12 mx-auto opacity-50" />
                                <p className="font-bold text-lg">Nova Declaració no disponible</p>
                                <p className="text-sm">Aquest mòdul està en desenvolupament actiu.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tauler de Gestió (Columna Dreta) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-theme-panel border border-theme-border rounded-[32px] p-6 shadow-sm">
                        <h2 className="text-2xl font-black uppercase text-theme-text mb-2">Estat del Tràmit</h2>
                        <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-6">
                            <AlertTriangle size={24} className="text-orange-500 shrink-0" />
                            <p className="text-sm text-theme-text font-medium">
                                Tens <strong className="text-orange-500">1 acció pendent</strong> requerida per Conselleria. Cal aportar nova informació parcel·laria.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-theme-border bg-[var(--bg-app)] hover:bg-[var(--bg-panel)] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <UploadCloud size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-theme-text">Aportar Nova Documentació</p>
                                        <p className="text-[10px] uppercase font-bold text-theme-text opacity-50 tracking-widest">Registres del cadastre</p>
                                    </div>
                                </div>
                                <Send size={18} className="text-theme-text opacity-30 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                            </button>
                            
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-theme-border bg-[var(--bg-app)] hover:bg-[var(--bg-panel)] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-theme-text">Firmar Declaració</p>
                                        <p className="text-[10px] uppercase font-bold text-theme-text opacity-50 tracking-widest">Signatura digital Bategat</p>
                                    </div>
                                </div>
                                <Send size={18} className="text-theme-text opacity-30 group-hover:opacity-100 group-hover:text-indigo-500 transition-all" />
                            </button>
                        </div>
                    </div>

                    {/* Bloc d'Assistència IAIA */}
                    <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0d0514] border border-fuchsia-500/20 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-600/30 blur-3xl rounded-full pointer-events-none"></div>
                        <h3 className="text-xl font-black uppercase text-white mb-2 relative z-10 flex items-center gap-2">
                            Assistent Burocràtic
                            <span className="bg-fuchsia-600 text-[10px] px-2 py-0.5 rounded-sm font-black">IAIA</span>
                        </h3>
                        <p className="text-sm text-white/70 mb-6 relative z-10">
                            La IAIA pot llegir l'expedient per tu, resumir-te els terminis i preparar les instàncies oficials.
                        </p>
                        
                        <button className="w-full py-4 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:scale-105 transition-transform relative z-10">
                            Parlar amb la IAIA
                        </button>
                    </div>
                </div>
            </div>
        </TramitBaseTemplate>
    );
};

export default XylellaManager;
