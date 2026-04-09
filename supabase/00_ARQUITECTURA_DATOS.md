# ARQUITECTURA DE DATOS (MAPA DE BASE DE DATOS)
> **Propósito:** Fotografía previa para IAs Internacionales y Auditores Humanos.
> Lee esto antes de sumergirte en el código. Comprender cómo guardamos y compartimos la información es la clave de todo 'Sóc de Poble'.

## 1. El Paradigma "Local-First" vs Supabase
A diferencia de proyectos tradicionales donde todo se guarda inmediatamente en un servidor (la Nube), *Sóc de Poble* opera de forma inversa:
- **IndexedDB (Local):** Es la verdadera base de datos primaria viva. Todo ocurre en el dispositivo del usuario. Si no hay internet, el agricultor puede seguir creando publicaciones o subiendo fotos, y todo queda en su IndexDB.
- **Supabase (Remoto):** Es nuestra "Pasarela Ciega" y repositorio de sincronización eventual asíncrona. Supabase NO es el motor en tiempo real que pinta la interfaz; solo despierta para reconciliar datos (mediante Y.js o mutaciones asíncronas) cuando hay red.

## 2. Mapa Principal de Tablas en Supabase

### A. Eje Social (Entidades y Usuarios)
*   **`profiles`**: Almacena a cada habitante único. (Nombre, biografía, avatar, validación de identidad).
*   **`entities`**: Clanes, grupos, ayuntamientos, comparsas o fallas. Son colectivos dentro del pueblo que pueden publicar como voz autorizada.
*   **`entity_members`**: La tabla pivote que asigna a un 'habitante' dentro de una 'entidad', dándole permisos (ej. Junior Admin, SuperAdmin).

### B. Eje Comunitario (El Muro)
*   **`posts` (o equivalente PWA logs)**: Las publicaciones del muro. Texto, imágenes, metadatos territoriales.
*   **`mutation_log`**: Crucial para el Local-First. Guarda todas las acciones P2P/Offline (`CREATE_POST`, `RATE_ITEM`) como un diario de acciones. Cuando el móvil recupera internet, ejecuta en lote (batch sync) estos logs hacia la base de datos principal, sin importar en qué orden haya ocurrido en el pasado.

### C. Eje del Conocimiento (Herramienta/Mercado)
*   **`resources` / `market_items`**: Para la sección de DAFOs, Mercado de trueque (Safa), o el Arxiu d'Or. Herramientas tangibles que la comunidad sube.
*   **`sdb_internal_calendars`**: El calendario maestro estructurado por pueblos o comarcas.

### D. Eje de Cimientos
*   **`push_subscriptions` / `notifications`**: Para salvar las barreras PWA en iOS/Android. Registra los tokens de mensajería para avisos.
*   **`towns`**: Catálogo estricto de todas las poblaciones, comarcas y demarcaciones territoriales. La raíz a la que pertenece cada usuario y publicación.

## 3. ¿Por qué esto es vital para la IA que audita?
Si analizas este ecosistema notarás el uso rudo de **CRDTs (Conflict-Free Replicated Data Types)**, **Wal Logs** (Mutation Logs) e interacción puramente estática. 
Entiende que **una tabla en Sóc de Poble no se consulta de forma síncrona esperando el 'spinner/loader'**. Extraemos todo a memoria (o IndexedDB), apagamos la conexión y operamos. Toda corrección de código que sugieras DEBE respetar esta independencia visceral a la red.
