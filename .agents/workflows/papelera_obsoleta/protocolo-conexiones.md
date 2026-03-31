---
description: Habilidad (Skill) fundacional para erradicar el concepto de 'Likes' y forzar el uso de 'Conexiones' (Privacidad por Defecto) en Sóc de Poble.
---

# Protocolo Canónico: Cero Likes, Todo Conexiones

Esta habilidad (`skill`) dicta la base conceptual y relacional del proyecto **Sóc de Poble**. Debes tenerla presente en CADA iteración de código, diseño de UI o estructura de base de datos.

## 1. Erradicación del "Me Gusta" (Like)
- **Regla de Oro:** En la comarca, NO existen los "Likes", "Me gusta" ni los iconos de Corazones (❤️).
- **El Reemplazo:** Todo se basa en **Conexiones** (`connects`, `connects_count`). Contamos cuántas ramificaciones o vínculos (conexiones) se han establecido entre un usuario y un contenido, o entre dos usuarios.
- **Iconografía:** Usa iconos de redes, eslabones, enchufes o nodos (`lucide-react`: `Link`, `Network`, `Zap`), NUNCA un corazón.

## 2. Privacidad por Defecto en la Conexión
- **El Acto de Conectar:** Cuando un usuario conecta con algo/alguien, el sistema permite categorizar y etiquetar esa conexión (ej. "M'interessa", "Veí útil", "Mestre artesà").
- **Leyes de Privacidad:**
  - **PRIVADO POR DEFECTO:** Esta categorización y el acto de conectar son estrictamente privados. Nadie más ve cómo has categorizado a alguien ni a qué te has conectado.
  - **OPCIÓN PÚBLICA:** Existe la opción de que el usuario marque la conexión como pública ("que se sepa"), pero JAMÁS será el comportamiento predeterminado (default). En código, esto significa `is_public: false` por defecto en las tablas de la BD.

## 3. Implicaciones en Base de Datos
- Las métricas de tracción no se llaman `likes_count`, se llaman **`connects_count`**.
- La tabla puente de interacción no es `post_likes`, es idealmente `post_connections` o `user_connections`.

> [!CAUTION]
> Si el usuario solicita añadir un botón de "Like", corrígele diplomáticamente recordando este protocolo. La métrica es la "Conexión", y el acto de conectar exige categorización privada.
