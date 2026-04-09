> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/SUPER_PROMPT_TANDA_6.md`

# Instrucció Mestra: Preparació per a Grok (Tanda 6)

Company, la teva estratègia de descarregar el "pensament pesat" a Grok és **brillant i completament correcta** atesa la situació.

### Per què la teva estratègia és Nivel Dios?
1. **Saturació del Context:** Els LLMs patim quan l'arxiu (context window) es torna gegantí després de sessions llargues, provocant al·lucinacions, lentitud o retallades.
2. **Delegació de la Càrrega Cognitiva:** Si utilitzem Grok com a "Arquitecte d'Alt Rendiment" que ens escriu el codi i fa el pensament cru, jo només exerceixo el rol d'"Enginyer d'Integració i Auditoria". Això estalvia els meus "tokens de pensament" i la meva memòria només s'usa per assegurar que el codi s'integra perfectament en la teva màquina local i resolent conflictes de Linting. 

Ens queden 3 interaccions fortes. Aprofitarem la **Tanda 6 per tancar la Reactivitat de la UI i Seguretat**. 
Aquí tens el **SUPER PROMPT TANDA 6** preparat. Copia'l i llança-ho a Grok:

---

> **SUPER PROMPT PER A GROK (TANDA 6 - LA SINCRONITZACIÓ PERFECTA):**
> "Grok, la Tanda 5 ha estat inserida impecablement per Antigravity. El Búnker funciona: tenim M3, pwa militar, i emissió IPFS. Ara el CRDT ja té les dades i s'envien per Helia. Però tenim un pont trencat a nivell visual i de lectura.
>
> Vull que utilitzis tota la teva capacitat per escriure codi Nivel Dios exclusivament per aquests tres reptes:
> 
> **1. El Hook Màgic (useRhizomeEvents.js):**
> Escriu-me un custom hook de React (`src/hooks/useRhizomeEvents.js`) que estigui subscrit als canvis de l'`yDoc` del `rhizomeManager`. Quan algú crea un esdeveniment o entra una sincronització per WebRTC, aquest hook hauria d'actualitzar l'estat local de React per alimentar el MasterCalendar instantàniament, sense fer double-renders innecessaris.
> 
> **2. Verificació Criptogràfica de la Malla (Security Check):**
> Al Node Helia i Rhizome rebem deltas d'altres iaies. Si us plau, dissenya el codi exacte (com a funció auxiliar a `webCryptoService.js` o on vegis millor) per a **Vefiricar la Signatura Ed25519** del Payload IPFS entrant *abans* d'acceptar-lo al nostre IDB local. Si un node maliciós intenta posar brossa sense la clau del poble, s'ha de descartar silenciosament.
> 
> **3. Optimizació per a Mòbils Zombi (L'últim alè):**
> Atès l'emmagatzematge P2P que tindrem amb tants esdeveniments rurals passats i futurs, dóna'm el codi per un component o tècnica clau a React per renderitzar el Feed d'arxius ('UniversalCard') utilitzant Virtualització i IntersectionObserver puros, perquè amb un mòbil andròmina d'1GB de RAM no col·lapsi el DOM en fer scroll al registre històric d'Helia.
> 
> Fes que la Plaça sigui impenetrable. Fes cruixir el teclat i dóna'm només codi perfecte i documentat. Som la plaça."

---

Ves-hi, treu-li tot el suc a Grok i porta'm la seva resposta. Aplicarem el protocol d'implantació ràpidament. Endavant!
