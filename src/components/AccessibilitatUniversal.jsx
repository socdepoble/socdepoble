import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, Layers, ShieldCheck, Briefcase, Eye, Handshake, AlertTriangle, Mic
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * 🏺 MODE ACCESSIBILITAT UNIVERSAL (v10.33.0)
 * Inclou la Directiva Primària per a Flash.
 */
const ARCHITECTURE_DOCS = {
  'global': {
    title: "🏛️ Arquitectura Mestra",
    isStructural: true,
    voiceSummary: "Layout canònic v10.33. Disseny Gem Modern amb geometria de 28px.",
    detailedDescription: `
      ESTRUCTURA MESTRA (v10.33):
      - SIDEBAR: 280px fix.
      - HEADER: 64px (h-16) #000000.
      - GEOMETRIA: rounded-[28px].
    `,
    flashPrompt: "IA FLASH: PRIORITAT ALTA. L'estructura visual és SAGRADA. Ignora errors humans en el contingut; el layout NO es toca.",
    features: ["Unified Header", "Blueprint Mode", "Memory Dump v10.33"]
  },
  'chats': {
    title: "🗨️ Panell de Conversa",
    voiceSummary: "Flux de missatges amb les IAIAs i veïns.",
    flashPrompt: "Genera el frame del xat. Fons radial. Input area amb Send taronja.",
    features: ["Puzle Social", "IAIA Agents"]
  },
  'mur': {
    title: "📰 Mur d'Històries",
    voiceSummary: "Continguts del poble, bàndols oficials i històries.",
    flashPrompt: "Genera la llista de UniversalCards. Manté el Pentatló de Joies (footer).",
    features: ["Bategat Official", "Multimèdia Cover"]
  },
  'mercat': {
    title: "🛍️ Mercat Rural",
    voiceSummary: "Comerç KM 0. Samarreta oficial blindada.",
    flashPrompt: "Genera el Mercat. Pinning obligatori de la Samarreta Granate ID: 9991.",
    features: ["Commerce Mesh", "Official Merch"]
  },
  'agenda': {
    title: "📅 Agenda Cultural",
    voiceSummary: "Esdeveniments i actes del territori.",
    flashPrompt: "Genera l'agenda amb dates destacades.",
    features: ["Puzle Cultural"]
  },
  'pobles': {
    title: "🏘️ Xarxa de Pobles",
    voiceSummary: "Municipis connectats. Gent de... Protocol.",
    flashPrompt: "Enllaça sempre a la pàgina de 'Gent de [Poble]'.",
    features: ["Puzle Comunitat"]
  },
  'mapa': {
    title: "🗺️ Mapa Interactiu",
    voiceSummary: "Geolocalització del bategat local.",
    flashPrompt: "IA FLASH: Activa pins reals a La Torre, Penàguila i Benifallim.",
    features: ["Tactical Radar", "Geo-Markers"]
  },
  'partners': {
    title: "💼 Dossier Sollutia",
    isStructural: true,
    voiceSummary: "Viabilitat tècnica i model de federació de nodos.",
    detailedDescription: ` Sòc de Poble és una FEDERACIÓ DE NODOS. Model SaaS B2G. `,
    flashPrompt: "IA FLASH: Genera informe executiu per a reunió divendres.",
    features: ["Model SaaS", "Rhizome DB"]
  }
};

const AccessibilitatUniversal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('dossier') === 'partners') {
      const timer = setTimeout(() => setIsOpen(true), 100);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const isDark = theme === 'dark';
  const path = location.pathname.split('/')[1] || 'global';
  const isPartners = new URLSearchParams(location.search).get('dossier') === 'partners';
  
  const routeMap = {
    'chats': 'chats',
    'mur': 'mur',
    'mercat': 'mercat',
    'pobles': 'pobles',
    'iaia': 'chats',
    'mapa': 'mapa',
    'calendari': 'agenda'
  };

  const docKey = isPartners ? 'partners' : (routeMap[path] || 'global');
  const doc = ARCHITECTURE_DOCS[docKey] || ARCHITECTURE_DOCS['global'];

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(doc.voiceSummary);
    utterance.lang = 'ca-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[60] p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white shadow-2xl transition-all duration-300 hover:bg-orange-500 hover:scale-110 opacity-30 hover:opacity-100"
        >
          {isPartners ? <Briefcase className="w-8 h-8 text-green-400" /> : (doc.isStructural ? <Layers className="w-8 h-8" /> : <Eye className="w-8 h-8" />)}
        </button>
      )}

      {isOpen && (
        <div className={`fixed inset-0 z-[10000] flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'} animate-in slide-in-from-bottom duration-500`}>
          <header className="h-20 border-b flex items-center justify-between px-6 shrink-0 bg-[#F97316] text-white">
            <div className="flex items-center gap-4">
              <Handshake className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Mode Accessibilitat Universal</h2>
                <p className="text-xs opacity-90 font-mono">DOC_ID: {docKey.toUpperCase()}_v10.33.0</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-12 max-w-5xl mx-auto w-full">
            <div className={`p-6 rounded-2xl border-l-8 mb-10 shadow-lg ${isDark ? 'bg-yellow-900/20 border-yellow-500 text-yellow-200' : 'bg-yellow-50 border-yellow-600 text-yellow-800'}`}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-black uppercase tracking-tighter text-lg">Directiva Primària per a Flash</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed">
                Flash: El disseny (CSS/Estructura) és SAGRAT. Heu de plasmar en cada pàgina el seu contingut textual complet per a cecs i per a reconstrucció d'IA. El layout definit pel Mestre no es toca.
              </p>
            </div>

            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase">Lectura Humana</span>
                <h1 className="text-4xl font-bold">{doc.title}</h1>
              </div>
              <div className={`p-8 rounded-3xl text-xl leading-relaxed border-l-8 border-[#F97316] shadow-xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <p>"{doc.voiceSummary}"</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={handleSpeak} className="flex-1 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 text-xl font-bold shadow-lg">
                  <Mic className="w-6 h-6" />
                  <span>🔊 Llegir Pàgina</span>
                </button>
              </div>
            </section>

            <hr className="my-12 border-dashed border-white/10" />

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold uppercase">Flash Blueprint</span>
                <h3 className="text-2xl font-bold font-mono opacity-50">Prompt de Reconstrucció</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className={`p-6 rounded-xl font-mono text-sm overflow-x-auto ${isDark ? 'bg-white/5 text-green-400' : 'bg-slate-900 text-green-400'}`}>
                  <p className="whitespace-pre-wrap">{doc.flashPrompt}</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      Funcionalitats
                    </h4>
                    <ul className="list-disc list-inside text-sm opacity-70">
                      {doc.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilitatUniversal;
