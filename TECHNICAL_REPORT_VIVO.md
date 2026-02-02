# 📄 INFORME TÉCNIC VIVID: PLATAFORMA "SÓC DE POBLE"
**Estat del Document:** [ACTIU / v1.5.6-VITAMINADA-STABLE]
**Data de l'Informe:** 1 de febrer del 2026
**Arquitectura:** Local-First / Rhizome DB
**Visió:** Sobirania Digital Rural & Preservació Patrimonial

---

## 1. RESUM EXECUTIU
"Sóc de Poble" no és una aplicació web tradicional; és una infraestructura de **Sobirania Digital** dissenyada per a entorns rurals. L'arquitectura es basa en el principi **Local-First**, on les dades resideixen primàriament al dispositiu de l'usuari ("Village Cell").

---

## 2. ARQUITECTURA TÈCNICA ACTUAL
Arquitectura Local-First amb Rhizome DB (SQLite + CRDTs). El sistema prioritza l'execució offline i la sobirania de dades mitjançant la Village Cell.

### 2.1. El Nucli Local (Rhizome DB)
- **Motor:** SQLite + FTS5 per a cerques instantànies.
- **Sincronització:** CRDTs per a convergència sense conflicte.
- **Seguretat:** Identitat auto-sobirana (SSI) i protocol MLS per a xats de grup.

### 2.2. Interfície de Resiliència (Bancal Mode)
- **Contrast:** Optimitzat per a 100,000 lux (llum solar directa).
- **Consola:** Consola de Comandament "Solatge" per a diagnòstics en temps real.

---

## 3. ESTAT DEL DESENVOLUPAMENT (v1.5.6-VITAMINADA)
Fase actual: BATEGA. Progrés global: 19/24 tasques completades.

### Mètriques del Sistema:
- **Pobles Connectats:** 12
- **Nodes de Federació:** 3
- **Simbiosi Humà-IA:** 42% (mitjana)

---

## 4. FULL DE RUTA (ROADMAP)
- **v1.6.0**: Desplegament de la Federació de Nodes.
- **v1.7.0**: Mercat Rural amb Pagaments Sobirans.
- **v2.0.0**: Xarxa de Confiança (Web of Trust) totalment descentralitzada.

---

## 5. CAPACITATS EN PROGRÉS
- **Projecte Rúper Rató:** Super-cercador semàntic.
- **Càpsula del Temps:** Protocol d'exportació sobirana integral.
- **El Rebost:** Importació massiva i enriquiment de recursos (Finalitzat).

---

*Signat: Flash & MArIA (Sistema Antigravity).*
*Responsable Arquitecte: Javi Llinares.*
