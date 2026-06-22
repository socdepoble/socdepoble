import React from 'react';
import ActionBar from '../ui/ActionBar';
import '../../styles/legacy-compat.css'; // Importem els styles de compatibilitat

export default function UniversalShell({
  children,
  title,
  subtitle,
  item,
  variant = 'post'
}) {
  const displayTitle = title || item?.title || 'Sóc de Poble';
  const displaySubtitle = subtitle || item?.subtitle || '';

  return (
    <div className="flex flex-col w-full bg-white min-h-screen relative">
      
      {/* 1. CAPÇALERA DE NAVEGACIÓ */}
      <header className="h-14 flex items-center px-4 bg-[#000000] text-white shrink-0 border-b border-white/10 sticky top-0 z-40">
        <h1 className="font-bold text-lg tracking-tight">{displayTitle}</h1>
      </header>

      {/* Zona principal */}
      <main className="flex-1 flex flex-col w-full z-10 relative">

        {/* 2. HERO TARONJA */}
        <section
          className="w-full bg-[#FF7300] text-white flex items-center justify-center px-6 py-10 shrink-0 min-h-[180px]"
          aria-label="Portada"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center leading-none">
            {displaySubtitle || displayTitle}
          </h2>
        </section>

        {/* 3. BARRA DE METADADES */}
        {item ? (
          <section className="sticky top-14 z-10 w-full bg-[#000000] text-white px-4 py-3 flex items-center gap-3 border-b border-white/10 shrink-0">
            {item.author_avatar ? (
              <img
                src={item.author_avatar}
                alt={item.author_name || ''}
                className="w-10 h-10 rounded-full bg-white/20 shrink-0 object-cover"
                loading="lazy"
              />
            ) : (
              <div 
                role="img"
                aria-label={item.author_name ? `Avatar de ${item.author_name}` : 'Avatar per defecte'}
                className="w-10 h-10 rounded-full bg-white/20 shrink-0 flex items-center justify-center font-bold"
              >
                <span aria-hidden="true">
                  {item.author_name ? item.author_name.charAt(0).toUpperCase() : 'S'}
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-bold leading-tight truncate">
                {item.author_name || 'Sóc de Poble'}
              </span>
              <span className="text-xs opacity-60 font-mono tracking-wider uppercase">
                {item.town_name || 'NODE AUTORITZAT'}
              </span>
            </div>
          </section>
        ) : null}

        {/* 4. CONTINGUT */}
        <section className="flex-1 p-6 md:p-10 bg-white">
          <div className="max-w-4xl mx-auto w-full text-[#111827]">
            {children}
          </div>
        </section>

      </main>

      {/* 5. BARRA D'ACCIONS */}
      <div className="sticky bottom-0 w-full z-50 bg-[#000000]/90 backdrop-blur-md border-t border-white/10" style={{ willChange: 'transform' }}>
        <ActionBar
          entityId={item?.id}
          entityType={item?.type || variant}
          entityTitle={displayTitle}
          primaryLabel={item?.type === 'market' ? 'CONNECTAR' : 'AFEGIR'}
          primaryEvent={item?.type === 'market' ? 'sdp:connect' : 'sdp:comment'}
          variant={variant}
        />
      </div>

    </div>
  );
}
