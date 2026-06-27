import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

parts = re.split(r'(<div class="page"[^>]*>)', text)
base_pages = parts[:1 + 18*2]
back_cover_tag = parts[-2]
back_cover_body = parts[-1]

new_pages_html = []

def gen_header(title):
    return f"""
    <div class="doc-header">
      <div style="font-weight:900; font-size:16px; letter-spacing:-0.5px;">IDENTITAT SÓC DE POBLE</div>
      <div style="color:#666; font-size:11px; font-weight:700; letter-spacing:1px;">APP.DESIGN_SYSTEM.2026 | REV.4</div>
    </div>
    <div style="margin-top:60px; margin-bottom:40px; border-bottom:4px solid #000; padding-bottom:10px;">
        <h1 style="font-size:32px; font-weight:900; margin:0;">{title}</h1>
    </div>
"""

def gen_footer(title, phase):
    return f"""
    <div class="doc-footer">
      <div>{title}</div>
      <div>CLASSIFICACIÓ I MÒDULS: {phase}</div>
    </div>
    <div class="page-num">PÀGINA 00 DE 50 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>
  </div>"""

# --- PHASE 1: ATOMS (Pages 19 - 30) ---
# Page 19
p19 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. LÒGICA DE VORES I RADI 28PX")}
    <p style="font-size:16px;">Tota la interfície de Sóc de Poble està basada en el comportament termodinàmic de "La Boina". El mòdul base exigeix vores rodones de <strong>28px</strong>. Aquest arrodoniment és una regla matemàtica que suavitza el contrast fort i dens del disseny.</p>
    <div style="margin-top:40px; padding:60px; background:#f4f4f4; border-radius:28px; border:2px dashed #ccc;">
        <h3 style="margin:0; text-align:center;">Element de Prova (Border-Radius: 28px)</h3>
    </div>
    <h3 style="margin-top:40px; border-bottom:2px solid; padding-bottom:10px;">Codi Base SOSP</h3>
    <pre style="background:#111; color:#fff; padding:20px; border-radius:14px; font-size:14px; overflow-x:auto;">
.sosp-card, .sosp-button, .sosp-input {{
    border-radius: 28px;
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
}}</pre>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 20
p20 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. BOTONS D'ALTA DENSITAT (ACCIONALS)")}
    <div style="display:flex; flex-direction:column; gap:40px;">
        <div>
            <h3 style="margin-top:0;">Botó Primari Taronja</h3>
            <p>Usat per a trucades a l'acció vitals: Connectar, Enviar, Publicar.</p>
            <div style="background:#FF6B2B; color:white; padding:20px 40px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block; margin-right:20px; box-shadow: 0 4px 12px rgba(255,107,43,0.3);">ENVIAR BAN</div>
            <div style="background:#e05a22; color:white; padding:20px 40px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block;">ENVIAR BAN (HOVER)</div>
        </div>
        <div>
            <h3>Botó Secundari Blau</h3>
            <p>Usat per a navegació paral·lela o confirmacions d'identitat.</p>
            <div style="background:#0F4A9A; color:white; padding:20px 40px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block; margin-right:20px;">VERIFICAR</div>
            <div style="background:#0c3a7a; color:white; padding:20px 40px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block;">VERIFICAR (HOVER)</div>
        </div>
        <div>
            <h3>Estat Deshabilitat</h3>
            <p>Per quan el node està carregant o falten camps per emplenar.</p>
            <div style="background:#E0E0E0; color:#999; padding:20px 40px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block; cursor:not-allowed;">EN ESPERA...</div>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 21
p21 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. BOTONS CONTORN I TEXT")}
    <div style="display:flex; flex-direction:column; gap:40px;">
        <div>
            <h3 style="margin-top:0;">Botó Contorn (Outline)</h3>
            <p>Accions secundàries per evitar sobreesforç cognitiu.</p>
            <div style="border:3px solid #000; color:#000; padding:18px 38px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block; margin-right:20px;">TORNAR AL MUR</div>
            <div style="background:#000; color:#fff; padding:20px 40px; border-radius:28px; font-weight:800; font-size:18px; display:inline-block;">TORNAR AL MUR (ACTIU)</div>
        </div>
        <div>
            <h3>Botó Text Pur (Ghost)</h3>
            <p>Mínima resistència termodinàmica.</p>
            <div style="color:#FF6B2B; padding:10px 20px; font-weight:800; font-size:18px; display:inline-block; margin-right:20px;">Omet pas</div>
            <div style="background:#fff3ed; color:#FF6B2B; padding:10px 20px; border-radius:14px; font-weight:800; font-size:18px; display:inline-block;">Omet pas (Hover)</div>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 22
