> 📂 **Arxiu/Ruta:** `./auditories/260409_1028_R5_05_Claude_Arquitectura_Global.md`

# 🔴 AUDITORÍA RED TEAM — SÓC DE POBLE v10.38.1 (Claude #5)
*(Extracte complet del Mestre de la fase de validació)*

---

## 1. CUELLOS DE BOTELLA TÉCNICOS + ARQUITECTURA WHATSAPP BRIDGE

### Y.js / WebRTC en iPad A10 (2GB RAM)

**Problemas reales:**
- **Y.js + awareness en mesh P2P**: Solución: desactivar `awareness` por defecto y solo activarlo en sesiones de edición colaborativa explícita. Usa `Y.UndoManager` solo cuando el usuario esté activo.
- **WebRTC en iOS WKWebView**: Recomendación: usa **BLE (Core Bluetooth via Capacitor plugin)** como canal primario para el mesh de pueblo pequeño (<50 nodos), y WebRTC solo como fallback cuando hay Wi-Fi ad-hoc real. BLE es mucho más predecible en batería y latencia para texto corto.
- **IDB + Y.js persistence**: Fix: fuerza los snapshots solo con `visibilitychange → hidden` (app a background).

### WhatsApp Bridge — Arquitectura Anti-Baneo
El riesgo real no es técnico, es legal y de ToS. Aquí el enfoque pragmático por capas:
**Capa 1 — whatsapp-web.js / Baileys (self-hosted):** El anciano vincula su número UNA SOLA VEZ. El bridge corre en un servidor propio (Raspberry Pi en el ayuntamiento).
**Capa 2 — Anti-detección:** El bridge NO responde automáticamente sin confirmación humana.
**Capa 3 — Fallback Signal:** Si Meta banea el número, el bridge ya tiene el grafo de contactos. Migración a Signal.
**Capa 4 — Modo Isla Total:** IDB local y sincronización difenrida.

---

## 2. TRES FUNCIONALIDADES RADICALES NUEVAS

### 🌿 F1 — "Oïdor de Camp" (Diagnóstico Fitosanitario por Audio Ambiente)
El iPad analiza en local con TFLite (<8MB) audios de *Xylella* o trips.

### 🆘 F2 — "Testament Digital Oral" (Voluntats Anticipades per Veu)
Graba un "testament de coneixement" estructurado por voz cifrado en IDB + QR físico (termoplástico).

### 🌡️ F3 — "Xarxa de Sensors Humans" (Telemetria Agroclimàtica Distribuïda)
Cada agricultor confirma con 1 tap ("Gelada / Pluja"). Genera dataset climático hiperlocal exportable a AEMET/Copernicus.

---

## 3. CRÍTICA AL SISTEMA DE PLANTILLAS

### 🎙️ Arquetipo Faltante: **"Conversacional / Oràcul"**
Interfaz de *diálogo guiado por voz*, efímero y secuencial (turno a turno). La unidad de UX es el **turno de habla**. Imprescindible para: IAIA Telefonista, Burocracia Zero, SOS Anticaídas. Burbuja de transcripción + botón PTT + feedback háptico.

---

## 4. ANÀLISI DAFO HOLÍSTIC
*(Revisar text original per a detalls del DAFO: fons europeus, bus factor de Javi, sobirania de dades i Apple WKWebView).*
