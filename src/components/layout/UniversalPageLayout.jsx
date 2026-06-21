import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookText } from 'lucide-react';
import ActionBar from '../ui/ActionBar';

export default function UniversalPageLayout({
  id,
  title,
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
              aria-label="Índex" 
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
        
        {/* IMATGE DE PORTADA I BARRA TARONJA CANÒNICA OMITIDES PER BREVETAT (Mantenim el teu disseny previ) */}
      </header>
      
      {/* CONTINGUT: Isolate natiu pur de Tailwind i z-index lògic */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 isolate">
        <section className="bg-white rounded-[28px] p-6 sm:p-10 mb-8 flex flex-col shadow-md">
          <div className="text-left w-full">{children}</div>
        </section>
      </div>
    </article>
  );
}