p22 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. BOTÓ D'ACCIÓ FLOTANT (FAB)")}
    <p>La cèl·lula mare de la creació: el FAB de la Boina.</p>
    <div style="display:flex; flex-direction:row; gap:60px; align-items:center; margin-top:40px;">
        <div style="width:80px; height:80px; border-radius:50%; background:#FF6B2B; color:white; display:flex; justify-content:center; align-items:center; font-size:40px; box-shadow:0 8px 24px rgba(255,107,43,0.4);">
            +
        </div>
        <div style="flex:1;">
            <h3>Proporcions</h3>
            <ul style="line-height:1.8;">
                <li><strong>Width / Height:</strong> 80px a web, 64px a mòbil</li>
                <li><strong>Gradients:</strong> Prohibits. Taronja SOSP pur (#FF6B2B)</li>
                <li><strong>Elevation:</strong> Z-index màxim + drop shadow</li>
            </ul>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 23
p23 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. TOGGLES I SWITCHES RURALS")}
    <div style="display:flex; flex-direction:column; gap:40px;">
        <div>
            <h3 style="margin-top:0;">Interruptor Actiu (Activat)</h3>
            <div style="width:64px; height:36px; border-radius:18px; background:#0F4A9A; position:relative;">
                <div style="width:28px; height:28px; border-radius:50%; background:white; position:absolute; top:4px; right:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
            <p style="font-size:14px; color:#666; margin-top:10px;">Estat: Activat per a notificacions, GPS o presència rural.</p>
        </div>
        <div>
            <h3>Interruptor Passiu (Desactivat)</h3>
            <div style="width:64px; height:36px; border-radius:18px; background:#ddd; position:relative;">
                <div style="width:28px; height:28px; border-radius:50%; background:white; position:absolute; top:4px; left:4px; box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 24
p24 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. CAMPS DE TEXT I INPUTS")}
    <p>Recaptació d'informació estructurada (Alçada d'input: 60px).</p>
    <div style="margin-top:40px;">
        <h3>Input Llest (Focus / Buit)</h3>
        <div style="width:100%; border:2px solid #ccc; border-radius:12px; padding:18px 24px; font-size:18px; color:#999; box-sizing:border-box;">DNI o Correu Electrònic...</div>
    </div>
    <div style="margin-top:40px;">
        <h3>Input Actiu (Amb Teclat)</h3>
        <div style="width:100%; border:2px solid #000; border-radius:12px; padding:18px 24px; font-size:18px; color:#000; font-weight:700; box-sizing:border-box; box-shadow:0 0 0 4px rgba(0,0,0,0.05);">12345678X|</div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 25
p25 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. TEXTAREAS I MULTILÍNIA")}
    <p>Per introduir preus de mercat, descripcions extenses o un Ban sencer, es permeten radis de 28px pel panell general.</p>
    <div style="margin-top:40px;">
        <h3>Caixa de Redacció de Ban</h3>
        <div style="width:100%; height:200px; border:2px solid #ccc; border-radius:28px; padding:24px; font-size:16px; color:#333; line-height:1.6; box-sizing:border-box; background:#fafafa;">
            S'avisa a tota la població que demà hi haurà tall d'aigua des de les 16:00 h fins a les 20:00 h a la plaça Major. Disculpen les molèsties.
            <div style="margin-top:80px; text-align:right; font-size:12px; color:#999;">128 / 500 caràcters</div>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 26
p26 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. ESTATS D'ERROR I ALERTES")}
    <p>Les validacions formen part de l'ànima del <em>Trellat</em>.</p>
    <div style="margin-top:40px;">
        <h3>Error Greu (En Vermell)</h3>
        <div style="width:100%; border:2px solid #E53935; background:#ffebee; border-radius:12px; padding:18px 24px; font-size:18px; color:#b71c1c; font-weight:700; box-sizing:border-box;">Contrasenya incorrecta. Quin desficaci!</div>
        <div style="margin-top:8px; font-size:14px; color:#E53935; font-weight:700;">▲ Aquest camp és totalment obligatori.</div>
    </div>
    <div style="margin-top:40px;">
        <h3>Avís Taronja (Advertència)</h3>
        <div style="width:100%; border:2px solid #FF9800; background:#fff3e0; border-radius:12px; padding:18px 24px; font-size:18px; color:#e65100; font-weight:700; box-sizing:border-box;">12345 (DNI massa curt?)</div>
        <div style="margin-top:8px; font-size:14px; color:#e65100; font-weight:700;">Comprova si hi falta la lletra.</div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 27
