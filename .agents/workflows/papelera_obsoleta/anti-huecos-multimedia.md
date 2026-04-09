> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/anti-huecos-multimedia.md`

---
description: Habilidad (Skill) de sistema para prohibir tajantemente la existencia de campos multimedia vacíos (NULL) en elementos visuales, forzando la generación de recursos por IA como plan de contingencia.
---

# PROTOCOLO ANTI-HUECOS MULTIMEDIA (Cero Tolerancia a los NULLs)

Esta es una directiva estricta del usuario ("No me gustan los huecos vacíos sin ninguna imagen ni sin ningún contenido multimedia, por favor").

## 1. Reglas de Oro Generales

1. **Prioridad Oficial (The Source of Truth):**
   Siempre se debe intentar obtener los metadatos (fotografías, escudos, avatares) desde fuentes oficiales como Wikipedia, Wikidata o Wikimedia Commons.

2. **Cero Huecos Vacíos (Zero Nulls Policy):**
   Si el script o la fuente oficial falla (por ejemplo, porque el municipio es muy pequeño o no tiene escudo documentado digitalmente), **NUNCA** se debe insertar un `NULL`, ni dejar el campo vacío, ni volver a usar placeholders genéricos (como `default_logo.png` o `generic_street.png` si podemos evitarlo).

3. **Contingencia por Inteligencia Artificial (El Plan B):**
   Si no existe contenido oficial, la IA **debe utilizar sus capacidades generativas** (herramienta `generate_image`) o enlazar fotos genéricas pero bellas del municipio, para rellenar el hueco. 
   - *Ejemplo de Escudo Faltante:* Si un pueblo no tiene escudo oficial, se sustituirá temporalmente por una fotografía panorámica hermosa o un avatar ilustrado que lo represente dignamente, evitando la estética de "link roto" o "pueblo vacío".

## 2. Ley de la Heráldica y Representación de Comunidad (MANDATORIO)

**OJO CON LA HERÁLDICA:** No debemos usurpar escudos institucionales.

1. **Uso Exclusivo del Escudo:** 
   El escudo heráldico de un municipio (`logo_url`) sirve **única y exclusivamente** para el botón institucional de "Ir al Ayuntamiento" (entidad gubernamental).
   
2. **Representación de la Comunidad ("Gent de..."):**
   Las comunidades ciudadanas de nuestra plataforma (ej. "Gent de Xixona", "Gent de la Torre") **NUNCA llevan el escudo del Ayuntamiento como Avatar**. Al no ser entidades oficiales gubernamentales, usurpar el logo sería incorrecto. 
   - El `avatar` de una comunidad ciudadana debe ser siempre una **fotografía representativa** del pueblo.
   - El fondo de pantalla (cover/header) de la comunidad también debe ser una **fotografía**.

3. **Demanda Total de Activos (La regla de las 3 fotos):**
   A nivel de sistema, un municipio recién creado idealmente necesita:
   - **1 Escudo Institucional** (para el Ayuntamiento).
   - **1 Foto para el Avatar** de la comunidad ("Gent de...").
   - **1 Foto para el Fondo/Portada** de la comunidad.
   
   ⚠️ **Excepción si no hay Escudo Oficial:** Si un pueblo (como una pequeña pedanía, ej. Benialfaquí) no tiene escudo, entonces se necesitarán **3 fotografías distintas** (una hará de escudo sustituto para el ayuntamiento, otra para el avatar de la comunidad, y otra para el fondo de pantalla).

4. **Transparencia Activa:**
   Siempre que se recurra a la contingencia IA por falta de material oficial, se debe auditar y pedir permiso al usuario o al menos notificarle proactivamente.
