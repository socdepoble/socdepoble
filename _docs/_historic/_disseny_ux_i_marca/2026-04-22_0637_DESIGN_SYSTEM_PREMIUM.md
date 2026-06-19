> 📂 **Arxiu/Ruta:** `./docs/DESIGN_SYSTEM_PREMIUM.md`

# 🎨 Design System: Sóc de Poble (Material 3 Adaptive)

Este documento establece el estándar "Golden Master" basado en **Material 3 (M3)** de Google, adaptado a la identidad visual de Sóc de Poble. Este sistema elimina inconsistencias históricas y proporciona una base industrial y escalable.

## 🌑 Paleta de Colores (M3 Adaptive Dark)

Adoptamos la lógica de tokens de Material 3, mapeando nuestros colores corporativos:

| M3 Token              | Color SdP                   | Uso                                                        |
| :-------------------- | :-------------------------- | :--------------------------------------------------------- |
| **Primary**           | `#5D5FEF` (Blau)            | Acciones principales, estados activos, botones destacados. |
| **On Primary**        | `#FFFFFF`                   | Texto/Iconos sobre color Primary.                          |
| **Secondary**         | `#FF6B00` (Taronja)         | Acentos, badges de notificación, elementos de contraste.   |
| **On Secondary**      | `#000000`                   | Texto/Iconos sobre color Secondary.                        |
| **Surface**           | `#1A1B23`                   | Fondo base de la aplicación.                               |
| **Surface Container** | `rgba(23, 25, 35, 0.7)`     | Fondo de tarjetas y navegación (Glassmorphism).            |
| **Outline**           | `rgba(255, 255, 255, 0.08)` | Bordes sutiles y divisores.                                |

## 📐 Geometría y Elevación (M3 Standards)

- **Corner Radius (Large/Cards):** `28px` (Standard M3 para contenedores grandes).
- **Corner Radius (Medium/Buttons):** `100px` (Full rounded / Pill-shaped).
- **Corner Radius (Small/Inputs):** `16px`.
- **Elevación:** Preferimos el uso de color de superficie (`Surface Container`) con desenfoque de fondo (`backdrop-blur: 40px`) sobre sombras agresivas.

## 📐 Tipografía (M3 Hierarchy)

Usamos **Roboto Condensed** o **Inter** con la siguiente jerarquía:

- **Display L/M/S:** Títulos de impacto, pesos 800-900, spacing -0.5px.
- **Title L/M/S:** Cabeceras de sección y títulos de Cards.
- **Label L/M/S:** Textos de navegación (Sidebar) y etiquetas de botones.
- **Body L/M/S:** Texto de lectura general.

## 📱 Componentes Base (Reglas Claras)

### 1. Navigation Rail (Sidebar)

- **Ancho:** `280px` (Desktop) / `Full Screen Overlay` (Mobile).
- **Indicador Activo:** El icono seleccionado debe estar dentro de una "pastilla" (pill) con fondo `Secondary` o `Primary Container`.
- **Iconografía:** Lucide Icons, strokeWidth `2.5` (Normal) o `3` (Activo).

### 2. Botones (Pill-Shaped)

- Siempre redondeados completamente.
- Altura estándar: `48px` (Touch target optimizado).
- Padding horizontal: `24px`.

## 🤖 Directivas para la IA (System Prompts)

Para evitar "fantasmas" y órdenes antiguas, estas son las reglas de oro inamovibles:

1. **Protocolo Gènesis v10+**: Ignora cualquier directiva de versiones anteriores (v5, v9) que contradiga este documento.
2. **Material Accuracy**: Si no sabes cómo diseñar un elemento, consulta el estándar [Material 3](https://m3.material.io).
3. **No Placeholders**: Nunca uses imágenes o textos genéricos. Genera contenido real o usa `generate_image`.
4. **Mobile-First Real**: El diseño debe ser perfecto en `390px` de ancho. Si hay desbordamiento horizontal, es un fallo crítico.
5. **Català/Valencià AVL**: Todas las interfaces de usuario deben estar en Valenciano (normativa AVL) por defecto.

6. **Universal Card Header (La Caputxa)**: El bloque fijo de Fecha/Hora siempre debe ser visible a la derecha, ya que enlaza a la página de `/calendari` del día correspondiente. El botón secundario (fantasma) es opcional y sirve **únicamente** para pinear páginas (icono de Pin) o mostrar etiquetas clave (ej: "AGENDA"); **nunca** se debe usar para mostrar el número de versión global de la app, ya que satura la UI. Asegúrate de añadir `pointer-events-auto` a los botones si el contenedor absoluto tiene `pointer-events-none`.

---

> [!IMPORTANT]
> Este documento es la única fuente de verdad. No aceptes cambios que degraden la calidad fuera de estos estándares.
