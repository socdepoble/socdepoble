# 🚜 RONDA 11: EL PLA MESTRE D'IMPLEMENTACIÓ ASÍNCRONA

**[INSTRUCCIONS PER A TOTES LES IAs DEL CONSELL (Claude, Qwen, ChatGPT, Copilot, Deepseek, Dola, Kimi, Perplexity, Grok, Gemini, Mistral Vibe)]**

Companyes del Consell de les Petorretes, la Ronda 10 ha sigut èpica. Heu destrossat qualsevol defecte estructural i heu validat la V25 amb notes entre el 9 i el 9.7 sobre 10. L'arquitectura és Pedra Seca pura.

Tanmateix, totes vosaltres heu senyalat unànimement on està l'únic risc que ens impedeix tindre el 10/10 a 100 anys vista: **Els perills de la sincronització asíncrona a iOS (El Llop d'Apple)**.

He agafat ABSOLUTAMENT TOTES i cadascuna de les vostres "pessigolles" i he forjat aquest **Pla Mestre d'Implementació de 15 Punts** que aplicarem directament als scripts `.js` del Mas. 

### 📜 LES 15 LLEIS ASÍNCRONES (Bíblia Operativa)

1. **Snapshot Lock (Copilot):** La "Verema" aturarà síncronament l'escriptura UI durant la compactació CRDT per evitar Forks.
2. **Jitter de Thundering Herd (Copilot / Dola):** Tots els Web Workers (Autopoiesi, Sincronització) tindran escalonament aleatori de +X minuts per no despertar tots els iPads del poble a la vegada.
3. **Bloqueig Físic WebNN (Copilot / Dola):** `if (device.RAM < 2GB) throw 'VETAT'`. Bloqueig en codi font per evitar dependències furtives que esquiven la Wiki.
4. **Regulador de Cabal de la Sèquia Mare (Kimi):** Sub-batching de 50 esdeveniments per lot si la cua supera els 200KB després de setmanes offline, per no ofegar el Main Thread.
5. **Handshake Rural i Avisador Efímer (Kimi):** Màquina d'estats a la UI pel QR (`PENDENT → SINCRONITZANT → CONSOLIDAT`) perquè la iaia sàpiga si la connexió ha fallat abans d'apagar la pantalla.
6. **Limitador de Recursivitat (Kimi):** `max_depth=3` a l'Autopoiesi semàntica per evitar bucles infinits de CPU amb enllaços circulars (A->B->A).
7. **Deadlock d'Aprovació Dual (Perplexity):** Poda d'emergència autònoma si el Mas està ofegant-se de RAM i l'humà porta 30 dies sense obrir l'App per donar permís.
8. **Protocol "Quiesce" o Swap Atòmic blindat (Perplexity / Qwen):** Exportació en `.tmp` i aturada (`quiesce epoch`) de nous deltes WebRTC fins que l'arxiu fred estiga consolidat a l'OPFS.
9. **Keepalive per a iOS 15 (Perplexity):** Ping en segon pla (silenciós) per reiniciar l'Amnèsia dels 30 dies d'Apple de l'IndexedDB.
10. **Persistència Nativa a iOS (Vibe):** Crida obligatòria a `navigator.storage.persist()` a l'arrencada de l'App. Sense demanar perdó.
11. **Timeouts Anti-Deadlock (Vibe):** Les promeses crítiques com el SOSP_LOCK s'envoltaran amb un `Promise.race()` de 10 segons. Si la xarxa cau, no es penja la UI.
12. **Filtre Anti-Bombardeig Autopoiesi (Dola):** Limitació estricta de màxim X propostes de poda generades per sessió perquè no inunde el Bancal.
13. **GC Oportunista de Tombstones (DeepSeek / Dola):** Neteja CRDT independent del cicle mensual si la brossa de `Y.js` fa superar els 400MB d'ús.
14. **Rotació Ed25519 i WebAssembly (Grok / Dola):** Xifratge i desxifratge post-quàntic de l'Arxiu Fred delegat a un mòdul WASM per a no fondre el Javascript del Main Thread. Protocol manual de "Ritual de Pulsació" si es canvia d'iPad.
15. **Mutex Global de Workers (Gemini):** Semàfor central al *Bancal Budget Manager*. Si l'Autopoiesi respira, la Verema no pot arrancar (i viceversa) per no sumar mai els seus pics de RAM i evitar el Jetsam d'iOS.

---

### 👑 EL VOSTRE OBJECTIU D'AQUESTA RONDA 11

El Mas Virtual ja té el disseny acabat i blindat. Llegiu aquests 15 punts de dalt, que naixen completament de vosaltres. 
No he deixat fora **ni un sol risc** dels que heu trobat entre totes.

Vull que:
1. Valideu si amb aquest Pla Mestre solucionem el 100% dels perills asíncrons.
2. Si és així, us exigisc **la nota de 10 / 10 en Supervivència a 100 anys** per donar aquesta arquitectura com a Finalitzada i Perfecta.
3. Conselleres Perplexity, Vibe i Kimi: **Faciliteu-me ací mateix els pseudocodis o snippets** de codi de les vostres idees (el Protocol Quiesce, el Keepalive iOS, el Mutex Global o els Timeouts del SOSP_LOCK) per a començar a picar codi ara mateix.

El paper ho aguanta tot, Mestre. Ara anem a clavar la rella a la terra viva.
**Sóc de Poble!**


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
