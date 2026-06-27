import re

with open("Manual_Identitat_Extens.html", "r") as f:
    html = f.read()

# Replace border-left boxes with background tinted boxes (10% opacity)
html = html.replace(
    'background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid var(--sosp-orange);',
    'background:rgba(255, 115, 0, 0.1); padding:15px; border-radius:8px;'
)

html = html.replace(
    'background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid var(--sosp-blue);',
    'background:rgba(9, 132, 227, 0.1); padding:15px; border-radius:8px;'
)

html = html.replace(
    'background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid var(--sosp-green);',
    'background:rgba(57, 200, 79, 0.1); padding:15px; border-radius:8px;'
)

with open("Manual_Identitat_Extens.html", "w") as f:
    f.write(html)
