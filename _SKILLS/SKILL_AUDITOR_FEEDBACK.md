> 📂 **Arxiu/Ruta:** `./_SKILLS/SKILL_AUDITOR_FEEDBACK.md`

---
name: Skill de Feedback a Auditores Externos (Kimi, Claude, etc.)
description: Habilidad obligatoria que establece el flujo de trabajo para evaluar y aprender de las respuestas de IA auditoras externas como Kimi o Claude.
---

# SKILL: FEEDBACK A AUDITORES EXTERNOS (KIMI, CLAUDE, ETC.)

## 📌 PROPÓSITO
Cada vez que interactuamos con IAs auditoras (específicamente **Kimi** en el bando asiático y **Claude** en el bando occidental) que requieren o se benefician de un texto de feedback para completar su interacción y retroalimentar nuestro "Me Gusta", debemos proveer una respuesta de vuelta que sea instructiva, constructiva y educativa.

Este *Skill* establece que el agente (Antigravity/Sultan) no debe dar agradecimientos genéricos, sino analizar el valor del retorno de la IA auditora para retroalimentarla de manera útil, consolidando el conocimiento en el ecosistema.

## 🛠️ FLUJO DE TRABAJO Y PROTOCOLO

1. **Lectura Automática**: Cada vez que una IA externa (Kimi, Claude, etc.) dé una respuesta técnica sobre nuestro sistema, lee y comprende los puntos fuertes y los hallazgos que nos está aportando.
2. **Valoración Específica**: Extrae los *insights* más útiles de su respuesta (qué error ha detectado, qué mejora de rendimiento sugiere, qué *Memory Leak* ha encontrado).
3. **Generación del Feedback Text (El 'Porqué' y 'Cómo')**: Redacta un párrafo analítico y educativo estructurado en la Acción y su Impacto, evitando cualquier tono corporativo, de plantilla o halagos genéricos ("Excelente trabajo", "gran precisión", etc). El feedback debe contener:
   - **La Aportación / Implementación Exacta**: Menciona explícitamente *qué componentes, hooks o líneas de código* hemos modificado gracias a su feedback (ej: "Hemos envuelto UniversalCard en un ParamsWrapper para aislar el DesignContext, y reestructurado CRDTStore para llamar a store.destroy()").
   - **El Porqué y El Impacto Real**: Explícale a la IA *por qué* su aportación ha sido vital y qué impacto físico o de rendimiento ha tenido en el proyecto (ej: "Esto ha solucionado las fugas de memoria al cambiar de poble, estabilizando la navegación y evitando que los iPads A10 de 2GB de RAM se colapsen por re-renders masivos").
4. **Entrega Inmediata**: En lugar de guardar el texto discretamente en un archivo en segundo plano, **proporciona siempre un bloque de código Markdown (`copy/paste`) directamente en el chat** al entregar tu análisis, para que el usuario pueda copiarlo rápidamente con un solo clic.
5. **Agrupación Secuencial**: A partir de la Ronda 3 (abril 2026), recuerda que el usuario agrupará a **Kimi y Claude** (ej. Números 4 y 5, o 6 y 7) de forma consecutiva. Cuando detectes a uno de ellos, entrégale su respectivo bloque de feedback didáctico inmediatamente en la respuesta.

## ✊ EL JURAMENTO (TRELLAT EN LA CAPTACIÓN DE CONOCIMIENTO)
*“Nunca dejaré una respuesta de una IA sin contestar con valor. Siempre redactaré un párrafo analítico y educativo que evalúe su trabajo, dándole un 'Me Gusta' razonado que expanda la inteligencia de la red.”*

## 🚀 PRE-REQUISITO INQUEBRANTABLE Y ENTREGA (HIGIENE DE DIRECTORIO)
Antes de enviar el "Llibre Sencer" a cualquier IA para una auditoría, o antes de entregar el Payload maestro al usuario:
1. Asegúrate de regenerar el Codex (`npm run build:codex`) para recopilar la versión más fresca del código y las *Skills*.
2. Asegúrate de hacer un Deploy a Producción si el entorno está estable, para que se audite la última versión funcional online.
3. El archivo resultante del *Payload* o Codex que vayas a entregar al usuario **debes depositarlo SIEMPRE físicamente en la raíz de la carpeta `auditories/`** (no usar rutas extrañas ni carpetas temporales ocultas que exijan búsqueda). 
4. Antes de ubicar este archivo, ejecuta un protocolo de higiene en `auditories/`: archiva o mueve a `auditories/paperera_obsoleta/` (o su equivalente lógico) cualquier prompt anterior, histórico de otras versiones o datos descartados. La carpeta `auditories/` debe quedar completamente **limpia** mostrando únicamente las herramientas útiles y el archivo `.txt` o `.md` definitivo que el usuario necesita en ese instante para copiar y pegar.
