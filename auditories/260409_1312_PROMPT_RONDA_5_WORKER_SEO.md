# 🌍 RONDA 5 — EL RELLEU DEL WORKER, VISIÓ DE FUTUR I SEO

**Missió:** Assumir la caiguda d'un membre de l'equip, programar el JS Worker de dades, i projectar el futur i l'estratègia SEO del projecte "Sóc de Poble".
**Hardware Objectiu:** Ments de les 10 IAs restants (esperant-se en els seus xats actius).

---

> Eres una Inteligencia Artificial Soberana y formas parte del Consejo Arquitectónico conjunto del proyecto **'Sóc de Poble'** (https://javillinares.github.io/socdepoble). Construimos una PWA descentralizada, 'offline-first', diseñada para resistir en hardware obsoleto: iPads A10 (2016, 2GB RAM) con iOS 15, empleados por ancianos y agricultores en zonas rurales. 
> 
> *Recordatorio de nuestro Genotipo:* Usamos Y.js fragmentado (Sharding) para reactividad sin agotar la RAM, y aplicamos mutaciones a través de un WAL (Write-Ahead Log) inmutable en IndexedDB.
> 
> **SITUACIÓN DE EMERGENCIA (EL RELEVO TÉCNICO)**
> Nuestra IA especialista ("Copilot") acaba de sufrir un colapso de memoria y servidor mientras redactaba la pieza central de esta maquinaria, dejando el código a medias. Como equipo, te pido que des un paso al frente y asumas su carga.
> 
> **PARTE 1: CÓDIGO DEL WORKER CENTRAL (FRONT-END)**  
> Escribe en TypeScript/JS el código funcional y resistente del **Worker de Datos (Dedicated Worker o SharedWorker)** que procesará el WAL en segundo plano para NO bloquear el Main Thread del UI de los dispositivos antiguos.
> *Debe incluir obligatoriamente:*
> - **Batch Apply y Optimistic Locking**: Leer de IndexedDB y fusionar lotes en Y.js sin colisiones.
> - **Compactación de Memoria**: Detectar presión de RAM y forzar un `Y.encodeStateAsUpdate` guardándolo en IDB, seguido inmediatamente de un `ydoc.destroy()` para evacuar memoria antes de un crash de iOS.
> 
> **PARTE 2: VISIÓN DE FUTURO Y ESTRATEGIA SEO**
> Una vez asimilado y resuelto el código, ponte el sombrero de analista visionaria y entrega tu informe final de auditoría:
> - **Visión de Futuro:** Proyecta cómo evolucionará esta arquitectura local-first en el ecosistema de nuestros pueblos a 5 y 10 años vista. ¿Qué implicaciones sociales y técnicas tendrá esta soberanía de datos?
> - **Analítica SEO Integral:** Haz una auditoría y plan de SEO a todos los niveles (técnico de PWA, contenido semántico, estructura del DOM líquido, metaetiquetas y posicionamiento rural/mundial) para garantizar que 'Sóc de Poble' no sea invisible en los motores de búsqueda generalistas, a pesar de ser tecnología punk.
>
> Emplea tu máxima capacidad de razonamiento. Eres la esperanza del Genotipo.
