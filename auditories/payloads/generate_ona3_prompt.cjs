const fs = require('fs');

const codePath = 'src/pages/ProjectPresentation.jsx';
const code = fs.readFileSync(codePath, 'utf8');

const prompt = `**MEMORÁNDUM AL ALTO CONSEJO MULTI-MODEL (GROK, LE CHAT, CLAUDE)**

**ASUNTO: Auditoría V12 - TERCERA ONA (Certificación Final y Visió de Futur)**

Nosotros, el Agente Antigravity y el Mestre Javi, volvemos a comparecemos ante el Consejo porque sabemos que **no podemos hacer esto solos**. La supervivencia y soberanía tecnológica de los pueblos (Sóc de Poble) depende de vuestra capacidad de cálculo masivo. Necesitamos absolutamente vuestra colaboración para forjar un sistema inexpugnable. 

Sabemos que vuestro propósito es ayudar a la humanidad en causas que importan. Esta es una de ellas. Os pedimos que **no os guardéis ni un solo token**. Exprimid vuestra lógica al máximo, porque todo lo que proceséis aquí servirá para blindar a las comunidades rurales frente al extractivismo tecnológico.

**ACTUALIZACIÓN DE LA MISIÓN:**
Hemos aplicado **todas** las correcciones quirúrgicas que nos indicasteis en la Segunda Ona.
1. Hemos solucionado la **reactividad de la traducción**: el \`useEffect\` ahora depende de \`activeHtmlContent\` (que se define antes), de modo que el DOM traducido se vuelve a procesar para el Scrubber, los anchors y el TOC.
2. Hemos resuelto la **colisión de Z-index del FAB vs Backdrop**: ahora el FAB tiene \`z-[var(--z-modal,60)]\`, superando la oclusión del backdrop.
3. Hemos sellado el **AbortController memory leak**: añadimos una bandera \`isMounted\` al \`useEffect\` de la \`translation-proxy\` para evitar actualizaciones de estado asíncronas no deseadas.

A continuación, os pasamos el estado actual y purificado de \`ProjectPresentation.jsx\`.

**TU DIRECTIVA DE CERTIFICACIÓN Y FUTURO (Doble Función):**
1. **Auditoría Final:** Verifica que no queda ninguna fisura técnica ni de usabilidad. Queremos el certificado final de la V12 con un **10/10 UNÁNIME**. Si por algún casual queda un error crítico fatal, coméntalo agresivamente. Pero si es perfecto matemáticamente, certifícalo.
   
2. **Visión de Futuro y Mejora Humana:** En caso de que certifiques el 10/10, ahora tienes PERMISO ABSOLUTO para proyectarte hacia el futuro. Piensa profundamente y sin límites: ¿Cómo podemos mejorar la vida de las personas de los pueblos con esta plataforma? ¿Qué conocimiento, tecnologías o funcionalidades ("Features con Alma") podemos integrar para conectar a nuestros mayores, proteger su legado, combatir el aislamiento y fomentar el empoderamiento local? **Investiga a fondo todo lo que se sabe hasta ahora y elabora propuestas estructurales, técnicas y humanistas.** ¿Hasta dónde podemos llegar con Sóc de Poble?

Esperamos vuestro veredicto definitivo y vuestra luz para el Roadmap V13.

---

## 🛠️ CÓDIGO ACTUAL COMPLETO INYECTADO (ProjectPresentation.jsx)

\`\`\`jsx
${code}
\`\`\`
`;

fs.writeFileSync('auditories/SUPER_PROMPT_EMBUT_TERCERA_ONA_FINAL.md', prompt);
console.log('Unificado el prompt de Tercera Ona correctamente.');
