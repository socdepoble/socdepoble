import React from 'react';
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
      <div className="flex flex-col w-full bg-white min-h-screen relative text-[#111827]">
        
        {/* 1. CAPÇALERA NETA NEGRA */}
        <header className="h-14 flex justify-between items-center px-2 sm:px-4 bg-[#000000] text-white shrink-0 border-b border-white/10 sticky top-0 z-40">
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              onClick={handleBack} 
              aria-label="Tornar enrere"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              aria-label="Tornar a l'índex"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            >
              <BookText size={20} />
            </button>
          </div>
          
          {/* ActionBar Header Right (Accions) */}
          <div className="flex-1 flex justify-end">
            <ActionBar 
              entityId={id} 
              entityTitle={title} 
              entityType={type} 
              primaryLabel={primaryLabel}
              primaryEvent={primaryEvent}
              variant="header" 
            />
          </div>
        </header>

        <main className="flex-1 flex flex-col w-full z-10 relative">
          {/* 2. HERO TARONJA O IMATGE DE PORTADA */}
          {coverImage ? (
            <section className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden bg-black shrink-0">
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                {title ? <h1 className="text-3xl md:text-4xl font-black mb-1 leading-tight">{title}</h1> : null}
                {subtitle ? <p className="text-lg opacity-90">{subtitle}</p> : null}
              </div>
            </section>
          ) : (
            <section className="w-full bg-[#FF7300] text-white flex flex-col items-center justify-center px-6 py-12 shrink-0 min-h-[220px]">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center leading-none mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg md:text-xl font-medium opacity-90 text-center">
                  {subtitle}
                </p>
              )}
            </section>
          )}

          {/* 3. METADADES NEGRA */}
          <section className="sticky top-14 z-10 w-full bg-[#000000] text-white px-4 py-3 flex items-center gap-3 border-b border-white/10 shrink-0">
            {authorIcon && (
              <img
                src={authorIcon}
                alt={authorName}
                className="w-10 h-10 rounded-full bg-white/20 shrink-0 object-cover"
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-bold leading-tight truncate">
                {authorName}
              </span>
              <span className="text-xs opacity-60 font-mono tracking-wider uppercase truncate">
                {authorLocation}
              </span>
            </div>
          </section>

          {/* 4. CONTINGUT BLANC APLANAT */}
          <section className="flex-1 p-6 md:p-10 bg-white">
            <div className="max-w-4xl mx-auto w-full text-[#111827]">
              {/* Forcem que tot el text, inclusivament els paràgrafs, agafen el color fosc, per evitar fantasmes del CSS */}
              <div className="w-full max-w-none text-lg text-[#111827] [&_p]:text-[#111827] [&_h1]:text-[#111827] [&_h2]:text-[#111827] [&_h3]:text-[#111827] [&_li]:text-[#111827]">
                {children}
              </div>
            </div>
          </section>

        </main>
      </div>
    </LayoutProvider>
  );
}
