import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

/**
 * [SKILL: ESTILO-MARCA (Llei de la Boina Taronja)]
 * Aquest script rastreja i esporga classes genèriques de Tailwind,
 * substituint-les per l'estètica Premium de Sóc de Poble:
 * 1. Radis: `rounded-[28px]` per a tot allò gros, `rounded-[20px]` per menut.
 * 2. Colors: Generics `bg-white` a `bg-[#111827] border-white/10`.
 * 3. Ombres i Marges estandarditzats.
 */

const targetDirs = [
    path.join(srcDir, 'components'),
    path.join(srcDir, 'pages')
];

let filesChanged = 0;
let replacementsMade = 0;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

function processContent(content) {
    let newContent = content;
    let localReplacements = 0;

    // RULE 1: Bancal Mode Geometry (Radii 28px)
    // Busquem patron com rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl
    const borderRadRegex = /(?<=className=["'`][^"'`]*?)(rounded-md|rounded-lg|rounded-xl|rounded-2xl|rounded-3xl|rounded-full\b(?! cursor| shrink| text|\s*w-|\s*h-))(?!]|\[)(?=[^"'`]*?["'`])/g;
    
    newContent = newContent.replace(borderRadRegex, (match) => {
        localReplacements++;
        // Si és rounded-md o lg (molt chicotet), posem 20px, la resta (xl, 2xl, 3xl) la roca 28px.
        // Ignorem rounded-full si és un avatar/icona petita (tractat pel regex negatiu rudimentàriament)
        if (match === 'rounded-md' || match === 'rounded-lg') return 'rounded-[20px]';
        return 'rounded-[28px]';
    });

    // RULE 2: Premium Dark Aesthetics
    // Lliurem de fons blancs absoluts genèrics si no són expressament text o botons xicotets.
    const bgWhiteRegex = /(?<=className=["'`][^"'`]*?)\bbg-white\b(?!\/)(?=[^"'`]*?(?:shadow-|p-4|p-6|rounded-))(?!.*text-black)(?=[^"'`]*?["'`])/g;
    newContent = newContent.replace(bgWhiteRegex, () => {
        localReplacements++;
        return 'bg-[#111827] text-white border border-white/10';
    });

    // RULE 3: Forçar taronja corporatiu en lloc de random blues (opcional per components importats ràpidament)
    const blurRegex = /(?<=className=["'`][^"'`]*?)\b(?:text-blue|bg-blue|border-blue)-(500|600)\b(?=[^"'`]*?["'`])/g;
    newContent = newContent.replace(blurRegex, (match) => {
        localReplacements++;
        return match.replace(/blue/, 'orange'); // orange-500, orange-600
    });

    return { newContent, localReplacements };
}


function runAutorevision() {
    console.log("🍊 Iniciant Protocol ESTILO-MARCA (Llei de la Boina Taronja)...");
    
    targetDirs.forEach(dir => {
        if (!fs.existsSync(dir)) return;
        
        const files = walk(dir);
        files.forEach(filePath => {
            const content = fs.readFileSync(filePath, 'utf8');
            const { newContent, localReplacements } = processContent(content);
            
            if (localReplacements > 0) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`✅ Actuant sobre: ${path.basename(filePath)} (${localReplacements} ajustos de disseny)`);
                filesChanged++;
                replacementsMade += localReplacements;
            }
        });
    });

    console.log("-----------------------------------------");
    console.log(`🎉 Protocol completat:`);
    console.log(`   Fitxers auditats i corregits: ${filesChanged}`);
    console.log(`   Estils genèrics eliminats: ${replacementsMade}`);
    console.log(`   El Bancal Mode ha estat restaurat massivament.`);
    console.log("-----------------------------------------");
}

runAutorevision();
