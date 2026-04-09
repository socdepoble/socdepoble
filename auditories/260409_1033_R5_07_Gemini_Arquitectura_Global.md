> 📂 **Arxiu/Ruta:** `./auditories/260409_1033_R5_07_Gemini_Arquitectura_Global.md`

# 🔴 AUDITORÍA RED TEAM — SÓC DE POBLE v10.38.1 (Gemini #7)
*(Extracte de la resposta de Gemini a l'auditoria global)*

---

## 1. AUDITORÍA TÉCNICA: CUELLOS DE BOTELLA + ARQUITECTURA WHATSAPP BRIDGE

**Y.js + WebRTC en iPad A10:**  
- **Cuello crítico:** El GC frecuente por el shadow tree de DOM y la saturación de conexiones WebRTC en mesh >4.  
- **Mitigación propuesta:** *Compaction de CRDTs* periódica, limitar historial a 30 días en IDB, y usar **Bluetooth Classic + Multicast DNS (Bonjour)** para discovery, dejando IP webRTC solo para fallback.

**WhatsApp Bridge – Arquitectura anti-baneo:**  
- **NO usar reverse engineering.** Usar WhatsApp Business API.  
- Ejecutar un WebWorker en background local con `waha` fork, guardando mensajes en crudo en CRDTs temporales.  
- Transcripción Voice-to-Text completamente local vía ONNX TinyLlama (4-bit, 280MB).

---

## 2. TRES FUNCIONALIDADES NUEVAS RADICALES 

1. **"Màquina de Confiança" – Verificador Físico de Llavors:** Cámara + ONNX MobileNetV3 para verificar semillas contra base de datos. Detecta falsificación y emite vibración de alerta.  
2. **"SOS Inèrcia + Testigo Vivo":** Detección de caídas. Si no hay respuesta, graba audio de 15s + foto, emite beep 90dB y hace broadcast P2P BLE al vecino. Acceso manual a la tablet vía un QR físico en la puerta de la masía.  
3. **"Bancal Haptic + IA del Suelo":** Poner el iPad boca abajo en la tierra; usar micrófono para captar frecuencia acústica de tierra húmeda (TinyML) + temp de chip como proxy de humedad. Cero sensores externos.

---

## 3. CRÍTICA AL SISTEMA DE PLANTILLAS

Faltan **dos arquetipos imprescindibles** para ruralidad extrema:
- **Arquetipo "Acció":** (Flujo de Trabajo). Estados atómicos, checklist duro, haptics, protocolo de fumigación. Todo con rollback CRDT en caso de error.  
- **Arquetipo "Sensor":** (Datos en tiempo real). Para sondas BLE, pluviómetros, con sampling adaptativo de batería y `content-visibility`.

---

## 4. ANÁLISIS DAFO HOLÍSTICO 

*(Revisar arxiu original per a detalls del DAFO: Soberania heredada, problemàtica de mantenir ONNX Locals, Fons europeus 2026).*
