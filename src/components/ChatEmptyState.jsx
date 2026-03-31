import React from "react";
import { Search, NotebookPen, Settings, ShieldCheck, BookOpen, ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useDesign } from '../context/DesignContext';
import ProjectPresentation from '../pages/ProjectPresentation';

const ChatEmptyState = () => {
  const { t } = useTranslation();
  const { architectMode } = useDesign();

  if (architectMode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-[#050505] text-white">
        <div className="max-w-2xl w-full border border-[var(--theme-accent-primary)]/30 bg-[var(--theme-accent-primary)]/5 genesis-radius p-8 md:p-10 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3 mb-8 text-[var(--theme-accent-primary)] font-black text-xs uppercase tracking-[0.3em]">
            <BookOpen size={20} />
            <span>{t('chatEmpty.architectMirror', 'MIRALL DIDÀCTIC: ESTRUCTURA MESTRA')}</span>
          </div>

          <h2 className="text-3xl font-black mb-6 tracking-tight leading-none">
            {t('chatEmpty.architectTitle', '🏗️ ARQUITECTURA GENERAL')}
          </h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-[var(--theme-accent-primary)] font-black text-[10px] uppercase tracking-widest mb-2">
                {t('chatEmpty.architectRock', 'LA ROCA (Sidebar)')}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('chatEmpty.architectRockDesc', "Bloc immovible a l'esquerra (280px). Conté l'accés universal (AFEGIR), el botó de Xat taronja i tota la navegació per \"Bategats\". El Header de la sidebar és SEMPRE NEGRE per jerarquia visual.")}
              </p>
            </section>

            <section>
              <h3 className="text-[var(--theme-accent-primary)] font-black text-[10px] uppercase tracking-widest mb-2">
                {t('chatEmpty.architectMarket', 'EL MERCAT (Panell Central)')}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('chatEmpty.architectMarketDesc', "Espai de trànsit de 400px. Aquí és on \"passes llista\": veus qui parla, quines notícies hi ha o quins productes es venen. La capçalera central és el quadre de comandament (Eines).")}
              </p>
            </section>

            <section>
              <h3 className="text-[var(--theme-accent-secondary)] font-black text-[10px] uppercase tracking-widest mb-2">
                {t('chatEmpty.architectStage', "L'ESCENARI (Panell de Detall)")}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('chatEmpty.architectStageDesc', "On passa l'acció. Ocupa tot l'espai restant. En \"Mode Producció\" veus el contingut; en \"Mode Arquitecte\", veus aquesta mateixa explicació tècnica.")}
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2">
              <ShieldCheck size={14} /> {t('chatEmpty.architectProtocol', 'Protocol 1er Mandament v10.33.15-CANÒNIC')}
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-[28px] bg-[var(--theme-accent-primary)] animate-pulse"></div>
              <div className="w-2 h-2 rounded-[28px] bg-[var(--theme-accent-primary)]/40"></div>
              <div className="w-2 h-2 rounded-[28px] bg-[var(--theme-accent-primary)]/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="flex-1 flex flex-col min-h-0 bg-theme-base relative overflow-hidden">
        {/* Grid de fons subtil (Protocol v9.1.0) */}
        <div
          className="absolute inset-0 opacity-[0.03] z-1 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="w-full h-full relative z-10 flex flex-col">
             <ProjectPresentation />
        </div>
    </div>
  );
};

export default ChatEmptyState;
