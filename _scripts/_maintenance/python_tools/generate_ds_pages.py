import re

# Base header generator
def gen_header(title):
    return f"""    <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--sosp-black); padding-bottom: 10px; margin-bottom: 10mm;">
      <img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble Logo" style="height:25px; width:auto;">
      <div class="meta-right" style="text-align: right; font-size: 7.5pt; font-weight: 700; font-family: 'Noto Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; color: #444; line-height: 1.5;">
        <span style="display:block;">Sistema Operatiu Rural <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> CREA: 18 ABR 2026 08:30</span>
        <span style="display:block;">{title} <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> REV: 18 ABR 2026 08:35 (+2)</span>
      </div>
    </div>"""

# Atomy page
atomy_html = f"""<div class="page doc-ds">
{gen_header("FASE 1: ÀTOMS")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px;">Sistema de Disseny:<br>Fase 1 - Àtoms</h1>
  <p>Els elements fonamentals i indivisibles de la interfície "Sóc de Poble". Basats en formes rodones extremes (Radi 28px) per denotar amabilitat i usabilitat termodinàmica.</p>
  
  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2>1. Botons (Botons Rurals)</h2>
    <div style="display: flex; gap: 15px; margin-top: 15px;">
      <button style="background:var(--sosp-orange); color:black; border:2px solid black; border-radius:28px; padding:12px 24px; font-weight:bold; font-family:'Noto Sans'; font-size:11pt; cursor:pointer; text-transform:uppercase;">Acció Principal</button>
      <button style="background:var(--sosp-blue); color:white; border:2px solid black; border-radius:28px; padding:12px 24px; font-weight:bold; font-family:'Noto Sans'; font-size:11pt; cursor:pointer; text-transform:uppercase;">Info / Tècnic</button>
      <button style="background:transparent; color:black; border:2px solid black; border-radius:28px; padding:12px 24px; font-weight:bold; font-family:'Noto Sans'; font-size:11pt; cursor:pointer; text-transform:uppercase;">Secundari</button>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2>2. Inputs (Cap de Dades)</h2>
    <div style="display: flex; flex-direction:column; gap: 15px; margin-top: 15px;">
      <input type="text" placeholder="Escriu el que passa al poble..." style="width:100%; border:2px solid black; border-radius:28px; padding:15px 20px; font-family:'Noto Sans'; font-size:11pt;">
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; border:2px solid black; border-radius:28px; padding:5px 5px 5px 20px;">
         <input type="text" placeholder="Cerca al mercat..." style="border:none; outline:none; flex:1; font-family:'Noto Sans'; font-size:11pt;">
         <button style="background:var(--sosp-black); color:white; border:none; border-radius:28px; padding:10px 20px; font-weight:bold; font-family:'Noto Sans';">Cercar</button>
      </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 0;">
    <h2>3. Etiquetes i Badges</h2>
    <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap:wrap;">
      <span style="background:var(--sosp-green); color:black; border:1px solid black; border-radius:28px; padding:4px 12px; font-size:8pt; font-weight:bold;">COMPLETAT</span>
      <span style="background:var(--sosp-orange); color:black; border:1px solid black; border-radius:28px; padding:4px 12px; font-size:8pt; font-weight:bold;">URGENT</span>
      <span style="background:var(--sosp-blue); color:white; border:1px solid black; border-radius:28px; padding:4px 12px; font-size:8pt; font-weight:bold;">INFORMACIÓ</span>
      <span style="background:#eee; color:black; border:1px solid black; border-radius:28px; padding:4px 12px; font-size:8pt; font-weight:bold;">ESBORRANY</span>
    </div>
  </div>
</div>"""

