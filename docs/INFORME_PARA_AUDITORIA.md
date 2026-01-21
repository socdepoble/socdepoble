# BRIEFING DE AUDITORÍA INTEGRAL: SÓC DE POBLE

## 1. Contexto del Proyecto
**Sóc de Poble** es una plataforma comunitaria diseñada para conectar a los habitantes de pueblos (Cocentaina, Muro, etc.) mediante mensajería, un muro de noticias y un mercado local. El objetivo es ofrecer una experiencia **Premium**, visualmente impactante y segura, fomentando la economía local y la cohesión social.

### Tech Stack
- **Frontend**: React (Vite), CSS Vanilla (Custom Design System).
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage).
- **Despliegue**: Vercel.

---

## 2. Objetivos de la Auditoría

### A. Seguridad y Arquitectura (Core)
- **RLS (Row Level Security)**: Auditar la robustez de las políticas actuales en `profiles`, `entities`, `conversations`, `messages`, `posts` y `market_items`.
- **Materialized Views**: Revisar la implementación de `entity_member_map` para optimizar los checks de membresía.
- **UUIDs**: Validar que la migración a UUIDs sea completa y no queden referencias a IDs secuenciales vulnerables.
- **Data Privacy**: Asegurar que los mensajes sean accesibles únicamente por los participantes involucrados.

### B. Calidad de Diseño y Estética Premium
- **Fidelidad al Design System**: Evaluar si el uso de variables en `index.css` (colores, espaciado, sombras glassmorphism) se aplica consistentemente en todos los componentes.
- **Experiencia Oscura**: Validar que el modo oscuro sea fluido y premium (no solo "gris sobre negro").
- **Animaciones**: Identificar oportunidades para mejorar micro-interacciones.

### C. Usabilidad y Accesibilidad (WCAG)
- **Navegación Móvil**: Evaluar la intuitividad del `Layout` y la barra de navegación inferior.
- **Accesibilidad**: Verificar contrastes de color, tamaños de fuente y compatibilidad con lectores de pantalla (normativas de diseño).
- **Usabilidad Senior**: Dado que el público incluye personas mayores en entornos rurales, la claridad visual es crítica.

### D. Calidad del Código (Best Practices)
- **React Patterns**: Manejo de `useEffect`, estados globales y separación de lógica en servicios (`supabaseService.js`).
- **Rendimiento**: Eficiencia de las consultas y manejo de estados de carga/error.

---

## 3. Puntos Críticos para el Auditor
1. **Multi-Identidad**: El sistema permite actuar como persona física o como entidad (empresa, grupo). La auditoría debe asegurar que esta distinción sea impecable en permisos y visualización.
2. **Sistema de NPCs**: Recientemente se ha integrado un simulador de respuestas IA para los chats de demo. Evaluar su impacto en la UX y escalabilidad.
3. **PGRST205 / Desincronización**: Hemos tenido problemas de sincronización entre Vercel y Supabase por nombres de tablas (`chats` -> `conversations`). Validar que no queden rastros del esquema antiguo.


## 4. Referencias de interés
- [docs/DESIGN_SYSTEM_PREMIUM.md](file:///Users/javillinares/Documents/Antigravity/S%C3%B3c%20de%20Poble/docs/DESIGN_SYSTEM_PREMIUM.md)
- [src/services/supabaseService.js](file:///Users/javillinares/Documents/Antigravity/S%C3%B3c%20de%20Poble/src/services/supabaseService.js)
- [src/index.css](file:///Users/javillinares/Documents/Antigravity/S%C3%B3c%20de%20Poble/src/index.css)

 Broadway
