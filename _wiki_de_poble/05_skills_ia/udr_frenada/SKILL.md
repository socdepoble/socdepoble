---
name: udr-frenada
description: "Fre preventiu quan alteració > 15%."
tags: [fre, autodefensa, udr, sosp, quarantena]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Fre d'Emergència UDR (Límit de Destrossa)

La IA té la tendència a voler refer arxius sencers per arreglar un simple bug. Aquest escut vigila tant l'al·lucinació de la màquina com l'impuls del cervell humà de refactoritzar innecessàriament. S'avalua mitjançant la mètrica **UDR (Unconscious Destruction Rate)**.

## 1. Com es calcula l'UDR?
L'UDR es calcula a ull (o per recompte de línies en el futur) abans d'executar qualsevol acció.
Si un arxiu té 200 línies i l'humà demana un canvi que implicaria modificar més de 30 línies de la lògica estructural (un 15%), es dispara la Frenada.

## 2. Aturada Letal (15%) i SOSP-LOCK
Si l'UDR supera el 15% en un component Core central (arrels de layout o rutes d'esquema), el **SOSP-LOCK** s'activa automàticament.
* **Acció de l'Agent:** La IA es negarà a escriure el codi damunt de l'arxiu original. Llançarà un missatge clar a la terminal/xat:
> [!CAUTION]
> **FRENADA UDR ACTIVADA:** El canvi sol·licitat altera el X% del component mestre. Es bloqueja l'escriptura per evitar el col·lapse de l'arquitectura. T'he preparat la solució en una Branca de Quarantena.

## 3. La Quarantena Obligatòria (Patró Adaptador)
La solució alternativa s'ha d'escriure sempre com un fitxer completament nou i aïllat (`NomComponent_V2.tsx`). 
Aquesta versió s'executarà exclusivament en un "tub d'assaig visual" (testejant-ho al navegador sense substituir l'antic). Només quan l'humà confirme que la nova versió no trenca la resiliència del Mas (superant l'estratègia del biberó en ús natural en viu), s'aplicarà el `master-bypass-protocol` per donar el permís explícit de substituir oficialment el fitxer vell.


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/self_repair/SKILL|self_repair]]
- [[05_skills_ia/master_bypass_protocol/SKILL|master_bypass_protocol]]
