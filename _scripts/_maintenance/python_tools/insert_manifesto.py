import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Increase total page count
html = html.replace('DE 20', 'DE 21')
html = html.replace('PÀGINA 20', 'PÀGINA 21')

creation_date = "18 ABR 2026 05:47"
revision_date = "18 ABR 2026 08:08 (+2)"

manifest_page = f"""  <div class="page" id="page-19_manifest">
    <div class="doc-header">
      <img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble">
      <div class="meta"><span>13 — EL GENOTIP E-PUB I PRIVACITAT</span></div>
      <div class="v-control" style="display: flex; flex-direction: column; align-items: flex-end; font-size: 6.5pt; font-family: monospace; color: var(--sosp-gray); text-transform: uppercase; line-height: 1.2; margin-left: auto; text-align: right;">
        <span>CREA: {creation_date}</span>
        <span>REV: {revision_date}</span>
      </div>
    </div>
    
    <h2 class="title" style="margin-top: 15px; margin-bottom: 5px;">L'E-PUB COM A MOTOR D'AUTOPUBLICACIÓ OFFLINE</h2>
    <div class="row" style="margin-bottom: 20px;">
      <p class="text" style="font-size: 10pt; line-height: 1.6; max-width: 90%;">«Sóc de Poble» no és només una PWA Social. És el teu propi <strong>editor i motor autònom d'impressió</strong>. L'element clau del projecte resideix en l'absència absoluta de servidors centrals, retornant l'autonomia digital completa a l'usuari final mitjançant l'arquitectura ePub i HTML pur.</p>
    </div>

    <div class="row" style="display: flex; gap: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
            <h3 style="font-size: 11pt; color: var(--sosp-orange); margin-bottom: 10px; font-weight: 800;">1. Privacitat Criptogràfica Natural</h3>
            <p style="font-size: 9.5pt; color: #444; line-height: 1.5; margin-bottom: 15px;">Diferenciació fonamental: <strong>les dades no ixen mai del teu mòbil</strong>. Com que no existeix la sincronització forçosa amb el núvol (Zero-Server Architecture), l'usuari pot compilar llibres a partir dels seus xats personals (amb e-Agents o e-Amics), apunts d'estudi, rutes o qualsevol interacció feta DINS l'app. Aquest processament es fa en un "calaix" local blindat. Zero problemes de privadesa ni drets de dades. Tot et pertany de forma matemàtica.</p>
            
            <h3 style="font-size: 11pt; color: var(--blau-socdepoble); margin-bottom: 10px; font-weight: 800;">2. Mobile-First & Liquid Rendering</h3>
            <p style="font-size: 9.5pt; color: #444; line-height: 1.5; margin-bottom: 15px;">Tant el Manual d'Identitat com els components HTML generats internament actuen sota un criteri clau: l'adaptabilitat mòbil (Liquid ePub). L'usuari pot llegir el component expandint el tamany de la lletra (Noto Sans) amb l'accessibilitat d'un llibre electrònic nadiu de veritat, i transformar-lo instantàniament en un PDF vectoritzat a punt de l'A4 o de la impremta més propera.</p>
        </div>
        <div style="flex: 1; background: #fafafa; padding: 20px; border-radius: 8px; border: 1px dashed #ccc;">
            <h3 style="font-size: 10pt; color: #111; margin-bottom: 15px; text-transform: uppercase;">Flux de Vida del Coneixement</h3>
            <ul style="font-size: 9pt; color: #555; line-height: 1.6; padding-left: 20px;">
                <li><strong>Interacció i Estudi:</strong> L'usuari usa la PWA offline en sa casa (parlant amb IAIA MaRia, apuntant dades...).</li>
                <li><strong>Mòdul Genotip:</strong> S'escullen segments i la PWA les transforma (en segons) en HTML líquid estil ePub.</li>
                <li><strong>L'Èxode Imprès:</strong> El subjecte clica "Crear Llibre". El navegador (fent d'imprenta del segle XXI) destil·la això a PDF, sense fils, sense rastro legal.</li>
                <li><strong>L'Apropiació de l'HTML:</strong> Toca apuntar llibreta, llapis i gaudir del teu contingut sense dependre que l'app tanque l'aixeta demain.</li>
            </ul>
        </div>
    </div>
    
    <div class="row">
        <div style="background: var(--sosp-black); color: white; padding: 20px; border-radius: 8px;">
            <h4 style="font-size: 10pt; margin-bottom: 5px; color: var(--sosp-orange);">REGLA ESTRUCTURAL: LES PLANTILLES DE L'EDITOR</h4>
            <p style="font-size: 9pt; margin: 0; line-height: 1.5; color: #aaa;">Les construccions visuals (UI/UX) contingudes en aquest Manual d'Identitat representen molt més que mockups conceptuals. <strong>Actuen com el Genotip HTML i CSS real i primari</strong> que dictamina com el motor intern generarà els llibres. Cada <code>&lt;div&gt;</code> que es dissenya al PDF, es cristal·litza en mil·lisegons a la producció en React. Aquesta plantilla estandarditzada és la primera, i obri les portes a generar plantilles úniques de xat, apunts universitaris, agendes, i dietaris basats exclusivament en tipografia <code>Noto Sans</code> pura.</p>
        </div>
    </div>

    <div class="doc-footer">
      <div></div>
      <div class="brand">SÓC DE POBLE / SISTEMA OPERATIU</div>
      <div class="page-num">PÀGINA 19 DE 21 | <a href="https://socdepoble.org">SOCDEPOBLE.ORG</a></div>
    </div>
  </div>

"""

# Insert right before the newly created page-19 (El Projecte mockup)
html = html.replace('<div class="page" id="page-19">', manifest_page + '\n  <div class="page" id="page-20">')

# Wait, if I replace the top of `page-19`, the old `page-19` will become `page-20`. But wait, `page-20` (the footer) will need to be `page-21`.
html = html.replace('<div class="page" id="page-20" style="justify-content:center', '<div class="page" id="page-21" style="justify-content:center')

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Manifesto page inserted successfully.")
