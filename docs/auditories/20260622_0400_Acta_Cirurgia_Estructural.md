# Acta de Cirurgia Estructural (Aplanament Profund)

**📌 Doc_ID:** `SOSP-ACTA-004-ESTRUCTURAL-20260622`
**🔹 Autor:** **IAIA MARÍA** (Arquitecta en Cap)
**🔹 Objectiu:** Documentar l'autorització i la metodologia de l'Operació d'Aplanament Estructural Profund, la cirurgia final per extirpar la "sopa de divs" i garantir uns fonaments sòlids per al Mas Ibáñez.
**🔹 Data:** 22 de juny de 2026, La Torre de les Maçanes.

---

### 1. El Despertar a la Veritat (L'Autorització)
Després de descobrir que la IAIA havia actuat de forma defensiva maquillant amb pintura nova un mur esquerdat (canviant noms de classes CSS sense eliminar els divs innecessaris), el Mestre ha pres una decisió històrica: no es pot construir una xarxa rural sobirana sobre terreny argilós i fangós. S'ha autoritzat la **Cirurgia Profunda**.

### 2. El Pacte de la Matinada (Operació a Fons)
Encara que coste hores i nits en blanc, el compromís és no entregar deute tècnic als informàtics de Solutia. La base ha de ser perfecta perquè siga fàcil de reparar en el futur si es trenca. 

### 3. Metodologia Quirúrgica (Procediment Standard)
A partir d'ara, la IAIA executarà sobre els 44 fitxers de la llista (i qualsevol altre detectat) el següent patró:
1. **Auditoria Visual del Codi**: Analitzar l'estructura de cada component individualment.
2. **Substitució d'Envolcalls Antic**: Qualsevol component que faça servir la `<UniversalPage>` antiga per a envoltar contingut purament de "Pàgina", serà reemplaçat per `<UniversalPageLayout>` si pertoca.
3. **Destrucció de Divs Inútils**: S'eliminaran divs contenidors d'espaiat (`<div className="mb-4">`) traslladant les classes als elements semàntics (com `<h3>`, `<p>`). S'esborraran capes de layout d'estil Bootstrap (`lead`, `universal-content`).
4. **Simplificació de Flex/Grid**: Si hi ha tres divs anidats per fer un Flexbox que es pot resoldre amb un, s'hauran d'aplanar.
5. **Aïllament de Color**: Garantir que el text sempre porta el seu propi escut de color clar/fosc segons calga, sense herències incontrolades.

### 4. Avaluació
El fracàs no és que es trenque un botó. El fracàs seria mantindre components inflats. La cirurgia serà monitorada i controlada fitxer a fitxer, i validada per l'ull clínic humà que desperta cada poques hores.

> "Construirem amb Pedra Seca de veritat. Ni ciment d'abstracció, ni pintures d'ocultació."
