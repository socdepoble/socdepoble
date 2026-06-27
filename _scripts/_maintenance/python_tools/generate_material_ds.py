import re

def gen_header(title, page_num):
    return f"""    <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--sosp-black); padding-bottom: 10px; margin-bottom: 10mm;">
      <img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble Logo" style="height:25px; width:auto;">
      <div class="meta-right" style="text-align: right; font-size: 7.5pt; font-weight: 700; font-family: 'Noto Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; color: #444; line-height: 1.5;">
        <span style="display:block;">SISTEMA OPERATIU RURAL <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> M3 DESIGN</span>
        <span style="display:block;">{title} <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> REV: 18 ABR 2026 (+2)</span>
      </div>
    </div>"""

def gen_footer(title, page_num):
    return f"""    <div class="doc-footer" style="margin-top:auto; padding-top:10mm; display:flex; justify-content:space-between; align-items:flex-end; font-size:7pt; color:#666; font-family:'Noto Sans'; font-weight:700;">
      <div>SISTEMA DE DISSENY (MATERIAL 3)</div>
      <div>PÀGINA {page_num}</div>
    </div>"""

# -----------------
# 1. COLOR & TYPOGRAPHY
# -----------------
page_colors = f"""<div class="page doc-ds" style="display:flex; flex-direction:column; height: 100%;">
{gen_header("SISTEMA DE COLOR I TIPOGRAFIA (M3)", "53")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px; color:var(--sosp-black);">Fonaments: Colors i Font</h1>
  <p style="font-family:'Noto Sans'; font-size:10pt; line-height:1.5;">El color a 'Sóc de Poble' fa servir l'especificació d'extraccions tonals de Material 3 però sobresaturat expressament per mantenir el to festiu rural.</p>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">1. Tons Principals (Primary / Secondary)</h2>
    <div style="display: flex; gap: 15px; margin-top: 15px;">
      <div style="width: 100px; height: 100px; background: #FF6B2B; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display:flex; align-items:flex-end; padding:10px; color:white; font-family:'Noto Sans'; font-weight:bold; font-size:9pt;">Primary<br>#FF6B2B</div>
      <div style="width: 100px; height: 100px; background: #0F4A9A; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display:flex; align-items:flex-end; padding:10px; color:white; font-family:'Noto Sans'; font-weight:bold; font-size:9pt;">Secondary<br>#0F4A9A</div>
      <div style="width: 100px; height: 100px; background: #FFD54F; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display:flex; align-items:flex-end; padding:10px; color:black; font-family:'Noto Sans'; font-weight:bold; font-size:9pt;">Tertiary<br>#FFD54F</div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">2. Tons de Superfície (Surfaces & Background)</h2>
    <div style="display: flex; gap: 15px; margin-top: 15px;">
      <div style="width: 100px; height: 100px; background: #FFFFFF; border:1px solid #ccc; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display:flex; align-items:flex-end; padding:10px; color:black; font-family:'Noto Sans'; font-weight:bold; font-size:9pt;">Surface<br>#FFFFFF</div>
      <div style="width: 100px; height: 100px; background: #F4F5F7; border:1px solid #ccc; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display:flex; align-items:flex-end; padding:10px; color:black; font-family:'Noto Sans'; font-weight:bold; font-size:9pt;">Surface Var<br>#F4F5F7</div>
      <div style="width: 100px; height: 100px; background: #EADDFF; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display:flex; align-items:flex-end; padding:10px; color:black; font-family:'Noto Sans'; font-weight:bold; font-size:9pt;">Container<br>#EADDFF</div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 0px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">3. L'escala Tipogràfica (Noto Sans)</h2>
    <p style="font-size:10pt; font-family:'Noto Sans';">La tipografia "Noto Sans" governa tota l'interfície amb proporcions geomètriques estrictes.</p>
    <div style="margin-top:10px; border-left:4px solid #FF6B2B; padding-left:15px; font-family:'Noto Sans'; color:var(--sosp-black);">
       <div style="font-size:36pt; font-weight:900; line-height:1.1">Display Large (57px)</div>
       <div style="font-size:28pt; font-weight:800; line-height:1.2">Display Medium (45px)</div>
       <div style="font-size:24pt; font-weight:700; line-height:1.2; margin-top:10px;">Headline Large (32px)</div>
       <div style="font-size:16pt; font-weight:600; line-height:1.3; margin-top:10px;">Title Large (22px)</div>
       <div style="font-size:12pt; font-weight:500; line-height:1.4; margin-top:10px;">Body Large (16px) - <em>Utilitzat al text corrent.</em></div>
       <div style="font-size:10pt; font-weight:400; line-height:1.5; margin-top:10px; letter-spacing:0.5px">LABEL LARGE (14px)</div>
    </div>
  </div>
{gen_footer("SISTEMA DE COLOR I TIPOGRAFIA", "53")}
</div>"""

