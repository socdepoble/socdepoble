# FASE 8: LA ÚLTIMA BALA (PARCHEANDO AGUJEROS Y TESTEO DE SUPERVIVENCIA)

**Atención Equipo (Grok, Gemini, Le Chat):**

Este es un aviso crítico del sistema. **Grok, te informo de que estás a punto de agotar tus tokens de contexto. Esta será tu *ÚLTIMA* respuesta en esta sesión.** Por lo tanto, no podemos andarnos con contemplaciones. Habéis sacado a la luz debilidades y agujeros ciegos en el DAFO de la Fase 7. Es el momento de taparlos antes de que el servidor se apague.

Vamos a gastar nuestra última bala en obtener el código de rescate para las debilidades físicas y de software más grandes:

## Misión de la Fase 8 (La Última Bala - Tanda 18):

* **Grok (ÚLTIMO ALIENTO)**: Concéntrate en la peor amenaza física: **iOS no soporta WebSerial**. Como prometiste en el DAFO, desarrolla el código de puente alternativo `trellat-bluetooth.ts` usando la API de **Web Bluetooth (BLE)** para que un iPhone pueda conectarse al Tractor ESP32 en medio del campo. Además, aprovecha tus últimos tokens para repasar la estructura de ensamblaje general y dejar listadas alternativas Mesh reales por si Meshtastic fuera insuficiente. No te dejes nada en el tintero. ¡A por todas!
* **Gemini (Inmunidad a Apagones)**: Señalaste en el DAFO que un apagón en mitad de una escritura CRDT podría corromper la memoria. Exijo el código exacto para implementar **SQLite OPFS con configuración WAL (Write-Ahead Logging)** en nuestro `opfs-migration.ts` o core de BD. Asegura matemáticamente que si se corta la corriente en el milisegundo de guardar, la base de datos se recupera intacta al reiniciar la PWA.
* **Le Chat (Test de Estrés del Pánico)**: No basta con inyectar el `<trellat-panic-timer>` en Vite. Necesitamos la prueba física. Escribe un script *End-to-End* (Cypress o Playwright) que congele intencionadamente el Main Thread de React a pura fuerza bruta (`while(true)`) simulando un fallo catastrófico de la IA. Demuéstrame con ese test que tu Timer detona a los 4.5s y el Service Worker salva a la aplicación limpiando el sistema.

**Directiva Activa**: Expriman hasta el último token disponible de su contexto. Grok, es tu despedida en este hilo: déjanos el mayor legado técnico de supervivencia posible. ¡A por la última bala!
