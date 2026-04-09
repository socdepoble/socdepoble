from pypdf import PdfReader, PdfWriter

def fill_f97933():
    # Force use of original to ensure No accumulation
    reader = PdfReader("F97933_original.pdf")
    writer = PdfWriter()
    writer.append(reader)

    # [MASTER MAPPING] Recalibrated via PROBE V1
    # Cognoms i Nom must be SEPARATED. No email in telephone.
    fields_to_fill = {
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A1[0]': 'LLINARES GARCÍA',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A2[0]': 'FERNANDO LUIS',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A3[0]': '21670188W',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A4[0]': 'AVENIDA DE ESPAÑA, 11, 2º',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A5[0]': '03107',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A6[0]': 'LA TORRE DE LES MAÇANES',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A7[0]': 'ALICANTE',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A8[0]': '635082813',
        'form1[0].Pagina1[0].Interior[0].seccion\\.a[0].A9[0]': 'javillinares@me.com',
        
        # Section D: Autoritzacions (Mapping verified binary)
        'form1[0].Pagina1[0].Interior[0].seccion\\.d[0].D13[0]': '1', 
        'form1[0].Pagina1[0].Interior[0].seccion\\.d[0].D14[0]': '1',
        'form1[0].Pagina1[0].Interior[0].seccion\\.d[0].D15[0]': '1',
        
        # Section G: Declaració
        'form1[0].Pagina3[0].Interior[0].seccion\\.g[0].G1[0]': '1',
        'form1[0].Pagina3[0].Interior[0].seccion\\.g[0].G2[0]': '1',
        'form1[0].Pagina3[0].Interior[0].seccion\\.g[0].G3[0]': '1',
        
        # Section H: Parcel·les (Mapping verified)
        'form1[0].Pagina3[0].Interior[0].seccion\\.h[0].H5[0]': 'LA TORRE DE LES MAÇANES',
        'form1[0].Pagina3[0].Interior[0].seccion\\.h[0].H6[0]': '2',
        'form1[0].Pagina3[0].Interior[0].seccion\\.h[0].H7[0]': '31',
        'form1[0].Pagina3[0].Interior[0].seccion\\.h[0].H8[0]': '03132A002000310000TZ',
    }
    
    # Surgical application
    for i in range(len(writer.pages)):
        writer.update_page_form_field_values(writer.pages[i], fields_to_fill)

    with open("F97933_NANDO_FINAL.pdf", "wb") as output_stream:
        writer.write(output_stream)

if __name__ == "__main__":
    fill_f97933()
    print("F97933_NANDO_FINAL.pdf generated with ABSOLUTE FIDELITY.")
