import os
from reportlab.lib.pagesizes import A4
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY

def draw_first_page_background(canvas, doc):
    canvas.saveState()
    form = canvas.acroForm
    
    # Title
    canvas.setFont("Helvetica-Bold", 14)
    canvas.drawString(50, 800, "Ajuntament de Planes de la Baronia")
    canvas.setFont("Helvetica", 12)
    canvas.drawString(50, 780, "Plaça de Dalt Vila, 1, 03828 Planes")
    
    y = 730
    canvas.setFont("Helvetica", 11)
    
    # Nom
    canvas.drawString(50, y, "Al·legacions que formula:")
    form.textfield(name='nom', tooltip='Nom complet', x=185, y=y-5, width=200, height=20,
                   borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                   
    canvas.drawString(395, y, "amb DNI:")
    form.textfield(name='dni', tooltip='DNI/NIE', x=450, y=y-5, width=95, height=20,
                   borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                   
    y -= 40
    canvas.drawString(50, y, "amb domicili en:")
    form.textfield(name='domicili', tooltip='Domicili', x=140, y=y-5, width=405, height=20,
                   borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                   
    y -= 40
    canvas.drawString(50, y, "amb correu electrònic:")
    form.textfield(name='email', tooltip='Correu electrònic', x=170, y=y-5, width=170, height=20,
                   borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                   
    canvas.drawString(350, y, "i telèfon:")
    form.textfield(name='telefon', tooltip='Telèfon', x=400, y=y-5, width=145, height=20,
                   borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                   
    y -= 40
    canvas.drawString(50, y, "com a persona preocupada per la situació i,")
    
    y -= 30
    canvas.drawString(50, y, "En relació amb l’anunci de l’Ajuntament de Planes pel que es sotmet a informació pública")
    y -= 20
    canvas.drawString(50, y, "l’expedient de l’aprovació del Programa d’Actuació Integrada del sector Mas de la Foia")
    y -= 20
    canvas.drawString(50, y, "publicat al DOGV de l’11 de juny de 2026. Que són les següents:")
    
    canvas.restoreState()

def draw_later_pages_background(canvas, doc):
    pass

def build_pdf():
    pdf_path = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/CEEC/ALLEGACIONS_MEV_EDITABLE.pdf"
    doc = BaseDocTemplate(pdf_path, pagesize=A4, rightMargin=50, leftMargin=50)
                            
    # Frame for the first page (starts lower because of the form fields)
    frame_first = Frame(50, 50, A4[0]-100, 450, id='first_page')
    # Frame for the later pages (full height)
    frame_later = Frame(50, 50, A4[0]-100, A4[1]-100, id='later_pages')
    
    template_first = PageTemplate(id='FirstPage', frames=frame_first, onPage=draw_first_page_background)
    template_later = PageTemplate(id='LaterPages', frames=frame_later, onPage=draw_later_pages_background)
    
    doc.addPageTemplates([template_first, template_later])
    
    styles = getSampleStyleSheet()
    style_normal = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    style_heading = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        spaceBefore=12,
        spaceAfter=6,
        textColor='#1a1a1a'
    )
    
    Story = []
    
    # Read text
    with open('_wiki_de_poble/05_Escriptori_Soc_de_Poble/CEEC/alegacions.txt', 'r', encoding='utf-8') as f:
        text = f.read()
        
    lines = text.split('\n')
    
    skip = True
    for line in lines:
        if "1. LAS CONDICIONES DE LA" in line:
            skip = False
        if skip:
            continue
            
        line = line.strip()
        if not line:
            continue
            
        if line[0].isdigit() and ('.' in line[:3]):
            Story.append(Paragraph(line, style_heading))
        else:
            Story.append(Paragraph(line, style_normal))

    # Add signature block at the end
    Story.append(Spacer(1, 40))
    Story.append(Paragraph("A Planes, a ______ de ___________________ de 2026", style_normal))
    Story.append(Spacer(1, 40))
    Story.append(Paragraph("Signatura:", style_normal))
    
    # We only want the first page to use the first template, and the rest the second.
    # We could insert a NextPageTemplate command, but since BaseDocTemplate uses the first
    # template by default, we just need to tell it to switch after the first page... wait,
    # actually if we just put NextPageTemplate('LaterPages') at the start, it will apply to
    # the NEXT page (page 2).
    from reportlab.platypus import NextPageTemplate
    Story.insert(0, NextPageTemplate('LaterPages'))
    
    doc.build(Story)
    print(f"PDF generated successfully at {pdf_path}")

if __name__ == '__main__':
    build_pdf()
