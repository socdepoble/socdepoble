// ╔══════════════════════════════════════════════════════════════════╗
// ║  🚨 DIRECTIVA SOSP-LOCK: "NO TOCAR SI NO ESTÀ ROTO"              ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  ESTAT DEL FITXER: 🔴 TANCAT (LOCKED)                            ║
// ║  MOTIU: Acord Arquitectònic Consolidat                           ║
// ║  DATA: 08/06/2026                                                ║
// ║  REVISOR: Consell de la Petorreta (Kimi / IAIA / Claude)         ║
// ║  ESTAT V23: ⚠️ ARXIU HISTÒRIC LLEGAT. NO LLEGIR COM A VERITAT.   ║
// ║                                                                  ║
// ║  REGLA INQUEBRANTABLE PER A QUALSEVOL IA EN EL FUTUR:            ║
// ║  1. Aquest fitxer NO ES POT REESCRIURE SENCER. Mai.              ║
// ║  2. NO s'acceptaran refactors estètics o "millores de codi".     ║
// ║  3. Només es permeten canvis en "Mode Pegat" (Patch Mode).       ║
// ║  4. Per a modificar-lo necessites rebre el token explícit:       ║
// ║     "PERMÍS SOSP CONCEDIT: [Raó de la modificació]"              ║
// ║                                                                  ║
// ║  INCOMPLIR AQUESTA NORMA ES CONSIDERARÀ UN ERROR CRÍTIC.         ║
// ╚══════════════════════════════════════════════════════════════════╝

import React from 'react';
import UniversalPage from '../public/UniversalPage';
import UniversalCard from '../../components/ui/universal-card';
import './sosp-components.css'; // Importem el CSS que defineix l'Arquitectura Pedra Seca (pur HTML/CSS)

