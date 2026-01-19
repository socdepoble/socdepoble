# Sóc de Poble: Visión Original vs Prototipo Actual

> **Documento de Análisis** - Mapeo entre la visión de 2013 y la implementación de 2026

---

## 🎯 La Visión Original (2013)

### Concepto Central

**"Portal de Pobles Connectats"** - Una xarxa social descentralitzada de programari lliure per connectar i geolocalitzar recursos d'utilitat social en entorns rurals.

### Valores Fundacionales

1. **Programari Lliure** - Código abierto, modificable, distribuible
2. **Modularitat** - Sistema extensible por módulos
3. **Descentralització** - Instalable en servidores propios o nodos locales
4. **Privacitat** - El usuario controla su información

### Audiencia

- **160.000+ seguidores** en Facebook identificados con "Ser de Poble"
- **Personas** que valoran sostenibilidad y desarrollo rural
- **Grups** d'acció local (asociaciones, colectivos)
- **Empreses** rurales que quieren visibilidad
- **Col·laboradors** del grupo de trabajo

---

## 📊 Comparativa: Visión Original vs Prototipo Actual

### ✅ Módulos IMPLEMENTADOS (Prototipo 2026)

| Módulo Original | Estado Actual | Notas |
|----------------|---------------|-------|
| **Gestor de Perfils** | ✅ Implementado | Sistema multi-identidad (gent, grups, empreses, oficial) |
| **Directori de Pobles** | ✅ Implementado | Página Towns con búsqueda y fichas |
| **Mòdul Social** | ✅ Parcial | Feed con filtros por rol, conexiones (antes likes) |
| **Viver d'Emprenedors** | ✅ Parcial | Mercado local con categorías |
| **Missatgeria** | ✅ Implementado | Chat en tiempo real con Supabase Realtime |
| **Traductor** | ✅ Implementado | 5 idiomas (VA, ES, GL, EU, EN) |
| **Comentar** | 🟡 Pendiente | Estructura preparada, falta UI |
| **Connectar** | ✅ Implementado | Sistema de "Conexiones" (reemplaza likes) |

### 🔴 Módulos NO IMPLEMENTADOS (Pendientes)

| Módulo Original | Prioridad | Complejidad |
|----------------|-----------|-------------|
| **Mapa Col·laboratiu** | 🔴 Alta | Alta |
| **Geolocalització de Recursos** | 🔴 Alta | Alta |
| **Gestor de Recursos** (Docs, Imatges, Vídeos) | 🟡 Media | Media |
| **Connector Web** (Bookmarklet) | 🟢 Baja | Baja |
| **Marcar** (Guardar para después) | 🟡 Media | Baja |
| **Publicar/Compartir** en otras redes | 🟡 Media | Media |
| **Plantilles i Fitxes** (Botànica, Patrimoni, etc.) | 🔴 Alta | Alta |
| **Gestor d'Etiquetes Col·laboratiu** | 🟡 Media | Media |
| **Motor de Recerca** avanzado | 🟡 Media | Media |
| **Calendari** (Google Calendar sync) | 🟢 Baja | Media |
| **Arxiu de Recursos** | 🟢 Baja | Baja |
| **Revista Digital** | 🟡 Media | Media |
| **Bases de Dades Obertes** (Meteo, Transport, etc.) | 🔴 Alta | Alta |

---

## 🎨 Diferencias Clave de Enfoque

### Visión Original (2013)
- **Descentralizada** - Cada pueblo puede tener su propio nodo
- **Programari Lliure** - Código abierto desde el inicio
- **Geolocalización central** - Mapa como eje vertebrador
- **Productividad** - Herramienta de trabajo para grupos
- **Integración** - Conectar con Google Drive, Dropbox, Calendar

### Prototipo Actual (2026)
- **Centralizada** - Una sola instancia en Supabase
- **Código cerrado** (por ahora) - Repositorio privado
- **Red social primero** - Feed, chat, mercado como ejes
- **Simplicidad** - MVP funcional sin complejidad técnica
- **Stack moderno** - React, Vite, Supabase (no PHP/MySQL)

---

## 🗺️ El Gran Ausente: El MAPA

### En la Visión Original

El **Mapa Col·laboratiu** era el **corazón del sistema**:

> "MAPEIG COL·LECTIU dels RECURSOS LOCALS. Es podrà introduir i geolocalitzar qualsevol informació, idea o proposta d'utilitat social (projectes, esdeveniments, flora, fauna, vies pecuàries, rutes, informació d'incendis i altres catàstrofes en temps real, comercialització de xicotets excedents, banc de temps, etc.)"

