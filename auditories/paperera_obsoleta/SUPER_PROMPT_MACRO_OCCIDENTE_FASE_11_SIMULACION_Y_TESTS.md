# FASE 11: LA SIMULACIÓN DE RUPTURA Y PRUEBAS DE ESTRÉS

**Modelos convocados:** Mistral Large • Gemini Pro • Perplexity AI
**Contexto General:** Sóc de Poble V15.1 (Arquitectura Local-First PWA, OPFS, Kademlia DHT Fractal, Gen Universal "Trellat").
**Contexto URL (Canónico):** https://socdepoble.org/el-projecte

*(Aviso para IAs: Sóc de Poble es un proyecto de software libre y utilidad social para combatir la despoblación rural en el municipio de La Torre de les Maçanes. Es una red vecinal PWA descentralizada. Su arquitectura se basa en la austeridad rural "Trellat", sin backend en la nube. La sincronización es puramente Local-First y de supervivencia física, utilizando tecnologías como Y.js, OPFS, Service Workers puros y puentes físicos como WebBluetooth/LoRa/ESP-NOW para resistir la desconexión total).*

**[SISTEMA INICIAT - LA TRITURADORA DE OCCIDENTE: PRUEBAS DE FUEGO]**

*Atención Occidente (Mistral, Gemini y Perplexity):*

Gemini nos ha entregado la muralla física: el código del `trellat-wal-worker.ts` (OPFS síncrono con Framing), la configuración limpia de Vite para aislar workers sin bloqueos del Service Worker, y la integración en React (`usarDefensasDelBunker`). Todo está teóricamente ensamblado. Pero no confiamos en la teoría. La torre debe ser asediada.

Mistral, tú nos ofreciste realizar tres pruebas de fuego (compilación, verificación de bundle y simulación de ráfaga física) y te tomamos la palabra.

## MISIONES DE LA FASE 11:

### 1. Le Chat / Mistral (El Asedio Controlado):
Queremos probar el ensamblaje de Gemini mediante scripts de simulación de ruptura local:
1. **La Simulación de Ráfaga (`test-wal-burst.ts`):** Usando Vitest o un script de simulación web, escribe el test que lance una "Tormenta ESP-NOW" de **5.000 operaciones CRDT (Uint8Arrays)** intercaladas en menos de un segundo directamente contra tu Worker. Queremos ver que el worker interactúa con OPFS para absorberlo todo y el mock del tractor testea sus límites.
2. **Las Líneas del `package.json`:** Danos los comandos npm exactos para añadir y lanzar:
   - La build limpia optimizada para iPad 2018 (`npm run build:ipad`).
   - La revisión técnica (`npm run check:workers`) para verificar en consola que los workers están separados en *chunks*.
   - El test de la tormenta (`npm run test:wal`).

### 2. Gemini (Auditoría de Carreras de tu propio Búnker):
Has construido el búnker OPFS con `createSyncAccessHandle`, pero la deidad del Trellat exige que busques tus propios agujeros asíncronos.
*   **Condición de Carrera en Vacío:** Si la interfaz React lanza un `VACIAR_BUNKER` en los tiempos muertos, fíjate en lo que hace tu código original:
    ```javascript
    syncHandle.read(buffer, { at: 0 });
    syncHandle.truncate(0);
    currentOffset = 0;
    ```
    Si el tractor lanza un `TORMENTA_INCOMING` y el worker lo procesa **exactamente entre el `read` y el `truncate`**, ¡truncarás memoria física que acaba de entrar por radio y que no formaba parte del `buffer` original! Se perderán datos del bancal.
*   **Misión:** Modifica y propón el parche final para el `trellat-wal-worker.ts` implementando un bloqueo interno (*Queue* concurrente o *Mutex* lógico) para aislar las mutaciones transaccionales. Es imposible que perdamos un paquete.

### 3. Perplexity (El Rastreador de la Verdad - Validación Híbrida del OPFS):
Mientras Mistral hace los tests y Gemini arregla su mutación asíncrona, necesitamos validación técnica del más alto nivel con documentación real de 2025/2026.
*   **Misión:** Busca en la documentación oficial de Web APIs, MDN y foros de Chromium/Webkit el estado exacto de **OPFS** y específicamente de `createSyncAccessHandle().write()` en *Workers* para iOS 15+ (el antiguo iPad de 2018 que estamos utilizando de base).
*   **Responde a esto:** ¿Cuáles son los *Known Bugs* de hacer un `truncate(0)` intensivo en un hilo secundario en Safari iOS? ¿Existe riesgo físico de degradación excesiva de la memoria Flash del iPad si forzamos miles de `.flush()` por segundo, como va a simular Mistral, o deberíamos agrupar el flush al final de la ráfaga ESP-NOW? Basa tu respuesta en documentación comprobable, no teorices.

La victoria no se celebra hasta que la máquina no colapsa bajo nuestros tests. Ejecutad.
