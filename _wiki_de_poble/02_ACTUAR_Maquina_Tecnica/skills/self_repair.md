---
estat: 'canonic'
name: 'self-repair'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: "SDP-LOCK, tractament CRDT de la memòria i protocol d'emergència per a caigudes de servidor (Mas Cau)."
aliases:
  - SelfRepair
  - SDPLOCK
  - MasCau
  - ProtocoldEmergència
tags:
  - ia
  - petorretes
  - termodinamica
  - execucio
script: ''
---

# 🛡️ SKILL: Auto-Reparació i Tractament d'Emergències (SDP)

> **Visió del Consell d'IAs:** L'estabilitat no tracta només d'escriure codi sense bugs, sinó de preveure què passa quan falla la connexió o quan els agents IA (inclús nosaltres) tenen l'impuls de fer destrosses innecessàries. Ací resideix el sentit comú.

## 🎯 Objectiu
Protegir el codi d'intervencions dràstiques i automatitzar el comportament de l'aplicació en moments on el servidor central es desconnecta o es percep una catàstrofe a la memòria. 

---

## 🛠️ Normes i Funcions de Protecció

### 1. El Disparador SDP (Stop-Observe-State-Proceed)
Aquest és el sistema immunològic del Mas davant un bug catastròfic o modificació agressiva sol·licitada.
- **Stop (Atura):** La IA ha d'aturar l'execució i negar-se a escriure el codi maliciós o inestable.
- **Observe (Observa):** Capturar l'estat i determinar per què el codi vell va trencar.
- **State (Fixa l'Estat):** Analitzar la llavor anterior de funcionament òptim (rollback mental).
- **Proceed (Avança):** Generar i suggerir una solució segura (Testada en Quarantena).

### 2. Memòria Viva i Prevenció de la Paradoxa de l'Acta Única
Quan el sistema es desperta (activador "Sóc de Poble!"), té expressament **prohibit intoxicar el seu context amb informació redundant** del dia anterior. Només hi carregarà els fonaments retinguts als arxius consolidats (el Neocòrtex permanent), evitant l'entropia i bucles continus d'explicacions.

### 3. Protocol "Mas Cau" (Mode Búnquer d'Emergència)
Si el servidor Supabase cau o no hi ha xarxa a les muntanyes, l'aplicació no col·lapsa ni llança finestres d'error estridents.
- S'activa automàticament el **SDP-LOCK Adaptatiu**.
- L'indicador de xarxa es torna amable (icona de la llar de foc o "Tancat a casa").
- Els intents agressius de sincronització (spinners ansiosos) queden tallats.
- Tot s'acumula localment de manera segura i opaca per a l'usuari fins que torne a haver-hi connectivitat, promovent inclús el traspàs P2P (Peer-to-Peer).

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per profunditzar en com s'alerta l'assistent i on intervé l'Humà:
- [[cingulat_anterior|Cingulat Anterior]] (La secció on s'avaluarà el nivell de destrossa, com la mètrica UDR que activa el SDP-LOCK).
- [[executiu_central|Executiu Central]] (L'actor encarregat d'implementar el codi sa un cop aprovat pel Mestre).
- [[backup_recovery|Backup i Recovery]] (Per recuperar el darrer snapshot en cas que el SDP decidisca un col·lapse total de dades locals).

**Sinapsis:** [[01_IDENTITAT]], Arquitectura_L_Ecosistema, [[connectors_mcp_disseny]], 260629_0200_SKILL_plantilla_suprema

