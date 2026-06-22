import React from 'react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../app/context/I18nContext';
import { useNavigate } from 'react-router-dom';
import { Globe, Check } from 'lucide-react';
const LANGUAGES = [{
  code: 'va',
  label: 'Valencià (Català del Sud)',
  short: 'VA'
}, {
  code: 'es',
  label: 'Castellano',
  short: 'ES'
}, {
  code: 'en',
  label: 'English',
  short: 'EN'
}, {
  code: 'gl',
  label: 'Galego',
  short: 'GL'
}, {
  code: 'eu',
  label: 'Euskara',
  short: 'EU'
}];
const LanguageSelector = ({
  variant = 'header'
}) => {
  const {
    i18n
  } = useTranslation();
  const {
    setLanguage
  } = useI18n();
  const navigate = useNavigate();

  // Normalitzem l'idioma per coincidir exactament
  const activeLangCode = i18n.language?.split('-')[0] || 'va';
  const handleSelect = code => {
    setLanguage(code);
    // També guardem la preferència perquè persistesca
    localStorage.setItem('sp_language', code);
  };
  if (variant === 'profile') {
    return (
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-6 mb-2">
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
              <div className='w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316]'>
                  <Globe size={20} />
              </div>
              <div>
                  <h3 className="text-white font-bold text-base uppercase">Idioma i Cultura</h3>
                  <p className="text-white/50 text-sm">Tria l'idioma de l'aplicació i la memòria rural</p>
              </div>
          </div>
          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LANGUAGES.map(lang => <button key={lang.code} onClick={() => handleSelect(lang.code)} className={`px-4 py-3 rounded-xl flex items-center justify-between transition-all ${activeLangCode === lang.code ? 'bg-[#F97316]/20 text-[#F97316] font-bold ring-1 ring-[#F97316]/50' : 'text-white/80 hover:bg-white/10 bg-black/20'}`}>
              
                      {lang.label}
                      {activeLangCode === lang.code && <Check size={18} />}
                  </button>)}
          </div>
        </div>
    );
  }
  return <div className="relative">
      <button onClick={() => navigate('/traduccions')} className="max-[350px]:w-8 max-[350px]:h-8 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Canviar idioma / Change language">
        
        <Globe size={36} className="w-[36px] h-[36px] max-[350px]:w-[28px] max-[350px]:h-[28px] shrink-0" />
      </button>
    </div>;
};
export default LanguageSelector;