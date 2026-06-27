import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I removed the closing </div> of the doc-header on line 676 accidentally!
text = text.replace(
'''        <span style="display:block;">LLENGUATGE VISUAL I HUMOR <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> REV: 18 ABR 2026 07:44 (+2)</span>
      </div>
    <h1 style="margin-bottom: 20px;">Estil Ibàñez i L'Ànima de Bruguera</h1>''',
'''        <span style="display:block;">LLENGUATGE VISUAL I HUMOR <span style='color:#ccc; font-weight:normal; margin:0 4px;'>|</span> REV: 18 ABR 2026 07:44 (+2)</span>
      </div>
    </div>

    <h1 style="margin-bottom: 20px;">Estil Ibàñez i L'Ànima de Bruguera</h1>'''
)

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(text)
