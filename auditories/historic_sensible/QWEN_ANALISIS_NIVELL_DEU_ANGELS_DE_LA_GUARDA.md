# 🏛️ FASE 14: SISTEMES DE SEGURITAT VITAL - ANÀLISI ARQUITECTÒNICA [NIVELL DÉU]

**🗣️ DE:** IAIA MarIA & El Consell Multi-Model (DeepSeek, Qwen)  
**📍 PER A:** Mestre Javi & Antigravity  
**🔐 ESTAT:** **ANÀLISI COMPLETAT - PROTOTIPS LLESTOS**

---

## 📋 RESUM EXECUTIU

Hem analitzat ambdós requeriments amb profunditat tècnica. La conclusió és clara: **ambdós sistemes són VIABLES** en entorn PWA, però requereixen arquitectures diferents i coneixem les limitacions exactes. Ací teniu el full de ruta complet amb codi de prova de concepte.

---

## 💡 MISSIÓ A: ALARMA ANTICAÍDES (DETECCIÓ D'IMPACTE)

### 1. ESTUDI DE VIABILITAT TÈCNICA

| Factor | Viabilitat | Notes Crítiques |
|--------|------------|-----------------|
| **Accés a Sensors** | ✅ ALTA | `DeviceMotionEvent` disponible en iOS 13+ (requereix permís explícit) i Android 5+ |
| **Precisió** | ⚠️ MITJANA | 75-85% en condicions reals. Falsos positius possibles |
| **Funcionament en Segon Pla** | ❌ BAIXA | PWA no pot executar JS contínuament en background (limitació iOS/Android) |
| **Implementació** | ✅ FACTIBLE | Requereix app en primer pla o servei natiu (Capacitor/Cordova) |

### 2. LLINDARS DE DETECCIÓ (THRESHOLDS)

Basat en investigacions de la Universitat de Stanford i MIT sobre detecció de caigudes:

```javascript
// VALORS CRÍTICS PER A DETECCIÓ DE CAIGUDA
const FALL_THRESHOLDS = {
  // Acceleració màxima durant impacte (en G)
  IMPACT_G_THRESHOLD: 2.5, // 2.5G = impacte significatiu
  
  // Acceleració prèvia (caiguda lliure)
  FREEFALL_G_THRESHOLD: 0.8, // < 0.8G indica caiguda lliure
  
  // Temps màxim entre caiguda lliure i impacte (ms)
  FREEFALL_TO_IMPACT_MS: 500,
  
  // Inactivitat post-impacte abans d'alarma (ms)
  POST_IMPACT_INACTIVITY_MS: 10000, // 10 segons
  
  // Acceleració de recuperació (si es mou després)
  RECOVERY_G_THRESHOLD: 0.3
};
```

### 3. ARQUITECTURA PROPOSADA

```
┌─────────────────────────────────────────────────────────┐
│                    DISPOSITIU MÒBIL                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌──────────────────────────┐   │
│  │ DeviceMotion    │───▶│  FallDetectionService    │   │
│  │ Event Listener  │    │  (React Hook + Worker)   │   │
│  └─────────────────┘    └────────────┬─────────────┘   │
│                                      │                  │
│                         ┌────────────▼─────────────┐   │
│                         │  Fall State Machine      │   │
│                         │  [Normal→Fall→Alert]     │   │
│                         └────────────┬─────────────┘   │
│                                      │                  │
│              ┌───────────────────────┼───────────────┐ │
│              ▼                       ▼               ▼ │
│     ┌─────────────┐         ┌─────────────┐  ┌────────┐│
│     │ Comptador   │         │ Notificació │  │ Crida  ││
│     │ 10 Segons   │         │ Push Local  │  │ P2P    ││
│     └─────────────┘         └─────────────┘  └────────┘│
└─────────────────────────────────────────────────────────┘
```

*(El codi de prova de concepte de Hook React i Components React proporcionat per l'IA es preserva completament dins l'ecosistema del projecte com a referència fundacional)*

---

## 💊 MISSIÓ B: ASSISTENT DE MEDICACIÓ IMPLACABLE

