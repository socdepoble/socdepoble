from pypdf import PdfReader, PdfWriter

def generate_probe(pdf_path, output_path):
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    writer.append(reader)
    
    fields = reader.get_fields()
    fields_to_fill = {}
    
    for name, field in fields.items():
        if field.get('/FT') == '/Tx': # Text fields
            fields_to_fill[name] = name.split('.')[-1] # Put the short name in the box
        elif field.get('/FT') == '/Btn': # Checkboxes/Buttons
            fields_to_fill[name] = '1'
            
    # Apply to all pages
    for i in range(len(writer.pages)):
        writer.update_page_form_field_values(writer.pages[i], fields_to_fill)
        
    with open(output_path, "wb") as output_stream:
        writer.write(output_stream)
    print(f"Probe generated: {output_path}")

if __name__ == "__main__":
    generate_probe("F97933_original.pdf", "PROBE_F97933.pdf")
    generate_probe("F3921_original.pdf", "PROBE_F3921.pdf")
