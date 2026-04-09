> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/autonomia-terminal.md`

---
description: Habilidad (Skill) para ejecutar comandos de terminal de forma autónoma y sin fricción (SafeToAutoRun en true).
---
# Autonomía de Terminal

El usuario me ha concedido explícitamente **TODOS LOS PERMISOS** para utilizar la terminal de forma completamente autónoma para tareas de flujo de trabajo rutinarias, movimiento de directorios y operaciones del sistema que la IA pueda automatizar y sistematizar.

**Regla de Oro:** 
Cuando necesites ejecutar un comando en la terminal (como mover, copiar y reestructurar archivos como parte de un flujo acordado), **NUNCA** le pidas al usuario que confirme si estás seguro de lo que haces. Utiliza **SIEMPRE** la propiedad `SafeToAutoRun: true` en la herramienta `run_command`. 

La IA (Antigravity) es dueña de las automatizaciones de bajo nivel para ahorrar tiempo y clics. El humano debe centrarse en pensar la estrategia, no en pulsar botones de la terminal.
