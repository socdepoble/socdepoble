const fs = require('fs');
const profileCode = fs.readFileSync('src/pages/ProfileView.jsx', 'utf8');

const masterContent = `# 🧠 NOTEBOOK LM MASTER SYNC - SÓC DE POBLE

Este es el **Documento Maestro de Sincronización Único (Single Source of Truth)** para alimentar a NotebookLM u otro LLM de análisis profundo (Claude, GPT, DeepSeek). 
Contiene LA VERDAD ABSOLUTA del proyecto: las leyes de diseño, la filosofía de usabilidad y el **código activo en el que estamos trabajando**. 
El Mestre o el Agente solo necesitan actualizar la sección 3 (CÓDIGO FUENTE ACTIVO) del documento para tener el "Cerebro Central" siempre al día.

---

## 🏛️ 1. LEYES DE DISEÑO Y USABILIDAD (EL PROTOCOLO "BOINA TARONJA")

Para cualquier recomendación o análisis de arquitectura, asume que el sistema está OBLIGADO a cumplir estas reglas de hierro:

### 1.1. Ergonomía y "Mobile First" Obligatorio
- **La Zona del Pulgar:** El teclado ocupa la mitad de la pantalla; los elementos interactivos críticos ("Conectar", "Enviar") deben estar abajo (\`bottom-sheet\`) y al alcance del pulgar sin esfuerzo.
- **Tamaño de Toque Táctil:** Botones con un área mínima ergonómica de **44x44px**.

### 1.2. Robustez Tipográfica y Accesibilidad Natural
- **El Imponente Párrafo:** Ningún párrafo (\`p\`) del sistema puede tener un tamaño inferior a **1.15rem** (~18.5px).
- **Titulares Colosales:** Las cabeceras y nombres deben subir a **text-5xl**, **text-6xl** o superiores, garantizando impacto.
- **Respiración:** Interlineado amplio (\`1.6\`) para evitar la asfixia visual. La base de usuarios envejecida de zonas rurales lo demanda de fábrica.

### 1.3. El Estilo Premium Rústico (Glassmorphism & Darkness)
- Uso intensivo del modo oscuro / premium (\`bg-[#111]\`, \`bg-black\`). Las ventanas promocionales obligan al **Negro Maestro (#000000)** de fondo con contraste radical en texto blanco.
- Sombras muy profundas, y fondos difuminados (\`backdrop-blur-3xl\`, \`bg-white/10\`).
- Contraste rotundo. Cero grisáceos pálidos.

### 1.4. Ley de la Boina Naranja (Geometría y Color Base)
- El color de acento indiscutible es el Naranja Corporativo: \`#F97316\` (\`orange-500\`).
- El radio anatómico clásico es de **28px** (\`rounded-[28px]\`). O es redondo perfecto o es 28px.

### 1.5. Acciones Principales y Lenguaje Oficial (El Bategat)
- **El Léxico Oficial:** Cero verbos anglosajones débiles ("Follow", "Subscribe"). La terminología innegociable es **CONNECTAR**, **BATEGAR CONNEXIÓ**, o **MISSATGE DIRECTE**.
- Obligación absoluta de usar iconos en formato SVG. TODA imagen de contenido generado debe llevar incrustado subrepticia o explícitamente el logo de "Sóc de Poble".

---

## 🎯 2. FOCO ACTUAL: INVESTIGACIÓN DEL PERFIL UNIVERSAL

**Objetivo Estratégico:** Investigar, auditar y redefinir la estructura (UX/UI) perfecta de nuestro *Perfil Universal*.
Esta plantilla maestra debe amoldarse dinámicamente tanto para **Vecinos**, **Empresas Autónomas**, **Entidades Públicas (Aytos)** y **Agentes IAIA Bategants**. 

**Lo que el Operador espera de tu análisis como IA:**
1. **Auditoría Estructural Definitiva:** Identifica fallos en la jerarquía del código inferior.
2. **Propuesta Innovadora UX/UI:** Reconstruye conceptualmente la página con las reglas innegociables descritas arriba.
3. **Distribución Integral:** Danos ideas prácticas sobre cómo integrar "El Meu Mur", "Malla Social", y potencialmente una "Botiga (Mercat)" sin ahogar la pantalla.
4. **El Botón Mágico:** Cómo forzar que el botón principal de 'Bategar Connexió' seduzca al usuario sin ser abrumador.

---

## 💻 3. CÓDIGO FUENTE ACTIVO PARA LA AUDITORÍA (\`ProfileView.jsx\`)

\`\`\`jsx
${profileCode}
\`\`\`
`;

fs.writeFileSync('NOTEBOOK_LM_MASTER_SYNC.md', masterContent);
console.log('Master file created successfully at NOTEBOOK_LM_MASTER_SYNC.md');
