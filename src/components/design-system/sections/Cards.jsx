import React from 'react';
import { Section } from '../primitives/Section';

export const Cards = () => (
  <Section id="targetes" title="6. Targetes">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Targeta 1: Estructura vertical neta */}
      <article className="sosp-card p-6 flex flex-col gap-y-2">
        <h3 className="text-lg font-bold text-stone-900 m-0">Targeta bàsica</h3>
        <p className="text-stone-600 m-0 leading-relaxed">
          Contenidor amb ombra suau, cantonades arrodonides i vora de 1px.
          Fons blanc trencat per a màxim contrast en pantalles IPS.
        </p>
      </article>

      {/* Targeta 2: Amputat el div de capçalera per un <header> legítim */}
      <article className="sosp-card overflow-hidden flex flex-col">
        <header className="bg-[#f97316] p-4">
          <h3 className="text-lg font-bold text-white m-0">Targeta amb capçalera</h3>
        </header>
        <p className="text-stone-600 p-6 m-0 leading-relaxed">
          La capçalera porta el color de marca. Útil per a destacar seccions importants.
        </p>
      </article>

      {/* Targeta 3: Substituïts els divs interns per <section> i <footer> natius. Afegit type="button" reglamentari */}
      <article className="sosp-card flex flex-col justify-between">
        <section className="p-6 flex flex-col gap-y-2">
          <h3 className="text-lg font-bold text-stone-900 m-0">Targeta amb accions</h3>
          <p className="text-stone-600 m-0 leading-relaxed">
            Peu de targeta amb botons d'acció clarament separats.
          </p>
        </section>
        <footer className="p-4 border-t border-stone-200 flex gap-2 justify-end bg-stone-50 rounded-b-xl">
          <button type="button" className="sosp-btn sosp-btn-fantasma">Cancel·lar</button>
          <button type="button" className="sosp-btn sosp-btn-primari">Guardar</button>
        </footer>
      </article>

      {/* Targeta d'informació */}
      <article className="sosp-card border-l-4 border-l-[#16A34A] p-6 flex flex-col">
        <header className="flex items-center gap-2 mb-2">
          <span className="text-[#16A34A]" aria-hidden="true">ℹ️</span>
          <h3 className="text-lg font-bold text-stone-900 m-0">Targeta d'informació</h3>
        </header>
        <p className="text-stone-600 m-0 leading-relaxed">
          Vora esquerra acolorida per a indicar tipus de contingut.
          Verd per a èxit/informació, roig per a alertes.
        </p>
      </article>

    </div>
  </Section>
);