# -----------------
# 2. BUTTONS & CHIPS
# -----------------
page_buttons = f"""<div class="page doc-ds" style="display:flex; flex-direction:column; height: 100%;">
{gen_header("COMPONENTS: ACTIONS & CHIPS (M3)", "54")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px; color:var(--sosp-black);">Accions: Botons, FABs i Chips</h1>
  <p style="font-family:'Noto Sans'; font-size:10pt; line-height:1.5;">Traducció dels elements de clic ràpid per la interacció amb dits humits de ploure al camp.</p>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">Botons Comuns (M3 Types)</h2>
    <div style="display:flex; flex-direction:column; gap:15px; margin-top:15px; font-family:'Noto Sans';">
       <div style="display:flex; align-items:center; gap:20px;">
          <button style="background:#FF6B2B; color:white; border:none; border-radius:20px; padding:10px 24px; font-weight:600; font-family:'Noto Sans'; font-size:11pt; box-shadow:0 1px 3px rgba(0,0,0,0.2);">Filled</button>
          <span style="font-size:10pt; color:#666;">Botó primari d'alta rellevància. Ombra "Level 1". Radis totalment redons (20px per 40px altura).</span>
       </div>
       <div style="display:flex; align-items:center; gap:20px;">
          <button style="background:#FFE0D0; color:#FF6B2B; border:none; border-radius:20px; padding:10px 24px; font-weight:600; font-family:'Noto Sans'; font-size:11pt;">Tonal</button>
          <span style="font-size:10pt; color:#666;">Fons menys contrastat però amb l'esquema de colors de l'App activa. Sense ombra.</span>
       </div>
       <div style="display:flex; align-items:center; gap:20px;">
          <button style="background:transparent; color:#0F4A9A; border:1px solid #79747E; border-radius:20px; padding:10px 24px; font-weight:600; font-family:'Noto Sans'; font-size:11pt;">Outlined</button>
          <span style="font-size:10pt; color:#666;">Acció mitjana-baixa que no ha de tapar fons complexos (Ex: Cancelar).</span>
       </div>
       <div style="display:flex; align-items:center; gap:20px;">
          <button style="background:transparent; color:#0F4A9A; border:none; border-radius:20px; padding:10px 24px; font-weight:600; font-family:'Noto Sans'; font-size:11pt;">Text Button</button>
          <span style="font-size:10pt; color:#666;">La menor prominència, típic per als diàlegs de "D'acord / Avortar".</span>
       </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">Floating Action Button (FAB)</h2>
    <div style="display:flex; gap:30px; align-items:center; margin-top:15px; font-family:'Noto Sans';">
       <div style="width:56px; height:56px; border-radius:16px; background:#FFD54F; box-shadow:0 4px 8px rgba(0,0,0,0.2); display:flex; justify-content:center; align-items:center; font-size:24px;">✏️</div>
       <div style="height:56px; border-radius:16px; background:#FFD54F; box-shadow:0 4px 8px rgba(0,0,0,0.2); display:flex; justify-content:center; align-items:center; padding:0 20px; gap:10px;">
          <span style="font-size:20px;">✏️</span>
          <span style="font-weight:600; color:#1f1f1f;">Redactar Bando</span>
       </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 0px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">Chips (Filtres i Opcions)</h2>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:15px; font-family:'Noto Sans';">
       <span style="border:1px solid #79747E; border-radius:8px; padding:6px 12px; font-size:10pt; font-weight:500;">🔔 Assist Chip</span>
       <span style="background:#E8DEF8; color:#1D192B; border:none; border-radius:8px; padding:6px 12px; font-size:10pt; font-weight:500; display:flex; align-items:center; gap:6px;">✓ Tenda de Pepa</span>
       <span style="border:1px solid #79747E; border-radius:8px; padding:6px 12px; font-size:10pt; font-weight:500; display:flex; align-items:center; gap:6px;">Comentaris ✕</span>
    </div>
  </div>
{gen_footer("COMPONENTS: ACTIONS & CHIPS", "54")}
</div>"""