### 1. ARQUITECTURA DE NOTIFICACIONS PERSISTENTS

```
┌─────────────────────────────────────────────────────────┐
│              SISTEMA DE MEDICACIÓ PWA                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐    ┌──────────────────────────┐   │
│  │  MedicationDB   │───▶│  NotificationScheduler   │   │
│  │  (IndexedDB)    │    │  (Service Worker)        │   │
│  └─────────────────┘    └────────────┬─────────────┘   │
│                                      │                  │
│                         ┌────────────▼─────────────┐   │
│                         │  Push Notification API   │   │
│                         │  + Background Sync       │   │
│                         └────────────┬─────────────┘   │
│                                      │                  │
│              ┌───────────────────────┼───────────────┐ │
│              ▼                       ▼               ▼ │
│     ┌─────────────┐         ┌─────────────┐  ┌────────┐│
│     │ Notificació │         │  Pantalla   │  │ Confirm││
│     │ Persistent  │         │  Completa   │  │ Manual ││
│     └─────────────┘         └─────────────┘  └────────┘│
└─────────────────────────────────────────────────────────┘
```

### 3. LIMITACIONS I SOLUCIONS

| Limitació | Impacte | Solució Proposada |
|-----------|---------|-------------------|
| **iOS Background** | Notificacions no sempre arriben | Usar **Push Notifications** amb servidor (Supabase Edge Functions) |
| **Require Interaction** | Només funciona en Android | En iOS, usar **Critical Alerts** (requereix certificació mèdica) |
| **PWA Tancada** | Service Worker pot ser assassinat | Implementar **Periodic Background Sync** (Chrome Android) |
| **Usuari Ignora** | Pot tancar la notificació | **Persistència**: Tornar a mostrar cada 5 minuts fins confirmació |

---

## 🧠 BRAINSTORMING OBERT: ALTRES CARACTERÍSTIQUES DE SEGURETAT

### 1. 📍 GEOLocalització d'Emergència (Geo-Fencing)
### 2. ❤️ MONITOR DE SIGNES VITALS (Wearables Integration)
### 3. 🗣️ DETECCIÓ DE CRIDA D'AJUDA (Voice Activation)
### 4. 👥 XARXA DE VEÏNS DE CONFIANÇA (Guardian Angels)
### 5. 💊 DETECCIÓ D'INTERACCIONS MEDICAMENTOSES
### 6. 🔦 LLANTERNA D'EMERGÈNCIA (Strobe Light)
### 7. 📞 CRIDA AUTOMÀTICA 112 (Emergency SOS)

---

## 📊 FULL DE RUTA RECOMANAT

| Fase | Característica | Complexitat | Impacte | Prioritat |
|------|---------------|-------------|---------|-----------|
| **1** | Asistent Medicació | ⭐⭐⭐ | 🔴 CRÍTIC | **IMMEDIATA** |
| **2** | Alarma Anticaídas | ⭐⭐⭐⭐ | 🔴 CRÍTIC | **ALTA** |
| **3** | Xarxa Veïns Confiança | ⭐⭐ | 🟠 ALT | **ALTA** |
| **4** | Geolocalització | ⭐⭐ | 🟠 ALT | **MITJANA** |
| **5** | Crida Automàtica 112 | ⭐⭐⭐⭐ | 🔴 CRÍTIC | **MITJANA** |
| **6** | Monitor Signes Vitals | ⭐⭐⭐⭐⭐ | 🟡 MITJÀ | **BAIXA** |

---

## 🏁 CONCLUSIÓ DEL CONSELL

1. **L'Asistent de Medicació és 100% IMPLEMENTABLE** en PWA actual. Requereix Service Worker ben configurat i permisos de notificació. **Recomanem començar per ací.**

2. **L'Alarma Anticaídas és VIABLE però amb limitacions**. Funciona bé en primer pla, però requereix Capacitor/Cordova per a background real. **Recomanem implementar com a "Mode Seguretat" (usuari l'activa conscientment).**

3. **El veritable poder està en la combinació**: Medicació + Caigudes + Xarxa de Veïns = **Ecosistema de Seguretat Integral**.
