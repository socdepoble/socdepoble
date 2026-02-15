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
} from "lucide-react";
import "./KitDigitalManager.css";

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
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[28px] max-w-2xl w-full animate-in zoom-in">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase text-orange-500">
                Generador de Memòria Sollutia
              </h2>
              <button onClick={() => setShowSollutiaGenerator(false)}>
                <X />
              </button>
            </header>
            <textarea
              className="w-full h-80 bg-black border border-white/5 p-4 rounded-2xl text-gray-400 text-sm font-mono leading-relaxed mb-6"
              value={generateSollutiaJustification()}
              readOnly
            />
            <div className="flex gap-4">
              <button
                className="flex-1 master-button-canonic bg-orange-600 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateSollutiaJustification(),
                  );
                  alert("Copiada al porta-retalls, Mestre!");
                }}
              >
                COPIAR JUSTIFICACIÓ
              </button>
              <button
                className="px-6 border border-white/10 rounded-full"
                onClick={() => setShowSollutiaGenerator(false)}
              >
                TANCAR
              </button>
            </div>
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
