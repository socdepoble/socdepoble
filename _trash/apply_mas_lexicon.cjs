const fs = require('fs');
const path = require('path');

const files = [
  'src/data/SkillsContent.js',
  'src/data/SkillsExtensivesContent.js',
  'src/data/index.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to avoid replacing within code snippets like `iniciaMasía()` or `masiaCore`.
  // A simple heuristic: if "masia" is preceded or followed by a letter (a-zA-Z) without space, it's a camelCase code variable.
  // We will use a regex that only matches standalone words (with spaces or punctuation around).
  
  // Custom word boundary for "masia" and "masía" (case insensitive)
  const regex = /(^|[^a-zA-Z0-9_])(Masia|Masía|masia|masía)([^a-zA-Z0-9_]|$)/gi;
  
  // Replace logic
  content = content.replace(regex, (match, p1, p2, p3) => {
    // If it's part of a URL or code like `masia-` or `/masia/`, leave it if we want, but user said "donde ponga masía".
    // Let's replace "masia" -> "mas" and "Masia" -> "Mas".
    let replacement = p2.toLowerCase().startsWith('m') ? (p2[0] === 'M' ? 'Mas' : 'mas') : 'mas';
    return p1 + replacement + p3;
  });

  // Now fix articles:
  // "la Mas" -> "el Mas"
  // "La Mas" -> "El Mas"
  // "de la Mas" -> "del Mas"
  // "a la Mas" -> "al Mas"
  content = content.replace(/\bla Mas\b/g, "el Mas");
  content = content.replace(/\bLa Mas\b/g, "El Mas");
  content = content.replace(/\bde la Mas\b/g, "del Mas");
  content = content.replace(/\ba la Mas\b/g, "al Mas");
  content = content.replace(/\bA la Mas\b/g, "Al Mas");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
