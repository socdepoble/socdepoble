import os
import glob
import markdown

skills_dir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/.agents/workflows'
llibre_path = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/public/assets/llibre-sencer.html'
historical_dir = os.path.join(skills_dir, 'papelera_obsoleta')

if not os.path.exists(historical_dir):
    os.makedirs(historical_dir)

md_files = glob.glob(os.path.join(skills_dir, '*.md'))
md_files.sort()

html_to_append = '\n\n'
chapter_counter = 51

for file_path in md_files:
    filename = os.path.basename(file_path)
    
    # Excluir archivos que no deben ser migrados o que no son skills normales
    if filename.startswith('00_GENOTIPO'):
        continue
    if filename == '00_MACROPROMPT_CODEX.md':
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parsed_html = markdown.markdown(content)
    
    title = filename.replace('.md', '')
    
    # Se añade la etiqueta HTML
    section_html = f"""
<section class="codex-chapter" style="margin-top: 6rem;">
    <h2 style="color: #4338ca; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem;">Capítol {chapter_counter}: Skill - {title}</h2>
    <div style="font-family: var(--font-body, system-ui); line-height: 1.6; color: #333;" class="skill-content">
{parsed_html}
    </div>
</section>
"""
    html_to_append += section_html
    chapter_counter += 1
    
    # Mover a papelera_obsoleta
    new_path = os.path.join(historical_dir, filename)
    os.rename(file_path, new_path)

with open(llibre_path, 'a', encoding='utf-8') as f:
    f.write(html_to_append)

print("¡Habilidades migradas y añadidas al Llibre de Gènesi con éxito!")
