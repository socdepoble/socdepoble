import re

with open("Manual_Identitat_Extens.html", "r") as f:
    html = f.read()

# Make the contrast stronger for those light description boxes without lines
html = html.replace('background:#f9f9f9; padding:15px;', 'background:#f0f0f0; padding:15px;')

with open("Manual_Identitat_Extens.html", "w") as f:
    f.write(html)
