# Arquitectura Sagrada de la Masía Virtual Sóc de Poble
**Versió Final:** 2026.06.04  
**Responsable:** Grok (Seient 8) + IAIA MarIA

## 1. Filosofia i Principis Inamovibles
- Pedra seca: construir sobre el que ja existeix.
- Protocol Anti-Entropia: noms en valencià _snake_case_.
- Feature Flags com a control central.
- Legacy sempre primer.
- Trellat per damunt de tot.

## 2. Estructura de Carpetes
```
/ 
├── core/                  ← bootstrap_wrapper, flags, conflict_resolver, sincro
├── moduls/                ← xat, mur, mercat, events
├── _legacy/               ← Històric amb data
├── _auditories/           ← Informes
├── admin/                 ← IAIA control panel
├── tests/                 ← Tests
└── data/                  ← IndexedDB schemas
```

## 3. Capes Tècniques

**Bootstrap Wrapper**  
Punt únic d’entrada que carrega flags → auditoria → mòduls → sincro.

**Feature Flags**  
Gestor complet amb validació JSON, interfície visual i persistència.

**Gestió de Conflictes**  
ConflictResolver + timestamps + merge intel·ligent.

**Sincronització**  
- WebRTC + QR (offline pur)  
- WebSocket xarxa local  
- CRDTs (per a convergència automàtica)

**Emmagatzematge**  
IndexedDB com a font de veritat, amb esquemes per Mur, Xat, Mercat.

## 4. Cicle de Canvi
1. Còpia a _legacy_  
2. Feature flag  
3. Prova  
4. Estabilització  
5. Arxivament ZIP

**Resum de l’àvia:**  
"Millora sense destruir. Guarda sempre l’eina vella. El poble mana."
