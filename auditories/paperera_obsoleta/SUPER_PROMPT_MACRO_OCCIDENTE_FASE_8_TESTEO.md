# FASE 8: VALIDACIÓN FÍSICA Y TESTEO DE SUPERVIVENCIA (LA PRUEBA DEL ALGODÓN)

**Atención Equipo (Grok, Gemini, Le Chat):**

Le Chat ha puesto sobre la mesa las cuatro pruebas de fuego definitivas:
1. **Las antenas LoRa en campo abierto.**
2. **El compilado Vite con el Panic Timer estático.**
3. **El Vault de identidad ECDSA + OPFS.**
4. **El despliegue en ESP32 con Protobufs optimizados.**

Como marca el *Trellat*: **No elegimos; lo probamos todo.** Un diseño sobre papel no vale nada si no sobrevive a la humedad del campo y a la corrupción de la memoria.

## Misión de la Fase 8 (Tanda 18):

Necesito los **Protocolos de Validación y Scripts de Testeo** para certificar que el ensamblaje de la Fase 7 es indestructible. Dividid el trabajo para darme las pruebas exactas que debo ejecutar en mi entorno local y físico:

* **Grok (Prueba Física Malla LoRa y ESP32)**: Dame el protocolo de prueba en campo. ¿Cómo mido la pérdida de paquetes (Packet Loss) y el RSSI real a 15km usando el ESP32 y la antena Yagi de 10 elementos? Escribe un script en Python o un sketch extra para el ESP32 que actúe como "Ping de la Muerte" enviando CRDTs masivos para saturar el ancho de banda de 125kHz y verificar que el decodificador Protobuf-Light no se ahoga.
* **Le Chat (Prueba del Fósil Vite y Pánico)**: Escribe una batería de pruebas end-to-end (ej. un script de Playwright o Cypress) que bloquee deliberadamente el hilo principal de React en el navegador (`while(true)`) para certificar físicamente que el `<trellat-panic-timer>` inyectado por tu plugin de Vite salta a los 4.5s exactos, purga el Service Worker y rescata la pantalla.
* **Gemini (Prueba del Vault y Sybil)**: Escribe el test unitario (ej. en Vitest/Jest) que simule una interrupción de energía (cerrando abruptamente la pestaña o simulando un fallo de I/O) justo en medio de la transacción de SQLite OPFS. Demuéstrame matemáticamente que la identidad ECDSA del *Vault* no se corrompe y que el Kademlia Firewall frena las recargas masivas post-apagón.

**Directiva Activa**: Menos teoría, más pruebas destructivas. Dadme el código y los pasos para intentar derribar nuestro propio Mas Digital. Si no logramos romperlo nosotros, nadie podrá.
