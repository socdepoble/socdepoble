> 📂 **Arxiu/Ruta:** `./auditories/260409_1120_R2_01_Qwen_Arquitectura_Global.md`

# 🔍 RONDA 2: INVESTIGACIÓN CRUZADA (Qwen #1)
*(Transcripció de la resposta a la Llave Maestra)*

---

### 1) La Memoria del Silicio (Y.js WAL)
Qwen ha aterrizado el concepto con pseudo-código real: crea un adaptador `YjsWalAdapter`.
- **Lógica**: En vez de dejar que Y.js crezca en RAM, guarda cada cambio en trozos (chunks de 50 ops) en IndexedDB.
- **Snapshot V2**: Cuando llega a 200 operaciones, purga el historial, hace un "Snapshot" comprimido con formato V2 binario (40% más pequeño) y borra el registro de operaciones.
- **Veredicto**: Con esto limitamos forzosamente la RAM de Safari a 150MB como pico. No se caerá el iPad.

### 2) El Vínculo Pasivo (BLE y Background en Apple)
**El Muro:** Qwen confirma apoyándose en los Apple Developer Forums que **NO HAY API Web Bluetooth web en iOS**. Una PWA pura no puede usar el BLE del iPad. Punto. Además, iOS mata la PWA a los 3 minutos si está en background.
**La Solución Híbrida:** Propone envolver la PWA de Sóc de Poble en una carcasa (Shell) Nativa minúscula en Swift. 
- La carcasa viva en background gestiona el Bluetooth.
- La PWA se comunica con la carcasa nativa mediante un esquema de URL personalizado (`sdp-native://ble/send`) e inyección de JS. Así mantenemos el código en web pero el Bluetooth lo lanza Swift.

### 3) El Puente Legal (WhatsApp Oficial)
- Aclara que librerías como *Baileys* o *whatsapp-web.js* en 2025/2026 están super vigiladas mediante *fingerprinting* y no tienen salvación oficial. O te banean o te banean.
- Propone **WhatsApp Cloud API** puro con el "Human-in-the-loop" Bridge.
- **Apertura Legal**: Subraya una estrategia genial. Bajo la *Ley 11/2022 de Servicios Digitales* española y la reciente DMA europea, si registramos el servidor (Nodo Llavador) como servicio de utilidad pública/emergencia rural sin ánimo de lucro, Meta podría no cobrarnos los tramos y darnos estatus oficial.

### 4) DAFO Holístico
Ha completado rigurosamente el DAFO valorando la Soberanía Tecnológica, asumiendo brillantemente que "Descentralizar Y.js aumenta la soberanía, pero depender de una envoltura en Swift añade un eslabón tecnológico delicado de mantener".
