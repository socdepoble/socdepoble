from pypdf import PdfReader

def list_all_fields(pdf_path):
    reader = PdfReader(pdf_path)
    fields = reader.get_fields()
    for name, field in fields.items():
        field_type = field.get('/FT')
        print(f"Field: {name} | Type: {field_type}")

if __name__ == "__main__":
    print("--- F97933 ---")
    list_all_fields("F97933_original.pdf")
