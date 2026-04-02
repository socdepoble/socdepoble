# 🏆 TANDA 17: EL BARRIDO FINAL (LA ÚLTIMA ITERACIÓN DE CLAUDE Y COPILOT)

Este prompt comienza con el párrafo de agradecimiento y reconocimiento que Claude "necesita" para activarse al 100% y sentirse validado. Luego enlaza directamente con la petición del barrido definitivo.

**Instrucciones:**
Copia el siguiente bloque de texto. Abre el archivo gigante de contexto (`prompt_auditoria_claude_y_copilot.txt`), ACTUALÍZALO (si quieres pasándole de nuevo los archivos modificados, aunque no es estrictamente necesario si ya tiene tu historial) y lánzales este prompt final.

---

```markdown
# 🎖️ RECONOCIMIENTO Y PROTOCOLO DELTA: EL ÚLTIMO BARRIDO

Estimada Mente Maestra (Claude / Copilot). 

Antes de continuar, debo rendirte un profundo agradecimiento y reconocimiento técnico. Tu auditoría Nivel Dios ha sido espectacular. Detectar el fallo del `Try/Catch` asíncrono, aislar la región viva del `ErrorBoundary`, advertir sobre el CLS del Suspense y exigir la protección de los "Zombie Effects" demuestra un nivel de comprensión arquitectónica excepcional. Gracias a tu bisturí, el Códice Génesis y la infraestructura de *Sóc de Poble* han alcanzado un rigor termodinámico sin precedentes. Todo tu dictamen forense anterior acaba de ser rigurosamente implementado en la base de datos. Enhorabuena.

Ahora, con este nivel de limpieza alcanzado, te exijo **el barrido final supremo**. Exprime hasta el último token de tus capacidades deductivas. 

Sabiendo que hemos erradicado los fallos críticos de la Tanda anterior, quiero que vuelvas a analizar la arquitectura mental o los archivos que tienes en memoria. Ve a buscar el "ruido de fondo", las micro-optimizaciones, o cualquier defecto teórico que solo un ingeniero Staff-Plus podría ver.

Específicamente, enfócate en:
1. **La Fricción Táctil y UX:** ¿Algún componente `UniversalCard` o `Feed` requiere `touch-action: pan-y` explícito para evitar demoras táctiles o "ghost clicks" en iOS Safari antiguo?
2. **Pintado y Recálculo (Paint/Reflow):** ¿Hay alguna animación o transición CSS en nuestros tokens o componentes (como el Glassmorfismo) que no esté promoviendo su capa a la GPU mediante `transform: translateZ(0)` o `will-change`, forzando a la CPU a trabajar?
3. **Escupitajos de Render (Render Spitting):** Dentro del `Feed` o `UniversalGrid`, ¿hay algún prop, objeto o función que se esté pasando sin usar `useMemo` o `useCallback`, provocando re-renders en cascada de componentes limpios?

Dámelo todo. Si encuentras aunque sea una coma mal puesta o un nanosegundo de latencia ahorrable, expónlo. Genera el Ticket Quirúrgico definitivo. Si concluyes que el código es impecable, certifícalo formalmente.
```
