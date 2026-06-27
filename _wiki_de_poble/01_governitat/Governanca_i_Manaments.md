---
tags: [constitucio, manaments, normes, pedra-seca, fsd, governanca]
aliases: [Constitució, Governanca, 10 Manaments]
---
# 🏛️ CONSTITUCIÓ I LLEIS DE GOVERNANÇA (V22)

Aquest document consolida l'antiga Governança i els 10 Manaments. Tota decisió present o futura queda sotmesa innegociablement a aquesta estructura piramidal. Davant un xoc o contradicció de normes, el nivell superior fulmina sempre l'inferior.

## ⚖️ NIVELL 1: PRINCIPIS SUPREMS (Intocables)

### I. El [[El_Trellat|Trellat]] és la llei suprema
Si una regla entra en conflicte amb el sentit comú, preval el Trellat.

### II. Local-First Radical i Supervivència
L'eina és una extensió del llaurador. Ha d'arrancar i registrar dades offline. La càrrega de dades depèn del wrapper lleuger `idb-keyval` (IndexedDB) i de la xarxa distribuïda CRDT (Y.js). *L'ús de bases pesades o velles com PouchDB queda tècnicament desterrat i proscrit.*

### III. El contingut és primer
La informació sempre és més important que la decoració.

### IV. Transparència absoluta
Tot canvi crític ha de ser registrat i auditable. No hi ha carpetes ocultes (tipus veies com `.gemini`). Tota memòria viva resideix a `_wiki_de_poble/05_memoria_ia/`.

---
## 🧱 NIVELL 2: REGLES ARQUITECTÒNIQUES (L'Estructura)

### V. HTML abans que CSS (La Persona i el Vestit)
La semàntica correcta té prioritat sobre qualsevol estil visual. Mai modificaràs l'estructura semàntica per arreglar estils. L'esquelet és pur, el vestit és autònom.

### VI. Tailwind per a Ossos, CSS per a Pell (Jerarquia Definitiva)
La separació de responsabilitats és inamovible:
1. **Pell (CSS Pur):** Colors (`--sp-orange-100`), radis (`--sp-radius-main`), ombres, fons. Prohibit Tailwind per a pell. (Vigilat per `tailwind-guard/SKILL.md`).
2. **Ossos (Tailwind):** Estructura (`flex`, `grid`, `gap`, `w-full`).
3. **Cervell (JavaScript):** Lògica, interactivitat, sincronització CRDT (Zero jQuery).
Barrejar responsabilitats a la mateixa línia de codi comporta l'esborrat immediat.

### VII. Variables abans que valors (Codi Penal Estricte)
Mai s'escriuran colors, radis tipogràfics o espais de manera numèrica quan existisca un token oficial definit. Queda **ESTRICTAMENT PROHIBIT** l'ús de nombres i valors fixos com `#FF7300`, `28px` o `48px` solts pels fitxers `.tsx`. Tots els valors provenen de `design-tokens.json`.

### VIII. Accessibilitat de Llaurador (Mode Bancal) — Versió Unificada V22
- **Àrea Tàctil:** Mínim **48x48px** (escalable a 56px). Totes les referències a 44px queden absolutament derogades.
- **Base Tipogràfica:** 16px per evitar auto-zoom. `--sp-radius-main` (28px) només per a corbes, mai per a text.
- **Text Bancal:** `--sp-text-lg` (20px) o `--sp-text-xl` (24px) per a lectura sota el sol.
- **Contrast:** Taronja → NEGRE; Blau → BLANC.

### IX. Mort del Fantasma (`<hr>`)
L'etiqueta `<hr>` (i el `---` de Markdown intern de contingut) està totalment proscrita per defecte a la UI genèrica. Tota separació visual naixerà exclusivament de la jerarquia d'encapçalaments (H1 a H6).

### X. Components abans que pàgines i Autonomia (El Mas ha de resistir sola)
Cada component ha de poder existir de manera independent sense dependències ocultes. Cap pantalla inventarà estils nous si poden heretar-se dels components universals.

---
## 🚨 NIVELL 3: EXCEPCIONS OPERATIVES (El Master Bypass)

### XI. Protocol Estricte de Master Bypass
Les línies roges tècniques són inviolables, però el Trellat mana davant l'ofec. S'admet un salt amb `Master Bypass` només si compleix els següents deures:
1. **Aprovació Dual:** L'humà imposa la urgència; la màquina certifica en silenci que el pegat no arrancarà la viabilitat *Offline-First* letalment.
2. **Caducitat Termodinàmica (7 dies):** És un préstec tòxic d'una setmana. Si en set dies biològics el Mestre no ha refactoritzat i adobat el deute de forma neta per a complir la llei nativa, el codi es considerarà necròtic, i el sistema aturarà futures addicions de funcionament per a auto-protegir-se (SOSP-LOCK).

### XI bis. Relació SOSP-LOCK ↔ Master Bypass (Protocol de Duel)
Quan una IA detecta una violació de l'arquitectura:
1. **Aplicar SOSP-LOCK immediat:** Aturar l'execució.
2. **Valorar Master Bypass:** Si l'humà insisteix, l'IA pot **proposar** un Master Bypass amb data de caducitat i pla de reversió.
3. **Decisió:** L'humà aprova → s'executa el bypass. L'humà no aprova → es manté el SOSP-LOCK.

---
## 🗣️ NIVELL 4: IDENTITAT LINGÜÍSTICA

### XII. Puresa Lingüística i Diccionari Canònic
La comunicació amb humans i la documentació interna ha de ser **ESTRICTAMENT en valencià**. Tota terminologia es regix per `[[Diccionari Trellat]]`. 
- **PROHIBIT** "the", anglicismes superflus i valors hardcodejats. 
- **Excepció Tècnica Forçada**: Noms propis de protocols, llibreries o estàndards (ex: WebRTC, CRDT, IndexedDB, HTML, WASM) es mantenen en anglés perquè són la seua identitat tècnica. No traduïm "HTML" a "LLM".
