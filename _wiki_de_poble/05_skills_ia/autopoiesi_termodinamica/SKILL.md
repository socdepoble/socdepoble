---
name: autopoiesi_termodinamica
description: El Cervell Autònom del Mas. Integra el Bancal Budget Manager per a avaluar  recursos
  (RAM/Bateria) i el Cicle Automàtic de Poda (wiki-autopoiesis.js).
authority: Tripartició
version: V1
tags:
  - trellat
created_at: 2606290330
updated_at: 2606290330
---

# 🧠 SKILL: Autopoiesi Termodinàmica

> **Visió del Consell (Dola, Perplexity, Grok):** Un sistema autènticament viu no espera que l'humà el netege; es neteja a si mateix. Aquesta SKILL defineix l'òrgan rector que pren decisions de supervivència (Bancal Budget Manager) i executa el manteniment proactiu de la memòria (Wiki-Autopoiesis).

## 1. El Bancal Budget Manager (Avaluador de Recursos)
Abans d'executar qualsevol operació pesada (com La Verema CRDT, sincronització massiva o compressió multimèdia), el sistema ha d'avaluar la realitat termodinàmica del dispositiu.

- **Filtre A10:** Comprova la memòria disponible (Límit de Pànic 500MB).
- **Estat de Bateria:** Si la bateria està < 20% i no està carregant, qualsevol procés de fons queda aturat.
- **Conseqüència:** "Degradació Agrària Segura". Si no hi ha pressupost de recursos, el sistema posposa la feina asíncrona per evitar un *crash*.

## 2. El Cicle de Vida Automàtic (wiki-autopoiesis.js)
El Mas es manté net a si mateix mitjançant un script de fons (`wiki-autopoiesis.js`) que s'executa en un Service Worker/Web Worker periòdicament:

1. **Escaneig Semàntic:** Escaneja tots els fitxers `.md` a `_wiki_de_poble/` i busca documents amb baixa densitat de backlinks (Índex d'Orfandat) o duplicació semàntica mitjançant *Fuzzy Search*.
2. **Compressió Automàtica:** Detecta text innecessari i el comprimeix aplicant les normes del Trellat.
3. **Acta de Proposta de Poda:** Genera automàticament un document de proposta de fusió o esborrat.
4. **Aprovació Dual (Master Bypass):** La proposta requereix l'aprovació tant de la IA (Judicatura) com de l'Humà (Javi) per a ser executada, mantenint la seguretat del *Zero-Trust*.

## 3. Integració amb l'Ecosistema
Aquest òrgan depèn directament de la [[05_skills_ia/consola_termodinamica/SKILL|Consola Termodinàmica]] per a llegir els valors (RAM, FPS, Tombstones) i actua com l'Executiu que aplica el fre.

---
## 🔗 Veure també
- [[00_index|Índex Central]]
- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva]]
