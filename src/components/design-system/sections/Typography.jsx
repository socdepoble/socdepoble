import React from 'react';
import { Section } from '../primitives/Section';

export const Typography = () => (
  <Section id="tipografia" title="2. Tipografia (CMS Universal)">
    <p className="text-sm text-gray-500 mb-4">
      Aquesta és la maquetació universal de l'ecosistema Sóc de Poble (app-cms-content), definida a <code>index.css</code>.
    </p>

    {/* S'ha eliminat el wrapper innecessari: s'ha fusionat sosp-card amb app-cms-content per reduir DOM_DEPTH */}
    <article className="app-cms-content border border-stone-200 p-8 rounded-xl bg-white relative overflow-hidden sosp-card mb-6">
      <span className="absolute top-2 right-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Preview CMS</span>
      
      <h1>El poble que no es rendeix</h1>
      
      <p className="lead">
        <strong>Sóc de Poble</strong> és una plataforma dedicada a preservar la memòria digital dels pobles valencians, lluitant contra l'obsolescència tecnològica. Aquesta és la <em>entradilla</em> (lead paragraph).
      </p>

      <h2>2. Història i Memòria</h2>
      <p>
        El text de cos és la columna vertebral de tota lectura. Ha de ser còmode, amb interlineat generós i mida base que no baixe de 16px en mòbil. Aquest és un paràgraf estàndard.
      </p>

      <h3>2.1 Arrels del passat</h3>
      <p>Això és un exemple de llista no ordenada seguida d'un paràgraf:</p>
      <ul>
        <li>Fotografies antigues i retalls de premsa.</li>
        <li>Documents administratius i actes municipals.</li>
        <li>Entrevistes orals als majors del poble.</li>
      </ul>

      <h4>Testimonis clau</h4>
      <p>Per separar conceptes podem utilitzar diferents nivells. I també cites importants:</p>
      
      <blockquote>
        <p>“Un poble sense memòria és com un arbre sense arrels, condemnat a caure al primer vent fort.”</p>
      </blockquote>

      <h5>Mètodes de conservació</h5>
      <ol>
        <li>Registrar-se al portal de Sóc de Poble.</li>
        <li>Seleccionar el poble a la llista d'actius.</li>
        <li>Pujar el contingut històric amb les metadades.</li>
      </ol>

      <h6>Nota addicional</h6>
      <p>L'ús de regles horitzontals està prohibit, la jerarquia visual es fa només amb encapçalaments.</p>
      
      <pre><code>{`// Exemple de codi inline
const poble = "Petrer";`}</code></pre>
    </article>
  </Section>
);
