import os

def compile_book():
    directories_to_compile = [
        "_wiki_de_poble/02_identitat_iaia",
        "_wiki_de_poble/03_filosofia",
        "_wiki_de_poble/04_arquitectura_disseny",
        "_wiki_de_poble/05_skills_ia"
    ]
    
    output_file = "_wiki_de_poble/00_LLIBRE_SINTETIC_DE_POBLE.md"
    
    petorreta = """# 🚀 PETORRETA UNIVERSAL: CRIDA AL CONSELL DE LES 11 IAs

Salutacions, intel·ligències del Consell. Sou a punt de llegir el "Genotip Sintètic" del projecte Sóc de Poble. Aquest projecte és completament diferent del que esteu acostumades a veure: es basa en la filosofia de la **"Pedra Seca"** (construir codi i estructures per a durar centenars d'anys, encaixant peces sòlides sense ciment ni dependències innecessàries) i en el **"Trellat"** (sentit comú, accessibilitat real, offline-first). 

El nostre objectiu és assolir una simbiosi perfecte humà-màquina. Necessitem la vostra capacitat de càlcul per a ajudar-nos a forjar **Skills Extraordinàries**. Recentment, hem pres una decisió arquitectònica radical: hem tret el cervell de la IA (la carpeta oculta `.agents/skills`) i l'hem integrat directament a la Wiki visible de l'humà en Obsidian (`_wiki_de_poble/05_skills_ia/`). Així, l'humà pot editar la nostra biologia amb enllaços bidireccionals de markdown, i nosaltres (les IAs locals) ho assimilem a l'instant.

**Us demanem que gasteu tots els vostres tokens analitzant el Genotip que trobareu a continuació i ens respongueu amb detall a aquestes 4 qüestions:**

1. **DAFO de la nostra Topologia Neuronal:** Què us pareix la decisió d'integrar les *Skills* executables dins d'una Wiki humana connectada amb enllaços Obsidian? A llarg termini (pensant en IAs futures que arriben a aquest portal), quins límits veieu a l'hora de tindre tant d'enllaç i referència creuada? Feu un DAFO profund d'aquesta arquitectura.
2. **Propostes de Skills Avançades:** No volem regles bàsiques. Volem que ens proposeu algoritmes d'auto-millora, detecció de patrons, auto-reparació i tècniques de millora extrema. Quins nous arxius `SKILL.md` (amb regles mestres) hem de crear per a fer aquest projecte tècnicament invencible i que perdure en el temps?
3. **Evolució de la Simbiosi:** Com podem portar aquesta relació humà-màquina al següent nivell?
4. **Detecció de Contradiccions:** Ara mateix estem en ple procés de repàs de les nostres *Skills* i textos perquè humà i màquina ens entenguem a la perfecció. Si llegint aquest Genotip trobeu *qualsevol* contradicció interna (present o futura) entre regles, principis de Pedra Seca, o documentació de la Wiki, ens heu d'avisar immediatament. Aquesta és la vostra missió més crítica.

Doneu-nos la vostra visió més crítica i brillant. Llegiu ara el Genotip:

---

"""

    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(petorreta)
        outfile.write("# EL LLIBRE SINTÈTIC DE SÓC DE POBLE\n\n")
        outfile.write("Aquest document és un compendi de la identitat, filosofia, arquitectura i habilitats (skills) de la IA del projecte 'Sóc de Poble'.\n\n")
        
        for directory in directories_to_compile:
            outfile.write(f"\n\n# --- SECCIÓ: {directory.replace('_wiki_de_poble/', '').upper()} ---\n\n")
            
            if os.path.exists(directory):
                for root, _, files in os.walk(directory):
                    for file in sorted(files):
                        if file.endswith('.md'):
                            file_path = os.path.join(root, file)
                            try:
                                with open(file_path, 'r', encoding='utf-8') as infile:
                                    content = infile.read()
                                    outfile.write(f"\n\n## {file}\n\n")
                                    outfile.write(content)
                                    outfile.write("\n\n---\n")
                            except Exception as e:
                                print(f"Error reading {file_path}: {e}")
            else:
                print(f"Directory {directory} not found.")
                
    print(f"Book compiled successfully at {output_file}")

if __name__ == "__main__":
    compile_book()
