import re

with open('Manual_Identitat_Extens.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make .meta text-align left or center when it's structurally in the center? 
# Wait, actually, he said "pon el control de versiones... en medio o al lado como tiene Sistema Operatiu Rural".
# So maybe the meta text should stay on the right, and v-control should be in the center?
# No, "como tienes Sistema Operatiu y ISO, y la versión..."
# The best way is:
# Logo (Left)   ---   Template Name (.meta) (Leftish)   ---   Version (.v-control) (Right)
# Or: Logo (Left)  ---  Version (Center)  --- Template Name (Right)

# Let's fix .meta to be centered, and .v-control to be right aligned.
# Currently: text-align: right; in .meta
html = re.sub(r'(\.doc-header \.meta\s*\{[\s\S]*?)text-align:\s*right;', r'\1text-align: center;', html)

with open('Manual_Identitat_Extens.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated CSS!")
