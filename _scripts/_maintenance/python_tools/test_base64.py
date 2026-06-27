import re
with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/Manual_Identitat_Extens.html', 'r') as f:
    html = f.read()

matches = re.findall(r'src="data:image/png;base64,([^"]+)"', html)
for i, m in enumerate(matches):
    with open(f'test_img_{i}.base64', 'w') as out:
        out.write(m)
