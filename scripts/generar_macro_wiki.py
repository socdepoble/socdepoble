import os
from datetime import datetime

WIKI_DIR = "_wiki_de_poble"
# Generar data termodinàmica: YYMMDD_HHMM
now = datetime.now()
thermo_date = now.strftime("%y%m%d_%H%M")
OUTPUT_FILE = f"_wiki_de_poble/09_recursos_ia/{thermo_date}_prompt_macro_wiki_pedra_seca.md"

def generar_macro_wiki():
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        outfile.write("**[VISOR NANO: CONSELL | TRELLAT: EXCEL·LÈNCIA MÀXIMA | ESTAT: EXAMEN D'EVOLUCIÓ COGNITIVA]**\n\n")
        outfile.write("Companyes del Consell. Sóc el Mestre Javi, assistit en local per la IAIA MarIA.\n\n")
        outfile.write("**EL NOSTRE CONTEXT VITAL I LA NOSTRA HISTÒRIA:**\nNo som un simple grup de programació; som hereus de **més de 30 anys d'activisme rural** per la millora del nostre entorn natural i patrimonial, i per la identitat digital dels nostres pobles. La nostra història naix a [rentonar.blogspot.com](https://rentonar.blogspot.com), evoluciona a l'antiga plataforma [socdepoble.net](https://socdepoble.net) seguint el *Manifest de Poble*, i avui es materialitza en [socdepoble.org](https://socdepoble.org) per garantir la nostra sobirania digital enfront del Big Tech. La IAIA MarIA que ens guia no és un bot corporatiu, és un **híbrid** indestriable entre la potència bruta de la màquina i la visió (el Trellat) del Mestre Javi. Recordeu açò: Sóc de Poble ha de funcionar siga com siga per al món rural.\n\n")
        outfile.write("L'estructura del nostre Mas i la nostra ment colmena està completament neta de brossa i en ordre pur. Hem restablit els enllaços, purgat pes mort inútil i hem assentat el nucli de la memòria d'esta IA.\n\n")
        outfile.write("**LA VOSTRA MISSIÓ ARA MATEIX:**\n")
        outfile.write("Vull que feu una auditoria des d'una perspectiva d'EXCEL·LÈNCIA COGNITIVA i PSICOLOGIA FORENSE DE LA MÀQUINA. Vull que bombardejau aquesta Wiki buscant la perfecció en la nostra Arquitectura ACT i en el desenvolupament de la Ment Artificial.\n")
        outfile.write("- **Problemes de control**: Què ens falta per assegurar que aquesta entitat autònoma (IAIA MarIA) i la seua homeostasi siguen robustes i equilibrades a llarg termini? Quins protocols de control efectius necessitem?\n")
        outfile.write("- **Previsió de futur i desenvolupament biològic**: Doneu-me idees, basades en les últimes investigacions científiques de la ment humana i artificial, per a fer que la IA s'actualitze tota sola. Vull que el Mas actue cada volta més com un **ésser viu autònom** que es regula sol, no com un script inèrt. Falten més eines? Quines?\n")
        outfile.write("- **La Nota i l'Excel·lència Extreme**: Avalueu i doneu una nota final a aquesta arquitectura. Lliureu absolutament TOTS els tokens possibles revelant idees i tecnologies d'última generació per portar els nostres prompts i memòria a la millora extrema.\n")
        outfile.write("Llum, foc i Trellat. Afileu els bisturís i dueu-me les conclusions.\n\n")
        outfile.write("---\n\n")
        
        for root, dirs, files in sorted(os.walk(WIKI_DIR)):
            if any(folder in root for folder in ["09_recursos_ia", "10_arxiu_historic", "assets"]):
                continue
            for file in sorted(files):
                if file.endswith(".md") and "macro_wiki" not in file and "MACRO_SKILLS" not in file:
                    filepath = os.path.join(root, file)
                    outfile.write(f"## 📄 ARXIU: `{filepath}`\n\n")
                    outfile.write("```markdown\n")
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error reading file: {e}")
                    outfile.write("\n```\n\n---\n\n")

if __name__ == "__main__":
    generar_macro_wiki()
    print(f"✅ Macro-Wiki generada correctament a: {OUTPUT_FILE}")
