#!/usr/bin/env node
/**
 * L'EMBUT TERMODINÀMIC (Git Pre-commit Hook)
 * Arquitectura Pedra Seca - V5.0.2 (Entropia Zero)
 * Propòsit: 
 * 1. Rebutjar qualsevol fitxer que no complisca el frontmatter canònic.
 * 2. Assegurar que els fitxers fora de TAULA_ACTIVA estan a la seua carpeta correcta.
 * 3. Actualitzar 'updated_at' automàticament.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = require('../scripts/entropia_zero_router.js');

const TAULA_ACTIVA_DIR = '80_produccio/_TAULA_ACTIVA/';

if (process.env.BYPASS_PEDRA_SECA === '1') {
  console.log('⚠️ [EMBUT TERMODINÀMIC] - Bypass humà activat. La responsabilitat és teua, Mestre.');
  process.exit(0);
}

// Funció per extreure i modificar frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const yamlLines = match[1].split('\n');
    const fm = {};
    for (const line of yamlLines) {
        if (!line.includes(':')) continue;
        const [key, ...rest] = line.split(':');
        let value = rest.join(':').trim();
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.substring(1, value.length - 1).split(',').map(s => s.trim()).filter(Boolean);
        } else if (!isNaN(value) && value !== '') {
            value = Number(value);
        } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        fm[key.trim()] = value;
    }
    return { fm, fullMatch: match[0], content };
}

function updateFrontmatter(filePath, parsed) {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${yy}${mm}${dd}_${hh}${min}`;

    if (parsed.fm.updated_at !== timestamp) {
        const newYaml = parsed.fullMatch.replace(/updated_at:.*$/m, `updated_at: ${timestamp}`);
        const newContent = parsed.content.replace(parsed.fullMatch, newYaml);
        fs.writeFileSync(filePath, newContent, 'utf8');
        execSync(`git add "${filePath}"`);
        return true;
    }
    return false;
}

try {
  const diffOutput = execSync('git diff --cached --name-status', { encoding: 'utf8' });
  if (!diffOutput.trim()) process.exit(0);

  const lines = diffOutput.trim().split('\n');
  let errors = [];

  for (const line of lines) {
    const parts = line.split('\t');
    const status = parts[0];
    const filePath = parts[parts.length - 1]; 

    // Només ens importen els Markdowns
    if (!filePath.endsWith('.md')) continue;
    if (status.startsWith('D')) continue; // Ignorar esborrats

    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseFrontmatter(content);

    if (!parsed) {
        errors.push(`❌ ${filePath} - No té frontmatter vàlid.`);
        continue;
    }

    // Actualitzar updated_at si cal
    updateFrontmatter(filePath, parsed);

    // Validar frontmatter
    const fmErrors = router.validarFrontmatter(parsed.fm);
    if (fmErrors.length > 0) {
        errors.push(`❌ ${filePath} - Errors al frontmatter:\n  - ${fmErrors.join('\n  - ')}`);
    }

    // Validar Enrutament
    if (!filePath.startsWith(TAULA_ACTIVA_DIR)) {
        const destiCorrecte = router.determinarCarpeta(parsed.fm);
        if (!filePath.startsWith(destiCorrecte)) {
            errors.push(`❌ ${filePath} - Fora de lloc. Segons el seu frontmatter, hauria d'estar a '${destiCorrecte}'.`);
        }
    }
  }

  if (errors.length > 0) {
    console.error('\n🚨 [EMBUT TERMODINÀMIC] - VIOLACIÓ DE L\'ENTROPIA ZERO 🚨');
    errors.forEach(e => console.error(e));
    console.error(`\nSolució: Revisa el frontmatter o mou el fitxer a la ruta correcta.`);
    console.error('El Trellat no negocia. Commit avortat.\n');
    process.exit(1);
  }

  console.log('✅ [EMBUT TERMODINÀMIC] - Entropia sota control. Zero fuites.');
  process.exit(0);

} catch (error) {
  console.error('Error executant l\'Embut Termodinàmic:', error.message);
  process.exit(1);
}
