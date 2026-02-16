import React from 'react';
import { ScanLine, Download } from 'lucide-react';

/**
 * BlueprintOverlay [CANONIC v11.0.2]
 * Component global per a mostrar cotes tècniques i noms d'arquitectura.
 * Ara inclou accés al backup Standalone per a resiliència pública.
 */
const BlueprintOverlay = ({ label, dimensions, color = "blue", children, className = "", showBackupLink = false }) => {
    const colors = {
        cyan: { border: "border-cyan-400", bg: "bg-cyan-500", text: "text-black" },
        green: { border: "border-green-400", bg: "bg-green-500", text: "text-black" },
        blue: { border: "border-blue-400", bg: "bg-blue-600", text: "text-white" },
        orange: { border: "border-orange-400", bg: "bg-orange-500", text: "text-black" },
        magenta: { border: "border-pink-500", bg: "bg-pink-500", text: "text-white" }
    };
    const theme = colors[color] || colors.blue;

    return (
        <div className={`relative w-full group/blueprint ${className}`}>
            {children}
            <div className={`absolute inset-0 pointer-events-none z-[9999] border-2 border-dashed ${theme.border} opacity-50 rounded-inherit`}>
                <div className={`absolute top-0 right-0 ${theme.bg} ${theme.text} text-[9px] font-mono px-2 py-0.5 uppercase tracking-tighter shadow-sm flex items-center gap-1 pointer-events-auto transition-all hover:bg-black hover:text-white`}>
                    <ScanLine className="w-3 h-3" />
                    {label} {dimensions && <span className="opacity-75 font-bold">[{dimensions}]</span>}
                    
                    {showBackupLink && (
                        <a 
                            href="/soc-de-poble-backup.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 pl-2 border-l border-white/30 text-yellow-300 hover:text-white transition-colors flex items-center gap-1 font-black"
                        >
                            <Download size={10} strokeWidth={3} />
                            BACKUP (LEGAL)
                        </a>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BlueprintOverlay;
