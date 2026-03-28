import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, NotebookPen, Settings, ShieldCheck, BookOpen } from "lucide-react";
import { useDesign } from '../context/DesignContext';
import ProjectPresentation from '../pages/ProjectPresentation';

const ChatEmptyState = () => {
  const { architectMode } = useDesign();
  const navigate = useNavigate();

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
              <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-2">
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
              <ShieldCheck size={14} /> Protocol 1er Mandament v10.33.15-CANÒNIC
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-[28px] bg-orange-600 animate-pulse"></div>
              <div className="w-2 h-2 rounded-[28px] bg-orange-600/40"></div>
              <div className="w-2 h-2 rounded-[28px] bg-orange-600/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-theme-base relative overflow-hidden">
        
      {/* HEADER DEL XAT (Global Settings Header) - MATCHES ChatDetail HEIGHT */}
      <header 
          onClick={() => navigate('/gestio/xats')}
          className={`h-16 min-h-[64px] px-4 md:px-6 flex items-center justify-between border-b border-[var(--border-master)] flex-shrink-0 z-30 transition-colors bg-[#F97316] dark:bg-[#3B82F6] text-white cursor-pointer hover:brightness-110 active:scale-[0.99]`}
      >
          <div className="flex items-center gap-3 flex-1 group transition-all">
              <div className="bg-[#111827] text-white border border-white/10 rounded-[28px] p-0.5 shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                 <div className="w-[40px] h-[40px] rounded-[28px] bg-white/20 flex items-center justify-center">
                    <Settings size={22} className="text-white" />
                 </div>
              </div>

              <div className="flex flex-col min-w-0 pr-2 flex-1">
                  <h2 className={`text-lg font-bold truncate leading-none transition-colors text-white`}>
                      Configuració Global del Xat
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-80 text-[var(--sdp-white)]`}>
                          ESTEM PROTEGITS
                      </span>
                  </div>
              </div>
          </div>

           <div className="flex items-center gap-4 ml-auto z-10 bg-[var(--theme-accent-primary)] dark:bg-[var(--theme-accent-secondary)] rounded-[20px] px-5 py-2 shadow-inner shadow-black/20">
                <button 
                    className={`transition-all hover:scale-110 text-white filter drop-shadow-md hidden sm:block opacity-50 cursor-not-allowed`}
                    title="Bloc de Notes (Desactivat açí)"
                >
                    <NotebookPen size={22} strokeWidth={2.5} />
                </button>

                <button 
                    className={`transition-all hover:scale-110 text-white filter drop-shadow-md hidden sm:block opacity-50 cursor-not-allowed`}
                    title="Cercar (Desactivat açí)"
                >
                    <Search size={22} strokeWidth={2.5} />
                </button>
            </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start relative overflow-y-auto custom-scrollbar bg-[var(--bg-master)] z-0 w-full h-full">
          {/* Grid de fons subtil (Protocol v9.1.0) */}
          <div
            className="absolute inset-0 opacity-[0.03] z-1 min-h-[150vh]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>

          <div className="w-full relative z-10 flex flex-col justify-start items-center h-full">
               <ProjectPresentation standAlone={false} />
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-40 font-black text-[var(--text-main)] pb-12 w-full z-20">
            <Settings size={12} />
            <span>Privacitat Segura i Protegida | v10.33.16-CANÒNIC</span>
          </div>
      </div>
    </div>
  );
};

export default ChatEmptyState;
