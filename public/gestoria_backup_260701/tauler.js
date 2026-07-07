class GestoriaTauler extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.vistaActual = 'home';
    this.vistaHomeMode = 'cards'; // 'cards' o 'comprimida'
    this.dades = null;
    
    // Conciliació
    this.conciliacioEventActiu = null;
    this.conciliacioFacturaActiva = null;

    // Comptes Bancaris i d'Estalvi
    this.comptes = {
        caixamar: { nom: 'CAIXAMAR', tipus: 'BANCS', actiu: true, saldo: 0, tag: 'SINCRO OK' },
        caixa_forta: { nom: 'CAIXA FORTA', tipus: 'TRESORERIA', actiu: true, saldo: 363.00, tag: 'METÀL·LIC' },
        flexi_deposit: { nom: 'FLEXI DEPÒSIT', tipus: 'ESTALVIS', actiu: false, saldo: 80000.00, tag: 'DIPÒSIT' },
        capital_social: { nom: 'CAPITAL SOCIAL', tipus: 'ESTALVIS', actiu: false, saldo: 17995.00, tag: 'APORTACIÓ' }
    };
  }

  toggleCompte(clau) {
      if (this.comptes[clau]) {
          this.comptes[clau].actiu = !this.comptes[clau].actiu;
          this.render();
      }
  }
  
  canviarModeHome(mode) {
    this.vistaHomeMode = mode;
    this.render();
  }

  async connectedCallback() {
    if (this.hasAttribute('vista')) {
      this.vistaActual = this.getAttribute('vista');
    }
    await this.carregarDades();
    this.render();
  }

  async canviarVista(novaVista) {
    this.vistaActual = novaVista;
    // Si estem en una subpàgina, forcem anar a l'index.html
    if (window.location.pathname.endsWith('.html') && !window.location.pathname.endsWith('index.html')) {
      window.location.href = 'index.html?vista=' + novaVista;
    } else {
      await this.carregarDades();
      this.render();
    }
  }

  async carregarDades() {
    try {
       if (typeof db !== 'undefined') {
         const events = await db.events.toArray();
         const factures = await db.factures.toArray();
         const contactes = await db.contactes.toArray();
         const documents = await db.documents ? await db.documents.toArray() : [];
         
         let saldo = 0;
         let agrupats = {};
         let totalDespeses = 0;
         
         events.forEach(e => {
            saldo += e.amount;
            if (e.amount < 0) {
               totalDespeses += Math.abs(e.amount);
               let cat = "Altres Despeses";
               const concept = (e.clean_concept || e.concept || "").toUpperCase();
               if (concept.includes("CEPSA") || concept.includes("REPSOL")) cat = "Gasolinera i Transport";
               else if (concept.includes("SOM ENERGIA") || concept.includes("IBERDROLA")) cat = "Subministraments";
               else if (concept.includes("SUMA") || concept.includes("SEGUROS")) cat = "Assegurances i Impostos";
               else if (concept.includes("BAR ") || concept.includes("RTE.")) cat = "Oci i Restauració";
               else if (concept.includes("SUPERMERCADO") || concept.includes("MERCADONA")) cat = "Supermercat";
               
               if (!agrupats[cat]) agrupats[cat] = [];
               agrupats[cat].push(e);
            }
         });
         
         let despesaMensual = totalDespeses > 0 ? (totalDespeses / 3) : 1000;
         let mesosRebost = (saldo / despesaMensual).toFixed(1);
         
         this.dades = { 
            saldo, 
            hisenda: -3210,
            mesosRebost,
            agrupats,
            totalDespeses,
            factures,
            contactes,
            documents,
            events
         };
       }
    } catch(e) {
       console.error("Error carregant dades de Dexie", e);
    }
  }

  render() {
    // Esquelet CSS de la Pedra Seca - Sense inventar res
    const css = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          color: var(--sp-black-100);
          font-family: 'Noto Sans', sans-serif;
        }

        /* UNIVERSAL PAGE HEADER (Estructura Canònica) */
        .up-titol-wrapper {
          padding: 0 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .up-titol-caixa {
          background-color: var(--sp-white-100);
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .up-titol-caixa h1 {
          color: var(--sp-blue-100);
          font-size: 32px;
          margin: 0;
          text-transform: uppercase;
        }

        .up-etiquetes {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
        }

        .up-categoria {
          font-size: 13px;
          font-weight: 800;
          color: var(--sp-white-100);
          background-color: var(--sp-blue-100);
          padding: 4px 16px;
          border-radius: 20px;
          text-transform: uppercase;
          opacity: 0.7; /* Menys protagonisme visual */
        }

        .up-etiqueta {
          font-size: 13px;
          font-weight: 800;
          color: var(--sp-white-100);
          background-color: var(--sp-orange-100);
          padding: 4px 16px;
          border-radius: 20px;
          text-transform: uppercase;
          opacity: 0.8; /* Suavitzat */
        }

        .up-subtitol-fora {
          color: var(--sp-orange-100);
          font-size: 18px;
          text-align: center;
          margin: 32px 0 32px 0;
          text-transform: uppercase;
        }

        /* GRID ESTÀNDARD */
        .universal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          gap: 24px;
          padding: 0 24px 32px 24px;
          max-width: 1400px; /* Un tope de lectura sa */
          margin: 0 auto;
        }

        /* L'ANATOMIA CANÒNICA DE LA UNIVERSAL CARD */
        .universal-card {
          background-color: var(--sp-white-100);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          min-height: 340px; /* Alçària extra per als badges inferiors */
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .universal-card:hover {
          transform: translateY(-2px);
        }

        /* 1. Caputxa Taronja */
        .uc-caputxa {
          background-color: var(--sp-orange-100);
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          color: var(--sp-black-100);
          position: relative;
          z-index: 5;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        
        .uc-caputxa:hover {
          filter: brightness(0.95);
        }

        .uc-autor-zona {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .uc-avatar {
          width: 32px;
          height: 32px;
          background-color: var(--sp-white-100);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        
        .uc-autor-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .uc-autor-nom {
          font-weight: 800;
          font-size: 14px;
        }
        
        .uc-autor-lloc {
          font-size: 11px;
          opacity: 0.8;
        }

        .uc-data-zona {
          background-color: rgba(0,0,0,0.15);
          color: white;
          border-radius: var(--sp-radius-main);
          height: 36px;
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .uc-data-zona:hover {
          background-color: rgba(0,0,0,0.25);
        }

        /* 2. Cos (Main Content) */
        .uc-cos {
          padding: 24px;
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Jerarquia H1-H6 de Pedra Seca DINS de la Card */
        .uc-cos h1 {
          color: var(--sp-blue-100);
          font-size: 24px;
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }

        .uc-cos h2 {
          color: var(--sp-orange-100);
          font-size: 16px;
          margin: 0 0 24px 0;
          text-transform: uppercase;
        }

        .quantitat {
          font-size: 48px;
          font-weight: 800;
          margin: 0;
          line-height: 1;
          color: var(--sp-black-100);
        }
        
        .color-negatiu { color: var(--sp-red-100); }

        /* 3. Peu Blau */
        .uc-badges {
          display: flex;
          gap: 8px;
          margin-top: auto; /* Espenta cap avall */
          padding-top: 24px;
          border-top: 1px solid #EEE;
          width: 100%;
          justify-content: center;
        }

        .uc-badge-cat {
          background-color: var(--sp-blue-100);
          color: var(--sp-white-100);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .uc-badge-etiq {
          background-color: var(--sp-orange-100);
          color: var(--sp-white-100);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .uc-peu {
          background-color: var(--sp-blue-100);
          height: 56px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          color: white;
          position: relative;
          z-index: 10;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .uc-icones-esquerra {
          display: flex;
          gap: 16px;
          font-size: 20px;
        }

        .uc-icones-centre {
          display: flex;
          gap: 20px;
          font-size: 20px;
          flex: 1;
          justify-content: center;
        }
        
        .uc-boto-accio {
          background-color: var(--sp-white-100);
          color: var(--sp-blue-100);
          margin-left: auto;
          border: none;
          border-radius: var(--sp-radius-main);
          padding: 0 16px;
          height: 36px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          white-space: nowrap;
        }

        /* TAULA BÀSICA */
        .taula-pedra-seca {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .taula-pedra-seca th {
          text-align: left;
          padding: 16px;
          border-bottom: 2px solid var(--sp-black-100);
          font-size: 14px;
          text-transform: uppercase;
        }

        .taula-pedra-seca td {
          padding: 16px;
          border-bottom: 1px solid var(--sp-border);
          font-size: 16px;
        }

        /* ZONA INGESTA */
        .zona-drop {
          background-color: var(--sp-white-100);
          border: 3px dashed var(--sp-border);
          padding: 48px;
          text-align: center;
          cursor: pointer;
          margin: 24px;
        }
        @media (max-width: 480px) {
          .uc-icones-centre {
            gap: 16px;
          }
          .uc-boto-accio {
            padding: 0;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            font-size: 20px;
          }
          .uc-boto-text {
            display: none;
          }
        }
      </style>
    `;

    let contingutVista = '';

    switch (this.vistaActual) {
      case 'home':
        contingutVista = this.renderHome();
        break;
      case 'factures':
      case 'compres':
        contingutVista = this.renderTaulaDocs(this.vistaActual);
        break;
      case 'contactes':
        contingutVista = this.renderContactes();
        break;
      case 'burocracia':
        contingutVista = this.renderBurocracia();
        break;
      case 'bancs':
        contingutVista = this.renderBancs();
        break;
      case 'conciliacio':
        contingutVista = this.renderConciliacio();
        break;
      case 'detall-flexi':
        contingutVista = this.renderDetallFlexi();
        break;
      case 'detall-capital':
        contingutVista = this.renderDetallCapital();
        break;
      case 'impostos':
        contingutVista = this.renderImpostos();
        break;
      case 'informes':
        contingutVista = this.renderInformes();
        break;
      case 'ingesta':
        contingutVista = this.renderEscanerLocal();
        break;
      case 'caixa-real':
      case 'el-rebost':
        contingutVista = this.renderCashflow(this.vistaActual);
        break;
      case 'iaia-gestora':
        contingutVista = this.renderUniversalPage('IAIA Gestora', 'La IAIA que et porta els comptes', 'SÓC DE POBLE', 'AUTOR');
        break;
      default:
        contingutVista = this.renderHome();
    }

    this.shadowRoot.innerHTML = css + contingutVista;
    
    // Assignar events de clic al Home
    if (this.vistaActual === 'home') {
      const cards = this.shadowRoot.querySelectorAll('.universal-card');
      cards.forEach(card => {
        // Clic a la Card (obri la Universal Page de la dada)
        card.addEventListener('click', () => {
          alert("Obrint la Universal Page d'aquesta dada financera...");
        });
        
        // Clic a la Caputxa Taronja (obri Autor)
        const caputxa = card.querySelector('.uc-caputxa');
        if (caputxa) {
          caputxa.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que es dispare el clic de la card
            alert("Obrint el perfil de l'Autor: IAIA Gestora");
          });
        }
        
        // Clic a la zona de data (ara és un botó clicable)
        const zonaData = card.querySelector('.uc-data-zona');
        if (zonaData) {
          zonaData.addEventListener('click', (e) => {
            e.stopPropagation(); 
            alert("S'ha clicat la data/versió. Ací podríem mostrar l'historial de canvis!");
          });
        }
        
        // Clic al peu blau (evitem que obriga la card global)
        const peu = card.querySelector('.uc-peu');
        if (peu) {
          peu.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        }
        
        // Clic a + CONNECTAR (Acció central del sistema)
        const botoConnectar = card.querySelector('.uc-boto-accio');
        if (botoConnectar) {
          botoConnectar.addEventListener('click', (e) => {
            e.stopPropagation();
            // Salta a la pàgina de connexió del sistema principal en localhost
            window.location.href = 'http://localhost:3333/connectar';
          });
        }
      });
    } else if (this.vistaActual === 'ingesta') {
      const dropzone = this.shadowRoot.getElementById('dropzone-area');
      const fileInput = this.shadowRoot.getElementById('csv-file-input');
      
      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
             const reader = new FileReader();
             reader.onload = async (event) => {
                const text = event.target.result;
                try {
                  const num = await window.processUnknownCSV(text);
                  alert(`🎉 S'han ingerit ${num} elements a la Pedra Seca amb èxit!`);
                  this.canviarVista('home');
                } catch(err) {
                  alert("Error en processar l'arxiu: " + err);
                }
             };
             reader.readAsText(file);
          }
        });
      }
    }
  }

  generarCaputxaIAIA(extraRightHtml = '') {
    return `
      <header class="uc-caputxa" style="cursor: pointer;" onclick="window.location.href='iaia-gestora.html'">
        <div class="uc-autor-zona">
          <div class="uc-avatar">🤖</div>
          <div class="uc-autor-text">
            <span class="uc-autor-nom">IAIA Gestora</span>
            <span class="uc-autor-lloc">La Torre de les Maçanes</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="uc-data-zona">
            <div>14:32</div>
            <div>30/06/2026</div>
          </div>
          ${extraRightHtml}
        </div>
      </header>
    `;
  }
  
  generarPeuUniversal() {
    return `
      <div class="uc-peu">
        <div class="uc-icones-centre">
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg></span>
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></span>
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg></span>
        </div>
        <button class="uc-boto-accio"><span class="uc-boto-icon">+</span><span class="uc-boto-text"> CONNECTAR</span></button>
      </div>
    `;
  }

  generarPageHeader(titol, subtitol, categoria = 'GESTORIA', etiqueta = 'PANEL INTERN') {
    return `
      <!-- UNIVERSAL PAGE HEADER (Estructura Canònica completa) -->
      <!-- 1. Barra Blava (Idèntica al peu de la card, però dalt) -->
      <div class="uc-peu" style="border-top: none;">
        <div class="uc-icones-esquerra" style="cursor: pointer;" onclick="window.location.href='http://localhost:3333/hub'">
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span>
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/></svg></span>
        </div>
        <div class="uc-icones-centre">
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg></span>
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></span>
          <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg></span>
        </div>
        <button class="uc-boto-accio" onclick="window.location.href='http://localhost:3333/connectar'" style="background-color: var(--sp-white-100); color: var(--sp-blue-100);"><span class="uc-boto-icon">+</span><span class="uc-boto-text"> CONNECTAR</span></button>
      </div>

      <!-- 2. Caputxa Taronja d'Autor -->
      ${this.generarCaputxaIAIA()}

      <!-- 3. Títol Decoratiu de la Pàgina (només H1 + etiquetes) -->
      <div class="up-titol-wrapper">
        <div class="up-titol-caixa">
          <h1>${titol}</h1>
          <div class="up-etiquetes">
            <span class="up-categoria">${categoria}</span>
            <span class="up-etiqueta">${etiqueta}</span>
          </div>
        </div>
      </div>
      
      <!-- 4. Subtítol H2 (Fora de la caixa decorativa) -->
      <h2 class="up-subtitol-fora">${subtitol}</h2>
    `;
  }

  renderUniversalPage(titol, subtitol, categoria, etiqueta, htmlBody = null) {
    const cosExplicatiu = htmlBody || `
      <div class="zona-drop" style="margin: 0 24px; padding: 48px 24px; background: white; border-radius: 12px; text-align: center;">
        <h1 style="color: var(--sp-blue-100); font-size: 24px; margin-bottom: 16px;">📚 Explicació de la IAIA</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          Ací la IAIA Gestora farà una explicació extensa per a aquells que no tenen cultura financera i necessiten entendre què significa exactament aquest apartat i com afecta a la seua vida diària.
        </p>
      </div>
    `;

    return `
      ${this.generarPageHeader(titol, subtitol, categoria, etiqueta)}
      ${cosExplicatiu}
    `;
  }

  renderEscanerLocal() {
    const dropzoneHtml = `
      <div style="padding: 0 24px 48px 24px; max-width: 1400px; margin: 0 auto;">
        
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
          <!-- ÀREA DE DROP -->
          <div id="dropzone-area" style="flex: 1; min-width: 300px; border: 3px dashed #CCC; border-radius: 20px; padding: 64px 24px; text-align: center; background-color: var(--sp-white-50); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--sp-orange-100)'; this.style.backgroundColor='#FFF3E0';" onmouseout="this.style.borderColor='#CCC'; this.style.backgroundColor='var(--sp-white-50)';">
            <input type="file" id="csv-file-input" accept=".csv" style="display: none;" />
            <div style="font-size: 48px; margin-bottom: 16px;">📥</div>
            <h2 style="color: var(--sp-blue-100); margin: 0 0 8px 0; font-size: 20px; text-transform: uppercase;">Llança el Banc o les Factures ací</h2>
            <p style="color: #666; margin: 0;">Fes clic per carregar <strong>cajamar.csv</strong> o el <strong>Resum_Facturacio.csv</strong>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 16px;">El motor local conciliarà automàticament de forma 100% offline.</p>
          </div>

          <!-- BOTONERA GESTOR -->
          <div style="width: 300px; display: flex; flex-direction: column; gap: 16px;">
            <div style="background-color: var(--sp-white-100); border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="color: var(--sp-blue-100); margin: 0 0 16px 0; font-size: 16px; text-transform: uppercase;">Tràmits</h3>
              
              <button style="width: 100%; background-color: var(--sp-blue-100); color: white; border: none; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; margin-bottom: 12px; transition: filter 0.2s;" onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='none'" onclick="document.querySelector('gestoria-tauler').iniciarGeneracioCsv();">
                📊 GENERAR CSV GESTOR
              </button>

              <button style="width: 100%; background-color: var(--sp-orange-100); color: white; border: none; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; transition: filter 0.2s;" onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='none'" onclick="alert('Llançant prompt a les Petorretes...');">
                🤖 PREGUNTAR AL CONSELL
              </button>
            </div>
          </div>
        </div>

        <!-- TAULA DE RESULTATS D'INGESTA (Simulació) -->
        <div style="margin-top: 48px; background: var(--sp-white-100); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="padding: 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: var(--sp-blue-100); font-size: 18px; text-transform: uppercase;">Últims Documents Processats (2T 2026)</h3>
            <span style="background-color: #E8F5E9; color: #2E7D32; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Tots classificats correctament</span>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
              <thead>
                <tr style="background-color: var(--sp-white-50); color: #666; font-weight: 600; text-transform: uppercase; font-size: 11px;">
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">Arxiu Original</th>
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">Data</th>
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">Proveïdor / Client</th>
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">Base Imp.</th>
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">IVA</th>
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">Total</th>
                  <th style="padding: 16px 24px; border-bottom: 1px solid #EEE;">Estat</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #EEE;">
                  <td style="padding: 16px 24px; color: var(--sp-blue-100); font-weight: 500;">Factura_Apple_Mar26.pdf</td>
                  <td style="padding: 16px 24px;">15/03/2026</td>
                  <td style="padding: 16px 24px;">Apple Store España</td>
                  <td style="padding: 16px 24px;">1.000,00 €</td>
                  <td style="padding: 16px 24px;">210,00 €</td>
                  <td style="padding: 16px 24px; font-weight: bold;">1.210,00 €</td>
                  <td style="padding: 16px 24px;"><span style="background: #E3F2FD; color: #1565C0; padding: 4px 8px; border-radius: 4px; font-size: 11px;">1T 2026</span></td>
                </tr>
                <tr style="border-bottom: 1px solid #EEE;">
                  <td style="padding: 16px 24px; color: var(--sp-blue-100); font-weight: 500;">F24_Sollutia_Hosting.pdf</td>
                  <td style="padding: 16px 24px;">02/04/2026</td>
                  <td style="padding: 16px 24px;">Sollutia S.L.</td>
                  <td style="padding: 16px 24px;">150,00 €</td>
                  <td style="padding: 16px 24px;">31,50 €</td>
                  <td style="padding: 16px 24px; font-weight: bold;">181,50 €</td>
                  <td style="padding: 16px 24px;"><span style="background: #FFF3E0; color: #E65100; padding: 4px 8px; border-radius: 4px; font-size: 11px;">2T 2026</span></td>
                </tr>
                <tr>
                  <td style="padding: 16px 24px; color: var(--sp-blue-100); font-weight: 500;">Caixamar_Moviments.csv</td>
                  <td style="padding: 16px 24px;">30/06/2026</td>
                  <td style="padding: 16px 24px;">Caixa Rural Central</td>
                  <td style="padding: 16px 24px; color: #999;">-</td>
                  <td style="padding: 16px 24px; color: #999;">-</td>
                  <td style="padding: 16px 24px; font-weight: bold;">45 moviments</td>
                  <td style="padding: 16px 24px;"><span style="background: #E8F5E9; color: #2E7D32; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Conciliat</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    return this.renderUniversalPage('Escàner Local', 'Motor d\'Ingesta', 'GESTORIA', 'IAIA GESTORA', dropzoneHtml);
  }

  renderHome() {
    if (this.vistaHomeMode === 'comprimida') {
        return this.renderHomeComprimida();
    } else {
        return this.renderHomeCards();
    }
  }

  renderHomeComprimida() {
    const formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);
    
    // --- Càlculs Reals ---
    let totalIngressos = 0;
    let totalCompres = 0;
    let vendesUltimMes = 0;
    let compresUltimMes = 0;
    
    let facturesPendents = 0;
    let facturesVencudes = 0; // Simularem que les pendents anteriors a hui estan vençudes
    let compresPendents = 0;
    let compresVencudes = 0;
    
    let movimentsPendentsBanc = 0;
    
    const now = new Date();
    const fa30dies = new Date();
    fa30dies.setDate(now.getDate() - 30);

    if (this.dades) {
        if (this.dades.factures) {
            this.dades.factures.forEach(f => {
                const total = parseFloat(f.total) || 0;
                const dataFact = new Date(f.date_timestamp);
                
                if (f.type === 'INGRES') {
                    totalIngressos += total;
                    if (dataFact >= fa30dies) vendesUltimMes += total;
                    if (f.estat_conciliacio !== 'CONCILIAT') {
                        facturesPendents++;
                        if (dataFact < now) facturesVencudes++;
                    }
                } else if (f.type === 'GASTO') {
                    totalCompres += total;
                    if (dataFact >= fa30dies) compresUltimMes += total;
                    if (f.estat_conciliacio !== 'CONCILIAT') {
                        compresPendents++;
                        if (dataFact < now) compresVencudes++;
                    }
                }
            });
        }
        
        if (this.dades.events) {
            movimentsPendentsBanc = this.dades.events.filter(e => e.tax_status !== 'CONCILIAT').length;
        }
    }
    
    const rendimentMes = vendesUltimMes - compresUltimMes;
    const colorRendiment = rendimentMes >= 0 ? 'var(--sp-blue-100)' : 'var(--sp-red-100)';
    const colorIcon = 'var(--sp-blue-100)';

    let warningHtml = '';
    if (!this.dades || this.dades.totalDespeses === 0) {
       warningHtml = `
         <div style="background-color: #FFF3E0; border-left: 4px solid var(--sp-orange-100); padding: 16px; margin: 0 auto 24px auto; max-width: 1350px; border-radius: 4px;">
           <h3 style="color: #E65100; margin: 0 0 8px 0; font-size: 16px;">⚠️ Cap Dada (Base de Dades Buida)</h3>
           <p style="margin: 0; color: #555; font-size: 14px;">Puja el teu CSV a l'Escàner per veure dades reals.</p>
         </div>
       `;
    }

    return `
      ${this.generarPageHeader('Resum (Holded)', 'Tauler Central de Comandament', 'INICI', 'RESUM')}
      ${warningHtml}

      <!-- Toggle Mètode de Vista -->
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: flex-end; margin-bottom: -24px; position: relative; z-index: 10;">
         <div style="background: white; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; padding: 4px;">
            <button onclick="document.querySelector('gestoria-tauler').canviarModeHome('cards')" style="background: transparent; color: #666; border: none; padding: 6px 16px; border-radius: 16px; font-weight: bold; cursor: pointer; font-size: 13px;">Universal Cards</button>
            <button onclick="document.querySelector('gestoria-tauler').canviarModeHome('comprimida')" style="background: var(--sp-blue-100); color: white; border: none; padding: 6px 16px; border-radius: 16px; font-weight: bold; cursor: pointer; font-size: 13px;">Vista Comprimida</button>
         </div>
      </div>

      <div style="padding: 0 24px 48px 24px; max-width: 1200px; margin: 0 auto;">
        
        <!-- Saludo -->
        <h1 style="color: var(--sp-blue-100); font-size: 24px; font-weight: bold; margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
          Hola, Javi Llinares! 👋
        </h1>

        <!-- Widget: FINANCES (Últims 30 dies) -->
        <div style="background-color: white; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; font-size: 18px; color: #333;">Finances</h2>
            <span style="font-size: 13px; color: #666; font-weight: 500;">Últims 30 dies ⌄</span>
          </div>
          <div style="display: flex; padding: 32px 24px;">
            <div style="flex: 1; text-align: center; border-right: 1px solid #EEE;">
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Ingressos</div>
              <div style="font-size: 28px; font-weight: bold; color: #333;">${formatEur(vendesUltimMes)}</div>
            </div>
            <div style="flex: 1; text-align: center; border-right: 1px solid #EEE;">
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Despeses</div>
              <div style="font-size: 28px; font-weight: bold; color: #333;">${formatEur(compresUltimMes)}</div>
            </div>
            <div style="flex: 1; text-align: center;">
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Rendiment</div>
              <div style="font-size: 28px; font-weight: bold; color: ${colorRendiment};">${formatEur(rendimentMes)}</div>
            </div>
          </div>
        </div>

        <!-- Widget: PRIMERS PASSOS -->
        <div style="background-color: white; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; font-size: 18px; color: #333;">Primers passos</h2>
            <span style="font-size: 12px; color: #999;">6 de 7 completats ℹ️</span>
          </div>
          <!-- Barra de progrés -->
          <div style="padding: 16px 24px 0 24px;">
             <div style="width: 100%; height: 6px; background-color: #EEE; border-radius: 4px; overflow: hidden;">
                <div style="width: 85%; height: 100%; background-color: #2E7D32;"></div>
             </div>
          </div>
          <!-- Llista Passos -->
          <div style="padding: 16px 24px;">
            <div style="display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #F5F5F5;">
               <div style="width: 24px; height: 24px; background: #2E7D32; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</div>
               <div style="flex: 1;">
                 <div style="font-weight: 600; font-size: 14px; text-decoration: line-through; color: #999;">Crear compte</div>
                 <div style="font-size: 12px; color: #999;">Benvingut a la Gestoria</div>
               </div>
               <div style="font-size: 12px; font-weight: 600; color: #2E7D32;">Fet</div>
            </div>
            <div style="display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #F5F5F5;">
               <div style="width: 24px; height: 24px; background: #2E7D32; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</div>
               <div style="flex: 1;">
                 <div style="font-weight: 600; font-size: 14px; text-decoration: line-through; color: #999;">Connecta el teu banc</div>
                 <div style="font-size: 12px; color: #999;">Arxiu CSV pujat, moviments sincronitzats</div>
               </div>
               <div style="font-size: 12px; font-weight: 600; color: #2E7D32;">Fet</div>
            </div>
            <div style="display: flex; align-items: center; gap: 16px; padding: 12px 0;">
               <div style="width: 24px; height: 24px; border: 2px solid #CCC; border-radius: 50%;"></div>
               <div style="flex: 1;">
                 <div style="font-weight: 600; font-size: 14px; color: #333;">Introducció a la Pedra Seca</div>
                 <div style="font-size: 12px; color: #666;">Aprèn els elements bàsics de la IAIA en 5 minuts</div>
               </div>
               <div style="font-size: 12px; font-weight: 600; color: var(--sp-blue-100); cursor: pointer; padding: 4px 12px; background: #E3F2FD; border-radius: 20px;">Mira el vídeo</div>
            </div>
          </div>
        </div>

        <!-- Mètriques + Factures (Grid) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <!-- Widget: MÈTRIQUES -->
            <div style="background-color: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px; color: #333;">Les vostres mètriques</h2>
                <span style="font-size: 13px; color: var(--sp-blue-100); font-weight: 600; cursor: pointer;" onclick="document.querySelector('gestoria-tauler').canviarVista('informes')">Aneu a Informes 📈</span>
              </div>
              <div style="padding: 24px; display: flex; flex: 1;">
                <div style="flex: 1; border-right: 1px solid #EEE;">
                  <div style="font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">Vendes</div>
                  <div style="font-size: 11px; color: #999; margin-bottom: 8px;">Darrers 12 mesos</div>
                  <div style="font-size: 24px; font-weight: bold; color: #333;">${formatEur(totalIngressos)}</div>
                </div>
                <div style="flex: 1; padding-left: 24px;">
                  <div style="font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase;">Compres</div>
                  <div style="font-size: 11px; color: #999; margin-bottom: 8px;">Darrers 12 mesos</div>
                  <div style="font-size: 24px; font-weight: bold; color: #333;">${formatEur(totalCompres)}</div>
                </div>
              </div>
            </div>

            <!-- Widget: FACTURES DE VENDES -->
            <div style="background-color: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #EEE;">
                <h2 style="margin: 0; font-size: 18px; color: #333; display: flex; align-items: center; gap: 8px;">Factures i Compres <span style="font-size: 12px; color: #999; font-weight: normal;">(L'últim any)</span></h2>
              </div>
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="background: #FAFAFA; border-bottom: 1px solid #EEE;">
                     <th style="padding: 12px 24px; font-size: 12px; font-weight: 600; color: #666;">Tipus</th>
                     <th style="padding: 12px 24px; font-size: 12px; font-weight: 600; color: #666; text-align: right;">Pendents</th>
                     <th style="padding: 12px 24px; font-size: 12px; font-weight: 600; color: #666; text-align: right;">Vençut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #EEE;">
                     <td style="padding: 16px 24px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; color: var(--sp-blue-100); cursor: pointer;" onclick="document.querySelector('gestoria-tauler').canviarVista('factures')">
                       <span style="background: #E3F2FD; color: #1565C0; padding: 8px; border-radius: 8px; font-size: 16px; display: flex; align-items: center; justify-content: center;">📈</span> Vendes
                     </td>
                     <td style="padding: 16px 24px; text-align: right; color: #666; font-size: 14px;">${facturesPendents} documents</td>
                     <td style="padding: 16px 24px; text-align: right; color: #666; font-size: 14px;">${facturesVencudes} documents</td>
                  </tr>
                  <tr>
                     <td style="padding: 16px 24px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; color: var(--sp-blue-100); cursor: pointer;" onclick="document.querySelector('gestoria-tauler').canviarVista('compres')">
                       <span style="background: #E3F2FD; color: #1565C0; padding: 8px; border-radius: 8px; font-size: 16px; display: flex; align-items: center; justify-content: center;">📉</span> Compres
                     </td>
                     <td style="padding: 16px 24px; text-align: right; color: #666; font-size: 14px;">${compresPendents} documents</td>
                     <td style="padding: 16px 24px; text-align: right; color: #666; font-size: 14px;">${compresVencudes} documents</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>

        <!-- Bancs i Projectes (Grid) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            
            <!-- Widget: BANCS -->
            <div style="background-color: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px; color: #333;">Bancs</h2>
                <span style="font-size: 13px; color: var(--sp-blue-100); font-weight: 600; cursor: pointer;">Aneu a Banca 🏦</span>
              </div>
              <div style="padding: 16px 24px; border-bottom: 1px solid #EEE;">
                <div style="font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Balanç total</div>
                <div style="font-size: 18px; font-weight: bold; color: #333; text-align: right;">${this.dades ? formatEur(this.dades.saldo) : '0,00 €'}</div>
              </div>
              <div style="padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 32px; height: 32px; background: #E3F2FD; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px;">💳</div>
                  <div>
                    <div style="font-weight: 600; font-size: 14px; color: #333;">Cajamar</div>
                    <div style="font-size: 11px; color: #4CAF50;">Sincronitzat localment</div>
                  </div>
                </div>
                <div style="font-size: 13px; font-weight: 600; color: ${movimentsPendentsBanc > 0 ? '#E65100' : '#2E7D32'};">
                  ${movimentsPendentsBanc} moviments per conciliar
                </div>
              </div>
            </div>

            <!-- Widget: PROJECTES -->
            <div style="background-color: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px; color: #333;">Projectes (3)</h2>
                <span style="font-size: 13px; color: var(--sp-blue-100); font-weight: 600; cursor: pointer;">Anar a projectes 📂</span>
              </div>
              <div style="padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F5F5F5;">
                 <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 16px; color: #4CAF50;">📋</div>
                    <div>
                       <div style="font-size: 14px; font-weight: 600; color: var(--sp-blue-100);">Mapa de La Torre</div>
                       <div style="font-size: 11px; color: #999;">Gent de La Torre</div>
                    </div>
                 </div>
                 <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="background: #E3F2FD; color: #1565C0; padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: bold;">En producció</span>
                    <span style="font-size: 12px; color: #999;">31/12/2026 ></span>
                 </div>
              </div>
              <div style="padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F5F5F5;">
                 <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 16px; color: #4CAF50;">📋</div>
                    <div>
                       <div style="font-size: 14px; font-weight: 600; color: var(--sp-blue-100);">Herbari La Canaleta</div>
                       <div style="font-size: 11px; color: #999;">Gent de La Torre</div>
                    </div>
                 </div>
                 <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="background: #E3F2FD; color: #1565C0; padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: bold;">En producció</span>
                    <span style="font-size: 12px; color: #999;">31/12/2026 ></span>
                 </div>
              </div>
              <div style="padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;">
                 <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 16px; color: #4CAF50;">📋</div>
                    <div>
                       <div style="font-size: 14px; font-weight: 600; color: var(--sp-blue-100);">Catàleg de Recursos...</div>
                       <div style="font-size: 11px; color: #999;">Gent de La Torre</div>
                    </div>
                 </div>
                 <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="background: #E3F2FD; color: #1565C0; padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: bold;">En producció</span>
                    <span style="font-size: 12px; color: #999;">31/12/2026 ></span>
                 </div>
              </div>
            </div>

        </div>

      </div>
    `;
  }

  renderHomeCards() {
    let vendesUltimMes = 0;
    let compresUltimMes = 0;
    let facturesPendents = 0;
    let facturesVencudes = 0;
    let compresPendents = 0;
    let compresVencudes = 0;
    let totalIngressos = 0;
    let totalCompres = 0;
    let movimentsPendentsBanc = 0;

    const now = new Date().getTime();
    const fa30dies = now - (30 * 24 * 60 * 60 * 1000);

    if (this.dades && this.dades.factures) {
        this.dades.factures.forEach(f => {
            const total = parseFloat(f.total) || 0;
            const dataFact = new Date(f.date_timestamp);
            if (f.type === 'INGRES') {
                totalIngressos += total;
                if (dataFact >= fa30dies) vendesUltimMes += total;
                if (f.estat_conciliacio !== 'CONCILIAT') {
                    facturesPendents++;
                    if (dataFact < now) facturesVencudes++;
                }
            } else if (f.type === 'GASTO') {
                totalCompres += total;
                if (dataFact >= fa30dies) compresUltimMes += total;
                if (f.estat_conciliacio !== 'CONCILIAT') {
                    compresPendents++;
                    if (dataFact < now) compresVencudes++;
                }
            }
        });
    }
    
    if (this.dades && this.dades.events) {
        movimentsPendentsBanc = this.dades.events.filter(e => e.tax_status !== 'CONCILIAT').length;
    }
    
    const rendimentMes = vendesUltimMes - compresUltimMes;
    const colorRendiment = rendimentMes >= 0 ? 'var(--sp-blue-100)' : 'var(--sp-red-100)';
    const formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

    // Càlculs de les 3 caixes originals (El mètode del Trellat)
    // El saldo real ara és la suma dels saldos dels comptes actius
    const saldoCaixa = Object.values(this.comptes)
        .filter(c => c.actiu)
        .reduce((sum, c) => sum + c.saldo, 0);
        
    const ivaEstimat = (totalIngressos * 0.21) - (totalCompres * 0.21);
    const colorHisenda = ivaEstimat > 0 ? 'var(--sp-red-100)' : 'var(--sp-blue-100)';
    const despesaMensualMitjana = totalCompres > 0 ? totalCompres / 12 : 500;
    const rebostMesos = saldoCaixa > 0 ? (saldoCaixa / despesaMensualMitjana).toFixed(1) : '0.0';

    let warningHtml = '';
    if (!this.dades || this.dades.totalDespeses === 0) {
       warningHtml = `
         <div style="background-color: #FFF3E0; border-left: 4px solid var(--sp-orange-100); padding: 16px; margin: 0 auto 24px auto; max-width: 1350px; border-radius: 4px;">
           <h3 style="color: #E65100; margin: 0 0 8px 0; font-size: 16px;">⚠️ Cap Dada (Base de Dades Buida)</h3>
           <p style="margin: 0; color: #555; font-size: 14px;">Puja el teu CSV a l'Escàner per veure dades reals.</p>
         </div>
       `;
    }

    return `
      ${this.generarPageHeader('Estat Financer', 'Tauler Central', 'GESTORIA', 'PANEL INTERN')}
      ${warningHtml}

      <!-- Toggle Mètode de Vista -->
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: flex-end; margin-bottom: 24px;">
         <div style="background: white; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; padding: 4px;">
            <button onclick="document.querySelector('gestoria-tauler').canviarModeHome('cards')" style="background: var(--sp-blue-100); color: white; border: none; padding: 6px 16px; border-radius: 16px; font-weight: bold; cursor: pointer; font-size: 13px;">Universal Cards</button>
            <button onclick="document.querySelector('gestoria-tauler').canviarModeHome('comprimida')" style="background: transparent; color: #666; border: none; padding: 6px 16px; border-radius: 16px; font-weight: bold; cursor: pointer; font-size: 13px;">Vista Comprimida</button>
         </div>
      </div>

      <div style="padding: 0 24px 48px 24px; max-width: 1200px; margin: 0 auto;">
        
        <h1 style="color: var(--sp-blue-100); font-size: 24px; font-weight: bold; margin-bottom: 24px;">
          Hola, Fco. Javier! 👋
        </h1>

        <h2 style="font-size: 16px; color: #666; margin-bottom: 16px; text-transform: uppercase;">La teua realitat</h2>
        <div class="universal-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; margin-bottom: 48px;">
          
          <div class="universal-card" onclick="document.querySelector('gestoria-tauler').canviarVista('bancs')">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: pointer; padding: 32px 24px; text-align: center;">
              <h1 style="color: var(--sp-blue-100); font-size: 20px; margin: 0 0 8px 0;">CAIXA REAL</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Saldo Disponible</h2>
              <p class="quantitat" style="font-size: 38px; font-weight: bold; color: #333; margin: 0;">${formatEur(saldoCaixa)}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span class="uc-badge-cat" style="background: #E3F2FD; color: #1565C0; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">GESTORIA</span>
                <span class="uc-badge-etiq" style="background: #E8F5E9; color: #2E7D32; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">CAIXA REAL</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>

          <div class="universal-card">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: default; padding: 32px 24px; text-align: center;">
              <h1 style="color: ${colorHisenda}; font-size: 20px; margin: 0 0 8px 0;">HISENDA</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Model 303 / 130</h2>
              <p class="quantitat" style="font-size: 38px; font-weight: bold; color: ${colorHisenda}; margin: 0;">${formatEur(-ivaEstimat)}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span class="uc-badge-cat" style="background: #E3F2FD; color: #1565C0; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">GESTORIA</span>
                <span class="uc-badge-etiq" style="background: #FFF3E0; color: #E65100; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">HISENDA</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>

          <div class="universal-card">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: default; padding: 32px 24px; text-align: center;">
              <h1 style="color: #7E57C2; font-size: 20px; margin: 0 0 8px 0;">EL REBOST</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Mesos de cobertura</h2>
              <p class="quantitat" style="font-size: 38px; font-weight: bold; color: #333; margin: 0;">${rebostMesos}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span class="uc-badge-cat" style="background: #E3F2FD; color: #1565C0; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">GESTORIA</span>
                <span class="uc-badge-etiq" style="background: #F3E5F5; color: #8E24AA; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">EL REBOST</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>
        </div>

        <h2 style="font-size: 16px; color: #666; margin-bottom: 16px; text-transform: uppercase;">Finances (Últims 30 dies)</h2>
        <div class="universal-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; margin-bottom: 48px;">
          
          <div class="universal-card" onclick="document.querySelector('gestoria-tauler').canviarVista('factures')">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: pointer; padding: 32px 24px; text-align: center;">
              <h1 style="color: var(--sp-blue-100); font-size: 20px; margin: 0 0 8px 0;">INGRESSOS</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Vendes recents</h2>
              <p class="quantitat" style="font-size: 38px; font-weight: bold; color: #333; margin: 0;">${formatEur(vendesUltimMes)}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span class="uc-badge-cat" style="background: #E3F2FD; color: #1565C0; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">${facturesPendents} PENDENTS</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>

          <div class="universal-card" onclick="document.querySelector('gestoria-tauler').canviarVista('compres')">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: pointer; padding: 32px 24px; text-align: center;">
              <h1 style="color: var(--sp-orange-100); font-size: 20px; margin: 0 0 8px 0;">DESPESES</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Compres recents</h2>
              <p class="quantitat" style="font-size: 38px; font-weight: bold; color: #333; margin: 0;">${formatEur(compresUltimMes)}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span class="uc-badge-etiq" style="background: #FFF3E0; color: #E65100; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">${compresPendents} PENDENTS</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>

          <div class="universal-card" onclick="document.querySelector('gestoria-tauler').canviarVista('informes')">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: pointer; padding: 32px 24px; text-align: center;">
              <h1 style="color: ${colorRendiment}; font-size: 20px; margin: 0 0 8px 0;">RENDIMENT</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Benefici Net</h2>
              <p class="quantitat" style="font-size: 38px; font-weight: bold; color: ${colorRendiment}; margin: 0;">${formatEur(rendimentMes)}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span class="uc-badge-cat" style="background: #E8F5E9; color: #2E7D32; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">ESTAT OK</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>
        </div>

        <h2 style="font-size: 16px; color: #666; margin-bottom: 16px; text-transform: uppercase;">La teua empresa (Anual)</h2>
        <div class="universal-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
          
          <div class="universal-card" onclick="document.querySelector('gestoria-tauler').canviarVista('bancs')">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: pointer; padding: 32px 24px; text-align: center;">
              <h1 style="color: var(--sp-blue-100); font-size: 20px; margin: 0 0 8px 0;">TRESORERIA</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Balanç de Bancs</h2>
              <p class="quantitat" style="font-size: 32px; font-weight: bold; color: #333; margin: 0;">${this.dades ? formatEur(this.dades.saldo) : '0,00 €'}</p>
              <div class="uc-badges" style="margin-top: 24px; display: flex; justify-content: center; gap: 8px;">
                <span style="background: ${movimentsPendentsBanc > 0 ? '#FFF3E0' : '#E8F5E9'}; color: ${movimentsPendentsBanc > 0 ? '#E65100' : '#2E7D32'}; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">${movimentsPendentsBanc} per conciliar</span>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>

          <div class="universal-card" onclick="document.querySelector('gestoria-tauler').canviarVista('informes')">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: pointer; padding: 32px 24px; text-align: center;">
              <h1 style="color: #7E57C2; font-size: 20px; margin: 0 0 8px 0;">FACTURACIÓ</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Tot l'any</h2>
              <div style="display: flex; justify-content: center; gap: 24px; margin-top: 16px;">
                 <div>
                    <div style="font-size: 11px; color: #999; text-transform: uppercase;">Vendes</div>
                    <div style="font-size: 20px; font-weight: bold; color: var(--sp-blue-100);">${formatEur(totalIngressos)}</div>
                 </div>
                 <div>
                    <div style="font-size: 11px; color: #999; text-transform: uppercase;">Compres</div>
                    <div style="font-size: 20px; font-weight: bold; color: var(--sp-orange-100);">${formatEur(totalCompres)}</div>
                 </div>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>

          <div class="universal-card">
            ${this.generarCaputxaIAIA()}
            <div class="uc-cos" style="cursor: default; padding: 32px 24px; text-align: center;">
              <h1 style="color: #2E7D32; font-size: 20px; margin: 0 0 8px 0;">ONBOARDING</h1>
              <h2 style="color: #666; font-size: 12px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Primers Passos</h2>
              
              <div style="text-align: left; margin-top: 16px;">
                 <div style="width: 100%; height: 6px; background-color: #EEE; border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
                    <div style="width: 85%; height: 100%; background-color: #2E7D32;"></div>
                 </div>
                 <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="color: #2E7D32;">✅</span> <span style="font-size: 13px; color: #666;">Connectar Bancs</span>
                 </div>
                 <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #999;">⭕</span> <span style="font-size: 13px; color: #333; font-weight: 600;">Tutorial IAIA</span>
                 </div>
              </div>
            </div>
            ${this.generarPeuUniversal()}
          </div>
          
        </div>

      </div>
    `;
  }

  renderTaulaDocs(tipus) {
    const titol = tipus === 'factures' ? 'Factures i Vendes' : 'Compres i Proveïdors';
    const dbTipus = tipus === 'factures' ? 'INGRES' : 'GASTO';
    
    let facturesFilt = [];
    if (this.dades && this.dades.factures) {
        facturesFilt = this.dades.factures.filter(f => f.type === dbTipus);
        // Ordenar per data, del més recent al més antic
        facturesFilt.sort((a, b) => b.date_timestamp - a.date_timestamp);
    }
    
    const formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

    let rowsHtml = '';
    if (facturesFilt.length === 0) {
        rowsHtml = `<tr><td colspan="6" style="text-align: center; color: #999;">Sense documents per mostrar. Usa l'Escàner Local.</td></tr>`;
    } else {
        rowsHtml = facturesFilt.map(f => {
            const dateObj = new Date(f.date_timestamp);
            const dateStr = dateObj.toLocaleDateString();
            
            let colorEstat = f.estat_conciliacio === 'CONCILIAT' ? '#E8F5E9' : '#FFF3E0';
            let txtColorEstat = f.estat_conciliacio === 'CONCILIAT' ? '#2E7D32' : '#E65100';
            let iconaEstat = f.estat_conciliacio === 'CONCILIAT' ? '✅' : '⏳';

            return `
            <tr>
              <td>${dateStr}</td>
              <td>${f.id}</td>
              <td style="font-weight: 600; color: var(--sp-blue-100);">${f.contact_name || f.contact_nif}</td>
              <td style="font-size: 13px; color: #666;">${f.desc}</td>
              <td style="text-align: right; font-weight: bold;">${formatEur(f.total)}</td>
              <td style="text-align: center;">
                <span style="background-color: ${colorEstat}; color: ${txtColorEstat}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; white-space: nowrap;">
                  ${iconaEstat} ${f.estat_conciliacio}
                </span>
              </td>
            </tr>`;
        }).join('');
    }

    return `
      ${this.generarPageHeader(titol, 'Llistat Natiu de Documents (Shadow Holded)')}
      
      <div style="padding: 0 24px;">
        <table class="taula-pedra-seca">
          <thead>
            <tr>
              <th>Data</th>
              <th>Núm Factura</th>
              <th>Client/Proveïdor</th>
              <th>Concepte</th>
              <th style="text-align: right;">Total</th>
              <th style="text-align: center;">Estat</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  renderContactes() {
    let contactes = [];
    if (this.dades && this.dades.contactes) {
        contactes = this.dades.contactes;
    }
    
    let rowsHtml = '';
    if (contactes.length === 0) {
        rowsHtml = `<tr><td colspan="4" style="text-align: center; color: #999;">Cap contacte guardat.</td></tr>`;
    } else {
        rowsHtml = contactes.map(c => `
            <tr>
              <td style="font-weight: bold; color: var(--sp-blue-100);">${c.nom}</td>
              <td style="font-family: monospace;">${c.nif}</td>
              <td>
                <span style="background-color: ${c.tipus === 'CLIENT' ? '#E3F2FD' : '#FCE4EC'}; color: ${c.tipus === 'CLIENT' ? '#1565C0' : '#C2185B'}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">
                  ${c.tipus}
                </span>
              </td>
              <td style="text-align: center;">
                 <button style="border: 1px solid var(--sp-border); background: white; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">✏️ Editar</button>
              </td>
            </tr>
        `).join('');
    }

    return `
      ${this.generarPageHeader('Contactes', 'El CRM Poble-First (Llibre Major)')}
      <div style="padding: 0 24px; max-width: 1000px; margin: 0 auto;">
        <table class="taula-pedra-seca">
          <thead>
            <tr>
              <th>Nom / Raó Social</th>
              <th>NIF / CIF</th>
              <th>Tipus</th>
              <th style="text-align: center;">Accions</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  renderBurocracia() {
    return `
      ${this.generarPageHeader('Arxiu Burocràtic', 'Gestió de SUMA, Herències i papers que no entens', 'GESTORIA', 'BUROCRÀCIA')}
      
      <div style="padding: 0 24px 48px 24px; max-width: 1400px; margin: 0 auto;">
        
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
          <!-- ÀREA DE DROP BUROCRÀCIA -->
          <div id="dropzone-burocracia" style="flex: 1; min-width: 300px; border: 3px dashed var(--sp-orange-100); border-radius: 20px; padding: 64px 24px; text-align: center; background-color: #FFF3E0; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.filter='brightness(0.95)';" onmouseout="this.style.filter='none';">
            <input type="file" id="pdf-file-input" accept=".pdf,.jpg,.jpeg" style="display: none;" />
            <div style="font-size: 48px; margin-bottom: 16px;">🗄️</div>
            <h2 style="color: var(--sp-orange-100); margin: 0 0 8px 0; font-size: 20px; text-transform: uppercase;">Llança el Paper de Suma o de l'Herència ací</h2>
            <p style="color: #666; margin: 0;">Accepta PDF o Fotos del paper.</p>
            <p style="color: #999; font-size: 12px; margin-top: 16px;">La IAIA ho llegirà, et dirà de què va, i si has de pagar o pots oblidar-te'n.</p>
          </div>
        </div>

        <div style="margin-top: 48px;">
          <h2 style="color: var(--sp-blue-100); font-size: 18px; margin-bottom: 16px;">Papers Arxivat (0)</h2>
          <p style="color: #999;">Encara no has pujat cap document burocràtic.</p>
        </div>
      </div>
    `;
  }

  renderBancs() {
    const formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

    const cardsHtml = Object.keys(this.comptes).map(clau => {
       const compte = this.comptes[clau];
       const opacity = compte.actiu ? '1' : '0.6';
       const iconaUll = compte.actiu ? '👁️' : '🙈';
       const saldoText = compte.actiu ? formatEur(compte.saldo) : '***,** €';
       const borderColor = compte.actiu ? 'var(--sp-blue-100)' : '#999';

       const toggleBtn = `<button onclick="event.stopPropagation(); document.querySelector('gestoria-tauler').toggleCompte('${clau}')" style="background: transparent; border: none; font-size: 20px; cursor: pointer; transition: all 0.2s; filter: grayscale(${compte.actiu ? '0%' : '100%'}); padding: 0;" title="Activar/Desactivar visibilitat">${iconaUll}</button>`;

       return `
        <div class="universal-card" style="opacity: ${opacity}; transition: all 0.3s;">
          ${this.generarCaputxaIAIA(toggleBtn)}
          <div class="uc-cos" style="cursor: default; padding: 32px 24px; text-align: center; position: relative;">
            <h1 style="color: ${borderColor}; font-size: 24px; margin: 0 0 8px 0;">${compte.nom}</h1>
            <h2 style="color: #666; font-size: 14px; margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase;">Saldo Bancari</h2>
            <p class="quantitat" style="font-size: 38px; font-weight: bold; color: #333; margin: 0; filter: ${compte.actiu ? 'none' : 'blur(4px)'};">${saldoText}</p>
            <div class="uc-badges" style="margin-top: 32px; display: flex; justify-content: center; gap: 8px;">
              <span class="uc-badge-cat" style="background: #E3F2FD; color: #1565C0; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">${compte.tipus}</span>
              <span class="uc-badge-etiq" style="background: #E8F5E9; color: #2E7D32; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">${compte.tag}</span>
            </div>
            ${clau === 'caixamar' ? `<button onclick="document.querySelector('gestoria-tauler').canviarVista('conciliacio')" style="margin-top: 24px; background-color: var(--sp-blue-100); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; width: 100%; transition: all 0.2s;">Conciliar Moviments</button>` : ''}
            ${clau === 'flexi_deposit' ? `<button onclick="document.querySelector('gestoria-tauler').canviarVista('detall-flexi')" style="margin-top: 24px; background-color: white; border: 2px solid var(--sp-blue-100); color: var(--sp-blue-100); padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; width: 100%; transition: all 0.2s;">Veure Detalls</button>` : ''}
            ${clau === 'capital_social' ? `<button onclick="document.querySelector('gestoria-tauler').canviarVista('detall-capital')" style="margin-top: 24px; background-color: white; border: 2px solid var(--sp-blue-100); color: var(--sp-blue-100); padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; width: 100%; transition: all 0.2s;">Veure Detalls</button>` : ''}
          </div>
          ${this.generarPeuUniversal()}
        </div>
       `;
    }).join('');

    return `
      ${this.generarPageHeader('Bancs i Tresoreria', 'Estat de comptes reals i conciliació', 'GESTORIA', 'PANEL INTERN')}

      <div class="universal-grid" style="padding: 0 24px 48px 24px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
         ${cardsHtml}
      </div>
    `;
  }

  seleccionarEvent(id) {
    const numId = Number(id);
    const parsedId = isNaN(numId) || id.trim() === '' ? id : numId;
    this.conciliacioEventActiu = this.conciliacioEventActiu === parsedId ? null : parsedId;
    this.render();
  }

  seleccionarFactura(id) {
    const numId = Number(id);
    const parsedId = isNaN(numId) || id.trim() === '' ? id : numId;
    this.conciliacioFacturaActiva = this.conciliacioFacturaActiva === parsedId ? null : parsedId;
    this.render();
  }

  async executarConciliacio() {
    if (!this.conciliacioEventActiu || !this.conciliacioFacturaActiva) return;

    if (typeof db !== 'undefined') {
       try {
           await db.events.update(this.conciliacioEventActiu, { tax_status: 'CONCILIAT' });
           await db.factures.update(this.conciliacioFacturaActiva, { estat_conciliacio: 'CONCILIAT' });
           
           this.conciliacioEventActiu = null;
           this.conciliacioFacturaActiva = null;
           
           await this.carregarDades();
           this.render();
       } catch (err) {
           console.error("Error conciliant:", err);
           alert("Hi ha hagut un error en guardar la conciliació. Comprova la consola.");
       }
    }
  }

  renderConciliacio() {
    let eventsPendents = this.dades && this.dades.events ? this.dades.events.filter(e => e.tax_status !== 'CONCILIAT') : [];
    let facturesPendents = this.dades && this.dades.factures ? this.dades.factures.filter(f => f.estat_conciliacio !== 'CONCILIAT') : [];
    const formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

    let htmlEvents = eventsPendents.length === 0 
      ? '<div style="padding: 24px; text-align: center; color: #999; font-weight: 500;">No hi ha moviments bancaris pendents. 🎉</div>' 
      : eventsPendents.map(e => {
        const isSelected = this.conciliacioEventActiu === e.id;
        const colorBorder = isSelected ? 'var(--sp-blue-100)' : '#EEE';
        const bg = isSelected ? '#E3F2FD' : 'white';
        return `
          <div onclick="document.querySelector('gestoria-tauler').seleccionarEvent('${e.id}')" style="background: ${bg}; border: 2px solid ${colorBorder}; border-radius: 8px; padding: 16px; margin-bottom: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
            <div>
              <div style="font-weight: bold; font-size: 14px; color: #333;">${e.clean_concept}</div>
              <div style="font-size: 12px; color: #666;">${e.date}</div>
            </div>
            <div style="font-weight: bold; font-size: 16px; color: ${e.amount < 0 ? '#E65100' : '#2E7D32'};">
              ${formatEur(e.amount)}
            </div>
          </div>
        `;
      }).join('');

    let htmlFactures = facturesPendents.length === 0
      ? '<div style="padding: 24px; text-align: center; color: #999; font-weight: 500;">No hi ha documents (factures/tiquets) pendents. 🎉</div>'
      : facturesPendents.map(f => {
        const isSelected = this.conciliacioFacturaActiva === f.id;
        const colorBorder = isSelected ? 'var(--sp-blue-100)' : '#EEE';
        const bg = isSelected ? '#E3F2FD' : 'white';
        return `
          <div onclick="document.querySelector('gestoria-tauler').seleccionarFactura('${f.id}')" style="background: ${bg}; border: 2px solid ${colorBorder}; border-radius: 8px; padding: 16px; margin-bottom: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
            <div>
              <div style="font-weight: bold; font-size: 14px; color: #333;">${f.contact_name || f.contact_nif || 'Desconegut'}</div>
              <div style="font-size: 12px; color: #666;">${new Date(f.date_timestamp).toLocaleDateString()} · ${f.type === 'INGRES' ? 'Venda' : 'Compra'}</div>
            </div>
            <div style="font-weight: bold; font-size: 16px; color: ${f.type === 'GASTO' ? '#E65100' : '#2E7D32'};">
              ${formatEur(f.total)}
            </div>
          </div>
        `;
      }).join('');

    const btActive = this.conciliacioEventActiu && this.conciliacioFacturaActiva;
    const btColor = btActive ? 'var(--sp-blue-100)' : '#CCC';
    const cursor = btActive ? 'pointer' : 'not-allowed';

    return `
      <div style="padding: 24px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #EEE; max-width: 1400px; margin: 0 auto;">
         <button onclick="document.querySelector('gestoria-tauler').canviarVista('bancs')" style="background: white; border: 1px solid #CCC; border-radius: 50%; width: 40px; height: 40px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">←</button>
         <div>
            <h1 style="margin: 0; font-size: 24px; color: var(--sp-blue-100); font-weight: 800;">La Sínia de Conciliació</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">Cerca i vincula els papers pendents amb els diners del riu.</p>
         </div>
         <div style="flex: 1;"></div>
         <button onclick="document.querySelector('gestoria-tauler').executarConciliacio()" style="background-color: ${btColor}; color: white; border: none; padding: 12px 32px; border-radius: 30px; font-weight: bold; font-size: 15px; cursor: ${cursor}; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.2s;">
            VINCULAR (MATCH)
         </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px 24px; max-width: 1400px; margin: 0 auto; min-height: 70vh;">
         
         <!-- Columna Banc -->
         <div style="background: #FAFAFA; border-radius: 12px; border: 1px solid #EEE; display: flex; flex-direction: column;">
            <div style="padding: 20px 24px; border-bottom: 1px solid #EEE; background: white; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
               <div>
                 <h2 style="margin: 0; font-size: 18px; color: #333;">🌊 El Riu (Banc)</h2>
                 <p style="margin: 4px 0 0 0; font-size: 13px; color: #999;">${eventsPendents.length} moviments pendents</p>
               </div>
            </div>
            <div style="padding: 24px; overflow-y: auto; flex: 1; max-height: calc(100vh - 250px);">
               ${htmlEvents}
            </div>
         </div>

         <!-- Columna Factures -->
         <div style="background: #FAFAFA; border-radius: 12px; border: 1px solid #EEE; display: flex; flex-direction: column;">
            <div style="padding: 20px 24px; border-bottom: 1px solid #EEE; background: white; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
               <div>
                 <h2 style="margin: 0; font-size: 18px; color: #333;">📑 Els Papers (Factures)</h2>
                 <p style="margin: 4px 0 0 0; font-size: 13px; color: #999;">${facturesPendents.length} documents pendents</p>
               </div>
            </div>
            <div style="padding: 24px; overflow-y: auto; flex: 1; max-height: calc(100vh - 250px);">
               ${htmlFactures}
            </div>
         </div>

      </div>
    `;
  }

  renderDetallFlexi() {
    return `
      ${this.generarPageHeader('Detall de Depòsit', 'ES35 3058 2595 4939 9800 1348', 'ESTALVIS', 'CAIXAMAR')}
      
      <div style="padding: 0 24px 48px 24px; max-width: 1200px; margin: 0 auto;">
         <button onclick="document.querySelector('gestoria-tauler').canviarVista('bancs')" style="background: white; border: 1px solid #CCC; border-radius: 50%; width: 40px; height: 40px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 24px;">←</button>
         
         <div style="background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 32px;">
            <div style="background: #00796B; color: white; padding: 16px 24px; font-weight: bold; text-align: center; font-size: 14px;">DETALLE DE DEPÓSITO</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #EEE;">
               <!-- Rows -->
               <div style="background: white; padding: 12px 24px; display: flex; flex-direction: column;"><span style="color:#666; font-size:11px;">Número de cuenta</span><span style="font-weight:600; font-size:13px;">ES35 3058 2595 4939 9800 1348 - DEPÓSITOS A PLAZO FIJO</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; flex-direction: column;"></div>
               
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Núm. imposición</span><span style="font-weight:600; font-size:13px;">6042595552</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Cuenta abono</span><span style="font-weight:600; font-size:13px;">ES64 3058 2595 4927 2060 1715</span></div>
               
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Titular</span><span style="font-weight:600; font-size:13px;">FRANCISCO JAVIER LLINARES GARCIA</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Disposición</span><span style="font-weight:600; font-size:13px;">INDISTINTA</span></div>
               
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Fecha apertura/renovación</span><span style="font-weight:600; font-size:13px;">19/01/2026</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Fecha vencimiento</span><span style="font-weight:600; font-size:13px;">19/01/2027</span></div>

               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Periodo renovación</span><span style="font-weight:600; font-size:13px;">ANUAL</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Periodo liquidación</span><span style="font-weight:600; font-size:13px;">AL VENCIMIENTO</span></div>

               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Fecha anterior liquidación</span><span style="font-weight:600; font-size:13px;">19/01/2026</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Fecha próxima liquidación</span><span style="font-weight:600; font-size:13px;">19/01/2027</span></div>

               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Importe</span><span style="font-weight:600; font-size:13px;">80.000,00 eur</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:12px;">Tipo de interés actual</span><span style="font-weight:600; font-size:13px;">1,75 %</span></div>
            </div>
         </div>

         <div style="background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 32px;">
            <div style="background: #00796B; color: white; padding: 16px 24px; font-weight: bold; text-align: center; font-size: 14px;">HISTÓRICO</div>
            <table style="width: 100%; border-collapse: collapse;">
               <tr style="background: #B2DFDB; color: #004D40; font-size: 13px;">
                  <th style="padding: 12px 24px; text-align: center;">Inicio</th>
                  <th style="padding: 12px 24px; text-align: center;">Fin</th>
                  <th style="padding: 12px 24px; text-align: center;">Nº días</th>
                  <th style="padding: 12px 24px; text-align: center;">Tipo interés</th>
               </tr>
               <tr style="font-size: 13px; text-align: center; border-top: 1px solid #EEE;">
                  <td style="padding: 16px 24px;">19/01/2026</td>
                  <td style="padding: 16px 24px;">19/01/2027</td>
                  <td style="padding: 16px 24px;">365</td>
                  <td style="padding: 16px 24px;">1,75 %</td>
               </tr>
            </table>
         </div>

         <div style="background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="background: #00796B; color: white; padding: 16px 24px; font-weight: bold; text-align: center; font-size: 14px;">MOVIMENTS DEL DIPÒSIT</div>
            <table style="width: 100%; border-collapse: collapse;">
               <tr style="background: #B2DFDB; color: #004D40; font-size: 13px;">
                  <th style="padding: 12px 24px; text-align: left;">Núm. Imposición</th>
                  <th style="padding: 12px 24px; text-align: center;">Fecha</th>
                  <th style="padding: 12px 24px; text-align: left;">Concepto</th>
                  <th style="padding: 12px 24px; text-align: left;">Cuenta abono</th>
                  <th style="padding: 12px 24px; text-align: right;">Importe</th>
               </tr>
               <tr style="font-size: 13px; border-top: 1px solid #EEE;">
                  <td style="padding: 16px 24px; text-align: left;">6042595552</td>
                  <td style="padding: 16px 24px; text-align: center;">26/01/2026</td>
                  <td style="padding: 16px 24px; text-align: left;">APERTURA</td>
                  <td style="padding: 16px 24px; text-align: left;">ES64 3058 2595 4927 2060 1715</td>
                  <td style="padding: 16px 24px; text-align: right; color: #2E7D32; font-weight: bold;">84.000,00 EUR</td>
               </tr>
            </table>
         </div>
      </div>
    `;
  }

  renderDetallCapital() {
    const rawData = `45940964	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940965	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940966	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940967	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940968	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940969	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940970	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940971	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940972	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940973	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940974	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940975	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940976	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940977	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940978	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940979	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940980	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940981	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940982	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940983	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940984	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940985	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940986	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940987	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940988	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940989	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940990	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940991	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940992	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940993	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940994	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940995	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940996	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940997	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940998	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
45940999	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
76299630	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172344	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172345	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172346	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172347	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172348	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172349	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172350	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172351	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172352	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172353	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172354	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172355	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172356	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172357	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172358	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
78172359	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322509	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322510	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322511	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322512	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322513	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322514	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322515	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322516	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322517	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322518	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322519	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322520	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322521	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322522	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322523	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
79322524	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111561	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111562	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111563	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111564	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111565	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111566	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111567	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111568	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111569	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111570	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111571	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111572	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111573	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111574	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111575	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111576	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111577	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111578	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111579	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111580	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111581	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111582	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111583	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111584	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111585	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111586	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111587	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111588	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111589	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111590	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111591	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111592	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111593	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111594	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111595	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111596	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111597	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111598	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111599	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111600	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111601	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111602	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111603	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111604	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111605	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111606	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111607	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111608	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111609	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111610	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111611	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111612	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111613	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111614	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111615	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111616	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111617	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111618	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111619	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111620	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111621	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111622	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111623	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111624	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111625	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111626	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111627	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111628	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111629	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111630	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111631	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111632	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111633	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111634	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111635	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111636	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111637	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111638	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111639	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111640	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111641	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111642	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111643	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111644	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111645	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111646	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111647	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111648	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111649	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111650	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111651	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111652	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111653	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111654	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111655	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111656	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111657	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111658	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111659	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111660	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111661	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111662	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111663	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111664	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111665	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111666	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111667	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111668	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111669	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111670	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111671	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111672	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111673	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111674	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111675	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111676	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111677	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111678	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111679	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111680	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111681	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111682	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111683	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111684	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111685	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
95111686	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117717	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117718	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117719	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117720	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117721	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117722	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117723	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117724	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117725	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117726	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117727	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117728	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117729	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117730	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117731	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117732	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117733	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117734	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117735	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117736	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117737	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117738	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117739	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117740	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117741	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117742	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117743	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117744	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117745	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117746	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117747	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117748	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117749	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117750	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117751	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117752	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117753	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117754	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117755	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117756	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117757	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117758	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117759	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117760	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117761	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117762	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117763	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117764	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117765	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117766	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117767	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117768	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117769	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117770	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117771	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117772	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117773	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96117774	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171867	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171868	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171869	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171870	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171871	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171872	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
96171873	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918078	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918079	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918080	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918081	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918082	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918083	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918084	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918085	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918086	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918087	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918088	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918089	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918090	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918091	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918092	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918093	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918094	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918095	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918096	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918097	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918098	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918099	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918100	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918101	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918102	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918103	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918104	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918105	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918106	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918107	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918108	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918109	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918110	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
2100918111	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715
90301213	03/01/2025	13/01/2025	61,00 eur.	ES64 3058 2595 4927 2060 1715`;

    const htmlRows = rawData.trim().split('\n').map(line => {
      const parts = line.split('\t');
      return `<tr style="font-size: 13px; border-top: 1px solid #EEE;">
         <td style="padding: 12px 24px; text-align: left; font-family: monospace;">${parts[0]}</td>
         <td style="padding: 12px 24px; text-align: center;">${parts[1]}</td>
         <td style="padding: 12px 24px; text-align: center;">${parts[2]}</td>
         <td style="padding: 12px 24px; text-align: right; color: #2E7D32; font-weight: bold;">${parts[3]}</td>
         <td style="padding: 12px 24px; text-align: left; color: #666;">${parts[4]}</td>
      </tr>`;
    }).join('');

    return `
      ${this.generarPageHeader('Detall de Capital Social', 'Socio 2253759', 'ESTALVIS', 'CAIXAMAR')}
      
      <div style="padding: 0 24px 48px 24px; max-width: 1200px; margin: 0 auto;">
         <button onclick="document.querySelector('gestoria-tauler').canviarVista('bancs')" style="background: white; border: 1px solid #CCC; border-radius: 50%; width: 40px; height: 40px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 24px;">←</button>
         
         <div style="background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 32px;">
            <div style="background: #00796B; color: white; padding: 16px 24px; font-weight: bold; text-align: center; font-size: 14px;">CONSULTA DE APORTACIONES</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 1px; background: #EEE;">
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between; border-bottom: 1px solid #EEE;"><span style="color:#666; font-size:13px; font-weight: bold;">Número de socio:</span><span style="font-size:13px;">2253759</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between; border-bottom: 1px solid #EEE;"><span style="color:#666; font-size:13px; font-weight: bold;">Número de aportaciones:</span><span style="font-size:13px;">295</span></div>
               <div style="background: white; padding: 12px 24px; display: flex; justify-content: space-between;"><span style="color:#666; font-size:13px; font-weight: bold;">Importe total:</span><span style="font-size:13px;">17.995,00eur.</span></div>
            </div>
         </div>

         <div style="background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 32px;">
            <div style="background: #00796B; color: white; padding: 16px 24px; font-weight: bold; text-align: center; font-size: 14px;">CONSULTA DE LIQUIDACIONES DE APORTACIONES</div>
            <div style="background: #004D40; color: white; padding: 8px 24px; text-align: center; font-size: 12px; font-weight: bold;">Número de socio: 2253759</div>
            <table style="width: 100%; border-collapse: collapse;">
               <tr style="background: #B2DFDB; color: #004D40; font-size: 13px;">
                  <th style="padding: 12px 24px; text-align: center;">Fecha liquidación</th>
                  <th style="padding: 12px 24px; text-align: right;">Importe bruto</th>
                  <th style="padding: 12px 24px; text-align: right;">Retención</th>
                  <th style="padding: 12px 24px; text-align: left;">Cuenta asociada</th>
               </tr>
               <tr style="font-size: 13px; border-top: 1px solid #EEE;">
                  <td style="padding: 16px 24px; text-align: center;">30/06/2025</td>
                  <td style="padding: 16px 24px; text-align: right;">219,49 eur.</td>
                  <td style="padding: 16px 24px; text-align: right;">-41,70 eur.</td>
                  <td style="padding: 16px 24px; text-align: left;">ES64 3058 2595 4927 2060 1715</td>
               </tr>
               <tr style="font-size: 13px; border-top: 1px solid #EEE;">
                  <td style="padding: 16px 24px; text-align: center;">31/12/2025</td>
                  <td style="padding: 16px 24px; text-align: right;">208,65 eur.</td>
                  <td style="padding: 16px 24px; text-align: right;">-39,64 eur.</td>
                  <td style="padding: 16px 24px; text-align: left;">ES64 3058 2595 4927 2060 1715</td>
               </tr>
            </table>
            <div style="padding: 12px; text-align: center; color: #00796B; font-size: 11px;">
               No se efectuará retención en caso de cumplir los requisitos expuestos en la legislación vigente.
            </div>
         </div>
      </div>
    `;
  }

  buildVendesChart() {
    let factures = [];
    if (this.dades && this.dades.factures) {
        factures = this.dades.factures;
    }

    // Filtrar només ingressos (Vendes)
    const vendes = factures.filter(f => f.type === 'INGRES');

    // Agrupar per client i per mes (0-11)
    let dadesClientMes = {};
    
    vendes.forEach(f => {
        const client = f.contact_name || f.contact_nif || 'Desconegut';
        const date = new Date(f.date_timestamp);
        const mes = date.getMonth();
        
        if (!dadesClientMes[client]) {
            dadesClientMes[client] = { total: 0, mesos: new Array(12).fill(0) };
        }
        
        const totalNum = parseFloat(f.total) || 0;
        dadesClientMes[client].mesos[mes] += totalNum;
        dadesClientMes[client].total += totalNum;
    });

    // Ordenar clients per total facturat
    let clientsOrdenats = Object.keys(dadesClientMes).sort((a, b) => dadesClientMes[b].total - dadesClientMes[a].total);

    const colors = ['#4A47E5', '#26A69A', '#7E57C2', '#EC407A', '#FFA726']; // Colors per al gràfic

    // --- Construir SVG (Muntanyes) ---
    // Només mostrem els 3 primers per no ofegar el gràfic si hi ha molts
    const topClientsGraph = clientsOrdenats.slice(0, 3);
    
    // Buscar el màxim valor mensual per escalar el gràfic
    let maxVendaMes = 100; // Mínim 100 per no dividir per 0
    topClientsGraph.forEach(client => {
        const maxClient = Math.max(...dadesClientMes[client].mesos);
        if (maxClient > maxVendaMes) maxVendaMes = maxClient;
    });

    const svgHeight = 250;
    const svgWidth = 1000;
    const paddingX = 40;
    const paddingY = 20;
    const gHeight = svgHeight - (paddingY * 2);
    const gWidth = svgWidth - (paddingX * 2);
    const stepX = gWidth / 11;

    let svgLines = '';
    let svgAreas = '';
    
    topClientsGraph.forEach((client, idx) => {
        const color = colors[idx % colors.length];
        const mesos = dadesClientMes[client].mesos;
        
        let points = [];
        mesos.forEach((val, mesIdx) => {
            const x = paddingX + (mesIdx * stepX);
            const y = paddingY + gHeight - ((val / maxVendaMes) * gHeight);
            points.push(`${x},${y}`);
        });
        
        const pointStr = points.join(' ');
        const fillPoints = `${paddingX},${paddingY + gHeight} ${pointStr} ${paddingX + gWidth},${paddingY + gHeight}`;

        // Àrea semitransparent
        svgAreas += `<polygon points="${fillPoints}" fill="${color}" fill-opacity="0.2" />`;
        // Línia i punts
        svgLines += `<polyline points="${pointStr}" fill="none" stroke="${color}" stroke-width="2" />`;
        
        points.forEach(p => {
            const [cx, cy] = p.split(',');
            svgLines += `<circle cx="${cx}" cy="${cy}" r="4" fill="${color}" stroke="#FFF" stroke-width="1.5" />`;
        });
    });

    const mesosNoms = ['Gen 26', 'Feb 26', 'Març 26', 'Abr 26', 'Maig 26', 'Juny 26', 'Jul 26', 'Ago 26', 'Set 26', 'Oct 26', 'Nov 26', 'Des 26'];
    let xAxisHtml = '';
    for (let i = 0; i < 12; i++) {
        const x = paddingX + (i * stepX);
        xAxisHtml += `<text x="${x}" y="${svgHeight - 2}" text-anchor="middle" font-size="10" fill="#999">${mesosNoms[i]}</text>`;
    }
    
    // Eix Y (Marques referència)
    let yAxisHtml = `
       <text x="${paddingX - 5}" y="${paddingY + 5}" text-anchor="end" font-size="10" fill="#999">${maxVendaMes.toFixed(0)}</text>
       <text x="${paddingX - 5}" y="${paddingY + (gHeight/2) + 5}" text-anchor="end" font-size="10" fill="#999">${(maxVendaMes/2).toFixed(0)}</text>
       <text x="${paddingX - 5}" y="${paddingY + gHeight + 5}" text-anchor="end" font-size="10" fill="#999">0</text>
       
       <line x1="${paddingX}" y1="${paddingY}" x2="${svgWidth - paddingX}" y2="${paddingY}" stroke="#EEE" stroke-width="1" />
       <line x1="${paddingX}" y1="${paddingY + (gHeight/2)}" x2="${svgWidth - paddingX}" y2="${paddingY + (gHeight/2)}" stroke="#EEE" stroke-width="1" stroke-dasharray="4" />
       <line x1="${paddingX}" y1="${paddingY + gHeight}" x2="${svgWidth - paddingX}" y2="${paddingY + gHeight}" stroke="#CCC" stroke-width="1" />
    `;

    const chartSvg = `
      <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        ${yAxisHtml}
        ${xAxisHtml}
        ${svgAreas}
        ${svgLines}
      </svg>
    `;

    // --- Construir Taula Desglossada (Matriu) ---
    let formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);
    let rowsHtml = '';
    let totalsMesos = new Array(12).fill(0);
    
    if (clientsOrdenats.length === 0) {
        rowsHtml = `<tr><td colspan="14" style="text-align: center; color: #999; padding: 24px;">No hi ha dades de vendes.</td></tr>`;
    } else {
        clientsOrdenats.forEach((client, idx) => {
            const data = dadesClientMes[client];
            const colorDot = idx < 3 ? `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${colors[idx]}; margin-right:8px;"></span>` : '';
            
            let mesosHtml = '';
            for (let i = 0; i < 12; i++) {
                const val = data.mesos[i];
                totalsMesos[i] += val;
                mesosHtml += `<td style="text-align: right; font-size: 11px; color: ${val === 0 ? '#CCC' : '#333'}; padding: 12px 8px;">${val === 0 ? '0,00' : formatEur(val)}</td>`;
            }

            rowsHtml += `
                <tr style="border-bottom: 1px solid #EEE;">
                  <td style="padding: 12px 16px; font-weight: 600; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">
                    ${colorDot}${client}
                  </td>
                  ${mesosHtml}
                  <td style="text-align: right; font-weight: bold; font-size: 11px; padding: 12px 16px; background: #FAFAFA;">${formatEur(data.total)}</td>
                </tr>
            `;
        });
        
        // Row for total general
        let totalGeneral = totalsMesos.reduce((a, b) => a + b, 0);
        let totalsRowHtml = '';
        for (let i = 0; i < 12; i++) {
            totalsRowHtml += `<td style="text-align: right; font-weight: 900; font-size: 11px; padding: 12px 8px;">${totalsMesos[i] === 0 ? '0,00' : formatEur(totalsMesos[i])}</td>`;
        }
        
        rowsHtml += `
            <tr style="border-top: 2px solid var(--sp-border); background: var(--sp-white-50);">
                <td style="padding: 12px 16px; font-weight: 900; font-size: 12px;">Total Vendes</td>
                ${totalsRowHtml}
                <td style="text-align: right; font-weight: 900; font-size: 12px; padding: 12px 16px;">${formatEur(totalGeneral)}</td>
            </tr>
        `;
    }

    const htmlBody = `
      ${this.generarPageHeader('Informes', 'Vendes per Client', 'ANALÍTICA', 'INFORMES')}
      
      <div style="padding: 0 24px 48px 24px; max-width: 1400px; margin: 0 auto;">
        
        <!-- Contenidor Gràfic -->
        <div style="background-color: white; border: 1px solid var(--sp-border); border-radius: 12px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
               <h3 style="margin: 0; color: var(--sp-blue-100); display: flex; align-items: center; gap: 8px;">
                 <span style="font-size: 20px;">📈</span> Evolució Anual de Vendes
               </h3>
            </div>
            <div style="padding: 24px 0;">
               ${chartSvg}
            </div>
        </div>

        <!-- Matriu Mensual -->
        <div style="background-color: white; border: 1px solid var(--sp-border); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 1000px;">
                <thead>
                    <tr style="background-color: var(--sp-white-50); border-bottom: 1px solid var(--sp-border);">
                        <th style="text-align: left; padding: 16px; font-size: 11px; color: #666;">CLIENT</th>
                        ${mesosNoms.map(m => `<th style="text-align: right; padding: 16px 8px; font-size: 11px; color: #666;">${m}</th>`).join('')}
                        <th style="text-align: right; padding: 16px; font-size: 11px; color: #666; background: #FAFAFA;">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>

      </div>
    `;

    return htmlBody;
  }

  renderImpostos() {
    let factures = [];
    if (this.dades && this.dades.factures) {
        factures = this.dades.factures;
    }

    // Inicialitzar trimestres
    const trimestres = [
        { id: 1, nom: '1 trimestre', sostingut: 0, sortida: 0, resultat: 0, estat: 'Pendents' },
        { id: 2, nom: '2 trimestre', sostingut: 0, sortida: 0, resultat: 0, estat: 'Pendents' },
        { id: 3, nom: '3 trimestre', sostingut: 0, sortida: 0, resultat: 0, estat: 'Pendents' },
        { id: 4, nom: '4 trimestre', sostingut: 0, sortida: 0, resultat: 0, estat: 'Pendents' }
    ];

    let totalSostingut = 0;
    let totalSortida = 0;
    let anyActual = new Date().getFullYear();

    factures.forEach(f => {
        const date = new Date(f.date_timestamp);
        // Si volem filtrar per anyActual ací es podria fer if(date.getFullYear() === anyActual)
        
        const mes = date.getMonth();
        let triIndex = 0;
        if (mes >= 3 && mes <= 5) triIndex = 1;
        else if (mes >= 6 && mes <= 8) triIndex = 2;
        else if (mes >= 9 && mes <= 11) triIndex = 3;

        let ivaNum = parseFloat(f.iva) || 0;
        
        if (f.type === 'GASTO') {
            trimestres[triIndex].sostingut += ivaNum;
            totalSostingut += ivaNum;
        } else if (f.type === 'INGRES') {
            trimestres[triIndex].sortida += ivaNum;
            totalSortida += ivaNum;
        }
    });

    let formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

    let rowsHtml = trimestres.map(t => {
        t.resultat = t.sortida - t.sostingut;
        let colorResultat = t.resultat > 0 ? 'var(--sp-red-100)' : 'var(--sp-green-100)';
        return `
            <tr>
              <td style="font-weight: bold; color: var(--sp-blue-100);">${t.nom}</td>
              <td style="text-align: right;">${formatEur(t.sostingut)}</td>
              <td style="text-align: right;">${formatEur(t.sortida)}</td>
              <td style="text-align: right; font-weight: bold; color: ${colorResultat};">${formatEur(t.resultat)}</td>
              <td style="text-align: center;">
                <span style="background-color: #FFF3E0; color: #E65100; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">
                  ${t.estat}
                </span>
              </td>
            </tr>
        `;
    }).join('');

    // Row for totals
    let totalResultat = totalSortida - totalSostingut;
    let totalColorResultat = totalResultat > 0 ? 'var(--sp-red-100)' : 'var(--sp-green-100)';

    return `
      ${this.generarPageHeader('Impostos', 'Gestió Fiscal (Model 303 i 130)', 'GESTORIA', 'IMPOSTOS')}
      
      <div style="padding: 0 24px; max-width: 1400px; margin: 0 auto; display: flex; gap: 32px; flex-wrap: wrap;">
        
        <!-- Targetes Laterals -->
        <div style="flex: 1; min-width: 250px; max-width: 300px;">
          <h3 style="color: var(--sp-blue-100); margin-top: 0;">Els propers impostos</h3>
          
          <div style="background-color: white; border: 1px solid var(--sp-border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="padding: 16px; display: flex; align-items: center; gap: 16px;">
               <div style="background-color: #E8F5E9; color: #2E7D32; font-weight: 900; font-size: 20px; padding: 12px; border-radius: 8px;">303</div>
               <div>
                 <div style="font-weight: bold; font-size: 14px;">Modelo 303 trimestral</div>
                 <div style="font-size: 12px; color: #E65100; margin-top: 4px;">2 trimestre Pendents</div>
               </div>
            </div>
          </div>

          <div style="background-color: white; border: 1px solid var(--sp-border); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="padding: 16px; display: flex; align-items: center; gap: 16px;">
               <div style="background-color: #E3F2FD; color: #1565C0; font-weight: 900; font-size: 20px; padding: 12px; border-radius: 8px;">130</div>
               <div>
                 <div style="font-weight: bold; font-size: 14px;">Modelo 130</div>
                 <div style="font-size: 12px; color: #E65100; margin-top: 4px;">2 trimestre Pendents</div>
               </div>
            </div>
          </div>
        </div>

        <!-- Taula Central -->
        <div style="flex: 3; min-width: 600px;">
          <div style="background-color: white; border-radius: 12px; border: 1px solid var(--sp-border); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Header Taula -->
            <div style="padding: 16px 24px; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between; align-items: center;">
               <h2 style="margin: 0; font-size: 18px; color: var(--sp-blue-100); display: flex; align-items: center; gap: 8px;">
                 <span style="background-color: #E8F5E9; color: #2E7D32; padding: 4px 8px; border-radius: 4px; font-size: 14px;">303</span>
                 303 Trimestral
               </h2>
               <div style="background: var(--sp-white-50); padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; border: 1px solid #DDD;">
                 ${anyActual}
               </div>
            </div>

            <!-- Cos Taula -->
            <table class="taula-pedra-seca" style="margin-top: 0; border: none;">
              <thead>
                <tr style="background-color: var(--sp-white-50);">
                  <th style="border-top: none; padding-left: 24px; font-size: 11px; color: #666;">Període</th>
                  <th style="text-align: right; border-top: none; font-size: 11px; color: #666;">Impost sostingut</th>
                  <th style="text-align: right; border-top: none; font-size: 11px; color: #666;">Impost a la sortida</th>
                  <th style="text-align: right; border-top: none; font-size: 11px; color: #666;">Resultat fiscal</th>
                  <th style="text-align: center; border-top: none; font-size: 11px; color: #666;">Estat</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr style="background-color: var(--sp-white-50); border-top: 2px solid var(--sp-black-100);">
                  <td style="font-weight: 900; padding-left: 24px;">Total</td>
                  <td style="text-align: right; font-weight: 900;">${formatEur(totalSostingut)}</td>
                  <td style="text-align: right; font-weight: 900;">${formatEur(totalSortida)}</td>
                  <td style="text-align: right; font-weight: 900; color: ${totalColorResultat};">${formatEur(totalResultat)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderCashflow(vista) {
    const titol = vista === 'caixa-real' ? 'Caixa Real' : 'El Rebost';
    const subtitol = vista === 'caixa-real' ? 'Evolució Saldo Bancari' : 'Pla Financer i Cashflow';
    
    // SVG Natiu simulant el gràfic de línies de Holded
    const svgGraph = `
      <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" style="margin-top: 24px;">
        <!-- Graella fons -->
        <line x1="0" y1="50" x2="1000" y2="50" stroke="#F0F0F0" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="100" x2="1000" y2="100" stroke="#F0F0F0" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="150" x2="1000" y2="150" stroke="#F0F0F0" stroke-width="1" stroke-dasharray="4" />
        
        <!-- Línia Escenari Principal (Blau) -->
        <polyline points="0,50 100,50 200,52 300,52 400,53 500,53 600,55 700,55 800,58 900,60 1000,60" fill="none" stroke="var(--sp-blue-100)" stroke-width="3" stroke-linecap="round" />
        <!-- Punts de la línia blava -->
        <circle cx="100" cy="50" r="4" fill="var(--sp-blue-100)" />
        <circle cx="300" cy="52" r="4" fill="var(--sp-blue-100)" />
        <circle cx="500" cy="53" r="4" fill="var(--sp-blue-100)" />
        <circle cx="700" cy="55" r="4" fill="var(--sp-blue-100)" />
        
        <!-- Projecció futura línia blava (Puntejada) -->
        <polyline points="700,55 800,58 900,60 1000,60" fill="none" stroke="var(--sp-blue-100)" stroke-width="3" stroke-dasharray="6" stroke-linecap="round" />
        
        <!-- Línia Sortides (Roig) -->
        <polyline points="0,180 100,180 200,178 300,175 400,170 500,170 600,170 700,170" fill="none" stroke="var(--sp-red-100)" stroke-width="2" stroke-linecap="round" />
        <!-- Projecció futura línia roja -->
        <polyline points="700,170 800,165 900,160 1000,160" fill="none" stroke="var(--sp-red-100)" stroke-width="2" stroke-dasharray="4" stroke-linecap="round" />
        
        <circle cx="100" cy="180" r="3" fill="var(--sp-red-100)" />
        <circle cx="300" cy="175" r="3" fill="var(--sp-red-100)" />
      </svg>
    `;

    // Taula de matriu mensual
    const taulaMesos = `
      <div style="overflow-x: auto; margin-top: 32px; border: 1px solid var(--sp-border); border-radius: 12px; background: white;">
        <table style="width: 100%; border-collapse: collapse; min-width: 900px;">
          <thead>
            <tr style="background: var(--sp-white-50); border-bottom: 1px solid var(--sp-border);">
              <th style="text-align: left; padding: 12px 24px; font-size: 13px; color: #666; font-weight: 600;">Comptes</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666;">Gen. 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666;">Feb. 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666;">Març 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666;">Abr. 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666;">Maig 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666; border-bottom: 2px solid var(--sp-blue-100);">Juny 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666; background: #FAFAFA;">Jul. 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666; background: #FAFAFA;">Ago. 26</th>
              <th style="text-align: right; padding: 12px; font-size: 11px; color: #666; background: #FAFAFA;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #EEE;">
              <td style="padding: 12px 24px; font-weight: bold; font-size: 14px;">Saldo inicial</td>
              <td style="text-align: right; padding: 12px; font-size: 13px;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999; background: #FAFAFA;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999; background: #FAFAFA;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEE;">
              <td style="padding: 12px 24px; font-size: 13px; color: #555;">Moviments d'Ingressos</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #CCC; background: #FAFAFA;">-</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #CCC; background: #FAFAFA;">-</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">0/0</td>
            </tr>
            <tr style="border-bottom: 1px solid #EEE;">
              <td style="padding: 12px 24px; font-size: 13px; color: #555;">Moviments de Despeses</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #999;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">0</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #CCC; background: #FAFAFA;">-</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #CCC; background: #FAFAFA;">-</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">0/0</td>
            </tr>
            <tr style="background: var(--sp-white-50);">
              <td style="padding: 12px 24px; font-weight: 900; font-size: 14px; color: var(--sp-blue-100);">Saldo Final</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: bold;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: 900; color: var(--sp-blue-100);">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-style: italic; color: #999; background: #FAFAFA;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-style: italic; color: #999; background: #FAFAFA;">1.7K</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; font-weight: 900;">1.7K</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return `
      ${this.generarPageHeader(titol, subtitol, 'GESTORIA', 'CASHFLOW')}
      
      <div style="padding: 0 24px 48px 24px; max-width: 1400px; margin: 0 auto;">
        <!-- Header Cashflow -->
        <div style="background-color: var(--sp-blue-100); color: white; padding: 24px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
           <div>
             <h2 style="margin: 0; font-size: 20px;">Desbloqueja el potencial del flux d'efectiu</h2>
             <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 14px;">Visualitza les projeccions financeres i anticipa't als impostos de forma totalment offline.</p>
           </div>
           <button style="background: white; color: var(--sp-blue-100); border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer;">Veure més x</button>
        </div>

        <!-- Estat Actual -->
        <div style="margin-top: 32px; display: flex; gap: 48px;">
           <div>
             <div style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold;">Aquest mes</div>
             <div style="font-size: 14px; color: #333; margin-top: 8px;">Saldo actual</div>
             <div style="font-size: 32px; font-weight: 900; color: var(--sp-blue-100); line-height: 1.1;">
                ${this.dades ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(this.dades.saldo) : '1.734,47 €'}
             </div>
           </div>
           
           <div style="flex: 1; min-width: 0;">
             <div style="display: flex; gap: 16px; justify-content: flex-end; align-items: center;">
                <span style="font-size: 13px; font-weight: bold; color: var(--sp-blue-100); display: flex; align-items: center; gap: 4px;"><span style="display:inline-block; width:12px; height:12px; background:var(--sp-blue-100); border-radius:2px;"></span> Escenari principal</span>
                <span style="font-size: 13px; font-weight: bold; color: var(--sp-red-100); display: flex; align-items: center; gap: 4px;"><span style="display:inline-block; width:12px; height:12px; background:var(--sp-red-100); border-radius:2px;"></span> Sortides</span>
             </div>
             ${svgGraph}
           </div>
        </div>

        ${taulaMesos}
      </div>
    `;
  }

  renderEnConstruccio(titol) {
    return `
      ${this.generarPageHeader(titol.toUpperCase(), 'Mòdul en construcció')}
      
      <div class="zona-drop">
        <h1>🛠️ S'està coent al forn</h1>
        <p>Aquest mòdul està esperant la màgia d'Antigravity.</p>
      </div>
    `;
  }
  iniciarGeneracioCsv() {
    if (!this.dades || !this.dades.factures || this.dades.factures.length === 0) {
      alert("No hi ha factures per a generar cap trimestre. Puja un CSV primer.");
      return;
    }

    // Lògica del Sentinella Auditor (Intel·ligència)
    const facturesGasto = this.dades.factures.filter(f => f.type === 'GASTO');
    const agrupatsPerContacte = {};
    
    // Noms/Paraules clau de subministraments recurrents (1 al mes = 3 al trimestre)
    const recurrents = ['lowi', 'iberdrola', 'som energia', 'aigua', 'llum', 'gas', 'vodafone', 'orange', 'movistar', 'assegurança', 'seguros'];
    
    facturesGasto.forEach(f => {
      const nom = (f.contact_name || f.contact_nif || 'Desconegut').toLowerCase();
      if (!agrupatsPerContacte[nom]) {
         agrupatsPerContacte[nom] = { nomOriginal: f.contact_name || f.contact_nif, count: 0 };
      }
      agrupatsPerContacte[nom].count++;
    });

    const avisos = [];
    Object.keys(agrupatsPerContacte).forEach(key => {
       const isRecurrent = recurrents.some(r => key.includes(r));
       const count = agrupatsPerContacte[key].count;
       // Si és recurrent i no n'hi ha 3 (suposant que mirem 1 trimestre, la demo té pocs arxius però apliquem la lògica)
       if (isRecurrent && count > 0 && count < 3) {
          avisos.push(`⚠️ <b>${agrupatsPerContacte[key].nomOriginal}</b>: S'esperaven 3 rebuts i només en tens ${count}. Falta factura.`);
       }
    });

    // Per defecte a la nostra simulació segurament faltaran perquè no en vam carregar 3 de cadascú. 
    // Això ens ve de perles per a mostrar la intel·ligència.
    if (avisos.length > 0) {
       this.mostrarModalAuditoria(avisos);
    } else {
       // Tot quadra
       this.generarCsv();
    }
  }

  mostrarModalAuditoria(avisos) {
    const existent = this.shadowRoot.getElementById('modal-auditoria');
    if (existent) existent.remove();

    const llistaHtml = avisos.map(a => `<li style="margin-bottom: 12px; color: #E65100;">${a}</li>`).join('');

    const html = `
      <div id="modal-auditoria" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(4px);">
        <div style="background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="font-size: 32px;">🧠</div>
            <div>
              <h2 style="margin: 0; color: var(--sp-blue-100); font-size: 20px;">Sentinella Auditor</h2>
              <p style="margin: 0; color: #666; font-size: 13px;">Revisió de patrons recurrents del trimestre</p>
            </div>
          </div>
          
          <div style="background: #FFF3E0; border-left: 4px solid var(--sp-orange-100); padding: 16px; border-radius: 4px; margin-bottom: 24px;">
             <p style="margin: 0 0 12px 0; font-weight: bold; color: #E65100;">S'han detectat anomalies en les teues factures:</p>
             <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                ${llistaHtml}
             </ul>
          </div>

          <p style="color: #555; font-size: 14px; margin-bottom: 24px;">Pots generar el trimestre igualment, però el teu gestor et reclamarà eixos rebuts. Vols continuar?</p>

          <div style="display: flex; gap: 16px; justify-content: flex-end;">
             <button onclick="document.querySelector('gestoria-tauler').tancarModalAuditoria()" style="background: #F5F5F5; border: 1px solid #CCC; color: #333; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Cancel·lar i cercar</button>
             <button onclick="document.querySelector('gestoria-tauler').tancarModalAuditoria(); document.querySelector('gestoria-tauler').generarCsv()" style="background: var(--sp-blue-100); border: none; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Generar igualment</button>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = html;
    this.shadowRoot.appendChild(div.firstElementChild);
  }

  tancarModalAuditoria() {
    const modal = this.shadowRoot.getElementById('modal-auditoria');
    if (modal) modal.remove();
  }

  generarCsv() {
    if (!this.dades || !this.dades.factures) return;

    let csvContent = "Data,Tipus,Client_Proveidor,NIF,Concepte,Base_Imposable,IVA,Total\n";
    
    this.dades.factures.forEach(f => {
       const d = new Date(f.date_timestamp);
       const dataStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
       const tipus = f.type === 'INGRES' ? 'Venda' : 'Compra';
       const contacte = f.contact_name ? f.contact_name.replace(/,/g, '') : '';
       const nif = f.contact_nif || '';
       const concepte = f.desc ? f.desc.replace(/,/g, ' ') : '';
       const bi = f.base_imposable || 0;
       const iva = (f.total || 0) - bi;
       const total = f.total || 0;

       csvContent += `${dataStr},${tipus},${contacte},${nif},${concepte},${bi.toFixed(2)},${iva.toFixed(2)},${total.toFixed(2)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SdP_Facturacio_Trimestre_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

customElements.define('gestoria-tauler', GestoriaTauler);
