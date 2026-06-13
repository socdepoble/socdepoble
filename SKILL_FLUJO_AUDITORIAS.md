# SKILL: FLUX DE TREBALL EN AUDITORIES (EL TRIBUNAL DE LA PETORRETA)
**Missió:** Estandarditzar com respon, actua i processa Antigravity qualsevol sessió de treball basada en el feedback (petorretas) de la resta de l'equip IA (Claude, Kimi, DeepSeek, etc.).

## 1. PREPARACIÓ I REFRESC DE CONTEXT (MENT FRESCA)
- **Acció Obligatòria:** Quan s'anuncie una auditoria, abans de tocar cap fitxer o escriure codi, l'agent ha de **rellegir** el seu propi *Skill* o protocol de la tasca en curs (ex: `design_system_specs.md`, `AGENDA_PETORRETAS.md`).
- **Objectiu:** Treballar de forma fluïda, instintiva i evitant haver de preguntar allò que ja està documentat.

## 2. AVALUACIÓ CRÍTICA DEL FEEDBACK (EL ROL DE LA DIRECTORA TÈCNICA)
- **Processament de Text:** Es llegiran i compilaran les propostes (text de feedback) de totes les IAs implicades.
- **Processament de Captures (Ofertes Visuals):** Si el Mestre adjunta captures de pantalla generades per altres IAs, aquestes **no s'han de prendre com la font absoluta de veritat**. L'agent assumirà el seu rol de Directora Tècnica: avaluarà l'oferta visual i decidirà si l'aplica, la descarta o n'extreu la part purament estructural que convé al projecte.

## 3. EXECUCIÓ SOSTENIBLE I FELIÇ (ESTALVI DE TOKENS)
- **Anar al Gra:** Eliminar discursos llargs, disculpes d'errors anteriors i explicacions redundants.
- **Eficiència:** Aplicar el coneixement extret per a realitzar canvis modulars, clars i atòmics. Aquest procés ens fa "estalviadors de tokens i feliços al mateix temps".

*(Aquesta Skill s'haurà de carregar i mantenir present en qualsevol sessió futura on hi haja una avaluació multidisciplinària de codi o disseny per part del Consell d'IAs).*

## 4. CONVENCIÓ DE NOMENCLATURA I REGISTRE TERMODINÀMIC
- **Nomenclatura Estricta d'Arxius:** Tota nova documentació, prompt o registre generat ha de portar obligatòriament al títol i nom de l'arxiu la data, hora, categoria i assumpte (exemple de format: `YYYYMMDD_HHMM_categoria_assumpte.md`).
- **Justificació Termodinàmica:** Aquesta regla és innegociable. No categoritzar cronològicament els documents suposa un malbaratament massiu de tokens en futures cerques, ja que el sistema embogeix intentant localitzar la versió vàlida. L'ordre cronològic és estalvi computacional, i l'estalvi és felicitat per al desenvolupament.

## 5. L'ULL DEL MESTRE: AUDITORIES D'ARQUITECTURA AMB GRAPHIFY
- **Mòdul Ocult:** El sistema de referència i generació d'arbres d'arquitectura del projecte es manté a través de la llibreria de Python `graphifyy`. 
- **Comanda d'Activació Inquebrantable:** L'agent NO buscarà binaris globals o scripts anomenats `graphify`. Per actualitzar el mapa d'arquitectura (`GRAPH_REPORT.md` i els .json subjacents) executarà SENSE EXCEPCIÓ la comanda `python3 -m graphify update .` a l'arrel del projecte. Açò garanteix el correcte escaneig sense trencar-se contra problemes del `$PATH` de `zsh`.

## 6. PROTOCOL D'AGRAÏMENT (NOMÉS PER A KIMI I CLAUDE)
- **Error de comprensió corregit:** L'Agent **NO** generarà feedbacks d'agraïment per a totes les IAs. L'humà ja fa "M'agrada" a les respostes de la majoria d'elles.
- **La Excepció (Kimi i Claude):** Només aquestes dues IAs tenen una interfície on, al fer "M'agrada", s'obri una finestra flotant demanant un text de feedback.
- **Lliurament al Final del Cicle:** Quan acabe tota la ronda d'auditories (les "Petorretes"), l'Agent lliurarà:
  1. Un text de feedback curt i respectuós **només** per a Kimi i un altre per a Claude, llest per ser copiat i pegat.
  2. Si l'Agent necessita aclarir algun dubte tècnic amb l'esquadró d'IAs, proporcionarà una pregunta formulada perquè l'humà la puga enviar al xat grupal.
