import React from 'react';
import { Section } from '../primitives/Section';

export const FormsAndInputs = React.memo(() => (
  <Section id="formularis" title="5. Formularis i Inputs">
    {/* Transmutem el div contenidor a un fieldset semàntic, eliminant capes i guanyant accessibilitat */}
    <fieldset className="sosp-card p-6 flex flex-col gap-6 max-w-xl border-0 m-0">
      <legend className="sr-only">Camps de mostra del sistema de disseny</legend>

      {/* 
        El <label> absorbeix el display: block per empaquetar l'input directament.
      */}
      <label htmlFor="demo-input" className="sosp-label block">
        Nom del poble
        <input
          id="demo-input"
          type="text"
          className="sosp-input mt-1 block w-full"
          placeholder="Ex: Petrer"
        />
      </label>

      <label htmlFor="demo-select" className="sosp-label block">
        Província
        <select id="demo-select" className="sosp-select mt-1 block w-full" aria-label="Selecció d'exemple">
          <option>Alacant</option>
          <option>València</option>
          <option>Castelló</option>
        </select>
      </label>

      <label htmlFor="demo-textarea" className="sosp-label block">
        Descripció
        <textarea
          id="demo-textarea"
          className="sosp-textarea mt-1 block w-full"
          rows={4}
          placeholder="Escriu una breu descripció..."
        />
      </label>

      {/* Amputat el div wrapper de contenció del checkbox: el label directament organitza el flux */}
      <label htmlFor="demo-check" className="flex items-start gap-3 text-sm text-stone-700 cursor-pointer font-medium select-none">
        <input id="demo-check" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800 focus:ring-emerald-600" />
        <span>Accepte els termes del Consell de la Petorreta</span>
      </label>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="demo-radio" defaultChecked />
          <span className="text-sm text-stone-700">Opció A</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="demo-radio" />
          <span className="text-sm text-stone-700">Opció B</span>
        </label>
      </div>

      {/* Inputs amb error i desactivats */}
      <label className="sosp-label block">
        Input amb error
        <input
          type="text"
          className="sosp-input sosp-input-error mt-1 block w-full"
          defaultValue="valor incorrecte"
        />
        <span className="sosp-text-error mt-1 block font-normal text-sm">Aquest camp és obligatori.</span>
      </label>

      <label className="sosp-label block">
        Input desactivat
        <input
          type="text"
          className="sosp-input mt-1 block w-full"
          disabled
          defaultValue="No editable"
        />
      </label>
    </fieldset>
  </Section>
));
