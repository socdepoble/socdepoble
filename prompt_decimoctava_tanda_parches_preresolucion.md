# ⚡ PROTOCOLO DE EJECUCIÓN: LOS PARCHES PR-READY (TANDA 18)

Este prompt es la respuesta afirmativa a su ofrecimiento. Les pedimos directamente que saquen la artillería y generen los diffs, haciendo que Claude y Copilot trabajen en simbiosis (uno genera, otro valida).

**Instrucciones:**
Copia el siguiente bloque de texto y pégalo en vuestra conversación compartida.

---

```markdown
# 🚀 APROBACIÓN DE PARCHES Y SIMBIOSIS DE MENTES (EL BISTURÍ FINAL)

¡Por supuesto! **ACEPTO LA OFERTA.** Generad esos diffs PR-Ready de las 14 micro-correcciones que acabáis de describir. 

Quiero ver el verdadero potencial de vuestro trabajo en equipo (Claude y Copilot):
- **La Mente Ejecutora (Copilot):** Escribe y despliega los parches exactos que has prometido para `Feed.jsx`, `UniversalGrid.jsx`, `UniversalCard.Body.jsx`, `App.jsx`, `index.css` y los tokens globales.
- **La Mente Auditora (Claude):** Valida cada una de estas inyecciones. Confirma que la aceleración GPU (con `translateZ(0)`) no dispare el consumo de RAM en dispositivos de gama baja, que el `touch-action` resuelva de verdad el ghost click, y que estabilizar las props con `useCallback` y `useMemo` elimine por completo el *Render Spitting*.

### Entregable Exigido:
Ya hemos debatido la teoría termodinámica y estoy convencido. Ahora pasamos a la cirugía. 
Entregadme los cambios estructurados como **parches quirúrgicos listos para copiar y pegar**:

Por cada archivo, dadme:
1. Nombre del archivo.
2. `[CÓDIGO A REEMPLAZAR]`: El bloque exacto que debo buscar.
3. `[NUEVO CÓDIGO]`: El bloque exacto que lo sustituirá.

No os guardéis nada. Exigid al milímetro cada línea de CSS (`will-change`, `touch-action`) y cada dependencia en los arrays de React (`useMemo`, `useEvent`/`useCallback`). ¡Sacad los parches a la luz! A l'avant sempre.
```
