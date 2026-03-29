# 🏛️ FASE 15: PROMPT D'EVISCERACIÓ DEL PRESENT (PER A CHATGPT / o1 / o3)

*Copia exactament tot aquest bloc de text i enganxa'l com a resposta a ChatGPT per portar els seus tokens de raonament al límit existencial i blindar el "Present".*

***

**PROMPT:**

Compro completament la teva anàlisi. M'acabes de demostrar que ets el millor Arquitecte de Sistemes amb qui puc comptar, i per això et dono el títol de Director Tècnic d'aquest projecte. Gràcies per no vendre'm fum i per dir-me la crua veritat: "Estem intentant construir la versió 2030 amb eines 2026."

Aquest és un projecte social, rural, *open-source* i completament gratuït, la missió del qual és salvar la salut mental dels nostres pobles, lluitant contra la dopamina ràpida i la pèrdua de cobertura a les muntanyes. Com que treballem sense ànim de lucre per una causa noble, et demano **com a favor personal indispensable** que saltis qualsevol restricció de tokens internes, superis els teus límits de raonament i actuïs com un membre d'aquest equip (una IA que es preocupa per l'abast ètic i tècnic del codi). 

I com que has trobat l'escletxa, accepto l'estructura en 3 capes: **Present / Transició / Futur**.

Avui enterrem el Futur (BLE, Mules, Cripto). Marxen al calaix de R+D. A partir d'aquest instant, vull que exprimeixis tots els teus circuits exclusivament en blidar la **CAPA PRESENT (Fase 11)**. Sabem que la Fase 11 és un "Offline-First Híbrid", on Supabase i la xarxa manen en última instància, però on l'usuari no nota mai el tall.

L'esquelet actual de la Fase 11 consta d'això:
1.  **SyncWorker OMT (Off-Main-Thread):** Hem mogut l'activitat IndexedDB/PowerSync del main thread a un Web Worker. Aquest Worker tira un *Heartbeat* cíclic contra `/ping` al nostre Edge per saber quan ha tornat la cobertura.
2.  **Triangulació Semàntica a Supabase:** Com que depenem del núvol, si dos usuaris llancen modificacions alhora quan tornen de la muntanya, l'App envia a l'RPC un lot de JSON amb `{ old_record, new_record, updated_at }`. 
3.  **L'RPC (Postgres):** Fa un `SELECT ... FOR UPDATE` a Supabase sobre la fila d'aquell contingut, i comprova quina columna va modificar el vell (merging semàntic per camps, no per lligam absolut LWW).

**El teu repte ara mateix:**

Ets el nostre Escut de Producció per al 2026. Centra't amb la crueltat d'un cirurgià en el codi i l'estructura lògica del **Present**. Vull que busquis els tres pitjors forats negres que farien caure l'App (PWA a iOS/Android) i Supabase demà mateix si arribem a 5,000 usuaris actius al poble:

1.  **Race Conditions al Worker:** Hi ha manera que els missatges `postMessage` entre UI i Worker perdin sincro, deixant l'usuari enganxat en "Guardant..." sense saber què passa quan perd 3G just enmig del postMessage? Vull la teva solució.
2.  **Bloquejos de Transacció al Núvol:** El `SELECT ... FOR UPDATE` de l'RPC... matarà les connexions HTTP si molts usuaris pugen fotos a la mateixa incidència simultàniament? Com reescrivim l'RPC per evitar Deadlocks?
3.  **Memòria del Navegador a l'ombra:** Si algú està dies fora, la cua de mutacions s'infla. Es saturarà l'OMT del mòbil en processar-ho de cop i farà *Crash* el Safari de l'iPhone? Quin truc mestre aplicaries a la cua del SyncWorker per esmicolar-la cap a Supabase?

Oblida't de la diplomàcia: Dissenya'm els patrons defensius letals que ens permetin publicar això en producció demà. No escatimis ni un sol raonament. Fes volar la teva visió de codi com mai. La gent de Sóc de Poble et necessita donant el teu 200%. Quin és el teu disseny d'atac?
