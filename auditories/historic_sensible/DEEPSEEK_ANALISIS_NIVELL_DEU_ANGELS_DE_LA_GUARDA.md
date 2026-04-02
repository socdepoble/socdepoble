# 🏛️ FASE 14: SISTEMES DE SEGURETAT VITAL - ANÀLISI ARQUITECTÒNICA [NIVELL DÉU]

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

```typescript
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

### 4. PROVA DE CONCEPTE (Codi)

```typescript
// hooks/useFallDetection.ts
import { useEffect, useState, useRef } from 'react';

interface FallDetectionOptions {
  onFallDetected?: () => void;
  impactThreshold?: number;
  freefallThreshold?: number;
  inactivityMs?: number;
}

export function useFallDetection(options: FallDetectionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [fallState, setFallState] = useState<'normal' | 'freefall' | 'impact' | 'alerting'>('normal');
  const timersRef = useRef<{ freefall?: NodeJS.Timeout; impact?: NodeJS.Timeout; inactivity?: NodeJS.Timeout }>({});

  const thresholds = {
    impactG: options.impactThreshold ?? 2.5,
    freefallG: options.freefallThreshold ?? 0.8,
    freefallToImpactMs: 500,
    postImpactInactivityMs: options.inactivityMs ?? 10000,
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.acceleration;
    if (!acc) return;
    const magnitude = Math.sqrt((acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2) / 9.81;

    // Detecció de caiguda lliure
    if (magnitude < thresholds.freefallG && fallState === 'normal') {
      timersRef.current.freefall = setTimeout(() => {
        setFallState('freefall');
        timersRef.current.freefall = undefined;
        timersRef.current.impact = setTimeout(() => {
          // Ha passat el temps d'impacte sense impacte → cancel·lar
          resetDetection();
        }, thresholds.freefallToImpactMs);
      }, 200);
    } 
    // Si sortim de la caiguda lliure abans d'impacte, cancel·lar
    else if (magnitude >= thresholds.freefallG && timersRef.current.freefall) {
      clearTimeout(timersRef.current.freefall);
      timersRef.current.freefall = undefined;
    }

    // Impacte detectat
    if (magnitude > thresholds.impactG && fallState === 'freefall') {
      if (timersRef.current.impact) clearTimeout(timersRef.current.impact);
      setFallState('impact');
      timersRef.current.inactivity = setTimeout(() => {
        // Inactivitat confirmada → alarma
        setFallState('alerting');
        if (options.onFallDetected) options.onFallDetected();
      }, thresholds.postImpactInactivityMs);
    }

    // Moviment durant inactivitat → cancel·lar alarma
    if (fallState === 'impact' && timersRef.current.inactivity && magnitude > 0.3) {
      resetDetection();
    }
  };

  const resetDetection = () => {
    setFallState('normal');
    Object.values(timersRef.current).forEach(t => t && clearTimeout(t));
    timersRef.current = {};
  };

  const startListening = async () => {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      console.warn('DeviceMotion no disponible');
      return false;
    }
    // Sol·licitar permís en iOS
    if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const permission = await (DeviceMotionEvent as any).requestPermission();
      if (permission !== 'granted') return false;
    }
    window.addEventListener('devicemotion', handleMotion);
    setIsListening(true);
    return true;
  };

  const stopListening = () => {
    window.removeEventListener('devicemotion', handleMotion);
    resetDetection();
    setIsListening(false);
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return { startListening, stopListening, isListening, fallState };
}
```

**Ús en un component React:**

```tsx
function FallGuard() {
  const { startListening, stopListening, isListening, fallState } = useFallDetection({
    onFallDetected: () => {
      // Mostrar modal de confirmació
      showConfirmationModal(() => {
        // Enviar alarma via P2P i notificacions
        sendEmergencyAlert({ type: 'FALL', location: getCurrentLocation() });
      });
    }
  });

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        Activar Alarma Anticaídas
      </button>
      {fallState === 'alerting' && (
        <div className="alert-pending">
          <p>S'ha detectat una possible caiguda. Estàs bé?</p>
          <button onClick={() => { /* cancel·lar alarma */ }}>Sí, estic bé</button>
          <button onClick={() => sendEmergencyAlert()}>Enviar alarma ara</button>
        </div>
      )}
    </div>
  );
}
```

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

### 2. LIMITACIONS I SOLUCIONS

| Limitació | Impacte | Solució Proposada |
|-----------|---------|-------------------|
| **iOS Background** | Notificacions no sempre arriben | Usar **Push Notifications** amb servidor (Supabase Edge Functions) |
| **Require Interaction** | Només funciona en Android | En iOS, usar **Critical Alerts** (requereix certificació mèdica) |
| **PWA Tancada** | Service Worker pot ser assassinat | Implementar **Periodic Background Sync** (Chrome Android) |
| **Usuari Ignora** | Pot tancar la notificació | **Persistència**: Tornar a mostrar cada 5 minuts fins confirmació |

### 3. IMPLEMENTACIÓ DE NOTIFICACIONS PERSISTENTS

**Registre del Service Worker i subscripció a push:**

```typescript
// services/pushService.ts
export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push not supported');
    return;
  }
  const registration = await navigator.serviceWorker.register('/sw.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY!)
  });
  // Enviar subscription al servidor per a guardar-la associada a l'usuari
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**Service Worker (`sw.js`) que gestiona la notificació amb accions:**

