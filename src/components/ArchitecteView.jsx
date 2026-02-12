import React from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Info, ShieldCheck, Zap } from "lucide-react";
import { useUI } from "../context/UIContext";

const ARCHITECTURE_DOCS = {
  'chats': {
    title: "💬 PÀGINA DE XAT (Mòdul Base)",
    objective: "Comunicació directa entre veïns i amb els Agents IAIA.",
    list: "Mostra la llista de converses actives segons ordres del Mestre.",
    voiceSummary: "Atenció: Definició estructural v10.24.0. Correcció crítica de Viewport per a dispositius mòbils.",
    detailedDescription: `
      ESTRUCTURA DE LAYOUT (v10.24):
      1. MOBILE VIEWPORT FIX:
         - Injecció automàtica de meta tag viewport.
         - Prevenció d'escalat d'escriptori en pantalles tàctils.
      2. MODE FORENSE UI:
         - Eina de depuració visual per validar regles de disseny.
    `,
    detail: "Interfície de conversa tipus WhatsApp amb bafarades i estats.",
    general: "L'Arquitectura General del Mas Digital inclou la Sidebar (Roca) a l'esquerra amb el logotip sempre present. El Header és sempre Negre per seguretat visual."
  },
  'partners': {
    title: "💼 Dossier de Partenariat Tecnològic",
    objective: "Àrea de socis. Viabilitat tècnica i econòmica del Projecte Sóc de Poble.",
    list: "Dades de mercat i federació de nodos.",
    voiceSummary: "Àrea de socis. Viabilitat tècnica i econòmica del Projecte Sóc de Poble.",
    detailedDescription: `
      VISIÓ ESTRATÈGICA:
      Sóc de Poble no és una app, és una FEDERACIÓ DE NODOS COMARCALS.
      MODEL DE NEGOCI (SaaS B2G + B2B).
    `,
    detail: "Dades executives per a Sollutia i Inversors.",
    general: "GENERA INFORME EXECUTIU. Context: Reunió amb Sollutia."
  },
  'mur': {
    title: "📰 PÀGINA DEL MUR (Notícies i Bans)",
    objective: "El tauler d’anuncis del poble. Informació oficial i veïnal.",
    list: "Targetes de titulars amb iconografia distintiva (Ajuntament, Festa, Alerta).",
    detail: "Format Notícia: Imatge 16:9, Títol H1 impactant i text complet llegible.",
  },
  'mercat': {
    title: "🛒 PÀGINA DEL MERCAT (Comerç Local)",
    objective: "Compravenda de productes de proximitat (Km0).",
    list: "Targetes de producte amb imatge quadrada i preu destacat en Taronja.",
    detail: "Fitxa de Producte: Foto gran, preu gegant i botó de contacte directe.",
  }
};

const ArchitecteView = () => {
  const { architectMode, isDark } = useUI();
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "chats";
  const doc = ARCHITECTURE_DOCS[path] || ARCHITECTURE_DOCS.chats;

  if (!architectMode) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0b] text-white p-8 md:p-12 animate-fade-in custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6 uppercase tracking-[0.3em] text-orange-500 font-black text-xs">
          <BookOpen size={24} />
          <span>MAPA DE TERRITORI v3.0</span>
          <span className="ml-auto opacity-40">IMMUTABLE / BLINDAT</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">
          {doc.title}
        </h1>

        {doc.voiceSummary && (
          <div className={`p-8 mb-10 rounded-3xl text-xl border-l-8 border-orange-500 ${isDark ? 'bg-slate-900' : 'bg-orange-50/50'}`}>
            <p className="italic">"{doc.voiceSummary}"</p>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 backdrop-blur-md">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
              <Info size={24} />
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-blue-400 mb-2">
                Objectiu del Mòdul
              </h3>
              <p className="text-xl text-gray-300 font-semibold">
                {doc.objective}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="w-1.5 h-auto bg-orange-600 rounded-full shrink-0" />
              <div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-orange-500 mb-1">
                  Panell Central (Llista)
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {doc.list}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1.5 h-auto bg-purple-600 rounded-full shrink-0" />
              <div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-purple-500 mb-1">
                  Panell Dret (Detall)
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {doc.detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {doc.detailedDescription && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-10 font-mono text-sm text-green-400/80">
            <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4 opacity-50">Estructura Detallada</h4>
            <div className="whitespace-pre-wrap">{doc.detailedDescription}</div>
          </div>
        )}

        {doc.general && (
          <div className="bg-black/40 border border-white/5 rounded-3xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-4 text-xs font-black uppercase tracking-widest opacity-60">
              <ShieldCheck size={16} /> Arquitectura de Ferro
            </div>
            <p className="text-gray-400 leading-relaxed italic">
              {doc.general}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 p-6 bg-orange-600/10 border border-orange-600/20 rounded-2xl text-orange-500 text-[10px] font-black uppercase tracking-widest">
          <Zap size={14} className="animate-pulse" />
          AQUESTA DEFINICIÓ ÉS L'ORDRE INMUTABLE DEL MESTRE JAVI
        </div>
      </div>
    </div>
  );
};

export default ArchitecteView;
