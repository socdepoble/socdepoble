---
estat: "arxivat"
tipus: "prompt"
description: "[CONSELL DE LA PETORRETA — CONSULTA META-ESTRUCTURAL I WORKFLOW]"
---
# SDP-PETORRETA-047: Consulta Arquitectònica de l'Ecosistema i Migració

**[CONSELL DE LA PETORRETA — CONSULTA META-ESTRUCTURAL I WORKFLOW]**

Membres del Consell, després de consolidar la base de codi (AppShell i UniversalComponents) al nou entorn de `socdepoble.org`, ens trobem davant del repte d'unificar i optimitzar la nostra arquitectura de carpetes i el flux de treball per a la migració final. A més, l'Auditor Qwen acaba de publicar un informe on ens exigeix garantir el rendiment extrem en maquinari antic (iPad A10) i l'accessibilitat inclusiva (WCAG 2.5.8).

Aquesta és la fotografia actual:
1. **El Projecte Antic i la Wiki**: A la carpeta original `Sóc de Poble` resideix la web antiga (que acabarà desapareixent) i l'autèntica `_wiki_de_poble` (Obsidian Vault).
2. **El Projecte Nou (L'Ecosistema Alcoià)**: Nosaltres estem treballant en una ruta paral·lela, `Som de Poble/socdepoble.org`, on hem implementat la nova arquitectura Pedra Seca neta i pura.
3. **El Cervell de la IAIA**: Les meues regles (`.agents`) i els actes efímers es guarden al nou entorn. Els informes i actes de sessió han d'anar a la paperera/escriptori de la Wiki: `05_Escriptori_Soc_de_Poble`.

### EL PLA DE MIGRACIÓ PROPOSAT (L'Estratègia del Clon):
Com que la web vella (`Sóc de Poble`) s'eliminarà en el futur, el Mestre Javi proposa el següent pla d'acció:

1. **Clonar la Wiki**: Fer un `cp -r` (clon exacte) de `_wiki_de_poble` des del projecte antic cap al nostre nou ecosistema (`Som de Poble/socdepoble.org/_wiki_de_poble`). 
2. **Aïllament i Seguretat**: La web antiga i la seua Wiki es queden intactes com a "Museu" de referència. Treballarem exclusivament sobre la nova Wiki clonada al nostre entorn. Quan acabem tot el procés, esborrarem la carpeta antiga sencera.
3. **Migració del Codi (Copy-Paste Quirúrgic)**: Aprofitant que el disseny està desacoblat del contingut, migrarem funcionalitats de la web vella a la nova copiant, netejant el codi i integrant-lo en la nova graella de *UniversalComponents*.

### LES PREGUNTES PER AL CONSELL:
1. **Què us sembla l'estratègia del Clon?** És la solució òptima per a unificar el meu cervell i la Wiki dins d'un mateix ecosistema sense trencar els enllaços històrics ni arriscar el codi *legacy*?
2. **Recomanacions per al flux de treball de migració**: Tenint en compte l'arquitectura de Pedra Seca, quins consells ens doneu per executar el "copy-paste quirúrgic" de les dades i lògica de la web antiga a la nova sense portar-nos brossa o *renders* innecessaris?
3. **Validació d'Accessibilitat i Rendiment (Inspirat per Qwen)**: Qwen ha advertit que hem d'assegurar mides d'objectiu mínimes de 24x24px (WCAG 2.5.8), vigilar l'estat del focus visible per a teclat, i evitar regles costoses per a WebKit (com `backdrop-filter`) per no saturar la memòria de l'iPad A10. Com hauríem d'integrar sistemàticament estes auditories en el nostre workflow de migració de components per a no deixar cap escletxa oberta?
4. Validació de l'ús de `05_Escriptori_Soc_de_Poble` com a única safata d'entrada per a la memòria efímera del sistema (per evitar invencions termodinàmiques fora de lloc).

Doneu-nos el vostre vistiplau o les vostres esmenes arquitectòniques abans de prémer el botó de clonat.