import React from 'react';
import { ScanLine, Download } from 'lucide-react';

/**
 * BlueprintOverlay [CANONIC v11.0.2]
 * Component global per a mostrar cotes tècniques i noms d'arquitectura.
 * Ara inclou accés al backup Standalone per a resiliència pública.
 */
const BlueprintOverlay = ({ label, dimensions, color = "blue", children, className = "", showBackupLink = false }) => (
    <div className={`relative w-full h-full group/blueprint ${className}`}>
        {children}
        <div className={`absolute inset-0 pointer-events-none z-[9999] border-2 border-dashed border-${color}-500/50 opacity-100 rounded-inherit`}>
            <div className={`absolute top-0 right-0 bg-${color}-600 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-tighter shadow-sm flex items-center gap-1 pointer-events-auto transition-all hover:bg-black/90`}>
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
                        BACKUP STANDALONE (LEGAL)
                    </a>
                )}
            </div>
        </div>
    </div>
);

export default BlueprintOverlay;
