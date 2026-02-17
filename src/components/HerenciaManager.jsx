import React, { useState } from "react";
import {
  Shield,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Brain,
  ArrowLeft,
  Landmark,
  Calculator,
  Calendar,
  Trash2,
  Eye,
  Camera,
  MessageSquare,
  Terminal,
  Download,
  Bot,
  ExternalLink,
} from "lucide-react";
import MediaViewerModal from "./MediaViewerModal";
import { useUI } from "../context/UIContext";
import { docExtractionService } from "../services/docExtractionService";
import "./HerenciaManager.css";
import "./IAIAAssistantFlow.css";

/**
 * HerenciaManager [MASTER ALZINA]
 * Gestor sobirà per al protocol d'herència i successions.
 * Ofereix trellat sobre deutes, documents i passos a seguir.
 */
const HerenciaManager = ({ onBack }) => {
  const [showSollutiaGenerator, setShowSollutiaGenerator] = useState(false);
  const { iaiaSidebarOpen, openIAIASidebar } = useUI();
  const [sumaData, setSumaData] = useState(null);
  const [deeds, setDeeds] = useState([
    { id: 101, name: "Escritura (protocolitzada).pdf", date: "16/02/2026", analysed: true, src: "/assets/demo/escritura_sample.pdf" },
    { id: 102, name: "recibo_suma_herminio.jpg", date: "16/02/2026", analysed: false, src: "/assets/demo/recibo_suma_sample.jpg" },
  ]);
  const [activeMedia, setActiveMedia] = useState(null);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);

  // Bategat d'extracció de SUMA
  React.useEffect(() => {
    const triggerSumaExtraction = async () => {
      const data = await docExtractionService.extractFromDocument('recibo_suma_herminio.jpg');
      setSumaData(data);
      setDeeds(prev => prev.map(d => d.id === 102 ? { ...d, analysed: true } : d));
    };
    triggerSumaExtraction();
  }, []);

  const generateHerenciaReport = () => {
    const total = sumaData?.total_pagar || 220.69;
    const exp = sumaData?.expediente || '028468';
    
    return `MEMÒRIA DE TRÀMIT D'HERÈNCIA - PROTOCOL ARCHON (EXP: ${exp})

Aquesta memòria justifica l'estat bategat del Protocol Notarial per a l'herència de Herminio.

1. ESTAT ACTUAL: Fase de Liquidació (SUMA APREMI). 
2. ACCIONS REALITZADES:
   - S'ha analitzat el rebut de SUMA de ${total}€ amb l'Ull de la IAIA.
   - S'han detectat els immobles detallats al resum de deutes.
   - Registre de voluntat de pagament immediat.
3. COORDENADES D'ACTUACIÓ: Proaguas Costa Blanca (Canvi de titularitat pendent de coordinació).
4. VEREDICTE ARCHON: Tràmit apte per a la sobirania familiar, bategant a falta de segellat final de Proaguas.

Atum! El sistema bategua amb el trellat de la terra.`;
  };

  // New functions for the refactored component
  const handleUploadDeed = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDeed = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString(),
        analysed: false,
        src: URL.createObjectURL(file),
        type: file.type,
      };
      setDeeds((prev) => [...prev, newDeed]);
    }
  };

  const handleCaptureSnapshot = () => {
    // Placeholder for camera/video capture logic
    alert("Captura de foto/vídeo no implementada en aquesta demo.");
  };

  const handleViewMedia = (media) => {
    setActiveMedia(media);
    setIsMediaViewerOpen(true);
  };

  return (
    <div className={`herencia-manager animate-in transition-all duration-500 ${iaiaSidebarOpen ? 'sidebar-open' : ''}`}>
      {showSollutiaGenerator && (
        <div className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in relative">
            <header className="flex justify-between items-center p-8 border-b border-white/5 sticky top-0 bg-[#111] z-10">
              <h2 className="text-xl font-black uppercase text-fuchsia-400 flex items-center gap-3">
                <Sparkles /> Memòria Sant Grial: Herència
              </h2>
              <button onClick={() => setShowSollutiaGenerator(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                <X />
              </button>
            </header>
            
            <div className="p-8">
              <div className="iaia-report-sheet !m-0 !w-full shadow-none text-left">
                  <div className="sheet-watermark">SÓC DE POBLE</div>
                  
                  <div className="sheet-header-meta">
                      <div className="report-seal">
                          <img src="/assets/master/logo_socdepoble_black_sketch.png" alt="Logo" />
                          <span>SOCDEPOBLE.ORG</span>
                      </div>
                      <span>ESP: {sumaData?.expediente || '028468'}</span>
                  </div>

                  <h3>PROTOCOLO NOTARIAL BATEGAT: HERÈNCIA</h3>
                  
                  <section>
                      <h4>1. Informe de Situació</h4>
                      <p>
                        S'ha analitzat el Protocol Notarial per a l'herència de <strong>Herminio</strong>. El sistema ha bategat els deutes de SUMA i ha preparat la memòria de tràmit per a la regularització de titularitat a Proaguas Costa Blanca.
                      </p>
                  </section>

                  <section className="bg-fuchsia-500/5 p-8 rounded-3xl border border-fuchsia-500/10 my-10">
                      <h4 className="flex items-center gap-3 !border-none !text-fuchsia-400">
                          <Terminal size={18} /> CRÒNICA DE NAVEGACIÓ SOBIRANA
                      </h4>
                      <p className="text-xs text-fuchsia-950/70 mb-4 italic">
                          "Protocol Archon: Traçabilitat de l'Ull de la IAIA pels calaixos de l'Administració:"
                      </p>
                      <div className="space-y-6 font-mono text-[11px] leading-relaxed text-gray-700">
                          <div className="flex flex-col gap-2">
                              <div className="flex gap-4">
                                  <span className="text-fuchsia-500 font-bold">[ACCÉS]</span>
                                  <span>Oficina Digital SUMA (Apremi)</span>
                              </div>
                              <a href="https://www.suma.es/oficina-digital" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-20 flex items-center gap-1">
                                  https://www.suma.es/oficina-digital <ExternalLink size={10} />
                              </a>
                              <p className="ml-20 text-[10px] text-gray-500">L'IAIA ha extret el deute de {sumaData?.total_pagar || 220.69}€ identificant els immobles 'Barrinada' i 'San Isidro'.</p>
                          </div>
                      </div>
                  </section>

                  <section className="border-2 border-fuchsia-500/20 p-8 rounded-[32px] bg-white">
                      <h4 className="flex items-center gap-3 !border-none !text-fuchsia-600">
                          <Sparkles size={18} /> QUÈ ET QUEDA PER FER AL MESTRE?
                      </h4>
                      <div className="space-y-4 mt-4">
                          <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-black text-xs shrink-0">1</div>
                              <div>
                                  <p className="font-bold text-sm">Liquidació a SUMA</p>
                                  <p className="text-xs text-gray-500">Entra al portal de SUMA amb la teua Clau i bategua el pagament del deute d'apremi per aturar els interessos.</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-black text-xs shrink-0">2</div>
                              <div>
                                  <p className="font-bold text-sm">Presentació a Proaguas</p>
                                  <p className="text-xs text-gray-500">Has de portar el certificat notarial i el rebut de pagament a Proaguas Costa Blanca. L'IAIA t'ha preparat la maleta digital amb aquests papers.</p>
                              </div>
                          </div>
                      </div>
                  </section>

                  <section>
                      <h4>2. Resum de Deutes (SUMA)</h4>
                      <div className="report-data-grid">
                          <div className="report-data-item">
                              <div className="label">Total Apremi</div>
                              <div className="value">{sumaData?.total_pagar || 220.69} €</div>
                          </div>
                          <div className="report-data-item">
                              <div className="label">Data Límit</div>
                              <div className="value">{sumaData?.fecha_limite || '03/03/2026'}</div>
                          </div>
                          <div className="report-data-item">
                              <div className="label">Responsable Javi</div>
                              <div className="value">{(sumaData?.total_pagar / 2 || 110.35).toFixed(2)} €</div>
                          </div>
                          <div className="report-data-item">
                              <div className="label">Responsable Nando</div>
                              <div className="value">{(sumaData?.total_pagar / 2 || 110.35).toFixed(2)} €</div>
                          </div>
                      </div>
                  </section>

                  <div className="sheet-footer">
                      <div className="report-seal">
                          <Landmark size={14} className="text-fuchsia-500" />
                          <span>PROTOCOL ALZINA V5.3</span>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          BATEGAT PER L'ARCHON HERMINIO
                      </div>
                  </div>
              </div>
            </div>

            <footer className="p-8 border-t border-white/5 flex gap-4 bg-black/20">
              <button
                className="flex-1 master-button-canonic bg-fuchsia-600 text-white py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-lg shadow-fuchsia-900/40"
                onClick={() => {
                  navigator.clipboard.writeText(generateHerenciaReport());
                  alert("Text de memòria copiat, Mestre!");
                }}
              >
                COPIAR TEXT DE MEMÒRIA
              </button>
              <button
                className="px-8 bg-white/5 hover:bg-white/10 rounded-full text-xs font-black uppercase transition-all"
                onClick={() => setShowSollutiaGenerator(false)}
              >
                TANCAR INFORME
              </button>
            </footer>
          </div>
        </div>
      )}

      <header className="herencia-header-master">
        <button className="btn-back-ofici" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="herencia-title-group">
          <h1>Protocol Herència Bategat</h1>
          <p>Expedient: 028468 • Protocol Herminio</p>
        </div>
        <div className="herencia-status-badge">
          FASE: LIQUIDACIÓ
        </div>
      </header>

      <div className="herencia-grid-layout">
        {/* 1. L'Ull de la IAIA (Secció d'Anàlisi) */}
        <section className="herencia-section iaia-analysis-section glass-premium overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-fuchsia-400" size={24} />
            <h2 className="text-xl font-black uppercase">L'Ull de la IAIA</h2>
          </div>
          
          <div className="iaia-advice-box fuchsia">
            <p className="italic leading-relaxed shadow-glow-fuchsia">
              "Mestre, les aigües de San Isidro i Barrinada no bateguen gratis. He calculat que el deute de l'Herminio ha pujat per l'apremi ({sumaData?.total_pagar?.toFixed(2) || '226.69'}€). El meu trellat diu: pagueu-ho ja a la web de SUMA per aturar els interessos, i després anirem a Proaguas amb les escriptures."
            </p>
            <div className="flex gap-2 mt-4">
              <span className="tag-k fuchsia">EXP: {sumaData?.expediente || '028468'}</span>
              <span className="tag-k fuchsia">WEB SUMA: OBLIGATORI</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse" />
              <span className="text-xs uppercase font-black opacity-80">Pagament SUMA</span>
              <span className="text-[10px] opacity-40 ml-auto font-black uppercase tracking-widest text-pink-400">Liquidació de {sumaData?.total_pagar?.toFixed(2) || '220.69'}€ (Apremi). Límit: {sumaData?.fecha_limite || '03/03/2026'}</span>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-xs uppercase font-black">Canvi Titularitat</span>
              <span className="text-[10px] opacity-40 ml-auto">Gestió amb Proaguas Costa Blanca.</span>
            </div>
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-xs uppercase font-black">Regularització</span>
              <span className="text-[10px] opacity-40 ml-auto">Actualització de padró a SUMA Sant Joan.</span>
            </div>
          </div>
        </section>

        {/* 2. El Compte del Mas (SUMA) */}
        <section className="herencia-section glass-premium">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-orange-400" size={24} />
            <h2 className="text-xl font-black uppercase">El Compte del Mas (SUMA)</h2>
          </div>

          <div className="debt-table-wrapper">
             <table className="debt-table">
                <thead>
                  <tr>
                    <th>Concepte</th>
                    <th>Ubicació</th>
                    <th>Total</th>
                    <th className="text-fuchsia-400">Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {sumaData ? (
                    sumaData.desglose.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.concepto}</td>
                        <td>{item.inmueble}</td>
                        <td>{item.total.toFixed(2)}€</td>
                        <td className="font-bold text-fuchsia-400 uppercase tracking-widest">
                          {item.responsable === 'Shared' ? 'A MEDIES (3€)' : item.responsable}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 opacity-40 italic">Bategant extracció de SUMA...</td>
                    </tr>
                  )}
                  <tr className="total-row border-t border-white/10">
                    <td colSpan="2">TOTAL A PAGAR</td>
                    <td className="text-lg">{sumaData?.total_pagar?.toFixed(2) || '226.69'}€</td>
                    <td className="text-[10px] font-black text-fuchsia-400 leading-tight">
                      JAVI: {(
                        (sumaData?.desglose.filter(d => d.responsable === 'Javi').reduce((acc, curr) => acc + curr.total, 0) || 0) + 
                        (sumaData?.desglose.filter(d => d.responsable === 'Shared').reduce((acc, curr) => acc + curr.total, 0) / 2 || 0)
                      ).toFixed(2)}€ <br/>
                      NANDO: {(
                        (sumaData?.desglose.filter(d => d.responsable === 'Nando').reduce((acc, curr) => acc + curr.total, 0) || 0) + 
                        (sumaData?.desglose.filter(d => d.responsable === 'Shared').reduce((acc, curr) => acc + curr.total, 0) / 2 || 0)
                      ).toFixed(2)}€
                    </td>
                  </tr>
                </tbody>
             </table>
          </div>

          <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl flex items-center gap-4 mt-4">
            <AlertCircle className="text-orange-500" />
            <span className="text-xs font-black uppercase text-orange-200">Límit de pagament: 03/03/2026</span>
          </div>
        </section>

        {/* 3. Dipòsit Notarial */}
        <section className="herencia-section glass-premium lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-emerald-400" size={24} />
            <h2 className="text-xl font-black uppercase">Dipòsit Notarial (The Vault)</h2>
          </div>

          <div className="docs-list-kit">
            {deeds.map((deed) => (
              <div key={deed.id} className={`doc-kit-item ${deed.analysed ? 'validat' : 'pendent'} group overflow-hidden relative`}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <FileText size={20} className={deed.analysed ? 'text-emerald-400' : 'text-orange-400'} />
                <div className="doc-kit-info">
                  <span className="doc-name font-black tracking-tight">{deed.name}</span>
                  <span className="doc-meta font-bold uppercase tracking-widest text-[9px] opacity-60">
                    Document Herència • {deed.date}
                  </span>
                </div>
                <div className="doc-kit-actions">
                  <button 
                    onClick={() => handleViewMedia(deed)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => setDeeds(prev => prev.filter(d => d.id !== deed.id))}
                  >
                    <X size={16} />
                  </button>
                  {deed.analysed ? (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded border border-emerald-500/20">NOU</span>
                  ) : (
                    <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black rounded border border-orange-500/20">PENDENT</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <label className="btn-kit-upload fuchsia flex flex-col gap-2 items-center justify-center p-8 py-12 group">
              <input type="file" hidden onChange={handleUploadDeed} />
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Pujar Document</span>
            </label>

            <button 
                onClick={handleCaptureSnapshot}
                className="btn-kit-upload accent flex flex-col gap-2 items-center justify-center p-8 py-12 group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Fer Foto o Vídeo</span>
            </button>
          </div>
        </section>
      </div>

      <footer className="herencia-footer-master flex justify-between items-center gap-4">
        <div className="sovereign-badge flex items-center gap-2">
          <Shield size={14} />{" "}
          <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Assistència Protocol Rhizome 🏺</span>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
              className="px-6 py-2.5 bg-fuchsia-600/20 hover:bg-fuchsia-600/40 text-fuchsia-400 border border-fuchsia-500/30 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              onClick={() => setShowSollutiaGenerator(true)}
            >
              <Sparkles size={14} className="inline mr-2" />
              Generar Memòria de Tràmit
            </button>
            
            <button 
              className="p-3 bg-fuchsia-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg shadow-fuchsia-500/40"
              onClick={() => openIAIASidebar('herencia_herminio')}
              title="Parlar amb l'Archon"
            >
              <MessageSquare size={18} />
            </button>
        </div>
      </footer>


      <MediaViewerModal 
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
        media={activeMedia}
      />

      {/* BURBUIXA DE XAT CONTEXTUAL (Archon Bridge) */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        <div className="bg-[#D946EF] text-white px-4 py-2 rounded-2xl rounded-br-none text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce pointer-events-auto border-2 border-white/20">
          "Mestre, parlem de Proaguas?"
        </div>
        <button 
          onClick={() => openIAIASidebar('herencia_herminio')}
          className="w-16 h-16 bg-[#D946EF] text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.5)] border-2 border-white/30 hover:scale-110 transition-all pointer-events-auto relative group"
        >
          <MessageSquare size={28} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        </button>
      </div>
    </div>
  );
};

export default HerenciaManager;
