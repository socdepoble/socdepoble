import React from 'react';
import { useUpdateSW } from '../hooks/useUpdateSW';
import { DownloadCloud } from 'lucide-react';

export default function ReloadPrompt() {
    const { needRefresh, updateServiceWorker, setNeedRefresh } = useUpdateSW();

    if (!needRefresh) return null;

    return (
        <div className="fixed bottom-[140px] left-1/2 -translate-x-1/2 bg-black text-white p-4 rounded-[28px] shadow-2xl z-[9999] border-[3px] border-[#0984E3] flex flex-col items-center max-w-[90vw] animate-in fade-in slide-in-from-bottom">
            <div className="flex items-center gap-3 mb-3 text-center">
                <DownloadCloud size={28} className="text-[#0984E3] animate-bounce" />
                <span className="font-bold text-sm">Nova versió de la plaça disponible!</span>
            </div>
            <div className="flex gap-2 w-full justify-center">
                <button 
                    onClick={() => updateServiceWorker(true)} 
                    className="bg-[#0984E3] text-black px-5 py-2.5 font-black rounded-full uppercase text-xs hover:scale-105 transition-transform"
                >
                    Actualitzar
                </button>
                <button 
                    onClick={() => setNeedRefresh(false)} 
                    className="bg-zinc-800 text-white px-5 py-2.5 font-bold rounded-full text-xs hover:bg-zinc-700"
                >
                    Més tard
                </button>
            </div>
        </div>
    );
}