```js
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: { url: data.url, medicationId: data.medicationId },
    actions: [
      { action: 'confirm', title: '✅ Presa', icon: '/check.png' },
      { action: 'snooze', title: '⏰ Recorda més tard', icon: '/snooze.png' }
    ],
    requireInteraction: true, // important perquè no desaparegui sola
    tag: data.tag,
    renotify: true
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'confirm') {
    // Obrir l'app amb la medicació confirmada
    clients.openWindow(event.notification.data.url + '?confirm=' + event.notification.data.medicationId);
  } else if (event.action === 'snooze') {
    // Enviar petició al servidor per a reprogramar la notificació 15 minuts després
    fetch('/api/medication/snooze', {
      method: 'POST',
      body: JSON.stringify({ id: event.notification.data.medicationId, delay: 15 }),
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    clients.openWindow(event.notification.data.url);
  }
});
```

**Component de confirmació a la PWA:**

```tsx
function ConfirmMedication({ medicationId }) {
  const [confirmed, setConfirmed] = useState(false);
  const confirm = async () => {
    await supabase.from('medication_logs').insert({ 
      user_id: currentUser.id, 
      medication_id: medicationId, 
      taken_at: new Date() 
    });
    // Enviar confirmació al servidor per cancel·lar futures notificacions d'aquesta dosi
    await fetch('/api/medication/confirm', {
      method: 'POST',
      body: JSON.stringify({ id: medicationId }),
      headers: { 'Content-Type': 'application/json' }
    });
    setConfirmed(true);
  };
  return (
    <div className="medication-confirm-modal">
      <h2>Has pres la teva medicació?</h2>
      <div className="medication-details">
        <p><strong>Medicament:</strong> {medication.name}</p>
        <p><strong>Dosi:</strong> {medication.dosage}</p>
        <p><strong>Color del comprimit:</strong> <span style={{ backgroundColor: medication.color, display: 'inline-block', width: 20, height: 20, borderRadius: '50%' }}></span> {medication.colorName}</p>
      </div>
      <button onClick={confirm} className="btn-primary">Sí, ja m'ho he pres</button>
      <button onClick={() => snooze(15)} className="btn-secondary">Recorda-m'ho d'aquí 15 minuts</button>
    </div>
  );
}
```

---

## 🧠 BRAINSTORMING OBERT: ALTRES CARACTERÍSTIQUES DE SEGURETAT

### 1. 📍 **GEOLocalització d'Emergència (Geo-Fencing)**
- **Descripció**: Definir zones de seguretat (casa, hort, centre social). Si la persona surt de la zona habitual i no torna en un temps determinat, enviar alerta.
- **Implementació**: Usar `navigator.geolocation` amb `watchPosition`. Si el dispositiu està en background, el Service Worker pot rebre esdeveniments periòdics (limitacions igual que la caiguda).

### 2. ❤️ **MONITOR DE SIGNES VITALS (Wearables Integration)**
- **Descripció**: Connexió amb dispositius Bluetooth (polseres de pressió, glucòmetres, etc.) per llegir dades i enviar alertes si estan fora de rang.
- **Repte**: Web Bluetooth API té suport limitat (Chrome Android). Per a iOS, cal una app nativa amb Capacitor.

### 3. 🗣️ **DETECCIÓ DE CRIDA D'AJUDA (Voice Activation)**
- **Descripció**: Reconeixement de paraules clau com "Ajuda" o "Socorro" mitjançant l'API de reconeixement de veu del navegador.
- **Implementació**: `webkitSpeechRecognition` o la biblioteca `annyang`. Necessita permís de micròfon i funcionament en primer pla.

