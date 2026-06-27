import re

with open("Manual_Identitat_Extens.html", "r") as f:
    html = f.read()

# Remove the gray lines from the tint tables 
html = html.replace(' border-top:1px solid #ddd;', '')
html = html.replace(' border-right:1px solid #ddd;', '')
html = html.replace(' border-bottom:1px solid #ddd;', '')
html = html.replace(' border:1px solid #ddd;', '')

with open("Manual_Identitat_Extens.html", "w") as f:
    f.write(html)
