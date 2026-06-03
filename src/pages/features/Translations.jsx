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
        <div className="relative z-10 bg-[var(--theme-accent-primary)] w-full h-[56px] min-h-[56px] max-h-[56px] flex items-center px-3 shadow-md">
            <button 
                onClick={handleBack}
                aria-label="Torna enrere"
                className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:scale-95"
            >
                <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-white font-bold text-[18px] tracking-wide m-0">Idioma i Traduccions</h1>
        </div>
    );

    return (
        <SystemPageLayout header={header}>
            <div className="max-w-3xl mx-auto space-y-6">
                
                {/* INTERFACE LANGUAGE SECTION */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-gray-50/50 dark:bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-[var(--theme-accent-primary)]/10 flex items-center justify-center text-[var(--theme-accent-primary)] shrink-0">
                            <Globe size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white m-0">Idioma del Sistema</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-1 m-0">Aquest ajust canvia l'idioma de tots els menús, botons i interfícies de l'aplicació.</p>
                        </div>
                    </div>
                    <div className="p-5 sm:p-6 bg-theme-base">
                        {/* We use the profile variant of LanguageSelector since it's meant to be embedded in a page/modal */}
                        <LanguageSelector variant="profile" />
                    </div>
                </div>

                {/* CARDS TRANSLATION INFO SECTION */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <Languages size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white m-0">Traducció Dinàmica de Targetes</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-1 m-0">Com funciona la traducció del contingut creat pels usuaris.</p>
                        </div>
                    </div>
                    <div className="p-5 sm:p-6 bg-theme-base space-y-4">
                        <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">
                            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="m-0 font-medium text-gray-900 dark:text-white mb-1">
                                    Motor de Traducció Integrat
                                </p>
                                <p className="m-0">
                                    Les Targetes (Mur, Xats, Mercat i Esdeveniments) tenen un sistema de traducció automàtic basat en <strong className="text-gray-900 dark:text-white">Google Translator</strong>. 
                                    Això permet que tot el contingut creat per altres usuaris es puga traduir a l'instant al teu idioma de preferència.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Com utilitzar-ho</h3>
                            <ul className="list-disc list-inside space-y-2 text-[14px] text-gray-600 dark:text-gray-400 m-0">
                                <li>Busca la icona de traducció dins de les publicacions del Mur o Xats.</li>
                                <li>Fes clic sobre el botó per traduir aquell missatge o publicació específica.</li>
                                <li>Les traduccions automàtiques poden contindre xicotets errors d'interpretació en expressions locals.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </SystemPageLayout>
    );
};

export default Translations;