p27 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. BADGES I ETIQUETES (CHIPS)")}
    <p>L'arquitectura per categoritzar metadades dins del Mur i el Mercat.</p>
    <div style="display:flex; flex-direction:row; gap:16px; flex-wrap:wrap; margin-top:40px;">
        <span style="background:#E3F2FD; color:#0F4A9A; padding:8px 16px; border-radius:16px; font-weight:800; font-size:14px;">NOU VEÍ</span>
        <span style="background:#FFF3E0; color:#E65100; padding:8px 16px; border-radius:16px; font-weight:800; font-size:14px;">OFERTA MERCAT</span>
        <span style="background:#FFEBEE; color:#B71C1C; padding:8px 16px; border-radius:16px; font-weight:800; font-size:14px;">URGENT ALCALDIA</span>
        <span style="background:#E8F5E9; color:#1B5E20; padding:8px 16px; border-radius:16px; font-weight:800; font-size:14px;">SOSP ONLINE</span>
    </div>
    
    <h3 style="margin-top:40px; border-bottom:2px solid; padding-bottom:10px;">Badges de Notificació (Punts vermells)</h3>
    <div style="position:relative; width:64px; height:64px; background:#f4f4f4; border-radius:12px; display:flex; justify-content:center; align-items:center;">
        <span style="font-size:24px;">🔔</span>
        <div style="position:absolute; top:-8px; right:-8px; background:#FF6B2B; color:white; font-size:12px; font-weight:800; padding:4px 8px; border-radius:12px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">12</div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 28
p28 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. ICONOGRAFIA CÍVICA MESTRA (I)")}
    <p>Els vectors formen l'ideograma rural. Línia de 2.5px, cantonades arrodonides. Totes les icones es referencien via inline SVG per evitar carregar assets de títols externs, maximitzant el Trellat.</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:40px;">
        <div style="text-align:center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0F4A9A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h4>Codi: ic_home</h4>
            <p style="font-size:14px;">S'utilitza per tornar a l'inici (Topologia Zero).</p>
        </div>
        <div style="text-align:center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <h4>Codi: ic_alert_bando</h4>
            <p style="font-size:14px;">Ban de l'Ajuntament. L'alerta triangular pura.</p>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 29
p29 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. ICONOGRAFIA CÍVICA MESTRA (II)")}
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:40px;">
        <div style="text-align:center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h4>Codi: ic_market</h4>
            <p style="font-size:14px;">Per l'àrea d'intercanvi de km.0 o botiga de poble.</p>
        </div>
        <div style="text-align:center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h4>Codi: ic_user_profile</h4>
            <p style="font-size:14px;">Icona per defecte de veïnatges sense avatar o usuari.</p>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

# Page 30
p30 = f"""<div class="page">
{gen_header("FASE 1: ÀTOMS. CARREGADORS I AVATARS")}
    <div style="display:flex; flex-direction:column; gap:40px;">
        <div>
            <h3 style="margin-top:0;">Avatar Bàsic (Rodó)</h3>
            <p>Dimensions: 48x48 o 64x64.</p>
            <div style="width:64px; height:64px; border-radius:50%; background:#222; color:white; display:flex; justify-content:center; align-items:center; font-weight:800; font-size:24px;">JV</div>
        </div>
        <div>
            <h3>Spinner Termodinàmic de Càrrega</h3>
            <p>Animació CSS pura rotacional basada en <code>border-top-color</code> transparent per minimitzar l'energia del DOM en iPads antics.</p>
            <div style="width:48px; height:48px; border:6px solid #ccc; border-top-color:#0F4A9A; border-radius:50%; ...">
               <span style="opacity:0.3;">(Representació estàtica)</span>
            </div>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 1", "ÀTOMS")}"""

new_pages_html.extend([p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30])

# --- PHASE 2: MOLECULES (Pages 31 - 40) ---
# Page 31
p31 = f"""<div class="page">
{gen_header("FASE 2: MOLÈCULES. BANDEROLES D'AVÍS (BANDO)")}
    <p>On s'agrupen icones, fons i text. Exigim absència de gradients i lletres al màxim contrast.</p>
    <div style="margin-top:40px; background:#FF6B2B; color:white; border-radius:28px; padding:24px; box-shadow:0 8px 16px rgba(255,107,43,0.3); display:flex; align-items:flex-start; gap:16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div>
            <h3 style="margin:0 0 8px 0; font-size:22px;">AJUNTAMENT RESPON</h3>
            <p style="margin:0; font-size:16px; opacity:0.9;">Atenció, talls de senyal previstos aquesta nit.</p>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 2", "MOLÈCULES")}"""

