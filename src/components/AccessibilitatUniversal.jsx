import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Eye, Mic, Ear, X, Layers, MoveHorizontal, ShieldCheck, Briefcase, TrendingUp, Handshake, Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * 🏺 PROTOCOL "L'ULL DEL MAS" (v10.8.2-CLOSURE)
 * Aquest component és la clau de volta de l'accessibilitat i la resiliència.
 */
const ARCHITECTURE_DOCS = {
  'global': {
    title: "🏛️ Arquitectura Mestra del Sistema",
    isStructural: true,
    voiceSummary: "Atenció: Definició estructural completa. Shell unificat i Bloc de Notes integrat.",
    detailedDescription: `
      ESTRUCTURA DE FINALS (v10.12):
      1. CAPÇALERA MESTRA (MONÒLIT):
         - Alçada exacta 64px (h-16) a tot l'ample.
         - Color Negre (#000000) continu sense vores divisòries verticals.
      
      2. SISTEMA DUAL (XAT / BLOC DE NOTES):
         - El Panell de Xat permet un "Side-Panel" (Bloc de Notes) emergent.
         - Mode WhatsApp (Tancat) vs Mode Mail (Obert).
         - Funcionalitat d'esborrany per a Mur i Mercat.
    `,
    flashPrompt: "ACTUA COM ARQUITECTE SENIOR. Implementa 'Unified Black Header' i 'Split View Chat/Notepad'. REQUISITS: 1. Header 64px #000000. 2. Notepanel integrat.",
    features: ["Unified Header", "Split View Context", "Drafting System"],
    screenshots: ["Unified_Header.png", "Notepad_Split.png"]
  },
  'chats': {
    title: "🗨️ Panell de Conversa",
    voiceSummary: "Vista de detall de la conversa. Aquí pots interaccionar amb veïns i IAs. Els missatges rebuts a l'esquerra, enviats a la dreta.",
    flashPrompt: "GENERA EL COMPONENT 'CHAT VIEW'. ELEMENTS: 1. Chat Header. 2. Àrea de missatges amb fons radial. 3. Input Area amb micròfon.",
    features: ["Xifrat extrem a extrem", "Enviament multimèdia", "Resposta ràpida"]
  },
  'mur': {
    title: "📰 Mur d'Històries",
    voiceSummary: "El tauler d'anuncis del poble. Notícies oficials i veïnals en format de targetes.",
    flashPrompt: "GENERA EL COMPONENT 'FEED'. Estil: 'Masonry/List'. ELEMENTS: 1. UniversalCard per a cada post. 2. Filtres de categoria.",
    features: ["Scroll infinit", "Filtres dinàmics", "Edició ràpida"]
  },
  'partners': {
    title: "💼 Dossier de Partenariat Tecnològic",
    isStructural: true,
    voiceSummary: "Àrea de socis. Viabilitat tècnica i econòmica del Projecte Sóc de Poble per a la implantació comarcal.",
    detailedDescription: `
      VISIÓ ESTRATÈGICA:
      Sóc de Poble no és una app, és una FEDERACIÓ DE NODOS COMARCALS.
      Cada comarca disposa de la seua pròpia "IAIA" (Intel·ligència Artificial Identitària Autòctona).

      MODEL DE NEGOCI (ESTIMACIÓ 2026-2027):
      1. CANAL B2G: Subscripció SaaS Anual (Bando Digital).
      2. CANAL B2B: Freemium / Premium (Mercat Rural).
      
      STACK TECNOLÒGIC (SOLLUTIA COMPATIBLE):
      - Frontend: React 19, Vite, TailwindCSS.
      - Backend: Supabase.
      - IA: Gemini Flash 2.0.
    `,
    flashPrompt: "GENERA INFORME EXECUTIU. Context: Reunió amb Sollutia. Objectiu: Demostrar solvència tècnica i model recurrent.",
    features: ["Model SaaS B2G", "Federació de Nodos", "Stack React/Node"],
    screenshots: ["Business_Canvas.png"]
  }
};

const AccessibilitatUniversal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  // [PROTOCOL TRANSPARÈNCIA] Auto-obertura del Dossier
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('dossier') === 'partners') {
      const timer = setTimeout(() => setIsOpen(true), 100);
      return () => clearTimeout(timer);
    }
  }, [location.search]);
  
  // States per a la configuració de l'ull
  const [position, setPosition] = useState(() => localStorage.getItem('sodepoble_a11y_pos') || 'left');

  const isDark = theme === 'dark';

  const path = location.pathname.split('/')[1] || 'global';
  // Lògica per a detectar si estem al dossier de partners via query param o context
  const isPartners = new URLSearchParams(location.search).get('dossier') === 'partners';
  const docKey = isPartners ? 'partners' : (ARCHITECTURE_DOCS[path] ? path : 'global');
  
  const doc = ARCHITECTURE_DOCS[docKey];
  const isHomePage = location.pathname === '/' || location.pathname === '/chats';
  const finalDoc = isPartners ? doc : (isHomePage ? ARCHITECTURE_DOCS['global'] : doc);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(finalDoc.voiceSummary);
    utterance.lang = 'ca-ES';
    window.speechSynthesis.speak(utterance);
  };

  const togglePosition = () => {
    const newPos = position === 'left' ? 'right' : 'left';
    setPosition(newPos);
    localStorage.setItem('sodepoble_a11y_pos', newPos);
  };

  return (
    <>
      {/* BOTÓ FLOTANT (L'ULL TRANSPARENT) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`
            fixed bottom-6 z-[60] p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/20 
            text-white shadow-2xl transition-all duration-300 hover:bg-orange-500 hover:scale-110 opacity-30 hover:opacity-100
            ${position === 'left' ? 'left-6' : 'right-6'}
          `}
        >
          {isPartners ? <Briefcase className="w-8 h-8 text-green-400" /> : (finalDoc.isStructural ? <Layers className="w-8 h-8" /> : <Eye className="w-8 h-8" />)}
        </button>
      )}

      {/* MODAL D'ACCESSIBILITAT */}
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-black text-white' : 'bg-[#FDF5E6] text-slate-900'} animate-in slide-in-from-bottom duration-300`}>
          <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-[#F97316] text-white">
            <div className="flex items-center gap-4">
              {isPartners ? <Briefcase className="w-8 h-8" /> : <Ear className="w-8 h-8" />}
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isPartners ? 'ÀREA DE PARTNERS' : 'Sala de Lectura & Blueprints'}
                </h2>
                <p className="text-xs opacity-90 font-mono text-white/70">v10.12.0-AMB-BLOC-DE-NOTES</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full">
              <X className="w-8 h-8" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 max-w-5xl mx-auto w-full">
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase">Lectura Humana</span>
                <h1 className="text-4xl font-bold">{finalDoc.title}</h1>
              </div>
              
              <div className={`p-8 rounded-3xl text-xl leading-relaxed border-l-8 border-[#F97316] shadow-xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <p>"{finalDoc.voiceSummary}"</p>
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
                  <p className="whitespace-pre-wrap">{finalDoc.flashPrompt}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      Funcionalitats
                    </h4>
                    <ul className="list-disc list-inside text-sm opacity-70">
                      {finalDoc.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                  <button onClick={togglePosition} className="w-full h-12 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm">
                    <MoveHorizontal className="w-4 h-4" />
                    Canviar Posició Botó ({position})
                  </button>
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
