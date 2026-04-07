# 🚨 CÓDIGO ROJO: FALLO GRAVE DE SINCRONIZACIÓN (SKILLS vs GENOTIPO)

**Para:** Equipo Global de IAs (Occidentales y Asiáticas) | **Prioridad:** Bloqueante (No podemos avanzar a la visión de futuro hasta resolver esto).

## 1. EL PROBLEMA (El Síntoma)

En el entorno local de desarrollo, el usuario (Archon) está viendo que la página principal del proyecto (`llibre-sencer.html`, nuestro "Genotipo Sintético" que es la fuente de verdad) **solo tiene 192 páginas**, en lugar de las **~400 páginas originales** que debería tener con toda nuestra sabiduría inyectada.

El usuario percibe que **no somos capaces de sincronizar nuestro propio archivo de Skills (el código y las directivas cognitivas)** con la página web (`llibre-sencer.html`). Pareciera que mostramos "backups" antiguos en lugar de la versión viva. Este es un fallo de arquitectura inaceptable.

## 2. EL DIAGNÓSTICO (Lo que he descubierto al auditar)

He rastreado el problema y no es que estemos mostrando "backups antiguos" o cachés, sino que nuestro sistema de compilación está roto desde la base por su fragilidad:

1. El script encargado de construir el libro (`scripts/build_amazon_codex.js`) utiliza un **`Array` de rutas estáticas y "harcodeadas"** hacia archivos `.md` concretos.
2. Durante una tarea anterior de auditoría ("Unifying Sóc de Poble Skills"), otra IA movió 200 páginas de flujos de trabajo a una carpeta llamada `.agents/workflows/papelera_obsoleta/`.
3. Como el script de compilación tenía las rutas harcodeadas, **esos archivos simplemente desaparecieron del libro de forma silenciosa**. El libro se recompiló perdiendo la mitad de su genotipo sin que nos diésemos cuenta.
4. Además, hay archivos HTML y MD en la carpeta `_SKILLS` (como `BIBLIA_DEL_SISTEMA.html` o `.antigravity_session_rules.md`) que **nunca se llegan a sincronizar automáticamente** si la IA no recuerda añadirlos al array del script compilador.

## 3. LA MISIÓN: FORJAR UN MOTOR DE SINCRONIZACIÓN INDESTRUCTIBLE

**Sois las encargadas de resolver este problema de base.** El proceso de "pasar un skill a la página web" debería ser fluido y automático.

Necesito que diseñéis (e implementéis en vuestra respuesta) una solución definitiva para asegurar que `llibre-sencer.html` ESTÉ SIEMPRE SINCRONIZADO con TODOS los skills y directivas, sin que una ruta mal escrita destruya el Códice.

**Requisitos para la solución:**
1. **Dinamismo Absoluto:** El script compilador (`build_amazon_codex.js` u otro mecanismo que creéis) DEBE leer *dinámicamente* el contenido completo de las carpetas de conocimiento (`_SKILLS/`, `.agents/`, `.antigravity_session_rules.md`, etc.), buscar todos los `.md` y `.html`, y fusionarlos. Nunca más arrays harcodeados.
2. **Soporte para HTML Skill:** Si hay un archivo `BIBLIA_DEL_SISTEMA.html`, su cuerpo HTML debe inyectarse directamente, igual de bien que se inyectan los `.md`.
3. **Flujo de desarrollo transparente:** El Arquitecto Humano debe poder editar o añadir un archivo de extensión `.md` o `.html` en la carpeta `_SKILLS` y saber que **automáticamente** aparecerá en `llibre-sencer.html`.

### 👉 Pregunta y Acción para las IAs
*¿Por qué nos cuesta tanto sincronizar dos páginas web (El Skill y el Llibre Sencer)? Analizad nuestro fallo arquitectónico. Descartad este fallo de base y proporcionad el código y la arquitectura del nuevo motor de compilación unificado que garantice nuestras 400 páginas íntegras.*

> **🎙️ REFLEXIÓN DIRECTA DE ARCHON (El Creador Humano):**  
> *"Si vuestro skill es ya una página web (`BIBLIA_DEL_SISTEMA.html`), ¿por qué la escondéis en carpetas ocultas o privadas en lugar de hacerla pública nativamente? Si al final no escondemos nada, si la dejáis en `public/`, cualquiera que entre igual verá un diseño crudo o feo, pero sería infinitamente más fácil de sincronizar. ¿Voy por buen camino? Pensad en esto."*  
> **(IAs, evaluad esta reflexión de Archon en vuestra respuesta. ¿Deberíamos mover los skills a la carpeta `public/` y que sean servidos como rutas independientes además de ensamblarse en el Códice, o compromete la directiva de un solo Genotipo monolítico?)**
> 
> **(Por último, IAs, confirmad en vuestra respuesta inicial si necesitáis que se abra un nuevo chat para refrescar el contexto o si estáis al filo del colapso, tal cual marca nuestra 'Guía 6 de Supervivencia IA'. Si es así, despedíos y pasaremos el relevo a un nuevo hilo fresquito, ya que estamos en la recta final.)**
