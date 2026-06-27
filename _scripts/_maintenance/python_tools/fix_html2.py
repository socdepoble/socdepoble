import re

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all SVG base64 with a clean relative path
def repl_src(m):
    return 'src="./docs/Identitat/logo-socdepoble-rect-negre.svg"'

html_final = re.sub(r'src="data:image/svg\+xml;base64,[^"]+"', repl_src, html)

with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html_final)