# Molecules page
molecules_html = f"""<div class="page doc-ds">
{gen_header("FASE 2: MOLÈCULES")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px;">Sistema de Disseny:<br>Fase 2 - Molècules</h1>
  <p>Combinacions d'àtoms per crear components funcionals amb un propòsit clar. Aquestes peces formen les fitxes del trencaclosques de Sóc de Poble.</p>
  
  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2>1. Targeta de Notícia (El Mur)</h2>
    <div style="border: 2px solid black; border-radius: 28px; padding: 20px; max-width:400px; margin-top:15px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-weight:bold; font-size:10pt;">La Tenda de Pepa</span>
        <span style="font-size:8pt; color:#666;">Fa 2 hores</span>
      </div>
      <h3 style="margin:0 0 10px 0; font-size:14pt; line-height:1.2;">Novos tomaquetes de pera acabats d'arribar del bancal!</h3>
      <p style="margin:0 0 15px 0; font-size:10pt; line-height:1.4;">Ja tenim els primers de la temporada, dolços com la mel. Veniu abans que s'acaben.</p>
      <div style="display:flex; gap:10px;">
        <button style="background:var(--sosp-green); color:black; border:2px solid black; border-radius:28px; padding:8px 16px; font-weight:bold; font-size:9pt; cursor:pointer;">M'agrada (12)</button>
        <button style="background:transparent; color:black; border:2px solid black; border-radius:28px; padding:8px 16px; font-weight:bold; font-size:9pt; cursor:pointer;">Comentar</button>
      </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2>2. Banderola d'Avís (Alert)</h2>
    <div style="background:var(--sosp-orange); border: 2px solid black; border-radius: 28px; padding: 15px 20px; display:flex; align-items:center; gap: 15px; margin-top:15px;">
      <div style="font-size:24pt;">⚠️</div>
      <div>
        <h4 style="margin:0 0 5px 0; font-size:11pt;">Ban de l'Ajuntament</h4>
        <p style="margin:0; font-size:9pt; line-height:1.3;">Aquesta vesprada es tallarà l'aigua al carrer Major de 16h a 18h per reparacions.</p>
      </div>
    </div>
  </div>
</div>"""

# Organisms page
organisms_html = f"""<div class="page doc-ds">
{gen_header("FASE 3: ORGANISMES")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px;">Sistema de Disseny:<br>Fase 3 - Organismes</h1>
  <p>Estructures complexes que defineixen àrees de pantalla completes (Layouts). Uneixen molècules i àtoms en un disseny auto-sostenible i Offline-ready.</p>
  
  <div class="card" style="padding: 15px 25px; margin-bottom: 15px; background:var(--sosp-black); color:white;">
    <h2 style="color:var(--sosp-orange)">1. "La Boina" i el Layout Base</h2>
    <div style="border: 2px solid white; border-radius: 28px; overflow:hidden; display:flex; flex-direction:column; height:300px; margin-top:15px; background:white; color:black;">
      
      <!-- Boina (Header) -->
      <div style="background:var(--sosp-black); color:white; padding:15px 20px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; letter-spacing:1px;">SÓC DE POBLE</span>
        <div style="display:flex; gap:10px;">
           <div style="width:30px; height:30px; border-radius:50%; background:var(--sosp-orange);"></div>
        </div>
      </div>
      
      <!-- Body / Molècules -->
      <div style="flex:1; padding:20px; overflow-y:auto; background:#f4f4f4;">
        <h3 style="margin-top:0;">El Mur</h3>
        <div style="border:1px solid #ccc; border-radius:15px; padding:15px; margin-bottom:10px; background:white;">Targeta 1...</div>
        <div style="border:1px solid #ccc; border-radius:15px; padding:15px; background:white;">Targeta 2...</div>
      </div>

      <!-- Footer Nav -->
      <div style="background:white; border-top:2px solid var(--sosp-black); padding:10px 20px; display:flex; justify-content:space-between;">
        <span style="font-weight:bold; color:var(--sosp-orange);">Mur</span>
        <span style="font-weight:bold;">Mercat</span>
        <span style="font-weight:bold;">Bancal</span>
      </div>
    </div>
  </div>
</div>"""

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Insert the pages right before page-19
insertion_point = text.find('<div class="page" id="page-19"')

if insertion_point != -1:
    before = text[:insertion_point]
    after = text[insertion_point:]
    
    new_text = before + atomy_html + "\n\n" + molecules_html + "\n\n" + organisms_html + "\n\n" + after
    
    with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Design System pages injected successfully!")
else:
    print("Could not find insertion point!")