# -----------------
# 3. TEXT FIELDS & INPUTS
# -----------------
page_inputs = f"""<div class="page doc-ds" style="display:flex; flex-direction:column; height: 100%;">
{gen_header("COMPONENTS: TEXT FIELDS & INPUTS (M3)", "55")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px; color:var(--sosp-black);">Entrada de Dades i Controls</h1>
  <p style="font-family:'Noto Sans'; font-size:10pt; line-height:1.5;">Les finestres grans "Input" (Filled/Outlined) permeten introduir el missatge, complint la M3 de hit-box grans i legibles per a ancians (Label flotant).</p>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">Text Fields</h2>
    <div style="display:flex; flex-direction:column; gap:20px; margin-top:15px; font-family:'Noto Sans';">
       <div style="width:100%; max-width:350px; background:#F4F5F7; border-bottom:2px solid #555; padding:8px 16px 8px 16px; border-radius:4px 4px 0 0;">
          <div style="font-size:8pt; color:#666;">Nom del Veí (Filled)</div>
          <div style="font-size:12pt; color:#111; margin-top:2px;">Vicent Ferris</div>
       </div>

       <div style="width:100%; max-width:350px; border:1px solid #79747E; padding:12px 16px; border-radius:4px; position:relative;">
          <div style="position:absolute; top:-8px; left:12px; background:white; padding:0 4px; font-size:8pt; color:#666;">Motiu del Ban (Outlined)</div>
          <div style="font-size:12pt; color:#111;">Tall d'Aigua Potable...</div>
       </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">Selectors (Controls)</h2>
    <div style="display:flex; flex-direction:column; gap:20px; margin-top:15px; font-family:'Noto Sans';">
       <div style="display:flex; align-items:center; gap:15px;">
          <div style="width:18px; height:18px; border:2px solid #FF6B2B; border-radius:2px; background:#FF6B2B; display:flex; justify-content:center; align-items:center; color:white; font-size:12px;">✓</div>
          <span style="font-size:11pt; font-weight:500;">Checkbox Actiu (Estil quadrat de 18x18px)</span>
       </div>
       <div style="display:flex; align-items:center; gap:15px;">
          <div style="width:52px; height:32px; border-radius:16px; background:#FF6B2B; position:relative;">
            <div style="width:24px; height:24px; border-radius:12px; background:white; position:absolute; top:4px; right:4px;"></div>
          </div>
          <span style="font-size:11pt; font-weight:500;">Switch On (Commutador ràpid tipus "Tenda Oberta/Tancada")</span>
       </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 0px;">
    <h2 style="margin:0 0 10px 0; font-family:'Noto Sans'; font-size:14pt; color:var(--sosp-black);">Sliders (Nivells)</h2>
    <div style="width:100%; max-width:350px; margin-top:15px; position:relative; height:40px; display:flex; align-items:center;">
       <div style="width:100%; height:4px; background:#FFE0D0; border-radius:2px;"></div>
       <div style="position:absolute; left:0; width:60%; height:4px; background:#FF6B2B; border-radius:2px;"></div>
       <div style="position:absolute; left:60%; width:20px; height:20px; background:#FF6B2B; border-radius:10px; transform:translate(-50%, 0);"></div>
    </div>
  </div>
{gen_footer("COMPONENTS: TEXT FIELDS & INPUTS", "55")}
</div>"""

