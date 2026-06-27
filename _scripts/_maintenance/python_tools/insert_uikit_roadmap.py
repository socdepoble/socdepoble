import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Increase total pages by 1
html = html.replace('DE 21', 'DE 22')
html = html.replace('PÀGINA 21', 'PÀGINA 22')

creation_date = "18 ABR 2026 05:47"
revision_date = "18 ABR 2026 08:16 (+2)"

uikit_roadmap = f"""  <div class="page" id="page-20_uikit">
    <div class="doc-header">
      <img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble">
      <div class="meta"><span>14 — DESIGN SYSTEM (FIGMA LEVEL)</span></div>
      <div class="v-control" style="display: flex; flex-direction: column; align-items: flex-end; font-size: 6.5pt; font-family: monospace; color: var(--sosp-gray); text-transform: uppercase; line-height: 1.2; margin-left: auto; text-align: right;">
        <span>CREA: {creation_date}</span>
        <span>REV: {revision_date}</span>
      </div>
    </div>
    
    <h2 class="title" style="margin-top: 15px; margin-bottom: 5px;">EL FULL DE RUTA: ELS 100 FOTOGRAMES</h2>
    <div class="row" style="margin-bottom: 20px;">
      <p class="text" style="font-size: 10pt; line-height: 1.6;">L'arquitectura visual de "Sóc de Poble" s'ha d'explicar amb el rigor d'un Design System estructurat (Nivell Figma / Adobe). Aquest apartat inicia el catàleg absolut i determinista de cada element UI del sistema. Cada component actua com un genotip HTML pur, retingut pel CSS i pre-connectat a les variables perquè el canvi d'un botó altere tot l'ecosistema.</p>
    </div>

    <div class="row" style="display: flex; flex-wrap: wrap; gap: 20px; font-family: 'Noto Sans', sans-serif;">
        <!-- Secció: ATOMS -->
        <div style="flex: 1; min-width: 250px; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3 style="color: var(--sosp-orange); font-size: 11pt; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 15px; font-weight: 800;">Fase I: Els Àtoms</h3>
            <ul style="font-size: 9pt; color: #444; line-height: 1.8; list-style-type: none; padding: 0;">
                <li><span style="color: #ccc;">[ ]</span> Graella Base i Mètriques (28px)</li>
                <li><span style="color: #ccc;">[ ]</span> Estatus i Colors Actius</li>
                <li><span style="color: #ccc;">[ ]</span> Botons: Primaris i Secundaris</li>
                <li><span style="color: #ccc;">[ ]</span> Entrades Tipogràfiques (Inputs)</li>
                <li><span style="color: #ccc;">[ ]</span> Iconografia Activa i Passiva</li>
                <li><span style="color: #ccc;">[ ]</span> Contenidors de Tooltips</li>
                <li><span style="color: #ccc;">[ ]</span> Targetes d'Avatar Nadiu</li>
            </ul>
        </div>
        
        <!-- Secció: MOLECULES -->
        <div style="flex: 1; min-width: 250px; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3 style="color: var(--blau-socdepoble); font-size: 11pt; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 15px; font-weight: 800;">Fase II: Les Molècules</h3>
            <ul style="font-size: 9pt; color: #444; line-height: 1.8; list-style-type: none; padding: 0;">
                <li><span style="color: var(--sosp-blue); font-weight: bold;">[X]</span> Mòdul de Navegació (Sidebar)</li>
                <li><span style="color: var(--sosp-blue); font-weight: bold;">[X]</span> Barra d'Eines Lector (Toolbar)</li>
                <li><span style="color: #ccc;">[ ]</span> Targetes del Feed Interactiu</li>
                <li><span style="color: #ccc;">[ ]</span> Formularis "Petorreta" i Pujada d'Imatge</li>
                <li><span style="color: #ccc;">[ ]</span> Quadres de Diàleg de la IAIA</li>
                <li><span style="color: #ccc;">[ ]</span> Finestres Modals Mòbils</li>
            </ul>
        </div>
        
        <!-- Secció: ORGANISMS -->
        <div style="flex: 1; min-width: 250px; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3 style="color: var(--sosp-green); font-size: 11pt; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 15px; font-weight: 800;">Fase III: Els Organismes</h3>
            <ul style="font-size: 9pt; color: #444; line-height: 1.8; list-style-type: none; padding: 0;">
                <li><span style="color: var(--sosp-green); font-weight: bold;">[X]</span> Llenç d'Estudi "El Projecte"</li>
                <li><span style="color: var(--sosp-green); font-weight: bold;">[X]</span> Interfície Mòbil del Mercat</li>
                <li><span style="color: #ccc;">[ ]</span> Taulell del "Nano Visor" Forense</li>
                <li><span style="color: #ccc;">[ ]</span> Gestor CRDT Local d'ePubs</li>
                <li><span style="color: #ccc;">[ ]</span> Compilador de la Boina (Mode Nit)</li>
                <li><span style="color: #ccc;">[ ]</span> Mapa Cartogràfic P2P</li>
            </ul>
        </div>
    </div>
    
    <div class="row" style="margin-top: 25px;">
        <div style="background: var(--sosp-black); color: white; padding: 20px; border-radius: 8px;">
            <h4 style="font-size: 10pt; margin-bottom: 5px; color: var(--sosp-orange);">COMUNICACIÓ FIGMA A PWA</h4>
            <p style="font-size: 9pt; margin: 0; line-height: 1.5; color: #aaa;">L'objectiu final és expandir aquest document fins a abraçar la totalitat del sistema visual (+50 pàgines). Qualsevol decisió de disseny s'executa primer ací en format d'esquelet HTML modular, permetent l'acoblament directe a la base de dades sense intermediaris o programari tancat de tercers.</p>
        </div>
    </div>

    <div class="doc-footer">
      <div></div>
      <div class="brand">SÓC DE POBLE / DESIGN SYSTEM</div>
      <div class="page-num">PÀGINA 20 DE 22 | <a href="https://socdepoble.org">SOCDEPOBLE.ORG</a></div>
    </div>
  </div>

"""

# Insert right after page-19 (Manifesto). Wait, previous script inserted page-19. Then we have page-20 (UX Prototype).
# I should insert this exactly before page-21 (which was the final Trellat sign-off).
html = html.replace('<div class="page" id="page-21">', uikit_roadmap + '\n  <div class="page" id="page-21">')

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Design Systems UI Kit Roadmap page inserted successfully.")