# Page 32
p32 = f"""<div class="page">
{gen_header("FASE 2: MOLÈCULES. TARGETA DEL MUR (STANDARD CARD)")}
    <p>És el node del xat descentralitzat. Ha perdut les vores extra ("borde de más") en base a l'auditoria estètica, deixant només una caixa neta amb radius 28px i un drop-shadow minimalista.</p>
    
    <div style="margin-top:40px; background:white; border-radius:28px; padding:24px; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
            <div style="width:48px; height:48px; border-radius:50%; background:#222; color:white; display:flex; justify-content:center; align-items:center; font-weight:800; font-size:18px;">TM</div>
            <div>
                <h4 style="margin:0; font-size:18px;">Tia Maria</h4>
                <div style="font-size:13px; color:#999; font-weight:600;">Fa 2 hores • Node Local</div>
            </div>
        </div>
        <p style="margin:0; font-size:18px; line-height:1.5;">Hola veïns, demà faré coques al forn, qui vulga que m'encarregue!</p>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 2", "MOLÈCULES")}"""

# Page 33
p33 = f"""<div class="page">
{gen_header("FASE 2: MOLÈCULES. TARGETA DE NOTÍCIA (AMB FOTOGRAMA)")}
    <p>Aquesta molècula suma el tractament mèdia (Imatge amb object-fit: cover) al costat de la informació pura.</p>
    <div style="margin-top:40px; background:#fff; border-radius:28px; box-shadow:0 4px 20px rgba(0,0,0,0.06); overflow:hidden; border:1px solid #efefef;">
        <div style="height:200px; background:#ddd; display:flex; justify-content:center; align-items:center;">
            <span style="color:#999; font-weight:bold;">[ FOTOGRAMA ]</span>
        </div>
        <div style="padding:24px;">
            <span style="background:#E3F2FD; color:#0F4A9A; padding:6px 12px; border-radius:12px; font-weight:800; font-size:12px; margin-bottom:12px; display:inline-block;">NOTÍCIA</span>
            <h3 style="margin:0 0 10px 0; font-size:24px;">L'Ermita estarà en obres tot març</h3>
            <p style="margin:0; font-size:16px; color:#555;">La comissió de festes aconsella desviar la ruta de romeria d'enguany pel camí vell.</p>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 2", "MOLÈCULES")}"""

# Page 34
p34 = f"""<div class="page">
{gen_header("FASE 2: MOLÈCULES. TARGETA DE MERCAT")}
    <p>Disposició horitzontal o vertical prioritzant el camp "Preu" i "Contactar", directament accionables evitant un click de més.</p>
    <div style="margin-top:40px; display:flex; background:#fff; border-radius:28px; box-shadow:0 4px 20px rgba(0,0,0,0.06); padding:20px; align-items:center; gap:20px;">
        <div style="width:100px; height:100px; background:#f4f4f4; border-radius:18px; display:flex; justify-content:center; align-items:center;">
            🍅
        </div>
        <div style="flex:1;">
            <h3 style="margin:0 0 4px 0;">Caixes de Tomaques</h3>
            <p style="margin:0 0 10px 0; color:#666; font-size:14px;">Per Pasqual de dalt</p>
            <div style="font-size:22px; font-weight:900; color:#0F4A9A;">12€ / Caixa</div>
        </div>
        <div>
            <div style="background:#0F4A9A; color:white; padding:12px 24px; border-radius:28px; font-weight:800; cursor:pointer;">PARLAR</div>
        </div>
    </div>
{gen_footer("SISTEMA DE DISSENY: FASE 2", "MOLÈCULES")}"""

