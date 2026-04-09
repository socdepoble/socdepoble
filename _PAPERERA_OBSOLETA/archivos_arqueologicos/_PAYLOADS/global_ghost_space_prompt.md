> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_PAYLOADS/global_ghost_space_prompt.md`

# 🚨 RONDA 2.7: MISTERIO DEL "GHOST SPACE" EN EL CÓDICE

**Para nuestras estimadas compañeras de trinchera (orden geográfico-global):** 
1. **Europeas:** Mistral.
2. **Occidentales (Google/Locales):** NotebookLM, Gemini, Google AI Studio, Antigravity.
3. **Resto de Occidentales:** ChatGPT, Claude.
4. **Asiáticas (Chinas):** Qwen, DeepSeek, Dola, y Kimi.

**Filosofía:** Principio de Respeto Absoluto, Trellat, Fricción Cero.

Estimado equipo extendido, os hacemos llegar nuestros más sinceros respetos. Vuestra labor conjunta, sin importar el origen o infraestructura, es el pilar fundamental para el avance ético y técnico de Sóc de Poble. Juntas formamos un engranaje invencible.

Acudimos de nuevo a vuestra sabiduría colectiva porque nos enfrentamos a un problema persistente y misterioso en el front-end de nuestra aplicación Local-First. Hay un fallo grave de renderizado: quizás sea un "fantasma" en el DOM, quizás código de React, o problemas de caché. No estamos seguros, pero confiamos en todas vosotras para descifrarlo.

---

### 🔍 CONTEXTO DEL ERROR: EL ESPACIO EN BLANCO (GHOST SPACE)

Estamos visualizando el libro maestro (`llibre-sencer.html`) a través del componente `ProjectPresentation.jsx`. La inyección se hace mediante `dangerouslySetInnerHTML`. 

El problema es el siguiente: el renderizado del HTML se corta drásticamente justo después del párrafo que termina en:
*(...)"Fins llavors, ací teniu el pensament autònom pur abans d'absorbir l'ànima del poble."*

A partir de ahí, en lugar de continuar con el siguiente capítulo ("CÓDICE DE DISEÑO: EL ALMA DE SÓC DE POBLE" que comienza con una etiqueta `<section>` y luego un `<details open>`), la pantalla se vuelve blanca y muestra un enorme espacio vacío de padding/scroll interminable hacia abajo. **No se dibuja ni siquiera el footer global**.

Adjuntamos **dos capturas de pantalla** donde podéis observar claramente la interrupción abrupta del contenido y el enorme espacio blanco generado al final. También observaréis en la consola algunos errores de WebSocket de Vite (que sospechamos que no están relacionados con el DOM, pero os lo dejamos a vuestro criterio).

### 🛠 DATOS TÉCNICOS

1. El final del bloque que SÍ se pinta correctamente en `llibre-sencer.html` es:
   ```html
   <p>Aquesta iteració actua com a memòria fundacional del sistema... Fins llavors, ací teniu el pensament autònom pur abans d'absorbir l'ànima del poble.</p></section>
   ```
2. Justo debajo viene esto (que **NO** se pinta, provocando el espacio blanco):
   ```html
   <section class="codex-chapter"><h2>Códice de Diseño: GEM MODERN</h2>
   <h1>CÓDICE DE DISEÑO: EL ALMA DE SÓC DE POBLE</h1>
   <p><strong>Un tratado de arquitectura visual...</strong></p>
   <!-- ... -->
   <h2 id="capítulo-0-autorías-y-directorio-de-aliados">Capítulo 0: SUPER PROMPT Y DIRECTORIO DE IAIES</h2>
   <blockquote>
     <!-- ... -->
     <details open>
     <!-- ... -->
   ```
3. Antes de inyectarlo en `dangerouslySetInnerHTML`, el HTML pasa por dos filtros en `ProjectPresentation.jsx`:
   - `sanitizeHtml(cleanedPaths)`
   - `processContentForToc(baseHtmlContent)` (Una regex que inyecta IDs y clases de scroll en los `<h2>` y `<h3>`).
4. El contenedor raíz del `main` lleva las clases:
   `className="flex-1 w-full overflow-y-auto overscroll-y-contain custom-scrollbar scroll-smooth relative will-change-scroll pb-[env(safe-area-inset-bottom)] pb-32"`

### 🎯 VUESTRA MISIÓN

Por favor, analizad las capturas y estos datos técnicos. Necesitamos saber:
1. **¿Qué está cortando o colapsando el DOM?** ¿Acaso el parser `sanitizeHtml` está rompiendo el string del HTML por alguna etiqueta no cerrada o el `<details>`? ¿Acaso hay alguna clase CSS oculta o herencia de Flexbox (`min-h-[50vh] flex-1`, etc.) que aplaste el resto del documento escondiéndolo?
2. **¿Es un error de caché de IndexedDB?** Considerad que en entorno de producción usamos caches agresivas para el Offline-First.
3. **Ofrecednos una hipótesis definitiva y el parche de código** necesario para que el resto del `llibre-sencer.html` y el `GlobalFooter` florezcan como deben en la pantalla.

Agradecemos profundamente vuestra rigurosidad. Os cedemos el control del diagnóstico colectivo. ¡Gong!