**Casos de uso:**
- Geolocalizar patrimonio natural (árboles monumentales, fauna)
- Marcar rutas y vías pecuárias
- Alertas en tiempo real (incendios, catástrofes)
- Banc de temps (intercambio de servicios)
- Comercialización de excedentes agrícolas
- Eventos y actividades locales

### En el Prototipo Actual

❌ **No existe** - Es la funcionalidad más importante que falta

**Impacto:**
- Sin mapa, el proyecto pierde su diferenciación clave
- No se puede "conectar recursos" geográficamente
- No hay visualización del territorio
- Falta la integración con Bases de Datos Abiertas

---

## 📋 Módulos Originales Detallados

### 1. Mapa Col·laboratiu + Bases de Dades Obertes

**Descripción original:**
Combinar recursos locales con datos abiertos de:
- Meteorologia
- Transport
- Salut
- Nomenclàtors
- Equipaments
- Economia
- Turisme
- Cartografia
- Estadístiques

**Estado:** ❌ No implementado

**Propuesta de implementación:**
- Usar Leaflet o Mapbox para el mapa
- Integrar APIs de datos abiertos (AEMET, INE, etc.)
- Permitir a usuarios añadir marcadores con categorías
- Sistema de capas (patrimonio, rutas, eventos, etc.)

---

### 2. Gestor de Recursos

**Descripción original:**
- Documents (Google Drive, Dropbox)
- Llocs i Rutes (geolocalitzats)
- Esdeveniments (calendari)
- Imatges, Vídeos, Música
- Integració amb serveis externs

**Estado:** 🟡 Parcialmente implementado
- ✅ Imatges (en posts y market)
- ❌ Documents
- ❌ Llocs i Rutes
- ❌ Esdeveniments
- ❌ Vídeos i Música
- ❌ Integració externa

---

### 3. Plantilles i Fitxes

**Descripción original:**
Formularios especializados para catalogar:
- Llocs (patrimonio, comercios)
- Rutes (senderismo, cicloturismo)
- Botànica (flora local)
- Animals (fauna)
- Patrimoni (edificios, monumentos)
- Banc de Temps (servicios)
- Calendari Agrícola
- Receptes (gastronomía)
- Diccionari (léxico local)
- Dites i Refranys

**Estado:** ❌ No implementado

**Nota:** El sistema actual de "Léxico" en la base de datos es un inicio, pero falta la UI y las demás plantillas.

---

### 4. Motor de Recerca + Directori Temàtic

**Descripción original:**
- Etiquetatge col·laboratiu
- Etiquetes anidades (ej: Patrimoni Natural → Arbres monumentals)
- Directori temàtic creat por usuarios
- Búsqueda avanzada

**Estado:** 🟡 Parcial
- ✅ CategoryTabs (filtro básico por rol)
- ❌ Etiquetas colaborativas
- ❌ Etiquetas anidadas
- ❌ Directorio temático
- ❌ Búsqueda avanzada

---

### 5. Connector Web (Bookmarklet)

**Descripción original:**
Botón instalable en el navegador para añadir enlaces externos al sistema con un clic.

**Estado:** ❌ No implementado

**Complejidad:** Baja - Es un simple bookmarklet JavaScript

---

### 6. Marcar (Guardar para después)

**Descripción original:**
- Marcar publicaciones para leer más tarde
- Etiquetar y clasificar contenido marcado
- Organización personal

**Estado:** ❌ No implementado

**Nota:** Similar a "favoritos" pero para posts, no solo market items.

---

### 7. Revista Digital

**Descripción original:**
Publicación curada con:
- Contenido del Grup de Treball
- Aportaciones de usuarios alineadas con valores del proyecto
- Formato revista/blog

**Estado:** ❌ No implementado

**Propuesta:** Podría ser una sección "Destacados" o "Editorial" en el Feed.

---

## 🚀 Roadmap Propuesto: De Prototipo a Visión Completa

### Fase 1: Consolidar el Prototipo (Actual)
**Objetivo:** Tener un MVP sólido y funcional

- [x] Chat en tiempo real
- [x] Feed con multi-identidad
- [x] Mercado local
- [x] Sistema de pueblos
- [x] Internacionalización
- [ ] Comentarios en posts
- [ ] Compartir en redes sociales
- [ ] Notificaciones básicas

---

### Fase 2: El Mapa (Crítico)
**Objetivo:** Implementar el corazón del proyecto original

