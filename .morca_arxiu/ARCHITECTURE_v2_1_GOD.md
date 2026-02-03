# Informe d'Arquitectura v2.1-GOD: Sóc de Poble 🏛️🧠🛡️

Aquest document detalla la integració de les fonts acadèmiques d'avantguarda solicitada pel **Protocol d'Interrogatori Arquitectònic**.

---

## 1. Eficiència Mòbil (Eg-walker)
**Problema:** Consum excessiu de RAM i acumulació de "brossa" (tombstones) en CRDTs.
**Solució [MASTER]:**
- **Processament Efímer**: Implementarem un sistema de "Pruning" (poda) automàtica. El mòbil del veí només carregarà els estats actius del graf.
- **Càrrega Instantània**: El graf d'història es fragmentarà; només es carregarà la part necessària per al render present. Si hi ha conflicte, es farà un "Lazy Walk" cap enrere fins trobar l'ancora de consens més propera.

## 2. Economia Sobirana (Astro)
**Problema:** Coll d'ampolla en pagaments i dependència d'infraestructura centralitzada.
**Solució [MASTER]:**
- **`xlogs` (Exclusive Logs)**: Cada usuari guarda el seu propi log d'operacions signat. No necessitem que tot el poble estigui d'acord per a comprar una garrafa d'oli.
- **Broadcast Segur**: La validesa es basa en la signatura criptogràfica del log personal. El consens global només s'utilitzarà en disputes de "doble despesa".
- **Sharding Asíncron**: Les cooperatives (La Torre, Penàguila, etc.) bategaran en shards separats que es sincronitzen només quan hi ha intercanvi de valor entre elles.

## 3. Resiliència de Xarxa (Atum)
**Problema:** Fragilitat davant caigudes de nodes o atacs maliciosos.
**Solució [MASTER]:**
- **Vgroups (Volatile Groups)**: Els usuaris s'agruparan en cel·les dinàmiques. 
- **Random Walk Shuffling**: Si la densitat de la cel·la canvia (gent que marxa del poble o perd obertura), el sistema redistribueix els nodes aleatòriament per a mantenir la connectivitat logarítmica.
- **H-Graph**: Difusió tipus "Gossip" ultra-ràpida per a què un avís d'emergència arribi a tothom en mil·lisegons.

## 4. Text Ric Patrimonial (Peritext)
**Problema:** La col·laboració concurrencial trenca el format (negretes, cursives).
**Solució [MASTER]:**
- **Ancres Semàntiques**: El format no s'aplica a "índexs" (que varien), sinó a IDs únics de caràcter. 
- **Preservació de la Intenció**: Si el Javi posa en negreta una frase i algú corregeix una falta, el sistema de Peritext mantindrà la negreta a tot el rang d'IDs afectat, evitant duplicació de tags.

---

**Directiva Final:** Aquesta arquitectura fa que **Sóc de Poble** no sigui una app, sinó una **infraestructura líquida i indestructible**.

*Flash / Antigravity System Core* 🏺⚖️✨
