# 📄 INFORME TÉCNIC VIVID: PLATAFORMA "SÓC DE POBLE"
**Estat del Document:** [ACTIU / v{{VERSION}}-{{PHASE}}]
**Data de l'Informe:** {{DATE}}
**Arquitectura:** Local-First / Rhizome DB
**Visió:** Sobirania Digital Rural & Preservació Patrimonial

---

## 1. RESUM EXECUTIU
"Sóc de Poble" no és una aplicació web tradicional; és una infraestructura de **Sobirania Digital** dissenyada per a entorns rurals. L'arquitectura es basa en el principi **Local-First**, on les dades resideixen primàriament al dispositiu de l'usuari ("Village Cell").

---

## 2. ARQUITECTURA TÈCNICA ACTUAL
{{ARCHITECTURE_SUMMARY}}

### 2.1. El Nucli Local (Rhizome DB)
- **Motor:** SQLite + FTS5 per a cerques instantànies.
- **Sincronització:** CRDTs per a convergència sense conflicte.
- **Seguretat:** Identitat auto-sobirana (SSI) i protocol MLS per a xats de grup.

### 2.2. Interfície de Resiliència (Bancal Mode)
- **Contrast:** Optimitzat per a 100,000 lux (llum solar directa).
- **Consola:** Consola de Comandament "Solatge" per a diagnòstics en temps real.

---

## 3. ESTAT DEL DESENVOLUPAMENT (v{{VERSION}})
{{DEVELOPMENT_STATUS}}

### Mètriques del Sistema:
- **Pobles Connectats:** {{TOWN_COUNT}}
- **Nodes de Federació:** {{NODE_COUNT}}
- **Simbiosi Humà-IA:** {{AI_SIMBIOSI}}% (mitjana)

---

## 4. FULL DE RUTA (ROADMAP)
{{ROADMAP}}

---

## 5. CAPACITATS EN PROGRÉS
- **Projecte Rúper Rató:** Super-cercador semàntic.
- **Càpsula del Temps:** Protocol d'exportació sobirana integral.
- **El Rebost:** Importació massiva i enriquiment de recursos (Finalitzat).

---

*Signat: Flash & MArIA (Sistema Antigravity).*
*Responsable Arquitecte: Javi Llinares.*
