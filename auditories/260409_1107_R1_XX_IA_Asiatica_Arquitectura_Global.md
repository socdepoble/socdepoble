> 📂 **Arxiu/Ruta:** `./auditories/260409_1107_R1_XX_IA_Asiatica_Arquitectura_Global.md`

# 🔴 AUDITORÍA RED TEAM — SÓC DE POBLE v10.38.1 (IA Asiática - DeepSeek/Kimi)
*(Transcripció enviada pel Mestre de la primera ronda)*

---

### 1) Desmontando la Red P2P en iOS 14
Esta auditoría ha soltado la bomba técnica más realista hasta la fecha sobre el hardware de Apple:
- **Restricción Nativa WiFi:** iOS NO expone APIs para Wi-Fi P2P en web. `MultipeerConnectivity` es exclusivo para apps nativas de Swift. Una PWA está ciega en esto.
- **Restricción WebRTC:** iOS 14 en Safari estrangula el `RTCDataChannel` a paquetes de 16KB y el *backpressure* revienta el event loop.
- **Veredicto P2P:** La radio de audio en Mesh es inviable en vivo. Debe hacerse mediante grabación cruda local (`MediaRecorder`) troceada y enviada asíncronamente como fragmentos de fichero.

### 2) Las Tres Funcionalidades
1. **Calibración Háptica del Terreno:** El acelerómetro lee la vibración del tractor, y devuelve toques en pantalla simulando la dureza del suelo. Feedback sin mirar.
2. **Lector de Crotales (Etiquetas Ganaderas) OCR Offline:** Usa cámara + TensorFlow SSD MobileNet. Identifica los 15 dígitos de la oreja de la vaca sin internet, crucial para la ley de trazabilidad del Ministerio (RD 728/2019).
3. **Alerta Sísmica Inercial:** `DeviceMotionEvent` captando >0.8g salta el silenciador, enciende el flash LED (`torch`) y pita al máximo.

### 3) El Arquetipo Faltante: "WIZARD RÚSTICO"
Confirma unánimemente lo que dijo Qwen, Copilot y ChatGPT. No vale un documento ni un Gantt: hace falta un asistente paso a paso.
- Usa `JSON Schema` con saltos condicionales (`oneOf`) renderizado con `content-visibility: auto`.
- Evita que el abuelo se bloquee con la PAC (Política Agrícola Común). Persiste cada paso suelto en `localStorage`.
