import re

with open("Manual_Identitat_Extens.html", "r") as f:
    html = f.read()

# 1. Fix the mangled page-num elements
def fix_mangled_page_num(match):
    attrs = match.group(1) # e.g. ' style="01"' or ' style="16"'
    inner = match.group(2) # e.g. 'PÀGINA  DE 16 ...' or 'PÀGINA  style="color:white;" DE 16 ...'
    
    # Extract the actual number
    # For style="01", the number is 01
    mNum = re.search(r'style="(\d+)"', attrs)
    
    if mNum:
        num = mNum.group(1)
        fixed = f'<div class="page-num">PÀGINA {num} DE 16 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto;">SOCDEPOBLE.ORG</a></div>'
        return fixed
    else:
        # PÀGINA 16: it matched style="16" originally? Let's check the grep output:
        # <div class="page-num" style="16">PÀGINA  style="color:white;" DE 16
        # The number is inside style="16"
        mNum = re.search(r'style="(\d+)"', attrs)
        if mNum:
           num = mNum.group(1)
           fixed = f'<div class="page-num" style="color:white;">PÀGINA {num} DE 16 | <a href="https://socdepoble.org" target="_blank" style="pointer-events: auto; color: white;">SOCDEPOBLE.ORG</a></div>'
           return fixed
        # fallback
        return match.group(0)

html = re.sub(r'<div class="page-num"(.*?)>(.*?)</div>', fix_mangled_page_num, html)

# 2. Fix Page 16 specifically
old_legal_text = """<div style="margin-top: 80px; font-size:9pt; color:#666; font-family:monospace; line-height:2;">
      COMPILACIÓ: FASE 2.80 - BÍBLIA DE DISSENY<br>
      ENGINY: ANTIGRAVITY MCP<br>
      NORMATIVA FORMAT CROMÀTIC: FOGRA-39 / HEX RGB<br>
      EXTRACCIÓ: 2026-04-18T05:00:00+02:00<br>
      LLICÈNCIA USO LOCAL RESTRINGIT
    </div>"""

new_legal_text = """<div style="margin-top: 80px; font-size:9pt; color:#666; font-family:monospace; line-height:1.8;">
      COMPILACIÓ: FASE 2.80 - BÍBLIA DE DISSENY<br>
      ENGINY: ANTIGRAVITY MCP<br>
      NORMATIVA FORMAT CROMÀTIC: FOGRA-39 / HEX RGB<br><br>
      <span style="color:#FFF;">LLICÈNCIA D'ÚS: CREATIVE COMMONS (CC BY-NC-SA 4.0)</span><br>
      <span style="font-size: 8pt; color: #888;">Permesa la reproducció i adaptació lliure sempre que se cite l'autoria original,<br>
      no es faça un ús comercial i es compartisca sota la mateixa llicència.</span><br><br>
      <span style="color:#FFF;">Aquest document actua com a Bíblia de Disseny fundacional per a "Sóc de Poble",<br>
      establint els fonaments gràfics, comunicatius i l'arquitectura del sistema.</span><br><br>
      2026 © SÓC DE POBLE. TOTS ELS DRETS RESERVATS.
    </div>"""

html = html.replace(old_legal_text, new_legal_text)

# Remove the clashing footer copyright completely
clashing_footer = """<div class="doc-footer" style="border-top-color:#444;">
      <div style="color:#888;">2026 © SÓC DE POBLE. TOTS ELS DRETS CAPTEURATS LOCALMENT.</div>
    </div>"""

new_footer = """<div class="doc-footer" style="border-top-color:#444; border-bottom:none;">
      <!-- Footer content moved inside the text block to prevent overlap -->
    </div>"""

html = html.replace(clashing_footer, new_footer)

with open("Manual_Identitat_Extens.html", "w") as f:
    f.write(html)
