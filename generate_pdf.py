import os
from reportlab.lib.pagesizes import A4
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import NextPageTemplate

class SignatureAndDateFlowable(Flowable):
    def __init__(self):
        Flowable.__init__(self)
        self.width = 400
        self.height = 150

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        self.canv.saveState()
        form = self.canv.acroForm
        
        self.canv.setFont("Helvetica", 11)
        self.canv.drawString(0, 120, "A Planes, a ")
        form.textfield(name='dia', tooltip='Dia', x=65, y=115, width=40, height=20,
                       borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
        
        self.canv.drawString(110, 120, " de ")
        form.textfield(name='mes', tooltip='Mes', x=135, y=115, width=120, height=20,
                       borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                       
        self.canv.drawString(260, 120, " de 2026")
        
        self.canv.drawString(0, 70, "Signatura:")
        # A large box for the signature
        form.textfield(name='signatura', tooltip='Signatura', x=0, y=0, width=300, height=60,
                       borderStyle='inset', borderWidth=1, textColor='black', fontSize=12)
                       
        self.canv.restoreState()

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

    # Add signature block at the end using our custom Flowable
    Story.append(Spacer(1, 40))
    Story.append(SignatureAndDateFlowable())
    
    Story.insert(0, NextPageTemplate('LaterPages'))
    
    doc.build(Story)
    print(f"PDF generated successfully at {pdf_path}")

if __name__ == '__main__':
    build_pdf()
