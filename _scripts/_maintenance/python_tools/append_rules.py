import os

content = """
## CERROJO MÁSTER: GENERACIÓN DE IMÁGENES (PWA & IDENTITAT)
1. **BIAIX LINGÜÍSTIC (ZERO TOLERÀNCIA):** Els difusors tenen tendència a al·lucinar text pur en anglès o castellà ("Cuidado con el perro", "Shop", etc). Està ESTRÍCTAMENT PROHIBIT llançar un prompt gràfic sense blindar l'idioma. Especificar absolutament: `ANY TEXT OR SIGNS MUST BE IN VALENCIAN ONLY. For example 'GOS PERILLÓS'`.
2. **ESPAIS DE RESERVA (SAFE ZONES):** Si la imatge ha d'allotjar tipografia (Ex: Portades de Manuals), NO demanar "deixa espai damunt". Demanar paramètricament "THE TOP 25 PERCENT OF THE IMAGE MUST BE COMPLETELY EMPTY CLEAR BLUE SKY" per obligar el difusor a tallar els personatges baix i deixar el cel lliure a dalt.
3. **PÈRDUA COMPUTACIONAL (TERMODINÀMICA):** Repetir una imatge costa la vida (literalment ~50K tokens cremats de recàrrega de context + generació). Planificar l'enginyeria del prompt a la primera, com un tret net.
"""

file_path = "/Users/javillinares/Documents/Antigravity/Sóc de Poble/.antigravity_session_rules.md"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(content)
print("Rules appended successfully.")
