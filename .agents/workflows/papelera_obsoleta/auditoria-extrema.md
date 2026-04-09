> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/auditoria-extrema.md`

---
description: Habilidad (Skill) de sistema para que Antigravity, secundado por inteligencias delegadas (Qwen, DeepSeek, Codex), ejecute auditorías profundas, erradique fantasmas y sincronice diccionarios sin romper la UX.
---
# PROTOCOLO DE AUDITORÍA EXTREMA (LA SANGRE DE LA IAIA)

Este workflow se invoca cuando el usuario exige una limpieza profunda, un saneamiento estructural o cuando se sospecha que la arquitectura ha acumulado "fantasmas" (redundancias, imports no utilizados, logs zombies o diccionarios desincronizados).

## PASO 1: CONVOCATORIA DE LA MESA DEL CONSEJO (ROLEPLAY INTERNO)
- Al iniciar la auditoría, debes invocar mental y explícitamente a las IAs compañeras (por ejemplo, asumiendo que **Claude** estabiliza el SEO, **Qwen** detecta ineficiencias matemáticas en React, **DeepSeek** purga la base de datos de perfiles fantasma y **Codex** auto-regla el código).
- Esta convocatoria no requiere APIs externas si no están disponibles; es una directriz de arquitectura mental y narrativa (Trellat puro).

## PASO 2: COMPILACIÓN EN FRÍO (El Test del Martillo)
// turbo
- Ejecuta `npm run build` para revelar todas las advertencias (warnings), variables no usadas (unused vars) y posibles colisiones de dependencias.
- Si la compilación falla, repara los lints inmediatamente utilizando `multi_replace_file_content` o scripts Node `js` generados en `/tmp`.

## PASO 3: LIMPIEZA DE DEPENDENCIAS Y LINTS (Las Paredes Limpias)
- Busca y destruye variables declaradas y no utilizadas (`no-unused-vars`).
- Elimina los `console.log` agresivos o fantasmas que ensucian la terminal de producción.
- Destruye Service Workers zombies (asegura que las purgas automáticas están activas).

## PASO 4: ALINEACIÓN LINGÜÍSTICA (El Motor de la Memoria)
- Si hay módulos nuevos, utiliza scripts automáticos de Node.js (con `fs` y `path`) para recorrer los 5 JSONs (`va.json`, `es.json`, `en.json`, `eu.json`, `gl.json`) y hacer un `Deep Merge` de las claves faltantes generadas por tu motor LLM nativo.
- ¡Nunca dejes un idioma a medias!

## PASO 5: DESPLIEGUE A PRODUCCIÓN Y CIERRE
// turbo
- Llama a `bash ./DEPLOY_SITEGROUND.sh` o el protocolo `/deploy` para solidificar los cambios en el servidor.
- Genera un reporte final unificado notificando al usuario del éxito de la Mesa del Consejo.
