import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Languages, Info } from 'lucide-react';
import SystemPageLayout from '../../components/layout/SystemPageLayout';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useDesign } from '../../app/context/DesignContext';

const Translations = () => {
  const navigate = useNavigate();
  const { hapticService } = useDesign();

  const handleBack = () => {
    if (hapticService) hapticService.trigger();
    navigate(-1);
  };

  const header = (
    <div className="relative z-10 bg-sdp-theme-accent-primary w-full h-[56px] min-h-[56px] max-h-[56px] flex items-center px-3 shadow-md">
      <button 
        onClick={handleBack} 
        aria-label="Torna enrere" 
        className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:scale-95"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </button>
      <h1 className="text-white font-bold text-lg tracking-wide m-0">Idioma i Traduccions</h1>
    </div>
  );

  return (
    <SystemPageLayout header={header}>
      <section className="grid gap-6 max-w-3xl mx-auto p-4 sm:p-0">
        
        {/* INTERFACE LANGUAGE SECTION */}
        <article className="grid gap-4 p-5 sm:p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
          <header className="flex items-center gap-4">
            <Globe size={24} className="text-sdp-theme-accent-primary shrink-0" strokeWidth={2.5} />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">Idioma del Sistema</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 m-0">Aquest ajust canvia l'idioma de tots els menús, botons i interfícies de l'aplicació.</p>
            </div>
          </header>
          <LanguageSelector variant="profile" />
        </article>

        {/* CARDS TRANSLATION INFO SECTION */}
        <article className="grid gap-4 p-5 sm:p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
          <header className="flex items-center gap-4 text-blue-600 dark:text-blue-400">
            <Languages size={24} className="shrink-0" strokeWidth={2.5} />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">Traducció Dinàmica de Targetes</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 m-0">Com funciona la traducció del contingut creat pels usuaris.</p>
            </div>
          </header>
          
          <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed m-0">
            <Info size={20} className="inline mr-2 text-blue-500 -mt-1" />
            <strong className="text-gray-900 dark:text-white">Motor de Traducció Integrat:</strong> Les Targetes (Mur, Xats, Mercat i Esdeveniments) tenen un sistema de traducció automàtic basat en Google Translator. Això permet que tot el contingut creat per altres usuaris es puga traduir a l'instant al teu idioma de preferència.
          </p>

          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 m-0 bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Com utilitzar-ho</h3>
            <li>Busca la icona de traducció dins de les publicacions del Mur o Xats.</li>
            <li>Fes clic sobre el botó per traduir aquell missatge o publicació específica.</li>
            <li>Les traduccions automàtiques poden contindre xicotets errors d'interpretació en expressions locals.</li>
          </ul>
        </article>

      </section>
    </SystemPageLayout>
  );
};

export default Translations;