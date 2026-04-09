from pypdf import PdfReader, PdfWriter

def fill_f3921():
    # Force use of original
    reader = PdfReader("F3921_original.pdf")
    writer = PdfWriter()
    writer.append(reader)

    # [MASTER MAPPING] Verified by Visual Probe PROBE_F3921.pdf
    fields_to_fill = {
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A13[0]': 'LLINARES GARCÍA, FERNANDO LUIS',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A17[0]': '21670188W',
        # Address Section
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A29[0]': 'AVENIDA',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A30[0]': 'DE ESPAÑA',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A32[0]': '11',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A38[0]': '2º',
        # Town Section (Honoring Local Identity)
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A42[0]': 'LA TORRE DE LES MAÇANES',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A43[0]': '03107',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A44[0]': 'ALICANTE',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A45[0]': 'ESPAÑA',
        # Contact Section
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A46[0]': 'javillinares@me.com',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A48[0]': '635082813',
        
        # IBAN Section (Verified Boxes)
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B12[0]': 'BANCO SABADELL',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B14[0]': 'E',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B15[0]': 'S',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B16[0]': '6',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B17[0]': '2',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B18[0]': '0',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B19[0]': '0',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B20[0]': '8',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B21[0]': '1',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B22[0]': '1',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B23[0]': '3',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B24[0]': '3',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B25[0]': '6',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B26[0]': '7',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B27[0]': '1',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B28[0]': '0',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B29[0]': '0',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B30[0]': '0',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B31[0]': '6',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B32[0]': '6',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B33[0]': '7',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B34[0]': '5',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B36[0]': '5',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B100[0]': '8',
        'form1[0].Pagina1[0].Interior[0].seccion\\.b[0].B101[0]': '0',
    }

    fields_to_fill.update({
        'form1[0].Pagina2[0].Interior[0].seccion\\.f[0].F1[0]': 'SERVEI DE SANITAT VEGETAL',
        'form1[0].Pagina2[0].Interior[0].seccion\\.f[0].F2[0]': 'Conselleria de Agricultura, Ganadería y Pesca',
        'form1[0].Pagina2[0].Interior[0].seccion\\.f[0].F3[0]': 'Ayudas indemnizatorias Xylella fastidiosa',
        'form1[0].Pagina2[0].Interior[0].seccion\\.f[0].F4[0]': '18932',
    })

    for i in range(len(writer.pages)):
        writer.update_page_form_field_values(writer.pages[i], fields_to_fill)

    with open("F3921_NANDO_FINAL.pdf", "wb") as output_stream:
        writer.write(output_stream)

if __name__ == "__main__":
    fill_f3921()
    print("F3921_NANDO_FINAL.pdf generated with ABSOLUTE FIDELITY.")
