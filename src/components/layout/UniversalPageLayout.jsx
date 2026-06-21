import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookText } from 'lucide-react';
import ActionBar from '../ui/ActionBar';
import { LayoutProvider } from '../../contexts/LayoutContext';

export default function UniversalPageLayout({
  id,
  title,
  subtitle,
  coverImage,
  authorIcon = '/assets/system/icons/icon-orange.svg',
  authorName = 'Sóc de Poble',
  authorLocation = 'La Torre de les Maçanes',
  type = 'page',
  primaryLabel = 'CONNECTAR',
  primaryEvent = 'CONNECT',
  children
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <LayoutProvider hideActionBar={true}>
      <article className="min-h-screen min-h-[100dvh] bg-[var(--sdp-fons,#f3f4f6)] text-[var(--sp-text,#111827)] md:pb-20">
        <header className="w-full relative">
        
        {/* BARRA BLAVA CANÒNICA */}
        <div 
          className="w-full bg-[#0984E3] text-white flex justify-between items-center px-2 sm:px-3 h-14 min-h-[56px] shadow-sm z-20 relative shrink-0"
          role="banner"
          aria-label="Capçalera de la pàgina"
        >
          
          {/* Navegació Esquerra */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button 
              type="button" 
              aria-label="Tornar enrere" 
              onClick={handleBack} 
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/30 active:bg-white/40 text-white shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white touch-manipulation"
            >
              <ArrowLeft size={24} aria-hidden="true" />
            </button>
            <button 
              type="button" 
              aria-label="Tornar a l'índex principal de publicacions" 
              onClick={() => navigate('/')}
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/30 active:bg-white/40 text-white shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white touch-manipulation"
            >
              <BookText size={24} aria-hidden="true" />
            </button>
          </div>
          
          {/* ActionBar Header Right */}
          <ActionBar 
            entityId={id} 
            entityTitle={title} 
            entityType={type} 
            primaryLabel={primaryLabel}
            primaryEvent={primaryEvent}
            variant="header" 
          />
        </div>
        
        {/* Imatge de Portada */}
        {coverImage && (
          <div className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden bg-slate-900">
            <img src={coverImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
              {title && <h1 className="text-2xl sm:text-3xl font-black mb-1 leading-tight">{title}</h1>}
              {subtitle && <p className="text-sm sm:text-base opacity-90">{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Barra Taronja Canònica */}
        <div className="bg-[var(--sdp-taronja,#FF7300)] text-white px-4 py-3 flex items-center gap-3">
          {authorIcon && <img src={authorIcon} alt="" className="w-10 h-10 rounded-none bg-white/10 object-cover" />}
          <div className="flex flex-col min-w-0">
            <span className="font-bold truncate text-sm sm:text-base">{authorName}</span>
            <span className="text-xs sm:text-sm opacity-90 truncate">{authorLocation}</span>
          </div>
        </div>
      </header>
      
      {/* CONTINGUT: Isolate natiu pur de Tailwind i z-index lògic */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 relative z-10 isolate">
        <section className="bg-white rounded-[28px] p-6 sm:p-10 mb-8 flex flex-col shadow-md">
          {(!coverImage && title) && <h1 className="text-3xl font-black mb-2">{title}</h1>}
          {(!coverImage && subtitle) && <p className="text-xl text-gray-600 mb-6">{subtitle}</p>}
          <div className="text-left w-full">{children}</div>
        </section>
      </div>
      </article>
    </LayoutProvider>
  );
}
