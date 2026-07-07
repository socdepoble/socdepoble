// _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/escriptura-protegida.js
// WRAPPER D'ESCRIPTURA (SISTEMA DE BLOQUEIG TOTAL)
// Aquest script encapsula l'operació d'escriptura al sistema d'arxius, obligant
// a qualsevol altre procés a passar pel sedàs termodinàmic abans de persistir.

const fs = require('fs').promises;
const path = require('path');
const { isValid, normalize } = require('./termodinamic.cjs');
const { execSync } = require('child_process');

const WIKI_DIR = path.resolve(__dirname, '..', '..');

/**
 * Funció d'escriptura segura que substitueix l'escriptura directa.
 * @param {string} filePath - Ruta destí.
 * @param {string} content - Contingut de l'arxiu.
 * @param {object} options - Opcions de fs.writeFile.
 */
async function writeFileProtected(filePath, content, options = 'utf8') {
  // 1. Validar que estem escrivint dins del domini de la Wiki
  if (!path.resolve(filePath).startsWith(WIKI_DIR)) {
    return fs.writeFile(filePath, content, options);
  }

  const fileName = path.basename(filePath);
  const relativePath = path.relative(WIKI_DIR, filePath);

  // 2. Comprovar si el nom és vàlid termodinàmicament (excepte excepcions)
  if (fileName.endsWith('.md') && fileName !== 'README.md' && fileName !== '00_index.md' && fileName !== 'SKILL.md') {
    if (!isValid(fileName)) {
      console.warn(`[WARN] Escriptura de ${fileName} interceptada. El nom no és termodinàmic.`);
      
      // En lloc de bloquejar de manera rígida, aplicarem el principi de forçament mecànic:
      // Calculem el nom correcte automàticament i ho guardem amb aquest nom.
      const correctedName = normalize(fileName, content);
      const newPath = path.join(path.dirname(filePath), correctedName);
      
      console.log(`[FIX] Renomenant automàticament a: ${correctedName}`);
      await fs.writeFile(newPath, content, options);
      return newPath;
    }
  }

  // 3. Validació de Duplicitats (pre-commit hook style)
  // Això s'executaria si tenim l'script detect_duplicates.js adaptat per funcionar en mode --check
  try {
    // execSync(`node ${path.join(WIKI_DIR, '02_ACTUAR_Maquina_Tecnica/scripts/detect_duplicates.cjs')} --check "${filePath}"`);
  } catch (err) {
    throw new Error(`❌ [FATAL ERROR] Duplicitat semàntica detectada abans d'escriure.`);
  }

  // 4. Escriptura nativa si tot és correcte
  await fs.writeFile(filePath, content, options);
  return filePath;
}

module.exports = {
  writeFile: writeFileProtected
};
