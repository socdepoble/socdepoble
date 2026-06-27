import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Change class="page doc-ds" to class="page"
text = text.replace('class="page doc-ds"', 'class="page"')

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Removed doc-ds")
