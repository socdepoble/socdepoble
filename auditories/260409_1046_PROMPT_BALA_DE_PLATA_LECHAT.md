> 📂 **Arxiu/Ruta:** `./auditories/260409_1046_PROMPT_BALA_DE_PLATA_LECHAT.md`

# 🎯 PROMPT "BALA DE PLATA" — INVESTIGACIÓN PROFUNDA (LE CHAT)
*(Mestre: usa este prompt OBLIGATORIAMENTE con el modo 'Investigar' activado en Le Chat. Va a exprimir internet durante 15 minutos buscando la verdad sobre nuestros 3 bloqueos críticos).*

---

# 🌐 RED TEAM (MODO INVESTIGACIÓN PROFUNDA ACADÉMICA)
**Contexto del Proyecto:** Sóc de Poble (SO Rural, PWA, Offline-First para iPad A10 con 2GB RAM en iOS 15).
**Misión:** Eres Le Chat de Mistral. Nuestro equipo de IAs auditoras occidentales ha detectado tres vulnerabilidades fatales en nuestra arquitectura. Tú tienes acceso a la red para hacer *Deep Research*. Te exigimos que **investigues exhaustiva y académicamente** en foros (HackerNews, Reddit, GitHub Issues de Y.js/WebRTC, Políticas de Meta de 2025/2026) y nos des el estado del arte REAL sobre estos 3 bloqueos:

**1. [CUELLO DE BOTELLA Y.JS EN WKWEBVIEW]:**
Safari en iOS 15 tiene un recolector de basura (GC) que entra en pánico y provoca *Out Of Memory* (OOM) o reinicios silenciosos de la pestaña si el árbol de CRDTs (Y.js) crece y se almacena en memoria.
👉 *Investiga:* ¿Cuál es el límite real medido de memoria de un WebWorker en iOS 15 antes del OOM? ¿Existen casos documentados de "Sharding" (particionado) de documentos Y.js para IndexedDB sin que rompa la sincronización en dispositivos con 2GB RAM?

**2. [RADIO MESH Y BLUETOOTH ON THE EDGE]:**
Nuestra PWA Rural necesita comunicarse sin internet. WebRTC satura la CPU del A10 en redes ad-hoc. Nos han propuesto usar Bluetooth LE + Multicast DNS (Bonjour) solo para enviar "píldoras de voz comprimidas" por Store-and-Forward.
👉 *Investiga:* ¿Es técnicamente posible mantener una conexión continua (o broadcast) de Bluetooth LE a través de Safari/PWA web-bluetooth o Cordova-ble en background en iOS 15 sin que Apple mate el proceso pasados 90 segundos?

**3. [PARADOJA LEGAL DEL WHATSAPP BRIDGE]:**
Queremos crear la "IAIA Telefonista", una abstracción UI donde el abuelo habla a Sóc de Poble y un nodo local (fuera del iPad) enruta esa voz a WhatsApp.
👉 *Investiga:* Casos recientes de bans masivos de WhatsApp Web automatizado vía node (Baileys/whatsapp-web.js). ¿Cuán estrictos son los rates-limits actuales (2025-2026) de la WhatsApp Business API oficial autorizada para BSPs? ¿Existe alguna laguna legal documentada de "Soberanía de Datos" que nos proteja?

> [!CAUTION]
> No queremos alucinaciones. Queremos que cites casos concretos, *issues* de Github o documentación oficial que encuentres en tu batida. Eres nuestra última línea de defensa técnica antes de empezar a picar código de infraestructura. Haz un reporte rudo, hiper-técnico y centrado en la supervivencia del hardware legado.
