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
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-[#050505] text-white min-h-0">
          <div className="max-w-2xl w-full border border-[var(--theme-accent-primary)]/30 bg-[var(--theme-accent-primary)]/5 genesis-radius p-8 md:p-10 backdrop-blur-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-8 text-[var(--theme-accent-primary)] font-black text-xs uppercase tracking-[0.3em]">
              <BookOpen size={20} />
              <span>{t('chatEmpty.architectMirror', 'MIRALL DIDÀCTIC: ESTRUCTURA MESTRA')}</span>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="flex-1 w-full h-full relative overflow-y-auto bg-theme-base">
      <ProjectPresentation standAlone={false} forcedSlug="/el-projecte" />
    </div>
  );
};

export default ChatEmptyState;
