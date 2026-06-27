#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
COMPILADOR DE COHERÈNCIA - Sóc de Poble
Detecta enllaços trencats, nodes orfes i contradiccions crítiques al Genotip Sintètic.

Ús: python3 compilador_coherencia.py [ruta_a_wiki]
Exemple: python3 compilador_coherencia.py _wiki_de_poble/
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict
from datetime import datetime

class CompiladorCoherencia:
    def __init__(self, wiki_path):
        self.wiki_path = Path(wiki_path)
        self.arxius = {}  # {nom_base: ruta_completa}
        self.enllacos = defaultdict(list)  # {origen: [destins]}
        self.contradiccions = []
        self.nodes_orfes = []
        self.enllacos_trencats = []
        
    def escanejar_arxius(self):
        """Escaneja tots els .md de la wiki i construeix l'índex."""
        print(f"🔍 Escanejant {self.wiki_path}...")
        
        for ruta in self.wiki_path.rglob("*.md"):
            nom_base = ruta.stem.lower()
            self.arxius[nom_base] = ruta
            
        print(f"✅ Trobats {len(self.arxius)} arxius Markdown")
        
    def extreure_enllacos(self):
        """Extreu tots els [[WikiLink]] de cada arxiu."""
        patro_wikilink = re.compile(r'\[\[([^\]]+)\]\]')
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read()
                
            enllacos_trobats = patro_wikilink.findall(contingut)
            
            for enllac in enllacos_trobats:
                # Neteja l'enllaç (elimina pipes d'àlies: [[Arxiu|Àlies]])
                enllac_net = enllac.split('|')[0].strip().lower()
                self.enllacos[nom_base].append(enllac_net)
                
    def validar_enllacos(self):
        """Verifica que tots els enllaços apunten a arxius existents."""
        for origen, destins in self.enllacos.items():
            for desti in destins:
                # Busca el destí a l'índex (permet variacions de nom)
                trobat = False
                for nom_base in self.arxius.keys():
                    if desti in nom_base or nom_base in desti:
                        trobat = True
                        break
                
                if not trobat:
                    self.enllacos_trencats.append({
                        'origen': origen,
                        'desti': desti,
                        'ruta_origen': self.arxius[origen]
                    })
                    
    def detectar_nodes_orfes(self):
        """Detecta arxius que ningú enllaça."""
        tots_destins = set()
        for destins in self.enllacos.values():
            tots_destins.update(destins)
            
        for nom_base in self.arxius.keys():
            # Ignora arxius índex o README
            if nom_base in ['readme', 'index', '00_index']:
                continue
                
            # Comprova si algun enllaç apunta a aquest arxiu
            es_enllacat = False
            for desti in tots_destins:
                if nom_base in desti or desti in nom_base:
                    es_enllacat = True
                    break
                    
            if not es_enllacat:
                self.nodes_orfes.append(nom_base)
                
    def detectar_contradiccio_48_vs_44(self):
        """Contradicció 1: 48px vs 44px en àrees tàctils."""
        patrons_48 = []
        patrons_44 = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read()
                
            if re.search(r'\b48\s*[x×]\s*48\b', contingut):
                patrons_48.append(nom_base)
            if re.search(r'\b44\s*[x×]\s*44\b', contingut):
                patrons_44.append(nom_base)
                
        if patrons_48 and patrons_44:
            self.contradiccions.append({
                'tipus': 'PARADOXA DITS DE LLaurador (48px vs 44px)',
                'severitat': 'CRÍTICA',
                'descripcio': 'Conflicte entre àrees tàctils mínimes',
                'arxius_48px': patrons_48,
                'arxius_44px': patrons_44,
                'solucio': 'Unificar a 48x48px (Manament VIII) i actualitzar SKILL a11y-trellat'
            })
            
    def detectar_contradiccio_28px(self):
        """Contradicció 2: 28px usat per a radi i text."""
        usos_28px = defaultdict(list)
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                linies = f.readlines()
                
            for i, linia in enumerate(linies, 1):
                if '28px' in linia or '28 px' in linia:
                    context = linia.strip().lower()
                    if 'radi' in context or 'radius' in context or 'corner' in context:
                        usos_28px['radi'].append((nom_base, i))
                    elif 'text' in context or 'lletra' in context or 'font' in context:
                        usos_28px['text'].append((nom_base, i))
                    else:
                        usos_28px['altre'].append((nom_base, i))
                        
        if 'radi' in usos_28px and 'text' in usos_28px:
            self.contradiccions.append({
                'tipus': 'COINCIDÈNCIA PERILLOSA DEL 28px',
                'severitat': 'CRÍTICA',
                'descripcio': 'Mateix valor (28px) usat per a radi de cantonades i mida de text',
                'usos_radi': usos_28px['radi'],
                'usos_text': usos_28px['text'],
                'solucio': 'Separar tokens: --sp-radius-main: 1.75rem (28px) vs --sp-text-large: 1.75rem. Documentar clarament.'
            })
            
    def detectar_crim_the(self):
        """Contradicció 3: Ús de 'the' en texts valencians."""
        arxius_amb_the = []
        patro_the = re.compile(r'\bthe\b', re.IGNORECASE)
        
        for nom_base, ruta in self.arxius.items():
            # Ignora arxius de codi o configuració
            if nom_base in ['package', 'config', 'readme']:
                continue
                
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read()
                
            troballes = patro_the.findall(contingut)
            if troballes:
                arxius_amb_the.append({
                    'arxiu': nom_base,
                    'comptador': len(troballes)
                })
                
        if arxius_amb_the:
            self.contradiccions.append({
                'tipus': 'CRIM DEL "THE" I FALS VALENCIÀ',
                'severitat': 'ALTA',
                'descripcio': 'Prohibim l\'article anglés però el Genotip en conté',
                'arxius_afectats': arxius_amb_the,
                'solucio': 'Revisar cada arxiu i substituir "the" per equivalents valencians o eliminar-lo. Exemples: "The Wait Paradigm" → "Paradigma de l\'Espera"'
            })
            
    def detectar_contradiccio_idb_vs_pouchdb(self):
        """Contradicció 4: idb-keyval vs PouchDB."""
        arxius_idb = []
        arxius_pouchdb = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if 'idb-keyval' in contingut or 'idb keyval' in contingut:
                arxius_idb.append(nom_base)
            if 'pouchdb' in contingut:
                arxius_pouchdb.append(nom_base)
                
        if arxius_idb and arxius_pouchdb:
            self.contradiccions.append({
                'tipus': 'ELEFANT A L\'HORTA (idb-keyval vs PouchDB)',
                'severitat': 'CRÍTICA',
                'descripcio': 'Dos sistemes de dades diferents claimen ser la base',
                'arxius_idb_keyval': arxius_idb,
                'arxius_pouchdb': arxius_pouchdb,
                'solucio': 'Trieu UN sistema. Recomanació: Yjs (CRDT natiu) per a sincronització P2P. Esborreu referències a PouchDB i idb-keyval.'
            })
            
    def detectar_contradiccio_tailwind(self):
        """Contradicció 5: Tailwind obligatori vs CSS primer."""
        arxius_tailwind_obligatori = []
        arxius_css_primer = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if 'tailwind' in contingut:
                if 'obligatori' in contingut or 'benvingut i obligatori' in contingut:
                    arxius_tailwind_obligatori.append(nom_base)
                if 'css abans que tailwind' in contingut or 'css primer' in contingut:
                    arxius_css_primer.append(nom_base)
                    
        if arxius_tailwind_obligatori and arxius_css_primer:
            self.contradiccions.append({
                'tipus': 'TAILWIND: ENEMIC O OBLIGATORI?',
                'severitat': 'ALTA',
                'descripcio': 'Conflicte sobre el rol de Tailwind',
                'arxius_tailwind_obligatori': arxius_tailwind_obligatori,
                'arxius_css_primer': arxius_css_primer,
                'solucio': 'Jerarquia clara: CSS pur per a Pell (colors, radis, ombres), Tailwind per a Ossos (estructura, espaiats). Canviar "obligatori" a "recomanat".'
            })
            
    def detectar_contradiccio_master_bypass(self):
        """Contradicció 6: Master Bypass sense protocol."""
        arxius_master_bypass = []
        arxius_amb_protocol = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if 'master bypass' in contingut:
                arxius_master_bypass.append(nom_base)
                if 'protocol' in contingut or 'expiració' in contingut or 'aprovació' in contingut:
                    arxius_amb_protocol.append(nom_base)
                    
        if arxius_master_bypass and len(arxius_amb_protocol) < len(arxius_master_bypass):
            self.contradiccions.append({
                'tipus': 'AMÍGDALA INAMOVIBLE VS MASTER BYPASS',
                'severitat': 'ALTA',
                'descripcio': 'Master Bypass existeix però no té protocol estricte',
                'arxius_amb_master_bypass': arxius_master_bypass,
                'arxius_amb_protocol': arxius_amb_protocol,
                'solucio': 'Crear "Protocol Estricte de Master Bypass" amb: 1) Justificació obligatòria, 2) Expiració a 7 dies, 3) Aprovació dual (Mestre + IA)'
            })
            
    def detectar_contradiccio_a10(self):
        """Contradicció 7: A10 vs flexibilitat."""
        arxius_a10_estricte = []
        arxius_a10_flexible = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if 'a10' in contingut or 'ipad 2016' in contingut or 'ipad 2018' in contingut:
                if 'tolerància zero' in contingut or '60fps' in contingut or 'obligatori' in contingut:
                    arxius_a10_estricte.append(nom_base)
                if 'flexibilitat' in contingut or 'elevar requisits' in contingut or 'permet' in contingut:
                    arxius_a10_flexible.append(nom_base)
                    
        if arxius_a10_estricte and arxius_a10_flexible:
            self.contradiccions.append({
                'tipus': 'LEI MARCIAL DE L\'A10 VS FLEXIBILITAT',
                'severitat': 'MITJANA',
                'descripcio': 'Conflicte entre suport estricte A10 i permís per elevar requisits',
                'arxius_a10_estricte': arxius_a10_estricte,
                'arxius_a10_flexible': arxius_a10_flexible,
                'solucio': 'Definir llindar objectiu: "Suport A10 com a objectiu, però si una feature requereix >3GB RAM o WebGL 2.0, elevar a iPad 2020 (A12). Documentar a excepcions.md"'
            })
            
    def detectar_contradiccio_amnesia(self):
        """Contradicció 8: Amnèsia vs memòria viva."""
        arxius_amnesia = []
        arxius_memoria_viva = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if 'prohibit' in contingut and ('llegir' in contingut or 'transcripcions' in contingut):
                arxius_amnesia.append(nom_base)
            if 'obligatori' in contingut and 'conversa d\'ahir' in contingut:
                arxius_memoria_viva.append(nom_base)
                
        if arxius_amnesia and arxius_memoria_viva:
            self.contradiccions.append({
                'tipus': 'AMNÈSIA VS MEMÒRIA VIVA',
                'severitat': 'MITJANA',
                'descripcio': 'Prohibit llegir transcripcions velles vs obligatori llegir conversa d\'ahir',
                'arxius_amnesia': arxius_amnesia,
                'arxius_memoria_viva': arxius_memoria_viva,
                'solucio': 'Protocol clar: 1) Prohibit llegir >7 dies (excepte Acta Marmota), 2) Obligatori llegir conversa d\'ahir, 3) Excepció: si Mestre demana explícitament, llegir fins a 30 dies'
            })
            
    def detectar_contradiccio_carpetes_ocultes(self):
        """Contradicció 9: Carpetes ocultes vs transparència."""
        arxius_amb_ocult = []
        arxius_amb_transparencia = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if '.gemini' in contingut or 'carpeta oculta' in contingut:
                arxius_amb_ocult.append(nom_base)
            if 'transparència' in contingut or 'visible' in contingut or 'humà pot editar' in contingut:
                arxius_amb_transparencia.append(nom_base)
                
        if arxius_amb_ocult and arxius_amb_transparencia:
            self.contradiccions.append({
                'tipus': 'MEMÒRIA OCULTA (.gemini vs _wiki_de_poble)',
                'severitat': 'CRÍTICA',
                'descripcio': 'Defenguem transparència però guardem memòria en carpetes ocultes',
                'arxius_amb_carpetes_ocultes': arxius_amb_ocult,
                'arxius_amb_transparencia': arxius_amb_transparencia,
                'solucio': 'Migrar tot el contingut de .gemini/ a _wiki_de_poble/05_memoria_ia/. La IA ha de tindre accés complet a la seua pròpia memòria.'
            })
            
    def detectar_contradiccio_pedra_seca(self):
        """Contradicció 10: Pedra Seca (cairada) vs radis 28px (rodó)."""
        arxius_pedra_seca = []
        arxius_amb_radis = []
        
        for nom_base, ruta in self.arxius.items():
            with open(ruta, 'r', encoding='utf-8') as f:
                contingut = f.read().lower()
                
            if 'pedra seca' in contingut:
                arxius_pedra_seca.append(nom_base)
            if '28px' in contingut and ('radi' in contingut or 'radius' in contingut or 'corba' in contingut):
                arxius_amb_radis.append(nom_base)
                
        if arxius_pedra_seca and arxius_amb_radis:
            self.contradiccions.append({
                'tipus': 'ESTÈTICA PEDRA SECA (CAIRADA) VS RADI OLI SUAU (RODÓ)',
                'severitat': 'BAIXA',
                'descripcio': 'Sistema batejat "Pedra Seca" però usa radis de 28px',
                'arxius_pedra_seca': arxius_pedra_seca,
                'arxius_amb_radis_28px': arxius_amb_radis,
                'solucio': 'Aclariment filosòfic: "Pedra Seca" es refereix a l\'arquitectura (solidesa, zero dependències), no a la geometria visual. Els radis 28px són part del sistema "Oli Suau" per a UX amable. Documentar-ho clarament.'
            })
            
    def generar_informe(self):
        """Genera l'informe complet en Markdown."""
        informe = []
        informe.append("# 🚨 INFORME DEL COMPILADOR DE COHERÈNCIA")
        informe.append(f"**Data:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        informe.append(f"**Wiki analitzada:** `{self.wiki_path}`")
        informe.append("")
        
        # Resum executiu
        informe.append("## 📊 RESUM EXECUTIU")
        informe.append(f"- **Total arxius:** {len(self.arxius)}")
        informe.append(f"- **Enllaços trobats:** {sum(len(v) for v in self.enllacos.values())}")
        informe.append(f"- **Enllaços trencats:** {len(self.enllacos_trencats)}")
        informe.append(f"- **Nodes orfes:** {len(self.nodes_orfes)}")
        informe.append(f"- **Contradiccions detectades:** {len(self.contradiccions)}")
        informe.append("")
        
        # Enllaços trencats
        if self.enllacos_trencats:
            informe.append("## 🔗 ENLLAÇOS TRENCTS")
            for enllac in self.enllacos_trencats[:20]:  # Limita a 20 per no saturar
                informe.append(f"- **{enllac['desti']}** (des de `{enllac['origen']}`)")
            if len(self.enllacos_trencats) > 20:
                informe.append(f"- ... i {len(self.enllacos_trencats) - 20} més")
            informe.append("")
            
        # Nodes orfes
        if self.nodes_orfes:
            informe.append("## 🏝️ NODES ORFES (Arxius sense enllaços entrants)")
            for node in self.nodes_orfes[:20]:
                informe.append(f"- `{node}`")
            if len(self.nodes_orfes) > 20:
                informe.append(f"- ... i {len(self.nodes_orfes) - 20} més")
            informe.append("")
            
        # Contradiccions
        if self.contradiccions:
            informe.append("## ⚔️ CONTRADICCIONS DETECTADES")
            for i, contr in enumerate(self.contradiccions, 1):
                informe.append(f"### {i}. {contr['tipus']}")
                informe.append(f"**Severitat:** {contr['severitat']}")
                informe.append(f"**Descripció:** {contr['descripcio']}")
                informe.append("")
                
                # Detalls específics per cada tipus
                if 'arxius_48px' in contr:
                    informe.append(f"- Arxius amb 48x48px: {', '.join(contr['arxius_48px'])}")
                    informe.append(f"- Arxius amb 44x44px: {', '.join(contr['arxius_44px'])}")
                if 'usos_radi' in contr:
                    informe.append(f"- Usos com a radi: {len(contr['usos_radi'])} ocurrències")
                    informe.append(f"- Usos com a text: {len(contr['usos_text'])} ocurrències")
                if 'arxius_afectats' in contr:
                    for arx in contr['arxius_afectats'][:10]:
                        informe.append(f"- `{arx['arxiu']}` ({arx['comptador']} ocurrències)")
                if 'arxius_idb_keyval' in contr:
                    informe.append(f"- Arxius amb idb-keyval: {', '.join(contr['arxius_idb_keyval'])}")
                    informe.append(f"- Arxius amb PouchDB: {', '.join(contr['arxius_pouchdb'])}")
                if 'arxius_tailwind_obligatori' in contr:
                    informe.append(f"- Arxius amb Tailwind obligatori: {', '.join(contr['arxius_tailwind_obligatori'])}")
                    informe.append(f"- Arxius amb CSS primer: {', '.join(contr['arxius_css_primer'])}")
                if 'arxius_amb_master_bypass' in contr:
                    informe.append(f"- Arxius amb Master Bypass: {', '.join(contr['arxius_amb_master_bypass'])}")
                    informe.append(f"- Arxius amb protocol: {', '.join(contr['arxius_amb_protocol'])}")
                if 'arxius_a10_estricte' in contr:
                    informe.append(f"- Arxius amb A10 estricte: {', '.join(contr['arxius_a10_estricte'])}")
                    informe.append(f"- Arxius amb flexibilitat: {', '.join(contr['arxius_a10_flexible'])}")
                if 'arxius_amnesia' in contr:
                    informe.append(f"- Arxius amb amnèsia: {', '.join(contr['arxius_amnesia'])}")
                    informe.append(f"- Arxius amb memòria viva: {', '.join(contr['arxius_memoria_viva'])}")
                if 'arxius_amb_carpetes_ocultes' in contr:
                    informe.append(f"- Arxius amb carpetes ocultes: {', '.join(contr['arxius_amb_carpetes_ocultes'])}")
                    informe.append(f"- Arxius amb transparència: {', '.join(contr['arxius_amb_transparencia'])}")
                if 'arxius_pedra_seca' in contr:
                    informe.append(f"- Arxius amb Pedra Seca: {', '.join(contr['arxius_pedra_seca'])}")
                    informe.append(f"- Arxius amb radis 28px: {', '.join(contr['arxius_amb_radis_28px'])}")
                    
                informe.append(f"**Solució proposada:** {contr['solucio']}")
                informe.append("")
                
        # Recomanacions finals
        informe.append("## 🎯 RECOMANACIONS FINALS")
        informe.append("### Prioritat 1 (Crític - Fer avui)")
        informe.append("1. Resoldre la paradoxa 48px vs 44px")
        informe.append("2. Separar els usos del 28px (radi vs text)")
        informe.append("3. Eliminar totes les referències a PouchDB")
        informe.append("4. Migrar .gemini/ a _wiki_de_poble/")
        informe.append("")
        informe.append("### Prioritat 2 (Important - Fer aquesta setmana)")
        informe.append("5. Crear el Protocol de Master Bypass")
        informe.append("6. Unificar la terminologia de Tailwind")
        informe.append("7. Definir el protocol de memòria (amnèsia vs memòria viva)")
        informe.append("8. Corregir tots els 'the' en texts valencians")
        informe.append("")
        informe.append("### Prioritat 3 (Millora - Fer aquest mes)")
        informe.append("9. Documentar la relació Pedra Seca vs radis 28px")
        informe.append("10. Definir llindar objectiu per a flexibilitat A10")
        informe.append("11. Crear índex mestre per a nodes orfes")
        informe.append("")
        
        return '\n'.join(informe)
        
    def executar(self):
        """Executa totes les validacions i genera l'informe."""
        self.escanejar_arxius()
        self.extreure_enllacos()
        self.validar_enllacos()
        self.detectar_nodes_orfes()
        
        # Detecta totes les contradiccions
        self.detectar_contradiccio_48_vs_44()
        self.detectar_contradiccio_28px()
        self.detectar_crim_the()
        self.detectar_contradiccio_idb_vs_pouchdb()
        self.detectar_contradiccio_tailwind()
        self.detectar_contradiccio_master_bypass()
        self.detectar_contradiccio_a10()
        self.detectar_contradiccio_amnesia()
        self.detectar_contradiccio_carpetes_ocultes()
        self.detectar_contradiccio_pedra_seca()
        
        return self.generar_informe()


def main():
    if len(sys.argv) < 2:
        print("Ús: python3 compilador_coherencia.py [ruta_a_wiki]")
        print("Exemple: python3 compilador_coherencia.py _wiki_de_poble/")
        sys.exit(1)
        
    wiki_path = sys.argv[1]
    
    if not os.path.exists(wiki_path):
        print(f"❌ Error: La ruta '{wiki_path}' no existeix")
        sys.exit(1)
        
    compilador = CompiladorCoherencia(wiki_path)
    informe = compilador.executar()
    
    # Guarda l'informe
    nom_informe = f"informe_coherencia_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    with open(nom_informe, 'w', encoding='utf-8') as f:
        f.write(informe)
        
    print(f"\n✅ Informe generat: {nom_informe}")
    print(f"📊 Total contradiccions: {len(compilador.contradiccions)}")
    print(f"🔗 Enllaços trencats: {len(compilador.enllacos_trencats)}")
    print(f"🏝️ Nodes orfes: {len(compilador.nodes_orfes)}")


if __name__ == "__main__":
    main()
