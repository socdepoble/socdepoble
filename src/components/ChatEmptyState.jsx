import React from "react";
import {
  Settings,
  BookOpen,
  ShieldCheck,
  X,
  NotebookPen,
  ArrowRight,
  UserPlus,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useUI } from "../context/UIContext";

const ChatEmptyState = () => {
  const { darkMode, architectMode } = useUI();
  const colors = {
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-400" : "text-gray-500",
  };

  if (architectMode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-[#050505] text-white">
        <div className="max-w-2xl w-full border border-orange-500/30 bg-orange-500/5 genesis-radius p-8 md:p-10 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3 mb-8 text-orange-500 font-black text-xs uppercase tracking-[0.3em]">
            <BookOpen size={20} />
            <span>MIRALL DIDÀCTIC: ESTRUCTURA MESTRA</span>
          </div>

          <h2 className="text-3xl font-black mb-6 tracking-tight leading-none">
            🏗️ ARQUITECTURA GENERAL
          </h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-2">
                LA ROCA (Sidebar)
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bloc immovible a l'esquerra (280px). Conté l'accés universal
                (AFEGIR), el botó de Xat taronja i tota la navegació per
                "Bategats". El Header de la sidebar és SEMPRE NEGRE per
                jerarquia visual.
              </p>
            </section>

            <section>
              <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2">
                EL MERCAT (Panell Central)
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Espai de trànsit de 400px. Aquí és on "passes llista": veus qui
                parla, quines notícies hi ha o quins productes es venen. La
                capçalera central és el quadre de comandament (Eines).
              </p>
            </section>

            <section>
              <h3 className="text-purple-500 font-black text-[10px] uppercase tracking-widest mb-2">
                L'ESCENARI (Panell de Detall)
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                On passa l'acció. Ocupa tot l'espai restant. En "Mode Producció"
                veus el contingut; en "Mode Arquitecte", veus aquesta mateixa
                explicació tècnica.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2">
              <ShieldCheck size={14} /> Protocol 1er Mandament v10.33.11-CANÒNIC
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-orange-600/40"></div>
              <div className="w-2 h-2 rounded-full bg-orange-600/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-20 relative overflow-y-auto bg-black scrollbar-hide">
      {/* PROTOCOL SORTIDA D'EMERGÈNCIA - Botó de tancament "sense traumes" */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hidden md:block">
          TANCAR PRESENTACIÓ
        </span>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-2xl hover:bg-orange-600 text-white rounded-[24px] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all active:scale-90 group"
          title="Tancar i navegar"
        >
          <X
            size={32}
            className="group-hover:rotate-90 transition-transform duration-500"
          />
        </button>
      </div>

      {/* Overlay de tancament per clic extern */}
      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={() => (window.location.href = "/")}
        title="Clica per tancar"
      />

      {/* Grid de fons subtil (Protocol v9.1.0) */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #888 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <h1
        className={`relative z-10 text-3xl md:text-5xl font-black text-center mb-12 tracking-normal uppercase italic ${colors.textPrimary} leading-none`}
      >
        SÓC DE POBLE
        <br />
        <span className="text-[#FF6B00]">PER A WEB</span>
      </h1>

      <div
        className={`relative z-10 text-center max-w-4xl mb-16 space-y-10 ${colors.textSecondary}`}
      >
        <p className="text-3xl md:text-5xl text-white leading-tight font-black italic">
          "Connecta amb la teua comunitat. El bategat de la terra en format
          digital."
        </p>
        <p className="text-2xl md:text-3xl text-white leading-relaxed px-10 font-bold">
          <strong>Sóc de Poble</strong> és un{" "}
          <strong>Sistema Operatiu Rural</strong>. Una eina per a la gent,
          ajuntaments i negocis KM 0 per a protegir la memòria, dinamitzar
          l'economia local i bategat amb utilitat social.
        </p>
      </div>

      {/* ACCIONS AL PEU - [MASTERY v15] Espaiades i nítides */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-10 mb-20 px-6">
        <button
          className="flex items-center gap-4 px-12 py-6 bg-[#FF6B00] text-white rounded-[24px] font-black uppercase text-xl tracking-widest shadow-2xl shadow-[#FF6B00]/50 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
          onClick={() => alert("Bategant Connexió...")}
        >
          <UserPlus size={32} /> Connectar amb el Poble
        </button>
        <button
          className={`flex items-center gap-4 px-12 py-6 rounded-[24px] font-black uppercase text-xl tracking-widest bg-white text-black hover:bg-gray-200 transition-all w-full md:w-auto shadow-2xl`}
          onClick={() => alert("Obrint Safareig...")}
        >
          <MessageCircle size={32} /> Entrar al Safareig
        </button>
        <button
          className={`flex items-center gap-4 px-12 py-6 rounded-[24px] font-black uppercase text-xl tracking-widest bg-white text-black hover:bg-gray-200 transition-all w-full md:w-auto shadow-2xl`}
          onClick={() => {
            const shareData = {
              title: "Sóc de Poble",
              text: "Connecta amb la teua comunitat.",
              url: window.location.origin,
            };
            if (navigator.share) navigator.share(shareData);
            else alert("Enllaç copiat!");
          }}
        >
          <Share2 size={32} /> Compartir Batec
        </button>
      </div>

      <div className="relative z-10 p-12 rounded-[56px] border-8 text-left max-w-4xl mx-6 mb-24 shadow-[0_0_120px_rgba(255,107,0,0.3)] transition-all bg-black border-[#FF6B00]/30">
        <h4 className="text-3xl font-black flex items-center gap-4 mb-6 text-[#FF6B00] uppercase tracking-tighter italic">
          <ShieldCheck size={36} /> Llicència Oberta
        </h4>
        <p
          className={`text-xl md:text-2xl leading-relaxed font-bold mb-10 text-white`}
        >
          Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús
          comercial està subjecte a llicència del Mestre. Consulta
          l'Arquitectura per a més detalls tècnics.
        </p>
        <button
          onClick={() => (window.location.href = "/ofici")}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-[#FF6B00] hover:text-white transition-all"
        >
          Llegir Condicions i Arquitectura <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-40 font-black text-gray-500">
        <Settings size={12} />
        <span>Xifrat d'Extrem a Extrem | v10.33.11-CANÒNIC</span>
      </div>
    </div>
  );
};

export default ChatEmptyState;