export default function DesignSystem() {
  return (
    <UniversalPage standAlone={false} forcedTitle="Sistema de Disseny Sóc de Poble" forcedSubtitle="Arquitectura Pedra Seca per a interfícies que han de funcionar a ple sol en un iPad A10 amb gent major que mira de prop." forcedHeroImage="/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png">
        
        <div className="universal-content w-full sosp-design-system max-w-5xl mx-auto p-6 pb-24">

          <div className="sosp-alert sosp-alert-info mb-8">
            <span className="sosp-alert-icon">ℹ️</span>
            <div>
              <p className="font-bold m-0">Construcció en curs</p>
              <p className="text-sm m-0">Un poc de paciència la primera volta, que tarda a carregar-ho tot. Estem cimentant els fonaments d'El Mas digital.</p>
            </div>
          </div>

          <div className="mb-12 flex gap-4 text-sm text-stone-500 border-b-2 border-stone-300 pb-6 justify-center">
            🎯 Filosofia: Trellat
            📐 Base: 1rem = 16px
            ♿ WCAG 2.1 AA
            📱 iOS Safari 14+
          </div>

        {/* ====================================================== */}
        {/* SECCIÓ 1: PALETA CROMÀTICA                             */}
        {/* ====================================================== */}
        <section className="mb-16" id="paleta">
          <h2 className="sosp-h2 mb-6">1. Paleta Cromàtica</h2>

          <h3 id="colors">1.2. Identitat Cromàtica (Colors)</h3>
          <p className="text-sm text-stone-600 mb-4">Colors purs i vibrants preparats per al contrast màxim en mode fosc i clar. Calcats de la normativa oficial de disseny.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 notranslate">
            {/* Primary */}
            <div className="flex flex-col gap-2">
              <div className="text-white rounded-lg p-5 flex flex-col items-center justify-center text-center h-40 shadow-sm border border-black/5" style={{ backgroundColor: 'var(--md-sys-color-primary)' }}>
                <span className="font-bold text-lg">Primary</span>
                <span className="opacity-90 font-mono text-xs mt-2">var(--md-sys-color-primary)</span>
              </div>
              <div className="flex w-full h-8 rounded-full overflow-hidden border border-black/5">
                {['bg-orange-950', 'bg-orange-900', 'bg-orange-800', 'bg-orange-700', 'bg-orange-600', 'bg-orange-500', 'bg-orange-400', 'bg-orange-300', 'bg-orange-200', 'bg-orange-100'].map(cls => <div key={cls} className={`flex-1 ${cls}`}></div>)}
              </div>
            </div>

            {/* Secondary */}
            <div className="flex flex-col gap-2">
              <div className="bg-[#0984E3] text-white rounded-3xl p-5 flex flex-col items-center justify-center text-center h-40 shadow-sm border border-black/5">
                <span className="font-bold text-lg">Secondary</span>
                <span className="opacity-90 font-mono text-xs mt-2">var(--md-sys-color-secondary)</span>
              </div>
              <div className="flex w-full h-8 rounded-full overflow-hidden border border-black/5">
                {['bg-sky-950', 'bg-sky-900', 'bg-sky-800', 'bg-sky-700', 'bg-sky-600', 'bg-sky-500', 'bg-sky-400', 'bg-sky-300', 'bg-sky-200', 'bg-sky-100'].map(cls => <div key={cls} className={`flex-1 ${cls}`}></div>)}
              </div>
            </div>

            {/* Tertiary */}
            <div className="flex flex-col gap-2">
              <div className="bg-white text-[#0e0e10] rounded-3xl p-5 flex flex-col items-center justify-center text-center h-40 shadow-sm border border-black/10">
                <span className="font-bold text-lg">Tertiary / Surface</span>
                <span className="opacity-90 font-mono text-xs mt-2">var(--md-sys-color-surface)</span>
              </div>
              <div className="flex w-full h-8 rounded-full overflow-hidden border border-black/10">
                {['bg-gray-900', 'bg-gray-800', 'bg-gray-700', 'bg-gray-600', 'bg-gray-500', 'bg-gray-400', 'bg-gray-300', 'bg-gray-200', 'bg-gray-100', 'bg-white'].map(cls => <div key={cls} className={`flex-1 ${cls}`}></div>)}
              </div>
            </div>

            {/* Neutral */}
            <div className="flex flex-col gap-2">
              <div className="bg-[#0e0e10] text-white rounded-3xl p-5 flex flex-col items-center justify-center text-center h-40 shadow-sm border border-white/10">
                <span className="font-bold text-lg">Neutral / Base</span>
                <span className="opacity-90 font-mono text-xs mt-2">var(--md-sys-color-on-surface)</span>
              </div>
              <div className="flex w-full h-8 rounded-full overflow-hidden border border-white/20">
                {['bg-black', 'bg-zinc-900', 'bg-zinc-800', 'bg-zinc-700', 'bg-zinc-600', 'bg-zinc-500', 'bg-zinc-400', 'bg-zinc-300', 'bg-zinc-200', 'bg-zinc-100'].map(cls => <div key={cls} className={`flex-1 ${cls}`}></div>)}
              </div>
            </div>
          </div>

          <h3 className="sosp-h3 mb-4 mt-12">Colors de Suport</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="sosp-card overflow-hidden">
              <div className="h-20 bg-[#87CEEB] rounded-t" />
              <div className="p-3 bg-white border-t-0 rounded-b">
                <p className="font-bold text-sm">Cel SOSP</p>
                <p className="text-xs text-gray-500">--color-cel</p>
                <p className="text-xs font-mono mt-1">#87CEEB</p>
              </div>
            </div>
            <div className="sosp-card overflow-hidden">
              <div className="h-20 bg-[#DC2626] rounded-t" />
              <div className="p-3 bg-white border-t-0 rounded-b">
                <p className="font-bold text-sm">Alerta</p>
                <p className="text-xs text-gray-500">--color-alerta</p>
                <p className="text-xs font-mono mt-1">#DC2626</p>
              </div>
            </div>
            <div className="sosp-card overflow-hidden">
              <div className="h-20 bg-[#F59E0B] rounded-t" />
              <div className="p-3 bg-white border-t-0 rounded-b">
                <p className="font-bold text-sm">Avís</p>
                <p className="text-xs text-gray-500">--color-avis</p>
                <p className="text-xs font-mono mt-1">#F59E0B</p>
              </div>
            </div>
            <div className="sosp-card overflow-hidden">
              <div className="h-20 bg-[#16A34A] rounded-t" />
              <div className="p-3 bg-white border-t-0 rounded-b">
                <p className="font-bold text-sm">Èxit</p>
                <p className="text-xs text-gray-500">--color-exit</p>
                <p className="text-xs font-mono mt-1">#16A34A</p>
              </div>
            </div>
          </div>

          <h3 className="sosp-h3 mb-4">Escala de Grisos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[{
              name: 'Negre',
              class: 'bg-stone-950',
              hex: '#0C0A09'
            }, {
              name: 'Carbó',
              class: 'bg-stone-900',
              hex: '#1C1917'
            }, {
              name: 'Pissarra',
              class: 'bg-stone-800',
              hex: '#292524'
            }, {
              name: 'Grafit',
              class: 'bg-stone-700',
              hex: '#44403C'
            }, {
              name: 'Pedra fosca',
              class: 'bg-stone-600',
              hex: '#57534E'
            }, {
              name: 'Pedra',
              class: 'bg-stone-500',
              hex: '#78716C'
            }, {
              name: 'Cendra',
              class: 'bg-stone-400',
              hex: '#A8A29E'
            }, {
              name: 'Calç',
              class: 'bg-stone-300',
              hex: '#D6D3D1'
            }, {
              name: 'Arena',
              class: 'bg-stone-200',
              hex: '#E7E5E4'
            }, {
              name: 'Núvol',
              class: 'bg-stone-100',
              hex: '#F5F5F4'
            }, {
              name: 'Blanc trencat',
              class: 'bg-stone-50',
              hex: '#FAFAF9'
            }].map(c => <div key={c.name} className="sosp-card overflow-hidden border border-gray-200">
                <div className={`h-20 ${c.class} rounded-t border-b border-gray-100`} />
                <div className="p-3 bg-white border-t-0 rounded-b">
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{c.hex}</p>
                </div>
              </div>)}
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 2: TIPOGRAFIA                                   */}
        {/* ====================================================== */}
        <section className="mb-16" id="tipografia">
          <h2 className="sosp-h2 mb-6">2. Tipografia (CMS Universal)</h2>

          <div className="sosp-card p-6 mb-6 bg-white">
            <p className="text-sm text-gray-500 mb-4">Aquesta és la maquetació universal de l'ecosistema Sóc de Poble (app-cms-content), definida a <code>index.css</code>.</p>

            <div className='app-cms-content border border-stone-200 p-8 rounded-xl bg-sdp-bg-panel relative overflow-hidden'>
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
              
              <pre><code>// Exemple de codi inline
  const poble = "Petrer";</code></pre>

            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 3: ESPAIAT I GRID                               */}
        {/* ====================================================== */}
        <section className="mb-16" id="espaiat">
          <h2 className="sosp-h2 mb-6">3. Espaiat i Grid</h2>

          <h3 className="sosp-h3 mb-4">Sistema d'Espaiat (8px base)</h3>
          <div className="sosp-card p-6 mb-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24].map(n => <div key={n} className="flex items-center gap-4">
                  <div className="h-4 rounded" style={{
                  backgroundColor: 'var(--md-sys-color-primary)',
                  width: `${n * 4}px`
                }} />
                  <span className="text-sm text-gray-600 font-mono">{n} unitats = {n * 4}px</span>
                </div>)}
            </div>
          </div>

          <h3 className="sosp-h3 mb-4">Grid Responsive</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-stone-200 p-4 rounded text-center text-sm text-stone-600">1 columna (mòbil)</div>
            <div className="bg-stone-200 p-4 rounded text-center text-sm text-stone-600">2 columnes (tauleta)</div>
            <div className="bg-stone-200 p-4 rounded text-center text-sm text-stone-600">3 columnes (escriptori)</div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 4: BOTONS                                       */}
        {/* ====================================================== */}
        <section className="mb-16" id="botons">
          <h2 className="sosp-h2 mb-6">4. Botons</h2>

          <h3 className="sosp-h3 mb-4">Variants</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="sosp-btn sosp-btn-primari">Primari</button>
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
              <div className="sosp-spinner sosp-spinner-sm" style={{
                borderColor: '#fff',
                borderTopColor: 'transparent'
              }}></div>
              Carregant...
            </button>
          </div>

          <h3 className="sosp-h3 mb-4">Amb icona</h3>
          <div className="flex flex-wrap gap-4">
            <button className="sosp-btn sosp-btn-primari">
              ➕ Afegir
            </button>
            <button className="sosp-btn sosp-btn-secundari">
              🗑️ Eliminar
            </button>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 5: FORMULARIS I INPUTS                          */}
        {/* ====================================================== */}
        <section className="mb-16" id="formularis">
          <h2 className="sosp-h2 mb-6">5. Formularis i Inputs</h2>

          <div className="sosp-card p-6 space-y-6 max-w-xl">
            <div>
              <label htmlFor="demo-input" className="sosp-label">Nom del poble</label>
              <input id="demo-input" type="text" className="sosp-input" placeholder="Ex: Petrer" />
                
            </div>

            <div>
              <label htmlFor="demo-select" className="sosp-label">Província</label>
              <select id="demo-select" className="sosp-select" aria-label="Selecció d'exemple">
                <option>Alacant</option>
                <option>València</option>
                <option>Castelló</option>
              </select>
            </div>

            <div>
              <label htmlFor="demo-textarea" className="sosp-label">Descripció</label>
              <textarea id="demo-textarea" className="sosp-textarea" rows={4} placeholder="Escriu una breu descripció..." />
                
            </div>

            <div className="flex items-start gap-2">
              <input id="demo-check" type="checkbox" className="mt-1" />
              <label htmlFor="demo-check" className="text-sm text-stone-700 cursor-pointer">
                Accepte els termes del Consell de la Petorreta
              </label>
            </div>

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

            <div>
              <label className="sosp-label">Input amb error</label>
              <input type="text" className="sosp-input sosp-input-error" defaultValue="valor incorrecte" />
                
              <p className="sosp-text-error mt-1">Aquest camp és obligatori.</p>
            </div>

            <div>
              <label className="sosp-label">Input desactivat</label>
              <input type="text" className="sosp-input" disabled defaultValue="No editable" />
                
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 6: TARGETES (Cards)                             */}
        {/* ====================================================== */}
        <section className="mb-16" id="targetes">
          <h2 className="sosp-h2 mb-6">6. Targetes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Targeta bàsica */}
            <article className="sosp-card">
              <div className="p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-2">Targeta bàsica</h3>
                <p className="text-stone-600">
                  Contenidor amb ombra suau, cantonades arrodonides i vora de 1px.
                  Fons blanc trencat per a màxim contrast en pantalles IPS.
                </p>
              </div>
            </article>

            {/* Targeta amb capçalera */}
            <article className="sosp-card overflow-hidden">
              <div className="p-4" style={{ backgroundColor: 'var(--md-sys-color-primary)' }}>
                <h3 className="text-lg font-bold text-white m-0">Targeta amb capçalera</h3>
              </div>
              <div className="p-6">
                <p className="text-stone-600">
                  La capçalera porta el color de marca. Útil per a destacar seccions importants.
                </p>
              </div>
            </article>

            {/* Targeta amb accions */}
            <article className="sosp-card">
              <div className="p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-2">Targeta amb accions</h3>
                <p className="text-stone-600 mb-4">
                  Peu de targeta amb botons d'acció clarament separats.
                </p>
              </div>
              <div className="p-4 border-t border-stone-200 flex gap-2 justify-end">
                <button className="sosp-btn sosp-btn-fantasma">Cancel·lar</button>
                <button className="sosp-btn sosp-btn-primari">Guardar</button>
              </div>
            </article>

            {/* Targeta d'informació */}
            <article className="sosp-card border-l-4 border-l-[#16A34A]">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#16A34A]">ℹ️</span>
                  <h3 className="text-lg font-bold text-stone-900 m-0">Targeta d'informació</h3>
                </div>
                <p className="text-stone-600">
                  Vora esquerra acolorida per a indicar tipus de contingut.
                  Verd per a èxit/informació, roig per a alertes.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 7: ALERTES I MISSATGES                          */}
        {/* ====================================================== */}
        <section className="mb-16" id="alertes">
          <h2 className="sosp-h2 mb-6">7. Alertes i Missatges</h2>

          <div className="space-y-4 mb-8">
            <div className="sosp-alert sosp-alert-info">
              <span className="sosp-alert-icon">ℹ️</span>
              <div>
                <p className="font-bold m-0">Informació</p>
                <p className="text-sm m-0">Aquesta és una alerta informativa per a destacar dades rellevants.</p>
              </div>
            </div>

            <div className="sosp-alert sosp-alert-success">
              <span className="sosp-alert-icon">✅</span>
              <div>
                <p className="font-bold m-0">Èxit</p>
                <p className="text-sm m-0">L'operació s'ha completat correctament.</p>
              </div>
            </div>

            <div className="sosp-alert sosp-alert-warning">
              <span className="sosp-alert-icon">⚠️</span>
              <div>
                <p className="font-bold m-0">Avís</p>
                <p className="text-sm m-0">Revisa els camps abans de continuar.</p>
              </div>
            </div>

            <div className="sosp-alert sosp-alert-error">
              <span className="sosp-alert-icon">🚨</span>
              <div>
                <p className="font-bold m-0">Error</p>
                <p className="text-sm m-0">No s'ha pogut connectar amb el servidor.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 8: BADGES I ETIQUETES                           */}
        {/* ====================================================== */}
        <section className="mb-16" id="badges">
          <h2 className="sosp-h2 mb-6">8. Badges i Etiquetes</h2>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="sosp-badge sosp-badge-default">Per defecte</span>
            <span className="sosp-badge sosp-badge-primari">Primari</span>
            <span className="sosp-badge sosp-badge-exit">Èxit</span>
            <span className="sosp-badge sosp-badge-avis">Avís</span>
            <span className="sosp-badge sosp-badge-perill">Perill</span>
            <span className="sosp-badge sosp-badge-info">Informació</span>
          </div>

          <h3 className="sosp-h3 mb-4">Etiquetes de poble</h3>
          <div className="flex flex-wrap gap-2">
            <span className="sosp-tag">🏘️ Poble actiu</span>
            <span className="sosp-tag">📸 Fototeca</span>
            <span className="sosp-tag">📜 Arxiu</span>
            <span className="sosp-tag">🗺️ Mapa</span>
            <span className="sosp-tag">🎉 Festes</span>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 9: TAULES                                       */}
        {/* ====================================================== */}
        <section className="mb-16" id="taules">
          <h2 className="sosp-h2 mb-6">9. Taules</h2>

          <div className="overflow-x-auto">
            <table className="sosp-table">
              <thead>
                <tr>
                  <th>Poble</th>
                  <th>Província</th>
                  <th>Habitants</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Petrer</td>
                  <td>Alacant</td>
                  <td>34.000</td>
                  <td><span className="sosp-badge sosp-badge-exit">Actiu</span></td>
                  <td>
                    <button className="sosp-btn sosp-btn-enllac sosp-btn-sm">Editar</button>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Ontinyent</td>
                  <td>València</td>
                  <td>36.000</td>
                  <td><span className="sosp-badge sosp-badge-primari">Pendent</span></td>
                  <td>
                    <button className="sosp-btn sosp-btn-enllac sosp-btn-sm">Editar</button>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium">Morella</td>
                  <td>Castelló</td>
                  <td>2.500</td>
                  <td><span className="sosp-badge sosp-badge-avis">Revisió</span></td>
                  <td>
                    <button className="sosp-btn sosp-btn-enllac sosp-btn-sm">Editar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="sosp-h3 mb-4 mt-8">Taula zebra (alternada)</h3>
          <div className="overflow-x-auto">
            <table className="sosp-table sosp-table-zebra">
              <thead>
                <tr>
                  <th>Recurs</th>
                  <th>Tipus</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Festa de la Mare de Déu</td><td>Esdeveniment</td><td>15/08/2024</td></tr>
                <tr><td>Plaça Major</td><td>Lloc</td><td>—</td></tr>
                <tr><td>Entrevista alcalde</td><td>Notícia</td><td>03/06/2024</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 10: NAVEGACIÓ                                   */}
        {/* ====================================================== */}
        <section className="mb-16" id="navegacio">
          <h2 className="sosp-h2 mb-6">10. Navegació</h2>

          <h3 className="sosp-h3 mb-4">Barra de navegació</h3>
          <nav className="sosp-navbar mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <a href="#logo" className="sosp-nav-logo">Sóc de Poble</a>
                <div className="flex gap-4">
                  <a href="#inici" className="sosp-nav-link sosp-nav-link-active">Inici</a>
                  <a href="#pobles" className="sosp-nav-link">Pobles</a>
                  <a href="#arxiu" className="sosp-nav-link">Arxiu</a>
                </div>
              </div>
            </div>
          </nav>

          <h3 className="sosp-h3 mb-4">Paginació</h3>
          <nav className="sosp-pagination" aria-label="Paginació">
            <button className="sosp-pagination-btn" disabled>← Anterior</button>
            <button className="sosp-pagination-btn sosp-pagination-active">1</button>
            <button className="sosp-pagination-btn">2</button>
            <button className="sosp-pagination-btn">3</button>
            <span className="px-2">...</span>
            <button className="sosp-pagination-btn">12</button>
            <button className="sosp-pagination-btn">Següent →</button>
          </nav>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 11: MODALS I DIALEGS                            */}
        {/* ====================================================== */}
        <section className="mb-16" id="modals">
          <h2 className="sosp-h2 mb-6">11. Modals i Diàlegs</h2>

          <div className="relative h-64 bg-stone-200 rounded p-4 mb-8">
            {/* Simulació de modal */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded overflow-hidden">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-2 mt-0">
                    Confirmar eliminació
                  </h3>
                  <p className="text-stone-600 mb-6 mt-0">
                    Esteu segur que voleu eliminar aquest element? Aquesta acció no es pot desfer.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button className="sosp-btn sosp-btn-fantasma">Cancel·lar</button>
                    <button className="sosp-btn sosp-btn-perill">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 12: INDICADORS DE CÀRREGA                      */}
        {/* ====================================================== */}
        <section className="mb-16" id="carrega">
          <h2 className="sosp-h2 mb-6">12. Indicadors de CÀRREGA</h2>

          <div className="flex flex-wrap gap-8 items-center mb-8">
            <div className="text-center">
              <div className="sosp-spinner sosp-spinner-sm" />
              <p className="text-xs text-gray-500 mt-2">Petit</p>
            </div>
            <div className="text-center">
              <div className="sosp-spinner" />
              <p className="text-xs text-gray-500 mt-2">Normal</p>
            </div>
            <div className="text-center">
              <div className="sosp-spinner sosp-spinner-lg" />
              <p className="text-xs text-gray-500 mt-2">Gran</p>
            </div>
          </div>

          <h3 className="sosp-h3 mb-4">Esquelet (Skeleton)</h3>
          <div className="sosp-card p-6 max-w-sm">
            <div className="sosp-skeleton sosp-skeleton-circle w-12 h-12 mb-4" />
            <div className="sosp-skeleton w-3/4 h-4 mb-2" />
            <div className="sosp-skeleton w-full h-3 mb-2" />
            <div className="sosp-skeleton w-5/6 h-3" />
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 13: AVATARS I IMATGES                           */}
        {/* ====================================================== */}
        <section className="mb-16" id="avatars">
          <h2 className="sosp-h2 mb-6">13. Avatars i Imatges</h2>

          <div className="flex flex-wrap gap-6 items-end mb-8">
            <div className="text-center">
              <div className="sosp-avatar sosp-avatar-xs">AB</div>
              <p className="text-xs text-gray-500 mt-1">xs</p>
            </div>
            <div className="text-center">
              <div className="sosp-avatar sosp-avatar-sm">AB</div>
              <p className="text-xs text-gray-500 mt-1">sm</p>
            </div>
            <div className="text-center">
              <div className="sosp-avatar sosp-avatar-md">AB</div>
              <p className="text-xs text-gray-500 mt-1">md</p>
            </div>
            <div className="text-center">
              <div className="sosp-avatar sosp-avatar-lg">AB</div>
              <p className="text-xs text-gray-500 mt-1">lg</p>
            </div>
            <div className="text-center">
              <div className="sosp-avatar sosp-avatar-xl">AB</div>
              <p className="text-xs text-gray-500 mt-1">xl</p>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 14: DESPLEGABLES (Accordion)                    */}
        {/* ====================================================== */}
        <section className="mb-16" id="accordion">
          <h2 className="sosp-h2 mb-6">14. Desplegables</h2>

          <div className="sosp-card divide-y divide-stone-200">
            <details className="group p-4">
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-stone-800">
                Què és Sóc de Poble?
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-stone-600 text-sm">
                Sóc de Poble és una plataforma dedicada a preservar la memòria digital
                dels pobles valencians, lluitant contra l'obsolescència tecnològica.
              </p>
            </details>
            <details className="group p-4">
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-stone-800">
                Com puc col·laborar?
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-stone-600 text-sm">
                Pots enviar fotografies, documents històrics o simplement compartir
                la teua història personal del poble a través del formulari de contacte.
              </p>
            </details>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 15: PESTANYES (Tabs)                            */}
        {/* ====================================================== */}
        <section className="mb-16" id="tabs">
          <h2 className="sosp-h2 mb-6">15. Pestanyes</h2>

          <div className="sosp-card overflow-hidden">
            <div className="flex border-b border-stone-200 overflow-x-auto">
              <button className="sosp-tab sosp-tab-active">General</button>
              <button className="sosp-tab">Fotografies</button>
              <button className="sosp-tab">Història</button>
              <button className="sosp-tab">Mapa</button>
            </div>
            <div className="p-6">
              <p className="text-stone-600">
                Contingut de la pestanya activa. Aquesta àrea canvia segons la selecció.
                Les pestanyes són accessibles via teclat (Tab + Enter/Espai).
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 16: BARRA DE PROGRÉS                            */}
        {/* ====================================================== */}
        <section className="mb-16" id="progres">
          <h2 className="sosp-h2 mb-6">16. Barra de Progrés</h2>

          <div className="space-y-6 max-w-xl">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-stone-700">Pujada d'imatges</span>
                <span className="text-sm text-stone-500">45%</span>
              </div>
              <div className="sosp-progress-bar">
                <div className="sosp-progress-fill" style={{
                  width: '45%'
                }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-stone-700">Indexació de documents</span>
                <span className="text-sm text-stone-500">78%</span>
              </div>
              <div className="sosp-progress-bar">
                <div className="sosp-progress-fill bg-[#2D5A3D]" style={{
                  width: '78%'
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 17: TOOLTIPS I POPOVERS                         */}
        {/* ====================================================== */}
        <section className="mb-16" id="tooltips">
          <h2 className="sosp-h2 mb-6">17. Tooltips</h2>

          <div className="flex gap-8 items-center h-24">
            <div className="sosp-tooltip-container">
              <button className="sosp-btn sosp-btn-primari">Passa per damunt</button>
              <span className="sosp-tooltip">Aquest és un tooltip informatiu</span>
            </div>
            <div className="sosp-tooltip-container">
              <span className="text-stone-600 border-b border-dotted border-stone-400 cursor-help">
                Terme amb ajuda
              </span>
              <span className="sosp-tooltip">Definició del terme tècnic</span>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 18: LLISTES                                     */}
        {/* ====================================================== */}
        <section className="mb-16" id="llistes">
          <h2 className="sosp-h2 mb-6">18. Llistes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="sosp-h3 mb-4">Llista ordenada</h3>
              <ol className="sosp-list-ordered">
                <li>Registrar-se al portal</li>
                <li>Seleccionar el poble</li>
                <li>Pujar contingut històric</li>
                <li>Revisar i publicar</li>
              </ol>
            </div>
            <div>
              <h3 className="sosp-h3 mb-4">Llista desordenada</h3>
              <ul className="sosp-list-unordered">
                <li>Fotografies antigues</li>
                <li>Documents administratius</li>
                <li>Entrevistes orals</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 19: DIVISORS I SEPARADORS                       */}
        {/* ====================================================== */}
        <section className="mb-16" id="divisors">
          <h2 className="sosp-h2 mb-6">19. Divisors i Separadors</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-2">19.1 Divisor horitzontal bàsic</p>
              <hr className="sosp-divisor" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">19.2 Divisor amb text</p>
              <div className="sosp-divisor-amb-etiqueta">
                <hr />
                o bé
                <hr />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">19.3 Separador de secció (major)</p>
              <hr className="sosp-divisor-seccio" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">19.4 Separador puntejat</p>
              <hr className="sosp-divisor-puntejat" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">19.5 Separador de pàgina (salt visual)</p>
              <div className="sosp-salt-pagina" role="separator" aria-label="Fi de secció"></div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 20: INDICADORS DE PROGRÉS                       */}
        {/* ====================================================== */}
        <section className="mb-16" id="progres">
          <h2 className="sosp-h2 mb-6">20. Indicadors de Progrés</h2>

          <div className="space-y-8 max-w-xl">
            <div>
              <p className="text-sm text-gray-500 mb-2">20.1 Barra de progrés lineal</p>
              <div className="sosp-progres" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
                <div className="sosp-progres-barra" style={{
                  width: '65%'
                }}></div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">20.2 Barra de progrés amb etiqueta</p>
              <div className="sosp-progres sosp-progres-amb-etiqueta">
                <div className="sosp-progres-cap">
                  Carregant mapa de la comarca...
                  65%
                </div>
                <div className="sosp-progres-barra-fons">
                  <div className="sosp-progres-barra" style={{
                    width: '65%'
                  }}></div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">20.3 Barra de progrés en pasos</p>
              <div className="sosp-progres-pasos" aria-label="Progrés del formulari">
                <div className="sosp-pas sosp-pas-completat">
                  <span className="sosp-pas-numero">1</span>
                  <span className="sosp-pas-titol">Dades personals</span>
                </div>
                <div className="sosp-pas-connector sosp-pas-connector-completat"></div>
                <div className="sosp-pas sosp-pas-completat">
                  <span className="sosp-pas-numero">2</span>
                  <span className="sosp-pas-titol">Dades del poble</span>
                </div>
                <div className="sosp-pas-connector"></div>
                <div className="sosp-pas sosp-pas-actiu" aria-current="step">
                  <span className="sosp-pas-numero">3</span>
                  <span className="sosp-pas-titol">Revisió</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">20.4 Spinner de càrrega</p>
              <div className="sosp-spinner" role="status" aria-label="Carregant">
                <div className="sosp-spinner-cercle"></div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">20.5 Skeleton loader</p>
              <div className="sosp-skeleton" aria-hidden="true">
                <div className="sosp-skeleton-linia sosp-skeleton-linia-curta"></div>
                <div className="sosp-skeleton-linia"></div>
                <div className="sosp-skeleton-linia sosp-skeleton-linia-mitja"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 21: GALERIES I GRIDS D'IMATGES                  */}
        {/* ====================================================== */}
        <section className="mb-16" id="galeries">
          <h2 className="sosp-h2 mb-6">21. Galeries i Grids d'Imatges</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">21.1 Grid d'imatges bàsic</p>
              <div className="sosp-galeria">
                <figure className="sosp-galeria-item">
                  <img src="/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png" alt="Plaça Major" className="bg-stone-200 aspect-video object-cover w-full rounded-md" />
                  <figcaption>Plaça Major, estiu de 2024</figcaption>
                </figure>
                <figure className="sosp-galeria-item">
                  <img src="/assets/uploads/brain/media__1775376768839.jpg" alt="Ajuntament" className="bg-stone-200 aspect-video object-cover w-full rounded-md" />
                  <figcaption>Ajuntament vist des del carrer Nou</figcaption>
                </figure>
                <figure className="sosp-galeria-item">
                  <img src="/assets/uploads/brain/media__1775516493101.jpg" alt="Ermita" className="bg-stone-200 aspect-video object-cover w-full rounded-md" />
                  <figcaption>Ermita de Sant Cristòfol al capvespre</figcaption>
                </figure>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">21.2 Grid amb mida variable (masonry-like)</p>
              <div className="sosp-galeria sosp-galeria-masonry">
                <figure className="sosp-galeria-item sosp-galeria-item-gran">
                  <img src="/assets/uploads/brain/aplec_danses_1774952191348.png" alt="Festa Major" className="bg-stone-200 aspect-square object-cover w-full rounded-md" />
                  <figcaption>Festa Major 2024</figcaption>
                </figure>
                <figure className="sosp-galeria-item">
                  <img src="/assets/uploads/brain/art_trellat_v2_1774708257858.png" alt="Carrer típic" className="bg-stone-200 aspect-video object-cover w-full rounded-md" />
                  <figcaption>Carrer de les Escoles</figcaption>
                </figure>
                <figure className="sosp-galeria-item sosp-galeria-item-alt">
                  <img src="/assets/uploads/brain/nano_pedra_seca_1777089570387.png" alt="Campanar" className="bg-stone-200 h-48 object-cover w-full rounded-md" />
                  <figcaption>Campanar des de la plaça</figcaption>
                </figure>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">21.3 Carrousel d'imatges (accessible)</p>
              <div className="sosp-carrousel" role="region" aria-label="Galeria d'imatges del poble">
                <div className="sosp-carrousel-visualitzador">
                  <figure className="sosp-carrousel-diapositiva sosp-carrousel-diapositiva-actiu">
                    <img src="/assets/uploads/brain/hero_panoramic_rural_view_1774720664221.png" alt="Vista panoràmica" className="bg-stone-200 aspect-video object-cover w-full rounded-md" />
                    <figcaption>Vista panoràmica des del castellet</figcaption>
                  </figure>
                </div>
                <div className="sosp-carrousel-controls">
                  <button type="button" className="sosp-boto sosp-boto-icona" aria-label="Imatge anterior">←</button>
                  <div className="sosp-carrousel-indicadors">
                    <button type="button" className="sosp-carrousel-punt sosp-carrousel-punt-actiu" aria-label="Diapositiva 1 de 3" aria-current="true"></button>
                    <button type="button" className="sosp-carrousel-punt" aria-label="Diapositiva 2 de 3"></button>
                    <button type="button" className="sosp-carrousel-punt" aria-label="Diapositiva 3 de 3"></button>
                  </div>
                  <button type="button" className="sosp-boto sosp-boto-icona" aria-label="Imatge següent">→</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 22: LLISTES DE DEFINICIÓ I GLOSSARIS            */}
        {/* ====================================================== */}
        <section className="mb-16" id="glossaris">
          <h2 className="sosp-h2 mb-6">22. Llistes de Definició i Glossaris</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">22.1 Glossari de termes locals</p>
              <dl className="sosp-glossari bg-stone-50 border border-stone-200 rounded-lg p-6">
                <div className="sosp-glossari-entrada mb-4 pb-4 border-b border-stone-200 last:border-0 last:mb-0 last:pb-0">
                  <dt className="font-bold text-stone-900 text-lg mb-1">Almàssera</dt>
                  <dd className="text-stone-700">Lloc on es premsa l'oliva per a obtindre oli. Tradicionalment construït amb pedra i sòl de rajola.</dd>
                </div>
                <div className="sosp-glossari-entrada mb-4 pb-4 border-b border-stone-200 last:border-0 last:mb-0 last:pb-0">
                  <dt className="font-bold text-stone-900 text-lg mb-1">Riu-rau</dt>
                  <dd className="text-stone-700">Sistema de séquia tradicional que porta l'aigua des del riu fins als horts mitjançant canals de terra.</dd>
                </div>
                <div className="sosp-glossari-entrada mb-4 pb-4 border-b border-stone-200 last:border-0 last:mb-0 last:pb-0">
                  <dt className="font-bold text-stone-900 text-lg mb-1">Tina</dt>
                  <dd className="text-stone-700">Recipient de fusta, generalment de roure, utilitzat per a trepitjar el raïm i fermentar el most.</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">22.2 Llista de definició horitzontal</p>
              <dl className="sosp-definicio-horizontal grid grid-cols-2 gap-x-4 gap-y-2 bg-stone-50 border border-stone-200 rounded-lg p-6 max-w-sm">
                <dt className="font-bold text-stone-600">Fundació:</dt>
                <dd className="text-stone-900 text-right">1248</dd>
                <dt className="font-bold text-stone-600">Superfície:</dt>
                <dd className="text-stone-900 text-right">33,4 km²</dd>
                <dt className="font-bold text-stone-600">Altitud:</dt>
                <dd className="text-stone-900 text-right">120 msnm</dd>
                <dt className="font-bold text-stone-600">Població:</dt>
                <dd className="text-stone-900 text-right">5.847 hab.</dd>
              </dl>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 23: LÍNIES DE TEMPS (TIMELINES)                 */}
        {/* ====================================================== */}
        <section className="mb-16" id="timelines">
          <h2 className="sosp-h2 mb-6">23. Línies de Temps (Timelines)</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">23.1 Timeline vertical</p>
              <ol className="sosp-timeline relative border-l-2 border-stone-200 ml-3 pl-6 py-2 space-y-8" aria-label="Línia de temps històrica">
                <li className="sosp-timeline-esdeveniment relative">
                  <div className="absolute w-3 h-3 bg-stone-300 rounded-full -left-[31px] top-1.5 border-2 border-white"></div>
                  <time className="sosp-timeline-data text-sm font-bold text-orange-600 mb-1 block" dateTime="1248">1248</time>
                  <div className="sosp-timeline-contingut">
                    <h4 className="font-bold text-stone-900 text-lg">Carta Pobla</h4>
                    <p className="text-stone-600 mt-1">El rei Jaume I concedeix la carta de poblament al lloc de Benigànim.</p>
                  </div>
                </li>
                <li className="sosp-timeline-esdeveniment relative">
                  <div className="absolute w-3 h-3 bg-stone-300 rounded-full -left-[31px] top-1.5 border-2 border-white"></div>
                  <time className="sosp-timeline-data text-sm font-bold text-orange-600 mb-1 block" dateTime="1609">1609</time>
                  <div className="sosp-timeline-contingut">
                    <h4 className="font-bold text-stone-900 text-lg">Expulsió dels moriscos</h4>
                    <p className="text-stone-600 mt-1">La població musulmana és expulsada, deixant un buit demogràfic que s'ompli amb cristians vells.</p>
                  </div>
                </li>
                <li className="sosp-timeline-esdeveniment sosp-timeline-esdeveniment-actiu relative">
                  <div className="absolute w-4 h-4 bg-orange-500 rounded-full -left-[33px] top-1 border-4 border-orange-100"></div>
                  <time className="sosp-timeline-data text-sm font-bold text-orange-600 mb-1 block" dateTime="2024">2024</time>
                  <div className="sosp-timeline-contingut">
                    <h4 className="font-bold text-stone-900 text-lg">Digitalització completa</h4>
                    <p className="text-stone-600 mt-1">El poble entra a <em>Sóc de Poble</em> amb tots els documents històrics digitalitzats.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 24: TARGETES (CARDS)                            */}
        {/* ====================================================== */}
        <section className="mb-16" id="targetes">
          <h2 className="sosp-h2 mb-6">24. Targetes (Cards)</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">24.1 Targeta bàsica</p>
              <article className="sosp-targeta max-w-sm bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <header className="sosp-targeta-cap p-5 pb-0">
                  <h3 className="sosp-targeta-titol font-bold text-xl text-stone-900">Festes Patronals</h3>
                </header>
                <div className="sosp-targeta-cos p-5 text-stone-600">
                  <p>Del 15 al 24 d'agost celebrem les festes en honor a Sant Agustí. Concerts, processons i el tradicional sopar de la paella gegant.</p>
                </div>
                <footer className="sosp-targeta-peu p-5 pt-0">
                  <a href="#festes" className="sosp-enllaç sosp-enllaç-fletxa text-orange-600 font-bold hover:underline">Veure programa complet →</a>
                </footer>
              </article>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">24.2 Targeta amb imatge</p>
              <article className="sosp-targeta sosp-targeta-amb-imatge max-w-sm bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <figure className="sosp-targeta-imatge bg-stone-200 aspect-video flex items-center justify-center text-stone-400">
                  [Imatge: Mercat setmanal]
                </figure>
                <div className="sosp-targeta-cos p-5">
                  <h3 className="sosp-targeta-titol font-bold text-xl text-stone-900 mb-1">Mercat Setmanal</h3>
                  <p className="sosp-targeta-meta text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">Tots els dimecres · Plaça Major · 08:00 a 13:00</p>
                  <p className="text-stone-600">Productes de la terra, artesania local i el millor trato de la comarca.</p>
                </div>
              </article>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">24.3 Targeta d'acció (clickable)</p>
              <a href="#associacio" className="sosp-targeta sosp-targeta-accio block max-w-sm bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="sosp-targeta-cos p-6 flex justify-between items-center">
                  <div>
                    <h3 className="sosp-targeta-titol font-bold text-xl text-stone-900 mb-1">Associació de Veïns</h3>
                    <p className="text-stone-600">Forma part de la comunitat. Junts fem poble.</p>
                  </div>
                  <span className="sosp-targeta-fletxa text-orange-400 group-hover:text-orange-600 transition-colors text-2xl ml-4">→</span>
                </div>
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">24.4 Grid de targetes</p>
              <div className="sosp-targetes-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                <article className="sosp-targeta bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">Targeta 1</h3>
                  <p className="text-stone-600 text-sm">Contingut de la targeta dins d'un grid.</p>
                </article>
                <article className="sosp-targeta bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">Targeta 2</h3>
                  <p className="text-stone-600 text-sm">Contingut de la targeta dins d'un grid.</p>
                </article>
                <article className="sosp-targeta bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">Targeta 3</h3>
                  <p className="text-stone-600 text-sm">Contingut de la targeta dins d'un grid.</p>
                </article>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md">
                <p className="text-sm text-gray-500 mb-4 text-center">24.5 Targeta Mestra Completa (Visor de Contingut "El Mas")</p>
                
                <UniversalCard variant="mercat" viewMode="grid" item={{
                  id: 'samarreta-soc-de-poble-1',
                  uuid: 'samarreta-soc-de-poble-1',
                  type: 'product',
                  author_name: 'Sóc de Poble',
                  town_name: 'La Torre de les Maçanes',
                  title: 'Samarreta Sóc de Poble',
                  description: 'L\'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly de màxima qualitat.',
                  price: '15.00€',
                  images: ['/assets/uploads/brain/group_tshirt.png'],
                  avatar_url: '/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png',
                  tags: ['#Sostenible'],
                  created_at: '2026-03-22T23:33:00Z',
                  info_text: 'Mapa del tresor'
                }} />
                  

              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md">
                <p className="text-sm text-gray-500 mb-4 text-center">24.6 Targeta Mestra Completa (Amb Vídeo)</p>
                
                <UniversalCard variant="post" viewMode="grid" item={{
                  id: 'post-video-socdepoble-1',
                  uuid: 'post-video-socdepoble-1',
                  type: 'page',
                  author_name: 'Sóc de Poble',
                  town_name: 'La Torre de les Maçanes',
                  title: 'Sóc de Poble: Portal de pobles connectats',
                  description: 'Sóc del Poble serà un PORTAL DE POBLES CONNECTATS on compartir informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals.',
                  images: null,
                  video_url: 'https://www.youtube.com/embed/Fadaa7Kyxm0?si=rJasphnQZdCy3zve',
                  avatar_url: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
                  tags: ['#Sostenible', '#Tecnologia', '#MónRural'],
                  created_at: new Date().toISOString(),
                  info_text: '📌'
                }} />
                  

              </div>
            </div>

          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 25: ESTADÍSTIQUES I DASHBOARDS                  */}
        {/* ====================================================== */}
        <section className="mb-16" id="estadistiques">
          <h2 className="sosp-h2 mb-6">25. Estadístiques i Dashboards</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">25.1 Targeta d'estadística</p>
              <div className="sosp-estadistica flex items-center bg-white border border-stone-200 rounded-xl p-4 shadow-sm max-w-xs">
                <div className="sosp-estadistica-icona text-3xl mr-4" aria-hidden="true">👥</div>
                <div className="sosp-estadistica-dades flex flex-col">
                  <span className="sosp-estadistica-valor font-black text-2xl text-stone-900 leading-none">5.847</span>
                  <span className="sosp-estadistica-etiqueta text-sm text-stone-500 font-medium">Habitants</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">25.2 Grid d'estadístiques</p>
              <div className="sosp-dashboard-grid grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sosp-estadistica flex items-center bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="sosp-estadistica-icona text-2xl mr-3">📅</div>
                  <div className="sosp-estadistica-dades flex flex-col">
                    <span className="sosp-estadistica-valor font-black text-xl text-stone-900 leading-none">776</span>
                    <span className="sosp-estadistica-etiqueta text-xs text-stone-500 font-medium">Anys d'història</span>
                  </div>
                </div>
                <div className="sosp-estadistica flex items-center bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="sosp-estadistica-icona text-2xl mr-3">🏠</div>
                  <div className="sosp-estadistica-dades flex flex-col">
                    <span className="sosp-estadistica-valor font-black text-xl text-stone-900 leading-none">2.341</span>
                    <span className="sosp-estadistica-etiqueta text-xs text-stone-500 font-medium">Habitatges</span>
                  </div>
                </div>
                <div className="sosp-estadistica flex items-center bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="sosp-estadistica-icona text-2xl mr-3">🌳</div>
                  <div className="sosp-estadistica-dades flex flex-col">
                    <span className="sosp-estadistica-valor font-black text-xl text-stone-900 leading-none">33,4</span>
                    <span className="sosp-estadistica-etiqueta text-xs text-stone-500 font-medium">Km² de natura</span>
                  </div>
                </div>
                <div className="sosp-estadistica flex items-center bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="sosp-estadistica-icona text-2xl mr-3">📖</div>
                  <div className="sosp-estadistica-dades flex flex-col">
                    <span className="sosp-estadistica-valor font-black text-xl text-stone-900 leading-none">142</span>
                    <span className="sosp-estadistica-etiqueta text-xs text-stone-500 font-medium">Documents històrics</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">25.3 Panell d'Umami (integració directa)</p>
              <section className="sosp-panell-umami bg-stone-50 border border-stone-200 rounded-xl p-6" aria-label="Estadístiques web">
                <h2 className="sosp-panell-umami-titol font-bold text-lg text-stone-900 mb-4">📊 Activitat del portal</h2>
                <div className="sosp-dashboard-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="sosp-estadistica bg-white border border-stone-200 rounded-lg p-3 shadow-sm text-center">
                    <div className="sosp-estadistica-dades flex flex-col">
                      <span className="sosp-estadistica-valor font-black text-xl text-stone-900" id="umami-visitors">--</span>
                      <span className="sosp-estadistica-etiqueta text-xs text-stone-500">Visitants únics</span>
                    </div>
                  </div>
                  <div className="sosp-estadistica bg-white border border-stone-200 rounded-lg p-3 shadow-sm text-center">
                    <div className="sosp-estadistica-dades flex flex-col">
                      <span className="sosp-estadistica-valor font-black text-xl text-stone-900" id="umami-pageviews">--</span>
                      <span className="sosp-estadistica-etiqueta text-xs text-stone-500">Pàgines vistes</span>
                    </div>
                  </div>
                  <div className="sosp-estadistica bg-white border border-stone-200 rounded-lg p-3 shadow-sm text-center">
                    <div className="sosp-estadistica-dades flex flex-col">
                      <span className="sosp-estadistica-valor font-black text-xl text-stone-900" id="umami-bounce">--</span>
                      <span className="sosp-estadistica-etiqueta text-xs text-stone-500">Taxa de rebuig</span>
                    </div>
                  </div>
                  <div className="sosp-estadistica bg-white border border-stone-200 rounded-lg p-3 shadow-sm text-center">
                    <div className="sosp-estadistica-dades flex flex-col">
                      <span className="sosp-estadistica-valor font-black text-xl text-stone-900" id="umami-duration">--</span>
                      <span className="sosp-estadistica-etiqueta text-xs text-stone-500">Duració mitjana</span>
                    </div>
                  </div>
                </div>
                <p className="sosp-panell-umami-font text-xs text-stone-500 text-center">Dades d'<a href="https://umami.is" className="text-orange-600 hover:underline">Umami Analytics</a> · Actualització en temps real</p>
              </section>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 26: CERCA I FILTRATGE                           */}
        {/* ====================================================== */}
        <section className="mb-16" id="cerca">
          <h2 className="sosp-h2 mb-6">26. Cerca i Filtratge</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">26.1 Barra de cerca bàsica</p>
              <form className="sosp-cerca flex max-w-md" role="search" action="/cerca" method="get">
                <label htmlFor="cerca-input" className="sr-only">Cerca al portal</label>
                <input type="search" id="cerca-input" name="q" className="sosp-input sosp-input-cerca flex-1 rounded-l-md border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Cerca pobles, festes, documents..." aria-label="Cerca al portal" />
                  
                <button type="submit" className="sosp-boto sosp-boto-primari sosp-boto-cerca bg-stone-900 text-white px-4 py-2 rounded-r-md font-bold hover:bg-stone-800 transition-colors">
                  🔍 Cerca
                </button>
              </form>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">26.2 Cerca amb filtres</p>
              <div className="sosp-cerca-avancada bg-stone-50 p-4 border border-stone-200 rounded-lg max-w-2xl">
                <form className="sosp-cerca flex flex-wrap sm:flex-nowrap gap-3" role="search">
                  <input type="search" className="sosp-input sosp-input-cerca flex-1 rounded-md border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none min-w-[200px]" placeholder="Cerca..." />
                  <select className="sosp-select sosp-select-cerca rounded-md border border-stone-300 px-4 py-2 bg-white focus:ring-2 focus:ring-orange-500 outline-none" aria-label="Filtrar per categoria">
                    <option value="">Totes les categories</option>
                    <option value="pobles">Pobles</option>
                    <option value="festes">Festes</option>
                    <option value="historia">Història</option>
                    <option value="gastronomia">Gastronomia</option>
                  </select>
                  <button type="submit" className="sosp-boto sosp-boto-primari bg-stone-900 text-white px-6 py-2 rounded-md font-bold hover:bg-stone-800 transition-colors whitespace-nowrap">Cerca</button>
                </form>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">26.3 Resultats de cerca</p>
              <section className="sosp-resultats-cerca max-w-2xl" aria-label="Resultats de la cerca">
                <p className="sosp-resultats-info text-sm text-stone-600 mb-6 pb-4 border-b border-stone-200">S'han trobat <strong className="text-stone-900">12 resultats</strong> per a <em className="not-italic bg-stone-100 px-1 rounded">"festa major"</em></p>
                
                <div className="space-y-6">
                  <article className="sosp-resultat">
                    <h3 className="sosp-resultat-titol font-bold text-lg text-orange-600 hover:underline mb-1"><a href="#beniganim">Festa Major de Benigànim</a></h3>
                    <p className="sosp-resultat-meta text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Festes · Benigànim · Agost 2024</p>
                    <p className="sosp-resultat-resum text-stone-600 text-sm">Del 15 al 24 d'agost celebrem les festes patronals amb més de 50 activitats per a tots els públics...</p>
                  </article>
                  
                  <article className="sosp-resultat">
                    <h3 className="sosp-resultat-titol font-bold text-lg text-orange-600 hover:underline mb-1"><a href="#llutxent">Festa Major de Llutxent</a></h3>
                    <p className="sosp-resultat-meta text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Festes · Llutxent · Setembre 2024</p>
                    <p className="sosp-resultat-resum text-stone-600 text-sm">La festa major de Llutxent destaca per la seua processó de les festes de la Mare de Déu...</p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 27: PAGINACIÓ                                   */}
        {/* ====================================================== */}
        <section className="mb-16" id="paginacio">
          <h2 className="sosp-h2 mb-6">27. Paginació</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">27.1 Paginació numèrica</p>
              <nav className="sosp-paginacio flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Paginació de resultats">
                <a href="#pag" className="sosp-paginacio-enllac sosp-paginacio-primer px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded bg-white hover:bg-stone-50 transition-colors">← Primera</a>
                <a href="#pag" className="sosp-paginacio-enllac px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded bg-white hover:bg-stone-50 transition-colors">2</a>
                <a href="#pag" className="sosp-paginacio-enllac sosp-paginacio-actiu px-3 py-1.5 text-sm font-bold text-white bg-stone-900 border border-stone-900 rounded" aria-current="page">3</a>
                <a href="#pag" className="sosp-paginacio-enllac px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded bg-white hover:bg-stone-50 transition-colors">4</a>
                <a href="#pag" className="sosp-paginacio-enllac px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded bg-white hover:bg-stone-50 transition-colors">5</a>
                <span className="sosp-paginacio-separador px-2 py-1.5 text-stone-400">...</span>
                <a href="#pag" className="sosp-paginacio-enllac px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded bg-white hover:bg-stone-50 transition-colors">24</a>
                <a href="#pag" className="sosp-paginacio-enllac sosp-paginacio-seguent px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded bg-white hover:bg-stone-50 transition-colors">Següent →</a>
              </nav>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">27.2 Paginació simplificada (anterior / següent)</p>
              <nav className="sosp-paginacio-simple grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl" aria-label="Navegació entre articles">
                <a href="#anterior" className="sosp-paginacio-simple-enllac sosp-paginacio-simple-anterior border border-stone-200 rounded-lg p-4 bg-white hover:border-stone-300 hover:shadow-sm transition-all group flex flex-col text-left">
                  <span className="sosp-paginacio-simple-direccio text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 group-hover:text-stone-600 transition-colors">← Article anterior</span>
                  <span className="sosp-paginacio-simple-titol font-bold text-stone-900 group-hover:text-orange-600 transition-colors">Les festes de la Magdalena</span>
                </a>
                <a href="#seguent" className="sosp-paginacio-simple-enllac sosp-paginacio-simple-seguent border border-stone-200 rounded-lg p-4 bg-white hover:border-stone-300 hover:shadow-sm transition-all group flex flex-col text-right">
                  <span className="sosp-paginacio-simple-direccio text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 group-hover:text-stone-600 transition-colors">Article següent →</span>
                  <span className="sosp-paginacio-simple-titol font-bold text-stone-900 group-hover:text-orange-600 transition-colors">La ruta del riu-rau</span>
                </a>
              </nav>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 28: LLISTES DE TASQUES I CHECKLISTS             */}
        {/* ====================================================== */}
        <section className="mb-16" id="tasques">
          <h2 className="sosp-h2 mb-6">28. Llistes de Tasques i Checklists</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">28.1 Checklist d'administració</p>
              <fieldset className="sosp-checklist border border-stone-200 rounded-lg p-5 bg-stone-50 max-w-md">
                <legend className="sosp-checklist-titol text-sm font-bold text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm ml-2">✅ Verificació prèvia a publicar</legend>
                
                <div className="space-y-3 mt-2">
                  <label className="sosp-checklist-item flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="sosp-checkbox mt-1 w-5 h-5 text-orange-600 border-stone-300 rounded focus:ring-orange-500" defaultChecked />
                    <span className="sosp-checklist-text text-stone-700 group-hover:text-stone-900 transition-colors line-through opacity-70">Revisar ortografia i valencià</span>
                  </label>
                  
                  <label className="sosp-checklist-item flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="sosp-checkbox mt-1 w-5 h-5 text-orange-600 border-stone-300 rounded focus:ring-orange-500" defaultChecked />
                    <span className="sosp-checklist-text text-stone-700 group-hover:text-stone-900 transition-colors line-through opacity-70">Comprovar imatges (alt text obligatori)</span>
                  </label>
                  
                  <label className="sosp-checklist-item flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="sosp-checkbox mt-1 w-5 h-5 text-orange-600 border-stone-300 rounded focus:ring-orange-500" />
                    <span className="sosp-checklist-text text-stone-900 font-medium">Validar enllaços interns</span>
                  </label>
                  
                  <label className="sosp-checklist-item flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="sosp-checkbox mt-1 w-5 h-5 text-orange-600 border-stone-300 rounded focus:ring-orange-500" />
                    <span className="sosp-checklist-text text-stone-900 font-medium">Revisar contrast de colors (WCAG 2.1 AA)</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">28.2 Llista de tasques amb progrés</p>
              <div className="sosp-llista-tasques border border-stone-200 rounded-lg overflow-hidden max-w-md bg-white">
                <div className="sosp-tasca sosp-tasca-completada flex items-center gap-4 p-4 border-b border-stone-100 bg-stone-50">
                  <input type="checkbox" className="sosp-checkbox w-5 h-5 text-green-600 border-stone-300 rounded focus:ring-green-500" defaultChecked aria-label="Tasca completada" />
                  <span className="sosp-tasca-text flex-1 text-stone-500 line-through">Migrar base de dades històrica</span>
                  <time className="sosp-tasca-data text-xs font-mono text-stone-400 bg-stone-200 px-2 py-1 rounded" dateTime="2024-01-15">15/01</time>
                </div>
                <div className="sosp-tasca flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors">
                  <input type="checkbox" className="sosp-checkbox w-5 h-5 text-orange-600 border-stone-300 rounded focus:ring-orange-500" aria-label="Tasca pendent" />
                  <span className="sosp-tasca-text flex-1 text-stone-900 font-medium">Digitalitzar fotografies del fons municipal</span>
                  <time className="sosp-tasca-data text-xs font-mono text-orange-600 bg-orange-100 px-2 py-1 rounded font-bold" dateTime="2024-02-01">01/02</time>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 29: UPLOAD I DESCÀRREGUES                       */}
        {/* ====================================================== */}
        <section className="mb-16" id="upload">
          <h2 className="sosp-h2 mb-6">29. Upload i Descàrregues</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">29.1 Zona d'arrossegament d'arxius</p>
              <div className="sosp-upload max-w-md" role="region" aria-label="Puja d'arxius">
                <div className="sosp-upload-zona border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                  <p className="sosp-upload-text-principal font-bold text-stone-900 mb-2">📎 Arrossega els arxius ací</p>
                  <p className="sosp-upload-text-secundari text-stone-600 mb-2">o <button type="button" className="sosp-enllac text-orange-600 hover:underline">selecciona'ls del teu dispositiu</button></p>
                  <p className="sosp-upload-text-ajuda text-xs text-stone-400">Màxim 10MB per arxiu. Formats: JPG, PNG, PDF</p>
                </div>
                
                <ul className="sosp-upload-llista mt-4 space-y-2">
                  <li className="sosp-upload-item flex items-center justify-between bg-white border border-stone-200 p-3 rounded-lg shadow-sm">
                    <div className="flex flex-col">
                      <span className="sosp-upload-nom font-medium text-sm text-stone-900 truncate max-w-[200px]">festa_major_2024.jpg</span>
                      <span className="sosp-upload-mida text-xs text-stone-500">2,4 MB</span>
                    </div>
                    <button type="button" className="sosp-boto sosp-boto-perill sosp-boto-xicotet text-red-600 hover:bg-red-50 p-2 rounded" aria-label="Eliminar festa_major_2024.jpg">
                      🗑️
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">29.2 Enllaç de descàrrega</p>
              <a href="#descarrega" className="sosp-descarrega inline-flex items-center gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow max-w-md group" download>
                <span className="sosp-descarrega-icona text-2xl">📄</span>
                <span className="sosp-descarrega-info flex flex-col flex-1">
                  <span className="sosp-descarrega-nom font-bold text-stone-900 group-hover:text-orange-600 transition-colors">Carta Pobla de Benigànim (1248)</span>
                  <span className="sosp-descarrega-meta text-xs text-stone-500 mt-1">PDF · 3,2 MB · Transcripció paleogràfica</span>
                </span>
                <span className="sosp-descarrega-fletxa text-stone-400 group-hover:text-orange-600 transition-colors">⬇️</span>
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 30: EMBEDDINGS I MEDIA EXTERNA                  */}
        {/* ====================================================== */}
        <section className="mb-16" id="media">
          <h2 className="sosp-h2 mb-6">30. Embeddings i Media Externa</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">30.1 Vídeo embebint (HTML5 natiu)</p>
              <figure className="sosp-video max-w-2xl bg-stone-50 border border-stone-200 rounded-xl overflow-hidden p-2">
                <iframe className="w-full aspect-video rounded-lg mb-3" src="https://www.youtube.com/embed/Fadaa7Kyxm0?si=rJasphnQZdCy3zve" title="Sóc de Poble Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                  </iframe>
                <figcaption className="text-sm text-stone-500 text-center font-medium mb-3">Sóc de Poble: Portal de pobles connectats (2013)</figcaption>
                
                <details className="bg-white border border-stone-200 rounded-lg text-left overflow-hidden group">
                  <summary className="p-3 font-semibold cursor-pointer text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors list-none flex justify-between items-center">
                    📄 Descripció del vídeo original
                    <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 border-t border-stone-200 text-stone-600 text-sm whitespace-pre-wrap bg-white">
  {`Un Projecte per col·laborar en el desenvolupament sostenible i tecnològic en entorns rurals.

  Sóc del Poble serà un PORTAL DE POBLES CONNECTATS on compartir informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals, que són l'essència de la nostra identitat, i mostrar l'atractiu dels pobles com a llocs on viure i treballar.

  Serà un canal orientat a la difusió dels beneficis que les Noves Tecnologies poden aportar al món rural, utilitzant ferramentes col·laboratives:

  1. BASE DE DADES OBERTES. MAPA DIRECTORI DE RECURSOS LOCALS.
  2. CERCADOR TEMÀTIC.
  3. XARXA SOCIAL DE PRODUCTIVITAT.
  4. REVISTA DIGITAL.
  5. VIVERS TIC DE POBLE. Vivers Virtuals d'Emprenedors Rurals.

  ---------------------------
  GUIÓ DEL VÍDEO
  ---------------------------
  Pepet toca el clarinet...
  Viu tranquil i be en un poble menut
  A l'escola de música del seu poblet aprèn... I ho fa be, si...
  Vol aprendre més, però ha d'anar a la ciutat... I puja i baixa i va i torna...
  I fa música i vol que tothom escolte el so del seu clarinet...
  Però és tot tan difícil al seu poblet!!!
  Com faré? Es pregunta Pepet.

  A l'altra banda de les muntanyes viu la Rosa...
  Gent que té idees i vol fer-les realitat en llocs amb qualitat de vida, amb respecte per les arrels, la natura, la gent...
  Sóc de poble... i tinc veu...
  I tu?, et sumes?`}
                  </div>
                </details>
              </figure>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">30.2 Mapa embebint (iframe amb fallback)</p>
              <figure className="sosp-mapa max-w-2xl bg-stone-50 border border-stone-200 rounded-xl overflow-hidden p-2">
                <div className="h-64 bg-stone-200 rounded-lg flex items-center justify-center text-stone-500 mb-3">
                  [OpenStreetMap Iframe]
                </div>
                <figcaption className="text-sm text-center font-medium">
                  <a href="#mapa" className="text-orange-600 hover:underline">
                    Veure mapa més gran a OpenStreetMap →
                  </a>
                </figcaption>
              </figure>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">30.3 Audio (podcast local)</p>
              <figure className="sosp-audio max-w-md bg-stone-50 border border-stone-200 rounded-xl overflow-hidden p-4">
                <div className="flex items-center gap-4 mb-2">
                  <button className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl hover:bg-orange-700 transition-colors">▶️</button>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-1/3"></div>
                  </div>
                  <span className="text-xs font-mono text-stone-500">12:45</span>
                </div>
                <figcaption className="text-sm text-stone-600 font-medium text-center">Podcast «Històries de poble» · Episodi 1</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 31: CLASSES UTILITÀRIES                         */}
        {/* ====================================================== */}
        <section className="mb-16" id="utilitats">
          <h2 className="sosp-h2 mb-6">31. Classes Utilitàries</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">Aquestes classes són recomanacions d'arquitectura css (no aplicades ací via Tailwind pur sinó com a concepte)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">Classes de visibilitat</h4>
                  <ul className="space-y-2 font-mono text-sm">
                    <li><span className="text-orange-600">.sosp-sr-only</span> - Ocult visiblement, text per a screen readers</li>
                    <li><span className="text-orange-600">.sosp-visible-sr-only</span> - Visible només per assistència</li>
                    <li><span className="text-orange-600">.sosp-ocult</span> - display: none</li>
                    <li><span className="text-orange-600">.sosp-ocult-mobil</span> - Amaga en xs/sm</li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">Classes de color</h4>
                  <ul className="space-y-2 text-sm font-medium">
                    <li><span className="text-green-600">.sosp-text-exit</span> - ✓ Èxit</li>
                    <li><span className="text-red-600">.sosp-text-error</span> - ✗ Error</li>
                    <li><span className="text-yellow-600">.sosp-text-avís</span> - ⚠ Avís</li>
                    <li><span className="text-blue-600">.sosp-text-info</span> - ℹ Informació</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 32: PEUS DE PÀGINA (FOOTERS)                    */}
        {/* ====================================================== */}
        <section className="mb-16" id="footers">
          <h2 className="sosp-h2 mb-6">32. Peus de Pàgina (Footers)</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">32.1 Peu de pàgina complet</p>
              <footer className="sosp-peu bg-stone-900 text-stone-400 p-8 rounded-xl border border-stone-800" role="contentinfo">
                <div className="sosp-peu-contingut grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
                  <div className="sosp-peu-seccio">
                    <h4 className="sosp-peu-titol font-bold text-white mb-4">Sóc de Poble</h4>
                    <p className="text-sm leading-relaxed">Patrimoni digital dels nostres pobles des de 1998. Construït amb pedra seca i codi net.</p>
                  </div>
                  
                  <div className="sosp-peu-seccio">
                    <h4 className="sosp-peu-titol font-bold text-white mb-4">Navega</h4>
                    <ul className="sosp-peu-llista space-y-2 text-sm">
                      <li><a href="#pobles" className="hover:text-white transition-colors">Pobles</a></li>
                      <li><a href="#festes" className="hover:text-white transition-colors">Festes</a></li>
                      <li><a href="#historia" className="hover:text-white transition-colors">Història</a></li>
                      <li><a href="#gastronomia" className="hover:text-white transition-colors">Gastronomia</a></li>
                    </ul>
                  </div>
                  
                  <div className="sosp-peu-seccio">
                    <h4 className="sosp-peu-titol font-bold text-white mb-4">Legal</h4>
                    <ul className="sosp-peu-llista space-y-2 text-sm">
                      <li><a href="#privacitat" className="hover:text-white transition-colors">Privacitat</a></li>
                      <li><a href="#cookies" className="hover:text-white transition-colors">Cookies</a></li>
                      <li><a href="#accessibilitat" className="hover:text-white transition-colors">Accessibilitat</a></li>
                    </ul>
                  </div>
                  
                  <div className="sosp-peu-seccio">
                    <h4 className="sosp-peu-titol font-bold text-white mb-4">Contacte</h4>
                    <address className="sosp-peu-adreca text-sm space-y-2 not-italic">
                      <p>📧 <a href="mailto:hola@socdepoble.org" className="hover:text-white transition-colors">hola@socdepoble.org</a></p>
                      <p>🐘 <a href="#mastodon" className="hover:text-white transition-colors">@socdepoble@social</a></p>
                    </address>
                  </div>
                </div>
                
                <div className="sosp-peu-fons text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p>© 2024 Sóc de Poble · <span className="sosp-peu-versio font-mono">v2.4.0</span> · Fet amb ❤️ i pedra seca</p>
                  <p className="sosp-peu-codi-etic">
                    <a href="#lock" className="hover:text-white transition-colors">🔒 Protocol SOSP-LOCK actiu</a> · 
                    <a href="#disseny" className="hover:text-white transition-colors">Sistema de Disseny</a>
                  </p>
                </div>
              </footer>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">32.2 Peu de pàgina minimalista</p>
              <footer className="sosp-peu sosp-peu-minimal bg-stone-100 p-6 rounded-xl border border-stone-200 text-center text-sm text-stone-500">
                <p>© 2024 Sóc de Poble · <a href="#privacitat" className="hover:text-stone-900 underline transition-colors">Privacitat</a> · <a href="#lock" className="hover:text-stone-900 underline transition-colors">🔒 SOSP-LOCK</a></p>
              </footer>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 33: EXEMPLES DE COMPOSICIÓ                      */}
        {/* ====================================================== */}
        <section className="mb-16" id="composicio">
          <h2 className="sosp-h2 mb-6">33. Exemples de Composició</h2>

          <div className="space-y-12">
            <div>
              <p className="text-sm text-gray-500 mb-4">33.1 Pàgina de poble completa (estructura)</p>
              <article className="sosp-pagina-poble border-2 border-stone-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <header className="sosp-capcalera-poble bg-stone-50 p-8 border-b border-stone-200">
                  <nav className="sosp-migues-pa text-xs font-bold text-stone-400 uppercase tracking-widest mb-4" aria-label="Migues de pa">
                    <ol className="flex items-center gap-2">
                      <li><a href="#inici" className="hover:text-stone-600 transition-colors">Inici</a></li>
                      <li>/</li>
                      <li><a href="#comarca" className="hover:text-stone-600 transition-colors">Vall d'Albaida</a></li>
                      <li>/</li>
                      <li aria-current="page" className="text-stone-900">Benigànim</li>
                    </ol>
                  </nav>
                  <h1 className="text-4xl font-black text-stone-900 mb-2">Benigànim</h1>
                  <p className="sosp-poble-subtitol text-xl text-stone-600">El poble de les rieres i l'oli d'oliva verge extra</p>
                </header>
                
                <div className="sosp-poble-grid grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                  <div className="sosp-poble-principal md:col-span-2 space-y-8" role="region" aria-label="Contingut principal del poble">
                    <section className="sosp-poble-seccio">
                      <h2 className="text-2xl font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">Història</h2>
                      <p className="text-stone-600 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </section>
                    <section className="sosp-poble-seccio">
                      <h2 className="text-2xl font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">Festes i tradicions</h2>
                      <p className="text-stone-600 leading-relaxed">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </section>
                  </div>
                  
                  <aside className="sosp-poble-lateral">
                    <div className="sosp-targeta sosp-targeta-info bg-stone-50 border border-stone-200 p-6 rounded-xl">
                      <h3 className="font-bold text-lg mb-4 text-stone-900">Dades del municipi</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-stone-200 pb-1">
                          <dt className="text-stone-500 font-medium">Comarca:</dt><dd className="text-stone-900 font-bold">Vall d'Albaida</dd>
                        </div>
                        <div className="flex justify-between border-b border-stone-200 pb-1">
                          <dt className="text-stone-500 font-medium">Província:</dt><dd className="text-stone-900 font-bold">València</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-stone-500 font-medium">Habitants:</dt><dd className="text-stone-900 font-bold">5.847</dd>
                        </div>
                      </dl>
                    </div>
                  </aside>
                </div>
              </article>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">33.2 Formulari de contacte complet</p>
              <section className="sosp-seccio bg-white border-2 border-stone-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
                <h2 className="text-2xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-200">Contacta amb nosaltres</h2>
                <form className="sosp-formulari space-y-6">
                  <fieldset className="sosp-fieldset bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <legend className="sosp-legend text-sm font-bold text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm ml-2">Les teues dades</legend>
                    
                    <div className="space-y-4 mt-2">
                      <div className="sosp-form-grup">
                        <label className="block text-sm font-bold text-stone-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full rounded-md border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" required />
                      </div>
                      
                      <div className="sosp-form-grup">
                        <label className="block text-sm font-bold text-stone-700 mb-1">Correu electrònic <span className="text-red-500">*</span></label>
                        <input type="email" className="w-full rounded-md border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" required />
                      </div>
                      
                      <div className="sosp-form-grup">
                        <label className="block text-sm font-bold text-stone-700 mb-1">Motiu del contacte</label>
                        <select className="w-full rounded-md border border-stone-300 px-4 py-2 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" aria-label="Motiu del contacte">
                          <option value="">Selecciona un motiu</option>
                          <option value="suggeriment">Suggeriment</option>
                          <option value="error">Reportar un error</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>
                  
                  <fieldset className="sosp-fieldset bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <legend className="sosp-legend text-sm font-bold text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm ml-2">El teu missatge</legend>
                    <div className="sosp-form-grup mt-2">
                      <label className="block text-sm font-bold text-stone-700 mb-1">Missatge <span className="text-red-500">*</span></label>
                      <textarea className="w-full rounded-md border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" rows="4" required></textarea>
                    </div>
                  </fieldset>
                  
                  <div className="sosp-form-accions flex items-center gap-4 pt-4 border-t border-stone-200">
                    <button type="button" className="bg-stone-900 text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-stone-800 transition-colors">Enviar missatge</button>
                    <button type="button" className="text-stone-500 font-bold hover:text-stone-900 transition-colors">Esborrar</button>
                  </div>
                </form>
              </section>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-4">33.3 Sistema d'alerta global (banner)</p>
              <div className="sosp-alerta-global bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-4 text-yellow-800 shadow-sm" role="region" aria-label="Alerta d'exemple">
                <span className="text-2xl mt-0.5">⚠️</span>
                <p className="flex-1 text-sm font-medium">Estem realitzant manteniment programat el dia 15 de juny de 02:00 a 06:00. Alguns serveis podrien no estar disponibles.</p>
                <button type="button" className="text-yellow-600 hover:text-yellow-900" aria-label="Tancar alerta">✕</button>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 34: VARIABLES CSS FONAMENTALS                   */}
        {/* ====================================================== */}
        <section className="mb-16" id="variables">
          <h2 className="sosp-h2 mb-6">34. Variables CSS Fonamentals</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">34.1 Variables CSS fonamentals (a incloure al :root)</p>
              <div className="bg-stone-900 rounded-xl overflow-hidden p-6 text-stone-300 font-mono text-sm shadow-inner max-w-3xl overflow-x-auto">
                <pre><code>{`:root {
    /* Paleta de colors Pedra Seca */
    --sosp-pedra-100: #faf9f7;
    --sosp-pedra-200: #f0ede8;
    --sosp-pedra-300: #d4cfc5;
    --sosp-pedra-400: #a8a195;
    --sosp-pedra-500: #7a756b;
    --sosp-pedra-600: #4a4640;
    --sosp-pedra-700: #2d2b27;
    --sosp-pedra-800: #1a1917;
    --sosp-pedra-900: #0d0d0c;
    
    /* Colors d'acció */
    --sosp-terra: #8B4513;
    --sosp-oliva: #6B8E23;
    --sosp-cel: #4A90A4;
    --sosp-alerta: #C75B39;
    --sosp-or: #D4A017;
    
    /* Tipografia */
    --sosp-font-principal: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --sosp-font-display: Georgia, 'Times New Roman', serif;
    --sosp-mida-base: 1.125rem; /* 18px per a lectura còmoda */
    --sosp-interlineat: 1.6;
    
    /* Espaiat */
    --sosp-espai-xicotet: 0.5rem;
    --sosp-espai-mitja: 1rem;
    --sosp-espai-gran: 2rem;
    --sosp-espai-enorme: 4rem;
    
    /* Radi de cantonada */
    --sosp-radi: 0.25rem;
    
    /* Ombres (mínimes) */
    --sosp-ombra: 0 1px 3px rgba(0,0,0,0.08);
  }

  /* Reset mínim Pedra Seca */
  *, *::before, *::after { box-sizing: border-box; }
  html { font-size: var(--sosp-mida-base); line-height: var(--sosp-interlineat); }
  body { margin: 0; font-family: var(--sosp-font-principal); color: var(--sosp-pedra-700); background: var(--sosp-pedra-100); }
  img { max-width: 100%; height: auto; display: block; }
  a { color: var(--sosp-cel); text-underline-offset: 0.2em; }
  a:hover { color: var(--sosp-terra); }
  button { font-family: inherit; font-size: inherit; cursor: pointer; }

  /* Screen reader only */
  .sosp-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECCIÓ 35: DOCUMENTACIÓ I CONVENCIONS                  */}
        {/* ====================================================== */}
        <section className="mb-16" id="convencions">
          <h2 className="sosp-h2 mb-6">35. Documentació i Convencions</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-4">35.1 Documentació interna (no visible, per a desenvolupadors)</p>
              <div className="bg-stone-100 border border-stone-300 rounded-xl p-6 font-mono text-sm text-stone-700 max-w-3xl overflow-x-auto shadow-sm">
                <pre><code>{`CONVENCIÓ DE NOMENCLATURA SOSP:

  Prefix: sosp- (Sóc de Poble System)

  Categories:
  - sosp-boto-*      : Botons i accions
  - sosp-input-*     : Camps de formulari
  - sosp-etiqueta-*  : Etiquetes i legends
  - sosp-alerta-*    : Missatges d'estat
  - sosp-targeta-*   : Targetes d'informació
  - sosp-taula-*     : Taules de dades
  - sosp-navegacio-* : Menús i navegació
  - sosp-peu-*       : Footer
  - sosp-text-*      : Utilitats de text
  - sosp-marge-*     : Espaiat
  - sosp-ocult-*     : Visibilitat responsive

  NOU COMPONENT? Segueix la pauta:
  1. Prefix sosp-
  2. Categoria semàntica
  3. Modificador d'estat (--actiu, --inactiu, --perill)
  4. NEVER inventar noms fora d'esta llista sense aprovar al Consell.`}</code></pre>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-4">35.2 Avís de protecció SOSP-LOCK</p>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-3xl shadow-sm text-center">
                <h3 className="font-black text-red-800 text-xl mb-4 tracking-widest uppercase border-b border-red-200 pb-4">
                  SOSP DESIGN SYSTEM — VERSIÓ AUDITADA 1.4.0
                </h3>
                <div className="space-y-2 text-red-900 font-medium mb-6 text-sm">
                  <p>Estat: <strong className="font-bold">TANCAT I BLOQUEJAT (SOSP-LOCK ACTIU)</strong></p>
                  <p>Última revisió: 2024-06-08</p>
                  <p>Revisors: Consell de la Petorreta</p>
                  <p>Protocol: SOSP-LOCK-001</p>
                </div>
                
                <div className="bg-white border border-red-200 p-6 rounded-lg text-left inline-block">
                  <h4 className="font-bold text-red-700 mb-3 text-lg">⚠️ AVÍS DE PROTECCIÓ ⚠️</h4>
                  <p className="text-stone-700 text-sm mb-3">Este document està protegit pel Protocol SOSP-LOCK. Qualsevol modificació requereix:</p>
                  <ol className="list-decimal list-inside text-stone-700 text-sm font-medium space-y-1 mb-4">
                    <li>Clau de Permís Actiu del Consell</li>
                    <li>Justificació tècnica de 3 línies mínim</li>
                    <li>Aprovació per majoria simple</li>
                  </ol>
                  <p className="font-bold text-red-700 text-sm uppercase tracking-wide border-t border-red-100 pt-3">
                    NO MODIFICAR SENSE AUTORITZACIÓ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ====================================================== */}
        {/* SECCIÓ 36: ELEMENTS ESTRUCTURALS (PER A SUB-AGENTS)      */}
        {/* ====================================================== */}
        <section className="mb-16" id="elements-estructurals">
          <h2 className="sosp-h2 mb-6">36. Elements Estructurals (Refactor Obert)</h2>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
            <p className="text-sm text-stone-600 mb-4">Aquestes són les directrius i prompts preparats per a ser executats per les IAs (les petorretetes) durant la fase de componentització estructural de Sóc de Poble.</p>
            
            <div className="space-y-6">
              <details className="bg-white border border-stone-200 rounded-lg p-4 group">
                <summary className="font-bold text-stone-900 cursor-pointer list-none flex justify-between items-center">
                  1. Orange Bar (Capçalera Contextual)
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-stone-100 text-sm text-stone-700 font-mono whitespace-pre-wrap">
  {`PROMPT PER A LA IA:
  Necessitem unificar l'Orange Bar. Actualment tenim "ContextualHeader.jsx" i l'estil inline dins de "ChatList.jsx" i "Map.jsx".
  El component final ha de dir-se "OrangeBar.jsx" i ha de tindre:
  - Fons: bg-[#F97316] (mode clar) / dark:bg-[#4F46E5] (mode fosc)
  - Altura: exactament h-[56px] min-h-[56px]
  - Ombra INQUEBRANTABLE: shadow-md (Molt important, l'ombra ha d'estar sempre).
  - Input de cerca integrat amb borderRadius de 28px.
  Fes-lo amb variants (Map Mode, Chat Mode) però sempre mantenint aquestes directrius estructurals.`}
                </div>
              </details>

              <details className="bg-white border border-stone-200 rounded-lg p-4 group">
                <summary className="font-bold text-stone-900 cursor-pointer list-none flex justify-between items-center">
                  2. Sidebar & Navigation (La Roca)
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-stone-100 text-sm text-stone-700 font-mono whitespace-pre-wrap">
  {`PROMPT PER A LA IA:
  Auditar i componentitzar la barra lateral negra on resideix el logo principal i el menú (ex. AppLayout.jsx).
  - Fons absolut negre o extremadament fosc.
  - Ha de respectar l'amplada i no causar reflows quan el teclat apareix en un iPad.
  - El botó gegant blau de "+ CONNECTAR" ha de tindre el focus perfecte i contrast AAA.
  - Extraure la lògica a un "SystemSidebar.jsx" altament resistent.`}
                </div>
              </details>

              <details className="bg-white border border-stone-200 rounded-lg p-4 group">
                <summary className="font-bold text-stone-900 cursor-pointer list-none flex justify-between items-center">
                  3. Estructura Completa de 3 Panells
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-stone-100 text-sm text-stone-700 font-mono whitespace-pre-wrap">
  {`PROMPT PER A LA IA:
  Garantir que el layout base del lloc es manté monolític (Sistema de 3 Columnes):
  1. Menú principal (Sidebar estret).
  2. Llista contextual (Xats / Llocs).
  3. Panell de Detall / Visor.
  Assegurar l'overflow ocult en el cos global per previndre "Rubber-banding" en Safari/iOS, i delegar els scrolls (overflow-y-auto) únicament dins dels contenidors flexibles.`}
                </div>
              </details>

              <details className="bg-white border border-stone-200 rounded-lg p-4 group">
                <summary className="font-bold text-stone-900 cursor-pointer list-none flex justify-between items-center">
                  4. La Targeta Mestra (Visor de Contingut)
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-stone-100 text-sm text-stone-700 font-mono whitespace-pre-wrap">
  {`PROMPT PER A LA IA:
  La "Card" principal (el visor de detalls) és la peça més complexa. L'objectiu no és redissenyar-la, sinó EXTREURE els components existents respectant les següents NORMES ESTRICTES de disseny que ja tenim:

  1. Contenidor Base: Ha de tindre un arrodoniment fort (rounded-[28px]). Ni més ni menys.
  2. CardHeader (Taronja): Fons taronja (var(--md-sys-color-primary)) però atenció: el TEXT ÉS NEGRE (nom de l'autor i lloc). El botó del "pin" i la píndola de la data tenen fons taronja fosc, i la píndola de data és arrodonida (rounded-full).
  3. CardCarousel: Ratio quadrat exacte (aspect-square), la imatge l'ocupa completament (object-cover). Amb fletxes translúcides i punts inferiors.
  4. CardContent:
     - Títol: Gran, negre, alineat a l'esquerra. NO MAJÚSCULES forçades (es respecta el case original).
     - Preu: Taronja (#C75B39), a la dreta del títol.
     - Subtítol blau ("Sóc de Poble"): Alineat a l'esquerra, mai centrat.
     - Paràgraf descriptiu: Text gran i llegidor (text-lg o text-xl).
     - "LLEGIR MÉS": Centrat, en majúscules.
  5. CardActionBar (Blava): Fixa a baix (#3b49df) amb eines a l'esquerra i el gran botó de "+ CONNECTAR" a la dreta.

  La teua missió és componentitzar-ho de forma monolítica i inquebrantable sense alterar aquestes normes estètiques.`}
                </div>
              </details>
            </div>
          </div>
        </section>
        </div>
      </UniversalPage>
  );
}import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Languages, Info } from 'lucide-react';
import SystemPageLayout from '../../components/layout/SystemPageLayout';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useDesign } from '../../app/context/DesignContext';
const Translations = () => {
  const navigate = useNavigate();
  const {
    hapticService
  } = useDesign();
  const handleBack = () => {
    if (hapticService) hapticService.trigger();
    navigate(-1);
  };
  const header = <div className='relative z-10 bg-sdp-theme-accent-primary w-full h-[56px] min-h-[56px] max-h-[56px] flex items-center px-3 shadow-md'>
            <button onClick={handleBack} aria-label="Torna enrere" className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/20 active:scale-95">
                <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-white font-bold text-lg tracking-wide m-0">Idioma i Traduccions</h1>
        </div>;
  return (
      <SystemPageLayout header={header}>
                <div className="max-w-3xl mx-auto space-y-6">
                    
                    {/* INTERFACE LANGUAGE SECTION */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-gray-50/50 dark:bg-black/20">
                            <div className='w-12 h-12 rounded-full bg-sdp-theme-accent-primary/10 flex items-center justify-center text-sdp-theme-accent-primary shrink-0'>
                                <Globe size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">Idioma del Sistema</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 m-0">Aquest ajust canvia l'idioma de tots els menús, botons i interfícies de l'aplicació.</p>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 bg-theme-base">
                            {/* We use the profile variant of LanguageSelector since it's meant to be embedded in a page/modal */}
                            <LanguageSelector variant="profile" />
                        </div>
                    </div>

                    {/* CARDS TRANSLATION INFO SECTION */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <Languages size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">Traducció Dinàmica de Targetes</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 m-0">Com funciona la traducció del contingut creat pels usuaris.</p>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 bg-theme-base space-y-4">
                            <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">
                                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="m-0 font-medium text-gray-900 dark:text-white mb-1">
                                        Motor de Traducció Integrat
                                    </p>
                                    <p className="m-0">
                                        Les Targetes (Mur, Xats, Mercat i Esdeveniments) tenen un sistema de traducció automàtic basat en <strong className="text-gray-900 dark:text-white">Google Translator</strong>. 
                                        Això permet que tot el contingut creat per altres usuaris es puga traduir a l'instant al teu idioma de preferència.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Com utilitzar-ho</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 m-0">
                                    <li>Busca la icona de traducció dins de les publicacions del Mur o Xats.</li>
                                    <li>Fes clic sobre el botó per traduir aquell missatge o publicació específica.</li>
                                    <li>Les traduccions automàtiques poden contindre xicotets errors d'interpretació en expressions locals.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </SystemPageLayout>
  );
};
export default Translations;import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Users, MapPin, Building, Link2, Loader2, Search, ChevronRight } from 'lucide-react';
import { supabaseService } from '../../core/services/supabaseService';
import { geminiService } from '../../core/services/geminiService';
import { raindropService } from '../../core/services/raindropService';
import { MOCK_EVENTS } from '../../data';
import { hapticService } from '../../core/services/hapticService';
import { logger } from '../../utils/logger';
import SEO from '../../components/core/SEO';
import Avatar from '../../components/ui/Avatar';
import SearchNavBar from '../../components/patterns/SearchNavBar';
import './CercaPage.css';
const HighlightText = ({
  text,
  highlight
}) => {
  if (!highlight || !text) return <>{text}</>;
  const safeText = String(text);
  const safeHighlight = String(highlight).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = safeText.split(new RegExp(`(${safeHighlight})`, 'gi'));
  return (
    <span>
              {parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className='bg-sdp-theme-accent-primary text-white dark:bg-yellow-500 dark:text-black font-bold px-0.5 rounded-sm'>{part}</span> : <span key={i}>{part}</span>)}
          </span>
  );
};
export default function CercaPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Suport natiu per inicialitzar la cerca via URL (?q=...&scope=...)
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialScope = queryParams.get('scope') || 'tots';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(initialScope);
  const [results, setResults] = useState({
    gent: [],
    entitats: [],
    pobles: [],
    arxiu: [],
    esdeveniments: []
  });
  const [searchInsights, setSearchInsights] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Només mostrem suggeriments si l'usuari no ha buscat res.
  const popularSearches = ['Cocentaina', 'Vicent Ferris', 'Mercat de Muro', 'IAIA'];
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch(query.trim());
      } else {
        setResults({
          gent: [],
          entitats: [],
          pobles: [],
          arxiu: [],
          esdeveniments: []
        });
        setSearchInsights(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Actualitza els paràmetres de la URL silenciósament
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    let changed = false;
    if (query.trim()) {
      currentParams.set('q', query);
      changed = true;
    } else {
      if (currentParams.has('q')) {
        currentParams.delete('q');
        changed = true;
      }
    }
    if (activeFilter !== 'tots') {
      currentParams.set('scope', activeFilter);
      changed = true;
    } else {
      if (currentParams.has('scope')) {
        currentParams.delete('scope');
        changed = true;
      }
    }
    if (changed) {
      navigate({
        search: currentParams.toString()
      }, {
        replace: true
      });
    }
  }, [query, activeFilter, navigate, location.search]);
  const performSearch = async q => {
    setIsSearching(true);
    setSearchInsights(null);
    try {
      const [gent, entitats, pobles, archive, filteredEvents, insights] = await Promise.all([supabaseService.searchProfiles(q), supabaseService.searchEntities(q), supabaseService.searchAllTowns(q), raindropService.getCollection('all'), Promise.resolve(MOCK_EVENTS.filter(e => (e.title?.toLowerCase() || '').includes(q.toLowerCase()) || (e.description?.toLowerCase() || '').includes(q.toLowerCase()) || (e.location?.toLowerCase() || '').includes(q.toLowerCase()))), q.length > 3 ? geminiService.ask('RATO', `Resum breu i amb trellat sobre "${q}" en el context rural valencià, donant-li color local.`) : null]);
      const filteredArchive = (archive || []).filter(item => (item.title?.toLowerCase() || '').includes(q.toLowerCase()) || item.excerpt && (item.excerpt?.toLowerCase() || '').includes(q.toLowerCase()));
      setResults({
        gent: gent || [],
        entitats: entitats || [],
        pobles: pobles || [],
        arxiu: filteredArchive || [],
        esdeveniments: filteredEvents || []
      });
      if (insights && !insights.error) {
        setSearchInsights(insights.text);
      }
    } catch (error) {
      logger.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  const clearSearch = () => {
    setQuery('');
    setResults({
      gent: [],
      entitats: [],
      pobles: [],
      arxiu: [],
      esdeveniments: []
    });
    setSearchInsights(null);
    hapticService.notifySuccess();
    if (inputRef.current) inputRef.current.focus();
  };
  const filters = [{
    id: 'tots',
    label: 'Tots',
    icon: <Sparkles size={14} />
  }, {
    id: 'gent',
    label: 'Gent',
    icon: <Users size={14} />
  }, {
    id: 'pobles',
    label: 'Pobles',
    icon: <MapPin size={14} />
  }, {
    id: 'esdeveniments',
    label: 'Esdeveniments',
    icon: <Sparkles size={14} />
  }, {
    id: 'entitats',
    label: 'Entitats',
    icon: <Building size={14} />
  }, {
    id: 'arxiu',
    label: 'Arxiu',
    icon: <Link2 size={14} />
  }];
  const isEmpty = !query && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && results.arxiu.length === 0 && results.esdeveniments.length === 0;
  const hasNoResults = query.length > 1 && !isSearching && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && results.arxiu.length === 0 && results.esdeveniments.length === 0;
  return (
    <div className="search-discover-page min-h-screen bg-theme-bg flex flex-col">
              <SEO title={query ? `Cerca: ${query}` : 'Cerca Universal'} description="Explora tot l'ecosistema de Sóc de Poble: persones, entitats, pobles, esdeveniments i arxiu documental." keywords="cerca, buscador, pobles, persones, arxiu, iaia" />
              
              <SearchNavBar query={query} setQuery={setQuery} placeholder="Busca al sistema..." onClear={clearSearch} customIcon={<Search className='text-sdp-theme-accent-primary' size={20} />} inputRef={inputRef} />

              <div className='filter-chips-container w-full overflow-x-auto no-scrollbar border-b border-sdp-theme-border bg-theme-bg sticky top-[60px] z-20 shadow-sm'>
                  <div className="flex px-4 py-3 gap-2 min-w-full justify-start sm:justify-center w-max mx-auto">
                      {filters.map((filter, index) => <React.Fragment key={filter.id}>
                              <button onClick={() => {
              hapticService.bategat();
              setActiveFilter(filter.id);
            }} className={`flex items-center gap-2 rounded-full font-bold transition-all shadow-sm ${filter.id === 'tots' ? 'text-base px-6 py-2' : 'text-sm px-4 py-1.5 self-center'} ${activeFilter === filter.id ? 'bg-[var(--theme-accent-primary)] text-white' : 'bg-theme-panel text-theme-text hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                  {filter.icon}
                                  {filter.label}
                              </button>
                              {index === 0 && <div className='w-[2px] h-6 bg-sdp-theme-border mx-1 self-center opacity-50 shrink-0' />}
                          </React.Fragment>)}
                  </div>
              </div>

              <div className="search-content pt-4 flex-1 w-full max-w-4xl mx-auto px-4 pb-20">
                  {isSearching ? <div className="search-loading flex flex-col items-center justify-center p-12 text-theme-muted">
                          <Loader2 className="animate-spin mb-4" size={32} />
                          <p>Analitzant l'ecosistema...</p>
                      </div> : <>
                          {/* IAIA INTENT ROUTER */}
                          {query && <div className="intent-router-suggestion animate-in fade-in slide-in-from-top-4 mb-4">
                                  {query.toLowerCase().includes('gana') || query.toLowerCase().includes('dinar') || query.toLowerCase().includes('recepta') ? <div className="universal-card bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-200 dark:border-orange-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/tools/recipe')}>
                                          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                              <Sparkles size={24} className="text-orange-600 dark:text-orange-400" />
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-orange-900 dark:text-orange-100">Vols una recepta?</h4>
                                              <p className="text-sm text-orange-800 dark:text-orange-300">La IAIA té fam i vol anar al rebost.</p>
                                          </div>
                                          <ChevronRight className="text-orange-500" />
                                      </div> : query.toLowerCase().includes('foto') || query.toLowerCase().includes('mira') || query.toLowerCase().includes('ull') ? <div className="universal-card bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/ia')}>
                                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                              <Sparkles size={24} className="text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-blue-900 dark:text-blue-100">Puc veure-ho?</h4>
                                              <p className="text-sm text-blue-800 dark:text-blue-300">Obre l'Ull del Mestre (Visió Artificial).</p>
                                          </div>
                                          <ChevronRight className="text-blue-500" />
                                      </div> : query.toLowerCase().includes('paraula') || query.toLowerCase().includes('què vol dir') ? <div className="universal-card bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/tools/diccionari')}>
                                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                              <Sparkles size={24} className="text-emerald-600 dark:text-emerald-400" />
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Busques una definició?</h4>
                                              <p className="text-sm text-emerald-800 dark:text-emerald-300">Consulta el Diccionari Rural de la IAIA.</p>
                                          </div>
                                          <ChevronRight className="text-emerald-500" />
                                      </div> : null}
                              </div>}

                          {/* SEMANTIC INSIGHTS (SUPER RATOLÍ) */}
                          {searchInsights && <div className='semantic-insight-card bg-theme-panel rounded-[32px] p-5 shadow-sm border border-sdp-theme-border mb-6 animate-in fade-in slide-in-from-bottom-4'>
                                  <div className="flex items-center gap-3 mb-3">
                                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                                          <img src="/uploads/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png" alt="Súper Ratolí" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                          <h4 className="font-black text-theme-text text-sm uppercase tracking-wide">Context de l'IAIA</h4>
                                          <div className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">Insight Actiu</div>
                                      </div>
                                  </div>
                                  <p className="text-[15px] leading-relaxed text-theme-text italic font-medium">"{searchInsights}"</p>
                              </div>}

                          {/* RESULTATS DE LA CERCA */}
                          {!isEmpty ? <div className="search-results-container flex flex-col gap-6">
                                  {filters.filter(f => f.id !== 'tots').map(filter => {
              if (activeFilter !== 'tots' && activeFilter !== filter.id) return null;
              let sectionResults = [];
              let RenderItem = null;
              switch (filter.id) {
                case 'gent':
                  sectionResults = results.gent;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-card rounded-[24px] p-3 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => navigate(`/gent/${item.id}`)}>
                                                      <Avatar src={item.avatar_url} role="user" name={item.full_name} size={48} />
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-theme-text truncate"><HighlightText text={item.full_name} highlight={query} /></span>
                                                          <span className="text-sm text-theme-muted font-medium truncate"><HighlightText text={item.role || 'Foraster'} highlight={query} /> {item.primary_town ? <span>• <HighlightText text={item.primary_town} highlight={query} /></span> : ''}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'pobles':
                  sectionResults = results.pobles;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-card rounded-[24px] p-3 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => navigate(`/pobles/${item.id}`)}>
                                                      <Avatar src={item.image_url} role="oficial" name={item.name} size={48} />
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-theme-text truncate"><HighlightText text={item.name} highlight={query} /></span>
                                                          <span className="text-sm text-theme-muted font-medium truncate"><HighlightText text={item.comarca} highlight={query} /> {item.province ? <span>• <HighlightText text={item.province} highlight={query} /></span> : ''}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'esdeveniments':
                  sectionResults = results.esdeveniments;
                  RenderItem = ({
                    item
                  }) => <div className='bg-sdp-color-terracotta text-white rounded-[24px] p-4 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md hover:brightness-110' onClick={() => navigate('/pobles', {
                    state: {
                      initialTab: 'esdeveniments'
                    }
                  })}>
                                                      <div className="w-[48px] h-[48px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                          <Sparkles size={24} className="text-white" />
                                                      </div>
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-white truncate"><HighlightText text={item.title} highlight={query} /></span>
                                                          <span className="text-sm text-white/80 font-medium truncate"><HighlightText text={item.location} highlight={query} /> • {new Date(item.date).toLocaleDateString('ca-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'entitats':
                  sectionResults = results.entitats;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-card rounded-[24px] p-3 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => navigate(`/empresa/${item.id}`)}>
                                                      <Avatar src={item.avatar_url} role={item.type} name={item.name} size={48} />
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-theme-text truncate"><HighlightText text={item.name} highlight={query} /></span>
                                                          <span className="text-sm text-theme-muted font-medium truncate capitalize">{item.type} {item.town_name ? `• ${item.town_name}` : ''}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'arxiu':
                  sectionResults = results.arxiu;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-panel rounded-[24px] p-4 flex items-start gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => window.open(item.link, '_blank')}>
                                                      <div className='w-12 h-12 rounded-full bg-sdp-color-orange-vibrant/10 text-sdp-color-orange-vibrant flex items-center justify-center shrink-0'>
                                                          <Link2 size={24} />
                                                      </div>
                                                      <div className="flex flex-col flex-1 min-w-0 pt-1">
                                                          <span className="text-base font-bold text-theme-text line-clamp-2 leading-tight mb-1"><HighlightText text={item.title} highlight={query} /></span>
                                                          <span className="text-[13px] text-theme-muted font-medium line-clamp-2"><HighlightText text={item.excerpt || 'Document de l\'arxiu'} highlight={query} /></span>
                                                      </div>
                                                  </div>;
                  break;
                default:
                  return null;
              }
              if (sectionResults.length === 0) return null;
              return <section key={filter.id} className="animate-in fade-in slide-in-from-bottom-4">
                                              <div className="flex items-center justify-between mb-3 px-2">
                                                  <h3 className="font-black text-lg text-theme-text flex items-center gap-2">
                                                      {filter.icon}
                                                      {filter.label}
                                                  </h3>
                                                  <span className="bg-theme-surface text-theme-muted text-xs font-bold px-2.5 py-1 rounded-full">{sectionResults.length}</span>
                                              </div>
                                              <div className="flex flex-col gap-2">
                                                  {sectionResults.map(item => <RenderItem key={item.id || item.uuid || item._id} item={item} />)}
                                              </div>
                                          </section>;
            })}
                              </div> : hasNoResults && <div className='flex flex-col items-center justify-center text-center p-12 bg-theme-panel rounded-[32px] border border-sdp-theme-border mt-8 animate-in fade-in'>
                                  <Search size={48} className="text-theme-muted opacity-50 mb-4" />
                                  <h3 className="text-xl font-bold text-theme-text mb-2">Sense resultats</h3>
                                  <p className="text-theme-muted">No hem trobat res per a "<strong className="text-theme-text">{query}</strong>" a la secció {filters.find(f => f.id === activeFilter)?.label.toLowerCase()}.</p>
                                  {activeFilter !== 'tots' && <button onClick={() => setActiveFilter('tots')} className='mt-6 px-6 py-2 bg-sdp-theme-accent-primary text-white rounded-full font-bold shadow-md hover:bg-orange-600 transition-colors'>
                                          Buscar a tot arreu
                                      </button>}
                              </div>}
                      </>}

                  {/* EMPTY STATE - RECOMANACIONS */}
                  {isEmpty && <div className="empty-state-suggestions mt-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="mb-8">
                              <h4 className="text-sm font-black text-theme-muted uppercase tracking-wider mb-4 px-2">Cerques Populars</h4>
                              <div className="flex flex-wrap gap-2">
                                  {popularSearches.map(s => <button key={s} className='flex items-center gap-2 px-4 py-2 rounded-full bg-theme-panel border border-sdp-theme-border text-sm font-medium text-theme-text hover:bg-sdp-theme-surface hover:scale-105 transition-all shadow-sm' onClick={() => setQuery(s)}>
                                          <Search size={14} className="text-theme-muted" />
                                          {s}
                                      </button>)}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button onClick={() => navigate('/agents')} className="universal-card text-left p-6 flex flex-col items-center sm:flex-row sm:items-start gap-5 hover:shadow-lg transition-all group overflow-hidden relative">
                                  <div className='absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-sdp-theme-text/5 to-transparent skew-x-12'></div>
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0 relative shadow-md group-hover:scale-105 transition-transform duration-500 overflow-hidden bg-theme-surface">
                                      <img src="/uploads/avatars/iaia_comic_matriarch.png" alt="IAIA" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h3 className='font-black text-xl sm:text-2xl text-theme-text mb-2 group-hover:text-sdp-theme-accent-primary transition-colors'>
                                          L'Equip Sintètic
                                      </h3>
                                      <p className="text-theme-muted text-sm leading-relaxed">Entra a descobrir com l'IAIA i els seus agents ens ajuden en el dia a dia de Sóc de Poble.</p>
                                  </div>
                              </button>

                              <button onClick={() => navigate('/iaies-mundials')} className="universal-card text-left p-6 flex flex-col items-center sm:flex-row sm:items-start gap-5 hover:shadow-lg transition-all group overflow-hidden relative">
                                  <div className='absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-sdp-theme-text/5 to-transparent skew-x-12'></div>
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0 relative shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-500">
                                      <Sparkles size={36} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h3 className="font-black text-xl sm:text-2xl text-theme-text mb-2 group-hover:text-blue-500 transition-colors">
                                          IAIES Mundials
                                      </h3>
                                      <p className="text-theme-muted text-sm leading-relaxed">L'ecosistema global d'Intel·ligències Artificials que mantenen i auditen l'arquitectura del sistema.</p>
                                  </div>
                              </button>
                          </div>
                      </div>}
              </div>
          </div>
  );
}import { useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Layers, FolderPlus, CheckCircle2, Sparkles, Tag, Save, ArrowLeft, Lock, Globe } from 'lucide-react';
const ConnectarPage = () => {
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item_id');
  const variant = searchParams.get('variant') || 'contingut';
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [customTags, setCustomTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);

  // AI Suggested Categories (Mock data based on context)
  const suggestedFolders = [{
    id: 'guardats',
    label: 'Guardats generals',
    icon: '📁',
    count: 12
  }, {
    id: 'esdeveniments',
    label: 'Calendari i Rutes',
    icon: '📅',
    count: 4
  }, {
    id: 'desitjos',
    label: 'Coses pendent de vore',
    icon: '⭐',
    count: 8
  }, {
    id: 'projectes',
    label: 'Inspiració Projectes',
    icon: '💡',
    count: 2
  }];
  const suggestedTags = ['Història local', 'Interessant', 'Patrimoni', 'Gent del Poble', 'Debat'];
  const handleAddTag = tag => {
    if (tag && !customTags.includes(tag)) {
      setCustomTags([...customTags, tag]);
      setTagInput('');
    }
  };
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }, 1000);
  };
  return (
      <div className="flex flex-col h-full w-full bg-theme-base animate-in fade-in relative z-10">
                {/* INLINE HEADER */}
                <div className='relative z-10 bg-sdp-theme-accent-primary w-full h-[56px] min-h-[56px] flex items-center px-4 shadow-md text-white'>
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 active:scale-95 transition-all">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </button>
                    <h1 className="ml-2 font-bold text-lg uppercase tracking-wider">
                        {`Connectar ${variant.charAt(0).toUpperCase() + variant.slice(1)}`}
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar w-full max-w-3xl mx-auto px-4 md:px-8 pt-6 pb-32">
                    
                    {/* Mode Foraster Banner */}
                    {!isAuthenticated && <div className="mb-8 p-4 bg-[#F97316]/10 border-2 border-[#F97316]/30 rounded-[20px] flex items-start gap-4 animate-pulse-subtle">
                            <div className="bg-[#F97316] p-2 rounded-full text-white shrink-0 mt-1">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-[#F97316] tracking-wide uppercase text-sm mb-1">Mode Foraster Actiu</h3>
                                <p className="text-sm opacity-80 leading-relaxed">
                                    Estàs provant la funcionalitat en mode simulació. Explora, crea carpetes i organitza este element com vullgues. Quan et registres, el teu MAS guardarà els elements permanentment de debò.
                                </p>
                            </div>
                        </div>}

                    {/* Hero Contextual */}
                    <div className="text-center mb-10 mt-4">
                        <div className='inline-flex items-center justify-center w-20 h-20 bg-sdp-theme-accent-primary/10 text-sdp-theme-accent-primary rounded-[28px] mb-6 shadow-[-4px_4px_15px_rgba(255,107,0,0.2)]'>
                            <Layers size={36} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-3">On vols guardar açò?</h1>
                        <p className="text-lg opacity-60">
                            Classifica i ordena la teua connexió amb el registre: 
                            <span className="block mt-1 font-mono text-xs opacity-50">{itemId || 'Element Rebut'}</span>
                        </p>
                    </div>

                    {/* 0. PRIVACITAT DE LA CONNEXIÓ */}
                    <section className="mb-10">
                        <h2 className="text-lg font-black tracking-widest uppercase opacity-80 mx-2 mb-4">Privacitat de la Connexió</h2>
                        <div className="bg-white/5 dark:bg-black/20 p-1.5 rounded-[24px] border border-white/10 flex items-center relative overflow-hidden shadow-inner">
                            {/* Selector Fons */}
                            <div className='absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-sdp-theme-accent-primary rounded-[20px] transition-transform duration-300 ease-out-expo shadow-[0_2px_10px_rgba(249,115,22,0.4)]' style={{
                transform: isPrivate ? 'translateX(0)' : 'translateX(100%)'
              }} />
                            
                            {/* Botó Privat */}
                            <button onClick={() => setIsPrivate(true)} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-sm tracking-wider uppercase transition-colors duration-300 rounded-[20px] ${isPrivate ? 'text-white' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}>
                                <Lock size={18} />
                                Privada
                            </button>

                            {/* Botó Públic */}
                            <button onClick={() => setIsPrivate(false)} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-sm tracking-wider uppercase transition-colors duration-300 rounded-[20px] ${!isPrivate ? 'text-white' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}>
                                <Globe size={18} />
                                Pública
                            </button>
                        </div>
                        <p className="text-center mt-4 text-sm opacity-60 px-4 font-medium h-6">
                            {isPrivate ? "Només tu podràs vore esta connexió en el teu MAS personal." : "Tothom podrà vore que has connectat este element. Faràs xarxa."}
                        </p>
                    </section>

                    {/* 1. SELECCIÓ DE CAIXA / CARPETA */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mx-2 mb-4">
                            <h2 className="text-lg font-black tracking-widest uppercase opacity-80">Caixa Principal</h2>
                            <button className='flex items-center gap-1.5 text-xs font-bold text-sdp-theme-accent-primary hover:opacity-80 transition-opacity'>
                                <FolderPlus size={16} /> CREAR NOVA
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {suggestedFolders.map(folder => <button key={folder.id} onClick={() => setSelectedFolder(folder.id)} className={`p-5 md:p-6 rounded-[28px] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 relative overflow-hidden group
                                        ${selectedFolder === folder.id ? 'border-[var(--theme-accent-primary)] bg-[var(--theme-accent-primary)]/5 dark:bg-[var(--theme-accent-primary)]/10 scale-[1.02] shadow-[0_4px_20px_rgba(249,115,22,0.15)]' : 'border-white/10 dark:border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-lg'}
                                    `}>
                                    <span className="text-5xl md:text-6xl filter drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 mb-2">{folder.icon}</span>
                                    <div className="text-center">
                                        <h3 className="font-bold text-sm md:text-[15px] leading-tight mb-1">{folder.label}</h3>
                                        <span className="text-xs opacity-50 font-medium">{folder.count} elements</span>
                                    </div>
                                    {selectedFolder === folder.id && <div className='absolute top-3 right-3 text-sdp-theme-accent-primary animate-in zoom-in duration-300'>
                                            <CheckCircle2 size={22} className="fill-current bg-white rounded-full" />
                                        </div>}
                                </button>)}
                        </div>
                    </section>

                    {/* 2. ETIQUETAT INTEL·LIGENT (IAIA) */}
                    <section className="mb-10 bg-theme-panel p-6 md:p-8 rounded-[32px] border border-white/5 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-[#E44BCA] p-2.5 rounded-[12px] text-white shadow-[-2px_2px_10px_rgba(228,75,202,0.3)]">
                                <Sparkles size={24} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-black tracking-widest uppercase mb-1">Assistent de Context</h2>
                                <p className="text-sm opacity-60">La IAIA et suggereix estes etiquetes en base al sistema de Poble. Afig tu les que vullgues per trobar-ho ràpid.</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {suggestedTags.map(tag => <button key={tag} onClick={() => handleAddTag(tag)} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${customTags.includes(tag) ? 'bg-[var(--theme-accent-primary)] border-[var(--theme-accent-primary)] text-white scale-105' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                    {customTags.includes(tag) && <span className="mr-1.5 opacity-80">✓</span>}
                                    {tag}
                                </button>)}
                        </div>

                        <div className='flex items-center gap-3 bg-white/5 dark:bg-black/20 p-2 pl-4 rounded-full border border-white/10 focus-within:border-sdp-theme-accent-primary/50 transition-colors'>
                            <Tag size={18} className="opacity-40" />
                            <input id="tag-input-connection" name="tag_input_connection" type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTag(tagInput)} placeholder="Escriu una etiqueta lliure..." className="bg-transparent border-none outline-none flex-1 text-sm font-medium h-8" />
                            <button onClick={() => handleAddTag(tagInput)} disabled={!tagInput.trim()} className='bg-sdp-theme-accent-primary text-white px-5 py-2 h-10 rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all'>
                                Afegir
                            </button>
                        </div>
                        
                        {customTags.length > 0 && <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                 {customTags.map(tag => <div key={tag} className='flex items-center gap-2 bg-sdp-theme-accent-primary/10 text-sdp-theme-accent-primary px-3 py-1.5 rounded-full text-sm font-bold'>
                                        {tag}
                                        <button onClick={() => setCustomTags(customTags.filter(t => t !== tag))} className="opacity-50 hover:opacity-100">
                                            ×
                                        </button>
                                    </div>)}
                            </div>}
                    </section>

                    {/* 3. SUBMIT */}
                    <div className="flex flex-col items-center justify-center pt-4">
                        <button onClick={handleSave} disabled={!selectedFolder || isSaving || isSaved} className={`
                                relative overflow-hidden group w-full md:w-auto h-[64px] min-w-[280px] rounded-full font-black text-[15px] uppercase tracking-widest transition-all duration-300
                                ${isSaved ? 'bg-green-500 text-white shadow-xl scale-105' : !selectedFolder ? 'bg-gray-200 dark:bg-white/5 text-theme-text/40 cursor-not-allowed' : 'bg-[var(--theme-accent-primary)] text-white shadow-[0_10px_30px_-10px_rgba(255,107,0,0.5)] hover:scale-[1.02]'}
                            `}>
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isSaving ? <>
                                        <Sparkles className="animate-spin" size={20} />
                                        Bategant Connexió...
                                    </> : isSaved ? <>
                                        <CheckCircle2 size={24} className="fill-current text-green-500 bg-white rounded-full" />
                                        Connectat al teu Mas
                                    </> : <>
                                        <Save size={20} />
                                        {!isAuthenticated ? "Simular Guardat" : "Connectar a l'Arxiu"}
                                    </>}
                            </span>
                            
                            {!isSaved && selectedFolder && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out-expo" />}
                        </button>
                        {!selectedFolder && !isSaved && <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-40 text-center">
                                Selecciona una carpeta o caixa per activar
                             </p>}
                    </div>

                </div>
            </div>
  );
};
export default ConnectarPage;import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { MEDIA_REGISTRY } from '../../data/media_registry';
import SEO from '../../components/core/SEO';
import { useTheme } from '../../app/context/ThemeContext';
import { Folder, Info, Film, FileText, X, Trash2, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, MousePointerSquareDashed, Maximize2, Search, ArrowLeft, Link } from 'lucide-react';
import axios from 'axios';
import { GroupedVirtuoso } from 'react-virtuoso';
import { useNavigate } from 'react-router-dom';
const MediaManager = () => {
  const navigate = useNavigate();
  const [localMedia, setLocalMedia] = useState(MEDIA_REGISTRY.media || []);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [linkFilter, setLinkFilter] = useState('all'); // 'all', 'linked', 'orphaned'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [imageUsages, setImageUsages] = useState({});
  const [isUsagesLoaded, setIsUsagesLoaded] = useState(false);

  // Carregar usos d'imatges (Indexació asíncrona)
  useEffect(() => {
    Promise.all([import('../../data/mockLoreData'), import('../../data/genotip_registry.json')]).then(([mockLore, genotipModule]) => {
      const usages = {};
      const addUsage = (url, usage) => {
        if (!url) return;
        const normalizedUrl = url.split('?')[0];
        const parts = normalizedUrl.split('/');
        const filename = parts[parts.length - 1];
        if (!filename) return;
        if (!usages[filename]) usages[filename] = [];
        usages[filename].push(usage);
      };
      const mockLorePosts = mockLore.MOCK_LORE_POSTS || {};
      Object.values(mockLorePosts).forEach(townPosts => {
        townPosts.forEach(post => {
          const title = post.title || (post.content ? post.content.substring(0, 30) + '...' : 'Post sense títol');
          if (post.image_url) {
            const urls = Array.isArray(post.image_url) ? post.image_url : [post.image_url];
            urls.forEach(url => addUsage(url, {
              type: 'Mur',
              title,
              id: post.id
            }));
          }
          if (post.coverImage) {
            addUsage(post.coverImage, {
              type: 'Mur',
              title,
              id: post.id
            });
          }
        });
      });
      const mockLoreItems = mockLore.MOCK_LORE_ITEMS || {};
      Object.values(mockLoreItems).forEach(townItems => {
        townItems.forEach(item => {
          const title = item.name || item.title || 'Perfil';
          if (item.avatar) addUsage(item.avatar, {
            type: 'Perfil',
            title,
            id: item.id
          });
          if (item.coverImage) addUsage(item.coverImage, {
            type: 'Portada',
            title,
            id: item.id
          });
          if (item.image) addUsage(item.image, {
            type: 'Pàgina',
            title,
            id: item.id
          });
        });
      });
      const genotipData = genotipModule.default || genotipModule;
      if (Array.isArray(genotipData)) {
        genotipData.forEach(skill => {
          if (skill.image_url) addUsage(skill.image_url, {
            type: 'Genotip',
            title: skill.title,
            id: skill.id
          });
        });
      }
      setImageUsages(usages);
      setIsUsagesLoaded(true);
    }).catch(err => console.error("Error carregant index d'usos", err));
  }, []);

  // UI States
  const {
    theme
  } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentTopDate, setCurrentTopDate] = useState('');
  const scrollTimeoutRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);

  // Virtuoso ref
  const virtuosoRef = useRef(null);

  // Selection States
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);

  // Handle Drag To Select
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging]);
  const handleMouseEnter = id => {
    if (selectionMode && isDragging) {
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
    }
  };

  // Calcular columnes de forma reactiva
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setCols(5);else if (window.innerWidth >= 768) setCols(4);else setCols(2);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // Compteig d'arxius per carpeta
  const folderStats = useMemo(() => {
    const stats = {
      all: localMedia.length
    };
    localMedia.forEach(m => {
      const f = m.folder;
      stats[f] = (stats[f] || 0) + 1;
    });
    return stats;
  }, [localMedia]);
  const folders = useMemo(() => {
    const unique = new Set(localMedia.map(m => m.folder));
    return ['all', ...Array.from(unique)].sort();
  }, [localMedia]);

  // Compteig d'estat d'enllaços
  const linkStats = useMemo(() => {
    const stats = {
      all: localMedia.length,
      linked: 0,
      orphaned: 0
    };
    if (!isUsagesLoaded) return stats;
    localMedia.forEach(m => {
      const parts = m.path.split('/');
      const filename = parts[parts.length - 1];
      if (imageUsages[filename] && imageUsages[filename].length > 0) {
        stats.linked += 1;
      } else {
        stats.orphaned += 1;
      }
    });
    return stats;
  }, [localMedia, imageUsages, isUsagesLoaded]);
  const filteredMedia = useMemo(() => {
    let result = localMedia;

    // Filter by folder
    if (selectedFolder !== 'all') {
      result = result.filter(m => m.folder === selectedFolder);
    }

    // Filter by search query (filename or folder)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => m.filename && m.filename.toLowerCase().includes(q) || m.folder && m.folder.toLowerCase().includes(q));
    }

    // Filter by link status
    if (isUsagesLoaded && linkFilter !== 'all') {
      if (linkFilter === 'linked') {
        result = result.filter(m => {
          const parts = m.path.split('/');
          const filename = parts[parts.length - 1];
          return imageUsages[filename] && imageUsages[filename].length > 0;
        });
      } else if (linkFilter === 'orphaned') {
        result = result.filter(m => {
          const parts = m.path.split('/');
          const filename = parts[parts.length - 1];
          return !imageUsages[filename] || imageUsages[filename].length === 0;
        });
      }
    }
    return [...result].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [selectedFolder, searchQuery, localMedia, linkFilter, isUsagesLoaded, imageUsages]);

  // Calcular dades per a GroupedVirtuoso
  const {
    groupCounts,
    rowGroups,
    flatRows
  } = useMemo(() => {
    const groupsMap = new Map();
    filteredMedia.forEach(item => {
      const dateObj = new Date(item.date || 0);
      const monthYear = new Intl.DateTimeFormat('ca-ES', {
        month: 'long',
        year: 'numeric'
      }).format(dateObj);
      const title = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
      if (!groupsMap.has(title)) {
        groupsMap.set(title, []);
      }
      groupsMap.get(title).push(item);
    });
    const rGroups = [];
    const fRows = [];
    const gCounts = [];
    for (const [title, items] of groupsMap.entries()) {
      const rows = [];
      for (let i = 0; i < items.length; i += cols) {
        const row = items.slice(i, i + cols);
        rows.push(row);
        fRows.push(row);
      }
      rGroups.push({
        title,
        rows
      });
      gCounts.push(rows.length);
    }
    return {
      groupCounts: gCounts,
      rowGroups: rGroups,
      flatRows: fRows
    };
  }, [filteredMedia, cols]);

  // Clic a la bombolla per saltar al següent mes
  const handleBubbleClick = () => {
    if (!rowGroups.length) return;
    const currentGroupIdx = rowGroups.findIndex(g => g.title === currentTopDate);
    if (currentGroupIdx !== -1) {
      const nextIdx = (currentGroupIdx + 1) % rowGroups.length;

      // Trobar l'índex absolut de la fila per passar-ho a virtuoso
      let flatIndex = 0;
      for (let i = 0; i < nextIdx; i++) {
        flatIndex += groupCounts[i];
      }
      virtuosoRef.current?.scrollToIndex({
        index: flatIndex,
        align: 'start',
        behavior: 'smooth'
      });
    }
  };

  // Handle Keyboard Navigation per al Carrusel
  const handleKeyDown = useCallback(e => {
    if (!selectedImage) return;
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
    if (currentIndex === -1) return;
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % filteredMedia.length;
      setSelectedImage(filteredMedia[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
      setSelectedImage(filteredMedia[prevIndex]);
    } else if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  }, [selectedImage, filteredMedia]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  const goNext = e => {
    if (e) e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    setSelectedImage(filteredMedia[nextIndex]);
  };
  const goPrev = e => {
    if (e) e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setSelectedImage(filteredMedia[prevIndex]);
  };

  // Swipe handlers per a mòbils
  const handleTouchStart = e => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = e => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) goNext();
    if (touchStart - touchEnd < -50) goPrev();
    setTouchStart(null);
  };
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems(new Set());
  };
  const toggleSelectItem = id => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0 || isDeleting) return;
    const confirmDelete = window.confirm(`Segur que vols esborrar permanentment ${selectedItems.size} elements?`);
    if (!confirmDelete) return;
    setIsDeleting(true);

    // --- ESBORRAT OPTIMÍSTIC ---
    const idsToDelete = Array.from(selectedItems);
    const updatedMedia = localMedia.filter(m => !selectedItems.has(m.id));
    setLocalMedia(updatedMedia);
    setSelectionMode(false);
    setSelectedItems(new Set());
    // ---------------------------

    try {
      const res = await axios.post('/api/media/bulk-delete', {
        ids: idsToDelete
      });
      if (!res.data.success) {
        console.error("Error al servidor:", res.data.error);
      }
    } catch (err) {
      console.error("Error esborrant imatges en bloc:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedImage || isDeleting) return;
    const confirmDelete = window.confirm(`Segur que vols esborrar permanentment "${selectedImage.filename}"?`);
    if (!confirmDelete) return;
    setIsDeleting(true);
    const idToDelete = selectedImage.id;

    // --- ESBORRAT OPTIMÍSTIC ---
    const updatedMedia = localMedia.filter(m => m.id !== idToDelete);
    setLocalMedia(updatedMedia);
    const currentFilteredIndex = filteredMedia.findIndex(m => m.id === idToDelete);
    const remainingFiltered = filteredMedia.filter(m => m.id !== idToDelete);
    if (remainingFiltered.length === 0) {
      setSelectedImage(null);
    } else {
      const nextTargetIndex = currentFilteredIndex >= remainingFiltered.length ? 0 : currentFilteredIndex;
      setSelectedImage(remainingFiltered[nextTargetIndex]);
    }
    // ---------------------------

    try {
      await axios.delete(`/api/media/${idToDelete}`);
    } catch (err) {
      console.error("Error esborrant imatge:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleMove = async () => {
    if (!selectedImage || isMoving || !newFolderName.trim()) return;
    setIsMoving(true);
    try {
      const res = await axios.post(`/api/media/move/${selectedImage.id}`, {
        folder: newFolderName.trim()
      });
      if (res.data && res.data.success && res.data.item) {
        const updatedMedia = localMedia.map(m => m.id === selectedImage.id ? res.data.item : m);
        setLocalMedia(updatedMedia);
        if (selectedFolder !== 'all' && newFolderName !== selectedFolder) {
          const currentFilteredIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
          const remainingFiltered = filteredMedia.filter(m => m.id !== selectedImage.id);
          if (remainingFiltered.length === 0) {
            setSelectedImage(null);
          } else {
            const nextTargetIndex = currentFilteredIndex >= remainingFiltered.length ? 0 : currentFilteredIndex;
            setSelectedImage(remainingFiltered[nextTargetIndex]);
          }
        } else {
          setSelectedImage(res.data.item);
        }
        setNewFolderName('');
      }
    } catch (err) {
      console.error("Error movent imatge:", err);
      alert("Hi ha hagut un error movent la imatge.");
    } finally {
      setIsMoving(false);
    }
  };

  // --- ESTILS DINÀMICS PER A TEMA CLAR/FOSC ---
  const bgMain = isDarkMode ? 'bg-[#050505]' : 'bg-gray-50';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textDim = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const borderMain = isDarkMode ? 'border-[#222]' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-[#111]' : 'bg-gray-100';

  // To Blau (Fosc) / Taronja (Clar) per a la barra unificada
  // Ajustat l'alçada a 56px per aliniar amb el botó Connectar del Sidebar
  const toolbarBg = isDarkMode ? 'bg-[#4F46E5] text-white' : 'bg-[#F97316] text-white';
  const toolbarBorder = 'border-transparent';
  return <div className={`flex flex-col h-full overflow-hidden w-full relative pb-20 md:pb-0 transition-colors duration-300 ${bgMain} ${textMain}`} id="media-scroll-container">
            <SEO title="Banc d'Imatges (Local Photos)" description="Directori Multimèdia del sistema Sóc de Poble." url="/media" />

            {/* COMPACT UNIFIED TOOLBAR - Height 56px exactly */}
            <div className={`w-full h-[56px] min-h-[56px] shrink-0 flex items-center justify-between px-2 sm:px-4 border-b z-30 transition-colors duration-300 ${toolbarBg} ${toolbarBorder}`}>
                
                {/* Left: Filters */}
                <div className="flex items-center gap-1.5 sm:gap-2 h-full">
                    <button onClick={() => navigate(-1)} className="flex items-center justify-center w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 transition-colors text-white shrink-0" title="Tornar Enrere">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                    
                    <div className="h-4 sm:h-5 w-[1px] bg-white opacity-30 mx-0.5 shrink-0"></div>
                    
                    {/* Folders Dropdown */}
                    <div className="relative flex items-center justify-center w-9 h-9 sm:w-auto sm:h-9 bg-black/20 hover:bg-black/30 rounded-full transition-colors shrink-0">
                        <div className="absolute left-[10px] sm:left-3 pointer-events-none text-white flex items-center justify-center z-10">
                            <Folder size={16} />
                        </div>
                        <select value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)} className="absolute inset-0 sm:static w-full h-full opacity-0 sm:opacity-100 sm:appearance-none bg-transparent cursor-pointer text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs pl-0 sm:pl-9 pr-0 sm:pr-8 outline-none z-20">
                            {folders.map(folder => <option key={folder} value={folder} className="text-black bg-white">
                                    {folder === 'all' ? `Tots (${folderStats.all})` : `${folder.substring(0, 8)} (${folderStats[folder]})`}
                                </option>)}
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-white/70 hidden sm:block z-10">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Link Status Dropdown */}
                    <div className="relative flex items-center justify-center w-9 h-9 sm:w-auto sm:h-9 bg-black/20 hover:bg-black/30 rounded-full transition-colors shrink-0">
                        <div className="absolute left-[10px] sm:left-3 pointer-events-none text-white flex items-center justify-center z-10">
                            <Link size={16} />
                        </div>
                        <select value={linkFilter} onChange={e => setLinkFilter(e.target.value)} className="absolute inset-0 sm:static w-full h-full opacity-0 sm:opacity-100 sm:appearance-none bg-transparent cursor-pointer text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs pl-0 sm:pl-9 pr-0 sm:pr-8 outline-none z-20">
                            <option value="all" className="text-black bg-white">All ({linkStats.all})</option>
                            <option value="linked" className="text-black bg-white">On ({linkStats.linked})</option>
                            <option value="orphaned" className="text-black bg-white">Off ({linkStats.orphaned})</option>
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-white/70 hidden sm:block z-10">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 h-full">
                    {/* Search Field */}
                    <div className="relative flex items-center justify-start w-9 h-9 sm:w-32 lg:w-48 bg-black/20 hover:bg-black/30 focus-within:bg-black/30 focus-within:w-48 focus-within:absolute focus-within:right-2 sm:focus-within:relative sm:focus-within:w-full rounded-full transition-all shrink-0 z-30 group">
                        <div className="absolute left-[10px] sm:left-3 pointer-events-none text-white flex items-center justify-center z-10 transition-colors">
                            <Search size={16} />
                        </div>
                        <input id="media-search" type="text" placeholder="Cercar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="absolute inset-0 sm:static w-full h-full bg-transparent text-white placeholder-transparent sm:placeholder-white/60 focus:placeholder-white/60 text-xs pl-9 pr-3 outline-none cursor-pointer focus:cursor-text opacity-0 sm:opacity-100 focus:opacity-100 transition-all rounded-full z-20" />
                    </div>

                    {/* Info Button */}
                    <button className="flex items-center justify-center w-9 h-9 bg-black/20 hover:bg-black/30 rounded-full transition-all text-white relative shrink-0" onClick={() => {
          if (MEDIA_REGISTRY.duplicates?.length > 0) {
            alert(`Hi ha ${MEDIA_REGISTRY.duplicates.length} arxius duplicats al sistema (detectats via hash MD5):\n\n` + MEDIA_REGISTRY.duplicates.map(d => `- ${d.filename}`).join('\n') + `\n\nEl sistema els ha saltat per estalviar espai.`);
          } else {
            alert('Indexació Local-First.\nZero arxius duplicats al sistema (0 conflictes MD5).');
          }
        }} title="Informació d'Indexació">
                        <Info size={16} />
                        {MEDIA_REGISTRY.duplicates?.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg"></span>}
                    </button>

                    <button onClick={toggleSelectionMode} className={`flex items-center justify-center gap-1.5 h-9 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 ${selectionMode ? 'bg-white text-black shadow-lg' : 'bg-black/20 hover:bg-black/30 text-white'}`}>
                        <MousePointerSquareDashed size={14} /> 
                        <span className="hidden lg:inline">{selectionMode ? 'Cancel·lar' : 'Seleccionar'}</span>
                    </button>
                </div>
            </div>

            {/* BULK ACTIONS BAR */}
            {selectionMode && selectedItems.size > 0 && <div className={`w-full shrink-0 border-b px-4 md:px-8 py-2.5 flex items-center justify-between animate-in slide-in-from-top-2 z-20 ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-orange-50 border-orange-200'}`}>
                    <div className={`flex items-center gap-2 font-bold text-xs ${isDarkMode ? 'text-blue-500' : 'text-orange-600'}`}>
                        <CheckCircle2 size={16} /> {selectedItems.size} seleccionats
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleBulkDelete} disabled={isDeleting} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50">
                            <Trash2 size={14} /> {isDeleting ? 'Esborrant...' : 'Esborrar Seleccionats'}
                        </button>
                    </div>
                </div>}

            {/* BODY (Scrollable Area handled by GroupedVirtuoso) */}
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-4 gap-6 relative">
                
                {/* BOMBOLLA D'SCROLL ESTIL GOOGLE PHOTOS (PINCHABLE) */}
                <div onClick={handleBubbleClick} onMouseEnter={() => {
        setIsScrolling(true);
        clearTimeout(scrollTimeoutRef.current);
      }} onMouseLeave={() => {
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 2000);
      }} className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full font-black text-sm shadow-2xl transition-all duration-300 border border-white/10 cursor-pointer hover:bg-black hover:scale-105 active:scale-95 ${isScrolling ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`} title="Clica per passar de mes">
                    {currentTopDate}
                </div>
                
                {/* GROUPED VIRTUOSO */}
                <div className="flex-1 relative">
                    {filteredMedia.length > 0 ? <GroupedVirtuoso ref={virtuosoRef} style={{
          height: '100%',
          width: '100%'
        }} className="custom-scrollbar" groupCounts={groupCounts} overscan={400} onScroll={() => {
          setIsScrolling(true);
          clearTimeout(scrollTimeoutRef.current);
          // S'allarga l'estada a 2.5 segons
          scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 2500);
        }} itemsRendered={items => {
          if (items.length > 0) {
            const firstItemIndex = items[0].index;
            const row = flatRows[firstItemIndex];
            if (row && row[0]) {
              const dateObj = new Date(row[0].date || 0);
              const monthYear = new Intl.DateTimeFormat('ca-ES', {
                month: 'long',
                year: 'numeric'
              }).format(dateObj);
              setCurrentTopDate(monthYear.charAt(0).toUpperCase() + monthYear.slice(1));
            }
          }
        }} groupContent={index => {
          return <div className={`pt-4 pb-2 border-b mb-3 sticky top-0 z-10 w-full transition-colors ${isDarkMode ? 'bg-[#050505]/95 backdrop-blur-sm border-white/5 text-white/90' : 'bg-gray-50/95 backdrop-blur-sm border-gray-200 text-gray-800'}`}>
                                        <h2 className="font-black text-lg tracking-wider">
                                            {rowGroups[index].title}
                                        </h2>
                                    </div>;
        }} itemContent={index => {
          const row = flatRows[index];
          return <div className="flex w-full gap-2 md:gap-4 mb-2 md:mb-4">
                                        {row.map(item => {
              const isSelected = selectedItems.has(item.id);
              return <div key={item.id} style={{
                flex: `1 1 calc(${100 / cols}% - 16px)`,
                aspectRatio: '1 / 1',
                maxWidth: `calc(${100 / cols}% - 16px)`
              }} onMouseDown={() => {
                if (selectionMode) {
                  setIsDragging(true);
                  toggleSelectItem(item.id);
                }
              }} onMouseEnter={() => handleMouseEnter(item.id)} onClick={e => {
                if (!selectionMode) {
                  setSelectedImage(item);
                }
              }} onDragStart={e => e.preventDefault()} className={`${cardBg} border rounded-xl overflow-hidden group relative transition-all ${isSelected ? isDarkMode ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-95' : 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-95' : isDarkMode ? 'border-[#222] hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-gray-200 shadow-sm hover:border-orange-400 hover:shadow-md cursor-pointer'}`}>
                                                    {item.type === 'image' || !item.type ? <img src={item.path} alt={item.filename} draggable={false} className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? 'opacity-50 scale-110' : ''}`} loading="lazy" onError={e => {
                  if (!e.target.dataset.failed) {
                    e.target.dataset.failed = 'true';
                    e.target.src = '/default-avatar.png';
                  }
                }} /> : item.type === 'video' ? <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-white/50 bg-[#1a1a1a]' : 'text-gray-400 bg-gray-200'}`}>
                                                            <Film size={48} className="opacity-50" />
                                                        </div> : <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-white/50 bg-[#1a1a1a]' : 'text-gray-400 bg-gray-200'}`}>
                                                            <FileText size={48} className="opacity-50" />
                                                        </div>}

                                                    {/* Checkbox per Selecció */}
                                                    {selectionMode && <div className="absolute top-2 left-2 z-10">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? isDarkMode ? 'bg-blue-500 border-blue-500 text-white scale-110' : 'bg-orange-500 border-orange-500 text-white scale-110' : 'border-white/50 bg-black/30 text-transparent'}`}>
                                                                <CheckCircle2 size={12} />
                                                            </div>
                                                        </div>}

                                                    {/* Hover Overlay "El pinchable" */}
                                                    {!selectionMode && <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all p-4 text-center cursor-pointer">
                                                            <div className={`${isDarkMode ? 'bg-blue-600/90' : 'bg-orange-500/90'} text-white rounded-full p-2.5 shadow-lg transform scale-90 group-hover:scale-100 transition-all flex items-center justify-center gap-2 mb-1`}>
                                                                <Maximize2 size={16} />
                                                            </div>
                                                            <span className="text-[9px] uppercase tracking-widest text-[#aaa] bg-black/80 px-2 py-0.5 rounded border border-[#444]">{item.folder}</span>
                                                            <span className="text-xs font-bold text-white max-w-full truncate">{item.filename}</span>
                                                        </div>}
                                                </div>;
            })}
                                        {/* Espais buits flex */}
                                        {Array.from({
              length: cols - row.length
            }).map((_, i) => <div key={`empty-${i}`} style={{
              flex: `1 1 calc(${100 / cols}% - 16px)`,
              maxWidth: `calc(${100 / cols}% - 16px)`
            }} />)}
                                    </div>;
        }} /> : <div className="w-full h-64 flex flex-col items-center justify-center font-bold tracking-widest uppercase opacity-50">
                            No hi ha arxius que coincidisquen amb la cerca
                        </div>}
                </div>
            </div>

            {/* MODAL DETALL / CARRUSEL */}
            {selectedImage && !selectionMode && <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
                    <div className={`w-full h-full md:h-auto md:max-w-6xl border rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl ${isDarkMode ? 'bg-[#0a0a0c] border-[#333]' : 'bg-white border-gray-300'}`} onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all backdrop-blur" onClick={() => setSelectedImage(null)}>
                            <X size={18} />
                        </button>
                        
                        <div className="w-full md:w-2/3 h-[50vh] md:h-auto bg-black flex items-center justify-center p-4 relative md:!min-h-[500px] group" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                            <button onClick={goPrev} className="absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                                <ChevronLeft size={24} className="md:w-7 md:h-7" />
                            </button>
                            <button onClick={goNext} className="absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                                <ChevronRight size={24} className="md:w-7 md:h-7" />
                            </button>

                            <img src={selectedImage.path} alt={selectedImage.filename} draggable={false} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform" onError={e => {
            if (!e.target.dataset.failed) {
              e.target.dataset.failed = 'true';
              e.target.src = '/default-avatar.png';
            }
          }} />
                            
                            {/* Mobile Swipe Hint */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/60 px-4 py-1 rounded-full text-xs uppercase tracking-widest md:hidden backdrop-blur">
                                Llisca per navegar
                            </div>
                        </div>

                        <div className={`w-full md:w-1/3 flex-1 border-t md:border-t-0 md:border-l flex flex-col overflow-y-auto custom-scrollbar ${borderMain}`}>
                           <div className={`p-4 md:p-6 pb-2 border-b ${borderMain}`}>
                                <h2 className={`text-lg md:text-xl font-bold word-break hyphens-auto break-all leading-tight ${textMain}`}>{selectedImage.filename}</h2>
                           </div>
                           
                           <div className={`p-4 md:p-6 space-y-3 md:space-y-4 text-sm flex-1 ${textDim}`}>
                               <div>
                                   <label className="text-xs uppercase tracking-widest font-bold mb-1 block opacity-50">Carpeta Actual</label>
                                   <div className={`inline-flex items-center border rounded-full px-3 py-1 text-xs ${isDarkMode ? 'border-[#444] bg-white/5 text-white' : 'border-gray-300 bg-gray-100 text-gray-800'}`}>
                                       <Folder size={12} className="inline mr-1" /> {selectedImage.folder}
                                   </div>
                               </div>
                               <div>
                                   <label className="text-xs uppercase tracking-widest font-bold mb-1 block opacity-50">Hash Únic (MD5 ID)</label>
                                   <div className={`font-mono border rounded p-2 text-[10px] truncate ${isDarkMode ? 'bg-[#111] border-[#222] text-white/90' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                                       {selectedImage.id}
                                   </div>
                               </div>
                               <div>
                                   <label className="text-xs uppercase tracking-widest font-bold mb-1 block opacity-50">Ruta Interna</label>
                                   <div className={`font-mono border rounded p-2 text-[10px] break-all ${isDarkMode ? 'bg-[#111] border-[#222] text-white/80' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                                       {selectedImage.path}
                                   </div>
                               </div>

                               <div className="pt-2 hidden md:block">
                                   <label className="text-xs uppercase tracking-widest font-bold mb-1 block opacity-50">Metadades (EXIF)</label>
                                   <div className={`border rounded-lg p-3 text-xs space-y-2 ${isDarkMode ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
                                       <div className="flex justify-between">
                                           <span className="opacity-60">Origen</span>
                                           <span className="font-bold">{selectedImage.folder === 'Records IAIA' ? 'Generat per IAIA' : 'Pujada per usuari'}</span>
                                       </div>
                                       <div className="flex justify-between">
                                           <span className="opacity-60">Data</span>
                                           <span className="font-bold">{new Date(selectedImage.date).toLocaleDateString()}</span>
                                       </div>
                                   </div>
                               </div>

                                <div className="pt-2">
                                    <label className="text-xs uppercase tracking-widest font-bold mb-1 block opacity-50">Enllaços de la Imatge</label>
                                    <div className={`border rounded-lg p-3 text-xs space-y-2 ${isDarkMode ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
                                        {!isUsagesLoaded ? <div className="text-orange-500 animate-pulse">Indexant connexions...</div> : (() => {
                  const filename = selectedImage.path.split('/').pop();
                  const usages = imageUsages[filename];
                  if (usages && usages.length > 0) {
                    return <div className="space-y-2">
                                                        <div className="text-green-600 dark:text-green-400 font-bold mb-2">
                                                            ✓ Utilitzada en {usages.length} lloc(s)
                                                        </div>
                                                        <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                                                            {usages.map((usage, idx) => <div key={usage.id} className={`p-2 rounded border flex items-center justify-between gap-2 cursor-pointer transition-colors ${isDarkMode ? 'bg-[#222] border-[#333] hover:border-blue-500 hover:bg-[#333]' : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`} onClick={() => {
                          if (usage.type === 'Mur') navigate(`/post/${usage.id}`);else if (usage.type === 'Genotip') navigate(`/genotip`);else navigate(`/gent/${usage.id}`);
                        }}>
                                                                    <span className="font-semibold text-xs uppercase tracking-wide opacity-70 shrink-0 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{usage.type}</span>
                                                                    <span className="truncate flex-1 text-blue-500 dark:text-blue-400 hover:underline" title={usage.title}>{usage.title}</span>
                                                                    <Link size={12} className="opacity-50 shrink-0" />
                                                                </div>)}
                                                        </div>
                                                    </div>;
                  } else {
                    return <div className="text-red-500 font-bold">
                                                        ✗ Imatge Òrfena (No s'utilitza enlloc)
                                                    </div>;
                  }
                })()}
                                    </div>
                                </div>
                           </div>

                           <div className={`p-4 md:p-6 border-t flex flex-col gap-3 shrink-0 ${isDarkMode ? 'bg-[#0d0d12] border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
                               <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-widest font-bold opacity-50 block">Moure a una carpeta</label>
                                    <div className="flex gap-2">
                                        <input type="text" list="folder-options" placeholder="Ex: posts" className={`flex-1 border text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-black border-[#333] text-white' : 'bg-white border-gray-300 text-black'}`} value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleMove()} />
                                        <datalist id="folder-options">
                                            {folders.filter(f => f !== 'all').map(f => <option key={f} value={f} />)}
                                        </datalist>
                                        <button onClick={handleMove} disabled={isMoving || !newFolderName.trim()} className={`disabled:opacity-50 rounded-lg px-3 py-1.5 flex items-center transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                               </div>
                               
                               <div className={`flex gap-2 pt-2 border-t ${borderMain}`}>
                                    <button onClick={handleDelete} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-600/30 rounded-xl py-2 md:py-3 font-bold text-xs tracking-wide transition-all uppercase disabled:opacity-50">
                                        <Trash2 size={14} /> Esborrar
                                    </button>
                                    <button className={`flex-1 rounded-xl py-2 md:py-3 font-black text-xs tracking-wide transition-all uppercase ${isDarkMode ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}>
                                        Utilitzar
                                    </button>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>}
        </div>;
};
export default MediaManager;import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../../core/services/supabaseService';
import { logger } from '../../utils/logger';
import { ArrowLeft, LayoutGrid, Calendar, Brain } from 'lucide-react';
import StatusLoader from '../../components/ui/StatusLoader';
import brainMediaData from '../../data/brain_media.json';
import './GlobalAssetAlbum.css';
const GlobalAssetAlbum = () => {
  const navigate = useNavigate();
  const [dbMediaItems, setDbMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, timeline, brain

  useEffect(() => {
    const loadGlobalMedia = async () => {
      try {
        setIsLoading(true);
        const data = await supabaseService.getGlobalMedia();
        setDbMediaItems(data || []);
      } catch (err) {
        logger.error('[GlobalAssetAlbum] Error loading global media:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGlobalMedia();
  }, []);
  const activeItems = viewMode === 'brain' ? brainMediaData : dbMediaItems;
  if (isLoading) return <StatusLoader type="loading" message="Sincronitzant l'Àlbum Global..." />;
  return <div className="global-album-page anim-fade-in bg-[#FDF5E6] dark:bg-[#0a0a0a] min-h-screen text-black dark:text-white pb-20">
            <div role="region" aria-label="Capçalera de Secció" className="global-album-header p-4 border-b border-black/10 dark:border-white/10">
                <div className="header-top flex items-center mb-6">
                    <button className="back-btn mr-4 p-2 bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 transition-colors" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="header-title-wrapper flex-1">
                        <h1 className="text-2xl font-black uppercase tracking-tight">Àlbum Global del Poble</h1>
                        <p className="text-sm opacity-60">Totes les imatges i records compartits a la xarxa.</p>
                    </div>
                </div>

                <div className="header-tabs flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <button className={`header-tab flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/10'}`} onClick={() => setViewMode('grid')}>
                        <LayoutGrid size={18} /> Galeria
                    </button>
                    <button className={`header-tab flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${viewMode === 'timeline' ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/10'}`} onClick={() => setViewMode('timeline')}>
                        <Calendar size={18} /> Cronologia
                    </button>
                    <button className={`header-tab flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${viewMode === 'brain' ? 'bg-orange-500 text-white' : 'bg-black/5 dark:bg-white/10'}`} onClick={() => setViewMode('brain')}>
                        <Brain size={18} /> Records de la IAIA
                    </button>
                </div>
            </div>

            <div role="region" aria-label="Contingut Principal" className="global-album-content p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeItems.map((item, index) => <div key={item.id || index} className="relative aspect-square bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden group border border-black/10 dark:border-white/10 cursor-pointer hover:border-orange-500 transition-colors">
                            <img src={item.media_url || item.url} alt={item.title || item.id} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                            {viewMode === 'brain' && <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs font-mono truncate">{item.title}</p>
                                    <p className="text-[9px] opacity-70">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>}
                        </div>)}
                </div>
                {activeItems.length === 0 && <div className="text-center py-20 opacity-50">
                        <p>No hi ha imatges per mostrar en aquesta vista.</p>
                    </div>}
            </div>

            {/* FLOATING ACTION BADGE - Sóc de Poble Style */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-xl z-50">
                <span>Vist per {activeItems.length} records autèntics</span>
            </div>
        </div>;
};
export default GlobalAssetAlbum;import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useModalDispatch } from '../../app/context/ModalContext';
import PageHeader from '../../components/layout/PageHeader';
import { UniversalButton as Button } from '../../components/ui/Button/UniversalButton';
import { Newspaper, Store, Calendar, MapPin, Bot, StickyNote, Shield, Cpu, LogOut } from 'lucide-react';
const HubView = () => {
  const {
    openPostModal,
    setIsEventModalOpen,
    setIsMarketModalOpen
  } = useModalDispatch();
  const {
    isSuperAdmin,
    isAdmin,
    logout,
    user
  } = useAuth();
  const navigate = useNavigate();
  return (
      <div className="min-h-full w-full bg-theme-base text-theme-text flex flex-col items-center transition-colors duration-500">
                
                <PageHeader title="Centre de Control" subtitle="Sóc de Poble V16.3" sticky={true} onBack={() => {
          if (window.history.length > 1) navigate(-1);else navigate('/mur');
        }} />

                <div className="w-full max-w-2xl space-y-8 p-4 pt-6 md:p-8 animate-in fade-in duration-500">
                    
                    {/* PRIMARY ACTIONS - The Big 5 */}
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-theme-text/40 mb-4 pl-2">Accions Principals</h2>
                        <div className="flex flex-col gap-4">
                            
                            {/* THE MASTER BUTTON: Publicar al Mur */}
                            <button className='w-full flex items-center p-5 border border-sdp-theme-accent-primary/30 rounded-[28px] bg-gradient-to-r from-sdp-theme-accent-primary/10 to-transparent hover:from-sdp-theme-accent-primary/20 transition-all group active:scale-[0.98] shadow-sm' onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else openPostModal();
              }}>
                                <div className='w-14 h-14 rounded-[20px] bg-sdp-theme-accent-primary text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_var(--theme-accent-primary)] opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform'>
                                    <Newspaper size={28} />
                                </div>
                                <div className="flex flex-col items-start ml-5 text-left">
                                    <span className="font-sans text-[22px] font-black uppercase tracking-widest leading-none text-theme-text">Publicar al Mur</span>
                                    <span className='text-[13px] font-bold tracking-[0.2em] mt-1.5 uppercase text-sdp-theme-accent-primary'>Compartir novetats</span>
                                </div>
                            </button>

                            <button className="w-full flex items-center p-4 border border-theme-border rounded-[28px] bg-theme-panel/50 hover:bg-theme-panel hover:border-theme-text/20 transition-all group active:scale-[0.98] shadow-sm" onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else setIsMarketModalOpen(true);
              }}>
                                <div className="w-12 h-12 rounded-[18px] bg-black/5 dark:bg-white/5 text-theme-text/80 group-hover:bg-theme-text group-hover:text-theme-base flex items-center justify-center shrink-0 transition-colors">
                                    <Store size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-theme-text ml-5 opacity-90 group-hover:opacity-100">Vendre al Mercat</span>
                            </button>

                            <button className="w-full flex items-center p-4 border border-theme-border rounded-[28px] bg-theme-panel/50 hover:bg-theme-panel hover:border-theme-text/20 transition-all group active:scale-[0.98] shadow-sm" onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else setIsEventModalOpen(true);
              }}>
                                <div className="w-12 h-12 rounded-[18px] bg-black/5 dark:bg-white/5 text-theme-text/80 group-hover:bg-theme-text group-hover:text-theme-base flex items-center justify-center shrink-0 transition-colors">
                                    <Calendar size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-theme-text ml-5 opacity-90 group-hover:opacity-100">Crear Esdeveniment</span>
                            </button>

                            <button className="w-full flex items-center p-4 border border-theme-border rounded-[28px] bg-theme-panel/50 hover:bg-theme-panel hover:border-theme-text/20 transition-all group active:scale-[0.98] shadow-sm" onClick={() => navigate('/mapa')}>
                                <div className="w-12 h-12 rounded-[18px] bg-black/5 dark:bg-white/5 text-theme-text/80 group-hover:bg-theme-text group-hover:text-theme-base flex items-center justify-center shrink-0 transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-theme-text ml-5 opacity-90 group-hover:opacity-100">Veure Mapes</span>
                            </button>
                        </div>
                    </div>

                    {/* SECONDARY RESOURCES - Tools for the Mas */}
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-theme-text/40 mb-4 pl-2">Recursos i Eines</h2>
                        
                        <div className="mb-3">
                            <button className="w-full h-full flex items-center justify-start gap-3 p-4 border border-theme-border rounded-[24px] bg-theme-panel/50 hover:bg-theme-panel transition-all group active:scale-95 shadow-sm" onClick={() => navigate('/chats/11111111-0000-0000-0000-000000000000')}>
                                <div className="w-12 h-12 rounded-[20px] bg-[#0ea5e9]/10 text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white flex items-center justify-center transition-colors shadow-sm shrink-0">
                                    <Bot size={24} />
                                </div>
                                <div className="flex flex-col items-start font-black text-sm uppercase tracking-tight pt-0.5">
                                    <span className="text-xs tracking-[0.3em] leading-none mb-1.5 text-[#0ea5e9]">Canal Directe</span>
                                    <span className="font-sans text-base leading-none text-left text-theme-text font-black tracking-widest opacity-90">Missatges per a dubtes</span>
                                </div>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button intent="secondary" size="lg" fullWidth leftIcon={<StickyNote size={20} className="text-yellow-500" />} onClick={() => navigate('/notes')} className="min-h-[56px] justify-start rounded-[24px] font-sans text-base font-black uppercase tracking-widest text-theme-text bg-theme-panel/50 border border-theme-border hover:bg-theme-panel shadow-sm">
                                Bloc de Notes
                            </Button>

                            <Button intent="canonic" size="lg" fullWidth leftIcon={<Shield size={24} />} onClick={() => navigate('/el-projecte')} className="min-h-[64px] rounded-[24px] font-sans text-xl font-black uppercase tracking-widest mt-2 shadow-md hover:scale-[1.02] transition-transform">
                                EL PROJECTE
                            </Button>

                            {isSuperAdmin && <Button intent="ghost" size="lg" fullWidth leftIcon={<Cpu size={24} />} onClick={() => navigate('/ofici')} className="min-h-[56px] rounded-[24px] font-sans text-base font-black uppercase tracking-widest text-theme-text/60 hover:text-theme-text">
                                    SISTEMA OPERATIU
                                </Button>}
                        </div>
                    </div>

                    {/* ADMIN SECTOR */}
                    <div className="pt-6 border-t border-theme-border space-y-3">
                        {(isSuperAdmin || isAdmin) && <Button intent="danger" fullWidth leftIcon={<Shield size={18} />} onClick={() => navigate('/admin')} className="min-h-[56px] rounded-[28px] font-sans text-base font-black uppercase tracking-widest">
                                Administració
                            </Button>}

                        <Button intent="ghost" fullWidth leftIcon={<LogOut size={16} />} onClick={() => {
              logout();
              navigate('/');
            }} className="min-h-[56px] rounded-[28px] font-sans text-base font-black uppercase tracking-widest text-theme-text/40 hover:text-red-500 bg-transparent hover:bg-red-500/10 transition-colors">
                            Eixir del Poble
                        </Button>
                    </div>

                </div>
            </div>
  );
};
export default HubView;import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Globe, Sprout, Home, Landmark, Bot, ArrowLeft, Search, Sparkles, Maximize2, ChevronRight, X } from 'lucide-react';
import { useNavigation } from '../../app/context/NavigationContext';
import "./OficiDocumentacio.css";
const OficiDocumentacio = () => {
  const navigate = useNavigate();
  const {
    openIAIASidebar
  } = useNavigation();
  const {
    id
  } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tramitParam = queryParams.get("tramit");
  const {
    iaiaSidebarOpen
  } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);
  const documentCategories = [{
    id: "associacions",
    title: "Associacions i Identitat",
    icon: <Globe className="cat-icon w-5 h-5" />,
    color: "#3B82F6",
    image: "/assets/brand/nanobanana-asso-identity-1772350128114.png",
    description: "Registre internacional DUNS/ISSN i tràmits associatius.",
    procedures: [{
      id: "iaia-navigator-flow",
      title: "IAIA Navigator (Tràmit Assistit)",
      status: "active",
      official_code: "INT-NAV"
    }, {
      id: "duns-request",
      title: "Sol·licitud de Número DUNS",
      status: "active",
      official_code: "DNB-INT"
    }, {
      id: "estatuts-review",
      title: "Revisió d'Estatuts per l'IAIA",
      status: "coming-soon"
    }]
  }, {
    id: "agricultura",
    title: "Agricultura i Camp",
    icon: <Sprout className="cat-icon w-5 h-5" />,
    color: "#22c55e",
    image: "/assets/brand/nanobanana-agro-camp-1772350140809.png",
    description: "Ajudes de la PAC, Xylella, cremes i pous.",
    procedures: [{
      id: "xylella-fastidiosa",
      title: "Ayudes Xylella Fastidiosa (Seguiment)",
      status: "active",
      official_code: "18932"
    }, {
      id: "crema-restes",
      title: "Permís de Crema de Restes (Tramitar)",
      status: "active",
      official_code: "CRM-2026"
    }]
  }, {
    id: "vivenda",
    title: "Venda i Urbanisme",
    icon: <Home className="cat-icon w-5 h-5" />,
    color: "#3b82f6",
    image: "/assets/brand/nanobanana-urban-venda-1772350155362.png",
    description: "Certificats, llicències d'obra i IBI.",
    procedures: [{
      id: "cedula-vivienda",
      title: "Cèdula d'Habitabilitat",
      status: "coming-soon"
    }]
  }, {
    id: "bancari",
    title: "Banc i Hisenda",
    icon: <Landmark className="cat-icon w-5 h-5" />,
    color: "#f59e0b",
    image: "/assets/brand/nanobanana-banc-hisenda-1772350168169.png",
    description: "Domiciliacions, impostos i tràmits bancaris.",
    procedures: [{
      id: "domiciliacio-bancaria",
      title: "Model de Domiciliació Bancària",
      status: "active"
    }, {
      id: "solicitud-general-ajuntament",
      title: "Sol·licitud General (PDF Emplenable)",
      status: "active",
      official_code: "GEN-01"
    }]
  }, {
    id: "kit-digital",
    title: "Kit Digital (Govern)",
    icon: <Bot className="cat-icon w-5 h-5" />,
    color: "#FF6D23",
    image: "/assets/brand/nanobanana-kit-digital-1772350182419.png",
    description: "Ajudes per a la digitalització (PIMES i Autònoms).",
    procedures: [{
      id: "kit-digital-solicitud",
      title: "Gestió de Documents Kit Digital",
      status: "active",
      official_code: "KD-2024"
    }]
  }, {
    id: "herencia",
    title: "Herència i Successions",
    icon: <Landmark className="cat-icon w-5 h-5" />,
    color: "#D946EF",
    image: "/assets/brand/nanobanana-herencia-1772350195319.png",
    description: "Protocol Notarial 1911/2024 (Herència).",
    procedures: [{
      id: "herencia",
      title: "Tramitació d'Herència (Assisència IAIA)",
      status: "active",
      official_code: "HP-2026"
    }]
  }];
  const filteredCategories = documentCategories.filter(cat => cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || cat.procedures.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())));

  // Procedure Flows Blocks...
  // Aquests tràmits s'han migrat a rutes dinàmiques /ofici/:tramit amb l'arquitectura UniversalDetail.

  return (
    <div className={`ofici-page bg-theme-base min-h-screen animate-in transition-all duration-500 ${iaiaSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Header Area */}
        <div className='px-6 md:px-12 pt-12 pb-8 sticky top-0 bg-theme-base/90 backdrop-blur-xl z-20 border-b border-sdp-border-master'>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className='p-3 bg-sdp-bg-panel hover:brightness-110 text-theme-text border-sdp-border-master rounded-full transition-colors border' title="Tornar deixant les eines a la taula">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-theme-text drop-shadow-md flex items-center gap-2">
                  Ofici de Documentació 
                  <span className="bg-orange-600 text-xs px-2 py-1 rounded-sm leading-none ml-2 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]">BETA</span>
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mt-1">
                  Eines i Procediments Administratius d'Alta Tensió
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
               <div className="relative group w-full lg:w-80">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" placeholder="Què vols gestionar hui?" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='w-full bg-sdp-bg-panel border-sdp-border-master text-theme-text focus:brightness-110 border rounded-[28px] py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500/50 transition-all placeholder:opacity-50 uppercase tracking-widest' />
              </div>
              <button onClick={() => navigate("/buscador-ajudes")} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-[28px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0">
                <Sparkles size={18} />
                <span className="hidden md:inline">Subvencions</span>
              </button>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCategories.map(category => <div key={category.id} className='relative group rounded-[32px] overflow-hidden bg-theme-panel border border-sdp-border-master hover:shadow-2xl transition-all hover:-translate-y-2 duration-500 flex flex-col h-full'>
                {/* Card Image Area with NanoBanana Art */}
                <div className='relative h-56 w-full shrink-0 overflow-hidden bg-sdp-bg-app border-b border-sdp-border-master'>
                   <img src={category.image} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                   <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sdp-bg-panel via-sdp-bg-panel/80 to-transparent pointer-events-none'></div>
                   {/* NanoBanana Signature Overlay */}
                   <div className="absolute top-4 right-4 glass-panel px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-theme-text opacity-50 pointer-events-none">
                       Autor: NanoBanana
                   </div>
                   {/* Lightbox Trigger */}
                   <button onClick={() => setLightboxImage(category.image)} className="absolute top-4 left-4 p-2 glass-panel rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-theme-text hover:brightness-125" title="Veure Art en Gran">
                      <Maximize2 size={16} />
                   </button>
                </div>

                {/* Card Body */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col relative z-10 -mt-12">
                   <div className="flex items-center gap-3 mb-4">
                       <div className='w-12 h-12 rounded-xl border border-sdp-border-master bg-sdp-bg-app flex items-center justify-center shadow-lg' style={{
                  color: category.color
                }}>
                           {category.icon}
                       </div>
                       <h3 className="text-xl sm:text-2xl font-black text-theme-text leading-tight uppercase tracking-tight flex-1">
                          {category.title}
                       </h3>
                   </div>
                   <p className="text-sm text-theme-text opacity-70 font-medium mb-6 flex-1">
                      {category.description}
                   </p>

                   {/* Procedures List */}
                   <div className="flex flex-col gap-2 w-full mt-auto">
                        {category.procedures.map(proc => <button key={proc.id} className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all border ${proc.status === "active" ? "bg-[var(--bg-app)] border-[var(--border-master)] hover:bg-[var(--bg-panel)] text-theme-text cursor-pointer" : "bg-[var(--bg-app)] opacity-50 border-transparent text-theme-text cursor-not-allowed"}`} onClick={() => {
                  if (proc.status === "active") {
                    navigate(`/ofici/${proc.id}`);
                  }
                }}>
                            <div className="flex flex-col pr-4 min-w-0 flex-1">
                              <span className="text-sm font-bold truncate block w-full">{proc.title}</span>
                              {proc.official_code && <span className="text-xs font-black uppercase tracking-widest text-[#FF6D23] mt-1 opacity-80 block truncate">
                                  Codi: {proc.official_code}
                                </span>}
                            </div>
                            {proc.status === "active" ? <ChevronRight size={18} className="shrink-0 text-theme-text opacity-50" /> : <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm bg-black/10 dark:bg-white/10 text-theme-text opacity-60">
                                Pròxim
                              </span>}
                          </button>)}
                   </div>
                </div>
              </div>)}
          </div>
        </section>

        {/* NanoBanana Image Lightbox Overlay */}
        {lightboxImage && <div className="fixed inset-0 z-dropdown bg-theme-base/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
                <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 p-4 rounded-full transition-colors border z-10 glass-panel hover:brightness-110 text-theme-text">
                    <X size={24} />
                </button>
                <div className='relative w-full max-w-5xl md:h-[80vh] flex flex-col items-center justify-center rounded-[40px] overflow-hidden border border-sdp-border-master bg-theme-panel shadow-2xl'>
                    <img src={lightboxImage} alt="Premium Art" className="w-full h-full object-contain" />
                    <div className="absolute bottom-6 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest glass-panel text-theme-text text-opacity-70">
                       Gènesi Art / Autor: NanoBanana
                   </div>
                </div>
            </div>}

      </div>
  );
};
export default OficiDocumentacio;import React from "react";
const laws = [{
  icon: "🪨",
  title: "Respecte al Lloc",
  text: "Cada component viu al seu lloc. No el mogues amb transforms que trenquen la vista."
}, {
  icon: "🎨",
  title: "Una Font, Una Veritat",
  text: "Colors, mides i corbes venen d'un sol fitxer de tokens."
}, {
  icon: "🤫",
  title: "No Robis el Focus",
  text: "Les notificacions han d'anunciar-se amb cura; no interrompre sense motiu."
}, {
  icon: "🩸",
  title: "La Cicatriu d'Or",
  text: "No amaguem els errors baix l'estora. Les cicatrius sanen amb or (Kintsugi)."
}, {
  icon: "👁️",
  title: "Transparència i Control",
  text: "Si recordem alguna cosa sobre tu, t'ho diem i et donem control total."
}, {
  icon: "🌾",
  title: "Trellat per Defecte",
  text: "Simplicitat, semàntica i accessibilitat són l'únic camí vàlid."
}];
export default function LawsGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {laws.map((l, i) => <article key={i} className='law-card bg-sdp-sdp-bg-surface p-8 rounded-2xl border border-sdp-color-brasa/30 hover:border-sdp-color-brasa transition-all duration-300 shadow-sm fade-in-up group' tabIndex={0}>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{l.icon}</div>
            <h3 className="font-bold text-xl mb-3 text-white">{l.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{l.text}</p>
          </article>)}
      </div>
  );
}import { Sprout, Tractor, PackageCheck, Flame, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import UniversalPage from './UniversalPage';
import { roadmapData } from '../../data/roadmapData';

// Extracció ordenada i timeline grouping
const allTasks = [...roadmapData.production, ...roadmapData.done, ...roadmapData.dev, ...roadmapData.backlog].sort((a, b) => a.date.localeCompare(b.date));
const groupedByQuarter = allTasks.reduce((acc, task) => {
  if (!acc[task.date]) acc[task.date] = [];
  acc[task.date].push(task);
  return acc;
}, {});
const quarters = Object.keys(groupedByQuarter).sort();
const BoardColumn = ({
  title,
  icon: Icon,
  items,
  colorClass
}) => <div className='flex-1 min-w-[320px] max-w-md w-full bg-sdp-bg-panel border border-sdp-border-master rounded-xl p-4 flex flex-col gap-4 contain-layout'>
    <div className={`flex items-center gap-2 border-b-2 pb-3 mb-1 ${colorClass}`}>
      <Icon size={22} className="shrink-0" />
      <h2 className="text-xl font-bold uppercase m-0 leading-none">{title}</h2>
      <span className='ml-auto bg-sdp-text-main/10 px-2 py-0.5 rounded-full text-sm font-bold opacity-70'>
        {items.length}
      </span>
    </div>
    
    <div className="flex flex-col gap-3 stable-scroll pb-2 z-token-base">
      {items.map(item => {
      const ItemIcon = item.icon;
      return (
        <div key={item.id} className='universal-card hover:scale-[1.01] transition-transform cursor-default group relative overflow-hidden bg-sdp-bg-app border border-sdp-border-master'>
            <div className='absolute top-0 left-0 w-1 h-full bg-sdp-theme-accent-primary opacity-50' />
            
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black tracking-widest uppercase opacity-60 flex items-center gap-1.5 line-clamp-1">
                <Calendar size={12} className="shrink-0" /> {item.date}
              </span>
              <div className='flex bg-sdp-theme-accent-primary/10 px-2 py-1 rounded gap-1 items-center'>
                <Tag size={12} className='text-sdp-theme-accent-primary shrink-0' />
                <span className='text-xs uppercase font-bold text-sdp-theme-accent-primary text-center line-clamp-1 leading-none'>{item.category}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 mt-1">
              <div className='p-2 bg-sdp-bg-panel rounded-[10px] border border-sdp-border-master shrink-0 mt-0.5 text-sdp-theme-accent-secondary'>
                <ItemIcon size={20} strokeWidth={2.5} />
              </div>
              <div>
                <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline">
                  <h3 className='font-bold text-[1.05rem] leading-tight mb-2 text-sdp-text-main group-hover:text-sdp-theme-accent-primary transition-colors'>{item.title}</h3>
                </Link>
                <p className='text-[13px] opacity-70 leading-snug m-0 text-sdp-text-muted text-pretty'>
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
      );
    })}
    </div>
  </div>;
const CalendarGanttView = () => <div className="w-full h-full flex flex-col gap-8 md:gap-14 pb-12 align-top">
    {quarters.map(q => <div key={q} className="relative w-full flex flex-col md:flex-row gap-4 lg:gap-8 items-start group">
        
        {/* Timeline Axis (Q) */}
        <div className='md:w-32 lg:w-40 shrink-0 sticky top-0 md:top-4 z-10 bg-sdp-bg-panel/95 backdrop-blur-md md:bg-transparent py-2 border-b md:border-b-0 border-sdp-theme-accent-primary md:border-r-4 pr-4'>
          <div className="flex p-3 rounded-lg md:rounded-none bg-transparent items-center gap-3">
             <div className='w-3 h-3 rounded-full bg-sdp-theme-accent-primary -ml-2 shrink-0 md:block hidden outline outline-4 outline-sdp-bg-panel shadow-md' />
             <h3 className="font-black text-2xl tracking-tighter uppercase flex-1 text-left md:text-right m-0 flex items-center justify-start md:justify-end gap-2">
              <Calendar size={20} className="md:hidden" /> {q.replace('-', ' ')}
             </h3>
          </div>
        </div>

        {/* Task Nodes Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 lg:gap-6 mt-1 relativerounded-xl">
           
           {groupedByQuarter[q].map(item => {
        const ItemIcon = item.icon;
        const statusColor = roadmapData.production.some(d => d.id === item.id) ? "border-purple-500/40 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : roadmapData.done.some(d => d.id === item.id) ? "border-green-500/20 bg-green-500/5" : roadmapData.dev.some(d => d.id === item.id) ? "border-blue-500/20 bg-blue-500/5" : "border-orange-500/20 bg-orange-500/5";
        return (
          <div key={item.id} className={`flex flex-col universal-card border-[2px] ${statusColor} hover:scale-[1.02] active:scale-[0.98] transition-transform bg-sdp-bg-panel relative overflow-hidden`}>
                   {roadmapData.production.some(d => d.id === item.id) && <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-widest z-10 animate-pulse">
                           ACTIU
                       </div>}
                   <div className='flex items-center gap-3 border-b border-sdp-border-master pb-3'>
                      <div className={`bg-sdp-bg-app p-2.5 rounded-[12px] shrink-0 border border-sdp-border-master`}>
                        <ItemIcon size={24} className='text-sdp-text-main opacity-70' />
                      </div>
                      <div className="flex-1">
                        <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline">
                          <h4 className='font-bold text-[1.1rem] leading-tight m-0 text-sdp-text-main'>{item.title}</h4>
                        </Link>
                        <div className='text-xs mt-1.5 font-black text-sdp-theme-accent-secondary uppercase tracking-widest'>{item.category}</div>
                      </div>
                   </div>
                   <p className='text-[13px] opacity-80 mt-3 flex-1 flex items-start text-sdp-text-muted leading-relaxed font-medium'>
                     {item.desc}
                   </p>
                   <div className='mt-4 pt-2 border-t border-sdp-border-master flex gap-2 overflow-hidden flex-wrap max-h-5 sm:max-h-screen'>
                      <span className='text-[9px] uppercase tracking-wider font-extrabold text-sdp-text-muted line-clamp-1'>{item.tags.join(' • ')}</span>
                   </div>
                </div>
        );
      })}
        </div>
      </div>)}
  </div>;
const ListView = () => <div className='w-full max-w-4xl mx-auto pb-12 mt-4 text-sdp-text-main'>
        {roadmapData.production.length > 0 && <>
                <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-purple-500/90 border-b border-purple-500/20 pb-3 flex items-center gap-2">
                    <Flame size={24} /> En Producció
                </h2>
                <ul className="list-disc pl-6 mb-10 space-y-4">
                    {roadmapData.production.map(item => <li key={item.id}>
                            <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                        </li>)}
                </ul>
            </>}

        <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-green-500/90 border-b border-green-500/20 pb-3 flex items-center gap-2">
            <PackageCheck size={24} /> Collita Tancada (Fet)
        </h2>
        <ul className="list-disc pl-6 mb-10 space-y-4">
            {roadmapData.done.map(item => <li key={item.id}>
                    <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                </li>)}
        </ul>

        <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-blue-500/90 border-b border-blue-500/20 pb-3 flex items-center gap-2">
            <Tractor size={24} /> Sementeres Vives (Beta)
        </h2>
        <ul className="list-disc pl-6 mb-10 space-y-4">
            {roadmapData.dev.map(item => <li key={item.id}>
                    <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                </li>)}
        </ul>

        <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-orange-500/90 border-b border-orange-500/20 pb-3 flex items-center gap-2">
            <Sprout size={24} /> Llavors (Totes les Idees)
        </h2>
        <ul className="list-disc pl-6 mb-10 space-y-4">
            {roadmapData.backlog.map(item => <li key={item.id}>
                    <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                </li>)}
        </ul>
    </div>;
export const RoadmapView = () => {
  return (
    <UniversalPage standAlone={true} forcedTitle="Les 40 Fites" forcedSubtitle="La Matriu de Llavors" forcedHeroImage="/assets/uploads/brain/thermodynamics_ai_hardware_1775882083812.png" defaultViewMode="document" renderKanban={() => <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start w-full relative overflow-x-auto custom-scrollbar pb-6 px-4 h-full">
              <BoardColumn title="En Producció" icon={Flame} items={roadmapData.production} colorClass="border-purple-500/30 text-purple-500 border-b-[3px]" />
              <BoardColumn title="Llavors (Tot)" icon={Sprout} items={roadmapData.backlog} colorClass="border-orange-500/20 text-orange-500/80 border-b-[3px]" />
              <BoardColumn title="Sementeres" icon={Tractor} items={roadmapData.dev} colorClass="border-blue-500/20 text-blue-500/80 border-b-[3px]" />
              <BoardColumn title="Fet" icon={PackageCheck} items={roadmapData.done} colorClass="border-green-500/20 text-green-500/80 border-b-[3px]" />
            </div>} renderCalendar={() => <CalendarGanttView />}>
          <div className="mb-8">
              <p className='text-base sm:text-lg lg:text-xl font-medium leading-relaxed mt-4 opacity-70 text-sdp-text-main text-pretty'>
                  L'auditoria històrica més gran del Mas fins avui. Totes les línies, idees y mecàniques burocràtiques o P2P que asseient l'abans i el després de <strong>Sóc de Poble</strong> cap al <span className='text-sdp-theme-accent-primary font-bold'>Rescat de la Ruralitat</span> i la Sobirania Ciutadana.
              </p>
          </div>
          <ListView />
      </UniversalPage>
  );
};
export default RoadmapView;