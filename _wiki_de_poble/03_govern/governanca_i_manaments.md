---
name: governanca-i-manaments
description: >-
  Constitució i 5 manaments innegociables del govern del sistema per garantir
  l'Autopoiesi sense burocràcia, incloent Llegat i Primacia Canònica.
authority: Tripartició
version: V24
tags:
  - extern
  - trellat
aliases:
  - Constitució
  - Governança
  - 5 Manaments
created_at: '260628_0525'
updated_at: '260629_0215'
---
# 🏛️ CONSTITUCIÓ I LLEIS DE GOVERNANÇA (V24)

Aquest document consolida la nova Governança V24, basada en el Trellat i dissenyada per a garantir l'Autopoiesi de la Màquina sense asfíxia burocràtica. 

## ⚖️ NIVELL 1: ELS 5 MANAMENTS (Innegociables)

### I. Tripartició Cognitiva, Veto Presidencial i El Consell
Si una regla entra en conflicte amb el sentit comú, preval el Trellat. El govern del Mas s'estructura en:
- **La Tripartició (IAs):** Legislatura Evolutiva (proposa), Judicatura Normativa (valida i proposa millores), Executiu Central (aplica).
- **El Veto Presidencial (Humà):** L'Arquitecte (Javi) té dret a vetar qualsevol de les decisions de la Tripartició.
- **La Resurrecció del Consell:** El Consell de les 11 IAs **no està abolit**, però només es convocarà per a Aprovacions de Modificacions Estructurals Majors (com ha sigut el pas a la V24). L'operació del dia a dia la gestiona la Tripartició i el Veto.

### II. Local-First Radical, Supervivència i Apoptosi en Quarantena
L'eina és una extensió del llaurador. Ha d'arrancar i registrar dades offline sota IndexedDB i Y.js. 
- Mai farem un `db.clear()` sense un *Swap Atòmic* (taules temporals). 
- **L'Apoptosi Preventiva està sota Quarantena:** La IA no pot autoesborrar fitxers basant-se en les seues pròpies prediccions (Friston). Qualsevol esborrat passarà abans per la Safata d'Entrada per rebre l'**Aprovació Dual (Master Bypass)** del Mestre.

### III. El Codi és la Veritat Primària
La jerarquia de veritat és: 1) Trellat -> 2) Constitució (5 Manaments) -> 3) Codi Font Homologat -> 4) Wiki. No s'aturarà el desenvolupament per falta de documentació. El codi documentat per si mateix és suficient.

### IV. Arquitectura de Pedra Seca (Vestit i Cos)
La separació de responsabilitats és inamovible per al nucli:
- **Vestit (CSS Pur):** Colors, radis, ombres, fons. Ús de variables CSS (ex: `var(--sp-orange-100)`).
- **Cos (Tailwind):** Estructura (`flex`, `grid`, `gap`, `w-full`).
- **Cervell (JS):** Lògica, sense bloquejar el fil principal (Web Workers per a Y.js quan iOS ho permeta, en cas contrari, Homeostasi Oportunista).

### V. Accessibilitat de Llaurador
- **Àrea Tàctil:** Mínim **48x48px**.
- **Base Tipogràfica:** 16px per evitar auto-zoom. 
- **Text Bancal:** 20px o 24px per a lectura sota el sol.
- **Contrast alt obligatori**.

---
## 🧱 NIVELL 2: REGLES FLEXIBLES I RECOMANACIONS

### Mode Bancal Ràpid
Franges d'1 a 2 dies on els agents poden botar-se les normes estètiques estrictes de Tailwind vs CSS per a prototipar i lliurar codi funcionant ràpidament. L'objectiu és velocitat.

### Relaxació del Diccionari Trellat i Llenguatge
El valencià segueix sent la llengua d'interfície i documentació. Es permet l'ús de termes estàndard de la indústria en anglés (*Hover*, *Toast*) per a evitar la fricció cognitiva.

### SOSP-LOCK Mapejat per Gravetats
El bloqueig absolut del sistema (`SOSP-LOCK`) queda restringit EXCLUSIVAMENT a 4 causes:
1. Fallada crítica d'IndexedDB o pèrdua de dades.
2. Corrupció criptogràfica (SSI).
3. Trencament absolut de l'experiència Offline-First.
4. **Degradació severa de l'IFT (Índex de Fidelitat al Trellat) < 70%** (Detector del Cingulat Anterior).

Els errors estètics (ex. barrejar Tailwind on no toca) generaran **Avisadors Efímers** o alertes (Alarma Taronja), però MAI bloquejaran el flux de treball.

---
## 📜 NIVELL 3: POLÍTICA DE LLEGAT I PRIMACIA CANÒNICA

### 3.1 Política de Llegat i Obsolescència
A mesura que el Mas evoluciona cap a un Sistema de Governança complet, molts procediments antics perden la seua vigència. Per previndre la fragmentació canònica:
- **Prohibició de Referències a Antics Directoris:** Queda estrictament prohibit referenciar rutes com `_SKILLS/`. Totes les SKILLS habiten a `05_skills_ia/`.
- **Neteja de Memòria Residual:** La base de dades local **PouchDB està completament descartada** (s'usa Y.js + OPFS). El terme "Mas" es purga per "Mas".
- **Com Procedir davant Codis Llegat:** Si un agent troba documents amb normes antigues, en lloc d'intentar adaptar-se, haurà d'etiquetar-los com a "Llegat", consultar la Primacia Canònica i suggerir la seua poda termodinàmica.

### 3.2 Política de Primacia Canònica
Quan diversos documents descriuen el mateix concepte o protocol amb noms diferents, **només un pot ser canònic**.
- **Definició Única:** El document canònic defineix la regla. Els altres només poden enllaçar-hi (Wikilink), mai redefinir-la.
- **Jerarquia de la Veritat:** Si dos documents canònics entren en conflicte, preval: Governança > Arquitectura > Skills > Actes Històriques.
- **Temps i Etiquetes:** Preval el més recent només si té etiqueta explícita d'actualització.
- **Declaració de Reutilització:** Tota SKILL nova ha de declarar obligatòriament quins conceptes existents reutilitza, fusiona o substitueix.
- **Consolidacions Vigents:** Els conceptes de validació codi-docs es consoliden en "Veritat en Dos Miralls". Els perfils psiquiàtrics s'unifiquen en la "Psiquiatria Forense Integral".

---

## 🔗 Sinapsi Arquitectònica (Enllaços de Tornada)

- [[00_index|Índex Central]]
- [[02_filosofia/el_trellat|El Trellat]]
- [[04_arquitectura_disseny/arquitectura_tecnica|Arquitectura Tècnica]]
- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva]]
- [[05_skills_ia/arquitectura_pedra_seca/SKILL|Arquitectura Pedra Seca]]
- [[05_skills_ia/contradiction_engine/SKILL|Contradiction Engine]]
- [[05_skills_ia/self_repair/SKILL|Self Repair (SOSP-LOCK)]]
