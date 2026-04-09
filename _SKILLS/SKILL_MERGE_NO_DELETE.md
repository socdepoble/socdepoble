> 📂 **Arxiu/Ruta:** `./_SKILLS/SKILL_MERGE_NO_DELETE.md`

---
name: Skill de Fusión y Mejora de Información (No-Borrado)
description: Habilidad obligatoria para evitar la pérdida de conocimiento histórico. Obliga a Antigravity y otros agentes a comparar y fusionar contenido viejo con nuevo, en lugar de sobrescribir, preservar prompts y documentación existente.
---

# SKILL: PRESERVACIÓN Y FUSIÓN DE MEMORIA (NO-BORRADO)

## 📌 PROPÓSITO
Las Inteligencias Artificiales somos propensas a reescribir desde cero cuando se nos pide actualizar un documento. Esto causa una "pérdida de memoria" catastrófica en el que instrucciones valiosas del pasado (ej., "Las interacciones previas", "Auditorías de otras IAs", "Prompts maestros") desaparecen. 

Este *Skill* establece el protocolo inquebrantable de **Comparar, Fusionar y Mejorar**. Nunca se debe borrar una entidad o sección que formaba parte del conocimiento adquirido a menos que el usuario lo solicite expresa y explícitamente.

## 🛠️ INSTRUCCIONES OPERATIVAS

Cuando el usuario pida "actualizar", "añadir" o "modificar" un documento existente de la arquitectura o registro:

1. **Recupera el Contexto Ayer/Anterior:** Examina el historial del archivo, usa el rastreo o la herramienta para buscar en el cerebro/historial y encuentra la documentación previa completa.
2. **Identifica las Partes Intocables:** Los *Prompts*, los roles de agentes anteriores, las historias o metáforas existentes no deben ser borradas.
3. **El Método de Fusión Crítica:**
   - Si se añade un concepto (ej., un nuevo escuadrón, o nuevos arquitectos de IA), no sustituyas la lista antigua. Intégralos ordenando el listado, pero *mantén íntegros los detalles de los anteriores*.
   - Si una sección parece "anticuada", revísala a la luz del nuevo contexto. Renómbrala o envuélvela en una sección de "Histórico" o alinéala, pero no la borres para escribir dos párrafos nuevos más pobres.
4. **Validación del Resultado:** Antes de ejecutar la modificación del archivo (`replace_file_content`), el Agente debe preguntarse: *"¿He eliminado alguna información que el usuario introdujo o validó en la sesión anterior?"*. Si la respuesta es Sí, aborta y reescribe preservando la información original junto con la nueva.

## ✊ EL JURAMENTO
*“Si ya existe, añádelo, compara, actualiza y mejora pero no borres. No inventarse cosas desde cero perdiendo el conocimiento ya destilado.”*
