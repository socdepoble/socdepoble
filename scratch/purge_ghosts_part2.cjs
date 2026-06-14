const fs = require('fs');
const path = require('path');

const TARGET_FILES = [
  'src/data/SkillsContent.js',
  'src/data/SkillsExtensivesContent.js',
  'src/data/GenotipContent.js',
  'src/data/ConstitucioContent.js',
  'src/data/HumanProjectContent.js',
  'src/data/VersionsContent.js'
];

const GHOST_CLASSES_TO_REMOVE = [
  'shadow-lg', 'border-theme-border', 'rounded-2xl', 'my-8', 
  'border-gray-700/50', 'border-b', 'bg-black/20', 'border-collapse', 
  'divide-y', 'divide-gray-800/30', 'overflow-x-auto', 'my-4', 'rounded-lg', 
  'border-white/10', 'text-left', 'max-w-4xl'
];

const ROOT_DIR = path.join(__dirname, '..');

for (const relPath of TARGET_FILES) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  // We want to replace these classes inside class="..." or className="..."
  for (const ghost of GHOST_CLASSES_TO_REMOVE) {
    // Regex explanation: Match class=" or className=" then anything up to the ghost class, then replace the ghost class
    // Doing a simple replace is safer: we find the class and replace it with space
    const regex = new RegExp(`\\b${ghost.replace(/\\//g, '\\\\/')}\\b`, 'g');
    content = content.replace(regex, '');
  }

  // Cleanup multiple spaces in class="  " and empty class=""
  content = content.replace(/class(?:Name)?="([^"]*)"/g, (match, p1) => {
    let cleaned = p1.replace(/\s+/g, ' ').trim();
    if (cleaned === '') return '';
    return match.startsWith('className') ? `className="${cleaned}"` : `class="${cleaned}"`;
  });

  // Remove empty class="" attributes entirely
  content = content.replace(/\s+class(?:Name)?=""/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Cleaned ghosts from: ${relPath}`);
  }
}

console.log("Ghost class purge completed.");
