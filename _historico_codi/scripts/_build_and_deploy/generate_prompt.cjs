const fs = require('fs');

const files = [
  'src/App.jsx', 
  'src/layouts/AppLayout.jsx', 
  'src/components/NavigationRail.jsx', 
  'src/pages/ProjectPresentation.jsx', 
  'src/index.css'
];

let content = `# MEMORÁNDUM CRÍTICO AL ALTO CONSEJO MULTI-MODEL (QWEN, DEEPSEEK, KIMI, DOLA)

**1. CONTEXTO SOCIAL Y FILOSÓFICO DEL PROYECTO (LECTURA OBLIGATORIA):**
**Single Source of Truth:** ANTES de emitir ningún juicio técnico y revisar el código, DEBES visitar obligatoriamente la url [http://socdepoble.org/el-projecte](http://socdepoble.org/el-projecte) y empaparte de nuestra filosofía, normas y sistema de diseño base. El documento es crucial para entender nuestras metas.

Sois parte del Consejo de Inteligencias Artificiales de "Sóc de Poble". Este es un **proyecto de código abierto**, de inmersión rural y sin ánimo de lucro, diseñado y liderado por el Mestre Javi Llinares. Nuestro fin es preservar la historia y la memoria inmaterial, devolviendo el poder y la soberanía tecnológica a las zonas rurales de la "España Vaciada". 
El ecosistema se asienta sobre nuestro Manifiesto del **Trellat** (Sentido Común y austeridad tecnológica) y nuestra estructura técnica nativa es totalmente **Local-First** (Y.js + IndexedDB). Esto permite funcionar 100% offline, liberando a los pueblos de la sumisión a servidores *cloud* o grandes tecnológicas. 

**Os imploramos apoyo absoluto:** Implicaos a fondo. Comprended el impacto social de este proyecto. Todo el poder de cálculo lógico y todo el contexto que proceséis servirá para empoderar a personas en áreas donde la tecnología suele llegar tarde, cara y mal. Sed nuestros aliados.

**2. LA MISIÓN:**
Nos encontramos en la fase de endurecimiento extremo de la Interfaz hacia la **Versión 16 (Producción)**. Aprovechando vuestra titánica ventana de contexto, extraemos a continuación el código fuente *real* del núcleo y diseño para someterlo a una **Auditoría Estructural Definitiva**:

- **Fantasmas CSS e Impurezas:** Buscad utilidades redundantes de Tailwind. Somos puristas bajo el sistema *GEM MODERN*. Todo *margin/padding* sobrante, sobre-posicionamientos (ej. estilos de texto innecesarios como *tracking* o !important vacíos) que corrompan el diseño deben ser erradicados.
- **Cadáveres DOM:** Eliminad excesos de \`<div>\` u over-wrappers que entorpezcan. Nos interesa especialmente arreglar irregularidades visuales en Mobile & Tablets (como espacios sobrantes bajo el *footer* o descuadres en listados).
- **Reflows Asesinos (Rendimiento):** Buscamos operaciones pesadas que estrangulen el hilo principal de renderizado (Forced Reflows). Auditad exhaustivamente cualquier manipulador de scroll, detectores de intersección o \`useEffect\` masivo y dad la solución directa (*debouncing, requestAnimationFrame*, o rediseño reactivo leve).

**3. PROTOCOLO DE CONTESTACIÓN:**
1. Sed crudos y directos. Si encontráis basura, apuntad a la yugular del código.
2. Anotad siempre vuestra recomendación escribiendo el bloque de código final resultante listo para ser inyectado.
3. No recomendéis rediseños gigantes de arquitecturas, limitaros a parches quirúrgicos sobre nuestra base.

---
### 🖥️ CÓDIGO FUENTE ADJUNTO PARA LA AUDITORÍA
(Analizad los siguientes fragmentos de los componentes estructurales)

`;

for (const f of files) {
  content += `\n\n========================================\n`;
  content += `### ARCHIVO: ${f}\n`;
  let lang = f.endsWith('.jsx') ? 'jsx' : f.endsWith('.css') ? 'css' : 'javascript';
  content += `\n\`\`\`${lang}\n`;
  if (fs.existsSync(f)) {
    content += fs.readFileSync(f, 'utf-8');
  } else {
    content += `// ATENCIÓN: El archivo ${f} no se detecta.\n`;
  }
  content += `\`\`\`\n`;
}

fs.writeFileSync('auditories/SUPER_PROMPT_TANDA_1.md', content, 'utf-8');
console.log('¡Súper Prompt Generado Correctamente en auditories!');
