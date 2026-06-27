import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find boundaries
p3_start = text.find('<div class="page" id="page-03">')
p4_start = text.find('<div class="page" id="page-04">')
p3_content = text[p3_start:p4_start]

# 15px 25px -> 12px 25px padding inside card, margin-bottom 15px -> 12px
p3_content = p3_content.replace('padding: 15px 25px; margin-bottom: 15px;', 'padding: 12px 25px; margin-bottom: 12px;')

# For grid-gap we can reduce gap between .card and .grid-2
# there's: <div class="grid-2" style="margin-top: 15px;"> or maybe no inline margin? let's decrease general gaps
p3_content = p3_content.replace('padding-bottom: 10px; margin-bottom: 5mm', 'padding-bottom: 8px; margin-bottom: 3mm')

text = text[:p3_start] + p3_content + text[p4_start:]

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(text)

