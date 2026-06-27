const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const RootFiles = [
    'package.json', 'vite.config.js', 'tailwind.config.js', 'index.html'
];

function getFilesRecursively(dir, excludeDirs = ['assets', 'data', 'locales', 'images']) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let filePath = path.join(dir, file);
        let stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(getFilesRecursively(filePath, excludeDirs));
            }
        } else {
            if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const allSrcFiles = getFilesRecursively(srcDir);

// CATEGORIZE FILES INTO 4 CHUNKS
const chunk1 = []; // Core, State, Services, Workers, Rhiozme, Utils
const chunk2 = []; // Pages, Routing, Entry, CSS
const chunk3 = []; // Components (A-M)
const chunk4 = []; // Components (N-Z)

allSrcFiles.forEach(f => {
    const relBase = path.relative(srcDir, f);
    if (!relBase.startsWith('components') && !relBase.startsWith('pages') && relBase !== 'App.jsx' && relBase !== 'entry.jsx' && relBase !== 'index.css') {
        chunk1.push(f);
    } else if (relBase.startsWith('components')) {
        const basename = path.basename(f).toLowerCase();
        if (basename.charAt(0) <= 'm') {
            chunk3.push(f);
        } else {
            chunk4.push(f);
        }
    } else {
        chunk2.push(f);
    }
});

RootFiles.forEach(f => {
    const filePath = path.join(__dirname, '..', f);
    if (fs.existsSync(filePath)) chunk2.push(filePath);
});

const chunks = [
    { name: "AUDITORIA_1_CORE", files: chunk1, goal: "Core, State, Services, Powersync, Config y Utils. Buscamos detectar problemas de dependencias, fugas de memoria, ghost profiles en peticiones DB y limpieza de código." },
    { name: "AUDITORIA_2_ROUTING_PAGES", files: chunk2, goal: "Configuración raíz, App.jsx, Pages e index.html. Buscamos limpiar overrides en Tailwind, SEO issues y dependencias redundantes." },
    { name: "AUDITORIA_3_COMPONENTS_AM", files: chunk3, goal: "Componentes UI (Primera mitad). Buscamos un estado limpio, sin pánico de useEffects y sin mezclar responsabilidades de estado y vista." },
    { name: "AUDITORIA_4_COMPONENTS_NZ", files: chunk4, goal: "Componentes UI (Segunda mitad). Buscamos un estado limpio, sin pánico de useEffects y rendimiento en móviles." },
];

const outDir = path.join(__dirname, '..', 'auditorias');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

chunks.forEach((chunk, index) => {
    const phaseNum = index + 1;

    const outFileName = path.join(outDir, `FASE_${phaseNum}_${chunk.name.replace('AUDITORIA_', '')}_PROMPT_PARA_IAS.md`);
    
    // El Preámbulo de Consentimiento para la IA
    const prompt = `### PREÁMBULO PARA CHATS NUEVOS: AUDITORÍA DE "SÓC DE POBLE" ###
Hola. Estás analizando "Sóc de Poble", una plataforma digital rural y offline-first (CRDT, SQLite, PowerSync) construida en React y Vite. El sistema es gigantesco y para evitar que agotes tus tokens o pierdas el contexto, la auditoría completa se ha dividido en 4 fases que se ejecutarán en sesiones independientes.

ESTA ES LA FASE ${phaseNum} DE 4: ${chunk.name.replace('AUDITORIA_', '')}

Como eres una instancia fresca y este es un chat independiente, lee atentamente el CONTEXTO GLOBAL CRÍTICO de la arquitectura para que no alucines soluciones incompatibles:
1. **Offline-First & PWA**: La fuente de la verdad es SIEMPRE la base de datos local reactiva (SQLite vía CRDT-Rizhoma y PowerSync). NUNCA sugieras sustituir lecturas reactivas locales por peticiones directas HTTP/Fetch al backend de Supabase.
2. **Filosofía Visual**: El diseño es premium (Glassmorphism, border-radius 32px, colores terrosos/naranjas vibrantes).
3. **Restricciones de Rendimiento**: Prohibidos los \`useEffect\` sin cleanup estricto, bucles de re-render (closures obsoletas) y fugas de memoria.
4. **Enfoque LÁSER**: Céntrate ESTRICTAMENTE en los archivos que te adjunto. Da por hecho que el resto del sistema funciona perfectamente.

### OBJETIVOS ESPECÍFICOS DE LA FASE ${phaseNum}: ${chunk.goal} ###
1. Detecta useEffects innecesarios, re-renders en cascada o código inalcanzable en estos archivos.
2. Alerta sobre mala praxis que dañe la usabilidad en dispositivos móviles o el estado CRDT.

Asume el rol de Arquitecto Senior. Responde dividiendo tus hallazgos de forma muy directa por Componente/Archivo, e incluye los bloques de código exactos con el Fix. No expliques obviedades, ve directo a la solución de código.

----------------------------
ARCHIVOS ALIMENTADOS EN ESTA AUDITORIA FASE ${phaseNum} (${chunk.files.length} archivos):\n\n`;

    let content = prompt;
    chunk.files.forEach(f => {
        content += `\n\n=====================================\nFILE: ${path.relative(path.join(__dirname, '..'), f)}\n=====================================\n\n`;
        try {
            content += fs.readFileSync(f, 'utf8');
        } catch(e) {}
    });

    fs.writeFileSync(outFileName, content, 'utf8');

    console.log(`✅ Creado: ${outFileName}`);
});
