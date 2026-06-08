import React from 'react';

export default function DesignSystem() {
  return (
    <main className="sosp-design-system max-w-5xl mx-auto p-6 pb-24">

      {/* ====================================================== */}
      {/* CAPÇALERA DEL SISTEMA                                  */}
      {/* ====================================================== */}
      <header className="mb-12 border-b-2 border-stone-300 pb-6">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">
          Sistema de Disseny Sóc de Poble
        </h1>
        <p className="text-lg text-stone-600">
          Arquitectura Pedra Seca per a interfícies que han de funcionar a ple sol
          en un iPad A10 amb gent major que mira de prop.
        </p>
        <div className="mt-4 flex gap-4 text-sm text-stone-500">
          <span>🎯 Filosofia: Trellat</span>
          <span>📐 Base: 1rem = 16px</span>
          <span>♿ WCAG 2.1 AA</span>
          <span>📱 iOS Safari 14+</span>
        </div>
      </header>

      {/* ====================================================== */}
      {/* SECCIÓ 1: PALETA CROMÀTICA                             */}
      {/* ====================================================== */}
      <section className="mb-16" id="paleta">
        <h2 className="sosp-h2 mb-6">1. Paleta Cromàtica</h2>

        <h3 className="sosp-h3 mb-4">Colors Primaris</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#8B4513] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Petorreta</p>
              <p className="text-xs text-gray-500">--color-petorreta</p>
              <p className="text-xs font-mono mt-1">#8B4513</p>
            </div>
          </div>
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#A0522D] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Terra</p>
              <p className="text-xs text-gray-500">--color-terra</p>
              <p className="text-xs font-mono mt-1">#A0522D</p>
            </div>
          </div>
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#78716C] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Pedra</p>
              <p className="text-xs text-gray-500">--color-pedra</p>
              <p className="text-xs font-mono mt-1">#78716C</p>
            </div>
          </div>
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#2D5A3D] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Serra</p>
              <p className="text-xs text-gray-500">--color-serra</p>
              <p className="text-xs font-mono mt-1">#2D5A3D</p>
            </div>
          </div>
        </div>

        <h3 className="sosp-h3 mb-4">Colors de Suport</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#87CEEB] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Cel SOSP</p>
              <p className="text-xs text-gray-500">--color-cel</p>
              <p className="text-xs font-mono mt-1">#87CEEB</p>
            </div>
          </div>
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#DC2626] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Alerta</p>
              <p className="text-xs text-gray-500">--color-alerta</p>
              <p className="text-xs font-mono mt-1">#DC2626</p>
            </div>
          </div>
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#F59E0B] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Avís</p>
              <p className="text-xs text-gray-500">--color-avis</p>
              <p className="text-xs font-mono mt-1">#F59E0B</p>
            </div>
          </div>
          <div className="sosp-color-swatch">
            <div className="h-20 bg-[#16A34A] rounded-t" />
            <div className="p-3 bg-white border border-t-0 rounded-b">
              <p className="font-bold text-sm">Èxit</p>
              <p className="text-xs text-gray-500">--color-exit</p>
              <p className="text-xs font-mono mt-1">#16A34A</p>
            </div>
          </div>
        </div>

        <h3 className="sosp-h3 mb-4">Escala de Grisos</h3>
        <div className="flex flex-col gap-2 mb-8">
          {[
            { name: 'Negre', class: 'bg-stone-950', hex: '#0C0A09' },
            { name: 'Carbó', class: 'bg-stone-900', hex: '#1C1917' },
            { name: 'Pissarra', class: 'bg-stone-800', hex: '#292524' },
            { name: 'Grafit', class: 'bg-stone-700', hex: '#44403C' },
            { name: 'Pedra fosca', class: 'bg-stone-600', hex: '#57534E' },
            { name: 'Pedra', class: 'bg-stone-500', hex: '#78716C' },
            { name: 'Cendra', class: 'bg-stone-400', hex: '#A8A29E' },
            { name: 'Calç', class: 'bg-stone-300', hex: '#D6D3D1' },
            { name: 'Arena', class: 'bg-stone-200', hex: '#E7E5E4' },
            { name: 'Núvol', class: 'bg-stone-100', hex: '#F5F5F4' },
            { name: 'Blanc trencat', class: 'bg-stone-50', hex: '#FAFAF9' },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <div className={\`w-12 h-12 rounded \${c.class} border border-stone-300\`} />
              <div>
                <p className="font-bold text-sm">{c.name}</p>
                <p className="text-xs text-gray-500 font-mono">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* SECCIÓ 2: TIPOGRAFIA                                   */}
      {/* ====================================================== */}
      <section className="mb-16" id="tipografia">
        <h2 className="sosp-h2 mb-6">2. Tipografia</h2>

        <div className="sosp-card p-6 mb-6">
          <p className="text-sm text-gray-500 mb-4">Família: Inter (Google Fonts) — Fallback: system-ui, sans-serif</p>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">H1 — Títol de pàgina</p>
              <h1 className="text-4xl font-bold text-stone-900">El poble que no es rendeix</h1>
              <p className="text-xs text-gray-400 mt-1">4xl (2.25rem / 36px) · Bold · Line-height 1.1 · Tracking tight</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">H2 — Secció</p>
              <h2 className="text-3xl font-bold text-stone-900">Història i memòria</h2>
              <p className="text-xs text-gray-400 mt-1">3xl (1.875rem / 30px) · Bold · Line-height 1.2</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">H3 — Subsecció</p>
              <h3 className="text-2xl font-semibold text-stone-800">Arrels del passat</h3>
              <p className="text-xs text-gray-400 mt-1">2xl (1.5rem / 24px) · Semibold · Line-height 1.3</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">H4 — Títol de targeta</p>
              <h4 className="text-xl font-semibold text-stone-800">Festes locals</h4>
              <p className="text-xs text-gray-400 mt-1">xl (1.25rem / 20px) · Semibold · Line-height 1.4</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cos — Paràgraf</p>
              <p className="text-base text-stone-700 leading-relaxed">
                El text de cos és la columna vertebral de tota lectura. Ha de ser còmode,
                amb interlineat generós (1.625) i mida base de 1rem (16px). Mai per sota de 16px en mòbil.
              </p>
              <p className="text-xs text-gray-400 mt-1">base (1rem / 16px) · Regular · Line-height 1.625</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Peu — Caption</p>
              <p className="text-sm text-stone-500">Meta-dades, peus de foto, etiquetes secundàries.</p>
              <p className="text-xs text-gray-400 mt-1">sm (0.875rem / 14px) · Regular · Line-height 1.5</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Etiqueta — Label</p>
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">Codi o etiqueta</span>
              <p className="text-xs text-gray-400 mt-1">xs (0.75rem / 12px) · Mono · Line-height 1.5</p>
            </div>
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
            {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24].map((n) => (
              <div key={n} className="flex items-center gap-4">
                <div className="h-4 bg-[#8B4513] rounded" style={{ width: \`\${n * 4}px\` }} />
                <span className="text-sm text-gray-600 font-mono">{n} unitats = {n * 4}px</span>
              </div>
            ))}
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
          <button className="sosp-btn sosp-btn-primari sosp-loading">Carregant...</button>
          <button className="sosp-btn sosp-btn-primari focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513]">Focus</button>
        </div>

        <h3 className="sosp-h3 mb-4">Amb icona</h3>
        <div className="flex flex-wrap gap-4">
          <button className="sosp-btn sosp-btn-primari flex items-center gap-2">
            <span>➕</span> Afegir
          </button>
          <button className="sosp-btn sosp-btn-secundari flex items-center gap-2">
            <span>🗑️</span> Eliminar
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
            <input
              id="demo-input"
              type="text"
              className="sosp-input"
              placeholder="Ex: Petrer"
            />
          </div>

          <div>
            <label htmlFor="demo-select" className="sosp-label">Província</label>
            <select id="demo-select" className="sosp-select">
              <option>Alacant</option>
              <option>València</option>
              <option>Castelló</option>
            </select>
          </div>

          <div>
            <label htmlFor="demo-textarea" className="sosp-label">Descripció</label>
            <textarea
              id="demo-textarea"
              className="sosp-textarea"
              rows={4}
              placeholder="Escriu una breu descripció..."
            />
          </div>

          <div className="flex items-start gap-2">
            <input id="demo-check" type="checkbox" className="sosp-checkbox mt-1" />
            <label htmlFor="demo-check" className="text-sm text-stone-700">
              Accepte els termes del Consell de la Petorreta
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="demo-radio" className="sosp-radio" defaultChecked />
              <span className="text-sm text-stone-700">Opció A</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="demo-radio" className="sosp-radio" />
              <span className="text-sm text-stone-700">Opció B</span>
            </label>
          </div>

          <div>
            <label className="sosp-label">Input amb error</label>
            <input
              type="text"
              className="sosp-input sosp-input-error"
              defaultValue="valor incorrecte"
            />
            <p className="sosp-text-error mt-1">Aquest camp és obligatori.</p>
          </div>

          <div>
            <label className="sosp-label">Input desactivat</label>
            <input
              type="text"
              className="sosp-input"
              disabled
              defaultValue="No editable"
            />
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
            <div className="bg-[#8B4513] p-4">
              <h3 className="text-lg font-bold text-white">Targeta amb capçalera</h3>
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
          <article className="sosp-card border-l-4 border-l-[#2D5A3D]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#2D5A3D]">ℹ️</span>
                <h3 className="text-lg font-bold text-stone-900">Targeta d'informació</h3>
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
              <p className="font-bold">Informació</p>
              <p className="text-sm">Aquesta és una alerta informativa per a destacar dades rellevants.</p>
            </div>
          </div>

          <div className="sosp-alert sosp-alert-success">
            <span className="sosp-alert-icon">✅</span>
            <div>
              <p className="font-bold">Èxit</p>
              <p className="text-sm">L'operació s'ha completat correctament.</p>
            </div>
          </div>

          <div className="sosp-alert sosp-alert-warning">
            <span className="sosp-alert-icon">⚠️</span>
            <div>
              <p className="font-bold">Avís</p>
              <p className="text-sm">Revisa els camps abans de continuar.</p>
            </div>
          </div>

          <div className="sosp-alert sosp-alert-error">
            <span className="sosp-alert-icon">🚨</span>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">No s'ha pogut connectar amb el servidor.</p>
            </div>
          </div>
        </div>

        <h3 className="sosp-h3 mb-4">Toast / Notificació flotant</h3>
        <div className="relative h-32 bg-stone-100 rounded p-4 mb-4">
          <div className="sosp-toast sosp-toast-success absolute top-4 right-4">
            <span>✅</span>
            <span className="text-sm">Canvis guardats</span>
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
          <div className="flex items-center gap-6">
            <a href="#" className="sosp-nav-logo">Sóc de Poble</a>
            <div className="flex gap-4">
              <a href="#" className="sosp-nav-link sosp-nav-link-active">Inici</a>
              <a href="#" className="sosp-nav-link">Pobles</a>
              <a href="#" className="sosp-nav-link">Arxiu</a>
              <a href="#" className="sosp-nav-link">Contacte</a>
            </div>
          </div>
        </nav>

        <h3 className="sosp-h3 mb-4">Breadcrumbs</h3>
        <nav className="sosp-breadcrumbs mb-8" aria-label="Navegació d'embolcall">
          <ol className="flex gap-2 text-sm">
            <li><a href="#" className="text-[#8B4513] hover:underline">Inici</a></li>
            <li className="text-stone-400">/</li>
            <li><a href="#" className="text-[#8B4513] hover:underline">Pobles</a></li>
            <li className="text-stone-400">/</li>
            <li className="text-stone-600">Petrer</li>
          </ol>
        </nav>

        <h3 className="sosp-h3 mb-4">Paginació</h3>
        <nav className="sosp-pagination" aria-label="Paginació">
          <button className="sosp-pagination-btn" disabled>← Anterior</button>
          <button className="sosp-pagination-btn sosp-pagination-active">1</button>
          <button className="sosp-pagination-btn">2</button>
          <button className="sosp-pagination-btn">3</button>
          <span className="sosp-pagination-ellipsis">...</span>
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
          <div className="sosp-modal-overlay absolute inset-0 flex items-center justify-center bg-black/50 rounded">
            <div className="sosp-modal bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Confirmar eliminació
                </h3>
                <p className="text-stone-600 mb-6">
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
        <h2 className="sosp-h2 mb-6">12. Indicadors de Càrrega</h2>

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

        <h3 className="sosp-h3 mb-4">Imatge amb ratio fix</h3>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div className="aspect-video bg-stone-200 rounded flex items-center justify-center text-stone-400 text-sm">
            16:9
          </div>
          <div className="aspect-square bg-stone-200 rounded flex items-center justify-center text-stone-400 text-sm">
            1:1
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
              <span>Què és Sóc de Poble?</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-stone-600 text-sm">
              Sóc de Poble és una plataforma dedicada a preservar la memòria digital
              dels pobles valencians, lluitant contra l'obsolescència tecnològica.
            </p>
          </details>
          <details className="group p-4">
            <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-stone-800">
              <span>Com puc col·laborar?</span>
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
          <div className="flex border-b border-stone-200">
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
              <div className="sosp-progress-fill" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-stone-700">Indexació de documents</span>
              <span className="text-sm text-stone-500">78%</span>
            </div>
            <div className="sosp-progress-bar">
              <div className="sosp-progress-fill bg-[#2D5A3D]" style={{ width: '78%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-stone-700">Procés completat</span>
              <span className="text-sm text-stone-500">100%</span>
            </div>
            <div className="sosp-progress-bar">
              <div className="sosp-progress-fill bg-[#16A34A]" style={{ width: '100%' }} />
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
              <li>Plànols urbanístics</li>
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
            <p className="text-sm text-gray-500 mb-2">Divisor horitzontal</p>
            <hr className="sosp-divider" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Divisor amb text</p>
            <div className="sosp-divider-with-text">
              <span>o bé</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Espaiador vertical</p>
            <div className="h-8 bg-stone-100 rounded flex items-center justify-center text-xs text-stone-400">
              Espai de 2rem (32px)
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
