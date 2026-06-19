import React, { useState } from 'react';

export default function ProjectePage() {
  const [imgError, setImgError] = useState(false);
  const handleImgError = () => setImgError(true);

  return (
    <article 
      className="min-h-screen min-h-[100dvh] bg-[#f3f4f6] text-gray-900 md:pb-20"
    >
      {/* CAPÇALERA VISUAL · ESPAI RESERVAT DES DE EL PRIMER MOMENT → CLS=0 */}
      <header className="w-full relative">
        <div 
          className="w-full bg-[#1a1a1a] overflow-hidden relative" 
          style={{ paddingBottom: '37.5%' }}
        >
          {!imgError && (
              <img 
                src="/assets/media/backgrounds/landscape_placeholder.jpg" 
                alt="Paisatge de pedra seca" 
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
                src="/assets/system/icons/icon-orange.svg" 
                alt="" 
                aria-hidden="true"
                width="40" height="40" decoding="async"
                className="w-full h-full object-cover p-1 block" 
              />
            </div>
            <div>
              <h2 className="font-bold leading-tight text-[17px] m-0 tracking-wide">Sóc de Poble</h2>
              <p className="text-white/90 text-[13px] font-medium m-0 flex items-center gap-1">📍 La Torre de les Maçanes</p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTINGUT DE LA TARGETA */}
      <div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10"
        style={{ isolation: 'isolate' }}
      >
        <section 
          className="bg-white rounded-[28px] p-6 sm:p-10 mb-8 flex flex-col items-center text-center shadow-md"
          aria-labelledby="projecte-titol"
        >
          <img 
            src="/assets/system/ui/logo-socdepoble-rect-negre.svg" 
            alt="" 
            aria-hidden="true"
            width="360" height="96"
            decoding="async"
            loading="eager"
            className="h-16 sm:h-24 w-auto object-contain mb-2 block"
          />
          <h2 
            id="projecte-titol"
            className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight uppercase mb-4 font-display" 
          >
            EL PROJECTE
          </h2>
          
          <div className="text-left w-full space-y-10">
            <section aria-labelledby="perque-existim">
              <h3 
                id="perque-existim"
                className="text-2xl sm:text-3xl font-bold text-[#FF7300] mb-4 uppercase tracking-wide"
              >
                Per què existim?
              </h3>
              <p className="text-[19px] leading-relaxed text-gray-800 font-medium">
                Sóc de Poble és una manera de construir tecnologia arrelada al territori. No naixem per seguir modes ni tendències. Naixem perquè la tecnologia rural necessita ser clara, resistent i comprensible per a tothom.
              </p>
            </section>
          </div>
        </section>
      </div>
    </article>
  );
}
