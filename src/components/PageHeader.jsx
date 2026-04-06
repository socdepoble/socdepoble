import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PageHeader = ({ title, subtitle, onBack, rightAction, onEditClick, sticky = true }) => {
    const navigate = useNavigate();
    const { isEditor } = useAuth(); // Editor, Admin or SuperAdmin

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className={`${sticky ? 'sticky top-0' : 'relative'} w-full bg-[var(--theme-accent-primary)] text-white border-b border-white/10 px-4 flex items-center justify-between z-50 h-[56px] min-h-[56px] max-h-[56px] flex-shrink-0 transition-colors`}>
            
            {/* Esquerra: Tornar arrere (Width fixat per centrar el titol) */}
            <div className="w-12 flex items-center justify-start">
                {!sticky ? (
                    <div className="fixed top-[max(env(safe-area-inset-top),0.5rem)] left-2 sm:left-4 z-[9999] isolate">
                        <button 
                            onClick={handleBack} 
                            className="p-2.5 rounded-full bg-black/60 dark:bg-black/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/20 hover:bg-black/90 hover:scale-105 active:scale-95 transition-all duration-300 text-white flex items-center justify-center group"
                            aria-label="Tornar arrere"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleBack} 
                        className="p-2 -ml-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white"
                        aria-label="Tornar arrere"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
            </div>

            {/* Centre: Títol */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
                <h3 className="text-[16px] md:text-lg font-bold tracking-wide text-white m-0 text-center uppercase truncate w-full">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[10px] md:text-xs text-white/80 uppercase font-bold tracking-tighter m-0 truncate w-full text-center">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Dreta: Accions (Settings per Editor) */}
            <div className="w-12 flex items-center justify-end">
                {rightAction ? rightAction : isEditor && (
                    <button 
                        onClick={() => {
                            console.log(`Ouvrir configuració CMS per a: ${title}`);
                            if (onEditClick) onEditClick();
                        }} 
                        className="p-2 -mr-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                        title="Editar contingut (Administració)"
                    >
                        <Settings size={20} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default PageHeader;
