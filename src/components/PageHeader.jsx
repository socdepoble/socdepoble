import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PageHeader = ({ title, subtitle, onBack, rightAction, onEditClick }) => {
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
        <header className="sticky top-0 w-full bg-[var(--theme-accent-primary)] text-white border-b border-white/10 px-4 flex items-center justify-between z-50 h-[64px] min-h-[64px] max-h-[64px] flex-shrink-0 transition-colors">
            
            {/* Esquerra: Tornar arrere (Width fixat per centrar el titol) */}
            <div className="w-12 flex items-center justify-start">
                <button 
                    onClick={handleBack} 
                    className="p-2 -ml-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white"
                    aria-label="Tornar arrere"
                >
                    <ArrowLeft size={20} />
                </button>
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
