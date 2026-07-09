import React from 'react';

export const ColorSwatch = ({ color, textColor = 'white', name, cssVar, hex, shades = [] }) => (
  <article className="flex flex-col gap-y-2">
    {/* Substituït div exterior per un header semàntic de bloc cromàtic */}
    <header 
      className="rounded-2xl p-5 flex flex-col items-center justify-center text-center h-40 border border-black/10" 
      style={{ backgroundColor: color, color: textColor }}
    >
      <span className="font-bold text-lg">{name}</span>
      {cssVar && <span className="opacity-90 font-mono text-xs mt-2">{cssVar}</span>}
    </header>

    {/* Contenidor de degradats unificat en un footer estructural secundari */}
    {shades.length > 0 && (
      <footer className="flex w-full h-8 rounded-full overflow-hidden border border-black/5" aria-hidden="true">
        {shades.map((cls) => (
          <div key={cls} className={`flex-1 ${cls}`} />
        ))}
      </footer>
    )}

    {/* Aplatat el bloc de metadades del codi HEX: eliminat el fragment buit i encapsulat en un footer compacte */}
    {hex && (
      <footer className="p-3 bg-white border border-stone-100 rounded-2xl flex flex-col gap-y-0.5">
        <p className="font-bold text-sm text-stone-900 m-0">{name}</p>
        <p className="text-xs text-gray-500 font-mono m-0">{cssVar}</p>
        <p className="text-xs font-mono text-emerald-800 m-0 mt-1">{hex}</p>
      </footer>
    )}
  </article>
);
