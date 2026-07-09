import React from 'react';
import { Section } from '../primitives/Section';

export const Buttons = () => (
  <Section id="botons" title="4. Botons">
    <h3 className="sosp-h3 mb-4">Variants</h3>
    <div className="flex flex-wrap gap-4 mb-8">
      <button className="sosp-btn sosp-btn-primari" aria-describedby="empathy-msg-1" data-empathy-halo="true">
        <span className="empathy-halo" aria-hidden="true"></span>
        <span className="sosp-btn__text">Primari</span>
        <span id="empathy-msg-1" className="empathy-message" role="status" aria-live="polite"></span>
      </button>
      <button className="sosp-btn sosp-btn-secundari">Secundari</button>
      <button className="sosp-btn sosp-btn-terciari">Terciari</button>
      <button className="sosp-btn sosp-btn-neutral">Neutral / Base</button>
      <button className="sosp-btn sosp-btn-perill">Perill</button>
      <button className="sosp-btn sosp-btn-fantasma">Fantasma</button>
      <button className="sosp-btn sosp-btn-enllac">Enllaç</button>
    </div>

    <h3 className="sosp-h3 mb-4">Mides</h3>
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <button className="sosp-btn sosp-btn-primari sosp-btn-sm">Petit</button>
      <button className="sosp-btn sosp-btn-primari">Normal</button>
      <button className="sosp-btn sosp-btn-primari sosp-btn-lg">Gran</button>
    </div>

    <h3 className="sosp-h3 mb-4">Estats</h3>
    <div className="flex flex-wrap gap-4 mb-8">
      <button className="sosp-btn sosp-btn-primari">Normal</button>
      <button className="sosp-btn sosp-btn-primari" disabled>Desactivat</button>
      <button className="sosp-btn sosp-btn-primari">
        <div className="sosp-spinner sosp-spinner-sm" style={{borderColor: '#fff', borderTopColor: 'transparent'}}></div>
        Carregant...
      </button>
    </div>

    <h3 className="sosp-h3 mb-4">Amb icona</h3>
    <div className="flex flex-wrap gap-4">
      <button className="sosp-btn sosp-btn-primari">
        <span>➕</span> Afegir
      </button>
      <button className="sosp-btn sosp-btn-secundari">
        <span>🗑️</span> Eliminar
      </button>
    </div>
  </Section>
);
