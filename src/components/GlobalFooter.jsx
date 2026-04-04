import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

const GlobalFooter = ({ className = "" }) => {
  const { t } = useTranslation();

  return (
    <div className={`w-full relative z-20 flex px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-6 items-center justify-center ${className}`}>
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black text-[var(--text-main)] text-center leading-relaxed">
        <Settings size={10} className="inline mr-1 -mt-0.5" /> 
        {t('chatEmpty.privacySafe', 'Privacitat Segura i Protegida')} | <a href="#/versions" className="hover:text-[var(--theme-accent-primary)] transition-colors">v10.33.16-CANÒNIC</a> | © SÓC DE POBLE | GENERACIÓ FOTOGRÀFICA I VISUAL: LA IAIA / NANO BANANA | <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ca" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:opacity-100 transition-opacity ml-1"><img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg" alt="Creative Commons BY-SA" className="h-[14px] inline grayscale hover:grayscale-0 transition-all duration-300" /></a>
      </p>
    </div>
  );
};

export default GlobalFooter;
