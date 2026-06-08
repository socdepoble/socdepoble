/**
 * SOSP Tailwind Scanner
 * Genera un report de components React que incompleixen la Constitució SOSP.
 * Prohibicions: bg-*, text-*, rounded-*, shadow-* en fitxers .jsx dins de src/components/ui
 */

const fs = require('fs');
const path = require('path');

const FORBIDDEN_PATTERNS = [
  /bg-(?!transparent|none)\S+/,
  /text-(?!center|left|right|justify)\S+/, // Prohibeix text-white, text-[#FFF], però permet text-center
  /rounded-\S+/,
  /shadow-\S+/,
];

function scanDirectory(directory, results = []) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath, results);
    } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      const violations = [];
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        FORBIDDEN_PATTERNS.forEach(pattern => {
          const match = line.match(pattern);
          if (match && !line.includes('eslint-disable')) {
            violations.push({ line: index + 1, match: match[0], content: line.trim() });
          }
        });
      });

      if (violations.length > 0) {
        results.push({ file: fullPath, violations });
      }
    }
  }

  return results;
}

const targetDir = path.join(__dirname, '../src');
console.log('🔍 Iniciant l\'escàner de Tailwind tòxic a', targetDir);

const violations = scanDirectory(targetDir);

if (violations.length === 0) {
  console.log('✅ Cap violació trobada. La base de codi compleix la Constitució.');
} else {
  let report = '# 🚨 Tailwind Usage Report (Violacions SOSP)\n\n';
  report += 'Les següents classes Tailwind estètiques estan prohibides per la Constitució SOSP:\n\n';

  let count = 0;
  violations.forEach(v => {
    report += `### ${v.file.replace(path.join(__dirname, '../'), '')}\n`;
    v.violations.forEach(violation => {
      report += `- **Línia ${violation.line}**: \`${violation.match}\` -> ${violation.content}\n`;
      count++;
    });
    report += '\n';
  });

  const reportPath = path.join(__dirname, '../tailwind_report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`❌ S'han trobat ${count} violacions en ${violations.length} fitxers.`);
  console.log(`📄 Report generat a: ${reportPath}`);
}
