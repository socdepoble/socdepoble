import re

with open("Manual_Identitat_Extens.html", "r") as f:
    html = f.read()

# 1. Update total pages in CSS (just in case, but we will remove ::before/::after logic)
html = re.sub(r'\.page-num::before \{ content: "PÀGINA "; \}', '', html)
html = re.sub(r'\.page-num::after \{ content: " DE \d+ \| SOCDEPOBLE\.ORG"; margin-left: 2px; \}', '', html)

# Modify CSS for page-num to make links work well
html = html.replace('.page-num { position: absolute;', '.page-num { position: absolute; z-index: 100;')
html = html.replace('.page-num {', '.page-num a { color: inherit; text-decoration: none; }\n    .page-num {')

# 2. Add the Architecture Page (Page 15) and Shift Legal to Page 16
new_page = """
  <!-- ==============================================
       PÀGINA 15: ESTRUCTURA I MÒDULS DE L'APP
       ============================================== -->
  <div class="page" id="page-15">
    <div class="doc-header">
      <img src="./docs/Identitat/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble Logo">
      <div class="meta">
        <span>Sistema Operatiu Rural</span>
        <span>SÓC DE POBLE ISO 1.4.1 • GEM MODERN 2.0</span>
      </div>
    </div>

    <div style="margin-top: 10px; margin-bottom: 25px;">
      <h1 style="color: var(--sosp-orange); font-size:16pt; margin: 0 0 10px 0; text-transform:uppercase;">Estructura del Sistema (Mapa de l'App)</h1>
      <p style="font-size: 9pt; color:#666; margin:0; line-height: 1.5;">Topologia dels mòduls funcionals dissenyats per teixir la xarxa ciutadana. Cada mòdul respon a una necessitat termodinàmica i social específica.</p>
    </div>

    <div style="display:flex; flex-direction:column; gap:15px; font-size:9pt;">
      
      <!-- Pilars Principals -->
      <div style="background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid var(--sosp-orange);">
        <h3 style="margin:0 0 5px 0; font-size:10pt; color:var(--sosp-black);">Els 4 Pilars Principals</h3>
        <ul style="margin:0; padding-left:20px; line-height:1.5;">
          <li><strong>Chat:</strong> Comunicació directa, efímera i segura per a la gestió ràpida del veïnat.</li>
          <li><strong>Mur:</strong> L'àgora pública. Taulell d'anuncis cronològic on flueix la vida del poble.</li>
          <li><strong>Mercat:</strong> Transaccions locals, intercanvi d'eines, productes quilòmetre zero i economia circular.</li>
          <li><strong>Pobles:</strong> El directori i connexió entre els diferents nuclis poblacionals; l'arrel de la xarxa.</li>
        </ul>
      </div>

      <!-- Eines Transversals -->
      <div style="background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid var(--sosp-blue);">
        <h3 style="margin:0 0 5px 0; font-size:10pt; color:var(--sosp-black);">Eines Transversals</h3>
        <ul style="margin:0; padding-left:20px; line-height:1.5;">
          <li><strong>Mapa:</strong> Visualització geoespacial dels recursos, comerços i alertes (L'Àtom verd aplicat).</li>
          <li><strong>Calendari:</strong> Festivitats, talls de carrer, esdeveniments rurals i ritmes agrícoles.</li>
          <li><strong>Projecte:</strong> La visió a llarg termini, identitat, transparència i participació col·lectiva.</li>
          <li><strong>Bloc de Notes:</strong> Espai privat o de gestió ràpida per esbossar idees o llistes de tasques.</li>
        </ul>
      </div>

      <!-- Full de Ruta -->
      <div style="background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid var(--sosp-green);">
        <h3 style="margin:0 0 5px 0; font-size:10pt; color:var(--sosp-black);">Full de Ruta (Horitzó)</h3>
        <p style="margin:0 0 5px 0; font-style:italic; color:#666;">Llistat de previsions i desenvolupament continu del sistema:</p>
        <ul style="margin:0; padding-left:20px; line-height:1.5; columns:2;">
          <li>Sistema de votació / assembles</li>
          <li>Integració d'alertes d'emergència</li>
          <li>Marketplace de serveis agraris</li>
          <li>Portal de transparència IoT</li>
          <li>Sincronització Offline (Mesh)</li>
          <li>Mode 'Estalvi d'Energia' profund</li>
        </ul>
      </div>

    </div>

    <div class="doc-footer">
      <div>MAPA DEL SISTEMA</div>
      <div>TOPOLOGIA I MÒDULS</div>
    </div>
    <div class="page-num">15</div>
  </div>
"""

# Replace Page 15 (Legal) with New Page 15 + Page 16 (Legal)
html = html.replace('id="page-15"', 'id="page-16"')
html = html.replace('<div class="page-num" style="color:white;">15</div>', '<div class="page-num" style="color:white;">16</div>')
html = html.replace('<!-- ==============================================\n       PÀGINA 15: CONTRAPORTADA LEGAL', new_page + '\n\n  <!-- ==============================================\n       PÀGINA 16: CONTRAPORTADA LEGAL')

# 3. Process all <div class="page-num">X</div> and convert to DOM text with link
def make_interactive_footer(match):
    num_str = match.group(1)
    # Re-add full string inside DOM for Canva/PDF links
    # Assuming total pages is 16 now.
    return f'<div class="page-num" style="{match.group(2)}">PÀGINA {num_str} DE 16 | <a href="https://socdepoble.org" target="_blank">SOCDEPOBLE.ORG</a></div>'

# Regex to match page-num
html = re.sub(r'<div class="page-num"(.*?)>(\d+)</div>', lambda m: make_interactive_footer(m.group(0) if False else re.match(r'<div class="page-num"(.*?)>(\d+)</div>', m.group(0))), html)

# The lambda needs to be simpler:
def replacer(m):
    attrs = m.group(1)
    num = m.group(2)
    return f'<div class="page-num"{attrs}>PÀGINA {num} DE 16 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>'

html = re.sub(r'<div class="page-num"(.*?)>(\d+)</div>', replacer, html)

# Fix pointer events on page-num overall, but keep it on <a> so it clicks
html = html.replace('pointer-events: none;', 'pointer-events: none;') # Leave as is, we added auto to the inline style of the link

with open("Manual_Identitat_Extens.html", "w") as f:
    f.write(html)
