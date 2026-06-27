const fs = require('fs');
const htmlFile = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html';
let html = fs.readFileSync(htmlFile, 'utf8');

const contentMap = {
  "21": {
    sysName: "sosp_border_radius_token",
    desc: "El radi de classe mundial de Sóc de Poble és de 28px. Aquesta mètrica suavitza les estructures rurals aportant la tendresa termodinàmica de La Boina. No es negocia.",
    demo: "<div style='width:100%; height:80px; background:#fafafa; border:2px dashed #ccc; border-radius: 28px; display:flex; align-items:center; justify-content:center;font-weight:bold;'>Radi: 28px</div>"
  },
  "23": {
    sysName: "sosp_button_outline / sosp_button_ghost",
    desc: "Botons d'acció secundària. Sense fons massís. Serveixen per a cancel·lar operacions o tornar enrere al camp quan el foraster s'equivoca de drecera.",
    demo: "<div style='display:flex; gap:10px;'><button class='sosp-button' style='background:transparent; border:2px solid var(--sosp-blue); color:var(--sosp-blue); height:56px; padding:0 32px;'>CANCEL·LA</button></div>"
  },
  "24": {
    sysName: "sosp_fab_primary (Floating Action Button)",
    desc: "El Botó d'Acció Flotant. L'únic element que no respecta la jerarquia horitzontal i sura eternament a la dreta inferior. Acciona la publicació de bans o tasques vitals.",
    demo: "<div style='position:relative; width:100%; height:100px; background:#eee; border-radius:12px;'><button style='position:absolute; bottom:20px; right:20px; background:var(--sosp-blue); color:white; border:none; border-radius:28px; width:64px; height:64px; font-weight:bold; font-size:24px;'>+</button></div>"
  },
  "25": {
    sysName: "sosp_switch_rural / sosp_checkbox",
    desc: "Sistemes binaris: Obert/Tancat, Tancat/Obert. Substitueix els complexos formularis burocràtics. El canvi d'estat a 'Obert' genera una onomatopeia mental en l'usuari.",
    demo: "<div style='display:flex; align-items:center; gap:10px; font-size:14pt; padding:20px; border:1px solid #ccc; border-radius:28px;'><div style='width:52px; height:32px; border-radius:16px; background:var(--sosp-blue); position:relative;'><div style='width:24px; height:24px; border-radius:12px; background:white; position:absolute; right:4px; top:4px;'></div></div> Activar Mode Bancal</div>"
  },
  "26": {
    sysName: "sosp_input_text_field",
    desc: "Entrada de text curt. Per introduir un DNI, nom de veí o número d'edifici. Mai usar per a relats; el veí pateix fatiga tàctil ràpid.",
    demo: "<input type='text' style='width:100%; height:64px; border-radius:28px; border:2px solid #ddd; padding:0 24px; font-size:16px; font-family:\"Noto Sans\";' placeholder='Escriu el teu malnom...'>"
  },
  "27": {
    sysName: "sosp_textarea_multiline",
    desc: "Caixes de text de gran longitud. Pensades per a les queixes infinites de comunitat o cròniques municipals llargues on cal desaforar-se.",
    demo: "<textarea style='width:100%; min-height:120px; border-radius:28px; border:2px solid #ddd; padding:24px; font-size:16px; font-family:\"Noto Sans\";' placeholder='Explica el problema amb la séquia...'></textarea>"
  },
  "28": {
    sysName: "sosp_state_error / sosp_alert_banner",
    desc: "Quan el poble entra en pànic (falla la connexió Wifi del casino). El Taronja trenca la rutina blava per indicar col·lapse imminent de serveis.",
    demo: "<div style='background:var(--sosp-orange); color:var(--sosp-black); padding:24px; border-radius:28px; font-weight:bold; width:100%;'>⚠ CONFLICTE DETECTAT: Fila bloquejada pel tractor!</div>"
  },
  "29": {
    sysName: "sosp_chip_tag",
    desc: "Etiquetes de metadata que defineixen ràpid l'estat d'un trasto: 'KMO', 'URGENT', 'FORASTER'. No s'han de subestimar: classifiquen l'univers.",
    demo: "<div style='display:flex; gap:10px;'><span style='background:#eee; color:#333; padding:8px 16px; border-radius:20px; font-size:12px; font-weight:700;'>🍅 KM 0</span><span style='background:var(--sosp-blue); color:#fff; padding:8px 16px; border-radius:20px; font-size:12px; font-weight:700;'>ALERTA VEÏNAL</span></div>"
  },
  "30": {
    sysName: "sosp_icon_set_cívic_1",
    desc: "Iconografia purista basada en formes geomètriques de 24x24px, escalables manualment. Mantindre un stroke gross de 2.5px perquè siguen llegibles en iPads trencats per l'edifici.",
    demo: "<div style='padding:20px; text-align:center;'><em>Vegeu manual d'icones global per mapes estructurals</em></div>"
  },
  "31": {
    sysName: "sosp_icon_set_cívic_2",
    desc: "Segona part de la matriu d'icones: Avatars, supermercat, elements climàtics i advertències sonores. Els traços segueixen tancant als 28 graus.",
    demo: "<div>...</div>"
  },
  "32": {
    sysName: "sosp_loader_spinner / sosp_avatar_circle",
    desc: "Element giratori d'espera i cercles d'identitat. Mentre el Foraster pateix la lentitud del 3G de muntanya, el Loader apaivaga la seua tensió vascular.",
    demo: "<div style='display:flex; gap:30px; align-items:center;'><div style='width:64px; height:64px; border-radius:32px; border:4px solid #eee; border-top-color:var(--sosp-blue); background:transparent;'></div> <div style='width:64px; height:64px; border-radius:32px; background:var(--sosp-orange);'></div></div>"
  },
  "33": {
    sysName: "sosp_bando_banner",
    desc: "L'antic Ban Municipal portat al segle XXI. Banderoles grans d'avisos que travessen tota la interfície d'esquerra a dreta, tallant el flux visual rutinari.",
    demo: "<div style='width:100%; border-radius:0px; background:var(--sosp-black); color:white; padding:20px; font-size:16pt; font-weight:bold; letter-spacing:1px; text-align:center;'>BAND MUNICIPAL: TALL D'AIGUA</div>"
  },
  "34": {
    sysName: "sosp_card_mur_standard",
    desc: "El totxo arquitectònic del Mur Social. Contenidor massís on la gent comparteix notícies d'esqueles, obres al carrer o fotos del pato al balcó.",
    demo: "<div class='sosp-card' style='background:white; border:2px solid #000; padding:30px;'><h3 style='margin:0 0 10px 0;'>Nova Cimentació al Carrer Nou</h3><p>La cimentadora estarà de 8h a 14h. Lleveu els cotxes o correran la sort del formigó.</p></div>"
  },
  "35": {
    sysName: "sosp_card_mediabox",
    desc: "Com la Card del Mur, però capaç de pre-carregar i suportar les il·lustracions del Nano en proporció 1:1. Visualment molt més pesada, crida a fer tap.",
    demo: "<div class='sosp-card' style='background:white; border:2px solid #000; overflow:hidden;'><div style='width:100%; height:200px; background:var(--sosp-blue); display:flex; color:white; align-items:center; justify-content:center; font-weight:900;'>[ IMATGE NANO 1:1 ]</div><div style='padding:20px;'><h3>Festes del Barri Mestre</h3></div></div>"
  },
  "36": {
    sysName: "sosp_card_market_item",
    desc: "Targeta híbrida dissenyada per a vorejar un format de botiga (Ecommerce KM.0). Preus i pes ràpids d'un cop d'ull.",
    demo: "<div style='display:flex; border:2px solid #000; border-radius:28px; padding:20px; gap:20px;'><div style='width:80px; height:80px; background:var(--sosp-orange); border-radius:20px;'></div><div><h3>Tomata de Penjar</h3><p style='font-size:20pt; font-weight:bold;'>2,50€ / Kg</p></div></div>"
  },
  "37": {
    sysName: "sosp_directory_shortcut",
    desc: "Dreceres que concentren tota l'estructura. Botons gegants amb només un pictograma. Ideal polze gros de manobre.",
    demo: "<div style='width:120px; height:120px; border-radius:28px; background:var(--sosp-blue); color:white; display:flex; align-items:center; justify-content:center; flex-direction:column;'><div style='font-size:30pt;'>⚙️</div><div style='font-weight:bold; margin-top:10px;'>AJUDA</div></div>"
  },
  "38": {
    sysName: "sosp_searchbar_expanded",
    desc: "Cerca de dades massiva que desplega suggestions a mesura que l'usuari tecleja desorientat. Un llogaret de funcions AJAX rurals.",
    demo: "<div style='position:relative; width:100%; border:2px solid #000; border-radius:28px; padding:20px; font-weight:bold; background:#fff;'>🔍 Troba l'alcalde, una cadira perduda...</div>"
  },
  "39": {
    sysName: "sosp_list_accordion",
    desc: "Amaga allò que el foraster no necessita vore immediatament per estalviar càrrega cognitiva (i termodinàmica: estalvia renders).",
    demo: "<div style='border:2px solid #ddd; border-radius:28px; padding:20px; font-weight:bold; display:flex; justify-content:space-between;'><span>Historial de Multes Llevades</span><span>▼</span></div>"
  },
  "40": {
    sysName: "sosp_list_selector",
    desc: "Variants de llistats per premsar l'opinió. Selector d'1 o 0 de format radio abotonat.",
    demo: "<div>...</div>"
  },
  "41": {
    sysName: "sosp_dialog_modal",
    desc: "Mòdul intransigent que bloqueja totalment el cel rústic de l'aplicació sota un overlay negre per obligar a llegir una resolució.",
    demo: "<div style='position:relative; width:100%; height:200px; background:#ddd; display:flex; align-items:center; justify-content:center; border-radius:28px;'><div style='width:80%; padding:30px; background:white; border-radius:28px; box-shadow:0 10px 20px rgba(0,0,0,0.2);'><h3>Ací Manem Nosaltres</h3><button class='sosp-button' style='background:var(--sosp-black); color:white; width:100%; padding:15px; border-radius:20px;'>DEDOS ACEPTAR</button></div></div>"
  },
  "42": {
    sysName: "sosp_snackbar_toast",
    desc: "Missatges passatgers d'inferior temporalitat. Informen d'accions fetes en silenci però necessàries, deixant que el llaurador respire lliurement.",
    demo: "<div style='width:80%; margin:0 auto; padding:20px; background:#333; color:white; border-radius:20px; font-size:11pt; text-align:center;'>Connexió amb Tia Maria establida (200ms)</div>"
  },
  "43": {
    sysName: "sosp_organism_appbar (La Boina)",
    desc: "La Boina ho tapa i corona tot. És el Global App Bar de navegació híbrida. Ha de contindre la tipografia màxima de marca al seu rovell central.",
    demo: "<div>...</div>"
  },
  "44": {
    sysName: "sosp_organism_bottom_nav (La Botinera)",
    desc: "Resistint tot el pes de la pàgina a baix, just on cau el suor, es col·loca el menú de les botines. Fixe en posició absoluta inferior.",
    demo: "<div style='width:100%; height:80px; background:#fff; border-top:2px solid #ccc; display:flex; justify-content:space-around; align-items:center; padding-bottom:10px; font-weight:bold;'><div style='color:var(--sosp-blue)'>🏠 POBLE</div><div style='color:#ccc'>🗂 BÚSTIA</div><div style='color:#ccc'>⚙️ EINES</div></div>"
  },
  "45": {
    sysName: "sosp_organism_feed_wall (El Mur)",
    desc: "Un RecyclerView massiu que encapsula múltiples `sosp_card_mur_standard` reciclant memòria a través de virtualització web d'alta velocitat.",
    demo: "<div>[LLISTA INFINITA D'AVISOS...]</div>"
  },
  "46": {
    sysName: "sosp_organism_detail_view",
    desc: "Quan el foraster toca al feed, entra a les budelles detallades. Ací la tipografia baixa el grossor per a permetre lectures plàcides d'una sentència d'alcaldia de 12 pàgines.",
    demo: "<div>...</div>"
  },
  "47": {
    sysName: "sosp_organism_drawer (El Segon Ajuda)",
    desc: "Un caixó que es desenganxa de l'esquerra ocultant tot secret municipal d'alt nivell burocràtic (com controls de pagaments de séquies).",
    demo: "<div>...</div>"
  },
  "49": {
    sysName: "sosp_organism_root_dashboard",
    desc: "Ages d'ús exclusiu d'Admins. Visualització de mètriques termodinàmiques crues i control del servidor Offline.",
    demo: "<div>[MODE FORASTER ON]</div>"
  }
};


