// src/components/ui/MurCentralitzat.jsx
// Codi pur de producció optimitzat per a iPad A10 (16GB)
// 1 Sol listener en memòria i 0 wrappers estructurals redundants

import React from 'react';

/**
 * ELEMENT PARE: El Mur Semàntic
 * Centralitza la gestió d'esdeveniments per bombolleig (Event Bubbling)
 * i defineix la plantilla de files global per a la sincronització vertical.
 */
export function MurCentralitzat({ items, onAction }) {
  
  // 1. SISTEMA NERVIÓS CENTRAL: Intercepció quirúrgica d'events sense polsar referències
  const handleSinergiaNerviosa = (event) => {
    // Cerquem el node article més proper que continga l'ID de l'entitat
    const targetaNode = event.target.closest('[data-node-type="card"]');
    if (!targetaNode) return;

    const id = targetaNode.getAttribute('data-id');
    // Determinem l'acció exacta a partir de l'element polsat (botó, enllaç, etc.)
    const accio = event.target.getAttribute('data-action-type');

    if (id && accio) {
      // Execució directa cap al controlador d'estat de la UniversalPage
      onAction({ id, accio });
    }
  };

  return (
    <main 
      onClick={handleSinergiaNerviosa}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 p-6 w-full max-w-7xl mx-auto bg-[var(--bg-app)] antialiased"
      // Definim la plantilla estructural de 3 files per a cada bloc vertical del subgrid
      style={{ gridAutoRows: 'auto 1fr auto' }}
    >
      {items.map((item) => (
        <TargetaSubgrid key={item.id} item={item} />
      ))}
    </main>
  );
}

/**
 * ELEMENT FILL: La Targeta Atòmica
 * Disseny en línia de Pedra Seca. No utilitza divs de control d'alçada.
 * S'acobla de manera nativa a les coordenades tridimensionals del pare.
 */
export function TargetaSubgrid({ item }) {
  return (
    <article
      data-node-type="card"
      data-id={item.id}
      // row-span-3 obliga l'article a estendre's exactament sobre 3 línies de la graella pare
      // grid-rows-subgrid descarrega el càlcul d'alçada directament en el motor de render del navegador
      className="row-span-3 grid grid-rows-subgrid gap-4 p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm hover:border-emerald-200 transition-colors duration-150 h-full"
    >
      {/* FILA 1 SUBGRID: Capçalera d'Alt Contrast */}
      <header className="flex flex-col gap-0.5">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
          {item.category}
        </span>
        <h3 className="text-xl font-black text-gray-950 tracking-tight leading-tight">
          {item.title}
        </h3>
      </header>

      {/* FILA 2 SUBGRID: Cos del text (Sincronitzat horitzontalment amb les targetes veïnes) */}
      <p className="text-base md:text-lg text-gray-800 leading-relaxed font-normal overflow-hidden">
        {item.description}
      </p>

      {/* FILA 3 SUBGRID: Metadades i Actuador (Ancorat a la base sense espaiadors infinits) */}
      <footer className="flex items-center justify-between pt-3 border-t border-gray-50 self-end">
        <span className="text-xs font-semibold text-gray-500">
          {item.town_name}
        </span>
        <button
          type="button"
          data-action-type="exec-principal"
          className="px-5 py-2.5 bg-gray-950 hover:bg-emerald-900 active:scale-[0.97] text-white text-sm font-bold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Obrir
        </button>
      </footer>
    </article>
  );
}
