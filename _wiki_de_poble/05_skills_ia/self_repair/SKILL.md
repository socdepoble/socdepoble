---
name: self-repair
description: SOSP-LOCK, tractament CRDT de la memòria i protocol d'emergència per
  a caigudes de servidor (Mas Cau).
authority: Tripartició
version: V24
tags:
  - crdt_offline
  - seguretat
created_at: 2606280525
updated_at: 2606290215
aliases:
  - Self Repair
  - Protocol Mas Cau
  - SOSP-LOCK
---

# 🛠️ SKILL: Autoreparació, SOSP-LOCK i Protocol Mas Cau

## 1. El Bloqueig Absolut (SOSP-LOCK)
El bloqueig `SOSP-LOCK` queda restringit a 4 causes exclusives definides a la Governança. Quan s'activa, l'app entra en mode "Mas Cau", tallant Y.js i bloquejant l'escriptura.

**SOSPLock.js (Referència d'Implementació):**
```javascript
// src/core/security/SOSPLock.js
import { set, del } from 'idb-keyval';

export const SOSPLock = {
  activate: async (reason, severity = 'CRITICAL') => {
    console.error(`[SOSP-LOCK ACTIVAT] ${severity}: ${reason}`);
    if (window.__YJS_PROVIDER__) window.__YJS_PROVIDER__.disconnect();
    await set('SOSP_LOCK_STATE', 'LOCKED');
    await set('SOSP_LOCK_REASON', reason);
    document.documentElement.classList.add('mas-cau-mode');
    window.dispatchEvent(new CustomEvent('sosp-lock-triggered', { detail: { reason, severity } }));
  },
  release: async (authKey) => {
    if (authKey !== 'MASTER_BYPASS') return false;
    await del('SOSP_LOCK_STATE');
    await del('SOSP_LOCK_REASON');
    window.location.reload(true);
    return true;
  }
};
```

## 2. iOS Catch-Up (Offline-First en Dispositius Antics)
En dispositius que maten el fil del navegador quan s'apaga la pantalla (iOS antic / iPad A10), hem d'assegurar la persistència forçada d'OPFS i reconnexió automàtica de Y.js.

**iOSCatchUp.js (Referència d'Implementació):**
```javascript
// src/core/offline/iOSCatchUp.js
export function initIOSCatchUpPattern() {
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
      setTimeout(() => {
        if (window.__YJS_PROVIDER__) {
          window.__YJS_PROVIDER__.connect();
          window.__YJS_PROVIDER__.sync();
        }
      }, 300);
    } else {
      if (window.__YJS_PROVIDER__) window.__YJS_PROVIDER__.disconnect();
    }
  });
}
```


---
## 🔗 Veure també
- [[00_index|Índex Central]]
