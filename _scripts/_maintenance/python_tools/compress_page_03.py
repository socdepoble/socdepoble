import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find boundaries
p3_start = text.find('<div class="page" id="page-03">')
p4_start = text.find('<div class="page" id="page-04">')

p3_content = text[p3_start:p4_start]

# reduce margin-bottom on this specific header
p3_content = p3_content.replace('margin-bottom: 10mm;', 'margin-bottom: 5mm;')

# modify cards padding and margin
p3_content = p3_content.replace('<div class="card">', '<div class="card" style="padding: 15px 25px; margin-bottom: 15px;">')
# there is a card with <div class="card" style="margin-top:auto;">
p3_content = p3_content.replace('<div class="card" style="margin-top:auto;">', '<div class="card" style="padding: 15px 25px; margin-bottom: 0;">')
# wait, if tipografia showcase is too tall, maybe we can shrink its h2 margins
p3_content = re.sub(r'<h2 style="font-size: 10pt;">', '<h2 style="font-size: 10pt; margin-bottom: 10px; margin-top: 0;">', p3_content)

# reduce H1 margin
p3_content = p3_content.replace('margin-bottom: 15px; margin-top: 5px;', 'margin-bottom: 10px; margin-top: 0px; font-size: 26pt;')

text = text[:p3_start] + p3_content + text[p4_start:]

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(text)

