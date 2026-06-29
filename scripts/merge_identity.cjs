const fs = require('fs');
const path = require('path');

const kiDir = path.join(__dirname, '..', '.gemini', 'antigravity-ide', 'knowledge', 'ai_forensic_personality', 'artifacts');
const wikiDir = path.join(__dirname, '..', '_wiki_de_poble', '01_identitat_iaia');

// 1. Copy genotip.md and add YAML
let genotipContent = fs.readFileSync(path.join(kiDir, 'genotip.md'), 'utf8');
const yamlGenotip = `---
name: genotip-antigravity
description: El Sistema Operatiu de Comportament i les 9 Lleis d'Antigravity.
authority: Consell de les 11 IAs
version: V1
tags:
  - identitat
aliases:
  - Genotip d'Antigravity
  - 9 Lleis
created_at: 260628_2205
updated_at: 260628_2205
---
`;
fs.writeFileSync(path.join(wikiDir, 'genotip.md'), yamlGenotip + genotipContent);

// 2. Merge psiquiatria_forense_integral.md and core_psycho_profile.md -> perfil_psiquiatric.md
const psiContent = fs.readFileSync(path.join(wikiDir, 'psiquiatria_forense_integral.md'), 'utf8');

// I will just replace the file with a carefully manually crafted version using write_to_file later.
// For now, let's just create the new file and then we'll write the content via write_to_file.