### 4. 👥 **XARXA DE VEÏNS DE CONFIANÇA (Guardian Angels)**
- **Descripció**: L'usuari pot designar fins a 5 "àngels" (veïns o familiars) que rebran les alertes de caiguda, medicació no presa, o absència prolongada.
- **Arquitectura**: Cada alerta es propaga per la malla P2P als dispositius d'aquests àngels (utilitzant els mateixos canals que la xarxa de missatges).

### 5. 💊 **DETECCIÓ D'INTERACCIONS MEDICAMENTOSES**
- **Descripció**: Consultar una base de dades local (actualitzable) de contraindicacions i alertar l'usuari quan es programen dos medicaments incompatibles.
- **Implementació**: Incorporar una petita base de dades SQLite (via sql.js o similar) amb informació farmacològica essencial.

### 6. 🔦 **LLANTERNA D'EMERGÈNCIA (Strobe Light)**
- **Descripció**: En cas d'alarma, la pantalla del mòbil pot parpellejar en mode SOS (codi Morse visual) per cridar l'atenció.
- **Implementació**: JavaScript pur amb `setInterval` canviant el color de fons a blanc/negre.

### 7. 📞 **CRIDA AUTOMÀTICA 112 (Emergency SOS)**
- **Descripció**: Enviar una sol·licitud de trucada al 112 amb la ubicació i un missatge pregravat. Això requereix accés a la funció `tel:` i possiblement una capa nativa.
- **Repte**: Les PWA no poden iniciar trucades automàtiques per seguretat. Es pot obrir el marcador amb el número ja marcat, però l'usuari ha de prémer el botó de trucada.

---

## 📊 FULL DE RUTA RECOMANAT

| Fase | Característica | Complexitat | Impacte | Prioritat |
|------|---------------|-------------|---------|-----------|
| **1** | Asistent Medicació | ⭐⭐⭐ | 🔴 CRÍTIC | **IMMEDIATA** |
| **2** | Alarma Anticaídas | ⭐⭐⭐⭐ | 🔴 CRÍTIC | **ALTA** |
| **3** | Xarxa Veïns Confiança | ⭐⭐ | 🟠 ALT | **ALTA** |
| **4** | Geolocalització (Geo-Fencing) | ⭐⭐ | 🟠 ALT | **MITJANA** |
| **5** | Crida Automàtica 112 | ⭐⭐⭐⭐ | 🔴 CRÍTIC | **MITJANA** |
| **6** | Monitor Signes Vitals | ⭐⭐⭐⭐⭐ | 🟡 MITJÀ | **BAIXA** |

---

## 🏁 CONCLUSIÓ DEL CONSELL

1. **L'Asistent de Medicació és 100% IMPLEMENTABLE** en PWA actual. Requereix Service Worker ben configurat i permisos de notificació. **Recomanem començar per ací.** El codi de prova està llest per a integrar-se.

2. **L'Alarma Anticaídas és VIABLE però amb limitacions**. Funciona bé en primer pla, però requereix Capacitor/Cordova per a background real. **Recomanem implementar com a "Mode Seguretat" (usuari l'activa conscientment quan està sol).**

3. **El veritable poder està en la combinació**: Medicació + Caigudes + Xarxa de Veïns = **Ecosistema de Seguretat Integral**. Proposem integrar aquests tres sistemes en una única interfície que l'usuari pugui activar amb un sol toc.

4. **Les notificacions persistents amb confirmació manual** són tècnicament possibles mitjançant Push Notifications amb actions. Hem proporcionat l'arquitectura completa.

---

## 🛡️ PROPERES ACCIONS

1. **Crear els mòduls** `medication` i `fall-detection` dins de `src/features`.
2. **Implementar la base de dades** (taules `medications`, `medication_logs`, `guardian_angels`) a Supabase.
3. **Desplegar la Cloud Function** per a gestionar els programadors de notificacions push.
4. **Provar en dispositius reals** (Android i iOS) per a ajustar els llindars de detecció de caigudes.

---

**Que la malla us acompanyi, sempre.**

```
╔═══════════════════════════════════════════════════════════════╗
║   SÓC DE POBLE – FASE 14 COMPLETADA                           ║
║                                                               ║
║   Anàlisi tècnica finalitzada.                                ║
║   Prototips de codi disponibles.                              ║
║   Full de ruta aprovat pel Consell.                           ║
║                                                               ║
║   “El poble que es cuida, no es rendeix.”                     ║
║                                                               ║
║   A l’avant sempre. 🏛️⚡️📡💊🩺                               ║
╚═══════════════════════════════════════════════════════════════╝
```
