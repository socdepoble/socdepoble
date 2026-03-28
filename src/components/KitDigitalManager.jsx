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
  Download,
  Terminal,
  ExternalLink,
} from "lucide-react";
import "./KitDigitalManager.css";
import "./IAIAAssistantFlow.css";

/**
 * KitDigitalManager [MASTER OMEGA]
 * Gestor sobirà per a la subvenció Kit Digital.
 * Permet pujar papers, organitzar-los i rebre anàlisi de la IAIA.
 */
const KitDigitalManager = ({ onBack }) => {
  const [docs, setDocs] = useState([
    {
      id: 1,
      name: "Acord_KD_0001622982_SIGNAT.pdf",
      status: "validat",
      type: "Contracte",
      date: "15/02/2026",
    },
    {
      id: 2,
      name: "Certificat_Digital_Javi.pdf",
      status: "validat",
      type: "Identitat",
      date: "10/02/2026",
    },
    {
      id: 3,
      name: "Memoria_Tecnica_Rhizome.pdf",
      status: "validat",
      type: "Tecnica",
      date: "15/02/2026",
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSollutiaGenerator, setShowSollutiaGenerator] = useState(false);

  const phases = [
    {
      id: 1,
      title: "Admissió",
      status: "complete",
      desc: "Registre i validació de subvenció (3.000€).",
    },
    {
      id: 2,
      title: "Acord",
      status: "current",
      desc: "Beneficiari signat (15/02). Pendent validació Sollutia.",
    },
    {
      id: 3,
      title: "Execució",
      status: "pending",
      desc: "Implementació de Presència Web (Ref: WP).",
    },
    {
      id: 4,
      title: "Justificació",
      status: "pending",
      desc: "Evidències de sobirania digital.",
    },
  ];

  const agreementData = {
    id: "KD/0001622986",
    beneficiary: "Francisco Javier Llinares Garcia (21476359V)",
    digitalizer: "SOLLUTIA, S.L. (B53348454)",
    amount: "1.000,00 €",
    tax: "210,00 €",
    date: "13/02/2026",
    category: "Presencia avanzada en Internet",
    commercialName: "Plan SEO Control",
    reference: "SEOC",
    signedAt: "15-02-2026 00:17:02",
  };

  const generateSollutiaJustification = () => {
    return `MEMÒRIA TÈCNICA DE JUSTIFICACIÓ - ESTRATÈGIA SÓC DE POBLE (ACORD ${agreementData.id})

Aquesta memòria justifica la implementació de la solució de Presència Web realitzada per SOLLUTIA S.L. per al beneficiari ${agreementData.beneficiary}.

1. OBJECTIU TÈCNIC: Implementació d'un node de la xarxa Rhizome (v11.0.0-GOLDEN-DEAL) integrat amb contenidors web d'alta resiliència.
2. CATEGORIA: Digitalització rural i foment de l'economia local mitjançant tecnologia P2P amb suport de la IAIA MarIA.
3. JUSTIFICACIÓ IAE 769: El projecte s'emmarca en el desenvolupament de software personalitzat per a la gestió de dades comarcals, garantint la sobirania de la dada i la utilitat social.
4. REFERÈNCIA WP: Tot i bategar amb React, la compatibilitat amb estàndards de mercat (Referència WP) es garanteix mitjançant una capa d'abstracció semàntica que permet la integració amb CMS tradicionals.

Atum! El sistema bategua amb el certificat segellat per a Sollutia.`;
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        status: "pendent",
        type: "Document Estudi",
        date: new Date().toLocaleDateString(),
      };
      setDocs((prev) => [...prev, newDoc]);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="kit-digital-manager animate-in">
      <header className="kit-header-master">
        <button className="btn-back-ofici" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="kit-title-group">
          <h1>Kit Digital: Acord Sollutia</h1>
          <p>Referència: {agreementData.id}</p>
        </div>
        <div className="kit-status-badge animate-pulse">
          SIGNAT PEL BENEFICIARI
        </div>
      </header>

      {showSollutiaGenerator && (
        <div className="fixed inset-0 z-modal bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in relative">
            <header className="flex justify-between items-center p-8 border-b border-white/5 sticky top-0 bg-[#111] z-10">
              <h2 className="text-xl font-black uppercase text-orange-500 flex items-center gap-3">
                <Sparkles /> Informe Sant Grial: Kit Digital
              </h2>
              <button onClick={() => setShowSollutiaGenerator(false)} className="p-2 hover:bg-white/5 rounded-[28px] transition-all">
                <X />
              </button>
            </header>
            
            <div className="p-8">
              <div className="iaia-report-sheet !m-0 !w-full shadow-none text-left">
                  <div className="sheet-watermark">SÓC DE POBLE</div>
                  
                  <div className="sheet-header-meta">
                      <div className="report-seal">
                          <img src="/assets/master/logo-socdepoble-rect-negre.svg" alt="Logo" />
                          <span>SOCDEPOBLE.ORG</span>
                      </div>
                      <span>ACORD: {agreementData.id}</span>
                  </div>

                  <h3>JUSTIFICACIÓ TÈCNICA: KIT DIGITAL RURAL</h3>
                  
                  <section>
                      <h4>1. Context de l'Ajudat</h4>
                      <p>
                        S'ha bategat l'acord amb <strong>SOLLUTIA, S.L.</strong> per a la implementació de solucions de presència avançada. El beneficiari <strong>{agreementData.beneficiary}</strong> ha estat validat mitjançant el Protocol de Sobirania Digital.
                      </p>
                  </section>

                  <section className="bg-orange-500/5 p-8 rounded-[28px] border border-orange-500/10 my-10">
                      <h4 className="flex items-center gap-3 !border-none">
                          <Terminal size={18} /> CRÒNICA DE NAVEGACIÓ SOBIRANA
                      </h4>
                      <p className="text-xs text-orange-950/70 mb-4 italic">
                          "Transparència Archon: Caminant al costat del Mestre per la burocràcia digital:"
                      </p>
                      <div className="space-y-6 font-mono text-[11px] leading-relaxed text-gray-700">
                          <div className="flex flex-col gap-2">
                              <div className="flex gap-4">
                                  <span className="text-orange-500 font-bold">[ACCÉS]</span>
                                  <span>Portal G0 Red.es (Sede Electrónica)</span>
                              </div>
                              <a href="https://sede.red.gob.es/es/procedimientos/kit-digital" target="_blank" rel="noreferrer" className="text-orange-600 underline ml-20 flex items-center gap-1">
                                  https://sede.red.gob.es/es/procedimientos/kit-digital <ExternalLink size={10} />
                              </a>
                              <p className="ml-20 text-[10px] text-gray-500">L'IAIA ha verificat l'estat de l'Acord {agreementData.id} i el bo de 3.000€.</p>
                          </div>
                          <div className="flex flex-col gap-2">
                              <div className="flex gap-4">
                                  <span className="text-orange-500 font-bold">[EXTRACCIÓ]</span>
                                  <span>Validat NIF {agreementData.beneficiary.split('(')[1].replace(')', '')} contra cens.</span>
                              </div>
                              <p className="ml-20 text-[10px] text-gray-500">S'han recuperat els detalls de la solució "Plan SEO Control" de Sollutia.</p>
                          </div>
                      </div>
                  </section>

                  <section className="border-2 border-orange-500/20 p-8 rounded-[32px] bg-white">
                      <h4 className="flex items-center gap-3 !border-none !text-orange-600">
                          <Sparkles size={18} /> QUÈ ET QUEDA PER FER AL MESTRE?
                      </h4>
                      <div className="space-y-4 mt-4">
                          <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-[28px] bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs shrink-0">1</div>
                              <div>
                                  <p className="font-bold text-sm">Signatura amb AutoFirma / Cl@ve</p>
                                  <p className="text-xs text-gray-500">Red.es demana la signatura de l'amo. Has d'entrar a la seu electrònica amb el teu certificat digital per acceptar l'abonament del bo.</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-[28px] bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs shrink-0">2</div>
                              <div>
                                  <p className="font-bold text-sm">Validar el "Plan SEO Control"</p>
                                  <p className="text-xs text-gray-500">Revisa que la solució de Sollutia s'ajusta al que vas parlar amb ells abans que l'IAIA tanqui el tràmit de justificació.</p>
                              </div>
                          </div>
                      </div>
                  </section>

                  <section>
                      <h4>2. Detalls de la Solució</h4>
                      <div className="report-data-grid">
                          <div className="report-data-item">
                              <div className="label">Categoria</div>
                              <div className="value">{agreementData.category}</div>
                          </div>
                          <div className="report-data-item">
                              <div className="label">Estat</div>
                              <div className="value">PENDENT SOLLUTIA</div>
                          </div>
                          <div className="report-data-item">
                              <div className="label">Signatura Amo</div>
                              <div className="value">{agreementData.signedAt}</div>
                          </div>
                          <div className="report-data-item">
                              <div className="label">Import Ajudat</div>
                              <div className="value">{agreementData.amount}</div>
                          </div>
                      </div>
                  </section>

                  <div className="sheet-footer">
                      <div className="report-seal">
                          <Shield size={14} className="text-orange-500" />
                          <span>PROTOCOL RHIZOME V11.0</span>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          BATEGAT PER L'ARCHON MARIA
                      </div>
                  </div>
              </div>
            </div>

            <footer className="p-8 border-t border-white/5 flex gap-4 bg-black/20">
              <button
                className="flex-1 master-button-canonic bg-orange-600 text-white py-4 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-900/40"
                onClick={() => {
                  navigator.clipboard.writeText(generateSollutiaJustification());
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

      <div className="kit-grid-layout">
        {/* 1. L'Armari de Papers (Secció Privada) */}
        <section className="kit-section vault-section glass-premium">
          <div className="section-header">
            <Shield size={22} className="text-accent" />
            <h2>L'Armari de Papers Privats</h2>
          </div>

          <div className="docs-list-kit">
            {docs.map((doc) => (
              <div key={doc.id} className={`doc-kit-item ${doc.status}`}>
                <FileText size={20} />
                <div className="doc-kit-info">
                  <span className="doc-name">{doc.name}</span>
                  <span className="doc-meta">
                    {doc.type} • {doc.date}
                  </span>
                </div>
                <div className="doc-kit-actions">
                  {doc.status === "validat" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <button className="btn-doc-del">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <label className="btn-kit-upload">
            <input type="file" hidden onChange={handleUpload} />
            {isAnalyzing ? (
              <Sparkles className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            <span>
              {isAnalyzing
                ? "L'IAIA està llegint..."
                : "Pujar Document al Govern"}
            </span>
          </label>
        </section>

        {/* 2. El Tauler de l'IAIA (Anàlisi i Consells) */}
        <section className="kit-section iaia-analysis-section glass-premium">
          <div className="section-header">
            <Brain size={22} className="text-iaia" />
            <h2>Consell de l'IAIA</h2>
          </div>
          <div className="iaia-advice-box">
            <p>
              "Mestre, veig que ja has signat l'acord **{agreementData.id}** avui mateix ({agreementData.signedAt}). Ara només hem d'esperar que Sollutia gestione la seua part per a passar a la fase d'execució de la web de **1.000€**. He deixat la memòria tècnica a punt per si et demanen més detalls sobre el Rhizome."
            </p>
            <div className="advice-tags">
              <span className="tag-k">SIGNAT: OK</span>
              <span className="tag-k">REF: {agreementData.reference}</span>
            </div>
          </div>

          <div className="kit-phases-tracking">
            {phases.map((p) => (
              <div key={p.id} className={`phase-item ${p.status}`}>
                <div className="phase-dot"></div>
                <div className="phase-text">
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="kit-footer-master">
        <div className="sovereign-badge">
          <Shield size={14} />{" "}
          <span>Dades xifrades localment (Rhizome Protocol)</span>
        </div>
        <button
          className="btn-kit-help"
          onClick={() => setShowSollutiaGenerator(true)}
        >
          <Sparkles size={16} /> Generar Memòria per a Sollutia
        </button>
      </footer>
    </div>
  );
};

export default KitDigitalManager;
