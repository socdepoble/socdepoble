import re

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove SÓC DE POBLE from white swatch
html = html.replace('<div class="swatch white" style="color:var(--sosp-black);">SÓC DE POBLE</div>', '<div class="swatch white"></div>')

# 2. Replace all corrupted base64 imgs. Since the user wants them to work everywhere, and provided them explicitly...
# Let's see what the backgrounds are. Most of them are just the logo.
# I will use the SVG relative path, which is clean and works in browsers and Affinity if kept together.
# Wait, to make it perfectly portable (as the previous AI intended), base64 encoding the SVGs is an option.
# Let's try to base64 encode the SVG.
import base64

def get_base64_svg(file_path):
    with open(file_path, 'rb') as svg_file:
        return f"data:image/svg+xml;base64,{base64.b64encode(svg_file.read()).decode('ascii')}"

svg_negre = get_base64_svg('./docs/Identitat/logo-socdepoble-rect-negre.svg')
svg_blanc = get_base64_svg('./docs/Identitat/logo-socdepoble-rect-blanc.svg')

# The original base64 was a PNG that started with iVBOR...
def repl_img(m):
    full_match = m.group(0)
    # The first logo is the cover one, maybe it was white or black depending on class?
    # Let's just use the negre one for all for now, or check context. 
    # Usually standard logo is negre on white background.
    return f'<img src="{svg_negre}" alt="Sóc de Poble" style="width: 100%; max-width: 250px;">'

html_fixed = re.sub(r'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyA[^>]+>', repl_img, html)

# Some specific sizes might be lost... Let's just replace the src attribute.
def repl_src(m):
    return f'src="{svg_negre}"'
html_fixed2 = re.sub(r'src="data:image/png;base64,[^"]+"', repl_src, html)

# applying strictly the src replacement will keep all original classes and styles!
html_final = re.sub(r'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyA[^"]+"', repl_src, html)

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html_final)

