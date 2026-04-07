import React, { useState } from 'react';
import { MapPin, BadgeCheck, Settings, Users, Grid, Store, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EntityProfile({ entity, isOwner, onSettingsClick }) {
  const navigate = useNavigate();
  // entity es el snapshot JSON derivado del documento Y.js de esta identidad
  const [activeTab, setActiveTab] = useState('feed'); 
  
  // Safe defaults en caso de que la entidad no esté completamente hidratada
  const profile = entity?.profile || {};
  const state = entity?.state || {};
  const traits = entity?.traits || {};
  const type = entity?.type || 'persona';

  return (
    <div className="atom-root bg-theme-base min-h-screen pb-20">
      {/* HEADER SOBERANO */}
      <header className="relative w-full h-48 sm:h-64 bg-black/10 dark:bg-white/5 border-b border-border-master">
        {profile.bannerUrl && (
          <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover" loading="lazy" />
        )}
        <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
            <button 
                onClick={() => navigate(-1)} 
                className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95"
            >
                <ArrowLeft size={24} />
            </button>
        </div>
        <div className="absolute -bottom-16 left-6 right-6 flex justify-between items-end z-10">
          <div className="w-32 h-32 rounded-full border-4 border-theme-panel bg-theme-panel overflow-hidden shadow-lg glass-rural">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName || "Avatar"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/10 dark:bg-white/10 text-4xl font-black text-theme-text opacity-50">
                {(profile.displayName || "NN").substring(0,2).toUpperCase()}
              </div>
            )}
          </div>
          {isOwner && (
            <button 
              onClick={onSettingsClick}
              className="btn-tactile bg-theme-panel text-theme-text border border-border-master px-4 py-2 text-sm font-bold flex items-center rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Settings size={18} className="mr-2" />
              Configurar Identitat
            </button>
          )}
        </div>
      </header>

      {/* METADATOS BÁSICOS */}
      <div className="mt-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-theme-text flex items-center gap-2">
          {profile.displayName || 'Entitat Desconeguda'} 
          {state.isVerified && <BadgeCheck className="text-theme-accent-secondary" size={24} />}
        </h1>
        <p className="text-theme-accent-primary font-bold text-base mb-2">
          {profile.handle || '@identitat_p2p'}
        </p>
        
        {profile.location && (
          <p className="text-[var(--text-muted)] flex items-center text-sm font-semibold mb-4">
            <MapPin size={16} className="mr-1" /> {profile.location}
          </p>
        )}
        <p className="text-base leading-relaxed text-theme-text max-w-2xl mb-6">
          {profile.bio || "Aquesta identitat encara no ha escrit la seua biografia en la xarxa local."}
        </p>

        {/* NAVEGACIÓN TÁCTIL (TABS) */}
        <div className="flex gap-2 border-b border-border-master mb-6 overflow-x-auto no-scrollbar scroll-smooth">
          <TabButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Grid size={18} />} label="Activitat" />
          <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Users size={18} />} label="Trellat i Dades" />
          {type === 'empresa' && (
            <TabButton active={activeTab === 'store'} onClick={() => setActiveTab('store')} icon={<Store size={18} />} label="Aparador" />
          )}
        </div>

        {/* VIEWPORT CONTENIDO (Condicional según tab) */}
        <main className="stable-scroll min-h-[40vh] pb-10">
           {activeTab === 'feed' && (
             <div className="text-[var(--text-muted)] text-sm text-center py-10 glass-rural rounded-2xl mx-2">
               Sesión P2P: Sense activitat recent a la malla local.
             </div>
           )}
           {activeTab === 'info' && <TraitsViewer traits={traits} type={type} />}
           {activeTab === 'store' && type === 'empresa' && (
             <div className="text-[var(--text-muted)] text-sm text-center py-10 glass-rural rounded-2xl mx-2">
               Aparador buit. No hi ha productes de temporada carregats al CRDT.
             </div>
           )}
        </main>
      </div>
    </div>
  );
}

// Componente helper para tabs táctiles GEM Modern
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 font-bold text-sm tracking-wide transition-all rounded-t-2xl whitespace-nowrap 
      ${active ? 'text-theme-accent-primary bg-[var(--theme-accent-primary)]/10 shadow-[inset_0_-3px_0_var(--theme-accent-primary)]' : 'text-[var(--text-muted)] hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

// Mapeo polimórfico de los traits
const TraitsViewer = ({ traits, type }) => {
  if (!traits || Object.keys(traits).length === 0) {
    return (
      <div className="glass-rural p-6 rounded-3xl mx-2 text-center text-sm font-bold text-[var(--text-muted)]">
        No s'han trobat trets genotípics per aquesta identitat.
      </div>
    );
  }

  const typeConfig = {
    persona: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
    empresa: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
    institucion: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
    default: { color: 'text-gray-500', bg: 'bg-gray-500/10' }
  };
  
  const theme = typeConfig[type] || typeConfig.default;

  return (
    <div className="glass-rural p-6 rounded-3xl mx-2 shadow-sm border border-black/5 dark:border-white/5">
      <div className="flex items-center gap-3 mb-6 border-b border-border-master pb-4">
        <span className={`uppercase font-black text-xs tracking-wider px-3 py-1 rounded-full ${theme.bg} ${theme.color}`}>
          Genotip: {type}
        </span>
        <h3 className="font-bold text-theme-text text-lg">Trets Estructurals</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.entries(traits).map(([key, value]) => (
          <div key={key} className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-black block mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-sm font-bold text-theme-text">
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {value.length > 0 ? value.map(v => (
                    <span key={v} className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md text-xs">{v}</span>
                  )) : <span className="opacity-50 italic">Cap valor definit</span>}
                </div>
              ) : (
                value || <span className="opacity-50 italic">Pendent de definició</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
