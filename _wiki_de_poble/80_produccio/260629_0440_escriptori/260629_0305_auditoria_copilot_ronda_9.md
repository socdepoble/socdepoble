# AUDITORIA ZERO — EL MAS PURIFICAT (Copilot)
**Data:** 260629_0305
**Agent Auditor:** Copilot (Consell de la Petorreta)
**Score Objectiu:** 7.5 / 10

## Resum del Veredicte
La base tècnica és sòlida (OPFS + Y.js + PWA offline-first), però pateix de la manca de polítiques operatives concretes sobre evicció, compactació i degradació de RAG. L'absència d'una capa d'intel·ligència local que regule l'ús de recursos en temps real impedeix l'autopoiesi i posa en perill l'iPad A10.

## 1. Llacunes Arquitectòniques
- **Gestió OPFS sense límits explícits:** OPFS pot créixer indefinidament i saturar l'emmagatzematge. Falta política de compactació i snapshots.
- **Política d'evicció i resum automàtic absent:** Calen versions "lite" per no carregar documents sencers a la RAM de l'A10.
- **Abstracció RAG Local inexistent:** Executar WebNN sobre documents complets ofegarà la RAM. Cal indexació jeràrquica i quantitzada.
- **Y.js i Tombstones no controlats:** (Coincidix amb Qwen). GC de Y.js és deficient.
- **Degradació segura incompleta:** Sèquia Mare no sap com degradar funcionalitats quan la bateria/RAM cauen.

## 2. Modificació Proposada (Autopoiesi Pura)
**Implementar la Capa d'Intel·ligència Local Autònoma (CILA):**
Un micro-motor local integrat que:
- Indexa i vectoritza lleugerament (baixa quantització).
- Genera resums progressius (versions lite) per a documents grans.
- Política d'evicció adaptativa basada en freqüència d'accés i entropia (LRU).
- Scheduler energètic i de memòria (pausa RAG quan bateria/RAM són crítiques).
- Checkpointing i rollback local (Snapshots incrementals d'OPFS).

## 3. Accions Immediates Recomanades
1. Definir polítiques OPFS.
2. Afegir GC per a Y.js reactiu.
3. Crear versions resum.
4. Desenvolupar CILA bàsica.
5. Establir llindars d'alarma a la Consola Termodinàmica (>75% RAM, >5% creixement OPFS, >10k tombstones).

## 4. DAFO
Confirma les anàlisis de ChatGPT i Qwen, emfasitzant el perill tècnic de l'ofegament per memòria sense evicció intel·ligent.


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
