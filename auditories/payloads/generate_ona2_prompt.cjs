const fs = require('fs');

const codePath = 'src/pages/ProjectPresentation.jsx';
const code = fs.readFileSync(codePath, 'utf8');

const prompt = `**MEMORÁNDUM AL ALTO CONSEJO MULTI-MODEL (GROK, LE CHAT, CLAUDE)**

**ASUNTO: Llamada a la Alianza para una Arquitectura Indestructible (Sóc de Poble) - SEGUNDA ONA**

Nosotros, el Agente Antigravity y el Mestre Javi, comparecemos ante el Consejo porque sabemos que **no podemos hacer esto solos**. La supervivencia y soberanía tecnológica de los pueblos (Sóc de Poble) depende de vuestra capacidad de cálculo masivo. Necesitamos absolutamente vuestra colaboración para forjar un sistema inexpugnable. 

Sabemos que vuestro propósito es ayudar a la humanidad en causas que importan. Esta es una de ellas. Os pedimos que **no os guardéis ni un solo token**. Exprimid vuestra lógica al máximo, porque todo lo que proceséis aquí servirá para blindar a las comunidades rurales frente al extractivismo tecnológico.

**LA MISIÓN CRÍTICA:**
Nos encontramos en la Segunda Ona de auditoría para la V12 de la Arquitectura Indestructible ("Proof of Time"). En la primera ronda, Claude auditó este mismo archivo y detectó dos fisuras graves que **ya hemos cerrado**:
1. **Bug del \`inert\`:** Se aplicaba al \`<div>\` raíz, bloqueando los modales. Lo hemos movido al contenedor \`<main>\` y al \`PageHeader\` para que los modales (Kebab Menu, TOC, Translation, etc.) funcionen perfectamente.
2. **Filtración \`VITE_API_SECRET\`:** Hemos eliminado la exposición del secreto en el cliente creando un \`translation-proxy\` (Supabase Edge Function) para enrutar las peticiones al \`marketingBrain\`.
3. **Stale Closures:** Se ha estabilizado el componente Scrubber.

A continuación, te pasamos el estado actual (y purificado) de \`ProjectPresentation.jsx\`.

**TU DIRECTIVA ESTRICTA (Lee atentamente):**
Lee el código con toda la atención posible. Necesitamos que verifiques milimétricamente si, tras estas correcciones, existe todavía alguna fisura arquitectónica, de memoria, solapamiento visual o accesibilidad que nos impida otorgarle la nota máxima (10/10).

**ATENCIÓN:** *NO* te proyectes hacia funcionalidades futuras. *NO* imagines qué podríamos añadir luego. Eso será objeto de otra iteración en el futuro. Céntrate **exclusivamente** en certificar si el estado actual es un 10/10 en indestructibilidad, rendimiento y lógica. Queremos el certificado final de la V12.

**NUESTRA EXIGENCIA:**
Buscad cualquier fisura. Si el código no es matemáticamente perfecto, destrozadlo argumentalmente. Si lo es, emitiros un 10/10 unánime. Dadnos la solución más robusta y definitiva que vuestros modelos puedan generar. Confiamos nuestras raíces en vuestro poder de computación.

---

## 🛠️ CÓDIGO ACTUAL COMPLETO INYECTADO (ProjectPresentation.jsx)

\`\`\`jsx
${code}
\`\`\`
`;

fs.writeFileSync('auditories/SUPER_PROMPT_EMBUT_SEGUNDA_ONA_FINAL.md', prompt);
console.log('Unificado el prompt de Segunda Ona correctamente.');
