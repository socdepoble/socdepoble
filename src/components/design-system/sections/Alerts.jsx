import React from 'react';
import { Section } from '../primitives/Section';

export const Alerts = () => (
  <Section id="alertes" title="7. Alertes i Missatges">
    <div className="space-y-4 mb-8">
      {/* 
        S'ha eliminat el div contenidor de textos.
        Ara l'alerta utilitza CSS Grid o Flex per a alinear els elements directament.
      */}
      <div className="sosp-alert sosp-alert-info flex items-start gap-3">
        <span className="sosp-alert-icon mt-0.5">ℹ️</span>
        <div className="flex flex-col gap-1">
          <p className="font-bold m-0 leading-none">Informació</p>
          <p className="text-sm m-0 text-stone-700">Aquesta és una alerta informativa per a destacar dades rellevants.</p>
        </div>
      </div>

      <div className="sosp-alert sosp-alert-success flex items-start gap-3">
        <span className="sosp-alert-icon mt-0.5">✅</span>
        <div className="flex flex-col gap-1">
          <p className="font-bold m-0 leading-none">Èxit</p>
          <p className="text-sm m-0 text-stone-700">L'operació s'ha completat correctament.</p>
        </div>
      </div>

      <div className="sosp-alert sosp-alert-warning flex items-start gap-3">
        <span className="sosp-alert-icon mt-0.5">⚠️</span>
        <div className="flex flex-col gap-1">
          <p className="font-bold m-0 leading-none">Avís</p>
          <p className="text-sm m-0 text-stone-700">Revisa els camps abans de continuar.</p>
        </div>
      </div>

      <div className="sosp-alert sosp-alert-error flex items-start gap-3">
        <span className="sosp-alert-icon mt-0.5">🚨</span>
        <div className="flex flex-col gap-1">
          <p className="font-bold m-0 leading-none">Error</p>
          <p className="text-sm m-0 text-stone-700">No s'ha pogut connectar amb el servidor.</p>
        </div>
      </div>
    </div>
  </Section>
);
