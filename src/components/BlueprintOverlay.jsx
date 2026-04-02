import React from 'react';
import { ScanLine, Download } from 'lucide-react';
import { useDesign } from '../context/DesignContext';

/**
 * BlueprintOverlay [CANONIC v11.0.3]
 * Component global per a mostrar cotes tècniques i noms d'arquitectura.
 * Ara bategua amb el context global per a auto-ocultar-se si no hi ha permís.
 */
const colors = {
    cyan: { border: "border-cyan-400", bg: "bg-cyan-500", text: "text-black" },
    green: { border: "border-green-400", bg: "bg-green-500", text: "text-black" },
    blue: { border: "border-blue-400", bg: "bg-blue-600", text: "text-white" },
    orange: { border: "border-orange-400", bg: "bg-orange-500", text: "text-black" },
    magenta: { border: "border-pink-500", bg: "bg-pink-500", text: "text-white" },
    emerald: { border: "border-emerald-400/30", bg: "bg-emerald-500", text: "text-black" }
};

const BlueprintOverlay = ({ label, dimensions, color = "blue", children, className = "", showBackupLink = false }) => {
    const { blueprintMode } = useDesign();
    
    const theme = colors[color] || colors.blue;

    if (!blueprintMode) return children;

    return (
        <div className={`relative w-full group/blueprint ${className}`}>
            {children}
            {blueprintMode && (
                <div 
                  className={`absolute pointer-events-none z-max border-2 border-dashed ${theme.border} opacity-50 rounded-inherit`}
                  style={{ inset: '10px' }}
                >
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
            )}
        </div>
    );
};

export default BlueprintOverlay;
