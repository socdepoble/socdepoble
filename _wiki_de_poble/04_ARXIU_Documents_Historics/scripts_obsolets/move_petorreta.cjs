const fs = require('fs');
const path = require('path');

const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0705_PROMPT_Petorreta_Taxonomica_i_Glossari.md';
const bundlePath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/260705T0_0510_BUNDLE_Wiki_Completa.md';
const oldFinalPath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/bancal_actiu/260705_0715_PETORRETA_TAXONOMICA_FINAL.md';

const artifactOutputPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0725_PETORRETA_AMB_BUNDLE.md';

const promptContent = fs.readFileSync(promptPath, 'utf8');
const bundleContent = fs.readFileSync(bundlePath, 'utf8');

const combinedContent = promptContent + '\n\n' + bundleContent;

// No cal escriure l'ArtifactMetadata a dins del fitxer de text si no usem l'eina, però si l'escrivim, eixirà.
fs.writeFileSync(artifactOutputPath, combinedContent, 'utf8');

// Esborrem les escombraries de la Wiki (Bundle i Final antics)
if (fs.existsSync(bundlePath)) fs.unlinkSync(bundlePath);
if (fs.existsSync(oldFinalPath)) fs.unlinkSync(oldFinalPath);
// També esborrem qualsevol altre bundle vell
const regDir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/';
fs.readdirSync(regDir).forEach(file => {
  if (file.includes('BUNDLE_Wiki')) fs.unlinkSync(path.join(regDir, file));
});

console.log('✅ Petorreta Mestra creada com a Artefacte a: ' + artifactOutputPath);
