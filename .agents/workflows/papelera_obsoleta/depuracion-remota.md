---
description: Habilidad (Skill) para recordar y ejecutar el protocolo de Depuración Remota de Android (A54) a través de Chrome en Mac (USB o Inalámbrico) para cazar bugs de UI/UX persistentes o afectados por cachés PWA.
---
# Protocolo de Depuración Remota (Mobile Chrome Inspector)

## Objetivo
Cuando Sóc de Poble sufra bugs visuales exclusivos de teléfonos móviles que no puedan reproducirse en el entorno de escritorio del Mac (por ejemplo, conflictos con el teclado virtual `100dvh`, medidas seguras de pantalla `pt-safe`, o Service Workers atrapados en caché agresiva), Antigravity usará este protocolo para guiar al usuario a conectar el móvil.

## 1. Conexión Física o Inalámbrica
- **Cable (Recomendado):** Activar "Depuración por USB" en las Opciones de Desarrollador del teléfono y seleccionar el modo de USB a "Transferir ficheros / Android Auto".
- **Inalámbrico (Plan B):** Activar "Depuración inalámbrica". Tomar nota de la IP y Puerto principales (ej. `192.168.0.17:43997`). En el Mac, ingresar a `chrome://inspect/#devices`, clic en **Configure...** (bajo *Discover network targets*) y añadir ahí la IP:Puerto.

## 2. El Bug del Aviso de Android (El Popup Rebelde)
Chrome y el Mac necesitan permisos explícitos (RSA) para entrar al móvil. Android DEBE mostrar un popup en pantalla pidiendo confirmación. Si no sale:
- Hacer clic en "Revocar autorizaciones de depuración por USB" en el móvil.
- Sacar y meter el cable.
- Asegurarse de estar en el Escritorio del móvil con la pantalla encendida (no dentro de Ajustes, que bloquea popups de seguridad).

## 3. Esquivar el Caché y Ceguera de Incógnito
- **AVISO CRÍTICO:** Las pestañas de Incógnito en Android NO son rastreables en `chrome://inspect` por protección del SO.
- **La Solución (Caché Buster Master):** El usuario debe abrir la web con el bug en una pestaña **Normal** en el móvil. Luego, en el Mac, dar a "Inspect". Ahí ir a la pestaña **Application > Storage > Clear site data**. Re-cargar (Cmd+R). El caché local del móvil muere al instante, mostrando el código real de SiteGround.

## 4. Integración MCP (Chrome DevTools Protocol)
En el Mac, dentro de la ventana del inspector remoto de Chrome, existe el Checkbox **"Allow remote debugging for this browser instance"**. Activarlo expone la instancia a conexiones CDP (Chrome DevTools Protocol) permitiendo a sub-agentes de Inteligencia Artificial conectarse (vía MCP) a ese puerto para escanear el HTML, realizar capturas o inyectar código directamente si la arquitectura de red local lo soporta.
