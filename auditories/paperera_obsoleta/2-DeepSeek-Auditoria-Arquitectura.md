# AUDITORÍA ARQUITECTÓNICA DE DEEPSEEK - DIRECTIVA "CERO PARCHES"

Actúa como el Arquitecto Lógico de Diseño de Interfaces más avanzado del mundo (Nivel Staff Engineer en Vercel/Linear). Nuestro objetivo es erradicar completamente el "Ghosting CSS" y la deuda técnica en una aplicación web interactiva de React (Vite/Tailwind) llamada "Sóc de Poble".

Quiero que disecciones las dependencias rotas y entregues un Sistema de Diseño INQUEBRANTABLE.

## 1. REGLAS INQUEBRANTABLES DEL NUEVO DISEÑO
1. **Aislamiento Absoluto:** Ningún componente (`UniversalCard`, `UniversalGrid`) debe recibir anchos limitados de un padre obsoleto (`.card-rizoma-wrapper`, `.directory-grid`).
2. **Squish-Proof (Anti-Aplastamiento):** Las imágenes no pueden deformarse JAMÁS. Su `aspect-ratio` debe ser perfecto (mediante `flex-shrink-0`, `min-height: 0` y `min-width: 0`).
3. **Responsividad Matemática:** CSS Grid fluido (`grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr))`) y `clamp()` para todas las tipografías métricas.
4. **Diseño Premium Linear-Style:** Glassmorphism abstracto exportado como plugin Tailwind JIT y botones físicos reaccionando a taps (`active:scale`).

## 2. DEUDA TÉCNICA (EL CAOS A AUDITAR)

### [CSS Viejo A Exterminar - CommunityDirectory.css]
```css
/* Este código causa colapsos y media-queries conflictivas que necesitamos PURGAR por completo reemplazando con el patrón UniversalGrid */
.directory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}
.card-rizoma-wrapper {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
}
@media (max-width: 768px) {
  .directory-grid { grid-template-columns: 1fr; }
}
```

### [El Borrador Incompleto - UniversalCard.tsx]
```tsx
const universalCardVariants = cva(
  'flex flex-col w-full min-w-0 h-full rounded-[1.5rem] overflow-hidden transition-all duration-300 glass-surface group',
  {
    variants: {
      viewMode: {
        grid: 'hover:-translate-y-0.5',
        list: 'flex-row md:gap-6 p-4 md:p-6',
        single: 'max-w-3xl mx-auto',
      },
      variant: { official: '', post: 'border-l-4 border-l-[#22c55e]' }
    },
    defaultVariants: { viewMode: 'grid', variant: 'official' },
  }
);
export const UniversalCard = forwardRef(({ viewMode, title, imageUrl, className }, ref) => {
  return (
    <div ref={ref} className={universalCardVariants({ viewMode, className })}>
      <div className={`relative w-full overflow-hidden flex-shrink-0 ${viewMode === 'list' ? 'w-40 aspect-square' : 'aspect-[4/3]'}`}>
        <img src={imageUrl} fetchPriority="low" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]" />
      </div>
      <div className="flex-1 min-h-0 p-[clamp(1.25rem,3vw,2rem)] flex flex-col gap-4">
        <h3 className="line-clamp-2">{title}</h3>
        {/* ¿Qué clases exactas necesita este botón para ser premium absoluto? */}
        <button className="mt-auto w-full md:w-auto active:scale-[0.94]">CONNECTAR</button>
      </div>
    </div>
  );
});
```

## 3. EJECUCIÓN DEL ANÁLISIS 
1. **Lógica de Fronteras:** Analiza por qué un wrapper extra como `.card-rizoma-wrapper` con `display: flex` estalla el Grid interno y danos la ley matemática obligatoria que impide esto.
2. **Propuesta Arquitectónica UniversalCard:** Reescribe el componente `UniversalCard` final, asegurándote de que los botones ("CONNECTAR") integren animaciones hiper-reactivas y el contenedor jamás permita que textos largos empujen el grid fuera de su marco (overflow).
3. **Módulo Tailwind Glassmorphism:** Implementa las variables de Glassmorphism Premium en el `tailwind.config.js`.
4. **Instrucciones Quirúrgicas de Purgado:** Indícanos qué CSS antiguo encontrar y purgar.
