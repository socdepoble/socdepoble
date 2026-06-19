import React, { useState } from 'react';

export default function UniversalPageLayout({
  title,
  subtitle,
  coverImage,
  authorIcon = '/assets/system/icons/icon-orange.svg',
  authorName = 'Sóc de Poble',
  authorLocation = 'La Torre de les Maçanes',
  children
}) {
  const [imgError, setImgError] = useState(false);
  const handleImgError = () => setImgError(true);

  return (
    <article className="min-h-screen min-h-[100dvh] bg-[#f3f4f6] text-gray-900 md:pb-20">
      
      {/* CAPÇALERA VISUAL (Universal Page Pattern) */}
      <header className="w-full relative">
        
        {/* BARRA BLAVA (Tornar enrere / Índex) */}
        <div className="w-full bg-[#0984E3] text-white flex justify-between items-center px-4" style={{ minHeight: 48 }}>
          <button type="button" aria-label="Tornar enrere" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <span aria-hidden="true" className="text-xl">←</span>
          </button>
          
          <div className="flex items-center gap-2 font-bold text-sm tracking-wider uppercase">
            <span aria-hidden="true">📑</span> ÍNDEX
          </div>
        </div>

        {/* IMATGE DE PORTADA */}
        <div 
          className="w-full bg-[#1a1a1a] overflow-hidden relative" 
          style={{ paddingBottom: '37.5%' }}
        >
          {!imgError && coverImage && (
              <img 
                src={coverImage}
                alt={`Portada de ${title}`}
                width="1920" height="720"
                decoding="async"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover block"
                onError={handleImgError}
              />
          )}
        </div>
        
        {/* BARRA TARONJA CANÒNICA #FF7300 */}
        <div 
          className="w-full bg-[#FF7300] p-4 flex justify-between items-center text-white shadow-sm"
          style={{ minHeight: 60 }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img 
                src={authorIcon}
                alt="" 
                aria-hidden="true"
                width="40" height="40" decoding="async"
                className="w-full h-full object-cover p-1 block" 
              />
            </div>
            <div>
              <h2 className="font-bold leading-tight text-[17px] m-0 tracking-wide">{authorName}</h2>
              <p className="text-white/90 text-[13px] font-medium m-0 flex items-center gap-1">📍 {authorLocation}</p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTINGUT (Amb overlap) */}
      <div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10"
        style={{ isolation: 'isolate' }}
      >
        <section 
          className="bg-white rounded-[28px] p-6 sm:p-10 mb-8 flex flex-col shadow-md"
        >
          {title && (
            <div className="flex flex-col items-center text-center mb-8">
              <img 
                src="/assets/system/ui/logo-socdepoble-rect-negre.svg" 
                alt="" 
                aria-hidden="true"
                width="360" height="96"
                decoding="async"
                loading="eager"
                className="h-16 sm:h-24 w-auto object-contain mb-2 block"
              />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight uppercase mb-4 font-display">
                {title}
              </h1>
              {subtitle && (
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FF7300] uppercase tracking-wide">
                  {subtitle}
                </h2>
              )}
            </div>
          )}
          
          <div className="text-left w-full">
            {children}
          </div>
        </section>
      </div>
    </article>
  );
}