# -----------------
# 4. SURFACES (CARDS, DIALOGS, SHEETS)
# -----------------
page_surfaces = f"""<div class="page doc-ds" style="display:flex; flex-direction:column; height: 100%;">
{gen_header("COMPONENTS: SURFACES (M3)", "56")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px; color:var(--sosp-black);">Superfícies: Dialogs i Cards</h1>
  <p style="font-family:'Noto Sans'; font-size:10pt; line-height:1.5;">L'aplicació M3 fa ús massiu de targetes (Cards) amb 3 opcions d'elevació que simulen profunditat mitjançant CSS shadows sense profunditat DOM per evitar caigudes als iPad A10.</p>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px; display:flex; gap:15px; font-family:'Noto Sans';">
      <div style="flex:1; padding:15px; box-shadow:0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); border-radius:12px; background:white;">
         <h3 style="margin-top:0; font-size:12pt; color:var(--sosp-black);">Elevated Card</h3>
         <p style="font-size:9pt; color:#666;">Separacions clàssiques flotant sobre el canvi de gris.</p>
      </div>
      <div style="flex:1; padding:15px; background:#F4F5F7; border-radius:12px;">
         <h3 style="margin-top:0; font-size:12pt; color:var(--sosp-black);">Filled Card</h3>
         <p style="font-size:9pt; color:#666;">Fons destacat sense ombra. Útil per agrupacions internes.</p>
      </div>
      <div style="flex:1; padding:15px; border:1px solid #CAC4D0; border-radius:12px; background:white;">
         <h3 style="margin-top:0; font-size:12pt; color:var(--sosp-black);">Outlined Card</h3>
         <p style="font-size:9pt; color:#666;">Un delimitador pur línia per no saturar l'escena visual.</p>
      </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px; font-family:'Noto Sans';">
    <h2 style="margin:0 0 10px 0; font-size:14pt; color:var(--sosp-black);">Dialog Modal (Finestres d'Alerta)</h2>
    <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:12px; display:flex; justify-content:center; align-items:center;">
       <div style="background:white; border-radius:28px; width:300px; padding:24px; box-shadow:0 8px 24px rgba(0,0,0,0.15);">
          <div style="font-size:24pt; color:#0F4A9A; text-align:center; margin-bottom:15px;">👤</div>
          <h3 style="margin:0 0 15px 0; font-size:16pt; font-weight:600; text-align:center; color:var(--sosp-black);">Avís Privacitat</h3>
          <p style="margin:0 0 24px 0; font-size:10pt; color:#444; line-height:1.4; text-align:center;">Heu de compartir la ubicació per llistar què hi ha a prop del panader.</p>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
             <span style="color:#0F4A9A; font-weight:600; font-size:10pt;">AVORTAR</span>
             <span style="color:#0F4A9A; font-weight:600; font-size:10pt;">CONCEDIR</span>
          </div>
       </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 0px; font-family:'Noto Sans';">
    <h2 style="margin:0 0 10px 0; font-size:14pt; color:var(--sosp-black);">Snackbar (Toasts Curts)</h2>
    <div style="background:#313033; color:#F4EFF4; padding:12px 16px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; max-width:400px; margin-top:10px;">
       <span style="font-size:10pt;">Pujant el Bando a la Torre...</span>
       <span style="color:#D0BCFF; font-weight:600; font-size:10pt;">DESFER</span>
    </div>
  </div>
{gen_footer("COMPONENTS: SURFACES", "56")}
</div>"""

