import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';
import './IAIACorrectorOverlay.css';

const IAIACorrectorOverlay = ({ corrections, onApply, onClose }) => {
    const { t } = useTranslation();

    if (!corrections || corrections.length === 0) return null;

    return (
        <div className="iaia-corrector-overlay animate-in fade-in slide-in-from-bottom-5">
            <header className="corrector-header">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-orange-500 animate-pulse" />
                    <h4>{t('notebook.corrector.title')}</h4>
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
            </header>

            <div className="corrections-container custom-scrollbar">
                <div className="corrector-badge-info mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500/50 block mb-1">Variant Dialectal</span>
                    <p className="text-[10px] text-gray-400 font-bold">{t('notebook.corrector.lang_variants')}</p>
                </div>

                <div className="corrections-grid">
                    {corrections.map((corr, idx) => (
                        <div key={idx} className="correction-card group">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className="text-red-400 line-through opacity-50 font-medium">{corr.original}</span>
                                        <ArrowRight size={10} className="text-gray-600" />
                                        <span className="text-emerald-400 font-bold">{corr.suggeriment}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                        "{corr.explicacio}"
                                    </p>
                                </div>
                                <button 
                                    onClick={() => onApply(corr)}
                                    className="shrink-0 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-all"
                                    title="Aplicar correcció"
                                >
                                    <Check size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="corrector-footer text-[9px] font-bold text-gray-600 uppercase tracking-widest text-center py-2 border-t border-white/5 mt-4">
                Philology Archon v2.0
            </div>
        </div>
    );
};

export default IAIACorrectorOverlay;
