import re
import sys

def main():
    file_path = "Manual_Identitat_Extens.html"
    with open(file_path, "r") as f:
        content = f.read()

    # 1. Update total pages
    content = content.replace("DE 16", "DE 17")
    
    # 2. Shift IDs and "PÀGINA X" texts from 16 down to 12.
    for i in range(16, 11, -1):
        old_id = f'id="page-{i:02d}"'
        new_id = f'id="page-{i+1:02d}"'
        content = content.replace(old_id, new_id)
        
        old_text = f'PÀGINA {i:02d} DE'
        new_text = f'PÀGINA {i+1:02d} DE'
        content = content.replace(old_text, new_text)

    # 3. Create Page 12 Content
    page_12_html = """
  <div class="page" id="page-12">
    <div class="doc-header">
      <img src="./docs/Identitat/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble">
      <div class="meta"><span>11 — UX PROTOTYPE (ARTICLE)</span></div>
    </div>

    <h2>Component Pàgina (Article Complet)</h2>
    <p>Aquesta és l'estructura de la pàgina completa quan l'usuari interacciona en la Card anterior. Proporcionem un espai de lectura sense distraccions (A4 ratio real), jerarquia clara per al títol, metadades d'autor per donar confiança, i crides a l'acció (com la descàrrega PDF) clares i funcionals a la base del document.</p>

    <div class="ux-demo-canvas" style="height: 580px; padding: 20px; background: #e0e0e0;">
      <!-- Pàgina Prototype -->
      <div style="font-family: 'Noto Sans', sans-serif; width: 420px; background: white; border-radius: var(--gem-radius); box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; margin: 0 auto; display:flex; flex-direction:column; height:100%;">
        
        <div style="height: 180px; width: 100%; position: relative;">
          <img src="./public/assets/infographics/chica_jersey.jpg" style="width: 100%; height: 100%; object-fit: cover;" alt="Hero">
          <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px 15px 10px 15px;">
            <h3 style="color:white; font-size:16pt; margin:0; line-height:1.2;">Sóc de Poble: Bíblia de Disseny</h3>
            <p style="color:#ddd; font-size:10pt; margin:4px 0 0 0;">Manual d'Identitat i Sistema</p>
          </div>
        </div>

        <div style="padding: 15px; display:flex; align-items:center; border-bottom: 1px solid #EEE;">
          <div style="width: 32px; height: 32px; border-radius: 5px; overflow: hidden; background:transparent;">
            <img src="./public/assets/master/logo-socdepoble-cuadrat-verd.svg" style="width:100%; height:100%; object-fit:contain;">
          </div>
          <div style="margin-left: 10px;">
            <p style="font-size: 10px; font-weight: 700; margin: 0; color: var(--sosp-black);">Sóc de Poble, Javi i La Iaia</p>
            <p style="font-size: 9px; color: #888; margin: 2px 0 0 0;">La Torre de les Maçanes · Ara mateix</p>
          </div>
        </div>

        <div style="padding: 20px 15px; flex:1; font-size:10pt; line-height: 1.6; color:#444;">
          <p style="margin-top:0;">Descarrega oficialment el Manual d'Identitat del Sistema Operatiu Rural Sóc de Poble, exportat directament des de la font de veritat en format PDF interactiu per a un ús professional i ètic.</p>
          <p>Aquest disseny garanteix que qualsevol article pot ser directament traspassat a Affinity per a publicació impresa (ePUB / A4 mode) mantenint la proporció exacta sense degradació visual.</p>
        </div>

        <div style="padding: 15px; background: #FAFAFA; border-top: 1px solid #EEE; text-align:center;">
           <div style="display:inline-block; background: var(--sosp-orange); color: white; padding: 10px 20px; border-radius: 20px; font-weight:700; font-size: 9pt; cursor:pointer; text-transform:uppercase;">
              Descarregar PDF - Bíblia de Disseny
           </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>MODELS DE L'ESPAI FÍSIC</div>
      <div>FÍSICA DIGITAL RURAL</div>
    </div>
    <div class="page-num">PÀGINA 12 DE 17 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>
  </div>
"""

    # Inject Page 12 before Page 13
    content = content.replace('<div class="page" id="page-13">', page_12_html + '\n  <div class="page" id="page-13">')

    # Card click wrap fix on Page 11
    # We find `<div class="ux-card-mercat">` inside Page 11 and wrap it with an anchor logic
    # Actually, we can just replace `<div class="ux-card-mercat">` with `<a href="#page-12" style="text-decoration:none; color:inherit; display:flex;"><div class="ux-card-mercat" style="width:100%;">` inside the section of page 11.
    
    with open(file_path, "w") as f:
        f.write(content)
        
if __name__ == "__main__":
    main()
