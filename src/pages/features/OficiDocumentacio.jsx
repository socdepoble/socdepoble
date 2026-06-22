import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Globe, Sprout, Home, Landmark, Bot, ArrowLeft, Search, Sparkles, Maximize2, ChevronRight, X } from 'lucide-react';
import { useNavigation } from '../../app/context/NavigationContext';
import "./OficiDocumentacio.css";

const OficiDocumentacio = () => {
  const navigate = useNavigate();
  const { openIAIASidebar, iaiaSidebarOpen } = useNavigation();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tramitParam = queryParams.get("tramit");
  const [searchTerm, setSearchTerm] = useState("");

  const [lightboxImage, setLightboxImage] = useState(null);
  
  const documentCategories = [{
    id: "associacions",
    title: "Associacions i Identitat",
    icon: <Globe className="w-5 h-5" />,
    color: "#3B82F6",
    image: "/assets/brand/nanobanana-asso-identity-1772350128114.png",
    description: "Registre internacional DUNS/ISSN i tràmits associatius.",
    procedures: [{
      id: "iaia-navigator-flow",
      title: "IAIA Navigator (Tràmit Assistit)",
      status: "active",
      official_code: "INT-NAV"
    }, {
      id: "duns-request",
      title: "Sol·licitud de Número DUNS",
      status: "active",
      official_code: "DNB-INT"
    }, {
      id: "estatuts-review",
      title: "Revisió d'Estatuts per l'IAIA",
      status: "coming-soon"
    }]
  }, {
    id: "agricultura",
    title: "Agricultura i Camp",
    icon: <Sprout className="w-5 h-5" />,
    color: "#22c55e",
    image: "/assets/brand/nanobanana-agro-camp-1772350140809.png",
    description: "Ajudes de la PAC, Xylella, cremes i pous.",
    procedures: [{
      id: "xylella-fastidiosa",
      title: "Ayudes Xylella Fastidiosa (Seguiment)",
      status: "active",
      official_code: "18932"
    }, {
      id: "crema-restes",
      title: "Permís de Crema de Restes (Tramitar)",
      status: "active",
      official_code: "CRM-2026"
    }]
  }, {
    id: "vivenda",
    title: "Venda i Urbanisme",
    icon: <Home className="w-5 h-5" />,
    color: "#3b82f6",
    image: "/assets/brand/nanobanana-urban-venda-1772350155362.png",
    description: "Certificats, llicències d'obra i IBI.",
    procedures: [{
      id: "cedula-vivienda",
      title: "Cèdula d'Habitabilitat",
      status: "coming-soon"
    }]
  }, {
    id: "bancari",
    title: "Banc i Hisenda",
    icon: <Landmark className="w-5 h-5" />,
    color: "#f59e0b",
    image: "/assets/brand/nanobanana-banc-hisenda-1772350168169.png",
    description: "Domiciliacions, impostos i tràmits bancaris.",
    procedures: [{
      id: "domiciliacio-bancaria",
      title: "Model de Domiciliació Bancària",
      status: "active"
    }, {
      id: "solicitud-general-ajuntament",
      title: "Sol·licitud General (PDF Emplenable)",
      status: "active",
      official_code: "GEN-01"
    }]
  }, {
    id: "kit-digital",
    title: "Kit Digital (Govern)",
    icon: <Bot className="w-5 h-5" />,
    color: "#FF6D23",
    image: "/assets/brand/nanobanana-kit-digital-1772350182419.png",
    description: "Ajudes per a la digitalització (PIMES i Autònoms).",
    procedures: [{
      id: "kit-digital-solicitud",
      title: "Gestió de Documents Kit Digital",
      status: "active",
      official_code: "KD-2024"
    }]
  }, {
    id: "herencia",
    title: "Herència i Successions",
    icon: <Landmark className="w-5 h-5" />,
    color: "#D946EF",
    image: "/assets/brand/nanobanana-herencia-1772350195319.png",
    description: "Protocol Notarial 1911/2024 (Herència).",
    procedures: [{
      id: "herencia",
      title: "Tramitació d'Herència (Assisència IAIA)",
      status: "active",
      official_code: "HP-2026"
    }]
  }];

  const filteredCategories = documentCategories.filter(cat => cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || cat.procedures.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className={`bg-white min-h-screen transition-all duration-500 ${iaiaSidebarOpen ? "pr-80" : ""}`}>
        <div className='px-6 md:px-12 pt-12 pb-8 sticky top-0 bg-white/90 backdrop-blur-xl z-20 border-b border-gray-200'>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className='p-3 bg-white hover:bg-gray-50 text-gray-900 border-gray-200 rounded-full transition-colors border' title="Tornar deixant les eines a la taula">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-gray-900 drop-shadow-md flex items-center gap-2 m-0">
                  Ofici de Documentació 
                  <span className="bg-orange-600 text-xs px-2 py-1 rounded-sm leading-none ml-2 text-white">BETA</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mt-1 m-0">
                  Eines i Procediments Administratius d'Alta Tensió
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
               <div className="relative group w-full lg:w-80">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" placeholder="Què vols gestionar hui?" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='w-full bg-white border border-gray-200 text-gray-900 rounded-full py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-400 uppercase tracking-widest shadow-sm' />
              </div>
              <button onClick={() => navigate("/buscador-ajudes")} className="flex items-center gap-2 px-6 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-black uppercase tracking-wider transition-all shadow-sm shrink-0">
                <Sparkles size={18} />
                <span className="hidden md:inline">Subvencions</span>
              </button>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCategories.map(category => (
              <div key={category.id} className='relative group rounded-[32px] overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 flex flex-col h-full'>
                <div className='relative h-56 w-full shrink-0 overflow-hidden bg-gray-100 border-b border-gray-200'>
                   <img src={category.image} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none'></div>
                   <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-gray-900 pointer-events-none">
                       Autor: NanoBanana
                   </div>
                   <button onClick={() => setLightboxImage(category.image)} className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-900 hover:bg-white" title="Veure Art en Gran">
                      <Maximize2 size={16} />
                   </button>
                </div>

                <div className="flex-1 p-6 sm:p-8 flex flex-col relative z-10 -mt-12">
                   <div className="flex items-center gap-3 mb-4">
                       <div className='w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm shrink-0' style={{ color: category.color }}>
                           {category.icon}
                       </div>
                       <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight flex-1 m-0">
                          {category.title}
                       </h3>
                   </div>
                   <p className="text-sm text-gray-600 font-medium mb-6 flex-1 m-0">
                      {category.description}
                   </p>

                   <div className="flex flex-col gap-2 w-full mt-auto">
                        {category.procedures.map(proc => (
                          <button key={proc.id} className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all border ${proc.status === "active" ? "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-900 cursor-pointer" : "bg-gray-50/50 border-transparent text-gray-400 cursor-not-allowed"}`} onClick={() => {
                            if (proc.status === "active") navigate(`/ofici/${proc.id}`);
                          }}>
                              <div className="flex flex-col pr-4 min-w-0 flex-1">
                                <span className={`text-sm font-bold truncate block w-full ${proc.status === "active" ? "text-gray-900" : "text-gray-500"}`}>{proc.title}</span>
                                {proc.official_code && (
                                  <span className="text-xs font-black uppercase tracking-widest text-orange-600 mt-1 block truncate">
                                    Codi: {proc.official_code}
                                  </span>
                                )}
                              </div>
                              {proc.status === "active" ? (
                                <ChevronRight size={18} className="shrink-0 text-gray-400" />
                              ) : (
                                <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-200 text-gray-500">
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

        {lightboxImage && (
            <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
                <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 p-4 rounded-full transition-colors border border-gray-200 z-10 bg-white hover:bg-gray-50 text-gray-900">
                    <X size={24} />
                </button>
                <div className='relative w-full max-w-5xl md:h-[80vh] flex flex-col items-center justify-center rounded-[40px] overflow-hidden border border-gray-200 bg-white shadow-2xl'>
                    <img src={lightboxImage} alt="Premium Art" className="w-full h-full object-contain" />
                    <div className="absolute bottom-6 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-sm">
                       Gènesi Art / Autor: NanoBanana
                   </div>
                </div>
            </div>
        )}
      </div>
  );
};

export default OficiDocumentacio;