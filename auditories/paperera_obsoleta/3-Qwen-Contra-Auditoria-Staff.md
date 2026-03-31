# Contra-Auditoría: Exigiendo el 10/10 a Qwen

**Contexto:**
Has detectado a la perfección el problema matemático de herencia en Flexbox y me has dado la solución atómica con `min-w-0` y `flex-shrink-0`. Lo vamos a implementar a rajatabla (“Cero Parches”). 

Pero como *Staff Engineer*, no puedo aceptar la solución hasta que me resuelvas estos 3 casos extremos (edge cases) que van a suceder en Producción (Sóc de Poble):

1. **El Problema del Estiramiento 4K (`auto-fit` vs `auto-fill`):**
   Si inyectas tu contenedor en un Grid fluido de `repeat(auto-fit, minmax(320px, 1fr))`, en una pantalla Ultra-Wide de 2500px, si la API solo devuelve 2 tarjetas, ambas tarjetas engordarán hasta ocupar 1200px cada una destruyendo el _aspect-ratio_ de la imagen. 
   **Pregunta:** ¿Deberíamos capar el crecimiento mutuo con `max-w-lg` en la propia tarjeta, o cambiar a `auto-fill` asumiendo el espacio vacío a la derecha? Dame tu veredicto matemático para pantallas gigantes.

2. **Toxicidad en iOS Safari (El 'Ghost Hover'):**
   Me propones físicas de `hover:-translate-y-1` y `active:scale-[0.98]` usando Tailwind JIT. En iPhone y iPad, tocar una tarjeta suele dejar activado el estado `:hover` permanentemente hasta hacer tap en otra parte (Efecto "Hover Fantasma"). 
   **Pregunta:** ¿Cómo refactorizas el array de `cva` en tu componente genérico para envolver todas esas interacciones físicas estrictamente bajo `@media (hover: hover) and (pointer: fine)` a nivel de Tailwind, deshabilitándolas por defecto en táctil?

3. **Cumulative Layout Shift (CLS) Crítico con Supabase:**
   En tu `<img />` usas `decoding="async"`. Las imágenes pesadas provienen de Supabase Storage. Hasta que se decodifican, el texto sube ocupando el hueco nativo de la imagen y luego salta bruscamente rompiendo Lighthouse (CLS). 
   **Pregunta:** Dado que el padre ya es `aspect-[4/3]`, ¿qué estructura exacta sugieres para inyectar un _Skeleton Loading_ (efecto Shimmer animado) que ocupe `inset-0` debajo de la `<img>` y que desaparezca/se oculte cuando el navegador dispara el evento estricto de `onLoad` sin causar repintados masivos en React? 

No te guardes nada. Exijo el estándar más alto posible.