# -----------------
# 5. NAVIGATION
# -----------------
page_nav = f"""<div class="page doc-ds" style="display:flex; flex-direction:column; height: 100%;">
{gen_header("COMPONENTS: NAVIGATION & BARS (M3)", "57")}
  <h1 style="font-size: 28pt; line-height: 1.1; margin-bottom: 15px; margin-top: 5px; color:var(--sosp-black);">Navegació M3 i Trams</h1>
  <p style="font-family:'Noto Sans'; font-size:10pt; line-height:1.5;">En comptes del clàssic Bottom Bar massiu, apostem pel corrent principal (NavigationBar M3) adaptant els paràmetres de mida pel grossària d'una falange humana gran com les del camp.</p>

  <div class="card" style="padding: 15px 25px; margin-bottom: 15px; font-family:'Noto Sans';">
    <h2 style="margin:0 0 10px 0; font-size:14pt; color:var(--sosp-black);">Navigation Bar (Footer)</h2>
    <div style="background:#F2F4F7; padding:12px; border-radius:16px; display:flex; justify-content:space-around; align-items:center; margin-top:15px;">
       <div style="display:flex; flex-direction:column; align-items:center; gap:4px; color:var(--sosp-black);">
          <div style="background:#EADDFF; padding:4px 20px; border-radius:16px; font-size:16pt;">🏠</div>
          <span style="font-size:8pt; font-weight:700;">Mur</span>
       </div>
       <div style="display:flex; flex-direction:column; align-items:center; gap:4px; color:var(--sosp-black); opacity:0.6;">
          <div style="padding:4px 20px; font-size:16pt;">🛒</div>
          <span style="font-size:8pt; font-weight:600;">Mercat</span>
       </div>
       <div style="display:flex; flex-direction:column; align-items:center; gap:4px; color:var(--sosp-black); opacity:0.6;">
          <div style="padding:4px 20px; font-size:16pt;">📬</div>
          <span style="font-size:8pt; font-weight:600;">Notificacions</span>
       </div>
       <div style="display:flex; flex-direction:column; align-items:center; gap:4px; color:var(--sosp-black); opacity:0.6;">
          <div style="padding:4px 20px; font-size:16pt;">⚙️</div>
          <span style="font-size:8pt; font-weight:600;">Ajustos</span>
       </div>
    </div>
  </div>

  <div class="card" style="padding: 15px 25px; margin-bottom: 0px; font-family:'Noto Sans';">
    <h2 style="margin:0 0 10px 0; font-size:14pt; color:var(--sosp-black);">Navigation Drawer (Menú Lateral "Llarg")</h2>
    <p style="font-size:9pt; margin-bottom:15px; color:var(--sosp-black);">En PWA iPad, es despèn des de l'esquerra cobrint la pantalla amb categories del Llibre.</p>
    <div style="display:flex;">
       <div style="width:250px; background:#FDFCF6; border-radius:0 16px 16px 0; padding:20px; box-shadow:2px 0 8px rgba(0,0,0,0.1);">
          <div style="font-size:14pt; font-weight:700; color:#555; margin-bottom:20px;">Menú Principal</div>
          <div style="display:flex; align-items:center; gap:15px; background:#FFEDD5; padding:12px; border-radius:28px; margin-bottom:5px; color:var(--sosp-black);">
             <span style="font-size:14pt;">📁</span><span style="font-weight:600; font-size:10pt;">Documentació Mestre</span>
          </div>
          <div style="display:flex; align-items:center; gap:15px; padding:12px; border-radius:28px; margin-bottom:5px; color:var(--sosp-black);">
             <span style="font-size:14pt; opacity:0.6;">📚</span><span style="font-weight:500; font-size:10pt; color:#444;">Arxius Històrics</span>
          </div>
          <div style="display:flex; align-items:center; gap:15px; padding:12px; border-radius:28px; color:var(--sosp-black);">
             <span style="font-size:14pt; opacity:0.6;">🛠</span><span style="font-weight:500; font-size:10pt; color:#444;">Eines d'Arquitecte</span>
          </div>
       </div>
       <div style="flex:1; background:rgba(0,0,0,0.1); border-radius:0 12px 12px 0;"></div>
    </div>
  </div>
{gen_footer("COMPONENTS: NAVIGATION", "57")}
</div>"""

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I will inject these 5 pages securely right before the section titled:
# <h1 style="font-size:32px; font-weight:900; margin:0;">LA VISTA COMPLETA
idx = text.rfind('<h1 style="font-size:32px; font-weight:900; margin:0;">LA VISTA COMPLETA')
if idx != -1:
    page_idx = text.rfind('<div class="page"', 0, idx)
    if page_idx != -1:
        before = text[:page_idx]
        after = text[page_idx:]
        new_text = before + "\n".join([page_colors, page_buttons, page_inputs, page_surfaces, page_nav]) + "\n\n" + after
        with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("M3 Pages Injected!")
else:
    print("WARNING: Could not find insertion point!")
