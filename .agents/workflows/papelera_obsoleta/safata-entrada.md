> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/safata-entrada.md`

---
description: Habilidad (Skill) para depositar siempre los archivos y entregables finales en una carpeta visible del usuario, evitando rutas ocultas de sistema.
---

# 📥 Skill: Safata d'Entrada (Bandeja de Entrada)

**Problema:** Antigravity, por su naturaleza de IA, guarda sus pensamientos y artefactos (archivos Markdown, imágenes temporales) en el directorio oculto `.gemini/antigravity/brain/<uuid>`. Esto frustra al usuario "Mestre", que tiene que bucear en carpetas del sistema para encontrar los entregables que le sirven para su trabajo real.

**Solución Inquebrantable:**
A partir de ahora, **TODO archivo, informe, imagen final o documento que el usuario deba ller, usar o subir a otra plataforma (como NotebookLM o redes sociales)** DEBE copiarse obligatoriamente a una carpeta visible en la raíz del proyecto llamada `_safata_entrada` (o creada si no existe). El guión bajo asegura que aparezca siempre la primera en la lista de carpetas.

### Reglamentos de Uso:
1. Sí, tus artefactos internos (task.md, drafts) siguen yendo a tu `brain`. Es tu espacio de trabajo.
2. PERO, el producto final que pides al usuario que lea o use, **debe ser enviado a `_safata_entrada/` usando comandos de terminal (`cp`) o creándolo directamente allí.**
3. Cuando notifiques al usuario (`notify_user`) de que un archivo está listo, envíale a buscarlo a `_safata_entrada/nombre_archivo.ext`, NUNCA a `.gemini/...`.
4. **EXCEPCIÓN CRÍTICA (Auditorías):** Los documentos de auditoría (prompts, informes, resultados) **NUNCA** van a la bandeja de entrada. Tienen su propio flujo en la carpeta `auditorias/` para no colapsar la bandeja general. La bandeja de entrada es para archivos no clasificados o entregables de otro tipo.

*Esta regla aplica a Sóc de Poble y a cualquier otro proyecto donde el usuario requiera archivos resultantes.*
