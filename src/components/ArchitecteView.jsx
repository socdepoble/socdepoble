import React from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Info, ShieldCheck, Zap } from "lucide-react";

const ARCHITECTURE_DOCS = {
  chats: {
    title: "💬 PÀGINA DE XAT (Mòdul Base)",
    objective: "Comunicació directa entre veïns i amb els Agents IAIA.",
    list: "Mostra la llista de converses actives.",
    iaiaControl:
      "Filtre IAIA (✨): Permet triar entre Silenciós, Core i Immersiu.",
    detail: "Interfície de conversa tipus WhatsApp amb bafarades i estats.",
    general:
      "L'Arquitectura General del Mas Digital inclou la Sidebar (Roca) a l'esquerra amb el logotip sempre present i botons d'acció grans (AFEGIR, Xat). El Header és sempre Negre per seguretat visual.",
  },
  mur: {
    title: "📰 PÀGINA DEL MUR (Notícies i Bans)",
    objective: "El tauler d’anuncis del poble. Informació oficial i veïnal.",
    list: "Targetes de titulars amb iconografia distintiva (Ajuntament, Festa, Alerta).",
    detail:
      "Format Notícia: Imatge 16:9, Títol H1 impactant i text complet llegible.",
    interractions: "Permet reaccions (Cor), comentaris i compartició.",
  },
  mercat: {
    title: "🛒 PÀGINA DEL MERCAT (Comerç Local)",
    objective: "Compravenda de productes de proximitat (Km0).",
    list: "Targetes de producte amb imatge quadrada i preu destacat en Taronja.",
    detail:
      "Fitxa de Producte: Foto gran, preu gegant i botó de contacte directe (Contactar Venedor).",
  },
  pobles: {
    title: "🏘️ PÀGINA DE POBLES (Territori)",
    objective: "Informació dels municipis de la Vall i connexió amb la gent.",
    list: "Llista alfabètica de pobles amb el seu escut o avatar.",
    detail:
      "Fitxa del Poble: Foto panoràmica, dades tècniques (habitants) i enllaços d'interès.",
  },
  perfil: {
    title: "👤 PÀGINA DE PERFIL (Centre de Control)",
    objective: "Gestió de l'usuari i configuració soberana del sistema.",
    list: "Menú d'ajustos: Compte, Aparença, Notificacions.",
    detail:
      "Panell de Control: Interruptors de Tema, Nivell IAIA i Mode Arquitecte (📖).",
  },
};

const ArchitecteView = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "chats";
  const doc = ARCHITECTURE_DOCS[path] || ARCHITECTURE_DOCS.chats;

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
            {doc.iaiaControl && (
              <div className="flex gap-4">
                <div className="w-1.5 h-auto bg-green-600 rounded-full shrink-0" />
                <div>
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-green-500 mb-1">
                    Control IAIA (✨)
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {doc.iaiaControl}
                  </p>
                </div>
              </div>
            )}
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
