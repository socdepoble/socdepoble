const fs = require('fs');

const file = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html';
let content = fs.readFileSync(file, 'utf8');

const masterPageStruct = `
  <div class="page" id="temp-master-page">
    <div class="doc-header">
      <div style="font-weight:900; font-size:16px; letter-spacing:-0.5px;">IDENTITAT SÓC DE POBLE</div>
      <div style="color:#666; font-size:11px; font-weight:700; letter-spacing:1px;">APP.DESIGN_SYSTEM.2026 | VISTA MESTRA</div>
    </div>
    
    <div style="margin-top:20px; flex:1; display:flex; flex-direction:column; border:2px solid #000; border-radius:12px; overflow:hidden; background:#fff; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
        
        <!-- Top App Bar -->
        <div style="height:48px; background:#000; display:flex; align-items:center; justify-content:center; color:white; padding:0 20px;">
            <div style="font-size:16px; font-weight:800; letter-spacing:2px; display:flex; align-items:center; gap:10px;">
               SÓC DE POBLE <span style="font-size:10px; color:#999;">PORTAL DE POBLES CONNECTATS</span>
            </div>
            <div style="margin-left:auto; width:28px; height:28px; border-radius:50%; background:#FF6B2B; display:flex; justify-content:center; align-items:center; font-size:12px; font-weight:bold;">VA</div>
        </div>

        <!-- Main Workspace -->
        <div style="display:flex; flex:1; height:600px;">
            
            <!-- Sidebar Left: Navigation & Chats -->
            <div style="width:300px; display:flex; border-right:1px solid #e0e0e0; background:#fff;">
                
                <!-- Pure Nav Column -->
                <div style="width:100px; background:#fafafa; border-right:1px solid #e0e0e0; display:flex; flex-direction:column;">
                    <div style="height:48px; background:#FF6B2B; color:white; display:flex; justify-content:center; align-items:center; font-weight:900; cursor:pointer;">
                        + CON.
                    </div>
                    <div style="padding:10px; font-size:11px; font-weight:800; color:#444; flex:1;">
                        <ul style="list-style:none; padding:0; margin:0; line-height:2.6;">
                            <li style="color:#FF6B2B; font-weight:900;">💬 Xat</li>
                            <li>🏠 Mur</li>
                            <li>🧺 Mercat</li>
                            <li>📍 Pobles</li>
                            <li>🗓 Calendari</li>
                            <li>🗺 Mapa</li>
                        </ul>
                    </div>
                    <div style="padding:10px; background:#222; color:#fff; font-size:8px; text-align:center;">
                        V10.28.1<br>PRIVACITAT
                    </div>
                </div>

                <!-- Chats / Agents Column -->
                <div style="flex:1; display:flex; flex-direction:column; background:#fff;">
                    <div style="padding:10px; border-bottom:1px solid #f0f0f0;">
                         <div style="background:#f4f4f4; border-radius:18px; padding:6px 12px; font-size:11px; color:#999;">🔍 Cerca un xat...</div>
                    </div>
                    <div style="flex:1; overflow:hidden; padding:10px;">
                        <ul style="list-style:none; padding:0; margin:0; font-size:12px;">
                            <!-- IAIA MarIA -->
                            <li style="display:flex; gap:8px; align-items:center; margin-bottom:16px;">
                                <div style="width:32px; height:32px; border-radius:50%; background:#FF6B2B; color:white; display:flex; justify-content:center; align-items:center; font-size:16px;">👵🏼</div>
                                <div style="line-height:1.2;">
                                    <div style="font-weight:800; color:#FF6B2B;">IAIA MarIA</div>
                                    <div style="font-size:10px; color:#888;">Dignitat, terra i xarxa.</div>
                                </div>
                            </li>
                            <!-- Andreu Soler -->
                            <li style="display:flex; gap:8px; align-items:center; margin-bottom:16px;">
                                <div style="width:32px; height:32px; border-radius:50%; background:#0F4A9A; color:white; display:flex; justify-content:center; align-items:center; font-size:16px;">🧑🏻‍🌾</div>
                                <div style="line-height:1.2;">
                                    <div style="font-weight:800;">Andreu Soler</div>
                                    <div style="font-size:10px; color:#888;">L'Andreu és el rellotge.</div>
                                </div>
                            </li>
                            <!-- Tia Maria -->
                            <li style="display:flex; gap:8px; align-items:center; margin-bottom:16px;">
                                <div style="width:32px; height:32px; border-radius:50%; background:#1B5E20; color:white; display:flex; justify-content:center; align-items:center; font-size:16px;">👂🏼</div>
                                <div style="line-height:1.2;">
                                    <div style="font-weight:800;">Tia Maria</div>
                                    <div style="font-size:10px; color:#888;">El radar social local.</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- Barra Azul "Scroll Fijada" solicitada por el usuario -->
                    <div style="background:#0F4A9A; color:white; padding:10px; font-weight:800; font-size:11px; text-align:center;">
                        ACTUALITZANT CRDT...
                    </div>
                </div>

            </div>

            <!-- Div Contenedor Principal: Mortadelo a lo que dé -->
            <div style="flex:1; background:#efefef; position:relative; overflow:hidden;">
                <!-- Omitimos el prologo, clavamos la imagen literal -->
                <img src="/Users/javillinares/.gemini/antigravity/brain/496d9805-3764-4fb3-9eb4-f7a6ed5905d9/cover_nano_comic_v3_1776489490791.png" style="width:100%; height:100%; object-fit:cover;" alt="Mortadelo Cover SOSP" />
            </div>

        </div>
    </div>

    <div class="doc-footer">
      <div>MAPA DEL SISTEMA</div>
      <div>VISTA MESTRA REPLICADA</div>
    </div>
    <div class="page-num">PÀGINA MESTRA | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>
  </div>`;

// Insert the new page right before page 19
const insertionPoint = '<div class="page" id="page-19">';

if (content.includes(insertionPoint)) {
   content = content.replace(insertionPoint, masterPageStruct + '\n\n' + insertionPoint);
   fs.writeFileSync(file, content);
   console.log("Master View Page Inserted Successfully");
} else {
   console.log("Error: Could not find page 19 injection point.");
}
