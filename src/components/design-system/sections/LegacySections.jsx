import React from 'react';

export function LegacySections() {
  return (
    <>
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
              <span>o bé</span>
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
              <div className="sosp-progres-barra" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">20.2 Barra de progrés amb etiqueta</p>
            <div className="sosp-progres sosp-progres-amb-etiqueta">
              <div className="sosp-progres-cap">
                <span>Carregant mapa de la comarca...</span>
                <span>65%</span>
              </div>
              <div className="sosp-progres-barra-fons">
                <div className="sosp-progres-barra" style={{ width: '65%' }}></div>
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

          <div>
            <p className="text-sm text-gray-500 mb-4">24.5 Targeta de Botiga (Samarreta)</p>
            <article className="sosp-targeta sosp-targeta-amb-imatge max-w-sm bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <figure className="sosp-targeta-imatge bg-stone-100 aspect-square flex items-center justify-center p-4">
                <img src="/assets/uploads/empresa/soc-de-poble/mercat/samarreta-soc-de-poble/02-samarreta-socdepoble-roly-plom-oscur-1024px.png" alt="Camiseta Sóc de Poble" className="w-full h-full object-contain mix-blend-multiply" />
              </figure>
              <div className="sosp-targeta-cos p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="sosp-targeta-titol font-bold text-xl text-stone-900 leading-tight">Camiseta Sóc de Poble <br/><span className="text-base text-stone-500 font-normal">Edició Gris</span></h3>
                  <span className="text-xl font-black text-orange-600">15.00€</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">L'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly Gris de màxima qualitat.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Sóc de Poble" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-stone-500">Sóc de Poble</span>
                  </div>
                  <button className="sosp-btn sosp-btn-primari sosp-btn-sm rounded-full px-4" onClick={() => alert('Afegit al carret!')}>Afegir al carret</button>
                </div>
              </div>
            </article>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-4">24.6 Targeta de Vídeo (Sóc de Poble)</p>
            <article className="sosp-targeta sosp-targeta-amb-imatge max-w-sm bg-black border border-stone-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <figure className="sosp-targeta-imatge bg-black aspect-video relative flex items-center justify-center group cursor-pointer">
                {/* Fallback to poster and iframe or video tag */}
                <video src="https://www.w3schools.com/html/mov_bbb.mp4" poster="/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loop muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </figure>
              <div className="sosp-targeta-cos p-5 bg-stone-900">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="sosp-targeta-titol font-bold text-xl text-white leading-tight">La Masia Virtual <br/><span className="text-base text-stone-400 font-normal">Vídeo Presentació</span></h3>
                </div>
                <p className="text-stone-400 text-sm mb-4">Descobreix la filosofia darrere de la Masia Virtual i la connexió P2P de la Pedra Seca amb els pobles d'Alacant.</p>
                <div className="flex items-center gap-2">
                  <img src="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Sóc de Poble" className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-bold text-stone-300">Sóc de Poble</span>
                </div>
              </div>
            </article>
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
              <input 
                type="search" 
                id="cerca-input" 
                name="q" 
                className="sosp-input sosp-input-cerca flex-1 rounded-l-md border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" 
                placeholder="Cerca pobles, festes, documents..." 
                aria-label="Cerca al portal"
              />
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
              <iframe 
                className="w-full aspect-video rounded-lg mb-3"
                src="https://www.youtube.com/embed/Fadaa7Kyxm0?si=rJasphnQZdCy3zve" 
                title="Sóc de Poble Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
              <figcaption className="text-sm text-stone-500 text-center font-medium mb-3">Sóc de Poble: Portal de pobles connectats (2013)</figcaption>
              
              <details className="bg-white border border-stone-200 rounded-lg text-left overflow-hidden group">
                <summary className="p-3 font-semibold cursor-pointer text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors list-none flex justify-between items-center">
                  <span>📄 Descripció del vídeo original</span>
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
    </>
  );
}
