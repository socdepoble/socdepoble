const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const OUTPUT_CSV = path.join(__dirname, '../docs/auditories/20260622_ghost_audit.csv');

// Regex patterns to find ghosts
const GHOST_PATTERNS = {
  ghostVariables: /var\(--sp-(void|light|accent)\)/g,
  bootstrapLegacy: /sticky-top|lead|text-muted/g,
  divSoup: /<div[^>]*>\s*<div[^>]*>/g,
  universalPageLayout: /UniversalPageLayout/g,
  hardcodedColors: /bg-\[#[0-9A-Fa-f]{3,6}\]|text-\[#[0-9A-Fa-f]{3,6}\]/g,
  dangerousScroll: /overflow-hidden|h-screen|100dvh/g,
  inlineStyles: /style\s*=\s*[{'"]/g,
  inlineEvents: /onClick\s*=\s*[{'"]/g,
  importantCss: /!important/g,
  tailwindResidue: /className\s*=\s*["'][^"']*(bg-|text-|p-|m-|shadow-|w-|h-|flex|grid|gap-)/g,
};

// Helper to walk directories
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const results = [];

// Ensure output directory exists
const outDir = path.dirname(OUTPUT_CSV);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Iniciant auditoria forense de fantasmes...');

walkDir(SRC_DIR, (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(SRC_DIR, filePath);
  const componentName = path.basename(filePath, '.jsx');
  
  // Count divs as a rough measure of DOM depth
  const divCount = (content.match(/<div/g) || []).length;
  
  let issuesFound = [];
  
  for (const [issueName, regex] of Object.entries(GHOST_PATTERNS)) {
    const matches = content.match(regex);
    if (matches) {
      // Deduplicate matches to just count occurrences of issue type
      issuesFound.push(`${issueName} (${matches.length}x)`);
    }
  }

  // Calculate "Flattening Score": High div count + UniversalPageLayout = high priority for flattening
  let priority = 'Baixa';
  if (issuesFound.some(i => i.includes('universalPageLayout'))) priority = 'CRÍTICA';
  else if (issuesFound.length > 0 && divCount > 5) priority = 'Mitja';
  else if (issuesFound.length > 0) priority = 'Alta';

  results.push({
    Component: componentName,
    Path: relativePath,
    DivCount: divCount,
    Ghosts: issuesFound.length > 0 ? issuesFound.join(' | ') : 'Net',
    Priority: priority
  });
});

// Sort results by Priority and DivCount
results.sort((a, b) => {
  if (a.Priority === 'CRÍTICA' && b.Priority !== 'CRÍTICA') return -1;
  if (a.Priority !== 'CRÍTICA' && b.Priority === 'CRÍTICA') return 1;
  return b.DivCount - a.DivCount;
});

// Write CSV
const csvHeaders = ['Component', 'Path', 'Div Count', 'Ghosts Detected', 'Action Priority'].join(';');
const csvRows = results.map(r => `${r.Component};${r.Path};${r.DivCount};${r.Ghosts};${r.Priority}`);
fs.writeFileSync(OUTPUT_CSV, [csvHeaders, ...csvRows].join('\n'));

console.log(`Auditoria completada. S'han analitzat ${results.length} fitxers.`);
console.log(`Resultats guardats a: ${OUTPUT_CSV}`);
