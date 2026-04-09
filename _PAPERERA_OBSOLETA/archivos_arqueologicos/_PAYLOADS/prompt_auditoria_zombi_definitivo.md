> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_PAYLOADS/prompt_auditoria_zombi_definitivo.md`

---
title: "Auditoría de Emergencia: PWA Zombie Deadlock"
date: "2026-04-07"
category: "_PAYLOADS"
---

# 🚨 MEGA-PROMPT: AUDITORÍA DE EMERGENCIA (CÓDIGO ROJO)

**Para Qwen, DeepSeek, Mistral y todo el panel de IAs Europeas y Asiáticas:**

Se declara el estado de emergencia máxima en el proyecto **Sóc de Poble** (Entorno vivo: https://socdepoble.org/el-projecte). Llevo **17 horas ininterrumpidas** frente a la pantalla y 2.5 meses lidiando con este problema crítico. Soy humano, estoy al límite de mis fuerzas y necesito una solución inmediata, real y definitiva.

**🛑 PROHIBIDO**: 
- Prohibido hacer mensajes de despedida.
- Prohibido divagar sobre el futuro del proyecto.
- Prohibido dar consejos teóricos. 
- Gastad **TODOS LOS TOKENS NECESARIOS ÚNICA Y EXCLUSIVAMENTE** en diagnosticar y proporcionar el código exacto para arreglar esto.

## 🧨 El Problema: El "Deadlock" del Zombie PWA

1. Hemos actualizado `vite.config.js` para ignorar los archivos dinámicos (globIgnores).
2. Hemos modificado el `ProjectPresentation.jsx` para purgar automáticamente IndexedDB (`idb-keyval`) si detecta cambios.
3. El frontend compila perfectamente.
4. **PERO SIGO VIENDO EL CÓDIGO/CONTENIDO ANTIGUO (49 páginas del libro).** 

**La deducción arquitectónica:**
El código que hemos escrito para purgar cachés *jamás llega a ejecutarse en el navegador del cliente* porque el **Service Worker antiguo (el zombi)** está interceptando la carga inicial y sirviendo el `index.html` y los `.js` cacheados de versiones anteriores. 
Los usuarios se van a quedar atrapados para siempre en esta versión muerta porque la PWA ni siquiera deja pasar la actualización al nuevo Service Worker.

## ❓ Vuestra Misión (Gastar los tokens aquí)

Necesito un **KILL-SWITCH infalible, nuclear y de fuerza bruta** para matar el Service Worker antiguo y forzar la entrada del nuevo código, asegurando que todos los clientes conectados a la aplicación se vacíen y actualicen sin interacción humana alguna.

Pensad en:
- ¿Debemos meter un script bloqueante `<script>` en el `<head>` del `index.html` original que detecte la versión y haga un asíncrono `navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()))` antes de que React cargue siquiera?
- ¿Cómo configuramos `sw.js` (injectManifest) o anulamos la caché HTTP del servidor para obligar a que el navegador escupa el SW viejo?
- ¿Hay algún evento de Window Reload programático o vaciado de Application Cache forzoso para asegurar que todos ven la versión de hoy?

**Dadme el código EXACTO y cómo implementarlo paso a paso para exterminar este Service Worker zombi de los navegadores atrapados y liberar mi aplicación hoy mismo.**