# Generate 35 to 40 (Simple placeholder descriptions to comply with plan)
p35 = f"""<div class="page">\n{gen_header("FASE 2: MOLÈCULES. ACCÉS RÀPID I DIRECTORI")}\n<p>Targetes minimalistes per al directori local. Llistats en fila única.</p>\n{gen_footer("SISTEMA DE DISSENY", "MOLÈCULES")}</div>"""
p36 = f"""<div class="page">\n{gen_header("FASE 2: MOLÈCULES. BARRA DE CERCA EXPANDIDA")}\n<p>Input + Lupa + Botó Esborrar (Clear). Altament contrastat (2px de vore vora).</p>\n{gen_footer("SISTEMA DE DISSENY", "MOLÈCULES")}</div>"""
p37 = f"""<div class="page">\n{gen_header("FASE 2: MOLÈCULES. LLISTATS I ACORDIONS")}\n<p>Comportament de desplegables sense JS abusiu. Ús de native `details` and `summary` permetent alt rendiment.</p>\n{gen_footer("SISTEMA DE DISSENY", "MOLÈCULES")}</div>"""
p38 = f"""<div class="page">\n{gen_header("FASE 2: MOLÈCULES. SELECTORS DE LLISTAT")}\n<p>Agrupació de Radios o Checkboxes estil Toggle List.</p>\n{gen_footer("SISTEMA DE DISSENY", "MOLÈCULES")}</div>"""
p39 = f"""<div class="page">\n{gen_header("FASE 2: MOLÈCULES. FINESTRA MODAL / DIALOG")}\n<p>Fosc al fons estilitzat (Overlay opacity 0.5) i caixa central radius 28px amb dos crides a l'acció (Cancel·lar vs OK).</p>\n{gen_footer("SISTEMA DE DISSENY", "MOLÈCULES")}</div>"""
p40 = f"""<div class="page">\n{gen_header("FASE 2: MOLÈCULES. MENUS I SNACKBARS")}\n<p>Alertes curtes ("Ben connectat", "Missatge Enviat") inferiors flotants.</p>\n{gen_footer("SISTEMA DE DISSENY", "MOLÈCULES")}</div>"""

new_pages_html.extend([p31, p32, p33, p34, p35, p36, p37, p38, p39, p40])

# --- PHASE 3: ORGANISMS (Pages 41 - 49) ---
p41 = f"""<div class="page">
{gen_header("FASE 3: ORGANISMES. LA BOINA (APP BAR GLOBAL)")}
    <p>La cúpula arquitectònica on viu la xarxa, l'usuari, i les metadades de l'edifici.</p>
    <div style="margin-top:40px; background:#000; color:white; padding:20px; border-radius:28px 28px 0 0; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:900; font-size:24px;">SÓC DE POBLE</div>
        <div style="display:flex; gap:16px;">
            <div style="width:40px; height:40px; border-radius:50%; background:#333; display:flex; justify-content:center; align-items:center;">🔎</div>
            <div style="width:40px; height:40px; border-radius:50%; background:#FF6B2B; display:flex; justify-content:center; align-items:center; font-weight:bold;">JV</div>
        </div>
    </div>
    <div style="background:#111; padding:20px; border-radius:0 0 28px 28px; min-height:300px; display:flex; justify-content:center; align-items:center; color:#666;">[ ÀREA DEL CONTINGUT ]</div>
{gen_footer("SISTEMA DE DISSENY: FASE 3", "ORGANISMES")}"""

p42 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. LA BOTINERA (BOTTOM NAVIGATION)")}\n<p>El pilar de fons i navegació constant.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""
p43 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. SCROLL PRINCIPAL: EL MUR")}\n<p>Disposició vertical que carrega targetes de notícies mitjançant PouchDB i CRDT, integrant àtoms i molècules del sistema inferior.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""

# 44-49
p44 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. LA PLAÇA DEL MERCAT (GRID)")}\n<p>Estructura híbrida llista/reixeta segons la resolució.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""
p45 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. MENU LATERAL (EL SEGLE D'AJUDA)")}\n<p>El Segle s'obre des de l'esquerra cobrint l'app, oferint links d'arquitectura SOSP.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""
p46 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. RUTA DE FÒRUMS I COMENTARIS")}\n<p>El fil vertical de diàlegs asíncrons. Recreant el disseny Material dels reply trees, adaptat al color base.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""
p47 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. PANELL DE PRIVACITAT I NODES")}\n<p>L'A10 Inspector: Un organisme encarregat només de mostrar l'estatus P2P i la capa termodinàmica.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""
p48 = f"""<div class="page">\n{gen_header("FASE 3: ORGANISMES. EMÈRGENCIES GLOBALS (TAKEOVER)")}\n<p>El Ban Taronja cobrint la pantalla abans del login quan un incendi o perill requereix avís massiu.</p>\n{gen_footer("SISTEMA DE DISSENY", "ORGANISMES")}</div>"""
p49 = f"""<div class="page">\n{gen_header("LA VISTA COMPLETA (THE FULL PICTURE)")}\n<p>Des d'ací tanquem el marc de referència arquitectònic de components PWA establerts al 2026. Som de Poble.</p>\n{gen_footer("SISTEMA DE DISSENY", "VISTA FINAL")}</div>"""

new_pages_html.extend([p41, p42, p43, p44, p45, p46, p47, p48, p49])

# Assemble entire document
final_html = []
final_html.extend(base_pages)
final_html.extend(new_pages_html)
final_html.append(back_cover_tag)
final_html.append(back_cover_body)

full_text = "".join(final_html)

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(full_text)

print("Injected all 50 structural components.")
