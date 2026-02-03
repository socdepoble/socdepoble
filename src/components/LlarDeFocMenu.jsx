import React from 'react';
import { Zap, BookOpen, X, Sparkles } from 'lucide-react';
import { hapticService } from '../services/hapticService';
import './LlarDeFocMenu.css';

/**
 * LlarDeFocMenu: El Selector de Destí [V1.0]
 * Permet a l'usuari triar entre l'eficiència pura (Faena) 
 * i la immersió narrativa (Rondalla).
 */
const LlarDeFocMenu = ({ isOpen, onClose, currentMode, onModeChange }) => {
    if (!isOpen) return null;

    const handleModeSelect = (mode) => {
        onModeChange(mode);
        hapticService.notifyAIReady();
        onClose();
    };

    return (
        <div className="llar-foc-overlay" onClick={onClose}>
            <div className="llar-foc-content animate-slide-up" onClick={e => e.stopPropagation()}>
                <header className="llar-foc-header">
                    <div className="header-icon">
                        <Sparkles size={24} />
                    </div>
                    <div className="header-text">
                        <h3>La Llar de Foc</h3>
                        <p>Tria com vols que bategue l'IAIA</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="llar-foc-options">
                    <button
                        className={`mode-option ${currentMode === 'faena' ? 'active' : ''}`}
                        onClick={() => handleModeSelect('faena')}
                    >
                        <div className="option-icon zap">
                            <Zap size={28} />
                        </div>
                        <div className="option-info">
                            <strong>Mode Faena</strong>
                            <span>Eficiència pura. Respostes directes i invisibles.</span>
                        </div>
                    </button>

                    <button
                        className={`mode-option ${currentMode === 'rondalla' ? 'active' : ''}`}
                        onClick={() => handleModeSelect('rondalla')}
                    >
                        <div className="option-icon book">
                            <BookOpen size={28} />
                        </div>
                        <div className="option-info">
                            <strong>Mode Rondalla</strong>
                            <span>Immersió total. El Bestiari de la Masia cobra vida.</span>
                        </div>
                    </button>
                </div>

                <div className="llar-foc-footer">
                    <p>La saviesa rural s'adapta al teu ritme.</p>
                </div>
            </div>
        </div>
    );
};

export default LlarDeFocMenu;
