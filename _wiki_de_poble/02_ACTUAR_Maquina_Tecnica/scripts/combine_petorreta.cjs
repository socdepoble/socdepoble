const fs = require('fs');
const path = require('path');

const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0705_PROMPT_Petorreta_Taxonomica_i_Glossari.md';
const bundlePath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/260705T0_0510_BUNDLE_Wiki_Completa.md';
const outputPath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/bancal_actiu/260705_0715_PETORRETA_TAXONOMICA_FINAL.md';

const promptContent = fs.readFileSync(promptPath, 'utf8');
const bundleContent = fs.readFileSync(bundlePath, 'utf8');

const combinedContent = promptContent + '\n\n' + bundleContent;

fs.writeFileSync(outputPath, combinedContent, 'utf8');
console.log('✅ Petorreta Final generada a: ' + outputPath);
