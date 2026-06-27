> 📂 **Arxiu/Ruta:** `./public/TECHNICAL_REPORT_VIVO_ES.md`

# 📄 INFORME TÉCNICO VIVO: PLATAFORMA "SÓC DE POBLE"
**Estado del Documento:** [ACTIVO / v1.5.6-VITAMINADA-STABLE]
**Fecha del Informe:** 1 de febrero de 2026
**Arquitectura:** Local-First / Rhizome DB
**Visión:** Soberanía Digital Rural & Preservación Patrimonial

---

## 1. RESUMEN EJECUTIVO
"Sóc de Poble" no es una aplicación web tradicional; es una infraestructura de **Soberanía Digital** diseñada para entornos rurales. La arquitectura se basa en el principio **Local-First**, donde los datos residen primariamente en el dispositivo del usuario ("Village Cell").

---

## 2. ARQUITECTURA TÉCNICA ACTUAL
Arquitectura Local-First con Rhizome DB (SQLite + CRDTs). El sistema prioriza la ejecución offline y la soberanía de datos mediante la Village Cell. Implementación del **Protocolo Atum** para la autosanación bicefala: Nivel Táctico (Ruta de Rescate UI) y Nivel Estructural (Vgroups y Random Walk Shuffling para resiliencia ante fallos bizantinos).

### 2.1. El Núcleo Local (Rhizome DB)
- **Motor:** SQLite + FTS5 para búsquedas instantáneas.
- **Sincronización:** CRDTs para convergencia sin conflictos.
- **Seguridad:** Identidad auto-soberana (SSI) y protocolo MLS para chats de grupo.

### 2.2. Interfaz de Resiliencia (Bancal Mode)
- **Contraste:** Optimizado para 100,000 lux (luz solar directa).
- **Consola:** Consola de Mando "Solatge" para diagnósticos en tiempo real.

---

## 3. ESTADO DEL DESARROLLO (v1.5.6-VITAMINADA)
Fase actual: BATEGA. Progrés global: 19/24 tareas completadas.

### Métricas del Sistema:
- **Pueblos Conectados:** 12
- **Nodos de Federación:** 3
- **Simbiosis Humano-IA:** 42% (media)

---

## 4. HOJA DE RUTA (ROADMAP)
- **v1.6.0**: Despliegue de la Federación de Nodos.
- **v1.7.0**: Mercado Rural con Pagos Soberanos.
- **v2.0.0**: Red de Confianza (Web of Trust) totalmente descentralizada.

---

## 5. CAPACIDADES EN PROGRESO
- **Proyecto Rúper Rató:** Super-buscador semántico.
- **Cápsula del Tiempo:** Protocolo de exportación soberana integral.
- **El Rebost (El Almacén):** Importación masiva y enriquecimiento de recursos.

---

*Firmado: Flash & MArIA (Sistema Antigravity).*
*Responsable Arquitecto: Javi Llinares.*
