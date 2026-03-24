import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FileText,
  ChevronRight,
  Calculator,
  Landmark,
  Sprout,
  Home,
  Info,
  Search,
  Bot,
  Shield,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Globe,
  Users,
  X,
  Maximize2
} from "lucide-react";
import KitDigitalManager from "../components/KitDigitalManager";
import HerenciaManager from "../components/HerenciaManager";
import IAIAAssistantFlow from "../components/IAIAAssistantFlow";
import PDFBategatManager from "../components/PDFBategatManager";
import { useNavigation } from '../context/NavigationContext';
import "./OficiDocumentacio.css";

const OficiDocumentacio = () => {
  const navigate = useNavigate();
  const { openIAIASidebar } = useNavigation();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tramitParam = queryParams.get("tramit");
  
  const { iaiaSidebarOpen } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [internalActiveProcedure, setInternalActiveProcedure] = useState(null);
  const [showKitManager, setShowKitManager] = useState(false);
  const [showHerenciaManager, setShowHerenciaManager] = useState(false);
  const [showIAIANavigator, setShowIAIANavigator] = useState(false);
  const [showPDFManager, setShowPDFManager] = useState(false);
  
  // Lightbox State
  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);

  const activeProcedure = id || internalActiveProcedure || tramitParam;

  const documentCategories = [
    {
      id: "associacions",
      title: "Associacions i Identitat",
      icon: <Globe className="cat-icon w-5 h-5" />,
      color: "#3B82F6",
      image: "/assets/nanobanana/nanobanana_asso_identity.png",
      description: "Registre internacional DUNS/ISSN i tràmits associatius.",
      procedures: [
        {
          id: "iaia-navigator-flow",
          title: "IAIA Navigator (Tràmit Assistit)",
          status: "active",
          official_code: "INT-NAV",
        },
        {
          id: "duns-request",
          title: "Sol·licitud de Número DUNS",
          status: "active",
          official_code: "DNB-INT",
        },
        {
          id: "estatuts-review",
          title: "Revisió d'Estatuts per l'IAIA",
          status: "coming-soon",
        },
      ],
    },
    {
      id: "agricultura",
      title: "Agricultura i Camp",
      icon: <Sprout className="cat-icon w-5 h-5" />,
      color: "#22c55e",
      image: "/assets/nanobanana/nanobanana_agro_camp.png",
      description: "Ajudes de la PAC, Xylella, cremes i pous.",
      procedures: [
        {
          id: "xylella-fastidiosa",
          title: "Ayudes Xylella Fastidiosa (Seguiment)",
          status: "active",
          official_code: "18932",
        },
        {
          id: "crema-restes",
          title: "Permís de Crema de Restes (Tramitar)",
          status: "active",
          official_code: "CRM-2026",
        },
      ],
    },
    {
      id: "vivenda",
      title: "Venda i Urbanisme",
      icon: <Home className="cat-icon w-5 h-5" />,
      color: "#3b82f6",
      image: "/assets/nanobanana/nanobanana_urban_venda.png",
      description: "Certificats, llicències d'obra i IBI.",
      procedures: [
        {
          id: "cedula-vivienda",
          title: "Cèdula d'Habitabilitat",
          status: "coming-soon",
        },
      ],
    },
    {
      id: "bancari",
      title: "Banc i Hisenda",
      icon: <Landmark className="cat-icon w-5 h-5" />,
      color: "#f59e0b",
      image: "/assets/nanobanana/nanobanana_banc_hisenda.png",
      description: "Domiciliacions, impostos i tràmits bancaris.",
      procedures: [
        {
          id: "domiciliacio-bancaria",
          title: "Model de Domiciliació Bancària",
          status: "active",
        },
        {
            id: "solicitud-general-ajuntament",
            title: "Sol·licitud General (PDF Emplenable)",
            status: "active",
            official_code: "GEN-01",
          },
      ],
    },
    {
      id: "kit-digital",
      title: "Kit Digital (Govern)",
      icon: <Bot className="cat-icon w-5 h-5" />,
      color: "#FF6D23",
      image: "/assets/nanobanana/nanobanana_kit_digital.png",
      description: "Ajudes per a la digitalització (PIMES i Autònoms).",
      procedures: [
        {
          id: "kit-digital-solicitud",
          title: "Gestió de Documents Kit Digital",
          status: "active",
          official_code: "KD-2024",
        },
      ],
    },
    {
      id: "herencia",
      title: "Herència i Successions",
      icon: <Landmark className="cat-icon w-5 h-5" />,
      color: "#D946EF",
      image: "/assets/nanobanana/nanobanana_herencia.png",
      description: "Protocol Notarial 1911/2024 (Herència).",
      procedures: [
        {
          id: "herencia",
          title: "Tramitació d'Herència (Assisència IAIA)",
          status: "active",
          official_code: "HP-2026",
        },
      ],
    },
  ];

  const filteredCategories = documentCategories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.procedures.some((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // Procedure Flows Blocks...
  if (showKitManager && activeProcedure === "kit-digital-solicitud") {
    return (
      <KitDigitalManager
        onBack={() => {
          setShowKitManager(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (showHerenciaManager && activeProcedure === "herencia") {
    return (
      <HerenciaManager
        onBack={() => {
          setShowHerenciaManager(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (showPDFManager && activeProcedure === "solicitud-general-ajuntament") {
    return (
      <PDFBategatManager
        onBack={() => {
          setShowPDFManager(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (
    showIAIANavigator &&
    (activeProcedure === "iaia-navigator-flow" ||
      activeProcedure === "duns-request")
  ) {
    return (
      <IAIAAssistantFlow
        onBack={() => {
          setShowIAIANavigator(false);
          setInternalActiveProcedure(null);
          if (id || tramitParam) navigate("/ofici", { replace: true });
        }}
      />
    );
  }

  if (
    activeProcedure === "kit-digital-solicitud" ||
    activeProcedure === "crema-restes" ||
    activeProcedure === "xylella-fastidiosa" ||
    activeProcedure === "herencia" ||
    activeProcedure === "iaia-navigator-flow" ||
    activeProcedure === "duns-request" ||
    activeProcedure === "solicitud-general-ajuntament"
  ) {
    let title = "PROCEDIMENT EN MARXA";
    let desc = "";

    if (activeProcedure === "herencia") {
      title = "PROTOCOL HERÈNCIA BATEGAT";
      desc =
        '"Mestre, estic preparant el Protocol Notarial 1911/2024. He bategat la teua identitat i estic revisant el Dipòsit Notarial per a l\'Herència. Un momentet..."';
    } else if (
      activeProcedure === "iaia-navigator-flow" ||
      activeProcedure === "duns-request"
    ) {
      title = "IAIA NAVIGATOR: REGISTRE INTERNACIONAL";
      desc =
        '"Mestre, estic activant el IAIA Navigator per a guiar-te en el registre del número DUNS. Digues-me quan estigues a punt."';
    } else if (activeProcedure === "solicitud-general-ajuntament") {
        title = "GENERADOR DE SOL·LICITUDS";
        desc = '"Mestre, he preparat el bategador de PDFs. Emplenarem el formulari i el deixarem llest per a la teua signatura."';
    } else {
      desc = `"Mestre, estic connectant amb els servidors de la Generalitat per a gestionar el teu tràmit de ${
        activeProcedure === "crema-restes"
          ? "Permís de Crema"
          : activeProcedure === "xylella-fastidiosa"
          ? "Ajudes Xylella"
          : "Kit Digital"
      }. Un momentet..."`;
    }

    return (
      <div
        className={`ofici-page flex-1 bg-theme-base text-theme-text p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 min-h-screen transition-all duration-500 ${
          iaiaSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div
          className={`w-32 h-32 rounded-full ${
            activeProcedure === "herencia"
              ? "bg-fuchsia-500/10 border-fuchsia-500"
              : activeProcedure === "iaia-navigator-flow" ||
                activeProcedure === "duns-request"
              ? "bg-cyan-500/10 border-cyan-500"
              : "bg-orange-500/10 border-orange-500"
          } border-2 flex items-center justify-center mb-8`}
        >
          <Bot
            size={64}
            className={
              activeProcedure === "herencia"
                ? "text-fuchsia-500"
                : activeProcedure === "iaia-navigator-flow" ||
                  activeProcedure === "duns-request"
                ? "text-cyan-500"
                : "text-orange-500"
            }
          />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase text-theme-text">
          {title}
        </h2>
        <p className="max-w-md text-theme-text opacity-70 text-lg mb-8 italic">{desc}</p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setInternalActiveProcedure(null);
              if (id || tramitParam) {
                navigate("/ofici", { replace: true });
              }
            }}
            className="px-8 py-3 bg-[var(--bg-panel)] hover:brightness-110 text-theme-text border border-[var(--border-master)] rounded-[28px] font-bold uppercase tracking-widest text-xs transition-all"
          >
            Tornar enrere
          </button>
          <button
            onClick={() => {
              if (activeProcedure === "kit-digital-solicitud") {
                setShowKitManager(true);
              } else if (activeProcedure === "herencia") {
                setShowHerenciaManager(true);
              } else if (
                activeProcedure === "iaia-navigator-flow" ||
                activeProcedure === "duns-request"
              ) {
                setShowIAIANavigator(true);
              } else if (activeProcedure === "solicitud-general-ajuntament") {
                setShowPDFManager(true);
              }
            }}
            className={`px-8 py-3 ${
              activeProcedure === "herencia"
                ? "bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-900/40"
                : activeProcedure === "iaia-navigator-flow" ||
                  activeProcedure === "duns-request"
                ? "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/40"
                : "bg-[var(--theme-accent-primary)] hover:bg-[#ff7b20] shadow-orange-900/40"
            } text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-2`}
          >
            Continuar amb la IAIA
          </button>
          <button
            onClick={() =>
              openIAIASidebar(
                activeProcedure === "herencia"
                  ? "herencia_herminio"
                  : "ofici_general",
              )
            }
            className="p-4 bg-fuchsia-600 text-white rounded-[28px] hover:scale-110 transition-transform shadow-lg shadow-fuchsia-500/20"
            title="Parlar amb la IAIA"
          >
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`ofici-page bg-theme-base min-h-screen animate-in transition-all duration-500 ${iaiaSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Header Area */}
      <div className="px-6 md:px-12 pt-12 pb-8 sticky top-0 bg-theme-base/90 backdrop-blur-xl z-20 border-b border-[var(--border-master)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-[var(--bg-panel)] hover:brightness-110 text-theme-text border-[var(--border-master)] rounded-full transition-colors border"
              title="Tornar deixant les eines a la taula"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-theme-text drop-shadow-md flex items-center gap-2">
                Ofici de Documentació 
                <span className="bg-orange-600 text-[10px] px-2 py-1 rounded-sm leading-none ml-2 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]">BETA</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-1">
                Eines i Procediments Administratius d'Alta Tensió
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="relative group w-full lg:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Què vols gestionar hui?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--bg-panel)] border-[var(--border-master)] text-theme-text focus:brightness-110 border rounded-[28px] py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500/50 transition-all placeholder:opacity-50 uppercase tracking-widest"
                />
            </div>
            <button
              onClick={() => navigate("/buscador-ajudes")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-[28px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0"
            >
              <Sparkles size={18} />
              <span className="hidden md:inline">Subvencions</span>
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="relative group rounded-[32px] overflow-hidden bg-theme-panel border border-[var(--border-master)] hover:shadow-2xl transition-all hover:-translate-y-2 duration-500 flex flex-col h-full">
              {/* Card Image Area with NanoBanana Art */}
              <div className="relative h-56 w-full shrink-0 overflow-hidden bg-[var(--bg-app)] border-b border-[var(--border-master)]">
                 <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                 />
                 <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg-panel)] via-[var(--bg-panel)]/80 to-transparent"></div>
                 {/* NanoBanana Signature Overlay */}
                 <div className="absolute top-4 right-4 glass-panel px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-theme-text opacity-50 pointer-events-none">
                     Autor: NanoBanana
                 </div>
                 {/* Lightbox Trigger */}
                 <button 
                    onClick={() => setLightboxImage(category.image)}
                    className="absolute top-4 left-4 p-2 glass-panel rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-theme-text hover:brightness-125"
                    title="Veure Art en Gran"
                 >
                    <Maximize2 size={16} />
                 </button>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col relative z-10 -mt-12">
                 <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-xl border border-[var(--border-master)] bg-[var(--bg-app)] flex items-center justify-center shadow-lg" style={{ color: category.color }}>
                         {category.icon}
                     </div>
                     <h3 className="text-xl sm:text-2xl font-black text-theme-text leading-tight uppercase tracking-tight flex-1">
                        {category.title}
                     </h3>
                 </div>
                 <p className="text-sm text-theme-text opacity-70 font-medium mb-6 flex-1">
                    {category.description}
                 </p>

                 {/* Procedures List */}
                 <div className="flex flex-col gap-2 w-full mt-auto">
                      {category.procedures.map((proc) => (
                        <button
                          key={proc.id}
                          className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all border ${
                            proc.status === "active" 
                                ? "bg-[var(--bg-app)] border-[var(--border-master)] hover:bg-[var(--bg-panel)] text-theme-text cursor-pointer"
                                : "bg-[var(--bg-app)] opacity-50 border-transparent text-theme-text cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (proc.status === "active") setInternalActiveProcedure(proc.id);
                          }}
                        >
                          <div className="flex flex-col pr-4">
                            <span className="text-sm font-bold truncate block">{proc.title}</span>
                            {proc.official_code && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6D23] mt-1 opacity-80 block">
                                Codi: {proc.official_code}
                              </span>
                            )}
                          </div>
                          {proc.status === "active" ? (
                            <ChevronRight size={18} className="shrink-0 text-theme-text opacity-50" />
                          ) : (
                            <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm bg-black/10 dark:bg-white/10 text-theme-text opacity-60">
                              Pròxim
                            </span>
                          )}
                        </button>
                      ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NanoBanana Image Lightbox Overlay */}
      {lightboxImage && (
          <div className="fixed inset-0 z-[100] bg-theme-base/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
              <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-6 right-6 p-4 rounded-full transition-colors border z-10 glass-panel hover:brightness-110 text-theme-text"
              >
                  <X size={24} />
              </button>
              <div className="relative w-full max-w-5xl md:h-[80vh] flex flex-col items-center justify-center rounded-[40px] overflow-hidden border border-[var(--border-master)] bg-theme-panel shadow-2xl">
                  <img src={lightboxImage} alt="Premium Art" className="w-full h-full object-contain" />
                  <div className="absolute bottom-6 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest glass-panel text-theme-text text-opacity-70">
                     Gènesi Art / Autor: NanoBanana
                 </div>
              </div>
          </div>
      )}

      {/* Footer minimalista */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-[var(--border-master)] z-10 pointer-events-none flex items-center justify-between backdrop-blur-md bg-theme-base/90">
         <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-master)] w-fit text-theme-text bg-[var(--bg-panel)] opacity-80">
            <Shield size={14} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dades xifrades amb Rhizome DB</span>
         </div>
      </footer>
    </div>
  );
};

export default OficiDocumentacio;
