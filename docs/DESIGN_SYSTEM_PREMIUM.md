# 🎨 Design System: Sóc de Poble (Premium Dark)

Este documento registra los tokens de diseño y estándares visuales aprobados durante el refactor de la pantalla de login. Estos estilos servirán de base para la futura actualización estética de toda la aplicación.

## 🌑 Paleta de Colores (Core Dark)

| Elemento | Valor Hex/RGBA | Uso |
| :--- | :--- | :--- |
| **Fondo Base (Center)** | `#1A1B23` | Centro del gradiente radial |
| **Fondo Base (Edge)** | `#08090A` | Extremos del gradiente radial |
| **Superficie Card** | `rgba(23, 25, 35, 0.7)` | Fondo de tarjetas con glassmorphism |
| **Borde Sutil** | `rgba(255, 255, 255, 0.08)` | Bordes de tarjetas y contenedores |
| **Inputs** | `rgba(255, 255, 255, 0.05)` | Campos de formulario |
| **Acento Primario** | `#5D5FEF` | Botones, estados activos y enlaces |

## ✨ Efectos y Elevación

### Glassmorphism Standard
- **Backdrop Blur:** `20px`
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`
- **Sombra (Elevada):** `0 24px 64px rgba(0, 0, 0, 0.4)`

### Gradiente de Fondo (CSS)
```css
background: radial-gradient(circle at center, #1a1b23 0%, #08090a 100%);
```

## ⌨️ Formularios (Dark Context)
- **Border Radius:** `18px` para inputs, `20px` para wrappers.
- **Label Color:** `rgba(255, 255, 255, 0.4)` (Uppercase, 700 weight, 1px letter spacing).
- **Focus State:** `box-shadow: 0 0 0 4px rgba(93, 95, 239, 0.15)`

## 📐 Tipografía e i18n
- **Títulos:** White, 800-950 weight, letter-spacing -0.02em a -0.5px.
- **Idioma:** Valenciano (AVL) usando formas imperativas (Inicia, Entra, Registra't).

## 📱 Patrones de Interfaz (Nuevos)

### Listado Compacto (Estilo Listado/Chat)
Para pantallas con muchos elementos (como la selección de personajes), se prefiere un diseño estrecho y vertical:
- **Max-width:** 680-700px (centrado).
- **Border Radius:** 24px - 32px.
- **Item Height:** Flexible (aprox 80px).
- **Iconografía:** Avatares con bordes redondeados (14px-20px) e indicadores de estado circulares.

### Cabeceras de Sección
- **Logo:** Siempre centrado, versión blanca (usar `brightness(0) invert(1)` si no hay archivo específico).
- **Título de Sección:** `clamp(38px, 6vw, 64px)`, peso 950, gradiente blanco a grisáceo.
- **Descripción:** Texto en dos líneas si es largo, `font-size: 16px`, color `#94a3b8`.

## 🧭 Usabilidad y Navegación (Core Rules)

### Control del Usuario (Salida Clara)
- **Botón de Retorno:** Cada pantalla "modal" o de transición (como el Playground) DEBE tener un botón de "Tornar" (Volver) o "Sortir" (Salir) claramente visible.
- **Ubicación:** Preferiblemente en la esquina superior izquierda.
- **Estilo:** Botón minimalista, semitransparente (`rgba(255, 255, 255, 0.05)`), con icono `ArrowLeft` y texto.
- **Principio:** El usuario nunca debe sentirse "atrapado" en un flujo. Siempre debe haber una salida segura a la pantalla anterior.

### Visibilidad de Acciones Críticas
- **Botón de Compartir:** Debe estar **siempre visible** en las vistas de detalle (Posts, Mercado, Perfil).
- **Ubicación:** Accesible en la zona superior (barra de navegación) o flotante en la zona inferior.
- **Estilo:** Icono claro (`Share2` de Lucide), con contraste suficiente. No ocultar dentro de menús de "más opciones" si es una acción primaria.

## 🛡️ Directivas de Desarrollo (Workflow)

### Playground-First (Promoción Segura)
Para garantizar la estabilidad del sistema y evitar errores en producción, se establece la siguiente norma fundamental:
1. **Espacio de Experimentación:** Todos los cambios visuales o de interacción deben implementarse y validarse primero en el espacio del **Playground**.
2. **Validación de Estándares:** Un cambio solo es apto para "Promoción a Producción" si:
    - No rompe ninguna funcionalidad existente.
    - Cumple estrictamente con los tokens y normativas de este *Design System*.
    - Ha sido verificado en el simulador por el equipo de diseño/producto.
3. **Pase a Producción:** Una vez afianzado y validado en el Playground, el cambio se integrará de forma automática/prioritaria en el sistema de producción.

---
> [!TIP]
> Mantener este contraste alto y el desenfoque profundo para conservar la sensación "Premium". La reducción de espacio negativo excesivo mejora la densidad de información y la profesionalidad.