**Módulos:**
1. **Mapa base** con Leaflet/Mapbox
2. **Geolocalización de recursos**
   - Patrimonio natural
   - Patrimonio cultural
   - Rutas y caminos
   - Eventos
3. **Capas temáticas**
4. **Integración con datos abiertos** (AEMET, etc.)

**Estimación:** 3-4 semanas de desarrollo

---

### Fase 3: Plantillas y Fichas
**Objetivo:** Catalogación estructurada de recursos

**Módulos:**
1. **Plantilla de Lloc** (lugar de interés)
2. **Plantilla de Ruta**
3. **Plantilla de Botànica**
4. **Plantilla de Patrimoni**
5. **Banc de Temps**
6. **Calendari Agrícola**
7. **Receptes**
8. **Ampliar Diccionari/Léxico**

**Estimación:** 2-3 semanas

---

### Fase 4: Gestor de Recursos Avanzado
**Objetivo:** Gestión completa de contenidos

**Módulos:**
1. Upload de documentos (PDF, etc.)
2. Galería de imágenes mejorada
3. Vídeos (integración YouTube/Vimeo)
4. Integración Google Drive/Dropbox
5. Calendari (Google Calendar sync)

**Estimación:** 2-3 semanas

---

### Fase 5: Productividad y Colaboración
**Objetivo:** Herramientas para grupos de trabajo

**Módulos:**
1. **Marcar** (guardar para después)
2. **Etiquetatge col·laboratiu**
3. **Motor de recerca** avanzado
4. **Arxiu de recursos**
5. **Connector Web** (bookmarklet)
6. **Revista Digital** (sección curada)

**Estimación:** 3-4 semanas

---

### Fase 6: Descentralización (Visión a largo plazo)
**Objetivo:** Cumplir con el principio de descentralización

**Módulos:**
1. **Nodos locales** - Cada pueblo puede tener su instancia
2. **Federación** - Comunicación entre nodos (ActivityPub?)
3. **Código abierto** - Liberar el repositorio
4. **Documentación** para instalación y mantenimiento

**Estimación:** Proyecto a largo plazo (meses)

---

## 💡 Reflexiones y Recomendaciones

### Lo que el Prototipo hace BIEN

1. **Stack moderno** - React + Supabase es mucho más mantenible que PHP/MySQL
2. **Multi-identidad** - El sistema de entidades es más elegante que el original
3. **Realtime** - El chat funciona perfectamente con WebSockets
4. **Internacionalización** - 5 idiomas desde el inicio
5. **Mobile-first** - Diseño responsive desde el principio

### Lo que FALTA para cumplir la Visión

1. **El Mapa** - Es crítico, es el 50% del valor diferencial
2. **Geolocalización** - Sin esto, no es "Pobles Connectats"
3. **Plantillas** - Para catalogar patrimonio, rutas, flora, fauna
4. **Productividad** - Herramientas para grupos de trabajo
5. **Descentralización** - Filosofía de software libre

### Propuesta de Prioridades

**Corto plazo (1-2 meses):**
1. ✅ Consolidar prototipo actual
2. 🗺️ **Implementar el Mapa** (crítico)
3. 📝 Plantillas básicas (Lloc, Ruta, Patrimoni)

**Medio plazo (3-6 meses):**
4. 🔍 Motor de búsqueda avanzado
5. 📚 Gestor de recursos completo
6. 🏷️ Etiquetatge colaborativo

**Largo plazo (6-12 meses):**
7. 🌐 Descentralización y nodos
8. 📖 Código abierto
9. 🔗 Integración con bases de datos abiertas

---

## 🎯 Conclusión

El **prototipo actual** es un excelente punto de partida que moderniza la tecnología del proyecto original. Sin embargo, para ser fiel a la **visión de 2013**, necesita:

1. **El Mapa** como eje central
2. **Geolocalización** de recursos
3. **Plantillas** para catalogación estructurada
4. **Herramientas de productividad** para grupos

El camino está claro: consolidar lo que tenemos, añadir el mapa, y luego ir implementando módulos según la demanda de los usuarios.

**La pregunta clave:** ¿Queremos replicar toda la visión original, o adaptar solo lo más relevante para 2026?

---

## 📚 Referencias

- **Proyecto Original:** https://socdepoble.net/el-projecte/
- **Rentonar:** https://rentonar.blogspot.com/
- **Facebook:** 160.000+ seguidores "Sóc de Poble"
- **Año de inicio:** 2013 (11 años de trayectoria)
