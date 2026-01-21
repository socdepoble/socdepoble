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
- **Títulos:** White, 800 weight, letter-spacing -0.5px.
- **Idioma:** Valenciano (AVL) usando formas imperativas (Inicia, Entra, Registra't).

---
> [!TIP]
> Mantener este contraste alto y el desenfoque profundo para conservar la sensación "Premium".
