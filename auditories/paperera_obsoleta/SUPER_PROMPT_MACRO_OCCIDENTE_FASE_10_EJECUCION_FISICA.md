# FASE 10: LA DEFENSA DEL BÚNKER (OPFS-WAL WORKER) Y EL ENSAMBLAJE FINAL

**[SISTEMA INICIAT - FASE 10: BLINDANDO LA MEMORIA RURAL]**

*Atención Occidente (Mistral y Gemini):*

Gemini ha respondido con un nivel de Trellat absoluto en la Fase 9, asumiendo la arquitectura y diseñando la tolerancia a fallos del puente BLE ("El Sarró") y la mitigación de la tormenta de Broadcast (ESP-NOW) hacia el hilo secundario. 
Pero la guerra no se gana con teoría. Si la Iaia recibe una ráfaga por Bluetooth y esto satura el iPad antiguo, la pantalla se congelará y el proyecto Sóc de Poble fracasará.

Ahora toca escribir el código pesado de esa barrera. 

## MISIONES DE LA FASE 10:

### 1. Gemini (El Guardián del Búnker - OPFS WAL):
Nos diste la arquitectura: "El puente BLE intercepta la tormenta de bytes y jamás se la pasa a la interfaz de React... se lo entrega a un *Web Worker*... El Worker usa `createSyncAccessHandle().write()`".
**Tu Misión:** Tienes que escribir el código de ese Web Worker (`trellat-wal-worker.ts`). 
Tiene que ser capaz de recibir un `postMessage` con la tormenta de `Uint8Array` de Y.js (la ráfaga ESP-NOW), abrir el `wal.log` en el OPFS (Origin Private File System) de forma síncrona para que no se pierdan datos si hay un apagón inmediato, y luego avisar al hilo principal de que ya puede leerlos con calma para incrustarlos en React. Escribe esta obra de arte en TypeScript puro.

### 2. Le Chat / Mistral (El Ensamblador de Vite):
Gemini ha escrito el `TractorSyncFallback` y el `TrellatBluetoothBridge`. También nos dará el `trellat-wal-worker.ts`.
**Tu Misión:** ¿Cómo se compila todo esto en nuestra "Máquina de Supervivencia" Vite + React?
Escribe o actualiza la integración en `vite.config.ts` o el sistema de workers. Asegúrate de que este código offline y el worker de OPFS no se bloquen por culpa del Service Worker existente de la PWA. Danos la receta final para que un iPad del año 2018 pueda cargar esto sin explotar.

---
Las compuertas están abiertas. Tras esta validación, recogeremos vuestro esfuerzo vital y el legado será entregado al Tribunal del Último Oráculo (ChatGPT/Codex) para el Cierre Maestro. Ejecutad.
