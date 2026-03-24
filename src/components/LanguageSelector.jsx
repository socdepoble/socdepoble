import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'va', label: 'Valencià (Català del Sud)', short: 'VA' },
  { code: 'es', label: 'Castellano', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'gl', label: 'Galego', short: 'GL' },
  { code: 'eu', label: 'Euskara', short: 'EU' }
];

const LanguageSelector = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalitzem l'idioma per coincidir exactament
  const activeLangCode = i18n.language?.split('-')[0] || 'va';
  const currentLang = LANGUAGES.find(l => l.code === activeLangCode) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    // També guardem la preferència perquè persistesca
    localStorage.setItem('sp_language', code);
  };

  if (variant === 'profile') {
    return (
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-6 mb-2">
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--theme-accent-primary)]/20 flex items-center justify-center text-[var(--theme-accent-primary)]">
                <Globe size={20} />
            </div>
            <div>
                <h3 className="text-white font-bold text-base uppercase">Idioma i Cultura</h3>
                <p className="text-white/50 text-sm">Tria l'idioma de l'aplicació i la memòria rural</p>
            </div>
        </div>
        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LANGUAGES.map(lang => (
                <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`px-4 py-3 rounded-xl flex items-center justify-between transition-all ${activeLangCode === lang.code ? 'bg-[var(--theme-accent-primary)]/20 text-[var(--theme-accent-primary)] font-bold ring-1 ring-[var(--theme-accent-primary)]/50' : 'text-white/80 hover:bg-white/10 bg-black/20'}`}
                >
                    <span>{lang.label}</span>
                    {activeLangCode === lang.code && <Check size={18} />}
                </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors gap-1.5 uppercase font-bold text-[11px] lg:text-xs tracking-widest"
        title="Canviar idioma / Change language"
      >
        <Globe size={20} className="lg:w-[22px] lg:h-[22px]" />
        <span className="hidden xl:block">{currentLang.short}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[#111827]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-5 py-3.5 text-sm flex items-center justify-between transition-colors
                ${activeLangCode === lang.code ? 'bg-[var(--theme-accent-primary)]/20 text-[var(--theme-accent-primary)] font-bold' : 'text-white/80 hover:bg-white/5'}
              `}
            >
              <span>{lang.label}</span>
              {activeLangCode === lang.code && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
