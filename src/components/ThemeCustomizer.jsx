import React from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Sun, Moon, Scroll, RotateCcw, Check } from 'lucide-react';
import './ThemeCustomizer.css';

const ThemeCustomizer = ({ onClose }) => {
    const { visualDemocracy, setVisualDemocracy, resetTheme, availableThemes } = useTheme();

    const getIcon = (id) => {
        switch (id) {
            case 'pedra-seca': return <Scroll size={20} />;
            case 'oli-suau': return <Sun size={20} />;
            case 'gem-modern': return <Moon size={20} />;
            default: return <Scroll size={20} />;
        }
    };

    return (
        <div className="theme-customizer animate-in">
            <div className="customizer-header">
                <h3>Personalitzador Sobirà</h3>
                <p>Tria com vols viure el poble hui</p>
            </div>

            <div className="themes-grid">
                {availableThemes.map((t) => (
                    <button
                        key={t.id}
                        className={`theme-card ${visualDemocracy === t.id ? 'active' : ''} theme-${t.id}`}
                        onClick={() => setVisualDemocracy(t.id)}
                    >
                        <div className="theme-icon">{getIcon(t.id)}</div>
                        <div className="theme-info">
                            <span className="theme-name">{t.name}</span>
                            {visualDemocracy === t.id && <Check size={16} className="active-check" />}
                        </div>
                    </button>
                ))}
            </div>

            <div className="customizer-footer">
                <button className="btn-reset-theme" onClick={resetTheme}>
                    <RotateCcw size={18} />
                    <span>Restaurar Disseny Original</span>
                </button>
                {onClose && (
                    <button className="btn-close-customizer" onClick={onClose}>
                        Fet
                    </button>
                )}
            </div>
        </div>
    );
};

export default ThemeCustomizer;
