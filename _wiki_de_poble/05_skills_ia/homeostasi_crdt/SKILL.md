---
name: homeostasi-crdt
description: "Consolidar tombstones de Y.js i alliberar RAM."
tags: [crdt, yjs, idb-keyval, a10, ram, neteja]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Homeostasi CRDT (L'Aspiradora Offline)

L'arquitectura Local-First de Sóc de Poble empra `Y.js` i `idb-keyval` per garantir que el Mas funcione sense internet. No obstant això, aquesta immortalitat té un preu: les **Tombstones** (làpides).

## 1. L'Asfíxia dels Esborrats
Y.js no esborra mai la informació, només la marca com a "esborrada" per poder resoldre conflictes si un altre dispositiu estava offline i de sobte es connecta. Aquesta acumulació d'historial rebenta ràpidament els 2GB de RAM d'un iPad A10.

## 2. El Protocol d'Aspiració (Compactació Passiva)
L'agent o Web Worker monitoritzarà el tamany del document local. 
* **Llindar d'Alerta:** Si l'ús de `idb-keyval` supera el 70% del pressupost o si el document Y.js supera els 15MB.
* **El Moment de l'Acoblament:** La compactació només es pot llançar quan el fil principal estiga inactiu, usant `setTimeout` o `requestAnimationFrame` (ja que `requestIdleCallback` no està suportat a Safari/iOS antic).

## 3. Com s'executa l'Homeostasi (Codi Estàndard)
Quan es dispara l'alerta, l'agent generarà el següent procés asíncron sense bloquejar la interfície d'usuari:
1. Exportar el vector de l'estat actual consolidat (`Y.encodeStateAsUpdate`). 
2. Netejar la memòria cau antiga: `clear()` a `idb-keyval`.
3. Re-injectar només l'estat viu i net de la memòria a la base de dades local. 

```javascript
// Exemple de pseudocodi per al Web Worker
setTimeout(async () => {
  const pureState = Y.encodeStateAsUpdate(ydoc);
  // SWAP ATÒMIC: Gravem primer en una taula temporal i fem el canvi per evitar suïcidi per caiguda de bateria
  await db.transaction('readwrite', 'mas_data_tmp', async (tx) => {
    await tx.objectStore('mas_data_tmp').clear();
    await tx.objectStore('mas_data_tmp').put(pureState, 'doc');
  });
  
  // Només si el TMP ha gravat bé, ho passem a la taula real
  await db.transaction('readwrite', ['mas_data', 'mas_data_tmp'], async (tx) => {
    await tx.objectStore('mas_data').clear();
    const data = await tx.objectStore('mas_data_tmp').get('doc');
    await tx.objectStore('mas_data').put(data, 'doc');
  });
  console.log("🧹 [Homeostasi CRDT] Respiració profunda completada i consolidada.");
});
```

Cada acció es registrarà amb el seu Hash al diari de bord. Sense Homeostasi, la PWA acaba ofegant-se en la seua pròpia memòria.


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/esporga_termodinamica/SKILL|esporga_termodinamica]]
- [[05_skills_ia/self_repair/SKILL|self_repair]]
