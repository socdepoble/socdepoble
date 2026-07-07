const fs = require('fs');

let html = fs.readFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'utf8');

// The last page is currently page-52 (the black back cover). We want to insert our new pages BEFORE the back cover.
// The back cover starts with: <div class="page" id="page-52" style="justify-content:center; align-items:center; text-align:center; background:#222; color:white;">

const insertionPoint = html.indexOf('<div class="page" id="page-52"');

const newPages = `
<!-- PAGE 52: TEMPLATE IMAGES -->
<div class="page" id="page-52-template" style="padding: 0; background-color: var(--sosp-blue); display: flex; flex-direction: column;">
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 40px; box-sizing: border-box; color: white;">
        <h1 style="font-family: 'Noto Sans', sans-serif; font-weight: 900; font-size: 24pt; margin-bottom: 20px; line-height: 1.1;">PLANTILLA MESTRA D'IL·LUSTRACIÓ</h1>
        <p style="font-size: 11pt; line-height: 1.5; opacity: 0.9; max-width: 80%;">
            Tota imatge generada pel Nano que siga A4 vertical s'ha d'inserir usant una caixa de relació d'aspecte <strong style="color:var(--sosp-orange);">1:1 (Quadrat Perfecte)</strong> ancorada al fons. 
            El CSS <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">object-fit: cover; object-position: bottom;</code> retalla automàticament el fons geomètric 
            deixant el cel fora i conservant tots els personatges centrats i assegurats. L'espai superior s'omple amb Blau Corporatiu SOSP per al text, tal qual passa ací.
        </p>
    </div>
    <div style="width: 100%; aspect-ratio: 1/1; position: relative; background: #EEE; border-top: 10px solid var(--sosp-black); display: flex; justify-content: center; align-items: center;">
        <span style="font-family: monospace; font-size: 14pt; color: #888; letter-spacing: 2px;">(CAIXA RESERVADA 1:1 PER A IMATGE NANO)</span>
    </div>
</div>

<!-- PAGE 53: MASTER PROMPT NANO -->
<div class="page" id="page-53">
    <div class="doc-header">
      <div style="font-weight:900; font-size:16px; letter-spacing:-0.5px;">IDENTITAT SÓC DE POBLE</div>
      <div style="color:#666; font-size:11px; font-weight:700; letter-spacing:1px;">APP.DESIGN_SYSTEM.2026 | REV.4</div>
    </div>
    <div style="margin-top:0mm; margin-bottom:6mm; border-bottom:4px solid #000; padding-bottom:10px;">
        <h1 style="font-size:32px; font-weight:900; margin:0;">MÈTRIQUES IA: EL PROMPT MESTRE (EL NANO)</h1>
    </div>
    <div style="column-count: 2; column-gap: 30px; font-size: 10pt; line-height: 1.6;">
        <p><strong>INSTRUCCIÓ PRINCIPAL AL SISTEMA:</strong><br>
        L'estil visual innegociable replíca de forma extrema als dibuixants de l'escola Bruguera (Francisco Ibáñez). Contorns de tinta negra, colors vibrants, "elasticitat còmica". Tot a la imatge ha d'estar actiu: no hi ha buits sense un acudit de rerefons (aranya baixant, fum absurd).</p>
        
        <p><strong>HUMOR DE CONTRAST ("TRELLAT"):</strong><br>
        Allò que fa por NO HO ÉS. Exemple: Un "Gos Perillós" al costat d'un cartell d'avís ha de tindre una cara completament BOBA i inofensiva. Mai fa terror. Els animals (gallines, burros) responen amb absoluta indiferència i saviesa rural. Hi ha d'haver harmonia d'humor i tendresa en el fons. Som una família d'inadaptats.</p>

        <p><strong>LINGÜÍSTICA:</strong><br>
        Prohibit idioma que no siga Valencià a bafarades, cartells o onomatopeies. Noms i termes: "GOS PERILLÓS", "BATERIES", "DIARI RURAL", "AI COY!".</p>

        <p style="background: var(--sosp-gray); padding: 15px; border-radius: 12px; margin-top: 20px;">
        <strong>COMPOSICIÓ (Safe Zones):</strong> Et demanarem PORTRAIT. L'1/4 superior ha de ser exclusively CEL BLAU CLAR buit. Els 3/4 inferiors contenen la densitat màxima de l'acudit. Els personatges MAI es tallen per la vora, han de ser emmarcats per ser posats en una caixa quadrada 1:1.</p>
    </div>
    <div class="doc-footer">
      <div>SISTEMA DE DISSENY: EINES</div>
      <div>CLASSIFICACIÓ I MÒDULS: PROTOCOL IA</div>
    </div>
    <div class="page-num">PÀGINA 52 EX | SOCDEPOBLE.ORG</div>
</div>

<!-- PAGE 54: LORE & PSICO -->
<div class="page" id="page-54">
    <div class="doc-header">
      <div style="font-weight:900; font-size:16px; letter-spacing:-0.5px;">IDENTITAT SÓC DE POBLE</div>
      <div style="color:#666; font-size:11px; font-weight:700; letter-spacing:1px;">APP.DESIGN_SYSTEM.2026 | REV.4</div>
    </div>
    <div style="margin-top:0mm; margin-bottom:6mm; border-bottom:4px solid #000; padding-bottom:10px;">
        <h1 style="font-size:32px; font-weight:900; margin:0;">PERFILS: DEL NANO AL GOS PERILLÓS</h1>
    </div>
    <p style="font-size:14pt; font-weight:700;">L'Adn de la Marca està reflectit en les mascotes que interactuen amb l'ecosistema. No col·loquem elements a la babalà, cadascú és una entitat.</p>
    <div style="margin-top:20px; display:flex; gap:20px;">
        <div style="flex:1; background: #fafafa; padding: 20px; border-radius: 16px; border: 2px solid #ddd;">
            <h3 style="margin-top:0; color:var(--sosp-orange);">GOS PERILLÓS</h3>
            <p style="font-size:10pt;">Un "mil-llets" de camp que manté intacta l'esclavatge existencial d'haver de fer por per posició en el món rural, però que fracassa immensament i genera tendresa. El seu disseny ha d'inspirar abraçades, mai eixir corrent. Representa l'anomalia del poble modern.</p>
        </div>
        <div style="flex:1; background: #fafafa; padding: 20px; border-radius: 16px; border: 2px solid #ddd;">
            <h3 style="margin-top:0; color:var(--sosp-blue);">GALLINES CÍVIQUES</h3>
            <p style="font-size:10pt;">El pilar intel·lectual silenciós del corral. Llegeixen diaris comtals al costat del gos que lladra desaforadament. Encarnen la resiliència del llevant: la vida continua mentres tot s'enfonsa en caos al voltant.</p>
        </div>
        <div style="flex:1; background: #fafafa; padding: 20px; border-radius: 16px; border: 2px solid #ddd;">
            <h3 style="margin-top:0; color:var(--sosp-green);">BURRO I SERVIDORS</h3>
            <p style="font-size:10pt;">Porta la càrrega tecnològica. Bateries de cotxe interconnectades formant Data Centers rurals on l'API de Sóc de Poble sobreviu offline (Bancal Mode). Sense el burro, no hi ha PWA que arrenque a les muntanyes d'Alacant.</p>
        </div>
    </div>
    <div class="doc-footer">
      <div>SISTEMA DE DISSENY: REREFONS</div>
      <div>CLASSIFICACIÓ I MÒDULS: ENTITATS</div>
    </div>
    <div class="page-num">PÀGINA 53 EX | SOCDEPOBLE.ORG</div>
</div>
`;

let newHtml = html.slice(0, insertionPoint) + newPages + html.slice(insertionPoint);

fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', newHtml, 'utf8');
console.log('Pages successfully appended!');