let modifiedHtml = html;

for (const [pageNum, content] of Object.entries(contentMap)) {
    const pageRegex = new RegExp(`(<div class="page" id="page-${pageNum}">[\\s\\S]*?</h1>\\s*</div>)([\\s\\S]*?)(<div class="doc-footer">)`);
    
    modifiedHtml = modifiedHtml.replace(pageRegex, (match, prefix, oldContent, footer) => {
        const injected = `
    <div style="margin-top: 30px; display:flex; gap:30px;">
        <div style="flex:1;">
            <h3 style="font-size:16px; margin:0 0 10px 0; color:var(--sosp-blue);">NOM TÈCNIC (DESIGN SYSTEM)</h3>
            <pre style="background:#1a1a1a; color:#0f0; padding:15px; border-radius:12px; font-family:monospace; font-size:14px;">${content.sysName}</pre>
            
            <h3 style="font-size:16px; margin:20px 0 10px 0; color:var(--sosp-orange);">MANUAL D'ÚS I TRELLAT</h3>
            <p style="font-size:14px; line-height:1.6; color:#444;">${content.desc}</p>
        </div>
        <div style="flex:1.2; padding:30px; background:#f4f4f4; border:2px dashed #ccc; border-radius:28px; display:flex; align-items:center; justify-content:center;">
            <div style="width:100%;">
                ${content.demo}
            </div>
        </div>
    </div>
        `;
        return prefix + injected + footer;
    });
}

fs.writeFileSync(htmlFile, modifiedHtml, 'utf8');
console.log('Massive dictionary injection applied!');
