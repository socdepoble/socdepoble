# RESULTADOS FASE 5 OCCIDENTE - SIMULACIÓN DE CRISIS (GEMINI, GROK, LE CHAT)

Los tres supervivientes han lanzado su respuesta conjunta, abordando escenarios de crisis letales para el sistema offline-first rural:

## 1. GROK: Ensamblaje del Tractor y Meshtastic LoRa
Ha resuelto el escenario de un "apagón total en el valle" utilizando el hardware abierto de **Meshtastic**.
- **Gateway ESP32 (`main.cpp`)**: Escucha los mensajes parseados de LoRa y guarda el CRDT binario en local (LittleFS).
- **Puente Meshtastic (`meshtastic_python.py`)**: Usa la interfaz de Python de Meshtastic para conectarse al ecosistema MESH, emitir paquetes `wantAck=True` a todas las masías del valle, y enrutarlos al ESP32.
- **Compilación Ofuscada (`compile.sh`)**: Script con `esbuild` y `PlatformIO` para minificar el TypeScript y el Service Worker y flashearlo (OTA o USB) directo a la Flash del microcontrolador.

## 2. GEMINI: Trellat Sybil Firewall
Defensa matemática contra una invasión de bots o inyección masiva de basura en el P2P:
- **Reputación Matemática**: Calcula un *Score* de cada nodo `(uptime / (connections + 1))` para despriorizar nodos recientes o ruidosos.
- **Filtro Criptográfico Estricto**: Valida la firma ECDSA del CRDT con `crypto.subtle`.
- **Cierre Rápido de Conexión**: Aborta inmediatamente el intento de conexión si el tamaño de los CRDTs inyectados superan un límite o la reputación es baja, evitando el desbordamiento de la base de datos OPFS (ataques de llenado de disco).

## 3. LE CHAT (MISTRAL): Mecanismo Anti-Brick (Safe Mode)
Prevé el escenario terrorífico: una actualización "al vuelo" del genoma PWA tiene un bug y el agricultor abre la app para ver una pantalla blanca (WSOD) sin forma de recargar porque no hay internet.
- Guarda un **CSS y HTML de emergencia (`/safe-mode.html`)** inalterables durante la instalación inicial del Service Worker.
- El evento `fetch` intercepta peticiones a `style.css` y `index.html`. Si la promesa original (la PWA moderna) falla por un error de ejecución o crasheo, inyecta sin preguntar el HTML de emergencia.
- Este Safe Mode tiene un botón de "Restaurar" que purga toda la caché corrupta y recarga todo desde cero (rollback).
