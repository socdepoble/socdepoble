/**
 * 🏺 CASA NETA AUDIT: L'Instint del Mestre [v10.33.3]
 * Comprova la integritat del Mas abans de la migració de dades.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const REQUIRED_HINTS = [
    { file: 'index.html', pattern: 'v10.33.3-CANÒNIC' },
    { file: 'package.json', pattern: '"version": "10.33.2"' },
    { file: 'src/constants.js', pattern: 'APP_VERSION = "v10.33.3-CANÒNIC"' }
];

const GHOSTS = [
    'vercel.json',
    '.vercel',
    'dist/.vercel'
];

async function runAudit() {
    console.log('\n🏺 --- INICIANT AUDITORIA CASA NETA --- 🏺\n');
    let issues = 0;

    // 1. Verificació de Versions
    console.log('🔍 Verificant unificació de doctrina (v10.33.3)...');
    for (const hint of REQUIRED_HINTS) {
        const filePath = path.join(root, hint.file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(hint.pattern)) {
                console.log(` ✅ ${hint.file}: OK`);
            } else {
                console.error(` ❌ ${hint.file}: Versió desfasada!`);
                issues++;
            }
        } else {
            console.error(` ❌ ${hint.file}: No trobat!`);
            issues++;
        }
    }

    // 2. Caça de Fantasmes
    console.log('\n👻 Buscant fantasmes de Vercel...');
    for (const ghost of GHOSTS) {
        const ghostPath = path.join(root, ghost);
        if (fs.existsSync(ghostPath)) {
            console.error(` ❌ DETECTAT: ${ghost} (Cal purgar)`);
            issues++;
        } else {
            console.log(` ✅ ${ghost}: LLIURE`);
        }
    }

    // 3. Verificació d'Assets
    const distIndex = path.join(root, 'dist', 'index.html');
    if (fs.existsSync(distIndex)) {
        const content = fs.readFileSync(distIndex, 'utf8');
        if (content.includes('v10.33.2')) {
            console.log(' ✅ dist/index.html: BATEGANT (v10.33.2)');
        } else {
            console.warn(' ⚠️  dist/index.html: Té una versió antiga. Cal fer "npm run build".');
            issues++;
        }
    }

    console.log('\n--- RESULTAT DE L\'AUDITORIA ---');
    if (issues === 0) {
        console.log('✨ EL MAS ESTÀ IMMACULAT. Procediu amb la Sincronització Sobirana.\n');
    } else {
        console.error(`🚨 S'HAN TROBAT ${issues} INCIDÈNCIES. L'IAIA demana correcció.\n`);
    }
}

runAudit();
