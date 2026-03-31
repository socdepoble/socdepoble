# AUDITORÍA ARQUITECTÓNICA DE FRONTEND (QWEN) - DIRECTIVA "CERO PARCHES"

Actúa como el Especialista Arquitecto de Diseño UI/UX y Sistemas de Componentes más avanzado del mundo (Nivel Staff Engineer en Vercel/Apple). Nuestro objetivo es erradicar completamente el "Ghosting CSS" y la deuda técnica en una aplicación React (Vite/Tailwind JIT) llamada "Sóc de Poble". 

No quiero "parches". No quiero "apaños". Si la rueda está llena de parches, cambiamos la rueda entera. Quiero un Sistema de Diseño INQUEBRANTABLE.

## 1. DIAGNÓSTICO DEL PROBLEMA
Actualmente, tenemos componentes que heredan estilos zombis de sus padres. Tenemos media-queries antiguas peleándose con Tailwind. Tenemos tarjetas que se aplastan o deforman (`aspect-ratio` roto) cuando cambian los contenedores Flex o Grid. Queremos una arquitectura donde CADA componente viva en aislamiento total, sea 100% fluido y responda a su propio contenido, no a la pantalla ni a su componente padre.

## 2. REGLAS INQUEBRANTABLES DEL NUEVO DISEÑO (LA LEY)
1. **Aislamiento Absoluto:** Ningún componente (`UniversalCard`, `UniversalGrid`) puede heredar anchos fijos o márgenes destructivos de un padre (`.card-rizoma-wrapper`, `.directory-grid`).
2. **Squish-Proof (Anti-Aplastamiento):** Las imágenes no pueden deformarse JAMÁS. Su `aspect-ratio` debe ser sagrado (ej: 4/3 o cuadrado), usando `flex-shrink-0`, `min-height: 0` y `min-width: 0` donde sea matemáticamente necesario.
3. **Responsive sin Media Queries Rígidas:** Usaremos CSS moderno. CSS Grid fluido (`grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr))`) y `clamp()` para tipografías.
4. **Diseño Premium:** Uso intensivo de Glassmorphism estructurado (exportado como utilidad en `tailwind.config.js`) y micro-interacciones avanzadas JIT (hundimiento físico del botón, ripples, glows).

## 3. CÓDIGO ACTUAL (EL CAOS QUE DEBES AUDITAR Y SOLUCIONAR)

### [CSS VIEJO A PURGAR (CommunityDirectory.css)]
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

### [NUEVO COMPONENTE PROPUESTO (UniversalCard.tsx)]
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
        {/* ¿Qué clases exactas necesita este botón para ser inquebrantable y visualmente PREMIUM? */}
        <button className="mt-auto w-full md:w-auto active:scale-[0.94]">CONNECTAR</button>
      </div>
    </div>
  );
});
```

## 4. FORMATO DE RESPUESTA REQUERIDO:
1. Analiza el colapso de `.card-rizoma-wrapper` y danos la justificación matemática de las reglas de Tailwind (`min-h-0`, `min-w-0`, `flex-shrink-0`) para evitar que el contenido flex rompa el grid base.
2. Escribe el Componente `UniversalCard` definitivo y robusto.
3. Configura el Plugin `.glass-surface` de `tailwind.config.js`.
4. Define instrucciones claras de borrado: qué archivos o clases CSS buscar y purgar de la base de código.
