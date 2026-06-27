import re
import datetime

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to insert page-19 right before the current page-19.
# Let's find `<div class="page" id="page-19"` and change it to `id="page-20"`.
# And replace "PÀGINA 19 DE 19" to "PÀGINA 20 DE 20"
# Also update all "DE 19" to "DE 20" in page-num.

# First, update all "DE 19" to "DE 20"
html = html.replace('DE 19', 'DE 20')
html = html.replace('PÀGINA 19', 'PÀGINA 20')

# Except wait, I need the NEW page to be 19.
creation_date = "18 ABR 2026 05:47"
revision_date = "18 ABR 2026 07:44 (+2)" # keep it aligned with the previous ones

new_page_19 = f"""  <div class="page" id="page-19">
    <div class="doc-header">
      <img src="./public/assets/master/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble">
      <div class="meta"><span>12 — UX PROTOTYPE / EL PROJECTE</span></div>
      <div class="v-control" style="display: flex; flex-direction: column; align-items: flex-end; font-size: 6.5pt; font-family: monospace; color: var(--sosp-gray); text-transform: uppercase; line-height: 1.2; margin-left: auto; text-align: right;">
        <span>CREA: {creation_date}</span>
        <span>REV: {revision_date}</span>
      </div>
    </div>
    <h2 class="title" style="margin-top: 15px; margin-bottom: 5px;">UX PROTOTYPE / EL PROJECTE</h2>
    <div class="row" style="margin-bottom: 20px;">
      <p class="text" style="font-size: 9pt; max-width: 80%;">Arquitectura d'Alta Densitat del Llibre Interactiu. Esquema amb el Sidebar complet desplegat, la Barra d'Eines Superior del Lector heretada i la tipografia Noto Sans orquestrant la jerarquia del contingut pur de lectura.</p>
    </div>

    <!-- MOCKUP CONTAINER -->
    <div class="hero-image" style="width: 100%; height: 600px; background: #e5e5e5; display: flex; flex-direction: column; overflow: hidden; border-radius: 8px; font-family: 'Noto Sans', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      
      <!-- TOP BAR NAV (Black) -->
      <div style="height: 48px; background: #111; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; flex-shrink: 0;">
        <div style="display: flex; gap: 15px; color: #888;">
           <span>←</span> <span>→</span> <span>↻</span>
        </div>
        <div>
          <img src="./public/assets/master/logo-socdepoble-rect-blanc.svg" style="height: 24px;" alt="Logo">
        </div>
        <div style="display: flex; align-items: center; gap: 12px; color: white; font-size: 10pt;">
          <span style="font-weight: bold; border-right: 1px solid #444; padding-right: 12px;">VA</span>
          <div style="width: 24px; height: 24px; background: #6b4619; border-radius: 50%;"></div>
        </div>
      </div>

      <!-- MAIN APP CONTAINER -->
      <div style="flex: 1; display: flex; overflow: hidden;">
        
        <!-- SIDEBAR (Dark Theme) -->
        <div style="width: 200px; background: #111; color: white; display: flex; flex-direction: column; font-size: 11pt; flex-shrink: 0; box-sizing: border-box;">
          
          <div style="background: #3B82F6; color: white; padding: 14px 16px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
             <span>+</span> CONNECTAR
          </div>
          
          <div style="flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 4px; overflow-y: hidden;">
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">💬 Xat</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">📱 Mur</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">🛒 Mercat</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">📍 Pobles</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">📅 Calendari</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">🗺️ Mapa</div>
            
            <!-- ACTIVE ITEM -->
            <div style="padding: 10px 12px; background: var(--sosp-orange); border-radius: 6px; color: white; font-weight: bold; display: flex; align-items: center; gap: 10px;">
              📖 El Projecte
            </div>
            
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">🖼️ Multimèdia</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">📝 Bloc de Not...</div>
            <div style="padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; color: #BBB;">🧭 Full de Ruta</div>
          </div>
          
          <div style="padding: 16px; font-size: 7pt; color: #666; font-weight: bold;">
            V10.38.1-CANÒNIC<br><br>
            <span style="color: var(--sosp-orange);">PRIVACITAT</span>
          </div>
        </div>

        <!-- RIGHT PANE (Reader UI) -->
        <div style="flex: 1; display: flex; flex-direction: column; background: white; margin-left: -2px; z-index: 2; box-shadow: -4px 0 15px rgba(0,0,0,0.5);">
          
          <!-- Lector Sub-Header (Blue) -->
          <div style="height: 48px; background: #6366f1; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; font-size: 10pt; font-weight: 700;">
            <div style="display: flex; gap: 8px; align-items: center;">
               <span>📖</span> LLIBRE, 1/3298
            </div>
            <div style="display: flex; gap: 16px; color: #E0E7FF; font-weight: 600;">
               <span style="color: white; border-bottom: 2px solid white; padding-bottom: 12px; line-height: 42px;">LLIG</span>
               <span>💬 COMENTAR</span>
               <span>🧬 GENOTIP</span>
               <span>🔗 COMPARTIR</span>
            </div>
          </div>
          
          <!-- Content Area -->
          <div style="flex: 1; overflow: hidden; position: relative;">
             <!-- FAB -->
             <div style="position: absolute; bottom: 20px; right: 20px; width: 48px; height: 48px; background: var(--sosp-orange); border-radius: 50%; color: white; display: flex; justify-content: center; align-items: center; font-size: 20pt; font-weight: bold; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.4); line-height: 46px;">
                =
             </div>
             
             <!-- Document Text -->
             <div style="padding: 40px; max-width: 600px; margin: 0 auto; color: #111;">
                <h1 style="color: #0284c7; text-align: center; font-size: 16pt; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 40px;">PRÒLEG: LA VEU DEL POBLE</h1>
                <h2 style="font-size: 32pt; font-weight: 900; margin-bottom: 5px; line-height: 1;">SÓC DE POBLE</h2>
                <h3 style="font-size: 14pt; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 30px;">El Genotip Sintètic</h3>
                
                <p style="font-size: 11pt; line-height: 1.8; margin-bottom: 20px; color: #333;"><strong>Benvingut al cor del nostre ecosistema.</strong> Aquesta és la compilació magna, el tractat absolut de Sóc de Poble. Tota la terra, tota l'aigua i tot el coneixement s'han estructurat ací, en pur format físic i de text, perquè el projecte <strong>perdure en l'absència dels servidors.</strong></p>
                <p style="font-size: 11pt; line-height: 1.8; margin-bottom: 20px; color: #333;">Imagina un futur pròxim on no necessitarem empreses de tecnologia ni departaments informàtics per a construir eines comunitàries. El nostre objectiu definitiu és que arribarà el dia en què una persona, sense cap coneixement en programació, puga agafar este document imprès, ensenyar-li'l a una Intel·ligència Artificial i donar-li una simple ordre: "Fes-ho per mi". I llavors, la màquina compilarà en segons un poble sencer de zero per a tu.</p>
                <p style="font-size: 11pt; line-height: 1.8; margin-bottom: 20px; color: #333;">Davant la immensitat d'esta missió, hem dividit l'obra en <strong>Dos Volums:</strong> El <strong>Tomo 1</strong> conté l'ànima i les històries, llegible per humans. El <strong>Tomo 2</strong> conté el codi pur descentralitzat (l'ADN tècnic), un arxiu despullat de distraccions.</p>
             </div>
          </div>
          
        </div>
      </div>
    </div> <!-- /HERO -->
    
    <div class="doc-footer">
      <div></div>
      <div class="brand">SÓC DE POBLE / SISTEMA OPERATIU</div>
      <div class="page-num">PÀGINA 19 DE 20 | <a href="https://socdepoble.org">SOCDEPOBLE.ORG</a></div>
    </div>
  </div>

"""

html = html.replace('<div class="page" id="page-20" style="justify-content:center; align-items:center; text-align:center; background:#222; color:white;">', 
                    new_page_19 + '\n  <div class="page" id="page-20" style="justify-content:center; align-items:center; text-align:center; background:#222; color:white;">')

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Page 19 inserted successfully.")
