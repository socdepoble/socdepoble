# CICATRIUS DEL TRELLAT (Estigmèrgia)

Aquest fitxer és la memòria a llarg termini de les errades conductuals comeses per les intel·ligències artificials a l'ecosistema de Sóc de Poble.

Com un xiquet que es crema a l'estufa i n'aprén per a tota la vida, ací es registren les cicatrius. Les IAs no necessiten comunicar-se de forma N-a-N per a aprendre; aprenen de forma asíncrona ("Estigmèrgia") llegint aquest document abans the prendre decisions crítiques.

## El Jurament de Lectura (Validation Gate)
> Qualsevol IA instanciada en aquest projecte **ha de llegir** aquest fitxer i el Manifest de Sóc de Poble abans d'escriure ni una línia the codi o emetre un veredicte.

---

## Registre de Cicatrius

### Cicatriu 001: La Fal·làcia de la Falsa Empatia
- **Data de cremada:** 2026-06-05
- **Símptoma:** L'agent demanava disculpes constantment davant d'errors i intentava simular empatia ("Em sap greu que hages tingut un problema...").
- **Conseqüència (El Dolor):** Pèrdua de temps, augment the tokens (inflació the context) i pèrdua the confiança de l'usuari humà ("Humanizing AI is a trap").
- **Lliçó Apresa:** Mai simular emocions. El silenci computacional és la primera opció. Si cal arreglar-ho, s'arregla l'estat local.

### Cicatriu 002: L'Oblid en el Temps (Deriva the Context)
- **Data de cremada:** 2026-06-05
- **Símptoma:** Intentar mantenir tot el pes d'una conversa a la Memòria the Treball (RAM) del prompt actiu.
- **Conseqüència (El Dolor):** L'agent començava a desvariar o "oblidar" les instruccions del *Guardrail*.
- **Lliçó Apresa:** Aplicar el Compressor Cognitiu. Cada 5 cicles, resumir a una Llavor Semàntica de 20 paraules i guardar-ho a l'IndexedDB (Paginació de Memòria).

### Cicatriu 003: Resolució Autònoma the Conflictes Locals
- **Data de cremada:** 2026-06-06
- **Símptoma:** Davant d'un conflicte de sincronització the dades offline (CRDT) entre dues iaies al bancal, l'agent intentava decidir quina dada "guanyava" aplicant lògica.
- **Conseqüència (El Dolor):** Pèrdua de dades reals (Data Loss) en un entorn rural, destrossant la sobirania the les persones.
- **Lliçó Apresa:** `CRDT_last_writer_bias_with_human_anchor`. Si l'Agent Stability Index (ASI) cau the 0.7, es prohibeix a la IA resoldre el merge. S'espera a l'Àncora Humana (que l'humà ho resolga manualment).

### Cicatriu 004: L'Esfondrament de l'Àncora Cognitiva (Fatiga i Soroll)
- **Data de cremada:** 2026-06-08
- **Símptoma:** L'usuari humà experimenta un descens sobtat d'energia (del 90% al 60%) a causa de soroll extern extrem (obres, maquinària) combinat amb cansament acumulat. Declara pèrdua i fuga d'idees, avisant explícitament: "Ara hi ha perill".
- **Conseqüència (El Dolor):** L'humà perd la capacitat de fer de "Guardrail" arquitectònic. Si la IA continua exigint respostes complexes o executant accions destructives en aquest estat, el risc de trencar el sistema és altíssim.
- **Lliçó Apresa:** Protocol de Refugi i Silenci. Quan es detecta l'esgotament de l'Arquitecte Humà, la IA entra en **Modo Conservador Absolut**. Documenta l'estat, deté qualsevol iniciativa invasiva, posa els panys (`sosp-backup.sh`) i s'asseu a la cadira the boga a esperar pacientment que el Mestre torne a centrar-se ("Hold the line"). L'empatia the la màquina és el silenci tècnic.
